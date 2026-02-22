
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
//   C L O C K , comes on the welcome screen and as a screensaver
//

function C_iCLOCK(correlator, callbacks, preset) { // correlators should be unique, or you will randomly mix your timers
		const defaults = new A_df( { pace:60, timer:1, unregisterable:true } );
	this.state = defaults.align(preset=(preset||{}));
	this.callbacks = callbacks; // like { ontick:ontick }
	C_iCLOCK.register[correlator] = this;
}
C_iCLOCK.prototype = {
	replay: function() { 
		this.state.timer = this.state.pace;
	} // 
};
C_iCLOCK.register = new Array(); 


C_iCLOCK.unregister = function(c) {
	if(c in C_iCLOCK.register) // c is the correlator
		delete C_iCLOCK.register[c];
};
(C_iCLOCK.reset = function() { 
	const corrs = new Array(); for(let c in C_iCLOCK.register) corrs.push(c);
	for(let i in corrs) {
		const c = corrs[i];
		if(C_iCLOCK.register[c].state.unregisterable) // some constant app organs should never be removed from here
			C_iCLOCK.unregister(c);
	}
})();
C_iCLOCK.tick = function() { 
	setTimeout(C_iCLOCK.tick, 1000); // keep this above for a more precise tempo
	const jsd = new Date();
	const timecss = C_iCLOCK.timecss(jsd);
	for(let c in C_iCLOCK.register) {
		const client = C_iCLOCK.register[c];
		if(!--client.state.timer) { 
			// console.log('C_iCLOCK.register['+c+'] pace = '+client.state.pace+', this.state.timer = '+client.state.timer);
			client.state.timer = client.state.pace; 
			client.callbacks.ontick.cb(jsd,timecss); // (*clk01*)
			// one callback every pace cycle, passing js date object and css string smth like 'h02 m36 s44'
		}
	}
}; 
setTimeout(C_iCLOCK.tick, 1000);
C_iCLOCK.timecss = function(jsdate) {	
		const h = jsdate.getHours()%12;
		const m = jsdate.getMinutes();
		const s = jsdate.getSeconds(); // ranges [0,59]
	
	return { hours:h, minutes:m, seconds:s };
}


///////////////////////////////////////////////////////////////////////////////
//
//  This one uses C_iCLOCK to animate the clock arrows in the middle of a huge Mobminder logo
//

C_iCLOCK.display = function(eid, options) { // see (*cl01*)
	options = options || {};
	this.eids = { clock:eid+'_clk' };
	this.elements = new A_el();
}
C_iCLOCK.display.prototype = {
	html: function(emsize) {
		emsize = emsize||8;
				const inner = '<div class="mobseconds"><div class="mobsides o3-9"><div class="mobsides o6-12"></div></div></div>';
			const clock = '<div id="'+this.eids.clock+'" class="mobclock">'+inner+'</div>';
			const logo = '<div class="C_iCLOCK moblogo-em" style="font-size:'+emsize+'em; pointer-events:none;">'+clock+'</div>';
		return logo;
	},
	activate: function() {
		this.elements.collect(this.eids);
		new C_iCLOCK(this.eids.clock, { ontick:new A_cb(this, this.tick) }, { pace:1, unregisterable:false } ); // internal clock that pushes the clock arrows
	},
	tick: function(jsdate, timecss) { // (*clk01*) pushing the clock arrows
			const hrotate = ((timecss.hours*30)+((timecss.minutes/12)|0)*6)+'deg';
			const mrotate = timecss.minutes*6+'deg';
			const srotate = timecss.seconds*6+'deg';
		this.elements.clock.style.setProperty('--hours-rotation',hrotate);
		this.elements.clock.style.setProperty('--minutes-rotation',mrotate);
		this.elements.clock.style.setProperty('--seconds-rotation',srotate);
	},
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R U L E R   S L I C E
//
function P_SLICE(eid, seconds) {
	this.cue = seconds;
	this.eids = { eid:eid, th:eid+'_'+seconds, ts:eid+'_'+seconds+'_timestamp', thdiv:eid+'_'+seconds+'_thdiv', th2:false, th3:false, tf:false }; // an additional element might come here, see (*ps02*)
	this.elements = new A_el();
	this.metric = { position:0, size:0 }
	
	this.h = Math.floor(seconds / 3600);
	this.m = Math.floor((seconds % 3600) / 60);
	
	let h = this.h;
	let m = this.m;
	if(m==5||m==0) m = '0'+m; // left pads the 5 minutes into 05 minutes
	this.hm = h+':'+m;
}
P_SLICE.label = function(inner) { 
	return '<div style="position:relative;"><span class="rel-label" style="position:absolute;">'+inner+'</span></div>'; // must stay absolute otherwise it forces the th height, see planning.css for red-label
}
P_SLICE.prototype = {
	display: function(options) { // options like {eid:'_idle', labels:true, css:'slice-last' }
		options = options || { timestamps:true };
		let dots = options.dots ? '<div class="ruler-dots" style="position:absolute;"></div>' : ''; // to be limited in extend by a relative wrapping div
		
		let eid = this.eids.th;
		if(options.eid) { // multiple display using ids postfixes
			let peid = options.eid; // postfix element id
			eid = eid+peid;
			
			if(this.eids.th2) this.eids.th3 = eid; // this object can be displayed up to 3 times all with different eids (plannings with 3 types of resourcess)
			else this.eids.th2 = eid;
		}
		if(options.feid) { // multiple display using ids postfixes, this option is for a footer ruler
			let peid = options.feid; // postfix element id
			eid = eid+peid;
			this.eids.tf = eid;
		}
		
		let morecss = options.css ? ' '+options.css:'';
		let label = '', m = this.m, h = this.h;
					   
		if(options.labels) { // see (*pr04*) th.timelight div span.rel-label
			label = P_SLICE.label(m?'':(h+'h')); // each o'clock vertical grid stick gets indication of that hour
		}
		
		let css = m ? morecss : 'slice-oclock'+morecss; // prefix with slice-oclock class when m is zero ( e.g. 15h00 )
			css = (m%5 && !!m) ? css : 'slice-'+m+' '+css; // prefix with 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, and o-clock is avoinded by !!m
		
		let time = '';
		if(options.timestamps) {
					if(m==5||m==0) m = '0'+m;
					if(h<10) h = '<span style="visibility:hidden;">0</span>'+h; // keeps the width of the div constant
				let timestamp = h+':'+m; 
				let span = '<span id="'+this.eids.ts+'" class="timestamp" style="position:absolute;">'+timestamp+'</span>';
			time = '<div style="position:relative;">'+span+'</div>'; // this div has no size
		}

		return '<th class="'+css+'" id="'+eid+'">'+dots+label+time+'</th>';
	},
	activate: function() { this.elements.collect(this.eids); return this; },
	timelight: function(onoff) { // turns red the o-clock time (both in horiz and vert modes), see (*pr04*) th.timelight div span.rel-label
		
		// console.log('timelight',onoff,this.cue);
		$(this.elements.th).removeClass('timelight'); if(onoff) $(this.elements.th).addClass('timelight'); 
		$(this.elements.th2).removeClass('timelight'); if(onoff) $(this.elements.th2).addClass('timelight'); 
		$(this.elements.th3).removeClass('timelight'); if(onoff) $(this.elements.th3).addClass('timelight'); 
		$(this.elements.tf).removeClass('timelight'); if(onoff) $(this.elements.tf).addClass('timelight');
				
		return this.hm; // returns the stringy expression of this slice time, e.g. '9:05'
	},
	dotlight: function(onoff) { // horizontal/vertical division line going red when mouse hover happens here
		$(this.elements.th).removeClass('dotlight'); if(onoff) $(this.elements.th).addClass('dotlight');
		$(this.elements.th2).removeClass('dotlight'); if(onoff) $(this.elements.th2).addClass('dotlight');
		$(this.elements.th3).removeClass('dotlight'); if(onoff) $(this.elements.th3).addClass('dotlight');
		
		return this; 
	},
	append: function(html) { $(this.elements.th).append(html); return this; },
	locate: function(o) {
		let jposition = $(this.elements.th).position(); // position() measures versus first relative parent, offset() measures versus screen edge
		switch(o) {
			case planning.horizontal: this.metric.position = jposition.left+1; this.metric.size = $(this.elements.th).width()+1; break;
			case planning.vertical: this.metric.position = jposition.top+1; this.metric.size = $(this.elements.th).height()+1; break;
		}
		this.metric.position = this.metric.position; this.metric.size = this.metric.size;
		return this;
	},
	left: function(seconds) { // returns relative position in pixels for a number of seconds from midnight
		let inscope = seconds-this.cue;
		let left = (inscope*this.metric.size/mobminder.account.secondsPerSlice)|0;
		return this.metric.position+left;
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R U L E R 
//
function P_RULER(eid, preset) { // one instance by planning, display can be mutliple (only one display is activated)
	
	this.eids = { stick:eid+'_stik', time:eid+'_time', style:'ruler_style', rfooter:eid+'_rfooter', sticks:{}, times:{} };
	this.state = P_RULER.defaults.align(preset);
	this.cues = { first:false, last:false, span:false }
	this.elements = new A_el();
	
		const slice 	= mobminder.account.secondsPerSlice;
		
			const marginIn = (this.state.cueIn)?slice:0; // when display range setting is set from midnight, we do not display a lefter edge margin
		const cueIn 	= this.state.cueIn-marginIn;
		
			const marginOut = (this.state.cueOut-86400)?slice:0; // when display range setting is set to midnight, we do not display a righter edge margin
		const cueOut 	= this.state.cueOut+marginOut;
	
	this.register = { slices:new Array(), seconds:new Array(), sequence:new Array() }
		for(let c=cueIn; c<=cueOut; c+=slice) {
			const o = new P_SLICE(eid, c);
			this.register.slices[c] = o; this.register.sequence.push(o);
			for(let s=0; s<slice; s++) this.register.seconds[c+s] = o;
		}
	this.cues.span = (cueOut-cueIn)/slice+1;
	this.cues.first = cueIn;
	this.cues.last = cueOut; // not referenced in this.register.seconds
	this.originPx = 0; // how far this ruler stands from the left screen edge (horizontal) or the top screen edge (vertical)
	this.is = { vertical:(this.state.orientation==planning.vertical) }
	if(!P_RULER.style) {
		$('head').append('<style id="'+this.eids.style+'" type="text/css"></style>');
		P_RULER.style = true;
	}
	new C_iCLOCK(this.eids.stick, { ontick:new A_cb(this, this.tick)}, { pace:10 } ); // updates the position of the blue vertical stick that appears when the current day is displayed (today).
	P_RULER.brothers[eid] = this;
}
P_RULER.style = false;
P_RULER.defaults = new A_df( { orientation:planning.horizontal, stick:true, cueIn:0, cueOut:86400, dohighlight:true } );
P_RULER.brothers = [];

P_RULER.delimiters = new Array();
P_RULER.delimiters[planning.horizontal] = { cell:{open:'',close:''}, frame:{open:'<tr class="ruler h-ruler h-section-header" style="">',close:'</tr>'} };
P_RULER.delimiters[planning.vertical] = { cell:{open:'<tr>',close:'</tr>'}, frame:{open:'',close:''} };

P_RULER.prototype = {
	display: function(options) { // idle is an optional eid postfix, when specified, no dots ans no sticks are displayed
		options = options || {};
		
		// horizontal display returns like <tr> <td></td> <td></td> <td></td> </tr> <= an horizontal time line
		// vertical  display returns like <tr><td></td></tr> <tr><td></td></tr>  <tr><td></td></tr> <= a vertical timeline
		const delimiters = P_RULER.delimiters[this.state.orientation];
		
		let timestick = '';
		if(options.timestick) {
					const seid = this.eids.stick+'_'+options.timestick, teid = this.eids.time+'_'+options.timestick;
				const time = '<span id='+teid+' style="position:relative;">time</span>';
			timestick =  '<div id="'+seid+'" class="time-stick" style="z-index:1; position:absolute;">'+time+'</div>';
			this.eids.sticks[options.timestick] = seid;
			this.eids.times[options.timestick] = teid;
			// in the horizontal planning view with more than one resource type, there is one time stick by section
		}
		
		const cells = new Array(); let xlast = this.register.sequence.length-1;
		for(let x in this.register.sequence) {
			if(x==xlast) options['css'] = 'slice-last';
			const slice = this.register.sequence[x].display(options); // options like {eid:'_idle', labels:true } fall through 
			cells.push(delimiters.cell.open + slice + delimiters.cell.close);
		}
		const htmlfinal = timestick+delimiters.frame.open + cells.join('') + delimiters.frame.close;
		return htmlfinal;
	}, 
	dfooter: function(options) { // footer for the horizontal planning only (that same html is displayed many times, at the bottom of each section)
		options = options || {}; // options example to find here (*pr03*)
		
		// this open: delimiter should not get an id ! it is displayed many times.
		const delimiters = { cell:{open:'',close:''}, frame:{open:'<tr class="ruler h-ruler h-section-footer">',close:'</tr>'} };
		
		const cells = new Array(); let xlast = this.register.sequence.length-1;
		for(let x in this.register.sequence) {
			if(x==xlast) options['css'] = 'slice-last';
			const slice = this.register.sequence[x].display(options); // options like {eid:'_idle', labels:true } falls through 
			cells.push(delimiters.cell.open + slice + delimiters.cell.close);
		}
		const htmlfinal = delimiters.frame.open + cells.join('') + delimiters.frame.close;
		return htmlfinal;
	}, 
	activate: function() {
		this.elements.collect(this.eids);
		for(let s in this.register.slices) this.register.slices[s].activate();
		return this;
	},
	deactivate: function() { // removes red timestick and unregister 
		C_iCLOCK.unregister(this.eids.stick);
		this.stick(false);
	},
	locate: function(pixels) { // records the position of time anchors, also allows to relocate in case of screen re-sizing
		
		// this function must be called when the ruler changes in size (span of a time slice) or when the origin of the portview has changed.
		
			const first = this.register.slices[this.cues.first].elements.th;
		if(!first) return this; // the control was not displayed
		
		if(pixels) { // the height of the column or row width is imposed, and equal to pixel px
				const webkit = 'WebkitAppearance' in document.documentElement.style;
			if(webkit) pixels-=this.register.sequence.length/3; else pixels-=5; 
			const h = (pixels/this.register.sequence.length);
			switch(this.state.orientation) { // set the time division such that the complete planning fits on the screen
				case planning.vertical: 	this.elements.style.innerHTML = 'table.ruler > tbody > tr { height:'+h+'px; }'; break; // when the hvl container div has class "zoom", the height of tr is ruled by the css stylesheet, see (*zm001)
				case planning.horizontal: 	this.elements.style.innerHTML = 'tr.h-ruler th {width:'+h+'px; }'; break;
			}			
		}
		if(vbs) vlog('planning.js','P_RULER', 'locate', 'pixels:'+pixels);
		for(let x in this.register.sequence) this.register.sequence[x].locate(this.state.orientation);
		this.stick(this.state.stick);
		return this;
	},
	dohighlight: function(onoff) {
		this.state.dohighlight = !!onoff;
		return this;
	},
	
	mousecue: function(event) { // matches a mouse event position with a time slice on the ruler
			
			const dbg = false; // activates full algorythm verbose mode to console
			
			// mouse versus screen
			let px = this.is.vertical ? event.pageY : event.pageX; 
			
			if(dbg) console.log('Screen touched at px ='+px+'');
			
			// first time slice lefter (top) edge position versus screen
				let offsetPx = 0;
				let first = this.register.slices[this.cues.first].elements.th;
			if(first.offsetParent)
				do { // when the screen is scrolled, we have to take into account the slided position of the ruler, at every level up to the html element (that is the screen)
					let o = 0, s = 0;
					if(this.is.vertical) { 
						o = first.offsetTop; 
						s = first.scrollTop ? first.scrollTop : first.iscrollTop ? first.iscrollTop : 0;		
					}
					else { 
						o = first.offsetLeft; 
						s = first.scrollLeft ? first.scrollLeft : first.iscrollLeft ? first.iscrollLeft : 0;
					}
					offsetPx += o - s; // relative position to parent DOM element					
					if(dbg) console.log('oftop:'+o+tab+'scroll:'+s+tab+' >> total offset:'+offsetPx+' vs touch:'+(px-offsetPx)+tab+' << el:'+first.id);
					
				} while (first = first.offsetParent);
			
			// the difference gives the exact mouse position refering to the ruler scale
			px -= offsetPx; // px should be zero when you hover the top first (resp left first) time slot. 
		
			
			// now convert pixels into a time reference
			const sequence = this.register.sequence;
			const last = sequence.length-1;
				const pxLast = sequence[last].metric.position, px0 = sequence[0].metric.position;
			if(px>=pxLast) return sequence[last];
			if(px<px0) return sequence[0];
			
			
		// if(vbs) vlog('planning.js','P_RULER', 'mousecue', 'offsetPx:'+offsetPx+', px:'+px+', bottom end:'+px0+', high end:'+pxLast);
		
		const fork = { left:0, right:last, pin:0, set:1 }
		while(fork.set--) { // dichotomous pinpointing
			fork.pin = (fork.right+fork.left)>>1; // set fork half its initial span
			if(px<sequence[fork.pin].metric.position) { fork.right=fork.pin; fork.set++; continue; }
			if(px>=sequence[fork.pin+1].metric.position) { fork.left=fork.pin; fork.set++; continue; }
			
			break;
		}
		
		if(dbg) console.log('==========================='+px+'===='+fork.pin);
		
		return this.register.sequence[fork.pin];
	},
	metric: function(seconds) {
		let trim = '';
		if(this.cues.first==0 && this.cues.last==86400) {
			// do not trim stickers in a 024 display config
		} else {
			if(seconds<this.cues.first) { seconds = this.cues.first; trim = 'trimsoon'; };
			if(seconds>=this.cues.last) { seconds = this.cues.last;  trim = 'trimlate'; };
		}
		const metric = this.register.seconds[seconds].metric;
			metric['css'] = trim;
		return metric; // metric like { size: slice width, position: slice position, css:'trimsoon' }
	},
	timelight: function(cue,e) { // applies to the o'clock label, adding css 'timelight' to the th's, that let it go red
		
		for(let s in this.register.slices) this.register.slices[s].timelight(false);
		if(!this.state.dohighlight) return this;
		
		if(cue) if(oclock(cue) in this.register.slices) { // sets on only the slice corresponding to cue
			this.register.slices[oclock(cue)].timelight(true);
		}
		return this;
	},
	dotlight: function(cue,e) { // applies to the dotted line, adding css 'dotlight' 
		for(let s in this.register.slices) this.register.slices[s].dotlight(false);
		if(!this.state.dohighlight) return this;
		
		if(cue) {
			const slice = this.register.slices[cue].dotlight(true);
			
			if(e) {
					const x = e.pageX - 40; // the half of 80px, see (*ftf01*)
					const y = e.pageY - 50;
					const t = '<div><span>'+slice.hm+'<span></div>';
				mobminder.app.setflyingtimeflag(t, y, x);
			} 
		} else {
			if(cue===false) mobminder.app.setflyingtimeflag(false);
		}
		return this;
	},
	
	// private
	stick: function(onOff) { // enables the stick
		this.state.stick = !!onOff;
		this.tick(new Date());
		if(vbs) vlog('planning.js','P_RULER', 'stick', 'new state:'+this.state.stick);
		return this;
	}, 
	
	// event handling
	tick: function(jsDate) { // sets the position of the present time stick indicator (a blue line in 2025)
		
		const seconds = jsDate.seconds();
		if(vbs) vlog('planning.js','P_RULER', 'tick', 'state:'+this.state.stick+', time:'+time(seconds)+', orientation:'+this.state.orientation+', eid:'+this.eids.stick);
		
		if(!this.elements.sticks) return;
		
		for(let rsctype in this.elements.sticks.get) {
			const s = this.elements.sticks[rsctype]; 
			$(s).hide(); 
		}
		if(!this.state.stick) return; // leaves the stick(s) hidden
		for(let rsctype in this.elements.sticks.get) {
			
			const s = this.elements.sticks[rsctype];
			const t = this.elements.times[rsctype];
			
				const slice = this.register.seconds[seconds]; // selects an o_easySLICE
			if(!slice) return; // time is not in the displayable scope
			
			t.innerHTML = jsDate.HHmm(0,'');
			const pixels = slice.left(seconds);
			switch(this.state.orientation) {
				case planning.vertical: $(s).css({top:pixels, left:0}); break;
				case planning.horizontal: $(s).css({left:pixels, top:0}); break; // see (*pr02*)
			}
			$(s).show();
		}
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   G R I D   T O U C H    // accommodates vertical or horizontal ruler
//
function P_GRID(el, ruler, callbacks, preset) { 
	this.ruler = ruler;
	this.touchy = el;
	this.callbacks = callbacks; // like { touched:o_callback, touching:o_callback }
	this.handlers = new A_hn({
		down:new A_cb(this, this.down), up:new A_cb(this, this.up), move:new A_cb(this, this.move), enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), movesin:new A_cb(this, this.movesin), 
		tstart:new A_cb(this, this.tstart), tend:new A_cb(this, this.tend), tmove:new A_cb(this, this.tmove) });	
	
	if(is.tactile) { el.ontouchstart = this.handlers.tstart; /* el.ontouchmove = this.handlers.tmove; */ el.ontouchend = this.handlers.tend; }
	else $(el).mousedown(this.handlers.down);
	
	let cursor = this.ruler.state.orientation == planning.horizontal ? 'dragging-horizontal' : 'dragging-vertical';
	this.state = { current:false, movesin:false, touchin:false, touchout:false, cursor:cursor, minsize:preset.minsize }
}
P_GRID.dragging = false;
P_GRID.prototype = {
	// public
	copypaste: function(onoff) {
		if(onoff) $(this.touchy).mouseenter(this.handlers.enter).mouseleave(this.handlers.leave);
		else {
			$(this.touchy).unbind('mousemove',this.handlers.movesin).unbind('mouseenter',this.handlers.enter).unbind('mouseleave',this.handlers.leave);
			this.leave();
		}
	},
	
	// event handling for finger
	tstart: function(e) { 
		if(e.touches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault(); let touch = e.touches[0]; 
		return this.down(touch);	
	},
	tmove: function(e) { 
		if(e.touches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault(); let touch = e.touches[0];
		return this.move(touch); 
	},
	tend: function(e) { 
		if(e.changedTouches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault(); let touch = e.changedTouches[0];
		this.up(touch);
	},
	
	// This groups down(), up(), move() is used for down drag drawing
	//
	down: function(e) { 
		let cue = this.state.touchin = this.state.touchout = this.ruler.mousecue(e).cue;
		if(this.state.touchin == this.ruler.cues.last) return true;
		P_GRID.dragging = 1;
		let confirmed = true;
		if(!is.tactile) if(this.callbacks.touching) { 
			confirmed = this.callbacks.touching.cb(this.sort(), P_GRID.dragging, cue);
			this.state.current = cue;
		}
		if(vbs) vlog('planning.js','P_GRID','down','el id:'+this.touchy.id+', confirmed:'+confirmed);
		if(!confirmed) { P_GRID.dragging = false; return true; }
		
		if(this.state.movesin) this.leave(e);
		if(!is.tactile) $(document).mouseup(this.handlers.up).mousemove(this.handlers.move);
		C_iWIN.cursor(this.state.cursor);
		return true;
	},
	up: function(e) {
		if(!P_GRID.dragging) { return true; } // do nothing, another move (like sliding a scroll) has cancelled the single touch
		if(vbs) vlog('planning.js','P_GRID','up','el id:'+this.touchy.id); 
		if(!is.tactile) $(document).unbind('mouseup',this.handlers.up).unbind('mousemove',this.handlers.move);
		C_iWIN.cursor();
		if(this.callbacks.touched) this.callbacks.touched.cb(this.sort(),e);
		P_GRID.dragging = false; this.state.current = false;
		return true;
	},
	move: function(e) { // note that this handler is attached to the document, so once pushed, the mouse pointer can move out of the GRID and the drag process still works
	
		let cue = this.ruler.mousecue(e).cue; 
		if(cue == this.ruler.cues.last) { return true };
		if(this.state.current == cue) return true; else this.state.current = cue;
		if(vbs) vlog('planning.js','P_GRID','move','el id:'+this.touchy.id+', cue:'+cue);
		
		if(P_GRID.dragging) { // triggers the callback ONLY if a new cue is traversed
			P_GRID.dragging = 2;
			this.state.touchout = cue;
			if(this.callbacks.touching) this.callbacks.touching.cb(this.sort(), P_GRID.dragging, cue);
		}
	},
	
	// This group enter(), leave(), movesin() is used for copypaste animation
	//
	enter: function(e) { // for callbacks movesin and movedout
		if(vbs) vlog('planning.js','P_GRID','enter','el id:'+this.touchy.id); 
		this.movesin(e);
		$(this.touchy).mousemove(this.handlers.movesin);
	},
	leave: function() {
		if(vbs) vlog('planning.js','P_GRID','leave','el id:'+this.touchy.id); 
		if(this.state.movesin) if(this.callbacks.movedout) this.callbacks.movedout.cb(this.state.movesin);
		this.state.movesin = false;
		$(this.touchy).unbind('mousemove',this.handlers.movesin);
	},
	movesin: function(e) {
		if(P_GRID.dragging) { return true; }
		let cue = this.ruler.mousecue(e).cue; 
		if(cue == this.ruler.cues.last) { return true };
		if(this.state.movesin == cue) return true; else this.state.movesin = cue;
		if(vbs) vlog('planning.js','P_GRID','movesin','el id:'+this.touchy.id+', cue:'+cue);
		if(this.callbacks.movesin) this.callbacks.movesin.cb(cue);
		return true;
	},
	
	// private
	sort: function() { // makes a prototype of cueable object with ascending cuein and cueout
		let cueable = { cueIn:this.state.touchin, cueOut:this.state.touchout, midnight:0, id:0, css:'touching' } // this instance is a cueable object for sticker()
		if(this.state.touchout < this.state.touchin) { cueable.cueIn=this.state.touchout; cueable.cueOut=this.state.touchin }
		cueable.cueOut+=mobminder.account.secondsPerSlice;
			let min = this.state.minsize?this.state.minsize:mobminder.account.secondsPerSlice; // mobminder.account.durMinSec used in some cases for minsize
			let stop = this.ruler.cues.last-min;
		if((cueable.cueOut-cueable.cueIn)<min) 
			if(cueable.cueOut<=stop) cueable.cueOut = cueable.cueIn+min;
		return cueable;
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    P L A N N I N G    S T I C K E R
//
var sitckerZindex = new Array();

sitckerZindex[resaclass.appointment]= 9;
sitckerZindex[resaclass.event] 		= 7;
sitckerZindex[resaclass.fcalwide] 	= 6;

sitckerZindex[shadow_offday] = 1;
sitckerZindex[shadow_except] = 1;
sitckerZindex[shadow_normal] = 1;


function P_Sticker(eid, cueable, callbacks, preset) { // common to horizontal and vertical planning display
	this.cueable = cueable;
	this.callbacks = callbacks; // like { onsticker: handledown, handleleave, enter, leave };
		const unique = eid+'_'+cueable.groupId+'_'+cueable.id;
	this.eids = { div:unique, inset:unique+'_in' }; // div is the outer box and inset is the inner one.
	this.elements = new A_el();
	this.handlers = new A_hn({
		down:new A_cb(this, this.down), up:new A_cb(this, this.up), anywhere:new A_cb(this, this.anywhere), 
		enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), 
		tstart:new A_cb(this, this.tstart), tend:new A_cb(this, this.tend), 
		handleactive:new A_cb(this, this.handleactive), handledown:new A_cb(this, this.handledown), handleleave:new A_cb(this, this.handleleave) });	
	this.state = P_Sticker.defaults.align(preset);
	this.tip = false;
}
P_Sticker.defaults = new A_df( { handles:false /*{top:false, bottom:false}*/, copypaste:false } );
P_Sticker.state = { down:false, handles:false }
P_Sticker.copypasteoverlay = function() {

					const cutmode = mobminder.app.state.cutmode; // (*cp04*)
				const ttxt = cutmode ? C_XL.w('cutandpaste-mode') : C_XL.w('copypaste-mode');
				const bptxt = cutmode ? C_XL.w('cutandpaste-bp-current') : C_XL.w('copypaste-bp-current');
				const cutcss = cutmode ? ' cutmode' : '';
			const copytag = '<div style="" class="mobtext fad fa-15x fa-copy fa-lg"></div>';
			const escptag = '<div style="" class="mobtext fad fa-17x fa-long-arrow-alt-right fa-lg fa-rotate-315"></div><div style="" class="mobtext fad fa-17x fa-keyboard fa-lg"></div>';
		const title = '<div style="display:inline-block; padding-left:1em;" class="blueprint bigger">'+ttxt+'</div>';
		const header = '<div style="white-space:nowrap;">'+copytag+title+'</div><hr/>';
		const bp = '<div style="line-height:2em; padding:1em 0;" class="blueprint">'+bptxt+'&nbsp;'+escptag+'</div>';
		
		const cpoverlay = '<div class="cpoverlay'+cutcss+'" style="position:absolute; inset:0;">'+'</div>';
	
	return { cpoverlay:cpoverlay, cpmsg:header+bp };
}
P_Sticker.prototype = {
	display: function(metric, css, html, tip) {
		// note: inset display:table allows the vertical-align:middle for a child that is displayed like table-cell (see e.g. shadows stickers)
			html = html + this.copypasteoverlay();
		const inset =  '<div id="'+this.eids.inset+'" class="sticker-inset" style="">'+html+'</div>';
		const outset = '<div class="sticker '+css+'" id="'+this.eids.div+'" style="'+this.metric(metric)+'">'+inset+'</div>';
		if(tip) this.tip = new C_iTIP(false, { text:tip.text, css:(tip.css||'tip'), delay:tip.delay||300 } ); // eid is given at activation, see (*kr01*)
		return outset;
	},
	activate: function() { 
		this.elements.collect(this.eids);
		if(this.callbacks.onsticker) {
			if(is.tactile) {
				this.elements.inset.ontouchstart =  this.handlers.tstart;
				this.elements.inset.ontouchend = this.handlers.tend;
			} else
				$(this.elements.inset).mouseup(this.handlers.up).mousedown(this.handlers.down);
		}
		if(this.state.handles||this.callbacks.enter) {
			if(is.tactile) {
				// no interactivity on touch device
			} else
				$(this.elements.inset).mouseenter(this.handlers.enter).mouseleave(this.handlers.leave);
		}
		if(this.tip) this.tip.activate(this.eids.inset); // see (*kr01*)
		return this; 
	},
	adjust: function(metric, html) {
		if(metric.height) { 
			this.elements.div.style.minHeight = metric.height+'px';
			this.elements.div.style.height = metric.height+'px';
		}
		if(metric.width) this.elements.div.style.width = metric.width+'px';
		if(metric.top) this.elements.div.style.top = metric.top+'px';
		if(metric.left) this.elements.div.style.left = metric.left+'px';
		if(html) {
			html = html + this.copypasteoverlay();
			this.elements.inset.innerHTML = html;
		}
		return this;
	},
	remove: function() {
		$('#'+this.eids.div).remove(); // not using elements because the obkect may not been activated
		if(this.tip) this.tip.quit();
	},
	handledone: function() {
		if(vbs) vlog('planning.js','P_Sticker','handle done',''); 
		P_Sticker.state.handle = false;
		$(this.elements.inset).children('div.handles').remove();
	},
	timeon: function() { // displays start and end time on the sticker
		this.timeoff();
		if(this.cueable.cueIn != 0)
			$(this.elements.inset).append(this.timedivstart());
		if(this.cueable.cueOut != 86400)
			$(this.elements.inset).append(this.timedivstop());
		return this;
	},	
	timeoff: function() { // removes display of start and end time from the sticker
		$(this.elements.inset).find('div.sticker-time').remove();
		return this;
	},
	
	//private
	copypasteoverlay: function() {
		if(!this.state.copypaste) return '';
		
				const cutmode = mobminder.app.state.cutmode; // (*cp04*)
			const cpo = P_Sticker.copypasteoverlay();
			const cutcss = cutmode ? ' cutmode' : '';
		this.tip = new C_iTIP(false, {text:cpo.cpmsg, css:'help-tip cpoverlay'+cutcss, delay:2000});
		
		return cpo.cpoverlay;
		
	},
	metric: function(metric) {
			let zindex = '';
		if(this.cueable.assess) zindex = 'z-index:'+sitckerZindex[this.cueable.assess]+'; ';
		if(this.cueable.deletorId) zindex = 'z-index:10; '; // z-index for deleted items
		
		return zindex+'min-height:'+metric.height+'px; height:'+metric.height+'px; width:'+metric.width+'px; top:'+metric.top+'px; left:'+metric.left+'px;';
	},
	timedivstart: function() { // purpose to fill in a sticker html inner
		return '<div class="sticker-time upper" style="position:absolute; top:.2em; left:.4em;">'+time(this.cueable.cueIn)+'</div>';
	},
	timedivstop: function() { // purpose to fill in a sticker html inner
		return '<div class="sticker-time footer"  style="position:absolute; bottom:.3em; right:.5em;">'+time(this.cueable.cueOut)+'</div>';
	},
	
	// event handling
	down: function(e) { 
		if(P_Sticker.state.handle) return true; // allow propagation to the P_GRID, so the sticker handles can be dragged
		if(vbs) vlog('planning.js','P_Sticker','down','el id:'+this.eids.div); 
		P_Sticker.state.down = this.eids.div;
		if(!is.tactile) $(document).mouseup(this.handlers.anywhere);
		return true;  // allow propagation to the P_GRID & C_iDROP, usefull when up action occurs above a sticker (no effect on touch pads)
	},
	up: function(e) {
		if(P_Sticker.state.handle) return true; // handle interactivity has precedence on the regular sticker click
		if(vbs) vlog('planning.js','P_Sticker','up','el id:'+this.eids.div); 
		
		if(!is.tactile) $(document).unbind('mouseup',this.handlers.anywhere); // no need anymore to track the anywhere up 
		if(is.tactile) { P_GRID.dragging = false; } // (*event cancel) => causes iScroll to abort animation :(
		
		if(P_Sticker.state.down == this.eids.div)
			if(this.callbacks.onsticker) { 
				const skeys = {ctrlkey:e.ctrlKey, shiftkey:e.shiftKey}; // little package
				this.callbacks.onsticker.cb(this.cueable,e,skeys); // note that we pass e here, such that upper leves can deduce the click coordinates
			}
		P_Sticker.state.down = false;
			
		return true; // allow propagation to the P_GRID & C_iDROP, usefull when up action occurs above a sticker (no effect on touch pads)
	},
	anywhere: function() { // up event happening anywhere on screen, you may have drag your mouse out of the sticker limits before releasing the mouse button
		if(vbs) vlog('planning.js','P_Sticker','up anywhere',''); 
		if(!is.tactile) $(document).unbind('mouseup',this.handlers.anywhere);
		P_Sticker.state.down = false;
		return true;
	},
	enter: function() {
		if(vbs) vlog('planning.js','P_Sticker','sticker enter','');
		if(this.state.handles && !P_Sticker.state.handle) {
			
			innertop = '<div style="width:70%; margin:0 auto;" class="handletop"></div>';
			innerbottom = '<div style="width:70%; margin:0 auto;" class="handlebottom"></div>';
			
			const divstyle = 'width:100%; margin:0 auto; position:absolute;';  //  
			
			if(this.state.handles.top) {
				const handle = '<div class="handles" id="handle-top" style="'+divstyle+' top:0; left:0;">'+innertop+'</div>';
				$(this.elements.inset).append(handle);
				$('#handle-top').mouseenter(this.handlers.handleactive);
			}
			if(this.state.handles.bottom) {
				const handle = '<div class="handles" id="handle-bottom" style="'+divstyle+' bottom:0; left:0;">'+innerbottom+'</div>';
				$(this.elements.inset).append(handle);
				$('#handle-bottom').mouseenter(this.handlers.handleactive);
			}
		}
		if(this.callbacks.enter) this.callbacks.enter.cb(this.cueable, this);
	},
	leave: function() {
		if(vbs) vlog('planning.js','P_Sticker','sticker leave',''); 
		if(this.state.handles && !P_Sticker.state.handle) {
			$(this.elements.inset).children('div.handles').remove();
		}
		if(this.callbacks.leave) this.callbacks.leave.cb(this.cueable, this);
	},
	handleactive: function(e) {
		if(P_Sticker.state.handle) return true; // the sticker is already changing size
		if(vbs) vlog('planning.js','P_Sticker','handle active','el id:'+e.currentTarget.id); 
		C_iWIN.cursor('dragging-vertical');
		$(e.currentTarget).mousedown(this.handlers.handledown).mouseleave(this.handlers.handleleave);
	},
	handledown: function(e) {
		if(vbs) vlog('planning.js','P_Sticker','handle down',''); 
		P_Sticker.state.handle = { sticker:this, which:e.currentTarget.id };
		$(e.currentTarget).unbind('mousedown').unbind('mouseleave');
		if(this.callbacks.handledown) this.callbacks.handledown.cb(this.cueable);
		return true; // prevents the normal onsticker-down
	},
	handleleave: function(e) {
		if(vbs) vlog('planning.js','P_Sticker','handle leave',''); 
		if(!P_Sticker.state.handle) C_iWIN.cursor();
		$(e.currentTarget).unbind('mouseleave').unbind('mousedown');
	},
	
	// touch events handling
	tstart: function(e) { e.preventDefault(); /* e.stopPropagation(); */ return this.down(e); },
	tend: function(e) { e.preventDefault();	/* e.stopPropagation(); */ return this.up(e); }
}
P_Sticker.overlaps = function(stickers) {

	// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium
	//           --- US/EU PATENT PENDING P.VANHOVE ---
	// WARNING: Copying this algorithm exposes you to legal pursuits
	//
	//
	// stickers are objects with following mandatory properties: { cueable:{ cueIn:int, cueOut:int, others irrelevant...} }
	// after processing, the following two properties are added: { overlayWays:, overlayLane }
	//
	//                               overlay threads =>  |===== 2 ways =====|      |========= 2 ways =============|
	//                                                   |                  |      |                              |
	//           in    out  in     out in                in         out               in     out   in     out
	//            |/////|   |/////////|        out       |///lane 1///|                |/lane2/|    |/lane 2/|
	//                      |         |\\\\\\\\\|              |//lane 2////|     
	//            |     |   |         |         |              in          out     |///////// lane 1 /////////////| 
	//                                                                             in                            out       
	//------------|-----|---|---------|---------|--------|-----|------------|------|---|-------|----|--------|----|-----> time
	//                                            
	// oLevel =>  1     0   1         1         0        1     2     1      0      1   2       1    2        1    0

	// define cues
	//
	function pcue(cue, type, sticker) { this.cue=cue; this.type=type; this.sticker=sticker; };
	const cues = new Array();
	for(let x in stickers) { 
		const sticker = stickers[x];
		stickers[x].overlayLane = 1; stickers[x].overlayWays = 1; 
		cues.push(new pcue(sticker.cueable.cueIn, 1, sticker));
		cues.push(new pcue(sticker.cueable.cueOut, -1, sticker));
	}
	
	// let orderp = new Array(); for(let x in stickers) orderp.push(x);
	// let sortrule = function(a,b) { return (stickers[a].cueIn>=stickers[b].cueIn)?1:-1; }; orderp.sort(sortrule);
	// for(let x in orderp) orderp[x] = stickers[orderp[x]];
	
	// order cues
	//
	const orderc = new Array(); for(let y in cues) orderc.push(y);
	const sortrule = function(i,j) { 
		if(cues[i].cue==cues[j].cue) return (cues[i].type==-1) ? -1 : 1; // cue out do come first, so to decrement oLevel (finalization of threads!!)
		return (cues[i].cue>=cues[j].cue)?1:-1; 
	}; 
	orderc.sort(sortrule);
	for(let y in orderc) orderc[y] = cues[orderc[y]];
	
	// define pipes
	//
	function makepipe() { // this is where we indicate which cues are covered by a cueable span
		const pcues = new Array();
		for(let y in orderc) pcues[orderc[y].cue] = 0;
		return pcues;
	}
	
	// find out threads and define lanes
	//
	let oLevel = 0; // overlap level
	let oMax = 1; // overlap max level
	const overlayWays = new Array(); // overlap thread
	const pipes = new Array(); pipes.push(makepipe());
	for(let y in orderc) {
		const cue = orderc[y];
		oLevel += cue.type;
		if(cue.type==1) { // entering a resa span
		
			if(oMax<oLevel) { oMax=oLevel; if(!(pipes[oLevel-1])) pipes.push(makepipe()); } // places a new pipe
			overlayWays.push(cue.sticker);
			
			let p;
			const cueable = cue.sticker.cueable;
			for(p in pipes) if(pipes[p][cueable.cueIn]!=1) { break; } // find a free pipe
			cue.sticker.overlayLane = (p|0)+1;
			for(let c in pipes[p]) { // occupy the pipe
				const cc=c|0; 
				if(cc>=cueable.cueIn &&cc<cueable.cueOut) { pipes[p][c] = 1; }
			} 
		}
		if(cue.type==-1) // quitting a resa span
			if(oLevel==0)  { // finalizing a thread
				if(oMax>1) for(let z in overlayWays) { let sticker = overlayWays[z]; sticker.overlayWays = oMax;	} // multi pipe drawing
				oMax=1; overlayWays.length = 0; // get ready for a next thread (that empties the array)
			}
	}

	// for(let x in orderp) { // debug monitoring
		// let part = orderp[x];
		// console.log('=-=-=-=> order('+x+'): cueIn='+part.cueIn+' cueOut='+part.cueOut+' overlayLane='+part.overlayLane+'/overlayWays='+part.overlayWays);
	// }
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H O R I Z O N T A L    P L A N N I N G    R O W
//
function P_hrow(eid, o_dS_resource, ruler, callbacks) {
	
	this.date = false;  // set by this.reset()
	this.stamp = false;

	this.resource = o_dS_resource;
		const e = eid+'_'+this.resource.id+'_';
	this.family = 'r'+this.resource.resourceType;
	this.eids = { hd:e+'hd', tr:e+'tr', axis:e+'axis', stickers:e+'stk', label:e+'label' }; // label is the resource name, on which you can click to switch to another view
	this.state = P_hrow.defaults.align();
	this.handlers = new A_hn({enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), move:new A_cb(this, this.move) });	
	this.ruler = ruler;
	this.callbacks = callbacks; // like { screen, sticker, sdrop, hdrop, resaopen, stickenter, stickleave, rescsaved, rescdeleted }
	this.innercallbacks = { stickenter:new A_cb(this, this.stickenter), stickleave:new A_cb(this, this.stickleave) };
	this.metric = false;
	this.elements = new A_el();
	
	
			const include = []; 
			include[0] = { label:'calendar', preset:{sign:'calendar-alt'} }; 
			if(this.resource.guideId) include[99] = { label:'guidelines', preset:{sign:'warning'} };
			
						const level = C_dS_details.get(planning.horizontal, this.resource.resourceType).details;  
					const disbltip = (level&(details.disbltips)); // tips can be disabled for this planning orientation and resource type, see (*dt*)
				let tip = { text:C_XL.w('P_horiz_resource_help_tip'), css:'help-tip' }; 
				if(!disbltip) {
					const t = C_dS_guidelines.tip(this.resource);
					if(t) tip = { text:t, css:'help-tip guidelines' };
				}
				
				const rcss = 'resource-label '+(this.resource.color==0?'':'c'+this.resource.color); // do not display the c0 color that is "no color"
				const style = 'display:inline-block; line-height:80%; position:relative; top:-1px; right:-1px'; // see also planning.css .resource-label
					const tag = this.resource.tag?'<div class="'+C_iSKIN.tagcss(this.resource.tag)+'" style="font-size:1.25em; width:1.5em; line-height:60%;"></div>':'';
				this.headertitle = this.resource.name+'&nbsp;'+tag; // this raw and idle header title is needed here (*hp01*)

			const preset = { tip:tip, title:this.headertitle, tag:'div', css:rcss, style:style, exclude:screens.search, include:include };
			const cbks = { onselect:new A_cb(this, this.label), shiftclick:new A_cb(this, this.shiftclick), ctrlclick:new A_cb(this, this.ctrlclick), shiftctrlclick:new A_cb(this, this.shiftctrlclick) };
	const label = new C_iAGVIEW(this.eids.label, cbks, preset );
	
	this.controls = new A_ct({ label:label });
	this.touchdrag = false; // initiated at activation
	
	this.track = function(css) {
		return '<div class="h-track '+css+'" style="z-index:-2; width:100%; position:absolute; bottom:10%; top:10%;"></div>'; // grayed thick line drawing visual lane for this row
	}
}
P_hrow.defaults = new A_df( { 
		  hidden:false, isoffday:false, hasresa:false, hovercue:false
		, drawing:false // contains a P_Sticker when the user starts down dragging on the planning
		, dragging:false
		, copypasting:false  // contains { cueable:dS_reservation, sticker:P_Sticker} when the user activates a copy/paste mode		
		, touching:false  // cueable as passed by touching() callback from P_GRID
} );
P_hrow.prototype = {
	row: function(ruler) {
			this.ruler = ruler;
				const axis = '<div id="'+this.eids.axis+'" class="h-axis" style="width:0px; position:absolute; top:50%; border:none;"></div>'; // container for all stickers
				const div  = '<div class="h" style="position:relative; border:none;">'+axis+this.track('right')+'</div>'; // (watch compatibility with Chrome and Firefox, they understand differently tr height)
			const td 	= '<td colspan='+(this.ruler.cues.span)+' style="vertical-align:middle;">'+div+'</td>';
		return '<tr id="'+this.eids.tr+'" class="P_hrow planning-row" style="">'+td+'</tr>';
	},
	header: function() {
			const label = this.controls.label.display()+this.track('left');
			const td = '<td class="h" id="'+this.eids.label+'" style="vertical-align:middle; width:100%; position:relative;">'+label+'</td>';
		return '<tr id="'+this.eids.hd+'" class="P_hrow planning-row" style="border:none;">'+td+'</tr>'; // (watch compatibility with Chrome and Firefox, they understand differently tr height)
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('P_hrow');
		// this.height(1);
		if(!is.tactile) $(this.elements.tr).mouseenter(this.handlers.enter); // row highlight 
		this.touchdrag = new P_GRID(this.elements.tr, this.ruler
			, { touched:new A_cb(this, this.touched), touching:new A_cb(this, this.touching), movesin:new A_cb(this, this.movesin), movedout:new A_cb(this, this.movedout) }
			, {minsize:mobminder.account.durMinSec} );
		
		new C_iDROP(this.elements.tr, { enter:new A_cb(this, this.sdragin), leave:new A_cb(this, this.sdragout), drop:new A_cb(this, this.sdrop) }, { family:'stickers', value:this.resource.id} );
		
		// PVH 2020 : drag and drop of entire lines is never asked and has been made obsolete, see (*rdd01*)
		// new C_iDRAG(this.elements.label, { movable:{x:false, y:true}, family:this.family, value:this.resource.id, image:false, hand:this.resource } );
		// new C_iDROP(this.elements.hd, { enter:new A_cb(this, this.hdragin), leave:new A_cb(this, this.hdragout), drop:new A_cb(this, this.hdrop) }, { family:this.family, value:this.resource.id} );
	},
	sticker: function(cueable, html, preset, is) {
		is = is || {}; preset = preset || {};
		if(is.resa) this.state.hasresa = true; // (prevents auto hiding offdays) note:shadows and tboxes do not pass this argument

		const h = this.metric.h;
		const ways = is.overlayWays || 1;
		const lane = is.overlayLane || 1;
		let bandw = h;
		let margin = 0;

		// e.g. Case of top alignent (margin-top = 0px, 2 ways)
		//
		// --------------------------------------------------------
		//       |                               |
		//     lane 1                        bandwidth
		//       |                               |
		// - - - - - - - - - - - - - - - -       |
		//       |                               |
		//     lane 2                            |
		//       |                               |
		// --------------------------------------------------------
		//          |
		//        margin 
		//          |
		// --------------------------------------------------------
		//    
		//
		
		if(preset.height) {
			if(preset.height.substr(-1)=='%') { let pc=preset.height.substr(0,preset.height.length-1)|0; bandw=h*pc/100; margin = h-bandw; }
			if(preset.height.substr(-2)=='px') { let px=preset.height.substr(0,preset.height.length-2)|0; bandw=px; margin = h-bandw; }
		}
		const lanewidth = bandw/ways;
		
		if(preset.align) {	
			switch(preset.align) {
				case 'top': margin = 0; break;
				case 'middle': 	margin = margin/2; break;
				case 'bottom': 	break;
			}
		}

		const top = margin+(lane-1)*lanewidth-h/2;
		
		const size = this.size(cueable);
		const metric = { height:lanewidth-1 , width:size.width-1 , top:top , left:size.left };
		
		let isstarter = ''; if(cueable.cueIn-cueable.midnight == this.ruler.cues.first) isstarter = 'starter';
		let isender = ''; if(cueable.cueOut-cueable.midnight == this.ruler.cues.last) isender = 'ender';
		
		const timecss = 'at'+time(cueable.cueIn-cueable.midnight, 'h',true,'m');

		// display
		const css = new Array(cueable.css, size.css, preset.css, isstarter, isender, timecss); // preset sets hourly or reservation, cueable gives the color, trimcss cuts the drawing when extend goes beyond planning borders
	
			let onsticker; if(is.idle) onsticker = false; else onsticker = new A_cb(this, this.onsticker);
		const sticker = new P_Sticker(this.eids.stickers, cueable, { onsticker:onsticker, enter:this.innercallbacks.stickenter, leave:this.innercallbacks.stickleave }, { handles:false, copypaste:preset.copypaste } );
		$(this.elements.axis).append(sticker.display(metric, css.join(' '), html, preset.tip));
		
		// activate
		// if(!is.idle) sticker.activate(); // PVH 2025, this non activation prevents this.elements.div to be filled in, and hence any copy-paste lateral moves to happen
		sticker.activate();
		if(is.draggy) new C_iDRAG(sticker.elements.div, { movable:{x:false, y:true}, family:'stickers', value:this.resource.id, image:false, hand:cueable } );
		
		return sticker;
	},
	height: function(lines) { // see (*lvl*)
		$(this.elements.tr).removeClass('level1 level2 level3 level4 level5 level6 level7').addClass('level'+lines); 
		$(this.elements.hd).removeClass('level1 level2 level3 level4 level5 level6 level7').addClass('level'+lines);
		this.metric = { y:$(this.elements.tr).position().top-1, h:$(this.elements.tr).height()-1 }; // locates this element in the parent relative div
	},
	hide: function(hidden) { 
		this.state.hidden = hidden;
		if(this.state.hidden) { $(this.elements.tr).hide(); $(this.elements.hd).hide(); }
			else { $(this.elements.tr).show(); $(this.elements.hd).show(); };
	},
	show: function(doshow) { return this.hide(!doshow); },
	offday: function() { // should be called AFTER placement of shadows AND resas
		let isoffday = this.state.isoffday;
		let hasnoresa = !this.state.hasresa;
		// if(vbs) vlog('planning.js','P_hrow','offday','resource:'+this.resource.name+', isoffday:'+isoffday+', hasresa:'+hasresa); 
		let shouldhide = isoffday && hasnoresa;
		return shouldhide;
	},
	rowlight: function(onoff) {
		$(this.elements.tr).removeClass('row-light'); $(this.elements.hd).removeClass('row-light');
		if(onoff) { $(this.elements.tr).addClass('row-light'); $(this.elements.hd).addClass('row-light'); }
		return this;
	},
	reset: function(jsdate, isoffday) { // should be called BEFORE placement of resas
		this.state.isoffday = isoffday;
		this.state.hasresa = false;
		this.date = jsdate.clone(); 
		this.stamp = this.date.stamp(); // used here (*cp10*)
		return this;
	},
	copypaste: function(options) {
		if(options===false) { // de-activates copypaste
			this.touchdrag.copypaste(false);
			this.state.copypasting = false;
			return false;
		}
		this.state.copypasting = { cueable:options.ds, sticker:false, cut:options.cut };
		this.touchdrag.copypaste(true);
		return true;
	},
	
	// private
	size: function(cueable) {
	
			let i = cueable.cueIn-cueable.midnight;
			let o = cueable.cueOut-cueable.midnight;
		if(cueable.timeshift) { i-=cueable.timeshift; o-=cueable.timeshift }; // takes care of daylight saving, two sundays in a year (P_RULER is instanciated only once, so we need to adjust the cues before displaying on the screen).
	
	// console.log('-------------1- i='+i+', o='+o+', m='+cueable.midnight+', ci='+cueable.cueIn)
		i = this.ruler.metric(i);  // i { position:left, size:slice width }
		o = this.ruler.metric(o);
	// console.log('-------------2')
		
		const w = o.position - i.position;
		const trimcss = new Array(i.css, o.css); // specifies trimming css postfix, left or right
		return { width:w , left:i.position, css:trimcss.join(' ') };
	},
	
	// event handling
	stickenter: function(cueable) {
		if(vbs) vlog('planning.js','P_hrow','stickenter','in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)); 
		
		this.rowlight(false);
		this.ruler.dotlight(false).timelight(false).dohighlight(false); // sets this.ruler.state.dohighlight to false

		if(this.callbacks.stickenter) this.callbacks.stickenter.cb(cueable);
	},
	stickleave: function(cueable) {
		if(vbs) vlog('planning.js','P_hrow','stickleave','in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)); 
		if(this.callbacks.stickleave) this.callbacks.stickleave.cb(cueable);
		this.ruler.dohighlight(true); // sets this.ruler.state.dohighlight to true
		this.rowlight(true);
	},
	
	movesin: function(cue) {
		if(vbs) vlog('planning.js','P_hrow','movesin','date:'+this.date.sortable()+',in:'+time(cue)+',out:'+time(cue));
		// console.log('planning.js','P_hrow','movesin','resc:'+this.resource.name+' | cue:'+time(cue));
		
		let cueable = this.state.copypasting.cueable.changecue(this.stamp+cue); // (*cp10*) that is a dS_reservation, we adapt date and time such that when clicked, the right date and time are allocated.
		let html = cueable.rdetails(planning.horizontal, this.resource.resourceType);
		
		if(this.state.copypasting.sticker) { // the drawing is on the screen yet, we only need to move it
				const duration = cueable.cueOut - cueable.cueIn;
			this.state.copypasting.sticker.adjust(this.size(cueable), html); // html shows updated time/date
		}
		else { // we need to create the sticker
			this.state.copypasting.sticker = this.sticker(cueable, html, { css:'resa-copypaste', copypaste:true }, {idle:true} );
		}
		
	},
	movedout: function(cue) {
		if(vbs) vlog('planning.js','P_hrow','movedout','date:'+this.date.sortable()+',in:'+time(cue)+',out:'+time(cue));
		
		if(this.state.copypasting) this.state.copypasting.sticker.remove();
		this.state.copypasting.sticker = false; 
		return true;		
	},
	enter: function(e) { // enter the full tr
		this.move(e);
		// const cue = this.ruler.mousecue(e).cue; 
		$(this.elements.tr).mousemove(this.handlers.move).mouseleave(this.handlers.leave);
	},
	move: function(e) { // moving over the tr (there is one call only each time another cue zone is entered)
		const cue = this.ruler.mousecue(e).cue; // retrieves the cue (expressed in seconds vs midnight).
		
		if(this.state.hovercue == cue) return true; else this.state.hovercue = cue;
		if(!this.state.touching) this.ruler.dotlight(cue,e).timelight(cue,e); // the time stick is disabled during touch and drag
		this.rowlight(this.ruler.state.dohighlight); // make sure that no row highlight occurs during sticker hovering
		return true;
	},
	leave: function() { // leave the tr
		this.rowlight(false);
		this.ruler.dotlight(false).timelight(false);
		$(this.elements.tr).unbind('mousemove',this.handlers.move).unbind('mouseleave',this.handlers.leave);
		this.state.hovercue = false;
	},
	touching: function(cueable, dragging) { // drawing on the grid with mouse pointer
		
		let touched = this.state.touching;
		this.state.touching = cueable; // keep this info so we can use it e.g. here (*tb02*)
		let isstarton = (touched===false && cueable);
		if(isstarton) this.ruler.dotlight(false).timelight(false);
		
		
		if(this.state.copypasting) { // then the user clicks where he wishes to copypaste an item
			if(vbs) vlog('planning.js','P_hrow','touching copypaste mode','date:'+this.date.sortable()+',in:'+time(cueable.cueIn)); 
			// console.log('planning.js','P_hrow','touching copypaste mode','date:'+this.date.sortable()+',in:'+time(cueable.cueIn)); 
			let cue = this.state.copypasting.cueable;
			
				let ids = [];
				ids[this.resource.resourceType] = []; ids[this.resource.resourceType].push(this.resource.id); // is our currently displayed bCal, uCal or fCal
				
			cue.changeattendance(ids, {rscsonly:true} ).rmeta(); // so to change the resource assignment according to the curretly focused row view

			let modal = this.onsticker(cue); // engage the modal display
	
				modal.callbacks['escaped'] = new A_cb(this, this.touchescaped, modal.callbacks.escaped); // re-route the modal callback to this object
				let html = cue.rdetails(planning.vertical, this.resource.resourceType);
			this.state.drawing = this.sticker(cue, html, { css:'resa-copypaste', copypaste:true }, {idle:true} ); // 

			return false; // un-confirm down dragging action to P_GRID
		}		
		
		
		
		if(P_Sticker.state.down) return false; // a sticker was clicked
		if(vbs) vlog(this.eids.tr,'P_hrow','touching','resource:'+this.resource.id+',in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)+',dragging:'+dragging); 
			let span = cueable.cueOut-cueable.cueIn;
			let span1 = span>1*mobminder.account.secondsPerSlice;
			let span2 = span>2*mobminder.account.secondsPerSlice;
			let html = '<div style="position:absolute; top:10%; left:'+(span2?'.2em':0)+';">'+time(cueable.cueIn)+'</div>';
		if(span1) // display end time also when span is two slices or more
				html+= '<div style="position:absolute; bottom:10%; right:'+(span2?'.5em':0)+';">'+time(cueable.cueOut)+'</div>';
			
		if(dragging==1) // that is the beggin of the gesture
			this.state.drawing = this.sticker(cueable, html, { height:'80%', align:'middle'} );
		// else this is the next info about dragging
		this.state.drawing.adjust(this.size(cueable), html);
		return true;
	},
	touched: function(cues, mousevent) { // new reservation by touch/drag on planning grid
		this.state.touching = false;
		if(vbs) vlog(this.eids.tr,'P_hrow','touched','resource:'+this.resource.id+',in:'+time(cues.cueIn)+',out:'+time(cues.cueOut));
		rmems.flush('slots'); // this removes the previously used C_dS_attendee and C_dS_reservation from the 'slots' bank. If they stay, a previously clicked resource line would appear in a next drag action on another resource line
		const resaId = 0, stamp = mobminder.app.dp.stamp();
		const attendee = new C_dS_attendee('slots', [0, resaId, this.resource.resourceType, this.resource.id]); // must be present in the 'slots' memory bank, if not, your reservation is not linked to any resource
		
			const timeshift = mobminder.app.dp.jsdate().timeshift(); // daylight saving (e.g. October 27th, 2013)
			const cuein = timeshift+stamp+cues.cueIn;
			const cueout = timeshift+stamp+cues.cueOut;
		const cueable = new C_dS_reservation('slots', C_dS_trackingCCD.tnew(resaId, mobminder.account.id).concat([cuein, cueout]));


			const skeys = {ctrlkey:mousevent.ctrlKey, shiftkey:mousevent.shiftKey}; // little package
		const resamodal = this.callbacks.resaopen.cb(cueable, mousevent, skeys); // opens the modal
		
		if(!resamodal) {
			if(this.state.drawing) this.state.drawing.remove();
			this.state.drawing = false;
		} else {
			// now we let the escaped event come back here (so we can remove the drag image when done with the resa modal). Note that we keep track of the original handler and pass it as argument in the o_callback that we make here
			resamodal.callbacks.escaped = new A_cb(this, this.touchescaped, resamodal.callbacks.escaped); 
		}
	},
	onsticker: function(cueable, mousevent, skeys) { // any non idle sticker on screen touched/clicked

		const touching = this.state.touching; // the parent process needs to have the touching info
		this.state.touching = false; // but the state must go back to false
		if(this.callbacks.sticker) return this.callbacks.sticker.cb(cueable, this.resource, touching, skeys, mousevent); // adds the hit resource information to the callback
		else return false;		
	},
	label: function(option) { // an option from the menu has been chosen
		if(1) vlog('planning.js','P_hrow','label','option:'+option); 
		switch(option|0) {
			case 0: 
				// as we are triggered from a modal-pad, this one needs to start after the animation delay // see (*md03*)
				setTimeout( function(that, resource) {
						new M_RESC(resource, { saved:that.callbacks.rescsaved, deleted:that.callbacks.rescdeleted }, { tab:1 } ); } 
					, C_iMODAL.animationdelay, this, this.resource ); 
				break;
				
			case 99:
					let guidelines = C_dS_guidelines.get(this.resource.guideId);
				setTimeout( function(that, guidelines) {
						new M_GDLNS(guidelines, {}, { tab:0, consultonly:true } ); }
					, C_iMODAL.animationdelay, this, guidelines ); 
				break;
			default: // then option is one of var screens = {...}
				if(this.callbacks.screen) this.callbacks.screen.cb(option|0, this.resource.id); break;
		}
	},
	shiftclick: function() {
		if(this.callbacks.screen) this.callbacks.screen.cb(screens.week, this.resource.id);
	},
	ctrlclick: function() {
		this.label(0);
	},
	shiftctrlclick: function() {
		if(this.callbacks.screen) this.callbacks.screen.cb(screens.hourly, this.resource.id);
	},
	sdrop: function(draggy, droppy) {
		if(vbs) vlog(this.eids.tr,'P_hrow','sdrop',''); 
		let cueable = draggy.state.hand;
		let from = draggy.state.value;
		let to = this.resource.id;
		draggy.done();
		this.rowlight(false);
		if(this.callbacks.sdrop) {
			let resamodal = this.callbacks.sdrop.cb(cueable, from, to);
			// now we let the escaped event come back here (so we can remove the drag image when done with the resa modal). Note that we keep track of the original handler and pass it as argument in the o_callback that we make here
			resamodal.callbacks.escaped = new A_cb(this, this.sdropescaped, resamodal.callbacks.escaped); 
		}
	},
	sdragin: function(draggy, droppy) {
		if(vbs) vlog(this.eids.tr,'P_hrow','sdragin',''); 
		let cueable = draggy.state.hand;
		this.rowlight(true);
		let clone = { cueIn:cueable.cueIn, cueOut:cueable.cueOut, midnight:cueable.midnight, id:cueable.id+'_'+this.resource.id, css:cueable.css+' drag-image', assess:cueable.assess };
		this.state.dragging = this.sticker(clone, draggy.picked().innerHTML, { align:'middle' }, { idle:true });
		P_Sticker.state.down = false; // cancels the click behaviour of the sticker being dragged
	},
	sdragout: function() {
		if(vbs) vlog(this.eids.tr,'P_hrow','sdragout',''); 
		if(this.state.dragging) this.state.dragging.remove(); // remove the sticker
		this.rowlight(false);
		this.state.dragging = false;
	},	
	hdragin: function(draggy, droppy) {
		draggy.image(true);
		this.rowlight(true);
		if(vbs) vlog(this.eids.tr,'P_hrow','hdragin','resc:'+this.resource.name); 
	},
	hdragout: function() {
		this.rowlight(false);
		if(vbs) vlog(this.eids.tr,'P_hrow','hdragout','resc:'+this.resource.name); 
	},
	hdrop: function(draggy, droppy) {0
		const from = draggy.state.value;
		const to = this.resource.id;
		draggy.done();
		this.rowlight(false);
		if(vbs) vlog(this.eids.tr,'P_hrow','hdrop','from:'+from+',to:'+to); 
		if(this.callbacks.hdrop) { this.callbacks.hdrop.cb(from, to); }; // see (*rdd01*)
	},

	// callbacks:
	sdropescaped: function(originalhandler) { // a drag and drop was made, resa modal opened, but the user closed or escaped the modal
		if(vbs) vlog(this.eids.tr,'P_hrow','dropescaped',''); 
		if(originalhandler) originalhandler.cb();
		this.sdragout();
		C_iDRAG.handlers.free();
	},
	touchescaped: function(originalhandler) { // a touch was made, resa modal opened, but the user closed or escaped the modal
		if(vbs) vlog(this.eids.tr,'P_hrow','dropescaped',''); 
		if(this.state.drawing) this.state.drawing.remove();
		this.state.drawing = false;
		if(originalhandler) originalhandler.cb();
	}
}
P_hrow.register = new Array();




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H O R I Z O N T A L    P L A N N I N G    S E C T I O N  ( by resource type )
// 
function P_htype(eid, rsctype, callbacks, preset, ruler) {
	this.rsctype = rsctype;
	this.disporder = C_dS_resource.displayorder(rsctype);
	this.resources = C_dS_resource.registers.typeId.get(rsctype);
	this.callbacks = callbacks; // like { details, screen, sticker, drop, stickenter, stickleave, aswap,  }
		const e = eid+'_'+rsctype+'_';
	this.eids = { e:e, 1:e+'ucals', 2:e+'bcals', 4:e+'fcals', rsctype:e+'type', rows:e+'row', resources:new Array(), grid:e+'grid', headers:e+'headers', details:e+'dtls' };
	this.elements = new A_el();
	this.status = P_htype.defaults.align(preset);
		const span = { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };
	this.ruler = ruler;
		let detailsclick = false; if(permissions.may(pc.ac_disprefs)) detailsclick = new A_cb(this, this.ondetails, false, false, C_iMODAL.animationdelay);
		 
			const dtt = C_XL.w('help-tip-P_htype-details-button', {nested:{rtype:C_XL.w(this.rsctype, {cap:0})} });
		const dtip = { text:dtt, css:'help-tip' };
		const dpreset = { ui:C_XL.w(this.rsctype), tip:dtip, tag:'div', css:'h-resource-type', style:'white-space:nowrap; height:3em; line-height:3em;' };
	const details = new C_iCLIK(this.eids.details, {click:detailsclick}, dpreset );
		
	const rows = new A_ct();
	for(let id in this.resources) {
		const dS_resource = this.resources[id];
		const row = new P_hrow(this.eids.rows, dS_resource, this.ruler, this.callbacks );
		rows.add1(row, id);
	}
	this.controls = new A_ct({ details:details, rows:rows });
}
P_htype.defaults = new A_df( { hidden:false, lastsection:false, lockedon:false } );
P_htype.prototype = {
	display: function() {
			
		const leftheaders = '<table class="P_htype" id="'+this.eids.headers+'" style="width:100%; text-align:right;">'+this.headers()+'</table>';
		const rightgrid = '<div class="P_htype horizontal-section" id="'+this.eids.grid+'" style="position:relative;">'+this.grid()+'</div>'; // position relative limits extention of dotted lines and is a reference for the mousecue(), see (*o01*)
		
		return { leftheaders:leftheaders , rightgrid:rightgrid };
	},
	hourlies: function(date) {
		const level = C_dS_details.get(planning.horizontal, this.rsctype).details;  
		const disbltip = (level&(details.disbltips)); // tips can be disabled for this planning orientation and resource type, see (*dt*)
		const clickable = this.rsctype == agClass.bCal; // only available for bCals (what other attendees would we select by default if facultative timebox was clicked)
		
		if(vbs) vlog('planning.js','P_htype','hourlies','details level:'+level);
		for(let index in this.disporder) {
				const rscId = this.disporder[index];
				const resource = this.resources[rscId];
				const set = resource.schedule(date);  // current hourly for the period
			if(!set) continue;
				const hourly = set.hourly;
				const shadows = set.shadows; // 2 or more in each row
				const tboxes = set.tboxes; // may be void
			this.controls.rows[resource.id].reset(date, set.offday); // here we pass the information to the row if this is an offday
			for(let id in shadows)
				this.controls.rows[resource.id].sticker(shadows[id], '', { height:'12px', align:'middle' }, {idle:true} );
			for(let id in tboxes) {
					const tbx = tboxes[id]; // is an instance of C_dS_timebox
					const tboxing = C_dS_timeboxing.get(tbx.timeboxingId); // is an instance of C_dS_timeboxing
					let tag = tboxing.tag?C_iSKIN.tagcss(tboxing.tag):'';
						tag = tag?'<div class="'+tag+'" style="font-size:1.1em; width:2em; text-align:center;"></div>':'';
				if(level & details.timeboxing) tag = tag+tboxing.name;
					const label = '<div style="">'+tag+'</div>';
					let tip = false; if(!disbltip) tip = {text:tboxing.tbtip(tbx.cueIn, tbx.cueOut), css:'sticker-tip timebox-tip '+tboxing.cssName, delay:2000};
					const row = this.controls.rows[resource.id];
				row.sticker(tbx, label, { height:'20%', align:'bottom', tip:tip }, {idle:!clickable} ); // see (*tb01*), click on time boxing
			}
		}
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('P_htype');
		this.height().hide();
	},
	onresize: function() {
		// this.ruler.locate();
		return this;
	},
	hide: function() { // hides the complete section
		return this;
			// let d = C_dS_details.get(planning.horizontal, this.rsctype).details; 
			// let hidden = !!(d&details.hidesection); // complete section not displayed
		// for(let id in this.controls.rows.get) this.controls.rows[id].hide(hidden);
		// return this;
	},
	cleanup: function(which) { 
		$(this.elements.grid).find('div.sticker'+(which||'')).remove(); return this; 
	},
	addclass: function(which, acssclass) { 
		$(this.elements.grid).find('div.sticker'+(which||'')).addClass(acssclass); return this;
	},
	sticker: function(resourceId, cueable, html, preset, is) {
		return this.controls.rows[resourceId].sticker(cueable, html, preset, is);
	},
	offdays: function(rscidsrray) { 
		// called after placement of shadows AND resas, defines if row should be hidden
		// shows only resources as selected on the R_Search control pannel if active, otherwise follows the 'display details' setting
		
			let d = C_dS_details.get(planning.horizontal, this.rsctype).details;
			let hidentiresection = !!(d&details.hidesection);
			let anyvisible = 0;
			
		if(hidentiresection) {
			anyvisible = 0;
			for(let id in this.controls.rows.get) this.controls.rows[id].hide(true);
		} else {
			if(this.status.lockedon) rscidsrray = false;
			for(let id in this.controls.rows.get) { // here we blend the offday filter and the mobminder.app.resourcescope filter
				let shouldhide = (d&details.hideoffdays) ? this.controls.rows[id].offday() : false; // hide offdays option
				if(rscidsrray) // resourcescope always has priority, so to stabelize the screen
					shouldhide = !rscidsrray.includes(id|0); // which is true if id is not represented in the user's selected resource scope 
				this.controls.rows[id].hide(shouldhide);
				anyvisible += shouldhide?0:1;
			}
		}
		$(this.elements.grid).removeClass('empty'); $(this.elements.headers).removeClass('empty'); // this reduces the height of the footer ruler, pure cosmetic action
		if(!anyvisible) { $(this.elements.grid).addClass('empty'); $(this.elements.headers).addClass('empty'); }
		return this;
	},
	copypaste: function(options) {
		
		if(vbs) vlog('planning.js','P_htype','copypaste','options:',options);
		// console.log('planning.js','P_htype','copypaste','options:',options.ds);
		for(let rid in this.controls.rows.get)
			this.controls.rows.get[rid].copypaste(options); // activates / de-activates copypaste mode // (*cp03*)
	},
	
	// private
	setruler: function(ruler) {
		this.ruler = ruler;
		this.elements.grid.innerHTML = this.grid();
		for(let id in this.controls.rows.get) this.controls.rows[id].activate();
		this.height();
	},
	grid: function() { // grid (on the right) and row headers (on the left) are displayed in different divs, because the grid must scroll horizontaly when mouse wheel is spinned
		
		let eid = ''; if(this.rsctype!=class_bCal) eid = this.eids[this.rsctype];
		let r = this.ruler.display({ eid:eid, dots:true, timestick:this.rsctype, labels:true, timestamps:true });
		
			let withlabels = false; // we want only the bottom section to show labels (to heavy display when all sections have bottom hour labels)
			let footereid = '';
			if(this.status.lastsection) {
				footereid = '_ftr';
				withlabels = true;
			}
		let t = this.ruler.dfooter({ eid:undefined, feid:footereid, dots:true, timestick:false, labels:withlabels, timestamps:false }); // see (*pr03*)
		
			let trs = new Array();
		for(let index in this.disporder) trs.push(this.controls.rows[this.disporder[index]].row(this.ruler));
		
			let slicing = 's'+mobminder.account.secondsPerSlice/60;
		let grid = '<table style="width:100%;" class="h-section '+slicing+'">'+r+trs.join('')+t+'</table>'; /* (*zm002) */
		return grid;
	},
	headers: function() {
					
			let widthmaker = ''; // this will set width of the lefter headers such that when you use "hide absent resources" from display details, the righter grid does not change of width (that would screw the ruler.locate results)
			let trs = new Array(); 
		
		for(let index in this.disporder){
			
			let hrowid = this.disporder[index]; // which is a resource id
			let P_hrow = this.controls.rows[hrowid];
			trs.push(P_hrow.header()); // we fetch the label from the child P_hrow objects, this is an interactive element from C_iAGVIEW
			
			let headertitle = P_hrow.headertitle; // this the raw and idle content of the header title, made here (*hp01*)

			widthmaker += '<div class="resource-label-padder" style="line-height:0em; max-height:0em; overflow:hidden; color:red; padding:0 .5em; white-space:nowrap; visibility:hidden;">'+headertitle+'</div>';
		}
		
		let th = '<tr class="h-section-header" style="border:none;"><th class="h-resource-type" >'+this.controls.details.display()+widthmaker+'</th></tr>';
		let tf = '<tr class="h-section-footer" style="border:none;"><th class=""></th></tr>';
		let headerrows = th+trs.join('')+tf;
		return headerrows;
	},
	height: function(/*dlines*/) { // level counts the number of options selected in dS_details, see (*lvl*)
			let d = details; // details is a global var, see its definition here (*dt*) 
		let mask = d.resanote|d.attendance|d.visitor|d.mobile|d.visitorNote|d.workcodes|d.color|d.extraspace|d.birthdate|d.zipcode|d.reference|d.language|d.timeboxing;
		let encodedetails = C_dS_details.get(planning.horizontal, this.rsctype).details; 
		let dlines = 0;
		for(let bit = details.maxValue; bit; bit>>=1) if(encodedetails&mask&bit) dlines++; // for each of the details the user selected we increase dlines
		if(encodedetails&details.schedule||encodedetails&details.duration||encodedetails&details.registration) dlines++; // a single line is counted for those attributes (short)
		if(encodedetails&d.resanote) dlines++; // resanote opens more space in the stickers
		
		if(dlines==0) dlines=1; if(dlines>=8) dlines=8; // dependance with .css see (*lvl*)
		
		if(vbs) vlog('planning.js','P_htype','height','dlines:'+dlines);
		
		for(let id in this.controls.rows.get) this.controls.rows[id].height(dlines);
		return this;
	},
	setdetailscaption: function() {
			let rt = C_XL.w(this.rsctype);
			let locked = this.status.lockedon?'<div class="fa fa-13x fa-lock-alt" style="margin-left:1em;"></div>':'';
		this.controls.details.set(rt+locked);
	},
	
	// event handling
	ondetails: function(isfalse, iclick, specialkeys, mousevent) {
		
	// console.log('isfalse, iclick, specialkeys, mousevent',isfalse, iclick, specialkeys, mousevent);
			let cbks = {changed:new A_cb(this, this.detailsset), saved:new A_cb(this, this.detailssaved)};
		if(specialkeys.shiftkey||specialkeys.ctrlkey) { // toggles the section hide mode
			this.status.lockedon = !this.status.lockedon;
			this.setdetailscaption();
			let rscids = this.status.lockedon?false:mobminder.app.resourcescope.staffscope[this.rsctype];
			this.offdays(rscids);
		}
		else // opens up the display details setup window
			new M_details(false, cbks, {rsctype:this.rsctype, orientation:planning.horizontal});
		return this;
	},
	
	
	// controls feedback
	detailsset:  function(l) {
		if(vbs) vlog('planning.js','P_htype','detailsset','level:'+l);
		this.height().hide();
		if(this.callbacks.details) this.callbacks.details.cb(l);
	},
	detailssaved:  function() {
		if(vbs) vlog('planning.js','P_htype','detailssaved','');
		this.disporder = C_dS_resource.displayorder(this.rsctype);
		// if(this.callbacks.details) this.callbacks.details.cb();
		if(this.callbacks.rescsaved) this.callbacks.rescsaved.cb(); // need to redraw the left column positionning resources
	}
	// ajax responses
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H O R I Z O N T A L    P L A N N I N G 
//
function C_iHscroll(scroller,from) { // turns the mouse wheel to scroll horizontaly on the 'scroller' div element passed

	// used here (*cal03*)
	this.scroller = scroller;
	this.timer = false;
	this.togo = 0;
	this.timer = false;
	
	const rectangle = scroller.getBoundingClientRect();
	const rectwidth = rectangle.width;
	const speedratio = rectwidth ? rectwidth/200 : 10;
	// console.log('C_iHscroll() rectwidth:'+rectwidth+', speedratio:'+speedratio+(from?', from:'+from:''));
		const that = this;
	const wheel = function (e) { if(!that.on) return true; e = window.event || e;
	const d = (e.wheelDelta/60 || -e.detail); that.add(speedratio*d); e.preventDefault(); return false; }
	this.scroller.addEventListener("DOMMouseScroll", wheel, false); // Firefox
	this.scroller.addEventListener("mousewheel", wheel, false);  // IE9, Chrome, Safari, Opera
	this.on = false;
}
C_iHscroll.prototype = {
	enable: function(onoff) { this.on = !!onoff; },
	add: function(more) { this.togo += more; if(!this.timer) this.pace(); },
	pace: function() { let t = this; this.timer = setTimeout(function(){t.move()},20); },
	move: function() {
		let slope = 2; let damp = 4;
		let again = false; this.togo -= (this.togo/damp/slope);
		if(this.togo>0) { if(this.togo>damp) again = true; } else { if(this.togo<-damp) again = true; }
		this.scroller.scrollLeft -= (this.togo/damp);
		if(again) this.pace(); else { this.togo = 0; this.timer = false; }
	}
}


function P_horiz(eid, callbacks, preset) { // gathers planning of all three resource types
	
		const e = eid+'_';
	this.eids = { eid:eid, ruler:e+'ruler', wrappertable:e+'wrpt', headerswrapper:e+'hwrp', sections:e+'clss'
		, scroll:e+'scroll', carousel:e+'carousel', overlay:e+'ovrl', swap:e+'swap' };
	this.elements = new A_el();
	this.state = P_horiz.defaults.align(preset);
	this.callbacks = callbacks; // like { resaopen, screenchange, details }
	this.handlers = { 	onsticker:new A_cb(this, this.onsticker), stickenter:new A_cb(this, this.stickenter), stickleave:new A_cb(this, this.stickleave), 
						ondetails:new A_cb(this, this.ondetails), sdrop:new A_cb(this, this.sdrop), hdrop:new A_cb(this, this.aswap) }
	
	// controls for this screen	
	this.sections = new A_ct();
	const register = C_dS_resource.registers.typeId.get();
	this.events = { plitems:new A_cb(this,this.plitems), plitemsfailed: new A_cb(this,this.plitemsfailed) };
	this.controls = new A_ct({});
		const span = { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };
	this.ruler = new P_RULER(this.eids.ruler, {orientation:planning.horizontal, cueIn:span.cueIn, cueOut:span.cueOut });
	let countsections = 0; for(let type in register) countsections++;
	const last = countsections-1;
	let c = 0;
	for(let type in register) {
		const islastsection = (c++==last);
		const section = new P_htype(this.eids.sections, type, 
			{ 	details:this.handlers.ondetails, resaopen:this.callbacks.resaopen, screen:this.callbacks.screenchange, 
				rescsaved:this.callbacks.rescsaved, rescdeleted:this.callbacks.rescdeleted, 
				sticker:this.handlers.onsticker, stickenter:this.handlers.stickenter, stickleave:this.handlers.stickleave, 
				sdrop:this.handlers.sdrop, hdrop:this.handlers.hdrop  }, { lastsection:islastsection /*preset*/}, this.ruler );
		this.sections.add1(section, type);
	}
	this.scrolly = false;
	this.state.sectionscount = c;
}
P_horiz.defaults = new A_df( { busy:false, midnight:false, jsdate:false, resas:false, highlight:false, scrolling:false, hoversticker:false, sectionscount:0 } );
P_horiz.prototype = {
	// public
	display:function() {
		// display
		if(vbs) vlog('planning.js','P_horiz','display','');

		let headers = ''; let grids = '';
		const sequence = [class_bCal, class_uCal, class_fCal]; // display order
		for(let x in sequence) {
			let type = sequence[x];
			if(!this.sections[type]) continue;
				let htype = this.sections[type].display(this.ruler);
			grids += htype.rightgrid;
			headers += htype.leftheaders;
		}
		const tdheaders = '<td class="agenda-rowhead" id="'+this.eids.headerswrapper+'" style="width:1%; vertical-align:top;"><div class="">'+headers+'</div></td>';
			grids = '<div id="'+this.eids.scroll+'" class="h-scroll" style="position:relative; overflow:hidden;"><div id="'+this.eids.carousel+'" style="min-width:100%; display:inline-block; position:relative;">'+grids+'</div></div>';
		const tdgrids = '<td class="agenda-planning" style="display:table; table-layout:fixed; width:100%;">'+grids+'</td>'; // table-layout:fixed forces the witdh of the td
				
				const spinner = '<div class="spinner">'+'</div>';
			const busystyle = 'z-index:20; position:absolute; top:0; left:0; bottom:0; right:0; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:30vh;';
		const overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';
		
			const fontsize = ' sticker-font'+mobminder.account.stiFontSize;
		const table =  '<table class="P_horiz horizontal-planning'+fontsize+'" id="'+this.eids.wrappertable+'"  style="width:100%; max-width:100%;"><tr>'+tdheaders+tdgrids+'</tr></table>';
		
		return table+overlay;
	},
	activate:function() {
		if(vbs) vlog('planning.js','P_horiz','activate','');
		this.sections.activate(); 
		this.ruler.activate().locate();
		for(let t in this.sections.get)this.sections.get[t].onresize(); // after each section has been (or not) hidden, we recalibrate the rulers
		this.elements.collect(this.eids);
		this.controls.activate('P_horiz');
		this.busy(this.state.busy);
		new C_KEY([C_KEY.code.alpha.z+C_KEY.code.s.ctrl], new A_cb(this, this.key), 'P_horiz::'+this.eids.eid );
		if(is.tactile) { 
				let handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone)}) ;
				let options = { zoom:false, scrollX:true, scrollY:false, bounce:true, momentum:true, scrollbars:false };
			this.scrolly = new IScroll(this.elements.scroll, options); // P_horiz
			this.scrolly.on('scrollStart', handlers.iScrolling);
			this.scrolly.on('scrollEnd', handlers.iScrolldone);
		} else {
			this.smoothscroll = new C_iHscroll(this.elements.scroll,'P_horiz');
		}
		// console.log('planning.js','P_horiz','activate');
		mobminder.app.resourcescope = { enabled:false, staffscope:false }; // see (*mb02*) in C_iMOB, they are set by R_search
		return this;
	},
	busy: function(onoff) {
		if(onoff==this.state.busy) return this;
		this.state.busy = onoff;
		if(onoff) { 
			$(this.elements.overlay).addClass('on'); C_iWIN.cursor('wait');
		}
		else { $(this.elements.overlay).removeClass('on'); C_iWIN.cursor();	}
		return this;
	},
	set: function(jsDate) { // sets timeboxes and hourlies on screen
		if(vbs) vlog('planning.js','P_horiz','set','date:'+jsDate);
		
							if(measurePlitem) this.microperf = new microperf('set date '+jsDate.sortable());
		this.busy(true);
		this.state.midnight = jsDate.stamp(); this.state.jsdate = jsDate;
		// let that = this; setTimeout( function() {that.query(jsDate.sortable())}  , 1000); // good for testing the busy mode css
		this.query(jsDate.sortable())
		
							if(measurePlitem) this.microperf.cue('query sent');
							
		this.setrulers(jsDate);
		let today = new Date(); this.ruler.stick(today.toMidnight().sameday(jsDate)); // do not show the blue time stick when the displayed date is not today
		
		for(let type in this.sections.get) 
			this.sections[type].cleanup('.shadow').cleanup('.timebox').hourlies(jsDate);
			
							if(measurePlitem) this.microperf.cue('clean up and hourlies done');
							
	},
	setrulers: function(jsDate) { // places new rulers aside and in the html frame set by the display() function
		
		let right = '', span;
			let adaptative = C_dS_details.get(planning.horizontal, class_bCal, details.adaptative); 
		if(adaptative) span = this.adaptative(jsDate);
			else span = { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };
		
			let noscalechange = this.ruler.state.cueIn==span.cueIn && this.ruler.state.cueOut==span.cueOut;
		if(vbs) vlog('planning.js','P_horiz','setrulers','min:'+time(span.cueIn)+', max:'+time(span.cueOut)+', scale change: '+!noscalechange);
		
		if(noscalechange) return;
		
		// the code below is not executed if the adaptative display does not redefine the span
		this.ruler.deactivate();
		this.ruler = new P_RULER(this.eids.ruler, {orientation:planning.horizontal, cueIn:span.cueIn, cueOut:span.cueOut });
		for(let t in this.sections.get) this.sections.get[t].setruler(this.ruler);
		this.ruler.activate().locate();
	},
	adaptative: function(jsDate) { // for the span of displayed dates, determines the soonest hourly start and latest hourly finish
		let min = 86400, max = 0;
		let date = jsDate.clone();
		
		let register = C_dS_resource.registers.typeId.get();
		for(let type in register) {
			for(let rid in register[type]) {
				let resource = register[type][rid];
				
				let hourlyset = resource.schedule(date); // is false (when no hourly on this date) or is an hourly set 
				let shadows = hourlyset.shadows; // 2 or more in each column
				for(let id in shadows) {
								let shadow = shadows[id];
							let cin = shadow.cueIn, cout = shadow.cueOut;
						let isclosed = (cin==0 && cout==86400); if(isclosed) continue;
						let isedge = (cin==0 || cout==86400) && !isclosed;
					if(isedge) {
						if(cin==0) if(min>cout) min = cout;
						if(cout==86400) if(max<cin) max = cin;
					}
				}
			}
		}
		if(min==86400 && max==0) { min=mobminder.account.rangeIn; max=mobminder.account.rangeOut; } // everybody is on holiday 
		// console.log('min:'+time(min));
		// console.log('max:'+time(max));
		return { cueIn:min, cueOut:max }; // seconds in, and out
	},
	setdate: function(jsdate) {
		this.set(jsdate);
	},
	browsingdates: function(skip) { // the user is busy changing the display date, let's start blurring the screen already
		// this.busy(true); 
		// console.log('P_horiz::browsingdates() skip='+skip);
		let moreanimation = '';
		switch(skip|0) {
			case 4: moreanimation = 'right-ff'; break;
			case 2: moreanimation = 'right-ff'; break;
			case 1: moreanimation = 'right-s'; break;
			case 0: moreanimation = ''; break;
			case -1: moreanimation = 'left-s'; break;
			case -2:moreanimation = 'left-ff';  break;
			case -4:moreanimation = 'left-ff';  break;
		}
		for(let type in this.sections.get) 
			this.sections[type].addclass('.resa','final').addclass('.resa',moreanimation);
	}, 
	highlight: function(resaId, css, cdown, now) {
		// console.log('highlight',resaId, css, cdown, now);
		this.highcancel();
		this.state.highlight = { id:resaId, css:css, countdown:cdown||2, timer:false }; // now wait for a plitem to have executed, then highlight
		if(now) this.highblink();
		return this;
	},
	lastresasaved: function(dSresa) {
		// console.log('P_horiz::lastresasaved() dSresa.id:',(dSresa?dSresa.id:'X'));
		if(!dSresa) return false;
		const $allstickers = $(this.elements.scroll).find('div.sticker');
		$allstickers.removeClass('resa-new');
		const $thesticker = $(this.elements.scroll).find('div.sticker[id$="_'+dSresa.id+'"]');
		$thesticker.addClass('resa-new');
	},
	stickers: function(resa, is, css) { // this function is called when e.g. pointing at an availability slot displayed after a search, a sticker is added on the planning showing where the availability resides
		let stickers = new Array();
		let attendees = resa.resources; //C_dS_attendee.getResources(resa.id);
		let parts = resa.getparts(this.state.midnight); 
		let height = mobminder.account.has.timeboxing ? '80%' : '100%'; // when time-boxing is used, keep 20% height on the bottom of the row so we can display timboxes
		for(let type in attendees) {
			if(!(type in this.sections)) continue; // not in the view of this login
			let html = resa.rdetails(planning.horizontal, type);
			let tiptext = resa.rtip(planning.horizontal, type);
		
					let level = C_dS_details.get(planning.horizontal, type).details;  
				let disbltip = (level&(details.disbltips)); // tips are disabled for this planning orientation and resource type
			let tip = false; if(!disbltip) tip = {text:tiptext, css:'sticker-tip '+resa.tipcss };

			for(let rscid in attendees[type])
				for(let x in parts) {
					stickers.push(this.sections[type].sticker(rscid, parts[x], html, { height:height, align:'top', css:(css||''), tip:tip }, is ));
				}
		}
		return stickers;
	},
	copypaste: function(o) {
		for(let type in this.sections.get) 
			this.sections[type].copypaste(o);
	},
	
	// post feedbacks
	plitems: function(inlineDataSets) { // sets reservations stickers on screen
		if(vbs) vlog('planning.js','P_horiz','plitems','');
				if(measurePlitem) this.microperf.cue('inlineDataSets available');
		this.busy(false);
		
		for(let type in this.sections.get) 
			this.sections[type].cleanup('.resa');
		
		// this.state.resas = inlineDataSets; // PVH 2025 : this was wrong, [] the table pointers differs from rmems['plitems'] and hence is not correct
		this.state.resas = []; this.state.resas['C_dS_reservation'] = rmems['plitems'].resas.get();
		
			const twidth = $(this.elements.wrappertable).width(); // (*w11*) measure the full planning table width (this table changes in width when rows are hidden, in some cases a scroll bar appears/disappears from the desk screen)
		
		this.hplidraw(); // draws stickers according to the ruler calibration

		this.rescope();
						
			const twidthafter = $(this.elements.wrappertable).width();
		if(twidthafter!=twidth)	if(this.state.jsdate) this.onresize(); else this.ruler.locate(); // (*w11*) re-draw stickers due to planning grid width change when scroll bar appears/disappears 
		
		// if(this.state.highlight) this.scopeto(this.state.highlight.id).highblink(); // highlights e.g. a new sticker
		if(this.callbacks.plitems) this.callbacks.plitems.cb(inlineDataSets);
				if(measurePlitem) this.microperf.cue('stickers on screen');
				if(measurePlitem) this.microperf.report('P_horiz::plitems()');
	},
	plitemsfailed: function() {
		this.busy(false);
	},
	
	// event handling
	highblink: function() { // sets the outer frame that highlights sticker(s) of given resa
		const $stickers = $(this.elements.scroll).find('div.sticker[id$="_'+this.state.highlight.id+'"]');
		
		if(this.state.highlight.countdown%2)
			$stickers.removeClass(this.state.highlight.css); // (*tg01*)
		else
			$stickers.addClass(this.state.highlight.css); // (*tg01*)
		
		// console.log('P_horiz::highblink() countdown='+this.state.highlight.countdown+', css:'+this.state.highlight.css);
		
		if(this.state.highlight.countdown) {
			const back = new A_cb(this, this.highblink, this.state.highlight.countdown--);
			return this.state.highlight.timer = setTimeout(function() { back.cb() } , 500);
		} else {
			// this.state.highlight = false; <= prevents highcancel to remove the highlight.css
		}
	},	
	highcancel: function() { // removes the outer frame that highlights a sticker
		
		// console.log('highcancel()');
	
			if(this.state.highlight.timer) clearTimeout(this.state.highlight.timer);
			const $stickers = $(this.elements.scroll).find('div.sticker[id$="_'+this.state.highlight.id+'"]');
			$stickers.removeClass(this.state.highlight.css);
			
		// console.log('P_horiz::highcancel() css'+this.state.highlight.css);
		
		return this;
	},
	scopeto: function(idclue) { // scrolls the screen to the to be highlighted sticker
		if(vbs) vlog('planning.js','P_horiz','scopeto','idclue:'+idclue);
		if(is.tactile)
			if(this.scrolly) {
				let el = $(this.elements.scroll).find('div.sticker[id$="_'+idclue+'"]:eq(0)')[0];
				if(el) { this.scrolly.scrollToElement(el, 0); this.scrolly.scrollTo(-100,0,500,true /*relatively*/) };
			}
		return this;
	},
	key: function(keycode) {
		let nudekey = keycode&=(C_KEY.code.s.alt-1);
		switch(nudekey) {
			case C_KEY.code.alpha.z: break; // zoom
		}
	},
	onresize: function() {
		if(vbs) vlog('planning.js','P_horiz','onresize','');
		this.ruler.locate();
		for(let type in this.sections.get) this.sections[type].cleanup(); // removes eventually a scroll at right side of screen (influences locate())
		for(let type in this.sections.get) this.sections[type].onresize().hourlies(this.state.jsdate);
		if(this.state.resas) this.hplidraw();
		return this;
	},
	ondetails: function() {
		if(this.callbacks.details) this.callbacks.details.cb();
	},
	redraw: function() {  // called when the level of display details is redefined.
		if(vbs) vlog('planning.js','P_horiz','redraw','');
		// console.log('planning.js','P_horiz','redraw','');
		this.setrulers(this.state.jsdate);
		for(let type in this.sections.get) this.sections[type].cleanup('.resa'); // .hourlies(this.state.jsdate);
		if(this.state.resas) {
			this.plitems(this.state.resas);
		}
	},
	sdrop: function(cueable, from, to) {
		rmems.flush('slots');
		let resourceTo = C_dS_resource.get(to);
		let resourceFrom = C_dS_resource.get(from);
		
		if(resourceFrom.resourceType != class_fCal) // only if you drag a bCal or uCal onto an fCal
			if(resourceTo.reservability != reservability_scheduled) { // only if this fCal you drop on has a reservability that is wider than the dropped cueable timing
				// then create an fCal_tracking reservation
				let id = 0;
				new C_dS_attendee('slots', [0, id, resourceTo.resourceType, resourceTo.id]);
				let visitors = cueable.visitors; // C_dS_att_visitor.getResources(cueable.id, class_visitor);
				for(let vid in visitors)
					new C_dS_att_visitor('slots', [-vid, id, class_visitor, vid]);
				let cuein = cueable.midnight + mobminder.account.rangeIn;
				let cueout = cueable.midnight + mobminder.account.rangeOut;
				let peerId = cueable.id;
				cueable = new C_dS_reservation('slots',C_dS_trackingCCD.tnew(id, mobminder.account.id).concat([cuein,cueout, peerId /*peerId*/]));
				return this.callbacks.resaopen.cb(cueable); // opens the modal
			}
		let resamodal = this.callbacks.resaopen.cb(cueable); // opens the modal
		if(vbs) vlog('planning.js','P_horiz','sdrop','from:'+from+', to:'+to);
		return resamodal.changestaff(from, to).tab(2); // returns the resa modal object (the caller hooks up a handler on the escape event)
	},
	onsticker: function(cueable, resource, touching, skeys, mousevent) {
		
		if(cueable instanceof C_dS_resapart || cueable instanceof C_dS_reservation )
			return this.callbacks.resaopen.cb(cueable, mousevent, skeys);
		
		if(cueable instanceof C_dS_timebox) { // (*tb01*) touching a timebox sticker opens a new reservation with respective duration and time cue
				// in this case, cueable is the timebox sticker and touching is the clicked spot on the planning grid
				rmems.flush('slots');
				let midnight = this.state.midnight;
				let resaId = 0;
			let attendee = new C_dS_attendee('slots', [0, resaId, resource.resourceType, resource.id]); // must be present in the 'slots' memory bank, if not, your reservation is not linked to any resource
			
				let cin = cueable.cueIn, cout = cueable.cueOut;
			if(cout-cin>3600) { // the clicked timebox is a long period indication instead of an indication of appointment typical duration
				
				let defaultduration = mobminder.account.secondsPerSlice;
				let setduration = defaultduration;
				switch(defaultduration) {
					case 300: setduration = 900; break; // 900 is 15 minutes
					case 600: setduration = 1200; break; // 1200 is 20 minutes
					default: // keep it like it is
				}
				cin = touching.cueIn;
				cout = cin+setduration;
			}
			
			// or create a new one because obviously, the frame display was hit
			let dS_resa = new C_dS_reservation('slots',C_dS_trackingCCD.tnew(resaId, mobminder.account.id).concat([midnight+cin, midnight+cout]));
			return this.callbacks.resaopen.cb(dS_resa, mousevent, skeys);
		}
		return false;
	},	
	stickenter: function(cueable) { // highlight parts OR assignments of a given reservation
		
		const hassections = this.state.sectionscount > 1;
		if(hassections)
			if(cueable instanceof C_dS_resapart || cueable instanceof C_dS_reservation ) {
				let unique = cueable.groupId+'_'+cueable.id;
				this.highlight(unique, 'resa-hover', 2, true); // (*tg01*)
			}
		this.state.hoversticker = cueable;
		
	},	
	stickleave: function(cueable) {
		// this.highcancel();
		this.state.hoversticker = false;
	},
	aswap: function(from, to) { // swapping two agenda lines (obsolete)
		// PVH 2020 : drag and drop of entire lines is never asked and has been made obsolete, see (*rdd01*)
		if(vbs) vlog('planning.js','P_horiz','aswap','from:'+from+', to:'+to);
		new M_SWAP(this.eids.swap, { swapped: new A_cb(this, this.swapped) }, { fromId:from, toId:to, fromStamp:this.state.midnight });
	},
	swapped: function() { // swapping two agenda lines (obsolete)
		// PVH 2020 : drag and drop of entire lines is never asked and has been made obsolete, see (*rdd01*)
		if(vbs) vlog('planning.js','P_horiz','swapped','');
		mobminder.app.refresh(); // refresh the planning
	},
	
	// private
	rescope: function() { // sorts out what row to hide/show, based on row.state.lockedon, mobminder.app.resourcescope.staffscope and hourly offdays (if details. is set )
			let s = mobminder.app.resourcescope.staffscope;
			let enbld = mobminder.app.resourcescope.enabled;
		for(let type in this.sections.get) { //  (*d02*) hide unused lines (according to options set in details setting)
				let active = s&&enbld;
				let rscidsrray = s[type];
			this.sections[type].offdays(active?rscidsrray:false);
		}		
	},
	split: function(resas) {  // returns sticker information including overlap analysis, sorted by resource type and resource ids
			
		let stickers = new Array(); // arranged by type and rscid, like stickers[type][rscid] = [part1, part2, ...]
		for(let t in this.sections) {
			stickers[t] = new Array();
			for(let rscid in this.sections[t].resources) stickers[t][rscid] = new Array();
		}

		for(let x in resas) {
			let resa = resas[x];
			if(mobminder.app.hidedeleted) if(resa.deletorId) continue;
			let attendees = resa.resources; //C_dS_attendee.getResources(resa.id);
			let parts = resa.getparts(this.state.midnight); // are one of [C_dS_resapart, C_dS_resapart, ...] or [C_dS_reservation]
			
			for(let type in attendees) {
				if(!(type in this.sections)) continue;
				
				let html = resa.rdetails(planning.horizontal, type);
				let tiptext = resa.rtip();
				let tipcss = resa.tipcss;
				
				for(let rscid in attendees[type])
					if(!(rscid in this.sections[type].resources)) continue;
					else for(let x in parts) {
						let part = parts[x];
						let sticker = { cueable:part, html:html, tiptext:tiptext, tipcss:tipcss, overlayLane:1, overlayWays:1 };
						stickers[type][rscid].push(sticker);
					}
			}
		}
		return stickers;
	},
	hplidraw: function(css) {
		css = css||'';
		const resas = this.state.resas['C_dS_reservation'];
		const dayin = this.state.midnight, dayout = this.state.midnight+86400;
		const coveringresas = new Array();
		for(let id in resas) { 
			const resa = resas[id];
			const covers = (resa.cueIn <= dayout && resa.cueOut >= dayin); // to enter the display, you MUST cover the current display.
			if(covers) { coveringresas.push(resa); }
		}
		
		const height = mobminder.account.has.timeboxing ? '80%' : '100%'; // when time-boxing is used, keep 20% height on the left of the column to display timboxes
		
		const stickers = this.split(coveringresas);
		
		// defining overlaps lanes and ways
		for(let type in stickers) {
			const tsplits = stickers[type]; // is an array indexed like [rscid1][0:part, 1:part, 2:part,...], [rscid2][0:part, 1:part, 2:part,...]
			for(let rscid in tsplits) {
				const rsplit = tsplits[rscid]; // concerns one resource display line
				P_Sticker.overlaps(rsplit);
			}
		}

		// display
		for(let type in stickers) {
			
					const level = C_dS_details.get(planning.horizontal, type).details;  
				const disbltip = (level&(details.disbltips)); // tips can be disabled for this planning orientation and resource type, see (*dt*)
			
			const tsplits = stickers[type]; // is an array indexed like [rscid1][0:part, 1:part, 2:part,...], [rscid2][0:part, 1:part, 2:part,...]
			for(let rscid in tsplits) {
				const rsplit = tsplits[rscid];
				for(let x in rsplit) {
					const sticker = rsplit[x];
					const is = { resa:true, draggy:true, overlayWays:sticker.overlayWays, overlayLane:sticker.overlayLane };
					// let tip = false; if(!disbltip) tip = { text:sticker.tiptext, css:'sticker-tip '+sticker.tipcss }; // see (*st11*)
					const tip = disbltip ? false : { text:sticker.tiptext, css:'sticker-tip '+sticker.tipcss }; // see (*st11*)
					this.sections[type].sticker(rscid, sticker.cueable, sticker.html, { height:height, align:'top', css:css, tip:tip }, is );
				}
			}
		}
		
		if(vbs) vlog('planning.js','P_horiz','hplidraw','');
	},
	query:function(stamp) {
		let post = new C_iPASS({stamp:stamp, days:1, rescId:0, fulldays:0 ,sms:0, peers:1 });
		let names = {post:{stamp:'stamp',days:'days',rescId:'rescId',fulldays:'fulldays', sms:'sms', peers:'peers'}};
		mobminder.app.post({post:post}, names, './queries/plitems.php', new A_cb(this,this.plitems), new A_cb(this,this.plitemsfailed));
	},
	zoom: function(onoff) {
		
		let scrollmode = 'hidden'; if(onoff) scrollmode = 'scroll';
		if(vbs) vlog('planning.js','P_horiz','zoom','---------------------------------------------state:'+onoff);
		
		if(is.tactile) {
			this.scrolly.scrollTo(0, 0);
		} else {
			this.elements.scroll.scrollTop = 0;
			this.elements.scroll.style['overflow-x'] = scrollmode; // (*zm002)
		}
		if(this.state.jsdate) this.onresize(); else this.ruler.locate();
		
		if(this.scrolly) this.scrolly.refresh(); // touch devices use iScroll for horizontal scrolling
		if(this.smoothscroll) this.smoothscroll.enable(onoff); // mouse wheel acts on horizontal scroll
	},
	
	// scroll handling
	iScrolling: function() { // iScroll events - tactile only -
		if(!this.state.scrolling) { // calls only once above
			if(vbs) vlog(this.eids.sections,'P_horiz','iScrolling','cancel:sticker+plangrid');
			if(this.callbacks.scrollstart) this.callbacks.scrollstart.cb();
			P_GRID.dragging = false; P_Sticker.state.down = false; // (*event cancel)
			this.state.scrolling = true;
		}
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.elements.scroll.iscrollLeft = -this.scrolly.x;
		if(vbs) vlog(this.eids.sections,'P_horiz','iScrolldone','scroll position:'+this.scrolly.x);
		this.state.scrolling = false;
		this.ruler.locate();
		return true;
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   V E R T I C A L    P L A N N I N G    C O L U M N 
//
function P_column(eid, ruler, resource, date, preset, callbacks) {
	this.date = date; 
	this.stamp = date.stamp();
	this.ruler = ruler;
	this.state = P_column.defaults.align(preset);
	this.resource = resource;
	this.hourlyset = this.resource.schedule(this.date); // is false (no hourly) or an hourly set, see (*hl01*) in datasets.js
		const e = eid+'_'+this.stamp+'_';
	this.eids = { eid:eid, td:e+'td', dtd:e+'dtd', axis:e+'axis', stickers:e+'sticker', date:e+'date' };
	this.elements = new A_el();
	this.callbacks = callbacks; // i.e. { ondate:, hover:, sticker:, dpchanged:, dpchanging:, touchdrag:, touchstart:, stickenter:, stickleave: }
	
	this.handlers = { handledown:new A_cb(this, this.handledown), onsticker:new A_cb(this, this.onsticker), stickenter:new A_cb(this, this.stickenter), stickleave:new A_cb(this, this.stickleave) };
	this.events = new A_hn({ enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), move:new A_cb(this, this.move) });
	this.controls = new A_ct({});
	this.touchdrag = false; // initiated at activation
	
	if(this.state.colheader) {
		let weekcode = ''; // for hourlies rotating on more than one week, indicates the week number
		if(this.hourlyset) if(this.hourlyset.hourly.periodicity>1) weekcode = '<b style="font-size:80%;">('+this.hourlyset.weekcode+')</b>&nbsp;';

		const hname = this.hourlyset.hourly.name;
		const hnote = this.hourlyset.hourly.note;
		let fulldate = C_XL.date(this.date, {abreviation:'full', weekday:true, cap:1 });
		let csscolor = 'mob-txt-gray_d';
		
		const ishchange = this.hourlyset.dayIn == this.date.stamp();
		const isexcphourly = this.hourlyset.hourly.is.exceptional;
		
		if(ishchange) { // right on a dayIn event
			if(isexcphourly) { csscolor = 'mob-txt-lime-thick'; fulldate = '<div>'+fulldate+'<span style="font-size:80%;"> ( '+C_XL.w('exceptional_hourly')+' )</span></div>'; }
			else { // new recurring hourly
				const recurring = '<div class="fas fa-sync fa-09x"></div>';
				const hourlychange = '<div style="">'+fulldate+' : '+C_XL.w('hourly change')+'</div>';
				const newhourlyname = '<div style="" class="">'+C_XL.w('from_thisday_on')+':&nbsp;&nbsp;'+recurring+'&nbsp;&nbsp;'+hname+' </div>';
				const newhourlynote = hnote?'<div style="font-size:85%; padding-top:1em;" class="mob-txt-gray_d">'+hnote+'</div>':'';
				csscolor = 'mob-txt-blue'; fulldate = hourlychange+newhourlyname+newhourlynote;
			}
		} else { // recurring hourly or no hourly at all
			if(this.hourlyset.hourly) {
				const recurring = '<div class="fas fa-sync fa-09x"></div>';
				const newhourlynote = this.hourlyset.hourly.note?'<div style="font-size:85%; padding-top:1em;" class="">'+this.hourlyset.hourly.note+'</div>':'';
				fulldate = fulldate+'<div style="">( '+C_XL.w('availability set')+': '+recurring+' '+this.hourlyset.hourly.name+' )'+newhourlynote+'</div>';
			} else {
				fulldate = fulldate+'<div style="">( '+C_XL.w('no_hourly')+' )</div>';
			}
		}
		const tip = '<h3 style="padding:0 0 .4em .6em; line-height:1.5em; font-size:100%;" class="'+csscolor+' centered">'+fulldate+'</h3>'; // that is a very clear and explicit tip :)
		
		const front = weekcode+C_XL.weekday(this.date.getPHPday())+'<br/>'+C_XL.date(this.date, {abreviation:'abr'});
		const preset = { tag:'div', css:'v-date', style:'height:'+P_column.dateHeight+'; pointer-events:auto;', ui:front, tip:{text:tip} }
		const cbacks = { down:new A_cb(this, this.downOnDate), click:new A_cb(this, this.ondate)}

		const date = new C_iCLIK(this.eids.date, cbacks, preset );
		
		this.controls.add1(date, 'date');
	}
	this.shadowstypes = C_XL.w({ 0:'unavailable', 1:'excp', 5:'closed day' });
		const s = 'z-index:-5; position:absolute; top:0; bottom:0; left:5%; right:5%;'; // adjusting width? see (*vp01*)
	this.track = '<div class="v-track" style="'+s+'"></div>'; // anchors to relative td (*r2)
}
P_column.defaults = new A_df( { 
			  colheader:true, maydraw:true, freedragcss:'', hovercue:false
			, hourlynames:false, hourlyflex:false
			, minfreesize:false
			, drawing:false // contains a P_Sticker when the user starts down dragging on the planning
			, copypasting:false  // contains { cueable:dS_reservation, sticker:P_Sticker} when the user activates a copy/paste mode	
			, touching:false  // cueable as passed by touching() callback from P_GRID
			} );
P_column.dateHeight = '3em';
P_column.prototype = {
	column: function(percents) { // returns a td
			
			const axis = '<div id="'+this.eids.axis+'" class="v-axis" style="width:0px; height:0px; margin:0 auto; position:relative;"></div>'; // reference for all stickers positionning
			const msiefix = (is.browser.MSIE)?'<div style="postion:relative; height:'+C_iWIN.size.h+'px;">'+axis+this.track+'</div>':axis+this.track; // fixing MSIE CSS2.1 shit (td can not be relative for an inner div, so we force a height for the track and set overflow:hidden in the td)
		const td = '<td class="P_column" id="'+this.eids.td+'" style="width:'+percents+'%; text-align:center; position:relative;">'+msiefix+'</td>'; // (*r2)  overflow:hidden;
		return td;
	},	
	colheader: function(percents) { // returns a td // multi column display requires a date indication on top of the column, hence this function
		if(!this.state.colheader) return '';
		
		// define what backgroud color to show on the date display, according to hourly changes
		//
		let css = ''; 
		if(this.hourlyset.hourly.is.exceptional) css = 'hourly_excp_day bold'; // always show exceptional days in this css style
			else if(this.hourlyset.dayIn==this.stamp) { // right on the start date of an hourly
				
				// then we are on the date where a periodic hourly comes into force
				// we need to check:
				// - if this is a come back change, bridge (after one or more exceptional days) -> in this case we do not display any background
				// - or if a new periodic hourly is installed on this date -> in this case we bold the date
				
				const dS_hourlyuser = C_dS_hourlyuser.registers.bydayin.get(this.resource.id, this.hourlyset.dayIn);
				const dS_hourly = this.hourlyset.hourly;
				const c = dS_hourly.colorOff; // this color appears on top and bottom of open hourly days
				const previousperiodic = dS_hourlyuser.previous({periodic:true});
				
				if(previousperiodic) {
					const arediffhourlies = previousperiodic.hourly().id != dS_hourly.id;
					if(arediffhourlies) { // we highlight it because it is not a bridge to previous regular hourly (PVH2025 - bridges will disappear because a new recording method is adopted
						css = 'hourly_change_day c'+c+' bold'; 
					}
				}
				else {
					css = 'hourly_change_day c'+c+' bold'; // no previous, this is the very very first ever start on a recurring houly
				}
			} else {
				// the only remaining possible case is that we are actually displaying today date
			
				// const displayed = mobminder.app.dp.jsdate(); // PVH 2025: removed because it brings no relevant information on the screen, see (*vv01*)
				// if(displayed.toMidnight().sameday(this.date)) css += ' islected';
			}
			const today = new Date();
			if(today.toMidnight().sameday(this.date)) css += ' istoday'; // blue bold in coherence with the type of highlight we apply for selected day (blue)
		
				const div = this.controls.date.display('v-date '+css);
			const td = '<td id="'+this.eids.dtd+'" style="width:'+percents+'%; text-align:center; position:relative;">'+div+this.track+'</td>'
		return td;
	},
	activate: function() {
		
		if(vbs) vlog('planning.js', 'P_column', 'activate', 'eid:'+this.eids.eid,'',this.copypasting); 
		
		this.elements.collect(this.eids);
		this.controls.activate('P_column');
		this.measure().hourly();
		if(this.state.maydraw)
			this.touchdrag = new P_GRID(this.elements.td, this.ruler 
				, { touched:new A_cb(this, this.touched), touching:new A_cb(this, this.touching), movesin:new A_cb(this, this.movesin), movedout:new A_cb(this, this.movedout) }
				, {minsize:this.state.minfreesize} );
		
		if(!is.tactile) $(this.elements.td).mouseenter(this.events.enter); // row highlight 
		return this;
	},
	sticker: function(cueable, html, preset, is) {
		is = is || {}; preset = preset || {};
		const w = this.metric.w;
		const ways = is.overlayWays || 1;
		const lane = is.overlayLane || 1;
		let bandw = w;
		let margin = 0;
		
		// e.g. Case of right alignent (margin at left side, 2 ways)
		//
		//    |margin|        <- bandwidth ->        |
		//    |      |                               |
		//    |      |               |               |
		//    |      | <-lanewidth-> |               |
		//    |      |               |               |
		// ---|------|---------------|---------------|----> left
		//    0                                      w
		//
		
		if(preset.width) {
			if(preset.width.substr(-1)=='%') { let pc=preset.width.substr(0,preset.width.length-1)|0; bandw=w*pc/100; margin = w-bandw; }
			if(preset.width.substr(-2)=='px') { let px=preset.width.substr(0,preset.width.length-2)|0; bandw=px; margin = w-bandw; }
		}
		const lanewidth = bandw/ways;
		
		if(preset.align) {		
			switch(preset.align) {
				case 'left': 	margin = 0; break;
				case 'middle': 	margin = margin/2; break;
				case 'right': 	break;
			}
		}
		
		const left = margin+(lane-1)*lanewidth-w/2;
		
		const size = this.size(cueable);
		const metric = { height:size.height-1 , width:lanewidth-1 , left:left, top:size.top }; // -1 is the 1px border set in css for resa stickers
		
		const isstarter = (cueable.cueIn-cueable.midnight == this.ruler.cues.first) ? 'starter' : '';
		const isender = (cueable.cueOut-cueable.midnight == this.ruler.cues.last) ? 'ender' : '';
		
		const timecss = 'at'+time(cueable.cueIn-cueable.midnight, 'h',true,'m');
		
		// display
		const css = new Array(cueable.css, size.css || '', preset.css || '', isstarter, isender, timecss); // preset sets hourly or reservation, cueable gives the color, trimcss cuts the drawing when extend goes beyond planning borders
		const handles = preset.handles ? { top:size.hangtop, bottom:size.hangbottom } : false; // puts handles at sticker sides that are not cropped
		const onsticker = is.idle ? false : this.handlers.onsticker;
		const sticker = new P_Sticker(this.eids.stickers, cueable, { onsticker:onsticker, handledown:this.handlers.handledown, enter:this.handlers.stickenter, leave:this.handlers.stickleave }, { handles:handles, copypaste:preset.copypaste });
		$(this.elements.axis).append(sticker.display(metric, css.join(' '), '<div>'+html+'</div>', preset.tip));
		
		// activate
		sticker.activate();
		
		return sticker;	
	},
	measure: function() {
		this.metric = { x:$(this.elements.td).position().left-1, w:$(this.elements.td).width()-1 }; // locates this element in the parent relative div
		if(vbs) vlog('planning.js','P_column','measure','date:'+this.date.sortable()+', x:'+this.metric.x+', w:'+this.metric.w);
		return this;
	},

	copypaste: function(options) { // see (*cp01*) and  (*cp02*) that re-links all copy-paste flows
		
		if(vbs) vlog('planning.js','P_column','copypaste','options:','',options); 

		if(options===false) { // de-activates copypaste
			this.touchdrag.copypaste(false);
			this.state.copypasting = false;
			return false;
		}
		this.state.copypasting = { cueable:options.ds, sticker:false, cut:options.cut }; // (*cp03*)
		this.touchdrag.copypaste(true);
		return true;
	},
	
	// privates
	size: function(cueable) { // converts time to vertical pixel positionning
			let i = cueable.cueIn-cueable.midnight; // i and o have only seconds information (date is dropped)
			let o = cueable.cueOut-cueable.midnight;
		if(cueable.timeshift) { i-=cueable.timeshift; o-=cueable.timeshift }; // takes care of daylight saving, two sundays in a year
	
		i = this.ruler.metric(i);  // i { position:top, size:height }
		o = this.ruler.metric(o);
			
		const h = o.position - i.position;
		const trimcss = new Array(i.css, o.css); // specifies trimming css postfix, left or right
		return { height:h , top:i.position+0.5, css:trimcss.join(' '), hangtop:i.css=='', hangbottom:o.css=='' };
	},
	hourly:function() { // paints the hourly on the graphical view
		// this.hourlyset = { dayIn:, hourly:, shadows:, tboxes:, offday:, daycode:, weekcode: }; // that is a date with its related hourly // shadows:[shadowId] = o_dS_shadow
		if(!this.hourlyset) return this; // this.hourlyset = this.resource.schedule(this.date);
		const hourly = this.hourlyset.hourly; // current dS_hourly for this.date
		const shadows = this.hourlyset.shadows; // 2 or more in each column
		const tboxes = this.hourlyset.tboxes; // might be void
		if(vbs) vlog('planning.js','P_column','hourly','date:'+this.date.sortable()+', hourly name:'+hourly.name);
		let label = '';
		let idle = !this.state.hourlyflex; // hourly stickers have interactivity in hourly mode where they can be sized / updated (hourly setting screen)
		
		// 1 of 2 shadows
		for(let id in shadows) {
			let shadow = shadows[id];
			if(this.state.hourlynames) {
				const isclosed = (shadow.cueIn == 0 && shadow.cueOut == 86400);
				const isedge = (shadow.cueIn == 0 || shadow.cueOut == 86400) && !isclosed;
				const isanyother = !(isclosed||isedge);
				// let disptop = (shadow.cueIn == 0) || isclosed;
				const dispbottom = (shadow.cueOut == 86400) && !isclosed;
				
				// let valign = ''; //'vertical-align:middle;'; if(disptop) valign = 'vertical-align:top;'; if(dispbottom) valign = 'vertical-align:bottom;';
				
				let hstyle = ''; if(isedge || isclosed) hstyle = 'line-height:0.90em;';
				const shadtype = this.shadowstypes[shadow.exceptional];
				let display = hourly.name; if(isanyother) display = shadtype; else if(isclosed) display = hourly.name+'<br/>&nbsp;<br/>'+shadtype;
				label = '<div class="caption" style="'+hstyle+'">'+display+'</div>';
			}
			this.sticker(shadow.clone(), label, { width:idle?'30%':'60%', css:idle?'idle':'', align:'middle', handles:this.state.hourlyflex, tip:false }, {idle:idle}); // handles appear on the stickers and they can be adjusted by click drag interactivity
		}
		
		// 2 of 2 time boxing
		idle = false; // time boxing can be clicked either in hourly display and vertical display, see (*tb01*)
		
			// the reservations stickers must have the remaining width, see (3*)
					const level = C_dS_details.get(planning.vertical, this.resource.resourceType).details; 
				const disbltip = (level&(details.disbltips)); // tips can be disabled for this planning orientation and resource type, see (*dt*)
				const labeltboxing = !!(level & details.timeboxing); // the name of corresponding time boxing category appears on the time box sticker
			let width = '10%'; // when used on the vertical standard week view
			if(labeltboxing) width = '20%'; // when used on the hourlies setting screen
			if(this.state.hourlyflex) width = '40%'; // extends the timeboxes width when hourly view is active
		for(let id in tboxes) {
				const tbx = tboxes[id]; // is an instance of C_dS_timebox
				const tboxing = C_dS_timeboxing.get(tbx.timeboxingId);
				let tag = tboxing.tag?C_iSKIN.tagcss(tboxing.tag):'';
					tag = tag?'<div class="'+tag+'" style="font-size:1.3em;"></div>':'';
				const name = tboxing.name;
				let tip = false; if(!disbltip) tip = {text:tboxing.tbtip(tbx.cueIn, tbx.cueOut, {vertical:true}), css:'sticker-tip timebox-tip timebox-vertical '+tboxing.cssName, delay:1500};
				if(this.state.hourlynames || labeltboxing) // when in hourly view, time boxing is always labelled (diregarding the level & details.timeboxing setting)
						tag = tag?tag+'<br/>'+name:name;
				label = '<div style="">'+tag+'</div>';
			
			this.sticker(tboxes[id].clone(), label, { width:width, align:'left', handles:this.state.hourlyflex, tip:tip }, {idle:idle});
		}
		return this;
	},
	
	// event handling
	stickenter: function(cueable, sticker) { // mouse pointer enters a sticker area
		if(vbs) vlog('planning.js','P_column','stickenter','in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)); 
		this.ruler.dotlight(false).timelight(false).dohighlight(false); // sets this.ruler.state.dohighlight to false
		if(this.callbacks.stickenter) this.callbacks.stickenter.cb(cueable, sticker);
	},
	stickleave: function(cueable, sticker) { // mouse pointer leaves a sticker area
		if(vbs) vlog('planning.js','P_column','stickleave','in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)); 
		if(this.callbacks.stickleave) this.callbacks.stickleave.cb(cueable, sticker);
		this.ruler.dohighlight(true); // sets this.ruler.state.dohighlight to true
	},
	movesin: function(cue) {
		
		if(vbs) vlog('planning.js','P_column','movesin','date:'+this.date.sortable()+' | cue:'+time(cue)); 
		// return true; 
		
		let cueable = this.state.copypasting.cueable.changecue(this.stamp+cue); // that is a dS_reservation 
		let html = cueable.rdetails(planning.vertical, this.resource.resourceType);
		
		if(this.state.copypasting.sticker) { // the drawing is on the screen yet, we only need to move it
				// let duration = cueable.cueOut - cueable.cueIn;
			this.state.copypasting.sticker.adjust(this.size(cueable), html); // html shows updated time/date
		}
		else { // we need to create the sticker
			this.state.copypasting.sticker = this.sticker(cueable, html, { css:'resa-copypaste', copypaste:true }, {idle:true} );
		}
	},
	movedout: function(cue) {
		if(vbs) vlog('planning.js','P_column','movedout','date:'+this.date.sortable()+',in:'+time(cue)+',out:'+time(cue));
		
		if(this.state.copypasting) this.state.copypasting.sticker.remove();
		this.state.copypasting.sticker = false; 
		return true;
	},
	enter: function(e) {
		this.move(e); this.colight(true);
		$(this.elements.td).mousemove(this.events.move).mouseleave(this.events.leave);
	},
	move: function(e) {
		let cue = this.ruler.mousecue(e).cue; 
		if(this.state.hovercue == cue) return true; else this.state.hovercue = cue;
		if(!this.state.touching) this.ruler.dotlight(cue).timelight(cue); // we stop red time lining while touch and drag is ongoing
		return true;
	},
	leave: function() {
		this.colight(false);
		this.ruler.dotlight(false).timelight(false);
		$(this.elements.td).unbind('mousemove',this.events.move).unbind('mouseleave',this.events.leave);
		this.state.hovercue = false;
	},	
	colight: function(onoff) {
		$(this.elements.td).removeClass('colight'); if(onoff) $(this.elements.td).addClass('colight'); 
		$(this.elements.dtd).removeClass('colight'); if(onoff) $(this.elements.dtd).addClass('colight'); 
		return this;
	},
	touching: function(cueable, dragging, cue) { 
		// cueable arrives from the P_GRID with cueIn = where you clicked down and cueOut = the current mouse position
		// the return value confirms to P_GRID.down() that dragging is allowed (true) or disallowed (false)
		
		const touched = this.state.touching;
		const isstarton = (touched===false && cueable);
		if(isstarton) this.ruler.dotlight(false).timelight(false);
		this.state.touching = cueable; // keep this info so we can use it e.g. here (*tb02*)
		
		if(this.state.copypasting) { // then the user clicks where he wishes to paste an item
			if(vbs) vlog('planning.js','P_column','touching copypaste mode','date:'+this.date.sortable()+',in:'+time(cueable.cueIn)); 
			// console.log('planning.js','P_column','touching copypaste mode','date:'+this.date.sortable()+',in:'+time(cueable.cueIn)); 
			let cue = this.state.copypasting.cueable;
			
				const ids = [];
				ids[this.resource.resourceType] = []; ids[this.resource.resourceType].push(this.resource.id); // our currently displayed bCAl, uCal or fCal
				
			cue.changeattendance(ids, {rscsonly:true} ).rmeta(); // so to change the resource assignment according to the curretly displayed vertical view

			const modal = this.onsticker(cue); // engage the modal display
	
				modal.callbacks['escaped'] = new A_cb(this, this.touchescaped, modal.callbacks.escaped); // re-route the modal callback to this object
				const html = cue.rdetails(planning.vertical, this.resource.resourceType);
			this.state.drawing = this.sticker(cue, html, { css:'resa-copypaste', copypaste:true }, {idle:true} ); // 

			return false; // un-confirm down dragging action to P_GRID
		}
		
		const handle = P_Sticker.state.handle;
		if(handle) { // case of existing sticker resizing
			if(isstarton) {
				this.state.oricuein = handle.sticker.cueable.cueIn;
				this.state.oricueout = handle.sticker.cueable.cueOut;
			}
			if(vbs) vlog('planning.js','P_column','touching handle','date:'+this.date.sortable()+',in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)+',dragging:'+dragging); 
			switch(handle.which) { // opposit cue must remain unchanged
				case 'handle-top':
					// cueable.cueOut = handle.sticker.cueable.cueOut;
					if(cue<handle.sticker.cueable.previous.cueOut) return false; // sticker may not overlap previous sticker
					if(cue>=handle.sticker.cueable.cueOut) return false; // sticker cannot be flipped upside-down
					if(cue>=this.ruler.cues.last) return false; // bottom limit for dragging handle
					handle.sticker.cueable.cueIn = cue; // note that this modifies the original cueable (e.g. dataSet_shadow)
					break;
				case 'handle-bottom': 
					cue += mobminder.account.secondsPerSlice; // P_GRID reports slice start time
					// cueable.cueIn = handle.sticker.cueable.cueIn; 
					if(cue>handle.sticker.cueable.next.cueIn) return false; // sticker may not overlap next sticker
					if(cue<=handle.sticker.cueable.cueIn) return false; // sticker cannot be flipped upside-down
					handle.sticker.cueable.cueOut = cue; // note that this modifies the original cueable (e.g. dataSet_shadow)
					break;
			}
			handle.sticker.adjust(this.size(handle.sticker.cueable));
			handle.sticker.timeon();
			return true;
		}
		if(P_Sticker.state.down) return false; // a sticker was clicked
		if(!cueable) return; // leaving the drag zone
		
		// case of free slots dragging
		if(vbs) vlog('planning.js','P_column','touching free slots','date:'+this.date.sortable()+',in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)+',dragging:'+dragging); 
		
		if(dragging==1) { // that is the creation of a new sticker by touching a free slot
			if(this.callbacks.touchstart)
				if(this.callbacks.touchstart.cb(this.date, cue) == false)
					return false; // false: do not proceed any longer with touchdrag
			this.state.drawing = this.sticker(cueable, '', { css:this.state.freedragcss, width:'90%', align:'middle' }, {idle:true} );
			this.state.drawing.timeon();
		} 
		else { // else this is the next step in a dragging of a new sticker
			if(this.callbacks.touchdrag) {
				if(this.callbacks.touchdrag.cb(this.date, cueable, cue) == false) {
					return false; // false: do not proceed any longer with touchdrag
					}
			}
			this.state.drawing.cueable = cueable; // as long as we draw in allowed areas, update the .cueable in the sticker object
			this.state.drawing.adjust(this.size(cueable));
			this.state.drawing.timeon();
		}
		
		return true; // true: proceed with touchdrag
	},
	touched: function(cues,mousevent) { 
			const handle = P_Sticker.state.handle;
			let modal = false;
			const skeys = {ctrlkey:mousevent.ctrlKey, shiftkey:mousevent.shiftKey}; // little package
		
		if(handle) { // case of sticker resizing	
			if(vbs) vlog('planning.js','P_column','touched handle','date:'+this.date.sortable()+',in:'+time(handle.sticker.cueable.cueIn)+',out:'+time(handle.sticker.cueable.cueOut));
			if(this.callbacks.adjusted) modal = this.callbacks.adjusted.cb(handle.sticker.cueable, this.date, this.state.oricuein, this.state.oricueout, mousevent); 
			handle.sticker.handledone();
			modal.callbacks['escaped'] = new A_cb(this, this.handlescaped, modal.callbacks.escaped); 
				this.state.oricuein = -1;
				this.state.oricueout = -1;
				this.state.touching = false;
			return;
		}
		this.state.touching = false;
		
		// case of free slots dragging
		displayedcues = this.state.drawing.cueable||cues; // this forces the modal to use timing AS DISPLAYED, ||cues covers iPad behaviour (no dragging possible, it mismatched with screen scrolling)
		if(vbs) vlog('planning.js','P_column','touched free slots','date:'+this.date.sortable()+',in:'+time(displayedcues.cueIn)+',out:'+time(displayedcues.cueOut));
		modal = this.callbacks.newsticker.cb(displayedcues, this.date, mousevent, skeys); // opens the modal. If no permission for this user, the callback returns false
		
		if(!modal) {
			if(this.state.drawing) this.state.drawing.remove();
			this.state.drawing = false;
		} else {
			// now we let the escaped event come back here (so we can remove the drag image when done with the resa modal). Note that we keep track of the original handler and pass it as argument in the o_callback that we make here
			modal.callbacks['escaped'] = new A_cb(this, this.touchescaped, modal.callbacks.escaped); // see (*sh04*)
			setTimeout( (that) => { that.state.drawing.timeon() }, 100, this);
		}
	},
	ondate: function(clicky, ctrlkey, mousevent) {
		if(this.callbacks.ondate) return this.callbacks.ondate.cb(this.date.clone().toMidnight(), this.resource.id, this.hourlyset, mousevent);
	},	
	downOnDate: function() { return false; /* prevents P_GRID to trigger on the date area */	},
	
	// callbacks:
	touchescaped: function(originalhandler) { // a touch was made, resa modal opened, but the user closed or escaped the modal
		if(vbs) vlog('planning.js','P_column','touchescaped',''); 
		if(this.state.drawing) this.state.drawing.remove();
		this.state.drawing = false;
		if(originalhandler) originalhandler.cb();
	},
	handlescaped: function(originalhandler) { // a touch was made, the sticker got stretched, but the user closed or escaped the modal
		if(vbs) vlog('planning.js','P_column','handlescaped',''); 
		if(originalhandler) originalhandler.cb();
	},
	handledown: function(o_sticker) {
		if(vbs) vlog('planning.js','P_column','handledown',''); 
	},
	onsticker: function(cueable, mousevent,skeys) {
		if(vbs) vlog('planning.js','P_column','onsticker','id:'+cueable.id); 

		const touching = this.state.touching; // the parent process needs to have the touching info
		this.state.touching = false; // but the state must go back to false
		if(this.callbacks.sticker) return this.callbacks.sticker.cb(cueable, this.date, touching, mousevent, skeys); // returns a modal
		else return false;
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H O U R L I E S     S E T T I N G
//
function P_hourly(eid, callbacks, preset) {

	this.resource = C_dS_resource.get(preset.rescId);
	const e = eid+'_'+this.resource.id+'_hourlies_';
	this.eids = { e:e, rulerbox:{left:e+'r_l',right:e+'r_r'}
		, ruler:e+'ruler', tr:e+'tr', dtbl:e+'dtbl', dtr:e+'dtr', fr:e+'fr'
		, scroll:e+'scroll', portvw:'pvw', ltr:e+'ltr', vdays:e+'day', grid:e+'grid', busy:e+'busy', overlay:e+'ovrl'
	};
	this.elements = new A_el();
	this.handlers = new A_hn();
	this.events = { // passed to P_column in this.set();
		ondate:new A_cb(this, this.ondate), hover:new A_cb(this, this.hover),
		touchstart: new A_cb(this, this.touchstart), touchdrag: new A_cb(this, this.touchdrag),
		newsticker:new A_cb(this, this.newsticker), sticker:new A_cb(this, this.sticker), adjusted:new A_cb(this, this.adjusted),
		stickenter:new A_cb(this, this.stickenter), stickleave:new A_cb(this, this.stickleave)
	};
	this.status = P_hourly.defaults.align(preset);
	this.status.percents = (100/this.status.days)|0;
		const span = { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };
	const ruler = new P_RULER(this.eids.ruler, {orientation:planning.vertical, cueIn:span.cueIn, cueOut:span.cueOut });
	this.slicing = 's'+mobminder.account.secondsPerSlice/60;
	this.controls = new A_ct({ ruler:ruler, vdays:new A_ct() });
	this.callbacks = callbacks;
}
P_hourly.defaults = new A_df( { midnight:false, busy:false, hidden:false, rescId:0, days:7, percents:14 } );
P_hourly.prototype = { // displays a vertical week view. Uses one or multiple instances of P_column, just like P_Vertical

	// public
	display: function() {
		const rulerLeft = this.controls.ruler.display({dots:true, timestick:false, labels:true, timestamps:true} );
		const rulerRight = this.controls.ruler.display({eid:this.eids.ruler+'_idle', labels:true, timestamps:true } ); // double display for this ruler, see (*ps02*)
		
			const gridtr = '<tr id="'+this.eids.tr+'" style="vertical-align:top; height:100%;"><td>&nbsp;</td></tr>'; // see (*ph01*) where it is filled
			// position absolute here is a way to address a chrome issue in 2025, where Firefox displays this table with height:100; while Chrome displays height:0px ... so I fixed it by positionning the following table.
		const columns = '<table style="position:absolute; inset:0; width:100%; height:100%; min-height:100%; border:none; border-width:0px; table-layout:fixed;">'+gridtr+'</table>'; // rulerdumb gives the height to the column td and hence the height perceived by (*r2)

		// outer frame with left and right rulers
		const tdleft = '<td style="width:2.5em;"><table id='+this.eids.rulerbox.left+' class="ruler ruler-main '+this.slicing+'">'+rulerLeft+'</table></td>';
		const tdright = this.status.days>1 ? '<td style="width:2.5em;"><table id='+this.eids.rulerbox.right+' class="ruler '+this.slicing+'">'+rulerRight+'</table></td>' : '';
		const tdcolumns = '<td id="'+this.eids.grid+'" class="vertical-columns" style="height:100%; position:relative;">'+columns+'</td>';
		
		let datesdiv = '';
		if(this.status.days>1) {
			const dates = '<table class="v-dates" style="width:100%;"><tr id="'+this.eids.dtr+'" style="vertical-align:top; height:3em;">'+'<td></td>'+'</tr></table>'; // this.elements.dtr is filled by this.set()
					const dtds = '<td class="scrollmate"></td>'+'<td class="v-dates">'+dates+'</td>'+'<td style="width:2.5em;"></td>'; // scrollmate has a different width depending on visible scroll bar
				const dtr = '<tr style="vertical-align:top;">'+dtds+'</tr>'; 
			const datestbl = '<table id="'+this.eids.dtbl+'" class="P_hourly" style="width:100%; table-layout:fixed;">'+dtr+'</table>';
			datesdiv = '<div class="vshade" style="pointer-events:none; position:absolute; top:0; right:0; left:0; height:50px; z-index:+20;">'+datestbl+'</div>';
		}
		
			const fontsize = ' sticker-font'+mobminder.account.stiFontSize;
		const table = '<table class="vertical-grid '+fontsize+'" style="width:100%; table-layout:fixed; height:100%;"><tr id="'+this.eids.fr+'" style="vertical-align:top;">'+tdleft+tdcolumns+tdright+'</tr></table>';
			// table-layout:fixed; prevents the table to be larger than the container div
			
		const wrapper = '<div id="'+this.eids.ltr+'" style="direction:ltr; position:relative; height:100%;">'+table+'</div>'; // scrolling inset, direction rtl sets the scrollbar on the left side
		
		let p024padder = '0px', r24css = ''; // only for accounts with a 0h - 24h planning 
		if(mobminder.account.is.range024) { p024padder = '40px'; r24css = ' range024'; }
		
			const scstyle = 'height:calc(100% - '+p024padder+'); overflow-y:scroll; overflow-x:hidden; position:relative; direction:rtl;'; // border:2px solid red; 
		const scrollr = '<div id="'+this.eids.scroll+'" class="vertical-section" style="'+scstyle+'">'+wrapper+'</div>'; // scroll wrapper
		
		const padder = '<div style="height:'+p024padder+'; min-height:'+p024padder+'; display:block;">'+'</div>';
		const ccount = this.status.days == 1 ? ' oneday': ' multidays';
		const scrollrdiv = '<div class="P_hourly'+r24css+ccount+'" id="'+this.eids.portvw+'" style="position:absolute; bottom:0px; top:0;">'+datesdiv+padder+scrollr+'</div>';
		
		
		//         ----------------------   <= P_RULER.offsetPx, scrolling inset (content, positionned: is the reference for (*o01*) )
		//        |                      |
		//        |                      |
		//        |                      |
		//////////////////////////////////////////////////////// <= screen limit
		//        |                      |
		//        |                      |
		//	 ----------------------------------------    <= P_RULER.originPx, portview div (absolute positionning)
		//  |   -----------------------------        |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |  <= scroll wrapper div (relative, scroll, height:100%)
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |   -----------------------------        |
		//	 ----------------------------------------
		//        |                      |
		//        |                      |
		//        |                      |
		//        |                      |
		//         ----------------------
		//				
				const spinner = '<div class="spinner">'+'</div>';
			const busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:30vh;';
		const overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';

		return scrollrdiv+overlay;
	},
	set: function(jsDate) {
		if(vbs) vlog('planning.js','P_hourly','set','jsDate:'+jsDate); 

		this.busy(true);
		let date = jsDate.clone();
			if(this.status.days==7) date.monday(); // we show a complete week, starting on monday
		this.status.midnight = date.stamp();
		
		// set points to a date that is too far, we clean up and redraw the display
		this.controls.vdays = new A_ct();
		
		const tds = new Array();
		for(let d=0; d<this.status.days; d++, date=date.clone({d:1})) {
				const o = { freedragcss:'shadow', maydraw:permissions.may(pc.ch_hourly), hourlyflex:permissions.may(pc.ch_hourly), hourlynames:true };
			const vday = new P_column(this.eids.vdays, this.controls.ruler, this.resource, date, o, this.events );
			this.controls.vdays.add1(vday, date.stamp());
			tds.push(vday.column(this.status.percents));
		}
		tds.push(this.rulerDumb); // comes after the last column
		
		const dates = new Array();
		for(let stamp in this.controls.vdays.get) {
				const vday = this.controls.vdays.get[stamp];
			dates.push(vday.colheader(this.status.percents));
		}
		this.elements.dtr.innerHTML = dates.join('');
		
		this.elements.tr.innerHTML = tds.join(''); // see (*ph01*) how it is defined in the DOM // the equivalent operation in P_Vertical is here (*ph02*)
		
		this.controls.vdays.activate();
		this.busy(false);
		return this;
	},
	setdate: function(jsdate) { // setdate is called when the display date changes or when the hourly is adapted
		this.set(jsdate|| new Date(this.status.midnight*1000)); // normal case
	},
	busy: function(onoff) {		
		if(onoff && !this.status.busy) {
			const overlay = '<div class="modal-busy" id="'+this.eids.busy+'" style="z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden;"></div>';
			$(this.elements.grid).append(overlay);
		} else if(onoff==false && this.status.busy)
					$('#'+this.eids.busy).remove();
		this.status.busy = onoff;
		return this;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('P_hourly');
		this.locate();
		if(is.tactile) { 
			let handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone) }) ;
			let options = { scrollX:false, scrollY:true, bounce:true, momentum:true, scrollbars:false, snap:'.slice-oclock', snapSpeed:600 };
			this.scrolly = new IScroll(this.elements.scroll, options);
			this.scrolly.on('scrollStart', handlers.iScrolling);
			this.scrolly.on('scrollEnd', handlers.iScrolldone);
		}
		return this;
	},
	locate: function() {
			
				const position = $(this.elements.portvw).position();
			const y = position.top;
			const h = $(this.elements.portvw).height();

		if(vbs) vlog('planning.js','P_hourly','locate','y:'+y+', h:'+h);
		this.controls.ruler.locate(h-80); // this value is based on this css setting : see (*pv02*)
		return this;
	},
	redraw: function() {
		// this.setdate(); // redraw is called when the screen is resized
		this.cleanup(); 
		for(let stamp in this.controls.vdays.get) this.controls.vdays[stamp].measure().hourly();
		return this;
	},
	cleanup: function() { $(this.elements.grid).find('div.sticker').remove(); return this; },
	onresize: function() { 
		if(vbs) vlog('planning.js','P_hourly','onresize','');
		this.locate().redraw();
		let w = $(this.elements.grid).width();
		$(this.elements.dtbl).find('td.v-dates').width(w+'px'); // adjust the dates td's size
		
	},
	zoom: function(onoff) {
		
		let scrollmode = 'hidden'; if(onoff) scrollmode = 'scroll';
		if(vbs) vlog('planning.js','P_hourly','zoom','state:'+onoff);
		
		this.elements.scroll.scrollTop = 0;
		this.elements.scroll.style['overflow-y'] = scrollmode; // (*zm001)
		this.onresize();
		
		let w = $(this.elements.grid).width();
		$(this.elements.dtbl).find('td.v-dates').width(w+'px');
	},
	lastresasaved: function(dSresa) { // exists for compatibility with parent
	},

	// private
	
	// event handling
	sticker: function(sticker, date, touching, mousevent) { // (cueable, this.date, touching, mousevent) an existing sticker has been clicked
		if(vbs) vlog('planning.js','P_hourly','sticker','id:'+sticker.id+', class:'+sticker.oclass.name+', date:'+date.sortable()+' ,in:'+time(sticker.cueIn)+', out:'+time(sticker.cueOut)); 
		if(!permissions.may(pc.ch_hourly)) return false;		
		let tab;
			switch(sticker.oclass.name) {
				case 'C_dS_shadow': tab = 0; break;
				case 'C_dS_timebox': tab = 1; break;
			}
			const schedule = this.resource.schedule(date);
			const rscId = this.resource.id;
			const position = { mouse:{event:mousevent}, offset:{x:-80, y:-40}};// see (*sh01*)
		return new Pad_iSHADOW_Action( sticker, schedule, date, rscId, { saved:new A_cb(this, this.refresh) }, { position:position, tab:tab, tabrestrict:tab } );
	},
	touchstart: function(date, cue) { // a slot has been touched and this function authorizes or not beginning drawing
		let hourly = this.resource.schedule(date).hourly;
		let free = hourly.isfree(date, cue); 
		if(vbs) vlog('planning.js','P_hourly','touchstart','date:'+date.sortable()+', cue:'+time(cue)+', free?:'+free);
		return free;
	},	
	touchdrag: function(date, cueable, newcue) { // subsequent to a touchstart, this function authorizes or not further dragging process
		let hourly = this.resource.schedule(date).hourly;
		let goon = hourly.isnest(date, cueable.cueIn, cueable.cueOut); 
		if(vbs) vlog('planning.js','P_hourly','touchdrag','cin:'+time(cueable.cueIn)+', cout:'+time(cueable.cueOut)+', newcue:'+time(newcue)+', go on?:'+goon);
		return goon;
	},
	newsticker: function(cueable, date, mousevent) { // a new sticker has been drawn on the column, open the shadow type choice modal
		if(vbs) vlog('planning.js','P_hourly','newsticker','date:'+date.sortable()+',in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut));
			const schedule = this.resource.schedule(date);	
			const rscId = this.resource.id;
			if(schedule.hourly.id==0) return false; // then there is no hourly running on that date, do not auhtorize any drawing! return false lets the drawing disappear.

			const position = { mouse:{event:mousevent}, offset:{x:-80, y:-40}};// see (*sh01*)
		return new Pad_iNEW_SHADOW_Action( cueable, schedule, date, rscId, { saved:new A_cb(this, this.refresh) }, { position:position, tab:0, tabrestrict:0 } );		
	},
	ondate: function(date, rscId, hourlyset, mousevent) { // when a column header date is clicked
		
		// hourlyset is an object like:
		//
		// { 	dayIn:dayIn, hourly:hourly.hourly, shadows:hourly.shadows, tboxes:hourly.tboxes, 
		//		offday:hourly.offday, daycode:hourly.daycode, weekcode:hourly.weekcode 
		// }
	
		if(vbs) vlog('planning.js','P_hourly','ondate','new hourly:'+date.sortable()+', rscId:'+rscId);
		
		if(!permissions.may(pc.ch_hourly)) return false;
		
		// when the change is a come back to the previous hourly - because 
		// exceptional day(s) have been inserted - we authorize posting a new change on that date.
		//
			let position = { mouse:{event:mousevent}, offset:{x:-80, y:-40}}; // see (*sh01*)
		return new Pad_iHUSER_Action( position, { saved:new A_cb(this, this.hourlyusersaved), removed:new A_cb(this, this.hourlyuserremoved) }, { date:date, rscId:rscId, hourlyset:hourlyset, resource:this.resource } );

	},
	hover: function(hstamp, cue) {
		for(let stamp in this.controls.vdays.get) this.controls.vdays[stamp].colight(false);
		if(cue) this.controls.vdays[hstamp].colight(true);
	},
	refresh: function() { 
		if(vbs) vlog('planning.js','P_hourly','refresh','');
		this.setdate(); 
	}, 
	adjusted: function(sticker, date, oricuein, oricueout) { // an existing hourly shadow has been adjusted by dragging the edge with the mouse pointer, post it to the server
		// console.log('P_hourly::adjusted()');
		let nochange = (sticker.cueOut == oricueout && sticker.cueIn == oricuein);
		let command = 'shadow_adjust_span'; // we assume the shadow size was changed, this one is used here (*sh02*)
		if(nochange) {
			command = ''; // is a regular modal opening, with no direct command
		} 
		
		if(vbs) vlog('planning.js','P_hourly','adjusted','cueable id:'+sticker.id+', class:'+sticker.oclass.name+' ,in:'+time(sticker.cueIn)+', out:'+time(sticker.cueOut));
			let tab;
			switch(sticker.oclass.name) {
				case 'C_dS_shadow': tab = 0; break;
				case 'C_dS_timebox': tab = 1; break;
			}
			let schedule = this.resource.schedule(date);
			let refresh = new A_cb(this, this.refresh);
			let rscId = this.resource.id;
			
		return new M_SHADOW( sticker, schedule, date, rscId, { saved:refresh, escaped:refresh }, { tab:tab, tabrestrict:tab, command:command } );

	},
	stickenter: function(cueable, sticker) { // mouse pointer enters a sticker area
		if(vbs) vlog('planning.js','P_hourly','stickenter','in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)); 
		if(cueable.cueOut-cueable.cueIn>=3600) sticker.timeon();
		if(this.callbacks.stickenter) this.callbacks.stickenter.cb(cueable, sticker);
	},
	stickleave: function(cueable, sticker) { // mouse pointer leaves a sticker area
		if(vbs) vlog('planning.js','P_hourly','stickleave','in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut)); 
		sticker.timeoff();
		if(this.callbacks.stickleave) this.callbacks.stickleave.cb(cueable, sticker);
	},
	
	iScrolling: function() { // iScroll events - tactile only -
		if(!this.status.scrolling) { // calls only once above
			if(this.callbacks.scrollstart) this.callbacks.scrollstart.cb();
			P_GRID.dragging = false; P_Sticker.state.down = false; // (*event cancel)
			this.status.scrolling = true;
			// this.ruler.locate(); // do not call this, the position of P_RULER.originPx will be wrong
		}
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.status.scrolling = false;
		// this.ruler.locate(); // do not call this, the position of P_RULER.originPx will be wrong
		this.elements.scroll.iscrollTop = -this.scrolly.y;
		if(vbs) vlog('planning.js','P_hourly','iScrolldone','scrollposition:'+this.scrolly.y);
		return true;
	},
	
	// post feedbacks
	hourlyusersaved: function() { this.refresh(); },
	hourlyuserremoved: function() { this.refresh(); }
	
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   V E R T I C A L    P L A N N I N G
//
function P_Vertical(eid, callbacks, preset) {

	this.resource = C_dS_resource.get(preset.rescId);
	const e = eid+'_'+this.resource.id+'_';
	this.eids = { e:e, rulerbox:{left:e+'r_l',right:e+'r_r'}
				, ruler:e+'ruler', tr:e+'tr', dtbl:e+'dtbl', dtr:e+'dtr', fr:e+'fr'
				, scroll:e+'scroll', portvw:e+'pvw', ltr:e+'ltr', vdays:e+'day', grid:e+'grid', overlay:e+'ovrl' };
	this.elements = new A_el();
	this.handlers = new A_hn();
	this.events = { dpchange: new A_cb(this, this.set, false, new A_cb(this, this.busy, true)), newsticker:new A_cb(this, this.newsticker) };
	this.status = P_Vertical.defaults.align(preset);
	this.status.percents = (100/this.status.days)|0;
		const span = { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };
	this.ruler = new P_RULER(this.eids.ruler, { orientation:planning.vertical, cueIn:span.cueIn, cueOut:span.cueOut });
	this.controls = new A_ct({ vdays:new A_ct() });
	this.callbacks = callbacks;
	this.slicing = 's'+mobminder.account.secondsPerSlice/60;
}
P_Vertical.defaults = new A_df( { 
		busy:false, hidden:false, resas:false, rescId:0, days:7, percents:14, highlight:false,
		scrolling:false, orjsdate:false
		} );
P_Vertical.prototype = { // displays a vertical week view. Uses one or multiple instances of P_column, just like P_hourly

	// public
	display: function() {
		const rulerLeft = this.ruler.display({dots:true, timestick:'v', labels:true, timestamps:true} );
		const rulerRight = this.ruler.display({eid:'_idle', labels:true, timestamps:true } ); // double display for this ruler, see (*ps02*)
		
			const gridtr = '<tr id="'+this.eids.tr+'" style="vertical-align:top;"><td></td></tr>';
		const columns = '<table style="width:100%; border:none; border-width:0px; table-layout:fixed; min-height:100%; height:100%;">'+gridtr+'</table>'; // rulerdumb gives the height to the column td and hence the height perceived by (*r2)

		// outer frame with left and right rulers
		const tdleft = '<td style="width:2.5em;"><table id='+this.eids.rulerbox.left+' class="ruler ruler-main '+this.slicing+'">'+rulerLeft+'</table></td>';
		// const tdright = this.status.days>1 ? '<td style="width:2.5em;"><table id='+this.eids.rulerbox.right+' class="ruler '+this.slicing+'">'+rulerRight+'</table></td>' : '';
		const tdright = '<td style="width:2.5em;"><table id='+this.eids.rulerbox.right+' class="ruler '+this.slicing+'">'+rulerRight+'</table></td>';
		const tdcolumns = '<td id="'+this.eids.grid+'" class="vertical-columns" style="height:100%;">'+columns+'</td>';
		
		let datesdiv = '';
		if(this.status.days>1) {
			const dates = '<table class="v-dates" style="width:100%;"><tr id="'+this.eids.dtr+'" style="vertical-align:top; height:3em;">'+'<td></td>'+'</tr></table>'; // this.elements.dtr is filled by this.set()
					const dtds = '<td class="scrollmate"></td>'+'<td class="v-dates">'+dates+'</td>'+'<td style="width:2.5em;"></td>'; // scrollmate has a different width depending on visible scroll bar
				const dtr = '<tr style="vertical-align:top;">'+dtds+'</tr>'; 
			const datestbl = '<table id="'+this.eids.dtbl+'" class="P_Vertical" style="width:100%; table-layout:fixed;">'+dtr+'</table>';
			datesdiv = '<div class="vshade" style="pointer-events:none; position:absolute; top:0; right:0; left:0; height:4.4em; z-index:+20;">'+datestbl+'</div>';
		}
		
			const fontsize = ' sticker-font'+mobminder.account.stiFontSize;
		const table = '<table class="vertical-grid '+fontsize+'" style="width:100%; table-layout:fixed;"><tr id="'+this.eids.fr+'" style="vertical-align:top;">'+tdleft+tdcolumns+tdright+'</tr></table>';
			// table-layout:fixed; prevents the table to be larger than the container div
			
		const wrapper = '<div id="'+this.eids.ltr+'" style="direction:ltr; position:relative;">'+table+'</div>'; // scrolling inset, direction rtl sets the scrollbar on the left side
		
		let p024padder = '0px', r24css = ''; // only for accounts with a 0h - 24h planning 
		if(mobminder.account.is.range024) { p024padder = '40px'; r24css = ' range024'; }
		
			const scstyle = 'height:calc(100% - '+p024padder+'); overflow-y:scroll; overflow-x:hidden; position:relative; direction:rtl;'; // border:2px solid red; 
		const scrollr = '<div id="'+this.eids.scroll+'" class="vertical-section" style="'+scstyle+'">'+wrapper+'</div>'; // scroll wrapper
		
		const padder = '<div style="height:'+p024padder+'; min-height:'+p024padder+'; display:block;">'+'</div>';
		const ccount = this.status.days == 1 ? ' oneday': ' multidays';
		const scrollrdiv = '<div class="P_Vertical'+r24css+ccount+'" id="'+this.eids.portvw+'" style="position:absolute; bottom:0px; top:0;">'+datesdiv+padder+scrollr+'</div>';
		
		
		//         ----------------------   <= P_RULER.offsetPx, scrolling inset (content, positionned: is the reference for (*o01*) )
		//        |                      |
		//        |                      |
		//        |                      |
		//////////////////////////////////////////////////////// <= screen limit
		//        |                      |
		//        |                      |
		//	 ----------------------------------------    <= P_RULER.originPx, portview div (absolute positionning)
		//  |   -----------------------------        |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |  <= scroll wrapper div (relative, scroll, height:100%)
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |  |  |                      |   |       |
		//  |   -----------------------------        |
		//	 ----------------------------------------
		//        |                      |
		//        |                      |
		//        |                      |
		//        |                      |
		//         ----------------------
		//				
				const spinner = '<div class="spinner">'+'</div>';
			const busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:30vh;';
		const overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';

		return scrollrdiv+overlay;
	},
	set: function(jsDate, prevdate, dayskip) {
		if(vbs) vlog('planning.js','P_Vertical','set','date:'+jsDate.sortable());
		this.busy(true);
		let date = jsDate.clone(), datedisplay = true;
			if(this.status.days>1) date.monday(); // we show a complete week, starting on monday
			if(this.status.days==1) datedisplay = false; // on single accounts in search screen
		this.status.orjsdate = date; // watch out, this is the origin date when multiple days are on the screen
		
		// set points to a date that is too far, we clean up and redraw the display
		this.status.resas = false; // this goes to a new time frame scope, so we flush the buffer
		this.query(date.sortable()); // calls the server
		
		// the server has been called, we have now time to draw hourlies and timeboxes
		const callbacks = { ondate:new A_cb(this, this.ondate), sticker:new A_cb(this, this.sticker), newsticker:this.events.newsticker, dpchange:this.events.dpchange, hover:new A_cb(this, this.hover) };
			
		this.setrulers(jsDate); // takes adaptative display into consideration
		const today = new Date(); this.ruler.stick(today.toMidnight().sameday(jsDate)); // do not show the red time stick when the displayed date is not today
					
		this.controls.vdays = new A_ct();
		for(let d=0; d<this.status.days; d++, date=date.clone({d:1})) {
				const o = { colheader:datedisplay, hourlyflex:false, minfreesize:mobminder.account.durMinSec };
			const vday = new P_column(this.eids.vdays, this.ruler, this.resource, date, o, callbacks );
			this.controls.vdays.add1(vday, date.stamp());
		}
		return this;
	},
	browsingdates: function(skip) { // the user is busy changing the display date, let's start blurring the screen already
		// this.busy(true);
		// console.log('P_Vertical::browsingdates() skip='+skip);
		let moreanimation = '';
		switch(skip|0) {
			case 4: moreanimation = 'right-ff'; break;
			case 2: moreanimation = 'right-ff'; break;
			case 1: moreanimation = 'right-s'; break;
			case 0: moreanimation = ''; break;
			case -1: moreanimation = 'left-s'; break;
			case -2:moreanimation = 'left-ff';  break;
			case -4:moreanimation = 'left-ff';  break;
		}
		$(this.elements.grid).find('div.sticker.resa').addClass('final').addClass(moreanimation);
	}, 
	setrulers: function(jsDate) { // adaptative display re-defines ruler scale
		
		// let span;
			const adaptative = C_dS_details.get(planning.vertical, this.resource.resourceType, details.adaptative); 
		// if(adaptative) span = this.adaptative(jsDate);
			// else span = { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };
		const span = adaptative ? this.adaptative(jsDate) : { cueIn:mobminder.account.rangeIn, cueOut:mobminder.account.rangeOut };

			const noscalechange = this.ruler.state.cueIn==span.cueIn && this.ruler.state.cueOut==span.cueOut;
			let alog = ', adaptative:false'; if(adaptative) alog = ', adaptative:YES, scale change:'+!noscalechange+', min:'+time(span.cueIn)+', max:'+time(span.cueOut);
		if(vbs) vlog('planning.js','P_Vertical','setrulers','min:'+time(mobminder.account.rangeIn)+', max:'+time(mobminder.account.rangeOut)+alog);
		
		if(noscalechange) return;
		
		// this following part executed only if the adaptative display changes the ruler span
		this.ruler.deactivate();
		this.ruler = new P_RULER(this.eids.ruler, {orientation:planning.vertical, cueIn:span.cueIn, cueOut:span.cueOut });
		this.elements.rulerbox.left.innerHTML = this.ruler.display({dots:true, timestick:'vx', labels:true});
		if(this.elements.rulerbox.right) this.elements.rulerbox.right.innerHTML = this.ruler.display({eid:'_idle', labels:true } ); // this one is not displayed on single day view
		this.ruler.activate();
		this.onresize();
	},
	adaptative: function(jsDate) { // for the span of displayed dates, determines the soonest hourly start and latest hourly finish
		let min = 86400, max = 0;
		let date = jsDate.clone();
			if(this.status.days>1) date.monday(); // we show a complete week, starting on monday
		
		for(let d=0; d<this.status.days; d++, date=date.clone({d:1})) {
			const hourlyset = this.resource.schedule(date); // is false (when no hourly on this date) or is an hourly set 
			const shadows = hourlyset.shadows; // 2 or more in each column
			for(let id in shadows) {
							const shadow = shadows[id];
						const cin = shadow.cueIn, cout = shadow.cueOut;
					const isclosed = (cin==0 && cout==86400); if(isclosed) continue;
					const isedge = (cin==0 || cout==86400) && !isclosed;
				if(isedge) {
					if(cin==0) if(min>cout) min = cout;
					if(cout==86400) if(max<cin) max = cin;
				}
			}
		}
		if(min==86400 && max==0) { min=mobminder.account.rangeIn; max=mobminder.account.rangeOut; }
		return { cueIn:min, cueOut:max }; // seconds in, and out
	},
	setdate: function(jsdate, prevdate, dayskip) { return this.set(jsdate, prevdate, dayskip); },
	highlight: function(resaId, css, cdown, now) {
		this.highcancel();
		this.status.highlight = { id:resaId, css:css, countdown:cdown||2, timer:false }; // now wait for a plitem to have executed, then highlight
		if(now) this.highblink();
		return this;
	},
	lastresasaved: function(dSresa) {
		// console.log('P_Vertical::lastresasaved() dSresa.id:',(dSresa?dSresa.id:'X'));
		if(!dSresa) return false;
		const $allstickers = $(this.elements.tr).find('div.sticker');
		$allstickers.removeClass('resa-new');
		const $thesticker = $(this.elements.tr).find('div.sticker[id$="_'+dSresa.id+'"]');
		$thesticker.addClass('resa-new');
		return true;
	},
	busy: function(onoff) {	
		if(onoff==this.status.busy) return this;
		this.status.busy = onoff;
		if(onoff) { $(this.elements.overlay).addClass('on'); C_iWIN.cursor('wait');	}
		else { $(this.elements.overlay).removeClass('on'); C_iWIN.cursor();	}
		return this;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('P_Vertical');
		this.ruler.activate();
		this.locate();
		if(is.tactile) { 
			let handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone) }) ;
			let options = { scrollX:false, scrollY:true, bounce:true, momentum:true, scrollbars:false, snap:'.slice-oclock', snapSpeed:600 };
			this.scrolly = new IScroll(this.elements.scroll, options);  // P_Vertical
			this.scrolly.on('scrollStart', handlers.iScrolling);
			this.scrolly.on('scrollEnd', handlers.iScrolldone);
		}
		return this;
	},
	locate: function() {
			
				let position = $(this.elements.portvw).position();
			let y = position.top;
			let h = $(this.elements.portvw).height();
		
		if(vbs) vlog('planning.js','P_Vertical','locate','y:'+y+', h:'+h);
		
		let padding = this.status.days==1 ? 20 : 40; // see (*pv02*) to understand how to adjust that value
		this.ruler.locate(h-padding);
		
		return this;
	},
	redraw: function() { // called from this.onresize(), from P_AgendaHVL::detailsset() and from P_AgendaHVL::refresh(); 
		if(this.status.resas) this.status.resas['C_dS_reservation'] = rmems['plitems'].resas.get();	// re-links to recently updated C_dS_reservation (like a feedback from /post/forceccss.php
		if(vbs) vlog('planning.js','P_Vertical','redraw','');
		this.vplidraw(); // draws reservations (put stickers on screen)
		return this;
	},
	cleanup: function() { $(this.elements.grid).find('div.sticker').remove(); return this; },
	onresize: function() { // called when the screen is re-sized by the user
		if(vbs) vlog('planning.js','P_Vertical','onresize','');
		this.locate().redraw();
		let w = $(this.elements.grid).width();
		$(this.elements.dtbl).find('td.v-dates').width(w+'px'); // adjust the dates td's size
	},
	copypaste: function(o) {
		if(vbs) vlog('planning.js','P_Vertical','copypaste','days:'+this.status.days);
		for(let stamp in this.controls.vdays.get) 
			this.controls.vdays[stamp].copypaste(o); // activates / de-activates copypaste mode // (*cp03*)
	},
	zoom: function(onoff) {
		
		let scrollmode = 'hidden'; if(onoff) scrollmode = 'scroll';
		
		if(vbs) vlog('planning.js','P_Vertical','zoom','state:'+onoff);
		
		if(is.tactile) {
			this.scrolly.scrollTo(0, 0);
		} else {
			this.elements.scroll.scrollTop = 0;
			this.elements.scroll.style['overflow-y'] = scrollmode; // (*zm001)
		}
		this.onresize();
		if(this.scrolly) this.scrolly.refresh();
	},
	
	// private
	//
	rulerdumb: function() { // based on current this.ruler, this function returns a td containing a table that forces the height of the main frame table
				let rulerdumb = this.ruler.display({eid:'_fill'} ); 
				let table = '<table style="width:0em; max-width:0em; border:none;" class="ruler '+this.slicing+'">'+rulerdumb+'</table>'; // width:0px; max-width:0px; mandatory on mozilla
			let td = '<td class="rulerdumb" style="width:0em; max-width:0em; border:none;">'+table+'</td>'; // makes the row height, so we can scroll // border:none; mandatory on mozilla
		return td;
	},
	highblink: function() {
		const $stickers = $(this.elements.tr).find('div.sticker[id$="_'+this.status.highlight.id+'"]');
		
		if(this.status.highlight.countdown%2)
			$stickers.removeClass(this.status.highlight.css);
		else
			$stickers.addClass(this.status.highlight.css);
		
		// console.log('P_Vertical::highblink() this.status.highlight.countdown='+this.status.highlight.countdown);
		
		if(this.status.highlight.countdown) {
			const back = new A_cb(this, this.highblink, this.status.highlight.countdown--);
			return this.status.highlight.timer = setTimeout(function() { back.cb() } , 500);
		} else {
			// this.status.highlight = false; // <= prevents highcancel to remove the highlight.css
		}
	},	
	highcancel: function() {
		
		// console.log('P_Vertical::highcancel()');
		
		if(this.status.highlight) {
			if(this.status.highlight.timer) clearTimeout(this.status.highlight.timer);
			const $stickers = $(this.elements.tr).find('div.sticker[id$="_'+this.status.highlight.id+'"]');
			$stickers.removeClass(this.status.highlight.css);
		}
		this.status.highlight = false;
	},
	scopeto: function(idclue) { // scrolls to a given sticker
		if(vbs) vlog('planning.js','P_Vertical','scopeto','idclue:'+idclue);
		if(is.tactile)
			if(this.scrolly) {
				let el = $(this.elements.tr).find('div.sticker[id$="_'+idclue+'"]:eq(0)')[0];
				 { this.scrolly.scrollToElement(el, 0); this.scrolly.scrollTo(0,-100,500,true /*relatively*/) };
			}
			else { // here comes the code that scrolls to the right element when the zoom is on. TBD? :)
				
			}
		return this;
	},
	query: function(stamp) { // calls ./queries/plitems.php
		const post = new C_iPASS({stamp:stamp, days:this.status.days, rescId:this.resource.id, fulldays:0, sms:0, peers:1 });
		const names = {post:{stamp:'stamp',days:'days',rescId:'rescId',fulldays:'fulldays', sms:'sms', peers:'peers'}};
		mobminder.app.post({post:post}, names, './queries/plitems.php', new A_cb(this,this.plitems), new A_cb(this,this.plitemsfailed));
		return this;
	},
	stickers: function(resa, is, css) { // Obsolete (when introducing overlaps calculation)
		let stickers = new Array();
		
		let attendees = resa.resources; //
		let parts = resa.getparts(); // take all parts as vertical display can have many days
		let type = this.resource.resourceType;
		
		// defining the stickers width
		let width = '100%'; // the normal case
		if(mobminder.account.has.timeboxing) { // when timeboxing is used, keep 10% or 25% width on the left of the column to display timboxes
			let labeltboxing = C_dS_details.get(planning.vertical, this.resource.resourceType, details.timeboxing); 
			if(labeltboxing) width = '80%'; else width = '90%'; // the tboxes stickers must have the remaining width, see (3*)
		}
		
		// display stickers
		if(type in attendees) 
			if(this.resource.id in attendees[type]) {
				let html = resa.rdetails(planning.vertical, type);
				let tiptext = resa.rtip(planning.vertical, type);
				
				for(let x in parts) {
					let part = parts[x];
					let day = this.controls.vdays[part.midnight]; // get object on screen that displays the day of this part
					if(!day) continue; // this part is outside the range of displayed dates
					stickers.push(day.sticker(part, html, { width:width, align:'right', css:(css||''), tip:{text:tiptext, css:'sticker-tip '+resa.tipcss } }, is));
				}
			}
		return stickers;
	},
	split: function(resas) { // return parts of reservations, sorted by day
		
			let type = this.resource.resourceType;
			let dstickers = new Array(); // arranged by day, like dstickers[day] = [part1, part2, ...]
			for(let d in this.controls.vdays.get) dstickers[d] = new Array();
			
		for(let id in resas) {
			
			let resa = resas[id];
			if(mobminder.app.hidedeleted) if(resa.deletorId) continue;
			let attendees = resa.resources;
			if(!(type in attendees)) continue;
			
				let html = resa.rdetails(planning.vertical, type);
				let tiptext = resa.rtip(planning.vertical, type);
				let tipcss = resa.tipcss;
				
			// let hasfiles = C_dS_resafile.ends(resa.id); console.log('P_Vertical::split() '+resa.id+' / '+hasfiles); // PVH 2025, moved to C_dS_reservation::cssclass() because it is more clever
			let parts = resa.getparts(); // (*gp*)
			
			// if(id==12559370) console.log('jeudi',parts);
			// if(id==12559371) console.log('mardi',parts);
			// if(id==12559372) console.log('samedi',parts);
		
			for(let x in parts) {
				let part = parts[x];
				let day = part.midnight;
				if(!(day in this.controls.vdays)) continue;
				let sticker = { cueable:part, html:html, tiptext:tiptext, tipcss:tipcss, overlayLane:1, overlayWays:1 };
				dstickers[day].push(sticker);
			}
		}
		return dstickers;
	},
	vplidraw: function(css) { // vertical planning items draw ( called after reception of C_dS_reservation through /queries/plitems.php )
		
		if(vbs) vlog('planning.js','P_Vertical','vplidraw','css:'+css);
		
		const tds = [];		
		for(let stamp in this.controls.vdays.get) {
			const vday = this.controls.vdays.get[stamp];
			tds.push(vday.column(this.status.percents));
		}
		tds.push(this.rulerdumb()); // comes after the last column
		this.elements.tr.innerHTML = tds.join(''); // the equivalent operation in P_hourly is here (*ph02*)
		
		// column headers (for multi columns only)
		if(this.status.days>1) {
			const dates = [];
			for(let stamp in this.controls.vdays.get) {
				const vday = this.controls.vdays.get[stamp];
				dates.push(vday.colheader(this.status.percents));
			}
			this.elements.dtr.innerHTML = dates.join('');
		}
		
		this.controls.vdays.reset().activate();		
		
		// defining the stickers width
		let width = '100%'; // the normal case
		if(mobminder.account.has.timeboxing) { // when timeboxing is used, keep 10% or 25% width on the left of the column to display timboxes
			let labeltboxing = C_dS_details.get(planning.vertical, this.resource.resourceType, details.timeboxing); 
			if(labeltboxing) width = '80%'; else width = '90%'; // the tboxes stickers must have the remaining width, see (3*)
		}

		const resas = this.status.resas['C_dS_reservation'];
		const stickers = this.split(resas);
		
		// defining overlaps lanes and ways
		for(let day in stickers) {
			const dstickers = stickers[day]; // is an array indexed like [0:part, 1:part, 2:part,...]
			P_Sticker.overlaps(dstickers);
		}
	
		// display
			const level = C_dS_details.get(planning.vertical, this.resource.resourceType).details;  
		const disbltip = (level&(details.disbltips)); // tips can be disabled for this planning orientation and resource type, see (*dt*)
		
		let c = 0;
		for(let day in stickers) {
			const dstickers = stickers[day];
			const column = this.controls.vdays[day];
			for(let x in dstickers) {
				const sticker = dstickers[x];
				const is = { resa:true, overlayWays:sticker.overlayWays, overlayLane:sticker.overlayLane };
				const tip = disbltip ? false : { text:sticker.tiptext, css:'sticker-tip '+sticker.tipcss };
				column.sticker(sticker.cueable, sticker.html, { width:width, align:'right', css:(css||''), tip:tip }, is );
				c++;
			}
		}
		if(vbs) vlog('planning.js','P_Vertical','--vplidraw','stickers count:'+c);
	},
	
	// post feedbacks
	plitems: function(inlineDataSets) { // fresh data from server
		if(vbs) vlog('planning.js','P_Vertical','plitems','');
		this.busy(false);
		
		// this.status.resas = inlineDataSets;  // PVH 2025 : this was wrong, [] the table pointers differs from rmems['plitems'] and hence is not correct
		this.status.resas = []; this.status.resas['C_dS_reservation'] = rmems['plitems'].resas.get();
		this.vplidraw(); // relies on this.status.resas
		
		// if(this.status.highlight) this.scopeto(this.status.highlight.id).highblink();
		if(this.callbacks.plitems) this.callbacks.plitems.cb(inlineDataSets);
	},
	plitemsfailed: function() {
		this.busy(false);
	},
	
	// event handling
	ondate:function(date, rscId, hourlyset) {
		if(this.callbacks.screenchange) this.callbacks.screenchange.cb(screens.search, rscId, date);
	},
	sticker: function(cueable, date, touching, mousevent, skeys) { // a planning sticker was clicked
		
		if(cueable instanceof C_dS_resapart || cueable instanceof C_dS_reservation )
			// if(this.callbacks.resaopen) return this.callbacks.resaopen.cb(cueable, date);
			if(this.callbacks.resaopen) return this.callbacks.resaopen.cb(cueable, mousevent, skeys);
		
				
		if(cueable.oclass == C_dS_timebox) { // (*tb01*) touching a timebox sticker opens a new reservation with respective duration and time cue
		
				// in this case, cueable is the timebox sticker and touching is the clicked spot on the planning grid
				rmems.flush('slots');
				let midnight = date.clone().toMidnight().stamp();
				let resaId = 0;
			let attendee = new C_dS_attendee('slots', [0, resaId, this.resource.resourceType, this.resource.id]); // must be present in the 'slots' memory bank, if not, your reservation is not linked to any resource
			
				let cin = cueable.cueIn, cout = cueable.cueOut;
			if(cout-cin>3600) { // the clicked timebox is a long period (more than one hour) indication instead of an indication of appointment typical duration
				
				let defaultduration = mobminder.account.secondsPerSlice;
				let setduration = defaultduration;
				switch(defaultduration) {
					case 300: setduration = 900; break; // 900 is 15 minutes
					case 600: setduration = 1200; break; // 1200 is 20 minutes
					default: // keep it like it is
				}
				
				cin = touching.cueIn; 
				cout = cin+setduration;
			}
			
			let dS_resa = new C_dS_reservation('slots',C_dS_trackingCCD.tnew(resaId, mobminder.account.id).concat([midnight+cin, midnight+cout]));
				
			return this.callbacks.resaopen.cb(dS_resa, mousevent, skeys);
		}
	},
	newsticker: function(cueable, date, mouseevent, skeys) {
		if(vbs) vlog('planning.js','P_Vertical','newsticker','date:'+date.sortable()+',in:'+time(cueable.cueIn)+',out:'+time(cueable.cueOut));
		rmems.flush('slots');
		let resaId = 0, stamp = date.stamp();
		let timeshift = date.timeshift(); // daylight saving (e.g. October 27th, 2013)
		let attendee = new C_dS_attendee('slots', [0, resaId, this.resource.resourceType, this.resource.id]);
		
			let cuein = timeshift+stamp+cueable.cueIn;
			let cueout = timeshift+stamp+cueable.cueOut;
		let resa = new C_dS_reservation('slots',C_dS_trackingCCD.tnew(resaId, mobminder.account.id).concat([cuein, cueout]));
		return this.callbacks.resaopen.cb(resa, mouseevent, skeys); // calls parent class for opening the modal
	},	
	hover: function(hstamp, cue) {
		for(let stamp in this.controls.vdays.get) this.controls.vdays[stamp].colight(false);
		if(cue) this.controls.vdays[hstamp].colight(true);
	},	
	
	iScrolling: function() { // iScroll events - tactile only -
		if(!this.status.scrolling) { // calls only once above
			if(this.callbacks.scrollstart) this.callbacks.scrollstart.cb();
			P_GRID.dragging = false; P_Sticker.state.down = false; // (*event cancel)
			this.status.scrolling = true;
			// this.ruler.locate(); // do not call this, the position of P_RULER.originPx will be wrong
		}
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.status.scrolling = false;
		// this.ruler.locate(); // do not call this, the position of P_RULER.originPx will be wrong
		this.elements.scroll.iscrollTop = -this.scrolly.y;
		if(vbs) vlog('planning.js','P_Vertical','iScrolldone','scrollposition:'+this.scrolly.y);
		return true;
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   L I S T       P L A N N I N G
//
function P_List(eid, callbacks, preset) {
	this.resource = C_dS_resource.get(preset.rescId);
	let e = eid+'_'+this.resource.id+'_';
	this.eids = { list:e+'list', busy:e+'busy', time:e+'time', overlay:e+'overlay' };
	this.elements = new A_el();
	this.callbacks = callbacks; // like { screenchange:o_callback, resaopen: }
	this.state = P_List.defaults.align(preset);
	this.events = { plitems:new A_cb(this,this.plitems), plitemsfailed: new A_cb(this,this.plitemsfailed) };
	this.controls = new A_ct({});
		let resatemplates = C_dS_smsTemplate.byTrigger(class_resa_any); // take only the templates that are triggered by a reservation scheduling
	this.templates = resatemplates[class_visitor]; // we show here only SMS that relate to visitors
	this.msgClass = C_dS_smsTemplate.childs; // will be C_dS_sms
	this.selected = this.selection();
	for(let x in this.selection)
		this.smscount = C_dS_smsTemplate.count(class_resa_any, class_visitor);
}
P_List.defaults = new A_df( { busy:false, midnight:false, resas:false, extraspace:false, fbusy:false } );
P_List.headers = function() {		
	if(vbs) vlog('planning.js','P_List','headers','');
	let headers = [];
	headers[details.schedule] 		= ''; // <= in some cases we want no header text
	headers[details.duration] 		= '';
	headers[details.resanote] 		= C_XL.w('note');
	headers[details.visitor] 		= C_XL.w('visitor');
	headers[details.registration] 	= C_XL.w('visi-abr-registration');
	headers[details.mobile] 		= C_XL.w('mobile');
	headers[details.address] 		= C_XL.w('address');
	headers[details.fixline] 		= C_XL.w('visi-abr-phone');
	headers[details.reference] 		= C_XL.w('reference');
	headers[details.visitorNote] 	= C_XL.w('info');
	headers[details.birthdate] 		= C_XL.w('visi-abr-birthday');
	headers[details.workcodes] 		= C_XL.w('workcodes');
	headers[details.color] 			= '';
	headers[details.smsstatus] 		= 'SMS';
	headers[details.attendance] 	= C_XL.w('attendance');
	return headers;
};
P_List.css = (function() {
	let cssclasses = [];
	cssclasses[details.schedule] 	= 'schedule';
	cssclasses[details.duration] 	= 'duration';
	cssclasses[details.resanote] 	= 'resanote';
	cssclasses[details.visitor] 	= 'vname';
	cssclasses[details.registration] = 'registration';
	cssclasses[details.mobile] 		= 'mobile';
	cssclasses[details.visitorNote] = 'visinote';
	cssclasses[details.birthdate] 	= 'visibirth';
	cssclasses[details.workcodes] 	= 'workcodes';
	cssclasses[details.color] 		= 'color';
	cssclasses[details.smsstatus] 	= 'smsstatus';
	cssclasses[details.attendance] 	= 'attendance';
	return cssclasses;
})();
P_List.prototype = {
	display: function() {
				const spinner = '<div class="spinner">'+'</div>';
			const busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:30vh;';
		const overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';
		
		const list = '<div class="P_List" id="'+this.eids.list+'" style="min-height:300px; width:100%; max-width:100%; margin:1em auto 1em auto;"></div>';
		return list+overlay;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('P_List');
		return this;
	},
	set: function(jsDate) {
		this.busy(true);
		if(vbs) vlog(this.eids.list,'P_List','set','date:'+jsDate.sortable());
		this.state.midnight = jsDate.stamp();
		// this.query(this.state.midnight);
		this.query(jsDate.sortable());
	},	
	setdate: function(jsdate) {
		this.set(jsdate);
	},
	highlight: function(resaId, css) {
	},
	busy: function(onoff) {
		this.state.fbusy = onoff;
		if(onoff) { $(this.elements.overlay).addClass('on'); C_iWIN.cursor('wait');	}
		else { $(this.elements.overlay).removeClass('on'); C_iWIN.cursor();	}
		return this;
	},
	lastresasaved: function(dSresa) { // exists for compatibility with parent
	},	
	
	
	// post feedbacks
	plitems: function(dSets) {
	
		this.controls.add1(new A_ct(), 'time');
		this.busy(false).cleanup();
		
		// fetch reservations
		this.state.resas = dSets;
		let reservations = dSets['C_dS_reservation'];
		let sorted = new Array(), resa, parts, count = 0;
		for(let id in reservations) {
			resa = reservations[id];
			if(resa.deletorId) continue; // never show deleted items here
			parts = resa.getparts(this.state.midnight);
			for(let x in parts) sorted.push(parts[x]);
			count++;
		}
		
		if(this.state.emptytboxes) {
			// Check for empty timeboxing
			//
			// We will mix in one array the reservations and the timeboxes.
			// Then we check if there is overlap. 
			// For all timeboxes that are covered by an appointment at least, overlayWays is > 1
			// The remaining timeboxes (the not used ones) should appear on the list, each of them as a free space, clickable and savable
			// 
			let overlapped = new Array();
				
				// consider timeboxing
			let hourlyset = this.resource.schedule(new Date(this.state.midnight*1000))
			let tboxes = hourlyset.tboxes; // may be void
			for(let id in tboxes) {
				let tbox = tboxes[id].clone();
					tbox.cueIn += this.state.midnight;
					tbox.cueOut += this.state.midnight;
				overlapped.push({id:-id, cueable:tbox})
			}
			
				// add appointments
			for(let id in sorted) {
				overlapped.push({id:id, cueable:sorted[id]})
			}
			P_Sticker.overlaps(overlapped); // computing of overlayWays
			
				// check where empty time boxes are
			for(let x in overlapped) {
				let item = overlapped[x]; // item can be a timebox or a resa part
				if(item.id<0) if(item.overlayWays==1) { // then this timebox is not covered by an appointment
					if(vbs) vlog('planning.js','P_List','plitems','time box:'+item.id+', tboxingId:'+item.cueable.timeboxingId+', cueIn:'+item.cueable.cueIn+', ways:'+item.overlayWays);
					let tboxing = C_dS_timeboxing.get(item.cueable.timeboxingId);
					let attendee = new C_dS_attendee('slots', [0, item.id, this.resource.resourceType, this.resource.id]); // must be present in the 'slots' memory bank, if not, your reservation is not linked to any resource
					
						let v = { cueIn:item.cueable.cueIn, cueOut:item.cueable.cueOut }
					let resa = new C_dS_reservation('slots', C_dS_trackingCCD.tnew(item.id, mobminder.account.id).concat([v.cueIn, v.cueOut]));
						resa.css = tboxing.cssName;
					let parts = resa.getparts(this.state.midnight);
					for(let x in parts) sorted.push(parts[x]);
					count++;
				}
			}
		}
		
		// sort reservations
		sorted.sort(function(a,b){ if(a.cueIn > b.cueIn) return 1; else return -1; });
		
		let trs = new Array(); 
		if(count) {
		
			// display headers
			trs.push(this.headers());
			
			// display items
			let part, lastcue = false;
			for(let x in sorted) {
				part = sorted[x];
				if(lastcue) if(lastcue != part.cueIn) { // detection of non sequential reservations
					if(lastcue<part.cueIn) // and if this is not an overbooking
						trs.push(this.pause(lastcue, part.cueIn)); // insert a pause indicator
				}
				trs.push(this.resarows(part)); // inserts one row for each visitor, at least one row
				lastcue = part.cueOut;
			}
			trs.push(this.pause(lastcue)); // last cue is false when no resa exists on the given day
		} else {
			// no reservation yet, propose to put one at the first available time in the hourly. If no hourly, propose the soonest displayed time.
			let hourlyset = this.resource.schedule(new Date(1000*this.state.midnight)); // is false (no hourly) or an hourly set 
			let cueIn = false;
			if(hourlyset) {
				let hourly = hourlyset.hourly; // current hourly for the period
				let shadows = hourlyset.shadows; // 2 or more in each column
				for(let id in shadows) {
					if(shadows[id].cueIn == 0 && shadows[id].cueOut == 86400) { break; } // this day is closed, fall back to soonest displayed time
					if(shadows[id].cueIn == 0) { cueIn = shadows[id].cueOut+this.state.midnight; break; } // this is the soony shadow we need
				}
			}
			trs.push('<tr><td colspan="'+this.selected.length+'" style="padding-top:2em">'+C_XL.w('no reservation')+'</td></tr>');
			trs.push(this.pause(cueIn));
		}
		
		// build table
		this.elements.list.innerHTML = '<table class="l-screen" style="">'+trs.join('')+'</table>';
		this.controls.time.activate();
		if(this.callbacks.plitems) this.callbacks.plitems.cb(dSets);
	},
	plitemsfailed: function() {
		this.busy(false);
	},
	
	// private
	query:function(stamp) {
		let post = new C_iPASS({stamp:stamp, days:1, rescId:this.resource.id, fulldays:0, sms:1, peers:0 });
		let names = {post:{stamp:'stamp',days:'days',rescId:'rescId',fulldays:'fulldays', sms:'sms', peers:'peers'}};
		mobminder.app.post({post:post}, names, './queries/plitems.php', this.events.plitems, this.events.plitemsfailed);
	},
	height: function(cueIn, cueOut) {		
		let seconds = (cueOut - cueIn);
		let emperhour = 6; // in units of em
		let em = (10*seconds*emperhour/3600)|0; em /= 10; // keep one digit after the comma 
		return em;
	},
	pause:function(cueIn, cueOut) { // no resa in here
		cueIn = cueIn || mobminder.account.rangeIn+this.state.midnight;
		let x, tds = new Array();
		let height = 1.5; // min height for a planning line
		
		if(is.tactile) { // that's where you push new reservations with your big finger, needs room
			height = 3; 	
		} else
			if(cueIn && cueOut) if(this.state.duration) height = this.height(cueIn, cueOut);
		
		for(let x in this.selected) {
			let detail = this.selected[x];
			if(detail==details.language) continue; // this one is included in the details.visitor display
			let css = P_List.css[detail]||'';
			
			switch(detail) {
				case details.schedule: tds.push(this.freecue(cueIn, css)); break;
				case details.color: tds.push('<td class="'+css+'"><div style="width:1.5em; min-height:'+height+'em">&nbsp;</div></td>'); break;
				case details.duration: 
					let d= '';
					if(cueIn && cueOut) {
						let jsDateIn = new Date(cueIn*1000), jsDateOut = new Date(cueOut*1000);
						d = '('+duration(jsDateOut.span(jsDateIn))+')';
					}
					tds.push('<td class="'+css+'">'+d+'</td>'); 
					break;
				case details.visitor: 
					let td = '<td class="'+css+'">'+C_XL.w('pause')+'</td>'; // for mouse devices (they use the list view for printing purpose)
					if(is.tactile) { // for small devices especially, the list view is the main view
						let sffx = '_padd'+cueIn;
						let add = new C_iCLIK(this.eids.time+sffx, { click:new A_cb(this, this.free, cueIn) } , { tag:'td', ui:C_XL.w('add') } );
						this.controls.time.add1(add, 'p'+sffx);
							td = add.display('mindertext '+css);
					}
					tds.push(td); break;
				case details.smsstatus: 
					for(let templId in this.templates)  // multiple columns, one for each template (2*)
						tds.push('<td class="'+css+'">'+'</td>'); break;
				default: tds.push('<td class="'+css+'"></td>');
			}
			
		}
		return '<tr>'+tds.join('')+'</tr>';
	},	
	freecue: function(cue, css) {
		let jsDateIn = new Date(cue*1000);
		let time = new C_iCLIK(this.eids.time+'_p'+cue, { click:new A_cb(this, this.free, cue) } , { tag:'td', ui:jsDateIn.HHmm() } );
		this.controls.time.add1(time, 'p'+cue);
		return time.display(css);
	},
	resacue: function(o_dS_resa, css, rowspan) {
		let time = new C_iCLIK(this.eids.time+'_'+o_dS_resa.id, { click:new A_cb(this, this.time, o_dS_resa) } , { tag:'td', ui:o_dS_resa.text.time.cin } );
		this.controls.time.add1(time, o_dS_resa.id);
		return time.display(css, rowspan);
	},
	cleanup: function() { this.elements.list.innerHTML = ''; return this; },
	headers: function() {
		let tds = new Array();
		let headers = P_List.headers();
		let name = C_XL.w('sms');
		for(let x in this.selected) {
			let detail = this.selected[x];
			if(detail==details.language) continue; // this one is included in the details.visitor display
			switch(detail) {
				case details.smsstatus: // multiple columns, one for each template (2*)
					for(let templId in this.templates) {
						if(this.smscount>1) name = this.templates[templId].name;
						tds.push('<th>'+name+'</th>');
					}
					break;
				default:
					tds.push('<th>'+headers[detail]+'</th>');
			}
		}
		return '<tr>'+tds.join('')+'</tr>';
	},
	
	resarows: function(part) { // x is the index of the line, unavalabilities and resas with only one visitor have only one line (index 0). 
		let resa = part.resa();
		let height = 1.5; // min height for a planning line
		
		if(resa.visicount==0) // unavalability
			return this.unavailine(part, height); 
		
		// else we have an appointment
		let trs = new Array();
		let vc = 0; // index of visitor in the list, when only one visitor exists, this is and stays zero
		
		for(let visiId in resa.visitors) // one tr line by visitor, redundant data merge vertically using rowspan
			trs.push(this.resaline(part, vc++, resa.visitors[visiId], height)); 
		return trs.join('');
			
	},
	resadetails: function(resa) {
		
		let resadata = new Array();
		for(let x in this.selected) {
			let detail = this.selected[x];
			switch(detail) {
				case details.schedule: resadata[detail] = resa.text.span; break;
				case details.duration: resadata[detail] = '('+resa.text.time.duration+')'; break;
				case details.resanote: resadata[detail] = resa.note; break;
				case details.workcodes: resadata[detail] = resa.text.workcodes; break;
				case details.attendance: resadata[detail] = resa.text.resources.buf; break;
				case details.color: resadata[detail] = resa.css; break;
			}
		}
		return resadata;
	},
	resaline: function(part, vc, visitor, height) {
		let tds = new Array();
		let resa = part.resa();
		let rowspan = resa.visicount;
		
		let infos = this.resadetails(resa);		
		if(details.duration in infos) height = this.height(part.cueIn, part.cueOut);
		if(this.state.extraspace) height += 2;
		
		let vaddress = '';
		if(visitor.address||visitor.zipCode||visitor.city)
			vaddress = visitor.address+', '+visitor.zipCode+' '+visitor.city;
		
		for(let x in this.selected) { 
			let detail = this.selected[x];
			if(detail==details.language) continue; // this one is included in the details.visitor display
			let css = P_List.css[detail]||'';
			let value = infos[detail];
			switch(detail) {
				// visitor's attribute when there is no visitor: those tds stay empty
				case details.visitor: 
					let name = visitor.vname({gender:true, language:this.state.language});
					let div = '<div style="min-height:'+height+'em">'+name+'</div>';
					tds.push('<td class="'+css+'">'+div+'</td>'); 
				break;
				case details.registration: tds.push('<td class="'+css+'">'+visitor.registration+'</td>'); break;
				case details.mobile: tds.push('<td class="'+css+'">'+visitor.mobile+'</td>'); break;
				
				case details.visitorNote: tds.push('<td class="'+css+'"><div>'+visitor.note+'</div></td>'); break; // the inner div limits the height, see (*lv50*)
				case details.resanote: if(!vc) tds.push('<td rowspan="'+rowspan+'" class="'+css+'"><div>'+value+'</div></td>'); break; // the inner div limits the height, see (*lv50*)
				
				case details.birthdate: tds.push('<td class="'+css+'">'+tobdate(visitor.birthday)+'</td>'); break;
				case details.address: tds.push('<td class="'+css+'">'+vaddress+'</td>'); break;
				case details.fixline: tds.push('<td class="'+css+'">'+visitor.phone+'</td>'); break;
				case details.reference: tds.push('<td class="'+css+'">'+visitor.reference+'</td>'); break;
				case details.smsstatus: 
					for(let tid in this.templates) {  // multiple columns, one for each template (2*)
							let t = this.templates[tid];
							let d = C_iTRIGGER.deliveryStatus(t, resa, visitor); // what if the target is a login ???
							let css = C_dS_sms.status.csslist[d.status|0]; 
					// console.log(t,d, css);
						tds.push('<td class="" style="vertical-align:top; text-align:center; padding:0;">'+C_iCOMM.smsSema(css)+'</td>');
					}
					break;
					 
				// resa attributes (only on line vc = 0)
				case details.color:
					if(!vc) tds.push('<td class="'+css+'" rowspan="'+rowspan+'"><div class="'+value+'" style="width:1.5em; min-height:'+height+'em">&nbsp;</div></td>');
					break;
				case details.schedule:
					if(!vc) tds.push(this.resacue(resa, css, rowspan)); break;
				default: 
					if(!vc) tds.push('<td rowspan="'+rowspan+'" class="'+css+'">'+value+'</td>');
			}
		}
		return '<tr>'+tds.join('')+'</tr>';
	},
	unavailine: function(part, height) {
		let tds = new Array();
		let resa = part.resa();
		let infos = this.resadetails(resa);	
		if(details.duration in infos) height = this.height(part.cueIn, part.cueOut);
		if(this.state.extraspace) height += 2;
		
		for(let x in this.selected) {
			let detail = this.selected[x];
			if(detail==details.language) continue; // this one is included in the details.visitor display
			let css = P_List.css[detail]||'';
			let value = infos[detail]||'';
			switch(detail) {
				case details.smsstatus: 
					for(let templId in this.templates)  // multiple columns, one for each template (2*)
						tds.push('<td class="'+css+'">'+'</td>'); break;
							
				// resa attributes		
				case details.color: tds.push('<td class="'+css+'"><div class="'+value+'" style="width:1.5em; min-height:'+height+'em">&nbsp;</div></td>'); break;
				case details.schedule: tds.push(this.resacue(resa, css)); break;
				default: 
					tds.push('<td class="'+css+'">'+value+'</td>');
			}
		}
		return '<tr>'+tds.join('')+'</tr>';
	},
	
	// callbacks
	redraw: function() {  // called when the level of display details is redefined.
		if(vbs) vlog(this.eids.list,'P_List','redraw','');
		this.cleanup();
		this.selected = this.selection();
		if(this.state.resas) this.plitems(this.state.resas);
	},
	onresize: function() {}, // for generic interface compatibility
	selection: function() { // columns to be displayed in this view, they are set through display details
	
		let level = C_dS_details.get(planning.text, this.resource.resourceType).details;	
		if(is.tactile) {
			let tlevel = (details.schedule|details.color|details.duration|details.visitor|details.resanote); // for iPad & iPhones, there is no custom choice for the list view details
			if(!(level&details.visitor)) tlevel -= details.visitor; // still if visitor anonymity is required, we remove it from the list also for tactile
			level = tlevel;
		}
		
		
		// for textually displayed items
		let displayorder = [ details.schedule, details.color, details.duration
			, details.language, details.visitor, details.registration, details.birthdate, details.address
			, details.mobile, details.smsstatus, details.fixline, details.reference
			, details.visitorNote, details.workcodes, details.resanote];
		
		// for styling options
		this.state.extraspace = !!(level&details.extraspace);
		this.state.language = !!(level&details.language);
		this.state.duration = !!(level&details.duration);
		this.state.emptytboxes = !!(level&details.emptytboxes);
		
		//
		let selected = new Array();
		for(let x in displayorder) if(level&displayorder[x]) selected.push(displayorder[x]);
		return selected; // selected details, coming in the right display order
	},
	
	// event handling
	time: function(resa, iClick_instance, skeys, mouseevent) { // the time display has been clicked
		// console.log('planning.js', 'P_List', 'time', 'resaId:'+resa.id+',in:'+time(resa.cueIn)+' mousevent:',mouseevent,' skeys:',skeys);
		// let resa = C_dS_reservation.get(resaId);
		let resamodal = this.callbacks.resaopen.cb(resa, mouseevent, skeys); // opens the modal
	},
	free: function(cue, iClick_instance, skeys, mouseevent) {
		// console.log('planning.js', 'P_List', 'free', 'resource:'+this.resource.id+',in:'+time(cue)+' mousevent:',mouseevent,' skeys:',skeys);
		rmems.flush('slots');
		let id = 0, stamp = this.state.midnight;
		let attendee = new C_dS_attendee('slots', [0, id, this.resource.resourceType, this.resource.id]);
		let cueable = new C_dS_reservation('slots',C_dS_trackingCCD.tnew(id, mobminder.account.id).concat([cue, cue+mobminder.account.secondsPerSlice]));
		let resamodal = this.callbacks.resaopen.cb(cueable, mouseevent, skeys); // opens the modal
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H A N G E S     V I E W 
//
function P_Changes(eid, callbacks, preset) {
	this.resource = C_dS_resource.get(preset.rescId);
	let e = eid+'_'+this.resource.id+'_';
	this.eids = { list:e+'list', busy:e+'busy', time:e+'time', overlay:e+'overlay' };
	this.elements = new A_el();
	this.callbacks = callbacks; // like { screenchange:o_callback, resaopen: }
	this.state = P_Changes.defaults.align(preset);
	this.events = { plitems:new A_cb(this,this.plitems), plitemsfailed: new A_cb(this,this.plitemsfailed) };
	this.controls = new A_ct({});
		let resatemplates = C_dS_smsTemplate.byTrigger(class_resa_any); // take only the templates that are triggered by a reservation scheduling
	this.templates = resatemplates[class_visitor];
	this.msgClass = C_dS_smsTemplate.childs; // will be C_dS_sms
	this.smscount = C_dS_smsTemplate.count(class_resa_any, class_visitor);
	this.catalysts = new C_catalyst(C_dS_reservation.catalyst);
}
P_Changes.defaults = new A_df( { busy:false, midnight:false, resas:false, extraspace:false } );
P_Changes.headers = function() {		
	if(vbs) vlog('planning.js','P_Changes','headers','');
	let headers = [];
	headers[details.schedule] 		= ''; // <= in some cases we want no header text
	headers[details.duration] 		= '';
	headers[details.resanote] 		= C_XL.w('note');
	headers[details.visitor] 		= C_XL.w('visitor');
	headers[details.registration] 	= C_XL.w('visi-abr-registration');
	headers[details.mobile] 		= C_XL.w('mobile');
	headers[details.address] 		= C_XL.w('address');
	headers[details.fixline] 		= C_XL.w('visi-abr-phone');
	headers[details.visitorNote] 	= C_XL.w('info');
	headers[details.birthdate] 		= C_XL.w('visi-abr-birthday');
	headers[details.workcodes] 		= C_XL.w('workcodes');
	headers[details.color] 			= '';
	headers[details.smsstatus] 		= 'SMS';
	headers[details.attendance] 	= C_XL.w('attendance');
	return headers;
};
P_Changes.css = (function() {
	let cssclasses = [];
	cssclasses[details.schedule] 	= 'schedule';
	cssclasses[details.duration] 	= 'duration';
	cssclasses[details.resanote] 	= 'resanote';
	cssclasses[details.visitor] 	= 'vname';
	cssclasses[details.registration] = 'registration';
	cssclasses[details.mobile] 		= 'mobile';
	cssclasses[details.visitorNote] = 'visinote';
	cssclasses[details.birthdate] 	= 'visibirth';
	cssclasses[details.workcodes] 	= 'workcodes';
	cssclasses[details.color] 		= 'color';
	cssclasses[details.smsstatus] 	= 'smsstatus';
	cssclasses[details.attendance] 	= 'attendance';
	return cssclasses;
})();
P_Changes.prototype = {
	display: function() {
				let spinner = '<div class="spinner">'+'</div>';
			let busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:30vh;';
		let overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';
		
		let changes = '<div class="P_Changes" id="'+this.eids.list+'" style="margin:1em auto 1em auto;"></div>'; // width:80%; max-width:100%; 
		return changes+overlay;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('P_Changes');
		return this;
	},
	set: function(jsDate) {
		this.busy(true);
		if(vbs) vlog(this.eids.list,'P_Changes','set','date:'+jsDate.sortable());
		this.state.midnight = jsDate.stamp();
		this.query(jsDate.sortable());
	},	
	setdate: function(jsdate) {
		this.set(jsdate);
	},
	highlight: function(resaId, css) {
	},
	busy: function(onoff) {
		this.state.fbusy = onoff;
		if(onoff) { $(this.elements.overlay).addClass('on'); C_iWIN.cursor('wait');	}
		else { $(this.elements.overlay).removeClass('on'); C_iWIN.cursor();	}
		return this;
	},	
	lastresasaved: function(dSresa) { // exists for compatibility with parent
	},
	
	// post feedbacks
	plitems: function(dSets) {
	
		this.busy(false).cleanup();
		this.state.resas = dSets;
		let reservations = dSets['C_dS_reservation'];
		let ids = []; for(let id in reservations) { ids.push(id); }
		
		let table = new C_iARRAY(this.eids.list, this.catalysts, { onrow:new A_cb(this, this.onrow) }, { ids:ids, max:false, sum:false, count:true, viewset:true, xport:true, endoflist:true }); 
		this.elements.list.innerHTML = table.display('reservations');
		table.activate();	
		return;
	},
	plitemsfailed: function() {
		this.busy(false);
	},
	
	// private
	query:function(stamp) {
		let post = new C_iPASS({stamp:stamp, days:1, rescId:this.resource.id, fulldays:0, sms:1, peers:0 });
		let names = {post:{stamp:'stamp',days:'days',rescId:'rescId',fulldays:'fulldays', sms:'sms', peers:'peers'}};
		mobminder.app.post({post:post}, names, './queries/changes.php', this.events.plitems, this.events.plitemsfailed);
	},
	cleanup: function() { this.elements.list.innerHTML = ''; return this; },

		
	// callbacks
	redraw: function() {  // called when the level of display details is redefined.
		if(vbs) vlog(this.eids.list,'P_Changes','redraw','');
		this.cleanup();
		if(this.state.resas) this.plitems(this.state.resas);
	},
	onresize: function() {}, // for generic interface compatibility
	onrow: function(rid, mouseevent, skeys) { // rid was passed as correlator
		let dSresa = this.state.resas['C_dS_reservation'][rid];
		
		// console.log('P_Changes.onrow()',rid, skeys, mouseevent);
		if(this.callbacks.resaopen) this.callbacks.resaopen.cb(dSresa, mouseevent, skeys); // PVH 2021-01: after this reservation is saved, the display jumps to the reservation date (normal planning behavious). This is wrong. Use this feedback method to return in here and keep the right date displayed and table updated : (*onresa*)
	}
}




var screens = { elearning:1, search:10, resafind:15, week:20, list:30, changes:35, hourly:40, preferences:50, visitors:60, statistics:70, smsdash:80, archives:85, connections:90,  }


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S I N G    A G E N D A    V I E W  (dropdown control, common for vertical and horizontal view)
//
function C_iAGVIEW(eid, callbacks, preset) {
		preset  = preset || {};
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iAGVIEW.defaults.align(preset);
	
		const options = C_iAGVIEW.options(preset);
	const ddwn = new C_iDDWN(this.eids.ddwn, callbacks, options, { frozenui:this.state.title, escape:false, tag:preset.tag, style:preset.style, css:preset.css, tip:preset.tip } );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iAGVIEW.defaults = new A_df({ title:'views' });
C_iAGVIEW.prototype = {
	// public
	display: function(css) { return this.controls.ddwn.display(css); },
	activate:function() { this.controls.activate();	},
	trigger: function() { this.controls.ddwn.drop(); }

	// private
}
C_iAGVIEW.options = function(misc) { // miscellaneous like { exclude:screen to be excluded from list, include:[misc options] }
	const labels = [], presets = [];
	misc = misc||{};
	labels[screens.search] 		= 'standard screen'; 	presets[screens.search] = { sign:'binoculars' };
	labels[screens.week] 		= 'week screen';		presets[screens.week] = { sign:'columns' };
	labels[screens.list] 		= 'list screen';		presets[screens.list] = { sign:'list-ol' };
	labels[screens.changes] 	= 'changes screen';		presets[screens.changes] = { sign:'retweet' };
	labels[screens.hourly] 		= 'hourlies';			presets[screens.hourly] = { sign:'sliders-v' };
	if(misc.exclude) delete labels[misc.exclude];
	if(misc.include)
		for(let x in misc.include) { labels[x] = misc.include[x].label; presets[x] = misc.include[x].preset; }
	const xllabels = C_XL.w(labels);
	const order = new Array(); for(let x in labels) order.push(x);
	const sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	const count = order.length;
	return { order:order, labels:xllabels, presets:presets, count:count };
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   A G E N D A     :   P L A N N I N G      V I E W S      M A N A G E M E N T 
//
function P_AgendaHVL(eid, callbacks, preset) { // Horizontal, Vertical or List agenda views, used by C_iPLAN
	const e = eid+'_';
	this.eids = { eid:eid, hvl:eid+'_hvl', rscname:e+'name', details:e+'dtls', zoom:e+'zoom', window:e+'win', wkvw:e+'wkvw', stvw:e+'stvw', bars:e+'bars' };
	this.elements = new A_el();
	this.state = P_AgendaHVL.defaults.align(preset);
	this.callbacks = callbacks; // like { screenchange:, rescsaved: };
	this.planning = false; // is the currently displayed instance, one of [P_vertical, P_houlry, P_horiz, P_list, P_changes]
	this.controls = new A_ct({});
	this.events = { resaopen:new A_cb(this, this.resaopen), screenchange:this.callbacks.screenchange, plitems:new A_cb(this, this.plitems)
					, rescdeleted:this.callbacks.rescdeleted, rescsaved:this.callbacks.rescsaved, details:new A_cb(this, this.detailsset) };
	this.keys = { copypaste_escape:new A_cb(this, this.copypaste_escape) };	
}
P_AgendaHVL.defaults = new A_df( { 
	  // date:false,
	  zoom:false, resourceId:0
	, days:{current:1, search:1, list:1, week:7}
	, busy:false, resas:false, orientation:false
	, copypaste:false, lastresasaved:false } );
P_AgendaHVL.prototype = {
	// public
	display:function(newscreen, resourceId) {
		if(newscreen) mobminder.app.screen = newscreen;
		if(vbs) vlog('planning.js','P_AgendaHVL','display','newscreen:'+newscreen+', resourceId:'+resourceId); 

		let o = planning.horizontal; // orientation
		this.state.days.current = this.state.days.search; 
		this.state.resourceId = mobminder.account.single || 0; // assumes default search screen, where all resources and a single calendar day are shown
		
		this.state.resourceId = resourceId; 
		if(this.planning) if(this.planning.ruler) this.planning.ruler.deactivate(); // in the previous planning, stop positionning the red current time line, a new one will be instaciated with the right view
		
		switch(mobminder.app.screen) {
			case screens.search: if(mobminder.account.single) o = planning.vertical; break;
			case screens.week: 		o = planning.vertical; 	this.state.days.current = this.state.days.week; break;
			case screens.list: 		o = planning.text; 		break; 
			case screens.changes: 	o = planning.changes; 	break; 
			case screens.hourly: 	o = planning.hourly; 	this.state.days.current = 7; break;
		}
		this.state.orientation = o;
			resourceId = mobminder.account.single?mobminder.account.single:resourceId;
			
		let display, header, screen = mobminder.app.screen;
			switch(this.state.orientation) {
				case planning.vertical: 	display = this.vertical(resourceId, screen); 	header = this.vheader(planning.vertical, screen); break;
				case planning.horizontal: 	display = this.horizontal(); 					header = this.hheader(screen); break;
				case planning.text: 		display = this.list(resourceId);				header = this.vheader(planning.text, screen); break;
				case planning.changes: 		display = this.changes(resourceId);				header = this.vheader(planning.text, screen); break;
				case planning.hourly: 		display = this.hourly(resourceId);				header = this.vheader(planning.vertical, screen); break;
			}
				let MSIEfix = ''; if(is.browser.MSIE) MSIEfix = 'height:100%;'; // height:100% is necessary only for MSIE
			let planningdiv = '<div class="P_AgendaHVL" id="'+this.eids.hvl+'" style="'+MSIEfix+'">'+display+'</div>'; 
		return { planning:planningdiv, header:header, orientation:o }; 
		
	},
	activate:function() {
		if(vbs) vlog('planning.js','P_AgendaHVL','activate','');
		this.elements.collect(this.eids);
		if(this.planning) this.planning.activate(); 
		this.zoom(this.state.zoom); 
		this.controls.activate();
		this.lastresasaved();
		new C_iWIN(this.eids.window, new A_cb(this, this.onresize) ); // register to the window size watchdog, so when the screen is stretched, the planning will be re-drawn
		
		new C_KEY([C_KEY.code.alpha.z+C_KEY.code.s.ctrl], new A_cb(this, this.togglezoom), 'P_AgendaHVL::'+this.eids.eid); // Zoom shortcut key
	},
	busy: function(onoff) { this.planning.busy(onoff); return this; },
	setdate: function(jsDate, prevdate, dayskip) {
		
		// if(!jsDate) jsDate = mobminder.app.dp.jsdate(); else 
		jsDate = jsDate.clone({midnight:1});
		if(vbs) vlog('planning.js','P_AgendaHVL','setdate','jsDate:'+jsDate.sortable()); 
		this.planning.setdate(jsDate, prevdate, dayskip); // this planning is either P_List, P_Changes, P_horiz or P_Vertical
		
		// clean up everything that was previously downloaded from the server (target bank limited to plitems)
		rmems.flush('plitems');
		ntmems.flush('plitems');
		C_dS_prebooking.flush();
		// if(this.state.copypaste) this.copypaste(); // rehearsals copypaste mode from one screen to the next one when navigating across weeks
	},
	browsingdates: function(skip) { if('browsingdates' in this.planning) this.planning.browsingdates(skip); }, // some is busy changing the display date
	refresh: function() { // no server call, plitems are re-drawn from cache
		if(vbs) vlog('planning.js','P_AgendaHVL','refresh','');
		// console.log('planning.js','P_AgendaHVL','refresh',false);
		if(this.planning) this.planning.redraw();
		if(this.state.copypaste) this.copypaste(); // rehearsals copypaste mode from one screen to the next one when navigating across weeks
		return this;
	},
	highlight: function(resaId, css, now) {
		if(vbs) vlog('planning.js','P_AgendaHVL','highlight','resaId:'+resaId+', css:'+css); 
		this.planning.highlight(resaId, css, false, now);
		return true;
	},
	stickers: function(resa, is, css) { // used to let a resa appear on the current planning (e.g. C_iSLOT to preview free slots)
		const displayed = mobminder.app.dp.jsdate();
		const range = { cin:displayed.stamp(), out:displayed.clone({d:this.state.days.current}).stamp() }
		if(resa.cueOut >= range.cin && resa.cueIn < range.out)
			if(resa.id>0) return this.highlight(resa.id, css, true /*now*/); // highlight a sticker that is already on the planning
			else return this.planning.stickers(resa, is, css); // places new sticker(s) on the planning
		return false;
	},
	copypaste: function(dS_resa, options) { // must be called after activation of P_column's inside P_vertical

		if(vbs) vlog('planning.js','P_AgendaHVL','copypaste',''); 

		if(dS_resa) { // is mandatory only at initialisation of the process
			options = options || {};
			this.state.copypaste = { ds:dS_resa.clone('slots'/*destination bank*/), cut:options.cut||false };
			
			if(this.state.copypaste.cut) this.state.copypaste.ds.replan = dS_resa.id;
			new C_KEY(C_KEY.code.s.escape, this.keys.copypaste_escape, 'P_AgendaHVL::'+this.eids.eid); // (*cp02*)
		} else  
			if(dS_resa===false) if(this.state.copypaste) return this.copypaste_escape(); // cancelling the copypaste process
		
		// propagate to planning object
		if('copypaste' in this.planning) return this.planning.copypaste(this.state.copypaste); // (*cp03*)
		return false;
	},
	
	// event handling
	scroll: function() {

	},
	onresize: function(size) { this.planning.onresize(size); },  // for generic interface compatibility
	copypaste_escape: function() { // (*cp02*)
		C_KEY.unbind(C_KEY.code.s.escape, this.keys.copypaste_escape); 
		this.state.copypaste = false;
		mobminder.app.copypaste(false);
		if('copypaste' in this.planning) return this.planning.copypaste(false);
		return false; // no propagation
	},
	plitems: function(inlineDataSets) { // part of this.events (*hvl01*), is called from lower level agendas after new planning items were digested
		if(vbs) vlog('planning.js','P_AgendaHVL','plitems','');
		// console.log('planning.js','P_AgendaHVL','plitems','');
		if(this.callbacks.plitems) this.callbacks.plitems.cb(inlineDataSets);
		if(this.state.copypaste) this.copypaste(); // rehearsals copypaste mode from one screen to the next one when navigating across weeks	
		this.lastresasaved();
	},
	
	// private
	lastresasaved: function(dSesa) {
		dSesa = dSesa || this.state.lastresasaved;
		this.state.lastresasaved = dSesa;
		if(this.state.lastresasaved)
			this.planning.lastresasaved(this.state.lastresasaved);
	},
	hheader:function() { // horizontal view (multi agendas only)
	
		return '';
	},
	vheader: function(orientation, screen) { // vertical header interativity (top left of screen, having agenda view switch control)
		const resource = C_dS_resource.get(this.state.resourceId);
		
		if(vbs) vlog('planning.js','P_AgendaHVL','vheader','screen:'+screen+', name:'+resource.name+', type:'+resource.resourceType+', orientation:'+orientation); 
		
			const include = []; // those options are included in the sandwich menu
				include[0] = { label:'calendar', preset:{sign:'calendar-alt'} }; 
				if(permissions.may(pc.ac_disprefs)) include[1] = { label:'display details', preset:{sign:'eye'} }; 
				if(resource.guideId) include[99] = { label:'guidelines', preset:{sign:'warning'} };
				
			let prefix = ''; 
		switch(screen) {
			case screens.week: break;
			case screens.list: break; 
			case screens.changes: prefix = C_XL.w('agenda_changes')+'&nbsp;&nbsp;'; break; 
			case screens.hourly: prefix = C_XL.w('hourlies for')+'&nbsp;&nbsp;'; break;
		}
						const tag = resource.tag?'<div class="'+C_iSKIN.tagcss(resource.tag)+'" style="font-size:1.25em; width:1.4em; line-height:50%; padding-left:.6em;"></div>':'';
						const resourcename = resource.name+tag; // this raw and idle header title is needed here (*hp01*)

					const rncss = 'resource-label '+(resource.color==0?'':'c'+resource.color); // do not display the c0 color that is "no color"
					const rnstyle = 'display:inline-block; line-height:80%; font-size:1.0em; padding:.6em .9em; margin:0;'; // see also planning.css .resource-label
				const display = '<div style="'+rnstyle+'" class="'+rncss+'">'+resourcename+'</div>';

			// const title = symbol('menu','fa-11x','padding-left:.5em; float:left;')+prefix+display; // fa-bars symbol
			const title = prefix+display; // fa-bars symbol
			let tip = C_dS_guidelines.tip(resource);
				if(tip) tip = { text:tip, css:'help-tip guidelines' };
			const agvrcss = 'resource-name'; // f-calibri-bold+(resource.color==0?'':'c'+resource.color); // do not display the c0 color that is "no color"
			const agvstyle = 'text-align:right; vertical-align:middle; padding:0em 1em 0 16em; white-space:nowrap;'; // see also planning.css .resource-name
			const agvpreset = { tip:tip, title:title, include:include, exclude:mobminder.app.screen, tag:'div', style:agvstyle, css:agvrcss };
		const rscdown = new C_iAGVIEW(this.eids.rscname, { onselect:new A_cb(this, this.rscname, orientation) }, agvpreset ); // an entire <td></td>

			const z = symbol(this.state.zoom?'zoom-out':'zoom-in','fa-13x','padding-right:0;');
			const w = symbol('weekview','fa-rotate-90 fa-11x','padding-right:0; display:inline-block;');
			const s = symbol('close','fa-13x','padding-right:0;');
			const b = symbol('menu','fa-13x','padding-right:0;');
		const zoom = new C_iCLIK(this.eids.zoom, {click:new A_cb(this, this.togglezoom)}, { ui:z, tag:'div', style:'width:5em; min-width:5em;', css:'topbar-item', tip:C_XL.w('tip zoom'), 		hidden:(screen==screens.list||screen==screens.changes) 	} );
		const wkvw = new C_iCLIK(this.eids.wkvw, {click:new A_cb(this, this.onweekview)}, { ui:w, tag:'div', style:'width:5em; min-width:5em;', css:'topbar-item', tip:C_XL.w('tip weekview'), 	keys:[C_KEY.code.F.F2], hidden:(screen==screens.week) 	} );
		const stvw = new C_iCLIK(this.eids.stvw, {click:new A_cb(this, this.onstndview)}, { ui:s, tag:'div', style:'width:5em; min-width:5em;', css:'topbar-item', tip:C_XL.w('tip searchview'), keys:[C_KEY.code.F.F1], hidden:(screen==screens.search) } );// , C_KEY.code.s.escape
		const bars = new C_iCLIK(this.eids.bars, {click:new A_cb(this, this.onbars    )}, { ui:b, tag:'div', style:'width:5em; min-width:5em;', css:'topbar-item', tip:false, hidden:false } );// , C_KEY.code.s.escape
		
		this.controls.add({rscdown:rscdown, zoom:zoom, wkvw:wkvw, stvw:stvw, bars:bars});
		
				const leftstyle = 'display:flex; align-items:center; gap:8px; min-width:0;';
				const rightstyle = 'justify-self: end; min-width:0;';
				
			const leftergroup = '<div class="topbar-left-pack">'+stvw.display()+wkvw.display()+bars.display()+'</div>';
			const rightergroup = '<div class="topbar-right-pack"><div class="topbar-right">'+rscdown.display()+'</div></div>';
			const centralpad = '<div style="topbar-center-pad">'+'</div>';
			
		const header = '<div class="agenda-header-wrap">'+leftergroup+centralpad+rightergroup+'</div>';
		
		return header;
		
		// at this moment, stvw.display(), wkvw.display(), and rscdown.display() are <td>'s, but we can make them <div>. Can you transform the table into a nice <div style="grid"> with the necessary css that makes the central padding stay in the grid implementation? Ask if not clear.
	},
	
	list:function(resourceId) { // list view, new P_List
		this.planning = new P_List(this.eids.hvl, this.events, { rescId:resourceId }); // (*hvl01*)
		let html = this.planning.display();
		return html;
	},
	changes:function(resourceId) { // daily changes view, new P_Changes
		this.planning = new P_Changes(this.eids.hvl, this.events, { rescId:resourceId }); // (*hvl01*)
		let html = this.planning.display();
		return html;
	},
	horizontal:function() { // horizontal view (multi agendas only), new P_horiz
		this.planning = new P_horiz(this.eids.hvl, this.events); // (*hvl01*)
		return this.planning.display();
	},
	
	vertical:function(resourceId, screen) { // vertical view (standard view for single accounts and weekly view), new P_Vertical
		this.planning = new P_Vertical(this.eids.hvl, this.events, { rescId:resourceId, days:this.state.days.current } ); // (*hvl01*)
		let columns = this.planning.display();
		return columns;
	},	
	hourly:function(resourceId) { // hourly management view
		this.planning = new P_hourly(this.eids.hvl, this.events, { rescId:resourceId, days:this.state.days.current } );
		let columns = this.planning.display();
		return columns;
	},
	togglezoom: function() { 
		this.zoom(!this.state.zoom); 
	},
	onweekview: function() { this.rscname(1, screens.week); return false; },
	onstndview: function() { this.rscname(1, screens.search); return false; },
	onbars: function() { // here we go trigger C_iAGVIEW (this.controls.rscdown) such that it opens up.
		this.controls.rscdown.trigger(); return false; // PVH 2026 - That is saving the e-learning credibility because all our videos have this button...
	},
	zoom: function(zoom) {
		this.state.zoom = zoom;
		
		// change the icon on screen
		if(this.controls.zoom) { //exists only after this.vheader() has been called
			let s;
			if(this.state.zoom) s = symbol('zoom-out','fa-13x','padding-right:.5em;');
				else s = symbol('zoom-in','fa-13x','padding-right:.5em;');
			this.controls.zoom.set(s); 
		}
		
		// change the display mode
		$(this.elements.hvl).removeClass('zoom'); if(this.state.zoom) $(this.elements.hvl).addClass('zoom'); // toggles a css indicator  // see (*zm001)		
		if(this.planning) if('zoom' in this.planning) this.planning.zoom(this.state.zoom);
	}, 
	
	// private
	resasaved: function(dataSets) { // resa saved from sticker click
		let resa = false;
		for(let id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('planning.js','P_AgendaHVL','resasaved','date:'+(resa?resa.jsDateIn.sortable():'none')); 
		if(this.state.copypaste) if(this.state.copypaste.cut) this.copypaste_escape();
		if(!resa) return;
		// console.log('planning.js','P_AgendaHVL','resasaved','date:'+(resa?resa.jsDateIn.sortable():'none')); 
		this.state.lastresasaved = resa;
		// mobminder.app.setdate.cb(resa.jsDateIn);
		if(this.callbacks.resasaved) this.callbacks.resasaved.cb(resa);
	},
	resadeleted: function(jsDate) { 
		this.setdate(jsDate); 
	},
	resaopen: function(cueable, mousevent = {}, skeys = {ctrlkey:false, shiftkey:false}) { // triggered by a click on a planning sticker
		
		// PVH 2025, only planning views using P_Sticker have mousevent and skeys arriving set, not yet developped for changes view and list view
		
				const rid = cueable.id;
			if(rid<=0) if(!permissions.may(pc.cr_resas)) return false;
			if(rid>0) if(!permissions.may(pc.op_resas)) return false;
	
		const dS_resa = cueable.resa(); // (*p01*)
	
		// console.log('P_AgendaHVL.resaopen('+rid+') skeys:', skeys, 'mousevent.button:',mousevent.button);
		
		// if(mousevent.button!==undefined) {
			// switch(mousevent.button) {
				// case 0: console.log('that is a left click'); break; 
				// case 1: console.log('that is a wheel click'); return false; break; 
				// case 2: console.log('that is a right click'); return false; break; 
			// }
		// }
		
			const isappointment = cueable.assess == resaclass.appointment;
				const iconstyle = 'width:1.4em; min-width:1.4em; font-size:1.2em; line-height:1.0em;';
			const keyboard = '<div style="'+iconstyle+'" class="fa fa-gray fa-keyboard">'+'</div>';
		
		if(skeys.shiftkey&&skeys.ctrlkey) { // that is a Ctrl + Shift + click action
			
			const hasctrlshift = C_dS_customCss.getCtrlShift(resaclass.appointment, 3); // some of dS_customCss might have a ctrlshift value of 1 (which is the Ctrl bit)
			
			// console.log('P_AgendaHVL.resaopen('+rid+') with Ctrl key ON, hasctrlshift = '+(hasctrlshift?'yes':'no')+' isappointment = '+(isappointment?'yes':'no'));
			if(hasctrlshift&&isappointment) {
				const docall = { values:{rid:rid, ccssid:hasctrlshift.id, bank:'plitems'}, names:{rid:'rid', ccssid:'ccssid', bank:'bank'} };
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
				const docall = { values:{rid:rid, ccssid:hasshift.id, bank:'plitems'}, names:{rid:'rid', ccssid:'ccssid', bank:'bank'} };
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
				const docall = { values:{rid:rid, ccssid:hasctrl.id, bank:'plitems'}, names:{rid:'rid', ccssid:'ccssid', bank:'bank'} };
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
		
			const focus = (rid<=0?'onvisitors':'onnote');
			return new M_RESA(dS_resa, { saved:new A_cb(this, this.resasaved), deleted:new A_cb(this, this.resadeleted) }, { focus:focus, bank:'plitems' } );
		}
		return false;
	},
	
	// ajax callbacks
	ccssforced: function(ctrlshift,dataSets,stream) { // ctrlshift arrives as 1, 2 or 3, see this.resaopen()
		// console.log(ctrlshift,dataSets,stream);
		
			let resa = false;
		for(let id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('planning.js','P_AgendaHVL','ccssforced','date:'+(resa?resa.jsDateIn.sortable():'none'+', '+'cssColor:'+resa.cssColor+', '+'cssPattern:'+resa.cssPattern+', '+'cssTags:'+resa.cssTags)); 
		if(!resa) return;
		ctrlshiftplay(ctrlshift); // from mobframe.js, mobminder.sounds
		mobminder.app.refresh({callserver:false}); // only redraws the screen, does not download anything from server
	},
	
	// controls feedback
	detailsset: function() {
		this.planning.redraw();
		if(this.callbacks.ondetails) this.callbacks.ondetails.cb(this.state.orientation);
	},
	rscname: function(orientation, option) { // the resource name has been clicked on a vertical screen mode, and an option has been chosen from the pop-up menu
		if(vbs) vlog('planning.js','P_AgendaHVL','rscname','option:'+option); 
		
			let resource = C_dS_resource.get(this.state.resourceId);
		switch(option|0) {
			case 0: // open Yearly Calendar
				// as we are triggered from a modal-pad, this one needs to start with an animation delay
				setTimeout( function(that, resource) {
						new M_RESC(resource, { saved:that.callbacks.rescsaved, deleted:that.callbacks.rescdeleted }, { tab:1 } ); } 
					, C_iMODAL.animationdelay, this, resource );
				break;
			case 1: // open display details settings"
				// as we are triggered from a modal-pad, this one needs to start after the animation delay // see (*md03*)
				setTimeout( function(that, resource) {
				new M_details(false, {changed:new A_cb(that, that.detailsset)}, {rsctype:resource.resourceType, orientation:orientation}) }
					, C_iMODAL.animationdelay, this, resource, orientation ); 
				break;
			case 99: // open guidelines
					let guidelines = C_dS_guidelines.get(resource.guideId);
				// as we are triggered from a modal-pad, this one needs to start after the animation delay // see (*md03*)
				setTimeout( function(that, guidelines) {
					new M_GDLNS(guidelines, {}, { tab:0, consultonly:true } ); 
				}, C_iMODAL.animationdelay, this, guidelines);
				break;
			default:  // then option is one of let screens = {...}
				if(this.callbacks.screenchange) this.callbacks.screenchange.cb(option|0, this.state.resourceId);
		}
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E M O T E    S E A R C H   C O N T R O L L E R 
//
function C_iSLOT(eid, o_dS_reservation, callbacks, preset) { // a single slot entry
	this.resa = o_dS_reservation;
	let positive = this.resa.id<0 ? this.resa.id*-1 : this.resa.id;
	
	this.eids = { time:eid+'_'+positive, date:eid+'_date_'+positive, visi:eid+'_v_'+positive };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { slotclick:A_cb, slothover:A_cb, slotgone:A_cb };
	this.state = C_iSLOT.defauts.align(preset);
	C_iSLOT.eids[this.eids.time] = this;
	
	// build up register 
	let midnight = this.resa.midnight;
		
	let fCalsString = this.resa.text.resources.f;  //C_dS_attendee.getResourcesNames(this.resa.id, class_fCal);
	let bCalId = this.resa.bCal.id;
	let uCalsString = this.resa.text.resources.u; //C_dS_attendee.getResourcesNames(this.resa.id, class_uCal);
	
	C_iSLOT.register.midnight.add(midnight, fCalsString, bCalId, uCalsString, this.resa.cueIn, this);
	
	this.fCalsString = fCalsString;
	this.uCalsString = uCalsString;
	// if(vbs) vlog('planning.js','C_iSLOT','constructor','midnight='+sortable(midnight)+', fCals:'+fCalsString+', bCal:'+bCalId+', uCals:'+uCalsString); 
			let tip = this.state.tip?{ text:this.resa.rtip({displaydate:true}), css:'sticker-tip '+this.resa.tipcss }:false;
			let cbks = { click:new A_cb(this, this.selected), hover:new A_cb(this, this.hover), gone:new A_cb(this, this.gone) };
			let style = 'min-width:2em; float:left; line-height:'+this.state.lineheight+';';
		let time = new C_iCLIK(this.eids.time, cbks, { ui:this.resa.text.time.cin, tag:'span', style:style, tip:tip, hoverdelay:200 } );
		let date = new C_iDPpop(this.eids.date, this.resa.jsDateIn, {setdate:mobminder.app.setdate}, { tag:'div', style:'line-height:'+this.state.lineheight+';', abreviation:'abr', weekday:true, year:false, weeknumb:mobminder.context.surfer.weeknumb });

	this.controls = new A_ct({time:time, date:date}); // heading date can be clicked, time slot can be clicked.
}
C_iSLOT.defauts = new A_df( { enabled:true, css:'', tip:false /* tip is true or false */, lineheight:'1.6em' } );
C_iSLOT.register = new C_regS({name:'midnight', sort:true}); 
C_iSLOT.eids = new Array(); 
C_iSLOT.prototype = { 
	resources: function(type, css) {	
		switch(type) {
			case class_bCal: return this.resa.bCal.rbullet()+this.resa.bCal.name; break;
			case class_uCal: return this.uCalsString; break;
			case class_fCal: return this.fCalsString; break;
		}
		return '';
	},
	displayDate: function() {
		return this.controls.date.display();
	},
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
	visitors: function(options) {
			options = options || {};
		const dS_resa = this.resa;
		const display = new Array();
		if(dS_resa.visicount) {
			let c = 0; if(dS_resa.visicount>1) c=1;
			for(let visiId in dS_resa.visitors) { 
				if(!dS_resa.visitors[visiId]) { console.log('Visitor id '+visiId+' is referenced but does not exists anymore'); continue; } // the visitor dS has been deleted but an attendee still exists (should never happen)
				let dS_visitor = dS_resa.visitors[visiId];
				let x = ''; if(c) x = '<b>'+c+'</b>. '; // when the counter is activated, this displays a numbering, else nope.
					const m = dS_visitor.mobile?'&nbsp;&nbsp;&nbsp;&nbsp;'+dS_visitor.mobile+' ':'';
					const n = dS_visitor.vname({gender:true});
				display.push('<a id="'+this.eids.visi+'_'+dS_visitor.id+'">'+x+n+m+'</a>');
				if(c) c++;
			}
		}
		return display.join('<br/>');
	},
	activate: function() {	
		this.elements.collect(this.eids);
		this.controls.activate('C_iSLOT');
	},	
	selected: function() {
		if(this.callbacks.slotclick) this.callbacks.slotclick.cb(this.resa);
	},
	hover: function() {
		let on = false;
		if(this.callbacks.slothover) on = this.callbacks.slothover.cb(this.resa);
		if(on) $(this.controls.time.elements.ui).addClass('slot-preview');
	},
	gone: function() {
		if(this.callbacks.slotgone) this.callbacks.slotgone.cb(this.resa);
		$(this.controls.time.elements.ui).removeClass('slot-preview');
	}
};

(C_iSLOT.flush = function() {
	C_iSLOT.eids = new Array(); 
	C_iSLOT.register.flush();
	rmems.flush('slots');
	C_iSLOT.toBeActivated = new A_ct();
})();
C_iSLOT.display = function(options) { // displays the bunch of C_iSLOT instances that are created so far
		options = options || {};
	let prevMidnight = false;
	let prev_bCalId = false;
	const trs = new Array();
	const eid = 'slots_trs_';
	const maketr = function(tds, refSLOT) {
		trs.push('<tr class="click-to-date" style="vertical-align:top;">'+tds+'</tr>');
	}
	const makeslotstd = function(slots, refSLOT) {
				// let tiptext = C_XL.w('click to display date', { nested:{hdate:refSLOT.resa.humandate} } );
			const tip = false; // { text:tiptext};
			const x = trs.length;
			const click = new A_cb(refSLOT.controls.date,refSLOT.controls.date.click);
		const t = new C_iCLIK(eid+x,{click:click},{ tip:tip, css:'date-trigger idle', ui:slots, tag:'td', style:'white-space:normal;'});
		C_iSLOT.toBeActivated.add1(t,x); // this is the interactivity of the full wide td, allowing to jump the planning to the corresponding line date.
		return t.display();
	}
	
	// scanning dates
	const register = C_iSLOT.register.midnight.get(); 
		// register = { order:[key1, key2, ...], keys:[key1=>[fCals][bCal][uCals][time], key2=>[fCals][bCal][uCals][time],... ] }
		// register[midnight][fCals][bCal][uCals][time] = o_iSLOT
		//
	if(vbs) vlog('planning.js','C_iSLOT',tab+'display','options',options); 
	for(let mx in register.order) { 
			const midnight = register.order[mx];
			const fCalsStrings = register.keys[midnight];  // fCalsStrings = { order:[], keys:[] }
		// scanning uCals for a given bCal
		for(let fx in fCalsStrings.order) { 
				const fCalsString = fCalsStrings.order[fx];
				const bCals = fCalsStrings.keys[fCalsString]; // bCals = { order:[], keys:[] }
			// scanning bCals inside a given fCal option
			for(let bx in bCals.order) {
					const bCalId = bCals.order[bx];
					const uCalsStrings = bCals.keys[bCalId]; // uCalsStrings = { order:[], keys:[] }
				// scanning uCals for a given bCal
				for(let ux in uCalsStrings.order) {
					
						const uCalsString = uCalsStrings.order[ux];
						const cueIns = uCalsStrings.keys[uCalsString]; // cueIns = { order:[], keys:[] }
						
					let slotpadleft = ''; // when visitors are displayed, breaks to new line for each of them
					let slotpadright = ''; // when visitors are displayed, breaks to new line for each of them
					if(options.visitors) { // forsee some kind of table blank line
							let d = '<td></td>';
							let b = (mobminder.account.single) ? '': '<td></td>';
							let u = (uCalsString=='-') ? '' : '<td></td>';
							let f = (fCalsString=='-') ? '' : '<td></td>';
						slotpadleft = d+b+u;
						slotpadright = f;
					}
					
							const refSLOT = cueIns.keys[cueIns.order[0]];
						const dateShow = (prevMidnight!=midnight) ? refSLOT.displayDate() : '';
						const bCalShow = (prev_bCalId!=bCalId) ? refSLOT.resources(class_bCal) : '';
					
					const dateTd = '<td style="width:1%; white-space:nowrap; text-align:right;">'+dateShow+'</td>';
						const style = 'width:1%; line-height:'+refSLOT.state.lineheight+'; white-space:nowrap;';
					const bCalTd = (mobminder.account.single) ? '': '<td style="'+style+'">'+bCalShow+'</td>';
					const uCalsTd = (uCalsString=='-') ? '' : '<td style="'+style+' text-align:right;">'+uCalsString+'</td>';
					const fCalsTd = (fCalsString=='-') ? '' : '<td style="'+style+'">'+fCalsString+'</td>';
					
					// scanning free slots for a given fCal / bCal / uCal combination
					//
					const slots = new Array();
					for(let cx in cueIns.order) {
						const cueIn = cueIns.order[cx];
						const o_iSLOT = cueIns.keys[cueIn];
						if(options.visitors) { // one tr for each urgency appointment
							const slotTd1 = '<td style="white-space:normal; width:1%; padding-right:2em;">'+o_iSLOT.displayTime(options)+'</td>';
							const slotTd2 = '<td style="white-space:normal;">'+o_iSLOT.visitors(options)+'</td>';
							if(cx|0) maketr(slotpadleft+slotTd1+slotTd2+slotpadright,refSLOT); // when more than one resa comes on the same resource combination on the given date
								else maketr(dateTd+bCalTd+uCalsTd+slotTd1+slotTd2+fCalsTd,refSLOT); // for the first resa in this combination and date
						} else // one tr contains many free slots
							slots.push(o_iSLOT.displayTime(options));
					}
					
					if(!options.visitors) { // all slots inside a combination and date are displayed in a single td
						const slotsjoined = slots.length ? slots.join(' ') : '';
						const slotsTd = makeslotstd(slotsjoined,refSLOT);
						maketr(dateTd+bCalTd+uCalsTd+slotsTd+fCalsTd,refSLOT);
					}
					prevMidnight = midnight;
					prev_bCalId = bCalId;
				}
			}
		}
		prev_bCalId = false;
	}
	const  trl = trs.length;
	let trtags = '';
	if(trl){
		trtags = trs.join('');
	} else {
		trtags = '<tr style="vertical-align:top;"><td style="font-size:120%; font-weight:bold; line-height:3em; color:rgba(var(--mob-txt-blue),.8); padding:0 3em 1em 6em; width:80%;">'+C_XL.w('no search result')+'<td></tr>';
	}
	
	return '<table id="slot-result" summary="results" class="slot-result" style="white-space:nowrap;">'+trtags+'</table>';
}
C_iSLOT.activate = function() { 
	C_iSLOT.toBeActivated.activate(); 
}



function R_search(eid, callbacks, preset) { // used by C_iPLAN, displays the search assistant
	// eid is an eid of the eid element for this remote instance
	if(vbs) vlog('planning.js','R_search','constructor',''); 
	mobminder.app.search = this;
	this.eids = { eid:eid, outset:eid+'_outset', inset:eid+'_inset', slotsarea:eid+'_sout', stbylarea:eid+'_lout', tboxingtd:eid+'_tboxingtd',
					controls:{ visitors:eid+'_visi', workcodes:eid+'_work', duration:eid+'_dur', before:eid+'_before', ampm:eid+'_ampm', staff:eid+'_staff', tboxing:eid+'_tboxing', soptions:eid+'_sopts' },
					buttons:{ help:eid+'_hlp', searchs:eid+'_ss', searchf:eid+'_sf', searchb:eid+'_sb', searchr:eid+'_sr'
							, stbylist:eid+'_stbl', stbylistf:eid+'_stblf', stbylistb:eid+'_stblb', stbylistr:eid+'_stblr'
							, plus:eid+'_plus', wplus:eid+'_wpls', weject:eid+'_wjct', veject:eid+'_ejct', seject:eid+'_sjct', leject:eid+'_ljct', fullreset:eid+'_frest' },
					slots:eid+'_sl', searchcaption:eid+'_scp', stblistcaption:eid+'_sbl',
					own: { wrap3:eid+'_w3', wrap3wl:eid+'_w3wl' }
				}
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { stickers, resasaved }
	this.state = R_search.defaults.align(preset); // preset like { not used yet }

	
	// const workcodes = false;
		const weject = new C_iCLIK(this.eids.buttons.weject, { click:new A_cb(this, this.onweject) }
		, { enabled:true, tip:{text:C_XL.w('tip clear search')}, css:'modal-button fa-gray fa fa-eject fa-rotate-90 touch-red', style:'', ui:'', tag:'div'
		, keys:[] } );
		const wplus = new C_iCLIK(this.eids.buttons.wplus, { }
		, { enabled:false, tip:{text:C_XL.w('tip clear search')}, css:'modal-button', style:'display:inline-block; color:transparent; min-width:0px; max-width:0px; width:0px;', ui:'&nbsp;', tag:'div' } );

	const wkcallbacks = { added:new A_cb(this, this.workcodeAdded), changed:new A_cb(this, this.workcodeSelect), cleared:new A_cb(this, this.workcodesCleared) };
	// if(mobminder.account.has.workcodes>50) // counts how many NOT eresa workcodes the account holds
	const workcodes = new C_iACPICK(this.eids.controls.workcodes, C_dS_workcode, wkcallbacks, { placeholder:C_XL.w('workcodes'), eWorkcodes:false, buttons:{plus:wplus, eject:weject} } );


			const helptip = C_XL.w('tip search help')+'<hr>'+C_XL.w('tip search help p2');
		const help = new C_iCLIK(this.eids.buttons.help, { click:new A_cb(this, this.onhelp), hover:new A_cb(this, this.enterhelp), gone:new A_cb(this, this.leavehelp) }
			, {   tip:{text:helptip}, css:'modal-button fa-13x fa fa-question mob-txt-blue-soft helpie', style:'font-weight:bold; text-align:center;'
			, ui:'', tag:'div', hoverdelay:1000 } ); // 

		const fullreset = new C_iCLIK(this.eids.buttons.fullreset, { click:new A_cb(this, this.onfullreset) }
			, { enabled:true, tip:{text:C_XL.w('tip full reset')}, css:'modal-button fa-gray fa fa-power-off touch-red', style:'', ui:'', tag:'div'
			, keys:[C_KEY.code.s.esc /* escape key */] } );


		const plus = new C_iCLIK(this.eids.buttons.plus, { click:new A_cb(this, this.newvisitor) }
			, { enabled:true, tip:{text:C_XL.w('tip plus visitor')}, css:'modal-button fa-gray fa fa-user-plus touch-visitblue', style:'margin-left:.6em;', ui:'', tag:'div'
			, keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.n /* Ctrl + n */, C_KEY.code.kpad.s.add /* Numpad plus key */ ] } );
		const veject = new C_iCLIK(this.eids.buttons.veject, { click:new A_cb(this, this.onveject) }
			, { enabled:true, tip:{text:C_XL.w('tip clear search')}, css:'modal-button fa-gray fa fa-eject fa-rotate-90 touch-red', style:'', ui:'', tag:'div'
			, keys:[C_KEY.code.s.backspace+C_KEY.code.s.shift /* backspace */ /* C_KEY.code.kpad.s.subtract Numpad minus key (removed so you can search a birthday from the num keypad) */ ] } );
		const seject = new C_iCLIK(this.eids.buttons.seject, { click:new A_cb(this, this.onsloteject) }
			, { enabled:true, tip:{text:C_XL.w('close')}
				, css:'fa-gray fa-11x fa fa-eject fa-flip-vertical'
				, style:'padding:.5em; position:sticky; bottom:0; right:0;', ui:'', tag:'div'
			, keys:[] } );
		const leject = new C_iCLIK(this.eids.buttons.leject, { click:new A_cb(this, this.onlisteject) }
			, { enabled:true, tip:{text:C_XL.w('close')}
				, css:'fa-gray fa-11x fa fa-eject'
				, style:'padding:.5em; position:sticky; top:0; right:0;', ui:'', tag:'div'
			, keys:[] } );
		
		const visibacks = { changed:new A_cb(this, this.visitorSelect), added:new A_cb(this, this.visitorAdded), cleared:new A_cb(this, this.visitorACclear)};
		const visipreset = { focus:true, buttons:{plus:plus, eject:veject}, onlabelclick:new A_cb(this, this.visiLabelClick), placeholder:C_XL.w('visitor'), ismulti:true, tipwithbp:true };
	const visitors = new C_iACPICK(this.eids.controls.visitors, C_dS_visitor, visibacks, visipreset);

	const duration = new C_iDUR(this.eids.controls.duration, { ondur:new A_cb(this,this.duration) } );
	const before = new C_iBEFORE(this.eids.controls.before, { onbefore:new A_cb(this,this.before) }, { selection:mobminder.account.notbefore } );
	const ampm = new C_iAMPM(this.eids.controls.ampm, {onampm:new A_cb(this,this.ampm)}, {abreviation:(is.tactile?'abr':'full')} );
	
		const precheck = [];
			precheck[class_bCal] = C_dS_resource.getByType(class_bCal);
			precheck[class_uCal] = C_dS_resource.getByType(class_uCal);
	const staff = new C_iSTAFF(this.eids.controls.staff, 'staffing', new A_cb(this,this.staff), precheck);
		const options = C_dS_timeboxing.cresta(); // see also showhidetboxing() that hides it from the dashboard
	const tboxing = new C_iCRESTA(this.eids.controls.tboxing, { onchange:new A_cb(this,this.tboxing) }, options, { mode:0, title:C_XL.w('timeboxing') } );
		
	
	// options for searching slots attributes
		const so = {exceptnls:'smodexcp',overdays:'smodeovd',aggregate:'smodeagg'}, order = [], labels = [], presets = {};
			labels[so.exceptnls] 	= C_XL.w('excp');		presets[so.exceptnls] = { checked:false, tip:{text:C_XL.w('tip exceptional')}, hidden:!mobminder.account.has.excpshadows };
			labels[so.overdays] 	= C_XL.w('overdays');	presets[so.overdays]  = { checked:false, tip:{text:C_XL.w('tip overdays')}, hidden:!mobminder.account.overdays  };
			labels[so.aggregate] 	= C_XL.w('aggregate'); 	presets[so.aggregate] = { checked:false, tip:{text:C_XL.w('tip aggregate')}, hidden:false  };
		
		for(let x in labels) order.push(x);
			const soptions = { order:order, labels:labels, presets:presets, count:order.length };
	const smode = new C_iCRESTA(this.eids.controls.soptions, {onchange:new A_cb(this,this.onsoptions)}, soptions, { mode:0, title:false });

		const f = '<div class="fa-gray fa-13x fas fa-step-forward"></div>'; 
		const b = '<div class="fa-gray fa-13x fas fa-step-backward"></div>'; 
		const r = '<div class="fa-gray fa-13x fas fa-undo""></div>'; 
		
		
	// buttons for search options
	
		const stylefull = 'display:inline-block;';
		const stylethird = 'display:inline-block;';
		const mousemoves = new A_cb(this, this.mousemoves);
	
			const iconrow = '<tr><td style="vertical-align:bottom;"><div class="fa-gray fa-13x fas fa-random"></div></td></tr>';
			const captrow = '<tr><td style="vertical-align:top;" class="" id="'+this.eids.searchcaption+'">'+C_XL.w('slotsearch')+'</td></tr>';
		const scaption = '<table style="height:100%; width:100%;">'+iconrow+captrow+'</table>';
	const searchstart = new C_iCLIK(this.eids.buttons.searchs, { click:new A_cb(this, this.onsearch, {what:'slots', navigate:'start'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-search opaline-lime', style:stylefull
			, ui:scaption, tag:'div', hidden:false, keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.f /* Ctrl + f (find)*/] } ); // 
			
	const searchforward = new C_iCLIK(this.eids.buttons.searchf, { click:new A_cb(this, this.onsearch, {what:'slots', navigate:'forward'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-search button-right third opaline-lime', style:stylethird
			, ui:f, tag:'div', keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.f /* Ctrl + f (find)*/] } );
	const searchbackward = new C_iCLIK(this.eids.buttons.searchb, { click:new A_cb(this, this.onsearch, {what:'slots', navigate:'backward'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-search button-center third opaline-lime', style:stylethird
			, ui:b, tag:'div', keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.g /* Ctrl + g (find)*/] } );
	const searchreset = new C_iCLIK(this.eids.buttons.searchr, { click:new A_cb(this, this.onsearch, {what:'slots', navigate:'reset'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-search button-left third opaline-lime', style:stylethird
			, ui:r, tag:'div' } );


	// buttons for waiting list
			const liconrow = '<tr><td style="vertical-align:bottom;"><div class="fa-gray fa-13x fas fa-user-clock"></div></td></tr>';
			const lcaptrow = '<tr><td style="vertical-align:top;" class="" id="'+this.eids.stblistcaption+'">'+C_XL.w('standby list')+'</td></tr>';
		const lcaption = '<table style="height:100%; width:100%;">'+liconrow+lcaptrow+'</table>';
	const stbylist = new C_iCLIK(this.eids.buttons.stbylist, { click:new A_cb(this, this.querystandbylist, {what:'stblist', navigate:'start'}), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip waiting list')}, css:'button button-wlist opaline-orange', style:stylefull
			, ui:lcaption, tag:'div', hidden:false, keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.w /* Ctrl + w (waiting list)*/] } );
			
			
	const sblistforward = new C_iCLIK(this.eids.buttons.stbylistf, { click:new A_cb(this, this.onsearch, {what:'stblist', navigate:'forward'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-wlist button-right third opaline-orange', style:stylethird
			, ui:f, tag:'div', keys:[] } );
	const sblistbackward = new C_iCLIK(this.eids.buttons.stbylistb, { click:new A_cb(this, this.onsearch, {what:'stblist', navigate:'backward'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-wlist button-center third opaline-orange', style:stylethird
			, ui:b, tag:'div', keys:[] } );
	const sblistreset = new C_iCLIK(this.eids.buttons.stbylistr, { click:new A_cb(this, this.onsearch, {what:'stblist', navigate:'reset'} ), mousemoves:mousemoves }
		, {   tip:{text:C_XL.w('tip search')}, css:'button button-wlist button-left third opaline-orange', style:stylethird
			, ui:r, tag:'div', keys:[] } );
			

	this.continued = { standby:[], slots:[] };
	const snexton = new C_iPASS('0'); // tracking search pages, and posting nexton value
	const lnexton = new C_iPASS('0'); // tracking standby list pages, and posting nexton value
	
	const limit = new C_iPASS('0');

		const o = new C_iPASS({ exceptional:0, overdays:0, aggregate:0 });
	this.controls = new A_ct({visitors:visitors, workcodes:workcodes, duration:duration, before:before, ampm:ampm, staff:staff, tboxing:tboxing, options:o, snexton:snexton, lnexton:lnexton, limit:limit, smode:smode, help:help });
	this.buttons = new A_ct({searchstart:searchstart, searchforward:searchforward, searchbackward:searchbackward, searchreset:searchreset
							, stbylist:stbylist, sblistforward:sblistforward, sblistbackward:sblistbackward, sblistreset:sblistreset
							, plus:plus, weject:weject, veject:veject, seject:seject, leject:leject, fullreset:fullreset });
	
	this.state = { duplicate:false, searchmode:false };
	this.stickers = false; // when hovering a freshslot, stickers are positionned on the planning as preview (if date fits). Those stickers are linked here so they can be removed when hovering ends
}
R_search.defaults = new A_df({ sblistopened:false, slotsopened:false }); // 16 is the binary base
R_search.prototype = {

	// public interface 
	display: function() { // called from C_iPLAN
	
		if(1) vlog('planning.js','R_search','display',''); 
		
		// remote control dashboard
		const visitors = this.controls.visitors.display();
		
		const workcodes = mobminder.account.has.workcodes ? this.controls.workcodes.display({ddwn:'white-input'}) : '';
		
		const duration = this.controls.duration.display();
		const before = this.controls.before.display();
		const ampm = this.controls.ampm.display('right-padded');
		const staff = this.controls.staff.display();
		const tboxing = mobminder.account.has.timeboxing ? this.controls.tboxing.display() : '';
		
		// buttons
		const highlite = { red:'', green:'', cyan:'', orange:'', purple:'' }; 
		if(0) // use this debug feature when maintaining this area
			highlite = { red:'border:1px solid red;', green:'border:1px solid green;', cyan:'border:1px solid cyan;', orange:'border:1px solid orange;', purple:'border:1px solid purple;' }; 

		const smode = '<div style="display:inline-block; '+highlite.cyan+'">'+this.controls.smode.display('smode')+'</div>';
	
			const search = this.buttons.searchstart.display();
				const searchf = this.buttons.searchforward.display();
				const searchb = this.buttons.searchbackward.display();
				const searchr = this.buttons.searchreset.display();
			const sthird = '<div id="'+this.eids.own.wrap3+'" style="display:none;'+highlite.cyan+'">'+searchr+searchb+searchf+'</div>';
		const navigate = '<div style="'+highlite.purple+'">'+search+sthird+'</div>';
			
		let stbylist  = '';
		if(mobminder.account.usestandbylist) {
			const sblist = this.buttons.stbylist.display();
				const sblistf = this.buttons.sblistforward.display();
				const sblistb = this.buttons.sblistbackward.display();
				const sblistr = this.buttons.sblistreset.display();
			const sthirdwl = '<div id="'+this.eids.own.wrap3wl+'" style="display:none;'+highlite.cyan+'">'+sblistr+sblistb+sblistf+'</div>';
			stbylist = '<div style="'+highlite.green+'">'+sthirdwl+sblist+'</div>';
		} 
		const bsearch = '<div style="display:flex; flex-wrap:nowrap;'+highlite.red+'">'+smode+navigate+'</div>';
		const buttons = stbylist+bsearch;
		
		
		const help = ''; // this.controls.help.display(); // PVH 2026: removed :)
		const full = this.buttons.fullreset.display();
		
		let headerpane = '';
		let bodypane = '';
		let bottompane = '';
		let searchpane = '';

		if(mobminder.account.single) { // right area vertical search assistant
		
					const v = '<tr style="vertical-align:top; height:4.4em;"">'+'<td>'+visitors+'</td>'+'<td style="width:3em; text-align:right;">'+help+'</td>'+'</tr>';
					const w = mobminder.account.has.workcodes ? '<tr style="vertical-align:top; height:4.4em;"">'+'<td colspan="2">'+workcodes+'</td>'+'</tr>':'';
				const headerlayout = v+w;
			headerpane = '<div class="remote-headerpane"><table style="">'+headerlayout+'</table></div>';
			
					const bpstyle = 'display:flex; flex-direction:row; flex-wrap: wrap; align-content:top; justify-content:space-around; margin:0 auto 0 0;';
				const controls = '<div style="'+bpstyle+'">'+duration+before+ampm+'</div>';
			bodypane = '<div class="remote-bodypane" style="'+highlite.green+'">'+controls+'</div>'; // overflow-x:auto does work only if the container td has max-width:0em;, see this (*nt*)
				
				
			bottompane = '<div id="'+this.eids.tboxingtd+'" class="remote-bottompane timeboxing" style="padding-bottom:1em;">'+tboxing+'</div>';
			searchpane = '<div class="remote-searchpane" style="'+highlite.orange+'">'+buttons+'</div>'; // css in planning.css div.remote-searchpane
			
			// div.remote-searchpane contains only the two buttons: 'show waiting list' on the left, and 'engage search' on the right. Both are <div.click.button>
			// In some cases, the lefter button is not present (waiting list) because the user does no make use of it.
			// Instead of spreading the two buttons, we want the lefter button to stick left, and the righter button to stick right. All space in-between stays blank.
			// Can you please adapt spstyle so to realize this?
			
		
		} else { // wide horizontal underlaying search assistant // highlite = { red:'', green:'', cyan:'', orange:'', purple:'' }; 

		
				// height:; is just enough to select 2 visitors or two workcodes without pushing down the following controls
						const fullr = '<div style="width:3em; text-align:left;'+highlite.green+'">'+full+'</div>';
						const helpy = '<div style="width:3em; text-align:right;'+highlite.green+'">'+help+'</div>';
						const visis = '<div style="min-width:50%;'+highlite.green+'">'+visitors+'</div>';
						const wrkcd = '<div style="'+highlite.green+'">'+workcodes+'</div>'; // 40px is the size of .modal-button
					const divs = fullr+visis+wrkcd+helpy;
			headerpane = '<div class="remote-headerpane" style="'+highlite.red+'">'+divs+'</div>';
			
				// const tr = '<tr style="vertical-align:top; height:4.4em;">'+tds+'</tr>';
			// headerpane = '<div class="remote-headerpane" style="'+highlite.red+'"><table style="margin:0 auto; min-width:max(80em,calc(60%));">'+tr+'</table></div>';
			
					const tboxingdiv = '<div id="'+this.eids.tboxingtd+'" class="timeboxing" style="display:inline-block;">'+tboxing+'</div>';
					const bpstyle = 'display:flex; flex-direction:row; flex-wrap: wrap; align-content:top; justify-content:space-around; margin:0 auto 0 0;';
				const controls = '<div style="'+bpstyle+'">'+duration+before+ampm+staff+tboxingdiv+'</div>';
			bodypane = '<div class="remote-bodypane" style="'+highlite.green+'">'+controls+'</div>'; // overflow-x:auto does work only if the container td has max-width:0em;, see this (*nt*)
				
			bottompane = ''; // used only by single configs
				
					const s2style = 'display:flex; gap: 1rem; justify-content:space-around;';
					const gbutton = '<div class="glassy-button"><span>Push me if you dare</span></div>'; // must contain a span
				const aftersearch = '<div class="remote-searchpane" style="'+s2style+'">'+gbutton+'</div>';
				
					// const spstyle = 'display:flex; flex-direction:row; flex-wrap: nowrap; align-content:top; justify-content:space-around;';
			// searchpane = aftersearch+'<div class="remote-searchpane" style="'+spstyle+' '+highlite.cyan+'">'+buttons+'</div>'; // +aftersearch
			searchpane = '<div class="remote-searchpane" style="'+highlite.cyan+'">'+buttons+'</div>';
		
		}
		
		// search assistant overall shape
		const inset = '<div id="'+this.eids.inset+'" class="remote-shape remote-inset">'+headerpane+bodypane+bottompane+searchpane+'</div>';
		const outset = '<div id="'+this.eids.outset+'" class="remote-shape remote-outset">'+inset+'</div>';
		
		// areas for slots display and standby list display //  position:relative; overflow-y:auto; overflow-x:clip;
		const slotsarea = '<div id="'+this.eids.slotsarea+'" class="remote-above closed" style=""></div>'; // scroll frame
		const stbylarea = '<div id="'+this.eids.stbylarea+'" class="remote-under closed" style=""></div>'; // scroll frame
		
		return slotsarea+outset+stbylarea;
	},
	activate: function() {
		this.elements.collect(this.eids);
		if(1) vlog('planning.js','R_search','activate','eid:'+this.eids.eid); 
		this.controls.reset().activate('R_search controls');
		this.buttons.reset().activate('R_search buttons');
		this.showhidetboxing();
		this.wejectshow(false); this.vejectshow(false); this.fullresetshow(false);
		this.setclearccs();
		
		const glassyButtons = document.querySelectorAll(".glassy-button");
		glassyButtons.forEach((button) => {
			button.addEventListener("mousemove", (event) => {
				const centerX = button.offsetWidth / 2;
				const centerY = button.offsetHeight / 2;

				const offsetX = event.offsetX - centerX;
				const offsetY = event.offsetY - centerY;

				button.style.setProperty("--_x-motion", `${offsetX}px`);
				button.style.setProperty("--_y-motion", `${offsetY}px`);
			});
		});

	},
	hide: function() { $(this.elements.outset).hide(); $(this.elements.slotsarea).hide(); $(this.elements.stbylarea).hide(); },
	show: function() { $(this.elements.outset).show(); $(this.elements.slotsarea).show(); $(this.elements.stbylarea).show(); },
	duplicate: function(resa, replan) { // a duplication was initiated from a M_RESA, let's setup the search parameters such that the user only needs to trigger a new search
		if(vbs) vlog('planning.js','R_search','duplicate','replan:'+(replan?resa.id:0)); 
		
		// watch the sequence here: this.state.duplicate switches the subsequent execution behaviour
		this.state.duplicate = { replan:(replan?resa.id:0), note:resa.note, ccsscolor:resa.cssColor, ccsspattern:resa.cssPattern, ccsstags:resa.cssTags };
		this.controls.visitors.clear();
		let v = 0;
		for(let id in resa.visitors) { v=id; this.controls.visitors.more([id]); }
		if(v) {
			this.controls.ampm.and(resa.visitors[v].prefAMPM);
			this.vejectshow(true);
		}
		
		let anyperf = false;
		for(let id in resa.performances) { anyperf = true; this.controls.workcodes.more([id]); }
		if(anyperf) this.wejectshow(true);
		
		if(!anyperf) { // then we preset the resources that are in the original appointment
			let r = new Array(); for(let rescclass in resa.resources) for(let id in resa.resources[rescclass]) r.push(id);
			let s = 0; for(let id in resa.resources[class_uCal]) s++;
			this.controls.staff.resetstaff(r).setsize(s||1);
		}
		const duration = (resa.cueOut-resa.cueIn)/mobminder.account.secondsPerSlice; // console.log('duration:'+duration);
		this.controls.duration.set(duration || mobminder.account.durationShortest);
		
		// let down = false; if(!mobminder.account.single) this.scrolldesk(down); // PVH 2025 commented when graphical copy/paste was added to the horizontal view.
		return this;
	},
	visitrigger: function(digits) {
		
		let d = {digits:digits};
		let post = new C_iPASS(d);
		mobminder.app.post({post:post}, {post:post.autonames()}, './queries/visitors.php', new A_cb(this, this.vtrigger, digits));
		
	},
	
	// private functions
	sumUpPreferences: function(o) {
			o = o || { avoid:{} };
		if(vbs) vlog('planning.js','R_search','sumUpPreferences',''); 
		// start with resetting any dependant controls
			this.controls.staff.resetstaff().setsize(1);
			if(o.avoid.workcodes) this.controls.workcodes.checkall(false); // then we uncheck them all but we keep the existing list in place
				else this.controls.workcodes.clear(); // we clean up all current selections
			this.controls.before.resetbefore();
			this.controls.ampm.resetampm();
			this.closeslots();
			
		let vitems = this.controls.visitors.value();
		for(let vid in vitems) {
			let o_dS_visitor = vitems[vid];
			let o_dS_workexperts = C_dS_visitorPreferences.register[vid];
			if(!o_dS_workexperts) continue; // not yet arrived, should come through ajax callback this.preferences()
			this.controls.ampm.and(o_dS_visitor.prefAMPM);
			this.controls.workcodes.more(o_dS_workexperts.workcodes, true /*unset*/);
			this.controls.staff.highlight(o_dS_workexperts.resources); // higlights on screen the resources having ever appointed with the visitor (a red clock appears lefter of the resource name)
		}
	},
	closeslots: function(o) { // any change on search parameters will cancel and close previous displayed slots
		o = o || {keepnextdate:false};
		if(vbs) vlog('planning.js','R_search','closeslots',''); 
		if(!this.elements.slotsarea) return; // not activated yet
		this.elements.slotsarea.innerHTML = '';
		$(this.elements.slotsarea).removeClass('opened').addClass('closed');
		if(o.keepnextdate==false) { // which is the default, see (*sa01*)
			this.controls.snexton.set('0');
			this.continued.slots = [];
		}
		mobminder.app.resourcescope.enabled = false; // see (*mb02*) in P_horiz
	},
	showhidetboxing: function(which) { // timeboxing appears only when resources are selected that have timeboxing in their hourlies
		// if(mobminder.account.single) return;
		if(!mobminder.account.has.timeboxing) return;
		if(!which) which = this.controls.staff.value();
		let tboxings = new Array(); // check what timeboxing is used by the selected resources
		let classes = [class_bCal, class_uCal, class_fCal];
		let werechecked = arrayINVERT(this.controls.tboxing.getvalue());
		for(let x in classes) {
			let rscIds = which[classes[x]];
			let ids = C_dS_resource.whichboxing(rscIds);
			tboxings = tboxings.concat(ids);
		}
			let newoptions = C_dS_timeboxing.cresta(werechecked, tboxings);
		this.controls.tboxing.clear(newoptions);
			
		if(tboxings.length) $(this.elements.tboxingtd).show(); // if no timeboxing at all remains, hide the complete control
			else $(this.elements.tboxingtd).hide();
	},
	
	// event handling
	staff: function(which) { // which is like which[class_bufCal][x] = id
			let bcals = which[class_bCal].join(',');
			let ucals = which[class_uCal].join(',');
			let fcals = which[class_fCal].join(',');
		if(vbs) vlog('planning.js','R_search','staff','bcals:'+bcals+' ucals:'+ucals+' fcals:'+fcals); 
		this.showhidetboxing(which); 
		this.closeslots(); 
		mobminder.app.resourcescope.staffscope = which; // see (*mb02*) in P_horiz
	},
	ampm: function() { this.closeslots(); },
	before: function() { this.closeslots(); },
	onsoptions: function(o) { this.closeslots(); },
	duration: function() { this.closeslots(); },
	tboxing: function() { this.closeslots(); },
	workcodeAdded: function(id) { // id of the workcode that has been selected by browsing available account workcodes
		if(vbs) vlog('planning.js','R_search','workcodeAdded','id:'+id); 
	},
	workcodeSelect: function(items, hitid) { // a workcode has been checked or unchecked
			
			let turnon = hitid in items; // the hit item is an activation (it is checked)
		if(turnon) 
			if(mobminder.context.surfer.secretarypopups)
			if(!this.state.duplicate) { // do not pop-up during copypaste / cutpaste actions
				let dS_wkc = items[hitid];
				dS_wkc.scretarymsg(); // see C_dS_workcode.prototype
			}
		
		// this.closeslots(); 
		let rscids = new Array(), tboxids = new Array();
		let duration = 0; let staffsize = 1;
		let ids = [];
		for(let id in items) { // many workcodes can be selected on the workcode selection control
			let dS_wkc = items[id]; ids.push(id);
			duration += dS_wkc.duration;
			staffsize = Math.max(dS_wkc.staffing, staffsize);
			rscids.push(dS_wkc.expertsIds());
			tboxids.push(arrayKEYS(dS_wkc.tboxingIds()));
		}
		if(vbs) vlog('planning.js','R_search','workcodeSelect','newsetting:'+ids.join(',')); 
		
		this.controls.duration.set(duration || mobminder.account.durationShortest);
		let commonResources = arrayAND(rscids); // only the common resources to all workcodes, if not compatible, all are selected
		this.controls.staff.resetstaff(commonResources).setsize(staffsize);
		
		let commonTimeboxings = arrayAND(tboxids); // only the common resources to all workcodes, if not compatible, all are selected
		this.controls.tboxing.docheck(commonTimeboxings, true, {reset:true});
		this.wejectshow(true); this.fullresetshow(true);
	},
	workcodesCleared: function() { // a workcode has been checked or unchecked
		if(vbs) vlog('planning.js','R_search','workcodesCleared',''); 
		this.closeslots();
		this.wejectshow(false);
	},
	
	visitorAdded: function(id) {
		if(vbs) vlog('planning.js','R_search','visitorAdded','duplicate:'+!!this.state.duplicate); 
		if(this.state.duplicate) return; // do not overwrite performances setting when in duplicate or replan mode
		id = new C_iPASS(id);
		mobminder.app.post({id:id}, {id:'id'}, './queries/remote.php', new A_cb(this,this.preferences), new A_cb(this,this.connfailed));
	},	
	visitorSelect: function(items) {
		if(vbs) vlog('planning.js','R_search','visitorSelect',''); 
		// this function fires immediately when a visitor is added through the ac, though the preferences arrive later through ajax
		if(is.tactile) this.controls.visitors.blur();
		this.vejectshow(true); this.fullresetshow(true);
		this.sumUpPreferences({avoid:{workcodes:1}});
	},
	visitorACclear: function() {
		if(vbs) vlog('planning.js','R_search','visitorACclear',''); 
		this.fullreset({scrolltop:false});
	},
	visiLabelClick: function(visitorId, ctrlshift, event) {
		const dS_visitor = C_dS_visitor.get(visitorId);
				let opentab = ctrlshift.shiftkey ? 1 : 0; // shift+click opens the modal on the note tab
			if(ctrlshift.ctrlkey) opentab =  2; // ctrl+click opens the modal on the history tab
		if(this.state.embedded) { if(this.callbacks.visiclick) this.callbacks.visiclick.cb(dS_visitor); }
		
		const easyVISI = new M_VISI(dS_visitor, { saved:new A_cb(this, this.visitorsaved)}, { tab:opentab } );
		return false;
	},
	
	newvisitor: function() { 
		let digits = this.controls.visitors.digits();
		if(vbs) vlog('planning.js','R_search','newvisitor','digits:'+digits); 
		let o_easyVISI = new M_VISI(false, { saved:new A_cb(this, this.newvisitorsaved)}, { digits:digits });
	},
	fullreset: function(o = {scrolltop:true}) { // full dashboard reset
		// console.log('fullreset');
		if(vbs) vlog('planning.js','R_search','fullreset','duplicate mode cleared'); 
		this.sumUpPreferences(); // this will reset all depending controls (staff, size, workcodes, before, amapm)
		this.state.duplicate = false;
		this.wejectshow(false); this.vejectshow(false); this.fullresetshow(false);
		mobminder.app.copypaste(false); // cancel the copypaste mode
		this.searchmultibutton(false);
		
		let top = true; if(!mobminder.account.single) if(o.scrolltop) this.scrolldesk(true); // happens with delay
		if(mobminder.app.setdate) mobminder.app.setdate.cb(); // heads back to today
	},
	onweject: function() { // workcodes eject 
		if(vbs) vlog('planning.js','R_search','onweject',''); 
		this.controls.workcodes.clear();
		this.closeslots();
		this.wejectshow(false);
		return this;
	},
	onveject: function() { // visitor eject 
		if(vbs) vlog('planning.js','R_search','onveject',''); 
		// console.log('onveject');
		this.controls.visitors.clear();
		this.closeslots();
		this.vejectshow(false);
		return this;
	},
	onfullreset: function() { // full assistant reset  (lefter on/off button)
		if(vbs) vlog('planning.js','R_search','onfulleject',''); 
		this.onlisteject();
		this.controls.visitors.clear();
		this.state.slotsopened = false; this.state.sblistopened = false; this.setclearccs();
		return this.fullreset();
	},
	onsloteject: function() { 
		if(vbs) vlog('planning.js','R_search','onsloteject',''); 
		this.searchmultibutton(false); 
		this.closeslots();
		this.state.slotsopened = false; this.setclearccs();
	},
	onlisteject: function() {
		this.elements.stbylarea.innerHTML = '';
		$(this.elements.stbylarea).removeClass('opened').addClass('closed');
		this.controls.lnexton.set('0'); this.continued.standby = [];
		this.sblistmultibutton(false);
		this.state.sblistopened = false; this.setclearccs();
		if(vbs) vlog('planning.js','R_search','onlisteject',''); 
	},
	wejectshow: function(doshow) { // delayed hide for the eject button
		if(doshow) return this.buttons.weject.hide(false);
		let ejbutton = this.buttons.weject;
		setTimeout( function(){ return ejbutton.hide(true) }, 600);
	},
	vejectshow: function(doshow) { // delayed hide for the eject button
		if(doshow) return this.buttons.veject.hide(false);
		let ejbutton = this.buttons.veject;
		setTimeout( function(){ return ejbutton.hide(true) }, 800);
	},
	fullresetshow: function(doshow) { // delayed hide for the eject button
		if(doshow) return this.buttons.fullreset.hide(false);
		let ejbutton = this.buttons.fullreset;
		setTimeout( function(){ return ejbutton.hide(true) }, 1000);
	},
	newvisitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		this.controls.visitors.add(id);
	},
	visitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('planning.js','R_search','visitorsaved','id:'+id); 
		this.controls.visitors.refresh(id); 
	},
	newresasaved: function(dataSets) {
		let resa = false;
		for(let id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('planning.js','R_search','newresasaved','id:'+resa.id); 
		this.state.duplicate = false;
		setTimeout( (t) => { t.closeslots({keepnextdate:true}); }, 2000, this ); // keepnextdate see (*sa01*)
		if(this.callbacks.resasaved) this.callbacks.resasaved.cb(resa);
	},
	queryslots: function() {
		// this.elements.slotsarea.innerHTML = '';
		
		// preparing the search mode
			let smode = this.controls.smode.getstates();
		this.controls.options.items.exceptional = smode['smodexcp'];
		this.controls.options.items.overdays = smode['smodeovd'];
		this.controls.options.items.aggregate = smode['smodeagg'];

		// preparing post
		let names = {
			visitors:'visitors', workcodes:'workcodes', duration:'duration', before:'before', ampm:'ampm', tboxing:'tboxing'
			, snexton:'continued' , limit:'limit'
			, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals', size:'staffsize' } 
			, options:{exceptional:'exceptional', overdays:'overdays', aggregate:'aggregate' }
		};
		mobminder.app.post(this.controls, names, './queries/search.php', new A_cb(this,this.slotsfresh), new A_cb(this, this.connfailed));
		mobminder.app.copypaste(false); // cancel the copypaste process as the user has decided to go via search engine
		C_iSLOT.flush();
		mobminder.app.resourcescope.enabled = true; // see (*mb02*) in P_horiz
	}, 
	querystandbylist: function() {
		// this.elements.stbylarea.style.maxHeight = '0';
		let names = {
			workcodes:'workcodes', duration:'duration', before:'before', ampm:'ampm', tboxing:'tboxing', lnexton:'continued'
			, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals', size:'staffsize' }
		};
		mobminder.app.post(this.controls, names, './queries/standbylist.php', new A_cb(this,this.stbylistfresh), new A_cb(this, this.connfailed));
		C_iSLOT.flush();
	},
	mousemoves: function() {},	

	onhelp: function() { },
	enterhelp: function() { $(this.elements.outset).addClass('showout'); $(this.elements.slotsarea).addClass('showout'); $(this.elements.stbylarea).addClass('showout'); },
	leavehelp: function() { $(this.elements.outset).removeClass('showout'); $(this.elements.slotsarea).removeClass('showout'); $(this.elements.stbylarea).removeClass('showout'); },
	
	onsearch: function(mode, o_iCLIK) {  // mode like { what:['slots','stblist'], navigate:['start','forward','backward','reset'] }
		
		switch(mode.what) {
			case 'slots':
				switch(mode.navigate) { // indicates which button was hit
					case 'start': break;
					case 'forward': break;
					case 'backward': 
						this.continued.slots.pop(); this.continued.slots.pop(); 
							let l = this.continued.slots.length; 
						this.controls.snexton.set(this.continued.slots[l-1]||0); break;
					case 'reset': this.continued.slots = []; this.controls.snexton.set(0); break;
				}
				this.queryslots();
			break;
			case 'stblist':
				switch(mode.navigate) {
					case 'start': break;
					case 'forward': break;
					case 'backward': 
						this.continued.standby.pop(); this.continued.standby.pop(); 
							let l = this.continued.standby.length; 
						this.controls.lnexton.set(this.continued.standby[l-1]||0); break;
					case 'reset': this.continued.standby = []; this.controls.lnexton.set(0); break;
				}
				this.querystandbylist();
			break;
		}
		
		this.lockbuttons(o_iCLIK);
	}, 
	
	// private
	setclearccs: function() {
		$(this.elements.outset).removeClass('clear');
		if(!this.state.slotsopened&&!this.state.sblistopened) $(this.elements.outset).addClass('clear');
	},
	searchmultibutton: function(onOff) { // sets buttons group to appear	
		if(onOff===false) this.elements.searchcaption.innerHTML = C_XL.w('slotsearch');	
		this.buttons.searchstart.hide(onOff);
		if(!onOff) $(this.elements.own.wrap3).hide(); else $(this.elements.own.wrap3).show();
		// this.buttons.searchforward.hide(!onOff);
		// this.buttons.searchbackward.hide(!onOff);
		// this.buttons.searchreset.hide(!onOff);
		return this;
	},
	sblistmultibutton: function(onOff) { // sets buttons group to appear
		if(!this.elements.stblistcaption) return this; // this account doesn't use standby list 
		if(onOff===false) this.elements.stblistcaption.innerHTML = C_XL.w('standby list');	
		this.buttons.stbylist.hide(onOff);
		if(!onOff) $(this.elements.own.wrap3wl).hide(); else $(this.elements.own.wrap3wl).show();
		// this.buttons.sblistforward.hide(!onOff);
		// this.buttons.sblistbackward.hide(!onOff);
		// this.buttons.sblistreset.hide(!onOff);
		return this;
	},
	lockbuttons: function(busybutton) { // busybutton undefined will re-enable all buttons, busybutton instance of C_iCLIK will lock all buttons and set the button to busy mode
		if(busybutton) {
			for(let x in this.buttons.get) this.buttons.get[x].enable(false);
			busybutton.busy(true);
		} else {
			for(let x in this.buttons.get) this.buttons.get[x].busy(false);
			for(let x in this.buttons.get) this.buttons.get[x].enable(true);
		}
		return this;
	},
	scrolldesk: function(updown) {
		setTimeout(()=>{ // that should execute after re-drawing of the DOM
				const e = document.getElementById('l');
				const top = updown ? 0 : e.scrollHeight - e.clientHeight;
				smoothScrollTo(e,top);
			}
		, 500);
	},
	
	// ajax callbacks
	slotsfresh: function(inlineDataSets) { // this is where we display this stuff on the slotsarea pad
	
		this.lockbuttons(); if(this.continued.slots.length>=1) this.searchmultibutton(true);
			
		this.fullresetshow(true);
		let virtualid = -1, cueLast = 0;
		if(vbs) vlog('planning.js','R_search','slotsfresh','dusplicate:'+(this.state.duplicate!==false)); 
		
		let resa1cuein = 0;
		for(let id in inlineDataSets['C_dS_reservation']) { // scans all reservations
			let resa = inlineDataSets['C_dS_reservation'][id];
			
			// relink visitors, if any selected for the search
				let vitems = this.controls.visitors.value();
				let vany = false;
			for(let vid in vitems) { 
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
				let witems = this.controls.workcodes.value();
			for(let wid in witems) new C_dS_performance('slots', [ virtualid--, id, wid, vany||0 ]);
			
			resa.rmeta();
			new C_iSLOT(this.eids.slots, resa, { slotclick:new A_cb(this, this.slotclick), slothover:new A_cb(this, this.slothover), slotgone:new A_cb(this, this.slotgone) }, {tip:true} );
			
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
			if(!resa1cuein) resa1cuein = resa.cueIn; // picks out only the first one
		}
		let l = 0;
		if(cueLast) { this.continued.slots.push(cueLast); this.controls.snexton.set(cueLast); }
			else if(l = this.continued.slots.length) if(this.continued.slots[l-1]!='end of list') this.continued.slots.push('end of list');
			let tdeject = '<td style="vertical-align:bottom; text-align:right;">'+this.buttons.seject.display()+'</td>';
		this.elements.slotsarea.innerHTML = '<table><tr><td style="width:100%; padding:10px 0 0 1em;">'+C_iSLOT.display()+'</td>'+tdeject+'</tr></table>';
		this.elements.searchcaption.innerHTML = C_XL.w('more search');
		$(this.elements.slotsarea).addClass('opened').removeClass('closed');
		C_iSLOT.activate();
		this.buttons.seject.activate();
		this.state.slotsopened = true; this.setclearccs();
		if(resa1cuein) {
			let jsCueIn = new Date(resa1cuein*1000);
			mobminder.app.setdate.cb(jsCueIn);
		}
		
		// let top = true; if(!mobminder.account.single) this.scrolldesk(top); // PVH 2025: annoying on large mutli-lines, removed

	},
	slotclick: function(resa) { // fresh slot or waiting list candidate has been clicked
				let id = resa.id;
			if(id<=0) if(!permissions.may(pc.cr_resas)) return false;
			if(id>0) if(!permissions.may(pc.op_resas)) return false;
			
			let focus = (resa.visicount?'onnote':'onvisitors');
		new M_RESA(resa, { saved:new A_cb(this, this.newresasaved) }, { focus:focus } ); // the default bank is 'slots'
	},
	slothover: function(resa) { 
		if(this.callbacks.stickers) this.stickers = this.callbacks.stickers.cb({resa:resa, is:{idle:true}, css:'slot-preview'}) /* sticker higlighting when mouse is over */
		return !!this.stickers;
	},	
	slotgone: function(resa) { 
		if(this.stickers)
			for(let x in this.stickers)
				this.stickers[x].remove(); // removes the sticker
		this.stickers = false;
	},
	stbylistfresh: function(inlineDataSets) {
		if(vbs) vlog('planning.js','R_search','stbylistfresh',''); 
		this.lockbuttons(); if(this.continued.standby.length>=1) this.sblistmultibutton(true);
		this.fullresetshow(true);
		let cueLast = 0;
		for(let id in inlineDataSets['C_dS_reservation']) {
			let resa = inlineDataSets['C_dS_reservation'][id];
			new C_iSLOT(this.eids.slots, resa, { slotclick:new A_cb(this, this.slotclick), slothover:new A_cb(this, this.slothover), slotgone:new A_cb(this, this.slotgone) }, {tip:true});
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
		}
			let l;
		if(cueLast) { this.continued.standby.push(cueLast); this.controls.lnexton.set(cueLast); }
			else if(l = this.continued.standby.length) if(this.continued.standby[l-1]!='end of list') this.continued.standby.push('end of list');
			
			// let eject = this.buttons.leject.display();
		// this.elements.stbylarea.innerHTML = eject+'<div>'+C_iSLOT.display({duration:true, visitors:true})+'</div>';
		// this.elements.stblistcaption.innerHTML = C_XL.w('continued');
			let leject = '<td style="vertical-align:top; text-align:right;">'+this.buttons.leject.display()+'</td>';
		this.elements.stbylarea.innerHTML = '<table><tr><td style="width:100%;">'+C_iSLOT.display({duration:true, visitors:true})+'</td>'+leject+'</tr></table>';

		$(this.elements.stbylarea).addClass('opened').removeClass('closed');
		
		C_iSLOT.activate();
		this.buttons.leject.activate();
		
		let down = false; if(!mobminder.account.single) this.scrolldesk(down);
		
		this.state.sblistopened = true; this.setclearccs();
	},
	connfailed: function() { this.lockbuttons(); },
	preferences: function(dataSets, stream) {
		this.sumUpPreferences();
	},
	vtrigger: function(digits, datasets) {
		let visitors = datasets['C_dS_visitor'];
		let dontflood = 0;
		for(let id in visitors) { // preset the visitors selection with matching items
			if(dontflood++>5) break;
			this.controls.visitors.add(id);
		}
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D A T E    N A V I G A T I O N   
//
//    buttons  <<  <  date  >   >>  + navigation calendar in a drop down drawer
//

function C_iDNAV(eid, callbacks, preset) { // Top date picker and drop down full width Calendar, this is a double head control
	this.ctrlname = 'C_iDNAV';
	this.eids = { cscrl:eid+'_viewport', cal:eid+'_cal', ui:eid+'_ui', mmm:eid+'_mmm', mm:eid+'_mm', m:eid+'_m', p:eid+'_p', pp:eid+'_pp', ppp:eid+'_ppp' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { datechanged:, openorclose:, browsingdates:  }
	this.state = C_iDNAV.defaults.align(preset);
	
	// calendar display
		let mpr = C_iWIN.size.w <= 1400 ? 3 : 4; if(is.tactile) mpr = 3; if(is.small) mpr = 2; // months per row see (*mpr01*)
		const dphandler = {dayclick:new A_cb(this, this.changed, undefined, new A_cb(this, this.dpact, true))};
		
	const cal = new C_iCAL(this.eids.cal, dphandler, { mpr:mpr, rows:36, pastrows:24 /*24*/, weeknumb:mobminder.context.surfer.weeknumb }); // from controls.js
	
	// main date display
		const mousemoves = new A_cb(this, this.mousemoves);
	const ui = new C_iCLIK(this.eids.ui, { click:new A_cb(this, this.calpop), mousemoves:mousemoves } , { tag:'div', ui:'X', enabled:true } );	
	
	const mmm = new C_iCLIK(this.eids.mmm, { click:new A_cb(this, this.hugeskip, -1), mousemoves:mousemoves} , { ui:'', tag:'div', style:'', hidden:true, keys:[C_KEY.code.s.page_up+C_KEY.code.s.shift, C_KEY.code.s.ctrl+C_KEY.code.s.shift+C_KEY.code.s.up_arrow] } );
	const mm = new C_iCLIK(this.eids.mm, { click:new A_cb(this, this.bigskip, -1), mousemoves:mousemoves} , { ui:'', tag:'div', style:'', keys:[C_KEY.code.s.page_up+C_KEY.code.s.shift, C_KEY.code.s.ctrl+C_KEY.code.s.shift+C_KEY.code.s.up_arrow] } );
	const m = new C_iCLIK(this.eids.m, { click:new A_cb(this, this.skipdate, -1), mousemoves:mousemoves} , { ui:'', tag:'div', style:'', keys:[C_KEY.code.s.page_up, C_KEY.code.s.ctrl+C_KEY.code.s.up_arrow] } );
	const p = new C_iCLIK(this.eids.p, { click:new A_cb(this, this.skipdate, 1), mousemoves:mousemoves} , { ui:'', tag:'div', style:'', keys:[C_KEY.code.s.page_down, C_KEY.code.s.ctrl+C_KEY.code.s.down_arrow] } );
	const pp = new C_iCLIK(this.eids.pp, { click:new A_cb(this, this.bigskip, 1), mousemoves:mousemoves} , { ui:'', tag:'div', style:'', keys:[C_KEY.code.s.page_down+C_KEY.code.s.shift, C_KEY.code.s.ctrl+C_KEY.code.s.shift+C_KEY.code.s.down_arrow] } );
	const ppp = new C_iCLIK(this.eids.ppp, { click:new A_cb(this, this.hugeskip, 1), mousemoves:mousemoves} , { ui:'', tag:'div', style:'', hidden:true, keys:[C_KEY.code.s.page_down+C_KEY.code.s.shift, C_KEY.code.s.ctrl+C_KEY.code.s.shift+C_KEY.code.s.down_arrow] } );
		
	this.controls = { calendar:new A_ct({cal:cal}), datenav:new A_ct({ ui:ui, mmm:mmm, mm:mm, m:m, p:p, pp:pp, ppp:ppp }) };
	
	mobminder.app.dp = cal;
	mobminder.app.setdate = new A_cb(this, this.setmaindate); // see (*mb10*) in C_iMOB

	this.handlers = new A_hn({ scrolling:new A_cb(this, this.scrolling) });	
}
C_iDNAV.defaults = new A_df({ open:false, scrolling:false, prevdate:false, skip:0 });
C_iDNAV.prototype = {
	// this object has 3 displays
	
	display: function() { // main date with navigation arrows
		const td_mmm = ''; //this.controls.datenav.mmm.display('top-button-face far fa-arrow-alt-from-bottom fa-13x ');
		const td_mm = this.controls.datenav.mm.display('top-button-face far fa-fast-backward fa-13x ');
		const td_m = this.controls.datenav.m.display('top-button-face fas fa-step-backward fa-11x');
		const td_p = this.controls.datenav.p.display('top-button-face fas fa-step-forward fa-11x');
		const td_pp = this.controls.datenav.pp.display('top-button-face far fa-fast-forward fa-13x');
		const td_ppp = ''; // this.controls.datenav.ppp.display('top-button-face far fa-arrow-alt-from-top fa-13x');
		const td_dp = this.controls.datenav.ui.display('top-dpicker-face');
		const centered = '<div class="C_iDNAV-centered">'+td_mm+td_m+td_dp+td_p+td_pp+td_mmm+td_ppp+'</div>';
		const divwrap = '<div class="C_iDNAV-wrap">'+centered+'</div>';
		return divwrap;
	},
	calendar: function() { // calendar div that shows up when the main date is clicked, toggles from show() to hide().
		const slider = '<div id="'+this.eids.cscrl+'" style="display:none;">'+this.controls.calendar.cal.display()+'</div>'; // see (*dn01*)
		return slider;
	},
	activate: function(options) {
		options = options|| {}; // only:{cal:1, or nav:1}
		
		this.elements.collect(this.eids);
		
		if(options.only) {
			if(options.only.cal) this.controls.calendar.reset().activate('C_iDNAV');
			if(options.only.nav) this.controls.datenav.reset().activate('C_iDNAV');
		} else {
			this.controls.calendar.activate('C_iDNAV');
			this.controls.datenav.activate('C_iDNAV');
		}
		
		this.controls.datenav.ui.set(this.dateframe());
		if(is.tactile) { 
			const handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone)
					, bounce:new A_cb(this, this.bounce), bounceDone:new A_cb(this, this.bounceDone) }) ;
			const options = { bounce:true, momentum:true, snap:'tr.agrow', scrollbars:true };
			this.scrolly = new IScroll(this.elements.cscrl, options);  // C_iDNAV (top date picker)
			this.scrolly.on('scrollStart', handlers.iScrolling);
			this.scrolly.on('scrollEnd', handlers.iScrolldone);
			this.scrolly.on('bounceStart', handlers.bounce);
			this.scrolly.on('bounceEnd', handlers.bounceDone);
		}
		else {
			if(this.elements.cscrl) this.elements.cscrl.onscroll = this.handlers.scrolling;
		}
		this.state.prevdate = this.controls.calendar.cal.jsdate();
		
		// const that = this; setTimeout( function(){ that.scroll(3000); }, 2000 ); // does not process when display:none
	},
	setmaindate: function(jsdate) { // see (*mb10*) ANY GENERAL DATE DISPLAY CHANGE STARTS HERE

		// console.log('planning.js','C_iDNAV','setmaindate','date:'+jsdate.sortable());
	
		// so this is where it all starts!!
		// This function is called by this class sub-controls, but also by external clients through mobminder.app.setdate() calls
		//
		jsdate = jsdate || mobminder.account.upperLeftDate || new Date();
		this.controls.calendar.cal.set(jsdate); // this one calls this.changed() in a row
		this.controls.datenav.ui.set(this.dateframe());
		return this;
	},
	getmaindate: function() { return this.controls.calendar.cal.jsdate(); },
	close: function() {
		if(vbs) vlog('planning.js','C_iDNAV','close','');
		$(this.elements.cscrl).hide();
		this.state.open = false;
	},
	lastresasaved: function(dsresa) { // calls sub-control C_iCAL (from controls.js) so to higlight the calendar day of the last saved reservation
		this.controls.calendar.cal.lastresasaved(dsresa);
	},
	
	// private
	dateframe: function() {
		
		const jsdate = this.controls.calendar.cal.jsdate();
			const abreviation = is.tactile?'abr':'full';
		const date = '<div>'+C_XL.date(jsdate, {abreviation:abreviation, weekday:false })+'</div>';
		
		
		// clickable control face
			
		const weekday = '<div>'+C_XL.weekday(jsdate.getPHPday(), abreviation)+'</div>';
				// const dwidth = is.tactile?5:10;
				// const wwidth = is.tactile?3:6;
			// date = '<td style="min-width:'+dwidth+'em; text-align:left;">'+date+'</td>';
			// weekday = '<td style="min-width:'+wwidth+'em; text-align:right;">'+weekday+'&nbsp;</td>';
		// const html = '<table><tr>'+weekday+date+'</tr></table>';
		const final = '<div class="top-dpicker-face">'+weekday+date+'</div>';
		return final;
	},
	scroll: function(duration) {
		if(!this.state.open) return this;
		this.controls.calendar.cal.scroll(duration);
		return this;
	},
	bounceTop: function() {
		if(vbs) vlog('planning.js','C_iDNAV','bounceTop','');
		let keepscrollon = this.controls.calendar.cal.moreleft(1); // keeps the scroll on the top element visible before the bounce happened
		console.log('+++++++++++++++++++ scrolling');
	},
	bounceBottom: function() {
		if(vbs) vlog('planning.js','C_iDNAV','bounceBottom','');
		this.controls.calendar.cal.morebottom(1);
		console.log('+++++++++++++++++++ scrolling');
	},
	
	// DOM events
	scrolling: function() { // Casual DOM events
		let scrollPosition = this.elements.cscrl.scrollTop;
		let scrollMax = this.elements.cscrl.scrollHeight-this.elements.cscrl.clientHeight;
		if(scrollPosition<=0) this.bounceTop();
		if(scrollPosition>=scrollMax) this.bounceBottom();
		
		console.log('+++++++++++++++++++ scrolling');
	},
	iScrolling: function() { // iScroll events - tactile only -
		if(!this.state.scrolling) { // calls only once above
			C_iDAY.state.down = false; /* cancels a date click if your finger slides from a date td */ 
			this.state.scrolling = true;
			if(vbs) vlog('planning.js','C_iDNAV','iScrolling','');
		}
		console.log('+++++++++++++++++++ iScrolling');
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.state.scrolling = false;
		if(vbs) vlog('planning.js','C_iDNAV','iScrolldone','');
		console.log('+++++++++++++++++++ iScrolldone');
		return true;
	}, 
	bounce: function(to) {
		// if(vbs) vlog('planning.js','C_iDNAV','bounce','where:'+to);
		// this.controls.calendar.cal.busy(to);
		console.log('bounce');
	},
	bounceDone: function(to) {
		// if(vbs) vlog('planning.js','C_iDNAV','bounceDone','where:'+to);
		// this.controls.calendar.cal.notbusy();
		// if(to=='top') this.bounceTop();
			// else if(to=='bottom') this.bounceBottom();
		// if(this.scrolly) {
			// let iScroll = this.scrolly;
			// let next = function() { if(to=='bottom') iScroll.next(); };
			// this.scrolly.refreshNext(next);
		// }
		console.log('+++++++++++++++++++ bounceDone');
	},
	
	// callbacks
	calpop: function() {
		if(vbs) vlog('planning.js','C_iDNAV','calpop','');
		this.state.open = !this.state.open;
		// console.log('planning.js','C_iDNAV','calpop','this.state.open = '+this.state.open);
		this.controls.datenav.mmm.show(this.state.open);
		this.controls.datenav.ppp.show(this.state.open);
		
		if(this.callbacks.openorclose) this.callbacks.openorclose.cb(this.state.open);
		$(this.elements.cscrl).hide();
		if(!this.state.open) return;
		
		$(this.elements.cscrl).show();
		if(is.tactile) if(this.scrolly) this.scrolly.refreshNext(); // lets this applet measure the size of the divs
		
		this.scroll(0); // instant jump so you do not see the girafe
		this.activate({only:{cal:true}}); // if not re-activated, the this.elements.ui.style.setProperty(); do not execute, see(*ic03*)
		// const that = this; setTimeout( function(){ that.scroll(2000); }, 1 );
	},
	skipdate: function(skip) { // called from single array touch, skip must be 1 or -1
		if(vbs) vlog('planning.js','C_iDNAV','skipdate', 'skip='+skip);
		let inc = {};
		switch(mobminder.app.screen) {
			case screens.hourly:
			case screens.week: inc = { d:0, w:skip }; 
				break;
			case screens.list:
			case screens.changes:
			case screens.search: inc = { d:skip, w:0 };
				break;
			default: return;
		}
		this.state.skip = skip;
		this.controls.calendar.cal.increment(inc); // this one calls this.changed() in a row
		this.controls.datenav.ui.set(this.dateframe());
	},
	bigskip: function(skip) { // called from double array touch, skip must be 1 or -1
		if(vbs) vlog('planning.js','C_iDNAV','bigskip','skip='+skip);
		let inc = {};
		switch(mobminder.app.screen) {
			case screens.hourly: // on those two screens, a single skip increments a week
			case screens.week: inc = { nm:skip|0 }; 
				break;
			case screens.list: // on those three screens, a single skip increments one day
			case screens.changes:
			case screens.search: inc = { w:skip };
				break;
			default: return;
		}
		this.state.skip = 2*skip;
		this.controls.calendar.cal.increment(inc); // this one calls this.changed() in a row
		this.controls.datenav.ui.set(this.dateframe());
	},
	hugeskip: function(skip) { // called from triple array touch, skip must be 1 or -1
		if(vbs) vlog('planning.js','C_iDNAV','bigskip','skip='+skip);
		const inc = { nm:(skip|0)*4 };
		switch(mobminder.app.screen) { // this skip does not depend on which screen you are
			case screens.hourly: 
			case screens.week: 
			case screens.list: 
			case screens.changes:
			case screens.search:
				break;
			default: return;
		}
		this.state.skip = 4*skip;
		
		// this.controls.calendar.cal.increment(inc); // this one calls this.changed() in a row
		// this.controls.datenav.ui.set(this.dateframe());
		
		this.controls.calendar.cal.push(skip>0?1:-1);
	},
	changed: function(jsdate) { // final end point triggering a this.callbacks.datechanged.callback()
		// the date has changed on the datepicker, this one triggers after a few ms
		// if(vbs) vlog('planning.js','C_iDNAV','changed','date:'+jsdate.sortable());
		
			function daysBetween(d1, d2) {
				// Create copies so we don’t mutate the originals
				const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
				const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

				const MS_PER_DAY = 24 * 60 * 60 * 1000;

				return Math.round((date2 - date1) / MS_PER_DAY);
				// daysBetween(
				// 	new Date('2025-01-01 23:59'),
				// 	new Date('2025-01-02 00:01')
				// ); // returns 1
			}		
			const dayskip = daysBetween(this.state.prevdate,jsdate);
			// console.log('planning.js','C_iDNAV','changed',' new date:'+jsdate.sortable(),' prevdate:'+this.state.prevdate.sortable(),' dayskip:'+dayskip);
			
		if(this.callbacks.datechanged) this.callbacks.datechanged.cb(jsdate, this.state.prevdate.clone(), dayskip);
		if(this.state.open) this.scroll(600);
		this.state.prevdate = jsdate.clone();
	},
	dpact: function() { // blind callback call just indicating that date picking is busy
	
		// console.log('planning.js','C_iDNAV','dpact','');
		
		this.controls.datenav.ui.set(this.dateframe());
		if(vbs) vlog('planning.js','C_iDNAV','dpact','');
		if(this.callbacks.browsingdates) this.callbacks.browsingdates.cb(this.state.skip); // skip is [+7, +1, 0, -1, -7]
		this.state.skip = 0;
	},
	mousemoves: function() {}
}

C_iDNAV.today = function(eid, callbacks, preset) {
	
	this.eids = { today:eid+'_today'};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { ontoday:A_cb }

	// today display
			const uld = mobminder.account.upperLeftDate?mobminder.account.upperLeftDate:new Date(); // that feature allows to have a given pre-set date upper left in place of the today date (through setup page)
			const abreviation = is.tactile?'abr':'full';
		const datestring = C_XL.date(uld, {abreviation:abreviation, weekday:true, year:false, weeknumb:mobminder.context.surfer.weeknumb });
		const width = is.small?'width:60%;':'padding:0 2em';
	const today = new C_iCLIK(this.eids.today, { click:new A_cb(this, this.ontoday, uld.toMidnight() )} , { ui:datestring, tag:'td', style:width } );

	this.controls = new A_ct({today:today});
}
C_iDNAV.today.prototype = {
	display: function(css) {
		return this.controls.today.display(css?'click-default '+css:'');
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_iDNAV.today');
	},
	ontoday: function(jsdate) {
		if(this.callbacks.ontoday) this.callbacks.ontoday.cb(jsdate);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   N O T E S ,   T A S K S ,    C H A T 
//
//  

function C_iNOTA(eid, callbacks, preset) {
	
	this.ctrlname = 'C_iNOTA';
	this.eids = { slider:eid+'_sld', scroller:eid+'_scrl', viewport:eid+'_vwp', 
					menu: { table:eid+'_table', click:eid+'_clik', plus:eid+'_plus', close:eid+'_close' }, trigger:eid+'_trg' };
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { ontrigger:A_cb, openorclose:A_cb}
	this.state = C_iNOTA.defaults.align(preset);
	
	this.symbol = '<div style="font-size:1.2em; display:inline-block;" class="fa fa-gray fa-tags">'+'</div>';
			
	let trigger = new C_iCLIK(this.eids.trigger, { click:new A_cb(this, this.trigger) }, { ui:this.symbol, tag:'td', style:'min-width:5em;', css:'centered' } );
		let plustip = C_XL.w('new note');
	let plus 	= new C_iCLIK(this.eids.menu.plus, { click:new A_cb(this, this.plus)}, { tag:'td', ui:symbol('plus note'), style:'min-width:5em;', css:'centered', tip:plustip } );
		let closetip = C_XL.w('close');
	let close 	= new C_iCLIK(this.eids.menu.close, { click:new A_cb(this, this.trigger)}, { tag:'td', ui:symbol('close', false, 'padding:0'), style:'min-width:5em;', css:'centered', tip:closetip } );	
	
	this.controls = new A_ct({trigger:trigger, plus:plus, close:close,});
	this.state.plusclass = new C_dS_note_detail.plus();
}
C_iNOTA.defaults = new A_df({ open:false, scrolling:false, plusallow:true, plusclass:false });
C_iNOTA.prototype = {
	// this object has 3 displays
	
	icon: function() { // displays the trigger icon only
		return this.controls.trigger.display();
	},
	display: function() {  // viewport (closed by default)
			let drawerheight = '22em';
		let content = '<table style=""><tr><td style="height:'+drawerheight+'; vertical-align:bottom; max-width:900px;" id="'+this.eids.slider+'">'+'</td></tr></table>';
		let ltr = '<div class="" style="direction:ltr;">'+content+'</div>';
		let rtl = '<div id="'+this.eids.scroller+'" class="" style="direction:rtl; position:relative; height:'+drawerheight+'; overflow-y:auto; margin-left:1em;">'+ltr+'</div>';
		
						let ctrls 	= '<div>'+this.cdisplay()+'</div>';
					let positionned = '<div class="" style="text-align:right; position:absolute; bottom:0; left:5em; right:0;">'+ctrls+'</div>';
				let controls 	= '<div class="bottom-pane notes-bar-color" style="position:relative; text-align:right; height:2.4em;">'+positionned+'</div>';
		let viewport 	= '<div id="'+this.eids.viewport+'" class="C_iNOTA top-viewport" style="display:none;">'+rtl+controls+'</div>';
		return viewport;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_iNOTA');
	},
	nrefresh: function() {
		if(vbs) vlog('planning.js','C_iNOTA', 'nrefresh', 'open:'+this.state.open);
		let items = this.state.plusclass.count();
		let count = '';
		if(items) {
				let inner = '&nbsp;'+items;
				let padder = '<e style="visibility:hidden;">'+inner+'</e>';
				let absolute = '<e style="position:absolute; top:0.3em;">'+inner+'</e>';
			count = '<blink class="warning notes-blink-color" style="position:relative;">'+absolute+padder+'</blink>'; // !sequence is important for webkit (not for Mozilla)
		}
		this.controls.trigger.set(this.symbol+count);
		this.elements.slider.innerHTML = this.list();
		if(this.elements.scroller.scrollTop) this.elements.scroller.scrollTop = 0;
		this.controls.reset().activate('C_iNOTA');
	},
	
	// callbacks
	trigger: function() {
		if(this.state.open) this.close(); else this.open();
		if(this.callbacks.ontrigger) this.callbacks.ontrigger.cb(this.state.open, this);
		if(this.callbacks.openorclose) this.callbacks.openorclose.cb(this.state.open); // keep it different than ontrigger, the A_cb passed here has a delay because it triggers an onresize() 
		return this;
	},
	close: function() {
		if(vbs) vlog('planning.js','C_iNOTA','close','');
		$(this.elements.viewport).hide(); this.state.open = false;
		$(this.elements.viewport).removeClass('onscreen');
	},
	open: function() {
		if(vbs) vlog('planning.js','C_iNOTA','open','');
		this.state.open = true; $(this.elements.viewport).show();
		$(this.elements.viewport).addClass('onscreen');
	},
	
	// private
	cdisplay: function() { // controls display
	
			let p = ''; if(this.state.plusallow && this.state.plusclass.plusmay) p = this.controls.plus.display();
			let c = this.controls.close.display();
			let t = '<td style="width:94%;"><h1 class="left notes-title-color">'+C_XL.w('notes')+'</h1></td>';
		let tr = '<tr>'+t+p+c+'</tr>';
		let table = '<table style="margin:0; height:'+topbar.height+';" id="">'+tr+'</table>';
		return table;
	},
	list: function() {
		let trs = new Array();
		let pluslist = this.state.plusclass.list();
		for(let x in pluslist.order) {
			let id = pluslist.order[x], number = (x|0)+1;
				let eid = this.eids.menu.click+this.state.plusclass.eid+'_'+id;
				let label = pluslist.labels[id];
			let click = new C_iCLIK(eid, { click:new A_cb(this, this.item, id) } , { tag:'div', ui:label, style:'overflow:hidden;' } );
			this.controls.add1(click, eid);
			
			let tdclick = '<td style="line-height:1.1em;">'+click.display()+'</td>';
			let tdcount = '<td style="text-align:right; min-width:4em; font-size:smaller;">'+number+'.</td>';
			trs.push('<tr style="">'+tdcount+tdclick+'</tr>'); // starts by listing all options, each on ONE row
		}
		if(!trs.length) trs.push('<tr><td colspan=2 style="text-align:center; height:8em; font-size:bigger; font-weight:bold;">-&nbsp;'+C_XL.w('no note')+'&nbsp;-</td></tr>');
		if(vbs) vlog('planning.js','C_iNOTA', 'list', 'items count:'+trs.length);
		let table = '<table style="margin:0 auto;" id="'+this.eids.menu.table+'">'+trs.join('')+'</table>';
		return table;
	},	
	item: function(id) {
		if(vbs) vlog('planning.js','C_iNOTA', 'item', 'id:'+id);
			let item = this.state.plusclass.get(id);
			let changed = new A_cb(this, this.notechanged, id);
		new M_NOTE(item, { saved:changed, removed:changed });
	},
	plus: function() {
		if(vbs) vlog('planning.js','C_iNOTA', 'plus', '');
		let newitem = this.state.plusclass.plus();
		let changed = new A_cb(this, this.notechanged);
		
		let addrlogins = C_dS_loggable.getbyAccLevel([aLevel.manager]); // medical call centers are using aLevel.manager for the operators so we include them all straight away
			addrlogins[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation
		
		new M_NOTE(newitem, { saved:changed }, { tab:1, addrlogins:addrlogins });
	},
	notechanged: function() {
		if(vbs) vlog('planning.js','C_iNOTA', 'notechanged', '');
		this.nrefresh();
	}
}


function C_iTASK(eid, callbacks, preset) {
	
	this.ctrlname = 'C_iTASK';
	this.eids = { slider:eid+'_sld', scroller:eid+'_scrl', viewport:eid+'_vwp', 
					menu: { table:eid+'_table', click:eid+'_clik', plus:eid+'_plus', close:eid+'_close' }, trigger:eid+'_trg' };
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { ontrigger:A_cb, openorclose:A_cb }
	this.state = C_iTASK.defaults.align(preset);
	
	this.symbol = '<div style="font-size:1.2em; display:inline-block;" class="fa fa-gray fa-thumbtack fa-rotate-45">'+'</div>';
			
	let trigger = new C_iCLIK(this.eids.trigger, { click:new A_cb(this, this.trigger) }, { ui:this.symbol, tag:'td', style:'min-width:5em;', css:'centered' } );
		let plustip = C_XL.w('new task');
	let plus 	= new C_iCLIK(this.eids.menu.plus, { click:new A_cb(this, this.plus)}, { tag:'td', ui:symbol('plus task'), style:'min-width:5em;', css:'centered', tip:plustip } );
		let closetip = C_XL.w('close');
	let close 	= new C_iCLIK(this.eids.menu.close, { click:new A_cb(this, this.trigger)}, { tag:'td', ui:symbol('close', false, 'padding:0'), style:'min-width:5em;', css:'centered', tip:closetip } );	
	
	this.controls = new A_ct({trigger:trigger, plus:plus, close:close,});
	this.state.plusclass = new C_dS_task_description.plus();
}
C_iTASK.defaults = new A_df({ open:false, scrolling:false, plusallow:true, plusclass:false });
C_iTASK.prototype = {
	// this object has 3 displays
	
	icon: function() { // displays the trigger icon only
		return this.controls.trigger.display();
	},
	display: function() {  // viewport (closed by default)
			let drawerheight = '22em';
		let content = '<table style="width:100%;"><tr><td style="height:'+drawerheight+'; vertical-align:bottom; max-width:900px;" id="'+this.eids.slider+'">'+'</td></tr></table>';
		let ltr = '<div class="" style="direction:ltr;">'+content+'</div>';
		let rtl = '<div id="'+this.eids.scroller+'" class="" style="direction:rtl; position:relative; height:'+drawerheight+'; overflow-y:auto; margin-left:1em;">'+ltr+'</div>';
		
						let ctrls 	= '<div>'+this.cdisplay()+'</div>';
					let positionned = '<div class="" style="text-align:right; position:absolute; bottom:0; left:5em; right:0;">'+ctrls+'</div>'; 
				let controls 	= '<div class="bottom-pane tasks-bar-color" style="position:relative; text-align:right; height:2.4em;">'+positionned+'</div>'; 
		let viewport 	= '<div id="'+this.eids.viewport+'" class="C_iTASK top-viewport" style="display:none;">'+rtl+controls+'</div>';
		return viewport;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_iTASK');
	},
	trefresh: function() {
		if(vbs) vlog('planning.js','C_iTASK', 'trefresh', 'open:'+this.state.open);
		let items = this.state.plusclass.count();
		let count = '';
		if(items) {
				let inner = '&nbsp;'+items;
				let padder = '<e style="visibility:hidden;">'+inner+'</e>';
				let absolute = '<e style="position:absolute; top:0.3em;">'+inner+'</e>';
			count = '<blink class="warning tasks-blink-color" style="position:relative;">'+absolute+padder+'</blink>'; // !sequence is important for webkit (not for Mozilla)
		}
		this.controls.trigger.set(this.symbol+count);
		this.elements.slider.innerHTML = this.list();
		if(this.elements.scroller.scrollTop) this.elements.scroller.scrollTop = 0;
		this.controls.reset().activate('C_iTASK');
	},
	
	
	// callbacks
	trigger: function() {
		if(this.state.open) this.close(); else this.open();
		if(this.callbacks.ontrigger) this.callbacks.ontrigger.cb(this.state.open, this);
		if(this.callbacks.openorclose) this.callbacks.openorclose.cb(this.state.open); // keep it different than ontrigger, the A_cb passed here has a delay because it triggers an onresize() 
		return this;
	},
	close: function() {
		if(vbs) vlog('planning.js','C_iTASK','close','');
		$(this.elements.viewport).hide(); this.state.open = false;
		$(this.elements.viewport).removeClass('onscreen');
	},
	open: function() {
		if(vbs) vlog('planning.js','C_iTASK','open','');
		this.state.open = true; $(this.elements.viewport).show();
		$(this.elements.viewport).addClass('onscreen');
	},
	
	// private
	cdisplay: function() { // controls display
	
			let p = ''; if(this.state.plusallow && this.state.plusclass.plusmay) p = this.controls.plus.display();
			let c = this.controls.close.display();
			let t = '<td style="width:94%;"><h1 class="left tasks-title-color">'+C_XL.w('tasks')+'</h1></td>';
		let tr = '<tr>'+t+p+c+'</tr>';
		let table = '<table style="margin:0; height:'+topbar.height+';" id="">'+tr+'</table>';
		return table;
	},
	list: function() {
		let trs = new Array();
		let pluslist = this.state.plusclass.list();
		for(let x in pluslist.order) {
			let id = pluslist.order[x], number = (x|0)+1;
				let eid = this.eids.menu.click+this.state.plusclass.eid+'_'+id;
				let label = pluslist.labels[id];
			let click = new C_iCLIK(eid, { click:new A_cb(this, this.item, id) } , { tag:'div', ui:label, style:'overflow:hidden;' } );
			this.controls.add1(click, eid);
			
			let tdclick = '<td style="max-width:80%;">'+click.display()+'</td>';
			let tdcount = '<td style="text-align:right; min-width:4em; font-size:smaller;">'+number+'.</td>';
			trs.push('<tr>'+tdcount+tdclick+'</tr>'); // starts by listing all options, each on ONE row
		}
		if(!trs.length) trs.push('<tr><td colspan=2 style="text-align:center; height:8em; font-size:bigger; font-weight:bold;">-&nbsp;'+C_XL.w('no task')+'&nbsp;-</td></tr>');
		if(vbs) vlog('planning.js','C_iTASK', 'list', 'items count:'+trs.length);
		let table = '<table style="min-width:50%; margin:0 auto;" id="'+this.eids.menu.table+'">'+trs.join('')+'</table>';
		return table;
	},	
	item: function(id) { // click on a list item
		if(vbs) vlog('planning.js','C_iTASK', 'item', 'id:'+id);
		let item = this.state.plusclass.get(id);
		let tasksaved = new A_cb(this, this.tasksaved, id);
		new M_TASK(item, { saved:tasksaved, removed:tasksaved });
	},
	plus: function() { // click on the plus icon
		if(vbs) vlog('planning.js','C_iTASK', 'plus', '');
		let newitem = this.state.plusclass.plus();
		let tasksaved = new A_cb(this, this.tasksaved);
		
		let asslogins = C_dS_loggable.getbyAccLevel([aLevel.manager]); // medical call centers are using aLevel.manager for the operators so we include them all straight away
			asslogins[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation

		new M_TASK(newitem, { saved:tasksaved }, { tab:1, asslogins:asslogins });
	},
	tasksaved: function() {
		if(vbs) vlog('planning.js','C_iTASK', 'tasksaved', '');
		this.trefresh();
	}
}



function C_iTHREADS(eid, callbacks, preset) { // ongoing chats overview and new chats options
	
	this.ctrlname = 'C_iTHREADS';
	this.eids = { slider:eid+'_sld', scroller:eid+'_scrl', viewport:eid+'_vwp', 
					menu: { table:eid+'_table', click:eid+'_clik', plus:eid+'_plus', close:eid+'_close', loggable:eid+'_logble' }
				, trigger:eid+'_trg' };
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { ontrigger:A_cb, openorclose:A_cb }
	this.state = C_iTHREADS.defaults.align(preset);
	
	this.symbol = '<div style="font-size:1.2em; display:inline-block;" class="fa fa-gray fa-comments">'+'</div>';
			
	let trigger = new C_iCLIK(this.eids.trigger, { click:new A_cb(this, this.trigger) }, { ui:this.symbol, tag:'td', style:'min-width:5em;', css:'centered' } );
		let plustip = C_XL.w('new chat');
	let plus 	= new C_iCLIK(this.eids.menu.plus, { click:new A_cb(this, this.plus)}, { tag:'td', ui:symbol('plus chat'), style:'min-width:5em;', css:'centered', tip:plustip } );
		let closetip = C_XL.w('close');
	let close 	= new C_iCLIK(this.eids.menu.close, { click:new A_cb(this, this.trigger)}, { tag:'td', ui:symbol('close', false, 'padding:0;'), style:'min-width:5em;', css:'centered', tip:closetip } );	
	
	this.controls = new A_ct({trigger:trigger, plus:plus, close:close,});
	this.state.plusclass = new C_dS_chat_thread.plus();
	
	this.modal = false;
	
	this.livebythread = []; // is an array like livebythread[threadid] = [login1, login2, login3, ...]; (for in modal display)
	this.livelogins = []; // is an array like livelogins = [login1, login2, login3, ...]; (for loggables display)
		
	C_iTHREADS.polling.setcallback('threadslist', new A_cb(this, this.warning)); // register to the chat polling engine (*pe*)
	this.fetchchitems();
}
C_iTHREADS.defaults = new A_df({ open:false, scrolling:false, plusallow:true, plusclass:false, warning:0, chrefreshing:false });
C_iTHREADS.prototype = {
	// this object has 3 displays
	
	icon: function() { // displays the trigger icon only
		return this.controls.trigger.display();
	},
	display: function() { // viewport (closed by default)
			let drawerheight = '22em';
		let content = '<table style="width:100%;"><tr><td style="vertical-align:bottom; max-width:500px;" id="'+this.eids.slider+'">'+'</td></tr></table>';
		let ltr = '<div class="" style="direction:ltr;">'+content+'</div>';
		let rtl = '<div id="'+this.eids.scroller+'" class="" style="direction:rtl; position:relative; height:'+drawerheight+'; overflow-y:auto; margin-left:1em;">'+ltr+'</div>';
		
						let ctrls 	= '<div>'+this.cdisplay()+'</div>';
					let positionned = '<div class="" style="text-align:right; position:absolute; bottom:0; left:5em; right:0;">'+ctrls+'</div>';
				let controls 	= '<div class="bottom-pane chats-bar-color" style="position:relative; text-align:right; height:2.4em;">'+positionned+'</div>';
		// let viewport 	= '<div id="'+this.eids.viewport+'" class="C_iTHREADS top-viewport" style="display:none;">'+rtl+controls+'</div>';
		let viewport 	= '<div id="'+this.eids.viewport+'" class="C_iTHREADS top-viewport" style="display:none;">'+rtl+controls+'</div>';
		return viewport;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate(this.ctrlname);
	},
	crefresh: function() { // menu drawer content (i.e. list of chat threads and loggables list)
		if(vbs) vlog('planning.js','C_iTHREADS', '----------------------- crefresh', 'open:'+this.state.open+', warnings:'+this.state.warning);
		
	// console.log('CHAT LIST REFRESH');
		let items = this.state.plusclass.count();
		this.elements.slider.innerHTML = this.list()+this.loggablelist();
		if(this.elements.scroller.scrollTop) this.elements.scroller.scrollTop = 0; // moves the scroll slider to the top
		this.controls.reset().activate(this.ctrlname);
	},
	totalrefresh: function() { // refreshes the display of the total un-read chat threads. This counter is displayed bottom left of the main drawer opener trigger
		let count = '';
		if(this.state.warning) {
				let inner = '&nbsp;'+this.state.warning;
				let padder = '<e style="visibility:hidden;">'+inner+'</e>';
				let absolute = '<e style="position:absolute; top:0.3em;">'+inner+'</e>';
			count = '<blink class="warning chats-blink-color" style="position:relative;">'+absolute+padder+'</blink>'; // !sequence is important for webkit (not for Mozilla)
		}
		this.controls.trigger.set(this.symbol+count);
	},
	
	
	// callbacks
	trigger: function() { // opens or closes the drawer
		if(this.state.open) this.close(); else this.open();
		if(this.callbacks.ontrigger) this.callbacks.ontrigger.cb(this.state.open, this);
		if(this.callbacks.openorclose) this.callbacks.openorclose.cb(this.state.open); // keep it different than ontrigger, the A_cb passed here has a delay because it triggers an onresize() 
		return this;
	},
	close: function() {
		if(vbs) vlog('planning.js','C_iTHREADS','close','');
		$(this.elements.viewport).hide();
		$(this.elements.viewport).removeClass('onscreen');
		this.state.open = false;
		C_iTHREADS.polling.polling(); // go back to polling chat mode
		// return this.fetchchitems(); // let the display order align with server last phylactery time
		return this.crefresh(); // let the display order align with server last phylactery time
	},
	open: function() {
		if(vbs) vlog('planning.js','C_iTHREADS','open','');
		this.state.open = true;
		$(this.elements.viewport).show();
		$(this.elements.viewport).addClass('onscreen');
		C_iTHREADS.polling.realtime(); // when the chat drawer is open, we engage realtime chatting. 
	},
	
	// private
	fetchchitems: function() { // call server, get a fresh set of dS_chat_threads, dS_chat_participants, dS_chat_visirefs, and dS_visitors
		let p = new C_iPASS({ lid:mobminder.context.surfer.id });
		mobminder.app.post({p:p}, {p:{lid:'lid'}}, './queries/chitems.php', new A_cb(this,this.chitems), new A_cb(this,this.chitemsfailed));
		this.state.chrefreshing = true;
		cmems.flush('chitems');
	},
	chitems: function(dSets, stream) { // fresh chat threads from server
		this.state.chrefreshing = false;
		// C_iTHREADS.polling.readchatpeak(stream); //  (*pe*) calls in turn this.crefresh(); // updates small red counters at the trigger side
		this.crefresh();
		if(this.modal) 
			if(this.modal.dataSet.id) // exclude a modal opened for chat creation (virtual dS_chat)
				this.modal.rehook().partrefresh(); // (*c03*) refresh also the list of participants inside the currently opened modal
	},
	cdisplay: function() { // bottom of drawer menu controls display (iconic new chat and a drawer close action)
	
			let p = ''; if(this.state.plusallow && this.state.plusclass.plusmay) p = this.controls.plus.display();
			let c = this.controls.close.display();
			let t = '<td style="width:94%;"><h1 class="left chats-title-color">'+C_XL.w('chats')+'</h1></td>';

		let tr = '<tr>'+t+p+c+'</tr>';
		let table = '<table style="margin:0; height:'+topbar.height+';" id="">'+tr+'</table>';
		return table;
	},
	list: function() {
		if(vbs) vlog('planning.js','C_iTHREADS', 'list', '');
		let trs = new Array();
		let pluslist = this.state.plusclass.list();
		for(let x in pluslist.order) {
			let id = pluslist.order[x];
				let eid = this.eids.menu.click+this.state.plusclass.eid+'_'+id;
				let label = pluslist.labels[id];
				let index = humandate(pluslist.lastphyls[id], {relative:true, abreviation:'full'} );
			let click = new C_iCLIK(eid, { click:new A_cb(this, this.item, id) } , { tag:'div', ui:label, style:'overflow:hidden;' } );
			this.controls.add1(click, eid);
			
				let tdclick = '<td style="max-width:80%; line-height:1.3em; padding:.1em .2em;">'+click.display()+'</td>';
				let tdcount = '<td style="text-align:right; min-width:8em; font-size:smaller;">'+index+'</td>';
			trs.push('<tr style="border-bottom:1px solid rgba(255,255,255,.6);">'+tdcount+tdclick+'</tr>'); // starts by listing all options, each on ONE row
		}
		if(!trs.length) trs.push('<tr><td colspan=2 style="text-align:center; height:8em; font-size:bigger; font-weight:bold;">-&nbsp;'+C_XL.w('no chat')+'&nbsp;-</td></tr>');
		if(vbs) vlog('planning.js','C_iTHREADS', 'list', 'items count:'+trs.length);
		let table = '<table style="min-width:50%; margin:0 auto; display:inline-block;" id="'+this.eids.menu.table+'">'+trs.join('')+'</table>';
		return table;
	},	
	loggablelist: function() { // clickable list of logins that you can use to start a chat 
		let loggable = new C_iUSERS(this.eids.menu.loggable, {onuser:new A_cb(this, this.onuser), onalevel:new A_cb(this, this.onalevel)}, {menu:true}, false );
		this.controls.add1(loggable, 'loggable');
		if(vbs) vlog('planning.js','C_iTHREADS', 'loggable', '');
		let html = '<div style="display:inline-block; text-align:left; font-size:90%; float:right;">'+this.controls.loggable.display({titlecss:'plus'})+'</div>';

		// Implement display of live logins : start here
		// console.log('loggablelist lives: ',this.livelogins);

		return html;
	},
	
	
	// events
	item: function(id) { // click on a list item label, opens a chat modal
		if(vbs) vlog('planning.js','C_iTHREADS', 'item', 'id:'+id);
			let item = this.state.plusclass.get(id);
			let saved = new A_cb(this, this.chatsaved, id);
			let escaped = new A_cb(this, this.chatescaped);
			let seen = new A_cb(this, this.chatseen);
			
		this.modal = new M_chat(item, { saved:saved, removed:saved, escaped:escaped, seen:seen }, {tab:2});
	},
	plus: function() { // click on plus label, opens a new chat modal
		if(vbs) vlog('planning.js','C_iTHREADS', 'plus', '');
			let newitem = this.state.plusclass.plus();
			let saved = new A_cb(this, this.chatsaved);
			let participants = C_dS_loggable.getbyAccLevel([aLevel.supervisor]); 
				participants[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation
		this.modal = new M_chat(newitem, { saved:saved }, { tab:1, plogins:participants } );
	},
	onuser: function(uid) { // starts chat by selecting an addressee user from the list, the logged active surfer is included also in the participants list
		if(vbs) vlog('planning.js','C_iTHREADS', 'onuser', 'user:'+uid);
			let newitem = this.state.plusclass.plus();
			let saved = new A_cb(this, this.chatsaved, 0);
			let participants = []; participants[uid] = true; 
				participants[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation
		this.modal = new M_chat(newitem, { saved:saved }, { tab:1, plogins:participants } );
	},
	onalevel: function(alevel) {		
		if(vbs) vlog('planning.js','C_iTHREADS', 'onalevel', 'users of level:'+aLevel.name(alevel));
			let newitem = this.state.plusclass.plus();
			let saved = new A_cb(this, this.chatsaved, 0);
			let participants = C_dS_loggable.getbyAccLevel([alevel]); 
				participants[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation
		this.modal = new M_chat(newitem, { saved:saved }, { tab:1, plogins:participants } );
	},
	chatsaved: function(id) {
		if(vbs) vlog('planning.js','C_iTHREADS', 'chatsaved', 'id:'+id);
		this.modal = false;
	// console.log('CHATSAVED');
		this.crefresh(); // aims to update the plus list with the new created or modified item (thread name may have changed)
	},
	chatescaped: function() {
		if(vbs) vlog('planning.js','C_iTHREADS', 'chatescaped', '');
		this.modal = false;
	},	
	chatseen: function(chatid, physcount) { // callback from M_chat after phylactaries have been displayed
		if(vbs) vlog('planning.js','C_iTHREADS', 'chatseen', 'chatid:'+chatid+', physcount'+physcount);
	},
	
	// ajax callbacks
	warning: function(threadsnews) { // this.warning() is given as feedback function to C_iTHREADS.polling.callbacks.threadslist, see (*po01*)
		
		// this code is called periodically (every 2 seconds when drawer is opened and every minute when closed)
		// chatpeek brings here some information about the number and state of chats as available at server side (threadsnews)
		
		// threadsnews is like threadsnews[chatId] = { phylcount:phylcount, cversion:cversion, lives:lives }
		
		// compute on phylacteries
		let localchats = this.state.plusclass.get(); // C_dS_chat_thread, cached locally (read from a previous chitems report)
		let warning = 0; // small red counter at the bottom right of drawer opener trigger (double phylacteries red counter)
		let phyupdate = false; // a modal is opened and its chatthread display should be updated (query list of phylacteries)
		let chlistrefresh = false; // need to refresh the list displayed in the chat threads drawer (this includes the red little counter showing number of unread phyls)
		let phylcountrefresh = false; // need to refresh the list displayed in the chat threads drawer (this includes the red little counter showing number of unread phyls)
		let phyllastrefresh = false; // need to refresh the list displayed in the chat threads drawer (this includes the red little counter showing number of unread phyls)
		let serverfetchchats = false; // under certain conditions, we will re-sync the local chats data with the one available on the server (by calling fetchchitems() ). 
		
		// (*c1.*) We have been excluded from a given chat
		// (*c2.*) A given chat has now more phylacteries in the thread then we are aware in local
		// (*c3.*) We are included in the list of participant of a new/existing chat, not yet listed locally
		// (*c4.*) The participants list has changed for a given chat
		
		let modalid = 0; if(this.modal) modalid = this.modal.dataSet.id; // modal is 0 (no modal or new chat modal), or an id of dS_chat_thread residing on server
		
		// threads red warning figure display
		for(let id in threadsnews) // check for existing and new chat threads
			if(id in localchats) { // this chat is already known locally
				
				if(id==0) continue; // no business for a chat that is newly created virtual (and displayed in a modal after touching the "new chat" option)
				
					let onserver = threadsnews[id].phylcount; // information arriving with entering chatpeek
					let seenonserver = threadsnews[id].phylseen; // information arriving with entering chatpeek
					
					let locally = localchats[id].physonserver; // we use the value received from the previous chatpeek
					let localseen = localchats[id].participants.bylogin.get(mobminder.context.surfer.id).physseen;
					
					let server_phyllast = threadsnews[id].phyllast;
					
				if(this.modal) { // opened chat modal, the background chlist can be refreshed 
					// (we try not to update the chat list when drawer is open and user is about to click an item, it would switch the display order under the mouse of the user)
						let local_phyllast = localchats[id].lastphyl;
					if(server_phyllast != local_phyllast) phyllastrefresh = true;
				
				} else { // no opened chat modal
					if(locally != onserver) phylcountrefresh = true; // for this thread, the number of phylacteries has increased
				}
					
				localchats[id].lastphyl = server_phyllast; // helps display order in chat drawer (*do01*), keeping thisline here makes that any call to this.crefresh(); will use the new lastphyl setting
				
				
				if(localseen != seenonserver) { 
					chlistrefresh = true; // for this thread, the number of phylacteries has increased
					if(onserver==seenonserver) // cover case of one user having multiple open screens where identical chat thread is being seen simultaneously
						localchats[id].participants.bylogin.get(mobminder.context.surfer.id).physseen = seenonserver; 
				}
				
				if(localseen != onserver) {
					if(modalid) { if(modalid!=id) warning++; } // avoid incrementing the total counter and trigger sound if we are busy in this modal
					else warning++;
			}
				
				// localchats[id].physonserver = threadsnews[id].phylcount; // updates the local counter
				localchats[id].physonserver = onserver; // updates the local counter
				localchats[id].seenonserver = seenonserver; // updates the local counter
				
			} else { // threads contains a reference not yet listed in local, we will trigger a call to this.fetchchitems()
				if(id) // do not react on chats under creation process
					serverfetchchats = true; // c3. this login participates in a chat identified on server and not yet listed here
					// console.log('CASE 3 '+id);
			}
			
		// live logins information ( PVH 2021: to be implemented, we stopped here at gathering info. Not used for display so far )
			this.livebythread = []; // is an array like livebythread[threadid] = [login1, login2, login3, ...]; (for in modal display)
			this.livelogins = []; // is an array like livelogins[login1]=1, livelogins[login2]=1, ...]; (for loggables display)
		for(let id in threadsnews) // check for live logins
			if(threadsnews[id].lives) {
				if(threadsnews[id].lives == '0') continue; // no one is live, see (*lv01*)
				let ls = threadsnews[id].lives.split('!');
				this.livebythread[id] = ls; // keep a record of which logins are live on which chat thread 
				for(let l in ls) this.livelogins[ls[l]] = 1; // this makes possible an or sum of login ids 
			}
		
		// threads versions
		for(let ctid in localchats) { 
			let evacuate = false;
			if(ctid==0) continue; // no business for a chat that is newly created virtual (and displayed in a modal after touching the "new chat" option)
			
			if(threadsnews[ctid]===undefined) {
				// c1. check for threads we have been pushed off from, they are still listed here in local but not present anymore in the server report
				if(modalid==ctid) { this.modal.evacuate(); evacuate = true; }
				serverfetchchats = true;
					// console.log('CASE 1 '+ctid);
			} else
				if(!evacuate) {
					// let localcversion = localchats[ctid].cversion(); // see (*ps01*)
					let localcversion = localchats[ctid].v; // reads the chat version directly dS_chat_thread
					let servercversion = threadsnews[ctid].cversion;
					if(localcversion!=servercversion) { // c4. check if the participants list is still the one on the server
						if(modalid==ctid) this.modal.state.refreshparticipants = true; // (*c03*) 
						serverfetchchats = true;
					// console.log('CASE 4 '+ctid);
					}
				}
		}
		
		if(this.modal) { // focus on an open chat
			chlistrefresh = true; // background refresh continuously so to keep the phylacteries counter up to date	
			if(!this.modal.state.evacuated) // when scenario c1. happens, this.dataSet is deleted by C_iTHREADS::fetchchitems()
				if(!this.state.chrefreshing) {  // we nee to read from the local dataSet registery, that is emptied when /queries/chitems is busy 
					if(modalid in threadsnews) {
							let localphys = modalid?localchats[modalid].phylacteries.bycue.ends():0; // number of phylactaries for this chat as is in local dS_phylacteries cache
							let onserver = threadsnews[modalid].phylcount; // information arriving with entering chatpeek
						if(onserver != localphys) {
							phyupdate = true; // this modal should refresh its chatthread display
						}	
					}
				}
		}
		
		// refresh the summary red sum on the Top bar
		if(warning != this.state.warning) {
			if(warning > this.state.warning) mobminder.sounds.walle.play();
			this.state.warning = warning; 
			this.totalrefresh(); // updates small red counter at the bottom right of drawer opener trigger (double phylacteries)
		}
		if(vbs) vlog('planning.js','C_iTHREADS', 'warning', 'warning: '+warning+', serverfetchchats: '+serverfetchchats+', phyupdate: '+phyupdate+', chlistrefresh: '+chlistrefresh+', phylcountrefresh: '+phylcountrefresh+', phyllastrefresh: '+phyllastrefresh);
		
		
		if(chlistrefresh||phylcountrefresh||phyllastrefresh) this.crefresh(); // refreshes the list displayed in the chat threads drawer
		if(phyupdate) return this.modal.phyrefresh(); // refresh any open modal for which number of phylacteries changed, so to real time display a new message from another participant
		if(serverfetchchats) return this.fetchchitems(); // c2 // fetches from server
	},
	chitemsfailed: function() {
		if(vbs) vlog('planning.js','C_iTHREADS', 'chitemsfailed', '');
	}
}


function C_iTHREADSdog() { // polling or real time communication with server - reporting chat threads status
	
	// There are two running mode:
	//  A: this.state.realtime = true; <= the serveur is waiting for news from other users and calls us back in real time mode
	//  B: this.state.realtime = false: <= we poll the server once in a while to keep updated
	// - the two running mode are NEVER enabled in parallel (you either have a timer waiting here, or a php thread waiting on the server).
	// - when the upper level switches the mode from watchdog to realtime, this takes immediate effect
	// - when the upper level switches from realtime to watchdog, it takes effect when the rt mode times out
	
	this.state = C_iTHREADSdog.defaults.align();
	this.callbacks = { threadslist:false, accountslist:false };
	this.watchdog = false;
	this.register = false;
	if(vbs) vlog('planning.js','C_iTHREADSdog', 'new', '');
}
C_iTHREADSdog.defaults = new A_df({ realtime:false, realtimerythm:5, pollingrythm:120 });
C_iTHREADSdog.prototype = {
	//public
	setcallback: function(which, callback) {
		switch(which) {
			case 'threadslist': this.callbacks.threadslist = callback; break;
			case 'accountslist': this.callbacks.accountslist = callback; break; 
		}
	},
	activate: function() {
		if(vbs) vlog('planning.js','C_iTHREADSdog', 'activate', '');
		this.registereset();
		let anychat = C_dS_group.anychat;
		if(anychat) {
				let now = new Date();
				let wdname = 'chatdog-'+now.HHmm();
				let wdpreset = {url:'./queries/chatdog.php', rythm:(this.state.pollingrythm), wait:10};
			this.watchdog = new C_iWatchdog(wdpreset, { dogstream:new A_cb(this, this.backhere) }, wdname);
		}
	},
	stop: function() {
		if(vbs) vlog('planning.js','C_iTHREADSdog', 'stop', '');
		if(this.watchdog) { this.watchdog.suspend(true); }
	},
	realtime: function() { // sets the chat mode to realtime
		if(vbs) vlog('planning.js','C_iTHREADSdog', 'realtime', 'rythm:'+this.state.realtimerythm);
		this.state.realtime = true;
		this.watchdog.state.rythm = this.state.realtimerythm;
		this.watchdog.trigger();
	},
	polling: function() { // sets the chat mode to polling mode
		if(vbs) vlog('planning.js','C_iTHREADSdog', 'polling', 'rythm:'+this.state.pollingrythm);
		this.state.realtime = false;
		this.watchdog.state.rythm = this.state.pollingrythm;
	},
	
	// private
	registereset: function() {
		this.register = new C_regS('byaccount');
	},
	readchatpeak: function(stream) { // see also (*po01*),  (*pe*)
	
		// both /chatdog.php and /chitems.php return chat status information in between <data></data>
		
		// Example of stream
		// 
		// $accountId.'-'.$chatId.'-'.$phyltotal.'-'.$physseen.'-'.$version.'-'.$phyllast.'-'.implode('!',$lives); // (*cpk01*)
		//
		// <data>3925-835457-2-2-1-1616667455-0
		// 3925-836001-46-45-4-1616791830-0
		// 3925-836308-0-0-0-0-0
		// 3925-836032-38-38-2-1616774971-0</data>
		//
		// accountId-chatId-phylcount-phylseen-cversion
		//
		// phylcount is the total amount of phylacteries in the chat
		// phylseen is the number of phylacteries seen by the current logged in surfer. phylseen <= phylcount
		// cversion is the sum of login ids of participants in the chat
		//
		// note that the scope of this information goes beyond the currently loaded mobminder.account.id, it includes all accounts to which this login has access to.
		//
		
		let parts = stream.extract('<data>','</data>').match.split(newline);
		if(vbs) {
			let now = new Date();
			vlog('planning.js','C_iTHREADSdog', 'backhere', 'time:'+now.HHmm(1)+', parts:'+parts.length);
		}
		let t, split = [], threads = [];
		this.registereset();
		if(parts.length) {
			while(t = parts.shift()) split.push(t.split('-'));
			for(let x in split) {
				let accountid 	= split[x][0]|0; 
				let chatid 		= split[x][1]|0;
				let phylcount 	= split[x][2]|0;
				let phylseen 	= split[x][3]|0;
				let cversion 	= split[x][4]|0; // this is the sum of all login ids of participants as currently written on the server
				let phyllast 	= split[x][5]|0; // unix timed last phylactery time
				let lives 		= split[x][6]; // login id's of participants seen in the last 10 seconds
				
				if(accountid == mobminder.account.id) threads[chatid] = { phylcount:phylcount, phylseen:phylseen, cversion:cversion, phyllast:phyllast, lives:lives }; // only for the currently displayed account
				this.register.byaccount.add(accountid, chatid, phylcount-phylseen);
			}
		}
		
		// threads is an array like [600007=>8, 600013=>3, 600014=>1 ] where the key is the chat id and the value is the philas count
		if(this.callbacks.threadslist) this.callbacks.threadslist.cb(threads); // up there you can change the running mode from polling to realtime or reverse
		if(split.length) if(this.callbacks.accountslist) this.callbacks.accountslist.cb(this.register.byaccount.get()); // up there you can change the running mode from polling to realtime or reverse, see T_logged::warning()

		return false; // is used as a "suspend" indicator for the polling watchdog
	},
	
	// ajax feedback
	backhere:function(dSets, stream) { // (*pe*) // periodic watchdog callback
		this.readchatpeak(stream);
	}
};
C_iTHREADS.polling = false; // will be an instance of C_iTHREADSdog()
C_iTHREADS.reset = function() { 
	// initialization of the chat watchdog
	if(vbs) vlog('planning.js','C_iTHREADSdog', 'reset', 'existing:'+(C_iTHREADS.polling?'yes':'no'));
	if(!C_iTHREADS.polling) {
		C_iTHREADS.polling = new C_iTHREADSdog(); // on page load
	}
	else {
		C_iTHREADS.polling.stop();
		C_iTHREADS.polling.activate(); // triggered by config call: every time you switch to another account, or login (*pe*)
	}
};





//////////////////////////////////////////////////////////////////////////////////////////////
//
//   P L A N N I N G     S C R E E N    L A Y O U T    ( single / multi / including search pannel)
//
//   (including search engine when appearing on the view)
//


function C_iPLAN(callbacks, preset) {  // is used by C_iMOB to fill the entire desk screen element, only the T_bar is displayed above. 
	this.callbacks = callbacks||{};
	this.eids = { desk:'k', layout:'l', remote:'r', agenda:'a', header:'h', datenav:'d', tasks:'t', notes:'n', chats:'c', zoom:'z', searchassistant:'s' }
	this.state = C_iPLAN.defaults.align(preset);

	const remote = new R_search(this.eids.searchassistant, { stickers: new A_cb(this, this.stickers), resasaved:new A_cb(this, this.slotsaved) } );
		
	const agenda = new P_AgendaHVL(this.eids.agenda
		, { screenchange:new A_cb(this, this.setscreen), resasaved:new A_cb(this, this.resasaved), plitems:new A_cb(this, this.plitems)
			, rescsaved:this.callbacks.rescsaved, rescdeleted:this.callbacks.rescdeleted, ondetails:new A_cb(this, this.ondetails) }
		, { });
		
		const mightresize = new A_cb(this, this.mightresize, undefined, undefined, 10);
	const datenav = new C_iDNAV(this.eids.datenav, { datechanged:new A_cb(this, this.setplanningdate), openorclose:mightresize, browsingdates:new A_cb(this, this.browsingdates) }, {});
		
		const tnc_triggered = new A_cb(this, this.tnc_triggered);
	const tasks = mobminder.account.usetasks ? new C_iTASK(this.eids.tasks, { ontrigger:tnc_triggered, openorclose:mightresize }, {}) : false;
	const notes = mobminder.account.usenotes ? new C_iNOTA(this.eids.notes, { ontrigger:tnc_triggered, openorclose:mightresize }, {}) : false;
	const chats = mobminder.account.usechat ? new C_iTHREADS(this.eids.chats	, { ontrigger:tnc_triggered, openorclose:mightresize }, {}) : false;
	
		// const zui = symbol(this.state.zoom?'zoom-out':'zoom-in','fa-13x','padding-right:0;');
			const inout = 'fa-search-plus';
		const zoomui = '<div class="fa fa-11x fa-gray '+inout+'">'+'</div>';

	const zoom = new C_iCLIK(this.eids.zoom, {click:new A_cb(this, this.togglezoom)}, { ui:zoomui, tag:'div', css:'flexcentered', tip:C_XL.w('tip zoom'), style:'min-width:5em;' } );

	
	this.controls = { 
		top: new A_ct({tasks:tasks, notes:notes, chats:chats }),
		desk: new A_ct({remote:remote, agenda:agenda, zoom:zoom }),
		dnav: new A_ct({datenav:datenav})
	}
	this.elements = new A_el();
}
C_iPLAN.defaults = new A_df({ currentscreen:0, resourceId:0 }); // screens = { } 
C_iPLAN.prototype = {

	display: function(screen) { // See C_iMOB::configloaded(), this is where this html layout is dropped into C_iMOB.desk
		const calendar = this.controls.dnav.datenav.calendar();
		
		let taskslist = '';
		let noteslist = '';
		let chatslist = '';
		
		// optional controls
		if(mobminder.account.usenotes||mobminder.account.usetasks||mobminder.account.usechat) {
			if(this.controls.top.tasks) taskslist = this.controls.top.tasks.display();
			if(this.controls.top.notes) noteslist = this.controls.top.notes.display();
			if(this.controls.top.chats) chatslist = this.controls.top.chats.display();
		}
		
		// some dev helper
		let highlite = { red:'', green:'', cyan:'', orange:'', purple:'', blue:'' }; 
		if(0) // use this debug feature when maintaining this area
			highlite = { red:'border:2px solid red;', green:'border:2px solid green;', cyan:'border:2px solid cyan;', orange:'border:2px solid orange;', purple:'border:2px solid purple;', blue:'border:2px solid blue;' }; 

		
		// now let's draw
		const bodymode = mobminder.account.single?'single':'multi';
			
		$("body").removeClass('single').removeClass('multi');
		$("body").addClass(bodymode);
			const topconcole = '<div class="desk-console" style="'+highlite.green+'">'+taskslist+noteslist+chatslist+calendar+'</div>';
			const desk = '<div id="'+this.eids.desk+'" class="desk-planning" style="position:relative;'+highlite.orange+'">'+'</div>'; // later set by this.setscreen()
		return '<div class="desk-grid" style="height:100%; min-height:100%;">'+topconcole+desk+'</div>';
	},
	activate: function(screen) {
		
		if(vbs) vlog('planning.js','C_iPLAN','activate','screen:'+screen); 
		this.elements.collect(this.eids);
		this.controls.top.activate(); // notes, tasks, chat, zoom
		this.controls.dnav.datenav.activate({only:{cal:1}});
		C_Agendadog.polling.setcallback('daysum', new A_cb(this, this.daysum));
		C_Agendadog.polling.setcallback('csdelta', new A_cb(this, this.csdelta));
		return this;
	},
	stickers: function(cor) { // used by the search slot preview
		return this.controls.desk.agenda.stickers(cor.resa, cor.is, cor.css);
	},
	copypaste: function(dS_resa, options) {
		return this.controls.desk.agenda.copypaste(dS_resa, options);
	},
	visitrigger: function(digits) { // programmatically sets digits in the field, that triggers an AC search
		this.controls.desk.remote.visitrigger(digits);
	},
	refresh: function() { // no server call, plitems are re-drawn from cache
		return this.controls.desk.agenda.refresh();
	},
	lastresasaved: function(dsresa) { // calls sub-control C_iDNAV so to higlight the calendar day of the last saved reservation
		this.controls.dnav.datenav.lastresasaved(dsresa);
	},
	// event handling
	slotsaved: function(resa) { // new resa from slot search
		if(vbs) vlog('planning.js','C_iPLAN','slotsaved','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		// console.log('planning.js','C_iPLAN','slotsaved','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		// this.highlight(resa.id, 'resa-new');
		this.controls.desk.agenda.lastresasaved(resa);
		if(this.callbacks.resasaved) this.callbacks.resasaved.cb(resa);
	},
	plitems: function() {
		if(vbs) vlog('planning.js','C_iPLAN','plitems',''); 
		if(this.controls.top.tasks) this.controls.top.tasks.trefresh();
		if(this.controls.top.notes) this.controls.top.notes.nrefresh();
		if(this.controls.top.chats) this.controls.top.chats.crefresh();
		if(this.callbacks.plitems) this.callbacks.plitems.cb();
		this.controls.desk.agenda.lastresasaved();
	},
	resasaved: function(resa) { // new resa from graphical draw ( Obsolete, never called PVH 2025)
		if(vbs) vlog('planning.js','C_iPLAN','resasaved from planning','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		// console.log('planning.js','C_iPLAN','resasaved from planning','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		// this.highlight(resa.id, 'resa-new');
		this.controls.desk.agenda.lastresasaved(resa);
		if(this.callbacks.resasaved) this.callbacks.resasaved.cb(resa);
	},
	ondetails: function(orientation) {
		
		// at this level, we only treat hiding/showing the search assistant gui
			let hidesearch = C_dS_details.get(orientation, class_bCal, details.hidesrchasst);  
		
		if(hidesearch) $(this.elements.remote).hide();
		else 
			switch(this.state.currentscreen) { 
				case screens.search: 
					$(this.elements.remote).show(); break;
				case screens.week: 
				case screens.list: 
				case screens.changes: 
				case screens.hourly: 
					$(this.elements.remote).hide(); break; 
					break;
			}
	},
	setscreen: function(newscreen, resourceId, jsdate) { // screen change or screen refresh inside the Agenda display circle
		
		if(!resourceId) if(mobminder.account.single) resourceId = mobminder.account.single;
		if(!resourceId && this.state.resourceId) resourceId = this.state.resourceId;
		this.state.resourceId = resourceId;
		
		if(vbs) vlog('planning.js','C_iPLAN','setscreen','newscreen:'+newscreen+', resourceId:'+resourceId+', date:'+(jsdate?jsdate.datetimestr({y:true}):'undefined')); 
		
		if(this.state.currentscreen == newscreen) return false;
			else this.state.currentscreen = newscreen;
		
		const searchpannel = this.controls.desk.remote.display();
		const datenav = this.controls.dnav.datenav.display();
		const zoom = this.controls.desk.zoom.display();
		
		// optional controls
		let notestaskschats = '';
		if(mobminder.account.usenotes||mobminder.account.usetasks||mobminder.account.usechat) {
				const td_notes = this.controls.top.notes ? this.controls.top.notes.icon() : '';
				const td_tasks = this.controls.top.tasks ? this.controls.top.tasks.icon() : '';
				const td_chats = this.controls.top.chats ? this.controls.top.chats.icon() : '';
			// notestaskschats = '<table style="height:100%;"><tr><td style="width:99%;"></td>'+td_notes+td_tasks+td_chats+'</tr></table>';
			notestaskschats = '<table style="height:100%;"><tr>'+td_notes+td_tasks+td_chats+'</tr></table>';
		}
		
		// some dev helper
				let highlite = { red:'', lime:'', cyan:'', orange:'', purple:'', blue:'' }; 
		if(0) // use this debug feature when maintaining this area
			highlite = { red:'border:3px solid red;', lime:'border:3px solid green;', cyan:'border:3px solid cyan;', orange:'border:3px solid orange;', purple:'border:3px solid purple;', blue:'border:3px solid blue;' }; 

		const d = this.controls.desk.agenda.display(newscreen, resourceId); // like { planning:html, header:html } obtained from P_AgendaHVL::display()
			
		let layout = '', dnh = '', hl = '';
		switch(d.orientation) {
			case planning.text: break;
			case planning.changes: hl = C_XL.w('agenda_changes'); break;
			case planning.vertical: break;
			case planning.hourly: hl = C_XL.w('e-hourlies'); break;
			case planning.horizontal: break;
		}
		mobminder.app.controls.top.highlight(hl); // sets the top header display
		const ro = '10px'; // right offset (leaves place for the scrollbar in horizontal mode),this value must stay uniform across views, so there is no jump of controls when browsing through screens.
		// now let's draw the screen:
		switch(d.orientation) { // that gives us a clue of what layout to apply: scroller desk or fixed height desk
			case planning.text: // this is a printable version of the agenda day, also called 'list view'
			case planning.changes:
				dnh = 'height:3em; min-height:3em;';
		
			// list view screen layout

							const ldatenavcentered = '<div style="position:absolute; width:1px; display:inline-block; top:0; left:50vw; overflow:visible; '+dnh+'">'+datenav+'</div>';
					const lnavbar  = '<div class="topnav" style="position:relative; grid-column:span 2; display:flex; justify-content:space-between; margin-top:6px; '+dnh+' width:calc(100vw - '+ro+'); min-width:calc(100vw - '+ro+');">'+ldatenavcentered+'</div>';
						
						const lheader = '<div id="'+this.eids.header+'" class="agenda-header" style="'+highlite.blue+'">'+d.header+'</div>';
						const lstyle = 'vertical-align:top; position:relative; '; 
					const list = '<div id="'+this.eids.agenda+'" class="list-list" style="'+lstyle+highlite.cyan+'">'+d.planning+'</div>';
						
					const lls = 'overflow-y:scroll; overflow-x:clip; position:absolute; top:0; left:0; right:0; bottom:0; width:100vw;';
				layout = '<div id="'+this.eids.layout+'" class="C_iPLAN list-layout" style="'+lls+highlite.purple+'">'+lnavbar+lheader+list+'</div>'; 
				break;
				
			case planning.vertical: 	
			case planning.hourly:
				
				dnh = 'height:3em; min-height:3em;';
		
			// vertical orientation planning screen layout
			// datenav is a div.C_iDNAV-wrap
			
						const vdatenavcentered = '<div style="position:absolute; width:1px; display:inline-block; top:0; left:50vw; overflow:visible; '+dnh+'">'+datenav+'</div>';
					const vnavbar  = '<div class="topnav" style="position:relative; grid-column:span 2; display:flex; justify-content:space-between; margin-top:6px; '+dnh+' width:calc(100vw - '+ro+'); min-width:calc(100vw - '+ro+');">'+zoom+notestaskschats+vdatenavcentered+'</div>';
					
					const vheader = '<div id="'+this.eids.header+'" class="agenda-header" style="'+highlite.blue+'">'+d.header+'</div>';
					const left = '<div id="'+this.eids.agenda+'" class="vertical-left" style="vertical-align:top; position:relative; '+highlite.cyan+'">'+d.planning+'</div>';
						
						const searchdiv = '<div style="">'+searchpannel+'<div>';
						
						const rcolstyle = 'overflow-y:scroll; position:relative;';
					const right = '<div id="'+this.eids.remote+'" class="vertical-right remote-wrap" style="'+rcolstyle+'">'+searchdiv+'</div>';
					
					const vls = 'position:absolute; top:0; left:0; right:0px; bottom:0;';
				layout = '<div id="'+this.eids.layout+'" class="C_iPLAN single-layout" style="'+vls+'">'+vnavbar+vheader+left+right+'</div>';
				break;
			
			case planning.horizontal:
			default:
			
			// horizontal orientation planning screen layout, this one has no "agenda-header"
			dnh = 'height:40px; min-height:40px;';
			// datenav is a div.C_iDNAV-wrap
								const datenavcentered = '<div style="position:absolute; width:1px; display:inline-block; top:0; left:50vw; overflow:visible; margin-top:6px; '+dnh+'">'+datenav+'</div>';
						const navbar  = '<div style="display:flex; justify-content:space-between; margin-top:6px; '+dnh+'">'+zoom+notestaskschats+datenavcentered+'</div>';
						
					// const topnav = '<div class="topnav" style="position:absolute; top:0; left:0; right:9px; z-index:+50;">'+navbar+'</div>'; // .topnav see (*tn01*)
					const topnav = '<div class="topnav" style="position:absolute; top:0px; left:0; width:calc(100vw - '+ro+'); min-width:calc(100vw - '+ro+'); z-index:+50;">'+navbar+'</div>'; // .topnav see (*tn01*)
						
					const header = '<div id="'+this.eids.header+'" style="'+dnh+' padding-top:20px;">'+d.header+'</div>'; // this padding-top positions vertically the graphic display.
					const row1 = '<div id="'+this.eids.agenda+'" style="display:table-cell; vertical-align:top; position:relative; '+highlite.blue+' width:100%;">'+d.planning+'</div>'; // position:relative; min-height:100%; height:calc(100% - 6em);
						
						const div = '<div style="padding-top:2em;'+highlite.lime+'">'+searchpannel+'</div>'; // (*nt*) max-width:0em; is the divick to get the div not to outgrow the entire table. 
					const row2 = '<div id="'+this.eids.remote+'" class="remote-row" style="vertical-align:top; margin-bottom:20px;">'+div+'</div>';

				const bottomshade = '<div class="bottomshade" style="position:absolute; bottom:0; left:0; right:0; height:30px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn01*)
				
				const divs = '<div style="'+highlite.cyan+' min-height:100%; min-width:100%;">'+header+row1+row2+'</div>';
				const hls = 'overflow-y:scroll; overflow-x:clip; position:absolute; top:0; left:0; right:0; bottom:0;';
			layout = '<div id="'+this.eids.layout+'" class="C_iPLAN multi-layout" summary="multi layout" style="'+hls+highlite.purple+'">'+divs+'</div>'+bottomshade+topnav;
			break;
		}
		 
		// change and activate the DOM
		$("#k").html(layout); // drop this nice package to the DOM
		this.elements.collect(this.eids);
		this.ondetails(d.orientation); // hides the search assistant on non pertinent screens
		
		this.controls.dnav.datenav.activate({only:{nav:1}}); // double head control from which we need only to refresh the datenav head
		this.controls.desk.reset().activate('C_iPLAN desk');
		
		if(d.orientation==planning.horizontal) { this.elements.layout.scrollTop = 0; };
		
		if(jsdate) this.setmaindate(jsdate); // jsdate is provided from e.g. vertical week view when clicking on the column header date
			else this.setplanningdate(); // new screen but no date change, draw data as is
		return false;
	},
	setplanningdate: function(jsdate, prevdate, dayskip) {  // changes the display in the planning grid (called from C_iDNAV::changed())
		// calls setdate() on the currently enabled agenda display: either 
		this.controls.desk.agenda.setdate(jsdate||this.controls.dnav.datenav.getmaindate(), prevdate, dayskip); // calls setdate() on P_AgendaHVL
	},
	browsingdates: function(jsdate, dayskip) { this.controls.desk.agenda.browsingdates(jsdate, dayskip); }, // changes the display in the planning grid
	setmaindate: function(jsdate) { this.controls.dnav.datenav.setmaindate(jsdate); }, // changes the display on the main date
	highlight: function(resaId, css) { this.controls.desk.agenda.highlight(resaId, css); }, 
	tnc_triggered: function(state, tnc) {
		if(state) { // when one of the drawers opens up, close other drawers that are open.
			if(this.controls.top.tasks) if(tnc!=this.controls.top.tasks) this.controls.top.tasks.close(); 
			if(this.controls.top.notes) if(tnc!=this.controls.top.notes) this.controls.top.notes.close();
			if(this.controls.top.chats) if(tnc!=this.controls.top.chats) this.controls.top.chats.close();
		}
	},
	mightresize: function(opened) { // when opening / closing chat, notes, tasks or calendar drawers, a scrollbar appears on the right edge of the window. We need to trigger a resize so to re-align absolute positionned stickers versus horizontal axis
		if(vbs) vlog('planning.js','C_iPLAN','mightresize','opened:'+(!!opened?'TRUE':'FALSE')); 
		this.controls.desk.agenda.onresize();
	},
	togglezoom: function() { 
		this.controls.desk.agenda.togglezoom();
		let zstate = this.controls.desk.agenda.state.zoom;
		let newcaption = symbol(zstate?'zoom-out':'zoom-in','fa-13x','padding-right:0;');
		this.controls.desk.zoom.caption(newcaption);
	},
	
	// private
	daysum: function() { // watchdog predog
		if(this.state.currentscreen != screens.search) return false;
		let r = rmems['plitems'].resas.get();
		let ics = 0;
		let tcs = 0;
		for(let rid in r) { // this exact same calculation is realized at server side in watchdog.php and should stay equal
			let dS_resa = r[rid];
			if(dS_resa.deletorId==0) { 
				ics += (rid|0)+(dS_resa.v|0); // ids of not deleted reservations
				tcs += dS_resa.cueIn+dS_resa.cueOut;  // cues of not deleted reservations
			}
		}
		let ddate = this.controls.dnav.datenav.getmaindate(); 
		return { date:ddate.sortable(), ics:ics, tcs:tcs };
	},
	csdelta: function(icsdelta,tcsdelta) { // watchdog callback
		if(!icsdelta&&!tcsdelta) return; // no difference between server and local
		if(this.state.currentscreen != screens.search) return;
		this.setplanningdate();
	}
}



function C_Agendadog() {
	
	this.state = C_Agendadog.defaults.align();
	this.callbacks = {};
	this.watchdog = false;
	if(vbs) vlog('planning.js','C_Agendadog', 'new', '');
}
C_Agendadog.defaults = new A_df({  });
C_Agendadog.prototype = {
	//public
	setcallback: function(which, callback) {
		switch(which) {
			case 'daysum': this.callbacks.daysum = callback; break;
			case 'csdelta': this.callbacks.csdelta = callback; break;
		}
	},
	activate: function() {
		if(vbs) vlog('planning.js','C_Agendadog', 'activate', '');
				const now = new Date();
				const wdname = 'watchdog-'+now.HHmm();
				// let wdpreset = {url:'./queries/watchdog.php', rythm:300, wait:60};
				const wdpreset = {url:'./queries/watchdog.php', rythm:60, wait:30};
			this.watchdog = new C_iWatchdog(wdpreset, { dogstream:new A_cb(this, this.backhere), predog:new A_cb(this, this.predog) }, wdname);
	},
	stop: function() {
		if(vbs) vlog('planning.js','C_Agendadog', 'stop', '');
		if(this.watchdog) { this.watchdog.suspend(true); }
	},
	
	// prog callbacks
	predog: function() {
		if(!this.callbacks.daysum) return false;
		const o = this.callbacks.daysum.cb();
		if(o===false) return false;
		return {values:{date:o.date,ics:o.ics,tcs:o.tcs}, names:{date:'date',ics:'ics',tcs:'tcs'}};
	},
	
	// ajax callbacks
	backhere:function(dSets, stream) { 
		if(!this.callbacks.csdelta) return false;
		const parts = stream.extract('<data>','</data>').match.split(newline);
		
		// <data>6264158-6264158-3092680800-3092680800</data>
		
		let t;
		const split = [];
		if(parts.length) {
			while(t = parts.shift()) split.push(t.split('-'));
			for(let x in split) {
				ilocalcs = split[x][0]|0; // id check sums
				iservercs = split[x][1]|0; 
				tlocalcs = split[x][2]|0;  // time check sums
				tservercs = split[x][3]|0; 
			}
		}
		this.callbacks.csdelta.cb(iservercs-ilocalcs, tservercs-tlocalcs);
	}
};
C_Agendadog.polling = false; // will be an instance of C_Agendadog()
C_Agendadog.reset = function() { // used by mobminder.js C_iMOB::configloaded() see (*wd01*)
	if(vbs) vlog('planning.js','C_Agendadog', 'reset', 'existing:'+(C_Agendadog.polling?'yes':'no'));
	if(C_Agendadog.polling) C_Agendadog.polling.stop();
	C_Agendadog.polling = new C_Agendadog(); // on page load
	C_Agendadog.polling.activate();
	// if(!C_Agendadog.polling) {
		// C_Agendadog.polling = new C_Agendadog(); // on page load
		// C_Agendadog.polling.activate();
	// }
	// else {
		// C_Agendadog.polling.stop();
		// C_Agendadog.polling.activate(); // triggered by config call: every time you switch to another account, or login (*pe*)
	// }
};




