//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//       L A S T    V E R S I O N   2 0 2 0   -    I N C L U D E S    M U L T I P L E    F A M I L Y
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// � All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// � Copyright 2007-2022 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium

// Use Case: A visitor wants to book an appointment online
//
// Basic flow overview:
//
// 1. C_eAuthenticate: Authenticate (email validation or mobile validation)
// 2. C_eCheckIn: Identify people associated with email and mobile number (including an option to register one more person - C_eRegister)
// 3. C_eVappointments: Check up current appointments for identified people
// 4. C_eVselect: Select persons to appoint for
// 5. Choose performance and search options
// 6. Choose from availabilities
// 7. Type a note or message and confirm
//
//
// Basic Flow details:
//
//		Authentication:
// 			BF 1: Enter email and mobile (email is correct, and recognized in visitors register)
//			BF 2: Introduce PIN code sent on email address (the PIN is correctly entered)
//
//
//		Identification:
//			BF 3: Mobile number is asked. Based on mobile and email, a list of possible visitor is displayed
//			BF 4: The surfer chooses one (or many) of the possible proposed visitors
//
//		Performance and preferences
// 			BF 5: Select performance or care, choose prefered weekday and/or expert. 
//			BF 6: push the "search" button
//			BF 7: Choose from displayed availabilities
//
//		Confirm appointment
// 			BF 8: Type a note or message
// 			BF 9: Confirm
//			BF 10: The list of current appointments is displayed
// 
//


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
		let tokenauth = (mobminder.context.surfer.eresaAuthent==1 || mobminder.context.surfer.eresaAuthent==2);
		let patients = mobminder.account.visitorAlias==mobminder.visitor.codes.patient;
	this.has = { tokenauth:tokenauth, patients:patients };
	
		if(vbs) vlog('e-resa.js','C_eAuthenticate','constructor','token authentication:'+tokenauth+', patients:'+patients); 

	let b = eid+'_eAuth_';
	this.eids = { 	own: { div:b+'_div_all', welcome:b+'_div_welc', badtoken:b+'_div_bad'
							, email:b+'_div_email', mobile:b+'_div_mobl', bauth:b+'div_bauth'
							, msg:b+'_div_msg', warn:b+'_div_warn', form:b+'_div_form', token:b+'_div_token', demo:b+'_div_demo' },
					controls: { email:b+'_email', mobile:b+'_mobl', token:b+'_token' },
					buttons: { auth:b+'_bttauth'}
				};
				
	
		let typing = new A_cb(this, this.typing, null, null, 300);
		let onenter = new A_cb(this, this.onenter ); // this works only when the control got the focus()
		
	let email 	= new C_iFIELD(this.eids.controls.email, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email') });
	let mobile 	= new C_iFIELD(this.eids.controls.mobile, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile') });
	
	//let auth 	= new C_iBUTTON(this.eids.buttons.auth, new A_cb(this, this.authenticate), {caption:C_XL.w('authify me'), enabled:false } );
	let auth =  new C_iCLIK(this.eids.buttons.auth, { click:new A_cb(this, this.authenticate) }, { enabled:false,tag:'div', ui:C_XL.w('authify me'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	
	let token 	= new C_eToken(this.eids.controls.token, { checked:new A_cb(this,this.tokenchecked) } );
	

	this.controls = new A_ct({email:email, mobile:mobile, token:token});
	this.buttons = new A_ct({auth:auth});
	this.appointments = new A_ct();
	
	this.state = { authmode:'email', visitor:false, faillevel:0, valid:{email:false, mobile:false} };
}
C_eAuthenticate.prototype = {
	
	// register form
	display: function() {
		
		let postbd = '', postmobile = '';
		if(is.browser.MSIE) { // MSIE bullshit filling (has no placeholder)
			postmobile = '<span style="color:silver;">'+C_XL.w('mobile')+'</span>';
			postbd = '<span style="color:silver;">'+C_XL.w('dd-mm-yyyy',{cap:0})+'</span>';
		}
			let welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'" 	style="">'+C_XL.w('e-welcome')+'</div>';
			let bad 	= '<div class="e-msg" id="'+this.eids.own.badtoken+'" 	style="display:none;">'+C_XL.w('bad token')+'</div>';
			let email 	= '<div class="e-msg" id="'+this.eids.own.email+'" 		style="">'+this.controls.email.display('textual')+'</div>';
			let mobile 	= '<div class="e-msg" id="'+this.eids.own.mobile+'" 	style="display:none;">'+this.controls.mobile.display('textual')+postmobile+'</div>';
				
			let bauth 	= '<div class="e-btn" id="'+this.eids.own.bauth+'" 	style="">'+this.buttons.auth.display()+'</div>';
			
			let msg 	= '<div class="e-msg" id="'+this.eids.own.msg+'" 		style="display:none;">'+'</div>';
			//let warn 	= '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="display:none; text-align:center;">'+C_XL.w('warn red field')+'</div>';
			let warn 	= '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="width:100%; text-align:left;display:inline-block;">'+C_XL.w('warn red field')+'</div>';
			let token 	= '<div class="" id="'+this.eids.own.token+'" 			style="display:none;">'+this.controls.token.display()+'</div>';
			let demo 	= '<div class="" id="'+this.eids.own.demo+'" 			style="display:none;">'+'</div>';
		let div = '<div id="'+this.eids.own.div+'">'+welcome+bad+msg+email+mobile+warn+bauth+token+demo+'</div>';
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
		let split = stream.split('!'); split.shift(); // removes the first part conatining debug and status info
		let token = split.shift();
		this.elements.demo.innerHTML = '<div style="font-size:90%; text-align:right;">Demo token: '+token+'</div>';
		$(this.elements.demo).show();
	},
	
	// controls callbacks
	validauth: function() {
		this.state.valid.email = this.controls.email.valid();
		this.state.valid.mobile = this.controls.mobile.valid();
		let go = false;
		switch(this.state.authmode) {
			case 'email': go = this.state.valid.email; break;
			case 'mobile': go = this.state.valid.mobile; break;
		}
		this.buttons.auth.enable(go);
		if (go) $(this.elements.warn).hide();
		else $(this.elements.warn).show();

		return go;
	},
	typing: function(digits) { this.validauth(); },
	onenter: function() { if(this.validauth()) this.authenticate(); },
	tokenchecked: function(result) {
		if(result) {
				let e = this.controls.email.getpost();
				let m = this.controls.mobile.getpost();
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

		
		mobminder.app.post(this.controls, { email:'email', mobile:'mobile' }, '../_assets/eresa2/authenticate.php', new A_cb(this,this.authenticated, null, null, 500), new A_cb(this, this.connfailed));
		
	},
	
	// ajax callbacks
	authenticated: function(dsets, stream) { // e-resa STEP 1: callback from initial email check
		$(this.elements.bauth).hide();
		this.buttons.auth.busy(false);
		if(this.has.tokenauth) if(mobminder.demo) this.extractoken(stream);
		if(!mobminder.context.surfer.eresaAuthent) 
			this.tokenchecked(true); // no active authentication shortcut the token authentication
		else 
		{ 
			let email = this.controls.email.value();
	        this.controls.token.setemail(email);

			$(this.elements.email).hide(); 

			$(this.elements.token).show(); 
			this.controls.token.focus(); 
		} // check the token sent on email or mobile
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
		let tokenauth = (mobminder.context.surfer.eresaAuthent==1 || mobminder.context.surfer.eresaAuthent==2);
		let patients = mobminder.account.visitorAlias==mobminder.visitor.codes.patient;
	this.has = { tokenauth:tokenauth, patients:patients };
	
		if(vbs) vlog('e-resa.js','C_eCheckIn','constructor','token authentication:'+tokenauth+', patients:'+patients); 

	this.eids = { 	own: { div:eid+'_div_all', prelist:eid+'_div_pre', postlist:eid+'_div_post', vlist:eid+'_div_vlist'
							, email:eid+'_div_email', mobile:eid+'_div_mobl', warn:eid+'_div_warn', bident:eid+'div_bident'
							, regmsg:eid+'_div_msg', form:eid+'_div_form', demo:eid+'_div_demo' },
					inputs: { email:eid+'_email', mobile:eid+'_mobl' },
					controls: { registr:eid+'_registr' },
					buttons: { ident:eid+'_ident', more:eid+'_more', next:eid+'_next'},
					wrappers: { welcome:eid+'_wrp_welcome', vlist:eid+'_wrp_list', register:eid+'_wrp_register' }
				};

		let typing = new A_cb(this, this.typing, null, null, 300);
		let onenter = new A_cb(this, this.onenter ); // this works only when the control got the focus()
				
	let email 	= new C_iFIELD(this.eids.inputs.email, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email') });
	let mobile 	= new C_iFIELD(this.eids.inputs.mobile, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile') });
	
	//let ident 	= new C_iBUTTON(this.eids.buttons.ident, new A_cb(this, this.ident), {caption:C_XL.w('identify me'), enabled:false } );
	let ident =  new C_iCLIK(this.eids.buttons.ident, { click:new A_cb(this, this.ident) }, { enabled:false, tag:'div', ui:C_XL.w('identify me'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	//let more 	= new C_iBUTTON(this.eids.buttons.more, new A_cb(this, this.more), {caption:C_XL.w('eresa register more'), enabled:true, hidden:false } );
	let more =  new C_iCLIK(this.eids.buttons.more, { click:new A_cb(this, this.more) }, { enabled:true, tag:'div', ui:C_XL.w('eresa register more'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	//let next 	= new C_iBUTTON(this.eids.buttons.next, new A_cb(this, this.next), {caption:C_XL.w('eresa ident continue many'), enabled:true, hidden:false } );
	let next =  new C_iCLIK(this.eids.buttons.next, { click:new A_cb(this, this.next) }, { enabled:true, tag:'div', ui:C_XL.w('eresa ident continue many'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

		
	let registr = new C_eRegister(this.eids.controls.registr, { valid:new A_cb(this,this.validform), saved:new A_cb(this,this.newvisisaved) }, { shortform:!this.has.patients } );
	
	this.inputs = new A_ct({ email:email, mobile:mobile });
	this.controls = new A_ct({ registr:registr });
	this.buttons = new A_ct({ident:ident, more:more, next:next });
	this.appointments = new A_ct();
	
	this.state = { visitors:false, firstsignin:false, faillevel:0, valid:false };
}
C_eCheckIn.prototype = {
	
	// public
	display: function() {
		
				let postbd = '', postmobile = '';
				if(is.browser.MSIE) { // MSIE bullshit filling (has no placeholder)
					postmobile = '<span style="color:silver;">'+C_XL.w('mobile')+'</span>';
					postbd = '<span style="color:silver;">'+C_XL.w('dd-mm-yyyy',{cap:0})+'</span>';
				}
				let welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'">'+C_XL.w('fill mobile')+'</div>';
				let email 	= '<div class="e-msg" id="'+this.eids.own.email+'">'+this.inputs.email.display('textual')+'</div>';
				let mobile 	= '<div class="e-msg" id="'+this.eids.own.mobile+'">'+this.inputs.mobile.display('textual')+postmobile+'</div>';
				let warn 	= '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="width:100%; text-align:left;display:inline-block;">'+C_XL.w('warn red field')+'</div>';
				let bident 	= '<div class="e-btn" id="'+this.eids.own.bident+'">'+this.buttons.ident.display()+'</div>';
			welcome = '<div id="'+this.eids.wrappers.welcome+'" style="display:block;">'+welcome+email+mobile+warn+bident+'</div>';
				
			
				let prelist = '<div class="e-msg" id="'+this.eids.own.prelist+'" style="display:none">'+C_XL.w('eresa identified more')+'</div>';
				let postlist = '<div class="e-msg" id="'+this.eids.own.postlist+'" style="display:none">'+C_XL.w('eresa identified one')+'</div>';
				
				//let vlisticon = '<span class="fal fa-user" style="padding-right:10px;"></span>';
				let vlist = '<div class="e-msg" id="'+this.eids.own.vlist+'">'+'</div>';
				let next = '<div class="e-btn">'+this.buttons.next.display()+'</div>';
				let more = '<div class="e-btn">'+this.buttons.more.display()+'</div>';
			vlist = '<div id="'+this.eids.wrappers.vlist+'" style="display:none;">'+prelist+vlist+postlist+next+more+'</div>';
			
			
				let regmsg 	= '<div class="e-msg" id="'+this.eids.own.regmsg+'">'+C_XL.w('pls register')+'</div>';
				let form 	= '<div class="e-msg" id="'+this.eids.own.form+'"">'+this.controls.registr.display()+'</div>';
			let register = '<div id="'+this.eids.wrappers.register+'" style="display:none;">'+regmsg+form+'</div>';
			
				let demo 	= '<div class="" id="'+this.eids.own.demo+'" style="display:none;">'+'</div>'; // demo mode token cheat display
				
		let div = '<div id="'+this.eids.own.div+'">'+welcome+vlist+register+demo+'</div>';
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
		
		let visitors = this.state.visitors;
		//console.log('showcandidates:this.state.visitors.count='+this.state.visitors.count);
		let list = '', c = 0;
		let listelemicon = '<span class="fal fa-user" style="padding-right:10px;"></span>';
		for(let vid in visitors) {
			let dS_v = visitors[vid];
			list += listelemicon+C_XL.gender(dS_v.gender, dS_v.language)+'&nbsp;'+dS_v.firstname+'&nbsp;'+dS_v.lastname+',<br/>';
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
		let newstate = this.inputs.isvalid();
		if(newstate!=this.state.valid) {
			if(this.callbacks.valid) this.callbacks.valid.cb(newstate);

			//console.log("newstate="+newstate);
			this.buttons.ident.enable(newstate);
			
			if (newstate) $(this.elements.warn).hide();
			else $(this.elements.warn).show();
	
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
		mobminder.app.post(this.inputs, { email:'email', mobile:'mobile' }, '../_assets/eresa2/identify.php', new A_cb(this,this.candidates), new A_cb(this, this.connfailed));
	},
	more: function() {
		
			let e = this.inputs.email.getpost();
			let m = this.inputs.mobile.getpost();
		this.controls.registr.reset(e,m);
			
		this.controls.registr.setcaption(this.state.firstsignin);
		
		$(this.wrappers.register).show(); // shows visitor data registration form
		$(this.wrappers.vlist).hide();
		this.controls.registr.focus();
		
	},
	next: function() { // this is the only way out from this process
		// $(this.elements.vlist).hide();
		//console.log('next:this.state.visitors.count='+this.state.visitors.count);
		if(this.callbacks.identified) this.callbacks.identified.cb(this.state.visitors, this.state.firstsignin);
		
	},
	
	// ajax callbacks
	candidates: function(inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
		//if(vbs) vlog('e-resa.js','C_eCheckIn','candidates','this.state.visitors.count='+this.state.visitors.count); 
		//console.log('candidates:inlineDataSets='+inlineDataSets);
		//console.log('candidates:stream='+stream);

		this.buttons.ident.busy(false);
		if(!this.state.visitors.count) this.state.newsignin = true;
		this.state.visitors = inlineDataSets['C_dS_visitor'] || new Array(); // visitor(s) matched to email or mobile

		//console.log('candidates:this.state.visitors.count='+this.state.visitors.count);

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
	let b = eid+'_eReg_';
	this.eids = { 	id:b+'id', gender:b+'gender', fname:b+'fname', lname:b+'lname', mobile:b+'mobile'
					, addr:b+'addr', zip:b+'zip', city:b+'city', country:b+'country', phone:b+'phone'
					, email:b+'email', bdate:b+'bdate', save:b+'regsave', warn:eid+'_div_warn'  
				};
	this.elements = new A_el();
	this.state = C_eRegister.defaults.align(preset);
		
		let shortform = this.state.shortform;
	
		let typing = new A_cb(this, this.typing, null, null, 500);
		let typingfn = new A_cb(this, this.typingfn, null, null, 800); /* special cast for firstname whom we will try to guess the gender from */
		let onenter = new A_cb(this, this.onenter );
	
	let id = new C_iPASS(this.dataSet.id);
	
		
	let gender		= new C_iCRESTA(this.eids.gender, {}, { labels:{ 0:C_XL.w('gender_0'), 1:C_XL.w('gender_1') } }, { value:this.dataSet.gender, skin:0, title:false, mode:-1, value:0, maxrows:1 }  );

		let po_fn = C_XL.w('firstname');
		let po_ln = C_XL.w('lastname');
		switch(mobminder.context.surfer.profession) { // (*es01*)
			case 214: po_fn = C_XL.w('child firstname'); po_ln = C_XL.w('child lastname'); break; // pediatrician 
			case 296: po_fn = C_XL.w('owner firstname'); po_ln = C_XL.w('owner lastname'); break; // veterinary 
		}
	let lname 		= new C_iFIELD(this.eids.lname, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.lastname, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:po_ln });
	let fname 		= new C_iFIELD(this.eids.fname, { onfchange:typingfn, onenterkey:onenter }, { digits:this.dataSet.firstname, type:INPUT_TEXT, mandatory:true, placeholder:po_fn });
	let mobile 		= new C_iFIELD(this.eids.mobile, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.mobile, type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile') });

	let addr 		= new C_iFIELD(this.eids.addr, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.address, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('address') });
	let zip 		= new C_iFIELD(this.eids.zip, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.zipCode, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('zipCode') });
	let city 		= new C_iFIELD(this.eids.city, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.city, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('city') });
	let country		= new C_iFIELD(this.eids.country, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.country, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('country') });
	let phone 		= new C_iFIELD(this.eids.phone, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.phone, type:INPUT_PHONE, mandatory:false, placeholder:C_XL.w('phone') });
	
	let email 		= new C_iFIELD(this.eids.email, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email') });
	let bdate 		= new C_iFIELD(this.eids.bdate, { onfchange:typing, onenterkey:onenter }, { type:INPUT_BDATE, mandatory:!shortform, placeholder:C_XL.w('dd-mm-yyyy',{cap:0}) });

	//let save 		= new C_iBUTTON(this.eids.save, new A_cb(this, this.onsave), { caption:C_XL.w('i sign in'), enabled:false } );
	let save 		= new C_iCLIK(this.eids.save, { click:new A_cb(this, this.onsave) }, { enabled:false, tag:'div', ui:C_XL.w('i sign in'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	
	this.controls = new A_ct( { save:save, id:id, email:email, bdate:bdate, gender:gender, fname:fname, lname:lname, mobile:mobile, addr:addr, zip:zip, city:city, country:country, phone:phone } );
	this.state = { valid:false };
}
C_eRegister.defaults = new A_df( { shortform:false } );
C_eRegister.prototype = { 
	// public
	display: function(css) {
	
		// coordinates left side
		let gender 	= '<div>'+this.controls.gender.display()+'</div>';
		
		let fname 	= '<div>'+this.controls.fname.td('textual')+'</div>';
		let lname 	= '<div>'+this.controls.lname.td('textual')+'</div>';
		let mobile 	= '<div>'+this.controls.mobile.td('textual')+'</div>';
		let phone 	= '<div>'+this.controls.phone.td('textual')+'</div>';
		let bdate 	= '<div>'+this.controls.bdate.td('textual')+'</div>';
		
		// coordinates right side
		let addr 	= '<div>'+this.controls.addr.td('textual')+'</div>';
		let zip 	= '<div>'+this.controls.zip.td('textual')+'</div>';
		let city 	= '<div>'+this.controls.city.td('textual')+'</div>';
		let country = '<div>'+this.controls.country.td('textual')+'</div>';
		let email 	= '<div>'+this.controls.email.td('textual')+'</div>';
		
		let coords = '<div class="v-coords">'+lname+fname+gender+mobile+phone+bdate+addr+zip+city+country+email+'</div>';

		//let cr = '<table class="v-coords-right" style="">'++'</table>';
		//let form = '<div class="e-coords">'+cl+cr+'</div>';
		//let save = 	'<div class="e-btn" style="">'+this.controls.save.display()+'</div>';
		let save = '<div class="e-msg text-center text-sm-left">'+this.controls.save.display()+'</div>';

		let warn = '<div class="e-msg e-warner" id="'+this.eids.warn+'" style="text-align:left;">'+C_XL.w('warn red field')+'</div>';

		return coords+warn+save;
	},
	activate: function() {	
		this.elements.collect(this.eids);
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
			let c = C_XL.w('sign in');
			if(first) c = C_XL.w('i sign in');
		this.controls.save.caption(c);
	},
	save: function() { // programmaticaly trigger a save
		let names = { id:'id', email:'email', bdate:'birthday', gender:'gender', fname:'firstname', lname:'lastname', mobile:'mobile', addr:'address', zip:'zipCode', city:'city', country:'country', phone:'phone'};
		mobminder.app.post(this.controls, names, '../_assets/post/visitor.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	focus: function() { this.controls.lname.focus(true); },
	
	// private

	// event handling
	typing: function(d) {
		let newstate = this.controls.isvalid();
		if(newstate!=this.state.valid) {
			if(this.callbacks.valid) this.callbacks.valid.cb(newstate);
			this.controls.save.enable(newstate);
			if(newstate) $(this.elements.warn).hide(); else $(this.elements.warn).show();
		}
		
		return this.state.valid = newstate;
	},
	typingfn: function(d) {
		let names = { fname:'name' };
		mobminder.app.post(this.controls, names, '../_assets/queries/gender.php', new A_cb(this,this.gender), new A_cb(this,this.failed));

		return this.typing(d);
	},
	onenter: function(digits) { if(this.typing()) this.save(); },
	remove: function() { },
	escape: function() { return true; },
	onsave: function() { this.save(); },

	// ajax callback event handlers
	gender: function(dS, stream) {
		
		let s = stream.split('##');
		let gender = s[0];
		
		if(gender == 'x') {
			this.state.match = false; 
		} else {
			this.controls.gender.docheck(gender|0);
			this.state.match = true; 
		}
		
	},
	saved: function(inlineDataSets) {
		let visitors = inlineDataSets['C_dS_visitor'];
		let id = 0; for(id in visitors) break;
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
					controls: { email:eid+'_email', confirmsg:eid+'_confirmsg' },
					buttons: { ident:eid+'_ident',}
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
		for(let vid in vids) vids[vid].apps = []; // we add a member 'apps' to each objects
		this.state.dSvisitors = vids;
		
			let ids = arrayKEYS(vids);
			let ctls = new A_ct({ids:new C_iPASS(ids.join(','))});
			let names = {ids:'ids'};
		mobminder.app.post(ctls, names, '../_assets/eresa2/visiapps.php', new A_cb(this,this.cappsdata,vids), new A_cb(this, this.connfailed));
	},
	vappscount: function(vid) {
		let c = 0;
		let vs = this.state.dSvisitors;
		if(vid) { // count for one given visitor
			let dS_v = vs[vid];
			for(let rid in dS_v.apps) if(dS_v.apps[rid].deletorId==0) c++;			
		} else
			for(let vid in vs) { // total count for all visitors
				let dS_v = vs[vid];
				for(let rid in dS_v.apps) if(dS_v.apps[rid].deletorId==0) c++;
			}
		return c;
	},
	ds: function() { return this.state.dSvisitors; },
	vcaption: function(vid) {
		let vs = this.state.dSvisitors;
		let dS_v = vs[vid];
		let cap = ''+C_XL.gender(dS_v.gender, dS_v.language)+'&nbsp;'+dS_v.firstname+'&nbsp;'+dS_v.lastname;
		return cap;
	},
	vlist: function() {
		let list = '';
		let vs = this.state.dSvisitors;
		for(let vid in vs) {
			let dS_v = vs[vid];
			list += this.vcaption(vid)+',<br/>';
		}
		return list;
	},
	appsdisplay: function() {
		
		let options = { maydelete:mobminder.context.surfer.eresaCancel, afterdelete:false, before:''};
			
		let list = '';
		let c = this.vappscount();
		
		if(c) {
			let vs = this.state.dSvisitors;
			this.appointments = new A_ct();
			for(let vid in vs) {
				let dS_v = vs[vid];
				let c=0; for(let rid in dS_v.apps) if(dS_v.apps[rid].deletorId==0) c++;	
				
				list += '<div class="e-visitor">'+this.vcaption(vid)+'</div>';
			
				if(!c) {
					list += '<div class="e-msg" style="padding-left:2em;">'+C_XL.w('e- has no planned appointment')+'</div>';	
					continue;
				}
				
					let apps = dS_v.apps;
					let ordered = []; for(let id in apps) ordered.push(id);
					let sortf = function(a,b){ if(apps[a].cueIn > apps[b].cueIn) return 1; else return -1; };
				ordered.sort(sortf);
				
				for(let x in ordered) 
				{
					let dS_resa = apps[ordered[x]];
					if(dS_resa.deletorId!=0) continue;
					let eresa = new C_eRESA(dS_resa, { deleted:new A_cb(this, this.appdeleted) }, { maydelete:options.maydelete } );
						list += eresa.action();
						//this.appointments.add1(eresa,id);
						this.appointments.add1(eresa);
				}
			}
			
			let msgabove = '<div class="e-msg">'+C_XL.w('e- you are app yet on')+'</div>';
				let m = C_XL.w('e- deletion unavailable'); if(options.maydelete) m = is.tactile? C_XL.w('e- touch to delete') : C_XL.w('e- click to delete');
			let msgunder = '<div style="margin: 1em 0; text-align:right;">'+m+'</div>';
				let note = mobminder.context.surfer.eresaNote.htmlize();
    	        let confirmmsg  = note?'<div id="'+this.eids.controls.confirmsg+'" class="perf_notes" style="margin-top:1em;margin-bottom:1em;"><div class="iconinfo_before_notes" style="position:relative;">'+note+'</div></div>':'';

			
			$(this.elements.wrp).html(msgabove+list+msgunder+confirmmsg);
			this.appointments.activate('C_eVappointments');
			
		} else {
			
			let noappyet = '<div style="margin: 1em 0;">'+C_XL.w('e- you have no appointments')+'</div>';
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
		if(vbs) vlog('e-resa.js','C_eVappointments','appdeleted','resaId:'+resaId); 
	},
	
	
	// ajax calls
	
	//BSP : OLD VERSION OVERRIDEN BY PASCAL
	// ajax callbacks
	/*cappsdata: function(vids, inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
			

		let resasbyvisitor = C_dS_att_visitor.getbyvisitor(); // we will need to display appointments by visitors
		for(let vid in resasbyvisitor) {
			let resas = resasbyvisitor[vid];
			for(let rid in resas) {
				let dS_resa = resas[rid];
				this.state.dSvisitors[vid].apps[rid] = dS_resa;
			}
		}
		
		this.appsdisplay();
		
		if(this.callbacks.cappsloaded) this.callbacks.cappsloaded.cb(vids);
	},*/
	// ajax callbacks
	cappsdata: function(vids, inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
		
		let prebs = inlineDataSets['C_dS_prebooking'];

		let resasbyvisitor = C_dS_att_visitor.getbyvisitor(); // we will need to display appointments by visitors
		for(let vid in resasbyvisitor) {
			let resas = resasbyvisitor[vid];
			for(let rid in resas) 
			{
				let foundinpreb=false;
				for(let prebid in prebs)
				{
					if (prebs[prebid].reservationId==rid) 
					{
						foundinpreb=true;
						break;
					}
				}
				if (!foundinpreb) 
				{
					let dS_resa = resas[rid];
					if(this.state.dSvisitors[vid]) // we need this check because if rid resa has multiple visitors, of which one is not part of the "family", then the code stops here with this error message "this.state.dSvisitors[vid] is undefined"
						this.state.dSvisitors[vid].apps[rid] = dS_resa;
				}
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
	
	//let next 	= new C_iBUTTON(this.eids.buttons.next, 	new A_cb(this, this.next), { caption:C_XL.w('continue'), width:20, height:2, enabled:true, hidden:false } );
	let next =  new C_iCLIK(this.eids.buttons.next, { click:new A_cb(this, this.next) }, { enabled:true,tag:'div', ui:C_XL.w('continue'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );


	this.controls = new A_ct({ vselect:false });
	this.buttons = new A_ct({ next:next });

}
C_eVselect.prototype = {
	set: function(visitors) {
		this.visitors = visitors;
		let c = 0; for(let vid in visitors) c++;
		let eresaMax = mobminder.context.surfer.eresaMax;
		
			// presetting the picker preset options (items of type leadclass)
			let optpreset = {};
			let labels = [], order=[], presets = [];
			c = 0;
			for(let vid in visitors) {
					let dS_visi = visitors[vid];
					let vappsc = this.appscount(dS_visi);
					let maymore = vappsc <= eresaMax;
				if(this.leadclass.get(vid)) {
					labels[vid] = this.leadclass.ACoptions.label(vid);
					order.push(vid);
					presets[vid] = { checked:!c++, tip:false, onlabel:false, enabled:maymore }
				}
			}
			this.sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(this.sortrule);
				optpreset = { order:order, labels:labels, presets:presets, count:order.length };
		let vselect = new C_iCRESTA(this.eids.controls.vselect, { onchange:new A_cb(this, this.vselect) }, optpreset, { skin:1, mode:1, value:0, title:false,maxcols:1, maxrows:false } );
	
		this.elements.vselect.innerHTML = vselect.display();
		this.controls.vselect = vselect.activate();
	},
	display: function(css) {
			let welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'" 	style="">'+C_XL.w('e-choose who to book for')+'</div>';
			let vselect = '<div class="e-msg" id="'+this.eids.own.vselect+'" 	style="">'+'</div>';
			let next 	= '<div class="e-msg" id="'+this.eids.own.next+'" 		style="">'+this.buttons.next.display()+'</div>';
		let div = '<div id="'+this.eids.own.div+'">'+welcome+vselect+next+'</div>';
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
				let selected = this.controls.vselect.getvalue();
				let visitors = [];
				for(let x in selected) { 
					let vid = selected[x];
					visitors[vid] = this.leadclass.get(vid); 
				}
			this.callbacks.vchosen.cb(visitors);
		}
	},
	
	// private
	appscount: function(dS_visi) { let c = 0; for(let rid in dS_visi.apps) if(dS_visi.apps[rid].deletorId==0) c++; return c; }

}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//    O N L I N E      R E S E R V A T I O N     G L O B A L      P R O C E S S
//

C_eProcess = function(eid, callbacks) { // FIVE STEPS RESERVATION PROCESS IS OVERALL MANAGED HERE
	this.watchdog = false;
	this.cancelhasbeenclicked = false;
	this.watchdogcounter=0;
	this.classname = 'C_eProcess';
	this.callbacks = callbacks||{}; // callbacks like { ondone:A_cb }
	if(vbs) vlog('e-resa.js','C_eProcess','constructor',''); 
	mobminder.app.search = this;
		let b = eid+'_';
	this.eids = { eid:eid, outset:b+'outset', auth:b+'auth', checkin:b+'checkin', capps:b+'capps', vslct:b+'vslct', options:b+'options', slots:b+'out', resa:b+'resa', goodbye:b+'goodbye', qrcode:b+'qrcode',
					controls:{ auth:b+'auth', chkin:b+'chkin', capps:b+'ccapps', visi:b+'visi', eperf:b+'eperf', before:b+'before', ampm:b+'ampm', staff:b+'staff' },
					buttons:{ search:b+'search', backslots:b+'backslots',moreslots:b+'moreslots', change1:b+'change1', change2:b+'change2', moredone:b+'bmd', paycancel:b+"paycancel" },
					msgs: { currapps:b+'capps', options:b+'chopt', slotshere:b+'shere', progress:b+'progress' 
							, wkname:b+'wknme', wknotice:b+'wknote',wknotes:b+'wknotes' , wkwarning:b+'wkwarn', wkpricing:b+'wkpric' , wkprice:b+'wkprice' , wkdeposit:b+'wkdeposit'
							, moreapp:b+'moreapp', confirmsg:b+'cfrm', overbkmsg:b+'ovbk', tipconfirm:b+'tcnfrm', payinfo:b+"payinfo" },
					panes: { p1:b+'p1', p2:b+'p2', p3:b+'p3', p4:b+'p4', p5:b+'p5' },
				}
	this.elements = new A_el();
	
	let progress = new C_eProgress(this.eids.msgs.progress);
	
	// sub controls
	let auth 	= new C_eAuthenticate(this.eids.controls.auth, { authenticated:new A_cb(this, this.authenticated) } );
	let checkin = new C_eCheckIn(this.eids.controls.chkin, { identified:new A_cb(this, this.identified) } ); // includes an instance of C_eRegister
	let capps 	= new C_eVappointments(this.eids.controls.capps, { cappsloaded:new A_cb(this, this.cappsloaded), appdeleted:new A_cb(this, this.appdeleted) } );
	let vselect = new C_eVselect(this.eids.controls.visi, { vchosen:new A_cb(this, this.vselected) } );
	
	let eperf = new C_ePERF(this.eids.controls.eperf, {oneperf:new A_cb(this,this.workcodeSelect)} );
	let duration = new C_iPASS(1);
	let tboxing = new C_iPASS('-');
	let before = new C_iBEFORE(this.eids.controls.before, {onbefore:new A_cb(this,this.before)}, { eresa:true, selection:mobminder.context.surfer.eresaBefore, title:'search as from', soonest:'today' } );
	
	//let aid = mobminder.account.id;
	this.days = 0;
		
	let ampm = new C_iAMPM(this.eids.controls.ampm, {onampm:new A_cb(this,this.ampm)} );
		let rsctypes = mobminder.context.surfer.eresaRescType; // bitmap according to what choice is allowed to public web reservation
		let staffshow = {bCals:!!(rsctypes&class_bCal), uCals:!!(rsctypes&class_uCal), fCals:!!(rsctypes&class_fCal), contingent:false };
	let staff = new C_iSTAFF(this.eids.controls.staff, 'staffing', new A_cb(this,this.staff), {}, { show:staffshow, maxrows:(is.small?false:false), maxcols:1 });
	
		let more = {caption:C_XL.w('e- more app'), tip:'', css:'action double', cssfa:'plus' };
		let done = {caption:C_XL.w('e- done ok'), tip:'', css:'action double', cssfa:'sign-out' };
	let moredone = new e_DblButton(this.eids.buttons.moredone, {onleft:new A_cb(this, this.moreapp), onright:new A_cb(this, this.done)}, {left:more, right:done });
	
		let tipsearch = C_XL.w('tip e-search');
		let tipchange = C_XL.w('tip e-change');
	//let search = new C_iBUTTON(this.eids.buttons.search, new A_cb(this, this.search), {enabled:true, width:12, height:3, tabindex:false, tip:tipsearch});
	let search =  new C_iCLIK(this.eids.buttons.search, { click:new A_cb(this, this.search) }, { enabled:true, tabindex:false, tag:'div', ui:C_XL.w('slotsearch'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;', tip:tipsearch }  );

	//let backslots = new C_iBUTTON(this.eids.buttons.backslots, new A_cb(this, this.searchback), {enabled:true, tabindex:false});
	//TODO let backslots =  new C_iCLIK(this.eids.buttons.backslots, { click:new A_cb(this, this.searchback) }, { enabled:true, tabindex:false, tag:'div', ui:'<span class="fa lighter fa-1d5x fa-angle-up fa-fw"></span>'+C_XL.w('earlier_dates'), css:'e-button-backnext', style:'width:100%; display:flex; justify-content:center; align-items:center;' }  );

	//let moreslots = new C_iBUTTON(this.eids.buttons.moreslots, new A_cb(this, this.search), {enabled:true, width:16, height:2.5, tabindex:false, tip:tipsearch});
	let moreslots =  new C_iCLIK(this.eids.buttons.moreslots, { click:new A_cb(this, this.search) }, { enabled:true, tabindex:false, tag:'div', ui:'<span class="fa lighter fa-1d5x fa-angle-down fa-fw"></span>'+C_XL.w('next dates'), css:'e-button-backnext', style:'width:100%; display:flex; justify-content:center; align-items:center;' }  );

	//let change1 = new C_iBUTTON(this.eids.buttons.change1, new A_cb(this, this.change), {enabled:true, width:16, height:2.5, tabindex:false, tip:tipchange});
	let change1 =  new C_iCLIK(this.eids.buttons.change1, { click:new A_cb(this, this.change) }, { enabled:true, tabindex:false, tip:tipchange, tag:'div', ui:'<span class="fa fa-arrow-alt-circle-up fa-1d5x" style="margin-right:5px;"></span>'+C_XL.w('modify options'), css:'e-button-change', style:'display:flex; justify-content:flex-end; align-items:center; margin-left:auto; margin-right:0;' }  );

	//let change2 = new C_iBUTTON(this.eids.buttons.change2, new A_cb(this, this.change), {enabled:true, width:16, height:2.5, tabindex:false, tip:tipchange});
	let change2 =  new C_iCLIK(this.eids.buttons.change2, { click:new A_cb(this, this.change) }, { enabled:true, tabindex:false, tip:tipchange, tag:'div', ui:'<span class="fa fa-arrow-alt-circle-up fa-1d5x" style="margin-right:5px;"></span>'+C_XL.w('modify options'), css:'e-button-change', style:'display:flex; justify-content:flex-end; align-items:center; margin-left:auto; margin-right:0;' }  );

	//let paycancel = new C_iBUTTON(this.eids.buttons.paycancel, new A_cb(this, this.paycancel), {enabled:true, tabindex:false});
	let paycancel =  new C_iCLIK(this.eids.buttons.paycancel, { click:new A_cb(this, this.paycancel) }, { enabled:true, tabindex:false, tag:'div', ui:'<span class="fa fa-times-circle fa-1d5x" style="margin-right:5px;"></span>'+C_XL.w('abandon'), css:'e-button-change', style:'display:flex; justify-content:flex-end; align-items:center; margin-left:auto; margin-right:0;' }  );
	
	let continued = new C_iPASS(0);
	let limit = new C_iPASS(mobminder.context.surfer.eresaLimit);
	let limitdate = new C_iPASS(0);
	
		let aggregate = mobminder.context.surfer.eresaAggregate;
		let sameday = mobminder.context.surfer.eresaSameday;
	let options = new C_iPASS({ exceptional:0, overdays:0, aggregate:aggregate, sameday:sameday }); // passed to search engine on server
	
	this.controls = new A_ct({progress:progress, capps:capps, vselect:vselect, visitor:new C_iPASS('-'), auth:auth, checkin:checkin, eperf:eperf, duration:duration, before:before, ampm:ampm, staff:staff, tboxing:tboxing, options:options, continued:continued, limit:limit, limitdate:limitdate});
	this.buttons = new A_ct({search:search, moreslots:moreslots, change1:change1, change2:change2, moredone:moredone,paycancel:paycancel});
	
		let wkcnt = C_dS_workcode.has({eresa:true});
	this.state = { duplicate:false, duplicate:false, wkcnt:wkcnt, initializing:false };
}
C_eProcess.prototype = {
	// public interface 
	display: function(containerEid) {
		let single = mobminder.account.single;
		if(vbs) vlog('e-resa.js','C_eProcess','display',''); 
		
		
		// pane 1 - identification
		
				let auth = this.controls.auth.display('textcolor-light');
				let checkin = this.controls.checkin.display('textcolor-light');
				let capps = this.controls.capps.display('textcolor-light');
				let vselect = this.controls.vselect.display('textcolor-light');
				
			let s1 	= '<div class="" style="">'+this.controls.progress.display(1)+'</div>';
			let authpane 	= '<div id="'+this.eids.auth+'" class="" style="">'+auth+'</div>';
			let identpane 	= '<div id="'+this.eids.checkin+'" class="" style="display:none;">'+checkin+'</div>';
			let currapps 	= '<div id="'+this.eids.capps+'" class="e-msg" style="display:none; margin:1em 0;">'+capps+'</div>';
			vselect 	= '<div id="'+this.eids.vslct+'" class="e-msg" style="display:none; margin:1em 0;">'+vselect+'</div>';
			
			let moreapp		= '<div id="'+this.eids.msgs.moreapp+'" style="display:none;">'+this.buttons.moredone.display()+'</div>';
			
			identpane = '<div id="'+this.eids.panes.p1+'" class="step-pane">'+authpane+identpane+currapps+moreapp+vselect+'</div>';
		let s1_ident = s1+identpane;
		
		
		// pane 2 - search options

			let s2 = '<div class="" style="">'+this.controls.progress.display(2)+'</div>';
			let eperf = this.state.wkcnt?'<div>'+this.controls.eperf.display()+'</div>':''; // this one is always on the screen, unless there is no workcode defined in the setup
			//console.log('this.state.wkcnt',this.state.wkcnt); 
			let infoicon = '<tr><td style="padding-top:0.5em;"><span class="fa fa-info-circle"></span></td></tr>';
			let wknotice = '<tr><td id="'+this.eids.msgs.wknotice+'" class="e-msg e-msg-warning" style="text-align:left;"></td></tr>';

			let ticketicon = '<tr><td style="padding-top:0.5em;"><span class="fa fa-tag"></span></td></tr>';
			let wkprice ='<tr><td id="'+this.eids.msgs.wkprice+'" class="" style="text-align:left;">'+'</td></tr>'; // will be filled in by this.workcodeSelect()
			let wkprepay ='<tr><td id="'+this.eids.msgs.wkdeposit+'" class="" style="text-align:left;">'+'</td></tr>';

			let wkname = '<div id="'+this.eids.msgs.wkname+'" class="e-msg bold" style="margin:0;"></div>';
			let wknote = '<div><table id="'+this.eids.msgs.wknotes+'" style="vertical-align:top; width:100%; display:none;">'+infoicon+wknotice+'</table></div>';
			let wkpricing = '<div><table id="'+this.eids.msgs.wkpricing+'" style="display:none; vertical-align:top; width:100%;">'+ticketicon+wkprice+wkprepay+'</table></div>';
			let perftip = '<div id="'+this.eids.msgs.wkwarning+'" class="perf_notes" style="display:none;">'+wkname+wknote+wkpricing+'</div>'; // see (*tt01*)

			let perfarea = eperf+perftip;
				
				
						let staff = single?'':'<span>'+this.controls.staff.display()+'</span>'; //JBO changes
						let before = '<div class="">'+this.controls.before.display()+'</div>';
			
							let withampm = !!mobminder.context.surfer.eresaWithAMPM;
						let ampm = withampm?'<div class="">'+this.controls.ampm.display()+'</div>':'';

				let soptablestaff = '<div style="margin-top:1em;">'+staff+'</div>';
				let soptablebefore = '<div style="display:block; flex-grow:1;">'+before+'</div>';
				let soptableampm = '<div style="display:block; flex-grow:1;">'+ampm+'</div>';
			
					let soptabletimepref ='<div style="display:flex; flex-wrap:wrap; gap:0.5em; margin-top:1em;">'+soptablebefore+soptableampm+'</div>';
				let soptable = soptablestaff+soptabletimepref;
			
					let bsearch = this.buttons.search.display();
				let search = '<div class="e-msg endfloat text-center text-sm-left">'+bsearch+'</div>';
			
				let chooseopt = '<div id="'+this.eids.msgs.options+'" class="e-msg" style="display:none; margin-bottom:1em;">'+'</div>'; // instruction message
			
			
				let optionspane = '<div id="'+this.eids.panes.p2+'" class="e-msg" class="step-pane">'+chooseopt+perfarea+soptable+search+'</div>';
			
			
			let s2_options = s2+optionspane;

		
		
		// pane 3 - choosing out of availabilities
		
			let s3 	= '<div class="" style="">'+this.controls.progress.display(3)+'</div>';		
				let slotshere 	= '<div class="e-msg"  id="'+this.eids.msgs.slotshere+'" style="margin-bottom:0.5em;">'+C_XL.w('slots here')+'</div>';
				let selectmsg 	= '<div class="e-msg" style="margin-bottom:1em;">'+C_XL.w('pls select')+'</div>';
				let slotspane 	= '<div id="'+this.eids.slots+'" class="e-msg" style=""></div>'; // filled with availabilities
				//let change1 	= '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+this.buttons.change1.display()+'</div>';
				let change1 = '<div class="text-right">'+this.buttons.change1.display()+'</div>';
				//let moreslots 	= !!this.days ? '': '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+this.buttons.moreslots.display()+'</div>';
				let moreslots = !!this.days ? '': '<div class="flexinner center col-12">'+this.buttons.moreslots.display()+'</div>';
			let availipane = '<div id="'+this.eids.panes.p3+'" class="e-msg" class="step-pane">'+slotshere+selectmsg+slotspane+moreslots+change1+'</div>';

		let s3_choose = s3+availipane;
		
		
		// pane 4 - confirming choice
		
		let s4 	= '<div class="" style="">'+this.controls.progress.display(4)+'</div>';	
		let overbooked = '<div id="'+this.eids.msgs.overbkmsg+'" class="e-warner" style="display:none; margin-top:1em;">'+C_XL.w('e-overbooking')+'</div>';
		//let change2 	= '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+this.buttons.change2.display()+'</div>';
		let change2 = '<div class="text-right">'+this.buttons.change2.display()+'</div>';
		let plsconfirm 	= '<div id="'+this.eids.msgs.tipconfirm+'" class="e-msg"></div>';
		let resapane 	= '<div id="'+this.eids.resa+'" class="e-msg" style=""></div>'; // filled with chosen resa info
		//let qrcode = '<div id="'+this.eids.qrcode+'" class="e-msg" style="background-color:white;display:none;z-index:0; position:absolute; top:0; bottom:0; width:100%; overflow:hidden;"></div>';
		let qrcode = '<div id="'+this.eids.qrcode+'" style="display:none;" class="e-msg centered" ></div>';
		let payinfo 	= '<div id="'+this.eids.msgs.payinfo+'" style="display:none;padding:20px 0px;" class="e-msg centered"></div>';
		//let paycancel 	= '<div class="text-right">'+this.buttons.paycancel.display({caption:C_XL.w('abandon'), css:'e-button-change', tag:'&#xf057',solid:true})+'</div>';
		let paycancel = '<div class="text-right">'+this.buttons.paycancel.display()+'</div>';
		//let confipane = '<div id="'+this.eids.panes.p4+'" class="e-msg" class="step-pane">'+plsconfirm+resapane+change2+'</div>';
		let confipane = '<div id="'+this.eids.panes.p4+'" class="e-msg" class="step-pane">'+overbooked+change2+plsconfirm+resapane+paycancel+payinfo+qrcode+'</div>';
		let s4_confirm = s4+confipane;
		
		
		// pane 5 - goodbye
		
		let note = mobminder.context.surfer.eresaNote.htmlize();
		
		let s5 	= '<div class="" style="">'+this.controls.progress.display(5)+'</div>';	
		
		let confirmmsg  = note?'<div id="'+this.eids.msgs.confirmsg+'" class="perf_notes" style="display:none; margin-top:1em;"><div class="iconinfo_before_notes" style="position:relative;">'+note+'</div></div>':'';
		
		let goodbye = '<div id="'+this.eids.goodbye+'" class="" style="display:none; margin-top:1em;">'+C_XL.w('e-goodbye')+'</div>';
		let thankpane = '<div id="'+this.eids.panes.p5+'" class="e-msg" class="step-pane">'+confirmmsg+goodbye+'</div>';

		let s5_thanks = s5+thankpane;

		let outset = '<div class="container" id="'+this.eids.outset+'">'+s1_ident+s2_options+s3_choose+s4_confirm+s5_thanks+'</div>';
		
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
		if(vbs) vlog('e-resa.js','C_eProcess','reload',''); 
		if(this.callbacks.ondone) this.callbacks.ondone.cb();
		$(this.elements.goodbye).hide();
		this.paneset(1).controls.progress.step(1).caption(1); 
		if(!this.callbacks.ondone) this.controls.progress.slideto(1); // if the callback is defined, it will probably hide this section and take care of the scrolling
		this.controls.checkin.reset();
		$(this.elements.checkin).show();
	},
	// private functions
	paneset: function(steps) { // opens a section under a step bullet, close all other sections
		let args = new Array(); for(let x=0; x<arguments.length; x++) args.push(arguments[x]);
		if(vbs) vlog('e-resa.js','C_eProcess','paneset','steps:'+args.join('-')); 
		for(let p in this.elements.panes.get) { 
			let e = this.elements.panes[p]; 
			let i = p[1]|0; 
			if(arrayHAS(args,i)) $(e).show(); else $(e).hide();
		}
		return this;
	},
	// event handling
	staff: function() { if(vbs) vlog('e-resa.js','C_eProcess','staff',''); this.controls.continued.set(0); },
	ampm: function() { if(vbs) vlog('e-resa.js','C_eProcess','ampm',''); if(this.controls) this.controls.continued.set(0); },
	before: function(date,option) { 
		let fulldate = C_XL.date(date,{abreviation:'full',weekday:true});
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
	
		//let cnt = C_dS_workcode.has({eresa:true});
		
		if(vbs) vlog('e-resa.js','C_eProcess','workcodeSelect',workcodeIdsArray); 
		let resourceIdsArrays = new Array(), timeboxingIds = new Array();
		let duration = 0; let staffsize = 1;
		
		if(!this.state.wkcnt) return; // this account has no e-resa workcodes
		
		let dS_wk;
		for(let x in workcodeIdsArray) {
			
			let wkId = workcodeIdsArray[x];
			dS_wk = C_dS_workcode.get(wkId);
			duration += dS_wk.duration;
			staffsize = Math.max(dS_wk.staffing, staffsize);
			resourceIdsArrays.push(dS_wk.expertsIds());
			timeboxingIds.push(arrayKEYS(dS_wk.tboxingIds()));
		}
		
		this.controls.duration.set(duration);
		let commonResources = arrayAND(resourceIdsArrays); // only the common resources to all workcodes
		this.controls.staff.reset(commonResources).setsize(staffsize).prevent();


		// show the notice that is linked with the selected workcode
		let hasmoney = dS_wk.price||dS_wk.deposit;
		let hasnote = !!dS_wk.note;
		// show the tooltip that is linked with the selected workcode, see (*tt01*)
		if(hasnote||hasmoney) {
			$(this.elements.msgs.wkwarning).show();
			$(this.elements.msgs.wkname).html(dS_wk.name.htmlize()).show();
			$(this.elements.msgs.wknotice).html(dS_wk.note.htmlize()).show();
		} else {
			$(this.elements.msgs.wkwarning).hide();
		}
			
		if(hasmoney) {
			let price = ''; if(dS_wk.price) price = C_XL.w('pricing')+': '+dS_wk.price/100+'€';
			let deposit = ''; if(dS_wk.deposit) deposit = C_XL.w('deposit')+': '+dS_wk.deposit/100+'€';
			
			$(this.elements.msgs.wkpricing).show();
			if(price) $(this.elements.msgs.wkprice).html(price).show(); else $(this.elements.msgs.wkprice).hide();
			if(deposit) $(this.elements.msgs.wkdeposit).html(deposit).show(); else $(this.elements.msgs.wkdeposit).hide();
		} else 
			$(this.elements.msgs.wkpricing).hide();
		
		if(hasnote) {
			$(this.elements.msgs.wknotes).show();
		} else 
			$(this.elements.msgs.wknotes).hide();
		/////////////////////////////////////////////////////////////////////////////////

		let commonTimeboxings = arrayAND(timeboxingIds); // only the common resources to all workcodes, if not compatible, all are selected
		this.controls.tboxing.set(commonTimeboxings.join('!')||'-');
		this.controls.progress.caption(2,dS_wk.name);
		this.controls.continued.set(0);
	},
	authenticated: function(email, mobile) {
		if(vbs) vlog('e-resa.js','C_eProcess','authenticated','email:'+email+', mobile:'+mobile); 
		
		this.controls.checkin.set(email, mobile);
		$(this.elements.auth).hide();
		$(this.elements.checkin).show();
		this.controls.checkin.focus();
		
		// visiId is the id of a previously existing visitor or the id of a newly created visitor.
		
	},		
	identified: function(vids, firstsignin) { // one or many visitors are indentified to be the assignees of the appointment
		
		if(vbs) vlog('e-resa.js','C_eProcess','identified','vids:'+vids.count+', firstsignin:'+firstsignin); 
		
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
			let maybookmore = true;
		this.buttons.moredone.enable({left:maybookmore});
		
		
		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		// else we have no valid visitor identified => this means that online registration is not allowed
		// this.done();
		
	}, // current appointments are loaded
	moreapp: function() { // the surfer has chosen to take one more appointment
		
		if(vbs) vlog('e-resa.js','C_eProcess','moreapp',''); 
		$(this.elements.msgs.moreapp).hide();
		$(this.elements.capps).hide();
		
			let vids = this.controls.checkin.visitors();
			let vc = 0; for(let vid in vids) vc++;
		this.controls.vselect.set(vids);
		
		if(vc>1)
			$(this.elements.vslct).show();
		else 
			this.vselected(vids); // there is only one visitor, no need to offer selection through a list
	},
	getvselectedcaption: function(visitors) { // replace the caption 'identify yourself' with the names of selected people to appoint for
		let list = '';
		for(let vid in visitors) {
			let dS_v = visitors[vid];
			list += ''+C_XL.gender(dS_v.gender, dS_v.language)+'&nbsp;'+dS_v.firstname+'&nbsp;'+dS_v.lastname+',<br/>';
		}
		list = list.substring(0, list.length - 6)
		return list;
	},
	vselected: function(visitors) { // shows current reservations and check against max allowed apps
		if(vbs) vlog('e-resa.js','C_eProcess','vselected',''); 

		this.controls.progress.caption(1,this.getvselectedcaption(visitors));

		$(this.elements.slots).show();
		return this.searchoptions();
	},
	searchoptions: function() { // STEP 2: display search options	
	
		let dSvisitor = this.controls.capps.ds();
		let msg = C_XL.w('pls options');
		this.elements.msgs.options.innerHTML = msg;
		$(this.elements.msgs.options).show();
		
		if(vbs) vlog('e-resa.js','C_eProcess','searchoptions',''); 
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
			
			let c = this.controls.continued.value(); // console.log('continued:'+c); // that is a Unix stamp
			let b = this.controls.before.getjsdate(); if(c) { b = new Date(c*1000); }
			
						// console.log('not before:'+b.getUnixTime());
			b.increment({d:this.days-1}); 
						// console.log('not after:'+b.getUnixTime());
			this.controls.limitdate.set(b.stamp());
			if(c) this.controls.continued.set(c-3600); // -3600 because at search.php side, the continued stamp gets moved to midnight next date
		}
		
			let noampm = !mobminder.context.surfer.eresaWithAMPM;
		if(noampm) this.controls.ampm.reset({callback:false}); // forces the search to ignore the visitor's own ampm preference
		// console.log(bitmap(this.controls.ampm.state.encoded));
			let c = this.controls.continued.value();
			let ampm = bitmap(this.controls.ampm.state.encoded);
		if(vbs) vlog('e-resa.js','C_eProcess','search','continued:'+c+', ampm:'+ampm+', days:'+this.days+', AMPM display:'+(!noampm)); 

		let names = {
			vselect:'visitors', eperf:'workcodes', duration:'duration', before:'before', ampm:'ampm'
			, continued:'continued', limit:'limit', limitdate:'limitdate', tboxing:'tboxing'
			, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals', size:'staffsize' }
			, options:{exceptional:'exceptional', overdays:'overdays', aggregate:'aggregate', sameday:'sameday' }
		};
		mobminder.app.post(this.controls, names, '../_assets/queries/search.php', new A_cb(this,this.slotsfresh), new A_cb(this, this.connfailed));
		C_iSLOT.flush();
	}, 
	ispayconiqenabled()
	{
		//mobminder.account.payconiqkey = '22868856-4835-4018-9130-4c7a9442ef90';
		//mobminder.account.payconiqkey = false;
		return (mobminder.account.ePayActive==1 && mobminder.account.ePayconiqKey);
	},
	ispay2enabled()
	{
		//TODO
		//mobminder.account.pay2key = '1234567890';
		//mobminder.account.pay2key = false;
		//return (mobminder.account.ePayActive==1 && mobminder.account.ePayMarketKey);
		return (mobminder.account.ePayActive==1);
		//return true;
	},
	getpaydescription(resa)
	{
		//date = 24 septembre 2022 à 15h30
		let res = C_XL.date(resa.jsDateIn, { abreviation:'full', weekday:true, time:false, time:true });
		
		//1 visitor lastname firstname
		let vids = this.controls.checkin.visitors();
		for(let vid in vids) {		
			let dS_v = vids[vid];
			res += ' - '+ dS_v.lastname + " " + dS_v.firstname;
			break;
		}

		
		//1 resource name
		res += ' - '+ resa.text.resources.b;
		
		//1 prestation name
		/*if (resa.performances.length!=0)
		{
			let dS_wk = resa.performances.find(x=>x!==undefined);
			res += ' - ' + dS_wk.name;
		}*/
		if(mobminder.account.has.workcodes) 
		{	
			res += ' - ' + resa.text.workcodes;
		}
		
		//1 account name
		res += ' - '+ mobminder.account.name

		return res;
	},
	slotclick: function(resa) {
		
		/*this.paneset(4).controls.progress.step(4, undefined, 3);
		let eresa = new C_eRESA(resa, { saved:new A_cb(this,this.newresasaved) } );
		this.controls.progress.caption(3, eresa.summary()).slideto(2);
		this.elements.slots.innerHTML = '';
		this.elements.resa.innerHTML = eresa.display(); // note field with confirm button
		eresa.activate();*/

				//console.log("slotclick="+JSON.stringify(resa));

		let amount=0;
		let paymsg=false;
		if (resa.performances.length!=0)
		{
			let dS_wk = resa.performances.find(x=>x!==undefined);
			//if(vbs) vlog('e-resa.js','C_eProcess','isworkcodepaymentenabled','price='+dS_wk.price); 		
			//if(vbs) vlog('e-resa.js','C_eProcess','isworkcodepaymentenabled','deposit='+dS_wk.deposit); 		
			if(dS_wk.deposit!=0)
			{
				amount=dS_wk.deposit;
				paymsg=C_XL.w('pay_amount')+' '+(amount/100).toFixed(2)+'€';
			}
			else
			{
				amount=0;
				paymsg=false;
			}
		}
		
		//if(vbs) vlog('e-resa.js','C_eProcess','amount','amount='+amount); 

		let price = amount>0;

		let payconiq = this.ispayconiqenabled()&&price;
		let pay2 = this.ispay2enabled()&&price;
		let confirm = (!payconiq && !pay2);
		
		let transnote = this.getpaydescription(resa);
		//console.log("transnote="+transnote);

		this.paneset(4).controls.progress.step(4, undefined, 3).caption(4,C_XL.w('e-step confirm',{cap:1}));
		
		//display note label in function of : (payment or not) AND (allow note or not)
		if (confirm)
			this.elements.msgs.tipconfirm.innerHTML = mobminder.context.surfer.eresaAllowNote ? C_XL.w('e- pls note&confirm') : C_XL.w('e- pls confirm');
		else
			this.elements.msgs.tipconfirm.innerHTML = mobminder.context.surfer.eresaAllowNote ? C_XL.w('note_payment') : C_XL.w('confirm_payment');
		
		$(this.elements.msgs.tipconfirm).show(); // show the inviation to leave a note
		$(this.elements.resa).show(); // show the confirmation note and confirm button
		$(this.elements.msgs.overbkmsg).hide(); // hides the description of a problem, see (*ep01*)
		
		this.buttons.change2.show(true);
		this.buttons.paycancel.hide(true);
		
		let eresa = new C_eRESA(resa, { saved:new A_cb(this,(confirm?this.newresasaved:this.newresasavedandpay)), failed:new A_cb(this,this.overbooking) },{ confirm:confirm,payconiq:payconiq,pay2:pay2,amount:amount,transnote:transnote,paymsg:paymsg } );
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
		
		//comment by bsp, does nothing
		/*let resa = false;
		for(id in dataSets['C_dS_reservation']) 
		{ 
			resa = dataSets['C_dS_reservation'][id]; 
			break; 
			//anyway, this brings a single resa back
		}*/
		// let dSvisitor = this.controls.capps.ds();
		// dSvisitor.apps[id] = resa;
		
		$(this.elements.goodbye).hide();
		$(this.elements.msgs.confirmsg).show();
		$(this.elements.checkin).hide();
				let notelen = mobminder.context.surfer.eresaNote.length; 
				let readtime = notelen?(notelen*80+1000):2500; // the note stays on the screen for a time that is proportional to its readable length
		let handler = new A_hn({reload:new A_cb(this, this.appsummary)}); setTimeout(handler.reload, readtime);
	},
	newresasavedandpay: function(dataSets) { // SCREEN STEP 5
		if(vbs) vlog('e-resa.js','C_eProcess','newresasavedandpay',''); 
		
		//this.paneset(5).controls.progress.step(5).slideto(1);
		this.controls.progress.caption(4,C_XL.w('mobile_payment_processing'));

		//let resa = false, id;
		//for(id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		//let dSvisitor = this.controls.visi.ds();
		//dSvisitor.apps[id] = resa;

		let payment = false, id;
		for(id in dataSets['C_dS_payment']) 
		{ 
			payment = dataSets['C_dS_payment'][id]; 
			this.state.paymentid = id;
			if(vbs) vlog('e-resa.js','C_eProcess','newresasavedandpay','payment',payment); 
			break; 
		}

		
		this.buttons.change2.hide(true);

		$(this.elements.resa).hide();
		$(this.elements.msgs.tipconfirm).hide()

		
		//this.setCookie('MOBVISITORID',this.controls.visi.ds().id,5+2);
		//this.setCookie('MOBPAYMENTID',this.state.paymentid,5+2);
		//console.log("1:qrcodestring="+payment.qrcodestring);
			
		if (payment.paymean==C_dS_payment.type.payconiq)
		{
			if(!is.small) //TODO switch mobile not
			{
				//if(vbs) vlog('e-resa.js','C_eProcess','newresasavedWithPayconiq','qrcode='+payment); 
				//let qrcodegen = new e_QRcode(this.elements.qrcode,400,'../assets/themes/default/new-e-resa/assets/imgs/logo/14.jpg',0.2,0.3,'H',5);
				this.elements.msgs.payinfo.innerHTML = C_XL.w('scan_pay');
				
				//console.log("1:payment.qrcodestring="+payment.qrcodestring);
				let qrcodeshort;
				if (!payment.qrcodestring.includes('?'))
					qrcodeshort = payment.qrcodestring;
				else
					qrcodeshort = payment.qrcodestring.substr(0, payment.qrcodestring.indexOf('?')); 

				//console.log("2:qrcodeshort="+qrcodeshort);
				let qrcodegen = new e_QRcode(this.elements.qrcode,200,null,0.2,0.3,'H',5);
				qrcodegen.display(qrcodeshort);
			}
			else //smartphone
			{
				this.elements.msgs.payinfo.innerHTML = C_XL.w('mobile_payment_processing'); //clean qrcode before next booking
				this.elements.qrcode.innerHTML = '';
				
				let url = payment.qrcodestring;
				//window.open(url, '_blank');
				window.location.replace(url);
			}
			
			this.buttons.paycancel.show(true);
		}
		else //if (payment.paymean==C_dS_payment.type.cards) = cards
		{
			this.elements.msgs.payinfo.innerHTML = C_XL.w('mobile_payment_processing'); //clean qrcode before next booking
			this.elements.qrcode.innerHTML = '';
			this.buttons.paycancel.hide(true);

			let url = payment.qrcodestring;
			//console.log("computop url = "+url);
			this.openWindowWithPost(url);
		}

		$(this.elements.msgs.payinfo).show();
		$(this.elements.qrcode).show();
		
		

		//tmp solution
		//let handler = new A_hn({reload:new A_cb(this, this.closepaymentPayconiq)}); 
		//setTimeout(handler.reload, 10000);

		this.cancelhasbeenclicked = false;
		this.watchdogcounter = 0;
		let now = new Date();
		let wdname = 'payconiqdog-'+now.HHmm();
		let pollingrythm = 5;
		let wdpreset = {url:'../_assets/queries/payment.php', rythm:pollingrythm, wait:pollingrythm};
		this.watchdog = new C_iWatchdog(wdpreset, { dogstream:new A_cb(this, this.backhere),
			predog:new A_cb(this, this.predog),failure:new A_cb(this,this.backfailure) }, wdname);

	},
	openWindowWithPost: function(fullurl) 
	{
		let tfullurl = fullurl.split('?');
		let url = tfullurl[0];
		let parameters = tfullurl[1].split('&');

		let form = document.createElement("form");
		form.target = "_self";
		form.method = "POST";
		form.action = url;
		form.style.display = "none";
	
		for (i=0;i<parameters.length;i++)
		{
			let parameter = parameters[i]; 
			//console.log("parameter:"+parameter);
			let tparameter = parameter.split('=');

			let input = document.createElement("input");
			input.type = "hidden";
			input.name = tparameter[0];
			input.value = tparameter[1];
			//console.log("tparameter:"+tparameter[0]+'='+tparameter[1]);
			form.appendChild(input);
		}
	
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	predog: function() {
		return {values:{id:this.state.paymentid}, names:{id:'id'}};

	},
	// ajax feedback
	addMinutes: function(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	},
	backfailure:function(){
		if(vbs) vlog('e-resa.js','C_eProcess','backfailure'); 
		//timeout when calling /query/payement (mobminder server, no call to payconiq)
		//return true => suspend timer!
		//return true; //nothing to do...
		return false;
	},
	backhere:function(dataSets, stream) { // periodic payconiqdog callback
		if(vbs) vlog('e-resa.js','C_eProcess','backhere','dataSets=',stream); 
		
		this.watchdogcounter ++;
		if (this.watchdogcounter>=84) //= 7min * 12 (60s/5s) = 84 (7 min = 5 min for prebooking timeout + 2 (margin))
		{
			//console.log("cancelhasbeenclicked = true! watchdogcounter="+this.watchdogcounter);
			return true;
		}

		if (this.cancelhasbeenclicked) 
		{
			//need to stop watchdog (error message is displaied in paycancel api callback)
			//console.log("cancelhasbeenclicked = true! no backhere!!!!");
			return true;
		}

		let payment = false, id;
		for(id in dataSets['C_dS_payment']) 
		{ 
			payment = dataSets['C_dS_payment'][id]; 
			//this.state.paymentid = id;
			//if(vbs) vlog('e-resa.js','C_eProcess','backhere','payment',payment); 
			break;
		}
		
		if (!payment)
		{
			//this.watchdog.suspend(true);
			//if(vbs) vlog('e-resa.js','C_eProcess','backhere','payment not found'); 
			//payment is deleted (obsolete) by payconiq callback and if rdv is deleted in webapp!
			let message = C_XL.w('payment_cancelled'); 
			this.closepaymentPayconiqWithError(message,null);
			return true;
		}

		//payment found!----------------
		
		let resa = false, resaid;
		for(resaid in dataSets['C_dS_reservation']) { 
			resa = dataSets['C_dS_reservation'][resaid]; 
			break;
		}

		if (resa.deletorId!=0)
		{
			let message = C_XL.w('payment_cancelled'); 
			this.closepaymentPayconiqWithError(message,resa);
			return true;
		}
		if(payment.transtatus==C_dS_payment.status.code.pending)
		{
			let dcreated = jsDateFromUnixTime(payment.created);
			let dcompare = this.addMinutes(new Date(),-(5+2));
			//console.log("dcreated="+dcreated);
			//console.log("dcompare="+dcompare);

			if(dcreated.isbefore(dcompare)) 
			{
				//this.watchdog.suspend(true);
				if(vbs) vlog('e-resa.js','C_eProcess','backhere','pending but timeout!'); 
				let message = C_XL.w('payment_cancelled'); 
				this.closepaymentPayconiqWithError(message,resa);
				return true;
			}
			else
			{
				if(vbs) vlog('e-resa.js','C_eProcess','backhere','pending => waiting...'); 
				//waiting next payconiq watch dog
				return false;
			}
		}
		else if(payment.transtatus==C_dS_payment.status.code.success)
		{
			//this.watchdog.suspend(true);
			if(vbs) vlog('e-resa.js','C_eProcess','backhere','success'); 
			
			//let dSvisitor = this.controls.visi.ds();
			//dSvisitor.apps[resaid] = resa;

			/*
			//remove prebooking, otherwise the new rdv is not displayed in summary list
			let prebs = dSvisitor.prebs;
			for(let prebid in prebs)
			{
				if (prebs[prebid].reservationId==resaid) 
				{
					prebs.splice(prebid,1);
					break;
				}
			}*/

			this.closepaymentPayconiq();
			return true;
		}
		else
		{
			//this.watchdog.suspend(true);
			if(vbs) vlog('e-resa.js','C_eProcess','backhere','failure'); 
			let message = C_XL.w('payment_cancelled'); //+this.translatePayconiqStatus(payment.opstatus);
			this.closepaymentPayconiqWithError(message,resa);
			return true;
		}

	},
	/*translatePayconiqStatus(status)
	{
		if (status=='AUTHORIZATION_FAILED') return "AUTHORIZATION_FAILED";
		if (status=='CANCELLED') return "CANCELLED";
		if (status=='EXPIRED') return "EXPIRED";
		if (status=='FAILED') return "FAILED";
		else return status;
	},*/
	closepaymentPayconiq: function(){
		this.paneset(5).controls.progress.step(5).slideto(1);
		this.controls.progress.caption(4,C_XL.w('confirmed',{cap:1}));
		this.state.duplicate = false;
		
		if(vbs) vlog('e-resa.js','C_eProcess','closepaymentPayconiq',''); 
		
		this.elements.msgs.payinfo.innerHTML= '';
		$(this.elements.msgs.payinfo).hide();
		
		this.elements.qrcode.innerHTML = ''; //clean qrcode before next booking
		$(this.elements.qrcode).hide();
		
		//$(this.elements.buttons.paycancel).hide(true);
		this.buttons.paycancel.hide(true);

		$(this.elements.goodbye).hide();
		$(this.elements.msgs.confirmsg).show();
		$(this.elements.ident).hide();
		
		let notelen = mobminder.context.surfer.eresaNote.length; 
		let readtime = notelen?(notelen*80+1000):2500; // the note stays on the screen for a time that is proportional to its readable length
		let handler = new A_hn({reload:new A_cb(this, this.appsummary)}); setTimeout(handler.reload, readtime);
	},
	closepaymentPayconiqWithError: function(message,resa){
		
		this.elements.msgs.payinfo.innerHTML= '';
		$(this.elements.msgs.payinfo).hide();
		
		this.elements.qrcode.innerHTML = ''; //clean qrcode before next booking
		$(this.elements.qrcode).hide();

		//$(this.elements.buttons.paycancel).hide();
		this.buttons.paycancel.hide(true);

		this.displayErrorInformation(message);

		if (!resa)
		{
			let notelen = mobminder.context.surfer.eresaNote.length; 
			let readtime = notelen?(notelen*80+1000):2500; // the note stays on the screen for a time that is proportional to its readable length
			let handler = new A_hn({reload:new A_cb(this, this.appsummary)}); setTimeout(handler.reload, readtime);
		}
		else
		{
			//force id to 0 because we want a NEW reservation!!
			resa.id=0;
			
			let notelen = mobminder.context.surfer.eresaNote.length; 
			let readtime = notelen?(notelen*80+1000):2500; // the note stays on the screen for a time that is proportional to its readable length
			let handler = new A_hn({reload:new A_cb(this, this.slotclick,resa)}); setTimeout(handler.reload, readtime);
		}
		

	},
	displayErrorInformation: function(message){
		// this.paneset(5).controls.progress.step(5).slideto(1);
		this.controls.progress.caption(4,C_XL.w('e-problem',{cap:1})); // change the step 4 title to indicate the problem
		// this.state.duplicate = false;

		if(vbs) vlog('e-resa.js','C_eProcess','displayErrorInformation','stream:'+message);

		$(this.elements.msgs.tipconfirm).hide(); // hide the inviation to leave a note, see (*ep01*)
		$(this.elements.resa).hide(); // hides the confirmation note and confirm button

		this.elements.msgs.overbkmsg.innerHTML = message;

		$(this.elements.msgs.overbkmsg).show(); // display the description of the problem
		// $(this.elements.ident).hide();
		
	},
	paycancel: function()
	{
		if(vbs) vlog('e-resa.js', 'C_eProcess', 'paycancel', '');
		
		this.cancelhasbeenclicked = true;

		//this.setbuttonbusy(true);
		
		this.buttons.paycancel.busy(true);
		
		//$(this.elements.buttons.paycancel).hide()
		
		//if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		let id = new C_iPASS(this.state.paymentid);
		this.controls['id']=id;

		let paymean = new C_iPASS(C_dS_payment.type.payconiq);
		this.controls['paymean']=paymean;

		let names = { id:'id', paymean:'paymean'};
		mobminder.app.post(this.controls, names, '../_assets/delete/payment.php', new A_cb(this,this.connsucceedforcancelpayment), new A_cb(this,this.connfailedforcancelpayment));
		
	},
	connsucceedforcancelpayment: function()
	{
		if(vbs) vlog('e-resa.js', 'C_eProcess', 'connsucceedforcancelpayment', '');
		//this.watchdog.suspend(true);

		this.buttons.paycancel.busy(false);
		
		let message = C_XL.w('payment_cancelled');
		this.closepaymentPayconiqWithError(message,null);
		
	},
	overbooking: function(stream) {
		
		let message;
		if (stream.startsWith("PayconiqError"))
		{
			message = C_XL.w('payment_cancelled'); // "Une erreur Payconiq est survenue";
		}
		else
		{
			message = C_XL.w('e-overbooking');
		}
		
		this.displayErrorInformation(message);
	},
	appsummary: function() { // heads back to step 1 after a new appointment was taken
		if(vbs) vlog('e-resa.js', 'C_eProcess', 'appsummary', '');
		this.paneset(1).controls.progress.step(1).caption(2).caption(3).caption(4).caption(5).slideto(1);
		
		
	},
	appdeleted: function() {
		if(vbs) vlog('e-resa.js','C_eProcess','appdeleted',''); 
	},
	done: function() {  // SCREEN STEP 5 // the surfer has chosen NOT to take more appointment
		if(vbs) vlog('e-resa.js','C_eProcess','done',''); 
		$(this.elements.msgs.moreapp).hide();
		this.paneset(5).controls.progress.step(5).slideto(5);
		$(this.elements.goodbye).show();
		$(this.elements.msgs.confirmsg).hide();
		let handler = new A_hn({reload:new A_cb(this, this.reload)}); setTimeout(handler.reload, 8000);
	},
	change: function() {
		if(vbs) vlog('e-resa.js','C_eProcess','change',''); 
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
		
		//bsp : hide previous section
		//this.paneset(2,3).controls.progress.step(3).caption(3).slideto(3);
		this.paneset(3).controls.progress.step(3).caption(3).slideto(3);
		
		let virtualid = -1, cueLast = 0;
		for(id in inlineDataSets['C_dS_reservation']) {
			//this.state.duplicate = { replan:replan, note:resa.note, ccsscolor:resa.cssColor, ccsspattern:resa.cssPattern };
			let resa = inlineDataSets['C_dS_reservation'][id];
			if(this.state.duplicate) {
				resa.note = this.state.duplicate.note;
				resa.cssColor = this.state.duplicate.ccsscolor;
				resa.cssPattern = this.state.duplicate.ccsspattern;
				resa.replan = this.state.duplicate.replan;
			}
			// relink visitor (there is always a visitor via web, at least one)
			let va = this.controls.vselect.getpost().split('!');
			for(let x in va) {
				let dS_attv = new C_dS_att_visitor('slots', [virtualid--, id, class_visitor, va[x]]);
				//console.log(dS_attv);
			}
			
			// relink workcode
			if(this.state.wkcnt)
				new C_dS_performance('slots', [virtualid--, id, this.controls.eperf.value(), this.controls.capps.ds().id ]);
			
			resa.rmeta();
			new C_iSLOT(this.eids.slots, resa, { selected:new A_cb(this, this.slotclick) } );
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
		}
			
		if(this.days) { 
				let c = this.controls.continued.value(); 
				let b = this.controls.before.getpost(); 
				let s = c ? c+3600 : b;
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
	},
	//call in return url mode
	//same as activate function but go directly to terminated section (5)
	activateforreturnurl: function() {
		if(vbs) vlog('e-resa.js','C_eProcess','activateAndTerminate',''); 

		this.elements.collect(this.eids);
		this.state.initializing = true;
		this.controls.activate('C_eProcess');
		this.buttons.activate();
		this.workcodeSelect([this.controls.eperf.value()]);
		
		//get returnVistiorId
		//let visiids = mobminder.app.state.returnVisitorId;
		let ids = mobminder.app.state.returnVisitorId;
		let resaid =  mobminder.app.state.returnResaId;
		
		//load visitor and reservations from server + callback
		//let id			= new C_iPASS({id:this.dataSet.id, archived:0, peerId:0, bank:'visiapps', amount:this.state.amount,transnote:this.state.transnote,preb:5});
		//let names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id', archived:'archived', peerId:'peerId', bank:'bank', preb:'preb',amount:'amount',transnote:'transnote' }
	
		let ctls = new A_ct({id:new C_iPASS({resaid4payment:resaid,ids:ids})});
		let names = {id:{resaid4payment:'resaid4payment',ids:'ids'}};
		mobminder.app.post(ctls, names, '../_assets/eresa2/reload.php', new A_cb(this,this.visidataforreturnurl), new A_cb(this, this.connfailedforreturnurl));

		this.state.initializing = false;

	},
	//asynchronous callback after return url activate
	visidataforreturnurl: function(inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check

		let visitors = inlineDataSets['C_dS_visitor']; // there is a unique match to an email or mobile
		this.controls.checkin.state.visitors = visitors;
		
		//console.log("visitors="+JSON.stringify(visitors));

		
		//retrieve reservations from dataset
		let apps = inlineDataSets['C_dS_reservation'];

		//find selected payment in dataset base on given resaid4payment
		let resaid4payment = mobminder.app.state.returnResaId;
		let payment = false, id;
		let payments = inlineDataSets['C_dS_payment'];
		for(id in payments) 
		{ 
			let looppayment = payments[id]; 
			if (looppayment.groupId == resaid4payment)
			{
				payment = looppayment;
				break;
			}
		}
		
		if (!payment)
		{
			if(vbs) vlog('e-resa.js','e_MOB','visidataforreturnurl','payment not found for resa (resaid='+mobminder.app.state.returnResaId+')');
			mobminder.app.state.returnVisitorId=0;
			mobminder.app.state.returnResaId=0;
			this.reload();
			//shows page after data has been loaded
			//hide has been hidden by done at e_MOB constructor
			$(document.body).show();
			return ;
		}

		this.state.paymentid = payment.id; //need by polling call
		let resa = apps[resaid4payment];
		if (!resa)
		{
			if(vbs) vlog('e-resa.js','e_MOB','visidataforreturnurl','rdv not found (id='+resaid+')');
			mobminder.app.state.returnVisitorId=0;
			mobminder.app.state.returnResaId=0;
			this.reload();

			//shows page after data has been loaded
			//hide has been hidden by done at e_MOB constructor
			$(document.body).show();
			return;
		}

			
		//TODO faut recuperer les visiteurs qui sont des attendeevisitor
		let vids = [];
		let attvisitors = inlineDataSets['C_dS_att_visitor'];
		//console.log("resaid4payment="+resaid4payment);
		for(let idattvisitor in attvisitors) 
		{ 	
			let attvisitor = attvisitors[idattvisitor]; 
			//console.log("idattvisitor="+attvisitor.id+",resaId="+attvisitor.resaId);
			if (attvisitor.resaId == resaid4payment)
			{
				vids[attvisitor.resourceId] = visitors[attvisitor.resourceId];
			}
		}
		this.controls.vselect.set(vids);
		

		this.paneset(4);

		//display step1 title = visitor name
		//this.controls.progress.step(1).caption(1,visitor.firstname+'&nbsp;'+visitor.lastname);
		let caption = this.getvselectedcaption(vids);
		//console.log("caption="+caption);
		this.controls.progress.caption(1,caption);

		//display step2 title = workcode name
		let workcodenames = joinnames(resa.performances);
		this.controls.progress.step(2).caption(2,workcodenames);

		//display step3 title = rdv date
		let date = C_XL.date(resa.jsDateIn, {abreviation:'full', weekday:true, year:!is.small });
		let cin = resa.jsDateIn.HHmm();
		let cout = resa.jsDateOut.HHmm();
		let summary =  date+', '+C_XL.w('fromtime',{cap:0})+'&nbsp;'+cin+'&nbsp;'+C_XL.w('to',{cap:0})+'&nbsp;'+cout;
		this.controls.progress.step(3).caption(3,summary); 

		//display step4 title = confirmed
		this.controls.progress.step(4).caption(4,C_XL.w('mobile_payment_processing'));
		//this.controls.progress.caption(4,'en attente de paiement'); 

		//this.controls.progress.step(5); //.caption(5,C_XL.w('confirmed',{cap:1})); 

		//display confirm message after title5
		$(this.elements.msgs.confirmsg).show();

		//wait X secondes before go back to step1
		//let notelen = mobminder.context.surfer.eresaNote.length; 
		//let factor = 1.5; //wait a little bit more than classic reservation because page is called from payment app
		//let factor = 1;
		//let readtime = (notelen?(notelen*80+1000):2500)*factor; // the note stays on the screen for a time that is proportional to its readable length
		//let handler = new A_hn({reload:new A_cb(this, this.appsummary)}); setTimeout(handler.reload, readtime);
		
		//force hide ident, otherwise checkin fields are shown???
		$(this.elements.ident).hide();

		
		//partie gui////////////////////////////////////////////////////////////////////////////
		this.buttons.change2.hide(true);
		//$(this.elements.buttons.change2).hide();

		$(this.elements.resa).hide();
		$(this.elements.msgs.tipconfirm).hide()

		if (payment.paymean==C_dS_payment.type.payconiq)
		{
			if(!is.small)
			{
				//if(vbs) vlog('e-resa.js','C_eProcess','newresasavedWithPayconiq','qrcode='+payment); 
				//let qrcodegen = new e_QRcode(this.elements.qrcode,400,'../assets/themes/default/new-e-resa/assets/imgs/logo/14.jpg',0.2,0.3,'H',5);
				this.elements.msgs.payinfo.innerHTML = C_XL.w('scan_pay');

				let qrcodeshort;
				if (!payment.qrcodestring.includes('?'))
					qrcodeshort = payment.qrcodestring;
				else
					qrcodeshort = payment.qrcodestring.substr(0, payment.qrcodestring.indexOf('?')); 

				//console.log("2:qrcodeshort after refresh="+qrcodeshort);
				let qrcodegen = new e_QRcode(this.elements.qrcode,200,null,0.2,0.3,'H',5);
				qrcodegen.display(qrcodeshort);
			}
			else
			{
				this.elements.msgs.payinfo.innerHTML = C_XL.w('mobile_payment_processing');
				this.elements.qrcode.innerHTML = '';
			}
			this.buttons.paycancel.show(true);
		}
		else //cards
		{
			this.elements.msgs.payinfo.innerHTML = C_XL.w('mobile_payment_processing');
			this.elements.qrcode.innerHTML = '';
			this.buttons.paycancel.hide(true);
		}

		$(this.elements.msgs.payinfo).show();
		$(this.elements.qrcode).show();
		

		//start polling////////////////////////////////////////////////////////////////////////
		this.cancelhasbeenclicked = false;
		this.watchdogcounter = 0;
		let now = new Date();
		let wdname = 'payconiqdog-'+now.HHmm();
		let pollingrythm = 5;
		let wdpreset = {url:'../_assets/queries/payment.php', rythm:pollingrythm, wait:0};
		this.watchdog = new C_iWatchdog(wdpreset, { dogstream:new A_cb(this, this.backhere),
			predog:new A_cb(this, this.predog),failure:new A_cb(this,this.backfailure) }, wdname);

		//shows page after data has been loaded
		//hide has been hidden by done at e_MOB constructor
		$(document.body).show();
	},
	connfailedforreturnurl: function(){},
	
	connfailedforcancelpayment: function(){
		this.buttons.paycancel.busy(false);
	}
}


