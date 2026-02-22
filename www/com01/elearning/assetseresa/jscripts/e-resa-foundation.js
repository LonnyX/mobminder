//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e_DblButton
//

function e_DblButton(eid, callbacks, preset) { // double buttons horizontally aligned with responsive up/down behaviour
    let b = eid+'_';
this.eids = { wrappers:{left:b+'wlft', right:b+'wrgt'}, buttons:{left:b+'lft', right:b+'rgt'} };
    
    defbutton = { caption:'caption', tip:'tip', csscolor:'c255', cssfa:'exclamation-circle' };
preset = preset || { left:defbutton, right:defbutton };

this.elements = new A_el();
this.callbacks = callbacks || {}; // like { onleft:, onright: }
this.state = e_DblButton.defaults.align(preset);

let buttn = function(eid, callback, preset) {
    callback = callback || { onbutton:false };
    preset = preset || { caption:'caption', tip:'tip', csscolor:'c255', cssfa:'exclamation-circle' }
    
    /*		let symbol = preset.cssfa?'<div class="fa fa-11x fa-'+preset.cssfa+'" style="padding-right:.6em; display:inline-block;"></div>':''; // icon and text
            let captionstyle = 'display:inline-block; min-height:2.5em; padding:.5em .2em; border-radius:0.3em; width:80%; margin:0 auto;';
        let caption = '<div class="'+preset.csscolor+'" style="'+captionstyle+'">'+symbol+'<br/><span style="white-space:auto;">'+preset.caption+'</span></div>';
        let tdstyle = 'width:50%; vertical-align:middle; text-align:center; position:relative; white-space:normal;';
    return new C_iCLIK(eid, { click:callback.onbutton }, { tag:'td', ui:caption, css:'', style:tdstyle, tip:preset.tip }  );*/

    let tmp ='<div class="centered action">'
            +'		<span class="fa lighter fa-1x '+preset.cssfa+' fa-fw"></span><br>'
            +'		<span>'+preset.caption+'</span>'
            +'</div>';

    return new C_iCLIK(eid, { click:callback.onbutton }, { tag:'div', ui:tmp, css:'flexinner col-sm-12 col-md-6 click click-default', style:'', tip:preset.tip }  );
    
}

let left 	= buttn(this.eids.buttons.left, {onbutton:new A_cb(this, this.onleft)}, preset.left);
let right 	= buttn(this.eids.buttons.right, {onbutton:new A_cb(this, this.onright)}, preset.right);

if(vbs) vlog('e-resa.js.js','e_DblButton','constructor',''); 

this.controls = new A_ct({left:left, right:right});
}
e_DblButton.defaults = new A_df({ });
e_DblButton.prototype = {

display: function(css) {
    let l = this.controls.left.display(); // makes responsiveness possible
    let r = this.controls.right.display();
    let b = '<div class="container"><div class="row justify-content-center">'+l+r+'</div></div>';
    //let b = l+r;
    return b;
},
activate: function() {
    this.elements.collect(this.eids);
    this.controls.activate();
    return this;
}, 
enable: function(onoff) { // onoff like { left:onoff, right:onoff }
    for(let lr in onoff) {
        switch(lr) {
            case 'left': this.controls.left.enable(onoff.left); break;
            case 'right': this.controls.right.enable(onoff.right); break; 
        }
    }
},
showbutton: function(onoff) { // onoff like { left:onoff, right:onoff }
    for(let lr in onoff) {
        switch(lr) {
            case 'left': this.controls.left.show(onoff.left); break;
            case 'right': this.controls.right.show(onoff.right); break; 
        }
    }
},

//callbacks
onleft: function() { if(this.callbacks.onleft) this.callbacks.onleft.cb(); },
onright: function() { if(this.callbacks.onright) this.callbacks.onright.cb(); },
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P P    S T A R T E R   
//
// returnVisitorId and returnResaId are set when e-resa is called by payment return url 
// => go directly to terminated section (5)
//
//BSP
e_MOB = function e_MOB(keyId, demo, language,returnVisitorId,returnresaid,computoptransid,familyIdentMode) {
	if(vbs) vlog('e-resa.js','e_MOB','constructor','key:'+keyId); 
	//BSP
	this.state = { key:keyId, returnVisitorId:returnVisitorId, returnResaId:returnresaid,familyIdentMode:familyIdentMode };
	mobminder.app = this;
	mobminder.demo = demo;
	
	this.eids = { desk:'desk', remote:'eresa', buttons:'buttons'
					, sections: { h1:'s-h1', img:'s-img', info:'s-info', action:'s-action', directions:'s-directions', footer:'s-footer'} // Must stay compliant with static html built from e-resa.php
				};
	this.elements = new A_el();
	this.elements.collect({body:'body'});
		
		let bodymode = is.tactile ? 'touch' : 'mouse';
	$("body").addClass(bodymode).noContext();
	
		let book 	= {caption:C_XL.w('book now', {language:language}), tip:'', csscolor:'', cssfa:'fa-plus-circle' };
		let cancel 	= {caption:C_XL.w('cancel resa', {language:language}), tip:'', csscolor:'', cssfa:'fa-trash-alt' }; //fa-times
	let buttons = new e_DblButton(this.eids.buttons, {onleft:new A_cb(this, this.onbook), onright:new A_cb(this, this.oncancel)}, {left:book, right:cancel });

	// this.controls = new A_ct( { book:book, cancel:cancel } );
	this.controls = new A_ct( { buttons:buttons } );

	//BSP
	//hides page while loading data
	//show will be done at the end of C_Process.visidataforreturnurl()
	//
	if (this.state.returnVisitorId!=0)
	{
		$(document.body).hide(); //avoid screen flicker during reload of config
	}

	//BSP
	if (computoptransid) this.calldeletecomputoppayment(computoptransid);

	this.display();
	this.activate();
	
}
e_MOB.prototype = {
	display: function() {
		if(vbs) vlog('e-resa.js','e_MOB','display',''); 
		let desk = '<section id="'+this.eids.desk+'" class="s-desk" style="display:none;">'+'</section>';
		$('#s-footer').before(desk);
		$('#s-action').html(this.controls.buttons.display());
		$('html, body').animate({ scrollTop:$('#body').offset().top }, 600);
	},
	activate: function() {
		if(vbs) vlog('e-resa.js','e_MOB','activate',''); 
		this.controls.activate('C_backARCH');
		this.elements.collect(this.eids);
		
		//BSP
		//asynchronous call to onconfigloaded (which is only used for returnurl mode)
		this.getconfig(new A_cb(this, this.onconfigloaded));
	},
	post: function(controls, names, target, success, failure) { // failure is called in case of timeout OR if a command is received
			let ajaxfeedback = new A_cb(this, this.ajaxfeedback, { success:success, failure:failure });
			let ajaxtimeout = new A_cb(this, this.ajaxtimeout, failure);
			
			if('key' in names) // keep names, do not use ('key' in controls) as controls may have been modified once already
			{ /* this specific post is passing a key (see e.g. the login process) (*40*) */ }
			else { let key = new C_iPASS(mobminder.context.keyId); names['key'] = 'k'; controls['key'] = key; } // then work with the one that came through the configuration
		
		
		let post = new A_ps(controls, names, target, {onreply:ajaxfeedback, ontimeout:ajaxtimeout} );
	},
	
	// ajax feedbacks
	ajaxfeedback: function(callbacks, stream) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		let dscode = stream.extract('<code>','</code>').match; 
		let command = stream.extract('<command>','</command>').match;  

		//BSP old version from eresa & eresa2
        /*if (!this.state.familyIdentMode)
        {
    		if(command) {
	    		if(vbs) vlog('e-resa.js','e_MOB','ajaxfeedback','command:'+command);
		    	return;
		    }
        }
        else //TODO from e-resa2.js???
        {
            if(command) 
			switch(command) {
	        	case 'logoff': 
				// this.controls.top.logout(); 
			    if(callbacks.failure) callbacks.failure.cb(command); return; 
				break;
            }
		}*/

		if(command) {
			switch(command) {
				case 'logoff': if(callbacks.failure) callbacks.failure.cb(command); return; 
			}
		}
			
		let datasets = C_inlineStreaming.createDataSets(dscode);
		if(vbs) vlog('e-resa.js','e_MOB','ajaxfeedback','datasets:',datasets);
		if(callbacks.success) callbacks.success.cb(datasets, stream);
	},	
	ajaxtimeout: function(failure) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		if(vbs) vlog('e-resa.js','e_MOB','ajaxtimeout','');
		// new C_iMSG(C_XL.w('connection failed'));
		// if(failure) failure.cb();
	},	
	
	// private
	//BSP
	getconfig: function(success) {
		if(vbs) vlog('e-resa.js','e_MOB','getconfig','');
		let key = new C_iPASS(this.state.key);
	    mobminder.app.post({key:key}, {key:'k'}, '../_assets/queries/e-config.php',success );
	},
	//BSP
	calldeletecomputoppayment: function(transid) {
		if(vbs) vlog('e-resa.js','e_MOB','calldeletecomputoppayment','');

		let key = new C_iPASS(this.state.key);
		let paymean = new C_iPASS(C_dS_payment.type.cards);
		let id = new C_iPASS(transid);

		mobminder.app.post({key:key,paymean:paymean,id:id}, {key:'k',id:'id', paymean:'paymean'}, '../_assets/delete/payment.php' );
	},

	start: function() { // config has been received from the server
		if(vbs) vlog('e-resa.js','e_MOB','start','account:'+mobminder.account.name); 
		
		$(this.elements.desk).show();
		$(this.elements.sections.img).hide();
		$(this.elements.sections.info).hide();
		$(this.elements.sections.action).hide();
		$(this.elements.sections.directions).hide();
		$('html, body').animate({ scrollTop:$('#body').offset().top }, 600);
		
			let remote = new C_eProcess(this.eids.remote, {ondone:new A_cb(this, this.ondone)});
		
		this.elements.desk.innerHTML = remote.display();
		
		//BSP-----------------------------------------------------
		if (this.state.returnVisitorId==0)
		{
			//classic mode : call old activate function
			remote.activate('e_MOB::config()');
		}
		else
		{
			//in return url mode, call another active function
			remote.activateforreturnurl('e_MOB::config()');
		}
		//BSP-----------------------------------------------------
	},
	
	// controls callbacks
	onbook: function() {
		if(vbs) vlog('e-resa.js','e_MOB','onbook','');
		this.start();
	},
	oncancel: function() {
		if(vbs) vlog('e-resa.js','e_MOB','oncancel','');
		this.start();
	},
	ondone: function() { // a reservation is complete
		
		$(this.elements.desk).hide();
		$(this.elements.sections.img).show();
		$(this.elements.sections.info).show();
		$(this.elements.sections.action).show();
		$(this.elements.sections.directions).show();
		$('html, body').animate({ scrollTop:$('#body').offset().top }, 600);
	},
	//BSP
	onconfigloaded: async function() {
		if(vbs) vlog('e-resa.js','e_MOB','onconfigloaded','');
		
		//await sleep(2000);

		
		//BSP-----------------------------------------------------
		//in return url mode, call directly start function without waiting user click on book or cancel buttons
		if (this.state.returnVisitorId!=0)
		{
			if(vbs) vlog('e-resa.js','e_MOB','onconfigloaded','calling start()...');
			this.start();
		}
		//BSP-----------------------------------------------------
		//this.controls.buttons.enable({right:mobminder.context.surfer.eresaCancel});
		//this.controls.buttons.showbutton({right:mobminder.context.surfer.eresaCancel});

	},
};

/*function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}*/


//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//        S E C O N D     V E R S I O N    2 0 1 5    -    NO FAMILY MANAGEMENT - email is the only identifier
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E S E R V A T I O N    D I S P L A Y 
//
C_eRESA = function(resa, callbacks, preset) {

	this.state = C_eRESA.defauts.align(preset = preset || {});
	this.dataSet = resa; 
	this.callbacks = callbacks; // like { saved:o_callback, escaped:o_callback, failed:o_callback };
	let base = 'eresa_'+resa.id+'_';
	this.eids = { note:base+'note', confirm:base+'confirm', payconiq:base+'payconiq', pay2:base+'pay2', action:base+'action' };
	this.elements 	= new A_el();
	
	if(vbs) vlog('e-resa.js', 'C_eRESA', 'constructor', 'resaId:'+this.dataSet.id+', may delete:'+this.state.maydelete);
	

	//let id			= new C_iPASS({id:this.dataSet.id, archived:0, peerId:0, bank:'visiapps' });
	let id			= new C_iPASS({id:this.dataSet.id, archived:0, peerId:0, bank:'visiapps', amount:this.state.amount,transnote:this.state.transnote,preb:5});
	let schedule	= new C_iPASS({cin:this.dataSet.cueIn, out:this.dataSet.cueOut});
	
	let staff		= new C_iPASS({ bCals:this.dataSet.getstaff(class_bCal), uCals:this.dataSet.getstaff(class_uCal) , fCals:this.dataSet.getstaff(class_fCal) });
	let visitors	= new C_iPASS(this.dataSet.getvisitors());
	let workcodes	= new C_iPASS(this.dataSet.getperformances());
	
	let note 		= mobminder.context.surfer.eresaAllowNote ? new C_iNOTE(this.eids.note, this.dataSet.note) : false;
	
	//if (this.state.confirm) { 
	//let confirm = new C_iBUTTON(this.eids.confirm, new A_cb(this, this.save), { caption:C_XL.w('confirm') } );
	let confirm =  new C_iCLIK(this.eids.confirm, { click:new A_cb(this, this.save) }, { tag:'div', ui:C_XL.w('confirm'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );
	//if (this.state.payconiq)	{ 
	
	//let payconiq = new C_iBUTTON(this.eids.payconiq, new A_cb(this, this.savepayconiq), { caption:C_XL.w('payconiq_payment') } );
	let payconiq =  new C_iCLIK(this.eids.payconiq, { click:new A_cb(this, this.savepayconiq) }, { tag:'div', ui:C_XL.w('payconiq_payment'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );
	
	//if (this.state.pay2)	{ 
	//let pay2 = new C_iBUTTON(this.eids.pay2, new A_cb(this, this.savepay2), { caption:C_XL.w('card_payment') } );
	let pay2 =  new C_iCLIK(this.eids.pay2, { click:new A_cb(this, this.savepay2) }, { tag:'div', ui:C_XL.w('card_payment'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );
	

	this.delayed = new A_cb(this,this.remove,null,new A_cb(this,this.onremove),1000);
	let afterabove = new A_cb(this,this.afterabove);
		
	this.captions = {
		summary: { caption:this.summary(), tip:'', csscolor:'', cssfa:'calendar-check', idle:!this.state.maydelete },
		remove: { caption:C_XL.w('delete'), tip:'', csscolor:'', cssfa:'calendar-times' },
		confrmv: {caption:C_XL.w('e- del confirm'),cssfa:'warning' }
	}
	let action = new C_iSLIDE(this.eids.action, {afterabove:afterabove, onunder:this.delayed }, {above:this.captions.summary, under:this.captions.remove });


	this.controls 	= new A_ct( { id:id, staff:staff, visitors:visitors, workcodes:workcodes, schedule:schedule, note:note, confirm:confirm, action:action, payconiq:payconiq,pay2:pay2} );
	//this.controls 	= new A_ct( { id:id, staff:staff, visitors:visitors, workcodes:workcodes, schedule:schedule, note:note, confirm:confirm, action:action } );
	

}
C_eRESA.defauts = new A_df( { maydelete:false,confirm:true,payconiq:false,pay2:false,amount:0,transnote:'',paymsg:false } );
C_eRESA.prototype = { 
	// public
	summary: function() { // returns time and date for this appointment		
		//BSP
		let cin = this.dataSet.jsDateIn.HHmm();
		let cout = this.dataSet.jsDateOut.HHmm();
		if (is.small)
		{
			let date = C_XL.date(this.dataSet.jsDateIn, {abreviation:'abr', weekday:true, year:false });
			return date+' '+cin+'-'+cout;
		}
		else
		{
			let date = C_XL.date(this.dataSet.jsDateIn, {abreviation:'full', weekday:true, year:true });
			return date+', '+C_XL.w('fromtime',{cap:0})+'&nbsp;'+cin+'&nbsp;'+C_XL.w('to',{cap:0})+'&nbsp;'+cout;
		}
	},
	action: function() { // appears where the list of appointments is displayed for an identified visitor
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'schedule', 'resaId:'+this.dataSet.id);
		return this.controls.action.display();
	},
	display: function() { // appears where you can confirm your new appointment, just before it is saved
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'display', 'resaId:'+this.dataSet.id);
		
		let n = this.controls.note ? this.controls.note.display('','erasa-confirm-note') : '';
		let notefield = '<div>'+n+'</div>';
		
		let paymsg 	= '<div '+(this.state.paymsg?'':'style="display:none;"')+' class="e-msg">'+this.state.paymsg+'</div>';

		//let b1 = this.controls.confirm.display({css:'e-button'});
		let b1 = this.controls.confirm.display();
		b1 = '<div '+(this.state.confirm?'':'style="display:none;"')+' class="e-msg text-center text-sm-left">'+b1+'</div>';
	
		//let b2 = this.controls.payconiq.display({css:'e-button'});
		let b2 = this.controls.payconiq.display();
		b2 = '<div '+(this.state.payconiq?'':'style="display:none;"')+' class="e-msg text-center text-sm-left">'+b2+'</div>';
	
		//let b3 = this.controls.pay2.display({css:'e-button'});
		let b3 = this.controls.pay2.display();
		b3 = '<div '+(this.state.pay2?'':'style="display:none;"')+' class="e-msg text-center text-sm-left">'+b3+'</div>';
	
		return notefield+paymsg+b1+b2+b3;
	},
	activate: function() {
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'activate', 'resaId:'+this.dataSet.id);
		this.controls.activate('C_eRESA');
		this.elements.collect(this.eids);
		//$(this.elements.msgs.confirmsg).show();
		
		
		
	},

	
	// event handling
	save: function() {
		this.setbuttonbusy(true);

		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		let paymean = new C_iPASS(C_dS_payment.type.notset);
		this.controls['paymean']=paymean;

		let names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id', archived:'archived', peerId:'peerId', bank:'bank' }
			, visitors:'visitors', workcodes:'workcodes', note:'note', staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' }, paymean:'paymean' };
		mobminder.app.post(this.controls, names, '../_assets/post/reservation.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) this.dataSet.unregister();
	},
	afterabove: function(isopen) { // control face ui is touched
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'afterabove', 'isopen:'+isopen);
		if(!isopen) { // set back to initial conditions (*ic01*)
			// this.controls.action.caption({under:this.captions.remove});  // pvh 2020: changed behaviour to one click removal, so this caption & callback settings are not necessary anymore
			// this.controls.action.callbacks.onunder = this.delayed;	
		}
	},
	onremove: function() { // first time remove button is hit
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'onremove', '');
		this.controls.action.busy(true);
	},
	remove: function() { // two seconds after button was hit
		this.controls.action.busy(false);
		let names = {id:{id:'id', archived:'archived' } };
		mobminder.app.post(this.controls, names, '../_assets/delete/reservation.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
		
		// pvh 2020: changed behaviour to one click removal
		// this.controls.action.callbacks.onunder = new A_cb(this,this.removeconfirmed); // change initial conditions (*ic01*)
		// this.controls.action.caption({under:this.captions.confrmv});
		// if(vbs) vlog('e-resa.js', 'C_eRESA', 'remove', 'now confirm');
	},
	removeconfirmed: function() { // second time button is hit  // pvh 2020: you never reach here anymore
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'removeconfirmed', '');
		this.controls.action.busy(true);
		let names = {id:{id:'id', archived:'archived' } };
		mobminder.app.post(this.controls, names, '../_assets/delete/reservation.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
	},
	setbuttonbusy(busy){
		if (this.state.confirm) this.controls.confirm.busy(busy);
		if (this.state.payconiq) this.controls.payconiq.busy(busy);
		if (this.state.pay2) this.controls.pay2.busy(busy);
	},
	
	// callbacks
	// ajax callback event handlers
    
	saved: function(dataSets, stream) {
		this.setbuttonbusy(false);
		
		let resas = dataSets['C_dS_reservation'];
		let id = 0; for(id in resas) break;

		
		if(id) { // reservation was properly saved to DB
			if(vbs) vlog('e-resa.js','C_eRESA','saved with id','datasets:',dataSets);
			if(this.callbacks.saved) this.callbacks.saved.cb(dataSets);
			
		} else { // PVH 2022 - you arrive here only in case of overbooking or payconiq error
			if(vbs) vlog('e-resa.js','C_eRESA','saved without id','stream:',stream);
			if(this.callbacks.failed) this.callbacks.failed.cb(stream);
		}
	},
	deleted: function() {
		this.controls.action.remove();
		if(vbs) vlog('e-resa.js','C_eRESA','deleted','');
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dataSet.id);
		if(this.dataSet.id>0) this.dataSet.unregister();
	},
	failed: function(stream) { 
		this.controls.action.busy(false);
	},

	savepayconiq: function() {
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'savepayconiq', '');
		this.setbuttonbusy(true);
		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		let paymean = new C_iPASS(C_dS_payment.type.payconiq);
		this.controls['paymean']=paymean;

		let names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id', archived:'archived', peerId:'peerId', bank:'bank', preb:'preb',amount:'amount',transnote:'transnote' }
			, visitors:'visitors', workcodes:'workcodes', note:'note', staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' }, paymean:'paymean' };
		mobminder.app.post(this.controls, names, '../_assets/post/reservation.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) this.dataSet.unregister();
	},

	savepay2: function() {
		if(vbs) vlog('e-resa.js', 'C_eRESA', 'savepay2', '');
		this.setbuttonbusy(true);
		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		let paymean = new C_iPASS(C_dS_payment.type.cards);
		this.controls['paymean']=paymean;

		let names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id', archived:'archived', peerId:'peerId', bank:'bank', preb:'preb',paymean:'paymean',amount:'amount',transnote:'transnote' }
			, visitors:'visitors', workcodes:'workcodes', note:'note', staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' }, paymean:'paymean' };
		mobminder.app.post(this.controls, names, '../_assets/post/reservation.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) this.dataSet.unregister();
	},
}

//////////////////////////////////////////////////////////////////////////////////////////////
//   P I C K   O U T   F R O M   e - P E R F O R M A N C E S
//

C_ePERF = function(eid, callbacks, preset) {
	this.eids = { picker:eid+'_pickr' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { oneperf: }
	this.state = C_ePERF.defaults.align(preset);
	this.optionspreset = [];
		let which = undefined;
		if(mobminder.context.surfer.eresaWorkcodes) { // this login uses only a subset of the defined e-workcodes
			which = [];
			let ids = mobminder.context.surfer.eresaWorkcodes.split('!');
			for(let x in ids) { let id = ids[x]; which[id] = id; }
		}
			let options = C_dS_workcode.options({eWorkcodes:true, checked:'first', which:which});
	this.opcount = options.count;
	let picker = new C_iCRESTA(this.eids.picker, {onchange:new A_cb(this,this.onpicker)}, options
				, { maxrows:false, maxcols:1, skin:0, title:C_XL.w('workcode'), mode:-1 }
							);

	this.controls = new A_ct({picker:picker});
}
C_ePERF.defaults = new A_df({ });
C_ePERF.prototype = {
	// public
	display: function(css) { 
		if(this.opcount==1) return '';
		else return this.controls.picker.display('select-header '+(css||''));
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		// let id = this.controls.picker.getpost();
		// if(this.callbacks.oneperf) this.callbacks.oneperf.cb([id]);
	},
	getpost: function() {
		let workcode = this.controls.picker.getpost(); 
		return workcode;
	},
	value: function() { return this.getpost(); },
	
	// private
	
	// callbacks
	onpicker: function(id) {
		if(this.callbacks.oneperf) this.callbacks.oneperf.cb([id]);
	}
}


function C_iSLIDE(eid, callbacks, preset) { // double buttons horizontally aligned with responsive up/down behaviour
    let b = eid+'_';
this.eids = { buttons:{above:b+'abv', under:b+'udr' }, own:{ wrappy:b+'wrp', drawer:b+'drw', busy:b+'bsy' } };
    
    defbutton = { caption:'caption', tip:'tip', csscolor:'c255', cssfa:'exclamation-circle' };
preset = preset || { above:defbutton, under:defbutton };

this.elements = new A_el();
this.callbacks = callbacks || {}; // like { onabove:, onunder:, afterabove:, afterunder: }
this.state = C_iSLIDE.defaults.align(preset);

let above 	= this.outer(this.eids.buttons.above, 'above', preset.above, {onbutton:new A_cb(this, this.onabove)});
let under 	= this.outer(this.eids.buttons.under, 'under', preset.under, {onbutton:new A_cb(this, this.onunder)});

if(vbs) vlog('e-resa.js.js','C_iSLIDE','constructor',''); 

this.controls = new A_ct({above:above, under:under});
this.overlay = false;
}
C_iSLIDE.defaults = new A_df({ isopen:false, busy:false });
C_iSLIDE.prototype = {

display: function(css) {
        let l = this.controls.above.display(); // makes responsiveness possible
        let r = this.controls.under.display();
        let d = '<div id="'+this.eids.own.drawer+'" class="slider-drawer" style="width:150%; overflow:hidden; white-space:nowrap; margin:0 auto 0 0;">'+l+r+'</div>';
    let b = '<div id="'+this.eids.own.wrappy+'" class="slider-wrappy" style="height:2.9em; overflow:hidden; position:relative;">'+d+'</div>';
    return b;
},
activate: function() {
    this.elements.collect(this.eids);
    this.controls.activate();
    this.set(false,1); // be sure to have closed controls
    return this;
}, 
enable: function(onoff) { // onoff like { above:onoff, under:onoff }
    for(let lr in onoff) {
        switch(lr) {
            case 'above': this.controls.above.enable(onoff.above); break;
            case 'under': this.controls.under.enable(onoff.under); break; 
        }
    }
},
caption: function(which) { // which like { above:{ caption:'newcaption', cssfa:'exclamation-circle' }, under:{ caption:'newcaption', cssfa:'exclamation-circle' } }
    for(let lr in which) {
        switch(lr) {
            case 'above': this.controls.above.caption(this.inner(which.above)); break;
            case 'under': this.controls.under.caption(this.inner(which.under)); break; 
        }
    }
},
busy: function(onoff) {  // onoff like true or false
    
    let getoverlay = function(eid, callback) {
        callback = callback || { onbusy:false };
        
                let symbol = '<div class="fa fa-2x fa-spinner fa-pulse" style="color:grey; padding-under:.6em; display:inline-block;"></div>'; // icon and text
        
                let bstyle = 'display:table-cell; height:2.9em; vertical-align:middle; text-align:right; padding:.2em 2em; overflow:hidden'; // table-cell makes text vertical middle possible
            let b = '<div id="'+eid+'" style="'+bstyle+'">'+symbol+'<span style="white-space:nowrap;">'+''+'</span></div>';
                b = '<span style="display:inline-block;">'+b+'</span>'; // enables text-align capability, display:inline-block might seem strange but Safari does not consider span an inline-block by default... 
        
        let s = 'z-index:20; display:inline-block; position:absolute; top:0; left:0; width:150%; height:100%; overflow:hidden; text-align:right;';
        
        //return new C_iCLIK(eid, { click:callback.onbusy }, 	{ tag:'div', ui:b, css:'slider-busy', style:s, tip:'please wait, this control is busy...' }  );
		return new C_iCLIK(eid, { click:callback.onbusy }, 	{ tag:'div', ui:b, css:'slider-busy', style:s }  );
    }
    
    if(onoff && !this.state.busy) {
        this.overlay = getoverlay(this.eids.own.busy);
        $(this.elements.own.wrappy).append(this.overlay.display());
        this.overlay.activate();
    }
        else if(onoff==false && this.state.busy) { this.overlay.remove(); this.overlay = false; }
    
    this.state.busy = onoff;
    return this;
},
remove: function() { // remove the control from the DOM
    this.controls.above.remove(); // removes the tip that might be on the screen
    this.controls.under.remove();
    if(this.overlay) this.overlay.remove();
    $(this.elements.own.wrappy).remove();
},

// private
inner: function(preset) { // inner html of a sliding area
            preset = preset || { caption:'caption', cssfa:'exclamation-circle' };
            let symbol = preset.cssfa?'<div class="fa fa-11x fa-'+preset.cssfa+'" style="display:inline-block;"></div>':''; // icon and text
            let bstyle = 'display:table-cell; height:2.5em; vertical-align:middle; padding:.2em .5em; overflow:hidden'; // table-cell makes text vertical middle possible
        let b = '<div style="'+bstyle+'">'+symbol+'<span style="white-space:nowrap; padding-left:0.6em;">'+preset.caption+'</span></div>'; 
            b = '<span style="display:inline-block;">'+b+'</span>'; // enables text-align:right capability
    return b;
},
outer: function(eid, which, skin, callback) { // outer control of a sliding area
            callback = callback || { onbutton:false };
            skin = skin || { caption:'caption', tip:'tip', csscolor:'c255', cssfa:'exclamation-circle' }
        let inner = this.inner(skin);
        let width='100%'; switch(which) { case 'above': width='67%'; break; case 'under': width='33%'; break; };
        let csscl; switch(which) { case 'above': csscl='slider-above'; break; case 'under': csscl='slider-under'; break; };
        let s = 'display:inline-block; width:'+width+'; margin:0; text-align:right;';
    return new C_iCLIK(eid, { click:callback.onbutton }, { tag:'div', ui:inner, css:csscl+' '+skin.csscolor, style:s, tip:skin.tip, idle:skin.idle }  );
},
set: function(o, quick) { 
    if(!this.elements.own.wrappy) return;
        s = quick?0:600;
        o = o||!this.state.isopen;
    let d = $(this.elements.own.drawer).width();
    let w = $(this.elements.own.wrappy).width();
    let u = $(this.controls.under.element()).offset().left;
    
    if(vbs) vlog('e-resa.js.js','C_iSLIDE','onabove','open:'+o+', wrappy:'+w+', drawer:'+d+',  under:'+u);
    if(o) $(this.elements.own.wrappy).animate({ scrollLeft:0 }, s); 
    else $(this.elements.own.wrappy).animate({ scrollLeft:d/3*2  }, s); 
    
    if(this.callbacks.onabove) this.callbacks.onabove.cb(); 
    this.state.isopen = o;
},

//callbacks
onabove: function() { let action = true; if(this.callbacks.onabove) action = this.callbacks.onabove.cb(); if(action) this.set(); if(this.callbacks.afterabove) this.callbacks.afterabove.cb(this.state.isopen); },
onunder: function() { if(this.callbacks.onunder) this.callbacks.onunder.cb(); },
}


C_iSLOT = function(eid, dS_reservation, callbacks, preset) { // a single slot entry
	this.resa = dS_reservation;
	let positive = this.resa.id<0 ? this.resa.id*-1 : this.resa.id;
	
	this.eids = { time:eid+'_'+positive, date:eid+'_date_'+positive };
	this.elements = new A_el();
	this.callbacks = callbacks; // like { selected:A_cb };
	this.state = C_iSLOT.defauts.align(preset);
	C_iSLOT.eids[this.eids.time] = this;
	
	// build up register 
	let midnight = this.resa.midnight;
		
	let fCalsString = this.resa.text.resources.f;  //C_dS_attendee.getResourcesNames(this.resa.id, class_fCal);
	let bCalId 		= this.resa.bCal.id;
	let uCalsString = this.resa.text.resources.u; //C_dS_attendee.getResourcesNames(this.resa.id, class_uCal);
	
	C_iSLOT.register.add(this, 'midnight', midnight, fCalsString, bCalId, uCalsString, this.resa.cueIn);
	
	this.fCalsString = fCalsString;
	this.uCalsString = uCalsString;
	
	//BSP
	//let time = new C_iCLIK(this.eids.date, { click:new A_cb(this, this.selected)} , { ui:this.resa.text.time.cin, tag:'span', style:'min-width:2em; float:left;' } );
	/*let tip;
	if (this.resa.jsDateIn.HHmm()!=this.resa.jsDateIn.HHmm()) 
	{
		let date = C_XL.date(this.resa.jsDateIn, {abreviation:'full', weekday:true, year:!is.tactile });
		let cin = this.resa.jsDateIn.HHmm();
		//let cout = this.resa.jsDateOut.HHmm();
		tip = 'local time : '+date+' '+C_XL.w('at',{cap:0})+'&nbsp;'+cin;
	}else */
	tip = false;

	let time = new C_iCLIK(this.eids.date, { click:new A_cb(this, this.selected)} , { ui:this.resa.jsDateIn.HHmm(), tip:tip, tag:'span', style:'min-width:4.5em; text-align:center; float:left;' } );
	this.controls = new A_ct({time:time});
}
C_iSLOT.defauts = new A_df( { enabled:true, css:'', tip:false } );
C_iSLOT.register = new C_registers({name:'midnight', order:true}); 
C_iSLOT.eids = new Array(); 
C_iSLOT.prototype = { 
	// public
	displayTime: function() {
		C_iSLOT.toBeActivated.add1(this);
		return this.controls.time.display();
	},
	displayResources: function(type, css) {	
		switch(type) {
			case class_bCal: return this.resa.bCal.rColor() +this.resa.bCal.name; break;
			case class_uCal: return this.uCalsString; break;
			case class_fCal: return this.fCalsString; break;
		}
		return '';
	},
	displayDate: function(currentyear) { 
		let date1;
		let displayyear = (currentyear!= this.resa.jsDateIn.getFullYear());
		if (is.small)
		{
			//let date1 = C_XL.date(this.resa.jsDateIn, {abreviation:(is.small?'abr':'full'), weekday:true, year:false } );
			date1 = C_XL.date(this.resa.jsDateIn, {abreviation:'abr', weekday:true, year:false } );
			if (displayyear) date1 = date1+'</br>'+this.resa.jsDateIn.getFullYear();

		}
		else
		{
			
			date1 = C_XL.date(this.resa.jsDateIn, {abreviation:'full',abrmonth:'abr', weekday:true, year:displayyear } );
		}
		
		//return date1.replace(' ','</br>');
		return date1;
	},
	activate: function() {	
		this.elements.collect(this.eids);
		this.controls.activate('C_iSLOT');
	},	
	selected: function() {
		if(this.callbacks.selected) this.callbacks.selected.cb(this.resa);
	}
};
(C_iSLOT.flush = function() {
	C_iSLOT.eids = new Array(); 
	C_iSLOT.register.flush('midnight'); 
	rmems.flush('slots');
	C_iSLOT.toBeActivated = new A_ct();
})();
C_iSLOT.display = function() { // displays the collection of C_iSLOT instances, in a specialy ordered way
	let currentyear = new Date().getFullYear();
	let prevMidnight = false;
	let prev_bCalId = false;
	let trs = new Array();
		let rsctypes = mobminder.context.surfer.eresaRescType; // bitmap according to what choice is allowed to public web reservation
	let staffshow = {bCals:!!(rsctypes&class_bCal), uCals:!!(rsctypes&class_uCal), fCals:!!(rsctypes&class_fCal) };

	// scanning dates
	for(let m in C_iSLOT.register.midnight.ordered) { // C_iSLOT.register.midnight[midnight][fCals][bCal][uCals][time] = o_SLOT
		
		let midnight = C_iSLOT.register.midnight.ordered[m];
		
		// scanning uCals for a given bCal
		let fCalsStrings = C_iSLOT.register.midnight[midnight]; 
		for(let f in fCalsStrings.ordered) { 
			let fCalsString = fCalsStrings.ordered[f];
			
			// scanning bCals inside a given fCal option
			let bCals = fCalsStrings[fCalsString];  
			for(let b in bCals.ordered) {
				let bCalId = bCals.ordered[b];
				
				// scanning uCals for a given bCal
				let uCalsStrings = bCals[bCalId];
				for(let u in uCalsStrings.ordered) {
					let uCalsString = uCalsStrings.ordered[u];
					
					// scanning free slots for a given fCal / bCal / uCal combination
					let cueIns = uCalsStrings[uCalsString]; 
					let slots = new Array();
					let cueIn;
					for(let c in cueIns.ordered) {
						cueIn = cueIns.ordered[c];	
						slots.push(cueIns[cueIn].displayTime());
					}
					slots = slots.length ? slots.join('') : '';
					
					
					let slot = cueIns[cueIn];
					
					let cc = 1;
					let dateShow = (prevMidnight!=midnight) ? slot.displayDate(currentyear) : '';
					let topBorder = (dateShow !='') ? 'border-top:20px solid transparent;' : ''; //for every new date, a top transparent border is added
					//let bCalShow = (prev_bCalId!=bCalId) ? slot.displayResources(class_bCal) : '';
					let bCalShow = slot.displayResources(class_bCal);

					if(!is.small)
					{
						let dateTd = '<td style="vertical-align:top;width:1%; white-space:nowrap; text-align:left;font-weight:bold;padding-top:7px;padding-right:10px;">'+dateShow+'</td>';

						//let uCalsTd = ''; 
						//if(uCalsString!='-'&&staffshow.uCals) { cc++; uCalsTd = '<td style="vertical-align:top;width:1%; white-space:normal; text-align:right;padding-top:7px;">'+uCalsString+'</td>'; }
					

						let bCalSpan = '';
						if(!mobminder.account.single && staffshow.bCals) bCalSpan = '<span style="white-space:nowrap;">'+bCalShow+'</span>';

						let uCalsSpan = ''; 
						//if(uCalsString!='-'&&staffshow.uCals) 
						if(uCalsString!='' && staffshow.uCals) { uCalsSpan = '<span style="white-space:nowrap;">'+(bCalSpan?' / ':'')+ uCalsString+'</span>'; }
						
						let bCalTd = '';
						cc++; 
						bCalTd = '<td style="vertical-align:top;width:1%; text-align:'+(bCalSpan?'left':'right')+';white-space:nowrap;padding-top:7px;padding-right:10px;">'+bCalSpan+' '+uCalsSpan+'</td>'; 
						
						let fCalsTd = '';
						//if(fCalsString!='-'&&staffshow.fCals) 
						if(fCalsString!='' && staffshow.fCals) { cc++; fCalsTd = '<td style="vertical-align:top;width:1%; white-space:nowrap;padding-top:7px;">'+fCalsString+'</td>'; }
						
						let screenbreaker = is.small?'</tr><tr style="border-top:none;">':''; // on iPhone, the dates come above the time slots proposals
						let colspan = is.small?(' colspan='+cc):''; // on iPhone, the dates come above the time slots proposals
						
						let slotsTd = '<td '+colspan+' style="vertical-align:top;white-space:normal;">'+slots+'</td>';
						
						trs.push('<tr style="'+topBorder+'">'+dateTd+bCalTd+screenbreaker+slotsTd+fCalsTd+'</tr>');
						prevMidnight = midnight;
						prev_bCalId = bCalId;
					}
					else //small
					{
						let dateTd = '<tr style="'+topBorder+'"><td style="vertical-align:top;width:1%; white-space:nowrap; text-align:left;font-weight:bold;padding-top:7px;padding-right:10px;">'+dateShow+'</td></tr>';

						//let uCalsTd = ''; 
						//if(uCalsString!='-'&&staffshow.uCals) { cc++; uCalsTd = '<td style="vertical-align:top;width:1%; white-space:normal; text-align:right;padding-top:7px;">'+uCalsString+'</td>'; }
					
						let bCalSpan = '';
						if(!mobminder.account.single && staffshow.bCals) bCalSpan = '<span style="white-space:nowrap;">'+bCalShow+'</span>';

						let uCalsSpan = ''; 
						if(uCalsString!='' && staffshow.uCals) { uCalsSpan = '<span style="white-space:nowrap;">'+(bCalSpan?' / ':'')+uCalsString+'</span>'; } 
						//if(uCalsString!='' && staffshow.uCals) { uCalsSpan = '<span style="white-space:nowrap;">'+(bCalSpan?' / ':'')+uCalsString+'</span>'; }

						let fCalsSpan = '';
						//if(fCalsString!='-' && staffshow.fCals)
						if(fCalsString!='' && staffshow.fCals) { fCalsSpan = '<span style="white-space:nowrap;"> ('+fCalsString+')</span>'; }


						let bCalTd = '';
						if (bCalSpan || uCalsSpan ||fCalsSpan) bCalTd = '<tr><td style="vertical-align:top;width:1%; text-align:left;white-space:normal;padding-top:7px;padding-left:10px;">'+bCalSpan+' '+uCalsSpan+' '+fCalsSpan+'</td></tr>'; 
							
						
						//let screenbreaker = is.small?'</tr><tr style="border-top:none;">':''; // on iPhone, the dates come above the time slots proposals
						//let colspan = is.small?(' colspan='+cc):''; // on iPhone, the dates come above the time slots proposals
						
						let slotsTd = '<tr><td style="vertical-align:top;white-space:normal;">'+slots+'</td></tr>';
						
						trs.push(dateTd+bCalTd+slotsTd);
						prevMidnight = midnight;
						prev_bCalId = bCalId;
					}
				}
			}
		}
		prev_bCalId = false;
	}
	trs = trs.length ? trs.join('') : '<tr><td style="font-size:bigger; font-weight:bold;  padding-top:.5em;">'+C_XL.w('no e-search result')+'<td></tr>';
	trs = '<tr>'+trs+'</tr>';
	return '<table summary="results" class="" style="white-space:nowrap;" >'+trs+'</table>';
}
C_iSLOT.activate = function() { 
	C_iSLOT.toBeActivated.activate(); 
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e R E S A    P R O G R E S S    I N D I C A T I O N  step by step: (1) (2) (3) (4) (5)
//
C_eStep = function(eid, preset) {
	this.classname = 'C_eStep';
	this.eids = { on:eid+'_on', off:eid+'_off' };
	this.elements = new A_el();
	this.state = C_eStep.defaults.align(preset);
}
C_eStep.defaults = new A_df( { symbol:false, step:1, caption:'hello', on:true } );
C_eStep.prototype = {
	display: function() {
		let disabled = '<span id="'+this.eids.off+'" class="e-step off-air" style="display:inline-block;">'+this.step('disabled')+'</span>';
		let onair = '<span id="'+this.eids.on+'" class="e-step" style="display:inline-block;">'+this.step()+'</span>';
		return disabled+onair;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.set(this.state.on);
	},
	set: function(onOff, oncaption) {
		this.state.on = onOff;
		if(this.elements.on) { // then it is in the DOM
			if(this.state.on){ $(this.elements.on).show(); $(this.elements.off).hide(); }
				else { $(this.elements.off).show(); $(this.elements.on).hide(); }
		}
		return this;
	},
	caption: function(caption) {
		caption = caption||C_XL.w(this.state.caption);
		$(this.elements.on).find('.e-bullet-caption').html(caption);
		return this;
	},
	slideto: function() {
		if(this.elements.on) $('html, body').animate({ scrollTop: $(this.elements.on).offset().top }, 600);
		return this;
	},
	
	// private
	step: function(mode) { // this is the caption appearing at right side of the bullet
			mode = mode || '';
			let inner = this.state.symbol; if(mode=='disabled') inner = this.state.step;
		let step = this.bullet(inner, mode)+'<div style="display:table-cell;" class="e-bullet-caption '+(mode||'')+'">'+C_XL.w(this.state.caption)+'</div>';
		return step;
	},
	bullet: function(caption, css) { // this is the bullet
		css = css || '';
		let bullet = '<div style="display:table-cell; vertical-align:middle;"><div class="e-bullet '+css+'" style="display:table-cell;">'+caption+'</div></div>';
		return bullet;
	},
}


C_eProgress = function(eid) {
	this.classname = 'C_eProgress';
	this.elements = new A_el();
	this.eids = { ident:eid+'_ident', search:eid+'_search', select:eid+'_select', confirm:eid+'_confirm', thanks:eid+'_thanks' };
	
	let ident 	= new C_eStep(this.eids.ident, 	{ step:1, caption:'e-step ident', 	on:true   , symbol:symbol('ident') });
	let options = new C_eStep(this.eids.search, { step:2, caption:'e-step options', on:false  , symbol:symbol('options') });
	let select 	= new C_eStep(this.eids.select, { step:3, caption:'e-step select', 	on:false  , symbol:symbol('select') });
	let confirm = new C_eStep(this.eids.confirm,{ step:4, caption:'e-step confirm', on:false  , symbol:symbol('confirm') });
	let thanks 	= new C_eStep(this.eids.thanks, { step:5, caption:'e-step thanks', 	on:false  , symbol:symbol('thanks') });

	this.controls = new A_ct({ ident:ident, options:options, select:select, confirm:confirm, thanks:thanks });
	this.bystep = { 1:ident, 2:options, 3:select, 4:confirm, 5:thanks };
}
C_eProgress.prototype = { 
	display: function(step) {
		let steps = new Array();
		if(!step) for(let x in this.bystep) steps.push(this.bystep[x].display()); // returns all steps
			else steps.push(this.bystep[step].display()); // returns desired step
		return '<div class="e-step">'+steps.join('')+'</div>';
	},
	activate: function() {
		this.controls.activate('C_eProgress');
	},
	step: function(step, newcaption) { // turns ON the given step and FALSE all others
		for(let x in this.bystep) if(x>step) this.bystep[x].set(false);
		this.bystep[step].set(true,newcaption);
		return this;
	},
	caption: function(step, newcaption) { // modifies the caption of a step
		this.bystep[step].caption(newcaption); return this; 
	},
	slideto: function(step) { this.bystep[step].slideto(); return this; },
	hide: function(step) { this.bystep[step].hide(); return this; }

}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C H E C K    I N    P R O C E S S  
//
C_eToken = function(eid, callbacks) {
	this.classname = 'C_eToken';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { checked }

	this.eids = { msg:eid+'_msg', butt:eid+'_butt', field:eid+'_field',own: { warn:eid+'_warn', email:eid+'_email' }};
	
	let field 	= new C_iFIELD(this.eids.field, { onfchange:new A_cb(this, this.tokentype ), onenterkey:new A_cb(this, this.tokenenterkey ) }, { digits:'', type:INPUT_ALPHA, mandatory:true, placeholder:C_XL.w('token') });
	//let butt 	= new C_iBUTTON(this.eids.butt, new A_cb(this, this.token), { caption:C_XL.w('token validate'), enabled:false } );
	let butt =  new C_iCLIK(this.eids.butt, { click:new A_cb(this, this.token) }, { enabled:false,tag:'div', ui:C_XL.w('token validate'), css:'e-button', style:'display:flex; justify-content:center; align-items:center;'}  );

	this.controls = new A_ct({field:field, butt:butt})
}
C_eToken.prototype = { 
    display: function() {
		    	let emailnest = '<span id="'+this.eids.own.email+'" style="letter-spacing:1px;">TBD</span>';
		    let msg = '<div class="e-msg" >'+C_XL.w('token sent')+': <b>'+emailnest+'</b>'+'<br/>'+C_XL.w('use token')+'<br/><strong><br/>'+C_XL.w('e-token warning')+'</strong></div>';
		    let field = '<div class="e-msg" >'+this.controls.field.display()+'</div>';
		    let warn    = '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="width:100%; text-align:left;display:inline-block;">'+C_XL.w('warn red field')+'</div>';
		    let button = '<div class="e-msg text-center text-sm-left" >'+this.controls.butt.display()+'</div>';
		    let divs = msg+field+warn+button;
	   	return divs;
	},
		
	activate: function() { 
		this.elements.collect(this.eids.own); this.controls.activate('C_eToken'); 
	},
	caption: function(caption) { this.controls.butt.caption(caption); },
	reset:function() { this.controls.field.set('');	},
	focus: function() { this.controls.field.focus(true); },
	setemail: function(email) { this.elements.email.innerHTML = email; },

	// controls callbakcs
	tokentype: function(digits) { 
		this.controls.butt.enable(!!digits.length); 

		if(!!digits.length)
			$(this.elements.warn).hide();
		else
			$(this.elements.warn).show();

	},
	tokenenterkey: function(digits, keycode) {	if(!!digits.length) this.token();  },
	token: function() { 
		this.controls.butt.busy(true);
		//TODO, why delay for family mode? //new A_cb(this,this.tokenmatch, null, null, 800
       	mobminder.app.post(this.controls, { field:'token' }, '../_assets/queries/e-resa-token.php', new A_cb(this,this.tokenmatch), new A_cb(this, this.connfailed));
	},
	tokenmatch: function(inlineDataSets, stream) {
		this.controls.butt.busy(false);
		let match = stream.split('<code>').shift();
		switch(match) {
			case 'match': 
				if(this.callbacks.checked) this.callbacks.checked.cb(true);
				break;
			case 'no token':
			case 'no checkin':
			case 'no match': 
				if(this.callbacks.checked) this.callbacks.checked.cb(false);
				break;
		}
	},
	connfailed: function() {
		this.controls.butt.busy(false);
	}
}




