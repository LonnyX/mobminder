
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
// Basic Flow:
//
// 		BF 1: Enter email (email is correct, and recognized in visitors register)
//		BF 2: Introduce PIN code sent on email address (the PIN is correctly entered)
// 		BF 3: Select performance or care
// 		BF 4: Choose from displayed availabilities
// 		BF 5: Confirm
// 
// Alternative Flow 1: (the email adress is not recognized)
//
//		AF1-1: Re-enter email, mobile, and birthdate (email is correct, or mobile is unique in visitors register)
//		AF1-2: -reconnect to BF 2
// 
// Alternative Flow 2: (the email adress nor mobile are recognized)
//
//		AF2-1: Fill in registration a form
//		AF2-2: -reconnect to BF 2 (if the PIN is correctly entered, the visitor's file is created)
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//     Production : https://agenda.mobminder.com/dumont
//
//                      (url re-writing)  => be.mobminder.com/e-resa.php?p=dumont
//
//



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E G I S T R A T I O N     F O R M 
//
C_eREG = function(eid, callbacks, preset) {
	this.dataSet = new C_dS_visitor();
	this.callbacks = callbacks || {}; // like { valid: }
	let b = 'eReg_';
	this.eids = { id:b+'id', gender:b+'gender', fname:b+'fname', lname:b+'lname', mobile:b+'mobile'
					, addr:b+'addr', zip:b+'zip', city:b+'city', country:b+'country', phone:b+'phone'
					, save:b+'save', optin:b+'optin', warn:b+'warn' };
	this.elements = new A_el();
	this.state = C_eREG.defaults.align(preset);
		
	let shortform = this.state.shortform;
	
	let typing = new A_cb(this, this.typing, null, null, 1000); //1000
	let typingfn = new A_cb(this, this.typingfn, null, null, 800); /* special cast for firstname whom we will try to guess the gender from */
	
	let id			= new C_iPASS(this.dataSet.id);
	
		
	// let gender		= new C_iDDWN(this.eids.gender, {}, { labels:C_XL.w(genders.english) }, { value:this.dataSet.gender, maxcols:1, maxrows:1 }  );
	//let gender		= new C_iCRESTA(this.eids.gender, {}, { labels:{ 0:C_XL.w(genders.english[0]), 1:C_XL.w(genders.english[1]) } }, { value:this.dataSet.gender, skin:0, title:false, mode:-1, value:0, maxrows:1 }  );
	
	let gender		= new C_iCRESTA(this.eids.gender, {}, { labels:{ 0:C_XL.w('gender_0'), 1:C_XL.w('gender_1') } }, { value:this.dataSet.gender, skin:0, title:false, mode:-1, value:0, maxrows:1 }  );

	let lname 		= new C_iFIELD(this.eids.lname, { onfchange:typing }, { digits:this.dataSet.lastname, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('lastname') });
	let fname 		= new C_iFIELD(this.eids.fname, { onfchange:typingfn }, { digits:this.dataSet.firstname, type:INPUT_TEXT, mandatory:true, placeholder:C_XL.w('firstname') });
	let mobile 		= new C_iFIELD(this.eids.mobile, { onfchange:typing }, { digits:this.dataSet.mobile, type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile') });

	let addr 		= new C_iFIELD(this.eids.addr, { onfchange:typing }, { digits:this.dataSet.address, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('address') });
	let zip 		= new C_iFIELD(this.eids.zip, { onfchange:typing }, { digits:this.dataSet.zipCode, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('zipCode') });
	let city 		= new C_iFIELD(this.eids.city, { onfchange:typing }, { digits:this.dataSet.city, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('city') });
	let country		= new C_iFIELD(this.eids.country, { onfchange:typing }, { digits:this.dataSet.country, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('country') });
	let phone 		= new C_iFIELD(this.eids.phone, false, { digits:this.dataSet.phone, type:INPUT_PHONE, mandatory:false, placeholder:C_XL.w('phone') });

	let optin 		= new C_iONOFF(this.eids.optin, { onswitch:new A_cb(this, this.onoptin, null, null, 1000) }, { state:0, mandatory:true } );

	//let save 		= new C_iBUTTON(this.eids.save, new A_cb(this, this.onsave), { caption:C_XL.w('i sign in'), hidden:!this.state.savebutton, enabled:false } );
	let save 		= new C_iCLIK(this.eids.save, { click:new A_cb(this, this.onsave) }, { hidden:!this.state.savebutton, enabled:false, tag:'div', ui:C_XL.w('i sign in'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	let email		= new C_iPASS(''); // programmaticaly preset
	let bdate		= new C_iPASS('');
	
	this.controls = new A_ct( { optin:optin, save:save, id:id, email:email, bdate:bdate, gender:gender, fname:fname, lname:lname, mobile:mobile, addr:addr, zip:zip, city:city, country:country, phone:phone} );
	this.state = { valid:false };
}
C_eREG.defaults = new A_df( { savebutton:false, shortform:false } );
C_eREG.prototype = { 
	// public
	display: function(css) {
	
		// coordinates left side
		let gender 	= '<div>'+this.controls.gender.display()+'</div>';
		
		let fname 	= '<div>'+this.controls.fname.td()+'</div>';
		let lname 	= '<div>'+this.controls.lname.td()+'</div>';
		let mobile 	= '<div>'+this.controls.mobile.td()+'</div>';
		let phone 	= '<div>'+this.controls.phone.td()+'</div>';
		
		// coordinates right side
		let addr 	= '<div>'+this.controls.addr.td()+'</div>';
		let zip 	= '<div>'+this.controls.zip.td()+'</div>';
		let city 	= '<div>'+this.controls.city.td()+'</div>';
		let country = '<div>'+this.controls.country.td()+'</div>';
		
		//let coordsLeft = '<table class="v-coords" style="float:left;">'+lname+fname+mobile+phone+'</table>';
		//let coordsRight = '<table class="v-coords" style="clear:right;">'+addr+zip+city+country+'</table>';
		let coords = '<div class="v-coords">'+lname+fname+gender+mobile+phone+addr+zip+city+country+'</div>';
		
		let prvpol = '<br><a style="text-decoration:underline;" target="_blank" href="../_assets/queries/privacy.php?k='+mobminder.context.keyId+'">'+C_XL.w('read privacy')+mobminder.account.name+'</a>';
		let optinlbl = '<span class="e-msg" style="margin-left:1em;">'+C_XL.w('pls opt in')+' '+prvpol+'</span>';
		let opswitch = this.controls.optin.display();
		let optin = '<div class="" style="margin:2em 0 0 0;">'+opswitch+optinlbl+'</div>';
		
		let warn = '<div class="e-msg e-warner" id="'+this.eids.warn+'" style="display:none; text-align:left;">'+C_XL.w('warn red field')+'</div>';
			
		//let save = '<div class="e-msg text-center text-sm-left">'+this.controls.save.display({css:'e-button'})+'</div>';
		let save = '<div class="e-msg text-center text-sm-left">'+this.controls.save.display()+'</div>';
		
		return coords+optin+warn+save;
	},
	activate: function() {	
		this.elements.collect(this.eids);
		this.controls.activate('C_eREG'); return this;	
		this.state.valid = this.controls.isvalid();
	},
	setemail: function(email) { this.controls.email.set(email); },
	setmobile: function(mobile) { this.controls.mobile.set(mobile); },
	setbdate: function(bdate) { this.controls.bdate.set(bdate); },
	save: function() { // programmaticaly trigger a save
		let names = { id:'id', email:'email', bdate:'birthday', gender:'gender', fname:'firstname', lname:'lastname', mobile:'mobile', addr:'address', zip:'zipCode', city:'city', country:'country', phone:'phone'};
		mobminder.app.post(this.controls, names, '../_assets/post/visitor.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	focus: function() { this.controls.lname.focus(true); },
	
	// private

	// event handling
	typing: function() {
		let optin = !!this.controls.optin.value(); // which is [0,1] turned into [false,true]
		let newstate = this.controls.isvalid() && optin;
		if(newstate!=this.state.valid) {
			//this.validform(newstate);
			if(this.callbacks.valid) this.callbacks.valid.cb(newstate);
			this.controls.save.enable(newstate);
		}
		this.state.valid = newstate;
		if(newstate) $(this.elements.warn).hide();
		else $(this.elements.warn).show();
	},
	typingfn: function(d) {
		let names = { fname:'name' };
		mobminder.app.post(this.controls, names, '../_assets/queries/gender.php', new A_cb(this,this.gender), new A_cb(this,this.failed));

		return this.typing(d);
	},
	remove: function() { },
	escape: function() { return true; },
	onoptin: function(state) { 
		if(vbs) vlog('e-resa.js','C_eREG','onoptin','state:'+state); 
		this.typing(); // recalculates this.state.valid
	},
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







C_eCheckIn = function(eid, callbacks) { // authenticates or register a visitor
	this.classname = 'C_eCheckIn';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { identified }
		let tokenauth = (mobminder.context.surfer.eresaAuthent==1 || mobminder.context.surfer.eresaAuthent==2);
		let patients = mobminder.account.visitorAlias==mobminder.visitor.codes.patient;
	this.has = { tokenauth:tokenauth, patients:patients };
	
		if(vbs) vlog('e-resa.js','C_eCheckIn','constructor','token authentication:'+tokenauth+', patients:'+patients); 

	this.eids = { 	own: { div:eid+'_div_all', welcome:eid+'_div_welc', badtoken:eid+'_div_bad'
							, email:eid+'_div_email', mobile:eid+'_div_mobl', bdate:eid+'_div_bdate', bident:eid+'div_bident'
							, msg:eid+'_div_msg', warn:eid+'_div_warn', form:eid+'_div_form', token:eid+'_div_token', demo:eid+'_div_demo' },
					controls: { email:eid+'_email', mobile:eid+'_mobl', bdate:eid+'_bdate', registr:eid+'_registr', token:eid+'_token' },
					buttons: { ident:eid+'_ident', signin:eid+'_sign'}
				};
				
	let email 	= new C_iFIELD(this.eids.controls.email, {  onfchange:new A_cb(this, this.emailtype ), onenterkey:new A_cb(this, this.emailenterkey ) }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email') });
	let mobile 	= new C_iFIELD(this.eids.controls.mobile, { onfchange:new A_cb(this, this.mobiletype ), onenterkey:new A_cb(this, this.emailenterkey ) }, { digits:'', type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile') });
	let bdate 	= new C_iFIELD(this.eids.controls.bdate, { onfchange:new A_cb(this, this.bdatetype ), onenterkey:new A_cb(this, this.emailenterkey ) }, { type:INPUT_BDATE, mandatory:this.has.patients, placeholder:C_XL.w('dd-mm-yyyy',{cap:0})});
	
	//let ident 	= new C_iBUTTON(this.eids.buttons.ident, new A_cb(this, this.ident), {caption:C_XL.w('identify me'), enabled:false } );
	let ident =  new C_iCLIK(this.eids.buttons.ident, { click:new A_cb(this, this.ident) }, { enabled:false, tag:'div', ui:C_XL.w('identify me'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );
	
	//let signin 	= new C_iBUTTON(this.eids.buttons.signin, new A_cb(this, this.signin), {caption:C_XL.w('i sign in'), hidden:true } );
	//let butt =  new C_iCLIK(this.eids.butt, { click:new A_cb(this, this.token) }, { enabled:false,tag:'div', ui:C_XL.w('toketoken validaten'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	let registr = new C_eREG(this.eids.controls.registr, { valid:new A_cb(this,this.validregform), saved:new A_cb(this,this.newvisisaved) }, { savebutton:!this.has.tokenauth, shortform:!this.has.patients } );
	let token 	= new C_eToken(this.eids.controls.token, { checked:new A_cb(this,this.tokenchecked) } );
	
	this.controls = new A_ct({email:email, mobile:mobile, bdate:bdate, registr:registr, token:token});
	this.buttons = new A_ct({ident:ident}); //signin:signin
	this.appointments = new A_ct();
	
	this.state = { visitor:false, faillevel:0, valid:{email:false, mobile:false, bdate:false} };
}
C_eCheckIn.prototype = {
	
	// register form
	display: function() {
		
		let postbd = '', postmobile = '';
		if(is.browser.MSIE) { // MSIE bullshit filling (has no placeholder)
			postmobile = '<span style="color:silver;">'+C_XL.w('mobile')+'</span>';
			postbd = '<span style="color:silver;">'+C_XL.w('dd-mm-yyyy',{cap:0})+'</span>';
		}
			let welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'" 	style="">'+C_XL.w('e-welcome')+'</div>';
			let bad 	= '<div class="e-msg" id="'+this.eids.own.badtoken+'" 	style="display:none;">'+C_XL.w('bad token')+'</div>';
			let email 	= '<div class="e-msg" id="'+this.eids.own.email+'" 		style="">'+this.controls.email.display('alpha20')+'</div>';//+this.buttons.signin.display({css:'e-button'})
			let mobile 	= '<div class="e-msg" id="'+this.eids.own.mobile+'" 	style="display:none;">'+this.controls.mobile.display('alpha16')+postmobile+'</div>';
			let bdate 	= '<div class="e-msg" id="'+this.eids.own.bdate+'" 		style="display:none;">'+this.controls.bdate.display('alpha16')+postbd+'</div>';
			//style="text-align:center; margin:2em 0 0 0; width:100%; max-width:40em; display:inline-block;"
			
			//let bident 	= '<div class="text-center text-sm-left" id="'+this.eids.own.bident+'">'+this.buttons.ident.display({css:'e-button'})+'</div>';
			let bident = '<div class="text-center text-sm-left" id="'+this.eids.own.bident+'">'+this.buttons.ident.display()+'</div>';
			
			let msg 	= '<div class="e-msg" id="'+this.eids.own.msg+'" 		style="display:none;">'+'</div>';
			let warn 	= '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="width:100%; text-align:left;display:inline-block;">'+C_XL.w('warn red field')+'</div>';
			let form 	= '<div class="e-msg" id="'+this.eids.own.form+'" 		style="display:none;">'+this.controls.registr.display()+'</div>';
			let token 	= '<div class="" id="'+this.eids.own.token+'" 			style="display:none;">'+this.controls.token.display()+'</div>';
			let demo 	= '<div class="" id="'+this.eids.own.demo+'" 			style="display:none;">'+'</div>';
		let div = '<div id="'+this.eids.own.div+'">'+welcome+bad+msg+email+mobile+bdate+warn+bident+form+token+demo+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('C_eCheckIn');
		this.buttons.activate('C_eCheckIn');
		this.controls.email.focus(true);
	},
	reset: function() {
		this.state = { visitor:false, faillevel:0, valid:{email:false, mobile:false, bdate:false} };
		
		this.controls.email.clear(); this.controls.mobile.clear(); this.controls.bdate.clear(); this.controls.token.reset();
		$(this.elements.welcome).show();
		this.buttons.ident.show(true); this.buttons.ident.caption(C_XL.w('identify me')); $(this.elements.bident).show();
		$(this.elements.email).show(); $(this.elements.dident).show(); this.controls.email.focus(true);
	},
	
	// private
	checkedin: function(dSvisitor) { // e-resa STEP 1: a unique visitor match is found
		this.state.visitor = dSvisitor;
		
		
		$(this.elements.bident).hide(); 
		$(this.elements.email).hide().blur(); 
		$(this.elements.mobile).hide().blur(); 
		$(this.elements.bdate).hide().blur();
			//let msg = C_XL.w('hello')+'&nbsp;<strong>'+dSvisitor.firstname+'&nbsp;'+dSvisitor.lastname+'</strong>,';
			let msg = C_XL.w('hello')+','; //+'&nbsp;<strong>'+dSvisitor.firstname+'&nbsp;'+dSvisitor.lastname+'</strong>,'; //Hidden for GDPR
		this.elements.msg.innerHTML = msg;
		$(this.elements.msg).show();
	
		if(!mobminder.context.surfer.eresaAuthent) 
			this.tokenchecked(true); // no active authentication shortcut the token authentication
		else 
		{ 
			let email = this.controls.email.value();
			this.controls.token.setemail(email);
			
			$(this.elements.token).show(); 
			this.controls.token.focus(); 
		} // check the token sent on email or mobile
	},
	checkfailed: function() { // e-resa STEP 1: callback from email check, no unique email match was found
		this.state.visitor = false;
		let m = '';
		switch(++this.state.faillevel) {
			
			case 1: // in first instance, we ask for email again, mobile and bdate.
					m+= '<br/>'+C_XL.w('retype email');
					m+= '<br/>'+C_XL.w('fill gsm&bdate');
				this.elements.msg.innerHTML = m;
				this.buttons.ident.caption(C_XL.w('continue'));
				$(this.elements.mobile).show();
				$(this.elements.bdate).show();
				$(this.elements.msg).show();
				this.controls.mobile.focus(true);
				this.validident();
				break;
			default: // in second instance, we ask for filling in a registration form
				
				this.buttons.ident.show(false);
				$(this.elements.email).hide();
				$(this.elements.bident).hide();
				$(this.elements.mobile).hide();
				$(this.elements.bdate).hide();
				
				if(mobminder.context.surfer.eresaSignin) {	
					this.elements.msg.innerHTML = '<br/>'+C_XL.w('pls sign in');
					this.signin();
				} else {
					this.elements.msg.innerHTML = '<br/>'+C_XL.w('e- no registr');
					if(this.callbacks.identified) this.callbacks.identified.cb(false,false);
				}
		}
	},
	extractoken: function(stream) { // we are in demo mode and instead of sending the token by mail, it is visible on the screen
		let split = stream.split('!'); split.shift(); // removes the first part conatining debug and status info
		let token = split.shift();
		this.elements.demo.innerHTML = '<div style="font-size:90%; text-align:right;">Demo token: '+token+'</div>';
		$(this.elements.demo).show();
	},
	
	// controls callbacks
	validident: function() {
		let enable = false;
		switch(this.state.faillevel) {
			case 0: enable = this.state.valid.email; break;
			case 1: 
				if(this.has.patients) enable = this.state.valid.email&&this.state.valid.mobile&&this.state.valid.bdate;
					else enable = this.state.valid.email&&this.state.valid.mobile; 
				break;
				
			default: break;
		}		
		if(vbs) vlog('e-resa.js','C_eCheckIn','validident','patients:'+this.has.patients+', vemail:'+this.state.valid.email+', vmobile:'+this.state.valid.mobile+', vbdate:'+this.state.valid.bdate+', enable continue button:'+enable); 

		this.buttons.ident.enable(enable);

		this.validform(enable);

		return enable;
	},
	emailtype: function(digits) { this.state.valid.email = this.controls.email.valid(); this.validident(); },
	mobiletype: function(digits) { this.state.valid.mobile = this.controls.mobile.valid(); this.validident();  },
	bdatetype: function(digits) { this.state.valid.bdate = this.controls.bdate.valid(); this.validident();  },
	emailenterkey: function(digits) { if(this.validident()) this.ident(); },
	
	validregform: function(isvalid) {
		if(isvalid) {
			//$(this.elements.warn).hide();
			if(mobminder.context.surfer.eresaAuthent) $(this.elements.token).show();
		} else {
			//$(this.elements.warn).show();
			$(this.elements.token).hide();
		}
	},
	validform: function(isvalid) {
		if(isvalid)
			$(this.elements.warn).hide();
		else
			$(this.elements.warn).show();
	},
	tokenchecked: function(result) {
		if(result) {
			if(!this.state.visitor) { // new visitor has given a valid token
				this.controls.registr.save();
			}
			else {  // existing visitor has given a valid token
			
						let blacklistCcss = mobminder.context.surfer.eresaBlacklist;
						let visitorCcss = this.state.visitor.cssColor;
					let blockhim = (visitorCcss!=0) && (blacklistCcss==visitorCcss);
			
				$(this.elements.token).blur().hide();
				if(this.callbacks.identified) this.callbacks.identified.cb(this.state.visitor.id, blockhim);
				$(this.elements.msg).hide();
			}
			$(this.elements.demo).hide();
			return;
		}
		// bad token introduced
		this.controls.token.reset();
		$(this.elements.badtoken).show();
		$(this.elements.email).show(); 
		$(this.elements.bident).show(); 
			this.controls.email.focus(true);
		$(this.elements.token).hide();
		$(this.elements.msg).hide();
	},
	
	// ajax calls
	ident: function() { // the 'identify me' button has been hit after email has been validly typed in
		this.buttons.ident.busy(true);
		this.controls.email.blur();
		this.controls.mobile.blur();
		this.controls.bdate.blur();
		$(this.elements.welcome).hide();
		$(this.elements.badtoken).hide();

		

		mobminder.app.post(this.controls, { email:'email', bdate:'bdate', mobile:'mobile' }, '../_assets/queries/e-resa-checkin.php', new A_cb(this,this.checkin), new A_cb(this, this.connfailed));
	},
	signin: function() { // the surfer was not identified based on email address, he gave email again, plus mobile and birthdate
		this.controls.registr.setemail(this.controls.email.getpost());
		this.controls.registr.setmobile(this.controls.mobile.getpost());
		this.controls.registr.setbdate(this.controls.bdate.getpost());
		//this.buttons.signin.busy(true);
		let signin = new C_iPASS(1);
			// now send a token on the email
		mobminder.app.post( {signin:signin, email:this.controls.email }, { signin:'signin', email:'email' }, '../_assets/queries/e-resa-checkin.php', new A_cb(this,this.register), new A_cb(this, this.connfailed));
	},
	
	// ajax callbacks
	checkin: function(inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
		this.buttons.ident.busy(false);
		let visitors = inlineDataSets['C_dS_visitor']; // there is a unique match to an email or mobile
		let id = 0; for(id in visitors) break;
		
		if(id) { // the visitor is known in the system
			let dSvisitor = visitors[id];
			if(this.has.tokenauth) if(mobminder.demo) this.extractoken(stream);
			return this.checkedin(dSvisitor); // data of the visitor found having the input e-mail adress
		}
		else return this.checkfailed();
	},
	register: function(iline, stream) { // callback from signin
		//this.buttons.signin.busy(false);
		$(this.elements.email).hide();
		$(this.elements.bident).hide();
		
		this.elements.msg.innerHTML = C_XL.w('pls coordinates');
		$(this.elements.msg).show();
		
		//$(this.elements.warn).show();
		$(this.elements.form).show(); // shows visitor data registration form
		$(this.elements.token).hide();
		this.controls.registr.focus();

		if(this.has.tokenauth) if(mobminder.demo) this.extractoken(stream);
	},
	newvisisaved: function(dSvisitor) {
		$(this.elements.form).hide();
		$(this.elements.token).hide();
		$(this.elements.msg).hide();
		this.state.visitor = dSvisitor;
		if(this.callbacks.identified) this.callbacks.identified.cb(dSvisitor.id, false);
	},
	connfailed: function() {
		//this.buttons.signin.busy(false);
		this.buttons.ident.busy(false);
	},

}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    I D E N T I F I E D    V I S I T O R  -  visitors data display/interact class
//
C_eVisitor = function(eid, callbacks, preset) { // downloads and displays visitor data
	this.classname = 'C_eVisitor';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { loaded: }
	this.eids = { };
	this.state = C_eVisitor.defaults.align(preset);
	
	this.controls = new A_ct({});
	this.buttons = new A_ct({});
	this.appointments = new A_ct();
	
}
C_eVisitor.defaults = new A_df( { dSvisitor:false } );
C_eVisitor.prototype = {
	
	// public
	load: function(id) { // id is the visitor id that we request the data of
			let ctls = new A_ct({id:new C_iPASS(id)});
			let names = {id:'id'};
		mobminder.app.post(ctls, names, '../_assets/queries/e-resa-visitor.php', new A_cb(this,this.visidata,id), new A_cb(this, this.connfailed));
	},
	appscount: function() {
		let v = this.state.dSvisitor;
		if(!v) return 0;
		if(!v.apps) return 0;
		
		let list = this.filterdapps();
		//let c = 0;
		//let apps = this.state.dSvisitor.apps;
		//for(let id in apps) if(apps[id].deletorId==0) c++; // we do not count deleted reservations
		//return c;
		return list.length;
	},
	ds: function() { return this.state.dSvisitor; },
	namedisplay: function() {
			let v = this.state.dSvisitor;
		let msg = '<strong>'+C_XL.gender(v.gender, v.language)+'&nbsp;'+v.lastname+'</strong>,';
		return msg;
	},
	filterdapps: function(){
		let apps = this.state.dSvisitor.apps;
		let prebs = this.state.dSvisitor.prebs;
		let list = []; 
		for(let id in apps) 
		{	
			if(apps[id].deletorId==0)  //we do not count deleted reservations
			{
				//BSP exclude prebooking rdv from displayed list/////////////////////////////////
				let foundinpreb=false;
				for(let prebid in prebs)
				{
					if (prebs[prebid].reservationId==id) 
					{
						foundinpreb=true;
						break;
					}
				}
				if (!foundinpreb) list.push(id);
			}
		}
		return list;
	},
	appsdisplay: function(options) {
		options = options || {  maydelete:false };
		let list = '';
		let apps = this.state.dSvisitor.apps;
		this.appointments = new A_ct();
		let ordered = this.filterdapps();
		let sortf = function(a,b){ if(apps[a].cueIn > apps[b].cueIn) return 1; else return -1; };
		ordered.sort(sortf);
		
		for(let x in ordered) {
			let o_dS_resa = apps[ordered[x]];
			if(o_dS_resa.deletorId!=0) continue;
			let eresa = new C_eRESA(o_dS_resa, { deleted:new A_cb(this, this.appdeleted) }, { maydelete:options.maydelete,confirm:true } );
				list += eresa.action();
				//this.appointments.add1(eresa,id);
				this.appointments.add1(eresa);
		}
		return list;
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('C_eVisitor');
		this.buttons.activate('C_eVisitor');
		this.appointments.activate('C_eVisitor');
	},
	
	// private
	
	// controls callbacks
	appdeleted: function(resaId) { // from 
		delete this.state.dSvisitor.apps[resaId];
		if(this.callbacks.appdeleted) this.callbacks.appdeleted.cb(resaId);
		if(vbs) vlog('e-resa.js','C_eVisitor','appdeleted','resaId:'+resaId); 
	},
	
	// ajax calls
	
	// ajax callbacks
	visidata: function(rvid,inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
			// rvid is the requested visitorId
		let visitors = inlineDataSets['C_dS_visitor']; // there is a unique match to an email or mobile
			let v = visitors[rvid];
		this.state.dSvisitor = v;
		
		let apps = inlineDataSets['C_dS_reservation'];
			// let appId = 0; for(let appId in apps) break;
		v.apps = apps;

		let prebs = inlineDataSets['C_dS_prebooking'];
		v.prebs = prebs;

		if(this.callbacks.loaded) this.callbacks.loaded.cb(v);
	},
	connfailed: function() {
		
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    R E S E R V A T I O N     P R O C E S S
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
	this.eids = { eid:eid, outset:b+'outset', ident:b+'ident', options:b+'options', slots:b+'out', resa:b+'resa', goodbye:b+'goodbye', qrcode:b+'qrcode',
					controls:{ chkin:b+'chkin', visi:b+'visi', eperf:b+'eperf', before:b+'before', ampm:b+'ampm', staff:b+'staff' },
					buttons:{ search:b+'search', backslots:b+'backslots', moreslots:b+'moreslots', change1:b+'change1', change2:b+'change2', moredone:b+'bmd', paycancel:b+"paycancel" },
					msgs: { currapps:b+'capps', options:b+'chopt', slotshere:b+'shere', progress:b+'progress'
							, wkname:b+'wknme', wknotice:b+'wknote', wknotes:b+'wknotes' , wkwarning:b+'wkwarn', wkpricing:b+'wkpric' , wkprice:b+'wkprice' , wkdeposit:b+'wkdeposit'
							, moreapp:b+'moreapp', confirmsg:b+'cfrm', overbkmsg:b+'ovbk', tipconfirm:b+'tcnfrm', payinfo:b+"payinfo" },
					panes: { p1:b+'p1', p2:b+'p2', p3:b+'p3', p4:b+'p4', p5:b+'p5' },
				}
	this.elements = new A_el();
	
	let progress = new C_eProgress(this.eids.msgs.progress);
	
	// sub controls
	let ident 	= new C_eCheckIn(this.eids.controls.chkin, { identified:new A_cb(this, this.visitorCheckedIn) } );
	let visi 	= new C_eVisitor(this.eids.controls.visi, { loaded:new A_cb(this, this.visitorLoaded), appdeleted:new A_cb(this, this.appdeleted) } );
	
	let eperf = new C_ePERF(this.eids.controls.eperf, {oneperf:new A_cb(this,this.workcodeSelect)} );
	let duration = new C_iPASS(1);
	let tboxing = new C_iPASS('-');
	let before = new C_iBEFORE(this.eids.controls.before, {onbefore:new A_cb(this,this.before)}, { eresa:true, selection:mobminder.context.surfer.eresaBefore, title:'search as from', soonest:'today' } );
	
	let aid = mobminder.account.id;
	this.days = 0; 
	if(aid == 3673 || aid == 3660 || aid == 3961 ) { // specific for H4D France (accounts Agenda AXA and Agenda h4d)
		let sid = mobminder.context.surfer.id; // is a login id (not a key id!!)
		if(	sid==12155 // almerys - account h4d
			||sid==12179 // paris kleber
			||sid==10965 // test tk
			||sid==11085 // icade paris tk
			||sid==11936 // econocom puteau
			||sid==11933 // interiale danton
			||sid==12293 // mmsky
			||sid==11939 // vinci rue
			||sid==12163 // axa charge
			||sid==12158 // eycourbevoie
			||sid==12987 // crystalparktk
			||sid==12904 // philipssuresnestk
			
			||sid==12761 //axachatillontk  - account AXA
			||sid==12760 //bnpreissytk 
			||sid==12941 //bouyguesconstructiontk 
			||sid==12979 //siaciseasontk 
			
			||sid==13582 //ircemroubaixtk // ajout� en 2018-10
			||sid==13400 //nparcueiltk
			||sid==13685 //sodexoissytk // email de B�reng�re
			||sid==13686 //sodexo // fix par pascal le 2018-12-10
			||sid==13693 //toureqhotk 
			
			||sid==13777 //allianztouronetk // ajout� en 2018-11
			||sid==13781 //cargeastk // ajout� en 2018-11-13
			||sid==13505 //lmgparistk // ajout� en 2018-11-13
			
			||sid==13829 //msdcourbevoietk // ajout� en 2018-11-27
			||sid==16207 //bouyguesconstructiontk // ajout� le 2020-02-11
			||sid==16866 //plessirobinson // ajout� le 2020-05-11
			
			||sid==16875 //ocianembordeauxtk // ajout� le 2020-07-25
			||sid==16879 //bpceparistk 
			||sid==17238 //boursidieretk 
			
			|| ( sid>=13915 && sid<=13953 ) // range of logins pre-reserved by Fran�ois Gambarelli on 2018-11-15
		) 
			this.days = 3; // only 72h availabilities
	}
		
	let ampm = new C_iAMPM(this.eids.controls.ampm, {onampm:new A_cb(this,this.ampm)} );
		let rsctypes = mobminder.context.surfer.eresaRescType; // bitmap according to what choice is allowed to public web reservation
		let staffshow = {bCals:!!(rsctypes&class_bCal), uCals:!!(rsctypes&class_uCal), fCals:!!(rsctypes&class_fCal), contingent:false };
	let staff = new C_iSTAFF(this.eids.controls.staff, 'staffing', new A_cb(this,this.staff), {}, { show:staffshow, maxrows:(is.small?false:false), maxcols:1 });
	
		let more = {caption:C_XL.w('e- more app'), tip:'', csscolor:'action', cssfa:'fa-plus' };
		let done = {caption:C_XL.w('e- done ok'), tip:'', csscolor:'action', cssfa:'fa-sign-out' };
	let moredone = new e_DblButton(this.eids.buttons.moredone, {onleft:new A_cb(this, this.moreapp), onright:new A_cb(this, this.done)}, {left:more, right:done });
	
		let tipsearch = C_XL.w('tip e-search');
		let tipchange = C_XL.w('tip e-change');
	
	//let search = new C_iBUTTON(this.eids.buttons.search, new A_cb(this, this.searchnext), {enabled:true, tabindex:false, tip:tipsearch});
	let search =  new C_iCLIK(this.eids.buttons.search, { click:new A_cb(this, this.searchnext) }, { enabled:true, tabindex:false, tag:'div', ui:C_XL.w('slotsearch'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;', tip:tipsearch }  );
	
	//let backslots = new C_iBUTTON(this.eids.buttons.backslots, new A_cb(this, this.searchback), {enabled:true, tabindex:false});
	let backslots =  new C_iCLIK(this.eids.buttons.backslots, { click:new A_cb(this, this.searchback) }, { enabled:true, tabindex:false, tag:'div', ui:'<span class="fa lighter fa-1d5x fa-angle-up fa-fw"></span>'+C_XL.w('earlier_dates'), css:'e-button-backnext', style:'width:100%; display:flex; justify-content:center; align-items:center;' }  );
	
	//let moreslots = new C_iBUTTON(this.eids.buttons.moreslots, new A_cb(this, this.searchnext), {enabled:true, tabindex:false});
	let moreslots =  new C_iCLIK(this.eids.buttons.moreslots, { click:new A_cb(this, this.searchnext) }, { enabled:true, tabindex:false, tag:'div', ui:'<span class="fa lighter fa-1d5x fa-angle-down fa-fw"></span>'+C_XL.w('next dates'), css:'e-button-backnext', style:'width:100%; display:flex; justify-content:center; align-items:center;' }  );
	
	//let change1 = new C_iBUTTON(this.eids.buttons.change1, new A_cb(this, this.change), {enabled:true, tabindex:false, tip:tipchange});
	let change1 =  new C_iCLIK(this.eids.buttons.change1, { click:new A_cb(this, this.change) }, { enabled:true, tabindex:false, tip:tipchange, tag:'div', ui:'<span class="fa fa-arrow-alt-circle-up fa-1d5x" style="margin-right:5px;"></span>'+C_XL.w('modify options'), css:'e-button-change', style:'display:flex; justify-content:flex-end; align-items:center; margin-left:auto; margin-right:0;' }  );

	//let change2 = new C_iBUTTON(this.eids.buttons.change2, new A_cb(this, this.change), {enabled:true, tabindex:false, tip:tipchange});
	let change2 =  new C_iCLIK(this.eids.buttons.change2, { click:new A_cb(this, this.change) }, { enabled:true, tabindex:false, tip:tipchange, tag:'div', ui:'<span class="fa fa-arrow-alt-circle-up fa-1d5x" style="margin-right:5px;"></span>'+C_XL.w('modify options'), css:'e-button-change', style:'display:flex; justify-content:flex-end; align-items:center; margin-left:auto; margin-right:0;' }  );

	//let paycancel = new C_iBUTTON(this.eids.buttons.paycancel, new A_cb(this, this.paycancel), {enabled:true, tabindex:false});
	let paycancel =  new C_iCLIK(this.eids.buttons.paycancel, { click:new A_cb(this, this.paycancel) }, { enabled:true, tabindex:false, tag:'div', ui:'<span class="fa fa-times-circle fa-1d5x" style="margin-right:5px;"></span>'+C_XL.w('abandon'), css:'e-button-change', style:'display:flex; justify-content:flex-end; align-items:center; margin-left:auto; margin-right:0;' }  );
	
	this.continuedslots = [];
	let snexton = new C_iPASS(0);

	let limit = new C_iPASS(mobminder.context.surfer.eresaLimit);
	let limitdate = new C_iPASS(0);
	
		let aggregate = mobminder.context.surfer.eresaAggregate;
		let sameday = mobminder.context.surfer.eresaSameday;
	let options = new C_iPASS({ exceptional:0, overdays:0, aggregate:aggregate, sameday:sameday }); // passed to search engine on server
	
	this.controls = new A_ct({progress:progress, visi:visi, visitor:new C_iPASS('-'), ident:ident, eperf:eperf, duration:duration, before:before, ampm:ampm, staff:staff, tboxing:tboxing, options:options, snexton:snexton, limit:limit, limitdate:limitdate});
	this.buttons = new A_ct({search:search,backslots:backslots,  moreslots:moreslots, change1:change1, change2:change2, moredone:moredone,paycancel:paycancel});
	
		let wkcnt = C_dS_workcode.has({eresa:true});
	
	
	let jetlag = false; 

	this.state = { duplicate:false, wkcnt:wkcnt, initializing:false,jetlag:jetlag };
}
C_eProcess.prototype = {
	// public interface 
	display: function(containerEid) {
		let single = mobminder.account.single;
		if(vbs) vlog('e-resa.js','C_eProcess','display',''); 
		
		
		// pane 1 - identification
		
				let ident = this.controls.ident.display('textcolor-light');
				
			let s1 	= '<div class="" style="">'+this.controls.progress.display(1)+'</div>';
			let identpane 	= '<div id="'+this.eids.ident+'" class="" style="">'+ident+'</div>';
			let currapps 	= '<div id="'+this.eids.msgs.currapps+'" class="e-msg" style="display:none; margin:1em 0;">'+'</div>';		
			let moreapp		= '<div id="'+this.eids.msgs.moreapp+'" style="display:none;">'+this.buttons.moredone.display()+'</div>';
			
			let identpane2 = '<div id="'+this.eids.panes.p1+'" class="step-pane">'+identpane+currapps+moreapp+'</div>';
			let s1_ident = s1+identpane2;
		
		
		// pane 2 - search options
         
			let s2 = '<div class="" style="">'+this.controls.progress.display(2)+'</div>';
			let eperf = this.state.wkcnt?'<div>'+this.controls.eperf.display()+'</div>':''; // this one is always on the screen, unless there is no workcode defined in the setup
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
				let jetlagmsg 	= (this.state.jetlag? '<div class="e-msg e-warner" style="margin-bottom:1em;">'+C_XL.w('warning_timezone')+'</div>':'');
				let slotspane 	= '<div id="'+this.eids.slots+'" class="e-msg" style=""></div>'; // filled with availabilities
				
				//let change1 	= '<div class="text-right">'+this.buttons.change1.display({caption:C_XL.w('modify options'), css:'e-button-change', tag:'&#xf35b', solid:true})+'</div>';
				let change1 = '<div class="text-right">'+this.buttons.change1.display()+'</div>';
				
				//let backslots 	= !!this.days ? '': '<div class="flexinner center col-12">'+this.buttons.backslots.display({caption:C_XL.w('earlier_dates'), width:'100%', css:'e-button-backnext', tag:'&#xf106'})+'</div>';
				let backslots = !!this.days ? '': '<div class="flexinner center col-12">'+this.buttons.backslots.display()+'</div>';

				//let moreslots 	= !!this.days ? '': '<div class="flexinner center col-12">'+this.buttons.moreslots.display({caption:C_XL.w('next dates'), width:'100%', css:'e-button-backnext', tag:'&#xf107'})+'</div>';
				let moreslots = !!this.days ? '': '<div class="flexinner center col-12">'+this.buttons.moreslots.display()+'</div>';

			let availipane = '<div id="'+this.eids.panes.p3+'" class="e-msg" class="step-pane">'+change1+slotshere+selectmsg+jetlagmsg+backslots+slotspane+moreslots+'</div>';

		let s3_choose = s3+availipane;
		
		
		// pane 4 - confirming choice
		
		let s4 	= '<div class="" style="">'+this.controls.progress.display(4)+'</div>';	
		//e-alert-msg not used anymore
		let overbooked = '<div id="'+this.eids.msgs.overbkmsg+'" class="e-warner" style="display:none; margin-top:1em;">'+C_XL.w('e-overbooking')+'</div>';
		//let change2 	= '<div class="text-right" >'+this.buttons.change2.display({caption:C_XL.w('modify options'), css:'e-button-change', tag:'&#xf35b', solid:true})+'</div>';
		let change2 = '<div class="text-right">'+this.buttons.change2.display()+'</div>';
		let plsconfirm 	= '<div id="'+this.eids.msgs.tipconfirm+'" class="e-msg"></div>';
		let resapane 	= '<div id="'+this.eids.resa+'" class="e-msg" style=""></div>'; // filled with chosen resa info
		//let qrcode = '<div id="'+this.eids.qrcode+'" class="e-msg" style="background-color:white;display:none;z-index:0; position:absolute; top:0; bottom:0; width:100%; overflow:hidden;"></div>';
		let qrcode = '<div id="'+this.eids.qrcode+'" style="display:none;" class="e-msg centered" ></div>';
		let payinfo 	= '<div id="'+this.eids.msgs.payinfo+'" style="display:none;padding:20px 0px;" class="e-msg centered"></div>';
		//let paycancel 	= '<div class="text-right">'+this.buttons.paycancel.display({caption:C_XL.w('abandon'), css:'e-button-change', tag:'&#xf057',solid:true})+'</div>';
		let paycancel = '<div class="text-right">'+this.buttons.paycancel.display()+'</div>';
		let confipane = '<div id="'+this.eids.panes.p4+'" class="e-msg" class="step-pane">'+overbooked+change2+plsconfirm+resapane+paycancel+payinfo+qrcode+'</div>';
		let s4_confirm = s4+confipane;
		
		// pane 5 - goodbye
		let note = mobminder.context.surfer.eresaNote.htmlize();
		
		//if(vbs) vlog('e-resa.js','C_eProcess','display','confirmmsg='+note); 
		//if(vbs) vlog('e-resa.js','C_eProcess','display','goodbye='+C_XL.w('e-goodbye')); 

		let s5 	= '<div class="" style="">'+this.controls.progress.display(5)+'</div>';	
		
		//let confirmmsg 	= note?'<div id="'+this.eids.msgs.confirmsg+'" class="perf_notes" style="display:none; margin-top:1em;">'+note+'</div>':'';
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
	},
	reload: function() {
		C_iSLOT.flush();
		if(vbs) vlog('e-resa.js','C_eProcess','reload',''); 
		if(this.callbacks.ondone) this.callbacks.ondone.cb();
		$(this.elements.goodbye).hide();
		this.paneset(1).controls.progress.step(1).caption(1); 
		if(!this.callbacks.ondone) this.controls.progress.slideto(1); // if the callback is defined, it will probably hide this section and take care of the scrolling
		this.controls.ident.reset();
		$(this.elements.ident).show();
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
	staff: function() { 
		if(vbs) vlog('e-resa.js','C_eProcess','staff',''); 
		//this.controls.continued.set(0); 
		this.controls.snexton.set('0'); 
		this.continuedslots = [];
	},
	ampm: function() { 
		if(vbs) vlog('e-resa.js','C_eProcess','ampm',''); 
		if(this.controls) 
		//this.controls.continued.set(0); 
		this.controls.snexton.set('0'); 
		this.continuedslots = [];
	},
	before: function(date,option) { 
		let fulldate = C_XL.date(date,{abreviation:'full',weekday:true});
		switch(option|0) {
			case 0: this.elements.msgs.slotshere.innerHTML = C_XL.w('slots from today')+'&nbsp;'+fulldate; break;
			case 1: this.elements.msgs.slotshere.innerHTML = C_XL.w('slots from tomorrow')+'&nbsp;'+fulldate; break;
			default: this.elements.msgs.slotshere.innerHTML = C_XL.w('slots as from')+'&nbsp;'+fulldate; 
		}
		if(this.state.initializing) return; // this function is called during this.controls.activate process, so do not jump to step 2 now
			//else this.change();
        else {
            this.elements.slots.innerHTML = '';
            //this.controls.continued.set(0);
			this.controls.snexton.set('0'); 
			this.continuedslots = [];

        }

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

		
		/////////////////////////////////////////////////////////////////////////////////

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
		//this.controls.continued.set(0);
		this.controls.snexton.set('0'); 
		this.continuedslots = [];
	},
	visitorCheckedIn: function(visiId, blacklisted) {
		if(vbs) vlog('e-resa.js','C_eProcess','visitorCheckedIn','visiId:'+visiId); 
		
		// visiId is the id of a previously existing visitor or the id of a newly created visitor.
		
		if(!blacklisted)
			if(visiId) return this.controls.visi.load(visiId);
		
		// else we have no valid visitor identified => this means that online registration is not allowed
		this.done();
	},	
	visitorLoaded: function() {
		
		let dSvisitor = this.controls.visi.ds();
		if(vbs) vlog('e-resa.js','C_eProcess','visitorLoaded','name:'+dSvisitor.firstname+'&nbsp;'+dSvisitor.lastname); 
		this.controls.progress.caption(1,dSvisitor.firstname+'&nbsp;'+dSvisitor.lastname);
		this.checklimit();
	},
	/*BSP : old version overriden by JONA : currentApps: function(options) { // displays the list of appointments
		
		let msgabove = '<div style="margin: 1em 0;">'+this.controls.visi.namedisplay(options)+'&nbsp;'+C_XL.w('e- you are app yet on')+'</div>';
			let m = C_XL.w('e- deletion unavailable'); if(options.maydelete) m = is.tactile? C_XL.w('e- touch to delete') : C_XL.w('e- click to delete');
		let msgunder = '<div style="margin: 1em 0; text-align:'+(is.tactile?'left':'right')+';">'+m+'</div>';
		this.elements.msgs.currapps.innerHTML = msgabove+this.controls.visi.appsdisplay(options)+msgunder;
		$(this.elements.msgs.currapps).show();
		this.controls.visi.activate();
	},*/
	currentApps: function(options) { // displays the list of appointments
        
        var msgabove = '<div style="margin: 1em 0;">'+this.controls.visi.namedisplay(options)+'&nbsp;'+C_XL.w('e- you are app yet on')+'</div>';
            var m = C_XL.w('e- deletion unavailable'); if(options.maydelete) m = is.tactile? C_XL.w('e- touch to delete') : C_XL.w('e- click to delete');
        var msgunder = '<div style="margin: 1em 0; text-align:'+(is.tactile?'left':'right')+';">'+m+'</div>';
            let note = mobminder.context.surfer.eresaNote.htmlize();
            let confirmmsg  = note?'<div id="'+this.eids.msgs.confirmsg+'" class="perf_notes" style="margin-top:1em;margin-bottom:1em;"><div class="iconinfo_before_notes" style="position:relative;">'+note+'</div></div>':'';
        this.elements.msgs.currapps.innerHTML = msgabove+this.controls.visi.appsdisplay(options)+msgunder+confirmmsg;
        $(this.elements.msgs.currapps).show();
        this.controls.visi.activate();
    },
	checklimit: function(options) { // shows current reservations and check against max allowed apps
	
			options = options || { maydelete:mobminder.context.surfer.eresaCancel, afterdelete:false, before:''};
		let dSvisitor = this.controls.visi.ds();
		let eresaMax = mobminder.context.surfer.eresaMax;
		let ac = this.controls.visi.appscount();
		let maybookmore = (eresaMax==0)?true:(ac<eresaMax);

		this.buttons.moredone.enable({left:maybookmore});
		//BSP
		//this.buttons.moredone.showbutton({left:maybookmore});

		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		if(vbs) vlog('e-resa.js','C_eProcess','checklimit','apps count:'+ac+', eresaMax:'+eresaMax+', after deletion:'+(options.afterdelete?'yes':'no')); 
		
		if(ac) { // that visitor has appointments
			
			this.currentApps(options);
			$(this.elements.slots).hide();
			//if (maybookmore) 
			$(this.elements.msgs.moreapp).show();

			
			
				
		} else { // no appointment yet
			if(options.afterdelete) {
				this.elements.msgs.currapps.innerHTML = C_XL.w('e- you have no appointments');
				$(this.elements.msgs.currapps).show();
				return; // do not step to reservation choices, show empty list of appointments.
			}
			return this.searchoptions(); // no future appointments, go straight to options choice
		}
		
	},
	searchoptions: function() { // STEP 2: display search options	
		
		
		let dSvisitor = this.controls.visi.ds();
		$(this.elements.msgs.currapps).hide();	
		let msg = '<strong>'+C_XL.gender(dSvisitor.gender, dSvisitor.language)+'&nbsp;'+dSvisitor.lastname+'</strong>,&nbsp;';
			msg += C_XL.w('pls options');
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
	searchback: function(){
		this.continuedslots.pop(); 
		this.continuedslots.pop(); 
		let l = this.continuedslots.length; 
		this.controls.snexton.set(this.continuedslots[l-1]||0);

		this.search();
	},
	searchnext: function(){
		this.search();
	},
	enablebacksearchbutton: function() { 
		// sets buttons group to appear	
		if(this.continuedslots.length>=1)
			this.buttons.backslots.enable(true);
		else
			this.buttons.backslots.enable(false);
	},
	search: function() { 
		this.buttons.search.busy(true);
		this.controls.visitor.set(this.controls.visi.ds().id);
		if(this.days) { // there is a limit date (introduced  exceptionally for h4d, check this.days )
			
			//this.controls.continued.set(0); // by the end of the story, h4d wants to never see what is beyond the 2 days window... :)
			this.controls.snexton.set('0'); 
			this.continuedslots = [];
			
			//let c = this.controls.snexton.value(); //console.log('continued:'+c); // that is a Unix stamp
			let b = this.controls.before.getjsdate(); //if(c) { b = new Date(c*1000); }
			
						//console.log('not before:'+b.getUnixTime());
			b.increment({d:this.days-1}); 
						//console.log('not after:'+b.getUnixTime());
			this.controls.limitdate.set(b.stamp());
			//if(c) this.controls.snexton.set(c-3600); // -3600 because at search.php side, the continued stamp gets moved to midnight next date
			
		}
		
			let noampm = !mobminder.context.surfer.eresaWithAMPM;
		if(noampm) this.controls.ampm.reset({callback:false}); // forces the search to ignore the visitor's own ampm preference
		// console.log(bitmap(this.controls.ampm.state.encoded));
			let c = this.controls.snexton.value();
			let ampm = bitmap(this.controls.ampm.state.encoded);
		if(vbs) vlog('e-resa.js','C_eProcess','search','continued:'+c+', ampm:'+ampm+', days:'+this.days+', AMPM display:'+(!noampm)); 

		let names = {
			visitor:'visitors', eperf:'workcodes', duration:'duration', before:'before', ampm:'ampm'
			, snexton:'continued', limit:'limit', limitdate:'limitdate', tboxing:'tboxing'
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
		res += ' - '+ this.controls.visi.state.dSvisitor.lastname + " " 
					+ this.controls.visi.state.dSvisitor.firstname;
		
		
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
	newresasaved: function(dataSets) { // SCREEN STEP 6
		// 
		this.paneset(5).controls.progress.step(5).slideto(1);
		this.controls.progress.caption(4,C_XL.w('confirmed',{cap:1}));
		this.state.duplicate = false;
		
		if(vbs) vlog('e-resa.js','C_eProcess','newresasaved',''); 
		
		let resa = false, id;
		for(id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
			let dSvisitor = this.controls.visi.ds();
		dSvisitor.apps[id] = resa;
		
		$(this.elements.goodbye).hide();
		$(this.elements.msgs.confirmsg).show();
		$(this.elements.ident).hide();
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
				
				let qrcodeshort;
				if (!payment.qrcodestring.includes('?'))
					qrcodeshort = payment.qrcodestring;
				else
					qrcodeshort = payment.qrcodestring.substr(0, payment.qrcodestring.indexOf('?')); 

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
		this.watchdog = new C_iWatchdog(wdpreset, { dogstream:new A_cb(this, this.backhere),predog:new A_cb(this, this.predog),failure:new A_cb(this,this.backfailure) }, wdname);

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
			let tparameter = parameter.split('=');

			let input = document.createElement("input");
			input.type = "hidden";
			input.name = tparameter[0];
			input.value = tparameter[1];
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
			
			let dSvisitor = this.controls.visi.ds();
			dSvisitor.apps[resaid] = resa;

			//remove prebooking, otherwise the new rdv is not displayed in summary list
			let prebs = dSvisitor.prebs;
			//let prebidtodelete;
			for(let prebid in prebs)
			{
				if (prebs[prebid].reservationId==resaid) 
				{
					prebs.splice(prebid,1);
					//prebidtodelete=prebid;
					break;
				}
			}

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
			//let notelen = mobminder.context.surfer.eresaNote.length; 
			let readtime = 6000; // notelen?(notelen*80+1000):2500; // the note stays on the screen for a time that is proportional to its readable length
			let handler = new A_hn({reload:new A_cb(this, this.appsummary)}); setTimeout(handler.reload, readtime);
		}
		else
		{
			//force id to 0 because we want a NEW reservation!!
			resa.id=0;
			
			let readtime = 6000;
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
		
		this.paneset(1).controls.progress.step(1).caption(2).caption(3).caption(4).caption(5).slideto(1);
		this.checklimit();

	},
	moreapp: function() { // the surfer has chosen to take one more appointment
		$(this.elements.msgs.moreapp).hide();
		$(this.elements.slots).show();
		return this.searchoptions();
	},
	appdeleted: function() {
		if(vbs) vlog('e-resa.js','C_eProcess','appdeleted',''); 
		this.checklimit({afterdelete:true, maydelete:true});
	},
	done: function() {  // SCREEN STEP 5 // the surfer has chosen NOT to take more appointment
		if(vbs) vlog('e-resa.js','C_eProcess','done',''); 
		$(this.elements.msgs.moreapp).hide();
		this.paneset(5).controls.progress.step(5).slideto(5);
		$(this.elements.msgs.currapps).hide();
		$(this.elements.goodbye).show();
		$(this.elements.msgs.confirmsg).hide();
		let handler = new A_hn({reload:new A_cb(this, this.reload)}); setTimeout(handler.reload, 8000);
	},
	change: function() {
		if(vbs) vlog('e-resa.js','C_eProcess','change',''); 
		$(this.elements.options).show();
		this.elements.slots.innerHTML = '';
		this.paneset(2).controls.progress.step(2).slideto(1);
		//this.controls.continued.set(0);
		this.controls.snexton.set('0'); 
		this.continuedslots = [];
	},
	// ajax callbacks
	connfailed: function() {
		this.buttons.search.busy(false);
	},
	slotsfresh: function(inlineDataSets) { // this is where we display this stuff on the slots pad
		this.buttons.search.busy(false);
		this.enablebacksearchbutton();
		
		//bsp do not hide anymore because last section is already hidden
		//$(this.elements.msgs.options).hide();
		//$(this.elements.options).hide();
		
		//bsp : hide previous section
		//this.paneset(2,3).controls.progress.step(3).caption(3).slideto(3);
		this.paneset(3).controls.progress.step(3).caption(3).slideto(3);
		
		let virtualid = -1, cueLast = 0;
		for(let id in inlineDataSets['C_dS_reservation']) {
			//this.state.duplicate = { replan:replan, note:resa.note, ccsscolor:resa.cssColor, ccsspattern:resa.cssPattern };
			let resa = inlineDataSets['C_dS_reservation'][id];
			if(this.state.duplicate) {
				resa.note = this.state.duplicate.note;
				resa.cssColor = this.state.duplicate.ccsscolor;
				resa.cssPattern = this.state.duplicate.ccsspattern;
				resa.replan = this.state.duplicate.replan;
			}
			// relink visitor (there is always a visitor via web, and only one)
			new C_dS_att_visitor('slots', [virtualid--, id, class_visitor, this.controls.visi.ds().id]);
			
			// relink workcode
			if(this.state.wkcnt)
				new C_dS_performance('slots', [virtualid--, id, this.controls.eperf.value(), this.controls.visi.ds().id ]);
			
			resa.rmeta();
			new C_iSLOT(this.eids.slots, resa, { selected:new A_cb(this, this.slotclick) } );
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
		}
			
		
		if(this.days) { 
			//let c = this.controls.continued.value(); 
			let c = this.controls.snexton.value(); 
			let b = this.controls.before.getpost(); 
			let s = c ? c+3600 : b;
			s += 86400*(this.days); // covers the case where no result comes from the search but still you want to search further
			s = new Date(s*1000); s.toMidnight();
			// console.log('setting continued to :'+s.getUnixTime());
		
			//this.controls.continued.set(s.stamp()); 
			this.continuedslots.push(s.stamp()); 
			this.controls.snexton.set(s.stamp()); 
		}
		else 
		{
			//this.controls.continued.set(cueLast); // this is the usual case
			this.continuedslots.push(cueLast); 
			this.controls.snexton.set(cueLast); 
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
		let visiid = mobminder.app.state.returnVisitorId;
		let resaid =  mobminder.app.state.returnResaId;
		
		//load visitor and reservations from server + callback
		//let id			= new C_iPASS({id:this.dataSet.id, archived:0, peerId:0, bank:'visiapps', amount:this.state.amount,transnote:this.state.transnote,preb:5});
		//let names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id', archived:'archived', peerId:'peerId', bank:'bank', preb:'preb',amount:'amount',transnote:'transnote' }
	
		let ctls = new A_ct({id:new C_iPASS({visiid:visiid, resaid4payment:resaid})});
		let names = {id:{visiid:'id',resaid4payment:'resaid4payment'}};
		mobminder.app.post(ctls, names, '../_assets/queries/e-resa-visitor.php', new A_cb(this,this.visidataforreturnurl,visiid), new A_cb(this, this.connfailedforreturnurl));

		this.state.initializing = false;

	},
	//asynchronous callback after return url activate
	visidataforreturnurl: function(id,inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check

		//retrieve visitor from dataset
		let visitors = inlineDataSets['C_dS_visitor']; // there is a unique match to an email or mobile
		let visitor = visitors[id];
			
		//console.log("visitor="+visitor);
		if (!visitor)
		{
			if(vbs) vlog('e-resa.js','e_MOB','visidataforreturnurl','visitor not found (id='+id+')');

			mobminder.app.state.returnVisitorId=0;
			mobminder.app.state.returnResaId=0;
			this.reload();

			//shows page after data has been loaded
			//hide has been hidden by done at e_MOB constructor
			$(document.body).show();
			return;
		}


		//retrieve reservations from dataset
		let apps = inlineDataSets['C_dS_reservation'];
		visitor.apps = apps;

		let prebs = inlineDataSets['C_dS_prebooking'];
		visitor.prebs = prebs;

		this.controls.visi.state.dSvisitor = visitor

		//find selected reservation in dataset base on reservationid from 'r' parameter (visitorid-reservationid)
		let resaid4payment = mobminder.app.state.returnResaId; //22624244;

		let payment = false;
		for(id in inlineDataSets['C_dS_payment']) 
		{ 
			let looppayment = inlineDataSets['C_dS_payment'][id]; 
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
		}
		else
		{
			this.state.paymentid = payment.id; //need by polling call
			//let resaid = payment.groupId;
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
			}
			else //visitor and reservation loaded!
			{
				this.paneset(4);

				//display step1 title = visitor name
				this.controls.progress.step(1).caption(1,visitor.firstname+'&nbsp;'+visitor.lastname);

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
				
				


				//partie polling////////////////////////////////////////////////////////////////////////
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
			}
		}
	},
	connfailedforreturnurl: function(){},
	
	connfailedforcancelpayment: function(){
		this.buttons.paycancel.busy(false);
	}
}



