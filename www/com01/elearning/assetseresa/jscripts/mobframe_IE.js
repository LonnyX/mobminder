
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
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T H I S    F I L E    i s    I N T E N T I O N A L Y     E N C O D E D    i n   U T F 8  !
//

	
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D E B U G G I N G     S E R V I C E
//
var measureAjax = false; // execution time round around and local treatment
var measurePlitem = false;
var measureStreaming = false;

var verboseOn = true;
var traceCallbacks = false;
var fileVerbose = false; // default: false (verbose for all controls)


////// filters for verbose function:
//
//
	//// dBaccess
var monitorDBaccess = { 0:'C_dS_trackingCC', 1:'C_dS_reservation', 2:'C_dS_resource', 3:'C_dS_context', 4:'C_dS_attendee' };
	

	//// easy & framework basics
var monitorFramework = {  0:'C_iMENU', 3:'C_KEY'}; // 0:'A_ct', 1:'A_cb', 2:'C_iMODAL',, 4:'C_iCLIK', 5:'C_iWIN', 6:'C_iBUTTON'
var monitorControls = { 0:'C_iDDWN', 1:'C_iSELECT', 3:'C_iRANGE', 4:'C_iCUE', 5:'C_iINOUT', 6:'C_iOFFD', 7:'C_iSPAN' };
var monitorCresta = { 0:'C_iCRESTA', 1:'C_iACPICK', 2:'C_iAC', 3:'C_iCLIK', 4:'C_iDDWN', 5:'C_iMENU', 6:'C_iTABLE' };
var monitorOptions = { 0:'C_iSELECT' };
var monitorTooltip = { 0:'C_iTIP' };
var monitorMenu = { 0:'C_iCLIK', 1:'C_iMENU', 2:'C_iDDWN', 3:'C_iAC' };
	

		//// application
var monitorEresa = { 0:'e_MOB', 1:'C_eSearch', 2:'C_eRESA', 3:'C_eREG', 4:'C_eVisitor', 5:'C_eCheckIn', 6:'C_iSTAFF', 7:'C_eProcess', 8:'C_iSLIDE', 9:'C_iONOFF' };


	//// synchronization
var synchro = { 0:'C_dbSynchro', 1:'C_iSYRSC', 2:'C_iSYCSS' }



////// function mode setting
//
//
	var classOnlyVerbose = monitorEresa; // (defines which filter to apply) default: false (verbose for all classes)
	var activate = 'activate';
	var functionOnlyVerbose = false; // default: false (verbose for all functions)
	
//prevent to click on browser back button
(function (w,d) {
	if(typeof(w) === 'undefined')
	throw new Error('window is undefined');
	
	w.onhashchange = function() {
	if (w.location.hash !== '!') w.location.hash = '!';
	};
	$(d).ready(function() {
	// disables backspace on page except on input fields and textarea.
	
	document.body.onkeydown = function(e) {
	let elm = e.target.nodeName.toLowerCase();
	let iseditbale = (elm == 'input' || elm == 'textarea');
	if(e.which === C_KEY.code.s.backspace && !iseditbale) {
	e.preventDefault();
	e.stopPropagation();
	}
	}; 
	
	// disable previous browser button
	w.location.href += '#';
	w.setTimeout(function() { w.location.href += '!'; }, 50);
		});
	})(window, document)




	
warning = function(file, classid, functionid, msg, more) {
	if(!verboseOn) return; // then shut up
	var combo = 'WARNING - ['+file+']'+tab+classid+'::'+functionid+'() '+msg;
	if(more) console.log(combo,more); else console.log(combo);
}

var vlogcount = 0, vbs = verboseOn;		
vlog = function(file, classid, functionid, msg, more) {
	if(!verboseOn) return; // then shut up
	if(fileVerbose) {
		if(!!file.search(fileVerbose)) return false;
	}
	let classDisplay = false;
	
	for(let x in classOnlyVerbose)
		if(classid==classOnlyVerbose[x]) classDisplay = true;
	if(traceCallbacks) if(classid=='A_cb') classDisplay = true;
		
	if(classOnlyVerbose && !classDisplay) return;
	
	if(functionOnlyVerbose) if(functionid!=functionOnlyVerbose) return;
	
	let combo = (vlogcount++)+' ['+file+']'+tab+classid+'::'+functionid+'('+msg+')';
	if(more) console.log(combo,more); else console.log(combo);
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   G E N E R I C     D E S I G N     T O O L s 
//


//////////////////////////////////////////////////////////////////////////////////////////////
//
omerge = function(o1, o2) { // o1 and o2 are object like { me:1, you:2 }, returns a new object
	var m = {};
	for(var x in o1) m[x] = o1[x];
	if(o2) for(var x in o2) m[x] = o2[x];
	return m;
}
Object.protomerge = function(child) { this.prototype = omerge(this.prototype, child.prototype) };

//////////////////////////////////////////////////////////////////////////////////////////////
//
String.prototype.remove = function(a) {
	var ax=a.replace('/','\\/'); // special chars like '/' must be escaped in regular exps
	var exp = '/'+ax+'*/gi';
	var regexp = eval('new RegExp('+exp+')');
	return this.replace(regexp,'');
}
String.prototype.between = function(a, b) { // returns what is bewteen a and b
	var ax=a.replace('/','\\/'), bx=b.replace('/','\\/'); // special chars like '/' must be escaped in regular exps
	var exp = '/(?='+ax+')(.*?)(?='+bx+')/';
	var regexp = eval('new RegExp('+exp+')');
	var where = this.search(regexp);
	if(where >= 0) return RegExp.lastMatch.remove(ax);
}
String.prototype.excise = function(a, b) { // extracts what is bewteen a and b, a and b included
	var ax=a.replace('/','\\/'), bx=b.replace('/','\\/'); // special chars like '/' must be escaped in regular exps
	var exp = '/(?='+ax+')(.*?)(?='+bx+')/';
	var regexp = eval('new RegExp('+exp+')');
	var where = this.search(regexp);
	var match = RegExp.lastMatch;
	if(where >= 0) {
		return { match:match+b, rest:this.remove(match+b) };
	}
	return { match:'', rest:this };
}
String.prototype.extract = function(tagIn, tagOut) { // same as .excise but not using complex RegExp
	
		var regExpIn = new RegExp(tagIn);
		var regExpOut = new RegExp(tagOut);
		var tagInPos = regExpIn.exec(this);
	if(!tagInPos) return { match:'', rest:this };
	
	tagInPos=tagInPos.index;
	var tagOutPos = regExpOut.exec(this);
	if(!tagOutPos) return { match:'', rest:this };
	tagOutPos=tagOutPos.index;
	
		var tagInLen = tagIn.length;
	var l = tagOutPos-tagInPos-tagInLen;
		var match = this.substr(tagInPos+tagInLen,l);
		
	return { match:match, rest:this.replace(tagIn+match+tagOut,'') }; // tags are not in the returned strings
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase()+this.slice(1);
}
String.prototype.composition = function() { // returns one of ['', 'alpha', 'alphanum', 'num']
    var is = '';
	if(!this.length) return '';
	if(this.search(/['a-zA-Zéèëêôîïû\-]/) != -1) is+= 'alpha';
	if(this.search(/[0-9]/) != -1) is+= 'num';
	return is;
}
String.prototype.htmlize = function() {
	return this.replace(/\x0A/gi,'<br/>'); // turns String.fromCharCode(10); back into an html line break
}
String.prototype.splice = function(where, remove, insert ) {
    return (this.slice(0,where) + insert + this.slice(where +remove));
};
String.prototype.stripslashes = function(){ return this.replace(/\\(.)/mg, "$1"); } // e.g. turn \" into "  (same for all escaped characters...)

function getStyle(rule, attribute){
	var CSSrules, currentRule;
	var CSSSheets = document.styleSheets;

	for(j=0;j<CSSSheets.length;j++){
	for(i=0;i<CSSSheets[j].cssRules.length;i++){
			currentRule = CSSSheets[j].cssRules[i];
			if(currentRule.selectorText==rule) {
				var value = currentRule.cssText.remove(' ').between(attribute+':',';');
				return value;
			}
		}
	}
}

function escapeRegExp(string) { // makes a regexp from a string, taking care of escaping regexp special chars
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
String.prototype.replaceAll = function(find, replace) { // iterative replace (needed because String.replace would only replace the first occurence)
  return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/*
	console.log('String.between');
	var s = '<td><css>mycss</css>hello</td>';
	console.log(tab+s.between('<css>','</css>'));
	console.log(tab+s);

	console.log('String.excise');
	var x = s.excise('<css>','</css>');
	console.log(tab+x.match);
	console.log(tab+x.rest);

	console.log('String.remove');
	console.log(tab+s.remove('css'));
*/

//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C A L L B A C K S   -  US/EU PATENT PENDING P.VANHOVE
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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
			var args = new Array(); for(x=0; x<arguments.length; x++) args.push(arguments[x]); args.unshift(delay);
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
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_df = function(defaults, depth, path) { 
	defaults = defaults||{}; 
	// debug recursivity concerns
	// var depth=depth||0; var path=path||(new Array()); path.push(defaults);
	// if(depth>6) { console.log('depth:'+depth+tab,defaults); for(x in path) console.log(tab+'path'+x+':',path[x]); throw "stop execution"; }
	
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



// var d = new A_df({ me:'pascal', you:'antoine', them:new A_df({him:'lucas',her:'lily'}) });
// var s = d.align({me:'me', them:{him:'him'}});
// console.log(s);

//////////////////////////////////////////////////////////////////////////////////////////////
//
//      R E C U R S I V E   R E G I S T E R S  -  US/EU PATENT PENDING P.VANHOVE
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
C_r = function(sort) { 
	if(sort) this.order = { 
		is:new Array(), sort:sort, sortf:((typeof(this.sort))==='function')?this.sort:function(a,b){ if(a > b) return 1; else return -1; },
		insert:function(i) { this.is.push(i); this.is.sort(this.sortf); },
		drop:function(k) { var x = this.is.indexOf(k); this.is.splice(x, 1); }
	};
}
C_r.prototype = {
	argsarray: function() { var args = new Array(); for(var x=0; x<arguments.length; x++) args.push(arguments[x]);	return args; },
	add:function(key, i) { // last argument i is the instance to place in the structure
		var args = this.argsarray.apply(this, arguments);
		if(args.length==2) { if(this.order) this.order.insert(key); return this[key] = i; } // inserts an instance
		if(args.length==1) if(key in this) {return this;} else { // prepares a level, no end instance added
			this[key] = new C_r(this.order?this.order.sort:false); return this; 
		} 
		var k = args.shift(); if(!(k in this)) { // develop the tree
			if(this.order) this.order.insert(k);
			this[k] = new C_r(this.order?this.order.sort:false);
		}
		return this[k].add.apply(this[k], args);
	},
	get:function(key) { // returns a single item or a portion of the tree structure (or the complete tree structure if key == undefined)
		var args = this.argsarray.apply(this, arguments);
		if(args.length<=1) return this.els(key);
		var k = args.shift(); if(k in this) return this[k].get.apply(this[k], args);
		return undefined;
	},
	del: function(itemORnode, level) { // deletes every ends equal to item, or parts of the tree, or one part of the tree at given level
		for(var x in this) if(this[x] instanceof C_r) this[x].del(itemORnode, level?--level:level); // begin with recursing sub levels of C_r instances
		for(var x in this) if(x in C_r.prototype) continue; else if(this[x] == itemORnode) { if(this.order) this.order.drop(x);  delete this[x] }; // delete ends
		if(!level) for(var x in this) if(x in C_r.prototype) continue; else if(x==itemORnode) delete this[x]; // delete parts of the tree (item is a node) when level reaches zero, or any level if level is undefined
	},
	count:function(key) { // counts number of branches at the key node
		var args = this.argsarray.apply(this, arguments);
		if(args.length==0) { var c=0; for(var m in this) if(m in C_r.prototype) continue; else c++; return c; }
		var k = args.shift(); if(k in this) return this[k].count.apply(this[k], args);
		return 0;
	},
	ends: function(key) { // counts number of open end items below the key node
		var args = this.argsarray.apply(this, arguments);
		if(args.length==0) return this.noe();
		// var k = args.shift(); return this[k].ends.apply(this[k], args); // modified Jan7 2015 
		var k = args.shift(); 
		if(k in this) {
			if(this[k] instanceof C_r) return this[k].ends.apply(this[k], args);
			else return 1;
		}
		return 0;
	},
	keys: function(key) { // returns keys list, optionaly under a key sequence
		var args = this.argsarray.apply(this, arguments);
		if(args.length==0) {
			var k = [];
			for(var x in this) 
				if(this[x] instanceof C_r) k = k.concat(this[x].keys());
				else if(x in C_r.prototype) continue;
					else k.push(x);
			return k;
		}
		var k = args.shift(); if(k in this) return this[k].keys.apply(this[k], args);
		return undefined;
	},
	flush: function() {
		for(var x in this) if(x in C_r.prototype) continue; else delete this[x]; // delete ends
	},
	
	// private 
	els: function(key) {
		var target = (key===undefined) ? this : this[key];
		if(target instanceof C_r) { // get concerns a portion of the tree structure
			var get = new Array()
			for(var m in target) if(m in C_r.prototype) continue; else get[m] = target.els(m);
			if(this.order) return { order:target.order.is, keys:get }; else return get;
		}
		return target; // get concerns an open end item
	},
	noe: function() {// counts number of open end items from this node on
		var c = 0;
		for(var x in this) 
			if(this[x] instanceof C_r) c += this[x].noe();
			else if(x in C_r.prototype) continue;
				else c++;
		return c;
	},
	order:false
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
C_regS = function(reg1, reg2, reg3, reg4) {
	for(var x=0; x<arguments.length; x++) {
		var arg = arguments[x]; var name = false; var sort = false;
		if(typeof arg == 'object') { // register is specified with options, like { name:'myreg', sort:function(a,b){ return a<b } }
			name = arg.name;
			sort = arg.sort;
		} else name = arg;
		if(!name) continue;
		this[name] = new C_r(sort); 
	}
}
C_regS.prototype = {
	del: function(item) { // deletes a single item, references are removed from all registers having this item
		for(var x in this) if(this[x] instanceof C_r) this[x].del(item);
	},
	flush: function(name) { // re-initializes a complete register or all registers
		if(name in this) {
			var sort = this[name].order?this[name].order.sort:false;
			delete this[name]; this[name] = new C_r(sort); 
		} else {
			for(var name in this) if(this[name] instanceof C_r)	{
				var sort = this[name].order?this[name].order.sort:false;
				delete this[name]; this[name] = new C_r(sort);
			}
		}
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   O L D    D E S I G N    R E G I S T E R S  <=> D E P R E C A T E D  !! (use C_regS)
//
C_registers = function(name1, name2, name3, name4) { // name is a single name, or somth like { name:'myreg', order:function(a,b){ return a<b } }
	this.order = {};
	for(x=0; x<arguments.length; x++) {
		var arg = arguments[x]; var name = false;
		if(typeof arg == 'object') { // register is specified with options, like { name:'myreg', order:function(a,b){ return a<b } }
			name = arg.name;
			if(arg.order) this.order[name] = arg.order; // can be true, or a sort function
		} else name = arg;
		if(!name) continue;
		this[name] = new Array(); 
		if(name in this.order) this[name]['ordered'] = new Array();
	}
}
C_registers.prototype = {
	add:function(instance, register, key1, key2, key3, key4) { // take a whisky before reading this
		var pointer = this[register];
		var ordered = (register in this.order) ? this[register].ordered : false;
		var last = arguments.length-1;
		for(x=0; x<arguments.length; x++) { // traversing register, adding unexisting branches
			if(x==0 || x==1) continue; var key = arguments[x];
			if(x==last) {
				pointer[key] = instance; if(ordered) { ordered.push(key); }
			} else { // it is not the 
				if(!(key in pointer)) { // this branch is unexisting yet
					pointer[key] = new Array();
					if(ordered) { ordered.push(key); pointer[key]['ordered'] = new Array(); }
				}
			}
			if(ordered) ordered = pointer[key].ordered;
			pointer = pointer[key];
		}
		return instance;
	},
	get:function(register, key1, key2, key3, key4) {
		var pointer = this[register];
		var last = arguments.length-1;
		for(x=0; x<arguments.length; x++) {
			if(x==0) continue; var key = arguments[x];
			if(!(key in pointer)) return false;
			if(x==last) return pointer[key];
			pointer = pointer[key];
		}
	}, 
	count:function(register, key1, key2, key3, key4) {
		var pointer = this[register];
		var last = arguments.length-1;
		for(x=0; x<arguments.length; x++) {
			if(x==0) continue; var key = arguments[x];
			if(!(key in pointer)) return 0;
			if(x==last) { var c=0; for(i in pointer[key]) c++; return c; }
			pointer = pointer[key];
		}
	},
	flush:function(register) {
		if(register) {
			this[register] = new Array();
			if(register in this.order) this[register]['ordered'] = new Array();
			return;
		} else
			for(name in this)
				if(typeof this[name] == 'function') continue;
					else this.flush(name);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_el = function(eids) { 
	this.get = new Array(); // allows scanning of controls only (no scanning of A_ct functions)
	if(eids) this.collect(eids);
}
A_el.prototype = {
	collect: function(eids) { // eids is an object, possibly nesting other objects, where members are element ids
		for(x in eids)
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
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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
		if(!isvalid) new C_iMSG(C_XL.w('invalid form'));
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
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
microperf = function(comment) {
	this.cues = new Array();
	this.cue(comment||'created');
}
microperf.prototype = {
	cue: function(comment) {
		this.cues.push({time:new Date(), comment:comment||''});
	},
	report: function(postfix) {
		console.log(tab+'/ micro perf report '+(postfix||''));
		var p = false;
		for(var x in this.cues) {
			var cue = this.cues[x];
			var pms = p?'(+'+(cue.time.valueOf()-p.time.valueOf())+'ms)':'';
			console.log(tab+'| ->'+x+' - '+cue.time.getSeconds()+','+cue.time.getMilliseconds()+' '+pms+' <-> '+cue.comment);
			p = cue;
		}
		var roundms = (this.cues[this.cues.length-1].time.valueOf()-this.cues[0].time.valueOf());
		console.log(tab+'\\ => '+roundms+'ms total roundtrip. Micro perf report complete');
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
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
	timeout: function() { if(this.callbacks.ontimeout) this.callbacks.ontimeout.cb(); },
	// extract: function(stream, tagIn, tagOut) { // older version, now transfered to String prototype
		// var regExpIn = new RegExp(tagIn);
		// var regExpOut = new RegExp(tagOut);
		// var tagInPos = regExpIn.exec(stream);
		// if(!tagInPos) return '';
		// tagInPos=tagInPos.index;
		// var tagOutPos = regExpOut.exec(stream);
		// if(!tagOutPos) return '';
		// tagOutPos=tagOutPos.index;
		// var tagInLen = tagIn.length;
		// var subStringLen = tagOutPos-tagInPos-tagInLen;
		// var subStream = stream.substr(tagInPos+tagInLen,subStringLen);
		// stream = stream.replace(tagIn+subStream+tagOut,'');
		// return subStream;
	// }, 
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//		E X A M P L E S
//

C_generic = function(eid,callbacks,preset) {
	// generic
	this.eids = { aneid:eid+'_aneid' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_generic.defaults.align(preset);
	
	// controls
	
	
	this.controls = new A_ct({});
}
C_generic.defaults = new A_df({  });
C_generic.prototype = {
	// public
	display: function() {
		var html = '';
		return html;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_generic');
	},
	
	// private
	myprivate: function() {
	
	},
	
	// callbacks
	callback: function() {
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//   W I N D O W     S I Z E 
//
C_iWIN = function(correlator, onResize) { 
	C_iWIN.register[correlator] = onResize; 
}
C_iWIN.register = new Array();
C_iWIN.size = { w:0 , h:0 }; 
(C_iWIN.measure = function() {  // burst should stop for 1000ms before this handlers triggers the clients
	
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	if(!window && !document.body) return;
	C_iWIN.size = { w:w , h:h };
	for(correlator in C_iWIN.register) C_iWIN.register[correlator].cb(C_iWIN.size); 
})();
C_iWIN.filter = new A_cb(null, C_iWIN.measure);
window.onresize = function() { 
	if(!is.tactile) // on iPad, this function is triggered every time the DOM size changes. As the app is fullscreen and there is never a resize, we do not callback.
		C_iWIN.filter.dcb(400/*ms*/); 
};
C_iWIN.measure();
C_iWIN.cursor = function(cursor) { // sets the mouse pointer
	if(is.tactile) return;
	if(cursor)
		$(document.body).addClass('cursor-'+cursor);
	else
		$(document.body).removeClass ( // only the classes that contain the cursor specifications
			function (index, classes) { 
				var matches = classes.match(/\bcursor-[^\b]*\b/gi) || [];
				return (matches.join(' '));
			}
		);
};



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   U S E R     A G E N T 
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
		!!(/webos|iphone|ipod|blackberry|nokia|htc|huawei|opera mini|mobile safari|windows phone|iemobile/i).test(navigator.userAgent.toLowerCase())||(C_iWIN.size.w<600)
, tactile:
		!!(/webos|iphone|ipod|blackberry|nokia|htc|opera mini|mobile safari|windows phone|iemobile|android|ipad/).test(navigator.userAgent.toLowerCase()) // ||('ontouchstart' in window)||(navigator.msMaxTouchPoints) PROBLEM WITH HYBRID DEVICES
, browser: { MSIE:(navigator.appName=='Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) }
, landscape: (window.orientation==-90||window.orientation==90)
, portrait: (window.orientation==0||window.orientation==180)
, appleios: device.OS=='Mac'&&(device.HW=='iPad'||device.HW=='iPhone')
};

if(verboseOn) console.log('7 - device - browser:'+device.browser+', OS:'+device.OS+', HW:'+device.HW);
if(verboseOn) console.log('is - tactile:'+is.tactile+', small screen:'+is.small);
if(verboseOn) console.log('userAgent:'+navigator.userAgent);
if(verboseOn) console.log('Window size:'+C_iWIN.size.w+'/'+C_iWIN.size.h+', landscape:'+is.landscape);


var nofeedback = true;

//////////////////////////////////////////////////////////////////////////////////////////////
//
arrayAND = function(arrays) { // returns an array with common values to all arrays
	if(!arrays.length) return new Array(); // there is no array, so there is nothing in common
	if(arrays.length==1) return arrays[0]; // there is nothing to compare because there is only one array
	var filtered = new Array();
	var reference = arrays.shift();
	for(x in reference) {
		var refvalue = reference[x];
		var present = true; // assumes the refvalue is present in all arrays
		for(a in arrays) {
			var candidateArray = arrays[a];
			var found = false;
			for(y in candidateArray)
				if(candidateArray[y]==refvalue) found=true;
			if(!found) { present = false; break; } // cancel checks for this refvalue
		}
		if(present) filtered.push(refvalue);
	}
	return filtered;
}
arrayOR = function(arrays) {
	if(!arrays.length) return new Array(); // there is no array, so there is nothing to sum
	if(arrays.length==1) return arrays[0]; // there is nothing to sum because there is only one array
	var out = new Array();
	for(var x in arrays) {
		var array = arrays[x];
		for(var k in array) out[k] = array[k];
	}
	return out;
}
arrayREMOVE = function(from, values) { // from is an array, values is an array. If present in [from], values of [values] are removed
	if(!from.length) return new Array(); // there is no value in [from], so there is nothing to remove
	if(!values.length) return from; // there is no values to retrieve, so the from array is unchanged
	var filtered = new Array();
	for(x in from) {
		var candidate = from[x];
		var found = false;
		for(y in values) if(values[y]==candidate) { found = true; break; }
		if(found) continue;
		filtered.push(candidate); // the candidate is not in the list of forbidden values
	}
	return filtered;
}
arrayINVERT = function(array) { // switches values with indexes 
	var inverted = new Array();
	for(var x in array) inverted[array[x]] = x;
	return inverted;
};
arrayGETKEY = function(array, value) { // returns the first found key
	for(var x in array) if(array[x]==value) return x;
	return false;
};
arrayCLONE = function(native) {
	var clone = new Array();
	for(var x in native) clone[x] = native[x];
	return clone;
}
arrayKEYS = function(array) {
	var keys = new Array(); var k; 
	for(var k in array) keys.push(k);
	return keys;
}
arrayHAS = function(array, value) {
	for(var k in array) if(array[k]==value) return true; // will never return 0
	return false;
}
arrayKEY = function(array, forvalue) {
	for(var k in array) if(array[k]==forvalue) return k; // may return 0 
	return false;
}
round = function(n) { return ((n*16)|0)>>4; };
bitmap = function(value) {
			var scale16 = 0x800; // Which is 10000000 00000000
			var scale32 = 0x20000000; // Which is 10000000 00000000 00000000 00000000
			var top16 = 0xFFFF;
		var scale = scale16; if(value>top16) scale = scale32;
		var bc = 1;
	for(var bits = '', scan=1; scan<=scale; scan<<=1) { 
		bits = (scan&value ?'1':'0')+bits; if(!(bc++%8)) bits = ','+bits; 
	};
	bits = 'bits: '+bits;
	return bits;
}


Date.prototype.isvalid = function(yyyy,mm,dd) {
	
		var stamp = this.getTime();
	if(isNaN(stamp)) return false;
	
	var xpyyyy = this.getFullYear();
	var xpmm = this.getMonth();
	var xpdd = this.getDate();
	if(vbs) vlog('mobframe.js','Date','isvalid',this+'|'+'yyyy:'+yyyy+'/xp:'+xpyyyy+', mm:'+mm+'/xp:'+xpmm+',  dd:'+dd+'/xp:'+xpdd);
	
	// now check if you did not enter some bullshit like '1970-12-35', that let the Date object re-schedule your input to another date / month
	if(xpyyyy != yyyy ) return false;
	if(xpmm != mm-1) return false;
	if(xpdd != dd) return false;

	return true;
}
Date.prototype.sameday = function (o_Date) { // checks if guest o_Date is inside the same calendar day. Time may be different.
	
	// js considers that day+0 at 24h is actually midnight at date+1. Which is not convenient for practical planning display 0 to 24h.
	// We must consider that if cueOut is midnight on date X+1, while cueIn is on date X, then IT IS the SAME day. 
	
	var cin = this.valueOf();
	var cout = o_Date.valueOf();
	if(cout<cin) { var a=cin, cin=cout; cout=a;  } // be sure that cout is after cin
	
	var jsdcin = new Date(cin); var jsdcout = new Date(cout); 
	cin = (cin/1000)|0; cout = (cout/1000)|0; // work with entire seconds
	
	if((cout-cin)>=86400) return false; // does not fit inside a same day
	else { 
		if(jsdcin.getDate()==jsdcout.getDate()) return true; // same date inside a 86400 seconds span
		
		if(jsdcout.seconds()==0) return true; // spans up to midnight on date+1
		return false;
	}
	
	// Older version of this function :
	// if(o_Date.getDate()!=this.getDate()) return false;
	// if(o_Date.getMonth()!=this.getMonth()) return false;
	// if(o_Date.getFullYear()!=this.getFullYear()) return false;
	return true;
}
Date.prototype.sameYear = function (o_Date) { // checks if guest o_Date is inside the same calendar day. Time may be different.
	if(o_Date.getFullYear()!=this.getFullYear()) return false;
	return true;
}
Date.prototype.calendar = function(o_Date) { // both cues in and out sticks to midnight. This is a calendar span.
	if(this.seconds()) return false;
	if(o_Date.seconds()) return false;
	return this.span(o_Date)/86400; // returns the number of entire days 
}
Date.prototype.ispast = function () {
	var date = new Date();
	if(date.valueOf() >= this.valueOf()) return true;
	return false;
}
Date.prototype.isbefore = function (jsdate) { 
	if(jsdate.valueOf() > this.valueOf()) return true;
	return false;
}
Date.prototype.isafter = function (jsdate) {
	if(jsdate.valueOf() < this.valueOf()) return true;
	return false;
}
Date.prototype.isclose = function(hours, jsnow) { // starts this reservation in the period starting now and ending now plus $h hours ?
			jsnow = jsnow || new Date();
		let nowtc = jsnow.valueOf()/1000; // js timecodes are milliseconds
		let cuetc = this.valueOf()/1000;
		let gaptc = hours*3600; 
	let d = cuetc-nowtc; // see here (*ic10*)
	if(d>=0 && d<gaptc) return true;
	return false;
}
Date.prototype.addDay = function (i) {
	this.setDate(this.getDate()+i); 
	return this;
}
Date.prototype.addWeek = function (i) { 
	if(i) this.setDate(this.getDate()+i*7);
	return this;
}
Date.prototype.addMonth = function (i) {
	if(i) this.setMonth(this.getMonth()+i); 
	return this;
}
Date.prototype.addYear = function (i) {
	this.setFullYear(this.getFullYear()+i); 
	return this;
}
Date.prototype.increment = function (i) { // i like { h:true, d:1, w:0, m:0, y:0, nw:0, nm:0, ny:0, tw:0, wd:[0 to 6], wp:[-1,1,2,3,4], ms:1, ws:1 }	
	
	if(i.h) { var date = new Date(); this.setTime(date.valueOf()); }; // pitch back to now
	
	if(i.tw) while(this.getDay()!=1) this.addDay(-1); // this week : skip to monday This Week
	if(i.nw) { while(this.addDay(1).getDay()!=1); this.addWeek(i.nw-1); }; // new week : skip to monday Next Week plus nw entire weeks
	if(i.nm) { while(this.addDay(1).getDate()!=1); this.addMonth(i.nm-1); }; // new month : skip to 1st of next month plus nm entire months
	if(i.ny) { this.addYear(i.ny); this.setMonth(0); this.setDate(1); };
	
	if(i.m) this.addMonth(i.m);
	if(i.d) this.addDay(i.d);
	if(i.w) this.addWeek(i.w);
	if(i.y) this.addYear(i.y);
	
	if(i.wd) { // i.wd can be a js int weekday ( 0=sunday, monday=1 saturday=6) or a pattern of weekdays like [0,2,4] (i.e. sunday, tuesday and thursday)
		if(typeof i.wd != 'object') i.wd = [i.wd]; 
		var cm = this.getMonth(); // current month
		this.addDay(1);
		var flip = []; for(var x in i.wd) flip[i.wd[x]] = true;
		var match = function(t) { return flip[t.getDay()]; }
		if(i.wp) { // week pattern (e.g if wp = 2 then valid days are in week 2, if wp=-1 then valid days are in the last week of the month)
			if(i.wp>0) match = function(t) { return t.daypos()==i.wp && flip[t.getDay()]; }
			else if(i.wp<0) match = function(t) { return t.dayposlast()==i.wp && flip[t.getDay()]; }
		}
		while(!match(this)) this.addDay(1); // forward to weekday i.wd or the next wd in the given pattern
		if(i.ws>1) { // week skip, if e.g. ws = 2, the pattern is reproduced only every 2 weeks
			if(this.getDay()==i.wd[0]) this.increment({w:i.ws-1});
		}
		if(i.ms>1) { // month skip, if e.g. ms = 2, the pattern is reproduced only every 2 months
			if(this.getMonth()!=cm) // we felt into a next month
				this.increment({nm:i.ms-1, d:-1, wd:i.wd, wp:i.wp}); // forward to the next valid month in the right wp according to required week days
		}
	}
	if(i.midnight) { this.toMidnight(); };
	return this;
}
Date.prototype.datelast = function() { // returns the number of the week in which the weekday is present 
	var run = this.clone(), which=-1, mine = this.getDate(), d;
	do { run.addDay(1); d=run.getDate(); if(d!=1) which--; } while(d!=1);
	return which;
	// e.g; if Feb 23st is the last tuesday in the month, this function will return -1
	// e.g; if Feb 16st is a tuesday, this function will return -2 for Feb 16th
}
Date.prototype.daypos = function() { // returns the number of the week in which the weekday is present 
	var run = new Date(+this), which=1, mine = this.getDay();
	while(run.getDate()!=1) { run.addDay(-1); if(run.getDay()==mine) which++; }
	return which;
	// e.g; if Feb 1st is a monday, Feb 8th is the second monday and this function will return 2
}
Date.prototype.dayposlast = function() { // returns the number of the week wrt end of the month 
	var run = this.clone(), which=-1, mine = this.getDay(), d;
	do { run.addDay(1); d=run.getDate(); if(run.getDay()==mine) if(d!=1) which--; } while(d!=1);
	return which;
	// e.g; if Feb 23st is the last tuesday in the month, this function will return -1
	// e.g; if Feb 16st is a tuesday, this function will return -2 for Feb 16th
}
Date.prototype.monday = function() { return this.increment({ tw:true }) }
Date.prototype.sunday = function() { while(this.getDay()!=0) this.addDay(-1); return this; }
Date.prototype.clone = function(i) {
	var c = new Date(+this);
	if(i) c.increment(i);
	return c;
},
Date.prototype.getPHPday = function () {
	var dayCode = this.getDay(); // jsScript has sunday = 0, monday = 1, saturday = 6
	if(dayCode==0) dayCode =7; // PHP standard has monday = 1 and sunday =7
	return dayCode;
}
Date.prototype.getPHPstamp = function () {
	return (this.valueOf()/1000)|0; // cast to integer
}
Date.prototype.stamp = function () { // new design
	return (this.valueOf()/1000)|0; // cast to integer UNIX timestamp
}
Date.prototype.HHmm = function(seconds) {
	var h = this.getHours();
	var m = this.getMinutes();
	if(h<10) h = '0'+h;
	if(m<10) m = '0'+m;
	var t = h+':'+m;
	if(seconds) {
		var s = this.getSeconds();
		if(s<10) s = '0'+s;
		t += ':'+s;
	}
	return t;
}
Date.prototype.datetimestr = function(options) { // options like { y:true } <= displays year
	options = options || {};
	return this.sortable(options)+' '+this.HHmm(); 
}
Date.prototype.span = function(date) { // returns number of seconds to the given date
	var seconds = (this.valueOf() - date.valueOf())/1000;
	if(seconds<0) return -seconds;
	return seconds;
}
Date.prototype.toMidnight = function(seconds) {
	this.setHours(0); 
	this.setMinutes(0); 
	this.setSeconds(seconds||0); // you can specify a new time in this day
	this.setMilliseconds(0);
	return this;
}
Date.prototype.sortable = function(options) { // options like { y:true } <= displays year
	options = options || { y:true };

	var p = [];
	var y = this.getFullYear(); // year
	var m = this.getMonth()+1; 	// m[1-12]
	var d = this.getDate(); 	// d[1-31]
	
	if(m < 10) m = '0'+m;
	if(d < 10) d = '0'+d;
	
	if(options.y) p.push(y);
	p.push(m); p.push(d);
	
	return p.join('-');
}
Date.prototype.tilt = function() { // aligns the stamp onto the closest group slice
	this.setSeconds(0); 
	this.setMilliseconds(0);
	var h = this.getHours();
	var m = this.getMinutes();
	var seconds = h*3600+m*60;
	var slice = (seconds/mobminder.account.secondsPerSlice)|0;
	this.setHours(0); 
	this.setMinutes(0); 
	this.setSeconds(slice*mobminder.account.secondsPerSlice); 
}
Date.prototype.sliceSpan = function(o_Date) {
	var span = o_Date.valueOf()-this.valueOf();
	var seconds = span/1000; if(seconds<0) seconds = -seconds;
	return (seconds/mobminder.account.secondsPerSlice)|0;
}
Date.prototype.getSlice = function() {
	// var seconds = (this.getHours()*3600 + this.getMinutes()*60);
	return (this.seconds()/mobminder.account.secondsPerSlice)|0;
}
Date.prototype.seconds = function(seconds) { // seconds from midnight
	if(seconds!=undefined) return this.toMidnight(seconds);
	return (this.getHours()*3600 + this.getMinutes()*60 + this.getSeconds());
}
Date.prototype.setUnixTime = function(unixTime) { // unixTime like '2012-05-19 09:26'
	this.setYear(unixTime.substr(0, 4)|0);
	this.setMonth((unixTime.substr(5, 2)|0)-1);
	this.setDate(unixTime.substr(8, 2)|0);
	this.setHours(unixTime.substr(11, 2)|0);
	this.setMinutes(unixTime.substr(14, 2)|0);
	this.setSeconds(0); 
	this.setMilliseconds(0);
	return this;
}
Date.prototype.getUnixTime = function() { // unixTime like '2012-05-19 09:26'
	var d = this.getDate();
	var m = this.getMonth()+1;
	if(d<10) d = '0'+d;
	if(m<10) m = '0'+m;
	return this.getFullYear()+'-'+m+'-'+d+' '+this.HHmm(true);
}
Date.prototype.timeshift = function() { // daylight saving time shift, concerns 2 sundays in a year
	 // return 0 363 days a year, 
	 // returns +3600 when days are 90000 seconds long due to daylight saving, before entering winter
	 // returns -3600 when days are 82800 seconds long due to daylight saving, before entering summer
	 var nextday = this.clone({d:1});
	 var daylength = nextday.valueOf()-this.valueOf();
	 return (daylength/1000)-86400;
}
Date.prototype.getWeekNumber = function(){ // returns week number according to ISO-8601
    var d = new Date(+this);
		d.setHours(0,0,0);
		d.setDate(d.getDate()-(d.getDay()||7)+4); // Go to thursday this week
		var y = d.getFullYear(); // the current year
		var wn = 0;
		while(d.getFullYear()==y) { d.setDate(d.getDate()-7); wn++; };
	return { y:y, wn:wn };
};


jsDateFromUnixTime = function(unixTime) { var date = new Date(); return date.setUnixTime(unixTime); } // unixTime like '2012-05-19 09:26'
time = function(seconds) { // returns HHMM string given a number of seconds from midnight
	var h = 0; while(seconds>3599) { seconds-=3600; h++; };
	var m = 0; while(seconds>59) { seconds-=60; m++; }; if(m<10) m = '0'+m;
	return h+':'+m;
}
oclock = function(seconds) { // returns the seconds of the pitch oclock time given a number of seconds from midnight
	var h = (seconds/3600)|0; h*=3600;
	if(h<mobminder.account.rangeIn) h=mobminder.account.rangeIn; // mobminder.account.rangeIn is an o'clock time
	return h;
}
duration = function(seconds, options) { // returns a string explaining duration between this from a given startDate
	options = options || { days:true, pad:'' }
	var days = 0; 
	if(options.days) { days = (seconds/86400)|0; seconds-= days*86400 };
	var hours = (seconds/3600)|0; seconds-= hours*3600;
	var minutes = (seconds/60)|0; seconds-= minutes*60;
	var string = '';
	if(minutes) string = (minutes<10) ? '0'+minutes+'m'+options.pad : minutes+'m'+options.pad;
	if(hours) string = hours+'h'+options.pad+string;
		var dword = ( (days>1) ? C_XL.w('abr days')+options.pad : C_XL.w('abr day')+options.pad ); // takes care of plural
	if(days) string = days+dword+string;
	return string;
}
nowmidnite = function() { var d=new Date(); return d.toMidnight().stamp(); };
tobdate = function(digits) { // the assumed input format (recorded in DB) is YYYYMMDD
	digits = digits.toString();
	if(digits.length!=8) return '';
	var yyyy = digits.slice(0,4);
	var mm = digits.slice(4,6);
	var dd = digits.slice(6,8);
	var formated = dd+'-'+mm+'-'+yyyy;
	return formated; // output format is YYYY-MM-DD
}
sortable = function(unixTime, options) {
	var jsdate = new Date(unixTime*1000); 
	return jsdate.sortable(options); 
};

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






//////////////////////////////////////////////////////////////////////////////// 
//
//  C O N S T A N T S 
//

var class_resa_any = 10; // is a triggerClass for communication

var class_note = 14;
var class_task = 15;
var class_chat = 16;
var class_file = 17;

var resaclass = {
	event:13, 		// one of bCal, uCal, fCal (for offtime, private meeting,...)
	assignment:12, 	// bCals and uCals, no visitor (for meetings, planned tasks,...)
	appointment:11, // visitor(s) and bCal, uCal, optional fCal
	fcalwide: 32, 	// no bCal, only visitors and one fCal, never a bCal (used for fCal with daily reservability, peered to a resaclass.appointment)
	names: { 11:'appointment', 12:'assignment', 13:'event', 32:'fcalwide' },
	name:function(resaclass) { return this.names[resaclass]; }
}

var class_uCal 		= 1;
var class_bCal 		= 2;
var class_visitor 	= 3;
var class_fCal 		= 4;
var agClass = { bCal:2, uCal:1, fCal:4 };
var agClassMatrix = function(b,u,f) { return { 2:b||[], 1:u||[], 4:f||[] }; }



////////////////   E X E C U T I O N    C O N T E X T   &   C O N S T A N T S 
mobminder = { 
	reset:function() { this.account=false, this.context=false, this.app=false } 
};
mobminder.reset();


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   G E N E R I C     S Y M B O L S     A N D    I C O N S
//

function symbol(which,css,style) {
	var s = false;
	switch(which) {
		// used in backoffice pages h1 and back office menu
		case 'setup': 		s = 'cogs'; break;
		case 'visitors': 	s = 'users'; break;
		case 'stats': 		s = 'bar-chart'; break;
		case 'archives': 	s = 'th-list'; break;
		case 'search': 		s = 'binoculars'; break;
		case 'elearning': 	s = 'coffee'; break;
		case 'connexions': 	s = 'plug'; break;
		case 'smsmon': 		s = 'rss'; break;
		
		// used in modals h1
		case 'user': 		s = 'user'; 		css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'user-new':	s = 'user-plus'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'user-deleted':s = 'user-times'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'calendar': 	s = 'calendar'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'task': 		s = 'thumb-tack'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'note': 		s = 'tags'; 		css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'chat': 		s = 'comments'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		
		// used in chats / notes / tasks
		// case 'plus chat': return '<span class="fa-stack" style=""><i style="font-size:1em;" class="fa fa-comment fa-gray"></i><i  style="font-size:.5em;" class="fa fa-plus fa-stack-1x fa-inverse"></i></span>';
		case 'plus task': return '<div style="display:inline-block;" class="fa fa-13x fa-thumb-tack fa-rotate-45 fa-gray"></div>'+'<div style="display:inline-block;" class="fa fa-09x fa-plus fa-gray"></div>';
		case 'plus note': return '<div style="display:inline-block;" class="fa fa-13x fa-tags fa-gray"></div>'+'<div style="display:inline-block;" class="fa fa-09x fa-plus fa-gray"></div>';
		case 'plus chat': return '<div style="display:inline-block; position:relative; bottom:-0.15em;" class="fa fa-13x fa-comment fa-gray"></div>'+'<div style="display:inline-block; position:relative; color:white; left:-1.2em;" class="fa fa-08x fa-plus"></div>';
		// case 'plus note': return '<span class="fa-stack fa-hg"><i class="fa fa-tags fa-stack-2x fa-gray"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span>';
		case 'send msg' : s = 'paper-plane'; css='fa-17x'; style='padding:0;'; break;
		
		// used in e-reservation
		case 'ident'	: s = 'user'; css='fa-13x'; style='padding:0;'; break;
		case 'options'	: s = 'ballot'; css='fa-13x'; style='padding:0;'; break;
		case 'select'	: s = 'calendar'; css='fa-13x'; style='padding:0;'; break;
		case 'confirm'	: s = 'calendar-check'; css='fa-13x'; style='padding:0;'; break;
		case 'thanks'	: s = 'thumbs-up'; css='fa-13x'; style='padding:0;'; break;
		
		// used in file type recognition
		case 'file': 		s = 'file'; break;
		case 'pdf': 		s = 'file-pdf'; break;
		case 'eml': 		s = 'file-text'; break;
		case 'jpg': case 'jpeg': case 'gif': case 'png': 	s = 'file-image'; break;
		case 'doc': case 'docx': case 'rtf': case 'txt': 	s = 'file-word'; break;
		case 'mp3': case 'wav': case 'm4a': 	s = 'file-audio'; break;
		case 'avi': case 'mp4': case 'mkv': 	s = 'file-video'; break;
		case 'ppt': case 'pptx': 	s = 'file-powerpoint'; break;
		case 'xlsx': case 'xls': 	s = 'file-excel'; break;
		
		// used on planning
		case 'zoom-in': 		s = 'search-plus'; break;
		case 'zoom-out': 		s = 'search-minus'; break;
		case 'weekview': 		s = 'list'; break;
		case 'close': 			s = 'close'; break;
		case 'menu': 			s = 'bars'; break;

		case 'payment': 		s = 'shopping-cart'; css='fa-13x'; style='padding:0;'; break;
	}
	var span = '<i style="'+(style||'padding-left:1em;')+'" class="fa fa-gray '+(css||'fa-11x')+' fa-'+s+'"></i>';
	return span;
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N     S E R V I C E
//


mobminder.communication = { 
	triggers: function(){
		var sections = { reminders:'reminder', revivals:'revival', specials:'special' };
		var triggers = { // values should match the server side (*triggers*)
			revivals: { '-1':'revival one day', '-7':'revival one week', '-14':'revival two weeks', '-28':'revival one month'
, '-91':'revival three months', '-147':'revival five months', '-175':'revival six months'
, '-266':'revival nine months', '-329':'revival eleven months', '-357':'revival one year', '-539':'revival months 18', '-728':'revival two years' },
			reminders: { 1:'reminder eve', 2:'reminder two days', 3:'reminder three days', 4:'reminder four days', 7:'reminder one week', 14:'reminder two weeks' },
			specials: { 0:'action on agenda', 80:'on visitor record', 81:'on visitor birthday', 90:'h-x reminder', 99:'manual notification' }
		}
		var labels = new Array(); for(var s in sections) {
			labels[s] = sections[s];
			for(var i in triggers[s]) labels[i] = triggers[s][i];
		} 
		labels = C_XL.w(labels);
		
		var order = new Array(); for(var s in sections) {
			order.push(s);
			for(var i in triggers[s]) order.push(i);
		} 
		var count = order.length;
		var bullet = C_XL.w('bullet down');
		var lockies = { reminders:{section:bullet}, revivals:{section:bullet}, specials:{section:bullet} };
		return { order:order, labels:labels, presets:lockies, count:count };
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D A T E     F O R M A T S    T R A N S L A T I O N
//
C_XL = function() {};
C_XL.prototype = {};
C_XL.date = function(jsdateORstamp, preset, language) {
	var jsdate = new Date();
	
	var opt = C_XL.date.defaults.align(preset);

	if(jsdateORstamp) 
	{
		if(jsdateORstamp instanceof Date) 
		{
			jsdate = jsdateORstamp.clone(); // you passed a Date object
		}
		else if(typeof (jsdateORstamp|0) == 'number') 
		{
			jsdate = new Date(jsdateORstamp*1000); // you passed a unix timestamp
		}
		
	}

	var separator = opt.abreviation == 'min' ? '' : ' ';

	if (!opt.abrmonth) opt.abrmonth = opt.abreviation;
	
	var date = jsdate.getDate(); 						
	var month = C_XL.month(1+jsdate.getMonth(), opt.abrmonth, language);
	
	var s = new Array();
	var language = (language!==undefined)? language:mobminder.context.surfer.language;
	
	if(opt.weeknumb) opt.weeknumb = '<span class="weeknumber">('+jsdate.getWeekNumber().wn+')</span>';
	switch(language) { 
	
		case mobminder.language.codes.english: // reversed English sequence
			var post = 'th'; if(date=='1') post='st'; if(date=='2') post='nd';if(date=='3') post='rd';
			s = [month, date+post]; 
			if(opt.weekday) { var weekday = C_XL.weekday(jsdate.getPHPday(), opt.abreviation, language); s.unshift(weekday); }
			if(opt.year) { var year = jsdate.getFullYear(); if(opt.yearfirst) s.unshift(year); else s.push(year); };
			if(opt.time) s.push(jsdate.HHmm());
			if(opt.weeknumb) s.push(opt.weeknumb); 
			break;
		case mobminder.language.codes.german:
			//2022-08-19 BSP correction "Donnerstag 21 Juli 2022" => "Donnerstag, 21. Juli 2022"
			var post = '.';
			s = [date+post,month]; 
				if(opt.weekday) { var weekday = C_XL.weekday(jsdate.getPHPday(), opt.abreviation, language); s.unshift(weekday+','); }
				if(opt.year) { var year = jsdate.getFullYear(); if(opt.yearfirst) s.unshift(year); else s.push(year); };
				if(opt.time) s.push((opt.abreviation == 'full' ? C_XL.w('at',{cap:0})+' ' : ' - ')+jsdate.HHmm()); 
				if(opt.weeknumb) s.push(opt.weeknumb); 
			break;
		case mobminder.language.codes.french:
		case mobminder.language.codes.polish:
		case mobminder.language.codes.dutch:
		case mobminder.language.codes.italian:
		case mobminder.language.codes.spanish: 
		default:
			s = [date,month]; 
				if(opt.weekday) { var weekday = C_XL.weekday(jsdate.getPHPday(), opt.abreviation, language); s.unshift(weekday); }
				if(opt.year) { var year = jsdate.getFullYear(); if(opt.yearfirst) s.unshift(year); else s.push(year); };
				if(opt.time) s.push((opt.abreviation == 'full' ? C_XL.w('at',{cap:0})+' ' : ' - ')+jsdate.HHmm()); 
				if(opt.weeknumb) s.push(opt.weeknumb); 
			break;
	}
	return s.join(separator);
}
C_XL.date.defaults = new A_df( { abreviation:'full', abrmonth:false, weekday:false, time:false, split:false, year:true, weeknumb:false } ); // abreviation like [full, abr, min]

C_XL.weekday = function(daycode, abreviation, language) { // php daycode [1-7]
	abreviation = abreviation || 'full'; // can be ['full','abr','min']
	var language = (language!==undefined)? language:mobminder.context.surfer.language;
	let res = C_XL.weekdays[abreviation]['weekday'+daycode][language];
	if (abreviation=='abr') res=res+'.';
	return res; 
}
C_XL.month = function(number, abreviation, language) {
	
	if(!abreviation) abreviation = 'full';
	var language = (language!==undefined)? language:mobminder.context.surfer.language;
	let res = C_XL.months[abreviation]['month'+number][language];
	if (abreviation=='abr') res=res+'.';
	return res;
}
C_XL.gender = function(dbcode, langcode) { return C_XL.w(C_XL.gender.codes[dbcode], { language:langcode} ); }
C_XL.gender.codes = new Array(); // set by setContextLanguage()



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N    C L A S S 
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
C_XL.w = function(term, options) { // term can be a bunch of terms { 1:term1, 2:term2, ...} and options like { cap:true, language:mobminder.language.codes.english }
	
		options = options||{ cap:1 };
		if(options.cap===undefined) options.cap = 1; // that will be the default, can be 0 (no capitalize), undefined when not specified at all
		if(options.language===undefined) { // can be 0 (english), undefined when not specified at all
			options.language = mobminder.language.codes.english; // default
			if(mobminder.context.surfer) options.language = mobminder.context.surfer.language; // translate to current surfer language
		} else {
			// the language specified by the caller
		}
		
	
	if(typeof(term)=='object') { // then you passed a bunch of terms like { 0:'term1', 1:'term2', ... }
		var xlted = {}; // keeps the input object intact!
		for(let x in term) xlted[x] = C_XL.w(term[x],options); // note the recursion (*xl02*)
		return xlted;
	}
	
	let l = options.language;
	let t = C_XL.d[term]; if(t===undefined) return 'XLt?:'+term;
		t = t[l]; if(t===undefined) return 'XLc?:'+term;
		
	t = t.replace('visitor', C_XL.d['visitor'][l]); // replace visitor with 'client', 'patient' or 'participant'
	t = t.replace('visitors', C_XL.d['visitors'][l]);
	
	if(options.cap) t = t.capitalize();
	return t;
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C L I C K  /  T O U C H    A C T I V E      E L E M E N T  
//
//   preset.tag defines what element is displayed: span, td, div, li, a or input 
//
function C_iCLIK(eid, callbacks, preset) {
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
		//BSP force cursor:default if idle=true
		var style  = ' style="'+(this.state.idle?'cursor:default;':'cursor:pointer; ')+this.state.style+indent+'"'; // not used for tag 'input'
		var bullet = ''; if(this.state.section) { if(this.state.section===true) bullet = ''; else bullet = this.state.section+'&nbsp;'; }
		var sign = ''; if(this.state.sign) sign = '<div style="display:inline-block;" class="fa fa-gray fa-11x fa-'+this.state.sign+'"></div><span style="padding-right:1em;"></span>';
		var label = bullet+sign+this.state.ui;
		
		rowspan = rowspan ? ' rowspan='+rowspan : '';
		switch(tag) {
			case 'td': case 'th': 
				style = ' style=" '+this.state.style+indent+'"';
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
	
		//console.log('controls.js','C_iCLIK','active','idle:'+this.state.idle);

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



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   K E Y B O A R D     I N P U T   &   T E X T    F I E L D S
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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


mobtags = { // tags used in communication message templates, see M_EMLT and M_SMST (*T01*), C_dS_msgTemplate.msgMerge, C_iTAGS, smstemplen
	fusion: {
		gender:'{gender}',dear:'{dear}',firstname:'{fname}',lastname:'{lname}',company:'{company}',mobile:'{mobile}',email:'{email}',info:'{info}',registration:'{regist}',address:'{address}',
		cuein:'{time}',resadate:'{date}',resaday:'{day}',resanote:'{resa_note}',perf:'{perf}',perfnote:'{perf_note}',bookingcode:'{bcode}',
		bcal:'{att_bcal}',ucal:'{att_ucal}',fcal:'{att_fcal}',business:'{business}',participants:'{participants}',
		tmp_confirm:'{tmp_confirm}', tmp_eve:'{tmp_eve}', tmp_oneweek:'{tmp_oneweek}'
	}
}




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
							, tabindex:false, max:false, mandatory:false, loginId:0, dblclick:true, surround:false
			/* internal state */, filled:false, valid: true, rows:0, dbltap:{taps:0, timer:false}, isfocused:false   } );
C_iEDIT.exclude = { always:new RegExp(/[*|<>\\#"]/g) }			
C_iEDIT.prototype = {
	// public functions
	display: function(css, label, labelcss, style) { // return top bottom like: <div>a label</div><input>input field</input>
		
		
		var display = this.state.digits;
		
		var tabindex = (this.state.tabindex) ? ' tabindex="'+this.state.tabindex+'"' : '';
		var placeholder = (this.state.placeholder) ? ' placeholder="'+this.state.placeholder+'"' : '';
		var cssclass = css ? ' class="'+css+'"' : '';
		var inlstyle = style ? ' style="'+style+'"' : '';
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
			else {
				textinput = '<input type="'+type+'" '+name+' '+pattern+' '+cssclass+' '+inlstyle+' id="'+this.eids.ui+'" value="'+display+'"'+tabindex+placeholder+' '+autocap+'/>';
			}
		
		if(this.state.surround) textinput = '<div class="input-surround">'+textinput+'</div>';

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
		
		if(is.tactile&&!is.newtouch) 
		{
			return this; // no keyboard invasion on iPads, except for the new smartphone interface where we want the keyboard to appear
		}
			
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
		
		if (this.state.type==INPUT_EMAIL && is.appleios) return this;
		
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
		return this;
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
		if(this.elements.ui) {
			// var caretPosition = this.elements.ui.selectionEnd;
			var caretPosition = this.caretPosition();
			this.elements.ui.value = digits;
			// this.elements.ui.selectionEnd = caretPosition;
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
			case INPUT_ALPHA: 			pattern = new RegExp(/[ ,._a-zA-Z0-9çéèëêôîïû\-@]/); 	break;
			case INPUT_ALPHANUMSTRICT: 	pattern = new RegExp(/[_a-zA-Z0-9]/); 					break;
			case INPUT_LOGIN: 			pattern = new RegExp(/[_a-zA-Z0-9éèëêôîïû@]/); 			break;
			case INPUT_TOKEN: 			pattern = new RegExp(/[a-z0-9]/); 						break;
			case INPUT_URL: 			pattern = new RegExp(/[.:a-zA-Z0-9\:\/\?\&=]/); 				break;
			case INPUT_AC: 				pattern = new RegExp(/[ ,.'\/\-A-Za-z0-9çéèëêôîïû]/); 	break;
			case INPUT_SMSAREA:			
			default: // INPUT_TEXT, accept all
		}	
		if(pattern) if(!pattern.test(ch)) { return false; } // the key pressed is a prohibited character
		
		if(this.state.type==INPUT_AC) { // special treatment here:
			if(newtxt.length==1) if(/[', .\-]/.test(ch)) return false; // no leading space, dot, coma or minus
			if(/, /.test(newtxt)) return true; // allows to type Isaac, Newton
			if(/[', .\-]{1,}[', .\-]{1,}/.test(newtxt)) return false; // any of [ ,.\-] may not be followed by any of [ ,.\-]
		}
		if(this.state.type==INPUT_MOBILE) { // special treatment here:
				var localCC = mobminder.account.phoneRegion;
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
		
		var highlightelement = $(this.elements.ui);
		if(this.state.surround) highlightelement = $(this.elements.ui).parent('div.input-surround');
			
		highlightelement.removeClass('validNOK').addClass('validOK');
		
		var msg = false; 
		if(this.state.filled) //BSP display error tooltip only if field is filled!
			if(!this.state.valid)
					switch(this.state.type) {
						case INPUT_EMAIL: 	msg = C_XL.w('not email'); break;
						case INPUT_MOBILE: 	msg = C_XL.w('not mobile'); break;
						case INPUT_PHONE: 	msg = C_XL.w('not phone'); break;
						case INPUT_NUMER: 	msg = C_XL.w('not numeric'); break;
						case INPUT_BDATE: 	msg = C_XL.w('not bdate'); break;
						case INPUT_PRICE: 	msg = C_XL.w('not price'); break;
						case INPUT_ALPHA: 	msg = C_XL.w('not alpha'); break;
						case INPUT_TOKEN: 	msg = C_XL.w('bad e-url'); break;
						case INPUT_URL: 	msg = C_XL.w('not url'); break;
						case INPUT_LOGIN: 	msg = C_XL.w('bad login'); break;
						case INPUT_PASSWD: 	msg = C_XL.w('not pass'); break;
					}	
		//BSP disable tooltip if mandatory and empty because a local message is displayed in case of empty fields
		//if(this.state.mandatory)
		//	if(!this.state.filled) { msg = C_XL.w('not filled in'); }
		
		//BSP display red border if tooltip msg OR if (field not filled AND mandatory)
		if(msg || ( !this.state.filled && this.state.mandatory ))
			highlightelement.addClass('validNOK').removeClass('validOK');

		if(msg)	{ // see if we set some new warning
			this.tooltip = new C_iTIP(this.eids.ui, { text:msg, css:'warning', offset:{x:-38, y:0}} );
			this.tooltip.activate();
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
		var localCC = '+'+mobminder.account.phoneRegion;
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
		if (sText.search(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/) == -1)
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


C_iFIELD = C_iEDIT;
C_iFIELD.prototype.modalquit = function() {}; // closes the edit modal screen;


/*
class C_iFIELD extends C_iEDIT { // on computer/keyboard device this class is transparent and defaults to C_iEDIT, if is.newtouch (touch device) then this class nests the C_EDIT
	
	// public
	constructor(eid, callbacks, preset) {
		
		
		super(eid, callbacks, preset); if(!is.newtouch) return; // defaults to a C_iEDIT instance. 
		
		if(!this.callbacks.onfchange) this.callbacks.onfchange = new A_cb(this, this.trackvalid); // supervising the operations in super
		
		this.eids.fs = { avatar:eid+'_av', overlay:eid+'_ol', buttons:eid+'_btt' };

		var faketextarea = 'min-height:1.6em;'; if(this.state.rows) faketextarea = 'min-height:'+(this.state.rows*2)+'em; overflow:auto;';
		
		var avatar = new C_iCLIK(this.eids.fs.avatar, { click:new A_cb(this, this.newtouch) }, { tag:'div', style:'display:inline-block;line-height:140%;'+faketextarea });
		var cartouche = new C_iDQS(this.eids.fs.buttons, { onquit:new A_cb(this, this.cancel), onconfirm:new A_cb(this, this.confirmed) }, { remove:false, save:false, confirm:true } );
		
		this.ccontrols = new A_ct({ avatar:avatar, cartouche:cartouche }); // watch the name is different from super
		this.els = new A_el();
		this.ahandlers = new A_hn( {  keys:new A_cb(this, this.keys)  }  ); // keyboard

		this.state.keys = [C_KEY.code.s.enter];
	}
	display(css, label, labelcss) { 
	
		
		if(!is.newtouch) return super.display(css, label, labelcss); 
		if(vbs) vlog('mobframe.js','C_iFIELD','display','eid:'+this.eids.ui);
		
			if(label) this.state.label = label;		
		label = label?'<div class="select-header textcolor-light '+(labelcss||'')+'">'+C_XL.w(label)+'</div>':'';

			css = css ? css+' like-input' : 'like-input';
		return label+this.ccontrols.avatar.set(this.avatar(),css).display(); // display through the C_iCLIK object

	}
	activate() { 
	
		if(!is.newtouch) return super.activate();
		if(vbs) vlog('mobframe.js','C_iFIELD','activate','eid:'+this.eids.ui);
		this.ccontrols.avatar.activate();
		super.validate(this.state.digits); // We need to do this here beacause super is not yet displayed nor activated, this sets the right valid state in super
		this.ccontrols.avatar.setvalid(this.state.valid);
	}
	modalquit() { // closes the edit modal screen
		if(!is.newtouch) return;
		
		super.blur();
		if(!this.state.rows) C_KEY.unbind(this.state.keys, this.ahandlers.keys);
		// document.activeElement.blur(); $("input").blur(); // not needed
		$(this.els.overlay).remove(); // keep this after the blur()
		if(vbs) vlog('mobframe.js','C_iFIELD', 'modalquit','eid:'+this.eids.ui);
	}
	
	// private
	avatar() { var display = this.state.digits||this.state.placeholder||''; if(this.state.rows) display = display.split('\n').join('<br/>'); return display; }
	newtouch() {
		
		if(vbs) vlog('mobframe.js','C_iFIELD','newtouch','eid:'+this.eids.ui+', label:'+this.state.label+', placeh:'+this.state.placeholder);
		
				var buttons = '<td>'+this.ccontrols.cartouche.display()+'</td>';
					var h1 = this.state.placeholder?this.state.placeholder:(this.state.label?C_XL.w(this.state.label):'');
				var title = '<td style="align:right;"><h1>'+h1+'</h1></td>';
			var row = '<tr>'+buttons+title+'</tr>';
		var header = '<table summary="details" style="width:100%; padding:0 0 1em 0;">'+row+'</table>';
		var mbody = '<div>'+super.display('alpha100')+'</div>';
		
		var style = 'z-index:20; position:absolute; top:2.5em; bottom:0; width:100%; overflow:hidden;';
		var overlay = '<div class="fs-field" id="'+this.eids.fs.overlay+'" style="'+style+'">'+header+mbody+'</div>';
		$('#body').append(overlay);
		
		
		this.ccontrols.cartouche.activate(); this.ccontrols.cartouche.enable(this.state.valid, 'confrm');
		this.els.collect(this.eids.fs);
		
		super.activate().focus(true);
		
		if(!this.state.rows) new C_KEY(this.state.keys, this.ahandlers.keys);
	}
	trackvalid(digits, statereport) { this.ccontrols.cartouche.enable(statereport.valid, 'confrm'); }
	cancel() { // the cancel icon has been hit, cancel any changes and revert to previous setting
		super.set(this.ccontrols.avatar.state.ui); // re-install the previous setting
		this.modalquit();
		if(vbs) vlog('mobframe.js','C_iFIELD', 'cancel','eid:'+this.eids.ui);
	}
	confirmed() { // the confirm icon has been hit
		if(!is.newtouch) return;
		if(vbs) vlog('mobframe.js','C_iFIELD', 'confirmed','eid:'+this.eids.ui+', digits:'+this.state.digits);
		super.blur();
		if(!this.state.rows) C_KEY.unbind(this.state.keys, this.ahandlers.keys);
		
		this.ccontrols.avatar.set(this.avatar());
		this.ccontrols.avatar.setvalid(this.state.valid);
		$(this.els.overlay).remove(); // keep this after the blur()
	}
	keys(keycode) {
		if(vbs) vlog('mobframe.js','C_iFIELD', 'keys','keycode:'+keycode);
		this.confirmed();
		return true;
	}
		
}

*/

var gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };

var genders = { english:(function(){ // builds object like { 0:'female', 1:'male', ... }
		var genders = {};
	for(var m in gendercode) genders[gendercode[m]] = m;
	return genders;
})() }

C_XL.d = new Array();


C_XL.ccss = function(oclass, csstype, options) { // options like { typeonly:bool, plural:bool, translate:bool }
		options = options||{};
	if(options.typeonly) {
		var label = '';
		switch(csstype) {
			case ccsstype.color: 	label = 'color'; break;
			case ccsstype.pattern: 	label = 'pattern'; break;
			case ccsstype.tag: 		label = 'tag'; break;
		}
		if(options.plural) label = label+'s';
		if(options.translate) return C_XL.w(label);
		return label;
	}
	var prefix = '';
	var postfix = '';
	switch(csstype) {
		case ccsstype.color: 	prefix = 'ccss color '; break;
		case ccsstype.pattern: 	prefix = 'ccss pattern '; break;
		case ccsstype.tag: 		prefix = 'ccss tag '; break;
	}
	switch(oclass) {
		case resaclass.appointment: 	postfix = 'app'; break;
		case resaclass.event: 			postfix = 'event'; break;
		case resaclass.fcalwide: 		postfix = 'fcal'; break;
		case class_visitor: 			postfix = 'visitor'; break;
		case class_note: 				postfix = 'note'; break;
		case class_task: 				postfix = 'task'; break;
		case class_chat: 				postfix = 'chat'; break;
		case class_file: 				postfix = 'file'; break;
	}
	return C_XL.w(prefix+postfix);
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   O N    S C R E E N    M O D A L
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
// With this class you can:
//
// the C_iMODAL class is bind to the C_KEY, because when you register key event on a given screen layer, 
// 		you don't want it to trigger key events at a lower layer

// P O S I T I O N N I N G
// 
C_iXY = function(element) {
		var x = 0; // top left corner position of element, versus left window edge
		var y = 0; // top left corner position of element, versus top window edge
		var e = element;
	
	// element position
	if(e.offsetParent)
		do { 
			x += e.offsetLeft; y += e.offsetTop;	
			if(e.scrollTop) y-=e.scrollTop; // take into account possible scroll positions of any element up to the window element
		} while (e = e.offsetParent);
	
	
	// element dimensions
	var h = 0;
	if(element.offsetHeight) h=element.offsetHeight;
		else if(element.style.pixelHeight) h = e.style.pixelHeight;
	var w = 0;
	if(element.offsetWidth) w= element.offsetWidth;
		else if(element.style.pixelWidth) w = e.style.pixelWidth;
		
	this.corners = { topLeft:{x:x, y:y}, topRight:{x:x+w, y:y}, bottomLeft:{x:x, y:y+h}, bottomRight:{x:x+w, y:y+h}	};
	this.elsize = { w:w, h:h };
}
C_iPOSITION = function(padElement, options, bodyElement) {
	// options is e.g { drop:{ ui:this.elements.ui }, offset:{ x:-20, y:-20 } }
	// options is e.g { mouse:{ event:mouseEvent }, offset:{ x:-10, y:-10 } }
	
	this.padxy = new C_iXY(padElement); 
	this.swap = { h:0, v:0 }; // 1 means the pad is swapped, horizontally or vertically
	this.display = { x:0, y:0 }; // position of the upper left corner of the pad
	this.offset = options.offset || { x:0, y:0 }; // an object like { x:-20, y:-20 }; 
	
	this.displayLimits = { x: C_iWIN.size.w - (this.padxy.elsize.w + this.offset.x) , y: C_iWIN.size.h - (this.padxy.elsize.h + this.offset.y) };
	
	if(options.drop) { // positionning & swap is relative to element on the screen, the pad is displayed dropped under the element (if no v or h swap)
		options = options.drop; 
		this.uixy = new C_iXY(options.ui); 
		this.dropAnchor();
	} else
	if(options.side) { // positionning & swap is relative to element on the screen, the pad is displayed at the right side of the element (if no v or h swap)
		options = options.side; 
		this.uixy = new C_iXY(options.ui); 
		this.sideAnchor();
	} else
	if(options.mouse) { // positionning & swap is relative to a click event on the screen
		options = options.mouse;
		this.mouse = { x:options.event.pageX, y:options.event.pageY };
		this.anchor = this.mouse; // to what spot the pad is hooked up
		this.mouseAnchor();
	} else
	if(options.screen) { // default to screen positionning
		this.screenAnchor(padElement, bodyElement);
	} else
		if(vbs) vlog('mobframe.js','C_iPOSITION','constructor',': no anchor defined');
}
C_iPOSITION.prototype = {
	setSwap: function() {// check if this element squeezes on the screen area, if not, swap it
		if(this.display.x > this.displayLimits.x) this.swap.h = 1;
		if(this.display.y > this.displayLimits.y) this.swap.v = 1;
	},
	setDisplayPosition: function() {// check if this element squeezes on the screen area, if not, swap it
		switch(this.swap.h) {
			case 0: this.display.x = this.anchor.x + this.offset.x; break;
			case 1: this.display.x = this.anchor.x - this.padxy.elsize.w - this.offset.x; break;
		 }		
		 switch(this.swap.v) {
			case 0: this.display.y = this.anchor.y + this.offset.y;	break;
			case 1: this.display.y = this.anchor.y - this.padxy.elsize.h - this.offset.y; break;
		 }
	},
	dropAnchor: function(padElement) { // in this mode, the Pad does not overlay the ui trigger element, it lays around it
		this.anchor = this.uixy.corners.bottomLeft; // to what spot the pad is hooked up
		this.setDisplayPosition(); // position to default anchor
		this.setSwap(); // check if swap if needed
		if(!(this.swap.h+this.swap.v)) return;
		var anchors = { 0:{0:this.uixy.corners.bottomLeft, 1:this.uixy.corners.topLeft}, 1: {0:this.uixy.corners.bottomRight, 1:this.uixy.corners.topRight} };
		this.anchor = anchors[this.swap.h][this.swap.v]; 
		this.setDisplayPosition(); // according to swap conditions and new anchor points around the ui
	},
	sideAnchor: function(padElement) { // in this mode, the Pad does not overlay the ui trigger element, it lays around it
		this.anchor = this.uixy.corners.topRight; // to what spot the pad is hooked up
		this.setDisplayPosition(); // position to default anchor
		this.setSwap(); // check if swap if needed
		if(!(this.swap.h+this.swap.v)) return;
		var anchors = { 0:{0:this.uixy.corners.topRight, 1:/*v swap*/this.uixy.corners.bottomRight}, 1:/*h swap*/ {0:this.uixy.corners.topLeft, 1:/*v swap*/this.uixy.corners.bottomLeft} };
		this.anchor = anchors[this.swap.h][this.swap.v]; 
		this.setDisplayPosition(); // according to swap conditions and new anchor points around the ui
	},
	mouseAnchor: function(padElement) { // in this mode, the Pad appears under the mouse click
		this.setDisplayPosition(); // according to default anchor
		this.setSwap();
		this.setDisplayPosition(); // according to swap conditions		
	},
	screenAnchor: function(padElement, bodyElement) {
		
		// Case A: the modal is in free size mode (size is defined by the content) >> body window will scroll if modal gets too big
		// Case B: the modal has a fixed size (size is alway defined for the body element!) >> overflow will scroll!
		
		var sizemode = { x:(bodyElement.style.width!='')?'fixed':'free', y:(bodyElement.style.height!='')?'fixed':'free' };
		if(sizemode.y == 'fixed') bodyElement.style.overflowY = 'auto'; /* overflow will scroll */
		if(sizemode.x == 'fixed') bodyElement.style.overflowX = 'auto'; /* overflow will scroll */		

		var size = { x:this.padxy.elsize.w, y:this.padxy.elsize.h }; // measures the full modal size
		var padding = { x:C_iWIN.size.w-size.x, y:C_iWIN.size.h-size.y };
		this.display = { x:(padding.x>>1)+this.offset.x, y:(padding.y>>2)+this.offset.y };
	}
}


function bodyscroll() {
	if(typeof window.pageYOffset != undefined) var scroll = window.pageYOffset;
	else if(typeof document.documentElement.scrollTop != undefined) var scroll = document.documentElement.scrollTop;
	else var scroll = document.body.scrollTop;
	return scroll;
};

// M O D A L     O B J E C T 
// 
C_iMODAL = function(html, callbacks, preset) { 

	// preset.css can be ['modal','pad','dp']
	//
	// Note: when the modal is created on a touch device, using iScroll, the C_iTABS control leaves 
	//   an empty display until activated (iScroll must be refreshed, see this.mrefresh()
	//
	this.ctrlname = 'C_iMODAL';
	var layer = C_iMODAL.layer;
	this.callbacks = callbacks; // { escape:, top:, left:, bottom:, right:, scrollstart: } all members are A_cb
	
	this.eids = { overlay:'mOver_'+layer, outset:'mOutset_'+layer, inset:'mInset_'+layer, header:'mHeader_'+layer, body:'mBody_'+layer, busy:'mBusy_'+layer  }; 
	this.elements = new A_el();
	
	var events = { escape:new A_cb(this, this.escape), scroll:new A_cb(this, this.scroll)
, tstart:new A_cb(this, this.tstart), tmove:new A_cb(this, this.tmove), tend:new A_cb(this, this.tend)
, up:new A_cb(this, this.up), move:new A_cb(this, this.move), down:new A_cb(this, this.down) }
	this.handlers = new A_hn(events);
	this.status = C_iMODAL.defauts.align(preset);
	this.interactivity = { dragging:false, mouse:false  }
	if(is.tactile && this.status.css=='modal') this.status.fullscreen = true; 
	
	if(this.status.position.drop||this.status.position.side) { // the modal is positionned relatively to another element on page (case of e.g. a drop down list)
		if(is.newtouch) { 
			this.status.size = { maxy:(C_iWIN.size.h-20)+'px' };
			this.status.position.drop = false;
			this.status.position.side = false;
		}
		
	} else { // the modal is in absolute positionning 
		if(this.status.position.offset.x == 0)
			this.status.position.offset.x += C_iMODAL.layer<<6; // avoid alignment of many modals opened
		if(this.status.position.offset.y == 0) {
				var yscroll = bodyscroll(); // put modal on visible body even when body is scrolled
			if(yscroll) this.status.position.offset.y += yscroll; 
			this.status.position.offset.y += C_iMODAL.layer<<6;
		} 
	}
	
	C_iMODAL.register[++C_iMODAL.layer] = this;
	
	if(this.status.embedded) { // that is used bu small.php for embedding the modal in a slide screen (touch interactivity on small devices)
		this.busy = function() {return this;}
		this.close = function() {return this;}
		this.mrefresh = function() {return this;}
		this.mposition = function() {return this;}
	}
	else if(this.status.autopop) this.pop(html);

	this.escapeCallback = new A_cb(this, this.escape);
	new C_KEY(C_KEY.code.s.escape, this.escapeCallback, 'C_iMODAL::layer '+C_iMODAL.layer); // keep this after layer increment
}
C_iMODAL.defauts = new A_df( { css:'modal', location:{x:0, y:0}, moves:false, fullscreen:false, autopop:true, embedded:false
, position:{ css:'', screen:true, offset:{x:0, y:0}}, size:{x:'', y:'', maxy:false } /*free size by default*/
, busy:false, scrolling:false  });
C_iMODAL.layer = 0;
C_iMODAL.register = new Array(); // we organize it like C_iMODAL.register[C_iMODAL.layer] = C_iMODAL instance
C_iMODAL.prototype = {
	// public (display & activate are called at construction)
	pop: function(html) {
		this.display(html).activate().show();
		C_iTIP.handlers.quit();
	},
	close: function() {
		this.remove();
		C_iWIN.cursor();
	},
	busy: function(onoff) {
		if(onoff && !this.status.busy) {
			var zindex = 1000+C_iMODAL.layer;
			var overlay = '<div class="modal-busy" id="'+this.eids.busy+'" style="position:absolute; z-index:'+zindex+'; top:0; left:0; width:100%; height:100%; overflow:hidden;"></div>';
			$(this.elements.inset).append(overlay);
			C_iWIN.cursor('wait');
		} else {
			var element = document.getElementById(this.eids.busy);
			if(element) $(element).remove();
			C_iWIN.cursor();
		}
	},
	scrollto: function(el, options) {
		if(is.tactile) { if(this.scrolly) this.scrolly.scrollToElement(el, 400); }
		else $(this.elements.body).scrollTo(el, options);
	},
	html: function(html) { // changing the content of the modal
		if(html.header !== undefined) if(this.elements.header) this.elements.header.innerHTML = html.header;
		if(html.body !== undefined) this.elements.body.innerHTML = html.body;
		this.mposition().mrefresh();
		return this;
	},
	mposition: function() { // lets the modified modal inner be replaced as required on screen
		var position = new C_iPOSITION(this.elements.inset, this.status.position, this.elements.body); // adjust size and position
		this.position(position.display.x, position.display.y);
		return this;
	},
	mrefresh: function() { // lets the modified DOM be displayed correctly in iScroll
		if(is.tactile) if(this.scrolly) this.scrolly.refresh();
		return this;
	},
	
	// private
	display: function(html) {
		var zindex = 100+C_iMODAL.layer;
		var style = this.status.css;
		
		var p = this.status.fullscreen?'fs-':'zi-';
		var c = { header: style+'-header', body: style+'-body', overlay: style+'-overlay'	// makes modal-body, or pad-body
			, shape: p+style+'-shape', inset: p+style+'-inset', outset: p+style+'-outset' } // makes zi-modal-inset, or modal-inset depending of modal style and fullscreen mode
		
		var header = html.header==undefined ? '' : '<div class="'+c.header+'" id="'+this.eids.header+'">'+html.header+'</div>';
		var body = '<div class="'+c.body+'" id="'+this.eids.body+'" style="position:relative;">'+html.body+'</div>'; // relative necessary for iscroll.
		var inset = '<div class="'+c.inset+' '+c.shape+'" id="'+this.eids.inset+'">'+header+body+'</div>';
		
		var outset; 
		if(this.status.fullscreen) // then modals are full screen
			outset = '<div class="'+c.outset+'" id="'+this.eids.outset+'" style="min-width:100%; min-height:'+C_iWIN.size.h+'px; position:absolute; z-index:'+zindex+'">'+inset+'</div>';
		else {
			outset = '<div class="'+c.outset+' '+c.shape+'" id="'+this.eids.outset+'" style="position:absolute; z-index:'+zindex+'; overflow:hidden;">'+inset+'</div>';
		}
		
		var overlay;
			var overstyle = 'display:none; position:absolute; z-index:'+zindex+'; top:0; bottom:0; left:0; width:100%; min-height:'+C_iWIN.size.h+'px;';	
			overlay = '<div class="'+c.overlay+'" id="'+this.eids.overlay+'" style="'+overstyle+'"></div>';

		$("body").append(overlay+outset); // note that outset is NOT INSIDE overlay, this avoids inheritance of overlay events (click)
		return this;
	},
	activate : function() {
		this.elements.collect(this.eids);

		if(!is.tactile) this.elements.body.onscroll = this.handlers.scroll;
		
		if(is.tactile && !this.status.fullscreen) { // TACTILE PADS that are NOT FULLSCREEN
			if(!this.elements.header) // modals with a header must be closed using buttons (BUG b001)
				this.elements.overlay.ontouchstart = this.handlers.escape;
			if(this.elements.header && this.status.moves) {
				this.elements.header.ontouchstart = this.handlers.tstart;
				this.elements.header.ontouchmove = this.handlers.tmove;
				this.elements.header.ontouchend = this.handlers.tend;
			}
		} else { // NOT TACTILE: always escapable using an overlay click
			$(this.elements.overlay).click(this.handlers.escape);	
			if(this.elements.header && this.status.moves) $(this.elements.header).mousedown(this.handlers.down);
		}
		// $(this.elements.overlay).click(function() { console.log('HIT OVERLAY')});
		return this;
	},
	show: function() {
		if(this.status.fullscreen) { 
			$(this.elements.overlay).show();
			$(this.elements.outset).css({left:0, top:0});
			window.scrollTo(0,0); // for longer list page, you scroll to the bottom and if you open a modal, the device does not scroll top to show the modal automatically
			// if(C_iMODAL.layer==1) // we leave level zero
				// mobminder.app.showdesk(false); // so to hide the desktop when we are in fullscreen modal mode (the desktop height was giving a bad scroll effect on iPad)
		} else	{
			$(this.elements.overlay).show();
			$(this.elements.header).width(this.status.size.x); // on web-kit, the width of the first div determines the outset width
			$(this.elements.body).width(this.status.size.x).height(this.status.size.y);
				var maxy = this.status.size.maxy; // if(is.small) maxy/=2; // is a string like '18em', cannot be devided
			if(this.status.size.maxy) { $(this.elements.body).css('max-height', maxy ); }
		
			var position = new C_iPOSITION(this.elements.inset, this.status.position, this.elements.body); // adjust size and position
			this.position(position.display.x, position.display.y);
		}
		
		if(is.tactile&&this.elements.body.innerHTML) { 
			var handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone) }) ;
			var options = { hScroll:false, bounce:true, momentum:true, scrollbars:true };
			this.scrolly = new IScroll(this.elements.body, options); // C_iMODAL
			this.scrolly.on('scrollStart', handlers.iScrolling);
			this.scrolly.on('scrollEnd', handlers.iScrolldone);
		}
		return this;
	},
	position: function(x,y) { // positionning the outset on the screen
		if(this.status.fullscreen) return;
		this.status.location.x = x;
		this.status.location.y = y;
		$(this.elements.outset).css({left:this.status.location.x, top:this.status.location.y});	
		return this;
	},
	vector: function(vector) {
		x = this.status.location.x + vector.x;
		y = this.status.location.y + vector.y;
		return this.position(x, y); 
	},
	remove: function() {
		C_KEY.unbind(C_KEY.code.s.escape, this.escapeCallback);
		C_KEY.cleanUpLayer(); C_iMODAL.layer--;
		$(this.elements.outset).remove();
		$(this.elements.overlay).unbind('click', C_iMODAL.click).remove();
		// if(this.status.fullscreen) if(C_iMODAL.layer==0) mobminder.app.showdesk(true); // we are back to level zero
		if(is.tactile) if(this.scrolly)	this.scrolly.destroy();
	},
	
	// handlers
	escape: function() {
		C_iTIP.handlers.quit(); 
		var remove = true;
		if(this.callbacks.escape) remove = this.callbacks.escape.cb();
		if(remove) this.remove();
		return false; /* do not propagate to underlying layers */
	},
	scroll: function(e) {
		var scrollPosition = this.elements.body.scrollTop;
		var scrollMax = this.elements.body.scrollHeight-this.elements.body.clientHeight;
		if(scrollPosition<=0) {
			if(this.callbacks.top) this.callbacks.top.cb();
			if(this.callbacks.left) this.callbacks.left.cb();
		}
		if(scrollPosition>=scrollMax) {
			if(this.callbacks.bottom) this.callbacks.bottom.cb();
			if(this.callbacks.right) this.callbacks.right.cb();
		}
	},
	iScrolling: function() { // iScroll events - tactile only - 
		if(!this.status.scrolling) { // calls only once above
			if(this.callbacks.scrollstart) this.callbacks.scrollstart.cb();
			this.status.scrolling = true;
		}
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.status.scrolling = false;
		return true;
	}, 
	
	// event handling for fingers
	tstart: function(e) { 
		if(this.status.scrolling) return true;
		if(e.touches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault(); var touch = e.touches[0]; 
		return this.down(touch);	
	},
	tmove: function(e) { 
		if(this.status.scrolling) return true;
		if(e.touches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault(); var touch = e.touches[0];
		return this.move(touch); 
	},
	tend: function(e) { 
		if(this.status.scrolling) return true;
		if(e.changedTouches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault();
		return this.up(); 
	},
	
	// event handling for mouse
	down: function(e) {
		this.interactivity.dragging = true;
		$(this.elements.outset).addClass('modal-moving');
		$(this.elements.overlay).addClass('modal-moving');
		this.interactivity.mouse = {x:e.pageX, y:e.pageY};
		if(!is.tactile){ // do nothing, all handlers hang to the header element
			if(this.elements.header) {
				$(this.elements.outset).mouseup(this.handlers.up).mousemove(this.handlers.move);
				$(this.elements.overlay).mouseup(this.handlers.up).mousemove(this.handlers.move);
			}
		}
		return false;
	},
	up: function() {
		this.interactivity = { dragging:false, mouse:false  }
		$(this.elements.outset).removeClass('modal-moving');
		$(this.elements.overlay).removeClass('modal-moving');
		
		if(!is.tactile){ // do nothing, all handlers hang to the header element
			if(this.elements.header) {
				$(this.elements.outset).unbind('mouseup').unbind('mousemove');
				$(this.elements.overlay).unbind('mouseup').unbind('mousemove');
			}
		}
		return false;
	},
	move: function(e) {
		if(this.interactivity.dragging) { 
			var vector = { x:e.pageX-this.interactivity.mouse.x, y:e.pageY-this.interactivity.mouse.y };
			this.vector(vector);
		}
		this.interactivity.mouse = {x:e.pageX, y:e.pageY};
		return false;
	},
}
C_iMODAL.closeall = function() { 
	for(var l = C_iMODAL.layer; l;l--) 
		C_iMODAL.register[l].close(); 
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H A N D L I N G     K E Y B O A R D
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
// With this class you can:
// - Attach many handlers to the same key (e.g. ESC) for the modal and for the contextual menu on the modal
// - Attach many handlers to the same key and function (using A_cb, the right instance is called)
// - Unbind them discretionnarily (even if the same function was passed, as long as the o_callback is different)
//
// Handlers are called last added first
// Propagation is managed from handler to handler, up to the browser application
//

C_KEY = function(keys, onhit, client) { // This is how you bind a callback function to a given keyboard key. Watch the return value of your call back function!
	this.onhit = onhit; 	
	var layer = C_iMODAL.layer;
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
	var r = C_KEY.register[C_iMODAL.layer]; if(!r) return false; // in the current layer, there is no callback defined
	for(x in keys) {
		var k = keys[x]; // the key for which we remove the callback
		if(!r[k]) continue; // there is no handler associated with the keyboard key, may be already removed
		else
			for(var handler in r[k])
				if(r[k][handler].onhit == onhit) { // remove the right handler
					if(vbs) vlog('mobframe.js','C_KEY','unbind','removing key '+k+' on layer '+C_iMODAL.layer);
					r[k].splice(handler,1);
				}
	}
	return false;
}
C_KEY.cleanUpLayer = function() { // removes all associated callbacks from the layer
	if(vbs) vlog('mobframe.js','C_KEY','cleanUpLayer','cleaning up layer '+C_iMODAL.layer);
	var r = C_KEY.register[C_iMODAL.layer]; if(!r) return false; // in the current layer, there is no callback defined
	delete C_KEY.register[C_iMODAL.layer];
};
C_KEY.count = 0;
C_KEY.register = new Array(); // we organize it like C_KEY.register[C_iMODAL.layer][key] = C_KEY instance
C_KEY.onkeydown = function(e) {	
	var keycode = (e.keyCode) ? e.keyCode : e.which; // MSIE compatibility
	if(keycode == 16 || keycode == 17 || keycode == 18) return false;
	var checkCode = C_KEY.specials.check(e);
	var lastPropagation = true;
	var r = C_KEY.register[C_iMODAL.layer]; if(!r) return lastPropagation; // in the current layer, there is no callback defined
	
		if(vbs) vlog('mobframe.js','C_KEY','onkeydown','checking '+keycode+' on layer '+C_iMODAL.layer);
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
//   DISPLAY ITEMS IN AN ORGANIZED TABLE
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
//

function C_iTABLE(eid, items, preset) {
	this.items = items || new A_ct(); // is mandatory a A_ct() object containing regular html objects having a display() and an activate()
	this.eids = { eid:eid, wtbl:eid+'_wtbl' };
	this.elements = new A_el();
	this.state = C_iCRESTA.defauts.align(preset = preset || {}); 
}
C_iTABLE.defauts = new A_df( { maxcols:4, maxrows:12 } );
C_iTABLE.prototype = {
	// public
	display: function(css) { 
		this.items.reset(); // allows to redraw on the fly (this.refresh redraws only the items in the table)
		var table = '<table id="'+this.eids.wtbl+'" class="C_iTABLE '+(css||'')+'">'+this.rows()+'</table>';
		return table;
	},
	activate: function() { 
		if(vbs) vlog('controls.js', 'C_iTABLE','activate','eid:'+this.eids.eid+', items count: '+this.items.cnt());
		this.elements.collect(this.eids);
		if(!this.elements.wtbl) return this; // not displayed yet
		this.items.reset().activate(); // reset because some controls have a delayed drop() or pop() or open() function (e.g. C_iDDWN) for which they re-activate the menu
	},
	isdisplayed:function() { return A_el.isdisplayed(this.eids.wtbl); },
	refresh: function(newitems) {
		if(vbs) vlog('controls.js', 'C_iTABLE','refresh','new items:'+((newitems===undefined)?'no':'yes, count:'+this.items.cnt()));
		if(newitems) this.items = newitems; else this.items.reset();
		if(this.elements.wtbl) // the control was not displayed
			this.elements.wtbl.innerHTML = this.rows();
		this.items.activate();
	},
	
	
	// private
	rows: function() { // display with top/bottom mode: <div>title</div><table>control</table>
			
			var i = this.items.cnt(); if(!i) return '<tr><td></td></tr>';
			
		// size the table
			var mxr = this.state.maxrows, mxc = this.state.maxcols; 
			var c = 1+((i/mxr)|0); // final size column count, at least 1 column
			var r = i>mxr ? mxr : i; // final size rows count
		if(c>mxc) c = mxc; // max cols reached, extend the number of rows
		r = 1+((i/c)|0);
			var e = r*c-i; // empty cells remaining in table when all items are placed
			var f = c-e; // number of columns that are fully filled, other columns miss each one item
		
		if(vbs) vlog('controls.js', 'C_iTABLE','rows','eid:'+this.eids.eid+', i:'+i+', c:'+c+', r:'+r+', e:'+e);
		
		var tr, td, x, l;
		var tds = new C_regS('grid');
		for(td = 0, x = 0, l = r; td<c; td++, l = (td<f)?r:r-1 ) // we keep empty cells in the bottom row
			for(tr = 0; tr<l; tr++, x++)
				if(x<i) tds.grid.add(tr, td, '<td class="itable">'+this.items[x].display()+'</td>');
		
		var rows = new Array(), rhtml; 
		for(tr = 0, rhtml = ''; tr<r; tr++, rows.push(rhtml) ) // draw the table row by row
			for(td = 0, rhtml = ''; td<c; td++)
				rhtml += tds.grid.get(tr,td) || '<td></td>';
			
		return '<tr class="itable">'+rows.join('</tr><tr>')+'</tr>';
	}
}

