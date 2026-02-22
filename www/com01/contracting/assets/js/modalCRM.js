
/*
MODAL LEAD  
*/

//Class to show all the input fields of the add user tab
function M_Lead(eid, dS, preset) {
	console.log(dS);
	this.eids = { closeBtn:eid+'_close', saveBtn:eid+'_save', signBtn:eid+'_sign',language:eid+'_language', accountm:eid+'_accountm', status:eid+'_status', sector:eid+'_sector', source:eid+'_source', sourceD:eid+'_sourceD', followUp:eid+'_followUp',
		 firstname:eid+'_firstname',lastname:eid+'_lastname',phoneNr:eid+'_phoneNr', email:eid+'_email', companyname:eid+'_cn', work:eid+'_work' , country:eid+'_country', city:eid+'_city', address:eid+"_address",demo_AcNr:eid+'_demo_AcNr',demo_AcName:eid+'_demo_AcName' ,notes:eid+'_notes'};
	this.elements = new A_el();

	this.dS = dS;

	let firstPhoneSigil='';

	// let firstPhoneSigil;
	// if(dS.phoneNr.charAt(0) == '+'){
	// 	firstPhoneSigil = '';
	// }
	// else{
	// 	firstPhoneSigil = '+';
	// }

	let languages = {}
	for (let index = 1; index <= 4; index++) {
		l = C_dS_language.get(index);
		languages[index] = l.full_l;
	}

	this.state = M_Lead.defauts.align(preset = preset || {});
	
	let closeBtn = new C_iCLIK(this.eids.closeBtn, { click:new A_cb(this, this.close) } , { tag:'div', ui:'<i class="fas fa-times mob-txt-lime"></i>', enabled:true } );
	let saveBtn = new C_iCLIK(this.eids.saveBtn, { click:new A_cb(this, this.save) } , { tag:'div', ui:'<i class="fas fa-cloud-upload-alt mob-txt-lime"></i>', enabled:true } );
	let signBtn = new C_iCLIK(this.eids.signBtn, { click:new A_cb(this, this.sign) } , { tag:'div', ui:'<i class="fas fa-file-signature mob-txt-lime"></i>', enabled:true } );

	let language = new C_iDDWN(this.eids.language, {onchange:new A_cb(this, this.onLanguage)}, {labels:languages}, { value:dS.language, mode:1, title:'Account Manager' } );

    let firstname = new C_iEDIT(this.eids.firstname, {  }, { digits: dS.firstname, placeholder:'', type:INPUT_TEXT, enabled:true, mandatory:false, max:32 });
	let lastname = new C_iEDIT(this.eids.lastname, {  }, { digits: dS.lastname, placeholder:'', type:INPUT_TEXT, enabled:true, mandatory:false, max:32 });
    let phoneNr = new C_iEDIT(this.eids.phoneNr, {  }, { digits: firstPhoneSigil+dS.phoneNr, placeholder:'', type:INPUT_MOBILE, enabled:true, mandatory:false, max:16 });
    let email = new C_iEDIT(this.eids.email, {  }, { digits: dS.email, placeholder:'', type:INPUT_EMAIL, enabled:true, mandatory:false, max:64 });
    
    let companyname = new C_iEDIT(this.eids.companyname, {  }, { digits: dS.companyname, placeholder:'', type:INPUT_TEXT, enabled:true, max:60 });
    let work = new C_iEDIT(this.eids.work, {  }, { digits:dS.speciality, placeholder:'', type:INPUT_TEXT, enabled:true, mandatory:false, max:32 });

	let country = new C_iEDIT(this.eids.country, {  }, { digits:dS.country, placeholder:'', type:INPUT_TEXT, enabled:true, mandatory:false, max:56 });
    let city = new C_iEDIT(this.eids.city, {  }, { digits:dS.city, placeholder:'', type:INPUT_TEXT, enabled:true, mandatory:false, max:85 });
    let address = new C_iEDIT(this.eids.address, {  }, { digits:dS.address, placeholder:'', type:INPUT_TEXT, enabled:true, max:100 });

	let accountm = new C_iDDWN(this.eids.accountm, {onchange:new A_cb(this, this.onAccountm)}, {labels:{ 1:'Jonathan', 2:'Pascal', 3:'Florian', 4:'Giraud', 5:'Keevin', 6:'Kamal',7:'Kristof'}}, { value:dS.accountm, mode:1, title:'Account Manager' } );
	let status = new C_iDDWN(this.eids.status, {onchange:new A_cb(this, this.onStatus)}, {labels:{ 1:'Qualified lead', 2:'Customer', 3:'Lost Lead', 4:'Lost Customer'}}, { value:dS.status, mode:1, title:'Status' } );
	let sector = new C_iDDWN(this.eids.sector, {onchange:new A_cb(this, this.onSector)}, {labels:{ 1:'Medical', 2:'Freelance', 3:'Medical group', 4:'Dentist', 5:'Industry', 6:'Wellness', 999:'Not Defined'}}, { value:dS.sector, mode:1, title:'Sector' } );

console.log(C_dS_users.get());

for (let id in C_dS_users.get()) {
	let test = {id:id};
	console.log(test);
}     

	let source = new C_iDDWN(this.eids.source, {onchange:new A_cb(this, this.onSource)}, {labels:{ 1:'Web wizard', 2:'Web form', 3:'Web call', 4:'Direct Call', 5:'Cold', 6:'Fairs', 7:'In mailing', 8:'Social',999:'Not Defined'}}, {value:dS.source, mode:1, title:'Source' } );
	let sourceD = new C_iDDWN(this.eids.sourceD, {onchange:new A_cb(this, this.onSourceD)}, {labels:{ 1:'SEA', 2:'SEO', 3:'Referral', 5:'Email', 5:'Social', 999:'Not Applicable'}}, {value:dS.sourcedetails, mode:1, title:'Source' } );
	let followUp = new C_iDDWN(this.eids.followUp, {onselect:new A_cb(this, this.followUp)}, {labels:{ 1:'Contacted',2:'To be recontacted', 3:'Scheduled Appointment', 4:'Demo', 5:'Contract sent', 999:'Not addressed'}}, {value:dS.followUp, mode:1, title:'Follow-Up' } );
	let demo_AcNr = new C_iEDIT(this.eids.demo_AcNr, {  }, { digits:dS.demo_AcNr, placeholder:'', type:INPUT_TEXT, enabled:true, max:100 });
	let demo_AcName = new C_iEDIT(this.eids.demo_AcName, {  }, { digits:dS.demo_AcName, placeholder:'', type:INPUT_TEXT, enabled:true, max:100 });	


	if (dS.followUp == 4) {
		$('#demoLead').css('display','block');
	}

	let notes = new C_iEDIT(this.eids.notes, {}, { digits: dS.notes, placeholder: '', type: INPUT_TEXTAREA, enabled: true, max: 15000 });

	let id = new C_iPASS(this.dS.id);

	this.controls = new A_ct({ closeBtn:closeBtn, saveBtn:saveBtn, signBtn:signBtn, id:id, language:language, firstname:firstname, lastname:lastname, phoneNr:phoneNr, email:email, companyname:companyname, work:work, country:country, city:city, address:address, accountm:accountm, status:status, sector:sector, source:source, sourceD:sourceD, followUp:followUp, notes:notes, demo_AcNr:demo_AcNr, demo_AcName:demo_AcName});
}
M_Lead.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
M_Lead.prototype = {
	display: function(e) {
			let closeBtn = this.controls.closeBtn.display('button');
			this.state.target.find("#closeModal").html(closeBtn);

			let saveBtn = this.controls.saveBtn.display('button');
			this.state.target.find("#save").html(saveBtn);

			let signBtn = this.controls.signBtn.display('button');
			this.state.target.find("#sign").html(signBtn);

			let accountm = this.controls.accountm.display('wide'); this.state.target.find('#accountm').html(accountm);

			$('#addUserTab').find('#idLead').html('<i class="fas fa-1d5x fa-user" style="padding-right:15px;"></i><h2>'+this.dS.id+'</h2>');

			let today = new Date();
			let showedDate = today.getFullYear()+'-'+(today.getMonth() + 1)+'-'+today.getDate();
			console.log(today);
			$('#addUserTab').find('#date').html('<i style="padding-right:10px;"class="fas fa-copy"></i>'+showedDate);
			
			let status = '<legend>Life Cycle</legend>'+this.controls.status.display('wide'); this.state.target.find('#status').html(status);
			let firstname = '<legend>Firstname</legend>'+this.controls.firstname.display('wide'); this.state.target.find('#fn').html(firstname);
			let lastname = '<legend>Lastname</legend>'+this.controls.lastname.display('wide'); this.state.target.find('#ln').html(lastname);
			let language = '<legend>Language</legend>'+this.controls.language.display('wide'); this.state.target.find('#language').html(language);
			let phoneNr = '<legend>Mobile</legend>'+this.controls.phoneNr.display('wide'); this.state.target.find('#phoneNr').html(phoneNr);
            let email = '<legend>Email</legend>'+this.controls.email.display('wide'); this.state.target.find('#email').html(email);
            
            let companyname = '<legend>Company Name</legend>'+this.controls.companyname.display('wide'); this.state.target.find('#cn').html(companyname);
            let work = '<legend>Speciality</legend>'+this.controls.work.display('wide'); this.state.target.find('#work').html(work);
            let sector = '<legend>Sector</legend>'+this.controls.sector.display('wide'); this.state.target.find('#sector').html(sector);
			let country = '<legend>Country</legend>'+this.controls.country.display('wide'); this.state.target.find('#country').html(country);
			let city = '<legend>City</legend>'+this.controls.city.display('wide'); this.state.target.find('#city').html(city);
            let address = '<legend>Address</legend>'+this.controls.address.display('wide'); this.state.target.find('#address').html(address);

			let source = '<legend>Source</legend>'+this.controls.source.display('wide'); this.state.target.find('#source').html(source);
			let sourceD = '<legend>Digital Source Details</legend>'+this.controls.sourceD.display('wide'); this.state.target.find('#sourceDetails').html(sourceD);
			let followUp = '<legend>Follow up</legend>'+this.controls.followUp.display('wide'); this.state.target.find('#FollowUp').html(followUp);
			
			let demo_AcNr = '<legend>Account Nr</legend>'+this.controls.demo_AcNr.display('wide'); this.state.target.find('#demo_AcNr').html(demo_AcNr);
			let demo_AcName = '<legend>Account Name</legend>'+this.controls.demo_AcName.display('wide'); this.state.target.find('#demo_AcName').html(demo_AcName);

			let notes = '<legend>Note</legend>'+this.controls.notes.display('wide'); this.state.target.find('#modalNote').html(notes);
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	// Function that is called when user wants to add a user
    save: function(e){
        console.log(this.dS.id);

		/*
		Pour création nouveau lead:
		- Passer une variable qui dit que c'est un nouveau lead?
		- Mettre l'id à 0 pour dire que c'est la création d'un nouveau lead?
		- Appeler le même php ou un nouveau dépendant de l'id?
		*/

		// console.log(this.controls.id);
        // if(this.state.busy) return;
		// this.state.busy = true;

		// if(!this.controls.validation()) return;
		var names = {id:'id', accountm:'accountm', status:'status', firstname:'firstname', lastname:'lastname', phoneNr:'phoneNr', email:'email', companyname:'companyname',language:'language', work:'work', country:'country', city:'city', address:'address',sector:'sector', source:'source', sourceD:'sourceD', followUp:'followUp',notes:'notes', demo_AcNr:'demo_AcNr', demo_AcName:'demo_AcName'};
		var post = new A_ps(this.controls, names, '../assets/php/post/updateLead.php', { onreply:new A_cb(this,this.saved), ontimeout:new A_cb(this,this.close) }, {/*options*/});
    },
	saved: function(stream){
		let data = stream.extract('<data>', '</data>').match;

		if (data) datasets = C_inlineStreaming.createDataSets(data);

		for (let id in datasets['C_dS_lead']) {
            let dS = datasets['C_dS_lead'][id];
			let dSfollowUpbyGet = C_dS_followUp.get(dS.followUp);
			let color;
			let colortxt;
			let bell = '';
            switch (dSfollowUpbyGet.id) { // 1: contacted, 2:to be contacted, 3:Scheduled appointment, 4:Demo, 5:Contract sent, default here is not adressed status
                case 1:
                    color = 'no-border';
                    break;
                case 2:
                    color = 'orangeFlag';
                    break;
                case 3:
                    color = 'blueFlag';
                    break;
                case 4:
                    color = 'greenFlag';
                    break;
                case 5:
                    color = 'yellowFlag';
                    break;
                default:
                    //color = 'redFlag';
					color = 'no-border';
                    colortxt = 'redText';   
					bell = '<i class="fal fa-bell" style="padding-left:5px;"></i>';                 
                    break;
            }

			switch (this.dS.status) {
				case 1:
					if (this.dS.id == 0) {
						let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)"><td class="'+color+'"></td><td class="column2">'+dS.id+'</td><td class="column3">'+dS.firstname+'</td><td class="column4">'+dS.lastname+'</td><td class="column5">'+dS.created+'</td><td>'+dS.changed+'</td><td class="column6 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td><td class="column7">'+dS.companyname+'</td><td class="column8">'+dS.country+'</td><td>'+dS.city+'</td></tr>';
						$("#leadstable > tbody").append(tr);
						$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
					}
					if (dS.status == 1) {
						$('#leadstable > tbody').find('#'+id).html('<td class="'+color+'"></td><td class="column2">'+dS.id+'</td><td class="column3">'+dS.firstname+'</td><td class="column4">'+dS.lastname+'</td><td class="column5">'+dS.created+'</td><td>'+dS.changed+'</td><td class="column6 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td><td class="column7">'+dS.companyname+'</td><td class="column8">'+dS.country+'</td><td>'+dS.city+'</td>');
						$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
					}
					else{
						if (dS.status == 3) {
							let rowindex = document.getElementById(id).rowIndex;
							document.getElementById('leadstable').deleteRow(rowindex);
							let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)"><td class="'+color+'"></td><td class="column2">'+dS.id+'</td><td class="column3">'+dS.firstname+'</td><td class="column4">'+dS.lastname+'</td><td class="column5">'+dS.created+'</td><td>'+dS.changed+'</td><td class="column6 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td><td class="column7">'+dS.companyname+'</td><td class="column8">'+dS.country+'</td><td>'+dS.city+'</td></tr>';
							$("#lostLeadstable > tbody").append(tr);
							$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
						}
						else{
							let rowindex = document.getElementById(id).rowIndex;
							document.getElementById('leadstable').deleteRow(rowindex);
							$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
						}
					}
					break;
				case 3:
					if (this.dS.id == 0) {
						let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)"><td class="'+color+'"></td><td class="column2">'+dS.id+'</td><td class="column3">'+dS.firstname+'</td><td class="column4">'+dS.lastname+'</td><td class="column5">'+dS.created+'</td><td>'+dS.changed+'</td><td class="column6 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td><td class="column7">'+dS.companyname+'</td><td class="column8">'+dS.country+'</td><td>'+dS.city+'</td></tr>';
						$("#leadstable > tbody").append(tr);
						$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
					}
					if (dS.status == 3) {
						$('#lostLeadstable > tbody').find('#'+id).html('<td class="'+color+'"></td><td class="column2">'+dS.id+'</td><td class="column3">'+dS.firstname+'</td><td class="column4">'+dS.lastname+'</td><td class="column5">'+dS.created+'</td><td>'+dS.changed+'</td><td class="column6 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td><td class="column7">'+dS.companyname+'</td><td class="column8">'+dS.country+'</td><td>'+dS.city+'</td>');
						$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
					}
					else{
						if (dS.status == 1) {
							let rowindex = document.getElementById(id).rowIndex;
							document.getElementById('lostLeadstable').deleteRow(rowindex);
							let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)"><td class="'+color+'"></td><td class="column2">'+dS.id+'</td><td class="column3">'+dS.firstname+'</td><td class="column4">'+dS.lastname+'</td><td class="column5">'+dS.created+'</td><td>'+dS.changed+'</td><td class="column6 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td><td class="column7">'+dS.companyname+'</td><td class="column8">'+dS.country+'</td><td>'+dS.city+'</td></tr>';
							$("#leadstable > tbody").append(tr);
							$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
						} else {
							let rowindex = document.getElementById(id).rowIndex;
							document.getElementById('leadstable').deleteRow(rowindex);
							$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
						}
					}
					break;
				default:
					break;
			}
        }
	},
	// Change caption of button
    sent: function(par, stream) {
        // var caption = '<i class="fas fa-user-check mob-txt-lime fa-2x"></i>';
        //this.controls.done.set(caption);

        console.log('C_iLead::sent, ajax returned here' + stream);
    },
	// Close the modal
	close: function(){
		console.log("Clicked on close button");
		$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
		$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
		$('div.inputfield').find('input').text("");
		$('#demoLead').css('display','none');
	},
	// Send an email and create the contract of the client
	sign: function(){
		/* 
		Pour aller vers le contrat:
		- Comment passer l'id du lead à la nouvelle page (page contract version account manager) pour pouvoir sauvegarder dans la db quels contrats ont été créés?
		*/

		console.log(this.dS.id);
		console.log("Clicked on sign button");
		window.open('../fr/contracting.php?id='+this.dS.id, "_self"); /* "_self" to open in the same window and tab, "_blank" in new tab*/
	},
	followUp: function(){
		if (this.controls.followUp.state.value == 4) {
			$('#demoLead').css('display','block');
		}
		else{
			$('#demoLead').css('display','none');
		}
	}
}

/*
MODAL CUSTOMER
*/

//Class to show all the input fields of the add user tab
function M_Customer(eid, dS, preset) {

	this.eids = { closeBtn:eid+'_close', saveBtn:eid+'_save', signBtn:eid+'_sign',language:eid+'_language', accountm:eid+'_accountm', status:eid+'_status', sector:eid+'_sector', source:eid+'_source', sourceD:eid+'_sourceD', followUp:eid+'_followUp',
		 firstname:eid+'_firstname',lastname:eid+'_lastname',phoneNr:eid+'_phoneNr', email:eid+'_email', companyname:eid+'_cn', work:eid+'_work' , country:eid+'_country', city:eid+'_city', address:eid+"_address",accountName:eid+'_accountName',invName:eid+'_invName',monthlyPackage:eid+'_monthlyPackage',smsPackage:eid+'_smsPackage', birthdayContract:eid+'_birthdayContract', paymentType:eid+'_paymentType', notes:eid+'_notes', invNotes:eid+'_invNotes'};
	this.elements = new A_el();

	this.dS = dS;

	let CustomerLeadInformation = C_dS_lead.get(dS.leadid)
	
	this.dSLead = CustomerLeadInformation;
	// console.log(CustomerLeadInformation);
	let ContractInformation
	if (dS.contractId != 0) {
		ContractInformation = C_dS_contract.get(dS.contractId)
		$('#CustomerModal').find('#idLead').html('<i class="fas fa-1d5x fa-user" style="padding-right:15px;"></i><h2>'+ContractInformation.clientNr+'</h2>');
	}
	else{
		$('#CustomerModal').find('#idLead').html('<i class="fas fa-1d5x fa-user" style="padding-right:15px;"></i><h2>'+dS.clientNr+'</h2>');
		ContractInformation = '';
	}

	let languages = {}
	for (let index = 1; index <= 4; index++) {
		l = C_dS_language.get(index);
		languages[index] = l.full_l;
	}

	let firstPhoneSigil='';

	// let firstPhoneSigil;
	// if(CustomerLeadInformation.phoneNr.charAt(0) == '+'){
	// 	firstPhoneSigil = '';
	// }
	// else{
	// 	firstPhoneSigil = '+';
	// }
	
	let id = new C_iPASS(this.dS.id);
	// console.log(this.dS.id);

	this.state = M_Customer.defauts.align(preset = preset || {});
	
	let closeBtn = new C_iCLIK(this.eids.closeBtn, { click:new A_cb(this, this.close) } , { tag:'div', ui:'<i class="fas fa-times mob-txt-lime"></i>', enabled:true } );
	let saveBtn = new C_iCLIK(this.eids.saveBtn, { click:new A_cb(this, this.save) } , { tag:'div', ui:'<i class="fas fa-cloud-upload-alt mob-txt-lime"></i>', enabled:true } );
	// let signBtn = new C_iCLIK(this.eids.signBtn, { click:new A_cb(this, this.sign) } , { tag:'div', ui:'<i class="fas fa-file-signature mob-txt-lime"></i>', enabled:true } );
	

    let firstname = new C_iEDIT(this.eids.firstname, {  }, { digits: CustomerLeadInformation.firstname, placeholder:'Firstname', type:INPUT_TEXT, enabled:true, mandatory:true, max:32 });
	let lastname = new C_iEDIT(this.eids.lastname, {  }, { digits: CustomerLeadInformation.lastname, placeholder:'Lastname', type:INPUT_TEXT, enabled:true, mandatory:true, max:32 });
	let language = new C_iDDWN(this.eids.language, {onchange:new A_cb(this, this.onLanguage)}, {labels:languages}, { value:CustomerLeadInformation.language, mode:1, title:'Account Manager' } );
	let phoneNr = new C_iEDIT(this.eids.phoneNr, {  }, { digits:firstPhoneSigil+CustomerLeadInformation.phoneNr, placeholder:'+32 478 256 248', type:INPUT_MOBILE, enabled:true, mandatory:true, max:16 });
    let email = new C_iEDIT(this.eids.email, {  }, { digits: CustomerLeadInformation.email, placeholder:'example@email.com', type:INPUT_EMAIL, enabled:true, mandatory:true, max:64 });
    
    let companyname = new C_iEDIT(this.eids.companyname, {  }, { digits: CustomerLeadInformation.companyname, placeholder:'Company name', type:INPUT_TEXT, enabled:true, max:60 });
    let work = new C_iEDIT(this.eids.work, {  }, { digits:CustomerLeadInformation.speciality, placeholder:'Speciality', type:INPUT_TEXT, enabled:true, mandatory:true, max:32 });

	let country = new C_iEDIT(this.eids.country, {  }, { digits:CustomerLeadInformation.country, placeholder:'Country', type:INPUT_TEXT, enabled:true, mandatory:true, max:56 });
    let city = new C_iEDIT(this.eids.city, {  }, { digits:CustomerLeadInformation.city, placeholder:'City', type:INPUT_TEXT, enabled:true, mandatory:true, max:85 });
    let address = new C_iEDIT(this.eids.address, {  }, { digits:CustomerLeadInformation.address, placeholder:'Address', type:INPUT_TEXT, enabled:true, max:100 });

	let accountm = new C_iDDWN(this.eids.accountm, {onchange:new A_cb(this, this.onAccountm)}, {labels:{ 1:'Jonathan', 2:'Pascal', 3:'Florian', 4:'Giraud', 5:'Keevin', 6:'Kamal',7:'Kristof'}}, { value:CustomerLeadInformation.accountm, mode:1, title:'Account Manager' } );
	let status = new C_iDDWN(this.eids.status, {onchange:new A_cb(this, this.onStatus)}, {labels:{ 1:'Qualified lead', 2:'Customer', 3:'Lost Lead', 4:'Lost Customer'}}, { value:CustomerLeadInformation.status, mode:1, title:'Status' } );
	let sector = new C_iDDWN(this.eids.sector, {onchange:new A_cb(this, this.onSector)}, {labels:{ 1:'Medical', 2:'Freelance', 3:'Medical group', 4:'Dentist', 5:'Industry', 6:'Wellness', 999:'Not Defined'}}, { value:CustomerLeadInformation.sector, mode:1, title:'Sector' } );

	let accountName =  new C_iEDIT(this.eids.acName, {  }, { digits:dS.accountName, placeholder:'Account name...', type:INPUT_TEXT, enabled:true, mandatory:true, max:56 });
	let invName =  new C_iEDIT(this.eids.invName, {  }, { digits:ContractInformation.invContactPerson, placeholder:'invName', type:INPUT_TEXT, enabled:true, mandatory:true, max:56 });
	let mp;
	if (ContractInformation.monthlyPackage != undefined) {
		mp = ContractInformation.monthlyPackage;
	}
	else{
		mp = 0;
	}
	let monthlyPackage =  new C_iEDIT(this.eids.monthlyPackage, {  }, { digits:mp, placeholder:'Monthly package', type:INPUT_TEXT, enabled:true, mandatory:true, max:56 });

	let smsI;
	if (ContractInformation.smsPackage != undefined) {
		smsI = ContractInformation.smsPackage;
	}
	else{
		smsI = 0;
	} 
	let smsPackage =  new C_iEDIT(this.eids.smsPackage, {  }, { digits:smsI, placeholder:'Monthly package', type:INPUT_TEXT, enabled:true, mandatory:true, max:56 });
	let birthdayContract =  new C_iEDIT(this.eids.birthdayContract, {  }, { digits:ContractInformation.birthdayContract, placeholder:'Monthly package', type:INPUT_TEXT, enabled:true, mandatory:true, max:56 });
	
	let payT;
	if (ContractInformation.paymentType != undefined) {
		payT = ContractInformation.paymentType;
	}
	else{
		payT = 1;
	}
	let paymentType = new C_iDDWN(this.eids.paymentType, {onchange:new A_cb(this, this.onpaymentType)}, {labels:{ 1:'paiement mensuel via prélèvement', 2:'paiement annuel via prélèvement', 3:'paiement annuel après facturation'}}, { value:payT, mode:1, title:'Payment Type' } );

	let notes = new C_iEDIT(this.eids.notes, {}, { digits: CustomerLeadInformation.notes, placeholder: '', type: INPUT_TEXTAREA, enabled: true, max: 15000 });
	let invNotes = new C_iEDIT(this.eids.invNotes, {}, { digits: ContractInformation.invNotes, placeholder: '', type: INPUT_TEXTAREA, enabled: true, max: 15000 });

	this.controls = new A_ct({ closeBtn:closeBtn, saveBtn:saveBtn,id:id, firstname:firstname, lastname:lastname,language:language, phoneNr:phoneNr, email:email, companyname:companyname, work:work, country:country, city:city, address:address, accountm:accountm, status:status, sector:sector, accountName:accountName, invName:invName, monthlyPackage:monthlyPackage, smsPackage:smsPackage, birthdayContract:birthdayContract, paymentType:paymentType, notes:notes, invNotes:invNotes});
}
M_Customer.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
M_Customer.prototype = {
	display: function(e) {
			let closeBtn = this.controls.closeBtn.display('button');
			this.state.target.find("#closeModal").html(closeBtn);

			let saveBtn = this.controls.saveBtn.display('button');
			this.state.target.find("#save").html(saveBtn);

			let today = new Date();
			let showedDate = today.getFullYear()+'-'+(today.getMonth() + 1)+'-'+today.getDate();
			console.log(today);
			$('#CustomerModal').find('#date').html('<i style="padding-right:10px;"class="fas fa-copy"></i>'+showedDate);

			let accountm = this.controls.accountm.display('wide'); this.state.target.find('#accountm').html(accountm);

			let status = '<legend>Status</legend>'+this.controls.status.display('wide'); this.state.target.find('#status').html(status);
			let firstname = '<legend>Firstname</legend>'+this.controls.firstname.display('wide'); this.state.target.find('#fn').html(firstname);
			let lastname = '<legend>Lastname</legend>'+this.controls.lastname.display('wide'); this.state.target.find('#ln').html(lastname);
			let language = '<legend>Language</legend>'+this.controls.language.display('wide'); this.state.target.find('#language').html(language);
			let phoneNr = '<legend>Mobile</legend>'+this.controls.phoneNr.display('wide'); this.state.target.find('#phoneNr').html(phoneNr);
            let email = '<legend>Email</legend>'+this.controls.email.display('wide'); this.state.target.find('#email').html(email);
            
            let companyname = '<legend>Company Name</legend>'+this.controls.companyname.display('wide'); this.state.target.find('#cn').html(companyname);
            let work = '<legend>Speciality</legend>'+this.controls.work.display('wide'); this.state.target.find('#work').html(work);
            let sector = '<legend>Sector</legend>'+this.controls.sector.display('wide'); this.state.target.find('#sector').html(sector);
			let country = '<legend>Country</legend>'+this.controls.country.display('wide'); this.state.target.find('#country').html(country);
			let city = '<legend>City</legend>'+this.controls.city.display('wide'); this.state.target.find('#city').html(city);
            let address = '<legend>Address</legend>'+this.controls.address.display('wide'); this.state.target.find('#address').html(address);

            let accountName = '<legend>Account name</legend>'+this.controls.accountName.display('wide'); this.state.target.find('#acName').html(accountName);
			let invName = '<legend>Invoice name</legend>'+this.controls.invName.display('wide'); this.state.target.find('#invName').html(invName);
			let monthlyPackage = '<legend>Monthly package</legend>'+this.controls.monthlyPackage.display('wide'); this.state.target.find('#monthlyP').html(monthlyPackage);
            let smsPackage = '<legend>Nr. Sms</legend>'+this.controls.smsPackage.display('wide'); this.state.target.find('#nrSms').html(smsPackage);
			let birthdayContract = '<legend>Contracting Date</legend>'+this.controls.birthdayContract.display('wide'); this.state.target.find('#contractBd').html(birthdayContract);
			let paymentType = '<legend>Payment type</legend>'+this.controls.paymentType.display('wide'); this.state.target.find('#typePay').html(paymentType);

			let notes = '<legend>Note</legend>'+this.controls.notes.display('wide'); this.state.target.find('#modalNote').html(notes);
		
			let invNotes = '<legend>Invoice note</legend>'+this.controls.invNotes.display('wide'); this.state.target.find('#invNote').html(invNotes);
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	// Function that is called when user wants to add a user
    save: function(e){
        console.log("Clicked on save button");

		var names = {id:'id', accountm:'accountm', status:'status', firstname:'firstname', lastname:'lastname',language:'language', phoneNr:'phoneNr', email:'email', companyname:'companyname', work:'speciality', country:'country', city:'city', address:'address',sector:'sector', accountName:'accountName',invName:'invContactPerson',monthlyPackage:'monthlyPackage',smsPackage:'smsPackage',birthdayContract:'birthdayContract',paymentType:'paymentType',notes:'notes', invNotes:'invNotes' };
		var post = new A_ps(this.controls, names, '../assets/php/post/updateCustomer.php', { onreply:new A_cb(this,this.saved), ontimeout:new A_cb(this,this.close) }, {/*options*/});
    },
	saved: function(stream){
		let data = stream.extract('<data>', '</data>').match;

		if (data) datasets = C_inlineStreaming.createDataSets(data);
		for (let leadid in datasets['C_dS_lead']) {
            let dS = datasets['C_dS_lead'][leadid];

			for (let id in datasets['C_dS_customer']) {
				let dS_customer = datasets['C_dS_customer'][id];
				console.log(dS_customer);

				switch (this.dSLead.status) {
					case 2:
						if (dS.status == 2) {
							$('#customertable > tbody').find('#'+id).html('<td class="column2" style="background-color:#F4F4F6;">'+dS_customer.accountName+'</td><td class="column3" style="background-color:#F4F4F6;">'+dS_customer.clientNr+'</td><td class="column1">'+dS.companyname+'</td><td class="column4">'+dS.speciality+'</td><td class="column5">'+dS.firstname+'</td><td>'+dS.lastname+'</td>');
							$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
						}
						else{
							if (dS.status == 4) {
								let rowindex = document.getElementById(id).rowIndex;
								document.getElementById('customertable').deleteRow(rowindex);
								let tr = '<tr id="'+dS_customer.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)"><td class="column2" style="background-color:#F4F4F6;">'+dS_customer.accountName+'</td><td class="column3" style="background-color:#F4F4F6;">'+dS_customer.clientNr+'</td><td class="column1">'+dS.companyname+'</td><td class="column4">'+dS.speciality+'</td><td class="column5">'+dS.firstname+'</td><td>'+dS.lastname+'</td></tr>';								
								$("#lostCustomertable > tbody").append(tr);
								$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
							}
							else{
								let rowindex = document.getElementById(id).rowIndex;
								document.getElementById('customertable').deleteRow(rowindex);
								$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
							}
						}
						break;
					case 4:
						if (dS.status == 4) {
							$('#lostCustomertable > tbody').find('#'+id).html('<td class="column2" style="background-color:#F4F4F6;">'+dS_customer.accountName+'</td><td class="column3" style="background-color:#F4F4F6;">'+dS_customer.clientNr+'</td><td class="column1">'+dS.companyname+'</td><td class="column4">'+dS.speciality+'</td><td class="column5">'+dS.firstname+'</td><td>'+dS.lastname+'</td>');
							$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
						}
						else{
							if (dS.status == 2) {
								let rowindex = document.getElementById(id).rowIndex;
								document.getElementById('lostCustomertable').deleteRow(rowindex);
								let tr = '<tr id="'+dS_customer.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)"><td class="column2" style="background-color:#F4F4F6;">'+dS_customer.accountName+'</td><td class="column3" style="background-color:#F4F4F6;">'+dS_customer.clientNr+'</td><td class="column1">'+dS.companyname+'</td><td class="column4">'+dS.speciality+'</td><td class="column5">'+dS.firstname+'</td><td>'+dS.lastname+'</td></tr>';								
								$("#customertable > tbody").append(tr);
								$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
							} else {
								let rowindex = document.getElementById(id).rowIndex;
								document.getElementById('customertable').deleteRow(rowindex);
								$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
							}
						}
						break;
					default:
						break;
				}
			}
		}

	},
	// Change caption of button
    sent: function() {
        var caption = '<i class="fas fa-user-check mob-txt-lime fa-2x"></i>';
        //this.controls.done.set(caption);

        console.log('C_iLead::sent, ajax returned here');
    },
	// Close the modal
	close: function(){
		console.log("Clicked on close button");
		$('section.leadsTableSection').find("#addUserTab").addClass("invisible");
		$('section.customerTableSection').find("#CustomerModal").addClass("invisible");
		$('div.inputfield').find('input').text("")
	},
	// Send an email and create the contract of the client
	sign: function(){
		console.log("Clicked on sign button");
	}
}