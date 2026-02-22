
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


// Must be used in combination with captcha.php
//


function C_iCaptcha(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { capchoice:false };
	this.eids = { h:eid+'_h', caid:eid+'_caid', cach:eid+'_cach', lang:eid+'_lang' };
	this.elements = new A_el();

	this.state = C_iCaptcha.defauts.align(preset = preset || {});
	
	
		var hideparams = !this.state.xl;
	var caid = new C_iEDIT(this.eids.caid, false, { digits:this.state.caid, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	var cach = new C_iEDIT(this.eids.cach, false, { digits:this.state.capchoice, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	
	this.controls = new A_ct({ caid:caid, cach:cach, lang:lang });
	this.handlers	= new A_hn( { capclick:new A_cb(this, this.capclick) } );
	
	this.which = 'C_iCaptcha[]';
}
C_iCaptcha.defauts = new A_df( { target:false, caid:99, lang:'en', capchoice:0, xl:false } );
C_iCaptcha.prototype = {
	display: function(e) {
				
			var caid = this.controls.caid.display('small');
			var cach = this.controls.cach.display('small');
			var lang = this.controls.lang.display('small');
		var footer = '<div>'+caid+cach+lang+'</div>';
		
		this.state.target.find('#captcha-misc').after(footer);
		
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		var context = this;
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } ); // show for interactive translations
		$(this.state.target).find('input.captcha').each(
			function() {
				$(this)
				.mouseover( function(){ $(this).addClass('xlpoint');} )
				.mouseout( function(){ $(this).removeClass('xlpoint');} )
				.click( context.handlers.capclick )
				} 
		)
		
	},
	
	// event handling
	capclick: function(e) {		
		this.controls.cach.set(e.currentTarget.value);
		$(this.state.target).find('div.fa-lock-alt').removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
		this.state.capchoice = e.currentTarget.value;
		if(this.callbacks.capchoice) this.callbacks.capchoice.cb(this);
	},
	getpost: function() { return this.controls.getpost(); },	
	valid: function() { 
		if(this.state.capchoice!=0) return true; // note that this indicates only if a choice has been made. Checking on the right answer only at serverside: 
		return false;
	}
}

