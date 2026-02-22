///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//privacy policy customization for loxamed/airfrance booking page
//optinairfrance.js script overrides C_eOptin class from e-resa.js with 3 new checkboxes to check before registering visitor
//(see *optin*)
//
C_eOptin = function(eid, callbacks) {
	this.classname = 'C_eOptin';
	this.elements = new A_el();
	this.callbacks = callbacks; 

	this.eids = { optin:eid+'optin',msg:eid+'_msg', optin2:eid+'_optin2',optin3:eid+'_optin3',optin4:eid+'_optin4'};
	
	let optin = new C_iONOFF(this.eids.optin, { onswitch:new A_cb(this, this.onoptin, null, null, 750) }, { state:0, mandatory:true } );
    let optin2 = new C_iONOFF(this.eids.optin2, { onswitch:new A_cb(this, this.onoptin, null, null, 750) }, { state:0, mandatory:true } );
    let optin3 = new C_iONOFF(this.eids.optin3, { onswitch:new A_cb(this, this.onoptin, null, null, 750) }, { state:0, mandatory:true } );
    let optin4 = new C_iONOFF(this.eids.optin4, { onswitch:new A_cb(this, this.onoptin, null, null, 750) }, { state:0, mandatory:true } );

	this.controls = new A_ct({optin:optin,optin2:optin2,optin3:optin3,optin4:optin4})
}
C_eOptin.prototype = { 
    display: function() {
		let prvpol = '<br><a style="text-decoration:underline;" target="_blank" href="../_assets/queries/privacy.php?k='+mobminder.context.keyId+'">'+C_XL.w('read privacy')+mobminder.account.name+'</a>';

        let optin2lb = '1. En cochant cette case, je reconnais avoir lu et accepté les conditions générales d\'utilisation de la cabine ORL (CGU) et que mes données personnelles administratives soient traitées par LOXAMED dans le cadre de sa politique de protection des données personnelles conformément aux Lois sur la protection des données (LIL et RGPD) (accessible sur le site <a style="text-decoration:underline;" href="https://www.loxamed.fr" target="_blank">www.loxamed.fr</a>).';
        let optin3lb = '2. En cochant cette case, je reconnais avoir pu recueillir les informations utiles quant à l\'acte médical qui m\'est proposé et y consens.';
        let optin4lb = '3. En cochant cette case, je reconnais avoir pris connaissance et accepter que la réalisation de l\'acte médical que je sollicite nécessite un traitement de mes données de santé à caractère personnel par le médecin intervenant du Groupe Hospitalier du Sud Ile-de-France. J\'ai été informé et ai eu l\'occasion de consulter la politique de protection des données personnelles du Groupe Hospitalier du Sud Ile-de-France, responsable de traitement (accessible sur le site <a style="text-decoration:underline;" href="https://www.ghsif.fr" target="_blank">www.ghsif.fr</a> /à valider/)."';

		let opswitch =  '<div class="" style="margin:2em 0 0 0;">'+this.controls.optin.display()+'<span class="e-msg" style="margin-left:1em;">'+C_XL.w('pls opt in')+' '+prvpol+'</span></div>';
        let opswitch2 = '<div class="" style="margin:2em 0 0 0;">'+this.controls.optin2.display()+'<span class="e-msg" style="margin-left:1em;">'+optin2lb+'</span></div>';
        let opswitch3 = '<div class="" style="margin:2em 0 0 0;">'+this.controls.optin3.display()+'<span class="e-msg" style="margin-left:1em;">'+optin3lb+'</span></div>';
        let opswitch4 = '<div class="" style="margin:2em 0 0 0;">'+this.controls.optin4.display()+'<span class="e-msg" style="margin-left:1em;">'+optin4lb+'</span></div>';
		return opswitch+opswitch2+opswitch3+opswitch4;
	},
	activate: function() { 
		this.elements.collect(this.eids.own); this.controls.activate('C_eOptin'); 
	},
	value: function(){
		return (
            (!!this.controls.optin.value()) 
            && (!!this.controls.optin2.value()) 
            && (!!this.controls.optin3.value()) 
            && (!!this.controls.optin4.value())
        );
	},
	onoptin: function(state) { 
		if(vbs) vlog('e-resa.js','C_eOptin','onoptin','state:'+state); 
		this.callbacks.onswitch.cb();
		//this.typing(); // recalculates this.state.valid
	},
}
