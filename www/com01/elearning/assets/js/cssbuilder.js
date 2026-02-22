class C_eCSSedit {

    constructor(eid,cbk,options) {

        
        let defaults = new A_df( { checked:false, digits:'', ph:'Enter a css rule', h5:'You did not specify a title', targetelement:'body' } )
        this.state = defaults.align(options); // object like { digits:aValue, enabled:trueORfalse, hidden:trueORfalse }

            let base = eid+'_';
        this.eids = { h5:base+'h5', field:base+'fd', check:base+'ck' };
        this.elements = new A_el();
        this.callbacks = cbk || { }; // like { oncssedit: }    

            let ruby = '<i class="fa fa-angle-right white" style="margin:0.3em; display:inline-block;">'+'</i>'; // the checker container
        let check = new C_iCLIK(this.eids.check, { click:new A_cb(this, this.oncsscheck)} , { tag:'div', ui:ruby , css:'cresta-check mob-bg-gray_l', style:'display:inline-flex; vertical-align: middle; margin-left:10px; border-radius:5px; width:32px;align-items:center;justify-content:center;' } );
        let field 	= new C_iFIELD(this.eids.field, { onfchange:new A_cb(this, this.oncsstype, null, null, 1000) }, { digits:this.state.digits, type:INPUT_TEXT, mandatory:false, dblclick:false, placeholder:this.state.ph });

        this.controls = new A_ct({check:check, field:field}); 

    }


    // public

    display() {

        let title = '<h5 id="'+this.eids.h5+'" style="display:block" class="air left mob-txt-gray_d"><i class="fa fa-paint-brush mob-txt-lime"></i>'+this.state.h5+'</h5>';
        let field = this.controls.field.display('wide css-field');
        let check = this.controls.check.display();
        return title+'<div style="display:flex; align-items:center;">'+field+check+'</div>';
        
    }

    activate() {
        this.elements.collect(this.eids);
        this.controls.activate('C_eCSSedit');
    }

    clear() { this.controls.field.clear({ propagate:false }); return this; }
    set(what) { this.controls.field.set(what,{ propagate:false }); return this; }
    check(onoff) { this.state.checked = onoff; this.setcheckcss(); return this; }

    // callbacks

    oncsscheck() {

        this.state.checked = !this.state.checked;
        this.setcheckcss();
        
        if(this.callbacks.oncssedit) {
            this.callbacks.oncssedit.cb(this.state.checked, this.controls.field.digits());
        }
 
    }

    oncsstype() {
        
        if(this.callbacks.oncssedit) {
            this.callbacks.oncssedit.cb(this.state.checked, this.controls.field.digits());
        }
    }

    // private
    setcheckcss() {
        $('#'+this.eids.check+'_ui > i').removeClass('fa-angle-right fa-check');
        $('#'+this.eids.check+'_ui').removeClass('mob-bg-lime mob-bg-gray_l');
        if(this.state.checked) { 
            $('#'+this.eids.check+'_ui > i').addClass('fa-check');
            $('#'+this.eids.check+'_ui').addClass('mob-bg-lime');
        }
        else {
            $('#'+this.eids.check+'_ui > i').addClass('fa-angle-right');
            $('#'+this.eids.check+'_ui').addClass('mob-bg-gray_l');
        }
    }
}

class C_eType {

    constructor(eid,cbk,options) {

    }


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
	this.form = $('#'+this.state.parent).find('#'+this.state.target+'_form'); 
		if(!this.form.length) console.log('C_iPro::Could not find target form: #'+this.state.target+'_form inside parent');
		else console.log('C_iPro::Found target form: #'+this.state.target+'_form');
		
	this.which = 'C_iPro['+this.state.target+']';
}
C_iPro.defauts = new A_df( { parent:false, target:false, lang:'en', choice:'x', xl:false, mandatory:true, locker:true } );
C_iPro.prototype = {
	display: function(e) {
				
				var choice = this.controls.choice.display('small');
				var lang = this.controls.lang.display('small');
			var footer = '<div class="'+this.state.target+' wz-status">'+choice+lang+'</div>';
		
				var elname = '#'+this.state.target+'_form_status';
			var status = $('#'+this.state.parent).find(elname);
		if(!status.length) console.log('C_iPro::Could not find status input anchor point: |'+elname+'|');
			else status.after(footer);
        
        return this;
	},
	activate: function() { 
		
		console.log('activate: '+this.state.target );
		this.elements.collect(this.eids.ch);
		this.controls.activate(); 
		var context = this;
		if(this.state.xl) this.form.find('h3.ixl').each( function() { $(this).show(); } ); // show for interactive translations
        let c = 0;
		$(this.form).find('div.'+this.state.target).each(
			function() {
				$(this)
				.mouseover( function(){ $(this).addClass('xlpoint');} )
				.mouseout( function(){ $(this).removeClass('xlpoint');} )
				.click( context.handlers.touch );
                c++;
				} 
		)
        if(c==0) console.log('C_iPro::Could not find any clickable element in your structure');
        else console.log ('C_iPro::We have found '+c+' clickable element in your structure');
	},
	hide: function() { this.form.hide(); },
	show: function() { this.form.show(); },
	
	// event handling
	touch: function(e) {
		
		var value = $(e.currentTarget).attr('value');
		this.controls.choice.set(value);
		this.state.choice = value;
		let formid = this.state.target;
		
		// console.log('           C_iPro touch :'+value);
		
		this.form.find('div.'+formid).each( function() { $(this).addClass('reduced'); } );
		this.form.find('#'+formid+'_'+value).removeClass('reduced');
		
		this.form.find('div.'+formid).each( function() { $(this).removeClass('selected'); } );
		this.form.find('#'+formid+'_'+value).addClass('selected');
		
		this.form.find('.confirm').each( function() { $(this).hide(); } );
		this.form.find('#'+formid+'_tip_'+value).show();
		this.form.find('#'+formid+'_tip2_'+value).show();
		
		if(this.state.locker) $(this.form).find('div.fa-lock-alt').removeClass('fa-lock-alt').addClass('fa-lock-open-alt');
		
		// status summary section (*ls01*)
			let zoneid = '#status_'+formid;
			let zone = $('#submit_overview').find(zoneid);
				// if(zone.length ==0) { console.log('zone: '+zoneid+' NOT FOUND'); };
		
		$(zone).find('.form-summary-tip').hide(); // removes invitation to answer the question
		$(zone).find('.form-summary-replace').hide(); // removes titles or comments
		let elname = 'summary_'+formid+'_'+value; $(zone).find('#'+elname).show(); // shows the summary text for the chosen value
		
		let staticon = $(zone).find('i.fad').eq(0);
		$(staticon).removeClass('fa-exclamation-circle orange').addClass('fa-check-square mob-txt-lime');
				
		if(this.callbacks.onchoice) this.callbacks.onchoice.cb(this);
	},
	valid: function() { if(!this.state.mandatory) return true; else if(this.controls.choice.getpost()=='x') return false; else return true;  },
	getpost: function() { return this.controls.choice.getpost(); }
}


class C_iPalette { //Colors in R,G,B format (ex. 220,100,10)

    constructor(eid, cbks, infobgcolor,infotxtcolor,ctabgcolor,ctatxtcolor,bodybgcolor,bodytxtcolor,titlestxtcolor,palettename) {

        this.callbacks = cbks || { }; // like updated:

        let base = eid+'_';
        this.eids = { infocolor:base+'iclr', ctacolor:base+'ctaclr', bodycolor:base+'bclr', titlescolor:base+'tclr', palettename:base+'pname' }

        this.infobgcolor=infobgcolor;
        this.infotxtcolor=infotxtcolor;
        this.ctabgcolor=ctabgcolor;
        this.ctatxtcolor=ctatxtcolor;
        this.bodybgcolor=bodybgcolor;
        this.bodytxtcolor=bodytxtcolor;
        this.titlestxtcolor=titlestxtcolor;
        this.palettename=palettename;
        
        this.elements = new A_el();
    }

    // public

    display() {

        let titlescolor = '<div id="'+this.eids.titlescolor+'" class="columnone" style="background-color:rgba('+this.bodybgcolor+',1); color:rgba('+this.titlestxtcolor+');">Titles</div>';
        let infoareacolor = '<div id="'+this.eids.infocolor+'" class="columnonehalf" style="background-color:rgba('+this.infobgcolor+',1); color:rgba('+this.infotxtcolor+');">Info area</div>';
        let ctacolor = '<div id="'+this.eids.ctacolor+'" class="columnonehalf" style="background-color:rgba('+this.ctabgcolor+',1); color:rgba('+this.ctatxtcolor+');">CTA</div>';
        let bgcolor = '<div id="'+this.eids.bodycolor+'" class="columnone" style="background-color:rgba('+this.bodybgcolor+',1); color:rgba('+this.bodytxtcolor+');">Body</div>';
        let name = '<div  id="'+this.eids.palettename+'" class="columnone"><h3 style="color:white;">'+this.palettename+'</h3></div>';
        let palette = '<div class="single-palette mob-bg-gray_l"><div>'+titlescolor+'</div><div class="row">'+infoareacolor+ctacolor+'</div><div>'+bgcolor+name+'</div></div>';
        return palette;

    }

    activate() {
        this.elements.collect(this.eids);

    }

    update(newcolor, colorset, bgortxt) {
        switch(colorset) {
            case 'colorset1' : 
                if(bgortxt=='txt') { this.infotxtcolor = newcolor; $(this.elements.infocolor).css('color', 'rgba('+newcolor+',1)'); }
                else if(bgortxt=='bg') { this.infobgcolor = newcolor; $(this.elements.infocolor).css('background-color', 'rgba('+newcolor+',1)'); }
                break; 
            case 'colorset2' : 
                if(bgortxt=='txt') { this.ctatxtcolor = newcolor; $(this.elements.ctacolor).css('color', 'rgba('+newcolor+',1)'); }
                else if(bgortxt=='bg') { this.ctabgcolor = newcolor; $(this.elements.ctacolor).css('background-color', 'rgba('+newcolor+',1)'); }
                break; 
            case 'colorset3' : 
                if(bgortxt=='txt') { this.titlestxtcolor = newcolor; $(this.elements.titlescolor).css('color', 'rgba('+newcolor+',1)'); }
                else if(bgortxt=='bg') { }
                break; 
            case 'colorset4' : 
                if(bgortxt=='txt') { this.bodytxtcolor = newcolor; $(this.elements.bodycolor).css('color', 'rgba('+newcolor+',1)'); }
                else if(bgortxt=='bg') { this.bodybgcolor = newcolor; $(this.elements.bodycolor).css('background-color', 'rgba('+newcolor+',1)'); $(this.elements.titlescolor).css('background-color', 'rgba('+newcolor+',1)'); }
                break; 
        }
        $(this.elements.palettename).html('<h3 style="color:white;">Adapted</h3>');

        if(this.callbacks.updated) this.callbacks.updated.cb();
    }

}

class C_iColorset {


    constructor(eid,cbk,options) {

        
        let defaults = new A_df( {phbg:'Enter a background color', phtxt:'Enter a text color', showbgfield:true })
        this.state = defaults.align(options); // object like { digits:aValue, enabled:trueORfalse, hidden:trueORfalse }

            let base = eid+'_';
        this.eids = { eid:eid, colorpreview:base+'colprev', colorfieldbg:base+'fdbg', colorfieldtxt:base+'fdtxt' };
        this.elements = new A_el();
        this.callbacks = cbk || { }; // like { onchange: }    

        this.colorpreview = '<div id="'+this.eids.colorpreview+'" class="flexinner col-4 color-preview" style="background-color:rgba('+options.bgcolor+'); color:rgba('+options.txtcolor+');">'+options.label+'</div>';
        
            let oncolorbg = new A_cb(this, this.oncolortype, 'bg', null, 1000); //1000
            let oncolortxt = new A_cb(this, this.oncolortype, 'txt', null, 1000); //1000

        let colorfieldbg = new C_iFIELD(this.eids.colorfieldbg, { onfchange:oncolorbg }, { digits:this.state.digitsbg, type:INPUT_HTMLCOLOR, max:32, mandatory:true, dblclick:false, placeholder:this.state.phbg });
        let colorfieldtxt = new C_iFIELD(this.eids.colorfieldtxt, { onfchange:oncolortxt }, { digits:this.state.digitstxt, type:INPUT_HTMLCOLOR, max:32, mandatory:true, dblclick:false, placeholder:this.state.phtxt });

        this.controls = new A_ct({colorfieldbg:colorfieldbg, colorfieldtxt:colorfieldtxt});

    }


// public

display() {
    let legendbg = '<h5 class="air left mob-txt-gray_d" style="margin:5px; 10px;"><i class="fa fa-paint-brush mob-txt-lime"></i>Background color R,G,B</h5>';
    let legendtxt = '<h5 class="air left mob-txt-gray_d" style="margin:5px; 10px;"><i class="fa fa-paint-brush mob-txt-lime"></i>Text color R,G,B</h5>';
        let showbgfield = this.state.showbgfield ? '' : 'visibility:hidden;'; 
    let colorsetpreview = '<div class="row align-items-center colorsetpreview">'+this.colorpreview+'<div style="'+showbgfield+'">'+legendbg+this.controls.colorfieldbg.display('colorfield')+'</div>'+'<div>'+legendtxt+this.controls.colorfieldtxt.display('colorfield')+'</div>'+'</div>';
    return colorsetpreview;
}

activate() {
    this.elements.collect(this.eids);
    this.controls.activate('C_iColorset');
}

// callbacks

oncolortype(correlator, newcolor) {
    let valid = this.controls.colorfieldbg.valid() && this.controls.colorfieldtxt.valid() ;
    // console.log('Is it VALID ? '+valid);
    if(this.callbacks.onchange && valid) { 
        this.callbacks.onchange.cb(newcolor, this.eids.eid, correlator); 
        this.changepreview(correlator, newcolor); 
    }
}

changepreview(correlator, newcolor) {
    if(correlator=='txt') $(this.elements.colorpreview).css('color', 'rgba('+newcolor+',1)'); 
    else if(correlator=='bg') $(this.elements.colorpreview).css('background-color', 'rgba('+newcolor+',1)');
}

}



class C_iPaletteEdit {

    constructor(eid,cbk,selectedpalette) {

            let base = eid+'_';
        this.eids = { set1:base+'prv1', set2:base+'prv2', set3:base+'prv3',set4:base+'prv4' };
        this.elements = new A_el();
        this.callbacks = cbk || { }; // like { colorsetchanged: }    

        //TODO HIDE Ifield BG color set 3 (digitsbg:this.selectedpalette.bodybgcolor) !


        this.selectedpalette=selectedpalette; // which is an instance of C_iPalette
        let tp = this.selectedpalette;
        let set1 = new C_iColorset('colorset1', {onchange:new A_cb(this, this.colorsetchanged)}, {digitsbg:tp.infobgcolor,digitstxt:tp.infotxtcolor,bgcolor:tp.infobgcolor,txtcolor:tp.infotxtcolor,label:'Info area'});
        let set2 = new C_iColorset('colorset2', {onchange:new A_cb(this, this.colorsetchanged)}, {digitsbg:tp.ctabgcolor,digitstxt:tp.ctatxtcolor,bgcolor:tp.ctabgcolor,txtcolor:tp.ctatxtcolor,label:'CTAs'});
        let set3 = new C_iColorset('colorset3', {onchange:new A_cb(this, this.colorsetchanged)}, {digitsbg:tp.bodybgcolor,digitstxt:tp.titlestxtcolor,bgcolor:tp.bodybgcolor,txtcolor:tp.titlestxtcolor,label:'Titles and bullets',showbgfield:false});
        let set4 = new C_iColorset('colorset4', {onchange:new A_cb(this, this.colorsetchanged)}, {digitsbg:tp.bodybgcolor,digitstxt:tp.bodytxtcolor,bgcolor:tp.bodybgcolor,txtcolor:tp.bodytxtcolor,label:'Body'});
        
        this.controls = new A_ct({set1:set1, set2:set2, set3:set3, set4:set4}); 
    }

    // public

    display() {
        let s1 = this.controls.set1.display();
        let s2 = this.controls.set2.display();
        let s3 = this.controls.set3.display();
        let s4 = this.controls.set4.display();
        return s1+s2+s3+s4;
    }

    activate() {
        this.elements.collect(this.eids);
        this.controls.activate('C_iPaletteEdit');
    }

    colorsetchanged(newcolor, colorset, bgortxt) {
        console.log('C_iPaletteEdit :: colorsetchanged('+newcolor+', '+colorset+', '+bgortxt+')');
        if(colorset=='colorset4'&& bgortxt=='bg') this.controls.set3.changepreview('bg',newcolor);
        this.selectedpalette.update(newcolor, colorset, bgortxt);
    }
}


class main { 
    constructor() {
        let layout = new C_iPro('layout', {onchoice:new A_cb(this, this.ontemplate)}, { target:'layout', parent:'layout_section' });

        let viewport	= new C_iDDWN('viewport', {onselect:new A_cb(this, this.onviewport)}, {labels:{ 0:'Computer', 1:'Iphone12' }}, { value:0, enabled:true } );
        let zoom = new C_iDDWN('zoom', {onselect:new A_cb(this, this.onzoom)}, {labels:{ 0:'50%', 1:'70%', 2:'100%' }}, { value:1, enabled:true } );

        //$('#dropdown-container').html(viewport.display('dropdowncss'));

        //(infobgcolor,infotxtcolor,ctabgcolor,ctatxtcolor,bodybgcolor,bodytxtcolor,titlestxtcolor)

        let palupdated = new A_cb(this, this.setrules);

        let palette_standard = new C_iPalette('palt1', { updated:palupdated },'225,234,243','80,80,80','196,227,72','65,86,32','255,255,255','80,80,80','104,151,191','Basic');

        let palette_pumpkin = new C_iPalette('palt2', { updated:palupdated },'206,209,222','66,76,85','247,136,46','255,255,255','251,249,246','66,76,85','99,108,146','Pumpkin');
        let palette_mothernature = new C_iPalette('palt3', { updated:palupdated },'220,224,249','36,36,36','0,71,62','253,249,235','237,239,252','36,36,36','34,51,59','Mother nature');
        let palette_classyautomn = new C_iPalette('palt4', { updated:palupdated },'246,234,227','63,54,49','63,54,49','255,255,255','255,255,255','63,54,49','63,54,49','Classy automn');
        let palette_classygold = new C_iPalette('palt5', { updated:palupdated },'244,244,243','2,37,75','156,131,32','255,255,255','255,255,255','0,12,50','2,37,75','Classy gold');
        let palette_black = new C_iPalette('palt6', { updated:palupdated },'244,244,243','0,0,0','0,0,0','255,255,255','255,255,255','0,0,0','0,0,0','Black');
        let palette_medical = new C_iPalette('palt7', { updated:palupdated },'225,241,255','90,90,90','61,207,186','255,255,255','255,255,255','80,80,80','36,144,235','Medical');
        let palette_pinky = new C_iPalette('palt8', { updated:palupdated },'219,200,204','39,22,31','51,92,129','241,225,227','241,225,227','39,22,31','92,55,76','Pinky');
        let palette_monoblues = new C_iPalette('palt9', { updated:palupdated },'0,6,41','255,255,255','0,120,183','255,255,255','244,246,246','8,8,8','0,6,41','Mono blues');
        let palette_olive = new C_iPalette('palt10', { updated:palupdated },'184,183,165','255,255,255','40,53,23','255,255,255','240,239,235','20,20,18','33,32,30','Olive');
        

        
        let palette = new C_iPro('palette', {onchoice:new A_cb(this, this.onpalette)}, { target:'palette', parent:'palette_section' });
        //Applied color palette when no color palette is selected and when a layout is selected
        this.selectedpalette = palette_standard,

        //Applied template when no template is selected and when a color palette is selected

        this.selectedrules = {
        welcomecolors_root:{v:'--c-base-body:!_bodytxtcolor_!; --bgc-base-body:!_bodybgcolor_!; --c-base-titles: !_titlestxtcolor_!;  --c-base-cta: !_ctatxtcolor_!; --bgc-base-cta: !_ctabgcolor_!;',c:true},
        };
        
        
            let iconcopy = '<i class="fa fa-copy fa-1dx mob-txt-lime" style="margin-right:10px;"></i>'
        let copycssbtn = new C_iCLIK('copycss',{click:new A_cb(this, this.oncopycss)},{ui:iconcopy+'Copy CSS', css:'copycssbtn mob-txt-gray_m'});

        
        this.palettes = new A_ct({ 
            palette_standard:palette_standard,
            palette_pumpkin:palette_pumpkin,
            palette_mothernature:palette_mothernature,
            palette_classyautomn:palette_classyautomn,
            palette_classygold:palette_classygold,
            palette_black:palette_black,
            palette_medical:palette_medical,
            palette_pinky:palette_pinky,
            palette_monoblues:palette_monoblues,
            palette_olive:palette_olive
        });

        let welcomecolors_root = new C_eCSSedit('welcome-colors-root', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Color variables', targetelement:':root'} );

        let welcomecolors_body = new C_eCSSedit('welcome-colors-body', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Full body background and generic text color', targetelement:'body'} );

        let welcomecolors_linkssection = new C_eCSSedit('welcome-colors-links-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip links background color', targetelement:'section.s-links'} );
        let welcomecolors_linkscontainer = new C_eCSSedit('welcome-colors-links-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column links background color', targetelement:'section.s-links div.container'} );
        let welcomecolors_linksitem = new C_eCSSedit('welcome-colors-links-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links buttons background and text color', targetelement:'section.s-links div.container a'} );
        // let eType_colors_links = new C_eType('welcome-colors-links',{},);

        let welcomecolors_h1section = new C_eCSSedit('welcome-colors-h1-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip title background color', targetelement:'section.s-h1'} );
        let welcomecolors_h1container = new C_eCSSedit('welcome-colors-h1-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column title background color', targetelement:'section.s-h1 div.container'} );
        let welcomecolors_h1item = new C_eCSSedit('welcome-colors-h1-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Title text color', targetelement:'section.s-h1 div.container h1'} );

        let welcomecolors_imgsection = new C_eCSSedit('welcome-colors-img-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip image background color', targetelement:'section.s-img'} );
        let welcomecolors_imgcontainer = new C_eCSSedit('welcome-colors-img-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column image background color', targetelement:'section.s-img div.container'} );

        let welcomecolors_infosection = new C_eCSSedit('welcome-colors-info-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip info background color', targetelement:'section.s-info'} );
        let welcomecolors_infocontainer = new C_eCSSedit('welcome-colors-info-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column info background color', targetelement:'section.s-info div.container'} );
        let welcomecolors_infoitem = new C_eCSSedit('welcome-colors-info-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Info text color', targetelement:'section.s-info div.container h2'} );
        let welcomecolors_linksinfoitem = new C_eCSSedit('welcome-colors-info-linksitem', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links info (href) text color', targetelement:'section.s-info div.container h2 a'} );

        let welcomecolors_ctasection = new C_eCSSedit('welcome-colors-cta-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip first step CTA background color', targetelement:'section.s-action'} );
        let welcomecolors_ctacontainer = new C_eCSSedit('welcome-colors-cta-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column first step CTA background color', targetelement:'section.s-action div.container'} );
        let welcomecolors_ctaitem = new C_eCSSedit('welcome-colors-cta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTAs background and text color', targetelement:'section.s-action div.container div.action, section.s-desk .e-button, section.s-desk div.container div.action'} );

        let welcomecolors_directionssection = new C_eCSSedit('welcome-colors-directions-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip hours and directions background color', targetelement:'section.s-directions'} );
        let welcomecolors_directionscontainer = new C_eCSSedit('welcome-colors-directions-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column hours and directions background color', targetelement:'section.s-directions div.container'} );
        let welcomecolors_directionsitem = new C_eCSSedit('welcome-colors-directions-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Hours and directions text color', targetelement:'section.s-directions div.container'} );
        let welcomecolors_linksdirectionsitem = new C_eCSSedit('welcome-colors-directions-linksitem', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'links directions (href) text color', targetelement:'section.s-directions div.container a'} );

        let welcomecolors_bulletitem = new C_eCSSedit('welcome-colors-bullet-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Bullets color and background color', targetelement:'section.s-desk div.e-bullet'} );
        let welcomecolors_bulletcaptionitem = new C_eCSSedit('welcome-colors-bulletcaption-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Bullets caption color', targetelement:'section.s-desk div.e-bullet-caption'} );
        let welcomecolors_previousitem = new C_eCSSedit('welcome-colors-previous-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Previous step color', targetelement:'section.s-desk .e-button-change'} );

        let welcomecolors_inputitem = new C_eCSSedit('welcome-colors-input-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Inputs background-color & color', targetelement:'section.s-desk input, section.s-desk textarea, section.s-desk div.like-input'} );
        let welcomecolors_warneritem = new C_eCSSedit('welcome-colors-warner-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Warner text color', targetelement:'section.s-desk .e-warner'} );        

        // let welcomecolors_ctaitem_next = new C_eCSSedit('welcome-colors-cta-next-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTA next background and text color', targetelement:'section.s-desk .e-button'} );

        let welcomecolors_tooltip = new C_eCSSedit('welcome-colors-tooltip-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Tooltip background and text color', targetelement:'div.tip'} );

        let welcomecolors_headersitem_selection= new C_eCSSedit('welcome-colors-selection-headers-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Selection headers color', targetelement:'.select-header.textcolor-light'} );

        let welcomecolors_rubyitem_unselected = new C_eCSSedit('welcome-colors-unselected-ruby-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Unselected ruby background color <span style="color:red;">To be used only if Selected rubies bg color is also defined</span>', targetelement:'section.s-desk table.cresta-table.radios td > div > table td.cresta-check > ruby, section.s-desk table.cresta-table.checks td > div > table td.cresta-check > ruby'} );

        let welcomecolors_rubyitem_selected = new C_eCSSedit('welcome-colors-selected-ruby-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Selected ruby background color <span style="color:red;">To define to use Unselected rubies</span>', targetelement:'section.s-desk table.cresta-table.radios td > div.selected > table td.cresta-check > ruby, section.s-desk table.cresta-table.checks td > div.selected > table td.cresta-check > ruby'} );
       
        let welcomecolors_notes = new C_eCSSedit('welcome-colors-notes-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Notes text color & background color', targetelement:'section.s-desk .perf_notes'} );
        
        let welcomecolors_sliderunder = new C_eCSSedit('welcome-colors-slider-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Cancellation date txt color and background color', targetelement:'section.s-desk .slider-above'} );
        let welcomecolors_sliderabove = new C_eCSSedit('welcome-colors-slider-item2', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Cancellation txt color and background color', targetelement:'section.s-desk .slider-under'} );

        // let welcomecolors_endcta = new C_eCSSedit('welcome-colors-endcta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'End CTA color & background color', targetelement:'section.s-desk div.container div.action'} );

        let welcomecolors_scroll = new C_eCSSedit('welcome-colors-scroll-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Scroll background-color', targetelement:'::-webkit-scrollbar-thumb'} );
        let welcomecolors_scroll_2 = new C_eCSSedit('welcome-colors-scroll-item2', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Scroll background-color', targetelement:'html'} );

        let welcomecolors_footersection = new C_eCSSedit('welcome-colors-footer-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip footer background color', targetelement:'footer.s-footer'} );
        let welcomecolors_footercontainer = new C_eCSSedit('welcome-colors-footer-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column footer background color', targetelement:'footer.s-footer div.container'} );
        let welcomecolors_footeritem = new C_eCSSedit('welcome-colors-footer-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Footer text color', targetelement:'footer.s-footer div.container'} );

        let welcometexteffect_body = new C_eCSSedit('welcome-texteffect-body', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Full body text effect', targetelement:'body'} );
        let welcometexteffect_linksitem = new C_eCSSedit('welcome-texteffect-links-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links buttons text effect', targetelement:'section.s-links div.container a'} );
        let welcometexteffect_h1item = new C_eCSSedit('welcome-texteffect-h1-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Title text effect', targetelement:'section.s-h1 div.container h1'} );
        let welcometexteffect_infoitem = new C_eCSSedit('welcome-texteffect-info-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Info text effect', targetelement:'section.s-info div.container h2'} );
        let welcometexteffect_linksinfoitem = new C_eCSSedit('welcome-texteffect-info-linksitem', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links Info (href) text effect', targetelement:'section.s-info div.container h2 a'} );
        let welcometexteffect_ctaitem = new C_eCSSedit('welcome-texteffect-cta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTAs background and text effect', targetelement:'section.s-action div.container div.action, section.s-desk .e-button, section.s-desk div.container div.action'} );
        let welcometexteffect_directionsitem = new C_eCSSedit('welcome-texteffect-directions-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Hours and directions text effect', targetelement:'section.s-directions div.container'} );
        let welcometexteffect_linksdirectionsitem = new C_eCSSedit('welcome-texteffect-directions-linksitem', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'links directions (href) text effect', targetelement:'section.s-directions div.container a'} );
        let welcometexteffect_footeritem = new C_eCSSedit('welcome-texteffect-footer-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Footer text effect', targetelement:'footer.s-footer div.container'} );

        let welcomeopacity_body = new C_eCSSedit('welcome-opacity-body', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Body opacity or overlay', targetelement:'body'} );

        let welcomeopacity_imgitem = new C_eCSSedit('welcome-opacity-img-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Logo or img opacity', targetelement:'section.s-img div.container img'} );


        let welcomeborder_linkssection = new C_eCSSedit('welcome-border-links-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip links border', targetelement:'section.s-links'} );
        let welcomeborder_linkscontainer = new C_eCSSedit('welcome-border-links-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column links border', targetelement:'section.s-links div.container'} );
        let welcomeborder_linksitem = new C_eCSSedit('welcome-border-links-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links buttons border', targetelement:'section.s-links div.container a'} );

        let welcomeborder_h1section = new C_eCSSedit('welcome-border-h1-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip title border', targetelement:'section.s-h1'} );
        let welcomeborder_h1container = new C_eCSSedit('welcome-border-h1-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column title border', targetelement:'section.s-h1 div.container'} );
        let welcomeborder_h1item = new C_eCSSedit('welcome-border-h1-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'title border', targetelement:'section.s-h1 div.container h1'} );

        let welcomeborder_imgsection = new C_eCSSedit('welcome-border-img-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip image border', targetelement:'section.s-img'} );
        let welcomeborder_imgcontainer = new C_eCSSedit('welcome-border-img-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column image border', targetelement:'section.s-img div.container'} );
        let welcomeborder_imgitem = new C_eCSSedit('welcome-border-img-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column image border', targetelement:'section.s-img div.container img'} );

        let welcomeborder_infosection = new C_eCSSedit('welcome-border-info-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip info border', targetelement:'section.s-info'} );
        let welcomeborder_infocontainer = new C_eCSSedit('welcome-border-info-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column info border', targetelement:'section.s-info div.container'} );
        let welcomeborder_infoitem = new C_eCSSedit('welcome-border-info-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Info border', targetelement:'section.s-info div.container h2'} );
        
        let welcomeborder_ctasection = new C_eCSSedit('welcome-border-cta-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip first step CTA border', targetelement:'section.s-action'} );
        let welcomeborder_ctacontainer = new C_eCSSedit('welcome-border-cta-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column first step CTA border', targetelement:'section.s-action div.container'} );
        let welcomeborder_ctaitem = new C_eCSSedit('welcome-border-cta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTAs border', targetelement:'section.s-action div.container div.action, section.s-desk .e-button, section.s-desk div.container div.action'} );

        let welcomeborder_directionssection = new C_eCSSedit('welcome-border-directions-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip hours and directions border', targetelement:'section.s-directions'} );
        let welcomeborder_directionscontainer = new C_eCSSedit('welcome-border-directions-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column hours and directions border', targetelement:'section.s-directions div.container'} );

        let welcomeborder_bulletitem = new C_eCSSedit('welcome-border-bullet-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Bullets border', targetelement:'section.s-desk div.e-bullet'} );

        let welcomeborder_inputitem = new C_eCSSedit('welcome-border-input-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Inputs border', targetelement:'section.s-desk input, section.s-desk textarea, section.s-desk div.like-input'} );
        
        // let welcomeborder_ctanextitem = new C_eCSSedit('welcome-border-cta-next-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Next CTA border', targetelement:'section.s-desk .e-button'} );
        
        let welcomeborder_notesitem = new C_eCSSedit('welcome-border-notes-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Notes border', targetelement:'section.s-desk .perf_notes'} );

        // let welcomeborder_ctaenditem = new C_eCSSedit('welcome-border-endcta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'End CTA border', targetelement:'section.s-desk div.container div.action'} );

        let welcomeborder_selectionitem = new C_eCSSedit('welcome-border-selection-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Time selection border', targetelement:'section.s-desk span.click,section.s-desk .e-button-backnext'} );

        let welcomeborder_footersection = new C_eCSSedit('welcome-border-footer-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip footer border', targetelement:'footer.s-footer'} );
        let welcomeborder_footercontainer = new C_eCSSedit('welcome-border-footer-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column footer border', targetelement:'footer.s-footer div.container'} );


        let welcomeradius_linkssection = new C_eCSSedit('welcome-radius-links-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip links radius', targetelement:'section.s-links'} );
        let welcomeradius_linkscontainer = new C_eCSSedit('welcome-radius-links-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column links radius', targetelement:'section.s-links div.container'} );
        let welcomeradius_linksitem = new C_eCSSedit('welcome-radius-links-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links buttons radius', targetelement:'section.s-links div.container a'} );

        let welcomeradius_h1section = new C_eCSSedit('welcome-radius-h1-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip title radius', targetelement:'section.s-h1'} );
        let welcomeradius_h1container = new C_eCSSedit('welcome-radius-h1-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column title radius', targetelement:'section.s-h1 div.container'} );
        let welcomeradius_h1item = new C_eCSSedit('welcome-radius-h1-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Title radius', targetelement:'section.s-h1 div.container h1'} );

        let welcomeradius_imgsection = new C_eCSSedit('welcome-radius-img-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip image radius', targetelement:'section.s-img'} );
        let welcomeradius_imgcontainer = new C_eCSSedit('welcome-radius-img-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column image radius', targetelement:'section.s-img div.container'} );
        let welcomeradius_imgitem = new C_eCSSedit('welcome-radius-img-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Image radius', targetelement:'section.s-img div.container img'} );

        let welcomeradius_infosection = new C_eCSSedit('welcome-radius-info-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip info radius', targetelement:'section.s-info'} );
        let welcomeradius_infocontainer = new C_eCSSedit('welcome-radius-info-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column info radius', targetelement:'section.s-info div.container'} );
        let welcomeradius_infoitem = new C_eCSSedit('welcome-radius-info-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Info radius', targetelement:'section.s-info div.container h2'} );
        
        let welcomeradius_ctasection = new C_eCSSedit('welcome-radius-cta-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip first step CTA radius', targetelement:'section.s-action'} );
        let welcomeradius_ctacontainer = new C_eCSSedit('welcome-radius-cta-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column first step CTA radius', targetelement:'section.s-action div.container'} );
        let welcomeradius_ctaitem = new C_eCSSedit('welcome-radius-cta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTAs radius', targetelement:'section.s-action div.container div.action, section.s-desk .e-button, section.s-desk div.container div.action'} );

        let welcomeradius_directionssection = new C_eCSSedit('welcome-radius-directions-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip hours and directions radius', targetelement:'section.s-directions'} );
        let welcomeradius_directionscontainer = new C_eCSSedit('welcome-radius-directions-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column hours and directions radius', targetelement:'section.s-directions div.container'} );

        let welcomeradius_bulletitem = new C_eCSSedit('welcome-radius-bullet-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Bullets radius', targetelement:'section.s-desk div.e-bullet'} );
        
        let welcomeradius_inputitem = new C_eCSSedit('welcome-radius-input-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Inputs radius <span style="color:red;">Do not exceed 20px</span>', targetelement:'section.s-desk input, section.s-desk textarea, section.s-desk div.like-input'} );
        
        // let welcomeradius_ctanextitem = new C_eCSSedit('welcome-radius-cta-next-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTA next radius', targetelement:'section.s-desk .e-button'} );
        
        let welcomeradius_notesitem = new C_eCSSedit('welcome-radius-notes-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Notes radius', targetelement:'section.s-desk .perf_notes'} );
                
        // let welcomeradius_endctaitem = new C_eCSSedit('welcome-radius-endcta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'End CTA radius', targetelement:'section.s-desk div.container div.action'} );

        let welcomeradius_selectionitem = new C_eCSSedit('welcome-radius-selection-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Time selection radius', targetelement:'section.s-desk span.click,section.s-desk .e-button-backnext'} );

        let welcomeradius_footersection = new C_eCSSedit('welcome-radius-footer-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip footer radius', targetelement:'footer.s-footer'} );
        let welcomeradius_footercontainer = new C_eCSSedit('welcome-radius-footer-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column footer radius', targetelement:'footer.s-footer div.container'} );

        let welcomectainteractivity_ctaitem = new C_eCSSedit('welcome-ctainteractivity-cta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTAs hover', targetelement:'section.s-action div.container div.action:hover, section.s-desk .e-button:hover, section.s-desk div.container div.action:hover'} );

        // let welcomectainteractivity_ctaitem_next = new C_eCSSedit('welcome-ctainteractivity-ctanext-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTA hover', targetelement:'section.s-desk .e-button:hover'} );

        let welcomectainteractivity_selectionitem = new C_eCSSedit('welcome-ctainteractivity-selection-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Selections hover', targetelement:'section.s-desk td.click:hover,section.s-desk span.click:hover,section.s-desk .e-button-backnext:hover'} );
        
        // let welcomectainteractivity_endctaitem = new C_eCSSedit('welcome-ctainteractivity-endcta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTA end hover', targetelement:'section.s-desk div.container div.action:hover'} );

        let welcomespaces_linkssection = new C_eCSSedit('welcome-spaces-links-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip links spaces', targetelement:'section.s-links'} );
        let welcomespaces_linkscontainer = new C_eCSSedit('welcome-spaces-links-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column links spaces', targetelement:'section.s-links div.container'} );
        let welcomespaces_linksitem = new C_eCSSedit('welcome-spaces-links-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Links buttons spaces', targetelement:'section.s-links div.container a'} );

        let welcomespaces_h1section = new C_eCSSedit('welcome-spaces-h1-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip title spaces', targetelement:'section.s-h1'} );
        let welcomespaces_h1container = new C_eCSSedit('welcome-spaces-h1-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column title spaces', targetelement:'section.s-h1 div.container'} );

        let welcomespaces_imgsection = new C_eCSSedit('welcome-spaces-img-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip image spaces', targetelement:'section.s-img'} );
        let welcomespaces_imgcontainer = new C_eCSSedit('welcome-spaces-img-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column image spaces', targetelement:'section.s-img div.container'} );
        let welcomespaces_imgitem = new C_eCSSedit('welcome-spaces-img-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column image spaces', targetelement:'section.s-img div.container img'} );

        let welcomespaces_infosection = new C_eCSSedit('welcome-spaces-info-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip info spaces', targetelement:'section.s-info'} );
        let welcomespaces_infocontainer = new C_eCSSedit('welcome-spaces-info-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column info spaces', targetelement:'section.s-info div.container'} );
        
        let welcomespaces_ctasection = new C_eCSSedit('welcome-spaces-cta-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip CTA spaces', targetelement:'section.s-action'} );
        let welcomespaces_ctacontainer = new C_eCSSedit('welcome-spaces-cta-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column CTA spaces', targetelement:'section.s-action div.container'} );
        let welcomespaces_ctaitem = new C_eCSSedit('welcome-spaces-cta-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'CTA spaces', targetelement:'section.s-action div.container div.action'} );

        let welcomespaces_directionssection = new C_eCSSedit('welcome-spaces-directions-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip hours and directions spaces', targetelement:'section.s-directions'} );
        let welcomespaces_directionscontainer = new C_eCSSedit('welcome-spaces-directions-container', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Column hours and directions spaces', targetelement:'section.s-directions div.container'} );

        let welcomespaces_footersection = new C_eCSSedit('welcome-spaces-footer-section', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Strip footer spaces', targetelement:'footer.s-footer'} );

        let welcomefreecss = new C_eCSSedit('welcome-freecss-additional-item', { oncssedit:new A_cb(this, this.oncssrule)}, { digits:'', h5:'Additional css', targetelement:''} );


        this.controls = new A_ct({ 
            layout:layout, palette:palette, viewport:viewport, zoom:zoom,
            copycssbtn:copycssbtn,
            welcomecolors_root:welcomecolors_root,
            welcomecolors_body:welcomecolors_body,
            welcomecolors_linkssection:welcomecolors_linkssection, welcomecolors_linkscontainer:welcomecolors_linkscontainer, welcomecolors_linksitem:welcomecolors_linksitem,
            welcomecolors_h1section:welcomecolors_h1section, welcomecolors_h1container:welcomecolors_h1container, welcomecolors_h1item:welcomecolors_h1item,
            welcomecolors_imgsection:welcomecolors_imgsection, welcomecolors_imgcontainer:welcomecolors_imgcontainer,
            welcomecolors_infosection:welcomecolors_infosection, welcomecolors_infocontainer:welcomecolors_infocontainer, welcomecolors_infoitem:welcomecolors_infoitem,
            welcomecolors_linksinfoitem:welcomecolors_linksinfoitem,
            welcomecolors_ctasection:welcomecolors_ctasection, welcomecolors_ctacontainer:welcomecolors_ctacontainer, welcomecolors_ctaitem:welcomecolors_ctaitem, welcomecolors_linkssection:welcomecolors_linkssection,
            welcomecolors_directionssection: welcomecolors_directionssection, welcomecolors_directionscontainer:welcomecolors_directionscontainer, welcomecolors_directionsitem:welcomecolors_directionsitem,
            welcomecolors_linksdirectionsitem:welcomecolors_linksdirectionsitem,
            welcomecolors_bulletitem:welcomecolors_bulletitem,
            welcomecolors_bulletcaptionitem:welcomecolors_bulletcaptionitem,
            welcomecolors_previousitem:welcomecolors_previousitem,
            welcomecolors_inputitem:welcomecolors_inputitem,
            welcomecolors_warneritem:welcomecolors_warneritem,
            // welcomecolors_ctaitem_next: welcomecolors_ctaitem_next,
            welcomecolors_tooltip:welcomecolors_tooltip,
            welcomecolors_headersitem_selection:welcomecolors_headersitem_selection,
            welcomecolors_rubyitem_unselected:welcomecolors_rubyitem_unselected,
            welcomecolors_rubyitem_selected:welcomecolors_rubyitem_selected,
            welcomecolors_notes:welcomecolors_notes,
            welcomecolors_sliderunder:welcomecolors_sliderunder,
            welcomecolors_sliderabove:welcomecolors_sliderabove,
            // welcomecolors_endcta:welcomecolors_endcta,
            welcomecolors_scroll:welcomecolors_scroll,
            welcomecolors_scroll_2:welcomecolors_scroll_2,
            welcomecolors_footersection:welcomecolors_footersection, welcomecolors_footercontainer:welcomecolors_footercontainer, welcomecolors_footeritem:welcomecolors_footeritem,
            welcometexteffect_body:welcometexteffect_body,
            welcometexteffect_linksitem:welcometexteffect_linksitem,
            welcometexteffect_h1item:welcometexteffect_h1item,
            welcometexteffect_infoitem:welcometexteffect_infoitem,
            welcometexteffect_linksinfoitem:welcometexteffect_linksinfoitem,
            welcometexteffect_ctaitem:welcometexteffect_ctaitem,
            welcometexteffect_directionsitem:welcometexteffect_directionsitem,
            welcometexteffect_linksdirectionsitem:welcometexteffect_linksdirectionsitem,
            welcometexteffect_footeritem:welcometexteffect_footeritem,
            welcomeopacity_body:welcomeopacity_body,
            welcomeopacity_imgitem:welcomeopacity_imgitem,
            welcomeborder_linkssection:welcomeborder_linkssection, welcomeborder_linkscontainer:welcomeborder_linkscontainer, welcomeborder_linksitem:welcomeborder_linksitem,
            welcomeborder_h1section:welcomeborder_h1section, welcomeborder_h1container:welcomeborder_h1container, welcomeborder_h1item:welcomeborder_h1item, 
            welcomeborder_imgsection:welcomeborder_imgsection, welcomeborder_imgcontainer:welcomeborder_imgcontainer, welcomeborder_imgitem:welcomeborder_imgitem,
            welcomeborder_infosection:welcomeborder_infosection, welcomeborder_infocontainer:welcomeborder_infocontainer, welcomeborder_infoitem:welcomeborder_infoitem, 
            welcomeborder_ctasection:welcomeborder_ctasection, welcomeborder_ctacontainer:welcomeborder_ctacontainer, welcomeborder_ctaitem:welcomeborder_ctaitem, 
            welcomeborder_directionssection:welcomeborder_directionssection, welcomeborder_directionscontainer:welcomeborder_directionscontainer,
            welcomeborder_bulletitem:welcomeborder_bulletitem,
            welcomeborder_inputitem:welcomeborder_inputitem,
            // welcomeborder_ctanextitem:welcomeborder_ctanextitem,
            welcomeborder_notesitem:welcomeborder_notesitem,
            // welcomeborder_ctaenditem:welcomeborder_ctaenditem,
            welcomeborder_selectionitem:welcomeborder_selectionitem,
            welcomeborder_footersection:welcomeborder_footersection, welcomeborder_footercontainer:welcomeborder_footercontainer,
            welcomeradius_linkssection:welcomeradius_linkssection, welcomeradius_linkscontainer:welcomeradius_linkscontainer, welcomeradius_linksitem:welcomeradius_linksitem,
            welcomeradius_h1section:welcomeradius_h1section, welcomeradius_h1container:welcomeradius_h1container, welcomeradius_h1item:welcomeradius_h1item,
            welcomeradius_imgsection:welcomeradius_imgsection, welcomeradius_imgcontainer:welcomeradius_imgcontainer, welcomeradius_imgitem:welcomeradius_imgitem,
            welcomeradius_infosection:welcomeradius_infosection, welcomeradius_infocontainer:welcomeradius_infocontainer, welcomeradius_infoitem:welcomeradius_infoitem,
            welcomeradius_ctasection:welcomeradius_ctasection, welcomeradius_ctacontainer:welcomeradius_ctacontainer, welcomeradius_ctaitem:welcomeradius_ctaitem, 
            welcomeradius_directionssection:welcomeradius_directionssection, welcomeradius_directionscontainer:welcomeradius_directionscontainer,
            welcomeradius_bulletitem:welcomeradius_bulletitem,
            welcomeradius_inputitem:welcomeradius_inputitem,
            // welcomeradius_ctanextitem:welcomeradius_ctanextitem,
            welcomeradius_notesitem:welcomeradius_notesitem,
            // welcomeradius_endctaitem:welcomeradius_endctaitem,
            welcomeradius_selectionitem:welcomeradius_selectionitem,
            welcomeradius_footersection:welcomeradius_footersection, welcomeradius_footercontainer:welcomeradius_footercontainer,
            welcomectainteractivity_ctaitem:welcomectainteractivity_ctaitem, 
            // welcomectainteractivity_ctaitem_next:welcomectainteractivity_ctaitem_next,
            welcomectainteractivity_selectionitem:welcomectainteractivity_selectionitem,
            // welcomectainteractivity_endctaitem:welcomectainteractivity_endctaitem,
            welcomespaces_linkssection:welcomespaces_linkssection, welcomespaces_linkscontainer:welcomespaces_linkscontainer, welcomespaces_linksitem:welcomespaces_linksitem,
            welcomespaces_h1section:welcomespaces_h1section, welcomespaces_h1container:welcomespaces_h1container, 
            welcomespaces_imgsection:welcomespaces_imgsection, welcomespaces_imgcontainer:welcomespaces_imgcontainer, welcomespaces_imgitem:welcomespaces_imgitem,
            welcomespaces_infosection:welcomespaces_infosection, welcomespaces_infocontainer:welcomespaces_infocontainer, 
            welcomespaces_ctasection:welcomespaces_ctasection, welcomespaces_ctacontainer:welcomespaces_ctacontainer, welcomespaces_ctaitem:welcomespaces_ctaitem, 
            welcomespaces_directionssection:welcomespaces_directionssection, welcomespaces_directionscontainer:welcomespaces_directionscontainer,
            welcomespaces_footersection:welcomespaces_footersection,
            welcomefreecss:welcomefreecss
        });

    }

    // public

    display() {
        $('#dropdown-container').html('<i class="fa fa-phone-laptop mob-txt-lime" style="padding-right:10px;"></i>'+this.controls.viewport.display('dropdowncss')+'<i class="fa fa-expand mob-txt-lime" style="padding-right:10px;"></i>'+this.controls.zoom.display('dropdowncss'));

        $('#palette_pumpkin').append(this.palettes.palette_pumpkin.display());
        $('#palette_mothernature').append(this.palettes.palette_mothernature.display());
        $('#palette_classyautomn').append(this.palettes.palette_classyautomn.display());
        $('#palette_classygold').append(this.palettes.palette_classygold.display());
        $('#palette_black').append(this.palettes.palette_black.display());
        $('#palette_medical').append(this.palettes.palette_medical.display());
        $('#palette_pinky').append(this.palettes.palette_pinky.display());
        $('#palette_monoblues').append(this.palettes.palette_monoblues.display());
        $('#palette_olive').append(this.palettes.palette_olive.display());
        
        $('#welcome-colors-root-cssrule').html(this.controls.welcomecolors_root.display());

        $('#welcome-colors-body-cssrule').html(this.controls.welcomecolors_body.display());

        $('#welcome-colors-links-section-cssrule').html(this.controls.welcomecolors_linkssection.display());
        $('#welcome-colors-links-container-cssrule').html(this.controls.welcomecolors_linkscontainer.display());
        $('#welcome-colors-links-item-cssrule').html(this.controls.welcomecolors_linksitem.display());

        $('#welcome-colors-h1-section-cssrule').html(this.controls.welcomecolors_h1section.display());
        $('#welcome-colors-h1-container-cssrule').html(this.controls.welcomecolors_h1container.display());
        $('#welcome-colors-h1-item-cssrule').html(this.controls.welcomecolors_h1item.display());

        $('#welcome-colors-img-section-cssrule').html(this.controls.welcomecolors_imgsection.display());
        $('#welcome-colors-img-container-cssrule').html(this.controls.welcomecolors_imgcontainer.display());

        $('#welcome-colors-info-section-cssrule').html(this.controls.welcomecolors_infosection.display());
        $('#welcome-colors-info-container-cssrule').html(this.controls.welcomecolors_infocontainer.display());
        $('#welcome-colors-info-item-cssrule').html(this.controls.welcomecolors_infoitem.display());
        $('#welcome-colors-info-linksitem-cssrule').html(this.controls.welcomecolors_linksinfoitem.display());

        $('#welcome-colors-cta-section-cssrule').html(this.controls.welcomecolors_ctasection.display());
        $('#welcome-colors-cta-container-cssrule').html(this.controls.welcomecolors_ctacontainer.display());
        $('#welcome-colors-cta-item-cssrule').html(this.controls.welcomecolors_ctaitem.display());

        $('#welcome-colors-directions-section-cssrule').html(this.controls.welcomecolors_directionssection.display());
        $('#welcome-colors-directions-container-cssrule').html(this.controls.welcomecolors_directionscontainer.display());
        $('#welcome-colors-directions-item-cssrule').html(this.controls.welcomecolors_directionsitem.display());
        $('#welcome-colors-directions-linksitem-cssrule').html(this.controls.welcomecolors_linksdirectionsitem.display());

        $('#welcome-colors-bullet-item-cssrule').html(this.controls.welcomecolors_bulletitem.display());
        $('#welcome-colors-bulletcaption-item-cssrule').html(this.controls.welcomecolors_bulletcaptionitem.display());
        $('#welcome-colors-previous-item-cssrule').html(this.controls.welcomecolors_previousitem.display());        

        $('#welcome-colors-input-item-cssrule').html(this.controls.welcomecolors_inputitem.display());
        $('#welcome-colors-warner-item-cssrule').html(this.controls.welcomecolors_warneritem.display());

        // $('#welcome-colors-cta-next-item-cssrule').html(this.controls.welcomecolors_ctaitem_next.display());
        $('#welcome-colors-tooltip-item-cssrule').html(this.controls.welcomecolors_tooltip.display());

        $('#welcome-colors-selection-headers-item-cssrule').html(this.controls.welcomecolors_headersitem_selection.display());

        $('#welcome-colors-unselected-ruby-item-cssrule').html(this.controls.welcomecolors_rubyitem_unselected.display());

        $('#welcome-colors-selected-ruby-item-cssrule').html(this.controls.welcomecolors_rubyitem_selected.display());
        
        $('#welcome-colors-notes-item-cssrule').html(this.controls.welcomecolors_notes.display());

        $('#welcome-colors-slider-item-cssrule').html(this.controls.welcomecolors_sliderunder.display());
        $('#welcome-colors-slider-item2-cssrule').html(this.controls.welcomecolors_sliderabove.display());

        // $('#welcome-colors-endcta-item-cssrule').html(this.controls.welcomecolors_endcta.display());

        $('#welcome-colors-scroll-item-cssrule').html(this.controls.welcomecolors_scroll.display());
        $('#welcome-colors-scroll-item2-cssrule').html(this.controls.welcomecolors_scroll_2.display());

        $('#welcome-colors-footer-section-cssrule').html(this.controls.welcomecolors_footersection.display());
        $('#welcome-colors-footer-container-cssrule').html(this.controls.welcomecolors_footercontainer.display());
        $('#welcome-colors-footer-item-cssrule').html(this.controls.welcomecolors_footeritem.display());

        $('#welcome-texteffect-body-cssrule').html(this.controls.welcometexteffect_body.display());
        $('#welcome-texteffect-links-item-cssrule').html(this.controls.welcometexteffect_linksitem.display());
        $('#welcome-texteffect-h1-item-cssrule').html(this.controls.welcometexteffect_h1item.display());
        $('#welcome-texteffect-info-item-cssrule').html(this.controls.welcometexteffect_infoitem.display());
        $('#welcome-texteffect-info-linksitem-cssrule').html(this.controls.welcometexteffect_linksinfoitem.display());
        $('#welcome-texteffect-cta-item-cssrule').html(this.controls.welcometexteffect_ctaitem.display());
        $('#welcome-texteffect-directions-item-cssrule').html(this.controls.welcometexteffect_directionsitem.display());
        $('#welcome-texteffect-directions-linksitem-cssrule').html(this.controls.welcometexteffect_linksdirectionsitem.display());
        $('#welcome-texteffect-footer-item-cssrule').html(this.controls.welcometexteffect_footeritem.display());

        $('#welcome-opacity-body-cssrule').html(this.controls.welcomeopacity_body.display());

        $('#welcome-opacity-img-item-cssrule').html(this.controls.welcomeopacity_imgitem.display());

        $('#welcome-border-links-section-cssrule').html(this.controls.welcomeborder_linkssection.display());
        $('#welcome-border-links-container-cssrule').html(this.controls.welcomeborder_linkscontainer.display());
        $('#welcome-border-links-item-cssrule').html(this.controls.welcomeborder_linksitem.display());

        $('#welcome-border-h1-section-cssrule').html(this.controls.welcomeborder_h1section.display());
        $('#welcome-border-h1-container-cssrule').html(this.controls.welcomeborder_h1container.display());
        $('#welcome-border-h1-item-cssrule').html(this.controls.welcomeborder_h1item.display());

        $('#welcome-border-img-section-cssrule').html(this.controls.welcomeborder_imgsection.display());
        $('#welcome-border-img-container-cssrule').html(this.controls.welcomeborder_imgcontainer.display());
        $('#welcome-border-img-item-cssrule').html(this.controls.welcomeborder_imgitem.display());

        $('#welcome-border-info-section-cssrule').html(this.controls.welcomeborder_infosection.display());
        $('#welcome-border-info-container-cssrule').html(this.controls.welcomeborder_infocontainer.display());
        $('#welcome-border-info-item-cssrule').html(this.controls.welcomeborder_infoitem.display());

        $('#welcome-border-cta-section-cssrule').html(this.controls.welcomeborder_ctasection.display());
        $('#welcome-border-cta-container-cssrule').html(this.controls.welcomeborder_ctacontainer.display());
        $('#welcome-border-cta-item-cssrule').html(this.controls.welcomeborder_ctaitem.display());

        $('#welcome-border-directions-section-cssrule').html(this.controls.welcomeborder_directionssection.display());
        $('#welcome-border-directions-container-cssrule').html(this.controls.welcomeborder_directionscontainer.display());

        $('#welcome-border-bullet-item-cssrule').html(this.controls.welcomeborder_bulletitem.display());

        $('#welcome-border-input-item-cssrule').html(this.controls.welcomeborder_inputitem.display());

        // $('#welcome-border-cta-next-item-cssrule').html(this.controls.welcomeborder_ctanextitem.display());

        $('#welcome-border-notes-item-cssrule').html(this.controls.welcomeborder_notesitem.display());

        // $('#welcome-border-endcta-item-cssrule').html(this.controls.welcomeborder_ctaenditem.display());

        $('#welcome-border-selection-item-cssrule').html(this.controls.welcomeborder_selectionitem.display());

        $('#welcome-border-footer-section-cssrule').html(this.controls.welcomeborder_footersection.display());
        $('#welcome-border-footer-container-cssrule').html(this.controls.welcomeborder_footercontainer.display());

        $('#welcome-radius-links-section-cssrule').html(this.controls.welcomeradius_linkssection.display());
        $('#welcome-radius-links-container-cssrule').html(this.controls.welcomeradius_linkscontainer.display());
        $('#welcome-radius-links-item-cssrule').html(this.controls.welcomeradius_linksitem.display());

        $('#welcome-radius-h1-section-cssrule').html(this.controls.welcomeradius_h1section.display());
        $('#welcome-radius-h1-container-cssrule').html(this.controls.welcomeradius_h1container.display());
        $('#welcome-radius-h1-item-cssrule').html(this.controls.welcomeradius_h1item.display());

        $('#welcome-radius-img-section-cssrule').html(this.controls.welcomeradius_imgsection.display());
        $('#welcome-radius-img-container-cssrule').html(this.controls.welcomeradius_imgcontainer.display());
        $('#welcome-radius-img-item-cssrule').html(this.controls.welcomeradius_imgitem.display());

        $('#welcome-radius-info-section-cssrule').html(this.controls.welcomeradius_infosection.display());
        $('#welcome-radius-info-container-cssrule').html(this.controls.welcomeradius_infocontainer.display());
        $('#welcome-radius-info-item-cssrule').html(this.controls.welcomeradius_infoitem.display());

        $('#welcome-radius-cta-section-cssrule').html(this.controls.welcomeradius_ctasection.display());
        $('#welcome-radius-cta-container-cssrule').html(this.controls.welcomeradius_ctacontainer.display());
        $('#welcome-radius-cta-item-cssrule').html(this.controls.welcomeradius_ctaitem.display());

        $('#welcome-radius-directions-section-cssrule').html(this.controls.welcomeradius_directionssection.display());
        $('#welcome-radius-directions-container-cssrule').html(this.controls.welcomeradius_directionscontainer.display());

        $('#welcome-radius-bullet-item-cssrule').html(this.controls.welcomeradius_bulletitem.display());

        $('#welcome-radius-input-item-cssrule').html(this.controls.welcomeradius_inputitem.display());

        // $('#welcome-radius-cta-next-item-cssrule').html(this.controls.welcomeradius_ctanextitem.display());
        
        $('#welcome-radius-notes-item-cssrule').html(this.controls.welcomeradius_notesitem.display());

        // $('#welcome-radius-endcta-item-cssrule').html(this.controls.welcomeradius_endctaitem.display());

        $('#welcome-radius-selection-item-cssrule').html(this.controls.welcomeradius_selectionitem.display());
        
        $('#welcome-radius-footer-section-cssrule').html(this.controls.welcomeradius_footersection.display());
        $('#welcome-radius-footer-container-cssrule').html(this.controls.welcomeradius_footercontainer.display());

        $('#welcome-ctainteractivity-cta-item-cssrule').html(this.controls.welcomectainteractivity_ctaitem.display());

        // $('#welcome-ctainteractivity-ctanext-item-cssrule').html(this.controls.welcomectainteractivity_ctaitem_next.display());

        $('#welcome-ctainteractivity-selection-item-cssrule').html(this.controls.welcomectainteractivity_selectionitem.display());

        // $('#welcome-ctainteractivity-endcta-item-cssrule').html(this.controls.welcomectainteractivity_endctaitem.display());

        $('#welcome-spaces-links-section-cssrule').html(this.controls.welcomespaces_linkssection.display());
        $('#welcome-spaces-links-container-cssrule').html(this.controls.welcomespaces_linkscontainer.display());
        $('#welcome-spaces-links-item-cssrule').html(this.controls.welcomespaces_linksitem.display());

        $('#welcome-spaces-h1-section-cssrule').html(this.controls.welcomespaces_h1section.display());
        $('#welcome-spaces-h1-container-cssrule').html(this.controls.welcomespaces_h1container.display());

        $('#welcome-spaces-img-section-cssrule').html(this.controls.welcomespaces_imgsection.display());
        $('#welcome-spaces-img-container-cssrule').html(this.controls.welcomespaces_imgcontainer.display());
        $('#welcome-spaces-img-item-cssrule').html(this.controls.welcomespaces_imgitem.display());

        $('#welcome-spaces-info-section-cssrule').html(this.controls.welcomespaces_infosection.display());
        $('#welcome-spaces-info-container-cssrule').html(this.controls.welcomespaces_infocontainer.display());

        $('#welcome-spaces-cta-section-cssrule').html(this.controls.welcomespaces_ctasection.display());
        $('#welcome-spaces-cta-container-cssrule').html(this.controls.welcomespaces_ctacontainer.display());
        $('#welcome-spaces-cta-item-cssrule').html(this.controls.welcomespaces_ctaitem.display());

        $('#welcome-spaces-directions-section-cssrule').html(this.controls.welcomespaces_directionssection.display());
        $('#welcome-spaces-directions-container-cssrule').html(this.controls.welcomespaces_directionscontainer.display());

        $('#welcome-spaces-footer-section-cssrule').html(this.controls.welcomespaces_footersection.display());

        $('#welcome-freecss-additional-item-cssrule').html(this.controls.welcomefreecss.display());

        $('#copycssbtn_container').append(this.controls.copycssbtn.display());
    }

    activate() {
        this.controls.activate();
        this.palettes.activate();
    }

    
    //  Callbacks

    onviewport(choice) {
        $('#viewport-container').removeClass('viewport-iphone12_pro viewport-computer');
     switch(choice|0) {
         case 0: $('#viewport-container').addClass('viewport-computer'); $('#if_preview').removeClass('iframe_50pc iframe_70pc iframe_100pc'); $('#if_preview').addClass('iframe_70pc'); break;
         case 1: $('#viewport-container').addClass('viewport-iphone12_pro'); $('#if_preview').removeClass('iframe_50pc iframe_70pc iframe_100pc'); $('#if_preview').addClass('iframe_100pc'); break;
     }
    }

    onzoom(choice) {
        $('#if_preview').removeClass('iframe_50pc iframe_70pc iframe_100pc');
        switch(choice|0) {
            case 0: $('#if_preview').addClass('iframe_50pc'); break;
            case 1: $('#if_preview').addClass('iframe_70pc'); break;
            case 2: $('#if_preview').addClass('iframe_100pc'); break;
        }            
    }
    oncssrule(checked,content) {
        this.cssinventory();
    }
    onpalette(iPro) {
        switch (iPro.state.choice) {
            case 'pumpkin':
                console.log('pumpkin');
                this.selectedpalette = this.palettes.palette_pumpkin;
                break;
            case 'mothernature':
                console.log('mothernature');
                this.selectedpalette = this.palettes.palette_mothernature;
                break;
            case 'classyautomn':
                console.log('classyautomn');
                this.selectedpalette = this.palettes.palette_classyautomn;
                break;
            case 'classygold':
                console.log('classygold');
                this.selectedpalette = this.palettes.palette_classygold;
                break;
            case 'black':
                console.log('black');
                this.selectedpalette = this.palettes.palette_black;
                break;
            case 'medical':
                console.log('medical');
                this.selectedpalette = this.palettes.palette_medical;
                break;
            case 'pinky':
                console.log('pinky');
                this.selectedpalette = this.palettes.palette_pinky;
                break;

            case 'monoblues':
                console.log('monoblues');
                this.selectedpalette = this.palettes.palette_monoblues;
                break;

            case 'olive':
                console.log('olive');
                this.selectedpalette = this.palettes.palette_olive;
                break;

            default:
                console.log(iPro.state.choice+' not found');
        }

        let paletteedit = new C_iPaletteEdit ('preview',{},this.selectedpalette);
        $('#palette_cedit_h2').attr('style','display:block');
        $('#palette_cedit_container').html(paletteedit.display());
        //document.getElementById('palette_cedit_container').innerHTML = paletteedit.display(); 
        paletteedit.activate();

        console.log('Onpalette: ',this.selectedpalette);
        this.setrules();
        // this.selectedrules = rules;
        // this.setrules();
    }
    ontemplate(iPro) {

        let rules;
        switch (iPro.state.choice) {
            
            case 'stripinfo':
                console.log('stripinfo');
                rules = {
                welcomecolors_root:{v:'--c-base-body:!_bodytxtcolor_!; --bgc-base-body:!_bodybgcolor_!; --c-base-titles: !_titlestxtcolor_!;  --c-base-cta: !_ctatxtcolor_!; --bgc-base-cta: !_ctabgcolor_!;',c:true},
                
                welcomespaces_infocontainer:{v:'padding-top:25px; padding-bottom:25px; margin-bottom:30px;',c:true},
                welcomecolors_infosection:{v:'background-color:rgba(!_infobgcolor_!);',c:true},
                welcomecolors_infoitem:{v:'color:rgba(!_infotxtcolor_!);',c:true},

                // welcomecolors_h1item:{v:'color:rgba(var(--c-base-titles));',c:true},
                // welcomecolors_ctaitem:{v:'background-color:rgba(var(--bgc-base-cta),1); color:rgba(var(--c-base-cta));',c:true},
                // welcomectainteractivity_ctaitem:{v:'background-color:rgba(var(--bgc-base-cta),0.8); color:rgba(var(--c-base-cta));',c:true},
                // welcomecolors_body:{v:'background-color:rgba(var(--bgc-base-body),1); color:rgba(var(--c-base-body)); background-image: linear-gradient(rgba(var(--bgc-base-body),1),rgba(var(--bgc-base-body),1));',c:true},
                // welcomecolors_ctaitem_next:{v:'background-color:rgba(var(--bgc-base-cta),1); color:rgba(var(--c-base-cta));',c:true},
                // welcomectainteractivity_ctaitem_next:{v:'background-color:rgba(var(--bgc-base-cta),0.8); color:rgba(var(--c-base-cta));',c:true},
                // welcomecolors_rubyitem_selected:{v:'background-color:rgba(var(--bgc-base-cta),1);',c:true},
                // welcomectainteractivity_selectionitem:{v:'background-color:rgba(var(--bgc-base-cta),0.4);',c:true},
                // welcomecolors_scroll:{v:'background-color:rgba(var(--bgc-base-cta),0.6);',c:true},
                // welcomecolors_scroll_2:{v:'scrollbar-color:rgba(var(--bgc-base-cta),0.6) transparent;',c:true}        

                };
                

                break;
            case 'boxyinfo':
                console.log('boxyinfo');
                rules = {
                welcomecolors_root:{v:'--c-base-body:!_bodytxtcolor_!; --bgc-base-body:!_bodybgcolor_!; --c-base-titles: !_titlestxtcolor_!;  --c-base-cta: !_ctatxtcolor_!; --bgc-base-cta: !_ctabgcolor_!;',c:true},
                
                welcomespaces_infocontainer:{v:'padding-top:25px; padding-bottom:25px; margin-bottom:30px;',c:true},
                welcomeradius_infocontainer:{v:'border-radius:20px;',c:true},
                welcomecolors_infocontainer:{v:'background-color:rgba(!_infobgcolor_!);',c:true},
                welcomecolors_infoitem:{v:'color:rgba(!_infotxtcolor_!);',c:true},

                // welcomecolors_h1item:{v:'color:rgba(var(--c-base-titles));',c:true},
                // welcomecolors_ctaitem:{v:'background-color:rgba(var(--bgc-base-cta),1); color:rgba(var(--c-base-cta));',c:true},
                // welcomectainteractivity_ctaitem:{v:'background-color:rgba(var(--bgc-base-cta),0.8); color:rgba(var(--c-base-cta));',c:true},
                // welcomecolors_body:{v:'background-color:rgba(var(--bgc-base-body),1); color:rgba(var(--c-base-body)); background-image: linear-gradient(rgba(var(--bgc-base-body),1),rgba(var(--bgc-base-body),1));',c:true},
                // welcomecolors_ctaitem_next:{v:'background-color:rgba(var(--bgc-base-cta),1); color:rgba(var(--c-base-cta));',c:true},
                // welcomectainteractivity_ctaitem_next:{v:'background-color:rgba(var(--bgc-base-cta),0.8); color:rgba(var(--c-base-cta));',c:true},
                // welcomecolors_rubyitem_selected:{v:'background-color:rgba(var(--bgc-base-cta),1);',c:true},
                // welcomectainteractivity_selectionitem:{v:'background-color:rgba(var(--bgc-base-cta),0.4);',c:true},
                // welcomecolors_scroll:{v:'background-color:rgba(var(--bgc-base-cta),0.6);',c:true},
                // welcomecolors_scroll_2:{v:'scrollbar-color:rgba(var(--bgc-base-cta),0.6) transparent;',c:true}
        
                };
                break;
            // case 'framedinfo':
            //     console.log('framedinfo');
            //     rules = {
            //     welcomecolors_root:{v:'--c-base-2:!_ctabgcolor_!;',c:true},
            //     welcomecolors_body:{v:'background-color:!_bodybgcolor_!; color:!_bodytxtcolor_!; background-image: linear-gradient(!_bodybgcolor_!,!_bodybgcolor_!);',c:true},
            //     welcomecolors_h1section:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_h1item:{v:'color:!_infotxtcolor_!;',c:true},
            //     welcomespaces_h1container:{v:'padding-top:30px; margin-top:20px;',c:true},
            //     welcomecolors_ctaitem:{v:'background-color:!_ctabgcolor_!; color:!_ctatxtcolor_!;',c:true},
            //     welcomecolors_ctaitem_next:{v:'background-color:!_ctabgcolor_!; color:!_ctatxtcolor_!;',c:true},
            //     welcomecolors_rubyitem_selected:{v:'background-color:!_ctabgcolor_!;',c:true},
            //     welcomecolors_imgsection:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomespaces_imgcontainer:{v:'margin-bottom:20px;',c:true},
            //     welcomectainteractivity_selectionitem:{v:'background-color:!_hoveredbgselection_!;',c:true},
            //     welcomecolors_scroll:{v:'background-color:!_scrollbgcolor_!;',c:true},
            //     welcomecolors_scroll_2:{v:'scrollbar-color:!_scrollbgcolor_! transparent;',c:true}
            //     };
            //     break;
            // case 'fullcolor':
            //     console.log('fullcolor');
            //     rules = {
            //     welcomecolors_root:{v:'--c-base-2:!_ctabgcolor_!;',c:true},
            //     welcomecolors_body:{v:'background-color:!_bodybgcolor_!; color:!_bodytxtcolor_!; background-image: linear-gradient(!_bodybgcolor_!,!_bodybgcolor_!);',c:true},
            //     welcomecolors_h1section:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_h1item:{v:'color:!_infotxtcolor_!;',c:true},
            //     welcomespaces_h1container:{v:'padding-top:30px; margin-top:20px;',c:true},
            //     welcomecolors_imgsection:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_infosection:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_infoitem:{v:'color:!_infotxtcolor_!;',c:true},
            //     welcomecolors_ctasection:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomespaces_ctacontainer:{v:'padding-bottom:50px; margin-bottom:20px;',c:true},
            //     welcomecolors_ctaitem:{v:'background-color:!_ctabgcolor_!; color:!_ctatxtcolor_!;',c:true},
            //     welcomecolors_ctaitem_next:{v:'background-color:!_ctabgcolor_!; color:!_ctatxtcolor_!;',c:true},
            //     welcomecolors_rubyitem_selected:{v:'background-color:!_ctabgcolor_!;',c:true},
            //     welcomectainteractivity_selectionitem:{v:'background-color:!_hoveredbgselection_!;',c:true},
            //     welcomecolors_scroll:{v:'background-color:!_scrollbgcolor_!;',c:true},
            //     welcomecolors_scroll_2:{v:'scrollbar-color:!_scrollbgcolor_! transparent;',c:true}
            //     };
            //     break;
            case 'striplogo':
                console.log('striplogo');
                rules = {
                welcomecolors_root:{v:'--c-base-body:!_bodytxtcolor_!; --bgc-base-body:!_bodybgcolor_!; --c-base-titles: !_titlestxtcolor_!;  --c-base-cta: !_ctatxtcolor_!; --bgc-base-cta: !_ctabgcolor_!;',c:true},
                
                welcomecolors_imgsection:{v:'background-color:rgba(!_infobgcolor_!);',c:true},
                welcomespaces_imgcontainer:{v:'margin-top:15px; margin-bottom:15px;',c:true},

                // welcomecolors_h1item:{v:'color:rgba(var(--c-base-titles));',c:true},
                // welcomecolors_ctaitem:{v:'background-color:rgba(var(--bgc-base-cta),1); color:rgba(var(--c-base-cta));',c:true},
                // welcomectainteractivity_ctaitem:{v:'background-color:rgba(var(--bgc-base-cta),0.8); color:rgba(var(--c-base-cta));',c:true},
                // welcomecolors_body:{v:'background-color:rgba(var(--bgc-base-body),1); color:rgba(var(--c-base-body)); background-image: linear-gradient(rgba(var(--bgc-base-body),1),rgba(var(--bgc-base-body),1));',c:true},
                // welcomecolors_ctaitem_next:{v:'background-color:rgba(var(--bgc-base-cta),1); color:rgba(var(--c-base-cta));',c:true},
                // welcomectainteractivity_ctaitem_next:{v:'background-color:rgba(var(--bgc-base-cta),0.8); color:rgba(var(--c-base-cta));',c:true},
                // welcomecolors_rubyitem_selected:{v:'background-color:rgba(var(--bgc-base-cta),1);',c:true},
                // welcomectainteractivity_selectionitem:{v:'background-color:rgba(var(--bgc-base-cta),0.4);',c:true},
                // welcomecolors_scroll:{v:'background-color:rgba(var(--bgc-base-cta),0.6);',c:true},
                // welcomecolors_scroll_2:{v:'scrollbar-color:rgba(var(--bgc-base-cta),0.6) transparent;',c:true}
        
                };
                break;
            // case 'fullimg':
            //     console.log('fullimg');
            //     rules = {
            //     welcomecolors_root:{v:'--c-base-2:!_ctabgcolor_!;',c:true},
            //     welcomecolors_body:{v:'background-color:!_bodybgcolor_!; color:!_bodytxtcolor_!; background-image: linear-gradient(!_bodybgcolor_!,!_bodybgcolor_!);',c:true},
            //     welcomecolors_h1container:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_h1item:{v:'color:!_infotxtcolor_!;',c:true},
            //     welcomespaces_h1container:{v:'padding-top:30px; margin-top:20px;',c:true},
            //     welcomeradius_h1container:{v:'border-radius:20px 20px 0px 0px;',c:true},
            //     welcomecolors_imgcontainer:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_infocontainer:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomecolors_infoitem:{v:'color:!_infotxtcolor_!;',c:true},
            //     welcomecolors_ctacontainer:{v:'background-color:!_infobgcolor_!;',c:true},
            //     welcomespaces_ctacontainer:{v:'padding-bottom:50px; margin-bottom:20px;',c:true},
            //     welcomeradius_ctacontainer:{v:'border-radius:0px 0px 20px 20px;',c:true},
            //     welcomecolors_ctaitem:{v:'background-color:!_ctabgcolor_!; color:!_ctatxtcolor_!;',c:true},
            //     welcomecolors_ctaitem_next:{v:'background-color:!_ctabgcolor_!; color:!_ctatxtcolor_!;',c:true},
            //     welcomecolors_rubyitem_selected:{v:'background-color:!_ctabgcolor_!;',c:true},
            //     welcomectainteractivity_selectionitem:{v:'background-color:!_hoveredbgselection_!;',c:true},
            //     welcomecolors_scroll:{v:'background-color:!_scrollbgcolor_!;',c:true},
            //     welcomecolors_scroll_2:{v:'scrollbar-color:!_scrollbgcolor_! transparent;',c:true}
            //     };
            //     break;
            default:
                console.log(iPro.state.choice+' not found');
      }
      this.selectedrules = rules;
      this.setrules();
    }
    
    oncopycss() { 
        // Get the text field
        let copyText = this.inventory_imploded;
        if(navigator.clipboard) {

            navigator.clipboard.writeText(copyText).then( function() {
                // console.log('Async: Copying to clipboard was successful!');
            }, function(err) {
                // console.error('Async: Could not copy text: ', err);
            });
			
		}


    }

    // private

    clearallrules() {
        for(let ctlname in this.controls.get) {
            let ctl = this.controls.get[ctlname];
            if(ctl instanceof C_eCSSedit) { /*console.log('going to clean field on '+ctlname);*/ ctl.clear(); }
        }
    }


    uncheckallrules() {
        for(let ctlname in this.controls.get) {
            /*console.log('going to uncheck on '+ctlname);*/
            let check = false;
            let ctl = this.controls.get[ctlname];
            if(ctl.check) ctl.check(check);
        }
    }

    setrules() { // rules is like { controlname:{v:'a css rule',c:boolean true if checked}, controlname2:{v:'...',c:true} }
        this.clearallrules();
        this.uncheckallrules();
        let rules = this.selectedrules;
        for(let ctl in rules) {
            console.log('going to edit on '+ctl);
            let pack = rules[ctl];
            let rule = this.applypalette(pack.v);
            let check = pack.c;
            this.controls.get[ctl].set(rule).check(check);

            /*console.log('- >rule will be '+rule+' ans checked is '+(check?'yes':'no'));*/
        }
        console.log('setrules: ',this.selectedrules);


        this.cssinventory();

    }

	cssinventory() {
		let inventory_array = [];


        for(let ctlname in this.controls.get) {
            let ctl = this.controls.get[ctlname];
            if(ctl instanceof C_eCSSedit) { 
                // console.log('_____________________');
                // console.log(ctl.state.targetelement);
                // console.log(ctl.controls.field.value());
                // console.log(ctl.state.h5);
                // console.log(ctl.state.checked);
            let ischecked = ctl.state.checked ;
            let targetelement = ctl.state.targetelement;
            let cssinfield = ctl.controls.field.value();
            // let containsvar = ctl.controls.field.value().includes('var'); // Is used to remove all css instructions that contains var in css Summary
            let h5 = ctl.state.h5;
                if(ischecked) {
                    if(targetelement=='') inventory_array.push(cssinfield+' /*'+h5+'*/ '); // Exception for Free CSS that is not an instruction applied to any element
                    else inventory_array.push(targetelement+' {'+cssinfield+'} /*'+h5+'*/ ');
               
                }


                // if(ischecked&&!containsvar) inventory_array.push(targetelement+' {'+cssinfield+'} /*'+h5+'*/ ');
        }
        }

		
		this.inventory_imploded = inventory_array.join('\r\n');
		let inventory_imploded_into_p = '<p>'+inventory_array.join('</p><p>')+'</p>'; /* Used to have carriage return in css-summary div JBO-cr  */
        
		//$('#custom_css').html(inventory_imploded);

		let iframe = document.getElementById('if_preview');
		let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		$('#custom_css', innerDoc).html(this.inventory_imploded); /* add all selected css rules into the html <style> of the iframe (eresa-welcome.php) */
		if (this.inventory_imploded=='') $('#css-summary').html('<span>There is no custom CSS selected</span>'); /* Need to be there when selection and */ 
		else $('#css-summary').html(inventory_imploded_into_p);
	}

    applypalette(rule) {
        let infobgcolor = this.selectedpalette.infobgcolor;
        let infotxtcolor = this.selectedpalette.infotxtcolor;
        let ctabgcolor = this.selectedpalette.ctabgcolor;
        let ctatxtcolor = this.selectedpalette.ctatxtcolor;
        let bodybgcolor = this.selectedpalette.bodybgcolor;
        let bodytxtcolor = this.selectedpalette.bodytxtcolor;
        let titlestxtcolor = this.selectedpalette.titlestxtcolor;
        

        rule = rule.replace(/!_infobgcolor_!/g, infobgcolor);
        rule = rule.replace(/!_infotxtcolor_!/g, infotxtcolor);
        rule = rule.replace(/!_ctabgcolor_!/g, ctabgcolor);
        rule = rule.replace(/!_ctatxtcolor_!/g, ctatxtcolor);
        rule = rule.replace(/!_bodybgcolor_!/g, bodybgcolor);
        rule = rule.replace(/!_bodytxtcolor_!/g, bodytxtcolor);
        rule = rule.replace(/!_titlestxtcolor_!/g, titlestxtcolor);

        return rule;
    }


}
