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
// © Copyright 2007-2027 - PASCAL VANHOVE -70.12.30-097.72 - Belgium


/* These are guidelines for AI translations :

Please remember our mission:
To each structure that I pass should be added an item 8: that is the translation of the message in Luxembourgish

Guidelines:
1. start always with clearing the output console.
2. preserve presentation and indentation of each js structure, case by case.
3. do not remove any comment.
4. do not add any comment, unless a similar comment exists on the previous translation ( // portuguese ).
5. when presentation is multi-line, add a new line in the structure for Luxembourgish.
6. you understnad and remember the context of these messages to deliver the most appropriate translation.

*/



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


mobminder.language = { // (*ml*)
	  codes: { english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7, luxembourgish:8 }
,	names: { 
		0:'english',	 // !! No tranlsation here
		1:'français',	
		2:'polski',	
		3:'nederlands',	
		4:'deutsch',	
		5:'italiano',	
		6:'español',	
		7:'português',
		8:'luxemburgesch'
	}
,	abr: { 
		0:'en',	 // !! No tranlsation here, those abreviations should match international standards, see (*is01*)
		1:'fr',	
		2:'pl',	
		3:'nl',	
		4:'de',	
		5:'it',	
		6:'es',	
		7:'pt',
		8:'lb'
	},
	xlation: {	
		0: { 0:'english',	1:'anglais',	2:'angielsku',		3:'Engels',		4:'Englisch',		5:'inglese',	6:'inglés',		7:'inglês',			8:'Englesch'},
		1: { 0:'french',	1:'français',	2:'francusku',		3:'Frans',		4:'französisch',	5:'francese',	6:'francés',	7:'francês',		8:'Franséisch'},
		2: { 0:'polish',	1:'polonais',	2:'polsku',			3:'Pools',		4:'polnisch',		5:'polacco',	6:'polaco',		7:'polonês',		8:'Polnesch'},
		3: { 0:'dutch',		1:'neerlandais',2:'holendersku',	3:'nederlands',	4:'niederländisch',	5:'olandese',	6:'holandés',	7:'holandês',		8:'Hollandesch'},
		4: { 0:'german',	1:'allemand',	2:'niemiecku',		3:'Duits',		4:'Deutsch',		5:'tedesco',	6:'alemán',		7:'alemão',			8:'Deitsch'},	
		5: { 0:'italian',	1:'italien',	2:'włosku',			3:'Italiaans',	4:'italienisch',	5:'italiano',	6:'italiano',	7:'italiano',		8:'Italienesch'},
		6: { 0:'spanish',	1:'espagnol',	2:'hiszpańsku',		3:'Spaans',		4:'Spanisch',		5:'spagnolo',	6:'español',	7:'espanhol',		8:'Spaanesch'},	
		7: { 0:'portuguese',1:'portuguais',	2:'portugalsku',	3:'Portugees',	4:'portugiesisch',	5:'portoghese',	6:'portugues',	7:'português',		8:'Portugisesch'},
		8: { 0:'luxembourgish',1:'luxembourgeois',2:'luxembourgeois',	3:'luxemburgs',	4:'luxemburgisch',	5:'luxemburghese',6:'luxemburgués',	7:'luxemburguês', 8:'Luxemburgesch'}
	},
	xl:function(language) { // (*ml01*)
		let labels = { 0:'', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:'' };
		for(let lc in mobminder.language.names) labels[lc] = mobminder.language.xlation[lc][language];
		return labels;
	}
}


mobminder.visitor = { // !! No tranlsation here
	codes: { client:100,	patient:200,	participant:150 } 	// !! No tranlsation here
,	names: { 100:'client',	200:'patient',	150:'participant'}
}

C_XL.d['english'] 			= mobminder.language.xlation[0]; // !! No tranlsation here
C_XL.d['french'] 			= mobminder.language.xlation[1];
C_XL.d['polish'] 			= mobminder.language.xlation[2];
C_XL.d['dutch'] 			= mobminder.language.xlation[3];
C_XL.d['german'] 			= mobminder.language.xlation[4];
C_XL.d['italian'] 			= mobminder.language.xlation[5];
C_XL.d['spanish'] 			= mobminder.language.xlation[6];
C_XL.d['portuguese'] 		= mobminder.language.xlation[7];
C_XL.d['luxembourgish'] 	= mobminder.language.xlation[8];


C_XL.d['useme']	= { 0:'',	// english
					1:'',	// french
					2:'',	// polish
					3:'',	// dutch
					4:'',	// german
					5:'',	// italian
					6:'', 	// spanish
					7:'',	// portuguese
					8:''	// luxembourgish
			};	



// handy empty structures to be copy/pasted

C_XL.d['empty string'] = { 0:'',	1:'',	2:'',	3:'',	4:'',	5:'',	6:'',	7:'',	8:'',	9:'',	10:''};



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   T R A N S L A T I O N    C L A S S 
//
// © Copyright 2007-2026 - PASCAL VANHOVE -70.12.30-097.72 - Belgium
//


C_XL.weekdays = {
	full: {											
'weekday1' : { 0:'monday', 1:'lundi', 2:'poniedziałek', 3:'maandag', 4:'Montag', 5:'lunedì', 6:'lunes', 7:'segunda-feira', 8:'Méindeg'},
'weekday2' : { 0:'tuesday', 1:'mardi', 2:'wtorek', 3:'dinsdag', 4:'Dienstag', 5:'martedì', 6:'martes', 7:'terça-feira', 8:'Dënschdeg'},
'weekday3' : { 0:'wednesday', 1:'mercredi', 2:'środa', 3:'woensdag', 4:'Mittwoch', 5:'mercoledì', 6:'miércoles', 7:'quarta-feira', 8:'Mëttwoch'},
'weekday4' : { 0:'thursday', 1:'jeudi', 2:'czwartek', 3:'donderdag', 4:'Donnerstag', 5:'giovedì', 6:'jueves', 7:'quinta-feira', 8:'Donneschdeg'},
'weekday5' : { 0:'friday', 1:'vendredi', 2:'piątek', 3:'vrijdag', 4:'Freitag', 5:'venerdì', 6:'viernes', 7:'sexta-feira', 8:'Freideg'},
'weekday6' : { 0:'saturday', 1:'samedi', 2:'sobota', 3:'zaterdag', 4:'Samstag', 5:'sabato', 6:'sábado', 7:'sábado', 8:'Samschdeg'},
'weekday7' : { 0:'sunday', 1:'dimanche', 2:'niedziela', 3:'zondag', 4:'Sonntag', 5:'domenica', 6:'domingo', 7:'domingo', 8:'Sonndeg'}
	},
	abr: {											
'weekday1' : { 0:'mon', 1:'lun', 2:'pn', 3:'maa', 4:'mon', 5:'lun', 6:'lun', 7:'seg', 8:'Méin'},
'weekday2' : { 0:'tue', 1:'mar', 2:'wt', 3:'din', 4:'die', 5:'mar', 6:'mar', 7:'ter', 8:'Dëns'},
'weekday3' : { 0:'wed', 1:'mer', 2:'śr', 3:'woe', 4:'mit', 5:'mer', 6:'mié', 7:'qua', 8:'Mëtt'},
'weekday4' : { 0:'thu', 1:'jeu', 2:'czw', 3:'don', 4:'don', 5:'gio', 6:'jue', 7:'qui', 8:'Donn'},
'weekday5' : { 0:'fri', 1:'ven', 2:'pt', 3:'vri', 4:'fre', 5:'ven', 6:'vie', 7:'sex', 8:'Fre'},
'weekday6' : { 0:'sat', 1:'sam', 2:'so', 3:'zat', 4:'sam', 5:'sab', 6:'sáb', 7:'sáb', 8:'Sams'},
'weekday7' : { 0:'sun', 1:'dim', 2:'nie', 3:'zon', 4:'son', 5:'dom', 6:'dom', 7:'dom', 8:'Sonn'}
	},
	min: {											
'weekday1' : { 0:'mo', 1:'lu', 2:'pn', 3:'ma', 4:'mo', 5:'lu', 6:'lu', 7:'se', 8:'Mé'},
'weekday2' : { 0:'tu', 1:'ma', 2:'wt', 3:'di', 4:'di', 5:'ma', 6:'ma', 7:'te', 8:'Dë'},
'weekday3' : { 0:'wd', 1:'me', 2:'śr', 3:'wo', 4:'mi', 5:'me', 6:'mi', 7:'qua', 8:'Më'},
'weekday4' : { 0:'th', 1:'je', 2:'cz', 3:'do', 4:'do', 5:'gi', 6:'ju', 7:'qui', 8:'Do'},
'weekday5' : { 0:'fr', 1:'ve', 2:'pt', 3:'vr', 4:'fr', 5:'ve', 6:'vi', 7:'sex', 8:'Fr'},
'weekday6' : { 0:'sa', 1:'sa', 2:'so', 3:'za', 4:'sa', 5:'sa', 6:'sá', 7:'sáb', 8:'Sa'},
'weekday7' : { 0:'su', 1:'di', 2:'n', 3:'zo', 4:'so', 5:'do', 6:'do', 7:'dom', 8:'So'}
	}
};

C_XL.months = {	
	full: {											
	'month1' : { 0:'january', 1:'janvier', 2:'styczeń', 3:'januari', 4:'januar', 5:'Gennaio', 6:'Enero', 7:'janeiro', 8:'Januar'},
	'month2' : { 0:'february', 1:'février', 2:'Luty', 3:'februari', 4:'februar', 5:'febbraio', 6:'febrero', 7:'fevereiro', 8:'Februar'},
	'month3' : { 0:'march', 1:'mars', 2:'marzec', 3:'maart', 4:'märz', 5:'marzo', 6:'marzo', 7:'março', 8:'Mäerz'},
	'month4' : { 0:'april', 1:'avril', 2:'Kwiecień', 3:'april', 4:'april', 5:'aprile', 6:'abril', 7:'abril', 8:'Abrëll'},
	'month5' : { 0:'may', 1:'mai', 2:'maj', 3:'mei', 4:'mai', 5:'maggio', 6:'mayo', 7:'maio', 8:'Mee'},
	'month6' : { 0:'june', 1:'juin', 2:'Czerwiec', 3:'juni', 4:'juni', 5:'Giugno', 6:'junio', 7:'junho', 8:'Juni'},
	'month7' : { 0:'july', 1:'juillet', 2:'Lipiec', 3:'juli', 4:'juli', 5:'Luglio', 6:'julio', 7:'julho', 8:'Juli'},
	'month8' : { 0:'august', 1:'août', 2:'sierpień', 3:'augustus', 4:'august', 5:'agosto', 6:'agosto', 7:'agosto', 8:'August'},
	'month9' : { 0:'september', 1:'septembre', 2:'Wrzesień', 3:'september', 4:'september', 5:'settembre', 6:'septiembre', 7:'setembro', 8:'September'},
	'month10': { 0:'october', 1:'octobre', 2:'Październik', 3:'oktober', 4:'oktober', 5:'ottobre', 6:'octubre', 7:'outubro', 8:'Oktober'},
	'month11': { 0:'november', 1:'novembre', 2:'Listopad', 3:'november', 4:'november', 5:'novembre', 6:'noviembre', 7:'novembro', 8:'November'},
	'month12': { 0:'december', 1:'décembre', 2:'Grudzień', 3:'december', 4:'dezember', 5:'dicembre', 6:'diciembre', 7:'dezembro', 8:'Dezember'} 
	},
	abr: {											
	'month1' : { 0:'jan', 1:'jan', 2:'sty', 3:'jan', 4:'jan', 5:'Gen', 6:'Ene', 7:'jan', 8:'Jan'},
	'month2' : { 0:'feb', 1:'fév', 2:'Lu', 3:'feb', 4:'feb', 5:'feb', 6:'feb', 7:'fev', 8:'Feb'},
	'month3' : { 0:'mar', 1:'mar', 2:'mar', 3:'mrt', 4:'mar', 5:'mar', 6:'mar', 7:'mar', 8:'Mär'},
	'month4' : { 0:'apr', 1:'avr', 2:'Kw', 3:'apr', 4:'apr', 5:'apr', 6:'abr', 7:'abr', 8:'Abr'},
	'month5' : { 0:'may', 1:'mai', 2:'maj', 3:'mei', 4:'mai', 5:'mag', 6:'may', 7:'mai', 8:'Mee'},
	'month6' : { 0:'jun', 1:'jun', 2:'Cze', 3:'jun', 4:'jun', 5:'Giu', 6:'jun', 7:'jun', 8:'Jun'},
	'month7' : { 0:'jul', 1:'jul', 2:'Lip', 3:'jul', 4:'jul', 5:'Lug', 6:'jul', 7:'jul', 8:'Jul'},
	'month8' : { 0:'aug', 1:'aoû', 2:'sie', 3:'aug', 4:'aug', 5:'ago', 6:'ago', 7:'ago', 8:'Aug'},
	'month9' : { 0:'sep', 1:'sep', 2:'Wrz', 3:'sep', 4:'sep', 5:'set', 6:'sep', 7:'set', 8:'Sep'},
	'month10': { 0:'oct', 1:'oct', 2:'Pa', 3:'okt', 4:'okt', 5:'ott', 6:'oct', 7:'out', 8:'Okt'},
	'month11': { 0:'nov', 1:'nov', 2:'Lis', 3:'nov', 4:'nov', 5:'nov', 6:'nov', 7:'nov', 8:'Nov'},
	'month12': { 0:'dec', 1:'déc', 2:'Gru', 3:'dec', 4:'dec', 5:'dic', 6:'dic', 7:'dez', 8:'Dez'}
	},
	min: {									
	'month1' : {	0:'/01/',	1:'/01/',	2:'/01/',	3:'/01/',	4:'/01/',	5:'/01/',	6:'/01/',	7:'/01/',	8:'/01/'},
	'month2' : {	0:'/02/',	1:'/02/',	2:'/02/',	3:'/02/',	4:'/02/',	5:'/02/',	6:'/02/',	7:'/02/',	8:'/02/'},
	'month3' : {	0:'/03/',	1:'/03/',	2:'/03/',	3:'/03/',	4:'/03/',	5:'/03/',	6:'/03/',	7:'/03/',	8:'/03/'},
	'month4' : {	0:'/04/',	1:'/04/',	2:'/04/',	3:'/04/',	4:'/04/',	5:'/04/',	6:'/04/',	7:'/04/',	8:'/04/'},
	'month5' : {	0:'/05/',	1:'/05/',	2:'/05/',	3:'/05/',	4:'/05/',	5:'/05/',	6:'/05/',	7:'/05/',	8:'/05/'},
	'month6' : {	0:'/06/',	1:'/06/',	2:'/06/',	3:'/06/',	4:'/06/',	5:'/06/',	6:'/06/',	7:'/06/',	8:'/06/'},
	'month7' : {	0:'/07/',	1:'/07/',	2:'/07/',	3:'/07/',	4:'/07/',	5:'/07/',	6:'/07/',	7:'/07/',	8:'/07/'},
	'month8' : {	0:'/08/',	1:'/08/',	2:'/08/',	3:'/08/',	4:'/08/',	5:'/08/',	6:'/08/',	7:'/08/',	8:'/08/'},
	'month9' : {	0:'/09/',	1:'/09/',	2:'/09/',	3:'/09/',	4:'/09/',	5:'/09/',	6:'/09/',	7:'/09/',	8:'/09/'},
	'month10': {	0:'/10/',	1:'/10/',	2:'/10/',	3:'/10/',	4:'/10/',	5:'/10/',	6:'/10/',	7:'/10/',	8:'/10/'},
	'month11': {	0:'/11/',	1:'/11/',	2:'/11/',	3:'/11/',	4:'/11/',	5:'/11/',	6:'/11/',	7:'/11/',	8:'/11/'},
	'month12': {	0:'/12/',	1:'/12/',	2:'/12/',	3:'/12/',	4:'/12/',	5:'/12/',	6:'/12/',	7:'/12/',	8:'/12/'}
	}
};
C_XL.dear = {
	0 : { 0:'Dear', 1:'Chère', 2:'Szanowny', 3:'Beste', 4:'Geehrte', 5:'Cara', 6:'Querida', 7:'Cara', 8:'Léif'}, // female
	1 : { 0:'Dear', 1:'Cher', 2:'Szanowny', 3:'Beste', 4:'Geehrter', 5:'Caro', 6:'Querido', 7:'Caro', 8:'Léif'}, // male
	2 : { 0:'', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:'' }, // sa
	3 : { 0:'', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:'' }, // sprl
	5 : { 0:'Dear', 1:'Chère', 2:'Szanowny', 3:'Beste', 4:'Geehrte', 5:'Cara', 6:'Querida', 7:'Cara', 8:'Léif'}, // miss
	4 : { 0:'Dear', 1:'Cher', 2:'Szanowny', 3:'Beste', 4:'Geehrter', 5:'Caro', 6:'Querido', 7:'Caro', 8:'Léif'}, // boy
	6 : { 0:'Dear', 1:'Chère', 2:'Szanowny', 3:'Beste', 4:'Geehrte', 5:'Cara', 6:'Querida', 7:'Cara', 8:'Léif'},  // girl
	7 : { // écriture inclusive pour othergender:
		0: 'Dear',        // English (reste neutre, pas de distinction genrée ici)
		1: 'Cher.e',      // French (point médian pour l'inclusivité)
		2: 'Szanowny',    // Polish (reste standard, pas d'écriture inclusive largement reconnue)
		3: 'Beste',       // Dutch (forme épicène déjà neutre)
		4: 'Geehrte*r',   // German (utilisation de l'étoile pour neutraliser)
		5: 'Carə',        // Italian (adaptation inclusive avec ə)
		6: 'Queride',     // Spanish (forme inclusive reconnue)
		7: 'Queride',     // Portuguese (forme inclusive reconnue)
		8: 'Léif'        // Luxembourgish (reste épicène et neutre)
	}
  
};

C_XL.d['male'] = { 0:'Mr.', 1:'M.', 2:'Pan', 3:'Mr', 4:'Herr', 5:'Sig', 6:'Señor', 7:'Sr.', 8:'Här'};
C_XL.d['female'] = { 0:'Mrs.', 1:'Mme', 2:'Pani', 3:'Mvr', 4:'Frau', 5:'Sig.ra', 6:'Señora', 7:'Sra.', 8:'Madame'};
C_XL.d['sa'] = { 0:'aS', 1:'SA', 2:'SA', 3:'NV', 4:'aG', 5:'SA', 6:'SA', 7:'SA', 8:'SA'};
C_XL.d['sprl'] = { 0:'Ltd', 1:'Sprl', 2:'Sp.z o.o.', 3:'Bvba', 4:'Pgbh', 5:'Ltd', 6:'SRL', 7:'SARL', 8:'S.à r.l.'};
C_XL.d['miss'] = { 0:'Miss', 1:'Mlle', 2:'Tęsknić', 3:'Juffr', 4:'Ms', 5:'Sig.na', 6:'Señorita', 7:'Menina', 8:'Joffer'};
C_XL.d['boy'] = { 0:'Boy', 1:'Garçon', 2:'Chłopak', 3:'Jhr', 4:'Junge', 5:'Ragazzo', 6:'Niño', 7:'Rapaz', 8:'Bouf'};
C_XL.d['girl'] = { 0:'Girl', 1:'Fille', 2:'Córka', 3:'Dchtr', 4:'Mädchen', 5:'Ragazza', 6:'Niña', 7:'Rapariga', 8:'Meedchen'};
C_XL.d['othergender'] = { 0:'other', 1:'autre', 2:'inna', 3:'anders', 4:'anders', 5:'altro', 6:'otro', 7:'outro', 8:'aner'};


// 		technical 	english:0,		french:1,	polish:2,	dutch:3,		german:4,	italian:5,		spanish:6,		portuguese:7,		luxembourgish:8

C_XL.d['minute'] = { 0:'minute', 1:'minute', 2:'minuta', 3:'minuut', 4:'Minute', 5:'minuto', 6:'minuto', 7:'minuto', 8:'Minutt' }; 
C_XL.d['minutes'] = { 0:'minutes', 1:'minutes', 2:'minuty', 3:'minuten', 4:'Minuten', 5:'minuti', 6:'minutos', 7:'minutos', 8:'Minutten'};
C_XL.d['mn'] = { 0:'mn', 1:'mn', 2:'min', 3:'mn', 4:'Min', 5:'min', 6:'mn', 7:'mn', 8:'min'}; // see (*ct08*)

C_XL.d['hour'] = { 0:'hour', 1:'heure', 2:'godzinę', 3:'uur', 4:'Stund', 5:'ora', 6:'hora', 7:'hora', 8:'Stonn' };
C_XL.d['hours'] = { 0:'hours', 1:'heures', 2:'godziny', 3:'uren', 4:'Stunden', 5:'ore', 6:'horas', 7:'horas', 8:'Stonnen'};
C_XL.d['abr min'] = { 0:'m', 1:'m', 2:'m', 3:'m', 4:'m', 5:'m', 6:'m', 7:'m', 8:'m'};

C_XL.d['ok'] = { 0:'Ok', 1:'Ok', 2:'Ok', 3:'Ok', 4:'Ok', 5:'Ok', 6:'Ok', 7:'Ok', 8:'Ok'};
C_XL.d['yes'] = { 0:'Yes', 1:'Oui', 2:'Tak', 3:'Ja', 4:'Ja', 5:'Sì', 6:'Si', 7:'Sim', 8:'Jo'};
C_XL.d['no'] = { 0:'No', 1:'Non', 2:'Nie', 3:'Nee', 4:'Nein', 5:'No', 6:'No', 7:'Não', 8:'Nee'};
C_XL.d['web'] = { 0:'Web', 1:'Web', 2:'Web', 3:'Web', 4:'Web', 5:'Web', 6:'Web', 7:'Web', 8:'Web'};
C_XL.d['or'] = { 0:'or', 1:'ou', 2:'lub', 3:'of', 4:'oder', 5:'o', 6:'o', 7:'ou', 8:'oder'};


C_XL.d['date'] = { 0:'Date', 1:'Date', 2:'Data', 3:'Datum', 4:'Datum', 5:'Data', 6:'Fecha', 7:'Data', 8:'Datum'};
C_XL.d['time'] = { 0:'Time', 1:'Heure', 2:'Godzina', 3:'Uur', 4:'Uhr', 5:'Ora', 6:'Hora', 7:'Hora', 8:'Auer'};
C_XL.d['fromdate'] = { 0:'from', 1:'du', 2:'od', 3:'vanaf', 4:'von', 5:'dal', 6:'desde', 7:'de', 8:'vun'};
C_XL.d['untildate'] = { 0:'until', 1:'jusqu\'au', 2:'do', 3:'tot', 4:'bis', 5:'fino al', 6:'hasta el', 7:'até', 8:'bis'};
C_XL.d['todate'] = { 0:'to', 1:'au', 2:'do', 3:'tot', 4:'bis', 5:'a', 6:'a', 7:'até', 8:'bis'};
C_XL.d['ondate'] = { 0:'on', 1:'le', 2:'do', 3:'op', 4:'am', 5:'il', 6:'el', 7:'o', 8:'um'};
C_XL.d['fromtime'] = { 0:'from', 1:'de', 2:'o', 3:'van', 4:'von', 5:'da', 6:'desde', 7:'de', 8:'vun'};
C_XL.d['at'] = { 0:'at', 1:'à', 2:'o', 3:'om', 4:'um', 5:'a', 6:'a', 7:'a', 8:'um'};
C_XL.d['to'] = { 0:'to', 1:'à', 2:'do', 3:'tot', 4:'bis', 5:'a', 6:'a', 7:'até', 8:'bis'};
C_XL.d['for'] = { 0:'for', 1:'pour', 2:'dla', 3:'voor', 4:'für', 5:'per', 6:'para', 7:'para', 8:'fir'};
C_XL.d['abr days'] = { 0:'days', 1:'jrs', 2:'dni', 3:'dagen', 4:'Tage', 5:'gg.', 6:'días', 7:'dias', 8:'Deeg'};
C_XL.d['abr day'] = { 0:'day', 1:'jr', 2:'dzień', 3:'dag', 4:'Tag', 5:'g.', 6:'día', 7:'dia', 8:'Dag'};
C_XL.d['weekday'] = { 0:'weekday', 1:'jour', 2:'dzień', 3:'weekdag', 4:'wochentag', 5:'feriale', 6:'día', 7:'dia', 8:'Wochendag'};
C_XL.d['weekdays'] = { 0:'weekdays', 1:'jours', 2:'dzień', 3:'weekdagen', 4:'wochentage', 5:'feriali', 6:'días', 7:'dias', 8:'Wochendeeg'};

C_XL.d['men'] = { 0:'men', 1:'hommes', 2:'Mężczyźni', 3:'mannen', 4:'Männer', 5:'Uomini', 6:'Hombre', 7:'Homens', 8:'Männer'};
C_XL.d['women'] = { 0:'women', 1:'femmes', 2:'Kobiety', 3:'vrouwen', 4:'Frauen', 5:'Donne', 6:'Mujer', 7:'Mulheres', 8:'Fraen'};

C_XL.d['gender_1'] = { 0:'Man', 1:'Masculin', 2:'Mężczyźni', 3:'Mannelijk', 4:'Männer', 5:'Uomini', 6:'Hombre', 7:'Homens', 8:'Mann'};
C_XL.d['gender_0'] = { 0:'Woman', 1:'Féminin', 2:'Kobiety', 3:'Vrouwelijk', 4:'Frauen', 5:'Donne', 6:'Mujer', 7:'Mulheres', 8:'Fra'};

C_XL.d['visibility'] = { 0:'Visibility', 1:'Visibilité', 2:'Widoczność', 3:'Zichtbaarheid', 4:'Sichtbarkeit', 5:'Visibilità', 6:'Visibilidad', 7:'Visibilidade', 8:'Siichtbarkeet'};
C_XL.d['always'] = { 0:'always', 1:'Toujours', 2:'Zawsze', 3:'altijd', 4:'immer', 5:'Sempre', 6:'Siempre', 7:'Sempre', 8:'Emmer'};
C_XL.d['up to date'] = { 0:'to', 1:'jusqu\'au', 2:'do tej pory', 3:'tot', 4:'bis', 5:'fino a', 6:'hasta el', 7:'a', 8:'aktuell'};
C_XL.d['from date'] = { 0:'From', 1:'a partir du', 2:'Od tego dnia', 3:'Vanaf datum', 4:'ab Datum', 5:'Dal', 6:'Desde el', 7:'a partir de', 8:'vun'};
C_XL.d['on time'] = { 0:'On time', 1:'a l\'heure', 2:'W czasie', 3:'Op tijdstip', 4:'Um Uhrzeit', 5:'In tempo', 6:'a tiempo', 7:'a tempo', 8:'pünktlech'};
C_XL.d['date included'] = { 0:'included', 1:'inclus', 2:'włączony', 3:'inbegrepen', 4:'einschließlich', 5:'inclusa', 6:'incluido', 7:'incluído', 8:'abegraff'};
C_XL.d['in period'] = { 0:'In the period', 1:'Dans la période', 2:'W okresie', 3:'In de periode', 4:'im Zeitraum', 5:'Nel periodo', 6:'En el período', 7:'No período', 8:'Am Zäitraum'};
C_XL.d['single day'] = { 0:'Single day', 1:'Un seul jour', 2:'Tylko dni', 3:'Enkel één dag', 4:'Einzelner Tag', 5:'Un solo giorno', 6:'Un solo día', 7:'Um único dia', 8:'Een Dag'};

C_XL.d['local time'] = { 0:'local time', 1:'heure locale', 2:'czas lokalny', 3:'lokale tijd', 4:'Ortszeit', 5:'ora locale', 6:'hora local', 7:'horário local', 8:'Lokalzäit'};


C_XL.d['loading'] = { 0:'Currently loading', 1:'En cours de Chargement', 2:'ładowanie', 3:'Is aan het laden', 4:'Wird geladen', 5:'Caricando', 6:'Cargando', 7:'a carregar', 8:'Lued'};


C_XL.d['error occured'] = { 0:'an error occured', // english
                            1:'une erreur est survenue', // french
                            2:'wystąpił błąd', // polish
                            3:'er is een fout opgetreden', // dutch
                            4:'ein Fehler ist aufgetreten', // german
                            5:'si è verificato un errore', // italian
                            6:'ocurrió un error', // spanish
                            7:'um erro ocorreu', // portuguese
                            8:'e Feeler ass geschitt'}; // luxembourgish


C_XL.d['id'] = { 0:'Id', 1:'Id', 2:'Id', 3:'Id', 4:'ID', 5:'Id', 6:'Id', 7:'Id', 8:'Id'};
C_XL.d['note'] = { 0:'Note', 1:'Note', 2:'Notatka', 3:'Notitie', 4:'Notiz', 5:'Nota', 6:'Nota', 7:'Nota', 8:'Notiz'};
C_XL.d['info'] = { 0:'Info', 1:'Info', 2:'Info', 3:'Info', 4:'Info', 5:'Info', 6:'Info', 7:'Informações', 8:'Info'};

				
						
C_XL.d['notes'] = { 0:'Notes', 1:'Notes', 2:'Notatki', 3:'Nota\'s', 4:'Notizen', 5:'Note', 6:'Notas', 7:'Notas', 8:'Notizen' };
C_XL.d['new note'] = { 0:'New note', 1:'Nouvelle note', 2:'Nowa notatka', 3:'Nieuwe notitie', 4:'Neue Notiz', 5:'Nuova nota', 6:'Nota nueva', 7:'Nova nota', 8:'Nei Notiz' };
C_XL.d['no note'] = { 0:'No note', 1:'Pas de note', 2:'Brak notatka', 3:'Geen notitie', 4:'Keine Notiz', 5:'Nessuna nota', 6:'Ninguna nota', 7:'Sem nota', 8:'Keng Notiz' };
C_XL.d['addressees'] = { 0:'addressees', 1:'Destinataires', 2:'adresaci', 3:'Geadresseerden', 4:'Empfänger', 5:'Destinatario', 6:'Destinatario', 7:'Destinatários', 8:'Adressaten' };




	// person coordinates
// 		technical 				english:0,				french:1,				polish:2,				dutch:3,					german:4,				italian:5,				spanish:6,			portuguese:7
C_XL.d['vip'] = { 0:'VIP', 1:'VIP', 2:'VIP', 3:'VIP', 4:'VIP', 5:'VIP', 6:'VIP', 7:'VIP', 8:'VIP' };
C_XL.d['company'] = { 0:'Company', 1:'Entreprise', 2:'Firma', 3:'Firma', 4:'Firma', 5:'azienda', 6:'Empresa', 7:'Empresa', 8:'Entreprise' };
C_XL.d['gender'] = { 0:'Title', 1:'Civ.', 2:'Godność', 3:'Gesl.', 4:'anspr.', 5:'Titolo', 6:'Tratamiento', 7:'Forma de tratamento', 8:'Titel' };
C_XL.d['sex'] = { 0:'Sex', 1:'Sexe', 2:'Seks', 3:'Geslacht', 4:'Geschlecht', 5:'Genero', 6:'Género', 7:'Género', 8:'Geschlecht' };
C_XL.d['firstname'] = { 0:'First name', 1:'Prénom', 2:'Imię', 3:'Voornaam', 4:'Vorname', 5:'Nome', 6:'Nombre', 7:'Nome', 8:'Virnumm' };
C_XL.d['lastname'] = { 0:'Last name', 1:'Nom', 2:'Nazwisko', 3:'Naam', 4:'Nachname', 5:'Cognome', 6:'apellido', 7:'apelido', 8:'Familljennumm' };
C_XL.d['residence'] = { 0:'Residence', 1:'Résidence', 2:'Rezydencja', 3:'Residentie', 4:'Wohnsitz', 5:'Residenza', 6:'Residencia', 7:'Residência', 8:'Wunnsëtz' };
C_XL.d['address'] = { 0:'address', 1:'adresse', 2:'adres', 3:'adres', 4:'adresse', 5:'Indirizzo', 6:'Dirección', 7:'Morada', 8:'Adress' };
C_XL.d['zipCode'] = { 0:'Zip code', 1:'Code postal', 2:'Kod pocztowy', 3:'Postcode', 4:'Postleitzahl', 5:'Codice postale', 6:'Código postal', 7:'Código postal', 8:'Postleitzuel' };
C_XL.d['no address'] = { 0:'No address', 1:'pas d\'adresse', 2:'Brak adresu', 3:'geen adres', 4:'Keine Adresse', 5:'Nessun indirizzo', 6:'Sin direccion', 7:'Sem endereço', 8:'Keng Adress' };

C_XL.d['name'] = { 0:'name', 1:'nom', 2:'nazwa', 3:'naam', 4:'Name', 5:'nome', 6:'nombre', 7:'nome', 8:'Numm' };
C_XL.d['names'] = { 0:'names', 1:'noms', 2:'nazwy', 3:'namen', 4:'Namen', 5:'nomi', 6:'nombres', 7:'nomes', 8:'Nimm' };
C_XL.d['identification'] = { 0:'Identification', 1:'Identification', 2:'Identyfikacja', 3:'Identificatie', 4:'Identifizierung', 5:'Identificazione', 6:'Identificación', 7:'Identificação', 8:'Identifikatioun' };

C_XL.d['city'] = { 0:'City', 1:'Ville', 2:'Miejscowość', 3:'Stad', 4:'Stadt', 5:'Città', 6:'Ciudad', 7:'Localidade', 8:'Stad' };
C_XL.d['country'] = { 0:'Country', 1:'Pays', 2:'Województwo', 3:'Land', 4:'Land', 5:'Paese', 6:'País', 7:'País', 8:'Land' };
C_XL.d['email'] = { 0:'e-mail', 1:'e-mail', 2:'e-mail', 3:'e-mail', 4:'e-mail', 5:'e-mail', 6:'e-mail', 7:'e-mail', 8:'E-Mail' };
C_XL.d['emails'] = { 0:'e-mails', 1:'e-mails', 2:'e-mails', 3:'e-mails', 4:'e-mails', 5:'e-mails', 6:'e-mails', 7:'e-mails', 8:'E-Mails' };
C_XL.d['no email'] = { 0:'Has no e-mail', 1:'N\'a pas d\'e-mail', 2:'Nie e-mail', 3:'Heeft geen e-mail', 4:'Hat keine E-mail', 5:'Non ha email', 6:'No tiene email', 7:'Não tem e-mail', 8:'Keng E-Mail' };
C_XL.d['website url'] = { 0:'website url', 1:'url du site web', 2:'Adres URL witryny', 3:'Website URL', 4:'Webadresse', 5:'URL del sito', 6:'URL del sitio web', 7:'url do site', 8:'URL vun der Websäit' };

C_XL.d['mobile'] = { 0:'Mobile number', 1:'portable', 2:'Komórkowy', 3:'GSM', 4:'Mobilnummer', 5:'Cellulare', 6:'Móvil', 7:'Telemóvel', 8:'Handysnummer' };
C_XL.d['no mobile'] = { 0:'No mobile number', 1:'pas de portable', 2:'Brak telefonu komórkowego', 3:'Geen GSM nummer', 4:'Kein Mobilnummer', 5:'Niente cellulare', 6:'Sin móvil', 7:'Sem telemóvel', 8:'Keng Handysnummer' };
C_XL.d['with mobile'] = { 0:'With mobile', 1:'avec portable', 2:'z GSM', 3:'met GSM', 4:'mit Mobil', 5:'Con cellulare', 6:'Con móvil', 7:'Com telemóvel', 8:'Mat Handy' };
C_XL.d['phone'] = { 0:'Phone number', 1:'téléphone', 2:'Telefon', 3:'Telefoon', 4:'Telefon', 5:'Telefono', 6:'Teléfono', 7:'Telefone', 8:'Telefonsnummer' };
C_XL.d['no phone'] = { 0:'no phone number', 1:'pas de téléphone', 2:'brak telefonu', 3:'Geen telefoon nummer', 4:'Kein Handy', 5:'Nessun telefono', 6:'Sin teléfono', 7:'Sem telefone', 8:'Keng Telefonsnummer' };
C_XL.d['language'] = { 0:'language', 1:'langue', 2:'język', 3:'taal', 4:'Sprache', 5:'lingua', 6:'idioma', 7:'idioma', 8:'Sprooch' };
C_XL.d['languages'] = { 0:'languages', 1:'langues', 2:'językami', 3:'talen', 4:'Sprachen', 5:'lingue', 6:'idiomas', 7:'idiomas', 8:'Sproochen' };
C_XL.d['birthdate'] = { 0:'Birthdate', 1:'naissance', 2:'Data urodzenia', 3:'Geboortedatum', 4:'Geburtsdatum', 5:'Data di nascita', 6:'Fecha de nacimiento', 7:'Nascimento', 8:'Gebuertsdatum' };
C_XL.d['registration'] = { 0:'Registration', 1:'matricule', 2:'Znaczek', 3:'Register', 4:'Registrierung', 5:'Matricola', 6:'Matrícula', 7:'Matrícula', 8:'Registréierung' };
C_XL.d['reference'] = { 0:'Reference', 1:'référence', 2:'Odniesienie', 3:'Referentie', 4:'Referenz', 5:'Riferimento', 6:'Referencia', 7:'Referência', 8:'Referenz' };
C_XL.d['cssColor'] = { 0:'Color', 1:'couleur', 2:'Kolor', 3:'Kleur', 4:'Farbe', 5:'Colore', 6:'Color', 7:'Cor', 8:'Faarf' };
C_XL.d['cssPattern'] = { 0:'Status', 1:'statut', 2:'Status', 3:'Status', 4:'Status', 5:'Status', 6:'Estado', 7:'Estado', 8:'Status' };

C_XL.d['visimodal more fields'] = { 0:'more fields', 1:'plus d\'options', 2:'więcej opcji', 3:'meer opties', 4:'mehr Optionen', 5:'più opzioni', 6:'mas opciones', 7:'mais opções', 8:'méi Felder' };

C_XL.d['references'] = { 0:'References', 1:'Références', 2:'Referencje', 3:'Referenties', 4:'Referenzen', 5:'Riferimenti', 6:'Referencias', 7:'Referências', 8:'Referenzen' };
C_XL.d['coordinates'] = { 0:'Coordinates', 1:'Coordonnées', 2:'Dane kontaktowe', 3:'Coördinaten', 4:'Daten', 5:'Dati', 6:'Datos', 7:'Dados', 8:'Koordinaten' };
C_XL.d['prev apps'] = { 0:'Previous', 1:'Passés', 2:'Poprzednie wizyty', 3:'Verleden', 4:'Vorherige', 5:'Passati', 6:'Pasados', 7:'Passados', 8:'Virrunnen' };
C_XL.d['next apps'] = { 0:'Planned', 1:'Planifiés', 2:'Zaplanowane wizyty', 3:'Toekomstige', 4:'Geplante', 5:'Pianificati', 6:'Planeados', 7:'Planeados', 8:'Geplangten' };


C_XL.d['reservations'] = { 0:'Reservations', 1:'Reservations', 2:'Rezerwacje', 3:'Reserveringen', 4:'Reservierungen', 5:'Prenotazioni', 6:'Reservas', 7:'Reservas', 8:'Reservatiounen' };
C_XL.d['booking code'] = { 0:'booking code', 1:'code de réservation', 2:'kod rezerwacji', 3:'boekingscode', 4:'Buchungscode', 5:'codice di prenotazione', 6:'código de reserva', 7:'código de reserva', 8:'Buchungscode' };
C_XL.d['version'] = { 0:'version', 1:'version', 2:'wersja', 3:'versie', 4:'ausführung', 5:'versione', 6:'versión', 7:'versão', 8:'Versioun' };
C_XL.d['appointments'] = { 0:'appointments', 1:'rendez-vous', 2:'nominacje', 3:'afspraken', 4:'termine', 5:'appuntamenti', 6:'citas', 7:'compromissos', 8:'Rendez-vous' };
C_XL.d['optional resa'] = { 0:'Optional reservations', 1:'Réservation optionelle', 2:'Rezerwacje', 3:'optionele reserveringen', 4:'Optionale Reservierungen', 5:'Prenotazioni opzionali', 6:'Reservas opcionales', 7:'Reserva opcional', 8:'Optional Reservatiounen' };
C_XL.d['communication'] = { 0:'Communication', 1:'Communication', 2:'Komunikat', 3:'Communicatie', 4:'Kommunikation', 5:'Comunicazione', 6:'Comunicación', 7:'Comunicação', 8:'Kommunikatioun' };
C_XL.d['agenda'] = { 0:'agenda', 1:'agenda', 2:'programie', 3:'agenda', 4:'Tagesordnung', 5:'agenda', 6:'agenda', 7:'agenda', 8:'Agenda' };
C_XL.d['calendar'] = { 0:'Calendar', 1:'Calendrier', 2:'kalendarz', 3:'Kalender', 4:'Kalender', 5:'Calendario', 6:'Calendario', 7:'Cronograma', 8:'Kalenner' };
C_XL.d['calendars'] = { 0:'Calendars', 1:'Calendriers', 2:'kalendarze', 3:'Kalenders', 4:'Kalender', 5:'Calendari', 6:'Calendarios', 7:'Calendários', 8:'Kalennere' };
C_XL.d['preferences'] = { 0:'Preferences', 1:'Préferences', 2:'preferencje', 3:'Voorkeuren', 4:'Präferenzen', 5:'Preferenze', 6:'Preferencias', 7:'Preferências', 8:'Präferenzen' };
C_XL.d['newvisitor'] = { 0:'New visitor', 1:'Nouveau visitor', 2:'Nowy visitor', 3:'Nieuwe visitor', 4:'Neuer visitor', 5:'Nuovo visitor', 6:'Nuevo visitor', 7:'Novo visitor', 8:'Neie Visiteur' };
C_XL.d['vduplicate'] = { 0:'Duplicate', 1:'Doublon', 2:'Duplikat', 3:'Duplicaat', 4:'Duplikat', 5:'Doppione', 6:'Duplicado', 7:'Repetição', 8:'Duebel' };
C_XL.d['audit'] = { 0:'Tracking', 1:'audit', 2:'audyt', 3:'Opvolging', 4:'audit', 5:'audit', 6:'auditoría', 7:'auditoria', 8:'Audit' };
C_XL.d['sections'] = { 0:'Sections', 1:'Sections', 2:'Sekcje', 3:'Secties', 4:'Bereiche', 5:'Sezioni', 6:'Secciones', 7:'Secções', 8:'Sektiounen' };

// 		technical 				english:0,				french:1,					polish:2,					dutch:3,					german:4,					italian:5,						spanish:6,				portuguese:7

C_XL.d['new reservation'] = { 0:'New appointement', 1:'Nouvelle réservation', 2:'Nowa rezerwacja', 3:'Nieuwe reservering', 4:'Neue Reservierung', 5:'Nuova prenotazione', 6:'Nueva reserva', 7:'Nova reserva', 8:'Nei Reservatioun' };
C_XL.d['no reservation'] = { 0:'No appointement', 1:'Pas de réservation', 2:'Nie powołanie', 3:'Geen reservering', 4:'Keine Reservierungen', 5:'Nessuna prenotazione', 6:'Ninguna reserva', 7:'Sem reserva', 8:'Keng Reservatioun' };
C_XL.d['reservation'] = { 0:'appointement', 1:'Réservation', 2:'rezerwacja', 3:'Reservering', 4:'Reservierung', 5:'Prenotazione', 6:'Reserva', 7:'Reserva', 8:'Reservatioun' };
C_XL.d['linked resa'] = { 0:'Linked appointement', 1:'Réservation associée', 2:'Rezerwacja związane', 3:'Verbonden reservering', 4:'Verbundene Reservierung', 5:'Prenotazione associata', 6:'Reserva asociada', 7:'Reserva associada', 8:'Verbonnen Reservatioun' };
C_XL.d['appointment'] = { 0:'appointement', 1:'Rendez-vous', 2:'Wizyta', 3:'afspraak', 4:'Termin', 5:'appuntamento', 6:'Cita', 7:'Compromissos', 8:'Rendez-vous' };
C_XL.d['event'] = { 0:'Unavailability', 1:'Indisponibilité', 2:'Brak wolnych terminów', 3:'Onbeschikbaarheid', 4:'Nichtverfügbarkeit', 5:'Indisponibilità', 6:'Indisponibilidad', 7:'Indisponibilidade', 8:'Onverfügbarkeet' };
C_XL.d['assignment'] = { 0:'assignment', 1:'affectation', 2:'Cesja', 3:'Toewijzing', 4:'Zuweisung', 5:'affettazione', 6:'asignación', 7:'afetação', 8:'Zouweisung' };
C_XL.d['tracking'] = { 0:'Reservation of', 1:'Réservation de', 2:'Rezerwacja zasobu', 3:'reservatie van', 4:'Reservierung von', 5:'Prenotazione di', 6:'Reserva de', 7:'Reserva de', 8:'Reservatioun vun' };

C_XL.d['zoom'] = { 0:'Zoom in/out', 1:'Zoom in/out', 2:'Zoom in/out', 3:'Zoom in/out', 4:'Herein-/Herauszoomen', 5:'Zoom in/out', 6:'Zoom in/out', 7:'Zoom in/out', 8:'Zoom an/aus' };
C_XL.d['hide/unhide'] = { 0:'Hide/unhide', 1:'Montrer/cacher', 2:'Hide/unhide', 3:'Tonen/verbergen', 4:'anzeigen/ausblenden', 5:'Mostrare/occultare', 6:'Mostrar/ocultar', 7:'Mostrar/ocultar', 8:'Verstoppen/weisen' };
C_XL.d['calculator'] = { 0:'Calculator', 1:'Calculette', 2:'Kalkulator', 3:'Rekenmachine', 4:'Rechner', 5:'Calcolatrice', 6:'Calculadora', 7:'Calculadora', 8:'Rechner' };
C_XL.d['choose name'] = { 0:'Choose a name', 1:'Choisissez un nom', 2:'Wybierz nazwę', 3:'Kies een naam', 4:'Namen auswählen', 5:'Scelga un nome', 6:'Escoja un nombre', 7:'Escolha um apelido', 8:'Wielt e Numm' };

C_XL.d['none'] = { 0:'None', 1:'aucun', 2:'żaden', 3:'Geen', 4:'Kein', 5:'Nessuno', 6:'Ninguno', 7:'Nenhum', 8:'Keen' };
C_XL.d['none ff'] = { 0:'None', 1:'aucune', 2:'żaden', 3:'Geen', 4:'Keine', 5:'Nessuna', 6:'Ninguna', 7:'Nenhuma', 8:'Keen' };
C_XL.d['event'] = { 0:'Unavailability', 1:'Indisponibilité', 2:'Brak wolnych terminów', 3:'Onbeschikbaarheid', 4:'Nichtverfügbarkeit', 5:'Indisponibilità', 6:'Indisponibilidad', 7:'Indisponibilidade', 8:'Onverfügbarkeet' };
C_XL.d['default'] = { 0:'by default', 1:'par défaut', 2:'Zaocznie', 3:'standaard', 4:'standard', 5:'predefinito', 6:'por defecto', 7:'predefinição', 8:'Standard' };

// 		technical 				english:0,			french:1,				polish:2,				dutch:3,				german:4,			italian:5,				spanish:6,					portuguese:7

C_XL.d['resources']			= { 0:'resources',		1:'ressources',			2:'Zasoby',				3:'resources',			4:'Ressourcen',		5:'risorse',			6:'recursos', 				7:'recursos',				8:'Ressourcen'		};
C_XL.d['workrooms']			= { 0:'workrooms',		1:'salles de travail',	2:'pracownie',			3:'werkzalen',			4:'arbeitsräume',	5:'sale di lavoro',		6:'espacios de trabajo', 	7:'espaços de trabalho',	8:'Aarbechtsraim'	};
C_XL.d['workplaces']		= { 0:'workplaces',		1:'postes de travail',	2:'stanowiska',			3:'werkplaatsen',		4:'arbeitsorte',	5:'spazi di lavoro',	6:'estaciones de trabajo', 	7:'estações de trabalho',	8:'Aarbechtsplazen'	};
C_XL.d['classrooms']		= { 0:'classrooms',		1:'classes de cours',	2:'sale lekcyjne',		3:'klaslokalen',		4:'Klassenräume',	5:'aule corsi',			6:'clases de cursos', 		7:'espaço de aulas',		8:'Klassenzëmmeren'	};
C_XL.d['carerooms']			= { 0:'care rooms',		1:'salles de soin',		2:'pokoje zabiegowe',	3:'zorgkamers',			4:'pflegeräume',	5:'sale di trattamenti',6:'salas de tratamientos', 	7:'salas de tratamento',	8:'Betreiungsraim'	};
C_XL.d['collaborators']		= { 0:'collaborators',	1:'collaborateurs',		2:'pracownicy',			3:'medewerkers',		4:'Mitarbeiter',	5:'collaboratori',		6:'colaboradores', 			7:'colaboradores',			8:'Mataarbechter'	};
C_XL.d['assistants']		= { 0:'assistants',		1:'assistants',			2:'asystenci',			3:'assistenten',		4:'assistenten',	5:'assistenti',			6:'asistentes', 			7:'assistentes',			8:'Assistenten'		};
C_XL.d['rdoctors']			= { 0:'doctors',		1:'Docteurs',			2:'Lekarze',			3:'artsen',				4:'Ärzte',			5:'medici',				6:'médicos', 				7:'médicos',				8:'Dokteren'			};

// (*d01*)C_XL.d['resources'] = { 0:'resources', 1:'ressources', 2:'Zasoby', 3:'resources', 4:'Ressourcen', 5:'risorse', 6:'recursos', 7:'recursos', 8:'Ressourcen' };
C_XL.d['workrooms'] = { 0:'workrooms', 1:'salles de travail', 2:'pracownie', 3:'werkzalen', 4:'arbeitsräume', 5:'sale di lavoro', 6:'espacios de trabajo', 7:'espaços de trabalho', 8:'Aarbechtsraim' };
C_XL.d['workplaces'] = { 0:'workplaces', 1:'postes de travail', 2:'stanowiska', 3:'werkplaatsen', 4:'arbeitsorte', 5:'spazi di lavoro', 6:'estaciones de trabajo', 7:'estações de trabalho', 8:'Aarbechtsplazen' };
C_XL.d['classrooms'] = { 0:'classrooms', 1:'classes de cours', 2:'sale lekcyjne', 3:'klaslokalen', 4:'Klassenräume', 5:'aule corsi', 6:'clases de cursos', 7:'espaço de aulas', 8:'Klasseräim' };
C_XL.d['carerooms'] = { 0:'care rooms', 1:'salles de soin', 2:'pokoje zabiegowe', 3:'zorgkamers', 4:'pflegeräume', 5:'sale di trattamenti', 6:'salas de tratamientos', 7:'salas de tratamento', 8:'Pflegeraumen' };
C_XL.d['collaborators'] = { 0:'collaborators', 1:'collaborateurs', 2:'pracownicy', 3:'medewerkers', 4:'Mitarbeiter', 5:'collaboratori', 6:'colaboradores', 7:'colaboradores', 8:'Mataarbechter' };
C_XL.d['assistants'] = { 0:'assistants', 1:'assistants', 2:'asystenci', 3:'assistenten', 4:'assistenten', 5:'assistenti', 6:'asistentes', 7:'assistentes', 8:'Assistenten' };
C_XL.d['doctors'] = { 0:'doctors', 1:'Docteurs', 2:'Lekarze', 3:'artsen', 4:'Ärzte', 5:'medici', 6:'médicos', 7:'médicos', 8:'Dokteren' };

// (*d01*)
C_XL.d['dentists'] = { 0:'dentists', 1:'dentistes', 2:'dentystami', 3:'tandartsen', 4:'Zahnärzte', 5:'dentisti', 6:'dentistas', 7:'dentistas', 8:'Zänndokteren' };
C_XL.d['salesmen'] = { 0:'salesmen', 1:'commerciaux', 2:'sprzedawcy', 3:'verkopers', 4:'Verkäufer', 5:'venditori', 6:'gente de ventas', 7:'vendedores', 8:'Verkeefer' };
C_XL.d['teachers'] = { 0:'teachers', 1:'professeurs', 2:'nauczycielami', 3:'leraren', 4:'Lehrer', 5:'insegnanti', 6:'maestros', 7:'professores', 8:'Schoulmeeschteren' };
C_XL.d['practitioners'] = { 0:'practitioners', 1:'praticiens', 2:'praktycy', 3:'behandelaar', 4:'Praktiker', 5:'praticante', 6:'practicante', 7:'praticante', 8:'Praktikanten' };
C_XL.d['technicians'] = { 0:'Technicians', 1:'Techniciens', 2:'Techników', 3:'Technicussen', 4:'Techniker', 5:'Tecnici', 6:'Técnicos', 7:'Técnicos', 8:'Techniker' };
C_XL.d['consultants'] = { 0:'Consultants', 1:'Consultants', 2:'Konsultanci', 3:'Consultants', 4:'Berater', 5:'Consulenti', 6:'Consultores', 7:'Consultores', 8:'Beroder' };
C_XL.d['instructors'] = { 0:'Instructors', 1:'Moniteurs', 2:'Instruktorzy', 3:'Instructeurs', 4:'ausbilder', 5:'Istruttori', 6:'Instructores', 7:'Monitores', 8:'Moniteuren' };
C_XL.d['experts'] = { 0:'Experts', 1:'Experts', 2:'Eksperci', 3:'Deskundigen', 4:'Experten', 5:'Periti', 6:'Peritos', 7:'Peritos', 8:'Experten' };
C_XL.d['equipments'] = { 0:'Equipments', 1:'Equipements', 2:'Urządzenia', 3:'apparaten', 4:'Geräte', 5:'attrezzature', 6:'Equipamientos', 7:'Equipamentos', 8:'Ausrëschtung' };
C_XL.d['offices'] = { 0:'Offices', 1:'Bureaux', 2:'Biura', 3:'Kantoren', 4:'Büroräume', 5:'Uffici', 6:'Oficinas', 7:'Secretárias', 8:'Büroen' };
C_XL.d['companies'] = { 0:'Companies', 1:'Entreprises', 2:'Firmy', 3:'Firmas', 4:'Firmen', 5:'aziende', 6:'Empresas', 7:'Empresas', 8:'Firmen' };
C_XL.d['tools'] = { 0:'Tools', 1:'Outils', 2:'Narzędzia', 3:'Gereedschap', 4:'Instrumente', 5:'Utensili', 6:'Herramientas', 7:'Ferramentas', 8:'Handwierksgeschir' };
C_XL.d['cars'] = { 0:'Cars', 1:'Voitures', 2:'Samochody', 3:'autos', 4:'PKWs', 5:'automobili', 6:'Coches', 7:'Carros', 8:'Autoen' };
C_XL.d['vehicules'] = { 0:'Vehicules', 1:'Véhicules', 2:'Pojazdów', 3:'Voertuigen', 4:'Fahrzeuge', 5:'Veicoli', 6:'Vehículos', 7:'Veículos', 8:'Gefierer' };

C_XL.d['resource'] = { 0:'resource', 1:'ressource', 2:'zasób', 3:'resource', 4:'Ressource', 5:'risorsa', 6:'recurso', 7:'recurso', 8:'Ressource' };
C_XL.d['workroom'] = { 0:'workroom', 1:'salle de travail', 2:'pracownia', 3:'werkzaal', 4:'arbeitsraum', 5:'sala di lavoro', 6:'espacio de trabajo', 7:'sala de trabalho', 8:'Aarbechtsraum' };
C_XL.d['workplace'] = { 0:'workplace', 1:'poste de travail', 2:'pracy stacji', 3:'werkplaats', 4:'arbeitsort', 5:'spazio di lavoro', 6:'estación de trabajo', 7:'posto de trabalho', 8:'Aarbechtsplaz' };
C_XL.d['classroom'] = { 0:'Classroom', 1:'classe de cours', 2:'klasa', 3:'klas', 4:'Klassenraum', 5:'aula corsi', 6:'clase de curso', 7:'espaço de aulas', 8:'Klassenraum' };
C_XL.d['careroom'] = { 0:'care room', 1:'salle de soin', 2:'gabinet zabiegowy', 3:'zorgkamer', 4:'Pflegeraum', 5:'sala di trattamenti', 6:'sala de tratamiento', 7:'sala de tratamento', 8:'Pflegeraum' };
C_XL.d['collaborator'] = { 0:'collaborator', 1:'collaborateur', 2:'współpracownik', 3:'medewerker', 4:'Mitarbeiter', 5:'collaboratore', 6:'colaborador', 7:'colaborador', 8:'Mataarbechter' };
C_XL.d['assistant'] = { 0:'assistant', 1:'assistant', 2:'asystent', 3:'assistent', 4:'assistent', 5:'assistente', 6:'asistente', 7:'assistente', 8:'Assistent' };
C_XL.d['doctor'] = { 0:'doctor', 1:'docteur', 2:'lekarz', 3:'arts', 4:'arzt', 5:'medico', 6:'médico', 7:'médico', 8:'Dokter' };

C_XL.d['dentist'] = { 0:'dentist', 1:'dentiste', 2:'dentystą', 3:'tandarts', 4:'Zahnarzt', 5:'dentista', 6:'dentista', 7:'dentista', 8:'Zänndokter' };
C_XL.d['salesman'] = { 0:'salesman', 1:'vendeur', 2:'sprzedawcą', 3:'verkoper', 4:'Verkäufer', 5:'venditore', 6:'vendedor', 7:'vendedor', 8:'Verkeefer' };
C_XL.d['teacher'] = { 0:'teacher', 1:'professeur', 2:'nauczycielem', 3:'leraar', 4:'Lehrer', 5:'insegnante', 6:'maestro', 7:'professor', 8:'Léiermeeschter' };
C_XL.d['practitioner'] = { 0:'practitioner', 1:'praticien', 2:'terapeuta', 3:'behandelaars', 4:'Praktiker', 5:'praticanti', 6:'practicantes', 7:'praticantes', 8:'Praktiker' };
C_XL.d['technician'] = { 0:'technician', 1:'technicien', 2:'technik', 3:'technicus', 4:'Techniker', 5:'tecnico', 6:'técnico', 7:'técnico', 8:'Techniker' };
C_XL.d['consultant'] = { 0:'consultant', 1:'consultant', 2:'konsultant', 3:'consultant', 4:'Berater', 5:'consulente', 6:'consultor', 7:'consultor', 8:'Beroder' };
C_XL.d['instructor'] = { 0:'instructor', 1:'moniteur', 2:'instruktor', 3:'instructeur', 4:'ausbilder', 5:'istruttore', 6:'instructor', 7:'monitor', 8:'Instructeur' };
C_XL.d['expert'] = { 0:'expert', 1:'expert', 2:'ekspert', 3:'expert', 4:'Experte', 5:'perito', 6:'perito', 7:'perito', 8:'Expert' };
C_XL.d['equipment'] = { 0:'equipment', 1:'équipement', 2:'sprzęt', 3:'apparatuur', 4:'Geräte', 5:'attrezzature', 6:'equipamiento', 7:'equipamento', 8:'Ausrëschtung' };
C_XL.d['office'] = { 0:'office', 1:'bureau', 2:'biuro', 3:'kantoor', 4:'Büro', 5:'ufficio', 6:'oficina', 7:'secretária', 8:'Büro' };
C_XL.d['tool'] = { 0:'tool', 1:'outil', 2:'narzędzie', 3:'gereedschap', 4:'Instrumente', 5:'utensile', 6:'herramienta', 7:'ferramenta', 8:'Instrument' };
C_XL.d['car'] = { 0:'car', 1:'voiture', 2:'samochód', 3:'auto', 4:'PKW', 5:'auto', 6:'coche', 7:'Carro', 8:'Auto' };
C_XL.d['vehicule'] = { 0:'vehicule', 1:'véhicule', 2:'pojazd', 3:'voertuig', 4:'Fahrzeug', 5:'veicolo', 6:'vehículo', 7:'Veículo', 8:'Gefier' };

C_XL.d['extend with'] = { 0:'Extend with', 1:'allonger de', 2:'Dłużej niż', 3:'Langer maken met', 4:'Erweitern mit', 5:'Prolungare di', 6:'Prolongar', 7:'alongar', 8:'Verlängeren mat' };
C_XL.d['shorten with'] = { 0:'Shorten with', 1:'Raccourcir de', 2:'Skrócony o', 3:'Inkorten met', 4:'Verkürzen mit', 5:'accorciare di', 6:'acortar', 7:'Encurtar', 8:'Kierzen mat' };
C_XL.d['reschedule'] = { 0:'Reschedule', 1:'Déplacer', 2:'Przełóż', 3:'Herschikken', 4:'Verlegen', 5:'Spostare', 6:'Mover', 7:'Mover', 8:'Ëmplanzen' };
C_XL.d['automatic'] = { 0:'automatic', 1:'automatique', 2:'automatyczne', 3:'automatisch', 4:'automatisch', 5:'automatico', 6:'automático', 7:'automático', 8:'automatesch' };

C_XL.d['set sooner'] = { 0:'Set sooner', 1:'avancer', 2:'określonych wcześniej', 3:'Vroeger', 4:'Vorverlegen', 5:'anticipare', 6:'adelantar', 7:'adiantar', 8:'Fréier setzen' };
C_XL.d['set later'] = { 0:'Delay', 1:'Retarder', 2:'później ustawić', 3:'Later', 4:'aufschieben', 5:'Posticipare', 6:'atrasar', 7:'atrasar', 8:'Verspéit setzen' };
C_XL.d['timing'] = { 0:'Timing', 1:'Timing', 2:'Czas', 3:'Tijdstip', 4:'Zeitpunkt', 5:'Timing', 6:'Plazo', 7:'Timing', 8:'Zäitplang' };
C_XL.d['in total'] = { 0:'in total', 1:'au total', 2:'w sumie', 3:'in totaal', 4:'Insgesamt', 5:'in totale', 6:'en total', 7:'no total', 8:'Am Ganzen' };
C_XL.d['total'] = { 0:'total', 1:'total', 2:'sumie', 3:'totaal', 4:'Gesamt', 5:'totale', 6:'total', 7:'total', 8:'Gesamt' };

C_XL.d['registration'] = { 0:'Registration', 1:'Matricule', 2:'Znaczek', 3:'Register', 4:'Registrieren', 5:'Matricola', 6:'Matrícula', 7:'Matrícula', 8:'Umeldung' };
C_XL.d['attendance'] = { 0:'attendance', 1:'assignations', 2:'attendance', 3:'Toegewezen', 4:'Zuweisung', 5:'Convocazioni', 6:'asignaciones', 7:'atribuições', 8:'Präsenz' };

C_XL.d['reserved'] = { 0:'Reserved', 1:'Réservé', 2:'Zarezerwowany/a', 3:'Gereserveerd', 4:'Reserviert', 5:'Prenotato', 6:'Reservado', 7:'Reservado', 8:'Reservéiert' };
C_XL.d['available'] = { 0:'available', 1:'Disponible', 2:'dostępny', 3:'beschikbaar', 4:'Verfügbar', 5:'Disponibile', 6:'Disponible', 7:'Disponível', 8:'Verfügbar' };
C_XL.d['day off'] = { 0:'Day Off', 1:'En congé', 2:'dzień wolny', 3:'Op verlof', 4:'Ruhetag', 5:'In ferie', 6:'Día de descanso', 7:'De férias', 8:'Fräien Dag' };
C_XL.d['off time'] = { 0:'Breaks', 1:'Congés', 2:'Wolny', 3:'Verlofdagen', 4:'Urlaub', 5:'Ferie', 6:'Vacaciones', 7:'Férias', 8:'Pausen' };

C_XL.d['delete'] = { 0:'Delete', 1:'Supprimer', 2:'Skasuj', 3:'Verwijderen', 4:'Löschen', 5:'Eliminare', 6:'Eliminar', 7:'Eliminar', 8:'Läschen' };
C_XL.d['save'] = { 0:'Save', 1:'Enregistrer', 2:'Zaoszczędzić', 3:'Opslaan', 4:'Speichern', 5:'Salvare', 6:'Guardar', 7:'Guardar', 8:'Späicheren' };
C_XL.d['confirm'] = { 0:'Confirm', 1:'Confirmer', 2:'Potwierdź', 3:'Bevestigen', 4:'Bestätigen', 5:'Confermare', 6:'Confirmar', 7:'Confirmar', 8:'Bestätegen' };
C_XL.d['cancel'] = { 0:'Cancel', 1:'annuler', 2:'anulować', 3:'annuleren', 4:'abbrechen', 5:'Cancellare', 6:'Cancelar', 7:'anular', 8:'Ofbriechen' };
C_XL.d['close'] = { 0:'Close', 1:'Fermer', 2:'Blisko', 3:'Sluiten', 4:'Schließen', 5:'Chiudere', 6:'Cerrar', 7:'Perto', 8:'Zoumaachen' };
C_XL.d['replan'] = { 0:'Replan', 1:'Replanifier', 2:'Zaplanuj ponownie', 3:'Herplannen', 4:'Umplanen', 5:'Riprogrammare', 6:'Reprogramar', 7:'Replanificar', 8:'Ëmplanzen' };
C_XL.d['duplicate'] = { 0:'Duplicate', 1:'Dupliquer', 2:'replikować', 3:'Repliceren', 4:'Duplizieren', 5:'Duplicare', 6:'Duplicar', 7:'Duplicar', 8:'Duebel maachen' };
C_XL.d['disabled'] = { 0:'Disabled', 1:'Désactivé', 2:'Wyłączony', 3:'Uit', 4:'Deaktviert', 5:'Disattivato', 6:'Desactivado', 7:'Desativado', 8:'Deaktivéiert' };
C_XL.d['ready'] = { 0:'Ready', 1:'Préparé', 2:'Gotowy', 3:'gereed', 4:'Bereit', 5:'Pronto', 6:'Listo', 7:'Preparado', 8:'Bereet' };

C_XL.d['quit'] = { 0:'Close and cancel changes', 1:'Quitter sans rien enregistrer', 2:'Zamknij', 3:'Sluiten zonder opslaan', 4:'Beenden', 5:'Lasciare senza salvare', 6:'Salir sin guardar', 7:'Sair sem gravar', 8:'Zoumaachen an Ännerungen ofbriechen' };
C_XL.d['add visitor'] = { 0:'add selected visitor', 1:'ajouter le visiteur séléctionné', 2:'add visitor', 3:'Geselecteerde bezoeker bijvoegen', 4:'Besucher hinzufügen', 5:'aggiungere il visitatore selezionato', 6:'añadir el visitante seleccionado', 7:'adicionar o visitante selecionado', 8:'Füügt de Visiteur dobäi' };
C_XL.d['car contract'] = { 0:'Car rental contract', 1:'Contrat de location voiture', 2:'Umowa najmu pojazdu', 3:'Vervangwagen huurcontract', 4:'Mietwagenvertrag', 5:'Contratto di noleggio macchina', 6:'Contrato de alquiler de coche ', 7:'Contrato de locação de veículo', 8:'Locatiounskontrakt fir Autoen' };
C_XL.d['linked doc'] = { 0:'Linked document', 1:'Document relatif', 2:'Związany dokumentu', 3:'Gekoppelde document', 4:'Verknüpftes Dokument', 5:'Documento relativo', 6:'Documento relativo', 7:'Documento relativo', 8:'Verknäppte Dokument' };

C_XL.d['extra space'] = { 0:'additional space', 1:'Espace supplémentaire', 2:'Dodatkowe miejsce', 3:'Extra ruimte', 4:'Zusätzlicher Raum', 5:'Spazio supplementare', 6:'Espacio adicional', 7:'Espaço extra', 8:'Zousätzleche Raum' };
C_XL.d['has no mobile'] = { 0:'Has no mobile number', 1:'N\'a pas de numéro de portable', 2:'Nie ma numeru telefonu komórkowego', 3:'Heeft geen GSM nummer', 4:'Hat keine Mobilnummer', 5:'Non ha numero di cellulare', 6:'No tiene número de móvil', 7:'Nenhum número de telemóvel', 8:'Keng Handysnummer' };
C_XL.d['phone slicing'] = { 0:'Phone number hyphenation', 1:'Césure des numéros de téléphone', 2:'Podział numerów telefonicznych', 3:'afbreking van telefoonnummers', 4:'Trennung von Mobilnummern', 5:'Separazione dei numeri di telefono', 6:'Espacios entre los números de teléfono', 7:'Separação dos números de telefone', 8:'Telefonnummer-Trennung' };

// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7

// tooltips for buttons
//
//
var kb 		= '<span class="fa fa-13x fa-keyboard"></span>&nbsp;'; // keyboard symbol (does not translate) !! No translation on this line
	
var sc = { 0:kb+'Shortcut key: ', 1:kb+'Raccourci clavier: ', 2:kb+'Skrót klawiaturowy: ', 3:kb+'Hotkey: ', 4:kb+'Tastenkombination: ', 5:kb+'Scorciatoia da tastiera: ', 6:kb+'Tecla de acceso directo: ', 7:kb+'Atalho de teclado: ', 8:kb+'Ofkierzsleef: ' };

var quit = { 0:'To quit mode press <strong>Esc</strong>', 1:'Pour sortir du mode: <strong>Esc</strong>', 2:'<strong>Esc</strong>: aby wyjść z trybu', 3:'<strong>Esc</strong> om te verlaten', 4:'<strong>Esc</strong> Taste drücken, um den Modus zu verlassen', 5:'Per uscire dal modo: <strong>Esc</strong>', 6:'Para salir de este modo presiona: <strong>Esc</strong>', 7:'Para sair do modo: <strong>Esc</strong>', 8:'Fir de Modus ze verloossen, dréckt <strong>Esc</strong>' };

var nl = '<br/>'; // no translation on this line
var pad = '&nbsp;&nbsp;&nbsp;&nbsp;'; // no translation on this line



C_XL.d['status'] = { 0:'Status', 1:'Statut', 2:'Stan', 3:'Staat', 4:'Status', 5:'Status', 6:'Estado', 7:'Estado', 8:'Status' };
C_XL.d['color'] = { 0:'Color', 1:'Couleur', 2:'Kolor', 3:'Kleur', 4:'Farbe', 5:'Colore', 6:'Color', 7:'Cor', 8:'Faarf' };
C_XL.d['colors'] = { 0:'Colors', 1:'Couleurs', 2:'kolorów', 3:'Kleuren', 4:'Farben', 5:'Colori', 6:'Colores', 7:'Cores', 8:'Faarwen' };
C_XL.d['pattern'] = { 0:'Pattern', 1:'Motif', 2:'Wzorzec', 3:'Patroon', 4:'Motiv', 5:'Motivo', 6:'Motivo', 7:'Motivo', 8:'Muster' };
C_XL.d['patterns'] = { 0:'Patterns', 1:'Motifs', 2:'Wzory', 3:'Patronen', 4:'Motive', 5:'Motivi', 6:'Motivos', 7:'Motivos', 8:'Muster' };
C_XL.d['tag'] = { 0:'Tag', 1:'Tag', 2:'Tag', 3:'Tag', 4:'Tag', 5:'Tag', 6:'Tag', 7:'Tag', 8:'Tag' };
C_XL.d['tags'] = { 0:'Tags', 1:'Tags', 2:'Tags', 3:'Tags', 4:'Tags', 5:'Tags', 6:'Tags', 7:'Tags', 8:'Tags' };
C_XL.d['skins'] = { 0:'Skins', 1:'Thèmes', 2:'Tematy', 3:'Thema\'s', 4:'Thema', 5:'Temi', 6:'Temas', 7:'Temas', 8:'Skins' };

C_XL.d['color off'] = { 0:'Unavailable', 1:'Indisponible', 2:'Zajęty/a', 3:'onbeschikbaar', 4:'Nicht verfügbar', 5:'Indisponibile', 6:'No disponible', 7:'Indisponível', 8:'Net verfügbar' };
C_XL.d['color excp'] = { 0:'Exceptionaly', 1:'Exceptionnellement', 2:'Wyjątkowo/a', 3:'Uitzonderlijk', 4:'außerordentlich', 5:'Eccezionalmente', 6:'Excepcionalmente', 7:'Excecionalmente', 8:'Aussergewéinlech' };
C_XL.d['color absent'] = { 0:'Closed', 1:'Fermé', 2:'Zamknięty', 3:'Gesloten', 4:'Geschlossen', 5:'Chiuso', 6:'Cerrado', 7:'Fechado', 8:'Zou' };
C_XL.d['color closed'] = { 0:'Closed', 1:'Fermé', 2:'Zamknięty', 3:'Gesloten', 4:'Geschlossen', 5:'Chiuso', 6:'Cerrado', 7:'Fechado', 8:'Zou' };

	// validation messages
	
C_XL.d['field ok']			= { 0:' ok', 1:' ok', 2:' ok', 3:' ok',	4:' ok', 5:' ok', 6:' ok', 7:' ok', 8:' ok'	};


// 		technical 				english:0,								french:1,									polish:2,										dutch:3,												german:4,															italian:5,											spanish:6,												portuguese:7

C_XL.d['not filled in'] = { 0:' is mandatory', 1:' ne peut rester vide', 2:' Wymagana informacja', 3:' moet ingevuld worden', 4:'angabe erforderlich', 5:'non può rimanere vuoto', 6:'No puede quedarse vacío', 7:'Não pode ficar em branco', 8:'ass obligatoresch' };
C_XL.d['not email'] = { 0:' is not a valid e-mail address', 1:" n'est pas une adresse mail", 2:' Niepoprawny adres e-mail', 3:' is geen e-mail adres', 4:'ist keine E-mail Adresse', 5:'non è un indirizzo email', 6:'No es una dirección email', 7:'não é um endereço de e-mail', 8:'ass keng valabel E-Mail-Adress' };
C_XL.d['not price'] = { 0:' A valid € price format looks like 10.50', 1:' Le format du prix en € est p.ex 10.50', 2:'Ważne € format cena wygląda 10.50', 3:' Een geldige € prijs formaat ziet er als 10.50', 4:'Ein gültiges € Preisformat sieht ist zB 10.50', 5:'Il formato del prezzo in € è per esempio 10.50', 6:'El formato del precio en € es por ejemplo 10.50', 7:'O formato do preço em € é, por exemplo, 10,50', 8:'E gülteg Präisformat ass wéi 10,50' };
C_XL.d['not mobile'] = { 0:' is not a mobile number', 1:" n'est pas un numéro de portable", 2:' Niepoprawny numere telefonu komórkowego.', 3:' is geen GSM nummer', 4:'ist keine Mobilnummer', 5:'Non è un numero di cellulare', 6:'No es un número de móvil', 7:'não é um número de telemóvel', 8:'ass keng Handysnummer' };
C_XL.d['not phone'] = { 0:' is not a phone number', 1:" n'est pas un numéro de téléphone", 2:' Niepoprawny numere telefonu.', 3:' is geen telefoon nummer', 4:'ist keine Telefonnummer', 5:'Non è un numero di telefono', 6:'No es un número de teléfono', 7:'não é um número de telefone', 8:'ass keng Telefonsnummer' };
C_XL.d['not letters'] = { 0:' must be letters only', 1:" ne peut contenir que des lettres", 2:' Może zawierać tylko litery', 3:' mag enkel uit letters bestaan', 4:'kann nur aus Buchstaben bestehen', 5:'Non può contenere altro che lettere', 6:'Solo puede contener letras', 7:'só pode conter letras', 8:'darf nëmmen aus Buschtawen bestoen' };
C_XL.d['not alpha'] = { 0:' must be letters and/or figures', 1:" doit être en chiffres et/ou en lettres", 2:' muszą być literami i/lub dane', 3:' moeten letters en/of cijfers', 4:'muss aus Ziffern und/oder Buchstaben bestehen', 5:'Può contenere cifre e/o lettere', 6:'Puede contener letras e/o números', 7:'só pode conter letras e/ou números', 8:'muss aus Buschtawen an/oder Zuelen bestoen' };
C_XL.d['not numeric'] = { 0:' must be numeric', 1:' doit être en chiffres', 2:' Może zawierać tylko liczby', 3:' moet een nummers zijn', 4:'kann nur Ziffern enthalten', 5:'Deve essere in cifre', 6:'Tiene que ser en números', 7:'deve ser em algarismos', 8:'muss nëmmen Zuelen enthalen' };
C_XL.d['not url'] = { 0:' is not a valid url format', 1:" le format url n'est pas correct", 2:' Nieprawidłowy url. Wybierz inny.', 3:' het formaat van de url is niet correct', 4:'Das Format der URL-Adresse ist nicht gültig', 5:'Il formato url non è valido', 6:'El formato url no es válido', 7:'O formato url não está correto', 8:'ass keng valabel URL' };
C_XL.d['bad e-url'] = { 0:' unavailable url: choose another one', 1:" url non disponible: choisir un autre", 2:' Nieprawidłowy url. Wybierz inny.', 3:' onbeschikbare url: kies iets anders', 4:'URL-Adresse nicht verfügbar, bitte wählen Sie eine andere ', 5:'url indisponibile: sceglierne un altro', 6:'url no disponible: escoger otro', 7:'url não disponível: escolher outro', 8:'URL net disponibel, wielt eng aner' };
C_XL.d['bad format'] = { 0:'the format is incorrect', 1:'le format est incorrect', 2:'format jest niepoprawny.', 3:'het formaat is onjuist', 4:'das Format ist falsch', 5:'il formato non è corretto', 6:'el formato es incorrecto', 7:'o formato está incorreto', 8:'de Format ass falsch' };


C_XL.d['bad login'] = { 
    0:'invalid login, please read from the blueprint for help',
    1:'login non valide, svp aidez-vous à l\'aide du texte bleu.',
    2:'nieprawidłowy login, przeczytaj plan, aby uzyskać pomoc',
    3:'ongeldige login, Lees aub de blauwdruk voor hulp',
    4:'Ungültiger Login, bitte lesen Sie den Blueprint, um Hilfe zu erhalten',
    5:'accesso non valido, leggere il progetto per assistenza',
    6:'inicio de sesión no válido, lea el plano para obtener ayuda',
    7:'login inválido, leia o modelo para obter ajuda',
    8:'Ongëltegen Login, liest w.e.g. den Blueprint fir Hëllef' 
};


	
// 	english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7


C_XL.d['dd-mm-yyyy'] = { 
    0:'dd-mm-yyyy',
    1:'jj-mm-aaaa',
    2:'dd-mm-yyyy',
    3:'dd-mm-jjjj',
    4:'tt-mm-jjjj',
    5:'gg-mm-aaaa',
    6:'dd-mm-aaaa',
    7:'dd-mm-aaaa',
    8:'dd-mm-yyyy' 
};

C_XL.d['not bdate'] = { 
    0:' A valid date of birth format is dd-mm-yyyy',
    1:' Le format correcte pour la date de naissance est jj-mm-aaaa',
    2:' Poprawny format daty urodzenia jest dd-mm-rrrr',
    3:' Het juiste formaat voor de geboortedatum is dd-mm-jjjj',
    4:'Ein gültiges Format für das Geburtsdatum ist tt-mm-jjjj',
    5:' Il formato corretto per la data di nascita è gg-mm-aaaa',
    6:' El formato correcto para la fecha de nacimiento es dd-mm-aaaa',
    7:' O formato correto para a data de nascimento é dd-mm-aaaa',
    8:'E gültegt Gebuertsdatum Format ass dd-mm-yyyy' 
};

								
	// Adding translations in Luxembourgish (Lux) as item 8:


C_XL.d['invalid form'] = { 
    0:'Some fields are not appropriately filled in, please correct them, or cancel',
    1:'Certains champs ne sont pas correctement remplis, corrigez les ou annuler',
    2:'Popraw błędnie wypełnione pola lub anuluj',
    3:'Sommige velden zijn onterecht ingevuld',
    4:'Einige Felder wurden nicht richtig ausgefüllt, bitte korrigieren oder abbrechen',
    5:'alcuni campi non sono riempiti correttamente, per favore li corregga o li cancelli',
    6:'algunas casillas no están llenadas correctamente, por favor corríjalas o cancélelas',
    7:'alguns campos não foram devidamente preenchidos. Por favor corrija-os ou anule.',
    8:'E puer Felder sinn net korrekt ausgefëllt, korrigéiert se w.e.g. oder annulléiert' 
};

C_XL.d['connection failed'] = { 
    0:'The server is unreachable, check your internet connection first, then please try again.',
    1:'Le serveur est inaccessible, vérifiez votre connexion Internet, puis s\'il vous plaît essayer à nouveau.',
    2:'Serwer jest niedostępny, sprawdź połączenie internetowe, następnie spróbuj ponownie.',
    3:'De server lijkt onbereikbaar te zijn, controleer dan eerst uw internetverbinding, dan kunt u het opnieuw proberen.',
    4:'Der Server ist nicht erreichbar, bitte überprüfen Sie Ihre internetverbinding und versuchen Sie es erneut',
    5:'Il server è inaccessibile, verifichi la Sua connessione internet e provi di nuovo per favore.',
    6:'El servidor está inaccesible, verifique su conexión a internet e inténtelo de nuevo por favor.',
    7:'O servidor encontra-se inacessível. Verifique a sua ligação à internet e tente novamente por favor.',
    8:'De Server ass net erreechbar, kontrolléiert w.e.g. Är Internetverbindung a probéiert nach eng Kéier' 
};


C_XL.d['please fill in'] = { 
    0:'Can not be left empty',
    1:'Ne peut rester vide',
    2:'Nie może być pusty',
    3:'Mag niet leeg blijven',
    4:'Darf nicht leer sein',
    5:'Non può rimanere vuoto',
    6:'No se puede quedar vacío',
    7:'Não pode estar em branco',
    8:'Darf net eidel gelooss ginn' 
};


C_XL.d['no e-search result'] = { 
    0:'There is no availability corresponding to your search',
    1:'Il n\'y a aucune disponibilité correspondant à votre recherche',
    2:'Brak dostępności odpowiadającej twojemu wyszukiwaniu',
    3:'Er is geen beschikbaarheid die overeenkomt met de gekozen opties',
    4:'Es gibt keine Verfügbarkeit für Ihre Suche',
    5:'Non c\'è disponibilità corrispondente alla tua ricerca',
    6:'No hay disponibilidad correspondiente a su búsqueda',
    7:'Não há disponibilidade correspondente à sua pesquisa',
    8:'Et gëtt keng Disponibilitéit déi Är Sich entsprécht' 
};


	// swapping agendas
C_XL.d['swaping from']	= { 0:'Do you want to switch the day assignments of',	1:'Voulez-vous échanger la journée de',				2:'Podmiana harmonogramu z dnia',	3:'Wilt u de toewijzigingen van',			4:'Tauschen der Tagesaufgaben vom',					5:'Vuole cambiare la giornata del',				6:'Desea cambiar el día de', 	7:'Deseja trocar o dia de', 8:'Wëllt Dir d\'Dageszouweisungen wiesselen?'	};
C_XL.d['swaping to']	= { 0:'with the ones of',								1:'avec celle de',									2:'na harmonogram z dnia',			3:'wisselen met die van',					4:'mit denen von',									5:'con quella del',								6:'con el de', 					7:'com o de', 				8:'mat deenen vum'								};
C_XL.d['swap future']	= { 0:'applies also for following days',				1:'appliquer aussi à tous les jours qui suivent',	2:'Zastosować do kolejnych dni',	3:'Ook toepassen op volgende dagen',		4:'auch auf alle darauffolgenden Tage anwenden',	5:'applicare anche a tutti i giorni seguenti',	6:'aplicar también a todos los días siguientes', 7:'aplicar também a todos os dias seguintes', 8:'gëllt och fir déi folgend Deeg' };

// SMS display

								
C_XL.d['before']	= { 0:'before',		1:'avant le',		2:'przed',		3:'voor',		4:'vor dem',	5:'prima del',	6:'antes del', 		7:'antes de', 	8:'virun'	};
C_XL.d['after']		= { 0:'after',		1:'après le',		2:'od',			3:'na',			4:'nach dem',	5:'dopo il',	6:'después del', 	7:'depois de', 	8:'no'	};
C_XL.d['since']		= { 0:'since',		1:'depuis le',		2:'ponieważ',	3:'sinds',		4:'seit',		5:'dal',		6:'desde', 			7:'desde', 		8:'zënter'	};
C_XL.d['and after']	= { 0:'and after',	1:'et ensuite',		2:'a następnie',3:'en daarna',	4:'und ab',		5:'e dopo',		6:'y después', 		7:'e depois', 	8:'an duerno'	};


	// not before control	

// 		technical 			english:0,		french:1,			polish:2,				dutch:3,				german:4,			italian:5,		spanish:6,			portuguese:7


C_XL.d['not before'] 	= { 0:'Not before',	1:'Pas avant',		2:'Dopiero',			3:'Voorstellen vanaf',	4:'Nicht vor',		5:'Non prima',	6:'No antes', 		7:'Não antes de', 	8:'Net virun'	};
C_XL.d['absent before'] = { 0:'before',		1:'avant',			2:'dopiero',			3:'voor',				4:'vor',			5:'prima',		6:'antes', 			7:'antes', 			8:'virun'			};
C_XL.d['absent after'] 	= { 0:'after',		1:'après',			2:'Nie po',				3:'na',					4:'nach',			5:'dopo',		6:'después', 		7:'depois', 		8:'no'			};
C_XL.d['urgent']	 	= { 0:'Urgent',		1:'Urgent',			2:'Pilne',				3:'Dringend',			4:'Dringend',		5:'Urgente',	6:'Urgente', 		7:'Urgente', 		8:'Dréngend'			};
C_XL.d['today']	 		= { 0:'Today',		1:'aujourd\'hui',	2:'Dzisiaj',			3:'Vandaag',			4:'Heute',			5:'Oggi',		6:'Hoy', 			7:'Hoje', 			8:'Haut'			};
C_XL.d['tomorrow']	 	= { 0:'Tomorrow',	1:'Demain',			2:'Dopiero jutro',		3:'Morgen',				4:'Morgen',			5:'Domani',		6:'Mañana', 		7:'amanhã', 		8:'Muer'			};
C_XL.d['yesterday']	 	= { 0:'yesterday',	1:'hier',			2:'wczoraj',			3:'gisteren',			4:'gestern',		5:'ieri',		6:'ayer', 			7:'ontem', 			8:'Gëschter'			};
C_XL.d['schedule']		= { 0:'Schedule',	1:'Timing',			2:'Harmonogram',		3:'afspraak',			4:'Uhrzeit',		5:'Timing',		6:'Planificación', 	7:'Timing', 		8:'Zeitplang'			};

C_XL.d['asap']	 		= { 0:'as soon as possible',1:'aussitôt que possible',	2:'Tak szybko, jak to możliwe',	3:'Zo snel mogelijk',	4:'Sobald wie möglich',		5:'Il prima possibile',	6:'En cuanto sea posible', 		7:'O mais rápido possível', 8:'Sou séier wéi méiglech'	};
C_XL.d['current day']	= { 0:'in the current day',	1:'dans la journée',		2:'w dzisiejszym dniu',			3:'in de huidige dag', 	4:'am aktuellen Tag',		5:'nel giorno corrente',6:'en el día actual', 			7:'no dia atual', 			8:'am aktuellen Dag' 			};
C_XL.d['current week']	= { 0:'in the current week',1:'dans cette semaine',		2:'w bieżącym tygodniu',		3:'in de huidige week', 4:'in der aktuellen Woche',	5:'nella settimana in corso',6:'en la semana actual', 	7:'na semana atual', 		8:'an der aktueller Woch' 		};
C_XL.d['after tomorrow']= { 0:'after tomorrow',		1:'après demain',			2:'Pojutrze',					3:'Overmorgen',			4:'Übermorgen',				5:'Dopo domani',		6:'Pasado mañana', 				7:'Depois de amanhã', 		8:'Iwwermuer'		};
C_XL.d['within 3 days']	= { 0:'Until three days',	1:'Dans trois jours',		2:'Dopiero trzy dni',			3:'Pas drie dagen',		4:'In drei Tagen',			5:'Tra tre giorni',		6:'Dentro de tres días', 		7:'Daqui a três dias', 		8:'An dräi Deeg'		};

C_XL.d['next week'] 	= { 0:'Next week',		1:'Semaine prochaine',2:'W przyszłym tygodniu',	3:'Volgende week',	4:'Nächste Woche',		5:'Settimana prossima',	6:'La semana que viene',	7:'Na próxima semana', 		8:'Nächst Woch'		};
C_XL.d['one week'] 		= { 0:'One week',		1:'Une semaine',	2:'Za tydzień',				3:'Eén week',		4:'Eine Woche',			5:'Una settimana',		6:'Una semana', 			7:'Uma semana', 			8:'Eng Woch'		};
C_XL.d['two weeks'] 	= { 0:'Two weeks',		1:'Deux semaines',	2:'Za dwa tygodnie',		3:'Twee weken',		4:'Zwei Wochen',		5:'Due settimane',		6:'Dos semanas', 			7:'Duas semanas', 			8:'Zwee Wochen'		};
C_XL.d['three weeks'] 	= { 0:'Three weeks',	1:'Trois semaines',	2:'Za trzy tygodnie',		3:'Drie weken',		4:'Drei Wochen',		5:'Tre settimane',		6:'Tres semanas', 			7:'Três semanas', 			8:'Dräi Wochen'		};
C_XL.d['five weeks'] 	= { 0:'Five weeks',		1:'Cinq semaines',	2:'Za pięć tygodni',		3:'Vijf weken',		4:'Fünf Wochen',		5:'Cinque settimane',	6:'Cinco semanas', 			7:'Cinco semanas', 			8:'Fënnef Wochen'	};
C_XL.d['six weeks'] 	= { 0:'Six weeks',		1:'Six semaines',	2:'sześć tygodni',			3:'Zes weken',		4:'Sechs Wochen',		5:'Sei settimane',		6:'Seis semanas', 			7:'Seis semanas', 			8:'Sechs Wochen'	};
C_XL.d['next month'] 	= { 0:'Next month',		1:'Mois prochain',	2:'W przyszłym miesiącu',	3:'Volgende maand',	4:'Nächsten Monat',		5:'Il mese prossimo',	6:'El mes que viene', 		7:'No próximo mês', 		8:'Nächste Mount'	};
C_XL.d['one month'] 	= { 0:'One month',		1:'Un mois',		2:'Za miesiąc',				3:'Eén maand',		4:'Ein Monat',			5:'Un mese',			6:'Un mes', 				7:'Um mês', 				8:'Ee Mount'		};
C_XL.d['two months']	= { 0:'Two months',		1:'Deux mois',		2:'Za dwa miesiące',		3:'Twee maand',		4:'Zwei Monate',		5:'Due mesi',			6:'Dos meses', 				7:'Dois meses', 			8:'Zwee Méint'		};
C_XL.d['three months'] 	= { 0:'Three months',	1:'Trois mois',		2:'Za trzy miesiące',		3:'Drie maanden',	4:'Drei Monate',		5:'Tre mesi',			6:'Tres meses', 			7:'Três Meses', 			8:'Dräi Méint'		};
C_XL.d['four months'] 	= { 0:'Four months',	1:'Quatre mois',	2:'Cztery miesiące',		3:'Vier maanden',	4:'Vier Monate',		5:'Quattro mesi',		6:'Cuatro meses', 			7:'Quatro meses', 			8:'Véier Méint'		};
C_XL.d['five months'] 	= { 0:'Five months',	1:'Cinq mois',		2:'Pięć miesięcy',			3:'Vijf maanden',	4:'Fünf Monate',		5:'Cinque mesi',		6:'Cinco meses', 			7:'Cinco meses', 			8:'Fënnef Méint'	};
C_XL.d['six months'] 	= { 0:'Six months',		1:'Six mois',		2:'Sześć miesięcy',			3:'Zes maanden',	4:'Sechs Monate',		5:'Sei mesi',			6:'Seis meses', 			7:'Seis meses', 			8:'Sechs Méint'		};
C_XL.d['eight months'] 	= { 0:'Eight months',	1:'Huit mois',		2:'Osiem miesięcy',			3:'acht maanden',	4:'acht Monate',		5:'Otto mesi',			6:'Ocho meses', 			7:'Oito meses', 			8:'Aacht Méint'		};
C_XL.d['nine months'] 	= { 0:'Nine months',	1:'Neuf mois',		2:'Dziewięć miesięcy',		3:'Negen maanden',	4:'Neun Monate',		5:'Nove mesi',			6:'Nueve meses', 			7:'Nove meses', 			8:'Néng Méint'		};
C_XL.d['one year'] 		= { 0:'One year',		1:'Un an',			2:'Jeden rok',				3:'Een jaar',		4:'Ein Jahr',			5:'Un anno',			6:'Un año', 				7:'Um ano', 				8:'Ee Joer'			};
C_XL.d['specifics']	 	= { 0:'Specifics',		1:'Particularités',	2:'specyficzność',			3:'specificiteit',	4:'Besonderheiten',		5:'Particolarità',		6:'Requisitos especiales', 	7:'Requisitos especiais', 	8:'Besonnesches'	};
C_XL.d['every weekday']	= { 0:'Every',			1:'Chaque',			2:'W każdą',				3:'Ieder',			4:'Jeder',				5:'Ogni',				6:'Cada', 					7:'Cada mililitro de', 		8:'All Dag'			};
C_XL.d['duration'] 		= { 0:'Duration',		1:'Durée',			2:'Jak długo',				3:'Duurtijd',		4:'Dauer',				5:'Durata',				6:'Duración', 				7:'Duração', 				8:'Dauer'			};
C_XL.d['longer'] 		= { 0:'Longer',			1:'Plus long',		2:'już',					3:'Langer',			4:'Länger',				5:'Più tempo',			6:'Más tiempo', 			7:'Mais tempo', 			8:'Méi laang'		};
C_XL.d['minutes'] 		= { 0:'minutes',		1:'minutes',		2:'minut',					3:'minuten',		4:'Minuten',			5:'Minuti',				6:'minutos', 				7:'minutos', 				8:'Minutten'		};
C_XL.d['min'] 			= { 0:'min',			1:'min',			2:'min',					3:'min',			4:'min',				5:'min',				6:'min', 					7:'min', 					8:'min'				};
C_XL.d['staffing'] 		= { 0:'Staffing',		1:'Contingent',		2:'Liczba pracowników',		3:'Staffing',		4:'Personalbesetzung',	5:'Contingente',		6:'Contingente', 			7:'Contingente', 			8:'Personal'		};
C_XL.d['preview'] 		= { 0:'Preview',		1:'aperçu',			2:'Zapowiedź',				3:'Voorbeeld',		4:'Vorschau',			5:'anteprima',			6:'Previsualización', 		7:'Visão geral', 			8:'Iwwerbléck'		};
	
	
	// tracking / audit
	
// 		technical 				english:0,		french:1,			polish:2,				dutch:3,				german:4,				italian:5,			spanish:6,				portuguese:7
	
	
C_XL.d['data class'] 	= { 0:'Data class',		1:'Classe',			2:'Dane klasy',			3:'Class data',			4:'Datenklasse',		5:'Classe',			6:'Clase', 				7:'Classe', 		8:'Donnéeklass'			};
C_XL.d['last login'] 	= { 0:'Last login',		1:'Dernier accès',	2:'Ostatnie logowanie',	3:'Laatste inlogging',	4:'Letzter Zugriff',	5:'Ultimo accesso',	6:'Último acceso', 		7:'Último acesso', 	8:'Leschten Login'	};
C_XL.d['data id'] 		= { 0:'Data id',		1:'Identifiant',	2:'Identyfikator',		3:'Identificatie',		4:'Kennung',			5:'Identificativo',	6:'Nombre de usuario', 	7:'Identificador', 	8:'Donnée-Id'		};

C_XL.d['creation'] 		= { 0:'Creation',		1:'Création',		2:'Wprowadzenie',		3:'Invoering',			4:'Erstellung',			5:'Creazione',		6:'Creación', 		7:'Criação', 		8:'Kreatioun'			};
C_XL.d['modification'] 	= { 0:'Modification',	1:'Modification',	2:'Modyfikacja',		3:'aanpassing',			4:'Änderung',			5:'Modifica',		6:'Modificación', 	7:'Modificação', 	8:'Modifikatioun'		};
C_XL.d['deletion'] 		= { 0:'Deletion',		1:'Effacement',		2:'Usunięcie',			3:'Verwijdering',		4:'Löschung',			5:'Cancellazione',	6:'Supresión', 		7:'apagar', 		8:'Läschung'			};
C_XL.d['merging'] 		= { 0:'Merging',		1:'Fusionnement',	2:'Fuzja',				3:'Fusie',				4:'Fusion',				5:'Fusione',		6:'Fusión', 		7:'Fusão', 			8:'Zesummeleeën'			};

C_XL.d['created on'] 	= { 0:'Created on',		1:'Créé le',		2:'Wpis',				3:'Invoering op',		4:'Erstellt am',	5:'Creato il',			6:'Creado el', 		7:'Criado em', 		8:'Erstallt den'		};
C_XL.d['changed on'] 	= { 0:'Updated on',		1:'Modifié le',		2:'Zmiana',				3:'aangepast op',		4:'Geändert am',	5:'Modificato il',		6:'Modificado el', 	7:'Modificado em', 	8:'Geännert den'	};
C_XL.d['deleted on'] 	= { 0:'Deleted on',		1:'Effacé le',		2:'Wymazany',			3:'Gewist op',			4:'Gelöscht am',	5:'Cancellato il',		6:'Borrado el', 	7:'apagado em', 	8:'Geläscht den'		};
C_XL.d['rescheduled on']= { 0:'rescheduled on',	1:'reporté le',		2:'przesuwany',			3:'verplaatst op',		4:'Verschoben am',	5:'Riprogrammato il',	6:'aplazado el', 	7:'comunicado em', 	8:'Neigeplangt den'	};
C_XL.d['merged on'] 	= { 0:'Merged on',		1:'Fusionné le',	2:'Połączenie',			3:'Samengevoegd op',	4:'Zusammengeführt am',		5:'Fuso il',	6:'Fusionado el', 	7:'Fundido em', 	8:'Zesummegefouert den'		};

C_XL.d['created by'] 	= { 0:'Created by',		1:'Créé par',		2:'Stworzony przez',	3:'Invoering door',		4:'Erstellt von',	5:'Creato da',			6:'Creado por', 	7:'Criado por', 	8:'Erstallt vun'		};
C_XL.d['changed by'] 	= { 0:'Updated by',		1:'Modifié par',	2:'Edytowany przez',	3:'aangepast door',		4:'Geändert von',	5:'Modificato da',		6:'Modificado por', 7:'Modificado por', 8:'Geännert vun'	};
C_XL.d['deleted by'] 	= { 0:'Deleted by',		1:'Effacé par',		2:'Zdaje przez',		3:'Gewist door',		4:'Gelöscht von',	5:'Cancellato da',		6:'Borrado por', 	7:'apagado por', 	8:'Geläscht vun'		};
C_XL.d['rescheduled by']= { 0:'rescheduled by',	1:'reporté par',	2:'Przełożony przez',	3:'verplaatst door',	4:'Verschoben von',	5:'Riprogrammato da',	6:'aplazado por', 	7:'relatado por', 	8:'Neigeplangt vun'	};
C_XL.d['merged by'] 	= { 0:'Merged by',		1:'Fusionné par',	2:'Scalony przez',		3:'Samengevoegd door',	4:'Zusammengeführt von', 5:'Fuso da',		6:'Fusionado por', 	7:'Fundido por', 	8:'Zesummegefouert vun'	};

C_XL.d['creator'] 		= { 0:'Created by',		1:'Créé par',		2:'autor wpisu',		3:'Gemaakt door',		4:'Erstellt von',	5:'Creato da',			6:'Creado por', 	7:'Criado por', 	8:'Erstallt vun'		};
C_XL.d['changer'] 		= { 0:'Changed by',		1:'Modifié par',	2:'autor zmiany wpisu',	3:'aangepast door',		4:'Geändert von',	5:'Modificato da',		6:'Modificado por', 7:'Modificado por', 8:'Geännert vun'	};
C_XL.d['deletor'] 		= { 0:'Deleted by',		1:'Effacé par',		2:'Usunięte przez',		3:'Gewist door',		4:'Gelöscht von',	5:'Cancellato da',		6:'Borrado por', 	7:'apagado por', 	8:'Geläscht vun'		};
C_XL.d['deleted'] 		= { 0:'Deleted',		1:'Effacé',			2:'Wymazany',			3:'Gewist',				4:'Gelöscht',		5:'Cancellato',			6:'Borrado', 		7:'apagado', 		8:'Geläscht'			};
C_XL.d['rescheduled'] 	= { 0:'rescheduled',	1:'reporté',		2:'rzełożony',			3:'verplaatst',			4:'Verschoben',		5:'Riprogrammato',		6:'aplazado', 		7:'relatado', 		8:'Neigeplangt'		};
C_XL.d['merged'] 		= { 0:'Merged',			1:'Fusionné',		2:'Scalone',			3:'Samengevoegd',		4:'Verschmolzen', 	5:'Fuso',				6:'Fusionado', 		7:'Fundido', 		8:'Zesummegefouert'			};
C_XL.d['resa busy'] 	= { 0:'prebooking',		1:'préréservé',		2:'wstępna rezerwacja',	3:'voorboeking',		4:'Vorbestellung', 	5:'pre-prenotazione',	6:'pre-reserva', 	7:'pré reserva', 	8:'Virbuchung'		};

C_XL.d['new'] 			= { 0:'New',			1:'Nouveau',		2:'Nowy',				3:'Nieuwe',				4:'Neu',						5:'Nuovo',					6:'Nuevo', 				7:'Novo', 					8:'Nei'		};
C_XL.d['now'] 			= { 0:'Now',			1:'Maintenant',		2:'Teraz',				3:'Nu',					4:'Jetzt',						5:'adesso',					6:'ahora', 				7:'agora', 					8:'Elo'		};
C_XL.d['never'] 		= { 0:'Never',			1:'Jamais',			2:'Nigdy',				3:'Nooit',				4:'Niemals',					5:'Mai',					6:'Nunca', 				7:'Nunca', 					8:'Niemols'		};
C_XL.d['no one'] 		= { 0:'No one',			1:'Personne',		2:'Nikt',				3:'Niemand',			4:'Niemand',					5:'Nessuno',				6:'Ningún', 			7:'Pessoa', 				8:'Keen'		};
C_XL.d['synchro id'] 	= { 0:'Synchro id',		1:'Id synchro',		2:'Id synchronizacja',	3:'Synchronisatie id',	4:'Synchronisierungskennung',	5:'Sincronizzazione di Id',	6:'Sincronización id', 	7:'Sincronização de ID', 	8:'Synchronisatioun Id'	};
C_XL.d['synched on'] 	= { 0:'Synchro time',	1:'Synchronisé le',	2:'Zsynchronizowane',	3:'Synchronisatie op',	4:'Synchronisiert am',			5:'Sincronizzato il',		6:'Sincronizado el', 	7:'Sincronizado em', 		8:'Synchroniséiert den'	};
C_XL.d['files'] 		= { 0:'Files',			1:'Fichiers',		2:'Plik',				3:'Bestanden',			4:'Dateien',					5:'Files',					6:'Ficheros', 			7:'Ficheiros', 				8:'Fichieren'	};
C_XL.d['file'] 			= { 0:'File',			1:'Fichier',		2:'Plik',				3:'Bestand',			4:'Datei',						5:'File',					6:'Fichero', 			7:'Ficheiro', 				8:'Fichier'		};
C_XL.d['folder'] 		= { 0:'Folder',			1:'Dossier',		2:'Plik',				3:'Map',				4:'Ordner',						5:'Cartella',				6:'Carpeta', 			7:'Dossier', 				8:'Dossier'		};
C_XL.d['document'] 		= { 0:'Document',		1:'Document',		2:'Dokument',			3:'Document',			4:'Dokument',					5:'Documento',				6:'Documento', 			7:'Documento', 				8:'Dokument'		};


	// resource identification
	
// 		technical 				english:0,		french:1,				polish:2,			dutch:3,				german:4,			italian:5,					spanish:6,						portuguese:7

	
C_XL.d['reservability'] = { 0:'Reservability',	1:'Réservable',			2:'Rezerwacja',		3:'Reserveerbaar',		4:'Reservierbar',	5:'Prenotabile',			6:'Reservable', 				7:'Reservável', 					8:'Reservéierbarkeet'	};
C_XL.d['time buffer'] 	= { 0:'time buffer',	1:'temps de maintien',	2:'bufor czas',		3:'tijd buffer',		4:'Pufferzeit',		5:'tempo di mantenimento',	6:'Tiempo de mantenimiento', 	7:'tempo de manutenção do dia', 	8:'Zäitpuffer'		};
C_XL.d['allday'] 		= { 0:'all day',		1:'à la journée',		2:'na cały dzień',	3:'voor de hele dag',	4:'Ganztag',		5:'al giorno',				6:'todo el día', 				7:'como a consulta', 				8:'Ganzen Dag'		};
C_XL.d['scheduled'] 	= { 0:'scheduled',		1:'comme le RDV',		2:'na czas wizyty',	3:'volgens afspraak',	4:'Geplant',		5:'come l\'appuntamento',	6:'programado', 				7:'assinatura', 					8:'Gëplangt'		};
C_XL.d['signature'] 	= { 0:'Signature',		1:'Signature',			2:'Podpis',			3:'Benaming',			4:'Unterschrift',	5:'Firma',					6:'Firma', 						7:'assinatura por SMS e e-mails', 	8:'Ënnerschrëft'	};



	// A C C O U N T    C O N F I G
	//
	
	// global account preferences tabs
		
C_XL.d['account'] 	= { 0:'account',			1:'Compte',				2:'Konto',			3:'account',		4:'Konto',			5:'Conto',			6:'Cuenta', 		7:'Conta', 8:'Kont'			};
C_XL.d['display'] 	= { 0:'Display',			1:'affichage',			2:'Wyświetlania',	3:'Weergave',		4:'anzeige',		5:'Visualizzazione',6:'Visualización', 	7:'Exibição', 8:'Affichage'		};
C_XL.d['agendas'] 	= { 0:'agendas',			1:'agendas',			2:'Porządek',		3:'agendas',		4:'Kalender',		5:'agende',			6:'agenda', 		7:'agendas', 8:'Agendas'			};
C_XL.d['logins'] 	= { 0:'Logins',				1:'Logins',				2:'Loginów',		3:'Toegang',		4:'Logins',			5:'Logins',			6:'Logins', 		7:'Logins', 8:'Logins'			};
C_XL.d['comms']		= { 0:'Communications',		1:'Communications',		2:'Komunikacja',	3:'Communicaties',	4:'Kommunikation',	5:'Comunicazioni',	6:'Comunicaciones', 7:'Comunicações', 8:'Kommunikatiounen'	};
C_XL.d['workcodes'] = { 0:'Performances',		1:'Prestations',		2:'Usług',			3:'Prestaties',		4:'Leistungen',		5:'Prestazioni',	6:'Servicios', 		7:'Prestações', 8:'Leeschtungen'		};
C_XL.d['inclusive'] = { 0:'Inclusive',			1:'Inclus',				2:'Włącznie',		3:'Inbegrepen',		4:'Inklusiv',		5:'Incluso',		6:'Incluido', 		7:'Incluído', 8:'Inklusiv'		};


						
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7
								
								
C_XL.d['colors&status'] 	= { 0:'Colors & Status',	1:'Couleurs & Statuts',			2:'Kolory i status',		3:'Kleuren & Status',		4:'Farben & Status',			5:'Colori & Status',		6:'Colores y estados', 		7:'Cores e Estatutos', 8:'Faarwen a Status'	};
C_XL.d['business name']		= {	0:'account name',		1:'Nom du compte',				2:'Nazwa konta',			3:'accountnaam',			4:'Kontoname',					5:'Nome del conto',			6:'Nombre de la cuenta',	7:'Nome da conta', 8:'Kontonumm'		};
C_XL.d['customer id']		= {	0:'Customer id',		1:'Numéro de client',			2:'Numer klienta',			3:'Klant nummer',			4:'Kundennummer',				5:'Numero di cliente',		6:'Número cliente', 		7:'Número de cliente', 8:'Clientennummer'	};
C_XL.d['business']			= { 0:'Business',			1:'Etablissement',				2:'Firma',					3:'Business',				4:'Firma',						5:'azienda',				6:'Empresa', 				7:'Estabelecimento', 8:'Betrib'			};
C_XL.d['configuration']		= { 0:'Configuration',		1:'Configuration',				2:'Konfiguracja',			3:'Configuratie',			4:'Einstellung',				5:'Configurazione',			6:'Configuración', 			7:'Configuração', 8:'Konfiguratioun'	};
C_XL.d['business info']		= { 0:'Business info',		1:'Informations de base',		2:'Dane podstawowe',		3:'algemene gegevens',		4:'allgemeine Informationen',	5:'Informazioni di base',	6:'Información básica', 	7:'Informações de base', 8:'Betribsinformatiounen'	};
C_XL.d['patient or client']	= { 0:'Visitors',			1:'Visiteurs',					2:'Klienci',				3:'Bezoekers',				4:'Besucher',					5:'Visitatori',				6:'Visitantes', 			7:'Visitantes', 8:'Visiteuren'			};

C_XL.d['support contact']	= { 0:'Your seller',		1:'Votre délégué',				2:'Przedstawiciel',			3:'U afgevaardigd',			4:'Ihr Verkäufer',				5:'Il Suo rappresentante',	6:'Su delegado', 			7:'O seu delegado', 8:'Ären Verkeefer'	};
C_XL.d['your contract']		= { 0:'Your contract',		1:'Votre contrat',				2:'Umowa',					3:'U contrakt',				4:'Ihr Vertrag',				5:'Il Suo contratto',		6:'Su contrato', 			7:'O seu contrato', 8:'Äre Kontrakt'	};

/* ONLINE PAYMENT - Mobminder-pay */

C_XL.d['ep-use payment']	= { 0:'Payment management',	1:'Gestion des paiements',	2:'zarządzanie płatnościami',	3:'betalingsbeheer',		4:'Zahlungsverwaltung',			5:'gestione dei pagamenti',		6:'gestión de pagos', 		7:'gestão de pagamentos', 	8:'Bezuelungsverwaltung'	};

C_XL.d['paiement ok']		= { 0:'Paiement status',		1:'arriérés',				2:'Stan płatności',			3:'Regelings status',		4:'Zahlungsstatus',				5:'arretrati',					6:'Estado de pago', 		7:'atrasos', 				8:'Bezuelungsstatus'	};
C_XL.d['e-handle']			= { 0:'e-Pay Provider Handle',	1:'Référence e-payment',	2:'Referencja e-płatności',	3:'e-Pay Provider referte',	4:'e-Pay Anbieterreferenz',		5:'Riferimento e-pagamento',	6:'Referencia e-pago', 		7:'Referência e-pagamento', 8:'e-Pay Referenz'	};
C_XL.d['suspension']		= { 0:'account suspended',		1:'Suspension du service',	2:'Konto zawieszone',		3:'Dienstschorsing',		4:'Konto gesperrt',				5:'Sospensione del servizio',	6:'Suspensión del servicio',7:'Suspensão do serviço', 	8:'Kont suspendéiert'	};

C_XL.d['payment ok']		= { 0:'Payment ok',			1:'En ordre',					2:'Zapłacono',				3:'Klaar',					4:'Zahlung ok',					5:'Pagamento ok',				6:'En orden', 				7:'Em dia', 		8:'Bezuelung ok'	};
C_XL.d['payment nok']		= { 0:'Missing',			1:'En défaut',					2:'Brak wpłaty',			3:'Defect',					4:'außer Betrieb',				5:'Mancante',					6:'En defecto', 			7:'Em falta', 		8:'Feelend'			};
	
C_XL.d['no e-payment']		= { 0:'No e-payment',		1:'Pas d\'e-paiement',			2:'Bez e-płatności',		3:'Geen e-betaling',		4:'Kein E-Payment',				5:'Nessun e-pagamento',	6:'Ningún e-pago', 				7:'Sem e-pagamento', 	8:'Keen e-Payment'		};
C_XL.d['ePayment bank']		= { 0:'Bank transfer',		1:'Domiciliation',				2:'Zlecenie stałe',			3:'Domiciliëring',			4:'Überweisung',				5:'Bonifico',			6:'Transferencia bancaria', 	7:'Domiciliação', 		8:'Bank Iwwerweisung'	};
C_XL.d['ePayment VISA']		= { 0:'VISA card',			1:'Carte VISA',					2:'VISA',					3:'VISA kaart',				4:'VISA',						5:'Carta VISA',			6:'Tarjeta VISA', 				7:'Cartão VISA',		8:'VISA'				};
C_XL.d['ePayment MASTER']	= { 0:'MasterCard',			1:'MasterCard',					2:'MasterCard',				3:'MasterCard',				4:'MasterCard',					5:'Mastercard',			6:'MasterCard', 				7:'MasterCard',			8:'MasterCard'			};


// 		technical 			english:0,					french:1,					polish:2,						dutch:3,					german:4,					italian:5,					spanish:6,						portuguese:7

C_XL.d['payment']			= { 0:'payment',			1:'paiement',					2:'płatność',				3:'betaling',				4:'zahlung',				5:'pagamento',				6:'pago', 						7:'pagamento', 				8:'Bezuelung'		};
C_XL.d['payments']			= { 0:'payments',			1:'paiements',					2:'płatności',				3:'betalingen',				4:'zahlungen',				5:'pagamenti',				6:'pagos', 						7:'pagamentos', 			8:'Bezuelungen'		};
C_XL.d['deposit']			= { 0:'deposit amount',		1:'montant de l\'acompte',		2:'kwota depozytu',			3:'aanbetalingsbedrag',		4:'Einzahlungsbetrag',		5:'importo del deposito',	6:'cantidad del depósito', 		7:'valor do depósito', 		8:'Acompte'			};
C_XL.d['e-payment']			= { 0:'e-Payment',			1:'e-Paiement',					2:'e-płatność',				3:'e-Payment',				4:'e-Zahlung',				5:'e-Pagamento',			6:'e-Pago', 					7:'e-pagamento', 			8:'e-Bezuelung'		};
C_XL.d['e-invoicing']		= { 0:'e-Invoicing',		1:'e-Facturation',				2:'e-faktura',				3:'e-Fakturatie',			4:'e-Rechnung',				5:'e-Fatturazione',			6:'e-Facturación', 				7:'e-faturação', 			8:'e-Fakturéierung'	};
C_XL.d['norm fee']			= { 0:'Fee',				1:'abonnement',					2:'abonament',				3:'abonement',				4:'abo',					5:'abbonamento',			6:'Suscripción', 				7:'Subscrição', 			8:'Abonnement'		};
C_XL.d['credit']			= { 0:'Credits',			1:'Crédits',					2:'Kredyty',				3:'Krediet',				4:'Gutschrift',				5:'Crediti',				6:'Créditos', 					7:'Créditos', 				8:'Credits'			};
C_XL.d['ex fee']			= { 0:'Exceptional fee',	1:'abonement crédit',			2:'abonament (kredyty)',	3:'Krediet abonement',		4:'abo Gutschrift',			5:'abbonamento credito',	6:'Suscripción de crédito', 	7:'Subscrição de crédito', 	8:'Aussergewéinlech Frais'	};
C_XL.d['rate']				= { 0:'Tax rate',			1:'TVA',						2:'VAT',					3:'BTW',					4:'MwSt',					5:'IVA',					6:'IVA', 						7:'IVA', 					8:'TVA'		};

C_XL.d['pricing']			= { 0:'rate',					1:'tarif',					2:'cennik',					3:'tarief',					4:'tarif',					5:'tariffa',					6:'precio', 						7:'preço', 							8:'Tarif'				};
C_XL.d['amount'] 			= { 0:'amount', 				1:'montant', 				2:'kwota', 					3:'bedrag', 				4:'Betrag (EUR)', 			5:'importo', 					6:'importe', 						7:'valor', 							8:'Montant' 			};



// 		technical 					english:0,				french:1,				polish:2,				dutch:3,					german:4,				italian:5,				spanish:6,				portuguese:7
C_XL.d['mtitle new payment']	= { 0:'new payment',		1:'nouveau paiement',	2:'nowa płatność',		3:'nieuwe betaling',		4:'neue Zahlung',		5:'nuovo pagamento',	6:'nuevo pago', 		7:'novo pagamento', 8:'nei Bezuelung'	};
C_XL.d['mtitle payment']		= { 0:'payment',			1:'paiement',			2:'Zapłata',			3:'betaling',				4:'Zahlung',			5:'pagamento',			6:'pago', 				7:'pagamento', 		8:'Bezuelung'	};


// e-payment statuses
C_XL.d['ep-st-isnew']		= { 0:'new',			1:'nouveau',		2:'nowa',			3:'nieuwe',			4:'Neu',				5:'nuovo',			6:'nuevo', 			7:'novo', 				8:'Nei'					};	
C_XL.d['ep-st-unauthorized']= { 0:'unauthorized',	1:'non autorisé',	2:'nieautoryzowana',3:'ongeautoriseerd',4:'Nicht autorisiert',	5:'non autorizzato',6:'no autorizado', 	7:'não autorizado', 	8:'Net autoriséiert'	};	
C_XL.d['ep-st-identified']	= { 0:'scanned',		1:'scanné',			2:'zeskanowana',	3:'gescand',		4:'Gescannt',			5:'scansionato',	6:'escaneado', 		7:'digitalizado', 		8:'Gescannt'			};	
C_XL.d['ep-st-pending']		= { 0:'pending',		1:'en cours',		2:'oczekująca',		3:'in behandeling',	4:'Ausstehend',			5:'in sospeso',		6:'pendiente', 		7:'pendente', 			8:'Am Gaangen'			};	
C_XL.d['ep-st-success']		= { 0:'paid',			1:'encaissé',		2:'powodzenie',		3:'geslaagd',		4:'Erfolgreich',		5:'riuscito',		6:'correcto', 		7:'bem-sucedido', 		8:'Bezuelt'				};	
C_XL.d['ep-st-refund']		= { 0:'refund',			1:'remboursé',		2:'zwrócone',		3:'terugbetaald',	4:'erstattet',			5:'rimborsato',		6:'reembolsada', 	7:'reembolsado', 		8:'Zréckbezuelung'		};	
C_XL.d['ep-st-expired']		= { 0:'expired',		1:'expiré',			2:'wygasła',		3:'verlopen',		4:'Abgelaufen',			5:'scaduto',		6:'caducado', 		7:'expirado', 			8:'Verfall'				};	
C_XL.d['ep-st-failed']		= { 0:'failed',			1:'échoué',			2:'nieudana',		3:'mislukt',		4:'Fehlgeschlagen',		5:'non riuscito',	6:'fallido', 		7:'com falha', 			8:'Gescheitert'			};	
C_XL.d['ep-st-cancelled']	= { 0:'cancelled',		1:'annulé',			2:'anulowana',		3:'geannuleerd',	4:'Abgebrochen',		5:'annullato',		6:'cancelado', 		7:'cancelado', 			8:'Ofgesot'				};	


	

// 		technical 					english:0,							french:1,								polish:2,									dutch:3,					german:4,							italian:5,							spanish:6,							portuguese:7

C_XL.d['CCBC-IBAN-IBAN-IBAN'] 	= { 0:'GB98 MIDL 0700 9312 3456 78', 	1:'FR76 3000 6000 0112 3456 7890 189', 	2:'PL10 1050 0099 7603 1234 5678 9123', 	3:'BE71 0961 2345 6769',	4:'DE91 1000 0000 0123 4567 89', 	5:'IT79 2100 0813 6101 2345 6789', 	6:'ES79 2100 0813 6101 2345 6789',	7:'PT50 0033 0000 5013 1901 229 05', 8:'LU05 0020 7077 3052 1000'};


	
	
	// display preferences

C_XL.d['default gender'] 	= { 0:'Default gender',		1:'Civilité par défaut',			2:'Płci default',			3:'Standaard geslacht',	4:'Standard Geschlecht',		5:'Genere per difetto',					6:'Género por defecto', 			7:'Forma de tratamento por defeito',	8:'Standardgeschlecht' };
C_XL.d['time slice']		= { 0:'Hours slicing',		1:'Division des heures',			2:'Podział godzin',			3:'Uren opsplitsing',	4:'Stundeneinteilung',			5:'Divisione delle ore',				6:'División de las horas', 			7:'Divisão das horas',					8:'Stonnendeelung' };
C_XL.d['duration span']		= { 0:'Duration span',		1:'Limites de durée',				2:'Czas wizyty',			3:'Duurtijd limieten',	4:'Dauerbegrenzungen',			5:'Limiti delle durate',				6:'Limites de duración', 			7:'Limites de duração',					8:'Dauerberäich' };
C_XL.d['duration increment']= { 0:'Duration increment',	1:'Incrément de durée',				2:'Przyrost czasu wizyty',	3:'Duurtijd increment',	4:'Dauererweiterungen',			5:'aumento della durata',				6:'aumento de duración', 			7:'aumento da duração',					8:'Erhéijung vun der Dauer' };
C_XL.d['time zone']			= { 0:'Time zone',			1:'Fuseau horaire',					2:'Strefa czasu',			3:'Tijdzone',			4:'Zeitzone',					5:'Fuso orario',						6:'Huso horario', 					7:'Fuso horário',						8:'Zäitzon' };
C_XL.d['display weeknumb']	= { 0:'Display week number',1:'afficher le numéro de semaine',	2:'Pokaż numer tygodnia',	3:'Toon weeknummer',	4:'Wochennummer anzeigen',		5:'Mostrare il numero della settimana',	6:'Enseñar el número de semana',	7:'Mostrar o número da semana',			8:'Wochennummer uweisen' };
C_XL.d['planning range']	= { 0:'Planning timespan',	1:'Plage horaire affichée',			2:'Wyświetlanie grafiku',	3:'Planning tijd span',	4:'angezeigte Zeitspanne',		5:'Fascia oraria mostrata',				6:'Franja horaria mostrada', 		7:'Intervalo de tempo exibido',			8:'Zäitberäich weisen' };


// 		[technical name] 			english:0,				french:1,						polish:2,				dutch:3,				german:4,					italian:5,						spanish:6,							portuguese:7

C_XL.d['notification'] = { 0:'Notification', 1:'Notification', 2:'Zgłoszenie', 3:'Melding', 4:'Benachrichtigung', 5:'Notificazione', 6:'Notificación', 7:'Notificação', 8:'Notifikatioun' };
C_XL.d['no notification'] = { 0:'no notification', 1:'pas de notification', 2:'brak powiadomienia', 3:'geen melding', 4:'keine Benachrichtigung', 5:'nessuna notifica', 6:'sin notificación', 7:'sem notificação', 8:'Keng Notifikatioun' };
C_XL.d['notifications'] = { 0:'Notifications', 1:'Notifications', 2:'Powiadomienia', 3:'Meldingen', 4:'Benachrichtigungen', 5:'Notificazioni', 6:'Notificaciones', 7:'Notificações', 8:'Notifikatiounen' };
C_XL.d['presence list'] = { 0:'Drop Duplicates', 1:'Suppression de doublon', 2:'Usuń duplikat', 3:'Verwijder dubbele', 4:'Duplikate verwerfen', 5:'Soppressione di doppioni', 6:'Supresión de los duplicados', 7:'remoção da duplicata', 8:'Duplikater läschen' };



C_XL.d['resa_sms_list'] = C_XL.d['sms']; // !! No translation on this line

C_XL.d['resa_emails_list'] = { 0:'e-Mail', 1:'e-Mail', 2:'e-Mail', 3:'e-Mail', 4:'E-Mail', 5:'Email', 6:'E-mail', 7:'Email', 8:'E-Mail' };
C_XL.d['title'] = { 0:'Title', 1:'Titre', 2:'Tytuł', 3:'Title', 4:'Titel', 5:'Titolo', 6:'Título', 7:'Título', 8:'Titel' };
C_XL.d['message'] = { 0:'Message', 1:'Message', 2:'Wiadomość', 3:'Boodschap', 4:'Nachricht', 5:'Messaggio', 6:'Mensaje', 7:'Mensagem', 8:'Noriicht' };
C_XL.d['messages'] = { 0:'Messages', 1:'Messages', 2:'Wiadomości', 3:'Berichten', 4:'Nachrichten', 5:'Messaggi', 6:'Mensajes', 7:'Mensagens', 8:'Noriichten' };
C_XL.d['resa serie'] = { 0:'Series', 1:'Série', 2:'Seria', 3:'reeks', 4:'Serie', 5:'Serie', 6:'Serie', 7:'Série', 8:'Serie' };


// 		technical 			english:0,			french:1,				polish:2,				dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7

C_XL.d['on the date'] = { 0:'on', 1:'le', 2:'na', 3:'op', 4:'am', 5:'il', 6:'el', 7:'em', 8:'op' };
C_XL.d['on a date'] = { 0:'on this date', 1:'à cette date', 2:'tego dnia', 3:'op deze dag', 4:'an diesem Datum', 5:'a questa data', 6:'en esta fecha', 7:'nesta data', 8:'op dësem Datum' };

C_XL.d['stops after'] = { 0:'stops after', 1:'s\'arrète après', 2:'zatrzymuje się po', 3:'stopt na', 4:'endet ab', 5:'si ferma dopo', 6:'para después', 7:'parar depois de', 8:'hält op no' };
C_XL.d['stops on'] = { 0:'stops on', 1:'s\'arrète le', 2:'zatrzymuje się w', 3:'stopt op', 4:'endet am', 5:'si ferma il', 6:'para el', 7:'parar em', 8:'hält op um' };

C_XL.d['attendee'] = { 0:'attendee', 1:'assigné', 2:'Uczestników', 3:'Toegewezen', 4:'Zugeteilt', 5:'attribuito', 6:'Participante', 7:'atribuído', 8:'Matmaachen' };
C_XL.d['predefined'] = { 0:'Templates', 1:'Prédéfinis', 2:'Szablony', 3:'Voorbeelden', 4:'Vorlage', 5:'Predefinito', 6:'Predefinido', 7:'Predefinidos', 8:'Virdefinéiert' };
C_XL.d['attributes'] = { 0:'attributes', 1:'attributs', 2:'atrybuty', 3:'attributeb', 4:'Eigenschaften', 5:'attributi ', 6:'Características', 7:'atributos', 8:'Attributer' };


C_XL.d['indicates'] = { 0:'Indicating', 1:'Indiquant', 2:'Wskazujący', 3:'Vermeldt', 4:'angabe', 5:'Indicando', 6:'Indicando', 7:'Indicando', 8:'Uweisen' };
C_XL.d['before scheduled'] = { 0:'before scheduled time', 1:'d\'avance sur le timing', 2:'wcześniej niż w harmonogramie', 3:'voorhang op timing', 4:'vor geplanter Uhrzeit', 5:'in anticipo sul timing', 6:'adelantado sobre la hora', 7:'antecipação sobre a hora', 8:'Vir der geplangter Zäit' };

C_XL.d['credentials'] = { 0:'credentials', 1:'accès', 2:'dostęp', 3:'toegang', 4:'Zugang', 5:'credenziali', 6:'accesi', 7:'credenciais', 8:'Umeldungsinformatiounen' };
C_XL.d['login'] = { 0:'Login', 1:'Login', 2:'Użytkownik', 3:'Login', 4:'Login', 5:'Login', 6:'Login', 7:'Início de sessão', 8:'Login' };

					

// 		technical 			english:0,				french:1,				polish:2,				dutch:3,				german:4,				italian:5,					spanish:6,					portuguese:7
C_XL.d['al-admin'] = { 0:'administrator', 1:'administrateur', 2:'administrator', 3:'Beheerder', 4:'administrator', 5:'amministratore', 6:'administrador', 7:'administrador', 8:'Administrator' };
C_XL.d['al-seller'] = { 0:'representative', 1:'Délégué', 2:'Przedstawiciel', 3:'afgevaardigd', 4:'Vetreter', 5:'Rappresentante', 6:'Delegado', 7:'Delegado', 8:'Representant' };
C_XL.d['al-manager'] = { 0:'Manager', 1:'responsable', 2:'Kierownik', 3:'Verantwoordelijk', 4:'Manager', 5:'responsabile', 6:'responsable', 7:'responsável', 8:'Manager' };
C_XL.d['al-supervisor'] = { 0:'Supervisor', 1:'Superviseur', 2:'Nadzorca', 3:'Opzichter', 4:'Betreuer', 5:'Supervisore', 6:'Supervisor', 7:'Supervisor', 8:'Superviseur' };
C_XL.d['al-operator'] = { 0:'Operator', 1:'Opérateur', 2:'Operator', 3:'operator', 4:'anwender', 5:'Operatore', 6:'Operador', 7:'Operador', 8:'Bedreiwer' };
C_XL.d['al-eresa'] = { 0:'Web-page', 1:'Page Web', 2:'Strona internetowa', 3:'Web-pagina', 4:'Webseite', 5:'Pagina web', 6:'Página web', 7:'Página web', 8:'Websäit' };
C_XL.d['al-synchro'] = { 0:'Synchronization', 1:'Synchronisation', 2:'Synchronizacja', 3:'Synchronisatie', 4:'Synchronisation', 5:'Sincronizzazione', 6:'Sincronización', 7:'Sincronização', 8:'Synchronisatioun' };

C_XL.d['brand'] = { 0:'Brand', 1:'Marque', 2:'Marka', 3:'Merk', 4:'Marke', 5:'Marca', 6:'Marca', 7:'Marca', 8:'Mark' };
C_XL.d['program name'] = { 0:'Program name', 1:'application', 2:'Nazwa programu', 3:'Programmanaam', 4:'anwendung', 5:'applicazione', 6:'aplicación', 7:'aplicação', 8:'Programmnumm' };

// 		technical 			english:0,					french:1,				polish:2,					dutch:3,					german:4,							italian:5,					spanish:6,					portuguese:7


			// usage

// preferences workcodes
C_XL.d['timeboxing'] = { 0:'Time boxing', 1:'Bloc horaire', 2:'Time boxing', 3:'Time boxing', 4:'Zeitblöcke', 5:'Blocco orario', 6:'Bloqueo horario', 7:'Bloco horário', 8:'Zäit Boxen' };
C_XL.d['workcode'] = { 0:'performance', 1:'prestation', 2:'świadczenie', 3:'prestatie', 4:'leistung', 5:'prestazione', 6:'servicio', 7:'prestação', 8:'Leeschtung' };
C_XL.d['euros'] = { 0:'€', 1:'€', 2:'€', 3:'€', 4:'€', 5:'€', 6:'€', 7:'€', 8:'€' };
C_XL.d['code'] = { 0:'Code', 1:'Code', 2:'Kod', 3:'Code', 4:'Code', 5:'Codice', 6:'Código', 7:'Código', 8:'Code' };
C_XL.d['price'] = { 0:'Price €', 1:'Prix €', 2:'Cena €', 3:'Prijs €', 4:'Preis €', 5:'Prezzo €', 6:'Precio €', 7:'Preço €', 8:'Präis €' };
C_XL.d['performance'] = { 0:'performance', 1:'prestation', 2:'świadczenie', 3:'prestatie', 4:'leistung', 5:'prestazione', 6:'servicio', 7:'prestação', 8:'Leeschtung' };
C_XL.d['performances'] = { 0:'performances', 1:'prestations', 2:'świadczenia', 3:'prestaties', 4:'leistungen', 5:'prestazioni', 6:'servicios', 7:'prestações', 8:'Leeschtungen' };

C_XL.d['e-reservable'] = { 0:'e-reservable', 1:'e-reservable', 2:'e-reservable', 3:'e-reservable', 4:'e-reservierbar', 5:'e-Prenotabile', 6:'e-reservable', 7:'e-reserva', 8:'e-Reservéierbar' };
C_XL.d['e-reservables'] = { 0:'online reservables', 1:'réservables en ligne', 2:'można zarezerwować online', 3:'online te boeken', 4:'online buchbar', 5:'prenotabile online', 6:'reservable en línea', 7:'reservável on-line', 8:'Online Reservéierbar' };

									

// secretary guidelines
	// message fusion tags  // check  (*T01*)

C_XL.d['substitution placeholders'] = { 0:'substitution placeholders', 1:'balises de substitution', 2:'znaczniki zastępcze', 3:'vervangingslabels', 4:'Ersatz-Tags', 5:'tag di sostituzione', 6:'etiquetas de sustitución', 7:'etiquetas de substituição', 8:'Substitutiounstags' };

C_XL.d['{tmp_confirm}'] = { 0:'Confirmation', 1:'Confirmation', 2:'Potwierdzenie', 3:'Bevestiging', 4:'Bestätigung', 5:'Conferma', 6:'Confirmación', 7:'Confirmação', 8:'Confirmatioun' };
C_XL.d['{tmp_eve}'] = { 0:'Eve reminder', 1:'Rappel la veille', 2:'Przypomnienie dzień przed wizytą', 3:'Vooravond', 4:'am abend vorher', 5:'Promemoria il giorno prima', 6:'recordatorio el día antes', 7:'Lembrete no dia anterior', 8:'Erënnerung de Virdag' };
C_XL.d['{tmp_oneweek}'] = { 0:'One week before', 1:'Rappel en7', 2:'Przypomnienie dzień przed wizytą', 3:'Een week tevoren', 4:'Eine Woche vorher', 5:'Promemoria una settimana prima', 6:'recordatorio una semana antes', 7:'Lembrete em7', 8:'Erënnerung eng Woch virdrun' };

C_XL.d['{business}'] = { 0:'account name', 1:'Nom du compte', 2:'Nazwa konta', 3:'accountnaam', 4:'Kontoname', 5:'Nome del conto', 6:'Nombre de la cuenta', 7:'Nome da conta', 8:'Kontonumm' };
C_XL.d['{time}'] = { 0:'Time', 1:'Heure', 2:'Godzina', 3:'Uur', 4:'Uhrzeit', 5:'Ora', 6:'Hora', 7:'Hora', 8:'Zäit' };
C_XL.d['{date}'] = { 0:'Date', 1:'Date', 2:'Data', 3:'Datum', 4:'Datum', 5:'Data', 6:'Fecha', 7:'Data', 8:'Datum' };
C_XL.d['{day}'] = { 0:'Weekday', 1:'Jour', 2:'Dzień', 3:'Weekdag', 4:'Wochentag', 5:'Giorno', 6:'Día', 7:'Dia', 8:'Wochendag' };
C_XL.d['{dear}'] = { 0:'Dear', 1:'Chèr(e)', 2:'', 3:'Beste', 4:'Liebe(r)', 5:'Caro/a', 6:'Estimado/a', 7:'Caro/a', 8:'Léif' };
C_XL.d['{gender}'] = { 0:'Title', 1:'Civ.', 2:'Godność', 3:'Gesl.', 4:'anrede', 5:'Titolo', 6:'Título', 7:'Forma de tratamento', 8:'Titelen' };
C_XL.d['{fname}'] = { 0:'First name', 1:'Prénom', 2:'Imię', 3:'Voornaam', 4:'Vorname', 5:'Nome', 6:'Nombre', 7:'Nome', 8:'Virnumm' };
C_XL.d['{lname}'] = { 0:'Last name', 1:'Nom', 2:'Nazwisko', 3:'Naam', 4:'Nachname', 5:'Cognome', 6:'apellido', 7:'apelido', 8:'Familljennumm' };
C_XL.d['{info}'] = { 0:'Info note', 1:'Information', 2:'Informacje', 3:'Informatie', 4:'Information', 5:'Informazione', 6:'Información', 7:'Informação', 8:'Informatioun' };
C_XL.d['{resa_note}'] = { 0:'Note', 1:'Note', 2:'Notatka', 3:'Notitie', 4:'Notiz', 5:'Nota', 6:'Nota', 7:'Nota', 8:'Notiz' };
C_XL.d['{perf_note}'] = { 0:'Performance note', 1:'Note prestation', 2:'Uwaga świadczenie', 3:'Nota prestatie', 4:'Notiz Leistung', 5:'Nota prestazione', 6:'Nota servicio', 7:'Nota prestação', 8:'Leeschtungsnotiz' };

C_XL.d['{company}'] = C_XL.d['company']; // !! No translation on this line
C_XL.d['{mobile}'] = C_XL.d['mobile'];
C_XL.d['{regist}'] = C_XL.d['registration'];
C_XL.d['{address}'] = C_XL.d['address'];
C_XL.d['{email}'] = C_XL.d['email'];
C_XL.d['{perf}'] = C_XL.d['workcode'];
C_XL.d['{bcode}'] = C_XL.d['booking code']; // bookingcode


C_XL.d['{att_bcal}'] = { /* set by setContextLanguage() */ }; // !! No translation on this line
C_XL.d['{att_ucal}'] = { /* set by setContextLanguage() */ };
C_XL.d['{att_fcal}'] = { /* set by setContextLanguage() */ };
C_XL.d['{participants}'] = { /* set by setContextLanguage() */ };



// 		technical :		english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7,	luxembourgish:8



C_XL.d['visitor'] = { 0:'visitor', 1:'visitor', 2:'visitor', 3:'visitor', 4:'visitor', 5:'visitor', 6:'visitor', 7:'visitor', 8:'visitor' }; // !! No translation on this line
C_XL.d['visitors'] = { 0:'visitors', 1:'visitors', 2:'visitors', 3:'visitors', 4:'visitors', 5:'visitors', 6:'visitors', 7:'visitors', 8:'visitors' }; // !! No translation on this line see (*xl01*)


// 		technical 				english:0,				french:1,			polish:2,			dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7

C_XL.d['visi-abr-id'] = C_XL.d['visi-csv-id'] = { 0:'id', 1:'id', 2:'id', 3:'id', 4:'id', 5:'id', 6:'id', 7:'id', 8:'id' };
C_XL.d['visi-abr-vip'] = C_XL.d['visi-csv-vip'] = { 0:'VIP', 1:'VIP', 2:'VIP', 3:'VIP', 4:'VIP', 5:'VIP', 6:'VIP', 7:'VIP', 8:'VIP' };
C_XL.d['visi-abr-ccss'] = C_XL.d['visi-csv-ccss'] = { 0:'c', 1:'c', 2:'k', 3:'k', 4:'k', 5:'c', 6:'c', 7:'c', 8:'c' };
C_XL.d['visi-abr-gender'] = C_XL.d['visi-csv-gender'] = { 0:'gender', 1:'civil', 2:'godność', 3:'gesl.', 4:'geschlecht', 5:'genero', 6:'género', 7:'forma de tratamento', 8:'Geschlecht' };
C_XL.d['visi-abr-firstname'] = C_XL.d['visi-csv-firstname'] = { 0:'firstname', 1:'prénom', 2:'imię', 3:'voornaam', 4:'vorname', 5:'nome', 6:'nombre', 7:'nome próprio', 8:'Virnumm' };
C_XL.d['visi-abr-lastname'] = C_XL.d['visi-csv-lastname'] = { 0:'lastname', 1:'nom', 2:'nazwisko', 3:'familie naam', 4:'nachname', 5:'cognome', 6:'apellido', 7:'apelido', 8:'Familljennumm' };
C_XL.d['visi-abr-company'] = C_XL.d['visi-csv-company'] = { 0:'company', 1:'entreprise', 2:'firma', 3:'firma', 4:'firma', 5:'azienda', 6:'empresa', 7:'empresa', 8:'Firma' };
C_XL.d['visi-abr-residence'] = C_XL.d['visi-csv-residence'] = { 0:'residence', 1:'résidence', 2:'rezydencja', 3:'residentie', 4:'wohnsitz', 5:'residenza', 6:'residencia', 7:'residência', 8:'Wunnsëtz' };
C_XL.d['visi-abr-address'] = C_XL.d['visi-csv-address'] = { 0:'address', 1:'adresse', 2:'adres', 3:'adres', 4:'adresse', 5:'indirizzo', 6:'dirección', 7:'endereço', 8:'Adress' };
C_XL.d['visi-abr-zipCode'] = C_XL.d['visi-csv-zipCode'] = { 0:'zip', 1:'CP', 2:'kod pocztowy', 3:'postcode', 4:'postleitzahl', 5:'postale', 6:'postal', 7:'postal', 8:'Postleitzuel' };
C_XL.d['visi-abr-city'] = C_XL.d['visi-csv-city'] = { 0:'city', 1:'ville', 2:'miejscowość', 3:'stad', 4:'stadt', 5:'città', 6:'ciudad', 7:'localidade', 8:'Stad' };
C_XL.d['visi-abr-country'] = C_XL.d['visi-csv-country'] = { 0:'country', 1:'pays', 2:'województwo', 3:'land', 4:'land', 5:'paese', 6:'país', 7:'país', 8:'Land' };
C_XL.d['visi-abr-email'] = C_XL.d['visi-csv-email'] = { 0:'email', 1:'email', 2:'email', 3:'email', 4:'email', 5:'email', 6:'e-mail', 7:'email', 8:'E-Mail' };
C_XL.d['visi-abr-mobile'] = C_XL.d['visi-csv-mobile'] = { 0:'mobile', 1:'mobile', 2:'komórkowy', 3:'gsm', 4:'mobil', 5:'cellulare', 6:'móvil', 7:'gsm', 8:'GSM' };
C_XL.d['visi-abr-phone'] = C_XL.d['visi-csv-phone'] = { 0:'fix line', 1:'tel fixe', 2:'telefon', 3:'telefoon', 4:'festnetz', 5:'telefono', 6:'teléfono fijo', 7:'telf. fixo', 8:'Festnetz' };
C_XL.d['visi-abr-language'] = C_XL.d['visi-csv-language'] = { 0:'lang.', 1:'langue', 2:'język', 3:'taal', 4:'sprache', 5:'lingua', 6:'idioma', 7:'idioma', 8:'Sprooch' };
C_XL.d['visi-abr-birthday'] = C_XL.d['visi-csv-birthday'] = { 0:'bday', 1:'ddn', 2:'urodziny', 3:'geboorte', 4:'geburtsdatum', 5:'ddn', 6:'fec. nac.', 7:'ddn', 8:'Gebuertsdatum' };
C_XL.d['visi-abr-registration'] = C_XL.d['visi-csv-registration'] = { 0:'reg.', 1:'matr.', 2:'znac.', 3:'regs.', 4:'reg', 5:'matr.', 6:'matr.', 7:'matr.', 8:'Matricule' };

C_XL.d['visi-id'] = { 0:'Data set id', 1:'Identifiant', 2:'Identyfikator', 3:'Identificatie', 4:'Identifikator', 5:'Identificazione', 6:'Nombre usuario', 7:'Identificador', 8:'Identifikatioun' };
C_XL.d['visi-vip'] = { 0:'VIP', 1:'VIP', 2:'VIP', 3:'VIP', 4:'VIP', 5:'VIP', 6:'VIP', 7:'VIP', 8:'VIP' };
C_XL.d['visi-ccss'] = { 0:'Color & pattern', 1:'Couleur ou motif', 2:'Kolor i wzór', 3:'Kleur of patroon', 4:'Farbe & Motiv', 5:'Colore o motivo', 6:'Color o motivo', 7:'Cor ou motivo', 8:'Faarf & Muster' };
C_XL.d['visi-gender'] = { 0:'Gender', 1:'Civilité', 2:'Godność', 3:'Geslacht', 4:'Geschlecht', 5:'Titolo', 6:'Género', 7:'Forma de tratamento', 8:'Geschlecht' };
C_XL.d['visi-firstname'] = { 0:'Firstname', 1:'Prénom', 2:'Imię', 3:'Voornaam', 4:'Vorname', 5:'Nome', 6:'Nombre', 7:'Nome', 8:'Virnumm' };
C_XL.d['visi-lastname'] = { 0:'Lastname', 1:'Nom de famille', 2:'Nazwisko', 3:'Familie naam', 4:'Nachname', 5:'Cognome', 6:'apellido', 7:'apelido', 8:'Familljennumm' };
C_XL.d['visi-company'] = { 0:'Company', 1:'Entreprise', 2:'Firma', 3:'Firma', 4:'Firma', 5:'azienda', 6:'Empresa', 7:'Empresa', 8:'Firma' };
C_XL.d['visi-residence'] = { 0:'Residence', 1:'Résidence', 2:'Rezydencja', 3:'Residentie', 4:'Wohnsitz', 5:'Residenza', 6:'Residencia', 7:'Residência', 8:'Wunnsëtz' };
C_XL.d['visi-address'] = { 0:'address', 1:'adresse', 2:'adres', 3:'adres', 4:'adresse', 5:'Indirizzo', 6:'Dirección', 7:'Morada', 8:'Adress' };
C_XL.d['visi-zipCode'] = { 0:'Zip code', 1:'Code postal', 2:'Kod pocztowy', 3:'Postcode', 4:'Postleitzahl', 5:'Codice postale', 6:'Código postal', 7:'Código postal', 8:'Postleitzuel' };

C_XL.d['visi-city'] = { 0:'City', 1:'Ville', 2:'Miejscowość', 3:'Stad', 4:'Stadt', 5:'Città', 6:'Ciudad', 7:'Localidade', 8:'Stad' };
C_XL.d['visi-country'] = { 0:'Country', 1:'Pays', 2:'Województwo', 3:'Land', 4:'Land', 5:'Paese', 6:'País', 7:'País', 8:'Land' };
C_XL.d['visi-email'] = { 0:'e-mail', 1:'e-mail', 2:'e-mail', 3:'e-mail', 4:'e-mail', 5:'email', 6:'e-mail', 7:'email', 8:'E-Mail' };
C_XL.d['visi-mobile'] = { 0:'Mobile', 1:'mobile/gsm', 2:'Komórkowy', 3:'Gsm', 4:'Mobil', 5:'cellulare', 6:'móvil', 7:'GSM', 8:'GSM' };
C_XL.d['visi-phone'] = { 0:'Fix line', 1:'Tel fixe', 2:'Telefon', 3:'Telefoon', 4:'Telefon', 5:'Telefono', 6:'Teléfono fijo', 7:'Telf. fixo', 8:'Festnetz' };
C_XL.d['visi-language'] = { 0:'Langue', 1:'Language', 2:'Język', 3:'Taal', 4:'Sprache', 5:'Lingua', 6:'Idioma', 7:'Idioma', 8:'Sprooch' };
C_XL.d['visi-birthday'] = { 0:'Birthday', 1:'Date de naissance', 2:'Urodziny', 3:'Geboorte datum', 4:'Geburtsdatum', 5:'Data di nascita', 6:'Fecha de nacimiento', 7:'Data de nascimento', 8:'Gebuertsdatum' };
C_XL.d['visi-registration'] = { 0:'Registration', 1:'Matricule', 2:'Znaczek', 3:'Registratie', 4:'Registrierung', 5:'Matricola', 6:'Matrícula', 7:'Matrícula', 8:'Registréierung' };


C_XL.d['resa-abr-id'] = C_XL.d['resa-csv-id'] = { 0:'id',	1:'id',	2:'id',	3:'id',	4:'id',	5:'id',	6:'id', 7:'id', 8:'id'	};




// 		technical 				english:0,				french:1,			polish:2,			dutch:3,		german:4,		italian:5,		spanish:6,		portuguese:7

C_XL.d['resa-abr-cueIn'] = C_XL.d['resa-csv-cueIn'] = { 0:'time', 1:'début', 2:'początek', 3:'tijd', 4:'Beginn', 5:'inizio', 6:'inicio', 7:'começo', 8:'Ufank' };
C_XL.d['resa-abr-cueOut'] = C_XL.d['resa-csv-cueOut'] = { 0:'done', 1:'fin', 2:'koniec', 3:'tijd af', 4:'Ende', 5:'fine', 6:'fin', 7:'fim', 8:'Enn' };
C_XL.d['resa-abr-dateIn'] = C_XL.d['resa-csv-dateIn'] = { 0:'scheduled', 1:'date', 2:'rozpoczęcia', 3:'datum', 4:'Geplant', 5:'data', 6:'fecha', 7:'data', 8:'Geplangt' };
C_XL.d['resa-abr-dateOut'] = C_XL.d['resa-csv-dateOut'] = { 0:'ending on', 1:'date fin', 2:'zakończenia', 3:'einddatum', 4:'Endet am', 5:'data fine', 6:'fecha fin', 7:'data fim', 8:'Endet um' };
C_XL.d['resa-abr-duration'] = C_XL.d['resa-csv-duration'] = { 0:'duration', 1:'durée', 2:'trwania', 3:'duurtijd', 4:'Dauer', 5:'durata', 6:'duración', 7:'duração', 8:'Dauer' };

C_XL.d['resa-abr-ccss'] 		= { 0:'c',	1:'c',	2:'k',	3:'k',	4:'f' /*farbe*/,	5: 'c',		6:'c', 	7:'c', 	8:'f' /*Faarf*/	};

// translations for catalysts, see (*tp01*)

C_XL.d['resa-id'] = { 0:'Data set id', 1:'Identifiant', 2:'Identyfikator', 3:'Identificatie', 4:'Identifikator', 5:'Identificazione', 6:'Nombre de usuario', 7:'Identificador', 8:'Donnée ID' };
C_XL.d['resa-created'] = { 0:'Creation date', 1:'Création: date', 2:'Utworzenia data', 3:'aanmaakdatum', 4:'Erstelldatum', 5:'Creazione: data', 6:'Creación: fecha', 7:'Criação: data', 8:'Erstellungsdatum' };
C_XL.d['resa-creator'] = { 0:'Creator login', 1:'Création: login', 2:'Utworzenia logowania', 3:'aanmaaklogin', 4:'Erstellerlogin', 5:'Creazione: login', 6:'Creación: login', 7:'Criação: início de sessão', 8:'Ersteller Login' };
C_XL.d['resa-changed'] = { 0:'Modification date', 1:'Modification: date', 2:'Modyfikacji data', 3:'Wijziging datum', 4:'anpassungsdatum', 5:'Modifica: data', 6:'Modificación: fecha', 7:'alteração: data', 8:'Ännerungsdatum' };
C_XL.d['resa-changer'] = { 0:'Modifier login ', 1:'Modification: login', 2:'Modyfikacja logowania', 3:'Wijziging: login', 4:'anpasserlogin', 5:'Modifica: login', 6:'Modificación: login', 7:'Modificação: início de sessão', 8:'Ännerungslogin' };
C_XL.d['resa-deleted'] = { 0:'Deletion date', 1:'Effacé: date', 2:'Usunięcia data', 3:'Verwijdering datum', 4:'Löschdatum', 5:'Soppresso: data', 6:'Borrado: fecha', 7:'apagado: data', 8:'Löschdatum' };
C_XL.d['resa-deletor'] = { 0:'Deletor login', 1:'Effacé: login', 2:'Usunięcia logowania', 3:'Verwijderd: login', 4:'Gelöscht von', 5:'Soppresso: login', 6:'Borrado: login', 7:'apagado: início de sessão', 8:'Löschlogin' };
C_XL.d['resa-cueIn'] = { 0:'start time', 1:'heure de début', 2:'Czas rozpoczęcia', 3:'Starttijd', 4:'anfangszeit', 5:'ora inizio', 6:'hora de inicio', 7:'hora de começo', 8:'Startzäit' };
C_XL.d['resa-cueOut'] = { 0:'end time', 1:'heure de fin', 2:'Czas zakończenia', 3:'Eindtijd', 4:'Endzeit', 5:'ora fine', 6:'hora fin', 7:'hora de fim', 8:'Endzäit' };
C_XL.d['resa-dateIn'] = { 0:'Scheduled start date', 1:'Date de début', 2:'Datę rozpoczęcia', 3:'Startdatum', 4:'Geplantes Anfangsdatum', 5:'Data d\'inizio', 6:'Fecha de inicio', 7:'Data de início', 8:'Startdatum geplangt' };
C_XL.d['resa-dateOut'] = { 0:'Scheduled end date', 1:'Date de fin', 2:'Data zakończenia', 3:'Einddatum', 4:'Enddatum', 5:'Data di fine', 6:'Fecha de fin', 7:'Data de término', 8:'Enddatum geplangt' };
C_XL.d['resa-duration'] = { 0:'Duration', 1:'Durée', 2:'Czas trwania', 3:'Duurtijd', 4:'Dauer', 5:'Durata', 6:'Duración', 7:'Duração', 8:'Dauer' };
C_XL.d['resa-ccss'] = { 0:'Color & pattern', 1:'Couleur ou motif', 2:'Kolor i wzór', 3:'Kleur of patroon', 4:'Farbe & Motiv', 5:'Colore o motivo', 6:'Color o motivo', 7:'Cor ou motivo', 8:'Faarf & Muster' };
C_XL.d['resa-payments'] = { 0:'payments', 1:'paiements', 2:'płatności', 3:'betalingen', 4:'Zahlungen', 5:'pagamenti', 6:'pagos', 7:'pagamentos', 8:'Bezuelungen' };

C_XL.d['resa-note'] 		= C_XL.d['note']; 		// !! No translation on this line as they are reused from a previous translation set
C_XL.d['resa-performances'] = C_XL.d['workcode'];
C_XL.d['resa-tags']	= C_XL.d['resa-abr-tags'] = C_XL.d['resa-csv-tags'] = C_XL.d['tags']; // in any case just display 'Tags'

	C_XL.d['resa-visitors'] 	= C_XL.d['names'];
	C_XL.d['resa-email'] 		= C_XL.d['visi-email'];
	C_XL.d['resa-birthday'] 	= C_XL.d['visi-birthday'];
	C_XL.d['resa-mobile'] 		= C_XL.d['visi-mobile'];
	C_XL.d['resa-zipCode'] 		= C_XL.d['visi-zipCode'];
	C_XL.d['resa-company'] 		= C_XL.d['visi-company'];
	C_XL.d['resa-residence'] 	= C_XL.d['visi-residence'];
	C_XL.d['resa-registration'] = C_XL.d['visi-registration'];
	
	C_XL.d['resa-cash']			= C_XL.d['ep-paytype cash']; // appears on preference fields selection modal, see (*tp02*)
	C_XL.d['resa-mobqrcode']	= C_XL.d['ep-paytype sepa qr']; // note that for this section you need 3 variants in each translations: resa-, resa-abr-, and resa-csv- 
	C_XL.d['resa-payconiq']		= C_XL.d['ep-paytype payconiq'];
	C_XL.d['resa-softpos']		= C_XL.d['ep-paytype softpos'];
	C_XL.d['resa-hardpos']		= C_XL.d['ep-paytype hardpos'];
	C_XL.d['resa-onlinepayco']	= C_XL.d['ep-paytype onlinepayco'];
	C_XL.d['resa-onlinecards']	= C_XL.d['ep-paytype onlinecards'];
	C_XL.d['resa-receivables'] = { 0:'receivables', 1:'créances', 2:'należności', 3:'nog te ontvangen bedragen', 4:'Forderungen', 5:'crediti', 6:'cuentas por cobrar', 7:'contas a receber', 8:'Fuerderungen' };

	
	C_XL.d['resa-abr-cash']			= C_XL.d['ep-paytype cash']; // appears on C_iARRAY colums title, // see (*ct06*)
	C_XL.d['resa-abr-mobqrcode'] 	= C_XL.d['ep-paytype sepa qr']; // those are immediately redefined here (*ct07*)
	C_XL.d['resa-abr-payconiq']		= C_XL.d['ep-paytype payconiq'];
	C_XL.d['resa-abr-softpos']		= C_XL.d['ep-paytype softpos'];
	C_XL.d['resa-abr-hardpos']		= C_XL.d['ep-paytype hardpos'];
	C_XL.d['resa-abr-onlinepayco']	= C_XL.d['ep-paytype onlinepayco'];
	C_XL.d['resa-abr-onlinecards']	= C_XL.d['ep-paytype onlinecards'];
	C_XL.d['resa-abr-receivables']	= C_XL.d['resa-receivables']; // see (*ep16*), 


	
	/*        C_catalyst      */
	
	
	
	
// 		technical 						english:0,			french:1,			polish:2,			dutch:3,			german:4,			italian:5,			spanish:6,		portuguese:7


C_XL.d['resa-bCals'] = C_XL.d['{att_bcal}']; // !! No translation on these lines
C_XL.d['resa-uCals'] = C_XL.d['{att_ucal}'];
C_XL.d['resa-fCals'] = C_XL.d['{att_fcal}'];



// e-resa (*es01*)
//
C_XL.d['child firstname'] = { 0:'First name of the child', 1:'Prénom de l\'enfant', 2:'Imię dziecka', 3:'Voornaam van het kind', 4:'Vorname des Kindes', 5:'Nome del bambino', 6:'Nombre del niño', 7:'Primeiro nome da criança', 8:'Virnumm vum Kand' };
C_XL.d['child lastname'] = { 0:'Family name of the child', 1:'Nom de famille de l\'enfant', 2:'Nazwisko dziecka', 3:'achternaam van het kind', 4:'Familienname des Kindes', 5:'Cognome del bambino', 6:'apellido del niño', 7:'Nome de família da criança', 8:'Familljennumm vum Kand' };

C_XL.d['owner firstname'] = { 0:'Owner\'s firstname', 1:'Prénom du propriétaire', 2:'Imię właściciela', 3:'Voornaam van de eigenaar', 4:'Vorname des Besitzers', 5:'Nome del proprietario', 6:'Nombre del propietario', 7:'Nome do proprietário', 8:'Virnumm vum Besëtzer' };
C_XL.d['owner lastname'] = { 0:'Owner\'s family name', 1:'Nom du propriétaire', 2:'Nazwisko właściciela', 3:'Familienaam van de eigenaar', 4:'Familienname des Besitzers', 5:'Cognome del proprietario', 6:'apellido del propietario', 7:'apelido do proprietário', 8:'Familljennumm vum Besëtzer' };


// M_Conxion

	// A C C O U N T    C O N F I G
	//
	
C_XL.d['token'] = { 0:'Token', 1:'Code', 2:'żeton', 3:'Code', 4:'Code', 5:'Codice', 6:'Código', 7:'Código', 8:'Token' };
C_XL.d['token validate'] = { 0:'verify', 1:'vérifier', 2:'zweryfikować', 3:'controleren', 4:'Überprüfen', 5:'verificare', 6:'verificar', 7:'verificar', 8:'iwwerpréiwen' };


	//  N O T E S,	 T A S K S,	 C H A T S    A R C H I V E S
	//
	

C_XL.d['keyword'] = { 0:'Keyword', 1:'Mot clé', 2:'Słów kluczowych', 3:'Trefwoord', 4:'Stichwort', 5:'Parola chiave', 6:'Palabra clave', 7:'Palavra-chave', 8:'Schlësselwuert' };
C_XL.d['period'] = { 0:'Timeframe', 1:'Période', 2:'Ramy czasowe', 3:'Tijdsbestek', 4:'Zeitspanne', 5:'Periodo', 6:'Periodo', 7:'Período', 8:'Zäitkader' };
C_XL.d['action'] = { 0:'action', 1:'action', 2:'Działanie', 3:'actie', 4:'aktion', 5:'azione', 6:'acción', 7:'ação', 8:'Aktioun' };



C_XL.d['book now'] = { 0:'make an appointment', 1:'prendre rendez-vous', 2:'umów się na wizytę', 3:'maak een afspraak', 4:'termin vereinbaren', 5:'prendere appuntamento', 6:'tomar cita', 7:'marcar uma consulta', 8:'E Rendez-vous maachen' };
C_XL.d['cancel resa'] = { 0:'cancel an appointment', 1:'annuler un rendez-vous', 2:'anulować termin', 3:'een afspraak afzeggen', 4:'termin absagen', 5:'cancellare un appuntamento', 6:'cancelar una cita', 7:'cancelar uma consulta', 8:'E Rendez-vous annuléieren' };


C_XL.d['mobminder'] = { 0:'Mobminder', 1:'Mobminder', 2:'Mobminder', 3:'Mobminder', 4:'Mobminder', 5:'Mobminder', 6:'Mobminder', 7:'Mobminder', 8:'Mobminder' };
C_XL.d['medminder'] = { 0:'Medminder', 1:'Medminder', 2:'Medminder', 3:'Medminder', 4:'Medminder', 5:'Medminder', 6:'Medminder', 7:'Medminder', 8:'Medminder' };

// e-reservation Web page 


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   e - R E S A . j s 
//

C_XL.d['e-step ident'] 	= { 0:'Identify yourself',		1:'S\'identifier',			2:'Przedstaw się',		3:'Identificeer jezelf',	4:'Bitte melden Sie sich an',	5:'Identificarsi',				6:'Identificarse', 			7:'Identificar-se', 			8:'Identifizéiert Iech'	};
C_XL.d['e-step options']= { 0:'Choose your options',	1:'Vos options',			2:'Wybierz opcje',		3:'Kies uw opties',			4:'Ihre Optionen',				5:'Le Sue opzioni',				6:'Sus opciones', 			7:'as suas opções', 			8:'Wielt Är Optiounen'	};
C_XL.d['e-step select'] = { 0:'Select an appointment',	1:'Sélectionner un RDV',	2:'Wybierz termin',		3:'Selecteer een afspraak',	4:'Termin auswählen',			5:'Selezionare un appuntamento',6:'Seleccionar una cita', 	7:'Selecionar uma consulta', 	8:'Wielt e Rendez-vous'	};
C_XL.d['e-step confirm']= { 0:'Confirm your choice',	1:'Confirmer votre choix',	2:'Potwierdź wybór',	3:'Bevestig uw keuze',		4:'auswahl bestätigen',			5:'Confermare la Sua scelta',	6:'Confirmar su elección', 	7:'Confirmar a sua escolha', 	8:'Confirméiert Är Wiel'	};
C_XL.d['e-step thanks'] = { 0:'It is done',				1:'C\'est terminé',			2:'Odbywa się to',		3:'afgerond',				4:'Fertig',						5:'Terminato',					6:'acabado', 				7:'Terminou', 				8:'Et ass gemaach'	};


	// eresa SEO

C_XL.d['e- in_place'] = { 0:'in', 1:'à', 2:'w', 3:'in', 4:'in', 5:'a', 6:'en', 7:'em', 8:'an' };

C_XL.d['e- make an app with'] = { 
	0:'quickly make online an appointment with',
	1:'prenez rapidement un rendez-vous en ligne avec',
	2:'umów się szybko na spotkanie online z',
	3:'boek nu snel online een afspraak met',
	4:'Vereinbaren Sie schnell online einen Termin mit',
	5:'fissate un rapido appuntamento online con',
	6:'concierte una cita rápida en línea con', 
	7:'marque rapidamente uma reunião com',
	8:'maacht séier online e Rendez-vous mat' // luxembourgish
};

// buttons captions
C_XL.d['authify me'] = { 0:'Verify', 1:'Vérifier', 2:'Zidentyfikować mnie', 3:'Verifiëren', 4:'Mich anmelden', 5:'Mi identifico', 6:'Me identifico', 7:'Identifico-me', 8:'Iwwerpréift mech' };
C_XL.d['identify me'] = { 0:'Check me in', 1:'Je m\'identifie', 2:'Zidentyfikować mnie', 3:'In checken', 4:'Mich anmelden', 5:'Mi identifico', 6:'Me identifico', 7:'Identifico-me', 8:'Checkt mech an' };
C_XL.d['try again'] = { 0:'Try again', 1:'Ré-essayer', 2:'Spróbuj ponownie', 3:'Opnieuw checken', 4:'Erneut versuchen', 5:'Riprovare', 6:'Intentar de nuevo', 7:'Tentar novamente', 8:'Probéiert nach eng Kéier' };
C_XL.d['i sign in'] = { 0:'Sign me in', 1:'M\'inscrire', 2:'Zarejestruj mnie', 3:'Ik registreer', 4:'Mich registrieren', 5:'Mi iscrivo', 6:'Me inscribo', 7:'Eu subscrevo', 8:'Registréiert mech' };
C_XL.d['sign in'] = { 0:'Save', 1:'Sauvegarder', 2:'Zapisać', 3:'Opslaan', 4:'Speichern', 5:'Registrare', 6:'Registrar', 7:'Registro', 8:'Späichert' };
C_XL.d['hello'] = { 0:'Hello', 1:'Bonjour', 2:'Cześć', 3:'Dag', 4:'Guten Tag', 5:'Buongiorno', 6:'Buenos días', 7:'Bom dia', 8:'Moien' };
C_XL.d['continue'] = { 0:'Continue', 1:'Continuer', 2:'Kontynuować', 3:'Voortzetten', 4:'Fortfahren', 5:'Continuare', 6:'Continuar', 7:'Continuar', 8:'Weiderfueren' };
C_XL.d['next dates'] = { 0:'Following dates', 1:'Dates suivantes', 2:'Następujące terminy', 3:'Volgende datums', 4:'Folgende Daten', 5:'Date seguenti', 6:'Fechas siguientes', 7:'Datas seguintes', 8:'Folgend Deeg' };


C_XL.d['token sent'] = { 
	0:'We have sent a code on your mail-box.',				
	1:'Nous avons envoyé un code sur votre e-mail.',				
	2:'Mamy kod wysyłany za pośrednictwem poczty e-mail.',			
	3:'Wij hebben een code via e-mail gestuurd.',
	4:'Wir haben Ihnen per E-Mail einen Code gesendet',	
	5:'È stato mandato un codice sulla Sua mail.',	
	6:'Enviamos un código a su e-mail',
	7:'Enviámos um código para o seu e-mail.', 
	8:'Mir hunn Iech e Code per E-Mail geschéckt.' // luxembourgish
};

C_XL.d['use token'] = { 
	0:'Type your code here below to go on with the reservation process.',				
	1:'Introduisez ci-dessous votre code pour poursuivre la réservation.',				
	2:'Wpisz tutaj kod poniżej, aby przejść z procesu rezerwacji.',			
	3:'Typ hieronder uw code om verder te gaan met het boekingsproces.',
	4:'Bitte geben Sie Ihren Code unten ein um mit der Reservierung fortzufahren',	
	5:'Inserisca qui sotto il Suo codice per continuare la prenotazione.',	
	6:'Introduzca su código más abajo para continuar la reserva.',
	7:'Introduza o código abaixo para continuar com a reserva.', 
	8:'Gitt hei drënner Äre Code an, fir mam Reservéierungsprozess weiderzegoen.' // luxembourgish
};

C_XL.d['e-token warning'] = { 
	0:'attention:<br>If you close or refresh this page, your code is no longer valid.<br>emails sometimes take a few minutes before being delivered.<br>Also check if the email does not arrive in your spam.',				
	1:'attention:<br>Si vous fermez ou rafraîchissez cette page, votre code n\'est plus valide.<br>l\'e-mail met parfois quelques minutes avant de vous parvenir.<br>Vérifiez également si le mail n\'est pas arrivé dans vos spam.',				
	2:'Uwaga:<br>Jeśli zamkniesz lub odśwież stronę, Twój kod nie jest już ważna.<br>e-maili czasami zająć kilka minut przed dostarczeniem.<br>Należy również sprawdzić, czy e-mail nie dotrze w spam.',		
	3:'Opgepast:<br>Als u deze pagina dicht doet of hernieuwt, is uw code niet meer geldig.<br>emails hebben soms enkelen minuten nodig om aan te komen.<br>Controleer ook of de e-mail niet in uw spam aankomt.',	
	4:'achtung:<br>Wenn Sie diese Seite schließen oder aktualisieren, ist ihr Code nicht mehr gültig.<br>Manchmal kann es einige Minuten dauern, bis E-Mails im Posteingang ankommen.<br>Bitte überprüfen Sie auch Ihren Spam-Ordner.',	
	5:'attenzione:<br>Se chiude o aggiorna questa pagina, il Suo codice non sarà più valido.<br>la mail a volte può mettere qualche minuto ad arrivare.<br>Controlli anche che la mail non sia arrivata nello spam.',	
	6:'atención:<br>Si cierra o actualiza esta página, su código ya no será válido.<br>el e-mail a veces tarda unos minutos antes de llegar.<br>Compruebe también que el e-mail no llegó en los spams.',
	7:'atenção:<br>Se você fechar ou atualizar esta página, o seu código não será mais válido.<br>Pode demorar alguns instantes até receber o e-mail.<br>Verifique também se o e-mail não foi para a sua caixa de spam.',
	8:'Opgepasst:<br>Wann Dir dës Säit zoumaacht oder aktualiséiert, ass Äre Code net méi valabel.<br>E-Maile kënnen heiansdo e puer Minutten daueren fir ze kommen.<br>Préift och Äre Spam-Ordner.' // luxembourgish
};

C_XL.d['bad token'] = { 
	0:'The inserted code is wrong, you will receive a new code.',				
	1:'Le code introduit est erroné, vous recevrez un nouveau code.',				
	2:'Wstawiony kod jest nieprawidłowy, otrzymasz nowy kod.',			
	3:'De ingevoerde code is verkeerd, u gaat een nieuwe code ontvangen.',
	4:'Der eingegebene Code ist falsch, Sie erhalten in Kürze einen neuen Code.',	
	5:'Il codice inserito è erroneo, riceverà un nuovo codice.',
	6:'El código introducido está equivocado, recibirá un nuevo código.',
	7:'O código introduzido não está certo. Você irá receber um novo código.', 
	8:'De agebueden Code ass falsch, Dir kritt en neie Code.' // luxembourgish
};

// eVisitor identification messages

C_XL.d['e-welcome'] = { 
	0:'Welcome.<br/>Please enter your e-mail.',				
	1:'Bienvenue.<br/>SVP introduisez votre e-mail.',				
	2:'Witamy.<br/>Podaj swój adres e-mail.',			
	3:'Welkom.<br/>Vul alstublieft uw e-mailadres in.',
	4:'Willkommen.<br/>Bitte geben Sie Ihre E-Mail Adresse ein.',	
	5:'Benvenuto.<br/>Per favore inserisca il suo indirizzo email.',	
	6:'Bienvenido.<br/>Por favor introduzca su dirección e-mail.',
	7:'Bem-vindo.<br/>Por favor, introduza o seu endereço de e-mail.',
	8:'Wëllkomm.<br/>Gitt w.e.g. Är E-Mail Adress an.' // luxembourgish
};

C_XL.d['fill mobile'] = { 
	0:'in order to proceed with you identification, please fill in your mobile number',				
	1:'afin de complétez votre identification, svp indiquez votre numéro de portable',				
	2:'w celu dokończenia identyfikacji prosimy o podanie numeru telefonu komórkowego',			
	3:'om uw identificatie te vervolledigen, dient u uw mobiele nummer op te geven',	
	4:'Zur Vervollständigung Ihrer Identifizierung geben Sie bitte Ihre Handynummer an',	
	5:'una volta completata la tua identificazione, svp indica il tuo numero di portatile',	
	6:'afin de complétez votre identificación, svp indiquez votre numéro de portable',
	7:'para completar a sua identificação, por favor indique o seu número de telemóvel',
	8:'Fir Är Identifikatioun ofzeschléissen, gitt w.e.g. Är Handysnummer un.' // luxembourgish
};

C_XL.d['eresa identified more'] = { 
	0:'The following visitors are associated with your email:',				
	1:'Voici la liste des visitors associées à votre email:',				
	2:'Oto lista visitors powiązanych z Twoim adresem e-mail.',			
	3:'Hier is de lijst met visitors die aan uw e-mailadres zijn gekoppeld.',
	4:'Hier ist die Liste der visitors, die mit Ihrer E-Mail verknüpft sind.',	
	5:'Ecco l\'elenco dei visitors associati alla tua email.',
	6:'Aquí está la lista de visitors asociados con su correo electrónico.', 
	7:'Aqui está a lista de visitors associados ao seu e-mail.',
	8:'Dëst ass d\'Lëscht vun de Visiteuren, déi mat Ärer E-Mail verbonne sinn.' // luxembourgish
};

C_XL.d['eresa identified one'] = { 
	0:'Please pick from the 2 options below',				
	1:'Bonjour, choisissez une de ces deux options',				
	2:'Witaj, wybierz jedną z tych dwóch opcji.',		
	3:'Hallo, kies een van deze twee opties.',	
	4:'Hallo, wählen Sie eine dieser beiden Optionen.',	
	5:'Ciao, scegli una di queste due opzioni.',	
	6:'Hola, elige una de estas dos opciones.', 
	7:'Olá, escolha uma dessas duas opções.',
	8:'Moien, wielt eng vun dësen zwou Optiounen aus.' // luxembourgish
};

C_XL.d['eresa register more'] = { 
	0:'Register one more person',				// button caption
	1:'Enregistrer une personne supplémentaire',				
	2:'Zarejestruj dodatkową osobę',			
	3:'Registreer een extra persoon',	
	4:'Melden Sie eine weitere Person an',	
	5:'Registra un\'altra persona',	
	6:'Registrar una persona adicional', 
	7:'Registrar uma pessoa adicional',
	8:'Registréiert eng weider Persoun' // luxembourgish
};


// 		technical 				english:0,				
//								// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7
C_XL.d['slotsearch'] = { 0:'Search', 1:'Rechercher', 2:'Szukaj', 3:'Zoeken', 4:'Suchen', 5:'Ricercare', 6:'Buscar', 7:'Pesquisar', 8:'Sichen' };

C_XL.d['optional'] = { 0:'optional', 1:'facultatif', 2:'fakultatywny', 3:'facultatief', 4:'optional', 5:'facoltativo', 6:'facultativo', 7:'facultativo (não obrigatório)', 8:'Optional' };
C_XL.d['booking options'] = { 0:'Booking', 1:'Réservation', 2:'Rezerwacja', 3:'Reservering', 4:'Reservierung', 5:'Prenotazione', 6:'Reserva', 7:'Reserva', 8:'Reservatioun' };
C_XL.d['identification'] = { 0:'authentication', 1:'Identification', 2:'Uwierzytelniania', 3:'Identificatie', 4:'authentifizierung', 5:'Identificazione', 6:'Nombre usuario', 7:'Identificação', 8:'Identifikatioun' };
C_XL.d['search options'] = { 0:'Search options', 1:'Options de recherche', 2:'Opcje wyszukiwania', 3:'Zoekopties', 4:'Suchoptionen', 5:'Opzioni di ricerca', 6:'Opciones de búsqueda', 7:'Opções de pesquisa', 8:'Sichoptiounen' };
C_XL.d['availabilities'] = { 0:'availabilities', 1:'Disponibilités', 2:'Wolne', 3:'Beschikbaarheden', 4:'Verfügbarkeiten', 5:'Disponibilità', 6:'Disponibilidades', 7:'Disponibilidades', 8:'Disponibilitéiten' };
C_XL.d['confirmation'] = { 0:'Confirmation', 1:'Confirmation', 2:'Potwierdzenie', 3:'Bevestiging', 4:'Bestätigung', 5:'Conferma', 6:'Confirmación', 7:'Confirmação', 8:'Confirmatioun' };
C_XL.d['confirmed'] = { 0:'Confirmed', 1:'Confirmé', 2:'Zatwardziały', 3:'Bevestigd', 4:'Bestätigt', 5:'Confermato', 6:'Confirmado', 7:'Confirmado', 8:'Confirméiert' };


C_XL.d['eresa ident continue one'] = { 
	0:'Make or cancel an appointment',				
	1:'Prendre ou annuler un RDV',				
	2:'Umów się lub odwołaj spotkanie',			
	3:'Maak of annuleer een afspraak',
	4:'Vereinbaren oder stornieren Sie einen Termin',	
	5:'Fissa o annulla un appuntamento',	
	6:'Concierte o cancele una cita', 
	7:'Marque ou cancele um compromisso', 
	8:'Maacht oder annuléiert e Rendez-vous' // luxembourgish
};

C_XL.d['eresa ident continue many'] = { 
	0:'Make or cancel an appointment for one of those persons',				
	1:'Prendre ou annuler un RDV pour l\'une de ces personnes',				
	2:'Umów się lub odwołaj spotkanie dla jednej z tych osób',			
	3:'Maak of annuleer een afspraak voor een van die personen',	
	4:'Vereinbaren oder stornieren Sie einen Termin für eine dieser Personen',	
	5:'Fissa o annulla un appuntamento per una di quelle persone',	
	6:'Concierte o cancele una cita para una de esas personas', 
	7:'Marque ou cancele um compromisso para uma dessas pessoas', 
	8:'Maacht oder annuléiert e Rendez-vous fir eng vun dësen Persounen' // luxembourgish
};

// Unknown email alternative flow
C_XL.d['unknown email'] = { 
	0:'This e-mail is unknown in our system.',				
	1:'Cet email n\'est pas connu de notre système.',				
	2:'Ten adres e-mail jest nieznany w naszym systemie.',			
	3:'Dit e-mail adres is niet bekend in ons systeem.',
	4:'Diese E-Mail Adresse ist unserem System nicht bekannt.',	
	5:'Questa mail non è riconosciuta dal nostro sistema.',	
	6:'Nuestro sistema no reconoce este e-mail.', 
	7:'Este e-mail não é conhecido no nosso sistema.', 
	8:'Dës E-Mail Adress ass eisem System net bekannt.' // luxembourgish
};

C_XL.d['fill gsm&bdate'] = { 
	0:'Please fill in your mobile number and your date of birth.',				
	1:'SVP indiquez numéro de mobile et date de naissance.',		
	2:'Proszę podać numer telefonu i datę urodzenia.',			
	3:'Vul AUB uw mobiele nummer en uw geboortedatum in.',	
	4:'Bitte geben Sie Ihre Mobilnummer und Ihr Geburtsdatum ein.',	
	5:'Completi per favore con il Suo numero di cellulare e data di nascita.',	
	6:'Por favor, complete con su número de móvil y fecha de nacimiento.', 
	7:'Por favor, adicione o seu número de telemóvel e a sua data de nascimento.', 
	8:'Gitt w.e.g. Är Handysnummer an Äre Gebuertsdatum un.' // luxembourgish
};

C_XL.d['retype email'] = { 
	0:'Please check your e-mail or fill it in again.',	
	1:'SVP vérifiez ou ré-écrivez votre e-mail.',		
	2:'Proszę sprawdzić pocztę e-mail lub wypełnić go w.',			
	3:'Controleer AUB uw e-mail of vul hem opnieuw in.',
	4:'Bitte überprüfen Sie Ihre E-Mail Adresse oder geben Sie sie erneut ein.',	
	5:'Per favore controlli o riscriva la Sua mail.',	
	6:'Por favor, compruebe o vuelva a escribir su e-mail.', 
	7:'Verifique ou volte a introduzir o seu e-mail.', 
	8:'Préift oder gitt Är E-Mail nach eng Kéier un.' // luxembourgish
};
							
C_XL.d['pls sign in'] = { 
	0:'You can now register for online booking.',				
	1:'Vous pouvez maintenant vous inscrire pour la réservation en ligne.',				
	2:'Możesz teraz zarejestrować rezerwacji online.',			
	3:'U kunt zich nu registreren voor online reservering.',
	4:'Sie können sich nun für die Online-Buchung anmelden.',	
	5:'adesso può iscriversi per la prenotazione online.',	
	6:'ahora se puede registrar para la reserva online ', 
	7:'agora pode inscrever-se para reserva on-line.', 
	8:'Dir kënnt Iech elo fir d\'Online-Reservatioun umellen.' // luxembourgish
};

C_XL.d['pls opt in'] = { 
	0:'You have read and accepted the privacy policy related to online booking.',				
	1:'Vous avez lu et acceptez la politique de confidentialité relative à la prise de RDV en ligne.',				
	2:'Przeczytałeś i akceptujesz politykę prywatności dotyczącą rezerwacji wizyt online.',			
	3:'U hebt het privacybeleid met betrekking tot het online boeken van afspraken gelezen en geaccepteerd.',
	4:'Sie haben die Datenschutzerklärung zur Online-Terminbuchung gelesen und akzeptiert.',	
	5:'Hai letto e accetti l\'informativa sulla privacy relativa alla prenotazione online degli appuntamenti.',	
	6:'Ha leído y acepta la política de privacidad relativa a la reserva de citas online.', 
	7:'Você leu e aceita a política de privacidade relativa à marcação de consultas online.', 
	8:'Dir hutt d\'Dateschutzpolitik fir Online-Reservatioune gelies a akzeptéiert.' // luxembourgish
};

C_XL.d['read privacy'] = { 
	0:'Read the privacy policy of ',				
	1:'Voir la politique de confidentialité de ', // de dentiste Legrand, de audioconfort ... 
	2:'Zobacz politykę prywatności ',			
	3:'Zie het privacybeleid van ',
	4:'Siehe Datenschutzerklärung von ',	
	5:'Consulta l\'informativa sulla privacy di ',	
	6:'Ver la política de privacidad de ', 
	7:'Consulte a política de privacidade do ', 
	8:'Liest d\'Dateschutzpolitik vun ' // luxembourgish
};

C_XL.d['pls coordinates'] = { 
	0:'Please complete your details below.',	
	1:'Indiquez vos coordonnées complètes ci-dessous.',				
	2:'Proszę wypełnić swoje dane poniżej.',			
	3:'Vul onderstaand uw gegevens in.',
	4:'Bitte vervollständigen Sie Ihre Daten',	
	5:'Inserisca i Suoi dati completi qui sotto.',	
	6:'Indique sus datos completos a continuación.', 
	7:'Insira os seus detalhes abaixo.', 
	8:'Gitt w.e.g. Är Detailer hei drënner un.' // luxembourgish
};

C_XL.d['pls register'] = { 
	0:'Please complete below the details of the to register person.',	
	1:'Indiquez ci-dessous les coordonnées de la personne à inscrire.',				
	2:'Podaj poniżej dane kontaktowe osoby do zarejestrowania.',			
	3:'Vul aub hieronder de contactgegevens van de te registreren persoon.',
	4:'Geben Sie unten die Kontaktdaten der zu registrierenden Person an',	
	5:'Indicare sotto i dettagli di contatto della persona da registrare.',	
	6:'Indique a continuación los datos de contacto de la persona a registrar.', 
	7:'Indique abaixo os detalhes de contato da pessoa para registrar.', 
	8:'Gitt hei drënner d\'Detailer vun der anzeschreiwender Persoun un.' // luxembourgish
};

// 		technical 				english:0,				
//								// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7
								
C_XL.d['warn red field'] = { 
	0:'Fields marked in red may not be left blank.',	
	1:'Les champs en rouge ne peuvent pas rester vides.',				
	2:'Pola oznaczone na czerwono nie może być puste.',			
	3:'Velden gemarkeerd in het rood mogen niet leeg blijven.',
	4:'Rot markierte Felder müssen ausgefüllt werden.',	
	5:'I campi in rosso non possono rimanere vuoti.',	
	6:'Las casillas en rojo no pueden quedarse vacías.', 
	7:'Os campos a vermelho não podem ficar em branco.', 
	8:'Felder markéiert a rout däerfen net eidel gelooss ginn.' // luxembourgish
};

// e-reservation process messages
C_XL.d['pls options'] = { 
	0:'please choose appropriate options and then push the "search" button.',				
	1:'choisissez les options appropriées, puis appuyez sur le bouton "rechercher".',				
	2:'Proszę wybrać odpowiednie opcje, a następnie wciśnij przycisk "Szukaj".',			
	3:'Stel uw voorkeuren in en duw dan op de knop "zoeken".',
	4:'Bitte wählen Sie die zutreffenden Optionen aus und klicken Sie auf "suchen".',	
	5:'Scelga le opzioni adeguate e clicchi su "ricerca".',	
	6:'Por favor, seleccione las opciones adecuadas y haga clic en el botón "buscar".', 
	7:'Escolha as opções apropriadas e, em seguida, carregue no botão “pesquisar”.', 
	8:'Wielt déi passend Optiounen a klickt duerno op de Knäppchen " sichen ".' // luxembourgish
};

C_XL.d['slots here'] = { 
	0:'Here are the possible schedules according to your options',				
	1:'Voici les horaires possibles en fonction de vos options.',				
	2:'Oto możliwe rozkłady według Państwa możliwości.',			
	3:'Dit zijn de afspraakmogelijkheden op basis van uw voorkeuren.',
	4:'Gemäß Ihrer Optionen sind hier die möglichen Termine angezeigt.',	
	5:'Ecco i giorni e orari possibili partendo dalle sue preferenze.',	
	6:'Estos son los horarios posibles basándose en sus opciones.', 
	7:'aqui estão os horários possíveis, dependendo das suas opções.', 
	8:'Hei sinn déi méiglech Zäitpläng no Ären Optiounen.' // luxembourgish
};

C_XL.d['slots as from'] = { 
	0:'Here are the possible schedules as from',				
	1:'Voici les horaires possibles à partir de',				
	2:'Oto możliwe czasy od',			
	3:'Dit zijn de afspraakmogelijkheden vanaf',
	4:'Hier sind die möglichen Zeiten von',	
	5:'Ecco i possibili orari da',	
	6:'aquí están los horarios posibles a partir de', 
	7:'aqui estão os horários possíveis da', 
	8:'Hei sinn déi méiglech Zäitpläng vun' // luxembourgish
};

C_XL.d['slots from today'] = { 
	0:'Here are the schedules available from today',				// alternative message to 'slots here'
	1:'Voici les horaires disponibles à partir d\'aujourd\'hui',
	2:'Oto harmonogramy dostępne od dzisiaj',			
	3:'Hier zijn de schema\'s beschikbaar vanaf vandaag',
	4:'Hier sind die verfügbaren Zeitfenster ab heute,',	
	5:'Ecco gli orari disponibili da oggi',	
	6:'aquí están los horarios disponibles a partir de hoy', 
	7:'aqui estão os horários disponíveis hoje', 
	8:'Hei sinn déi Zäitpläng, déi vun haut un disponibel sinn.' // luxembourgish
};

C_XL.d['slots from tomorrow'] = { 
	0:'Here are the schedules available from tomorrow',		// alternative message to 'slots here'		
	1:'Voici les horaires disponibles à partir de demain',	
	2:'Oto harmonogramy dostępne od jutra',			
	3:'Hier zijn de schema\'s beschikbaar vanaf morgen',
	4:'Hier sind die Termine ab morgen verfügbar',	
	5:'Ecco gli orari disponibili da domani',	
	6:'aquí están los horarios disponibles a partir de mañana', 
	7:'aqui estão os horários disponíveis a partir de amanhã', 
	8:'Hei sinn déi Zäitpläng, déi vu muer un disponibel sinn.' // luxembourgish
};

C_XL.d['pls select'] = { 
	0:'Click on the most appropriate time for your appointment.',				
	1:'Cliquez sur le moment le plus approprié pour votre rendez-vous.',				
	2:'Kliknij na najbardziej odpowiednim czasie na wizytę.',			
	3:'Klik op de meest geschikte tijd voor uw afspraak.',
	4:'Bitte klicken Sie auf einen Termin, der Ihnen passt.',	
	5:'Clicchi sul momento più adeguato per fissare il suo appuntamento.',	
	6:'Haga clic en el momento que más le conviene para su cita.', 
	7:'Clique sobre o momento mais adequado para a sua consulta.', 
	8:'Klickt op déi passend Zäit fir Äre Rendez-vous.' // luxembourgish
};

C_XL.d['e- you have chosen'] = { 
	0:'you have chosen an appointment on ',				
	1:'vous avez choisi un rendez-vous le ',				
	2:'wybrałeś umówiony na ',			
	3:'u heeft gekozen voor een afspraak op ',
	4:'Ihr ausgewählter Termin ist am',
	5:'ha scelto un appuntamento il ',	
	6:'ha elegido una cita el', 
	7:'escolheu uma consulta em ', 
	8:'Dir hutt e Rendez-vous gewielt den ' // luxembourgish
};
							
C_XL.d['e- you are app yet on'] = { 
	0:'you are appointed yet on ',				
	1:'Vous avez déjà rendez-vous pour',				
	2:'wybrałeś umówiony na ',			
	3:'u heeft afgesproken op ',
	4:'Ihr Termin ist am',	
	5:'Il suo appuntamento è fissato per il giorno',	
	6:'Ya tiene una cita para', 
	7:'tem uma consulta',
	8:'Dir hutt schonn e Rendez-vous den' // luxembourgish
};

C_XL.d['e- has no planned appointment'] = { 
	0:'does not currently have a scheduled appointment',				
	1:'n\'a actuellement pas de rendez-vous planifié',				
	2:'nie ma obecnie zaplanowanego spotkania',			
	3:'heeft momenteel geen geplande afspraak',
	4:'hat momentan keinen geplanten Termin',	
	5:'non ha attualmente un appuntamento programmato',	
	6:'no tiene una cita programada actualmente', 
	7:'ainda não tem um compromisso agendado',
	8:'huet de Moment kee geplangte Rendez-vous' // luxembourgish
};

C_XL.d['e-choose who to book for'] = { 
	0:'you are appointed yet on ',				
	1:'Sélectionnez ici la ou les personnes pour laquelle vous prenez un RDV',				
	2:'wybrałeś umówiony na ',			
	3:'u heeft afgesproken op ',
	4:'Ihr Termin ist am',	
	5:'Il suo appuntamento è fissato per il giorno',	
	6:'Seleccione aquí la o las personas para las que toma la cita', 
	7:'tem uma consulta',
	8:'Wielt hei d\'Persoun(en) aus, fir déi Dir e Rendez-vous hëlt' // luxembourgish
};

C_XL.d['e- you have no appointments'] = { 
	0:'You have no appointment in this agenda.',
	1:'Vous n\'avez pas de rendez-vous dans cet agenda.',				
	2:'Nie musisz wydarzenie w tym kalendarzu.',			
	3:'U heeft geen afspraak in deze agenda.',
	4:'Sie haben in diesem Kalender keine Termine.',	
	5:'Non ha nessun appuntamento in quest\'agenda.',	
	6:'No tiene ninguna cita en este calendario.', 
	7:'Não tem consulta marcada neste calendário.',
	8:'Dir hutt keng Rendez-vous an dësem Agenda' // luxembourgish
};

C_XL.d['e- deletion unavailable'] = { 
	0:'Online cancellation of an appointment is not allowed.',
	1:'L\'annulation en ligne d\'un RDV n\'est pas autorisée.',				
	2:'anulowanie Online spotkanie nie jest dozwolone.',			
	3:'Online annulering van een afspraak is niet toegestaan.',	
	4:'Es ist nicht möglich, Termine online abzusagen.',	
	5:'La cancellazione online di un appuntamento non è autorizzata.',	
	6:'La cancelación online de una cita nos está autorizada.', 
	7:'Não é permitido cancelar uma consulta online.',
	8:'Online Annulatioun vun engem Rendez-vous ass net erlaabt' // luxembourgish
};

C_XL.d['e- touch to delete'] = { 
	0:'Touch an item to access a cancellation option.',
	1:'Toucher votre RDV pour accéder à l\'option d\'annulation.',				
	2:'Dotknij element, aby uzyskać dostęp do opcji anulowania.',			
	3:'Tik op een bovenstaande afspraak voor een optie tot annulatie.',
	4:'Bitte wählen Sie einen Termin aus, um Stornierungsmöglichkeiten zu sehen.',	
	5:'Tocchi un appuntamento per accedere all\'opzione di cancellazione.',	
	6:'Toque su cita para acceder a la opción de cancelación.', 
	7:'Toque numa consulta para aceder à opção de cancelamento.',
	8:'Beréiert en Element, fir d\'Annulatiounsoptioun opzemaachen' // luxembourgish
};

C_XL.d['e- click to delete'] = { 
	0:'Click an item to access a cancellation option.',
	1:'Cliquez votre RDV pour accéder à l\'option d\'annulation.',				
	2:'Kliknij element, aby uzyskać dostęp do opcji anulowania.',			
	3:'Klik op een bovenstaande afspraak voor een optie tot annulatie.',
	4:'Klicken Sie auf einen Termin, um die Stornierungsmöglichkeiten anzuzeigen.',	
	5:'Clicchi sull’appuntamento per accedere all’opzione di cancellazione.',	
	6:'Haga clic en su cita para acceder a la opción de cancelación.', 
	7:'Clique numa consulta para ver a opção de cancelamento.', 
	8:'Klickt op e Rendez-vous, fir d\'Optioun z\'annuléieren opzemaachen' // luxembourgish
};

C_XL.d['Cancellation_before_1h'] = { 
    0:'Cancellation is possible up to 1 hour before the appointment !',
    1:'L\'annulation est possible jusqu\'à 1 heure avant le rendez-vous !',
    2:'Anulacja jest możliwa do 1 godziny przed spotkaniem !',
    3:'Annuleren is mogelijk tot 1 uur voor de afspraak !',
    4:'Stornierung ist bis 1 Stunde vor dem Termin möglich !',
    5:'La cancellazione è possibile fino a 1 ora prima dell\'appuntamento !',
    6:'¡La cancelación es posible hasta 1 hora antes de la cita !',
    7:'O cancelamento é possível até 1 hora antes do compromisso !',
    8:'Ofsoenung ass bis zu 1 Stonn virum Rendez-vous méiglech!' // luxembourgish
};

C_XL.d['Cancellation_before_12h'] = { 
    0:'Cancellation is possible up to 12 hours before the appointment!',
    1:'L\'annulation est possible jusqu\'à 12 heures avant le rendez-vous !',
    2:'Anulacja jest możliwa do 12 godzin przed spotkaniem!',
    3:'Annuleren is mogelijk tot 12 uur voor de afspraak!',
    4:'Stornierung ist bis 12 Stunden vor dem Termin möglich!',
    5:'La cancellazione è possibile fino a 12 ore prima dell\'appuntamento!',
    6:'¡La cancelación es posible hasta 12 horas antes de la cita!',
    7:'O cancelamento é possível até 12 horas antes do compromisso!',
    8:'Ofsoenung ass bis zu 12 Stonnen virum Rendez-vous méiglech!' // luxembourgish
};
	
C_XL.d['Cancellation_before_24h'] = { 
    0:'Cancellation is possible up to 24 hours before the appointment!',
    1:'L\'annulation est possible jusqu\'à 24 heures avant le rendez-vous !',
    2:'Anulacja jest możliwa do 24 godzin przed spotkaniem!',
    3:'Annuleren is mogelijk tot 24 uur voor de afspraak!',
    4:'Stornierung ist bis 24 Stunden vor dem Termin möglich!',
    5:'La cancellazione è possibile fino a 24 ore prima dell\'appuntamento!',
    6:'¡La cancelación es posible hasta 24 horas antes de la cita!',
    7:'O cancelamento é possível até 24 horas antes do compromisso!',
    8:'Ofsoenung ass bis zu 24 Stonnen virum Rendez-vous méiglech!' // luxembourgish
};
	
C_XL.d['Cancellation_before_48h'] = { 
    0:'Cancellation is possible up to 48 hours before the appointment!',
    1:'L\'annulation est possible jusqu\'à 48 heures avant le rendez-vous !',
    2:'Anulacja jest możliwa do 48 godzin przed spotkaniem!',
    3:'Annuleren is mogelijk tot 48 uur voor de afspraak!',
    4:'Stornierung ist bis 48 Stunden vor dem Termin möglich!',
    5:'La cancellazione è possibile fino a 48 ore prima dell\'appuntamento!',
    6:'¡La cancelación es posible hasta 48 horas antes de la cita!',
    7:'O cancelamento é possível até 48 horas antes do compromisso!',
    8:'Ofsoenung ass bis zu 48 Stonnen virum Rendez-vous méiglech!' // luxembourgish
};

C_XL.d['Cancellation_before_72h'] = { 
    0:'Cancellation is possible up to 72 hours before the appointment!',
    1:'L\'annulation est possible jusqu\'à 72 heures avant le rendez-vous !',
    2:'Anulacja jest możliwa do 72 godzin przed spotkaniem!',
    3:'Annuleren is mogelijk tot 72 uur voor de afspraak!',
    4:'Stornierung ist bis 72 Stunden vor dem Termin möglich!',
    5:'La cancellazione è possibile fino a 72 ore prima dell\'appuntamento!',
    6:'¡La cancelación es posible hasta 72 horas antes de la cita!',
    7:'O cancelamento é possível até 72 horas antes do compromisso!',
    8:'Ofsoenung ass bis zu 72 Stonnen virum Rendez-vous méiglech!' // luxembourgish
};
	
C_XL.d['Cancellation_before_7days'] = { 
    0:'Cancellation is possible up to 7 days before the appointment!',
    1:'L\'annulation est possible jusqu\'à 7 jours avant le rendez-vous !',
    2:'Anulacja jest możliwa do 7 dni przed spotkaniem!',
    3:'Annuleren is mogelijk tot 7 dagen voor de afspraak!',
    4:'Stornierung ist bis 7 Tage vor dem Termin möglich!',
    5:'La cancellazione è possibile fino a 7 giorni prima dell\'appuntamento!',
    6:'¡La cancelación es posible hasta 7 días antes de la cita!',
    7:'O cancelamento é possível até 7 dias antes do compromisso!',
    8:'Ofsoenung ass bis zu 7 Deeg virum Rendez-vous méiglech!' // luxembourgish
};


C_XL.d['e- more app'] = { 
	0:'take one more appointment',				
	1:'prendre encore un RDV',				
	2:'jeszcze jeden termin',			
	3:'nog een afspraak maken',
	4:'Einen weiteren Termin vereinbaren',	
	5:'prendere un altro appuntamento',	
	6:'tomar otra cita', 
	7:'marcar outra consulta',
	8:'nach e Rendez-vous huelen' // luxembourgish
};
							
C_XL.d['e- done ok'] = { 
	0:'Quit', 
	1:'Terminé', 
	2:'Porzucić', 
	3:'Klaar', 
	4:'Beenden', 
	5:'Terminato', 
	6:'acabado', 
	7:'Terminado', 
	8:'Ophale' // luxembourgish
};

C_XL.d['modify options'] = { 
	0:'Modify my options',				
	1:'Modifier mes options',				
	2:'Zmodyfikować moje opcje',			
	3:'Wijzig mijn opties',
	4:'Meine Auswahl anpassen',	
	5:'Modificare le mie opzioni',	
	6:'Modificar mis opciones', 
	7:'alterar as minhas opções', 
	8:'Meng Optiounen änneren' // luxembourgish
};

C_XL.d['e- del confirm'] = { 
	0:'Pls confirm deletion',				
	1:'Confirmez la suppression',				
	2:'Potwierdź usunięcie.',			
	3:'Bevestig de verwijdering',
	4:'Bitte die Löschung bestätigen',	
	5:'Confermare la cancellazione',	
	6:'Confirmar la cancelación', 
	7:'Confirmar que desejo apagar', 
	8:'Bestätegt w.e.g. d\'Läschung' // luxembourgish
};

C_XL.d['e- pls confirm'] = { 
	0:'Please confirm your choice.',				
	1:'S\'il vous plaît confirmez votre choix.',				
	2:'Potwierdź wybór.',			
	3:'Bevestig AUB nu uw keuze.',
	4:'Bitte bestätigen Sie Ihre Wahl.',	
	5:'Confermi la Sua scelta.',	
	6:'Confirme su elección.', 
	7:'Confirme a sua escolha.', 
	8:'Confirméiert w.e.g. Är Wiel' // luxembourgish
};

C_XL.d['e- pls note&confirm'] = { 
	0:'Please type in a note if necessary, then confirm your choice.',	// en			
	1:'Indiquez une note si nécessaire, et ensuite confirmez votre choix.',	// fr			
	2:'Proszę wpisać w notatce w razie potrzeby, a następnie potwierdzić wybór.',	// pl			
	3:'Eventuele vragen of opmerkingen kunt u hier melden. Bevestig AUB nadien uw keuze.', // nl
	4:'Bitte geben Sie bei Bedarf eine Notiz ein, und bestätigen Sie dann Ihre Wahl.',	// de	
	5:'Indichi una nota se necessario, e poi confermi la Sua scelta.',	// it	
	6:'Indique una nota si es necesario, y luego confirme su elección.', 
	7:'Se necessário, indique uma nota, e em seguida confirme a sua escolha.', // pt	
	8:'Wann néideg, tippt eng Notiz an a confirméiert dann Är Wiel.' // luxembourgish
};

C_XL.d['e- black listed'] = { 
	0:'You can not make an appointment on this page. Please contact us by phone.',				
	1:'Vous ne pouvez pas prendre de RDV sur cette page. SVP contactez nous par téléphone.',	
	2:'Nie możesz umówić się na tę stronę. Prosimy o kontakt telefoniczny.',			
	3:'Je kunt geen afspraak maken op deze pagina. Neem telefonisch contact met ons op.',
	4:'Sie können auf dieser Seite keinen Termin vereinbaren. Bitte kontaktieren Sie uns telefonisch.',	
	5:'Non puoi fissare un appuntamento su questa pagina. Vi preghiamo di contattarci telefonicamente.',	
	6:'No puede tomar una cita en esta página. Por favor contáctenos por teléfono.', 
	7:'Você não pode marcar uma consulta nesta página. Entre em contato conosco por telefone.', 
	8:'Dir kënnt kee Rendez-vous op dëser Säit maachen. Kontaktéiert eis w.e.g. per Telefon.' // luxembourgish
};
							
							
C_XL.d['e- your AMPM preference'] = { 
	0:'My days of preference',				
	1:'Mes jours de préférence',	
	2:'Moje dni preferencji',			
	3:'Mijn dagen van voorkeur',
	4:'Meine Tage der Vorliebe',	
	5:'I miei giorni di preferenza',	
	6:'Mis días de preferencia', 
	7:'Meus dias de preferência', 
	8:'Meng Preferenzdeeg' // luxembourgish
};

C_XL.d['search as from'] = { 
	0:'availability as of',				
	1:'Disponibilité à partir de',	
	2:'Dostępność od',			
	3:'Beschikbaarheid vanaf',
	4:'Verfügbarkeit ab',	
	5:'Disponibilità da',	
	6:'Disponibilidad a partir de', 
	7:'Disponibilidade a partir de', 
	8:'Disponibilitéit vun' // luxembourgish
};

C_XL.d['e-reserved fine'] = { 
	0:'Your reservation is properly saved.',				
	1:'Votre réservation est bien enregistrée.',				
	2:'Państwa rezerwacja jest zapisane.',			
	3:'Uw reservering wordt opgeslagen.',
	4:'Ihr Termin wurde erfolgreich gespeichert.',	
	5:'La Sua prenotazione è stata registrata con successo.',
	6:'Su reserva se registró con éxito.', 
	7:'a sua reserva foi registada com sucesso.', 
	8:'Är Reservatioun gouf erfollegräich gespäichert.' // luxembourgish
};

C_XL.d['e-goodbye'] = { 
	0:'Thank you for visiting us. You can close this page.',				
	1:'Merci pour votre visite. Vous pouvez fermer cette page.',				
	2:'Dziekuje za odwiedziny. Możesz zamknąć tę stronę.',			
	3:'Bedankt voor uw bezoek. U kunt deze pagina afsluiten.',	
	4:'Vielen Dank für Ihren Besuch. Sie können dieses Fenster schließen.',	
	5:'Grazie della Sua visita. Ora può chiudere questa pagina.',	
	6:'Gracias por visitarnos. Puede cerrar esta página.', 
	7:'Obrigada pela sua visita. Pode fechar esta página.', 
	8:'Merci fir Är Visitt. Dir kënnt dës Säit zoumaachen.' // luxembourgish
};

C_XL.d['e- no registr'] = { 
	0:'Sorry, we cannot find you in the file and online registration is not allowed.',				
	1:'Désolé, nous ne pouvons pas vous trouver dans le registre et l\'inscription en ligne n\'est pas autorisée.',				
	2:'Niestety, nie możemy cię znaleźć w pliku, a rejestracja online jest niedozwolone.',			
	3:'Sorry, we kunnen U niet vinden in het bestand en online registratie is niet toegestaan.',
	4:'Tut uns Leid, leider können wir Sie in unserem Verzeichnis nicht finden und die Registrierung ist online nicht möglich. ',	
	5:'Siamo spiacenti, non La troviamo nel registro e l\'iscrizione online non è autorizzata.',	
	6:'Disculpe, no le encontramos en el registro y la inscripción online no está autorizada.', 
	7:'Desculpe, mas não foi possível encontrá-lo/a no registo. A inscrição em linha não foi autorizada.', 
	8:'Entschëllegt, mir kënnen Iech net am Fichier fannen an Online-Umeldung ass net erlaabt.' // luxembourgish
};

// Tooltips
C_XL.d['tip e-search'] = { 
	0:'Show the possibilities in relation to these options',				
	1:'Montrer les possibilités en rapport avec ces options',				
	2:'Lista możliwości w stosunku do tych opcji',			
	3:'Toon de mogelijkheden met betrekking tot deze opties',
	4:'Terminmöglichkeiten anhand dieser Optionen anzeigen',	
	5:'Mostrare le possibilità tenendo conto delle opzioni.',	
	6:'Mostrar las posibilidades relacionadas con estas opciones.', 
	7:'Mostrar as possibilidades em relação a estas opções', 
	8:'Weist d\'Méiglechkeeten am Bezuch op dës Optiounen.' // luxembourgish
};

C_XL.d['tip e-change'] = { 
	0:'One step back so that you can modify your options',				
	1:'Retour à l\'étape précédente, pour modifier les options',				
	2:'Jeden krok do tyłu, tak, że można zmodyfikować opcje',			
	3:'Een stap terug zo dat u uw opties kan wijzigen',
	4:'Zum vorherigen Schritt zurück, um Ihre Optionen anzupassen',	
	5:'Tornare alla tappa precedente, per modificare le opzioni.',	
	6:'Volver a la etapa anterior, para modificar las opciones.', 
	7:'Regressar à etapa precedente para modificar as opções', 
	8:'Een Schratt zréck, fir Är Optiounen z\'änneren.' // luxembourgish
};

//2022-11-11 DEV/JBA - START


C_XL.d['note_payment'] = { 
    0:'Please type in a note if necessary. Your appointment will then be confirmed with the following payment.',
    1:'Indiquez une note si nécessaire. Votre rendez-vous sera ensuite confirmé par le paiement.',
    2:'W razie potrzeby proszę napisać notatkę. Termin spotkania zostanie następnie potwierdzony przez wpłatę',
    3:'Eventuele vragen of opmerkingen kunt u hier melden. Uw afspraak wordt dan na betaling bevestigd.',
    4:'Fragen oder Kommentare können hier gemeldet werden. Ihr Termin wird dann nach der Bezahlung bestätigt',
    5:'Se necessario, inserire una nota. L\'appuntamento sarà poi confermato dal pagamento.',
    6:'Introduzca una nota si es necesario. Su cita será confirmada después del pago.',
    7:'Insira uma nota, se necessário. Seu agendamento será confirmado após o pagamento.',
    8:'Gitt w.e.g. eng Notiz un, wa néideg. Är Rendez-vous gëtt da mat der Bezuelung confirméiert.' // luxembourgish
};

C_XL.d['confirm_payment'] = { 
    0:'Your appointment will be confirmed with the following payment.',
    1:'Votre rendez-vous sera confirmé par le paiement.',
    2:'Termin spotkania zostanie potwierdzony przez wpłatę',
    3:'Uw afspraak wordt na betaling bevestigd.',
    4:'Ihr Termin wird nach der Bezahlung bestätigt',
    5:'L\'appuntamento sarà confermato dal pagamento.',
    6:'Su cita será confirmada después del pago.',
    7:'Seu agendamento será confirmado após o pagamento.',
    8:'Är Rendez-vous gëtt mat der Bezuelung confirméiert.' // luxembourgish
};


C_XL.d['scan_pay'] = { 
    0:'Scan and pay with the Payconiq application',
    1:'Scannez et payez avec l\'application Payconiq',
    2:'Zeskanuj i zapłać za pomocą aplikacji Payconiq',
    3:'Scan en betaal met de Payconiq-applicatie',
    4:'Scan und Bezahlung mit der Payconiq-Applikation',
    5:'Scansione e pagamento con l\'applicazione Payconiq',
    6:'Escanear y pagar con la aplicación Payconiq',
    7:'Scan e pagamento com a aplicação Payconiq',
    8:'Scannt a bezuelt mat der Payconiq-Applikatioun' // luxembourgish
};

C_XL.d['mobile_payment_processing'] = { 
    0:'Mobile payment on hold',
    1:'Paiement mobile en attente',
    2:'Płatność mobilna zawieszona',
    3:'Mobiel betalen in de wacht',
    4:'Mobile Zahlung ausstehend',
    5:'Pagamento mobile in attesa',
    6:'El pago por móvil, en suspenso',
    7:'Pagamento móvel em espera',
    8:'Mobil Bezuelung an der Waardeschlaang' // luxembourgish
};

C_XL.d['abandon'] = { 
    0:'Drop the payment',
    1:'Abandonner le paiement',
    2:'Odstąpić od płatności',
    3:'Afzien van betaling',
    4:'Zahlung aufgeben',
    5:'Abbandonare il pagamento', 
    6:'Abandonar el pago', 
    7:'Abandonar o pagamento',
    8:'Bezuelung opginn' // luxembourgish
};

C_XL.d['payment_cancelled'] = { 
    0:'The transaction has been cancelled',
    1:'La transaction a été annulée',
    2:'Transakcja została anulowana',
    3:'De transactie is geannuleerd',
    4:'Transaktion wurde abgebrochen',
    5:'La transazione è stata annullata',
    6:'La transacción fue cancelada',
    7:'A transacção foi cancelada',
    8:'D\'Transaktioun gouf ofgebrach' // luxembourgish
};


C_XL.d['payconiq_payment'] = { 
    0:'Pay with Payconiq',
    1:'Payer avec Payconiq',
    2:'Płacenie z Payconiq',
    3:'Met Payconiq Betalen',
    4:'Mit Payconiq bezahlen',
    5:'Pagare con Payconiq',
    6:'Pagar con Payconiq',
    7:'Pagar com Payconiq',
    8:'Bezuelt mat Payconiq' // luxembourgish
};

C_XL.d['card_payment'] = { 
    0:'Pay with a card',
    1:'Payer avec une carte',
    2:'Płacenie kartą',
    3:'Met een kaart Betalen',
    4:'Mit einer Karte bezahlen',
    5:'Pagamento con carta',
    6:'Pagar con tarjeta',
    7:'Pagamento por cartão',
    8:'Bezuelt mat enger Kaart' // luxembourgish
};

C_XL.d['Colordepth_problem_info'] = { 
    0:'To make a reservation with {0} you must pay a deposit. You need to switch to Safari or Firefox to make this payment.',
    1:'Pour réserver chez {0} vous devez verser un acompte. Vous devez passer sur Safari ou Firefox pour pouvoir réaliser ce paiement.',
    2:'Aby dokonać rezerwacji u {0} należy wpłacić zaliczkę. Aby dokonać tej płatności należy przełączyć się na Safari lub Firefox.',
    3:'Om te reserveren bij {0} moet u een aanbetaling doen. U moet naar Safari of Firefox overschakelen om deze betaling te doen.',
    4:'Um bei {0} zu buchen, müssen Sie eine Anzahlung leisten. Sie müssen auf Safari oder Firefox wechseln, um diese Zahlung durchführen zu können.',
    5:'Per effettuare una prenotazione con {0} è necessario pagare un deposito. Per effettuare il pagamento è necessario passare a Safari ou Firefox.',
    6:'Para hacer una reserva con {0}, hay que pagar un depósito. Para realizar el pago, es necesario cambiar a Safari o Firefox.',
    7:'Para fazer uma reserva com {0}, deve ser pago um depósito. Para fazer o pagamento, é necessário mudar para Safari ou Firefox.',
    8:'Fir eng Reservatioun bei {0} ze maachen, musst Dir eng Kautioun bezuelen. Dir musst op Safari oder Firefox wiesselen, fir dës Bezuelung ze maachen.' // luxembourgish
};

C_XL.d['earlier_dates'] = { 
    0:'previous dates',
    1:'dates précédentes',
    2:'poprzednie terminy',
    3:'vorige data',
    4:'bisherige Termine',
    5:'date precedenti',
    6:'fechas anteriores',
    7:'datas anteriores',
    8:'vireg Datumen' // luxembourgish
};

C_XL.d['warning_timezone'] = { 
    0:'Please note that the place of service is in a different time zone!',
    1:'Attention, le lieu de prestation se situe sur un autre fuseau horaire!',
    2:'Proszę zwrócić uwagę, że gabinet znajduje się w innej strefie czasowej!',
    3:'Let op: de locatie bevindt zich in een andere tijdzone!',
    4:'Bitte beachten Sie, dass sich der Standort in einer anderen Zeitzone befindet!',
    5:'Si prega di notare che il sito si trova in un fuso orario diverso!',
    6:'Tenga en cuenta que el sitio está en una zona horaria diferente !',
    7:'Note por favor que o sítio está num fuso horário diferente!',
    8:'Opgepasst, de Serviceplaz ass an enger anerer Zäitzon!' // luxembourgish
};

C_XL.d['epay_cardholder'] = {
    0 : 'Cardholder',
    1 : 'Titulaire de la carte',
    2 : 'Posiadacz karty',
    3 : 'Kaarthouder',
    4 : 'Karteninhaber',
    5 : 'Titolare della carta',
    6 : 'Titular de la tarjeta',
    7 : 'Titular do cartão',
    8 : 'Kaarteninhaber' // luxembourgish
};

C_XL.d['epay_cardnumber'] = {
    0 : 'Card number',
    1 : 'Numéro de la carte',
    2 : 'Numer karty',
    3 : 'Kaartnummer',
    4 : 'Kartennummer',
    5 : 'Numero della carta',
    6 : 'Número de tarjeta',
    7 : 'Número do cartão',
    8 : 'Kaartennummer' // luxembourgish
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
	8 : 'MM'
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
	8 : 'JJJJ'
};

C_XL.d['epay_mmyy'] = {
	0 : 'MM/YY',
	1 : 'MM/AA',
	2 : 'MM/RR',
	3 : 'MM/JJ',
	4 : 'MM/JJ',
	5 : 'MM/AA',
	6 : 'MM/AA',
	7 : 'MM/AA',
	8 : 'MM/JJ'
};

C_XL.d['epay_securitycode'] = {
	0 : 'CVC',
	1 : 'CVC',
	2 : 'CVC',
	3 : 'CVC',
	4 : 'CVC',
	5 : 'CVC',
	6 : 'CVC',
	7 : 'CVC',
	8 : 'CVC'
};

C_XL.d['epay_validitydate'] = {
    0 : 'Validity date (month/year)',
    1 : 'Date de validité (mois/année)',
    2 : 'Data ważności (miesiąc/rok)',
    3 : 'Geldigheidsdatum (maand/jaar)',
    4 : 'Gültigkeitsdatum (Monat/Jahr)',
    5 : 'Data di validità (mese/anno)',
    6 : 'Fecha de validez (mes/año)',
    7 : 'Data de validade (mês/ano)',
    8 : 'Valitéit Datum (Mount/Joer)' // luxembourgish
};

C_XL.d['epay_pay'] = {
    0 : 'Pay',
    1 : 'Payer',
    2 : 'Płacić',
    3 : 'Betalen',
    4 : 'Bezahlen',
    5 : 'Pagare',
    6 : 'Pagar',
    7 : 'Pagar',
    8 : 'Bezuelt' // luxembourgish
};

C_XL.d['epay_cancel'] = {
    0 : 'Cancel',
    1 : 'Annuler',
    2 : 'Anulować',
    3 : 'Annuleren',
    4 : 'Stornieren',
    5 : 'Annullare',
    6 : 'Cancelar',
    7 : 'Cancelar',
    8 : 'Ofbriechen' // luxembourgish
};

C_XL.d['epay_paydeposit'] = {
    0 : 'Please pay the deposit of {0}€',
    1 : 'Veuillez payer l’acompte de {0}€',
    2 : 'Proszę zapłacić zadatek w wysokości {0}€',
    3 : 'Gelieve de aanbetaling van {0}€ te betalen',
    4 : 'Bitte zahlen Sie die Anzahlung von {0}€',
    5 : 'Si prega di pagare l\'acconto di {0}€',
    6 : 'Por favor, pague el depósito de {0}€',
    7 : 'Por favor, pague o depósito de {0}€',
    8 : 'Bezuelt w.e.g. déi Kautioun vun {0}€' // luxembourgish
};

C_XL.d['epay_payamount'] = {
    0 : 'Please pay the amount of {0}€',
    1 : 'Veuillez payer la somme de {0}€',
    2 : 'Proszę zapłacić kwotę {0}€',
    3 : 'Gelieve het bedrag van {0}€ te betalen',
    4 : 'Bitte zahlen Sie den Betrag von {0}€',
    5 : 'Si prega di pagare l\'importo di {0}€',
    6 : 'Por favor, pague la cantidad de {0}€',
    7 : 'Por favor, pague o valor de {0}€',
    8 : 'Bezuelt w.e.g. de Betrag vun {0}€' // luxembourgish
};


C_XL.d['epay_paytoconfirm'] = {
    0 : 'Pay to confirm',
    1 : 'Payer pour confirmer',
    2 : 'Zapłać, aby potwierdzić',
    3 : 'Betalen om te bevestigen',
    4 : 'Bezahlen, um zu bestätigen',
    5 : 'Pagare per confermare',
    6 : 'Pagar para confirmar',
    7 : 'Pagar para confirmar',
    8 : 'Bezuelt fir ze confirméieren' // luxembourgish
};

C_XL.d['epay_selectmethod'] = {
    0 : 'Select your payment method',
    1 : 'Sélectionnez votre moyen de paiement',
    2 : 'Wybierz swój sposób płatności',
    3 : 'Selecteer uw betaalmethode',
    4 : 'Wählen Sie Ihre Zahlungsmethode',
    5 : 'Seleziona il tuo metodo di pagamento',
    6 : 'Seleccione su medio de pago',
    7 : 'Selecione o seu método de pagamento',
    8 : 'Wielt Är Bezuelmethod' // luxembourgish
};

C_XL.d['epay_debitcreditcard'] = {
    0 : 'Debit or credit card',
    1 : 'Carte de débit ou de crédit',
    2 : 'Karta debetowa lub kredytowa',
    3 : 'Debitcard of creditcard',
    4 : 'Debitkarte oder Kreditkarte',
    5 : 'Carta di debito o di credito',
    6 : 'Tarjeta de débito o de crédito',
    7 : 'Cartão de débito ou de crédito',
    8 : 'Debitt- oder Kreditkaart' // luxembourgish
};

C_XL.d['epay_blueprintbc'] = {
    0 : 'Your card displays this logo',
    1 : 'Votre carte affiche ce logo',
    2 : 'Twoja karta wyświetla ten logo',
    3 : 'Uw kaart toont dit logo',
    4 : 'Ihre Karte zeigt dieses Logo',
    5 : 'La tua carta mostra questo logo',
    6 : 'Tu tarjeta muestra este logo',
    7 : 'O seu cartão exibe este logotipo',
    8 : 'Är Kaart weist dëse Logo' // luxembourgish
};

C_XL.d['epay_blueprintpayconiq'] = {
    0 : 'Payment using your Payconiq app',
    1 : 'Paiement à l\'aide de votre application Payconiq',
    2 : 'Płatność za pomocą aplikacji Payconiq',
    3 : 'Betaling met behulp van uw Payconiq-app',
    4 : 'Zahlung mit Ihrer Payconiq-App',
    5 : 'Pagamento tramite la tua app Payconiq',
    6 : 'Pago utilizando su aplicación Payconiq',
    7 : 'Pagamento usando seu aplicativo Payconiq',
    8 : 'Bezuelung mat Ärer Payconiq-App' // luxembourgish
};

C_XL.d['epay_blueprintmcvisa'] = {
    0 : 'Your credit or debit card displays this logo',
    1 : 'Votre carte de crédit ou de débit affiche ce logo',
    2 : 'Twoja karta kredytowa lub debetowa wyświetla ten logo',
    3 : 'Uw creditcard of debetkaart toont dit logo',
    4 : 'Ihre Kredit- oder Debitkarte zeigt dieses Logo',
    5 : 'La tua carta di credito o di debito mostra questo logo',
    6 : 'Su tarjeta de crédito o débito muestra este logo',
    7 : 'Seu cartão de crédito ou débito exibe este logotipo',
    8 : 'Är Kredit- oder Debitkaart weist dëse Logo' // luxembourgish
};

C_XL.d['epay_blueprintcvc'] = {
    0 : '3-digit code on the back of your card',
    1 : 'Code à 3 chiffres à l\'arrière de votre carte',
    2 : 'Trzycyfrowy kod na odwrocie Twojej karty',
    3 : '3-cijferige code op de achterkant van uw kaart',
    4 : '3-stelliger Code auf der Rückseite Ihrer Karte',
    5 : 'Codice a 3 cifre sul retro della tua carta',
    6 : 'Código de 3 dígitos en la parte posterior de su tarjeta',
    7 : 'Código de 3 dígitos na parte de trás do seu cartão',
    8 : '3-Zifferen Code um Réck vun Ärer Kaart' // luxembourgish
};


C_XL.setContextLanguage = function() { // presets a bunch of translation implying the keywird visitor(s) based on the visitor alias

	if(vbs) vlog('language.js','C_XL','setContextLanguage','');
	
	// treat jargon variants for visitors
	switch(mobminder.account.visitorAlias) {  // see (*xl01*)
		case mobminder.visitor.codes.patient:
C_XL.d['new visitor'] 	= { 0:'New patient',			1:'Nouveau patient',		2:'Nowy pacjent',				3:'Nieuwe patiënt',				4:'Neuer Patient',				5:'Nuovo paziente',					6:'Nuevo paciente', 				7:'Novo paciente',				8:'Neie Patient'	};
C_XL.d['visitor'] 		= { 0:'patient',				1:'patient',				2:'pacjent',					3:'patiënt',					4:'patient',					5:'paziente',						6:'paciente', 						7:'paciente',					8:'Patient'	};
C_XL.d['no visitor'] 	= { 0:'no patient',				1:'aucun patient',			2:'żaden pacjent',				3:'geen patiënt',				4:'Kein Patient',				5:'nessun paziente',				6:'ningún paciente', 				7:'nenhum paciente',			8:'kee Patient'	};
C_XL.d['no other visitor'] 	= { 0:'no other patient',	1:'pas d\'autre patient',	2:'żaden inny pacjent',			3:'geen andere patiënt',		4:'Keine weiteren Patienten',	5:'nessun altro paziente',			6:'ningún otro paciente', 			7:'nenhum outro paciente',		8:'keen anere Patient'	};
C_XL.d['visitors'] 		= { 0:'patients',				1:'patients',				2:'pacjentów',					3:'patiënten',					4:'patienten',					5:'pazienti',						6:'pacientes', 						7:'pacientes',					8:'Patienten'	};
C_XL.d['many visitors'] = { 0:'Several patients',		1:'Plusieurs patients',		2:'Kilku pacjentów',			3:'Meerdere patiënten',			4:'Mehrere Patienten',			5:'Vari pazienti',					6:'varios pacientes', 				7:'Vários pacientes',			8:'E puer Patienten'	};
C_XL.d['visitor name'] 	= { 0:'Patient name',			1:'Nom du patient',			2:'Imię i nazwisko pacjenta',	3:'Patiënt naam',				4:'Patientname',				5:'Nome del paziente',				6:'Nombre del paciente', 			7:'Nome do paciente',			8:'Numm vum Patient'	};
C_XL.d['visitor note'] 	= { 0:'Patient note',			1:'Note patient',			2:'Uwaga pacjenta',				3:'Patiënt nota',				4:'Patientennotiz',				5:'Nota paziente',					6:'Nota paciente', 					7:'Nota do paciente',			8:'Notiz vum Patient'	};
C_XL.d['visitor birth'] = { 0:'Patient date of birth',	1:'Naissance patient',		2:'Data urodzenia pacjenta',	3:'Patiënt geboortedatum',		4:'Patienten Geburtsdatum',		5:'Data di nascita paziente',		6:'Fecha de nacimiento paciente', 	7:'Data de nascimento do paciente', 	8:'Gebuertsdatum vum Patient'	};
C_XL.d['visitor info'] 	= { 0:'Patient Information',	1:'Information Patient',	2:'Dane pacjenta',				3:'Patiënt gegevens',			4:'Patienteninformationen',		5:'Informazione paziente',			6:'Datos paciente', 				7:'Dados do paciente',			8:'Informatiounen iwwer de Patient'	};
			break;
		case mobminder.visitor.codes.client:
C_XL.d['new visitor'] 	= { 0:'New Client',				1:'Nouveau Client',		2:'Nowy Klient',			3:'Nieuwe klant',		4:'Neuer Kunde',			5:'Nuovo cliente',			6:'Nuevo cliente', 					7:'Novo cliente',		8:'Neie Client'	};
C_XL.d['visitor'] 		= { 0:'client',					1:'client',				2:'klient',					3:'klant',				4:'kunde',					5:'cliente',				6:'cliente', 						7:'cliente',			8:'Client'	};
C_XL.d['no visitor'] 	= { 0:'no client',				1:'aucun client',		2:'żaden klient',			3:'geen klant',			4:'Kein Kunde',				5:'nessun cliente',			6:'ningún cliente', 				7:'nenhum cliente',		8:'kee Client'	};
C_XL.d['no other visitor'] 	= { 0:'no other client',	1:'pas d\'autre client',2:'żaden inny klient',		3:'geen andere klant',	4:'Keine weiteren Kunden',	5:'nessun altro cliente',	6:'ningún otro cliente', 			7:'nenhum outro cliente',	8:'keen anere Client'	};
C_XL.d['visitors'] 		= { 0:'clients',				1:'clients',			2:'klienci',				3:'klanten',			4:'kunden',					5:'clienti',				6:'clientes', 						7:'clientes',			8:'Clienten'	};
C_XL.d['many visitors'] = { 0:'Several clients',		1:'Plusieurs clients',	2:'Kilku klientów',			3:'Meerdere klanten',	4:'Mehrere Kunden',			5:'Vari clienti',			6:'Varios clientes', 				7:'Vários clientes',	8:'E puer Clienten'	};
C_XL.d['visitor name'] 	= { 0:'Client name',			1:'Nom du client',		2:'Nazwa klienta',			3:'Klant naam',			4:'Kundenname',				5:'Nome del cliente',		6:'Nombre del cliente', 			7:'Nome do cliente',	8:'Numm vum Client'	};
C_XL.d['visitor note'] 	= { 0:'Client note',			1:'Note client',		2:'Uwaga klienta',			3:'Klant nota',			4:'Kundennotiz',			5:'Nota cliente',			6:'Nota cliente', 					7:'Nota do cliente',	8:'Notiz vum Client'	};
C_XL.d['visitor birth'] = { 0:'Client date of birth',	1:'Naissance client',	2:'Data urodzenia klienta',	3:'Klant geboortedatum',4:'Kunden Geburtsdatum',	5:'Data di nascita cliente',6:'Fecha de nacimiento cliente', 	7:'Data de nascimento do cliente',	8:'Gebuertsdatum vum Client'	};
C_XL.d['visitor info'] 	= { 0:'Client Information',		1:'Information Client',	2:'Dane klienta',			3:'Klant gegevens',		4:'Kundeninformationen',	5:'Informazione cliente',	6:'Datos cliente', 					7:'Dados do cliente',	8:'Informatiounen iwwer de Client'	};
			break;
		case mobminder.visitor.codes.participant:
C_XL.d['new visitor'] 	= { 0:'New participant',			1:'Nouveau participant',	2:'Nowy uczestnik',			3:'Nieuwe deelnemer',			4:'Neuer Teilnehmer',			5:'Nuovo partecipante',				6:'Nuevo participante', 				7:'Novo participante',			8:'Neie Participanten'			};
C_XL.d['visitor'] 		= { 0:'participant',				1:'participant',			2:'uczestnik',				3:'deelnemer',					4:'teilnehmer',					5:'partecipante',					6:'participante', 						7:'participante',				8:'Participanten'				};
C_XL.d['no visitor'] 	= { 0:'no participant',				1:'aucun participant',		2:'żaden uczestnik',		3:'geen deelnemer',				4:'Kein Teilnehmer',			5:'nessun partecipante',			6:'ningún participante', 				7:'nenhum participante',		8:'kee Participanten'			};
C_XL.d['no other visitor'] 	= { 0:'no other participant',	1:'pas d\'autre participant',2:'żaden inny uczestnik',	3:'geen andere deelnemer',		4:'Keine weiteren Teilnehmer',	5:'nessun altro partecipante',		6:'ningún otro participante', 			7:'nenhum outro participante',	8:'keen anere Participanten'	};
C_XL.d['visitors'] 		= { 0:'participants',				1:'participants',			2:'uczestnicy',				3:'deelnemers',					4:'teilnehmer',					5:'partecipanti',					6:'participantes', 						7:'participantes',				8:'Participanten'				};
C_XL.d['many visitors'] = { 0:'Several participants',		1:'Plusieurs participants',	2:'Kilku uczestników',		3:'Meerdere deelnemers',		4:'Mehrere Teilnehmer',			5:'Vari partecipanti',				6:'Varios participantes', 				7:'Vários participantes',		8:'E puer Participanten'		};
C_XL.d['visitor name'] 	= { 0:'Participant\'s name',		1:'Nom du participant',		2:'Nazwa Uczestnik',		3:'Deelnemer naam',				4:'Teilnehmername',				5:'Nome del partecipante',			6:'Nombre participante', 				7:'Nome do participante',		8:'Numm vum Participanten'		};
C_XL.d['visitor note'] 	= { 0:'Participant note',			1:'Note participant',		2:'Uwaga uczestnik',		3:'Deelnemer nota',				4:'Teilnehmernotiz',			5:'Nota partecipante',				6:'Nota participante', 					7:'Nota do participante',		8:'Notiz vum Participanten'		};
C_XL.d['visitor birth'] = { 0:'Participant date of birth',	1:'Naissance participant',		2:'Uczestnik urodzenie',3:'Deelnemer geboortedatum',	4:'Teilnehmer Geburtsdatum',	5:'Data di nascita partecipante',	6:'Fecha de nacimiento participante', 	7:'Data de nascimento do participante',	8:'Gebuertsdatum vum Participanten'	};
C_XL.d['visitor info'] 	= { 0:'Participant Information',	1:'Information Participant',2:'Informacje uczestnika',	3:'Deelnemer gegevens',			4:'Teilnehmerinformationen',	5:'Informazione partecipante',		6:'Datos participante', 				7:'Dados do participante',		8:'Informatiounen iwwer de Participanten'	};
			break;
	}
	
	// set time slicing expressions
	var oneSlice = (mobminder.account.secondsPerSlice / 60)|0; // number of minutes in one slice (for the timing contextual menu)
	var twoSlices = (oneSlice * 2)|0;
	var threeSlices = (oneSlice * 3)|0;
	
C_XL.d['1 slice mn'] = { 0:oneSlice+' minutes',			1:oneSlice+' minutes',		2:oneSlice+' minut',	3:oneSlice+' minuten',		4:oneSlice+' minuten',			5:oneSlice+' minuti',		6:oneSlice+' minutos',		7:oneSlice+' minutos',		8:oneSlice+' Minutten'	};
C_XL.d['2 slice mn'] = { 0:twoSlices+' minutes',		1:twoSlices+' minutes',		2:twoSlices+' minut',	3:twoSlices+' minuten',		4:twoSlices+' minuten',			5:twoSlices+' minuti',		6:twoSlices+' minutos',		7:twoSlices+' minutos',		8:twoSlices+' Minutten'	};
C_XL.d['3 slice mn'] = { 0:threeSlices+' minutes',		1:threeSlices+' minutes',	2:threeSlices+' minut',	3:threeSlices+' minuten',	4:threeSlices+' minuten',		5:threeSlices+' minuti',	6:threeSlices+' minutos',	7:threeSlices+' minutos',	8:threeSlices+' Minutten'	};
	
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
	
	C_XL.gender.codes[gendercode.female] 	= 'female';	// !! No tranlsation here
	C_XL.gender.codes[gendercode.male] 		= 'male';
	C_XL.gender.codes[gendercode.sa] 		= 'sa';
	C_XL.gender.codes[gendercode.sprl] 		= 'sprl';
	C_XL.gender.codes[gendercode.miss] 		= 'miss';
	C_XL.gender.codes[gendercode.boy] 		= 'boy';
	C_XL.gender.codes[gendercode.girl] 		= 'girl';
	C_XL.gender.codes[gendercode.other] 	= 'othergender'; // target string for translation
	return; 
}



C_XL.d['bullet up'] 		= { 0:'▲',	1:'▲',	2:'▲',	3:'▲',	4:'▲',	5:'▲',	6:'▲',	7:'▲',	8:'▲',	9:'▲'	};
C_XL.d['bullet down'] 		= { 0:'▼',	1:'▼',	2:'▼',	3:'▼',	4:'▼',	5:'▼',	6:'▼',	7:'▼',	8:'▼',	9:'▼'	};

//was missing!
C_XL.d['e-problem'] = { 0:'There is a problem', 1:'Il y a un problème', 2:'Tam jest problem', 3:'Er is een probleem', 4:'Es gibt ein Problem', 5:'C\'è un problema', 6:'Hay un problema', 7:'Há um problema', 8:'Et gëtt e Problem' };

// END OF FILE