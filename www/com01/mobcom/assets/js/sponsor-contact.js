
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
// © Copyright 2007-2020 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium



// brings back geolocation data to js environment
//

function C_iContact_sponsor(eid, preset) {

	this.eids = { h:eid+'_h', ovl:eid+'_ovl'
		, msg:eid+'_msg', name:eid+'_name', comp:eid+'_comp', spec:eid+'_spec', mobile:eid+'_mobl', email:eid+'_eml', captcha:eid+'_cpt'
		, caid:eid+'_caid', cach:eid+'_cach', lang:eid+'_lang',
		done:eid+'_done', busy:eid+'_bsy' };
	this.elements = new A_el();

	this.state = C_iContact_sponsor.defauts.align(preset = preset || {});

	this.state.xl = preset.ixl=='on'?true:false; // ixl arrives from $ixl in moblib.php, values are { 'on', 'off' }, we convert it into a boolean for usage in js

		let ixltag = this.state.xl?' > xl':'';
	var phs = {
		msg:	this.state.target.find('#contact-form-msg'+ixltag).html(),
		name:	this.state.target.find('#contact-form-name'+ixltag).html(),
		company:this.state.target.find('#contact-form-company'+ixltag).html(),
		special:this.state.target.find('#contact-form-special'+ixltag).html(),
		mobile:	this.state.target.find('#contact-form-mobile'+ixltag).html(),
		email:	this.state.target.find('#contact-form-email'+ixltag).html()
	}
	
	var pass = new C_iPASS({pagename:window.location.href, version:'1.00', accmanager:this.state.am, client:this.state.cl, cloginid:this.state.lid });
	var msg = new C_iEDIT(this.eids.msg, { onfchange:new A_cb(this,this.typing) }, { digits:'', type:INPUT_TEXTAREA, placeholder:phs.msg, rows:5, focus:this.state.focus, dblclick:false, mandatory:false, max:512 });
	var name = new C_iEDIT(this.eids.name, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.name, type:INPUT_TEXT, enabled:true, mandatory:true, max:32 });
	var company = new C_iEDIT(this.eids.comp, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.company, type:INPUT_TEXT, enabled:true, max:32 });
	var special = new C_iEDIT(this.eids.spec, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.special, type:INPUT_TEXT, enabled:true, max:32 });
	var mobile = new C_iEDIT(this.eids.mobile, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.mobile, type:INPUT_MOBILE, enabled:true, mandatory:true, max:16 });
	var email = new C_iEDIT(this.eids.email, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.email, type:INPUT_EMAIL, enabled:true, mandatory:true, max:64 });

	var captcha = new C_iCaptcha(this.eids.captcha, {capchoice:new A_cb(this, this.capclick)}, { lang:preset.lang, target:this.state.target.find('#captcha-form'), caid:preset.caid , xl:this.state.xl });

		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams });

		var caption = this.state.target.find('#contact-form-submit'+ixltag).html(); //   takes the button caption from an element having ixl class and display:none otherwise
	var done = new C_iCLIK(this.eids.done, { click:new A_cb(this, this.save) } , { tag:'div', ui:caption, enabled:false } );

	this.controls = new A_ct({ pass:pass, msg:msg, name:name, company:company, special:special, mobile:mobile, email:email, lang:lang, captcha:captcha, done:done });
}
C_iContact_sponsor.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
C_iContact_sponsor.prototype = {
	display: function(e) {

			var msg = '<div>'+this.controls.msg.display('wide')+'</div>'; this.state.target.find('#contact-form-msg').after(msg);
			var name = '<div>'+this.controls.name.display('wide')+'</div>'; this.state.target.find('#contact-form-name').after(name);
			var company = '<div>'+this.controls.company.display('wide')+'</div>'; this.state.target.find('#contact-form-company').after(company);
			var special = '<div>'+this.controls.special.display('wide')+'</div>'; this.state.target.find('#contact-form-special').after(special);
			var mobile = '<div>'+this.controls.mobile.display('wide')+'</div>'; this.state.target.find('#contact-form-mobile').after(mobile);
			var email = '<div>'+this.controls.email.display('wide')+'</div>'; this.state.target.find('#contact-form-email').after(email);
			var done = this.controls.done.display('cta_2');
			this.state.target.find('#contact-form-submit').after(done); // (*cfs*)

			var lang = this.controls.lang.display('small');
		var footer = '<div>'+lang+'</div>';

		// var busy = '<div id="'+this.eids.busy+'" class="busy" style="display:none; position:absolute; top:0; left:0; bottom:0; right:0; z-index:2;">'+'</div>';
		var inner = '<div class="contact-form" style="position:relative;">'+footer+'</div>';

		this.state.target.find('#contact-form-misc').after(inner);
		this.controls.captcha.display();
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},

	// event handling
	typing: function(newdigits, statereport) {
		// statereport like { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
		// console.log(newdigits, statereport);
		var isformvalid = this.controls.validation();
		// console.log('overall valid:'+isformvalid);
		this.controls.done.enable(isformvalid);
	},
	capclick: function() {
		var isformvalid = this.controls.validation();
		// console.log('overall valid:'+isformvalid);
		this.controls.done.enable(isformvalid);
	},
	save: function() {
		if(this.state.busy) return;
		this.state.busy = true;
			let ixltag = this.state.xl?' > xl':'';
		var caption = this.state.target.find('#contact-form-busy'+ixltag).html();
		this.controls.done.set(caption);

		if(!this.controls.validation()) return;
		var names = { pass:{pagename:'pagename', version:'version', accmanager:'am', client:'cl', cloginid:'lid'}, 
				msg:'msg', name:'name', company:'company', special:'special', mobile:'mobile', email:'email', captcha:{caid:'caid',cach:'cach',lang:'calang'}, lang:'lang' };
		var post = new A_ps(this.controls, names, '../assets/php/sponsor_post.php', { onreply:new A_cb(this,this.sent, false, false, 1000), ontimeout:new A_cb(this,this.failed) }, {/*options*/});
		
	},
	sent: function() {
		
			let ixltag = this.state.xl?' > xl':'';
		var caption = this.state.target.find('#contact-form-sent'+ixltag).html();
		this.controls.done.set(caption);

		// report event conversion to Ad Words
		//gtag('event', 'conversion', {'send_to': 'AW-966604247/oNwUCILnr4cDENfr9MwD'});

		console.log('C_iContact_sponsor::sent, ajax returned here');
		
		var handler = new A_hn({reload:new A_cb(this, this.reload)}); setTimeout(handler.reload, 2000);
	},
	reload:function() {
		// this.controls.msg.clear();
		this.state.busy = false;
			let ixltag = this.state.xl?' > xl':'';
		var caption = this.state.target.find('#contact-form-submit'+ixltag).html();
		this.controls.done.set(caption);
		
		var handler = new A_hn({popup:new A_cb(this, this.popup)}); setTimeout(handler.popup, 100);
	},
	popup:function() {
		let name = this.controls.name.digits();
		console.log('name:',name);
		$(document).find('#himher').html(name);
		$('#thanks_screen').css('display', 'flex');
	},
	failed: function() { 
		this.state.busy = false;
		console.log('FAILED');
	},
	insert: function(i) { return this.field.insert(i); },
	focus: function(set) { return this.field.focus(set); },
	getpost: function() { return this.controls.getpost(); }
}
