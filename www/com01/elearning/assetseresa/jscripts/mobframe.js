
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
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T H I S    F I L E    i s    I N T E N T I O N A L Y     E N C O D E D    i n   U T F 8  !
//

	
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D E B U G G I N G     S E R V I C E
//
var measureAjax = false; // execution time round around and local treatment
var measurePlitem = false; // measure the display time of entering plitems data
var measureStreaming = false;

var verboseOn = false; // turns on/off the console.log from function vlog();
var traceCallbacks = false;
var fileVerbose = false; // default: false (verbose for all controls in a given file)



////// filters for verbose function:
//
//
	//// dBaccess
var monitorDBaccess = { 0:'C_dS_trackingCC', 1:'C_dS_reservation', 2:'C_dS_resource', 3:'C_dS_context', 4:'C_dS_attendee' };
	

	//// easy & framework basics
var monitorFramework = {  0:'C_iMENU', 1:'A_ct', 3:'C_KEY', 4:'T_bar', 5:'C_iTABS' }; // 0:'A_ct', 1:'A_cb', 2:'C_iMODAL',, 4:'C_iCLIK', 5:'C_iWIN', 6:'C_iBUTTON'
var monitorCueCtrls = { 0:'C_iDDWN', 1:'C_iSELECT', 3:'C_iRANGE', 4:'C_iCUE', 5:'C_iINOUT', 6:'C_iOFFD', 7:'C_iSPAN' };
var monitorCresta = { 0:'C_iCRESTA', 1:'C_iACPICK', 2:'C_iAC', 3:'C_iCLIK', 4:'C_iDDWN', 5:'C_iMENU', 6:'C_iTABLE' };
var monitorOptions = { 0:'C_iSELECT' };
var monitorDragDrop = { 0:'C_iDRAG', 1:'C_iDROP', 2:'P_hrow', 3:'P_htype', 4:'P_horiz' };
var monitorPlusClass = { 0:'C_iPLUS', 1:'C_iDRAG', 2:'C_iDROP' };
var monitorTooltip = { 0:'C_iTIP' };
var monitorMenu = { 0:'C_iCLIK', 1:'C_iMENU', 2:'C_iDDWN', 3:'C_iAC' };
var monitorCommToggles = { 0:'C_iCOMM', 1:'M_RESA', 2:'C_iTRIGGER' };
var monitorAC = { 0:'C_iAC', 1:'C_iMENU' /*, 2:'C_iDDWN'*/ };
	

	//// modals
var monitorModals 			= { 0:'M_RESA', 1:'M_VISI', 2:'M_RESC', 3:'C_iMSG', 4:'C_iARRAY', 5:'C_iDRAG', 6:'C_iDROP', 7:'C_iCLIK'};
var monitorModalResa 		= { 0:'M_RESA', 1:'C_iINOUT', 2:'C_iCUE', 3:'C_iSPAN', 4:'C_iDPpop', 5:'C_iDP', 6:'C_iOFFD', 7:'C_iCSS', 8:'C_iMENU', 9:'C_iDDSTACK', 10:'C_iCLIK', 11:'C_iEDIT', 12:'C_iCRESTA' /*, 10:'C_dS_reservation', 11:'C_dS_attendee', 12:'C_dS_att_visitor', 13:'C_dS_performance'*/};
var monitorModalResaSerie 	= { 0:'M_RESA', 2:'C_iDPpop', 3:'C_iDP', 4:'C_iRECUR', 5:'C_iWDAYs' };
var monitorModalResaPayments= { 0:'M_RESA', 1:'M_PAYMENT', 2:'C_dS_payment', 3:'C_iBILL', 4:'C_iPAY', 5:'M_iPairGoCrypto' };
var monitorModalRscr 		= { 0:'M_RESC', 1:'C_iPLUS', 3:'M_Huser', 4:'M_Hourly', 5:'C_iDP', 6:'C_iOFFD', 7:'C_iCSS', 9:'C_iYEAR', 2:'C_dS_reservation' };
var monitorHourlies 		= { 0:'M_SHADOW', 1:'M_NewHourly', 2:'P_Sticker', 3:'P_column', 4:'P_hourly', 5:'P_GRID', 6:'C_iRANGE', 7:'C_iCUE'};
var monitorModalTboxing 	= { 0:'M_TBOXING', 1:'C_iSKIN' };
var monitorModalFile 		= { 0:'M_file', 1:'C_iCSS', 2:'C_iFILE', 3:'C_iDQS' };
var monitorModalLogin 		= { 0:'M_LOGIN', 1:'C_iSTAFF', 2:'C_iEPREV',3:'C_iIMG', 4:'C_iEBOOK' };
var monitorModalVisitor 	= { 0:'M_VISI', 2:'C_iCSS' };
var monitorModalTemplate 	= { 0:'M_SMST', 1:'C_iTRIGGER', 2:'C_iACTLOGIN' };
var monitorModalWorkcode 	= { 0:'M_WRKCD', /*1:'C_iCRESTA', 2:'M_RESA', 3:'C_dS_reservation'*/ };
var monitorModalResaTAGs 	= { 0:'M_RESA', 4:'C_iCSS' }; // 2:'C_iTABLE', 3:'C_iTEM'
	
	
	//// backoffices
var monitorVisitorsPage = { 1:'C_FILTERTABS', 2:'Date'};
var monitorBackVisi = { 0:'C_backVISI', 1:'C_iTABLE', 2:'C_iSTAFF', 4:'C_iARRAY' };
var monitorBackStats = { 0:'C_backSTAT', 1:'C_iDP', 2:'C_iARRAY', 3:'C_iDRAG', 4:'C_iDROP' };
var monitorBackoffice = { 2:'C_backPREFS', 3:'C_iRANGE', 4:'C_iPLUS', 5:'M_CCSS', 6:'M_LOGIN', 7:'M_SMST', 8:'C_iCUE', 9:'C_GDLN', 10:'M_TBOXING', 11:'C_iDATEPRESET' };
var monitorPreferences = { 0:'C_iONOFF' };
var monitorConnections = { 0:'C_backCNX', 1:'C_iARRAY', 2:'C_iAC' };
var monitorArchives = { 0:'C_backARCH', 1:'C_iARRAY', 2:'C_iSTAFF', 3:'C_iACPICK', 4:'C_iDP' };
var monitorFinder = { 0:'C_backFIND', 1:'C_iARRAY', 2:'C_iSTAFF', 3:'C_iACPICK', 4:'C_iDP', 5:'M_duplacc', 6:'C_iACTIONS' };


	//// application
var monitorHorizontal = { 0:'C_iMOB', 1:'C_iDNAV', 2:'P_AgendaHVL', 3:'P_horiz', 4:'P_htype', 5:'P_hrow', 6:'C_iPLAN', 9:'P_RULER', 10:'P_Vertical'};
var monitorVertical = { 0:'C_iMOB', 2:'P_AgendaHVL', 3:'P_Vertical', 4:'P_column', 5:'C_iPLAN', 6:'P_RULER', 7:'P_GRID' }; //, 4:'P_column',, 1:'R_search'
var monitorListView = { 0:'C_iMOB', 1:'R_search', 2:'C_iPLAN', 3:'P_AgendaHVL', 4:'P_List'};

var monitorStickers = { 0:'P_Sticker', 1:'P_GRID', 2:'P_column', 3:'P_horiz', 4:'P_htype', 5:'P_Vertical', 6:'P_AgendaHVL', 7:'P_hrow', 8:'C_iPLAN'};
var monitorSurferSwitch = { 0:'T_login', 1:'C_iMOB', 2:'T_logged', 3:'C_iPLAN', 4:'R_search', 5:'C_XL', 6:'T_bar' };
var monitorNotesAndTasks = { 0:'T_notes', 1:'M_NOTE', 2:'T_tasks', 3:'M_TASK', 4:'C_iPERIOD', 5:'C_iTDONE', 6:'M_VISI' };
var monitorChat 	= { 0:'T_chats', 1:'M_chat', 2:'C_iUSERS', 3:'C_iTHREADS', 4:'C_iCHATdog', 5:'C_iTHREADSdog', 6:'C_iWatchdog' };
var monitorSearch 	= { 0:'R_search', 1:'C_iACPICK', 2:'C_iAC', 3:'C_iPLAN', 4:'C_iAMPM', 5:'C_iBEFORE', 6:'C_iSLOT', 8:'C_iDUR', 9:'A_ct' };
var monitorTopMenu 	= { 0:'C_iMOB', 1:'T_bar', 2:'T_login', 3:'T_notes', 4:'T_tasks', 5:'C_iCAL', 6:'T_backoptions', 7:'T_dp' };
var monitorEresa 	= { 0:'e_MOB', 1:'C_eSearch', 2:'C_eRESA', 3:'C_eREG', 4:'C_eVisitor', 5:'C_eCheckIn', 6:'C_iSTAFF', 7:'C_eProcess', 8:'C_iSLIDE' };
var monitorProximus = { 0:'e_MOB', 1:'C_pSearch', 2:'C_pRESA', 3:'C_pREG', 4:'C_pVisitor', 5:'C_pVident', 6:'C_iSTAFF' };

	//// application
var monitorSMStemplates = { 0:'C_dS_smsTemplate', 1:'C_iCOMM' };


	//// small utilities apps
var synctest = { 0:'sync_MOB', 1:'C_iCRESTA', 2:'C_iFILE', 3:'C_iCHECKIN', 5:'C_SYNCinit', 6:'C_SYNCupdate', 7:'C_SYNCbackup', 8:'C_iONOFF' };
var smstest = { 0:'sms_MOB', 5:'M_SMST' }; // , 1:'C_iEDIT'

var smartphones1 = { 0:'s_MOB', 1:'C_sDP', 2:'C_sVslider', 3:'P_Vertical', 4:'P_column', 5:'P_Sticker', 6:'C_iEDIT', 7:'C_iFIELD', 8:'M_RESA' };
var smartphones2 = { 0:'C_sCalview', 1:'C_sVslider', 2:'P_Vertical', 3:'C_tMODAL', 4:'C_sDP', 5:'C_sDF' };
var smartphones3 = { 0:'C_iAC', 1:'C_iACPICK', 2:'C_iFIELD', 3:'C_iEDIT', 4:'C_iDDWN', 5:'C_iMENU', 6:'C_KEY' };

var C_iAC_multiSelect = { 0:'C_iAC', 1:'C_iACPICK', 2:'C_iFIELD', 3:'C_iEDIT', 4:'C_iDDWN', 5:'C_iMENU', 6:'C_KEY', 6:'C_iCLIK' };



	//// synchronization
var synchro = { 0:'C_dbSynchro', 1:'C_iSYRSC', 2:'C_iSYCSS' }



////// function mode setting
//
//
	var classOnlyVerbose = monitorSurferSwitch; // (defines which filter to apply) default: false (verbose for all classes)
	// var classOnlyVerbose = monitorBackoffice; // (defines which filter to apply) default: false (verbose for all classes)
	
	var activate = 'activate';
	var functionOnlyVerbose = false; // default: false (verbose for all functions)
	
	
	
warning = function(file, classid, functionid, msg, more) {
	if(!verboseOn) return; // then shut up
	let combo = 'WARNING - ['+file+']'+tab+classid+'::'+functionid+'() '+msg;
	if(more) console.log(combo,more); else console.log(combo);
}

var vlogcount = 0, vbs = verboseOn, vbspad = '    | ';
vlog = function(file, classid, functionid, msg, more, raw) {
	// if(!verboseOn) return; // then shut up
	if(fileVerbose) {
		if(!!file.search(fileVerbose)) return false;
	}
	let classDisplay = false;
	
	for(let x in classOnlyVerbose)
		if(classid==classOnlyVerbose[x]) classDisplay = true;
	if(traceCallbacks) if(classid=='A_cb') classDisplay = true;
		
	if(classOnlyVerbose && !classDisplay) return;
	
	if(functionOnlyVerbose) if(functionid!=functionOnlyVerbose) return;
	
	let combo = (vlogcount++)+' ['+file+']'+' - '+classid+'::'+functionid+'('+msg+')';
	if(!more) { 
		console.log(combo);
	} else {
		for(let a in arguments) {
			if(a==3) console.log(combo);
			if(a<4) continue;
			console.log(tab+'|'+arguments[a]); // displays any subsequent arguments passed from more on
		}
	}
	if(raw) console.log(raw);
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   G E N E R I C     D E S I G N     T O O L s 
//


//////////////////////////////////////////////////////////////////////////////////////////////
//
omerge = function(o1, o2) { // o1 and o2 are object like { me:1, you:2 }, returns a new object
	let m = {};
	for(let x in o1) m[x] = o1[x];
	if(o2) for(let x in o2) m[x] = o2[x];
	return m;
}
Object.protomerge = function(child) { this.prototype = omerge(this.prototype, child.prototype) };

//////////////////////////////////////////////////////////////////////////////////////////////
//
String.prototype.remove = function(a) {
	let ax=a.replace('/','\\/'); // special chars like '/' must be escaped in regular exps
	let exp = '/'+ax+'*/gi';
	let regexp = eval('new RegExp('+exp+')');
	return this.replace(regexp,'');
}
String.prototype.between = function(a, b) { // returns what is bewteen a and b
	let ax=a.replace('/','\\/'), bx=b.replace('/','\\/'); // special chars like '/' must be escaped in regular exps
	let exp = '/(?='+ax+')(.*?)(?='+bx+')/';
	let regexp = eval('new RegExp('+exp+')');
	let where = this.search(regexp);
	if(where >= 0) return RegExp.lastMatch.remove(ax);
}
String.prototype.excise = function(a, b) { // extracts what is bewteen a and b, a and b included
	let ax=a.replace('/','\\/'), bx=b.replace('/','\\/'); // special chars like '/' must be escaped in regular exps
	let exp = '/(?='+ax+')(.*?)(?='+bx+')/';
	let regexp = eval('new RegExp('+exp+')');
	let where = this.search(regexp);
	let match = RegExp.lastMatch;
	if(where >= 0) {
		return { match:match+b, rest:this.remove(match+b) };
	}
	return { match:'', rest:this };
}
String.prototype.extract = function(tagIn, tagOut) { // same as .excise but not using complex RegExp
	
		let regExpIn = new RegExp(tagIn);
		let regExpOut = new RegExp(tagOut);
		let tagInPos = regExpIn.exec(this);
	if(!tagInPos) return { match:'', rest:this };
	
	tagInPos=tagInPos.index;
	let tagOutPos = regExpOut.exec(this);
	if(!tagOutPos) return { match:'', rest:this };
	tagOutPos=tagOutPos.index;
	
		let tagInLen = tagIn.length;
	let l = tagOutPos-tagInPos-tagInLen;
		let match = this.substr(tagInPos+tagInLen,l);
		
	return { match:match, rest:this.replace(tagIn+match+tagOut,'') }; // tags are not in the returned strings
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase()+this.slice(1);
}
String.prototype.composition = function() { // returns one of ['', 'alpha', 'alphanum', 'num']
    let is = '';
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
	let CSSrules, currentRule;
	let CSSSheets = document.styleSheets;
	let i, j; 
	for(j=0;j<CSSSheets.length;j++){
	for(i=0;i<CSSSheets[j].cssRules.length;i++){
			currentRule = CSSSheets[j].cssRules[i];
			if(currentRule.selectorText==rule) {
				let value = currentRule.cssText.remove(' ').between(attribute+':',';');
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
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_cb = function A_cb(context, call, correlator, busy, delay) { // busy is an A_cb called while delay is running
	this.context = context;	// the object instance context to be called in
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
		let args = new Array(); for(let x=0; x<arguments.length; x++) args.push(arguments[x]);
		return args;
	},
	cb: function() {
		let args = this.argsarray.apply(this, arguments);
		if(this.delay) { args.unshift(this.delay); return this.dcb.apply(this, args); }
		if(this.has.correlator) args.unshift(this.correlator); // correlator comes as first argument in the callback when it is defined
		if(this.call) { if(this.call.name) {
			/* the function must have a name */ 
			if(vbs) vlog('mobframe.js','A_cb','do','callback:'+this.call.name);
			return this.call.apply(this.context, args);
		} } else console.log('A_cb::cb - missing callback function, undefined in context:'+newline,this.context);
	},
	dcb: function(delay) { // delayed callback .dcb(600, jsDate) will deliver jsDate to the handler
		if(this.timeout) clearTimeout(this.timeout);
			else if(this.busy) this.busy.cb();
		let args = this.argsarray.apply(this, arguments);
		// args[0] = this; args.unshift(delay); args.unshift(A_cb.out);
		// this.timeout = setTimeout.apply(null, args);  <= was removed, setTimeout on MSIE does not pass the third argument...
			let that = this;
		this.timeout = setTimeout(function() { A_cb.out(that, args[1], args[2], args[3])}, delay);
	},
	continu: function() {
		this.timeout = false;
		let args = this.argsarray.apply(this, arguments);
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
			let args = new Array(); for(let x=0; x<arguments.length; x++) args.push(arguments[x]); args.unshift(delay);
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
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_df = function(defaults, depth, path) { 
	defaults = defaults||{}; 
	// this function is called one time for each object class defined in datasets.js
	// debug recursivity concerns
	// var depth=depth||0; var path=path||(new Array()); path.push(defaults);
	// if(depth>6) { console.log('depth:'+depth+tab,defaults); for(let x in path) console.log(tab+'path'+x+':',path[x]); throw "stop execution"; }
	
	// preapre a lean default object
	for(let x in defaults) {
		let d = defaults[x];
		if(typeof(d)=='object') {
			let isAdf = (d instanceof A_df);
			let isDte = (d instanceof Date); 
			if(isAdf||isDte) { this[x] = d; }
				else this[x] = new A_df(d, ++depth, path); // when preset is { a:1, b:2, c:{you:3, me:4}} we make it { a:1, b:2, c:A_df({you:3, me:4})}
		}
		else {
			this[x] = d; // scalar, string, boolean or Date	
			let t = typeof this[x];
			switch(t) {
				case 'string': t = '"'; break;
				default: t = '';
			}
			this._t[x] = t; // (*df01*)
		}
	}
}
A_df.prototype = { 
	_t : {}, // members type, see constructor (*df01*)
	align: function(preset) { // fullfills preset with members of this o_defaults object, values in preset have priority
		preset = preset||{}; 
		for(let i in this) { if(i in A_df.prototype) continue; // no action for own prototype functions
				let d = this[i];
			if(d instanceof A_df) { preset[i] = d.align(preset[i]); continue; } // recurse
			if(preset[i]===undefined) { // default values take place in the preset
				if(typeof(d)=='string') preset[i] = d.slice(0); // string is copied, preventing the instance to change the default string by reference
					else preset[i] = d;
			}
		}
		return preset;
	},
	apply: function(o) { // fullfills object o with members of this o_defaults object, values in object have priority
		for(let i in this) 
			if(i in A_df.prototype) continue; // no action for prototype functions
			else if(o[i]==undefined) o[i] = this[i];
		return o;
	},
	mergeto: function(o, m, startpos) { 
		// reads arguments and make object members from them, member name is taken from defaults member name, sequence must be respected
		// this function is called as many times as object instances are droppped from the server side
		let a = startpos||0, v; m=m||[];
		for(let i in this) 
			if(i in A_df.prototype) continue; // no action for prototype functions
			else {
				v = m[a++]; // m can be undefined (new object relying entirely on default values)
				v = (v===undefined) ? this[i] : v; // v can be a zero number
				if(typeof this[i] == 'number') o[i] = v|0; // cast to integer	
				else { // treat as a string
					if(!v.replace) { console.log('A_df::arguments - ', v,o);  }
					o[i] = v.replace(/\\n/gi,newline); // back from server, cr characters are coming like \n (because they were posted like that)
					o[i] = o[i].replace(/\\(.)/mg, "$1"); // strip slashes, see (*as*)
				}
			}
		return o;
	},
	array: function(preset) { // returns all items values in an array format, like [cueIn value, cueOut value, etc..], see example of usage here (*df02*)
		let r = [];
		for(let i in this) { if(i in A_df.prototype) continue; // no action for own prototype functions
				let d = this[i]; // default value
			if(d instanceof A_df) { r.push( d.array() ); continue; } // recurse
			if(preset[i]===undefined) {	// then take the default		
				if(typeof(d)=='string') r.push( d.slice(0)); // string is copied, preventing the instance to change the default string by reference
					else r.push(d);
			} else { // then take what is passed in the preset
				r.push(preset[i]);
			}
		}
		return r;
	}
}



// var d = new A_df({ me:'pascal', you:'antoine', them:new A_df({him:'lucas',her:'lily'}) });
// var s = d.align({me:'me', them:{him:'him'}});
// console.log(s);

//////////////////////////////////////////////////////////////////////////////////////////////
//
//      R E C U R S I V E   R E G I S T E R S  -  US/EU PATENT PENDING P.VANHOVE
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
C_r = function(sort) { 
	if(sort) this.order = { 
		is:new Array(), sort:sort, sortf:((typeof(this.sort))==='function')?this.sort:function(a,b){ if(a > b) return 1; else return -1; },
		insert:function(i) { this.is.push(i); this.is.sort(this.sortf); },
		drop:function(k) { let x = this.is.indexOf(k); this.is.splice(x, 1); }
	};
}
C_r.prototype = {
	argsarray: function() { let args = new Array(); for(let x=0; x<arguments.length; x++) args.push(arguments[x]);	return args; },
	add:function(key, i) { // last argument i is the instance to place in the structure
		let args = this.argsarray.apply(this, arguments);
		if(args.length==2) { if(this.order) this.order.insert(key); return this[key] = i; } // inserts an instance
		if(args.length==1) if(key in this) {return this;} else { // prepares a level, no end instance added
			this[key] = new C_r(this.order?this.order.sort:false); return this; 
		} 
		let k = args.shift(); if(!(k in this)) { // develop the tree
			if(this.order) this.order.insert(k);
			this[k] = new C_r(this.order?this.order.sort:false);
		}
		return this[k].add.apply(this[k], args);
	},
	get:function(key) { // returns a single item or a portion of the tree structure (or the complete tree structure if key == undefined)
		let args = this.argsarray.apply(this, arguments);
		if(args.length<=1) return this.els(key);
		let k = args.shift(); if(k in this) return this[k].get.apply(this[k], args);
		return undefined;
	},
	del: function(itemORnode, level) { // deletes every ends equal to item, or parts of the tree, or one part of the tree at given level
		for(let x in this) if(this[x] instanceof C_r) this[x].del(itemORnode, level?--level:level); // begin with recursing sub levels of C_r instances
		for(let x in this) if(x in C_r.prototype) continue; else if(this[x] == itemORnode) { if(this.order) this.order.drop(x);  delete this[x] }; // delete ends
		if(!level) for(let x in this) if(x in C_r.prototype) continue; else if(x==itemORnode) delete this[x]; // delete parts of the tree (item is a node) when level reaches zero, or any level if level is undefined
	},
	count:function(key) { // counts number of branches at the key node
		let args = this.argsarray.apply(this, arguments);
		if(args.length==0) { let c=0; for(let m in this) if(m in C_r.prototype) continue; else c++; return c; }
		let k = args.shift(); if(k in this) return this[k].count.apply(this[k], args);
		return 0;
	},
	ends: function(key) { // counts number of open end items below the key node
		let args = this.argsarray.apply(this, arguments);
		if(args.length==0) return this.noe();
		// let k = args.shift(); return this[k].ends.apply(this[k], args); // modified Jan7 2015 
		let k = args.shift(); 
		if(k in this) {
			if(this[k] instanceof C_r) return this[k].ends.apply(this[k], args);
			else return 1;
		}
		return 0;
	},
	keys: function(key) { // returns keys list, optionaly under a key sequence
		let args = this.argsarray.apply(this, arguments);
		if(args.length==0) {
			let k = [];
			for(let x in this) 
				if(this[x] instanceof C_r) k = k.concat(this[x].keys());
				else if(x in C_r.prototype) continue;
					else k.push(x);
			return k;
		}
		let k = args.shift(); if(k in this) return this[k].keys.apply(this[k], args);
		return undefined;
	},
	flush: function() {
		for(let x in this) if(x in C_r.prototype) continue; else delete this[x]; // delete ends
	},
	
	// private 
	els: function(key) {
		let target = (key===undefined) ? this : this[key];
		if(target instanceof C_r) { // get concerns a portion of the tree structure
			let get = new Array()
			for(let m in target) if(m in C_r.prototype) continue; else get[m] = target.els(m);
			if(this.order) return { order:target.order.is, keys:get }; else return get;
		}
		return target; // get concerns an open end item
	},
	noe: function() {// counts number of open end items from this node on
		let c = 0;
		for(let x in this) 
			if(this[x] instanceof C_r) c += this[x].noe();
			else if(x in C_r.prototype) continue;
				else c++;
		return c;
	},
	order:false
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// 
C_regS = function(reg1, reg2, reg3, reg4) {
	for(let x=0; x<arguments.length; x++) {
		let arg = arguments[x]; let name = false; let sort = false;
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
		for(let x in this) if(this[x] instanceof C_r) this[x].del(item);
	},
	flush: function(name) { // re-initializes a complete register or all registers
		let sort;
		if(name in this) {
			sort = this[name].order?this[name].order.sort:false;
			delete this[name]; this[name] = new C_r(sort); 
		} else {
			for(let name in this) if(this[name] instanceof C_r)	{
				sort = this[name].order?this[name].order.sort:false;
				delete this[name]; this[name] = new C_r(sort);
			}
		}
	}
}


//TRY C_regs


/*
console.log('TEST---');
var reg = new C_r(true);
reg.add(5,'C','pascal');
reg.add(5,'B','antoine');
reg.add(5,'A','jeremy');
reg.add(2,'A','sofie');
reg.add(3,'B','danielle');
reg.add(3,'C','lise');
reg.add(2,'X','olivier');

console.log('sorted serie:');
var f5 = reg.get(5);
for(x in f5) console.log(x, f5[x]); 

var item = reg.get(5, 'B');
reg.del(item);

console.log('sorted serie after deletion:');
var f5 = reg.get(5);
for(x in f5) console.log(x, f5[x]); 


console.log('TEST---');


var reg = new C_r();
reg.add(1,'A','pascal');
reg.add(1,'B','antoine');
reg.add(1,'C','jeremy');
reg.add(2,'A','sofie');
reg.add(2,'B','danielle');
reg.add(2,'C','lise');
reg.add(2,'X','olivier');
console.log(reg.get(2,'A'));
console.log(reg.get(1));
console.log(reg.get(5));

var people = function(name) { this.name = name; }
var eric = new people('eric');
var regs = new C_regS('floors', 'births');
regs.floors.add(1,'J', new people('pascal')); // J,K,L... are building columns
regs.floors.add(1,'K', new people('olivier'));
regs.floors.add(1,'L', eric);
regs.floors.add(3,'L', new people('marc'));
regs.floors.add(3,'M', new people('françine'));
regs.births.add(1970, new people('pascal'));
regs.births.add(1973, new people('olivier'));
regs.births.add(1972, eric);

// use an arrray of data:
console.log('branches on reg births:'+regs.births.count());
console.log('branches on reg floors:'+regs.floors.count());
console.log('total count floors:'+regs.floors.ends());
console.log('floor 1:');
var floor = regs.floors.get(1);
	for(column in floor) console.log(tab+floor[column].name);
// use a single item:
console.log('born in 1972:');
console.log(tab+regs.births.get(1972).name);

// remove objects from structure
var e = eric;
regs.del(e);
console.log('eric deleted from registers:');

var floor = regs.floors.get(1); // check who lives on floor 1 (eric was there before deletion)
	for(column in floor) console.log(tab+floor[column].name);

console.log('born in 1972:'); // check who was born in72 (eric was there before deletion)
var b72 = regs.births.get(1972); var name = b72 ? b72.name : 'no node';
console.log(tab+name);

regs.floors.del(3,1); // removes the third floor (a part of the tree should be deleted this time, at first level)
console.log('branches on reg births:'+regs.births.count());
console.log('branches on reg floors:'+regs.floors.count());
console.log('total ends count floors:'+regs.floors.ends());
*/

//////////////////////////////////////////////////////////////////////////////////////////////
//
//   O L D    D E S I G N    R E G I S T E R S  <=> D E P R E C A T E D  !! (use C_regS)
//
C_registers = function(name1, name2, name3, name4) { // name is a single name, or somth like { name:'myreg', order:function(a,b){ return a<b } }
	this.order = {};
	for(let x=0; x<arguments.length; x++) {
		let arg = arguments[x]; let name = false;
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
		let pointer = this[register];
		let ordered = (register in this.order) ? this[register].ordered : false;
		let last = arguments.length-1;
		for(let x=0; x<arguments.length; x++) { // traversing register, adding unexisting branches
			if(x==0 || x==1) continue; let key = arguments[x];
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
		let pointer = this[register];
		let last = arguments.length-1;
		for(let x=0; x<arguments.length; x++) {
			if(x==0) continue; let key = arguments[x];
			if(!(key in pointer)) return false;
			if(x==last) return pointer[key];
			pointer = pointer[key];
		}
	}, 
	count:function(register, key1, key2, key3, key4) {
		let pointer = this[register];
		let last = arguments.length-1;
		for(let x=0; x<arguments.length; x++) {
			if(x==0) continue; let key = arguments[x];
			if(!(key in pointer)) return 0;
			if(x==last) { let c=0; for(i in pointer[key]) c++; return c; }
			pointer = pointer[key];
		}
	},
	flush:function(register) {
		if(register) {
			this[register] = new Array();
			if(register in this.order) this[register]['ordered'] = new Array();
			return;
		} else
			for(let name in this)
				if(typeof this[name] == 'function') continue;
					else this.flush(name);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
A_el = function(eids) { 
	this.get = new Array(); // allows scanning of controls only (no scanning of A_ct functions)
	if(eids) this.collect(eids);
}
A_el.prototype = {
	collect: function(eids) { // eids is an object, possibly nesting other objects, where members are element ids
		for(let x in eids)
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
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
function A_ct(controls) {  // eids is an object, possibly nesting other objects, where members are controls
	this.notActivated = new Array();
	this.get = new Array(); // allows scanning of controls only (no scanning of A_ct functions)
	for(let x in controls) { this.get[x] = this[x] = controls[x]; this.notActivated.push(controls[x]); }
}; 
A_ct.prototype = {
	cnt: function() { let c=0; for(let x in this.get) c++; return c; },
	add: function(controls) {
		for(let x in controls) {
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
		let cntrl = this.notActivated.shift();
		while(cntrl!==undefined) { // end of list
			if(cntrl!==false) cntrl.activate(); // control not in use is set to false
			cntrl = this.notActivated.shift(); // control in use and should be activated
		}
		return this;
	},
	reset: function() {	 // make controls ready for re-activation
		this.notActivated = new Array(); 
		for(let x in this.get) {
			let it = this.get[x];
			if(it !== false) {
				if(it instanceof A_ct) it.reset(); // propagates to sub tree
				this.notActivated.push(this[x]);
			}
		}; 
		return this; 
	},
	isvalid: function() {
		let macrovalid = true;
		for(let control in this.get) {
			if(this[control]['valid']) { // only if the function is defined for this control
				let valid = this[control].valid();
				macrovalid = macrovalid && valid;
				if(!valid) if(vbs) vlog('mobframe.js','A_ct','isvalid','control:'+control+' is NOT valid.');
			}
			if(this[control] instanceof A_ct) { // or the A_ct contains nested A_ct
				macrovalid = macrovalid && this[control].validation(1); // this call is to a sub level of control nesting (*act01*)
			}
		}
		return macrovalid;
	},
	enable: function(onoff) { // calls all controls with an enable(onoff)
		for(let control in this.get) {
			if(this[control]['enable']) { // only if the function is defined for this control
				this[control].enable(onoff);
			}
			if(this[control] instanceof A_ct) { // or the A_ct contains nested A_ct
				this[control].enable(onoff); // this call is to a sub level of control nesting (*act01*)
			}
		}
		return this;
	},
	validation: function(sub) {
		let isvalid = this.isvalid();
		if(!sub) // (*act01*) only the highest level of nesting reports the problem (so to report it only once).
			if(!isvalid) {  
				new C_iMSG(C_XL.w('invalid form'), {}, {sound:'note'} );
			}
		return isvalid;
	},
	getposts: function() { // usefull when one control is a macro control made only from sub-controls
		let post = {};
		for(let x in this.get) { post[x] = this.get[x].getpost(); }
		return post;
	},
	getpost: function() { // usefull when posting nested controls, eg: new A_ct( { cartouche:cartouche, tabs:tabs, more:more, filters:new A_ct({keyword:keyword, visitor:visitor}) } )
		return this.getposts();
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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
		let p = false;
		for(let x in this.cues) {
				let cue = this.cues[x];
			let pms = p?'(+'+(cue.time.valueOf()-p.time.valueOf())+'ms)':'';
			console.log(tab+'| ->'+x+' - '+cue.time.getSeconds()+','+cue.time.getMilliseconds()+' '+pms+' <-> '+cue.comment);
			p = cue;
		}
		let roundms = (this.cues[this.cues.length-1].time.valueOf()-this.cues[0].time.valueOf());
		console.log(tab+'\\ => '+roundms+'ms total roundtrip. Micro perf report complete');
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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
	
	let post = new Array();
	for(controlName in names) {
		
		let control = controls[controlName];
		if(!control) continue; // no corresponding control name in the list
		
		let postName = names[controlName]; // is a string or an object containing string
		let value = control.getpost(); // is a scalar or a string, or an object containing scalars or/and strings
		
		let resolve = function(postName, value) { 
			
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
	record: function(post) { let id = ++this.id; this.register[id] = post; return id; },
	get: function(id) { if(this.register[id]) return this.register[id]; return false; },
	free: function(id) { if(this.register[id]) { delete this.register[id]; return true; } return false; }
}
A_ps.timeout = function(callid) {
	let p = A_ps.callid.get(callid);
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
			let p = A_ps.callid.get(callid);
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
		let http = new XMLHttpRequest();
		let callid = A_ps.callid.record(this);
		http.open("POST", url, true /*asynchronous*/);
		http.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		http.onreadystatechange = 
			function() { 
				let r = this.readyState;
				let s = (r==1||r==2)?200:this.status; 		// was introduced for MSIE8 compatibility
				let t = (r==1||r==2)?'':this.responseText; 	// was introduced for MSIE8 compatibility
				return A_ps.feedback(callid, s, r, t); 
			}
		http.send(post);
		if(this.state.timeout) this.timer = setTimeout(A_ps.timeout, this.state.timeout, callid);
	},
	stream: function(stream) { 
		if(this.timer) clearTimeout(this.timer);
		if(this.callbacks.onreply) this.callbacks.onreply.cb(stream);
	},
	timeout: function() { if(this.callbacks.ontimeout) this.callbacks.ontimeout.cb(); }
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
		let html = '';
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


////////////////   E X E C U T I O N    C O N T E X T   &   C O N S T A N T S 
//
//
var mobminder = { 
	reset:function() { this.account=false, this.context=false, this.app=false } 
};
mobminder.reset();



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N     S E R V I C E
//

mobminder.language = { // (*ml*)
	  codes: { english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7 }
,	names: { 
		0:'english',	 // !! No tranlsation here
		1:'français',	
		2:'polski',	
		3:'nederlands',	
		4:'deutsch',	
		5:'italiano',	
		6:'español',	
		7:'português'
	}
,	abr: { 
		0:'en',	 // !! No tranlsation here, those abreviations should match international standards, see (*is01*)
		1:'fr',	
		2:'pl',	
		3:'nl',	
		4:'de',	
		5:'it',	
		6:'es',	
		7:'pt'
	},
	xlation: {	
		0: { 0:'english',	1:'anglais',	2:'angielsku',		3:'Engels',		4:'Englisch',		5:'inglese',	6:'inglés',		7:'inglês'},
		1: { 0:'french',	1:'français',	2:'francusku',		3:'Frans',		4:'französisch',	5:'francese',	6:'francés',	7:'francês'},
		2: { 0:'polish',	1:'polonais',	2:'polsku',			3:'Pools',		4:'polnisch',		5:'polacco',	6:'polaco',		7:'polonês'},
		3: { 0:'dutch',		1:'neerlandais',2:'holendersku',	3:'nederlands',	4:'niederländisch',	5:'olandese',	6:'holandés',	7:'holandês'},
		4: { 0:'german',	1:'allemand',	2:'niemiecku',		3:'Duits',		4:'Deutsch',		5:'tedesco',	6:'alemán',		7:'alemão'},	
		5: { 0:'italian',	1:'italien',	2:'włosku',			3:'Italiaans',	4:'italienisch',	5:'italiano',	6:'italiano',	7:'italiano'},
		6: { 0:'spanish',	1:'espagnol',	2:'hiszpańsku',		3:'Spaans',		4:'Spanisch',		5:'spagnolo',	6:'español',	7:'espanhol'},	
		7: { 0:'portuguese',1:'portuguais',	2:'portugalsku',	3:'Portugees',	4:'portugiesisch',	5:'portoghese',	6:'portugues',	7:'português'}
	},
	xl:function(language) { // (*ml01*)
		let labels = { 0:'', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'' };
		for(let lc in mobminder.language.names) labels[lc] = mobminder.language.xlation[lc][language];
		return labels;
	}
}




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
	
	, language: (function() { // detects the browser language, usefull when no user is logged yet
				let lc = navigator.language || navigator.userLanguage || 'en-US';
			let lcs = lc.split('-'); // is an array like ['en','US'] explaining language and country
		let l = lcs[0], c = lcs[1] || 'not set'; // note that country might be void
		let la = // see (*is01*) language possible alternatives
		["af", "af-NA", "af-ZA", "agq", "agq-CM", "ak", "ak-GH", "am", "am-ET", "ar", "ar-001", "ar-AE", "ar-BH", "ar-DJ", "ar-DZ",
		"ar-EG", "ar-EH", "ar-ER", "ar-IL", "ar-IQ", "ar-JO", "ar-KM", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-MR", "ar-OM", "ar-PS",
		"ar-QA", "ar-SA", "ar-SD", "ar-SO", "ar-SS", "ar-SY", "ar-TD", "ar-TN", "ar-YE", "as", "as-IN", "asa", "asa-TZ", "ast", "ast-ES",
		"az", "az-Cyrl", "az-Cyrl-AZ", "az-Latn", "az-Latn-AZ", "bas", "bas-CM", "be", "be-BY", "bem", "bem-ZM", "bez", "bez-TZ", "bg",
		"bg-BG", "bm", "bm-ML", "bn", "bn-BD", "bn-IN", "bo", "bo-CN", "bo-IN", "br", "br-FR", "brx", "brx-IN", "bs", "bs-Cyrl",
		"bs-Cyrl-BA", "bs-Latn", "bs-Latn-BA", "ca", "ca-AD", "ca-ES", "ca-FR", "ca-IT", "ccp", "ccp-BD", "ccp-IN", "ce", "ce-RU", "cgg",
		"cgg-UG", "chr", "chr-US", "ckb", "ckb-IQ", "ckb-IR", "cs", "cs-CZ", "cy", "cy-GB", "da", "da-DK", "da-GL", "dav", "dav-KE",
		"de", "de-AT", "de-BE", "de-CH", "de-DE", "de-IT", "de-LI", "de-LU", "dje", "dje-NE", "dsb", "dsb-DE", "dua", "dua-CM", "dyo",
		"dyo-SN", "dz", "dz-BT", "ebu", "ebu-KE", "ee", "ee-GH", "ee-TG", "el", "el-CY", "el-GR", "en", "en-001", "en-150", "en-AG",
		"en-AI", "en-AS", "en-AT", "en-AU", "en-BB", "en-BE", "en-BI", "en-BM", "en-BS", "en-BW", "en-BZ", "en-CA", "en-CC", "en-CH",
		"en-CK", "en-CM", "en-CX", "en-CY", "en-DE", "en-DG", "en-DK", "en-DM", "en-ER", "en-FI", "en-FJ", "en-FK", "en-FM", "en-GB",
		"en-GD", "en-GG", "en-GH", "en-GI", "en-GM", "en-GU", "en-GY", "en-HK", "en-IE", "en-IL", "en-IM", "en-IN", "en-IO", "en-JE",
		"en-JM", "en-KE", "en-KI", "en-KN", "en-KY", "en-LC", "en-LR", "en-LS", "en-MG", "en-MH", "en-MO", "en-MP", "en-MS", "en-MT",
		"en-MU", "en-MW", "en-MY", "en-NA", "en-NF", "en-NG", "en-NL", "en-NR", "en-NU", "en-NZ", "en-PG", "en-PH", "en-PK", "en-PN",
		"en-PR", "en-PW", "en-RW", "en-SB", "en-SC", "en-SD", "en-SE", "en-SG", "en-SH", "en-SI", "en-SL", "en-SS", "en-SX", "en-SZ",
		"en-TC", "en-TK", "en-TO", "en-TT", "en-TV", "en-TZ", "en-UG", "en-UM", "en-US", "en-US-POSIX", "en-VC", "en-VG", "en-VI",
		"en-VU", "en-WS", "en-ZA", "en-ZM", "en-ZW", "eo", "es", "es-419", "es-AR", "es-BO", "es-BR", "es-BZ", "es-CL", "es-CO", "es-CR",
		"es-CU", "es-DO", "es-EA", "es-EC", "es-ES", "es-GQ", "es-GT", "es-HN", "es-IC", "es-MX", "es-NI", "es-PA", "es-PE", "es-PH",
		"es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et", "et-EE", "eu", "eu-ES", "ewo", "ewo-CM", "fa", "fa-AF", "fa-IR",
		"ff", "ff-CM", "ff-GN", "ff-MR", "ff-SN", "fi", "fi-FI", "fil", "fil-PH", "fo", "fo-DK", "fo-FO", "fr", "fr-BE", "fr-BF", "fr-BI",
		"fr-BJ", "fr-BL", "fr-CA", "fr-CD", "fr-CF", "fr-CG", "fr-CH", "fr-CI", "fr-CM", "fr-DJ", "fr-DZ", "fr-FR", "fr-GA", "fr-GF",
		"fr-GN", "fr-GP", "fr-GQ", "fr-HT", "fr-KM", "fr-LU", "fr-MA", "fr-MC", "fr-MF", "fr-MG", "fr-ML", "fr-MQ", "fr-MR", "fr-MU",
		"fr-NC", "fr-NE", "fr-PF", "fr-PM", "fr-RE", "fr-RW", "fr-SC", "fr-SN", "fr-SY", "fr-TD", "fr-TG", "fr-TN", "fr-VU", "fr-WF",
		"fr-YT", "fur", "fur-IT", "fy", "fy-NL", "ga", "ga-IE", "gd", "gd-GB", "gl", "gl-ES", "gsw", "gsw-CH", "gsw-FR", "gsw-LI", "gu",
		"gu-IN", "guz", "guz-KE", "gv", "gv-IM", "ha", "ha-GH", "ha-NE", "ha-NG", "haw", "haw-US", "he", "he-IL", "hi", "hi-IN", "hr",
		"hr-BA", "hr-HR", "hsb", "hsb-DE", "hu", "hu-HU", "hy", "hy-AM", "id", "id-ID", "ig", "ig-NG", "ii", "ii-CN", "is", "is-IS", "it",
		"it-CH", "it-IT", "it-SM", "it-VA", "ja", "ja-JP", "jgo", "jgo-CM", "jmc", "jmc-TZ", "ka", "ka-GE", "kab", "kab-DZ", "kam",
		"kam-KE", "kde", "kde-TZ", "kea", "kea-CV", "khq", "khq-ML", "ki", "ki-KE", "kk", "kk-KZ", "kkj", "kkj-CM", "kl", "kl-GL", "kln",
		"kln-KE", "km", "km-KH", "kn", "kn-IN", "ko", "ko-KP", "ko-KR", "kok", "kok-IN", "ks", "ks-IN", "ksb", "ksb-TZ", "ksf", "ksf-CM",
		"ksh", "ksh-DE", "kw", "kw-GB", "ky", "ky-KG", "lag", "lag-TZ", "lb", "lb-LU", "lg", "lg-UG", "lkt", "lkt-US", "ln", "ln-AO",
		"ln-CD", "ln-CF", "ln-CG", "lo", "lo-LA", "lrc", "lrc-IQ", "lrc-IR", "lt", "lt-LT", "lu", "lu-CD", "luo", "luo-KE", "luy",
		"luy-KE", "lv", "lv-LV", "mas", "mas-KE", "mas-TZ", "mer", "mer-KE", "mfe", "mfe-MU", "mg", "mg-MG", "mgh", "mgh-MZ", "mgo",
		"mgo-CM", "mk", "mk-MK", "ml", "ml-IN", "mn", "mn-MN", "mr", "mr-IN", "ms", "ms-BN", "ms-MY", "ms-SG", "mt", "mt-MT", "mua",
		"mua-CM", "my", "my-MM", "mzn", "mzn-IR", "naq", "naq-NA", "nb", "nb-NO", "nb-SJ", "nd", "nd-ZW", "nds", "nds-DE", "nds-NL", "ne",
		"ne-IN", "ne-NP", "nl", "nl-AW", "nl-BE", "nl-BQ", "nl-CW", "nl-NL", "nl-SR", "nl-SX", "nmg", "nmg-CM", "nn", "nn-NO", "nnh",
		"nnh-CM", "nus", "nus-SS", "nyn", "nyn-UG", "om", "om-ET", "om-KE", "or", "or-IN", "os", "os-GE", "os-RU", "pa", "pa-Arab",
		"pa-Arab-PK", "pa-Guru", "pa-Guru-IN", "pl", "pl-PL", "ps", "ps-AF", "pt", "pt-AO", "pt-BR", "pt-CH", "pt-CV", "pt-GQ",
		"pt-GW", "pt-LU", "pt-MO", "pt-MZ", "pt-PT", "pt-ST", "pt-TL", "qu", "qu-BO", "qu-EC", "qu-PE", "rm", "rm-CH", "rn", "rn-BI",
		"ro", "ro-MD", "ro-RO", "rof", "rof-TZ", "ru", "ru-BY", "ru-KG", "ru-KZ", "ru-MD", "ru-RU", "ru-UA", "rw", "rw-RW", "rwk",
		"rwk-TZ", "sah", "sah-RU", "saq", "saq-KE", "sbp", "sbp-TZ", "se", "se-FI", "se-NO", "se-SE", "seh", "seh-MZ", "ses", "ses-ML", "sg",
		"sg-CF", "shi", "shi-Latn", "shi-Latn-MA", "shi-Tfng", "shi-Tfng-MA", "si", "si-LK", "sk", "sk-SK", "sl", "sl-SI", "smn",
		"smn-FI", "sn", "sn-ZW", "so", "so-DJ", "so-ET", "so-KE", "so-SO", "sq", "sq-AL", "sq-MK", "sq-XK", "sr", "sr-Cyrl", "sr-Cyrl-BA",
		"sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Cyrl-XK", "sr-Latn", "sr-Latn-BA", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn-XK", "sv", "sv-AX", "sv-FI",
		"sv-SE", "sw", "sw-CD", "sw-KE", "sw-TZ", "sw-UG", "ta", "ta-IN", "ta-LK", "ta-MY", "ta-SG", "te", "te-IN", "teo", "teo-KE",
		"teo-UG", "tg", "tg-TJ", "th", "th-TH", "ti", "ti-ER", "ti-ET", "to", "to-TO", "tr", "tr-CY", "tr-TR", "tt", "tt-RU", "twq",
		"twq-NE", "tzm", "tzm-MA", "ug", "ug-CN", "uk", "uk-UA", "ur", "ur-IN", "ur-PK", "uz", "uz-Arab", "uz-Arab-AF", "uz-Cyrl",
		"uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "vai", "vai-Latn", "vai-Latn-LR", "vai-Vaii", "vai-Vaii-LR", "vi", "vi-VN", "vun",
		"vun-TZ", "wae", "wae-CH", "wo", "wo-SN", "xog", "xog-UG", "yav", "yav-CM", "yi", "yi-001", "yo", "yo-BJ", "yo-NG", "yue",
		"yue-Hans", "yue-Hans-CN", "yue-Hant", "yue-Hant-HK", "zgh", "zgh-MA", "zh", "zh-Hans", "zh-Hans-CN", "zh-Hans-HK",
		"zh-Hans-MO", "zh-Hans-SG", "zh-Hant", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW", "zu", "zu-ZA"];
		if(!lc in la) console.log('the browser language does not match any expected');
		let lf = l; // language final, reduced according to our translation scope
		if(!l in mobminder.language.abr) {
			lf = 'en';
			console.log('this browser language ('+l+') is outside mobminder translations scope, final language is '+lf); // see (*is01*)
		} else
			console.log('this browser language is |'+lf+'| for country |'+lc+'|');
			
		return { 'mobcode':lf, 'country':lc }; // that you fetch globally through device.language.mobcode and device.language.country
		// device.language.code will always match one of mobminder's defined translation, see (*is01*)
	})()
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
, android: !!(/android/).test(navigator.userAgent.toLowerCase())
};


var nofeedback = true;



//////////////////////////////////////////////////////////////////////////////////////////////
//   W I N D O W     S I Z E 
//
C_iWIN = function(correlator, onResize) { 
	C_iWIN.register[correlator] = onResize; 
}
C_iWIN.register = new Array();
C_iWIN.size = { w:0 , h:0 }; 
(C_iWIN.measure = function() {  // burst should stop for 1000ms before this handlers triggers the clients
	
	let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	if(!window && !document.body) return;
	C_iWIN.size = { w:w , h:h };
	
	if(C_iWIN.size.w <= 568) is.small = true; // allows testing on computer
	is.landscape 	= (window.orientation==-90||window.orientation==90);
	is.portrait 	= (window.orientation==0||window.orientation==180);
	if(!is.landscape&&!is.portrait) { // window.orientation is not defined <=> computer
		is.landscape = C_iWIN.size.w > C_iWIN.size.h;
		is.portrait = !is.landscape;
	}
	
	if(verboseOn) {
		console.log('============== DEVICE SIZE DETECTION ==========(mobframe.js)=====');
		console.log('Window size changed:'+C_iWIN.size.w+'/'+C_iWIN.size.h+', orientation:'+(is.landscape?'landscape':'portrait'));
		console.log('==============');
	}
	
	for(correlator in C_iWIN.register) C_iWIN.register[correlator].cb(C_iWIN.size); 
})();
(C_iWIN.setbodyclass = function(cursor) {
		let bodymode = is.tactile ? ' touch' : ' mouse';
		let bodysize = is.small ? 'small-device' : 'large-device';
	$('body').addClass(bodysize+bodymode).noContext();
		let oriclass = is.landscape?'landscape':'portrait';
	$('body').removeClass('portrait').removeClass('landscape').addClass(oriclass); // repeated here when body is ready (*ori*)
})();

C_iWIN.filter = new A_cb(null, C_iWIN.measure);

window.onresize = function() { 
	
	if(!is.tactile || is.newtouch) // on iPad, this function is triggered every time the DOM size changes. As the app is fullscreen and there is never a resize, we do not callback.
		C_iWIN.filter.dcb(50/*ms*/); 
};
C_iWIN.cursor = function(cursor) { // sets the mouse pointer
	if(is.tactile) return;
	if(cursor)
		$(document.body).addClass('cursor-'+cursor);
	else
		$(document.body).removeClass ( // only the classes that contain the cursor specifications
			function (index, classes) { 
				let matches = classes.match(/\bcursor-[^\b]*\b/gi) || [];
				return (matches.join(' '));
			}
		);
};


if(verboseOn) {
	console.log('============== DEVICE CONTEXT DETECTION ==========(mobframe.js)=====');
	console.log('7 - device - browser:'+device.browser+', OS:'+device.OS+', HW:'+device.HW);
	console.log('is - tactile:'+is.tactile+', small screen:'+is.small);
	console.log('userAgent:'+navigator.userAgent);
	console.log('==============');
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//
arrayLOG = function(array, name) {
	if(name) console.log('Array '+name+'('+array.length+' elements)');
	for(let k in array) console.log('    ['+k+'] |'+array[k]+'|');
	return true;
}
arrayAND = function(arrays) { // returns an array with common values to all arrays
	if(!arrays.length) return new Array(); // there is no array, so there is nothing in common
	if(arrays.length==1) return arrays[0]; // there is nothing to compare because there is only one array
	let filtered = new Array();
	let reference = arrays.shift();
	for(let x in reference) {
		let refvalue = reference[x];
		let present = true; // assumes the refvalue is present in all arrays
		for(let a in arrays) {
			let candidateArray = arrays[a];
			let found = false;
			for(let y in candidateArray)
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
	let out = new Array();
	for(let x in arrays) {
		let array = arrays[x];
		for(let k in array) out[k] = array[k];
	}
	return out;
}
arrayREMOVE = function(from, values) { // from is an array, values is an array. If present in [from], values of [values] are removed
	if(!from.length) return new Array(); // there is no value in [from], so there is nothing to remove
	if(!values.length) return from; // there is no values to retrieve, so the from array is unchanged
	let filtered = new Array();
	for(let x in from) {
		let candidate = from[x];
		let found = false;
		for(let y in values) if(values[y]==candidate) { found = true; break; }
		if(found) continue;
		filtered.push(candidate); // the candidate is not in the list of forbidden values
	}
	return filtered;
}
arrayINVERT = function(array) { // switches values with indexes 
	let inverted = new Array();
	for(let x in array) inverted[array[x]] = x;
	return inverted;
};
arrayGETKEY = function(array, value) { // returns the first found key
	for(let x in array) if(array[x]==value) return x;
	return false;
};
arrayCLONE = function(native) {
	let clone = new Array();
	for(let x in native) clone[x] = native[x];
	return clone;
}
arrayKEYS = function(array) {
	let keys = new Array(); let k; 
	for(let k in array) keys.push(k);
	return keys;
}
arrayHAS = function(array, value) {
	for(let k in array) if(array[k]==value) return true; // will never return 0
	return false;
}
arrayKEY = function(array, forvalue) {
	for(let k in array) if(array[k]==forvalue) return k; // may return 0 
	return false;
}
round = function(n) { return ((n*16)|0)>>4; };
bitmap = function(value) {
			let scale16 = 0x800; // Which is 10000000 00000000
			let scale32 = 0x20000000; // Which is 10000000 00000000 00000000 00000000
			let top16 = 0xFFFF;
		let scale = scale16; if(value>top16) scale = scale32;
		let bc = 1, bits = '';
	for(scan=1; scan<=scale; scan<<=1) { 
		bits = (scan&value ?'1':'0')+bits; if(!(bc++%8)) bits = ','+bits; 
	};
	bits = 'bits: '+bits;
	return bits;
}

insertcoma = function(v) { // gets 13599 and returns '135,99', which is good for csv lovers
	let neg = '';
	if(v<0) { neg = '-'; v = -v }; // treats also -9550 and returns '-95,50'
	let cents = '00';
	let units = (v/100)|0;
	let c = v-units*100;
	if(c.length==1) c = '0'+c;
	if(c) cents = c;
	return neg+units+','+cents;
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//
Date.prototype.isvalid = function(yyyy,mm,dd) {
	
		let stamp = this.getTime();
	if(isNaN(stamp)) return false;
	
	let xpyyyy = this.getFullYear();
	let xpmm = this.getMonth();
	let xpdd = this.getDate();
	if(vbs) vlog('mobframe.js','Date','isvalid',this+'|'+'yyyy:'+yyyy+'/xp:'+xpyyyy+', mm:'+mm+'/xp:'+xpmm+',  dd:'+dd+'/xp:'+xpdd);
	
	// now check if you did not enter some bullshit like '1970-12-35', that let the Date object re-schedule your input to another date / month
	if(xpyyyy != yyyy ) return false;
	if(xpmm != mm-1) return false;
	if(xpdd != dd) return false;

	return true;
}
Date.prototype.sameday = function(jsdate) { // checks if guest o_Date is inside the same calendar day. Time may be different.
	
	// js considers that day+0 at 24h is actually midnight at date+1. Which is not convenient for practical planning display 0 to 24h.
	// We must consider that if cueOut is midnight on date X+1, while cueIn is on date X, then IT IS the SAME day. 
	
	let cin = this.valueOf();
	let cout = jsdate.valueOf();
	if(cout<cin) { let a=cin; cin=cout; cout=a;  } // be sure that cout is after cin
	
	let jsdcin = new Date(cin); let jsdcout = new Date(cout); 
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
Date.prototype.sameWeek = function(jsdate, options) { // checks if guest o_Date is inside the same calendar day. Time may be different.
	
	options = options || { relative:false };
	if(options.relative) { // refers to 
			let seconds = (this.valueOf() - jsdate.valueOf())/1000; if(seconds<0) seconds = -seconds;
			let oneweek = 86400*7;
		return seconds<oneweek;
	} else { // refers to week number
			let wn_this = this.getWeekNumber();
			let wn_that = jsdate.getWeekNumber();
		return wn_this.wn == wn_that.wn;
	}
}
Date.prototype.sameYear = function(o_Date) { // checks if guest o_Date is inside the same year.
	return o_Date.getFullYear()==this.getFullYear();
}
Date.prototype.calendar = function(o_Date) { // both cues in and out sticks to midnight. This is a calendar span.
	if(this.seconds()) return false;
	if(o_Date.seconds()) return false;
	return this.span(o_Date)/86400; // returns the number of entire days 
}
Date.prototype.ispast = function() {
	let date = new Date();
	if(date.valueOf() >= this.valueOf()) return true;
	return false;
}
Date.prototype.isbefore = function (jsdate) { 
	if(jsdate.valueOf() > this.valueOf()) return true;
	return false;
}
Date.prototype.isafter = function(jsdate) {
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
Date.prototype.addDay = function(i) {
	this.setDate(this.getDate()+i); 
	return this;
}
Date.prototype.addWeek = function(i) { 
	if(i) this.setDate(this.getDate()+i*7);
	return this;
}
Date.prototype.addMonth = function(i) {
	if(i) this.setMonth(this.getMonth()+i); 
	return this;
}
Date.prototype.addYear = function(i) {
	this.setFullYear(this.getFullYear()+i); 
	return this;
}
Date.prototype.increment = function(i) { // i like { h:true, d:1, w:0, m:0, y:0, nw:0, nm:0, ny:0, tw:0, wd:[0 to 6], wp:[-1,1,2,3,4], ms:1, ws:1 }	
	
	if(i.h) { let date = new Date(); this.setTime(date.valueOf()); }; // pitch back to now
	
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
		let cm = this.getMonth(); // current month
		this.addDay(1);
		let flip = []; for(let x in i.wd) flip[i.wd[x]] = true;
		let match = function(t) { return flip[t.getDay()]; }
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
	let run = this.clone(), which=-1, mine = this.getDate(), d;
	do { run.addDay(1); d=run.getDate(); if(d!=1) which--; } while(d!=1);
	return which;
	// e.g; if Feb 23st is the last tuesday in the month, this function will return -1
	// e.g; if Feb 16st is a tuesday, this function will return -2 for Feb 16th
}
Date.prototype.daypos = function() { // returns the number of the week in which the weekday is present 
	let run = new Date(+this), which=1, mine = this.getDay();
	while(run.getDate()!=1) { run.addDay(-1); if(run.getDay()==mine) which++; }
	return which;
	// e.g; if Feb 1st is a monday, Feb 8th is the second monday and this function will return 2
}
Date.prototype.dayposlast = function() { // returns the number of the week wrt end of the month 
	let run = this.clone(), which=-1, mine = this.getDay(), d;
	do { run.addDay(1); d=run.getDate(); if(run.getDay()==mine) if(d!=1) which--; } while(d!=1);
	return which;
	// e.g; if Feb 23st is the last tuesday in the month, this function will return -1
	// e.g; if Feb 16st is a tuesday, this function will return -2 for Feb 16th
}
Date.prototype.monday = function() { return this.increment({ tw:true }) }
Date.prototype.sunday = function() { while(this.getDay()!=0) this.addDay(-1); return this; }
Date.prototype.clone = function(i) {
	let c = new Date(+this);
	if(i) c.increment(i);
	return c;
},
Date.prototype.getPHPday = function () {
	let dayCode = this.getDay(); // jsScript has sunday = 0, monday = 1, saturday = 6
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
	let h = this.getHours();
	let m = this.getMinutes();
	if(h<10) h = '0'+h;
	if(m<10) m = '0'+m;
	let t = h+':'+m;
	if(seconds) {
		let s = this.getSeconds();
		if(s<10) s = '0'+s;
		t += ':'+s;
	}
	return t;
}
Date.prototype.datetimestr = function(options) { // options like { y:true } <= displays year
	options = options || { y:true };
	let dateandtime = this.sortable(options)+' '+this.HHmm(); 
	return dateandtime;
}
Date.prototype.span = function(date) { // returns number of seconds to the given date
	let seconds = (this.valueOf() - date.valueOf())/1000;
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
Date.prototype.sortable = function(options) { // options like { y:true } <= displays year, returns YYYY-MM-DD
	options = options || { y:true };

		let p = [];
		let y = this.getFullYear(); // year
		let m = this.getMonth()+1; 	// m[1-12]
		let d = this.getDate(); 	// d[1-31]
	
	if(m < 10) m = '0'+m;
	if(d < 10) d = '0'+d;
	
	if(options.y) p.push(y);
	p.push(m); p.push(d);
	
	return p.join('-');
}
Date.prototype.tilt = function() { // aligns the stamp onto the closest group slice
	this.setSeconds(0); 
	this.setMilliseconds(0);
	let h = this.getHours();
	let m = this.getMinutes();
	let seconds = h*3600+m*60;
	let slice = (seconds/mobminder.account.secondsPerSlice)|0;
	this.setHours(0); 
	this.setMinutes(0); 
	this.setSeconds(slice*mobminder.account.secondsPerSlice); 
}
Date.prototype.sliceSpan = function(o_Date) {
	let span = o_Date.valueOf()-this.valueOf();
	let seconds = span/1000; if(seconds<0) seconds = -seconds;
	return (seconds/mobminder.account.secondsPerSlice)|0;
}
Date.prototype.getSlice = function() {
	// let seconds = (this.getHours()*3600 + this.getMinutes()*60);
	return (this.seconds()/mobminder.account.secondsPerSlice)|0;
}
Date.prototype.seconds = function(seconds) { // seconds from midnight
	if(seconds!=undefined) return this.toMidnight(seconds);
	return (this.getHours()*3600 + this.getMinutes()*60 + this.getSeconds());
}
Date.prototype.setUnixTime = function(unixTime, verbose) { // unixTime like '2012-05-19 09:26'

	// 
	// 
	// 0         1         2
	// 012345678901234567890
	// |    |  |  |  |
	// 2012-05-19 09:26
	//
		let y = unixTime.substr(0, 4)|0;
		let m = (unixTime.substr(5, 2)|0)-1;
		let d = unixTime.substr(8, 2)|0;
		if(verbose) console.log('setUnixTime',y,m,d);
	this.setMilliseconds(0);
	this.setSeconds(0); 
	this.setMinutes(unixTime.substr(14, 2)|0);
	this.setHours(unixTime.substr(11, 2)|0);
	this.setDate(d); this.setMonth(m); this.setYear(y); // watch out: the sequence is important, year must be set last
		if(verbose) console.log('jsdate',this);
	return this;
}
Date.prototype.getUnixTime = function(opt) { // unixTime like '2012-05-19 09:26'
	opt = opt || {wseconds:true};
	let d = this.getDate();
	let m = this.getMonth()+1;
	if(d<10) d = '0'+d;
	if(m<10) m = '0'+m;
	return this.getFullYear()+'-'+m+'-'+d+' '+this.HHmm(opt.wseconds);
}
Date.prototype.timeshift = function() { // daylight saving time shift, concerns 2 sundays in a year
	 // return 0 363 days a year, 
	 // returns +3600 when days are 90000 seconds long due to daylight saving, before entering winter
	 // returns -3600 when days are 82800 seconds long due to daylight saving, before entering summer
	 let nextday = this.clone({d:1});
	 let daylength = nextday.valueOf()-this.valueOf();
	 return (daylength/1000)-86400;
}
Date.prototype.getWeekNumber = function(){ // returns week number according to ISO-8601 - !! sunday belongs to weeknumber, while mobminder webapp shows sunday as first day of week (week number is incoherent when called on sunday)
    let d = new Date(+this);
		d.setHours(0,0,0);
		d.setDate(d.getDate()-(d.getDay()||7)+4); // Go to thursday this week
		let y = d.getFullYear(); // the current year
		let wn = 0;
		while(d.getFullYear()==y) { d.setDate(d.getDate()-7); wn++; };
	return { y:y, wn:wn };
};


jsDateFromUnixTime = function(unixTime, v) { let date = new Date(); return date.setUnixTime(unixTime, v); } // unixTime like '2012-05-19 09:26'
time = function(seconds,sep,str8,mn) { // returns HHMM string given a number of seconds from midnight
	sep = sep || ':';
	mn = mn || '';
	let h = 0; while(seconds>3599) { seconds-=3600; h++; }; if(str8) if(h<10) h = '0'+h;
	let m = 0; while(seconds>59) { seconds-=60; m++; }; if(m<10) m = '0'+m;
	return h+sep+m+mn; // like 9:00
}
oclock = function(seconds) { // returns the seconds of the pitch oclock time given a number of seconds from midnight
	let h = (seconds/3600)|0; h*=3600;
	if(h<mobminder.account.rangeIn) h=mobminder.account.rangeIn; // mobminder.account.rangeIn is an o'clock time
	return h;
}
duration = function(seconds, options) { // returns a string explaining duration between this from a given startDate
	options = options || { days:true, pad:'' }
	let days = 0; 
	if(options.days) { days = (seconds/86400)|0; seconds-= days*86400 };
	let hours = (seconds/3600)|0; seconds-= hours*3600;
	let minutes = (seconds/60)|0; seconds-= minutes*60;
	let string = '';
	if(minutes) string = (minutes<10) ? '0'+minutes+'m'+options.pad : minutes+'m'+options.pad;
	if(hours) string = hours+'h'+options.pad+string;
		let dword = ( (days>1) ? C_XL.w('abr days')+options.pad : C_XL.w('abr day')+options.pad ); // takes care of plural
	if(days) string = days+dword+string;
	return string;
}
nowmidnite = function() { let d=new Date(); return d.toMidnight().stamp(); };
now = function() { let d=new Date(); return d; };
tobdate = function(digits, options) { // the assumed input format (recorded in DB) is YYYYMMDD
	options = options || {}
	digits = digits.toString();
	if(digits.length!=8) return '';
	let yyyy = digits.slice(0,4);
	let mm = digits.slice(4,6);
	let dd = digits.slice(6,8);
	let formated;
	if(options.format=='sortable') formated = yyyy+'-'+mm+'-'+dd;
		else formated = dd+'-'+mm+'-'+yyyy;
	return formated; // output format is YYYY-MM-DD
}
sortable = function(unixTime, options) { // For unix time input, returns YYYY-MM-DD
	let jsdate = new Date(unixTime*1000); 
	return jsdate.sortable(options); 
};
datetime = function(unixTime, options) { // For unix time input, returns YYYY-MM-DD HH:MM
	let jsdate = new Date(unixTime*1000); 
	return jsdate.datetimestr(options); 
};
humandate = function(t, options) { // returns human readable date time from either unix or sql timestamp format ( for tracking CCDA )
	// t can be unixtime (bigint) or sql timestamp (aaaa-mm-dd hh:mm:ss)		
	options = options || {abreviation:'abr'}; // options like { relative:true }
	let isunixtime = (t == parseInt(t, 10)); // checks if the received value is enteger
	let jstime = isunixtime ? new Date(t*1000) : jsDateFromUnixTime(t);
	let string;
	if(options.relative) string = C_XL.daterelative(jstime, {abreviation:options.abreviation, weekday:true, time:true });
		else string = C_XL.date(jstime, { abreviation:options.abreviation, weekday:true, time:true });
	return string; 
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
	poke: function(item,value) { this.items[item] = value; },
	getpost: function() { return this.items; },
	autonames: function() { // reproduces the names posted as being the items names by construction
		let names = {}; for(let n in this.items) names[n] = n;
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




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   G E N E R I C     S Y M B O L S     A N D    I C O N S
//

function symbol(which,css,style) {
	let s = false;
	switch(which) {
		// used in backoffice pages h1 and back office menu
		case 'setup': 		s = 'cogs'; break;
		case 'visitors': 	s = 'users'; break;
		case 'stats': 		s = 'analytics'; break;
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
		case 'task': 		s = 'thumbtack'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'note': 		s = 'tags'; 		css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		case 'chat': 		s = 'comments'; 	css='fa-13x'; 	style='padding:0 .2em 0 .7em;'; break;
		
		// used in chats / notes / tasks
		// case 'plus chat': return '<span class="fa-stack"><i style="font-size:1em;" class="fa fa-comment fa-gray"></i><i  style="font-size:.5em;" class="fa fa-plus fa-stack-1x fa-inverse"></i></span>';
		case 'plus task': return '<div class="fa fa-13x fa-thumbtack fa-rotate-45 fa-gray"></div>'+'&nbsp;<div class="fa fa-09x fa-plus fa-gray"></div>';
		case 'plus note': return '<div class="fa fa-13x fa-tags fa-gray"></div>'+'&nbsp;<div class="fa fa-09x fa-plus fa-gray"></div>';
		case 'plus chat': return '<div style="position:relative; bottom:-0.15em;" class="fa fa-15x fa-comment fa-gray"></div>'+'<div style="position:relative; left:-1.35em; bottom:0.06em" class="fa fa-08x fa-plus"></div>';
		// case 'plus note': return '<span class="fa-stack fa-hg"><i class="fa fa-tags fa-stack-2x fa-gray"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span>';
		case 'send msg' : s = 'arrow-alt-to-top'; css='fa-17x'; style='padding:0;'; break;
		case 'to clipboard' : s = 'copy'; css='fa-15x'; style='padding:0;'; break;
		
		// used in e-reservation
		case 'ident'	: s = 'user'; css='fa-13x'; style='padding:0;'; break;
		case 'options'	: s = 'cogs'; css='fa-13x'; style='padding:0;'; break;
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
		
		// used on modals tab control on touch devices

			// M_RESA
		case 'details': 	s = 'edit'; break;
		case 'resa_sms_list': 		s = 'rss'; break;
		case 'resa_emails_list': 	s = 'envelope'; break;
		case 'resa serie': 		s = 'list-ol'; break;
		case 'sections': 	s = 'stumbleupon'; break;
		case 'resources': 	s = 'slideshare'; break;

			// M_VISI
		case 'coordinates': s = 'newspaper'; break;
		case 'info': 		s = 'edit'; break;
		case 'appointments': s = 'calendar'; break;
		case 'references': 	s = 'file-text'; break;
		case 'files': 		s = 'folder-open'; break;

			// common
		case 'audit': 		s = 'sort-amount-asc'; break;
		
			// M_Chat
		case 'archbox': 	s = 'archive'; break;
		
			// M_iPairGoCrypto
		case 'pair': s = 'link'; break;
		case 'unpair': s = 'unlink'; break;

		default: console.log('mobframe.js::symbol() - undefined symbol for label "'+which+'"');
	}
	let span = '<i style="'+(style||'padding-left:1em;')+'" class="fa fa-gray '+(css||'fa-11x')+' fa-'+s+'"></i>';
	return span;
}
function symbols(which,css,style) {
	which = which || {};
	if(typeof which !== 'object') which = { 0:which };
	let s = {}; for(let x in which) s[x] = symbol(which[x], css, style);
	return s;
};




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N     S E R V I C E
//

mobminder.communication = { 
	triggers: function(){
		let sections = { reminders:'reminder', revivals:'revival', specials:'special' };
		let triggers = { // values should match the server side (*triggers*)
			revivals: { '-1':'revival one day', '-7':'revival one week', '-14':'revival two weeks', '-28':'revival one month', '-56':'revival two months'
, '-91':'revival three months', '-147':'revival five months', '-175':'revival six months'
, '-266':'revival nine months', '-329':'revival eleven months', '-357':'revival one year', '-539':'revival months 18', '-728':'revival two years' },
			reminders: { 1:'reminder eve', 2:'reminder two days', 3:'reminder three days', 4:'reminder four days', 7:'reminder one week', 14:'reminder two weeks' },
			specials: { 0:'action on agenda', 80:'on visitor record', 81:'on visitor birthday', 90:'h-x reminder', 99:'manual notification' }
		}
		let labels = new Array(); for(let s in sections) {
			labels[s] = sections[s];
			for(let i in triggers[s]) labels[i] = triggers[s][i];
		} 
		labels = C_XL.w(labels);
		
		let order = new Array(); for(let s in sections) {
			order.push(s);
			for(let i in triggers[s]) order.push(i);
		} 
		let count = order.length;
		let bullet = C_XL.w('bullet down');
		let lockies = { reminders:{section:bullet}, revivals:{section:bullet}, specials:{section:bullet} };
		return { order:order, labels:labels, presets:lockies, count:count };
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N    C L A S S   - uses translations table from language.js
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
C_XL = function() {};
C_XL.prototype = {};
C_XL.w = function(term, options, fallback) { // term can be a bunch of terms like { 1:term1, 2:term2, ...} 

		// and options like { cap:true, language:mobminder.language.codes.english, nested:{key1:bla1, key2:bla2, key3:bla3 } }
	
		options = options||{ cap:1 };
		if(options.cap===undefined) options.cap = 1; // that will be the default, can be 0 (no capitalize), undefined when not specified at all
		if(options.language===undefined) { // can be 0 (english), undefined when not specified at all
			options.language = mobminder.language.codes.english; // default to english, see // (*ml*)
			if(mobminder.context.surfer) options.language = mobminder.context.surfer.language; // translate to current surfer language
		} else {
			// the language specified by the caller
		}
		
	
	if(typeof(term)=='object') { // then you passed a bunch of terms like { 0:'term1', 1:'term2', ... }
		let xlted = {}; // keeps the input object intact!
		for(let x in term) xlted[x] = C_XL.w(term[x],options,fallback); // note the recursion (*xl02*)
		return xlted;
	}
	
	let l = options.language;
	let t = C_XL.d[term]; 
	if(t===undefined) { // this term is not defined in our array of translations, for an example of fallback usage see (*fb01*)
		if(verboseOn) {
			let f = ''; if(fallback) f = ' ( fallback value |'+fallback+'| )';
			let x = 'C_XL.w() term not found for |'+term+'| ';
			console.log(x+f);
		}
		if(fallback) return C_XL.w(fallback,options); // example: C_XL.w('cowboy',{cap:0},'empty string') will actually return C_XL.w('empty string',{cap:0})
		return 'XLt?:'+term;
	}
	t = t[l]; 
	if(t===undefined) { // the term was found but the particular language code does not exist in the available translations
		if(verboseOn) {
			let x = 'C_XL.w() term not found for |'+term+'| ';
			console.log(x+f);
		}
		if(t[0]) // mobminder.language.code.english from language.js
			t = t[mobminder.language.code.english]; // falls back to english if available
		else return 'XLc?:'+term;
	}
	
	let hasvisitors = t.includes('visitors');
	let hasvisitor = t.includes('visitor');
	
	// keep plural above
	
	let c = 0;
	let go = hasvisitors; while(go) {
			t = t.replace('visitors', C_XL.d['visitors'][l]);
			go = t.includes('visitors');
			if(++c>10) break; // let's keep it safe
		}
	
		c = 0;
		go = hasvisitor; while(go) {
			t = t.replace('visitor', C_XL.d['visitor'][l]);
			go = t.includes('visitor');
			if(++c>10) break; // let's keep it safe
		}
	
	// nested parts
	if(options.nested) for(let key in options.nested) t = t.replace('$'+key+'$', options.nested[key] ); // example : key is 'price' and options.nested[key] is '152,00€', then the tag $price$ will be replaced by 152,00€
	
	if(options.cap) t = t.capitalize();
	return t;
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   D A T E     F O R M A T S    T R A N S L A T I O N
//
C_XL.date = function(jsdateORstamp, preset, language) {
	let jsdate = new Date();
	if(jsdateORstamp) {
		if(jsdateORstamp instanceof Date) jsdate = jsdateORstamp.clone(); // you passed a Date object
			else if(typeof (jsdateORstamp|0) == 'number') jsdate = new Date(jsdateORstamp*1000); // you passed a unix timestamp
	}
	let opt = C_XL.date.defaults.align(preset);
	let separator = opt.abreviation == 'min' ? '' : ' ';
	
	let date = jsdate.getDate(); 						
	let month = C_XL.month(1+jsdate.getMonth(), opt.abreviation, language);
	
	let s = new Array();
	
	language = (language!==undefined)? language:mobminder.context.surfer.language;
	
	if(opt.weeknumb) opt.weeknumb = '<span class="weeknumber">('+jsdate.getWeekNumber().wn+')</span>';
	switch(language) { 
	
		case mobminder.language.codes.english: // reversed English sequence
			let post = 'th'; if(date=='1') post='st'; if(date=='2') post='nd';if(date=='3') post='rd';
			s = [month, date+post]; 
			if(opt.weekday) { let weekday = C_XL.weekday(jsdate.getPHPday(), opt.abreviation, language); s.unshift(weekday); }
			if(opt.year) { let year = jsdate.getFullYear(); if(opt.yearfirst) s.unshift(year); else s.push(year); };
			if(opt.time) s.push(jsdate.HHmm());
			if(opt.weeknumb) s.push(opt.weeknumb); 
			break;
		case mobminder.language.codes.french:
		case mobminder.language.codes.polish:
		case mobminder.language.codes.dutch:
		case mobminder.language.codes.german:
		case mobminder.language.codes.italian:
		case mobminder.language.codes.spanish: 
		default:
			s = [date,month]; 
				if(opt.weekday) { let weekday = C_XL.weekday(jsdate.getPHPday(), opt.abreviation, language); s.unshift(weekday); }
				if(opt.year) { let year = jsdate.getFullYear(); if(opt.yearfirst) s.unshift(year); else s.push(year); };
				if(opt.time) s.push((opt.abreviation == 'full' ? C_XL.w('at',{cap:0})+' ' : ' - ')+jsdate.HHmm()); 
				if(opt.weeknumb) s.push(opt.weeknumb); 
			break;
	}
	return s.join(separator);
}
C_XL.date.defaults = new A_df( { abreviation:'full', weekday:false, time:false, split:false, year:true, weeknumb:false } ); // abreviation like [full, abr, min]

C_XL.daterelative = function(jsdateORstamp, options, language) { // according to past delay, displays only time, day of week plus time, month and date or year/month/date
	let jsdate = new Date();
	if(jsdateORstamp) {
		if(jsdateORstamp instanceof Date) jsdate = jsdateORstamp.clone(); // you passed a Date object
			else if(typeof (jsdateORstamp|0) == 'number') jsdate = new Date(jsdateORstamp*1000); // you passed a unix timestamp
	}
	let opt = C_XL.date.defaults.align(options); // options like { abreviation:'full','min' }
	
			let td = new Date(); // today
		let sameday = jsdate.sameday(td);
		let sameweek = jsdate.sameWeek(td,{relative:true});
		let sameyear = jsdate.sameYear(td);
		let label;
	if(sameday) label = C_XL.w('today',{cap:0})+' '+jsdate.HHmm();
	else if(sameweek) label = C_XL.weekday(jsdate.getPHPday(),options.abreviation,language)+'&nbsp;'+jsdate.HHmm();
	else if(sameyear) label = C_XL.date(jsdate,{year:false},language);
		else label = C_XL.date(jsdate,{year:true},language);
	return label;
};

C_XL.weekday = function(daycode, abreviation, language) { // php daycode [1-7]
	abreviation = abreviation || 'full'; // can be ['full','abr','min']
	language = (language!==undefined)? language:mobminder.context.surfer.language;
	return C_XL.weekdays[abreviation]['weekday'+daycode][language]; 
}
C_XL.month = function(number, abreviation, language) {
	
	if(!abreviation) abreviation = 'full';
	language = (language!==undefined)? language:mobminder.context.surfer.language;
	return C_XL.months[abreviation]['month'+number][language];
}
C_XL.gender = function(dbcode, langcode) { return C_XL.w(C_XL.gender.codes[dbcode], { language:langcode} ); }
C_XL.gender.codes = new Array(); // set by setContextLanguage()




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
		let p = this.state.value?('_'+this.state.value):''; // eids postfix
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
					this.state.tip = new C_iTIP(this.eids.ui, this.state.tip); // a tip preset like { text:'blabla', css:'sticker-tip'} was passed
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
	let point = e.touches ? e.touches[0] : e;
	let deltaX = point.pageX-C_iCLIK.state.x, deltaY = point.pageY-C_iCLIK.state.y;
	let Xsq = deltaX * deltaX, Ysq = deltaY * deltaY;
	let far = (Xsq + Ysq) > 100;
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
		
		let id  = ' id="'+this.eids.ui+'"'; // not used for tag 'input'
		let clss  = ' class="click '+css+'"'; // not used for tag 'input'
		let indent = ''; if(this.state.indent) indent = ' padding-left:'+this.state.indent+'em;';
		let style  = ' style="cursor:pointer; '+this.state.style+indent+'"'; // not used for tag 'input'
		let bullet = ''; if(this.state.section) { if(this.state.section===true) bullet = ''; else bullet = this.state.section+'&nbsp;'; }
		let sign = ''; if(this.state.sign) sign = '<div style="display:inline-block;" class="fa fa-lefter fa-11x fa-'+this.state.sign+'"></div>';
		let label = bullet+sign+this.state.ui;
		
		rowspan = rowspan ? ' rowspan='+rowspan : '';
		let type = '';
		switch(tag) {
			case 'td': case 'th': 
				style = ' style="'+this.state.style+indent+'"';
				let cs = this.state.colspan?' colspan='+this.state.colspan:'';
				return '<'+tag+rowspan+cs+' '+id+style+clss+'>'+label+'</'+tag+'>'; 
			
			case 'span': case 'div': case 'li': 
				return '<'+tag+id+style+clss+'>'+label+'</'+tag+'>';
				
			case 'button': type = ' type="button"';
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
			if(this.state.tip) if(this.state.tip.activate) this.state.tip.activate();
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
		let eltohide = this.elements.wrapme || this.elements.ui; // when defined, we hide the wrapper of the label (e.g. a table td) instead of the label div. This prevents having empty td's in a a table, they take room on the screen.
		if(hidden) $(eltohide).hide(); else $(eltohide).show(); this.state.hidden = hidden; 
		return this; 
	}, 
	visible: function(visible) { 		
		let eltohide = this.elements.wrapme || this.elements.ui; // when defined, we hide the wrapper of the label (e.g. a table td) instead of the label div. This prevents having empty td's in a a table, they take room on the screen.
		if(visible) eltohide.style.visibility = 'visible'; else eltohide.style.visibility = 'hidden'; this.state.visible = visible; 
		return this; 
	},
	show: function(on) { return this.hide(!on); },
	inlabel: function(regexp, options) { // highlights in HTML ( not in this.state.ui !! ) the digits given through regexp, option: elsehide
			options = options || {};
			
		let cleanup = new RegExp(/(<b class="match">|<\/b>)/gi); // cleans up previous highlights
		if(this.elements.ui) this.elements.ui.innerHTML = this.elements.ui.innerHTML.replace(cleanup,'');
		
		let ui = this.state.ui.normalize('NFD').replace(/\p{Diacritic}/gu, ''); // see (*im01*)
		
		let where = ui.search(regexp); // returns start position // see (*ie01*)
		let found = (where >= 0);
		
		if(found) { // should match and highlight "andré" in the same way as "andre", diacritics should have no influence on search
		
				let leftcount 	= RegExp.leftContext.length;
				let matchlen 	= RegExp.lastMatch.length;
				let taillen 	= RegExp.rightContext.length;
				let nativelen 	= this.elements.ui.innerHTML.length;
				let nativeui	= this.elements.ui.innerHTML;
			
			// console.log(nativeui); // this one contains the original accentuation
			// console.log(RegExp.leftContext+'|'+RegExp.lastMatch+'|'+RegExp.rightContext); // this one knows the match boundaries but was diareduced and contains no accent anymore
			// console.log(leftcount+'|'+matchlen+'|'+taillen); // this shows how many letters are in each regexppart
			
			let head = RegExp.leftContext;
			let core = nativeui.substr(leftcount, matchlen); // note that we here start from the non diareduced original, containing the accentuations
			let tail = RegExp.rightContext;
			
			// console.log(head+'|'+core+'|'+tail); // includes accentuations
			// console.log('---------------');
			
			this.elements.ui.innerHTML = head+'<b class="match">'+core+'</b>'+tail; // highlights also accentuations
			// this.elements.ui.innerHTML = RegExp.leftContext+'<b class="match">'+RegExp.lastMatch+'</b>'+RegExp.rightContext;
		}
		if(options.elsehide) this.hide(!found);
		return found;
	}, 
	remove: function() { if(this.state.tip) this.state.tip.quit(); $(this.element()).remove();  },
	hascssclass: function(css) { return $(this.elements.ui).hasClass(css); },
	
	// PRIVATE
	section: function(issection) { // elements must exist in the DOM
		if(!this.elements.ui) return this;
		if(issection) $(this.elements.ui).addClass('section mindertext');
		return this;
	},
	active: function() { // active/idle changes interactivity but adds no css class
	
		let interactivity = (this.state.enabled && !this.state.idle);
		
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
		let propagate = t||false; // should be true on touch devices (slide screen) but false on mouse devices (propagates to sub html layers)
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
			let tout = this.handlers.tout; C_iCLIK.state.dbltap.timer = setTimeout(tout, 300);
		}
		if(this.callbacks.hold) {
			let handler = new A_hn({hold:new A_cb(this, this.held)});
			C_iCLIK.state.hold = setTimeout(handler.hold, 1200);
		}
		
		if(this.callbacks.down) propagate = this.callbacks.down.cb(this);
		return propagate;
	},
	up: function(e) {
		let propagate = true; // There should be no propagation stop on an up event, because many other controls are based on "up anywhere" on screen to stop their interactivity
		let ctrlkey = e.ctrlKey;
		if(!is.tactile) $(this.elements.ui).unbind('mouseleave',this.handlers.leave); 
		$(this.elements.ui).removeClass('touch-in'); 
		
		if(vbs) vlog('controls.js','C_iCLIK','up','eid:'+this.eids.ui+', taps:'+C_iCLIK.state.dbltap.taps+', CtrlKey:'+ctrlkey);
		
		if(this.callbacks.hold) { clearTimeout(C_iCLIK.state.hold); }
		if(this.callbacks.up) propagate = this.callbacks.up.cb(this);
		if(this.callbacks.click) // event is defined
			if(!this.callbacks.dblclick) { // if dblclick is defined, it has to fire in the tout() 
				if(this == C_iCLIK.state.down) { // down and up on identical DOM element
					propagate = this.callbacks.click.cb(this, ctrlkey);
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
						let that = this; 
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
		if(C_iCLIK.state.hover.hovered) 
			if(this.callbacks.gone) this.callbacks.gone.cb();
		if(C_iCLIK.state.hover.timer) clearTimeout(C_iCLIK.state.hover.timer);
			else if(this.callbacks.gone) this.callbacks.gone.cb();
		C_iCLIK.state.hover = { timer:false, hovered:false, eid:false };
		$(this.elements.ui).unbind('mouseleave',this.handlers.leavehover);
	},
	tstart: function(e) { 
		if(e.touches.length>1) return true;
		let point = e.touches ? e.touches[0] : e;
		C_iCLIK.state.x = point.pageX;
		C_iCLIK.state.y = point.pageY; 
		let touch = e.touches[0]; 
		let propagate = this.down(touch, true);
		if(!propagate) e.stopPropagation(); 
		// e.preventDefault(); // we keep this default, it lets the screen scroll when you slide your finger
		return propagate;
	},
	tend: function(e) { 
		if(e.changedTouches.length>1) return true;
		let touch = e.changedTouches[0];
		let propagate = this.up(touch);
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
	
		let shifton = !!(keycode&C_KEY.code.s.shift); 
		let ctrlon = !!(keycode&C_KEY.code.s.ctrl); 
		let nudekey = keycode&=(C_KEY.code.s.alt-1); // does not have the command keys (Ctrl, Alt, Shift, etc..)
		
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
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
//
//  This objects uses RegExps and is defined here because we need RegExps to be treated as utf8 at client side
//
const INPUT_ML_TEXT	= 100 // *AREA are multiline fields, see (*mf01*)
const INPUT_ML_SMS 	= 101
const INPUT_ML_MAIL = 102
const INPUT_ML_HTML = 104
const INPUT_ML_CSS 	= 105

const INPUT_AC 		= 126 // auto complete
const INPUT_NAMES 	= 199
const INPUT_TEXT 	= 127
const INPUT_NUMER 	= 128
const INPUT_EMAIL 	= 129
const INPUT_MOBILE 	= 130
const INPUT_ALPHA 	= 131 

const INPUT_PASSWD 	= 132
const INPUT_KEYS 	= 198
const INPUT_LOGIN 	= 133

const INPUT_PHONE 	= 134
const INPUT_PRICE 	= 135
const INPUT_TOKEN 	= 136
const INPUT_BDATE 	= 137
const INPUT_TEXT_WE = 138   // with authorized emoji's
const INPUT_URL 		= 139

const INPUT_IBAN 		= 140
const INPUT_BIC 		= 141

const INPUT_MANDATORY 	= 250
const INPUT_OPTIONAL 	= 251


INPUT_TYPES = {
	
  100:	'INPUT_ML_TEXT'
, 101:	'INPUT_ML_SMS'
, 102:	'INPUT_ML_MAIL'
, 104:	'INPUT_ML_HTML'
, 105:	'INPUT_ML_CSS'

, 126:	'INPUT_AC'
, 199:	'INPUT_NAMES'
, 127:	'INPUT_TEXT'
, 128:	'INPUT_NUMER'
, 129:	'INPUT_EMAIL'
, 130:	'INPUT_MOBILE'
, 131:	'INPUT_ALPHA'

, 132:	'INPUT_PASSWD'
, 198:	'INPUT_KEYS'
, 133:	'INPUT_LOGIN'

, 134:	'INPUT_PHONE'
, 135:	'INPUT_PRICE'
, 136:	'INPUT_TOKEN'
, 137:	'INPUT_BDATE'
, 138:  'INPUT_TEXT_WE'
, 139:	'INPUT_URL'

, 140:	'INPUT_IBAN'
, 141:	'INPUT_BIC'

, 250:'INPUT_MANDATORY'
, 251:'INPUT_OPTIONAL'

}


mobtags = { // tags used in communication message templates, see M_EMLT and M_SMST (*T01*), C_dS_msgTemplate.msgMerge, C_iTAGS, smstemplen
	fusion: {
		gender:'{gender}',dear:'{dear}',firstname:'{fname}',lastname:'{lname}',company:'{company}',mobile:'{mobile}',email:'{email}',info:'{info}',registration:'{regist}',address:'{address}',
		cuein:'{time}',resadate:'{date}',resaday:'{day}',resanote:'{resa_note}',perf:'{perf}',perfnote:'{perf_note}',bookingcode:'{bcode}',
		bcal:'{att_bcal}',ucal:'{att_ucal}',fcal:'{att_fcal}',business:'{business}',participants:'{participants}',
		tmp_confirm:'{tmp_confirm}', tmp_eve:'{tmp_eve}', tmp_oneweek:'{tmp_oneweek}',
		iban:'{epay_iban}', benef:'{epay_beneficiary}', bill:'{epay_billtotal}', paid:'{epay_paid}', remains:'{epay_remains}', sepaqr:'{epay_SEPA_qr}'
	}
}


C_iEDIT = function(eid, callbacks, preset) {
	// preset is an object like { digits:'a preset string', type: INPUT_ALPHA, enabled:true, hidden:false, max:false, mandatory:false, dblclick:false }
	this.eids = { eid:eid, ui:eid+'_ui', label:eid+'_lbl' };
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
	if(preset.type == INPUT_ML_SMS) this.state.max = preset.max | 160; // (*m11*)


	switch(this.state.type) {
		case INPUT_ML_SMS: this.state.rows = this.state.rows||5; break; // *AREA are multiline fields, see (*mf01*)
		case INPUT_ML_MAIL: this.state.rows = this.state.rows||5; break;
		case INPUT_ML_TEXT: this.state.rows = this.state.rows||4; break; // 4 is default, unless specified in the preset
		case INPUT_ML_HTML: this.state.rows = this.state.rows||4; break; 
		case INPUT_ML_CSS: this.state.rows = this.state.rows||4; break;
		case INPUT_BDATE: this.state.digits = tobdate(this.state.digits); break;
		case INPUT_PRICE: this.state.digits/=100; this.state.digits = this.state.digits.toFixed(2); break;
	}		
}
C_iEDIT.defauts = new A_df( { 
	/* user presets */ label:'', placeholder:'', digits:'-', type:INPUT_TEXT, enabled:true, hidden:false, focus:false
						, tabindex:false, max:false, min:false, mandatory:false, loginId:0, dblclick:true, units:''
	/* internal state */, caret:0, filled:false, valid: true, rows:0, dbltap:{taps:0, timer:false}, isfocused:false   } );
C_iEDIT.prototype = {
	// public functions
	display: function(css, label, labelcss, options) { // return top bottom like: <div>a label</div><input>input field</input>
			options = options || { xl:true };
			css = css || '';
		let display = this.state.digits;
		
		let tabindex = (this.state.tabindex) ? ' tabindex="'+this.state.tabindex+'"' : '';
		let placeholder = (this.state.placeholder) ? ' placeholder="'+this.state.placeholder+'"' : '';
		let textinput, type='text', pattern='', name='';
		
		switch(this.state.type) {
			case INPUT_EMAIL: if(is.appleios) { type='email'; name='name="email"'; } // problem on Chrome that does not post the field
				break; 
			case INPUT_PRICE:
				css += ' right'; // falls through
			case INPUT_BDATE:
				// type='date'; // unusable because of input value format generated
				if(is.tactile) pattern = 'inputmode="numeric" pattern="[0-9-]"'; // inputmode="numeric" triggers swith on chrome/Android, pattern="[0-9-] for soft keyboards switching on IOS
				break; 
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
		
		let cssclass = css ? ' class="'+css+'"' : '';
		
			let autocap = ''; if(this.state.digits) autocap = 'autocapitalize="none"'; // Pops touch keyboard with or without autocap on first letter typed
		// if(this.state.rows) textinput = '<textarea'+cssclass+' rows="'+this.state.rows+'" id="'+this.eids.ui+'" value="'+display+'"'+tabindex+placeholder+'>'+display+'</textarea>';
		if(this.state.rows) textinput = '<textarea'+cssclass+' rows="'+this.state.rows+'" id="'+this.eids.ui+'" '+tabindex+placeholder+'>'+display+'</textarea>';
			else textinput = '<input type="'+type+'" '+name+' '+pattern+' '+cssclass+' id="'+this.eids.ui+'" value="'+display+'"'+tabindex+placeholder+' '+autocap+'/>';
		
		let dlabel = '', spanin = '', spanout = ''; if(label) { // this is used by class C_iNOTE, see (*nt01*)
			this.state.label = options.xl?C_XL.w(label):label;
			dlabel = '<span class="select-header textcolor-light '+(labelcss||'')+'">'+this.state.label+'</span><br/>';
			spanin = '<div style="margin:0; text-align:left;">'; spanout = '</div>';
		}
		let units = this.state.units || ''; if(units) units = ' '+units;

		return spanin+dlabel+textinput+units+spanout; // spans are present only when a label on top should appear
	},
	labelled: function(label, css, options) { // return side by side tds like: <td>a label</td><td>input field</td>
		options = options || { xl:true };
		this.state.label = options.xl?C_XL.w(label):label;
		let labelcss = 'label textcolor-light'+(options.labelcss?' '+options.labelcss:'');
		return '<td id="'+this.eids.label+'" class="'+labelcss+'" style="white-space:nowrap; text-align:right;">'+this.state.label+'</td><td>'+this.display(css||'alpha16')+'</td>';
	},
	td: function(css, tdcss) { // return one td like: <td>input field</td>
		let cssclass = tdcss ? ' class="'+tdcss+'"' : '';
		return '<td'+cssclass+'>'+this.display(css||'alpha16')+'</td>';
	},
	activate: function() { // must be called after display
		
		if(vbs) vlog('mobframe.js','C_iEDIT','activate','type:'+this.state.type+', eid:'+this.eids.ui);
		this.elements.collect(this.eids);
		
		this.enable(this.state.enabled).hide(this.state.hidden).focus(this.state.focus).validate(this.digits());
		$(this.elements.ui).bind('invalid',function(){return false;});
		this.setvalidtip();
		
		let that = this; if(is.tactile) if(is.android) $(this.elements.ui).bind('input', (e) => { that.androidkeys(e); } );
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
		if(this.elements.ui) {
			if(this.state.focus) {
				$(this.elements.ui).focus(); // that is only if the element was activated
				this.elements.ui.selectionStart = this.state.digits.length; // put the caret at the end
				this.elements.ui.selectionEnd = this.state.digits.length; // put the caret at the end
			}
			else { $(this.elements.ui).blur(); /* console.log('blurred '+this.eids.ui) */ }
		}
		return this;
	},
	blur: function() { return this.focus(false); },
	addClass: function(css) { $(this.elements.ui).addClass(css); return this; },
	removeClass: function(css) { $(this.elements.ui).removeClass(css); return this; },
	set: function(digits, options) { // options like { propagate:false }
			options = options||{ propagate:true };
		switch(this.state.type) {
			case INPUT_PRICE: digits/=100; digits = digits.toFixed(2); break;
		}
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
	setlabel: function(label,options) {
			options = options || { xl:true }
			label = options.xl?C_XL.w(label):label;
		this.state.label = label;
		if(this.elements.label) this.elements.label.innerHTML = label;
	},
	insert: function(i) { // does not change the caret position ( OBSOLETE, REMOVE !! still used by M_EMLT::ontag() )
					let el = this.elements.ui;
				// let caretPosition = el.selectionEnd;
				let caretPosition = this.caretPosition();
			let textBefore = el.value.substring(0,caretPosition);
			let textAfter = el.value.substring(caretPosition);
		let newText = textBefore + i + textAfter;
		if(this.state.type == INPUT_ML_SMS) if(this.remains(newText).over) return;
		el.value = newText; // enough room for this tag, insert it
		// el.focus();
		// el.selectionEnd = caretPosition+i.length;
		this.setCaret(caretPosition+i.length);
		this.changed();
	},
	valid: function() { return this.state.valid; },
	getpost: function() {
		// $(this.elements.ui).focus(); // this relates to (*ed03*)
		let d = this.cleanup(this.state.digits);
		switch(this.state.type) { // we change the format for some types here, so they match the expected at server side
			case INPUT_BDATE: return this.frombdate(d);
			case INPUT_PRICE: return ((d)*100)|0; // So we record integers, always using cents as a unit
			default:
		}
		// console.log('going to post:'+d);
		// $(this.elements.ui).blur(); // this relates to (*ed03*)
		return d;
	},
	value: function() { return this.getpost(); },
	isfocused: function() { return this.state.isfocused; },
	loading: function(onoff) { if(onoff) return this.addClass('loading'); else return this.removeClass('loading'); },
	busy: function(onoff) { 
		this.enable(!onoff); if(onoff) this.blur();
		if(onoff) return this.addClass('loading'); else return this.removeClass('loading'); 
	},
	setmax: function(m) { 
		this.state.max = m; 
		this.validate().setvalidtip();
	},
	pushprice: function() { // only for INPUT_PRICE, turns input 30 into 30.00
		if(this.state.type!=INPUT_PRICE) return this;
		if(this.elements.ui) // the field exists in the DOM
			if(this.elements.ui.value.search(/\./g) == -1) // there is no dot in the typed characters
				this.elements.ui.value = this.elements.ui.value+'.00';
		return this.validate().setvalidtip().blur();
	},
	
	// private
	androidkeys: function(e) { // only for Android smartphone keyboards, replaces the keypress function. 
		
		// console.log('==>androidkeys,',v,ch,prior);
		
		if(this.state.type==INPUT_BDATE) { 
		
			let el = this.elements.ui;
			let v = el.value; // value as is
			let ch = v.slice(-1);
			let prior = v.substring(0,v.length-1);
		
			if(v.length==1) if(/[456789 .\-]/.test(ch)) return false; // no leading space, dot, coma or minus, nor 456789 (month day number)
			if(v.length==4) if(/[23456789 .\-]/.test(ch)) return false; // no leading space, dot, coma or minus, nor 23456789 (month number)
			if(v.length==7) if(/[03456789 .\-]/.test(ch)) return false; // no space, dot, coma or minus, nor 456789 (month day number)
			
			let se = 0; // automatic insertion of delimiter characters
			if(v.length==2 && this.state.digits.length<=1) { se = 3; };
			if(v.length==5 && this.state.digits.length<=4) { se = 6; };
			if(se) {
				el.value = (v+'-');
				el.selectionStart = el.selectionEnd = se; 
				return false;
			}
		}	
	},
	setCaret: function(pos) { 
		switch(this.state.type) {
			case INPUT_EMAIL: if(is.appleios) { return this; } // PVH2023 problem on Safari on IOS : "input element ('email') does not support selection"
				break;
		}
		return this.setSelectionRange(pos);
	},
	setSelectionRange: function(selectionStart, selectionEnd) { // can be used to set the caret position if End is omitted
		selectionEnd = selectionEnd || selectionStart;
		if (this.elements.ui.setSelectionRange) { // Firefox, Webkit, Gecko
			// this.elements.ui.focus(); // (BF - removed to fix the resa dupplicate bug that let the dropdown pop up when a performance was in the to dupplicate appmt)
			this.elements.ui.setSelectionRange(selectionStart, selectionStart);
		}
		else if (this.elements.ui.createTextRange) { // MS-IE
			let range = this.elements.ui.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
		return this;
	},
	caretPosition: function() { // Obtain caret position through the field
		 if(this.elements.ui.selectionStart) { return this.elements.ui.selectionStart; } // Firefox, Webkit, Gecko
			else if(document.selection) // MS-IE
			{ 
				this.elements.ui.focus();
				let r = document.selection.createRange(); 
				if (r == null) { return 0; } 

				let re = this.elements.ui.createTextRange(), rc = re.duplicate(); 
				re.moveToBookmark(r.getBookmark()); 
				rc.setEndPoint('EndToStart', re); 
				return rc.text.length; 
			} 
		return 0;
	},
	statecaretvalue: function() { return this.state.caret?this.state.caret:'0'; }, // for console.log debug, displays a zero when value is zero instead of displaying nothing
	ui: function(digits) {  // writes in ui dom elements but does not update internal this.state.digits
		
		if(this.elements.ui) {
			let caretPosition = this.caretPosition();
			this.elements.ui.value = digits;
			this.setCaret(caretPosition);
		}
		return this;
	},
	digits: function() {  // reads actual content of the edit field
		if(this.elements.ui) { // activated control
			// if(this.state.rows) return this.elements.ui.innerHTML; else // <textarea> works with the .value attribute (!!) the innerHTML always content the initially set string and does not change when typing on keyboard
			return this.elements.ui.value; // <input>
		}
		return '';
	},
	smstemplen: function(t) {	// calculates the text length written in the field
		let tokensLen = 0;
		let tokens = t.match(/{\w+}/g); // identify tokens in our text (identified as {words} inside curlies)
		for(let x in tokens) {
			switch(tokens[x]){ // we use an estimated average length
				
				case mobtags.fusion.gender: 	tokensLen += 4; break; // see M_EMLT and M_SMST (*T01*), mobtags = {} is defined in mobframe.js as part of C_iEDIT
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
				
				case mobtags.fusion.iban: 		tokensLen += 20; break;
				case mobtags.fusion.benef: 		tokensLen += 15; break;
				case mobtags.fusion.bill: 		tokensLen += 5; break;
				case mobtags.fusion.paid: 		tokensLen += 5; break;
				case mobtags.fusion.remains: 	tokensLen += 5; break;
				case mobtags.fusion.sepaqr:		tokensLen += 1; break; // is supposed to be an image inserted in emails
				default:
					tokensLen += 6; // any other tag defined elsewhere in the code and never referred here
			}	
		}
		let allbuttokens = t.replace(/{\w+}/g,'').length;
		let total = allbuttokens + tokensLen;
		return total;
	},
	remains: function(t) {
		if(!t) t = this.digits(); // t = this.state.digits;
		if(!this.state.max) return { over:0, remains:1, positive:t.length, max:0 };
		let r = this.state.max;
		switch(this.state.type) {
			case INPUT_ML_SMS:	r -= this.smstemplen(t); break;
			default: r -= t.length;
		}	
		let p = r; if(r<0) p=0; // r can be negative, so to show the overflow
		return { over:(r<0)?true:false, remains:r, positive:p, max:this.state.max };
	},
	frombdate: function(digits) { // the assumed field format is YYYY-MM-DD
		let scan = this.bdateScan(digits);
		let formated = scan.y+scan.m+scan.d;
		return formated; // output format is YYYYMMDD
	},
	bdateScan: function(digits) {
	
		let yyyy='', mm='', dd='';
		
		// format check
		// 
		// allows: 1963-11-01 or 1963 11 01 or 1963.11.01 or 1963/11/01
		// allows: 1963-11-01 or 1963-11-1
		//
		if (digits.search(/^\d{1,2}(\.|\/|\-| )\d{1,2}\1\d{4}$/) == -1) // checks if you respect a format like 30-12-1970 or 30/12/1970 or 30 12 1970 or 30.12.1970
			return { y:yyyy, m:mm, d:dd, valid:false, format:false }
		
		// date reality check
		let parts;
		if(digits.search(/\//) != -1) parts = digits.split('\/');
			else if(digits.search(/\./) != -1) parts = digits.split('.');
			else if(digits.search(/\-/) != -1) parts = digits.split('-');
			else if(digits.search(/ /) != -1) parts = digits.split(' ');
			
				dd = parts.shift();
				mm = parts.shift(); if(mm.length==1) mm = '0'+mm;
				yyyy = parts.shift(); if(dd.length==1) dd = '0'+dd;
			let ymd = yyyy+'-'+mm+'-'+dd;

			// let date = new Date(ymd); // will not work on MSIE
		let date = new Date(1,1,2000); date.setSeconds(0); date.setFullYear((yyyy|0)); date.setMonth((mm|0)-1); date.setDate((dd|0));
		
			let validdate = date.isvalid(yyyy,mm,dd); // not only the format must be ok, but the date itself must exist in the calendar
		return { y:yyyy, m:mm, d:dd, valid:validdate, format:true }
	},
	
	
	// private events handling
	validate: function(newdigits) { // sets this.state.valid according to expected format type and mandatory attributes
		newdigits = newdigits || this.digits();
		this.state.filled = newdigits != '';
		this.state.valid = true;
		switch(this.state.type) {
			case INPUT_EMAIL: 	this.state.valid = this.isEmail(newdigits);	break;
			case INPUT_URL: 	this.state.valid = this.isURL(newdigits);	break;
			case INPUT_BDATE:	this.state.valid = this.isBdate(newdigits);	break;
			
			case INPUT_PRICE: 	this.state.valid = this.isPrice(newdigits);	break;
			case INPUT_IBAN: 	this.state.valid = this.isIBAN(newdigits);	break;
			case INPUT_BIC: 	this.state.valid = this.isBIC(newdigits);	break;
			
			case INPUT_MOBILE: 	this.state.valid = this.isMobile(newdigits); break;
			case INPUT_PHONE: 	this.state.valid = this.isPhone(newdigits); break;
			case INPUT_LOGIN: 	this.state.valid = false; this.logindelay.dcb(600, newdigits); break;
			case INPUT_TOKEN: 	this.state.valid = false; this.tokendelay.dcb(600, newdigits); break;
			case INPUT_ML_SMS: this.state.valid = !this.remains().over; break;
		}
		if(this.state.mandatory) if(!this.state.filled) { this.state.valid = false; }
		
		if(vbs) vlog('mobframe.js','C_iEDIT','validate','eid:'+this.eids.ui+', valid :'+this.state.valid);
		return this;
	},
	disallowed: function(inputtype) { // provides a filter for absolute disallowed chars in our system.
		
		let f = '';
		switch(inputtype) { // keep this inline with (*re01*), but keep in mind that they might differ
			
			case INPUT_ML_HTML: // _ML_ are multiline fields, see (*mf01*), must also stay coherent with (*mf02*)
			case INPUT_ML_MAIL: 
			case INPUT_ML_CSS: 
				// note that here, we will accept ANY character from UTF-8 including diacritics, emoji's, whatshowever
				// BUT we want to disallow | pipes, " double quotes, \ slashes, #hashtags, and <> used by hackers to squeeze <script>

			case INPUT_KEYS:
			case INPUT_PASSWD:
			case INPUT_LOGIN:
			
				f = '|"'; break; // this first version is laxer 
				
			default: 
				f = '|<>\\#"'; break; // the default version is more exclusive
		}	
		return { 'filter':f };
	},
	filterfor: function(inputtype) { // provides a filter for allowed chars depending on field type.
		
		// please refer to 
		// https://stackoverflow.com/questions/20690499/concrete-javascript-regular-expression-for-accented-characters-diacritics
		//
		// The easier way to accept all accents is this:
		//
		// [A-zÀ-ú] // accepts lowercase and uppercase characters
		// [A-zÀ-ÿ] // as above, but including letters with an umlaut (includes [ ] ^ \ × ÷)
		// [A-Za-zÀ-ÿ] // as above but not including [ ] ^ \
		// [A-Za-zÀ-ÖØ-öø-ÿ] // as above, but not including [ ] ^ \ × ÷
		//
		
		let f = '';
		
		let language = ' a-zA-ZÀ-ÖØ-öø-ÿ0-9-';
		let currency = '\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6'; // currency symbols
		let extpoints = '\+\'\/\?\&=,.,\!\:\;\*(){}%$@', cr = '\\r\\n'; // '\-\+\'\/\?\&=,.,\!\:\;\*#(){}%';
		// let emoji = '\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]';
		let emoji = '\p{Extended_Pictographic}'; // https://javascript.info/regexp-unicode
		switch(inputtype) { // keep this inline with (*re01*), but keep in mind that they might differ
		
			case INPUT_MOBILE: 			
			case INPUT_PHONE: 	f = '0-9+'; 	break;
			case INPUT_NUMER: 	f = '0-9'; 		break;
			case INPUT_BDATE:	f = '0-9-'; 	break;
			
			case INPUT_EMAIL: 	f = '._a-zA-Z0-9-@'; break; // email address (not the content!)
			
			case INPUT_PRICE: 	f = '.0-9-'+cr; 	break;
			case INPUT_IBAN: 	f = ' a-zA-Z0-9'; 	break;
			case INPUT_BIC: 	f = 'a-zA-Z0-9'; 	break;
			
			case INPUT_ALPHA: 	f = '\-\'_a-zA-Z0-9çéèëêôîïû@,. '; 	break;
			
			case INPUT_KEYS:
			case INPUT_PASSWD:
			case INPUT_LOGIN: 	f = language+extpoints+'_\\[\\]\~`'; 	break; // double escape for [] in RegExps
			
			case INPUT_TOKEN: 	f = 'a-z0-9';				break;
			case INPUT_URL: 	f = '.éèa-zA-Z0-9-\:\/\?\&='; break;
			case INPUT_AC: 		f = language+extpoints;	break; // default value for Auto-Complete input field
						
			case INPUT_TEXT: // single line text, with extended points set, parentheses
					f = language+extpoints+emoji+currency; break;
					
			case INPUT_TEXT_WE: // _WE stands for With Emoji's
			case INPUT_ML_TEXT: // multi line notes 
					f = language+extpoints+emoji+currency+cr; break;
					
			case INPUT_NAMES: // single line text, i.e. firstname, lastname, address, city, country, residence, ...
					f = language+'().,\?\&\'\/'; break; // O'connor-Mary (Peter's Son?)

			case INPUT_ML_CSS:  f = cr+' _a-zA-Z0-9-@'+'.,\'\!\/\:\;\*#<>(){}%'; 	break; // note that Multi Line fields must accept carriage return 
					
					
				// Here under basically you accept anything BUT the forbidden chars ( see this.disallowed() )
			case INPUT_ML_HTML:  
			case INPUT_ML_MAIL: // allows emoji's because we don't apply any filter here
			case INPUT_ML_SMS: 
			
			default:
				f = false; break;
		}	
		return { 'filter':f }; // see also this.disallowed() that flushes disallowed characters
	},
	cleanup: function(digits) { // used by this.changed() and by this.getpost()
	
		let cleanedup = digits;
			let f4 = this.filterfor(this.state.type); // something like ._a-zA-Z0-9-@ depending on the input type
		if(f4.filter) {
			let x = '[^'+f4.filter+']'; // something like /[^._a-zA-Z0-9-@]
			let regxp = new RegExp(x,'gu'); // something like /[^._a-zA-Z0-9-@]/g
			
			cleanedup = digits.replace(regxp,''); // more characters are dropped here according to the field type.
			
			let changed = digits != cleanedup;
			if(changed) console.log('cleanup filter '+x+' for field '+INPUT_TYPES[this.state.type]+'('+this.state.type+') (in=|'+digits+'|, out=|'+cleanedup+'|)'); // +32/493-655 | abc 599 // thit is a test string ;)
			// console.log('cleanup filter '+x+' for field '+INPUT_TYPES[this.state.type]+'('+this.state.type+') (in=|'+digits+'|, out=|'+cleanedup+'|)'); // +32/493-655 | abc 599 // thit is a test string ;)
		}
		
			let disallowed = this.disallowed(this.state.type); // something like ._a-zA-Z0-9-@ depending on the input type
		let x = '['+disallowed.filter+']'; // something like /[^._a-zA-Z0-9-@]
		let disaregxp = new RegExp(x,'g'); // something like /[^._a-zA-Z0-9-@]/g
		
		let screened = cleanedup.replace(disaregxp,''); // more characters are dropped here according to the field type.

		let cleaned = screened != cleanedup;
		if(cleaned) console.log('cleanup disallowed '+x+' (in=|'+cleanedup+'|, out=|'+screened+'|)'); 
		
		// Some test strings
		//
		// Names: Joël Hêymäçon
		// IBAN: BE43 06|31 43/89 6101
		// MOBILE: +32/493-655 | abc 599 // thit is a test string ;) +32493655599
		
		return screened;
	},
	changed: function(paste) { // called on a keyup event. 

		// paste [false,true] tells us if a copy/paste was used
		// note: PVH 2023
		// the problem is that a "paste" operation is not only a Ctrl+V, it can happen by many means including automatic
		// pre-completion /or dictation that most of smartphones now have. See (*ed03*)
		
		let newentry = this.digits(); // new txt entry that triggered a call to changed()
		let formertxt = this.state.digits;
		let cleanedup = this.digits(); // another copy that we will filter against our entry policy

		// console.log('mobframe.js::C_iEDIT::changed(paste='+paste+')');

		
		if(paste===true) // copy/paste might escape the filtering already taking place here (*ed01*)
			cleanedup = this.cleanup(cleanedup);
		
		let remain = this.remains(cleanedup);
		if(remain.over) // no room remaining for this copy/paste, this protection acts also on ribon key ( maintaining a key pressed for seconds )
			if(newentry.length >= formertxt.length) cleanedup = formertxt; // here we allow only reducing the string length
		
		let corrected = newentry != cleanedup; // corrected after a copy/paste
		let changed = formertxt != newentry; // new typing
		
		if(vbs) vlog('mobframe.js','C_iEDIT','changed','paste:'+(paste?'YES':'NOPE')
			, 'former txt: '+newline+tab+formertxt
			, 'new entry:' +newline+tab+newentry
			, 'corrected: '+corrected
			, 'changed: '+changed
			);
		
		if(changed||corrected) { 
			this.ui(cleanedup).validate(cleanedup).setvalidtip();
			this.state.digits = cleanedup;
			if(paste&&corrected) this.setCaret(this.state.caret);
			
			if(this.callbacks.onfchange) {
				let statereport = { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
				this.callbacks.onfchange.cb(cleanedup, statereport);
			}
		}
		return this;
	},
	setvalidtip: function() { // based on this.state.valid set by this.validate(), here we change the field frame to red (class validNOK) and set a tooltip with error message
				
		if(this.tooltip) { this.tooltip.remove(); this.tooltip = false; }
		$(this.elements.ui).removeClass('validNOK').addClass('validOK');
		
		let msg = '', wrongentry = !this.state.valid; 
		if(wrongentry) {
			switch(this.state.type) {
				case INPUT_EMAIL: 	msg = C_XL.w('not email'); break;
				case INPUT_MOBILE: 	msg = C_XL.w('not mobile'); break;
				case INPUT_PHONE: 	msg = C_XL.w('not phone'); break;
				case INPUT_NUMER: 	msg = C_XL.w('not numeric'); break;
				case INPUT_BDATE: 	msg = C_XL.w('not bdate'); break;
				
				case INPUT_PRICE: 	msg = C_XL.w('not price'); break;
				case INPUT_IBAN: 	msg = C_XL.w('bad format'); break;
				case INPUT_BIC: 	msg = C_XL.w('bad format'); break;
				
				case INPUT_ALPHA: 	msg = C_XL.w('not alpha'); break;
				case INPUT_TOKEN: 	msg = C_XL.w('bad e-url'); break;
				case INPUT_URL: 	msg = C_XL.w('not url'); break;
				case INPUT_LOGIN: 	msg = C_XL.w('bad login'); break;
				case INPUT_PASSWD: 	msg = C_XL.w('not pass'); break;
			}
			$(this.elements.ui).addClass('validNOK').removeClass('validOK');
		}	
		if(this.state.mandatory)
			if(!this.state.filled) { msg = C_XL.w('not filled in'); }
					
		if(msg)	{ // see if we set some new warning
			this.tooltip = new C_iTIP(this.eids.ui, { text:msg, css:'warning', offset:{x:-38, y:0}} );
			this.tooltip.activate();
		}
		return this;
	},
	
	// events
	keypress: function(e) { 
		// This event is not triggered on Androïd smartphone keyboard.
	
		// this function returns a propagation boolean true or false => lets the character appear 
		// in the field, or block it here (return false)
		// when false is returned, the character does not appear on the screen.

		// Important note : we treat here every SINGLE char entry on keyboard. 
		// Because they are the result of a key combination, Copy/paste's are detectable only at keyup event. See this.keyup()
		// 
		// When this function returns false, one character input from keyboard will not be displayed in the field.
		// If this function returns true, the character input appears on the field and the keyup() function is then called.
		
		if(!this.state.enabled) { return false; }
		
				let el = this.elements.ui;
			let caretPosition = el.selectionEnd;
		this.state.caret = caretPosition;

			let key = e.which; // key code - Netscape/Firefox/Opera 
			let keyraw = C_KEY.specials.check(e);
			let ctrlon = !!(keyraw&C_KEY.code.s.ctrl);
					
		if(vbs) vlog('mobframe.js','C_iEDIT','keypress','eid:'+this.eids.ui+', key:'+key+', caret pos:'+this.statecaretvalue()+', keyraw:'+keyraw);
		
		if(key==C_KEY.code.s.backspace || key==0 || ctrlon) return true; // delete left arrow right arrow tab => key == 0, and ctrl combinaisons are accepted
		
		let ch = String.fromCharCode(key); // the string character version of the key code
			let textBefore = this.state.digits.substring(0,caretPosition);
			let textAfter = this.state.digits.substring(caretPosition);
		let newtxt = textBefore + ch + textAfter;
		
			let disallowed = this.disallowed(this.state.type); // something like ._a-zA-Z0-9-@ depending on the input type
		let x = '['+disallowed.filter+']';
		let regxp = new RegExp(x);
		
		if(regxp.test(ch)) { console.log('keypress |'+ch+'| stopped by char code disallowed: '+x+' for input '+INPUT_TYPES[this.state.type]); return false; } // the key pressed is a prohibited character
		
		if(this.remains(newtxt).over) return false; // no room for anymore character, according to this.state.max setting, copy/paste cases are treated here (*ed02*)
		
			let f4 = this.filterfor(this.state.type); // something like ._a-zA-Z0-9-@ depending on the input type
		if(f4.filter) {
			let x = '['+f4.filter+']'; // something like /[^._a-zA-Z0-9-@]
			let regxp = new RegExp(x,'gu');
			if(!regxp.test(ch)) { console.log('keypress |'+ch+'| stopped by field type filter: '+x+' for input '+INPUT_TYPES[this.state.type]); return false; } // the key pressed is a prohibited character
		}

		
		// now some more fancy filtering depending on context or character sequence in the already typed text
		if(this.state.type==INPUT_AC) { 
			if(newtxt.length==1) if(/[', .\-]/.test(ch)) return false; // no leading space, dot, coma or minus
			if(/, /.test(newtxt)) return true; // allows to type Isaac, Newton
			if(/[', .\-]{1,}[', .\-]{1,}/.test(newtxt)) return false; // any of [ ,.\-] may not be followed by any of [ ,.\-]
		}
		if(this.state.type==INPUT_MOBILE) { 
				let localCC = mobminder.account.phoneRegion;
				let usetrunk = (localCC!=34&&localCC!=352&&localCC!=1)
			if(usetrunk) // For Luxembourg, Spain and North america (USA and Canada): people are used to enter no trunk number, see (*tr01*)
				if(newtxt[0]!='0' && newtxt[0]!='+')  { return false; } // you must place a 0 or a + at the beginning of your mobile number
			
			if(/[+0123456789]{1,}[+]{1,}/.test(newtxt))  { return false; } // any of [digits] may not be followed by a new +
		}
		if(this.state.type==INPUT_BDATE) { 
			
			let v = el.value+ch; // value forecast
			if(v.length==1) if(/[456789 .\-]/.test(ch)) return false; // no leading space, dot, coma or minus, nor 456789 (month day number)
			if(v.length==4) if(/[23456789 .\-]/.test(ch)) return false; // no leading space, dot, coma or minus, nor 23456789 (month number)
			if(v.length==7) if(/[03456789 .\-]/.test(ch)) return false; // no space, dot, coma or minus, nor 456789 (month day number)
			
			let se = 0; // automatic insertion of delimiter characters
			if(v.length==2 && this.state.digits.length<=1) { se = 3; };
			if(v.length==5 && this.state.digits.length<=4) { se = 6; };
			if(se) {
				el.value = (v+'-');
				el.selectionStart = el.selectionEnd = se; 
				return false;
			}
		}
		if(this.state.type==INPUT_IBAN) { 
				let v = (el.value+ch); // value forecast
				let se = 0, pos; // automatic insertion of delimiter characters
				let d = ' '; // delimiter character
			pos = 5; if(v.length==pos && this.state.digits.length<=(pos-1)) { se = (pos+1); }; // the delimiter is inserted NOT after you typed the 4th character, but BEFORE the 5th typed character
			pos = 10; if(v.length==pos && this.state.digits.length<=(pos-1)) { se = (pos+1); }; // 
			pos = 15; if(v.length==pos && this.state.digits.length<=(pos-1)) { se = (pos+1); }; //
			pos = 20; if(v.length==pos && this.state.digits.length<=(pos-1)) { se = (pos+1); }; // 
			if(se) {
				el.value = (el.value+d+ch);
				el.selectionStart = el.selectionEnd = se; // re-position cursor after the freshly appended digit
				return false;
			} 
		}
		if(this.state.type==INPUT_PRICE) {
			if(key==C_KEY.code.s.enter) {
				let newdigits = this.digits();
				if(newdigits.indexOf('.')==-1) this.set(newdigits*100); 
				if(vbs) vlog('mobframe.js','C_iEDIT','keypress[INPUT_PRICE, ENTER]','eid:'+this.eids.ui+', newdigits:'+newdigits);
				return false;
			}
		}
		return true;
	},
	keyup: function(e) { // this event is triggered after the character appeared in the input field
			let key = e.which; // key code - Netscape/Firefox/Opera
			let el = this.elements.ui;
		
		if(key==37 || key==38) {  // arrow keys cause carret to change its position and those keys cannot be detected at keypress event
					
				let caretPosition = el.selectionStart; // back and up arrow keys cause carret to hang at selectionStart
			this.state.caret = caretPosition;
		}
		if(key==39 || key==40) {  // arrow keys cause carret to change its position and those keys cannot be detected at keypress event
				let caretPosition = el.selectionEnd;	// right and bottom arrow keys cause carret to hang at selectionEnd
			this.state.caret = caretPosition;
		}
		if(vbs) vlog('mobframe.js','C_iEDIT','keyup','eid:'+this.eids.ui+', caret pos:'+this.statecaretvalue()+', key:'+key);
		
		if(key>=16 && key<46 && key!=32) return false; // do not trigger the change function for ctrl keys (32 is the space key, which must trigger a format check)
		// if(key>=16 && key<=46 && key!=32) return false; // PVH 2021-03 in this previous version, there is <= 46 with 46 being C_KEY.code.s.del (delete keyboard key). In order to fix a bug that deletion was not taken into account, I changed it to <46.
		
		switch(this.state.type) {
			case INPUT_IBAN:  // special treatment here:
			case INPUT_BIC:  
				el.value = el.value.toUpperCase();
				break;
			case INPUT_EMAIL:  
				el.value = el.value.toLowerCase();
				break;
		}
		
				let keyraw = C_KEY.specials.check(e);
			let paste = keyraw==(C_KEY.code.s.ctrl+C_KEY.code.alpha.v); // Note that AltGr = C_KEY.code.s.ctrl + C_KEY.code.s.alt
			// We discovered that a copy/paste where the v key is released AFTER the Ctrl Key is NOT catched by C_KEY.code.s.ctrl+C_KEY.code.alpha.v
			// in this case is goes undiscovered to this.changed() ... (!?)
			
		this.changed(paste);
	},
	dblclick: function(e) {  
		if(!this.state.dblclick) return; // does nothing if the double click feature is disabled (e.g. useful for notes fields, see C_iNOTE)
		this.state.caret = 0;
	if(vbs) vlog('mobframe.js','C_iEDIT','dblclick','caret pos:'+this.statecaretvalue());
		this.ui('').changed(); 
		let returnvalue = undefined;
		if(this.callbacks.onfclear) returnvalue = this.callbacks.onfclear.cb();
		// this.focus(true);
		return returnvalue;
	},
	smplclick: function(e) {
		if(++this.state.dbltap.taps >= 2) { return this.dblclick(); /* double click */ }
		if(this.state.dbltap.timer) clearTimeout(this.state.dbltap.timer);
			let tout = this.handlers.clickout;
		this.state.dbltap.timer = setTimeout(tout, 500);
		
		this.state.caret = this.caretPosition();
	if(vbs) vlog('mobframe.js','C_iEDIT','smplclick','caret pos:'+this.statecaretvalue());
		return true; 
	},
	clickout: function() {
		if(this.state.dbltap.taps == 1) if(this.callbacks.onfclick) this.callbacks.onfclick.cb();
		this.state.dbltap.taps = 0;
	},
	onfocus: function() { 
		
		if(!this.state.isfocused) if(this.callbacks.onffocus) this.callbacks.onffocus.cb(this); // callback called only when entering from a non focused state
		this.state.isfocused = true;
		if(this.callbacks.onenterkey) {
			C_KEY.unbind(C_KEY.code.s.enter, this.handlers.enterkey, 'C_iEDIT::'+this.eids.eid); // in some circumstances, onfocus() triggers twice for the same field
			new C_KEY(C_KEY.code.s.enter, this.handlers.enterkey, 'C_iEDIT::'+this.eids.eid);
		}
		this.state.caret = this.caretPosition();
		if(this.state.type==INPUT_PRICE) {
			$(this.elements.ui).removeClass('right').addClass('left');
		}
		if(vbs) vlog('mobframe.js','C_iEDIT','onfocus','eid:'+this.eids.ui+'caret pos:'+this.statecaretvalue());
	},
	onblur: function() { 
		this.state.isfocused = false;
		if(this.callbacks.onfblur) this.callbacks.onfblur.cb(this);
		if(this.callbacks.onenterkey) { C_KEY.unbind(C_KEY.code.s.enter, this.handlers.enterkey); }
		if(this.state.type==INPUT_PRICE) {
			$(this.elements.ui).removeClass('left').addClass('right');
			
			let newdigits = this.digits();
			if(newdigits.indexOf('.')==-1) this.set(newdigits*100); // you didn't type any dot so we assume you enter an amount without cents (like 50 for 50.00)
			if(vbs) vlog('mobframe.js','C_iEDIT','onblur[INPUT_PRICE]','eid:'+this.eids.ui+', newdigits:'+newdigits);

		}
		if(vbs) vlog('mobframe.js','C_iEDIT','onblur','eid:'+this.eids.ui+'caret pos:'+this.statecaretvalue());
	},
	onenterkey: function(keycode) {
		if(this.callbacks.onenterkey) this.callbacks.onenterkey.cb(this.state.digits, keycode);
	},
	
	
	// touch events handling
	tstart: function(e) { 
		if(this.state.dbltap.taps) e.preventDefault(); // prevents zoom effect
		if(++this.state.dbltap.taps >= 2) { this.dblclick(); /* double tap */ return true; }
		if(this.state.dbltap.timer) clearTimeout(this.state.dbltap.timer);
			let tout = this.handlers.tout;
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
		let post = new C_iPASS(sText);
		mobminder.app.post( {post:post}, {post:'l'}, './queries/login.php', new A_cb(this,this.isLoginFree), new A_cb(this,this.isLoginFree) );
	}, 
	isToken: function(sText) {
		if(!sText) { 
			this.state.valid = true; 
			if(this.state.mandatory) if(!this.state.filled) { this.state.valid = false; }
			this.setvalidtip(); return; 
		} // if the field is mandatory, it displays an appropriate msg
		let post = new C_iPASS(sText);
		mobminder.app.post( {post:post}, {post:'l'}, './queries/token.php', new A_cb(this,this.isTokenFree), new A_cb(this,this.isTokenFree) );
	},
	isEmail: function(sText) { // INPUT_EMAIL
		if (sText == '') return true; // entering no e-mail is also ok (up to mandatory feature to further decide)
		if (sText.search(/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\.[_a-zA-Z0-9-]{2,12}){1}$/) == -1) // 12 is the maximum length for the domain type, e.g. pascal@vanhove.europe will fit
			return false;
		return true;
	}, 
	isPrice: function(sText) { // INPUT_PRICE
		if(sText == '0.00') return !this.state.mandatory; // entering no price at all is also ok (up to mandatory feature to further decide)
		if(sText.search(/^[0-9-]{1}[0-9]*\.([0-9]{2}){1}$/) == -1) // checks format like 123456.11
			return false;
		if(this.state.min) {
			let actual = (((sText)*100)|0);
			if(actual<this.state.min) return false;
		}
		return true;
	}, 
	isIBAN: function(iban) {
		if (iban == '') return true; // blank entry is also ok (up to mandatory feature to further decide)
		if (iban.search(/^([A-Z]{2}[ ]?[0-9]{2})(?=(?:[ ]?[A-Z0-9]){9,30}$)((?:[ ]?[A-Z0-9]{3,5}){2,7})([ ]?[A-Z0-9]{1,3})?$/) == -1)
			return false;
		
		const ibanStripped = iban.replace(/[^A-Z0-9]+/gi,'').toUpperCase(); //keep numbers and letters only //calculation expects upper-case
		const m = ibanStripped.match(/^([A-Z]{2})([0-9]{2})([A-Z0-9]{9,30})$/);
		if(!m) return false;
		  
		const numbericed = (m[3] + m[1] + m[2]).replace(/[A-Z]/g,function(ch){
								//replace upper-case characters by numbers 10 to 35
								return (ch.charCodeAt(0)-55); 
							});
		// The resulting number would be to long for javascript to handle without loosing precision.
		// So the trick is to chop the string up in smaller parts.
		const mod97 = numbericed.match(/\d{1,7}/g).reduce(function(total, curr){ return Number(total + curr)%97},'');

		let correct = (mod97 === 1);
		return correct;
	},
	isBIC: function(sText) {
		return true; // we do not bother users with this format validation
		if (sText == '0') return true; // blank entry is also ok (up to mandatory feature to further decide)
		if (sText.search(/^[0-9]{1}[0-9]*\.([0-9]{2}){1}$/) == -1)
			return false;
		return true;
	},
	
	isPhone: function(sText) {
		
		if(sText == '') return true; 	// entering no number is also ok (up to mandatory feature to further decide)
		
		// checking for allowed chars
		let split = sText.split('');
		pattern = new RegExp(/[+0-9]/);
		for(let i in split)
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
		let prefixis = function(prefix, digits) {
			let l = prefix.length;
			return digits.substr(0, l) == prefix;
		}
		let NSNdigits = function(digits) { // National Significant Numbers, check also (*nsn*)
			
			if(prefixis('+1',digits)) return 10; // North america. E.g. Canada Quebec: +1 418 2652311
			
			if(prefixis('+216',digits)) return 8; // Tunisia: +216 yy 123456
			if(prefixis('+230',digits)) return 8; // Mauritius island: +23 [0 yyy xxxx] 
			
			if(prefixis('+352',digits)) return [6,7,8,9,10]; // Luxembourg: open plan (numbers may have whatever number of digits)
			
			if(prefixis('+370',digits)) return 8; // Lithuania: +370 686 12345
			if(prefixis('+371',digits)) return 8; // Latvia:  +371 640 12345
			if(prefixis('+372',digits)) return 8; // Estonia: +372 81xx xxxx
			if(prefixis('+373',digits)) return 8; // Moldova: is an exception inside the +37, it has 8 NSN digits
			
			if(prefixis('+385',digits)) return [8,9]; // Croatia: +385 98 123456 or +385 91 1552692

			// Italy (the big mess :)
			if(prefixis('+39335', digits)) return [9,10]; // TIM mobile Italy, mobiles like +39 3xx 123456 (older assigned numbers, today all assigned numbers have 10 digits)
			if(prefixis('+393',digits)) return 10; // Most general case Italy, mobiles like +39 3xx 1234567
			
			if(prefixis('+43660',digits)) return 10; // +43 is for Austria, they have 10 NSNs in Cell phones like +43 660 1234567
			if(prefixis('+43',digits)) return [10,11]; // +43 is for Austria, they have 10 or 11 NSNs in Cell phones like +43 699 11223344
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
		let CCdigits = function(digits) { // International Country codes
		
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
		let split = sText.split('');
		let header = split[0];
		let trunk, cc, nsn, n, match = false, l = sText.length;
		let localCC = '+'+mobminder.account.phoneRegion;
		switch(header) {
			case '+': trunk=1; cc=CCdigits(sText); nsn=NSNdigits(sText); break; // input like +32497123456
			case '0': trunk=1; cc=0; nsn=NSNdigits(localCC+sText.substr(1)); break; // input like 0493123456, we remove the trunk zero and put the local CC (e.g. +32) in front
			default: trunk=0; cc=0; nsn=NSNdigits(localCC+sText); break; // input without trunk nor international code, like 497123456, see (*tr01*)
		}
			// console.log('Trunk:'+trunk+', CC:'+cc+', NSN:'+nsn);
		if(nsn==0) return true; // open numbering plan... everything is agreed
		
		if(!nsn.length) nsn = [nsn]; // not an array? make it an array. 
		while(n = nsn.shift()) {
			let expected = trunk + cc + n;
			if(l == expected) match = true; // compares entered text length with expected 
		}
		if(!match) return false;
		return true;
	},
	isBdate: function(sText) {
		if (sText == '') return true; // entering no birthday is also ok (up to mandatory feature to further decide)
		return this.bdateScan(sText).valid;
	},
	isNumber: function(sText) {
		if (sText == '') return true;
		if (sText.search(/(^-*\d+$)|(^-*\d+\.\d+$)/) == -1) return false;
		return true;
	}, 	
	isURL: function(sText) {
		if (sText == '') return true; // entering no url is also ok (up to mandatory feature to further decide)
		// if (sText.search(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/) == -1)
		// if (sText.search(/^((https?):\/\/)?(www\.)?[a-z0-9\-\.]{3,}\.[a-z]{2,3}$/) == -1)
		if (sText.search(/^((https?):\/\/)?(www\.)?[éèa-z0-9\-\.]{3,}\.[a-z]{2,12}(\/[a-zA-Z0-9\-\.]{1,}){0,12}?$/) == -1) // 12 is the maximum length for the domain type, e.g. www.pédicure-médicale.business.site will fit
			// PVH 2022: include argument under the form of /argument, needed for be.mobminder.com/dupont
			// PVH 2022: include A-Z digits provided by google maps short hand links like https://goo.gl/maps/3UURNnCikFH9L9A27
			return false;
		return true;
	}, 
	
	// ajax feedback handling
	isLoginFree: function(dS, stream) { // stream is 0 or the id of an existing login
		this.state.valid = false;
		stream = stream.split('#').shift();
		if(stream) { // login is authorized when not in use yet, or when in use by this same loginId
			let ids = stream.split('!');
			for(let x in ids) { let id = ids[x]; if(id == this.state.loginId) { this.state.valid = true; break; } } // allows multiple identical login names
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
		let l = phonenumber.length;
		let m = phonenumber;
	if(splicing==2) m = m.splice(l++-(splicing*3+3), 0, ' '); // makes it +33 623 12 34 56, or +32 493 111 222
	m = m.splice(l++-(splicing*3), 0, ' ');
	m = m.splice(l++-(splicing*2), 0, ' ');
	m = m.splice(l++-(splicing*1), 0, ' ');
	return m;
}
C_iEDIT.ergoprice = function(cents) { let unit = (cents/=100).toFixed(2); return unit; }


function fb_toclipboard(text) { // fallback solution for browsers having no navigator.clipboard, we preferably do not use this solution
	let textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		let successful = document.execCommand('copy');
		let msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
	}

	document.body.removeChild(textArea);
};
function toclipboard(text) { // copy the giventext to the device clipboard
	if(!text) return;
	if(!navigator.clipboard) {
		fb_toclipboard(text); // fallback solution for browsers having no navigator.clipboard
		return;
	}
	navigator.clipboard.writeText(text).then( function() {
		console.log('Async: Copying to clipboard was successful!');
	}, function(err) {
		console.error('Async: Could not copy text: ', err);
	});
};

// C_iFIELD = C_iEDIT;
// C_iFIELD.prototype.modalquit = function() {}; // closes the edit modal screen;



class C_iFIELD extends C_iEDIT { // on computer/keyboard device this class is transparent and defaults to C_iEDIT, if is.newtouch (touch device) then this class nests the C_EDIT
	
	// public
	constructor(eid, callbacks, preset) {
		
		
		super(eid, callbacks, preset); if(!is.newtouch) return; // defaults to a C_iEDIT instance. 
		
		if(!this.callbacks.onfchange) this.callbacks.onfchange = new A_cb(this, this.trackvalid); // supervising the operations in super
		
		this.eids.fs = { avatar:eid+'_av', overlay:eid+'_ol', buttons:eid+'_btt' };

		let faketextarea = ''; if(this.state.rows) faketextarea = 'min-height:3em; overflow:auto;';
		
			let wide100 = this.state.type == INPUT_ML_TEXT ? ' wide100' : '';
		let avatar = new C_iCLIK(this.eids.fs.avatar, { click:new A_cb(this, this.newtouch) }, { css:'avatar like-input'+wide100+(preset.css||''), tag:'div', style:'display:inline-block;'+faketextarea });
		
			let hasconfirm = this.state.type != INPUT_AC;
		let cartouche = new C_iDQS(this.eids.fs.buttons, { onquit:new A_cb(this, this.fcancel), onconfirm:new A_cb(this, this.confirmed) }, { remove:false, save:false, confrm:hasconfirm } );
		
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

			css = css ? css+' like-input' : 'like- ';
		return label+this.ccontrols.avatar.set(this.avatar(),css).display(); // display through the C_iCLIK object

	}
	activate() { 
	
		if(!is.newtouch) return super.activate();
		if(vbs) vlog('mobframe.js','C_iFIELD','activate','eid:'+this.eids.ui+', confirm:'+this.ccontrols.cartouche.state.confrm);
		this.ccontrols.avatar.activate();
		super.validate(this.state.digits); // We need to do this here because super is not yet displayed nor activated, this sets the right valid state in super
		this.ccontrols.avatar.setvalid(this.state.valid);
	}
	modalquit() { // closes the edit modal screen
		if(!is.newtouch) return;
		if(vbs) vlog('mobframe.js','C_iFIELD', 'modalquit','eid:'+this.eids.ui);
		
		super.blur();
		if(!this.state.rows) C_KEY.unbind(this.state.keys, this.ahandlers.keys);
		// document.activeElement.blur(); $("input").blur(); // not needed
		$(this.els.overlay).remove(); // keep this after the blur()
	}
	
	// private
	avatar() { 
		let display = this.state.digits||this.state.placeholder||''; 
		if(this.state.rows) display = display.split('\n').join('<br/>'); return display; 
	}
	newtouch() { // The avatar summary ui was just hit.
		 
		if(vbs) vlog('mobframe.js','C_iFIELD','newtouch','eid:'+this.eids.ui+', label:'+this.state.label+', placeh:'+this.state.placeholder);
		
				let buttons = '<td>'+this.ccontrols.cartouche.display()+'</td>';
					let h1 = this.state.placeholder?this.state.placeholder:(this.state.label?C_XL.w(this.state.label):'');
				let title = '<td style="align:right;"><h1>'+h1+'</h1></td>';
			let row = '<tr>'+buttons+title+'</tr>';
		let header = '<table summary="details" style="width:100%; padding:0 0 1em 0;">'+row+'</table>';
		let mbody = '<div>'+super.display('alpha100')+'</div>';
		
		
				let style = 'z-index:20; position:absolute; top:2.5em; bottom:0; width:100%; overflow:hidden;';
			let overlay = '<div class="touchdev-overlay" id="'+this.eids.fs.overlay+'" style="'+style+'">'+header+mbody+'</div>';
		$('#body').append(overlay);
			
		this.ccontrols.cartouche.activate(); 
			let mayconfirm = this.state.valid && this.state.type != INPUT_AC;
		this.ccontrols.cartouche.enable(mayconfirm, 'confrm'); // you may not validate your entry if you entered bad format or empty field while mandatory
		this.els.collect(this.eids.fs);
		
		super.activate().focus(true);
		
		if(!this.state.rows) new C_KEY(this.state.keys, this.ahandlers.keys);
	}
	trackvalid(digits, statereport) { this.ccontrols.cartouche.enable(statereport.valid, 'confrm'); }
	fcancel() { // the cancel icon has been hit, cancel any changes and revert to previous setting
		if(vbs) vlog('mobframe.js','C_iFIELD', 'fcancel','eid:'+this.eids.ui);
		if(this.state.type!=INPUT_AC) {
			let t = this.ccontrols.avatar.state.ui.split('<br/>').join('\n'); // <br/> replaces \n only in the avatar display
			super.set(t, { propagate:true }); // re-install the previous setting
		}
		if(this.callbacks.onfcancel) this.callbacks.onfcancel.cb();
		this.modalquit();
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



var gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 }; // see (*gc01*)

var genders = { english:(function(){ // builds object like { 0:'female', 1:'male', ... }
		let genders = {};
	for(let m in gendercode) genders[gendercode[m]] = m;
	return genders;
})() }

C_XL.d = new Array();


C_XL.ccss = function(oclass, csstype, options) { // options like { typeonly:bool, plural:bool, translate:bool }
		options = options||{};
	if(options.typeonly) {
		let label = '';
		switch(csstype) {
			case ccsstype.color: 	label = 'color'; break;
			case ccsstype.pattern: 	label = 'pattern'; break;
			case ccsstype.tag: 		label = 'tag'; break;
		}
		if(options.plural) label = label+'s';
		if(options.translate) return C_XL.w(label);
		return label;
	}
	let prefix = '';
	let postfix = '';
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
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//
// With this class you can:
//
// the C_iMODAL class is bind to the C_KEY, because when you register key event on a given screen layer, 
// 		you don't want it to trigger key events at a lower layer

// P O S I T I O N N I N G
// 
C_iXY = function(element) {
		let x = 0; // top left corner position of element, versus left window edge
		let y = 0; // top left corner position of element, versus top window edge
		let e = element;
	
	// element position
	if(e.offsetParent)
		do { 
			x += e.offsetLeft; y += e.offsetTop;	
			if(e.scrollTop) y-=e.scrollTop; // take into account possible scroll positions of any element up to the window element (*sc03*)
			// console.log(e.id, e.scrollTop, e.offsetTop); // this debug line shows you all the way up to the body and indicates offsets and scrolls found
		} while (e = e.offsetParent);
	
	
	// element dimensions
	let h = 0;
	if(element.offsetHeight) h=element.offsetHeight;
		else if(element.style.pixelHeight) h = e.style.pixelHeight;
	let w = 0;
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
	setSwap: function() {// check if this element fits in the screen area, if not, swap it
		if(is.newtouch) return; // tehre is never a swap on touch devices because the pad takes the complete screen to display
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
		let anchors = { 0:{0:this.uixy.corners.bottomLeft, 1:this.uixy.corners.topLeft}, 1: {0:this.uixy.corners.bottomRight, 1:this.uixy.corners.topRight} };
		this.anchor = anchors[this.swap.h][this.swap.v]; 
		this.setDisplayPosition(); // according to swap conditions and new anchor points around the ui
	},
	sideAnchor: function(padElement) { // in this mode, the Pad does not overlay the ui trigger element, it lays around it
		this.anchor = this.uixy.corners.topRight; // to what spot the pad is hooked up
		this.setDisplayPosition(); // position to default anchor
		this.setSwap(); // check if swap if needed
		if(!(this.swap.h+this.swap.v)) return;
		let anchors = { 0:{0:this.uixy.corners.topRight, 1:/*v swap*/this.uixy.corners.bottomRight}, 1:/*h swap*/ {0:this.uixy.corners.topLeft, 1:/*v swap*/this.uixy.corners.bottomLeft} };
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
		
		let sizemode = { x:(bodyElement.style.width!='')?'fixed':'free', y:(bodyElement.style.height!='')?'fixed':'free' };
		if(sizemode.y == 'fixed') bodyElement.style.overflowY = 'auto'; /* overflow will scroll */
		if(sizemode.x == 'fixed') bodyElement.style.overflowX = 'auto'; /* overflow will scroll */		

		let size = { x:this.padxy.elsize.w, y:this.padxy.elsize.h }; // measures the full modal size
		let padding = { x:C_iWIN.size.w-size.x, y:C_iWIN.size.h-size.y };
		this.display = { x:(padding.x>>1)+this.offset.x, y:(padding.y>>2)+this.offset.y };
	}
}


function bodyscroll() {
	let scroll = false;
	if(typeof window.pageYOffset != undefined) scroll = window.pageYOffset;
	else if(typeof document.documentElement.scrollTop != undefined) scroll = document.documentElement.scrollTop;
	else scroll = document.body.scrollTop;
	return scroll;
};

// M O D A L     O B J E C T 
// 
C_iMODAL = function(html, callbacks, preset) { 

	// preset.style can be ['modal','pad','dp']
	// preset.morecss like { outlet:'cssclassname' } will be reported to the outlet class setup
	//
	// Note: when the modal is created on a touch device, using iScroll, the C_iTABS control leaves 
	//   an empty display until activated (iScroll must be refreshed, see this.mrefresh()
	//
	this.ctrlname = 'C_iMODAL';
	let layer = C_iMODAL.layer;
	let mid = C_iMODAL.ever++; // builds a unique id for each modal (layer is not enough if we want to animate the fade off of modals)
	
	this.callbacks = callbacks; // { escape:, top:, left:, bottom:, right:, scrollstart: } all members are A_cb
	
		let eidp = '_'+layer+'_'+mid;
	this.eids = { overlay:'mOver'+eidp, outset:'mOutset'+eidp, inset:'mInset'+eidp, header:'mHeader'+eidp, body:'mBody'+eidp, busy:'mBusy'+eidp  }; 
	this.elements = new A_el();
	
	let events = { escape:new A_cb(this, this.escape), scroll:new A_cb(this, this.scroll)
				, tstart:new A_cb(this, this.tstart), tmove:new A_cb(this, this.tmove), tend:new A_cb(this, this.tend)
				, up:new A_cb(this, this.up), move:new A_cb(this, this.move), down:new A_cb(this, this.down) }
	this.handlers = new A_hn(events);
	this.status = C_iMODAL.defauts.align(preset);
	this.interactivity = { dragging:false, mouse:false  }
	if(is.tactile && this.status.style=='modal') this.status.fullscreen = true; 
	
	if(this.status.position.drop||this.status.position.side) { // the modal is positionned relatively to another element on page (case of e.g. a drop down list)
		// if(is.newtouch) { 
			// this.status.size = { maxy:(C_iWIN.size.h-20)+'px' };
			// this.status.position.drop = false;
			// this.status.position.side = false;
		// }
		
	} else { // the modal is in absolute positionning 
	
		if(this.status.position.offset.x == 0)
			this.status.position.offset.x += C_iMODAL.layer<<6; // avoid alignment of many modals opened
		if(this.status.position.offset.y == 0) {
				let yscroll = bodyscroll(); // put modal on visible body even when body is scrolled
			if(yscroll) this.status.position.offset.y += yscroll; 
			this.status.position.offset.y += C_iMODAL.layer<<6;
		} 
	}
	
	C_iMODAL.register[++C_iMODAL.layer] = this;
		// console.log(this.status.position);
		// console.log('Layer:'+C_iMODAL.layer);
	
	if(this.status.embedded) { // that is used by is.newtouch/small.js for embedding the modal in a slide screen (touch interactivity on small devices)
		this.busy = function() {return this;}
		this.close = function() {return this;}
		this.mrefresh = function() {return this;}
		this.mposition = function() {return this;}
	}
	else if(this.status.autopop) this.pop(html); // on web browsers on mouse computer screens, modals are autopop

	this.escapeCallback = new A_cb(this, this.escape);
	new C_KEY(C_KEY.code.s.escape, this.escapeCallback, 'C_iMODAL::layer '+C_iMODAL.layer); // keep this after layer increment
}
C_iMODAL.defauts = new A_df( { morecss:'',  style:'modal', location:{x:0, y:0}, moves:false, fullscreen:false, autopop:true, embedded:false
	, position:{ style:'', screen:true, offset:{x:0, y:0}}, size:{x:'', y:'', maxy:false, miny:false } /*free size by default*/
	, busy:false, scrolling:false, isclosed:false, fadeoff:300 /* fadeoff are ms, at modal close it is the time before removal of the <div outset> from dom. Css visual effects must finish before fadeoff delay. See (*md03*) */  
});
C_iMODAL.layer = 0;
C_iMODAL.ever = 0;
C_iMODAL.animationdelay = 100; // C_iMODAL.defauts.fadeoff; // see (*md03*) sets the delay for opening a new C_iMODAL, used together with setTimeout()
C_iMODAL.register = new Array(); // we organize it like C_iMODAL.register[C_iMODAL.layer] = C_iMODAL instance
C_iMODAL.prototype = {
	// public (display & activate are called at construction)
	pop: function(html) { // html is like { header:'some html for the header', body:'some html for the body'}
		this.display(html).activate().show();
		C_iTIP.handlers.quit();
	},
	close: function(options) {
		this.toremove(options);
		C_iWIN.cursor();
	},
	busy: function(onoff) {
		if(onoff && !this.status.busy) {
			let zindex = 1000+C_iMODAL.layer;
			
				let spinner = '<div class="spinner">'+'</div>';
				let busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:center;';
			let overlay = '<div class="modal-busy" id="'+this.eids.busy+'" style="'+busystyle+'">'+spinner+'</div>';
			
			$(this.elements.inset).append(overlay);
			C_iWIN.cursor('wait');
			setTimeout(function(eid){ $(document.getElementById(eid)).addClass('on'); }, 10, this.eids.busy); // combines with modal-busy to trigger the going on screen animation
		} else {
			let element = document.getElementById(this.eids.busy);
			if(element) $(element).remove();
			C_iWIN.cursor();
		}
		return this;
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
		let position = new C_iPOSITION(this.elements.inset, this.status.position, this.elements.body); // adjust size and position
		this.position(position.display.x, position.display.y);
		return this;
	},
	mrefresh: function() { // lets the modified DOM be displayed correctly in iScroll
		if(is.tactile) if(this.scrolly) this.scrolly.refresh();
		return this;
	},
	isclosed: function() {
		return this.status.isclosed;
	},
	setmborder: function(ccode) {
		let inset = this.elements.inset;
		$(inset).removeClass('border-on'); // see (*mb01*)
		setTimeout(function(inset,ccode){ 
			$(inset).removeClass( function(index, className) { return (className.match (/bc[0-9][0-9][0-9]?[0-9]?/g) || []).join(' '); } ); // removes anything like bc153, those are defined here (*md04*)
			if(ccode) {
				$(inset).addClass('border-on');
				$(inset).addClass('bc'+ccode);
			}
		}, 300 , inset, ccode); // the timing here should match the rythm of the css transition here (*mb02*)
	},
	setmpattern: function(pcode) {
		let inset = this.elements.inset;
		$(inset).removeClass('pattern-on'); // see (*mb01*)
		setTimeout(function(inset,pcode){ 
			$(inset).removeClass( function(index, className) { return (className.match (/p[0-9]{3,4}/g) || []).join(' '); } ); // removes anything like p800, those are defined here (*md04*)
			$(inset).addClass('pattern-on'); // we leave this class on intenitonaly, to allow the bacdrop-filter effect and the animation even when none pattern is selected
			if(pcode) {	
				$(inset).addClass('p'+pcode);
			}
		}, 300, inset, pcode); // the timing here should match the rythm of the css transition here (*mb02*)
	},
	
	// private
	display: function(html) { // html is like { header:'some html for the header', body:'some html for the body'}
		let zindex = 100+C_iMODAL.layer;
		let style = this.status.style; // that is e.g 'modal' or 'message'
		
		let p = this.status.fullscreen?'fs-':'zi-'; // fs for full screen, zi for z-indexed
		let c = { header: style+'-header', body: style+'-body', overlay: style+'-overlay'	// makes modal-body, or pad-body, modal-overlay
			, shape: p+style+'-shape', inset: p+style+'-inset', outset: p+style+'-outset' } // makes zi-modal-inset, or modal-inset depending of modal style and fullscreen mode, see here (*md20*)
		
		let header = html.header==undefined ? '' : '<div class="'+c.header+'" id="'+this.eids.header+'">'+html.header+'</div>';
			
			let inner = '<div></div>'; if(html.body) inner = html.body; // when inner is empty, the body div does not repond to the height:100% css rule
			let maxheightpad = is.newtouch?' height:100%; max-height:100%;':'';
		let body = '<div class="'+c.body+'" id="'+this.eids.body+'" style="position:relative;'+maxheightpad+'">'+inner+'</div>'; // relative necessary for iscroll and for process (*sc03*).
			body = '<div class="body-wrapper">'+body+'<div>';
		let inset = '<div class="'+c.inset+' '+c.shape+'" id="'+this.eids.inset+'" style="position:relative;'+maxheightpad+'">'+header+body+'</div>';
		
		let outset; 
		if(this.status.fullscreen) // then modals are full screen
			outset = '<div class="'+c.outset+'" id="'+this.eids.outset+'" style="min-width:100%; min-height:'+C_iWIN.size.h+'px; position:absolute; z-index:'+zindex+'">'+inset+'</div>';
		else { 
				// pad: applies to dropdown menus
				let bottom0px = is.newtouch?'bottom:0px;':'';
				let moreclass = this.status.morecss?(this.status.morecss.outlet?this.status.morecss.outlet:''):'';
			outset = '<div class="'+c.outset+' '+c.shape+' onscreen '+moreclass+'" id="'+this.eids.outset+'" style="position:absolute; z-index:'+zindex+'; overflow:hidden;'+bottom0px+'">'+inset+'</div>';
		}
		
		let overlay = '';
		if(!is.newtouch) {
			let overstyle = 'display:none; position:absolute; z-index:'+zindex+'; top:0; bottom:0; left:0; width:100%; min-height:'+C_iWIN.size.h+'px;';	
			overlay = '<div class="'+c.overlay+'" id="'+this.eids.overlay+'" style="'+overstyle+'"></div>';
		}
		$("body").append(overlay+outset); // note that outset is NOT INSIDE overlay, this avoids inheritance of overlay events (click)
		return this;
	},
	activate : function() {
		this.elements.collect(this.eids);

		if(!is.tactile) this.elements.body.onscroll = this.handlers.scroll;
		
		if(is.tactile && !this.status.fullscreen) { // TACTILE PADS that are NOT FULLSCREEN
			if(!this.elements.header) // modals with a header must be closed using buttons (BUG b001)
				if(this.elements.overlay) this.elements.overlay.ontouchstart = this.handlers.escape;
			if(this.elements.header && this.status.moves) {
				this.elements.header.ontouchstart = this.handlers.tstart;
				this.elements.header.ontouchmove = this.handlers.tmove;
				this.elements.header.ontouchend = this.handlers.tend;
			}
		} else { // NOT TACTILE: always escapable using an overlay click
			$(this.elements.overlay).click(this.handlers.escape);	
			if(this.elements.header && this.status.moves) $(this.elements.header).mousedown(this.handlers.down);
		}
		
		if(this.status.style == 'message') {
			let inset = this.elements.inset;
			$(inset).removeClass('border-on'); // see (*mb01*)
			setTimeout(function(inset){ $(inset).addClass('border-on'); }, 100 , inset);
		}
		// $(this.elements.overlay).click(function() { console.log('HIT OVERLAY')});
		return this;
	},
	show: function() {
		
		if(this.status.fullscreen) { 
			$(this.elements.overlay).show();
			$(this.elements.outset).css({left:0, top:0});
			window.scrollTo(0,0); // for longer list page, you scroll to the bottom and if you open a modal, the device does not scroll top to show the modal automatically
		} else	{
			// pad elements and in screen modals
			$(this.elements.overlay).show();
			$(this.elements.header).width(this.status.size.x); // on web-kit, the width of the first div determines the outset width
			$(this.elements.body).width(this.status.size.x).height(this.status.size.y);
				let maxy = this.status.size.maxy; // is a string like '18em', cannot be devided
				let miny = this.status.size.miny; // is a string like '18em', cannot be devided
			if(is.newtouch) {
				maxy=false; 
				// $(this.elements.body).css('bottom', 0 );
			}
			else {
				if(this.status.size.maxy) { $(this.elements.body).css('max-height', maxy ); }
				if(this.status.size.miny) { $(this.elements.body).css('min-height', miny ); }
			}
			
			let position = new C_iPOSITION(this.elements.inset, this.status.position, this.elements.body); // adjust size and position
			this.position(position.display.x, position.display.y);
		}
		
		if(is.tactile) { 
				let handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone) }) ;
				let options = { hScroll:false, bounce:true, momentum:true, scrollbars:true };
			this.scrolly = new IScroll(this.elements.body, options); // C_iMODAL
			this.scrolly.on('scrollStart', handlers.iScrolling);
			this.scrolly.on('scrollEnd', handlers.iScrolldone);
		}
		return this;
	},
	position: function(x,y) { // positionning the outset on the screen
		if(this.status.fullscreen) return;
		$(this.elements.outset).css({left:x, top:y});
		this.status.location.x = x;
		this.status.location.y = y;
		return this;
	},
	vector: function(vector) {
		x = this.status.location.x + vector.x;
		y = this.status.location.y + vector.y;
		return this.position(x, y); 
	},
	remove: function() {
		$(this.elements.outset).remove();
		$(this.elements.overlay).remove();
		return this;
	},
	toremove: function(options) {
		options = options || { slow:false, now:0 }; // like {slow:5000, now:[0,1]}  // used by M_WRKC and M_LOGIN to slowly vanish on a copy action
		C_KEY.unbind(C_KEY.code.s.escape, this.escapeCallback);
		C_KEY.cleanUpLayer(); 
		C_iMODAL.layer--; // console.log('LAYER DECREMENT '+C_iMODAL.layer);
		this.status.isclosed = true;
		if(is.tactile) {
			if(this.scrolly)	this.scrolly.destroy();
		}
		let cssslow = '';
		let delay = this.status.fadeoff;
		if(options.slow) { cssslow = ' fadeslow'; delay = options.slow; }
		$(this.elements.overlay).unbind('click', C_iMODAL.click).addClass('offscreen'+cssslow); // this item stays temporarily idle until removed by this.remove()
		$(this.elements.outset).removeClass('onscreen').addClass('offscreen'+cssslow);
		
		if(now) return this.remove();
		if(this.status.fadeoff) // soft removal using animation defined in controls.css
			setTimeout( function(that) { that.remove(); }, delay, this ); // should have same duration as here (*md02*)
		else this.remove(); // immediate remove from screen
		return this;
	},
	darkenoverlay: function(yesno) {
		$(this.elements.overlay).removeClass('overlay-privacy');
		if(yesno) $(this.elements.overlay).addClass('overlay-privacy');
	},
	blur: function(doit) {
		// let cssslow = ' fadeslow';
		if(doit)
			$(this.elements.outset).removeClass('onscreen').addClass('offscreen');
		else 
			$(this.elements.outset).addClass('onscreen').removeClass('offscreen');
		return this;
	},
	
	// handlers
	escape: function() {
		C_iTIP.handlers.quit(); 
		let remove = true;
		if(this.callbacks.escape) remove = this.callbacks.escape.cb();
		if(remove) this.toremove();
		return false; /* do not propagate to underlying layers */
	},
	scroll: function(e) {
		let scrollPosition = this.elements.body.scrollTop;
		let scrollMax = this.elements.body.scrollHeight-this.elements.body.clientHeight;
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
		e.preventDefault(); let touch = e.touches[0]; 
		return this.down(touch);	
	},
	tmove: function(e) { 
		if(this.status.scrolling) return true;
		if(e.touches.length>1) return true; // scroll screen down with 2 fingers
		e.preventDefault(); let touch = e.touches[0];
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
			let vector = { x:e.pageX-this.interactivity.mouse.x, y:e.pageY-this.interactivity.mouse.y };
			this.vector(vector);
		}
		this.interactivity.mouse = {x:e.pageX, y:e.pageY};
		return false;
	},
}
C_iMODAL.closeall = function() { 
	for(let l = C_iMODAL.layer; l;l--) 
		C_iMODAL.register[l].close(); 
}


C_tMODAL = function(html, callbacks, preset) {
	this.html = html;	
	this.elements = new A_el();
	this.callbacks = callbacks;
	this.state = C_tMODAL.defaults.align(preset=preset||{});
	
	C_iMODAL.register[++C_iMODAL.layer] = this;
	let b = C_iMODAL.layer;
	this.eids = { header:b+'_head', wrapper:b+'_wrp', slide:b+'_slde', vwport:b+'_vwpt', bouncytop:b+'_bncyt', bouncybottom:b+'_bncyb' };
	
	this.controls = new A_ct({});
	this.iscroll = false;
}
C_tMODAL.defaults = new A_df( { position:{ top:'4em' } 
			/*own status */ , scrolling:false, menus:{ top:{menufading:false, menuon:false, timer:false }, bottom:{menufading:false, menuon:false, timer:false } } 
} );
C_tMODAL.prototype = {
	
	// public
	display: function() {
		let header = '<div id="'+this.eids.header+'">'+this.html.header+'</div>';
			
			let padder = '<div style="height:10em; border-bottom:5px solid silver;">&nbsp;</div>'
		let slide = '<div id="'+this.eids.slide+'" class="iSlide">'+this.html.body+padder+'</div>';
		let wrapper = '<div id="'+this.eids.wrapper+'" style="position:relative; height:100%; max-height:100%; width:100%;">'+slide+'</div>';
		let vwport = '<div id="'+this.eids.vwport+'" style="position:absolute; top:'+this.state.position.top+'; bottom:0; min-width:100%; max-width:100%; overflow:hidden;">'+wrapper+'</div>';

		let btop = '<div id="'+this.eids.bouncytop+'" class="minder-background" style="z-index:10; position:absolute; top:'+this.state.position.top+'; min-width:100%; max-width:100%; overflow:hidden; display:none;">'+'TOP'+'</div>';
		let bbot = '<div id="'+this.eids.bouncybottom+'" class="minder-background" style="z-index:10; position:absolute; bottom:0; min-width:100%; max-width:100%; overflow:hidden; display:none;">'+'BOTTOM'+'</div>';
		
		return header+vwport+btop+bbot;
	},	
	activate: function() {
		this.elements.collect(this.eids);
		let handlers = new A_hn({ scrolstart:new A_cb(this, this.scrolstart), scrolldone:new A_cb(this, this.scrolldone), bounce:new A_cb(this, this.bounce) });
		let options = { 
			bounce:true, momentum:true, snap:false, snapSpeed:900, 
			scrollbars:true, fadeScrollbars:true, eventPassthrough:false, 
		};
		this.scrolly = new IScroll(this.elements.wrapper, options);
		this.scrolly.on('bounceStart', handlers.bounce);
		this.scrolly.on('scrollStart', handlers.scrolstart);
		this.scrolly.on('scrollEnd', handlers.scrolldone);
			
		if(vbs) vlog('mobframe.js','C_tMODAL','activate','eid:'+this.eids.wrapper);
		return this;
	},
	remove: function() {
		C_KEY.cleanUpLayer(); C_iMODAL.layer--; // see (*md01*)
		if(this.scrolly) this.scrolly.destroy();
	},
	setmborder: function(ccode) {
		
		
	},
	
	// class interface compliance purpose
	busy: function() { return this; },
	close: function() { return this; },
	mrefresh: function() { return this; },
	mposition: function() { this.activate(); return this; },
	
	
	// handlers
	escape: function() {
		C_iTIP.handlers.quit(); 
		let remove = true;
		if(this.callbacks.escape) remove = this.callbacks.escape.cb();
		if(remove) this.remove();
		return false; /* do not propagate to underlying layers */
	},
	scrolstart: function() { // iScroll events - tactile only - 
		if(!this.state.scrolling) { // calls only once above
			if(this.callbacks.scrollstart) this.callbacks.scrollstart.cb();
			this.state.scrolling = true;
		}
		return false;
	}, 
	scrolldone: function() { // iScroll events - tactile only -
		this.state.scrolling = false;
		return true;
	}, 
	bounce: function(to, on) {
		if(vbs) vlog('mobframe.js','C_tMODAL','bounce','to:'+to);
		let nocancel = true;
		switch(to) {
			case 'top':  if(this.callbacks.bouncetop) nocancel = this.callbacks.bouncetop.cb(); break;
			case 'bottom': if(this.callbacks.bouncebottom) nocancel = this.callbacks.bouncebottom.cb(); break;
		}
		let cancel = false; if(nocancel===false) cancel = true; // callback should be defined and should return false to cancel menu pop up
		if(cancel) this.menu(to, true,{delay:2000});

		
	},	
	
	// Private
	menu: function(which, onoff, options) {
		
		let el, state; switch(which) {
			case 'top':  el = this.elements.bouncytop; state = this.state.menus.top; break;
			case 'bottom': el = this.elements.bouncybottom; state = this.state.menus.bottom; break;
		}
		if(state.menufading) return; // no state change during busy fading away
		
		if(onoff===undefined) onoff = !this.state.menuon; // toggles by default
		if(state.timer) { clearTimeout(state.timer); state.timer = false };
		if(onoff) {
			$(el).show(); 
			state.menuon=true;
			options = options || {delay:5000}; // unless otherwise specified, the menu disappears after a while
		} 
		else { 
			if(!options) this.faderdelayover();
		}
		
		let delay = false; if(options) if(options.delay) delay = options.delay;
		if(vbs) vlog('mobminder.js','C_tMODAL','menu','which:'+which+', on:'+onoff+', delay:'+delay);
		
		// organize fade away of menu
			let h = new A_hn({ over:new A_cb(this, this.faderdelayover, {el:el, state:state})});
		if(delay) state.timer = setTimeout(h.over,options.delay);
			
		return state.menuon;
	},
	faderdelayover: function(which) {
		if(vbs) vlog('mobframe.js','C_tMODAL','faderdelayover','');
		this.faderdelay = false;
		let h = new A_hn({ fading:new A_cb(this, this.fading, which.state),faded:new A_cb(this, this.faded, which.state)});
		h.fading(); $(which.el).fadeOut({duration:600,easing:'linear',complete:h.faded});
	},
	fading: function(state) { state.menufading = true; state.menuon=false; },
	faded: function(state) { state.menufading = false; }
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   H A N D L I N G     K E Y B O A R D
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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
	let layer = C_iMODAL.layer;
	if(typeof(keys) != 'object') keys = [keys];
	if(!C_KEY.register[layer]) C_KEY.register[layer] = new Array(); // we ill register assigned keys by modal layer, so when we quit a modal we can clean-up all assigned keys in one shot, // see (*md01*)
	
	let r = C_KEY.register[layer];
	for(let x in keys) {
		
		let key = keys[x];
		
		if(verboseOn) { // get a verbose detailed insight on what keys are associated to what event, activate verboseOn in mobframe.js and choose classOnlyVerbose = monitorFramework;
				let k = key, l = layer;
				let ctrlkey = '', keyname = '';
				let iaf = arrayINVERT(C_KEY.code.alpha);
				let inm = arrayINVERT(C_KEY.code.num);
				let isp = arrayINVERT(C_KEY.code.s);
				let ifn = arrayINVERT(C_KEY.code.F);
				let ikn = arrayINVERT(C_KEY.code.kpad.n);
				let iks = arrayINVERT(C_KEY.code.kpad.s); // console.log(bitmap(k)+' check on 2048 '+bitmap(k&2048)+' -> '+((k&2048)==2048) );
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
	document.onkeyup = function(e) { let checkCode = C_KEY.specials.check(e||window.event);	} // MSIE compatibility
}
C_KEY.prototype = {
	callback: function(keycode) {
		if(typeof(this.onhit) == 'function') return this.onhit(keycode); // genuine function
		if(typeof(this.onhit) == 'object') return this.onhit.cb(keycode); // A_cb
	}
}
C_KEY.unbind = function(keys, onhit) { // onhit is a callback function
	if(typeof(keys) != 'object') keys = [keys]; // turn single into a general case: we expect an array in general
	let r = C_KEY.register[C_iMODAL.layer]; if(!r) return false; // in the current layer, there is no callback defined
	for(let x in keys) {
		let k = keys[x]; // the key for which we remove the callback
		if(!r[k]) continue; // there is no handler associated with the keyboard key, may be already removed
		else
			for(let handler in r[k])
				if(r[k][handler].onhit == onhit) { // remove the right handler
					if(vbs) vlog('mobframe.js','C_KEY','unbind','removing key '+k+' on layer '+C_iMODAL.layer);
					r[k].splice(handler,1);
				}
	}
	return false;
}
C_KEY.cleanUpLayer = function() { // removes all associated callbacks from the layer // see (*md01*)
	if(vbs) vlog('mobframe.js','C_KEY','cleanUpLayer','cleaning up layer '+C_iMODAL.layer);
	let r = C_KEY.register[C_iMODAL.layer]; if(!r) return false; // in the current layer, there is no callback defined
	delete C_KEY.register[C_iMODAL.layer];
};
C_KEY.count = 0;
C_KEY.register = new Array(); // we organize it like C_KEY.register[C_iMODAL.layer][key] = C_KEY instance
C_KEY.onkeydown = function(e) {	
	let keycode = (e.keyCode) ? e.keyCode : e.which; // MSIE compatibility
	if(keycode == 16 || keycode == 17 || keycode == 18) return false;
	let checkCode = C_KEY.specials.check(e); // note that a single Ctrl key down this not trigger C_KEY.onkeydown, that happens only if together another keyboard key si pressed
	let lastPropagation = true;
	let r = C_KEY.register[C_iMODAL.layer]; if(!r) return lastPropagation; // in the current layer, there is no callback defined
	
		if(vbs) vlog('mobframe.js','C_KEY','onkeydown','checking '+keycode+' on layer '+C_iMODAL.layer+' Specials:'+checkCode);
	if(r[checkCode]) { // some handlers are present
		for(handler in r[checkCode]) // consider many handlers for one key, starts with last added
			if(lastPropagation = r[checkCode][handler].callback(checkCode)) continue; // operate propagation !! that is where the return value of the callback function is used
			else break; // stop propagation
			if(vbs) vlog('mobframe.js','C_KEY','onkeydown','handler was called, propagation is '+lastPropagation+'(keycode '+keycode+' on layer '+C_iMODAL.layer+', specials:'+checkCode);
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
, stateSum: function() { let s=0; for(let k in this.state) s+=this.state[k]; return s; }
, check: function(e) { this.set(e); e = e || window.event; let keycode = (e.keyCode) ? e.keyCode : e.which; /* MSIE compatibility */ return this.stateSum()+keycode; }
, set:function(e) { for(let k in this.state) if(e[k]) this.state[k] = this.weight[k]; else this.state[k] = 0; } }
C_KEY.chars = { upperscore:'¯', underscore:'_' };


var ascii7 = {
	tip: '@ - £ - $ - ¥ - è - é - ù - ì - ò - Ç - Ø - ø - Å - å <br/> Δ - _ - Φ - Γ - Λ - Ω - Π - Ψ - Σ - Θ - Ξ <br/> ^ - { - } - \\ - [ - ~ - ] - | <br/> € - Æ - æ - ß - É - ! - " - # - ¤ - % - & - \' <br/> ( - ) - * - + - , - - - . - / - : - ; - < - = - > <br/> ? - ¡ - Ä - Ö - Ñ - Ü - § - ¿ - ä - ö - ñ - ü - à'
};



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
})(window, document);



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   DISPLAY ITEMS IN AN ORGANIZED TABLE
//
// © Copyright 2007-2024 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
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
		let table = '<table id="'+this.eids.wtbl+'" class="C_iTABLE '+(css||'')+'">'+this.rows()+'</table>';
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
			
			let i = this.items.cnt(); if(!i) return '<tr><td></td></tr>';
			
		// size the table
			let mxr = this.state.maxrows, mxc = this.state.maxcols; 
			let c = 1+((i/mxr)|0); // final size column count, at least 1 column
			let r = i>mxr ? mxr : i; // final size rows count
		if(c>mxc) c = mxc; // max cols reached, extend the number of rows
		r = 1+((i/c)|0);
			let e = r*c-i; // empty cells remaining in table when all items are placed
			let f = c-e; // number of columns that are fully filled, other columns miss each one item
		
		if(vbs) vlog('controls.js', 'C_iTABLE','rows','eid:'+this.eids.eid+', i:'+i+', c:'+c+', r:'+r+', e:'+e);
		
		let tr, td, x, l;
		let tds = new C_regS('grid');
		for(td = 0, x = 0, l = r; td<c; td++, l = (td<f)?r:r-1 ) // we keep empty cells in the bottom row
			for(tr = 0; tr<l; tr++, x++)
				if(x<i) tds.grid.add(tr, td, '<td class="itable">'+this.items[x].display()+'</td>');
		
		let rows = new Array(), rhtml; 
		for(tr = 0, rhtml = ''; tr<r; tr++, rows.push(rhtml) ) // draw the table row by row
			for(td = 0, rhtml = ''; td<c; td++)
				rhtml += tds.grid.get(tr,td) || '<td></td>';
			
		return '<tr class="itable">'+rows.join('</tr><tr>')+'</tr>';
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
C_iPLAY.defaults = new A_df({ path:'', volume:0.8 });
C_iPLAY.prototype = {
	// public
	play: function() {
		if(!this.audio) return;
		this.audio.pause();
		this.audio.currentTime = 0;
			let globalvolume = 9;
		if(mobminder.context) {
			globalvolume =  mobminder.context.surfer.soundsVolume;
			if(globalvolume==0) return; // in this case we simply do not engage the play. Why? It would play the sound with a zero volume and if you are listening Spotify on the same browser, it will stop playing the music.
		}
		// console.log('globalvolume:'+globalvolume);
		
		this.audio.volume=this.state.volume*(globalvolume/10);
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
};


mobminder.sounds = { // https://notificationsounds.com/
	walle: 		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'wall-e.wav'				), // see (*snds01*)
	success: 	new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'intuition-561.mp3'		),
	failure: 	new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'just-maybe-577.mp3'		),
	nogo: 		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'beyond-doubt-580.mp3'	),
	openup: 	new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'open-up-587.mp3'		),
	popup: 		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'all-eyes-on-me-465.mp3'	),
	attention: 	new C_iPLAY({path:'./assets/sounds/', volume:0.4}, 'light-562.mp3'			),
	magic: 		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'what-if-583.mp3'		),
	done: 		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'come-here.mp3'			),
	uploaded:	new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'deduction-588.mp3'		),
	please:		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'just-maybe-577.mp3'		),
	flying:		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'oringz-w447-425.mp3'	),
	insist:		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'this-is-it-161.mp3'		),
	note:		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'relentless-572.mp3'		),
	whatif:		new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'just-like-that-404.mp3'	),
	unexpected: new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'unexpectedly.mp3'		),
	anxious: 	new C_iPLAY({path:'./assets/sounds/', volume:0.5}, 'anxious-586.mp3'		),
	logoff: 	new C_iPLAY({path:'./assets/sounds/', volume:1.0}, 'time-is-now-585.mp3'	),
	droplet: 	new C_iPLAY({path:'./assets/sounds/', volume:0.4}, 'water-droplet-1.wav'	)
};

