// window.jsPDF = window.jspdf.jsPDF;

window.onload = () => {
	let cv = new C_ContractValues('contactValues', {target: $('#codeControlLead')})
}

function CustomAlert(){
  this.alert = function(message,title){
    document.body.innerHTML = document.body.innerHTML + '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><div id="dialogboxbody"></div><div id="dialogboxfoot" class="col-10 col-md-6 col-lg-6 mx-auto"></div></div></div>';

    let dialogoverlay = document.getElementById('dialogoverlay');
    let dialogbox = document.getElementById('dialogbox');
    
    let winH = window.innerHeight;
    dialogoverlay.style.height = winH+"px";
    
    // dialogbox.style.top = "40%";

    dialogoverlay.style.display = "block";
    dialogbox.style.display = "block";
    
    document.getElementById('dialogboxhead').style.display = 'block';

    if(typeof title === 'undefined') {
      document.getElementById('dialogboxhead').style.display = 'none';
    } else {
      document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
    }
    document.getElementById('dialogboxbody').innerHTML = message;
    document.getElementById('dialogboxfoot').innerHTML = '<div class="cta_2 mob-txt-gray_d" style="margin:25px;" onclick="ok()">OK</div>';
  }
  
}

ok = function(){
location.reload();
}

function C_ContractValues(eid, preset) {

	this.eids = {entrepriseContractant: eid + '_entrepriseContractant'};
	this.elements = new A_el();

	this.state = C_ContractValues.defauts.align(preset = preset || {});

	const urlParams = new URL(window.location).searchParams;
	const leadId = urlParams.get('id');

	let id = new C_iPASS(leadId);
	let post = new A_ps({ id: id }, { id: 'id' }, '../assets/php/query/contractValuesAM.php', { onreply: new A_cb(this, this.getValues,leadId), ontimeout:  new A_cb(this, this.failed) }, {/*options*/ });	
	this.controls = new A_ct({ id: id});
}
C_ContractValues.defauts = new A_df({ rows: 4, target: false, busy: false, xl: false });
C_ContractValues.prototype = {
	getValues: function (lid,stream) {
		// console.log('Contract values of lead:',stream);
		let data = stream.extract('<data>', '</data>').match;

        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);
		
        let dSbyGet = C_dS_lead.get(lid);

        // Show the user tab
		let c = new C_iAMContract('contractingSection', dSbyGet, {target: $('#contractingSection')})
		c.display();
		c.activate();
	},
	// callbacks
	failed: function (){
		console.log('Failed');
	}
}

function C_iAMContract(eid, dS, preset) {
	this.eids = {
		pmPp:eid+'_pmPp', invCompanyName: eid + '_invCompanyName', /*invContactPerson: eid + '_invContactPerson'*/ invCompanyNumber: eid + '_invCompanyNumber', invContactPersonFirstname: eid + '_invContactPersonFirstname', invContactPersonLastname: eid + '_invContactPersonLastname' ,beginAccountingYear:eid+'_beginAccountingYear', invCourtesy:eid+'_invCourtesy', invAddress: eid + '_invAddress', invCity: eid + '_invCity',invCP: eid+'_invCP',invCountry: eid+'_invCountry', TVA: eid + '_TVA',
		invEmail: eid + '_invEmail', invPhone: eid + '_invPhone', BIC: eid + '_BIC', IBAN: eid + '_IBAN', monthlyPackage: eid + '_monthlyPackage', smsPackage: eid + '_smsPackage', invNotes: eid +'_invNotes',
		extraSmsPackage: eid + '_extraSmsPackage', birthdayContract: eid + '_birthdayContract', numberBusinessDiaries: eid + '_numberBusinessDiaries', numberEmployees: eid + '_numberEmployees', numberSmsAppointment: eid + '_numberSmsAppointment', clientNr: eid + '_clientNr', paymentType:eid+'_paymentType', sendBtn: eid + '_sendBtn', signBtn: eid + '_sign'
	};
	this.elements = new A_el();

	this.dS = dS;
	//console.log(dS.id);

	this.state = C_iAMContract.defauts.align(preset = preset || {});
	
	let leadid = new C_iPASS(this.dS.id);

		let captionLP = $('#contractAccountManager').find('#LPCaption').html();
		let captionNP = $('#contractAccountManager').find('#NPCaption').html();
	let pmPp = new C_iCRESTA(this.eids.pmPp, {onselect:new A_cb(this, this.pmPp)}, {labels:{ 'PM':captionLP,'PP':captionNP}}, {skin:0, mode:-1, value:'PM', mandatory: true, maxrows:1, title:false} );
	let invCompanyName = new C_iEDIT(this.eids.invCompanyName, {onfchange:new A_cb(this, this.control)}, { digits: dS.companyname, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invCompanyNumber = new C_iEDIT(this.eids.invCompanyNumber, {onfchange:new A_cb(this, this.control)}, { digits: '', placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let beginAccountingYear = new C_iEDIT(this.eids.beginAccountingYear, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	// let invContactPerson = new C_iEDIT(this.eids.invContactPerson, {onfchange:new A_cb(this, this.control)}, { digits: dS.firstname + ' ' + dS.lastname, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invContactPersonFirstname = new C_iEDIT(this.eids.invContactPersonFirstname, {onfchange:new A_cb(this, this.control)}, { digits: dS.firstname , placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invContactPersonLastname = new C_iEDIT(this.eids.invContactPersonLastname, {onfchange:new A_cb(this, this.control)}, { digits: dS.lastname, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	//let invCourtesy = new C_iDDWN(this.eids.invCourtesy, {onselect:new A_cb(this, this.invCourtesy)}, {labels:{'M':'Monsieur','Mme':'Madame'}}, {value:'', mode:1, title:'courtesy', mandatory: true } );
		let captionMr = $('#contractAccountManager').find('#courtesyCaptionMr').html();
		let captionMrs = $('#contractAccountManager').find('#courtesyCaptionMrs').html();
	let invCourtesy = new C_iCRESTA(this.eids.invCourtesy, {onselect:new A_cb(this, this.invCourtesy)}, {labels:{ 'M':captionMr,'Mme':captionMrs}}, {skin:0, mode:-1, value:'M', mandatory: true, maxrows:1, title:false} );

	let invAddress = new C_iEDIT(this.eids.invAddress, {onfchange:new A_cb(this, this.control)}, { digits: dS.address, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invCity = new C_iEDIT(this.eids.invCity, {onfchange:new A_cb(this, this.control)}, { digits: dS.city, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invCP = new C_iEDIT(this.eids.invCP, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invCountry = new C_iEDIT(this.eids.invCountry, {onfchange:new A_cb(this, this.control)}, { digits: dS.country, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let TVA = new C_iEDIT(this.eids.TVA, {onfchange:new A_cb(this, this.control)}, { digits: '', placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let invPhone = new C_iEDIT(this.eids.invPhone, {onfchange:new A_cb(this, this.control)}, { digits: '', placeholder: '', type: INPUT_PHONE, enabled: true, mandatory: false, max: 50 });
	let invMobile = new C_iEDIT(this.eids.invMobile, {onfchange:new A_cb(this, this.control)}, { digits: dS.phoneNr, placeholder: '', type: INPUT_MOBILE, enabled: true, mandatory: false, max: 50 });
	let invEmail = new C_iEDIT(this.eids.invEmail, {onfchange:new A_cb(this, this.control)}, { digits: dS.email, placeholder: '', type: INPUT_EMAIL, enabled: true, mandatory: false, max: 50 });
	let BIC = new C_iEDIT(this.eids.BIC, {onfchange:new A_cb(this, this.control)}, { digits: '', placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50 });
	let IBAN = new C_iEDIT(this.eids.IBAN, {onfchange:new A_cb(this, this.control)}, { digits: '', placeholder: '', type: INPUT_IBAN, enabled: true, mandatory: false, max: 50 });

	let monthlyPackage = new C_iEDIT(this.eids.monthlyPackage, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });
	let smsPackage = new C_iEDIT(this.eids.smsPackage, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });
	let extraSmsPackage = new C_iEDIT(this.eids.extraSmsPackage, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });
	let birthdayContract = new C_iEDIT(this.eids.birthdayContract, {onfchange:new A_cb(this, this.control)}, { digits: '', placeholder: '', type: INPUT_BDATE, enabled: true, mandatory: true, max: 50 });
	
	let numberBusinessDiaries = new C_iEDIT(this.eids.numberBusinessDiaries, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });
	let numberEmployees = new C_iEDIT(this.eids.numberEmployees, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });
	let numberSmsAppointment = new C_iEDIT(this.eids.numberSmsAppointment, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });
	let clientNr = new C_iEDIT(this.eids.clientNr, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_NUMER, enabled: true, mandatory: true, max: 50 });

	let invNotes = new C_iEDIT(this.eids.invNotes, {onfchange:new A_cb(this, this.control)}, { digits:'', placeholder: '', type: INPUT_TEXTAREA, enabled: true, max: 250, rows:3 });



		//let caption_title_pay = $('#contractAccountManager').find('#caption_title_pay').html();
		let caption_mensuel_prel = $('#contractAccountManager').find('#caption_mensuel_prel').html();
		let caption_annuel_prel = $('#contractAccountManager').find('#caption_annuel_prel').html();
		let caption_annuel_fac = $('#contractAccountManager').find('#caption_annuel_fac').html();
	let paymentType = new C_iCRESTA(this.eids.paymentType, { onchange:new A_cb(this, this.changePT) }, 
		{ labels:{ 1:caption_mensuel_prel, 2:caption_annuel_prel, 3:caption_annuel_fac} }, 
		{ skin:0, mode:-1, value:1/*, title:caption_title_pay*/ } );

	let sendBtn = new C_iCLIK(this.eids.sendBtn, { click: new A_cb(this, this.send) }, { tag: 'div', ui: '<i class="fad fa-paper-plane fa-1d5x mob-txt-lime"></i><span>Send</span>', enabled: false });

	this.controls = new A_ct({leadid:leadid, pmPp:pmPp, invCompanyName:invCompanyName, invCompanyNumber:invCompanyNumber, beginAccountingYear:beginAccountingYear, /*invContactPerson: invContactPerson*/ invContactPersonFirstname:invContactPersonFirstname, invContactPersonLastname:invContactPersonLastname , invCourtesy:invCourtesy, invAddress: invAddress, invCity: invCity, invCP:invCP, invCountry:invCountry, TVA: TVA, invPhone: invPhone, invMobile: invMobile, invEmail: invEmail, BIC: BIC, IBAN: IBAN, monthlyPackage: monthlyPackage, smsPackage: smsPackage, extraSmsPackage: extraSmsPackage, birthdayContract: birthdayContract, numberBusinessDiaries: numberBusinessDiaries, numberEmployees: numberEmployees, numberSmsAppointment: numberSmsAppointment, clientNr: clientNr, invNotes:invNotes, paymentType:paymentType, sendBtn: sendBtn});

}

C_iAMContract.defauts = new A_df({ rows: 4, target: false, busy: false, xl: false });
C_iAMContract.prototype = {
	display: function (e) {

			let companyCaption = $('#contractAccountManager').find('#companyCaption').html();
			let companyNumberCaption = $('#contractAccountManager').find('#companyNumberCaption').html();
			let beginAYCaption = $('#contractAccountManager').find('#beginAYCaption').html();
			// let contactPersonCaption = $('#contractAccountManager').find('#contactPersonCaption').html();
			let contactPersonFirstnameCaption = $('#contractAccountManager').find('#contactPersonFirstnameCaption').html();
			let contactPersonLastnameCaption = $('#contractAccountManager').find('#contactPersonLastnameCaption').html();
			// let courtesyCaption = $('#contractAccountManager').find('#courtesyCaption').html();
			let addressCaption = $('#contractAccountManager').find('#addressCaption').html();
			let cityCaption = $('#contractAccountManager').find('#cityCaption').html();
			let cpCaption = $('#contractAccountManager').find('#cpCaption').html();
			let countryCaption = $('#contractAccountManager').find('#countryCaption').html();
			let tvaCaption = $('#contractAccountManager').find('#tvaCaption').html();
			let phoneNrCaption = $('#contractAccountManager').find('#phoneNrCaption').html();
			let mobileCaption = $('#contractAccountManager').find('#mobileCaption').html();
			let emailCaption = $('#contractAccountManager').find('#emailCaption').html();
			let bicCaption = $('#contractAccountManager').find('#bicCaption').html();
			let ibanCaption = $('#contractAccountManager').find('#ibanCaption').html();

		let pmPp = this.controls.pmPp.display();
		let invCompanyName = '<div class=input-field>'+this.controls.invCompanyName.labelledafter(companyCaption,'inputContract',{ xl:false })+'</div>';
		let invCompanyNumber = '<div class=input-field>'+this.controls.invCompanyNumber.labelledafter(companyNumberCaption,'inputContract',{ xl:false })+'</div>';
		let beginAccountingYear = '<div class=input-field>'+this.controls.beginAccountingYear.labelledafter(beginAYCaption,'inputContract',{ xl:false })+'</div>';
		// let invContactPerson = '<div class=input-field>'+this.controls.invContactPerson.labelledafter(contactPersonCaption,'inputContract',{ xl:false })+'</div>';
		let invContactPersonFirstname = '<div class=input-field>'+this.controls.invContactPersonFirstname.labelledafter(contactPersonFirstnameCaption,'inputContract',{ xl:false })+'</div>';
		let invContactPersonLastname = '<div class=input-field>'+this.controls.invContactPersonLastname.labelledafter(contactPersonLastnameCaption,'inputContract',{ xl:false })+'</div>';
		// let invCourtesy = '<div class=input-field>'+this.controls.invCourtesy.labelled(courtesyCaption,'inputContract',{ xl:false })+'</div>';
		let invCourtesy = this.controls.invCourtesy.display();
		let invAddress = '<div class=input-field>'+this.controls.invAddress.labelledafter(addressCaption,'inputContract',{ xl:false })+'</div>';
		let invCity = '<div class=input-field>'+this.controls.invCity.labelledafter(cityCaption,'inputContract',{ xl:false })+'</div>';
		let invCP = '<div class=input-field>'+this.controls.invCP.labelledafter(cpCaption,'inputContract',{ xl:false })+'</div>';
		let invCountry = '<div class=input-field>'+this.controls.invCountry.labelledafter(countryCaption,'inputContract',{ xl:false })+'</div>';
		let TVA = '<div class=input-field>'+this.controls.TVA.labelledafter(tvaCaption,'inputContract',{ xl:false })+'</div>';
		let invPhone = '<div class=input-field>'+this.controls.invPhone.labelledafter(phoneNrCaption,'inputContract',{ xl:false })+'</div>';
		let invMobile = '<div class=input-field>'+this.controls.invMobile.labelledafter(mobileCaption,'inputContract',{ xl:false })+'</div>';
		let invEmail = '<div class=input-field>'+this.controls.invEmail.labelledafter(emailCaption,'inputContract',{ xl:false })+'</div>';
		let BIC = '<div class=input-field>'+this.controls.BIC.labelledafter(bicCaption,'inputContract',{ xl:false })+'</div>';
		let IBAN = '<div class=input-field>'+this.controls.IBAN.labelledafter(ibanCaption,'inputContract',{ xl:false })+'</div>';


		let ContractantInputs = pmPp+invCompanyName+invCompanyNumber+beginAccountingYear+invContactPersonFirstname+invContactPersonLastname+invCourtesy+invAddress+invCity+invCP+invCountry+TVA+invPhone+invMobile+invEmail+BIC+IBAN;
		this.state.target.find('#valuesContractant').html(ContractantInputs);

			let currencySymbol = $('#contractAccountManager').find('#currencySymbol').html();
			let monthlyPackageCaption = $('#contractAccountManager').find('#monthlyPackageCaption').html();
			let smsPackageCaption = $('#contractAccountManager').find('#smsPackageCaption').html();
			let extraSmsPackageCaption = $('#contractAccountManager').find('#extraSmsPackageCaption').html();
			let birthdayContractCaption = $('#contractAccountManager').find('#birthdayContractCaption').html();

		let monthlyPackage = '<div class=input-field>'+this.controls.monthlyPackage.labelledafter(monthlyPackageCaption+' - '+currencySymbol,'inputContract',{ xl:false })+'</div>';
		let smsPackage = '<div class=input-field>'+this.controls.smsPackage.labelledafter(smsPackageCaption,'inputContract',{ xl:false })+'</div>';
		let extraSmsPackage = '<div class=input-field>'+this.controls.extraSmsPackage.labelledafter(extraSmsPackageCaption+' - '+currencySymbol,'inputContract',{ xl:false })+'</div>';
		let birthdayContract = '<div class=input-field>'+this.controls.birthdayContract.labelledafter(birthdayContractCaption+' (DD-MM-YYYY) ','inputContract',{ xl:false })+'</div>';
		let contractParams1 = monthlyPackage+smsPackage+extraSmsPackage+birthdayContract;
		this.state.target.find('#contractParams1').html(contractParams1);

			let nrAgendaCaption = $('#contractAccountManager').find('#nrAgendaCaption').html();
			let nrEmployeesCaption = $('#contractAccountManager').find('#nrEmployeesCaption').html();
			let nrSmsCaption = $('#contractAccountManager').find('#nrSmsCaption').html();
			let clientNrCaption = $('#contractAccountManager').find('#clientNrCaption').html();

		let numberBusinessDiaries = '<div class=input-field>'+this.controls.numberBusinessDiaries.labelledafter(nrAgendaCaption,'inputContract',{ xl:false })+'</div>';
		let numberEmployees = '<div class=input-field>'+this.controls.numberEmployees.labelledafter(nrEmployeesCaption,'inputContract',{ xl:false })+'</div>';
		let numberSmsAppointment = '<div class=input-field>'+this.controls.numberSmsAppointment.labelledafter(nrSmsCaption,'inputContract',{ xl:false })+'</div>';
		let clientNr = '<div class=input-field>'+this.controls.clientNr.labelledafter(clientNrCaption,'inputContract',{ xl:false })+'</div>';
		let contractParams2 = numberBusinessDiaries+numberEmployees+numberSmsAppointment+clientNr;
		this.state.target.find('#contractParams2').html(contractParams2);
	
			let contractNoteCaption = 'Note';
		let invNotes = '<div class=input-field>'+this.controls.invNotes.labelledafter(contractNoteCaption,'inputContract',{ xl:false })+'</div>';
		this.state.target.find('#notesContract').html(invNotes);

		let paymentType = '<td>'+this.controls.paymentType.display()+'</td>';
		this.state.target.find('.radioBtnDiv').html(paymentType);

		let dS_lead = this.dS;
		let userid = dS_lead.accountm;
		let dS_user = C_dS_users.get(userid);


		$('.margins').find('#AccountmanagerName').html(dS_user.firstname + ' ' + dS_user.lastname);
		$('.margins').find('#AccountmanagerPhoneNr').html(dS_user.mobile);
		$('.margins').find('#AccountmanagerEmail').html(dS_user.email);



		let sendBtn = this.controls.sendBtn.display('cta_2 mob-txt-gray_d touch-in');
		this.state.target.find("#sendButtonDiv").html(sendBtn);
		
	},
	activate: function (){
		this.elements.collect(this.eids);
		this.controls.activate();
		if (this.state.xl) this.state.target.find('h3.ixl').each(function (){
			$(this).show();
		});
	},
	send: function (){
		if(this.state.busy) return;
		this.state.busy = true;
		this.controls.sendBtn.enable(false);
		this.controls.sendBtn.set('<i class="fas fa-spinner fa-spin fa-1d5x"></i><span>Sending</span>');
		let names = {leadid:'leadid', pmPp:'pmPp', invCompanyName: 'invCompanyName', /*invContactPerson: 'invContactPerson'*/ invCompanyNumber: 'invCompanyNumber', invContactPersonFirstname:'invContactPersonFirstname', invContactPersonLastname:'invContactPersonLastname', beginAccountingYear:'beginAccountingYear',invCourtesy:'invCourtesy', invAddress: 'invAddress', invCity: 'invCity', invCP:'invCP', invCountry:'invCountry', TVA: 'TVA', invPhone: 'invPhone', invMobile: 'invMobile', invEmail: 'invEmail', BIC: 'BIC', IBAN: 'IBAN', monthlyPackage: 'monthlyPackage', smsPackage: 'smsPackage', extraSmsPackage: 'extraSmsPackage', birthdayContract: 'birthdayContract',paymentType:'paymentType', numberBusinessDiaries: 'numberBusinessDiaries', numberEmployees: 'numberEmployees', numberSmsAppointment: 'numberSmsAppointment', clientNr: 'clientNr', invNotes: 'invNotes'};
		let post = new A_ps(this.controls, names, '../assets/php/post/contract.php', { onreply:new A_cb(this,this.sent), ontimeout:new A_cb(this,this.failed) }, {/*options*/});
		// console.log('Contract sent to lead');
	},
	sent: function(stream){
		console.log(stream);
		let dS_lead = C_dS_lead.get(this.dS.id);

		let l = 'fr';
		switch(dS_lead.language) {
			case 1: l = 'en'; break;
			case 2: l = 'fr'; break;
			case 3: l = 'nl'; break;
			case 4: l = 'es'; break;	
		}

		let names = {leadid:'leadid', pmPp:'pmPp', invCompanyName: 'invCompanyName', /*invContactPerson: 'invContactPerson',*/ invCompanyNumber: 'invCompanyNumber', invContactPersonFirstname:'invContactPersonFirstname', invContactPersonLastname:'invContactPersonLastname', beginAccountingYear:'beginAccountingYear',invCourtesy:'invCourtesy', invAddress: 'invAddress', invCity: 'invCity', invCP:'invCP', invCountry:'invCountry', TVA: 'TVA', invPhone: 'invPhone', invMobile: 'invMobile', invEmail: 'invEmail', BIC: 'BIC', IBAN: 'IBAN', monthlyPackage: 'monthlyPackage', smsPackage: 'smsPackage', extraSmsPackage: 'extraSmsPackage', birthdayContract: 'birthdayContract',paymentType:'paymentType', numberBusinessDiaries: 'numberBusinessDiaries', numberEmployees: 'numberEmployees', numberSmsAppointment: 'numberSmsAppointment', clientNr: 'clientNr', invNotes: 'invNotes'};
		let post = new A_ps(this.controls, names, '../'+l+'/mail_invite.php', { onreply:new A_cb(this,this.emailSent), ontimeout:new A_cb(this,this.failed) }, {/*options*/});
	},
	emailSent: function(){
		console.log('Email sent');
		setTimeout(function(){location.href="../langless/welcome.php"} , 500);
	},
	// callbacks
	changePT: function(which) {
		if(vbs) vlog('controls.js','C_iTDONE','progr','which:'+which);
		this.state.status = which;
		// console.log(which);
	},
	showhidewarning: function (isformvalid) {
		if(isformvalid) console.log('Form valid'); else console.log('Form not valid');
		if (isformvalid) console.log('Form valid'); else console.log('Form not valid');
	},

	failed: function(){
		console.log('Failed');
	},

	control: function(){
		let isformvalid = this.controls.validation();
		this.showhidewarning(isformvalid);
		this.controls.sendBtn.enable(isformvalid);
	}
}

function C_iCodeControl(eid, preset) {

	this.eids = { controlBtn: eid + '_control', code: eid + '_code' };
	this.elements = new A_el();

	// console.log(preset.ixl);
	// console.log('Language: ',preset.lang);
	mobminder.context.surfer = this; 
	switch(preset.lang) { // Is used to match the language.js names
		case 'en': this.language = 0; break; // this.language is picked up through mobminder.context.surfer.language that you find in mobmframe.js::C_XL.w()
		case 'fr': this.language = 1; break; /// mobminder.context is defined in datasets.js::C_dS_context(p)
		case 'nl': this.language = 3; break;
		case 'es': this.language = 6; break;
	}



	let code = new C_iEDIT(this.eids.code, { onfchange: new A_cb(this, this.typing) }, { digits: '', placeholder: 'Code', type: INPUT_TEXT, enabled: true, mandatory: true, max: 5 });

	this.state = C_iCodeControl.defauts.align(preset = preset || {});
	this.state.xl = preset.ixl=='on'?true:false;

	let controlBtnCaption = $('.insertCodeDiv').find('#buttonControlCodeCaption').html();
	let controlBtn = new C_iCLIK(this.eids.controlBtn, { click: new A_cb(this, this.control) }, { tag: 'div', ui:'<i class="mob-txt-lime fad fa-shield-check fa-1d5x"></i><span class="centered">'+controlBtnCaption+'</span>', enabled: false });

	this.controls = new A_ct({
		controlBtn: controlBtn,
		code: code
	});
}

C_iCodeControl.defauts = new A_df({ rows: 4, target: false, busy: false, xl:false, ixl:false });
C_iCodeControl.prototype = {
	display: function (e) {
		let code = this.controls.code.display('inputContract');
		this.state.target.find('#inputCode').html(code);

		let controlBtn = this.controls.controlBtn.display('cta_2 mob-txt-gray_d touch-in');
		this.state.target.find("#buttonControlCode").html(controlBtn);
	},
	activate: function (){
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('div.ixl').each( function() { $(this).show(); } );
	},
	control: function (){
		if(this.state.busy) return;
		this.state.busy = true;
		this.controls.controlBtn.enable(false);
			let ixltag = this.state.xl?' > xl':'';
		let controlBtnCaption = this.state.target.find('#buttonControlCodeCheckCaption'+ixltag).html();
		this.controls.controlBtn.set('<i class="fas fa-spinner fa-spin fa-1d5x"></i><span>'+controlBtnCaption+'</span>');
		const urlParams = new URL(window.location).searchParams;
		const leadId = urlParams.get('id');
		// console.log(leadId);
		// console.log(this.controls.code.state.digits);
		let id = new C_iPASS(leadId);
		let code = new C_iPASS(this.controls.code.state.digits);
		post = new A_ps({ id: id, code: code }, { id: 'id', code: 'code' }, '../assets/php/query/accessCodeControl.php', { onreply: new A_cb(this, this.controlled, leadId), ontimeout: new A_cb(this, this.failed) }, {/*options*/ });
	},
	controlled: function (lid, stream) {
		let data = stream.extract('<data>', '</data>').match;

		if (stream == '!#0#!') {
			console.log('Wrong password');
			$('.margins').find('.insertCodeDiv').css('display','none');
			// $('.margins').find('.wrongPasswordDiv').css('display','block');
			let customAlert = new CustomAlert();
			let captionWrongPW = $('.margins').find('#wrongPassword').html();
			customAlert.alert(captionWrongPW);
		}
		else{
			$('.margins').find('.insertCodeDiv').css('display','none');
			$('.margins').find('#contractLead').css('display','block');

			let datasets = false;
			if (data) datasets = C_inlineStreaming.createDataSets(data);
	
			for (let contractid in datasets['C_dS_contract']) {
				let C_dS_contract = datasets['C_dS_contract'][contractid];
				$('.margins').find('#lForfaitMensuel').html(C_dS_contract.monthlyPackage);
				$('.margins').find('#lNrSms').html(C_dS_contract.smsPackage);
				$('.margins').find('#lPriceForSms').html(C_dS_contract.extraSmsPackage);

				let birthdayContractYYYYMMDD = C_dS_contract.birthdayContract; //YYYYMMDD format
				let birthdayContractHyphen = [birthdayContractYYYYMMDD.slice(0, 4), "-", birthdayContractYYYYMMDD.slice(4, 6), "-", birthdayContractYYYYMMDD.slice(6, 8)].join('');; //YYYY-MM-DD format
				let birthdayContract = new Date(birthdayContractHyphen);
				//let birthdayContractHyphen = [birthdayContract.slice(0, 4), "-", birthdayContract.slice(4, 6), "-", birthdayContract.slice(6, 8)].join('');
				let convertedDate = '('+birthdayContract.getDate()+' ';
				// dateInWords
				switch (birthdayContract.getMonth()) {
					case 0:
						convertedDate += $('.margins').find('#janCaption').html();
						break;
					case 1:
						convertedDate += $('.margins').find('#febCaption').html();
						break;
					case 2:
						convertedDate += $('.margins').find('#marCaption').html();
						break;
					case 3:
						convertedDate += $('.margins').find('#aprCaption').html();
						break;
					case 4:
						convertedDate += $('.margins').find('#mayCaption').html();
						break;
					case 5:
						convertedDate += $('.margins').find('#junCaption').html();
						break;
					case 6:
						convertedDate += $('.margins').find('#julCaption').html();
						break;
					case 7:
						convertedDate += $('.margins').find('#augCaption').html();
						break;
					case 8:
						convertedDate += $('.margins').find('#sepCaption').html();
						break;
					case 9:
						convertedDate += $('.margins').find('#octCaption').html();
						break;
					case 10:
						convertedDate += $('.margins').find('#novCaption').html();
						break;
					case 11:
						convertedDate += $('.margins').find('#decCaption').html();
						break;
					default:
						break;
				}

				convertedDate += ' '+birthdayContract.getFullYear()+')';

				$('.margins').find('#lBirthdayContract').html(birthdayContractHyphen);
				$('.margins').find('#dateInWords').html(convertedDate);
				$('.margins').find('#nrBusinessAgendas').html(C_dS_contract.numberBusinessDiaries);
				$('.margins').find('#nrCollaborators').html(C_dS_contract.numberEmployees);
				$('.margins').find('#nrSmsAppointment').html(C_dS_contract.numberSmsAppointment);
				$('.margins').find('#clientNumber').html(C_dS_contract.clientNr);
	
				let c = new C_iLeadContract('contractingSection',C_dS_contract, {target: $('#contractingSection'), ixl:this.state.ixl})
				c.display();
				c.activate();
			}
		}
	},
	showhidewarning: function (isformvalid) {
		// if(isformvalid) $('#warning').hide(); else $('#warning').show();
		if (isformvalid) $('#warning').css("visibility", "hidden"); else $('#warning').css("visibility", "visible");
	},
	failed: function(){
		console.log('Failed');
	},
	typing: function (newdigits, statereport) {
		let isformvalid = this.controls.validation();
		this.showhidewarning(isformvalid);
		this.controls.controlBtn.enable(isformvalid);
	}
}

function C_iLeadContract(eid, dS, preset) {

	this.eids = { signBtn: eid + '_signBtn',paymentType:eid+'_paymentType',/*f4all:eid+'_f4all',*/ invNotes:eid+'_invNotes', pmPp:eid+'_pmPp', invCompanyName:eid+'_invCompanyName', invCompanyNumber:eid+'_invCompanyNumber', beginAccountingYear:eid+'_beginAccountingYear',
				/*invContactPerson:eid+'_invContactPerson',*/ invContactPersonFirstname: eid + '_invContactPersonFirstname', invContactPersonLastname: eid + '_invContactPersonLastname' , invCourtesy:eid+'_invCourtesy', invAddress:eid+'_invAddress',invCity:eid+'_invCity',invCP:eid+'_invCP',
				invCountry:eid+'_invCountry', TVA:eid+'_TVA', invPhone:eid+'_invPhone',invMobile:eid+'_invMobile',invEmail:eid+'_invEmail',BIC:eid+'_BIC', IBAN:eid+'_IBAN', placeSigning:eid+'_placeSigning', optin:eid+'optin', warn:eid+'warn', warnBottom:eid+'warnBottom'};
	this.elements = new A_el();

	let typing = new A_cb(this, this.typing, null, null, 1000); //1000
	
	this.dS = dS;

	this.state = C_iLeadContract.defauts.align(preset = preset || {});
	this.state.xl = preset.ixl=='on'?true:false; // ixl arrives from $ixl in moblib.php, values are { 'on', 'off' }, we convert it into a boolean for usage in js

	// let civility;
	
	// if (dS.invCourtesy != '') {
	// 	civility = dS.invCourtesy;
	// }
	// else{
	// 	civility = dS.invContactPerson;
	// }

	// let pmPp = new C_iDDWN(this.eids.pmPp, {onselect:new A_cb(this, this.pmPp)}, {labels:{'PM':'Entreprise','PP':'Personne Physique'}}, {value:'PM', mode:1, title:'pmPp',mandatory: true } ); 
	let invCompanyName = new C_iEDIT(this.eids.invCompanyName, { onfchange:typing }, { digits: dS.invCompanyName, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, tootip:false, dblclick:false });
	let invCompanyNumber = new C_iEDIT(this.eids.invCompanyNumber, { onfchange:typing }, { digits: dS.invCompanyNumber, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50, tootip:false, dblclick:false });
		
		let captionLP = $('#contractLead').find('#LPCaption').html();
		let captionNP = $('#contractLead').find('#NPCaption').html();
	let pmPp = new C_iCRESTA(this.eids.pmPp, {onselect:new A_cb(this, this.pmPp)}, {labels:{ 'PM':captionLP,'PP':captionNP}}, {skin:0, mode:-1, value:dS.pmPp, mandatory: true, maxrows:1, title:false} );

	let beginAccountingYear = new C_iEDIT(this.eids.beginAccountingYear, { onfchange:typing }, { digits: dS.beginAccountingYear, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });

	let invContactPersonFirstname = new C_iEDIT(this.eids.invContactPersonFirstname, {onfchange:typing}, { digits: dS.invContactPersonFirstname , placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	let invContactPersonLastname = new C_iEDIT(this.eids.invContactPersonLastname, {onfchange:typing}, { digits: dS.invContactPersonLastname, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false});

	// let invContactPerson = new C_iEDIT(this.eids.invContactPerson, { onfchange:typing }, { digits: dS.invContactPerson, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	// let invCourtesy = new C_iEDIT(this.eids.invCourtesy, {}, { digits: civility, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50 });

		let captionMr = $('#contractLead').find('#courtesyCaptionMr').html();
		let captionMrs = $('#contractLead').find('#courtesyCaptionMrs').html();
	let invCourtesy = new C_iCRESTA(this.eids.invCourtesy, {onselect:new A_cb(this, this.invCourtesy)}, {labels:{ 'M':captionMr,'Mme':captionMrs}}, {skin:0, mode:-1, value:dS.invCourtesy, mandatory: true, maxrows:1, title:false} );



	//let invCourtesy = new C_iDDWN(this.eids.invCourtesy, {onselect:new A_cb(this, this.invCourtesy)}, {labels:{'M':'Monsieur','Mme':'Madame','Dr':'Docteur','Me':'Maitre'}}, {value:civility, mode:1, title:'courtesy', mandatory: true } );
	
	let invAddress = new C_iEDIT(this.eids.invAddress, { onfchange:typing }, { digits: dS.invAddress, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	let invCity = new C_iEDIT(this.eids.invCity, { onfchange:typing }, { digits: dS.invCity, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	let invCP = new C_iEDIT(this.eids.invCP, { onfchange:typing }, { digits: dS.invCP, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	let invCountry = new C_iEDIT(this.eids.invCountry, { onfchange:typing }, { digits: dS.invCountry, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	let TVA = new C_iEDIT(this.eids.TVA, { onfchange:typing }, { digits: dS.TVA, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });
	
	let firstPhoneSigil='';
	// let firstPhoneSigil;
	// if(dS.invPhone.charAt(0) == '+'){
	// 	firstPhoneSigil = '';
	// }
	// else{
	// 	firstPhoneSigil = '+';
	// }

	let invPhone = new C_iEDIT(this.eids.invPhone, { onfchange:typing }, { digits: firstPhoneSigil+dS.invPhone, placeholder: '', type: INPUT_PHONE, enabled: true, mandatory: false, max: 50, dblclick:false });
	// if(dS.invPhone.charAt(0) == '+'){
	// 	firstPhoneSigil = '';
	// }
	// else{
	// 	firstPhoneSigil = '+';
	// }
	let invMobile = new C_iEDIT(this.eids.invMobile, { onfchange:typing }, { digits: firstPhoneSigil+dS.invMobile, placeholder: '', type: INPUT_MOBILE, enabled: true, mandatory: true, max: 50, dblclick:false });
	let invEmail = new C_iEDIT(this.eids.invEmail, { onfchange:typing }, { digits: dS.invEmail, placeholder: '', type: INPUT_EMAIL, enabled: true, mandatory: true, max: 50, dblclick:false });
	let BIC = new C_iEDIT(this.eids.BIC, { onfchange:typing }, { digits: dS.BIC, placeholder: '', type: INPUT_TEXT, enabled: true, mandatory: false, max: 50, dblclick:false }); // change back to INPUT_BIC later, now INPUT_TEXT for testing purpose
	let IBAN = new C_iEDIT(this.eids.IBAN, { onfchange:typing }, { digits: dS.IBAN, placeholder: '', type: INPUT_IBAN, enabled: true, mandatory: true, max: 50, dblclick:false });

	// let invNotes = new C_iEDIT(this.eids.invNotes, {}, { digits: dS.invNotes, placeholder: '', type: INPUT_TEXTAREA, enabled: false, rows:3, dblclick:false });

	// if (dS.invNotes != '') {
	// 	$('#lNotesContract').css('display','block');
	// }

	/*let captionTitlePay = $('#contractLead').find('#caption_title_pay').html();*/
		let captionMP = $('#contractLead').find('#caption_mensuel_prel').html();
		let captionAP = $('#contractLead').find('#caption_annuel_prel').html();
		let captionAF = $('#contractLead').find('#caption_annuel_fac').html();

	// let paymentType = new C_iCRESTA(this.eids.paymentType, { onchange:new A_cb(this, this.changePT) }, { labels:{ 1:captionMP, 2:captionAP,3:captionAF} }, { skin:0, mode:-1, value:dS.paymentType ,enable:true, title: captinTitlePay } );
	let paymentType = new C_iCRESTA(this.eids.paymentType, { onchange:new A_cb(this, this.changePT) }, 
		{ labels:{ 1:captionMP, 2:captionAP,3:captionAF} }, 
		{ skin:0, mode:-1, value:dS.paymentType /*, title:captionTitlePay*/ } );

	// let captionCoche = $('#contractLead').find('#conditionCRESTACaption').html();
	// let f4all = new C_iCRESTA(this.eids.f4all, { onchange:new A_cb(this, this.accept) }, { order:[1], labels:{1:captionCoche}, presets:{}, count:1 }, { mode:0 } );

	// let caption = $('#contractLead').find('#signButtonCaption').html();
	let placeSigning = new C_iEDIT(this.eids.placeSigning, { onfchange:typing }, { digits: '', placeholder:'', type: INPUT_TEXT, enabled: true, mandatory: true, max: 50, dblclick:false });

	let optin = new C_iONOFF(this.eids.optin, { onswitch:new A_cb(this, this.onoptin, null, null, 1000) }, { state:0, mandatory:true } );


			let ixltag = this.state.xl?' > xl':'';
		let caption = this.state.target.find('#signButtonCaption'+ixltag).html(); //   takes the button caption from an element having ixl class and display:none otherwise
	let signBtn = new C_iCLIK(this.eids.signBtn, { click: new A_cb(this, this.sign) }, { tag:'div', ui:'<i class="mob-txt-lime fad fa-file-signature fa-1d5x"></i><span class="centered">'+caption+'</span>', enabled: false });

	let id = new C_iPASS(this.dS.id);

	this.controls = new A_ct({optin:optin, paymentType:paymentType, /*f4all:f4all, invNotes:invNotes,*/ id:id, pmPp:pmPp, signBtn: signBtn, invCompanyName: invCompanyName, invCompanyNumber:invCompanyNumber, beginAccountingYear:beginAccountingYear, /* invContactPerson: invContactPerson,*/ invContactPersonFirstname:invContactPersonFirstname, invContactPersonLastname:invContactPersonLastname, invCourtesy:invCourtesy, invAddress: invAddress, invCity: invCity, invCP:invCP, invCountry:invCountry, TVA: TVA, invPhone: invPhone, invMobile: invMobile, invEmail: invEmail, BIC: BIC, IBAN: IBAN, placeSigning:placeSigning});
}
C_iLeadContract.defauts = new A_df({ rows: 4, target: false, busy: false, xl: false, valid:false });
C_iLeadContract.prototype = {
	display: function (e) {
		let paymentType = this.controls.paymentType.display();
		// this.controls.paymentType.lock(false,1);
		this.state.target.find('.lRadioBtnDiv').html(paymentType);

		// let f4all = '<div style:"max-width:150px;">'+this.controls.f4all.display()+'</div>';
		// this.state.target.find('#conditionCRESTA').html(f4all);

		let signBtn = this.controls.signBtn.display('cta_2 mob-txt-gray_d touch-in');
		this.state.target.find("#signButtonDiv").html(signBtn);


		if (this.dS.invNotes != '') {
			//let invNotes = this.controls.invNotes.display();
			$('#lNotesContract').css('display','block');
			this.state.target.find('#noteTextArea').html(this.dS.invNotes);
		}

			// let ppPmCaption = $('#contractLead').find('#ppPmCaption').html();
			let companyCaption = $('#contractLead').find('#companyCaption').html();
			let companyNumberCaption = $('#contractLead').find('#companyNumberCaption').html();
			let beginAYCaption = $('#contractLead').find('#beginAYCaption').html();
			// let contactPersonCaption = $('#contractLead').find('#contactPersonCaption').html();
			let contactPersonFirstnameCaption = $('#contractLead').find('#contactPersonFirstnameCaption').html();
			let contactPersonLastnameCaption = $('#contractLead').find('#contactPersonLastnameCaption').html();
			//let courtesyCaption = $('#contractLead').find('#courtesyCaption').html();
			let addressCaption = $('#contractLead').find('#addressCaption').html();
			let cityCaption = $('#contractLead').find('#cityCaption').html();
			let cpCaption = $('#contractLead').find('#cpCaption').html();
			let countryCaption = $('#contractLead').find('#countryCaption').html();
			let tvaCaption = $('#contractLead').find('#tvaCaption').html();
			let phoneNrCaption = $('#contractLead').find('#phoneNrCaption').html();
			let mobileCaption = $('#contractLead').find('#mobileCaption').html();
			let emailCaption = $('#contractLead').find('#emailCaption').html();
			let bicCaption = $('#contractLead').find('#bicCaption').html();
			let ibanCaption = $('#contractLead').find('#ibanCaption').html();


		//let pmPp = '<tr>'+this.controls.pmPp.labelled(ppPmCaption,'inputContract',{ xl:false })+'</tr>';
		let pmPp = this.controls.pmPp.display();
		let invCompanyName = '<div class=input-field>'+this.controls.invCompanyName.labelledafter(companyCaption,'inputContract',{ xl:false })+'</div>';
		let invCompanyNumber = '<div class=input-field>'+this.controls.invCompanyNumber.labelledafter(companyNumberCaption,'inputContract',{ xl:false })+'</div>';
		let beginAccountingYear = '<div class=input-field>'+this.controls.beginAccountingYear.labelledafter(beginAYCaption,'inputContract',{ xl:false })+'</div>';
		// let invContactPerson = '<div class=input-field>'+this.controls.invContactPerson.labelledafter(contactPersonCaption,'inputContract',{ xl:false })+'</div>';
		let invContactPersonFirstname = '<div class=input-field>'+this.controls.invContactPersonFirstname.labelledafter(contactPersonFirstnameCaption,'inputContract',{ xl:false })+'</div>';
		let invContactPersonLastname = '<div class=input-field>'+this.controls.invContactPersonLastname.labelledafter(contactPersonLastnameCaption,'inputContract',{ xl:false })+'</div>';
		//let invCourtesy = '<tr>'+this.controls.invCourtesy.labelled(courtesyCaption,'inputContract',{ xl:false })+'</tr>';
		let invCourtesy = this.controls.invCourtesy.display();
		let invAddress = '<div class=input-field>'+this.controls.invAddress.labelledafter(addressCaption,'inputContract',{ xl:false })+'</div>';
		let invCity = '<div class=input-field>'+this.controls.invCity.labelledafter(cityCaption,'inputContract',{ xl:false })+'</div>';
		let invCP = '<div class=input-field>'+this.controls.invCP.labelledafter(cpCaption,'inputContract',{ xl:false })+'</div>';
		let invCountry = '<div class=input-field>'+this.controls.invCountry.labelledafter(countryCaption,'inputContract',{ xl:false })+'</div>';
		let TVA = '<div class=input-field>'+this.controls.TVA.labelledafter(tvaCaption,'inputContract',{ xl:false })+'</div>';
		let invPhone = '<div class=input-field>'+this.controls.invPhone.labelledafter(phoneNrCaption,'inputContract',{ xl:false })+'</div>';
		let invMobile = '<div class=input-field>'+this.controls.invMobile.labelledafter(mobileCaption,'inputContract',{ xl:false })+'</div>';
		let invEmail = '<div class=input-field>'+this.controls.invEmail.labelledafter(emailCaption,'inputContract',{ xl:false })+'</div>';
		let BIC = '<div class=input-field>'+this.controls.BIC.labelledafter(bicCaption,'inputContract',{ xl:false })+'</div>';
		let IBAN = '<div class=input-field>'+this.controls.IBAN.labelledafter(ibanCaption,'inputContract',{ xl:false })+'</div>';

		let ContractantInputs = pmPp+invCompanyName+invCompanyNumber+beginAccountingYear+invContactPersonFirstname+invContactPersonLastname+invCourtesy+invAddress+invCity+invCP+invCountry+TVA+invPhone+invMobile+invEmail+BIC+IBAN;
		this.state.target.find('#valuesContractant').html(ContractantInputs);

			let warnCaption = $('#contractLead').find('#warningCaption').html();
		let warn = '<div class="e-msg e-warner" id="'+this.eids.warn+'" style="display:none; text-align:left;">'+warnCaption+'</div>';
		let warnBottom = '<div class="e-msg e-warner" id="'+this.eids.warnBottom+'" style="display:none; text-align:left;">'+warnCaption+'</div>';
			
		this.state.target.find('#mandatoryContractValues').html(warn);
		this.state.target.find('#mandatoryContractBottom').html(warnBottom);




		let dS_lead = C_dS_lead.get(this.dS.leadid);
		let dS_user = C_dS_users.get(dS_lead.accountm);
		// console.log(dS_user);
		// console.log('Account manager (user) id is: '+dS_lead.accountm);
		// console.log('Account manager (user) firstname is: '+dS_user.firstname);
		$('.margins').find('#AccountmanagerName').html(dS_user.firstname + ' ' + dS_user.lastname);
		$('.margins').find('#AccountmanagerPhoneNr').html(dS_user.mobile);
		$('.margins').find('#AccountmanagerEmail').html(dS_user.email);

			let signPlaceCaption = $('#contractLead').find('#placeSigningCaption').html();
		let placeSigning ='<div class=input-field>'+this.controls.placeSigning.labelledafter(signPlaceCaption,'inputContract',{ xl:false })+'</div>';
		//let placeSigning = this.controls.placeSigning.display('inputContract');
		this.state.target.find('#placeSigning').html(placeSigning);

			let conditionCRESTACaption = $('#contractLead').find('#conditionCRESTACaption').html();
		let opswitch = this.controls.optin.display();
		this.state.target.find('#conditionCRESTA').html('<span style="margin-right:15px;">'+opswitch+'</span>'+conditionCRESTACaption);

	},
	activate: function (){
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('div.ixl').each( function() { $(this).show(); } );
	},
	// accept: function (){
	// 	let isformvalid = this.controls.validation();
	// 	this.showhidewarning(isformvalid);
	// 	//this.controls.signBtn.enable(isformvalid);
	// },
	// showhidewarning: function (isformvalid) {
	// 	if(isformvalid) $('#warning').hide(); else $('#warning').show();
	// 	if (isformvalid) $('#warning').css("visibility", "hidden"); else $('#warning').css("visibility", "visible");
	// },
	sign: function (){
		if(this.state.busy) return;
		this.state.busy = true;
			let ixltag = this.state.xl?' > xl':'';
		let caption = this.state.target.find('#signProgressButtonCaption'+ixltag).html();
        this.controls.signBtn.enable(false);
        this.controls.signBtn.set('<i class="mob-txt-lime fas fa-spinner fa-spin fa-1d5x"></i><span class="centered">'+caption+'</span>');
		let names = {id:'id', pmPp:'pmPp', invCompanyName:'invCompanyName', beginAccountingYear:'beginAccountingYear', invCompanyNumber:'invCompanyNumber', /*invContactPerson:'invContactPerson',*/ invContactPersonFirstname:'invContactPersonFirstname', invContactPersonLastname:'invContactPersonLastname', invCourtesy:'invCourtesy', invAddress:'invAddress', invCity:'invCity', invCP:'invCP', invCountry:'invCountry', TVA:'TVA', invPhone:'invPhone',invMobile:'invMobile', invEmail:'invEmail', BIC:'BIC', IBAN:'IBAN', placeSigning:'placeSigning',paymentType:'paymentType'};
		let post = new A_ps(this.controls, names, '../assets/php/post/updateContract.php', { onreply:new A_cb(this,this.signed), ontimeout:new A_cb(this,this.failed) }, {/*options*/});
		
		//window.open('../assets/php/pdf.php?id='+this.dS.id, "_blank");
	},
	signed: function(){
		const urlParams = new URL(window.location).searchParams;
		const leadIdURL = urlParams.get('id');

		let contractId = new C_iPASS(this.dS.id);
		let leadid = new C_iPASS(leadIdURL);
		let today = new Date();
		let dateSigned = new C_iPASS(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());

		post = new A_ps({ leadid: leadid, dateSigned: dateSigned, contractId:contractId }, { leadid: 'leadid', dateSigned: 'dateSigned', contractId:'contractId'}, '../assets/php/post/customer.php', { onreply: new A_cb(this, this.sendEmail, leadid), ontimeout: new A_cb(this, this.failed) }, {/*options*/ });
		console.log('Signed');
	},
	sendEmail:function (){

		// this.dS is an instance of C_dS_contract()
		let dS_lead = C_dS_lead.get(this.dS.leadid);

		let l = 'fr';
		switch(dS_lead.language) {
			case 1: l = 'en'; break;
			case 2: l = 'fr'; break;
			case 3: l = 'nl'; break;
			case 4: l = 'es'; break;	
		}
		let url = '../'+l+'/mail_thanks.php?contid='+this.dS.id;
// console.log(this.dS, dS_lead);
// console.log('--------->'+url);

		let names = {id:'id', pmPp:'pmPp', invCompanyName:'invCompanyName', beginAccountingYear:'beginAccountingYear', invCompanyNumber:'invCompanyNumber', /*invContactPerson:'invContactPerson',*/ invContactPersonFirstname:'invContactPersonFirstname', invContactPersonLastname:'invContactPersonLastname', invCourtesy:'invCourtesy', invAddress:'invAddress', invCity:'invCity', invCP:'invCP', invCountry:'invCountry', TVA:'TVA', invPhone:'invPhone',invMobile:'invMobile', invEmail:'invEmail', BIC:'BIC', IBAN:'IBAN', placeSigning:'placeSigning',paymentType:'paymentType'};
		let post = new A_ps(this.controls, names, url, { onreply:new A_cb(this,this.emailSent), ontimeout:new A_cb(this,this.failed) }, {/*options*/});	
	},

	emailSent: function(){
		console.log('Email sent');
		setTimeout(function(){location.href='./thankyou.php'} , 0);
	},

	failed: function(){
		console.log('Failed');
	},
	changePT: function(which) {
		if(vbs) vlog('controls.js','C_iTDONE','progr','which:'+which);
		this.state.status = which;
		console.log(which);
	}, 

	typing: function() {
		let optin = !!this.controls.optin.value(); // which is [0,1] turned into [false,true]
		let newstate = this.controls.isvalid() && optin;
		if(newstate!=this.state.valid) {
			//this.validform(newstate);
			//if(this.callbacks.valid) this.callbacks.valid.cb(newstate);
			this.controls.signBtn.enable(newstate);
		}
		this.state.valid = newstate;
		if(newstate) { $(this.elements.warn).hide(); $(this.elements.warnBottom).hide(); }
		else { $(this.elements.warn).show(); $(this.elements.warnBottom).show(); }
	},
	onoptin: function(state) { 		
		if(vbs) vlog('e-resa.js','C_eREG','onoptin','state:'+state); 
		this.typing(); // recalculates this.state.valid
}
}