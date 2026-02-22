function C_iDownloadPdf(eid, preset) {

    this.eids = { eid:eid, download:eid+"_download" };
    this.elements = new A_el();

    this.state = C_iDownloadPdf.defauts.align(preset = preset || {});

    this.state.xl = preset.ixl=='on'?true:false; // ixl arrives from $ixl in moblib.php, values are { 'on', 'off' }, we convert it into a boolean for usage in js
    
            let ixltag = this.state.xl?' > xl':'';
        let caption = this.state.target.find('#caption-download'+ixltag).html(); //   takes the button caption from an element having ixl class and display:none otherwise
    let download = new C_iCLIK(this.eids.download, { click:new A_cb(this, this.ondownload) } , { tag:'div', ui:'<i class="mob-txt-lime fad fa-file-download fa-1d5x"></i><span class="centered">'+caption+'</span>', enabled:true } );

    this.controls = new A_ct({ download:download });
}

C_iDownloadPdf.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
C_iDownloadPdf.prototype = {
	display: function(e) { let download = this.controls.download.display('cta_2 mob-txt-gray_d touch-in'); this.state.target.find('#'+this.eids.eid).html(download); },
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
        if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	// Callback function when contractant clicks on the download button
    ondownload: function(){
        if(this.state.busy) return;
		this.state.busy = true;
			let ixltag = this.state.xl?' > xl':'';
		let caption = this.state.target.find('#caption-download-progress'+ixltag).html();
        this.controls.download.enable(false);
        this.controls.download.set('<i class="mob-txt-lime fas fa-spinner fa-spin fa-1d5x"></i><span class="centered">'+caption+'</span>');
        
        location.href = './mail_thanks.php?pdf=1';

        let that = this;
        let t = setTimeout(function() { that.downloaded() }, 3500);
    }, 

    downloaded: function() { 
		this.state.busy = false;
			let ixltag = this.state.xl?' > xl':'';
        this.controls.download.enable(true);
		let caption = this.state.target.find('#caption-downloaded'+ixltag).html();
        this.controls.download.set('<i class="mob-txt-lime fad fa-file-download fa-1d5x"></i><span class="centered">'+caption+'</span>');
	},

    failed: function() { 
		this.state.busy = false;
		console.log('FAILED');
	}
}