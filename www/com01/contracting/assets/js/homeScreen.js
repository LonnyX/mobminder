//Class to show the 3 different buttons on the home page of the CRM
function C_iHomeScreen(eid, preset) {
	this.eids = { leadTableBtn:eid+'_leadTableBtn',customerTableBtn:eid+'_customerTableBtn',add:eid+'_dashboardBtn'};
	this.elements = new A_el();

	this.state = C_iHomeScreen.defauts.align(preset = preset || {});
	
    let leadTableBtn = new C_iCLIK(this.eids.leadTableBtn, { click:new A_cb(this, this.goToLeadsTable) } , { tag:'div', ui:'<img class="first" src="../assets/imgs/leads.jpg" alt=""><i class="fad fa-user-plus fa-1d5x mob-txt-lime"></i><h3 class="mob-txt-blue">Go to leads table</h3</div>', enabled:true } );
    let customerTableBtn = new C_iCLIK(this.eids.customerTableBtn, { click:new A_cb(this, this.goToCustomerTable) } , { tag:'div', ui:'<img class="second"  src="../assets/imgs/customers.jpg" alt=""><i class="fad fa-user-check fa-1d5x mob-txt-lime"></i><h3 class="mob-txt-blue">Go to customers table</h3>', enabled:true } );
    let dashboardBtn = new C_iCLIK(this.eids.dashboardBtn, { click:new A_cb(this, this.goDashboard) } , { tag:'div', ui:'<img class="third"  src="../assets/imgs/stats.jpg" alt=""><i class="fad fa-user-chart fa-1d5x mob-txt-lime"></i><h3 class="mob-txt-blue">Go to dashboard</h3>', enabled:true } );

	this.controls = new A_ct({ leadTableBtn:leadTableBtn, customerTableBtn:customerTableBtn, dashboardBtn:dashboardBtn});
}
C_iHomeScreen.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
C_iHomeScreen.prototype = {
	display: function(e) {
        let leadTableBtn = this.controls.leadTableBtn.display("single-service zoom first");
        this.state.target.find("#leadTableBtnContainer").html(leadTableBtn);

        let customerTableBtn = this.controls.customerTableBtn.display("single-service zoom second");
        this.state.target.find("#customerTableBtnContainer").html(customerTableBtn);

        let dashboardBtn = this.controls.dashboardBtn.display("single-service zoom third");
        this.state.target.find("#dashboardBtnContainer").html(dashboardBtn);
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show();} );
	},
    // Callback function to go to the lead table page
	goToLeadsTable: function(e){
		window.location.href = './leads.php';
	},
    // Callback function to go to the customer table page
    goToCustomerTable: function(e){
        window.location.href = './customers.php';    
    },
    // Callback function to go to the dashboard page
    goDashboard: function(e){
        window.location.href = './dashboard.php';
    }
}