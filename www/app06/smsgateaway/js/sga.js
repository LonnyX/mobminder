
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
// © Copyright 2007-2022 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium


// Must be used in combination with contactform.php
//




function C_iSGAform(eid, preset) {
	
	this.eids = { wrapper:eid, h:eid+'_h', ovl:eid+'_ovl'
		, msg:eid+'_msg', queue:eid+'_queue', corr:eid+'_corr', mobile:eid+'_mobl', group:eid+'_gr', ltime:eid+'_lt', prio:eid+'_pr'
		, caid:eid+'_caid', cach:eid+'_cach', lgn:eid+'_lgn', pss:eid+'_pss', 
		done:eid+'_done', busy:eid+'_bsy' };
	this.elements = new A_el();

	this.state = C_iSGAform.defauts.align(preset = preset || {});
	
	var msg = new C_iEDIT(this.eids.msg, { onfchange:new A_cb(this,this.typing) }, { digits:'', type:INPUT_TEXTAREA, placeholder:'message', rows:5, focus:this.state.focus, dblclick:false, mandatory:true }); 
	
			let invite, options;
		if(this.state.queueto=='queue') {
			options = C_dS_queue.options();
			invite = 'choose a queue';
		} else {
			options = C_dS_satellite.options();
			invite = 'choose a satellite';
		}
	var queue = new C_iDDWN(this.eids.queue, {  }, options, { invite:invite, enabled:true, mandatory:true }); 
	
	var mobile = new C_iEDIT(this.eids.mobile, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:'destination number', type:INPUT_MOBILE, enabled:true, mandatory:true }); 
	var correlator = new C_iEDIT(this.eids.comp, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:'correlator', type:INPUT_ALPHANUMSTRICT, enabled:true, mandatory:false }); 
	var group = new C_iEDIT(this.eids.group, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:'group', type:INPUT_ALPHANUMSTRICT, enabled:true, mandatory:false }); 
	
	
	// var ltime = new C_iEDIT(this.eids.ltime, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:'lifetime', type:INPUT_ALPHANUMSTRICT, enabled:true, mandatory:false }); 
	var ltime = new C_iDDWN(this.eids.ltime, {},  { labels:{ 0:'lifetime: infinite', 1:'lifetime: 1 min', 10:'lifetime: 10 min', 58:'lifetime: 58 min'}}, { value:0 } );
	
	var priority	= new C_iDDWN(this.eids.prio, {},  { labels:{ 0:'priority normal (0)', 1:'priority high (1)'}}, { value:0 } );
	
	var lgn = new C_iEDIT(this.eids.lgn, false, { digits:this.state.lgn, type:INPUT_TEXT, enabled:false, hidden:true }); 
	var pss = new C_iEDIT(this.eids.pss, false, { digits:this.state.pss, type:INPUT_TEXT, enabled:false, hidden:true }); 
	
	var done = new C_iCLIK(this.eids.done, { click:new A_cb(this, this.save) } , { tag:'div', ui:'Push', enabled:false } );
	
	this.controls = new A_ct({ mobile:mobile, msg:msg, queue:queue, correlator:correlator, group:group, ltime:ltime, priority:priority, done:done, lgn:lgn, pss:pss });
}
C_iSGAform.defauts = new A_df( { rows:4, busy:false, lgn:'', pss:'', queueto:'satellite' } ); // queueto:['queue','satellite',(a satellite id)] offers to choose from an existing queue or force sending to a given satellite
C_iSGAform.prototype = {
	display: function(e) {
		
			var mobile = '<div>'+this.controls.mobile.display('wide')+'</div>'; 
			var msg = '<div>'+this.controls.msg.display('wide')+'</div>'; 
			var queue = '<div>'+this.controls.queue.display('wide')+'</div>'; 
			var correlator = '<div>'+this.controls.correlator.display('wide')+'</div>'; 
			var group = '<div>'+this.controls.group.display('wide')+'</div>'; 
			var ltime = '<div>'+this.controls.ltime.display('wide')+'</div>'; 
			var prio = '<div>'+this.controls.priority.display('wide')+'</div>'; 
			var done = '<div style="text-align:right; margin-bottom:1em;">'+this.controls.done.display('submit')+'</div>'; 
		var form = mobile+msg+queue+correlator+group+ltime+prio+done;
		
			var lgn = this.controls.lgn.display('small');
			var pss = this.controls.pss.display('small');
		var footer = '<div>'+lgn+pss+'</div>';
		
		var busy = '<div id="'+this.eids.busy+'" class="busy" style="display:none; position:absolute; top:0; left:0; bottom:0; right:0; z-index:2;">'+'</div>';
		var inner = '<div class="contact-form" style="position:relative;">'+busy+form+footer+'</div>';
		
		$('body').find('#'+this.eids.wrapper).html(inner);
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(this.state.ixl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	
	// event handling
	typing: function(newdigits, statereport) {
		// statereport like { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
		// console.log(newdigits, statereport);
		isformvalid = this.controls.validation();
		this.controls.done.enable(isformvalid);
		// console.log('overall valid:'+isformvalid);
		
	},
	save: function() {
		this.state.busy = true; $(this.elements.busy).show();
		if(!this.controls.validation()) return;
		var names = { lgn:'l' ,pss:'p', mobile:'to', msg:'bla', correlator:'co', group:'gr', queue:'qid', ltime:'lt', priority:'pr' };
		var post = new A_ps(this.controls, names, this.state.relpath+'/user/push.php', {onreply:new A_cb(this,this.sent), ontimeout:new A_cb(this,this.failed)}, {/*options*/});
	},
	sent: function() { 
		this.state.busy = false; $(this.elements.busy).hide();
	},
	failed: function() { console.log('FAILED') },
	insert: function(i) { return this.field.insert(i); },
	focus: function(set) { return this.field.focus(set); },
	getpost: function() { return this.controls.getpost(); }
}




function C_iSGA(eid, preset) {
	
	this.eids = { wrapper:eid };
	this.elements = new A_el();

	this.state = C_iSGA.defauts.align(preset = preset || {});
	
	var lgn = new C_iEDIT(this.eids.lgn, false, { digits:this.state.lgn, type:INPUT_TEXT, enabled:false, hidden:true }); 
	var pss = new C_iEDIT(this.eids.pss, false, { digits:this.state.pss, type:INPUT_TEXT, enabled:false, hidden:true }); 
	
	var done = new C_iCLIK(this.eids.done, { click:new A_cb(this, this.save) } , { tag:'div', ui:'Add to queue', enabled:false } );
	
}
C_iSGA.defauts = new A_df( { lgn:'', pss:'', relpath:'./' } );
C_iSGA.prototype = {
	
	init: function() {
		var ctrls = { data:new C_iPASS({l:this.state.lgn, p:this.state.pss})};
		var names = { data:{l:'l', p:'p'} };
		var post = new A_ps(ctrls, names, this.state.relpath+'user/config.php', {onreply:new A_cb(this,this.activate), ontimeout:new A_cb(this,this.failed)}, {/*options*/});
	},
	activate: function(stream) { 
		
			var dscode = stream.extract('<data>','</data>').match; 
			var command = stream.extract('<command>','</command>').match;  
		
		var datasets = false;
		if(dscode) datasets = C_inlineStreaming.createDataSets(dscode);
		
		var form = new C_iSGAform(this.eids.wrapper, this.state); 
		this.controls = new A_ct({ form:form });
		this.controls.form.display(); 
		this.controls.activate();
	},
	failed: function() { console.log('FAILED') }
}





