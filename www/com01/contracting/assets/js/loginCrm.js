//Class to show the input field in the login tab
function C_iLogin(eid, preset) {

	this.eids = { username:eid+'_username', password:eid+"_password", login:eid+"_login" };
	this.elements = new A_el();

	this.state = C_iLogin.defauts.align(preset = preset || {});

    let username = new C_iEDIT(this.eids.username, {  }, { digits:'', placeholder:'Username', type:INPUT_TEXT, enabled:true, max:32 });
	let password = new C_iEDIT(this.eids.password, {  }, { digits:'', placeholder:'Password', type:INPUT_PASSWD, enabled:true, max:32 });

    let login = new C_iCLIK(this.eids.login, { click:new A_cb(this, this.controlLogin) } , { tag:'div', ui:'<i class="fad fa-sign-in fa-1d5x"></i><span>Login</span>', enabled:true } );
 
	this.controls = new A_ct({ username:username, password:password, login:login});
}
C_iLogin.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
C_iLogin.prototype = {
	display: function(e) {
			let username = this.controls.username.display('wide'); this.state.target.find('#un').html(username);
			let password = this.controls.password.display('wide'); this.state.target.find('#pw').html(password);

            let login = this.controls.login.display('cta_2 mob-txt-gray_d touch-in');
			this.state.target.find("#container-login-btn").html(login);
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	// Callback function that is called when user clicks on the login button
	controlLogin: function(){
		if(this.state.busy) return;
		this.state.busy = true;
		this.controls.login.enable(false);
		this.controls.login.set('<i class="fas fa-spinner fa-spin fa-1d5x"></i><span>Connection</span>');
		let names = { username:'username', password:'password' };
		let post = new A_ps(this.controls, names, './assets/php/query/loginQuery.php', { onreply:new A_cb(this,this.redirect, "cool", false, 100), ontimeout:new A_cb(this,this.failed) }, {/*options*/});

		// The code line below is used to update the field in the database
		// var post = new A_ps(this.controls, names, './post/updateAccountManagerNameToId.php', { onreply:new A_cb(this,this.redirect, "cool", false, 1000), ontimeout:new A_cb(this,this.failed) }, {/*options*/});
	},
	// When person tried to login this function is called
    redirect: function(par, stream){
		console.log("logins are correctly send " + par + stream);
		let result = stream.excise('!#','#!');
		console.log(result.match);
		// If user gives right credentials he can go through to the home page, else the page reloads
		
		if (result.match == '!#0#!') {
			window.location.href = "./index.php";
			this.controls.login.enable(true);
		}else{
			window.location.href = "./langless/welcome.php";
			this.controls.login.enable(true);
		}
    },
	// Function called if an error occured with the login 
	failed: function(){
		console.log("An error occured");
        window.location.href = "./index.php";
	}
}


//Class to show the input field in the login tab
function C_iLogOut(eid, preset) {

	this.eids = { logout:eid+"_logout" };
	this.elements = new A_el();

	this.state = C_iLogOut.defauts.align(preset = preset || {});

    let logout = new C_iCLIK(this.eids.logout, { click:new A_cb(this, this.logOut) } , { tag:'div', ui:'<span class="hidden-txt mob-txt-gray_m">LOGOUT </span><i class="fad fa-sign-out mob-txt-lime fa-1d5x"></i>', enabled:true } );
	
	this.controls = new A_ct({ logout:logout});
}
C_iLogOut.defauts = new A_df( { rows:4, target:false, busy:false, xl:false } );
C_iLogOut.prototype = {
	display: function(e) {
		let logout = this.controls.logout.display('button');
		this.state.target.find("#logoutBtn").html(logout);
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show(); } );
	},
	// Callback function that is called when user clicks on the login button
	logOut: function(){
		let logOut = new C_iPASS('logout');
        post = new A_ps({ logOut: logOut }, { logOut: 'logOut' }, '../assets/php/query/logout.php', { onreply:new A_cb(this,this.redirect, 100), ontimeout:new A_cb(this,this.failed) }, {/*options*/ });
	},
	// When person tried to login this function is called
    redirect: function(){
		window.location.href = "../index.php";
    },
	// Function called if an error occured with the login 
	failed: function(){
		console.log("An error occured");
	}
}
