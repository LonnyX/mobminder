

function C_iXL(eid, textpreset, preset) {
	
	modal_layer++;
	
	
	this.textpreset = textpreset || { header:'Header', page:'main', tnam:'tech name', xlid:'9999', lang:'en' }
	console.log(this.textpreset.tnam, this.textpreset.xlid)
	
	this.eids = { h:eid+'_h', ovl:eid+'_ovl', mdl:eid+'_mdl', newxl:eid+'_ui', tnam:eid+'_tnam', xlid:eid+'_xlid', lang:eid+'_lang', done:eid+'_done', busy:eid+'_bsy' };
	this.elements = new A_el();

	this.state = C_iXL.defauts.align(preset = preset || {});
			var target = this.textpreset.header;
		var brcount = (target.match(/<br>/g) || []).length; // console.log('BR count:'+brcount)
		var t = target.replace(/\n/gi, ''); // (*xl_1*)
		var t = t.replace(/<br\s*[\/]?>/gi, '\n');
	var newxl = new C_iEDIT(this.eids.newxl, false, { digits:t, type:INPUT_TEXTAREA, rows:preset.rows+(brcount), focus:preset.focus, dblclick:false }); 
	var page = new C_iEDIT(this.eids.page, false, { digits:this.textpreset.page, type:INPUT_TEXT, enabled:false }); 
	var tnam = new C_iEDIT(this.eids.tnam, false, { digits:this.textpreset.tnam, type:INPUT_TEXT, enabled:false }); 
	var xlid = new C_iEDIT(this.eids.xlid, false, { digits:this.textpreset.xlid, type:INPUT_TEXT, enabled:false }); 
	var lang = new C_iEDIT(this.eids.lang, false, { digits:this.textpreset.lang, type:INPUT_TEXT, enabled:false }); 
	var done = new C_iCLIK(this.eids.done, { click:new A_cb(this, this.save) } , { tag:'div', ui:'save', keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.s] } );
	
	this.controls = new A_ct({ newxl:newxl, page:page, tnam:tnam, xlid:xlid, lang:lang, done:done });
	
	this.handlers	= new A_hn( { ovlclick:new A_cb(this, this.escape) } );
	new C_KEY(C_KEY.code.s.escape, this.handlers.ovlclick, 'C_iXL::'+this.eids.h);
}
C_iXL.defauts = new A_df( { rows:4, target:false, busy:false } );
C_iXL.prototype = {
	display: function(e) {
		
		
		
		var header = '<h3>'+this.textpreset.header+'</h3>';
		var newxl = '<div>'+this.controls.newxl.display('wide')+'</div>';
		
			var page = this.controls.page.display('');
			var tnam = this.controls.tnam.display('');
			var xlid = this.controls.xlid.display('small');
			var lang = this.controls.lang.display('small');
			var done = this.controls.done.display('submit');
		var footer = '<table style="width:100%"><tr><td>'+page+xlid+tnam+lang+'</td><td style="text-align:right;">'+done+'</td></tr></table>';
		
		var busy = '<div id="'+this.eids.busy+'" class="busy" style="display:none; position:absolute; top:0; left:0; bottom:0; right:0; z-index:12;">'+'</div>';
		var inner = '<div class="inner" style="height:100%; position:relative;">'+busy+newxl+footer+'</div>';
		
		var overlay = '<div id="'+this.eids.ovl+'" class="xlmodal overlay" style="position:fixed; left:0px; top:0px; width:100%; height:100%; z-index:10;"></div>';
		var modal = '<div id="'+this.eids.mdl+'" class="xlmodal window" style="position:absolute; left:5em; right:5em; min-height:10em; z-index:11;">'+inner+'</div>';
	
		$('body').append(overlay+modal);
		
			var p = $('#'+this.state.target.id).offset(); // catch the clicked object  position
			var h = $('#'+this.state.target.id).height();
		// $('#'+this.eids.mdl).css({top:e.pageY+20}); 
		$('#'+this.eids.mdl).css({top:p.top+h+20}); 
	},
	activate: function() { 
		this.elements.collect(this.eids);
		this.controls.activate(); 
		$(this.elements.ovl).click(this.handlers.ovlclick);
		$(this.state.target).addClass('xlchanging');
	},
	
	// event handling
	escape: function() { 
		if(this.state.busy) return;
		$(this.elements.mdl).remove();
		$(this.elements.ovl).remove();
		C_KEY.cleanUpLayer(modal_layer--);
		$(this.state.target).removeClass('xlchanging');
	},
	save: function() {
		this.state.busy = true; $(this.elements.busy).show();
		if(!this.controls.validation()) return;
		var names = { page:'page', tnam:'tname', newxl:'newxl', xlid:'xlid', lang:'lang' };
		var post = new A_ps(this.controls, names, '../assets/php/xlpost.php', {onreply:new A_cb(this,this.saved), ontimeout:new A_cb(this,this.failed)}, {/*options*/});
	},
	saved: function() { 
		this.state.busy = false; $(this.elements.busy).hide();
			var nt = this.controls.newxl.getpost();
			var t = nt.replace(/\n/gi, '<br>'); // (*xl_1*)
		$(this.state.target).html(t); 
		this.escape(); 
	},
	failed: function() { console.log('FAILED') },
	insert: function(i) { return this.field.insert(i); },
	focus: function(set) { return this.field.focus(set); },
	getpost: function() { return this.controls.getpost(); }
}

