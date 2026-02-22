
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



// This app sens xml mblox feedbacks to the /feedback/mblox.php file, so to test the code that reads the SMS ack



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P P    S T A R T E R   
//
mblox_MOB = function mblox_MOB() { 

	if(vbs) vlog('synctest.js','mblox_MOB','constructor',''); 
	mobminder.app = this;
	mobminder.context = { surfer:{name:'syntest', id:'1', language:0 } };
	mobminder.account = { visitorAlias:mobminder.visitor.codes.client };
	C_XL.setContextLanguage();
	
	this.eids = { desk:'desk', file:'file', login:'login', pass:'pass', menu:'menu'
		, wrappers:{ vfile:'wr_vfile' } };
	this.elements = new A_el();
	this.elements.collect({body:'body'});
		
		var bodymode = is.tactile ? 'touch' : 'mouse';
	$("body").addClass(bodymode).noContext();

		var lpchanged = new A_cb(this, this.lpchanged, null, null, 1000);
		var lpcleared = new A_cb(this, this.lpcleared);
	var login = new C_iFIELD(this.eids.login, { onfchange:lpchanged, onfclear:lpcleared}, { focus:true, digits:'', type:INPUT_ALPHA, placeholder:'Login' }); 
	var pass = new C_iFIELD(this.eids.pass, { onfchange:lpchanged, onfclear:lpcleared}, { focus:false, digits:'', type:INPUT_ALPHA, placeholder:'Password' }); 
	
		var options = mblox_MOB.options();
	var menu = new C_iCRESTA(this.eids.menu, { onselect:false }, options, { maxcols:2, maxrows:12, mode:0 } );
	
		var dS = new C_dS_file();
	var file = new C_iFILE(this.eids.file, dS, { preupload:new A_cb(this, this.preupload), uploading:new A_cb(this, this.uploading), uploaded:new A_cb(this, this.uploaded) }, {postpath:'../feedback/mblox.php'} ); 
	
	this.controls = new A_ct( { file:file, login:login, pass:pass, menu:menu } );

	this.display();
	this.activate();
}
mblox_MOB.prototype = {

	// public functions
	display: function() {
		if(vbs) vlog('synctest.js','mblox_MOB','display',''); 		
	
			var login = '<tr>'+this.controls.login.labelled('login')+'</tr>';
			var pass = '<tr>'+this.controls.pass.labelled('pass')+'</tr>';
			var paddy = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
		var loginpass = '<table summary="loginpass" style="margin:0 auto">'+login+pass+'</table>';
		
			var menu = '<tr>'+this.controls.menu.labelled('options')+'</tr>';
			var file = '<tr>'+this.controls.file.labelled('file')+'</tr>';
		var visiupload = '<table id="'+this.eids.wrappers.vfile+'" summary="visiupload"  style="margin:0 auto; border-top:2em solid transparent; display:none;">'+menu+paddy+file+'</table>';
				
		var header = '<h2><br/>MBLOX API - Test Interface</h2>';
		var desk = '<div id="'+this.eids.desk+'" class="">'+loginpass+visiupload+'</div>';
		this.elements.body.innerHTML = header+desk;
	},
	activate: function() {
		if(vbs) vlog('synctest.js','mblox_MOB','activate',''); 
		this.elements.collect(this.eids);
		this.controls.activate('mblox_MOB');
	},
	
	// callbacks
	lpchanged: function(digits) { 
		var login = this.controls.login.value();
		var pass = this.controls.pass.value();
		if(login&&pass)	{
			this.controls.pass.busy(true);
			this.checkin(login,pass);
		}
		if(vbs) vlog('synctest.js','mblox_MOB','lpchanged','');
	},
	lpcleared: function() { 
		$(this.elements.wrappers.vfile).hide();
		if(vbs) vlog('synctest.js','mblox_MOB','lpcleared','');
	},
	preupload: function() { 
		var login = this.controls.login.value();
		var pass = this.controls.pass.value();
			var checked = this.controls.menu.getpost(['check','clean']);
		var check = checked['check'];
		var clean = checked['clean'];
		if(!login || !pass) return false; // abort file upload
		return { login:login, passw:pass, check:check, clean:clean }; 
	},
	uploading: function(name) { 
		if(vbs) vlog('synctest.js','mblox_MOB','uploading','');
	},
	uploaded: function(name, error) {
		if(vbs) vlog('synctest.js','mblox_MOB','uploaded','error:'+error);
		if(!error) {
		
		} else {
			// the C_iFILE control displays a msg and re-initializes by itself
		}
	},
	lpvalidation: function(stream) { // ajax feedback
		this.controls.pass.busy(false);
		var key = stream.split('!').shift()|0;
		if(vbs) vlog('mobminder.js','T_logged','validated','key='+key); 
		
		var show = false; if(key) show = true;
		var wrapper = this.elements.wrappers.vfile;
		if(show) $(wrapper).show(); else $(wrapper).hide();
	},
	
	// private
	checkin: function(login, pass) {
		var data = new C_iPASS({l:login, p:pass});
		new A_ps({data:data}, {data:{l:'l', p:'p'}}, '../queries/checkin.php', {onreply:new A_cb(this,this.lpvalidation), ontimeout:new A_cb(this,this.failed)} );
		this.controls.pass.busy(true);
	},
	failed: function() {
		this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	}
	
};
mblox_MOB.options = function() {
	var labels = { check:'check mode', clean:'clean up first' }; // powers of 2 <=> bitmap posted
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:true, clean:false };
	return { order:order, labels:labels, presets:presets, count:count };
}

