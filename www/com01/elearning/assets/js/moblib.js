

//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D E B U G     T O O L S  
//
var xlate = { 0:'C_iXL', 1:'C_iEDIT' }


var verboseOn = false;
var classOnlyVerbose = xlate; // (defines which filter to apply) default: false (verbose for all classes)
	
	
warning = function(file, classid, functionid, msg, more) {
	if(!verboseOn) return; // then shut up
	var combo = 'WARNING - ['+file+']'+tab+classid+'::'+functionid+'() '+msg;
	if(more) console.log(combo,more); else console.log(combo);
}

var vlogcount = 0, vbs = verboseOn;	
var tab = String.fromCharCode(9);
var newline = String.fromCharCode(10);

vlog = function(file, classid, functionid, msg, more) {
	if(!verboseOn) return; // then shut up
	var classDisplay = false;
	
	for(var x in classOnlyVerbose)
		if(classid==classOnlyVerbose[x]) classDisplay = true;
		
	var combo = (vlogcount++)+' ['+file+']'+tab+classid+'::'+functionid+'('+msg+')';
	if(more) console.log(combo,more); else console.log(combo);
}
	

	
	
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   U S E R     A G E N T    D E T E C T I O N
//
var device = { 
	  browser: 
		(/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'mozilla' :
		(/MSIE/i).test(navigator.userAgent) ? 'MSIE' :
		(/trident/i).test(navigator.userAgent) ? 'ms' :
		'opera' in window ? 'Opera' : 'Browser unknown'
, OS:
		(/Linux/i).test(navigator.userAgent) ? 'Linux' :
		(/Windows/i).test(navigator.userAgent) ? 'Windows' :
		(/Android/i).test(navigator.userAgent)  ? 'Android' :
		(/Windows Phone/i).test(navigator.userAgent) ? 'WinPhone' :
		(/OS 8_/i).test(navigator.userAgent) ? 'Mac8' :
		(/Mac OS/i).test(navigator.userAgent) ? 'Mac' : 'OS Unknown'
, HW:
		(/iPad/i).test(navigator.userAgent) ? 'iPad' :
		(/iPhone/i).test(navigator.userAgent) ? 'iPhone' :
		(/Macintosh/i).test(navigator.userAgent) ? 'Macintosh' :
		(/Tablet/i).test(navigator.userAgent) ? 'Tablet' :
		(/Windows Phone/i).test(navigator.userAgent) ? 'WinPhone' : 'Laptop/tower'
};
var is = { 
	  small:
		!!(/webos|iphone|ipod|blackberry|nokia|htc|huawei|opera mini|mobile safari|windows phone|iemobile/i).test(navigator.userAgent.toLowerCase())
, tactile:
		!!(/webos|iphone|ipod|blackberry|nokia|htc|opera mini|mobile safari|windows phone|iemobile|android|ipad/).test(navigator.userAgent.toLowerCase()) // ||('ontouchstart' in window)||(navigator.msMaxTouchPoints) PROBLEM WITH HYBRID DEVICES
, browser: { MSIE:(navigator.appName=='Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) }
, landscape: (window.orientation==-90||window.orientation==90)
, portrait: (window.orientation==0||window.orientation==180)
, appleios: device.OS=='Mac'&&(device.HW=='iPad'||device.HW=='iPhone')
};
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_el = function(eids) { 
	this.get = new Array(); // allows scanning of controls only (no scanning of A_ct functions)
	if(eids) this.collect(eids);
}
A_el.prototype = {
	collect: function(eids) { // eids is an object, possibly nesting other objects, where members are element ids
		for(var x in eids)
			if(typeof(eids[x])=='object') { this.get[x] = this[x] = new A_el(eids[x]); } // recurse
				else this.get[x] = this[x] = document.getElementById(eids[x]);
		return this;
	},
	defined: function(element) {
		if(!(element in this)) return false; // own property not defined
		if(!(this[element])) return false;	// property exists but is false or undefined
		return true;
	}, 
	undefined: function(element) { return !this.defined(element) }
}
A_el.isdisplayed = function isdisplayed(eid) { return !!document.getElementById(eid); };




//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
function A_ct(controls) {  // eids is an object, possibly nesting other objects, where members are controls
	this.notActivated = new Array();
	this.get = new Array(); // allows scanning of controls only (no scanning of A_ct functions)
	for(var x in controls) { this.get[x] = this[x] = controls[x]; this.notActivated.push(controls[x]); }
}; 
A_ct.prototype = {
	cnt: function() { var c=0; for(var x in this.get) c++; return c; },
	add: function(controls) {
		for(var x in controls) {
			this.get[x] = this[x] = controls[x];
			this.notActivated.push(controls[x]);
		}
	},
	add1: function(control, name) {
		if(name!==undefined) this.get[name] = this[name] = control;
		this.notActivated.push(control);
		return control;
	},
	activate: function(context) {  
		if(vbs) vlog('mobframe.js','A_ct','activate','context:'+(context||'not specified'));
		
		if(this.notActivated.length==0) return; // no control referenced in this object
		var o_control = this.notActivated.shift();
		while(o_control!==undefined) { // end of list
			if(o_control!==false) o_control.activate(); // control not in use is set to false
			o_control = this.notActivated.shift(); // control in use and should be activated
		}
	},
	reset: function() {	 // make controls ready for re-activation
		this.notActivated = new Array(); 
		for(var x in this.get) {
			if('reset' in this[x]) this[x].reset(); // recurse sub tree
			this.notActivated.push(this[x])
		}; 
		return this; 
	},
	isvalid: function() {
		var macrovalid = true;
		for(var control in this.get) {
			if(this[control]['valid']) { // only if the function is defined for this control
				var valid = this[control].valid();
				macrovalid = macrovalid && valid;
				if(!valid) if(vbs) vlog('mobframe.js','A_ct','isvalid','control:'+control+' is NOT valid.');
			}
			if(this[control] instanceof A_ct) // or the A_ct contains nested A_ct
				macrovalid = macrovalid && this[control].validation();
		}
		return macrovalid;
	},
	validation: function() {
		var isvalid = this.isvalid();
		// if(!isvalid) console.log('Invalid fields remain unfilled');
		return isvalid;
	},
	getposts: function() { // usefull when one control is a macro control made only from sub-controls
		var post = {};
		for(var x in this.get) { post[x] = this.get[x].getpost(); }
		return post;
	},
	getpost: function() { // usefull when posting nested controls, eg: new A_ct( { cartouche:cartouche, tabs:tabs, more:more, filters:new A_ct({keyword:keyword, visitor:visitor}) } )
		return this.getposts();
	}
}


	
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C A L L B A C K S   -  US/EU PATENT PENDING P.VANHOVE
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_cb = function A_cb(context, call, correlator, busy, delay) { // busy is an A_cb called while delay is running
	this.context = context;	// the object instance to be called in
	this.call = call;	// the callback function
		if(this.call===undefined) { warning('mobframe.js','A_cb','constructor','setting up an undefined callback for:',context); };
	this.correlator = correlator; // correlator comes as first argument in the callback when it is defined
	this.has = { correlator:((correlator!==undefined)&&(correlator!==null)) };
	this.busy = busy; 	// equivalent to a "typing" message if this callback was used on an input field
	this.delay = delay; // this.call i triggered only after a delay when delay is provided
	
	// private
	this.timeout = false;
}
A_cb.prototype = { // sorry for the comments shortage :oP
	argsarray: function() {
		var args = new Array(); for(var x=0; x<arguments.length; x++) args.push(arguments[x]);
		return args;
	},
	cb: function() {
		var args = this.argsarray.apply(this, arguments);
		if(this.delay) { args.unshift(this.delay); return this.dcb.apply(this, args); }
		if(this.has.correlator) args.unshift(this.correlator); // correlator comes as first argument in the callback when it is defined
		if(this.call.name) /* the function must have a name */ if(vbs) vlog('mobframe.js','A_cb','do','callback:'+this.call.name);
		return this.call.apply(this.context, args);
	},
	dcb: function(delay) { // delayed callback .dcb(600, jsDate) will deliver jsDate to the handler
		if(this.timeout) clearTimeout(this.timeout);
			else if(this.busy) this.busy.cb();
		var args = this.argsarray.apply(this, arguments);
		// args[0] = this; args.unshift(delay); args.unshift(A_cb.out);
		// this.timeout = setTimeout.apply(null, args);  <= was removed, setTimeout on MSIE does not pass the third argument...
			var that = this;
		this.timeout = setTimeout(function() { A_cb.out(that, args[1], args[2], args[3])}, delay);
	},
	continu: function() {
		this.timeout = false;
		var args = this.argsarray.apply(this, arguments);
		args.shift(); // remove this pointer
		if(this.has.correlator) args.unshift(this.correlator); // correlator comes as first argument in the callback when it is defined
		return this.call.apply(this.context, args);
	}
}
A_cb.out = function(i) { return i.continu.apply(i,arguments); }



//////////////////////////////////////////////////////////////////////////////////////////////
//
//
A_hn = function(handlers){
	for(name in handlers) { this.add(name, handlers[name]) }
}
A_hn.prototype = {
	add: function(name, callback, delay) { // please avoid this name => 'add' for your handler :o)
		if(delay) this[name] = function(e) {
			var args = new Array(); for(var x=0; x<arguments.length; x++) args.push(arguments[x]); args.unshift(delay);
			return callback.dcb.apply(callback, args);
		}; 
		else this[name] = function() { return callback.cb.apply(callback, arguments) }; 
		return this[name];
	}
}


	
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D E F A U L T S    A L I G N M E N T  -  US/EU PATENT PENDING P.VANHOVE
//
// This piece of code runs many thousands time in an application execution. Watch your fingers!!
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_df = function(defaults, depth, path) { 
	defaults = defaults||{}; 
	// debug recursivity concerns
	// var depth=depth||0; var path=path||(new Array()); path.push(defaults);
	// if(depth>6) { console.log('depth:'+depth+tab,defaults); for(var x in path) console.log(tab+'path'+x+':',path[x]); throw "stop execution"; }
	
	// preapre a lean default object
	for(var x in defaults) {
			var d = defaults[x];
			if(typeof(d)=='object') {
				var isAdf = (d instanceof A_df);
				var isDte = (d instanceof Date); 
				if(isAdf||isDte) { this[x] = d; }
					else this[x] = new A_df(d, ++depth, path); // when preset is { a:1, b:2, c:{you:3, me:4}} we make it { a:1, b:2, c:A_df({you:3, me:4})}
			}
				else this[x] = d; // scalar, string, boolean or Date	
	}
}
A_df.prototype = { 
	align: function(preset) { // fullfills preset with members of this o_defaults object, values in preset have priority
		preset = preset||{}; 
		for(var i in this) { if(i in A_df.prototype) continue; // no action for own prototype functions
				var d = this[i];
			if(d instanceof A_df) { preset[i] = d.align(preset[i]); continue; } // recurse
			if(preset[i]===undefined) { // default values take place in the preset
				if(typeof(d)=='string') preset[i] = d.slice(0); // string is copied, preventing the instance to change the default string by reference
					else preset[i] = d;
			}
		}
		return preset;
	},
	apply: function(o) { // fullfills object o with members of this o_defaults object, values in object have priority
		for(var i in this) 
			if(i in A_df.prototype) continue; // no action for prototype functions
			else if(o[i]==undefined) o[i] = this[i];
		return o;
	},
	mergeto: function(o, m, startpos) { // reads arguments and make object members from them, member name is taken from defaults member name, sequence must be respected
		var a = startpos||0, v; m=m||[];
		for(var i in this) 
			if(i in A_df.prototype) continue; // no action for prototype functions
			else {
				v = m[a++]; // m can be undefined (new object relying entirely on default values)
				v = (v===undefined) ? this[i] : v; // v can be a zero number
				if(typeof this[i] == 'number') o[i] = v|0; // cast to integer	
				else {
					if(!v.replace) { console.log('A_df::arguments - ', v,o);  }
					o[i] = v.replace(/\\n/gi,newline); // back from server, cr characters are coming like \n (because they were posted like that)
					o[i] = o[i].replace(/\\(.)/mg, "$1"); // strip slashes, see (*as*)
				}
			}
		return o;
	}
}

		
		
		
		
//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//

var measureAjax = false; // execution time round around and local treatment

A_ps = function(controls, names, url, callbacks, options) { // callbacks like { onreply:A_cb, ontimeout:A_cb };
	// controls is a list like { gender:o_easyCONTROL, fname:o_easyCONTROL, lname:A_ctl, + other controls }
	// names is a list like  { gender:'gender', fname:'firstname', lname:'lastname' } <- the ones that you want to post, along with the post names
	// every control must have a .getpost() function that returns the value(s) to be posted
	// 
	this.state = A_ps.defaults.align(options||{});
	this.callbacks = callbacks || {}; 
	
	if(measureAjax) this.microperf = new microperf();
	this.timer = false;
	
	var post = new Array();
	for(controlName in names) {
		
		var control = controls[controlName];
		if(!control) continue; // no corresponding control name in the list
		
		var postName = names[controlName]; // is a string or an object containing string
		var value = control.getpost(); // is a scalar or a string, or an object containing scalars or/and strings
		
		var resolve = function(postName, value) { 
			
			if(typeof(postName)=='object') // the control posts many values, postName e.g {cin:'cueIn', out:'cueOut'} and value e.g. { in:45842600, out:45848400 }
				for(name in postName) resolve(postName[name],value[name]);
				else post.push(postName+'='+encodeURIComponent(value));
		}
		resolve(postName, value); // many objects nested should be serialized for the posting
	}
	post = post.join('&');
	this.send(url, post);
	if(measureAjax) this.microperf.cue('post sent');
}
A_ps.defaults = new A_df({timeout:20000});
A_ps.callid = {
	id: (Math.random()*10000000)|0,
	register: new Array(),
	record: function(post) { var id = ++this.id; this.register[id] = post; return id; },
	get: function(id) { if(this.register[id]) return this.register[id]; return false; },
	free: function(id) { if(this.register[id]) { delete this.register[id]; return true; } return false; }
}
A_ps.timeout = function(callid) {
	var p = A_ps.callid.get(callid);
	if(measureAjax) p.microperf.cue('timed out');
	if(!p) return false; // this feedback comes later than the server feedback
	A_ps.callid.free(callid);
	p.timeout();
	if(measureAjax) p.microperf.cue('time out feedback executed');
	if(measureAjax) p.microperf.report('for callid '+callid);
}
A_ps.feedback = function(callid, status, readyState, stream) {
	if(status == 404) return false; // target page not found
	if(status == 200) { // page found OK and replying
			var p = A_ps.callid.get(callid);
		if(!p) return false; // this feedback comes later than the timeout
		else switch(readyState) {
			case 1: if(measureAjax) p.microperf.cue('server connection established'); break; // server connection established
			case 2: if(measureAjax) p.microperf.cue('request received');  break; // request received 
			case 3: /* if(measureAjax) p.microperf.cue('processing request '); */ break; // processing request 
			case 4:
				if(measureAjax) p.microperf.cue('request finished and response is ready');
				A_ps.callid.free(callid);
				p.stream(stream); 
				if(measureAjax) p.microperf.cue('stream feedback executed');
				if(measureAjax) p.microperf.report('for callid '+callid);
				break;  // request finished and response is ready	
		}
	}
	return true;
}
A_ps.prototype = {
		send: function(url, post) {
			var http = new XMLHttpRequest();
			var callid = A_ps.callid.record(this);
			http.open("POST", url, true /*asynchronous*/);
			http.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			http.onreadystatechange = 
				function() { 
					var r = this.readyState;
					var s = (r==1||r==2)?200:this.status; 		// was introduced for MSIE8 compatibility
					var t = (r==1||r==2)?'':this.responseText; 	// was introduced for MSIE8 compatibility
					return A_ps.feedback(callid, s, r, t); 
				}
			http.send(post);
			if(this.state.timeout) this.timer = setTimeout(A_ps.timeout, this.state.timeout, callid); // ten seconds
		},
		stream: function(stream) { 
			if(this.timer) clearTimeout(this.timer);
			if(this.callbacks.onreply) this.callbacks.onreply.cb(stream);
		},
		timeout: function() { if(this.callbacks.ontimeout) this.callbacks.ontimeout.cb(); }
	}
	

	
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   A J A X    P O S T I N G    O F    A    V A L U E    T H A T    H A S    N O   C O N T R O L
//
C_iPASS = function(items) {
	this.items = items;
}
C_iPASS.prototype = { 
	activate: function() {}, 
	labelled: function(english, css) {
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td><td>'+this.items+'</td>';
	},
	set: function(items) { this.items = items; },
	getpost: function() { return this.items; },
	autonames: function() { // reproduces the names posted as being the items names by construction
		var names = {}; for(var n in this.items) names[n] = n;
		return names; 
	}, 
	value: function() { return this.items; }
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   A R R A Y S
//
arrayINVERT = function(array) { // switches values with indexes 
	var inverted = new Array();
	for(var x in array) inverted[array[x]] = x;
	return inverted;
};


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H A N D L I N G     K E Y B O A R D
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
// With this class you can:
// - Attach many handlers to the same key (e.g. ESC) for the modal and for the contextual menu on the modal
// - Attach many handlers to the same key and function (using A_cb, the right instance is called)
// - Unbind them discretionnarily (even if the same function was passed, as long as the o_callback is different)
//
// Handlers are called last added first
// Propagation is managed from handler to handler, up to the browser application
//
var modal_layer = 0;


C_KEY = function(keys, onhit, client) { // This is how you bind a callback function to a given keyboard key. Watch the return value of your call back function!
	this.onhit = onhit; 	
	var layer = modal_layer;
	if(typeof(keys) != 'object') keys = [keys];
	if(!C_KEY.register[layer]) C_KEY.register[layer] = new Array();
	
	var r = C_KEY.register[layer];
	for(var x in keys) {
		
		var key = keys[x];
		
		if(verboseOn) { // get a verbose detailed insight on what keys are associated to what event, activate verboseOn in mobframe.js and choose classOnlyVerbose = monitorFramework;
			var k = key, l = layer;
			var ctrlkey = '', keyname = '';
			var iaf = arrayINVERT(C_KEY.code.alpha);
			var inm = arrayINVERT(C_KEY.code.num);
			var isp = arrayINVERT(C_KEY.code.s);
			var ifn = arrayINVERT(C_KEY.code.F);
			var ikn = arrayINVERT(C_KEY.code.kpad.n);
			var iks = arrayINVERT(C_KEY.code.kpad.s); // console.log(bitmap(k)+' check on 2048 '+bitmap(k&2048)+' -> '+((k&2048)==2048) );
			if((k&4096)==4096) { k-=4096; ctrlkey += 'Shift+'; }
			if((k&2048)==2048) { k-=2048; ctrlkey += 'Ctrl+'; }
			if((k&1024)==1024) { k-=1024; ctrlkey += 'Alt+'; }
			if(iaf[k]) keyname = iaf[k]+' (alphanum)'
				else if(inm[k]) keyname = inm[k]+' (alphanum)'
					else if(isp[k]) keyname = isp[k]+' (special keys)'
						else if(ifn[k]) keyname = ifn[k]+' (functions)'
							else if(ikn[k]) keyname = ikn[k]+'(keypad nums)'
								else if(iks[k]) keyname = iks[k]+'(keypad specials)';
								
			if(vbs) vlog('mobframe.js','C_KEY','constructor','Layer '+l+': '+ctrlkey+keyname+' ('+key+') '+tab+client);
		}
		if(!r[key]) r[key] = new Array();
		r[key].unshift(this);
	}
	
	if(C_KEY.count++) return;
	
	// first instance only: register
	document.onkeydown = function(e) { 	return C_KEY.onkeydown(e||window.event);	} // MSIE compatibility
	document.onkeyup = function(e) { var checkCode = C_KEY.specials.check(e||window.event);	} // MSIE compatibility
}
C_KEY.prototype = {
	callback: function(keycode) {
		if(typeof(this.onhit) == 'function') return this.onhit(keycode); // genuine function
		if(typeof(this.onhit) == 'object') return this.onhit.cb(keycode); // A_cb
	}
}
C_KEY.unbind = function(keys, onhit) { // onhit is a callback function
	if(typeof(keys) != 'object') keys = [keys]; // turn single into a general case: we expect an array in general
	var r = C_KEY.register[modal_layer]; if(!r) return false; // in the current layer, there is no callback defined
	for(var x in keys) {
		var k = keys[x]; // the key for which we remove the callback
		if(!r[k]) continue; // there is no handler associated with the keyboard key, may be already removed
		else
			for(var handler in r[k])
				if(r[k][handler].onhit == onhit) { // remove the right handler
					if(vbs) vlog('mobframe.js','C_KEY','unbind','removing key '+k+' on layer '+modal_layer);
					r[k].splice(handler,1);
				}
	}
	return false;
}
C_KEY.cleanUpLayer = function() { // removes all associated callbacks from the layer
	if(vbs) vlog('mobframe.js','C_KEY','cleanUpLayer','cleaning up layer '+modal_layer);
	var r = C_KEY.register[modal_layer]; if(!r) return false; // in the current layer, there is no callback defined
	delete C_KEY.register[modal_layer];
};
C_KEY.count = 0;
C_KEY.register = new Array(); // we organize it like C_KEY.register[modal_layer][key] = C_KEY instance
C_KEY.onkeydown = function(e) {	
	var keycode = (e.keyCode) ? e.keyCode : e.which; // MSIE compatibility
	if(keycode == 16 || keycode == 17 || keycode == 18) return false;
	var checkCode = C_KEY.specials.check(e);
	var lastPropagation = true;
	var r = C_KEY.register[modal_layer]; if(!r) return lastPropagation; // in the current layer, there is no callback defined
	
		if(vbs) vlog('mobframe.js','C_KEY','onkeydown','checking '+keycode+' on layer '+modal_layer);
	if(r[checkCode]) { // some handlers are present
		for(handler in r[checkCode]) // consider many handlers for one key, starts with last added
			if(lastPropagation = r[checkCode][handler].callback(checkCode)) continue; // operate propagation !! that is where the return value of the callback function is used
			else break; // stop propagation
			if(vbs) vlog('mobframe.js','C_KEY','onkeydown','handler called, propagation is '+lastPropagation);
	}
	if(r[checkCode]) if(lastPropagation===false) { e.preventDefault(); e.stopPropagation(); }
	return lastPropagation;
}
C_KEY.code = {
	alpha:{ a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90  },
	num:{ 0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57 },
	s:{	backspace:8, tab:9, enter:13, shift:4096, ctrl:2048, alt:1024, pause_break:19, caps_lock:20, escape:27, page_up:33, page_down:34, end:35, home:36, 
		left_arrow:37, up_arrow:38, right_arrow:39, down_arrow:40, insert:45, del:46, left_window_key:91, right_window_key:92, select_key:93, 
		forward_slash:191, grave_accent:192, open_bracket:219, back_slash:220, close_braket:221, single_quote:222	},
	F:{F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123},
	kpad:{ 
		n:{0:96, 1:97, 2:98, 3:99, 4:100, 5:101, 6:102, 7:103, 8:104, 9:105 },
		s:{add:107, subtract:109, decimal_point:110, divide:111, num_lock:144, scroll_lock:145, semi_colon:186, equal_sign:187, comma:188, dash:189, multiply:106, period:190 }
	}
}
C_KEY.specials = { weight: { ctrlKey:C_KEY.code.s.ctrl, altKey:C_KEY.code.s.alt, shiftKey:C_KEY.code.s.shift }
,  state:  { ctrlKey:0, altKey:0, shiftKey:0 }
, stateSum: function() { var s=0; for(k in this.state) s+=this.state[k]; return s; }
, check: function(e) { this.set(e); e = e || window.event; var keycode = (e.keyCode) ? e.keyCode : e.which; /* MSIE compatibility */ return this.stateSum()+keycode; }
, set:function(e) { for(k in this.state) if(e[k]) this.state[k] = this.weight[k]; else this.state[k] = 0; } }
C_KEY.chars = { upperscore:'¯', underscore:'_' };




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   K E Y B O A R D     I N P U T   &   T E X T    F I E L D S
//
// © Copyright 2007-2020 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
//
//  This objects uses RegExps and is defined here because we need RegExps to be treated as utf8 at client side
//
var INPUT_TEXTAREA		= 100
var INPUT_SMSAREA 		= 101
var INPUT_EMAILAREA 	= 102
var INPUT_SUBJECT 		= 103

var INPUT_AC 		= 126 // auto complete
var INPUT_TEXT 		= 127
var INPUT_NUMER 	= 128
var INPUT_EMAIL 	= 129
var INPUT_MOBILE 	= 130
var INPUT_ALPHA 	= 131 
var INPUT_PASSWD 	= 132
var INPUT_LOGIN 	= 133
var INPUT_PHONE 	= 134
var INPUT_PRICE 	= 135
var INPUT_TOKEN 	= 136
var INPUT_BDATE 	= 137
var INPUT_ALPHANUMSTRICT = 138
var INPUT_URL 		= 139

var INPUT_MANDATORY = 250
var INPUT_OPTIONAL 	= 251


C_iEDIT = function(eid, callbacks, preset) {
	// preset is an object like { digits:'a preset string', type: INPUT_ALPHA, enabled:true, hidden:false, max:false, mandatory:false, dblclick:false }
	this.eids = { eid:eid, ui:eid+'_ui' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onfchange:, onfclear:, onffocus, onfblur, onenterkey };
	this.state = C_iEDIT.defauts.align(preset); // object like { digits:aValue, enabled:trueORfalse, hidden:trueORfalse }
	this.tooltip = false;
	if(preset.type == INPUT_LOGIN) this.logindelay = new A_cb(this, this.isLogin);
	if(preset.type == INPUT_TOKEN) this.tokendelay = new A_cb(this, this.isToken);
	this.handlers = new A_hn({
		onfocus:new A_cb(this, this.onfocus), onblur:new A_cb(this, this.onblur), 
		keypress:new A_cb(this, this.keypress), keyup:new A_cb(this, this.keyup), 
		tstart:new A_cb(this, this.tstart), tend:new A_cb(this, this.tend), tout:new A_cb(this, this.tout),
		change:new A_cb(this, this.changed), dblclick:new A_cb(this, this.dblclick), clickout:new A_cb(this, this.clickout), smplclick:new A_cb(this, this.smplclick),
		enterkey:new A_cb(this, this.onenterkey)
	});
	if(preset.type == INPUT_SMSAREA) this.state.max = preset.max | 160; // (*m11*)


	switch(this.state.type) {
		case INPUT_SMSAREA: this.state.rows = this.state.rows||5; break;
		case INPUT_EMAILAREA: this.state.rows = this.state.rows||5; break;
		case INPUT_TEXTAREA: this.state.rows = this.state.rows||4; break; // 4 is default, unless specified in the preset
		case INPUT_BDATE: this.state.digits = tobdate(this.state.digits); break;
		case INPUT_PRICE: this.state.digits/=100; this.state.digits = this.state.digits.toFixed(2); break;
	}		

}
C_iEDIT.defauts = new A_df( { 
	/* user presets */ label:'', placeholder:'', digits:'-', type:INPUT_TEXT, enabled:true, hidden:false, focus:false
						, tabindex:false, max:false, mandatory:false, loginId:0, dblclick:true
	/* internal state */, filled:false, valid: true, rows:0, dbltap:{taps:0, timer:false}, isfocused:false   } );
C_iEDIT.exclude = { always:new RegExp(/[|<>\\#"]/g) }			
C_iEDIT.prototype = {
	// public functions
	display: function(css, label, labelcss) { // return top bottom like: <div>a label</div><input>input field</input>
		
		
		var display = this.state.digits;
		
		var tabindex = (this.state.tabindex) ? ' tabindex="'+this.state.tabindex+'"' : '';
		var placeholder = (this.state.placeholder) ? ' placeholder="'+this.state.placeholder+'"' : '';
		var cssclass = css ? ' class="'+css+'"' : '';
		var textinput, type='text', pattern='', name='';
		
		switch(this.state.type) {
			case INPUT_EMAIL: if(is.appleios) { type='email'; name='name="email"'; } // problem on Chrome that does not post the field
				break; 
			case INPUT_BDATE:
				// type='date'; // unusable because of input value format generated
			case INPUT_PRICE:
			case INPUT_NUMER: 
				if(is.tactile) pattern = 'pattern="[0-9]*"'; // for soft keyboards switching, this misses the + option
				break; 
			case INPUT_PHONE: 
			case INPUT_MOBILE: 
				type='tel'; 
				// pattern = 'pattern="[0-9]*"'; // for soft keyboards switching, this misses the + option
				break; 
			default: pattern = '';
		}
		
			var autocap = ''; if(this.state.digits) autocap = 'autocapitalize="none"'; // Pops touch keyboard with or without autocap on first letter typed
		if(this.state.rows) textinput = '<textarea'+cssclass+' rows="'+this.state.rows+'" id="'+this.eids.ui+'" value="'+display+'"'+tabindex+placeholder+'>'+display+'</textarea>';
			else textinput = '<input type="'+type+'" '+name+' '+pattern+' '+cssclass+' id="'+this.eids.ui+'" value="'+display+'"'+tabindex+placeholder+' '+autocap+'/>';
		
		if(label) this.state.label = label;
		label = label?'<div class="select-header textcolor-light '+(labelcss||'')+'">'+C_XL.w(label)+'</div>':'';

		return label+textinput;
	},
	labelled: function(english, css) { // return side by side tds like: <td>a label</td><td>input field</td>
		this.state.label = english;
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td><td>'+this.display(css||'alpha16')+'</td>';
	},
	td: function(css, tdcss) { // return one td like: <td>input field</td>
		var cssclass = tdcss ? ' class="'+tdcss+'"' : '';
		return '<td'+cssclass+'>'+this.display(css||'alpha16')+'</td>';
	},
	activate: function() { // must be called after display
		
		if(vbs) vlog('mobframe.js','C_iEDIT','activate','type:'+this.state.type+', eid:'+this.eids.ui);
		this.elements.collect(this.eids);
		
		this.enable(this.state.enabled).hide(this.state.hidden).focus(this.state.focus).validate(this.digits());
		$(this.elements.ui).bind('invalid',function(){return false;});
		this.setvalidtip();
		return this;
	},
	clear: function(options) { return this.set('',options); },
	enable: function(onOff) { // can be called before or after activation
		onOff = !!onOff;
		this.state.enabled = onOff;
		if(this.elements.ui) { // that is only if the element was activated
			switch(onOff) {
				case true:
					$(this.elements.ui).removeClass('disabled').keypress(this.handlers.keypress).keyup(this.handlers.keyup); //.change(this.handlers.change);
					if(is.tactile) {
						this.elements.ui.ontouchstart =  this.handlers.tstart;
						this.elements.ui.ontouchend = this.handlers.tend;
						if(is.newtouch) $(this.elements.ui).focus(this.handlers.onfocus).blur(this.handlers.onblur);
					} else {
						$(this.elements.ui).click(this.handlers.smplclick); 
						// $(this.elements.ui).dblclick(this.handlers.dblclick); 
						$(this.elements.ui).focus(this.handlers.onfocus).blur(this.handlers.onblur);
					}
					
					break;
				case false: 
					if(is.tactile) {
						this.elements.ui.ontouchstart = undefined;
						this.elements.ui.ontouchend = undefined;
						if(is.newtouch) $(this.elements.ui).unbind('focus').unbind('blur');
					} else {
						$(this.elements.ui).addClass('disabled').unbind('keypress').unbind('keyup').unbind('click'); //.unbind('change'); // .unbind('dblclick')
						$(this.elements.ui).unbind('focus').unbind('blur');
					}
					break;
			}
			this.elements.ui.readOnly = !onOff;
		}
		return this;
	},
	hide: function(onOff) { // can be called before or after activation
		this.state.hidden = !!onOff;
		if(this.elements.ui) // that is only if the element was activated
			switch(!!onOff) {
				case true: $(this.elements.ui).hide(); break;
				case false:$(this.elements.ui).show(); break;
			}
		return this;
	},
	focus: function(set) { // can be called before or after activation
		if(vbs) vlog('mobframe.js','C_iEDIT','focus','set:'+set+', eid:'+this.eids.ui);
		this.state.focus = !!set;
		if(is.tactile&&!is.newtouch) return this; // no keyboard invasion on iPads, except for the new smartphone interface where we want the keyboard to appear
		// if(is.tactile) return this; // no keyboard invasion on iPads, except for the new smartphone interface where we want the keyboard to appear
		if(this.elements.ui)  {
			if(this.state.focus) {
				$(this.elements.ui).focus(); // that is only if the element was activated
				this.elements.ui.selectionStart = this.state.digits.length; // put the caret at the end
				this.elements.ui.selectionEnd = this.state.digits.length; // put the caret at the end
			}
			else { $(this.elements.ui).blur(); /*console.log('blurred '+this.eids.ui)*/ }
		}
		return this;
	},
	blur: function() { return this.focus(false); },
	addClass: function(css) { $(this.elements.ui).addClass(css); return this; },
	removeClass: function(css) { $(this.elements.ui).removeClass(css); return this; },
	set: function(digits, options) { // options like { propagate:false }
			options = options||{ propagate:true };
		// console.log('C_iEDIT::set '+digits);
		this.ui(digits);
		if(options.propagate) this.changed(); 
			else this.state.digits = digits;
		return this;
	},
	mandatory: function(onOff) {
		this.state.mandatory = !!onOff;
		this.validate(this.state.digits);
		this.setvalidtip();
	},
	placeholder: function(ph) {
		this.state.placeholder = ph;
		if(this.elements.ui) this.elements.ui.placeholder = ph;
	},
	insert: function(i) { // does not change the caret position
		var el = this.elements.ui;
		// var caretPosition = el.selectionEnd;
		var caretPosition = this.caretPosition();
		var textBefore = el.value.substring(0,caretPosition);
		var textAfter = el.value.substring(caretPosition);
		var newText = textBefore + i + textAfter;
		if(this.state.type == INPUT_SMSAREA) if(this.remains(newText).over) return;
		el.value = newText; // enough room for this tag, insert it
		// el.focus();
		// el.selectionEnd = caretPosition+i.length;
		this.setCaret(caretPosition+i.length);
		this.changed();
	},
	valid: function() {
		return this.state.valid;
	},
	getpost: function() { 
		switch(this.state.type) {
			case INPUT_BDATE: return this.frombdate(this.state.digits);
			case INPUT_PRICE: return ((this.state.digits)*100)|0; // So we record integers 
			default: // INPUT_TEXT
				return this.state.digits; 
		}			
	},
	value: function() { return this.getpost(); },
	isfocused: function() { return this.state.isfocused; },
	loading: function(onoff) { if(onoff) return this.addClass('loading'); else return this.removeClass('loading'); },
	busy: function(onoff) { 
		this.enable(!onoff); if(onoff) this.blur();
		if(onoff) return this.addClass('loading'); else return this.removeClass('loading'); 
	},
	setmax: function(m) { this.state.max = m; },
	
	// private
	setCaret: function(pos) { return this.setSelectionRange(pos); },
	setSelectionRange: function(selectionStart, selectionEnd) { // can be used to set the caret position if End is omitted
		selectionEnd = selectionEnd || selectionStart;
		if (this.elements.ui.setSelectionRange) { // Firefox, Webkit, Gecko
			// this.elements.ui.focus(); // (BF - removed to fix the resa dupplicate bug that let the dropdown pop up when a performance was in the to dupplicate appmt)
			this.elements.ui.setSelectionRange(selectionStart, selectionStart);
		}
		else if (this.elements.ui.createTextRange) { // MS-IE
			var range = this.elements.ui.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	},
	caretPosition: function() { // Obtain caret position through the field
		 if (this.elements.ui.selectionStart) { return this.elements.ui.selectionStart; } // Firefox, Webkit, Gecko
			else if (document.selection) // MS-IE
			{ 
				this.elements.ui.focus();
				var r = document.selection.createRange(); 
				if (r == null) { return 0; } 

				var re = this.elements.ui.createTextRange(), rc = re.duplicate(); 
				re.moveToBookmark(r.getBookmark()); 
				rc.setEndPoint('EndToStart', re); 
				return rc.text.length; 
			} 
		return 0;
	},
	ui: function(digits) {  // write in ui
		// console.log('C_iEDIT::ui ('+this.eids.eid+')'+this.elements.ui.value+' << '+digits);
		if(this.elements.ui) {
			// var caretPosition = this.elements.ui.selectionEnd;
			var caretPosition = this.caretPosition();
			this.elements.ui.value = digits;
			this.setCaret(caretPosition);
		}
		return this;
	},
	digits: function() {  // read ui
		if(this.elements.ui) return this.elements.ui.value;
		return '';
	},
	smstemplen: function(t) {	// calculates the remaining length in the field
		tokensLen = 0;
		tokens = t.match(/{\w+}/g); // identify tokens in our text (identified as {words} inside curlies)
		for(var x in tokens) {
			switch(tokens[x]){ // tokens have an equivalent average length
				
				case mobtags.fusion.gender: 	tokensLen += 4; break; // see M_EMLT and M_SMST (*T01*)
				case mobtags.fusion.dear: 		tokensLen += 4; break;
				case mobtags.fusion.firstname:	tokensLen += 9; break;
				case mobtags.fusion.lastname: 	tokensLen += 9; break;
				case mobtags.fusion.company: 	tokensLen += 12; break;
				case mobtags.fusion.mobile: 	tokensLen += 12; break;
				case mobtags.fusion.email: 		tokensLen += 20; break;
				case mobtags.fusion.info: 		tokensLen += 40; break;
				case mobtags.fusion.address: 	tokensLen += 40; break;
				case mobtags.fusion.registration: 	tokensLen += 9; break;
				
				case mobtags.fusion.cuein: 		tokensLen += 5; break;
				case mobtags.fusion.resadate: 	tokensLen += 8; break;
				case mobtags.fusion.resaday: 	tokensLen += 8; break;
				case mobtags.fusion.resanote: 	tokensLen += 40; break;
				case mobtags.fusion.perf: 		tokensLen += 20; break;
				case mobtags.fusion.perfnote: 	tokensLen += 60; break;
				case mobtags.fusion.bookingcode:tokensLen += 8; break;
				
				case mobtags.fusion.bcal: 		tokensLen += 15; break;
				case mobtags.fusion.fcal: 		tokensLen += 15; break;
				case mobtags.fusion.ucal: 		tokensLen += 15; break;
				case mobtags.fusion.business:	tokensLen += 15; break;
				case mobtags.fusion.participants: 	tokensLen += 60; break;
			}	
		}
		allbuttokens = t.replace(/{\w+}/g,'').length;
		return allbuttokens + tokensLen;
	},
	remains: function(t) {
		if(!t) t = this.state.digits;
		if(!this.state.max) return 1000;
		var r = this.state.max;
		switch(this.state.type) {
			case INPUT_SMSAREA:	r -= this.smstemplen(t);		break;
			default: r -= t.length; // INPUT_TEXT, accept all
		}	
		var p = r; if(r<0) p=0; // r can be negative, so to show the overflow
		return { over:(r<0)?true:false, remains:r, positive:p };
	},
	frombdate: function(digits) { // the assumed field format is YYYY-MM-DD
		var scan = this.bdateScan(digits);
		var formated = scan.y+scan.m+scan.d;
		return formated; // output format is YYYYMMDD
	},
	bdateScan: function(digits) {
	
		var valid, yyyy='', mm='', dd='';
		
		// format check
		// 
		// allows: 1963-11-01 or 1963 11 01 or 1963.11.01 or 1963/11/01
		// allows: 1963-11-01 or 1963-11-1
		//
		if (digits.search(/^\d{1,2}(\.|\/|\-| )\d{1,2}\1\d{4}$/) == -1) // checks if you respect a format like 30-12-1970 or 30/12/1970 or 30 12 1970 or 30.12.1970
			return { y:yyyy, m:mm, d:dd, valid:false, format:false }
		
		// date reality check
		var parts;
		if(digits.search(/\//) != -1) parts = digits.split('\/');
			else if(digits.search(/\./) != -1) parts = digits.split('.');
			else if(digits.search(/\-/) != -1) parts = digits.split('-');
			else if(digits.search(/ /) != -1) parts = digits.split(' ');
			
				var dd = parts.shift();
				var mm = parts.shift(); if(mm.length==1) mm = '0'+mm;
				var yyyy = parts.shift(); if(dd.length==1) dd = '0'+dd;
			var ymd = yyyy+'-'+mm+'-'+dd;

			// var date = new Date(ymd); // will not work on MSIE
		var date = new Date(1,1,2000); date.setSeconds(0); date.setFullYear((yyyy|0)); date.setMonth((mm|0)-1); date.setDate((dd|0));
		
			var validdate = date.isvalid(yyyy,mm,dd); // not only the format must be ok, but the date itself must exist in the calendar
		return { y:yyyy, m:mm, d:dd, valid:validdate, format:true }
	},
	
	// private events handling
	keypress: function(e) { // this function returns a propagation true or false => lets the character appear in the field, or don't

		if(!this.state.enabled) { return false; }
			
			var key = e.which; // key code - Netscape/Firefox/Opera
			var keyraw = C_KEY.specials.check(e);
			var ctrlon = !!(keyraw&C_KEY.code.s.ctrl);
		if(key==C_KEY.code.s.backspace || key==0 || ctrlon) return true; // delete left arrow right arrow tab => key == 0, and ctrl combinaisons are accepted
		
		var ch = String.fromCharCode(key); // the string character version of the key code
					var el = this.elements.ui;
				var caretPosition = el.selectionEnd;
			var textBefore = this.state.digits.substring(0,caretPosition);
			var textAfter = this.state.digits.substring(caretPosition);
		var newtxt = textBefore + ch + textAfter;
		
		if(this.remains(newtxt).over) return false; // no room for anymore character, according to this.state.max setting
		if(!ch.search(C_iEDIT.exclude.always)) return false; // those characters are NEVER accepted through our forms
		
		var pattern = false;
		switch(this.state.type) {
			case INPUT_MOBILE: 			
			case INPUT_PHONE: 			pattern = new RegExp(/[0-9+]/); break;
			case INPUT_NUMER: 			pattern = new RegExp(/[0-9]/); 	break;
			case INPUT_BDATE:			pattern = new RegExp(/[0-9]/); 	break;
			case INPUT_PRICE: 			pattern = new RegExp(/[.0-9]/); break;
			case INPUT_EMAIL: 			pattern = new RegExp(/[._a-zA-Z0-9-@]/); 				break;
			case INPUT_ALPHA: 			pattern = new RegExp(/[ ,._a-zA-Z0-9çéèëêôîïûü\-@]/); 	break;
			case INPUT_ALPHANUMSTRICT: 	pattern = new RegExp(/[_a-zA-Z0-9]/); 					break;
			case INPUT_LOGIN: 			pattern = new RegExp(/[_a-zA-Z0-9éèëêôîïû@]/); 			break;
			case INPUT_TOKEN: 			pattern = new RegExp(/[a-z0-9]/); 						break;
			case INPUT_URL: 			pattern = new RegExp(/[.:a-zA-Z0-9\:\/\?\&=]/); 		break;
			case INPUT_AC: 				pattern = new RegExp(/[ ,.'\/\-A-Za-z0-9çéèëêôîïûü]/); 	break;
			case INPUT_SMSAREA:			
			default: // INPUT_TEXT, accept all
		}	
		if(pattern) if(!pattern.test(ch)) { console.log('in your ass',this.state.type,ch); return false; } // the key pressed is a prohibited character
		
		if(this.state.type==INPUT_AC) { // special treatment here:
			if(newtxt.length==1) if(/[', .\-]/.test(ch)) return false; // no leading space, dot, coma or minus
			if(/, /.test(newtxt)) return true; // allows to type Isaac, Newton
			if(/[', .\-]{1,}[', .\-]{1,}/.test(newtxt)) return false; // any of [ ,.\-] may not be followed by any of [ ,.\-]
		}
		if(this.state.type==INPUT_MOBILE) { // special treatment here:
				var localCC = '32';
			if(localCC!=352&&localCC!=1) // For Luxembourg and North america (USA and Canada): people are used to enter no trunk number
				if(newtxt[0]!='0' && newtxt[0]!='+')  { return false; } // you must place a 0 or a + at the beginning of your mobile number
			if(/[+0123456789]{1,}[+]{1,}/.test(newtxt))  { return false; } // any of [digits] may not be followed by a new +
		}
		if(this.state.type==INPUT_BDATE) { // special treatment here:
			
			var v = el.value+ch;
			if(v.length==1) if(/[456789 .\-]/.test(ch)) return false; // no leading space, dot, coma or minus, nor 456789 (month day number)
			if(v.length==4) if(/[23456789 .\-]/.test(ch)) return false; // no leading space, dot, coma or minus, nor 23456789 (month number)
			if(v.length==7) if(/[03456789 .\-]/.test(ch)) return false; // no space, dot, coma or minus, nor 456789 (month day number)
			
			var se = 0; // automatic insertion of delimiter characters
			if(v.length==2 && this.state.digits.length<=1) { se = 3; };
			if(v.length==5 && this.state.digits.length<=4) { se = 6; };
			if(se) {
				el.value = (v+'-');
				el.selectionStart = el.selectionEnd = se; 
				return false;
			}
		}
		return true;
	},
	keyup: function(e) { // this event is triggered after the character appeared in the input field
			var key = e.which; // key code - Netscape/Firefox/Opera
		
		if(key>=16 && key<=46 && key!=32) return false; // do not trigger the change function for ctrl keys (32 is the space key, which must trigger a format check)
			
				var keyraw = C_KEY.specials.check(e);
			var paste = keyraw==(C_KEY.code.s.ctrl+C_KEY.code.alpha.v); // Note that AltGr = C_KEY.code.s.ctrl + C_KEY.code.s.alt
		this.changed(paste);
	},
	dblclick: function(e) {  
		if(!this.state.dblclick) return; // does nothing if the double click feature is disabled (e.g. useful for notes fields, see C_iNOTE)
		this.ui('').changed();
		if(this.callbacks.onfclear) var returnvalue = this.callbacks.onfclear.cb();
		// this.focus(true);
		return returnvalue;
	},
	smplclick: function(e) {  
		if(++this.state.dbltap.taps >= 2) { return this.dblclick(); /* double click */ }
		if(this.state.dbltap.timer) clearTimeout(this.state.dbltap.timer);
			var tout = this.handlers.clickout;
		this.state.dbltap.timer = setTimeout(tout, 500);
		return true; 
	},
	clickout: function() {
		if(this.state.dbltap.taps == 1) if(this.callbacks.onfclick) this.callbacks.onfclick.cb();
		this.state.dbltap.taps = 0;
	},
	validate: function(newdigits) { // validates in function of content and mandatory setting
		this.state.filled = newdigits != '';
		this.state.valid = true;
		switch(this.state.type) {
			case INPUT_EMAIL: 	this.state.valid = this.isEmail(newdigits);	break;
			case INPUT_URL: 	this.state.valid = this.isURL(newdigits);	break;
			case INPUT_BDATE:	this.state.valid = this.isBdate(newdigits);	break;
			case INPUT_PRICE: 	this.state.valid = this.isPrice(newdigits);	break;
			case INPUT_MOBILE: 	this.state.valid = this.isMobile(newdigits); break;
			case INPUT_PHONE: 	this.state.valid = this.isPhone(newdigits); break;
			case INPUT_LOGIN: 	this.state.valid = false; this.logindelay.dcb(600, newdigits); break;
			case INPUT_TOKEN: 	this.state.valid = false; this.tokendelay.dcb(600, newdigits); break;
		}
		if(this.state.mandatory) if(!this.state.filled) { this.state.valid = false; }
		return this;
	},
	changed: function(paste) { 
		
		if(paste===true) {
			this.ui(this.digits().replace(C_iEDIT.exclude.always,'')); // covers a copy/paste operation, that does not loop via keypress
			var pattern = false;
			switch(this.state.type) {
				case INPUT_MOBILE: 			
				case INPUT_PHONE: 			pattern = new RegExp(/[^0-9+]/g); 	break;
				case INPUT_NUMER: 			pattern = new RegExp(/[^0-9]/g); 	break;
				case INPUT_BDATE:			pattern = new RegExp(/[^0-9-]/g); 	break;
				case INPUT_PRICE: 			pattern = new RegExp(/[^.0-9]/g); 	break;
				case INPUT_EMAIL: 			pattern = new RegExp(/[^._a-zA-Z0-9-@]/g); 				break;
				case INPUT_ALPHA: 			pattern = new RegExp(/[^ ,._a-zA-Z0-9çéèëêôîïû\-@]/g); 	break;
				case INPUT_ALPHANUMSTRICT: 	pattern = new RegExp(/[^_a-zA-Z0-9]/g); 				break;
				case INPUT_LOGIN: 			pattern = new RegExp(/[^_a-zA-Z0-9éèëêôîïû@]/g); 		break;
				case INPUT_TOKEN: 			pattern = new RegExp(/[^a-z0-9]/g); 					break;
				case INPUT_URL: 			pattern = new RegExp(/[^.a-zA-Z0-9\:\/\?\&=]/g); 			break;
				case INPUT_AC: 				pattern = new RegExp(/[^ ,.'\/\-A-Za-z0-9çéèëêôîïû]/g); break;
				case INPUT_SMSAREA:			
				default: // INPUT_TEXT, accept all
			}	
			if(pattern) { 
				
				var cleanedup = this.digits().replace(pattern,'');
				this.ui(cleanedup); 
			}
		}
		
		var newdigits = this.digits();
		var changed = this.state.digits != newdigits;
		this.validate(newdigits);
		
		if(changed) { 
			this.state.digits = newdigits;
			
			if(this.callbacks.onfchange) {
				var statereport = { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
				this.callbacks.onfchange.cb(newdigits, statereport);
			}
			this.setvalidtip();
		}
		return true;
	},
	setvalidtip: function() {
				
		if(this.tooltip) { this.tooltip.remove(); this.tooltip = false; }
		$(this.elements.ui).removeClass('validNOK').addClass('validOK');
		
		var msg = false; 
		if(!this.state.valid)
					switch(this.state.type) {
						case INPUT_EMAIL: 	msg = 'not email'; break;
						case INPUT_MOBILE: 	msg = 'not mobile'; break;
						case INPUT_PHONE: 	msg = 'not phone'; break;
						case INPUT_NUMER: 	msg = 'not numeric'; break;
						case INPUT_BDATE: 	msg = 'not bdate'; break;
						case INPUT_PRICE: 	msg = 'not price'; break;
						case INPUT_ALPHA: 	msg = 'not alpha'; break;
						case INPUT_TOKEN: 	msg = 'bad e-url'; break;
						case INPUT_URL: 	msg = 'not url'; break;
						case INPUT_LOGIN: 	msg = 'bad login'; break;
						case INPUT_PASSWD: 	msg = 'not pass'; break;
					}	
		if(this.state.mandatory)
			if(!this.state.filled) { msg = 'not filled in'; }
					
		if(msg)	{ // see if we set some new warning
			$(this.elements.ui).addClass('validNOK').removeClass('validOK');
			// console.log(msg);
			// this.tooltip = new C_iTIP(this.eids.ui, { text:msg, css:'warning', offset:{x:-38, y:0}} );
			// this.tooltip.activate();
		}
	},
	onfocus: function() { 
		if(vbs) vlog('mobframe.js','C_iEDIT','onfocus event','eid:'+this.eids.ui);
		
		if(!this.state.isfocused) if(this.callbacks.onffocus) this.callbacks.onffocus.cb(this); // callback called only when entering from a non focused state
		this.state.isfocused = true;
		if(this.callbacks.onenterkey) {
			C_KEY.unbind(C_KEY.code.s.enter, this.handlers.enterkey, 'C_iEDIT::'+this.eids.eid); // in some circumstances, onfocus() triggers twice for the same field
			new C_KEY(C_KEY.code.s.enter, this.handlers.enterkey, 'C_iEDIT::'+this.eids.eid);
		}
	},
	onblur: function() { 
		this.state.isfocused = false;
		if(this.callbacks.onfblur) this.callbacks.onfblur.cb(this);
		if(this.callbacks.onenterkey) {
			C_KEY.unbind(C_KEY.code.s.enter, this.handlers.enterkey);
		}
	},
	onenterkey: function(keycode) { 
		if(this.callbacks.onenterkey) this.callbacks.onenterkey.cb(this.state.digits, keycode);
	},
	
	
	// touch events handling
	tstart: function(e) { 
		if(this.state.dbltap.taps) e.preventDefault(); // prevents zoom effect
		if(++this.state.dbltap.taps >= 2) { this.dblclick(); /* double tap */ return true; }
		if(this.state.dbltap.timer) clearTimeout(this.state.dbltap.timer);
			var tout = this.handlers.tout;
		this.state.dbltap.timer = setTimeout(tout, 500);
		return true; 
	},
	tend: function(e) {	return true; },
	tout: function() { 
		if(this.state.dbltap.taps == 1) if(this.callbacks.onfclick) this.callbacks.onfclick.cb();
		this.state.dbltap.taps = 0; 
	},
	
	// private format validation functions
	isLogin: function(sText) {
		if(!sText) { 
			this.state.valid = true; 
			if(this.state.mandatory) if(!this.state.filled) { this.state.valid = false; }
			this.setvalidtip(); return; 
		} // if the field is mandatory, it displays an appropriate msg
		var post = new C_iPASS(sText);
		mobminder.app.post( {post:post}, {post:'l'}, './queries/login.php', new A_cb(this,this.isLoginFree), new A_cb(this,this.isLoginFree) );
	}, 
	isToken: function(sText) {
		if(!sText) { 
			this.state.valid = true; 
			if(this.state.mandatory) if(!this.state.filled) { this.state.valid = false; }
			this.setvalidtip(); return; 
		} // if the field is mandatory, it displays an appropriate msg
		var post = new C_iPASS(sText);
		mobminder.app.post( {post:post}, {post:'l'}, './queries/token.php', new A_cb(this,this.isTokenFree), new A_cb(this,this.isTokenFree) );
	},
	isEmail: function(sText) {
		if (sText == '') return true; // entering no e-mail is also ok (up to mandatory feature to further decide)
		if (sText.search(/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\.[_a-zA-Z0-9-]{2,12}){1}$/) == -1) // 12 is the maximum length for the domain type, e.g. pascal@vanhove.europe will fit
			return false;
		return true;
	}, 
	isPrice: function(sText) {
		if (sText == '0') return true; // entering no e-mail is also ok (up to mandatory feature to further decide)
		if (sText.search(/^[0-9]{1}[0-9]*\.([0-9]{2}){1}$/) == -1)
			return false;
		return true;
	}, 
	isPhone: function(sText) {
		
		if(sText == '') return true; 	// entering no number is also ok (up to mandatory feature to further decide)
		
		// checking for allowed chars
		var split = sText.split('');
		pattern = new RegExp(/[+0-9]/);
		for(var i in split)
			if(!!split[i].search(pattern)) return false;
		
		// local format
		if(split[0]=='0') { // with trunk
			if(sText.length < 9) return false; // allowed 081.401.589   0497.401.626  
		} 
		else // without trunk
			if(sText.length < 6) return false; // For Luxembroug: people are used to enter no trunk number + open plan, number can be like 268333

		// international format +32.2.662.1800 (belgium) +48.518.758.709 (poland)
		//
		if(split[0]=='+') { 
			split.shift(); 	// the + sign may only head the field
			if(sText.length <= 10) 	return false; // in case you specify a +, the length must be 10 at least (international format)
		}
		return true;
	},
	isMobile: function(sText) {
		if(sText == '') return true; // entering no number is also ok (up to mandatory feature to further decide)
		
		// S1. define some usefull function in this scope
		var prefixis = function(prefix, digits) {
			var l = prefix.length;
			return digits.substr(0, l) == prefix;
		}
		var NSNdigits = function(digits) { // National Significant Numbers, check also (*nsn*)
			
			if(prefixis('+1',digits)) return 10; // North america. E.g. Canada Quebec: +1 418 2652311
			
			if(prefixis('+216',digits)) return 8; // Tunisia: +216 yy 123456
			if(prefixis('+230',digits)) return 8; // Mauritius island: +23 [0 yyy xxxx] 
			
			if(prefixis('+352',digits)) return [6,7,8,9,10]; // Luxembourg: open plan (numbers may have whatever number of digits)
			
			if(prefixis('+370',digits)) return 8; // Lithuania: +370 686 12345
			if(prefixis('+371',digits)) return 8; // Latvia:  +371 640 12345
			if(prefixis('+372',digits)) return 8; // Estonia: +372 81xx xxxx
			if(prefixis('+373',digits)) return 8; // Moldova: is an exception inside the +37, it has 8 NSN digits

			// Italy (the big mess :)
			if(prefixis('+39335', digits)) return [9,10]; // TIM mobile Italy, mobiles like +39 3xx 123456 (older assigned numbers, today all assigned numbers have 10 digits)
			if(prefixis('+393',digits)) return 10; // Most general case Italy, mobiles like +39 3xx 1234567
			
			if(prefixis('+43660',digits)) return 10; // +43 is for Austria, they have 10 NSNs in Cell phones like +43 660 1234567
			if(prefixis('+43',digits)) return 11; // +43 is for Austria, they have 11 NSNs in Cell phones like +43 699 11223344
			if(prefixis('+44',digits)) return 10; // +44 is the UK, they have 10 NSN
			if(prefixis('+45',digits)) return 8; // +45 is denmark mobile phones are like +45 20 123456
			
				if(prefixis('+4915',digits)) return 11; // +49 is Germany, they have 11 NSN in the 015 mobile prefixes
				if(prefixis('+49176',digits)) return 11; // +49 is Germany, they have 11 NSN in the 0176 mobile prefixes
				if(prefixis('+491609',digits)) return 11; // +49 is Germany, they have 11 NSN in the 01609 mobile prefixes
			if(prefixis('+49',digits)) return 10; // +49 is Germany, they have 10 NSN in regular 017 and 016 numbers
			
			if(prefixis('+601',digits)) { // Malaysia mobile network
				if(prefixis('+6010',digits)) return 8; // DiGi, XOX, Tune Talk
				if(prefixis('+6011',digits)) return 8; // 
				if(prefixis('+6012',digits)) return 8; // Maxis
				if(prefixis('+6013',digits)) return 8; // Celcom +601 3 2752685
				if(prefixis('+6014',digits)) return 8; // 
				if(prefixis('+6015',digits)) return 8; // Celcom / DiGi
				if(prefixis('+6016',digits)) return 8; // DiGi
				if(prefixis('+6017',digits)) return 8; // Maxis
				if(prefixis('+6018',digits)) return 8; // U Mobile
				if(prefixis('+6019',digits)) return 8; // Celcom
			}
			if(prefixis('+687',digits)) return 6; // New Caledonia numbers like +687 123 456
			
			if(prefixis('+90',digits)) return 10; // Turkey, mobiles like +90 533 1234567 (533 is the operator code, but portability is present)
			if(prefixis('+9617',digits)) return 8; // Lebanon, mobiles like +96170 123456
			if(prefixis('+9613',digits)) return 7; // Lebanon, mobiles like +961 36 12345
			
			// They fit in standard 2 + 9, or 3 + 9
			//
			// Greece +30 1 1234 1234
			// Netherland +31 06 123 1234
			// spain +3471 123 1234
			//
			//
			
			return 9; // that is the standard, e.g.  497 401626 considering CC being 2 digits, we come to 9 + 2 digits in total in a number like +32 123 456789
			// => So a standard number has 12 or 13 digits in total (including heading +). 13 when CC is 3 digits, 12 if CC is 2 digits.
		}
		var CCdigits = function(digits) { // International Country codes
		
			// Mobile numbers are made of: 
			// 		Country code: 2 or 3 digits (3 digits for smaller countries) (CC)
			//  	+ National Significant number: 8 or 9 or 10 digits (NSN)
			// Generally, NSN is 9 digits.
			
			// Zone 1 – USA
			if(prefixis('+1',digits)) return 1; // North america
			
			// Zone 3&4 – Europe
			if(prefixis('+35',digits)) return 3; // Gibraltar, Portugal, Luxembourg, Ireland, Iceland, Albania, Finland, Malta, Cyprus,  Iceland, Bulgaria
			if(prefixis('+37',digits)) return 3; // Lithuania, Latvia, Estonia, Moldova, Armenia, Belarus, Andorra, Monaco, San Marino, Vatican
			if(prefixis('+38',digits)) return 3; // Balkans: Croatia, Macedonia, Montenegro, Serbia, Slovenia, Ukraine,
			
			if(prefixis('+42',digits)) return 3; // Czech republic, Slovakia, Liechtenstein 
			
			// Zone 2 – Africa
			if(prefixis('+21',digits)) return 3; // Tunisia 216, 
			if(prefixis('+22',digits)) return 3; // 
			if(prefixis('+23',digits)) return 3; // Mauritius Island 230, 
			if(prefixis('+24',digits)) return 3; // 
			if(prefixis('+25',digits)) return 3; // 
			if(prefixis('+26',digits)) return 3; // 
			if(prefixis('+29',digits)) return 3; // 
			
			// Zone 5 – Latin America (mostly) // +51 to +58 have 2 digits
			if(prefixis('+50',digits)) return 3; // 
			if(prefixis('+59',digits)) return 3; // 
			
			// Zone 6 – Asia // +60 to +66 have 12 digits
			if(prefixis('+60',digits)) return 3; // +601 for Malaysia mobile network
			if(prefixis('+67',digits)) return 3; // 
			if(prefixis('+68',digits)) return 3; // +687 for New Caledonia
			if(prefixis('+69',digits)) return 3; // 
			
			// Zone 8 – Eurasia (former Soviet Union) // +800 is international freephone, 81 to 84 have 2 digits
			if(prefixis('+85',digits)) return 3; // 
			if(prefixis('+86',digits)) return 3; // 
			if(prefixis('+87',digits)) return 3; // 
			if(prefixis('+88',digits)) return 3; // 
			
			// Zone 9 – Central, South and Western Asia // 90 to 95, and 98 have 2 digits
			if(prefixis('+96',digits)) return 3; // 961:Lebanon
			if(prefixis('+97',digits)) return 3; // 
			if(prefixis('+99',digits)) return 3; // 
			
			return 2; // 2 CC digits is for all other bigger countries
		}
		
		// S2. now count the expected number of digits
		var split = sText.split('');
		var header = split[0];
		var trunk, cc, nsn, n, match = false, l = sText.length;
		var localCC = '32';
		switch(header) {
			case '+': trunk=1; cc=CCdigits(sText); nsn=NSNdigits(sText); break; // input like +32497123456
			case '0': trunk=1; cc=0; nsn=NSNdigits(localCC+sText.substr(1)); break; // input like 0493123456, we remove the trunk zero and put the local CC (e.g. +32) in front
			default: trunk=0; cc=0; nsn=NSNdigits(localCC+sText); break; // input without trunk nor international code, like 497123456
		}
			// console.log('Trunk:'+trunk+', CC:'+cc+', NSN:'+nsn);
		if(nsn==0) return true; // open numbering plan... everything is agreed
		
		if(!nsn.length) nsn = [nsn]; // not an array? make it an array. 
		while(n = nsn.shift()) {
			var expected = trunk + cc + n;
			if(l == expected) match = true; // compares entered text length with expected 
		}
		if(!match) return false;
		return true;
	},
	isBdate: function(sText) {
		if (sText == '') return true; // entering no e-mail is also ok (up to mandatory feature to further decide)
		return this.bdateScan(sText).valid;
	},
	isNumber: function(sText) {
		if (sText == '') return true;
		if (sText.search(/(^-*\d+$)|(^-*\d+\.\d+$)/) == -1) return false;
		return true;
	}, 	
	isURL: function(sText) {
		if (sText == '') return true; // entering no url is also ok (up to mandatory feature to further decide)
		if (sText.search(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,60})\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/) == -1) // different from URL in Mobminder webapp mobframe.js
			return false;
		return true;
	}, 
	
	// ajax feedback handling
	isLoginFree: function(dS, stream) { // stream is 0 or the id of an existing login
		this.state.valid = false;
		stream = stream.split('#').shift();
		if(stream) { // login is authorized when not in use yet, or when in use by this same loginId
			var ids = stream.split('!');
			for(var x in ids) { var id = ids[x]; if(id == this.state.loginId) { this.state.valid = true; break; } } // allows multiple identical login names
		} else this.state.valid = true; // the login name is not used yet
		this.setvalidtip();
	},
	isTokenFree: function(dS, stream) { // stream is 0 or the id of an existing login
		this.state.valid = false;
		if(stream) { // login is authorized when not in use yet, or when in use by loginId
			if(stream == this.state.loginId) this.state.valid = true;
			if(stream == 0) this.state.valid = true;
		}
		this.setvalidtip();
	}
}
C_iEDIT.ergophone = function(phonenumber,splicing) {
		var l = phonenumber.length;
		var m = phonenumber;
		if(splicing==2) m = m.splice(l++-(splicing*3+3), 0, ' '); // makes it +33 623 12 34 56, or +32 493 111 222
		var m = m.splice(l++-(splicing*3), 0, ' ');
		    m = m.splice(l++-(splicing*2), 0, ' ');
		    m = m.splice(l++-(splicing*1), 0, ' ');
		return m;
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C L I C K  /  T O U C H    A C T I V E      E L E M E N T  
//
//   preset.tag defines what element is displayed: span, td, div, li, a or input 
//
function C_iCLIK(eid, callbacks, preset) {
	this.classname = 'C_iCLIK';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { down:, up:, click:, hold:, dblclick:, hover:, gone: }
	this.state = C_iCLIK.defaults.align(preset);
		var p = this.state.value?('_'+this.state.value):''; // eids postfix
	this.eids = { eid:eid, ui:eid+'_ui'+p, wrapme:eid+'_wrp'+p };
	this.handlers = new A_hn(
		{	/* mouse */ down:new A_cb(this, this.down), up:new A_cb(this, this.up), enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), leavehover:new A_cb(this, this.leavehover),
			/* touch */ tstart:new A_cb(this, this.tstart), tend:new A_cb(this, this.tend), tout:new A_cb(this, this.tout),
			/* keyboard */ keys:new A_cb(this, this.keys), // custom keyboard keys
			/* for input types */ onfocus:new A_cb(this, this.onfocus), onblur:new A_cb(this, this.onblur), enterkey:new A_cb(this, this.enterkey) }
	);
	if(this.state.tip) {
		if(typeof(this.state.tip)==='string')
			this.state.tip = new C_iTIP(this.eids.ui, {text:this.state.tip, css:'tip'}); // easy case, some text was passed, to be displayed in standard tip format
		else
			if(typeof(this.state.tip)==='object')
				if(this.state.tip.text&&this.state.tip.css)
					this.state.tip = new C_iTIP(this.eids.ui, this.state.tip); // a tip preset like { text:'blabla' ans css:'sticker-tip'} was passed
	}
	// if(vbs) vlog('controls.js','C_iCLIK','constructor','eid:'+eid);
	this.is = { button:(this.state.tag=='button'), input:(this.state.tag=='button'||this.state.tag=='input') }
}
C_iCLIK.defaults = new A_df( { 
	  idle:false, // allows a non css disabled control that still is idle
	  enabled:true, // idle and css disabled
	  hidden:false, visible:true, tag:'a', ui:'', keys:false, tip:false, css:'', style:'', colspan:0
	, value:undefined // a correlator that is used by the higher level to identify this object
	, highlight:false, selected:false, section:false, sign:false, indent:0 /* left indent must be given in units of em */
	, hoverdelay:0
	, /* state machine */ down:false
} );
C_iCLIK.state = { down:false, hold:false, dbltap:{taps:0, timer:false}, x:0, y:0, // static status, unique reference for all iCLICK instances
				hover:{ timer:false, hovered:false, eid:false }
		};  
C_iCLIK.inhibit = function() { C_iCLIK.state.down = false; }; // down contains pointer to the o_iCLIK under focus
C_iCLIK.isongoing = function() { return C_iCLIK.state.down; };

C_iCLIK.touchmove = function(e) { // Cancel the click/select action when the finger moves on the screen
	
	if(!C_iCLIK.state.down) return true; // we propagate to the normal scroll behaviour
	var point = e.touches ? e.touches[0] : e;
	var deltaX = point.pageX-C_iCLIK.state.x, deltaY = point.pageY-C_iCLIK.state.y;
	var Xsq = deltaX * deltaX, Ysq = deltaY * deltaY;
	var far = (Xsq + Ysq) > 100;
	if(far)
		C_iCLIK.state.down = false; // cancel the single touch when you seem to be in a scroll process
	return true;
};
if(is.tactile) window.addEventListener('touchmove', C_iCLIK.touchmove, false);

C_iCLIK.prototype = {
	// public
	display: function(css, rowspan, tag) {
	
		tag = tag || this.state.tag;
		if(css) this.state.css = css; 
		css = css||this.state.css||'click-default';
		if(this.is.button) css = 'button '+css;
		
		var id  = ' id="'+this.eids.ui+'"'; // not used for tag 'input'
		var clss  = ' class="click '+css+'"'; // not used for tag 'input'
		var indent = ''; if(this.state.indent) indent = ' padding-left:'+this.state.indent+'em;';
		var style  = ' style="cursor:pointer; '+this.state.style+indent+'"'; // not used for tag 'input'
		var bullet = ''; if(this.state.section) { if(this.state.section===true) bullet = ''; else bullet = this.state.section+'&nbsp;'; }
		var sign = ''; if(this.state.sign) sign = '<div style="display:inline-block;" class="fa fa-lefter fa-11x fa-'+this.state.sign+'"></div>';
		var label = bullet+sign+this.state.ui;
		
		rowspan = rowspan ? ' rowspan='+rowspan : '';
		switch(tag) {
			case 'td': case 'th': 
				style = ' style="white-space:nowrap; '+this.state.style+indent+'"';
				var cs = this.state.colspan?' colspan='+this.state.colspan:'';
				return '<'+tag+rowspan+cs+' '+id+style+clss+'>'+label+'</'+tag+'>'; 
			
			case 'span': case 'div': case 'li': 
				return '<'+tag+id+style+clss+'>'+label+'</'+tag+'>';
				
			case 'button': var type = ' type="button"';
			case 'input':
				return bullet+sign+'<input'+(type||'')+style+clss+' id="'+this.eids.ui+'" value="'+this.state.ui+'" readonly="readonly"/>';
				
			default: return '<a'+id+style+clss+'>'+label+'</a>';
		}
	},
	activate: function() {
		this.elements.collect(this.eids);
		if(this.elements.ui) { // do nothing if this control was not displayed
			if(this.state.selected) this.select(this.state.selected);
			if(this.state.highlight) this.highlight(this.state.highlight);
			if(this.state.hidden) this.hide(this.state.hidden);
			if(!this.state.visible) this.visible(this.state.visible);
			if(this.state.tip) this.state.tip.activate();
			if(this.state.section) { this.state.idle= true; this.section(this.state.section); } // keep this line at bottom of sequence
			this.enable(this.state.enabled);
		}
	},
	lock: function(locked) { return this.enable(!locked); },
	set: function(html, css, options) {
		
		// html
		if(html!==false) {
			this.state.ui = html;
			if(this.elements.ui)
				switch(this.state.tag) {
					case 'input': case 'button': this.elements.ui.value = html; break;
					default: this.elements.ui.innerHTML = html;
				}
		}
		// css  // version for is.newtouch => has a side effect on C_iONOFF...
		// if(css) {
			// this.state.css += ' '+css;
			// if(this.elements.ui)
				// $(this.elements.ui).removeClass().addClass(this.state.css);	
		// }
		
		// css
		if(css) 
			$(this.elements.ui).removeClass().addClass(this.state.css+' '+css);	
		
		return this;
	},
	caption: function(html) { if(html!==undefined) this.set(html); return this.state.ui; }, // equivalent to this.set(), but more readable when C_iCLIK is used as a button
	setvalid: function(onoff) {
		if(onoff) $(this.elements.ui).removeClass('validNOK').addClass('validOK');
		else $(this.elements.ui).addClass('validNOK').removeClass('validOK');
	},
	element: function() {
		return this.elements.wrapme || this.elements.ui;
	},
	value: function() { return this.state.value; },
	hidden: function() { return this.state.hidden; },
	focus: function() {
		if(this.is.input) if(this.elements.ui) $(this.elements.ui).focus();
		return this;
	},
	blur: function() {
		if(this.is.input) if(this.elements.ui) $(this.elements.ui).blur();
		return this;
	},
	
	// PUBLIC: modify the style and / interactivity
	enable: function(onoff) { // enable/disable, when disabled, the control is grayed
		this.state.enabled = !!onoff;
	
		// if(vbs) vlog('controls.js','C_iCLIK','enable','enable:'+onOff);
		if(this.state.enabled) $(this.elements.ui).removeClass('disabled');
			else { 
				$(this.elements.ui).addClass('disabled'); 
				if(this.state.tip) this.state.tip.quit();
			}
			
			// now set interactivity on or off
			// a disabled element is css grayed and not interactive
			// an idle element is not grayed but still not interactive
			// a not disabled and not idle element has interactivity
			// 
		return this.active();
	},
	busy: function(onoff) { // ui field appears "busy"
		if(!this.elements.ui) return this; // not yet activated
		if(this.is.button) {
			$(this.elements.ui).removeClass('button-busy').attr('value', this.state.ui); // animation centered in the field
			if(onoff) $(this.elements.ui).addClass('button-busy').attr('value', ' ');	
		} else {
			if(onoff) $(this.elements.ui).addClass('loading'); // animation at the right hand of the field
			else $(this.elements.ui).removeClass('loading');
		}
		return this;
	},
	highlight: function(on) { // adds a css and remembers the status
		if(on) $(this.elements.ui).addClass('highlight'); 
			else $(this.elements.ui).removeClass('highlight'); 
		this.state.highlight = on;
		return this;
	}, 
	select: function(on) { // adds a css and remembers the status
		if(on) $(this.elements.ui).addClass('selected'); 
			else $(this.elements.ui).removeClass('selected'); 
		this.state.selected = on;
		return this;
	},
	hide: function(hidden) { 		
		var eltohide = this.elements.wrapme || this.elements.ui; // when defined, we hide the wrapper of the label (e.g. a table td) instead of the label div. This prevents having empty td's in a a table, they take room on the screen.
		if(hidden) $(eltohide).hide(); else $(eltohide).show(); this.state.hidden = hidden; 
		return this; 
	}, 
	visible: function(visible) { 		
		var eltohide = this.elements.wrapme || this.elements.ui; // when defined, we hide the wrapper of the label (e.g. a table td) instead of the label div. This prevents having empty td's in a a table, they take room on the screen.
		if(visible) eltohide.style.visibility = 'visible'; else eltohide.style.visibility = 'hidden'; this.state.visible = visible; 
		return this; 
	},
	show: function(on) { return this.hide(!on); },
	inlabel: function(regexp, options) { // highlights in label the digits given through regexp, option: elsehide
			options = options || {};
		var cleanup = new RegExp(/(<b class="match">|<\/b>)/gi); // cleans up previous highlights
		if(this.elements.ui) this.elements.ui.innerHTML = this.elements.ui.innerHTML.replace(cleanup,'');
		var where = this.state.ui.search(regexp); // returns start position
		var found = (where >= 0);
		if(found) this.elements.ui.innerHTML = RegExp.leftContext+'<b class="match">'+RegExp.lastMatch+'</b>'+RegExp.rightContext;
		if(options.elsehide) this.hide(!found);
		return found;
	}, 
	remove: function() { $(this.element()).remove(); if(this.state.tip) this.state.tip.quit(); },
	
	// PRIVATE
	section: function(issection) { // elements must exist in the DOM
		if(!this.elements.ui) return this;
		if(issection) $(this.elements.ui).addClass('section mindertext');
		return this;
	},
	active: function() { // active/idle changes interactivity but adds no css class
	
		var interactivity = (this.state.enabled && !this.state.idle);
		
		if(this.elements.undefined('ui')) return this; // control is not activated yet
		// if(vbs) vlog('controls.js','C_iCLIK','active','active:'+onOff);
		
		// handlers
		if(is.tactile) {
			this.elements.ui.ontouchstart = this.elements.ui.ontouchend = undefined;
			if(interactivity) {
				this.elements.ui.ontouchstart =  this.handlers.tstart;
				this.elements.ui.ontouchend = this.handlers.tend;
			}
		} 
		else {
			$(this.elements.ui).unbind('mousedown',this.handlers.down).unbind('mouseup',this.handlers.up).unbind('mouseenter',this.handlers.enter);
				if(this.is.input) $(this.elements.ui).unbind('focus',this.handlers.onfocus).unbind('blur',this.handlers.onblur);
			if(interactivity) {
				$(this.elements.ui).mousedown(this.handlers.down).mouseup(this.handlers.up).mouseenter(this.handlers.enter);
				if(this.is.input) $(this.elements.ui).focus(this.handlers.onfocus).blur(this.handlers.onblur);
			}
		}
		
		// keyboard
		switch(interactivity) {
			case true: if(this.state.keys) new C_KEY(this.state.keys, this.handlers.keys, 'C_iCLIK::'+this.eids.eid);	break;
			case false:	C_KEY.unbind(this.state.keys, this.handlers.keys);	break;
		}
		
		return this;
	},
	
	// intercativity events	
	onfocus: function() { // this is activated only when 
		if(this.state.enabled) new C_KEY(C_KEY.code.s.enter, this.handlers.enterkey, 'C_iCLIK::'+this.eids.eid); 
		if(vbs) vlog('controls.js','C_iCLIK','onfocus','caption='+this.state.ui+', enabled='+this.state.enabled); 
	},
	onblur: function() { 
		C_KEY.unbind(C_KEY.code.s.enter, this.handlers.enterkey); 
		if(vbs) vlog('controls.js','C_iCLIK','blur','caption='+this.state.ui+', enabled='+this.state.enabled); 
	},
	enterkey: function() { C_iCLIK.state.down = this; this.up(); }, // emulates a real click
	dblclick: function(e) {  		
		if(vbs) vlog('controls.js','C_iCLIK','dblclick','eid:'+this.eids.ui);
		if(this.callbacks.dblclick) return this.callbacks.dblclick.cb();
		return true;
	},
	down: function(e, t) { // t indicates that the interactivity comes from a touch event
		var propagate = t||false; // should be true on touch devices (slide screen) but false on mouse devices (propagates to sub html layers)
		C_iCLIK.state.down = this;
		if(typeof C_iTIP != "undefined") C_iTIP.handlers.quit(); // Quit any active tooltip
		
		$(this.elements.ui).addClass('touch-in'); 
		if(!is.tactile) $(this.elements.ui).mouseleave(this.handlers.leave); 

		if(vbs) vlog('controls.js','C_iCLIK','down','eid:'+this.eids.ui+', is.tactile:'+is.tactile);
		
		if(this.callbacks.dblclick) {
			if(++C_iCLIK.state.dbltap.taps >= 2) { 
				clearTimeout(C_iCLIK.state.dbltap.timer); // prevents single tap to fire
				C_iCLIK.state.dbltap.taps = 0; // allows next single or double taps
				propagate = this.dblclick(); /* double tap or double mouse click */ 
				return propagate; 
			}
			if(C_iCLIK.state.dbltap.timer) clearTimeout(C_iCLIK.state.dbltap.timer);
			var tout = this.handlers.tout; C_iCLIK.state.dbltap.timer = setTimeout(tout, 300);
		}
		if(this.callbacks.hold) {
			var handler = new A_hn({hold:new A_cb(this, this.held)});
			C_iCLIK.state.hold = setTimeout(handler.hold, 1200);
		}
		
		if(this.callbacks.down) propagate = this.callbacks.down.cb(this);
		return propagate;
	},
	up: function(e) {
		var propagate = true; // There should be no propagation stop on an up event, because many other controls are based on "up anywhere" on screen to stop their interactivity
		
		if(!is.tactile) $(this.elements.ui).unbind('mouseleave',this.handlers.leave); 
		$(this.elements.ui).removeClass('touch-in'); 
		
		if(vbs) vlog('controls.js','C_iCLIK','up','eid:'+this.eids.ui+', taps:'+C_iCLIK.state.dbltap.taps);
		
		if(this.callbacks.hold) { clearTimeout(C_iCLIK.state.hold); }
		if(this.callbacks.up) propagate = this.callbacks.up.cb(this);
		if(this.callbacks.click) // event is defined
			if(!this.callbacks.dblclick) { // if dblclick is defined, it has to fire in the tout() 
				if(this == C_iCLIK.state.down) { // down and up on identical DOM element
					propagate = this.callbacks.click.cb(this);
				}
				C_iCLIK.state.down = false;
				if(this.state.tip) this.state.tip.quit();
				return propagate; 
			}
		return propagate;
	},
	enter: function(e) { 
		// if(typeof C_iBUTTON != "undefined") {
			// if(C_iBUTTON.track==this) this.down(e); // in case the user re-enters the click element after hesitation (having left it).
		// }
		// else { // there was no clicking on the zone
			if(this.callbacks.hover) {
				$(this.elements.ui).mouseleave(this.handlers.leavehover); 
				C_iCLIK.state.hover.eid = this.eids.eid;
				if(this.state.hoverdelay) {
					// clearTimeout(C_iTIP.status.timer);
					clearTimeout(C_iCLIK.state.hover.timer);
						var that = this; 
					C_iCLIK.state.hover.timer = setTimeout(function() { that.delayed()}, this.state.hoverdelay);
				}
				else this.callbacks.hover.cb();
			}
		// }
	},
	leave: function() { 
		if(this.callbacks.hold) { clearTimeout(C_iCLIK.state.hold); } 
		$(this.elements.ui).removeClass('touch-in'); 
		$(this.elements.ui).unbind('mouseleave',this.handlers.leave);
		
	},
	leavehover: function() {
		if(C_iCLIK.state.hover.hovered) if(this.callbacks.gone) this.callbacks.gone.cb();
		if(C_iCLIK.state.hover.timer) clearTimeout(C_iCLIK.state.hover.timer);
		C_iCLIK.state.hover = { timer:false, hovered:false, eid:false };
		$(this.elements.ui).unbind('mouseleave',this.handlers.leavehover);
	},
	tstart: function(e) { 
		if(e.touches.length>1) return true;
		var point = e.touches ? e.touches[0] : e;
		C_iCLIK.state.x = point.pageX;
		C_iCLIK.state.y = point.pageY; 
		var touch = e.touches[0]; 
		var propagate = this.down(touch, true);
		if(!propagate) e.stopPropagation(); 
		// e.preventDefault(); // we keep this default, it lets the screen scroll when you slide your finger
		return propagate;
	},
	tend: function(e) { 
		if(e.changedTouches.length>1) return true;
		var touch = e.changedTouches[0];
		var propagate = this.up(touch);
		if(!propagate) e.stopPropagation(); 
		// e.preventDefault(); // we keep this default, it lets the screen scroll when you slide your finger
		return propagate; 
	},
	tout: function(e) { 
		if(this.callbacks.click)
			if(C_iCLIK.state.dbltap.taps == 1) {
				if(this == C_iCLIK.state.down) // down and up on identical DOM element
					this.callbacks.click.cb(this);
				C_iCLIK.state.down = false;
				if(this.state.tip) this.state.tip.quit();
			}
		C_iCLIK.state.dbltap.taps = 0; 
	},
	keys: function(keycode) {
	
		var shifton = !!(keycode&C_KEY.code.s.shift); 
		var ctrlon = !!(keycode&C_KEY.code.s.ctrl); 
		var nudekey = keycode&=(C_KEY.code.s.alt-1); // does not have the command keys (Ctrl, Alt, Shift, etc..)
		
		if(vbs) vlog('controls.js','C_iCLIK','keys','eid:'+this.eids.ui+', key:'+nudekey+', shift:'+shifton+', ctrlon:'+ctrlon);
	
		if(this.callbacks.down) this.callbacks.down.cb(this, nudekey, shifton, ctrlon);
		else if(this.callbacks.up) this.callbacks.up.cb(this, nudekey, shifton, ctrlon);
		else if(this.callbacks.click) this.callbacks.click.cb(this, nudekey, shifton, ctrlon);
		return false;
	},
	held: function() { // time out when hold interactivity is used, check this.down() 
		if(this == C_iCLIK.state.down) if(this.callbacks.hold) this.callbacks.hold.cb(this);
		C_iCLIK.state.dbltap.taps = 0;
		C_iCLIK.state.down = false;
	},
	delayed: function() {
		C_iCLIK.state.hover.hovered = true;
		if(C_iCLIK.state.hover.eid == this.eids.eid);
			this.callbacks.hover.cb(this.eids.eid);
		// else the mouse is already hovering another spot
			
	}
}



