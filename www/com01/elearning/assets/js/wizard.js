
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


// Must be used in combination with wizardform.php
//
// Dependances: moblib.js



///////////////////    G E N E R I C

function C_iWradio(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { onchoice:false };
	this.eids = { ch:eid+'_ch', lang:eid+'_lang' };
	this.elements = new A_el();

	this.state = C_iWradio.defauts.align(preset = preset || {});
	
		var hideparams = !this.state.xl;
	var choice = new C_iEDIT(this.eids.ch, false, { digits:this.state.choice, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	
	this.controls = new A_ct({ choice:choice, lang:lang });
	this.handlers	= new A_hn( { touch:new A_cb(this, this.touch) } );
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iWradio::Could not find target form: #'+this.state.target+'_form');
	this.which = 'C_iWradio['+this.state.target+']';
	
}
C_iWradio.defauts = new A_df( { parent:false, target:false, lang:'en', choice:'x', xl:false, mandatory:true, locker:true } );
C_iWradio.prototype = {
	display: function(e) {
				
			var choice = this.controls.choice.display('small');
			var lang = this.controls.lang.display('small');
		var footer = '<div class="'+this.state.target+' wz-status">'+choice+lang+'</div>';
		
		this.form.find('#'+this.state.target+'_misc').after(footer);
		
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		var context = this;
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } ); // show for interactive translations
		$(this.form).find('input.'+this.state.target).each(
			function() {
				$(this)
				.mouseover( function(){ $(this).addClass('xlpoint');} )
				.mouseout( function(){ $(this).removeClass('xlpoint');} )
				.click( context.handlers.touch )
				} 
		)
		
	},
	
	// event handling
	touch: function(e) {	
		var value = e.currentTarget.value;
		this.controls.choice.set(value);
		
		this.form.find('h3.confirm').each( function() { $(this).hide(); } );
		this.form.find('#'+this.state.target+'_tip_'+value).show();
		
		if(this.state.locker) $(this.form).find('div.fa-lock-alt').removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
		if(this.callbacks.onchoice) this.callbacks.onchoice.cb(this);
	},
	valid: function() { if(!this.state.mandatory) return true; else if(this.controls.choice.getpost()=='x') return false; else return true;  },
	getpost: function() { return this.controls.choice.getpost(); }
}



function C_iPro(eid, callbacks, preset) { // radio mode but using pictures
	
	this.callbacks = callbacks || { onchoice:false };
	this.eids = { ch:eid+'_ch', lang:eid+'_lang' };
	this.elements = new A_el();

	this.state = C_iPro.defauts.align(preset = preset || {});
	
		var hideparams = !this.state.xl;
	var choice = new C_iEDIT(this.eids.ch, false, { digits:this.state.choice, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	this.controls = new A_ct({ choice:choice, lang:lang });
	this.handlers	= new A_hn( { touch:new A_cb(this, this.touch) } );
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iPro::Could not find target form: #'+this.state.target+'_form');
		// else console.log('C_iPro::Found target form: #'+this.state.target+'_form');
		
	this.which = 'C_iPro['+this.state.target+']';
}
C_iPro.defauts = new A_df( { parent:false, target:false, lang:'en', choice:'x', xl:false, mandatory:true, locker:true } );
C_iPro.prototype = {
	display: function(e) {
				
				var choice = this.controls.choice.display('small');
				var lang = this.controls.lang.display('small');
			var footer = '<div class="'+this.state.target+' wz-status">'+choice+lang+'</div>';
		
				var elname = '#'+this.state.target+'_form_status';
			var status = $(this.state.parent).find(elname);
			// console.log(status);
		if(!status.length) console.log('C_iPro::Could not find status input anchor point: |'+elname+'|');
			else status.after(footer);
	},
	activate: function() { 
		
		// console.log('activate: '+this.state.target );
		this.elements.collect(this.eids.ch);
		this.controls.activate(); 
		var context = this;
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } ); // show for interactive translations
		$(this.form).find('div.'+this.state.target).each(
			function() {
				// console.log(this);
				$(this)
				.mouseover( function(){ $(this).addClass('xlpoint');} )
				.mouseout( function(){ $(this).removeClass('xlpoint');} )
				.click( context.handlers.touch )
				} 
		)
	},
	hide: function() { this.form.hide(); },
	show: function() { this.form.show(); },
	
	// event handling
	touch: function(e) {
		
		var value = $(e.currentTarget).attr('value');
		this.controls.choice.set(value);
		this.state.choice = value;
		
	console.log('C_iPro touch :'+value,' cb:'+this.callbacks.onchoice);
		
		this.form.find('div.'+this.state.target).each( function() { $(this).addClass('reduced'); } );
		this.form.find('#'+this.state.target+'_'+value).removeClass('reduced');
		
		this.form.find('div.'+this.state.target).each( function() { $(this).removeClass('selected'); } );
		this.form.find('#'+this.state.target+'_'+value).addClass('selected');
		
		this.form.find('.confirm').each( function() { $(this).hide(); } );
		this.form.find('#'+this.state.target+'_tip_'+value).show();
		this.form.find('#'+this.state.target+'_tip2_'+value).show();
		
		if(this.state.locker) $(this.form).find('div.fa-lock-alt').removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
		if(this.callbacks.onchoice) this.callbacks.onchoice.cb(this);
	},
	valid: function() { if(!this.state.mandatory) return true; else if(this.controls.choice.getpost()=='x') return false; else return true;  },
	getpost: function() { return this.controls.choice.getpost(); }
}



function C_iCheck(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { onchoice:false };
	this.eids = { ch:eid+'_ch', lang:eid+'_lang' };
	this.elements = new A_el();

	this.state = C_iCheck.defauts.align(preset = preset || {});
	
		var hideparams = !this.state.xl;
	var choice = new C_iEDIT(this.eids.ch, false, { digits:this.state.choice, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	
	this.controls = new A_ct({ choice:choice, lang:lang });
	this.handlers	= new A_hn( { touch:new A_cb(this, this.touch) } );
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iCheck::Could not find target form: #'+this.state.target+'_form');
	this.which = 'C_iCheck['+this.state.target+']';
	
}
C_iCheck.defauts = new A_df( { parent:false, target:false, lang:'en', choice:'x', xl:false, mandatory:true, locker:true } );
C_iCheck.prototype = {
	display: function(e) {
				
			var choice = this.controls.choice.display('small');
			var lang = this.controls.lang.display('small');
		var footer = '<div class="'+this.state.target+' wz-status">'+choice+lang+'</div>';
		
		this.form.find('#'+this.state.target+'_misc').after(footer);
		
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		var context = this;
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } ); // show for interactive translations
		$(this.form).find('input.'+this.state.target).each(
			function() {
				$(this)
				.mouseover( function(){ $(this).addClass('xlpoint');} )
				.mouseout( function(){ $(this).removeClass('xlpoint');} )
				.click( context.handlers.touch )
				} 
		)
		this.touch();
		
	},
	
	// event handling
	touch: function(e) {	
		var stack = [];
		$(this.form).find('input.'+this.state.target).each( function() { if(this.checked) stack.push(this.value); } );
		
		this.form.find('h3.confirm').each( function() { $(this).hide(); } );
		if(stack.length) {
			for(var x in stack) this.form.find('#'+this.state.target+'_tip_'+stack[x]).show();
			this.form.find('#'+this.state.target+'_tip_misc').show();
		}
		else this.form.find('#'+this.state.target+'_tip_none').show();
		
		
		stack = stack.join('!');
		this.controls.choice.set(stack);
		
		if(this.state.locker) $(this.form).find('div.fa-lock-alt').removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
		if(this.callbacks.onchoice) this.callbacks.onchoice.cb(this);
	},
	valid: function() { if(!this.state.mandatory) return true; else if(this.controls.choice.getpost()=='x') return false; else return true;  },
	getpost: function() { return this.controls.choice.getpost(); }
}




///////////////////    S P E C I F I C 


function C_iMulti(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { onchange:false };
	this.eids = { ismulti:eid+'_ismulti', singdel:eid+'_singldel', comanaged:eid+'_comangd', howmany:eid+'_hmany' 
			, agen1:eid+'_ag1', agen2:eid+'_ag2', agen3:eid+'_ag3', agen4:eid+'_ag4', agen5:eid+'_ag5' };
	this.elements = new A_el();

	this.state = C_iMulti.defauts.align(preset = preset || {});
	
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
	if(!this.form.length) console.log('C_iMulti::Could not find target form: #'+this.state.target+'_form');
	
	
	var ismulti = new C_iPro(this.eids.ismulti, { onchoice:new A_cb(this,this.ismulti) }, { target:'ismulti', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });
	var singdel = new C_iPro(this.eids.singdel, { onchoice:new A_cb(this,this.singdel) }, { target:'singdel', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });
	var comanaged = new C_iPro(this.eids.comanaged, { onchoice:new A_cb(this,this.comanaged) }, { target:'comanaged', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });
	var howmany = new C_iPro(this.eids.howmany, { onchoice:new A_cb(this,this.howmany) }, { target:'howmany', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });



		// var ixltag = this.state.xl?' > xl':'';
	// var phs = { // retrieve placeholders from translatable dom items
		// agen1:	this.form.find('#'+this.state.target+'-form-agenda1'+ixltag).html(),
		// agen2:	this.form.find('#'+this.state.target+'-form-agenda2'+ixltag).html(),
		// agen3: this.form.find('#'+this.state.target+'-form-agenda3'+ixltag).html(),
		// agen4:	this.form.find('#'+this.state.target+'-form-agenda4'+ixltag).html(),
		// agen5:	this.form.find('#'+this.state.target+'-form-agenda5'+ixltag).html()
		
		// <div class="" id="multi_wrapper" style="display:none;">			<!--    Agenda names input fields     -->
			// <h3 class="ixl" id="multi-form-agenda1" style="display:none;"><?=X('placeholder_agenda1', 'wizard')?></h3>
			// <h3 class="ixl" id="multi-form-agenda2" style="display:none;"><?=X('placeholder_agenda2', 'wizard')?></h3>
			// <h3 class="ixl" id="multi-form-agenda3" style="display:none;"><?=X('placeholder_agenda3', 'wizard')?></h3>
			// <h3 class="ixl" id="multi-form-agenda4" style="display:none;"><?=X('placeholder_agenda4', 'wizard')?></h3>
			// <h3 class="ixl" id="multi-form-agenda5" style="display:none;"><?=X('placeholder_agenda5', 'wizard')?></h3>
		// </div>
	// }

	
	/* blue zone */
	// var agen1 = new C_iEDIT(this.eids.agen1, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.agen1, type:INPUT_ALPHA, enabled:true, mandatory:true, max:32 }); 
	// var agen2 = new C_iEDIT(this.eids.agen2, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.agen2, type:INPUT_ALPHA, enabled:true, mandatory:true, max:32 }); 
	// var agen3 = new C_iEDIT(this.eids.agen3, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.agen3, type:INPUT_ALPHA, enabled:true, max:32 }); 
	// var agen4 = new C_iEDIT(this.eids.agen4, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.agen4, type:INPUT_ALPHA, enabled:true, max:32 }); 
	// var agen5 = new C_iEDIT(this.eids.agen5, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.agen5, type:INPUT_ALPHA, enabled:true, max:32 }); 
	
	
		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	this.controls = new A_ct({ ismulti:ismulti, singdel:singdel, comanaged:comanaged, howmany:howmany, lang:lang }); // agen1:agen1, agen2:agen2, agen3:agen3, agen4:agen4, agen5:agen5
	this.which = 'C_iMulti['+this.state.target+']';
}
C_iMulti.defauts = new A_df( { parent:false, target:false, xl:false, mandatory:true } );
C_iMulti.prototype = {
	display: function(e) {
			
			this.controls.ismulti.display('wide');
			this.controls.singdel.display('wide');
			this.controls.comanaged.display('wide');
			this.controls.howmany.display('wide');
			
			// var agen1 = '<div>'+this.controls.agen1.display('wide')+'</div>'; this.form.find('#'+this.state.target+'-form-agenda1').after(agen1);
			// var agen2 = '<div>'+this.controls.agen2.display('wide')+'</div>'; this.form.find('#'+this.state.target+'-form-agenda2').after(agen2);
			// var agen3 = '<div>'+this.controls.agen3.display('wide')+'</div>'; this.form.find('#'+this.state.target+'-form-agenda3').after(agen3);
			// var agen4 = '<div>'+this.controls.agen4.display('wide')+'</div>'; this.form.find('#'+this.state.target+'-form-agenda4').after(agen4);
			// var agen5 = '<div>'+this.controls.agen5.display('wide')+'</div>'; this.form.find('#'+this.state.target+'-form-agenda5').after(agen5);
		
				var lang = this.controls.lang.display('small');
			var footer = '<div class="'+this.state.target+' wz-status">'+lang+'</div>';
		var inner = '<div class="'+this.state.target+'-form" style="position:relative;">'+footer+'</div>';
		
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } );
		this.controls.comanaged.hide();
		this.controls.howmany.hide();
	},
	
	// event handling
	ismulti: function(ipro) { 
		var choice = ipro.state.choice;
		console.log('C_iMulti::ismulti',choice); 
		switch(choice) {
			case 'single': 
				this.controls.comanaged.hide(); this.controls.singdel.show();
				this.controls.howmany.hide();
				break;
			case 'ismulti': 
				this.controls.comanaged.show(); this.controls.singdel.hide();
				this.controls.howmany.show();
				break;
		}
		console.log('C_iMulti global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);

	},
	singdel: function(ipro) { 
		var choice = ipro.state.choice;
		console.log('C_iMulti::singdel',choice);
		console.log('C_iMulti global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	comanaged: function(ipro) { 
		var choice = ipro.state.choice;
		console.log('C_iMulti::comanaged',choice);
		console.log('C_iMulti global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);		
	},
	howmany: function(ipro) { 
		var choice = ipro.state.choice;
		console.log('C_iMulti::howmany',choice);
		console.log('C_iMulti global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);		
	},

	getpost: function() { return this.controls.getpost(); },
	valid: function() { 
		if(!this.controls.ismulti.valid()) return false;
		if(this.controls.ismulti.getpost()=='single') return this.controls.singdel.valid();
		if(this.controls.ismulti.getpost()=='ismulti') return this.controls.comanaged.valid();
		return false;
	}
}



function C_iEresa(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { onchange:false };
	this.eids = { wisheresa:eid+'_eresayesno', haswebsite:eid+'_hasweb', webname:eid+'_webname' };
	this.elements = new A_el();

	this.state = C_iEresa.defauts.align(preset = preset || {});
	
	this.form = $(this.state.parent).find('#'+this.state.target);  // which is 
		if(!this.form.length) console.log('C_iEresa::Could not find target form: #'+this.state.target+'_form');
	// console.log('C_iEresa',this.state.target);
	
		var ixltag = this.state.xl?' > xl':'';
	var phs = { // retrieve placeholders from translatable dom items
		phurl:	this.form.find('#'+this.state.target+'-form-urleresa'+ixltag).html()
	}
	
	var eresayesno = new C_iPro(this.eids.eresayesno, { onchoice:new A_cb(this,this.eresayesno) }, { target:'wisheresa', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });
	var haswebyesno = new C_iPro(this.eids.haswebsite, { onchoice:new A_cb(this,this.haswebyesno) }, { target:'haswebsite', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });
	var webname = new C_iEDIT(	this.eids.webname, {onfchange:new A_cb(this,this.typingcname) }, { digits:'', placeholder:phs.phurl, type:INPUT_URL, enabled:true, mandatory:false, max:32 }); 

		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	this.controls = new A_ct({ eresayesno:eresayesno, haswebyesno:haswebyesno, webname:webname, lang:lang });
	this.which = 'C_iEresa['+this.state.target+']';
}
C_iEresa.defauts = new A_df( { parent:false, target:false, xl:false, mandatory:true } );
C_iEresa.prototype = {
	display: function(e) {
			
			this.controls.eresayesno.display('wide');
			this.controls.haswebyesno.display('wide');
				let webname = '<div>'+this.controls.webname.display('wide')+'</div>';
			let t = this.form.find('#'+this.state.target+'-form-urleresa');
			// console.log('C_iEresa:display, t',t);
			t.after(webname);
			
				var lang = this.controls.lang.display('small');	
			var footer = '<div class="'+this.state.target+' wz-status">'+lang+'</div>';
		var inner = '<div class="'+this.state.target+'-form" style="position:relative;">'+footer+'</div>';
		
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(!this.state.xl) this.controls.haswebyesno.hide();
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } );
	},
	
	// event handling
	eresayesno: function(ipro) { 
		var choice = ipro.state.choice;
		console.log('C_iEresa::eresayesno:',choice); 
		switch(choice) {
			case 'no': this.controls.haswebyesno.hide(); break;
			case 'yes': this.controls.haswebyesno.show(); break;
		}
		console.log('C_iEresa global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	haswebyesno: function(ipro) { 
		var choice = ipro.state.choice;
		console.log('C_iEresa::haswebyesno:',choice);  
		
			let f = '#'+this.state.target+'_ownweb_wrapper'; // (*wz01*)
		var w = $(this.form).find(f); if(!w.length) console.log('C_iEresa::Could not find element: '+f);
		if(choice=='yes'||choice=='no') $(w).show(); else $(w).hide();
		$(w).show();

			var isformvalid = this.valid();
			var l = $(this.form).find('div.locker');
		if(isformvalid) $(l).removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
			else $(l).removeClass('fa-lock-open-alt').addClass('fa-lock-alt');
		
		console.log('C_iEresa global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	typingcname: function(newdigits, statereport) {
		// statereport like { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
		console.log('C_iEresa::typingcname:',newdigits,statereport);  
		console.log('C_iEresa global status', this.valid());
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	

	getpost: function() { return this.controls.getpost(); },
	valid: function() { 
		if(!this.controls.eresayesno.valid()) return false;
		if(this.controls.eresayesno.getpost()=='no') return true;
		if(this.controls.haswebyesno.valid()) return this.controls.webname.valid();
		return false;
	}
}




function C_iPaper(eid, callbacks, preset) {  // current agenda is it paper or electronic
	
	this.callbacks = callbacks || { onchange:false };
	this.eids = { curnt:eid+'_curnt', radio:eid+'_radio', pcomm:eid+'_pcomm' };
	this.elements = new A_el();

	this.state = C_iPaper.defauts.align(preset = preset || {});
	
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iPaper::Could not find target form: #'+this.state.target+'_form');
	
	// var paper = new C_iWradio(this.eids.radio, {onchoice:new A_cb(this, this.paperchoice)}, { target:'paper', parent:this.state.parent, lang:preset.lang, xl:this.state.xl, locker:false });	
	var current = new C_iPro(this.eids.curnt, { onchoice:new A_cb(this,this.paperchoice) }, { target:'current', parent:this.state.parent, lang:preset.lang, xl:this.state.xl });
	// var pcomm = new C_iEDIT(this.eids.pcomm, { onfchange:new A_cb(this,this.typing) }, { digits:'', type:INPUT_TEXTAREA, placeholder:'', enabled:false, hidden:true, rows:5, focus:this.state.focus, dblclick:false, mandatory:true, max:512 }); 
	
		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	this.controls = new A_ct({ current:current, lang:lang });
	this.which = 'C_iPaper['+this.state.target+']';
}
C_iPaper.defauts = new A_df( { parent:false, target:false, xl:false, mandatory:true } );
C_iPaper.prototype = {
	display: function(e) {
		
		this.controls.current.display();
		
			// var pcomm = ''+this.controls.pcomm.display('wide')+'';
			// this.form.find('#paper_form_comment').after(pcomm);
		
				// var lang = this.controls.lang.display('small');
			// var footer = '<div>'+lang+'</div>';
		// var inner = '<div class="paper-form" style="position:relative;">'+footer+'</div>';
		
		// this.form.find('#paper_form_misc').after(inner);
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } );
	},
	
	// event handling
	typing: function(newdigits, statereport) {
		// statereport like { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
		var isformvalid = this.controls.validation();
		var e = $(this.form).find('div.locker');
		if(isformvalid) $(e).removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
			else $(e).removeClass('fa-lock-open-alt').addClass('fa-lock-alt');
			
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	paperchoice: function() { 
		var isformvalid = this.valid();
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	getpost: function() { return this.controls.getpost(); },
	valid: function() { 
		if(!this.state.mandatory) return true;
		return this.controls.validation();
	}
}




function C_iAccess(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { onchange:false };
	this.eids = { ovl:eid+'_ovl'
		, fname:eid+'_fname', lname:eid+'_lname', comp:eid+'_comp', mobile:eid+'_mobl', email:eid+'_eml', captcha:eid+'_cpt', lang:eid+'_alng', 
		};
	this.elements = new A_el();

	this.state = C_iAccess.defauts.align(preset = preset || {});
	
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iAccess::Could not find target form: #'+this.state.target+'_form');
	
		var ixltag = this.state.xl?' > xl':'';
	var phs = { // retrieve placeholders from translatable dom items
		fname:	this.form.find('#access-form-fname'+ixltag).html(),
		lname:	this.form.find('#access-form-lname'+ixltag).html(),
		company:this.form.find('#access-form-company'+ixltag).html(),
		mobile:	this.form.find('#access-form-mobile'+ixltag).html(),
		email:	this.form.find('#access-form-email'+ixltag).html()
	}
	
	var fname = new C_iEDIT(this.eids.fname, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.fname, type:INPUT_ALPHA, enabled:true, mandatory:true, max:32 }); 
	var lname = new C_iEDIT(this.eids.lname, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.lname, type:INPUT_ALPHA, enabled:true, mandatory:true, max:32 }); 
	var company = new C_iEDIT(this.eids.comp, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.company, type:INPUT_ALPHA, enabled:true, max:32 }); 
	var mobile = new C_iEDIT(this.eids.mobile, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.mobile, type:INPUT_MOBILE, enabled:true, mandatory:true, max:32 }); 
	var email = new C_iEDIT(this.eids.email, { onfchange:new A_cb(this,this.typing) }, { digits:'', placeholder:phs.email, type:INPUT_EMAIL, enabled:true, mandatory:true, max:32 }); 
	
	
		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	this.controls = new A_ct({ fname:fname, lname:lname, company:company, mobile:mobile, email:email, lang:lang });
	this.which = 'C_iAccess['+this.state.target+']';
}
C_iAccess.defauts = new A_df( { parent:false, target:false, xl:false } );
C_iAccess.prototype = {
	display: function(e) {
		
			var fname = '<div>'+this.controls.fname.display('wide')+'</div>'; this.form.find('#access-form-fname').after(fname);
			var lname = '<div>'+this.controls.lname.display('wide')+'</div>'; this.form.find('#access-form-lname').after(lname);
			var company = '<div>'+this.controls.company.display('wide')+'</div>'; this.form.find('#access-form-company').after(company);
			var mobile = '<div>'+this.controls.mobile.display('wide')+'</div>'; this.form.find('#access-form-mobile').after(mobile);
			var email = '<div>'+this.controls.email.display('wide')+'</div>'; this.form.find('#access-form-email').after(email);
		
				var lang = this.controls.lang.display('small');
			var footer = '<div class="'+this.state.target+' wz-status">'+lang+'</div>';
		var inner = '<div class="access-form" style="position:relative;">'+footer+'</div>';
		
		this.form.find('#access-form-misc').after(inner);
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } );
	},
	geo: function(geo) {
		//geo like  { ip: "81.240.108.84", ct: "Europe", cr: "Belgium", rg: "Brussels Capital", cy: "Brussels", cc: "32", lg: "fr" }
		
	},
	getpost: function() { return this.controls.getpost(); },
	valid: function() { return this.controls.validation(); },
	
	// event handling
	typing: function(newdigits, statereport) {
		// statereport like { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
		var isformvalid = this.controls.validation();
		
		var e = $(this.form).find('div.locker');
		if(isformvalid) $(e).removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
			else $(e).removeClass('fa-lock-open-alt').addClass('fa-lock-alt');
			
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	}
}



function C_iLive(eid, callbacks, preset) {
	
	this.callbacks = callbacks || { onchange:false };
	this.eids = { radio:eid+'_radio', livecomm:eid+'_livecomm' };
	this.elements = new A_el();

	this.state = C_iLive.defauts.align(preset = preset || {});
	
	this.form = $(this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iLive::Could not find target form: #'+this.state.target+'_form');
	
	var live = new C_iWradio(this.eids.radio, {onchoice:new A_cb(this, this.radio)}, { target:'live', parent:this.state.parent, lang:preset.lang, xl:this.state.xl, locker:false });	
	var livecomm = new C_iEDIT(this.eids.livecomm, { onfchange:new A_cb(this,this.typing) }, { digits:'', type:INPUT_TEXTAREA, placeholder:'', enabled:false, rows:5, focus:this.state.focus, dblclick:false, mandatory:false, max:512 }); 
	
		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
	this.controls = new A_ct({ live:live, livecomm:livecomm, lang:lang });
	this.which = 'C_iLive['+this.state.target+']';
}
C_iLive.defauts = new A_df( { parent:false, target:false, xl:false, mandatory:true } );
C_iLive.prototype = {
	display: function(e) {
		
		
			var live = this.controls.live.display('wide');
			var livecomm = '<div>'+this.controls.livecomm.display('wide')+'</div>'; this.form.find('#'+this.state.target+'_tip_comment').after(livecomm);
		
				var lang = this.controls.lang.display('small');
			var footer = '<div class="'+this.state.target+' wz-status">'+lang+'</div>';
		var inner = '<div class="'+this.state.target+'-form" style="position:relative;">'+footer+'</div>';
		
		this.form.find('#'+this.state.target+'_form_misc').after(inner);
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } );
	},
	
	// event handling
	typing: function(newdigits, statereport) {
		// statereport like { valid:this.state.valid, mandatory:this.state.mandatory, filled:this.state.filled };
		// if(this.callbacks.onchange) this.callbacks.onchange.cb(this);  // this field is not mandatory
		
	},
	radio: function(e) { 
		var isformvalid = this.valid();
		
		var e = $(this.form).find('div.locker');
		if(isformvalid) $(e).removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
			else $(e).removeClass('fa-lock-open-alt').addClass('fa-lock-alt');
			
		this.controls.livecomm.enable(true);
		this.form.find('#'+this.state.target+'_tip_comment').show();
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this);
	},
	getpost: function() { return this.controls.getpost(); },
	valid: function() { 
		if(!this.state.mandatory) return true;
		return this.controls.validation();
	}
}






/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//        W r a p p e r     M A I N       f o r m 
//

function C_iWizard(eid, preset) {
	
	this.eids = { ovl:eid+'_ovl'
		, pro:eid+'_ps', slice:eid+'_sl', paper:eid+'_pp', curnt:eid+'_crnt', accs:eid+'_accs'
		, multi:eid+'_mlt', eresa:eid+'_ers', comm:eid+'_cmm', msgs:eid+'_msgs', live:eid+'_lv'
		, geo:eid+'_go', cap:eid+'_cpt', lang:eid+'_lang'
		, done:eid+'_done', busy:eid+'_bsy' 
		};
	this.elements = new A_el();

	this.state = C_iWizard.defauts.align(preset = preset || {});
	this.state.xl = preset.ixl=='on'?true:false; // ixl arrives from $ixl in moblib.php, values are { 'on', 'off' }, we convert it into a boolean for usage in js
	
	if(!this.state.target.length) console.log('C_iWizard::Could not find target html: #'+this.state.target);
	
	var pro 	= new C_iPro(this.eids.pro, 	{onchoice:new A_cb(this, this.onchange)}, 	{ target:'pro', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var paper 	= new C_iPaper(this.eids.paper, {onchange:new A_cb(this, this.onchange)}, 	{ target:'paper', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var geo 	= new C_iGeo(this.eids.geo, 	{report:new A_cb(this, this.geofb)}, 		{ target:'geo', parent:this.state.target, xl:this.state.xl });
	
	var multi 	= new C_iMulti(this.eids.multi, {onchange:new A_cb(this, this.onchange)}, 	{ target:'multi', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var slice 	= new C_iPro(this.eids.slice, 	{onchoice:new A_cb(this, this.onchange)}, 	{ target:'slice', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var access 	= new C_iAccess(this.eids.accs, {onchange:new A_cb(this, this.onchange)}, 	{ target:'access', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	
	var eresa 	= new C_iEresa(this.eids.eresa,{onchange:new A_cb(this, this.onchange)}, 	{ target:'ereservation', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var comm 	= new C_iCheck(this.eids.comm, 	{onchoice:new A_cb(this, this.onchange)},	{ target:'comm', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var live 	= new C_iPro(this.eids.live, 	{onchoice:new A_cb(this, this.onchange)},	{ target:'live2', parent:this.state.target, lang:preset.lang, xl:this.state.xl });
	var captcha = new C_iCaptcha(this.eids.cap, {capchoice:new A_cb(this, this.onchange)}, 	{ lang:preset.lang, target:this.state.target.find('#captcha-form'), caid:preset.caid , ixl:preset.ixl });
	
		var hideparams = !this.state.xl;
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.state.lang, type:INPUT_TEXT, enabled:false, hidden:hideparams }); 
	
		var caption = this.state.target.find('#wizard-submit').html();
	var done = new C_iCLIK(this.eids.done, { click:new A_cb(this, this.save) } , { tag:'div', ui:caption, enabled:false } );
	
	this.controls = new A_ct({ lang:lang, geo:geo, captcha:captcha, pro:pro, slice:slice, paper:paper, access:access, multi:multi, eresa:eresa, comm:comm, live:live, done:done });
	
}
C_iWizard.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
C_iWizard.prototype = {
	display: function(e) {
		
			var done = '<div style="text-align:right; margin-bottom:1em;">'+this.controls.done.display('submit')+'</div>'; 
		this.state.target.find('#wizard-submit').after(done);
		
				var lang = this.controls.lang.display('small');
			var footer = '<div>'+lang+'</div>';
			var busy = '<div id="'+this.eids.busy+'" class="busy" style="display:none; position:absolute; top:0; left:0; bottom:0; right:0; z-index:2;">'+'</div>';
		
		var inner = '<div class="contact-form" style="position:relative;">'+busy+footer+'</div>';
		
		this.state.target.find('#wizard-form-misc').after(inner);
		
		this.controls.pro.display();
		this.controls.paper.display();
		this.controls.geo.display();
		
		this.controls.multi.display();
		this.controls.slice.display();
		this.controls.access.display();
		
		this.controls.eresa.display();
		this.controls.comm.display();
		this.controls.live.display();
		
		this.controls.captcha.display();
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	getpost: function() { return this.controls.getpost(); },
	
	// event handling
	onchange: function(subcontrol) {
		var isformvalid = this.controls.validation();	
		if(1) {
			console.log('          | event: C_iWizard::onchange( '+subcontrol.which+', valid:'+subcontrol.valid()+' )');
			console.log('          | overall validation status: '+isformvalid);
			let e = $(this.state.target).find('#submit_form');
			if(!e.length) console.log('C_iWizard::Could not find target form: #'+this.state.target+'>#submit_form');
		}
		
		$(this.state.target).find('#submit_form').find('div.locker').each(
			function() { $(this).removeClass('fa-lock-open-alt').addClass('fa-lock-alt'); }  // closes all lockers
			// function() { $(this).removeClass('fa-lock-alt').addClass('fa-lock-open-alt'); }  // opens all lockers
		);
			
		for(var cname in this.controls.get) {
			if(cname=='lang') continue;
			if(cname=='done') continue;
			
			var v = this.controls.get[cname].valid();
			var l = $(this.state.target).find('#submit_form').find('#status_'+cname);
	// console.log('#status_'+cname,l);
			if(v) $(l).removeClass('fa-lock-alt').addClass('fa-lock-open-alt').addClass('green');
				else $(l).removeClass('fa-lock-open-alt green').addClass('fa-lock-alt');
		
		}
		this.controls.done.enable(isformvalid); 
		var ok = $(this.state.target).find('#submit_form').find('#wizard-tip-ok');
		var nok = $(this.state.target).find('#submit_form').find('#wizard-tip-nok');
		
		if(isformvalid) { $(ok).show(); $(nok).hide(); } else { $(ok).hide(); $(nok).show(); }
	},
	geofb: function(geo) { 
		//geo like  { ip: "81.240.108.84", ct: "Europe", cr: "Belgium", rg: "Brussels Capital", cy: "Brussels", cc: "32", lg: "fr" }
		this.controls.access.geo(geo);
	},
	
	
	// private
	save: function() {
		this.state.busy = true; $(this.elements.busy).show();
		if(!this.controls.validation()) return;
		var names = { 
			  pro:'pro'
			, paper:{ current:'current' }
			, geo:{ continent:'geo_continent', country:'geo_country', region:'geo_region', city:'geo_city', phonecc:'geo_phonecc', language:'geo_language'}
			
			, multi:{ ismulti:'ismulti', singdel:'singdel', comanaged:'comanaged' }
			, slice:'slice'
			, access: { fname:'fname', lname:'lname', company:'company', mobile:'mobile', email:'email' }
			
			, eresa:{eresayesno:'eresayesno', haswebyesno:'haswebyesno', webname:'webname'}
			, comm:'comm'
			, live:'live'
			
			, captcha:{ caid:'caid',cach:'cach',lang:'calang' }
			, lang:'lang'
			};

		var post = new A_ps(this.controls, names, '../assets/php/wizard_post.php', {onreply:new A_cb(this,this.sent), ontimeout:new A_cb(this,this.failed)}, {/*options*/});
	},
	
	// ajax feedback
	sent: function() { 
		// this.state.busy = false; $(this.elements.busy).hide();
		console.log('C_iWizard::sent, ajax returned here')
	},
	failed: function() { console.log('FAILED') },
	focus: function(set) { return this.field.focus(set); }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////



