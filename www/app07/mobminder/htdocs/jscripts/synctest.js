
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


function loghtml(msgs) {
	msgs = msgs.split(newline);
	var log = '', line, c = 0;
	while(line = msgs.shift()) {
		var p = '<p>';
		if(line.match(tab)) p = '<p style="padding-left:3em; font-size:smaller;">'; // indented lines using chr(9) at server side
		var linec = '<span style="font-size:smaller; color:blue;">'+(c++)+'.&nbsp;</span>';
		log += p+linec+line+'</p>';
	}	
	return log;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C L A S S E S   
//


C_SYNCinit = function(eid, callbacks, presets) {
	this.setup = C_SYNCinit.state.align(presets);
	this.state = C_SYNCinit.defaults.align();
		var b = eid+'_'; 
	this.eids = { wrap:b+'wrap', vfile:b+'vfile', afile:b+'afile', options:b+'options', format:b+'frm', logs:b+'logs', errs:b+'errs'};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { preupload, uploading, uploaded }

	var options = new C_iCRESTA(this.eids.options, { onchange:new A_cb(this, this.onmenu) }, C_SYNCinit.options(), { maxcols:2, maxrows:12, mode:0 } );
	
	var format = new C_iDDWN(this.eids.format, {}, { labels:{csv:'.csv (mobminder format)', xml:'.xml (health L7)', ics:'.ics (standard)' } }, {value:'csv'}); // see (*sy02*)
	
		var feedbacks = { preupload:new A_cb(this, this.vpreupload), uploading:new A_cb(this, this.vuploading), uploaded:new A_cb(this, this.vuploaded) };
	
		var dSv = new C_dS_file();
	var vfile = new C_iFILE(this.eids.vfile, dSv, feedbacks, {postpath:'./sync3/init/visitors.php', timeoutseconds:1800} ); 
	
		var dSa = new C_dS_file();
	var afile = new C_iFILE(this.eids.afile, dSa, feedbacks, {postpath:'./sync3/init/appointments.php', timeoutseconds:1000 } ); 

	this.controls = new A_ct({ options:options, format:format, vfile:vfile , afile:afile });
}
C_SYNCinit.defaults = new A_df({ enabled:true, login:0, pass:0 });
C_SYNCinit.state = new A_df({ enabled:true });
C_SYNCinit.prototype = {
	display: function(css) {
		if(vbs) vlog('synctest.js','C_SYNCinit','display','');
		
			var paddy = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
		
			var options = '<tr>'+this.controls.options.labelled('options')+'</tr>';
			var format = '<tr>'+this.controls.format.labelled('file format', 'alpha14')+'</tr>';
			var vfile = '<tr>'+this.controls.vfile.labelled('visitors')+'</tr>';
			var afile = '<tr>'+this.controls.afile.labelled('reservations')+'</tr>';
						
		var controls = '<table summary="controls" style="margin:0 auto;">'+format+paddy+options+paddy+paddy+vfile+paddy+afile+'</table>';
		
			var logstyle = ' overflow:auto; border:1px solid silver; border-radius:3px; padding:1em 1em';
				var leftlay = '<td>'+controls+'</td>';
					var logs = '<div id="'+this.eids.logs+'" style="min-height:30em; max-height:32em; '+logstyle+'"></div>'
				var rightlay = '<td style="width:99%; border-left:2em solid transparent">'+logs+'</td>';
			var upperscreen = '<tr style="vertical-align:top;">'+leftlay+rightlay+'</tr>';
				var erlog = '<div id="'+this.eids.errs+'" style="color:red; min-height:2em; max-height:2em; '+logstyle+'"></div>'
			var errors = '<tr style="border-top:1em solid transparent;"><td colspan="2">'+erlog+'</td></tr>';
		var layout = '<table summary="layout" style="width:100%;">'+upperscreen+errors+'</table>';
		
		var div = '<div id="'+this.eids.wrap+'" style="margin-top:1em;">'+layout+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		var format = this.controls.format.getpost();
		console.log('C_SYNCinit.activate() format = '+format);
	},
		
	// privates
	logsreset: function() {
		this.elements.logs.innerHTML = '';
		this.elements.errs.innerHTML = '';
		return this;
	},
	logsdisplay: function(errcode, msgs, errmsg) {
		this.elements.logs.innerHTML = loghtml(msgs);
		this.elements.errs.innerHTML = errcode+': '+errmsg;
		return this;
	},
	setlp: function(lp) {
		this.state.login = lp.login;
		this.state.pass = lp.pass;
	},
	
		// menu
	onmenu: function(checked) { 
		this.controls.vfile.reset();
		this.controls.afile.reset();
		this.logsreset();
		if(vbs) vlog('synctest.js','C_SYNCinit','onmenu','');
	},
		
		
		// visitors init feedback
	vpreupload: function() { 
		this.logsreset();
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.options.getstates(['check','clean','merge']);
		var check = checked['check'];
		var clean = checked['clean'];
		var merge = checked['merge'];
		
			var format = this.controls.format.getpost();
			
		if(vbs) vlog('synctest.js','C_SYNCinit','vpreupload','check:'+check+', clean:'+clean+', merge:'+merge+', format:'+format);
		return { login:login, passw:pass, check:check, clean:clean, merge:merge, format:format, web:1 }; // returns the parameters you want to post to the url along with the file
	},
	vuploading: function(name) { 
		if(vbs) vlog('synctest.js','sync_MOB','uploading','');
	},
	vuploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','sync_MOB','uploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('visi_init_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// reservations init feedback
	apreupload: function() { 
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.options.getstates(['check','clean']);
		var check = checked['check'];
		var clean = checked['clean'];
		
			var format = this.controls.format.getpost();
		
		this.logsreset();
		if(vbs) vlog('synctest.js','C_SYNCinit','apreupload','check:'+check+', clean:'+clean+', format:'+format);
		return { login:login, passw:pass, check:check, clean:clean, format:format, web:1 }; // returns the parameters you want to post to the url along with the file
	},
	auploading: function(name) { 
		if(vbs) vlog('synctest.js','sync_MOB','uploading','');
	},
	auploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','sync_MOB','uploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('resa_init_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},

	failed: function() {
		this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	},
	xport: function(filename, filecontent) {
		if(vbs) vlog('synctest.js','C_SYNCinit','xport','filename:'+filename); 
		var uri = 'data:text/xlsx;charset=utf-8,'+encodeURIComponent(filecontent);
		var el = document.createElement('a'); el.href = uri; el.download = filename;
		document.body.appendChild(el); el.click(); document.body.removeChild(el);
	}
}
C_SYNCinit.options = function() {
	var labels = { check:'check mode', clean:'clean up first', merge:'merge init' }; // powers of 2 <=> bitmap posted
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:true, clean:false, merge:false };
	return { order:order, labels:labels, presets:presets, count:count };
}


//////////////////////////////////////////////////////////////////////////////////////////////

C_SYNCupdate = function(eid, callbacks, presets) {
	this.setup = C_SYNCupdate.state.align(presets);
	this.state = C_SYNCupdate.defaults.align();
		var b = eid+'_'; 
	this.eids = { wrap:b+'wrap', desk:b+'desk', options:b+'options', logs:b+'logs', errs:b+'errs', 
		buttons:{ visisync:b+'bt_vsync', resasync:b+'bt_rsync', vemptyack:b+'bt_vemack', aemptyack:b+'bt_aemack', vstime:b+'bt_vstime', astime:b+'bt_astime' },
		files:{ vfile:b+'svfile', afile:b+'safile', avfile:b+'savfile', aafile:b+'saafile'} };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { preupload, uploading, uploaded }
	
	var options = new C_iCRESTA(this.eids.options, { onchange:new A_cb(this, this.onmenu) }, C_SYNCupdate.options(), { maxcols:2, maxrows:12, mode:0 } );
	var visisync = new C_iBUTTON(this.eids.buttons.visisync, new A_cb(this, this.visisync), {caption:'visitors fetch only', enabled:true, width:20, height:2, tabindex:false, tip:'Get mobminder updates only, without local changes upload'});
	var resasync = new C_iBUTTON(this.eids.buttons.resasync, new A_cb(this, this.resasync), {caption:'reservations fetch only', enabled:true, width:20, height:2, tabindex:false, tip:'Get mobminder updates only, without local changes upload'});

		var dSv = new C_dS_file();
	var vfile = new C_iFILE(this.eids.files.vfile, dSv, { preupload:new A_cb(this, this.vpreupload), uploading:new A_cb(this, this.vuploading), uploaded:new A_cb(this, this.vuploaded) }, {postpath:'./sync3/visitors.php', tip:'Upload local changes and get Mobminder changes in return'} ); 
	
		var dSa = new C_dS_file();
	var afile = new C_iFILE(this.eids.files.afile, dSa, { preupload:new A_cb(this, this.apreupload), uploading:new A_cb(this, this.auploading), uploaded:new A_cb(this, this.auploaded) }, {postpath:'./sync3/appointments.php', tip:'Upload local changes and get Mobminder changes in return'} ); 

		var dSv = new C_dS_file();
	var avfile = new C_iFILE(this.eids.files.avfile, dSv, { preupload:new A_cb(this, this.avpreupload), uploading:new A_cb(this, this.avuploading), uploaded:new A_cb(this, this.avuploaded) }, {postpath:'./sync3/acknowledge.php', tip:'Provide remoteIds to Mobminder when your records are created'} ); 
	var vemptyack = new C_iBUTTON(this.eids.buttons.vemptyack, new A_cb(this, this.vemptyack), {caption:'Visitors empty Ack', enabled:true, width:20, height:2, tabindex:false, tip:'Calls /sync3/acknowledge passing no file. This action allows you to read the sync Time and records the sync Time at Mobminder side. Use this call when no new items were passed from Mobminder'});
	var vstime = new C_iBUTTON(this.eids.buttons.vstime, new A_cb(this, this.vstime), {caption:'Get last sync time', enabled:true, width:20, height:2, tabindex:false, tip:'Calls /sync3/time'});
	
		var dSa = new C_dS_file();
	var aafile = new C_iFILE(this.eids.files.aafile, dSa, { preupload:new A_cb(this, this.aapreupload), uploading:new A_cb(this, this.aauploading), uploaded:new A_cb(this, this.aauploaded) }, {postpath:'./sync3/acknowledge.php', tip:'Provide remoteIds to Mobminder when your records are created'} ); 
	var aemptyack = new C_iBUTTON(this.eids.buttons.aemptyack, new A_cb(this, this.aemptyack), {caption:'Reservations empty Ack', enabled:true, width:20, height:2, tabindex:false, tip:'Calls /sync3/acknowledge passing no file. This action allows you to read the sync Time and records the sync Time at Mobminder side. Use this call when no new items were passed from Mobminder'});
	var astime = new C_iBUTTON(this.eids.buttons.astime, new A_cb(this, this.astime), {caption:'Get last sync time', enabled:true, width:20, height:2, tabindex:false, tip:'Calls /sync3/time'});
	
	this.controls = new A_ct({ options:options, visisync:visisync , resasync:resasync, vfile:vfile , afile:afile, avfile:avfile , aafile:aafile, vemptyack:vemptyack, aemptyack:aemptyack, vstime:vstime, astime:astime });
}
C_SYNCupdate.defaults = new A_df({ enabled:true, login:0, pass:0 });
C_SYNCupdate.state = new A_df({ enabled:true });
C_SYNCupdate.prototype = {
	display: function(css) {
		if(vbs) vlog('synctest.js','C_SYNCupdate','display','');
		
			var p = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>'; // padding row
		
			var options = '<tr>'+this.controls.options.labelled('options')+'</tr>';
			
			var visisync = '<tr><td colspan=2>'+this.controls.visisync.display()+'</td></tr>';
			var resasync = '<tr><td colspan=2>'+this.controls.resasync.display()+'</td></tr>';
			
			var vtitle = '<tr><td colspan=2>'+'<h2>Visitors update</h2>'+'</td></tr>';
			var vfile = '<tr>'+this.controls.vfile.labelled('visitors')+'</tr>';
			var afile = '<tr>'+this.controls.afile.labelled('reservations')+'</tr>';
			var vemptyack = '<tr><td colspan=2>'+this.controls.vemptyack.display()+'</td></tr>';
			var vstime = '<tr><td colspan=2>'+this.controls.vstime.display()+'</td></tr>';
			
			var atitle = '<tr><td colspan=2>'+'<h2>Reservations update</h2>'+'</td></tr>';
			var avfile = '<tr>'+this.controls.avfile.labelled('ack visitors')+'</tr>';
			var aafile = '<tr>'+this.controls.aafile.labelled('ack resa')+'</tr>';
			var aemptyack = '<tr><td colspan=2>'+this.controls.aemptyack.display()+'</td></tr>';
			var astime = '<tr><td colspan=2>'+this.controls.astime.display()+'</td></tr>';
			
			var controls = '<table summary="controls" style="margin:0 auto;">'+options+p+vtitle+p+vstime+visisync+p+vfile+avfile+vemptyack+p+p+atitle+p+astime+resasync+afile+aafile+aemptyack+'</table>';
		
			var logstyle = ' overflow:auto; border:1px solid silver; border-radius:3px; padding:1em 1em';
				var leftlay = '<td>'+controls+'</td>';
					var logs = '<div id="'+this.eids.logs+'" style="min-height:40em; max-height:42em; '+logstyle+'"></div>'
				var rightlay = '<td style="width:99%; border-left:2em solid transparent">'+logs+'</td>';
			var upperscreen = '<tr style="vertical-align:top;">'+leftlay+rightlay+'</tr>';
				var erlog = '<div id="'+this.eids.errs+'" style="color:red; min-height:2em; max-height:2em; '+logstyle+'"></div>'
			var errors = '<tr style="border-top:1em solid transparent;"><td colspan="2">'+erlog+'</td></tr>';
		var layout = '<table summary="layout" style="width:100%;">'+upperscreen+errors+'</table>';
		
		var div = '<div id="'+this.eids.wrap+'" style="margin-top:1em;">'+layout+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	setlp: function(lp) {
		this.state.login = lp.login;
		this.state.pass = lp.pass;
	},
	
	// privates
	logsreset: function() {
		this.elements.logs.innerHTML = '';
		this.elements.errs.innerHTML = '';
		return this;
	},
	logsdisplay: function(errcode, msgs, errmsg) {
		this.elements.logs.innerHTML = loghtml(msgs);
		this.elements.errs.innerHTML = errcode+': '+errmsg;
		return this;
	},
	
		// menu
	onmenu: function(checked) { 
		this.logsreset();
		if(vbs) vlog('synctest.js','C_SYNCupdate','onmenu','');
	},
	
	// BUTTONS
	
		// acknowledge without passing a file
	vstime:function() {
		if(vbs) vlog('synctest.js','C_SYNCupdate','vstime','');
		this.logsreset();
		this.controls.vstime.busy(true);
		var data = new C_iPASS({l:this.state.login, p:this.state.pass, w:1, s:'visi'});
		new A_ps({data:data}, {data:{l:'login', p:'passw', s:'class', w:'web'}}, './sync3/time.php', {onreply:new A_cb(this,this.vstimed), ontimeout:new A_cb(this,this.failed)});
	},
	vstimed: function(stream) {
		this.controls.vstime.busy(false);
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		this.logsdisplay(errcode, msgs, errmsg);
	},
	astime:function() {
		if(vbs) vlog('synctest.js','C_SYNCupdate','astime','');
		this.logsreset();
		this.controls.astime.busy(true);
		var data = new C_iPASS({l:this.state.login, p:this.state.pass, w:1, s:'resa'});
		new A_ps({data:data}, {data:{l:'login', p:'passw', s:'class', w:'web'}}, './sync3/time.php', {onreply:new A_cb(this,this.astimed), ontimeout:new A_cb(this,this.failed)});
	},
	astimed: function(stream) {
		this.controls.astime.busy(false);
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// acknowledge without passing a file
	vemptyack:function() {
		if(vbs) vlog('synctest.js','C_SYNCupdate','vemptyack','');
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
				var checked = this.controls.options.getstates(['check']);
			var check = checked['check'];
		var data = new C_iPASS({l:login, p:pass, w:1, c:check, s:'visi'});
		new A_ps({data:data}, {data:{l:'login', p:'passw', s:'class', w:'web', c:'check'}}, './sync3/acknowledge.php', {onreply:new A_cb(this,this.vemptyacked), ontimeout:new A_cb(this,this.failed)});
	},
	vemptyacked: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCupdate','vemptyacked','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('visi_emptyack.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	aemptyack:function() {
		if(vbs) vlog('synctest.js','C_SYNCupdate','aemptyack','');
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
				var checked = this.controls.options.getstates(['check']);
			var check = checked['check'];
		var data = new C_iPASS({l:login, p:pass, w:1, c:check, s:'resa'});
		new A_ps({data:data}, {data:{l:'login', p:'passw', s:'class', w:'web', c:'check'}}, './sync3/acknowledge.php', {onreply:new A_cb(this,this.aemptyacked), ontimeout:new A_cb(this,this.failed)});
	},
	aemptyacked: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCupdate','aemptyacked','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('resa_emptyack.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
	
		// fetch syncs without uploading local changes
	visisync:function() {
		if(vbs) vlog('synctest.js','C_SYNCupdate','visisync','');
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
				var checked = this.controls.options.getstates(['check']);
			var check = checked['check'];
		var data = new C_iPASS({l:login, p:pass, w:1, c:check});
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web', c:'check'}}, './sync3/visitors.php', {onreply:new A_cb(this,this.visisynced), ontimeout:new A_cb(this,this.failed)});
	},
	visisynced: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCupdate','visisynced','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('visi_update_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},	
	resasync:function() {
		if(vbs) vlog('synctest.js','C_SYNCupdate','resasync','');
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
				var checked = this.controls.options.getstates(['check','clean']);
			var check = checked['check'];
		var data = new C_iPASS({l:login, p:pass, w:1, c:check, f:''}); // f:'2016-01-12 01:22:00'
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web', c:'check', f:'fsynct'}}, './sync3/appointments.php', {onreply:new A_cb(this,this.resasynced), ontimeout:new A_cb(this,this.failed)});
	},
	resasynced: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCupdate','resasynced','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('resa_update_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},	

	// FILE TRANSFER: 
	
		// visitors local changes upload feedbacks
	vpreupload: function() { 
		this.logsreset();
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.options.getstates(['check']);
		var check = checked['check'];
		var merge = checked['merge'];
			
		if(vbs) vlog('synctest.js','C_SYNCupdate','vpreupload','check:'+check+', format:csv');
		return { login:login, passw:pass, check:check, merge:merge, format:'csv', web:1 }; // returns the parameters you want to post to the url along with the file
	},
	vuploading: function(name) { 
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploading','');
	},
	vuploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('visi_ack_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// reservations local changes upload feedbacks
	apreupload: function() { 
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.options.getstates(['check']);
		var check = checked['check'];
		
		this.logsreset();
		if(vbs) vlog('synctest.js','C_SYNCupdate','apreupload','check:'+check+', format:csv'); // returns the parameters you want to post to the url along with the file
		return { login:login, passw:pass, check:check, format:'csv', web:1 }; 
	},
	auploading: function(name) { 
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploading','');
	},
	auploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('resa_ack_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},


		// visitors acknowledgement feedbacks
	avpreupload: function() { 
		this.logsreset();
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.options.getstates(['check']);
		var check = checked['check'];
			
		if(vbs) vlog('synctest.js','C_SYNCupdate','vpreupload','check:'+check+', class:visi, format:csv'); // returns the parameters you want to post to the url along with the file
		return { login:login, passw:pass, check:check, class:'visi', format:'csv', web:1 }; 
	},
	avuploading: function(name) { 
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploading','');
	},
	avuploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('visi_init_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// reservations acknowledgement feedbacks
	aapreupload: function() { 
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.options.getstates(['check']);
		var check = checked['check'];
		
		this.logsreset();
		if(vbs) vlog('synctest.js','C_SYNCupdate','apreupload','check:'+check+', class:resa ,format:csv');
		return { login:login, passw:pass, check:check, class:'resa', format:'csv', web:1 }; // returns the parameters you want to post to the url along with the file
	},
	aauploading: function(name) { 
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploading','');
	},
	aauploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','C_SYNCupdate','uploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('resa_init_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},

	// privates

	failed: function() {
		this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	},
	xport: function(filename, filecontent) {
		if(vbs) vlog('synctest.js','sync_MOB','xport','filename:'+filename); 
		var uri = 'data:text/xlsx;charset=utf-8,'+encodeURIComponent(filecontent);
		var el = document.createElement('a'); el.href = uri; el.download = filename;
		document.body.appendChild(el); el.click(); document.body.removeChild(el);
	}
}
C_SYNCupdate.options = function() {
	var labels = { check:'check mode', merge:'clever merge' };
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:{checked:true, tip:'when in checkmode, the sync time is not updated at Mobminder side'}, merge:true };
	return { order:order, labels:labels, presets:presets, count:count };
}


//////////////////////////////////////////////////////////////////////////////////////////////

C_SYNCbackup = function(eid, callbacks, presets) {
	this.setup = C_SYNCbackup.state.align(presets);
	this.state = C_SYNCbackup.defaults.align();
		var b = eid+'_'; 
	this.eids = { wrap:b+'wrap', desk:b+'desk', boptions:b+'boptions', roptions:b+'roptions', logs:b+'logs', errs:b+'errs', 
		datepikr:b+'dpkr', days:b+'days',
		buttons:{ visibckp:b+'bt_vsync', resabckp:b+'bt_rsync', fullbckp:b+'bt_fsync' },
		files:{ bfile:b+'svfile' } };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { preupload, uploading, uploaded }
	
	var boptions = new C_iCRESTA(this.eids.boptions, { onchange:new A_cb(this, this.onmenu) }, C_SYNCbackup.boptions(), { maxcols:2, maxrows:12, mode:0 } );
	var roptions = new C_iCRESTA(this.eids.roptions, { onchange:new A_cb(this, this.onmenu) }, C_SYNCbackup.roptions(), { maxcols:2, maxrows:12, mode:0 } );
	var visibckp = new C_iBUTTON(this.eids.buttons.visibckp, new A_cb(this, this.visibckp), {caption:'visitors fetch only', enabled:true, width:20, height:2, tabindex:false, tip:'Get mobminder backup for visitors only'});
	var resabckp = new C_iBUTTON(this.eids.buttons.resabckp, new A_cb(this, this.resabckp), {caption:'reservations fetch only', enabled:true, width:20, height:2, tabindex:false, tip:'Get mobminder backup for appointments only'});
	var fullbckp = new C_iBUTTON(this.eids.buttons.fullbckp, new A_cb(this, this.fullbckp), {caption:'obtain full backup', enabled:true, width:20, height:2, tabindex:false, tip:'Get mobminder full backup for appointments linked to visitors'});
	var datepikr = new     C_iDP(this.eids.datepikr, { dayclick:new A_cb(this, this.dpselect) }, {caption:'specific date', display:{abreviation:'full', weekday:false}, tip:'Returns only the specified calendar dates'});
	var days 	 = new   C_iDDWN(this.eids.days, { onselect:new A_cb(this, this.dayselect) }, {labels:{ 1:'1', 2:'2', 5:'5', 7:'7', 14:'14' }}, { value:1, enabled:true } );

		var dSb = new C_dS_file();
	var bfile = new C_iFILE(this.eids.files.bfile, dSb, { preupload:new A_cb(this, this.bpreupload), uploading:new A_cb(this, this.buploading), uploaded:new A_cb(this, this.buploaded) }, {postpath:'./sync3/backup/restore.php', tip:'Uploads a backup to mobminder'} ); 
	
	this.controls = new A_ct({ boptions:boptions, roptions:roptions, visibckp:visibckp, resabckp:resabckp, fullbckp:fullbckp, bfile:bfile, datepikr:datepikr, days:days });
}
C_SYNCbackup.defaults = new A_df({ enabled:true, login:0, pass:0 });
C_SYNCbackup.state = new A_df({ enabled:true });
C_SYNCbackup.prototype = {
	display: function(css) {
		if(vbs) vlog('synctest.js','C_SYNCbackup','display','');
		
			var paddy = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
		
			var backuptitle = '<tr><td colspan=2>'+'<h2>Backup</h2>'+'</td></tr>'+paddy;
			
			var boptions = '<tr>'+this.controls.boptions.labelled('options')+'</tr>';
			var fullbckp = '<tr><td colspan=2>'+this.controls.fullbckp.display()+'</td></tr>'+paddy;
			var visibckp = '<tr><td colspan=2>'+this.controls.visibckp.display()+'</td></tr>'+paddy;
			var resabckp = '<tr><td colspan=2>'+this.controls.resabckp.display()+'</td></tr>';
			var datepikr = '<tr><td class="label textcolor-light" style="white-space:nowrap; text-align:right;">Date</td><td>'+this.controls.datepikr.display()+'</td></tr>';
			var days = '<tr><td class="label textcolor-light" style="white-space:nowrap; text-align:right;">Days</td><td>'+this.controls.days.display()+'</td></tr>';
			
			var restoretitle = paddy+'<tr><td colspan=2>'+'<h2>Restore</h2>'+'</td></tr>'+paddy;
			var roptions = '<tr>'+this.controls.roptions.labelled('options')+'</tr>';
			var bfile = '<tr>'+this.controls.bfile.labelled('restore')+'</tr>';

			
		var controls = '<table summary="controls" style="margin:0 auto;">'+backuptitle+boptions+paddy+fullbckp+visibckp+resabckp+paddy+datepikr+days+paddy+restoretitle+roptions+paddy+bfile+'</table>';
		
			var logstyle = ' overflow:auto; border:1px solid silver; border-radius:3px; padding:1em 1em';
				var leftlay = '<td>'+controls+'</td>';
					var logs = '<div id="'+this.eids.logs+'" style="min-height:40em; max-height:42em; '+logstyle+'"></div>'
				var rightlay = '<td style="width:99%; border-left:2em solid transparent">'+logs+'</td>';
			var upperscreen = '<tr style="vertical-align:top;">'+leftlay+rightlay+'</tr>';
				var erlog = '<div id="'+this.eids.errs+'" style="color:red; min-height:2em; max-height:2em; '+logstyle+'"></div>'
			var errors = '<tr style="border-top:1em solid transparent;"><td colspan="2">'+erlog+'</td></tr>';
		var layout = '<table summary="layout" style="width:100%;">'+upperscreen+errors+'</table>';
		
		var div = '<div id="'+this.eids.wrap+'" style="margin-top:1em;">'+layout+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	setlp: function(lp) {
		this.state.login = lp.login;
		this.state.pass = lp.pass;
	},
	
	// privates
	logsreset: function() {
		this.elements.logs.innerHTML = '';
		this.elements.errs.innerHTML = '';
		return this;
	},
	logsdisplay: function(errcode, msgs, errmsg) {
		this.elements.logs.innerHTML = loghtml(msgs);
		this.elements.errs.innerHTML = errcode+': '+errmsg;
		return this;
	},
	
		// menu
	onmenu: function(checked) { 
		this.logsreset();
		var states = this.controls.boptions.getstates(['archive','unixtime','remotepov','specdates']);
		var verbose = new Array(); for(n in states) verbose.push(n+':'+states[n]); verbose = verbose.join(', ');
		if(vbs) vlog('synctest.js','C_SYNCbackup','onmenu',verbose);
	},
	dpselect: function(jsdate, stamp) {
		if(vbs) vlog('synctest.js','C_SYNCbackup','dpselect','jsdate:'+jsdate.sortable()+', stamp:'+stamp);
	},
	dayselect: function(value) {
		if(vbs) vlog('synctest.js','C_SYNCbackup','dayselect','value:'+value);
	},
	
		// visitors sync feedback
	visibckped: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCbackup','visibckped','error:'+errcode);
		this.controls.visibckp.busy(false);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('mob_visi_backup.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// appointments sync feedback
	resabckped: function(stream) {

		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCbackup','resabckped','error:'+errcode);
		this.controls.resabckp.busy(false);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('mob_resa_backup.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// full appointments along with visitors backup
	fullbckped: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCbackup','fullbckped','error:'+errcode);
		this.controls.fullbckp.busy(false);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('mob_full_backup.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	
		// fetch syncs without uploading local changes
	visibckp:function() {
		if(vbs) vlog('synctest.js','C_SYNCbackup','visibckp','');
		this.controls.visibckp.busy(true);
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
			
				var c = this.controls.boptions.getstates(['archive','unixtime','remotepov']);
		var data = new C_iPASS({l:login, p:pass, w:1, a:c.archive, u:c.unixtime, r:c.remotepov});
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web', a:'archive', u:'unixtime', r:'remotepov'}}, './sync3/backup/visitors.php', {onreply:new A_cb(this,this.visibckped), ontimeout:new A_cb(this,this.failed)});
	},
	resabckp:function() {
		if(vbs) vlog('synctest.js','C_SYNCbackup','resabckp','');
		this.controls.resabckp.busy(true);
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
			
				var c = this.controls.boptions.getstates(['archive','unixtime','remotepov','specdates']);
		var data = new C_iPASS({l:login, p:pass, w:1, a:c.archive, u:c.unixtime, r:c.remotepov, d:c.specdates?this.controls.datepikr.getpost():0});
		new A_ps({data:data, dc:this.controls.days}
				, {data:{l:'login', p:'passw', w:'web', a:'archive', u:'unixtime', r:'remotepov', d:'specdates'}, dc:'nodays' }
				, './sync3/backup/appointments.php'
				, {onreply:new A_cb(this,this.resabckped), ontimeout:new A_cb(this,this.failed)});
	},
	fullbckp:function() {
		if(vbs) vlog('synctest.js','C_SYNCbackup','fullbckp','');
		this.controls.fullbckp.busy(true);
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
			
				var c = this.controls.boptions.getstates(['archive','unixtime','remotepov']);
		var data = new C_iPASS({l:login, p:pass, w:1, a:c.archive, u:c.unixtime, r:c.remotepov});
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web', a:'archive', u:'unixtime', r:'remotepov'}}, './sync3/backup/full.php', {onreply:new A_cb(this,this.fullbckped), ontimeout:new A_cb(this,this.failed)}, {timeout:50000});
	},
	
		// visitors local changes upload feedbacks
	bpreupload: function() { 
		this.logsreset();
		var login = this.state.login;
		var pass = this.state.pass;
		if(!login || !pass) return false; // abort file upload
		
			var checked = this.controls.roptions.getstates(['check']);
		var check = checked['check'];
			
		if(vbs) vlog('synctest.js','C_SYNCbackup','bpreupload','check:'+check+', format:csv');
		return { login:login, passw:pass, check:check, web:1 }; // returns the parameters you want to post to the url along with the file
	},
	buploading: function(name) { 
		if(vbs) vlog('synctest.js','C_SYNCbackup','buploading','');
	},
	buploaded: function(name, errcode, msgs, errmsg) {
		if(vbs) vlog('synctest.js','C_SYNCbackup','buploaded','error:'+errcode);
		
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('backupload_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},

	failed: function() {
		this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	},
	xport: function(filename, filecontent) {
		if(vbs) vlog('synctest.js','sync_MOB','xport','filename:'+filename); 
		var uri = 'data:text/xlsx;charset=utf-8,'+encodeURIComponent(filecontent);
		var el = document.createElement('a'); el.href = uri; el.download = filename;
		document.body.appendChild(el); el.click(); document.body.removeChild(el);
	}
}
C_SYNCbackup.boptions = function() { // backup options
	var labels = { archive:'Archive included', unixtime:'Unix time', remotepov:'Remote sync Ids', specdates:'Specific dates' };
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = {   archive:{checked:false, tip:'includes items older than 4 weeks'}
					, unixtime:{checked:false, tip:'cueIn and cueOut are given in UNIX universal time unit'}
					, remotepov:{checked:false, tip:'includes synchro correlation ids for visitors'}
					, specdates:{checked:false, tip:'returns only the specified calendar dates'}
				};
	return { order:order, labels:labels, presets:presets, count:count };
}
C_SYNCbackup.roptions = function() { // restore options
	var labels = { check:'check mode' }; // powers of 2 <=> bitmap posted
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:{checked:true, tip:'when in checkmode, your file is read and screened but not recorded at Mobminder side'} };
	return { order:order, labels:labels, presets:presets, count:count };
}


//////////////////////////////////////////////////////////////////////////////////////////////

C_SYNCutilities = function(eid, callbacks, presets) {
	this.setup = C_SYNCutilities.state.align(presets);
	this.state = C_SYNCutilities.defaults.align();
		var b = eid+'_'; 
	this.eids = { wrap:b+'wrap', desk:b+'desk', doptions:b+'doptions', logs:b+'logs', errs:b+'errs',
					buttons:{ doublons:b+'bt_uti_doublons', diagnose:b+'bt_uti_diagnose', slinkfix:b+'bt_uti_slinkfix' } };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { preupload, uploading, uploaded }
	
	var doptions = new C_iCRESTA(this.eids.doptions, { onchange:new A_cb(this, this.onmenu) }, C_SYNCutilities.doptions(), { maxcols:2, maxrows:12, mode:0 } );
	var doublons = new C_iBUTTON(this.eids.buttons.doublons, new A_cb(this, this.doublons), {caption:'remove doublons', enabled:true, width:20, height:2, tabindex:false, tip:'Get mobminder backup for visitors only'});
	var diagnose = new C_iBUTTON(this.eids.buttons.diagnose, new A_cb(this, this.diagnose), {caption:'diagnose', enabled:true, width:20, height:2, tabindex:false, tip:'Diagnose your synchronisation data'});
	var slinkfix = new C_iBUTTON(this.eids.buttons.slinkfix, new A_cb(this, this.slinkfix), {caption:'fix sync links', enabled:true, width:20, height:2, tabindex:false, tip:'Removes invalid links from synchronisation data'});

	this.controls = new A_ct({ doptions:doptions, doublons:doublons, diagnose:diagnose, slinkfix:slinkfix });
}
C_SYNCutilities.defaults = new A_df({ enabled:true, login:0, pass:0 });
C_SYNCutilities.state = new A_df({ enabled:true });
C_SYNCutilities.prototype = {
	display: function(css) {
		if(vbs) vlog('synctest.js','C_SYNCutilities','display','');
		
			var paddy = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
		
			var title = '<tr><td colspan=2>'+'<h2>Doublons removal</h2>'+'</td></tr>'+paddy;
			var doptions = '<tr>'+this.controls.doptions.labelled('options')+'</tr>'+paddy;
			var doublons = '<tr><td colspan=2>'+this.controls.doublons.display()+'</td></tr>'+paddy;
		var sections1 = title+doptions+doublons;
		
			var title = '<tr><td colspan=2>'+'<h2>Synchronisation diagnostic</h2>'+'</td></tr>'+paddy;
			var diagnose = '<tr><td colspan=2>'+this.controls.diagnose.display()+'</td></tr>'+paddy;
			var slinkfix = '<tr><td colspan=2>'+this.controls.slinkfix.display()+'</td></tr>'+paddy;
		var sections2 = title+diagnose+slinkfix;
			
		var controls = '<table summary="controls" style="margin:0 auto;">'+sections1+paddy+sections2+'</table>';
		
			var logstyle = ' overflow:auto; border:1px solid silver; border-radius:3px; padding:1em 1em';
				var leftlay = '<td>'+controls+'</td>';
					var logs = '<div id="'+this.eids.logs+'" style="min-height:40em; max-height:42em; '+logstyle+'"></div>'
				var rightlay = '<td style="width:99%; border-left:2em solid transparent">'+logs+'</td>';
			var upperscreen = '<tr style="vertical-align:top;">'+leftlay+rightlay+'</tr>';
				var erlog = '<div id="'+this.eids.errs+'" style="color:red; min-height:2em; max-height:2em; '+logstyle+'"></div>'
			var errors = '<tr style="border-top:1em solid transparent;"><td colspan="2">'+erlog+'</td></tr>';
		var layout = '<table summary="layout" style="width:100%;">'+upperscreen+errors+'</table>';
		
		var div = '<div id="'+this.eids.wrap+'" style="margin-top:1em;">'+layout+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	setlp: function(lp) {
		this.state.login = lp.login;
		this.state.pass = lp.pass;
	},
	
	// privates
	logsreset: function() {
		this.elements.logs.innerHTML = '';
		this.elements.errs.innerHTML = '';
		return this;
	},
	logsdisplay: function(errcode, msgs, errmsg) {
		this.elements.logs.innerHTML = loghtml(msgs);
		this.elements.errs.innerHTML = errcode+': '+errmsg;
		return this;
	},
	
		// menu
	onmenu: function(checked) { 
		this.logsreset();
		var states = this.controls.boptions.getstates(['check','genders','uppercase']);
		var verbose = new Array(); for(n in states) verbose.push(n+':'+states[n]); verbose = verbose.join(', ');
		if(vbs) vlog('synctest.js','C_SYNCutilities','onmenu',verbose);
	},
		// visitors sync feedback
	doublonsed: function(stream) {
		
		this.controls.doublons.busy(false);

		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCutilities','doublonsed','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('doublon_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	diagnosed: function(stream) {
		
		this.controls.diagnose.busy(false);

		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCutilities','diagnosed','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('doublon_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	slinkfixed: function(stream) {
		
		this.controls.slinkfix.busy(false);

		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCutilities','slinkfixed','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('slinkfix_result.csv', filecontent);
		}
		this.logsdisplay(errcode, msgs, errmsg);
	},
	

		// fetch syncs without uploading local changes
	doublons:function() {
		if(vbs) vlog('synctest.js','C_SYNCutilities','doublons','');
		this.controls.doublons.busy(true);
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
			
				var c = this.controls.doptions.getstates(['check','genders','uppercase']);
		var data = new C_iPASS({l:login, p:pass, w:1, c:c.check, g:c.genders, u:c.uppercase});
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web', c:'check', g:'genders', u:'uppercase'}}, './sync3/utilities/doublons.php', { onreply:new A_cb(this,this.doublonsed), ontimeout:new A_cb(this,this.failed)}, {timeout:(300*1000)});
	},
	diagnose:function() {
		if(vbs) vlog('synctest.js','C_SYNCutilities','diagnose','');
		this.controls.diagnose.busy(true);
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
			
		var data = new C_iPASS({l:login, p:pass, w:1});
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web'}}, './sync3/utilities/diagnose.php', {onreply:new A_cb(this,this.diagnosed), ontimeout:new A_cb(this,this.failed)}, {timeout:(30*1000)});
	},
	slinkfix:function() {
		if(vbs) vlog('synctest.js','C_SYNCutilities','slinkfix','');
		this.controls.slinkfix.busy(true);
		this.logsreset();
			var login = this.state.login;
			var pass = this.state.pass;
			
		var data = new C_iPASS({l:login, p:pass, w:1});
		new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web'}}, './sync3/utilities/fixslink.php', {onreply:new A_cb(this,this.slinkfixed), ontimeout:new A_cb(this,this.failed)}, {timeout:(30*1000)});
	},

	failed: function() {
		// this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	},
}

C_SYNCutilities.doptions = function() { // restore options
	var labels = { check:'check mode', genders:'fix genders', uppercase:'fix uppercase' };
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:{checked:true, tip:'when in checkmode, data is scanned and result reported but none of the fix happen in the registry'}
					, genders:{genders:false, tip:'fix genders according to global DB statistics on genders'}
					, uppercase:{uppercase:false, tip:'fix missing uppercase on lastnames and firstnames'}
			};
	return { order:order, labels:labels, presets:presets, count:count };
}


//////////////////////////////////////////////////////////////////////////////////////////////

C_iSYNC = function(eid, callbacks, presets) {
	this.setup = C_iSYNC.defdetup.align(presets);
	this.state = C_iSYNC.defstate.align();
		var b = eid+'_'; 
	this.eids = { wrap:b+'wrap', tabs:b+'tabs', init:b+'init', update:b+'upd', backup:b+'bck', maint:b+'mnt', corr:b+'crl' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { preupload, uploading, uploaded }
	
	var init = new C_SYNCinit(this.eids.init);
	var update = new C_SYNCupdate(this.eids.update);
	var backup = new C_SYNCbackup(this.eids.backup);
	var maint = new C_SYNCutilities(this.eids.maint);
	var corr = new C_iBUTTON(this.eids.corr, new A_cb(this, this.oncorr), {caption:'obtain file', enabled:true, width:20, height:2, tabindex:false, tip:'Calls /sync3/correlators.php'});


	var tabs = new C_iTABS(this.eids.tabs, C_XL.w({0:'correlators', 1:'initialization', 2:'updates', 3:'backup', 4:'utilities'}), false );

	this.controls = new A_ct({ tabs:tabs, init:init, update:update, backup:backup, maint:maint, corr:corr });
		
	this.controls.init.setlp(this.setup.lp);
	this.controls.update.setlp(this.setup.lp);
	this.controls.backup.setlp(this.setup.lp);
	this.controls.maint.setlp(this.setup.lp);
}
C_iSYNC.defdetup = new A_df({ resources:'', ccss:'', lp:false });
C_iSYNC.defstate = new A_df({  });
C_iSYNC.prototype = {
	display: function(css) {
		if(vbs) vlog('synctest.js','C_iSYNC','display','');
		var containers = [];
		var headers = '<div style="text-align:center; margin-top:1em;">'+this.controls.tabs.display()+'</div>';

			var r = this.setup.resources; var hr = new Array(); var ccr = 0;
			for(var h in r[0]) hr.push('<th style="text-align:left;">'+h+'</th>'); ccr = hr.length; hr = '<tr>'+hr.join('')+'</tr>';
			
			var c = this.setup.ccss; var hc = new Array();		
			for(var h in c[0]) hc.push('<th style="text-align:left;">'+h+'</th>'); ccc = hc.length; hc = '<tr>'+hc.join('')+'</tr>';
			
			var rws = new Array();
			for(var x in r) {
				var rw = new Array(); for(var h in r[x]) rw.push('<td>'+r[x][h]+'</td>'); rw = '<tr>'+rw.join('')+'</tr>'; rws.push(rw);
			} rws = rws.join('');
			
			var cws = new Array();
			for(var x in c) {
				var cw = new Array(); for(var h in c[x]) cw.push('<td>'+c[x][h]+'</td>'); cw = '<tr>'+cw.join('')+'</tr>'; cws.push(cw);
			} cws = cws.join('');
		
			var tr = '<tr style="border:1px solid silver;"><td><table style="width:90%; margin:.5em auto;">'+hr+rws+'</table></td></tr>';
			var tc = '<tr style="border:1px solid silver;"><td><table style="width:90%; margin:.5em auto;">'+hc+cws+'</table></td></tr>';
			
				var ttlr = '<tr><td colspan='+ccr+' class="bigger" style="padding-top:.5em;">Resources</td></tr>';
				var ttlc = '<tr><td colspan='+ccc+' class="bigger" style="padding-top:.5em;">Colors</td></tr>';
				var crlb = '<tr><td colspan='+ccc+' class="" style="padding-top:2em;">'+this.controls.corr.display()+'</td></tr>';
				 
			var t = '<table style="width:70%; margin:1em auto;">'+ttlr+tr+ttlc+tc+crlb+'</table>';
			
		containers.push(this.controls.tabs.container(0, t, 'wide deep') );
		containers.push(this.controls.tabs.container(1, this.controls.init.display(), 'wide deep') );
		containers.push(this.controls.tabs.container(2, this.controls.update.display(), 'wide deep') );
		containers.push(this.controls.tabs.container(3, this.controls.backup.display(), 'wide deep') );
		containers.push(this.controls.tabs.container(4, this.controls.maint.display(), 'wide deep') );
		
		return headers+containers.join('');
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	// controls callbakcs
	oncorr: function() {
			var data = new C_iPASS({l:this.setup.lp.login, p:this.setup.lp.pass, w:1});
			new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web'}}, './sync3/correlators.php', {onreply:new A_cb(this,this.correlators), ontimeout:new A_cb(this,this.failed)});	
	},
	
	// ajax callbacks
	correlators: function(stream) {
		var split = stream.split('##'); var msgs = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','C_SYNCbackup','visisynced','error:'+errcode);
		if(errcode==0) {
			var sortout = msgs.extract('<file>','</file>');
			var filecontent = sortout.match;
				msgs = sortout.rest;
			if(filecontent)
				this.xport('mob_sync_correlators.csv', filecontent);
		}
	},
	
	// private
	failed: function() {
		this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	},
	xport: function(filename, filecontent) {
		if(vbs) vlog('synctest.js','sync_MOB','xport','filename:'+filename); 
		var uri = 'data:text/xlsx;charset=utf-8,'+encodeURIComponent(filecontent);
		var el = document.createElement('a'); el.href = uri; el.download = filename;
		document.body.appendChild(el); el.click(); document.body.removeChild(el);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P P    S T A R T E R   
//
sync_MOB = function sync_MOB() { 

	if(vbs) vlog('synctest.js','sync_MOB','constructor',''); 
	mobminder.app = this;
	mobminder.context = { surfer:{name:'syntest', id:'1', language:0 } };
	mobminder.account = { visitorAlias:mobminder.visitor.codes.client };
	C_XL.setContextLanguage();
	
	this.eids = { checkin:'chkin', sync:'sync', ph1:'ph1' };
	this.elements = new A_el();
	this.elements.collect({body:'body'});
		
		var bodymode = is.tactile ? 'touch' : 'mouse';
	$("body").addClass(bodymode).noContext();

	var checkin = new C_iCHECKIN(this.eids.checkin, {xpectedalevel:aLevel.synchro}, { checkin:new A_cb(this, this.checkin)} );

	this.controls = new A_ct( { checkin:checkin, sync:false } );

	this.display();
	this.activate();
}
sync_MOB.prototype = {

	// public functions
	display: function() {
		if(vbs) vlog('synctest.js','sync_MOB','display',''); 		
	
				var lp = '<table style="margin:2em 20em 0 0;">'+this.controls.checkin.display()+'</table>';
			var checkin = '<td style="width:10%; white-space:nowrap;"><div id="'+this.eids.ph1+'">'+lp+'</div></td>';
			var apiversion = '<span style="padding-left:1em;">sync api version 3.0</span>'
			var title = '<td style="vertical-align:top;"><h2 style="padding:1em;">Sync API - Test and utilities</h2>'+apiversion+'</td>';
		var header = '<table style="width:100%"><tr>'+title+checkin+'</tr></table>';
		var sync = '<div id="'+this.eids.sync+'" style="display:none;">'+'</div>';
		
		this.elements.body.innerHTML = header+sync+'';
	},
	activate: function() {
		if(vbs) vlog('synctest.js','sync_MOB','activate',''); 
		this.elements.collect(this.eids);
		this.controls.activate('sync_MOB');
	},
	
	// privates
	show: function(yesno) {
		if(yesno) $(this.elements.sync).show(); else $(this.elements.sync).hide();
	},
	
	// callbacks
	checkin: function(key, language) {
		if(vbs) vlog('smstest.js','sync_MOB','checkin','key:'+key+', language:'+language);
			var lp = this.controls.checkin.getlp();
		
		// now get the correlators
		if(!!key) {
			var data = new C_iPASS({l:lp.login, p:lp.pass, w:1});
			new A_ps({data:data}, {data:{l:'login', p:'passw', w:'web'}}, './sync3/correlators.php', {onreply:new A_cb(this,this.correlators, lp), ontimeout:new A_cb(this,this.failed)});	
		}
	},
	correlators: function(lp, stream) { // stream like: "messages blabla <data></data> blabla##0## process successful, goodbye.## perf report  "
		var split = stream.split('##'); var data = split.shift();
		var errcode = split.shift()|0;
		var errmsg = split.shift();
		if(vbs) vlog('synctest.js','sync_MOB','correlators','');
		if(errcode) return;
		
			var account 	= data.extract('<account>','</account>'); 
			var surfer 		= account.rest.extract('<surfer>','</surfer>'); account = account.match.split('|');
			var file 		= surfer.rest.extract('<file>','</file>'); 		surfer = surfer.match.split('|');
			var data 		= file.rest;									file = file.match;
			
		account = { id:account[0], name:account[1] };
		
		this.elements.ph1.innerHTML = '<h1 style="margin:.8em 1em .6em 0;">'+account.name+' ('+account.id+')</h1><div style="">'+surfer[1]+'</div>';
		
		var rows = file.split(newline); // we are going to split the csv format into js objects
			var headers; var resources = new Array(); var ccsss = new Array(); var fill = false, skip = false;
		for(var x in rows) {
			var r = rows[x]; if(r=='') continue;
			if(skip) { headers = r.split(';'); skip=false; continue; }
			if(r[0]=='#') { 
				var classname = r.substr(1);
				switch(classname) { case 'C_dS_resource': fill = resources; break; case 'C_dS_customCss': fill = ccsss; break; }
				skip = true; continue;
			}
			var expl = r.split(';');
			var o = {}; for(var x in headers) o[headers[x]] = expl[x];
			fill.push(o);
		}
		
		this.controls.sync = new C_iSYNC(this.eids.sync, {}, { resources:resources, ccss:ccsss, lp:lp } );
		this.elements.sync.innerHTML = this.controls.sync.display();
		this.controls.sync.activate();
		this.show(true);
	},
	failed: function() {
		this.controls.pass.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	}
};
sync_MOB.options = function() {
	var labels = { check:'check mode', clean:'clean up first' }; // powers of 2 <=> bitmap posted
	var order = new Array(); for(var x in labels) order.push(x);
	var sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	var count = order.length;
	var presets = { check:true, clean:false };
	return { order:order, labels:labels, presets:presets, count:count };
}

