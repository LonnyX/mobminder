//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOR the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// © All Rights Reserved. Permission to use,	copy,	modify,	and distribute this software and its 
// documentation for educational,	research,	and not-for-profit purposes,	without fee and without 
// a signed licensing agreement,	modifications,	and distributions,	is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T H I S    F I L E    i s    I N T E N T I O N A L Y     E N C O D E D    i n   U T F 8  !
//

var tab = String.fromCharCode(9);	 // !! No translation here
var newline = String.fromCharCode(10);


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N     S E R V I C E
//
var mobminder = {};
mobminder.language = { // (*ml*)
	  codes: { english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7 }
,	names: { 
		0:'english',	 // !! No tranlsation here
		1:'français',	
		2:'polski',	
		3:'nederlands',	
		4:'deutsch',	
		5:'italiano',	
		6:'español',	
		7:'português'
	}
,	abr: { 
		0:'en',	 // !! No tranlsation here
		1:'fr',	
		2:'pl',	
		3:'nl',	
		4:'de',	
		5:'it',	
		6:'es',	
		7:'pt'
	}
}


mobminder.visitor = { // !! No tranlsation here
	codes: { client:100,	patient:200,	participant:150 } 	// !! No tranlsation here
,	names: { 100:'client',	200:'patient',	150:'participant'}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N    C L A S S 
//
// © Copyright 2007-2022 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//



C_XL.weekdays = {
	full: {									
'weekday1' : {	0:'monday',		1:'lundi',		2:'poniedziałek',	3:'maandag',	4:'Montag',		5:'lunedì',		6:'lunes',		7:'segunda-feira'},
'weekday2' : {	0:'tuesday',	1:'mardi',		2:'wtorek',			3:'dinsdag',	4:'Dienstag',	5:'martedì',	6:'martes',		7:'terça-feira'	},
'weekday3' : {	0:'wednesday',	1:'mercredi',	2:'środa',			3:'woensdag',	4:'Mittwoch',	5:'mercoledì',	6:'miércoles',	7:'quarta-feira'},
'weekday4' : {	0:'thursday',	1:'jeudi',		2:'czwartek',		3:'donderdag',	4:'Donnerstag',	5:'giovedì',	6:'jueves',		7:'quinta-feira'},
'weekday5' : {	0:'friday',		1:'vendredi',	2:'piątek',			3:'vrijdag',	4:'Freitag',	5:'venerdì',	6:'viernes',	7:'sexta-feira'	},
'weekday6' : {	0:'saturday',	1:'samedi',		2:'sobota',			3:'zaterdag',	4:'Samstag',	5:'sabato',		6:'sábado',		7:'sábado'		},
'weekday7' : {	0:'sunday',		1:'dimanche',	2:'niedziela',		3:'zondag',		4:'Sonntag',	5:'domenica',	6:'domingo',	7:'domingo'		}
	},
	abr: {									
'weekday1' : {	0:'mon',		1:'lun',		2:'pn',				3:'maa',		4:'mon',		5:'lun',		6:'lun',		7:'seg'	},
'weekday2' : {	0:'tue',		1:'mar',		2:'wt',				3:'din',		4:'die',		5:'mar',		6:'mar',		7:'ter'	},
'weekday3' : {	0:'wed',		1:'mer',		2:'śr',				3:'woe',		4:'mit',		5:'mer',		6:'mié',		7:'qua'	},
'weekday4' : {	0:'thu',		1:'jeu',		2:'czw',			3:'don',		4:'don',		5:'gio',		6:'jue',		7:'qui'	},
'weekday5' : {	0:'fri',		1:'ven',		2:'pt',				3:'vri',		4:'fre',		5:'ven',		6:'vie',		7:'sex'	},
'weekday6' : {	0:'sat',		1:'sam',		2:'so',				3:'zat',		4:'sam',		5:'sab',		6:'sáb',		7:'sáb'	},
'weekday7' : {	0:'sun',		1:'dim',		2:'nie',			3:'zon',		4:'son',		5:'dom',		6:'dom',		7:'dom'	}
	},
	min: {									
'weekday1' : {	0:'mo',			1:'lu',			2:'pn',				3:'ma',			4:'mo',			5:'lu',			6:'lu',			7:'se'	},
'weekday2' : {	0:'tu',			1:'ma',			2:'wt',				3:'di',			4:'di',			5:'ma',			6:'ma',			7:'te'	},
'weekday3' : {	0:'wd',			1:'me',			2:'śr',				3:'wo',			4:'mi',			5:'me',			6:'mi',			7:'qua'	},
'weekday4' : {	0:'th',			1:'je',			2:'cz',				3:'do',			4:'do',			5:'gi',			6:'ju',			7:'qui'	},
'weekday5' : {	0:'fr',			1:'ve',			2:'pt',				3:'vr',			4:'fr',			5:'ve',			6:'vi',			7:'sex'	},
'weekday6' : {	0:'sa',			1:'sa',			2:'so',				3:'za',			4:'sa',			5:'sa',			6:'sá',			7:'sáb'	},
'weekday7' : {	0:'su',			1:'di',			2:'n',				3:'zo',			4:'so',			5:'do',			6:'do',			7:'dom'	}
	}
};
C_XL.months = {	
	full: {								
'month1' : {	0:'January',	1:'Janvier',	2:'Styczeń',	3:'Januari',	4:'Januar',		5:'Gennaio',	6:'Enero',			7:'Janeiro'		},
'month2' : {	0:'February',	1:'Février',	2:'Luty',		3:'Februari',	4:'Februar',	5:'Febbraio',	6:'Febrero',		7:'Fevereiro'	},
'month3' : {	0:'March',		1:'Mars',		2:'Marzec',		3:'Maart',		4:'März',		5:'Marzo',		6:'Marzo',			7:'Março'		},
'month4' : {	0:'april',		1:'avril',		2:'Kwiecień',	3:'april',		4:'April',		5:'aprile',		6:'abril',			7:'abril'		},
'month5' : {	0:'May',		1:'Mai',		2:'Maj',		3:'Mei',		4:'Mai',		5:'Maggio',		6:'Mayo',			7:'Maio'		},
'month6' : {	0:'June',		1:'Juin',		2:'Czerwiec',	3:'Juni',		4:'Juni',		5:'Giugno',		6:'Junio',			7:'Junho'		},
'month7' : {	0:'July',		1:'Juillet',	2:'Lipiec',		3:'Juli',		4:'Juli',		5:'Luglio',		6:'Julio',			7:'Julho'		},
'month8' : {	0:'august',		1:'août',		2:'Sierpień',	3:'augustus',	4:'August',		5:'agosto',		6:'agosto',			7:'agosto'		},
'month9' : {	0:'September',	1:'Septembre',	2:'Wrzesień',	3:'September',	4:'September',	5:'Settembre',	6:'Septiembre',		7:'Setembro'	},
'month10': {	0:'October',	1:'Octobre',	2:'Październik',3:'Oktober',	4:'Oktober',	5:'Ottobre',	6:'Octubre',		7:'Outubro'		},
'month11': {	0:'November',	1:'Novembre',	2:'Listopad',	3:'November',	4:'November',	5:'Novembre',	6:'Noviembre',		7:'Novembro'	},
'month12': {	0:'December',	1:'Décembre',	2:'Grudzień',	3:'December',	4:'Dezember',	5:'Dicembre',	6:'Diciembre',		7:'Dezembro'	} 	
	},
	abr: {									
'month1' : {	0:'Jan',	1:'Jan',	2:'Sty',	3:'Jan',	4:'Jan',	5:'Gen',	6:'Ene',	7:'Jan'	},
'month2' : {	0:'Feb',	1:'Fév',	2:'Lu',		3:'Feb',	4:'Feb',	5:'Feb',	6:'Feb',	7:'Fev'	},
'month3' : {	0:'Mar',	1:'Mar',	2:'Mar',	3:'Mrt',	4:'Mar',	5:'Mar',	6:'Mar',	7:'Mar'	},
'month4' : {	0:'apr',	1:'avr',	2:'Kw',		3:'apr',	4:'apr',	5:'apr',	6:'abr',	7:'abr'	},
'month5' : {	0:'May',	1:'Mai',	2:'Maj',	3:'Mei',	4:'Mai',	5:'Mag',	6:'May',	7:'Mai'	},
'month6' : {	0:'Jun',	1:'Jun',	2:'Cze',	3:'Jun',	4:'Jun',	5:'Giu',	6:'Jun',	7:'Jun'	},
'month7' : {	0:'Jul',	1:'Jul',	2:'Lip',	3:'Jul',	4:'Jul',	5:'Lug',	6:'Jul',	7:'Jul'	},
'month8' : {	0:'aug',	1:'aoû',	2:'Sie',	3:'aug',	4:'aug',	5:'ago',	6:'ago',	7:'ago'	},
'month9' : {	0:'Sep',	1:'Sep',	2:'Wrz',	3:'Sep',	4:'Sep',	5:'Set',	6:'Sep',	7:'Set'	},
'month10': {	0:'Oct',	1:'Oct',	2:'Pa',		3:'Okt',	4:'Okt',	5:'Ott',	6:'Oct',	7:'Out'	},
'month11': {	0:'Nov',	1:'Nov',	2:'Lis',	3:'Nov',	4:'Nov',	5:'Nov',	6:'Nov',	7:'Nov'	},
'month12': {	0:'Dec',	1:'Déc',	2:'Gru',	3:'Dec',	4:'Dec',	5:'Dic',	6:'Dic',	7:'Dez'	}
	},
	min: {									
'month1' : {	0:'/01/',	1:'/01/',	2:'/01/',	3:'/01/',	4:'/01/',	5:'/01/',	6:'/01/',	7:'/01/'},
'month2' : {	0:'/02/',	1:'/02/',	2:'/02/',	3:'/02/',	4:'/02/',	5:'/02/',	6:'/02/',	7:'/02/'},
'month3' : {	0:'/03/',	1:'/03/',	2:'/03/',	3:'/03/',	4:'/03/',	5:'/03/',	6:'/03/',	7:'/03/'},
'month4' : {	0:'/04/',	1:'/04/',	2:'/04/',	3:'/04/',	4:'/04/',	5:'/04/',	6:'/04/',	7:'/04/'},
'month5' : {	0:'/05/',	1:'/05/',	2:'/05/',	3:'/05/',	4:'/05/',	5:'/05/',	6:'/05/',	7:'/05/'},
'month6' : {	0:'/06/',	1:'/06/',	2:'/06/',	3:'/06/',	4:'/06/',	5:'/06/',	6:'/06/',	7:'/06/'},
'month7' : {	0:'/07/',	1:'/07/',	2:'/07/',	3:'/07/',	4:'/07/',	5:'/07/',	6:'/07/',	7:'/07/'},
'month8' : {	0:'/08/',	1:'/08/',	2:'/08/',	3:'/08/',	4:'/08/',	5:'/08/',	6:'/08/',	7:'/08/'},
'month9' : {	0:'/09/',	1:'/09/',	2:'/09/',	3:'/09/',	4:'/09/',	5:'/09/',	6:'/09/',	7:'/09/'},
'month10': {	0:'/10/',	1:'/10/',	2:'/10/',	3:'/10/',	4:'/10/',	5:'/10/',	6:'/10/',	7:'/10/'},
'month11': {	0:'/11/',	1:'/11/',	2:'/11/',	3:'/11/',	4:'/11/',	5:'/11/',	6:'/11/',	7:'/11/'},
'month12': {	0:'/12/',	1:'/12/',	2:'/12/',	3:'/12/',	4:'/12/',	5:'/12/',	6:'/12/',	7:'/12/'}
	}
};
C_XL.dear = {
	0 : { 0:'Dear',	1:'Chère',	2:'Szanowny',	3:'Beste',		4:'Geehrte',	5:'Cara',	6:'Querida',	7:'Cara'},	// female
	1 : { 0:'Dear',	1:'Cher',	2:'Szanowny',	3:'Beste',		4:'Geehrter',	5:'Caro',	6:'Querido',	7:'Caro'},	// male
	2 : { 0:'',		1:'',		2:'',			3:'',			4:'',			5:'',		6:'',			7:''	},	// sa
	3 : { 0:'',		1:'',		2:'',			3:'',			4:'',			5:'',		6:'',			7:''	},	// sprl
	5 : { 0:'Dear',	1:'Chère',	2:'Szanowny',	3:'Beste',		4:'Geehrte',	5:'Cara',	6:'Querida',	7:'Cara'},	// miss
	4 : { 0:'Dear',	1:'Cher',	2:'Szanowny',	3:'Beste',		4:'Geehrter',	5:'Caro',	6:'Querido',	7:'Caro'},	// boy
	6 : { 0:'Dear',	1:'Chère',	2:'Szanowny',	3:'Beste',		4:'Geehrte',	5:'Cara',	6:'Querida',	7:'Cara'}  // girl
}; 	


C_XL.d['male']		= { 0:'Mr.',	1:'M.',		2:'Pan',		3:'Mr',		4:'Herr',	5:'Sig',		6:'Señor',		7:'Sr.'		};
C_XL.d['female']	= { 0:'Mrs.',	1:'Mme',	2:'Pani',		3:'Mvr',	4:'Frau',	5:'Sig.ra',		6:'Señora',		7:'Sra.'	};
C_XL.d['sa']		= { 0:'aS',		1:'SA',		2:'SA',			3:'NV',		4:'aG',		5:'SA',			6:'SA',			7:'SA'		};
C_XL.d['sprl']		= { 0:'Ltd',	1:'Sprl',	2:'Sp.z o.o.',	3:'Bvba',	4:'Pgbh',	5:'Ltd',		6:'SRL',		7:'SARL'	};
C_XL.d['miss']		= { 0:'Miss',	1:'Mlle',	2:'Tęsknić',	3:'Juffr',	4:'Ms',		5:'Sig.na',		6:'Señorita',	7:'Menina'	};
C_XL.d['boy']		= { 0:'Boy',	1:'Garçon',	2:'Chłopak',	3:'Jhr',	4:'Junge',	5:'Ragazzo',	6:'Niño',		7:'Rapaz'	};
C_XL.d['girl']		= { 0:'Girl',	1:'Fille',	2:'Córka',		3:'Dchtr',	4:'Mädchen',5:'Ragazza',	6:'Niña',		7:'Rapariga'};

C_XL.d['hour']		= { 0:'hour',	1:'heure',	2:'godzinę',	3:'uur',	4:'Stund',	5:'ora',		6:'hora',		7:'hora'	};
C_XL.d['hours']		= { 0:'hours',	1:'heures',	2:'godziny',	3:'uren',	4:'Stunden',5:'ore',		6:'horas',		7:'horas'};
C_XL.d['abr min']	= { 0:'m',		1:'m',		2:'m',			3:'m',		4:'m',		5:'m',			6:'m', 			7:'m'		};

C_XL.d['ok']		= { 0:'Ok',		1:'Ok',		2:'Ok',		3:'Ok',			4:'Ok',		5:'Ok',		6:'Ok',		7:'Ok'		};
C_XL.d['yes']		= { 0:'Yes',	1:'Oui',	2:'Tak',	3:'Ja',			4:'Ja',		5:'Sì',		6:'Si', 	7:'Sim'		};
C_XL.d['no']		= { 0:'No',		1:'Non',	2:'Nie',	3:'Nee',		4:'Nein',	5:'No',		6:'No', 	7:'Não'		};
C_XL.d['web']		= { 0:'Web',	1:'Web',	2:'Web',	3:'Web',		4:'Web',	5:'Web',	6:'Web', 	7:'Web'		};
C_XL.d['or'] 		= { 0:'or', 	1:'ou', 	2:'lub', 	3:'of', 		4:'oder', 	5:'o', 		6:'o', 		7:'ou' 		};

C_XL.d['date']		= { 0:'Date',	1:'Date',	2:'Data',	3:'Datum',		4:'Datum',	5:'Data',	6:'Fecha', 	7:'Data'	};
C_XL.d['time']		= { 0:'Time',	1:'Heure',	2:'Godzina',3:'Uur',		4:'Uhr',	5:'Ora',	6:'Hora', 	7:'Hora'	};
C_XL.d['fromdate']	= { 0:'from',	1:'du',		2:'od',		3:'vanaf',		4:'von',	5:'dal',	6:'desde', 	7:'de'		};
C_XL.d['untildate']	= { 0:'until',	1:'jusqu\'au',	2:'do',	3:'tot',		4:'bis',	5:'fino al',6:'hasta el', 	7:'até'		};
C_XL.d['todate']	= { 0:'to',		1:'au',		2:'do',		3:'tot',		4:'bis',	5:'a',		6:'a', 		7:'até'		};
C_XL.d['ondate']	= { 0:'on',		1:'le',		2:'do',		3:'op',			4:'am',		5:'il',		6:'el', 	7:'o'		};
C_XL.d['fromtime']	= { 0:'from',	1:'de',		2:'o',		3:'van',		4:'von',	5:'da',		6:'desde', 	7:'de'		};
C_XL.d['at']		= { 0:'at',		1:'à',		2:'o',		3:'om',			4:'um',		5:'a',		6:'a', 		7:'a'		};
C_XL.d['to']		= { 0:'to',		1:'à',		2:'do',		3:'tot',		4:'bis',	5:'a',		6:'a', 		7:'até'		};
C_XL.d['for']		= { 0:'for',	1:'pour',	2:'dla',	3:'voor',		4:'für',	5:'per',	6:'para', 	7:'para'	};
C_XL.d['abr days']	= { 0:'days',	1:'jrs',	2:'dni',	3:'dagen',		4:'Tage',	5:'gg.',	6:'días', 	7:'dias'	};
C_XL.d['abr day']	= { 0:'day',	1:'jr',		2:'dzień',	3:'dag',		4:'Tag',	5:'g.',		6:'día', 	7:'dia'		};
C_XL.d['weekday']	= { 0:'Weekday',1:'Jour',	2:'Dzień',	3:'Weekdag',	4:'Wochentag',	5:'Feriale',	6:'Día', 	7:'Dia'		};
C_XL.d['weekdays']	= { 0:'Weekdays',1:'Jours',	2:'Dzień',	3:'Weekdagen',	4:'Wochentage',	5:'Feriali',	6:'Días', 	7:'Dias'	};


C_XL.d['men']		= { 0:'Men',	1:'Hommes',	2:'Mężczyźni',	3:'Mensen',	4:'Männer',	5:'Uomini',	6:'Hombre', 7:'Homens'	};
C_XL.d['women']		= { 0:'Women',	1:'Femmes',	2:'Kobiety',	3:'Vrouwen',4:'Frauen',	5:'Donne',	6:'Mujer', 	7:'Mulheres'	};

C_XL.d['gender_1']		= { 0:'Man',	1:'Masculin',	2:'Mężczyźni',	3:'Mannelijk',	4:'Männer',	5:'Uomini',	6:'Hombre', 7:'Homens'	};
C_XL.d['gender_0']		= { 0:'Woman',	1:'Féminin',	2:'Kobiety',	3:'Vrouwelijk',4:'Frauen',	5:'Donne',	6:'Mujer', 	7:'Mulheres'	};

C_XL.d['visibility']	= { 0:'Visibility',		1:'Visibilité',			2:'Widoczność',		3:'Zichtbaarheid',		4:'Sichtbarkeit',	5:'Visibilità',		6:'Visibilidad', 		7:'Visibilidade'	};
C_XL.d['always']		= { 0:'always',			1:'Toujours',			2:'Zawsze',			3:'altijd',				4:'immer',			5:'Sempre',			6:'Siempre', 			7:'Sempre'			};
C_XL.d['up to date']	= { 0:'to',				1:'jusqu\'au',			2:'do tej pory',	3:'tot',				4:'bis',			5:'fino a',			6:'hasta el', 			7:'a'				};
C_XL.d['from date']		= { 0:'From',			1:'a partir du',		2:'Od tego dnia',	3:'Vanaf datum',		4:'ab Datum',		5:'Dal',			6:'Desde el', 			7:'a partir de'		};
C_XL.d['on time']		= { 0:'On time',		1:'a l\'heure',			2:'W czasie',		3:'Op tijdstip',		4:'Um Uhrzeit',		5:'In tempo',		6:'a tiempo', 			7:'a tempo'			};
C_XL.d['date included'] = { 0:'included',		1:'inclus',				2:'włączony',		3:'inbegrepen',			4:'einschließlich',	5:'inclusa',		6:'incluido', 			7:'incluído'		};
C_XL.d['in period']		= { 0:'In the period',	1:'Dans la période',	2:'W okresie',		3:'In de periode',		4:'im Zeitraum',	5:'Nel periodo',	6:'En el período', 		7:'No período'		};
C_XL.d['single day']	= { 0:'Single day',		1:'Un seul jour',		2:'Tylko dni',		3:'Enkel één dag',		4:'Einzelner Tag',	5:'Un solo giorno',	6:'Un solo día', 		7:'Um único dia'	};

C_XL.d['local time']	= { 0:'local time',		1:'heure locale',		2:'czas lokalny',	3:'lokale tijd',		4:'Ortszeit',		5:'ora locale',		6:'hora local', 		7:'horário local'	};

// 		technical 			english:0,			french:1,				polish:2,			dutch:3,				german:4,			italian:5,			spanish:6,				portuguese:7

C_XL.d['resa finder'] 			= { 0:'Filter & Find',			1:'Filtrer & Trouver',			2:'Filtr & Znajdź',			3:'Filteren & vinden',			4:'Filtern & finden',				5:'Filtrare e trovare',			6:'Filtrar y encontrar', 			7:'Filtrar e Encontrar'			};
C_XL.d['account preferences'] 	= { 0:'Settings & Preferences',	1:'Réglages & Préférences',		2:'Ustawienia i Ustawienia',3:'Instellingen & Voorkeuren',	4:'Einstellungen & Präferenzen ',	5:'Impostazioni e Preferenze',	6:'Configuraciones y Preferencias', 7:'Configurações e Preferências'	};
C_XL.d['sms dashboard'] 		= { 0:'SMS dashboard',			1:'Trafique SMS',				2:'SMS traffics',			3:'SMS trafiek',				4:'SMS Verkehr',					5:'Traffico sms',				6:'Tráfico sms', 					7:'Tráfego de SMS'				};
C_XL.d['cnx monitoring'] 		= { 0:'Connections monitoring',	1:'Monitoring des connexions',	2:'Monitoring połączeń',	3:'aansluitingen controle',		4:'Verbdinungsüberwachung',			5:'Monitoraggio connessioni',	6:'Monitoring conexiones ', 		7:'Monitorização de ligações'	};
C_XL.d['elearning'] 			= { 0:'Online tutorial',		1:'Tutoriel en ligne',			2:'Samouczek online',		3:'Online tutorial',			4:'Online Tutorial',				5:'Tutorial online',			6:'Tutorial online', 				7:'Tutorial on-line'			};



	// connections
	
C_XL.d['account archives'] 	= { 0:'archives',			1:'archives',				2:'archiwum',	3:'archief',			4:'archiv',			5:'archivi',	6:'archivos', 7:'Ficheiros'	};
C_XL.d['loading'] 			= { 0:'Currently loading',	1:'En cours de Chargement',	2:'ładowanie',	3:'Is aan het laden',	4:'Wird geladen',	5:'Caricando',	6:'Cargando', 7:'a carregar'	};

// 		technical 				english:0,				french:1,					polish:2,		dutch:3,				german:4,			italian:5,		spanish:6,		portuguese:7



C_XL.d['error occured']	= { 0:'an error occured',			// english
							1:'une erreur est survenue',	// french
							2:'wystąpił błąd',				// polish
							3:'er is een fout opgetreden',	// dutch
							4:'ein Fehler ist aufgetreten',	// german
							5:'si è verificato un errore',	// italian
							6:'ocurrió un error', 			// spanish
							7:'um erro ocorreu'	};			// portuguese

C_XL.d['account settings changed']	= { 0:'account settings were changed',			// english
							1:'les réglages de votre agenda ont changés',	// french
							2:'ustawienia konta zostały zmienione',				// polish
							3:'accountinstellingen zijn gewijzigd',	// dutch
							4:'Kontoeinstellungen wurden geändert',	// german
							5:'le impostazioni dell\'account sono state modificate',	// italian
							6:'la configuración de la cuenta fue cambiada', 			// spanish
							7:'as configurações da conta foram alteradas'	};			// portuguese



C_XL.d['sw update title']	= { 0:'application update',			// english
							1:'mise à jour de l\'application',	// french
							2:'aktualizacja oprogramowania',	// polish
							3:'software-update',				// dutch
							4:'Software-Aktualisierung',		// german
							5:'aggiornamento del software',		// italian
							6:'actualización de software', 		// spanish
							7:'atualização de software'	};		// portuguese

		// This message is intended for the smartphone / tablets apps, because the web app re-loads automatically when updated on server

C_XL.d['please update']	= { 0:'a new version of Mobminder is available, please follow the link below to update your application',					// english
							1:'une nouvelle version de Mobminder est disponible, SVP suivez le lien suivant pour mettre à jour votre application',	// french
							2:'dostępna jest nowa wersja Mobmindera, skorzystaj z poniższego łącza, aby zaktualizować swoją aplikację',				// polish
							3:'er is een nieuwe versie van Mobminder beschikbaar, volg de onderstaande link om uw applicatie bij te werken',		// dutch
							4:'Eine neue Version von Mobminder ist verfügbar. Bitte folgen Sie dem Link unten, um Ihre Anwendung zu aktualisieren',	// german
							5:'è disponibile una nuova versione di Mobminder, segui il link sottostante per aggiornare la tua applicazione',		// italian
							6:'una nueva versión de Mobminder está disponible, siga el enlace a continuación para actualizar su aplicación', 		// spanish
							7:'uma nova versão do Mobminder está disponível, siga o link abaixo para atualizar seu aplicativo'	};					// portuguese


	// stats
	
C_XL.d['account statistics']= { 0:'Statistics',	1:'Statistiques',	2:'Statystyki',		3:'Statistieken',		4:'Statistiken',		5:'Statistiche',		6:'Estadísticas', 	7:'Estatísticas'};
C_XL.d['stats account'] 	= { 0:'account',	1:'Compte',			2:'account',		3:'account',			4:'Konto',				5:'Conto',				6:'Cuenta', 		7:'Conta'		};
C_XL.d['stats actuals'] 	= { 0:'actuals',	1:'Presté',			2:'Wykonywane',		3:'Uitgevoerd',			4:'Werte',				5:'Effettivi',			6:'Reales', 		7:'Desde'		};
C_XL.d['stats actions'] 	= { 0:'audit',		1:'audit',			2:'audit',			3:'audit',				4:'Prüfung',			5:'audit',				6:'auditoría', 		7:'auditoria'	};
C_XL.d['stats smstraf'] 	= { 0:'SMS',		1:'SMS',			2:'SMS',			3:'SMS',				4:'SMS',				5:'SMS',				6:'SMS', 			7:'SMS'			};

C_XL.d['in use']			= { 0:'In use',		1:'activé',			2:'aktywowany',		3:'Geactiveerd',		4:'aktiviert',			5:'attivato',			6:'activado', 		7:'ativado'		};
C_XL.d['not in use']		= { 0:'Not used',	1:'Pas activé',		2:'Nie Aktywowane',	3:'Niet geactiveerd',	4:'Nicht aktiviert',	5:'Disattivato',		6:'Desactivado', 	7:'Desativado'	};
C_XL.d['search'] 			= { 0:'Search',		1:'Rechercher',		2:'Wyszukiwanie',	3:'Zoeken',				4:'Suchen',				5:'Ricercare',			6:'Buscar', 		7:'Pesquisar'	};
C_XL.d['selection'] 		= { 0:'Sel',		1:'Sel',			2:'Wybór',			3:'Sel',				4:'ausw',				5:'Sel',				6:'Sal', 			7:'Sal'			};
C_XL.d['id'] 				= { 0:'Id',			1:'Id',				2:'Id',				3:'Id',					4:'ID',					5:'Id',					6:'Id', 			7:'Id'			};
C_XL.d['note'] 				= { 0:'Note',		1:'Note',			2:'Notatka',		3:'Notitie',			4:'Notiz',				5:'Nota',				6:'Nota', 			7:'Nota'		};
C_XL.d['info'] 				= { 0:'Info',		1:'Info',			2:'Info',			3:'Info',				4:'Info',				5:'Info',				6:'Info', 			7:'Informações'	};
C_XL.d['headline'] 			= { 0:'Headline',	1:'Titrage',		2:'Nagłówek',		3:'Opschrift',			4:'Titel',				5:'Titolo',				6:'Título', 		7:'Título'		};




C_XL.d['notes'] 			= { 0:'Notes',		1:'Notes',			2:'Notatki',		3:'Nota\'s',			4:'Notizen',			5:'Note',				6:'Notas', 			7:'Notas'		};
C_XL.d['new note'] 			= { 0:'New note',	1:'Nouvelle note',	2:'Nowa notatka',	3:'Nieuwe notitie',		4:'Neue Notiz',			5:'Nuova nota',			6:'Nota nueva', 	7:'Nova nota'	};
C_XL.d['no note'] 			= { 0:'No note',	1:'Pas de note',	2:'Brak notatka',	3:'Geen notitie',		4:'Keine Notiz',		5:'Nessuna nota',		6:'Ninguna nota', 	7:'Sem nota'	};
C_XL.d['addressees'] 		= { 0:'addressees',	1:'Destinataires',	2:'adresaci',		3:'Geadresseerden',		4:'Empfänger',			5:'Destinatario',		6:'Destinatario', 	7:'Destinatários'};

C_XL.d['task']				= { 0:'Task',		1:'Tâche',			2:'Zadanie',		3:'Taak',				4:'aufgabe',			5:'attività',			6:'Tarea', 			7:'Tarefa'		};
C_XL.d['tasks'] 			= { 0:'Tasks',		1:'Tâches',			2:'Zadania',		3:'Taken',				4:'aufgaben',			5:'attività',			6:'Tareas', 		7:'Tarefas'		};
C_XL.d['new task'] 			= { 0:'New task',	1:'Nouvelle tâche',	2:'Nowa zadanie',	3:'Nieuwe taak',		4:'Neue Aufgabe',		5:'Nuova attività',		6:'Tarea nueva', 	7:'Nova tarefa'	};
C_XL.d['no task'] 			= { 0:'No task',	1:'Pas de tâche',	2:'Brak zadanie',	3:'Geen taak',			4:'Keine Aufgaben',		5:'Nessuna attività',	6:'Ninguna tarea', 	7:'Sem tarefa'	};

C_XL.d['alt mandatory']		= { 0:'Type a title or select a reference',	
								1:'Indiquez un titre ou choisir une référence',	
								2:'Wpisz tytuł lub wybierz odniesienie',		
								3:'Typ een titel of selecteer een referentie',		
								4:'Titel eingeben oder Referenz auswählen',	
								5:'Indichi un titolo o scelga una referenza',	
								6:'Indique un título o escoja una referencia',
								7:'Insira um título ou escolha uma referência'	};
								
		
	// M_chat						

C_XL.d['chat never been']	= { 0:'You have never been in this chat',	
								1:'Vous n\'avez jamais contribué à ce chat',	
								2:'Nigdy nie przyczyniły się do tego czatu',	
								3:'U heeft nooit bijgedragen tot dit gesprek',		
								4:'Sie haben in diesem Chat noch keinen Beitrag',	
								5:'Non ha mai partecipato a questo chat',	
								6:'Nunca participó en este chat', 
								7:'você nunca contribuiu para este chat'	};
								
C_XL.d['chat you quit']		= { 0:'You have left this chat',1:'Vous avez quitté cette conversation',		2:'Zostawiłeś tę rozmowę',		3:'U liet dit gesprek',					4:'Sie haben die Unterhaltung verlassen',	5:'Ha lasciato questa conversazione',	6:'Ha dejado esta conversación', 7:'Saiu desta conversa'	};
C_XL.d['chat save before']	= { 0:'Save to start chatting',	1:'Enregistrez pour démarer la conversation',	2:'Save, aby rozpocząć czat',	3:'Sla op om te beginnen met chatten',	4:'Speichern, um den Chat zu starten',	5:'Memorizzi per cominciare la conversazione ',	6:'Grabe para empezar la conversación', 7:'Registe-se para começar a conversa'	};

// 		technical 				english:0,					french:1,					polish:2,				dutch:3,					german:4,							italian:5,					spanish:6,				portuguese:7

C_XL.d['copy chat thread']	= { 0:'copy entire chat',		1:'copier la conversation',	2:'skopiuj rozmowę',	3:'gesprek kopieren',		4:'Konversation kopieren',			5:'copia conversazione',	6:'copiar conversación',  7:'copiar conversa'	};
C_XL.d['copy phylactery']	= { 0:'copy this speech bubble',1:'copier ce phylactère',	2:'skopiuj ten dymek',	3:'kopieer deze tekstballon',4:'Kopieren Sie diese Sprechblase',5:'copia questo fumetto',	6:'copia este bocadillo', 7:'copie este balão de fala'	};


C_XL.d['chat ban evacuate']	= { 0:'You have been excluded from this conversation.'
							,	1:'Vous avez été exclu de cette conversation.'
							,	2:'Zostałeś wykluczony z tej rozmowy.'
							,	3:'U bent uitgesloten van dit gesprek.'
							,	4:'Sie wurden von diesem Gespräch ausgeschlossen.'
							,	5:'Sei stato escluso da questa conversazione.'
							,	6:'Ha sido excluido de esta conversación.'
							, 	7:'Você foi excluído desta conversa.'	};


// 		technical 				english:0,				french:1,					polish:2,			dutch:3,					german:4,					italian:5,					spanish:6,					portuguese:7

C_XL.d['chat']				= { 0:'Chat session',		1:'Conversation',			2:'Rozmowa',		3:'Chatsessie',				4:'Unterhaltung',			5:'Conversazione',			6:'Conversación', 			7:'Conversa'		};
C_XL.d['chats']				= { 0:'chat sessions',		1:'conversations',			2:'rozmowy',		3:'chatsessies',			4:'unterhaltungen',			5:'conversazioni',			6:'conversaciones', 		7:'conversas'		};
C_XL.d['new chat'] 			= { 0:'New chat',			1:'Nouvelle conversation',	2:'Nowa rozmowa',	3:'Nieuwe chatsessie',		4:'Neue Unterhaltung',		5:'Nuova conversazione',	6:'Nueva conversación', 	7:'Nova conversa'	};
C_XL.d['no chat'] 			= { 0:'No chat',			1:'Pas de conversation',	2:'Brak rozmowa',	3:'Geen chatsessie',		4:'Keine Unterhaltungen',	5:'Nessuna conversazione',	6:'Ninguna conversación', 	7:'Sem conversa'	};
C_XL.d['conversation'] 		= { 0:'Conversation',		1:'Conversation',			2:'Rozmowa',		3:'Gesprek',				4:'Unterhaltung',			5:'Conversazione',			6:'Conversación', 			7:'Conversa'		};
C_XL.d['participants'] 		= { 0:'Participants',		1:'Participants',			2:'uczestnik',		3:'Deelnemers',				4:'Teilnehmer',				5:'Partecipanti',			6:'Participantes', 			7:'Participantes'	};
C_XL.d['description'] 		= { 0:'Description',		1:'Description',			2:'Opis',			3:'Beschrijving',			4:'Beschreibung',			5:'Descrizione',			6:'Descripción', 			7:'Descrição'		};
C_XL.d['summary'] 			= { 0:'Summary',			1:'Résumé',					2:'Podsumowanie',	3:'Samenvatting',			4:'Übersicht',				5:'Riassunto',				6:'Resumen', 				7:'Resumo'			};

C_XL.d['start chat'] 		= { 0:'Start chatting here',1:'Démarrez ici',				2:'Zacznij tutaj czacie',	3:'Start hier met chatten',	4:'Hier starten',			5:'Inizi qui',					6:'Comience aquí ', 			7:'Comece aqui'			};
C_XL.d['answer here'] 		= { 0:'answer here',		1:'Répondre ici',				2:'Odpowiedź tutaj',		3:'Hier aantwoorden',		4:'Hier antworten',			5:'Rispondere qui',				6:'Contestar aquí', 			7:'Responda aqui'		};
C_XL.d['answer send'] 		= { 0:'Post',				1:'Poster',						2:'Obwieścić',				3:'Uitzetten',				4:'Senden',					5:'Pubblicare',					6:'Publicar', 					7:'Publicar'			};
C_XL.d['4all assignees'] 	= { 0:'For all assignees',	1:'Pour tous les affectés',		2:'Wszystkie przypisane',	3:'Voor alle toegewezen',	4:'an alle Betroffene',		5:'Per tutti gli utenti',		6:'Para todos los usuarios', 	7:'Para todos os afetados'};

C_XL.d['assignees'] 		= { 0:'assignees',			1:'affectés',			2:'Przydzielony',		3:'Toegewezen',				4:'Betroffene',				5:'Utenti',						6:'Usuarios', 				7:'afetados'		};
C_XL.d['assignee'] 			= { 0:'assignee',			1:'affecté',			2:'asygnowany',			3:'Toegewezen',				4:'Betroffen',				5:'Utente',						6:'Usuario', 				7:'afetado'			};
C_XL.d['progress'] 			= { 0:'Progress',			1:'Progression',		2:'Progressie',			3:'Progressie',				4:'Fortschritt',			5:'Progresso',					6:'Progresión', 			7:'Progresso'		};
C_XL.d['not started'] 		= { 0:'Not started',		1:'Pas démarrée',		2:'Nie rozpoczęty',		3:'Niet gestart',			4:'Nicht gestartet',		5:'Non iniziato',				6:'No empezado', 			7:'Não iniciado'	};
C_XL.d['in progress'] 		= { 0:'In progress',		1:'En cours',			2:'W toku',				3:'aan de gang',			4:'In Arbeit',				5:'In corso',					6:'En curso', 				7:'Em curso'		};
C_XL.d['archived on'] 		= { 0:'archived on',		1:'archivée le',		2:'archiwizowane w',	3:'Gearchiveerd op',		4:'archiviert am',			5:'archiviato il',				6:'Guardado el', 			7:'Guardado a'		};
C_XL.d['archive'] 			= { 0:'archive this task',	1:'archiver la tâche',	2:'archiwum zadanie',	3:'Taak archiveren',		4:'aufgabe archivieren',	5:'archiviare questa attività',	6:'Guardar esta actividad', 7:'Guardar a tarefa'};
C_XL.d['to archive'] 		= { 0:'archive',			1:'archiver',			2:'archiwum',			3:'archiveren',				4:'archivieren',			5:'archiviare',					6:'Guardar', 				7:'Guardar'			};
C_XL.d['archived'] 			= { 0:'archived',			1:'archivée',			2:'archiwizowane',		3:'Gearchiveerd',			4:'archiviert',				5:'archiviato',					6:'Guardado', 				7:'Guardado'		};
C_XL.d['finished'] 			= { 0:'Finished',			1:'Terminée',			2:'Gotowy',				3:'afgewerkt',				4:'Fertig',					5:'Terminato',					6:'acabado', 				7:'Terminado'		};
C_XL.d['verified'] 			= { 0:'Verified',			1:'Vérifiée',			2:'Zweryfikowana',		3:'Verified',				4:'Überprüft',				5:'Verificato',					6:'Comprobado', 			7:'Verificado'		};
C_XL.d['task schedule']		= { 0:'Scheduling',			1:'Entre en vigueur le',2:'Wchodzi w życie',	3:'treedt in werking op',	4:'Tritt in Kraft am',		5:'Entra in vigore il',			6:'Entra en vigor el', 		7:'Entra em vigor a'};

C_XL.d['tskass-loginId'] 	= { 0:'assignees',			1:'affectés',			2:'Przydzielony',		3:'Toegewezen',				4:'Betroffene',				5:'Utenti',				6:'Cesionarios', 	7:'afetados'	};
C_XL.d['tskass-cssPattern']	= { 0:'Status',				1:'Statut',				2:'Stan',				3:'Staat',					4:'Status',					5:'Status',				6:'Estado', 		7:'Estado'		};
C_XL.d['tskass-midnOut'] 	= { 0:'archived on',		1:'archivée le',		2:'archiwizowane w',	3:'Gearchiveerd op',		4:'archiviert am',			5:'archiviato il',		6:'Guardado el', 	7:'Guardado a'	};

								
C_XL.d['see archives']		= { 0:'see archives',			// english
								1:'voir les archives',		// french
								2:'zobacz archiwa',			// polish
								3:'archieven zien',			// dutch
								4:'siehe die Archive',		// german
								5:'vedere gli archivi',		// italian
								6:'ver los archivos', 		// spanish
								7:'veja os arquivos'	};	// portuguese
								
								
C_XL.d['chat unsent msg on launch pad']	= { 0:'you wrote a message that you did not send',	// english
											1:'vous avez écrit un message que vous n\'avez pas envoyé',	// french
											2:'napisałeś wiadomość, której nie wysłałeś',	// polish
											3:'u hebt een bericht geschreven dat u niet hebt verzonden',		// dutch
											4:'Sie haben eine Nachricht geschrieben, die Sie nicht gesendet haben',	// german
											5:'hai scritto un messaggio che non hai inviato',		// italian
											6:'escribiste un mensaje que no enviaste', 	// spanish
											7:'você escreveu uma mensagem que não enviou'	};	// portuguese


C_XL.d['quit anyway']		= { 0:'close anyway',					// english
								1:'fermer quand même',				// french
								2:'zrezygnuj mimo wszystko',		// polish
								3:'toch sluiten',					// dutch
								4:'sowieso schließen',				// german
								5:'chiudere comunque',				// italian
								6:'cerrar de todos modos', 			// spanish
								7:'feche de qualquer maneira'	};	// portuguese
								
C_XL.d['chat stay']			= { 0:'do not quit',	// english
								1:'ne pas quitter',	// french
								2:'nie odchodź',	// polish
								3:'blijven',		// dutch
								4:'kündige nicht',	// german
								5:'non uscire',		// italian
								6:'no renuncies', 	// spanish
								7:'não saia'	};	// portuguese

C_XL.d['archived chats']	= { 0:'archived chats',			// english
								1:'conversations archivées',// french
								2:'zarchiwizowane czaty',	// polish
								3:'gearchiveerde chats',	// dutch
								4:'archivierte Chats',		// german
								5:'chat archiviate',		// italian
								6:'chats archivados', 		// spanish
								7:'chats arquivados'	};	// portuguese

C_XL.d['archived chat']	= { 0:'archived chat',			// english
								1:'conversation archivée',// french
								2:'zarchiwizowany czat',	// polish
								3:'gearchiveerde chat',	// dutch
								4:'archivierte Chat',		// german
								5:'chat archiviata',		// italian
								6:'chat archivado', 		// spanish
								7:'chat arquivado'	};	// portuguese

C_XL.d['archived and deleted chats'] = { 0:'archived and deleted chats',	// english
								1:'conversations archivées et effacées',	// french
								2:'zarchiwizowane i usunięte czaty',		// polish
								3:'gearchiveerde en verwijderde chats',		// dutch
								4:'archivierte und gelöschte Chats',		// german
								5:'chat archiviate ed eliminate',			// italian
								6:'chats archivados y eliminados', 			// spanish
								7:'bate-papos arquivados e excluídos'	};	// portuguese


C_XL.d['deleted chat']		= { 0:'deleted chat',			// english
								1:'conversation effacée',	// french
								2:'usunięty czat',			// polish
								3:'verwijderde chat',		// dutch
								4:'Chat gelöscht',			// german
								5:'chat eliminata',			// italian
								6:'chat eliminado', 		// spanish
								7:'bate-papo excluído'	};	// portuguese


//	M_VISI

C_XL.d['dupli resolution']	= { 
	0:'Visitors identified here are duplicates. They will be eliminated during the recording of this sheet. The history of appointments will be attached to this sheet.'
,	1:'Les visiteurs identifiés ici sont des doublons. Ils seront éliminés lors de l\'enregistrement de cette fiche. Les historiques de rendez-vous seront rattachés à la présente fiche.'
,	2:'Użytkownicy zidentyfikowane tutaj są duplikatami. Zostaną one usunięte podczas nagrywania tej płyty.Historyczne spotkanie będzie dołączony do tego arkusza.'
,	3:'Bezoekers hier geïdentificeerd zijn duplicaten. Zij worden geëlimineerd tijdens de opname van dit blad. De geschiedenis van de benoemingen zal worden gehecht aan dit blad.'	
,	4:'Die hier identifizierten Besucher sind Duplikate. Sie werden beim Speichern dieser Datei gelöscht. Der bisherige Terminverlauf wird dieser Datei beigefügt.'
,	5:'I visitatori identificati qui sono doppioni. Saranno eliminati al salvataggio di questa scheda. Gli appuntamenti passati saranno legati a questa scheda.'	
,	6:'Los visitantes identificados aquí están duplicados. Serán eliminados durante la grabación de esta ficha. El historial de citas será vinculado a la ficha actual.'
,	7:'Os visitantes identificados aqui são duplicados. Eles serão eliminados durante o armazenamento desta ficha. Is historiais de encontros serão anexados a esta ficha.'	};


// Preference dashboard

C_XL.d['playidletip']		= { 0:'Start searching the agenda',	
								1:'Démarrer une recherche dans l\'agenda',	
								2:'Rozpocznij wyszukiwanie porządku obrad',	
								3:'Start het zoeken in de agenda',	
								4:'Suche im Kalender starten',	
								5:'Iniziare una ricerca nell\'agenda',	
								6:'Empezar una búsqueda en la agenda', 
								7:'Iniciar uma pesquisa no calendário'	};
								
C_XL.d['playwarning']		= { 0:'No visitor selected,	search for an unavailability?',	
								1:'Pas de visiteur séléctionné,	recherche pour une indisponibilité?',	
								2:'Nr gości wybranych,	szukaj niedostępności?',	
								3:'Geen bezoeker geselecteerd, zoeken naar een onbeschikbaarheid?',	
								4:'Kein Besucher ausgewählt, nach Nichverfügbarkeit suchen',	
								5:'Nessun visitatore selezionato, ricercare un\'indisponibilità?',	
								6:'Ningún visitante seleccionado, buscar una indisponibilidad? ', 
								7:'Nenhum visitante selecionado, efetuar pesquisa por indisponibilidade?'	};

								
// 		technical 				english:0,				french:1,					polish:2,			dutch:3,					german:4,					italian:5,						spanish:6,					portuguese:7
C_XL.d['slotsearch']		= { 0:'Search',				1:'Rechercher',				2:'Szukaj',				3:'Zoeken',				4:'Suchen',					5:'Ricercare',					6:'Buscar', 				7:'Pesquisar'			};
C_XL.d['more search']		= { 0:'Search further',		1:'Chercher plus loin',		2:'Szukaj więcej',		3:'Verder zoeken',		4:'Mehr suchen',			5:'approfondire la ricerca',	6:'Buscar más adelante', 	7:'Procurar mais atrás'	};
C_XL.d['standby list']		= { 0:'standby list',		1:'liste d\'attente',		2:'Pilnych',			3:'Wachtlijst',			4:'Warteliste',				5:'Lista d\'attesa',			6:'Lista de espera', 		7:'Em espera'			};
C_XL.d['on standby list']	= { 0:'on standby list',	1:'sur liste d\'attente',	2:'na liście gotowości',3:'op de wachtlijst',	4:'in der Standby-Liste',	5:'in lista di attesa',			6:'en lista de espera',  	7:'na lista de espera'	};
C_XL.d['continued']			= { 0:'Continued',			1:'Suite',					2:'Nieprzerwany',		3:'Vervolgd',			4:'Fortgesetzt',			5:'Seguito',					6:'Continuación', 			7:'Seguinte'			};
C_XL.d['excp']				= { 0:'Exceptional',		1:'Exceptionnel',			2:'Wyjątkowy',			3:'Uitzonderlijk',		4:'außergewöhnlich',		5:'Eccezionale',				6:'Excepcional', 			7:'Excecional'			};
C_XL.d['overdays']			= { 0:'Over days',			1:'Fil des jours',			2:'Przez dni',			3:'Meer dan dagen',		4:'Über mehrere Tage',		5:'Svolgimento giorni',			6:'Día a día', 				7:'Decurso do dia'		};
C_XL.d['aggregate'] 		= { 0:'collate',			1:'grouper',				2:'grupowe',			3:'groeperen',			4:'gruppieren',				5:'raggruppare',				6:'agrupar', 				7:'reagrupar'			};
C_XL.d['more options'] 		= { 0:'more options',		1:'plus d\'options',		2:'więcej opcji',		3:'meer opties',		4:'Mehr Optionen',			5:'più opzioni',				6:'mas opcione', 			7:'mais opções'			};


C_XL.d['search excp'] = { 0:'Include exceptional workhours',		
						1:'Inclure les plages de travail exceptionnelles',	
						2:'Wyjątkowa pracy zawarte',	
						3:'Uitzonderlijke werktijden inbegrepen',	
						4:'Einschließlich außergewöhnlicher Arbeitsstunden',	
						5:'Includere i turni di lavoro eccezionali',	
						6:'Incluir los turnos de trabajo excepcionales', 
						7:'Incluem os turnos de trabalho excecionais' 		};
						
C_XL.d['search overdays']	= { 0:'Worktime can span over days',
								1:'La prestation peut s\'étendre sur plusieurs jours',
								2:'Czas pracy może rozciągać się na dniach',
								3:'Werktijd kan overspannen over dagen',
								4:'Die Leistung kann über mehrere Tage erbracht werden',	
								5:'La prestazione può svolgersi su vari giorni',	
								6:'La prestación se puede desarrollar durante varios días', 
								7:'a prestação pode estender-se ao longo de vários dias' };


C_XL.d['use standby list']	= { 0:'Use the standby list',		1:'Utiliser la liste d\'attente',	2:'Lista pogotowia',			3:'Wachtlijst gebruiken',				4:'Warteliste nutzen',			5:'Usare la lista d\'attesa',	6:'Utilizar la lista de espera', 	7:'Usar a lista de espera'	};
C_XL.d['account usenotes']	= { 0:'Make use of day notes',		1:'Faire usage de notes du jour',	2:'Wykorzystać dzień notatek',	3:'Maak gebruik van de dag notities',	4:'Tagesnotizen nutzen',		5:'Usare le note del giorno',	6:'Utilizar las notas del día', 	7:'Fazer uso das notas do dia'	};
C_XL.d['account usetasks']	= { 0:'Make use of a task list',	1:'Utiliser une liste de tâches',	2:'Skorzystaj z listy zadań',	3:'Maak gebruik van een takenlijst',	4:'aufgabenliste nutzen',		5:'Usare una lista di attività',6:'Utilizar una lista de tareas', 	7:'Usar uma lista de tarefas'	};
C_XL.d['account usefiles']	= { 0:'Use visitors files',			1:'Utiliser le dossier visiteurs',	2:'Goście korzystać z plików',	3:'Bezoekers bestand gebruiken',		4:'Besucherdateien nutzen',		5:'Usare il file visitatore',	6:'Utilizar el archivo visitantes', 7:'Usar o registo de visitantes'	};
C_XL.d['account usechat']	= { 0:'Use instant messaging',		1:'Utiliser la messagerie',			2:'Skorzystaj z czatu',			3:'Instant messaging gebruiken',		4:'Kurzmitteilungen nutzen',	5:'Usare la funzione messaggi',	6:'Utilizar la mensajería', 		7:'Usar o serviço de mensagens'	};
C_XL.d['properties']		= { 0:'Properties',					1:'Propriétés',						2:'Ustawienia',					3:'Eigenaardigheden',					4:'Eigenschaften',				5:'Proprietà',					6:'Propriedades', 					7:'Propriedades'	};

C_XL.d['log me in'] 		= { 0:'log me in', 					1:'me connecter', 					2:'zalogować się', 				3:'inloggen', 				4:'einloggen ', 					5:'accedere', 						6:'conectarse', 				7:'entrar' 			};
C_XL.d['sessions']			= { 0:'Sessions',					1:'Sessions',						2:'Sesje',						3:'Sessies',				4:'Sitzung',						5:'Sessioni',						6:'Sesión', 					7:'Sessões'			}; 
C_XL.d['guests']			= { 0:'Guests',						1:'Invités',						2:'Gości',						3:'Gasten',					4:'Besucher',						5:'Ospiti',							6:'Invitados', 					7:'Convidados'		}; 
C_XL.d['logged in']			= { 0:'Logged in',					1:'Connecté',						2:'Zalogowany',					3:'Ingelogd',				4:'Eingeloggt',						5:'Connesso',						6:'Conectado', 					7:'Ligado'				}; 
C_XL.d['logout current']	= { 0:'Close this session',			1:'Fermer cette session',			2:'Zamknij sesję',				3:'Sluit deze sessie',		4:'Diese Sitzung schließen',		5:'Chiudere questa sessione',		6:'Cerrar esta sesión', 		7:'Encerrar esta sessão'	}; 
C_XL.d['logout all']		= { 0:'Close all sessions',			1:'Fermer toutes les sessions',		2:'Zamknij wszystkie sesje',	3:'Sluit alle sessies',		4:'alle Sitzungen schließen',		5:'Chiudere tutte le sessioni',		6:'Cerrar todas las sesiones', 	7:'Fechar todas as sessões'	}; 
C_XL.d['more login']		= { 0:'Open an additional session',	1:'Ouvrir une session supplémentaire',	2:'Otwórz dodatkową sesję',	3:'Open een extra sessie',	4:'Eine weitere Sitzung öffnen',	5:'aprire un\'ulteriore sessione',	6:'abrir una sesión adicional', 7:'abrir uma sessão adicional'	}; 
C_XL.d['new account'] 		= { 0:'New account',				1:'Nouveau compte',					2:'Nowe konto',					3:'Nieuw account',			4:'Neues Konto',					5:'Nuovo conto',					6:'Nueva cuenta', 				7:'Nova conta'	}; 
C_XL.d['options']			= { 0:'Options',					1:'Options',						2:'Opcje',						3:'Opties',					4:'Optionen',						5:'Opzioni',						6:'Opciones', 					7:'Opções'	}; 
C_XL.d['other options']		= { 0:'Other options:',				1:'autres options:',				2:'Inne opcje:',				3:'andere opties:',			4:'Weitere Optionen',				5:'altre opzioni',					6:'Otras opciones', 			7:'Outras opções:'	}; 
C_XL.d['access level']		= { 0:'access level',				1:'Niveau d\'accès',				2:'Poziom dostępu',				3:'Toegang niveau',			4:'Zugriffsstufe',					5:'Livello d\'accesso',				6:'Nivel de acceso', 			7:'nível de acesso'	}; 


C_XL.d['sync cronofy']		= { 0:'Links with Google, Apple or Microsoft',	1:'Liens avec Google, Apple ou Outlook',		2:'Połącz z Google, Apple lub Microsoft',	3:'Linken met Google, Apple or Microsoft',			4:'Linken mit Google, Apple oder Microsoft',		5:'Collegamento con Google, Apple o Microsoft',	6:'Enlaces con Google, Apple o Microsoft', 7:'Link com Google, Apple ou Microsoft'	}; 
C_XL.d['switch to session'] = { 0:'Switch to another session:',	1:'Passer sur une autre session:',	2:'Przełącz się do innej sesji:',	3:'Overschakelen naar een andere sessie:',	4:'Zu einer anderen Sitzung wechseln',	5:'Passare ad un\’altra sessione',	6:'Pasar a otra sesión', 7:'Mudar para outra sessão:'	}; 
C_XL.d['switch to account'] = { 0:'Switch to another account:',	1:'Passer sur une autre compte:',	2:'Przełącz się do innego konta:',	3:'Overschakelen naar een andere account:',	4:'Zu einem anderen Konto wechseln',	5:'Passare su un altro conto',		6:'Pasar a otra cuenta', 7:'Mudar para uma conta diferente:'	}; 
		
	
C_XL.d['disable tips']		= { 0:'Disable info-tips',		1:'Désactiver les info-tips',	2:'Wyłącz żółte wskazówki',		3:'Schakel info-tips uit',	4:'Deaktivieren Sie die info-Spitzen',5:'Disabilita le info-punte',		6:'Deshabilitar info-puntas', 			7:'Desativar info-dicas'		};
C_XL.d['hide section']		= { 0:'Hide this section',		1:'Cacher cette section',		2:'Ukryj tę sekcję',			3:'Verberg deze sectie',	4:'Diese Sitzung ausblenden',		5:'Occultare questa sezione',		6:'Ocultar esta sección', 				7:'Ocultar esta secção'			};
C_XL.d['hide offdays']		= { 0:'Hide absents',			1:'Cacher les absents',			2:'Ukryć braku liczba',			3:'Verberg afwezigen',		4:'Nichterscheinungen ausblenden',	5:'Occultare assenti',				6:'Ocultar los ausentes', 				7:'Esconder os ausentes'		};
C_XL.d['timeboxing labels']	= { 0:'Timeboxing labels',		1:'Libellés des blocs horaire',	2:'Nazwy pól czasu',			3:'Namen van tijd boxen',	4:'Titel der Zeitfenster',			5:'Formulazione dei blocchi orari',	6:'Enunciado de las bandas horarias', 	7:'Rótulos dos blocos horários'	};
C_XL.d['adaptative scale']	= { 0:'adaptative scale',		1:'Echelle adaptative',			2:'adaptacyjny skalę',			3:'adaptative schaal',		4:'anpassungsfähige Skala',			5:'Scala adattativa',				6:'Escala adaptativa', 					7:'Escala adaptativa'			};
C_XL.d['hide search']		= { 0:'Hide search assistant',	1:'Cacher l\'assistant de recherche',	2:'Ukryj asystenta wyszukiwania',	3:'Zoekassistent verbergen',	4:'Suchassistent ausblenden',	5:'Nascondi assistente di ricerca',	6:'Ocultar asistente de búsqueda', 		7:'Ocultar assistente de pesquisa'	};
C_XL.d['show empty tboxes']	= { 0:'Show empty timeboxes',	1:'Montrer les bloc horaires vides',	2:'Pokaż puste timeboxes',			3:'Toon lege tijdsblokken',		4:'Leere Zeitfenster anzeigen',	5:'Mostrarei blocchi orari vuoti',	6:'Mostrar las bandas horarias vacías', 7:'Mostrar o bloco de horas vazias'	};

C_XL.d['adapt scale tip']   = { 0:'The displayed time range is limited by the hourly settings',	
								1:'La plage horaire affichée est limitée par le réglage de l\'horaire',	
								2:'Wyświetlane okres czasu jest określona przez ustawienia harmonogramu',
								3:'De weergegeven tijdspan wordt bepaald door de instellingen van de uurrooster',
								4:'Das angezeigte Zeitfenster wird von den Stundenplaneinstellungen begrenzt',	
								5:'La fascia oraria mostrata è limitata dall\'impostazione del orario',	
								6:'La banda horaria mostrada está limitada por la configuración del horario', 
								7:'O intervalo horário mostrado é limitado pela configuração do horário' 	};

							
C_XL.d['display details']	= { 0:'Display details',	1:'Détails d\'affichage',	2:'Pokaż szczegóły',		3:'Weergavedetails',		4:'ansichtsinformationen',	5:'Dettagli di visualizzazione',	6:'Detalles de visualización', 	7:'Detalhes da visualização'	};
C_XL.d['display options']	= { 0:'Display options',	1:'Options d\'affichage',	2:'opcje wyświetlania',		3:'weergaveopties',			4:'anzeigeoptionen',		5:'Opzioni di visualizzazione',		6:'opciones de visualización', 	7:'opções da visualização'		};
C_XL.d['display order']		= { 0:'Display order',		1:'Ordre d\'affichage',		2:'Kolejność wyświetlania',	3:'Weergavevolgorde',		4:'ansicht',				5:'Ordine di visualizzazione',		6:'Orden de visualización', 	7:'Ordem da visualização'		};
C_XL.d['vertical view']		= { 0:'Vertical view',		1:'Vue verticale',			2:'Widok pionowy',			3:'Verticale weergave',		4:'ansichtsordnung',		5:'Vista verticale',				6:'Visualización vertical', 	7:'Exibição vertical'			};
C_XL.d['horizontal view']	= { 0:'Horizontal view',	1:'Vue horizontale',		2:'Widok poziomy',			3:'Horizontale weergave',	4:'Horizontale Ansicht',	5:'Vista orizzontale',				6:'Visualización horizontal', 	7:'Exibição horizontal'			};
C_XL.d['list view']			= { 0:'List view',			1:'Vue en liste',			2:'Widok listy',			3:'Lijstweergave',			4:'Listenanzeige',			5:'Vista in lista',					6:'Visualización en lista', 	7:'Exibição em lista'			};
C_XL.d['miscellaneous']		= { 0:'Miscellaneous',		1:'autres options',			2:'Różny',					3:'anderen opties',			4:'Sonstige Optionen',		5:'altre opzioni',					6:'Otras opciones', 			7:'Outras opções'				};

C_XL.d['applicable 4 users']= { 0:'Changes will apply for following users:',			
								1:'Les changements s\'apliqueront pour les utilisateurs suivant:',			
								2:'Zmiany będą miały zastosowanie do następujących użytkowników:',	
								3:'Wijzigingen van toepassing voor volgende gebruikers:',
								4:'Änderungen werden auf folgende Nutzer angewendet',	
								5:'I cambiamenti si applicheranno per i seguenti utenti',	
								6:'Los cambios se aplicaran para los usuarios siguientes', 
								7:'as alterações aplicar-se-ão aos seguintes utilizadores:' };

	// person coordinates
// 		technical 				english:0,				french:1,				polish:2,				dutch:3,					german:4,				italian:5,				spanish:6,			portuguese:7

C_XL.d['vip'] 				= { 0:'VIP',				1:'VIP',				2:'VIP',				3:'VIP',					4:'VIP',				5:'VIP',				6:'VIP', 			7:'VIP'	};
C_XL.d['company'] 			= { 0:'Company',			1:'Entreprise',			2:'Firma',				3:'Firma',					4:'Firma',				5:'azienda',			6:'Empresa', 		7:'Empresa'	};
C_XL.d['gender'] 			= { 0:'Title',				1:'Civ.',				2:'Godność',			3:'Gesl.',					4:'anspr.',				5:'Titolo',				6:'Tratamiento', 	7:'Forma de tratamento'	};
C_XL.d['sex'] 				= { 0:'Sex',				1:'Sexe',				2:'Seks',				3:'Geslacht',				4:'Geschlecht',			5:'Genero',				6:'Género', 		7:'Género'	};
C_XL.d['firstname'] 		= { 0:'First name',			1:'Prénom',				2:'Imię',				3:'Voornaam',				4:'Vorname',			5:'Nome',				6:'Nombre', 		7:'Nome'	};
C_XL.d['lastname'] 			= { 0:'Last name',			1:'Nom',				2:'Nazwisko',			3:'Naam',					4:'Nachname',			5:'Cognome',			6:'apellido', 		7:'apelido'	};
C_XL.d['residence'] 		= { 0:'Residence',			1:'Résidence',			2:'Rezydencja',			3:'Residentie',				4:'Wohnsitz',			5:'Residenza',			6:'Residencia', 	7:'Residência'	};
C_XL.d['address'] 			= { 0:'address',			1:'adresse',			2:'adres',				3:'adres',					4:'adresse',			5:'Indirizzo',			6:'Dirección', 		7:'Morada'	};
C_XL.d['zipCode'] 			= { 0:'Zip code',			1:'Code postal',		2:'Kod pocztowy',		3:'Postcode',				4:'Postleitzahl',		5:'Codice postale',		6:'Código postal', 	7:'Código postal'	};
C_XL.d['no address'] 		= { 0:'No address',			1:'pas d\'adresse',		2:'Brak adresu',		3:'geen adres',				4:'Keine Adresse',		5:'Nessun indirizzo',	6:'Sin direccion', 	7:'Sem endereço'	};

C_XL.d['name'] 				= { 0:'name',				1:'nom',				2:'nazwa',				3:'naam',					4:'Name',				5:'nome',				6:'nombre', 		7:'nome'	};
C_XL.d['names'] 			= { 0:'names',				1:'noms',				2:'nazwy',				3:'namen',					4:'Namen',				5:'nomi',				6:'nombres', 		7:'nomes'	};
C_XL.d['identification'] 	= { 0:'Identification',		1:'Identification',		2:'Identyfikacja',		3:'Identificatie',			4:'Identifizierung',	5:'Identificazione',	6:'Identificación', 7:'Identificação'	};

C_XL.d['city'] 				= { 0:'City',				1:'Ville',				2:'Miejscowość',		3:'Stad',					4:'Stadt',				5:'Città',				6:'Ciudad', 		7:'Localidade'	};
C_XL.d['country'] 			= { 0:'Country',			1:'Pays',				2:'Województwo',		3:'Land',					4:'Land',				5:'Paese',				6:'País', 			7:'País'		};
C_XL.d['email'] 			= { 0:'e-mail',				1:'e-mail',				2:'e-mail',				3:'e-mail',					4:'e-mail',				5:'e-mail',				6:'e-mail', 		7:'e-mail'		};
C_XL.d['emails'] 			= { 0:'e-mails',			1:'e-mails',			2:'e-mails',			3:'e-mails',				4:'e-mails',			5:'e-mails',			6:'e-mails', 		7:'e-mails'		};
C_XL.d['no email'] 			= { 0:'Has no e-mail',		1:'N\'a pas d\'e-mail',	2:'Nie e-mail',			3:'Heeft geen e-mail',		4:'Hat keine E-mail',	5:'Non ha email',		6:'No tiene email', 7:'Não tem e-mail'	};

C_XL.d['mobile'] 			= { 0:'Mobile number',		1:'Portable',			2:'Komórkowy',			3:'GSM',					4:'Mobilnummer',		5:'Cellulare',			6:'Móvil', 					7:'Telemóvel'		};
C_XL.d['no mobile'] 		= { 0:'No mobile number',	1:'Pas de portable',	2:'Brak telefonu komórkowego',3:'Geen GSM nummer',	4:'Kein Mobilnummer',	5:'Niente cellulare',	6:'Sin móvil', 				7:'Sem telemóvel'	};
C_XL.d['with mobile']		= { 0:'With mobile',		1:'avec portable',		2:'z GSM',				3:'met GSM',				4:'mit Mobil',			5:'Con cellulare',		6:'Con móvil', 				7:'Com telemóvel'	};
C_XL.d['phone'] 			= { 0:'Phone number',		1:'Téléphone',			2:'Telefon',			3:'Telefoon',				4:'Telefon',			5:'Telefono',			6:'Teléfono', 				7:'Telefone'		};
C_XL.d['no phone'] 			= { 0:'no phone number',	1:'Pas de téléphone',	2:'brak telefonu',		3:'Geen telefoon nummer',	4:'Kein Handy',			5:'Nessun telefono',	6:'Sin teléfono', 			7:'Sem telefone'	};
C_XL.d['language'] 			= { 0:'Language',			1:'Langue',				2:'Język',				3:'Taal',					4:'Sprache',			5:'Lingua',				6:'Idioma', 				7:'Idioma'		};
C_XL.d['birthdate'] 		= { 0:'Birthdate',			1:'Naissance',			2:'Data urodzenia',		3:'Geboortedatum',			4:'Geburtsdatum',		5:'Data di nascita',	6:'Fecha de nacimiento', 	7:'Nascimento'	};
C_XL.d['registration'] 		= { 0:'Registration',		1:'Matricule',			2:'Znaczek',			3:'Register',				4:'Registrierung',		5:'Matricola',			6:'Matrícula', 				7:'Matrícula'	};
C_XL.d['reference'] 		= { 0:'Reference',			1:'Référence',			2:'Odniesienie',		3:'Referentie',				4:'Referenz',			5:'Riferimento',		6:'Referencia', 			7:'Referência'	};
C_XL.d['cssColor'] 			= { 0:'Color',				1:'Couleur',			2:'Kolor',				3:'Kleur',					4:'Farbe',				5:'Colore',				6:'Color', 					7:'Cor'			};
C_XL.d['cssPattern'] 		= { 0:'Status',				1:'Statut',				2:'Status',				3:'Status',					4:'Status',				5:'Status',				6:'Estado', 				7:'Estado'		};

C_XL.d['references'] 		= { 0:'References',			1:'Références',			2:'Referencje',			3:'Referenties',			4:'Referenzen',			5:'Riferimenti',		6:'Referencias', 	7:'Referências'	};
C_XL.d['coordinates'] 		= { 0:'Coordinates',		1:'Coordonnées',		2:'Dane kontaktowe',	3:'Coördinaten',			4:'Daten',				5:'Dati',				6:'Datos', 			7:'Dados'		};
C_XL.d['prev apps'] 		= { 0:'Previous',			1:'Passés',				2:'Poprzednie wizyty',	3:'Verleden',				4:'Vorherige',			5:'Passati',			6:'Pasados', 		7:'Passados'	};
C_XL.d['next apps'] 		= { 0:'Planned',			1:'Planifiés',			2:'Zaplanowane wizyty',	3:'Toekomstige',			4:'Geplante',			5:'Pianificati',		6:'Planeados', 		7:'Planeados'	};

C_XL.d['add column'] 		= { 0:'Display also',		1:'afficher aussi',		2:'Zobacz jako',		3:'Ook tonen',				4:'auch anzeigen',	5:'Mostare anche',			6:'Mostrar también', 		7:'Mostrar também'	};
C_XL.d['remove column'] 	= { 0:'Do not display',		1:'Ne pas afficher',	2:'Nie pokazuj',		3:'Niet meer tonen',		4:'Nicht anzeigen',	5:'Non mostrare',			6:'No mostrar', 			7:'Não mostrar'	};
C_XL.d['sort on'] 			= { 0:'Sort on',			1:'Trier sur',			2:'Sortuj',				3:'Sorteren op',			4:'Sortieren nach',	5:'Filtrare',				6:'Filtrar por', 			7:'Filtrar por'	};
C_XL.d['file format']		= { 0:'File format',		1:'Format du fichier',	2:'Format plików',		3:'Bestandsformaat',		4:'Dateiformat',	5:'Formato del file',		6:'Formato del archivo', 	7:'Formato do ficheiro'	};
	
C_XL.d['reservations']		= { 0:'Reservations',			1:'Reservations',			2:'Rezerwacje',		3:'Reserveringen',		4:'Reservierungen',				5:'Prenotazioni',			6:'Reservas', 				7:'Reservas'			};
C_XL.d['booking code']		= { 0:'booking code',			1:'code de réservation',	2:'kod rezerwacji',	3:'boekingscode',		4:'Buchungscode',				5:'codice di prenotazione',	6:'código de reserva', 		7:'código de reserva'	};
C_XL.d['version']			= { 0:'version',				1:'version',				2:'wersja',			3:'versie',				4:'ausführung',					5:'versione',				6:'versión', 				7:'versão'				};
C_XL.d['appointments']		= { 0:'appointments',			1:'rendez-vous',			2:'nominacje',		3:'afspraken',			4:'termine',					5:'appuntamenti',			6:'citas', 					7:'compromissos'		};
C_XL.d['optional resa']		= { 0:'Optional reservations',	1:'Réservation optionelle',	2:'Rezerwacje',		3:'optionele reserveringen',4:'Optionale Reservierungen',5:'Prenotazioni opzionali',	6:'Reservas opcionales', 	7:'Reserva opcional'	};
C_XL.d['communication']		= { 0:'Communication',			1:'Communication',			2:'Komunikat',		3:'Communicatie',		4:'Kommunikation',				5:'Comunicazione',			6:'Comunicación', 			7:'Comunicação'			};
C_XL.d['agenda']			= { 0:'agenda',					1:'agenda',					2:'programie',		3:'agenda',				4:'Tagesordnung',				5:'agenda',					6:'agenda', 				7:'agenda'			};
C_XL.d['calendar']			= { 0:'Calendar',				1:'Calendrier',				2:'kalendarz',		3:'Kalender',			4:'Kalender',					5:'Calendario',				6:'Calendario', 			7:'Cronograma'			};
C_XL.d['calendars']			= { 0:'Calendars',				1:'Calendriers',			2:'kalendarze',		3:'Kalenders',			4:'Kalender',					5:'Calendari',				6:'Calendarios', 			7:'Calendários'			};
C_XL.d['preferences']		= { 0:'Preferences',			1:'Préferences',			2:'preferencje',	3:'Voorkeuren',			4:'Präferenzen',				5:'Preferenze',				6:'Preferencias', 			7:'Preferências'		};
C_XL.d['newvisitor']		= { 0:'New visitor',			1:'Nouveau visitor',		2:'Nowy visitor',	3:'Nieuwe visitor',		4:'Neuer Besucher',				5:'Nuovo visitatore',		6:'Nuevo visitante', 		7:'Novo visitante'		};
C_XL.d['vduplicate']		= { 0:'Duplicate',				1:'Doublon',				2:'Duplikat',		3:'Duplicaat',			4:'Duplikat',					5:'Doppione',				6:'Duplicado', 				7:'Repetição'			};
C_XL.d['audit']				= { 0:'Tracking',				1:'audit',					2:'audyt',			3:'Opvolging',			4:'audit',						5:'audit',					6:'auditoría', 				7:'auditoria'			};
C_XL.d['sections']			= { 0:'Sections',				1:'Sections',				2:'Sekcje',			3:'Secties',			4:'Bereiche',					5:'Sezioni',				6:'Secciones', 				7:'Secções'				};

// 		technical 				english:0,				french:1,					polish:2,					dutch:3,					german:4,					italian:5,						spanish:6,				portuguese:7

C_XL.d['new reservation']	= { 0:'New appointement',	1:'Nouvelle réservation',	2:'Nowa rezerwacja',		3:'Nieuwe reservering',		4:'Neue Reservierung',			5:'Nuova prenotazione',		6:'Nueva reserva', 		7:'Nova reserva'		};
C_XL.d['no reservation']	= { 0:'No appointement',	1:'Pas de réservation',		2:'Nie powołanie',			3:'Geen reservering',		4:'Keine Reservierungen',		5:'Nessuna prenotazione',	6:'Ninguna reserva', 	7:'Sem reserva'			};
C_XL.d['reservation']		= { 0:'appointement',		1:'Réservation',			2:'rezerwacja',				3:'Reservering',			4:'Reservierung',				5:'Prenotazione',			6:'Reserva', 			7:'Reserva'				};
C_XL.d['linked resa']		= { 0:'Linked appointement',1:'Réservation associée',	2:'Rezerwacja związane',	3:'Verbonden reservering',	4:'Verbundene Reservierung',	5:'Prenotazione associata',	6:'Reserva asociada', 	7:'Reserva associada'	};
C_XL.d['appointment']		= { 0:'appointement',		1:'Rendez-vous',			2:'Wizyta',					3:'afspraak',				4:'Termin',						5:'appuntamento',			6:'Cita', 				7:'Compromissos'		};
C_XL.d['event']				= { 0:'Unavailability',		1:'Indisponibilité',		2:'Brak wolnych terminów',	3:'Onbeschikbaarheid',		4:'Nichtverfügbarkeit',			5:'Indisponibilità',		6:'Indisponibilidad', 	7:'Indisponibilidade'	};
C_XL.d['assignment']		= { 0:'assignment',			1:'affectation',			2:'Cesja',					3:'Toewijzing',				4:'Zuweisung',					5:'affettazione',			6:'asignación', 		7:'afetação'			};
C_XL.d['tracking']			= { 0:'Reservation of',		1:'Réservation de',			2:'Rezerwacja zasobu',		3:'reservatie van',			4:'Reservierung von',			5:'Prenotazione di',		6:'Reserva de', 		7:'Reserva de'			};

C_XL.d['zoom']				= { 0:'Zoom in/out',	1:'Zoom in/out',		2:'Zoom in/out',		3:'Zoom in/out',			4:'Herein-/Herauszoomen',	5:'Zoom in/out',		6:'Zoom in/out', 			7:'Zoom in/out'	};
C_XL.d['hide/unhide']		= { 0:'Hide/unhide',	1:'Montrer/cacher',		2:'Hide/unhide',		3:'Tonen/verbergen',		4:'anzeigen/ausblenden',	5:'Mostrare/occultare',	6:'Mostrar/ocultar', 		7:'Mostrar/ocultar'	};
C_XL.d['calculator']		= { 0:'Calculator',		1:'Calculette',			2:'Kalkulator',			3:'Rekenmachine',			4:'Rechner',				5:'Calcolatrice',		6:'Calculadora', 			7:'Calculadora'	};
C_XL.d['choose name']		= { 0:'Choose a name',	1:'Choisissez un nom',	2:'Wybierz nazwę',		3:'Kies een naam',			4:'Namen auswählen',		5:'Scelga un nome',		6:'Escoja un nombre', 		7:'Escolha um apelido'	};

C_XL.d['none']				= { 0:'None',			1:'aucun',				2:'żaden',				3:'Geen',					4:'Kein',					5:'Nessuno',		6:'Ninguno', 			7:'Nenhum'	};
C_XL.d['none ff']			= { 0:'None',			1:'aucune',				2:'żaden',				3:'Geen',					4:'Keine',					5:'Nessuna',		6:'Ninguna', 			7:'Nenhuma'	};
C_XL.d['event']				= { 0:'Unavailability',	1:'Indisponibilité',	2:'Brak wolnych terminów',	3:'Onbeschikbaarheid',	4:'Nichtverfügbarkeit',		5:'Indisponibilità',6:'Indisponibilidad', 	7:'Indisponibilidade'	};
C_XL.d['default']			= { 0:'By default',		1:'Par défaut',			2:'Zaocznie',			3:'Bij verstek',			4:'Standard',				5:'Predefinito',	6:'Por defecto', 		7:'Predefinição'	};
	
C_XL.d['list screen']		= { 0:'List view',		1:'Vue en liste',		2:'Lista na dzień',		3:'Lijst zicht',		4:'Listenansicht',				5:'Vista in lista',			6:'Visualización en lista', 	7:'Exibição em lista'	};
C_XL.d['changes screen']	= { 0:'Daily changes',	1:'Mouvements',			2:'Dzienne zmiany',		3:'Veranderingen',		4:'Tägliche Änderungen',		5:'Movimenti giornalieri',	6:'Movimientos diarios', 		7:'Movimentos'	};
C_XL.d['week screen']		= { 0:'Week view',		1:'Vue de la semaine',	2:'Widok tygodnia',		3:'Week zicht',			4:'Wochenansicht',				5:'Vista settimanale',		6:'Visualización semanal', 		7:'Vista semanal'	};
C_XL.d['standard screen']	= { 0:'Standard view',	1:'Vue standard',		2:'Widok standardowy',	3:'Standaard weergave',	4:'Standardansicht',			5:'Vista standard',			6:'Visualización estándar', 	7:'Vista padrão'	};

C_XL.d['pause']				= { 0:'Break',			1:'Pause',				2:'Pauza',				3:'Pause',				4:'Pause',						5:'Pausa',			6:'Pausa', 			7:'Pausa'	};
C_XL.d['overlap']			= { 0:'Overlap',		1:'Chevauchement',		2:'Zakładka',			3:'Kruising',			4:'Überschneidung',				5:'accavallamento',	6:'Superposición', 	7:'Sobreposição'	};

C_XL.d['details']			= { 0:'Details',		1:'Détails',			2:'Dodatkowe',			3:'Details',			4:'Details',					5:'Dettagli',	6:'Detalles', 		7:'Detalhes'	};
C_XL.d['definition']		= { 0:'Definition',		1:'Définition',			2:'Opisanie',			3:'Beschrijving',		4:'Definition',					5:'Definizione',6:'Definición', 	7:'Definição'	};
C_XL.d['users']				= { 0:'Users',			1:'Utilisateurs',		2:'Użytkownicy',		3:'Gebruikers',			4:'Nutzer',						5:'Utenti',		6:'Usuarios', 		7:'Utilizadores'	};
C_XL.d['usage']				= { 0:'Usage',			1:'Utilisation',		2:'Stosowanie',			3:'Gebruik',			4:'Nutzung',					5:'Utilizzo',	6:'Utilización', 	7:'Utilização'	};
C_XL.d['upper']				= { 0:'Upper',			1:'Monter',				2:'Do góry',			3:'Hoger',				4:'Obere',						5:'Salire',		6:'Subir', 			7:'Montar'	};
C_XL.d['lower']				= { 0:'Lower',			1:'Descendre',			2:'Do dołu',			3:'Lager',				4:'Untere',						5:'Scendere',	6:'Bajar', 			7:'Descer'	};
C_XL.d['add']				= { 0:'add',			1:'ajouter',			2:'Dodaj',				3:'Toevoegen',			4:'Hinzufügen',					5:'aggiungere',	6:'añadir', 		7:'adicionar'	};
C_XL.d['with']				= { 0:'with',			1:'avec',				2:'z',					3:'met',				4:'mit',						5:'con',		6:'con', 			7:'com'	};


C_XL.d['places']			= { 0:'Places',			1:'Endroits',			2:'Miejsca',			3:'Plaatsen',			4:'Orte',		5:'Luoghi',		6:'Lugares', 	7:'Locais'	};
C_XL.d['people']			= { 0:'People',			1:'Personnes',			2:'Ludzie',				3:'Mensen',				4:'Personen',	5:'Persone',	6:'Personas', 	7:'Pessoas'	};
C_XL.d['assets']			= { 0:'assets',			1:'Matériel',			2:'Majątek',			3:'activa',				4:'Material',	5:'Materiale',	6:'Material', 	7:'Material'	};
C_XL.d['miscel']			= { 0:'Miscellaneous',	1:'autres',				2:'Różny',				3:'Diversen',			4:'Sonstige',	5:'altri',		6:'Otros', 		7:'Outros'	};


// 		technical 				english:0,			french:1,				polish:2,				dutch:3,				german:4,			italian:5,				spanish:6,					portuguese:7

C_XL.d['resources']			= { 0:'Resources',		1:'Ressources',			2:'Zasoby',				3:'Resources',			4:'Ressourcen',		5:'Risorse',			6:'Recursos', 				7:'Recursos'		};
C_XL.d['workrooms']			= { 0:'Workrooms',		1:'Salles de travail',	2:'Pracownie',			3:'Werkzalen',			4:'arbeitsräume',	5:'Sale di lavoro',		6:'Espacios de trabajo', 	7:'Espaços de trabalho'	};
C_XL.d['workplaces']		= { 0:'Workplaces',		1:'Postes de travail',	2:'Stanowiska',			3:'Werkplaatsen',		4:'arbeitsorte',	5:'Spazi di lavoro',	6:'Estaciones de trabajo', 	7:'Estações de trabalho'	};
C_XL.d['classrooms']		= { 0:'Classrooms',		1:'Classes de cours',	2:'Sale lekcyjne',		3:'klaslokalen',		4:'Klassenräume',	5:'aule corsi',			6:'Clases de cursos', 		7:'Espaço de aulas'	};
C_XL.d['carerooms']			= { 0:'Care rooms',		1:'Salles de soin',		2:'Pokoje zabiegowe',	3:'Zorgkamers',			4:'Pflegeräume',	5:'Sale di trattamenti',6:'Salas de tratamientos', 	7:'Salas de tratamento'	};
C_XL.d['collaborators']		= { 0:'Collaborators',	1:'Collaborateurs',		2:'Pracownicy',			3:'Medewerkers',		4:'Mitarbeiter',	5:'Collaboratori',		6:'Colaboradores', 			7:'Colaboradores'	};
C_XL.d['assistants']		= { 0:'assistants',		1:'assistants',			2:'asystenci',			3:'assistenten',		4:'assistenten',	5:'assistenti',			6:'asistentes', 			7:'assistentes'		};
C_XL.d['rdoctors']			= { 0:'Doctors',		1:'Docteurs',			2:'Lekarze',			3:'artsen',				4:'Ärzte',			5:'Medici',				6:'Médicos', 				7:'Médicos'			};

// (*d01*)
C_XL.d['dentists']			= { 0:'dentists',		1:'dentistes',			2:'dentystami',			3:'tandartsen',			4:'Zahnärzte',		5:'dentisti',			6:'dentistas', 				7:'dentistas'	};
C_XL.d['salesmen']			= { 0:'salesmen',		1:'commerciaux',		2:'sprzedawcy',			3:'verkopers',			4:'Verkäufer',		5:'venditori',			6:'gente de ventas', 		7:'vendedores'	};
C_XL.d['teachers']			= { 0:'teachers',		1:'professeurs',		2:'nauczycielami',		3:'leraren',			4:'Lehrer',			5:'insegnanti',			6:'maestros', 				7:'professores'	};
C_XL.d['practitioners']		= { 0:'practitioners',	1:'praticiens',			2:'praktycy',			3:'behandelaar',		4:'Praktiker',		5:'praticante',			6:'practicante', 			7:'praticante'	};
C_XL.d['technicians']		= { 0:'Technicians',	1:'Techniciens',		2:'Techników',			3:'Technicussen',		4:'Techniker',		5:'Tecnici',			6:'Técnicos', 				7:'Técnicos'	};
C_XL.d['consultants']		= { 0:'Consultants',	1:'Consultants',		2:'Konsultanci',		3:'Consultants',		4:'Berater',		5:'Consulenti',			6:'Consultores', 			7:'Consultores'	};
C_XL.d['instructors']		= { 0:'Instructors',	1:'Moniteurs',			2:'Instruktorzy',		3:'Instructeurs',		4:'ausbilder',		5:'Istruttori',			6:'Instructores', 			7:'Monitores'	};
C_XL.d['experts']			= { 0:'Experts',		1:'Experts',			2:'Eksperci',			3:'Deskundigen',		4:'Experten',		5:'Periti',				6:'Peritos', 				7:'Peritos'		};
C_XL.d['equipments']		= { 0:'Equipments',		1:'Equipements',		2:'Urządzenia',			3:'apparaten',			4:'Geräte',			5:'attrezzature',		6:'Equipamientos', 			7:'Equipamentos'};
C_XL.d['offices']			= { 0:'Offices',		1:'Bureaux',			2:'Biura',				3:'Kantoren',			4:'Büroräume',		5:'Uffici',				6:'Oficinas', 				7:'Secretárias'	};
C_XL.d['companies']			= { 0:'Companies',		1:'Entreprises',		2:'Firmy',				3:'Firmas',				4:'Firmen',			5:'aziende',			6:'Empresas', 				7:'Empresas'	};
C_XL.d['tools']				= { 0:'Tools',			1:'Outils',				2:'Narzędzia',			3:'Gereedschap',		4:'Instrumente',	5:'Utensili',			6:'Herramientas', 			7:'Ferramentas'	};
C_XL.d['cars']				= { 0:'Cars',			1:'Voitures',			2:'Samochody',			3:'autos',				4:'PKWs',			5:'automobili',			6:'Coches', 				7:'Carros'		};
C_XL.d['vehicules']			= { 0:'Vehicules',		1:'Véhicules',			2:'Pojazdów',			3:'Voertuigen',			4:'Fahrzeuge',		5:'Veicoli',			6:'Vehículos', 				7:'Veículos'	};
	
C_XL.d['resource']			= { 0:'resource',		1:'ressource',			2:'zasób',				3:'resource',			4:'Ressource',		5:'risorsa',			6:'recurso', 				7:'recurso'				};
C_XL.d['workroom']			= { 0:'workroom',		1:'salle de travail',	2:'pracownia',			3:'werkzaal',			4:'arbeitsraum',	5:'sala di lavoro',		6:'espacio de trabajo', 	7:'sala de trabalho'	};
C_XL.d['workplace']			= { 0:'workplace',		1:'poste de travail',	2:'pracy stacji',		3:'werkplaats',			4:'arbeitsort',		5:'spazio di lavoro',	6:'estación de trabajo', 	7:'posto de trabalho'	};
C_XL.d['classroom']			= { 0:'Classroom',		1:'classe de cours',	2:'klasa',				3:'klas',				4:'Klassenraum',	5:'aula corsi',			6:'clase de curso', 		7:'espaço de aulas'		};
C_XL.d['careroom']			= { 0:'care room',		1:'salle de soin',		2:'gabinet zabiegowy',	3:'zorgkamer',			4:'Pflegeraum',		5:'sala di trattamenti',6:'sala de tratamiento', 	7:'sala de tratamento'	};
C_XL.d['collaborator']		= { 0:'collaborator',	1:'collaborateur',		2:'współpracownik',		3:'medewerker',			4:'Mitarbeiter',	5:'collaboratore',		6:'colaborador', 			7:'colaborador'	};
C_XL.d['assistant']			= { 0:'assistant',		1:'assistant',			2:'asystent',			3:'assistent',			4:'assistent',		5:'assistente',			6:'asistente', 				7:'assistente'	};
C_XL.d['doctor']			= { 0:'doctor',			1:'docteur',			2:'lekarz',				3:'arts',				4:'arzt',			5:'medico',				6:'médico', 				7:'médico'		};

// (*d01*)
C_XL.d['dentist']			= { 0:'dentist',		1:'dentiste',			2:'dentystą',			3:'tandarts',			4:'Zahnarzt',		5:'dentista',			6:'dentista', 				7:'dentista'	};
C_XL.d['salesman']			= { 0:'salesman',		1:'vendeur',			2:'sprzedawcą',			3:'verkoper',			4:'Verkäufer',		5:'venditore',			6:'vendedor', 				7:'vendedor'	};
C_XL.d['teacher']			= { 0:'teacher',		1:'professeur',			2:'nauczycielem',		3:'leraar',				4:'Lehrer',			5:'insegnante',			6:'maestro', 				7:'professor'	};
C_XL.d['practitioner']		= { 0:'practitioner',	1:'praticien',			2:'terapeuta',			3:'behandelaars',		4:'Praktiker',		5:'praticanti',			6:'practicantes', 			7:'praticantes'	};
C_XL.d['technician']		= { 0:'technician',		1:'technicien',			2:'technik',			3:'technicus',			4:'Techniker',		5:'tecnico',			6:'técnico', 				7:'técnico'		};
C_XL.d['consultant']		= { 0:'consultant',		1:'consultant',			2:'konsultant',			3:'consultant',			4:'Berater',		5:'consulente',			6:'consultor', 				7:'consultor'	};
C_XL.d['instructor']		= { 0:'instructor',		1:'moniteur',			2:'instruktor',			3:'instructeur',		4:'ausbilder',		5:'istruttore',			6:'instructor', 			7:'monitor'		};
C_XL.d['expert']			= { 0:'expert',			1:'expert',				2:'ekspert',			3:'expert',				4:'Experte',		5:'perito',				6:'perito', 				7:'perito'		};
C_XL.d['equipment']			= { 0:'equipment',		1:'équipement',			2:'sprzęt',				3:'apparatuur',			4:'Geräte',			5:'attrezzature',		6:'equipamiento', 			7:'equipamento'	};
C_XL.d['office']			= { 0:'office',			1:'bureau',				2:'biuro',				3:'kantoor',			4:'Büro',			5:'ufficio',			6:'oficina', 				7:'secretária'	};
C_XL.d['tool']				= { 0:'tool',			1:'outil',				2:'narzędzie',			3:'gereedschap',		4:'Instrumente',	5:'utensile',			6:'herramienta', 			7:'ferramenta'	};
C_XL.d['car']				= { 0:'car',			1:'voiture',			2:'samochód',			3:'auto',				4:'PKW',			5:'auto',				6:'coche', 					7:'Carro'		};
C_XL.d['vehicule']			= { 0:'vehicule',		1:'véhicule',			2:'pojazd',				3:'voertuig',			4:'Fahrzeug',		5:'veicolo',			6:'vehículo', 				7:'Veículo'		};
	
C_XL.d['extend with']		= { 0:'Extend with',	1:'allonger de',		2:'Dłużej niż',			3:'Langer maken met',	4:'Erweitern mit',	5:'Prolungare di',	6:'Prolongar', 	7:'alongar'	};
C_XL.d['shorten with']  	= {	0:'Shorten with',	1:'Raccourcir de',		2:'Skrócony o',			3:'Inkorten met',		4:'Verkürzen mit',	5:'accorciare di',	6:'acortar', 	7:'Encurtar'	};
C_XL.d['reschedule']		= { 0:'Reschedule',		1:'Déplacer',			2:'Przełóż',			3:'Herschikken',		4:'Verlegen',		5:'Spostare',		6:'Mover', 		7:'Mover'	};
C_XL.d['automatic']			= { 0:'automatic',		1:'automatique',		2:'automatyczne',		3:'automatisch',		4:'automatisch',	5:'automatico',		6:'automático', 7:'automático'	};
	
C_XL.d['set sooner']		= { 0:'Set sooner',		1:'avancer',		2:'określonych wcześniej',	3:'Vroeger',			4:'Vorverlegen',	5:'anticipare',	6:'adelantar', 	7:'adiantar'	};	
C_XL.d['set later']			= { 0:'Delay',			1:'Retarder',			2:'później ustawić',	3:'Later',				4:'aufschieben',	5:'Posticipare',6:'atrasar', 	7:'atrasar'	};
C_XL.d['timing']			= { 0:'Timing',			1:'Timing',				2:'Czas',				3:'Tijdstip',			4:'Zeitpunkt',		5:'Timing',		6:'Plazo', 		7:'Timing'	};
C_XL.d['in total']			= { 0:'in total',		1:'au total',			2:'w sumie',			3:'in totaal',			4:'Insgesamt',		5:'in totale',	6:'en total', 	7:'no total'	};
C_XL.d['total']				= { 0:'total',			1:'total',				2:'sumie',				3:'totaal',				4:'Gesamt',			5:'totale',		6:'total', 		7:'total'	};
	
C_XL.d['registration']		= { 0:'Registration',	1:'Matricule',			2:'Znaczek',			3:'Register',			4:'Registrieren',	5:'Matricola',		6:'Matrícula', 		7:'Matrícula'	};
C_XL.d['attendance']		= { 0:'attendance',		1:'assignations',		2:'attendance',			3:'Toegewezen',			4:'Zuweisung',		5:'Convocazioni',	6:'asignaciones', 	7:'atribuições'	};

C_XL.d['reserved']			= { 0:'Reserved',		1:'Réservé',			2:'Zarezerwowany/a',	3:'Gereserveerd',		4:'Reserviert',		5:'Prenotato',	6:'Reservado', 			7:'Reservado'	};
C_XL.d['available']			= { 0:'available',		1:'Disponible',			2:'dostępny',			3:'beschikbaar',		4:'Verfügbar',		5:'Disponibile',6:'Disponible', 		7:'Disponível'	};
C_XL.d['day off']			= { 0:'Day Off',		1:'En congé',			2:'dzień wolny',		3:'Op verlof',			4:'Ruhetag',		5:'In ferie',	6:'Día de descanso', 	7:'De férias'	};
C_XL.d['off time']			= { 0:'Breaks',			1:'Congés',				2:'Wolny',				3:'Verlofdagen',		4:'Urlaub',			5:'Ferie',		6:'Vacaciones', 		7:'Férias'	};

C_XL.d['delete']			= { 0:'Delete',			1:'Supprimer',			2:'Skasuj',				3:'Verwijderen',		4:'Löschen',		5:'Eliminare',	 	6:'Eliminar', 		7:'Eliminar'	};
C_XL.d['save']				= { 0:'Save',			1:'Enregistrer',		2:'Zaoszczędzić',		3:'Opslaan',			4:'Speichern',		5:'Salvare',		6:'Guardar', 		7:'Guardar'		};
C_XL.d['confirm']			= { 0:'Confirm',		1:'Confirmer',			2:'Potwierdź',			3:'Bevestigen',			4:'Bestätigen',		5:'Confermare',		6:'Confirmar', 		7:'Confirmar'	};
C_XL.d['cancel']			= { 0:'Cancel',			1:'annuler',			2:'anulować',			3:'annuleren',			4:'abbrechen',		5:'Cancellare',		6:'Cancelar', 		7:'anular'	};
C_XL.d['close']				= { 0:'Close',			1:'Fermer',				2:'Blisko',				3:'Sluiten',			4:'Schließen',		5:'Chiudere',		6:'Cerrar', 		7:'Perto'	};
C_XL.d['replan']			= { 0:'Replan',			1:'Replanifier',		2:'Zaplanuj ponownie',	3:'Herplannen',			4:'Umplanen',		5:'Riprogrammare',	6:'Reprogramar', 	7:'Replanificar'	};
C_XL.d['duplicate']			= { 0:'Duplicate',		1:'Dupliquer',			2:'replikować',			3:'Repliceren',			4:'Duplizieren',	5:'Duplicare',		6:'Duplicar', 		7:'Duplicar'	};
C_XL.d['disabled']			= { 0:'Disabled',		1:'Désactivé',			2:'Wyłączony',			3:'Uit',				4:'Deaktviert',		5:'Disattivato',	6:'Desactivado', 	7:'Desativado'	};
C_XL.d['ready']				= { 0:'Ready',			1:'Préparé',			2:'Gotowy',				3:'Klaar',				4:'Bereit',			5:'Pronto',			6:'Listo', 			7:'Preparado'	};


C_XL.d['quit']				= { 0:'Close and cancel changes',1:'Quitter sans rien enregistrer',		2:'Zamknij',				3:'Sluiten zonder opslaan',				4:'Beenden',				5:'Lasciare senza salvare',					6:'Salir sin guardar', 					7:'Sair sem gravar'	};
C_XL.d['add visitor']		= { 0:'add selected visitor',	1:'ajouter le visiteur séléctionné',	2:'add visitor',			3:'Geselecteerde bezoeker bijvoegen',	4:'Besucher hinzufügen',	5:'aggiungere il visitatore selezionato',	6:'añadir el visitante seleccionado', 	7:'adicionar o visitante selecionado'	};
C_XL.d['car contract'] 		= { 0:'Car rental contract',	1:'Contrat de location voiture',		2:'Umowa najmu pojazdu',	3:'Vervangwagen huurcontract',			4:'Mietwagenvertrag',		5:'Contratto di noleggio macchina',			6:'Contrato de alquiler de coche ', 	7:'Contrato de locação de veículo'	};
C_XL.d['linked doc'] 		= { 0:'Linked document',		1:'Document relatif',					2:'Związany dokumentu',		3:'Gekoppelde document',				4:'Verknüpftes Dokument',	5:'Documento relativo',						6:'Documento relativo', 				7:'Documento relativo'	};
	
C_XL.d['extra space']		= { 0:'additional space',			1:'Espace supplémentaire',				2:'Dodatkowe miejsce',					3:'Extra ruimte',					4:'Zusätzlicher Raum',			5:'Spazio supplementare',				6:'Espacio adicional', 									7:'Espaço extra'	};
C_XL.d['has no mobile']		= { 0:'Has no mobile number',		1:'N\'a pas de numéro de portable',		2:'Nie ma numeru telefonu komórkowego',	3:'Heeft geen GSM nummer',			4:'Hat keine Mobilnummer',		5:'Non ha numero di cellulare',			6:'No tiene número de móvil', 						7:'Nenhum número de telemóvel'	};
C_XL.d['phone slicing']		= { 0:'Phone number hyphenation',	1:'Césure des numéros de téléphone',	2:'Podział numerów telefonicznych',		3:'afbreking van telefoonnummers',	4:'Trennung von Mobilnummern',	5:'Separazione dei numeri di telefono',	6:'Espacios entre los números de teléfono', 7:'Separação dos números de telefone'	};

// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7
	
C_XL.d['free']				= { 0:'Free',					1:'Libre',					2:'Wolny/a',					3:'Vrij',						4:'Frei',						5:'Libero',					6:'Libre', 						7:'Livre'	};
C_XL.d['hourly']			= { 0:'Hourly',					1:'Horaire',				2:'Slotów',						3:'Dienstregeling',				4:'Zeitplan',					5:'Orario',					6:'Horario', 					7:'Horário'	};
C_XL.d['hourlies']			= { 0:'Hourlies',				1:'Horaires',				2:'Godzinowy',					3:'Werkrooster',				4:'Zeitpläne',					5:'Orari',					6:'Horarios', 					7:'Horários'	};
C_XL.d['no hourly']			= { 0:'No hourly',				1:'Pas d\'horaire',			2:'Nie slotów',					3:'Geen dienstregeling',		4:'Kein Zeitplan',				5:'Senza orario',			6:'Sin horario', 				7:'Sem horário'	};
C_XL.d['change hourly']		= { 0:'Change hourly',			1:'Changer d\'horaire',		2:'Harmonogram zmian',			3:'Uurrooster veranderen',		4:'Zeitplan ändern',			5:'Cambiare orario',		6:'Cambiar horario', 			7:'Mudar o horário'	};
C_XL.d['back to hourly']	= { 0:'Return to hourly',		1:'Retour à l\'horaire',	2:'Powrócić do planowania',		3:'Terug naar uurrooster',		4:'Zurück zum Zeitplan',		5:'Ritorno all\'orario',	6:'Volver al horario', 			7:'Regressar ao horário'	};
C_XL.d['hourly change']		= { 0:'Hourly change',			1:'Changement d\'horaire',	2:'Zmiany harmonogramu',		3:'Verandering in uurrooster',	4:'Zeitplanänderung',			5:'Cambiamento di orario',	6:'Cambio de horario', 			7:'Mudança de horário'	};
C_XL.d['ex hourly change']	= { 0:'Only this ',				1:'Seulement ce ',			2:'Tylko w ',					3:'Enkel op ',					4:'Nur am',						5:'Solo questo',			6:'Solamente este', 			7:'apenas este '	};
C_XL.d['in this hourly']	= { 0:'in this hourly ',		1:'dans cet horaire',		2:'w niniejszym harmonogramie',	3:'in deze uurrooster',			4:'in diesem Zeitplan',			5:'in questo orario',		6:'En este horario', 			7:'neste horário'	};
C_XL.d['new hourly']		= { 0:'New hourly',				1:'Nouvel horaire',			2:'Nowy rozkład',				3:'Nieuwe uurrooster',			4:'Neuer Zeitplan',				5:'Nuovo orario',			6:'Nuevo horario', 				7:'Novo horário'	};
C_XL.d['reuse hourly']		= { 0:'Reuse a schedule',		1:'Réutiliser un horaire',	2:'Ponownie użyć harmonogramu',	3:'Hervat een uurrooster',		4:'Zeitplan wiederverwenden',	5:'Riutilizzare un orario',	6:'Reutilizar un horario', 		7:'Reutilizar um horário'	};
C_XL.d['hourly skip']		= { 0:'Schedule skip',			1:'Saut d\'horaire',		2:'Harmonogram kontynuować',	3:'Uurrooster doorgaan',		4:'Sprung einplanen',			5:'Salto orario',			6:'Saltar un horario', 			7:'Saltar horário'	};
C_XL.d['hourlies modif']	= { 0:'Hourlies modifications',	1:'Changements d\'horaire',	2:'Zmiany planu',				3:'Roosterwijzigingen',			4:'Zeitplanänderungen',			5:'Cambiamento orario',		6:'Cambio horario', 			7:'alterações ao horário'	};
C_XL.d['current schedule']	= { 0:'Current schedule',		1:'Horaire en cours',		2:'Obecny harmonogram',			3:'Huidige planning',			4:'aktueller Zeitplan',			5:'Orario in corso',		6:'Horario en curso', 			7:'Horário em curso'	};
C_XL.d['in current schedule']= { 0:'In current schedule',	1:'Dans l\'horaire en cours',	2:'W bieżącym planowaniu',	3:'In de huidige planning',		4:'Im aktuellen Zeitplan',		5:'Nell\'orario in corso',	6:'En el horario en curso', 	7:'No horário em curso'	};
C_XL.d['enters into force'] = { 0:'Enters into force on',	1:'Entre en vigueur le',		2:'Wchodzi w życie w dniu',	3:'Treedt in werking op',		4:'Tritt in Kraft am',			5:'Entra in vigore il',		6:'Entra en vigor el', 			7:'Entra em vigor a'	};
C_XL.d['entered into force'] = { 0:'Entered into force on',	1:'Entré en vigueur le',		2:'Wweszła w życie jest',	3:'In werking getreden op',		4:'In Kraft getreten am',		5:'Entrato in vigore il',	6:'Entrado en vigor el', 		7:'Entrou em vigor a'	};

C_XL.d['do not modify past hourlies'] = {
	0:'You can not modify hourlies in the past',
	1:'On ne peut pas modifier un horaire à une date passée',
	2:'Nie można zmienić harmonogram,	do daty w przeszłości',
	3:'U kunt een schema niet veranderen naar een datum in het verleden',
	4:'Änderungen an vergangenen Zeitplänen sind nicht möglich',
	5:'Non si può modificare un orario su una data passata',
	6:'No se puede modificar un horario en una fecha pasada',
	7:'Você não pode alterar uma agenda para uma data passada' }
	
C_XL.d['already an hourly change on date'] = {
	0:'There is already an hourly change on this date',
	1:'Il y a déjà un changement d\'horaire enregistré à cette date',
	2:'Jest już harmonogram zmiany rejestrowane w tym dniu',
	3:'Er is al een schema wijziging die op deze datum',
	4:'an diesem Tag gibt es bereits eine Zeitplanänderung',
	5:'È già stato registrato un cambiamento di orario su questa data',
	6:'Ya se guardó un cambio de horario en esta fecha',
	7:'Já há uma mudança de horário registada no mesmo dia' }
	

C_XL.d['remove from list']	= { 0:'Remove from list',			1:'Enlever de la liste',					2:'Usuń z listy',					3:'Uit de lijst halen',						4:'aus der Liste entfernen',			5:'Togliere dalla lista',					6:'Sacar de la lista', 				7:'Remover da lista'				};
C_XL.d['remove peer?']		= { 0:'Remove linked reservation?',	1:'Supprimer la réservation associée?',		2:'Usuń skojarzoną rezerwować?',	3:'Verwijder de bijbehorende reservering?',	4:'Verbundene Reservierung entfernen?',	5:'Eliminare la prenotazione associata?',	6:'Cancelar la reserva asociada?', 	7:'Eliminar a reserva associada?'	};



// tooltips for buttons
//
//
	var kb 		= '<span class="fa fa-13x fa-keyboard"></span>&nbsp;'; // keyboard symbol (does not translate) !! No translation on this line
	
	var sc 		= { 0:kb+'Shortcut key: ',	1:kb+'Raccourci clavier: ',	2:kb+'Skrót klawiaturowy: ',	3:kb+'Hotkey: ',	4:kb+'Tastenkombination: ',	5:kb+'Scorciatoia da tastiera: ',	6:kb+'Tecla de acceso directo: ',	7:kb+'Atalho de teclado: '	};
	
	var quit 	= { 0:'To quit mode press <strong>Esc</strong>',	
					1:'Pour sortir du mode: <strong>Esc</strong>',		
					2:'<strong>Esc</strong>: aby wyjść z trybu',		
					3:'<strong>Esc</strong> om te verlaten',	
					4:'<strong>Esc</strong> Taste drücken, um den Modus zu verlassen',
					5:'Per uscire dal modo: <strong>Esc</strong>',	
					6:'Para salir de este modo presiona: <strong>Esc</strong>',
					7:'Para sair do modo: <strong>Esc</strong>'
					};
					
	var nl = '<br/>'; // no translation on this line
	var pad = '&nbsp;&nbsp;&nbsp;&nbsp;'; // no translation on this line
	
	
C_XL.d['tip weekview'] = { 
	0:'<strong>Go to week view</strong>'								+nl+sc[0]+'<strong>F2</strong>',	
	1:'<strong>Passer sur la vue de la semaine</strong>'				+nl+sc[1]+'<strong>F2</strong>',	
	2:'<strong>Przejdź do widoku tygodnia</strong>'						+nl+sc[2]+'<strong>F2</strong>',	
	3:'<strong>Naar de week overzicht</strong>'							+nl+sc[3]+'<strong>F2</strong>',	
	4:'<strong>Zur Wochenansicht</strong>'								+nl+sc[4]+'<strong>F2</strong>',	
	5:'<strong>Passare alla visualizzazione della settimana</strong>'	+nl+sc[5]+'<strong>F2</strong>',
	6:'<strong>Pasar a la visualización de la semana</strong>'			+nl+sc[6]+'<strong>F2</strong>',
	7:'<strong>Ir para a vista da semana</strong>'						+nl+sc[7]+'<strong>F2</strong>'	};
		
C_XL.d['tip zoom'] = { 
	0:'<strong>Zoom in/out</strong>'			+nl+sc[0]+'<strong>Ctrl+Z</strong>',	
	1:'<strong>Zoom in/out</strong>'			+nl+sc[1]+'<strong>Ctrl+Z</strong>',	
	2:'<strong>Zoom in/out</strong>'			+nl+sc[2]+'<strong>Ctrl+Z</strong>',	
	3:'<strong>Zoom in/out</strong>'			+nl+sc[3]+'<strong>Ctrl+Z</strong>',	
	4:'<strong>Herein-/Herauszoomen</strong>'	+nl+sc[3]+'<strong>Ctrl+Z</strong>',	
	5:'<strong>Zoom in/out</strong>'			+nl+sc[5]+'<strong>Ctrl+Z</strong>',	
	6:'<strong>Zoom in/out</strong>'			+nl+sc[6]+'<strong>Ctrl+Z</strong>',
	7:'<strong>Zoom in/out</strong>'			+nl+sc[7]+'<strong>Ctrl+Z</strong>'	};
		
C_XL.d['tip searchview'] = { 
	0:'<strong>Search assistant</strong>'		+nl+sc[0]+'<strong>F1</strong>',	
	1:'<strong>Assistant de recherche</strong>'	+nl+sc[1]+'<strong>F1</strong>',	
	2:'<strong>Asystent wyszukiwania</strong>'	+nl+sc[2]+'<strong>F1</strong>',	
	3:'<strong>Zoek assistent</strong>'			+nl+sc[3]+'<strong>F1</strong>',	
	4:'<strong>Assistenten suchen</strong>'		+nl+sc[4]+'<strong>F1</strong>',
	5:'<strong>Assistente di ricerca</strong>'	+nl+sc[5]+'<strong>F1</strong>',	
	6:'<strong>Asistente de búsqueda</strong>'	+nl+sc[6]+'<strong>F1</strong>',
	7:'<strong>Assistente de pesquisa</strong>'	+nl+sc[7]+'<strong>F1</strong>'	};

C_XL.d['tip search'] = { 
	0:'<strong>Search availabilities</strong>'			+nl+sc[0]+'<strong>Ctrl+F</strong>',	
	1:'<strong>Rechercher les disponibilités</strong>'	+nl+sc[1]+'<strong>Ctrl+F</strong>',	
	2:'<strong>Szukaj podaży</strong>'					+nl+sc[2]+'<strong>Ctrl+F</strong>',	
	3:'<strong>Bekijk de beschikbaarheid</strong>'		+nl+sc[3]+'<strong>Ctrl+F</strong>',
	4:'<strong>Verfügbarkeiten suchen</strong>'			+nl+sc[4]+'<strong>Ctrl+F</strong>',	
	5:'<strong>Cercare disponibilità</strong>'			+nl+sc[5]+'<strong>Ctrl+F</strong>',	
	6:'<strong>Buscar disponibilidad</strong>'			+nl+sc[6]+'<strong>Ctrl+F</strong>',
	7:'<strong>Pesquisar as disponibilidades</strong>'	+nl+sc[7]+'<strong>Ctrl+F</strong>'	};
		
C_XL.d['tip exceptional'] = { 
	0:'<strong>Search for availabilities in exceptional hourly blocks</strong>',
	1:'<strong>Rechercher les disponibilités dans les périodes horaires exceptionnelles</strong>',	
	2:'<strong>Szukaj podaży w wyjątkowych blokach godzinowych</strong>',	
	3:'<strong>Zoeken naar beschikbaarheid in uitzonderlijke blokken van een uurooster</strong>',
	4:'<strong>Verfügbarkeiten in außergewöhnlichen Arbeitszeiten suchen</strong>',	
	5:'<strong>Cercare disponibilità nei blocchi orari eccezionali</strong>',	
	6:'<strong>Buscar disponibilidad en los horarios excepcionales</strong>',
	7:'<strong>Pesquisar as disponibilidades nos períodos horários extraordinários</strong>'	};
		
C_XL.d['tip aggregate'] = { 
	0:'<strong>Only the availabilities that collate appointments</strong>',
	1:'<strong>Seulement les disponibilités qui accollent les RDV</strong>',	
	2:'<strong>Tylko dostępność, która zestawia terminy</strong>',	
	3:'<strong>Alleen de beschikbaarheden die afspraken verzamelen</strong>',
	4:'<strong>Nur die Verfügbarkeiten, die Termine abgleichen</strong>',	
	5:'<strong>Solo le disponibilità che mettono insieme gli appuntamenti</strong>',	
	6:'<strong>Solo las disponibilidades que compaginan citas</strong>',
	7:'<strong>Apenas as disponibilidades que agrupam compromissos</strong>'	};
		
C_XL.d['tip waiting list'] = { 
	0:'<strong>Browse the waiting list</strong>'		+nl+sc[0]+'<strong>Ctrl+W</strong>',	
	1:'<strong>Parcourir la liste d\'attente</strong>'	+nl+sc[1]+'<strong>Ctrl+W</strong>',	
	2:'<strong>Przejrzyj listę oczekujących</strong>'	+nl+sc[2]+'<strong>Ctrl+W</strong>',	
	3:'<strong>Blader door de wachtlijst</strong>'		+nl+sc[3]+'<strong>Ctrl+W</strong>',
	4:'<strong>Warteliste durchsuchen</strong>'			+nl+sc[3]+'<strong>Ctrl+W</strong>',	
	5:'<strong>Esplorare la lista d\'attesa</strong>'	+nl+sc[5]+'<strong>Ctrl+W</strong>',	
	6:'<strong>Explorar la lista de espera</strong>'	+nl+sc[6]+'<strong>Ctrl+W</strong>',
	7:'<strong>Percorrer a lista de espera</strong>'	+nl+sc[7]+'<strong>Ctrl+W</strong>'	};
		
C_XL.d['tip replan'] = { 
	0:'<strong>Replan</strong>'				+nl+sc[0]+'<strong>Ctrl+R</strong>'+nl+quit[0],	
	1:'<strong>Replanifier</strong>'		+nl+sc[1]+'<strong>Ctrl+R</strong>'+nl+quit[1],	
	2:'<strong>Zaplanuj ponownie</strong>'	+nl+sc[2]+'<strong>Ctrl+R</strong>'+nl+quit[2],	
	3:'<strong>Herplannen</strong>'			+nl+sc[3]+'<strong>Ctrl+R</strong>'+nl+quit[3],	
	4:'<strong>Umplanen</strong>'			+nl+sc[4]+'<strong>Ctrl+R</strong>'+nl+quit[4],	
	5:'<strong>Repianificare</strong>'		+nl+sc[5]+'<strong>Ctrl+R</strong>'+nl+quit[5],		
	6:'<strong>Reprogramar</strong>'		+nl+sc[6]+'<strong>Ctrl+R</strong>'+nl+quit[6],
	7:'<strong>Replanificar</strong>'		+nl+sc[7]+'<strong>Ctrl+R</strong>'+nl+quit[7] };
		
C_XL.d['tip duplicate']	= { 
	0:'<strong>Duplicate</strong>'		+nl+sc[0]+'<strong>Ctrl+D</strong>'+nl+quit[0],	
	1:'<strong>Dupliquer</strong>'		+nl+sc[1]+'<strong>Ctrl+D</strong>'+nl+quit[1],	
	2:'<strong>Replikować</strong>'		+nl+sc[2]+'<strong>Ctrl+D</strong>'+nl+quit[2],	
	3:'<strong>Repliceren</strong>'		+nl+sc[3]+'<strong>Ctrl+D</strong>'+nl+quit[3],
	4:'<strong>Duplizieren</strong>'	+nl+sc[4]+'<strong>Ctrl+D</strong>'+nl+quit[4],	
	5:'<strong>Duplicare</strong>'		+nl+sc[5]+'<strong>Ctrl+D</strong>'+nl+quit[5],	
	6:'<strong>Duplicar</strong>'		+nl+sc[6]+'<strong>Ctrl+D</strong>'+nl+quit[6],
	7:'<strong>Duplicar</strong>'		+nl+sc[7]+'<strong>Ctrl+D</strong>'+nl+quit[7] };
		
C_XL.d['tip newnote']	= { 
	0:'<strong>New note</strong>'		+nl+sc[0]+'<strong>Ctrl+Alt+N</strong>',	
	1:'<strong>Nouvelle note</strong>'	+nl+sc[1]+'<strong>Ctrl+Alt+N</strong>',	
	2:'<strong>New note</strong>'		+nl+sc[2]+'<strong>Ctrl+Alt+N</strong>',	
	3:'<strong>Nieuwe nota</strong>'	+nl+sc[3]+'<strong>Ctrl+Alt+N</strong>',
	4:'<strong>New note</strong>'		+nl+sc[4]+'<strong>Ctrl+Alt+N</strong>',	
	5:'<strong>New note</strong>'		+nl+sc[5]+'<strong>Ctrl+Alt+N</strong>',	
	6:'<strong>Nueva nota</strong>'		+nl+sc[6]+'<strong>Ctrl+Alt+N</strong>',
	7:'<strong>New note</strong>'		+nl+sc[7]+'<strong>Ctrl+Alt+N</strong>' };
		
C_XL.d['tip newtask']	= { 
	0:'<strong>New task</strong>'		+nl+sc[0]+'<strong>Ctrl+Alt+T</strong>',	
	1:'<strong>Nouvelle tâche</strong>'	+nl+sc[1]+'<strong>Ctrl+Alt+T</strong>',	
	2:'<strong>New task</strong>'		+nl+sc[2]+'<strong>Ctrl+Alt+T</strong>',	
	3:'<strong>Nieuwe taak</strong>'	+nl+sc[3]+'<strong>Ctrl+Alt+T</strong>',
	4:'<strong>New task</strong>'		+nl+sc[4]+'<strong>Ctrl+Alt+T</strong>',	
	5:'<strong>New task</strong>'		+nl+sc[5]+'<strong>Ctrl+Alt+T</strong>',	
	6:'<strong>Nueva tarea</strong>'	+nl+sc[6]+'<strong>Ctrl+Alt+T</strong>',
	7:'<strong>New task</strong>'		+nl+sc[7]+'<strong>Ctrl+Alt+T</strong>' };
		
C_XL.d['tip newchat']	= { 
	0:'<strong>New chat</strong>'				+nl+sc[0]+'<strong>Ctrl+Alt+M</strong>',	
	1:'<strong>Nouvelle conversation</strong>'	+nl+sc[1]+'<strong>Ctrl+Alt+M</strong>',	
	2:'<strong>New chat</strong>'				+nl+sc[2]+'<strong>Ctrl+Alt+M</strong>',	
	3:'<strong>Nieuwe chat</strong>'			+nl+sc[3]+'<strong>Ctrl+Alt+M</strong>',
	4:'<strong>New chat</strong>'				+nl+sc[4]+'<strong>Ctrl+Alt+M</strong>',	
	5:'<strong>New chat</strong>'				+nl+sc[5]+'<strong>Ctrl+Alt+M</strong>',	
	6:'<strong>Nueva conversación</strong>'		+nl+sc[6]+'<strong>Ctrl+Alt+M</strong>',
	7:'<strong>New chat</strong>'				+nl+sc[7]+'<strong>Ctrl+Alt+M</strong>' };
		
C_XL.d['tip plus visitor']	= { 
	0:'<strong>Add a visitor</strong>'			+nl+sc[0]+nl+pad+'<strong>Ctrl+N</strong> or <strong>Keypad [+]</strong>',	
	1:'<strong>Créer un visitor</strong>'		+nl+sc[1]+nl+pad+'<strong>Ctrl+N</strong> ou <strong>Pavé numérique [+]</strong>',	
	2:'<strong>Tworzenie visitor</strong>'		+nl+sc[2]+nl+pad+'<strong>Ctrl+N</strong> lub <strong>Klawiatura [+]</strong>',	
	3:'<strong>Maak een visitor</strong>'		+nl+sc[3]+nl+pad+'<strong>Ctrl+N</strong> of <strong>Keypad [+]</strong>',
	4:'<strong>Besucher hinzufügen</strong>'	+nl+sc[4]+nl+pad+'<strong>Ctrl+N</strong> of <strong>Keypad [+]</strong>',	
	5:'<strong>Creare un visitatore</strong>'	+nl+sc[5]+nl+pad+'<strong>Ctrl+N</strong> o <strong>Tastiera numerica [+]</strong>',
	6:'<strong>Crear un visitante</strong>'		+nl+sc[6]+nl+pad+'<strong>Ctrl+N</strong> o <strong>Teclado numérico [+]</strong>',
	7:'<strong>Criar um visitante</strong>'		+nl+sc[7]+nl+pad+'<strong>Ctrl+N</strong> ou <strong>Tecla numérica [+]</strong>'	};
		
C_XL.d['tip clear search']	= { 
	0:'<strong>Clear settings</strong>'				+nl+sc[0]+nl+pad+'<strong>Shift+Backspace</strong> or <strong>Keypad [-]</strong>',	
	1:'<strong>Remettre à blanc</strong>'			+nl+sc[1]+nl+pad+'<strong>Shift+Backspace</strong> ou <strong>Pavé numérique [-]</strong>',	
	2:'<strong>Wyczyść ustawienia</strong>'			+nl+sc[2]+nl+pad+'<strong>Shift+Backspace</strong> lub <strong>Klawiatura [-]</strong>',	
	3:'<strong>Wis instellingen</strong>'			+nl+sc[3]+nl+pad+'<strong>Shift+Backspace</strong> of <strong>Keypad [-]</strong>',
	4:'<strong>Einstellungen zurücksetzen</strong>'	+nl+sc[4]+nl+pad+'<strong>Shift+Backspace</strong> of <strong>Keypad [-]</strong>',	
	5:'<strong>Cancellare configurazioni</strong>'	+nl+sc[5]+nl+pad+'<strong>Shift+Backspace</strong> o <strong>Tastiera numerica [-]</strong>',	
	6:'<strong>Borrar configuración</strong>'		+nl+sc[6]+nl+pad+'<strong>Shift+Backspace</strong> o <strong>Teclado numérico [-]</strong>',
	7:'<strong>Eliminar configurações</strong>'		+nl+sc[7]+nl+pad+'<strong>Shift+Backspace</strong> ou <strong>Tecla numérica [-]</strong>'	};
	
	var bs = '&nbsp;[<span class="fa fa-13x fa-long-arrow-left"></span>]'; // !! No translation on this line
	
C_XL.d['tip delete'] = { 
	0:'<strong>Delete</strong>'		+nl+sc[0]+'<strong>Ctrl+Backspace'+bs+'</strong>',	
	1:'<strong>Supprimer</strong>'	+nl+sc[1]+'<strong>Ctrl+Backspace'+bs+'</strong>',	
	2:'<strong>Skasuj</strong>'		+nl+sc[2]+'<strong>Ctrl+Backspace'+bs+'</strong>',	
	3:'<strong>Verwijderen</strong>'+nl+sc[3]+'<strong>Ctrl+Backspace'+bs+'</strong>',
	4:'<strong>Löschen</strong>'	+nl+sc[4]+'<strong>Ctrl+Backspace'+bs+'</strong>',	
	5:'<strong>Sopprimere</strong>'	+nl+sc[5]+'<strong>Ctrl+Backspace'+bs+'</strong>',
	6:'<strong>Borrar</strong>'		+nl+sc[6]+'<strong>Ctrl+Backspace'+bs+'</strong>',
	7:'<strong>Eliminar</strong>'	+nl+sc[7]+'<strong>Ctrl+Backspace'+bs+'</strong>'	};
		
C_XL.d['tip save'] = { 
	0:'<strong>Save</strong>'			+nl+sc[0]+'<strong>Ctrl+s</strong>',	
	1:'<strong>Enregistrer</strong>'	+nl+sc[1]+'<strong>Ctrl+s</strong>',	
	2:'<strong>Zaoszczędzić</strong>'	+nl+sc[2]+'<strong>Ctrl+s</strong>',	
	3:'<strong>Opslaan</strong>'		+nl+sc[3]+'<strong>Ctrl+s</strong>',
	4:'<strong>Speichern</strong>'		+nl+sc[4]+'<strong>Ctrl+s</strong>',	
	5:'<strong>Salvare</strong>'		+nl+sc[5]+'<strong>Ctrl+s</strong>',	
	6:'<strong>Guardar</strong>'		+nl+sc[6]+'<strong>Ctrl+s</strong>',
	7:'<strong>Salvaguardar</strong>'	+nl+sc[7]+'<strong>Ctrl+s</strong>'	};
		
C_XL.d['tip quit'] = { 
	0:'<strong>Close and cancel changes</strong>'				+nl+sc[0]+'<strong>Ctrl+q</strong>',	
	1:'<strong>Quitter sans rien enregistrer</strong>'			+nl+sc[1]+'<strong>Ctrl+q</strong>',	
	2:'<strong>Zamknij i anuluj wymiana</strong>'				+nl+sc[2]+'<strong>Ctrl+q</strong>',	
	3:'<strong>Sluiten en annuleren uitwisseling</strong>'		+nl+sc[3]+'<strong>Ctrl+q</strong>',
	4:'<strong>Schließen ohne Änderungen zu speichern</strong>'	+nl+sc[4]+'<strong>Ctrl+q</strong>',	
	5:'<strong>Lasciare senza salvare</strong>'					+nl+sc[5]+'<strong>Ctrl+q</strong>',	
	6:'<strong>Salir sin guardar</strong>'						+nl+sc[6]+'<strong>Ctrl+q</strong>',
	7:'<strong>Sair sem salvaguardar</strong>'					+nl+sc[7]+'<strong>Ctrl+q</strong>'	};
		
C_XL.d['tip acc duplicate'] = { 
	0:'<strong>Duplicate this account</strong>',
	1:'<strong>Dupliquer ce compte</strong>',	
	2:'<strong>Duplicate this account</strong>',	
	3:'<strong>Duplicate this account</strong>',
	4:'<strong>Duplicate this account</strong>',	
	5:'<strong>Duplicate this account</strong>',	
	6:'<strong>Duplicar esta cuenta</strong>',
	7:'<strong>Duplicate this account</strong>'	};


C_XL.d['tip chatquit'] 	= { 
	0:'Quit conversation'			+nl+sc[0]+'<strong>Ctrl+x</strong>',	
	1:'Sortir de la conversation'	+nl+sc[1]+'<strong>Ctrl+x</strong>',	
	2:'Zakończ rozmowę'				+nl+sc[2]+'<strong>Ctrl+x</strong>',		
	3:'Gesprek verlaten'			+nl+sc[3]+'<strong>Ctrl+x</strong>',		
	4:'Unterhaltung verlassen'		+nl+sc[4]+'<strong>Ctrl+x</strong>',	
	5:'Lasciare la conversazione'	+nl+sc[5]+'<strong>Ctrl+x</strong>',	
	6:'Salir de la conversación'	+nl+sc[6]+'<strong>Ctrl+x</strong>',
	7:'Sair da conversa'			+nl+sc[7]+'<strong>Ctrl+x</strong>'	};

		C_XL.d['smapp warn chatquit'] = { 
			0:'Quit conversation ?',	
			1:'Sortir de la conversation ?',	
			2:'Zakończ rozmowę ?',		
			3:'Gesprek verlaten ?',		
			4:'Unterhaltung verlassen ?',	
			5:'Lasciare la conversazione ?',	
			6:'Salir de la conversación ?',
			7:'Sair da conversa ?'};



C_XL.d['tip chat archive'] 	= { 
	0:'archive for all participants'							+nl+sc[0]+'<strong>Ctrl+Shift+A</strong>',	
	1:'Sortir tous les participants et archiver'				+nl+sc[1]+'<strong>Ctrl+Shift+A</strong>',	
	2:'Usuń wszystkich uczestników i zarchiwizuj'				+nl+sc[2]+'<strong>Ctrl+Shift+A</strong>',		
	3:'Schakel alle deelnemers uit en archiveer'				+nl+sc[3]+'<strong>Ctrl+Shift+A</strong>',		
	4:'Nehmen Sie alle Teilnehmer heraus und archivieren Sie'	+nl+sc[4]+'<strong>Ctrl+Shift+A</strong>',	
	5:'Elimina tutti i partecipanti e l\'archivio'				+nl+sc[5]+'<strong>Ctrl+Shift+A</strong>',
	6:'Sacar a todos los participantes y archivar.'				+nl+sc[6]+'<strong>Ctrl+Shift+A</strong>',
	7:'Retire todos os participantes e arquive'					+nl+sc[7]+'<strong>Ctrl+Shift+A</strong>'	};

		C_XL.d['smapp warn chat archive'] 	= {  // smart app specific warning to confirm
			0:'archive for all participants ?',	
			1:'Sortir tous les participants et archiver ?',	
			2:'Usuń wszystkich uczestników i zarchiwizuj ?',		
			3:'Schakel alle deelnemers uit en archiveer ?',		
			4:'Nehmen Sie alle Teilnehmer heraus und archivieren Sie ?',	
			5:'Elimina tutti i partecipanti e l\'archivio ?',
			6:'Sacar a todos los participantes y archivar ?',
			7:'Retire todos os participantes e arquive ?'};



C_XL.d['tip send phylac'] 	= { 
	0:'Send your message'			+nl+sc[0]+'<strong>Shift+[ENTER]</strong>',	
	1:'Envoyer le message'			+nl+sc[1]+'<strong>Shift+[ENTER]</strong>',	
	2:'Wyślij wiadomość'			+nl+sc[2]+'<strong>Shift+[ENTER]</strong>',		
	3:'Stuur uw bericht'			+nl+sc[3]+'<strong>Shift+[ENTER]</strong>',		
	4:'Senden Sie Ihre Nachricht'	+nl+sc[4]+'<strong>Shift+[ENTER]</strong>',	
	5:'Invia il tuo messaggio'		+nl+sc[5]+'<strong>Shift+[ENTER]</strong>',
	6:'Envía tu mensaje'			+nl+sc[6]+'<strong>Shift+[ENTER]</strong>',
	7:'Envie sua mensagem'			+nl+sc[7]+'<strong>Shift+[ENTER]</strong>'	};


C_XL.d['tip to clipboard'] 	= { 
	0:'Copy the conversation to cliboard'					+nl+sc[0]+'<strong>Ctrl+C</strong>',	
	1:'Copier la conversation vers le presse papier'		+nl+sc[1]+'<strong>Ctrl+C</strong>',	
	2:'Skopiuj rozmowę do schowka'							+nl+sc[2]+'<strong>Ctrl+C</strong>',		
	3:'Kopieer het gesprek naar het klembord'				+nl+sc[3]+'<strong>Ctrl+C</strong>',		
	4:'Kopieren Sie die Konversation in die Zwischenablage'	+nl+sc[4]+'<strong>Ctrl+C</strong>',	
	5:'Copia la conversazione negli appunti'				+nl+sc[5]+'<strong>Ctrl+C</strong>',
	6:'Copia la conversación al portapapeles'				+nl+sc[6]+'<strong>Ctrl+C</strong>',
	7:'Copie a conversa para a área de transferência'		+nl+sc[7]+'<strong>Ctrl+C</strong>'	};
	
	
	

	// colors and status
	
	// 		technical 			english:0,		french:1,		polish:2,		dutch:3,		german:4,		italian:5,		spanish:6,		portuguese:7


C_XL.d['status']			= { 0:'Status',		1:'Statut',		2:'Stan',		3:'Staat',		4:'Status',		5:'Status',		6:'Estado', 	7:'Estado'	};
C_XL.d['color']				= { 0:'Color',		1:'Couleur',	2:'Kolor',		3:'Kleur',		4:'Farbe',		5:'Colore',		6:'Color', 		7:'Cor'		};
C_XL.d['colors']			= { 0:'Colors',		1:'Couleurs',	2:'kolorów',	3:'Kleuren',	4:'Farben',		5:'Colori',		6:'Colores', 	7:'Cores'	};
C_XL.d['pattern']			= { 0:'Pattern',	1:'Motif',		2:'Wzorzec',	3:'Patroon',	4:'Motiv',		5:'Motivo',		6:'Motivo', 	7:'Motivo'	};
C_XL.d['patterns']			= { 0:'Patterns',	1:'Motifs',		2:'Wzory',		3:'Patronen',	4:'Motive',		5:'Motivi',		6:'Motivos', 	7:'Motivos'	};
C_XL.d['tag']				= { 0:'Tag',		1:'Tag',		2:'Tag',		3:'Tag',		4:'Tag',		5:'Tag',		6:'Tag', 		7:'Tag'		};
C_XL.d['tags']				= { 0:'Tags',		1:'Tags',		2:'Tags',		3:'Tags',		4:'Tags',		5:'Tags',		6:'Tags', 		7:'Tags'	};
C_XL.d['skins']				= { 0:'Skins',		1:'Thèmes',		2:'Tematy',		3:'Thema\'s',	4:'Thema',		5:'Temi',		6:'Temas', 		7:'Temas'	};


// 		technical 				english:0,			french:1,				polish:2,			dutch:3,			german:4,				italian:5,			spanish:6,				portuguese:7

C_XL.d['color off']			= { 0:'Unavailable',	1:'Indisponible',		2:'Zajęty/a',		3:'onbeschikbaar',	4:'Nicht verfügbar',	5:'Indisponibile',	6:'No disponible', 		7:'Indisponível'	};
C_XL.d['color excp']		= { 0:'Exceptionaly',	1:'Exceptionnellement',	2:'Wyjątkowo/a',	3:'Uitzonderlijk',	4:'außerordentlich',	5:'Eccezionalmente',6:'Excepcionalmente', 	7:'Excecionalmente'	};
C_XL.d['color absent']		= { 0:'Closed',			1:'Fermé',				2:'Zamknięty',		3:'Gesloten',		4:'Geschlossen',		5:'Chiuso',			6:'Cerrado', 			7:'Fechado'	};
C_XL.d['color closed']		= { 0:'Closed',			1:'Fermé',				2:'Zamknięty',		3:'Gesloten',		4:'Geschlossen',		5:'Chiuso',			6:'Cerrado', 			7:'Fechado'	};


	// validation messages
	
C_XL.d['field ok']			= { 0:' ok', 1:' ok', 2:' ok', 3:' ok',	4:' ok', 5:' ok', 6:' ok', 7:' ok'	};


// 		technical 				english:0,								french:1,									polish:2,										dutch:3,												german:4,															italian:5,											spanish:6,												portuguese:7

C_XL.d['not filled in']	= { 0:' is mandatory',						1:' ne peut rester vide',					2:' Wymagana informacja',						3:' moet ingevuld worden',	               				4:'angabe erforderlich',											5:'non può rimanere vuoto',							6:'No puede quedarse vacío', 							7:'Não pode ficar em branco'	};
C_XL.d['not email']		= { 0:' is not a valid e-mail address',		1:' n\'est pas une adresse mail',			2:' Niepoprawny adres e-mail',					3:' is geen e-mail adres',								4:'ist keine E-mail Adresse',										5:'non è un indirizzo email',						6:'No es una dirección email', 							7:'não é um endereço de e-mail'	};
C_XL.d['not price']		= { 0:' A valid € price format looks like 10.50',1:' Le format du prix en € est p.ex 10.50',2:'Ważne € format cena wygląda 10.50',		3:' Een geldige € prijs formaat ziet er als 10.50',		4:'Ein gültiges € Preisformat sieht ist zB 10.50',					5:'Il formato del prezzo in € è per esempio 10.50',	6:'El formato del precio en € es por ejemplo 10.50', 	7:'O formato do preço em € é,	por exemplo,	10,50'	};
C_XL.d['not mobile']	= { 0:' is not a mobile number',			1:' n\'est pas un numéro de portable',		2:' Niepoprawny numere telefonu komórkowego.',	3:' is geen GSM nummer',								4:'ist keine Mobilnummer',											5:'Non è un numero di cellulare',					6:'No es un número de móvil', 							7:'não é um número de telemóvel'	};
C_XL.d['not phone']		= { 0:' is not a phone number',				1:' n\'est pas un numéro de téléphone',		2:' Niepoprawny numere telefonu.',				3:' is geen telefoon nummer',							4:'ist keine Telefonnummer',										5:'Non è un numero di telefono',					6:'No es un número de teléfono', 						7:'não é um número de telefone'	};
C_XL.d['not letters']	= { 0:' must be letters only',				1:' ne peut contenir que des lettres',		2:' Może zawierać tylko litery',				3:' mag enkel uit letters bestaan',	               		4:'kann nur aus Buchstaben bestehen',								5:'Non può contenere altro che lettere',			6:'Solo puede contener letras', 						7:'só pode conter letras'	};
C_XL.d['not alpha']		= { 0:' must be letters and/or figures',	1:' doit être en chiffres et/ou en lettres',2:' muszą być literami i/lub dane',				3:' moeten letters en/of cijfers',						4:'muss aus Ziffern und/oder Buchstaben bestehen',					5:'Può contenere cifre e/o lettere',				6:'Puede contener letras e/o números', 					7:'só pode conter letras e/ou números'	};
C_XL.d['not numeric']	= { 0:' must be numeric',					1:' doit être en chiffres',					2:' Może zawierać tylko liczby',				3:' moet een nummers zijn',	               				4:'kann nur Ziffern enthalten',										5:'Deve essere in cifre',							6:'Tiene que ser en números', 							7:'deve ser em algarismos'	};
C_XL.d['bad login']		= { 0:' invalid login: choose another one',	1:' login non valide: choisir un autre',	2:' Nieprawidłowy identyfikator. Wybierz inny.',3:' onbeschikbare login: kies iets anders',				4:'Ungültiger Login, bitte wählen Sie einenn anderen',				5:'Login non valido: sceglierne un altro',			6:'Login no válido: escoger otro', 						7:'Início de sessão inválido: escolher outro'	};
C_XL.d['not url']		= { 0:' is not a valid url format',			1:' le format url n\'est pas correct',		2:' Nieprawidłowy url. Wybierz inny.',			3:' het formaat van de url is niet correct',			4:'Das Format der URL-Adresse ist nicht gültig',					5:'Il formato url non è valido',					6:'El formato url no es válido', 						7:'O formato url não está correto'	};
C_XL.d['bad e-url']		= { 0:' unavailable url: choose another one',	1:' url non disponible: choisir un autre',	2:' Nieprawidłowy url. Wybierz inny.',		3:' onbeschikbare url: kies iets anders',				4:'URL-Adresse nicht verfügbar, bitte wählen Sie eine andere ',		5:'url indisponibile: sceglierne un altro',			6:'url no disponible: escoger otro', 					7:'url não disponível: escolher outro'	};
C_XL.d['bad format']	= { 0:'the format is incorrect',			1:'le format est incorrect',				2:'format jest niepoprawny.',					3:'het formaat is onjuist',								4:'das Format ist falsch',											5:'il formato non è corretto',						6:'el formato es incorrecto', 							7:'o formato está incorreto'	};


C_XL.d['bad pass']	= { 0:' invalid password: choose another one',
	1:' mot de passe non valide: choisir un autre',
	2:' Nieprawidłowe hasło. Wybierz inne.',
	3:' onaangepast passwoord: kies iets anders',
	4:'Ungültiges Passwort, bitte ein neues wählen',	
	5:'Password invalido: sceglierne un altro',	
	6:' contraseña no válida: escoger otra', 7:' palavra-passe inválida: escolher outra'	};
	
C_XL.d['no twins']			= { 0:' confirmation must repeat password',	               
								1:' confirmation doit être identique au mot de passe',	
								2:' Potwierdzenie musi być identyczne z hasłem',	
								3:' bevestiging moet gelijk zijn aan passwoord',	               
								4:'Die Bestätigung muss mit dem Passwort übereinstimmen',	
								5:' la conferma deve essere identica al password',	
								6:' la confirmación tiene que ser idéntica a la contraseña', 7:' a confirmação deve ser idêntica à palavra-passe'	};
								
//C_XL.d['dd-mm-yyyy']		= { 0:'dd-mm-yyyy',	1:'jj-mm-aaaa',	2:'dd-mm-yyyy',	3:'dd-mm-jjjj',	4:'tt-mm-jjj',	5:'gg-mm-aaaa',	6:'dd-mm-aaaa', 7:'dd-mm-aaaa'	};
C_XL.d['dd-mm-yyyy']		= { 0:'Birthday (dd-mm-yyyy)',	1:'Date de naissance (jj-mm-aaaa)',	2:'Data urodzenia (dd-mm-yyyy)',	3:'Geboorte datum (dd-mm-jjjj)',	4:'Geburtsdatum (tt-mm-jjj)',	5:'Data di nascita (gg-mm-aaaa)',	6:'Fecha de nacimiento (dd-mm-aaaa)', 	7:'Data de nascimento (dd-mm-aaaa)'	};

C_XL.d['not bdate']			= { 0:' A valid date of birth format is dd-mm-yyyy',	
								1:' Le format correcte pour la date de naissance est jj-mm-aaaa',	
								2:' Poprawny format daty urodzenia jest dd-mm-rrrr',				
								3:' Het juiste formaat voor de geboortedatum is dd-mm-jjjj',
								4:'Ein gültiges Format für das Geburtsdatum ist tt-mm-jjjj',	
								5:' Il formato corretto per la data di nascita è gg-mm-aaaa',	
								6:' El formato correcto para la fecha de nacimiento es dd-mm-aaaa', 
								7:' O formato correto para a data de nascimento é dd-mm-aaaa'
								};

C_XL.d['delete confirm']	= { 0:'are you sure you want to delete ?',	               
								1:'Etes-vous certain de vouloir supprimer ?',	
								2:'Czy na pewno chcesz usunąć ?',	
								3:'Bent U zeker van te willen schrappen ?',
								4:'Sind Sie sicher, dass Sie löschen möchten?',	
								5:'È sicuro di volere sopprimere ?',	
								6:'Está seguro de querer borrar ?', 7:'Tem a certeza de que deseja apagar?'	};
								
C_XL.d['delete all confirm']= { 0:'are you sure you want to delete <b>all</b> items?',	               
								1:'Etes-vous certain de vouloir <b>tous</b> les supprimer ?',	
								2:'Czy na pewno chcesz usunąć <b>wszystkie przedmioty</b> ?',	
								3:'Bent u zeker dat u ze <b>allemaal</b> wilt verwijderen ?',
								4:'Sind Sie sicher, dass Sie <b>alles</b> löschen möchten?',	
								5:'È sicuro di volere <b>tous</b> sopprimerli ?',	
								6:'Está seguro de querer <b>todos</b> borrarlos ?', 7:'Tem a certeza de que deseja <b>apagar</b> todos?'
								};
								
C_XL.d['delete visitor']	= { 0:'Remove this visitor?',	
								1:'Supprimer ce visiteur?',	
								2:'Usunąć?',	
								3:'Bent U zeker van te willen schrappen?',		
								4:'Diesen Besucher entfernen?',	
								5:'Eliminare questo visitatore',	
								6:'Borrar este visitante?', 7:'apagar este visitante?'	};
								
C_XL.d['delete resa']		= { 0:'are you sure you want to delete this reservation ?',	               
								1:'Êtes vous certain de vouloir effacer cette réservation ?',	
								2:'Czy na pewno chcesz usunąć tę rezerwację ?',	
								3:'Wilt u zeker deze reservering schrappen ?',
								4:'Sind Sie sicher, dass Sie diese Reservierung löschen möchten?',	
								5:'È sicuro di volere sopprimere questa prenotazione ?',	
								6:'Está seguro de querer borrar esta reserva ?', 7:'Tem a certeza de que deseja apagar esta reserva?'
								};
								
C_XL.d['invalid form']		= { 0:'Some fields are not appropriately filled in,	please correct them,	or cancel',
								1:'Certains champs ne sont pas correctement remplis, corrigez les ou annuler',
								2:'Popraw błędnie wypełnione pola lub anuluj',
								3:'Sommige velden zijn onterecht ingevuld',
								4:'Einige Felder wurden nicht richtig ausgefüllt, bitte korrigieren oder abbrechen',	
								5:'alcuni campi non sono riempiti correttamente, per favore li corregga o li cancelli',	
								6:'algunas casillas no están llenadas correctamente, por favor corríjalas o cancélelas', 7:'alguns campos não foram devidamente preenchidos. Por favor corrija-os ou anule.'
								};
								
C_XL.d['connection failed']	= { 0:'The server is unreachable,	check your internet connection first,	then please try again.',
								1:'Le serveur est inaccessible,	vérifiez votre connexion Internet,	puis s\'il vous plaît essayer à nouveau.',
								2:'Serwer jest niedostępny,	sprawdź połączenie internetowe,	następnie spróbuj ponownie.',
								3:'De server lijkt onbereikbaar te zijn,	controleer dan eerst uw internetverbinding,	dan kunt u het opnieuw proberen.',
								4:'Der Server ist nicht erreichbar, bitte überprüfen Sie Ihre internetverbinding und versuchen Sie es erneut',	
								5:'Il server è inaccessibile, verifichi la Sua connessione internet e provi di nuovo per favore.',	
								6:'El servidor está inaccesible, verifique su conexión a internet e inténtelo de nuevo por favor.', 7:'O servidor encontra-se inacessível. Verifique a sua ligação à internet e tente novamente por favor.'
								};
								
C_XL.d['upload failed']	= { 0:'The file could not be uploaded,	check your internet connection first,	then please try again.',
							1:'Le fichier n\'a pu être transféré,	vérifiez votre connexion Internet,	puis s\'il vous plaît essayer à nouveau.',
							2:'Plik nie może być przesłane,	sprawdź połączenie internetowe,	następnie spróbuj ponownie.',
							3:'Het bestand kan niet worden geüpload,	controleer dan eerst uw internetverbinding,	dan kunt u het opnieuw proberen.',
							4:'Die Datei konnte nicht hochgeladen werden, bitte überprüfen Sie Ihre internetverbinding und versuchen Sie es erneut',	
							5:'Il file non ha potuto essere caricato, controlli la Sua connessione Internet e provi di nuovo per favore',	
							6:'El fichero no se ha podido cargar, verifique su conexión a internet e inténtelo de nuevo por favor.', 7:'O ficheiro não pode ser transferido. Verifique a sua ligação à Internet e tente novamente,	por favor.' };
							
C_XL.d['reserved login']	= { 0:'Login already reserved',			1:'Login déjà réservé',		2:'Zarezerwowany identyfikator',	3:'Login al in gebruik',	4:'Kontoname bereits vergeben',			5:'Login già prenotato',	6:'Login ya reservado', 		7:'Início de sessão já reservado'	};
C_XL.d['please fill in']	= { 0:'Can not be left empty',			1:'Ne peut rester vide',	2:'Nie może być pusty',				3:'Mag niet leeg blijven',	4:'Darf nicht leer sein',				5:'Non può rimanere vuoto',	6:'No se puede quedar vacío', 	7:'Não pode estar em branco'	};

C_XL.d['no search result']	= { 0:'This search brings no result',	
								1:'Cette recherche ne ramène aucun résultat',	
								2:'Brak wyników wyszukiwania',	
								3:'Die opzoeking brengt geen resultaat',	
								4:'Diese Suche bringt keine Ergebnisse',
								5:'Questa ricerca non da nessun risultato',	
								6:'Esta búsqueda no da resultados', 7:'Esta pesquisa não obteve nenhum resultado'	};

C_XL.d['no e-search result']	= { 0:'There is no availability corresponding to your search',	
								1:'Il n\'y a aucune disponibilité correspondant à votre recherche',	
								2:'Brak dostępności odpowiadającej twojemu wyszukiwaniu',	
								3:'Er is geen beschikbaarheid die overeenkomt met de gekozen opties',	
								4:'Es gibt keine Verfügbarkeit für Ihre Suche',
								5:'Non c\'è disponibilità corrispondente alla tua ricerca',	
								6:'No hay disponibilidad correspondiente a su búsqueda', 7:'Não há disponibilidade correspondente à sua pesquisa'	};


	// swapping agendas
C_XL.d['swaping from']	= { 0:'Do you want to switch the day assignments of',	1:'Voulez-vous échanger la journée de',				2:'Podmiana harmonogramu z dnia',	3:'Wilt u de toewijzigingen van',			4:'Tauschen der Tagesaufgaben vom',					5:'Vuole cambiare la giornata del',				6:'Desea cambiar el día de', 7:'Deseja trocar o dia de'					};
C_XL.d['swaping to']	= { 0:'with the ones of',								1:'avec celle de',									2:'na harmonogram z dnia',			3:'wisselen met die van',					4:'mit denen von',									5:'con quella del',								6:'con el de', 7:'com o de'								};
C_XL.d['swap future']	= { 0:'applies also for following days',				1:'appliquer aussi à tous les jours qui suivent',	2:'Zastosować do kolejnych dni',	3:'Ook toepassen op volgende dagen',		4:'auch auf alle darauffolgenden Tage anwenden',	5:'applicare anche a tutti i giorni seguenti',	6:'aplicar también a todos los días siguientes', 7:'aplicar também a todos os dias seguintes'	};
	

	// SMS display
	
C_XL.d['sms-templateId'] 	= { 0:'Name',		1:'Nom',		2:'Nazwa',		3:'Naam',			4:'Name',	5:'Cognome',	6:'apellido', 7:'apelido'		};

C_XL.d['sms-r1handled'] 	= { 0:'R1<br/>Sent',		1:'R1<br/>Envoyé',	2:'R1<br/>Wysłany',		3:'R1<br/>Verzonden',	4:'Gesendet',	5:'R1<br/>Inviato',		6:'R1<br/>Enviado', 	7:'R1<br/>Enviado'	};
C_XL.d['sms-r1delivered'] 	= { 0:'R1<br/>Delivered',	1:'R1<br/>Reçu',	2:'R1<br/>Otrzymał',	3:'R1<br/>Afgeleverd',	4:'Empfangen',	5:'R1<br/>Ricevuto',	6:'R1<br/>Recibido', 	7:'R1<br/>Recebido'	};
C_XL.d['sms-r1pending'] 	= { 0:'R1<br/>Pending',		1:'R1<br/>Attente',	2:'R1<br/>W kolejce',	3:'R1<br/>Wachtrij',	4:'ausstehend',	5:'R1<br/>In attesa',	6:'R1<br/>En espera', 	7:'R1<br/>Em espera'	};
C_XL.d['sms-r1error'] 		= { 0:'R1<br/>Error',		1:'R1<br/>Erreur',	2:'R1<br/>Błąd',		3:'R1<br/>Fout',		4:'Fehler',		5:'R1<br/>Errore',		6:'R1<br/>Error', 		7:'R1<br/>Erro'	};
C_XL.d['sms-r1nofeedback'] 	= { 0:'R1<br/>Lost',		1:'R1<br/>Perdu',	2:'R1<br/>Stracony',	3:'R1<br/>Verloren',	4:'Verloren',	5:'R1<br/>Perso',		6:'R1<br/>Perdido', 	7:'R1<br/>Perdido'	};

C_XL.d['sms-r2handled'] 	= { 0:'R2<br/>Sent',		1:'R2<br/>Envoyé',	2:'R2<br/>Wysłany',		3:'R2<br/>Verzonden',	4:'Gesendet',	5:'R2<br/>Inviato',		6:'R2<br/>Enviado', 	7:'R2<br/>Enviado'	};
C_XL.d['sms-r2delivered'] 	= { 0:'R2<br/>Delivered',	1:'R2<br/>Reçu',	2:'R2<br/>Otrzymał',	3:'R2<br/>Afgeleverd',	4:'Empfangen',	5:'R2<br/>Ricevuto',	6:'R1<br/>Recibido', 	7:'R2<br/>Recebido'	};
C_XL.d['sms-r2pending'] 	= { 0:'R2<br/>Pending',		1:'R2<br/>Attente',	2:'R2<br/>W kolejce',	3:'R2<br/>Wachtrij',	4:'ausstehend',	5:'R2<br/>In attesa',	6:'R1<br/>En espera', 	7:'R2<br/>Em espera'	};
C_XL.d['sms-r2error'] 		= { 0:'R2<br/>Error',		1:'R2<br/>Erreur',	2:'R2<br/>Błąd',		3:'R2<br/>Fout',		4:'Fehler',		5:'R2<br/>Errore',		6:'R1<br/>Error', 		7:'R2<br/>Erro'	};
C_XL.d['sms-r2nofeedback'] 	= { 0:'R2<br/>Lost',		1:'R2<br/>Perdu',	2:'R2<br/>Stracony',	3:'R2<br/>Verloren',	4:'Verloren',	5:'R2<br/>Perso',		6:'R1<br/>Perdido', 	7:'R2<br/>Perdido'	};

C_XL.d['sms'] 				= { 0:'SMS',		1:'SMS',			2:'SMS',			3:'SMS',			4:'SMS',			5:'SMS',				6:'SMS', 				7:'SMS'				};
C_XL.d['sms status']		= { 0:'SMS status',	1:'Statut du SMS',	2:'Stan SMS',		3:'SMS status',		4:'SMS Status',		5:'Status del SMS',		6:'Estado del SMS', 	7:'Estado do SMS'	};
C_XL.d['sms_nomobile']		= { 0:'No mobile',	1:'Pas de GSM',		2:'Nie mobile',		3:'Geen GSM',		4:'Keine SMS',		5:'Nessun cellulare',	6:'Ningún móvil', 		7:'Sem GSM'			};
C_XL.d['sms_outdated']		= { 0:'Outdated',	1:'Obsolète',		2:'Przestarzały',	3:'verouderd',		4:'abgelaufen',		5:'Obsoleto',			6:'Obsoleto', 			7:'Obsoleto'		};
C_XL.d['sms_nosms']			= { 0:'No SMS',		1:'Pas de SMS',		2:'Brak SMS-ów',	3:'Geen SMS',		4:'Keine SMS',		5:'Nessun SMS',			6:'Ningún SMS', 		7:'Sem SMS'			};
C_XL.d['sms_error']			= { 0:'Error',		1:'Erreur',			2:'Error',			3:'Fout',			4:'Fehler',			5:'Errore',				6:'Error', 				7:'Erro'			};
C_XL.d['sms_dead_numb']		= { 0:'Unassigned',	1:'Non attribué',	2:'Nieprzypisany',	3:'Niet toegewezen',4:'Nicht belegt',	5:'Non assegnato',		6:'No asignado', 		7:'Não atribuído'	};
C_XL.d['sms_handled']		= { 0:'Handed over',1:'Transmis',		2:'Przekazany',		3:'Uitgezonden',	4:'Übertragen',		5:'Inviato',			6:'Enviado', 			7:'Enviado'			};
C_XL.d['sms_pending']		= { 0:'Pending',	1:'En attente',		2:'Oczekujący',		3:'Hangt',			4:'ausstehend',		5:'In attesa',			6:'En espera', 			7:'Em espera'		};
C_XL.d['sms_delivered']		= { 0:'Delivered',	1:'Délivré',		2:'Dostarczony',	3:'afgeleverd',		4:'Zugestellt',		5:'Consegnato',			6:'Entregado', 			7:'Entregue'		};
C_XL.d['sms_discarded']		= { 0:'Discarded',	1:'Détruit',		2:'Usunięty',		3:'Gescrapt',		4:'Verworfen',		5:'Distrutto',			6:'Destruido', 			7:'Destruído'		};
C_XL.d['sms_retained']		= { 0:'Retained',	1:'Retenu',			2:'Zachowany',		3:'Gehouden',		4:'Zurückgehalten',	5:'Conservato',			6:'Conservado', 		7:'Retido'			};

C_XL.d['sms_created']		= C_XL.d['ready']; 	// !! No translation on this line
C_XL.d['sms_retry']			= C_XL.d['ready']; 	// !! No translation on this line
C_XL.d['sms_disabled']		= C_XL.d['disabled']; 	// !! No translation on this line

C_XL.d['sms_iso']			= { 0:'Destination = agenda - cancelled',	
								1:'Destinataire = agenda - impossible',	
								2:'adresat = lista adresów - błąd',		
								3:'Ontvanger = agenda - geschrapt',	               
								4:'Empfänger = Kalender - storniert',	
								5:'Destinatario = agenda - impossibile',
								6:'Spanish', 7:'Destinatário = calendário - impossível'
								};
								
C_XL.d['sms_nofeedback']	= { 0:'No feedback',	1:'Sans statut',	2:'Nie opinie',			3:'Geen feedback',		4:'Kein Feedback',	5:'Nessun feedback',	6:'Ningún feedback', 	7:'Nenhum feedback'	};
C_XL.d['sms_notsent']		= { 0:'Not sent',		1:'Pas envoyé',		2:'Nie są przesyłane',	3:'Niet verzonden',		4:'Nicht gesendet',	5:'Non inviato',		6:'No enviado', 		7:'Não enviado'	};


	// C_dS_smsCounters.catalyst
	
C_XL.d['sms-date']			= { 0:'Date',		1:'Date',		2:'Date',		3:'Datum',			4:'Datum',			5:'Data',	6:'Fecha', 		7:'Data'	};
C_XL.d['sms-msgs']			= { 0:'Msgs',		1:'Msgs',		2:'Msgs',		3:'Berichtjes',		4:'Nachrichten',	5:'Msg',	6:'Mensajes', 	7:'Msgs'	};
C_XL.d['sms-pages']			= { 0:'Pages',		1:'Pages',		2:'Pages',		3:'Paginas',		4:'Seiten',			5:'Pagine',	6:'Páginas', 	7:'Páginas'	};

C_XL.d['sms-name']			= C_XL.d['sms-templateId']; 	// !! No translation on this line
C_XL.d['sms-handled']		= C_XL.d['sms_handled'];  	// !! No translation on this line
C_XL.d['sms-error']			= C_XL.d['sms_error'];  	// !! No translation on this line
C_XL.d['sms-pending']		= C_XL.d['sms_pending'];  	// !! No translation on this line
C_XL.d['sms-delivered']		= C_XL.d['sms_delivered'];  // !! No translation on this line
C_XL.d['sms-discarded']		= C_XL.d['sms_discarded'];  // !! No translation on this line
C_XL.d['sms-dead-numb']		= C_XL.d['sms_dead_numb'];  // !! No translation on this line
	
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7

	
	// EMAIL status display

C_XL.d['email status']		= { 0:'email status',	1:'Statut de l\'email',	2:'Stan email',		3:'email status',	4:'Email Status',	5:'Status del email',	6:'Estado del e-mail', 	7:'Estado do e-mail'	};
C_XL.d['eml_no_email']		= { 0:'No address',		1:'Pas d\'adresse',		2:'Brak adresu',	3:'Geen adres',		4:'Keine Adresse',	5:'Nessun indirizzo',	6:'Ninguna dirección', 	7:'Sem endereço'	};
C_XL.d['eml_none']			= { 0:'No email',		1:'Pas d\'email',		2:'Brak email',		3:'Geen email',		4:'Keine E-Mail',	5:'Nessun email',		6:'Ningún e-mail', 		7:'Sem e-mail'		};
C_XL.d['eml_handled']		= { 0:'Handed over',	1:'Transmis',			2:'Przekazany',		3:'Uitgezonden',	4:'Übertragen',		5:'Inviato',			6:'Enviado', 			7:'Enviado'			};
C_XL.d['eml_pending']		= { 0:'Pending',		1:'En attente',			2:'Oczekujący',		3:'Hangt',			4:'ausstehend',		5:'In attesa',			6:'En espera', 			7:'Em espera'		};
C_XL.d['eml_delivered']		= { 0:'Delivered',		1:'Délivré',			2:'Dostarczony',	3:'afgeleverd',		4:'Zugestellt',		5:'Consegnato',			6:'Entregado', 			7:'Entregue'		};

C_XL.d['eml_disabled']		= C_XL.d['disabled']; 		// !! No translation on this line
C_XL.d['eml_outdated']		= C_XL.d['sms_outdated']; 	// !! No translation on this line
C_XL.d['eml_created']		= C_XL.d['ready']; 			// !! No translation on this line


C_XL.d['transmission quality']	= { 0:'Transmission quality',	1:'Qualité de la transmission',	2:'Jakość transmisji',	3:'Transmissie kwaliteit',	4:'Übertragungsqualität',	5:'Qualità della trasmissione',	6:'Calidad de la transmisión', 7:'Qualidade da transmissão'	};
C_XL.d['details per route']		= { 0:'Details per route',		1:'Détails par route',			2:'Szczegóły na trasie',3:'Gegevens per route',		4:'Details per Route',		5:'Dettagli per rotta',	6:'Detalles por ruta', 7:'Detalhes por rota'	};

	
					
	// filters for visitors selection (visitors management page)
	
C_XL.d['filter_visitors']	= { 0:'List of visitors who',	1:'Liste des visitors qui',	2:'Wybierz visitors',	3:'Lijst van visitors die',		4:'Liste der Besucher, die',	5:'Lista dei visitatori che',	6:'Listado de visitantes que', 7:'Lista dos visitantes que'	};
C_XL.d['end of list']		= { 0:'End of list',			1:'Fin de la liste',		2:'Końca listy',		3:'Einde van de lijst',			4:'Ende der Liste',				5:'Fine della lista',			6:'Fin listado', 7:'Fim da lista'	};

C_XL.d['filter_resources']	= { 0:'visitors who appointed with',	1:'visitors qui ont été reçu par',		2:'Użytkownicy,	którzy powołani z',					3:'visitors die afgesproken hebben met',	4:'Besucher empfangen von',			5:'Visitatori che sono stati ricevuti da',	6:'Visitantes que fueron recibidos por', 7:'visitantes que foram recebidos por'	};
C_XL.d['filter_prefs']		= { 0:'visitors who prefer to come on',	1:'visitors qui préfèrent venir le',	2:'Użytkownicy,	którzy zdecydują się przyjść na',	3:'visitors die liever afspreken op',		4:'Besucher mit Präferenz am ',		5:'Visitatori che preferiscono venire il',	6:'Visitantes que prefieren venir el', 7:'visitantes que preferem vir a'	};

C_XL.d['filter_workcodes']	= { 0:'visitors who appointed for following performance:',	
								1:'visitors pour les prestations suivantes:',	
								2:'visitors który mianowany na następującej wydajności:',		
								3:'visitors die voor de volgende prestaties hebben afgesproken:',		
								4:'Besucher mit Terminen für die folgenden Leistungen',	
								5:'Visitatori per le seguenti prestazioni',	
								6:'Visitantes para los siguientes servicios', 7:'visitantes para os seguintes benefícios:'	};

C_XL.d['have_app']			= { 0:'have appointed',			1:'ont eu un RDV',				2:'wyznaczyły',				3:'hebben afgesproken',			4:'haben Termin für',				5:'hanno avuto un appuntamento',		6:'tuvieron una cita', 			7:'tinham uma consulta'			};
C_XL.d['have_not_app']		= { 0:'have not appointed',		1:'n\'ont pas eu de RDV',		2:'nie powołany',			3:'hebben niet afgesproken',	4:'haben keine Termine',			5:'non hanno avuto un appuntamento',	6:'no tuvieron una cita', 		7:'não tinham consulta'			};
C_XL.d['have_never_app']	= { 0:'have never appointed',	1:'n\'ont jamais eu de RDV',	2:'nigdy nie powoływani',	3:'hebben nooit afgesproken',	4:'hatten noch nie einen Termin',	5:'non hanno mai avuto un appuntamento',6:'nunca tuvieron una cita', 	7:'nunca tiveram uma consulta'	};
C_XL.d['have_ever_app']		= { 0:'have ever appointed',	1:'ont déjà eu un RDV',			2:'kiedykolwiek mianowany',	3:'hebben ooit afgesproken',	4:'haben Termine wahrgenommen',		5:'hanno già avuto un appuntamento',	6:'ya tuvieron una cita', 		7:'Já tiveram uma consulta'		};
C_XL.d['lastAppCue']		= { 0:'Last appointment',		1:'Dernier RDV',				2:'Ostatnia wizyta',		3:'Laatste reservatie',			4:'Letzter Termin',					5:'Ultimo appuntamento',				6:'Última cita', 				7:'Última consulta'				};
C_XL.d['no reference for']	= { 0:'No reference for',		1:'Pas de référence pour',		2:'Brak odniesienia do',	3:'Geen verwijzing naar',		4:'Keine Referenz für',				5:'Nessun riferimento per',				6:'Ninguna referencia para', 	7:'Sem referência para'			};

C_XL.d['not got sms']		= { 0:'have not got SMS',				1:'n\'ont plus reçu de SMS',		2:'nie otrzymałem SMS',		3:'hebben geen SMS gekregen',		4:'haben keine SMS empfangen',		5:'non hanno ricevuto SMS',		6:'no recibieron SMS', 		7:'não voltaram a receber SMS'	};
C_XL.d['not got email']		= { 0:'have not got e-mail',			1:'n\'ont plus reçu d\'eMail',		2:'nie otrzymałem E-mail',	3:'hebben geen eMail gekregen',		4:'haben keine E-Mail empfangen',	5:'non hanno ricevuto email',	6:'no recibieron e-mail', 	7:'não voltaram a receber e-mails'	};

C_XL.d['not got smsemail']	= { 0:'have not got SMS nor e-mails',	
								1:'n\'ont plus reçu SMS ni eMail',	
								2:'Brak wiadomości SMS lub E-Mail otrzymał',		
								3:'hebben geen SMS noch eMail gekregen',		
								4:'haben weder SMS noch E-Mail empfangen',	
								5:'Non hanno ricevuto ne SMS ne email',	
								6:'No recibieron SMS ni e-mail', 7:'não voltaram a receber SMS ou e-mail'	};
								
C_XL.d['before']	= { 0:'before',		1:'avant le',		2:'przed',		3:'voor',		4:'vor dem',	5:'prima del',	6:'antes del', 		7:'antes de'	};
C_XL.d['after']		= { 0:'after',		1:'après le',		2:'od',			3:'na',			4:'nach dem',	5:'dopo il',	6:'después del', 	7:'depois de'	};
C_XL.d['since']		= { 0:'since',		1:'depuis le',		2:'ponieważ',	3:'sinds',		4:'seit',		5:'dal',		6:'desde', 			7:'desde'		};
C_XL.d['and after']	= { 0:'and after',	1:'et ensuite',		2:'a następnie',3:'en daarna',	4:'und ab',		5:'e dopo',		6:'y después', 		7:'e depois'	};


	// not before control	

// 		technical 			english:0,		french:1,			polish:2,				dutch:3,				german:4,			italian:5,		spanish:6,			portuguese:7


C_XL.d['not before'] 	= { 0:'Not before',	1:'Pas avant',		2:'Dopiero',			3:'Voorstellen vanaf',	4:'Nicht vor',		5:'Non prima',	6:'No antes', 		7:'Não antes de'	};
C_XL.d['absent before'] = { 0:'before',		1:'avant',			2:'dopiero',			3:'voor',				4:'vor',			5:'prima',		6:'antes', 			7:'antes'			}; /* see M_SHADOW */
C_XL.d['absent after'] 	= { 0:'after',		1:'après',			2:'Nie po',				3:'na',					4:'nach',			5:'dopo',		6:'después', 		7:'depois'			};
C_XL.d['urgent']	 	= { 0:'Urgent',		1:'Urgent',			2:'Pilne',				3:'Dringend',			4:'Dringend',		5:'Urgente',	6:'Urgente', 		7:'Urgente'			};
C_XL.d['today']	 		= { 0:'Today',		1:'aujourd\'hui',	2:'Dzisiaj',			3:'Vandaag',			4:'Heute',			5:'Oggi',		6:'Hoy', 			7:'Hoje'			};
C_XL.d['tomorrow']	 	= { 0:'Tomorrow',	1:'Demain',			2:'Dopiero jutro',		3:'Morgen',				4:'Morgen',			5:'Domani',		6:'Mañana', 		7:'amanhã'			};
C_XL.d['yesterday']	 	= { 0:'yesterday',	1:'hier',			2:'wczoraj',			3:'gisteren',			4:'gestern',		5:'ieri',		6:'ayer', 			7:'ontem'			};
C_XL.d['schedule']		= { 0:'Schedule',	1:'Timing',			2:'Harmonogram',		3:'afspraak',			4:'Uhrzeit',		5:'Timing',		6:'Planificación', 	7:'Timing'			};

C_XL.d['asap']	 		= { 0:'as soon as possible',1:'aussitôt que possible',	2:'Tak szybko, jak to możliwe',	3:'Zo snel mogelijk',	4:'Sobald wie möglich',		5:'Il prima possibile',	6:'En cuanto sea posible', 		7:'O mais rápido possível'	};
C_XL.d['current day']	= { 0:'in the current day',	1:'dans la journée',		2:'w dzisiejszym dniu',			3:'in de huidige dag', 	4:'am aktuellen Tag',		5:'nel giorno corrente',6:'en el día actual', 			7:'no dia atual' 			};
C_XL.d['current week']	= { 0:'in the current week',1:'dans cette semaine',		2:'w bieżącym tygodniu',		3:'in de huidige week', 4:'in der aktuellen Woche',	5:'nella settimana in corso',6:'en la semana actual', 	7:'na semana atual' 		};
C_XL.d['after tomorrow']= { 0:'after tomorrow',		1:'après demain',			2:'Pojutrze',					3:'Overmorgen',			4:'Übermorgen',				5:'Dopo domani',		6:'Pasado mañana', 				7:'Depois de amanhã'		};
C_XL.d['within 3 days']	= { 0:'Until three days',	1:'Dans trois jours',		2:'Dopiero trzy dni',			3:'Pas drie dagen',		4:'In drei Tagen',			5:'Tra tre giorni',		6:'Dentro de tres días', 		7:'Daqui a três dias'		};

C_XL.d['next week'] 	= { 0:'Next week',		1:'Semaine prochaine',2:'W przyszłym tygodniu',	3:'Volgende week',	4:'Nächste Woche',		5:'Settimana prossima',	6:'La semana que viene',	7:'Na próxima semana'	};
C_XL.d['one week'] 		= { 0:'One week',		1:'Une semaine',	2:'Za tydzień',				3:'Eén week',		4:'Eine Woche',			5:'Una settimana',		6:'Una semana', 			7:'Uma semana'		};
C_XL.d['two weeks'] 	= { 0:'Two weeks',		1:'Deux semaines',	2:'Za dwa tygodnie',		3:'Twee weken',		4:'Zwei Wochen',		5:'Due settimane',		6:'Dos semanas', 			7:'Duas semanas'	};
C_XL.d['three weeks'] 	= { 0:'Three weeks',	1:'Trois semaines',	2:'Za trzy tygodnie',		3:'Drie weken',		4:'Drei Wochen',		5:'Tre settimane',		6:'Tres semanas', 			7:'Três semanas'	};
C_XL.d['five weeks'] 	= { 0:'Five weeks',		1:'Cinq semaines',	2:'Za pięć tygodni',		3:'Vijf weken',		4:'Fünf Wochen',		5:'Cinque settimane',	6:'Cinco semanas', 			7:'Cinco semanas'	};
C_XL.d['six weeks'] 	= { 0:'Six weeks',		1:'Six semaines',	2:'sześć tygodni',			3:'Zes weken',		4:'Sechs Wochen',		5:'Sei settimane',		6:'Seis semanas', 			7:'Seis semanas'	};
C_XL.d['next month'] 	= { 0:'Next month',		1:'Mois prochain',	2:'W przyszłym miesiącu',	3:'Volgende maand',	4:'Nächsten Monat',		5:'Il mese prossimo',	6:'El mes que viene', 		7:'No próximo mês'	};
C_XL.d['one month'] 	= { 0:'One month',		1:'Un mois',		2:'Za miesiąc',				3:'Eén maand',		4:'Ein Monat',			5:'Un mese',			6:'Un mes', 				7:'Um mês'			};
C_XL.d['two months']	= { 0:'Two months',		1:'Deux mois',		2:'Za dwa miesiące',		3:'Twee maand',		4:'Zwei Monate',		5:'Due mesi',			6:'Dos meses', 				7:'Dois meses'		};
C_XL.d['three months'] 	= { 0:'Three months',	1:'Trois mois',		2:'Za trzy miesiące',		3:'Drie maanden',	4:'Drei Monate',		5:'Tre mesi',			6:'Tres meses', 			7:'Três Meses'		};
C_XL.d['four months'] 	= { 0:'Four months',	1:'Quatre mois',	2:'Cztery miesiące',		3:'Vier maanden',	4:'Vier Monate',		5:'Quattro mesi',		6:'Cuatro meses', 			7:'Quatro meses'	};
C_XL.d['five months'] 	= { 0:'Five months',	1:'Cinq mois',		2:'Pięć miesięcy',			3:'Vijf maanden',	4:'Fünf Monate',		5:'Cinque mesi',		6:'Cinco meses', 			7:'Cinco meses'		};
C_XL.d['six months'] 	= { 0:'Six months',		1:'Six mois',		2:'Sześć miesięcy',			3:'Zes maanden',	4:'Sechs Monate',		5:'Sei mesi',			6:'Seis meses', 			7:'Seis meses'		};
C_XL.d['eight months'] 	= { 0:'Eight months',	1:'Huit mois',		2:'Osiem miesięcy',			3:'acht maanden',	4:'acht Monate',		5:'Otto mesi',			6:'Ocho meses', 			7:'Oito meses'		};
C_XL.d['nine months'] 	= { 0:'Nine months',	1:'Neuf mois',		2:'Dziewięć miesięcy',		3:'Negen maanden',	4:'Neun Monate',		5:'Nove mesi',			6:'Nueve meses', 			7:'Nove meses'		};
C_XL.d['one year'] 		= { 0:'One year',		1:'Un an',			2:'Jeden rok',				3:'Een jaar',		4:'Ein Jahr',			5:'Un anno',			6:'Un año', 				7:'Um ano'			};
C_XL.d['specifics']	 	= { 0:'Specifics',		1:'Particularités',	2:'specyficzność',			3:'specificiteit',	4:'Besonderheiten',		5:'Particolarità',		6:'Requisitos especiales', 	7:'Requisitos especiais'	};
C_XL.d['every weekday']	= { 0:'Every',			1:'Chaque',			2:'W każdą',				3:'Ieder',			4:'Jeder',				5:'Ogni',				6:'Cada', 					7:'Cada mililitro de'		};
C_XL.d['duration'] 		= { 0:'Duration',		1:'Durée',			2:'Jak długo',				3:'Duurtijd',		4:'Dauer',				5:'Durata',				6:'Duración', 				7:'Duração'			};
C_XL.d['longer'] 		= { 0:'Longer',			1:'Plus long',		2:'już',					3:'Langer',			4:'Länger',				5:'Più tempo',			6:'Más tiempo', 			7:'Mais tempo'		};
C_XL.d['minutes'] 		= { 0:'minutes',		1:'minutes',		2:'minut',					3:'minuten',		4:'Minuten',			5:'Minuti',				6:'minutos', 				7:'minutos'			};
C_XL.d['min'] 			= { 0:'min',			1:'min',			2:'min',					3:'min',			4:'min',				5:'min',				6:'min', 					7:'min'				};
C_XL.d['staffing'] 		= { 0:'Staffing',		1:'Contingent',		2:'Liczba pracowników',		3:'Staffing',		4:'Personalbesetzung',	5:'Contingente',		6:'Contingente', 			7:'Contingente'		};
C_XL.d['preview'] 		= { 0:'Preview',		1:'aperçu',			2:'Zapowiedź',				3:'Voorbeeld',		4:'Vorschau',			5:'anteprima',			6:'Previsualización', 		7:'Visão geral'		};
	
	
	// tracking / audit
	
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7
	
	
C_XL.d['data class'] 	= { 0:'Data class',		1:'Classe',			2:'Dane klasy',			3:'Class data',			4:'Datenklasse',		5:'Classe',			6:'Clase', 				7:'Classe'			};
C_XL.d['last login'] 	= { 0:'Last login',		1:'Dernier accès',	2:'Ostatnie logowanie',	3:'Laatste inlogging',	4:'Letzter Zugriff',	5:'Ultimo accesso',	6:'Último acceso', 		7:'Último acesso'	};
C_XL.d['data id'] 		= { 0:'Data id',		1:'Identifiant',	2:'Identyfikator',		3:'Identificatie',		4:'Kennung',			5:'Identificativo',	6:'Nombre de usuario', 	7:'Identificador'	};

C_XL.d['creation'] 		= { 0:'Creation',		1:'Création',		2:'Wprowadzenie',		3:'Invoering',			4:'Erstellung',			5:'Creazione',		6:'Creación', 		7:'Criação'			};
C_XL.d['modification'] 	= { 0:'Modification',	1:'Modification',	2:'Modyfikacja',		3:'aanpassing',			4:'Änderung',			5:'Modifica',		6:'Modificación', 	7:'Modificação'		};
C_XL.d['deletion'] 		= { 0:'Deletion',		1:'Effacement',		2:'Usunięcie',			3:'Verwijdering',		4:'Löschung',			5:'Cancellazione',	6:'Supresión', 		7:'apagar'			};
C_XL.d['merging'] 		= { 0:'Merging',		1:'Fusionnement',	2:'Fuzja',				3:'Fusie',				4:'Fusion',				5:'Fusione',		6:'Fusión', 		7:'Fusão'			};

C_XL.d['created on'] 	= { 0:'Created on',		1:'Créé le',		2:'Wpis',				3:'Invoering op',		4:'Erstellt am',	5:'Creato il',			6:'Creado el', 		7:'Criado em'		};
C_XL.d['changed on'] 	= { 0:'Updated on',		1:'Modifié le',		2:'Zmiana',				3:'aangepast op',		4:'Geändert am',	5:'Modificato il',		6:'Modificado el', 	7:'Modificado em'	};
C_XL.d['deleted on'] 	= { 0:'Deleted on',		1:'Effacé le',		2:'Wymazany',			3:'Gewist op',			4:'Gelöscht am',	5:'Cancellato il',		6:'Borrado el', 	7:'apagado em'		};
C_XL.d['rescheduled on']= { 0:'rescheduled on',	1:'reporté le',		2:'przesuwany',			3:'verplaatst op',		4:'Verschoben am',	5:'Riprogrammato il',	6:'aplazado el', 	7:'comunicado em'	};
C_XL.d['merged on'] 	= { 0:'Merged on',		1:'Fusionné le',	2:'Połączenie',			3:'Samengevoegd op',	4:'Zusammengeführt am',		5:'Fuso il',	6:'Fusionado el', 	7:'Fundido em'		};

C_XL.d['created by'] 	= { 0:'Created by',		1:'Créé par',		2:'Stworzony przez',	3:'Invoering door',		4:'Erstellt von',	5:'Creato da',			6:'Creado por', 	7:'Criado por'		};
C_XL.d['changed by'] 	= { 0:'Updated by',		1:'Modifié par',	2:'Edytowany przez',	3:'aangepast door',		4:'Geändert von',	5:'Modificato da',		6:'Modificado por', 7:'Modificado por'	};
C_XL.d['deleted by'] 	= { 0:'Deleted by',		1:'Effacé par',		2:'Zdaje przez',		3:'Gewist door',		4:'Gelöscht von',	5:'Cancellato da',		6:'Borrado por', 	7:'apagado por'		};
C_XL.d['rescheduled by']= { 0:'rescheduled by',	1:'reporté par',	2:'Przełożony przez',	3:'verplaatst door',	4:'Verschoben von',	5:'Riprogrammato da',	6:'aplazado por', 	7:'relatado por'	};
C_XL.d['merged by'] 	= { 0:'Merged by',		1:'Fusionné par',	2:'Scalony przez',		3:'Samengevoegd door',	4:'Zusammengeführt von', 5:'Fuso da',		6:'Fusionado por', 	7:'Fundido por'		};

C_XL.d['creator'] 		= { 0:'Created by',		1:'Créé par',		2:'autor wpisu',		3:'Gemaakt door',		4:'Erstellt von',	5:'Creato da',		6:'Creado por', 	7:'Criado por'		};
C_XL.d['changer'] 		= { 0:'Changed by',		1:'Modifié par',	2:'autor zmiany wpisu',	3:'aangepast door',		4:'Geändert von',	5:'Modificato da',	6:'Modificado por', 7:'Modificado por'	};
C_XL.d['deletor'] 		= { 0:'Deleted by',		1:'Effacé par',		2:'Usunięte przez',		3:'Gewist door',		4:'Gelöscht von',	5:'Cancellato da',	6:'Borrado por', 	7:'apagado por'	};
C_XL.d['deleted'] 		= { 0:'Deleted',		1:'Effacé',			2:'Wymazany',			3:'Gewist',				4:'Gelöscht',		5:'Cancellato',		6:'Borrado', 		7:'apagado'		};
C_XL.d['rescheduled'] 	= { 0:'rescheduled',	1:'reporté',		2:'rzełożony',			3:'verplaatst',			4:'Verschoben',		5:'Riprogrammato',	6:'aplazado', 		7:'relatado'	};
C_XL.d['merged'] 		= { 0:'Merged',			1:'Fusionné',		2:'Scalone',			3:'Samengevoegd',		4:'Verschmolzen', 	5:'Fuso',			6:'Fusionado', 		7:'Fundido'		};

C_XL.d['new'] 			= { 0:'New',			1:'Nouveau',		2:'Nowy',				3:'Nieuwe',				4:'Neu',						5:'Nuovo',					6:'Nuevo', 				7:'Novo'		};
C_XL.d['now'] 			= { 0:'Now',			1:'Maintenant',		2:'Teraz',				3:'Nu',					4:'Jetzt',						5:'adesso',					6:'ahora', 				7:'agora'		};
C_XL.d['never'] 		= { 0:'Never',			1:'Jamais',			2:'Nigdy',				3:'Nooit',				4:'Niemals',					5:'Mai',					6:'Nunca', 				7:'Nunca'		};
C_XL.d['no one'] 		= { 0:'No one',			1:'Personne',		2:'Nikt',				3:'Niemand',			4:'Niemand',					5:'Nessuno',				6:'Ningún', 			7:'Pessoa'		};
C_XL.d['synchro id'] 	= { 0:'Synchro id',		1:'Id synchro',		2:'Id synchronizacja',	3:'Synchronisatie id',	4:'Synchronisierungskennung',	5:'Sincronizzazione di Id',	6:'Sincronización id', 	7:'Sincronização de ID'	};
C_XL.d['synched on'] 	= { 0:'Synchro time',	1:'Synchronisé le',	2:'Zsynchronizowane',	3:'Synchronisatie op',	4:'Synchronisiert am',			5:'Sincronizzato il',		6:'Sincronizado el', 	7:'Sincronizado em'	};
C_XL.d['files'] 		= { 0:'Files',			1:'Fichiers',		2:'Plik',				3:'Bestanden',			4:'Dateien',					5:'Files',					6:'Ficheros', 			7:'Ficheiros'	};
C_XL.d['file'] 			= { 0:'File',			1:'Fichier',		2:'Plik',				3:'Bestand',			4:'Datei',						5:'File',					6:'Fichero', 			7:'Ficheiro'	};
C_XL.d['folder'] 		= { 0:'Folder',			1:'Dossier',		2:'Plik',				3:'Map',				4:'Ordner',						5:'Cartella',				6:'Carpeta', 			7:'Dossier'		};
C_XL.d['document'] 		= { 0:'Document',		1:'Document',		2:'Dokument',			3:'Document',			4:'Dokument',					5:'Documento',				6:'Documento', 			7:'Documento'	};

C_XL.d['drop file here']= { 0:'Drop a file here',			1:'Déposez le fichier ici',		2:'Synchronizuj łącza iCal',	3:'Drop een bestand hier',				4:'Datei hierher verschieben',		5:'Deporre il file qui',			6:'Colocar el fichero aquí', 		7:'Colocar o ficheiro aqui'			};
C_XL.d['ical link'] 	= { 0:'iCal sync link',				1:'Lien de synchro iCal',		2:'Upuścić plik tutaj',			3:'iCal koppeling link',				4:'iCal Sychnronisierungslink',		5:'Link di sincronizzazione iCal',	6:'Enlace de sincronización iCal', 	7:'Ligação de sincronização iCal'	};
C_XL.d['ipad link'] 	= { 0:'Desktop shortcut for iPad',	1:'Raccourci bureau pour iPad',	2:'Skrót na pulpicie do iPada',	3:'Snelkoppeling voor iPad desktop',	4:'Desktopverknüpfung für iPad',	5:'Scorciatoia desk per iPad',		6:'Icono del escritorio para iPad', 7:'atalho do desktop para o iPad'	};

C_XL.d['you overload the agenda'] 	= { 0:'You are going to overload the agenda',	
										1:'Vous allez surcharger l\'agenda',	
										2:'Będziesz przeciążać programu',	
										3:'U gaat de agenda overbelasten',	
										4:'Der Kalender wird überlastet',	
										5:'Sta per sovraccaricare l\'agenda',	
										6:'Está a punto de sobrecargar el calendario', 7:'Vai sobrecarregar o calendário' };
										
C_XL.d['reservations are covered'] 	= { 0:'reservations are covered:',	
										1:'reservations seront couvertes:',	
										2:'zastrzeżenia te są objęte:',	
										3:'reserveringen worden gedekt:',		
										4:'Reservierungen sind gedeckt',	
										5:'prenotazioni coperte',	
										6:'las reservas estarán cubiertas', 7:'as reservas serão abordadas:'	};
										
C_XL.d['another reservation is covered'] = { 0:'another reservation is covered:',	
											1:'une réservation sera couverte:',	
											2:'pokryte jest rezerwacja:',	
											3:'één reservering wordt gedekt:',
											4:'eine weitere Reservierung wird gedeckt:',	
											5:'una prenotazione sarà coperta',	
											6:'otra reserva está cubierta', 7:'uma reserva será abordada:'	};
											
C_XL.d['keep device landscape'] = { 0:'Please keep your device horizontally',	
								1:'SVP gardez votre appareil à l\'horizontale',	
								2:'Proszę trzymać urządzenie poziomo',	
								3:'Gelieve uw apparaat horizontaal te houden',	
								4:'Bitte halten Sie Ihr Gerät horizontal',	
								5:'Per favore mantenga il Suo apparecchio all\'orizzontale',	
								6:'Por favor mantenga su dispositivo al horizontal', 7:'Por favor, mantenha o seu dispositivo na horizontal' };
			

	// resource identification
	
// 		technical 				english:0,		french:1,				polish:2,			dutch:3,				german:4,			italian:5,					spanish:6,						portuguese:7

	
C_XL.d['reservability'] = { 0:'Reservability',	1:'Réservable',			2:'Rezerwacja',		3:'Reserveerbaar',		4:'Reservierbar',	5:'Prenotabile',			6:'Reservable', 				7:'Reservável'						};
C_XL.d['time buffer'] 	= { 0:'time buffer',	1:'temps de maintien',	2:'bufor czas',		3:'tijd buffer',		4:'Pufferzeit',		5:'tempo di mantenimento',	6:'Tiempo de mantenimiento', 	7:'tempo de manutenção do dia'		};
C_XL.d['allday'] 		= { 0:'all day',		1:'à la journée',		2:'na cały dzień',	3:'voor de hele dag',	4:'Ganztag',		5:'al giorno',				6:'todo el día', 				7:'como a consulta'					};
C_XL.d['scheduled'] 	= { 0:'scheduled',		1:'comme le RDV',		2:'na czas wizyty',	3:'volgens afspraak',	4:'Geplant',		5:'come l\'appuntamento',	6:'programado', 				7:'assinatura'						};
C_XL.d['signature'] 	= { 0:'Signature',		1:'Signature',			2:'Podpis',			3:'Benaming',			4:'Unterschrift',	5:'Firma',					6:'Firma', 						7:'assinatura por SMS e e-mails'	};

C_XL.d['signature plhold'] 	= { 0:'signature for SMS and emails',	1:'signature pour SMS et emails',	2:'Podpis do wiadomości SMS i e-maili',	3:'Ondertekening voor SMS en emails',	4:'SMS und Email Unterschrift',	5:'Firma per SMS e email',		6:'Firma para SMS y e-mail',	7:'Enviar SMS e e-mails'	};
C_XL.d['comms autotrigger'] = { 0:'emails and SMS sending',			1:'envois des SMS et emails',		2:'Wysyłanie e-maili i SMS-y',			3:'E-mails en SMS versturen',			4:'SMS und Email versenden',	5:'Invio degli SMS e emails',	6:'Envíos SMS y e-mails', 		7:'Envios automáticos'		};
C_XL.d['comm autotrigger'] 	= { 0:'automatic sending',				1:'envois automatique',				2:'automatyczne wysyłanie',				3:'automatisch verzenden',				4:'automatisch senden',			5:'Invio automatico',			6:'Envío automatico', 			7:'ativado por defeito'		};
C_XL.d['default enabled']  	= { 0:'enabled by default',				1:'activé par défaut',				2:'Domyślnie włączona',					3:'Standaard ingeschakeld',				4:'Standardmäßig aktiviert',	5:'attivato per difetto',		6:'activado por defecto', 		7:'ativado por defeito'	};
C_XL.d['default disabled'] 	= { 0:'disabled by default',			1:'désactivé par défaut',			2:'Domyślnie wyłączona',				3:'standaard uitgeschakeld',			4:'standardmäßig deaktiviert',	5:'disattivato per difetto',	6:'desactivado por defecto',	7:'desabilitado por padrão'		};
C_XL.d['in day enabled'] 	= { 0:'enabled in the current day only',				
								1:'activé seulement dans la journée en cours',				
								2:'włączone tylko w bieżącym dniu',					
								3:'alleen op de huidige dag ingeschakeld',				
								4:'nur am aktuellen Tag aktiviert',	
								5:'abilitato solo nel giorno corrente',		
								6:'habilitado solo en el día actual', 		
								7:'habilitado no dia atual apenas'	};


	// e-resa aggregation mode
C_XL.d['aggregate search'] 	= { 0:'Group appointments',				1:'Grouper les réservations',		2:'Spotkania grupowe',							3:'afspraken groeperen',					4:'Termine gruppieren',									5:'Raggruppare le prenotazioni',			6:'agrupar las reservas', 						7:'Se o dia está vazio'	};
C_XL.d['if day is empty'] 	= { 0:'If the day is empty',			1:'Si la journée est vide',			2:'Jeśli dzień jest pusty',						3:'Indien de dag leeg is',					4:'Wenn der Tag leer ist',								5:'Se la giornata è vuota',					6:'Si el día está vacío', 						7:'Ofereça o mais cedo possível'	};
C_XL.d['fill soon'] 		= { 0:'Propose soonest time option',	1:'Proposer le plus tôt',			2:'Ustaw opcję najwcześniejsze',				3:'Stel de vroegste optie voor',			4:'Den frühesten Termin vorschlagen',					5:'Proporre il più presto',					6:'Proponer lo antes posible', 					7:'Proposer le plus tôt Ofereça o mais cedo possível'	};
C_XL.d['fill late'] 		= { 0:'Propose latest time option',		1:'Proposer le plus tard',			2:'Ustaw ostatnią opcję',						3:'Stel de laatste optie voor',				4:'Den spätesten Termin vorschlagen',					5:'Proporre il più tardi',					6:'Proponer lo más tarde posible', 				7:'Proposer le plus tard Ofereça o mais tarde possível'	};
C_XL.d['fill both'] 		= { 0:'Propose first and last options',	1:'Proposer les plus tôt et tard',	2:'Zapytaj najwcześniejsze i najnowsze opcje',	3:'Stel vroegste en laatste opties voor',	4:'Den frühesten und den spätesten Termin vorschlagen',	5:'Proporre il più presto e il più tardi',	6:'Proponer lo antes y lo más tarde posible', 	7:'Ofereça o mais cedo e o mais tarde'	};
C_XL.d['offer choices from']= { 0:'Offer choices from',				1:'Offrir le choix de',				2:'Oferta z wyborów',							3:'Bieden keuzes uit',						4:'Die Wahl lassen aus',								5:'Offrire la scelta di',					6:'Ofrecer la posibilidad de elegir entre', 	7:'Oferecer a escolha de'	};


	// hourlies
// 		technical 			english:0,			french:1,			polish:2,			dutch:3,				german:4,			italian:5,			spanish:6,		portuguese:7

	
C_XL.d['periodicity']	= { 0:'Periodicity',	1:'Périodicité',	2:'Okresy',			3:'Periodiciteit',		4:'Periodizität',	5:'Periodicità',	6:'Frecuencia', 7:'Periodicidade'	};
C_XL.d['daily'] 		= { 0:'daily',			1:'journalière',	2:'codziennie',		3:'dagelijks',			4:'täglich',		5:'giornaliera',	6:'diario', 	7:'diário'			};
C_XL.d['weekly'] 		= { 0:'weekly',			1:'hebdomadaire',	2:'tydzień',		3:'wekelijks',			4:'wöchtentlich',	5:'settimanale',	6:'semanal', 	7:'semanário'	};
C_XL.d['semimonthly'] 	= { 0:'semimonthly',	1:'bimensuelle',	2:'dwa tygodnie',	3:'halfmaandelijks',	4:'zweimonatlich',	5:'bimestrale',		6:'bimensual', 	7:'bimensal'	};
C_XL.d['2 weeks'] 		= { 0:'2 weeks',		1:'2 semaines',		2:'2 tygodnie',		3:'2 weken',			4:'2 Wochen',		5:'2 settimane',	6:'2 semanas', 	7:'2 semanas'	};
C_XL.d['3 weeks'] 		= { 0:'3 weeks',		1:'3 semaines',		2:'3 tygodnie',		3:'3 weken',			4:'3 Wochen',		5:'3 settimane',	6:'3 semanas', 	7:'3 semanas'	};
C_XL.d['4 weeks'] 		= { 0:'4 weeks',		1:'4 semaines',		2:'4 tygodnie',		3:'4 weken',			4:'4 Wochen',		5:'4 settimane',	6:'4 semanas', 	7:'4 semanas'	};
C_XL.d['monthly'] 		= { 0:'monthly',		1:'mensuelle',		2:'miesięcznie',	3:'maandelijks',		4:'monatlich',		5:'mensile',		6:'mensual', 	7:'mensal'		};
C_XL.d['yearly'] 		= { 0:'yearly',			1:'annuelle',		2:'roczny',			3:'jaarlijkse',			4:'jährlich',		5:'annuale',		6:'anual', 		7:'anual'		};
C_XL.d['copy of']		= { 0:'Copy of ',		1:'Copie de ',		2:'Kopię',			3:'Kopie van ',			4:'Kopie von',		5:'copia di',		6:'copia de', 	7:'Cópia de '	};

C_XL.d['define schedule'] 	= { 0:'Define a time range',	1:'Définir une plage horaire',	2:'Określić czas',		3:'Tijdbereik stellen',			4:'Einen Zeitraum definieren',	5:'Definire una fascia oraria',		6:'Definir una franja horaria', 7:'Definir um intervalo horário'	};
C_XL.d['adjust schedule'] 	= { 0:'adjust a time range',	1:'ajuster une plage horaire',	2:'Ustaw zakres czasu',	3:'Tijdbereik aanpassing',		4:'Einen Zeitraum anpassen',	5:'aggiustare una fascia oraria',	6:'ajustar una franja horaria', 7:'ajustar um intervalo horário'	};
C_XL.d['exc available'] 	= { 0:'Exceptionally available',1:'Libre exceptionnellement',	2:'Wyjątkowo dostępne',	3:'Uitzonderlijk beschikbaar',	4:'außerordentlich verfügbar',	5:'Libero eccezionalmente',			6:'Libre excepcionalmente', 	7:'Livre excecionalmente'			};

C_XL.d['time boxing'] 		= { 0:'Time boxing',		1:'Blocs horaire',		2:'Szczelina',			3:'Tijdsblokken',		4:'Zeitblöcke',			5:'Blocchi orario',	6:'Bloqueos horarios', 	7:'Blocos horário'		};
C_XL.d['exclusive tboxing'] = { 0:'Exclusive',			1:'Exclusif',			2:'Ekskluzywny',		3:'Exclusief',			4:'Exklusiv',			5:'Esclusivo',		6:'Exclusivos', 		7:'Exclusivo'			};
C_XL.d['unavailable'] 		= { 0:'Unavailable',		1:'Indisponible',		2:'Niedostępny',		3:'Niet beschikbaar',	4:'Nicht verfügbar',	5:'Indisponibile',	6:'No disponible', 		7:'Indisponível'		};
C_XL.d['unavailability'] 	= { 0:'Unavailability',		1:'Indisponibilité',	2:'Niedostępność',		3:'Onbeschikbaarheid',	4:'Nichtverfügbarkeit',	5:'Indisponibilità',6:'Indisponibilidad', 	7:'Indisponibilidade'	};
C_XL.d['closed day'] 		= { 0:'Day closed',			1:'Journée fermée',		2:'Dzień zamknięty',	3:'Dag gesloten',		4:'Tag geschlossen',	5:'Giornata chiusa',6:'Día cerrado', 		7:'Dia fechado'			};
	
C_XL.d['time box slicing'] 	= { 0:'subdivide',			1:'Subdiviser',				2:'Dzielić na mniejsze części',	3:'Onderverdelen',				4:'Unterteilen',		5:'Suddividere',			6:'Subdividir', 		7:'Subdividir'		};
C_XL.d['no slicing'] 		= { 0:'No subdivision',		1:'Pas de subdivision',		2:'Nie podział',				3:'Geen onderverdeling',		4:'Keine Unterteilung',	5:'Nessuna suddivisione',	6:'Ninguna subdivisión',7:'Sem subdivisão'	};



	// A C C O U N T    C O N F I G
	//
	
	// global account preferences tabs
		
C_XL.d['account'] 	= { 0:'account',			1:'Compte',				2:'Konto',			3:'account',		4:'Konto',			5:'Conto',			6:'Cuenta', 		7:'Conta'			};
C_XL.d['display'] 	= { 0:'Display',			1:'affichage',			2:'Wyświetlania',	3:'Weergave',		4:'anzeige',		5:'Visualizzazione',6:'Visualización', 	7:'Exibição'		};
C_XL.d['agendas'] 	= { 0:'agendas',			1:'agendas',			2:'Porządek',		3:'agendas',		4:'Kalender',		5:'agende',			6:'agenda', 		7:'agendas'			};
C_XL.d['logins'] 	= { 0:'Logins',				1:'Logins',				2:'Loginów',		3:'Toegang',		4:'Logins',			5:'Logins',			6:'Logins', 		7:'Logins'			};
C_XL.d['comms']		= { 0:'Communications',		1:'Communications',		2:'Komunikacja',	3:'Communicaties',	4:'Kommunikation',	5:'Comunicazioni',	6:'Comunicaciones', 7:'Comunicações'	};
C_XL.d['workcodes'] = { 0:'Performances',		1:'Prestations',		2:'Usług',			3:'Prestaties',		4:'Leistungen',		5:'Prestazioni',	6:'Servicios', 		7:'Prestações'		};
C_XL.d['inclusive'] = { 0:'Inclusive',			1:'Inclus',				2:'Włącznie',		3:'Inbegrepen',		4:'Inklusiv',		5:'Incluso',		6:'Incluido', 		7:'Incluído'		};

	// account

C_XL.d['duplicate account'] = { 0:'Duplicate account',	1:'Dupliquer le compte',		2:'Duplikat konto',			3:'account dupliceren',		4:'Konto duplizieren',			5:'Duplicare conto',		6:'Duplicar cuenta', 		7:'Duplicar conta'	};
C_XL.d['rscs copy mode'] = { 0:'Copy or move agendas', // (TBF)
										1:'Copier ou Déplacer les agendas',	
										2:'Copy or move agendas',
										3:'Copy or move agendas',	
										4:'Copy or move agendas',	
										5:'Copy or move agendas',
										6:'Copy or move agendas', 
										7:'Copy or move agendas'	}
										
C_XL.d['copy rscs to new acc'] = { 0:'Copy selected agendas', // (TBF)
								1:'Copier les agendas sélectionnés',	
								2:'Copy selected agendas',
								3:'Copy selected agendas',	
								4:'Copy selected agendas',	
								5:'Copy selected agendas',
								6:'Copy selected agendas', 
								7:'Copy selected agendas'	}
										
C_XL.d['move rscs to new acc'] = { 0:'Move selected agendas to new account', // (TBF)
								1:'Déplacer les agendas sélectionnés',	
								2:'Move selected agendas to new account',
								3:'Move selected agendas to new account',	
								4:'Move selected agendas to new account',	
								5:'Move selected agendas to new account',
								6:'Move selected agendas to new account', 
								7:'Move selected agendas to new account'	};
								
								
								
C_XL.d['visitors copy mode'] = { 0:'Copy or move agendas', // (TBF)
										1:'Copier quels visitors?',	
										2:'Copy or move agendas',
										3:'Copy or move agendas',	
										4:'Copy or move agendas',	
										5:'Copy or move agendas',
										6:'Copy or move agendas', 
										7:'Copy or move agendas'	}
										
C_XL.d['copy all visitors'] = { 0:'Copy all visitors from register', // (TBF)
								1:'Copier tous les visitors du registre',	
								2:'Copy all visitors from register',
								3:'Copy all visitors from register',	
								4:'Copy all visitors from register',	
								5:'Copy all visitors from register',
								6:'Copy all visitors from register', 
								7:'Copy all visitors from register'	}
										
C_XL.d['copy appointed visitors'] = { 0:'Copy appointed visitors only', // (TBF)
								1:'Copier seulement les visitors vu dans l\'agenda',	
								2:'Copy appointed visitors only',
								3:'Copy appointed visitors only',	
								4:'Copy appointed visitors only',	
								5:'Copy appointed visitors only',
								6:'Copy appointed visitors only', 
								7:'Copy appointed visitors only'	};	
								
								
								
C_XL.d['reservations copy mode'] = { 0:'Scope of reservations process', // (TBF)
									1:'Périmètre pour les réservations',	
									2:'Copy or move agendas',
									3:'Copy or move agendas',	
									4:'Copy or move agendas',	
									5:'Copy or move agendas',
									6:'Copy or move agendas', 
									7:'Copy or move agendas'	}
										
C_XL.d['copy resa current'] = { 0:'Last 4 weeks and future', // (TBF)
								1:'Les 4 dernières semaines et le futur',	
								2:'Copy all visitors from register',
								3:'Copy all visitors from register',	
								4:'Copy all visitors from register',	
								5:'Copy all visitors from register',
								6:'Copy all visitors from register', 
								7:'Copy all visitors from register'	}
										
C_XL.d['include archived resas'] = { 0:'Include also the complete history', // (TBF)
								1:'Inclure également l\'historique complet',	
								2:'Copy appointed visitors only',
								3:'Copy appointed visitors only',	
								4:'Copy appointed visitors only',	
								5:'Copy appointed visitors only',
								6:'Copy appointed visitors only', 
								7:'Copy appointed visitors only'	};	
								
								
								
C_XL.d['accopy target mode'] = { 0:'Target', // (TBF)
										1:'Cible',	
										2:'Copy or move agendas',
										3:'Copy or move agendas',	
										4:'Copy or move agendas',	
										5:'Copy or move agendas',
										6:'Copy or move agendas', 
										7:'Copy or move agendas'	}
										
C_XL.d['make a new account'] = { 0:'Make a new account', // (TBF)
								1:'Créer un nouveau compte',	
								2:'Copy all visitors from register',
								3:'Copy all visitors from register',	
								4:'Copy all visitors from register',	
								5:'Copy all visitors from register',
								6:'Copy all visitors from register', 
								7:'Copy all visitors from register'	}
										
C_XL.d['target an existing account'] = { 0:'Target an existing account', // (TBF)
								1:'Compléter un compte existant',	
								2:'Copy appointed visitors only',
								3:'Copy appointed visitors only',	
								4:'Copy appointed visitors only',	
								5:'Copy appointed visitors only',
								6:'Copy appointed visitors only', 
								7:'Copy appointed visitors only'	};	
								
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7
								
								
C_XL.d['colors&status'] 	= { 0:'Colors & Status',	1:'Couleurs & Statuts',			2:'Kolory i status',		3:'Kleuren & Status',		4:'Farben & Status',			5:'Colori & Status',		6:'Colores y estados', 		7:'Cores e Estatutos'	};
C_XL.d['business name']		= {	0:'account name',		1:'Nom du compte',				2:'Nazwa konta',			3:'accountnaam',			4:'Kontoname',					5:'Nome del conto',			6:'Nombre de la cuenta',	7:'Nome da conta'	};
C_XL.d['customer id']		= {	0:'Customer id',		1:'Numéro de client',			2:'Numer klienta',			3:'Klant nummer',			4:'Kundennummer',				5:'Numero di cliente',		6:'Número cliente', 		7:'Número de cliente'	};
C_XL.d['business']			= { 0:'Business',			1:'Etablissement',				2:'Firma',					3:'Business',				4:'Firma',						5:'azienda',				6:'Empresa', 				7:'Estabelecimento'	};
C_XL.d['configuration']		= { 0:'Configuration',		1:'Configuration',				2:'Konfiguracja',			3:'Configuratie',			4:'Einstellung',				5:'Configurazione',			6:'Configuración', 			7:'Configuração'	};
C_XL.d['business info']		= { 0:'Business info',		1:'Informations de base',		2:'Dane podstawowe',		3:'algemene gegevens',		4:'allgemeine Informationen',	5:'Informazioni di base',	6:'Información básica', 	7:'Informações de base'	};
C_XL.d['patient or client']	= { 0:'Visitors',			1:'Visiteurs',					2:'Klienci',				3:'Bezoekers',				4:'Besucher',					5:'Visitatori',				6:'Visitantes', 			7:'Visitantes'	};

C_XL.d['support contact']	= { 0:'Your seller',		1:'Votre délégué',				2:'Przedstawiciel',			3:'U afgevaardigd',			4:'Ihr Verkäufer',				5:'Il Suo rappresentante',	6:'Su delegado', 			7:'O seu delegado'	};
C_XL.d['your contract']		= { 0:'Your contract',		1:'Votre contrat',				2:'Umowa',					3:'U contrakt',				4:'Ihr Vertrag',				5:'Il Suo contratto',		6:'Su contrato', 			7:'O seu contrato'	};


/*  ONLINE PAYMENT - Mobminder-pay */	

C_XL.d['paiement ok']		= { 0:'Paiement status',		1:'arriérés',				2:'Stan płatności',			3:'Regelings status',		4:'Zahlungsstatus',				5:'arretrati',					6:'Estado de pago', 		7:'atrasos'	};
C_XL.d['e-handle']			= { 0:'e-Pay Provider Handle',	1:'Référence e-payment',	2:'Referencja e-płatności',	3:'e-Pay Provider referte',	4:'e-Pay Anbieterreferenz',		5:'Riferimento e-pagamento',	6:'Referencia e-pago', 		7:'Referência e-pagamento'	};
C_XL.d['suspension']		= { 0:'account suspended',		1:'Suspension du service',	2:'Konto zawieszone',		3:'Dienstschorsing',		4:'Konto gesperrt',				5:'Sospensione del servizio',	6:'Suspensión del servicio',7:'Suspensão do serviço'	};
	
C_XL.d['payment'	]		= { 0:'Payment',			1:'Paiement',					2:'Płatność',				3:'Betaling',				4:'Zahlung',					5:'Pagamento',		6:'Pago', 		7:'Pagamento'	};
C_XL.d['payment ok']		= { 0:'Payment ok',			1:'En ordre',					2:'Zapłacono',				3:'Klaar',					4:'Zahlung ok',					5:'Pagamento ok',	6:'En orden', 	7:'Em dia'	};
C_XL.d['payment nok']		= { 0:'Missing',			1:'En défaut',					2:'Brak wpłaty',			3:'Defect',					4:'außer Betrieb',				5:'Mancante',		6:'En defecto', 7:'Em falta'	};
	
C_XL.d['no e-payment']		= { 0:'No e-payment',		1:'Pas d\'e-paiement',			2:'Bez e-płatności',		3:'Geen e-betaling',		4:'Kein E-Payment',				5:'Nessun e-pagamento',	6:'Ningún e-pago', 			7:'Sem e-pagamento'	};
C_XL.d['ePayment bank']		= { 0:'Bank transfer',		1:'Domiciliation',				2:'Zlecenie stałe',			3:'Domiciliëring',			4:'Überweisung',				5:'Bonifico',			6:'Transferencia bancaria', 7:'Domiciliação'	};
C_XL.d['ePayment VISA']		= { 0:'VISA card',			1:'Carte VISA',					2:'VISA',					3:'VISA kaart',				4:'VISA',						5:'Carta VISA',			6:'Tarjeta VISA', 			7:'Cartão VISA'	};
C_XL.d['ePayment MASTER']	= { 0:'MASTER card',		1:'Carte MASTER',				2:'MasterCard',				3:'MASTER kaart',			4:'MasterCard',					5:'Mastercard',			6:'Tarjeta MASTERCARD', 	7:'Cartão MASTER'	};

C_XL.d['payment']			= { 0:'Payment',			1:'Paiement',					2:'Płatność',				3:'Betaling',				4:'Zahlung',					5:'Pagamento',				6:'Pago', 						7:'Pagamento'	};
C_XL.d['e-payment']			= { 0:'e-Payment',			1:'e-Paiement',					2:'e-płatność',				3:'e-Payment',				4:'e-Zahlung',					5:'e-Pagamento',			6:'e-Pago', 					7:'e-pagamento'	};
C_XL.d['e-invoicing']		= { 0:'e-Invoicing',		1:'e-Facturation',				2:'e-faktura',				3:'e-Fakturatie',			4:'e-Rechnung',					5:'e-Fatturazione',			6:'e-Facturación', 				7:'e-faturação'	};
C_XL.d['pricing']			= { 0:'Pricing',			1:'Tarif',						2:'Cennik',					3:'Tarief',					4:'Tarif',						5:'Tariffa',				6:'Precio', 					7:'Preço'	};
C_XL.d['norm fee']			= { 0:'Fee',				1:'abonnement',					2:'abonament',				3:'abonement',				4:'abo',						5:'abbonamento',			6:'Suscripción', 				7:'Subscrição'	};
C_XL.d['credit']			= { 0:'Credits',			1:'Crédits',					2:'Kredyty',				3:'Krediet',				4:'Gutschrift',					5:'Crediti',				6:'Créditos', 					7:'Créditos'	};
C_XL.d['ex fee']			= { 0:'Exceptional fee',	1:'abonement crédit',			2:'abonament (kredyty)',	3:'Krediet abonement',		4:'abo Gutschrift',				5:'abbonamento credito',	6:'Suscripción de crédito', 	7:'Subscrição de crédito'	};
C_XL.d['rate']				= { 0:'Tax rate',			1:'TVA',						2:'VAT',					3:'BTW',					4:'MwSt',						5:'IVA',					6:'IVA', 						7:'IVA'	};

			
C_XL.d['qr online payment'] 		= { 0:'Online payment', 			1:'Paiement en ligne', 			2:'Płatność online', 			3:'Online betaling', 			4:'Onlinebezahlung', 		5:'Pagamento online', 			6:'Pago en línea', 					7:'Pagamento online' 			};
C_XL.d['qr amount'] 				= { 0:'Amount (EUR)', 				1:'Montant (EUR)', 				2:'Kwota (EUR)', 				3:'Bedrag (EUR)', 				4:'Betrag (EUR)', 			5:'Importo (EUR)', 				6:'Importe (EUR)', 					7:'Valor (EUR)' 				};
C_XL.d['qr communication'] 			= { 0:'Communication', 				1:'Communication', 				2:'Komunikacja', 				3:'Communicatie', 				4:'Kommunikation', 			5:'Comunicazione', 				6:'Comunicación', 					7:'Comunicação' 				};
C_XL.d['qr beneficiary name'] 		= { 0:'Beneficiary name', 			1:'Nom bénéficiaire', 			2:'Nazwa odbiorcy', 			3:'Naam begunstigde', 			4:'Name des Begünstigten', 	5:'Nome del beneficiario', 		6:'Nombre del Beneficiario', 		7:'Nome do beneficiário' 		};
C_XL.d['qr beneficiary account'] 	= { 0:'Beneficiary account IBAN', 	1:'IBAN du compte bénéficiaire', 2:'Konto beneficjenta (IBAN)', 3:'Begunstigdenrekening (IBAN)',4:'Empfängerkonto (IBAN)', 	5:'Conto beneficiario (IBAN)', 	6:'Cuenta de beneficiario (IBAN)',	7:'Conta do beneficiário (IBAN)'};
C_XL.d['qr beneficiary bic'] 		= { 0:'Beneficiary account BIC', 	1:'BIC du compte bénéficiaire', 2:'Konto beneficjenta (BIC)', 	3:'Begunstigdenrekening (BIC)',4:'Empfängerkonto (BIC)', 	5:'Conto beneficiario (BIC)', 	6:'Cuenta de beneficiario (BIC)',	7:'Conta do beneficiário (BIC)'};

// 		technical 					english:0,							french:1,								polish:2,									dutch:3,					german:4,							italian:5,							spanish:6,							portuguese:7
C_XL.d['CCBC-IBAN-IBAN-IBAN'] 	= { 0:'GB98 MIDL 0700 9312 3456 78', 	1:'FR76 3000 6000 0112 3456 7890 189', 	2:'PL10 1050 0099 7603 1234 5678 9123', 	3:'BE71 0961 2345 6769',	4:'DE91 1000 0000 0123 4567 89', 	5:'IT79 2100 0813 6101 2345 6789', 	6:'ES79 2100 0813 6101 2345 6789',	7:'PT50 0033 0000 5013 1901 229 05'};




	// contracts
C_XL.d['contract data']		= { 0:'Contract #',			1:'Paramètres du contrat #',	2:'Parametry umowy nr #',	3:'Contract gegevens. #',	4:'Einstellungen für Vertrag #',	5:'Parametri del conto',		6:'Parámetros del contrato', 	7:'Parâmetros do contrato #'	};
C_XL.d['contractor']		= { 0:'Contractor',			1:'Contractant',				2:'Strona',					3:'Contractnemer',			4:'Vetragsnehmer',					5:'Contraente',					6:'Contratista', 				7:'Contratante'	};
C_XL.d['effective by']		= { 0:'Effect date',		1:'Prise d\'effet',				2:'Data ważności',			3:'Invoeringsdatum',		4:'Wirkungsdatum',					5:'Data d\'entrata in vigore',	6:'Entrada en vigor', 			7:'Entrada em vigor'	};
C_XL.d['business reg']		= { 0:'Business register',	1:'Registre de commerce',		2:'EDG/KRS',				3:'Handels registratie',	4:'Handelsregister',				5:'Registro di commercio',		6:'Registro comercial', 		7:'Registo comercial'	};
C_XL.d['tax reg']			= { 0:'Tax register',		1:'Numéro de TVA',				2:'NIP',					3:'BTW nummer',				4:'USt-IdNr',						5:'Partita IVA',				6:'Número de IVA', 				7:'Número IVA'	};

	
	
	// display preferences

C_XL.d['default gender'] 	= { 0:'Default gender',		1:'Civilité par défaut',			2:'Płci default',			3:'Standaard geslacht',	4:'Standard Geschlecht',		5:'Genere per difetto',					6:'Género por defecto', 			7:'Forma de tratamento por defeito'	};
C_XL.d['time slice']		= { 0:'Hours slicing',		1:'Division des heures',			2:'Podział godzin',			3:'Uren opsplitsing',	4:'Stundeneinteilung',			5:'Divisione delle ore',				6:'División de las horas', 			7:'Divisão das horas'	};
C_XL.d['duration span']		= { 0:'Duration span',		1:'Limites de durée',				2:'Czas wizyty',			3:'Duurtijd limieten',	4:'Dauerbegrenzungen',			5:'Limiti delle durate',				6:'Limites de duración', 			7:'Limites de duração'	};
C_XL.d['duration increment']= { 0:'Duration increment',	1:'Incrément de durée',				2:'Przyrost czasu wizyty',	3:'Duurtijd increment',	4:'Dauererweiterungen',			5:'aumento della durata',				6:'aumento de duración', 			7:'aumento da duração'	};
C_XL.d['time zone']			= { 0:'Time zone',			1:'Fuseau horaire',					2:'Strefa czasu',			3:'Tijdzone',			4:'Zeitzone',					5:'Fuso orario',						6:'Huso horario', 					7:'Fuso horário'	};
C_XL.d['display weeknumb']	= { 0:'Display week number',1:'afficher le numéro de semaine',	2:'Pokaż numer tygodnia',	3:'Toon weeknummer',	4:'Wochennummer anzeigen',		5:'Mostrare il numero della settimana',	6:'Enseñar el número de semana',	7:'Mostrar o número da semana'	};
C_XL.d['planning range']	= { 0:'Planning timespan',	1:'Plage horaire affichée',			2:'Wyświetlanie grafiku',	3:'Planning tijd span',	4:'angezeigte Zeitspanne',		5:'Fascia oraria mostrata',				6:'Franja horaria mostrada', 		7:'Intervalo de tempo exibido'	};
C_XL.d['css skin']			= { 0:'Theme',				1:'Thème',							2:'Kompozycja',				3:'Thema',				4:'Thema',						5:'Tema',								6:'Tema', 							7:'Tema'	};

C_XL.d['visitors alias'] 	= { 0:'Visitors alias',	1:'alias visiteurs',	2:'alias gości',		3:'Bezoeker alias',	4:'Besucherpseudo',		5:'Pseudonimo visitatore',	6:'Seudónimo visitante', 	7:'Pseudónimo de visitantes'	};
C_XL.d['visitors patients'] = { 0:'Patients',		1:'Patients',			2:'Pacjentów',			3:'Patiënten',		4:'Patienten',			5:'Pazienti',				6:'Pacientes', 				7:'Pacientes'		};
C_XL.d['visitors clients'] 	= { 0:'Clients',		1:'Clients',			2:'Klienci',			3:'Klanten',		4:'Kunden',				5:'Clienti',				6:'Clientes', 				7:'Clientes'		};
C_XL.d['visitors particip'] = { 0:'Participants',	1:'Participants',		2:'Uczestnicy',			3:'Deelnemers',		4:'Teilnehmer',			5:'Partecipanti',			6:'Participantes', 			7:'Participantes'	};

C_XL.d['1 slice'] 	= { 0:'1 time division',	1:'Une division de temps',	2:'Jedna jednostka czasu',	3:'Eén uur opslitsing',		4:'Eine Zeiteinteilung',	5:'Una divisione di tempo',	6:'Una división de tiempo', 7:'Uma divisão do tempo'	};
C_XL.d['2 slices'] 	= { 0:'2 time divisions',	1:'2 divisions de temps',	2:'Dwie jednostki czasu',	3:'2 uur opslitsingen',		4:'2 Zeiteinteilungen',		5:'2 divisioni di tempo',	6:'2 divisiones de tiempo', 7:'2 divisões do tempo'	};
C_XL.d['3 slices'] 	= { 0:'3 time divisions',	1:'3 divisions de temps',	2:'Trzy jednostki czasu',	3:'3 uur opslitsingen',		4:'3 Zeiteinteilungen',		5:'3 divisioni di tempo',	6:'3 divisiones de tiempo', 7:'3 divisões do tempo'	};
C_XL.d['4 slices'] 	= { 0:'4 time divisions',	1:'4 divisions de temps',	2:'Cztery jednostki czasu',	3:'4 uur opslitsingen',		4:'4 Zeiteinteilungen',		5:'4 divisioni di tempo',	6:'4 divisiones de tiempo', 7:'4 divisões do tempo'	};
C_XL.d['5 slices'] 	= { 0:'5 time divisions',	1:'5 divisions de temps',	2:'Pięć jednostek czasu',	3:'5 uur opslitsingen',		4:'5 Zeiteinteilungen',		5:'5 divisioni di tempo',	6:'5 divisiones de tiempo', 7:'5 divisões do tempo'	};
C_XL.d['6 slices'] 	= { 0:'6 time divisions',	1:'6 divisions de temps',	2:'Sześć jednostek czasu',	3:'6 uur opslitsingen',		4:'6 Zeiteinteilungen',		5:'6 divisioni di tempo',	6:'6 divisiones de tiempo', 7:'6 divisões do tempo'	};

C_XL.d['sticker font size'] = { 0:'Text size on labels',	
								1:'Taille du texte sur les étiquettes',	
								2:'Rozmiar tekstu na etykietach',	
								3:'Tekstgrootte op etiketten',	               
								4:'Textgröße auf Etiketten',	
								5:'Taglia del testo sulle etichette',
								6:'Tamaño del texto en las etiquetas', 7:'Tamanho do texto nas etiquetas'
								};
								
C_XL.d['large font'] 	= { 0:'Large',	1:'Grande',		2:'Duży',	3:'Grote',		4:'Groß',	5:'Grande',	6:'Grande', 	7:'Grande'	};
C_XL.d['medium font'] 	= { 0:'Medium',	1:'Moyenne',	2:'Średni',	3:'Medium',		4:'Mittel',	5:'Media',	6:'Media', 		7:'Médio'	};
C_XL.d['small font'] 	= { 0:'Small',	1:'Petite',		2:'Mały',	3:'Kleine',		4:'Klein',	5:'Piccola',6:'Pequeña', 	7:'Pequeno'	};

C_XL.d['upper left date'] 	= { 0:'Upper left date shortcut',	1:'Raccourci date en haut à gauche',	2:'Data skrót lewy górny',	3:'Linksboven datum snelkoppeling',		4:'Obere linke datum Verknüpfung',	5:'Scorciatoia data in alto a sinistra',	6:'acceso directo fecha arriba a la izquierda', 7:'atalho da data no canto superior esquerdo'	};
C_XL.d['current date'] 		= { 0:'Current date',				1:'Date du jour',						2:'Data bieżącego dnia',	3:'Datum van de huidige dag',			4:'aktuelles datum',				5:'Data di oggi',							6:'Fecha de hoy', 								7:'Data de hoje'	};


	// preferences colors and status

// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7	
	
C_XL.d['ccss color app']	 	= { 0:'appointment color',		1:'Couleur de RDV',					2:'Powołanie kolor',			3:'afspraak kleur',				4:'Terminfarbe',					5:'Colore dell\'appuntamento',	6:'Color de la cita', 			7:'Cor da consulta'	};
C_XL.d['ccss color event']	 	= { 0:'Unavailability color',	1:'Couleur d\'indisponibilité',		2:'Kolor Niedostępność',	 	3:'Kleur voor afwezigheid',		4:'Farbe für Nichtverfügbarkeit',	5:'Colore di indisponibilità',	6:'Color de indisponibilidad', 	7:'Cor de indisponibilidade'	};
C_XL.d['ccss color fcal']	 	= { 0:'Optional resource color',1:'Couleur de ressource optionelle',2:'Opcjonalny kolor zasobu',	3:'Optionele middel kleur',		4:'Farbe für optionale Ressourcen',	5:'Colore di risorsa opzionale',6:'Color de recurso opcional', 	7:'Cor de recurso opcional'	};
C_XL.d['ccss color visitor'] 	= { 0:'visitor color',			1:'Couleur de visitor',				2:'Kolor visitor',				3:'visitor kleur',				4:'Farbe für Besucher',				5:'Colore di visitatore',		6:'Color de visitante', 		7:'Cor do visitante'	};
C_XL.d['ccss color note'] 		= { 0:'Note color',				1:'Couleur de note',				2:'Kolor uwaga',				3:'Notitie kleur',				4:'Farbe für Notizen',				5:'Colore di nota',				6:'Color de nota', 				7:'Cor da nota'	};
C_XL.d['ccss color task'] 		= { 0:'Task color',				1:'Couleur de tâche',				2:'Kolor zadanie',				3:'Taak kleur',					4:'Farbe für Aufgaben',				5:'Colore di attività',			6:'Color de tarea', 			7:'Cor da tarefa'	};
C_XL.d['ccss color chat']		= { 0:'Chat color',				1:'Couleur de chat',				2:'Kolor rozmowa',				3:'Chat kleur',					4:'Farbe für Chat',					5:'Colore di chat',				6:'Color de chat', 				7:'Cor do chat'	};
C_XL.d['ccss color file']		= { 0:'File color',				1:'Couleur de fichier',				2:'kolor plik',					3:'File kleur',					4:'Farbe für Dateien',				5:'Colore di file',				6:'Color de fichero', 			7:'Cor do ficheiro'	};

C_XL.d['ccss pattern app']	 	= { 0:'appointment status',		1:'Statut de RDV',					2:'Powołanie status',			3:'afspraak status',			4:'Terminstatus',					5:'Status di appuntamento',		6:'Estado de cita', 			7:'Estado da consulta'	};
C_XL.d['ccss pattern event'] 	= { 0:'Unavailability status',	1:'Statut d\'indisponibilité',		2:'Status Niedostępność',	 	3:'afwezigheid status',			4:'Nichtverfügbarkeitsstatus',		5:'Status di indisponibilità',	6:'Estado de indisponibilidad', 7:'Estado de indisponibilidade'	};
C_XL.d['ccss pattern fcal']		= { 0:'Optional resource status',1:'Statut de ressource optionelle',2:'Opcjonalnie stanu zasobów',	3:'Optionele middel status',	4:'Status optionaler Ressourcen',	5:'Status di risorsa opzionale',6:'Estado de recurso opcional', 7:'Estado de recurso opcional'	};
C_XL.d['ccss pattern visitor']	= { 0:'visitor status',			1:'Statut de visitor',				2:'Status visitor',				3:'visitor status',				4:'Besucherstatus'				,	5:'Status del visitatore',		6:'Estado del visitante', 		7:'Estado de visitante'	};
C_XL.d['ccss pattern note']		= { 0:'Note status',			1:'Statut de note',					2:'Status uwaga',				3:'Notitie status',				4:'Notizstatus',					5:'Status di nota',				6:'Estado de nota', 			7:'Estado de nota'	};
C_XL.d['ccss pattern task']		= { 0:'Task status',			1:'Statut de tâche',				2:'Status zadanie',				3:'Taak status',				4:'aufgabenstatus',					5:'Status di attività',			6:'Estado de tarea', 			7:'Estado de tarefa'	};
C_XL.d['ccss pattern chat']		= { 0:'Chat status',			1:'Statut de chat',					2:'Status rozmowa',				3:'Chat status',				4:'Chatstatus',						5:'Status di chat',				6:'Estado de chat', 			7:'Estado de chat'	};
C_XL.d['ccss pattern file']		= { 0:'File status',			1:'Statut de fichier',				2:'Status plik',				3:'File status',				4:'Dateistatus',					5:'Status di file',				6:'Estado de fichero', 			7:'Estado de ficheiro'	};
	
C_XL.d['ccss tag app']	 		= { 0:'appointment tags',		1:'Tags de RDV',					2:'Powołanie tags',				3:'afspraak tags',				4:'Tags für Termine',				5:'Tags di appuntamento',		6:'Tags de cita', 				7:'Tags de consulta'	};
C_XL.d['ccss tag event'] 		= { 0:'Unavailability tags',	1:'Tags d\'indisponibilité',		2:'Tags Niedostępność',	 		3:'afwezigheid tags',			4:'Tags für Nichtverfügbarkeit',	5:'Tags d\'indisponibilità',	6:'Tags de indisponibilidad', 	7:'Tags de indisponibilidade'		 	};
C_XL.d['ccss tag fcal']			= { 0:'Optional resource tags',	1:'Tags de ressource optionelle',	2:'Opcjonalnie Tags zasobów',	3:'Optionele middel tags',		4:'Tags für optionale Ressourcen',	5:'Tags di risorsa opzionale',	6:'Tags de recurso opcional', 	7:'Tags de recurso opcional'	};
C_XL.d['ccss tag visitor']		= { 0:'visitor tags',			1:'Tags de visitor',				2:'Tags visitor',				3:'visitor tags',				4:'Besuchertags',					5:'Tags di visitatore',			6:'Tags de visitante', 			7:'Tags de visitante'	};
C_XL.d['ccss tag note']			= { 0:'Note tags',				1:'Tags de note',					2:'Tags uwaga',					3:'Notitie tags',				4:'Notiztags',						5:'Tags di nota',				6:'Tags de nota', 				7:'Tags de nota'	};
C_XL.d['ccss tag task']			= { 0:'Task tags',				1:'Tags de tâche',					2:'Tags zadanie',				3:'Taak tags',					4:'Tags für Aufgaben',				5:'Tags di attività',			6:'Tags de tarea', 				7:'Tags de tarefa'	};
C_XL.d['ccss tag chat']			= { 0:'Chat tags',				1:'Tags de chat',					2:'Tags rozmowa',				3:'Chat tags',					4:'Tags für Chats',					5:'Tags di chat',				6:'Tags de chat', 				7:'Tags de chat'	};
C_XL.d['ccss tag file']			= { 0:'File tags',				1:'Tags de fichier',				2:'Tags plik',					3:'File tags',					4:'Tags für Dateien',				5:'tags di file',				6:'Tags de fichero', 			7:'Tags de ficheiro'	};

C_XL.d['custom colors and status'] 	= { 0:'Custom colors & status',		1:'Couleurs & statuts personnalisés',	2:'Niestandardowe kolory i status',	3:'aangepaste kleuren & status',	4:'Benutzerdefinierte Farben und Status',		5:'Colori & Status personalizzati',	6:'Colores y estados personalizados', 	7:'Cores e estado personalizado'	};
C_XL.d['default colors and status'] = { 0:'Default colors & status',	1:'Couleurs & statuts par défaut',		2:'Domyślne kolory i status',		3:'Standaard kleuren & status',		4:'Standardmäßige Farben und Status',			5:'Colori & Status per difetto',	6:'Colores y estados por defecto', 		7:'Cores e estado por defeito'	};

	// preferences agendas

C_XL.d['business cals'] 		= { 0:'Business rooms',		1:'Postes de travail',		2:'Stanowiska',			3:'Werk posten',		4:'arbeitsplätze',	5:'Spazi di lavoro',	6:'Estaciones de trabajo', 7:'Estações de trabalho'	};

C_XL.d['bcal creation note'] = { 0:'<b>Main agendas</b>: Any setup has at least one such agenda. The search assistent will always assign one of those resources.',		
							1:'<b>Agendas principaux</b>: Un setup aura toujours au moins un agenda de type principal. L\'assistant de recherche implique toujours une resource principale.',			
							2:'<b>Główne kalendarze</b>: Każda instytucja ma co najmniej jeden główny program. Szukaj Companion zawsze przypisać jeden z tych kalendarzy.',		
							3:'<b>Hoofd agenda\'s</b>: Elke instelling heeft ten minste één hoofd agenda. De zoek assistent zal altijd één van die agenda\'s toewijzen.',
							4:'<b>Hauptkalender</b>: Jede Installation besitzt mindestens einen dieser Hauptkalender. Der Suchassistent setzt immer einen dieser Hauptressourcen voraus.',	
							5:'<b>Agende principali</b>: Un setup avrà sempre almeno un\'agenda principale. L\'assistente di ricerca implica sempre una risorsa principale.',	
							6:'<b>Calendario principal</b>: Una instalación siempre tendrá por lo menos un calendario principal. El asistente de búsqueda siempre implica una fuente principal.', 7:'<b>Calendários principais</b>: Uma instalação terá sempre pelo menos um calendário do tipo principal. O assistente de pesquisa envolve sempre um recurso principal.'
};
C_XL.d['ucal creation note'] = { 0:'<b>Staffed agendas</b>: The search assistent will force assignment of one or more of those resources,	depending on the selected staffing.',		
							1:'<b>Agendas contingent</b>: L\'assistant de recherche impliquera toujours automatiquement une ou plusieurs de ces resources,	en fonction de la sélection.',			
							2:'<b>Obsadzone kalendarze</b>: Asystent wyszukiwania zmusi podział jednego lub więcej z tych ressources,	w zależności od wyboru.',		
							3:'<b>Toewijsbare Agenda\'s</b>: De zoek assistent zal dwingen toewijzing van een of meer van deze resourcen,	afhankelijk van de selectie.',
							4:'<b>Personalbesetzte Kalender</b>: Abhängig von der ausgewählten Personalbesetzung ordnet der Suchassistent ordnet immer automatisch einen dieser Ressourcen zu.',	
							5:'<b>Agende contingente</b>: L\'assistente di ricerca implicherà sempre automaticamente una o varie di queste risorse,	a seconda della selezione.',		
							6:'<b>Calendarios contingentes</b>: El asistente de búsqueda siempre implicará automaticamente una o más fuentes, dependiendo de la selección.', 7:'<b>Calendários contingentes</b>: O assistente de pesquisa implicará sempre automaticamente um ou vários destes recursos,	em função da seleção.'
};
C_XL.d['fcal creation note'] = { 0:'<b>Optional agendas</b>: The search assistent will assign one the selected resources,	they are optional.',		
							1:'<b>Agendas facultatifs</b>: L\'assistant de recherche impliquera une de ces resources sélectionnées avant la recherche. La sélection est optionelle.',			
							2:'<b>Opcjonalne kalendarze</b>: Asystent badawczy obejmuje jedną z tych wybranych zasobów przed wyszukiwania. Wybór jest opcjonalny.',		
							3:'<b>Optionele agenda\'s</b>: De zoek assistent zal één van deze resourcen toewijzen,	indien geselecteerd. De selectie is optioneel.',
							4:'<b>Optionale Kalender</b>: Der Suchassistent ordnet einen der ausgewählten Ressourcen zu, sie sind optional.',	
							5:'<b>Agende facoltative</b>: L\'assistente di ricerca implicherà una delle risorse selezionate prima della ricerca. La selezione è opzionale.',	
							6:'<b>Calendarios opcionales</b>: El asistente de búsqueda implicará una de estas fuentes seleccionadas antes de la búsqueda. La selección es opcional.', 7:'<b>Calendários opcionais</b>: O assistente de pesquisa envolverá um destes recursos selecionados antes da pesquisa. A seleção é opcional.'	};



	// preferences communications
	
// 		technical 					english:0,							french:1,							polish:2,						dutch:3,						german:4,							italian:5,					spanish:6,						portuguese:7

	
C_XL.d['phone region']			= { 0:'Regional phone prefix',			1:'Préfixe téléphone régional',		2:'Prefix kraj',				3:'Land telefoon prefix',		4:'Ländervorwahl',					5:'Prefisso telefonico regionale',	6:'Prefijo telefónico regional', 		7:'Prefixo de telefone regional'	};
C_XL.d['email senderid']		= { 0:'Email sender address',			1:'adresse E-mail émettrice',		2:'adres e-mail nadawcy',		3:'afzender E-mail adres',		4:'absenderadresse',				5:'Indirizzo email emittente',		6:'Dirección e-mail emisor', 			7:'Endereço de email do remetente'	};
C_XL.d['sms senderid']			= { 0:'SMS sender ID',					1:'Numéro émetteur des SMS',		2:'Nadawcy wiadomości SMS id',	3:'SMS Sender ID',				4:'SMS Absendernummer',				5:'Numero emittente degli SMS',		6:'Número emisor de los SMS', 			7:'Número do remetente dos SMS'	};
C_XL.d['reminders options'] 	= { 0:'Reminders options',				1:'Options des rappels',			2:'Opcje przypomnień',			3:'Herinneringen opties',		4:'Optionale Erinnerungen',			5:'Opzioni dei promemoria',			6:'Opciones de los recordatorios', 		7:'Opções de lembretes'	};
C_XL.d['send sms messages']		= { 0:'activate sms messages sending',	1:'activer l\'envoi des sms',		2:'Wysyłanie SMS-ów',			3:'Stuur sms berichtjes',		4:'SMS Versand aktivieren',			5:'attivare l\'invio degli sms',	6:'activar el envío de los SMS', 		7:'ativar o envio de sms'	};
C_XL.d['activate messaging']	= { 0:'activate messaging',				1:'activer l\'envoi de messages',	2:'aktywuj wiadomości',			3:'Berichtjes sturen',			4:'Nachrichtenversand aktivieren',	5:'attivare l\'invio dei messaggi',	6:'activar el envío de los mensajes', 	7:'ativar o envio de mensagens'	};

C_XL.d['reminder']				= {	0:'Reminder',						1:'Rappel',							2:'Przypomnienie',						3:'Herinnering',						4:'Erinnerung',						5:'Promemoria',								6:'Recordatorio', 					7:'Lembrete'	};
C_XL.d['reminder d']			= {	0:'Reminder at day - d',			1:'Rappel à jour - j',				2:'Przypomnienie na dzień - d',			3:'Herinnering op dag - d',				4:'Erinnerung am Tag - t',			5:'Promemoria aggiornato - g',				6:'Recordatorio al día - g', 		7:'Lembrete atualizado - d'	};
C_XL.d['reminder w']			= {	0:'Reminder at day - w weeks',		1:'Rappel à jour - w semaines',		2:'Przypomnienie co dzień - w tydzień',	3:'Herinnering op dag - w weken',		4:'Erinnerung am Tag - w Wochen',	5:'Promemoria aggiornato - w settimane',	6:'Recordatorio al día - w semanas',7:'Lembrete atualizado - w semanas'	};
C_XL.d['reminder m']			= {	0:'Reminder at day - m months',		1:'Rappel à jour - m mois',			2:'Przypomnienie na dzień - m miesiąc',	3:'Herinnering op dag - m maanden',		4:'Erinnerung am Tag - m Monate',	5:'Promemoria aggiornato - m mesi',			6:'Recordatorio al día - m meses', 	7:'Lembrete atualizado - m meses'	};

C_XL.d['planned on'] 			= { 0:'Planned on',							1:'Planifié pour',				2:'Planowane na',					3:'Gepland op',							4:'Geplant am',								5:'Pianificato per',							6:'Planeado para', 					7:'Planeado para'	};
C_XL.d['sent on'] 				= { 0:'Sent on',							1:'Expédié le',					2:'Wysłany',						3:'Verstuurd op',						4:'Gesendet am',							5:'Inviato il',									6:'Enviado el', 					7:'Enviado a'	};
C_XL.d['not yet sent'] 			= { 0:'Not sent yet',						1:'Pas encore expédié',			2:'Jeszcze nie wysłane',			3:'Nog niet verstuurd',					4:'Noch nicht gesendet',					5:'Non ancora inviato',							6:'No enviado todavía', 			7:'ainda não enviado'	};
C_XL.d['should be actioned'] 	= { 0:'after activation',					1:'après activation',			2:'jest wysyłana po aktywacji',		3:'verzonden na activatie',				4:'nach der Aktivierung gesendet',			5:'viene inviato dopo l\'attivazione',		6:'se envía después de la activación', 	7:'é enviada após a ativação'	};
C_XL.d['will not be sent'] 		= { 0:'Will not be sent',					1:'Ne sera pas expédié',		2:'Nie zostaną wysłane',			3:'Zal niet worden verzonden',			4:'Wird nicht gesendet',					5:'Non sarà inviato',							6:'No se enviará', 					7:'Não será enviado'	};
C_XL.d['on resa creation'] 		= { 0:'when you create this reservation',	1:'à la création de ce RDV',	2:'natychmiast (potwierdzenie)',	3:'bij het eerste opslaan',				4:'Wenn Sie diese Reservierung erstellen',	5:'alla creazione di questo appuntamento',		6:'a la creación de esta cita', 	7:'na criação desta consulta'	};
C_XL.d['on resa change'] 		= { 0:'when you change this reservation',	1:'lors de modification de ce RDV',	2:'natychmiast (potwierdzenie)',3:'bij wijziging van die reservatie',	4:'Wenn Sie diese Reservierung ändern',		5:'alla modifica di questo appuntamento',		6:'a la modificación de esta cita', 7:'quando esta consulta for alterada'	};
C_XL.d['on resa deletion'] 		= { 0:'when you delete this reservation',	1:'à l\'effacement de ce RDV',	2:'natychmiast (potwierdzenie)',	3:'bij het wissen van die reservatie',	4:'Wenn Sie diese Reservierung löschen',	5:'alla cancellazione di questo appuntamento',	6:'a la cancelación de esta cita', 	7:'após a eliminação desta consulta'	};
C_XL.d['on activation'] 		= { 0:'after activation',					1:'après activation',			2:'after activation',				3:'bij activatie',						4:'after activation',						5:'after activation',							6:'after activation', 				7:'after activation'	};

C_XL.d['reminder eve']			= { 0:'the day before the appointment',		1:'la veille du RDV',			2:'przeddzień powołania',		3:'de dag voordien',				4:'am Tag vor dem Termin',		5:'il giorno prima dell\'appuntamento',			6:'el día antes de la cita', 		7:'na véspera da consulta'			};
C_XL.d['reminder two days']		= { 0:'two days before the appointment',	1:'deux jours avant le RDV',	2:'dwa dni przed wizytą',		3:'twee dagen voor de afspraak',	4:'zwei Tage vor dem Termin',	5:'due giorni prima dell\'appuntamento',		6:'dos días antes de la cita', 		7:'dois dias antes da consulta'		};
C_XL.d['reminder three days']	= { 0:'three days before the appointment',	1:'trois jours avant le RDV',	2:'trzy dni przed wizytą',		3:'drie dagen voor de afspraak',	4:'drei Tage vor dem Termin',	5:'tre giorni prima dell\'appuntamento',		6:'tres días antes de la cita', 	7:'três dias antes da consulta'		};
C_XL.d['reminder four days']	= { 0:'four days before the appointment',	1:'quatre jours avant le RDV',	2:'dzień dni przed wizytą',		3:'vier dagen voor de afspraak',	4:'vier Tage vor dem Termin',	5:'quattro giorni prima dell\'appuntamento',	6:'cuatro días antes de la cita', 	7:'quatro dias antes da consulta'	};
C_XL.d['reminder one week']		= { 0:'one week before the appointment',	1:'une semaine avant le RDV',	2:'tydzień przed wizytą',		3:'één week voor de afspraak',		4:'eine Woche vor dem Termin',	5:'una settimana prima dell\'appuntamento',		6:'una semana antes de la cita', 	7:'uma semana antes da consulta'	};
C_XL.d['reminder two weeks']	= { 0:'two weeks before the appointment',	1:'deux semaines avant le RDV',	2:'dwa tygodnie przed wizytą',	3:'twee weken voor de afspraak',	4:'zwei Wochen vor dem Termin',	5:'due settimane prima dell\'appuntamento',		6:'dos semanas antes de la cita', 	7:'duas semanas antes da consulta'	};

C_XL.d['special']				= {	0:'Special',							1:'Spécial',						2:'Specjalny',							3:'Speciaal',								4:'Spezial',								5:'Speciale',									6:'Especial', 								7:'Especial'					};
C_XL.d['action on agenda']		= {	0:'an action on the agenda',			1:'Une action sur l\'agenda',		2:'Działania na porządku dziennym',		3:'Een actie op de agenda',					4:'Eine Aktion auf dem Kalender',			5:'Un\'azione sull\'agenda',					6:'Una acción en el calendario', 			7:'Uma ação no calendário'		};
C_XL.d['delivery delay']		= {	0:'Delivery delay after action',		1:'Délais d\'expédition après l\'action',2:'Opóźnienie dostawy po akcji',	3:'Verzending vertraging na de actie',		4:'Verzögerung nach Versand',				5:'Tempi di spedizione dopo l\'azione',			6:'Plazos de envío después de la acción', 	7:'atraso de envio após ação'	};
C_XL.d['delivery ahead']		= {	0:'Delivery ahead of',					1:'Notification en avance de',		2:'Naprzód Dostawa',					3:'Notificatie met voorsprong van',			4:'Zustellung der Benachrichtigung vor',	5:'Notificazione in anticipo di',				6:'Notificación adelantada de', 			7:'Notificação antes de'		};
C_XL.d['no delay']				= {	0:'Immediate (no delay)',				1:'Immédiat (aucun délais)',		2:'Natychmiastowe (bez opóźnienia)',	3:'Onmiddellijke (geen vertraging)',		4:'Sofort',									5:'Immediato (nessuna attesa)',					6:'Inmediato (ninguna espera)', 			7:'Imediato (sem atraso)'		};
C_XL.d['manual notification'] 	= { 0:'Manual notification',				1:'Notification manuelle',			2:'Instrukcja powiadomienia',			3:'Manuele notificatie',					4:'Manuelle Benachrichtigung',				5:'Notificazione manuale',						6:'Notificación manual', 					7:'Notificação manual'			};
C_XL.d['on visitor record'] 	= { 0:'On visitor record save',				1:'L\'enregistrement d\'un visitor',	2:'Księga visitor rejestrowania',		3:'Op visitor dossier opnaam',			4:'Bei Besucherspeicherung',				5:'Registrazione di un visitatore',				6:'Registro de un visitante', 				7:'Registo de um visitante'		};
C_XL.d['on visitor birthday'] 	= { 0:'On visitor\'s birthday',				1:'L\'anniversaire du visitor',		2:'Na visitor urodziny',				3:'Verjaardag van visitor',					4:'am Geburtstag des Besuchers',			5:'Compleanno del visitatore',					6:'Cumpleaños del visitante', 				7:'aniversário do visitante'	};
C_XL.d['h-x reminder'] 			= { 0:'appointment time minus X',			1:'Rappel de RDV à Heure moins X',	2:'Przypominamy godzinę minus X',		3:'afspraak herinnering om Uur min X',		4:'Terminerinnerung um Uhrzeit minus X',	5:'Promemoria di appuntamento all\'ora meno X',	6:'Recordatorio de cita a la hora menos X', 7:'Lembrete da consulta à hora menos X'	};
C_XL.d['h+x reminder'] 			= { 0:'appointment time plus X',			1:'Rappel de RDV à Heure plus X',	2:'Przypominamy godzinę plus X',		3:'afspraak herinnering om Uur plus X',		4:'Terminerinnerung um Uhrzeit plus X',		5:'Promemoria di appuntamento all\'ora più X',	6:'Recordatorio de cita a la hora más X', 	7:'Lembrete da consulta à hora mais X'	};

C_XL.d['revival']				= {	0:'Revival',							1:'Relance',						2:'Wznowić',							3:'Hervatting',							4:'Wiederaufnahme',								5:'Sollecitare',						6:'Reactivación', 							7:'Retomar'	};
C_XL.d['revival d']				= {	0:'Revival at day + d',					1:'Relance à jour + j',				2:'Przypomnienie',						3:'Hervatting op dag + d',				4:'Wiederaufnahme am Tag + t',					5:'Sollecitare al giorno + g',			6:'Reactivación al día + g', 				7:'Retomar atualizado + d'	};
C_XL.d['revival w']				= {	0:'Revival at day + w weeks',			1:'Relance à jour + w semaines',	2:'Przypomnienie',						3:'Hervatting op dag + w weken',		4:'Wiederaufnahme am Tag + w Wochen',			5:'Sollecitare al giorno + w settimane',6:'Reactivación al día + w semanas', 		7:'Retomar atualizado + w semanas'	};
C_XL.d['revival m']				= {	0:'Revival at day + m months',			1:'Relance à jour + m mois',		2:'Przypomnienie',						3:'Hervatting op dag + m maanden',		4:'Wiederaufnahme am Tag + m Monaten',			5:'Sollecitare al giorno + m mesi',		6:'Reactivación al día + m meses', 			7:'Retomar atualizado + m mês'	};

C_XL.d['revival one day'] 		= { 0:'one day after the appointment',		1:'un jour après le RDV',			2:'dzień po powołaniu',					3:'één dag na de afspraak',				4:'ein Tag nach dem Termin',			5:'un giorno dopo l\'appuntamento',		6:'un día después de la cita', 			7:'um dia após a consulta'	};
C_XL.d['revival one week'] 		= { 0:'one week after the appointment',		1:'une semaine après le RDV',		2:'tydzień po powołaniu',				3:'één week na de afspraak',			4:'eine Woche nach dem Termin',			5:'una settimana dopo l\'appuntamento',	6:'una semana después de la cita', 		7:'uma semana após a consulta'	};
C_XL.d['revival two weeks'] 	= { 0:'two weeks after the appointment',	1:'deux semaines après le RDV',		2:'dwa tygodnie po powołaniu',			3:'twee weken na de afspraak',			4:'zwei Wochen nach dem Termin',		5:'due settimane dopo l\'appuntamento',	6:'dos semanas después de la cita', 	7:'duas semanas depois a consulta'	};
C_XL.d['revival one month'] 	= { 0:'one months after the appointment',	1:'un mois après le RDV',			2:'jeden miesiąc po powołaniu',			3:'één maand na de afspraak',			4:'ein Monat nach dem Termin',			5:'un mese dopo l\'appuntamento',		6:'un mes después de la cita', 			7:'um mês após a consulta'	};
C_XL.d['revival two months'] 	= { 0:'two months after the appointment',	1:'deux mois après le RDV',			2:'dwa miesiąc po powołaniu',			3:'twee maanden na de afspraak',		4:'zwei Monate nach dem Termin',		5:'due mesi dopo l\'appuntamento',		6:'dos meses después de la cita', 		7:'dois mêses após a consulta'	};
C_XL.d['revival three months'] 	= { 0:'three months after the appointment',	1:'trois mois après le RDV',		2:'trzy miesiąc po powołaniu',			3:'drie maanden na de afspraak',		4:'3 Monate nach dem Termin',			5:'tre mesi dopo l\'appuntamento',		6:'tres meses después de la cita', 		7:'três meses após a consulta'	};
C_XL.d['revival five months'] 	= { 0:'five months after the appointment',	1:'cinq mois après le RDV',			2:'Pięć miesięcy po powołaniu',			3:'vijf maanden na de afspraak',		4:'fünf Monate nach dem Termin',		5:'cinque mesi dopo l\'appuntamento',	6:'cinco meses después de la cita',		7:'cinco meses após a consulta'	};
C_XL.d['revival six months'] 	= { 0:'six months after the appointment',	1:'six mois après le RDV',			2:'sześć miesięcy po powołaniu',		3:'zes maanden na de afspraak',			4:'sechs Monate nach dem Termin',		5:'sei mesi dopo l\'appuntamento',		6:'seis meses después de la cita', 		7:'seis meses após a consulta'	};
C_XL.d['revival nine months'] 	= { 0:'nine months after the appointment',	1:'neuf mois après le RDV',			2:'dziewięć miesięcy po mianowaniu',	3:'negen maanden na de afspraak',		4:'neun Monate nach dem Termin',		5:'nove mesi dopo l\'appuntamento',		6:'nueve meses después de la cita', 	7:'nove meses após a consulta'	};
C_XL.d['revival eleven months'] = { 0:'eleven months after the appointment',1:'onze mois après le RDV',			2:'jedenaście miesięcy po mianowaniu',	3:'elf maanden na de afspraak',			4:'elf Monate nach dem Termin',			5:'undici mesi dopo l\'appuntamento',	6:'once meses después de la cita', 		7:'onze meses depois a consulta'	};
C_XL.d['revival one year'] 		= { 0:'one year after the appointment',		1:'un an après le RDV',				2:'rok po powołaniu',					3:'één jaar na de afspraak',			4:'ein Jahr nach dem Termin',			5:'un anno dopo l\'appuntamento',		6:'un año después de la cita', 			7:'um ano após a consulta'	};
C_XL.d['revival months 18'] 	= { 0:'18 months after the appointment',	1:'18 mois après le RDV',			2:'18 miesięcy po mianowaniu',			3:'18 maanden na de afspraak',			4:'18 Monate nach dem Termin',			5:'18 mesi dopo l\'appuntamento',		6:'18 meses después de la cita', 		7:'18 meses depois a consulta'	};
C_XL.d['revival two years'] 	= { 0:'two years after the appointment',	1:'deux ans après le RDV',			2:'dwa lata po powołaniu',				3:'twee jaren na de afspraak',			4:'zwei Jahre nach dem Termin',			5:'due anni dopo l\'appuntamento',		6:'dos años después de la cita', 		7:'dois anos após a consulta'	};


// 		[technical name] 			english:0,				french:1,						polish:2,				dutch:3,				german:4,					italian:5,						spanish:6,							portuguese:7

C_XL.d['notification']			= {	0:'Notification',		1:'Notification',				2:'Zgłoszenie',			3:'Melding',			4:'Benachrichtigung',		5:'Notificazione',				6:'Notificación', 					7:'Notificação'			};
C_XL.d['no notification']		= {	0:'no notification',	1:'pas de notification',		2:'brak powiadomienia',	3:'geen melding',		4:'keine Benachrichtigung',	5:'nessuna notifica',			6:'sin notificación', 				7:'sem notificação'		};
C_XL.d['notifications']			= {	0:'Notifications',		1:'Notifications',				2:'Powiadomienia',		3:'Meldingen',			4:'Benachrichtigungen',		5:'Notificazioni',				6:'Notificaciones', 				7:'Notificações'		};
C_XL.d['presence list']			= {	0:'Drop Duplicates',	1:'Suppression de doublon',		2:'Usuń duplikat',		3:'Verwijder dubbele',	4:'Duplikate verwerfen',	5:'Soppressione di doppioni',	6:'Supresión de los duplicados', 	7:'Remoção da duplicata'};


C_XL.d['presence list note']	= { 0:'If two appointments are made on the same day indicating the same mobile number,	only the earliest appointment is reminded.',		
									1:'Si deux rendez-vous sont pris dans la même journée indiquant le même numéro de mobile, seul le RDV le plus tôt est rappelé.',			
									2:'Jeśli dwie nominacje są wykonane w tym samym dniu co wskazuje ten sam numer telefonu, tylko najwcześniej nominacja przypomnieć.',		
									3:'als twee afspraken worden gemaakt op dezelfde dag met vermelding van hetzelfde mobiele nummer,	wordt alleen de eerste afspraak herinnerd.',
									4:'Wenn zwei Termine am selben Tag die gleiche Mobilnummer haben, wird die Erinnerung nur für den früheren Termin gesendet.',	
									5:'Se due appuntamenti sono presi sulla stessa giornata indicando lo stesso numero di cellulare, solo l\'appuntamento il più presto sarà ricordato',	
									6:'Si dos citas están posicionadas en el mismo día con el mismo número de móvil, solo la cita más temprana recibirá un recordatorio.', 7:'Se tiverem sido marcados dois encontros no mesmo dia com o mesmo número de telemóvel, será notificado apenas o primeiro encontro.'	};


C_XL.d['filter on actions']		= {	0:'Only after those actions',	1:'Seulement après ces actions',	2:'Dopiero po tych działań',3:'Enkel na deze acties',		4:'Nur nach diesen Aktionen',	5:'Solo dopo queste azioni',6:'Solo después de estas acciones', 7:'Somente após estas ações'	};
C_XL.d['filter on logins']		= {	0:'Only by some logins',		1:'Seulement par ces logins',		2:'Tylko niektóre loginy',	3:'Enkel door bepaalde logins',	4:'Nur von einigen Logins',		5:'Solo con questi logins',	6:'Solo con estos logins', 			7:'Só por esses logins'			};
C_XL.d['filter on resources']	= {	0:'Only in certain agendas',	1:'Seulement dans certains agendas',2:'Tylko niektóre programy',3:'Enkel in bepaalde agendas',	4:'Nur in einigen Kalendern',	5:'Solo in alcune agende',	6:'Solo en algunos calendarios', 	7:'apenas em certas agendas'	};


C_XL.d['resa_sms_list']		= C_XL.d['sms']; 	// !! No translation on this line

C_XL.d['resa_emails_list']	= { 0:'e-Mail',		1:'e-Mail',				2:'e-Mail',				3:'e-Mail',			4:'E-Mail',			5:'Email',		6:'E-mail', 		7:'Email'		};
C_XL.d['title']				= { 0:'Title',		1:'Titre',				2:'Tytuł',				3:'Title',			4:'Titel',			5:'Titolo',		6:'Título', 		7:'Título'		};
C_XL.d['message']			= { 0:'Message',	1:'Message',			2:'Wiadomość',			3:'Boodschap',		4:'Nachricht',		5:'Messaggio',	6:'Mensaje', 		7:'Mensagem'	};
C_XL.d['messages'] 			= { 0:'Messages',	1:'Messages',			2:'Wiadomości',			3:'Berichten',		4:'Nachrichten',	5:'Messaggi',	6:'Mensajes', 		7:'Mensagens'	};
C_XL.d['resa serie'] 		= { 0:'Series',		1:'Série',				2:'Seria',				3:'Reeks',			4:'Serie',			5:'Serie',		6:'Serie', 			7:'Série'		};


// 		technical 			english:0,			french:1,				polish:2,				dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7

C_XL.d['recurrence']	= { 0:'Recurrence',		1:'Récurrence',			2:'Nawrót',				3:'Herhaling',		4:'Wiederholung',	5:'Ricorrenza',	6:'Recurrencia', 	7:'Recorrência'	};
C_XL.d['every']			= { 0:'every',			1:'tous les',			2:'co',					3:'om de',			4:'alle',			5:'tutti i',	6:'todos los', 		7:'todos os'	};
C_XL.d['every -f']		= { 0:'every',			1:'toutes les',			2:'co',					3:'om de',			4:'alle',			5:'tutte le',	6:'todas las', 		7:'todas as'	};
C_XL.d['days']			= { 0:'days',			1:'jours',				2:'dni',				3:'dagen',			4:'Tage',			5:'giorni',		6:'días', 			7:'dias'		};
C_XL.d['weeks']			= { 0:'weeks',			1:'semaines',			2:'tygodnie',			3:'weken',			4:'Wochen',			5:'settimane',	6:'semanas', 		7:'semanas'		};
C_XL.d['week'] 			= { 0:'week',			1:'semaine',			2:'tydzień',			3:'week',			4:'Woche',			5:'settimana',	6:'semana', 		7:'semana'		};
C_XL.d['months']		= { 0:'months',			1:'mois',				2:'miesiące',			3:'maanden',		4:'Monate',			5:'mesi',		6:'mes', 			7:'mês'			};
C_XL.d['years -f']		= { 0:'years',			1:'années',				2:'lata',				3:'jaren',			4:'Jahre',			5:'anni',		6:'años', 			7:'anos'		};
C_XL.d['years']			= { 0:'years',			1:'ans',				2:'lata',				3:'jaren',			4:'Jahre',			5:'anni',		6:'años', 			7:'anos'		};
	
C_XL.d['every day']		= { 0:'every day',		1:'chaque jour',		2:'każdego miesiąca',	3:'elke maand',		4:'jeden Tag',		5:'ogni giorno',	6:'cada día', 		7:'todos os dias'	};
C_XL.d['every week']	= { 0:'every week',		1:'chaque semaine',		2:'raz na tydzień',		3:'elke week',		4:'jede Woche',		5:'ogni settimana',	6:'cada semana', 	7:'todas as semanas'	};
C_XL.d['every month']	= { 0:'every month',	1:'chaque mois',		2:'każdego miesiąca',	3:'elke maand',		4:'jeden Monat',	5:'ogni mese',		6:'cada mes', 		7:'todos os meses'	};
C_XL.d['every year']	= { 0:'every year',		1:'chaque année',		2:'co roku',			3:'elk jaar',		4:'jedes Jahr',		5:'ogni anno',		6:'cada año', 		7:'todos os anos'	};
C_XL.d['repeats every']	= { 0:'repeats every',	1:'se répète',			2:'powtarza',			3:'herhaalt',		4:'wiederholt sich',5:'si ripete',		6:'se repite', 		7:'se repete'	};
C_XL.d['repetition']	= { 0:'repetition',		1:'répétition',			2:'powtórzenie',		3:'herhaling',		4:'Wiederholung',	5:'ripetizione',	6:'repetición', 	7:'repetição'	};
C_XL.d['repetitions']	= { 0:'repetitions',	1:'répétitions',		2:'powtórzeń',			3:'herhalingen',	4:'Wiederholungen',	5:'ripetizioni',	6:'repeticiones', 	7:'repetições'	};
C_XL.d['iterations']	= { 0:'iterations',		1:'itérations',			2:'iteracji',			3:'iteraties',		4:'Iterationen',	5:'iterazione',		6:'iteración', 		7:'iterações'	};
C_XL.d['happens xt']	= { 0:'happens',		1:'se produit',			2:'iteracji',			3:'gebeurt',		4:'erfolgt',		5:'occorre',		6:'ocurre', 		7:'ocorre'	};
C_XL.d['one time']		= { 0:'one time',		1:'une fois',			2:'jeden razy',			3:'één keer',		4:'ein Mal',		5:'una volta',		6:'una vez', 		7:'uma vez'	};
C_XL.d['x times']		= { 0:'times',			1:'fois',				2:'razy',				3:'keer',			4:'Mal',			5:'volte',			6:'veces', 			7:'vez'	};

C_XL.d['on first']		= { 0:'on the first',	1:'les premiers',		2:'pierwszy',			3:'de eerste',		4:'am ersten',		5:'i primi',	6:'los primeros', 	7:'os primeiros'	};
C_XL.d['on second']		= { 0:'on the second',	1:'les seconds',		2:'drugi',				3:'de tweede',		4:'am zweiten',		5:'i secondi',	6:'los segundos', 	7:'os segundos'	};
C_XL.d['on third']		= { 0:'on the third',	1:'les troisièmes',		2:'trezeci',			3:'de derde',		4:'am dritten',		5:'i terzi',	6:'los terceros', 	7:'os terceiros'	};
C_XL.d['on fourth']		= { 0:'on the fourth',	1:'les quatrièmes',		2:'czwarty',			3:'de vierde',		4:'am vierten',		5:'i quarti',	6:'los cuartos', 	7:'os quartos'	};
C_XL.d['on the last']	= { 0:'on the last',	1:'les derniers',		2:'ostatni',			3:'de laatste',		4:'am letzten',		5:'gli ultimi',	6:'los últimos', 	7:'os últimos'	};
C_XL.d['on the first']	= { 0:'on first of',	1:'le premier',			2:'pierwszego',			3:'op de eerste',	4:'am ersten',		5:'il primo',	6:'el primero', 	7:'o primeiro'	};

C_XL.d['overbooking']	= { 0:'overbooking',	1:'surréservation',		2:'overbooking',		3:'overboeking',	4:'Überbuchung',			5:'su prenotazione',	6:'con reserva previa', 	7:'sobrerreserva'	};
C_XL.d['excluded']		= { 0:'excluded',		1:'exclue',				2:'wyłączony',			3:'uitgesloten',	4:'ausschließlich',			5:'esclusa',			6:'excluido', 				7:'excluído'	};
C_XL.d['xclude date']	= { 0:'exclude date',	1:'exclure la date',	2:'wykluczyć tę datę',	3:'uitsluiten',		4:'ausschließlich Datum',	5:'escludere',			6:'excluir la fecha', 		7:'excluir a data'	};
C_XL.d['include date']	= { 0:'include back',	1:'ré-inclure',			2:'to znowu',			3:'weer omvatten',	4:'wieder einschließen',	5:'includere di nuovo',	6:'incluir de nuevo', 		7:'voltar a incluir'	};

C_XL.d['in last days']	= { 0:'in the last days',		1:'dans les derniers jours',	2:'w ostatnich dniach',		3:'in de laatste dagen',	4:'in den letzten Tagen',	5:'negli ultimi giorni',	6:'en los últimos días', 	7:'nos últimos dias'	};
C_XL.d['on last day']	= { 0:'on the last day',		1:'le dernier jour',			2:'ostatni dzień',			3:'de laatste dag',			4:'am letzten Tag',			5:'l\'ultimo giorno',		6:'el último día', 			7:'último dia'			};
C_XL.d['penulti day']	= { 0:'on the penultimate day',	1:'l\'avant dernier jour',		2:'przedostatniego dnia',	3:'de voorlaatste dag',		4:'am vorletzen Tag',		5:'il penultimo giorno',	6:'el penúltimo día', 		7:'o penúltimo dia'		};

C_XL.d['days before eom']	= { 0:'days before end of month',	1:'jours avant la fin du mois',	2:'dni przed końcem miesiąca',	3:'dagen vóór het einde van de maand',	4:'Tage vor Monatsende',		5:'giorni prima della fine del mese',	6:'días antes de final de mes', 7:'dias antes do fim do mês'	};
C_XL.d['from resa serie']	= { 0:'Is part of a serie',		1:'Fait partie d\'une série',		2:'Jest częścią serii',			3:'Behoort tot een serie',				4:'ist Teil einer Serie',		5:'fa parte di una serie',				6:'forma parte de una serie', 	7:'Faz parte de uma série'	};
C_XL.d['del future apps']	= { 0:'Delete planned items',	1:'Supprimer les planifiés',		2:'Usuń zaplanowane pozycje',	3:'Verwijder geplande afspraken',		4:'Geplante Elemente löschen',	5:'Sopprimere i pianificati',			6:'Borrar los planificados', 	7:'Remover o planeado'	};
C_XL.d['planned apps']		= { 0:'planned items',			1:'réservations planifiées',		2:'rezerwacje planowane',		3:'geplande afspraken',					4:'Geplante Elemente',			5:'Prenotazioni pianificate',			6:'Reservas planificadas', 		7:'reservas planeadas'	};

C_XL.d['pls name serie']	= { 0:'please choose a title for your serie',	
							1:'choisissez un titre pour cette série',		
							2:'wybierz tytuł dla serii',	
							3:'kies dan een titel voor uw serie',		
							4:'Bitte wählen Sie für Ihre Serie einen Titel',	
							5:'scelga un titolo per questa serie',	
							6:'escoja un título para esta serie', 7:'escolha um título para esta série'	};

C_XL.d['tip click to switch to date'] = { 0:'click to switch the planning to this date'
									,	1:'cliquer pour voir cette date sur le planning'
									,	2:'kliknij,	aby przełączyć planowania do tej pory'
									,	3:'klik om de planning te schakelen naar deze datum'
									,	4:'Hier klicken um den Zeitplan auf diesen Tag zu tauschen'
									,	5:'cliccare per vedere questa data sul planning',	
										6:'hacer clic para ver esta fecha en el calendario', 7:'clique para visualizar esta data no planeamento' };
	
C_XL.d['tip include this date'] = { 0:'click to include this date in the list again'
								,	1:'cliquer pour inclure à nouveau la date'
								,	2:'kliknij,	aby włączyć tę datę na liście ponownie'
								,	3:'Klik op om deze datum terug in de lijst te nemen'	
								,	4:'Hier klicken um dieses Datum wieder auf die Liste zu setzen'
								,	5:'cliccare per includere di nuovo questa data',
									6:'hacer clic para volver a incluir la fecha', 7:'clique para voltar a incluir esta data' };
	
C_XL.d['tip xclude this date'] = { 0:'click to exclude this date from the list'
							,	1:'cliquer pour exclure cette date'
							,	2:'kliknij,	aby wykluczyć tę datę z listy'
							,	3:'Klik op om deze datum uit de lijst te sluiten'	
							,	4:'Hier klicken um dieses Datum aus der Liste entfernen',	
								5:'cliccare per escludere questa data',	
								6:'hacer clic para excluir esta fecha', 7:'clique para eliminar esta data' };
	
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7

C_XL.d['on the date']	= { 0:'on',				1:'le',					2:'na',					3:'op',				4:'am',					5:'il',				6:'el', 			7:'em'	};
C_XL.d['on a date']		= { 0:'on this date',	1:'à cette date',		2:'tego dnia',			3:'op deze dag',	4:'an diesem Datum',	5:'a questa data',	6:'en esta fecha', 	7:'nesta data'	};

C_XL.d['stops after']	= { 0:'stops after',	1:'s\'arrète après',	2:'zatrzymuje się po',	3:'stopt na',		4:'endet ab',	5:'si ferma dopo',	6:'para después', 	7:'parar depois de'	};
C_XL.d['stops on']		= { 0:'stops on',		1:'s\'arrète le',		2:'zatrzymuje się w',	3:'stopt op',		4:'endet am',	5:'si ferma il',	6:'para el', 		7:'parar em'	};

C_XL.d['attendee']			= { 0:'attendee',	1:'assigné',	2:'Uczestników',	3:'Toegewezen',			4:'Zugeteilt',			5:'attribuito',	6:'Participante', 		7:'atribuído'	};
C_XL.d['predefined']		= { 0:'Templates',	1:'Prédéfinis',	2:'Szablony',		3:'Voorbeelden',		4:'Vorlage',			5:'Predefinito',6:'Predefinido', 		7:'Predefinidos'	};
C_XL.d['attributes']		= { 0:'attributes',	1:'attributs',	2:'atrybuty',		3:'attributeb',			4:'Eigenschaften',		5:'attributi ',	6:'Características', 	7:'atributos'	};


// 		technical 				english:0,					french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7

C_XL.d['email template'] 	= { 0:'e-Mail template',	1:'e-Mail pré-formaté',		2:'szablon e-Mail',		3:'e-Mail sjabloon',	4:'E-Mail Vorlage',		5:'Email predefinito',	6:'E-mail preformateado', 	7:'email pré-formatado'	};
C_XL.d['email templates'] 	= { 0:'e-Mail templates',	1:'e-Mail pré-formatés',	2:'szablonów e-Mail',	3:'e-Mail sjablonen',	4:'E-Mail Vorlagen',	5:'Email predefiniti',	6:'E-mails preformateados', 7:'Emails pré-formatados'	};

C_XL.d['sms template'] 		= { 0:'SMS template',		1:'SMS pré-formaté',		2:'szablon SMS',		3:'SMS sjabloon',		4:'SMS Vorlage',		5:'SMS predefinito',	6:'SMS preformateado', 		7:'SMS pré-formatado'	};
C_XL.d['sms templates'] 	= { 0:'SMS templates',		1:'SMS pré-formatés',		2:'szablonów SMS',		3:'SMS sjablonen',		4:'SMS Vorlagen',		5:'SMS predefiniti',	6:'SMS preformateados', 	7:'SMS pré-formatados'	};

C_XL.d['notif template'] 	= { 0:'notification',		1:'notification',			2:'powiadomień',		3:'melding',			4:'Benachrichtigung',	5:'notifica',			6:'notificación', 			7:'notificação'		};
C_XL.d['notif templates'] 	= { 0:'notifications',		1:'notifications',			2:'powiadomienia',		3:'meldingen',			4:'Benachrichtigungen',	5:'notifiche',			6:'notificaciones', 		7:'notificações'	};
C_XL.d['notif subject']		= { 0:'subject',			1:'sujet',					2:'temat',				3:'onderwerp',			4:'Betreff',			5:'oggetto',			6:'asunto', 				7:'assunto'			};
C_XL.d['notif message']		= { 0:'body',				1:'texte',					2:'treść',				3:'bericht',			4:'Text',				5:'corpo',				6:'cuerpo', 				7:'corpo'			};


C_XL.d['sms gateaway title'] = { 0:'Outbound SMS',		1:'SMS sortant',			2:'SMS gateaway',	3:'SMS gateaway',	4:'SMS gateaway',	5:'SMS gateaway',	6:'SMS gateaway', 	7:'SMS gateaway'	};
C_XL.d['sms gateaway'] 		= { 0:'SMS gateaway',		1:'Portail SMS',			2:'SMS gateaway',	3:'SMS gateaway',	4:'SMS gateaway',	5:'SMS gateaway',	6:'SMS gateaway', 	7:'SMS gateaway'	};
C_XL.d['sms encoding'] 		= { 0:'Characters set',		1:'Jeu de caractères',		2:'SMS encoding',	3:'SMS encoding',	4:'SMS encoding',	5:'SMS encoding',	6:'SMS encoding', 	7:'SMS encoding'	};
C_XL.d['sms priority'] 		= { 0:'Network priority',	1:'Priorité réseau',		2:'SMS priority',	3:'SMS priority',	4:'SMS priority',	5:'SMS priority',	6:'SMS priority', 	7:'SMS priority'	};

C_XL.d['inbound sms title'] = { 0:'Inbound SMS treatment',	1:'SMS entrant',				2:'SMS inbound treatment',	3:'SMS inbound treatment',	4:'SMS inbound treatment',	5:'SMS inbound treatment',	6:'SMS inbound treatment', 	7:'SMS inbound treatment'	};
C_XL.d['inbound action'] 	= { 0:'Inbound action',			1:'action sur les sms entrant',	2:'inbound SMS action',		3:'inbound SMS action',		4:'inbound SMS action',		5:'inbound SMS action',		6:'inbound SMS action', 	7:'inbound SMS action'	};
C_XL.d['autoreply msg'] 	= { 0:'autoreply message',		1:'Réponse automatique',		2:'autoreply message',		3:'autoreply message',		4:'autoreply message',		5:'autoreply message',		6:'autoreply message', 		7:'autoreply message'	};
C_XL.d['send test msg'] 	= { 0:'Send test msg',			1:'Faire un test',				2:'Send test msg',			3:'Send test msg',			4:'Send test msg',			5:'Send test msg',			6:'Send test msg', 			7:'Send test msg'	};


C_XL.d['reminder form']			= { 0:'SMS Settings',			1:'Paramètres SMS',			2:'Parametry SMS-ów',		3:'SMS Settings',		4:'SMS Einstellungen',		5:'Parametri SMS',		6:'Configuraciones SMS', 	7:'Configurações de SMS'	};
C_XL.d['email form']			= { 0:'Email Settings',			1:'Paramètres email',		2:'Parametry Email-ów',		3:'Email Settings',		4:'E-Mail Einstellungen',	5:'Parametri Email',	6:'Configuraciones Email', 	7:'Configurações de e-mail'	};
C_XL.d['sms message']			= { 0:'Sms message',			1:'Message sms',			2:'Wiadomość SMS',			3:'Sms boodschap',		4:'SMS Nachricht',			5:'Messaggio SMS',		6:'Mensaje SMS', 			7:'Mensagem SMS'	};
C_XL.d['multipage sms']			= { 0:'Multi-pages SMS',		1:'SMS multi-pages',		2:'Wielostronicowy sms',	3:'Multi-pagina SMS',	4:'Mehrseitige SMS',		5:'SMS varie pagine',	6:'SMS varias páginas', 	7:'SMS com várias páginas'	};
C_XL.d['email subject']			= { 0:'subject',				1:'sujet',					2:'temat emalia',			3:'onderwerp',			4:'Betreff',				5:'Soggetto',			6:'asunto', 				7:'assunto'	};
C_XL.d['email message']			= { 0:'email body',				1:'corps de l\'email',		2:'treści e-maili',			3:'Email bericht',		4:'E-Mail Nachricht',		5:'Corpo della mail',	6:'Cuerpo del e-mail', 		7:'Corpo do e-mail'	};

C_XL.d['standard message']		= { 0:'Standard message',		1:'Message standard',		2:'standardową wiadomość',	3:'standaard bericht',	4:'Standardnachricht',		5:'Messaggio standard',	6:'Mensaje estándar', 		7:'Mensagem padrão'	};
C_XL.d['alt message in']		= { 0:'alternative language',	1:'Langue alternative',		2:'Wiadomość Alternatif',	3:'alternatieve taal',	4:'alternativve Sprache',	5:'Lingua alternativa',	6:'Idioma alternativo', 	7:'Língua alternativa'	};

C_XL.d['delivery datetime']		= { 0:'Delivery schedule',		1:'Envoi du message',		2:'Wysłanie wiadomości',	3:'Sms uitzending',		4:'SMS Versand',	5:'Invio messaggio',	6:'Envío mensaje', 	7:'Enviar Mensagem'	};
C_XL.d['delivery target']		= { 0:'Recepient',				1:'Destinataire',			2:'adresat',				3:'Bestemming',			4:'Empfänger',		5:'Destinatario',		6:'Destinatario', 	7:'Destinatário'	};
C_XL.d['delivery time']			= { 0:'Delivery time',			1:'Heure d\'envoi',			2:'Godzina nadania',		3:'Uitzending tijd',	4:'Versandzeit',	5:'Ora d\'invio',		6:'Hora de envío', 	7:'Hora do envio'	};
C_XL.d['delivery day']			= { 0:'Delivery day',			1:'Jour d\'envoi',			2:'Dzień nadania',			3:'Uitzending dag',		4:'Versandtag',		5:'Giorno d\'invio',	6:'Día de envío', 	7:'Dia do envio'	};
C_XL.d['delivery trigger']		= { 0:'Trigger',				1:'Déclencheur',			2:'Spust',					3:'Trekker',			4:'auslöser',		5:'Innesco',			6:'Detonante', 7:'Desencadeamento'	};

C_XL.d['timing and trigger']	= { 0:'Trigger and timing',		1:'Déclencheur et timing',	2:'Spust i czas',			3:'Trekker en timing',	4:'auslöser und Uhrzeit',	5:'Innesco e timing',			6:'Detonante y sincronización', 7:'Desencadeamento e sincronismo'	};
C_XL.d['trigger appointment']	= { 0:'appointment time',		1:'Heure du rendez-vous',	2:'Czas spotkania',			3:'afspraak tijdstip',	4:'Terminzeitpunkt',		5:'Ora dell\'appuntamento',		6:'Hora de la cita', 			7:'Hora da consulta'	};
C_XL.d['trigger statusCss']		= { 0:'Status',					1:'Statuts',				2:'Status',					3:'Statussen',			4:'Status',					5:'Status',						6:'Estado', 					7:'Estados'	};
C_XL.d['trigger specAppCss']	= { 0:'Special appointments',	1:'Rendez-vous spéciaux',	2:'Specjalne spotkanie',	3:'Speciale afspraak',	4:'Besondere Termine',		5:'appuntamenti speciali',		6:'Citas especiales', 			7:'Compromissos especiais'	};

C_XL.d['trigger specUnaCss']	= { 0:'Special unavailabilities',	
									1:'Indisponibilités spéciales',	
									2:'Specjalne niedostępności',	
									3:'Speciale onbeschikbaarheden',		
									4:'Besondere Nichtverfügbarkeiten',	
									5:'Indisponibilità speciali',	
									6:'Indisponibilidades especiales', 7:'Indisponibilidades especiais'	};

C_XL.d['logins watching over']	= { 0:'Logins notified for',	1:'Logins notifiés pour les',	2:'Loginy zgłoszony do',	3:'Logins gemeld voor',	4:'Benachrichtigungen für Logins',	5:'Logins notificati per i',	6:'Logins comunicados para los', 7:'Logins notificados para'	};

C_XL.d['logins target note']	= { 0:'Please check logins settings. On tab "Notifications" you can specify for which agendas notifications should be sent.',		
									1:'Vérifiez le réglage des logins. Sur l\'onglet "Notifications" vous pouvez spécifiez pour quels agendas des notifications seront reçues.',			
									2:'Sprawdź ustawienia logowania. W zakładce "Wiadomości" można określić raporty otrzymane.',		
									3:'Controleer de instelling van logins. Op de tab "Meldingen" kunt u specifieren voor welke agendas zijn meldingen gestuurd.',
									4:'Bitte Kontoeinstellungen überprüfen. Im Tab "Benachrichtigungen" können Sie die Kalender auswählen, für die Sie Benachrichtigungen empfangen möchten.',	
									5:'Verifichi la configurazione dei logins. Sull\'etichetta "Notificazioni" potrà specificare per quali agende le notificazioni saranno ricevute.',	
									6:'Compruebe la configuración de los logins. En la pestaña "Notificaciones" puede especificar para cuales calendarios las notificaciones serán recibidas.', 
									7:'Verifique a configuração dos logins. Na aba "Notificações" pode especificar quais os calendários que receberão as notificações.'
									};
									
C_XL.d['logins watchover note']	= { 0:'Select here agendas for which this login must receive notifications.',	
									1:'Indiquez ici les agendas pour lesquels ce login doit recevoir des notifications.',			
									2:'Wpisz tutaj zadania dla których ten logowania musi otrzymywać powiadomienia.',		
									3:'Voer hier de agenda\'s waarvoor deze login moet meldingen ontvangen.',
									4:'Hier die Kalender auswählen, für die dieses Konto Benachrichtigungen erhalten soll.',	
									5:'Indichi qui per quali agende questo login deve ricevere notificazioni.',	
									6:'Indique aquí para cuales calendarios este login debe recibir notificaciones.', 
									7:'Insira aqui os calendários para os quais este início de sessão deve receber notificações.'
									};
									
C_XL.d['not on own actions']	= { 0:'does not apply for this login\'s own actions on selected agendas.',	
									1:'ne s\'applique pas aux actions propres à ce login sur ces agendas.',			
									2:'nie dotyczy własnych działań tego loginu w wybranych agendach.',		
									3:'geldt niet voor de eigen acties van deze login op geselecteerde agenda\'s.',
									4:'gilt nicht für die eigenen Aktionen dieses Logins auf ausgewählten Agenden.',	
									5:'non si applica alle azioni di questo accesso su agende selezionate.',	
									6:'no aplica para acciones propias de este inicio de sesión en agendas seleccionadas.', 
									7:'não se aplica às próprias ações deste login em agendas selecionadas.'
									};
									
C_XL.d['com default disabled note']	= { 0:'In the appointment slips, communication will appear disabled. You need to check it manualy to let it happen.',	
									1:'Dans les fiches de RDV, la communication apparaîtra désactivée. Vous devez la cochez manuellement pour qu\'elle s\'opère.',			
									2:'Ślizga przyjęć, komunikacja będzie wyświetlana wyłączona. Trzeba sprawdzić ręcznie obsługiwać.',		
									3:'In de afspraak slips, communicatie zal uitgeschakeld verschijnen. U moet die manueel checken om het te bedienen.',
									4:'In der Termindatei wird die Kommunikation als deaktiviert angezeigt werden. Das Kästchen muss manuell ausgewählt werden um sie zu betätigen.',	
									5:'Nelle schede di appuntamenti, la comunicazione apparirà come disattivata. Dovrà selezionarla manualmente in modo che si effettui.',
									6:'En las fichas de citas, la comunicación aparecerá como desactivada. Tendrá que seleccionarla manualmente para que se efectue.', 
									7:'Nas fichas de encontros,	a comunicação estará desativada. Irá ser necessário selecionar manualmente a comunicação para que a mesma seja efetuada.'
									};
									
C_XL.d['com in day enabled note']	= { 0:'This communication is automatically activated for a modification in the current diary day.',	
									1:'Cette communication s\'active automatiquement pour une modification dans la journée d\'agenda en cours.',			
									2:'Ta komunikacja jest automatycznie aktywowana dla modyfikacji w bieżącym dniu kalendarzowym.',		
									3:'Deze communicatie wordt automatisch geactiveerd bij een wijziging in de huidige agendadag.',
									4:'Diese Kommunikation wird bei einer Änderung am aktuellen Tagebuchtag automatisch aktiviert.',	
									5:'Questa comunicazione si attiva automaticamente per una modifica nel giorno corrente dell\'agenda.',
									6:'Esta comunicación se activa automáticamente para una modificación en el día del diario actual.', 
									7:'Esta comunicação é ativada automaticamente para uma modificação no dia atual do diário.'
									};
									
C_XL.d['action default note']	= { 0:'Creating or changing an appointment will trigger a communication.',	
									1:'La création ou la modification d \'un RDV provoquera l\'envoi d\'une communication.',			
									2:'Tworzenie lub zmiana terminu spowoduje komunikat.',		
									3:'Het maken of een afspraak wijzigen gaat een mededeling triggeren.',
									4:'Das Erstellen oder Ändern eines Termins löst automatisch eine Kommukation aus.',	
									5:'La creazione o la modifica di un appuntamento causerà l\'invio di una comunicazione',	
									6:'La creación o la modificación de una cita generará el envío de una comunicación.', 
									7:'Criar ou alterar uma consulta causará o envio de uma comunicação.'
									};

									

	/* this bunch is duplicated in .js */
C_XL.d['indicates']				= { 0:'Indicating',				1:'Indiquant',					2:'Wskazujący',						3:'Vermeldt',			4:'angabe',					5:'Indicando',				6:'Indicando', 					7:'Indicando'	};
C_XL.d['before scheduled']		= { 0:'before scheduled time',	1:'d\'avance sur le timing',	2:'wcześniej niż w harmonogramie',	3:'voorhang op timing',	4:'vor geplanter Uhrzeit',	5:'in anticipo sul timing',	6:'adelantado sobre la hora', 	7:'antecipação sobre a hora'	};

	// preferences access
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7


C_XL.d['login'] 	= { 0:'Login',		1:'Login',			2:'Użytkownik',	3:'Login',			4:'Login',			5:'Login',			6:'Login', 			7:'Início de sessão'	};
C_XL.d['new login'] = { 0:'New login',	1:'Nouvel accès',	2:'Nowy login',	3:'Nieuwe login',	4:'neuer Login',	5:'Nuovo accesso',	6:'Nuevo acceso', 	7:'Novo acesso'			};
C_XL.d['pass'] 		= { 0:'Password',	1:'Mot de passe',	2:'Hasło',		3:'Passwoord',		4:'Passwort',		5:'Password',		6:'Contraseña', 	7:'Palavra-passe'		};
C_XL.d['view'] 		= { 0:'View',		1:'Vue',			2:'Widok',		3:'Zicht',			4:'ansicht',		5:'Vista',			6:'Vista', 			7:'Visto'				};

C_XL.d['al-admin'] 		= { 0:'administrator',		1:'administrateur',		2:'administrator',		3:'Beheerder',			4:'administrator',		5:'amministratore',			6:'administrador', 			7:'administrador'	};
C_XL.d['al-seller'] 	= { 0:'Representative',		1:'Délégué',			2:'Przedstawiciel',		3:'afgevaardigd',		4:'Vetreter',			5:'Rappresentante',			6:'Delegado', 				7:'Delegado'	};
C_XL.d['al-manager'] 	= { 0:'Manager',			1:'Responsable',		2:'Kierownik',			3:'Verantwoordelijk',	4:'Manager',			5:'Responsabile',			6:'Responsable', 			7:'Responsável'	};
C_XL.d['al-supervisor'] = { 0:'Supervisor',			1:'Superviseur',		2:'Nadzorca',			3:'Opzichter',			4:'Betreuer',			5:'Supervisore',			6:'Supervisor', 			7:'Supervisor'	};
C_XL.d['al-operator'] 	= { 0:'Operator',			1:'Opérateur',			2:'Operator',			3:'operator',			4:'anwender',			5:'Operatore',				6:'Operador', 				7:'Operador'	};
C_XL.d['al-eresa'] 		= { 0:'Web-page',			1:'Page Web',			2:'Strona internetowa',	3:'Web-pagina',			4:'Webseite',			5:'Pagina web',				6:'Página web', 			7:'Página web'	};
C_XL.d['al-synchro'] 	= { 0:'Synchronization',	1:'Synchronisation',	2:'Synchronizacja',		3:'Synchronisatie',		4:'Synchronisation',	5:'Sincronizzazione',		6:'Sincronización', 		7:'Sincronização'	};
C_XL.d['brand'] 		= { 0:'Brand',				1:'Marque',				2:'Marka',				3:'Merk',				4:'Marke',				5:'Marca',					6:'Marca', 					7:'Marca'	};
C_XL.d['program name'] 	= { 0:'Program name',		1:'application',		2:'Nazwa programu',		3:'Programmanaam',		4:'anwendung',			5:'applicazione',			6:'aplicación', 			7:'aplicação'	};
C_XL.d['contact person']= { 0:'Contact person',		1:'Personne de contact',2:'Osoba kontaktowa',	3:'Contactpersoon',		4:'Kontaktperson',		5:'Persona di contattato',	6:'Persona de contacto', 	7:'Pessoa de contacto'	};



C_XL.d['access allowance'] = { 0:'access allowance',	1:'allocation d\'accès',2:'Zasiłek dostęp',			3:'Toegang uitkering',		4:'Zugangsberechtigung',			5:'assegnazione d\accesso',	6:'asignación de acceso', 	7:'Contribuição de acesso'	};
C_XL.d['accesses'] 		= { 0:'accesses',				1:'accès',				2:'Dostęp',					3:'Toegangen',				4:'Zugriffe',						5:'accesso',				6:'acceso', 				7:'acesso'	};
C_XL.d['access keys'] 	= { 0:'access keys',			1:'Clés d\'accès',		2:'Klawisze dostępu',		3:'Toegangssleutels',		4:'Zugriffsschlüsse',				5:'Chiave d\'accesso',		6:'Clave de acceso', 		7:'Chave de acesso'	};
C_XL.d['accounts'] 		= { 0:'accounts',				1:'Comptes',			2:'Rachunki',				3:'accounts',				4:'Konten',							5:'Conti',					6:'Cuentas', 				7:'Contas'	};
C_XL.d['logged in'] 	= { 0:'Logged in',				1:'Connecté',			2:'Zapisane',				3:'Ingelogd',				4:'Eingeloggt',						5:'Connesso',				6:'Vinculado', 				7:'Ligado'	};
C_XL.d['akeys count'] 	= { 0:'Number of keys',			1:'Nombre de clés',		2:'Klawisze numeryczne',	3:'aantal sleutels',		4:'Schlüsselanzahl',				5:'Numero di chiavi',		6:'Número de claves', 		7:'Número de chaves'	};
C_XL.d['akey related'] 	= { 0:'Key for this account',	1:'Clé pour ce compte',	2:'Kluczem do tego konta',	3:'Sleutel tot deze account',4:'Schlüssel für dieses Konto',	5:'Chiave per questo conto',6:'Clave para esta cuenta', 7:'Chave para esta conta'	};
C_XL.d['account id'] 	= { 0:'account id',				1:'Numéro de compte',	2:'Numer konta',			3:'account nummer',			4:'Kontonummer',					5:'Numero di conto',		6:'Número de cuenta', 		7:'Número da conta'	};
C_XL.d['synchro'] 		= { 0:'Synchronization',		1:'Synchronisation',	2:'Synchronizacja',			3:'Synchronisatie',			4:'Synchronisation',				5:'Sincronizzazione',		6:'Sincronización', 		7:'Sincronização'	};
C_XL.d['correlators']	= { 0:'Correlators',			1:'Correlators',		2:'correlators',			3:'Correlators',			4:'Korrelatoren',					5:'Correlatori',			6:'Correladores', 			7:'Correlatos'	};
C_XL.d['initialization']= { 0:'Initialization',			1:'Initialisation',		2:'Inicjalizacji',			3:'Initialisatie',			4:'Initialisierung',				5:'Inizializzazione',		6:'Inicialización', 		7:'Inicialização'	};
C_XL.d['updates']		= { 0:'Updates',				1:'actualisation',		2:'aktualizacje',			3:'Updates',				4:'Updates',						5:'attualizzazione',		6:'actualización', 			7:'atualização'	};
C_XL.d['backup']		= { 0:'Backup',					1:'Sauvegarde',			2:'Backup',					3:'Backup',					4:'Backup',							5:'Backup',					6:'Backup', 				7:'Backup'	};
C_XL.d['restore']		= { 0:'Restore',				1:'Restauration',		2:'Restore',				3:'Restore',				4:'Wiederherstellen',				5:'Ripristinare',			6:'Restablecer', 			7:'Restauração'	};
C_XL.d['maintenance']	= { 0:'Maintenance',			1:'Maintenance',		2:'Konserwacja',			3:'Onderhoud',				4:'Wartung',						5:'Mantenimento',			6:'Mantenimiento', 			7:'Manutenção'	};
C_XL.d['utilities']		= { 0:'Utilities',				1:'Outils',				2:'Przybory',				3:'Gereedschap',			4:'Werkzeuge',						5:'attrezzature',			6:'Herramientas', 			7:'Ferramentas'	};

C_XL.d['ack visitors']	= { 0:'acknowledge visitors',	1:'Validation visiteurs',	2:'acknowledge visitors',	3:'Validatie bezoekers',	4:'Besucher bestätigen',	5:'Convalida visitatore',	6:'Validación visitante', 	7:'Validação de visitantes'	};
C_XL.d['ack resa']		= { 0:'acknowledge reservs',	1:'Validation RDVs',		2:'acknowledge reservs',	3:'Validatie reservaties',	4:'Termmine bestätigen',	5:'Convalida appuntamenti',	6:'Validación citas', 		7:'Validação de compromissos'	};

	// preferences permissions
	
C_XL.d['permissions']	= { 0:'Permissions',		1:'Permissions',		2:'Uprawnienia',	3:'Toestemmingen',		4:'Zulassungen',	5:'Permessi',	6:'Permisos', 7:'Permissões'	};
			
			// usage
C_XL.d['reg usage']		= { 0:'Regular usage',				1:'Utilisation régulière',				2:'Regularne korzystanie z',			3:'Regelmatig gebruik',				4:'Regelmäßige Nutzung',						5:'Uso regolare',								6:'Uso regular', 									7:'Uso regular'			};
C_XL.d['cr_resas']		= { 0:'create reservations',		1:'créer des réservations',				2:'tworzenie rezerwacji',				3:'reserveringen maken',			4:'Reservierungen erstellen',					5:'creare prenotazioni',						6:'crear reservas', 								7:'criar reservas'		};
C_XL.d['cr_tasks']		= { 0:'create tasks',				1:'créer des tâches',					2:'tworzenie miejsc pracy',				3:'taken maken',					4:'aufgaben erstellen',							5:'creare attività',							6:'crear tareas', 									7:'criar tarefas'		};
C_XL.d['cr_notes']		= { 0:'create notes',				1:'créer des notes',					2:'sporządzanie notatek',				3:'Notas maken',					4:'Notizen erstellen',							5:'creare note',								6:'crear notas', 									7:'criar notas'			};
C_XL.d['cr_chats']		= { 0:'create chats',				1:'créer des chats',					2:'czaty zrobić',						3:'chats maken',					4:'Chats erstellen',							5:'creare chats',								6:'crear chats', 									7:'criar chats'			};
C_XL.d['ac_disprefs']	= { 0:'access to display details',	1:'accède aux détails d\'affichage',	2:'dostęp do wyświetlania szczegółów',	3:'toegang naar display voorkeuren',4:'Zugriff auf display Details anzeigen',		5:'accede ai dettagli di visualizzazione',		6:'accede a los detalles de la pantalla', 			7:'acesso para exibir detalhes'				};
C_XL.d['ac_stats']		= { 0:'see statistics',				1:'voir les statistiques',				2:'dostęp do statystyk',				3:'toegang naar statistieken',		4:'Statistiken ansehen',						5:'consultare le statistiche',					6:'ver las estadísticas', 							7:'ver as estatísticas'						};
C_XL.d['ac_visis']		= { 0:'see visitors register',		1:'voir le registre visitors',			2:'dostęp do rejestru visitors',		3:'toegang naar visitors register',	4:'visitors Verzeichnis ansehen',				5:'consultare il registro visitors',			6:'ver el registro de visitors', 					7:'ver o registo visitors'					};
C_XL.d['ac_archv']		= { 0:'access to notes and tasks',	1:'accède aux notes et tâches',			2:'uzyskuje dostęp do notatek i zadań',	3:'toegang tot notities en taken',	4:'Zugriff auf Notizen und Aufgaben',			5:'accede a note e attività',					6:'accede a notas y tareas', 						7:'acessa notas e tarefas'					};
C_XL.d['ac_sfind']		= { 0:'access to search and find',	1:'accède à filtrer et trouver',		2:'dostęp do filtrowania i znajdowania',3:'toegang tot filteren en zoeken',	4:'Zugang zum Filtern und Finden',				5:'accedere al filtro e trovare',				6:'acceso para filtrar y encontrar', 				7:'acesso para filtrar e encontrar'			};
C_XL.d['ac_setup']		= { 0:'access setup & preferences',	1:'accède aux réglages & préférences',	2:'dostęp do ustawień i preferencji',	3:'toegang naar setup & voorkeuren',4:'Zugriff auf Einstellungen und Präferenzen',	5:'accede alle configurazioni e preferenze',	6:'accede a las configuraciones y preferencias', 	7:'acede às configurações e preferências'	};
C_XL.d['ch_hourly']		= { 0:'change hourlies',			1:'changer l\'horaire',					2:'dostosować harmonogram',				3:'uurrooster aanpassen',			4:'Zeitplan anpassen',							5:'cambiare l\'orario',							6:'cambiar el horario', 							7:'alterar o horário'		};
C_XL.d['ch_calendar'] 	= { 0:'change calendar',			1:'changer le calendrier',				2:'dostosowywanie kalendarza',			3:'kalender aanpassen',				4:'Kalender anpassen',							5:'cambiare il calendario',						6:'cambiar el calendario', 							7:'alterar o calendário'	};
C_XL.d['op_resas'] 		= { 0:'open reservations',			1:'ouvrir des réservations',			2:'otwarte rezerwacje',					3:'reserveringen open doen',		4:'offene Reservierungen',						5:'prenotazioni aperte',						6:'reservas abiertas', 								7:'reservas abertas'		};
			
			// setup
C_XL.d['setup']		= { 0:'Setup & preferences',			1:'Réglage & préférences',				2:'Ustawienia i preferencje',			3:'Setup & voorkeuren',					4:'Einstellungen und Präferenzen',					5:'Configurazione & preferenze',			6:'Configuración y preferencias', 			7:'Configuração e Preferências'	};
C_XL.d['cr_bcals']	= { 0:'create main resources',			1:'créer des resources principales',	2:'stworzyć podstawowe zasoby',			3:'basis middelen creëren',				4:'Hauptressourcen erstellen',						5:'creare risorse principali',				6:'crear recursos principales', 			7:'criar recursos principais'	};
C_XL.d['cr_ucals']	= { 0:'create mandatory resources',		1:'créer des resources obligatoires',	2:'tworzenia obowiązkowych zasobów',	3:'verplichte middelen creëren',		4:'Pflichtressourcen erstellen',					5:'creare risorse obbligatorie',			6:'crear recursos obligatorios', 			7:'criar recursos obrigatórios'	};
C_XL.d['cr_fcals']	= { 0:'create faculative resources',	1:'créer des resources facultatives',	2:'stworzyć faculative zasoby',			3:'facultative middelen creëren',		4:'Optionale Ressourcen erstellen',					5:'creare risorse facoltative',				6:'crear recursos facultativos', 			7:'criar recursos opcionais'	};
C_XL.d['cr_logins']	= { 0:'create logins',					1:'créer des accès',					2:'tworzenie loginów',					3:'logins creëren',						4:'Nutzerkonten erstellen',							5:'creare accessi',							6:'crear accesos', 							7:'criar acesso'				};
C_XL.d['ch_logins']	= { 0:'change logins',					1:'changer des accès',					2:'zmiany loginów',						3:'logins aanpassen',					4:'Nutzerkonten anpassen',							5:'modificare accessi',						6:'modificar accesos', 						7:'alterar acesso'				};
C_XL.d['cr_comm']	= { 0:'create communication templates',	1:'créer des communications pré-formatées',	2:'tworzyć komunikację',			3:'communicatie patronen creëren',		4:'Kommunikationsvorlagen erstellen',				5:'creare comunicazioni predefinite',		6:'crear comunicaciones predefinidas', 		7:'criar comunicações pré-formatadas'	};
C_XL.d['cr_ccss']	= { 0:'create custom colors & status',	1:'créer statuts et couleurs',			2:'tworzyć własne kolory',				3:'kleuren en status maken',			4:'Benutzerdefinierte Farben & Status erstellen',	5:'creare statuti e colori',				6:'crear estados y colores', 				7:'criar estados e cores'				};
C_XL.d['cr_wrkc']	= { 0:'create performances',			1:'créer des prestations',				2:'producent wydajność',				3:'prestaties maken',					4:'Leistungen erstellen',							5:'creare prestazioni',						6:'crear reservas', 						7:'criar prestações'					};
C_XL.d['ch_comm']	= { 0:'change communication templates',	1:'changer la communication pré-formatée',	2:'dopasowywanie wzorców komunikacji',3:'communicatie patronen aanpassen',	4:'Kommunikationsvorlagen anpassen',				5:'modificare la comunicazione predefinita',6:'modificar la comunicación predefinida', 	7:'alterar a comunicação pré-formatada'	};
C_XL.d['ch_wrkc']	= { 0:'change performances',			1:'changer les prestations',			2:'dostosuj wydajność',					3:'prestaties aanpassen',				4:'Leistungen anpassen',							5:'modificare le prestazioni',				6:'modificar los servicios', 				7:'alterar as prestações'				};
C_XL.d['ch_ccss']	= { 0:'change custom colors & status',	1:'changer les statuts et couleurs',	2:'wyregulować kolor i stan',			3:'kleuren en status aanpassen',		4:'Farben & Status anpassen',						5:'modificare gli statuti e colori',		6:'modificar los estados y colores', 		7:'alterar os estatutos e as cores'		};


	// preferences workcodes

C_XL.d['timeboxing']	= { 0:'Time boxing',	1:'Bloc horaire',	2:'Time boxing',	3:'Time boxing',	4:'Zeitblöcke',	5:'Blocco orario',	6:'Bloqueo horario', 	7:'Bloco horário'	};
C_XL.d['workcode'] 		= { 0:'Performance',	1:'Prestation',		2:'świadczenie',	3:'Prestatie',		4:'Leistung',	5:'Prestazione',	6:'Servicio', 			7:'Prestação'	};
C_XL.d['euros'] 		= { 0:'€',				1:'€',				2:'€',				3:'€',				4:'€',			5:'€',				6:'€', 					7:'€'	};
C_XL.d['code'] 			= { 0:'Code',			1:'Code',			2:'Kod',			3:'Code',			4:'Code',		5:'Codice',			6:'Código', 			7:'Código'	};
C_XL.d['price'] 		= { 0:'Price €',		1:'Prix €',			2:'Cena €',			3:'Prijs €',		4:'Preis €',	5:'Prezzo €',		6:'Precio €', 			7:'Preço €'	};
C_XL.d['performance'] 	= { 0:'Performance',	1:'Prestation',		2:'świadczenie',	3:'Prestatie',		4:'Leistung',	5:'Prestazione',	6:'Servicio', 			7:'Prestação'	};
C_XL.d['performances'] 	= { 0:'Performances',	1:'Prestations',	2:'świadczenia',	3:'Prestaties',		4:'Leistungen',	5:'Prestazioni',	6:'Servicios', 			7:'Prestações'	};

C_XL.d['e-reservable'] 	= { 0:'e-Reservable',	1:'e-Reservable',		2:'e-Reservable',	3:'e-Reservable',		4:'e-Reservierbar',	5:'e-Prenotabile',		6:'e-Reservable', 	7:'e-Reserva'	};
C_XL.d['new workcode'] 	= { 0:'New performance',1:'Nouvelle prestation',2:'Nowa wydajność',	3:'Nieuwe prestatie',	4:'Neue Leistung',	5:'Nuova prestazione',	6:'Nuevo servicio', 7:'Nova prestação'	};

//2022-11-11 DEV/JBA
C_XL.d['deposit'] = { 0:'prepayment', 1:'acompte', 2:'przedpłata', 3:'voorschot', 4:'vorauszahlung', 5:'pagamento anticipato', 6:'pago por adelantado', 7:'pagamento adiantado' };

	// secretary guidelines

C_XL.d['no guideline'] 	= { 0:'None',			1:'aucune',					2:'Brak',			3:'Geen',				4:'Keine',				5:'Nessuna',		6:'Ninguna', 			7:'Nenhuma'	};
C_XL.d['guidelines'] 	= { 0:'Guidelines',		1:'Directives',				2:'Wytyczne',		3:'Richtlijnen',		4:'Richtlinie',			5:'Direttive',		6:'Directivas', 		7:'Diretivas'	};
C_XL.d['directions'] 	= { 0:'Directions',		1:'Itinéraire',				2:'Kierunki',		3:'Richtingen',			4:'anweisungen',		5:'Itinerario',		6:'Itinerario', 		7:'Itinerário'	};
C_XL.d['new guidelines']= { 0:'New guidelines',	1:'Nouvelles directives',	2:'Nowe wytyczne',	3:'Nieuwe richtlijnen',	4:'Neue Richtlinien',	5:'Nuove direttive',6:'Nuevas directivas', 	7:'Novas diretivas'	};
C_XL.d['gdl requests'] 	= { 0:'Requests',		1:'Demandes',				2:'Wnioski',		3:'Verzoeken',			4:'anfragen',			5:'Richiesta',		6:'Pedidos', 			7:'Pedidos'	};
C_XL.d['gdl never'] 	= { 0:'Don\'t',			1:'Jamais',					2:'Nie rób',		3:'Niet doen',			4:'Nie',				5:'Mai',			6:'Nunca', 				7:'Nunca'	};
C_XL.d['gdl tips'] 		= { 0:'Tips & tricks',	1:'Conseils',				2:'Rada',			3:'Tipps & tricks',		4:'Tips & Tricks',		5:'Consigli',		6:'Consejos', 			7:'Conselhos'	};

C_XL.d['gdlns 4 new visitors'] 	= { 0:'Guidelines when new visitor',1:'Directives en cas de nouveau visiteur',	2:'Wytyczne,	gdy nowy użytkownik',	3:'Richtlijnen indien nieuwe bezoeker',		4:'anweisungen bei neuen Besuchern',	5:'Direttive in caso di nuovo visitatore',	6:'Directivas en caso de nuevo visitante', 	7:'Diretivas no caso de novo visitante'	};
C_XL.d['gdlns 4 appointment'] 	= { 0:'Guidelines when appointing',	1:'Directives pour la prise de RDV',		2:'Wytyczne do umawiania spotkań',	3:'Richtlijnen voor het maken van afspraken',	4:'anweisungen für die Terminaufnahme',	5:'Direttive per prendere un appuntamento',	6:'Directivas para tomar una cita', 		7:'Diretivas para marcar consulta'	};
C_XL.d['gdlns 4 requests'] 		= { 0:'Guidelines for requests',	1:'Directives pour les demandes spéciales',	2:'Wytyczne do prośby',				3:'Richtlijnen voor speciale verzoeken',		4:'anweisungen für neue Anfragen',		5:'Direttive per le richieste speciali',	6:'Directivas para pedidos especiales', 	7:'Diretivas para pedidos especiais'	};
C_XL.d['gdlns 4 dont'] 			= { 0:'Never do or say',			1:'Ne jamais faire ou dire',				2:'Nigdy nie powiedzieć lub zrobić',3:'Nooit zeggen of doen',	               		4:'Niemals tun oder sagen',				5:'Non dire o fare mai',					6:'Nunca decir o hacer', 					7:'Nunca fazer ou dizer'	};
C_XL.d['gdlns 4 tips'] 			= { 0:'Tips and tricks',			1:'autres conseils',						2:'Inne wskazówki',					3:'andere tips & tricks',	               		4:'andere Tipps & Tricks',				5:'altri consigli',							6:'Otros consejos', 						7:'Outras recomendações'	};
	

	// message fusion tags  // check  (*T01*)

C_XL.d['{tmp_confirm}']		= { 0:'Confirmation',		1:'Confirmation',		2:'Potwierdzenie',							3:'Bevestiging',		4:'Bestätigung',		5:'Conferma',						6:'Confirmación', 					7:'Confirmação'	};
C_XL.d['{tmp_eve}']			= { 0:'Eve reminder',		1:'Rappel la veille',	2:'Przypomnienie dzień przed wizytą',		3:'Vooravond',			4:'am abend vorher',	5:'Promemoria il giorno prima',		6:'Recordatorio el día antes', 		7:'Lembrete no dia anterior'	};
C_XL.d['{tmp_oneweek}']		= { 0:'One week before',	1:'Rappel en7',			2:'Przypomnienie dzień przed wizytą',		3:'Een week tevoren',	4:'Eine Woche vorher',	5:'Promemoria una settimana prima',	6:'Recordatorio una semana antes', 	7:'Lembrete em7'	};

C_XL.d['{business}']		= { 0:'account name',		1:'Nom du compte',	2:'Nazwa konta',		3:'accountnaam',		4:'Kontoname',		5:'Nome del conto',		6:'Nombre de la cuenta', 	7:'Nome da conta'	};
C_XL.d['{time}']			= { 0:'Time',				1:'Heure',			2:'Godzina',			3:'Uur',				4:'Uhrzeit',		5:'Ora',				6:'Hora', 					7:'Hora'	};
C_XL.d['{date}']			= { 0:'Date',				1:'Date',			2:'Data',				3:'Datum',				4:'Datum',			5:'Data',				6:'Fecha', 					7:'Data'	};
C_XL.d['{day}']				= { 0:'Weekday',			1:'Jour',			2:'Dzień',				3:'Weekdag',			4:'Wochentag',		5:'Giorno',				6:'Día', 					7:'Dia'	};
C_XL.d['{dear}']			= { 0:'Dear',				1:'Chèr(e)',		2:'',					3:'Beste',				4:'Liebe(r)',		5:'Caro/a',				6:'Estimado/a', 			7:'Caro/a'	};
C_XL.d['{gender}'] 			= { 0:'Title',				1:'Civ.',			2:'Godność',			3:'Gesl.',				4:'anrede',			5:'Titolo',				6:'Título', 				7:'Forma de tratamento'	};
C_XL.d['{fname}'] 			= { 0:'First name',			1:'Prénom',			2:'Imię',				3:'Voornaam',			4:'Vorname',		5:'Nome',				6:'Nombre', 				7:'Nome'	};
C_XL.d['{lname}'] 			= { 0:'Last name',			1:'Nom',			2:'Nazwisko',			3:'Naam',				4:'Nachname',		5:'Cognome',			6:'apellido', 				7:'apelido'	};
C_XL.d['{info}'] 			= { 0:'Info note',			1:'Information',	2:'Informacje',			3:'Informatie',			4:'Information',	5:'Informazione',		6:'Información', 			7:'Informação'	};
C_XL.d['{resa_note}'] 		= { 0:'Note',				1:'Note',			2:'Notatka',			3:'Notitie',			4:'Notiz',			5:'Nota',				6:'Nota', 					7:'Nota'	};
C_XL.d['{perf_note}'] 		= { 0:'Performance note',	1:'Note prestation',2:'Uwaga świadczenie',	3:'Nota prestatie',		4:'Notiz Leistung',	5:'Nota prestazione',	6:'Nota servicio', 			7:'Nota prestação'	};

C_XL.d['{company}'] 		= C_XL.d['company']; 	// !! No translation on this line
C_XL.d['{mobile}'] 			= C_XL.d['mobile'];
C_XL.d['{regist}'] 			= C_XL.d['registration'];
C_XL.d['{address}'] 		= C_XL.d['address'];
C_XL.d['{email}'] 			= C_XL.d['email'];
C_XL.d['{perf}'] 			= C_XL.d['workcode'];
C_XL.d['{bcode}'] 			= C_XL.d['booking code']; // bookingcode

C_XL.d['{att_bcal}'] 		= { /* set by setContextLanguage() */ }; 	// !! No translation on this line
C_XL.d['{att_ucal}'] 		= { /* set by setContextLanguage() */ };
C_XL.d['{att_fcal}'] 		= { /* set by setContextLanguage() */ };
C_XL.d['{participants}'] 	= { /* set by setContextLanguage() */ };


C_XL.d['tmp_confirm'] = {	0:'{dear} {gender} {lname}, {business} confirms your new appointment on {day} {date} at {time}. Looking forward to welcome you, regards.', 
				1:'{dear} {gender} {lname}, {business} est heureux de vous confirmer votre RDV du {day} {date} à {time}. A bientôt!', 
				2:'Wiadomosc od {business}: Potwierdzamy wizyte. Data: {day} {date} o {time}. Do zobaczenia!',	
				3:'{dear} {gender} {lname}, {business} bevestigt u nieuwe afspraak op {day} {date} om {time}. Tot binnenkort, groeten.',
				4:'{dear} {gender} {lname}, {business} freut sich auf Ihren Besuch am {day} {date} um {time}. Bis bald!.', 
				5:'{dear} {gender} {lname}, {business} è lieto di confermarLe il Suo appuntamento il {day} {date} alle {time}. A presto!', 
				6:'{dear} {gender} {lname}, {business} está feliz de confirmarLe su cita el {day} {date} a las {time}. Hasta pronto!', 7:'{dear} {gender} {lname}, {business} tem o prazer de conformar o seu encontro em {day} {date} às {time}. Até breve!' };

C_XL.d['tmp_eve'] = {	0:'{dear} {gender} {lname}, this msg is to remind your appointment tomorrow {day} {date} at {time}. Regards, {business}',
				1:'{dear} {gender} {lname}, ce msg pour vous rappeler votre RDV de demain {day} {date} à {time}. Cordialement, {business}', 
				2:'Wiadomosc od {business}: Przypominamy o wizycie. Data: {day} {date} o {time}. Do zobaczenia!', 
				3:'{dear} {gender} {lname}, deze boodschap als herinnering van onze afspraak morgen {day} {date} om {time}. Groeten, {business}',
				4:'{dear} {gender} {lname}, hiermit möchten wir Sie an Ihren Termin am {day} {date} um {time} erinnern. Beste Grüße, {business}', 
				5:'{dear} {gender} {lname}, questo msg è per ricordarLe il Suo appuntamento di domani {day} {date} alle {time}. Cordiali saluti, {business}', 
				6:'{dear} {gender} {lname}, este mensaje es para recordarle su cita de mañana {day} {date} a las {time}. Saludos cordiales, {business}', 7:'{dear} {gender} {lname}, esta mensagem tem o objetivo de lembrá-lo/a do seu encontro de amanhã {day} {date} às {time}. Cordialmente, {business}'	};

C_XL.d['tmp_oneweek'] = {	0:'{gender} {lname}, you have an appointment on {day} {date} at {time}. Would you be unavailable, please send back a sms. Regards, {business}',	
				1:'{gender} {lname}, vous avez RDV le {day} {date} à {time}. En cas d\'indisponibilité, répondez à ce sms. Cordialement, {business}',	
				2:'Wiadomosc od {business}: Przypominamy o wizycie. Data: {day} {date} o {time}. Odpowiedz na ta wiadomosc w razie zmiany planów.',	
				3:'{gender} {lname}, we hebben op {day} {date} om {time} afgesproken. Een onbeschikbaarheid?, stuur dan een sms terug. Groeten, {business}',
				4:'{gender} {lname}, Sie haben am {day} {date} um {time} einen Termin. Bitte auf diese SMS antworten, falls Sie ihn nicht wahrnehmen können. MfG, {business}', 
				5:'{gender} {lname}, ha un appuntamento il {day} {date} alle {time}. In caso di non disponibilità, risponda a questo sms. Cordiali saluti, {business}',	
				6:'{gender} {lname}, tiene una cita el {day} {date} a las {time}. En caso de indisponibilidad, responda a este sms. Saludos cordiales, {business}', 7:'{gender} {lname}, você tem um encontro marcado a {day} {date} às {time}. Caso não se encontre disponível, responda a este SMS. Cordialmente, {business}'
};
	
	
	// C_iARRAY catalysts
	//
		
C_XL.d['export iArray'] 	= { 0:'Export this table',	
								1:'Exporter cette table',	
								2:'Należy wyeksportować tabelę',	
								3:'Exporteer deze tabel',	
								4:'Diese Tabelle exportieren',	5:'Esportare questa tabella',	
								6:'Exportar este tablero', 7:'Exportar este quadro'	};


// 		technical 				english:0,		french:1,			polish:2,		dutch:3,		german:4,		italian:5,		spanish:6,			portuguese:7


C_XL.d['actions-id'] 		= { 0:'login',		1:'login',			2:'login',		3:'login',		4:'login',		5:'login',		6:'login', 			7:'Início de sessão'	};

C_XL.d['actions-resaNew'] 	= { 0:'New',		1:'Nouveaux',		2:'Nowy',		3:'Nieuwe',		4:'Neu',		5:'Nuovi',		6:'Nuevos', 		7:'Novos'	};
C_XL.d['actions-resaEdit'] 	= { 0:'Edited',		1:'Modifiés',		2:'Zmiana',		3:'Veranderd',	4:'Geändert',	5:'Modificati',	6:'Modificados', 	7:'Modificados'	};
C_XL.d['actions-resaDel'] 	= { 0:'Deleted',	1:'Supprimés',		2:'Od',			3:'Verwijderd',	4:'Gelöscht',	5:'Soppressi',	6:'Borrados', 		7:'apagados'	};

C_XL.d['actions-appNew'] 	= { 0:'New',		1:'Nouveaux',		2:'Nowy',		3:'Nieuwe',		4:'Neu',		5:'Nuovi',		6:'Nuevos', 		7:'Novos'	};
C_XL.d['actions-appEdit'] 	= { 0:'Edited',		1:'Modifiés',		2:'Zmiana',		3:'Veranderd',	4:'Geändert',	5:'Modificati',	6:'Modificados', 	7:'Modificados'	};
C_XL.d['actions-appDel'] 	= { 0:'Deleted',	1:'Supprimés',		2:'Od',			3:'Verwijderd',	4:'Gelöscht',	5:'Soppressi',	6:'Borrados', 		7:'apagados'	};

C_XL.d['actions-noteNew'] 	= { 0:'New',		1:'Nouveaux',		2:'Nowy',		3:'Nieuwe',		4:'Neu',		5:'Nuovi',		6:'Nuevos', 		7:'Novos'	};
C_XL.d['actions-noteEdit'] 	= { 0:'Edited',		1:'Modifiés',		2:'Zmiana',		3:'Veranderd',	4:'Geändert',	5:'Modificati',	6:'Modificados', 	7:'Modificados'	};
C_XL.d['actions-noteDel'] 	= { 0:'Deleted',	1:'Supprimés',		2:'Od',			3:'Verwijderd',	4:'Gelöscht',	5:'Soppressi',	6:'Borrados', 		7:'apagados'	};

C_XL.d['actions-taskNew'] 	= { 0:'New',			1:'Nouveaux',	2:'Nowy',		3:'Nieuwe',		4:'Neu',		5:'Nuovi',		6:'Nuevos', 		7:'Novos'	};
C_XL.d['actions-taskEdit'] 	= { 0:'Edited',			1:'Modifiés',	2:'Zmiana',		3:'Veranderd',	4:'Geändert',	5:'Modificati',	6:'Modificados', 	7:'Modificados'	};
C_XL.d['actions-taskDel'] 	= { 0:'Deleted',		1:'Supprimés',	2:'Od',			3:'Verwijderd',	4:'Gelöscht',	5:'Soppressi',	6:'Borrados', 		7:'apagados'	};
C_XL.d['actions-taskAssigned'] 	= { 0:'assigned',	1:'assignées',	2:'Przydzielony',3:'Toegewezen',4:'Zugewiesen',	5:'attribuite',	6:'asignadas', 		7:'atribuídos'	};
C_XL.d['actions-taskAchieved'] 	= { 0:'achieved',	1:'accomplies',	2:'Osiągnięty',	3:'afgewerkt',	4:'ausgeführt',	5:'Concluse',	6:'Concluidas', 	7:'Concluídos'	};

C_XL.d['actions-visiNew'] 	= { 0:'New',		1:'Nouveaux',		2:'Nowy',		3:'Nieuwe',		4:'Neu',		5:'Nuovi',		6:'Nuevos', 		7:'Novos'	};
C_XL.d['actions-visiEdit'] 	= { 0:'Edited',		1:'Modifiés',		2:'Zmiana',		3:'Veranderd',	4:'Geändert',	5:'Modificati',	6:'Modificados', 	7:'Modificados'	};
C_XL.d['actions-visiMerge'] = { 0:'Deleted',	1:'Supprimés',		2:'Od',			3:'Verwijderd',	4:'Gelöscht',	5:'Soppressi',	6:'Borrados', 		7:'apagados'	};
	

C_XL.d['actuals-resourceId'] 	= { 0:'agenda',			1:'agenda',			2:'agenda',			3:'agenda',			4:'Kalender',		5:'agenda',			6:'Calendario', 7:'Calendário'	};
C_XL.d['actuals-offdayCount'] 	= { 0:'Off days',		1:'Congés',			2:'Dni wolne',		3:'Congés',			4:'freie Tage',		5:'Ferie',			6:'Vacaciones', 7:'Férias'		};
C_XL.d['actuals-resaCount'] 	= { 0:'Reservations',	1:'Réservations',	2:'Rezerwacje',		3:'Reserveringen',	4:'Reservierungen',	5:'Prenotazioni',	6:'Reservas', 	7:'Reservas'	};
C_XL.d['actuals-appCount'] 		= { 0:'appointments',	1:'Rendez-vous',	2:'Powołanie',		3:'afspraken',		4:'Termine',		5:'appuntamento',	6:'Cita', 		7:'Compromissos'};
C_XL.d['actuals-offdayTime'] 	= { 0:'durations',		1:'durées',			2:'czas trwania',	3:'duurtijden',		4:'Dauer',			5:'durate',			6:'duración', 	7:'duração'		};
C_XL.d['actuals-resaTime'] 		= { 0:'elapsed',		1:'écoulés',		2:'który upłynął',	3:'verstreken',		4:'verstrichen',	5:'passati',		6:'pasados', 	7:'passados'	};
C_XL.d['actuals-appTime'] 		= { 0:'elapsed',		1:'écoulés',		2:'który upłynął',	3:'verstreken',		4:'verstrichen',	5:'passati',		6:'pasados', 	7:'passados'	};


C_XL.d['display in table'] 		= { 0:'Display in table',
									1:'afficher dans le tableau',	 
									2:'Pokazane w tabeli',	
									3:'Weergegeven in tabel',	
									4:'In der Tabelle anzeigen',	
									5:'Mostrare nella tabella',	
									6:'Mostrar en el tablero', 7:'Exibir no quadro'	};

C_XL.d['visitor'] = { 	0:'visitor',	1:'visitor',	2:'visitor',	3:'visitor',	4:'visitor',	5:'visitor',	6:'visitor', 	7:'visitor'	};  // !! No translation on this line
C_XL.d['visitors'] = {	0:'visitors',	1:'visitors',	2:'visitors',	3:'visitors',	4:'visitors',	5:'visitors',	6:'visitors', 	7:'visitors'	}; // !! No translation on this line (*xl01*)



// 		technical 				english:0,				french:1,			polish:2,			dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7

C_XL.d['visi-abr-id'] 			= { 0:'id',				1:'id',				2:'id',				3:'id',				4:'id',				5:'id',			6:'id', 			7:'Id'				};
C_XL.d['visi-abr-vip'] 			= { 0:'VIP',			1:'VIP',			2:'VIP',			3:'VIP',			4:'VIP',			5:'VIP',		6:'VIP', 			7:'VIP'				};
C_XL.d['visi-abr-ccss'] 		= { 0:'c',				1:'c',				2:'k',				3:'k',				4:'k',				5:'c',			6:'c', 				7:'c'				};
C_XL.d['visi-abr-gender'] 		= { 0:'gender',			1:'civil',			2:'godność',		3:'gesl.',			4:'geschlecht',		5:'genero',		6:'género', 		7:'forma de tratamento'	};
C_XL.d['visi-abr-firstname']	= { 0:'firstname',		1:'prénom',			2:'imię',			3:'voornaam',		4:'vorname',		5:'nome',		6:'nombre', 		7:'nome próprio'	};
C_XL.d['visi-abr-lastname'] 	= { 0:'lastname',		1:'nom',			2:'nazwisko',		3:'familie naam',	4:'nachname',		5:'cognome',	6:'apellido', 		7:'apelido'			};
C_XL.d['visi-abr-company'] 		= { 0:'company',		1:'entreprise',		2:'firma',			3:'firma',			4:'firma',			5:'azienda',	6:'empresa', 		7:'empresa'			};
C_XL.d['visi-abr-residence'] 	= { 0:'residence',		1:'résidence',		2:'rezydencja',		3:'residentie',		4:'wohnsitz',		5:'residenza',	6:'residencia', 	7:'residência'		};
C_XL.d['visi-abr-address'] 		= { 0:'address',		1:'adresse',		2:'adres',			3:'adres',			4:'adresse',		5:'indirizzo',	6:'dirección', 		7:'endereço'		};
C_XL.d['visi-abr-zipCode'] 		= { 0:'zip',			1:'CP',				2:'kod pocztowy',	3:'postcode',		4:'postleitzahl',	5:'postale',	6:'postal', 		7:'postal'			};
C_XL.d['visi-abr-city'] 		= { 0:'city',			1:'ville',			2:'miejscowość',	3:'stad',			4:'stadt',			5:'città',		6:'ciudad', 		7:'localidade'		};
C_XL.d['visi-abr-country'] 		= { 0:'country',		1:'pays',			2:'województwo',	3:'land',			4:'land',			5:'paese',		6:'país', 			7:'país'			};
C_XL.d['visi-abr-email'] 		= { 0:'email',			1:'email',			2:'email',			3:'email',			4:'email',			5:'email',		6:'e-mail', 		7:'email'			};
C_XL.d['visi-abr-mobile'] 		= { 0:'mobile',			1:'mobile',			2:'komórkowy',		3:'gsm',			4:'mobil',			5:'cellulare',	6:'móvil', 			7:'gsm'				};
C_XL.d['visi-abr-phone'] 		= { 0:'fix line',		1:'tel fixe',		2:'telefon',		3:'telefoon',		4:'festnetz',		5:'telefono',	6:'teléfono fijo', 	7:'telf. fixo'		};
C_XL.d['visi-abr-language'] 	= { 0:'lang.',			1:'langue',			2:'język',			3:'taal',			4:'sprache',		5:'lingua',		6:'idioma', 		7:'idioma'			};
C_XL.d['visi-abr-birthday'] 	= { 0:'bday',			1:'ddn',			2:'urodziny',		3:'geboorte',		4:'geburtsdatum',	5:'ddn',		6:'fec. nac.', 		7:'ddn'				};
C_XL.d['visi-abr-registration'] = { 0:'reg.',			1:'matr.',			2:'znac.',			3:'regs.',			4:'reg',			5:'matr.',		6:'matr.', 			7:'matr.'			};

C_XL.d['visi-id'] 			= { 0:'Data set id',	1:'Identifiant',		2:'Identyfikator',	3:'Identificatie',		4:'Identifikator',	5:'Identificazione',6:'Nombre usuario', 		7:'Identificador'	};
C_XL.d['visi-vip'] 			= { 0:'VIP',			1:'VIP',				2:'VIP',			3:'VIP',				4:'VIP',			5:'VIP',			6:'VIP', 					7:'VIP'				};
C_XL.d['visi-ccss'] 		= { 0:'Color & pattern',1:'Couleur ou motif',	2:'Kolor i wzór',	3:'Kleur of patroon',	4:'Farbe & Motiv',	5:'Colore o motivo',6:'Color o motivo', 		7:'Cor ou motivo'	};
C_XL.d['visi-gender'] 		= { 0:'Gender',			1:'Civilité',			2:'Godność',		3:'Geslacht',			4:'Geschlecht',		5:'Titolo',			6:'Género', 				7:'Forma de tratamento'	};
C_XL.d['visi-firstname']	= { 0:'Firstname',		1:'Prénom',				2:'Imię',			3:'Voornaam',			4:'Vorname',		5:'Nome',			6:'Nombre', 				7:'Nome'	};
C_XL.d['visi-lastname'] 	= { 0:'Lastname',		1:'Nom de famille',		2:'Nazwisko',		3:'Familie naam',		4:'Nachname',		5:'Cognome',		6:'apellido', 				7:'apelido'	};
C_XL.d['visi-company'] 		= { 0:'Company',		1:'Entreprise',			2:'Firma',			3:'Firma',				4:'Firma',			5:'azienda',		6:'Empresa', 				7:'Empresa'	};
C_XL.d['visi-residence'] 	= { 0:'Residence',		1:'Résidence',			2:'Rezydencja',		3:'Residentie',			4:'Wohnsitz',		5:'Residenza',		6:'Residencia', 			7:'Residência'	};
C_XL.d['visi-address'] 		= { 0:'address',		1:'adresse',			2:'adres',			3:'adres',				4:'adresse',		5:'Indirizzo',		6:'Dirección', 				7:'Morada'	};
C_XL.d['visi-zipCode'] 		= { 0:'Zip code',		1:'Code postal',		2:'Kod pocztowy',	3:'Postcode',			4:'Postleitzahl',	5:'Codice postale',	6:'Código postal', 			7:'Código postal'	};
C_XL.d['visi-city'] 		= { 0:'City',			1:'Ville',				2:'Miejscowość',	3:'Stad',				4:'Stadt',			5:'Città',			6:'Ciudad', 				7:'Localidade'	};
C_XL.d['visi-country'] 		= { 0:'Country',		1:'Pays',				2:'Województwo',	3:'Land',				4:'Land',			5:'Paese',			6:'País', 					7:'País'	};
C_XL.d['visi-email'] 		= { 0:'e-mail',			1:'e-mail',				2:'e-mail',			3:'e-mail',				4:'e-mail',			5:'email',			6:'e-mail', 				7:'email'	};
C_XL.d['visi-mobile'] 		= { 0:'Mobile',			1:'mobile/gsm',		2:'Komórkowy',		3:'Gsm',				4:'Mobil',			5:'cellulare',		6:'móvil', 					7:'GSM'	};
C_XL.d['visi-phone'] 		= { 0:'Fix line',		1:'Tel fixe',			2:'Telefon',		3:'Telefoon',			4:'Telefon',		5:'Telefono',		6:'Teléfono fijo', 			7:'Telf. fixo'	};
C_XL.d['visi-language'] 	= { 0:'Langue',			1:'Language',			2:'Język',			3:'Taal',				4:'Sprache',		5:'Lingua',			6:'Idioma', 				7:'Idioma'	};
C_XL.d['visi-birthday'] 	= { 0:'Birthday',		1:'Date de naissance',	2:'Urodziny',		3:'Geboorte datum',		4:'Geburtsdatum',	5:'Data di nascita',6:'Fecha de nacimiento', 	7:'Data de nascimento'	};
C_XL.d['visi-registration'] = { 0:'Registration',	1:'Matricule',			2:'Znaczek',		3:'Registratie',		4:'Registrierung',	5:'Matricola',		6:'Matrícula', 				7:'Matrícula'	};


C_XL.d['resa-abr-id'] 			= { 0:'id',	1:'id',	2:'id',	3:'id',	4:'id',	5:'id',	6:'id', 7:'id'	};


// 		technical 				english:0,				french:1,			polish:2,			dutch:3,		german:4,		italian:5,		spanish:6,		portuguese:7

C_XL.d['resa-abr-cueIn'] 		= { 0:'time',			1:'début',			2:'początek',		3:'tijd',		4:'Beginn',		5:'inizio',		6:'inicio', 	7:'começo'		};
C_XL.d['resa-abr-cueOut'] 		= { 0:'done',			1:'fin',			2:'koniec',			3:'tijd af',	4:'Ende',		5:'fine',		6:'fin', 		7:'fim'			};
C_XL.d['resa-abr-dateIn'] 		= { 0:'scheduled',		1:'date',			2:'rozpoczęcia',	3:'datum',		4:'Geplant',	5:'data',		6:'fecha', 		7:'data'		};
C_XL.d['resa-abr-dateOut'] 		= { 0:'ending on',		1:'date fin',		2:'zakończenia',	3:'einddatum',	4:'Endet am',	5:'data fine',	6:'fecha fin', 	7:'data fim'	};
C_XL.d['resa-abr-duration'] 	= { 0:'duration',		1:'durée',			2:'trwania',		3:'duurtijd',	4:'Dauer',		5:'durata',		6:'duración', 	7:'duração'		};
C_XL.d['resa-abr-ccss'] 		= { 0:'c',				1:'c',				2:'k',				3:'k',			4:'k',			5: 'c',			6:'c', 			7:'c'			};

C_XL.d['resa-abr-created'] 		= C_XL.d['created on']; // !! No translation on these lines
C_XL.d['resa-abr-creator'] 		= C_XL.d['creator'];
C_XL.d['resa-abr-changed']		= C_XL.d['changed on'];
C_XL.d['resa-abr-changer'] 		= C_XL.d['changer'];
C_XL.d['resa-abr-deleted'] 		= C_XL.d['deleted on'];
C_XL.d['resa-abr-deletor'] 		= C_XL.d['deletor'];
C_XL.d['resa-abr-note'] 		= C_XL.d['note'];
C_XL.d['resa-abr-performances'] = C_XL.d['workcode'];

	C_XL.d['resa-abr-visitors'] 	= C_XL.d['names'];
	C_XL.d['resa-abr-email'] 		= C_XL.d['visi-abr-email'];
	C_XL.d['resa-abr-birthday'] 	= C_XL.d['visi-abr-birthday'];
	C_XL.d['resa-abr-mobile'] 		= C_XL.d['visi-abr-mobile'];
	C_XL.d['resa-abr-zipCode'] 		= C_XL.d['visi-abr-zipCode'];
	C_XL.d['resa-abr-company'] 		= C_XL.d['visi-abr-company'];
	C_XL.d['resa-abr-residence'] 	= C_XL.d['visi-abr-residence'];
	C_XL.d['resa-abr-registration'] = C_XL.d['visi-abr-registration'];

C_XL.d['resa-abr-bCals'] = C_XL.d['{att_bcal}']; // !! No translation on these lines
C_XL.d['resa-abr-uCals'] = C_XL.d['{att_ucal}'];
C_XL.d['resa-abr-fCals'] = C_XL.d['{att_fcal}'];

C_XL.d['resa-id'] 			= { 0:'Data set id',		1:'Identifiant',		2:'Identyfikator',				3:'Identificatie',		4:'Identifikator',			5:'Identificazione',	6:'Nombre de usuario', 		7:'Identificador'	};
C_XL.d['resa-created'] 		= { 0:'Creation date',		1:'Création: date',		2:'Utworzenia data',			3:'aanmaakdatum',		4:'Erstelldatum',			5:'Creazione: data',	6:'Creación: fecha', 		7:'Criação: data'	};
C_XL.d['resa-creator'] 		= { 0:'Creator login',		1:'Création: login',	2:'Utworzenia logowania',		3:'aanmaaklogin',		4:'Erstellerlogin',			5:'Creazione: login',	6:'Creación: login', 		7:'Criação: início de sessão'	};
C_XL.d['resa-changed']		= { 0:'Modification date',	1:'Modification: date',	2:'Modyfikacji data',			3:'Wijziging datum',	4:'anpassungsdatum',		5:'Modifica: data',		6:'Modificación: fecha', 	7:'alteração: data'	};
C_XL.d['resa-changer'] 		= { 0:'Modifier login ',	1:'Modification: login',2:'Modyfikacja logowania',		3:'Wijziging: login',	4:'anpasserlogin',			5:'Modifica: login',	6:'Modificación: login', 	7:'Modificação: início de sessão'	};
C_XL.d['resa-deleted'] 		= { 0:'Deletion date',		1:'Effacé: date',		2:'Usunięcia data',				3:'Verwijdering datum',	4:'Löschdatum',				5:'Soppresso: data',	6:'Borrado: fecha', 		7:'apagado: data'	};
C_XL.d['resa-deletor'] 		= { 0:'Deletor login',		1:'Effacé: login',		2:'Usunięcia logowania',		3:'Verwijderd: login',	4:'Gelöscht von',			5:'Soppresso: login',	6:'Borrado: login', 		7:'apagado: início de sessão'	};
C_XL.d['resa-cueIn'] 		= { 0:'start time',			1:'heure de début',		2:'Czas rozpoczęcia',			3:'Starttijd',			4:'anfangszeit',			5:'ora inizio',			6:'hora de inicio', 		7:'hora de começo'	};
C_XL.d['resa-cueOut'] 		= { 0:'end time',			1:'heure de fin',		2:'Czas zakończenia',			3:'Eindtijd',			4:'Endzeit',				5:'ora fine',			6:'hora fin', 				7:'hora de fim'	};
C_XL.d['resa-dateIn'] 		= { 0:'Scheduled start date',1:'Date de début',		2:'Datę rozpoczęcia',			3:'Startdatum',			4:'Geplantes Anfangsdatum',	5:'Data d\'inizio',		6:'Fecha de inicio', 		7:'Data de início'	};
C_XL.d['resa-dateOut'] 		= { 0:'Scheduled end date',	1:'Date de fin',		2:'Data zakończenia',			3:'Einddatum',			4:'Enddatum',				5:'Data di fine',		6:'Fecha de fin', 			7:'Data de término'	};
C_XL.d['resa-duration'] 	= { 0:'Duration',			1:'Durée',				2:'Czas trwania',				3:'Duurtijd',			4:'Dauer',					5:'Durata',				6:'Duración', 				7:'Duração'	};
C_XL.d['resa-ccss'] 		= { 0:'Color & pattern',	1:'Couleur ou motif',	2:'Kolor i wzór',				3:'Kleur of patroon',	4:'Farbe & Motiv',			5:'Colore o motivo',	6:'Color o motivo', 		7:'Cor ou motivo'	};

C_XL.d['resa-note'] 		= C_XL.d['note']; 		// !! No translation on this line
C_XL.d['resa-performances'] = C_XL.d['workcode'];

	C_XL.d['resa-visitors'] 	= C_XL.d['names'];
	C_XL.d['resa-email'] 		= C_XL.d['visi-email'];
	C_XL.d['resa-birthday'] 	= C_XL.d['visi-birthday'];
	C_XL.d['resa-mobile'] 		= C_XL.d['visi-mobile'];
	C_XL.d['resa-zipCode'] 		= C_XL.d['visi-zipCode'];
	C_XL.d['resa-company'] 		= C_XL.d['visi-company'];
	C_XL.d['resa-residence'] 	= C_XL.d['visi-residence'];
	C_XL.d['resa-registration'] = C_XL.d['visi-registration'];

C_XL.d['resa-bCals'] = C_XL.d['{att_bcal}']; // !! No translation on these lines
C_XL.d['resa-uCals'] = C_XL.d['{att_ucal}'];
C_XL.d['resa-fCals'] = C_XL.d['{att_fcal}'];



// e-resa (*es01*)
//
C_XL.d['child firstname']	= { 0:'First name of the child',	1:'Prénom de l\'enfant',		2:'Imię dziecka',		3:'Voornaam van het kind',		4:'Vorname des Kindes',			5:'Nome del bambino',		6:'Nombre del niño', 	7:'Primeiro nome da criança'	};
C_XL.d['child lastname'] 	= { 0:'Family name of the child',	1:'Nom de famille de l\'enfant',2:'Nazwisko dziecka',	3:'achternaam van het kind',	4:'Familienname des Kindes',	5:'Cognome del bambino',	6:'apellido del niño', 	7:'Nome de família da criança'	};

C_XL.d['owner firstname']	= { 0:'Owner\'s firstname',		1:'Prénom du propriétaire',		2:'Imię właściciela',		3:'Voornaam van de eigenaar',	4:'Vorname des Besitzers',		5:'Nome del proprietario',	  6:'Nombre del propietario', 	7:'Nome do proprietário'	};
C_XL.d['owner lastname'] 	= { 0:'Owner\'s family name',	1:'Nom du propriétaire',		2:'Nazwisko właściciela',	3:'Familienaam van de eigenaar',4:'Familienname des Besitzers',	5:'Cognome del proprietario', 6:'apellido del propietario', 7:'apelido do proprietário'	};


		// connections
C_XL.d['cnx filters'] 	= { 0:'Filters',	1:'Filtres',	2:'Filters',	3:'Filters',		4:'Filters',	5:'Filtri',		6:'Filtros', 		7:'Filtros'		};
C_XL.d['cnx realtime'] 	= { 0:'Real-time',	1:'Instantanné',2:'Real-time',	3:'Ogenblikkelijk',	4:'Echtzeit',	5:'Istantaneo',	6:'Instantáneos', 	7:'Instantâneo'	};
C_XL.d['cnx archives'] 	= { 0:'archives',	1:'archives',	2:'archives',	3:'archives',		4:'archive',	5:'archivi',	6:'Ficheros', 		7:'Ficheiros'	};

		// SMS monitoring
C_XL.d['sms monitoring']= { 0:'SMS monitoring',	1:'SMS monitoring',	2:'SMS monitoring',		3:'SMS monitoring',	4:'SMS Überwachung',		5:'Monitoring SMS',	6:'Monitoreo SMS', 	7:'Monitorização SMS'	};
C_XL.d['sms counters'] 	= { 0:'Counters',		1:'Compteurs',		2:'Liczniki',			3:'Tellers',		4:'Zähler',					5:'Contatore',		6:'Contador', 		7:'Contadores'	};
C_XL.d['sms details'] 	= { 0:'Details',		1:'Details',		2:'Szczegóły',			3:'Details',		4:'Details',				5:'Dettagli',		6:'Detalles', 		7:'Detalhes'	};
C_XL.d['sms graphs'] 	= { 0:'Bar graphs',		1:'Graphique',		2:'Wykresy słupkowe',	3:'staafdiagrammen',4:'Balkendiagramme',		5:'Grafico',		6:'Gráfico', 		7:'Gráfico'	};


		// M_Conxion

// 		technical 				english:0,				french:1,			polish:2,			dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7
		
C_XL.d['profile'] 		= { 0:'Profile',		1:'Profil',			2:'Profil',				3:'Profiel' ,		4:'Profil',				5:'Profilo',				6:'Perfil', 					7:'Perfil'	};
C_XL.d['connection'] 	= { 0:'Connection',		1:'Connexion',		2:'Połączenie',			3:'aansluiting',	4:'Verbindung',			5:'Connessione',			6:'Conexión', 					7:'Conexão'	};
C_XL.d['activity'] 		= { 0:'activity',		1:'activité',		2:'aktywność',			3:'activiteit' ,	4:'aktivität',			5:'attività',				6:'actividad', 					7:'atividade'	};
C_XL.d['access rights'] = { 0:'access rights',	1:'Droits d\'accès',2:'Prawa dostępu',		3:'Toegangsrechten',4:'Zugriffsrechte',		5:'Diritti d\'accesso',		6:'Derechos de acceso', 		7:'Direitos de acesso'	};
C_XL.d['axs keys'] 		= { 0:'access keys',	1:'Clé d\'accès',	2:'Klawisze dostępu',	3:'Toegangsleutels',4:'Zugriffsschlüssel',	5:'Chiavi d\'accesso',		6:'Claves de acceso', 			7:'Chave de acesso'	};
C_XL.d['cnx-queries'] 	= { 0:'Queries',		1:'Queries',		2:'Queries',			3:'Queries' ,		4:'anfragen',			5:'Richieste',				6:'Peticiones', 				7:'Dúvidas'	};
C_XL.d['cnx-posts'] 	= { 0:'Posts',			1:'Posts',			2:'Posts',				3:'Posts' ,			4:'Posts',				5:'Messaggi',				6:'Mensajes', 					7:'Mensagens'	};
C_XL.d['cnx-deletes'] 	= { 0:'Deletes',		1:'Deletes',		2:'Deletes',			3:'Deletes' ,		4:'Löschungen',			5:'Soppressi',				6:'Borrados', 					7:'apagados'	};
C_XL.d['cnx-surfer'] 	= { 0:'Surfer name',	1:'Surfer name',	2:'Surfer name',		3:'Surfer name',	4:'Surfer Name',		5:'Nome persona connessa',	6:'Nombre persona conectada', 	7:'Nome do pesquisador'	};
C_XL.d['cnx-account'] 	= { 0:'account name',	1:'Nom du compte',	2:'account name',		3:'account naam',	4:'Kontoname',			5:'Nome del conto',			6:'Nombre de la cuenta', 		7:'Nome da conta'	};
C_XL.d['cnx-agent'] 	= { 0:'User agent',		1:'Plateforme',		2:'User agent',			3:'User agent',		4:'Nutzeragent',		5:'Piattaforma',			6:'Plataforma', 				7:'Plataforma'	};
C_XL.d['cnx-sessionId'] = { 0:'Session Id',		1:'Id de session',	2:'Session Id',			3:'Sessie Id',		4:'Sitzungs ID',		5:'Id di sessione',			6:'Id de sesión', 				7:'Id de sessão'	};
C_XL.d['cnx-logintime'] = { 0:'Login',			1:'Connexion',		2:'Login',				3:'Login',			4:'anmeldung',			5:'Connessione',			6:'Conexión', 					7:'Conexão'	};
C_XL.d['cnx-activity'] 	= { 0:'activity',		1:'activité',		2:'activity',			3:'activiteit',		4:'aktivität',			5:'attività',				6:'actividad', 					7:'atividade'	};
C_XL.d['cnx-watchdog'] 	= { 0:'Watchdog',		1:'Watchdog',		2:'Watchdog',			3:'Watchdog',		4:'Wächter',			5:'Watchdog',				6:'Watchdog', 					7:'Watchdog'	};
C_XL.d['cnx-ip'] 		= { 0:'Ip',				1:'Ip',				2:'Ip',					3:'Ip',				4:'Ip',					5:'Ip',						6:'Ip', 						7:'IP'	};
C_XL.d['cnx-reloads'] 	= { 0:'Reloads',		1:'Recharg',		2:'Reloads',			3:'Reloads',		4:'Reloads',			5:'Ricariche',				6:'Recargas', 					7:'Recarregar'	};
C_XL.d['cnx-switchtos'] = { 0:'Switch',			1:'Switch',			2:'Switch',				3:'Switch',			4:'Schalter',			5:'Scambio',				6:'Intercambio', 				7:'Trocas'	};

C_XL.d['cnx-allqueries'] = { 0:'Queries',		1:'Queries',		2:'Queries',			3:'Queries',		4:'anfragen',			5:'Richieste',				6:'Peticiones', 7:'Dúvidas'	};
C_XL.d['cnx-allposts'] 	 = { 0:'Posts',			1:'Posts',			2:'Posts',				3:'Opslaan',		4:'Posts',				5:'Messaggi',				6:'Mensajes', 	7:'Mensagens'	};
C_XL.d['cnx-alldeletes'] = { 0:'Deletes',		1:'Deletes',		2:'Deletes',			3:'Deletes',		4:'Löschungen',			5:'Soppressi',				6:'Borrados', 	7:'apagados'	};

C_XL.d['cnx-cntall'] 	= { 0:'Total operations number',1:'Nombre total d\'opérations',		2:'Total operations number',3:'aantal uitvoeringen',		4:'Gesamtzahl Operationen',				5:'Numero totale di operazioni',	6:'Número total de operaciones', 	7:'Número total de operações'	};
C_XL.d['cnx-perfacc'] 	= { 0:'Total Processing time',	1:'Temps CPU total',				2:'Total processing time',	3:'Totaal CPU tijd',			4:'Gesamtzeit CPU',						5:'Tempo CPU totale',				6:'Tiempo CPU total', 				7:'Tempo CPU total'	};
C_XL.d['cnx-perfmean'] 	= { 0:'Mean execution time',	1:'Temps moyen d\'exécution',		2:'Mean execution time',	3:'Gemiddeld uitvoeringstijd',	4:'Durchschnittliche Ausführungszeit',	5:'Tempo medio di esecuzione',		6:'Tiempo medio de ejecución', 		7:'Tempo médio de execução'	};
C_XL.d['cnx-perfpk'] 	= { 0:'Longest execution time',	1:'Temps d\'exécution le plus long',2:'Longest execution time',	3:'Langste uitvoeringstijd',	4:'Längste Ausführungszeit',			5:'Tempo di esecuzione più lungo',	6:'Tiempo de ejecución más largo', 	7:'Tempo de execução mais longo'	};
C_XL.d['cnx-operations']= { 0:'Operations number',		1:'Nombre d\'opérations',			2:'Operations number',		3:'aantal uitvoeringen',		4:'anzahl Operationen',					5:'Numero di operazioni',			6:'Número de operaciones', 			7:'Número de operações'	};



	// A C C O U N T    C O N F I G
	//
	
C_XL.d['token'] 			= { 0:'Token',		1:'Code',		2:'żeton',			3:'Code',		4:'Code',		5:'Codice',		6:'Código', 	7:'Código'	};
C_XL.d['token validate'] 	= { 0:'Verify',		1:'Vérifier',	2:'zweryfikować',	3:'Verifiëren',	4:'Überprüfen',	5:'Verificare',	6:'Verificar', 	7:'Verificar'	};


C_XL.d['invalid login'] = { 0:'invalid login/password, try again',
		1:'login ou mot de passe invalide, essayez à nouveau',
		2:'niepoprawny login/hasło, powtórz ponownie',
		3:'onjuist login/wachtwoord, probeer opnieuw',
		4:'ungültige Login/Passwort, versuchen Sie es noch einmal',
		5:'login/password non validi, riprovare',
		6:'login o contraseña no válidos, inténtelo de nuevo', 
		7:'Login ou palavra-passe inválidos, por favor tente novamente.' };

	// V I S I T O R S    R E G I S T E R
	//
C_XL.d['vfilter title'] 	= { 0:'Filter',			1:'Filtre',				2:'alfabetycznym rejestr',	3:'Filter',			4:'Filter',			5:'Filtro',			6:'Filtro', 		7:'Filtro'	};
C_XL.d['vfilter none']		= { 0:'No filtering',	1:'aucun filtrage',		2:'Bez filtrowania',		3:'Geen filtering',	4:'Kein filtern',	5:'Nessun filtro',	6:'Ningún filtro', 	7:'Sem filtro'	};

C_XL.d['vfilter have app']	= { 0:'having ever made appointment',	
								1:'ayant déjà pris rendez-vous',		
								2:'że w historii spotkanie',				
								3:'Hebben ooit afspraak gemaakt',		
								4:'mit mindestens einer Terminabsprache',	
								5:'Ha già preso un appuntamento',	
								6:'Ya ha tomado una cita', 7:'Já teve uma consulta'	};

C_XL.d['vfilter none tip']	= { 0:'all visitors appear in de list,	even if they have never appointed.',
								1:'Tous les visitors apparaissent dans la liste,	même s\'ils n\'ont jamais pris rendez-vous.',
								2:'U wszystkich visitors pojawi się na liście,	nawet jeśli nigdy nie umówiłem.',
								3:'alle visitors voorkomen in de lijst,	zelfs als ze nooit een afspraak hebben gemaakt.',
								4:'alle visitors werden in dieser Liste angezeigt, auch wenn sie noch nie einen Termin gemacht haben.',	
								5:'Tutti i visitors appaiono nella lista, anche se non hanno mai preso un appuntamento.',	
								6:'Todos los visitantes aparecen en el listado, aunque no nunca hayan tomado cita.', 7:'Todos os visitors surgem na lista,	mesmo se os mesmos nunca marcaram um encontro.'	};


C_XL.d['visitor overbooked']	= { 0:'Within the chosen time range, this visitor is already scheduled on another appointment.',
								1:'Dans la plage horaire choisie, ce visitor est déjà planifié sur un autre rdv.',
								2:'W wybranym przedziale czasu ten visitor jest już zaplanowany na kolejne spotkanie.',
								3:'Binnen het gekozen tijdbereik is deze visitor al ingepland op een andere afspraak.',
								4:'Innerhalb des gewählten Zeitraums ist dieser visitor bereits auf einen anderen Termin terminiert.',	
								5:'Nell\'intervallo di tempo scelto, questo visitor è già programmato per un altro appuntamento.',	
								6:'Dentro del rango de tiempo elegido, este visitor ya está programado para otra cita.',	
								6:'En la franja horaria elegida, el visitante ya está registrado para otra cita.', 7:'Dentro do intervalo de tempo escolhido, este visitor já está agendado para outra consulta.'	};




	//  N O T E S,	 T A S K S,	 C H A T S    A R C H I V E S
	//
	

C_XL.d['keyword']		= { 0:'Keyword',	1:'Mot clé',	2:'Słów kluczowych',3:'Trefwoord',		4:'Stichwort',	5:'Parola chiave',	6:'Palabra clave', 	7:'Palavra-chave'	};
C_XL.d['period']		= { 0:'Timeframe',	1:'Période',	2:'Ramy czasowe',	3:'Tijdsbestek',	4:'Zeitspanne',	5:'Periodo',		6:'Periodo', 		7:'Período'	};
C_XL.d['action']		= { 0:'action',		1:'action',		2:'Działanie',		3:'actie' ,			4:'aktion',		5:'azione',			6:'acción', 		7:'ação'	};

C_XL.d['afilter title'] 	= { 0:'Filter',					1:'Filtre',						2:'alfabetycznym rejestr',		3:'Filter',							4:'Filter',						5:'Filtro',							6:'Filtro', 						7:'Filtro'	};
C_XL.d['afilter changing']	= { 0:'You are changing filters...',1:'Vous modifiez les filtres...',2:'Zmieniasz filtry...',	3:'U verandert filters...',			4:'Sie ändern die Filter...',	5:'Sta modificando i filtri...',	6:'Está modificando los filtros', 	7:'altera os filtros...'	};
C_XL.d['afilter period']	= { 0:'In a period',			1:'Dans une période',			2:'W okresie',					3:'In een periode' ,				4:'In einer Periode',			5:'In un periodo',					6:'En un periodo', 					7:'Num período'	};
C_XL.d['afilter created']	= { 0:'Created in the period',	1:'Créé dans une période',		2:'Utworzony w okresie',		3:'Gemaakt in de periode',			4:'In der Periode erstellt',	5:'Creato in un periodo',			6:'Creado en un periodo', 			7:'Criado num período'	};
C_XL.d['afilter archived']	= { 0:'archived in the period',	1:'archivée dans la période',	2:'archiwizowane w okresie',	3:'Gearchiveerd in de periode',		4:'In der Periode archiviert',	5:'archiviata nel periodo',			6:'archivada en el periodo', 		7:'arquivados no período'	};
C_XL.d['type keyword']		= { 0:'Type minimum 5 chars',	1:'au minimum 5 caractères',	2:'Wpisz minimum 5 znaków',		3:'Typ minimaal 5 tekens',			4:'Mindestens 5 Zeichen',		5:'Minimo 5 caratteri',				6:'Mínimo 5 caracteres', 			7:'Pelo menos 5 caracteres'	};

C_XL.d['afilter keyword']	= C_XL.d['keyword']; // !! No translation on this line



	//  e - R E S E R V A T I O N
	//

// backoffice


// 		technical 			english:0,				french:1,					polish:2,					dutch:3,				german:4,				italian:5,					spanish:6,					portuguese:7

C_XL.d['link label']	= { 0:'Link label',			1:'Label du lien',			2:'Etykieta link',			3:'Link label',			4:'Etikett des Links',	5:'Indicazione del link',	6:'Rótulo del vínculo', 	7:'Rótulo da ligação'	};
C_XL.d['link url']		= { 0:'Target url',			1:'Url de la cible',		2:'Docelowy adres URL',		3:'Doel url',			4:'Zieladresse URL',	5:'Url del target',			6:'Url del objetivo', 		7:'URL de destino'	};
C_XL.d['optional']		= { 0:'optional',			1:'facultatif',				2:'fakultatywny',			3:'facultatief',		4:'optional',			5:'facoltativo',			6:'facultativo', 			7:'facultativo (não obrigatório)'	};
C_XL.d['booking options']= { 0:'Booking',			1:'Réservation',			2:'Rezerwacja',				3:'Reservering',		4:'Reservierung',		5:'Prenotazione',			6:'Reserva', 				7:'Reserva'	};
C_XL.d['identification']= { 0:'authentication',		1:'Identification',			2:'Uwierzytelniania',		3:'Identificatie',		4:'authentifizierung',	5:'Identificazione',		6:'Nombre usuario', 		7:'Identificação'	};
C_XL.d['search options']= { 0:'Search options',		1:'Options de recherche',	2:'Opcje wyszukiwania',		3:'Zoekopties',			4:'Suchoptionen',		5:'Opzioni di ricerca',		6:'Opciones de búsqueda', 	7:'Opções de pesquisa'	};
C_XL.d['availabilities']= { 0:'availabilities',		1:'Disponibilités',			2:'Wolne',					3:'Beschikbaarheden',	4:'Verfügbarkeiten',	5:'Disponibilità',			6:'Disponibilidades', 		7:'Disponibilidades'	};
C_XL.d['confirmation']	= { 0:'Confirmation',		1:'Confirmation',			2:'Potwierdzenie',			3:'Bevestiging',		4:'Bestätigung',		5:'Conferma',				6:'Confirmación', 			7:'Confirmação'	};
C_XL.d['confirmed']		= { 0:'Confirmed',			1:'Confirmé',				2:'Zatwardziały',			3:'Bevestigd',			4:'Bestätigt',			5:'Confermato',				6:'Confirmado', 			7:'Confirmado'	};
C_XL.d['greetings']		= { 0:'Greetings',			1:'Salutations',			2:'Pozdrowienia',			3:'Groeten',			4:'Grüße',				5:'Saluti',					6:'Saludos', 				7:'Cumprimentos'	};
C_XL.d['e-problem']		= { 0:'There is a problem',	1:'Il y a un problème',		2:'Tam jest problem',		3:'Er is een probleem',	4:'Es gibt ein Problem',5:'C\'è un problema',		6:'Hay un problema', 		7:'Há um problema'	};

C_XL.d['e-home'] 		= { 0:'Home',			1:'accueil',			2:'Powitalna',			3:'Welkom',				4:'Willkommen',						5:'Pagina iniziale',		6:'Página de inicio', 		7:'Página inicial'	};
C_XL.d['e-homepage'] 	= { 0:'Home page',		1:'Page d\'accueil',	2:'Strona powitalna',	3:'Welkom pagina',		4:'Willkommenseite',				5:'Pagina iniziale',		6:'Página de inicio', 		7:'Página inicial'	};
C_XL.d['e-infos'] 		= { 0:'Web infos',		1:'Infos web',			2:'Informacje web',		3:'Web infos',			4:'Webinfos',						5:'Informazioni web',		6:'Información web', 		7:'Informações Web'	};
C_XL.d['e-hourlies'] 	= { 0:'Hourlies',		1:'Horaires',			2:'Godziny pracy',		3:'Openingsuren',		4:'Öffnungszeiten',					5:'Orari',					6:'Horarios', 				7:'Horários'	};
C_XL.d['e-direction'] 	= { 0:'Directions',		1:'Itinéraire',			2:'Wskazówki',			3:'Routebeschrijving',	4:'Wegbeschreibung',				5:'Itinerario',				6:'Itinerarios', 			7:'Itinerário'	};
C_XL.d['e-settings']	= { 0:'Web settings',	1:'Réglages web',		2:'Ustawienia sieci',	3:'Web instellingen',	4:'Webeinstellungen',				5:'Configurazioni web',		6:'Configuraciones web', 	7:'Configurações da Web'	};
C_XL.d['e-graphchart'] 	= { 0:'appearance',		1:'apparence',			2:'Wygląd',				3:'Uiterlijk',			4:'Erscheinung',					5:'aspetto',				6:'aspecto', 				7:'aspeto'	};
C_XL.d['e-url'] 	= { 0:'Url postfix',		1:'Postfix url',		2:'Url postfix',		3:'Url postfix',		4:'Postfix URL',					5:'Postfix url',			6:'Postfix url', 			7:'Postfix url'	};

C_XL.d['e-sameday'] = { 0:'In the same day, not before',1:'Le même jour, pas avant',	2:'W tym samym dniu, nie wcześniej niż',3:'Op dezelfde dag, niet voor ',4:'am selben Tag, nicht vor',				5:'Nello stesso giorno, non prima delle',	6:'El mismo día, no antes de', 			7:'No mesmo dia, não antes de'	};
C_XL.d['e-max'] 	= { 0:'Max number of reservation',	1:'Nbre max de réservation',	2:'Maksymalna liczba rezerwacji',	3:'Maximum aantal reservatie',		4:'Max Reservierungsanzahl',				5:'Numero massimo di prenotazioni',			6:'Número máximo de reservas', 			7:'Número máximo de reserva'	};
C_XL.d['e-limit'] 	= { 0:'Number of options proposed',	1:'Nbre d\'options proposées',	2:'Liczba dostępnych opcji',		3:'aantal voorgestelde opties',		4:'anzahl angebotener Optionen',			5:'Numero di opzioni proposte',				6:'Número de opciones propuestas', 		7:'Número de opções propostas'	};
C_XL.d['e-cancel'] 	= { 0:'Cancellation via web',		1:'annulation via web',			2:'anulowanie via web',				3:'annulering via web',				4:'Online-Stornierung',						5:'Cancellazione tramite web',				6:'Cancelación a través de internet', 	7:'Cancelamento através da Web'	};
C_XL.d['e-signin'] 	= { 0:'Registration via the web',	1:'Inscription via le web',		2:'Rejestracja przez Internet',		3:'Registratie via het web',		4:'Online-Registrierung',					5:'Iscrizione tramite web',					6:'Inscripción a través de internet', 	7:'Inscrição através da Web'	};
C_XL.d['e-skin'] 	= { 0:'Decorative theme',			1:'Thème décoratif',			2:'Dekoracyjny motyw',				3:'Decoratieve thema',				4:'Dekoratives Thema',						5:'Tema decorativo',						6:'Tema decorativo', 					7:'Tema decorativo'		};
C_XL.d['main image'] = { 0:'Main image',				1:'Image principale',			2:'Główny obraz',					3:'Hoofdbeeld',						4:'Hauptbild',								5:'Immagine principale',					6:'Imagen principal', 					7:'Imagem principal'	};
C_XL.d['e-image'] 	= { 0:'Ready available',			1:'Image pré-définie',			2:'Wstępnie zdefiniowany obraz',	3:'Vooraf gedefinieerde afbeelding',4:'Vordefiniertes Bild',					5:'Immagine predefinita',					6:'Imagen predefinida',  				7:'Imagem pré-definida'	};

C_XL.d['e-title'] 	= { 0:'Web page title',				1:'Titre de la page web',		2:'Tytuł strony internetowej',		3:'Webpagina title',				4:'Titel der Webseite',						5:'Titolo della pagina web',				6:'Título de la página web', 7:'Título da página Web'	};
C_XL.d['e-header'] 	= { 0:'Web page géneral info',		1:'Cadre informatif général',	2:'Informacje ogólne strony internetowej',	3:'Webpagina informatie kader',	4:'allgemeine Informationen der Webseite',	5:'Quadro informativo generale',			6:'Cuadro informaciones generales', 7:'Quadro de informações gerais'	};

C_XL.d['e-allownote'] = { 0:'The visitor is allowed to leave a note',	
						1:'Le visitor peut laisser une note',		
						2:'Informacje wyświetlane na potwierdzenie',	
						3:'Informatie weergegeven op bevestiging stap',		
						4:'Informationen auf der Bestätigung',	
						5:'Informazione da segnalare alla conferma',	
						6:'El visitante puede dejar una nota', 7:'Informações no momento da confirmação'	};
							
C_XL.d['e-blacklist'] = { 0:'This color of visitor is not allowed to take appointment',		
							1:'Cette couleur de visitor n\'est pas autorisée à prendre RDV',	
							2:'Ten kolor visitor nie może wziąć udziału w spotkaniu',
							3:'Deze kleur van de visitor is niet toegestaan om een afspraak te maken',
							4:'Diese Farbe des visitor darf nicht verabredet werden',
							5:'Questo colore del visitor non è autorizzato a prendere un appuntamento',
							6:'Este color de visitante no está autorizado a tomar una cita', 7:'Esta cor do visitor não tem permissão para marcar' };
							
C_XL.d['e-withAMPM'] = { 0:'The visitor can choose days of preference',				
							1:'Le visitor peut choisir des jours de préférence',	
							2:'visitor może wybrać dni uprzywilejowania',			
							3:'De visitor kan dagen van voorkeur kiezen',
							4:'Der visitor kann bevorzugte Tage wählen',	
							5:'Il visitor può scegliere i giorni di preferenza',	
							6:'El visitante puede elegir días de preferencia', 7:'O visitor pode escolher dias de preferência' };
						
C_XL.d['e-confirm'] = { 0:'Information displayed on confirmation',	
						1:'Information à signaler lors de la confirmation',		
						2:'Informacje wyświetlane na potwierdzenie',	
						3:'Informatie weergegeven op bevestiging stap',		
						4:'Informationen auf der Bestätigung',	
						5:'Informazione da segnalare alla conferma',	
						6:'Información mostrada en la confirmación',
						7:'Informações no momento da confirmação'	};		
						
C_XL.d['e-overbooking'] = { 0:'The time slot you chose is no longer available, please make a new choice.',	
						1:'Le créneau horaire que vous avez choisi n\'est plus disponible, s\'il vous plaît faites un autre choix.',		
						2:'Wybrany przedział czasowy nie jest już dostępny, dokonaj innego wyboru',	
						3:'Het door jou gekozen tijdslot is niet meer beschikbaar, maak aub een andere keuze',		
						4:'Das von Ihnen gewählte Zeitfenster ist nicht mehr verfügbar, bitte treffen Sie eine andere Wahl',	
						5:'La fascia oraria che hai scelto non è più disponibile, fai un\'altra scelta',	
						6:'La franja horaria que ha elegido ya no está disponible, elija otra opción',
						7:'O horário que você escolheu não está mais disponível, faça outra escolha'	};

C_XL.d['e-hlinklabel'] 	= { 0:'Header link label',		1:'Label du lien dans l\'entête',	2:'Etykieta nagłówek',			3:'Header label',				4:'Etikett Titel',			5:'Indicazione del link nell\'intestazione',6:'Rótulo del vínculo en la cabecera', 	7:'Rótulo da ligação no cabeçalho'	};
C_XL.d['e-titlefont'] 	= { 0:'Font for the header',	1:'Fonte pour le titre',			2:'Czcionka o tytuł',			3:'Lettertype voor de titel',	4:'Schriftart im Titel',	5:'Tipografia per il titolo',				6:'Tipo de letra para el título', 		7:'Fonte para o título'	};
C_XL.d['e-textfont'] 	= { 0:'Font for the text',		1:'Fonte pour le texte',			2:'Czcionki dla tekstu',		3:'Lettertype voor de tekst',	4:'Schriftart im Text',		5:'Tipografia per il testo',				6:'Tipo de letra para el texto', 		7:'Fonte para o texto'	};
C_XL.d['e-palette'] 	= { 0:'Color palette',			1:'Palette de couleurs',			2:'Paleta kolorów',				3:'Kleuren palet',				4:'Farbpalette',			5:'Paletta di colori',						6:'Gama de colores', 					7:'Paleta de cores'	};
C_XL.d['e-googlemaps'] 	= { 0:'Link to Google maps',	1:'Lien vers Google maps',			2:'Link do mapy Google',		3:'Link naar Google Maps',		4:'Link nach Google Maps',	5:'Link verso Google maps',					6:'Vínculo para Google maps', 			7:'Ligação para o Google Maps'	};

C_XL.d['e-ccss'] 		= { 0:'Custom css',				1:'Style css',						2:'Niestandardowe Css',			3:'Css styling',				4:'Css Styling',			5:'Css stile',								6:'Css personalizado', 					7:'Estilo Css'	};

C_XL.d['write css here'] 	= { 0:'write your css custom styling here'
	,1:'écrivez ici votre style personnalisé css'
	,2:'napisz tutaj swoją niestandardową stylizację css'
	,3:'schrijf hier je CSS-aangepaste styling'
	,4:'Schreiben Sie hier Ihr CSS-Design'
	,5:'scrivi il tuo stile personalizzato css qui'
	,6:'escribe tu estilo css personalizado aquí'
	,7:'escreva o seu estilo personalizado css aqui'	};
	
	
C_XL.d['custom logo'] 		= { 0:'Custom logo',	1:'Logo personnalisé',	2:'Logo firmy',		3:'Eigen logo',		4:'benutzerdefiniertes Logo',	5:'logo personalizzato',	6:'logotipo personalizado', 7:'Logo para a página da web'	};
C_XL.d['specific logo'] 	= { 0:'Specific logo',	1:'Logo spécifique',	2:'Konkretne logo',	3:'Specifiek logo',	4:'bestimmtes Logo',			5:'logo specifico',			6:'logo especifico', 		7:'Logo para a página da web'	};
C_XL.d['global logo'] 		= { 0:'account logo',	1:'Logo du compte',		2:'Logo konta',		3:'account logo',	4:'Kontologo',					5:'logo dell\'account',		6:'logo global', 			7:'Logo para a página da web'	};

C_XL.d['e-logo'] 			= { 0:'Web page logo',			1:'Logo pour la page web',			2:'Logo strony internetowej',	3:'Logo voor de webpagina',	4:'Logo für die Webseite',				5:'Logo per la pagina web',	6:'Logo para la página web', 	7:'Logo para a página da web'	};
C_XL.d['upload own logo'] 	= { 0:'Upload your own logo',	1:'Uploader votre propre logo',		2:'Prześlij własne logo',		3:'Upload uw eigen logo',	4:'Laden Sie Ihr eigenes Logo hoch',	5:'Carica il tuo logo',		6:'Sube tu propio logo', 		7:'Envie seu próprio logotipo'	};

// 		technical 			english:0,							french:1,								polish:2,								dutch:3,								german:4,									italian:5,								spanish:6,							portuguese:7

	
C_XL.d['authentication']= { 0:'authentication method',			1:'Vérification d\'identité',			2:'Metoda uwierzytelniania',			3:'autenticatiemethode',				4:'authentifizierungsmethode',				5:'Verifica dell\'identità',			6:'Verificación de la identidad', 	7:'Verificação de identidade'	};
C_XL.d['auth-kiosk'] 	= { 0:'Kiosk mode (no authentication)',	1:'Kiosque (pas d\'authentification)',	2:'Tryb kiosk (bez uwierzytelniania)',	3:'Kiosk-modus (geen authenticatie)',	4:'Kioskmodus (keine Authentifizierung)',	5:'Chiosco (senza identificazione)',	6:'Quiosco (sin autenticación)', 	7:'Quiosque (sem autenticação)'	};
C_XL.d['auth-email'] 	= { 0:'authentication by email',		1:'authentification par email',			2:'Uwierzytelnianie przez e-mail',		3:'authenticatie via e-mail',			4:'authentifizierung per E-Mail',			5:'autenticazione via email',			6:'autenticación por e-mail', 		7:'autenticação por e-mail'	};
C_XL.d['auth-mobile'] 	= { 0:'authentication via mobile',		1:'authentification par SMS',			2:'Uwierzytelnianie przez SMS',			3:'authenticatie via SMS',				4:'authentifizierung per SMS',				5:'autenticazione via SMS',				6:'autenticación por SMS', 			7:'autenticação por SMS'	};
C_XL.d['auth-operator']	= { 0:'authentication by an operator',	1:'authentification par un opérateur',	2:'Uwierzytelnianie przez operatora',	3:'authenticatie door een operator',	4:'authentifizierung per Anbieter',			5:'autenticazione tramite operatore',	6:'autenticación por operador', 	7:'autenticação por um operador'	};
C_XL.d['book now'] 		= { 0:'make an appointment',			1:'prendre rendez-vous',				2:'umów się na wizytę',	 				3:'maak een afspraak',					4:'termin vereinbaren',						5:'prendere appuntamento',				6:'tomar cita', 					7:'marcar uma consulta'	};
C_XL.d['cancel resa'] 	= { 0:'cancel an appointment',			1:'annuler un rendez-vous',				2:'anulować termin',	 				3:'een afspraak afzeggen',				4:'termin absagen',							5:'cancellare un appuntamento',			6:'cancelar una cita', 				7:'cancelar uma consulta'	};

C_XL.d['pal-medical'] 	= { 0:'Blue green medical',		1:'Médical bleu vert',				2:'Niebieski zielony medyczne',	3:'Medische blauw groen',		4:'Medizinisches blau-grün',	5:'Medico blu verde',		6:'Médico azul verde', 		7:'Médico verde azul'	};
C_XL.d['pal-zen'] 		= { 0:'Zen amber taupe',		1:'Zen ambré taupe',				2:'Zen bursztynu ciemnoszary',	3:'Zen amber mole',				4:'Zen dunkles Bernstein',		5:'Zen ambra talpa',		6:'Zen ambarino gris topo', 7:'Zen âmbar toupeira'	};
C_XL.d['pal-dynamic'] 	= { 0:'Dynamic cyan magenta',	1:'Dynamic cyan magenta',			2:'Dynamiczny magenta cyan',	3:'Dynamische cyaan magenta',	4:'Dynamisches Zyan Magenta',	5:'Dinamico ciano magenta',	6:'Dinámico cyan magenta', 	7:'Dinâmica azul magenta'	};
C_XL.d['pal-gold'] 		= { 0:'Ebony and gold',			1:'Ebène et or',					2:'Gold and ebony',				3:'Goud en ebben',				4:'Gold und Ebenholz',			5:'Ebano e oro',			6:'Ébano y oro', 			7:'Ébano e dourado'	};
C_XL.d['pal-blueviolet']= { 0:'Blue and Violet',		1:'Bleu violet (Proximus)',			2:'Niebieski i fioletowy',		3:'Blauw en paars (Proximus)',	4:'Blau und Lila',				5:'Blu viola',				6:'azul violeta', 			7:'Violeta azul (Proximus)'	};
C_XL.d['pal-bio']		= { 0:'Bio (natural green)',	1:'Bio (vert nature)',				2:'Bio (naturalny zielony)',	3:'Bio (Natuur groen)',			4:'Bio (naturgrün)',			5:'Bio (verde natura)',		6:'Bio (verde naturaleza)', 7:'Bio (verde natureza)'	};


// 		technical 				english:0,				french:1,			polish:2,			dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7

C_XL.d['allowed'] 		= { 0:'allowed',		1:'autorisé',		2:'Upoważniony',		3:'Toegelaten',			4:'Erlaubt',		5:'autorizzato',		6:'autorizado', 	7:'autorizado'	};
C_XL.d['not allowed'] 	= { 0:'Not allowed',	1:'Non autorisé',	2:'Nieautoryzowane',	3:'Niet toegelaten',	4:'Nicht erlaubt',	5:'Non autorizzato',	6:'No autorizado', 	7:'Não autorizado'	};

C_XL.d['unlimited'] 	= { 0:'Unlimited',		1:'Illimité',		2:'Nieograniczony',		3:'Onbeperkt',	4:'Unbeschränkt',	5:'Illimitato',	6:'Ilimitado', 	7:'Ilimitado'	};
C_XL.d['one'] 			= { 0:'One',			1:'Une',			2:'Jeden',				3:'Een',		4:'Ein',			5:'Una',		6:'Uno', 		7:'Um'	};
C_XL.d['two'] 			= { 0:'Two',			1:'Deux',			2:'Dwa',				3:'Twee',		4:'Zwei',			5:'Due',		6:'Dos', 		7:'Dois'	};
C_XL.d['three']	 		= { 0:'Three',			1:'Trois',			2:'Trzy',				3:'Drie',		4:'Drei',			5:'Tre',		6:'Tres', 		7:'Três'	};
C_XL.d['four'] 			= { 0:'Four',			1:'Quatre',			2:'Cztery',				3:'Vier',		4:'Vier',			5:'Quattro',	6:'Cuatro', 	7:'Quatro'	};


C_XL.d['mobminder'] 	= { 0:'Mobminder',		1:'Mobminder',		2:'Mobminder',			3:'Mobminder',		4:'Mobminder',				5:'Mobminder',		6:'Mobminder', 			7:'Mobminder'	};
C_XL.d['medminder'] 	= { 0:'Medminder',		1:'Medminder',		2:'Medminder',			3:'Medminder',		4:'Medminder',				5:'Medminder',		6:'Medminder', 			7:'Medminder'	};
C_XL.d['medical'] 		= { 0:'Medical',		1:'Médical',		2:'Medyczny',			3:'Medische',		4:'Medizinisch',			5:'Medico',			6:'Médico', 			7:'Médico'	};
C_XL.d['business'] 		= { 0:'Business',		1:'Business',		2:'Biznes',				3:'Bedrijf',		4:'Unternehmen',			5:'Business',		6:'Negocio', 			7:'Negócio'	};
C_XL.d['clinics'] 		= { 0:'Medical group',	1:'Cliniques',		2:'Medical Group',		3:'Medische groep',	4:'Medizinische Praxis',	5:'Cliniche',		6:'Clínicas', 			7:'Clínicas'	};
C_XL.d['lawyers']	 	= { 0:'Lawyers',		1:'Libéral',		2:'Prawnicy',			3:'advocaten',		4:'anwälte',				5:'Liberale',		6:'Liberal', 			7:'Liberal'	};
C_XL.d['mecas'] 		= { 0:'Mechanics',		1:'Mécanique',		2:'Mechanika',			3:'Mechanica',		4:'Mechaniker',				5:'Meccanica',		6:'Mecánica', 			7:'Mecânica'	};
C_XL.d['wellness'] 		= { 0:'Wellness',		1:'Bien être',		2:'Wellness',			3:'Wellness',		4:'Wellness',				5:'Benessere',		6:'Bienestar', 			7:'Bem-estar'	};
C_XL.d['edoc'] 			= { 0:'Med e-logos',	1:'e-logos',		2:'Med e-logos',		3:'e-arts',			4:'Med e-logo',				5:'e-logo',			6:'Med e-logo', 		7:'e-logótipos'	};
C_XL.d['emedical'] 		= { 0:'e-medical',		1:'e-médical',		2:'e-medical',			3:'e-medische',		4:'e-medizinisch',			5:'e-medico',		6:'e-médico', 			7:'e-médica'	};
C_XL.d['stetosblue'] 	= { 0:'Stethoscope',	1:'Stethoscope',	2:'Stetoskop',			3:'Stethoscoop',	4:'Stethoskoop',			5:'Stetoscopio',	6:'Estetoscopio', 		7:'Estetoscópio'	};
C_XL.d['doctortie'] 	= { 0:'Doctor tie',		1:'Cravatte',		2:'Doktor remis',		3:'arts band',		4:'arztkrawatte',			5:'Cravatta',		6:'Corbata', 			7:'Gravata'	};
C_XL.d['heartbeat'] 	= { 0:'Heart beat',		1:'Battements',		2:'Bicie serca',		3:'Hartslag',		4:'Herzschlag',				5:'Battiti',		6:'Latido', 			7:'Batimentos'	};
C_XL.d['handpeople'] 	= { 0:'Hand to you',	1:'Main tendue',	2:'Ręka do Ciebie',		3:'Klaar om u',		4:'Hand in Hand',			5:'Mano tesa',		6:'Mano extendida', 	7:'Mão estendida'	};
C_XL.d['bambstones'] 	= { 0:'Bamboo stones',	1:'Pierre&bambou',	2:'Kamienie z bambusa',	3:'Bamboe stenen',	4:'Bamboosteine',			5:'Pietre & Bambù',	6:'Piedras & Bambú', 	7:'Pedra e bambu'	};
C_XL.d['stoneleaves'] 	= { 0:'Stones leaves',	1:'Pierre&feuilles',2:'Kkamienie liście',	3:'Stenen bladeren',4:'Steinblätter',			5:'Pietre & Foglie',6:'Piedras & hojas', 	7:'Pedra e folhas'	};
C_XL.d['flowerpetals'] 	= { 0:'Flower petals',	1:'Pétales',		2:'Płatki kwiatów',		3:'Bloemblaadjes',	4:'Blütenblätter',			5:'Petali',			6:'Pétalos', 			7:'Pétalas'	};
C_XL.d['flowers'] 		= { 0:'Flowers',		1:'Fleurs',			2:'Kwiaty',				3:'Bloemen',		4:'Blumen',					5:'Fiori',			6:'Flores', 			7:'Flores'	};
C_XL.d['caduceus'] 		= { 0:'Caduceus',		1:'Caduceus',		2:'Caduceus',			3:'Caduceus',		4:'Caduceus',				5:'Caduceus',		6:'Caduceus', 			7:'Caducas'	};


// e-reservation Web page 

C_XL.d['e-reservation'] = { 0:'Make an appointment - Online booking',		
							1:'Prendre rendez-vous - Réservation en ligne',	
							2:'Umów się na wizytę - Online rezerwacja',	 
							3:'Maak een afspraak - Online reserveren',		
							4:'Termin vereinbaren - Online Buchung',	
							5:'Prendere un appuntamento - Prenotazione online',	
							6:'Toma una cita - Reserva online', 7:'Marcar uma consulta - Reservas online'	};
							

C_XL.d['e-step ident'] 	= { 0:'Identify yourself',		1:'S\'identifier',			2:'Przedstaw się',		3:'Identificeer jezelf',	4:'Bitte melden Sie sich an',	5:'Identificarsi',				6:'Identificarse', 			7:'Identificar-se'	};
C_XL.d['e-step options']= { 0:'Choose your options',	1:'Vos options',			2:'Wybierz opcje',		3:'Kies uw opties',			4:'Optionauswahl',				5:'Le Sue opzioni',				6:'Sus opciones', 			7:'as suas opções'	};
C_XL.d['e-step select'] = { 0:'Select an appointment',	1:'Sélectionner un RDV',	2:'Wybierz termin',		3:'Selecteer een afspraak',	4:'Termin auswählen',			5:'Selezionare un appuntamento',6:'Seleccionar una cita', 	7:'Selecionar uma consulta'	};
C_XL.d['e-step confirm']= { 0:'Confirm your choice',	1:'Confirmer votre choix',	2:'Potwierdź wybór',	3:'Bevestig uw keuze',		4:'auswahl bestätigen',			5:'Confermare la Sua scelta',	6:'Confirmar su elección', 	7:'Confirmar a sua escolha'	};
C_XL.d['e-step thanks'] = { 0:'It is done',				1:'C\'est terminé',			2:'Odbywa się to',		3:'afgerond',				4:'Fertig',						5:'Terminato',					6:'acabado', 				7:'Terminou'	};



// buttons captions	
C_XL.d['authify me'] 	= { 0:'Verify',				1:'Vérifier',			2:'Zidentyfikować mnie',3:'Verifiëren',			4:'Mich anmelden',		5:'Mi identifico',	6:'Me identifico', 		7:'Identifico-me'		};
C_XL.d['identify me'] 	= { 0:'Check me in',		1:'Je m\'identifie',	2:'Zidentyfikować mnie',3:'Inloggen',			4:'Mich anmelden',		5:'Mi identifico',	6:'Me identifico', 		7:'Identifico-me'		};
C_XL.d['try again'] 	= { 0:'Try again',			1:'Ré-essayer',			2:'Spróbuj ponownie',	3:'Opnieuw checken',	4:'Erneut versuchen',	5:'Riprovare',		6:'Intentar de nuevo', 	7:'Tentar novamente'	};
C_XL.d['i sign in'] 	= { 0:'Sign me in',			1:'M\'inscrire',		2:'Zarejestruj mnie',	3:'Ik registreer',		4:'Mich registrieren',	5:'Mi iscrivo',		6:'Me inscribo', 		7:'Eu subscrevo'		};
C_XL.d['sign in'] 		= { 0:'Save',				1:'Sauvegarder',		2:'Zapisać',			3:'Opslaan',			4:'Speichern',			5:'Registrare',		6:'Registrar', 			7:'Registro'			};
C_XL.d['hello'] 		= { 0:'Hello',				1:'Bonjour',			2:'Cześć',				3:'Dag',				4:'Guten Tag',			5:'Buongiorno',		6:'Buenos días', 		7:'Bom dia'				};
C_XL.d['continue'] 		= { 0:'Continue',			1:'Continuer',			2:'Kontynuować',		3:'Voortzetten',		4:'Fortfahren',			5:'Continuare',		6:'Continuar', 			7:'Continuar'			};
C_XL.d['next dates'] 	= { 0:'Following dates',	1:'Dates suivantes',	2:'Następujące terminy',3:'Volgende datums',	4:'Folgende Daten',		5:'Date seguenti',	6:'Fechas siguientes', 	7:'Datas seguintes'		};


C_XL.d['token sent'] 	= { 0:'We have sent a code on your mail-box',				
							1:'Nous avons envoyé un code sur votre e-mail',				
							2:'Mamy kod wysyłany za pośrednictwem poczty e-mail',			
							3:'Wij hebben een code via e-mail gestuurd',
							4:'Wir haben Ihnen per E-Mail einen Code gesendet',	
							5:'È stato mandato un codice sulla Sua mail',	
							6:'Enviamos un código a su e-mail', 
							7:'Enviámos um código para o seu e-mail' };
							
C_XL.d['use token'] 	= { 0:'Type your code here below to go on with the reservation process.',				
							1:'Introduisez ci-dessous votre code pour poursuivre la réservation.',				
							2:'Wpisz tutaj kod poniżej,	aby przejść z procesu rezerwacji.',			
							3:'Typ hieronder uw code om verder te gaan met het boekingsproces.',
							4:'Bitte geben Sie Ihren Code unten ein um mit der Reservierung fortzufahren',	
							5:'Inserisca qui sotto il Suo codice per continuare la prenotazione.',	
							6:'Introduzca su código más abajo para continuar la reserva.', 7:'Introduza o código abaixo para continuar com a reserva.' };
							
C_XL.d['e-token warning']= { 0:'attention:<br>If you close or refresh this page, your code is no longer valid.<br>emails sometimes take a few minutes before being delivered.<br>Also check if the email does not arrive in your spam.',				
							1:'attention:<br>Si vous fermez ou rafraîchissez cette page, votre code n\'est plus valide.<br>l\'e-mail met parfois quelques minutes avant de vous parvenir.<br>Vérifiez également si le mail n\'est pas arrivé dans vos spam.',				
							2:'Uwaga:<br>Jeśli zamkniesz lub odśwież stronę, Twój kod nie jest już ważna.<br>e-maili czasami zająć kilka minut przed dostarczeniem.<br>Należy również sprawdzić,	czy e-mail nie dotrze w spam.',		
							3:'Opgepast:<br>Als u deze pagina dicht doet of hernieuwt, is uw code niet meer geldig.<br>emails hebben soms enkelen minuten nodig om aan te komen.<br>Controleer ook of de e-mail niet in uw spam aankomt.',	
							4:'achtung:<br>Wenn Sie diese Seite schließen oder aktualisieren, ist ihr Code nicht mehr gültig.<br>Manchmal kann es einige Minuten dauern, bis E-Mails im Posteingang ankommen.<br>Bitte überprüfen Sie auch Ihren Spam-Ordner.',	
							5:'attenzione:<br>Se chiude o aggiorna questa pagina, il Suo codice non sarà più valido.<br>la mail a volte può mettere qualche minuto ad arrivare.<br>Controlli anche che la mail non sia arrivata nello spam.',	
							6:'atención:<br>Si cierra o actualiza esta página, su código ya no será válido.<br>el e-mail a veces tarda unos minutos antes de llegar.<br>Compruebe también que el e-mail no llegó en los spams.', 7:'atenção:<br>Se você fechar ou atualizar esta página, o seu código não será mais válido.<br>Pode demorar alguns instantes até receber o e-mail.<br>Verifique também se o e-mail não foi para a sua caixa de spam.'	 };

C_XL.d['bad token'] 	= { 0:'The inserted code is wrong, you will receive a new code.',				
							1:'Le code introduit est erroné, vous recevrez un nouveau code.',				
							2:'Wstawiony kod jest nieprawidłowy, otrzymasz nowy kod.',			
							3:'De ingevoerde code is verkeerd, u gaat een nieuwe code ontvangen.',
							4:'Der eingegebene Code ist falsch, Sie erhalten in Kürze einen neuen Code.',	
							5:'Il codice inserito è erroneo, riceverà un nuovo codice.',
							6:'El código introducido está equivocado, recibirá un nuevo código.', 7:'O código introduzido não está certo. Você irá receber um novo código.' };

// eVisitor identification messages

C_XL.d['e-welcome'] = { 0:'Welcome.<br/>Please enter your e-mail.', 
1:'Bienvenue.<br/>SVP introduisez votre e-mail.', 
2:'Witamy.<br/>Podaj swój adres e-mail.', 
3:'Welkom.<br/>Vul alstublieft uw e-mailadres in.',
4:'Willkommen.<br/>Bitte geben Sie Ihre E-Mail Adresse ein.', 
5:'Benvenuto.<br/>Per favore inserisca il suo indirizzo email.', 
6:'Bienvenido.<br/>Por favor introduzca su dirección e-mail.',
7:'Bem-vindo.<br/>Por favor, introduza o seu endereço de e-mail.' };


C_XL.d['fill mobile'] = { 0:'in order to proceed with you identification, please fill in your mobile number', 
1:'afin de complétez votre identification, svp indiquez votre numéro de portable', 
2:'w celu dokończenia identyfikacji prosimy o podanie numeru telefonu komórkowego', 
3:'om uw identificatie te vervolledigen, dient u uw mobiele nummer op te geven', 
4:'Zur Vervollständigung Ihrer Identifizierung geben Sie bitte Ihre Handynummer an', 
5:'una volta completata la tua identificazione, svp indica il tuo numero di portatile', 
6:'afin de complétez votre identificación, svp indiquez votre numéro de portable',
7:'para completar a sua identificação, por favor indique o seu número de telemóvel' };




C_XL.d['eresa identified more'] = { 0:'The following visitors are associated with your email:', 
1:'Voici la liste des visitors associées à votre email:', 
2:'Oto lista visitors powiązanych z Twoim adresem e-mail.', 
3:'Hier is de lijst met visitors die aan uw e-mailadres zijn gekoppeld.',
4:'Hier ist die Liste der visitors, die mit Ihrer E-Mail verknüpft sind.', 
5:'Ecco l\'elenco dei visitors associati alla tua email.',
6:'Aquí está la lista de visitors asociados con su correo electrónico.', 
7:'Aqui está a lista de visitors associados ao seu e-mail.' };


C_XL.d['eresa identified one'] = { 0:'Please pick from the 2 options below', 
1:'Bonjour, choisissez une de ces deux options', 
2:'Witaj, wybierz jedną z tych dwóch opcji.', 
3:'Hallo, kies een van deze twee opties.', 
4:'Hallo, wählen Sie eine dieser beiden Optionen.', 
5:'Ciao, scegli una di queste due opzioni.', 
6:'Hola, elige una de estas dos opciones.', 
7:'Olá, escolha uma dessas duas opções.' };




C_XL.d['eresa register more'] = { 0:'Register one more person', // button caption
1:'Enregistrer une personne</br>supplémentaire',
2:'Zarejestruj dodatkową</br>osobę',
3:'Registreer een extra</br>persoon',
4:'Melden Sie eine weitere</br>Person an',
5:'Registra un\'altra</br>persona',
6:'Registrar una persona</br>adicional',
7:'Registrar uma pessoa</br>adicional' };

/*C_XL.d['eresa register more'] = { 0:'Register one more person', // button caption
1:'Enregistrer une personne supplémentaire',
2:'Zarejestruj dodatkową osobę',
3:'Registreer een extra persoon',
4:'Melden Sie eine weitere Person an',
5:'Registra un\'altra persona',
6:'Registrar una persona adicional',
7:'Registrar uma pessoa adicional' };*/


// 		technical 				english:0,				
//								// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7
					

C_XL.d['eresa ident continue one'] = { 0:'Make or cancel</br>an appointment',				
							1:'Prendre ou annuler</br>un rendez-vous',				
							2:'Umów się lub odwołaj</br>spotkanie',			
							3:'Maak of annuleer</br>een afspraak',
							4:'Vereinbaren oder stornieren Sie</br>einen Termin',	
							5:'Fissa o annulla</br>un appuntamento',	
							6:'Concierte o cancele</br>una cita', 
							7:'Marque ou cancele</br>um compromisso' };
							
C_XL.d['eresa ident continue many'] = { 0:'Make or cancel an appointment for one of those persons',				
							1:'Prendre ou annuler un RDV pour l\'une de ces personnes',				
							2:'Umów się lub odwołaj spotkanie dla jednej z tych osób',			
							3:'Maak of annuleer een afspraak voor een van die personen',	
							4:'Vereinbaren oder stornieren Sie einen Termin für eine dieser Personen',	
							5:'Fissa o annulla un appuntamento per una di quelle persone',	
							6:'Concierte o cancele una cita para una de esas personas', 
							7:'Marque ou cancele um compromisso para uma dessas pessoas' };

C_XL.d['eresa add more'] = { 0:'Add a person', 
							1:'Ajouter une personne', 
							2:'Dodaj osobę', 
							3:'Een persoon toevoegen', 
							4:'Eine Person hinzufügen', 
							5:'Aggiungere una persona', 
							6:'añadir una persona', 
							7:'Acrescentar uma pessoa' };

							
	// Unknown email alternative flow		
	
C_XL.d['unknown email'] = { 0:'This e-mail is unknown in our system.',				
							1:'Cet email n\'est pas connu de notre système.',				
							2:'Ten adres e-mail jest nieznany w naszym systemie.',			
							3:'Dit e-mail adres is niet bekend in ons systeem.',
							4:'Diese E-Mail Adresse ist unserem System nicht bekannt.',	
							5:'Questa mail non è riconosciuta dal nostro sistema.',	
							6:'Nuestro sistema no reconoce este e-mail.', 
							7:'Este e-mail não é conhecido no nosso sistema.' };
							
C_XL.d['fill gsm&bdate'] = { 0:'Please fill in your mobile number and your date of birth.',				
							1:'Complétez SVP avec les informations suivantes:',				
							2:'Proszę podać numer telefonu i datę urodzenia.',			
							3:'Vul AUB uw mobiele nummer en uw geboortedatum in.',	
							4:'Bitte geben Sie Ihre Mobilnummer und Ihr Geburtsdatum ein.',	
							5:'Completi per favore con il Suo numero di cellulare (completo di prefisso internazionale +39) e data di nascita.',	
							6:'Por favor, complete con su número de móvil y fecha de nacimiento.', 
							7:'Por favor,	adicione o seu número de telemóvel e a sua data de nascimento.' };
							
C_XL.d['retype email'] 	= { 0:'Please check your e-mail or fill it in again.',	
							1:'SVP vérifiez ou ré-écrivez votre e-mail.',		
							2:'Proszę sprawdzić pocztę e-mail lub wypełnić go w.',			
							3:'Controleer AUB uw e-mail of vul hem opnieuw in.',
							4:'Bitte überprüfen Sie Ihre E-Mail Adresse oder geben Sie sie erneut ein.',	
							5:'Per favore controlli o riscriva la Sua mail.',	
							6:'Por favor, compruebe o vuelva a escribir su e-mail.', 
							7:'Verifique ou volte a introduzir o seu e-mail.' };
C_XL.d['pls sign in'] 	= { 0:'You can now register for online booking.',				
							1:'Vous pouvez maintenant vous inscrire pour la réservation en ligne.',				
							2:'Możesz teraz zarejestrować rezerwacji online.',			
							3:'U kunt zich nu registreren voor online reservering.',
							4:'Sie können sich nun für die Online-Buchung anmelden.',	
							5:'adesso può iscriversi per la prenotazione online.',	
							6:'ahora se puede registrar para la reserva online ', 
							7:'agora pode inscrever-se para reserva on-line.' };
							
C_XL.d['pls opt in'] 	= { 0:'You have read and accepted the privacy policy related to online booking.',				
							1:'Vous avez lu et acceptez la politique de confidentialité relative à la prise de RDV en ligne.',				
							2:'Przeczytałeś i akceptujesz politykę prywatności dotyczącą rezerwacji wizyt online.',			
							3:'U hebt het privacybeleid met betrekking tot het online boeken van afspraken gelezen en geaccepteerd.',
							4:'Sie haben die Datenschutzerklärung zur Online-Terminbuchung gelesen und akzeptiert.',	
							5:'Hai letto e accetti l\'informativa sulla privacy relativa alla prenotazione online degli appuntamenti.',	
							6:'Ha leído y acepta la política de privacidad relativa a la reserva de citas online.', 
							7:'Você leu e aceita a política de privacidade relativa à marcação de consultas online.' };
							
C_XL.d['read privacy'] 	= { 0:'Read the privacy policy of ',				
							1:'Voir la politique de confidentialité de ', // de dentiste Legrand, de audioconfort ... 
							2:'Zobacz politykę prywatności ',			
							3:'Zie het privacybeleid van ',
							4:'Siehe Datenschutzerklärung von ',	
							5:'Consulta l\'informativa sulla privacy di ',	
							6:'Ver la política de privacidad de ', 
							7:'Consulte a política de privacidade do ' };
							
C_XL.d['pls coordinates'] = { 0:'Please complete your details below.',	
							1:'Indiquez vos coordonnées complètes ci-dessous.',				
							2:'Proszę wypełnić swoje dane poniżej.',			
							3:'Vul onderstaand uw gegevens in.',
							4:'Bitte vervollständigen Sie Ihre Daten',	
							5:'Inserisca i Suoi dati completi qui sotto.',	
							6:'Indique sus datos completos a continuación.', 
							7:'Insira os seus detalhes abaixo.'};
C_XL.d['pls register'] = { 0:'Please complete below the details of the to register person.',	
							1:'Indiquez ci-dessous les coordonnées de la personne à inscrire.',				
							2:'Podaj poniżej dane kontaktowe osoby do zarejestrowania.',			
							3:'Vul aub hieronder de contactgegevens van de te registreren persoon.',
							4:'Geben Sie unten die Kontaktdaten der zu registrierenden Person an',	
							5:'Indicare sotto i dettagli di contatto della persona da registrare.',	
							6:'Indique a continuación los datos de contacto de la persona a registrar.', 
							7:'Indique abaixo os detalhes de contato da pessoa para registrar.'};

// 		technical 				english:0,				
//								// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7
								
C_XL.d['warn red field'] = { 0:'Fields marked in red may not be left blank.',	
							1:'Les champs en rouge ne peuvent pas rester vides.',				
							2:'Pola oznaczone na czerwono nie może być puste.',			
							3:'Velden gemarkeerd in het rood mogen niet leeg blijven.',
							4:'Rot markierte Felder müssen ausgefüllt werden.',	
							5:'I campi in rosso non possono rimanere vuoti.',	
							6:'Las casillas en rojo no pueden quedarse vacías.', 
							7:'Os campos a vermelho não podem ficar em branco.'};
							
// e-reservation process messages

C_XL.d['pls options'] 	= { 0:'please choose appropriate options and then push the "search" button.',				
							1:'choisissez les options appropriées,	puis appuyez sur le bouton "rechercher".',				
							2:'Proszę wybrać odpowiednie opcje,	a następnie wciśnij przycisk "Szukaj".',			
							3:'Stel uw voorkeuren in en duw dan op de knop "zoeken".',
							4:'Bitte wählen Sie die zutreffenden Optionen aus und klicken Sie auf "suchen".',	
							5:'Scelga le opzioni adeguate e clicchi su "ricerca".',	
							6:'Por favor, seleccione las opciones adecuadas y haga clic en el botón "buscar".', 
							7:'Escolha as opções apropriadas e,	em seguida,	carregue no botão “pesquisar”.'};
							
C_XL.d['slots here'] 	= { 0:'Here are the possible schedules according to your options',				
							1:'Voici les horaires possibles en fonction de vos options.',				
							2:'Oto możliwe rozkłady według Państwa możliwości.',			
							3:'Dit zijn de afspraakmogelijkheden op basis van uw voorkeuren.',
							4:'Gemäß Ihrer Optionen sind hier die möglichen Termine angezeigt.',	
							5:'Ecco i giorni e orari possibili partendo dalle sue preferenze.',	
							6:'Estos son los horarios posibles basándose en sus opciones.', 7:'aqui estão os horários possíveis, dependendo das suas opções.'	};
							
C_XL.d['slots as from'] 	= { 0:'Here are the possible schedules as from',				
							1:'Voici les horaires possibles à partir de',				
							2:'Oto możliwe czasy od',			
							3:'Dit zijn de afspraakmogelijkheden vanaf',
							4:'Hier sind die möglichen Zeiten von',	
							5:'Ecco i possibili orari da',	
							6:'aquí están los horarios posibles a partir de', 
							7:'aqui estão os horários possíveis da'	};
							
C_XL.d['slots from today'] = { 0:'Here are the schedules available from today',				// alternative message to 'slots here'
							1:'Voici les horaires disponibles à partir d\'aujourd\'hui',
							2:'Oto harmonogramy dostępne od dzisiaj',			
							3:'Hier zijn de schema\'s beschikbaar vanaf vandaag',
							4:'Hier sind die Fahrpläne ab heute verfügbar',	
							5:'Ecco gli orari disponibili da oggi',	
							6:'aquí están los horarios disponibles a partir de hoy', 
							7:'aqui estão os horários disponíveis hoje' };
							
C_XL.d['slots from tomorrow'] = { 0:'Here are the schedules available from tomorrow',		// alternative message to 'slots here'		
							1:'Voici les horaires disponibles à partir de demain',	
							2:'Oto harmonogramy dostępne od jutra',			
							3:'Hier zijn de schema\'s beschikbaar vanaf morgen',
							4:'Hier sind die Termine ab morgen verfügbar',	
							5:'Ecco gli orari disponibili da domani',	
							6:'aquí están los horarios disponibles a partir de mañana', 
							7:'aqui estão os horários disponíveis a partir de amanhã' };
							
C_XL.d['pls select'] 	= { 0:'Click on the most appropriate time for your appointment.',				
							1:'Cliquez sur le moment le plus approprié pour votre rendez-vous.',				
							2:'Kliknij na najbardziej odpowiednim czasie na wizytę.',			
							3:'Klik op de meest geschikte tijd voor uw afspraak.',
							4:'Bitte klicken Sie auf einen Termin, der Ihnen passt.',	
							5:'Clicchi sul momento più adeguato per fissare il suo appuntamento.',	
							6:'Haga clic en el momento que más le conviene para su cita.', 
							7:'Clique sobre o momento mais adequado para a sua consulta.'	};
							
C_XL.d['e- you have chosen'] = { 0:'you have chosen an appointment on ',				
							1:'vous avez choisi un rendez-vous le ',				
							2:'wybrałeś umówiony na ',			
							3:'u heeft gekozen voor een afspraak op ',
							4:'Ihr ausgewählter Termin ist am',
							5:'ha scelto un appuntamento il ',	
							6:'ha elegido una cita el', 
							7:'escolheu uma consulta em '};
							
C_XL.d['e- you are app yet on'] = { 0:'you are appointed yet on ',				
							1:'Vous avez déjà rendez-vous pour',				
							2:'wybrałeś umówiony na ',			
							3:'u heeft afgesproken op ',
							4:'Ihr Termin ist am',	
							5:'Il suo appuntamento è fissato per il giorno',	
							6:'Ya tiene una cita para', 
							7:'tem uma consulta'	};
							
C_XL.d['e- has no planned appointment'] = { 
							0:'does not currently have a scheduled appointment',				
							1:'n\'a actuellement pas de rendez-vous planifié',				
							2:'nie ma obecnie zaplanowanego spotkania',			
							3:'heeft momenteel geen geplande afspraak',
							4:'hat momentan keinen geplanten Termin',	
							5:'non ha attualmente un appuntamento programmato',	
							6:'no tiene una cita programada actualmente', 
							7:'ainda não tem um compromisso agendado'	};
							
C_XL.d['e-choose who to book for'] = { 0:'Select here the person(s) for whom you are making an appointment',		// english:0,		
							1:'Sélectionnez ici la ou les personnes pour laquelle vous prenez un RDV',			// french:1,
							2:'Wybierz tutaj osobę(y), dla której umawiasz spotkanie',							// polish:2,	
							3:'Selecteer hier de perso(o)n(en) voor wie u een afspraak maakt',					// dutch:3,	
							4:'Wählen Sie hier die Person(en) aus, für die Sie einen Termin vereinbaren möchten',	// german:4,	
							5:'Seleziona qui la/e persona/e per la quale vuoi fissare un appuntamento',		// italian:5,	
							6:'Seleccione aquí la(s) persona(s) para quien desea concertar una cita', 		// spanish:6,	
							7:'Selecione aqui a(s) pessoa(s) para quem está a marcar uma consulta'	}; 		// portuguese:7
							
							
C_XL.d['e- you have no appointments'] = { 0:'You have no appointment in this agenda.',
							1:'Vous n\'avez pas de rendez-vous dans cet agenda.',				
							2:'Nie musisz wydarzenie w tym kalendarzu.',			
							3:'U heeft geen afspraak in deze agenda.',
							4:'Sie haben in diesem Kalender keine Termine.',	
							5:'Non ha nessun appuntamento in quest\'agenda.',	
							6:'No tiene ninguna cita en este calendario.', 
							7:'Não tem consulta marcada neste calendário.'};
							
C_XL.d['e- deletion unavailable'] = { 0:'Online cancellation of an appointment is not allowed.',
							1:'L\'annulation en ligne d\'un RDV n\'est pas autorisée.',				
							2:'anulowanie Online spotkanie nie jest dozwolone.',			
							3:'Online annulering van een afspraak is niet toegestaan.',	
							4:'Es ist nicht möglich, Termine online abzusagen.',	
							5:'La cancellazione online di un appuntamento non è autorizzata.',	
							6:'La cancelación online de una cita nos está autorizada.', 
							7:'Não é permitido cancelar uma consulta online.'};
							
C_XL.d['e- touch to delete'] = { 0:'Touch an item to access a cancellation option.',
							1:'Touchez votre RDV pour accéder à l\'option d\'annulation.',				
							2:'Dotknij element,	aby uzyskać dostęp do opcji anulowania.',			
							3:'Tik op een bovenstaande afspraak voor een optie tot annulatie.',
							4:'Bitte wählen Sie einen Termin aus, um Stornierungsmöglichkeiten zu sehen.',	
							5:'Tocchi un appuntamento per accedere all\'opzione di cancellazione.',	
							6:'Toque su cita para acceder a la opción de cancelación.', 
							7:'Toque numa consulta para aceder à opção de cancelamento.'};
							
C_XL.d['e- click to delete'] = { 0:'Click an item to access a cancellation option.',
							1:'Cliquez votre RDV pour accéder à l\'option d\'annulation.',				
							2:'Kliknij element,	aby uzyskać dostęp do opcji anulowania.',			
							3:'Klik op een bovenstaande afspraak voor een optie tot annulatie.',
							4:'Klicken Sie auf einen Termin um die Stornierungsmöglichkeiten anzuzeigen.',	
							5:'Clicchi sull’appuntamento per accedere all’opzione di cancellazione.',	
							6:'Haga clic en su cita para acceder a la opción de cancelación.', 
							7:'Clique numa consulta para ver a opção de cancelamento.'	};
						

/*C_XL.d['Cancellation_before_1h'] = { 
	0:'Cancellation is only possible at least 1 hour before the appointment !',
	1:'L\'annulation n\'est possible qu\'au moins 1h avant le RDV !',
	2:'Anulowanie rezerwacji jest możliwe tylko minimum 1 godzin przed spotkaniem !',
	3:'Annulering is alleen mogelijk uiterlijk 1 uur voor de afspraak !',
	4:'Stornierungen sind nur mindestens 1 Stunde vor dem Termin möglich !',
	5:'La cancellazione è possibile solo almeno 1 ore prima dell\'appuntamento !',
	6:'La cancelación sólo es posible 1 hora antes de la cita.',
	7:'O cancelamento só é possível pelo menos 1 hora antes da marcação !' };

C_XL.d['Cancellation_before_12h'] = { 
	0:'Cancellation is only possible at least 12 hours before the appointment !',
	1:'L\'annulation n\'est possible qu\'au moins 12h avant le RDV !',
	2:'Anulowanie rezerwacji jest możliwe tylko minimum 12 godzin przed spotkaniem !',
	3:'Annulering is alleen mogelijk uiterlijk 12 uur voor de afspraak !',
	4:'Stornierungen sind nur mindestens 12 Stunden vor dem Termin möglich !',
	5:'La cancellazione è possibile solo almeno 12 ore prima dell\'appuntamento !',
	6:'La cancelación sólo es posible 12 horas antes de la cita.',
	7:'O cancelamento só é possível pelo menos 12 horas antes da marcação !' };
									
C_XL.d['Cancellation_before_24h'] = { 
	0:'Cancellation is only possible at least 24 hours before the appointment !',
	1:'L\'annulation n\'est possible qu\'au moins 24h avant le RDV !',
	2:'Anulowanie rezerwacji jest możliwe tylko minimum 24 godzin przed spotkaniem !',
	3:'Annulering is alleen mogelijk uiterlijk 24 uur voor de afspraak !',
	4:'Stornierungen sind nur mindestens 24 Stunden vor dem Termin möglich !',
	5:'La cancellazione è possibile solo almeno 24 ore prima dell\'appuntamento !',
	6:'La cancelación sólo es posible 24 horas antes de la cita.',
	7:'O cancelamento só é possível pelo menos 24 horas antes da marcação !' };
	
	
C_XL.d['Cancellation_before_48h'] = { 
	0:'Cancellation is only possible at least 48 hours before the appointment !',
	1:'L\'annulation n\'est possible qu\'au moins 48h avant le RDV !',
	2:'Anulowanie rezerwacji jest możliwe tylko minimum 48 godzin przed spotkaniem !',
	3:'Annulering is alleen mogelijk uiterlijk 48 uur voor de afspraak !',
	4:'Stornierungen sind nur mindestens 48 Stunden vor dem Termin möglich !',
	5:'La cancellazione è possibile solo almeno 48 ore prima dell\'appuntamento !',
	6:'La cancelación sólo es posible 48 horas antes de la cita.',
	7:'O cancelamento só é possível pelo menos 48 horas antes da marcação !' };
	
C_XL.d['Cancellation_before_72h'] = { 
	0:'Cancellation is only possible at least 72 hours before the appointment !',
	1:'L\'annulation n\'est possible qu\'au moins 72h avant le RDV !',
	2:'Anulowanie rezerwacji jest możliwe tylko minimum 72 godzin przed spotkaniem !',
	3:'Annulering is alleen mogelijk uiterlijk 72 uur voor de afspraak !',
	4:'Stornierungen sind nur mindestens 72 Stunden vor dem Termin möglich !',
	5:'La cancellazione è possibile solo almeno 72 ore prima dell\'appuntamento !',
	6:'La cancelación sólo es posible 72 horas antes de la cita.',
	7:'O cancelamento só é possível pelo menos 72 horas antes da marcação !' };
	
C_XL.d['Cancellation_before_7days'] = { 
	0:'Cancellation is only possible at least 7 days before the appointment !',
	1:'L\'annulation n\'est possible qu\'au moins 7 jours avant le RDV !',
	2:'Anulowanie rezerwacji jest możliwe tylko minimum 7 dni przed spotkaniem !',
	3:'Annulering is alleen mogelijk uiterlijk 7 dagen voor de afspraak !',
	4:'Stornierungen sind nur mindestens 7 Tage vor dem Termin möglich !',
	5:'La cancellazione è possibile solo almeno 7 giorni prima dell\'appuntamento !',
	6:'La cancelación sólo es posible 7 días antes de la cita.',
	7:'O cancelamento só é possível pelo menos 7 dias antes da marcação !' };
*/



C_XL.d['Cancellation_before_1h'] = { 
	0:'Cancellation is possible up to 1 hour before the appointment !',
	1:'L\'annulation est possible jusqu\'à 1 heure avant le rendez-vous !',
	2:'Anulacja jest możliwa do 1 godziny przed spotkaniem !',
	3:'Annuleren is mogelijk tot 1 uur voor de afspraak !',
	4:'Stornierung ist bis 1 Stunde vor dem Termin möglich !',
	5:'La cancellazione è possibile fino a 1 ora prima dell\'appuntamento !',
	6:'¡La cancelación es posible hasta 1 hora antes de la cita !',
	7:'O cancelamento é possível até 1 hora antes do compromisso !' };

C_XL.d['Cancellation_before_12h'] = { 
	0:'Cancellation is possible up to 12 hours before the appointment!',
	1:'L\'annulation est possible jusqu\'à 12 heures avant le rendez-vous !',
	2:'Anulacja jest możliwa do 12 godzin przed spotkaniem!',
	3:'Annuleren is mogelijk tot 12 uur voor de afspraak!',
	4:'Stornierung ist bis 12 Stunden vor dem Termin möglich!',
	5:'La cancellazione è possibile fino a 12 ore prima dell\'appuntamento!',
	6:'¡La cancelación es posible hasta 12 horas antes de la cita!',
	7:'O cancelamento é possível até 12 horas antes do compromisso!' };
	
C_XL.d['Cancellation_before_24h'] = { 
	0:'Cancellation is possible up to 24 hours before the appointment!',
	1:'L\'annulation est possible jusqu\'à 24 heures avant le rendez-vous !',
	2:'Anulacja jest możliwa do 24 godzin przed spotkaniem!',
	3:'Annuleren is mogelijk tot 24 uur voor de afspraak!',
	4:'Stornierung ist bis 24 Stunden vor dem Termin möglich!',
	5:'La cancellazione è possibile fino a 24 ore prima dell\'appuntamento!',
	6:'¡La cancelación es posible hasta 24 horas antes de la cita!',
	7:'O cancelamento é possível até 24 horas antes do compromisso!' };
	
C_XL.d['Cancellation_before_48h'] = { 
	0:'Cancellation is possible up to 48 hours before the appointment!',
	1:'L\'annulation est possible jusqu\'à 48 heures avant le rendez-vous !',
	2:'Anulacja jest możliwa do 48 godzin przed spotkaniem!',
	3:'Annuleren is mogelijk tot 48 uur voor de afspraak!',
	4:'Stornierung ist bis 48 Stunden vor dem Termin möglich!',
	5:'La cancellazione è possibile fino a 48 ore prima dell\'appuntamento!',
	6:'¡La cancelación es posible hasta 48 horas antes de la cita!',
	7:'O cancelamento é possível até 48 horas antes do compromisso!' };

C_XL.d['Cancellation_before_72h'] = { 
	0:'Cancellation is possible up to 72 hours before the appointment!',
	1:'L\'annulation est possible jusqu\'à 72 heures avant le rendez-vous !',
	2:'Anulacja jest możliwa do 72 godzin przed spotkaniem!',
	3:'Annuleren is mogelijk tot 72 uur voor de afspraak!',
	4:'Stornierung ist bis 72 Stunden vor dem Termin möglich!',
	5:'La cancellazione è possibile fino a 72 ore prima dell\'appuntamento!',
	6:'¡La cancelación es posible hasta 72 horas antes de la cita!',
	7:'O cancelamento é possível até 72 horas antes do compromisso!' };
	
C_XL.d['Cancellation_before_7days'] = { 
	0:'Cancellation is possible up to 7 days before the appointment!',
	1:'L\'annulation est possible jusqu\'à 7 jours avant le rendez-vous !',
	2:'Anulacja jest możliwa do 7 dni przed spotkaniem!',
	3:'Annuleren is mogelijk tot 7 dagen voor de afspraak!',
	4:'Stornierung ist bis 7 Tage vor dem Termin möglich!',
	5:'La cancellazione è possibile fino a 7 giorni prima dell\'appuntamento!',
	6:'¡La cancelación es posible hasta 7 días antes de la cita!',
	7:'O cancelamento é possível até 7 dias antes do compromisso!' };

	

				
C_XL.d['e- more app'] 	= { 0:'take one more appointment',				
							1:'prendre encore un RDV',				
							2:'jeszcze jeden termin',			
							3:'nog een afspraak maken',
							4:'Einen weiteren Termin vereinbaren',	
							5:'prendere un altro appuntamento',	
							6:'tomar otra cita', 
							7:'marcar outra consulta'	};
							
C_XL.d['e- done ok'] 	= { 0:'Quit',	1:'Terminer',	2:'Skończyć',	3:'Klaar',		4:'Beenden',	5:'Terminato',	6:'acabado', 7:'Terminado'	};

C_XL.d['modify options'] = { 0:'Modify my options',				
							1:'Modifier mes options',				
							2:'Zmodyfikować moje opcje',			
							3:'Wijzig mijn opties',
							4:'Meine Auswahl anpassen',	5:'Modificare le mie opzioni',	
							6:'Modificar mis opciones', 
							7:'alterar as minhas opções'};
							
C_XL.d['e- del confirm'] 	= { 0:'Pls confirm deletion',				
							1:'Confirmez la suppression',				
							2:'Potwierdź usunięcie.',			
							3:'Bevestig de verwijdering',
							4:'Bitte die Löschung bestätigen',	
							5:'Confermare la cancellazione',	
							6:'Confirmar la cancelación', 
							7:'Confirmar que desejo apagar'};
							
C_XL.d['e- pls confirm'] = { 0:'Please confirm your choice.',				
							1:'S\'il vous plaît confirmez votre choix.',				
							2:'Potwierdź wybór.',			
							3:'Bevestig AUB nu uw keuze.',
							4:'Bitte bestätigen Sie Ihre Wahl.',	
							5:'Confermi la Sua scelta.',	
							6:'Confirme su elección.', 
							7:'Confirme a sua escolha.'};
							
C_XL.d['e- pls note&confirm'] = { 0:'Please type in a note if necessary, then confirm your choice.',	// en			
							1:'Indiquez une note si nécessaire,	et ensuite confirmez votre choix.',			// 	fr
							2:'Proszę wpisać w notatce w razie potrzeby, a następnie potwierdzić wybór.',	// pl
							3:'Eventuele vragen of opmerkingen kunt u hier melden. Bevestig AUB nadien uw keuze.', // nl
							4:'Bitte geben Sie bei Bedarf eine Notiz ein, und bestätigen Sie dann Ihre Wahl.',	// de
							5:'Indichi una nota se necessario, e poi confermi la Sua scelta.',	// it
							6:'Indique una nota si es necesario, y luego confirme su elección.', 
							7:'Se necessário, indique uma nota,	e em seguida confirme a sua escolha.' }; // pt

							
							
C_XL.d['e- black listed'] = { 0:'You can not make an appointment on this page. Please contact us by phone.',				
							1:'Vous ne pouvez pas prendre de RDV sur cette page. SVP contactez nous par téléphone.',	
							2:'Nie możesz umówić się na tę stronę. Prosimy o kontakt telefoniczny.',			
							3:'Je kunt geen afspraak maken op deze pagina. Neem telefonisch contact met ons op.',
							4:'Sie können auf dieser Seite keinen Termin vereinbaren. Bitte kontaktieren Sie uns telefonisch.',	
							5:'Non puoi fissare un appuntamento su questa pagina. Vi preghiamo di contattarci telefonicamente.',	
							6:'No puede tomar una cita en esta página. Por favor contáctenos por teléfono.', 
							7:'Você não pode marcar uma consulta nesta página. Entre em contato conosco por telefone.' };
							
							
C_XL.d['e- your AMPM preference'] = { 0:'My days of preference',				
							1:'Mes jours de préférence',	
							2:'Moje dni preferencji',			
							3:'Mijn dagen van voorkeur',
							4:'Meine Tage der Vorliebe',	
							5:'I miei giorni di preferenza',	
							6:'Mis días de preferencia', 
							7:'Meus dias de preferência' };
							
C_XL.d['search as from'] = { 0:'availability as of',				
							1:'Disponibilité à partir de',	
							2:'Dostępność od',			
							3:'Beschikbaarheid vanaf',
							4:'Verfügbarkeit ab',	
							5:'Disponibilità da',	
							6:'Disponibilidad a partir de', 
							7:'Disponibilidade a partir de' };


C_XL.d['e-reserved fine'] = { 0:'Your reservation is properly saved.',				
							1:'Votre réservation est bien enregistrée.',				
							2:'Państwa rezerwacja jest zapisane.',			
							3:'Uw reservering wordt opgeslagen.',
							4:'Ihr Termin wurde erfolgreich gespeichert.',	
							5:'La Sua prenotazione è stata registrata con successo.',
							6:'Su reserva se registró con éxito.', 
							7:'a sua reserva foi registada com sucesso.'};
							
C_XL.d['e-goodbye'] 	= { 0:'Thank you for visiting us. You can close this page.',				
							1:'Merci pour votre visite. Vous pouvez fermer cette page.',				
							2:'Dziekuje za odwiedziny. Możesz zamknąć tę stronę.',			
							3:'Bedankt voor uw bezoek. U kunt deze pagina afsluiten.',	
							4:'Vielen Dank für Ihren Besuch. Sie können dieses Fenster schließen.',	
							5:'Grazie della Sua visita. Ora può chiudere questa pagina.',	
							6:'Gracias por visitarnos. Puede cerrar esta página.', 
							7:'Obrigada pela sua visita. Pode fechar esta página.'};
							
C_XL.d['e- no registr']	= { 0:'Sorry, we cannot find you in the file and online registration is not allowed.',				
							1:'Désolé, nous ne pouvons pas vous trouver dans le registre et l\'inscription en ligne n\'est pas autorisée.',				
							2:'Niestety, nie możemy cię znaleźć w pliku, a rejestracja online jest niedozwolone.',			
							3:'Sorry, we kunnen U niet vinden in het bestand en online registratie is niet toegestaan.',
							4:'Tut uns Leid, leider können wir Sie in unserem Verzeichnis nicht finden und die Registrierung ist online nicht möglich. ',	
							5:'Siamo spiacenti, non La troviamo nel registro e l\'iscrizione online non è autorizzata.',	
							6:'Disculpe, no le encontramos en el registro y la inscripción online no está autorizada.', 
							7:'Desculpe, mas não foi possível encontrá-lo/a no registo. A inscrição em linha não foi autorizada.'};
							
							
// Tooltips		
C_XL.d['tip e-search'] 	= { 0:'Show the possibilities in relation to these options',				
							1:'Montrer les possibilités en rapport avec ces options',				
							2:'Lista możliwości w stosunku do tych opcji',			
							3:'Toon de mogelijkheden met betrekking tot deze opties',
							4:'Terminmöglichkeiten anhand dieser Optionen anzeigen',	
							5:'Mostrare le possibilità tenendo conto delle opzioni.',	
							6:'Mostrar las posibilidades relacionadas con estas opciones.', 
							7:'Mostrar as possibilidades em relação a estas opções'};
							
C_XL.d['tip e-change'] = { 0:'One step back so that you can modify your options',				
							1:'Retour à l\'étape précédente,	pour modifier les options',				
							2:'Jeden krok do tyłu,	tak,	że można zmodyfikować opcje',			
							3:'Een stap terug zo dat u uw opties kan wijzigen',
							4:'Zum vorherigen Schritt zurück, um Ihre Optionen anzupassen',	
							5:'Tornare alla tappa precedente, per modificare le opzioni.',	
							6:'Volver a la etapa anterior, para modificar las opciones.', 
							7:'Regressar à etapa precedente para modificar as opções'};				



	//  C_iPACKAGE
	//			
C_XL.d['package plan'] = { 0:'Purchase plan',	1:'Formule tarifaire',	2:'Wzór taryfowy',	3:'Tariefformule',	4:'Zahlplan',	5:'Formule tariffarie',	6:'Fórmula tarifaria', 7:'Fórmula de tarifário'}


	//  C_iPRO
	//							
C_XL.d['profession'] = { 0:'Profession',	1:'Profession',	2:'Profesja',	3:'Beroep',		4:'Beruf',	5:'Professione',	6:'Profesión', 7:'Profissão'	};
				
C_XL.d['dentistry'] 			= { 0:'Dentistry',	 		1:'Dentisterie',		2:'Dentistry',				3:'Tandheelkunde',	4:'Zahnheilkunde',		5:'Odontoiatria',		6:'Odontología', 		7:'Odontologia'	};

C_XL.d['dental surgeon'] 		= { 0:'dental surgeon',		1:'chirurgien dentaire',2:'chirurga stomatologa',	3:'kaakchirurg',	4:'Zahnchirurg',		5:'medico dentista',	6:'cirujano dental', 	7:'cirurgião-dentista'	};
C_XL.d['dentist'] 				= { 0:'dentist',			1:'dentiste',			2:'dentysta',				3:'tandarts',		4:'Zahnarzt',			5:'dentista',			6:'dentista', 			7:'dentista'	};
C_XL.d['orthodontist'] 			= { 0:'orthodontist',		1:'orthodontiste',		2:'orthodontist',			3:'orthodontist',	4:'Kieferorthopäde',	5:'ortodontista',		6:'ortodoncista', 		7:'ortodontista'	};
C_XL.d['dental prosthetist'] 	= { 0:'dental prosthetist',	1:'prothésiste',		2:'technik dentystyczny',	3:'tandtechnicus',	4:'Zahnprothetiker',	5:'odontoprotesista',	6:'protésico dental', 	7:'protésico'	};
C_XL.d['odontologist'] 			= { 0:'odontologist',		1:'odontologue',		2:'odontolog',				3:'odontologist',	4:'Odontologe',			5:'odontologo',			6:'odontólogo', 		7:'odontologista'		};

// 		technical 				english:0,				french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7

C_XL.d['doctors'] 			= { 0:'Doctors',			1:'Médecins',				2:'Lekarze',			3:'artsen',				4:'Ärzte',				5:'Medici',				6:'Médicos', 				7:'Médicos'	};
C_XL.d['generalist'] 		= { 0:'generalist',			1:'généraliste',			2:'generalist',			3:'generalist' ,		4:'allgemeinmediziner',	5:'medico generico',	6:'médico general', 		7:'clínica geral'	};
C_XL.d['specialist'] 		= { 0:'specialist',			1:'spécialiste',			2:'specjalista',		3:'specialist',			4:'Spezialist',			5:'specialista',		6:'especialista', 			7:'especialista'	};
C_XL.d['surgeon'] 			= { 0:'surgeon',			1:'chirurgien',				2:'chirurg',			3:'chirurg' ,			4:'chirurg',			5:'chirurgo',			6:'cirujano', 				7:'cirurgião'	};
C_XL.d['cardiologist'] 		= { 0:'cardiologist',		1:'cardiologue',			2:'kardiolog',			3:'cardioloog' ,		4:'kardiologe',			5:'cardiologo',			6:'cardiólogo', 			7:'cardiologista'	};
C_XL.d['cosmetic surgeon'] 	= { 0:'cosmetic surgeon',	1:'chirurgien esthétique',	2:'chirurg kosmetyczny',3:'cosmetisch chirurg',	4:'schönheitschirurg',	5:'chirurgo estetico',	6:'cirujano plástico', 		7:'cirurgião plástico'	};
C_XL.d['dermatologist'] 	= { 0:'dermatologist',		1:'dermatologue',			2:'dermatolog',			3:'dermatologist',		4:'dermatologe',		5:'dermatologo',		6:'dermatólogo', 			7:'dermatologista'	};
C_XL.d['gastroenterologist'] = { 0:'gastroenterologist',1:'gastro-entérologue',		2:'gastroenterologist',	3:'gastro-enteroloog',	4:'gastroenterologe',	5:'gastroenterologo',	6:'gastroenterólogo', 		7:'gastroenterologista'	};
C_XL.d['gynecologist'] 		= { 0:'gynecologist',		1:'gynécologue',			2:'ginekolog',			3:'gynaecoloog',		4:'gynäcologe',			5:'ginecologo',			6:'ginecólogo', 			7:'ginecologista'	};
C_XL.d['physiotherapist'] 	= { 0:'physiotherapist',	1:'kinésithérapeute',		2:'fizjoterapeuta',		3:'fysiotherapeut',		4:'physiotherapeut',	5:'fisioterapista',		6:'fisioterapeuta', 		7:'fisioterapeuta'	};
C_XL.d['speech therapist'] 	= { 0:'speech therapist',	1:'logopède',				2:'logopeda',			3:'logopedist' ,		4:'sprachtherapeut',	5:'logopedista',		6:'logopeda', 				7:'terapeuta da fala'	};
C_XL.d['oculist'] 			= { 0:'oculist',			1:'oculiste',				2:'okulista',			3:'oogarts' ,			4:'augenarzt',			5:'oculista',			6:'oculista', 				7:'oculista'		};
C_XL.d['ophthalmologist'] 	= { 0:'ophthalmologist',	1:'ophtalmologue',			2:'okulista',			3:'oogarts' ,			4:'augenarzt',			5:'oftalmologo',		6:'oftalmólogo', 			7:'oftalmologista'	};
C_XL.d['orthopedic'] 		= { 0:'orthopedic',			1:'orthopédiste',			2:'ortopedyczny',		3:'orthopedische',		4:'orthopäde',			5:'ortopedico',			6:'ortopedista', 			7:'ortopedista'		};
C_XL.d['ear nose and throat'] 	= { 0:'ear,	nose and throat',1:'oto-rhino-laryngologue',2:'uszu, nosa i gardła',3:'oor,	neus en keel',	4:'hals, nasen, ohren',	5:'otorinolaringoiatra',6:'otorrinolaringólogo', 7:'otorrinolaringologista'	};
C_XL.d['pediatrician'] 		= { 0:'pediatrician',		1:'pédiatre',				2:'pediatra',			3:'kinderarts' ,		4:'kinderarzt',			5:'pediatra',			6:'pediatra', 				7:'pediatra'			};
C_XL.d['podiatrist'] 		= { 0:'podiatrist',			1:'podologue',				2:'podiatrist',			3:'podoloog' ,			4:'podologe',			5:'podologo',			6:'podólogo', 				7:'podólogo'			};
C_XL.d['lung specialist'] 	= { 0:'lung specialist',	1:'pneumologue',			2:'specjalista płuc',	3:'longarts' ,			4:'lungenspezialist',	5:'pneumologo',			6:'neumólogo', 				7:'pneumologista'		};
C_XL.d['phlebologist'] 		= { 0:'phlebologist',		1:'phlébologue',			2:'phlebologist',		3:'fleboloog' ,			4:'phlebologe',			5:'flebologo',			6:'flebólogo', 				7:'flebólogo'			};
C_XL.d['rheumatologist'] 	= { 0:'rheumatologist',		1:'rhumatologue',			2:'reumatolog',			3:'reumatoloog',		4:'rheumatologe',		5:'reumatologo',		6:'reumatólogo', 			7:'reumatologista'		};
C_XL.d['urologist'] 		= { 0:'urologist',			1:'urologue',				2:'urolog',				3:'uroloog' ,			4:'urologe',			5:'urologo',			6:'urólogo', 				7:'urologista'			};
C_XL.d['senologist'] 		= { 0:'senologist',			1:'sénologue',				2:'senologist',			3:'senologist' ,		4:'senologe',			5:'senologo',			6:'mastólogo', 				7:'mastologista'		};
C_XL.d['radiologist'] 		= { 0:'radiologist',		1:'radiologue',				2:'radiolog',			3:'radioloog' ,			4:'radiologe',			5:'radiologo',			6:'radiólogo', 				7:'radiologista'		};
C_XL.d['bandagist'] 		= { 0:'bandagist',			1:'bandagiste',				2:'bandagist',			3:'bandagist',			4:'Bandagist',			5:'bandagist',			6:'bandagist', 				7:'bandagist'			};
C_XL.d['audiologist'] 		= { 0:'audiologist',		1:'audiologue',				2:'audiolog',			3:'audioloog',			4:'audiologe',			5:'audiologo',			6:'audiólogo', 				7:'audiologista'		};
C_XL.d['sports doctor']		= { 0:'sports doctor',		1:'médecin sportif',		2:'lekarz sportowy',	3:'sportarts',			4:'Sportarzt',			5:'medico di sport',	6:'médico del deporte', 	7:'médico de esportes'	};
C_XL.d['neurologist'] 		= { 0:'neurologist',		1:'neurologue',				2:'lekarz nerwowy',		3:'zenuwarts',			4:'Neurologe',			5:'neurologo',			6:'neurólogo', 				7:'neurologista'		};
C_XL.d['veterinary'] 		= { 0:'veterinary',			1:'vétérinaire',			2:'weterynaryjny',		3:'dierenarts',			4:'Veterinär',			5:'veterinario',		6:'veterinario', 			7:'veterinário'			};
C_XL.d['anesthetist'] 		= { 0:'anesthetist',		1:'anésthésiste',			2:'anestetysta',		3:'anesthesist',		4:'anästhesist',		5:'anestesista',		6:'anestesista', 			7:'anestesista'			};
C_XL.d['sexologist'] 		= { 0:'sexologist',			1:'sexologue',				2:'seksuolog',			3:'seksuoloog',			4:'Sexualforscher',		5:'sessuologo',			6:'sexólogo', 				7:'sexologista'			};
C_XL.d['endocrinologist'] 	= { 0:'endocrinologist',	1:'endocrinologue',			2:'endokrynolog',		3:'endocrinoloog',		4:'Endokrinologe',		5:'endocrinologo',		6:'endocrinólogo', 			7:'endocrinologista'	};
C_XL.d['nephrologist'] 		= { 0:'nephrologist',		1:'néphrologue',			2:'nefrolog',			3:'nefroloog',			4:'Nephrologe',			5:'nefrologo',			6:'nefrólogo', 				7:'nefrologista'		};
C_XL.d['oncologist'] 		= { 0:'oncologist',			1:'oncologue',				2:'onkolog',			3:'oncoloog',			4:'onkologe',			5:'oncologo',			6:'oncólogo', 				7:'oncologista'			};


C_XL.d['alt medicines']		= { 0:'alternative medicines',	1:'Médecines douces',		2:'alternatywne lekarstwa',	 3:'alternatieve medicijnen',		4:'alternative Medizin',	5:'Medicine alternative',	6:'Medicina alternativa', 7:'Medicina alternativa'	};

C_XL.d['acupuncturist'] 	= { 0:'acupuncturist',		1:'acupuncteur',		2:'akupunktury',		3:'acupuncteur',		4:'akupunktur',			5:'agopuntore',		6:'acupunturista', 	7:'acumputurista'	};
C_XL.d['chiropractor'] 		= { 0:'chiropractor',		1:'chiropraticien',		2:'kręgarz',			3:'chiropraxie',		4:'chiropraktiker',		5:'chiropratico',	6:'quiropráctico', 	7:'quiroprático'	};
C_XL.d['dietitian'] 		= { 0:'dietitian',			1:'diététiste',			2:'dietetyk',			3:'diëtist',			4:'ernährungsberater',	5:'nutizionista',	6:'nutricionista', 	7:'nutricionista'	};
C_XL.d['homeopath'] 		= { 0:'homeopath',			1:'homéopathe',			2:'homeopata',			3:'homeopaat',			4:'homöopath',			5:'omeopata',		6:'homeópata', 		7:'homeopata'	};
C_XL.d['kinesiologist'] 	= { 0:'kinesiologist',		1:'kinesiologue',		2:'kinesiologist',		3:'kinesiologist',		4:'kinesiologe',		5:'fisioterapista',	6:'quinesiólogo', 	7:'cinesiologista'	};
C_XL.d['osteopath'] 		= { 0:'osteopath',			1:'ostéopathe',			2:'osteopata',			3:'osteopaat',			4:'osteopath',			5:'osteopata',		6:'osteópata', 		7:'osteopata'	};
C_XL.d['sophrologist'] 		= { 0:'sophrologist',		1:'sophrologue',		2:'sophrologist',		3:'sophrologist',		4:'sophrologe',			5:'sofrologo',		6:'sofrólogo', 		7:'sofrologista'	};
C_XL.d['art-therapist'] 	= { 0:'art-therapist',		1:'art-therapeute',		2:'terapeuta sztuki',	3:'creatief therapeut',	4:'kunsttherapeut',		5:'arte-terapeuta',	6:'arte-terapeuta', 7:'arte-terapeuta'	};



// 		technical 				english:0,				french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7


C_XL.d['psychoanalyst'] 	= { 0:'psychoanalyst',		1:'psychanalyste',		2:'psychoanalityk',		3:'psychoanalyticus',	4:'psychonanalytiker',	5:'psicanalista',	6:'psicoanalista', 		7:'psicanalista'	};
C_XL.d['psychiatrist'] 		= { 0:'psychiatrist',		1:'psychiatre',			2:'psychiatra',			3:'psychiater',			4:'psychiater',			5:'psichiatra',		6:'psiquiatra', 		7:'psiquiatra'		};
C_XL.d['psychomotor'] 		= { 0:'psychomotor',		1:'psychomotricien',	2:'psychoruchowe',		3:'psychomotorische',	4:'psychomotoriker',	5:'psicomotricista',6:'psicomotricista', 	7:'psicomotricista'	};
C_XL.d['psychologist'] 		= { 0:'psychologist',		1:'psychologue',		2:'psycholog',			3:'psycholoog',			4:'psychologe',			5:'psicologo',		6:'psicólogo', 			7:'psicólogo'		};
C_XL.d['psychotherapist'] 	= { 0:'psychotherapist',1:'psychothérapeute',		2:'psychoterapeuta',	3:'psychotherapeut',	4:'psychotherapeut',	5:'psicoterapeuta',	6:'psicoterapeuta', 	7:'psicoterapeuta'	};
			
			
C_XL.d['beautician'] 	= { 0:'beautician',		1:'esthéticien',		2:'kosmetyczka',	3:'schoonheidsspecialist',	4:'kosmetikerin',				5:'estetista',		6:'esteticista',	7:'esteticista'	};
C_XL.d['hairdresser'] 	= { 0:'hairdresser',	1:'coiffeur',			2:'fryzjer',		3:'kapper',					4:'friseur',					5:'parrucchiere',	6:'peluquero', 		7:'cabeleireiro'	};
C_XL.d['masseur'] 		= { 0:'masseur',		1:'masseur',			2:'masażysta',		3:'masseur',				4:'massagetherapeut',			5:'massaggiatore',	6:'masajista',		7:'massagista'	};
C_XL.d['pedicure'] 		= { 0:'pedicure',		1:'pédicure',			2:'pedicure',		3:'pedicure',				4:'pedicure',					5:'pedicura',		6:'pedicura', 		7:'pedicura'	};
C_XL.d['tattooist'] 	= { 0:'tattooist',		1:'tatoueur',			2:'tattooist',		3:'tatoeëerder',			4:'tätowierer',					5:'tatuatore',		6:'tatuador', 		7:'tatuador'	};


C_XL.d['teacher'] 		= { 0:'teacher',		1:'enseignant',			2:'nauczyciel',		3:'leraar',				4:'Lehrer',				5:'insegnante',				6:'profesor', 				7:'professor'			};
C_XL.d['assistant']		= { 0:'assistant',		1:'assistant(e)',		2:'asystent',		3:'assistent',			4:'assistent',			5:'assistente',				6:'asistente', 				7:'assistente'	};
C_XL.d['nurse']			= { 0:'nurse',			1:'infirmier',			2:'pielęgniarka',	3:'verpleegster',		4:'krankenpfleger',		5:'infermiera',				6:'enfermero', 				7:'enfermeiro'	};
C_XL.d['secretary']		= { 0:'secretary',		1:'secrétaire',			2:'sekretarz',		3:'secretaris',			4:'sekretär',			5:'segretaria',				6:'secretário', 			7:'secretário'	};
C_XL.d['realtor']		= { 0:'realtor',		1:'agent immobilier',	2:'pośrednik',		3:'vastgoed makelaar',	4:'immobilienmakler',	5:'agente immobiliare',		6:'agente inmobiliario', 	7:'agente imobiliário'	};
C_XL.d['agent'] 		= { 0:'agent',			1:'agent',				2:'agent',			3:'agent',				4:'agent',				5:'agente',					6:'agente', 				7:'funcionário'	};
C_XL.d['technician'] 	= { 0:'technician',		1:'technicien',			2:'technik',		3:'technicus',			4:'techniker',			5:'tecnico',				6:'técnico', 				7:'técnico'	};
C_XL.d['broker'] 		= { 0:'broker',			1:'courtier',			2:'pośrednik',		3:'makelaar',			4:'makler',				5:'broker',					6:'corredor', 				7:'corretor de câmbios'	};
C_XL.d['manager'] 		= { 0:'manager',		1:'responsable',		2:'kierownik',		3:'manager',			4:'manager',			5:'responsabile',			6:'responsable', 			7:'decisor'	};
C_XL.d['consultant'] 	= { 0:'manager',		1:'consultant',			2:'konsultant',		3:'consultant',			4:'berater',			5:'consulente',				6:'consultor', 				7:'consultor'	};
C_XL.d['lawyer'] 		= { 0:'lawyer',			1:'avocat',				2:'prawnik',		3:'advocaat',			4:'anwalt',				5:'avvocato',				6:'abogado', 				7:'advogado'	};
C_XL.d['judge'] 		= { 0:'judge',			1:'juge',				2:'sędzia',			3:'rechter',			4:'richter',			5:'giudice',				6:'juez', 					7:'juiz'	};
C_XL.d['notary'] 		= { 0:'notary',			1:'notaire',			2:'notariusz',		3:'notaris',			4:'notar',				5:'notaio',					6:'notario', 				7:'notário'	};
C_XL.d['salesperson'] 	= { 0:'sales person',	1:'délégué commercial',	2:'sprzedawca',		3:'afgevaardigde',		4:'vertriebspersonal',	5:'rappresentante commerciale',	6:'delegado comercial', 7:'delegado comercial'	};

C_XL.d['other pro'] 	= { 0:'other profession',1:'autre profession',	2:'inny zawód',		3:'ander beroep',		4:'anderer Beruf',		5:'altra professione',		6:'otra profesión', 7:'outra profissão'	};




	//  C_iSEC
	//
C_XL.d['prof sector'] 	= { 0:'Industry/sector',	1:'Secteur d\'activité',	2:'Przemysł',		3:'Industrie/sector',	4:'Industrie/Branche',	5:'Settore di attività',	6:'Sector de actividad', 7:'Setor de atividade' };

C_XL.d['medical sector'] 		= { 0:'Medical sector',				1:'Secteur médical',			2:'Sektor medyczny',			3:'Medische sector',				4:'Medizinische Branche',		5:'Settore medico',				6:'Sector médico', 				7:'Setor médico'	};
C_XL.d['general medecine'] 		= { 0:'general medecine',			1:'médecine générale',			2:'medycyna ogólna',			3:'algemene geneeskunde',			4:'allgemeinmedizin',			5:'medicina generica',			6:'medicina general', 			7:'clínica geral'	};
C_XL.d['specialized medecine'] 	= { 0:'specialized medecine',		1:'médecine spécialisée',		2:'medycyny specjalistycznej',	3:'gespecialiseerde geneeskunde',	4:'Spezialisierte Medizin',		5:'medicina specializzata',		6:'medicina especializada', 	7:'medicina especializada'	};
C_XL.d['dental clinic'] 		= { 0:'dental clinic',				1:'clinique dentaire',			2:'klinika dentystyczna',		3:'tandheelkundige kliniek',		4:'Zahnarztpraxis',				5:'clinica dentale',			6:'clínica dental', 			7:'clínica odontológica'	};
C_XL.d['private practice'] 		= { 0:'private practice',			1:'cabinet privé',				2:'prywatna praktyka',			3:'particuliere praktijk',			4:'Private Praxis',				5:'studio privato',				6:'consultorio privado', 		7:'consultório particular'	};
C_XL.d['laboratory'] 			= { 0:'laboratory',					1:'laboratoire',				2:'laboratorium',				3:'laboratorium',					4:'Labor',						5:'laboratorio',				6:'laboratorio', 				7:'laboratório'			};
C_XL.d['medical secretariat'] 	= { 0:'medical secretariat',		1:'secrétariat médical',		2:'sekretarka medyczna',		3:'medisch secretariaat',			4:'Medizinisches Sekretariat',	5:'segreteria medica',			6:'secretaría médica', 			7:'secretariado médico'	};
C_XL.d['multidis clinic'] 		= { 0:'multidisciplinary clinic',	1:'clinique multidisciplinaire',2:'wielodyscyplinarny clinic',	3:'multidisciplinaire kliniek',		4:'Multidisziplinäre Praxis',	5:'clinica multidisciplinare',	6:'clínica multidisciplinaria', 7:'clínica multidisciplinar'	};
C_XL.d['hospital'] 				= { 0:'hospital',					1:'hopital',					2:'szpital',					3:'ziekenhuis',						4:'Krankenhaus',				5:'ospedale',					6:'hospital', 					7:'hospital'			};

// 		technical 				english:0,				french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7

		
C_XL.d['wellness and aesthetic']= { 0:'Wellness and aesthetic',		1:'Bien être et esthétique',	2:'Zdrowotne i estetyczne',	3:'Wellness en esthetische',	4:'Wellness und Ästhetik',	5:'Benessere ed estetica',	6:'Bienestar y estética', 	7:'Bem-estar e estética'	};
C_XL.d['alternative medicine'] 	= { 0:'alternative Medicine',		1:'Medecine douce',				2:'Medycyna alternatywna',	3:'alternatieve geneeskunde',	4:'alternative Medizin',	5:'Medicina alternativa',	6:'Medicina alternativa', 	7:'Medicina alternativa'	};
C_XL.d['psychology'] 			= { 0:'Psychology',					1:'Psychologie',				2:'Psychologia',			3:'psychologie',				4:'Psychologie',			5:'Psicologia',				6:'Psicología', 			7:'Psicologia'				};
C_XL.d['aesthetic & wellness'] 	= { 0:'aesthetic & wellness',		1:'Esthétique & bien être',		2:'Estetyka i wellness',	3:'esthetiek en welzijn',		4:'Beauty & Wellness',		5:'Estetica & benessere',	6:'Estética y bienestar', 	7:'Estética e bem estar'	};
C_XL.d['fitness'] 				= { 0:'Fitness',					1:'Centre de fitness',			2:'Siłownia',				3:'fitnesscentrum',				4:'Fitnesscenter',			5:'Centro fitness',			6:'Centro de fitness', 		7:'Centro de fitness'		};
C_XL.d['clairvoyance'] 			= { 0:'Clairvoyance',				1:'Voyance',					2:'Jasnowidzenie',			3:'Helderziendheid',			4:'Hellseherei',			5:'Chiaroveggenza',			6:'clarividencia', 			7:'Clarividência'			};
		
C_XL.d['agences & services'] 	= { 0:'agences & services',			1:'agences & services',			2:'agencje i usługi',		3:'agentschappen en diensten',	4:'agenturen & Dienste',	5:'agenzie e servizi',		6:'agencias y servicios', 			7:'agências e serviços'	};
C_XL.d['legal sector'] 			= { 0:'legal sector',				1:'profession libérale',		2:'sektor prawny',			3:'juridische sector',			4:'Rechtsbereich',			5:'professione liberale',	6:'profesión liberal', 				7:'profissão liberal'	};
C_XL.d['real estate'] 			= { 0:'real estate',				1:'immobilier',					2:'nieruchomość',			3:'vastgoed',					4:'Immobilien',				5:'immobiliare',			6:'inmobiliario', 					7:'imobiliário'		};
C_XL.d['outplacement'] 			= { 0:'outplacement',				1:'agence d\'interim',			2:'urząd okresowe',			3:'interim office',				4:'Vermittlungsbüro',		5:'agenzia interinale',		6:'agencia de trabajo temporal', 	7:'agência temporária'	};
C_XL.d['recruitment'] 			= { 0:'recruitment',				1:'recrutement',				2:'rekrutacja',				3:'werving',					4:'Rekrutierung',			5:'reclutamento',			6:'reclutamiento', 					7:'recrutamento'		};
C_XL.d['gaming'] 				= { 0:'Gaming',						1:'Jeux et distraction',		2:'Gry i rozrywki',			3:'Gaming & afleiding',			4:'Gaming',					5:'Giochi e animazione',	6:'Juegos y entretenimiento', 		7:'Jogos e entretenimento'	};
C_XL.d['consultancy'] 			= { 0:'consultancy',				1:'conseil',					2:'doradztwo',				3:'consultancy',				4:'Beratung',				5:'consulenza',				6:'consultoría', 					7:'aconselhamento'		};
C_XL.d['commercial division'] 	= { 0:'commercial division',		1:'division commerciale',		2:'Wydział',				3:'commerciële afdeling',		4:'Vertriebsabteilung',		5:'divisione commerciale',	6:'división comercial', 			7:'divisão comercial'	};
C_XL.d['automotive maintenance']= { 0:'automotive maintenance',		1:'maintenance automobile',		2:'automotive konserwacji',	3:'auto-onderhoud',				4:'Fahrzeugwartung',		5:'manutenzione automobile',6:'mantenimiento automóviles', 		7:'manutenção automóvel'	};
C_XL.d['public service']		= { 0:'public service',				1:'service publique',			2:'public service',			3:'overheidsdienst',			4:'Öffentliche Dienste',	5:'servizio pubblico',		6:'servicio público', 				7:'serviço público'		};

C_XL.d['financial'] 			= { 0:'Financial',			1:'Financier',		2:'Financial',			3:'FinacIëel',		4:'Finanzen',		5:'Finanza',		6:'Finanzas', 		7:'Financeiro'	};
C_XL.d['insurance'] 			= { 0:'Insurance',			1:'assurance',		2:'Ubezpieczenie',		3:'Verzekering',	4:'Versicherungen',	5:'assicurazione',	6:'Seguros', 		7:'Seguro'		};
C_XL.d['bank'] 					= { 0:'Bank',				1:'Banque',			2:'Bank',				3:'Bank',			4:'Bankwesen',		5:'Banca',			6:'Banco', 			7:'Banca'		};
C_XL.d['fiscal'] 				= { 0:'Fiscal',				1:'Fiscal',			2:'Fiskalny',			3:'Fiscale',		4:'Steuern',		5:'Fiscale',		6:'Fiscal', 		7:'Fiscal'		};
C_XL.d['accounting'] 			= { 0:'accounting',			1:'Comptabilité',	2:'Rachunkowości',		3:'accounting',		4:'Buchhaltung',	5:'Contabilità',	6:'Contabilidad', 	7:'Contabilidade'	};

C_XL.d['building'] 				= { 0:'Building',			1:'Construction',	2:'Budowa',				3:'Gebouw',			4:'Bau',			5:'Costruzione',		6:'Construcción', 	7:'Construção'		};
C_XL.d['structural'] 			= { 0:'Structural work',	1:'Gros oeuvre',	2:'Roboty budowlane',	3:'Ruwbouw',		4:'Rohbauarbeiten',	5:'Lavori strutturali',	6:'Obras gruesas', 	7:'Grandes obras'	};
C_XL.d['completion'] 			= { 0:'Completion',			1:'Parachèvement',	2:'Ukończenie',			3:'Voltooiing',		4:'Fertigstellung',	5:'Finiture',			6:'Finalización', 	7:'acabamentos'		};
C_XL.d['heating'] 				= { 0:'Heating',			1:'Chauffage',		2:'Ogrzewanie',			3:'Verwarming',		4:'Heizung',		5:'Riscaldamento',		6:'Calefacción', 	7:'aquecimento'		};
C_XL.d['electricity'] 			= { 0:'Electricity',		1:'Electricité',	2:'Elektryczność',		3:'Elektriciteit',	4:'Strom',			5:'Elettricità',		6:'Electricidad', 	7:'Eletricidade'	};


	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//		                      S M A R T     A P P     S P E C I F I C             smartapp
	// 


C_XL.d['I am new to Mobminder'] = { 0:'I am new to Mobminder', // in the current day OR in the current week
									1:'je suis nouveau sur Mobminder',	
									2:'jestem nowy w Mobminder',
									3:'ik ben nieuw bij Mobminder',		
									4:'Ich bin neu bei Mobminder',	
									5:'sono nuovo di Mobminder',	
									6:'Soy nuevo en Mobminder',
									7:'sou novo no Mobminder'	};
								

	// option to be chosen under / left drawer

C_XL.d['smappmenu notifications'] = C_XL.d['notifications']; 
C_XL.d['smappmenu display options'] = C_XL.d['display options'];


	// option to be chosen under / left drawer / notifications

C_XL.d['smappmenu chats'] = C_XL.d['chats'];
C_XL.d['smappmenu agenda'] = C_XL.d['agenda'];

C_XL.d['smappmenu notif none'] = C_XL.d['no notification'];			// option to be chosen under / left drawer / notifications / agenda  or  / chats

C_XL.d['smappmenu notif in day'] = { 0:'changes in the current day', 		// option to be chosen under / left drawer / notifications / agenda
								1:'modifications dans le jour courant',	
								2:'zmiany w bieżącym dniu',		
								3:'veranderingen in de huidige dag',		
								4:'Änderungen am aktuellen Tag',	
								5:'cambiamenti nel giorno corrente',	
								6:'cambios en el día actual',
								7:'mudanças no dia atual'	};	
								
C_XL.d['smappmenu notif in week'] = { 0:'changes in the current week', 		// option to be chosen under / left drawer / notifications / agenda
								1:'modifications dans la semaine courante',	
								2:'zmiany w bieżącym tygodniu',		
								3:'veranderingen in de huidige week',		
								4:'Änderungen in der aktuellen Woche',	
								5:'cambiamenti nella settimana corrente',	
								6:'cambios en la semana actual',
								7:'mudanças na semana atual'	};	


// 		technical 				english:0,					french:1,					polish:2,					dutch:3,					german:4,				italian:5,						spanish:6,				portuguese:7
	
C_XL.d['chnlname apptm']	= C_XL.d['appointments'];
C_XL.d['chnlname chats']	= C_XL.d['chats'];
	
C_XL.d['chnldesc apptm']	= { 0:'changes in your agenda',	1:'changements dans votre agenda',	2:'zmiany w Twoim programie',	3:'veranderingen in uw agenda',	4:'Änderungen in Ihrer Agenda',	5:'cambiamenti nella tua agenda',	6:'cambios en tu agenda', 		7:'mudanças na sua agenda'		};
C_XL.d['chnldesc chats']	= { 0:'new chat messages',		1:'nouveaux messages chat',			2:'nowe wiadomości na czacie',	3:'nieuwe chat berichten',		4:'neue Chat-Nachrichten',		5:'nuovi messaggi di chat',			6:'nuevos mensajes de chat', 	7:'novas mensagens de chat'		};
	
	
				// use with C_XL.d['current day']
				// 			C_XL.d['current week']

C_XL.d['manychanges apptm'] = { 0:'many changes appeared', // in the current day OR in the current week
								1:'plusieurs changement sont apparus',	
								2:'pojawiło się zmian',		
								3:'er zijn veranderingen opgetreden',		
								4:'Änderungen erschienen',	
								5:'apparvero molti cambiamenti',	
								6:'aparecieron cambios',
								7:'mudanças apareceram'	};	
		
	// notification of a change in the same day
		
		
	// 	[ technical name ] 		// english:0,				
	//							// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7
								
C_XL.d['notif same day app added'] = { 0:'an appointment was added at {0}', 	// 16:30  <= time format to use
								1:'un rendez-vous a été ajouté à {0}',	
								2:'termin został dodany o godzinie {0}',		
								3:'een afspraak werd toegevoegd om {0}',		
								4:'Ein Termin wurde um {0} hinzugefügt',	
								5:'è stato aggiunto un appuntamento alle {0}',	
								6:'se agregó una cita a las {0}',
								7:'um compromisso foi adicionado às {0}'	};
								
C_XL.d['notif same day app cancelled'] = { 0:'the {0} appointment has been canceled', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été annulé',	
								2:'spotkanie o godzinie {0} zostało odwołane',		
								3:'de afspraak van {0} is geannuleerd',		
								4:'Der Termin um {0} wurde abgesagt',	
								5:'l\'appuntamento delle {0} è stato annullato',	
								6:'la cita de las {0} ha sido cancelada',
								7:'o compromisso das {0} foi cancelado'	};
								
C_XL.d['notif same day app changed'] = { 0:'the {0} appointment has been modified', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été modifié',	
								2:'spotkanie {0} zostało zmienione',		
								3:'de afspraak van {0} is gewijzigd',		
								4:'Der Termin um {0} wurde geändert',	
								5:'l\'appuntamento delle {0} è stata modificata',	
								6:'la cita de las {0} ha sido cambiada',
								7:'a compromisso das {0} foi alterada'	};
								
C_XL.d['notif same day app postponed'] = { 0:'the {0} appointment has been postponed', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été postposé',	
								2:'spotkanie o godzinie {0} zostało przełożone',		
								3:'de afspraak van {0} is uitgesteld',		
								4:'Der Termin um {0} wurde verschoben',	
								5:'l\'appuntamento delle {0} è stato rinviato',	
								6:'la reunión de las {0} ha sido pospuesta',
								7:'a compromisso das {0} foi adiada'	};
	
	
								
C_XL.d['notif same day app moved'] = { 0:'the {0} appointment has been moved', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été déplacé',	
								2:'spotkanie o 15:00 zostało przeniesione',		
								3:'de afspraak van {0} is verplaatst',		
								4:'Der Termin um {0} wurde verschoben',	
								5:'l\'appuntamento delle {0} è stata spostata',	
								6:'la cita de las {0} se ha movido',
								7:'{0} compromisso foi movido'	};
								


	// notification of a change not in the current day
	
	// 	[ technical name ] 		// english:0,				
	//							// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7

								
C_XL.d['notif diff day app added'] = { 0:'an appointment was added next {1} at {0}', 	// {0} si the time, 16:30  <= time format to use
								1:'un rendez-vous a été ajouté le {1} à {0}',			// {1} is the weekday, 16:30  <= time format to use
								2:'termin został dodany w {1} o {0}',		
								3:'er is een afspraak toegevoegd op {1} om {0}',		
								4:'Ein Termin wurde am {1} um {0} Uhr hinzugefügt.',	
								5:'è stato aggiunto un appuntamento {1} alle ore {0}',	
								6:'Se agregó una cita el {1} a las {0}.',
								7:'um compromisso foi adicionado no {1} às {0}.'	};
								
C_XL.d['notif diff day app cancelled'] = { 0:'the appointment on {1} at {0} has been canceled', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été annulé',	
								2:'wizyta w {1} godz. {0} została odwołana',		
								3:'de afspraak van {1} om {0} is geannuleerd',		
								4:'Das Termin am {1} um {0} wurde abgesagt',	
								5:'l\'appuntamento di {1} alle {0} è stato annullato',	
								6:'la cita del {1} a las {0} ha sido cancelada',
								7:'o compromisso de {1} às {0} foi cancelado'	};
								
C_XL.d['notif diff day app changed'] = { 0:'the appointment on {1} at {0} has been modified', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été modifié',	
								2:'termin na {1} godz. {0} został zmieniony',		
								3:'de afspraak van {1} om {0} is gewijzigd',		
								4:'Das Termin am {1} um {0} wurde geändert',	
								5:'l\'appuntamento di {1} alle {0} è stato modificato',	
								6:'Se ha modificado la cita del {1} a las {0}.',
								7:'a compromisso de {1} às {0} foi alterado'	};
								
C_XL.d['notif diff day app postponed'] = { 0:'the appointment originaly on {1} at {0} has been postponed', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été postposé',	
								2:'termin na {1} godz. {0} został przełożony',		
								3:'de afspraak van {1} om {0} is uitgesteld',		
								4:'Das Termin am {1} um {0} wurde verschoben',	
								5:'l\'appuntamento di {1} alle {0} è stato rinviato',	
								6:'la del {1} a las {0} ha sido pospuesta',
								7:'a compromisso de {1} às {0} foi adiada'	};
								
C_XL.d['notif diff day app moved'] = { 0:'the appointment on {1} at {0} has been moved', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été déplacé',	
								2:'termin na {1} godz. {0} został przesunięty',		
								3:'de afspraak van {1} om {0} is verplaatst',		
								4:'Das Termin am {1} um {0} wurde verschoben',	
								5:'l\'appuntamento di {1} alle {0} è stata spostata',	
								6:'Se ha trasladado la cita del {1} a las {0}',
								7:'o compromisso de {1} às {0} foi movida'	};								
								
		

		





	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//

C_XL.setContextLanguage = function() {

	if(vbs) vlog('language.js','C_XL','setContextLanguage',''); 
	
	// treat jargon variants for visitors
	switch(mobminder.account.visitorAlias) {  // see (*xl01*)
		case mobminder.visitor.codes.patient:
			C_XL.d['new visitor'] 	= { 0:'New patient',			1:'Nouveau patient',		2:'Nowy pacjent',				3:'Nieuwe patiënt',				4:'Neuer Patient',				5:'Nuovo paziente',					6:'Nuevo paciente', 				7:'Novo paciente'	};
			C_XL.d['visitor'] 		= { 0:'patient',				1:'patient',				2:'pacjent',					3:'patiënt',					4:'patient',					5:'paziente',						6:'paciente', 						7:'paciente'	};
			C_XL.d['no visitor'] 	= { 0:'no patient',				1:'aucun patient',			2:'żaden pacjent',				3:'geen patiënt',				4:'Kein Patient',				5:'nessun paziente',				6:'ningún paciente', 				7:'nenhum paciente'	};
			C_XL.d['no other visitor'] 	= { 0:'no other patient',	1:'pas d\'autre patient',	2:'żaden inny pacjent',			3:'geen andere patiënt',		4:'Keine weiteren Patienten',	5:'nessun altro paziente',			6:'ningún otro paciente', 			7:'nenhum outro paciente'	};
			C_XL.d['visitors'] 		= { 0:'patients',				1:'patients',				2:'pacjentów',					3:'patiënten',					4:'patienten',					5:'pazienti',						6:'pacientes', 						7:'pacientes'	};
			C_XL.d['many visitors'] = { 0:'Several patients',		1:'Plusieurs patients',		2:'Kilku pacjentów',			3:'Meerdere patiënten',			4:'Mehrere Patienten',			5:'Vari pazienti',					6:'varios pacientes', 				7:'Vários pacientes'	};
			C_XL.d['visitor name'] 	= { 0:'Patient name',			1:'Nom du patient',			2:'Imię i nazwisko pacjenta',	3:'Patiënt naam',				4:'Patientname',				5:'Nome del paziente',				6:'Nombre del paciente', 			7:'Nome do paciente'	};
			C_XL.d['visitor note'] 	= { 0:'Patient note',			1:'Note patient',			2:'Uwaga pacjenta',				3:'Patiënt nota',				4:'Patientennotiz',				5:'Nota paziente',					6:'Nota paciente', 					7:'Nota do paciente'	};
			C_XL.d['visitor birth'] = { 0:'Patient date of birth',	1:'Naissance patient',		2:'Data urodzenia pacjenta',	3:'Patiënt geboortedatum',		4:'Patienten Geburtsdatum',		5:'Data di nascita paziente',		6:'Fecha de nacimiento paciente', 	7:'Data de nascimento do paciente'	};
			C_XL.d['visitor info'] 	= { 0:'Patient Information',	1:'Information Patient',	2:'Dane pacjenta',				3:'Patiënt gegevens',			4:'Patienteninformationen',		5:'Informazione paziente',			6:'Datos paciente', 				7:'Dados do paciente'	};
			C_XL.d['visitors register'] = { 0:'Patients Registry',	1:'Registre des patients',	2:'Rejestru pacjenta',			3:'Patiëntenregister',			4:'Patientenverzeichnis',		5:'Registro dei pazienti',			6:'Registro de los pacientes', 		7:'Registo do paciente'	};
			C_XL.d['copy from visitor'] = { 0:'Copy from another patient', 
											1:'Copier depuis un autre patient',	
											2:'Skopiować z innego pacjenta',		
											3:'Kopiëren van een andere patiënt',		
											4:'Von einem anderen Patienten kopieren',	
											5:'Copiare da un altro paziente',	
											6:'Copiar de otro paciente', 7:'Copiar de outro paciente'	};
			break;
		case mobminder.visitor.codes.client:
			C_XL.d['new visitor'] 	= { 0:'New Client',				1:'Nouveau Client',		2:'Nowy Klient',			3:'Nieuwe klant',		4:'Neuer Kunde',			5:'Nuovo cliente',			6:'Nuevo cliente', 					7:'Novo cliente'	};
			C_XL.d['visitor'] 		= { 0:'client',					1:'client',				2:'klient',					3:'klant',				4:'kunde',					5:'cliente',				6:'cliente', 						7:'cliente'	};
			C_XL.d['no visitor'] 	= { 0:'no client',				1:'aucun client',		2:'żaden klient',			3:'geen klant',			4:'Kein Kunde',				5:'nessun cliente',			6:'ningún cliente', 				7:'nenhum cliente'	};
			C_XL.d['no other visitor'] 	= { 0:'no other client',	1:'pas d\'autre client',2:'żaden inny klient',		3:'geen andere klant',	4:'Keine weiteren Kunden',	5:'nessun altro cliente',	6:'ningún otro cliente', 			7:'nenhum outro cliente'	};
			C_XL.d['visitors'] 		= { 0:'clients',				1:'clients',			2:'klienci',				3:'klanten',			4:'kunden',					5:'clienti',				6:'clientes', 						7:'clientes'	};
			C_XL.d['many visitors'] = { 0:'Several clients',		1:'Plusieurs clients',	2:'Kilku klientów',			3:'Meerdere klanten',	4:'Mehrere Kunden',			5:'Vari clienti',			6:'Varios clientes', 				7:'Vários clientes'	};
			C_XL.d['visitor name'] 	= { 0:'Client name',			1:'Nom du client',		2:'Nazwa klienta',			3:'Klant naam',			4:'Kundenname',				5:'Nome del cliente',		6:'Nombre del cliente', 			7:'Nome do cliente'	};
			C_XL.d['visitor note'] 	= { 0:'Client note',			1:'Note client',		2:'Uwaga klienta',			3:'Klant nota',			4:'Kundennotiz',			5:'Nota cliente',			6:'Nota cliente', 					7:'Nota do cliente'	};
			C_XL.d['visitor birth'] = { 0:'Client date of birth',	1:'Naissance client',	2:'Data urodzenia klienta',	3:'Klant geboortedatum',4:'Kunden Geburtsdatum',	5:'Data di nascita cliente',6:'Fecha de nacimiento cliente', 	7:'Data de nascimento do cliente'	};
			C_XL.d['visitor info'] 	= { 0:'Client Information',		1:'Information Client',	2:'Dane klienta',			3:'Klant gegevens',		4:'Kundeninformationen',	5:'Informazione cliente',	6:'Datos cliente', 					7:'Dados do cliente'	};
			C_XL.d['visitors register'] = { 0:'Clients Registry',	1:'Registre clients',	2:'Rejestru klientów',		3:'Klantenregister',	4:'Kundenverzeichnis',		5:'Registro dei clienti',	6:'Registro de los clientes', 		7:'Registo do cliente'	};
			C_XL.d['copy from visitor'] = { 0:'Copy from another client',	
											1:'Copier depuis un autre client',	
											2:'Skopiować z innego klienta',		
											3:'Kopiëren van een andere klant',	
											4:'Von einem anderen Kunden kopieren',	
											5:'Copiare da un altro cliente',	
											6:'Copiar de otro cliente', 7:'Copiar de outro cliente'	};
			break;
		case mobminder.visitor.codes.participant:
			C_XL.d['new visitor'] 	= { 0:'New participant',			1:'Nouveau participant',	2:'Nowy uczestnik',			3:'Nieuwe deelnemer',			4:'Neuer Teilnehmer',			5:'Nuovo partecipante',				6:'Nuevo participante', 				7:'Novo participante'	};
			C_XL.d['visitor'] 		= { 0:'participant',				1:'participant',			2:'uczestnik',				3:'deelnemer',					4:'teilnehmer',					5:'partecipante',					6:'participante', 						7:'participante'	};
			C_XL.d['no visitor'] 	= { 0:'no participant',				1:'aucun participant',		2:'żaden uczestnik',		3:'geen deelnemer',				4:'Kein Teilnehmer',			5:'nessun partecipante',			6:'ningún participante', 				7:'nenhum participante'	};
			C_XL.d['no other visitor'] 	= { 0:'no other participant',	1:'pas d\'autre participant',2:'żaden inny uczestnik',	3:'geen andere deelnemer',		4:'Keine weiteren Teilnehmer',	5:'nessun altro partecipante',		6:'ningún otro participante', 			7:'nenhum outro participante'	};
			C_XL.d['visitors'] 		= { 0:'participants',				1:'participants',			2:'uczestnicy',				3:'deelnemers',					4:'teilnehmer',					5:'partecipanti',					6:'participantes', 						7:'participantes'	};
			C_XL.d['many visitors'] = { 0:'Several participants',		1:'Plusieurs participants',	2:'Kilku uczestników',		3:'Meerdere deelnemers',		4:'Mehrere Teilnehmer',			5:'Vari partecipanti',				6:'Varios participantes', 				7:'Vários participantes'	};
			C_XL.d['visitor name'] 	= { 0:'Participant\'s name',		1:'Nom du participant',		2:'Nazwa Uczestnik',		3:'Deelnemer naam',				4:'Teilnehmername',				5:'Nome del partecipante',			6:'Nombre participante', 				7:'Nome do participante'	};
			C_XL.d['visitor note'] 	= { 0:'Participant note',			1:'Note participant',		2:'Uwaga uczestnik',		3:'Deelnemer nota',				4:'Teilnehmernotiz',			5:'Nota partecipante',				6:'Nota participante', 					7:'Nota do participante'	};
			C_XL.d['visitor birth'] = { 0:'Participant date of birth',	1:'Naissance participant',		2:'Uczestnik urodzenie',3:'Deelnemer geboortedatum',	4:'Teilnehmer Geburtsdatum',	5:'Data di nascita partecipante',	6:'Fecha de nacimiento participante', 	7:'Data de nascimento do participante'	};
			C_XL.d['visitor info'] 	= { 0:'Participant Information',	1:'Information Participant',2:'Informacje uczestnika',	3:'Deelnemer gegevens',			4:'Teilnehmerinformationen',	5:'Informazione partecipante',		6:'Datos participante', 				7:'Dados do participante'	};
			C_XL.d['visitors register'] = { 0:'Participants Registry',	1:'Registre participants',	2:'Rejestru uczestników',	3:'Deelnemersregister',			4:'Teilnehmerverzeichnis',		5:'Registro dei partecipanti',		6:'Registro participantes', 			7:'Registo dos participantes'	};
			
			C_XL.d['copy from visitor'] = { 0:'Copy from another participant',	
											1:'Copier depuis un autre participant',	
											2:'Skopiować z innego uczestnika',		
											3:'Kopiëren van een andere deelnemer',			
											4:'Von anderem Teilnehmer kopieren',	
											5:'Copiare da un altro partecipante',	
											6:'Copiar de otro participante', 7:'Copiar de outro participante'	};
			break;
	}
	
	// set time slicing expressions
	var oneSlice = (mobminder.account.secondsPerSlice / 60)|0; // number of minutes in one slice (for the timing contextual menu)
	var twoSlices = (oneSlice * 2)|0;
	var threeSlices = (oneSlice * 3)|0;
	
	C_XL.d['1 slice mn'] = { 0:oneSlice+' minutes',			1:oneSlice+' minutes',		2:oneSlice+' minut',	3:oneSlice+' minuten',		4:oneSlice+' minuten',			5:oneSlice+' minuti',		6:oneSlice+' minutos',		7:oneSlice+' minutos'	};
	C_XL.d['2 slice mn'] = { 0:twoSlices+' minutes',		1:twoSlices+' minutes',		2:twoSlices+' minut',	3:twoSlices+' minuten',		4:twoSlices+' minuten',			5:twoSlices+' minuti',		6:twoSlices+' minutos',		7:twoSlices+' minutos'	};
	C_XL.d['3 slice mn'] = { 0:threeSlices+' minutes',		1:threeSlices+' minutes',	2:threeSlices+' minut',	3:threeSlices+' minuten',	4:threeSlices+' minuten',		5:threeSlices+' minuti',	6:threeSlices+' minutos',	7:threeSlices+' minutos'	};
	
	C_XL.d[class_visitor] = C_XL.d['visitors'];
	
	var s = new Array();
	
		s[agClass.bCal] = mobminder.account.bCalsName; // resource name integer code, defined here (*d01*)
		s[agClass.uCal] = mobminder.account.uCalsName; 
		s[agClass.fCal] = mobminder.account.fCalsName;
		
	for(let c in s) {
		
		switch(s[c]) {
			case C_dS_resource.names.resources		: C_XL.d[c] = C_XL.d['resources']; 		C_XL.d['single'+c] = C_XL.d['resource']; 	break;   // !! No tranlsation here
			case C_dS_resource.names.workrooms		: C_XL.d[c] = C_XL.d['workrooms']; 		C_XL.d['single'+c] = C_XL.d['workroom'];	break;
			case C_dS_resource.names.workplaces		: C_XL.d[c] = C_XL.d['workplaces']; 	C_XL.d['single'+c] = C_XL.d['workplace'];	break;
			case C_dS_resource.names.classrooms		: C_XL.d[c] = C_XL.d['classrooms']; 	C_XL.d['single'+c] = C_XL.d['classroom'];	break;
			case C_dS_resource.names.carerooms		: C_XL.d[c] = C_XL.d['carerooms']; 		C_XL.d['single'+c] = C_XL.d['careroom'];	break;
			
			case C_dS_resource.names.collaborators	: C_XL.d[c] = C_XL.d['collaborators']; 	C_XL.d['single'+c] = C_XL.d['collaborator'];break;
			case C_dS_resource.names.assistants		: C_XL.d[c] = C_XL.d['assistants']; 	C_XL.d['single'+c] = C_XL.d['assistant'];	break;
			case C_dS_resource.names.doctors		: C_XL.d[c] = C_XL.d['doctors']; 		C_XL.d['single'+c] = C_XL.d['doctor'];		break;
			case C_dS_resource.names.practitioners	: C_XL.d[c] = C_XL.d['practitioners']; 	C_XL.d['single'+c] = C_XL.d['practitioner'];break;
			case C_dS_resource.names.technicians	: C_XL.d[c] = C_XL.d['technicians']; 	C_XL.d['single'+c] = C_XL.d['technician'];	break;
			case C_dS_resource.names.consultants	: C_XL.d[c] = C_XL.d['consultants']; 	C_XL.d['single'+c] = C_XL.d['consultant'];	break;
			case C_dS_resource.names.instructors	: C_XL.d[c] = C_XL.d['instructors']; 	C_XL.d['single'+c] = C_XL.d['instructor'];	break;
			case C_dS_resource.names.experts		: C_XL.d[c] = C_XL.d['experts']; 		C_XL.d['single'+c] = C_XL.d['expert'];		break;
			
			case C_dS_resource.names.dentists		: C_XL.d[c] = C_XL.d['dentists']; 		C_XL.d['single'+c] = C_XL.d['dentist'];		break;
			case C_dS_resource.names.salesmen		: C_XL.d[c] = C_XL.d['salesmen']; 		C_XL.d['single'+c] = C_XL.d['salesman'];	break; // (*d01*)
			case C_dS_resource.names.teachers		: C_XL.d[c] = C_XL.d['teachers']; 		C_XL.d['single'+c] = C_XL.d['teacher'];		break;
			
			case C_dS_resource.names.equipments		: C_XL.d[c] = C_XL.d['equipments']; 	C_XL.d['single'+c] = C_XL.d['equipment'];	break;
			case C_dS_resource.names.offices		: C_XL.d[c] = C_XL.d['offices']; 		C_XL.d['single'+c] = C_XL.d['office'];		break;
			case C_dS_resource.names.companies		: C_XL.d[c] = C_XL.d['companies']; 		C_XL.d['single'+c] = C_XL.d['company'];		break;
			case C_dS_resource.names.tools			: C_XL.d[c] = C_XL.d['tools']; 			C_XL.d['single'+c] = C_XL.d['tool'];		break;
			case C_dS_resource.names.cars			: C_XL.d[c] = C_XL.d['cars']; 			C_XL.d['single'+c] = C_XL.d['car'];			break;
			case C_dS_resource.names.vehicules		: C_XL.d[c] = C_XL.d['vehicules']; 		C_XL.d['single'+c] = C_XL.d['vehicule'];	break;
			
			default: console.log('disappointing, we found no match :(');
		}
	}
	C_XL.d['{att_bcal}'] = C_XL.d[class_bCal]; // check  (*T01*) // !! No tranlsation here
	C_XL.d['{att_ucal}'] = C_XL.d[class_uCal];
	C_XL.d['{att_fcal}'] = C_XL.d[class_fCal];
	C_XL.d['{participants}'] = C_XL.d['visitors'];
	
	C_XL.gender.codes[gendercode.female] = 'female';	// !! No tranlsation here
	C_XL.gender.codes[gendercode.male] 	= 'male';
	C_XL.gender.codes[gendercode.sa] 	= 'sa';
	C_XL.gender.codes[gendercode.sprl] 	= 'sprl';
	C_XL.gender.codes[gendercode.miss] 	= 'miss';
	C_XL.gender.codes[gendercode.boy] 	= 'boy';
	C_XL.gender.codes[gendercode.girl] 	= 'girl';
	return; 
}


// ---------------------------- !! No translation below this line ----------------------------

	// notes

C_XL.d['notes-creator'] = C_XL.d['notes-abr-creator'] 	= C_XL.d['creator']; 		// !! No translation on these lines
C_XL.d['notes-created'] = C_XL.d['notes-abr-created'] 	= C_XL.d['created on'];
C_XL.d['notes-title'] 	= C_XL.d['notes-abr-title'] 	= C_XL.d['title'];
C_XL.d['notes-note'] 	= C_XL.d['notes-abr-note'] 		= C_XL.d['note'];
C_XL.d['notes-ccss'] 	= C_XL.d['notes-abr-ccss'] 		= C_XL.d['visi-abr-ccss'];
C_XL.d['notes-midnIn'] 	= C_XL.d['notes-abr-midnIn'] 	= C_XL.d['fromdate'];
C_XL.d['notes-midnOut'] = C_XL.d['notes-abr-midnOut'] 	= C_XL.d['todate'];

C_XL.d['tasks-creator'] = C_XL.d['tasks-abr-creator'] 	= C_XL.d['creator'];
C_XL.d['tasks-created'] = C_XL.d['tasks-abr-created'] 	= C_XL.d['created on'];
C_XL.d['tasks-title'] 	= C_XL.d['tasks-abr-title'] 	= C_XL.d['title'];
C_XL.d['tasks-description'] = C_XL.d['tasks-abr-description'] = C_XL.d['description'];
C_XL.d['tasks-ccss'] 	= C_XL.d['tasks-abr-ccss'] 		= C_XL.d['visi-abr-ccss'];
C_XL.d['tasks-midnIn'] 	= C_XL.d['tasks-abr-midnIn'] 	= C_XL.d['fromdate'];

C_XL.d['chats-creator'] = C_XL.d['chats-abr-creator'] = C_XL.d['creator'];
C_XL.d['chats-created'] = C_XL.d['chats-abr-created'] = C_XL.d['created on'];
C_XL.d['chats-title'] 	= C_XL.d['chats-abr-title'] 	= C_XL.d['title'];
C_XL.d['chats-note'] 	= C_XL.d['chats-abr-note'] 	= C_XL.d['note'];
C_XL.d['chats-ccss'] 	= C_XL.d['chats-abr-ccss'] 	= C_XL.d['visi-abr-ccss'];
C_XL.d['chats-id'] 		= C_XL.d['chats-abr-id'] 	= C_XL.d['visi-abr-id'];

C_XL.d['files-creator'] = C_XL.d['files-abr-creator'] = C_XL.d['creator'];
C_XL.d['files-created'] = C_XL.d['files-abr-created'] = C_XL.d['created on'];
C_XL.d['files-name'] 	= C_XL.d['files-abr-name'] 	= C_XL.d['name'];
C_XL.d['files-note'] 	= C_XL.d['files-abr-note'] 	= C_XL.d['note'];
C_XL.d['files-ccss'] 	= C_XL.d['files-abr-ccss'] 	= C_XL.d['visi-abr-ccss'];


C_XL.d['a1'] = { 0:'▲',	1:'▲',	2:'▲',	3:'▲',	4:'▲',	5:'▲',	6:'▲',	7:'▲',	8:'▲',	9:'▲'	}; // !! No translation below this line
C_XL.d['a2'] = { 0:'►',	1:'►',	2:'►',	3:'►',	4:'►',	5:'►',	6:'►',	7:'►',	8:'►',	9:'►'	};
C_XL.d['a3'] = { 0:'▼',	1:'▼',	2:'▼',	3:'▼',	4:'▼',	5:'▼',	6:'▼',	7:'▼',	8:'▼',	9:'▼'	};
C_XL.d['a4'] = { 0:'◄',	1:'◄',	2:'◄',	3:'◄',	4:'◄',	5:'◄',	6:'◄',	7:'◄',	8:'◄',	9:'◄'	};
C_XL.d['b2'] = { 0:'•',	1:'•',	2:'•',	3:'•',	4:'•',	5:'•',	6:'•',	7:'•',	8:'•',	9:'•'	};
C_XL.d['b3'] = { 0:'◊',	1:'◊',	2:'◊',	3:'◊',	4:'◊',	5:'◊',	6:'◊',	7:'◊',	8:'◊',	9:'◊'	};
C_XL.d['b4'] = { 0:'→',	1:'→',	2:'→',	3:'→',	4:'→',	5:'→',	6:'→',	7:'→',	8:'→',	9:'→'	};

C_XL.d['m1'] = { 0:'♂',	1:'♂',	2:'♂',	3:'♂',	4:'♂',	5:'♂',	6:'♂',	7:'♂',	8:'♂',	9:'♂'	};
C_XL.d['f0'] = { 0:'♀',	1:'♀',	2:'♀',	3:'♀',	4:'♀',	5:'♀',	6:'♀',	7:'♀',	8:'♀',	9:'♀'	};

C_XL.d['smiley-happy'] 		= { 0:'☺',	1:'☺',	2:'☺',	3:'☺',	4:'☺',	5:'☺',	6:'☺',	7:'☺',	8:'☺',	9:'☺'	};
C_XL.d['check mark'] 		= { 0:'✓',	1:'✓',	2:'✓',	3:'✓',	4:'✓',	5:'✓',	6:'✓',	7:'✓',	8:'✓',	9:'✓'	}; // may appear as a box in editor,	but appears fine on Browsers UTF-8 screens
C_XL.d['heavy check mark'] 	= { 0:'✔',	1:'✔',	2:'✔',	3:'✔',	4:'✔',	5:'✔',	6:'✔',	7:'✔',	8:'✔',	9:'✔'	}; // may appear as a box in editor,	but appears fine on Browsers UTF-8 screens
C_XL.d['radio dot'] 		= { 0:'●',	1:'●',	2:'●',	3:'●',	4:'●',	5:'●',	6:'●',	7:'●',	8:'●',	9:'●'	};
C_XL.d['cross checked'] 	= { 0:'✘',	1:'✘',	2:'✘',	3:'✘',	4:'✘',	5:'✘',	6:'✘',	7:'✘',	8:'✘',	9:'✘'	}; 

C_XL.d['bullet up'] 		= { 0:'▲',	1:'▲',	2:'▲',	3:'▲',	4:'▲',	5:'▲',	6:'▲',	7:'▲',	8:'▲',	9:'▲'	};
C_XL.d['bullet down'] 		= { 0:'▼',	1:'▼',	2:'▼',	3:'▼',	4:'▼',	5:'▼',	6:'▼',	7:'▼',	8:'▼',	9:'▼'	};

//2022-11-11 DEV/JBA - START

C_XL.d['note_payment'] = { 0:'Please type in a note if necessary. Your appointment will then be confirmed with the following payment.',
1:'Indiquez une note si nécessaire. Votre rendez-vous sera ensuite confirmé par le paiement.',
2:'W razie potrzeby proszę napisać notatkę. Termin spotkania zostanie następnie potwierdzony przez wpłatę',
3:'Eventuele vragen of opmerkingen kunt u hier melden. Uw afspraak wordt dan na betaling bevestigd.',
4:'Fragen oder Kommentare können hier gemeldet werden. Ihr Termin wird dann nach der Bezahlung bestätigt',
5:'Se necessario, inserire una nota. L\'appuntamento sarà poi confermato dal pagamento.',
6:'Introduzca una nota si es necesario. Su cita será confirmada después del pago.',
7:'Insira uma nota, se necessário. Seu agendamento será confirmado após o pagamento.'};



C_XL.d['confirm_payment'] = { 0:'Your appointment will be confirmed with the following payment.',
1:'Votre rendez-vous sera confirmé par le paiement.',
2:'Termin spotkania zostanie potwierdzony przez wpłatę',
3:'Uw afspraak wordt na betaling bevestigd.',
4:'Ihr Termin wird nach der Bezahlung bestätigt',
5:'L\'appuntamento sarà confermato dal pagamento.',
6:'Su cita será confirmada después del pago.',
7:'Seu agendamento será confirmado após o pagamento.'};





C_XL.d['scan_pay'] = { 0:'Scan and pay with the Payconiq application',
1:'Scannez et payez avec l\'application Payconiq',
2:'Zeskanuj i zapłać za pomocą aplikacji Payconiq',
3:'Scan en betaal met de Payconiq-applicatie',
4:'Scan und Bezahlung mit der Payconiq-Applikation',
5:'Scansione e pagamento con l\'applicazione Payconiq',
6:'Escanear y pagar con la aplicación Payconiq',
7:'Scan e pagamento com a aplicação Payconiq'};



C_XL.d['mobile_payment_processing'] = { 0:'Mobile payment on hold',
1:'Payement mobile en attente',
2:'Płatność mobilna zawieszona',
3:'Mobiel betalen in de wacht',
4:'Mobile Zahlung ausstehend',
5:'Pagamento mobile in attesa',
6:'El pago por móvil, en suspenso',
7:'Pagamento móvel em espera'};



C_XL.d['abandon'] = { 0:'Drop the payment',
1:'Abandonner le paiement',
2:'Odstąpić od płatności',
3:'Afzien van betaling',
4:'Zahlung aufgeben',
5:'Abbandonare il pagamento', 
6:'Abandonar el pago', 
7:'Abandonar o pagamento'};



C_XL.d['payment_cancelled'] = { 0:'The transaction has been cancelled',
1:'La transaction a été annulée',
2:'Transakcja została anulowana',
3:'De transactie is geannuleerd',
4:'Transaktion wurde abgebrochen',
5:'La transazione è stata annullata',
6:'La transacción fue cancelada',
7:'A transacção foi cancelada'};



C_XL.d['payconiq_payment'] = { 0:'Pay with Payconiq',
1:'Payer avec Payconiq',
2:'Płacenie z Payconiq',
3:'Met Payconiq Betalen',
4:'Mit Payconiq bezahlen',
5:'Pagare con Payconiq',
6:'Pagar con Payconiq',
7:'Pagar com Payconiq'};



C_XL.d['card_payment'] = { 0:'Pay with a card',
1:'Payer avec une carte',
2:'Płacenie kartą',
3:'Met een kaart Betalen',
4:'Mit einer Karte bezahlen',
5:'Pagamento con carta',
6:'Pagar con tarjeta',
7:'Pagamento por cartão'};

C_XL.d['Colordepth_problem_info'] = { 
	0:'To make a reservation with {0} you must pay a deposit. You need to switch to Safari or Firefox to make this payment.',
	1:'Pour réserver chez {0} vous devez verser un acompte. Vous devez passer sur Safari ou Firefox pour pouvoir réaliser ce paiement.',
	2:'Aby dokonać rezerwacji u {0} należy wpłacić zaliczkę. Aby dokonać tej płatności należy przełączyć się na Safari lub Firefox.',
	3:'Om te reserveren bij {0} moet u een aanbetaling doen. U moet naar Safari of Firefox overschakelen om deze betaling te doen.',
	4:'Um bei {0} zu buchen, müssen Sie eine Anzahlung leisten. Sie müssen auf Safari oder Firefox wechseln, um diese Zahlung durchführen zu können.',
	5:'Per effettuare una prenotazione con {0} è necessario pagare un deposito. Per effettuare il pagamento è necessario passare a Safari o Firefox.',
	6:'Para hacer una reserva con {0}, hay que pagar un depósito. Para realizar el pago, es necesario cambiar a Safari o Firefox.',
	7:'Para fazer uma reserva com {0}, deve ser pago um depósito. Para fazer o pagamento, é necessário mudar para Safari ou Firefox.' };
	


C_XL.d['earlier_dates'] = { 0:'previous dates',
1:'dates précédentes',
2:'poprzednie terminy',
3:'vorige data',
4:'bisherige Termine',
5:'date precedenti',
6:'fechas anteriores',
7:'datas anteriores'};



C_XL.d['warning_timezone'] = { 0:'Please note that the place of service is in a different time zone!',
1:'Attention, le lieu de prestation se situe sur un autre fuseau horaire!',
2:'Proszę zwrócić uwagę, że gabinet znajduje się w innej strefie czasowej!',
3:'Let op: de locatie bevindt zich in een andere tijdzone!',
4:'Bitte beachten Sie, dass sich der Standort in einer anderen Zeitzone befindet!',
5:'Si prega di notare che il sito si trova in un fuso orario diverso!',
6:'Tenga en cuenta que el sitio está en una zona horaria diferente !',
7:'Note por favor que o sítio está num fuso horário diferente!' };


//2024/03 payment 

C_XL.d['epay_cardholder'] = {
	0 : 'Cardholder',
	1 : 'Titulaire de la carte',
	2 : 'Posiadacz karty',
	3 : 'Kaarthouder',
	4 : 'Karteninhaber',
	5 : 'Titolare della carta',
	6 : 'Titular de la tarjeta',
	7 : 'Titular do cartão'
};

C_XL.d['epay_cardnumber'] = {
	0 : 'Card number',
	1 : 'Numéro de la carte',
	2 : 'Numer karty',
	3 : 'Kaartnummer',
	4 : 'Kartennummer',
	5 : 'Numero della carta',
	6 : 'Número de tarjeta',
	7 : 'Número do cartão'
};

C_XL.d['epay_mm'] = {
	0 : 'MM',
	1 : 'MM',
	2 : 'MM',
	3 : 'MM',
	4 : 'MM',
	5 : 'MM',
	6 : 'MM',
	7 : 'MM',
};

C_XL.d['epay_yyyy'] = {
	0 : 'YYYY',
	1 : 'AAAA',
	2 : 'RRRR',
	3 : 'JJJJ',
	4 : 'JJJJ',
	5 : 'AAAA',
	6 : 'AAAA',
	7 : '/AAAA',
};

C_XL.d['epay_validitydate'] = {
	0 : 'Validity date (month/year)',
	1 : 'Date de validité (mois/année)',
	2 : 'Data ważności (miesiąc/rok)',
	3 : 'Geldigheidsdatum (maand/jaar)',
	4 : 'Gültigkeitsdatum (Monat/Jahr)',
	5 : 'Data di validità (mese/anno)',
	6 : 'Fecha de validez (mes/año)',
	7 : 'Data de validade (mês/ano)'
	
};

/*C_XL.d['epay_securitycode'] = {
	0 : 'Security code (CVC)',
	1 : 'Code de sécurité (CVC)',
	2 : 'Kod zabezpieczający (CVC)',
	3 : 'Beveiligingscode (CVC)',
	4 : 'Sicherheitscode (CVC)',
	5 : 'Codice di sicurezza (CVC)',
	6 : 'Código de seguridad (CVC)',
	7 : 'Código de segurança (CVC)'
};*/

C_XL.d['epay_securitycode'] = {
	0 : 'CVC',
	1 : 'CVC',
	2 : 'CVC',
	3 : 'CVC',
	4 : 'CVC',
	5 : 'CVC',
	6 : 'CVC',
	7 : 'CVC',
};

C_XL.d['epay_pay'] = {
	0 : 'Pay',
	1 : 'Payer',
	2 : 'Płacić',
	3 : 'Betalen',
	4 : 'Bezahlen',
	5 : 'Pagare',
	6 : 'Pagar',
	7 : 'Pagar'
};

C_XL.d['epay_cancel'] = {
	0 : 'Cancel',
	1 : 'Annuler',
	2 : 'Anulować',
	3 : 'Annuleren',
	4 : 'Stornieren',
	5 : 'Annullare',
	6 : 'Cancelar',
	7 : 'Cancelar'
};

C_XL.d['epay_paydeposit'] = {
	0 : 'Please pay the deposit of {0}€',
	1 : 'Veuillez payer l’acompte de {0}€',
	2 : 'Proszę zapłacić zadatek w wysokości {0}€',
	3 : 'Gelieve de aanbetaling van {0}€ te betalen',
	4 : 'Bitte zahlen Sie die Anzahlung von {0}€',
	5 : 'Si prega di pagare l\'acconto di {0}€',
	6 : 'Por favor, pague el depósito de {0}€',
	7 : 'Por favor, pague o depósito de {0}€'
};

C_XL.d['epay_payamount'] = {

	0 : 'Please pay the amount of {0}€',
	1 : 'Veuillez payer la somme de {0}€',
	2 : 'Proszę zapłacić kwotę {0}€',
	3 : 'Gelieve het bedrag van {0}€ te betalen',
	4 : 'Bitte zahlen Sie den Betrag von {0}€',
	5 : 'Si prega di pagare l\'importo di {0}€',
	6 : 'Por favor, pague la cantidad de {0}€',
	7 : 'Por favor, pague o valor de {0}€'
};



C_XL.d['epay_paytoconfirm'] = {
	0 : 'Pay to confirm',
	1 : 'Payer pour confirmer',
	2 : 'Zapłać, aby potwierdzić',
	3 : 'Betalen om te bevestigen',
	4 : 'Bezahlen, um zu bestätigen',
	5 : 'Pagare per confermare',
	6 : 'Pagar para confirmar',
	7 : 'Pagar para confirmar'
};

C_XL.d['epay_selectmethod'] = {
	0 : 'Select your payment method',
	1 : 'Sélectionnez votre moyen de paiement',
	2 : 'Wybierz swój sposób płatności',
	3 : 'Selecteer uw betaalmethode',
	4 : 'Wählen Sie Ihre Zahlungsmethode',
	5 : 'Seleziona il tuo metodo di pagamento',
	6 : 'Seleccione su medio de pago',
	7 : 'Selecione o seu método de pagamento'
};

C_XL.d['epay_debitcreditcard'] = {
	0 : 'Debit or credit card',
	1 : 'Carte de débit ou de crédit',
	2 : 'Karta debetowa lub kredytowa',
	3 : 'Debitcard of creditcard',
	4 : 'Debitkarte oder Kreditkarte',
	5 : 'Carta di debito o di credito',
	6 : 'Tarjeta de débito o de crédito',
	7 : 'Cartão de débito ou de crédito'
};

C_XL.d['epay_blueprintbc'] = {
	0 : 'Your card displays this logo',
	1 : 'Votre carte affiche ce logo',
	2 : 'Twoja karta wyświetla ten logo',
	3 : 'Uw kaart toont dit logo',
	4 : 'Ihre Karte zeigt dieses Logo',
	5 : 'La tua carta mostra questo logo',
	6 : 'Tu tarjeta muestra este logo',
	7 : 'O seu cartão exibe este logotipo'
};

C_XL.d['epay_blueprintpayconiq'] = {
	0 : 'Payment using your Payconiq app',
	1 : 'Paiement à l\'aide de votre application Payconiq',
	2 : 'Płatność za pomocą aplikacji Payconiq',
	3 : 'Betaling met behulp van uw Payconiq-app',
	4 : 'Zahlung mit Ihrer Payconiq-App',
	5 : 'Pagamento tramite la tua app Payconiq',
	6 : 'Pago utilizando su aplicación Payconiq',
	7 : 'Pagamento usando seu aplicativo Payconiq'
	
};

C_XL.d['epay_blueprintmcvisa'] = {
	0 : 'Your credit or debit card displays this logo',
	1 : 'Votre carte de crédit ou de débit affiche ce logo',
	2 : 'Twoja karta kredytowa lub debetowa wyświetla ten logo',
	3 : 'Uw creditcard of debetkaart toont dit logo',
	4 : 'Ihre Kredit- oder Debitkarte zeigt dieses Logo',
	5 : 'La tua carta di credito o di debito mostra questo logo',
	6 : 'Su tarjeta de crédito o débito muestra este logo',
	7 : 'Seu cartão de crédito ou débito exibe este logotipo'
};


C_XL.d['epay_blueprintcvc'] = {
	0 : '3-digit code on the back of your card',
	1 : 'Code à 3 chiffres à l\'arrière de votre carte',
	2 : 'Trzycyfrowy kod na odwrocie Twojej karty',
	3 : '3-cijferige code op de achterkant van uw kaart',
	4 : '3-stelliger Code auf der Rückseite Ihrer Karte',
	5 : 'Codice a 3 cifre sul retro della tua carta',
	6 : 'Código de 3 dígitos en la parte posterior de su tarjeta',
	7 : 'Código de 3 dígitos na parte de trás do seu cartão'
};
	
	


//2022-11-11 DEV/JBA - END



// END OF FILE


