let barchart;
let pieChartLeads;
let pieChartCustomers;

//Class to show the dropdown depending on who's connected (accesslevel)
function C_iStatistics(eid, preset) {

	this.eids = { accountm:eid+'_accountm',year:eid+'_year'};
	this.elements = new A_el();

	let accountm;

	this.state = C_iStatistics.defauts.align(preset = preset || {});

	let accessLevel = this.state.logged;

	let ddvalue = 0;
	let enabled = false;

	if (accessLevel == 1 || accessLevel == 2) {
		enabled = true;
	}
	else{
		enabled = false;
		ddvalue = accessLevel;
	}

	let today = new Date(Date.now());

	let years = {}
	let i = 1;

	for (let index = 2021; index <= today.getFullYear(); index++) {
		years[i] = index;
		i++;
	}

	accountm = new C_iDDWN(this.eids.accountm, {onselect:new A_cb(this, this.changeStats)}, {labels:{0:'All', 3:'Florian', 4:'Giraud', 5:'Keevin', 6:'Kamal', 7:'Kristof'}}, {value:ddvalue, mode:1, title:'Account Manager', enabled:enabled } );
	let year = new C_iDDWN(this.eids.year, {onselect:new A_cb(this, this.changeStats)}, {labels:years}, {value:3, mode:1, title:'Year' } );

	this.controls = new A_ct({ accountm:accountm, year:year});

	let loggedPerson = new C_iPASS(this.state.logged);
    post = new A_ps({ loggedPerson: loggedPerson }, { loggedPerson: 'loggedPerson' }, '../assets/php/query/chargeStatistics.php', { onreply: new A_cb(this, this.chargeStats), ontimeout: new A_cb(this, this.failed) }, {/*options*/ });
}
C_iStatistics.defauts = new A_df( { rows:4, target:false, busy:false, xl:false,logged:false } );
C_iStatistics.prototype = {
	display: function(e) {
		let accountm = this.controls.accountm.display('dropdownDashboard'); this.state.target.find('#accountmSelect').html(accountm);
		let year = this.controls.year.display('dropdownDashboard'); this.state.target.find('#yearSelection').html(year);

	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		if(this.state.xl) this.state.target.find('h3.ixl').each( function() { $(this).show();} );
	},
	// Show the statistics depending on the selected person in the dropdown of the dashboard
	chargeStats: function(stream){
		// Get all the divs to implement the diagrams
		const barchartDiagram = document.getElementById('barchartDiagram');
		const pieChartLeadsDiv = document.getElementById('pieChartLeads');
		const pieChartCustomersDiv = document.getElementById('pieChartCustomers');
		
		// Color definition in variable
		const mob_gray_d = 'rgba(10,30,15,0.6)';

		// Variables to put in the keyfigures and calculate the turnover,basket,...
		let receivedLeads = 0;
		let convertedLeads = 0;
		let lostleads = 0;
		let lostCustomers = 0;
		let turnover = 0;
		let nrBusinessDiaries = 0;

		let selectedYear = document.getElementById("yearSelection").firstChild.value;

		// Barchart arrays to show for each month how many leads,customers,... there are
		let arrayYearLeads = [0,0,0,0,0,0,0,0,0,0,0,0];
		let arrayYearCustomers = [0,0,0,0,0,0,0,0,0,0,0,0];
		let arrayYearLostLeads = [0,0,0,0,0,0,0,0,0,0,0,0];
		let arrayYearLostCustomers = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		let data = stream.extract('<leads>', '</leads>').match;
        let datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

		for (let id in datasets['C_dS_lead']) {
			let dS = datasets['C_dS_lead'][id];
			let creationDate = new Date(dS.created);

			switch (dS.status) {
				case 1:
					if (creationDate.getFullYear() == selectedYear) {
						// console.log(creationDate.getFullYear() + ' - ' + creationDate.getMonth());
						arrayYearLeads[creationDate.getMonth()] = arrayYearLeads[creationDate.getMonth()] + 1;
						receivedLeads += 1;
					}
					break;
				case 2:
					if (creationDate.getFullYear() == selectedYear) {
						arrayYearLeads[creationDate.getMonth()] = arrayYearLeads[creationDate.getMonth()] + 1;
						arrayYearCustomers[creationDate.getMonth()] = arrayYearCustomers[creationDate.getMonth()] + 1;
						receivedLeads += 1;
						convertedLeads += 1;
					}
					break;
				case 3:
					if (creationDate.getFullYear() == selectedYear) {
						arrayYearLeads[creationDate.getMonth()] = arrayYearLeads[creationDate.getMonth()] + 1;
						arrayYearLostLeads[creationDate.getMonth()] = arrayYearLostLeads[creationDate.getMonth()] + 1;
						receivedLeads += 1;
						lostleads += 1;
					}
					break;
				case 4:
					if (creationDate.getFullYear() == selectedYear) {
						arrayYearLeads[creationDate.getMonth()] = arrayYearLeads[creationDate.getMonth()] + 1;
						arrayYearLostCustomers[creationDate.getMonth()] = arrayYearLostCustomers[creationDate.getMonth()] + 1;
						receivedLeads += 1;
						lostCustomers += 1;
					}
					break;
				default:
					break;
			}
		}

		// Put the total converted leads in the keyfigure
		$('#dashboardSection').find('#convertedLeadsKeyFigureValue').html(convertedLeads);

		// Calculate the conversion rate of the year
		let rate = convertedLeads/receivedLeads*100;
		$('#dashboardSection').find('#conversionRate').html(Math.round(rate)+' %');

		let totalLead = receivedLeads + convertedLeads + lostleads + lostCustomers;

		// Put the total leads in the keyfigure
		$('#dashboardSection').find('#receivedLeadsKeyFigureValue').html(totalLead);

		// Shows generated turnover based on when the contract was signed
		data = stream.extract('<customers>', '</customers>').match;
        datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

		for (let id in datasets['C_dS_customer']) {
			let dS = datasets['C_dS_customer'][id];
			let creationDate = new Date(dS.dateSigned);

			if (creationDate.getFullYear() == selectedYear) {
				turnover += Number(dS.monthlyPackage);
				nrBusinessDiaries += Number(dS.numberBusinessDiaries);
			}
		}
		// Put the turnover in the keyfigure
		$('#dashboardSection').find('#generatedTurnoverKeyFigureValue').html(turnover + ' €');

		// Calculates the average customer basket and puts it in the keyfigure
		let averageBasket = turnover/convertedLeads;
		$('#dashboardSection').find('#averageBasketKeyFigureValue').html(Math.round(averageBasket)+' €');

		// Calculate average basket / line
		let averageBasketLine = turnover/nrBusinessDiaries;
		$('#dashboardSection').find('#averageBasketPerLineKeyFigureValue').html(Math.round(averageBasketLine)+' €');
		
		/*
		CHART DEFINITION
		*/

		//Variable to insert in the footer
		const conversionR = (tooltipItems) => {
			let month;
			turnover = 0;
			let nrOfLeads = tooltipItems[0].parsed.y;

			let nrOfCustomers = tooltipItems[1].parsed.y;

			let total = Math.round((nrOfCustomers/nrOfLeads)*100);

			for (let index = 0; index < tooltipItems.length; index++) {
				// console.log(tooltipItems[index]['label']);
				switch (tooltipItems[index]['label']) {
					case 'January':
						month = 0;
						break;
					case 'February':
						month = 1;
						break;
					case 'March':
						month = 2;
						break;
					case 'April':
						month = 3;
						break;
					case 'May':
						month = 4;
						break;
					case 'June':
						month = 5;
						break;
					case 'July':
						month = 6;
						break;
					case 'August':
						month = 7;
						break;
					case 'September':
						month = 8;
						break;
					case 'October':
						month = 9;
						break;
					case 'November':
						month = 10;
						break;
					case 'December':
						month = 11;
						break;
					default:
						break;
				}
			}

			data = stream.extract('<customers>', '</customers>').match;
			datasets = false;
			if (data) datasets = C_inlineStreaming.createDataSets(data);

			for (let id in datasets['C_dS_customer']) {
				let dS = datasets['C_dS_customer'][id];
				let creationDate = new Date(dS.dateSigned);

				if (creationDate.getFullYear() == selectedYear && creationDate.getMonth() == month) {
					turnover += Number(dS.monthlyPackage);
					averageBasket = Math.round(turnover/nrOfCustomers);
				}
			}

			// averageBasket == Infinity ? averageBasket = 'N/A' : averageBasket = averageBasket;

			let tooltip = `Conversion rate: ${total}% - Turnover: ${turnover}€ - Av. basket: ${averageBasket}€`

			return tooltip;
		}

		//Create bar chart with the arrays from above as data
		barchart = new Chart(barchartDiagram, {
		type: 'bar',
		data: {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			datasets: [{
				label: '# of Leads',
				data: arrayYearLeads,
				backgroundColor: ['rgba(133,165,191,0.5)'],
				hoverBackgroundColor: ['rgba(133, 165, 191,0.8)'],
				borderWidth: 1
			},{
				label: '# of Customers',
				data: arrayYearCustomers,
				backgroundColor: ['rgba(195,217,73,0.5)'],
				hoverBackgroundColor: ['rgba(195,217,73,0.8)'],
				borderWidth: 1
			},{
				label: '# of Lost Customers',
				data: arrayYearLostLeads,
				hoverBackgroundColor: ['rgba(217,75,73,0.8)'],
				backgroundColor: ['rgba(217,75,73,0.5)'],
				borderWidth: 1
			},{
				label: '# of Lost Leads',
				data: arrayYearLostCustomers,
				hoverBackgroundColor: ['rgba(217,147,73,0.8)'],
				backgroundColor: ['rgba(217,147,73,0.5)'],
				borderWidth: 1
			}]
		},
		options: {
			height: '600px',
			width: '60em',
			elements:{
				bar:{
					borderRadius:6
				}
			},
			interaction: {
				intersect: false,
				mode: 'index',
			},
			plugins:{
				tooltip: {
					callbacks: {
						footer: conversionR
					},
					backgroundColor:['rgba(255, 243, 194, 0.9)'],
					bodyColor:[mob_gray_d],
					titleColor:[mob_gray_d],
					footerColor:[mob_gray_d],
					bodyFont:{
						size:16
					},
					footerFont:{
						size:16
					},
					titleFont:{
						size:16
					},
					padding:8,
					position:'nearest',
					yAlign:'bottom'
				},
				legend:{
					labels:{
						/* 
						for rounded labels in charts: 
							https://www.chartjs.org/docs/latest/configuration/elements.html#point-styles
						Tutorial:
							https://www.youtube.com/watch?v=teXl-mX3Ugo
						*/
						usePointStyle:true,
						pointStyle: 'rectRounded',
						pointStyleWidth: 70,
						font:{
							size:16
						},
						color: mob_gray_d
					}
				}
			},
			scales: {
				x:{
					ticks:{
						font:{
							size:16
						},
						color: mob_gray_d
					}
				},
				y: {
					beginAtZero: true,
					ticks:{
						font:{
							size:16
						},
						color: mob_gray_d
					}
				}
			}
		}
		});

		// Fetch to see the leads
		data = stream.extract('<sectorLeads>', '</sectorLeads>').match;
        datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);

		// Arrays for each sector
		let arrayMedical = [];
		let arrayFreelance = [];
		let arrayMedicalGroup = [];
		let arrayDentist = [];
		let arrayIndustry = [];
		let arrayWellness = [];
		let arrayNDF = [];

		// Control for each lead to see in which sector they are active
		for (let id in datasets['C_dS_lead']) {
            let dS = datasets['C_dS_lead'][id];
			let creationDate = new Date(dS.created);
			if (creationDate.getFullYear() == selectedYear) {
				switch (dS.sector) {
				
					case 1:
						arrayMedical.push(dS.id);
						break;
					case 2:
						arrayFreelance.push(dS.id);
						break;
					case 3:
						arrayMedicalGroup.push(dS.id);
						break;
					case 4:
						arrayDentist.push(dS.id);
						break;
					case 5:
						arrayIndustry.push(dS.id);
						break;
					case 6:
						arrayWellness.push(dS.id);
						break;
					case 999:
						arrayNDF.push(dS.id);
						break;
				
					default:
						break;
				}
			}
        }

		// Create pie chart with the arrays from above as data for the sectors
		pieChartLeads = new Chart(pieChartLeadsDiv, {
			type: 'pie',
			data: {
				labels: ['Medical','Liberal','Medical group','Dentist','Industry','Wellness','Undefined'],                
				datasets: [{
					data: [arrayMedical.length, arrayFreelance.length, arrayMedicalGroup.length, arrayIndustry.length, arrayIndustry.length, arrayWellness.length, arrayNDF.length],
					backgroundColor: ['rgba(0, 78, 100,0.5)','rgba(0, 165, 207,0.5)','rgba(58,118,175,0.5)','rgba(37, 161, 142, 0.5)','rgba(122, 229, 130,0.5)','rgba(195, 217, 73,0.5)','rgba(152,172,177,0.5)'],
					hoverBackgroundColor: ['rgba(0, 78, 100,0.8)','rgba(0, 165, 207,0.8)','rgba(58,118,175, 0.8)','rgba(37, 161, 142, 0.8)','rgba(122, 229, 130,0.8)','rgba(195, 217, 73,0.8)','rgba(152,172,177,0.8)'],
					hoverBorderColor:['rgba(0, 78, 100,0.8)','rgba(0, 165, 207,0.8)','rgba(58,118,175, 0.8)','rgba(37, 161, 142, 0.8)','rgba(122, 229, 130,0.8)','rgba(195, 217, 73,0.8)','rgba(152,172,177,0.8)'],
					hoverOffset: 4
				}]
			},        
			options: {
				tooltips: {
					// Overrides the global setting
					mode: 'label'
				},
				plugins:{
					tooltip: {
						backgroundColor:['rgba(255, 243, 194, 0.9)'],
						bodyColor:[mob_gray_d],
						titleColor:[mob_gray_d],
						footerColor:[mob_gray_d],
						bodyFont:{
							size:16
						},
						footerFont:{
							size:16
						},
						titleFont:{
							size:16
						},
						padding:8,
						position:'nearest',
						yAlign:'bottom'
					},
					legend:{
						position: 'left',
						labels:{
							usePointStyle:true,
							pointStyle: 'rectRounded',
							pointStyleWidth: 70,
							font:{
								size:16
							},
							color: mob_gray_d
						}
					},
					title: {
						display: true,
						text: 'Leads sector',        
						color: mob_gray_d,         
						font: {
							size: 18
						},
						padding:{
							top: 10,
							bottom: 20
						}
					}
				}
			}
		});

		// Fetch to see the customers
		data = stream.extract('<sectorCustomers>', '</sectorCustomers>').match;
        datasets = false;
        if (data) datasets = C_inlineStreaming.createDataSets(data);
		
		// Arrays for each sector
		arrayMedical = [];
		arrayFreelance = [];
		arrayMedicalGroup = [];
		arrayDentist = [];
		arrayIndustry = [];
		arrayWellness = [];
		arrayNDF = [];

		// Control for each customer to see in which sector they are active
		for (let id in datasets['C_dS_lead']) {
            let dS = datasets['C_dS_lead'][id];

			let creationDate = new Date(dS.created);

			if (creationDate.getFullYear() == selectedYear) {
				switch (dS.sector) {
				
					case 1:
						arrayMedical.push(dS.id);
						break;
					case 2:
						arrayFreelance.push(dS.id);
						break;
					case 3:
						arrayMedicalGroup.push(dS.id);
						break;
					case 4:
						arrayDentist.push(dS.id);
						break;
					case 5:
						arrayIndustry.push(dS.id);
						break;
					case 6:
						arrayWellness.push(dS.id);
						break;
					case 999:
						arrayNDF.push(dS.id);
						break;
				
					default:
						console.log('Default');
						break;
				}			
			}
        }

		// Create pie chart with the arrays from above as data for the sectors
		pieChartCustomers = new Chart(pieChartCustomersDiv, {
			type: 'pie',
			data: {
				labels: ['Medical','Liberal','Medical group','Dentist','Industry','Wellness','Undefined'],                
				datasets: [{
					data: [arrayMedical.length, arrayFreelance.length, arrayMedicalGroup.length, arrayIndustry.length, arrayIndustry.length, arrayWellness.length, arrayNDF.length],
					backgroundColor: ['rgba(0, 78, 100,0.5)','rgba(0, 165, 207,0.5)','rgba(58,118,175,0.5)','rgba(37, 161, 142, 0.5)','rgba(122, 229, 130,0.5)','rgba(195, 217, 73,0.5)','rgba(152,172,177,0.5)'],
					hoverBackgroundColor: ['rgba(0, 78, 100,0.8)','rgba(0, 165, 207,0.8)','rgba(58,118,175, 0.8)','rgba(37, 161, 142, 0.8)','rgba(122, 229, 130,0.8)','rgba(195, 217, 73,0.8)','rgba(152,172,177,0.8)'],
					hoverBorderColor:['rgba(0, 78, 100,0.8)','rgba(0, 165, 207,0.8)','rgba(58,118,175, 0.8)','rgba(37, 161, 142, 0.8)','rgba(122, 229, 130,0.8)','rgba(195, 217, 73,0.8)','rgba(152,172,177,0.8)'],
					hoverOffset: 4
				}]
			},        
			options: {
				plugins:{
					tooltip: {
						backgroundColor:['rgba(255, 243, 194, 0.9)'],
						bodyColor:[mob_gray_d],
						titleColor:[mob_gray_d],
						footerColor:[mob_gray_d],
						bodyFont:{
							size:16
						},
						footerFont:{
							size:16
						},
						titleFont:{
							size:16
						},
						padding:8,
						position:'nearest',
						yAlign:'bottom'
					},
					legend:{
						position: 'right',
						labels:{
							usePointStyle:true,
							pointStyle: 'rectRounded',
							pointStyleWidth: 70,
							font:{
								size:16
							},
							color: mob_gray_d
						}
					},
					title: {
						display: true,
						text: 'Sector of customers',
						color: mob_gray_d,
						font: {
							size: 18
						},
						padding:{
							top: 10,
							bottom: 20
						}
					}
				}
			}
		});
	},
	changeStats: function(){		
		barchart.destroy();
		pieChartLeads.destroy();
		pieChartCustomers.destroy();

		let loggedPerson = new C_iPASS(this.controls.accountm.state.value);
		post = new A_ps({ loggedPerson: loggedPerson }, { loggedPerson: 'loggedPerson' }, '../assets/php/query/chargeStatistics.php', { onreply: new A_cb(this, this.chargeStats), ontimeout: new A_cb(this, this.failed) }, {/*options*/ });
	},
	// Function to show the graf
	showGraf: function(e){
		console.log("Worked");
	},
	//Function called when fetch of elements failed
	failed: function(e){
		console.log("Failed");
	}
}