/*
LEAD
*/

// Class to create or add an event on every part of the lead table
function C_iLeadsTable(eid, preset, type) {
    this.eids = { add: eid + '_add' };
    this.elements = new A_el();

    this.state = C_iLeadsTable.defauts.align(preset = preset || {});

    let add = new C_iCLIK(this.eids.add, { click: new A_cb(this, this.newLead) }, { tag: 'div', ui: '<i class="fas fa-user-plus mob-txt-lime fa-2x"></i>', enabled: true });

    this.controls = new A_ct({ add: add });
    let that = this;

    this.type = type;

    let title;
    let post;

    title = new C_iPASS(this.type);
    let onreply;

    switch (type) {
        case 3:
            onreply = new A_cb(this, this.showLostLeadInTable, this.type);
            break;
        case 1:
            onreply = new A_cb(this, this.showLeadInTable, this.type);
            break;
        default:
            break;
    }
    post = new A_ps({ type: title }, { type: 'type' }, '../assets/php/query/leads.php', { onreply: onreply, ontimeout: new A_cb(this, this.failed) }, {/*options*/ });    


    // Get all the tr's of the lead table to make it clickable
    $('#leadstable tbody').on('click', 'tr', function () {

        let callback = new A_cb(that, that.showLeadDetails, this.id);
        let timeout = new A_cb(that, that.failed);

        let id = new C_iPASS(this.id);
        let post = new A_ps({ id: id }, { id: 'id' }, '../assets/php/query/lead.php', { onreply: callback, ontimeout: timeout }, {/*options*/ });
    });

    // Get all the tr's of the lead table to make it clickable
    $('#lostLeadstable tbody').on('click', 'tr', function () {

        let callback = new A_cb(that, that.showLostLeadDetails, this.id);
        let timeout = new A_cb(that, that.failed);

        let id = new C_iPASS(this.id);
        let post = new A_ps({ id: id }, { id: 'id' }, '../assets/php/query/lostlead.php', { onreply: callback, ontimeout: timeout }, {/*options*/ });
    });
}
C_iLeadsTable.defauts = new A_df({ rows: 4, busy: false, xl: false, title:'no title', logged:false});
C_iLeadsTable.prototype = {
    display: function (e) {
        let add = this.controls.add.display('button');
        return add;
    },
    activate: function () {
        this.elements.collect(this.eids);
        this.controls.activate();
        if(this.tip) this.tip.activate();
    },
    // Show the user screen when clicked on button
    newLead: function (e) {
        console.log("Clicked on add button");
        let dS = new C_dS_lead();
        dS.accountm = this.state.logged;
        let c = new M_Lead('inscription', dS, { target: $('#inscription') });
        c.display();
        c.activate();

        $('section.leadsTableSection').find("#addUserTab").removeClass("invisible");
    },
    //Function called when the clicked on the tr's
    showLeadDetails: function (lid, stream) {
        let data = stream.extract('<data>', '</data>').match;

        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let dSbyGet = C_dS_lead.get(lid);

        // Show the user tab
        let c = new M_Lead('inscription', dSbyGet, { target: $('#inscription') })

        c.display();
        c.activate();

        $('section.leadsTableSection').find("#addUserTab").removeClass("invisible");
    },
    //Function called when fetch of elements failed
    failed: function () {
        console.log("Failed");
    },
    showLeadInTable: function (lid, stream) {
        let data = stream.extract('<data>', '</data>').match;
        
        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);
/*ADDED 10-05-2023 for sort*/
        let set = [];
        let values = new Array();

        for (let id in datasets['C_dS_lead']) {
            let dS = datasets['C_dS_lead'][id];
            set.push(dS.id);
        }

        for (let x in set) {
            let id = set[x];
            let dS = datasets['C_dS_lead'][id];
            let d = new Date(dS.created);
            // values[id] = d.getTime();
            values[id] = d.sortable();
        }

let verbose = 0, compare = []; // this is for debugging purpose
if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x] = { before:v, after:0 } }

        set.sort(function (a,b) {return (values[a]>values[b]?-1:1);})

if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x].after = v; }

if(verbose)
for(let x in set) { console.log(x+'] '+compare[x].after+' / '+compare[x].after); }
               
        set.forEach(element => {
            let dS = datasets['C_dS_lead'][element];
            
            let dSfollowUpbyGet = C_dS_followUp.get(dS.followUp);
            let color;
            let colortxt;
            let bell ='';
            switch (dSfollowUpbyGet.id) { // 1: contacted, 2:to be contacted, 3:Scheduled appointment, 4:Demo, 5:Contract sent, default here is not adressed 
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
                    color= 'no-border';
                    colortxt = 'redText';
                    bell = '<i class="fal fa-bell" style="padding-left:5px;"></i>';         
                    break;
            }
            let created;
            let changed;
            if (dS.created == 0 || dS.created == '' || dS.created == null || dS.created == '0000-00-00 00:00:00') {
                created = '';
            }
            else{
                let dateCreation = new Date(dS.created);
                created = dateCreation.getFullYear()+'-'+(dateCreation.getMonth()+1)+'-'+dateCreation.getDate();
            }
            if (dS.changed == '0000-00-00 00:00:00') {
                changed = '';
            }
            else{
                let dateModified = new Date(dS.changed);
                changed = dateModified.getFullYear()+'-'+(dateModified.getMonth()+1)+'-'+dateModified.getDate();
            }

// console.log(this.eids);
            let td1 = '<td id="'+dS.id+'_c1" class="'+color+'"></td>';
            let td2 ='<td id="'+dS.id+'_c2" class="column2">'+dS.id+'</td>';
            let td3 = '<td id="'+dS.id+'_c3" class="column3">'+dS.firstname+'</td>';
            let td4 = '<td id="'+dS.id+'_c4" class="column4">'+dS.lastname+'</td>';
            let td5 = '<td id="'+dS.id+'_c5" class="column5">'+created+'</td>';
            let td6 = '<td id="'+dS.id+'_c6" class="column6">'+changed+'</td>';
            let td7 = '<td id="'+dS.id+'_c7" class="column7 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td>';
            let td8 = '<td id="'+dS.id+'_c8" class="column8">'+dS.companyname+'</td>';
            let td9 = '<td id="'+dS.id+'_c9" class="column9">'+dS.country+'</td>';
            let td10 = '<td id="'+dS.id+'_c10" class="column10">'+dS.city+'</td>';
            let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)">'+td1+td2+td3+td4+td5+td6+td7+td8+td9+td10+'</tr>';
            $("#leadstable > tbody").append(tr);
            if (dS.notes != '') { let t = new C_iTIP(dS.id+'_c7', {text:dS.notes.htmlize(), css:'tip'}); t.activate(); } //Show the note in a tooltip when mouse on a td of "follow up" column
            else { let t = new C_iTIP(dS.id+'_c7', {text:'No notes', css:'tip'}); t.activate(); }

            let phonetip = '<p><span class="mob-txt-blue"><i class="fa fa-phone" style="padding-right:5px;"></i>Mobile: </span>'+dS.phoneNr.htmlize()+'</p>';
            let emailtip = '<p><span class="mob-txt-blue"><i class="fa fa-envelope" style="padding-right:5px;"></i>Email: </span>'+dS.email.htmlize()+'</p>';
            let contactinfo = new C_iTIP(dS.id+'_c2', {text:phonetip+emailtip, css:'tip'}); contactinfo.activate();  //Show the phone number and the email in a tooltip when mouse on a td of "ID" column
        });
    },
    showLostLeadInTable: function (lid, stream){
        let data = stream.extract('<data>', '</data>').match;
        
        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let set = [];
        let values = new Array();

        for (let id in datasets['C_dS_lead']) {
            let dS = datasets['C_dS_lead'][id];
            set.push(dS.id);
        }

        for (let x in set) {
            let id = set[x];
            let dS = datasets['C_dS_lead'][id];
            let d = new Date(dS.created);
            // values[id] = d.getTime();
            values[id] = d.sortable();
        }

let verbose = 0, compare = []; // this is for debugging purpose
if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x] = { before:v, after:0 } }

        set.sort(function (a,b) {return (values[a]>values[b]?-1:1);})

if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x].after = v; }

if(verbose)
for(let x in set) { console.log(x+'] '+compare[x].after+' / '+compare[x].after); }

        set.forEach(element => {
            let dS = datasets['C_dS_lead'][element];
            
            let dSfollowUpbyGet = C_dS_followUp.get(dS.followUp);
            let color;
            let colortxt;
            let bell = '';
            switch (dSfollowUpbyGet.id) { // 1: contacted, 2:to be contacted, 3:Scheduled appointment, 4:Demo, 5:Contract sent, default here is not adressed 
                case 1:
                    color = 'blueFlag';
                    break;
                case 2:
                    color = 'redFlag';
                    break;
                case 3:
                    color = 'orangeFlag';
                    break;
                case 4:
                    color = 'greenFlag';
                    break;
                case 5:
                    color = 'pinkFlag';
                    break;
                default:
                    //color = 'redFlag';
                    color= 'no-border';
                    colortxt = 'redText';  
                    bell = '<i class="fal fa-bell" style="padding-left:5px;"></i>';                 
                    break;
            }
            let created;
            let changed;
            if (dS.created == 0 || dS.created == '' || dS.created == null || dS.created == '0000-00-00 00:00:00') {
                created = '';
            }
            else{
                let dateCreation = new Date(dS.created);
                created = dateCreation.getFullYear()+'-'+(dateCreation.getMonth()+1)+'-'+dateCreation.getDate();
            }
            if (dS.changed == '0000-00-00 00:00:00') {
                changed = '';
            }
            else{
                let dateModified = new Date(dS.changed);
                changed = dateModified.getFullYear()+'-'+(dateModified.getMonth()+1)+'-'+dateModified.getDate();
            }

        // console.log(this.eids);

            let td1 = '<td id="'+dS.id+'_c1" class="'+color+'"></td>';
            let td2 ='<td id="'+dS.id+'_c2" class="column2">'+dS.id+'</td>';
            let td3 = '<td id="'+dS.id+'_c3" class="column3">'+dS.firstname+'</td>';
            let td4 = '<td id="'+dS.id+'_c4" class="column4">'+dS.lastname+'</td>';
            let td5 = '<td id="'+dS.id+'_c5" class="column5">'+created+'</td>';
            let td6 = '<td id="'+dS.id+'_c6" class="column6">'+changed+'</td>';
            let td7 = '<td id="'+dS.id+'_c7" class="column7 '+colortxt+'">'+dSfollowUpbyGet.name+' '+bell+'</td>';
            let td8 = '<td id="'+dS.id+'_c8" class="column8">'+dS.companyname+'</td>';
            let td9 = '<td id="'+dS.id+'_c9" class="column9">'+dS.country+'</td>';
            let td10 = '<td id="'+dS.id+'_c10" class="column10">'+dS.city+'</td>';
            let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)">'+td1+td2+td3+td4+td5+td6+td7+td8+td9+td10+'</tr>';
            $("#lostLeadstable > tbody").append(tr);
            if (dS.notes != '') { let t = new C_iTIP(dS.id+'_c7', {text:dS.notes.htmlize(), css:'tip'}); t.activate(); } //Show the note in a tooltip when mouse on a td of "follow up" column
            else { let t = new C_iTIP(dS.id+'_c7', {text:'No notes', css:'tip'}); t.activate(); }

            let phonetip = '<p><span class="mob-txt-blue"><i class="fa fa-phone" style="padding-right:5px;"></i>Mobile: </span>'+dS.phoneNr.htmlize()+'</p>';
            let emailtip = '<p><span class="mob-txt-blue"><i class="fa fa-envelope" style="padding-right:5px;"></i>Email: </span>'+dS.email.htmlize()+'</p>';
            let contactinfo = new C_iTIP(dS.id+'_c2', {text:phonetip+emailtip, css:'tip'}); contactinfo.activate();  //Show the phone number and the email in a tooltip when mouse on a td of "ID" column

        });
    },
    showLostLeadDetails: function (cid, stream) {
        let data = stream.extract('<data>', '</data>').match;

        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let dSbyGet = C_dS_lead.get(cid);

        // Show the user tab
        let c = new M_Lead('inscription', dSbyGet , { target: $('#inscription') });

        c.display();
        c.activate();

        $('section.leadsTableSection').find("#addUserTab").removeClass("invisible");
    }
}

/*
CUSTOMER
*/

// Function that is called when user wants to add a user
function C_iCustomerTable(eid, preset, type) {
    this.eids = { add: eid + '_add' };
    this.elements = new A_el();

    this.state = C_iCustomerTable.defauts.align(preset = preset || {});

    let add = new C_iCLIK(this.eids.add, { click: new A_cb(this, this.pop) }, { tag: 'div', ui: '<i class="fas fa-user-plus mob-txt-lime fa-2x"></i>', enabled: true });

    this.controls = new A_ct({ add: add });

    let that = this;

    this.type = type;

    let title;
    let post;

    title = new C_iPASS(this.type);
    let onreply;

    switch (type) {
        case 4:
            onreply = new A_cb(this, this.showLostCustomerInTable, this.type);
            break;
        case 2:
            onreply = new A_cb(this, this.showCustomerInTable, this.type);
            break;
        default:
            break;
    }

    post = new A_ps({ type: title }, { type: 'type' }, '../assets/php/query/customers.php', { onreply: onreply, ontimeout: new A_cb(this, this.failed) }, {/*options*/ });    

    // Get all the tr's of the lead table to make it clickable
    $('#customertable tbody').on('click', 'tr', function () {

        let callback = new A_cb(that, that.showCustomerDetails, this.id);
        let timeout = new A_cb(that, that.failed);

        let id = new C_iPASS(this.id);
        let post = new A_ps({ id: id }, { id: 'id' }, '../assets/php/query/customer.php', { onreply: callback, ontimeout: timeout }, {/*options*/ });
    });

    // Get all the tr's of the lead table to make it clickable
    $('#lostCustomertable tbody').on('click', 'tr', function () {

        let callback = new A_cb(that, that.showCustomerDetails, this.id);
        let timeout = new A_cb(that, that.failed);

        let id = new C_iPASS(this.id);
        let post = new A_ps({ id: id }, { id: 'id' }, '../assets/php/query/customer.php', { onreply: callback, ontimeout: timeout }, {/*options*/ });
    });
}
C_iCustomerTable.defauts = new A_df({ rows: 4, busy: false, xl: false });
C_iCustomerTable.prototype = {
    display: function (e) {
        let add = this.controls.add.display('button');
        return add;
    },
    activate: function () {
        this.elements.collect(this.eids);
        this.controls.activate();
    },
    showCustomerInTable: function(cid, stream){
        let data = stream.extract('<data>', '</data>').match;
        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let set = [];
        let values = new Array();

        for (let id in datasets['C_dS_customer']) {
            let dS = datasets['C_dS_customer'][id];
            set.push(dS.id);
        }

        for (let x in set) {
            let id = set[x];
            let dS = datasets['C_dS_customer'][id];
            let d = new Date(dS.birthdayContract);
            // values[id] = d.getTime();
            values[id] = d.sortable();
        }

let verbose = 0, compare = []; // this is for debugging purpose
if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x] = { before:v, after:0 } }

        set.sort(function (a,b) {return (values[a]>values[b]?-1:1);})

if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x].after = v; }

if(verbose)
for(let x in set) { console.log(x+'] '+compare[x].after+' / '+compare[x].after); }
        
        set.forEach(element => {
            let dS = datasets['C_dS_customer'][element];
            let dSlead = C_dS_lead.get(dS.leadid)

            let td1 = '<td id="'+dS.id+'_c1" class="column1">'+dS.clientNr+'</td>';
            let td2 ='<td id="'+dS.id+'_c2" class="column2">'+dS.accountName+'</td>';
            let td3 = '<td id="'+dS.id+'_c3" class="column3">'+dSlead.companyname+'</td>';
            let td4 = '<td id="'+dS.id+'_c4" class="column4">'+dSlead.speciality+'</td>';
            let td5 = '<td id="'+dS.id+'_c5" class="column5">'+dSlead.firstname+'</td>';
            let td6 = '<td id="'+dS.id+'_c6" class="column6">'+dSlead.lastname+'</td>';
            let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)">'+td1+td2+td3+td4+td5+td6+'</tr>';
            $("#customertable > tbody").append(tr);

            if (dSlead.notes != '') { let t = new C_iTIP(dS.id, {text:dSlead.notes.htmlize(), css:'tip'}); t.activate(); } //Show the note in a tooltip when mouse on a td of "follow up" column
            else { let t = new C_iTIP(dS.id, {text:'No notes', css:'tip'}); t.activate(); }
            
        });
    },
    showLostCustomerInTable: function(cid, stream){
                let data = stream.extract('<data>', '</data>').match;
        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let set = [];
        let values = new Array();

        for (let id in datasets['C_dS_customer']) {
            let dS = datasets['C_dS_customer'][id];
            set.push(dS.id);
        }

        for (let x in set) {
            let id = set[x];
            let dS = datasets['C_dS_customer'][id];
            let d = new Date(dS.birthdayContract);
            // values[id] = d.getTime();
            values[id] = d.sortable();
        }

let verbose = 0, compare = []; // this is for debugging purpose
if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x] = { before:v, after:0 } }

        set.sort(function (a,b) {return (values[a]>values[b]?-1:1);})

if(verbose)
for(let x in set) { let id = set[x]; let v = values[id]; compare[x].after = v; }

if(verbose)
for(let x in set) { console.log(x+'] '+compare[x].after+' / '+compare[x].after); }
        
        set.forEach(element => {
            let dS = datasets['C_dS_customer'][element];
            let dSlead = C_dS_lead.get(dS.leadid)

            let td1 = '<td id="'+dS.id+'_c1" class="column1">'+dS.clientNr+'</td>';
            let td2 ='<td id="'+dS.id+'_c2" class="column2">'+dS.accountName+'</td>';
            let td3 = '<td id="'+dS.id+'_c3" class="column3">'+dSlead.companyname+'</td>';
            let td4 = '<td id="'+dS.id+'_c4" class="column4">'+dSlead.speciality+'</td>';
            let td5 = '<td id="'+dS.id+'_c5" class="column5">'+dSlead.firstname+'</td>';
            let td6 = '<td id="'+dS.id+'_c6" class="column6">'+dSlead.lastname+'</td>';
            let tr = '<tr id="'+dS.id+'" onmouseover="ChangeBackgroundColor(this)" onmouseout="RestoreBackgroundColor(this)">'+td1+td2+td3+td4+td5+td6+'</tr>';
            $("#lostCustomertable > tbody").append(tr);

            if (dSlead.notes != '') { let t = new C_iTIP(dS.id, {text:dSlead.notes.htmlize(), css:'tip'}); t.activate(); } //Show the note in a tooltip when mouse on a td of "follow up" column
            else { let t = new C_iTIP(dS.id, {text:'No notes', css:'tip'}); t.activate(); }
            
        });
    },
    //Function called when the clicked on the tr's
    showCustomerDetails: function (cid, stream) {
        let data = stream.extract('<data>', '</data>').match;

        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let dSbyGet = C_dS_customer.get(cid);

        // Show the user tab
        let c = new M_Customer('inscription', dSbyGet, { target: $('#inscription') });

        c.display();
        c.activate();

        $('section.customerTableSection').find("#CustomerModal").removeClass("invisible");
    },
    //Function called when the clicked on the tr's
    showLostCustomerDetails: function (cid, stream) {
        let data = stream.extract('<data>', '</data>').match;

        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

        let dSbyGet = C_dS_customer.get(cid);


        // Show the user tab
        let c = new M_Lead('inscription', { dataset: dSbyGet }, { target: $('#inscription') });

        c.display();
        c.activate();

        $('section.customerTableSection').find("#CustomerModal").removeClass("invisible");
    },
    //Function called when fetch of elements failed
    failed: function () {
        console.log("Failed")
    }
}