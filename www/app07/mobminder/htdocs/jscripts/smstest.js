
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






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S    S E N D E R    I N T E R F A C E   
//
C_iSMS = function(eid, preset, callbacks) { // callbacks like { checkin:A_cb } 
	this.state = C_iSMS.defaults.align(preset=preset||{});
	this.callbacks = callbacks||{};
	this.eids = { tom:eid+'_login', msg:eid+'_pass', send:eid+'_send', smsid:eid+'_smsid', smsack:eid+'_smsack'
				, w:{ tom:eid+'_wrp_tom', msg:eid+'_wrp_msg', send:eid+'_wrp_send', smsid:'_wrp_smsid', smsack:'_wrp_smsack'  }	};
	this.elements = new A_el();
	
		var mmchanged = new A_cb(this, this.mmchanged, null, null, 2000);
		var mmcleared = new A_cb(this, this.mmcleared);
	var mobile = new C_iFIELD(this.eids.mobile, { onfchange:mmchanged, onfclear:mmcleared}, { focus:false, digits:'', type:INPUT_MOBILE, placeholder:'+32123456789' }); 
	var msg = new C_iFIELD(this.eids.msg, { onfchange:mmchanged, onfclear:mmcleared}, { focus:false, digits:'', type:INPUT_SMSAREA, rows:4, max:160, placeholder:'your message here' }); 
	var send = new C_iBUTTON(this.eids.send, new A_cb(this, this.send), {caption:'send message', width:10, hidden:false } );
	
	var smsid = new C_iFIELD(this.eids.smsid, {}, { focus:false, digits:this.state.smsid, type:INPUT_ALPHA, enabled:true }); 
	var smsack = new C_iFIELD(this.eids.smsack, {}, { focus:false, digits:this.state.smsack, type:INPUT_ALPHA, enabled:true }); 

	this.controls = new A_ct( { mobile:mobile, msg:msg, send:send, smsid:smsid, smsack:smsack } );
	this.watchdog = new C_iWatchdog({post:false, url:'./queries/smsstatus.php', rythm:8, wait:0, suspend:true}, {predog:new A_cb(this, this.predog), dogstream:new A_cb(this, this.smsstatus)});
}
C_iSMS.defaults = new A_df( { key:0, enabled:false, smsid:0, smsack:C_dS_sms.status.sms_nosms  });
C_iSMS.prototype = {
	// public
	display: function() { 
		// do not call this function from inside the callback call, use instead the return value of the callbacks.dogstream() to turn of further watchdog
		if(vbs) vlog('smstest.js','C_iSMS','display','');
		
			var mobile 	= '<tr id="'+this.eids.w.tom+'">'+this.controls.mobile.labelled('mobile', 'alpha10')+'</tr>';
			var msg 	= '<tr id="'+this.eids.w.msg+'">'+this.controls.msg.labelled('message','alpha20')+'</tr>';
			var send 	= '<tr id="'+this.eids.w.send+'"><td></td><td>'+this.controls.send.display()+'</td></tr>';
			var smsid 	= '<tr id="'+this.eids.w.smsid+'">'+this.controls.smsid.labelled('registration', 'alpha10')+'</tr>';
			var smsack 	= '<tr id="'+this.eids.w.smsack+'">'+this.controls.smsack.labelled('sms status', 'alpha10')+'</tr>';
		
		return mobile+msg+send+smsid+smsack;
	},
	activate: function() {
		if(vbs) vlog('smstest.js','C_iSMS','activate',''); 
		this.elements.collect(this.eids);
		this.controls.activate('C_iSMS');
		this.enable(this.state.enabled);
	},
	enable: function(key) {
		onoff = !!key | false;
		this.state.key = key;
		if(vbs) vlog('smstest.js','C_iSMS','activate','enabled:'+onoff+', key:'+key); 
		if(onoff) {
			$(this.elements.w.tom).show();
			$(this.elements.w.msg).show();
			this.controls.mobile.focus(true);
		} else {
			$(this.elements.w.tom).hide();
			$(this.elements.w.msg).hide();
			$(this.elements.w.send).hide();
			$(this.elements.w.smsid).hide();
			$(this.elements.w.smsack).hide();
			this.watchdog.suspend(true);
		}
	},

	// callbacks from sub controls
	mmchanged: function(digits) { 
		this.watchdog.suspend(true);
		var mobile = this.controls.mobile.value();
		var message = this.controls.msg.value();
		$(this.elements.w.smsid).hide();
		$(this.elements.w.smsack).hide();
		if(vbs) vlog('smstest.js','sms_MOB','mmchanged','mobile:'+mobile+', message:'+message);
		if(!(mobile&&message)) return;
		$(this.elements.w.send).show();
	},
	mmcleared: function() { 
		$(this.elements.w.send).hide();
		$(this.elements.w.smsid).hide();
		$(this.elements.w.smsack).hide();
		this.watchdog.suspend(true);
		if(vbs) vlog('smstest.js','sms_MOB','mmcleared','');
	},
	send: function() {
		var mobile = this.controls.mobile.value();
		var message = this.controls.msg.value();
		if(vbs) vlog('smstest.js','sms_MOB','send','mobile='+mobile+', msg='+message); 
		if(!(mobile&&message)) return;
		
		var data = new C_iPASS({k:this.state.key, to:mobile, msg:message});
		mobminder.app.post({data:data}, {data:{k:'k', to:'t', msg:'m'}}, './post/quicksms.php', new A_cb(this,this.sent), new A_cb(this,this.failed));
		this.controls.mobile.busy(true);
		this.controls.msg.busy(true);
	},
	predog: function() {
		this.controls.smsack.busy(true);
		return true;
	},
	
	// private
	
	// ajax feedbacks
	sent: function(datasets, stream) { // ajax feedback
		this.controls.mobile.busy(false);
		this.controls.msg.busy(false);
		var split = stream.split('!');
		var blabla = split.shift(); // first part is debug info
		var smsid = split.shift()|0; 
		if(vbs) vlog('smstest.js','sms_MOB','sent','sms id='+smsid); 
		
		var dS_sms = datasets['C_dS_sms'][smsid];
		this.controls.smsid.set(this.state.smsid = smsid);
		this.controls.smsack.set(C_dS_sms.status.fromcode(this.state.smsack = dS_sms.status));
		
		if(!smsid) return;
		
		// show the SMS feedback controls
		$(this.elements.w.send).hide();
		$(this.elements.w.smsid).show();
		$(this.elements.w.smsack).show();
		
		this.watchdog.state.post = {values:{k:this.state.key,i:this.state.smsid}, names:{k:'k',i:'i'}};
		this.watchdog.suspend(false, 10);
	},
	smsstatus: function(datasets, stream) {
		var smsid = stream.split('!').shift()|0;
		if(vbs) vlog('smstest.js','sms_MOB','smsstatus','sms id='+smsid); 
		
		var dS_sms = datasets['C_dS_sms'][smsid];
		this.controls.smsid.set(this.state.smsid = smsid);
		this.controls.smsack.set(C_dS_sms.status.fromcode(this.state.smsack = dS_sms.status));
		
		switch(this.state.smsack) {
			case C_dS_sms.status.sms_delivered:
			case C_dS_sms.status.sms_discarded:
			case C_dS_sms.status.sms_error:
			case C_dS_sms.status.sms_retained:
				this.watchdog.suspend(true); break;
		}		
		this.controls.smsack.busy(false);
	},
	failed: function() {
		this.controls.mobile.busy(false);
		this.controls.msg.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P P    S T A R T E R   
//
sms_MOB = function sms_MOB() { 

	if(vbs) vlog('smstest.js','sms_MOB','constructor',''); 
	mobminder.app = this;
	mobminder.context = { surfer:{name:'syntest', id:'1', language:0 } };
	mobminder.account = { visitorAlias:mobminder.visitor.codes.client };
	C_XL.setContextLanguage();
		C_dS_sms.status.stringSet(); // language must be set first
	
	this.eids = { desk:'desk', checkin:'chkin', menu:'menu', sms:'sms' };
	this.elements = new A_el();
	this.elements.collect({body:'body'});
	
	this.state = sms_MOB.defaults.align();
	
		var bodymode = is.tactile ? 'touch' : 'mouse';
	$("body").addClass(bodymode).noContext();

	var checkin = new C_iCHECKIN(this.eids.checkin, {}, { checkin:new A_cb(this, this.checkin)} );
	var smsmsg = new C_iSMS(this.eids.sms, {  }, {  } );
	
		var options = sms_MOB.options();
	var menu = new C_iCRESTA(this.eids.menu, { onselect:false }, options, { maxcols:2, maxrows:12, mode:0 } );
	

	this.controls = new A_ct( { checkin:checkin, menu:menu, smsmsg:smsmsg } );
	
	this.display();
	this.activate();
}
sms_MOB.defaults = new A_df({  });
sms_MOB.prototype = {

	// public functions
	display: function() {
		if(vbs) vlog('smstest.js','sms_MOB','display',''); 		
	
			var paddy = '<tr><td>&nbsp;</td><td></td></tr>';
			var checkin = this.controls.checkin.display();
			var smsmsg = this.controls.smsmsg.display();
		var controls = '<table summary="smstest" style="margin:0 auto">'+checkin+paddy+smsmsg+'</table>';
		
		var header = '<h2><br/>SMS API - Test Interface<br/>&nbsp;</h2>';
		var desk = '<div id="'+this.eids.desk+'" class="">'+controls+'</div>';
		this.elements.body.innerHTML = header+desk;
	},
	activate: function() {
		if(vbs) vlog('smstest.js','sms_MOB','activate',''); 
		this.elements.collect(this.eids);
		this.controls.activate('sms_MOB');
	},
	
	post: function(controls, names, target, success, failure) { // failure is called in case of timeout OR if a command is received
			var ajaxfeedback = new A_cb(this, this.ajaxfeedback, { success:success, failure:failure });
			var ajaxtimeout = new A_cb(this, this.ajaxtimeout, failure);
		var post = new A_ps(controls, names, target, {onreply:ajaxfeedback, ontimeout:ajaxtimeout} );
	},
	
	// ajax feedbacks
	ajaxfeedback: function(callbacks, stream) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		
		var dscode = stream.extract('<code>','</code>').match; 
		var command = stream.extract('<command>','</command>').match;  
		
			if(vbs) vlog('mobminder.js','e_MOB','ajaxfeedback','command:'+command);
			
		var datasets = false;
		if(dscode) datasets = C_inlineStreaming.createDataSets(dscode);
		
		if(command) switch(command) {
			case 'logoff': this.controls.top.logout(); if(callbacks.failure) callbacks.failure.cb(command); return; break;
		}
		if(callbacks.success) callbacks.success.cb(datasets, stream);
	},	
	ajaxtimeout: function(failure) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		if(vbs) vlog('e-reservation.js','e_MOB','ajaxtimeout','');
		new C_iMSG(C_XL.w('connection failed'));
		if(failure) failure.cb();
	},	
	
	// callbacks
	checkin: function(key) {
		if(vbs) vlog('smstest.js','sms_MOB','checkin','');
		this.controls.smsmsg.enable(key);
	},
	
	// private
	
	// ajax callbacks
	
};
sms_MOB.options = function() {
	var labels = { check:'check mode', clean:'clean up first' }; // powers of 2 <=> bitmap posted
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:true, clean:false };
	return { order:order, labels:labels, presets:presets, count:count };
}

