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
// © Copyright 2007-2026 - PASCAL VANHOVE -70.12.30-097.72 - Belgium


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

// While producing your output, please keep the textual presentation (one trad on one line)
// Keep the comment at the end of each line
// The words "visitor", and "visitors" are fusion words, they should stay intact if encountered.
// Same applies for "bCals", "uCals", "fCals" that are also fusion keywords, if present.
// Also, if some HTML insert are present ( like <b>, or <br>, or <hr> ), we leave them untouched.
// Fusion zones are identified by $keyword$, like $cssType$ or $visiname$, they stay right where they should :)

C_XL.d['useme']	= { 
	0:'',	// english
	1:'',	// french
	2:'',	// polish
	3:'',	// dutch
	4:'',	// german
	5:'',	// italian
	6:'', 	// spanish
	7:'',	// portuguese
	8:''	// luxembourgish
};	
C_XL.d['and again']={0:'',1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:''};



const countryNames = {
  at: 'Österreich',          // Austria
  'be': 'Belgium',      // Belgium (English)
  'be-nl': 'België',      // Belgium (Dutch)
  'be-fr': 'Belgique',    // Belgium (French)
  bg: 'България',            // Bulgaria
  hr: 'Hrvatska',            // Croatia
  cy: 'Κύπρος',              // Cyprus (Greek)
  cz: 'Česká republika',     // Czech Republic
  dk: 'Danmark',             // Denmark
  ee: 'Eesti',               // Estonia
  fi: 'Suomi',               // Finland
  fr: 'France',              // France
  de: 'Deutschland',         // Germany
  gr: 'Ελλάδα',              // Greece
  hu: 'Magyarország',        // Hungary
  ie: 'Ireland',             // Ireland (English)
  it: 'Italia',              // Italy
  lv: 'Latvija',             // Latvia
  lt: 'Lietuva',             // Lithuania
  lu: 'Lëtzebuerg',          // Luxembourg (Luxembourgish)
  mt: 'Malta',               // Malta
  nl: 'Nederland',           // Netherlands
  pl: 'Polska',              // Poland
  pt: 'Portugal',            // Portugal
  ro: 'România',             // Romania
  sk: 'Slovensko',           // Slovakia
  si: 'Slovenija',           // Slovenia
  es: 'España',              // Spain
  se: 'Sverige',          	// Sweden
  uk: 'United Kingdom'		 // UK
};

ISO3166_1_alpha_2_code_from_ITUT_E_164_CC = function(ITUT_E_164_CC) {
  // turns telephony international country codes into a two-letter ISO3166-1 alpha-2 code

  const e164ToAlpha2 = {
    30:  'gr', // Greece
    31:  'nl', // Netherlands
    32:  'be', // Belgium
    33:  'fr', // France
    34:  'es', // Spain
    36:  'hu', // Hungary
    39:  'it', // Italy
    40:  'ro', // Romania
    43:  'at', // Austria
    44:  'uk', // UK
    45:  'dk', // Denmark
    46:  'se', // Sweden
    48:  'pl', // Poland
    49:  'de', // Germany
    351: 'pt', // Portugal
    352: 'lu', // Luxembourg
    353: 'ie', // Ireland
    356: 'mt', // Malta
    357: 'cy', // Cyprus
    358: 'fi', // Finland
    359: 'bg', // Bulgaria
    370: 'lt', // Lithuania
    371: 'lv', // Latvia
    372: 'ee', // Estonia
    385: 'hr', // Croatia
    386: 'si', // Slovenia
    420: 'cz', // Czech Republic
    421: 'sk'  // Slovakia
  };

  // normalize input to a number
  const cc = (typeof ITUT_E_164_CC === 'string'
    ? parseInt(ITUT_E_164_CC.trim(), 10)
    : ITUT_E_164_CC
  );

  const alpha_2_code = e164ToAlpha2[cc] || 'cc?';
  return alpha_2_code;
}




// C_XL.d['english version'] 		= C_XL.d['0-version'] 	= { 0:'english version',	1:'version anglaise',		2:'angielska wersja',	3:'Engelse versie',		4:'englische Version',			5:'versione inglese',		6:'versión inglesa',	7:'versão em inglês'},
// C_XL.d['french version'] 		= C_XL.d['1-version'] 	= { 0:'french version',		1:'version française',		2:'wersja francuska',	3:'Franse versie',		4:'französische Version',		5:'versione francese',		6:'versión francesa',	7:'versão francesa'},
// C_XL.d['polish version'] 		= C_XL.d['2-version'] 	= { 0:'polish version',		1:'version polonaise',		2:'polska wersja',		3:'Poolse versie',		4:'polnische Version',			5:'versione polacca',		6:'versión polaca',		7:'versão polonesa'},
// C_XL.d['dutch version'] 			= C_XL.d['3-version'] 	= { 0:'dutch version',		1:'version neerlandaise',	2:'wersja holenderska',	3:'nederlandse versie',	4:'Niederländische Version',	5:'versione olandese',		6:'versión neerlandesa',7:'versão neerlandesa'},
// C_XL.d['german version'] 		= C_XL.d['4-version'] 	= { 0:'german version',		1:'version allemande',		2:'wersja niemiecka',	3:'Duitse versie',		4:'Deutsche Version',			5:'Versione tedesca',		6:'version Alemana',	7:'versão alemã'},
// C_XL.d['italian version'] 		= C_XL.d['5-version'] 	= { 0:'italian version',	1:'version italienne',		2:'wersja włoska',		3:'Italiaanse versie',	4:'italienische Version',		5:'versione italiana',		6:'versión italiana',	7:'versão italiana'},
// C_XL.d['spanish version'] 		= C_XL.d['6-version'] 	= { 0:'spanish version',	1:'version espagnole',		2:'wersja hiszpańska',	3:'Spaanse versie',		4:'Spanische Version',			5:'versione spagnola',		6:'versión en español',	7:'versão espanhola'},	
// C_XL.d['portuguese version'] 	= C_XL.d['7-version'] 	= { 0:'portuguese version',	1:'version portuguaise',	2:'wersja portugalska',	3:'Portugese versie',	4:'portugiesische Version',		5:'versione portoghese',	6:'versión portuguesa',	7:'versão portuguesa'},

C_XL.d['english version'] = C_XL.d['0-version'] = {
    0: 'english version',
    1: 'version anglaise',
    2: 'angielska wersja',
    3: 'Engelse versie',
    4: 'englische Version',
    5: 'versione inglese',
    6: 'versión inglesa',
    7: 'versão em inglês',
    8: 'englesch Versioun' // Luxembourgish
};

C_XL.d['french version'] = C_XL.d['1-version'] = {
    0: 'french version',
    1: 'version française',
    2: 'wersja francuska',
    3: 'Franse versie',
    4: 'französische Version',
    5: 'versione francese',
    6: 'versión francesa',
    7: 'versão francesa',
    8: 'franséisch Versioun' // Luxembourgish
};

C_XL.d['polish version'] = C_XL.d['2-version'] = {
    0: 'polish version',
    1: 'version polonaise',
    2: 'polska wersja',
    3: 'Poolse versie',
    4: 'polnische Version',
    5: 'versione polacca',
    6: 'versión polaca',
    7: 'versão polonesa',
    8: 'polnesch Versioun' // Luxembourgish
};

C_XL.d['dutch version'] = C_XL.d['3-version'] = {
    0: 'dutch version',
    1: 'version neerlandaise',
    2: 'wersja holenderska',
    3: 'nederlandse versie',
    4: 'Niederländische Version',
    5: 'versione olandese',
    6: 'versión neerlandesa',
    7: 'versão neerlandesa',
    8: 'nëdersch Versioun' // Luxembourgish
};

C_XL.d['german version'] = C_XL.d['4-version'] = {
    0: 'german version',
    1: 'version allemande',
    2: 'wersja niemiecka',
    3: 'Duitse versie',
    4: 'Deutsche Version',
    5: 'Versione tedesca',
    6: 'versión Alemana',
    7: 'versão alemã',
    8: 'däitsch Versioun' // Luxembourgish
};

C_XL.d['italian version'] = C_XL.d['5-version'] = {
    0: 'italian version',
    1: 'version italienne',
    2: 'wersja włoska',
    3: 'Italiaanse versie',
    4: 'italienische Version',
    5: 'versione italiana',
    6: 'versión italiana',
    7: 'versão italiana',
    8: 'italienesch Versioun' // Luxembourgish
};

C_XL.d['spanish version'] = C_XL.d['6-version'] = {
    0: 'spanish version',
    1: 'version espagnole',
    2: 'wersja hiszpańska',
    3: 'Spaanse versie',
    4: 'Spanische Version',
    5: 'versione spagnola',
    6: 'versión en español',
    7: 'versão espanhola',
    8: 'spuenesch Versioun' // Luxembourgish
};

C_XL.d['portuguese version'] = C_XL.d['7-version'] = {
    0: 'portuguese version',
    1: 'version portuguaise',
    2: 'wersja portugalska',
    3: 'Portugese versie',
    4: 'portugiesische Version',
    5: 'versione portoghese',
    6: 'versión portuguesa',
    7: 'versão portuguesa',
    8: 'lëtzebuergesch Versioun' // Luxembourgish
};

C_XL.d['luxembourgish version'] = C_XL.d['8-version'] = {
    0: 'luxembourgish version',   // English
    1: 'version luxembourgeoise', // French
    2: 'wersja luksemburska',     // Polish
    3: 'Luxemburgse versie',      // Dutch
    4: 'luxemburgische Version', // German
    5: 'versione lussemburghese', // Italian
    6: 'versión luxemburguesa',   // Spanish
    7: 'versão luxemburguesa',    // Portuguese
    8: 'Lëtzebuergesch Versioun'  // Luxembourgish
};

// handy empty structures to be copy/pasted

C_XL.d['empty string'] = { 0:'',	1:'',	2:'',	3:'',	4:'',	5:'',	6:'',	7:'',	8:'',	9:'',	10:''},



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
	},
	every: {
  'weekday1': {0:'every Monday',     1:'tous les lundis',       2:'w każdy poniedziałek', 3:'elke maandag',       4:'jeden Montag',     5:'ogni lunedì',        6:'todos los lunes',         7:'todas as segundas-feiras', 8:'all Méindes'},
  'weekday2': {0:'every Tuesday',    1:'tous les mardis',       2:'w każdy wtorek',      3:'elke dinsdag',       4:'jeden Dienstag',    5:'ogni martedì',       6:'todos los martes',        7:'todas as terças-feiras',   8:'all Dënschdes'},
  'weekday3': {0:'every Wednesday',  1:'tous les mercredis',    2:'w każdą środę',       3:'elke woensdag',      4:'jeden Mittwoch',    5:'ogni mercoledì',     6:'todos los miércoles',      7:'todas as quartas-feiras',  8:'all Mëttwochs'},
  'weekday4': {0:'every Thursday',   1:'tous les jeudis',       2:'w każdy czwartek',    3:'elke donderdag',     4:'jeden Donnerstag',  5:'ogni giovedì',       6:'todos los jueves',         7:'todas as quintas-feiras',  8:'all Donneschdes'},
  'weekday5': {0:'every Friday',     1:'tous les vendredis',    2:'w każdy piątek',      3:'elke vrijdag',       4:'jeden Freitag',     5:'ogni venerdì',       6:'todos los viernes',       7:'todas as sextas-feiras',   8:'all Freides'},
  'weekday6': {0:'every Saturday',   1:'tous les samedis',      2:'w każdą sobotę',      3:'elke zaterdag',      4:'jeden Samstag',     5:'ogni sabato',        6:'todos los sábados',        7:'todos os sábados',          8:'all Samschdes'},
  'weekday7': {0:'every Sunday',     1:'tous les dimanches',    2:'w każdą niedzielę',   3:'elke zondag',        4:'jeden Sonntag',     5:'ogni domenica',      6:'todos los domingos',       7:'todos os domingos',         8:'all Sonndes'}
	},
	plural: {
  'weekday1': {0:'mondays',1:'lundis',2:'poniedziałki',3:'maandagen',4:'Montage',5:'lunedì',6:'lunes',7:'segundas-feiras',8:'Méindes'},
  'weekday2': {0:'tuesdays',1:'mardis',2:'wtorki',3:'dinsdagen',4:'Dienstage',5:'martedì',6:'martes',7:'terças-feiras',8:'Dënschdes'},
  'weekday3': {0:'wednesdays',1:'mercredis',2:'środy',3:'woensdagen',4:'Mittwoche',5:'mercoledì',6:'miércoles',7:'quartas-feiras',8:'Mëttwochs'},
  'weekday4': {0:'thursdays',1:'jeudis',2:'czwartki',3:'donderdagen',4:'Donnerstage',5:'giovedì',6:'jueves',7:'quintas-feiras',8:'Donneschdes'},
  'weekday5': {0:'fridays',1:'vendredis',2:'piątki',3:'vrijdagen',4:'Freitage',5:'venerdì',6:'viernes',7:'sextas-feiras',8:'Freides'},
  'weekday6': {0:'saturdays',1:'samedis',2:'soboty',3:'zaterdagen',4:'Samstage',5:'sabati',6:'sábados',7:'sábados',8:'Samschdes'},
  'weekday7': {0:'sundays',1:'dimanches',2:'niedziele',3:'zondagen',4:'Sonntage',5:'domeniche',6:'domingos',7:'domingos',8:'Sonndes'}
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
	1 : { 0:'Dear', 1:'Cher', 2:'Szanowny', 3:'Beste', 4:'Geehrter', 5:'Caro', 6:'Querido', 7:'Caro', 8:'Léiwen'}, // male
	2 : { 0:'', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:'' }, // sa
	3 : { 0:'', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:'' }, // sprl
	5 : { 0:'Dear', 1:'Chère', 2:'Szanowny', 3:'Beste', 4:'Geehrte', 5:'Cara', 6:'Querida', 7:'Cara', 8:'Léif'}, // miss
	4 : { 0:'Dear', 1:'Cher', 2:'Szanowny', 3:'Beste', 4:'Geehrter', 5:'Caro', 6:'Querido', 7:'Caro', 8:'Léiwen'}, // boy
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
		8: 'Léi(f)wen',   // Luxembourgish (reste épicène et neutre)
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


C_XL.d['copypaste-mode'] = { 
	0:'copy-paste mode is active',        // English  
	1:'mode copy-paste actif',            // French  
	2:'Moduł kopiuj-wklej jest aktywny',  // Polish  
	3:'kopieer-en-plakmodus is actief',   // Dutch  
	4:'Kopier-und-Einfüge-Modus ist aktiv', // German  
	5:'la modalità copia-incolla è attiva', // Italian  
	6:'el modo copiar y pegar está activo', // Spanish  
	7:'o modo copiar e colar está ativo',   // Portuguese  
	8:'Kopie-paste-Modus ass aktiv'         // Luxembourgish  
};

C_XL.d['copypaste-bp-current'] = { 
	0:'Each click will create a new copy of the original reservation.<br/>To exit this mode, press the Esc key', // English
	1:'Chaque clic sur le planning crée une nouvelle copie de la réservation originale.<br/>Pour sortir de ce mode, utilisez la touche Échap', // French
	2:'Każde kliknięcie utworzy nową kopię oryginalnej rezerwacji.<br/>Aby wyjść z tego trybu, naciśnij klawisz Esc', // Polish
	3:'Elke klik maakt een nieuwe kopie van de oorspronkelijke reservering.<br/>Druk op de Esc-toets om deze modus te verlaten', // Dutch
	4:'Jeder Klick erstellt eine neue Kopie der ursprünglichen Reservierung.<br/>Drücken Sie die Esc-Taste, um diesen Modus zu verlassen', // German
	5:'Ogni clic creerà una nuova copia della prenotazione originale.<br/>Per uscire da questa modalità, premi il tasto Esc', // Italian
	6:'Cada clic creará una nueva copia de la reserva original.<br/>Para salir de este modo, pulsa la tecla Esc', // Spanish
	7:'Cada clique criará uma nova cópia da reserva original.<br/>Para sair deste modo, pressione a tecla Esc', // Portuguese
	8:'All Klick erstellt eng nei Kopie vun der ursprénglecher Reservatioun.<br/>Fir dëse Modus ze verloossen, dréckt op d’Esc-Tast' // Luxembourgish
};


C_XL.d['cutandpaste-mode'] = { 
	0:'cut & paste mode is active',	// english  
	1:'mode couper-coller actif',	// french  
	2:'tryb wycinania i wklejania jest aktywny',	// polish  
	3:'knip-en-plakmodus is actief',	// dutch  
	4:'Ausschneide-und-Einfügemodus ist aktiv',	// german  
	5:'la modalità taglia e incolla è attiva',	// italian  
	6:'el modo cortar y pegar está activo', 	// spanish  
	7:'o modo cortar e colar está ativo',	// portuguese  
	8:'Schneid-an-a-Kleeb-Modus ass aktiv'	// luxembourgish  
};	

C_XL.d['cutandpaste-bp-current'] = { 
	0:'A click on the planner opens a copy of the time reservation. When saved, the original reservation is cancelled.<br/>To exit this mode, press the Esc key',	// english  
	1:'Un clic sur le planning va ouvrir une copie de la réservation de temps. Lors de l\'enregistrement, la réservation originale est annulée.<br/>Pour sortir de ce mode, utilisez la touche Échap',	// french  
	2:'Kliknięcie na planie otworzy kopię rezerwacji czasu. Po zapisaniu oryginalna rezerwacja zostanie anulowana.<br/>Aby wyjść z tego trybu, naciśnij klawisz Esc',	// polish  
	3:'Een klik op de planning opent een kopie van de tijdsreservering. Bij het opslaan wordt de originele reservering geannuleerd.<br/>Druk op de Esc-toets om deze modus te verlaten',	// dutch  
	4:'Ein Klick auf den Planer öffnet eine Kopie der Zeitreservierung. Beim Speichern wird die ursprüngliche Reservierung storniert.<br/>Drücken Sie die Esc-Taste, um diesen Modus zu verlassen',	// german  
	5:'Un clic sul planner apre una copia della prenotazione temporale. Al salvataggio, la prenotazione originale viene annullata.<br/>Per uscire da questa modalità, premi il tasto Esc',	// italian  
	6:'Un clic en el planificador abre una copia de la reserva de tiempo. Al guardar, se cancela la reserva original.<br/>Para salir de este modo, pulsa la tecla Esc', 	// spanish  
	7:'Um clique no planeador abre uma cópia da reserva de tempo. Ao guardar, a reserva original é cancelada.<br/>Para sair deste modo, pressione a tecla Esc',	// portuguese  
	8:'E Klick op de Plang mécht eng Kopie vun der Zäitreservatioun op. Beim Späicheren gëtt déi originell Reservatioun annuléiert.<br/>Fir dëse Modus ze verloossen, dréckt op d’Esc-Tast'	// luxembourgish  
};





// 		technical 	english:0,		french:1,	polish:2,	dutch:3,		german:4,	italian:5,		spanish:6,		portuguese:7, 	luxembourgish:8
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

C_XL.d['sms to'] = { 0:'SMS to', 1:'SMS au', 2:'SMS na', 3:'SMS naar', 4:'SMS an', 5:'SMS al', 6:'SMS al', 7:'SMS para o', 8:'SMS un'};
C_XL.d['email to'] = { 0:'email to', 1:'email sur', 2:'email na', 3:'email naar', 4:'email an', 5:'email al', 6:'email al', 7:'email para o', 8:'E-Mail un'};

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

C_XL.d['resa finder'] = { 0:'Filter & Find', 1:'Filtrer & Trouver', 2:'Filtr i Znajdź', 3:'filteren & Zoeken', 4:'Filtern & finden', 5:'Filtrare e trovare', 6:'Filtrar y encontrar', 7:'Filtrar e Encontrar', 8:'Filteren & Fannen'};
C_XL.d['account preferences'] = { 0:'Settings & Preferences', 1:'Réglages & Préférences', 2:'Ustawienia i Ustawienia', 3:'instellingen & Voorkeuren', 4:'Einstellungen & Präferenzen ', 5:'Impostazioni e Preferenze', 6:'Configuraciones y Preferencias', 7:'Configurações e Preferências', 8:'Astellungen & Präferenzen'};
C_XL.d['sms dashboard'] = { 0:'SMS dashboard', 1:'Trafique SMS', 2:'SMS traffics', 3:'SMS trafiek', 4:'SMS Verkehr', 5:'Traffico sms', 6:'Tráfico sms', 7:'Tráfego de SMS', 8:'SMS Cockpit'};
C_XL.d['cnx monitoring'] = { 0:'Connections monitoring', 1:'Monitoring des connexions', 2:'Monitoring połączeń', 3:'aanmeldingscontrole', 4:'Verbdinungsüberwachung', 5:'Monitoraggio connessioni', 6:'Monitoring conexiones ', 7:'Monitorização de ligações', 8:'Verbindungséiwwerwaachung'};
C_XL.d['elearning'] = { 0:'Online tutorial', 1:'Tutoriel en ligne', 2:'Samouczek online', 3:'online tutorial', 4:'Online Tutorial', 5:'Tutorial online', 6:'Tutorial online', 7:'Tutorial on-line', 8:'Online Cours'};

C_XL.d['account archives'] = { 0:'archives', 1:'archives', 2:'archiwum', 3:'archief', 4:'archiv', 5:'archivi', 6:'archivos', 7:'Ficheiros', 8:'Archiv'};
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

C_XL.d['account settings changed'] = { 0:'account settings were changed', // english
                                        1:'les réglages de votre agenda ont changés', // french
                                        2:'ustawienia konta zostały zmienione', // polish
                                        3:'accountinstellingen zijn gewijzigd', // dutch
                                        4:'Kontoeinstellungen wurden geändert', // german
                                        5:'le impostazioni dell\'account sono state modificate', // italian
                                        6:'la configuración de la cuenta fue cambiada', // spanish
                                        7:'as configurações da conta foram alteradas', // portuguese
                                        8:'Kontoeinstellungen goufen geännert'}; // luxembourgish

C_XL.d['sw update title'] = { 0:'application update', // 0.english
                               1:'mise à jour de l\'application', // 1.french
                               2:'aktualizacja oprogramowania', // 2.polish
                               3:'software-update', // 3.dutch
                               4:'Software-Aktualisierung', // 4.german
                               5:'aggiornamento del software', // 5.italian
                               6:'actualización de software', // 6.spanish
                               7:'atualização de software', // 7.portuguese
                               8:'Applikatiounsaktualiséierung'}; // 8.luxembourgish

// This message is intended for the smartphone / tablets apps, because the web app re-loads automatically when updated on server

C_XL.d['please update'] = { 0:'a new version of Mobminder is available, please follow the link below to update your application', // english
                            1:'une nouvelle version de Mobminder est disponible, SVP suivez le lien suivant pour mettre à jour votre application', // french
                            2:'dostępna jest nowa wersja Mobmindera, skorzystaj z poniższego łącza, aby zaktualizować swoją aplikację', // polish
                            3:'er is een nieuwe versie van Mobminder beschikbaar, volg de onderstaande link om uw applicatie bij te werken', // dutch
                            4:'Eine neue Version von Mobminder ist verfügbar. Bitte folgen Sie dem Link unten, um Ihre Anwendung zu aktualisieren', // german
                            5:'è disponibile una nuova versione di Mobminder, segui il link sottostante per aggiornare la tua applicazione', // italian
                            6:'una nueva versión de Mobminder está disponible, siga el enlace a continuación para actualizar su aplicación', // spanish
                            7:'uma nova versão do Mobminder está disponível, siga o link abaixo para atualizar seu aplicativo', // portuguese
                            8:'Eng nei Versioun vu Mobminder ass verfügbar, w.e.g. verfollegt de Link hei ënnen fir Är Uwendung z\'aktualiséieren'}; // luxembourgish



	// stats
C_XL.d['account statistics'] = { 0:'Statistics', 1:'Statistiques', 2:'Statystyki', 3:'Statistieken', 4:'Statistiken', 5:'Statistiche', 6:'Estadísticas', 7:'Estatísticas', 8:'Statistiken'};
C_XL.d['stats account'] = { 0:'account', 1:'Compte', 2:'account', 3:'account', 4:'Konto', 5:'Conto', 6:'Cuenta', 7:'Conta', 8:'Kont'};
C_XL.d['stats actuals'] = { 0:'actuals', 1:'Presté', 2:'Wykonywane', 3:'Uitgevoerd', 4:'Werte', 5:'Effettivi', 6:'Reales', 7:'Desde', 8:'Effektiv'};
C_XL.d['stats actions'] = { 0:'audit', 1:'audit', 2:'audit', 3:'audit', 4:'Prüfung', 5:'audit', 6:'auditoría', 7:'auditoria', 8:'Audit'};
C_XL.d['stats smstraf'] = { 0:'SMS', 1:'SMS', 2:'SMS', 3:'SMS', 4:'SMS', 5:'SMS', 6:'SMS', 7:'SMS', 8:'SMS'};
C_XL.d['in use'] = { 0:'In use', 1:'activé', 2:'aktywowany', 3:'Geactiveerd', 4:'aktiviert', 5:'attivato', 6:'activado', 7:'ativado', 8:'am Lafen'};
C_XL.d['not in use'] = { 0:'Not used', 1:'Pas activé', 2:'Nie Aktywowane', 3:'Niet geactiveerd', 4:'Nicht aktiviert', 5:'Disattivato', 6:'Desactivado', 7:'Desativado', 8:'Net aktiv'};
C_XL.d['search'] = { 0:'Search', 1:'Rechercher', 2:'Wyszukiwanie', 3:'Zoeken', 4:'Suchen', 5:'Ricercare', 6:'Buscar', 7:'Pesquisar', 8:'Sichen'};
C_XL.d['selection'] = { 0:'Sel', 1:'Sel', 2:'Wybór', 3:'Sel', 4:'ausw', 5:'Sel', 6:'Sal', 7:'Sal', 8:'Ausw'};
C_XL.d['id'] = { 0:'Id', 1:'Id', 2:'Id', 3:'Id', 4:'ID', 5:'Id', 6:'Id', 7:'Id', 8:'Id'};
C_XL.d['note'] = { 0:'Note', 1:'Note', 2:'Notatka', 3:'Notitie', 4:'Notiz', 5:'Nota', 6:'Nota', 7:'Nota', 8:'Notiz'};
C_XL.d['info'] = { 0:'Info', 1:'Info', 2:'Info', 3:'Info', 4:'Info', 5:'Info', 6:'Info', 7:'Informações', 8:'Info'};
C_XL.d['headline'] = { 0:'Headline', 1:'Titrage', 2:'Nagłówek', 3:'Opschrift', 4:'Titel', 5:'Titolo', 6:'Título', 7:'Título', 8:'Iwwerschrëft'};
C_XL.d['note_comm'] = { 0:'sms, emails and notifications', 1:'sms, emails et notifications', 2:'wiadomości tekstowe, e-maile i powiadomienia', 3:'SMS-berichten, e-mails en meldingen', 4:'Textnachrichten, E-Mails und Benachrichtigungen', 5:'testo, e-mail e notifiche', 6:'texto, e-mails y notificaciones', 7:'texto, e-mails e notificações', 8:'SMS, E-Mails an Notifikatiounen'};
C_XL.d['note_webp'] = { 0:'indication for the web page', 1:'mention pour la page web', 2:'wskazanie strony internetowej', 3:'opmerking voor de webpagina', 4:'Angabe für die Webseite', 5:'indicazione per la pagina web', 6:'indicación de la página web', 7:'indicação para a página web', 8:'Indikatioun fir d\'Websäit'};
C_XL.d['note_secr'] = { 0:'guideline for secretary', 1:'directive pour le secrétariat', 2:'wytyczne dla sekretariatu', 3:'richtlijnen voor het secretariaat', 4:'Richtlinien für das Sekretariat', 5:'linee guida per la segreteria', 6:'directrices para la secretaría', 7:'orientações para a secretaria', 8:'Richtlinnen fir de Sekretariat'};


C_XL.d['note_comm_tip'] = {
    0:'note insertable in communications using the tag {perf_note}, to insert the name of this service use {perf}',
    1:'note insérable dans les communications au moyen du tag {perf_note}, pour insérer le nom de cette prestation utilisez {perf}',
    2:'notatka do wstawienia w komunikacji za pomocą tagu {perf_note}, aby wstawić nazwę tej usługi użyj {perf}',
    3:'kan worden ingevoegd in communicatie met behulp van de tag {perf_note}, om de naam van deze service in te voegen, gebruikt u {perf}',
    4:'note Einfügbar in die Kommunikation mit dem Tag {perf_note}, um den Namen dieses Dienstes einzufügen, verwenden Sie {perf}',
    5:'nota inseribile nelle comunicazioni utilizzando il tag {perf_note}, per inserire il nome di questo servizio utilizzare {perf}',
    6:'nota insertable en comunicaciones usando la etiqueta {perf_note}, para insertar el nombre de este servicio use {perf}',
    7:'nota inserível nas comunicações usando a tag {perf_note}, para inserir o nome deste serviço use {perf}',
    8:'Notiz, déi an d’Kommunikatiounen agedroe ka ginn, mam Tag {perf_note}, fir den Numm vun dësem Service anzesetzen, benotzt {perf}'
};

C_XL.d['note_webp_tip'] = {
    0:'indication appearing when making an appointment online, when this service is selected',
    1:'mention apparaissant lors de la prise de RDV en ligne, lorsque cette prestation est sélectionnée',
    2:'wskazanie pojawiające się podczas umawiania wizyty online, gdy wybrana jest ta usługa',
    3:'indicatie die verschijnt bij het online maken van een afspraak, wanneer deze service is geselecteerd',
    4:'Hinweis, der bei der Online-Terminvereinbarung erscheint, wenn dieser Dienst ausgewählt ist',
    5:'indicazione che compare quando si effettua un appuntamento online, quando si seleziona questo servizio',
    6:'indicación que aparece al hacer una cita en línea, cuando se selecciona este servicio',
    7:'indicação que aparece ao marcar uma consulta online, quando este serviço é selecionado',
    8:'Indikatioun déi erschéngt wann en RDV online gemaach gëtt, wann dëse Service ausgewielt gëtt'
};

C_XL.d['note_secr_tip'] = {
    0:'directive for the secretariat, appearing when selecting this service (enable pop-ups for relevant logins)',
    1:'directive pour le secrétariat, apparaissant lors de la sélection de cette pretation (activer les pop-ups pour les logins qui sont concernés)',
    2:'dyrektywa dla sekretariatu, pojawiająca się przy wyborze tej usługi (włącz wyskakujące okienka dla odpowiednich loginów)',
    3:'richtlijn voor het secretariaat, die verschijnt bij het selecteren van deze dienst (schakel pop-ups in voor relevante logins)',
    4:'Direktive für das Sekretariat, die bei der Auswahl dieses Dienstes erscheint (Popups für relevante Anmeldungen aktivieren)',
    5:'direttiva per la segreteria, che compare al momento della selezione di questo servizio (abilita i pop-up per gli accessi pertinenti)',
    6:'directiva para la secretaría, que aparece al seleccionar este servicio (habilitar ventanas emergentes para inicios de sesión relevantes)',
    7:'diretriz para a secretaria, aparecendo ao selecionar este serviço (ativar pop-ups para logins relevantes)',
    8:'Direktive fir de Sekretariat, déi erschéngt wann dëse Service ausgewielt gëtt (aktivéiert Pop-ups fir déi relevant Logins)'
};						
						

C_XL.d['prdct_note_comm_tip'] = {
    0: 'note insertable in communications using the tag {prdct_note}, to insert the name of this product use {prdct}', // english
    1: 'note insérable dans les communications au moyen du tag {prdct_note}, pour insérer le nom de ce produit utilisez {prdct}', // french
    2: 'notatka do wstawienia w komunikacji za pomocą tagu {prdct_note}, aby wstawić nazwę tego produktu użyj {prdct}', // polish
    3: 'kan worden ingevoegd in communicatie met behulp van de tag {prdct_note}, om de naam van dit product in te voegen, gebruikt u {prdct}', // dutch
    4: 'note Einfügbar in die Kommunikation mit dem Tag {prdct_note}, um den Namen dieses Produkts einzufügen, verwenden Sie {prdct}', // german
    5: 'nota inseribile nelle comunicazioni utilizzando il tag {prdct_note}, per inserire il nome di questo prodotto utilizzare {prdct}', // italian
    6: 'nota insertable en comunicaciones usando la etiqueta {prdct_note}, para insertar el nombre de este producto use {prdct}', // spanish
    7: 'nota inserível nas comunicações usando a tag {prdct_note}, para inserir o nome deste produto use {prdct}', // portuguese
    8: 'Notiz, déi an d’Kommunikatiounen agedroe ka ginn, mam Tag {prdct_note}, fir den Numm vun dësem Produkt unzesetzen, benotzt {prdct}' // luxembourgish
};

C_XL.d['prdct_note_webp_tip'] = {
    0: 'indication appearing when making an appointment online, when this product is selected', // english
    1: 'mention apparaissant lors de la prise de RDV en ligne, lorsque ce produit est sélectionné', // french
    2: 'wskazanie pojawiające się podczas umawiania wizyty online, gdy wybrany jest ten produkt', // polish
    3: 'indicatie die verschijnt bij het online maken van een afspraak, wanneer dit product is geselecteerd', // dutch
    4: 'Hinweis, der bei der Online-Terminvereinbarung erscheint, wenn dieses Produkt ausgewählt ist', // german
    5: 'indicazione che compare quando si effettua un appuntamento online, quando si seleziona questo prodotto', // italian
    6: 'indicación que aparece al hacer una cita en línea, cuando se selecciona este producto', // spanish
    7: 'indicação que aparece ao marcar uma consulta online, quando este produto é selecionado', // portuguese
    8: 'Indikatioun déi erschéngt wann en RDV online gemaach gëtt, wann dëst Produkt ausgewielt gëtt' // luxembourgish
};

C_XL.d['prdct_note_secr_tip'] = {
    0: 'directive for the secretariat, appearing when selecting this product (enable pop-ups for relevant logins)', // english
    1: 'directive pour le secrétariat, apparaissant lors de la sélection de ce produit (activer les pop-ups pour les logins qui sont concernés)', // french
    2: 'dyrektywa dla sekretariatu, pojawiająca się przy wyborze tego produktu (włącz wyskakujące okienka dla odpowiednich loginów)', // polish
    3: 'richtlijn voor het secretariaat, die verschijnt bij het selecteren van dit product (schakel pop-ups in voor relevante logins)', // dutch
    4: 'Direktive für das Sekretariat, die bei der Auswahl dieses Produkts erscheint (Popups für relevante Anmeldungen aktivieren)', // german
    5: 'direttiva per la segreteria, che compare al momento della selezione di questo prodotto (abilita i pop-up per gli accessi pertinenti)', // italian
    6: 'directiva para la secretaría, que aparece al seleccionar este producto (habilitar ventanas emergentes para inicios de sesión relevantes)', // spanish
    7: 'diretriz para a secretaria, aparecendo ao selecionar este produto (ativar pop-ups para logins relevantes)', // portuguese
    8: 'Direktive fir de Sekretariat, déi erschéngt wann dëst Produkt ausgewielt gëtt (aktivéiert Pop-ups fir déi relevant Logins)' // luxembourgish
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

						
C_XL.d['notes'] = { 0:'Notes', 1:'Notes', 2:'Notatki', 3:'Nota\'s', 4:'Notizen', 5:'Note', 6:'Notas', 7:'Notas', 8:'Notizen' };
C_XL.d['new note'] = { 0:'New note', 1:'Nouvelle note', 2:'Nowa notatka', 3:'Nieuwe notitie', 4:'Neue Notiz', 5:'Nuova nota', 6:'Nota nueva', 7:'Nova nota', 8:'Nei Notiz' };
C_XL.d['no note'] = { 0:'No note', 1:'Pas de note', 2:'Brak notatka', 3:'Geen notitie', 4:'Keine Notiz', 5:'Nessuna nota', 6:'Ninguna nota', 7:'Sem nota', 8:'Keng Notiz' };
C_XL.d['addressees'] = { 0:'addressees', 1:'Destinataires', 2:'adresaci', 3:'Geadresseerden', 4:'Empfänger', 5:'Destinatario', 6:'Destinatario', 7:'Destinatários', 8:'Adressaten' };

C_XL.d['task'] = { 0:'Task', 1:'Tâche', 2:'Zadanie', 3:'Taak', 4:'aufgabe', 5:'attività', 6:'Tarea', 7:'Tarefa', 8:'Aufgab' };
C_XL.d['tasks'] = { 0:'Tasks', 1:'Tâches', 2:'Zadania', 3:'Taken', 4:'aufgaben', 5:'attività', 6:'Tareas', 7:'Tarefas', 8:'Aufgaben' };
C_XL.d['new task'] = { 0:'New task', 1:'Nouvelle tâche', 2:'Nowa zadanie', 3:'Nieuwe taak', 4:'Neue Aufgabe', 5:'Nuova attività', 6:'Tarea nueva', 7:'Nova tarefa', 8:'Nei Aufgab' };
C_XL.d['no task'] = { 0:'No task', 1:'Pas de tâche', 2:'Brak zadanie', 3:'Geen taak', 4:'Keine Aufgaben', 5:'Nessuna attività', 6:'Ninguna tarea', 7:'Sem tarefa', 8:'Keng Aufgab' };

C_XL.d['alt mandatory'] = { 0:'Type a title or select a reference', 1:'Indiquez un titre ou choisir une référence', 2:'Wpisz tytuł lub wybierz odniesienie', 3:'Typ een titel of selecteer een referentie', 4:'Titel eingeben oder Referenz auswählen', 5:'Indichi un titolo o scelga una referenza', 6:'Indique un título o escoja una referencia', 7:'Insira um título ou escolha uma referência', 8:'Tippt en Titel oder wielt eng Referenz' };



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
		
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

// 		technical 				english:0,					french:1,					polish:2,				dutch:3,					german:4,							italian:5,					spanish:6,				portuguese:7, 	luxembourgish:8
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


// 		technical 				english:0,				french:1,					polish:2,			dutch:3,					german:4,					italian:5,					spanish:6,					portuguese:7, 	luxembourgish:8
C_XL.d['chat'] = { 0:'Chat session', 1:'Conversation', 2:'Rozmowa', 3:'Chatsessie', 4:'Unterhaltung', 5:'Conversazione', 6:'Conversación', 7:'Conversa', 8:'Chatsëtzung' };
C_XL.d['chats'] = { 0:'chat sessions', 1:'conversations', 2:'rozmowy', 3:'chatsessies', 4:'unterhaltungen', 5:'conversazioni', 6:'conversaciones', 7:'conversas', 8:'Chats' };
C_XL.d['new chat'] = { 0:'New chat', 1:'Nouvelle conversation', 2:'Nowa rozmowa', 3:'Nieuwe chatsessie', 4:'Neue Unterhaltung', 5:'Nuova conversazione', 6:'Nueva conversación', 7:'Nova conversa', 8:'Nei Chatsëtzung' };
C_XL.d['no chat'] = { 0:'No chat', 1:'Pas de conversation', 2:'Brak rozmowa', 3:'Geen chatsessie', 4:'Keine Unterhaltungen', 5:'Nessuna conversazione', 6:'Ninguna conversación', 7:'Sem conversa', 8:'Keng Chats' };
C_XL.d['conversation'] = { 0:'Conversation', 1:'Conversation', 2:'Rozmowa', 3:'Gesprek', 4:'Unterhaltung', 5:'Conversazione', 6:'Conversación', 7:'Conversa', 8:'Gespréich' };
C_XL.d['participants'] = { 0:'Participants', 1:'Participants', 2:'uczestnik', 3:'Deelnemers', 4:'Teilnehmer', 5:'Partecipanti', 6:'Participantes', 7:'Participantes', 8:'Participanten' };
C_XL.d['description'] = { 0:'Description', 1:'Description', 2:'Opis', 3:'Beschrijving', 4:'Beschreibung', 5:'Descrizione', 6:'Descripción', 7:'Descrição', 8:'Beschreiwung' };
C_XL.d['summary'] = { 0:'Summary', 1:'Résumé', 2:'Podsumowanie', 3:'Samenvatting', 4:'Übersicht', 5:'Riassunto', 6:'Resumen', 7:'Resumo', 8:'Zesummefaassung' };

C_XL.d['start chat'] = { 0:'Start chatting here', 1:'Démarrez ici', 2:'Zacznij tutaj czacie', 3:'Start hier met chatten', 4:'Hier starten', 5:'Inizi qui', 6:'Comience aquí ', 7:'Comece aqui', 8:'Start hei mam Chatten' };
C_XL.d['answer here'] = { 0:'answer here', 1:'Répondre ici', 2:'Odpowiedź tutaj', 3:'Hier aantwoorden', 4:'Hier antworten', 5:'Rispondere qui', 6:'Contestar aquí', 7:'Responda aqui', 8:'Äntwert hei' };
C_XL.d['answer send'] = { 0:'Post', 1:'Poster', 2:'Obwieścić', 3:'Uitzetten', 4:'Senden', 5:'Pubblicare', 6:'Publicar', 7:'Publicar', 8:'Posten' };
C_XL.d['4all assignees'] = { 0:'For all assignees', 1:'Pour tous les affectés', 2:'Wszystkie przypisane', 3:'Voor alle toegewezen', 4:'an alle Betroffene', 5:'Per tutti gli utenti', 6:'Para todos los usuarios', 7:'Para todos os afetados', 8:'Fir all zougewisen' };

C_XL.d['assignees'] = { 0:'assignees', 1:'affectés', 2:'Przydzielony', 3:'Toegewezen', 4:'Betroffene', 5:'Utenti', 6:'Usuarios', 7:'afetados', 8:'Zougewisen' };
C_XL.d['assignee'] = { 0:'assignee', 1:'affecté', 2:'asygnowany', 3:'Toegewezen', 4:'Betroffen', 5:'Utente', 6:'Usuario', 7:'afetado', 8:'Zougewisene' };
C_XL.d['progress'] = { 0:'Progress', 1:'Progression', 2:'Progressie', 3:'Progressie', 4:'Fortschritt', 5:'Progresso', 6:'Progresión', 7:'Progresso', 8:'Fortschrëtt' };
C_XL.d['not started'] = { 0:'Not started', 1:'Pas démarrée', 2:'Nie rozpoczęty', 3:'Niet gestart', 4:'Nicht gestartet', 5:'Non iniziato', 6:'No empezado', 7:'Não iniciado', 8:'Net ugefaang' };
C_XL.d['in progress'] = { 0:'In progress', 1:'En cours', 2:'W toku', 3:'aan de gang', 4:'In Arbeit', 5:'In corso', 6:'En curso', 7:'Em curso', 8:'Am Lafen' };
C_XL.d['archived on'] = { 0:'archived on', 1:'archivée le', 2:'archiwizowane w', 3:'Gearchiveerd op', 4:'archiviert am', 5:'archiviato il', 6:'Guardado el', 7:'Guardado a', 8:'Archivéiert den' };
C_XL.d['archive'] = { 0:'archive this task', 1:'archiver la tâche', 2:'archiwum zadanie', 3:'Taak archiveren', 4:'aufgabe archivieren', 5:'archiviare questa attività', 6:'Guardar esta actividad', 7:'Guardar a tarefa', 8:'Dës Aufgab archivéieren' };
C_XL.d['to archive'] = { 0:'archive', 1:'archiver', 2:'archiwum', 3:'archiveren', 4:'archivieren', 5:'archiviare', 6:'Guardar', 7:'Guardar', 8:'Archivéieren' };
C_XL.d['archived'] = { 0:'archived', 1:'archivée', 2:'archiwizowane', 3:'Gearchiveerd', 4:'archiviert', 5:'archiviato', 6:'Guardado', 7:'Guardado', 8:'Archivéiert' };
C_XL.d['finished'] = { 0:'Finished', 1:'Terminée', 2:'Gotowy', 3:'afgewerkt', 4:'Fertig', 5:'Terminato', 6:'acabado', 7:'Terminado', 8:'Fäerdeg' };
C_XL.d['verified'] = { 0:'Verified', 1:'Vérifiée', 2:'Zweryfikowana', 3:'Verified', 4:'Überprüft', 5:'Verificato', 6:'Comprobado', 7:'Verificado', 8:'Iwwerpréift' };
C_XL.d['task schedule'] = { 0:'Scheduling', 1:'Entre en vigueur le', 2:'Wchodzi w życie', 3:'treedt in werking op', 4:'Tritt in Kraft am', 5:'Entra in vigore il', 6:'Entra en vigor el', 7:'Entra em vigor a', 8:'Trëtt a Kraaft de' };

C_XL.d['tskass-loginId'] = { 0:'assignees', 1:'affectés', 2:'Przydzielony', 3:'Toegewezen', 4:'Betroffene', 5:'Utenti', 6:'Cesionarios', 7:'afetados', 8:'Zougewisen' };
C_XL.d['tskass-cssPattern'] = { 0:'Status', 1:'Statut', 2:'Stan', 3:'Staat', 4:'Status', 5:'Status', 6:'Estado', 7:'Estado', 8:'Status' };
C_XL.d['tskass-midnOut'] = { 0:'archived on', 1:'archivée le', 2:'archiwizowane w', 3:'Gearchiveerd op', 4:'archiviert am', 5:'archiviato il', 6:'Guardado el', 7:'Guardado a', 8:'Archivéiert den' };

C_XL.d['tskass-abr-loginId'] 	= C_XL.d['tskass-loginId'];
C_XL.d['tskass-abr-cssPattern']	= C_XL.d['tskass-cssPattern'];
C_XL.d['tskass-abr-midnOut'] 	= C_XL.d['tskass-midnOut'];

C_XL.d['tskass-csv-loginId'] 	= C_XL.d['tskass-loginId'];
C_XL.d['tskass-csv-cssPattern']	= C_XL.d['tskass-cssPattern'];
C_XL.d['tskass-csv-midnOut'] 	= C_XL.d['tskass-midnOut'];

C_XL.d['tskass-tip-loginId'] 	= C_XL.d['tskass-loginId'];
C_XL.d['tskass-tip-cssPattern']	= C_XL.d['tskass-cssPattern'];
C_XL.d['tskass-tip-midnOut'] 	= C_XL.d['tskass-midnOut'];



								
C_XL.d['see archives'] = { 0:'see archives', // english
    1:'voir les archives', // french
    2:'zobacz archiwa', // polish
    3:'archieven zien', // dutch
    4:'siehe die Archive', // german
    5:'vedere gli archivi', // italian
    6:'ver los archivos', // spanish
    7:'veja os arquivos',
	8:'kuckt d\'Archive' };

C_XL.d['chat unsent msg on launch pad'] = { 0:'you wrote a message that you did not send', // english
    1:'vous avez écrit un message que vous n\'avez pas envoyé', // french
    2:'napisałeś wiadomość, której nie wysłałeś', // polish
    3:'u hebt een bericht geschreven dat u niet hebt verzonden', // dutch
    4:'Sie haben eine Nachricht geschrieben, die Sie nicht gesendet haben', // german
    5:'hai scritto un messaggio che non hai inviato', // italian
    6:'escribiste un mensaje que no enviaste', // spanish
    7:'você escreveu uma mensagem que não enviou',
	8:'dir hutt e Message geschriwwen, deen dir net geschéckt hutt' };

C_XL.d['quit anyway'] = { 0:'close anyway', // english
    1:'fermer quand même', // french
    2:'zrezygnuj mimo wszystko', // polish
    3:'toch sluiten', // dutch
    4:'sowieso schließen', // german
    5:'chiudere comunque', // italian
    6:'cerrar de todos modos', // spanish
    7:'feche de qualquer maneira',
	8:'maach zou egal wéi' };

C_XL.d['chat stay'] = { 0:'do not quit', // english
    1:'ne pas quitter', // french
    2:'nie odchodź', // polish
    3:'blijven', // dutch
    4:'kündige nicht', // german
    5:'non uscire', // italian
    6:'no renuncies', // spanish
    7:'não saia',
	8:'bleiwt' };

C_XL.d['archived chats'] = { 0:'archived chats', // english
    1:'conversations archivées', // french
    2:'zarchiwizowane czaty', // polish
    3:'gearchiveerde chats', // dutch
    4:'archivierte Chats', // german
    5:'chat archiviate', // italian
    6:'chats archivados', // spanish
    7:'chats arquivados',
	8:'archivéiert Chats' };

C_XL.d['archived chat'] = { 0:'archived chat', // english
    1:'conversation archivée', // french
    2:'zarchiwizowany czat', // polish
    3:'gearchiveerde chat', // dutch
    4:'archivierte Chat', // german
    5:'chat archiviata', // italian
    6:'chat archivado', // spanish
    7:'chat arquivado',
	8:'archivéiert Chat' };

C_XL.d['archived and deleted chats'] = { 0:'archived and deleted chats', // english
    1:'conversations archivées et effacées', // french
    2:'zarchiwizowane i usunięte czaty', // polish
    3:'gearchiveerde en verwijderde chats', // dutch
    4:'archivierte und gelöschte Chats', // german
    5:'chat archiviate ed eliminate', // italian
    6:'chats archivados y eliminados', // spanish
    7:'bate-papos arquivados e excluídos',
	8:'archivéiert an geläschte Chats' };

C_XL.d['deleted chat'] = { 0:'deleted chat', // english
    1:'conversation effacée', // french
    2:'usunięty czat', // polish
    3:'verwijderde chat', // dutch
    4:'Chat gelöscht', // german
    5:'chat eliminata', // italian
    6:'chat eliminado', // spanish
    7:'bate-papo excluído' ,
	8:'geläschte Chat' };
	
	
// While producing your output, please keep the textual presentation (one trad on one line)
// Keep the comment at the end of each line
// The words "visitor", and "visitors" are fusion words, they should stay intact if encountered.
// Same applies for "bCals", "uCals", "fCals" that are also fusion keywords, if present.
// Also, if some HTML insert are present ( like <b>, or <br>, or <hr> ), we leave them untouched.
// Fusion zones are identified by $keyword$, like $cssType$ or $visiname$, they stay right where they should :)

C_XL.d['CtrlClic to copy'] = { 
  0: 'Ctrl + Click to copy',            // english
  1: 'Ctrl + clic pour copier',         // french
  2: 'Ctrl + kliknij, aby skopiować',   // polish
  3: 'Ctrl + klik om te kopiëren',      // dutch
  4: 'Strg + Klick zum Kopieren',       // german
  5: 'Ctrl + clic per copiare',         // italian
  6: 'Ctrl + clic para copiar',         // spanish
  7: 'Ctrl + clique para copiar',       // portuguese
  8: 'Ctrl + klick fir ze kopéieren'    // luxembourgish
};

	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//	M_VISI
C_XL.d['dupli resolution'] = { 
    0:'visitors identified here are duplicates. They will be eliminated during the recording of this sheet. The history of appointments will be attached to this sheet.',
    1:'Les visitors identifiés ici sont des doublons. Ils seront éliminés lors de l\'enregistrement de cette fiche. Les historiques de rendez-vous seront rattachés à la présente fiche.',
    2:'visitors zidentyfikowane tutaj są duplikatami. Zostaną one usunięte podczas nagrywania tej płyty.Historyczne spotkanie będzie dołączony do tego arkusza.',
    3:'visitors hier geïdentificeerd zijn duplicaten. Zij worden geëlimineerd tijdens de opname van dit blad. De geschiedenis van de benoemingen zal worden gehecht aan dit blad.',
    4:'Die hier identifizierten visitors sind Duplikate. Sie werden beim Speichern dieser Datei gelöscht. Der bisherige Terminverlauf wird dieser Datei beigefügt.',
    5:'I visitors identificati qui sono doppioni. Saranno eliminati al salvataggio di questa scheda. Gli appuntamenti passati saranno legati a questa scheda.',
    6:'Los visitors identificados aquí están duplicados. Serán eliminados durante la grabación de esta ficha. El historial de citas será vinculado a la ficha actual.',
    7:'Os visitors identificados aqui são duplicados. Eles serão eliminados durante o armazenamento desta ficha. Is historiais de encontros serão anexados a esta ficha.',
    8:'D\'visitors, déi hei identifizéiert goufen, si Duplikater. Si ginn beim Späichere vun dësem Blat eliminéiert. D\'Geschicht vun den Rendez-vous gëtt un dëst Blat ugeschloss.'
};

C_XL.d['checkout confirm'] = { 0:'You have modified some information on this form, please confirm that you wish to exit without saving the changes.', // english
    1:'Vous avez modifié des informations sur cette fiche, SVP confirmez que vous souhaitez sortir et ignorer ces changements.', // french
    2:'Zmieniłeś informacje w tym formularzu. Potwierdź, że chcesz wyjść bez zapisywania zmian.', // polish
    3:'U heeft sommige gegevens op dit formulier gewijzigd. Bevestig alstublieft dat u wilt afsluiten zonder de wijzigingen op te slaan.', // dutch
    4:'Sie haben einige Informationen in diesem Formular geändert. Bitte bestätigen Sie, dass Sie das Formular verlassen möchten, ohne die Änderungen zu speichern.', // german
    5:'Hai modificato alcune informazioni su questo modulo, conferma che desideri uscire senza salvare le modifiche.', // italian
    6:'Ha modificado alguna información en este formulario, confirme que desea salir sin guardar los cambios.', // spanish
    7:'Você modificou algumas informações neste formulário, por favor confirme que deseja sair sem salvar as alterações.',
	8:'Dir hutt Informatiounen an dësem Formular geännert. Bestätegt w.e.g., datt Dir erausgoe wëllt ouni d\'Ännerungen ze späicheren.' // Luxembourgish
};


C_XL.d['visimodal more file']	= { 0:'add one document',	// english
		1:'ajouter un document',	// french
		2:'dodaj jeden dokument',	// polish
		3:'een document toevoegen',	// dutch
		4:'ein Dokument hinzufügen',	// german
		5:'aggiungi un documento',	// italian
		6:'añadir un documento', 	// spanish
		7:'adicionar um documento',	// portuguese
		8:'füügt en Dokument derbäi'	// luxembourgish
};

// Preference dashboard
C_XL.d['playidletip'] = { 0:'Start searching the agenda',
    1:'Démarrer une recherche dans l\'agenda',
    2:'Rozpocznij wyszukiwanie porządku obrad',
    3:'Start het zoeken in de agenda',
    4:'Suche im Kalender starten',
    5:'Iniziare una ricerca nell\'agenda',
    6:'Empezar uma búsqueda en la agenda',
    7:'Iniciar uma pesquisa no calendário',
	8:'Fänkt un am Agenda ze sichen' };

C_XL.d['playwarning'] = { 0:'No visitor selected, search for an unavailability?',
    1:'Pas de visiteur séléctionné, recherche pour une indisponibilité?',
    2:'Nr gości wybranych, szukaj niedostępności?',
    3:'Geen bezoeker geselecteerd, zoeken naar een onbeschikbaarheid?',
    4:'Kein Besucher ausgewählt, nach Nichverfügbarkeit suchen',
    5:'Nessun visitatore selezionato, ricercare un\'indisponibilità?',
    6:'Ningún visitante seleccionado, buscar una indisponibilidad?',
    7:'Nenhum visitante selecionado, efetuar pesquisa por indisponibilidade?',
	8:'Keen Visiteur ausgewielt, no enger Onverfügbarkeet sichen?' };


								
// 		technical 				english:0,				french:1,					polish:2,			dutch:3,					german:4,					italian:5,						spanish:6,					portuguese:7, 	luxembourgish:8

C_XL.d['slotsearch'] = { 0:'Search', 1:'Rechercher', 2:'Szukaj', 3:'Zoeken', 4:'Suchen', 5:'Ricercare', 6:'Buscar', 7:'Pesquisar', 8:'Sichen' };
C_XL.d['more search'] = { 0:'Search further', 1:'Chercher plus loin', 2:'Szukaj więcej', 3:'Verder zoeken', 4:'Mehr suchen', 5:'approfondire la ricerca', 6:'Buscar más adelante', 7:'Procurar mais atrás', 8:'Méi sichen' };
C_XL.d['standby list'] = { 0:'Waiting list', 1:'liste d\'attente', 2:'Pilnych', 3:'Wachtlijst', 4:'Warteliste', 5:'Lista d\'attesa', 6:'Lista de espera', 7:'Em espera', 8:'Waardelëscht' };
C_XL.d['on standby list'] = { 0:'on waiting list', 1:'sur liste d\'attente', 2:'na liście gotowości', 3:'op de wachtlijst', 4:'in der Waiting-Liste', 5:'in lista di attesa', 6:'en lista de espera', 7:'na lista de espera', 8:'Op der Waardelëscht' };
C_XL.d['continued'] = { 0:'Continued', 1:'Suite', 2:'Nieprzerwany', 3:'Vervolgd', 4:'Fortgesetzt', 5:'Seguito', 6:'Continuación', 7:'Seguinte', 8:'Weidergefouert' };
C_XL.d['excp'] = { 0:'Exceptional', 1:'Exceptionnel', 2:'Wyjątkowy', 3:'Uitzonderlijk', 4:'außergewöhnlich', 5:'Eccezionale', 6:'Excepcional', 7:'Excecional', 8:'Aussergewéinlech' };
C_XL.d['overdays'] = { 0:'Over days', 1:'Fil des jours', 2:'Przez dni', 3:'Meer dan dagen', 4:'Über mehrere Tage', 5:'Svolgimento giorni', 6:'Día a día', 7:'Decurso do dia', 8:'Iwwer verschidde Deeg' };
C_XL.d['aggregate'] = { 0:'collate', 1:'grouper', 2:'grupowe', 3:'groeperen', 4:'gruppieren', 5:'raggruppare', 6:'agrupar', 7:'reagrupar', 8:'zusummesetzen' };
C_XL.d['more options'] = { 0:'more options', 1:'plus d\'options', 2:'więcej opcji', 3:'meer opties', 4:'Mehr Optionen', 5:'più opzioni', 6:'mas opcione', 7:'mais opções', 8:'Méi Optiounen' };


C_XL.d['search excp'] = {
    0:'Include exceptional workhours',
    1:'Inclure les plages de travail exceptionnelles',
    2:'Wyjątkowa pracy zawarte',
    3:'Uitzonderlijke werktijden inbegrepen',
    4:'Einschließlich außergewöhnlicher Arbeitsstunden',
    5:'Includere i turni di lavoro eccezionali',
    6:'Incluir los turnos de trabajo excepcionales',
    7:'Incluem os turnos de trabalho excecionais',
    8:'Aussergewéinlech Aarbechtsstonnen abegraff'
};

C_XL.d['search overdays'] = {
    0:'worktime can span over days',
    1:'la prestation peut s\'étendre sur plusieurs jours',
    2:'czas pracy może rozciągać się na dniach',
    3:'werktijd kan meerdere dagen overspannen',
    4:'die Leistung kann über mehrere Tage erbracht werden',
    5:'la prestazione può svolgersi su vari giorni',
    6:'la prestación se puede desarrollar durante varios días',
    7:'a prestação pode estender-se ao longo de vários dias',
    8:'D\'Aarbechtszäit ka sech iwwer Deeg erausstrecken'
};

C_XL.d['use standby list'] = { 0:'Use the waiting list', 1:'Utiliser la liste d\'attente', 2:'Lista pogotowia', 3:'Wachtlijst gebruiken', 4:'Warteliste nutzen', 5:'Usare la lista d\'attesa', 6:'Utilizar la lista de espera', 7:'Usar a lista de espera', 8:'D\'Waardelëscht benotzen' };
C_XL.d['account usenotes'] = { 0:'Make use of day notes', 1:'Faire usage de notes du jour', 2:'Wykorzystać dzień notatek', 3:'Maak gebruik van de dag notities', 4:'Tagesnotizen nutzen', 5:'Usare le note del giorno', 6:'Utilizar las notas del día', 7:'Fazer uso das notas do dia', 8:'Dagesnotizen notzen' };
C_XL.d['account usetasks'] = { 0:'Make use of a task list', 1:'Utiliser une liste de tâches', 2:'Skorzystaj z listy zadań', 3:'Maak gebruik van een takenlijst', 4:'aufgabenliste nutzen', 5:'Usare una lista di attività', 6:'Utilizar una lista de tareas', 7:'Usar uma lista de tarefas', 8:'Eng Aufgabelëscht notzen' };
C_XL.d['account usefiles'] = { 0:'Use visitors files', 1:'Utiliser le dossier visiteurs', 2:'Goście korzystać z plików', 3:'Bezoekers bestand gebruiken', 4:'Besucherdateien nutzen', 5:'Usare il file visitatore', 6:'Utilizar el archivo visitantes', 7:'Usar o registo de visitantes', 8:'D\'Visiteursdateien notzen' };
C_XL.d['account usechat'] = { 0:'Use instant messaging', 1:'Utiliser la messagerie', 2:'Skorzystaj z czatu', 3:'Instant messaging gebruiken', 4:'Kurzmitteilungen nutzen', 5:'Usare la funzione messaggi', 6:'Utilizar la mensajería', 7:'Usar o serviço de mensagens', 8:'Instant Messaging notzen' };
C_XL.d['properties'] = { 0:'Properties', 1:'Propriétés', 2:'Ustawienia', 3:'Eigenaardigheden', 4:'Eigenschaften', 5:'Proprietà', 6:'Propriedades', 7:'Propriedades', 8:'Eegeschaften' };

C_XL.d['log me in'] = { 0:'log me in', 1:'me connecter', 2:'zalogować się', 3:'inloggen', 4:'einloggen ', 5:'accedere', 6:'conectarse', 7:'entrar', 8:'aloggen' };
C_XL.d['sessions'] = { 0:'Sessions', 1:'Sessions', 2:'Sesje', 3:'Sessies', 4:'Sitzung', 5:'Sessioni', 6:'Sesión', 7:'Sessões', 8:'Sessiounen' };
C_XL.d['guests'] = { 0:'Guests', 1:'Invités', 2:'Gości', 3:'Gasten', 4:'Besucher', 5:'Ospiti', 6:'Invitados', 7:'Convidados', 8:'Gäscht' };
C_XL.d['logged in'] = { 0:'Logged in', 1:'Connecté', 2:'Zalogowany', 3:'Ingelogd', 4:'Eingeloggt', 5:'Connesso', 6:'Conectado', 7:'Ligado', 8:'Ageloggt' };
C_XL.d['logout current'] = { 0:'Close this session', 1:'Fermer cette session', 2:'Zamknij sesję', 3:'Sluit deze sessie', 4:'Diese Sitzung schließen', 5:'Chiudere questa sessione', 6:'Cerrar esta sesión', 7:'Encerrar esta sessão', 8:'Dës Sessioun zoumaachen' };
C_XL.d['logout all'] = { 0:'Close all sessions', 1:'Fermer toutes les sessions', 2:'Zamknij wszystkie sesje', 3:'Sluit alle sessies', 4:'alle Sitzungen schließen', 5:'Chiudere tutte le sessioni', 6:'Cerrar todas las sesiones', 7:'Fechar todas as sessões', 8:'All Sessiounen zoumaachen' };
C_XL.d['more login'] = { 0:'Open an additional session', 1:'Ouvrir une session supplémentaire', 2:'Otwórz dodatkową sesję', 3:'Open een extra sessie', 4:'Eine weitere Sitzung öffnen', 5:'aprire un\'ulteriore sessione', 6:'abrir una sesión adicional', 7:'abrir uma sessão adicional', 8:'Eng zousätzlech Sessioun opmaachen' };
C_XL.d['new account'] = { 0:'New account', 1:'Nouveau compte', 2:'Nowe konto', 3:'Nieuw account', 4:'Neues Konto', 5:'Nuovo conto', 6:'Nueva cuenta', 7:'Nova conta', 8:'Neie Kont' };
C_XL.d['options'] = { 0:'Options', 1:'Options', 2:'Opcje', 3:'Opties', 4:'Optionen', 5:'Opzioni', 6:'Opciones', 7:'Opções', 8:'Optiounen' };
C_XL.d['other options'] = { 0:'Other options:', 1:'autres options:', 2:'Inne opcje:', 3:'andere opties:', 4:'Weitere Optionen', 5:'altre opzioni', 6:'Otras opciones', 7:'Outras opções:', 8:'Aner Optiounen:' };
C_XL.d['access level'] = { 0:'access level', 1:'Niveau d\'accès', 2:'Poziom dostępu', 3:'Toegang niveau', 4:'Zugriffsstufe', 5:'Livello d\'accesso', 6:'Nivel de acceso', 7:'nível de acesso', 8:'Zougrëffsniveau' };

C_XL.d['sync cronofy'] = { 0:'Links with Google, Apple or Microsoft', 1:'Liens avec Google, Apple ou Outlook', 2:'Połącz z Google, Apple lub Microsoft', 3:'Linken met Google, Apple or Microsoft', 4:'Linken mit Google, Apple oder Microsoft', 5:'Collegamento con Google, Apple o Microsoft', 6:'Enlaces con Google, Apple o Microsoft', 7:'Link com Google, Apple ou Microsoft', 8:'Link mam Google, Apple oder Microsoft' };
C_XL.d['switch to session'] = { 0:'Switch to another session:', 1:'Passer sur une autre session:', 2:'Przełącz się do innej sesji:', 3:'Overschakelen naar een andere sessie:', 4:'Zu einer anderen Sitzung wechseln', 5:'Passare ad un\’altra sessione', 6:'Pasar a otra sesión', 7:'Mudar para outra sessão:', 8:'Op eng aner Sessioun wiesselen:' };
C_XL.d['switch to account'] = { 0:'Switch to another account:', 1:'Passer sur une autre compte:', 2:'Przełącz się do innego konta:', 3:'Overschakelen naar een andere account:', 4:'Zu einem anderen Konto wechseln', 5:'Passare su un altro conto', 6:'Pasar a otra cuenta', 7:'Mudar para uma conta diferente:', 8:'Op en anere Kont wiesselen:' };

C_XL.d['disable tips'] = { 0:'Disable info-tips', 1:'Désactiver les info-tips', 2:'Wyłącz żółte wskazówki', 3:'Schakel info-tips uit', 4:'Deaktivieren Sie die info-Spitzen', 5:'Disabilita le info-punte', 6:'Deshabilitar info-puntas', 7:'Desativar info-dicas', 8:'Info-Tipps desaktivéieren' };
C_XL.d['hide section'] = { 0:'Hide this section', 1:'Cacher cette section', 2:'Ukryj tę sekcję', 3:'Verberg deze sectie', 4:'Diese Sitzung ausblenden', 5:'Occultare questa sezione', 6:'Ocultar esta sección', 7:'Ocultar esta secção', 8:'Dës Sektioun verstoppen' };
C_XL.d['hide offdays'] = { 0:'Hide absents', 1:'Cacher les absents', 2:'Ukryć braku liczba', 3:'Verberg afwezigen', 4:'Nichterscheinungen ausblenden', 5:'Occultare assenti', 6:'Ocultar los ausentes', 7:'Esconder os ausentes', 8:'D\'Abwiesenheet verstoppen' };
C_XL.d['timeboxing labels'] = { 0:'Timeboxing labels', 1:'Libellés des blocs horaire', 2:'Nazwy pól czasu', 3:'Namen van tijd boxen', 4:'Titel der Zeitfenster', 5:'Formulazione dei blocchi orari', 6:'Enunciado de las bandas horarias', 7:'Rótulos dos blocos horários', 8:'Beschrëftunge vun de Bléck Zäit' };
C_XL.d['adaptative scale'] = { 0:'adaptative timeline scale', 1:'échelle de temps adaptative', 2:'adaptacyjna skala czasu', 3:'adaptieve tijdschaal', 4:'adaptive Zeitskala', 5:'scala temporale adattiva', 6:'escala de tiempo adaptativa', 7:'escala de tempo adaptativa', 8:'Adaptiv Zäitskala' };
C_XL.d['hide search'] = { 0:'Hide search assistant', 1:'Cacher l\'assistant de recherche', 2:'Ukryj asystenta wyszukiwania', 3:'Zoekassistent verbergen', 4:'Suchassistent ausblenden', 5:'Nascondi assistente di ricerca', 6:'Ocultar asistente de búsqueda', 7:'Ocultar assistente de pesquisa', 8:'Den Hëllefsassistent verstoppen' };
C_XL.d['show empty tboxes'] = { 0:'Show empty timeboxes', 1:'Montrer les bloc horaires vides', 2:'Pokaż puste timeboxes', 3:'Toon lege tijdsblokken', 4:'Leere Zeitfenster anzeigen', 5:'Mostrarei blocchi orari vuoti', 6:'Mostrar las bandas horarias vacías', 7:'Mostrar o bloco de horas vazias', 8:'Eidel Zäitbléck weisen' };

C_XL.d['adapt scale tip'] = {
    0:'The displayed time range is reduced to the daily availability settings',
    1:'La plage horaire affichée est limitée par le réglage de l\'horaire',
    2:'Wyświetlane okres czasu jest określona przez ustawienia harmonogramu',
    3:'De weergegeven tijdspan wordt bepaald door de instellingen van de uurrooster',
    4:'Das angezeigte Zeitfenster wird von den Stundenplaneinstellungen begrenzt',
    5:'La fascia oraria mostrata è limitata dall\'impostazione del orario',
    6:'La banda horaria mostrada está limitada por la configuración del horario',
    7:'O intervalo horário mostrado é limitado pela configuração do horário',
    8:'Den ugewise Zäitraum ass duerch d\'Auer-Astellunge limitéiert'
};

C_XL.d['bp_hrl_slicing'] = {  
    0: 'This time-block will be sliced into parts of $mn$ minutes.',               // english
    1: 'Ce block horaire sera découpé en parties de $mn$ minutes.',                  // french
    2: 'Ten blok czasowy zostanie podzielony na części po $mn$ minut.',               // polish
    3: 'Dit tijdblok wordt opgedeeld in stukken van $mn$ minuten.',                   // dutch
    4: 'Dieser Zeitblock wird in $mn$-Minuten-Abschnitte unterteilt.',                 // german
    5: 'Questo blocco temporale verrà suddiviso in parti di $mn$ minuti.',             // italian
    6: 'Este bloque de tiempo se dividirá en segmentos de $mn$ minutos.',               // spanish
    7: 'Este bloco de tempo será dividido em partes de $mn$ minutos.',                 // portuguese
    8: 'Dëse Zäitblock gëtt an $mn$-Minuten-Abschnitter opgedeelt.'                  // luxembourgish
};


							
C_XL.d['display details'] = { 0:'Display details', 1:'Détails d\'affichage', 2:'Pokaż szczegóły', 3:'Weergavedetails', 4:'ansichtsinformationen', 5:'Dettagli di visualizzazione', 6:'Detalles de visualización', 7:'Detalhes da visualização', 8:'Weis Detailer' };
C_XL.d['display options'] = { 0:'Display options', 1:'Options d\'affichage', 2:'opcje wyświetlania', 3:'weergaveopties', 4:'anzeigeoptionen', 5:'Opzioni di visualizzazione', 6:'opciones de visualización', 7:'opções da visualização', 8:'Optioune weisen' };
C_XL.d['display order'] = { 0:'Display order', 1:'Ordre d\'affichage', 2:'Kolejność wyświetlania', 3:'Weergavevolgorde', 4:'ansicht', 5:'Ordine di visualizzazione', 6:'Orden de visualización', 7:'Ordem da visualização', 8:'Weis Uerdnung' };
C_XL.d['vertical view'] = { 0:'Vertical view', 1:'Vue verticale', 2:'Widok pionowy', 3:'Verticale weergave', 4:'ansichtsordnung', 5:'Vista verticale', 6:'Visualización vertical', 7:'Exibição vertical', 8:'Vertikal Vue' };
C_XL.d['horizontal view'] = { 0:'Horizontal view', 1:'Vue horizontale', 2:'Widok poziomy', 3:'Horizontale weergave', 4:'Horizontale Ansicht', 5:'Vista orizzontale', 6:'Visualización horizontal', 7:'Exibição horizontal', 8:'Horizontal Vue' };
C_XL.d['list view'] = { 0:'List view', 1:'Vue en liste', 2:'Widok listy', 3:'Lijstweergave', 4:'Listenanzeige', 5:'Vista in lista', 6:'Visualización en lista', 7:'Exibição em lista', 8:'Lëscht Vue' };
C_XL.d['miscellaneous'] = { 0:'Miscellaneous', 1:'autres options', 2:'Różny', 3:'anderen opties', 4:'Sonstige Optionen', 5:'altre opzioni', 6:'Otras opciones', 7:'Outras opções', 8:'Verschiddenes' };

C_XL.d['tip-showhides deleted'] = {
    0:'shows/hides deleted items', // english
    1:'montrer/cacher les éléments supprimés', // french
    2:'pokazuje/ukrywa usunięte elementy', // polish
    3:'toont/verbergt verwijderde items', // dutch
    4:'zeigt/verbirgt gelöschte Elemente', // german
    5:'mostra/nasconde gli elementi eliminati', // italian
    6:'muestra/oculta elementos eliminados', // spanish
    7:'mostra/oculta itens excluídos', // portuguese
    8:'weist/verstoppt geläschte Elementer' // luxembourgish
};

C_XL.d['bp locktip'] = {
    0:'To temporarily prevent this login from accessing the system, you can lock it.', // English
    1:'Pour interdire temporairement à ce login de se connecter, vous pouvez le verrouiller.', // French
    2:'Aby tymczasowo uniemożliwić logowanie, możesz je zablokować.', // Polish
    3:'Om tijdelijk te voorkomen dat deze login toegang krijgt, kunt u deze vergrendelen.', // Dutch
    4:'Um vorübergehend zu verhindern, dass sich dieser Benutzer anmeldet, können Sie ihn sperren.', // German
    5:'Per impedire temporaneamente a questo login di accedere, puoi bloccarlo.', // Italian
    6:'Para evitar temporalmente que este inicio de sesión acceda, puede bloquearlo.', // Spanish
    7:'Para impedir temporariamente este login de acessar, você pode bloqueá-lo.', // Portuguese
    8:'Fir dëse Login temporär ze blockéieren, kënnt Dir en spären.' // Luxembourgish
};

C_XL.d['bp locked'] = {
    0:'is temporarily not allowed to log in.', // English
    1:'n\'est temporairement pas autorisé à se connecter.', // French
    2:'nie ma tymczasowo dostępu do logowania.', // Polish
    3:'mag tijdelijk niet inloggen.', // Dutch
    4:'darf sich vorübergehend nicht anmelden.', // German
    5:'non è temporaneamente autorizzato ad accedere.', // Italian
    6:'no tiene permiso temporalmente para iniciar sesión.', // Spanish
    7:'não tem permissão temporária para fazer login.', // Portuguese
    8:'darf sech temporär net aloggen.' // Luxembourgish
};

C_XL.d['weak credentials'] = {
    0:'this login has weakly secured credentials', // english
    1:'ce login a des informations d\'identification faiblement sécurisées.', // french
    2:'ten login ma słabo zabezpieczone dane uwierzytelniające', // polish
    3:'deze login heeft zwak beveiligde inloggegevens', // dutch
    4:'Dieser Login hat schwach gesicherte Anmeldeinformationen', // german
    5:'questo accesso ha credenziali scarsamente protette', // italian
    6:'este inicio de sesión tiene credenciales poco seguras', // spanish
    7:'este login tem credenciais pouco seguras', // portuguese
    8:'dëse Login huet schlecht geséchert Zougangsinformatiounen.' // Luxembourgish
};

C_XL.d['disabled webpage'] = {
    0:'this webpage is temporarily not active', // English
    1:'cette page web est actuellement inactive', // French
    2:'ta strona internetowa jest tymczasowo nieaktywna', // Polish
    3:'deze webpagina is tijdelijk niet actief', // Dutch
    4:'diese Webseite ist vorübergehend nicht aktiv', // German
    5:'questa pagina web è temporaneamente inattiva', // Italian
    6:'esta página web no está activa temporalmente', // Spanish
    7:'esta página da web está temporariamente inativa', // Portuguese
    8:'dës Websäit ass temporär inaktiv.' // Luxembourgish
};









////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// 		C_dS_visitor
//
	
// 		technical 				english:0,				french:1,				polish:2,				dutch:3,					german:4,				italian:5,				spanish:6,			portuguese:7, 	luxembourgish:8

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

C_XL.d['add column'] = { 0:'Display also', 1:'afficher aussi', 2:'Zobacz jako', 3:'Ook tonen', 4:'auch anzeigen', 5:'Mostare anche', 6:'Mostrar también', 7:'Mostrar também', 8:'Och weisen' };
C_XL.d['remove column'] = { 0:'Do not display', 1:'Ne pas afficher', 2:'Nie pokazuj', 3:'Niet meer tonen', 4:'Nicht anzeigen', 5:'Non mostrare', 6:'No mostrar', 7:'Não mostrar', 8:'Net weisen' };
C_XL.d['sort on'] = { 0:'Sort on', 1:'Trier sur', 2:'Sortuj', 3:'Sorteren op', 4:'Sortieren nach', 5:'Filtrare', 6:'Filtrar por', 7:'Filtrar por', 8:'Sortéieren op' };
C_XL.d['file format'] = { 0:'File format', 1:'Format du fichier', 2:'Format plików', 3:'Bestandsformaat', 4:'Dateiformat', 5:'Formato del file', 6:'Formato del archivo', 7:'Formato do ficheiro', 8:'Dateiformat' };

C_XL.d['reservations'] = { 0:'Reservations', 1:'Reservations', 2:'Rezerwacje', 3:'Reserveringen', 4:'Reservierungen', 5:'Prenotazioni', 6:'Reservas', 7:'Reservas', 8:'Reservatiounen' };
C_XL.d['booking code'] = { 0:'booking code', 1:'code de réservation', 2:'kod rezerwacji', 3:'boekingscode', 4:'Buchungscode', 5:'codice di prenotazione', 6:'código de reserva', 7:'código de reserva', 8:'Buchungscode' };
C_XL.d['version'] = { 0:'version', 1:'version', 2:'wersja', 3:'versie', 4:'ausführung', 5:'versione', 6:'versión', 7:'versão', 8:'Versioun' };
C_XL.d['appointments'] = { 0:'appointments', 1:'rendez-vous', 2:'nominacje', 3:'afspraken', 4:'termine', 5:'appuntamenti', 6:'citas', 7:'compromissos', 8:'Rendez-vous' };
C_XL.d['optional resa'] = { 0:'Optional reservations', 1:'Réservation optionelle', 2:'Rezerwacje', 3:'optionele reserveringen', 4:'Optionale Reservierungen', 5:'Prenotazioni opzionali', 6:'Reservas opcionales', 7:'Reserva opcional', 8:'Optional Reservatiounen' };
C_XL.d['communication'] = { 0:'Communication', 1:'Communication', 2:'Komunikat', 3:'Communicatie', 4:'Kommunikation', 5:'Comunicazione', 6:'Comunicación', 7:'Comunicação', 8:'Kommunikatioun' };
C_XL.d['agenda'] = { 0:'agenda', 1:'agenda', 2:'programie', 3:'agenda', 4:'Tagesordnung', 5:'agenda', 6:'agenda', 7:'agenda', 8:'Agenda' };
C_XL.d['calendar'] = { 0:'Calendar', 1:'Calendrier', 2:'kalendarz', 3:'Kalender', 4:'Kalender', 5:'Calendario', 6:'Calendario', 7:'Cronograma', 8:'Kalenner' };
C_XL.d['calendars'] = { 0:'Calendars', 1:'Calendriers', 2:'kalendarze', 3:'Kalenders', 4:'Kalender', 5:'Calendari', 6:'Calendarios', 7:'Calendários', 8:'Kalennere' };
C_XL.d['preferences'] = { 0:'Preferences', 1:'Préférences', 2:'preferencje', 3:'Voorkeuren', 4:'Präferenzen', 5:'Preferenze', 6:'Preferencias', 7:'Preferências', 8:'Präferenzen' };
C_XL.d['newvisitor'] = { 0:'New visitor', 1:'Nouveau visitor', 2:'Nowy visitor', 3:'Nieuwe visitor', 4:'Neuer visitor', 5:'Nuovo visitor', 6:'Nuevo visitor', 7:'Novo visitor', 8:'Neie Visiteur' };
C_XL.d['vduplicate'] = { 0:'Duplicate', 1:'Doublon', 2:'Duplikat', 3:'Duplicaat', 4:'Duplikat', 5:'Doppione', 6:'Duplicado', 7:'Repetição', 8:'Duebel' };
C_XL.d['audit'] = { 0:'Tracking', 1:'audit', 2:'audyt', 3:'Opvolging', 4:'audit', 5:'audit', 6:'auditoría', 7:'auditoria', 8:'Audit' };
C_XL.d['sections'] = { 0:'Sections', 1:'Sections', 2:'Sekcje', 3:'Secties', 4:'Bereiche', 5:'Sezioni', 6:'Secciones', 7:'Secções', 8:'Sektiounen' };

C_XL.d['visitor_bp_ctrlshift']	= { 
	0:'$kb$ Ctrl + Click to view the appointment history.<br/>$kb$ Shift + Click to directly edit the note.<br/>A simple click to modify the signage.',	// english
	1:'$kb$ Ctrl + Clic pour consulter l\'historique de RDV.<br/>$kb$ Shift + Clic pour éditer directement la note.<br/>Un simple clic pour modifier la signalétique.',	// french
	2:'$kb$ Ctrl + kliknięcie, aby wyświetlić historię wizyt.<br/>$kb$ Shift + kliknięcie, aby bezpośrednio edytować notatkę.<br/>Proste kliknięcie, aby zmienić oznaczenie.',	// polish
	3:'$kb$ Ctrl + klik om de afspraakgeschiedenis te bekijken.<br/>$kb$ Shift + klik om de notitie direct te bewerken.<br/>Een simpele klik om de signalering te wijzigen.',	// dutch
	4:'$kb$ Ctrl + Klick, um die Termin­historie anzuzeigen.<br/>$kb$ Shift + Klick, um die Notiz direkt zu bearbeiten.<br/>Ein einfacher Klick, um die Kennzeichnung zu ändern.',	// german
	5:'$kb$ Ctrl + clic per visualizzare la cronologia degli appuntamenti.<br/>$kb$ Shift + clic per modificare direttamente la nota.<br/>Un semplice clic per modificare la segnaletica.',	// italian
	6:'$kb$ Ctrl + clic para consultar el historial de citas.<br/>$kb$ Shift + clic para editar directamente la nota.<br/>Un simple clic para modificar la señalización.', 	// spanish
	7:'$kb$ Ctrl + clique para consultar o histórico de compromissos.<br/>$kb$ Shift + clique para editar diretamente a nota.<br/>Um simples clique para modificar a sinalética.',	// portuguese
	8:'$kb$ Ctrl + Klick fir d’Rendez-vous-Historie ze gesinn.<br/>$kb$ Shift + Klick fir d’Notiz direkt z’änneren.<br/>E einfache Klick fir d’Kennzeechnung z’änneren.'	// luxembourgish
};	












// 		technical 				english:0,				french:1,					polish:2,					dutch:3,					german:4,					italian:5,						spanish:6,				portuguese:7, 	luxembourgish:8
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

C_XL.d['list screen'] = { 0:'List view', 1:'Vue en liste', 2:'Lista na dzień', 3:'lijstzicht', 4:'Listenansicht', 5:'Vista in lista', 6:'Visualización en lista', 7:'Exibição em lista', 8:'Lëscht Vue' };
C_XL.d['changes screen'] = { 0:'Daily changes', 1:'Mouvements', 2:'Dzienne zmiany', 3:'veranderingen', 4:'Tägliche Änderungen', 5:'Movimenti giornalieri', 6:'Movimientos diarios', 7:'Movimentos', 8:'Dagesännerungen' };
C_XL.d['week screen'] = { 0:'Week view', 1:'Vue de la semaine', 2:'Widok tygodnia', 3:'weekzicht', 4:'Wochenansicht', 5:'Vista settimanale', 6:'Visualización semanal', 7:'Vista semanal', 8:'Woch Vue' };
C_XL.d['standard screen'] = { 0:'Standard view', 1:'Vue standard', 2:'Widok standardowy', 3:'standaard weergave', 4:'Standardansicht', 5:'Vista standard', 6:'Visualización estándar', 7:'Vista padrão', 8:'Standard Vue' };

C_XL.d['pause'] = { 0:'Break', 1:'Pause', 2:'Pauza', 3:'Pause', 4:'Pause', 5:'Pausa', 6:'Pausa', 7:'Pausa', 8:'Paus' };
C_XL.d['overlap'] = { 0:'Overlap', 1:'Chevauchement', 2:'Zakładka', 3:'Kruising', 4:'Überschneidung', 5:'accavallamento', 6:'Superposición', 7:'Sobreposição', 8:'Iwwerlappung' };

C_XL.d['details'] = { 0:'Details', 1:'Détails', 2:'Dodatkowe', 3:'Details', 4:'Details', 5:'Dettagli', 6:'Detalles', 7:'Detalhes', 8:'Detailer' };
C_XL.d['definition'] = { 0:'Definition', 1:'Définition', 2:'Opisanie', 3:'Beschrijving', 4:'Definition', 5:'Definizione', 6:'Definición', 7:'Definição', 8:'Definitioun' };
C_XL.d['users'] = { 0:'Users', 1:'Utilisateurs', 2:'Użytkownicy', 3:'Gebruikers', 4:'Nutzer', 5:'Utenti', 6:'Usuarios', 7:'Utilizadores', 8:'Benotzer' };
C_XL.d['usage'] = { 0:'Usage', 1:'Utilisation', 2:'Stosowanie', 3:'Gebruik', 4:'Nutzung', 5:'Utilizzo', 6:'Utilización', 7:'Utilização', 8:'Notzung' };
C_XL.d['upper'] = { 0:'Upper', 1:'Monter', 2:'Do góry', 3:'Hoger', 4:'Obere', 5:'Salire', 6:'Subir', 7:'Montar', 8:'Uewen' };
C_XL.d['lower'] = { 0:'Lower', 1:'Descendre', 2:'Do dołu', 3:'Lager', 4:'Untere', 5:'Scendere', 6:'Bajar', 7:'Descer', 8:'Ënnen' };
C_XL.d['add'] = { 0:'add', 1:'ajouter', 2:'Dodaj', 3:'Toevoegen', 4:'Hinzufügen', 5:'aggiungere', 6:'añadir', 7:'adicionar', 8:'Dobäisetzen' };
C_XL.d['with'] = { 0:'with', 1:'avec', 2:'z', 3:'met', 4:'mit', 5:'con', 6:'con', 7:'com', 8:'mat' };

C_XL.d['places'] = { 0:'Places', 1:'Endroits', 2:'Miejsca', 3:'Plaatsen', 4:'Orte', 5:'Luoghi', 6:'Lugares', 7:'Locais', 8:'Plazen' };
C_XL.d['people'] = { 0:'People', 1:'Personnes', 2:'Ludzie', 3:'Mensen', 4:'Personen', 5:'Persone', 6:'Personas', 7:'Pessoas', 8:'Leit' };
C_XL.d['assets'] = { 0:'assets', 1:'Matériel', 2:'Majątek', 3:'activa', 4:'Material', 5:'Materiale', 6:'Material', 7:'Material', 8:'Material' };
C_XL.d['miscel'] = { 0:'Miscellaneous', 1:'autres', 2:'Różny', 3:'Diversen', 4:'Sonstige', 5:'altri', 6:'Otros', 7:'Outros', 8:'Verschiddenes' };


// 		technical 				english:0,			french:1,				polish:2,				dutch:3,				german:4,			italian:5,				spanish:6,					portuguese:7, 	luxembourgish:8
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
C_XL.d['experts'] = { 0:'experts', 1:'experts', 2:'eksperci', 3:'deskundigen', 4:'experten', 5:'periti', 6:'peritos', 7:'peritos', 8:'pxperten' };
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
C_XL.d['duplicate'] = { 0:'Duplicate', 1:'Dupliquer', 2:'replikować', 3:'Dupliceren', 4:'Duplizieren', 5:'Duplicare', 6:'Duplicar', 7:'Duplicar', 8:'Duebel maachen' };
C_XL.d['disabled'] = { 0:'Disabled', 1:'Désactivé', 2:'Wyłączony', 3:'Uit', 4:'Deaktviert', 5:'Disattivato', 6:'Desactivado', 7:'Desativado', 8:'Deaktivéiert' };
C_XL.d['ready'] = { 0:'Ready', 1:'Préparé', 2:'Gotowy', 3:'gereed', 4:'Bereit', 5:'Pronto', 6:'Listo', 7:'Preparado', 8:'Bereet' };

C_XL.d['quit'] = { 0:'Close and cancel changes', 1:'Quitter sans rien enregistrer', 2:'Zamknij', 3:'Sluiten zonder opslaan', 4:'Beenden', 5:'Lasciare senza salvare', 6:'Salir sin guardar', 7:'Sair sem gravar', 8:'Zoumaachen an Ännerungen ofbriechen' };
C_XL.d['add visitor'] = { 0:'add selected visitor', 1:'ajouter le visiteur séléctionné', 2:'add visitor', 3:'Geselecteerde bezoeker bijvoegen', 4:'Besucher hinzufügen', 5:'aggiungere il visitatore selezionato', 6:'añadir el visitante seleccionado', 7:'adicionar o visitante selecionado', 8:'Füügt de Visiteur dobäi' };
C_XL.d['car contract'] = { 0:'Car rental contract', 1:'Contrat de location voiture', 2:'Umowa najmu pojazdu', 3:'Vervangwagen huurcontract', 4:'Mietwagenvertrag', 5:'Contratto di noleggio macchina', 6:'Contrato de alquiler de coche ', 7:'Contrato de locação de veículo', 8:'Locatiounskontrakt fir Autoen' };
C_XL.d['linked doc'] = { 0:'Linked document', 1:'Document relatif', 2:'Związany dokumentu', 3:'Gekoppelde document', 4:'Verknüpftes Dokument', 5:'Documento relativo', 6:'Documento relativo', 7:'Documento relativo', 8:'Verknäppte Dokument' };

C_XL.d['extra space'] = { 0:'additional space', 1:'Espace supplémentaire', 2:'Dodatkowe miejsce', 3:'Extra ruimte', 4:'Zusätzlicher Raum', 5:'Spazio supplementare', 6:'Espacio adicional', 7:'Espaço extra', 8:'Zousätzleche Raum' };
C_XL.d['has no mobile'] = { 0:'Has no mobile number', 1:'N\'a pas de numéro de portable', 2:'Nie ma numeru telefonu komórkowego', 3:'Heeft geen GSM nummer', 4:'Hat keine Mobilnummer', 5:'Non ha numero di cellulare', 6:'No tiene número de móvil', 7:'Nenhum número de telemóvel', 8:'Keng Handysnummer' };
C_XL.d['phone slicing'] = { 0:'Phone number hyphenation', 1:'Césure des numéros de téléphone', 2:'Podział numerów telefonicznych', 3:'afbreking van telefoonnummers', 4:'Trennung von Mobilnummern', 5:'Separazione dei numeri di telefono', 6:'Espacios entre los números de teléfono', 7:'Separação dos números de telefone', 8:'Telefonnummer-Trennung' };

// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8

C_XL.d['free'] = { 0:'Free', 1:'Libre', 2:'Wolny/a', 3:'Vrij', 4:'Frei', 5:'Libero', 6:'Libre', 7:'Livre', 8:'Fräi' };
C_XL.d['hourly'] = { 0:'Availabilities', 1:'Horaire', 2:'Slotów', 3:'Dienstregeling', 4:'Zeitplan', 5:'Orario', 6:'Horario', 7:'Horário', 8:'Stonneplang' };
C_XL.d['availability set'] = { 0:'availability set', 1:'horaire courant', 2:'Slotów', 3:'huidige uurrooster', 4:'Zeitplan', 5:'Orario', 6:'Horario', 7:'Horário', 8:'Stonneplang' };
C_XL.d['hourlies'] = { 0:'Availability sets', 1:'Horaires', 2:'Godzinowy', 3:'Werkrooster', 4:'Zeitpläne', 5:'Orari', 6:'Horarios', 7:'Horários', 8:'Stonnepläng' };
C_XL.d['no hourly'] = { 0:'Always available', 1:'Pas d\'horaire', 2:'Nie slotów', 3:'Geen dienstregeling', 4:'Kein Zeitplan', 5:'Senza orario', 6:'Sin horario', 7:'Sem horário', 8:'Keng Stonneplang' };
C_XL.d['change hourly'] = { 0:'Change availabilities', 1:'Changer d\'horaire', 2:'Harmonogram zmian', 3:'Uurrooster veranderen', 4:'Zeitplan ändern', 5:'Cambiare orario', 6:'Cambiar horario', 7:'Mudar o horário', 8:'Ännerung vum Stonneplang' };
C_XL.d['back to hourly'] = { 0:'Return to availabilities', 1:'Retour à l\'horaire', 2:'Powrócić do planowania', 3:'Terug naar uurrooster', 4:'Zurück zum Zeitplan', 5:'Ritorno all\'orario', 6:'Volver al horario', 7:'Regressar ao horário', 8:'Zréck an de Stonneplang' };
C_XL.d['hourly change'] = { 0:'Availabilities change', 1:'Changement d\'horaire', 2:'Zmiany harmonogramu', 3:'Verandering in uurrooster', 4:'Zeitplanänderung', 5:'Cambiamento di orario', 6:'Cambio de horario', 7:'Mudança de horário', 8:'Stonneplang Ännerung' };
C_XL.d['ex hourly change'] = { 0:'Only this ', 1:'Seulement ce ', 2:'Tylko w ', 3:'Enkel op ', 4:'Nur am', 5:'Solo questo', 6:'Solamente este', 7:'apenas este ', 8:'Nëmmen dëst' };
C_XL.d['in this hourly'] = { 0:'in the running availability set', 1:'dans cet horaire', 2:'w niniejszym harmonogramie', 3:'in deze uurrooster', 4:'in diesem Zeitplan', 5:'in questo orario', 6:'En este horario', 7:'neste horário', 8:'An dësem Stonneplang' };
C_XL.d['new hourly'] = { 0:'Make new availability set', 1:'Nouvel horaire', 2:'Nowy rozkład', 3:'Nieuwe uurrooster', 4:'Neuer Zeitplan', 5:'Nuovo orario', 6:'Nuevo horario', 7:'Novo horário', 8:'Neie Stonneplang' };
C_XL.d['reuse hourly'] = { 0:'Reuse an availability set', 1:'Réutiliser un horaire', 2:'Ponownie użyć harmonogramu', 3:'Hervat een uurrooster', 4:'Zeitplan wiederverwenden', 5:'Riutilizzare un orario', 6:'Reutilizar un horario', 7:'Reutilizar um horário', 8:'Eng Zäitplang nei benotzen' };
C_XL.d['hourly skip'] = { 0:'Availabilities double switch', 1:'Saut d\'horaire', 2:'Harmonogram kontynuować', 3:'Uurrooster doorgaan', 4:'Sprung einplanen', 5:'Salto orario', 6:'Saltar un horario', 7:'Saltar horário', 8:'Iwwersprangen' };
C_XL.d['hourlies modif'] = { 0:'Availability changes', 1:'Changements d\'horaire', 2:'Zmiany planu', 3:'Roosterwijzigingen', 4:'Zeitplanänderungen', 5:'Cambiamento orario', 6:'Cambio horario', 7:'alterações ao horário', 8:'Stonneplang Ännerungen' };
C_XL.d['current schedule'] = { 0:'Running availability set', 1:'Horaire en cours', 2:'Obecny harmonogram', 3:'Huidige planning', 4:'aktueller Zeitplan', 5:'Orario in corso', 6:'Horario en curso', 7:'Horário em curso', 8:'Aktuellen Zäitplang' };
C_XL.d['in current schedule'] = { 0:'In the running availability set', 1:'Dans l\'horaire en cours', 2:'W bieżącym planowaniu', 3:'In de huidige planning', 4:'Im aktuellen Zeitplan', 5:'Nell\'orario in corso', 6:'En el horario en curso', 7:'No horário em curso', 8:'Am aktuellen Zäitplang' };
C_XL.d['enters into force'] = { 0:'Enters into force on', 1:'Entre en vigueur le', 2:'Wchodzi w życie w dniu', 3:'Treedt in werking op', 4:'Tritt in Kraft am', 5:'Entra in vigore il', 6:'Entra en vigor el', 7:'Entra em vigor a', 8:'Trëtt a Kraaft den' };
C_XL.d['entered into force'] = { 0:'Entered into force on', 1:'Entré en vigueur le', 2:'Wweszła w życie jest', 3:'In werking getreden op', 4:'In Kraft getreten am', 5:'Entrato in vigore il', 6:'Entrado en vigor el', 7:'Entrou em vigor a', 8:'A Kraaft getrueden den' };

C_XL.d['do not modify past hourlies'] = {
    0:'You can not modify availabilities in the past',
    1:'On ne peut pas modifier un horaire à une date passée',
    2:'Nie można zmienić harmonogram,\tdo daty w przeszłości',
    3:'U kunt een schema niet veranderen naar een datum in het verleden',
    4:'Änderungen an vergangenen Zeitplänen sind nicht möglich',
    5:'Non si può modificare un orario su una data passata',
    6:'No se puede modificar un horario en una fecha pasada',
    7:'Você não pode alterar uma agenda para uma data passada',
    8:'Dir kënnt keng Stonnepläng an der Vergaangenheet änneren'
};

C_XL.d['already an hourly change on date'] = {
    0:'There is already a change of availabilities on this date',
    1:'Il y a déjà un changement d\'horaire enregistré à cette date',
    2:'Jest już harmonogram zmiany rejestrowane w tym dniu',
    3:'Er is al een schema wijziging die op deze datum',
    4:'an diesem Tag gibt es bereits eine Zeitplanänderung',
    5:'È già stato registrato un cambiamento di orario su questa data',
    6:'Ya se guardó un cambio de horario en esta fecha',
    7:'Já há uma mudança de horário registada no mesmo dia',
    8:'Et gëtt schonn eng Stonneplang Ännerung fir dësen Dag'
};

C_XL.d['remove from list'] = { 0:'Remove from list', 1:'Enlever de la liste', 2:'Usuń z listy', 3:'Uit de lijst halen', 4:'aus der Liste entfernen', 5:'Togliere dalla lista', 6:'Sacar de la lista', 7:'Remover da lista', 8:'Aus der Lëscht läschen' };
C_XL.d['remove peer?'] = { 0:'Remove linked reservation?', 1:'Supprimer la réservation associée?', 2:'Usuń skojarzoną rezerwować?', 3:'Verwijder de bijbehorende reservering?', 4:'Verbundene Reservierung entfernen?', 5:'Eliminare la prenotazione associata?', 6:'Cancelar la reserva asociada?', 7:'Eliminar a reserva associada?', 8:'Verbonnen Reservatioun läschen?' };


// tooltips for buttons
//
//
var kb 		= '<span class="fa fa-13x fa-keyboard"></span>&nbsp;'; // keyboard symbol (does not translate) !! No translation on this line
	
var sc = { 0:kb+'Shortcut key: ', 1:kb+'Raccourci clavier: ', 2:kb+'Skrót klawiaturowy: ', 3:kb+'Hotkey: ', 4:kb+'Tastenkombination: ', 5:kb+'Scorciatoia da tastiera: ', 6:kb+'Tecla de acceso directo: ', 7:kb+'Atalho de teclado: ', 8:kb+'Ofkierzsleef: ' };

var quit = { 0:'To quit mode press <b>Esc</b>', 1:'Pour sortir du mode: <b>Esc</b>', 2:'<b>Esc</b>: aby wyjść z trybu', 3:'<b>Esc</b> om te verlaten', 4:'<b>Esc</b> Taste drücken, um den Modus zu verlassen', 5:'Per uscire dal modo: <b>Esc</b>', 6:'Para salir de este modo presiona: <b>Esc</b>', 7:'Para sair do modo: <b>Esc</b>', 8:'Fir de Modus ze verloossen, dréckt <b>Esc</b>' };

var nl = '<br/>'; // no translation on this line
var pad = '&nbsp;&nbsp;&nbsp;&nbsp;'; // no translation on this line

C_XL.d['tip weekview'] = {
    0:'<b>Go to week view</b>' +nl+sc[0]+'<b>F2</b>',
    1:'<b>Passer sur la vue de la semaine</b>' +nl+sc[1]+'<b>F2</b>',
    2:'<b>Przejdź do widoku tygodnia</b>' +nl+sc[2]+'<b>F2</b>',
    3:'<b>Naar de week overzicht</b>' +nl+sc[3]+'<b>F2</b>',
    4:'<b>Zur Wochenansicht</b>' +nl+sc[4]+'<b>F2</b>',
    5:'<b>Passare alla visualizzazione della settimana</b>' +nl+sc[5]+'<b>F2</b>',
    6:'<b>Pasar a la visualización de la semana</b>' +nl+sc[6]+'<b>F2</b>',
    7:'<b>Ir para a vista da semana</b>' +nl+sc[7]+'<b>F2</b>',
    8:'<b>An d\'Wochen Vue goen</b>' +nl+sc[8]+'<b>F2</b>'
};

C_XL.d['tip zoom'] = {
    0:'<b>Zoom in/out</b>' +nl+sc[0]+'<b>Ctrl+Z</b>',
    1:'<b>Zoom in/out</b>' +nl+sc[1]+'<b>Ctrl+Z</b>',
    2:'<b>Zoom in/out</b>' +nl+sc[2]+'<b>Ctrl+Z</b>',
    3:'<b>Zoom in/out</b>' +nl+sc[3]+'<b>Ctrl+Z</b>',
    4:'<b>Herein-/Herauszoomen</b>' +nl+sc[4]+'<b>Ctrl+Z</b>',
    5:'<b>Zoom in/out</b>' +nl+sc[5]+'<b>Ctrl+Z</b>',
    6:'<b>Zoom in/out</b>' +nl+sc[6]+'<b>Ctrl+Z</b>',
    7:'<b>Zoom in/out</b>' +nl+sc[7]+'<b>Ctrl+Z</b>',
    8:'<b>Zoom eran/eraus</b>' +nl+sc[8]+'<b>Ctrl+Z</b>'
};

C_XL.d['tip searchview'] = {
    0:'<b>Search assistant</b>' +nl+sc[0]+'<b>F1</b>',
    1:'<b>Assistant de recherche</b>' +nl+sc[1]+'<b>F1</b>',
    2:'<b>Asystent wyszukiwania</b>' +nl+sc[2]+'<b>F1</b>',
    3:'<b>Zoek assistent</b>' +nl+sc[3]+'<b>F1</b>',
    4:'<b>Assistenten suchen</b>' +nl+sc[4]+'<b>F1</b>',
    5:'<b>Assistente di ricerca</b>' +nl+sc[5]+'<b>F1</b>',
    6:'<b>Asistente de búsqueda</b>' +nl+sc[6]+'<b>F1</b>',
    7:'<b>Assistente de pesquisa</b>' +nl+sc[7]+'<b>F1</b>',
    8:'<b>Sichassistent</b>' +nl+sc[8]+'<b>F1</b>'
};


// 		technical 	english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7, 	luxembourgish:8
C_XL.d['tip search help'] = { 
	0:'<b>Show areas that are clickable.</b>'+nl+'These areas all have a function that you can test.',
	1:'<b>Montrer les zones qui sont cliquables.</b>'+nl+'Ces zones ont toutes une fonction que vous pouvez tester.',
	2:'<b>Pokaż obszary, które można kliknąć.</b>'+nl+'Wszystkie te obszary mają funkcję, którą możesz przetestować.',
	3:'<b>Toon gebieden waarop kan worden geklikt.</b>'+nl+'Deze gebieden hebben allemaal een functie die je kunt testen.',
	4:'<b>Bereiche anzeigen, die anklickbar sind.</b>'+nl+'Diese Bereiche verfügen alle über eine Funktion, die Sie testen können.',
	5:'<b>Mostra le aree cliccabili.</b>'+nl+'Tutte queste aree hanno una funzione che puoi testare.',
	6:'<b>Mostrar áreas en las que se puede hacer clic.</b>'+nl+'Todas estas áreas tienen una función que puedes probar.',
	7:'<b>Mostre áreas clicáveis.</b>'+nl+'Todas essas áreas têm uma função que você pode testar.',
	8:'<b>Weist Beräicher déi klickbar sinn.</b>'+nl+'Dës Beräicher hunn all eng Funktioun déi Dir teste kënnt.'
};

C_XL.d['tip search help p2'] = { 
	0:'This search assistant allows you to filter your calendar and bring out the availabilities that meet the selected criteria.',
	1:'Cet assistant de recherche vous permet de filtrer votre agenda pour en sortir les disponibilités répondant aux critères sélectionnés.',
	2:'Ten asystent wyszukiwania umożliwia filtrowanie kalendarza w celu wybrania dostępności spełniających wybrane kryteria.',
	3:'Met deze zoekassistent kunt u uw agenda filteren om de beschikbaarheden naar voren te brengen die aan de geselecteerde criteria voldoen.',
	4:'Mit diesem Suchassistenten können Sie Ihren Kalender filtern, um die Verfügbarkeiten anzuzeigen, die den ausgewählten Kriterien entsprechen.',
	5:'Questo assistente di ricerca ti permette di filtrare il tuo calendario per far emergere le disponibilità che soddisfano i criteri selezionati.',
	6:'Este asistente de búsqueda le permite filtrar su calendario para resaltar las disponibilidades que cumplen con los criterios seleccionados.',
	7:'Este assistente de pesquisa permite filtrar seu calendário para destacar as disponibilidades que atendem aos critérios selecionados.',
	8:'Dësen Hëllefsassistent erlaabt Iech Äre Kalenner ze filteren fir d’Verfügbarkeeten erauszebréngen, déi den ausgewielten Critèren entspriechen.'
};

C_XL.d['tip modal resa'] = { 
	0:'You find the appointments in the history of the visitor file. Also, you can find, count and export appointments of a particular type using the "Filter & find" tool, accessible via ',
	1:'Vous retrouvez les rendez-vous dans l\'historique de la fiche de visitor. Egalement, vous pouvez retrouver, compter et exporter des rendez-vous d\'un type particulier à l\'aide l\'outil "Filtrer & trouver", accessible via ',
	2:'Wizyty znajdziesz w historii kartoteki visitor. Możesz także wyszukiwać, liczyć i eksportować spotkania określonego typu za pomocą narzędzia „Filtruj i znajdź”, dostępnego za pomocą ',
	3:'De afspraken vindt u in de historie van de visitor. Ook kunt u afspraken van een bepaald type opzoeken, tellen en exporteren via de tool "Filteren & Zoeken", toegankelijk via ',
	4:'Die Termine finden Sie in der Historie der visitor. Außerdem können Sie mit dem über diese Schaltfläche zugänglichen Tool „Filtern & Suchen“ Termine eines bestimmten Typs suchen, zählen und exportieren. ',
	5:'Trovi gli appuntamenti nello storico della cartella visitor. Inoltre, puoi trovare, contare ed esportare gli appuntamenti di un particolare tipo utilizzando lo strumento "Filtra e trova", accessibile tramite ',
	6:'Las citas se encuentran en el historial del expediente del visitor. Además, puede buscar, contar y exportar citas de un tipo particular utilizando la herramienta "Filtrar y buscar", accesible a través de ',
	7:'Você encontra os agendamentos no histórico da ficha do visitor. Além disso, você pode localizar, contar e exportar compromissos de um determinado tipo usando a ferramenta "Filtrar e localizar", acessível através ',
	8:'Dir fannt d\'Rendez-vous an der Geschicht vun der Visitor Datei. Ausserdeem kënnt Dir Rendez-vous vun engem bestëmmten Typ fannen, zielen a mat der "Filter & fannen" Tool exportéieren, zougänglech iwwer '
};

C_XL.d['tip modal visi p1'] = { 
	0:'You will find in this sheet links to all the visitor\'s meetings, past and future. Also links to all conversations, notes and tasks in which this visitor is referenced',
	1:'Vous retrouvez dans cette fiche des liens vers tous les rendez-vous du visitor, passés et futurs. Egalement des liens vers toutes les conversations, notes et tâches dans lesquelles sont référencé ce visitor',
	2:'W tym arkuszu znajdziesz linki do wszystkich spotkań visitor, przeszłych i przyszłych. Zawiera także łącza do wszystkich rozmów, notatek i zadań, w których wspomina się o tym visitor',
	3:'Op dit blad vindt u links naar alle visitorbijeenkomsten, verleden en toekomstige. Tevens links naar alle gesprekken, notities en taken waarin naar deze visitor wordt verwezen',
	4:'In diesem Blatt finden Sie Links zu allen vergangenen und zukünftigen visitortreffen. Außerdem Links zu allen Gesprächen, Notizen und Aufgaben, in denen auf diesen visitor verwiesen wird',
	5:'Troverete in questa scheda i link a tutti gli incontri del visitor, passati e futuri. Collegamenti anche a tutte le conversazioni, note e attività in cui viene fatto riferimento a questo visitor',
	6:'En esta hoja encontrará enlaces a todas las reuniones de visitor, pasadas y futuras. También enlaces a todas las conversaciones, notas y tareas en las que se hace referencia a este visitor.',
	7:'Você encontrará nesta ficha links para todas as reuniões dos visitor, passadas e futuras. Também links para todas as conversas, notas e tarefas nas quais este visitor é referenciado',
	8:'Dir fannt an dësem Blat Links op all d\'Rendez-vous vum Visitor, vergaangen an zukünfteg. Och Links op all Gespréicher, Notizen a Aufgaben an deenen dëse Visitor referenzéiert gëtt'
};

C_XL.d['tip modal visi p2'] = { 
	0:'Is this visitor a doublons? On the "Tracking" tab, you can solve doublons by selecting the duplicate visitor file',
	1:'Ce visitor est-il un doublons? Sur le tab "Audit", vous pouvez résoudre ce doublon en sélectionnant le visitor concerné',
	2:'Czy ten visitor jest dublonem? W zakładce „Audyt” możesz rozwiązywać dubleny, wybierając zduplikowany plik visitor',
	3:'Is deze visitor een doublons? Op het tabblad "Opvolging" kunt u doublons oplossen door het dubbele visitorsbestand te selecteren',
	4:'Ist dieser visitor ein Dublon? Auf der Registerkarte „Prüfung“ können Sie Dublonen lösen, indem Sie die doppelte visitordatei auswählen',
	5:'Questo visitor è un doblone? Nella scheda "Audit", puoi risolvere i dobloni selezionando il file visitor duplicato',
	6:'¿Este visitor es un doblon? En la pestaña "Auditoría", puede resolver doblones seleccionando el archivo de visitor duplicado.',
	7:'Este visitor é um dobrão? Na aba "Auditoria", você pode resolver dúvidas selecionando o arquivo de visitor duplicado',
	8:'Ass dëse Visitor en Dublett? Op der Tab "Tracking" kënnt Dir Dubletten léisen andeems Dir d\'duplizéiert Visitor Datei auswielt'
};

C_XL.d['tip search'] = { 
	0:'<b>Search availabilities</b>' +nl+sc[0]+'<b>Ctrl+F</b>',
	1:'<b>Rechercher des disponibilités</b>' +nl+sc[1]+'<b>Ctrl+F</b>',
	2:'<b>Szukaj podaży</b>' +nl+sc[2]+'<b>Ctrl+F</b>',
	3:'<b>Bekijk de beschikbaarheid</b>' +nl+sc[3]+'<b>Ctrl+F</b>',
	4:'<b>Verfügbarkeiten suchen</b>' +nl+sc[4]+'<b>Ctrl+F</b>',
	5:'<b>Cercare disponibilità</b>' +nl+sc[5]+'<b>Ctrl+F</b>',
	6:'<b>Buscar disponibilidad</b>' +nl+sc[6]+'<b>Ctrl+F</b>',
	7:'<b>Pesquisar as disponibilidades</b>' +nl+sc[7]+'<b>Ctrl+F</b>',
	8:'<b>Sich no Verfügbarkeeten</b>' +nl+sc[8]+'<b>Ctrl+F</b>'
};

C_XL.d['tip exceptional'] = { 
	0:'<b>Search for availabilities in exceptional blocks</b>',
	1:'<b>Rechercher les disponibilités dans les périodes horaires exceptionnelles</b>',
	2:'<b>Szukaj podaży w wyjątkowych blokach godzinowych</b>',
	3:'<b>Zoeken naar beschikbaarheid in uitzonderlijke blokken van een uurooster</b>',
	4:'<b>Verfügbarkeiten in außergewöhnlichen Arbeitszeiten suchen</b>',
	5:'<b>Cercare disponibilità nei blocchi orari eccezionali</b>',
	6:'<b>Buscar disponibilidad en los horarios excepcionales</b>',
	7:'<b>Pesquisar as disponibilidades nos períodos horários extraordinários</b>',
	8:'<b>Verfügbarkeeten an aussergewéinlechen Aarbechtszäiten sichen</b>'
};

C_XL.d['tip aggregate'] = { 
	0:'<b>Only availabilities that collate existing appointments</b>',
	1:'<b>Seulement les disponibilités qui accollent les RDV</b>',
	2:'<b>Tylko dostępność, która zestawia terminy</b>',
	3:'<b>Alleen de beschikbaarheden die afspraken verzamelen</b>',
	4:'<b>Nur die Verfügbarkeiten, die Termine abgleichen</b>',
	5:'<b>Solo le disponibilità che mettono insieme gli appuntamenti</b>',
	6:'<b>Solo las disponibilidades que compaginan citas</b>',
	7:'<b>Apenas as disponibilidades que agrupam compromissos</b>',
	8:'<b>Nëmmen d\'Verfügbarkeeten déi Rendez-vous koordinéieren</b>'
};

C_XL.d['tip overdays'] = { 
	0:'<b>The reservation can spend over more than one day.</b>', // english
	1:'<b>La réservation peut s\'étendre sur plusieurs jours.</b>', // french
	2:'<b>Rezerwacja może trwać dłużej niż jeden dzień.</b>', // polish
	3:'<b>De reservering kan over meerdere dagen gaan.</b>', // dutch
	4:'<b>Die Reservierung kann über mehrere Tage gehen.</b>', // german
	5:'<b>La prenotazione può coprire più di un giorno.</b>', // italian
	6:'<b>La reserva puede extenderse por más de un día.</b>', // spanish
	7:'<b>A reserva pode durar mais de um dia.</b>', // portuguese
	8:'<b>D\'Reservatioun kann iwwer méi wéi een Dag daueren.</b>' // luxembourgish
};

C_XL.d['tip waiting list'] = { 
	0:'<b>Browse the waiting list</b>',
	1:'<b>Parcourir la liste d\'attente</b>',
	2:'<b>Przejrzyj listę oczekujących</b>',
	3:'<b>Blader door de wachtlijst</b>',
	4:'<b>Warteliste durchsuchen</b>',
	5:'<b>Esplorare la lista d\'attesa</b>',
	6:'<b>Explorar la lista de espera</b>',
	7:'<b>Percorrer a lista de espera</b>',
	8:'<b>Duerch d\'Waardelëscht bliederen</b>'
};

C_XL.d['tip replan'] = { 
	0:'<b>Replan</b>' +nl+sc[0]+'<b>Ctrl+R</b>'+nl+quit[0],
	1:'<b>Replanifier</b>' +nl+sc[1]+'<b>Ctrl+R</b>'+nl+quit[1],
	2:'<b>Zaplanuj ponownie</b>' +nl+sc[2]+'<b>Ctrl+R</b>'+nl+quit[2],
	3:'<b>Herplannen</b>' +nl+sc[3]+'<b>Ctrl+R</b>'+nl+quit[3],
	4:'<b>Umplanen</b>' +nl+sc[4]+'<b>Ctrl+R</b>'+nl+quit[4],
	5:'<b>Repianificare</b>' +nl+sc[5]+'<b>Ctrl+R</b>'+nl+quit[5],
	6:'<b>Reprogramar</b>' +nl+sc[6]+'<b>Ctrl+R</b>'+nl+quit[6],
	7:'<b>Replanificar</b>' +nl+sc[7]+'<b>Ctrl+R</b>'+nl+quit[7],
	8:'<b>Ëmplanzen</b>' +nl+sc[8]+'<b>Ctrl+R</b>'+nl+quit[8]
};

C_XL.d['tip duplicate'] = { 
	0:'<b>Duplicate</b>' +nl+sc[0]+'<b>Ctrl+D</b>',
	1:'<b>Dupliquer</b>' +nl+sc[1]+'<b>Ctrl+D</b>',
	2:'<b>Replikować</b>' +nl+sc[2]+'<b>Ctrl+D</b>',
	3:'<b>Dupliceren</b>' +nl+sc[3]+'<b>Ctrl+D</b>',
	4:'<b>Duplizieren</b>' +nl+sc[4]+'<b>Ctrl+D</b>',
	5:'<b>Duplicare</b>' +nl+sc[5]+'<b>Ctrl+D</b>',
	6:'<b>Duplicar</b>' +nl+sc[6]+'<b>Ctrl+D</b>',
	7:'<b>Duplicar</b>' +nl+sc[7]+'<b>Ctrl+D</b>',
	8:'<b>Duebel maachen</b>' +nl+sc[8]+'<b>Ctrl+D</b>'
};

C_XL.d['tip duplicate esc'] = { 
	0:'<b>Duplicate</b>'+nl+quit[0],
	1:'<b>Dupliquer</b>'+nl+quit[1],
	2:'<b>Replikować</b>'+nl+quit[2],
	3:'<b>Dupliceren</b>'+nl+quit[3],
	4:'<b>Duplizieren</b>'+nl+quit[4],
	5:'<b>Duplicare</b>'+nl+quit[5],
	6:'<b>Duplicar</b>'+nl+quit[6],
	7:'<b>Duplicar</b>'+nl+quit[7],
	8:'<b>Duebel maachen</b>'+nl+quit[8]
};

C_XL.d['tip newnote'] = { 
	0:'<b>New note</b>',
	1:'<b>Nouvelle note</b>',
	2:'<b>New note</b>',
	3:'<b>Nieuwe nota</b>',
	4:'<b>New note</b>',
	5:'<b>New note</b>',
	6:'<b>Nueva nota</b>',
	7:'<b>New note</b>',
	8:'<b>Nei Notiz</b>'
};

C_XL.d['tip newtask'] = { 
	0:'<b>New task</b>',
	1:'<b>Nouvelle tâche</b>',
	2:'<b>New task</b>',
	3:'<b>Nieuwe taak</b>',
	4:'<b>New task</b>',
	5:'<b>New task</b>',
	6:'<b>Nueva tarea</b>',
	7:'<b>New task</b>',
	8:'<b>Nei Aufgab</b>'
};

C_XL.d['tip newchat'] = { 
	0:'<b>New chat</b>',
	1:'<b>Nouvelle conversation</b>',
	2:'<b>New chat</b>',
	3:'<b>Nieuwe chat</b>',
	4:'<b>New chat</b>',
	5:'<b>New chat</b>',
	6:'<b>Nueva conversación</b>',
	7:'<b>New chat</b>',
	8:'<b>Neie Chat</b>'
};

C_XL.d['tip plus visitor'] = { 
  0: '<b>Add a visitor file</b>',                 // English
  1: '<b>Créer une fiche de visitor</b>',        // Français
  2: '<b>Dodaj rekord visitor</b>',               // Polski
  3: '<b>Voeg een visitor-fiche toe</b>',      // Nederlands
  4: '<b>Fügen Sie eine visitor-Akte hinzu</b>', // Deutsch
  5: '<b>Aggiungi un fascicolo visitor</b>',      // Italiano
  6: '<b>Añadir expediente de visitor</b>',      // Español
  7: '<b>Adicionar arquivo de visitor</b>',      // Português
  8: '<b>Füügt e visitor-Dossier derbäi</b>'     // Lëtzebuergesch
};

C_XL.d['tip clear search'] = { 
	0:'<b>Clear settings</b>',
	1:'<b>Remettre à blanc</b>',
	2:'<b>Wyczyść ustawienia</b>',
	3:'<b>Wis instellingen</b>',
	4:'<b>Einstellungen zurücksetzen</b>',
	5:'<b>Cancellare configurazioni</b>',
	6:'<b>Borrar configuración</b>',
	7:'<b>Eliminar configurações</b>',
	8:'<b>Astellunge läschen</b>'
};

C_XL.d['tip full reset'] = {
  0: 'Reset the search assistant and return to today’s schedule.',        // English
  1: 'Remettre à blanc l\'assistant de recherche et retourner au planning du jour.', // Français
  2: 'Zresetuj asystenta wyszukiwania i wróć do harmonogramu na dziś.',    // Polski
  3: 'Reset de zoekassistent en ga terug naar de planning van vandaag.',  // Nederlands
  4: 'Suchassistent zurücksetzen und zum heutigen Zeitplan zurückkehren.', // Deutsch
  5: 'Ripristina completamente l’assistente di ricerca e torna al programma di oggi.', // Italiano
  6: 'Restablecer por completo el asistente de búsqueda y volver al plan del día.', // Español
  7: 'Reiniciar completamente o assistente de pesquisa e voltar ao planejamento do dia.', // Português
  8: 'Setz de Sichassistent zréck a gitt zeréck op de Dagplang vun haut.'     // Lëtzebuergesch
};
	
C_XL.d['help-tip-P_htype-details-button'] = {
  0: 'Click to set display preferences for the schedule labels for $rtype$ (timing, visitor name, service, ...).<hr/>Shift+Click to force this section to stay open while navigating with the search assistant.', // English
  1: 'Clic pour définir des préférences d\'affichage sur les étiquettes de planning pour les $rtype$ (timing, nom du visitor, prestation, ...).<hr/>Shift+Clic pour forcer cette section à rester ouverte pendant une navigation avec l\'assistant de recherche.', // Français
  2: 'Kliknij, aby ustawić preferencje wyświetlania etykiet harmonogramu dla $rtype$ (czas, nazwa visitor, usługa, …).<hr/>Shift+Kliknij, aby wymusić pozostanie tej sekcji otwartej podczas nawigacji z asystentem wyszukiwania.', // Polski
  3: 'Klik om weergavevoorkeuren in te stellen voor de planningslabels voor $rtype$ (tijden, naam van visitor, dienst, ...).<hr/>Shift+Klik om te forceren dat deze sectie open blijft tijdens navigatie met de zoekassistent.', // Nederlands
  4: 'Klicken, um Anzeigeeinstellungen für die Planetiketten für $rtype$ festzulegen (Zeit, Name des visitor, Leistung, …).<hr/>Shift+Klick, um diese Sektion beim Navigieren mit dem Suchassistenten geöffnet zu halten.', // Deutsch
  5: 'Clicca per impostare le preferenze di visualizzazione sulle etichette di pianificazione per $rtype$ (orario, nome di visitor, servizio, ...).<hr/>Shift+Clic per forzare questa sezione a rimanere aperta durante la navigazione con l\'assistente di ricerca.', // Italiano
  6: 'Haz clic para definir las preferencias de visualización de las etiquetas de planificación para $rtype$ (hora, nombre del visitor, servicio, ...).<hr/>Shift+clic para forzar que esta sección permanezca abierta durante la navegación con el asistente de búsqueda.', // Español
  7: 'Clique para definir preferências de exibição nos rótulos de planejamento para $rtype$ (horário, nome do visitor, serviço, ...).<hr/>Shift+clique para forçar que esta seção permaneça aberta durante a navegação com o assistente de pesquisa.', // Português
  8: 'Klick fir d’Affichage-Virléiften op de Plang-Labelen fir $rtype$ ze setzen (Zäit, Numm vum visitor, Service, ...).<hr/>Shift+Klick fir dës Sektioun während der Navigatioun mam Sichassistent oppe ze loossen.' // Lëtzebuergesch
};


C_XL.d['tip clear address'] = { 
    0: 'clear address fields.',                                     // english
    1: 'remettre à blancs les champs d\'adresse.',                   // french
    2: 'Wyczyść pola adresowe.',                                     // polish
    3: 'Maak de adresvelden leeg.',                                  // dutch
    4: 'Adressfelder löschen.',                                      // german
    5: 'Svuota i campi indirizzo.',                                  // italian
    6: 'Borra los campos de dirección.',                             // spanish
    7: 'Limpar os campos de endereço.',                              // portuguese
    8: 'Adressfelder eidel maachen.'                                 // luxembourgish
};


C_XL.d['click to display date'] = {
  0: 'Click to display the planning of this date:<br/>$hdate$.',                 // English
  1: 'Cliquez pour afficher le planning de cette date:<br/>$hdate$.',          // Français
  2: 'Kliknij, aby wyświetlić plan na ten dzień:<br/>$hdate$.',                 // Polski
  3: 'Klik om de planning voor deze datum weer te geven:<br/>$hdate$.',         // Nederlands
  4: 'Klicken, um die Planung für dieses Datum anzuzeigen:<br/>$hdate$.',       // Deutsch
  5: 'Clicca per visualizzare la pianificazione di questa data:<br/>$hdate$.',  // Italiano
  6: 'Haz clic para mostrar la planificación de esta fecha:<br/>$hdate$.',      // Español
  7: 'Clique para exibir o planejamento desta data:<br/>$hdate$.',              // Português
  8: 'Klick fir de Plang fir dësen Datum unzewisen:<br/>$hdate$.'               // Lëtzebuergesch
};


C_XL.d['birthday forecast'] = {
  0: 'next birthday on $weekday$',                                      // English
  1: 'anniversaire $weekday$ prochain',                               // Français
  2: 'następne urodziny w $weekday$',                                     // Polski
  3: 'volgende verjaardag op $weekday$',                              // Nederlands
  4: 'nächster Geburtstag am $weekday$',                                // Deutsch
  5: 'compleanno $weekday$ prossimo',                                 // Italiano
  6: 'cumpleaños el $weekday$ próximo',                                  // Español
  7: 'aniversário na próxima $weekday$',                                 // Português
  8: 'gebuertsdag $weekday$ nächsten'                                    // Lëtzebuergesch
};


C_XL.d['in x days']	= { 
	0:'$dtgo$ days ahead',	// english
	1:'dans $dtgo$ jours',	// french
	2:'za $dtgo$ dni',	// polish
	3:'over $dtgo$ dagen',	// dutch
	4:'in $dtgo$ Tagen',	// german
	5:'tra $dtgo$ giorni',	// italian
	6:'en $dtgo$ días', 	// spanish
	7:'em $dtgo$ dias',	// portuguese
	8:'an $dtgo$ Deeg'	// luxembourgish
};	


C_XL.d['pick up a file'] = { 
  0: 'pick up a file',                         // English
  1: 'sélectionner un fichier',                // Français
  2: 'wybierz plik',                           // Polski
  3: 'selecteer een bestand',                  // Nederlands
  4: 'eine Datei auswählen',                   // Deutsch
  5: 'seleziona un file',                      // Italiano
  6: 'seleccionar un archivo',                 // Español
  7: 'selecionar um arquivo',                  // Português
  8: 'eng Datei auswielen'                     // Lëtzebuergesch
};

C_XL.d['retrieve the file'] = { 
  0: 'retrieve the file',                      // English
  1: 'récupérer le fichier',                   // Français
  2: 'pobierz plik',                           // Polski
  3: 'haal het bestand op',                    // Nederlands
  4: 'die Datei abrufen',                      // Deutsch
  5: 'recupera il file',                       // Italiano
  6: 'recuperar el archivo',                   // Español
  7: 'recuperar o arquivo',                    // Português
  8: 'd\'Datei ophalen'                        // Lëtzebuergesch
};

C_XL.d['blueprint_files_iARRAY'] = { 
    0: "Shift + click to retrieve the file in one click.<br/>To rename it, change the note, or delete the file: a single click.",          // english
    1: "Shift + Clic pour récupérer le fichier en un clic.<br/>Pour renommer, changer la note, ou supprimer le fichier: Un simple clic.", // french
    2: "Shift + kliknięcie, aby pobrać plik jednym kliknięciem.<br/>Aby zmienić nazwę, edytować notatkę lub usunąć plik: wystarczy pojedyncze kliknięcie.", // polish
    3: "Shift + klik om het bestand met één klik op te halen.<br/>Om te hernoemen, de notitie te wijzigen of het bestand te verwijderen: een simpele klik.", // dutch
    4: "Shift + Klick, um die Datei mit einem Klick abzurufen.<br/>Um sie umzubenennen, die Notiz zu ändern oder die Datei zu löschen: ein einfacher Klick.", // german
    5: "Maiusc + clic per recuperare il file con un solo clic.<br/>Per rinominarlo, modificare la nota o eliminarlo: un solo clic.",           // italian
    6: "Mayús + clic para recuperar el archivo con un solo clic.<br/>Para renombrarlo, cambiar la nota o eliminar el archivo: un simple clic.", // spanish
    7: "Shift + clique para recuperar o arquivo com um único clique.<br/>Para renomeá-lo, alterar a nota ou excluir o arquivo: apenas um clique simples.", // portuguese
    8: "Shift + Klick fir d'Datei mat engem Klick zréckzelueden.<br/>Fir se ëmbenennen, d'Notiz z'änneren oder d'Datei ze läschen: e einfachen Klick." // luxembourgish
};

C_XL.d['blueprint_files_iARRAY_plus'] = { 
    0: "Click the $icon$ button to attach the first file to this $fileclass$.",          // english
    1: "Cliquez sur le bouton $icon$ pour joindre un premier fichier à ce $fileclass$.", // french
    2: "Kliknij przycisk $icon$, aby dołączyć pierwszy plik do tego $fileclass$.",         // polish
    3: "Klik op de knop $icon$ om het eerste bestand aan deze $fileclass$ toe te voegen.",// dutch
    4: "Klicken Sie auf die Schaltfläche $icon$, um die erste Datei an diese $fileclass$ anzuhängen.", // german
    5: "Fai clic sul pulsante $icon$ per allegare il primo file a questo $fileclass$.",   // italian
    6: "Haz clic en el botón $icon$ para adjuntar un primer archivo a este $fileclass$.", // spanish
    7: "Clique no botão $icon$ para anexar o primeiro arquivo a este $fileclass$.",      // portuguese
    8: "Klick op de Knäppchen $icon$, fir déi éischt Datei un dëse $fileclass$ ze addéieren." // luxembourgish
};


var bs = '&nbsp;[<span class="fa fa-13x fa-long-arrow-left"></span>]'; // !! No translation on this line

	
C_XL.d['tip delete'] = { 
	0:'<b>Delete</b>' +nl+sc[0]+'<b>Ctrl+Backspace'+bs+'</b>',
	1:'<b>Supprimer</b>' +nl+sc[1]+'<b>Ctrl+Backspace'+bs+'</b>',
	2:'<b>Skasuj</b>' +nl+sc[2]+'<b>Ctrl+Backspace'+bs+'</b>',
	3:'<b>Verwijderen</b>' +nl+sc[3]+'<b>Ctrl+Backspace'+bs+'</b>',
	4:'<b>Löschen</b>' +nl+sc[4]+'<b>Ctrl+Backspace'+bs+'</b>',
	5:'<b>Sopprimere</b>' +nl+sc[5]+'<b>Ctrl+Backspace'+bs+'</b>',
	6:'<b>Borrar</b>' +nl+sc[6]+'<b>Ctrl+Backspace'+bs+'</b>',
	7:'<b>Eliminar</b>' +nl+sc[7]+'<b>Ctrl+Backspace'+bs+'</b>',
	8:'<b>Läschen</b>' +nl+sc[8]+'<b>Ctrl+Backspace'+bs+'</b>'
};

C_XL.d['tip save'] = { 
	0:'<b>Save</b>' +nl+sc[0]+'<b>Ctrl+s</b>',
	1:'<b>Enregistrer</b>' +nl+sc[1]+'<b>Ctrl+s</b>',
	2:'<b>Zaoszczędzić</b>' +nl+sc[2]+'<b>Ctrl+s</b>',
	3:'<b>Opslaan</b>' +nl+sc[3]+'<b>Ctrl+s</b>',
	4:'<b>Speichern</b>' +nl+sc[4]+'<b>Ctrl+s</b>',
	5:'<b>Salvare</b>' +nl+sc[5]+'<b>Ctrl+s</b>',
	6:'<b>Guardar</b>' +nl+sc[6]+'<b>Ctrl+s</b>',
	7:'<b>Salvaguardar</b>' +nl+sc[7]+'<b>Ctrl+s</b>',
	8:'<b>Späicheren</b>' +nl+sc[8]+'<b>Ctrl+s</b>'
};

C_XL.d['tip quit'] = { 
	0:'<b>Close and cancel changes</b>' +nl+sc[0]+'<b>Ctrl+q</b>',
	1:'<b>Quitter sans rien enregistrer</b>' +nl+sc[1]+'<b>Ctrl+q</b>',
	2:'<b>Zamknij i anuluj wymiana</b>' +nl+sc[2]+'<b>Ctrl+q</b>',
	3:'<b>Sluiten en annuleren uitwisseling</b>' +nl+sc[3]+'<b>Ctrl+q</b>',
	4:'<b>Schließen ohne Änderungen zu speichern</b>' +nl+sc[4]+'<b>Ctrl+q</b>',
	5:'<b>Lasciare senza salvare</b>' +nl+sc[5]+'<b>Ctrl+q</b>',
	6:'<b>Salir sin guardar</b>' +nl+sc[6]+'<b>Ctrl+q</b>',
	7:'<b>Sair sem salvaguardar</b>' +nl+sc[7]+'<b>Ctrl+q</b>',
	8:'<b>Zoumaachen an Ännerungen annuléieren</b>' +nl+sc[8]+'<b>Ctrl+q</b>'
};

C_XL.d['tip acc duplicate'] = { 
	0:'<b>Duplicate this account</b>',
	1:'<b>Dupliquer ce compte</b>',
	2:'<b>Duplicate this account</b>',
	3:'<b>Duplicate this account</b>',
	4:'<b>Duplicate this account</b>',
	5:'<b>Duplicate this account</b>',
	6:'<b>Duplicar esta cuenta</b>',
	7:'<b>Duplicate this account</b>',
	8:'<b>Duebelt dëse Kont</b>'
};

C_XL.d['tip chatquit'] = { 
	0:'Quit conversation' +nl+sc[0]+'<b>Ctrl+x</b>',
	1:'Sortir de la conversation' +nl+sc[1]+'<b>Ctrl+x</b>',
	2:'Zakończ rozmowę' +nl+sc[2]+'<b>Ctrl+x</b>',
	3:'Gesprek verlaten' +nl+sc[3]+'<b>Ctrl+x</b>',
	4:'Unterhaltung verlassen' +nl+sc[4]+'<b>Ctrl+x</b>',
	5:'Lasciare la conversazione' +nl+sc[5]+'<b>Ctrl+x</b>',
	6:'Salir de la conversación' +nl+sc[6]+'<b>Ctrl+x</b>',
	7:'Sair da conversa' +nl+sc[7]+'<b>Ctrl+x</b>',
	8:'Gespréich verloossen' +nl+sc[8]+'<b>Ctrl+x</b>'
};

C_XL.d['smapp warn chatquit'] = { 
	0:'Quit conversation ?',
	1:'Sortir de la conversation ?',
	2:'Zakończ rozmowę ?',
	3:'Gesprek verlaten ?',
	4:'Unterhaltung verlassen ?',
	5:'Lasciare la conversazione ?',
	6:'Salir de la conversación ?',
	7:'Sair da conversa ?',
	8:'Gespréich verloossen ?'
};

C_XL.d['tip chat archive'] = { 
	0:'archive for all participants' +nl+sc[0]+'<b>Ctrl+Shift+A</b>',
	1:'Sortir tous les participants et archiver' +nl+sc[1]+'<b>Ctrl+Shift+A</b>',
	2:'Usuń wszystkich uczestników i zarchiwizuj' +nl+sc[2]+'<b>Ctrl+Shift+A</b>',
	3:'Schakel alle deelnemers uit en archiveer' +nl+sc[3]+'<b>Ctrl+Shift+A</b>',
	4:'Nehmen Sie alle Teilnehmer heraus und archivieren Sie' +nl+sc[4]+'<b>Ctrl+Shift+A</b>',
	5:'Elimina tutti i partecipanti e l\'archivio' +nl+sc[5]+'<b>Ctrl+Shift+A</b>',
	6:'Sacar a todos los participantes y archivar.' +nl+sc[6]+'<b>Ctrl+Shift+A</b>',
	7:'Retire todos os participantes e arquive' +nl+sc[7]+'<b>Ctrl+Shift+A</b>',
	8:'Archiv fir all Participanten' +nl+sc[8]+'<b>Ctrl+Shift+A</b>'
};

C_XL.d['smapp warn chat archive'] = { 
	0:'archive for all participants ?',
	1:'Sortir tous les participants et archiver ?',
	2:'Usuń wszystkich uczestników i zarchiwizuj ?',
	3:'Schakel alle deelnemers uit en archiveer ?',
	4:'Nehmen Sie alle Teilnehmer heraus und archivieren Sie ?',
	5:'Elimina tutti i partecipanti e l\'archivio ?',
	6:'Sacar a todos los participantes y archivar ?',
	7:'Retire todos os participantes e arquive ?',
	8:'Archiv fir all Participanten ?'
};


C_XL.d['tip send phylac'] = { 
	0:'Send your message' +nl+sc[0]+'<b>Shift+[ENTER]</b>',
	1:'Envoyer le message' +nl+sc[1]+'<b>Shift+[ENTER]</b>',
	2:'Wyślij wiadomość' +nl+sc[2]+'<b>Shift+[ENTER]</b>',
	3:'Stuur uw bericht' +nl+sc[3]+'<b>Shift+[ENTER]</b>',
	4:'Senden Sie Ihre Nachricht' +nl+sc[4]+'<b>Shift+[ENTER]</b>',
	5:'Invia il tuo messaggio' +nl+sc[5]+'<b>Shift+[ENTER]</b>',
	6:'Envía tu mensaje' +nl+sc[6]+'<b>Shift+[ENTER]</b>',
	7:'Envie sua mensagem' +nl+sc[7]+'<b>Shift+[ENTER]</b>',
	8:'Schéckt Är Noriicht' +nl+sc[8]+'<b>Shift+[ENTER]</b>'
};

C_XL.d['tip to clipboard'] = { 
	0:'Copy the conversation to cliboard' +nl+sc[0]+'<b>Ctrl+C</b>',
	1:'Copier la conversation vers le presse papier' +nl+sc[1]+'<b>Ctrl+C</b>',
	2:'Skopiuj rozmowę do schowka' +nl+sc[2]+'<b>Ctrl+C</b>',
	3:'Kopieer het gesprek naar het klembord' +nl+sc[3]+'<b>Ctrl+C</b>',
	4:'Kopieren Sie die Konversation in die Zwischenablage' +nl+sc[4]+'<b>Ctrl+C</b>',
	5:'Copia la conversazione negli appunti' +nl+sc[5]+'<b>Ctrl+C</b>',
	6:'Copia la conversación al portapapeles' +nl+sc[6]+'<b>Ctrl+C</b>',
	7:'Copie a conversa para a área de transferência' +nl+sc[7]+'<b>Ctrl+C</b>',
	8:'Kopéiert d\'Konversatioun an de Clipboard' +nl+sc[8]+'<b>Ctrl+C</b>'
};

C_XL.d['tip catalyst header'] = { 
	0:'click to sort on this column, click again to reverse the sort order, drag and drop left or right to arrange columns order, long press to choose what columns should appear on the report',
	1:'cliquez pour trier sur cette colonne, cliquez à nouveau pour inverser l\'ordre de tri, faites glisser et déposez vers la gauche ou la droite pour organiser l\'ordre des colonnes, appuyez longuement pour choisir quelles colonnes doivent apparaître sur le rapport',
	2:'kliknij, aby posortować według tej kolumny, kliknij ponownie, aby odwrócić kolejność sortowania, przeciągnij i upuść w lewo lub w prawo, aby uporządkować kolejność kolumn, naciśnij długo, aby wybrać, które kolumny mają pojawić się w raporcie',
	3:'klik om op deze kolom te sorteren, klik nogmaals om de sorteervolgorde om te keren, sleep naar links of rechts om de volgorde van de kolommen te bepalen, druk lang om te kiezen welke kolommen in het rapport moeten verschijnen',
	4:'Klicken Sie, um diese Spalte zu sortieren, klicken Sie erneut, um die Sortierreihenfolge umzukehren, ziehen Sie die Spalte nach links oder rechts und legen Sie sie ab, um die Spaltenreihenfolge zu ändern. Drücken Sie lange, um auszuwählen, welche Spalten im Bericht angezeigt werden sollen',
	5:'fare clic per ordinare in questa colonna, fare nuovamente clic per invertire l\'ordinamento, trascinare e rilasciare a sinistra o a destra per organizzare l\'ordine delle colonne, premere a lungo per scegliere quali colonne devono apparire nel report',
	6:'haga clic para ordenar esta columna, haga clic nuevamente para invertir el orden de clasificación, arrastre y suelte hacia la izquierda o hacia la derecha para organizar el orden de las columnas, mantenga presionada para elegir qué columnas deben aparecer en el informe',
	7:'clique para classificar nesta coluna, clique novamente para reverter a ordem de classificação, arraste e solte para a esquerda ou direita para organizar a ordem das colunas, pressione e segure para escolher quais colunas devem aparecer no relatório',
	8:'Klickt fir dës Kolonn ze sortéieren, klickt nach eng Kéier fir d\'Sortéieruerdnung ëmzewandelen, zitt a drop no lénks oder riets fir d\'Kolonnuerdnung ze arrangéieren, dréckt laang fir ze wielen, wéi eng Kolonnen am Bericht erschéngen sollen'
};

C_XL.d['status'] = { 0:'Status', 1:'Statut', 2:'Stan', 3:'Staat', 4:'Status', 5:'Status', 6:'Estado', 7:'Estado', 8:'Status' };
C_XL.d['color'] = { 0:'color', 1:'couleur', 2:'kolor', 3:'kleur', 4:'Farbe', 5:'colore', 6:'color', 7:'cor', 8:'faarf' };
C_XL.d['colors'] = { 0:'Colors', 1:'Couleurs', 2:'kolorów', 3:'Kleuren', 4:'Farben', 5:'Colori', 6:'Colores', 7:'Cores', 8:'Faarwen' };
C_XL.d['pattern'] = { 0:'pattern', 1:'motif', 2:'wzorzec', 3:'patroon', 4:'Motiv', 5:'motivo', 6:'motivo', 7:'motivo', 8:'muster' };
C_XL.d['patterns'] = { 0:'Patterns', 1:'Motifs', 2:'Wzory', 3:'Patronen', 4:'Motive', 5:'Motivi', 6:'Motivos', 7:'Motivos', 8:'Muster' };
C_XL.d['tag'] = { 0:'tag', 1:'tag', 2:'tag', 3:'tag', 4:'tag', 5:'tag', 6:'tag', 7:'tag', 8:'tag' };
C_XL.d['tags'] = { 0:'Tags', 1:'Tags', 2:'Tags', 3:'Tags', 4:'Tags', 5:'Tags', 6:'Tags', 7:'Tags', 8:'Tags' };
C_XL.d['skins'] = { 0:'Skins', 1:'Thèmes', 2:'Tematy', 3:'Thema\'s', 4:'Thema', 5:'Temi', 6:'Temas', 7:'Temas', 8:'Skins' };

C_XL.d['color off'] = { 0:'Unavailable', 1:'Indisponible', 2:'Zajęty/a', 3:'onbeschikbaar', 4:'Nicht verfügbar', 5:'Indisponibile', 6:'No disponible', 7:'Indisponível', 8:'Net verfügbar' };
C_XL.d['color excp'] = { 0:'Exceptionaly', 1:'Exceptionnellement', 2:'Wyjątkowo/a', 3:'Uitzonderlijk', 4:'außerordentlich', 5:'Eccezionalmente', 6:'Excepcionalmente', 7:'Excecionalmente', 8:'Aussergewéinlech' };
C_XL.d['color absent'] = { 0:'Closed', 1:'Fermé', 2:'Zamknięty', 3:'Gesloten', 4:'Geschlossen', 5:'Chiuso', 6:'Cerrado', 7:'Fechado', 8:'Zou' };
C_XL.d['color closed'] = { 0:'Closed', 1:'Fermé', 2:'Zamknięty', 3:'Gesloten', 4:'Geschlossen', 5:'Chiuso', 6:'Cerrado', 7:'Fechado', 8:'Zou' };

	// validation messages
	
C_XL.d['field ok']			= { 0:' ok', 1:' ok', 2:' ok', 3:' ok',	4:' ok', 5:' ok', 6:' ok', 7:' ok', 8:' ok'	};


// 		technical 				english:0,								french:1,									polish:2,										dutch:3,												german:4,															italian:5,											spanish:6,												portuguese:7, 	luxembourgish:8
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

C_XL.d['bad pass'] = { 
    0:'invalid password, please read from the blueprint for help',
    1:'mot de pass non valide, svp aidez vous à l\'aide du texte en bleu',
    2:'nieprawidłowe hasło, przeczytaj plan, aby uzyskać pomoc',
    3:'ongeldig wachtwoord, Lees aub de blauwdruk voor hulp',
    4:'Ungültiges Passwort, bitte lesen Sie den Blueprint, um Hilfe zu erhalten',
    5:'password non valida, leggere il progetto per assistenza',
    6:'contraseña no válida, lea el plano para obtener ayuda',
    7:'senha inválida, leia o modelo para obter ajuda',
    8:'Ongëltegt Passwuert, liest w.e.g. den Blueprint fir Hëllef' 
};

	
	
// 	english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7, 	luxembourgish:8
C_XL.d['tip connect synchro'] = { 
    0:'open the specifications for this API',
    1:'ouvrir les spécifications de cette API',
    2:'otwórz specyfikacje tego interfejsu API',
    3:'open de specificaties voor deze api',
    4:'Öffnen Sie die Spezifikationen für diese API',
    5:'apri le specifiche per questa API',
    6:'abra las especificaciones para esta api',
    7:'abra as especificações desta API',
    8:'opmaachen d\'Spezifikatioune vun dëser API' 
};

C_XL.d['tip connect eresa'] = { 
    0:'open this webpage:',
    1:'ouvrir cette page web:',
    2:'otwórz tę stronę:',
    3:'open deze webpagina:',
    4:'öffne diese Webseite:',
    5:'apri questa pagina web:',
    6:'abre esta pagina web:',
    7:'abra esta página da web:',
    8:'maacht dës Websäit op:' 
};

C_XL.d['tip connect login'] = { 
    0:'open a session on this device for this user',
    1:'ouvrir une session sur cet appareil pour cet utilisateur',
    2:'otwórz sesję na tym urządzeniu dla tego użytkownika',
    3:'open een sessie op dit apparaat voor deze gebruiker',
    4:'Öffnen Sie für diesen Benutzer eine Sitzung auf diesem Gerät',
    5:'aprire una sessione su questo dispositivo per questo utente',
    6:'Abra una sesión en este dispositivo para este(a) usuario.',
    7:'abra uma sessão neste dispositivo para este usuário',
    8:'maacht eng Sessioun op dësem Apparat fir dëse Benotzer op' 
};

C_XL.d['no twins'] = { 
    0:' confirmation must repeat password',
    1:' confirmation doit être identique au mot de passe',
    2:' Potwierdzenie musi być identyczne z hasłem',
    3:' bevestiging moet gelijk zijn aan passwoord',
    4:' Die Bestätigung muss mit dem Passwort übereinstimmen',
    5:' la conferma deve essere identica al password',
    6:' la confirmación tiene que ser idéntica a la contraseña',
    7:' a confirmação deve ser idêntica à palavra-passe',
    8:' d\'Bestätegung muss mam Passwuert identesch sinn' 
};

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

C_XL.d['delete confirm'] = { 
    0:'are you sure you want to delete ?',
    1:'Etes-vous certain de vouloir supprimer ?',
    2:'Czy na pewno chcesz usunąć ?',
    3:'Bent U zeker van te willen schrappen ?',
    4:'Sind Sie sicher, dass Sie löschen möchten?',
    5:'È sicuro di volere sopprimere ?',
    6:'Está seguro de querer borrar ?',
    7:'Tem a certeza de que deseja apagar?',
    8:'Sidd Dir sécher datt Dir wëllt läschen?' 
};

C_XL.d['delete confirm event'] = { 
    0:'please confirm the deletion of this time reservation',
    1:'veuillez confirmer la suppression de cette réservation de temps',
    2:'prosimy o potwierdzenie usunięcia tej rezerwacji czasu',
    3:'gelieve de verwijdering van deze tijdreservering te bevestigen',
    4:'Bitte bestätigen Sie die Löschung dieser Zeitreservierung',
    5:'si prega di confermare l\'eliminazione di questa prenotazione oraria',
    6:'por favor confirme la eliminación de esta reserva de tiempo',
    7:'por favor confirme a exclusão desta reserva de horário',
    8:'confirméiert w.e.g. d\'Läsche vun dëser Zäitreservéierung' 
};

C_XL.d['delete confirm appointment'] = { 
    0:'please confirm the deletion of this appointment',
    1:'veuillez confirmer la suppression de ce rendez-vous',
    2:'proszę o potwierdzenie usunięcia tego spotkania',
    3:'gelieve de verwijdering van deze afspraak te bevestigen',
    4:'Bitte bestätigen Sie die Löschung dieses Termins',
    5:'si prega di confermare l\'eliminazione di questo appuntamento',
    6:'por favor confirme la eliminación de esta cita',
    7:'por favor confirme a exclusão deste compromisso',
    8:'confirméiert w.e.g. d\'Läsche vun dësem Rendez-vous' 
};
								
								
	// Adding translations in Luxembourgish (Lux) as item 8:

C_XL.d['delete all confirm'] = { 
    0:'are you sure you want to delete <b>all</b> items?',
    1:'Etes-vous certain de vouloir <b>tous</b> les supprimer ?',
    2:'Czy na pewno chcesz usunąć <b>wszystkie przedmioty</b> ?',
    3:'Bent u zeker dat u ze <b>allemaal</b> wilt verwijderen ?',
    4:'Sind Sie sicher, dass Sie <b>alles</b> löschen möchten?',
    5:'È sicuro di volere <b>tous</b> sopprimerli ?',
    6:'Está seguro de querer <b>todos</b> borrarlos ?',
    7:'Tem a certeza de que deseja <b>apagar</b> todos?',
    8:'Sidd Dir sécher datt Dir all wëllt läschen?' 
};

C_XL.d['delete visitor'] = { 
    0:'Remove this visitor?',
    1:'Supprimer ce visiteur?',
    2:'Usunąć?',
    3:'Bent U zeker van te willen schrappen?',
    4:'Diesen Besucher entfernen?',
    5:'Eliminare questo visitatore',
    6:'Borrar este visitante?',
    7:'apagar este visitante?',
    8:'Dëse Visiteur ewechhuelen?' 
};

C_XL.d['delete resa'] = { 
    0:'are you sure you want to delete this reservation ?',
    1:'Êtes vous certain de vouloir effacer cette réservation ?',
    2:'Czy na pewno chcesz usunąć tę rezerwację ?',
    3:'Wilt u zeker deze reservering schrappen ?',
    4:'Sind Sie sicher, dass Sie diese Reservierung löschen möchten?',
    5:'È sicuro di volere sopprimere questa prenotazione ?',
    6:'Está seguro de querer borrar esta reserva ?',
    7:'Tem a certeza de que deseja apagar esta reserva?',
    8:'Sidd Dir sécher datt Dir dës Reservéierung wëllt läschen?' 
};

C_XL.d['delete blueprint'] = { 
    0:'(You can always view and recover deleted items using the keyboard shortcut Ctrl + D while navigating your agenda)',
    1:'(Vous pourrez toujours voir et récupérer les éléments effacés, au moyen du raccourci clavier Ctrl + D lorsque vous naviguez votre agenda)',
    2:'(Zawsze możesz zobaczyć i odzyskać usunięte elementy, używając skrótu klawiszowego Ctrl + D podczas przeglądania swojego kalendarza)',
    3:'(Je kunt altijd verwijderde items bekijken en terughalen met de sneltoets Ctrl + D wanneer je door je agenda bladert)',
    4:'(Sie können gelöschte Elemente jederzeit anzeigen und wiederherstellen, indem Sie die Tastenkombination Strg + D verwenden, während Sie Ihren Kalender durchsuchen)',
    5:'(È sempre possibile visualizzare e recuperare gli elementi eliminati utilizzando la scorciatoia da tastiera Ctrl + D durante la navigazione nel calendario)',
    6:'(Siempre puedes ver y recuperar los elementos eliminados con el atajo de teclado Ctrl + D mientras navegas por tu agenda)',
    7:'(Você sempre pode ver e recuperar os itens excluídos usando o atalho de teclado Ctrl + D ao navegar na sua agenda)',
    8:'(Dir kënnt ëmmer geläschte Saachen ukucken an erëmfannen, andeems Dir d\'Tastaturkierzel Ctrl + D benotzt wärend Dir Ären Agenda navigéiert)' 
};

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

C_XL.d['upload failed'] = { 
    0:'The file could not be uploaded, check your internet connection first, then please try again.',
    1:'Le fichier n\'a pu être transféré, vérifiez votre connexion Internet, puis s\'il vous plaît essayer à nouveau.',
    2:'Plik nie może być przesłane, sprawdź połączenie internetowe, następnie spróbuj ponownie.',
    3:'Het bestand kan niet worden geüpload, controleer dan eerst uw internetverbinding, dan kunt u het opnieuw proberen.',
    4:'Die Datei konnte nicht hochgeladen werden, bitte überprüfen Sie Ihre internetverbinding und versuchen Sie es erneut',
    5:'Il file non ha potuto essere caricato, controlli la Sua connessione Internet e provi di nuovo per favore',
    6:'El fichero no se ha podido cargar, verifique su conexión a internet e inténtelo de nuevo por favor.',
    7:'O ficheiro não pode ser transferido. Verifique a sua ligação à Internet e tente novamente, por favor.',
    8:'De Fichier konnt net eropgeluede ginn, kontrolléiert w.e.g. Är Internetverbindung a probéiert nach eng Kéier' 
};

C_XL.d['reserved login'] = { 
    0:'Login already reserved',
    1:'Login déjà réservé',
    2:'Zarezerwowany identyfikator',
    3:'Login al in gebruik',
    4:'Kontoname bereits vergeben',
    5:'Login già prenotato',
    6:'Login ya reservado',
    7:'Início de sessão já reservado',
    8:'Login scho reservéiert' 
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

C_XL.d['no search result'] = { 
    0:'This search brings no result',
    1:'Cette recherche ne ramène aucun résultat',
    2:'Brak wyników wyszukiwania',
    3:'Die opzoeking brengt geen resultaat',
    4:'Diese Suche bringt keine Ergebnisse',
    5:'Questa ricerca non da nessun risultato',
    6:'Esta búsqueda no da resultados',
    7:'Esta pesquisa não obteve nenhum resultado',
    8:'Dës Sich gëtt keen Resultat' 
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

C_XL.d['sms-templateId'] 	= { 0:'Name',		1:'Nom',		2:'Nazwa',		3:'Naam',			4:'Name',	5:'Cognome',	6:'apellido', 7:'apelido', 8:'Numm'		};

C_XL.d['sms-r1handled'] 	= { 0:'R1<br/>Sent',		1:'R1<br/>Envoyé',	2:'R1<br/>Wysłany',		3:'R1<br/>Verzonden',	4:'Gesendet',	5:'R1<br/>Inviato',		6:'R1<br/>Enviado', 	7:'R1<br/>Enviado', 	8:'R1<br/>Geschéckt'	};
C_XL.d['sms-r1delivered'] 	= { 0:'R1<br/>Delivered',	1:'R1<br/>Reçu',	2:'R1<br/>Otrzymał',	3:'R1<br/>Afgeleverd',	4:'Empfangen',	5:'R1<br/>Ricevuto',	6:'R1<br/>Recibido', 	7:'R1<br/>Recebido', 	8:'R1<br/>Zougestallt'	};
C_XL.d['sms-r1pending'] 	= { 0:'R1<br/>Pending',		1:'R1<br/>Attente',	2:'R1<br/>W kolejce',	3:'R1<br/>Wachtrij',	4:'ausstehend',	5:'R1<br/>In attesa',	6:'R1<br/>En espera', 	7:'R1<br/>Em espera', 	8:'R1<br/>An der Waard'	};
C_XL.d['sms-r1error'] 		= { 0:'R1<br/>Error',		1:'R1<br/>Erreur',	2:'R1<br/>Błąd',		3:'R1<br/>Fout',		4:'Fehler',		5:'R1<br/>Errore',		6:'R1<br/>Error', 		7:'R1<br/>Erro', 		8:'R1<br/>Feeler'	};
C_XL.d['sms-r1nofeedback'] 	= { 0:'R1<br/>Lost',		1:'R1<br/>Perdu',	2:'R1<br/>Stracony',	3:'R1<br/>Verloren',	4:'Verloren',	5:'R1<br/>Perso',		6:'R1<br/>Perdido', 	7:'R1<br/>Perdido', 	8:'R1<br/>Verluer'	};

C_XL.d['sms-r2handled'] 	= { 0:'R2<br/>Sent',		1:'R2<br/>Envoyé',	2:'R2<br/>Wysłany',		3:'R2<br/>Verzonden',	4:'Gesendet',	5:'R2<br/>Inviato',		6:'R2<br/>Enviado', 	7:'R2<br/>Enviado', 	8:'R2<br/>Geschéckt'	};
C_XL.d['sms-r2delivered'] 	= { 0:'R2<br/>Delivered',	1:'R2<br/>Reçu',	2:'R2<br/>Otrzymał',	3:'R2<br/>Afgeleverd',	4:'Empfangen',	5:'R2<br/>Ricevuto',	6:'R1<br/>Recibido', 	7:'R2<br/>Recebido', 	8:'R2<br/>Zougestallt'	};
C_XL.d['sms-r2pending'] 	= { 0:'R2<br/>Pending',		1:'R2<br/>Attente',	2:'R2<br/>W kolejce',	3:'R2<br/>Wachtrij',	4:'ausstehend',	5:'R2<br/>In attesa',	6:'R1<br/>En espera', 	7:'R2<br/>Em espera', 	8:'R2<br/>An der Waard'	};
C_XL.d['sms-r2error'] 		= { 0:'R2<br/>Error',		1:'R2<br/>Erreur',	2:'R2<br/>Błąd',		3:'R2<br/>Fout',		4:'Fehler',		5:'R2<br/>Errore',		6:'R1<br/>Error', 		7:'R2<br/>Erro', 		8:'R2<br/>Feeler'	};
C_XL.d['sms-r2nofeedback'] 	= { 0:'R2<br/>Lost',		1:'R2<br/>Perdu',	2:'R2<br/>Stracony',	3:'R2<br/>Verloren',	4:'Verloren',	5:'R2<br/>Perso',		6:'R1<br/>Perdido', 	7:'R2<br/>Perdido', 	8:'R2<br/>Verluer'	};

C_XL.d['sms'] 				= { 0:'SMS',		1:'SMS',			2:'SMS',			3:'SMS',			4:'SMS',			5:'SMS',				6:'SMS', 				7:'SMS', 			8:'SMS'				};
C_XL.d['sms status']		= { 0:'SMS status',	1:'Statut du SMS',	2:'Stan SMS',		3:'SMS status',		4:'SMS Status',		5:'Status del SMS',		6:'Estado del SMS', 	7:'Estado do SMS', 	8:'SMS Status'	};
C_XL.d['sms_nomobile']		= { 0:'No mobile',	1:'Pas de GSM',		2:'Nie mobile',		3:'Geen GSM',		4:'Keine SMS',		5:'Nessun cellulare',	6:'Ningún móvil', 		7:'Sem GSM', 		8:'Keng SMS'			};
C_XL.d['sms_outdated']		= { 0:'Outdated',	1:'Obsolète',		2:'Przestarzały',	3:'verouderd',		4:'abgelaufen',		5:'Obsoleto',			6:'Obsoleto', 			7:'Obsoleto', 		8:'Verfall'		};
C_XL.d['sms_nosms']			= { 0:'No SMS',		1:'Pas de SMS',		2:'Brak SMS-ów',	3:'Geen SMS',		4:'Keine SMS',		5:'Nessun SMS',			6:'Ningún SMS', 		7:'Sem SMS', 		8:'Keng SMS'			};
C_XL.d['sms_error']			= { 0:'Error',		1:'Erreur',			2:'Error',			3:'Fout',			4:'Fehler',			5:'Errore',				6:'Error', 				7:'Erro', 			8:'Feeler'			};
C_XL.d['sms_dead_numb']		= { 0:'Unassigned',	1:'Non attribué',	2:'Nieprzypisany',	3:'Niet toegewezen',4:'Nicht belegt',	5:'Non assegnato',		6:'No asignado', 		7:'Não atribuído', 	8:'Net zougewisen'	};
C_XL.d['sms_handled']		= { 0:'Handed over',1:'Transmis',		2:'Przekazany',		3:'Uitgezonden',	4:'Übertragen',		5:'Inviato',			6:'Enviado', 			7:'Enviado', 		8:'Iwwerginn'			};
C_XL.d['sms_pending']		= { 0:'Pending',	1:'En attente',		2:'Oczekujący',		3:'Hangt',			4:'ausstehend',		5:'In attesa',			6:'En espera', 			7:'Em espera', 		8:'Am Gaangen'		};
C_XL.d['sms_delivered']		= { 0:'Delivered',	1:'Délivré',		2:'Dostarczony',	3:'afgeleverd',		4:'Zugestellt',		5:'Consegnato',			6:'Entregado', 			7:'Entregue', 		8:'Zougestallt'		};
C_XL.d['sms_discarded']		= { 0:'Discarded',	1:'Détruit',		2:'Usunięty',		3:'Geschrapt',		4:'Verworfen',		5:'Distrutto',			6:'Destruido', 			7:'Destruído', 		8:'Ewechgehäit'		};
C_XL.d['sms_retained']		= { 0:'Retained',	1:'Retenu',			2:'Zachowany',		3:'Gehouden',		4:'Zurückgehalten',	5:'Conservato',			6:'Conservado', 		7:'Retido', 		8:'Gespaart'			};

C_XL.d['sms_created']		= { 0:'Ready',		1:'Préparé',		2:'Gotowy',			3:'Gepland',		4:'Bereit',			5:'Pronto',				6:'Listo', 				7:'Preparado', 		8:'Bereet'	};
C_XL.d['sms_retry']			= C_XL.d['ready']; 	// !! No translation on this line
C_XL.d['sms_disabled']		= C_XL.d['disabled']; 	// !! No translation on this line

C_XL.d['sms_iso']			= { 0:'Destination = agenda - cancelled',	
								1:'Destinataire = agenda - impossible',	
								2:'adresat = lista adresów - błąd',		
								3:'Ontvanger = agenda - geschrapt',	               
								4:'Empfänger = Kalender - storniert',	
								5:'Destinatario = agenda - impossibile',
								6:'Spanish',
								7:'Destinatário = calendário - impossível',
								8:'Destinatioun = Agenda - ofgesot'
								};
								
C_XL.d['sms_nofeedback']	= { 0:'No feedback',	1:'Sans statut',	2:'Nie opinie',			3:'Geen feedback',		4:'Kein Feedback',	5:'Nessun feedback',	6:'Ningún feedback', 	7:'Nenhum feedback', 	8:'Kee Feedback'	};
C_XL.d['sms_notsent']		= { 0:'Not sent',		1:'Pas envoyé',		2:'Nie są przesyłane',	3:'Niet verzonden',		4:'Nicht gesendet',	5:'Non inviato',		6:'No enviado', 		7:'Não enviado', 		8:'Net geschéckt'	};

// C_dS_smsCounters.catalyst

C_XL.d['sms-date']			= { 0:'Date',		1:'Date',		2:'Date',		3:'Datum',			4:'Datum',			5:'Data',	6:'Fecha', 		7:'Data', 		8:'Datum'	};
C_XL.d['sms-msgs']			= { 0:'Msgs',		1:'Msgs',		2:'Msgs',		3:'Berichtjes',		4:'Nachrichten',	5:'Msg',	6:'Mensajes', 	7:'Msgs', 		8:'Msgs'	};
C_XL.d['sms-pages']			= { 0:'Pages',		1:'Pages',		2:'Pages',		3:'Paginas',		4:'Seiten',			5:'Pagine',	6:'Páginas', 	7:'Páginas', 	8:'Säiten'	};

	// this is used by C_catalyst, so the technical names like 'sms-delivered' is built from sms-<the dataset fieldname>
C_XL.d['sms-name']			= C_XL.d['sms-templateId']; 	// !! No translation on this line
C_XL.d['sms-handled']		= C_XL.d['sms_handled'];  	// !! No translation on this line
C_XL.d['sms-error']			= C_XL.d['sms_error'];  	// !! No translation on this line
C_XL.d['sms-pending']		= C_XL.d['sms_pending'];  	// !! No translation on this line
C_XL.d['sms-delivered']		= C_XL.d['sms_delivered'];  // !! No translation on this line
C_XL.d['sms-discarded']		= C_XL.d['sms_discarded'];  // !! No translation on this line
C_XL.d['sms-dead-numb']		= C_XL.d['sms_dead_numb'];  // !! No translation on this line


// EMAIL status display

C_XL.d['email status']		= { 0:'email status',	1:'Statut de l\'email',	2:'Stan email',		3:'email status',	4:'Email Status',	5:'Status del email',	6:'Estado del e-mail', 	7:'Estado do e-mail', 	8:'E-Mail Status'	};
C_XL.d['eml_no_email']		= { 0:'No address',		1:'Pas d\'adresse',		2:'Brak adresu',	3:'Geen adres',		4:'Keine Adresse',	5:'Nessun indirizzo',	6:'Ninguna dirección', 	7:'Sem endereço', 		8:'Keng Adress'		};
C_XL.d['eml_none']			= { 0:'No email',		1:'Pas d\'email',		2:'Brak email',		3:'Geen email',		4:'Keine E-Mail',	5:'Nessun email',		6:'Ningún e-mail', 		7:'Sem e-mail', 		8:'Keng E-Mail'		};
C_XL.d['eml_handled']		= { 0:'Handed over',	1:'Transmis',			2:'Przekazany',		3:'Uitgezonden',	4:'Übertragen',		5:'Inviato',			6:'Enviado', 			7:'Enviado', 			8:'Iwwerginn'		};
C_XL.d['eml_pending']		= { 0:'Pending',		1:'En attente',			2:'Oczekujący',		3:'Hangt',			4:'ausstehend',		5:'In attesa',			6:'En espera', 			7:'Em espera', 			8:'An der Waard'	};
C_XL.d['eml_delivered']		= { 0:'Delivered',		1:'Délivré',			2:'Dostarczony',	3:'afgeleverd',		4:'Zugestellt',		5:'Consegnato',			6:'Entregado', 			7:'Entregue', 			8:'Zougestallt'		};


C_XL.d['eml_disabled']		= C_XL.d['disabled']; 		// !! No translation on this line
C_XL.d['eml_outdated']		= C_XL.d['sms_outdated']; 	// !! No translation on this line
C_XL.d['eml_created']		= C_XL.d['ready']; 			// !! No translation on this line
C_XL.d['eml_discarded']		= C_XL.d['sms_discarded']; 			// !! No translation on this line

// Transmission details

C_XL.d['transmission quality']	= { 0:'Transmission quality',	1:'Qualité de la transmission',	2:'Jakość transmisji',	3:'Transmissie kwaliteit',	4:'Übertragungsqualität',	5:'Qualità della trasmissione',	6:'Calidad de la transmisión', 	7:'Qualidade da transmissão', 	8:'Iwwerdroungsqualitéit'	};
C_XL.d['details per route']		= { 0:'Details per route',		1:'Détails par route',			2:'Szczegóły na trasie',3:'Gegevens per route',		4:'Details per Route',		5:'Dettagli per rotta',			6:'Detalles por ruta', 			7:'Detalhes por rota', 			8:'Detailer pro Route'		};
	
					
	// filters for visitors selection (visitors management page)
	
C_XL.d['filter_visitors']	= { 0:'List of visitors who',	1:'Liste des visitors qui',	2:'Wybierz visitors',	3:'Lijst van visitors die',		4:'Liste der Besucher, die',	5:'Lista dei visitatori che',	6:'Listado de visitantes que', 	7:'Lista dos visitantes que', 	8:'Lëscht vun de Visiteuren déi'	};
C_XL.d['end of list']		= { 0:'End of list',			1:'Fin de la liste',		2:'Końca listy',		3:'Einde van de lijst',			4:'Ende der Liste',				5:'Fine della lista',			6:'Fin listado', 				7:'Fim da lista', 				8:'Enn vun der Lëscht'				};

C_XL.d['filter_resources']	= { 0:'visitors who appointed with',	1:'visitors qui ont été reçu par',		2:'Użytkownicy,	którzy powołani z',					3:'visitors die afgesproken hebben met',	4:'Besucher empfangen von',			5:'Visitatori che sono stati ricevuti da',	6:'Visitantes que fueron recibidos por', 	7:'visitantes que foram recebidos por', 8:'Visiteuren déi en Rendez-vous haten mat'	};
C_XL.d['filter_prefs']		= { 0:'visitors who prefer to come on',	1:'visitors qui préfèrent venir le',	2:'Użytkownicy,	którzy zdecydują się przyjść na',	3:'visitors die liever afspreken op',		4:'Besucher mit Präferenz am ',		5:'Visitatori che preferiscono venire il',	6:'Visitantes que prefieren venir el', 		7:'visitantes que preferem vir a', 		8:'Visiteuren déi léiwer kommen um'	};

C_XL.d['filter_workcodes']	= { 0:'visitors who appointed for following performance:',	
								1:'visitors pour les prestations suivantes:',	
								2:'visitors który mianowany na następującej wydajności:',		
								3:'visitors die voor de volgende prestaties hebben afgesproken:',		
								4:'Besucher mit Terminen für die folgenden Leistungen',	
								5:'Visitatori per le seguenti prestazioni',	
								6:'Visitantes para los siguientes servicios',
								7:'visitantes para os seguintes benefícios:',
								8:'Visiteuren déi en Rendez-vous hunn fir folgend Leeschtungen:'	};

C_XL.d['have_app']			= { 0:'have appointed',			1:'ont eu un RDV',				2:'wyznaczyły',				3:'hebben afgesproken',			4:'haben Termin für',				5:'hanno avuto un appuntamento',		6:'tuvieron una cita', 			7:'tinham uma consulta', 		8:'hatten en Rendez-vous'			};
C_XL.d['have_not_app']		= { 0:'have not appointed',		1:'n\'ont pas eu de RDV',		2:'nie powołany',			3:'hebben niet afgesproken',	4:'haben keine Termine',			5:'non hanno avuto un appuntamento',	6:'no tuvieron una cita', 		7:'não tinham consulta', 		8:'hatten keen Rendez-vous'			};
C_XL.d['have_never_app']	= { 0:'have never appointed',	1:'n\'ont jamais eu de RDV',	2:'nigdy nie powoływani',	3:'hebben nooit afgesproken',	4:'hatten noch nie einen Termin',	5:'non hanno mai avuto un appuntamento',6:'nunca tuvieron una cita', 	7:'nunca tiveram uma consulta', 8:'hatten nach ni en Rendez-vous'	};
C_XL.d['have_ever_app']		= { 0:'have ever appointed',	1:'ont déjà eu un RDV',			2:'kiedykolwiek mianowany',	3:'hebben ooit afgesproken',	4:'haben Termine wahrgenommen',		5:'hanno già avuto un appuntamento',	6:'ya tuvieron una cita', 		7:'Já tiveram uma consulta', 	8:'hatten schonn en Rendez-vous'	};
C_XL.d['lastAppCue']		= { 0:'Last appointment',		1:'Dernier RDV',				2:'Ostatnia wizyta',		3:'Laatste reservatie',			4:'Letzter Termin',					5:'Ultimo appuntamento',				6:'Última cita', 				7:'Última consulta', 			8:'Leschte Rendez-vous'				};
C_XL.d['no reference for']	= { 0:'No reference for',		1:'Pas de référence pour',		2:'Brak odniesienia do',	3:'Geen verwijzing naar',		4:'Keine Referenz für',				5:'Nessun riferimento per',				6:'Ninguna referencia para', 	7:'Sem referência para', 		8:'Keng Referenz fir'				};

C_XL.d['not got sms']		= { 0:'have not got SMS',				1:'n\'ont plus reçu de SMS',		2:'nie otrzymałem SMS',		3:'hebben geen SMS gekregen',		4:'haben keine SMS empfangen',		5:'non hanno ricevuto SMS',		6:'no recibieron SMS', 		7:'não voltaram a receber SMS', 	8:'huet keng SMS kritt'		};
C_XL.d['not got email']		= { 0:'have not got e-mail',			1:'n\'ont plus reçu d\'eMail',		2:'nie otrzymałem E-mail',	3:'hebben geen eMail gekregen',		4:'haben keine E-Mail empfangen',	5:'non hanno ricevuto email',	6:'no recibieron e-mail', 	7:'não voltaram a receber e-mails', 8:'huet keng E-Mail kritt'	};

C_XL.d['not got smsemail']	= { 0:'have not got SMS nor e-mails',	
								1:'n\'ont plus reçu SMS ni eMail',	
								2:'Brak wiadomości SMS lub E-Mail otrzymał',		
								3:'hebben geen SMS noch eMail gekregen',		
								4:'haben weder SMS noch E-Mail empfangen',	
								5:'Non hanno ricevuto ne SMS ne email',	
								6:'No recibieron SMS ni e-mail', 7:'não voltaram a receber SMS ou e-mail',
								8:'huet weder SMS nach E-Mail kritt'	};

C_XL.d['before']	= { 0:'before',		1:'avant le',		2:'przed',		3:'voor',		4:'vor dem',	5:'prima del',	6:'antes del', 		7:'antes de', 	8:'virun'	};
C_XL.d['after']		= { 0:'after',		1:'après le',		2:'od',			3:'na',			4:'nach dem',	5:'dopo il',	6:'después del', 	7:'depois de', 	8:'no'	};
C_XL.d['since']		= { 0:'since',		1:'depuis le',		2:'ponieważ',	3:'sinds',		4:'seit',		5:'dal',		6:'desde', 			7:'desde', 		8:'zënter'	};
C_XL.d['and after']	= { 0:'and after',	1:'et ensuite',		2:'a następnie',3:'en daarna',	4:'und ab',		5:'e dopo',		6:'y después', 		7:'e depois', 	8:'an duerno'	};


	// not before control	

// 		technical 			english:0,		french:1,			polish:2,				dutch:3,				german:4,			italian:5,		spanish:6,			portuguese:7, 	luxembourgish:8

C_XL.d['not before'] 	= { 0:'not before',	1:'Pas avant',		2:'Dopiero',			3:'Voorstellen vanaf',	4:'Nicht vor',		5:'Non prima',	6:'No antes', 		7:'Não antes de', 	8:'Net virun'	};
C_XL.d['absent before'] = { 0:'before',		1:'avant',			2:'dopiero',			3:'voor',				4:'vor',			5:'prima',		6:'antes', 			7:'antes', 			8:'virun'			};
C_XL.d['absent after'] 	= { 0:'after',		1:'après',			2:'Nie po',				3:'na',					4:'nach',			5:'dopo',		6:'después', 		7:'depois', 		8:'no'			};
C_XL.d['urgent']	 	= { 0:'urgent',		1:'urgent',			2:'Pilne',				3:'Dringend',			4:'Dringend',		5:'Urgente',	6:'Urgente', 		7:'Urgente', 		8:'Dréngend'			};
C_XL.d['today']	 		= { 0:'today',		1:'aujourd\'hui',	2:'Dzisiaj',			3:'Vandaag',			4:'Heute',			5:'Oggi',		6:'Hoy', 			7:'Hoje', 			8:'Haut'			};
C_XL.d['tomorrow']	 	= { 0:'tomorrow',	1:'demain',			2:'dopiero jutro',		3:'morgen',				4:'morgen',			5:'domani',		6:'mañana', 		7:'amanhã', 		8:'muer'			};
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
	
// 		technical 				english:0,		french:1,			polish:2,				dutch:3,				german:4,				italian:5,			spanish:6,				portuguese:7, 	luxembourgish:8	
	
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

C_XL.d['drop file here']= { 0:'Drop a file here',			1:'Déposez le fichier ici',		2:'Synchronizuj łącza iCal',	3:'Drop een bestand hier',				4:'Datei hierher verschieben',		5:'Deporre il file qui',			6:'Colocar el fichero aquí', 		7:'Colocar o ficheiro aqui', 8:'E Fichier hei ofginn'		};
C_XL.d['ical link'] 	= { 0:'iCal sync link',				1:'Lien de synchro iCal',		2:'Upuścić plik tutaj',			3:'iCal koppeling link',				4:'iCal Sychnronisierungslink',		5:'Link di sincronizzazione iCal',	6:'Enlace de sincronización iCal', 	7:'Ligação de sincronização iCal', 8:'iCal Synchronisatiounslink'	};
C_XL.d['ipad link'] 	= { 0:'Desktop shortcut for iPad',	1:'Raccourci bureau pour iPad',	2:'Skrót na pulpicie do iPada',	3:'Snelkoppeling voor iPad desktop',	4:'Desktopverknüpfung für iPad',	5:'Scorciatoia desk per iPad',		6:'Icono del escritorio para iPad', 7:'atalho do desktop para o iPad', 8:'Desktop-Kuerzel fir den iPad'	};

C_XL.d['you overload the agenda'] 	= { 0:'You are going to overload the agenda',	
										1:'Vous allez surcharger l\'agenda',	
										2:'Będziesz przeciążać programu',	
										3:'U gaat de agenda overbelasten',	
										4:'Der Kalender wird überlastet',	
										5:'Sta per sovraccaricare l\'agenda',	
										6:'Está a punto de sobrecargar el calendario', 
										7:'Vai sobrecarregar o calendário', 
										8:'Dir gitt den Agenda iwwerlaascht' 
									};

C_XL.d['reservations are covered'] 	= { 0:'reservations are covered:',	
										1:'reservations seront couvertes:',	
										2:'zastrzeżenia te są objęte:',	
										3:'reserveringen worden gedekt:',		
										4:'Reservierungen sind gedeckt',	
										5:'prenotazioni coperte',	
										6:'las reservas estarán cubiertas', 
										7:'as reservas serão abordadas:', 
										8:'Reservatiounen sinn ofgedeckt:' 
									};

C_XL.d['another reservation is covered'] = { 0:'another reservation is covered:',	
											1:'une réservation sera couverte:',	
											2:'pokryte jest rezerwacja:',	
											3:'één reservering wordt gedekt:',
											4:'eine weitere Reservierung wird gedeckt:',	
											5:'una prenotazione sarà coperta',	
											6:'otra reserva está cubierta', 
											7:'uma reserva será abordada:', 
											8:'eng aner Reservatioun ass ofgedeckt:' 
										};

C_XL.d['keep device landscape'] = { 0:'Please keep your device horizontally',	
								1:'SVP gardez votre appareil à l\'horizontale',	
								2:'Proszę trzymać urządzenie poziomo',	
								3:'Gelieve uw apparaat horizontaal te houden',	
								4:'Bitte halten Sie Ihr Gerät horizontal',	
								5:'Per favore mantenga il Suo apparecchio all\'orizzontale',	
								6:'Por favor mantenga su dispositivo al horizontal', 
								7:'Por favor, mantenha o seu dispositivo na horizontal', 
								8:'Wegens Ären Apparat horizontal' 
							};
			

	// resource identification
	
// 		technical 				english:0,		french:1,				polish:2,			dutch:3,				german:4,			italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8
	
C_XL.d['reservability'] = { 0:'Reservability',	1:'Réservable',			2:'Rezerwacja',		3:'Reserveerbaar',		4:'Reservierbar',	5:'Prenotabile',			6:'Reservable', 				7:'Reservável', 					8:'Reservéierbarkeet'	};
C_XL.d['time buffer'] 	= { 0:'time buffer',	1:'temps de maintien',	2:'bufor czas',		3:'tijd buffer',		4:'Pufferzeit',		5:'tempo di mantenimento',	6:'Tiempo de mantenimiento', 	7:'tempo de manutenção do dia', 	8:'Zäitpuffer'		};
C_XL.d['allday'] 		= { 0:'all day',		1:'à la journée',		2:'na cały dzień',	3:'voor de hele dag',	4:'Ganztag',		5:'al giorno',				6:'todo el día', 				7:'como a consulta', 				8:'Ganzen Dag'		};
C_XL.d['scheduled'] 	= { 0:'scheduled',		1:'comme le RDV',		2:'na czas wizyty',	3:'volgens afspraak',	4:'Geplant',		5:'come l\'appuntamento',	6:'programado', 				7:'assinatura', 					8:'Gëplangt'		};
C_XL.d['signature'] 	= { 0:'Signature',		1:'Signature',			2:'Podpis',			3:'Benaming',			4:'Unterschrift',	5:'Firma',					6:'Firma', 						7:'assinatura por SMS e e-mails', 	8:'Ënnerschrëft'	};

C_XL.d['signature plhold'] 	= { 0:'signature for SMS and emails',	1:'signature pour SMS et emails',	2:'Podpis do wiadomości SMS i e-maili',	3:'Ondertekening voor SMS en emails',	4:'SMS und Email Unterschrift',	5:'Firma per SMS e email',		6:'Firma para SMS y e-mail',	7:'Enviar SMS e e-mails', 	8:'Ënnerschrëft fir SMS an E-Mails'	};
C_XL.d['comms autotrigger'] = { 0:'emails and SMS sending',			1:'envois des SMS et emails',		2:'Wysyłanie e-maili i SMS-y',			3:'E-mails en SMS versturen',			4:'SMS und Email versenden',	5:'Invio degli SMS e emails',	6:'Envíos SMS y e-mails', 		7:'Envios automáticos', 	8:'SMS an E-Mails schécken'		};
C_XL.d['comm autotrigger'] 	= { 0:'automatic sending',				1:'envois automatique',				2:'automatyczne wysyłanie',				3:'automatisch verzenden',				4:'automatisch senden',			5:'Invio automatico',			6:'Envío automatico', 			7:'ativado por defeito', 	8:'Automatesch schécken'		};
C_XL.d['default enabled']  	= { 0:'enabled by default',				1:'activé par défaut',				2:'Domyślnie włączona',					3:'Standaard ingeschakeld',				4:'Standardmäßig aktiviert',	5:'attivato per difetto',		6:'activado por defecto', 		7:'ativado por defeito', 	8:'Standardméisseg aktivéiert'		};
C_XL.d['default disabled'] 	= { 0:'disabled by default',			1:'désactivé par défaut',			2:'Domyślnie wyłączona',				3:'standaard uitgeschakeld',			4:'standardmäßig deaktiviert',	5:'disattivato per difetto',	6:'desactivado por defecto',	7:'desabilitado por padrão', 8:'Standardméisseg desaktivéiert'		};
C_XL.d['in day enabled'] 	= { 0:'enabled in the current day only',				
								1:'activé seulement dans la journée en cours',				
								2:'włączone tylko w bieżącym dniu',					
								3:'alleen op de huidige dag ingeschakeld',				
								4:'nur am aktuellen Tag aktiviert',	
								5:'abilitato solo nel giorno corrente',		
								6:'habilitado solo en el día actual', 		
								7:'habilitado no dia atual apenas',
								8:'Nëmmen am aktuelle Dag aktivéiert'	};

C_XL.d['aggregate search'] 	= { 0:'Group appointments',				1:'Grouper les réservations',		2:'Spotkania grupowe',							3:'afspraken groeperen',					4:'Termine gruppieren',									5:'Raggruppare le prenotazioni',			6:'agrupar las reservas', 						7:'Se o dia está vazio', 			8:'Rendez-vous gruppéieren'	};
C_XL.d['if day is empty'] 	= { 0:'If the day is empty',			1:'Si la journée est vide',			2:'Jeśli dzień jest pusty',						3:'Indien de dag leeg is',					4:'Wenn der Tag leer ist',								5:'Se la giornata è vuota',					6:'Si el día está vacío', 						7:'Ofereça o mais cedo possível', 	8:'Wann den Dag eidel ass'	};
C_XL.d['fill soon'] 		= { 0:'Propose soonest time option',	1:'Proposer le plus tôt',			2:'Ustaw opcję najwcześniejsze',				3:'Stel de vroegste optie voor',			4:'Den frühesten Termin vorschlagen',					5:'Proporre il più presto',					6:'Proponer lo antes posible', 					7:'Proposer le plus tôt Ofereça o mais cedo possível', 		8:'Fréistméigleche Rendez-vous proposéieren'	};
C_XL.d['fill late'] 		= { 0:'Propose latest time option',		1:'Proposer le plus tard',			2:'Ustaw ostatnią opcję',						3:'Stel de laatste optie voor',				4:'Den spätesten Termin vorschlagen',					5:'Proporre il più tardi',					6:'Proponer lo más tarde posible', 				7:'Proposer le plus tard Ofereça o mais tarde possível', 	8:'Spéitstméigleche Rendez-vous proposéieren'	};
C_XL.d['fill both'] 		= { 0:'Propose first and last options',	1:'Proposer les plus tôt et tard',	2:'Zapytaj najwcześniejsze i najnowsze opcje',	3:'Stel vroegste en laatste opties voor',	4:'Den frühesten und den spätesten Termin vorschlagen',	5:'Proporre il più presto e il più tardi',	6:'Proponer lo antes y lo más tarde posible', 	7:'Ofereça o mais cedo e o mais tarde', 					8:'Éischt a lescht Rendez-vous proposéieren'	};
C_XL.d['offer choices from']= { 0:'Offer choices from',				1:'Offrir le choix de',				2:'Oferta z wyborów',							3:'Bieden keuzes uit',						4:'Die Wahl lassen aus',								5:'Offrire la scelta di',					6:'Ofrecer la posibilidad de elegir entre', 	7:'Oferecer a escolha de', 									8:'Wiel proposéieren aus'	};



	//  H O U R L I E S 
	//
// 		technical 			english:0,			french:1,			polish:2,			dutch:3,				german:4,			italian:5,			spanish:6,		portuguese:7, 	luxembourgish:8
	
C_XL.d['periodicity']	= { 0:'Periodicity',	1:'Périodicité',	2:'Okresy',			3:'Periodiciteit',		4:'Periodizität',	5:'Periodicità',	6:'Frecuencia', 7:'Periodicidade', 	8:'Periodizitéit'	};
C_XL.d['daily'] 		= { 0:'daily',			1:'journalière',	2:'codziennie',		3:'dagelijks',			4:'täglich',		5:'giornaliera',	6:'diario', 	7:'diário', 		8:'Dagsiwwer'			};
C_XL.d['weekly'] 		= { 0:'weekly',			1:'hebdomadaire',	2:'tydzień',		3:'wekelijks',			4:'wöchtentlich',	5:'settimanale',	6:'semanal', 	7:'semanário', 		8:'Wöchentlech'	};
C_XL.d['semimonthly'] 	= { 0:'semimonthly',	1:'bimensuelle',	2:'dwa tygodnie',	3:'halfmaandelijks',	4:'zweimonatlich',	5:'bimestrale',		6:'bimensual', 	7:'bimensal', 		8:'Halbmoundlech'	};
C_XL.d['2 weeks'] 		= { 0:'2 weeks',		1:'2 semaines',		2:'2 tygodnie',		3:'2 weken',			4:'2 Wochen',		5:'2 settimane',	6:'2 semanas', 	7:'2 semanas', 		8:'2 Wochen'	};
C_XL.d['3 weeks'] 		= { 0:'3 weeks',		1:'3 semaines',		2:'3 tygodnie',		3:'3 weken',			4:'3 Wochen',		5:'3 settimane',	6:'3 semanas', 	7:'3 semanas', 		8:'3 Wochen'	};
C_XL.d['4 weeks'] 		= { 0:'4 weeks',		1:'4 semaines',		2:'4 tygodnie',		3:'4 weken',			4:'4 Wochen',		5:'4 settimane',	6:'4 semanas', 	7:'4 semanas', 		8:'4 Wochen'	};
C_XL.d['monthly'] 		= { 0:'monthly',		1:'mensuelle',		2:'miesięcznie',	3:'maandelijks',		4:'monatlich',		5:'mensile',		6:'mensual', 	7:'mensal', 		8:'Mountlech'		};
C_XL.d['yearly'] 		= { 0:'yearly',			1:'annuelle',		2:'roczny',			3:'jaarlijkse',			4:'jährlich',		5:'annuale',		6:'anual', 		7:'anual', 			8:'Jäerlech'		};
C_XL.d['copy of']		= { 0:'Copy of ',		1:'Copie de ',		2:'Kopię',			3:'Kopie van ',			4:'Kopie von',		5:'copia di',		6:'copia de', 	7:'Cópia de ', 		8:'Kopie vun '	};

C_XL.d['define schedule'] 	= { 0:'Define a time range',	1:'Définir une plage horaire',	2:'Określić czas',		3:'Tijdbereik stellen',			4:'Einen Zeitraum definieren',	5:'Definire una fascia oraria',		6:'Definir una franja horaria', 7:'Definir en Zäitraum', 			8:'En Zäitraum definéieren'	};
C_XL.d['adjust schedule'] 	= { 0:'adjust a time range',	1:'ajuster une plage horaire',	2:'Ustaw zakres czasu',	3:'Tijdbereik aanpassing',		4:'Einen Zeitraum anpassen',	5:'aggiustare una fascia oraria',	6:'ajustar una franja horaria', 7:'ajustar um intervalo horário', 	8:'En Zäitraum upassen'	};
C_XL.d['exc available'] 	= { 0:'Exceptionally available',1:'Libre exceptionnellement',	2:'Wyjątkowo dostępne',	3:'Uitzonderlijk beschikbaar',	4:'außerordentlich verfügbar',	5:'Libero eccezionalmente',			6:'Libre excepcionalmente', 	7:'Livre excecionalmente', 			8:'Ausnahmsweis verfügbar'			};

C_XL.d['time boxing'] 		= { 0:'Time boxing',		1:'Blocs horaire',		2:'Szczelina',			3:'Tijdsblokken',		4:'Zeitblöcke',			5:'Blocchi orario',	6:'Bloqueos horarios', 	7:'Blocos horário', 	8:'Zäitblécker'		};
C_XL.d['exclusive tboxing'] = { 0:'Exclusive',			1:'Exclusif',			2:'Ekskluzywny',		3:'Exclusief',			4:'Exklusiv',			5:'Esclusivo',		6:'Exclusivos', 		7:'Exclusivo', 			8:'Exklusiv'			};
C_XL.d['unavailable'] 		= { 0:'Unavailable',		1:'Indisponible',		2:'Niedostępny',		3:'Niet beschikbaar',	4:'Nicht verfügbar',	5:'Indisponibile',	6:'No disponible', 		7:'Indisponível', 		8:'Net verfügbar'		};
C_XL.d['unavailability'] 	= { 0:'Unavailability',		1:'Indisponibilité',	2:'Niedostępność',		3:'Onbeschikbaarheid',	4:'Nichtverfügbarkeit',	5:'Indisponibilità',6:'Indisponibilidad', 	7:'Indisponibilidade', 	8:'Netverfügbaarkeet'	};
C_XL.d['closed day'] 		= { 0:'Day closed',			1:'Journée fermée',		2:'Dzień zamknięty',	3:'Dag gesloten',		4:'Tag geschlossen',	5:'Giornata chiusa',6:'Día cerrado', 		7:'Dia fechado', 		8:'Dag zou'			};

C_XL.d['time box slicing'] 	= { 0:'subdivide',			1:'Subdiviser',				2:'Dzielić na mniejsze części',	3:'Onderverdelen',				4:'Unterteilen',		5:'Suddividere',			6:'Subdividir', 		7:'Subdividir', 	8:'Ënnerdeelen'		};
C_XL.d['no slicing'] 		= { 0:'No subdivision',		1:'Pas de subdivision',		2:'Nie podział',				3:'Geen onderverdeling',		4:'Keine Unterteilung',	5:'Nessuna suddivisione',	6:'Ninguna subdivisión',7:'Sem subdivisão', 8:'Keng Ënnerdeelung'	};





// Please help with those translations.
// There are placeholders, like $fulldate$, $rotation$ and $objectitle$ which should stay intact (They are later replaced by computing).
// You will easily understand what comes in the placeholders by reading the $name$.
// The rest must be translated in each language according to comments. Keep the intention in mind, it is about managing a professional agenda.


C_XL.d['find an address'] = { 
    0: 'Enter a keyword.',                          // english
    1: 'Indiquez un mot-clé.',                      // french
    2: 'Wpisz słowo kluczowe.',                     // polish
    3: 'Geef een trefwoord op.',                    // dutch
    4: 'Geben Sie ein Schlüsselwort ein.',          // german
    5: 'Inserisci una parola chiave.',              // italian
    6: 'Indica una palabra clave.',                 // spanish
    7: 'Indique uma palavra-chave.',                // portuguese
    8: 'Gitt e Schlësselwuert an.'                  // luxembourgish
};

C_XL.d['shadow_open_this_day'] = { 
  0: 'open only on this day $fulldate$', // english
  1: 'ouvrir seulement ce jour $fulldate$', // french
  2: 'otwarte tylko tego dnia $fulldate$', // polish
  3: 'alleen open op deze dag $fulldate$', // dutch
  4: 'nur an diesem Tag $fulldate$ geöffnet', // german
  5: 'aperto solo in questo giorno $fulldate$', // italian
  6: 'abierto solo en este día $fulldate$', // spanish
  7: 'aberto apenas neste dia $fulldate$', // portuguese
  8: 'nëmmen op dësem Dag $fulldate$ oppen' // luxembourgish
};

C_XL.d['shadow_close_only_this_day'] = { 
  0: 'exceptionaly close this day $fulldate$', // english
  1: 'fermer exceptionnellement ce jour $fulldate$', // french
  2: 'wyjątkowo zamknij ten dzień $fulldate$', // polish
  3: 'sluit deze dag uitzonderlijk $fulldate$', // dutch
  4: 'diesen Tag $fulldate$ ausnahmsweise schließen', // german
  5: 'chiudere eccezionalmente questo giorno $fulldate$', // italian
  6: 'cerrar excepcionalmente este día $fulldate$', // spanish
  7: 'fechar excepcionalmente este dia $fulldate$', // portuguese
  8: 'dësen Dag $fulldate$ ausnahmsweis zoumaachen' // luxembourgish
};

C_XL.d['shadow_open_every'] = { 
  0: 'open $dayname$ in the current weekly availability set $rotation$', // english
  1: 'ouvrir $dayname$ dans cet horaire $rotation$', // french
  2: 'otwórz $dayname$ według godzinowego $rotation$', // polish
  3: 'open $dayname$ in het uurrooster $rotation$', // dutch
  4: 'öffne $dayname$ im stündlichen Zeitplan $rotation$', // german
  5: 'apri $dayname$ secondo l\'orario $rotation$', // italian
  6: 'abre $dayname$ en el horario $rotation$', // spanish
  7: 'abra $dayname$ no horário $rotation$', // portuguese
  8: 'maacht den $dayname$ am Stonnenrooster $rotation$' // luxembourgish
};

C_XL.d['shadow_delete_this'] = { 
  0: 'delete $objectitle$', // english
  1: 'effacer $objectitle$', // french
  2: 'usuń $objectitle$', // polish
  3: 'verwijder $objectitle$', // dutch
  4: 'lösche $objectitle$', // german
  5: 'elimina $objectitle$', // italian
  6: 'elimina $objectitle$', // spanish
  7: 'apague $objectitle$', // portuguese
  8: 'läsche $objectitle$' // luxembourgish
};
	
			
C_XL.d['shadow_see_all_properties'] = {
 0: 'see all properties of $objectitle$',               // English
 1: 'voir toutes les propriétés de $objectitle$',        // French
 2: 'Pokaż wszystkie właściwości $objectitle$',          // Polish
 3: 'Bekijk alle eigenschappen van $objectitle$',        // Dutch
 4: 'Alle Eigenschaften von $objectitle$ anzeigen',      // German
 5: 'Visualizza tutte le proprietà di $objectitle$',     // Italian
 6: 'Ver todas las propiedades de $objectitle$',         // Spanish
 7: 'Ver todas as propriedades de $objectitle$',         // Portuguese
 8: 'All d\'Eegeschaften vum $objectitle$ weisen'        // Luxembourgish
};

C_XL.d['shadow_close_this_day'] = {
 0: 'close this day',                                   // English
 1: 'fermer cette journée',                             // French
 2: 'Zamknij ten dzień',                                // Polish
 3: 'Sluit deze dag',                                   // Dutch
 4: 'Diesen Tag schließen',                             // German
 5: 'Chiudi questa giornata',                           // Italian
 6: 'Cerrar este día',                                  // Spanish
 7: 'Fechar este dia',                                  // Portuguese
 8: 'Dësen Dag zoumaachen'                              // Luxembourgish
};

C_XL.d['shadow_make_exception'] = {
 0: 'make this day an exception in the rotating availability set',    // English
 1: 'faire de cette journée une exception dans l\'horaire récurrent',  // French
 2: 'Uczyń ten dzień wyjątkiem w harmonogramie cyklicznym',    // Polish
 3: 'Maak van deze dag een uitzondering in het terugkerende schema',  // Dutch
 4: 'Diesen Tag als Ausnahme im wiederkehrenden Zeitplan festlegen',  // German
 5: 'Fai di questa giornata un\'eccezione nell\'orario ricorrente',   // Italian
 6: 'Hacer de este día una excepción en el horario recurrente',       // Spanish
 7: 'Fazer deste dia uma exceção no horário recorrente',              // Portuguese
 8: 'Dësen Dag zu enger Ausnahm am widderhuelenden Zäitplang maachen' // Luxembourgish
};	
			
			
C_XL.d['shadow_close_every'] = {
  0: 'close  $dayname$ in the current weekly availability set $rotation$', // english
  1: 'fermer $dayname$ dans l\'horaire courant $rotation$', // french
  2: 'zamknij $dayname$ w harmonogramie $rotation$', // polish
  3: 'sluit $dayname$ in het uurrooster $rotation$', // dutch
  4: 'schließe $dayname$ im aktuellen Zeitplan $rotation$', // german
  5: 'chiudi $dayname$ nell\'orario corrente $rotation$', // italian
  6: 'cerrar $dayname$ en el horario actual $rotation$', // spanish
  7: 'fechar $dayname$ no horário atual $rotation$', // portuguese
  8: 'zou $dayname$ am lafende Stonneplang $rotation$' // luxembourgish
};

					
			
	// types of object we can have on screen	
			
C_XL.d['shadow_timebox'] = {
  0: 'this timebox', // english
  1: 'ce bloc horaire', // french
  2: 'ten blok czasowy', // polish
  3: 'dit tijdsblok', // dutch
  4: 'dieser Zeitblock', // german
  5: 'questo blocco orario', // italian
  6: 'este bloque horario', // spanish
  7: 'este bloco de tempo', // portuguese
  8: 'dësen Zäitsblock' // luxembourgish
};

C_XL.d['shadow_unavailability'] = {
  0: 'this unavailability', // english
  1: 'cette indisponibilité', // french
  2: 'ta niedostępność', // polish
  3: 'deze onbeschikbaarheid', // dutch
  4: 'diese Nichtverfügbarkeit', // german
  5: 'questa indisponibilità', // italian
  6: 'esta indisponibilidad', // spanish
  7: 'esta indisponibilidade', // portuguese
  8: 'dës Onverfügbarkeet' // luxembourgish
};

C_XL.d['shadow_offday'] = {
  0: 'this offday', // english
  1: 'cette journée fermée', // french
  2: 'ten dzień wolny', // polish
  3: 'deze sluitingsdag', // dutch
  4: 'dieser Schließtag', // german
  5: 'questa giornata di chiusura', // italian
  6: 'este día cerrado', // spanish
  7: 'este dia encerrado', // portuguese
  8: 'dësen zouenen Dag' // luxembourgish
};
			
C_XL.d['shadow_daystart'] = {
  0: 'this day start', // english
  1: 'ce début de journée', // french
  2: 'ten początek dnia', // polish
  3: 'deze start van de dag', // dutch
  4: 'dieser Tagesbeginn', // german
  5: 'questo inizio di giornata', // italian
  6: 'este inicio del día', // spanish
  7: 'este início do dia', // portuguese
  8: 'dësen Ufank vum Dag' // luxembourgish
};

C_XL.d['shadow_dayfinish'] = {
  0: 'this day end', // english
  1: 'cette fin de journée', // french
  2: 'koniec tego dnia', // polish
  3: 'einde van deze dag', // dutch
  4: 'dieses Tagesende', // german
  5: 'fine di questa giornata', // italian
  6: 'fin de este día', // spanish
  7: 'fim deste dia', // portuguese
  8: 'Enn vun dësem Dag' // luxembourgish
};

C_XL.d['shadow_slice_timebox'] = {
  0: 'slice this timebox into smaller pieces', // english
  1: 'découper ce bloc horaire en morceaux plus petits', // french
  2: 'podziel ten blok czasowy na mniejsze części', // polish
  3: 'verdeel dit tijdsblok in kleinere stukken', // dutch
  4: 'diesen Zeitblock in kleinere Abschnitte aufteilen', // german
  5: 'suddividi questo blocco orario in parti più piccole', // italian
  6: 'divide este bloque horario en partes más pequeñas', // spanish
  7: 'divida este bloco de tempo em partes menores', // portuguese
  8: 'schneid dëse Zäitsblock an méi kleng Deeler' // luxembourgish
};

C_XL.d['shadow_delete_all_of_timeboxes'] = {
  0: 'delete all timeboxes of this type', // english
  1: 'effacer tous les blocs horaires de ce type', // french
  2: 'usuń wszystkie bloki czasowe tego typu', // polish
  3: 'verwijder alle tijdsblokken van dit type', // dutch
  4: 'alle Zeitblöcke dieses Typs löschen', // german
  5: 'elimina tutti i blocchi orari di questo tipo', // italian
  6: 'eliminar todos los bloques horarios de este tipo', // spanish
  7: 'apagar todos os blocos de tempo deste tipo', // portuguese
  8: 'läsche all Zäitsblécker vun dësem Typ' // luxembourgish
};

C_XL.d['huser_backto_recurring'] = {
  0: 'back to rotating availability set', // english
  1: 'retour à l\'horaire récurrent', // french
  2: 'powrót do cyklicznego harmonogramu', // polish
  3: 'terug naar het terugkerende uurrooster', // dutch
  4: 'zurück zum wiederkehrenden Zeitplan', // german
  5: 'ritorno all\'orario ricorrente', // italian
  6: 'volver al horario recurrente', // spanish
  7: 'voltar ao horário recorrente', // portuguese
  8: 'zeréck an den widderhuelenden Stonneplang' // luxembourgish
};

C_XL.d['huser_backto_previous_hourly'] = {
  0: 'continue on previous rotating availability set', // english
  1: 'reprendre l\'horaire récurrent précédent', // french
  2: 'kontynuuj poprzedni cykliczny harmonogram', // polish
  3: 'voortzetten van het vorige terugkerende uurrooster', // dutch
  4: 'das vorherige wiederkehrende Zeitraster fortsetzen', // german
  5: 'continuare l\'orario ricorrente precedente', // italian
  6: 'continuar el horario recurrente anterior', // spanish
  7: 'continuar o horário recorrente anterior', // portuguese
  8: 'weiderféieren vum virege widderhuelende Stonneplang' // luxembourgish
};
	
C_XL.d['huser_see_all_properties'] = {
  0: 'see all properties of this availability change', // english
  1: 'voir toutes les propriétés de ce changement d\'horaire', // french
  2: 'zobacz wszystkie właściwości tej zmiany harmonogramu', // polish
  3: 'bekijk alle eigenschappen van deze roosterwijziging', // dutch
  4: 'alle Eigenschaften dieser Zeitplanänderung anzeigen', // german
  5: 'visualizza tutte le proprietà di questo cambiamento di orario', // italian
  6: 'ver todas las propiedades de este cambio de horario', // spanish
  7: 'ver todas as propriedades desta mudança de horário', // portuguese
  8: 'kuckt all d\'Eegeschaften vun dëser Zäitplangännerung' // luxembourgish
};

C_XL.d['huser_make_new_hourly'] = {
  0: 'create a new rotating availability set', // english
  1: 'introduire un nouvel horaire', // french
  2: 'wprowadź nowy harmonogram', // polish
  3: 'maak een nieuw uurrooster', // dutch
  4: 'neuen Zeitplan erstellen', // german
  5: 'inserisci un nuovo orario', // italian
  6: 'introducir un nuevo horario', // spanish
  7: 'criar um novo horário', // portuguese
  8: 'eegen neien Zäitplang uleeën' // luxembourgish
};

C_XL.d['huser_reuse_an_hourly'] = {
  0: 'reuse an existing weekly availability set', // english
  1: 'ré-utiliser un horaire existant', // french
  2: 'ponownie użyj istniejącego harmonogramu', // polish
  3: 'hergebruik een bestaand uurrooster', // dutch
  4: 'einen bestehenden Zeitplan wiederverwenden', // german
  5: 'riutilizzare un orario esistente', // italian
  6: 'reutilizar un horario existente', // spanish
  7: 'reutilizar um horário existente', // portuguese
  8: 'eng bestehend Zäitplang erëmbenotzen' // luxembourgish
};

C_XL.d['huser_manage_hourlies'] = {
  0: 'manage your weekly availability sets and exceptional days', // english
  1: 'gérer les horaires et changements d\'horaire', // french
  2: 'zarządzaj harmonogramami i zmianami godzinowymi', // polish
  3: 'beheer je uurroosters en uurwijzigingen', // dutch
  4: 'verwalten Sie Ihre Zeitpläne und stündlichen Schichten', // german
  5: 'gestisci i tuoi orari e i cambi di turno orari', // italian
  6: 'gestiona tus horarios y cambios por hora', // spanish
  7: 'gerencie os seus horários e turnos por hora', // portuguese
  8: 'verwalt Är Stonnepläng an d\'Ännerunge vun den Zäiten' // luxembourgish
};

C_XL.d['exceptional_hourly'] = { 
  0: 'exceptional availabilities', // english
  1: 'horaire exceptionnel', // french
  2: 'harmonogram wyjątkowy', // polish
  3: 'uitzonderlijk uurrooster', // dutch
  4: 'außergewöhnlicher Zeitplan', // german
  5: 'orario eccezionale', // italian
  6: 'horario excepcional', // spanish
  7: 'horário excepcional', // portuguese
  8: 'aussergewéinlechen Zäitplang' // luxembourgish
};

C_XL.d['no_hourly'] = {
  0: 'no running availability set', // english
  1: 'aucun horaire en cours', // french
  2: 'brak aktualnego harmonogramu', // polish
  3: 'geen huidig uurrooster', // dutch
  4: 'kein aktueller Zeitplan', // german
  5: 'nessun orario attuale', // italian
  6: 'ningún horario actual', // spanish
  7: 'nenhum horário atual', // portuguese
  8: 'kee lafen Zäitplang' // luxembourgish
};

C_XL.d['huser_make_very_first_hourly'] = {
    0: 'let\'s make your very first rotating weekly availability set',       // english
    1: 'créer votre tout premier horaire récurrent',          // french
    2: 'utwórz swój pierwszy cykliczny harmonogram',          // polish
    3: 'maak uw allereerste terugkerende planning',           // dutch
    4: 'erstellen Sie Ihren allerersten wiederkehrenden Zeitplan', // german
    5: 'crea il tuo primo programma ricorrente',              // italian
    6: 'crea tu primer horario recurrente',                   // spanish
    7: 'crie seu primeiro cronograma recorrente',             // portuguese
    8: 'maacht ären alleréischten widderhuelende Zäitplang'   // luxembourgish
};

C_XL.d['m_newhourly_period'] = {
    0: 'your weekly availability set will rotate over $recweeks$ weeks.',              // english
    1: 'votre horaire va tourner sur $recweeks$ semaines.',         // french
    2: 'twój harmonogram będzie obowiązywał przez $recweeks$ tygodnie.', // polish
    3: 'uw planning zal om de $recweeks$ weken draaien.',        // dutch
    4: 'ihr Zeitplan läuft über $recweeks$ Wochen.',                 // german
    5: 'il tuo programma verrà eseguito per $recweeks$ settimane.', // italian
    6: 'tu horario se ejecutará durante $recweeks$ semanas.',        // spanish
    7: 'seu cronograma será executado por $recweeks$ semanas.',     // portuguese
    8: 'däin Zäitplang wäert iwwer $recweeks$ Wochen lafen.'        // luxembourgish
};

C_XL.d['m_newhourly_name'] = {
    0: 'For example: "John\'s normal weekly availabilities","summer weekly availabilities","all closed","scholar holidays",...',  // english
    1: 'par exemple: "horaire normal de John","horaire d\'été","tout fermé","période de congé scolaire",...',  // french
    2: 'na przykład: "standardowy harmonogram Johna","letni harmonogram","wszystko zamknięte","wakacje szkolne",...',  // polish
    3: 'bijvoorbeeld: "Johns normale uurrooster","zomeruurrooster","alles gesloten","schoolvakantie",...',  // dutch
    4: 'zum Beispiel: "Johns normaler Stundenplan","Sommerstundenplan","alles geschlossen","Schulferien",...',  // german
    5: 'ad esempio: "orario normale di John","orario estivo","tutto chiuso","vacanze scolastiche",...',  // italian
    6: 'por ejemplo: "horario normal de John","horario de verano","todo cerrado","vacaciones escolares",...',  // spanish
    7: 'por exemplo: "horário normal do John","horário de verão","tudo fechado","férias escolares",...',  // portuguese
    8: 'zum Beispill: "John säi normalen Stonnplang","Summerstonnplang","alles zou","Schoulvakanz",...'   // luxembourgish
};

C_XL.d['m_newhourly_colors'] = {
    0: 'Here you can choose colors for closed days, unavailable time periods, and periods when you are exceptionally free.',  // english
    1: 'Vous pouvez ici choisir des couleurs pour les journées fermées, les périodes d\'horaire indisponible, et les périodes où vous êtes exceptionnellement libre.',  // french
    2: 'Tutaj możesz wybrać kolory dla dni zamkniętych, okresów niedostępnych oraz okresów, w których jesteś wyjątkowo wolny.',  // polish
    3: 'Hier kunt u kleuren kiezen voor gesloten dagen, perioden met onbeschikbare planning en perioden waarin u uitzonderlijk vrij bent.',  // dutch
    4: 'Hier können Sie Farben für geschlossene Tage, Zeiträume mit nicht verfügbarem Zeitplan und Zeiträume, in denen Sie außergewöhnlich frei sind, auswählen.',  // german
    5: 'Qui puoi scegliere i colori per i giorni chiusi, i periodi con orario non disponibile e i periodi in cui sei eccezionalmente libero.',  // italian
    6: 'Aquí puedes elegir colores para los días cerrados, los periodos con horario no disponible y los periodos en los que estás excepcionalmente libre.',  // spanish
    7: 'Aqui você pode escolher cores para os dias fechados, os períodos sem disponibilidade de horário e os períodos em que você está excepcionalmente livre.',  // portuguese
    8: 'Hei kënnt Dir Faarwen fir zoue Deeg auswielen, fir Perioden mat net disponiblen Zäitplang an fir Perioden, an deenen Dir aussergewéinlech fräi sidd.'  // luxembourgish
};

C_XL.d['existing_hourlies'] = {
    0: 'existing availability sets',               // english
    1: 'horaires existants',              // french
    2: 'istniejące harmonogramy godzinowe', // polish
    3: 'bestaande uurroosters',           // dutch
    4: 'vorhandene Stundenpläne',         // german
    5: 'orari esistenti',                 // italian
    6: 'horarios existentes',             // spanish
    7: 'horários existentes',             // portuguese
    8: 'bestehend Stonnpläng'             // luxembourgish
};

C_XL.d['m_newhourly_reuse_hourly'] = {
    0: 'Reuse an existing availability set:<br/>You can choose below from your previous sets or from a colleague’s set. Once this window is saved, that rotating availability set takes effect.',  // english
    1: 'Ré-utiliser un horaire existant:<br/>Vous pouvez choisir ci-dessous parmis vos anciens horaires ou parmis les horaires d\'un collègue. Une fois cette fenêtre enregistrée, cet horaire entre en vigueur.',  // french
    2: 'Ponowne użycie istniejącego harmonogramu:<br/>Możesz wybrać poniżej spośród swoich poprzednich harmonogramów lub spośród harmonogramów współpracownika. Po zapisaniu tego okna, ten harmonogram zacznie obowiązywać.',  // polish
    3: 'Hergebruik een bestaand schema:<br/>U kunt hieronder kiezen uit uw eerdere schema’s of uit die van een collega. Zodra dit venster is opgeslagen, wordt dat schema van kracht.',  // dutch
    4: 'Bestehenden Zeitplan wiederverwenden:<br/>Sie können unten aus Ihren früheren Zeitplänen oder den Zeitplänen eines Kollegen wählen. Sobald dieses Fenster gespeichert ist, tritt dieser Zeitplan in Kraft.',  // german
    5: 'Riutilizza un orario esistente:<br/>Puoi scegliere qui sotto tra i tuoi orari precedenti o tra quelli di un collega. Una volta salvata questa finestra, tale orario entra in vigore.',  // italian
    6: 'Reutilizar un horario existente:<br/>Puedes elegir a continuación entre tus horarios anteriores o entre los horarios de un compañero. Una vez que se guarde esta ventana, ese horario entrará en vigor.',  // spanish
    7: 'Reutilizar um cronograma existente:<br/>Você pode escolher abaixo entre seus cronogramas anteriores ou entre os de um colega. Uma vez que esta janela seja salva, esse cronograma entra em vigor.',  // portuguese
    8: 'E bestehenden Zäitplang nei benotzen:<br/>Dir kënnt hei drënner aus Äre fréiere Zäitpläng oder aus de Zäitpläng vun engem Kollege wielen. Wann dës Fënster gespäichert ass, gëtt dee Zäitplang aktiv.'   // luxembourgish
};

C_XL.d['then'] = {
    0: 'then',       // english
    1: 'ensuite',    // french
    2: 'następnie',  // polish
    3: 'daarna',     // dutch
    4: 'dann',       // german
    5: 'quindi',     // italian
    6: 'entonces',   // spanish
    7: 'então',      // portuguese
    8: 'duerno'      // luxembourgish
};

C_XL.d['hourly_switch'] = {
    0: 'switch to this weekly availability set',       // english
    1: 'passer sur cet horaire',                         // french
    2: 'przełącz na ten harmonogram godzinowy',          // polish
    3: 'overschakelen naar dit uurrooster',              // dutch
    4: 'zu diesem Stundenplan wechseln',                 // german
    5: 'passa a questo orario',                          // italian
    6: 'cambiar a este horario',                         // spanish
    7: 'alternar para este cronograma',                  // portuguese
    8: 'wiessel op dëse Stonnplang'                      // luxembourgish
};

C_XL.d['from_thisday_on'] = {
    0: 'from this day on',           // english
    1: 'à partir de ce jour',        // french
    2: 'od tego dnia',               // polish
    3: 'vanaf deze dag',             // dutch
    4: 'ab diesem Tag',              // german
    5: 'da questo giorno in poi',    // italian
    6: 'a partir de este día',       // spanish
    7: 'a partir deste dia',         // portuguese
    8: 'vun dësem Dag un'            // luxembourgish
};

C_XL.d['action_timebox_slice'] = {
    0: 'into $minutes$ minute chunks',   // english
    1: 'en morceaux de $minutes$ mn',  // french
    2: 'na $minutes$ minutowe kawałki',  // polish
    3: 'in stukjes van $minutes$ minuten',  // dutch
    4: 'in $minutes$-Minuten-Abschnitte', // german
    5: 'in blocchi di $minutes$ minuti', // italian
    6: 'en bloques de $minutes$ minutos',  // spanish
    7: 'em blocos de $minutes$ minutos',  // portuguese
    8: 'an $minutes$-Minutte-Stécker'  // luxembourgish
};

C_XL.d['from_apd'] = {
    0: 'from',    // english ("as from")
    1: 'àpd',     // french – abréviation de "à partir de"
    2: 'od',      // polish
    3: 'vanaf',   // dutch
    4: 'ab',      // german
    5: 'da',      // italian
    6: 'desde',   // spanish
    7: 'apd',     // portuguese – abréviation de "a partir de"
    8: 'vun'      // luxembourgish
};

C_XL.d['M_RESC_bp_hourly_list'] = { 
    0: 'The list above shows the rotating availability sets that have been or are planned on this calendar ($rescname$).',               // english
    1: 'On retrouve dans la liste ci-dessus les horaires récurrents qui ont étés ou sont planifiés sur cet agenda ($rescname$).', // french
    2: 'Na powyższej liście znajdują się harmonogramy cykliczne, które zostały lub są zaplanowane w tym kalendarzu ($rescname$).', // polish
    3: 'In de bovenstaande lijst staan de terugkerende schema\'s die op deze agenda ($rescname$) zijn of worden gepland.',        // dutch
    4: 'In der obigen Liste finden Sie die wiederkehrenden Zeitpläne, die in diesem Kalender ($rescname$) geplant wurden oder werden.', // german
    5: 'Nell\'elenco sopra sono presenti gli orari ricorrenti che sono stati o sono programmati in questo calendario ($rescname$).', // italian
    6: 'En la lista anterior aparecen los horarios recurrentes que se han o están programados en este calendario ($rescname$).',     // spanish
    7: 'Na lista acima encontram-se os horários recorrentes que foram ou estão agendados neste calendário ($rescname$).',         // portuguese
    8: 'An der obener Lëscht fannt Dir déi reegelméisseg Zäitpläng, déi an dësem Kalenner ($rescname$) goufen oder ginn geplangt.'  // luxembourgish
};

C_XL.d['M_RESC_bp_hourly_create'] = { 
    0: 'To create or reuse availability sets, go to the <span style="white-space:nowrap;">" $icon$ availabilities"</span> screen. Then click on the dates.',      // english
    1: 'Pour créer ou réutiliser des horaires, rendez-vous sur l\'écran <span style="white-space:nowrap;">" $icon$ horaires "</span>. Cliquez ensuite sur les dates.', // french
    2: 'Aby utworzyć lub ponownie użyć harmonogramów, przejdź do ekranu <span style="white-space:nowrap;">„ $icon$ harmonogramy ”</span>. Następnie kliknij daty.',     // polish
    3: 'Om schema\'s te maken of opnieuw te gebruiken, ga naar het scherm <span style="white-space:nowrap;">" $icon$ roosters "</span>. Klik vervolgens op de datums.', // dutch
    4: 'Um Zeitpläne zu erstellen oder wiederzuverwenden, wechseln Sie zum Bildschirm <span style="white-space:nowrap;"> „ $icon$ Zeitpläne“</span>. Klicken Sie dann auf die Daten.', // german
    5: 'Per creare o riutilizzare orari, vai alla schermata <span style="white-space:nowrap;">" $icon$ orari "</span>. Quindi fai clic sulle date.',            // italian
    6: 'Para crear o reutilizar horarios, ve a la pantalla <span style="white-space:nowrap;">" $icon$ horarios "</span>. Luego haz clic en las fechas.',          // spanish
    7: 'Para criar ou reutilizar horários, aceda ao ecrã <span style="white-space:nowrap;">" $icon$ horários "</span>. Em seguida, clique nas datas.',           // portuguese
    8: 'Fir Zäitspläng ze erstellen oder nees ze benotzen, gitt op de Bildschierm <span style="white-space:nowrap;">„ $icon$ Stonnpläng “</span>. Klickt dann op d’Daten.' // luxembourgish
};

C_XL.d['M_RESC_bp_hourly_display'] = { 
    0: 'To access the screen " $icon$ availabilities", first close this window and then click on "$rescname$" then on " $icon$ availabilities".', // english
    1: 'Pour accéder à l\'écran " $icon$ horaires ", fermez d\'abord cette fenêtre et cliquez ensuite sur "$rescname$" puis " $icon$ horaires ".', // french
    2: 'Aby uzyskać dostęp do ekranu " $icon$ harmonogramy ", zamknij najpierw to okno, a następnie kliknij "$rescname$" i potem " $icon$ harmonogramy ".', // polish
    3: 'Om toegang te krijgen tot het scherm " $icon$ roosters ", sluit eerst dit venster en klik vervolgens op "$rescname$" en daarna op " $icon$ roosters ".', // dutch
    4: 'Um zum Bildschirm " $icon$ Zeitpläne " zu gelangen, schließen Sie zuerst dieses Fenster und klicken Sie dann auf "$rescname$" und anschließend auf " $icon$ Zeitpläne ".', // german
    5: 'Per accedere alla schermata " $icon$ orari ", chiudi prima questa finestra, poi fai clic su "$rescname$" e poi su " $icon$ orari ".', // italian
    6: 'Para acceder a la pantalla " $icon$ horarios ", cierre primero esta ventana y luego haga clic en "$rescname$" y después en " $icon$ horarios ".', // spanish
    7: 'Para aceder ao ecrã " $icon$ horários ", feche primeiro esta janela e depois clique em "$rescname$" e em seguida em " $icon$ horários ".', // portuguese
    8: 'Fir op de Bildschierm " $icon$ Stonnpläng " zouzegräifen, schléiss dës Fënster éischt a klick dann op "$rescname$" an duerno op " $icon$ Stonnpläng ".'  // luxembourgish
};


C_XL.d['M_RESC_bp_hourly_create'] = { 
    0: 'To create or reuse availability sets, go to the <span style="white-space:nowrap;">" $icon$ availabilities"</span> screen. Then click on the dates.',      // english
    1: 'Pour créer ou réutiliser des horaires, rendez-vous sur l\'écran <span style="white-space:nowrap;">" $icon$ horaires "</span>. Cliquez ensuite sur les dates.', // french
    2: 'Aby utworzyć lub ponownie użyć harmonogramów, przejdź do ekranu <span style="white-space:nowrap;">„ $icon$ harmonogramy ”</span>. Następnie kliknij daty.',     // polish
    3: 'Om schema\'s te maken of opnieuw te gebruiken, ga naar het scherm <span style="white-space:nowrap;">" $icon$ roosters "</span>. Klik vervolgens op de datums.', // dutch
    4: 'Um Zeitpläne zu erstellen oder wiederzuverwenden, wechseln Sie zum Bildschirm <span style="white-space:nowrap;"> „ $icon$ Zeitpläne“</span>. Klicken Sie dann auf die Daten.', // german
    5: 'Per creare o riutilizzare orari, vai alla schermata <span style="white-space:nowrap;">" $icon$ orari "</span>. Quindi fai clic sulle date.',            // italian
    6: 'Para crear o reutilizar horarios, ve a la pantalla <span style="white-space:nowrap;">" $icon$ horarios "</span>. Luego haz clic en las fechas.',          // spanish
    7: 'Para criar ou reutilizar horários, aceda ao ecrã <span style="white-space:nowrap;">" $icon$ horários "</span>. Em seguida, clique nas datas.',           // portuguese
    8: 'Fir Zäitspläng ze erstellen oder nees ze benotzen, gitt op de Bildschierm <span style="white-space:nowrap;">„ $icon$ Stonnpläng “</span>. Klickt dann op d’Daten.' // luxembourgish
};

C_XL.d['M_RESC_bp_hourly_display'] = { 
    0: 'To access the screen " $icon$ availabilities", first close this window and then click on "$rescname$" then on " $icon$ availabilities".', // english
    1: 'Pour accéder à l\'écran " $icon$ horaires ", fermez d\'abord cette fenêtre et cliquez ensuite sur "$rescname$" puis " $icon$ horaires ".', // french
    2: 'Aby uzyskać dostęp do ekranu " $icon$ harmonogramy ", zamknij najpierw to okno, a następnie kliknij "$rescname$" i potem " $icon$ harmonogramy ".', // polish
    3: 'Om toegang te krijgen tot het scherm " $icon$ roosters ", sluit eerst dit venster en klik vervolgens op "$rescname$" en daarna op " $icon$ roosters ".', // dutch
    4: 'Um zum Bildschirm " $icon$ Zeitpläne " zu gelangen, schließen Sie zuerst dieses Fenster und klicken Sie dann auf "$rescname$" und anschließend auf " $icon$ Zeitpläne ".', // german
    5: 'Per accedere alla schermata " $icon$ orari ", chiudi prima questa finestra, poi fai clic su "$rescname$" e poi su " $icon$ orari ".', // italian
    6: 'Para acceder a la pantalla " $icon$ horarios ", cierre primero esta ventana y luego haga clic en "$rescname$" y después en " $icon$ horarios ".', // spanish
    7: 'Para aceder ao ecrã " $icon$ horários ", feche primeiro esta janela e depois clique em "$rescname$" e em seguida em " $icon$ horários ".', // portuguese
    8: 'Fir op de Bildschierm " $icon$ Stonnpläng " zouzegräifen, schléiss dës Fënster éischt a klick dann op "$rescname$" an duerno op " $icon$ Stonnpläng ".'  // luxembourgish
};

C_XL.d['M_RESC_bp_hourly_create_from_hourly'] = { 
    0: 'To create or reuse availability sets, close this window. Then click on a date and select "make new availability set" or "reuse an availability set".',      // english
    1: 'Pour créer ou réutiliser des horaires, fermez cette fenêtre. Cliquez ensuite sur une date et choisir "introduire un nouvel horaire" ou "ré-utiliser un horaire".',  // french
    2: 'Aby utworzyć lub ponownie użyć harmonogramów, zamknij to okno. Następnie kliknij na datę i wybierz "dodaj nowy harmonogram" lub "użyj ponownie harmonogramu".',  // polish
    3: 'Om schema\'s te maken of opnieuw te gebruiken, sluit dit venster. Klik vervolgens op een datum en kies "nieuw schema toevoegen" of "schema hergebruiken".',  // dutch
    4: 'Um Zeitpläne zu erstellen oder wiederzuverwenden, schließen Sie dieses Fenster. Klicken Sie dann auf ein Datum und wählen Sie "neuen Zeitplan hinzufügen" oder "Zeitplan wiederverwenden".',  // german
    5: 'Per creare o riutilizzare orari, chiudi questa finestra. Quindi fai clic su una data e seleziona "aggiungi nuovo orario" o "riutilizza un orario".',  // italian
    6: 'Para crear o reutilizar horarios, cierra esta ventana. Luego haz clic en una fecha y selecciona "agregar nuevo horario" o "reutilizar un horario".',  // spanish
    7: 'Para criar ou reutilizar horários, feche esta janela. Em seguida, clique em uma data e selecione "adicionar novo horário" ou "reutilizar um horário".',  // portuguese
    8: 'Fir Pläng ze erstellen oder nees ze benotzen, schléiss dës Fënster. Dann klick op en Datum a wielt "nei Zäitplang derbäisetzen" oder "Zäitplang nees benotzen".'  // luxembourgish
};

C_XL.d['M_RESC_bp_hourly_display_from_hourly'] = { 
    0: 'availability sets that you create can be shared with other colleagues.',  // english
    1: 'Les horaires que vous créez peuvent être partagés avec d\'autres collègues.',  // french
    2: 'Harmonogramy, które utworzysz, można udostępniać innym współpracownikom.',  // polish
    3: 'Schema\'s die je maakt, kunnen worden gedeeld met andere collega\'s.',  // dutch
    4: 'Zeitpläne, die Sie erstellen, können mit anderen Kollegen geteilt werden.',  // german
    5: 'Gli orari che crei possono essere condivisi con altri colleghi.',  // italian
    6: 'Los horarios que crees se pueden compartir con otros colegas.',  // spanish
    7: 'Os horários que você criar podem ser compartilhados com outros colegas.',  // portuguese
    8: 'D\'Zäitspläng, déi Dir erstellt, kënnen mat aneren Kollege gedeelt ginn.'  // luxembourgish
};

C_XL.d['hourlies for']={0:'Availabilities for ',1:'horaires pour ',2:'harmonogramy dla ',3:'uurroosters voor ',4:'Stundenpläne für ',5:'orari per ',6:'horarios para ',7:'horários para ',8:'Stonnpläng fir '};
C_XL.d['agenda_changes']={0:'moves',1:'mouvements',2:'zmiany',3:'wijzigingen',4:'Änderungen',5:'modifiche',6:'cambios',7:'alterações',8:'Ännerungen'};



C_XL.d['M_RESC tip see guideline'] = { 
	0:'See secretary guidelines for $rscname$',		// english
	1:'Consulter les directives secrétariat pour $rscname$',	// french
	2:'Zobacz wytyczne dla sekretariatu dla $rscname$',	// polish
	3:'Bekijk de richtlijnen voor het secretariaat voor $rscname$',	// dutch
	4:'Siehe die Sekretariatsrichtlinien für $rscname$',	// german
	5:'Vedi le linee guida della segreteria per $rscname$',	// italian
	6:'Consulta las directrices del secretariado para $rscname$',	// spanish
	7:'Consulta as diretrizes da secretaria para $rscname$',	// portuguese
	8:'Kuck d’Richtlinnen fir d’Sekretariat fir $rscname$'	// luxembourgish
};


C_XL.d['M_RESC tip create guideline'] = { 
	0:'Make a set of secretary guidelines<br/> for $rscname$',	// english
	1:'Préparer un dossier de directives<br/> pour le secrétariat de $rscname$',	// french
	2:'Przygotuj zestaw wytycznych<br/> dla sekretariatu dla $rscname$',	// polish
	3:'Maak een set richtlijnen voor het secretariaat<br/> voor $rscname$',	// dutch
	4:'Erstelle einen Satz Sekretariatsrichtlinien<br/> für $rscname$',	// german
	5:'Prepara un insieme di linee guida<br/> per la segreteria per $rscname$',	// italian
	6:'Prepara un conjunto de directrices<br/> para el secretariado para $rscname$',	// spanish
	7:'Prepara um conjunto de diretrizes<br/> para a secretaria para $rscname$',	// portuguese
	8:'Bereet e Set Richtlinne fir d’Sekretariat<br/> fir $rscname$ vir'	// luxembourgish
};

C_XL.d['wkcd_blueprint timeboxes'] = { 
  0:'Here you can choose the time sections of your schedule that are preferred for this service.<br/><br/>The search assistant will take this instruction into account to show you availabilities within the selected time blocks.<br/><br/>If the service can be booked via a web page, the availabilities shown to your visitors will also follow this rule.<br/><br/>You will still be able to manually place this service outside the defined time blocks.', // english
  1:'Vous pouvez choisir ici les zones de votre horaire qui sont préférables pour cette prestation.<br/><br/>L\'assistant de recherche tiendra compte de cette consigne pour vous montrer des disponibilités dans les blocs horaires choisis ici.<br/><br/>Si la prestation est réservable via une page web, les disponibilités offertes à vos visitors respecteront également cette consigne.<br/><br/>Vous pourrez toujours placer manuellement cette prestation en dehors des blocs horaires.', // french
  2:'Tutaj możesz wybrać przedziały czasowe w swoim harmonogramie, które są preferowane dla tej usługi.<br/><br/>Asystent wyszukiwania uwzględni tę wskazówkę i pokaże dostępności wyłącznie w wybranych blokach czasowych.<br/><br/>Jeśli usługa jest możliwa do zarezerwowania przez stronę internetową, dostępności prezentowane visitors również będą przestrzegać tej reguły.<br/><br/>Wciąż będziesz mógł ręcznie umieścić tę usługę poza tymi blokami czasowymi.', // polish
  3:'Hier kunt u de tijdsblokken in uw rooster kiezen die voor deze dienst de voorkeur hebben.<br/><br/>De zoekassistent houdt rekening met deze instructie en toont u beschikbaarheden binnen de geselecteerde tijdsblokken.<br/><br/>Als de dienst via een webpagina boekbaar is, zullen de beschikbaarheden die aan uw visitors worden getoond deze richtlijn eveneens volgen.<br/><br/>U kunt deze dienst nog steeds handmatig buiten de gekozen tijdsblokken plaatsen.', // dutch
  4:'Hier können Sie die Zeitbereiche Ihres Dienstplans auswählen, die für diese Leistung bevorzugt sind.<br/><br/>Der Suchassistent berücksichtigt diese Vorgabe und zeigt Ihnen Verfügbarkeiten innerhalb der ausgewählten Zeitblöcke an.<br/><br/>Wenn die Leistung über eine Webseite buchbar ist, werden auch die den visitors angezeigten Verfügbarkeiten diese Vorgabe einhalten.<br/><br/>Sie können diese Leistung weiterhin manuell außerhalb der definierten Zeitblöcke einplanen.', // german
  5:'Qui puoi scegliere le fasce orarie del tuo programma che sono preferibili per questo servizio.<br/><br/>L’assistente di ricerca terrà conto di questa indicazione per mostrarti le disponibilità all’interno dei blocchi orari selezionati.<br/><br/>Se il servizio è prenotabile tramite una pagina web, anche le disponibilità mostrate ai visitors seguiranno questa regola.<br/><br/>Potrai comunque collocare manualmente questo servizio al di fuori dei blocchi orari scelti.', // italian
  6:'Aquí puedes elegir las franjas horarias de tu agenda que son preferibles para este servicio.<br/><br/>El asistente de búsqueda tendrá en cuenta esta indicación para mostrarte las disponibilidades dentro de los bloques horarios seleccionados.<br/><br/>Si el servicio puede reservarse a través de una página web, las disponibilidades mostradas a tus visitors también seguirán esta regla.<br/><br/>Aun así, podrás colocar manualmente este servicio fuera de los bloques horarios definidos.', // spanish
  7:'Aqui pode escolher as faixas horárias do seu horário que são preferíveis para este serviço.<br/><br/>O assistente de pesquisa terá em conta esta indicação para lhe apresentar disponibilidades dentro dos blocos horários selecionados.<br/><br/>Se o serviço puder ser reservado através de uma página web, as disponibilidades apresentadas aos seus visitors também respeitarão esta regra.<br/><br/>Poderá sempre colocar manualmente este serviço fora dos blocos horários definidos.', // portuguese
  8:'Hei kënnt Dir d’Zäitberäicher an Ärem Horaire auswielen, déi fir dës Prestatioun bevorzugt sinn.<br/><br/>Den Sichassistent berécksiichtegt dës Uweisung a weist Iech Disponibilitéiten bannent de gewielte Blockzäiten un.<br/><br/>Wann d’Prestatioun iwwer eng Websäit reservéierbar ass, wäerten d’Disponibilitéiten, déi visitors ugewisen ginn, dës Reegel och respektéieren.<br/><br/>Dir kënnt dës Prestatioun awer nach ëmmer manuell ausserhalb vun deene Blockzäiten placéieren.', // luxembourgish
};


C_XL.d['wkcd_blueprint experts'] = { 
  0: 'Identify here the bCals that have priority for this service.<br/><br/>The search assistant will take this instruction into account to show you availabilities involving only these bCals.<br/><br/>If the service can be booked through a web page, the availabilities shown to your visitors will also follow this rule.<br/><br/>You will still be able to manually place this service in other calendars.', // english
  1: 'Identifiez ici les bCals qui sont prioritaires sur cette prestation.<br/><br/>L\'assistant de recherche tiendra compte de cette consigne pour vous montrer des disponibilités impliquant seulement ces bCals.<br/><br/>Si la prestation est réservable via une page web, les disponibilités offertes à vos visitors respecteront également cette consigne.<br/><br/>Vous pourrez toujours placer manuellement cette prestation dans les autres agendas.', // french
  2: 'Wskaż tutaj bCals, które mają priorytet dla tej usługi.<br/><br/>Asystent wyszukiwania uwzględni tę wskazówkę i pokaże dostępności obejmujące wyłącznie te bCals.<br/><br/>Jeśli usługa może być rezerwowana przez stronę internetową, dostępności prezentowane visitors również będą przestrzegać tej reguły.<br/><br/>Wciąż będziesz mógł ręcznie umieścić tę usługę w innych kalendarzach.', // polish
  3: 'Identificeer hier de bCals die voor deze dienst prioriteit hebben.<br/><br/>De zoekassistent houdt rekening met deze instructie en toont u alleen beschikbaarheden die deze bCals omvatten.<br/><br/>Als de dienst via een webpagina boekbaar is, zullen de beschikbaarheden die aan uw visitors worden getoond deze richtlijn eveneens volgen.<br/><br/>U kunt deze dienst nog steeds handmatig in andere agenda’s plaatsen.', // dutch
  4: 'Geben Sie hier die bCals an, die für diese Leistung Priorität haben.<br/><br/>Der Suchassistent berücksichtigt diese Vorgabe und zeigt Ihnen nur Verfügbarkeiten an, die diese bCals einbeziehen.<br/><br/>Wenn die Leistung über eine Webseite buchbar ist, werden auch die den visitors angezeigten Verfügbarkeiten diese Vorgabe einhalten.<br/><br/>Sie können diese Leistung weiterhin manuell in anderen Kalendern einplanen.', // german
  5: 'Indica qui i bCals che hanno priorità per questo servizio.<br/><br/>L’assistente di ricerca terrà conto di questa indicazione e mostrerà disponibilità che coinvolgono soltanto questi bCals.<br/><br/>Se il servizio è prenotabile tramite una pagina web, anche le disponibilità mostrate ai visitors seguiranno questa regola.<br/><br/>Potrai comunque collocare manualmente questo servizio negli altri calendari.', // italian
  6: 'Indica aquí los bCals que tienen prioridad para este servicio.<br/><br/>El asistente de búsqueda tendrá en cuenta esta indicación y mostrará disponibilidades que impliquen únicamente estos bCals.<br/><br/>Si el servicio puede reservarse a través de una página web, las disponibilidades mostradas a tus visitors también seguirán esta regla.<br/><br/>Aun así, podrás colocar manualmente este servicio en los demás calendarios.', // spanish
  7: 'Identifique aqui os bCals que têm prioridade para este serviço.<br/><br/>O assistente de pesquisa terá em conta esta indicação e apresentará disponibilidades que envolvam apenas estes bCals.<br/><br/>Se o serviço puder ser reservado através de uma página web, as disponibilidades apresentadas aos seus visitors também seguirão esta regra.<br/><br/>Poderá sempre colocar manualmente este serviço nos outros calendários.', // portuguese
  8: 'Identifizéiert hei d’bCals, déi fir dës Prestatioun Prioritéit hunn.<br/><br/>Den Sichassistent berécksiichtegt dës Uweisung a weist Iech nëmmen Disponibilitéiten un, déi dës bCals abezéien.<br/><br/>Wann d’Prestatioun iwwer eng Websäit reservéierbar ass, wäerten och d’Disponibilitéiten, déi visitors ugewisen ginn, dës Reegel respektéieren.<br/><br/>Dir kënnt dës Prestatioun awer nach ëmmer manuell an aner Agenden setzen.', // luxembourgish
};



	// C_iRPOP
	//
	
C_XL.d['C_iRPOP_date_tip'] = { 
    0: 'By clicking this date, you display the full schedule for that date behind this window.', // english
    1: 'En cliquant sur cette date, vous faites afficher derrière cette fenêtre le planning entier pour cette date.', // french
    2: 'Klikając tę datę, wyświetlasz pełny harmonogram na ten dzień za tym oknem.', // polish
    3: 'Door op deze datum te klikken, toont u achter dit venster de volledige planning voor die datum.', // dutch
    4: 'Wenn Sie auf dieses Datum klicken, wird hinter diesem Fenster der vollständige Zeitplan für dieses Datum angezeigt.', // german
    5: 'Cliccando su questa data, viene visualizzato dietro questa finestra l\'intero programma di quel giorno.', // italian
    6: 'Al hacer clic en esta fecha, se muestra detrás de esta ventana toda la programación de esa fecha.', // spanish
    7: 'Ao clicar nesta data, exibe-se atrás desta janela toda a programação dessa data.', // portuguese
    8: 'Wann Dir op dësen Datum klickt, gëtt hannert dëser Fënster de komplette Plang fir dat Datum ugewise.' // luxembourgish
};

C_XL.d['C_iRPOP_time_tip'] = { 
    0: 'By clicking on the appointment start time, you open that appointment\'s details.', // english
    1: 'En cliquant sur l\'heure du RDV, vous ouvrez la fiche de ce RDV.', // french
    2: 'Klikając godzinę rozpoczęcia wizyty, otwierasz szczegóły tej wizyty.', // polish
    3: 'Door te klikken op de aanvangstijd van de afspraak, opent u de gegevens van die afspraak.', // dutch
    4: 'Wenn Sie auf die Startzeit des Termins klicken, öffnen Sie die Detailansicht dieses Termins.', // german
    5: 'Cliccando sull\'orario di inizio dell\'appuntamento, si apre la scheda di questo appuntamento.', // italian
    6: 'Al hacer clic en la hora de inicio de la cita, se abre la ficha de esa cita.', // spanish
    7: 'Ao clicar no horário de início da consulta, você abre os detalhes dessa consulta.', // portuguese
    8: 'Wann Dir op d\'Ufankszäit vum Rendez-vous klickt, gëtt d\'Detailkaart vun dëstem Rendez-vous opgemaach.' // luxembourgish
};


C_XL.d['C_iRPOP_timedate_bp'] = { 
    0: 'Click on a date to display the full schedule for that date. Clicking on the time opens that appointment\'s details.<br/>Show deleted appointments? Press Ctrl+D.',    // english
    1: 'Cliquez sur une date pour afficher le planning entier pour cette date. Un clic sur l\'heure ouvre la fiche de ce RDV.<br/>Afficher les RDVs effacés? Utilisez Ctrl+D.',  // french
    2: 'Kliknij datę, aby wyświetlić pełny harmonogram na ten dzień. Kliknięcie godziny otwiera kartę tej wizyty.<br/>Pokaż usunięte wizyty? Użyj Ctrl+D.',                   // polish
    3: 'Klik op een datum om de volledige planning voor die datum weer te geven. Klik op de tijd om de gegevens van die afspraak te openen.<br/>Verwijderde afspraken weergeven? Gebruik Ctrl+D.',  // dutch
    4: 'Klicken Sie auf ein Datum, um den vollständigen Zeitplan für dieses Datum anzuzeigen. Ein Klick auf die Uhrzeit öffnet die Detailansicht dieses Termins.<br/>Gelöschte Termine anzeigen? Drücken Sie Strg+D.',  // german
    5: 'Clicca su una data per visualizzare il planning completo per quella data. Cliccando sull\'ora si apre la scheda di questo appuntamento.<br/>Visualizzare gli appuntamenti cancellati? Premi Ctrl+D.',   // italian
    6: 'Haga clic en una fecha para mostrar el horario completo de esa fecha. Hacer clic en la hora abre los detalles de esa cita.<br/>¿Mostrar citas eliminadas? Use Ctrl+D.',                            // spanish
    7: 'Clique em uma data para exibir a programação completa dessa data. Clicar na hora abre os detalhes desse compromisso.<br/>Exibir compromissos excluídos? Use Ctrl+D.',                          // portuguese
    8: 'Klickt op e Datum fir den komplette Plang fir dat Datum unzeschauen. E Klick op d\'Uhrzäit opmaacht d\'Detailkaart vun dësem Rendez-vous.<br/>Gelöschte Rendez-vous weisen? Dréck Ctrl+D.'  // luxembourgish
};

C_XL.d['P_horiz_resource_help_tip'] = {
  0: 'Shift+Click to jump into week view.<hr/>Ctrl+Click to open the yearly calendar.<hr/>Ctrl+Shift+Click to enter availabilities management screen.<hr/>Simple click to open the contextual menu.', // English
  1: 'Shift+Clic pour passer à la vue semaine.<hr/>Ctrl+Clic pour ouvrir le calendrier annuel.<hr/>Ctrl+Shift+Clic pour accéder à l’écran de gestion des horaires.<hr/>Clic simple pour ouvrir le menu contextuel.', // Français
  2: 'Shift+Klik, aby przejść do widoku tygodnia.<hr/>Ctrl+Klik, aby otworzyć roczny kalendarz.<hr/>Ctrl+Shift+Klik, aby wejść do ekranu zarządzania godzinami.<hr/>Pojedynczy klik, aby otworzyć menu kontekstowe.', // Polski
  3: 'Shift+Klik om naar weekweergave te springen.<hr/>Ctrl+Klik om de jaarplanner te openen.<hr/>Ctrl+Shift+Klik om het urenbeheerscherm te openen.<hr/>Eénklike klik om het contextmenu te openen.', // Nederlands
  4: 'Shift+Klick, um zur Wochenansicht zu springen.<hr/>Strg+Klick, um den Jahreskalender zu öffnen.<hr/>Strg+Shift+Klick, um den Bildschirm zur Stundenverwaltung zu öffnen.<hr/>Einfacher Klick, um das Kontextmenü zu öffnen.', // Deutsch
  5: 'Shift+Clic per passare alla vista settimanale.<hr/>Ctrl+Clic per aprire il calendario annuale.<hr/>Ctrl+Shift+Clic per accedere alla schermata di gestione orari.<hr/>Clic singolo per aprire il menu contestuale.', // Italiano
  6: 'Shift+Clic para ir a la vista semanal.<hr/>Ctrl+Clic para abrir el calendario anual.<hr/>Ctrl+Shift+Clic para entrar en la pantalla de gestión de horas.<hr/>Clic simple para abrir el menú contextual.', // Español
  7: 'Shift+Clique para ir para a visualização semanal.<hr/>Ctrl+Clique para abrir o calendário anual.<hr/>Ctrl+Shift+Clique para entrar na tela de gerenciamento de horários.<hr/>Clique simples para abrir o menu contextual.', // Português
  8: 'Shift+Klick fir an d’Wochesbléck ze sprangen.<hr/>Ctrl+Klick fir de järege Kalenner opzemaachen.<hr/>Ctrl+Shift+Klick fir den Bildschirm fir Stonneverwaltung opzemaachen.<hr/>Eenzele Klick fir de Kontextmenü opzemaachen.' // Lëtzebuergesch
};




C_XL.d['C_iRPOP_orderdir_tip']	= { 
	0:'click here to change the list order direction.',	// english
	1:'cliquez ici pour inverser la chronologie dans la liste ci-dessous.',	// french
	2:'kliknij tutaj, aby zmienić kierunek porządkowania listy.',	// polish
	3:'klik hier om de volgorde van de lijst om te keren.',	// dutch
	4:'klicken Sie hier, um die Reihenfolge der Liste umzukehren.',	// german
	5:'clicca qui per invertire l\'ordine dell\'elenco sottostante.',	// italian
	6:'haga clic aquí para invertir la cronología de la lista a continuación.',	// spanish
	7:'clique aqui para inverter a ordem da lista abaixo.',	// portuguese
	8:'klickt hei fir d\'Reiefolgerichtung vun der Lëscht ënnendrënner ëmzekéieren.'	// luxembourgish
};	

C_XL.d['tip print planned appointments'] = { 
    0: 'print planned appointments',     // english
    1: 'imprimer les RDVs planifiés',    // french
    2: 'wydrukuj zaplanowane wizyty',     // polish
    3: 'afdrukken geplande afspraken',    // dutch
    4: 'geplante Termine drucken',        // german
    5: 'stampa appuntamenti pianificati', // italian
    6: 'imprimir citas planificadas',     // spanish
    7: 'imprimir compromissos agendados', // portuguese
    8: 'plangéiert Rendez-vous drécken'   // luxembourgish
};

C_XL.d['tip email planned appointments'] = { 
    0: 'email planned appointments', // english
    1: 'envoyer un email avec les RDVs planifiés', // french
    2: 'wysłać e-mail z zaplanowanymi wizytami', // polish
    3: 'geplande afspraken e-mailen',  // dutch
    4: 'geplante Termine per E-Mail senden',  // german
    5: 'inviare un\'email con gli appuntamenti pianificati',  // italian
    6: 'enviar un email con las citas planificadas', // spanish
    7: 'enviar um e-mail com os compromissos agendados', // portuguese
    8: 'e-Mail mam geplangten Rendez-vous schécken' // luxembourgish
};

C_XL.d['choose from series'] = { 
	0:'this appointment will join an existing serie',        // english
	1:'ce RDV va rejoindre une série existante',              // french
	2:'to spotkanie dołączy do istniejącej serii',            // polish
	3:'deze afspraak wordt aan een bestaande reeks toegevoegd', // dutch
	4:'dieser Termin wird einer bestehenden Serie hinzugefügt', // german
	5:'questo appuntamento verrà aggiunto a una serie esistente', // italian
	6:'esta cita se añadirá a una serie existente',           // spanish
	7:'este compromisso será adicionado a uma série existente', // portuguese
	8:'dëse Rendez-vous gëtt an eng bestehend Serie dobäigesat' // luxembourgish
};

C_XL.d['choose from series many'] = { 
	0:'those appointments will join an existing serie',                // english
	1:'ces RDVs vont rejoindre une série existante',                    // french
	2:'te wizyty dołączą do istniejącej serii',                         // polish
	3:'deze afspraken worden aan een bestaande serie toegevoegd',      // dutch
	4:'diese Termine werden einer bestehenden Serie hinzugefügt',      // german
	5:'questi appuntamenti verranno aggiunti a una serie esistente',   // italian
	6:'estas citas se añadirán a una serie existente',                  // spanish
	7:'esses compromissos serão adicionados a uma série existente',     // portuguese
	8:'dës Rendez-vous ginn an eng bestehend Serie dobäigesat'         // luxembourgish
};	


C_XL.d['a serie created on'] = { 
    0: 'a nameless serie created on',            // english
    1: 'une série sans titre créé le',           // french
    2: 'seria bez nazwy utworzona dnia',         // polish
    3: 'een naamloze serie aangemaakt op',       // dutch
    4: 'eine namenlose Serie erstellt am',       // german
    5: 'una serie senza nome creata il',         // italian
    6: 'una serie sin nombre creada el',         // spanish
    7: 'uma série sem nome criada em',           // portuguese
    8: 'eng Serie ouni Numm erstallt um'         // luxembourgish
};

C_XL.d['new serie'] = { 
    0: 'new serie',         // english
    1: 'nouvelle série',    // french
    2: 'nowa seria',        // polish
    3: 'nieuwe serie',      // dutch
    4: 'Neue Serie',        // german
    5: 'nuova serie',       // italian
    6: 'nueva serie',       // spanish
    7: 'nova série',        // portuguese
    8: 'nei Serie'          // luxembourgish
};

C_XL.d['you are already viewing this appointment']	= { 
	0:'you are already viewing this appointment',	// english
	1:'vous consultez déjà ce RDV',				// french
	2:'już przeglądasz tę wizytę',					// polish
	3:'u bekijkt deze afspraak al',				// dutch
	4:'Sie sehen sich diesen Termin bereits an',	// german
	5:'stai già visualizzando questo appuntamento',// italian
	6:'ya estás viendo esta cita', 				// spanish
	7:'você já está visualizando este compromisso',// portuguese
	8:'Dir kuckt Iech dëse Rendez-vous schonn un'	// luxembourgish
};	

C_XL.d['tip unlink'] = { 
    0: 'Unlink $assess$ from the serie.<hr>This will keep $assess2$ on the planning, it is removed only from the serie listing.',    // english
    1: 'Dissocier $assess$ de la série.<hr>Cela conservera $assess2$ dans le planning, il est uniquement supprimé de la liste de la série.', // french
    2: 'Odłącz $assess$ od serii.<hr>$assess2$ pozostanie w harmonogramie, zostanie usunięty tylko z listy serii.',                  // polish
    3: 'Koppel $assess$ los van de serie.<hr>$assess2$ blijft in de planning staan, het wordt alleen uit de serieslijst verwijderd.', // dutch
    4: '$assess$ von der Serie trennen.<hr>$assess2$ bleibt in der Planung erhalten, er wird nur aus der Serienauflistung entfernt.', // german
    5: 'Scollega $assess$ dalla serie.<hr>$assess2$ rimarrà nella pianificazione, verrà rimosso solo dall\'elenco delle serie.',   // italian
    6: 'Desvincular $assess$ de la serie.<hr>$assess2$ se mantendrá en la planificación; solo se eliminará del listado de la serie.',    // spanish
    7: 'Desvincular $assess$ da série.<hr>$assess2$ permanecerá no planejamento; será removido apenas da listagem da série.',         // portuguese
    8: '$assess$ vun der Serie trennen.<hr>$assess2$ bleift am Plang, gëtt nëmmen aus der Serienlëscht ewechgeholl.'            // luxembourgish
};

C_XL.d['tip unlink'] = { 
    0: 'Unlink this reservation from the serie.<hr>This will keep the reservation on the planning, it is removed only from the serie listing.', // english
    1: 'Dissocier cette réservation de la série.<hr>Cela conservera la réservation dans le planning, elle est uniquement supprimée de la liste de la série.', // french
    2: 'Odłącz tę rezerwację od serii.<hr>Rezerwacja pozostanie w harmonogramie, zostanie usunięta tylko z listy serii.', // polish
    3: 'Koppel deze reservering los van de serie.<hr>De reservering blijft in de planning staan, deze wordt alleen uit de serieslijst verwijderd.', // dutch
    4: 'Diese Reservierung von der Serie trennen.<hr>Die Reservierung bleibt im Plan erhalten, sie wird nur aus der Serienauflistung entfernt.', // german
    5: 'Scollega questa prenotazione dalla serie.<hr>La prenotazione rimarrà nella pianificazione, verrà rimossa solo dall\'elenco delle serie.', // italian
    6: 'Desvincular esta reserva da série.<hr>Isso manterá a reserva no planejamento; ela será removida apenas da listagem da série.', // portuguese
    7: 'Desvincular esta reserva de la serie.<hr>La reserva se mantendrá en la planificación; sólo se elimina de la lista de la serie.', // spanish
    8: 'Dës Reservatioun vun der Serie trennen.<hr>D\'Reservatioun bleift am Plang, si gëtt nëmmen aus der Serienlëscht ewechgeholl.' // luxembourgish
};

C_XL.d['tip unlink appointment'] = { 
    0: 'Unlink this appointment from the serie.<hr>This will keep the appointment on the planning, it is removed only from the serie listing.', // english
    1: 'Dissocier ce rendez-vous de la série.<hr>Cela conservera le rendez-vous dans le planning, il est uniquement supprimé de la liste de la série.', // french
    2: 'Odłącz tę wizytę od serii.<hr>Wizyta pozostanie w harmonogramie, zostanie usunięta tylko z listy serii.', // polish
    3: 'Koppel deze afspraak los van de serie.<hr>De afspraak blijft in de planning staan, deze wordt alleen uit de serieslijst verwijderd.', // dutch
    4: 'Diesen Termin von der Serie trennen.<hr>Der Termin bleibt im Plan erhalten, er wird nur aus der Serienauflistung entfernt.', // german
    5: 'Scollega questo appuntamento dalla serie.<hr>L\'appuntamento rimarrà nella pianificazione, verrà rimosso solo dall\'elenco delle serie.', // italian
    6: 'Desvincular esta cita da série.<hr>Isso manterá a cita no planejamento; ela será removida apenas da listagem da série.', // portuguese
    7: 'Desvincular esta cita de la serie.<hr>La cita se mantendrá en la planificación; sólo se elimina de la lista de la serie.', // spanish
    8: 'Dësen Rendez-vous vun der Serie trennen.<hr>Dësen Rendez-vous bleift am Plang, si gëtt nëmmen aus der Serienlëscht ewechgeholl.' // luxembourgish
};

C_XL.d['tip unlink event'] = { 
    0: 'Unlink this event from the serie.<hr>This will keep the event on the planning, it is removed only from the serie listing.', // english
    1: 'Dissocier cette indisponibilité de la série.<hr>Cela conservera l\'indisponibilité dans le planning, elle est uniquement supprimée de la liste de la série.', // french
    2: 'Odłącz tę niedostępność od serii.<hr>Niedostępność pozostanie w harmonogramie, zostanie usunięta tylko z listy serii.', // polish
    3: 'Koppel deze onbeschikbaarheid los van de serie.<hr>De onbeschikbaarheid blijft in de planning staan, deze wordt alleen uit de serieslijst verwijderd.', // dutch
    4: 'Diese Unverfügbarkeit von der Serie trennen.<hr>Die Unverfügbarkeit bleibt im Plan erhalten, sie wird nur aus der Serienauflistung entfernt.', // german
    5: 'Scollega questa indisponibilità dalla serie.<hr>L\'indisponibilità rimarrà nella pianificazione, verrà rimossa solo dall\'elenco delle serie.', // italian
    6: 'Desvincular esta indisponibilidad da série.<hr>Isso manterá a indisponibilidade no planejamento; ela será removida apenas da listagem da série.', // portuguese
    7: 'Desvincular esta indisponibilidad de la serie.<hr>La indisponibilidad se mantendrá en la planificación; sólo se elimina de la lista de la serie.', // spanish
    8: 'Dës Onverfügbarkeet vun der Serie trennen.<hr>Dës Onverfügbarkeet bleift am Plang, si gëtt nëmmen aus der Serienlëscht ewechgeholl.' // luxembourgish
};


C_XL.d['this appointment']	= { // see (*rs04*)
	0:'this appointment',	// english
	1:'ce rendez-vous',	// french
	2:'ta wizyta',	// polish
	3:'deze afspraak',	// dutch
	4:'diesen Termin',	// german
	5:'questo appuntamento',	// italian
	6:'esta cita',	// spanish
	7:'este compromisso',	// portuguese
	8:'dëse Rendez-vous'	// luxembourgish
};	

C_XL.d['this event']	= { 
	0:'this unavailability',	// english
	1:'cette indisponibilité',	// french
	2:'ta niedostępność',	// polish
	3:'deze onbeschikbaarheid',	// dutch
	4:'diese Unverfügbarkeit',	// german
	5:'questa indisponibilità',	// italian
	6:'esta indisponibilidad', 	// spanish
	7:'esta indisponibilidade',	// portuguese
	8:'dës Onverfügbarkeet'	// luxembourgish
};	

C_XL.d['the appointment']	= { // see (*rs04*)
	0:'the appointment',	// english
	1:'le rendez-vous',	// french
	2:'wizyta',	// polish
	3:'de afspraak',	// dutch
	4:'der Termin',	// german
	5:'l\'appuntamento',	// italian
	6:'la cita', 	// spanish
	7:'o compromisso',	// portuguese
	8:'de Rendez-vous'	// luxembourgish
};	

C_XL.d['the event']	= { 
	0:'the event',	// english
	1:'l\'indisponibilité',	// french
	2:'niedostępność',	// polish
	3:'de onbeschikbaarheid',	// dutch
	4:'die Unverfügbarkeit',	// german
	5:'l\'indisponibilità',	// italian
	6:'la indisponibilidad', 	// spanish
	7:'a indisponibilidade',	// portuguese
	8:'dës Onverfügbarkeet'	// luxembourgish
};	






	// A C C O U N T    C O N F I G
	//
	
	// global account preferences tabs
		
C_XL.d['account'] 	= { 0:'account',			1:'Compte',				2:'Konto',			3:'account',		4:'Konto',			5:'Conto',			6:'Cuenta', 		7:'Conta', 8:'Kont'		};
C_XL.d['display'] 	= { 0:'Display',			1:'affichage',			2:'Wyświetlania',	3:'Weergave',		4:'anzeige',		5:'Visualizzazione',6:'Visualización', 	7:'Exibição', 8:'Affichage'	};
C_XL.d['agendas'] 	= { 0:'agendas',			1:'agendas',			2:'Porządek',		3:'agendas',		4:'Kalender',		5:'agende',			6:'agenda', 		7:'agendas', 8:'Agendas'	};
C_XL.d['logins'] 	= { 0:'Logins',				1:'Logins',				2:'Loginów',		3:'Toegang',		4:'Logins',			5:'Logins',			6:'Logins', 		7:'Logins', 8:'Logins'		};
C_XL.d['comms']		= { 0:'Communications',		1:'Communications',		2:'Komunikacja',	3:'Communicaties',	4:'Kommunikation',	5:'Comunicazioni',	6:'Comunicaciones', 7:'Comunicações', 8:'Kommunikatiounen'	};

C_XL.d['workcodes'] = { 0:'Performances',		1:'Prestations',		2:'Usług',			3:'Prestaties',		4:'Leistungen',		5:'Prestazioni',	6:'Servicios', 		7:'Prestações', 8:'Leeschtungen'};
C_XL.d['products'] = { 0:'products', 			1:'produits', 			2:'produkty', 		3:'producten', 		4:'Produkte', 		5:'prodotti', 		6:'productos', 		7:'produtos', 	8:'Produkter' 	};

C_XL.d['inclusive'] = { 0:'Inclusive',			1:'Inclus',				2:'Włącznie',		3:'Inbegrepen',		4:'Inklusiv',		5:'Incluso',		6:'Incluido', 		7:'Incluído', 8:'Inklusiv'		};

C_XL.d['duplicate account'] = { 0:'Duplicate account',	1:'Dupliquer le compte', 2:'Duplikat konto',	3:'account dupliceren',	4:'Konto duplizieren', 5:'Duplicare conto', 6:'Duplicar cuenta', 7:'Duplicar conta', 8:'Kont duplizéieren'	};

C_XL.d['rscs copy mode'] = {
    0: 'Copy or move agendas',    // english
    1: 'Copier ou Déplacer les agendas',    // french
    2: 'Kopiuj lub przenieś harmonogramy',    // polish
    3: 'Kopieer of verplaats agenda\'s',    // dutch
    4: 'Termine kopieren oder verschieben',    // german
    5: 'Copia o sposta gli appuntamenti',    // italian
    6: 'Copiar o mover agendas',    // spanish
    7: 'Copiar ou mover agendas',    // portuguese
    8: 'Agendas kopéieren oder réckelen'    // luxembourgish
};

C_XL.d['copy rscs to new acc'] = {
    0: 'Copy selected agendas',    // english
    1: 'Copier les agendas sélectionnés',    // french
    2: 'Kopiuj wybrane harmonogramy',    // polish
    3: 'Kopieer geselecteerde agenda\'s',    // dutch
    4: 'Ausgewählte Termine kopieren',    // german
    5: 'Copia gli appuntamenti selezionati',    // italian
    6: 'Copiar agendas seleccionadas',    // spanish
    7: 'Copiar agendas selecionadas',    // portuguese
    8: 'Kopéiert ausgewielten Agendas'    // luxembourgish
};

C_XL.d['move rscs to new acc'] = {
    0: 'Move selected agendas',    // english
    1: 'Déplacer les agendas sélectionnés',    // french
    2: 'Przenieś wybrane harmonogramy',    // polish
    3: 'Verplaats geselecteerde agenda\'s',    // dutch
    4: 'Ausgewählte Termine verschieben',    // german
    5: 'Sposta gli appuntamenti selezionati',    // italian
    6: 'Mover agendas seleccionadas',    // spanish
    7: 'Mover agendas selecionadas',    // portuguese
    8: 'Réckelt ausgewielten Agendas'    // luxembourgish
};

C_XL.d['visitors copy mode'] = {
    0: 'Scope for visitors copy',    // english
    1: 'Périmètre pour la copie des visitors',    // french
    2: 'Zakres kopiowania visitors',    // polish
    3: 'Bereik voor het kopiëren van visitors',    // dutch
    4: 'Umfang für die Kopie von visitors',    // german
    5: 'Ambito per la copia dei visitors',    // italian
    6: 'Ámbito para la copia de visitors',    // spanish
    7: 'Âmbito para a cópia de visitors',    // portuguese
    8: 'Beräich fir d\'Kopie vun Visiteuren'    // luxembourgish
};



C_XL.d['copy all visitors'] = {
    0: 'Copy all visitors from register',    // english
    1: 'Copier tous les visitors du registre',    // french
    2: 'Skopiuj visitors odwiedzających z rejestru',    // polish
    3: 'Kopieer alle visitors uit het register',    // dutch
    4: 'Alle visitors aus dem Register kopieren',    // german
    5: 'Copia tutti i visitors dal registro',    // italian
    6: 'Copiar todos los visitors del registro',    // spanish
    7: 'Copiar todos os visitors do registro',    // portuguese
    8: 'Kopie all Visiteuren aus dem Register'    // luxembourgish
};

C_XL.d['copy appointed visitors'] = {
    0: 'Copy only visitors who ever appointed.',    // english
    1: 'Copier seulement les visitors vus dans l\'agenda',    // french
    2: 'Kopiuj tylko visitors, którzy kiedykolwiek mieli umówione spotkanie.',    // polish
    3: 'Alleen visitors kopiëren die ooit een afspraak hebben gemaakt.',    // dutch
    4: 'Nur visitors kopieren, die jemals einen Termin vereinbart haben.',    // german
    5: 'Copia solo i visitors che hanno mai fissato un appuntamento.',    // italian
    6: 'Copiar solo a los visitors que alguna vez han sido citados.',    // spanish
    7: 'Copiar apenas os visitors que já foram agendados.',    // portuguese
    8: 'Kopie nëmme Visiteuren déi schonn en Rendez-vous haten.'    // luxembourgish
};

C_XL.d['reservations copy mode'] = {
    0: 'Scope for reservations copy',    // english
    1: 'Périmètre pour la copie des réservations',    // french
    2: 'Zakres kopiowania rezerwacji',    // polish
    3: 'Bereik voor reserveringskopie',    // dutch
    4: 'Umfang für Reservierungskopie',    // german
    5: 'Ambito per la copia delle prenotazioni',    // italian
    6: 'Alcance para la copia de reservas',    // spanish
    7: 'Âmbito para a cópia de reservas',    // portuguese
    8: 'Beräich fir d\'Kopie vun den Reservatiounen'    // luxembourgish
};

C_XL.d['copy resa current'] = {
    0: 'The last 4 weeks and the future',    // english
    1: 'Les 4 dernières semaines et le futur',    // french
    2: 'Ostatnie 4 tygodnie i przyszłość',    // polish
    3: 'De laatste 4 weken en de toekomst',    // dutch
    4: 'Die letzten 4 Wochen und die Zukunft',    // german
    5: 'Le ultime 4 settimane e il futuro',    // italian
    6: 'Las últimas 4 semanas y el futuro',    // spanish
    7: 'As últimas 4 semanas e o futuro',    // portuguese
    8: 'Déi lescht 4 Wochen an d\'Zukunft'    // luxembourgish
};

C_XL.d['include archived resas'] = {
    0: 'Include archived reservations',    // english
    1: 'Inclure également l\'historique complet',    // french
    2: 'Uwzględnij również zarchiwizowane rezerwacje',    // polish
    3: 'Inclusief gearchiveerde reserveringen',    // dutch
    4: 'Archivierte Reservierungen einbeziehen',    // german
    5: 'Includi anche le prenotazioni archiviate',    // italian
    6: 'Incluir también las reservas archivadas',    // spanish
    7: 'Incluir também as reservas arquivadas',    // portuguese
    8: 'Archivéiert Reservatiounen abannen'    // luxembourgish
};

C_XL.d['accopy target mode'] = {
    0: 'Target',    // english
    1: 'Cible',    // french
    2: 'Cel',    // polish
    3: 'Doel',    // dutch
    4: 'Ziel',    // german
    5: 'Bersaglio',    // italian
    6: 'Objetivo',    // spanish
    7: 'Alvo',    // portuguese
    8: 'Zil'    // luxembourgish
};

C_XL.d['make a new account'] = {
    0: 'Create a new account',    // english
    1: 'Créer un nouveau compte',    // french
    2: 'Załóż nowe konto',    // polish
    3: 'Maak een nieuw account',    // dutch
    4: 'Ein neues Konto erstellen',    // german
    5: 'Crea un nuovo account',    // italian
    6: 'Crear una nueva cuenta',    // spanish
    7: 'Criar uma nova conta',    // portuguese
    8: 'En neie Kont erstellen'    // luxembourgish
};

C_XL.d['target an existing account'] = {
    0: 'Target an existing account',    // english
    1: 'Compléter un compte existant',    // french
    2: 'Celuj w istniejące konto',    // polish
    3: 'Richt op een bestaand account',    // dutch
    4: 'Ein bestehendes Konto anvisieren',    // german
    5: 'Punta a un account esistente',    // italian
    6: 'Apuntar a una cuenta existente',    // spanish
    7: 'Mire para uma conta existente',    // portuguese
    8: 'En existéierende Kont viséieren'    // luxembourgish
};

						
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8								
								
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


// 		technical 			english:0,					french:1,					polish:2,						dutch:3,					german:4,					italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8
C_XL.d['payment']			= { 0:'payment',			1:'paiement',					2:'płatność',				3:'betaling',				4:'zahlung',				5:'pagamento',				6:'pago', 						7:'pagamento', 				8:'Bezuelung'		};
C_XL.d['payments']			= { 0:'payments',			1:'paiements',					2:'płatności',				3:'betalingen',				4:'zahlungen',				5:'pagamenti',				6:'pagos', 						7:'pagamentos', 			8:'Bezuelungen'		};
C_XL.d['deposit']			= { 0:'deposit amount',		1:'montant de l\'acompte',		2:'kwota depozytu',			3:'aanbetalingsbedrag',		4:'Einzahlungsbetrag',		5:'importo del deposito',	6:'cantidad del depósito', 		7:'valor do depósito', 		8:'Acompte'			};
C_XL.d['e-payment']			= { 0:'e-Payment',			1:'e-Paiement',					2:'e-płatność',				3:'e-Payment',				4:'e-Zahlung',				5:'e-Pagamento',			6:'e-Pago', 					7:'e-pagamento', 			8:'e-Bezuelung'		};
C_XL.d['e-invoicing']		= { 0:'e-Invoicing',		1:'e-Facturation',				2:'e-faktura',				3:'e-Fakturatie',			4:'e-Rechnung',				5:'e-Fatturazione',			6:'e-Facturación', 				7:'e-faturação', 			8:'e-Fakturéierung'	};
C_XL.d['norm fee']			= { 0:'Fee',				1:'abonnement',					2:'abonament',				3:'abonement',				4:'abo',					5:'abbonamento',			6:'Suscripción', 				7:'Subscrição', 			8:'Abonnement'		};
C_XL.d['credit']			= { 0:'Credits',			1:'Crédits',					2:'Kredyty',				3:'Krediet',				4:'Gutschrift',				5:'Crediti',				6:'Créditos', 					7:'Créditos', 				8:'Credits'			};
C_XL.d['ex fee']			= { 0:'Exceptional fee',	1:'abonement crédit',			2:'abonament (kredyty)',	3:'Krediet abonement',		4:'abo Gutschrift',			5:'abbonamento credito',	6:'Suscripción de crédito', 	7:'Subscrição de crédito', 	8:'Aussergewéinlech Frais'	};
C_XL.d['rate']				= { 0:'Tax rate',			1:'TVA',						2:'VAT',					3:'BTW',					4:'MwSt',					5:'IVA',					6:'IVA', 						7:'IVA', 					8:'TVA'		};

C_XL.d['ep-perfs total']	= { 0:'total according to rates', 1:'total selon tarif',	2:'suma według ceny',		3:'totaal volgens tarief',	4:'insgesamt nach Preis',	5:'totale in base al prezzo',	6:'total segun precio', 			7:'total de acordo com o preço', 	8:'Total no Tarif'		};
C_XL.d['ep-charged']		= { 0:'total to charge',		1:'total à percevoir',		2:'łączna należność',		3:'totaal te berekenen',	4:'insgesamt zu sammeln',	5:'totale credito',				6:'cuentas por cobrar totales', 	7:'total a receber', 				8:'Total ze verrechnen'	};
C_XL.d['ep-already paid']	= { 0:'already paid',			1:'déjà payé',				2:'już zapłacone',			3:'al betaald',				4:'bereits bezahlt',		5:'già pagato',					6:'ya pagado', 						7:'já pago', 						8:'Schonn bezuelt'		};
C_XL.d['ep-balance']		= { 0:'balance',				1:'reste à payer',			2:'pozostało do zapłaty',	3:'nog te betalen',			4:'Noch zu zahlen',			5:'saldo da pagare',			6:'saldo por pagar', 				7:'saldo por pagar', 				8:'Saldo'				};
C_XL.d['ep-payments-list']	= { 0:'payments',				1:'paiements',				2:'płatności',				3:'betalingen',				4:'Zahlungen',				5:'pagamenti',					6:'pagos', 							7:'pagamentos', 					8:'Bezuelungen'			};
C_XL.d['pricing']			= { 0:'rate',					1:'tarif',					2:'cennik',					3:'tarief',					4:'tarif',					5:'tariffa',					6:'precio', 						7:'preço', 							8:'Tarif'				};
C_XL.d['amount'] 			= { 0:'amount', 				1:'montant', 				2:'kwota', 					3:'bedrag', 				4:'Betrag (EUR)', 			5:'importo', 					6:'importe', 						7:'valor', 							8:'Montant' 			};

C_XL.d['ep-tip droprates'] 	= { // tip for the button that copies the total amount according to rates into the to be paid amount
	0:'copy total according to rates onto total to charge',
	1:'copier le montant selon tarif dans le total à percevoir',
	2:'skopiuj kwotę według stawki do sumy do pobrania',
	3:'copieer de totaal volgens tarief op de totaal te berekenen',
	4:'Kopieren Sie den Betrag laut Tarif in die einzuziehende Gesamtsumme',
	5:'copiare l\'importo in base alla tariffa nel totale da riscuotere',
	6:'copie el monto según la tarifa en el total a cobrar',
	7:'copie o valor de acordo com a taxa no total a ser cobrado',
	8:'Kopéiert de Betrag no Tarif op den Total ze verrechnen' // luxembourgish
};


// 		technical 					english:0,				french:1,				polish:2,				dutch:3,					german:4,				italian:5,				spanish:6,				portuguese:7, 	luxembourgish:8

C_XL.d['mtitle new payment']	= { 0:'new payment',		1:'nouveau paiement',	2:'nowa płatność',		3:'nieuwe betaling',		4:'neue Zahlung',		5:'nuovo pagamento',	6:'nuevo pago', 		7:'novo pagamento', 8:'nei Bezuelung'	};
C_XL.d['mtitle payment']		= { 0:'payment',			1:'paiement',			2:'Zapłata',			3:'betaling',				4:'Zahlung',			5:'pagamento',			6:'pago', 				7:'pagamento', 		8:'Bezuelung'	};

C_XL.d['ep-tab overview']		= { 0:'overview',			1:'résumé',				2:'podsumowanie',		3:'overzicht',				4:'Zusammenfassung',	5:'riepilogo',			6:'resumen', 			7:'resumo', 		8:'Iwwerbléck'	};
C_XL.d['ep-tab qrcode']			= { 0:'QR code',			1:'QR code',			2:'QR code',			3:'QR code',				4:'QR code',			5:'QR code',			6:'QR code', 			7:'QR code', 		8:'QR Code'	};
C_XL.d['ep-tab status']			= C_XL.d['progress'];

C_XL.d['ep-paytype not set']	= C_XL.d['mtitle new payment'];

C_XL.d['ep-paytype cash']		= { 0:'cash',				1:'espèce',						2:'gotówka',					3:'contant',				4:'Kasse',				5:'contanti',					6:'dinero', 						7:'dinheiro', 			8:'Boergeld'			};
C_XL.d['ep-paytype sepa qr']	= { 0:'SEPA transaction',	1:'virement SEPA',				2:'przelew SEPA',				3:'SEPA overschrijving',	4:'SEPA-Überweisung',	5:'bonifico SEPA',				6:'transferencia SEPA', 			7:'transferência SEPA', 8:'SEPA Transaktioun'	};
C_XL.d['ep-paytype payconiq']	= { 0:'payconiq',			1:'payconiq',					2:'payconiq',					3:'payconiq',				4:'payconiq',			5:'payconiq',					6:'payconiq', 						7:'payconiq', 			8:'Payconiq'			};
C_XL.d['ep-paytype cards']		= { 0:'bank card',			1:'cartes bancaire',			2:'karta bankowa',				3:'bankpas',				4:'Bankkarte',			5:'Carta di credito',			6:'tarjeta bancaria', 				7:'cartão do banco', 	8:'Bankkaart'	};
C_XL.d['ep-paytype softpos']	= { 0:'SoftPOS (bankcard)',	1:'SoftPOS (carte bancaire)',	2:'SoftPOS (karta bankowa)',	3:'SoftPOS (bankpas)',		4:'SoftPOS (Bankkarte)',	5:'SoftPOS (Carta di credito)',	6:'SoftPOS (tarjeta bancaria)', 	7:'SoftPOS (cartão do banco)', 	8:'SoftPOS (Bankkaart)'	};
C_XL.d['ep-paytype hardpos']	= { 0:'Terminal (bankcard)',1:'Terminal (carte bancaire)',	2:'Terminal (karta bankowa)',	3:'Terminal (bankpas)',		4:'Terminal (Bankkarte)',	5:'Terminal (Carta di credito)',6:'Terminal (tarjeta bancaria)', 	7:'Terminal (cartão do banco)', 8:'Terminal (Bankkaart)'	};

C_XL.d['ep-paytype onlinepayco'] = { 0:'Payconiq Online',	1:'Payconiq Online',			2:'Payconiq Online',			3:'Payconiq Online',	4:'Payconiq Online',		5:'Payconiq Online',	6:'Payconiq Online', 	7:'Payconiq Online', 	8:'Payconiq Online'	};
C_XL.d['ep-paytype onlinecards'] = { 0:'Cards Online',		1:'Par carte Online',			2:'Cards Online',				3:'Bankpas Online',		4:'Bankkarte Online',		5:'Cards Online',		6:'Cards Online', 		7:'Cards Online', 		8:'Kaarte Online'	};
C_XL.d['ep-paytype onlinebancontact'] = { 0:'Bancontact Online', 1:'Bancontact Online',		2:'Bancontact Online',			3:'Bancontact Online',	4:'Bancontact Online',		5:'Bancontact Online',	6:'Bancontact Online', 	7:'Bancontact Online', 	8:'Bancontact Online'	};

C_XL.d['ep-communication']		= { 0:'communication',		1:'communication',		2:'komunikacja',		3:'communicatie',			4:'kommunikation',		5:'comunicazione',		6:'comunicación', 		7:'comunicação', 			8:'Kommunikatioun'	};
C_XL.d['ep-account holder']		= { 0:'holder name',		1:'titulaire',			2:'właściciel konta',	3:'account eigenaar',		4:'Bankkontoinhaber',	5:'titolare di conto',	6:'dueño de cuenta', 	7:'proprietário da conta', 	8:'Kontoinhaber'	};

C_XL.d['ep-payconiq key']		= { 0:'Payconiq key',		1:'clé Payconiq',		2:'Klawisz do Payconiq',			3:'Payconiq sleutel',		4:'Payconiq-Schlüssel',	5:'chiave a Payconiq',		6:'clave a Payconiq', 	7:'Chave Payconiq', 8:'Payconiq Schlëssel'	};

C_XL.d['ep-computop-ec id']		= { 0:'Computop id',		1:'Computop id',		2:'Computop id',			3:'Computop id',		4:'Computop id',	5:'Computop id',		6:'Computop id', 	7:'Computop id', 	8:'Computop ID'		};
C_XL.d['ep-computop-ec pass']	= { 0:'Computop pass',		1:'Computop pass',		2:'Computop pass',			3:'Computop pass',		4:'Computop pass',	5:'Computop pass',		6:'Computop pass', 	7:'Computop pass', 	8:'Computop Pass'	};
C_XL.d['ep-computop-ec hmac']	= { 0:'Computop hmac',		1:'Computop hmac',		2:'Computop hmac',			3:'Computop hmac',		4:'Computop hmac',	5:'Computop hmac',		6:'Computop hmac', 	7:'Computop hmac', 	8:'Computop HMAC'	};

C_XL.d['ep-counterparty']	= { 0:'counterparty account',	1:'compte contrepartie',2:'konto kontrahenta',		3:'account eigenaar',		4:'Konto der Gegenpartei',	5:'conto della controparte',	6:'cuenta de la contraparte', 	7:'conta da contraparte', 	8:'Géigenkonto' };
C_XL.d['ep-operator status']= { 0:'operator status',		1:'status operateur',	2:'status operatora',		3:'operatorstatus',			4:'Betreiber-ID',		5:'stato dell\'operatore',			6:'estado del operador', 		7:'status do operador', 	8:'Bedreiwerstatus' };
C_XL.d['ep-operator transid']= { 0:'operator ident',		1:'identifiant opérateur',	2:'identyfikator operatora',	3:'operator-ID',	4:'Betreiberstatus',	5:'ID operatore',					6:'ident del operador', 		7:'ID do operador', 		8:'Bedreiwer-ID' };

C_XL.d['ep-softpay-sp clid']	= { 0:'softpay client id',		1:'softpay client id',		2:'softpay client id',		3:'softpay client id',		4:'softpay client id',		5:'softpay client id',		6:'softpay client id', 		7:'softpay client id', 		8:'Softpay Client ID'	};
C_XL.d['ep-softpay-sp clsc']	= { 0:'softpay client secret',	1:'softpay client secret',	2:'softpay client secret',	3:'softpay client secret',	4:'softpay client secret',	5:'softpay client secret',	6:'softpay client secret', 	7:'softpay client secret', 	8:'Softpay Client Secret'	};
C_XL.d['ep-softpay-sp appid']	= { 0:'softpay application id',	1:'softpay application id',	2:'softpay application id',	3:'softpay application id',	4:'softpay application id',	5:'softpay application id',	6:'softpay application id', 7:'softpay application id', 8:'Softpay Applikatioun ID'	};

C_XL.d['ep-hardpos-hp clid']	= { 0:'hardpos client id',		1:'hardpos client id',		2:'hardpos client id',		3:'hardpos client id',		4:'hardpos client id',		5:'hardpos client id',		6:'hardpos client id', 		7:'hardpos client id', 		8:'Hardpos Client ID'		};
C_XL.d['ep-hardpos-hp clsc']	= { 0:'hardpos client secret',	1:'hardpos client secret',	2:'hardpos client secret',	3:'hardpos client secret',	4:'hardpos client secret',	5:'hardpos client secret',	6:'hardpos client secret', 	7:'hardpos client secret', 	8:'Hardpos Client Secret'	};
C_XL.d['ep-hardpos-hp token']	= { 0:'hardpos token',			1:'hardpos token',			2:'hardpos token',			3:'hardpos token',			4:'hardpos token',			5:'hardpos token',			6:'hardpos token', 			7:'hardpos token', 			8:'Hardpos Token'	};

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

C_XL.d['ep-tip start payment']	= { 0:'start a payment',	1:'démarrer un paiement',	2:'rozpocznij płatność',	3:'een betaling starten',	4:'eine Zahlung starten',	5:'avviare un pagamento',	6:'iniciar un pago', 	7:'iniciar um pagamento', 8:'Eng Bezuelung starten'	};
C_XL.d['ep-tip qrcode zoom']	= { 
		0:'click to blur the background',	
		1:'cliquez pour flouter l\'arrière plan',	
		2:'kliknij, aby rozmyć tło',
		3:'klik om de achtergrond te vervagen',	
		4:'Klicken Sie, um den Hintergrund unscharf zu machen',	
		5:'fare clic per sfocare lo sfondo',	
		6:'haz clic para desenfocar el fondo', 	
		7:'clique para desfocar o fundo', 
		8:'Klickt fir den Hannergrond ze verschwammen'	
};

C_XL.d['choose a name']		= { 0:'choose a name',		1:'choisir un nom',		2:'Wybierz nazwę',			3:'kies een naam',			4:'wähle einen Namen',			5:'scegli un nome',				6:'escoge un nombre', 			7:'escolha um nome', 			8:'Wielt en Numm'			};
C_XL.d['ep-copy here OTP']	= { 0:'paste here the OTP',	1:'copier ici le OTP',	2:'wklej tutaj OTP',		3:'copiër hier de OTP',		4:'Fügen Sie hier den OTP ein',	5:'incolla qui l\'OTP',			6:'pega aquí el OTP', 			7:'cole aqui o OTP', 			8:'Füügt hei den OTP an'			};
C_XL.d['ep-pair']			= { 0:'pair the device',	1:'associer',			2:'sparuj urządzenie',		3:'verbinden',				4:'Koppeln Sie das Gerät',		5:'associare il dispositivo',	6:'emparejar el dispositivo', 	7:'emparelhar o dispositivo', 	8:'Apparat koppelen' };
C_XL.d['ep-unpair']			= { 0:'un-pair',			1:'dissocier',			2:'dysocjować',				3:'dissociëren',			4:'Entkoppeln Sie das Gerät', 	5:'disaccoppiare',				6:'desemparejar', 				7:'desemparelhar', 			8:'Entkoppelen'			};
C_XL.d['ep-terminal name']	= { 0:'terminal name',		1:'nom du terminal',	2:'nazwa terminala',		3:'betaalautomaat naam',	4:'Terminalname',				5:'nome del terminale',			6:'nombre del terminal', 		7:'nome do terminal', 		8:'Terminalnumm'		};
C_XL.d['ep-OTP']			= { 0:'one time password',	1:'clé de liaison',		2:'klucz łącza',			3:'link sleutel',			4:'einmaliges Passwort',		5:'password una tantum',		6:'contraseña de un solo uso', 	7:'senha de uso único', 	8:'Eenmollegt Passwuert'		};

C_XL.d['ep-operator-unavailable'] = { 
		0:'this payment method is temporarily not available',
		1:'ce moyen de paiement est temporairement indisponible',
		2:'ta metoda płatności jest chwilowo niedostępna',
		3:'deze betaalwijze is tijdelijk niet beschikbaar',
		4:'diese Zahlungsmethode ist vorübergehend nicht verfügbar',
		5:'questo metodo di pagamento è temporaneamente non disponibile',
		6:'este método de pago no está disponible temporalmente', 
		7:'este método de pagamento está temporariamente indisponível', 
		8:'Dëse Bezuelmethod ass temporär net verfügbar' 
};


///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// C_backFIND

C_XL.d['C_backFIND you must activate more filters.']	= { 
	0:'To trigger a search, you need to enable more filters.',	// english
	1:'Pour déclencher une recherche, vous devez activer plus de filtre.',	// french
	2:'Aby uruchomić wyszukiwanie, musisz aktywować więcej filtrów.',	// polish
	3:'Om een zoekopdracht te starten, moet je meer filters activeren.',	// dutch
	4:'Um eine Suche auszulösen, müssen Sie mehr Filter aktivieren.',	// german
	5:'Per avviare una ricerca, è necessario attivare più filtri.',	// italian
	6:'Para iniciar una búsqueda, debes activar más filtros.', 	// spanish
	7:'Para iniciar uma pesquisa, é necessário ativar mais filtros.',	// portuguese
	8:'Fir eng Sich ze starten, muss du méi Filter aktivéieren.'	// luxembourgish
};	

C_XL.d['C_backFIND this search returns no result']	= { 
	0:'This search returns no result.',	// english
	1:'Cette recherche ne retourne aucun résultat.',	// french
	2:'To wyszukiwanie nie zwraca żadnych wyników.',	// polish
	3:'Deze zoekopdracht levert geen resultaten op.',	// dutch
	4:'Diese Suche liefert keine Ergebnisse.',	// german
	5:'Questa ricerca non restituisce alcun risultato.',	// italian
	6:'Esta búsqueda no devuelve ningún resultado.', 	// spanish
	7:'Esta pesquisa não retorna nenhum resultado.',	// portuguese
	8:'Dës Sich liwwert kee Resultat.'	// luxembourgish
};	


C_XL.d['bp-catfilter-colors-none']	= { 
	0:'appointments in which no color is selected',	
	1:'les rendez-vous dans lesquels aucune couleur n\'est sélectionnée', 	
	2:'spotkania, na których nie jest wybrany żaden kolor', 	
	3:'afspraken waarin geen kleur is geselecteerd', 	
	4:'Termine, bei denen keine Farbe ausgewählt ist',	
	5:'appuntamenti in cui non è selezionato alcun colore', 	
	6:'citas en las que no se selecciona ningún color', 	
	7:'compromissos em que nenhuma cor é selecionada', 	
	8:'Rendez-vous, bei deenen keng Faarf ausgewielt ass'	
};

C_XL.d['bp-catfilter-colors-one']	= { 
	0:'only appointments with the color selected above',	
	1:'uniquement les rendez-vous ayant la couleur sélectionnées ci-dessus', 	
	2:'tylko wizyty z kolorem wybranym powyżej', 	
	3:'alleen afspraken met de hierboven geselecteerde kleur', 	
	4:'Nur Termine mit der oben ausgewählten Farbe',	
	5:'solo gli appuntamenti con il colore selezionato sopra', 	
	6:'solo citas con el color seleccionado arriba', 	
	7:'somente agendamentos com a cor selecionada acima', 	
	8:'Nëmme Rendez-vous mat der uewen ausgewielter Faarf'	
};

C_XL.d['bp-catfilter-colors-some']	= { 
	0:'only appointments having one of the colors selected above',	
	1:'uniquement les rendez-vous ayant une des couleurs sélectionnées ci-dessus', 	
	2:'tylko spotkania posiadające jeden z wybranych powyżej kolorów', 	
	3:'alleen afspraken met een van de hierboven geselecteerde kleuren', 	
	4:'Nur Termine mit einer der oben ausgewählten Farben',	
	5:'solo gli appuntamenti aventi uno dei colori sopra selezionati', 	
	6:'sólo citas que tengan uno de los colores seleccionados arriba', 	
	7:'apenas compromissos com uma das cores selecionadas acima', 	
	8:'Nëmme Rendez-vous mat enger vun den uewen ausgewielten Faarwen'	
};

C_XL.d['bp-catfilter-patterns-none']	= { 
	0:'only appointments in which no pattern is selected',	
	1:'les rendez-vous dans lesquels aucun motifs n\'est sélectionné', 	
	2:'tylko spotkania, w których nie wybrano żadnego wzoru', 	
	3:'alleen afspraken waarin geen patroon is geselecteerd', 	
	4:'Nur Termine, bei denen kein Muster ausgewählt ist',	
	5:'solo gli appuntamenti in cui non è selezionato alcun modello', 	
	6:'sólo citas en las que no se selecciona ningún patrón.', 	
	7:'somente compromissos em que nenhum padrão está selecionado', 	
	8:'Nëmme Rendez-vous, bei deenen kee Muster ausgewielt ass'	
};

C_XL.d['bp-catfilter-patterns-one']	= { 
	0:'only appointments with the selected above pattern',	
	1:'uniquement les rendez-vous avec le motif sélectionné ci-dessus', 	
	2:'tylko spotkania z wybranym powyżej wzorem', 	
	3:'alleen afspraken met het hierboven geselecteerde patroon', 	
	4:'Nur Termine mit dem oben ausgewählten Muster',	
	5:'solo gli appuntamenti con il modello sopra selezionato', 	
	6:'solo citas con el patrón seleccionado arriba.', 	
	7:'somente agendamentos com o padrão selecionado acima', 	
	8:'Nëmme Rendez-vous mat dem uewen ausgewielten Muster'	
};

C_XL.d['bp-catfilter-patterns-some']	= { 
	0:'only appointments with one of the patterns selected above',	
	1:'uniquement les rendez-vous ayant un des motifs sélectionnés ci-dessus', 	
	2:'tylko spotkania z jednym z wybranych powyżej wzorów', 	
	3:'alleen afspraken met een van de hierboven geselecteerde patronen', 	
	4:'Nur Termine mit einem der oben ausgewählten Muster',	
	5:'solo appuntamenti con uno dei modelli selezionati sopra', 	
	6:'solo citas con uno de los patrones seleccionados arriba', 	
	7:'apenas agendamentos com um dos padrões selecionados acima', 	
	8:'Nëmme Rendez-vous mat engem vun den uewen ausgewielten Musteren'	
};

C_XL.d['bp-catfilter-user-none']	= { 
	0:'regardless of the user who did it',	
	1:'qu\'elle que soit l\'utilisteur qui l\'a fait', 	
	2:'ale niezależnie od tego, kto ją wykonał', 	
	3:'ongeacht de gebruiker die deze heeft uitgevoerd', 	
	4:'jedoch unabhängig vom Benutzer, der sie ausgeführt hat',	
	5:'indipendentemente dall\'utente che l\'ha eseguita', 	
	6:'anteriormente pero independientemente del usuario que la realizó', 	
	7:'independentemente do usuário que a executou', 	
	8:'Egal wéi en Notzer et gemaach huet'	
};

C_XL.d['bp-catfilter-user-one']	= { 
	0:'only by the selected user',	
	1:'seulement par l\'utilisateur sélectionné', 	
	2:'tylko przez wybranego użytkownika', 	
	3:'alleen door de geselecteerde gebruiker', 	
	4:'nur durch den ausgewählten Benutzer',	
	5:'solo dall\'utente selezionato', 	
	6:'solo por el usuario seleccionado', 	
	7:'somente pelo usuário selecionado', 	
	8:'Nëmme vum ausgewielten Notzer'	
};

C_XL.d['bp-catfilter-user-some']	= { 
	0:'only by selected users',	
	1:'seulement par les utilisateurs sélectionnés', 	
	2:'tylko przez wybranych użytkowników', 	
	3:'alleen door geselecteerde gebruikers', 	
	4:'nur von ausgewählten Benutzern',	
	5:'solo da utenti selezionati', 	
	6:'solo por usuarios seleccionados', 	
	7:'somente por usuários selecionados', 	
	8:'Nëmme vun ausgewielten Notzer'	
};

C_XL.d['bp-catfilter-tags-none']	= { 
	0:'only appointments that have at least one tag',	
	1:'seulement les rendez-vous qui ont au moins un tag', 	
	2:'tylko spotkania, które mają co najmniej jeden tag', 	
	3:'alleen afspraken die minstens één tag hebben', 	
	4:'Nur Termine, die mindestens ein Tag haben',	
	5:'solo gli appuntamenti che hanno almeno un tag', 	
	6:'solo citas que tengan al menos una etiqueta', 	
	7:'apenas compromissos que tenham pelo menos uma tag', 	
	8:'Nëmme Rendez-vous déi op d\'mannst een Tag hunn'	
};

C_XL.d['bp-catfilter-tags-one']	= { 
	0:'only appointments that have the selected tag',	
	1:'seulement les rendez-vous qui ont le tag sélectionné', 	
	2:'tylko spotkania posiadające wybrany tag', 	
	3:'alleen afspraken met de geselecteerde tag', 	
	4:'Nur Termine mit dem ausgewählten Tag',	
	5:'solo gli appuntamenti che hanno il tag selezionato', 	
	6:'solo citas que tengan la etiqueta seleccionada', 	
	7:'apenas compromissos que possuem a tag selecionada', 	
	8:'Nëmme Rendez-vous mat dem ausgewielten Tag'	
};

C_XL.d['bp-catfilter-tags-some']	= { 
	0:'only appointments that have one of the tags you selected',	
	1:'seulement les rendez-vous qui ont l\'un des tags que vous avez sélectionnés', 	
	2:'tylko spotkania posiadające jeden z wybranych tagów', 	
	3:'alleen afspraken met een van de door u geselecteerde tags', 	
	4:'Nur Termine, die eines der von Ihnen ausgewählten Tags haben',	
	5:'solo gli appuntamenti che hanno uno dei tag selezionati', 	
	6:'solo citas que tengan una de las etiquetas que usted seleccionó', 	
	7:'apenas compromissos que tenham uma das tags que você selecionou', 	
	8:'Nëmme Rendez-vous mat engem vun den ausgewielten Tags'	
};

C_XL.d['bp-catfilter-act_1']	= { 
	0:'appointments that were created but never modified nor deleted',	
	1:'rendez-vous créés mais jamais modifiés ni supprimés', 	
	2:'spotkania, które zostały utworzone, ale nigdy nie zostały zmodyfikowane ani usunięte', 	
	3:'afspraken die zijn gemaakt maar nooit zijn gewijzigd of verwijderd', 	
	4:'Termine, die erstellt, aber nie geändert oder gelöscht wurden',	
	5:'appuntamenti creati ma mai modificati né cancellati', 	
	6:'citas que se crearon pero nunca se modificaron ni eliminaron', 	
	7:'compromissos que foram criados, mas nunca modificados nem excluídos', 	
	8:'Rendez-vous, déi erstallt goufen, awer ni geännert oder geläscht goufen'	
};

C_XL.d['bp-catfilter-act_2']	= { 
	0:'appointments that were modified after their creation',	
	1:'les rendez-vous modifiés après leur création', 	
	2:'spotkania, które zostały zmodyfikowane po ich utworzeniu', 	
	3:'afspraken die zijn gewijzigd nadat ze zijn gemaakt', 	
	4:'Besprechungen, die nach ihrer Erstellung geändert wurden',	
	5:'riunioni modificate dopo la loro creazione', 	
	6:'citas que fueron modificadas después de su creación', 	
	7:'reuniões que foram modificadas depois de terem sido criadas', 	
	8:'Rendez-vous, déi no hirer Erschaffung geännert goufen'	
};
C_XL.d['bp-catfilter-act_3']	= { 
	0:'appointments that were created and possibly modified, but are not deleted',	
	1:'des rendez-vous qui ne sont pas supprimés, qu\'ils aient été modifiés ou non', 	
	2:'spotkania, które zostały utworzone i ewentualnie zmodyfikowane, ale nie zostały usunięte', 	
	3:'afspraken die zijn aangemaakt en eventueel gewijzigd, maar niet zijn verwijderd', 	
	4:'Termine, die nicht gelöscht werden, unabhängig davon, ob sie geändert wurden oder nicht',	
	5:'appuntamenti che non vengono cancellati, indipendentemente dal fatto che siano stati modificati o meno', 	
	6:'citas que se crearon y posiblemente modificaron, pero que no se eliminan', 	
	7:'compromissos que não são excluídos, independentemente de terem sido modificados ou não', 	
	8:'Rendez-vous, déi erstallt a vläicht geännert goufen, awer net geläscht sinn'	
};

C_XL.d['bp-catfilter-act_4']	= { 
	0:'appointments that are deleted regardless if they were modified or not',	
	1:'les rendez-vous supprimés, qu\'ils aient été modifiés ou non', 	
	2:'spotkania, które są usuwane niezależnie od tego, czy zostały zmodyfikowane, czy nie', 	
	3:'afspraken die worden verwijderd, ongeacht of ze zijn gewijzigd of niet', 	
	4:'Termine, die gelöscht werden, unabhängig davon, ob sie geändert wurden oder nicht',	
	5:'appuntamenti che vengono cancellati indipendentemente dal fatto che siano stati modificati o meno', 	
	6:'citas que se eliminan independientemente de si fueron modificadas o no', 	
	7:'compromissos que são excluídos independentemente de terem sido modificados ou não', 	
	8:'Rendez-vous, déi geläscht sinn, egal ob se geännert goufen oder net'	
};

C_XL.d['bp-catfilter-act_5']	= { 
	0:'appointments that were never modified and are deleted',	
	1:'les rendez-vous qui n\'ont jamais été modifiés et sont supprimés', 	
	2:'spotkania, które nigdy nie zostały zmodyfikowane i zostały usunięte', 	
	3:'afspraken die nooit zijn gewijzigd en worden verwijderd', 	
	4:'Termine, die nie geändert wurden und gelöscht werden',	
	5:'gli appuntamenti che non sono mai stati modificati e vengono cancellati', 	
	6:'citas que nunca fueron modificadas y se eliminan', 	
	7:'compromissos que nunca foram modificados e são excluídos', 	
	8:'Rendez-vous, déi ni geännert goufen a geläscht sinn'	
};

C_XL.d['bp-catfilter-act_67']	= { 
	0:'appointments that were modified then deleted',	
	1:'rendez-vous qui ont été modifiés puis supprimés', 	
	2:'spotkania, które zostały zmodyfikowane, a następnie usunięte', 	
	3:'afspraken die zijn gewijzigd en vervolgens verwijderd', 	
	4:'Termine, die geändert und dann gelöscht wurden',	
	5:'appuntamenti modificati e poi cancellati', 	
	6:'citas que fueron modificadas y luego eliminadas', 	
	7:'compromissos que foram modificados e depois excluídos', 	
	8:'Rendez-vous, déi geännert a duerno geläscht goufen'	
};

C_XL.d['bp-catfilter-wcode']	= { 
	0:'you can multi-select by holding down the Ctrl key while you click the desired items, finish with the enter key.',	
	1:'vous pouvez effectuer une sélection multiple en maintenant la touche Ctrl enfoncée pendant que vous cliquez sur les éléments souhaités, terminez avec la touche Entrée.', 	
	2:'możesz dokonać wielokrotnego wyboru, przytrzymując klawisz Ctrl podczas klikania żądanych elementów, a następnie zakończ klawiszem Enter.', 	
	3:'u kunt meervoudig selecteren door de Ctrl-toets ingedrukt te houden terwijl u op de gewenste items klikt, en eindig met de enter-toets.', 	
	4:'Sie können eine Mehrfachauswahl durchführen, indem Sie die Strg-Taste gedrückt halten, während Sie auf die gewünschten Elemente klicken. Beenden Sie den Vorgang mit der Eingabetaste.',	
	5:'puoi effettuare una selezione multipla tenendo premuto il tasto Ctrl mentre fai clic sugli elementi desiderati e termina con il tasto Invio.', 	
	6:'puede realizar una selección múltiple manteniendo presionada la tecla Ctrl mientras hace clic en los elementos deseados y finalice con la tecla Intro.', 	
	7:'você pode fazer uma seleção múltipla mantendo pressionada a tecla Ctrl enquanto clica nos itens desejados e finalize com a tecla Enter.', 	
	8:'Dir kënnt Multiple auswielen andeems Dir d\'Ctrl-Tast gedréckt hält wärend Dir op déi gewënscht Elementer klickt, ofschléissen mat der Enter-Tast.'	
};


///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//

C_XL.d['bp_ep_receivablesonly']	= { 
	0:'only those appointments with a positive or negative balance',
	1:'uniquement les rendez-vous avec un solde positif ou négatif',
	2:'tylko te spotkania z dodatnim lub ujemnym saldem',
	3:'alleen die afspraken met een positief of negatief saldo',
	4:'nur die Termine mit einem positiven oder negativen Saldo',	
	5:'solo gli appuntamenti con saldo positivo o negativo',	
	6:'sólo aquellas citas con saldo positivo o negativo',
	7:'apenas aquelas nomeações com saldo positivo ou negativo',
	8:'Nëmmen déi Rendez-vous mat engem positiven oder negativen Saldo'
};

C_XL.d['bp_ep_receivablespaymeans']	= { 
	0:'only appointments with a positive or negative balance and with successful payment(s) of the selected types',
	1:'uniquement les rendez-vous avec un solde positif ou négatif et avec paiement(s) réussi(s) des types sélectionnés',
	2:'tylko spotkania z saldem dodatnim lub ujemnym i pomyślnymi płatnościami wybranych typów',
	3:'alleen afspraken met een positief of negatief saldo en met succesvolle betaling(en) van de geselecteerde typen',
	4:'Nur Termine mit positivem oder negativem Saldo und erfolgreicher Zahlung(en) der ausgewählten Arten',	
	5:'solo appuntamenti con saldo positivo o negativo e con pagamento/i andato a buon fine delle tipologie selezionate',	
	6:'sólo citas con un saldo positivo o negativo y con pago(s) exitoso(s) de los tipos seleccionados',
	7:'apenas agendamentos com saldo positivo ou negativo e com pagamento(s) bem-sucedido(s) dos tipos selecionados',
	8:'Nëmmen déi Rendez-vous mat engem positiven oder negativen Saldo an erfollegräicher Bezuelung vun den ausgewielten Aarten'
};

C_XL.d['bp_ep_paymeansonly']	= { 
	0:'only appointments with successful payment(s) of the selected types',
	1:'uniquement les rendez-vous avec paiement(s) réussi(s) parmis les types sélectionnés',
	2:'tylko spotkania z pomyślnymi płatnościami wybranych typów',
	3:'alleen afspraken met succesvolle betaling(en) van de geselecteerde typen',
	4:'Nur Termine mit erfolgreicher Zahlung(en) der ausgewählten Arten',	
	5:'solo gli appuntamenti con pagamento/i andato a buon fine delle tipologie selezionate',	
	6:'solo citas con pagos exitosos de los tipos seleccionados',
	7:'apenas agendamentos com pagamento(s) bem-sucedido(s) dos tipos selecionados',
	8:'Nëmmen déi Rendez-vous mat erfollegräicher Bezuelung vun den ausgewielten Aarten'
};

C_XL.d['bp_ep_noneoffilters']	= { 
	0:'all appointments having successful payment(s)',
	1:'tous les rendez-vous ayant un (ou des) paiement(s) réussi(s)',
	2:'wszystkie spotkania zakończone pomyślną płatnością',
	3:'alle afspraken met succesvolle betaling(en)',
	4:'Alle Termine mit erfolgreicher Zahlung(en)',	
	5:'tutti gli appuntamenti con pagamento/i andato a buon fine',	
	6:'todas las citas tienen pagos exitosos',
	7:'todos os agendamentos com pagamento(s) bem-sucedido(s)',
	8:'All Rendez-vous mat erfollegräicher Bezuelung'
};

C_XL.d['bp-catfilter-epay-gopid']	= { 
	0:'in order to find a payment using its numeric identifier, also activate the "Keyword" filter and indicate the payment identifier there.',
	1:'pour trouver un paiement à partir de son identifiant numérique, activez également le filtre "Mot clé" et indiquez-y l\'identifiant du paiement.',
	2:'aby znaleźć płatność po jej identyfikatorze cyfrowym, należy także włączyć filtr „Słowo kluczowe” i wskazać tam identyfikator płatności.',
	3:'om een ​​betaling te vinden met behulp van de digitale identificatiecode, activeert u ook het filter "Trefwoord" en geeft u daar de betalingsidentificatie op.',
	4:'Um eine Zahlung anhand ihrer digitalen Kennung zu finden, aktivieren Sie zusätzlich den Filter „Stichwort“ und geben Sie dort die Zahlungskennung an.',
	5:'per trovare un pagamento tramite il suo identificatore digitale, attiva anche il filtro "Parola chiave" e indica lì l\'identificativo del pagamento.',
	6:'para encontrar un pago utilizando su identificador digital, active también el filtro "Palabra clave" e indique allí el identificador de pago.',
	7:'para localizar um pagamento através do seu identificador digital, ative também o filtro “Palavra-chave” e indique aí o identificador do pagamento.',
	8:'Fir eng Bezuelung mat hirer numerescher ID ze fannen, aktivéiert och de Filter "Schlësselwuert" an gitt do d\'Bezuel-ID un.'
};

C_XL.d['bp-catfilter-keyword-dopid']	= { 
	0:'to find an appointment from a payment, enter the payment identifier here, for example "pid10011160".',
	1:'pour trouver un rdv à partir d\'un paiement indiquez ici l\'identifiant du paiement, par exemple "pid10011160".',
	2:'aby znaleźć termin z płatności wpisz tutaj identyfikator płatności, np. "pid10011160".',
	3:'om een ​​afspraak uit een betaling te vinden, voert u hier de betalingsidentificatie in, bijvoorbeeld "pid10011160".',
	4:'Um einen Termin aus einer Zahlung zu finden, geben Sie hier die Zahlungskennung ein, zum Beispiel „pid10011160“.',
	5:'per trovare un appuntamento da un pagamento, inserisci qui l\'identificativo del pagamento, ad esempio "pid10011160".',
	6:'para buscar una cita a partir de un pago, ingrese aquí el identificador de pago, por ejemplo "pid10011160".',
	7:'para localizar um agendamento de um pagamento, insira aqui o identificador do pagamento, por exemplo "pid10011160".',
	8:'Fir en Rendez-vous vun enger Bezuelung ze fannen, gitt hei d\'Bezuel-ID an, zum Beispill "pid10011160".'
};

C_XL.d['bp-catfilter-keyword-empty']	= { 
	0:'Appointments for which the note is not empty.',	
	1:'Les rendez-vous pour lesquels la note n\'est pas vide.',	
	2:'Spotkania, dla których notatka nie jest pusta.',	
	3:'Afspraken waarvoor de notitie niet leeg is.',	
	4:'Termine, bei denen die Notiz nicht leer ist.',	
	5:'Appuntamenti per i quali la nota non è vuota.',	
	6:'Citas cuya nota no está vacía.', 	
	7:'Compromissos para os quais a nota não está vazia.',	
	8:'Rendez-vous, bei deenen d\'Notiz net eidel ass.'	
};


C_XL.d['bp-catfilter-keyword-default']	= { 
	0:'Show appointments that contain a keyword in the note field. To trigger a search, the keyword must be at least 5 characters long.',	
	1:'Afficher les rendez-vous qui contiennent un mot clé dans le champs note. Pour déclencher une recherche, le mot clé doit faire au minimum 5 caractères.',	
	2:'Pokaż spotkania zawierające słowo kluczowe w polu notatki. Aby rozpocząć wyszukiwanie, słowo kluczowe musi mieć co najmniej 5 znaków.',	
	3:'Toon afspraken die een trefwoord bevatten in het notitieveld. Om een ​​zoekopdracht te activeren, moet het trefwoord minimaal 5 tekens lang zijn.',	
	4:'Termine anzeigen, die ein Schlüsselwort im Notizfeld enthalten. Um eine Suche auszulösen, muss das Schlüsselwort mindestens 5 Zeichen lang sein.',	
	5:'Mostra gli appuntamenti che contengono una parola chiave nel campo nota. Per attivare una ricerca, la parola chiave deve contenere almeno 5 caratteri.',	
	6:'Mostrar citas que contengan una palabra clave en el campo de nota. Para activar una búsqueda, la palabra clave debe tener al menos 5 caracteres.', 	
	7:'Mostre compromissos que contenham uma palavra-chave no campo de observação. Para acionar uma pesquisa, a palavra-chave deve ter pelo menos 5 caracteres.', 	
	8:'Weist Rendez-vous déi e Schlësselwuert am Notizfeld hunn. Fir eng Sich auszeléisen, muss d\'Schlësselwuert op d\'mannst 5 Zeechen laang sinn.'	
};

C_XL.d['bp-catfilter-keyword-ispid']	= { 
	0:'Display the appointment for which one of the payments has the following digital identifier:',	
	1:'Afficher le RDV dont un des paiements a l\'identifiant numérique suivant: ',	
	2:'Wyświetl wizytę, dla której jedna z płatności ma następujący identyfikator cyfrowy: ',	
	3:'Geef de afspraak weer waarvoor een van de betalingen de volgende digitale identificatie heeft: ',	
	4:'Zeigen Sie den Termin an, für den eine der Zahlungen die digitale Kennung hat: ',	
	5:'Visualizzare l\'appuntamento per il quale uno dei pagamenti ha il seguente identificativo digitale: ',	
	6:'Visualice la cita para la cual uno de los pagos tiene el siguiente identificador digital: ', 	
	7:'Exiba o agendamento para o qual um dos pagamentos possui o seguinte identificador digital: ', 	
	8:'Weist de Rendez-vous fir deen eng vun de Bezuelungen déi folgend digital ID huet:'	
};


C_XL.d['bp-catfilter-visitor-default']	= { 
	0:'Only appointments involving one of the selected visitors.',	// english
	1:'Seulement les RDVs impliquant l\'un des visitors sélectionnés.',	// french
	2:'Tylko wizyty obejmujące jednego z wybranych visitors.',	// polish
	3:'Alleen afspraken waarbij een van de geselecteerde visitors betrokken is.',	// dutch
	4:'Nur Termine, an denen einer der ausgewählten visitors beteiligt ist.',	// german
	5:'Solo gli appuntamenti che coinvolgono uno dei visitors selezionati.',	// italian
	6:'Solo las citas que implican a uno de los visitors seleccionados.', 	// spanish
	7:'Apenas os compromissos que envolvem um dos visitors selecionados.',	// portuguese
	8:'Nëmmen Rendez-vousen, déi ee vun de gewielte visitors betreffen.',	// luxembourgish
};	

C_XL.d['bp-catfilter-visitor-empty']	= { 
	0:'Only appointments involving at least one visitor.',	// english
	1:'Seulement les RDVs impliquant au moins un visitor.',	// french
	2:'Tylko wizyty obejmujące co najmniej jednego visitor.',	// polish
	3:'Alleen afspraken waarbij minstens één visitor betrokken is.',	// dutch
	4:'Nur Termine, an denen mindestens ein visitor beteiligt ist.',	// german
	5:'Solo gli appuntamenti che coinvolgono almeno un visitor.',	// italian
	6:'Solo las citas que implican al menos un visitor.', 	// spanish
	7:'Apenas os compromissos que envolvem pelo menos um visitor.',	// portuguese
	8:'Nëmmen Rendez-vousen, déi op mannst ee visitor betreffen.',	// luxembourgish
};	

C_XL.d['bp-catfilter-visitor-typing']	= { 
	0:'The search starts after the 3rd character and when you stop typing in the field for one second. Once the candidates are shown, you can keep filtering by adding more letters.',	// english
	1:'La recherche se déclenche à partir du 3e caractère et si vous arrêtez de remplir le champs pendant une seconde. Une fois les candidats affichés, vous pouvez continuer de filter en ajountant encore des lettres.',	// french
	2:'Wyszukiwanie uruchamia się po wpisaniu 3. znaku i gdy przestaniesz pisać w polu przez jedną sekundę. Po wyświetleniu kandydatów możesz dalej filtrować, dodając kolejne litery.',	// polish
	3:'Zoeken wordt gestart na het 3e teken en wanneer je één seconde stopt met typen in het veld. Zodra de kandidaten worden weergegeven, kun je verder filteren door extra letters toe te voegen.',	// dutch
	4:'Die Suche startet nach dem 3. Zeichen und wenn du eine Sekunde lang nichts mehr in das Feld eingibst. Sobald die Kandidaten angezeigt werden, kannst du weiter filtern, indem du weitere Buchstaben hinzufügst.',	// german
	5:'La ricerca si avvia dopo il 3º carattere e quando smetti di scrivere nel campo per un secondo. Una volta visualizzati i candidati, puoi continuare a filtrare aggiungendo altre lettere.',	// italian
	6:'La búsqueda se inicia a partir del 3er carácter y cuando dejas de escribir en el campo durante un segundo. Una vez que se muestran los candidatos, puedes seguir filtrando añadiendo más letras.', 	// spanish
	7:'A pesquisa é iniciada a partir do 3.º caractere e quando você para de escrever no campo por um segundo. Depois que os candidatos são exibidos, você pode continuar filtrando adicionando mais letras.',	// portuguese
	8:'D\'Sich fänkt nom 3. Zeechen un an dann, wann s du eng Sekonn laang näischt méi am Feld tipps. Soubal d\'Kandidaten ugewisen ginn, kanns du weider filteren, andeems s du nach Buschtawen dobäisetz.',	// luxembourgish
};	




C_XL.d['eptab-cash'] = { 
	0:'cash', 
	1:'espèces', 
	2:'gotówkowa', 
	3:'contant', 
	4:'barzahlung', 
	5:'contanti', 
	6:'efectivo', 
	7:'numerário', 
	8:'Boergeld' 
};

C_XL.d['eptab-payco']		= { 
	0:'Bancontact/Payconiq QR-code', 
	1:'QR-code Bancontact/Payconiq', 
	2:'kod QR Bancontact/Payconiq', 
	3:'QR-code Bancontact/Payconiq', 
	4:'QR-Code Bancontact/Payconiq', 
	5:'codice QR Bancontact/Payconiq', 
	6:'código QR Bancontact/Payconiq', 
	7:'código QR Bancontact/Payconiq', 
	8:'Bancontact/Payconiq QR-Code' 
};

C_XL.d['eptab-SEPA']		= { 
	0:'free SEPA QR-code', 
	1:'QR-code SEPA sans frais', 
	2:'darmowy kod QR SEPA', 
	3:'gratis SEPA QR-code', 
	4:'Kostenloser SEPA-QR-Code', 
	5:'codice QR SEPA gratuito', 
	6:'código QR SEPA gratuito', 
	7:'código QR SEPA gratuito', 
	8:'Gratis SEPA QR-Code' 
};

// 		technical 				english:0,				french:1,					polish:2,				dutch:3,					german:4,					italian:5,					spanish:6,					portuguese:7, 	luxembourgish:8

C_XL.d['eptab-bcards']	= { 
		0:'bank cards, on site and online', 
		1:'cartes bancaires, sur place et en ligne', 
		2:'karty bankowe, na miejscu i online', 
		3:'bankkaarten, ter plaatse en online', 
		4:'Bankkarten, vor Ort und online', 
		5:'carte bancarie, in sede e online', 
		6:'tarjetas bancarias, presencial y online', 
		7:'cartões bancários, no local e online', 
		8:'Bankkaarten, op der Plaz an online'
};

C_XL.d['eptab-title']	= { 
		0:'on-site and online payments', 
		1:'paiements sur place et en ligne',
		2:'płatności na miejscu i online', 
		3:'betalingen ter plaatse en online', 
		4:'Zahlungen vor Ort und online', 
		5:'pagamenti in sede e online', 
		6:'pagos en sitio y en línea', 
		7:'pagamentos no local e online', 
		8:'Bezuelungen op der Plaz an online'
};

C_XL.d['epctab-intro']	= { 
		0:'with these optional features, you can trigger a payment from your agenda, monitor the status of payments and generate reports. Our payment solutions are secure, reliable and among the most affordable on the market.', 
		1:'avec ces options, vous pouvez déclencher un paiement depuis l\'agenda, consulter le statut des paiements et générer des rapports. Nos solutions de paiement sont sécurisées, fiables et parmi les moins chers du marché.', 
		2:'dzięki tym opcjom można uruchomić płatność z dziennika, sprawdzić status płatności i generować raporty. Nasze opcje płatności są bezpieczne, sprawdzone i jedne z najtańszych na rynku.', 
		3:'met deze opties kunt u een betaling activeren vanuit de agenda, de status van betalingen controleren en rapporten genereren. Onze betaaloplossingen zijn veilig, betrouwbaar en een van de goedkoopste op de markt.', 
		4:'mit diesen Optionen können Sie eine Zahlung aus dem Kalender auslösen, den Status von Zahlungen abfragen und Berichte erstellen. Unsere Zahlungslösungen sind sicher, zuverlässig und gehören zu den günstigsten auf dem Markt.', 
		5:'Con queste opzioni è possibile attivare un pagamento dall\'agenda, controllare lo stato dei pagamenti e generare report. Le nostre soluzioni di pagamento sono sicure, affidabili e tra le più economiche del mercato.', 
		6:'con estas opciones, puede activar un pago desde la agenda, comprobar el estado de los pagos y generar informes. Nuestras soluciones de pago son seguras, fiables y se encuentran entre las más baratas del mercado.', 
		7:'com estas opções, pode acionar um pagamento a partir da agenda, verificar o estado dos pagamentos e gerar relatórios. As nossas soluções de pagamento são seguras, fiáveis e das mais baratas do mercado.', 
		8:'Mat dësen Optiounen kënnt Dir eng Bezuelung vun Ärer Agenda ausléis, de Status vun de Bezuelungen iwwerwaachen a Berichter generéieren. Eis Bezuelungsléisunge sinn sécher, zouverlässeg a gehéieren zu de bëllegsten um Maart.'
};

C_XL.d['epctab-title1-QR']	= { 
		0:'free QR code payment', 
		1:'paiement par QR code gratuit', 
		2:'bezpłatna zapłata kodem QR', 
		3:'betaling via vrije QR-code', 
		4:'kostenlose Zahlung per QR-Code', 
		5:'pagamento gratuito tramite codice QR', 
		6:'pago mediante código QR gratuito', 
		7:'pagamento gratuito por código QR', 
		8:'Gratis QR-Code Bezuelung'
};

C_XL.d['epctab-chap1-QR']	= { 
		0:'you pay no transaction fees when you use Mobminder QR codes. Our SEPA QR codes work throughout Europe.', 
		1:'vous ne payez aucun frais de transaction en utilisant les QR code Mobminder. Nos QR-code SEPA fonctionnent dans toute l\'Europe.', 
		2:'korzystając z kodów QR Mobminder, nie ponosisz żadnych opłat transakcyjnych. Nasze kody SEPA QR działają w całej Europie.', 
		3:'u betaalt geen transactiekosten wanneer u Mobminder QR codes gebruikt. Onze SEPA QR codes werken in heel Europa.', 
		4:'wenn Sie Mobminder QR-Codes verwenden, zahlen Sie keine Transaktionsgebühren. Unsere SEPA-QR-Codes funktionieren in ganz Europa.', 
		5:'quando utilizzate i codici QR di Mobminder non pagate alcuna commissione di transazione. I nostri codici QR SEPA funzionano in tutta Europa.', 
		6:'con los códigos QR de Mobminder no pagará comisiones por transacción. Nuestros códigos QR SEPA funcionan en toda Europa.', 
		7:'ao utilizar os códigos QR Mobminder, não paga taxas de transação. Os nossos códigos QR SEPA funcionam em toda a Europa.', 
		8:'Dir bezuelt keng Transaktiounsfraise wann Dir Mobminder QR-Codes benotzt. Eis SEPA QR-Codes funktionéieren an ganz Europa.'
};

// 		technical 				english:0,					french:1,							polish:2,						dutch:3,						german:4,							italian:5,							spanish:6,								portuguese:7, 	luxembourgish:8
C_XL.d['epctab-title2-QR'] = { 
	0:'Payconiq QR code payment', 
	1:'paiement par QR code Payconiq', 
	2:'płatność kodem QR Payconiq', 
	3:'betaling met Payconiq QR-code', 
	4:'zahlung per QR-Code Payconiq', 
	5:'pagamento con codice QR Payconiq', 
	6:'pago mediante código QR Payconiq', 
	7:'pagamento por código QR Payconiq', 
	8:'Payconiq QR-Code Bezuelung' 
};

C_XL.d['epctab-chap2-QR'] = { 
	0:'your agenda generates Payconiq QR codes. If you already have a Payconiq account, we can link it to your agenda.', 
	1:'votre agenda génère des QR code Payconiq. Si vous disposez déjà d\'un compte Payconiq, nous pouvons le lier à votre agenda.', 
	2:'twój kalendarz generuje kody QR Payconiq. Jeśli masz już konto Payconiq, możemy połączyć je z Twoim dziennikiem.', 
	3:'uw agenda genereert Payconiq QR-codes (beschikbaar in België en Luxemburg). Als u al een Payconiq-account hebt, kunnen we deze aan uw agenda koppelen.', 
	4:'ihr Terminplaner generiert Payconiq-QR-Codes. Wenn Sie bereits ein Payconiq-Konto haben, können wir es mit Ihrem Terminplaner verknüpfen.', 
	5:'la vostra agenda genera codici QR Payconiq. Se avete già un conto Payconiq, possiamo collegarlo alla vostra agenda.', 
	6:'su agenda genera códigos QR Payconiq (disponibles en Bélgica y Luxemburgo). Si ya tienes una cuenta Payconiq, podemos vincularla a tu agenda.', 
	7:'a sua agenda gera códigos QR Payconiq. Se já tem uma conta Payconiq, podemos associá-la à sua agenda.', 
	8:'Är Agenda generéiert Payconiq QR-Coden. Wann Dir schonn e Payconiq-Konto hutt, kënne mir en un Är Agenda verbannen.' 
};

C_XL.d['epctab-title3-BC'] = { 
	0:'bank card reading with fixed payment terminal', 
	1:'lecture de carte bancaire avec un terminal de paiement', 
	2:'odczytywanie karty bankowej za pomocą terminala płatności', 
	3:'bankkaart lezen met een betaalterminal', 
	4:'lesen einer Bankkarte durch ein Zahlungsterminal', 
	5:'lettura di una carta bancaria con un terminale di pagamento', 
	6:'lectura de una tarjeta bancaria con un terminal de pago', 
	7:'leitura de um cartão bancário num terminal de pagamento', 
	8:'Bankkaarten liesen mat engem festen Terminal' 
};

C_XL.d['epctab-chap3-BC'] = { 
	0:'you trigger payments directly from your agenda. We negotiate the best transaction fees with the banks.', 
	1:'vous déclenchez les paiements directement depuis votre agenda. Nous négocions avec les banques les meilleurs taux transactionnels.', 
	2:'uruchamiasz płatności bezpośrednio ze swojego kalendarza. Negocjujemy najlepsze warunki transakcji z bankami.', 
	3:'u activeert betalingen rechtstreeks vanuit uw agenda. Wij onderhandelen met de banken over de beste transactietarieven.', 
	4:'lösen Sie die Zahlungen direkt von Ihrem Terminkalender aus. Wir verhandeln mit den Banken über die besten Transaktionsraten.', 
	5:'attivare i pagamenti direttamente dalla vostra agenda. Negoziamo con le banche i migliori tassi di transazione.', 
	6:'usted activa los pagos directamente desde su agenda. Negociamos las mejores tarifas de transacción con los bancos.', 
	7:'desencadear pagamentos diretamente a partir da sua agenda. Negociamos com os bancos para obter as melhores taxas de transação.', 
	8:'Dir kënnt Bezuelungen direkt vun Ärer Agenda ausléisen. Mir verhandelen déi bescht Transaktiounsfraise mat de Banken.' 
};

C_XL.d['epctab-title4-SP'] = { 
	0:'bank card reading with your smartphone', 
	1:'lecture de carte avec votre smartphone', 
	2:'odczytywanie kart za pomocą smartfona', 
	3:'bankkaart lezen met uw smartphone', 
	4:'kartenlesen mit Ihrem Smartphone ', 
	5:'lettura di mappe con lo smartphone', 
	6:'lectura de mapas con su smartphone', 
	7:'leitura de mapas com o seu smartphone', 
	8:'Bankkaarten liesen mat Ärem Smartphone' 
};

C_XL.d['epctab-chap4-SP'] = { 
	0:'you can accept contactless payments with your phone using our Mobminder Pay mobile application. This solution removes the need to purchase and maintain a payment terminal. You can also use it wherever you are.', 
	1:'vous acceptez les paiements sans contact avec votre téléphone grâce à notre application mobile Mobminder Pay. Cette solution vous évite l\'achat et la maintenance d\'un terminal de paiement. Elle vous accompagne également où que vous soyez.', 
	2:'akceptujesz za pośrednictwem swojego telefonu płatności bezstykowe, korzystając z naszej aplikacji mobilnej Mobminder Pay. To rozwiązanie eliminuje potrzebę zakupu i utrzymania terminala płatniczego. I jest z Tobą, gdziekolwiek jesteś.', 
	3:'accepteer contactloze betalingen met uw smartphone via onze mobiele applicatie Mobminder Pay. Met deze oplossing hoeft u geen betaalterminal aan te schaffen en te onderhouden. Bovendien gaat het overal met u mee.', 
	4:'sie akzeptieren kontaktlose Zahlungen mit Ihrem Telefon über unsere mobile Anwendung Mobminder Pay. Diese Lösung erspart Ihnen den Kauf und die Wartung eines Zahlungsterminals. Außerdem begleitet sie Sie, wo immer Sie sind.', 
	5:'accettate pagamenti senza contatto con il vostro telefono tramite la nostra applicazione mobile Mobminder Pay. Questa soluzione vi evita di dover acquistare e mantenere un terminale di pagamento. Inoltre, viene portata con voi ovunque andiate.', 
	6:'puede aceptar pagos sin contacto con su teléfono utilizando nuestra aplicación móvil Mobminder Pay. Esta solución elimina la necesidad de comprar y mantener un terminal de pago. Y va con usted dondequiera que esté.', 
	7:'aceita pagamentos sem contacto com o seu telemóvel utilizando a nossa aplicação móvel Mobminder Pay. Esta solução elimina a necessidade de adquirir e manter um terminal de pagamento. E vai consigo para onde quer que esteja.', 
	8:'Dir kënnt kontaktlos Bezuelungen mat Ärem Telefon akzeptéieren iwwer eis Mobminder Pay App. Dës Léisung eliminéiert d\'Notwendegkeet fir e Bezuelterminal ze kafen oder ze pflegen an ass iwwerall mat Iech.' 
};



C_XL.d['epctab-title5-OP'] = { 0:'online prepayment', 1:'prépaiement en ligne', 2:'zaliczka online', 3:'online vooruitbetaling', 4:'online-Vorauszahlung', 5:'pagamento anticipato online', 6:'prepago en línea', 7:'pré-pagamento em linha', 8:'Online Virausbezuelung' };

C_XL.d['epctab-chap5-OP'] = { 
	0:'prevent non-payment and no-shows. Linked to your online appointment booking page, you can specify the amount of the prepayment to be collected for each service.', 
	1:'evitez les impayés et les no-shows. Associé à votre page de prise de rendez-vous en ligne, vous précisez pour chaque prestation le montant de l\'acompte à prélever.', 
	2:'uniknąć niezapłaconych rachunków i nieobecności. Na stronie rezerwacji wizyt online można określić kwotę depozytu, która ma zostać potrącona za każdą usługę.', 
	3:'voorkom onbetaalde rekeningen en no-shows. Gekoppeld aan de online afsprakenboekingspagina specificeert u het bedrag van het voorschot voor elk type prestatie dat moet worden betaald.', 
	4:'vermeiden Sie unbezahlte Rechnungen und No-Shows. In Verbindung mit Ihrer Online-Terminvereinbarungsseite geben Sie für jede Leistung an, wie hoch die zu erhebende Anzahlung sein soll.', 
	5:'evitare fatture non pagate e no-show. Collegato alla pagina di prenotazione degli appuntamenti online, è possibile specificare l\'importo del deposito da detrarre per ogni servizio.', 
	6:'evite impagos y ausencias. Vinculado a su página de reserva de citas en línea, puede especificar el importe del depósito que se deducirá por cada servicio.', 
	7:'evite facturas por pagar e faltas de comparência. Ligado à sua página de marcação de consultas em linha, pode especificar o montante do depósito a deduzir por cada serviço.', 
	8:'Vermeit onbezuelt Rechnungen a No-Shows. Verbonne mat Ärer Online-Rendez-vous Buchungsäit kënnt Dir den Betrag vun der Virausbezuelung fir all Service uginn.' 
};

C_XL.d['epctab-contact'] = { 
	0:'to activate this feature, contact your account manager', 
	1:'pour activer cette fonctionnalité, contactez votre gestionnaire de compte', 
	2:'aby aktywować tę opcję, należy skontaktować się z menadżerem konta', 
	3:'neem contact op met uw accountmanager om deze optie te activeren', 
	4:'um diese Funktionalität zu aktivieren, wenden Sie sich an Ihren Account Manager', 
	5:'per attivare questa funzione, contattare il proprio account manager', 
	6:'para activar esta funcionalidad, póngase en contacto con su gestor de cuenta', 
	7:'para ativar esta funcionalidade, contacte o seu gestor de conta', 
	8:'Fir dës Funktioun z\'aktivéieren, kontaktéiert Äre Kontmanager.' 
};

C_XL.d['qr online payment'] = { 0:'Online payment', 1:'Paiement en ligne', 2:'Płatność online', 3:'Online betaling', 4:'Onlinebezahlung', 5:'Pagamento online', 6:'Pago en línea', 7:'Pagamento online', 8:'Online Bezuelung' };
C_XL.d['qr amount'] = { 0:'Amount (EUR)', 1:'Montant (EUR)', 2:'Kwota (EUR)', 3:'Bedrag (EUR)', 4:'Betrag (EUR)', 5:'Importo (EUR)', 6:'Importe (EUR)', 7:'Valor (EUR)', 8:'Betrag (EUR)' };
C_XL.d['qr communication'] = { 0:'Communication', 1:'Communication', 2:'Komunikacja', 3:'Communicatie', 4:'Kommunikation', 5:'Comunicazione', 6:'Comunicación', 7:'Comunicação', 8:'Kommunikatioun' };
C_XL.d['qr beneficiary name'] = { 0:'Beneficiary name', 1:'Nom bénéficiaire', 2:'Nazwa odbiorcy', 3:'Naam begunstigde', 4:'Name des Begünstigten', 5:'Nome del beneficiario', 6:'Nombre del Beneficiario', 7:'Nome do beneficiário', 8:'Numm vum Beneficiaire' };
C_XL.d['qr beneficiary account'] = { 0:'Beneficiary account IBAN', 1:'IBAN du compte bénéficiaire', 2:'Konto beneficjenta (IBAN)', 3:'Begunstigdenrekening (IBAN)', 4:'Empfängerkonto (IBAN)', 5:'Conto beneficiario (IBAN)', 6:'Cuenta de beneficiario (IBAN)', 7:'Conta do beneficiário (IBAN)', 8:'IBAN vum Beneficiaire' };
C_XL.d['qr beneficiary bic'] = { 0:'Beneficiary account BIC', 1:'BIC du compte bénéficiaire', 2:'Konto beneficjenta (BIC)', 3:'Begunstigdenrekening (BIC)', 4:'Empfängerkonto (BIC)', 5:'Conto beneficiario (BIC)', 6:'Cuenta de beneficiario (BIC)', 7:'Conta do beneficiário (BIC)', 8:'BIC vum Beneficiaire' };

// 		technical 					english:0,							french:1,								polish:2,									dutch:3,					german:4,							italian:5,							spanish:6,							portuguese:7, 	luxembourgish:8
C_XL.d['CCBC-IBAN-IBAN-IBAN'] 	= { 0:'GB98 MIDL 0700 9312 3456 78', 	1:'FR76 3000 6000 0112 3456 7890 189', 	2:'PL10 1050 0099 7603 1234 5678 9123', 	3:'BE71 0961 2345 6769',	4:'DE91 1000 0000 0123 4567 89', 	5:'IT79 2100 0813 6101 2345 6789', 	6:'ES79 2100 0813 6101 2345 6789',	7:'PT50 0033 0000 5013 1901 229 05', 8:'LU05 0020 7077 3052 1000'};

C_XL.d['qr_code_step_1'] = { 
	0:'fill in the amount and remittance information', 
	1:'complétez le montant et la communication.', 
	2:'uzupełnij kwotę i tytuł.', 
	3:'vul het bedrag en de mededeling in.', 
	4:'vervollständigen Sie den Betrag und die Mitteilung.', 
	5:'completare l\'importo e la comunicazione.', 
	6:'completa el importe y la comunicación.', 
	7:'preencha o valor e a comunicação.', 
	8:'Gitt de Betrag an d\'Iwwerweisungsinformatioun un.' 
};

C_XL.d['qr_code_step_2'] = { 
	0:'verify the beneficiary name and account number.', 
	1:'vérifiez le nom et l’IBAN bénéficiaire.', 
	2:'sprawdź nazwę i numer rachunku odbiorcy.', 
	3:'controleer de naam en het rekeningnummer van de begunstigde.', 
	4:'Überprüfen Sie den Namen und das Begünstigtenkonto (IBAN).', 
	5:'controllare il nome del beneficiario e l\'IBAN.', 
	6:'verifique el nombre del beneficiario y el IBAN.', 
	7:'verificar o nome do beneficiário e IBAN.', 
	8:'Iwwerpréift den Numm an den IBAN vum Beneficiaire.' 
};

C_XL.d['qr_code_step_3'] = { 
	0:'with his/her banking application, your visitor scans the QR code.', 
	1:'avec son application bancaire, votre visiteur scanne le QR code.', 
	2:'twój zwiedzający skanuje kod QR za pomocą swojej aplikacji bankowej', 
	3:'uw bezoeker scant de QR code met zijn bank applicatie.', 
	4:'mit seiner Banking-App scannt Ihr Besucher den QR-Code.', 
	5:'il visitatore scansiona il codice QR con la sua applicazione bancaria.', 
	6:'su visitante escanea el código QR con su aplicación bancaria.', 
	7:'o seu visitante digitaliza o código QR com a sua aplicação bancária.', 
	8:'Äre Visiteur scannt de QR-Code mat senger Bank-App.' 
};

C_XL.d['qr_code_step_4'] = { 
	0:'on your visitor\'s phone screen, check the payment confirmation.', 
	1:'sur l\'écran du téléphone de votre visiteur, visualisez la confirmation du paiement.', 
	2:'na ekranie telefonu zwiedzającego sprawdź potwierdzenie dokonania opłaty.', 
	3:'bekijk de betalingsbevestiging op het mobiel scherm van uw bezoeker.', 
	4:'auf dem Bildschirm des Telefons Ihres Besuchers sehen Sie die Bestätigung der Zahlung.', 
	5:'sullo schermo del telefono del visitatore, visualizzare la conferma del pagamento.', 
	6:'en la pantalla del teléfono de su visitante, vea la confirmación de pago.', 
	7:'no ecrã do telefone do seu visitante, veja a confirmação do pagamento.', 
	8:'Kuckt d\'Bezuelbestätegung um Telefonbildschierm vun Ärem Visiteur.' 
};

C_XL.d['qr_code_step_5'] = { 
	0:'it takes 1 to 4 working days before the money is transferred.', 
	1:'il s’écoule 1 à 4 jours ouvrés avant que l’argent soit transféré.', 
	2:'przekazanie pieniędzy trwa od 1 do 4 dni roboczych.', 
	3:'het duurt 1 tot 4 werkdagen voor het geld wordt overgeschreven.', 
	4:'es dauert 1 bis 4 Werktage, bis das Geld überwiesen wird.', 
	5:'il trasferimento del denaro richiede da 1 a 4 giorni lavorativi.', 
	6:'la transferencia del dinero demora de 1 a 4 días hábiles.', 
	7:'leva de 1 a 4 dias úteis para o dinheiro ser transferido.', 
	8:'Et dauert 1 bis 4 Aarbechtsdeeg, bis d\'Sue transferéiert ginn.' 
};




	// contracts
C_XL.d['contract data'] = { 0:'Contract #', 1:'Paramètres du contrat #', 2:'Parametry umowy nr #', 3:'Contract gegevens. #', 4:'Einstellungen für Vertrag #', 5:'Parametri del conto', 6:'Parámetros del contrato', 7:'Parâmetros do contrato #', 8:'Parameter vum Kontrakt #' };
C_XL.d['contractor'] = { 0:'Contractor', 1:'Contractant', 2:'Strona', 3:'Contractnemer', 4:'Vetragsnehmer', 5:'Contraente', 6:'Contratista', 7:'Contratante', 8:'Kontraktspartner' };
C_XL.d['effective by'] = { 0:'Effect date', 1:'Prise d\'effet', 2:'Data ważności', 3:'Invoeringsdatum', 4:'Wirkungsdatum', 5:'Data d\'entrata in vigore', 6:'Entrada en vigor', 7:'Entrada em vigor', 8:'Wierksamkeetsdatum' };
C_XL.d['business reg'] = { 0:'Business register', 1:'Registre de commerce', 2:'EDG/KRS', 3:'Handels registratie', 4:'Handelsregister', 5:'Registro di commercio', 6:'Registro comercial', 7:'Registo comercial', 8:'Handelsregister' };
C_XL.d['tax reg'] = { 0:'Tax register', 1:'Numéro de TVA', 2:'NIP', 3:'BTW nummer', 4:'USt-IdNr', 5:'Partita IVA', 6:'Número de IVA', 7:'Número IVA', 8:'Steierregister' };

	
	
	// display preferences

C_XL.d['default gender'] 	= { 0:'Default gender',		1:'Civilité par défaut',			2:'Płci default',			3:'Standaard geslacht',	4:'Standard Geschlecht',		5:'Genere per difetto',					6:'Género por defecto', 			7:'Forma de tratamento por defeito',	8:'Standardgeschlecht' };
C_XL.d['time slice']		= { 0:'Hours slicing',		1:'Division des heures',			2:'Podział godzin',			3:'Uren opsplitsing',	4:'Stundeneinteilung',			5:'Divisione delle ore',				6:'División de las horas', 			7:'Divisão das horas',					8:'Stonnendeelung' };
C_XL.d['duration span']		= { 0:'Duration span',		1:'Limites de durée',				2:'Czas wizyty',			3:'Duurtijd limieten',	4:'Dauerbegrenzungen',			5:'Limiti delle durate',				6:'Limites de duración', 			7:'Limites de duração',					8:'Dauerberäich' };
C_XL.d['duration increment']= { 0:'Duration increment',	1:'Incrément de durée',				2:'Przyrost czasu wizyty',	3:'Duurtijd increment',	4:'Dauererweiterungen',			5:'aumento della durata',				6:'aumento de duración', 			7:'aumento da duração',					8:'Erhéijung vun der Dauer' };
C_XL.d['time zone']			= { 0:'Time zone',			1:'Fuseau horaire',					2:'Strefa czasu',			3:'Tijdzone',			4:'Zeitzone',					5:'Fuso orario',						6:'Huso horario', 					7:'Fuso horário',						8:'Zäitzon' };
C_XL.d['display weeknumb']	= { 0:'Display week number',1:'afficher le numéro de semaine',	2:'Pokaż numer tygodnia',	3:'Toon weeknummer',	4:'Wochennummer anzeigen',		5:'Mostrare il numero della settimana',	6:'Enseñar el número de semana',	7:'Mostrar o número da semana',			8:'Wochennummer uweisen' };
C_XL.d['planning range']	= { 0:'Planning timespan',	1:'Plage horaire affichée',			2:'Wyświetlanie grafiku',	3:'Planning tijd span',	4:'angezeigte Zeitspanne',		5:'Fascia oraria mostrata',				6:'Franja horaria mostrada', 		7:'Intervalo de tempo exibido',			8:'Zäitberäich weisen' };

C_XL.d['css skin']			= { 0:'Theme',				1:'Thème',							2:'Kompozycja',				3:'Thema',				4:'Thema',						5:'Tema',								6:'Tema', 							7:'Tema',						8:'Thema' };
C_XL.d['visitors alias'] 	= { 0:'Visitors alias',		1:'alias visiteurs',				2:'alias gości',			3:'Bezoeker alias',		4:'Besucherpseudo',				5:'Pseudonimo visitatore',				6:'Seudónimo visitante', 			7:'Pseudónimo de visitantes',	8:'Alias vu Visiteuren' };
C_XL.d['visitors patients'] = { 0:'Patients',			1:'Patients',						2:'Pacjentów',				3:'Patiënten',			4:'Patienten',					5:'Pazienti',							6:'Pacientes', 						7:'Pacientes',					8:'Patienten' };
C_XL.d['visitors clients'] 	= { 0:'Clients',			1:'Clients',						2:'Klienci',				3:'Klanten',			4:'Kunden',						5:'Clienti',							6:'Clientes', 						7:'Clientes',					8:'Clienten' };
C_XL.d['visitors particip'] = { 0:'Participants',		1:'Participants',					2:'Uczestnicy',				3:'Deelnemers',			4:'Teilnehmer',					5:'Partecipanti',						6:'Participantes', 					7:'Participantes',				8:'Participantë' };

C_XL.d['1 slice'] = { 0:'one time division', 1:'Une division de temps', 2:'Jedna jednostka czasu', 3:'Eén uur opslitsing', 4:'Eine Zeiteinteilung', 5:'Una divisione di tempo', 6:'Una división de tiempo', 7:'Uma divisão do tempo', 8:'Eng Zäitopdeelung' };
C_XL.d['2 slices'] = { 0:'two time divisions', 1:'Deux divisions de temps', 2:'Dwie jednostki czasu', 3:'Twee uur opslitsingen', 4:'Zwei Zeiteinteilungen', 5:'Due divisioni di tempo', 6:'Dos divisiones de tiempo', 7:'Duas divisões do tempo', 8:'Zwee Zäitopdeelungen' };
C_XL.d['3 slices'] = { 0:'three time divisions', 1:'Trois divisions de temps', 2:'Trzy jednostki czasu', 3:'Drie uur opslitsingen', 4:'Drei Zeiteinteilungen', 5:'Tre divisioni di tempo', 6:'Tres divisiones de tiempo', 7:'Três divisões do tempo', 8:'Dräi Zäitopdeelungen' };
C_XL.d['4 slices'] = { 0:'four time divisions', 1:'Quatre divisions de temps', 2:'Cztery jednostki czasu', 3:'Vier uur opslitsingen', 4:'Vier Zeiteinteilungen', 5:'Quattro divisioni di tempo', 6:'Cuatro divisiones de tiempo', 7:'Quatro divisões do tempo', 8:'Véier Zäitopdeelungen' };
C_XL.d['5 slices'] = { 0:'five time divisions', 1:'Cinq divisions de temps', 2:'Pięć jednostek czasu', 3:'Vijf uur opslitsingen', 4:'Fünf Zeiteinteilungen', 5:'Cinque divisioni di tempo', 6:'Cinco divisiones de tiempo', 7:'Cinco divisões do tempo', 8:'Fënnef Zäitopdeelungen' };
C_XL.d['6 slices'] = { 0:'six time divisions', 1:'Six divisions de temps', 2:'Sześć jednostek czasu', 3:'Zes uur opslitsingen', 4:'Sechs Zeiteinteilungen', 5:'Sei divisioni di tempo', 6:'Seis divisiones de tiempo', 7:'Seis divisões do tempo', 8:'Sechs Zäitopdeelungen' };



C_XL.d['sticker font size'] = { 
	0:'Text size on labels',	
	1:'Taille du texte sur les étiquettes',	
	2:'Rozmiar tekstu na etykietach',	
	3:'Tekstgrootte op etiketten',	               
	4:'Textgröße auf Etiketten',	
	5:'Taglia del testo sulle etichette',
	6:'Tamaño del texto en las etiquetas',
	7:'Tamanho do texto nas etiquetas',
	8:'Textgréisst op Etiketten'	
};


// 		english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7, 	luxembourgish:8
C_XL.d['xl font'] = {  0:'Extra large',  1:'Très grande (XL)',  2:'Ekstra duży',  3:'Extra groot',  4:'Extra groß',  5:'Extra grande',  6:'Extra grande',  7:'Extra grande',  8:'Extra grouss' };
C_XL.d['large font'] = { 0:'Large', 1:'Grande', 2:'Duży', 3:'Grote', 4:'Groß', 5:'Grande', 6:'Grande', 7:'Grande', 8:'Grouss' };
C_XL.d['medium font'] = { 0:'Medium', 1:'Moyenne', 2:'Średni', 3:'Medium', 4:'Mittel', 5:'Media', 6:'Media', 7:'Médio', 8:'Mëttel' };
C_XL.d['small font'] = { 0:'Small', 1:'Petite', 2:'Mały', 3:'Kleine', 4:'Klein', 5:'Piccola', 6:'Pequeña', 7:'Pequeno', 8:'Kleng' };

C_XL.d['upper left date'] = { 
	0:'Upper left date shortcut', 
	1:'Raccourci date en haut à gauche', 
	2:'Data skrót lewy górny', 
	3:'Linksboven datum snelkoppeling',		
	4:'Obere linke datum Verknüpfung',	
	5:'Scorciatoia data in alto a sinistra',	
	6:'acceso directo fecha arriba a la izquierda', 
	7:'atalho da data no canto superior esquerdo',
	8:'Verknëppung vun der ieweschter lénkser Datum'
};

C_XL.d['current date'] = { 
	0:'Current date',				
	1:'Date du jour',						
	2:'Data bieżącego dnia',	
	3:'Datum van de huidige dag',			
	4:'aktuelles datum',				
	5:'Data di oggi',						
	6:'Fecha de hoy', 								
	7:'Data de hoje',
	8:'Aktuellen Datum'	
};

	// preferences colors and status

// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8	
	
C_XL.d['ccss color app'] = { 0:'appointment color', 1:'Couleur de RDV', 2:'Powołanie kolor', 3:'afspraak kleur', 4:'Terminfarbe', 5:'Colore dell\'appuntamento', 6:'Color de la cita', 7:'Cor da consulta', 8:'Faarf vum Rendez-vous' };
C_XL.d['ccss color event'] = { 0:'Unavailability color', 1:'Couleur d\'indisponibilité', 2:'Kolor Niedostępność', 3:'Kleur voor afwezigheid', 4:'Farbe für Nichtverfügbarkeit', 5:'Colore di indisponibilità', 6:'Color de indisponibilidad', 7:'Cor de indisponibilidade', 8:'Faarf vun der Onverfügbarkeet' };
C_XL.d['ccss color fcal'] = { 0:'Optional resource color', 1:'Couleur de ressource optionelle', 2:'Opcjonalny kolor zasobu', 3:'Optionele middel kleur', 4:'Farbe für optionale Ressourcen', 5:'Colore di risorsa opzionale', 6:'Color de recurso opcional', 7:'Cor de recurso opcional', 8:'Faarf vun der optionaler Ressource' };
C_XL.d['ccss color visitor'] = { 0:'visitor color', 1:'Couleur de visitor', 2:'Kolor visitor', 3:'visitor kleur', 4:'Farbe für Besucher', 5:'Colore di visitatore', 6:'Color de visitante', 7:'Cor do visitante', 8:'Faarf vum Visiteur' };
C_XL.d['ccss color note'] = { 0:'Note color', 1:'Couleur de note', 2:'Kolor uwaga', 3:'Notitie kleur', 4:'Farbe für Notizen', 5:'Colore di nota', 6:'Color de nota', 7:'Cor da nota', 8:'Faarf vun der Notiz' };
C_XL.d['ccss color task'] = { 0:'Task color', 1:'Couleur de tâche', 2:'Kolor zadanie', 3:'Taak kleur', 4:'Farbe für Aufgaben', 5:'Colore di attività', 6:'Color de tarea', 7:'Cor da tarefa', 8:'Faarf vun der Aufgab' };
C_XL.d['ccss color chat'] = { 0:'Chat color', 1:'Couleur de chat', 2:'Kolor rozmowa', 3:'Chat kleur', 4:'Farbe für Chat', 5:'Colore di chat', 6:'Color de chat', 7:'Cor do chat', 8:'Faarf vum Chat' };
C_XL.d['ccss color file'] = { 0:'File color', 1:'Couleur de fichier', 2:'kolor plik', 3:'File kleur', 4:'Farbe für Dateien', 5:'Colore di file', 6:'Color de fichero', 7:'Cor do ficheiro', 8:'Faarf vun der Datei' };
C_XL.d['ccss color product'] = { 0:'Product color', 1:'Couleur de produit', 2:'kolor produktu', 3:'Product kleur', 4:'Farbe für Produkte', 5:'Colore di prodotto', 6:'Color de producto', 7:'Cor do produto', 8:'Faarf vum Produkt' };


C_XL.d['ccss pattern app'] = { 0:'appointment status', 1:'Statut de RDV', 2:'Powołanie status', 3:'afspraak status', 4:'Terminstatus', 5:'Status di appuntamento', 6:'Estado de cita', 7:'Estado da consulta', 8:'Status vum Rendez-vous' };
C_XL.d['ccss pattern event'] = { 0:'Unavailability status', 1:'Statut d\'indisponibilité', 2:'Status Niedostępność', 3:'afwezigheid status', 4:'Nichtverfügbarkeitsstatus', 5:'Status di indisponibilità', 6:'Estado de indisponibilidad', 7:'Estado de indisponibilidade', 8:'Status vun der Onverfügbarkeet' };
C_XL.d['ccss pattern fcal'] = { 0:'Optional resource status', 1:'Statut de ressource optionelle', 2:'Opcjonalnie stanu zasobów', 3:'Optionele middel status', 4:'Status optionaler Ressourcen', 5:'Status di risorsa opzionale', 6:'Estado de recurso opcional', 7:'Estado de recurso opcional', 8:'Status vun der optionaler Ressource' };
C_XL.d['ccss pattern visitor'] = { 0:'visitor status', 1:'Statut de visitor', 2:'Status visitor', 3:'visitor status', 4:'Besucherstatus', 5:'Status del visitatore', 6:'Estado del visitante', 7:'Estado de visitante', 8:'Status vum Visiteur' };
C_XL.d['ccss pattern note'] = { 0:'Note status', 1:'Statut de note', 2:'Status uwaga', 3:'Notitie status', 4:'Notizstatus', 5:'Status di nota', 6:'Estado de nota', 7:'Estado de nota', 8:'Status vun der Notiz' };
C_XL.d['ccss pattern task'] = { 0:'Task status', 1:'Statut de tâche', 2:'Status zadanie', 3:'Taak status', 4:'aufgabenstatus', 5:'Status di attività', 6:'Estado de tarea', 7:'Estado de tarefa', 8:'Status vun der Aufgab' };
C_XL.d['ccss pattern chat'] = { 0:'Chat status', 1:'Statut de chat', 2:'Status rozmowa', 3:'Chat status', 4:'Chatstatus', 5:'Status di chat', 6:'Estado de chat', 7:'Estado de chat', 8:'Status vum Chat' };
C_XL.d['ccss pattern file'] = { 0:'File status', 1:'Statut de fichier', 2:'Status plik', 3:'File status', 4:'Dateistatus', 5:'Status di file', 6:'Estado de fichero', 7:'Estado de ficheiro', 8:'Status vun der Datei' };
C_XL.d['ccss pattern product'] = { 0:'Product status', 1:'Statut de produit', 2:'Status produktu', 3:'Product status', 4:'Produktstatus', 5:'Status di prodotto', 6:'Estado de producto', 7:'Estado de produto', 8:'Status vum Produkt' };


C_XL.d['ccss tag app'] = { 0:'appointment tags', 1:'Tags de RDV', 2:'Powołanie tags', 3:'afspraak tags', 4:'Tags für Termine', 5:'Tags di appuntamento', 6:'Tags de cita', 7:'Tags de consulta', 8:'Tags vum Rendez-vous' };
C_XL.d['ccss tag event'] = { 0:'Unavailability tags', 1:'Tags d\'indisponibilité', 2:'Tags Niedostępność', 3:'afwezigheid tags', 4:'Tags für Nichtverfügbarkeit', 5:'Tags d\'indisponibilità', 6:'Tags de indisponibilidad', 7:'Tags de indisponibilidade', 8:'Tags vun der Onverfügbarkeet' };
C_XL.d['ccss tag fcal'] = { 0:'Optional resource tags', 1:'Tags de ressource optionelle', 2:'Opcjonalnie Tags zasobów', 3:'Optionele middel tags', 4:'Tags für optionale Ressourcen', 5:'Tags di risorsa opzionale', 6:'Tags de recurso opcional', 7:'Tags de recurso opcional', 8:'Tags vun der optionaler Ressource' };
C_XL.d['ccss tag visitor'] = { 0:'visitor tags', 1:'Tags de visitor', 2:'Tags visitor', 3:'visitor tags', 4:'Besuchertags', 5:'Tags di visitatore', 6:'Tags de visitante', 7:'Tags de visitante', 8:'Tags vum Visiteur' };
C_XL.d['ccss tag note'] = { 0:'Note tags', 1:'Tags de note', 2:'Tags uwaga', 3:'Notitie tags', 4:'Notiztags', 5:'Tags di nota', 6:'Tags de nota', 7:'Tags de nota', 8:'Tags vun der Notiz' };
C_XL.d['ccss tag task'] = { 0:'Task tags', 1:'Tags de tâche', 2:'Tags zadanie', 3:'Taak tags', 4:'Tags für Aufgaben', 5:'Tags di attività', 6:'Tags de tarea', 7:'Tags de tarefa', 8:'Tags vun der Aufgab' };
C_XL.d['ccss tag chat'] = { 0:'Chat tags', 1:'Tags de chat', 2:'Tags rozmowa', 3:'Chat tags', 4:'Tags für Chats', 5:'Tags di chat', 6:'Tags de chat', 7:'Tags de chat', 8:'Tags vum Chat' };
C_XL.d['ccss tag file'] = { 0:'File tags', 1:'Tags de fichier', 2:'Tags plik', 3:'File tags', 4:'Tags für Dateien', 5:'tags di file', 6:'Tags de fichero', 7:'Tags de ficheiro', 8:'Tags vun der Datei' };
C_XL.d['ccss tag product'] = { 0:'Product tags', 1:'Tags de produit', 2:'Tags produktu', 3:'Product tags', 4:'Tags für Produkte', 5:'tags di prodotto', 6:'Tags de producto', 7:'Tags de produto', 8:'Tags vun der Produkt' };


C_XL.d['custom colors and status'] = { 0:'Custom colors & status', 1:'Couleurs & statuts personnalisés', 2:'Niestandardowe kolory i status', 3:'aangepaste kleuren & status', 4:'Benutzerdefinierte Farben und Status', 5:'Colori & Status personalizzati', 6:'Colores y estados personalizados', 7:'Cores e estado personalizado', 8:'Benotzerdefinéiert Faarwen a Status' };
C_XL.d['default colors and status'] = { 0:'Default colors & status', 1:'Couleurs & statuts par défaut', 2:'Domyślne kolory i status', 3:'Standaard kleuren & status', 4:'Standardmäßige Farben und Status', 5:'Colori & Status per difetto', 6:'Colores y estados por defecto', 7:'Cores e estado por defeito', 8:'Standard Faarwen a Status' };

	// preferences agendas

C_XL.d['business cals'] = { 0:'Business rooms', 1:'Postes de travail', 2:'Stanowiska', 3:'Werk posten', 4:'arbeitsplätze', 5:'Spazi di lavoro', 6:'Estaciones de trabajo', 7:'Estações de trabalho', 8:'Aarbechtsraim' };

C_XL.d['bcal creation note'] = { 
	0:'<b>Main agendas</b>:<br/><br/> Any setup has at least one such agenda. The search assistent will always assign one of those resources.',		
	1:'<b>Agendas principaux</b>:<br/><br/> Un setup aura toujours au moins un agenda de type principal. L\'assistant de recherche implique toujours une resource principale.',			
	2:'<b>Główne kalendarze</b>:<br/><br/> Każda instytucja ma co najmniej jeden główny program. Szukaj Companion zawsze przypisać jeden z tych kalendarzy.',		
	3:'<b>Hoofd agenda\'s</b>:<br/><br/> Elke instelling heeft ten minste één hoofd agenda. De zoek assistent zal altijd één van die agenda\'s toewijzen.',
	4:'<b>Hauptkalender</b>:<br/><br/> Jede Installation besitzt mindestens einen dieser Hauptkalender. Der Suchassistent setzt immer einen dieser Hauptressourcen voraus.',	
	5:'<b>Agende principali</b>:<br/><br/> Un setup avrà sempre almeno un\'agenda principale. L\'assistente di ricerca implica sempre una risorsa principale.',	
	6:'<b>Calendario principal</b>:<br/><br/> Una instalación siempre tendrá por lo menos un calendario principal. El asistente de búsqueda siempre implica una fuente principal.', 
	7:'<b>Calendários principais</b>:<br/><br/> Uma instalação terá sempre pelo menos um calendário do tipo principal. O assistente de pesquisa envolve sempre um recurso principal.',
	8:'<b>Haaptagenden</b>:<br/><br/> All Setup huet op d\'mannst eng Haaptagenda. Den Sichassistent wäert ëmmer eng vun dëse Ressourcen zouweisen.'
};

C_XL.d['ucal creation note'] = { 
	0:'<b>Staffed agendas</b>:<br/><br/> The search assistent will force assignment of one or more of those resources,	depending on the selected staffing.',		
	1:'<b>Agendas contingent</b>:<br/><br/> L\'assistant de recherche impliquera toujours automatiquement une ou plusieurs de ces resources,	en fonction de la sélection.',			
	2:'<b>Obsadzone kalendarze</b>:<br/><br/> Asystent wyszukiwania zmusi podział jednego lub więcej z tych ressources,	w zależności od wyboru.',		
	3:'<b>Toewijsbare Agenda\'s</b>:<br/><br/> De zoek assistent zal dwingen toewijzing van een of meer van deze resourcen,	afhankelijk van de selectie.',
	4:'<b>Personalbesetzte Kalender</b>:<br/><br/> Abhängig von der ausgewählten Personalbesetzung ordnet der Suchassistent ordnet immer automatisch einen dieser Ressourcen zu.',	
	5:'<b>Agende contingente</b>:<br/><br/> L\'assistente di ricerca implicherà sempre automaticamente una o varie di queste risorse,	a seconda della selezione.',		
	6:'<b>Calendarios contingentes</b>:<br/><br/> El asistente de búsqueda siempre implicará automaticamente una o más fuentes, dependiendo de la selección.', 
	7:'<b>Calendários contingentes</b>:<br/><br/> O assistente de pesquisa implicará sempre automaticamente um ou vários destes recursos,	em função da seleção.',
	8:'<b>Personalbesate Agenden</b>:<br/><br/> Den Sichassistent zwéngt eng Zuweisung vun enger oder méi vun dëse Ressourcen, jee no der ausgewielter Personalbesetzung.'
};

C_XL.d['fcal creation note'] = { 
	0:'<b>Optional agendas</b>:<br/><br/> The search assistent will assign one the selected resources,	they are optional.',		
	1:'<b>Agendas facultatifs</b>:<br/><br/> L\'assistant de recherche impliquera une de ces resources sélectionnées avant la recherche. La sélection est optionelle.',			
	2:'<b>Opcjonalne kalendarze</b>:<br/><br/> Asystent badawczy obejmuje jedną z tych wybranych zasobów przed wyszukiwania. Wybór jest opcjonalny.',		
	3:'<b>Optionele agenda\'s</b>:<br/><br/> De zoek assistent zal één van deze resourcen toewijzen,	indien geselecteerd. De selectie is optioneel.',
	4:'<b>Optionale Kalender</b>:<br/><br/> Der Suchassistent ordnet einen der ausgewählten Ressourcen zu, sie sind optional.',	
	5:'<b>Agende facoltative</b>:<br/><br/> L\'assistente di ricerca implicherà una delle risorse selezionate prima della ricerca. La selezione è opzionale.',	
	6:'<b>Calendarios opcionales</b>:<br/><br/> El asistente de búsqueda implicará una de estas fuentes seleccionadas antes de la búsqueda. La selección es opcional.', 
	7:'<b>Calendários opcionais</b>:<br/><br/> O assistente de pesquisa envolverá um destes recursos selecionados antes da pesquisa. A seleção é opcional.',
	8:'<b>Optional Agenden</b>:<br/><br/> Den Sichassistent wäert eng vun den ausgewielten Ressourcen zouweisen. Si sinn optional.'
};

// Can you start by correcting my english phrasing first? Keeping intact those key words : bCals, uCals, fCals, visitor, visitors
// After I reviewed your english phrasing proposal, we will go for the translations. 
// Please keep text presentation intact (one translation per line, language comments at the end of each line)

// I have made small adjustments.
// let's base translation on the following version.
// Please keep text presentation intact (one translation per line, no new line between each. language comments at the end of each line)

C_XL.d['bcal creation note'] = { 
  0:'<b>Main agendas</b>:<br/><br/>Actions on these agendas can trigger notifications. You must have at least one such agenda.<br/><br/>Web pages that allow your visitors to book online will always insert appointments into a main agenda.<br/><br/>The search assistant will also always assign one of the bCals.<br/><br/>If you need additional main agendas, please contact your account manager.', // english
  1:'<b>Agendas principaux</b>:<br/><br/>Les actions effectuées sur ces agendas peuvent déclencher des notifications. Vous devez disposer d’au moins un agenda principal.<br/><br/>Les pages web permettant à vos visitors de réserver en ligne inséreront toujours les rendez-vous dans un agenda principal.<br/><br/>L’assistant de recherche assignera également toujours l’un des bCals.<br/><br/>Si vous avez besoin d’agendas principaux supplémentaires, veuillez contacter votre account manager.', // french
  2:'<b>Główne kalendarze</b>:<br/><br/>Działania wykonywane w tych kalendarzach mogą wywoływać powiadomienia. Musisz mieć co najmniej jeden taki kalendarz.<br/><br/>Strony internetowe umożliwiające visitors rezerwację online zawsze zapiszą wizyty w głównym kalendarzu.<br/><br/>Asystent wyszukiwania zawsze przypisze jeden z bCals.<br/><br/>Jeśli potrzebujesz dodatkowych głównych kalendarzy, skontaktuj się ze swoim account managerem.', // polish
  3:'<b>Hoofdagenda’s</b>:<br/><br/>Acties op deze agenda’s kunnen meldingen activeren. U moet minstens één dergelijke agenda hebben.<br/><br/>Webpagina’s waarmee your visitors online kunnen boeken, plaatsen afspraken altijd in een hoofdagenda.<br/><br/>De zoekassistent zal ook altijd één van de bCals toewijzen.<br/><br/>Als u extra hoofdagenda’s nodig hebt, neem dan contact op met uw accountmanager.', // dutch
  4:'<b>Hauptagenden</b>:<br/><br/>Aktionen in diesen Agenden können Benachrichtigungen auslösen. Sie müssen mindestens eine solche Agenda haben.<br/><br/>Webseiten, über die your visitors online buchen können, tragen Termine immer in eine Hauptagenda ein.<br/><br/>Der Suchassistent weist ebenfalls immer einen der bCals zu.<br/><br/>Wenn Sie zusätzliche Hauptagenden benötigen, wenden Sie sich bitte an Ihren Account Manager.', // german
  5:'<b>Agende principali</b>:<br/><br/>Le azioni su queste agende possono generare notifiche. Devi avere almeno un’agenda principale.<br/><br/>Le pagine web che permettono ai your visitors di prenotare online inseriranno sempre gli appuntamenti in un’agenda principale.<br/><br/>L’assistente di ricerca assegnerà sempre uno dei bCals.<br/><br/>Se hai bisogno di ulteriori agende principali, contatta il tuo account manager.', // italian
  6:'<b>Agendas principales</b>:<br/><br/>Las acciones realizadas en estas agendas pueden generar notificaciones. Debes tener al menos una agenda principal.<br/><br/>Las páginas web que permiten a your visitors reservar en línea siempre insertarán las citas en una agenda principal.<br/><br/>El asistente de búsqueda también asignará siempre uno de los bCals.<br/><br/>Si necesitas agendas principales adicionales, contacta a tu account manager.', // spanish
  7:'<b>Agendas principais</b>:<br/><br/>As ações nestas agendas podem desencadear notificações. Deve ter pelo menos uma agenda principal.<br/><br/>As páginas web que permitem aos your visitors fazer reservas online irão sempre inserir os agendamentos numa agenda principal.<br/><br/>O assistente de pesquisa também atribuirá sempre um dos bCals.<br/><br/>Se precisar de agendas principais adicionais, contacte o seu account manager.', // portuguese
  8:'<b>Haaptagenden</b>:<br/><br/>Aktiounen op dësen Agenden kënnen Notifikatiounen ausléisen. Dir musst op d’mannst eng esou Agenda hunn.<br/><br/>Websäiten, déi your visitors Online-Reservatioune erméiglechen, droen Rendez-vousen ëmmer an eng Haaptagenda an.<br/><br/>Den Sichassistent weist och ëmmer een vun de bCals zou.<br/><br/>Wann Dir weider Haaptagenden braucht, kontaktéiert wgl. Ären Account Manager.', // luxembourgish
};

C_XL.d['bcal creation note']	= { 
  0:'<b>Main agendas</b>:<br/><br/>Actions on these agendas can trigger communications. You must have at least one such agenda.<br/><br/>Web pages that allow your visitors to book online will always insert appointments into a main agenda.<br/><br/>The search assistant will also always assign one of the bCals.<br/><br/>If you need additional main agendas, please contact your account manager.', // english
  1:'<b>Agendas principaux</b>:<br/><br/>Les actions effectuées sur ces agendas peuvent déclencher des communications. Vous devez disposer d’au moins un agenda principal.<br/><br/>Les pages web permettant à vos visitors de réserver en ligne inséreront toujours les rendez-vous dans un agenda principal.<br/><br/>L’assistant de recherche assignera également toujours l’un des bCals.<br/><br/>Si vous avez besoin d’agendas principaux supplémentaires, veuillez contacter votre account manager.', // french
  2:'<b>Główne kalendarze</b>:<br/><br/>Działania wykonywane w tych kalendarzach mogą wywoływać komunikaty. Musisz posiadać co najmniej jeden taki kalendarz.<br/><br/>Strony internetowe umożliwiające visitors rezerwację online zawsze zapiszą wizyty w głównym kalendarzu.<br/><br/>Asystent wyszukiwania zawsze przypisze jeden z bCals.<br/><br/>Jeśli potrzebujesz dodatkowych głównych kalendarzy, skontaktuj się ze swoim account managerem.', // polish
  3:'<b>Hoofdagenda’s</b>:<br/><br/>Acties op deze agenda’s kunnen communicatie activeren. U moet minstens één dergelijke agenda hebben.<br/><br/>Webpagina’s waarmee your visitors online kunnen boeken, zullen afspraken altijd in een hoofdagenda plaatsen.<br/><br/>De zoekassistent wijst ook altijd één van de bCals toe.<br/><br/>Als u extra hoofdagenda’s nodig hebt, neem dan contact op met uw accountmanager.', // dutch
  4:'<b>Hauptagenden</b>:<br/><br/>Aktionen in diesen Agenden können Mitteilungen auslösen. Sie müssen mindestens eine solche Agenda haben.<br/><br/>Webseiten, über die your visitors online buchen können, tragen Termine immer in eine Hauptagenda ein.<br/><br/>Der Suchassistent weist ebenfalls immer einen der bCals zu.<br/><br/>Wenn Sie zusätzliche Hauptagenden benötigen, wenden Sie sich bitte an Ihren Account Manager.', // german
  5:'<b>Agende principali</b>:<br/><br/>Le azioni su queste agende possono generare comunicazioni. Devi avere almeno un’agenda principale.<br/><br/>Le pagine web che permettono ai your visitors di prenotare online inseriranno sempre gli appuntamenti in un’agenda principale.<br/><br/>L’assistente di ricerca assegnerà sempre uno dei bCals.<br/><br/>Se hai bisogno di ulteriori agende principali, contatta il tuo account manager.', // italian
  6:'<b>Agendas principales</b>:<br/><br/>Las acciones realizadas en estas agendas pueden generar comunicaciones. Debes tener al menos una agenda principal.<br/><br/>Las páginas web que permiten a your visitors reservar en línea siempre insertarán las citas en una agenda principal.<br/><br/>El asistente de búsqueda también asignará siempre uno de los bCals.<br/><br/>Si necesitas agendas principales adicionales, contacta a tu account manager.', // spanish
  7:'<b>Agendas principais</b>:<br/><br/>As ações realizadas nestas agendas podem desencadear comunicações. Deve ter pelo menos uma agenda principal.<br/><br/>As páginas web que permitem aos your visitors fazer reservas online irão sempre inserir os agendamentos numa agenda principal.<br/><br/>O assistente de pesquisa também atribuirá sempre um dos bCals.<br/><br/>Se precisar de agendas principais adicionais, contacte o seu account manager.', // portuguese
  8:'<b>Haaptagenden</b>:<br/><br/>Aktiounen op dësen Agenden kënnen Kommunikatiounen ausléisen. Dir musst op d’mannst eng esou Agenda hunn.<br/><br/>Websäiten, déi your visitors eng Online-Reservatioun erlaben, droen Rendez-vousen ëmmer an eng Haaptagenda an.<br/><br/>Den Sichassistent weist och ëmmer een vun de bCals zou.<br/><br/>Wann Dir weider Haaptagenden braucht, kontaktéiert wgl. Ären Account Manager.', // luxembourgish
};

C_XL.d['ucal creation note'] = { 
  0:'<b>Staffed agendas</b>:<br/><br/>These agendas allow you to manage uCals assignment within your organization.<br/><br/>At least one of these uCals must be assigned to any reservation made on main agendas. Examples: main agendas are your practices, workrooms, or sites; staffed agendas are used to staff uCals on each bCals appointment.<br/><br/>Web pages that allow your visitors to book online will always assign one of the uCals together with one of the bCals, as specified in the service definition (see the “experts” tab in the “services” section).<br/><br/>The search assistant will display staffing options using one of the uCals, as required by the service definition.<br/><br/>If you need additional staffed agendas, please contact your account manager.', // english
  1:'<b>Agendas staffés</b>:<br/><br/>Ces agendas vous permettent de gérer l’assignation des uCals au sein de votre organisation.<br/><br/>Au moins un de ces uCals doit être assigné à toute réservation effectuée sur les agendas principaux. Exemples: les agendas principaux représentent vos cabinets, salles de travail ou sites ; les agendas staffés servent à affecter des uCals à chaque rendez-vous des bCals.<br/><br/>Les pages web permettant à vos visitors de réserver en ligne assigneront toujours un des uCals ainsi qu’un des bCals, conformément à la définition du service (voir l’onglet « experts » dans la section « prestations »).<br/><br/>L’assistant de recherche affichera des options de staffing utilisant l’un des uCals, conformément à la définition du service.<br/><br/>Si vous avez besoin d’agendas staffés supplémentaires, veuillez contacter votre account manager.', // french
  2:'<b>Kalendarze personelu</b>:<br/><br/>Te kalendarze pozwalają zarządzać przypisaniem uCals w Twojej organizacji.<br/><br/>Co najmniej jeden z tych uCals musi być przypisany do każdej rezerwacji dokonanej w głównych kalendarzach. Przykłady: główne kalendarze to Twoje gabinety, pracownie lub lokalizacje; kalendarze personelu służą do przypisywania uCals do każdej wizyty w bCals.<br/><br/>Strony internetowe umożliwiające visitors rezerwację online zawsze przypiszą jeden z uCals wraz z jednym z bCals, zgodnie z definicją usługi (zobacz zakładkę „experts” w sekcji „services”).<br/><br/>Asystent wyszukiwania wyświetli opcje obsady z użyciem jednego z uCals, zgodnie z definicją usługi.<br/><br/>Jeśli potrzebujesz dodatkowych kalendarzy personelu, skontaktuj się ze swoim account managerem.', // polish
  3:'<b>Bezettingsagenda’s</b>:<br/><br/>Deze agenda’s stellen u in staat om de toewijzing van uCals binnen uw organisatie te beheren.<br/><br/>Minstens één van deze uCals moet worden toegewezen aan elke reservering in de hoofdagenda’s. Voorbeelden: hoofdagenda’s zijn uw praktijken, werkruimtes of locaties; bezettingsagenda’s worden gebruikt om uCals toe te wijzen aan elke afspraak in de bCals.<br/><br/>Webpagina’s waarmee your visitors online kunnen boeken, zullen altijd één van de uCals samen met één van de bCals toewijzen, zoals gespecificeerd in de servicedefinitie (zie het tabblad “experts” in de sectie “services”).<br/><br/>De zoekassistent toont bezettingsopties met één van de uCals, zoals vereist door de servicedefinitie.<br/><br/>Als u extra bezettingsagenda’s nodig hebt, neem dan contact op met uw accountmanager.', // dutch
  4:'<b>Personaleinsatz-Agenden</b>:<br/><br/>Diese Agenden ermöglichen es Ihnen, die Zuweisung der uCals innerhalb Ihrer Organisation zu verwalten.<br/><br/>Mindestens eines dieser uCals muss jeder Buchung in den Hauptagenden zugewiesen werden. Beispiele: Hauptagenden sind Ihre Praxen, Arbeitsräume oder Standorte; Personaleinsatz-Agenden dienen dazu, uCals zu jedem Termin der bCals zuzuweisen.<br/><br/>Webseiten, über die your visitors online buchen können, weisen stets eines der uCals zusammen mit einem der bCals zu, wie in der Servicedefinition beschrieben (siehe den Reiter „experts“ im Bereich „services“).<br/><br/>Der Suchassistent zeigt Personaleinsatzoptionen unter Verwendung eines der uCals an, wie es die Servicedefinition verlangt.<br/><br/>Wenn Sie zusätzliche Personaleinsatz-Agenden benötigen, wenden Sie sich bitte an Ihren Account Manager.', // german
  5:'<b>Agende con personale</b>:<br/><br/>Queste agende ti permettono di gestire l’assegnazione degli uCals all’interno della tua organizzazione.<br/><br/>Almeno uno di questi uCals deve essere assegnato a ogni prenotazione effettuata nelle agende principali. Esempi: le agende principali rappresentano i tuoi studi, laboratori o sedi; le agende con personale servono per assegnare uCals a ogni appuntamento dei bCals.<br/><br/>Le pagine web che permettono ai your visitors di prenotare online assegneranno sempre uno degli uCals insieme a uno dei bCals, come definito nella definizione del servizio (vedi la scheda “experts” nella sezione “services”).<br/><br/>L’assistente di ricerca mostrerà opzioni di assegnazione utilizzando uno degli uCals, come richiesto dalla definizione del servizio.<br/><br/>Se hai bisogno di ulteriori agende con personale, contatta il tuo account manager.', // italian
  6:'<b>Agendas de personal</b>:<br/><br/>Estas agendas te permiten gestionar la asignación de uCals dentro de tu organización.<br/><br/>Al menos uno de estos uCals debe asignarse a cada reserva hecha en las agendas principales. Ejemplos: las agendas principales representan tus consultas, salas de trabajo o sedes; las agendas de personal se utilizan para asignar uCals a cada cita en los bCals.<br/><br/>Las páginas web que permiten a your visitors reservar online asignarán siempre uno de los uCals junto con uno de los bCals, según lo especificado en la definición del servicio (consulta la pestaña “experts” en la sección “services”).<br/><br/>El asistente de búsqueda mostrará opciones de dotación de personal utilizando uno de los uCals, según lo requiera la definición del servicio.<br/><br/>Si necesitas agendas de personal adicionales, contacta a tu account manager.', // spanish
  7:'<b>Agendas com pessoal</b>:<br/><br/>Estas agendas permitem gerir a atribuição de uCals dentro da sua organização.<br/><br/>Pelo menos um destes uCals deve ser atribuído a cada reserva feita nas agendas principais. Exemplos: as agendas principais representam os seus consultórios, salas de trabalho ou locais; as agendas com pessoal servem para atribuir uCals a cada marcação nos bCals.<br/><br/>As páginas web que permitem aos your visitors reservar online irão sempre atribuir um dos uCals juntamente com um dos bCals, conforme especificado na definição do serviço (ver o separador “experts” na secção “services”).<br/><br/>O assistente de pesquisa apresentará opções de pessoal utilizando um dos uCals, conforme requerido pela definição do serviço.<br/><br/>Se precisar de mais agendas com pessoal, contacte o seu account manager.', // portuguese
  8:'<b>Agenden mat Personal</b>:<br/><br/>Dës Agenden erlaben Iech d’Zouweisung vun uCals an Ärer Organisatioun ze geréieren.<br/><br/>Op d’mannst een vun dësen uCals muss all Reservatioun an den Haaptagenden zougewise ginn. Beispiller: Haaptagenden sinn Är Praxen, Aarbechtsraim oder Siten; Personalagenden déngen dozou uCals op all bCals-Rendez-vous ze setzen.<br/><br/>Websäiten, déi your visitors eng Online-Reservatioun erlaben, weisen ëmmer ee vun den uCals zesumme mat engem vun de bCals zou, wéi an der Servicedefinitioun festgeluecht (kuckt den Tab “experts” an der Sektioun “services”).<br/><br/>Den Sichassistent weist Personaloptioune mat engem vun den uCals un, wéi et d’Servicedefinitioun verlaangt.<br/><br/>Wann Dir zousätzlech Personalagenden braucht, kontaktéiert wgl. Ären Account Manager.', // luxembourgish
};

C_XL.d['fcal creation note'] = { 
  0:'<b>Optional agendas</b>:<br/><br/>These agendas allow you to freely assign fCals to appointments.<br/><br/>They are optional: an appointment on a main agenda may have none, one, or several fCals assigned. Examples: equipment required for certain services where you want to avoid agenda conflicts; assistant assignment for services that require help.<br/><br/>Web pages that allow your visitors to book online will always assign fCals when your service definition requires it (see the “experts” tab in the “services” section).<br/><br/>The search assistant will also display staffing options using one of the fCals, when required by the service definition.<br/><br/>If you need additional optional agendas, please contact your account manager.', // english
  1:'<b>Agendas optionnels</b>:<br/><br/>Ces agendas vous permettent d’assigner librement des fCals aux rendez-vous.<br/><br/>De manière optionnelle: un rendez-vous dans un agenda principal peut n’avoir aucun, un ou plusieurs fCals assignés. Exemples: équipement nécessaire pour certains services lorsque vous souhaitez éviter les conflits d’agenda ; assignation d’assistants pour les services nécessitant de l’aide.<br/><br/>Les pages web permettant à vos visitors de réserver en ligne assigneront toujours des fCals lorsque la définition du service l’exige (voir l’onglet « experts » dans la section « prestations »).<br/><br/>L’assistant de recherche affichera également des options de staffing utilisant l’un des fCals, lorsque requis par la définition du service.<br/><br/>Si vous avez besoin d’agendas optionnels supplémentaires, veuillez contacter votre account manager.', // french
  2:'<b>Opcjonalne kalendarze</b>:<br/><br/>Te kalendarze pozwalają swobodnie przypisywać fCals do wizyt.<br/><br/>Są opcjonalne: wizyta w głównym kalendarzu może nie mieć żadnego, jednego lub kilku przypisanych fCals. Przykłady: wyposażenie wymagane dla określonych usług, w których chcesz uniknąć konfliktów w kalendarzu; przydział asystentów dla usług wymagających wsparcia.<br/><br/>Strony internetowe umożliwiające visitors rezerwację online zawsze przypiszą fCals, gdy wymaga tego definicja usługi (zobacz zakładkę „experts” w sekcji „services”).<br/><br/>Asystent wyszukiwania wyświetli również opcje obsady z wykorzystaniem jednego z fCals, gdy wymaga tego definicja usługi.<br/><br/>Jeśli potrzebujesz dodatkowych opcjonalnych kalendarzy, skontaktuj się ze swoim account managerem.', // polish
  3:'<b>Optionele agenda’s</b>:<br/><br/>Deze agenda’s stellen u in staat om fCals vrij toe te wijzen aan afspraken.<br/><br/>Ze zijn optioneel: een afspraak in een hoofdagenda kan geen, één of meerdere fCals toegewezen krijgen. Voorbeelden: materiaal dat nodig is voor bepaalde diensten waarbij u agendaconflicten wilt vermijden; assistenten die ondersteuning bieden bij diensten die extra hulp vereisen.<br/><br/>Webpagina’s waarmee your visitors online kunnen boeken, zullen altijd fCals toewijzen wanneer de servicedefinitie dit vereist (zie het tabblad “experts” in de sectie “services”).<br/><br/>De zoekassistent toont ook staffingsopties met één van de fCals, wanneer dit vereist is volgens de servicedefinitie.<br/><br/>Als u extra optionele agenda’s nodig hebt, neem dan contact op met uw accountmanager.', // dutch
  4:'<b>Optionale Agenden</b>:<br/><br/>Diese Agenden ermöglichen es Ihnen, fCals frei Terminen zuzuweisen.<br/><br/>Sie sind optional: Ein Termin in einer Hauptagenda kann keine, eine oder mehrere fCals zugewiesen bekommen. Beispiele: Ausstattung, die für bestimmte Leistungen benötigt wird, bei denen Sie Terminkonflikte vermeiden möchten; Zuweisung von Assistenten für Leistungen, die Unterstützung erfordern.<br/><br/>Webseiten, über die your visitors online buchen können, weisen immer fCals zu, wenn dies in der Servicedefinition gefordert ist (siehe den Reiter „experts“ im Bereich „services“).<br/><br/>Der Suchassistent zeigt außerdem Personaleinsatzoptionen mit einem der fCals an, wenn dies von der Servicedefinition verlangt wird.<br/><br/>Wenn Sie zusätzliche optionale Agenden benötigen, wenden Sie sich bitte an Ihren Account Manager.', // german
  5:'<b>Agende opzionali</b>:<br/><br/>Queste agende ti permettono di assegnare liberamente fCals agli appuntamenti.<br/><br/>Sono opzionali: un appuntamento in un’agenda principale può non avere alcun fCals, oppure averne uno o diversi assegnati. Esempi: attrezzature necessarie per alcuni servizi in cui vuoi evitare conflitti di agenda; assegnazione di assistenti per i servizi che richiedono supporto.<br/><br/>Le pagine web che permettono ai your visitors di prenotare online assegneranno sempre fCals quando ciò è richiesto dalla definizione del servizio (vedi la scheda “experts” nella sezione “services”).<br/><br/>L’assistente di ricerca mostrerà inoltre opzioni di staffing utilizzando uno dei fCals, quando richiesto dalla definizione del servizio.<br/><br/>Se hai bisogno di ulteriori agende opzionali, contatta il tuo account manager.', // italian
  6:'<b>Agendas opcionales</b>:<br/><br/>Estas agendas te permiten asignar fCals libremente a las citas.<br/><br/>Son opcionales: una cita en una agenda principal puede no tener ningún fCals asignado, o bien tener uno o varios. Ejemplos: equipamiento necesario para determinados servicios en los que quieres evitar conflictos de agenda; asignación de asistentes para servicios que requieren ayuda.<br/><br/>Las páginas web que permiten a your visitors reservar en línea asignarán siempre fCals cuando así lo requiera la definición del servicio (consulta la pestaña “experts” en la sección “services”).<br/><br/>El asistente de búsqueda también mostrará opciones de personal utilizando uno de los fCals, cuando lo requiera la definición del servicio.<br/><br/>Si necesitas agendas opcionales adicionales, contacta a tu account manager.', // spanish
  7:'<b>Agendas opcionais</b>:<br/><br/>Estas agendas permitem-lhe atribuir livremente fCals aos agendamentos.<br/><br/>São opcionais: um agendamento numa agenda principal pode não ter nenhum fCals, ou ter um ou vários fCals atribuídos. Exemplos: equipamento necessário para determinados serviços em que pretende evitar conflitos de agenda; atribuição de assistentes para serviços que necessitam de apoio.<br/><br/>As páginas web que permitem aos your visitors efetuar reservas online irão sempre atribuir fCals quando isso for exigido pela definição do serviço (ver o separador “experts” na secção “services”).<br/><br/>O assistente de pesquisa também apresentará opções de staffing utilizando um dos fCals, quando tal for exigido pela definição do serviço.<br/><br/>Se precisar de mais agendas opcionais, contacte o seu account manager.', // portuguese
  8:'<b>Optional Agenden</b>:<br/><br/>Dës Agenden erméiglechen et Iech fCals fräi un Rendez-vousen zouzeweisen.<br/><br/>Si sinn optional: E Rendez-vous an enger Haaptagenda kann kee, een oder méi fCals zougewise kréien. Beispiller: Material, dat fir bestëmmte Servicer néideg ass, wou Dir Agendakonflikter vermeide wëllt; Asaz vun Assistenten fir Servicer, déi Hëllef erfuerderen.<br/><br/>Websäiten, déi your visitors eng Online-Reservatioun erméiglechen, wäerten ëmmer fCals zouweisen, wa d’Servicedefinitioun et verlaangt (kuckt den Tab “experts” an der Rubrik “services”).<br/><br/>Den Sichassistent weist och Personalsoptiounen mat engem vun de fCals un, wann dat vun der Servicedefinitioun gefrot gëtt.<br/><br/>Wann Dir weider optional Agenden braucht, kontaktéiert wgl. Ären Account Manager.', // luxembourgish
};



	// preferences communications
	
// 		technical 					english:0,							french:1,							polish:2,						dutch:3,						german:4,							italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8
	
C_XL.d['phone region'] = { 0:'regional phone prefix', 1:'Préfixe téléphone régional', 2:'Prefix kraj', 3:'Land telefoon prefix', 4:'Ländervorwahl', 5:'Prefisso telefonico regionale', 6:'Prefijo telefónico regional', 7:'Prefixo de telefone regional', 8:'Regiounale Telefonsvirwahl' };
C_XL.d['email senderid'] = { 0:'email sender address', 1:'adresse E-mail émettrice', 2:'adres e-mail nadawcy', 3:'afzender E-mail adres', 4:'absenderadresse', 5:'Indirizzo email emittente', 6:'Dirección e-mail emisor', 7:'Endereço de email do remetente', 8:'E-Mail Senderadress' };
C_XL.d['sms senderid'] = { 0:'SMS sender ID', 1:'Numéro émetteur des SMS', 2:'Nadawcy wiadomości SMS id', 3:'SMS Sender ID', 4:'SMS Absendernummer', 5:'Numero emittente degli SMS', 6:'Número emisor de los SMS', 7:'Número do remetente dos SMS', 8:'SMS Sender ID' };
C_XL.d['call center phone'] = { 0:'call center phone', 1:'numéro du call center', 2:'telefon do centrum telefonicznego', 3:'callcenter telefoon', 4:'Call-Center-Telefon', 5:'telefono del call center', 6:'teléfono del centro de llamadas', 7:'telefone da central de atendimento', 8:'Call-Center-Telefon' };
C_XL.d['reminders options'] = { 0:'reminders options', 1:'Options des rappels', 2:'Opcje przypomnień', 3:'Herinneringen opties', 4:'Optionale Erinnerungen', 5:'Opzioni dei promemoria', 6:'Opciones de los recordatorios', 7:'Opções de lembretes', 8:'Erënnerungsoptiounen' };
C_XL.d['send sms messages'] = { 0:'activate sms messages sending', 1:'activer l\'envoi des sms', 2:'Wysyłanie SMS-ów', 3:'Stuur sms berichtjes', 4:'SMS Versand aktivieren', 5:'attivare l\'invio degli sms', 6:'activar el envío de los SMS', 7:'ativar o envio de sms', 8:'SMS-Noriichten aktivéieren' };
C_XL.d['activate messaging'] = { 0:'activate messaging', 1:'activer l\'envoi de messages', 2:'aktywuj wiadomości', 3:'Berichtjes sturen', 4:'Nachrichtenversand aktivieren', 5:'attivare l\'invio dei messaggi', 6:'activar el envío de los mensajes', 7:'ativar o envio de mensagens', 8:'Messagerie aktivéieren' };

C_XL.d['reminder'] = { 0:'reminder', 1:'Rappel', 2:'Przypomnienie', 3:'Herinnering', 4:'Erinnerung', 5:'Promemoria', 6:'Recordatorio', 7:'Lembrete', 8:'Erënnerung' };
C_XL.d['reminder d'] = { 0:'reminder at day - d', 1:'Rappel à jour - j', 2:'Przypomnienie na dzień - d', 3:'Herinnering op dag - d', 4:'Erinnerung am Tag - t', 5:'Promemoria aggiornato - g', 6:'recordatorio al día - g', 7:'Lembrete atualizado - d', 8:'Erënnerung um Dag - d' };
C_XL.d['reminder w'] = { 0:'reminder at day - w weeks', 1:'Rappel à jour - w semaines', 2:'Przypomnienie co dzień - w tydzień', 3:'Herinnering op dag - w weken', 4:'Erinnerung am Tag - w Wochen', 5:'Promemoria aggiornato - w settimane', 6:'recordatorio al día - w semanas', 7:'Lembrete atualizado - w semanas', 8:'Erënnerung um Dag - w Wochen' };
C_XL.d['reminder m'] = { 0:'reminder at day - m months', 1:'Rappel à jour - m mois', 2:'Przypomnienie na dzień - m miesiąc', 3:'Herinnering op dag - m maanden', 4:'Erinnerung am Tag - m Monate', 5:'Promemoria aggiornato - m mesi', 6:'recordatorio al día - m meses', 7:'Lembrete atualizado - m meses', 8:'Erënnerung um Dag - m Méint' };

C_XL.d['planned on'] = { 0:'Planned on', 1:'Planifié pour', 2:'Planowane na', 3:'Gepland op', 4:'Geplant am', 5:'Pianificato per', 6:'Planeado para', 7:'Planeado para', 8:'Geplangt fir' };
C_XL.d['sent on'] = { 0:'Sent on', 1:'Expédié le', 2:'Wysłany', 3:'Verstuurd op', 4:'Gesendet am', 5:'Inviato il', 6:'Enviado el', 7:'Enviado a', 8:'Geschéckt um' };
C_XL.d['not yet sent'] = { 0:'Not sent yet', 1:'Pas encore expédié', 2:'Jeszcze nie wysłane', 3:'Nog niet verstuurd', 4:'Noch nicht gesendet', 5:'Non ancora inviato', 6:'No enviado todavía', 7:'ainda não enviado', 8:'Nach net geschéckt' };
C_XL.d['should be actioned'] = { 0:'after activation', 1:'après activation', 2:'jest wysyłana po aktywacji', 3:'verzonden na activatie', 4:'nach der Aktivierung gesendet', 5:'viene inviato dopo l\'attivazione', 6:'se envía después de la activación', 7:'é enviada após a ativação', 8:'Nom Aktivéierung geschéckt' };
C_XL.d['will not be sent'] = { 0:'Will not be sent', 1:'Ne sera pas expédié', 2:'Nie zostaną wysłane', 3:'Zal niet worden verzonden', 4:'Wird nicht gesendet', 5:'Non sarà inviato', 6:'No se enviará', 7:'Não será enviado', 8:'Wäert net geschéckt ginn' };

C_XL.d['on resa creation'] = { 0:'when you create this reservation', 1:'à la création de ce RDV', 2:'natychmiast (potwierdzenie)', 3:'bij het eerste opslaan', 4:'Wenn Sie diese Reservierung erstellen', 5:'alla creazione di questo appuntamento', 6:'a la creación de esta cita', 7:'na criação desta consulta', 8:'Wann Dir dës Reservatioun erstallt' };
C_XL.d['on resa change'] = { 0:'when you change this reservation', 1:'lors de modification de ce RDV', 2:'natychmiast (potwierdzenie)', 3:'bij wijziging van die reservatie', 4:'Wenn Sie diese Reservierung ändern', 5:'alla modifica di questo appuntamento', 6:'a la modificación de esta cita', 7:'quando esta consulta for alterada', 8:'Wann Dir dës Reservatioun ännert' };
C_XL.d['on resa deletion'] = { 0:'when you delete this reservation', 1:'à l\'effacement de ce RDV', 2:'natychmiast (potwierdzenie)', 3:'bij het wissen van die reservatie', 4:'Wenn Sie diese Reservierung löschen', 5:'alla cancellazione di questo appuntamento', 6:'a la cancelación de esta cita', 7:'após a eliminação desta consulta', 8:'Wann Dir dës Reservatioun läscht' };
C_XL.d['on activation'] = { 0:'after activation', 1:'après activation', 2:'after activation', 3:'bij activatie', 4:'after activation', 5:'after activation', 6:'after activation', 7:'after activation', 8:'Nom Aktivéierung' };

C_XL.d['reminder eve'] = { 0:'the day before the appointment', 1:'la veille du RDV', 2:'przeddzień powołania', 3:'de dag voordien', 4:'am Tag vor dem Termin', 5:'il giorno prima dell\'appuntamento', 6:'el día antes de la cita', 7:'na véspera da consulta', 8:'De Dag virum Rendez-vous' };
C_XL.d['reminder two days'] = { 0:'two days before the appointment', 1:'deux jours avant le RDV', 2:'dwa dni przed wizytą', 3:'twee dagen voor de afspraak', 4:'zwei Tage vor dem Termin', 5:'due giorni prima dell\'appuntamento', 6:'dos días antes de la cita', 7:'dois dias antes da consulta', 8:'Zwee Deeg virum Rendez-vous' };
C_XL.d['reminder three days'] = { 0:'three days before the appointment', 1:'trois jours avant le RDV', 2:'trzy dni przed wizytą', 3:'drie dagen voor de afspraak', 4:'drei Tage vor dem Termin', 5:'tre giorni prima dell\'appuntamento', 6:'tres días antes de la cita', 7:'três dias antes da consulta', 8:'Dräi Deeg virum Rendez-vous' };
C_XL.d['reminder four days'] = { 0:'four days before the appointment', 1:'quatre jours avant le RDV', 2:'dzień dni przed wizytą', 3:'vier dagen voor de afspraak', 4:'vier Tage vor dem Termin', 5:'quattro giorni prima dell\'appuntamento', 6:'cuatro días antes de la cita', 7:'quatro dias antes da consulta', 8:'Véier Deeg virum Rendez-vous' };
C_XL.d['reminder one week'] = { 0:'one week before the appointment', 1:'une semaine avant le RDV', 2:'tydzień przed wizytą', 3:'één week voor de afspraak', 4:'eine Woche vor dem Termin', 5:'una settimana prima dell\'appuntamento', 6:'una semana antes de la cita', 7:'uma semana antes da consulta', 8:'Eng Woch virum Rendez-vous' };
C_XL.d['reminder two weeks'] = { 0:'two weeks before the appointment', 1:'deux semaines avant le RDV', 2:'dwa tygodnie przed wizytą', 3:'twee weken voor de afspraak', 4:'zwei Wochen vor dem Termin', 5:'due settimane prima dell\'appuntamento', 6:'dos semanas antes de la cita', 7:'duas semanas antes da consulta', 8:'Zwee Wochen virum Rendez-vous' };

C_XL.d['special'] = { 0:'Special', 1:'Spécial', 2:'Specjalny', 3:'Speciaal', 4:'Spezial', 5:'Speciale', 6:'Especial', 7:'Especial', 8:'Spezial' };
C_XL.d['action on agenda'] = { 0:'an action on the agenda', 1:'Une action sur l\'agenda', 2:'Działania na porządku dziennym', 3:'Een actie op de agenda', 4:'Eine Aktion auf dem Kalender', 5:'Un\'azione sull\'agenda', 6:'Una acción en el calendario', 7:'Uma ação no calendário', 8:'Eng Aktioun um Kalenner' };
C_XL.d['delivery delay'] = { 0:'Delivery delay after action', 1:'Délais d\'expédition après l\'action', 2:'Opóźnienie dostawy po akcji', 3:'Verzending vertraging na de actie', 4:'Verzögerung nach Versand', 5:'Tempi di spedizione dopo l\'azione', 6:'Plazos de envío después de la acción', 7:'atraso de envio após ação', 8:'Liwwerverzögerung no der Aktioun' };
C_XL.d['delivery ahead'] = { 0:'Delivery ahead of', 1:'Notification en avance de', 2:'Naprzód Dostawa', 3:'Notificatie met voorsprong van', 4:'Zustellung der Benachrichtigung vor', 5:'Notificazione in anticipo di', 6:'Notificación adelantada de', 7:'Notificação antes de', 8:'Liwwerung virun' };
C_XL.d['no delay'] = { 0:'Immediate (no delay)', 1:'Immédiat (aucun délais)', 2:'Natychmiastowe (bez opóźnienia)', 3:'Onmiddellijke (geen vertraging)', 4:'Sofort', 5:'Immediato (nessuna attesa)', 6:'Inmediato (ninguna espera)', 7:'Imediato (sem atraso)', 8:'Ouni Verzögerung' };
C_XL.d['manual notification'] = { 0:'Manual notification', 1:'Notification manuelle', 2:'Instrukcja powiadomienia', 3:'Manuele notificatie', 4:'Manuelle Benachrichtigung', 5:'Notificazione manuale', 6:'Notificación manual', 7:'Notificação manual', 8:'Manuell Notifikatioun' };
C_XL.d['on visitor record'] = { 0:'On visitor record save', 1:'L\'enregistrement d\'un visitor', 2:'Księga visitor rejestrowania', 3:'Op visitor dossier opnaam', 4:'Bei Besucherspeicherung', 5:'registrazione di un visitatore', 6:'registro de un visitante', 7:'registo de um visitante', 8:'Um Visiteur Date späicheren' };
C_XL.d['on visitor birthday'] = { 0:'On visitor\'s birthday', 1:'L\'anniversaire du visitor', 2:'Na visitor urodziny', 3:'Verjaardag van visitor', 4:'am Geburtstag des Besuchers', 5:'Compleanno del visitatore', 6:'Cumpleaños del visitante', 7:'aniversário do visitante', 8:'Um Gebuertsdag vum Visiteur' };
C_XL.d['h-x reminder'] = { 0:'appointment time minus X', 1:'Rappel de RDV à Heure moins X', 2:'Przypominamy godzinę minus X', 3:'afspraak herinnering om Uur min X', 4:'Terminerinnerung um Uhrzeit minus X', 5:'Promemoria di appuntamento all\'ora meno X', 6:'recordatorio de cita a la hora menos X', 7:'Lembrete da consulta à hora menos X', 8:'Erënnerung Rendez-vous minus X' };
C_XL.d['h+x reminder'] = { 0:'appointment time plus X', 1:'Rappel de RDV à Heure plus X', 2:'Przypominamy godzinę plus X', 3:'afspraak herinnering om Uur plus X', 4:'Terminerinnerung um Uhrzeit plus X', 5:'Promemoria di appuntamento all\'ora più X', 6:'recordatorio de cita a la hora más X', 7:'Lembrete da consulta à hora mais X', 8:'Erënnerung Rendez-vous plus X' };

// 		[technical name] 			english:0,				french:1,						polish:2,				dutch:3,				german:4,					italian:5,						spanish:6,							portuguese:7, 	luxembourgish:8
C_XL.d['lookup visitor'] = {
    0:'lookup a visitor',        // English
    1:'rechercher un visitor',   // French
    2:'wyszukaj visitor',        // Polish
    3:'zoek een visitor',        // Dutch
    4:'einen visitor suchen',    // German
    5:'cercare un visitor',      // Italian
    6:'buscar un visitor',       // Spanish
    7:'procurar um visitor',     // Portuguese
    8:'e visitor sichen'         // Luxembourgish
};

C_XL.d['create a visitor file'] = {
    0:'create a visitor ',        // English
    1:'créer un visitor',         // French
    2:'utwórz visitor',           // Polish
    3:'maak een visitor',         // Dutch
    4:'einen visitor erstellen',  // German
    5:'creare un visitor',        // Italian
    6:'crear un visitor',         // Spanish
    7:'criar um visitor',         // Portuguese
    8:'e visitor erstellen'       // Luxembourgish
};

C_XL.d['revival'] = { 0:'revival', 1:'relance', 2:'Wznowić', 3:'Hervatting', 4:'Wiederaufnahme', 5:'Sollecitare', 6:'reactivación', 7:'retomar', 8:'Erhuelung' };
C_XL.d['revival d'] = { 0:'revival at day + d', 1:'relance à jour + j', 2:'Przypomnienie', 3:'Hervatting op dag + d', 4:'Wiederaufnahme am Tag + t', 5:'Sollecitare al giorno + g', 6:'reactivación al día + g', 7:'retomar atualizado + d', 8:'Erhuelung um Dag + d' };
C_XL.d['revival w'] = { 0:'revival at day + w weeks', 1:'relance à jour + w semaines', 2:'Przypomnienie', 3:'Hervatting op dag + w weken', 4:'Wiederaufnahme am Tag + w Wochen', 5:'Sollecitare al giorno + w settimane', 6:'reactivación al día + w semanas', 7:'retomar atualizado + w semanas', 8:'Erhuelung um Dag + w Wochen' };
C_XL.d['revival m'] = { 0:'revival at day + m months', 1:'relance à jour + m mois', 2:'Przypomnienie', 3:'Hervatting op dag + m maanden', 4:'Wiederaufnahme am Tag + m Monaten', 5:'Sollecitare al giorno + m mesi', 6:'reactivación al día + m meses', 7:'retomar atualizado + m mês', 8:'Erhuelung um Dag + m Méint' };

C_XL.d['revival one day'] = { 0:'one day after the appointment', 1:'un jour après le RDV', 2:'dzień po powołaniu', 3:'één dag na de afspraak', 4:'ein Tag nach dem Termin', 5:'un giorno dopo l\'appuntamento', 6:'un día después de la cita', 7:'um dia após a consulta', 8:'Einen Dag no Rendez-vous' };
C_XL.d['revival one week'] = { 0:'one week after the appointment', 1:'une semaine après le RDV', 2:'tydzień po powołaniu', 3:'één week na de afspraak', 4:'eine Woche nach dem Termin', 5:'una settimana dopo l\'appuntamento', 6:'una semana después de la cita', 7:'uma semana após a consulta', 8:'Eng Woch no Rendez-vous' };
C_XL.d['revival two weeks'] = { 0:'two weeks after the appointment', 1:'deux semaines après le RDV', 2:'dwa tygodnie po powołaniu', 3:'twee weken na de afspraak', 4:'zwei Wochen nach dem Termin', 5:'due settimane dopo l\'appuntamento', 6:'dos semanas después de la cita', 7:'duas semanas depois a consulta', 8:'Zwee Wochen no Rendez-vous' };
C_XL.d['revival one month'] = { 0:'one months after the appointment', 1:'un mois après le RDV', 2:'jeden miesiąc po powołaniu', 3:'één maand na de afspraak', 4:'ein Monat nach dem Termin', 5:'un mese dopo l\'appuntamento', 6:'un mes después de la cita', 7:'um mês após a consulta', 8:'E Mount no Rendez-vous' };
C_XL.d['revival two months'] = { 0:'two months after the appointment', 1:'deux mois après le RDV', 2:'dwa miesiąc po powołaniu', 3:'twee maanden na de afspraak', 4:'zwei Monate nach dem Termin', 5:'due mesi dopo l\'appuntamento', 6:'dos meses después de la cita', 7:'dois mêses após a consulta', 8:'Zwee Méint no Rendez-vous' };
C_XL.d['revival three months'] = { 0:'three months after the appointment', 1:'trois mois après le RDV', 2:'trzy miesiąc po powołaniu', 3:'drie maanden na de afspraak', 4:'3 Monate nach dem Termin', 5:'tre mesi dopo l\'appuntamento', 6:'tres meses después de la cita', 7:'três meses após a consulta', 8:'Dräi Méint no Rendez-vous' };
C_XL.d['revival five months'] = { 0:'five months after the appointment', 1:'cinq mois après le RDV', 2:'Pięć miesięcy po powołaniu', 3:'vijf maanden na de afspraak', 4:'fünf Monate nach dem Termin', 5:'cinque mesi dopo l\'appuntamento', 6:'cinco meses después de la cita', 7:'cinco meses após a consulta', 8:'Fënnef Méint no Rendez-vous' };
C_XL.d['revival six months'] = { 0:'six months after the appointment', 1:'six mois après le RDV', 2:'sześć miesięcy po powołaniu', 3:'zes maanden na de afspraak', 4:'sechs Monate nach dem Termin', 5:'sei mesi dopo l\'appuntamento', 6:'seis meses después de la cita', 7:'seis meses após a consulta', 8:'Sechs Méint no Rendez-vous' };
C_XL.d['revival nine months'] = { 0:'nine months after the appointment', 1:'neuf mois après le RDV', 2:'dziewięć miesięcy po mianowaniu', 3:'negen maanden na de afspraak', 4:'neun Monate nach dem Termin', 5:'nove mesi dopo l\'appuntamento', 6:'nueve meses después de la cita', 7:'nove meses após a consulta', 8:'Néng Méint no Rendez-vous' };
C_XL.d['revival eleven months'] = { 0:'eleven months after the appointment', 1:'onze mois après le RDV', 2:'jedenaście miesięcy po mianowaniu', 3:'elf maanden na de afspraak', 4:'elf Monate nach dem Termin', 5:'undici mesi dopo l\'appuntamento', 6:'once meses después de la cita', 7:'onze meses depois a consulta', 8:'Eelef Méint no Rendez-vous' };
C_XL.d['revival one year'] = { 0:'one year after the appointment', 1:'un an après le RDV', 2:'rok po powołaniu', 3:'één jaar na de afspraak', 4:'ein Jahr nach dem Termin', 5:'un anno dopo l\'appuntamento', 6:'un año después de la cita', 7:'um ano após a consulta', 8:'Ee Joer no Rendez-vous' };
C_XL.d['revival months 18'] = { 0:'18 months after the appointment', 1:'18 mois après le RDV', 2:'18 miesięcy po mianowaniu', 3:'18 maanden na de afspraak', 4:'18 Monate nach dem Termin', 5:'18 mesi dopo l\'appuntamento', 6:'18 meses después de la cita', 7:'18 meses depois a consulta', 8:'18 Méint no Rendez-vous' };
C_XL.d['revival two years'] = { 0:'two years after the appointment', 1:'deux ans après le RDV', 2:'dwa lata po powołaniu', 3:'twee jaren na de afspraak', 4:'zwei Jahre nach dem Termin', 5:'due anni dopo l\'appuntamento', 6:'dos años después de la cita', 7:'dois anos após a consulta', 8:'Zwee Joer no Rendez-vous' };


// 		[technical name] 			english:0,				french:1,						polish:2,				dutch:3,				german:4,					italian:5,						spanish:6,							portuguese:7, 	luxembourgish:8
C_XL.d['notification'] = { 0:'Notification', 1:'Notification', 2:'Zgłoszenie', 3:'Melding', 4:'Benachrichtigung', 5:'Notificazione', 6:'Notificación', 7:'Notificação', 8:'Notifikatioun' };
C_XL.d['no notification'] = { 0:'no notification', 1:'pas de notification', 2:'brak powiadomienia', 3:'geen melding', 4:'keine Benachrichtigung', 5:'nessuna notifica', 6:'sin notificación', 7:'sem notificação', 8:'Keng Notifikatioun' };
C_XL.d['notifications'] = { 0:'Notifications', 1:'Notifications', 2:'Powiadomienia', 3:'Meldingen', 4:'Benachrichtigungen', 5:'Notificazioni', 6:'Notificaciones', 7:'Notificações', 8:'Notifikatiounen' };
C_XL.d['presence list'] = { 0:'Drop Duplicates', 1:'Suppression de doublon', 2:'Usuń duplikat', 3:'Verwijder dubbele', 4:'Duplikate verwerfen', 5:'Soppressione di doppioni', 6:'Supresión de los duplicados', 7:'remoção da duplicata', 8:'Duplikater läschen' };

C_XL.d['presence list note'] = { 
	0:'If two appointments are made on the same day indicating the same mobile number,	only the earliest appointment is reminded.',		
	1:'Si deux rendez-vous sont pris dans la même journée indiquant le même numéro de mobile, seul le RDV le plus tôt est rappelé.',			
	2:'Jeśli dwie nominacje są wykonane w tym samym dniu co wskazuje ten sam numer telefonu, tylko najwcześniej nominacja przypomnieć.',		
	3:'als twee afspraken worden gemaakt op dezelfde dag met vermelding van hetzelfde mobiele nummer,	wordt alleen de eerste afspraak herinnerd.',
	4:'Wenn zwei Termine am selben Tag die gleiche Mobilnummer haben, wird die Erinnerung nur für den früheren Termin gesendet.',	
	5:'Se due appuntamenti sono presi sulla stessa giornata indicando lo stesso numero di cellulare, solo l\'appuntamento il più presto sarà ricordato',	
	6:'Si dos citas están posicionadas en el mismo día con el mismo número de móvil, solo la cita más temprana recibirá un recordatorio.', 
	7:'Se tiverem sido marcados dois encontros no mesmo dia com o mesmo número de telemóvel, será notificado apenas o primeiro encontro.',
	8:'Wann zwee Rendez-vous um selwechten Dag mam selwechte mobilen Nummer gebucht sinn, gëtt nëmmen den éischten erënnert.'
};

C_XL.d['filter on actions'] = { 0:'Only after those actions', 1:'Seulement après ces actions', 2:'Dopiero po tych działań', 3:'Enkel na deze acties', 4:'Nur nach diesen Aktionen', 5:'Solo dopo queste azioni', 6:'Solo después de estas acciones', 7:'Somente após estas ações', 8:'Nëmmen no dësen Aktiounen' };
C_XL.d['filter on logins'] = { 0:'Only by some logins', 1:'Seulement par ces logins', 2:'Tylko niektóre loginy', 3:'Enkel door bepaalde logins', 4:'Nur von einigen Logins', 5:'Solo con questi logins', 6:'Solo con estos logins', 7:'Só por esses logins', 8:'Nëmmen duerch dës Logins' };
C_XL.d['filter on resources'] = { 0:'Only in certain agendas', 1:'Seulement dans certains agendas', 2:'Tylko niektóre programy', 3:'Enkel in bepaalde agendas', 4:'Nur in einigen Kalendern', 5:'Solo in alcune agende', 6:'Solo en algunos calendarios', 7:'apenas em certas agendas', 8:'Nëmmen an e puer Agendas' };

C_XL.d['resa_sms_list'] = C_XL.d['sms']; // !! No translation on this line

C_XL.d['resa_emails_list'] = { 0:'e-Mail', 1:'e-Mail', 2:'e-Mail', 3:'e-Mail', 4:'E-Mail', 5:'Email', 6:'E-mail', 7:'Email', 8:'E-Mail' };
C_XL.d['title'] = { 0:'Title', 1:'Titre', 2:'Tytuł', 3:'Title', 4:'Titel', 5:'Titolo', 6:'Título', 7:'Título', 8:'Titel' };
C_XL.d['message'] = { 0:'Message', 1:'Message', 2:'Wiadomość', 3:'Boodschap', 4:'Nachricht', 5:'Messaggio', 6:'Mensaje', 7:'Mensagem', 8:'Noriicht' };
C_XL.d['messages'] = { 0:'Messages', 1:'Messages', 2:'Wiadomości', 3:'Berichten', 4:'Nachrichten', 5:'Messaggi', 6:'Mensajes', 7:'Mensagens', 8:'Noriichten' };
C_XL.d['resa serie'] = { 0:'Series', 1:'Série', 2:'Seria', 3:'reeks', 4:'Serie', 5:'Serie', 6:'Serie', 7:'Série', 8:'Serie' };


// 		technical 			english:0,			french:1,				polish:2,				dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7, 	luxembourgish:8
C_XL.d['recurrence'] = { 0:'recurrence', 1:'Récurrence', 2:'Nawrót', 3:'Herhaling', 4:'Wiederholung', 5:'Ricorrenza', 6:'recurrencia', 7:'recorrência', 8:'Widderhuelung' };
C_XL.d['every'] = { 0:'every', 1:'tous les', 2:'co', 3:'om de', 4:'alle', 5:'tutti i', 6:'todos los', 7:'todos os', 8:'all Dag' };
C_XL.d['every -f'] = { 0:'every', 1:'toutes les', 2:'co', 3:'om de', 4:'alle', 5:'tutte le', 6:'todas las', 7:'todas as', 8:'all Dag' };
C_XL.d['days'] = { 0:'days', 1:'jours', 2:'dni', 3:'dagen', 4:'Tage', 5:'giorni', 6:'días', 7:'dias', 8:'Deeg' };
C_XL.d['weeks'] = { 0:'weeks', 1:'semaines', 2:'tygodnie', 3:'weken', 4:'Wochen', 5:'settimane', 6:'semanas', 7:'semanas', 8:'Wochen' };
C_XL.d['week'] = { 0:'week', 1:'semaine', 2:'tydzień', 3:'week', 4:'Woche', 5:'settimana', 6:'semana', 7:'semana', 8:'Woch' };
C_XL.d['months'] = { 0:'months', 1:'mois', 2:'miesiące', 3:'maanden', 4:'Monate', 5:'mesi', 6:'mes', 7:'mês', 8:'Méint' };
C_XL.d['years -f'] = { 0:'years', 1:'années', 2:'lata', 3:'jaren', 4:'Jahre', 5:'anni', 6:'años', 7:'anos', 8:'Joer' };
C_XL.d['years'] = { 0:'years', 1:'ans', 2:'lata', 3:'jaren', 4:'Jahre', 5:'anni', 6:'años', 7:'anos', 8:'Joer' };

C_XL.d['every day'] = { 0:'every day', 1:'chaque jour', 2:'każdego dnia', 3:'elke dag', 4:'jeden Tag', 5:'ogni giorno', 6:'cada día', 7:'todos os dias', 8:'All Dag' };
C_XL.d['every week'] = { 0:'every week', 1:'chaque semaine', 2:'raz na tydzień', 3:'elke week', 4:'jede Woche', 5:'ogni settimana', 6:'cada semana', 7:'todas as semanas', 8:'All Woch' };
C_XL.d['every month'] = { 0:'every month', 1:'chaque mois', 2:'każdego miesiąca', 3:'elke maand', 4:'jeden Monat', 5:'ogni mese', 6:'cada mes', 7:'todos os meses', 8:'All Mount' };
C_XL.d['every year'] = { 0:'every year', 1:'chaque année', 2:'co roku', 3:'elk jaar', 4:'jedes Jahr', 5:'ogni anno', 6:'cada año', 7:'todos os anos', 8:'All Joer' };

C_XL.d['repeats every'] = { 0:'repeats every', 1:'se répète', 2:'powtarza', 3:'herhaalt', 4:'wiederholt sich', 5:'si ripete', 6:'se repite', 7:'se repete', 8:'Widderhëlt all' };
C_XL.d['repetition'] = { 0:'repetition', 1:'répétition', 2:'powtórzenie', 3:'herhaling', 4:'Wiederholung', 5:'ripetizione', 6:'repetición', 7:'repetição', 8:'Widderhuelung' };
C_XL.d['repetitions'] = { 0:'repetitions', 1:'répétitions', 2:'powtórzeń', 3:'herhalingen', 4:'Wiederholungen', 5:'ripetizioni', 6:'repeticiones', 7:'repetições', 8:'Widderhuelungen' };
C_XL.d['iterations'] = { 0:'iterations', 1:'itérations', 2:'iteracji', 3:'iteraties', 4:'Iterationen', 5:'iterazione', 6:'iteración', 7:'iterações', 8:'Iteratiounen' };
C_XL.d['happens xt'] = { 0:'happens', 1:'se produit', 2:'iteracji', 3:'gebeurt', 4:'erfolgt', 5:'occorre', 6:'ocurre', 7:'ocorre', 8:'geschitt' };
C_XL.d['one time'] = { 0:'one time', 1:'une fois', 2:'jeden razy', 3:'één keer', 4:'ein Mal', 5:'una volta', 6:'una vez', 7:'uma vez', 8:'Eng Kéier' };
C_XL.d['x times'] = { 0:'times', 1:'fois', 2:'razy', 3:'keer', 4:'Mal', 5:'volte', 6:'veces', 7:'vez', 8:'Mol' };

C_XL.d['on first'] = { 0:'on the first', 1:'les premiers', 2:'pierwszy', 3:'de eerste', 4:'am ersten', 5:'i primi', 6:'los primeros', 7:'os primeiros', 8:'Um éischten' };
C_XL.d['on second'] = { 0:'on the second', 1:'les seconds', 2:'drugi', 3:'de tweede', 4:'am zweiten', 5:'i secondi', 6:'los segundos', 7:'os segundos', 8:'Um zweeten' };
C_XL.d['on third'] = { 0:'on the third', 1:'les troisièmes', 2:'trezeci', 3:'de derde', 4:'am dritten', 5:'i terzi', 6:'los terceros', 7:'os terceiros', 8:'Um drëtten' };
C_XL.d['on fourth'] = { 0:'on the fourth', 1:'les quatrièmes', 2:'czwarty', 3:'de vierde', 4:'am vierten', 5:'i quarti', 6:'los cuartos', 7:'os quartos', 8:'Um véierten' };
C_XL.d['on the last'] = { 0:'on the last', 1:'les derniers', 2:'ostatni', 3:'de laatste', 4:'am letzten', 5:'gli ultimi', 6:'los últimos', 7:'os últimos', 8:'Um leschten' };

C_XL.d['overbooking'] = { 0:'overbooking', 1:'surréservation', 2:'overbooking', 3:'overboeking', 4:'Überbuchung', 5:'su prenotazione', 6:'con reserva previa', 7:'sobrerreserva', 8:'Iwwerbuchung' };
C_XL.d['excluded'] = { 0:'excluded', 1:'exclue', 2:'wyłączony', 3:'uitgesloten', 4:'ausschließlich', 5:'esclusa', 6:'excluido', 7:'excluído', 8:'Ausgeschloss' };
C_XL.d['xclude date'] = { 0:'exclude date', 1:'exclure la date', 2:'wykluczyć tę datę', 3:'uitsluiten', 4:'ausschließlich Datum', 5:'escludere', 6:'excluir la fecha', 7:'excluir a data', 8:'Datum ausschléissen' };
C_XL.d['include date'] = { 0:'include back', 1:'ré-inclure', 2:'to znowu', 3:'weer omvatten', 4:'wieder einschließen', 5:'includere di nuovo', 6:'incluir de nuevo', 7:'voltar a incluir', 8:'Datum erëm ophuelen' };

C_XL.d['in last days'] = { 0:'in the last days', 1:'dans les derniers jours', 2:'w ostatnich dniach', 3:'in de laatste dagen', 4:'in den letzten Tagen', 5:'negli ultimi giorni', 6:'en los últimos días', 7:'nos últimos dias', 8:'An de leschten Deeg' };
C_XL.d['on last day'] = { 0:'on the last day', 1:'le dernier jour', 2:'ostatni dzień', 3:'de laatste dag', 4:'am letzten Tag', 5:'l\'ultimo giorno', 6:'el último día', 7:'último dia', 8:'Um leschten Dag' };
C_XL.d['penulti day'] = { 0:'on the penultimate day', 1:'l\'avant dernier jour', 2:'przedostatniego dnia', 3:'de voorlaatste dag', 4:'am vorletzen Tag', 5:'il penultimo giorno', 6:'el penúltimo día', 7:'o penúltimo dia', 8:'Um virdéitlechsten Dag' };

C_XL.d['days before eom'] = { 0:'days before end of month', 1:'jours avant la fin du mois', 2:'dni przed końcem miesiąca', 3:'dagen vóór het einde van de maand', 4:'Tage vor Monatsende', 5:'giorni prima della fine del mese', 6:'días antes de final de mes', 7:'dias antes do fim do mês', 8:'Deeg virum Enn vum Mount' };
C_XL.d['from resa serie'] = { 0:'Is part of a serie', 1:'Fait partie d\'une série', 2:'Jest częścią serii', 3:'Behoort tot een serie', 4:'ist Teil einer Serie', 5:'fa parte di una serie', 6:'forma parte de una serie', 7:'Faz parte de uma série', 8:'Ass Deel vun enger Serie' };
C_XL.d['del future apps'] = { 0:'Delete planned items', 1:'Supprimer les planifiés', 2:'Usuń zaplanowane pozycje', 3:'Verwijder geplande afspraken', 4:'Geplante Elemente löschen', 5:'Sopprimere i pianificati', 6:'Borrar los planificados', 7:'remover o planeado', 8:'Pläng läschen' };
C_XL.d['planned apps'] = { 0:'planned items', 1:'réservations planifiées', 2:'rezerwacje planowane', 3:'geplande afspraken', 4:'Geplante Elemente', 5:'Prenotazioni pianificate', 6:'reservas planificadas', 7:'reservas planeadas', 8:'Geplangt Artikele' };


C_XL.d['pls name serie'] = { 0:'please choose a title for your serie', 1:'Choisir un titre pour cette série', 2:'wybierz tytuł dla serii', 3:'kies dan een titel voor uw serie', 4:'Bitte wählen Sie für Ihre Serie einen Titel', 5:'scelga un titolo per questa serie', 6:'escoja un título para esta serie', 7:'escolha um título para esta série', 8:'wielt en Titel fir Är Serie' };

C_XL.d['tip click to switch to date'] = { 
	0:'click to switch the planning to this date',
	1:'cliquer pour voir cette date sur le planning',
	2:'kliknij,	aby przełączyć planowania do tej pory',
	3:'klik om de planning te schakelen naar deze datum',
	4:'Hier klicken um den Zeitplan auf diesen Tag zu tauschen',
	5:'cliccare per vedere questa data sul planning',	
	6:'hacer clic para ver esta fecha en el calendario', 
	7:'clique para visualizar esta data no planeamento',
	8:'klickt fir de Plang op dësen Datum ze wiesselen'
};

C_XL.d['tip include this date'] = { 
	0:'click to include this date in the list again',
	1:'cliquer pour inclure à nouveau la date',
	2:'kliknij,	aby włączyć tę datę na liście ponownie',
	3:'Klik op om deze datum terug in de lijst te nemen',
	4:'Hier klicken um dieses Datum wieder auf die Liste zu setzen',
	5:'cliccare per includere di nuovo questa data',
	6:'hacer clic para volver a incluir la fecha', 
	7:'clique para voltar a incluir esta data',
	8:'klickt fir dësen Datum erëm an d\'Lëscht opzehuelen'
};

C_XL.d['tip xclude this date'] = { 
	0:'click to exclude this date from the list',
	1:'cliquer pour exclure cette date',
	2:'kliknij,	aby wykluczyć tę datę z listy',
	3:'Klik op om deze datum uit de lijst te sluiten',
	4:'Hier klicken um dieses Datum aus der Liste entfernen',
	5:'cliccare per escludere questa data',
	6:'hacer clic para excluir esta fecha', 
	7:'clique para eliminar esta data',
	8:'klickt fir dësen Datum aus der Lëscht ze läschen'
};
	
// 		technical 				english:0,					french:1,					polish:2,						dutch:3,						german:4,						italian:5,					spanish:6,						portuguese:7, 	luxembourgish:8
C_XL.d['on the date'] = { 0:'on', 1:'le', 2:'na', 3:'op', 4:'am', 5:'il', 6:'el', 7:'em', 8:'op' };
C_XL.d['on a date'] = { 0:'on this date', 1:'à cette date', 2:'tego dnia', 3:'op deze dag', 4:'an diesem Datum', 5:'a questa data', 6:'en esta fecha', 7:'nesta data', 8:'op dësem Datum' };

C_XL.d['stops after'] = { 0:'stops after', 1:'s\'arrète après', 2:'zatrzymuje się po', 3:'stopt na', 4:'endet ab', 5:'si ferma dopo', 6:'para después', 7:'parar depois de', 8:'hält op no' };
C_XL.d['stops on'] = { 0:'stops on', 1:'s\'arrète le', 2:'zatrzymuje się w', 3:'stopt op', 4:'endet am', 5:'si ferma il', 6:'para el', 7:'parar em', 8:'hält op um' };

C_XL.d['attendee'] = { 0:'attendee', 1:'assigné', 2:'Uczestników', 3:'Toegewezen', 4:'Zugeteilt', 5:'attribuito', 6:'Participante', 7:'atribuído', 8:'Matmaachen' };
C_XL.d['predefined'] = { 0:'Templates', 1:'Prédéfinis', 2:'Szablony', 3:'Voorbeelden', 4:'Vorlage', 5:'Predefinito', 6:'Predefinido', 7:'Predefinidos', 8:'Virdefinéiert' };
C_XL.d['attributes'] = { 0:'attributes', 1:'attributs', 2:'atrybuty', 3:'attributeb', 4:'Eigenschaften', 5:'attributi ', 6:'Características', 7:'atributos', 8:'Attributer' };

C_XL.d['email template'] = { 0:'e-Mail template', 1:'e-Mail pré-formaté', 2:'szablon e-Mail', 3:'e-Mail sjabloon', 4:'E-Mail Vorlage', 5:'Email predefinito', 6:'E-mail preformateado', 7:'email pré-formatado', 8:'E-Mail Schabloun' };
C_XL.d['email templates'] = { 0:'e-Mail templates', 1:'e-Mail pré-formatés', 2:'szablonów e-Mail', 3:'e-Mail sjablonen', 4:'E-Mail Vorlagen', 5:'Email predefiniti', 6:'E-mails preformateados', 7:'Emails pré-formatados', 8:'E-Mail Schablounen' };

C_XL.d['sms template'] = { 0:'SMS template', 1:'SMS pré-formaté', 2:'szablon SMS', 3:'SMS sjabloon', 4:'SMS Vorlage', 5:'SMS predefinito', 6:'SMS preformateado', 7:'SMS pré-formatado', 8:'SMS Schabloun' };
C_XL.d['sms templates'] = { 0:'SMS templates', 1:'SMS pré-formatés', 2:'szablonów SMS', 3:'SMS sjablonen', 4:'SMS Vorlagen', 5:'SMS predefiniti', 6:'SMS preformateados', 7:'SMS pré-formatados', 8:'SMS Schablounen' };

C_XL.d['notif template'] = { 0:'notification', 1:'notification', 2:'powiadomień', 3:'melding', 4:'Benachrichtigung', 5:'notifica', 6:'notificación', 7:'notificação', 8:'Notifikatioun' };
C_XL.d['notif templates'] = { 0:'notifications', 1:'notifications', 2:'powiadomienia', 3:'meldingen', 4:'Benachrichtigungen', 5:'notifiche', 6:'notificaciones', 7:'notificações', 8:'Notifikatiounen' };
C_XL.d['notif subject'] = { 0:'subject', 1:'sujet', 2:'temat', 3:'onderwerp', 4:'Betreff', 5:'oggetto', 6:'asunto', 7:'assunto', 8:'Thema' };
C_XL.d['notif message'] = { 0:'body', 1:'texte', 2:'treść', 3:'bericht', 4:'Text', 5:'corpo', 6:'cuerpo', 7:'corpo', 8:'Text' };

C_XL.d['sms gateaway title'] = { 0:'Outbound SMS', 1:'SMS sortant', 2:'SMS gateaway', 3:'SMS gateaway', 4:'SMS gateaway', 5:'SMS gateaway', 6:'SMS gateaway', 7:'SMS gateaway', 8:'SMS Ausgang' };
C_XL.d['sms gateaway'] = { 0:'SMS gateaway', 1:'Portail SMS', 2:'SMS gateaway', 3:'SMS gateaway', 4:'SMS gateaway', 5:'SMS gateaway', 6:'SMS gateaway', 7:'SMS gateaway', 8:'SMS Portal' };
C_XL.d['sms encoding'] = { 0:'Characters set', 1:'Jeu de caractères', 2:'SMS encoding', 3:'SMS encoding', 4:'SMS encoding', 5:'SMS encoding', 6:'SMS encoding', 7:'SMS encoding', 8:'SMS Kodéierung' };
C_XL.d['sms priority'] = { 0:'Network priority', 1:'Priorité réseau', 2:'SMS priority', 3:'SMS priority', 4:'SMS priority', 5:'SMS priority', 6:'SMS priority', 7:'SMS priority', 8:'SMS Prioritéit' };

C_XL.d['inbound sms title'] = { 0:'Inbound SMS treatment', 1:'SMS entrant', 2:'SMS inbound treatment', 3:'SMS inbound treatment', 4:'SMS inbound treatment', 5:'SMS inbound treatment', 6:'SMS inbound treatment', 7:'SMS inbound treatment', 8:'SMS Entrant Behandlung' };
C_XL.d['inbound action'] = { 0:'Inbound action', 1:'action sur les sms entrant', 2:'inbound SMS action', 3:'inbound SMS action', 4:'inbound SMS action', 5:'inbound SMS action', 6:'inbound SMS action', 7:'inbound SMS action', 8:'SMS Entrant Aktioun' };
C_XL.d['autoreply msg'] = { 0:'autoreply message', 1:'Réponse automatique', 2:'autoreply message', 3:'autoreply message', 4:'autoreply message', 5:'autoreply message', 6:'autoreply message', 7:'autoreply message', 8:'Automatesch Äntwert' };
C_XL.d['send test msg'] = { 0:'Send test msg', 1:'Faire un test', 2:'Send test msg', 3:'Send test msg', 4:'Send test msg', 5:'Send test msg', 6:'Send test msg', 7:'Send test msg', 8:'Test Noriicht schécken' };

C_XL.d['reminder form'] = { 0:'SMS Settings', 1:'Paramètres SMS', 2:'Parametry SMS-ów', 3:'SMS Settings', 4:'SMS Einstellungen', 5:'Parametri SMS', 6:'Configuraciones SMS', 7:'Configurações de SMS', 8:'SMS Astellungen' };
C_XL.d['email form'] = { 0:'Email Settings', 1:'Paramètres email', 2:'Parametry Email-ów', 3:'Email Settings', 4:'E-Mail Einstellungen', 5:'Parametri Email', 6:'Configuraciones Email', 7:'Configurações de e-mail', 8:'E-Mail Astellungen' };
C_XL.d['sms message'] = { 0:'Sms message', 1:'Message sms', 2:'Wiadomość SMS', 3:'Sms boodschap', 4:'SMS Nachricht', 5:'Messaggio SMS', 6:'Mensaje SMS', 7:'Mensagem SMS', 8:'SMS Noriicht' };
C_XL.d['multipage sms'] = { 0:'Multi-pages SMS', 1:'SMS multi-pages', 2:'Wielostronicowy sms', 3:'Multi-pagina SMS', 4:'Mehrseitige SMS', 5:'SMS varie pagine', 6:'SMS varias páginas', 7:'SMS com várias páginas', 8:'Multi-Säiten SMS' };
C_XL.d['email subject'] = { 0:'subject', 1:'sujet', 2:'temat emalia', 3:'onderwerp', 4:'Betreff', 5:'Soggetto', 6:'asunto', 7:'assunto', 8:'Thema' };
C_XL.d['email message'] = { 0:'email body', 1:'corps de l\'email', 2:'treści e-maili', 3:'Email bericht', 4:'E-Mail Nachricht', 5:'Corpo della mail', 6:'Cuerpo del e-mail', 7:'Corpo do e-mail', 8:'E-Mail Text' };

C_XL.d['standard message'] = { 0:'Standard message', 1:'Message standard', 2:'standardową wiadomość', 3:'standaard bericht', 4:'Standardnachricht', 5:'Messaggio standard', 6:'Mensaje estándar', 7:'Mensagem padrão', 8:'Standard Noriicht' };
C_XL.d['alt message in'] = { 0:'alternative language', 1:'Langue alternative', 2:'Wiadomość Alternatif', 3:'alternatieve taal', 4:'alternativve Sprache', 5:'Lingua alternativa', 6:'Idioma alternativo', 7:'Língua alternativa', 8:'Alternativ Sprooch' };

C_XL.d['delivery datetime'] = { 0:'Delivery schedule', 1:'Envoi du message', 2:'Wysłanie wiadomości', 3:'Sms uitzending', 4:'SMS Versand', 5:'Invio messaggio', 6:'Envío mensaje', 7:'Enviar Mensagem', 8:'Liwwerdagplang' };
C_XL.d['delivery target'] = { 0:'recepient', 1:'Destinataire', 2:'adresat', 3:'Bestemming', 4:'Empfänger', 5:'Destinatario', 6:'Destinatario', 7:'Destinatário', 8:'Empfänger' };
C_XL.d['delivery time'] = { 0:'Delivery time', 1:'Heure d\'envoi', 2:'Godzina nadania', 3:'Uitzending tijd', 4:'Versandzeit', 5:'Ora d\'invio', 6:'Hora de envío', 7:'Hora do envio', 8:'Liwwerzäit' };
C_XL.d['delivery day'] = { 0:'Delivery day', 1:'Jour d\'envoi', 2:'Dzień nadania', 3:'Uitzending dag', 4:'Versandtag', 5:'Giorno d\'invio', 6:'Día de envío', 7:'Dia do envio', 8:'Liwwerdag' };
C_XL.d['delivery trigger'] = { 0:'Trigger', 1:'Déclencheur', 2:'Spust', 3:'Trekker', 4:'auslöser', 5:'Innesco', 6:'Detonante', 7:'Desencadeamento', 8:'Ausléiser' };

C_XL.d['timing and trigger'] = { 0:'Trigger and timing', 1:'Déclencheur et timing', 2:'Spust i czas', 3:'Trekker en timing', 4:'auslöser und Uhrzeit', 5:'Innesco e timing', 6:'Detonante y sincronización', 7:'Desencadeamento e sincronismo', 8:'Ausléiser a Timing' };
C_XL.d['trigger appointment'] = { 0:'appointment time', 1:'Heure du rendez-vous', 2:'Czas spotkania', 3:'afspraak tijdstip', 4:'Terminzeitpunkt', 5:'Ora dell\'appuntamento', 6:'Hora de la cita', 7:'Hora da consulta', 8:'Rendez-vous Zäit' };
C_XL.d['trigger statusCss'] = { 0:'Status', 1:'Statuts', 2:'Status', 3:'Statussen', 4:'Status', 5:'Status', 6:'Estado', 7:'Estados', 8:'Status' };
C_XL.d['trigger specAppCss'] = { 0:'Special appointments', 1:'rendez-vous spéciaux', 2:'Specjalne spotkanie', 3:'Speciale afspraak', 4:'Besondere Termine', 5:'appuntamenti speciali', 6:'Citas especiales', 7:'Compromissos especiais', 8:'Besonnesch Rendez-vous' };

C_XL.d['trigger specUnaCss'] = { 0:'Special unavailabilities', 1:'Indisponibilités spéciales', 2:'Specjalne niedostępności', 3:'Speciale onbeschikbaarheden', 4:'Besondere Nichtverfügbarkeiten', 5:'Indisponibilità speciali', 6:'Indisponibilidades especiales', 7:'Indisponibilidades especiais', 8:'Besonnesch Onverfügbarkeeten' };

C_XL.d['logins watching over'] = { 0:'Logins notified for', 1:'Logins notifiés pour les', 2:'Loginy zgłoszony do', 3:'Logins gemeld voor', 4:'Benachrichtigungen für Logins', 5:'Logins notificati per i', 6:'Logins comunicados para los', 7:'Logins notificados para', 8:'Logins informéiert fir' };

C_XL.d['logins target note'] = { 
	0:'Please check logins settings. On tab "Notifications" you can specify for which agendas notifications should be sent.',		
	1:'Vérifiez le réglage des logins. Sur l\'onglet "Notifications" vous pouvez spécifiez pour quels agendas des notifications seront reçues.',			
	2:'Sprawdź ustawienia logowania. W zakładce "Wiadomości" można określić raporty otrzymane.',		
	3:'Controleer de instelling van logins. Op de tab "Meldingen" kunt u specifieren voor welke agendas zijn meldingen gestuurd.',
	4:'Bitte Kontoeinstellungen überprüfen. Im Tab "Benachrichtigungen" können Sie die Kalender auswählen, für die Sie Benachrichtigungen empfangen möchten.',	
	5:'Verifichi la configurazione dei logins. Sull\'etichetta "Notificazioni" potrà specificare per quali agende le notificazioni saranno ricevute.',	
	6:'Compruebe la configuración de los logins. En la pestaña "Notificaciones" puede especificar para cuales calendarios las notificaciones serán recibidas.', 
	7:'Verifique a configuração dos logins. Na aba "Notificações" pode especificar quais os calendários que receberão as notificações.',
	8:'Iwwerpréift d\'Login-Astellungen. Am Tab "Notifikatiounen" kënnt Dir uginn, fir wéi eng Agendas Notifikatiounen geschéckt ginn.'
};

C_XL.d['logins watchover note'] = { 
	0:'select here agendas for which this login must receive notifications.',	
	1:'indiquez ici les agendas pour lesquels ce login doit recevoir des notifications.',			
	2:'wpisz tutaj zadania dla których ten logowania musi otrzymywać powiadomienia.',		
	3:'voer hier de agenda\'s waarvoor deze login moet meldingen ontvangen.',
	4:'hier die Kalender auswählen, für die dieses Konto Benachrichtigungen erhalten soll.',	
	5:'indichi qui per quali agende questo login deve ricevere notificazioni.',	
	6:'indique aquí para cuales calendarios este login debe recibir notificaciones.', 
	7:'insira aqui os calendários para os quais este início de sessão deve receber notificações.',
	8:'Wielt hei d\'Agendas aus, fir déi dëse Login Notifikatiounen muss kréien.'
};

C_XL.d['not on own actions'] = { 
	0:'does not apply for this login\'s own actions on selected agendas.',	
	1:'ne s\'applique pas aux actions propres à ce login sur ces agendas.',			
	2:'nie dotyczy własnych działań tego loginu w wybranych agendach.',		
	3:'geldt niet voor de eigen acties van deze login op geselecteerde agenda\'s.',
	4:'gilt nicht für die eigenen Aktionen dieses Logins auf ausgewählten Agenden.',	
	5:'non si applica alle azioni di questo accesso su agende selezionate.',	
	6:'no aplica para acciones propias de este inicio de sesión en agendas seleccionadas.', 
	7:'não se aplica às próprias ações deste login em agendas selecionadas.',
	8:'gëllt net fir d\'eegen Aktioune vun dësem Login op ausgewielten Agendas.'
};

C_XL.d['logins wk popups note'] = { 
	0:'for this login, you can activate pop-up intended for secratary when a performance is selected.',	
	1:'pour ce login, activer les pop-up secrétariat lors de la sélection d\'une prestation.',			
	2:'dla tego logowania aktywuj pop-up okienka sekretariatu podczas wybierania usługi.',		
	3:'activeer voor deze login de pop-ups bij het selecteren van een dienst, aangepast voor secretariaat.',
	4:'Aktivieren Sie für diesen Login die Sekretariats-Popups bei der Auswahl eines Dienstes.',	
	5:'per questo login attivare i pop-up di segreteria alla selezione di un servizio.',	
	6:'para este inicio de sesión, active las ventanas emergentes de la secretaría al seleccionar un servicio.', 
	7:'para este login, ative os pop-ups da secretaria ao selecionar um serviço.',
	8:'Fir dëse Login kënnt Dir Pop-ups fir d\'Sekretariat aktivéieren wann eng Leeschtung ausgewielt gëtt.'
};

C_XL.d['popups on wk selection'] = { 
	0:'pop-up when a performance is selected.', 
	1:'pop-up à la sélection d\'une prestation.', 
	2:'pop-up podczas wybierania usługi.', 
	3:'pop-up bij het selecteren van een dienst.', 
	4:'Pop-up, wenn Sie einen Dienst auswählen.', 
	5:'pop-up quando si seleziona un servizio.', 
	6:'aparece al seleccionar un servicio.', 
	7:'pop-up ao selecionar um serviço.', 
	8:'Pop-up wann eng Leeschtung ausgewielt gëtt.' 
};

C_XL.d['workcode pop-up title'] = { 
	0:'there is a guideline associated with this performance:', 
	1:'il y a une directive associée à cette prestation:', 
	2:'z tym świadczeniem związana jest dyrektywa:', 
	3:'er is een richtlijn verbonden aan deze uitkering:', 
	4:'Mit dieser Leistung ist eine Richtlinie verbunden:', 
	5:'C\'è una direttiva associata a questo servizio:', 
	6:'hay una directiva asociada a este beneficio:', 
	7:'existe uma diretiva associada a este benefício:', 
	8:'Et gëtt eng Direktive déi mat dëser Leeschtung verbonne gëtt:' 
};

C_XL.d['product pop-up title'] = { 
    0: 'there are guidelines associated with this product:',                 // english
    1: 'il y a des directives associées à ce produit:',                      // french
    2: 'Istnieją wytyczne związane z tym produktem:',                         // polish
    3: 'er zijn richtlijnen verbonden aan dit product:',                     // dutch
    4: 'es gibt Richtlinien, die mit diesem Produkt verbunden sind:',         // german
    5: 'ci sono linee guida associate a questo prodotto:',                    // italian
    6: 'hay directrices asociadas a este producto:',                         // spanish
    7: 'há diretrizes associadas a este produto:',                           // portuguese
    8: 'Et ginn Richtlinnen, déi mat dësem Produit verbonnen sinn:'          // luxembourgish
};

C_XL.d['com default disabled note'] = { 
	0:'In the appointment slips, communication will appear disabled. You need to check it manualy to let it happen.',	
	1:'Dans les fiches de RDV, la communication apparaîtra désactivée. Vous devez la cochez manuellement pour qu\'elle s\'opère.',			
	2:'Ślizga przyjęć, komunikacja będzie wyświetlana wyłączona. Trzeba sprawdzić ręcznie obsługiwać.',		
	3:'In de afspraak slips, communicatie zal uitgeschakeld verschijnen. U moet die manueel checken om het te bedienen.',
	4:'In der Termindatei wird die Kommunikation als deaktiviert angezeigt werden. Das Kästchen muss manuell ausgewählt werden um sie zu betätigen.',	
	5:'Nelle schede di appuntamenti, la comunicazione apparirà come disattivata. Dovrà selezionarla manualmente in modo che si effettui.',
	6:'En las fichas de citas, la comunicación aparecerá como desactivada. Tendrá que seleccionarla manualmente para que se efectue.', 
	7:'Nas fichas de encontros, a comunicação estará desativada. Irá ser necessário selecionar manualmente a comunicação para que a mesma seja efetuada.',
	8:'An den Rendez-vous Kaarte gëtt d\'Kommunikatioun als desaktivéiert ugewise. Dir musst se manuell auswielen fir datt se stattfënnt.'
};

C_XL.d['com in day enabled note'] = { 
	0:'This communication is automatically activated for a modification in the current diary day.',	
	1:'Cette communication s\'active automatiquement pour une modification dans la journée d\'agenda en cours.',			
	2:'Ta komunikacja jest automatycznie aktywowana dla modyfikacji w bieżącym dniu kalendarzowym.',		
	3:'Deze communicatie wordt automatisch geactiveerd bij een wijziging in de huidige agendadag.',
	4:'Diese Kommunikation wird bei einer Änderung am aktuellen Tagebuchtag automatisch aktiviert.',	
	5:'Questa comunicazione si attiva automaticamente per una modifica nel giorno corrente dell\'agenda.',
	6:'Esta comunicación se activa automáticamente para una modificación en el día del diario actual.', 
	7:'Esta comunicação é ativada automaticamente para uma modificação no dia atual do diário.',
	8:'Dës Kommunikatioun gëtt automatesch aktivéiert fir eng Ännerung um aktuellen Agenda-Dag.'
};

C_XL.d['action default note'] = { 
	0:'Creating or changing an appointment will trigger a communication.',	
	1:'La création ou la modification d \'un RDV provoquera l\'envoi d\'une communication.',			
	2:'Tworzenie lub zmiana terminu spowoduje komunikat.',		
	3:'Het maken of een afspraak wijzigen gaat een mededeling triggeren.',
	4:'Das Erstellen oder Ändern eines Termins löst automatisch eine Kommukation aus.',	
	5:'La creazione o la modifica di un appuntamento causerà l\'invio di una comunicazione',	
	6:'La creación o la modificación de una cita generará el envío de una comunicación.', 
	7:'Criar ou alterar uma consulta causará o envio de uma comunicação.',
	8:'D\'Erstellung oder Ännerung vun engem Rendez-vous wäert eng Kommunikatioun ausléisen.'
};

									
C_XL.d['blueprint sound volume'] = { 
	0:'You can adjust here the global volume of warning sounds (login, logoff, warnings, alerts and setup saves).',	
	1:'Vous pouvez ajuster ici le volume général des animations sonores (login, logoff, attentions, alertes et enregistrement de setup).',			
	2:'Tutaj możesz dostosować globalną głośność dźwięków ostrzegawczych (logowanie, wylogowanie, ostrzeżenia, alerty i zapisy konfiguracji).',		
	3:'U kunt hier het globale volume van waarschuwingsgeluiden aanpassen (aanmelden, afmelden, waarschuwingen, waarschuwingen en opgeslagen instellingen).',
	4:'Sie können hier die globale Lautstärke der Warntöne (Anmeldung, Abmeldung, Warnungen, Alarme und Setup-Speicherungen) anpassen.',
	5:'È possibile regolare qui il volume globale dei suoni di avviso (accesso, disconnessione, avvisi, avvisi e salvataggi di configurazione).',	
	6:'Puede ajustar aquí el volumen global de los sonidos de advertencia (inicio de sesión, cierre de sesión, advertencias, alertas y ajustes guardados).', 
	7:'Você pode ajustar aqui o volume global dos sons de aviso (login, logoff, avisos, alertas e configurações salvas).',
	8:'Dir kënnt hei de globale Volume vun den Warnsignaler (Login, Logoff, Warnungen, Alarmer an Astellungen späicheren) upassen.'
};

C_XL.d['blueprint eresa login view'] = { 
	0:'for this web page, only the following resources will be visible as well as the selected services (if no service is selected, the web page offers all the e-bookable services)',		// english
	1:'pour cette page web, seules les resources suivantes seront visibles ainsi que les prestations sélectionnées (si aucune prestation n\'est sélectionnée, la page web propose toutes les prestations e-reservables)',	// french
	2:'dla tej strony internetowej widoczne będą tylko następujące zasoby oraz wybrane usługi (jeśli żadna usługa nie zostanie wybrana, strona internetowa oferuje wszystkie usługi możliwe do e-rezerwacji)',	// polish
	3:'voor deze webpagina zijn alleen de volgende bronnen zichtbaar, evenals de geselecteerde services (als er geen service is geselecteerd, biedt de webpagina alle e-boekbare services)',	// dutch
	4:'Für diese Webseite werden nur die folgenden Ressourcen sowie die ausgewählten Dienste angezeigt (wenn kein Dienst ausgewählt ist, bietet die Webseite alle e-buchbaren Dienste an)',		// german
	5:'per questa pagina web saranno visibili solo le seguenti risorse oltre ai servizi selezionati (se non è selezionato alcun servizio, la pagina web offre tutti i servizi prenotabili in e-book)',		// italian
	6:'para esta página web, solo los siguientes recursos serán visibles, así como los servicios seleccionados (si no se selecciona ningún servicio, la página web ofrece todos los servicios de reserva electrónica)', 	// spanish
	7:'para esta página da web, apenas os seguintes recursos serão visíveis, bem como os serviços selecionados (se nenhum serviço for selecionado, a página da web oferece todos os serviços e-bookable)',	// portuguese
	8:'Fir dës Websäit sinn nëmmen déi folgend Ressourcen an déi ausgewielten Déngschter sichtbar (wann keen Déngscht ausgewielt ass, bitt d\'Websäit all e-Buchbar Déngschter un).'	// luxembourgish
};

C_XL.d['blueprint human login view'] = { 
	0:'for this login, only the following resources will be visible.',		// english
	1:'pour ce login, seules les resources suivantes seront visibles',		// french
	2:'dla tego logowania widoczne będą tylko następujące zasoby',			// polish
	3:'voor deze login zijn alleen de volgende agendas zichtbaar',			// dutch
	4:'Für diese Anmeldung sind nur die folgenden Ressourcen sichtbar',		// german
	5:'per questo accesso saranno visibili solo le seguenti risorse',		// italian
	6:'para este inicio de sesión, solo serán visibles los siguientes recursos', 	// spanish
	7:'para este login, apenas os seguintes recursos estarão visíveis',		// portuguese
	8:'Fir dëse Login si nëmmen déi folgend Ressourcen sichtbar.'		// luxembourgish
};

C_XL.d['sounds volume'] = { 0:'sounds level', 1:'volume des sons', 2:'głośność dźwięku', 3:'geluidsvolume', 4:'Lautstärke', 5:'suoni volume', 6:'volumen de sonidos', 7:'volume do som', 8:'Tounniveau' };

C_XL.d['indicates'] = { 0:'Indicating', 1:'Indiquant', 2:'Wskazujący', 3:'Vermeldt', 4:'angabe', 5:'Indicando', 6:'Indicando', 7:'Indicando', 8:'Uweisen' };
C_XL.d['before scheduled'] = { 0:'before scheduled time', 1:'d\'avance sur le timing', 2:'wcześniej niż w harmonogramie', 3:'voorhang op timing', 4:'vor geplanter Uhrzeit', 5:'in anticipo sul timing', 6:'adelantado sobre la hora', 7:'antecipação sobre a hora', 8:'Vir der geplangter Zäit' };

C_XL.d['credentials'] = { 0:'credentials', 1:'accès', 2:'dostęp', 3:'toegang', 4:'Zugang', 5:'credenziali', 6:'accesi', 7:'credenciais', 8:'Umeldungsinformatiounen' };
C_XL.d['login'] = { 0:'Login', 1:'Login', 2:'Użytkownik', 3:'Login', 4:'Login', 5:'Login', 6:'Login', 7:'Início de sessão', 8:'Login' };
C_XL.d['new login'] = { 0:'New login', 1:'Nouvel accès', 2:'Nowy login', 3:'Nieuwe login', 4:'neuer Login', 5:'Nuovo accesso', 6:'Nuevo acceso', 7:'Novo acesso', 8:'Neie Login' };
C_XL.d['pass'] = { 0:'Password', 1:'Mot de passe', 2:'Hasło', 3:'Passwoord', 4:'Passwort', 5:'Password', 6:'Contraseña', 7:'Palavra-passe', 8:'Passwuert' };
C_XL.d['view'] = { 0:'View', 1:'Vue', 2:'Widok', 3:'Zicht', 4:'ansicht', 5:'Vista', 6:'Vista', 7:'Visto', 8:'Vue' };

// ch stands for credentials help
//

C_XL.d['ch l intro'] = { 
    0: 'your login must contain', // english
    1: 'votre login doit contenir', // french
    2: 'Twój login musi zawierać', // polish
    3: 'uw login moet het volgende bevatten:', // dutch
    4: 'uw login finden Sie die folgenden Anweisungen:', // german
    5: 'il tuo login deve contenere', // italian
    6: 'su inicio de sesión debe contener', // spanish
    7: 'seu login deve conter', // portuguese
    8: 'Ären Login muss enthalen' // luxembourgish
};

C_XL.d['ch p intro'] = { 
    0: 'your password must contain', // english
    1: 'votre mot de passe doit contenir', // french
    2: 'Twoje hasło musi zawierać', // polish
    3: 'uw wachtwoord moet het volgende bevatten:', // dutch
    4: 'uw login finden Sie die folgenden Anweisungen:', // german
    5: 'la tua password deve contenere', // italian
    6: 'su contraseña debe contener', // spanish
    7: 'sua senha deve conter', // portuguese
    8: 'Äert Passwuert muss enthalen' // luxembourgish
};

C_XL.d['ch smalls'] = { 
    0: 'at least two lowercase letters', // english
    1: 'au minimum deux lettres minuscules', // french
    2: 'co najmniej dwie małe litery', // polish
    3: 'minimaal twee kleine letters', // dutch
    4: 'mindestens zwei Kleinbuchstaben', // german
    5: 'almeno due lettere minuscole', // italian
    6: 'al menos dos letras minúsculas', // spanish
    7: 'pelo menos duas letras minúsculas', // portuguese
    8: 'op d’mannst zwee kleng Buschtawe' // luxembourgish
};

C_XL.d['ch uppers'] = { 
    0: 'at least two uppercase letters', // english
    1: 'au minimum deux lettres majuscules', // french
    2: 'co najmniej dwie wielkie litery', // polish
    3: 'minimaal twee hoofdletters', // dutch
    4: 'mindestens zwei Großbuchstaben', // german
    5: 'almeno due lettere maiuscole', // italian
    6: 'al menos dos letras mayúsculas', // spanish
    7: 'pelo menos duas letras maiúsculas', // portuguese
    8: 'op d’mannst zwee grouss Buschtawe' // luxembourgish
};

C_XL.d['ch figures'] = { 
    0: 'at least two figures (0 to 9)', // english
    1: 'au minimum deux chiffres (0 à 9)', // french
    2: 'co najmniej dwie cyfry (0 do 9)', // polish
    3: 'minimaal twee cijfers (0 t/m 9)', // dutch
    4: 'mindestens zwei Ziffern (0 bis 9)', // german
    5: 'almeno due cifre (da 0 a 9)', // italian
    6: 'al menos dos cifras (0 a 9)', // spanish
    7: 'pelo menos dois algarismos (0 a 9)', // portuguese
    8: 'op d’mannst zwee Zifferen (0 bis 9)' // luxembourgish
};

C_XL.d['ch p duplicate'] = { 
    0: 'your login and password must be different', // english
    1: 'votre mot de passe doit différer de votre login', // french
    2: 'Twój login i hasło muszą się różnić', // polish
    3: 'uw login en wachtwoord moeten verschillend zijn', // dutch
    4: 'Ihr Login und Passwort müssen unterschiedlich sein', // german
    5: 'il tuo login e la tua password devono essere diversi', // italian
    6: 'su nombre de usuario y contraseña deben ser diferentes', // spanish
    7: 'seu login e senha devem ser diferentes', // portuguese
    8: 'Äre Login an Äert Passwuert mussen ënnerschiddlech sinn' // luxembourgish
};
						
	const ch_specialchars = '[] {} () ! / + - = € ? _ , . : ; @ $ % & *'; // this should stay aligned with (*cr11*), check the list of allowed characters	
C_XL.d['ch specials'] = { 
    0: 'at least two special characters chosen from ' + ch_specialchars + ' ', // english
    1: 'au minimum deux caractères spéciaux choisis dans ' + ch_specialchars + ' ', // french
    2: 'co najmniej dwa znaki specjalne wybrane spośród ' + ch_specialchars + ' ', // polish
    3: 'ten minste twee speciale tekens gekozen uit ' + ch_specialchars + ' ', // dutch
    4: 'mindestens zwei Sonderzeichen ausgewählt aus ' + ch_specialchars + ' ', // german
    5: 'almeno due caratteri speciali scelti tra ' + ch_specialchars + ' ', // italian
    6: 'al menos dos caracteres especiales elegidos entre ' + ch_specialchars + ' ', // spanish
    7: 'pelo menos dois caracteres especiais escolhidos entre ' + ch_specialchars + ' ', // portuguese
    8: 'op d’mannst zwee speziell Zeechen gewielt aus ' + ch_specialchars + ' ' // luxembourgish
};

C_XL.d['ch size'] = { 
    0: 'and must size between 9 and 32 characters', // english
    1: 'et doit mesurer entre 9 et 32 caractères', // french
    2: 'i musi mieć rozmiar od 9 do 32 znaków', // polish
    3: 'en moet tussen 9 en 32 tekens groot zijn', // dutch
    4: 'und muss zwischen 9 und 32 Zeichen lang sein', // german
    5: 'e deve avere una dimensione compresa tra 9 e 32 caratteri', // italian
    6: 'y debe tener un tamaño entre 9 y 32 caracteres', // spanish
    7: 'e deve ter entre 9 e 32 caracteres', // portuguese
    8: 'a Gréisst muss tëscht 9 an 32 Zeechen sinn' // luxembourgish
};

C_XL.d['ch l reserved'] = { 
    0: 'this login can not be used, it is reserved.', // english
    1: 'ce login ne peut pas être utilisé, il est réservé.', // french
    2: 'ten login nie może być używany, jest zastrzeżony.', // polish
    3: 'deze login kan niet worden gebruikt, deze is gereserveerd.', // dutch
    4: 'Dieser Login kann nicht verwendet werden, er ist reserviert.', // german
    5: 'questo login non può essere utilizzato, è riservato.', // italian
    6: 'Este inicio de sesión no se puede utilizar, está reservado.', // spanish
    7: 'este login não pode ser usado, ele está reservado.', // portuguese
    8: 'dësen Login ka net benotzt ginn, hien ass reservéiert.' // luxembourgish
};

C_XL.d['lock access'] = { 
    0: 'lock access', // english
    1: 'verrouiller l\'accès', // french
    2: 'zablokować dostęp', // polish
    3: 'toegang vergrendelen', // dutch
    4: 'Zugang sperren', // german
    5: 'bloccare l\'accesso', // italian
    6: 'bloquear el acceso', // spanish
    7: 'bloquear acesso', // portuguese
    8: 'den Zougang spären' // luxembourgish
};

C_XL.d['disable webpage'] = { 
    0: 'disable this webpage', // english
    1: 'désactiver cette page Web', // french
    2: 'wyłącz tę stronę internetową', // polish
    3: 'schakel deze webpagina uit', // dutch
    4: 'diese Webseite deaktivieren', // german
    5: 'disabilitare questa pagina web', // italian
    6: 'desactivar esta página web', // spanish
    7: 'desativar esta página da web', // portuguese
    8: 'dës Websäit desaktivéieren' // luxembourgish
};

C_XL.d['connect one user'] = { 
    0: 'log one more user in', // english
    1: 'connecter un utilisateur supplémentaire', // french
    2: 'zaloguj jeszcze jednego użytkownika', // polish
    3: 'log nog een gebruiker in', // dutch
    4: 'einen weiteren Benutzer einloggen', // german
    5: 'collega un altro utente', // italian
    6: 'iniciar sesión con un usuario más', // spanish
    7: 'conectar mais um usuário', // portuguese
    8: 'e weideren Benotzer umellen' // luxembourgish
};


					

// 		technical 			english:0,				french:1,				polish:2,				dutch:3,				german:4,				italian:5,					spanish:6,					portuguese:7, 	luxembourgish:8
C_XL.d['al-admin'] = { 0:'administrator', 1:'administrateur', 2:'administrator', 3:'Beheerder', 4:'administrator', 5:'amministratore', 6:'administrador', 7:'administrador', 8:'Administrator' };
C_XL.d['al-seller'] = { 0:'representative', 1:'Délégué', 2:'Przedstawiciel', 3:'afgevaardigd', 4:'Vetreter', 5:'Rappresentante', 6:'Delegado', 7:'Delegado', 8:'Representant' };
C_XL.d['al-manager'] = { 0:'Manager', 1:'responsable', 2:'Kierownik', 3:'Verantwoordelijk', 4:'Manager', 5:'responsabile', 6:'responsable', 7:'responsável', 8:'Manager' };
C_XL.d['al-supervisor'] = { 0:'Supervisor', 1:'Superviseur', 2:'Nadzorca', 3:'Opzichter', 4:'Betreuer', 5:'Supervisore', 6:'Supervisor', 7:'Supervisor', 8:'Superviseur' };
C_XL.d['al-operator'] = { 0:'Operator', 1:'Opérateur', 2:'Operator', 3:'operator', 4:'anwender', 5:'Operatore', 6:'Operador', 7:'Operador', 8:'Bedreiwer' };
C_XL.d['al-eresa'] = { 0:'Web-page', 1:'Page Web', 2:'Strona internetowa', 3:'Web-pagina', 4:'Webseite', 5:'Pagina web', 6:'Página web', 7:'Página web', 8:'Websäit' };
C_XL.d['al-synchro']={0:'Machines',1:'Machines',2:'Maszyny',3:'Machines',4:'Maschinen',5:'Macchine',6:'Máquinas',7:'Máquinas',8:'Maschinnen'};
C_XL.d['brand'] = { 0:'Brand', 1:'Marque', 2:'Marka', 3:'Merk', 4:'Marke', 5:'Marca', 6:'Marca', 7:'Marca', 8:'Mark' };
C_XL.d['program name'] = { 0:'Program name', 1:'application', 2:'Nazwa programu', 3:'Programmanaam', 4:'anwendung', 5:'applicazione', 6:'aplicación', 7:'aplicação', 8:'Programmnumm' };
C_XL.d['contact person'] = { 0:'Contact person', 1:'Personne de contact', 2:'Osoba kontaktowa', 3:'Contactpersoon', 4:'Kontaktperson', 5:'Persona di contattato', 6:'Persona de contacto', 7:'Pessoa de contacto', 8:'Kontaktpersoun' };


// 		technical 			english:0,					french:1,				polish:2,					dutch:3,					german:4,							italian:5,					spanish:6,					portuguese:7, 	luxembourgish:8

C_XL.d['access allowance'] = { 0:'access allowance', 1:'allocation d\'accès', 2:'Zasiłek dostęp', 3:'Toegang uitkering', 4:'Zugangsberechtigung', 5:'assegnazione d\accesso', 6:'asignación de acceso', 7:'Contribuição de acesso', 8:'Accès Erlaabnes' };
C_XL.d['accesses'] = { 0:'accesses', 1:'accès', 2:'Dostęp', 3:'Toegangen', 4:'Zugriffe', 5:'accesso', 6:'acceso', 7:'acesso', 8:'Zougäng' };
C_XL.d['access keys'] = { 0:'access keys', 1:'Clés d\'accès', 2:'Klawisze dostępu', 3:'Toegangssleutels', 4:'Zugriffsschlüsse', 5:'Chiave d\'accesso', 6:'Clave de acceso', 7:'Chave de acesso', 8:'Accès Schlësselen' };
C_XL.d['accounts'] = { 0:'accounts', 1:'Comptes', 2:'Rachunki', 3:'accounts', 4:'Konten', 5:'Conti', 6:'Cuentas', 7:'Contas', 8:'Konten' };
C_XL.d['logged in'] = { 0:'Logged in', 1:'Connecté', 2:'Zapisane', 3:'Ingelogd', 4:'Eingeloggt', 5:'Connesso', 6:'Vinculado', 7:'Ligado', 8:'Aangemellt' };
C_XL.d['akeys count'] = { 0:'Number of keys', 1:'Nombre de clés', 2:'Klawisze numeryczne', 3:'aantal sleutels', 4:'Schlüsselanzahl', 5:'Numero di chiavi', 6:'Número de claves', 7:'Número de chaves', 8:'Zuel vu Schlësselen' };
C_XL.d['akey related'] = { 0:'Key for this account', 1:'Clé pour ce compte', 2:'Kluczem do tego konta', 3:'Sleutel tot deze account', 4:'Schlüssel für dieses Konto', 5:'Chiave per questo conto', 6:'Clave para esta cuenta', 7:'Chave para esta conta', 8:'Schlëssel fir dëse Kont' };
C_XL.d['account id'] = { 0:'account id', 1:'Numéro de compte', 2:'Numer konta', 3:'account nummer', 4:'Kontonummer', 5:'Numero di conto', 6:'Número de cuenta', 7:'Número da conta', 8:'Kontonummer' };
C_XL.d['synchro'] = { 0:'Synchronization', 1:'Synchronisation', 2:'Synchronizacja', 3:'Synchronisatie', 4:'Synchronisation', 5:'Sincronizzazione', 6:'Sincronización', 7:'Sincronização', 8:'Synchronisatioun' };
C_XL.d['correlators'] = { 0:'Correlators', 1:'Correlators', 2:'correlators', 3:'Correlators', 4:'Korrelatoren', 5:'Correlatori', 6:'Correladores', 7:'Correlatos', 8:'Korrelatoren' };
C_XL.d['initialization'] = { 0:'Initialization', 1:'Initialisation', 2:'Inicjalizacji', 3:'Initialisatie', 4:'Initialisierung', 5:'Inizializzazione', 6:'Inicialización', 7:'Inicialização', 8:'Initialiséierung' };
C_XL.d['updates'] = { 0:'Updates', 1:'actualisation', 2:'aktualizacje', 3:'Updates', 4:'Updates', 5:'attualizzazione', 6:'actualización', 7:'atualização', 8:'Updates' };
C_XL.d['backup'] = { 0:'Backup', 1:'Sauvegarde', 2:'Backup', 3:'Backup', 4:'Backup', 5:'Backup', 6:'Backup', 7:'Backup', 8:'Backup' };
C_XL.d['restore'] = { 0:'restore', 1:'restauration', 2:'restore', 3:'restore', 4:'Wiederherstellen', 5:'Ripristinare', 6:'restablecer', 7:'restauração', 8:'Restauréieren' };
C_XL.d['maintenance'] = { 0:'Maintenance', 1:'Maintenance', 2:'Konserwacja', 3:'Onderhoud', 4:'Wartung', 5:'Mantenimento', 6:'Mantenimiento', 7:'Manutenção', 8:'Ënnerhalt' };
C_XL.d['utilities'] = { 0:'Utilities', 1:'Outils', 2:'Przybory', 3:'Gereedschap', 4:'Werkzeuge', 5:'attrezzature', 6:'Herramientas', 7:'Ferramentas', 8:'Utilitéiten' };

C_XL.d['ack visitors'] = { 0:'acknowledge visitors', 1:'Validation visiteurs', 2:'acknowledge visitors', 3:'Validatie bezoekers', 4:'Besucher bestätigen', 5:'Convalida visitatore', 6:'Validación visitante', 7:'Validação de visitantes', 8:'Visiteuren unerkennen' };
C_XL.d['ack resa'] = { 0:'acknowledge reservs', 1:'Validation RDVs', 2:'acknowledge reservs', 3:'Validatie reservaties', 4:'Termmine bestätigen', 5:'Convalida appuntamenti', 6:'Validación citas', 7:'Validação de compromissos', 8:'Reservatiounen unerkennen' };

C_XL.d['permissions'] = { 0:'Permissions', 1:'Permissions', 2:'Uprawnienia', 3:'Toestemmingen', 4:'Zulassungen', 5:'Permessi', 6:'Permisos', 7:'Permissões', 8:'Permissiounen' };


			// usage
C_XL.d['reg usage'] = { 0:'regular usage', 1:'Utilisation régulière', 2:'regularne korzystanie z', 3:'regelmatig gebruik', 4:'regelmäßige Nutzung', 5:'Uso regolare', 6:'Uso regular', 7:'Uso regular', 8:'Regelméisseg Notzung' };
C_XL.d['cr_resas'] = { 0:'create reservations', 1:'créer des réservations', 2:'tworzenie rezerwacji', 3:'reserveringen maken', 4:'reservierungen erstellen', 5:'creare prenotazioni', 6:'crear reservas', 7:'criar reservas', 8:'Reservatioune erstellen' };
C_XL.d['cr_tasks'] = { 0:'create tasks', 1:'créer des tâches', 2:'tworzenie miejsc pracy', 3:'taken maken', 4:'aufgaben erstellen', 5:'creare attività', 6:'crear tareas', 7:'criar tarefas', 8:'Aufgaben erstellen' };
C_XL.d['cr_notes'] = { 0:'create notes', 1:'créer des notes', 2:'sporządzanie notatek', 3:'Notas maken', 4:'Notizen erstellen', 5:'creare note', 6:'crear notas', 7:'criar notas', 8:'Notizen erstellen' };
C_XL.d['cr_chats'] = { 0:'create chats', 1:'créer des chats', 2:'czaty zrobić', 3:'chats maken', 4:'Chats erstellen', 5:'creare chats', 6:'crear chats', 7:'criar chats', 8:'Chats erstellen' };
C_XL.d['ac_disprefs'] = { 0:'access to display details', 1:'accéder aux détails d\'affichage', 2:'dostęp do wyświetlania szczegółów', 3:'toegang naar display voorkeuren', 4:'Zugriff auf display Details anzeigen', 5:'accede ai dettagli di visualizzazione', 6:'accede a los detalles de la pantalla', 7:'acesso para exibir detalhes', 8:'Zougang zu Afficherdetailer' };
C_XL.d['ac_stats'] = { 0:'see statistics', 1:'voir les statistiques', 2:'dostęp do statystyk', 3:'toegang naar statistieken', 4:'Statistiken ansehen', 5:'consultare le statistiche', 6:'ver las estadísticas', 7:'ver as estatísticas', 8:'Statistike kucken' };
C_XL.d['ac_visis'] = { 0:'see visitors register', 1:'voir le registre visitors', 2:'dostęp do rejestru visitors', 3:'toegang naar visitors register', 4:'visitors Verzeichnis ansehen', 5:'consultare il registro visitors', 6:'ver el registro de visitors', 7:'ver o registo visitors', 8:'Visiteurregister kucken' };
C_XL.d['ac_archv'] = { 0:'access to notes and tasks', 1:'accéder aux notes et tâches', 2:'uzyskuje dostęp do notatek i zadań', 3:'toegang tot notities en taken', 4:'Zugriff auf Notizen und Aufgaben', 5:'accede a note e attività', 6:'accede a notas y tareas', 7:'acessa notas e tarefas', 8:'Zougang zu Notizen an Aufgaben' };
C_XL.d['ac_sfind'] = { 0:'access to search and find', 1:'accéder à filtrer et trouver', 2:'dostęp do filtrowania i znajdowania', 3:'toegang tot filteren en zoeken', 4:'Zugang zum Filtern und Finden', 5:'accedere al filtro e trovare', 6:'acceso para filtrar y encontrar', 7:'acesso para filtrar e encontrar', 8:'Zougang fir ze sichen an ze fannen' };
C_XL.d['ac_setup'] = { 0:'access setup & preferences', 1:'accéder aux réglages & préférences', 2:'dostęp do ustawień i preferencji', 3:'toegang naar setup & voorkeuren', 4:'Zugriff auf Einstellungen und Präferenzen', 5:'accede alle configurazioni e preferenze', 6:'accede a las configuraciones y preferencias', 7:'acede às configurações e preferências', 8:'Zougang zu Astellungen a Preferenzen' };
C_XL.d['ch_hourly'] = { 0:'change availabilities', 1:'changer l\'horaire', 2:'dostosować harmonogram', 3:'uurrooster aanpassen', 4:'Zeitplan anpassen', 5:'cambiare l\'orario', 6:'cambiar el horario', 7:'alterar o horário', 8:'Stonnendéngscht änneren' };
C_XL.d['ch_calendar'] = { 0:'change calendar', 1:'changer le calendrier', 2:'dostosowywanie kalendarza', 3:'kalender aanpassen', 4:'Kalender anpassen', 5:'cambiare il calendario', 6:'cambiar el calendario', 7:'alterar o calendário', 8:'Kalenner änneren' };
C_XL.d['op_resas'] = { 0:'open reservations', 1:'ouvrir des réservations', 2:'otwarte rezerwacje', 3:'reserveringen open doen', 4:'offene reservierungen', 5:'prenotazioni aperte', 6:'reservas abiertas', 7:'reservas abertas', 8:'Reservatioune opmaachen' };

// setup login permissions
C_XL.d['setup'] = { 0:'Setup & preferences', 1:'Réglage & préférences', 2:'Ustawienia i preferencje', 3:'Setup & voorkeuren', 4:'Einstellungen und Präferenzen', 5:'Configurazione & preferenze', 6:'Configuración y preferencias', 7:'Configuração e Preferências', 8:'Setup & Preferenzen' };
C_XL.d['cr_bcals'] = { 0:'create main resources', 1:'créer des resources principales', 2:'stworzyć podstawowe zasoby', 3:'basis middelen creëren', 4:'Hauptressourcen erstellen', 5:'creare risorse principali', 6:'crear recursos principales', 7:'criar recursos principais', 8:'Haaptressourcen erstellen' };
C_XL.d['cr_ucals'] = { 0:'create mandatory resources', 1:'créer des resources obligatoires', 2:'tworzenia obowiązkowych zasobów', 3:'verplichte middelen creëren', 4:'Pflichtressourcen erstellen', 5:'creare risorse obbligatorie', 6:'crear recursos obligatorios', 7:'criar recursos obrigatórios', 8:'Obligatoresch Ressourcen erstellen' };
C_XL.d['cr_fcals'] = { 0:'create faculative resources', 1:'créer des resources facultatives', 2:'stworzyć faculative zasoby', 3:'facultative middelen creëren', 4:'Optionale ressourcen erstellen', 5:'creare risorse facoltative', 6:'crear recursos facultativos', 7:'criar recursos opcionais', 8:'Fakultativ Ressourcen erstellen' };
C_XL.d['cr_logins'] = { 0:'create logins', 1:'créer des accès', 2:'tworzenie loginów', 3:'logins creëren', 4:'Nutzerkonten erstellen', 5:'creare accessi', 6:'crear accesos', 7:'criar acesso', 8:'Logins erstellen' };
C_XL.d['ch_logins'] = { 0:'change logins', 1:'changer des accès', 2:'zmiany loginów', 3:'logins aanpassen', 4:'Nutzerkonten anpassen', 5:'modificare accessi', 6:'modificar accesos', 7:'alterar acesso', 8:'Logins änneren' };
C_XL.d['cr_comm'] = { 0:'create communication templates', 1:'créer des communications pré-formatées', 2:'tworzyć komunikację', 3:'communicatie patronen creëren', 4:'Kommunikationsvorlagen erstellen', 5:'creare comunicazioni predefinite', 6:'crear comunicaciones predefinidas', 7:'criar comunicações pré-formatadas', 8:'Kommunikatiounsvirlagen erstellen' };
C_XL.d['cr_ccss'] = { 0:'create custom colors & status', 1:'créer statuts et couleurs', 2:'tworzyć własne kolory', 3:'kleuren en status maken', 4:'Benutzerdefinierte Farben & Status erstellen', 5:'creare statuti e colori', 6:'crear estados y colores', 7:'criar estados e cores', 8:'Personaliséiert Faarwen a Status erstellen' };
C_XL.d['cr_wrkc'] = { 0:'create performances', 1:'créer des prestations', 2:'producent wydajność', 3:'prestaties maken', 4:'Leistungen erstellen', 5:'creare prestazioni', 6:'crear reservas', 7:'criar prestações', 8:'Leeschtunge erstellen' };
C_XL.d['ch_comm'] = { 0:'change communication templates', 1:'changer la communication pré-formatée', 2:'dopasowywanie wzorców komunikacji', 3:'communicatie patronen aanpassen', 4:'Kommunikationsvorlagen anpassen', 5:'modificare la comunicazione predefinita', 6:'modificar la comunicación predefinida', 7:'alterar a comunicação pré-formatada', 8:'Kommunikatiounsvirlagen änneren' };
C_XL.d['ch_wrkc'] = { 0:'change performances', 1:'changer les prestations', 2:'dostosuj wydajność', 3:'prestaties aanpassen', 4:'Leistungen anpassen', 5:'modificare le prestazioni', 6:'modificar los servicios', 7:'alterar as prestações', 8:'Leeschtunge änneren' };
C_XL.d['ch_ccss'] = { 0:'change custom colors & status', 1:'changer les statuts et couleurs', 2:'wyregulować kolor i stan', 3:'kleuren en status aanpassen', 4:'Farben & Status anpassen', 5:'modificare gli statuti e colori', 6:'modificar los estados y colores', 7:'alterar os estatutos e as cores', 8:'Personaliséiert Faarwen a Status änneren' };

C_XL.d['sees_pairs'] = { 
    0: 'can see pair logins',          // English
    1: 'voit les logins du même niveau', // French
    2: 'widzi loginy na tym samym poziomie',  // Polish
    3: 'kan logins van hetzelfde niveau zien', // Dutch
    4: 'kann Logins auf derselben Ebene sehen', // German
    5: 'può vedere i login dello stesso livello', // Italian
    6: 'puede ver los inicios de sesión del mismo nivel', // Spanish
    7: 'pode ver os logins do mesmo nível', // Portuguese
    8: 'kann Loginen um selwechten Niveau gesinn' // Luxembourgish
};

C_XL.d['sees_invcs'] = { 
    0: 'can consult invoices',      // English
    1: 'peut consulter les factures',  // French
    2: 'może przeglądać faktury',  // Polish
    3: 'kan facturen raadplegen',  // Dutch
    4: 'kann Rechnungen einsehen',  // German
    5: 'può consultare le fatture', // Italian
    6: 'puede consultar facturas',  // Spanish
    7: 'pode consultar faturas',   // Portuguese
    8: 'kann Rechnungen nokucken'  // Luxembourgish
};


C_XL.d['is a decision maker'] = { 
    0: 'is a decision maker',     // English
    1: 'est un décisionnaire',     // French
    2: 'jest decydentem',          // Polish
    3: 'is een beslisser',         // Dutch
    4: 'ist ein Entscheidungsträger', // German
    5: 'è un decisore',            // Italian
    6: 'es un tomador de decisiones', // Spanish
    7: 'é um tomador de decisão',  // Portuguese
    8: 'ass en Entscheeder'        // Luxembourgish
};

C_XL.d['has AI assistant enabled'] = { 
    0: 'has AI assistant enabled',                // English
    1: 'peut utiliser l\'assistant AI',             // French
    2: 'może korzystać z asystenta AI',             // Polish
    3: 'kan de AI-assistent gebruiken',             // Dutch
    4: 'kann den KI-Assistent nutzen',              // German
    5: 'può usare l\'assistente AI',                // Italian
    6: 'puede usar el asistente de IA',             // Spanish
    7: 'pode usar o assistente de IA',              // Portuguese
    8: 'kann den AI-Assistent benotzen'             // Luxembourgish
};



// preferences workcodes
C_XL.d['timeboxings'] = { 0:'timeboxings', 1:'blocs horaires', 2:'bloki czasowe', 3:'tijdsblokken', 4:'Zeitblöcke', 5:'blocchi orari', 6:'bloques de tiempo', 7:'blocos de tempo', 8:'Zäitsblocker' };
C_XL.d['timeboxing'] = { 0: 'timeboxing', 1: 'bloc horaire', 2: 'blok czasowy', 3: 'tijdsblok', 4: 'Zeitblock', 5: 'blocco orario', 6: 'bloque de tiempo', 7: 'bloco de tempo', 8: 'Zäitsblock' };
C_XL.d['workcode'] = { 0:'performance', 1:'prestation', 2:'świadczenie', 3:'prestatie', 4:'leistung', 5:'prestazione', 6:'servicio', 7:'prestação', 8:'Leeschtung' };
C_XL.d['product'] = { 0:'product', 1:'produit', 2:'produkt', 3:'product', 4:'Produkt', 5:'prodotto', 6:'producto', 7:'produto', 8:'Produkt' };
C_XL.d['euros'] = { 0:'€', 1:'€', 2:'€', 3:'€', 4:'€', 5:'€', 6:'€', 7:'€', 8:'€' };
C_XL.d['code'] = { 0:'Code', 1:'Code', 2:'Kod', 3:'Code', 4:'Code', 5:'Codice', 6:'Código', 7:'Código', 8:'Code' };
C_XL.d['price'] = { 0:'Price €', 1:'Prix €', 2:'Cena €', 3:'Prijs €', 4:'Preis €', 5:'Prezzo €', 6:'Precio €', 7:'Preço €', 8:'Präis €' };

C_XL.d['performance'] = { 0:'performance', 1:'prestation', 2:'świadczenie', 3:'prestatie', 4:'leistung', 5:'prestazione', 6:'servicio', 7:'prestação', 8:'Leeschtung' };
C_XL.d['performances'] = { 0:'performances', 1:'prestations', 2:'świadczenia', 3:'prestaties', 4:'leistungen', 5:'prestazioni', 6:'servicios', 7:'prestações', 8:'Leeschtungen' };

C_XL.d['good'] = { 
    0: 'item',          // english
    1: 'article',       // french
    2: 'towar',         // polish
    3: 'artikel',       // dutch
    4: 'Artikel',       // german
    5: 'articolo',      // italian
    6: 'artículo',      // spanish
    7: 'artigo',        // portuguese
    8: 'Artikel'        // luxembourgish
};

C_XL.d['goods'] = { 
    0: 'items',         // english
    1: 'articles',      // french
    2: 'towary',        // polish
    3: 'artikelen',     // dutch
    4: 'Artikel',       // german
    5: 'articoli',      // italian
    6: 'artículos',     // spanish
    7: 'artigos',       // portuguese
    8: 'Artikelen'      // luxembourgish
};


C_XL.d['product name'] = { 0:'product name', // english
	1:'nom du produit', // french
	2:'nazwa produktu', // polish
	3:'productnaam', // dutch
	4:'Produktname', // german
	5:'nome del prodotto', // italian
	6:'nombre del producto', // spanish
	7:'nome do produto', // portuguese
	8:'Produktnumm' // luxembourgish
};

C_XL.d['stocktakings']	= { 0:'stocktakings',	// english
					1:'inventaires',	// french
					2:'inwentaryzacje',	// polish
					3:'inventarisaties',	// dutch
					4:'Inventuren',	// german
					5:'inventari',	// italian
					6:'inventarios', 	// spanish
					7:'inventários',	// portuguese
					8:'Inventaren'	// luxembourgish
			};
			
C_XL.d['stocktaking']	= { 0:'stocktaking',	// english
					1:'inventaire',	// french
					2:'inwentaryzacja',	// polish
					3:'inventarisatie',	// dutch
					4:'Inventur',	// german
					5:'inventario',	// italian
					6:'inventario', 	// spanish
					7:'inventário',	// portuguese
					8:'Inventar'	// luxembourgish
			};
			
C_XL.d['sttk numberof']	= { 0:'number of items',	// english
					1:'nombre d\'articles',	// french
					2:'liczba przedmiotów',	// polish
					3:'aantal artikelen',	// dutch
					4:'Anzahl der Artikel',	// german
					5:'numero di articoli',	// italian
					6:'número de artículos', 	// spanish
					7:'número de artigos',	// portuguese
					8:'Unzuel vun de Artikelen'	// luxembourgish
			};
			
C_XL.d['sttk more']	= { 0:'add',	// english
					1:'ajouter',	// french
					2:'dodaj',	// polish
					3:'toevoegen',	// dutch
					4:'hinzufügen',	// german
					5:'aggiungi',	// italian
					6:'añadir', 	// spanish
					7:'adicionar',	// portuguese
					8:'dobäisetzen'	// luxembourgish
			};

C_XL.d['sttk less']	= { 0:'remove',	// english
					1:'enlever',	// french
					2:'usuń',	// polish
					3:'verwijderen',	// dutch
					4:'entfernen',	// german
					5:'rimuovi',	// italian
					6:'quitar', 	// spanish
					7:'remover',	// portuguese
					8:'ewechhuelen'	// luxembourgish
			};
			
C_XL.d['sttck_numberof'] = {
    0: 'Have you just finished counting these items in your stock? Please enter the new total here.',  // English
    1: 'Vous venez de terminer un comptage de ces articles dans votre stock? Indiquer ici le nouveau total.',  // French
    2: 'Czy właśnie zakończyłeś liczenie tych artykułów w swoim magazynie? Wprowadź tutaj nową sumę.',  // Polish
    3: 'Heb je net deze artikelen in je voorraad geteld? Voer hier het nieuwe totaal in.',  // Dutch
    4: 'Haben Sie gerade diese Artikel in Ihrem Bestand gezählt? Bitte geben Sie hier die neue Gesamtsumme ein.',  // German
    5: 'Hai appena terminato il conteggio di questi articoli nel tuo magazzino? Inserisci qui il nuovo totale.',  // Italian
    6: '¿Acabas de terminar de contar estos artículos en tu inventario? Ingresa aquí el nuevo total.',  // Spanish
    7: 'Você acabou de terminar de contar estes itens no seu estoque? Insira aqui o novo total.',  // Portuguese
    8: 'Hutt Dir grad dës Artikelen an Ärem Lager gezielt? Gitt w.e.g. den neie Gesamtzuel un.'  // Luxembourgish
};

C_XL.d['sttck_moreorless'] = {
    0: 'Have you just received a delivery? Please enter the quantity here and add it to your stock.',  // English
    1: 'Vous venez de recevoir une livraison? Indiquer ici la quantité et ajouter là à votre stock.',  // French
    2: 'Czy właśnie otrzymałeś dostawę? Wprowadź tutaj ilość i dodaj ją do swojego magazynu.',  // Polish
    3: 'Heb je zojuist een levering ontvangen? Voer hier de hoeveelheid in en voeg deze toe aan je voorraad.',  // Dutch
    4: 'Haben Sie gerade eine Lieferung erhalten? Bitte geben Sie hier die Menge ein und fügen Sie sie Ihrem Bestand hinzu.',  // German
    5: 'Hai appena ricevuto una consegna? Inserisci qui la quantità e aggiungila al tuo magazzino.',  // Italian
    6: '¿Acabas de recibir una entrega? Ingresa aquí la cantidad y añádela a tu inventario.',  // Spanish
    7: 'Você acabou de receber uma entrega? Insira aqui a quantidade e adicione-a ao seu estoque.',  // Portuguese
    8: 'Hutt Dir grad eng Liwwerung kritt? Gitt w.e.g. d\'Quantitéit an a füügt se zu Ärem Lager bäi.'  // Luxembourgish
};

			
C_XL.d['e-reservable'] = { 0:'e-reservable', 1:'e-reservable', 2:'e-reservable', 3:'e-reservable', 4:'e-reservierbar', 5:'e-Prenotabile', 6:'e-reservable', 7:'e-reserva', 8:'e-Reservéierbar' };
C_XL.d['new workcode'] = { 0:'New performance', 1:'Nouvelle prestation', 2:'Nowa wydajność', 3:'Nieuwe prestatie', 4:'Neue Leistung', 5:'Nuova prestazione', 6:'Nuevo servicio', 7:'Nova prestação', 8:'Nei Leeschtung' };
C_XL.d['e-reservables'] = { 0:'online reservables', 1:'réservables en ligne', 2:'można zarezerwować online', 3:'online te boeken', 4:'online buchbar', 5:'prenotabile online', 6:'reservable en línea', 7:'reservável on-line', 8:'Online Reservéierbar' };
C_XL.d['other performances'] = { 0:'other performances', 1:'autres prestations', 2:'świadczenia', 3:'andere diensten', 4:'Sonstige Dienstleistungen', 5:'altri servizi', 6:'otros servicios', 7:'outros serviços', 8:'Aner Leeschtungen' };

C_XL.d['other products'] = { 
    0: 'other products',             // english
    1: 'autres produits',            // french
    2: 'inne produkty',              // polish
    3: 'andere producten',           // dutch
    4: 'andere Produkte',            // german
    5: 'altri prodotti',             // italian
    6: 'otros productos',            // spanish
    7: 'outros produtos',            // portuguese
    8: 'aner Produkter'              // luxembourgish
};

C_XL.d['new product'] = { 
    0: 'new product',             // english
    1: 'nouveau produit',         // french
    2: 'nowy produkt',            // polish
    3: 'nieuw product',           // dutch
    4: 'neues Produkt',           // german
    5: 'nuovo prodotto',          // italian
    6: 'nuevo producto',          // spanish
    7: 'novo produto',            // portuguese
    8: 'neit Produkt'             // luxembourgish
};


									
C_XL.d['blueprint wk tags'] = { 
	0:'in appointments where this performance is applied, the tags selected here will be automatically activated.',	
	1:'dans les rendez-vous où cette prestation est appliquée, les tags sélectionnés ici seront automatiquement activés.',			
	2:'w przypadku spotkań, w których stosowana jest ta usługa, wybrane tutaj tagi zostaną automatycznie aktywowane.',		
	3:'bij afspraken waarbij deze prestatie wordt toegepast, worden de hier geselecteerde tags automatisch geactiveerd.',
	4:'Bei Terminen, bei denen dieser Dienst angewendet wird, werden die hier ausgewählten Tags automatisch aktiviert.',
	5:'negli appuntamenti in cui è applicato questo servizio i tag qui selezionati verranno automaticamente attivati.',	
	6:'en las citas donde se aplica este servicio, las etiquetas aquí seleccionadas se activarán automáticamente.', 
	7:'nos agendamentos onde este serviço for aplicado, as tags aqui selecionadas serão ativadas automaticamente.',
	8:'Bei Rendez-vous, wou dës Leeschtung applizéiert gëtt, ginn d\'hei ausgewielte Tags automatesch aktivéiert.'
};

C_XL.d['blueprint wk ccss'] = { 
	0:'choice(s) made here will be reproduced in appointments where this performance is applied.',	
	1:'le(s) choix indiqués ici seront reproduit(s) dans le rendez-vous où cette prestation est appliquée.',			
	2:'wskazane tutaj wybory zostaną odtworzone podczas spotkania, podczas którego będzie stosowana ta usługa.',		
	3:'de hier aangegeven keuze(s) wordt(en) weergegeven in de afspraak waarbij deze prestatie wordt toegepast.',
	4:'Die hier angegebene(n) Auswahl(en) wird(n) bei dem Termin, bei dem dieser Service in Anspruch genommen wird, reproduziert.',
	5:'le scelte qui indicate verranno riprodotte nell\'appuntamento in cui viene applicato questo servizio.',	
	6:'la(s) elección(es) aquí indicada(s) se reproducirán en la cita donde se aplique este servicio.', 
	7:'a(s) escolha(s) aqui indicada(s) serão reproduzidas no agendamento onde este serviço for aplicado.',
	8:'D\'Wiel(en), déi hei gemaach gëtt, gëtt bei Rendez-vous reproduzéiert, wou dës Leeschtung applizéiert gëtt.'
};


C_XL.d['blueprint prd tags'] = { 0:'tags selected here will appear on the right side of the product name.',	// english
	1:'les tags sélectionnés ici apparaîtront à la droite du nom du produit.',	// french
	2:'Tagi wybrane tutaj pojawią się po prawej stronie nazwy produktu.',	// polish
	3:'De hier geselecteerde tags verschijnen aan de rechterzijde van de productnaam.',	// dutch
	4:'Die hier ausgewählten Tags erscheinen rechts neben dem Produktnamen.',	// german
	5:'I tag selezionati qui appariranno a destra del nome del prodotto.',	// italian
	6:'Las etiquetas seleccionadas aquí aparecerán a la derecha del nombre del producto.',	// spanish
	7:'As tags selecionadas aqui aparecerão à direita do nome do produto.',	// portuguese
	8:'Déi hei ausgewielten Tags erscheinen op der réchter Säit vum Produktnumm.'	// luxembourgish
};



// secretary guidelines
C_XL.d['no guideline'] = { 0:'does not use guidelines', 1:'n’utilise pas de directives', 2:'nie używa wytycznych', 3:'gebruikt geen richtlijnen', 4:'verwendet keine Richtlinien', 5:'non utilizza linee guida', 6:'no utiliza directrices', 7:'não utiliza diretrizes', 8:'benotzt keng Richtlinnen' };

C_XL.d['guidelines'] = { 0:'Guidelines', 1:'Directives', 2:'Wytyczne', 3:'Richtlijnen', 4:'Richtlinie', 5:'Direttive', 6:'Directivas', 7:'Diretivas', 8:'Direktiven' };
C_XL.d['directions'] = { 0:'Directions', 1:'Itinéraire', 2:'Kierunki', 3:'Richtingen', 4:'anweisungen', 5:'Itinerario', 6:'Itinerario', 7:'Itinerário', 8:'Uweisungen' };
C_XL.d['new guidelines'] = { 0:'New guidelines', 1:'Nouvelles directives', 2:'Nowe wytyczne', 3:'Nieuwe richtlijnen', 4:'Neue Richtlinien', 5:'Nuove direttive', 6:'Nuevas directivas', 7:'Novas diretivas', 8:'Nei Direktiven' };
C_XL.d['gdl requests'] = { 0:'requests', 1:'Demandes', 2:'Wnioski', 3:'Verzoeken', 4:'anfragen', 5:'Richiesta', 6:'Pedidos', 7:'Pedidos', 8:'Ufroën' };
C_XL.d['gdl never'] = { 0:'Don\'t', 1:'Jamais', 2:'Nie rób', 3:'Niet doen', 4:'Nie', 5:'Mai', 6:'Nunca', 7:'Nunca', 8:'Niemols' };
C_XL.d['gdl tips'] = { 0:'Tips & tricks', 1:'Conseils', 2:'Rada', 3:'Tipps & tricks', 4:'Tips & Tricks', 5:'Consigli', 6:'Consejos', 7:'Conselhos', 8:'Tippen & Tricks' };

C_XL.d['gdlns 4 new visitors'] = { 
	0:'Guidelines when new visitor', 
	1:'Directives en cas de nouveau visitor', 
	2:'Wytyczne, gdy nowy visitor', 
	3:'Richtlijnen indien nieuwe visitor', 
	4:'anweisungen bei neuen visitor', 
	5:'Direttive in caso di nuovo visitor', 
	6:'Directivas en caso de nuevo visitor', 
	7:'Diretivas no caso de novo visitor', 
	8:'Direktiven fir nei visitor' 
};
C_XL.d['gdlns 4 appointment'] = { 
	0:'Guidelines when appointing', 
	1:'Directives pour la prise de RDV', 
	2:'Wytyczne do umawiania spotkań', 
	3:'Richtlijnen voor het maken van afspraken', 
	4:'anweisungen für die Terminaufnahme', 
	5:'Direttive per prendere un appuntamento', 
	6:'Directivas para tomar una cita', 
	7:'Diretivas para marcar consulta', 
	8:'Direktiven fir Rendez-vous opzemaachen' 
};
C_XL.d['gdlns 4 requests'] = { 
	0:'Guidelines for requests', 
	1:'Directives pour les demandes spéciales', 
	2:'Wytyczne do prośby', 
	3:'Richtlijnen voor speciale verzoeken', 
	4:'anweisungen für neue Anfragen', 
	5:'Direttive per le richieste speciali', 
	6:'Directivas para pedidos especiales', 
	7:'Diretivas para pedidos especiais', 
	8:'Direktiven fir speziell Ufroen' 
};
C_XL.d['gdlns 4 dont'] = { 
	0:'Never do or say', 
	1:'Ne jamais faire ou dire', 
	2:'Nigdy nie powiedzieć lub zrobić', 
	3:'Nooit zeggen of doen', 
	4:'Niemals tun oder sagen', 
	5:'Non dire o fare mai', 
	6:'Nunca decir o hacer', 
	7:'Nunca fazer ou dizer', 
	8:'Niemols maachen oder soen' 
};
C_XL.d['gdlns 4 tips'] = { 
	0:'Tips and tricks', 
	1:'autres conseils', 
	2:'Inne wskazówki', 
	3:'andere tips & tricks', 
	4:'andere Tipps & Tricks', 
	5:'altri consigli', 
	6:'Otros consejos', 
	7:'Outras recomendações', 
	8:'Aner Tipps & Tricks' 
};

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

// e-payment
C_XL.d['{epay_iban}'] = { 0:'Beneficiary IBAN', 1:'IBAN bénéficiaire', 2:'beneficjenta IBAN', 3:'Begunstigden IBAN', 4:'Empfängerkonto IBAN', 5:'beneficiario IBAN', 6:'beneficiario IBAN', 7:'beneficiário IBAN', 8:'IBAN vum Beneficiaire' };
C_XL.d['{epay_beneficiary}'] = C_XL.d['qr beneficiary name'];
C_XL.d['{epay_billtotal}'] = C_XL.d['ep-charged']; // total amount to charge
C_XL.d['{epay_paid}'] = C_XL.d['ep-already paid']; // sum of existing payments on this transaction
C_XL.d['{epay_remains}'] = C_XL.d['ep-balance']; // remains to be paid
C_XL.d['{epay_SEPA_qr}'] = { 0:'SEPA QR-code', 1:'QR-code SEPA', 2:'kod QR SEPA', 3:'SEPA QR-code', 4:'SEPA-QR-Code', 5:'codice QR SEPA', 6:'código QR SEPA', 7:'código QR SEPA', 8:'SEPA QR-Code' }; // QR code

C_XL.d['{att_bcal}'] = { /* set by setContextLanguage() */ }; // !! No translation on this line
C_XL.d['{att_ucal}'] = { /* set by setContextLanguage() */ };
C_XL.d['{att_fcal}'] = { /* set by setContextLanguage() */ };
C_XL.d['{participants}'] = { /* set by setContextLanguage() */ };

C_XL.d['tmp_confirm'] = { 
	0:'{dear} {gender} {lname}, {business} confirms your new appointment on {day} {date} at {time}. Looking forward to welcome you, regards.', 
	1:'{dear} {gender} {lname}, {business} est heureux de vous confirmer votre RDV du {day} {date} à {time}. A bientôt!', 
	2:'Wiadomosc od {business}: Potwierdzamy wizyte. Data: {day} {date} o {time}. Do zobaczenia!',	
	3:'{dear} {gender} {lname}, {business} bevestigt u nieuwe afspraak op {day} {date} om {time}. Tot binnenkort, groeten.',
	4:'{dear} {gender} {lname}, {business} freut sich auf Ihren Besuch am {day} {date} um {time}. Bis bald!.', 
	5:'{dear} {gender} {lname}, {business} è lieto di confermarLe il Suo appuntamento il {day} {date} alle {time}. A presto!', 
	6:'{dear} {gender} {lname}, {business} está feliz de confirmarLe su cita el {day} {date} a las {time}. Hasta pronto!', 
	7:'{dear} {gender} {lname}, {business} tem o prazer de conformar o seu encontro em {day} {date} às {time}. Até breve!', 
	8:'{dear} {gender} {lname}, {business} confirméiert Äre Rendez-vous um {day} {date} um {time}. Mir freeën eis op Äre Besuch, mat beschte Gréiss.'
};

C_XL.d['tmp_eve'] = { 
	0:'{dear} {gender} {lname}, this msg is to remind your appointment tomorrow {day} {date} at {time}. Regards, {business}', 
	1:'{dear} {gender} {lname}, ce msg pour vous rappeler votre RDV de demain {day} {date} à {time}. Cordialement, {business}', 
	2:'Wiadomosc od {business}: Przypominamy o wizycie. Data: {day} {date} o {time}. Do zobaczenia!', 
	3:'{dear} {gender} {lname}, deze boodschap als herinnering van onze afspraak morgen {day} {date} om {time}. Groeten, {business}', 
	4:'{dear} {gender} {lname}, hiermit möchten wir Sie an Ihren Termin am {day} {date} um {time} erinnern. Beste Grüße, {business}', 
	5:'{dear} {gender} {lname}, questo msg è per ricordarLe il Suo appuntamento di domani {day} {date} alle {time}. Cordiali saluti, {business}', 
	6:'{dear} {gender} {lname}, este mensaje es para recordarle su cita de mañana {day} {date} a las {time}. Saludos cordiales, {business}', 
	7:'{dear} {gender} {lname}, esta mensagem tem o objetivo de lembrá-lo/a do seu encontro de amanhã {day} {date} às {time}. Cordialmente, {business}', 
	8:'{dear} {gender} {lname}, dëst ass eng Erënnerung un Äre Rendez-vous muer {day} {date} um {time}. Mat beschte Gréiss, {business}'
};

C_XL.d['tmp_oneweek'] = { 
	0:'{gender} {lname}, you have an appointment on {day} {date} at {time}. Would you be unavailable, please send back a sms. Regards, {business}', 
	1:'{gender} {lname}, vous avez RDV le {day} {date} à {time}. En cas d\'indisponibilité, répondez à ce sms. Cordialement, {business}', 
	2:'Wiadomosc od {business}: Przypominamy o wizycie. Data: {day} {date} o {time}. Odpowiedz na ta wiadomosc w razie zmiany planów.', 
	3:'{gender} {lname}, we hebben op {day} {date} om {time} afgesproken. Een onbeschikbaarheid?, stuur dan een sms terug. Groeten, {business}', 
	4:'{gender} {lname}, Sie haben am {day} {date} um {time} einen Termin. Bitte auf diese SMS antworten, falls Sie ihn nicht wahrnehmen können. MfG, {business}', 
	5:'{gender} {lname}, ha un appuntamento il {day} {date} alle {time}. In caso di non disponibilità, risponda a questo sms. Cordiali saluti, {business}', 
	6:'{gender} {lname}, tiene una cita el {day} {date} a las {time}. En caso de indisponibilidad, responda a este sms. Saludos cordiales, {business}', 
	7:'{gender} {lname}, você tem um encontro marcado a {day} {date} às {time}. Caso não se encontre disponível, responda a este SMS. Cordialmente, {business}', 
	8:'{gender} {lname}, Dir hutt e Rendez-vous den {day} {date} um {time}. Wann Dir net kënnt, äntwert w.e.g. op dës SMS. Mat beschte Gréiss, {business}'
};

// C_iARRAY catalysts
//
C_XL.d['export iArray'] = { 
	0:'Export this table', 
	1:'Exporter cette table', 
	2:'Należy wyeksportować tabelę', 
	3:'Exporteer deze tabel', 
	4:'Diese Tabelle exportieren', 
	5:'Esportare questa tabella', 
	6:'Exportar este tablero', 
	7:'Exportar este quadro', 
	8:'Dës Tabell exportéieren' 
};

// 		technical :		english:0,	french:1,	polish:2,	dutch:3,	german:4,	italian:5,	spanish:6,	portuguese:7,	luxembourgish:8


C_XL.d['actions-id'] = { 0:'login', 1:'login', 2:'login', 3:'login', 4:'login', 5:'login', 6:'login', 7:'Início de sessão', 8:'Login' };

C_XL.d['actions-resaNew'] = { 0:'New', 1:'Nouveaux', 2:'Nowy', 3:'Nieuwe', 4:'Neu', 5:'Nuovi', 6:'Nuevos', 7:'Novos', 8:'Nei' };
C_XL.d['actions-resaEdit'] = { 0:'Edited', 1:'Modifiés', 2:'Zmiana', 3:'Veranderd', 4:'Geändert', 5:'Modificati', 6:'Modificados', 7:'Modificados', 8:'Geännert' };
C_XL.d['actions-resaDel'] = { 0:'Deleted', 1:'Supprimés', 2:'Od', 3:'Verwijderd', 4:'Gelöscht', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };

C_XL.d['actions-appNew'] = { 0:'New', 1:'Nouveaux', 2:'Nowy', 3:'Nieuwe', 4:'Neu', 5:'Nuovi', 6:'Nuevos', 7:'Novos', 8:'Nei' };
C_XL.d['actions-appEdit'] = { 0:'Edited', 1:'Modifiés', 2:'Zmiana', 3:'Veranderd', 4:'Geändert', 5:'Modificati', 6:'Modificados', 7:'Modificados', 8:'Geännert' };
C_XL.d['actions-appDel'] = { 0:'Deleted', 1:'Supprimés', 2:'Od', 3:'Verwijderd', 4:'Gelöscht', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };

C_XL.d['actions-noteNew'] = { 0:'New', 1:'Nouveaux', 2:'Nowy', 3:'Nieuwe', 4:'Neu', 5:'Nuovi', 6:'Nuevos', 7:'Novos', 8:'Nei' };
C_XL.d['actions-noteEdit'] = { 0:'Edited', 1:'Modifiés', 2:'Zmiana', 3:'Veranderd', 4:'Geändert', 5:'Modificati', 6:'Modificados', 7:'Modificados', 8:'Geännert' };
C_XL.d['actions-noteDel'] = { 0:'Deleted', 1:'Supprimés', 2:'Od', 3:'Verwijderd', 4:'Gelöscht', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };

C_XL.d['actions-taskNew'] = { 0:'New', 1:'Nouveaux', 2:'Nowy', 3:'Nieuwe', 4:'Neu', 5:'Nuovi', 6:'Nuevos', 7:'Novos', 8:'Nei' };
C_XL.d['actions-taskEdit'] = { 0:'Edited', 1:'Modifiés', 2:'Zmiana', 3:'Veranderd', 4:'Geändert', 5:'Modificati', 6:'Modificados', 7:'Modificados', 8:'Geännert' };
C_XL.d['actions-taskDel'] = { 0:'Deleted', 1:'Supprimés', 2:'Od', 3:'Verwijderd', 4:'Gelöscht', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };
C_XL.d['actions-taskAssigned'] = { 0:'assigned', 1:'assignées', 2:'Przydzielony', 3:'Toegewezen', 4:'Zugewiesen', 5:'attribuite', 6:'asignadas', 7:'atribuídos', 8:'Zougewisen' };
C_XL.d['actions-taskAchieved'] = { 0:'achieved', 1:'accomplies', 2:'Osiągnięty', 3:'afgewerkt', 4:'ausgeführt', 5:'Concluse', 6:'Concluidas', 7:'Concluídos', 8:'Ofgeschloss' };

C_XL.d['actions-visiNew'] = { 0:'New', 1:'Nouveaux', 2:'Nowy', 3:'Nieuwe', 4:'Neu', 5:'Nuovi', 6:'Nuevos', 7:'Novos', 8:'Nei' };
C_XL.d['actions-visiEdit'] = { 0:'Edited', 1:'Modifiés', 2:'Zmiana', 3:'Veranderd', 4:'Geändert', 5:'Modificati', 6:'Modificados', 7:'Modificados', 8:'Geännert' };
C_XL.d['actions-visiMerge'] = { 0:'Deleted', 1:'Supprimés', 2:'Od', 3:'Verwijderd', 4:'Gelöscht', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };

C_XL.d['actuals-resourceId'] = { 0:'agenda', 1:'agenda', 2:'agenda', 3:'agenda', 4:'Kalender', 5:'agenda', 6:'Calendario', 7:'Calendário', 8:'Agenda' };
C_XL.d['actuals-offdayCount'] = { 0:'Off days', 1:'Congés', 2:'Dni wolne', 3:'Congés', 4:'freie Tage', 5:'Ferie', 6:'Vacaciones', 7:'Férias', 8:'Fräideeg' };
C_XL.d['actuals-resaCount'] = { 0:'Reservations', 1:'Réservations', 2:'Rezerwacje', 3:'Reserveringen', 4:'Reservierungen', 5:'Prenotazioni', 6:'Reservas', 7:'Reservas', 8:'Reservatioune' };
C_XL.d['actuals-appCount'] = { 0:'appointments', 1:'Rendez-vous', 2:'Powołanie', 3:'afspraken', 4:'Termine', 5:'appuntamento', 6:'Cita', 7:'Compromissos', 8:'Rendez-vous' };
C_XL.d['actuals-offdayTime'] = { 0:'durations', 1:'durées', 2:'czas trwania', 3:'duurtijden', 4:'Dauer', 5:'durate', 6:'duración', 7:'duração', 8:'Dauer' };
C_XL.d['actuals-resaTime'] = { 0:'elapsed', 1:'écoulés', 2:'który upłynął', 3:'verstreken', 4:'verstrichen', 5:'passati', 6:'pasados', 7:'passados', 8:'Vergaangen' };
C_XL.d['actuals-appTime'] = { 0:'elapsed', 1:'écoulés', 2:'który upłynął', 3:'verstreken', 4:'verstrichen', 5:'passati', 6:'pasados', 7:'passados', 8:'Vergaangen' };

C_XL.d['display in table'] = { 0:'Display in table', 1:'afficher dans le tableau', 2:'Pokazane w tabeli', 3:'Weergegeven in tabel', 4:'In der Tabelle anzeigen', 5:'Mostrare nella tabella', 6:'Mostrar en el tablero', 7:'Exibir no quadro', 8:'An der Tabell affichéieren' };

C_XL.d['visitor'] = { 0:'visitor', 1:'visitor', 2:'visitor', 3:'visitor', 4:'visitor', 5:'visitor', 6:'visitor', 7:'visitor', 8:'visitor' }; // !! No translation on this line
C_XL.d['visitors'] = { 0:'visitors', 1:'visitors', 2:'visitors', 3:'visitors', 4:'visitors', 5:'visitors', 6:'visitors', 7:'visitors', 8:'visitors' }; // !! No translation on this line see (*xl01*)


// 		technical 				english:0,				french:1,			polish:2,			dutch:3,			german:4,			italian:5,		spanish:6,			portuguese:7, 	luxembourgish:8
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


// M_FILE
C_XL.d['files-tip-ccss']	= { 
	0:'color, icon and pattern',	// english
	1:'couleur, icone et motif',	// french
	2:'kolor, ikona i wzór',		// polish
	3:'kleur, icoon en patroon',	// dutch
	4:'Farbe, Symbol und Muster',	// german
	5:'colore, icona e motivo',		// italian
	6:'color, icono y patrón', 		// spanish
	7:'cor, ícone e padrão',		// portuguese
	8:'Faarw, Ikon a Muster'		// luxembourgish
};

// C_backPREFS

C_XL.d['ccss_bp_visitor_color'] = {
  0: 'Define here colors for your visitors. They will appear in the visitor windows where you can apply them. Use them to identify categories of visitors. For example "black list, Chronophage, ...".', // english
  1: 'définissez ici des couleurs pour vos visitors. Elles apparaîtront dans les fenêtres de visitors où vous pourrez les appliquer. Utilisez-les pour identifier des catégories de visitors. Par exemple "black list, Chronophage, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich visitors. Będą one wyświetlane w oknach visitors, gdzie będziesz mógł je zastosować. Użyj ich, aby zidentyfikować kategorie visitors. Na przykład "black list, Chronophage, ...".', // polish
  3: 'Stel hier kleuren in voor uw visitors. Zij verschijnen in de visitor vensters waar u ze kunt toepassen. Gebruik ze om categorieën van visitors te identificeren. Bijvoorbeeld "black list, Chronophage, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre visitors. Diese erscheinen in den visitor Fenstern, in denen Sie sie anwenden können. Verwenden Sie sie, um Kategorien von visitors zu identifizieren. Zum Beispiel "black list, Chronophage, ...".', // german
  5: 'Definisci qui i colori per i tuoi visitors. Essi appariranno nelle finestre dei visitors, dove potrai applicarli. Usali per identificare categorie di visitors. Per esempio "black list, Chronophage, ...".', // italian
  6: 'Define aquí los colores para tus visitors. Aparecerán en las ventanas de visitors donde podrás aplicarlos. Úsalos para identificar categorías de visitors. Por ejemplo "black list, Chronophage, ...".', // spanish
  7: 'Defina aqui as cores para os seus visitors. Elas aparecerão nas janelas de visitors, onde poderá aplicá-las. Use-as para identificar categorias de visitors. Por exemplo "black list, Chronophage, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är visitors. Si wäerten an de visitor Fënsteren gewise, wou Dir se anwenden kënnt. Benotzt se fir Kategorien vun visitors ze identifizéieren. Zum Beispill "black list, Chronophage, ...".' // luxembourgish
};


C_XL.d['ccss_bp_visitor_pattern'] = {
  0: 'Define here patterns for your visitors. They overlay the color and allow you to identify a second category at a glance. For example: "new patient, online, no-show without notice, ...".', // english
  1: 'définissez ici des motifs pour vos visitors. Ils se superposent à la couleur et permettent d’identifier en un coup d’œil une seconde catégorie. Par exemple: "new patient, online, no-show without notice, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich visitors. Nakładają się na kolor i pozwalają w mgnieniu oka zidentyfikować drugą kategorię. Na przykład: "new patient, online, no-show without notice, ...".', // polish
  3: 'Stel hier patronen in voor uw visitors. Zij worden over de kleur heen gelegd en stellen u in staat om in één oogopslag een tweede categorie te identificeren. Bijvoorbeeld: "new patient, online, no-show without notice, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre visitors. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel: "new patient, online, no-show without notice, ...".', // german
  5: 'Definisci qui i modelli per i tuoi visitors. Essi si sovrappongono al colore e ti permettono di identificare in un colpo d’occhio una seconda categoria. Per esempio: "new patient, online, no-show without notice, ...".', // italian
  6: 'Define aquí patrones para tus visitors. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo: "new patient, online, no-show without notice, ...".', // spanish
  7: 'Defina aqui padrões para os seus visitors. Estes sobrepõem-se à cor e permitem identificar, com um só olhar, uma segunda categoria. Por exemplo: "new patient, online, no-show without notice, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är visitors. Si ginn iwwermuer vun der Faarf ugewise an erlaben Iech, eng zweet Kategorie op engem Bléck ze erkennen. Zum Beispill: "new patient, online, no-show without notice, ...".' // luxembourgish
};


C_XL.d['ccss_bp_visitor_tag'] = {
  0: 'Create tags here to identify specific characteristics of your visitors. Unlike color and pattern, which are exclusive, a visitor can receive multiple tags. For example: "PMR, addiction, allergies, creditor, etc.". <br/>Find the visitor tags on the [info] tab of the visitor record.', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos visitors. Contrairement à la couleur et au motif qui sont exclusifs, un visitor peut recevoir plusieurs tags. Par exemple: "PMR, addiction, allergies, creditor, etc.". <br/>Retrouvez les tags de visitor sur l’onglet [info] de la fiche de visitor.', // french
  2: 'Utwórz tagi, aby zidentyfikować specyficzne cechy Twoich visitors. W przeciwieństwie do koloru i wzoru, które są ekskluzywne, jeden visitor może otrzymać wiele tagów. Na przykład: "PMR, addiction, allergies, creditor, etc.". <br/>Znajdź tagi visitors na zakładce [info] rekordu visitor.', // polish
  3: 'Maak hier tags aan om specifieke kenmerken van uw visitors te identificeren. In tegenstelling tot kleur en patroon, die exclusief zijn, kan een visitor meerdere tags ontvangen. Bijvoorbeeld: "PMR, addiction, allergies, creditor, etc.". <br/>Vind de visitor tags op het tabblad [info] van de visitor fiche.', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer visitors zu identifizieren. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann ein visitor mehrere Tags erhalten. Zum Beispiel: "PMR, addiction, allergies, creditor, etc.". <br/>Finden Sie die visitor-Tags auf dem Reiter [info] des visitor-Datensatzes.', // german
  5: 'Crea qui dei tag per identificare le caratteristiche specifiche dei tuoi visitors. A differenza del colore e del motivo, che sono esclusivi, un visitor può ricevere più tag. Ad esempio: "PMR, addiction, allergies, creditor, etc.". <br/>Trova i tag dei visitors nella scheda [info] della scheda visitor.', // italian
  6: 'Crea aquí etiquetas para identificar características específicas de tus visitors. A diferencia del color y del patrón, que son exclusivos, un visitor puede recibir múltiples etiquetas. Por ejemplo: "PMR, addiction, allergies, creditor, etc.". <br/>Encuentra las etiquetas de visitor en la pestaña [info] del registro de visitor.', // spanish
  7: 'Crie tags aqui para identificar características específicas dos seus visitors. Ao contrário da cor e do padrão, que são exclusivos, um visitor pode receber várias tags. Por exemplo: "PMR, addiction, allergies, creditor, etc.". <br/>Encontre as tags de visitor na aba [info] do registro de visitor.', // portuguese
  8: 'Definéiert hei Tags fir d\'Spezifizitéiten vun Äre visitors ze identifizéieren. Am Géigesaz zu Faarf a Muster, déi exklusiv sinn, kann e visitor méi Tags kréien. Zum Beispill: "PMR, addiction, allergies, creditor, etc.". <br/>Fannt d\'Tags vun visitor op dem [info]-Tab vun der visitor-Fiche.', // luxembourgish
};


C_XL.d['delete confirm resource']	= { 
	0:'you are about to DELETE<br/>an ENTIRE AGENDA',	// english
	1:'vous êtes sur le point d\'EFFACER<br/>un AGENDA COMPLET',	// french
	2:'zamierzasz USUNĄĆ<br/>CAŁY KALENDARZ',	// polish
	3:'je staat op het punt te VERWIJDEREN<br/>een VOLLEDIGE AGENDA',	// dutch
	4:'Sie sind dabei zu LÖSCHEN<br/>einen KOMPLETTEN KALENDER',	// german
	5:'stai per CANCELLARE<br/>un INTERO CALENDARIO',	// italian
	6:'estás a punto de ELIMINAR<br/>una AGENDA COMPLETA', 	// spanish
	7:'está prestes a APAGAR<br/>uma AGENDA INTEIRA',	// portuguese
	8:'dir sidd dobäi ze LÄSCHEN<br/>en GANZEN AGENDÄR'	// luxembourgish
};

C_XL.d['delete confirm resource warning']	= { 
	0:'This operation is IRREVERSIBLE,<br/>please confirm the deletion',	// english
	1:'Cette opération est IRREVERSIBLE,<br/>SVP Confirmer l\'effacement',	// french
	2:'Ta operacja jest NIEODWRACALNA,<br/>proszę potwierdzić usunięcie',	// polish
	3:'Deze actie is ONOMKEERBAAR,<br/>gelieve de verwijdering te bevestigen',	// dutch
	4:'Dieser Vorgang ist UNUMKEHRBAR,<br/>bitte die Löschung bestätigen',	// german
	5:'Questa operazione è IRREVERSIBILE,<br/>si prega di confermare l\'eliminazione',	// italian
	6:'Esta operación es IRREVERSIBLE,<br/>por favor confirme la eliminación', 	// spanish
	7:'Esta operação é IRREVERSÍVEL,<br/>por favor confirme a eliminação',	// portuguese
	8:'Dës Aktioun ass NET ZRÉCKZEBEZÉIEN,<br/>w.e.g. d\'Läschung confirméieren'	// luxembourgish
};




C_XL.d['ccss_bp_appointment_color'] = {
  0: 'Define here colors for your appointments. They will appear in the appointment windows when a visitor is selected. Use them to identify categories of appointments. For example: "first consultation, emergency, adult care, ...".', // english
  1: 'définissez ici des couleurs pour vos rendez-vous. Elles apparaîtront dans les fenêtres de rendez-vous lorsqu\'un visitor sera sélectionné. Utilisez-les pour identifier des catégories de rendez-vous. Par exemple: "première consultation, urgence, soin adulte, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich spotkań. Będą one wyświetlane w oknach spotkań, gdy zostanie wybrany visitor. Użyj ich, aby zidentyfikować kategorie spotkań. Na przykład: "first consultation, emergency, adult care, ...".', // polish
  3: 'Stel hier kleuren in voor uw afspraken. Zij verschijnen in de afsprakenvensters wanneer een visitor wordt geselecteerd. Gebruik ze om categorieën van afspraken te identificeren. Bijvoorbeeld: "first consultation, emergency, adult care, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Termine. Diese erscheinen in den Terminfenstern, wenn ein visitor ausgewählt wird. Verwenden Sie sie, um Kategorien von Terminen zu identifizieren. Zum Beispiel: "first consultation, emergency, adult care, ...".', // german
  5: 'Definisci qui i colori per i tuoi appuntamenti. Appariranno nelle finestre degli appuntamenti quando viene selezionato un visitor. Usali per identificare categorie di appuntamenti. Per esempio: "first consultation, emergency, adult care, ...".', // italian
  6: 'Define aquí los colores para tus citas. Aparecerán en las ventanas de citas cuando se seleccione un visitor. Úsalos para identificar categorías de citas. Por ejemplo: "first consultation, emergency, adult care, ...".', // spanish
  7: 'Defina aqui as cores para os seus compromissos. Elas aparecerão nas janelas de compromissos quando um visitor for selecionado. Use-as para identificar categorias de compromissos. Por exemplo: "first consultation, emergency, adult care, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Appointments. Si wäerten an de Appointment Fënsteren gewise, wann e visitor ausgewielt gëtt. Benotzt se fir Kategorien vun Appointments ze identifizéieren. Zum Beispill: "first consultation, emergency, adult care, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_appointment_pattern'] = {
  0: 'Define here patterns for your appointments. They overlay the color and allow you to quickly identify a second category. For example: "Confirmed, In waiting room, No-show, Paid, ...".', // english
  1: 'définissez ici des motifs pour vos rendez-vous. Ils se superposent à la couleur et permettent d’identifier en un coup d’œil une seconde catégorie. Par exemple: "Confirmed, In waiting room, No-show, Paid, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich spotkań. Nakładają się na kolor i umożliwiają szybkie zidentyfikowanie drugiej kategorii. Na przykład: "Confirmed, In waiting room, No-show, Paid, ...".', // polish
  3: 'Stel hier patronen in voor uw afspraken. Deze patronen liggen over de kleur en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld: "Confirmed, In waiting room, No-show, Paid, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Termine. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel: "Confirmed, In waiting room, No-show, Paid, ...".', // german
  5: 'Definisci qui i modelli per i tuoi appuntamenti. Essi si sovrappongono al colore e ti permettono di identificare rapidamente una seconda categoria. Per esempio: "Confirmed, In waiting room, No-show, Paid, ...".', // italian
  6: 'Define aquí los patrones para tus citas. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo: "Confirmed, In waiting room, No-show, Paid, ...".', // spanish
  7: 'Defina aqui os padrões para os seus compromissos. Eles se sobrepõem à cor e permitem identificar, num só olhar, uma segunda categoria. Por exemplo: "Confirmed, In waiting room, No-show, Paid, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Appointments. Si ginn iwwer d\'Faarf geluecht an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill: "Confirmed, In waiting room, No-show, Paid, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_appointment_tag'] = {
  0: 'Create tags here to identify specific characteristics of your appointments. Unlike color and pattern, which are exclusive, an appointment can have multiple tags. For example: "Sent report, VISA payment, Read note carefully, ...".', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos rendez-vous. Contrairement à la couleur et au motif qui sont exclusifs, un rendez-vous peut avoir plusieurs tags. Par exemple: "Sent report, VISA payment, Read note carefully, ...".', // french
  2: 'Utwórz tagi, aby określić specyficzne cechy swoich spotkań. W przeciwieństwie do koloru i wzoru, które są unikatowe, jedno spotkanie może mieć wiele tagów. Na przykład: "Sent report, VISA payment, Read note carefully, ...".', // polish
  3: 'Maak hier tags aan om specifieke kenmerken van uw afspraken te identificeren. In tegenstelling tot kleur en patroon, die exclusief zijn, kan een afspraak meerdere tags hebben. Bijvoorbeeld: "Sent report, VISA payment, Read note carefully, ...".', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer Termine zu kennzeichnen. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann ein Termin mehrere Tags haben. Zum Beispiel: "Sent report, VISA payment, Read note carefully, ...".', // german
  5: 'Crea qui dei tag per identificare le specifiche caratteristiche dei tuoi appuntamenti. A differenza del colore e del motivo, che sono esclusivi, un appuntamento può avere più tag. Per esempio: "Sent report, VISA payment, Read note carefully, ...".', // italian
  6: 'Crea aquí etiquetas para identificar las características específicas de tus citas. A diferencia del color y del patrón, que son exclusivos, una cita puede tener múltiples etiquetas. Por ejemplo: "Sent report, VISA payment, Read note carefully, ...".', // spanish
  7: 'Crie tags aqui para identificar características específicas dos seus compromissos. Ao contrário da cor e do padrão, que são exclusivos, um compromisso pode ter várias tags. Por exemplo: "Sent report, VISA payment, Read note carefully, ...".', // portuguese
  8: 'Definéiert hei Tags fir d\'Spezifizitéiten vun Äre Appointments ze kennzeichnen. Am Géigesaz zur Faarf an dem Muster, déi exklusiv sinn, kann e Appointment méi Tags kréien. Zum Beispill: "Sent report, VISA payment, Read note carefully, ...".' // luxembourgish
};

	
	
	
	
	
C_XL.d['ccss_bp_event_color'] = {
  0: 'Define here colors for your time-off events. They will appear in the time reservation windows when no visitor is selected. Use them to identify categories of leave. For example: "sickness, annual leave, public holiday, ...".', // english
  1: 'définissez ici des couleurs pour vos congés. Elles apparaîtront dans les fenêtres de réservation de temps lorsqu\'aucun visitor n\'est sélectionné. Utilisez-les pour identifier des catégories de congé. Par exemple: "maladie, congé annuels, jour férié, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich events dotyczących urlopu. Będą one wyświetlane w oknach rezerwacji czasu, gdy nie zostanie wybrany visitor. Użyj ich, aby zidentyfikować kategorie leave. Na przykład: "sickness, annual leave, public holiday, ...".', // polish
  3: 'Stel hier kleuren in voor uw verlof. Deze verschijnen in de tijdreserveringsvensters wanneer geen visitor geselecteerd is. Gebruik ze om categorieën van leave te identificeren. Bijvoorbeeld: "sickness, annual leave, public holiday, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Urlaubsereignisse. Diese erscheinen in den Zeitreservierungsfenstern, wenn kein visitor ausgewählt wurde. Verwenden Sie sie, um Kategorien von Leave zu identifizieren. Zum Beispiel: "Krankheit, Jahresurlaub, Feiertag, ...".', // german
  5: 'Definisci qui i colori per i tuoi eventi di congedo. Appariranno nelle finestre di prenotazione del tempo quando nessun visitor è selezionato. Usali per identificare categorie di leave. Per esempio: "sickness, annual leave, public holiday, ...".', // italian
  6: 'Define aquí los colores para tus eventos de descanso. Aparecerán en las ventanas de reserva de tiempo cuando no se seleccione ningún visitor. Úsalos para identificar categorías de leave. Por ejemplo: "sickness, annual leave, public holiday, ...".', // spanish
  7: 'Defina aqui as cores para os seus eventos de licença. Elas aparecerão nas janelas de reserva de tempo quando nenhum visitor for selecionado. Use-as para identificar categorias de leave. Por exemplo: "sickness, annual leave, public holiday, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Congé-Ereignisser. Si wäerten an de Zäitreseveratiounsfenstern gewise, wann keen visitor ausgewielt ass. Benotzt se fir Kategorien vun leave ze identifizéieren. Zum Beispill: "sickness, annual leave, public holiday, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_event_pattern'] = {
  0: 'Define here patterns for your time-off events. They overlay the color and allow you to identify a second category at a glance. For example: "To be confirmed, Remember to book, Private, ...".', // english
  1: 'définissez ici des motifs pour vos congés. Ils se superposent à la couleur et permettent d’identifier en un coup d’oeil une seconde catégorie. Par exemple: "To be confirmed, Remember to book, Private, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich events dotyczących urlopu. Nakładają się one na kolor i umożliwiają natychmiastowe rozpoznanie drugiej kategorii. Na przykład: "To be confirmed, Remember to book, Private, ...".', // polish
  3: 'Stel hier patronen in voor uw verlof. Deze patronen liggen over de kleur en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld: "To be confirmed, Remember to book, Private, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Urlaubsereignisse. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel: "To be confirmed, Remember to book, Private, ...".', // german
  5: 'Definisci qui i modelli per i tuoi eventi di congedo. Essi si sovrappongono al colore e ti permettono di identificare rapidamente una seconda categoria. Per esempio: "To be confirmed, Remember to book, Private, ...".', // italian
  6: 'Define aquí los patrones para tus eventos de descanso. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo: "To be confirmed, Remember to book, Private, ...".', // spanish
  7: 'Defina aqui os padrões para os seus eventos de licença. Estes sobrepõem-se à cor e permitem identificar, num relance, uma segunda categoria. Por exemplo: "To be confirmed, Remember to book, Private, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Congé-Ereignisser. Si ginn iwwer d\'Faarf geplat an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill: "To be confirmed, Remember to book, Private, ...".' // luxembourgish
};


C_XL.d['ccss_bp_event_tag'] = {
  0: 'Create tags here to illustrate the nature of the unavailability. A leave can have several tags, but only one colour and one reason. Examples:<br/>"Administrative, Accounting, Emails, Equipment maintenance, Phone duty, Team meeting, Face to face, Reception duty, On-call, ...".', // english
  1: 'Créez ici des tags afin d’illustrer la nature de l\'indisponibilité. Un congé peut avoir plusieurs tags, mais seulement une couleur et un motif. Exemples:<br/>"Administratif, Comptabilité, Emails, Maintenance matériel, Permanence téléphone, Réunion d\'équipe, Face to face, Permanence accueil, Garde, ...".', // french
  2: 'Utwórz tutaj tagi, aby zilustrować charakter niedostępności. Urlop może mieć kilka tagów, ale tylko jeden kolor i jeden powód. Przykłady:<br/>"Administracyjne, Księgowość, E-maile, Konserwacja sprzętu, Dyżur telefoniczny, Spotkanie zespołu, Face to face, Dyżur recepcyjny, Dyżur, ...".', // polish
  3: 'Maak hier tags aan om de aard van de afwezigheid te verduidelijken. Een verlof kan meerdere tags hebben, maar slechts één kleur en één reden. Voorbeelden:<br/>"Administratief, Boekhouding, E-mails, Materiaalonderhoud, Telefoondienst, Teamvergadering, Face to face, Onthaalpermanentie, Wachtdienst, ...".', // dutch
  4: 'Erstellen Sie hier Tags, um die Art der Abwesenheit zu verdeutlichen. Ein Urlaub kann mehrere Tags haben, aber nur eine Farbe und einen Grund. Beispiele:<br/>"Administrativ, Buchhaltung, E-Mails, Gerätewartung, Telefondienst, Teambesprechung, Face to face, Empfangsdienst, Bereitschaft, ...".', // german
  5: 'Create qui dei tag per illustrare la natura dell\'indisponibilità. Un congedo può avere diversi tag, ma solo un colore e un motivo. Esempi:<br/>"Amministrativo, Contabilità, Email, Manutenzione attrezzature, Servizio telefonico, Riunione del team, Face to face, Servizio accoglienza, Turno di guardia, ...".', // italian
  6: 'Cree aquí etiquetas para ilustrar la naturaleza de la indisponibilidad. Un permiso puede tener varias etiquetas, pero solo un color y un motivo. Ejemplos:<br/>"Administrativo, Contabilidad, Correos electrónicos, Mantenimiento de equipos, Guardia telefónica, Reunión de equipo, Face to face, Servicio de recepción, Guardia, ...".', // spanish
  7: 'Crie aqui etiquetas para ilustrar a natureza da indisponibilidade. Um período de ausência pode ter várias etiquetas, mas apenas uma cor e um motivo. Exemplos:<br/>"Administrativo, Contabilidade, Emails, Manutenção de equipamentos, Plantão telefónico, Reunião de equipa, Face to face, Serviço de receção, Turno de guarda, ...".', // portuguese
  8: 'Maacht hei Tags fir d’Natur vun der Net-Verfügheet ze illustréieren. Eng Congé kann e puer Tags hunn, awer just eng Faarf an ee Motiv. Beispiller:<br/>"Administrativ, Comptabilitéit, E-mails, Materialënnerhalt, Telefonsdéngscht, Teamreunioun, Face to face, Accueil-Déngscht, Garde, ...".' // luxembourgish
};

		



C_XL.d['ccss_bp_note_color'] = {
  0: 'Define here colors for your notes. They will appear in the notes windows. Use them to identify categories of notes. For example "to read, important, birthday, ...".', // english
  1: 'définissez ici des couleurs pour vos notes. Elles apparaîtront dans les fenêtres de notes. Utilisez-les pour identifier des catégories de notes. Par exemple "à lire, important, anniversaire, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich notatek. Będą się one pojawiały w oknach notatek. Użyj ich, aby zidentyfikować kategorie notatek. Na przykład "do przeczytania, ważne, urodziny, ...".', // polish
  3: 'Stel hier kleuren in voor uw notities. Ze zullen verschijnen in de notitiewindows. Gebruik ze om categorieën van notities te identificeren. Bijvoorbeeld "te lezen, belangrijk, verjaardag, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Notizen. Diese erscheinen in den Notizenfenstern. Verwenden Sie sie, um Kategorien von Notizen zu identifizieren. Zum Beispiel "zum Lesen, wichtig, Geburtstag, ...".', // german
  5: 'Definisci qui i colori per le tue note. Appariranno nelle finestre delle note. Usali per identificare categorie di note. Per esempio "da leggere, importante, compleanno, ...".', // italian
  6: 'Define aquí los colores para tus notas. Aparecerán en las ventanas de notas. Úsalos para identificar categorías de notas. Por ejemplo "por leer, importante, cumpleaños, ...".', // spanish
  7: 'Defina aqui as cores para as suas notas. Elas aparecerão nas janelas de notas. Use-as para identificar categorias de notas. Por exemplo "para ler, importante, aniversário, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Notizen. Si wäerten an den Notizenfenstern gewise. Benotzt se fir Kategorien vun Notizen ze identifizéieren. Zum Beispill "ze liesen, wichteg, Gebuertsdags, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_note_pattern'] = {
  0: 'Define here patterns for your notes. They overlay the color and allow you to quickly identify a second category. For example: "react today, party, administrative, orders, accounting, ...".', // english
  1: 'définissez ici des motifs pour vos notes. Ils se superposent à la couleur et permettent d’identifier en un coup d’oeil une seconde catégorie. Par exemple: "réagir aujourdhui, fête, administratif, commandes, comptable, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich notatek. Nakładają się one na kolor i pozwalają szybko rozpoznać drugą kategorię. Na przykład: "zareagować dzisiaj, impreza, administracyjne, zamówienia, księgowość, ...".', // polish
  3: 'Stel hier patronen in voor uw notities. Ze worden over de kleur heen gelegd en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld: "reageer vandaag, feest, administratief, bestellingen, boekhouding, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Notizen. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel: "heute reagieren, Feier, administrativ, Bestellungen, Buchhaltung, ...".', // german
  5: 'Definisci qui i modelli per le tue note. Essi si sovrappongono al colore e ti permettono di identificare in un colpo d’occhio una seconda categoria. Per esempio "reagire oggi, festa, amministrativo, ordini, contabilità, ...".', // italian
  6: 'Define aquí los patrones para tus notas. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo: "reaccionar hoy, fiesta, administrativo, pedidos, contabilidad, ...".', // spanish
  7: 'Defina aqui os padrões para as suas notas. Estes sobrepõem-se à cor e permitem identificar, num relance, uma segunda categoria. Por exemplo: "reaja hoje, festa, administrativo, encomendas, contabilidade, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Notizen. Si ginn iwwer d\'Faarf geplat an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill "haut reagéieren, Feier, administrativ, Bestellungen, Buchhaltung, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_note_tag'] = {
  0: 'Create tags here to identify specific characteristics of your notes. Unlike color and pattern, which are exclusive, a note can have multiple tags. For example: "Have Marc proofread, Recurrent, ...".', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos notes. Contrairement à la couleur et au motif qui sont exclusifs, une note peut avoir plusieurs tags. Par exemple: "Faire relire par Marc, Récurrent, ...".', // french
  2: 'Utwórz tagi, aby określić specyficzne cechy swoich notatek. W przeciwieństwie do koloru i wzoru, które są wyłączne, jedna nota może mieć wiele tagów. Na przykład: "Niech Marc sprawdzi, Powtarzalne, ...".', // polish
  3: 'Maak hier tags aan om specifieke kenmerken van uw notities te identificeren. In tegenstelling tot kleur en patroon, die exclusief zijn, kan een notitie meerdere tags hebben. Bijvoorbeeld: "Laat Marc nalezen, Recurrent, ...".', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer Notizen zu kennzeichnen. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann eine Note mehrere Tags haben. Zum Beispiel: "Von Marc Korrektur lesen lassen, Wiederkehrend, ...".', // german
  5: 'Crea qui dei tag per identificare le specifiche caratteristiche delle tue note. A differenza del colore e del motivo, che sono esclusivi, una nota può avere più tag. Per esempio: "Far revisionare da Marc, Ricorrente, ...".', // italian
  6: 'Crea aquí etiquetas para identificar características específicas de tus notas. A diferencia del color y del patrón, que son exclusivos, una nota puede tener varias etiquetas. Por ejemplo: "Que Marc las revise, Recurrente, ...".', // spanish
  7: 'Crie tags aqui para identificar características específicas das suas notas. Ao contrário da cor e do padrão, que são exclusivos, uma nota pode ter várias tags. Por exemplo: "Fazer Marc revisar, Recurrente, ...".', // portuguese
  8: 'Definéiert hei Tags fir d\'Spezifizitéiten vun Äre Notizen ze kennzeichnen. Am Géigesaz zu der Faarf an dem Muster, déi exklusiv sinn, kann eng Notiz méi Tags kréien. Zum Beispill "Loosst Marc et kontrolléieren, Réckkomend, ...".' // luxembourgish
};
		



C_XL.d['ccss_bp_task_color'] = {
  0: 'Define here colors for your tasks. They will appear in the task windows. Use them to identify categories of tasks. For example "Urgent, Fiscal, Post, Invoices, ...".', // english
  1: 'définissez ici des couleurs pour vos tâches. Elles apparaîtront dans les fenêtres de tâches. Utilisez-les pour identifier des catégories de tâches. Par exemple "Urgent, Fiscal, Poste, Factures, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich zadań. Będą one wyświetlane w oknach zadań. Użyj ich, aby zidentyfikować kategorie zadań. Na przykład "Pilne, Fiskalne, Pocztowe, Faktury, ...".', // polish
  3: 'Stel hier kleuren in voor uw taken. Ze verschijnen in de takenvensters. Gebruik ze om categorieën van taken te identificeren. Bijvoorbeeld "Urgent, Fiscaal, Post, Facturen, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Aufgaben. Diese erscheinen in den Aufgabenfenstern. Verwenden Sie sie, um Kategorien von Aufgaben zu identifizieren. Zum Beispiel "Dringend, Fiskal, Post, Rechnungen, ...".', // german
  5: 'Definisci qui i colori per le tue attività. Appariranno nelle finestre delle attività. Usali per identificare categorie di attività. Per esempio "Urgente, Fiscale, Posta, Fatture, ...".', // italian
  6: 'Define aquí los colores para tus tareas. Aparecerán en las ventanas de tareas. Úsalos para identificar categorías de tareas. Por ejemplo "Urgente, Fiscal, Correo, Facturas, ...".', // spanish
  7: 'Defina aqui as cores para as suas tarefas. Elas aparecerão nas janelas de tarefas. Utilize-as para identificar categorias de tarefas. Por exemplo "Urgente, Fiscal, Correio, Faturas, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Aufgaben. Si wäerten an de Aufgabenfenstern gewise. Benotzt se fir Kategorien vun Aufgaben ze identifizéieren. Zum Beispill "Dréngend, Fiskal, Post, Rechnungen, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_task_pattern'] = {
  0: 'Define here patterns for your tasks. They overlay the color and allow you to quickly identify a second category. For example: "in progress, to be checked, completed, ...".', // english
  1: 'définissez ici des motifs pour vos tâches. Ils se superposent à la couleur et permettent d’identifier en un coup d’oeil une seconde catégorie. Par exemple: "en cours de réalisation, à vérifier, terminée, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich zadań. Nakładają się one na kolor i pozwalają szybko rozpoznać drugą kategorię. Na przykład: "w trakcie realizacji, do sprawdzenia, zakończone, ...".', // polish
  3: 'Stel hier patronen in voor uw taken. Deze patronen liggen over de kleur en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld: "in uitvoering, te controleren, voltooid, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Aufgaben. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel: "in Bearbeitung, zu überprüfen, abgeschlossen, ...".', // german
  5: 'Definisci qui i modelli per le tue attività. Essi si sovrappongono al colore e ti permettono di identificare in un colpo d’occhio una seconda categoria. Per esempio: "in corso, da verificare, terminata, ...".', // italian
  6: 'Define aquí los patrones para tus tareas. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo: "en curso, por verificar, completada, ...".', // spanish
  7: 'Defina aqui os padrões para as suas tarefas. Estes sobrepõem-se à cor e permitem identificar, de relance, uma segunda categoria. Por exemplo: "em andamento, a verificar, concluída, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Aufgaben. Si ginn iwwer d’Faarf geplat an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill: "am Gaangen, ze kontrolléieren, ofgeschloss, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_task_tag'] = {
  0: 'Create tags here to identify specific characteristics of your tasks. Unlike color and pattern, which are exclusive, a task can have multiple tags. For example: "Blocked, Requires tooling, ...".', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos tâches. Contrairement à la couleur et au motif qui sont exclusifs, une tâche peut avoir plusieurs tags. Par exemple: "Bloquée, Nécessite outillage, ...".', // french
  2: 'Utwórz tagi, aby określić specyficzne cechy swoich zadań. W przeciwieństwie do koloru i wzoru, które są jednoznaczne, jedno zadanie może mieć kilka tagów. Na przykład: "Zablokowane, Wymaga narzędzi, ...".', // polish
  3: 'Maak hier tags aan om specifieke kenmerken van uw taken te identificeren. In tegenstelling tot kleur en patroon, die uniek zijn, kan een taak meerdere tags hebben. Bijvoorbeeld: "Geblokkeerd, Vereist gereedschap, ...".', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer Aufgaben zu kennzeichnen. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann eine Aufgabe mehrere Tags besitzen. Zum Beispiel: "Blockiert, Benötigt Werkzeug, ...".', // german
  5: 'Crea qui dei tag per identificare le specifiche caratteristiche delle tue attività. A differenza del colore e del modello, che sono esclusivi, una attività può avere più tag. Per esempio: "Bloccata, Richiede attrezzi, ...".', // italian
  6: 'Crea aquí etiquetas para identificar características específicas de tus tareas. A diferencia del color y del patrón, que son exclusivos, una tarea puede tener varias etiquetas. Por ejemplo: "Bloqueada, Requiere herramientas, ...".', // spanish
  7: 'Crie tags aqui para identificar especificidades das suas tarefas. Ao contrário da cor e do padrão, que são exclusivos, uma tarefa pode ter várias tags. Por exemplo: "Bloqueada, Necessita de ferramentas, ...".', // portuguese
  8: 'Definéiert hei Tags fir d\'Spezifizitéiten vun Äre Aufgaben ze kennzeichnen. Am Géigesaz zu Faarf a Musteren, déi exklusiv sinn, kann eng Aufgab méi Tags hunn. Zum Beispill: "Gesperrt, Besuetzeg Tooling, ...".' // luxembourgish
};




C_XL.d['ccss_bp_chat_color'] = {
  0: 'Define here colors for your chats. They will appear in the chat windows, where you can apply them. Use them to identify types of chat. For example "In progress, For info, Urgent, ...".', // english
  1: 'définissez ici des couleurs pour vos chats. Elles apparaîtront dans les fenêtres de chats, où vous pouvez les appliquer. Utilisez-les pour identifier des types de chat. Par exemple "En cours, Pour info, Urgent, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich czatów. Będą one wyświetlane w oknach czatów, gdzie możesz je stosować. Użyj ich, aby zidentyfikować typy czatu. Na przykład: "W trakcie, Do informacji, Pilne, ...".', // polish
  3: 'Stel hier kleuren in voor uw chats. Ze verschijnen in de chatvensters, waar u ze kunt toepassen. Gebruik ze om chattypes te identificeren. Bijvoorbeeld: "In uitvoering, Voor informatie, Dringend, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Chats. Diese erscheinen in den Chatfenstern, in denen Sie sie anwenden können. Verwenden Sie sie, um Chattypen zu identifizieren. Zum Beispiel: "In Bearbeitung, Zur Information, Dringend, ...".', // german
  5: 'Definisci qui i colori per le tue chat. Appariranno nelle finestre delle chat, dove potrai applicarli. Usali per identificare i tipi di chat. Per esempio: "In corso, Per informazione, Urgente, ...".', // italian
  6: 'Define aquí los colores para tus chats. Aparecerán en las ventanas de chat, donde podrás aplicarlos. Úsalos para identificar tipos de chat. Por ejemplo: "En curso, Para información, Urgente, ...".', // spanish
  7: 'Defina aqui as cores para os seus chats. Elas aparecerão nas janelas de chat, onde poderá aplicá-las. Use-as para identificar tipos de chat. Por exemplo: "Em progresso, Para informação, Urgente, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Chats. Si wäerten an de Chatfënsteren gewise, wou Dir se anwenden kënnt. Benotzt se fir Typen vu Chat ze identifizéieren. Zum Beispill: "Am Gaangen, Fir Informatioun, Dréngend, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_chat_pattern'] = {
  0: 'Define here patterns for your chats. They overlay the color and allow you to quickly identify a second category. For example: "demanding client, do not archive, good to archive, ...".', // english
  1: 'définissez ici des motifs pour vos chats. Ils se superposent à la couleur et permettent d’identifier en un coup d’oeil une seconde catégorie. Par exemple: "client exigeant, ne pas archiver, bon à archiver, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich czatów. Nakładają się one na kolor i pozwalają szybko zidentyfikować drugą kategorię. Na przykład: "wymagający klient, nie archiwizować, do archiwizacji, ...".', // polish
  3: 'Stel hier patronen in voor uw chats. Deze patronen worden over de kleur gelegd en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld: "veeleisende klant, niet archiveren, goed om te archiveren, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Chats. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel: "anspruchsvoller Kunde, nicht archivieren, gut zu archivieren, ...".', // german
  5: 'Definisci qui i modelli per le tue chat. Essi si sovrappongono al colore e ti permettono di identificare in un colpo d’occhio una seconda categoria. Per esempio: "cliente esigente, da non archiviare, da archiviare, ...".', // italian
  6: 'Define aquí los patrones para tus chats. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo: "cliente exigente, no archivar, bueno para archivar, ...".', // spanish
  7: 'Defina aqui os padrões para os seus chats. Estes sobrepõem-se à cor e permitem identificar, num relance, uma segunda categoria. Por exemplo: "cliente exigente, não arquivar, bom para arquivar, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Chats. Si ginn iwwer d’Faarf geplat an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill: "ufuerderleche Client, net archivéieren, gutt fir Archiv, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_chat_tag'] = {
  0: 'Create tags here to identify specific characteristics of your chats. Unlike color and pattern, which are exclusive, a chat can have multiple tags. For example: "Expert intervention, Wait for client reaction, Debate, Internal, ...".', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos chats. Contrairement à la couleur et au motif qui sont exclusifs, un chat peut avoir plusieurs tags. Par exemple: "Intervention d\'un expert, Attendre réaction client, Débat, Interne, ...".', // french
  2: 'Utwórz tagi, aby zidentyfikować specyficzne cechy swoich czatów. W przeciwieństwie do koloru i wzoru, które są unikalne, jeden czat może mieć wiele tagów. Na przykład: "Interwencja eksperta, Oczekiwanie na reakcję klienta, Debata, Wewnętrzne, ...".', // polish
  3: 'Maak hier tags aan om de specifieke eigenschappen van uw chats te identificeren. In tegenstelling tot kleur en patroon, die exclusief zijn, kan een chat meerdere tags hebben. Bijvoorbeeld: "Expertinterventie, Wacht op klantreactie, Debat, Intern, ...".', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer Chats zu kennzeichnen. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann ein Chat mehrere Tags haben. Zum Beispiel: "Intervention eines Experten, Warten auf Kundenreaktion, Debatte, Intern, ...".', // german
  5: 'Crea qui dei tag per identificare le caratteristiche specifiche delle tue chat. A differenza del colore e del motivo, che sono esclusivi, una chat può avere più tag. Per esempio: "Intervento di un esperto, Attendere la reazione del cliente, Dibattito, Interno, ...".', // italian
  6: 'Crea aquí etiquetas para identificar las características específicas de tus chats. A diferencia del color y del patrón, que son exclusivos, un chat puede tener múltiples etiquetas. Por ejemplo: "Intervención de un experto, Espera de reacción del cliente, Debate, Interno, ...".', // spanish
  7: 'Crie tags aqui para identificar as características específicas dos seus chats. Ao contrário da cor e do padrão, que são exclusivos, um chat pode ter vários tags. Por exemplo: "Intervenção de um especialista, Aguardar reação do cliente, Debate, Interno, ...".', // portuguese
  8: 'Definéiert hei Tags fir déi spezifescht Eegeschafte vun Äre Chats ze kennzeichnen. Am Géigesaz zu Faarf an Muster, déi exklusiv sinn, kann eng Chat méi Tags hunn. Zum Beispill: "Interventioun vun engem Expert, Waart op Clientreaktioun, Debatt, Intern, ...".' // luxembourgish
};

		



C_XL.d['ccss_bp_file_color'] = {
  0: 'Define here colors for your files. They will appear in the file windows, where you can apply them. Use them to identify groups of files. For example "Radio, Before, After, Final Report, Invoice, ...".', // english
  1: 'définissez ici des couleurs pour vos fichiers. Elles apparaîtront dans les fenêtres de fichiers, où vous pouvez les appliquer. Utilisez-les pour identifier des ensembles de fichiers. Par exemple "Radio, Avant, Après, Rapport final, Facture, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich plików. Będą one wyświetlane w oknach plików, gdzie możesz je zastosować. Użyj ich, aby zidentyfikować zestawy plików. Na przykład "Radio, Przed, Po, Raport końcowy, Faktura, ...".', // polish
  3: 'Stel hier kleuren in voor uw bestanden. Deze verschijnen in de bestandsvensters, waar u ze kunt toepassen. Gebruik ze om groepen van bestanden te identificeren. Bijvoorbeeld "Radio, Voor, Na, Eindrapport, Factuur, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Dateien. Diese erscheinen in den Dateifenstern, in denen Sie sie anwenden können. Verwenden Sie sie, um Dateigruppen zu identifizieren. Zum Beispiel "Radio, Vor, Nach, Abschlussbericht, Rechnung, ...".', // german
  5: 'Definisci qui i colori per i tuoi file. Appariranno nelle finestre dei file, dove potrai applicarli. Usali per identificare gruppi di file. Per esempio "Radio, Prima, Dopo, Rapporto finale, Fattura, ...".', // italian
  6: 'Define aquí los colores para tus archivos. Aparecerán en las ventanas de archivos, donde podrás aplicarlos. Úsalos para identificar conjuntos de archivos. Por ejemplo "Radio, Antes, Después, Informe final, Factura, ...".', // spanish
  7: 'Defina aqui as cores para os seus ficheiros. Elas aparecerão nas janelas de ficheiros, onde poderá aplicá-las. Use-as para identificar conjuntos de ficheiros. Por exemplo "Radio, Antes, Depois, Relatório final, Fatura, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Dateien. Si wäerten an de Dateifënsteren gewise, wou Dir se anwenden kënnt. Benotzt se fir Gruppen vu Dateien ze identifizéieren. Zum Beispill "Radio, Vir, Nom, Ofschlossbericht, Rechnung, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_file_pattern'] = {
  0: 'Define here patterns for your files. They overlay the color and allow you to quickly identify a second category. For example: "Obsolete, Do not delete, ...".', // english
  1: 'définissez ici des motifs pour vos fichiers. Ils se superposent à la couleur et permettent d’identifier en un coup d’oeil une seconde catégorie. Par exemple: "Obsolete, Ne pas effacer, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich plików. Nakładają się one na kolor i pozwalają natychmiast rozpoznać drugą kategorię. Na przykład "Przestarzały, Nie usuwać, ...".', // polish
  3: 'Stel hier patronen in voor uw bestanden. Zij worden over de kleur gelegd en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld "Verouderd, Niet verwijderen, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Dateien. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel "Veraltet, Nicht löschen, ...".', // german
  5: 'Definisci qui i modelli per i tuoi file. Essi si sovrappongono al colore e ti permettono di identificare rapidamente una seconda categoria. Per esempio "Obsoleto, Non cancellare, ...".', // italian
  6: 'Define aquí los patrones para tus archivos. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo "Obsoleto, No borrar, ...".', // spanish
  7: 'Defina aqui os padrões para os seus ficheiros. Estes sobrepõem-se à cor e permitem identificar, de relance, uma segunda categoria. Por exemplo "Obsoleto, Não apagar, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Dateien. Si ginn iwwer d\'Faarf geplat an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill "Obsolëtt, Net läschen, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_file_tag'] = {
  0: 'Create tags here to identify specific characteristics of your files. Unlike color and pattern, which are exclusive, a file can have multiple tags.', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos fichiers. Contrairement à la couleur et au motif qui sont exclusifs, un fichier peut avoir plusieurs tags.', // french
  2: 'Utwórz tagi, aby określić specyficzne cechy swoich plików. W przeciwieństwie do koloru i wzoru, które są jednoznaczne, jeden plik może mieć wiele tagów.', // polish
  3: 'Maak hier tags aan om specifieke kenmerken van uw bestanden te identificeren. In tegenstelling tot kleur en patroon, die exclusief zijn, kan een bestand meerdere tags hebben.', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer Dateien zu kennzeichnen. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann eine Datei mehrere Tags haben.', // german
  5: 'Crea qui dei tag per identificare le specifiche caratteristiche dei tuoi file. A differenza del colore e del motivo, che sono esclusivi, un file può avere più tag.', // italian
  6: 'Crea aquí etiquetas para identificar características específicas de tus archivos. A diferencia del color y del patrón, que son exclusivos, un archivo puede tener varias etiquetas.', // spanish
  7: 'Crie tags aqui para identificar características específicas dos seus ficheiros. Ao contrário do cor e do padrão, que são exclusivos, um ficheiro pode ter várias tags.', // portuguese
  8: 'Definéiert hei Tags fir d\'Spezifizitéiten vun Äre Dateien ze kennzeichnen. Am Géigesaz zu der Faarf an dem Muster, déi exklusiv sinn, kann eng Datei méi Tags hunn.' // luxembourgish
};




C_XL.d['ccss_bp_product_color'] = {
  0: 'Define here colors for your products. They will appear in the product windows, where you can apply them. Use them to identify categories of products. For example "Face, Hair, Decoration, Well-being, Perfumes, ...".', // english
  1: 'définissez ici des couleurs pour vos produits. Elles apparaîtront dans les fenêtres de produits, où vous pouvez les appliquer. Utilisez-les pour identifier des catégories de produits. Par exemple "Visage, Cheveux, Décoration, Bien être, Parfums, ...".', // french
  2: 'Zdefiniuj tutaj kolory dla swoich produktów. Będą one wyświetlane w oknach produktów, gdzie możesz je stosować. Użyj ich, aby zidentyfikować kategorie produktów. Na przykład "Twarz, Włosy, Dekoracja, Dobrostan, Perfumy, ...".', // polish
  3: 'Stel hier kleuren in voor uw producten. Ze zullen verschijnen in de productvensters, waar u ze kunt toepassen. Gebruik ze om categorieën van producten te identificeren. Bijvoorbeeld "Gezicht, Haar, Decoratie, Welzijn, Parfums, ...".', // dutch
  4: 'Definieren Sie hier Farben für Ihre Produkte. Diese erscheinen in den Produktfenstern, in denen Sie sie anwenden können. Verwenden Sie sie, um Kategorien von Produkten zu identifizieren. Zum Beispiel "Gesicht, Haare, Dekoration, Wohlbefinden, Parfums, ...".', // german
  5: 'Definisci qui i colori per i tuoi prodotti. Appariranno nelle finestre dei prodotti, dove potrai applicarli. Usali per identificare categorie di prodotti. Per esempio "Viso, Capelli, Decorazione, Benessere, Profumi, ...".', // italian
  6: 'Define aquí los colores para tus productos. Aparecerán en las ventanas de productos, donde podrás aplicarlos. Úsalos para identificar categorías de productos. Por ejemplo "Rostro, Cabello, Decoración, Bienestar, Perfumes, ...".', // spanish
  7: 'Defina aqui as cores para os seus produtos. Elas aparecerão nas janelas de produtos, onde poderá aplicá-las. Use-as para identificar categorias de produtos. Por exemplo "Rosto, Cabelo, Decoração, Bem-estar, Perfumes, ...".', // portuguese
  8: 'Definéiert hei d\'Faarwen fir Är Produkter. Si wäerten an de Produktfënsteren gewise, wou Dir se anwenden kënnt. Benotzt se fir Kategorien vun Produkter ze identifizéieren. Zum Beispill "Gesicht, Hoer, Dekoratioun, Wuelbefannen, Parfums, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_product_pattern'] = {
  0: 'Define here patterns for your products. They overlay the color and allow you to quickly identify a second category. For example: "On promotion, Out of stock, Loyalty gift, Sample, ...".', // english
  1: 'définissez ici des motifs pour vos produits. Ils se superposent à la couleur et permettent d’identifier en un coup d’oeil une seconde catégorie. Par exemple: "En promotion, Fin de stock, Cadeau fidélité, Echantillon, ...".', // french
  2: 'Zdefiniuj tutaj wzory dla swoich produktów. Nakładają się one na kolor i umożliwiają natychmiastową identyfikację drugiej kategorii. Na przykład "W promocji, Brak w magazynie, Prezent lojalnościowy, Próbka, ...".', // polish
  3: 'Stel hier patronen in voor uw producten. Zij worden over de kleur heen gelegd en stellen u in staat om in één oogopslag een tweede categorie te herkennen. Bijvoorbeeld "In promotie, Uit voorraad, Loyaliteitsgeschenk, Monster, ...".', // dutch
  4: 'Definieren Sie hier Muster für Ihre Produkte. Diese überlagern die Farbe und ermöglichen es, auf einen Blick eine zweite Kategorie zu erkennen. Zum Beispiel "Im Angebot, Ausverkauft, Treuegeschenk, Muster, ...".', // german
  5: 'Definisci qui i modelli per i tuoi prodotti. Essi si sovrappongono al colore e ti permettono di identificare rapidamente una seconda categoria. Per esempio "In promozione, Esaurito, Regalo fedeltà, Campione, ...".', // italian
  6: 'Define aquí los patrones para tus productos. Se superponen al color y te permiten identificar de un vistazo una segunda categoría. Por ejemplo "En promoción, Agotado, Regalo de fidelidad, Muestra, ...".', // spanish
  7: 'Defina aqui os padrões para os seus produtos. Eles sobrepõem-se à cor e permitem identificar, num relance, uma segunda categoria. Por exemplo "Em promoção, Fora de estoque, Presente de fidelidade, Amostra, ...".', // portuguese
  8: 'Definéiert hei Musteren fir Är Produkter. Si ginn iwwermuer vun der Faarf geplat an erlaben Iech, op engem Bléck eng zweet Kategorie ze erkennen. Zum Beispill "Am Promotioun, Ausverkaf, Treuegonschent, Muster, ...".' // luxembourgish
};

			
C_XL.d['ccss_bp_product_tag'] = {
  0: 'Create tags here to identify specific characteristics of your products. Unlike color and pattern, which are exclusive, a product can have multiple tags.', // english
  1: 'Créez ici des tags afin d’identifier des spécificités de vos produits. Contrairement à la couleur et au motif qui sont exclusifs, un produit peut avoir plusieurs tags.', // french
  2: 'Utwórz tagi, aby określić specyficzne cechy swoich produktów. W przeciwieństwie do koloru i wzoru, które są jednoznaczne, jeden produkt może mieć wiele tagów.', // polish
  3: 'Maak hier tags aan om specifieke kenmerken van uw producten te identificeren. In tegenstelling tot kleur en patroon, die exclusief zijn, kan een product meerdere tags hebben.', // dutch
  4: 'Erstellen Sie hier Tags, um spezifische Eigenschaften Ihrer Produkte zu kennzeichnen. Im Gegensatz zu Farbe und Muster, die exklusiv sind, kann ein Produkt mehrere Tags besitzen.', // german
  5: 'Crea qui dei tag per identificare le specifiche caratteristiche dei tuoi prodotti. A differenza del colore e del motivo, che sono esclusivi, un prodotto può avere più tag.', // italian
  6: 'Crea aquí etiquetas para identificar características específicas de tus productos. A diferencia del color y del patrón, que son exclusivos, un producto puede tener varias etiquetas.', // spanish
  7: 'Crie tags aqui para identificar características específicas dos seus produtos. Ao contrário da cor e do padrão, que são exclusivos, um produto pode ter vários tags.', // portuguese
  8: 'Definéiert hei Tags fir d\'Spezifizitéiten vun Äre Produkter ze kennzeichnen. Am Géigesaz zu der Faarf an dem Muster, déi exklusiv sinn, kann e Produkt méi Tags hunn.' // luxembourgish
};
		

C_XL.d['bp_bprefs_timeboxing'] = { 
  0: 'Time blocks allow you to group your services within certain time slots. You can associate periods of your availabilities with a time block. Then indicate in your services which time blocks are preferable for each service. Examples of time blocks: Emergency, Nouveau visitor, At home, ...', // english
  1: 'Les blocs horaires permettent de regouper vos prestations dans certaines plages horaires. Vous pouvez associer des périodes de votre horaire à un bloc horaire. Indiquer ensuite dans vos prestations quels blocs horaires sont préférables, ceci pour chaque prestation. Exemples de blocs horaires: Urgence, Nouveau visitor, A domicile, ...', // french
  2: 'Bloki czasowe pozwalają grupować Twoje usługi w określonych przedziałach czasowych. Możesz przypisać fragmenty swojego harmonogramu do bloku czasowego. Następnie wskaż w swoich usługach, które bloki czasowe są preferowane dla każdej usługi. Przykłady bloków czasowych: Nagły wypadek, Nouveau visitor, W domu, ...', // polish
  3: 'Tijdsblokken stellen u in staat om uw diensten binnen bepaalde tijdsintervallen te groeperen. U kunt delen van uw rooster koppelen aan een tijdsblok. Geef vervolgens in uw diensten aan welke tijdsblokken voor elke dienst de voorkeur hebben. Voorbeelden van tijdsblokken: Noodgeval, Nouveau visitor, Thuis, ...', // dutch
  4: 'Zeitblöcke ermöglichen es Ihnen, Ihre Dienstleistungen in bestimmten Zeitfenstern zu gruppieren. Sie können Teile Ihres Zeitplans einem Zeitblock zuordnen. Weisen Sie anschließend in Ihren Dienstleistungen darauf hin, welche Zeitblöcke für jede Dienstleistung bevorzugt werden. Beispiele für Zeitblöcke: Notfall, Nouveau visitor, Zu Hause, ...', // german
  5: 'I blocchi orari ti consentono di raggruppare i tuoi servizi in determinate fasce orarie. Puoi associare periodi del tuo orario a un blocco orario. Indica quindi nei tuoi servizi quali blocchi orari sono preferibili per ogni servizio. Esempi di blocchi orari: Emergenza, Nouveau visitor, A domicilio, ...', // italian
  6: 'Los bloques horarios te permiten agrupar tus servicios en determinados intervalos de tiempo. Puedes asociar periodos de tu horario a un bloque horario. Luego, indica en tus servicios cuáles bloques horarios son preferibles para cada servicio. Ejemplos de bloques horarios: Emergencia, Nouveau visitor, A domicilio, ...', // spanish
  7: 'Os blocos de tempo permitem agrupar os seus serviços em determinados intervalos. Pode associar períodos do seu horário a um bloco de tempo. Em seguida, indique nos seus serviços quais blocos de tempo são preferíveis para cada serviço. Exemplos de blocos de tempo: Urgência, Nouveau visitor, Em casa, ...', // portuguese
  8: 'D\'zäitreseveratiounsbléck erlaben Iech, Är Prestatiounen an bestëmmte Zäitraum ze gruppéieren. Dir kënnt Perioden vun Ärem Zäitrezept engem Zäitreseveratiounsbloc zouweisen. Gitt dann an Ären Prestatiounen un, wéini déi jeweileg Zäitreseveratiounsbléck de Preferenz sinn. Beispiller vu Zäitreseveratiounsbléck: Noutfall, Nouveau visitor, Doheem, ...' // luxembourgish
};




C_XL.d['bp_bprefs_workcodes'] = { 
  0: 'Define here your regular services as you name and use them internally. You will be able to associate one or more services with each appointment.<br/>To subdivide them into categories, define colors and patterns on the "Colors" tab in Settings and Preferences.', // english
  1: 'Définissez ici vos prestations habituelles telle que vous les nommez et utilisez en interne. Vous pourrez associer une ou plusieurs prestations dans chaque rendez-vous.<br/>Pour les subdiviser en catégories, définissez des couleurs et motifs sur l\'onglet Couleurs des réglages et préférences.', // french
  2: 'Określ tutaj swoje standardowe usługi, tak jak je nazywasz i używasz wewnętrznie. Będziesz mógł przypisać jedną lub więcej usług do każdego spotkania.<br/>Aby je podzielić na kategorie, zdefiniuj kolory i wzory na karcie "Kolory" w ustawieniach i preferencjach.', // polish
  3: 'Definieer hier uw gebruikelijke diensten zoals u ze intern benoemt en gebruikt. U kunt één of meerdere diensten koppelen aan elke afspraak.<br/>Om ze in categorieën te verdelen, stelt u kleuren en patronen in op het tabblad "Kleuren" in Instellingen en Voorkeuren.', // dutch
  4: 'Definieren Sie hier Ihre üblichen Dienstleistungen, so wie Sie sie intern benennen und verwenden. Sie können eine oder mehrere Dienstleistungen mit jedem Termin verknüpfen.<br/>Um sie in Kategorien zu unterteilen, definieren Sie Farben und Muster im Reiter "Farben" in den Einstellungen und Präferenzen.', // german
  5: 'Definisci qui i tuoi servizi abituali, così come li nomini e li usi internamente. Potrai associare uno o più servizi ad ogni appuntamento.<br/>Per suddividerli in categorie, definisci colori e modelli nella scheda "Colori" delle Impostazioni e Preferenze.', // italian
  6: 'Define aquí tus servicios habituales tal como los nombras y los usas internamente. Podrás asociar uno o más servicios a cada cita.<br/>Para subdividirlos en categorías, define colores y patrones en la pestaña "Colores" de Configuraciones y Preferencias.', // spanish
  7: 'Defina aqui os seus serviços habituais, tal como os nomeia e os utiliza internamente. Poderá associar um ou mais serviços a cada compromisso.<br/>Para subdividi-los em categorias, defina cores e padrões na aba "Cores" das Configurações e Preferências.', // portuguese
  8: 'Definéiert hei Är üblech Déngschtleeschtungen, sou wéi Dir se intern benoemt an benotzt. Dir kënnt eng oder méi Déngschtleeschtungen un all Rendez-vous koppelen.<br/>Fir se an Kategorien opzedeelen, definéiert Faarwen a Musteren um Tab "Faarwen" an de Stellungen a Präferenzen.' // luxembourgish
};


C_XL.d['bp_bprefs_eworkcodes'] = { 
  0: 'In this list, you define the services that you offer on your website. Pay attention to the naming; it must be commercial.', // english
  1: 'Dans cette liste vous définissez les prestations que vous offrez sur votre page web. Soignez la dénomination, elle doit être commerciale.', // french
  2: 'W tej liście określasz usługi, które oferujesz na swojej stronie internetowej. Zadbaj o nazewnictwo; musi być komercyjne.', // polish
  3: 'In deze lijst definieert u de diensten die u op uw website aanbiedt. Besteed aandacht aan de benaming; deze moet commercieel zijn.', // dutch
  4: 'In dieser Liste definieren Sie die Dienstleistungen, die Sie auf Ihrer Website anbieten. Achten Sie auf die Bezeichnung; sie muss kommerziell sein.', // german
  5: 'In questo elenco definisci i servizi che offri sul tuo sito web. Cura la denominazione; deve essere commerciale.', // italian
  6: 'En esta lista, defines los servicios que ofreces en tu página web. Cuida la denominación; debe ser comercial.', // spanish
  7: 'Nesta lista, você define os serviços que oferece em sua página web. Cuide da nomenclatura; ela deve ser comercial.', // portuguese
  8: 'In dëser Lëscht definéiert Dir déi Déngschtleeschtungen, déi Dir op Är Websäit ubitt. Këmmt Iech ëm d\'Benennung; se soll kommerziell sinn.'  // luxembourgish
};


C_XL.d['bp_bprefs_products'] = { 
  0: 'This is where you enter the list of products you sell in your establishment.<br/>To subdivide them into categories, define colors and patterns on the "Colors" tab in Settings and Preferences.', // english
  1: 'C\'est ici que vous renseignez la liste des produits que vous vendez dans votre établissement.<br/>Pour les subdiviser en catégories, définissez des couleurs et motifs sur l\'onglet Couleurs des réglages et préférences.', // french
  2: 'Tutaj wpisujesz listę produktów sprzedawanych w Twoim zakładzie.<br/>Aby je podzielić na kategorie, zdefiniuj kolory i wzory na karcie "Kolory" w ustawieniach i preferencjach.', // polish
  3: 'Hier vult u de lijst in met de producten die u in uw bedrijf verkoopt.<br/>Om ze in categorieën te verdelen, stelt u kleuren en patronen in op het tabblad "Kleuren" in Instellingen en Voorkeuren.', // dutch
  4: 'Hier geben Sie die Liste der Produkte ein, die Sie in Ihrem Betrieb verkaufen.<br/>Um sie in Kategorien zu unterteilen, definieren Sie Farben und Muster im Reiter "Farben" in den Einstellungen und Präferenzen.', // german
  5: 'Qui inserisci l\'elenco dei prodotti che vendi nel tuo stabilimento.<br/>Per suddividerli in categorie, definisci colori e modelli nella scheda "Colori" delle Impostazioni e Preferenze.', // italian
  6: 'Es aquí donde ingresas la lista de productos que vendes en tu establecimiento.<br/>Para subdividirlos en categorías, define colores y patrones en la pestaña "Colores" de Configuraciones y Preferencias.', // spanish
  7: 'É aqui que você insere a lista de produtos que vende em seu estabelecimento.<br/>Para subdividi-los em categorias, defina cores e padrões na aba "Cores" das Configurações e Preferências.', // portuguese
  8: 'Hei gitt Dir d\'Lëscht vun de Produkter, déi Dir an Ärem Betribs verkaaft.<br/>Fir se an Kategorien opzedeelen, definéiert Faarwen a Musteren op dem Tab "Faarwen" an de Stellungen a Präferenzen.' // luxembourgish
};


C_XL.d['bp_bprefs_eproducts'] = { 
  0: 'In this section, you define the products that you offer on your website. Choose the naming carefully; it must be commercial.', // english
  1: 'Dans cette section, vous définissez les produits que vous offrez sur votre page web. Soignez la dénomination, elle doit être commerciale.', // french
  2: 'W tej sekcji określasz produkty, które oferujesz na swojej stronie internetowej. Zadbaj o nazewnictwo; musi być komercyjne.', // polish
  3: 'In deze sectie definieert u de producten die u op uw website aanbiedt. Besteed aandacht aan de benaming; deze moet commercieel zijn.', // dutch
  4: 'In diesem Abschnitt definieren Sie die Produkte, die Sie auf Ihrer Webseite anbieten. Achten Sie auf die Bezeichnung; sie muss kommerziell sein.', // german
  5: 'In questa sezione, definisci i prodotti che offri sulla tua pagina web. Cura la denominazione, deve essere commerciale.', // italian
  6: 'En esta sección, defines los productos que ofreces en tu página web. Cuida la denominación; debe ser comercial.', // spanish
  7: 'Nesta seção, você define os produtos que oferece na sua página web. Cuide da denominação; ela deve ser comercial.', // portuguese
  8: 'An dëser Sektioun definéiert Dir déi Produkter, déi Dir op Ärer Websäit ubitt. Këmmt Iech ëm d\'Benennung; se muss kommerziell sinn.' // luxembourgish
};



C_XL.d['bp_bprefs_guidelines'] = { 
	0:'<b>Guidelines for the secretarial team:</b><br/><br/>Once you have created a guidelines folder, you can assign it to an agenda above.<br/><br/>The guidelines appear on the planning when hovering the mouse pointer over an agenda name.<br/><br/>Several agendas may share a common guideline.',	// english
	1:'<b>Directives à destination du secrétariat&nbsp;:</b><br/><br/>Dès que vous avez créé un dossier de directives, vous pouvez l’associer à un agenda ci-dessus.<br/><br/>Les directives apparaissent sur le planning au survol du nom d’un agenda par le pointeur souris.<br/><br/>Plusieurs agendas peuvent partager une directive commune.',	// french
	2:'<b>Wytyczne dla sekretariatu:</b><br/>Po utworzeniu folderu z wytycznymi możesz przypisać go do jednego z powyższych grafików.<br/><br/>Wytyczne pojawiają się w harmonogramie po najechaniu kursorem na nazwę agendy.<br/><br/>Kilka agend może współdzielić te same wytyczne.',	// polish
	3:'<b>Richtlijnen voor het secretariaat:</b><br/><br/>Zodra je een richtlijnmap hebt aangemaakt, kun je die koppelen aan een agenda hierboven.<br/><br/>De richtlijnen verschijnen in de planning wanneer je met de muis over de naam van een agenda gaat.<br/><br/>Meerdere agenda’s kunnen dezelfde richtlijn delen.',	// dutch
	4:'<b>Richtlinien für das Sekretariat:</b><br/><br/>Sobald du einen Richtlinienordner erstellt hast, kannst du ihn einem der obigen Kalender zuordnen.<br/><br/>Die Richtlinien erscheinen im Plan, wenn du mit dem Mauszeiger über einen Kalendarnamen fährst.<br/><br/>Mehrere Kalender können dieselben Richtlinien gemeinsam nutzen.',	// german
	5:'<b>Linee guida per la segreteria:</b><br/><br/>Una volta creato un dossier di linee guida, puoi associarlo a un’agenda qui sopra.<br/><br/>Le linee guida compaiono sul planning quando il puntatore del mouse passa sopra il nome di un’agenda.<br/><br/>Più agende possono condividere la stessa linea guida.',	// italian
	6:'<b>Directrices para el secretariado:</b></b><br/>Una vez creado un dossier de directrices, puedes asignarlo a una agenda de arriba.<br/><br/>Las directrices aparecen en el planning al pasar el cursor sobre el nombre de una agenda.<br/><br/>Varias agendas pueden compartir la misma directriz.',	// spanish
	7:'<b>Diretrizes para a secretaria:</b><br/><br/>Depois de criar uma pasta de diretrizes, podes associá-la a uma agenda acima.<br/><br/>As diretrizes aparecem no planeamento ao passar o cursor sobre o nome de uma agenda.<br/><br/>Várias agendas podem partilhar a mesma diretriz.',	// portuguese
	8:'<b>Richtlinnen fir d\'Sekretariat:</b><br/><br/>Soubal’s du en Dossier mat Richtlinnen ugeluecht hues, kanns du en engem Agenda hei uewen zouweisen.<br/><br/>D’Richtlinnen erschéngen am Plang, wann’s du mam Mauszeiger iwwer den Numm vun engem Agenda gees.<br/><br/>Verschidde Agendae kënnen déi selwecht Richtlinnen deelen.'	// luxembourgish
};



// 		technical 				english:0,				french:1,			polish:2,			dutch:3,		german:4,		italian:5,		spanish:6,		portuguese:7, 	luxembourgish:8

C_XL.d['backprefs-geometry']          = { 0:'geometry', 1:'géométrie', 2:'geometria', 3:'geometrie', 4:'Geometrie', 5:'geometria', 6:'geometría', 7:'geometria', 8:'Geometrie' };
C_XL.d['backprefs-dimensions']        = { 0:'dimensions', 1:'dimensions', 2:'wymiary', 3:'afmetingen', 4:'Abmessungen', 5:'dimensioni', 6:'dimensiones', 7:'dimensões', 8:'Dimensiounen' };
C_XL.d['backprefs-description']       = { 0:'description', 1:'description', 2:'opis', 3:'beschrijving', 4:'Beschreibung', 5:'descrizione', 6:'descripción', 7:'descrição', 8:'Beschreiwung' };
C_XL.d['backprefs-search-assistent']  = { 0:'search assistant', 1:'recherche', 2:'wyszukiwania', 3:'zoekassistent', 4:'Suchassistent', 5:'assistente di ricerca', 6:'asistente de búsqueda', 7:'assistente de pesquisa', 8:'Sichassistent' };



C_XL.d['backprefs-bp-search-assistent'] = {
	0:'This panel defines the options displayed in the search assistant under the heading "Not before". For example, if you select "Six weeks", searches will return availabilities starting from six weeks from now.',
	1:'Ce panneau défini les options qui s\'affichent sur l\'assistant de recherche, sous le Titre "Pas avant". Si vous avez par exemple choisis "Six semaines", vous pouvez déclencher des recherches donnant des disponibilités à partir de "dans six semaines".',
	2:'Panel ten określa opcje wyświetlane w asystencie wyszukiwania pod nagłówkiem "Nie wcześniej niż". Na przykład, jeśli wybierzesz "Sześć tygodni", wyszukiwania będą zwracać dostępności od daty za sześć tygodni.',
	3:'Dit paneel bepaalt de opties die in de zoekassistent worden weergegeven onder de titel "Niet vóór". Als je bijvoorbeeld "Zes weken" kiest, zullen zoekopdrachten beschikbaarheden tonen vanaf over zes weken.',
	4:'Dieses Panel legt die Optionen fest, die im Suchassistenten unter der Überschrift "Nicht vor" angezeigt werden. Wählst du zum Beispiel "Sechs Wochen", liefern Suchanfragen Verfügbarkeiten ab in sechs Wochen.',
	5:'Questo pannello definisce le opzioni visualizzate nell’assistente di ricerca sotto la voce "Non prima di". Ad esempio, se selezioni "Sei settimane", le ricerche mostreranno disponibilità a partire da sei settimane da oggi.',
	6:'Este panel define las opciones que aparecen en el asistente de búsqueda bajo el título "No antes de". Por ejemplo, si seleccionas "Seis semanas", las búsquedas mostrarán disponibilidades dentro de seis semanas.',
	7:'Este painel define as opções apresentadas no assistente de pesquisa sob o título "Não antes de". Por exemplo, se escolher "Seis semanas", as pesquisas mostrarão disponibilidades a partir de daqui a seis semanas.',
	8:'Dëse Panel definéiert d’Optiounen, déi am Sichassistent ënner dem Titel "Net virun" ugewisen ginn. Wann s du z. B. "Sechs Wochen" wiels, weisen d\'Sichresultater Disponibilitéiten ab in sechs Wochen.'
};

C_XL.d['backprefs-options'] = { 
	0:'options',		// english
	1:'options',		// french
	2:'opcje',		// polish
	3:'opties',		// dutch
	4:'Optionen',		// german
	5:'opzioni',		// italian
	6:'opciones',		// spanish
	7:'opções',		// portuguese
	8:'Optionen'		// luxembourgish
};	

C_XL.d['backprefs-business-agendas'] = { 
	0:'main',		// english
	1:'principaux',		// french
	2:'główny',		// polish
	3:'hoofd',		// dutch
	4:'haupt',		// german
	5:'principale',		// italian
	6:'principal',		// spanish
	7:'principal',		// portuguese
	8:'haapt'		// luxembourgish
};

C_XL.d['backprefs-contingent-agendas'] = { // be carefull when translating, that is plural
	0:'contingents',		// english
	1:'contingents',		// french
	2:'kontyngenty',		// polish
	3:'contingenten',		// dutch
	4:'Kontingente',		// german
	5:'contingenti',		// italian
	6:'contingentes',		// spanish
	7:'contingentes',		// portuguese
	8:'Kontingenter'		// luxembourgish
};

C_XL.d['backprefs-optional-agendas'] = { // be carefull when translating, that is plural
	0:'optionals',		// english
	1:'facultatifs',		// french
	2:'opcjonalne',		// polish
	3:'optionelen',		// dutch
	4:'Optionale',		// german
	5:'opzionali',		// italian
	6:'opcionales',		// spanish
	7:'opcionais',		// portuguese
	8:'optional'		// luxembourgish
};


C_XL.d['backprefs-guidelines'] = { 
	0:'guidelines',		// english
	1:'directives',		// french
	2:'wytyczne',		// polish
	3:'richtlijnen',	// dutch
	4:'Richtlinien',	// german
	5:'linee guida',	// italian
	6:'directrices',	// spanish
	7:'diretrizes',		// portuguese
	8:'Richtlinnen'		// luxembourgish
};
C_XL.d['backprefs guidelines not assigned'] = { 
	0:'not assigned',	        // english
	1:'pas assignées',	        // french (féminin pluriel)
	2:'nieprzypisane',	        // polish (plural, neutre utilisé pour “directives” → correct)
	3:'niet toegewezen',        // dutch (forme neutre, pas de genre → identique sing/pluriel)
	4:'nicht zugewiesen',       // german (neutre, forme correcte pour un pluriel)
	5:'non assegnate',	        // italian (féminin pluriel)
	6:'no asignadas',	        // spanish (féminin pluriel)
	7:'não atribuídas',	        // portuguese (féminin pluriel)
	8:'net zougewisen'	        // luxembourgish (forme neutre, identique sing/pluriel)
};




// 		technical 				english:0,				french:1,			polish:2,			dutch:3,		german:4,		italian:5,		spanish:6,		portuguese:7, 	luxembourgish:8
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


C_XL.d['resa-tip-receivables'] = { // (*fb02*)
	0:'receivables if the amount is positive, to be repaid if the amount is negative',				// english:0
	1:'créances si le montant est positif, à rembourser si le montant est négatif', 				// french:1
	2:'należności, jeżeli kwota jest dodatnia, podlegających spłacie, jeżeli kwota jest ujemna', 	// polish:2
	3:'vorderingen als het bedrag positief is, af te lossen als het bedrag negatief is', 			// dutch:3
	4:'Forderungen, wenn der Betrag positiv ist, werden zurückgezahlt, wenn der Betrag negativ ist',// german:4
	5:'crediti se l\'importo è positivo, da rimborsare se l\'importo è negativo', 					// italian:5
	6:'cuentas por cobrar si el monto es positivo, a reembolsar si el monto es negativo', 			// spanish:6
	7:'contas a receber se o valor for positivo, a serem reembolsadas se o valor for negativo', 	// portuguese:7, 	luxembourgish:8	8:'Fuerderungen, wann de Betrag positiv ass, zréckzebezuelen, wann de Betrag negativ ass' 		// luxembourgish:8
};

// M_CCSS

C_XL.d['bp-ccss tag bydefault'] = { 
	0:'this tag will be automatically turned on',	// english:0
	1:'ce tag sera automatiquement allumé', 		// french:1
	2:'ten tag zostanie automatycznie włączony', 	// polish:2
	3:'wordt deze tag automatisch ingeschakeld', 	// dutch:3
	4:'wird dieses Tag automatisch aktiviert',		// german:4
	5:'questo tag verrà attivato automaticamente', 	// italian:5
	6:'esta etiqueta se activará automáticamente.', // spanish:6
	7:'esta tag será ativada automaticamente', 		// portuguese:7, 	luxembourgish:8	8:'Dëse Tag gëtt automatesch ageschalt' 		// luxembourgish:8
};

C_XL.d['bp-ccss color bydefault'] = { 
	0:'this color will be automatically applied',	// english:0
	1:'cette couleur sera automatiquement appliquée', // french:1
	2:'ten kolor zostanie zastosowany automatycznie', // polish:2
	3:'deze kleur wordt automatisch toegepast', 	   // dutch:3
	4:'Diese Farbe wird automatisch angewendet',	   // german:4
	5:'questo colore verrà applicato automaticamente', // italian:5
	6:'este color se aplicará automáticamente', 	   // spanish:6
	7:'esta cor será aplicada automaticamente', 	   // portuguese:7, 	luxembourgish:8	8:'Dës Faarf gëtt automatesch applizéiert' 	   // luxembourgish:8
};

C_XL.d['bp-ccss pattern bydefault'] = { 
	0:'this pattern will be automatically applied',	// english:0
	1:'ce motif sera automatiquement appliqué', 		// french:1
	2:'ten wzór zostanie zastosowany automatycznie', 	// polish:2
	3:'dit patroon wordt automatisch toegepast', 		// dutch:3
	4:'Dieses Muster wird automatisch angewendet',		// german:4
	5:'questo modello verrà applicato automaticamente', // italian:5
	6:'este patrón se aplicará automáticamente', 		// spanish:6
	7:'este padrão será aplicado automaticamente', 		// portuguese:7, 	luxembourgish:8	8:'Dëst Muster gëtt automatesch applizéiert' 		// luxembourgish:8
};
	
	
C_XL.d['ctrlshift_ctrl']	= { 
	0:'Ctrl',	// english
	1:'Ctrl',	// french
	2:'Ctrl',	// polish
	3:'Ctrl',	// dutch
	4:'Ctrl',	// german
	5:'Ctrl',	// italian
	6:'Ctrl', 	// spanish
	7:'Ctrl',	// portuguese
	8:'Ctrl'	// luxembourgish
};	

C_XL.d['ctrlshift_shift']	= { 
	0:'Shift',	// english
	1:'Shift',	// french
	2:'Shift',	// polish
	3:'Shift',	// dutch
	4:'Shift',	// german
	5:'Shift',	// italian
	6:'Shift', 	// spanish
	7:'Shift',	// portuguese
	8:'Shift'	// luxembourgish
};	


// traductions genrées

C_XL.d['this_masculin'] = {
  0: 'this',        // english
  1: 'ce',          // french (masc)
  2: 'ten',         // polish (masc accusative)
  3: 'deze',        // dutch
  4: 'dieser',      // german (masc nominative)
  5: 'questo',      // italian (masc)
  6: 'este',        // spanish (masc)
  7: 'este',        // portuguese (masc)
  8: 'dësen'        // luxembourgish (masc)
};

C_XL.d['this_feminin'] = {
  0: 'this',        // english
  1: 'cette',       // french (fem)
  2: 'tę',          // polish (fem accusative)
  3: 'deze',        // dutch (same for m/f)
  4: 'diese',       // german (fem nominative)
  5: 'questa',      // italian (fem)
  6: 'esta',        // spanish (fem)
  7: 'esta',        // portuguese (fem)
  8: 'dës'          // luxembourgish (fem)
};


C_XL.d['one_masc'] = {
  0:'a',        // english
  1:'un',       // french
  2:'jeden',    // polish (masc accusative: "przypisać jeden kolor")
  3:'een',      // dutch
  4:'einen',    // german (masc accusative: "einen Termin" style; for noun later)
  5:'un',       // italian
  6:'un',       // spanish
  7:'um',       // portuguese
  8:'een'       // luxembourgish
};

C_XL.d['one_fem'] = {
  0:'a',        // english
  1:'une',      // french
  2:'jedną',    // polish (fem accusative)
  3:'een',      // dutch
  4:'eine',     // german (fem)
  5:'una',      // italian
  6:'una',      // spanish
  7:'uma',      // portuguese
  8:'eng'       // luxembourgish
};






C_XL.d['bp_ctrlshift_none']	= { 
	0:'You can assign a $cssType$ to an appointment by simply Shift-clicking, Ctrl-clicking, or Ctrl+Shift-clicking the planning item. This works both in the planning view and in the results table of "Filter and find".',	// english
	1:'Il est possible d\'assigner un $cssType$ à un rendez-vous en faisant simplement un Shift+Clic / ou Ctrl+Clic / ou Ctrl+Shift+Clic sur l’élément du planning. Ceci fonctionne lorsque vous êtes en vue planning et aussi dans le tableau de résultat du "Filtrer et trouver".',	// french
	2:'Możesz przypisać $cssType$ do wizyty, po prostu klikając element planowania z wciśniętym Shift, Ctrl lub Ctrl+Shift. Działa to zarówno w widoku planowania, jak i w tabeli wyników "Filtruj i znajdź".',	// polish
	3:'Je kunt een $cssType$ aan een afspraak toewijzen door het planningsitem eenvoudigweg te Shift-klikken, Ctrl-klikken of Ctrl+Shift-klikken. Dit werkt zowel in de planningsweergave als in de resultaattabel van "Filteren en vinden".',	// dutch
	4:'Sie können einem Termin einen $cssType$ zuweisen, indem Sie das Planungselement einfach mit Shift-Klick, Ctrl-Klick oder Ctrl+Shift-Klick anklicken. Dies funktioniert sowohl in der Planungsansicht als auch in der Ergebnistabelle von "Filtern und finden".',	// german
	5:'Puoi assegnare un $cssType$ a un appuntamento semplicemente facendo clic sull’elemento di pianificazione con Shift, Ctrl o Ctrl+Shift. Funziona sia nella vista di pianificazione sia nella tabella dei risultati di "Filtra e trova".',	// italian
	6:'Puedes asignar un $cssType$ a una cita simplemente haciendo clic en el elemento de planificación con Shift, Ctrl o Ctrl+Shift. Esto funciona tanto en la vista de planificación como en la tabla de resultados de "Filtrar y encontrar".', 	// spanish
	7:'Pode atribuir um $cssType$ a um compromisso simplesmente clicando no item de planeamento com Shift, Ctrl ou Ctrl+Shift. Isto funciona tanto na vista de planeamento como na tabela de resultados de "Filtrar e encontrar".',	// portuguese
	8:'Du kanns engem Rendez-vous e $cssType$ zouweisen, andeems s du den Element am Plang einfach mat Shift-Klick, Ctrl-Klick oder Ctrl+Shift-Klick uklicks. Dëst funktionéiert souwuel an der Plangungsvisioun wéi och an der Resultattabell vun "Filteren an fannen".'	// luxembourgish
};	

C_XL.d['bp_ctrlshift_ctrl']	= { 
	0:'When clicking an appointment while holding the <b>Ctrl</b> key, this $cssType$ will be applied to the appointment.',	// english
	1:'Lors d’un clic sur un rendez-vous en maintenant la touche <b>Ctrl</b>, ce $cssType$ sera appliqué au rendez-vous.',	// french
	2:'Klikając wizytę przytrzymując klawisz <b>Ctrl</b>, ten $cssType$ zostanie zastosowany do wizyty.',	// polish
	3:'Wanneer je op een afspraak klikt terwijl je de <b>Ctrl</b>-toets ingedrukt houdt, wordt deze $cssType$ op de afspraak toegepast.',	// dutch
	4:'Wenn man einen Termin anklickt und dabei die <b>Ctrl</b>-Taste gedrückt hält, wird dieser $cssType$ auf den Termin angewendet.',	// german
	5:'Quando si fa clic su un appuntamento tenendo premuto il tasto <b>Ctrl</b>, questo $cssType$ verrà applicato all’appuntamento.',	// italian
	6:'Al hacer clic en una cita mientras se mantiene pulsada la tecla <b>Ctrl</b>, este $cssType$ se aplicará a la cita.', 	// spanish
	7:'Ao clicar num compromisso mantendo a tecla <b>Ctrl</b> pressionada, este $cssType$ será aplicado ao compromisso.',	// portuguese
	8:'Wann een op e Rendez-vous klickt a gläichzäiteg d’<b>Ctrl</b>-Tast gedréckt hält, gëtt dëse $cssType$ op de Rendez-vous applizéiert.'	// luxembourgish
};	

C_XL.d['bp_ctrlshift_shift']	= { 
	0:'When clicking an appointment while holding the <b>Shift</b> key, this $cssType$ will be applied to the appointment.',	// english
	1:'Lors d’un clic sur un rendez-vous en maintenant la touche <b>Shift</b>, ce $cssType$ sera appliqué au rendez-vous.',	// french
	2:'Klikając wizytę przytrzymując klawisz <b>Shift</b>, ten $cssType$ zostanie zastosowany do wizyty.',	// polish
	3:'Wanneer je op een afspraak klikt terwijl je de <b>Shift</b>-toets ingedrukt houdt, wordt deze $cssType$ op de afspraak toegepast.',	// dutch
	4:'Wenn man einen Termin anklickt und dabei die <b>Shift</b>-Taste gedrückt hält, wird dieser $cssType$ auf den Termin angewendet.',	// german
	5:'Quando si fa clic su un appuntamento tenendo premuto il tasto <b>Shift</b>, questo $cssType$ verrà applicato all’appuntamento.',	// italian
	6:'Al hacer clic en una cita mientras se mantiene pulsada la tecla <b>Shift</b>, este $cssType$ se aplicará a la cita.', 	// spanish
	7:'Ao clicar num compromisso mantendo a tecla <b>Shift</b> pressionada, este $cssType$ será aplicado ao compromisso.',	// portuguese
	8:'Wann een op e Rendez-vous klickt a gläichzäiteg d’<b>Shift</b>-Tast gedréckt hält, gëtt dëse $cssType$ op de Rendez-vous applizéiert.'	// luxembourgish
};	

C_XL.d['bp_ctrlshift_ctrlshift']	= { 
	0:'When clicking an appointment while holding both <b>Ctrl and Shift</b> keys, this $cssType$ will be applied to the appointment.',	// english
	1:'Lors d’un clic sur un rendez-vous en maintenant simultanément les touches <b>Ctrl et Shift</b>, ce $cssType$ sera appliqué au rendez-vous.',	// french
	2:'Klikając wizytę przytrzymując jednocześnie klawisze <b>Ctrl i Shift</b>, ten $cssType$ zostanie zastosowany do wizyty.',	// polish
	3:'Wanneer je op een afspraak klikt terwijl je zowel de <b>Ctrl- als Shift</b>-toets ingedrukt houdt, wordt deze $cssType$ toegepast.',	// dutch
	4:'Wenn man einen Termin anklickt und dabei sowohl die <b>Ctrl- als auch die Shift</b>-Taste gedrückt hält, wird dieser $cssType$ auf den Termin angewendet.',	// german
	5:'Quando si fa clic su un appuntamento tenendo premuti entrambi i tasti <b>Ctrl e Shift</b>, questo $cssType$ verrà applicato all’appuntamento.',	// italian
	6:'Al hacer clic en una cita mientras se mantienen pulsadas las teclas <b>Ctrl y Shift</b>, este $cssType$ se aplicará a la cita.', 	// spanish
	7:'Ao clicar num compromisso mantendo pressionadas as teclas <b>Ctrl e Shift</b>, este $cssType$ será aplicado ao compromisso.',	// portuguese
	8:'Wann een op e Rendez-vous klickt a gläichzäiteg d’<b>Ctrl an Shift</b>-Tasten gedréckt hält, gëtt dëse $cssType$ op de Rendez-vous applizéiert.'	// luxembourgish
};	

// color being maculin or feminin depending on the language, we have a separate translation for _color

C_XL.d['bp_ctrlshift_none_color'] = { 
  0:'You can assign a color to an appointment by simply Shift-clicking, Ctrl-clicking, or Ctrl+Shift-clicking the planning item. This works both in the planning view and in the results table of "Filter and find".', // english
  1:'Il est possible d\'assigner une couleur à un rendez-vous en faisant simplement un Shift+Clic / ou Ctrl+Clic / ou Ctrl+Shift+Clic sur l’élément du planning. Ceci fonctionne lorsque vous êtes en vue planning et aussi dans le tableau de résultat du "Filtrer et trouver".', // french
  2:'Możesz przypisać kolor do wizyty, po prostu klikając element planowania z wciśniętym Shift, Ctrl lub Ctrl+Shift. Działa to zarówno w widoku planowania, jak i w tabeli wyników "Filtruj i znajdź".', // polish
  3:'Je kunt een kleur aan een afspraak toewijzen door het planningsitem eenvoudigweg te Shift-klikken, Ctrl-klikken of Ctrl+Shift-klikken. Dit werkt zowel in de planningsweergave als in de resultaattabel van "Filteren en vinden".', // dutch
  4:'Sie können einem Termin eine Farbe zuweisen, indem Sie das Planungselement einfach mit Shift-Klick, Ctrl-Klick oder Ctrl+Shift-Klick anklicken. Dies funktioniert sowohl in der Planungsansicht als auch in der Ergebnistabelle von "Filtern und finden".', // german
  5:'Puoi assegnare un colore a un appuntamento semplicemente facendo clic sull’elemento di pianificazione con Shift, Ctrl o Ctrl+Shift. Funziona sia nella vista di pianificazione sia nella tabella dei risultati di "Filtra e trova".', // italian
  6:'Puedes asignar un color a una cita simplemente haciendo clic en el elemento de planificación con Shift, Ctrl o Ctrl+Shift. Esto funciona tanto en la vista de planificación como en la tabla de resultados de "Filtrar y encontrar".', // spanish
  7:'Pode atribuir uma cor a um compromisso simplesmente clicando no item de planeamento com Shift, Ctrl ou Ctrl+Shift. Isto funciona tanto na vista de planeamento como na tabela de resultados de "Filtrar e encontrar".', // portuguese
  8:'Du kanns eng Faarf engem Rendez-vous zouweisen, andeems s du den Element am Plang einfach mat Shift-Klick, Ctrl-Klick oder Ctrl+Shift-Klick uklicks. Dëst funktionéiert souwuel an der Plangungsvisioun wéi och an der Resultattabell vun "Filteren an fannen".' // luxembourgish
};

C_XL.d['bp_ctrlshift_ctrl_color'] = { 
  0:'When clicking an appointment while holding the <b>Ctrl</b> key, this color will be applied to the appointment.', // english
  1:'Lors d’un clic sur un rendez-vous en maintenant la touche <b>Ctrl</b>, cette couleur sera appliquée au rendez-vous.', // french
  2:'Klikając wizytę przytrzymując klawisz <b>Ctrl</b>, ten kolor zostanie zastosowany do wizyty.', // polish
  3:'Wanneer je op een afspraak klikt terwijl je de <b>Ctrl</b>-toets ingedrukt houdt, wordt deze kleur op de afspraak toegepast.', // dutch
  4:'Wenn man einen Termin anklickt und dabei die <b>Ctrl</b>-Taste gedrückt hält, wird diese Farbe auf den Termin angewendet.', // german
  5:'Quando si fa clic su un appuntamento tenendo premuto il tasto <b>Ctrl</b>, questo colore verrà applicato all’appuntamento.', // italian
  6:'Al hacer clic en una cita mientras se mantiene pulsada la tecla <b>Ctrl</b>, este color se aplicará a la cita.', // spanish
  7:'Ao clicar num compromisso mantendo a tecla <b>Ctrl</b> pressionada, esta cor será aplicada ao compromisso.', // portuguese
  8:'Wann een op e Rendez-vous klickt a gläichzäiteg d’<b>Ctrl</b>-Tast gedréckt hält, gëtt dës Faarf op de Rendez-vous applizéiert.' // luxembourgish
};

C_XL.d['bp_ctrlshift_shift_color'] = { 
  0:'When clicking an appointment while holding the <b>Shift</b> key, this color will be applied to the appointment.', // english
  1:'Lors d’un clic sur un rendez-vous en maintenant la touche <b>Shift</b>, cette couleur sera appliquée au rendez-vous.', // french
  2:'Klikając wizytę przytrzymując klawisz <b>Shift</b>, ten kolor zostanie zastosowany do wizyty.', // polish
  3:'Wanneer je op een afspraak klikt terwijl je de <b>Shift</b>-toets ingedrukt houdt, wordt deze kleur op de afspraak toegepast.', // dutch
  4:'Wenn man einen Termin anklickt und dabei die <b>Shift</b>-Taste gedrückt hält, wird diese Farbe auf den Termin angewendet.', // german
  5:'Quando si fa clic su un appuntamento tenendo premuto il tasto <b>Shift</b>, questo colore verrà applicato all’appuntamento.', // italian
  6:'Al hacer clic en una cita mientras se mantiene pulsada la tecla <b>Shift</b>, este color se aplicará a la cita.', // spanish
  7:'Ao clicar num compromisso mantendo a tecla <b>Shift</b> pressionada, esta cor será aplicada ao compromisso.', // portuguese
  8:'Wann een op e Rendez-vous klickt a gläichzäiteg d’<b>Shift</b>-Tast gedréckt hält, gëtt dës Faarf op de Rendez-vous applizéiert.' // luxembourgish
};

C_XL.d['bp_ctrlshift_ctrlshift_color'] = { 
  0:'When clicking an appointment while holding both <b>Ctrl and Shift</b> keys, this color will be applied to the appointment.', // english
  1:'Lors d’un clic sur un rendez-vous en maintenant simultanément les touches <b>Ctrl et Shift</b>, cette couleur sera appliquée au rendez-vous.', // french
  2:'Klikając wizytę przytrzymując jednocześnie klawisze <b>Ctrl i Shift</b>, ten kolor zostanie zastosowany do wizyty.', // polish
  3:'Wanneer je op een afspraak klikt terwijl je zowel de <b>Ctrl- als Shift</b>-toets ingedrukt houdt, wordt deze kleur op de afspraak toegepast.', // dutch
  4:'Wenn man einen Termin anklickt und dabei sowohl die <b>Ctrl- als auch die Shift</b>-Taste gedrückt hält, wird diese Farbe auf den Termin angewendet.', // german
  5:'Quando si fa clic su un appuntamento tenendo premuti entrambi i tasti <b>Ctrl e Shift</b>, questo colore verrà applicato all’appuntamento.', // italian
  6:'Al hacer clic en una cita mientras se mantienen pulsadas las teclas <b>Ctrl y Shift</b>, este color se aplicará a la cita.', // spanish
  7:'Ao clicar num compromisso mantendo pressionadas as teclas <b>Ctrl e Shift</b>, esta cor será aplicada ao compromisso.', // portuguese
  8:'Wann een op e Rendez-vous klickt a gläichzäiteg d’<b>Ctrl an Shift</b>-Tasten gedréckt hält, gëtt dës Faarf op de Rendez-vous applizéiert.' // luxembourgish
};





C_XL.d['ctrlshift no interactivity title']	= { 
	0:'There is no interactivity yet associated with <b>$ctrlshift$ + Click</b> on an appointment',	// english
	1:'Il n\'y a pas encore d\'interactivité associée à un <b>$ctrlshift$ + Clic</b> sur un rendez-vous',	// french
	2:'Nie ma jeszcze interaktywności powiązanej z <b>$ctrlshift$ + kliknięciem</b> na wizycie',	// polish
	3:'Er is nog geen interactiviteit gekoppeld aan <b>$ctrlshift$ + klik</b> op een afspraak',	// dutch
	4:'Es gibt noch keine Interaktivität im Zusammenhang mit <b>$ctrlshift$ + Klick</b> auf einen Termin',	// german
	5:'Non esiste ancora alcuna interattività associata a <b>$ctrlshift$ + clic</b> su un appuntamento',	// italian
	6:'Aún no hay interactividad asociada a <b>$ctrlshift$ + clic</b> en una cita', 	// spanish
	7:'Ainda não existe interatividade associada a <b>$ctrlshift$ + clique</b> num compromisso',	// portuguese
	8:'Et gëtt nach keng Interaktivitéit am Zesummenhang mat <b>$ctrlshift$ + Klick</b> op e Rendez-vous'	// luxembourgish
};	

C_XL.d['ctrlshift no interactivity yet']	= { 
	0:'You can apply a color, a pattern, or a tag to this appointment with a single click.<br/>To associate this action with <b>$ctrlshift$ + Click</b>, go to Settings and Preferences, open the "Colors" tab, and select the color, pattern, or tag you want to activate.<br/>See the $keyboard$ tab there.',	// english
	1:'Vous pouvez appliquer en un clic une couleur, un motif, ou un tag à ce RDV.<br/>Pour associer cette action à un <b>$ctrlshift$ + Clic</b>, passez dans les réglages et préférences sur l\'onglet "Couleurs" et séléctionnez la couleur, le motif ou le tag que vous souhaitez activer.<br/>Voyez là l\'onglet $keyboard$ clavier.',	// french
	2:'Możesz jednym kliknięciem zastosować kolor, wzór lub tag do tej wizyty.<br/>Aby powiązać tę akcję z <b>$ctrlshift$ + kliknięciem</b>, przejdź do Ustawień i Preferencji, otwórz kartę "Kolory" i wybierz kolor, wzór lub tag, który chcesz aktywować.<br/>Zobacz tam kartę $keyboard$.',	// polish
	3:'Je kunt met één klik een kleur, een patroon of een tag op deze afspraak toepassen.<br/>Om deze actie te koppelen aan <b>$ctrlshift$ + klik</b>, ga naar Instellingen en Voorkeuren, open het tabblad "Kleuren" en selecteer de kleur, het patroon of de tag die je wilt activeren.<br/>Bekijk daar het tabblad $keyboard$.',	// dutch
	4:'Mit einem einzigen Klick können Sie diesem Termin eine Farbe, ein Muster oder ein Tag zuweisen.<br/>Um diese Aktion mit <b>$ctrlshift$ + Klick</b> zu verknüpfen, gehen Sie zu Einstellungen und Präferenzen, öffnen Sie den Tab "Farben" und wählen Sie die Farbe, das Muster oder das Tag aus, das Sie aktivieren möchten.<br/>Sehen Sie dort im Tab $keyboard$ nach.',	// german
	5:'Puoi applicare un colore, un motivo o un tag a questo appuntamento con un solo clic.<br/>Per associare questa azione a <b>$ctrlshift$ + clic</b>, vai su Impostazioni e Preferenze, apri la scheda "Colori" e seleziona il colore, il motivo o il tag che desideri attivare.<br/>Consulta lì la scheda $keyboard$.',	// italian
	6:'Puedes aplicar un color, un patrón o un tag a esta cita con un solo clic.<br/>Para asociar esta acción a <b>$ctrlshift$ + clic</b>, ve a Ajustes y Preferencias, abre la pestaña "Colores" y selecciona el color, el patrón o el tag que deseas activar.<br/>Consulta allí la pestaña $keyboard$.', 	// spanish
	7:'Pode aplicar uma cor, um padrão ou um tag a este compromisso com um único clique.<br/>Para associar esta ação a <b>$ctrlshift$ + clique</b>, vá a Definições e Preferências, abra o separador "Cores" e selecione a cor, o padrão ou o tag que pretende ativar.<br/>Veja aí o separador $keyboard$.',	// portuguese
	8:'Du kanns mat engem eenzege Klick eng Faarf, e Muster oder e Tag op dëse Rendez-vous uwenden.<br/>Fir dës Aktioun un <b>$ctrlshift$ + Klick</b> ze bannen, ginn op Astellungen a Preferenzen, öffne de Tab "Faarwen" a wielt déi Faarf, dat Muster oder dat Tag, dat s du wëlls aktivéieren.<br/>Kuck do de Tab $keyboard$.'	// luxembourgish
};	



C_XL.d['when new appointment'] = { 
	0:'when creating a new appointment',	// english:0
	1:'lors de la création d\'un nouveau rendez-vous', 	// french:1
	2:'podczas tworzenia nowego spotkania', 	// polish:2
	3:'bij het maken van een nieuwe afspraak', 	// dutch:3
	4:'beim Anlegen eines neuen Termins',	// german:4
	5:'quando si crea un nuovo appuntamento', 	// italian:5
	6:'al crear una nueva cita', 	// spanish:6
	7:'ao criar um novo compromisso', 	// portuguese:7, 	luxembourgish:8	8:'beim Schafen vun engem neie Rendez-vous' 	// luxembourgish:8
};

C_XL.d['when new offday'] = { 
	0:'when creating a new unavailability',		// english:0
	1:'lors de la création d\'une nouvelle indisponibilité', 	// french:1
	2:'podczas tworzenia nowej niedostępności', 	// polish:2
	3:'bij het aanmaken van een nieuwe onbeschikbaarheid', 	// dutch:3
	4:'beim Erstellen einer neuen Nichtverfügbarkeit',	// german:4
	5:'quando si crea una nuova indisponibilità', 	// italian:5
	6:'al crear una nueva indisponibilidad', 	// spanish:6
	7:'ao criar uma nova indisponibilidade', 	// portuguese:7, 	luxembourgish:8	8:'beim Schafen vun enger neier Onverfügbarkeet' 	// luxembourgish:8
};

C_XL.d['when new visitor'] = { 
	0:'when recording a new visitor',	// english:0 // 'visitor' intentionally left, the C_XL.w() will turn it into 'patient', 'client', 'participant', ... 
	1:'à l\'enregistrement d\'un nouveau visitor', 	// french:1
	2:'podczas rejestracji nowego visitor', 	// polish:2
	3:'bij het registreren van een nieuwe visitor', 	// dutch:3
	4:'bei der Registrierung eines neuen visitor',	// german:4
	5:'quando si registra un nuovo visitor', 	// italian:5
	6:'al registrar un nuevo visitor', 	// spanish:6
	7:'ao registrar um novo visitor', 	// portuguese:7, 	luxembourgish:8	8:'bei der Umeldung vun engem neie Visiteur' 	// luxembourgish:8
};

C_XL.d['when new note'] = { 
	0:'when writing a new note',	// english:0
	1:'à la rédaction d\'une nouvelle note', 	// french:1
	2:'podczas pisania nowej notatki', 	// polish:2
	3:'bij het schrijven van een nieuwe notitie', 	// dutch:3
	4:'beim Schreiben einer neuen Notiz',	// german:4
	5:'quando si scrive una nuova nota', 	// italian:5
	6:'al escribir una nueva nota', 	// spanish:6
	7:'ao escrever uma nova nota', 	// portuguese:7, 	luxembourgish:8	8:'beim Schreiwen vun enger neier Notiz' 	// luxembourgish:8
};

C_XL.d['when new task'] = {
	0:'when establishing a new task',	// english:0
	1:'à l\'établissement d\'une nouvelle tâche', 	// french:1
	2:'przy ustalaniu nowego zadania', 	// polish:2
	3:'bij het vaststellen van een nieuwe taak', 	// dutch:3
	4:'beim Erstellen einer neuen Aufgabe',	// german:4
	5:'quando si stabilisce un nuovo compito', 	// italian:5
	6:'al establecer una nueva tarea', 	// spanish:6
	7:'ao estabelecer uma nova tarefa', 	// portuguese:7, 	luxembourgish:8	8:'beim Opstelle vun enger neier Aufgab' 	// luxembourgish:8
};

C_XL.d['when new chat'] = {
	0:'when starting a new chat',	// english:0
	1:'au démarage d\'un nouveau chat', 	// french:1
	2:'podczas rozpoczynania nowego czatu', 	// polish:2
	3:'bij het starten van een nieuwe chat', 	// dutch:3
	4:'beim Starten eines neuen Chats',	// german:4
	5:'quando si avvia una nuova chat', 	// italian:5
	6:'al iniciar un nuevo chat', 	// spanish:6
	7:'ao iniciar um novo chat', 	// portuguese:7, 	luxembourgish:8	8:'beim Ufank vun engem neie Chat' 	// luxembourgish:8
};

C_XL.d['when new file'] = {
	0:'at new file upload',	// english:0
	1:'à la création d\'un nouveau fichier', 	// french:1
	2:'podczas zapisywania nowego pliku', 	// polish:2
	3:'bij het opslaan van een nieuw bestand', 	// dutch:3
	4:'beim Speichern einer neuen Datei',	// german:4
	5:'quando si salva un nuovo file', 	// italian:5
	6:'al guardar un nuevo archivo', 	// spanish:6
	7:'ao salvar um novo arquivo', 	// portuguese:7, 	luxembourgish:8	8:'bei der Erhiewung vun enger neier Datei' 	// luxembourgish:8
};

C_XL.d['when new product'] = { 0:'each time a new product is created',	// english
	1:'à chaque fois qu\'un nouveau produit est créé',	// french
	2:'za każdym razem, gdy nowy produkt jest tworzony',	// polish
	3:'elke keer dat een nieuw product wordt aangemaakt',	// dutch
	4:'jedes Mal, wenn ein neues Produkt erstellt wird',	// german
	5:'ogni volta che viene creato un nuovo prodotto',	// italian
	6:'cada vez que se crea un nuevo producto', 	// spanish
	7:'cada vez que um novo produto é criado',	// portuguese
	8:'all kéier wann e neit Produkt erstallt gëtt'	// luxembourgish
};



	/*        M_details      */
	

C_XL.d['bp1 m-details'] = { 
	0:'Here you can choose the information displayed on the schedule in the appointment labels, for ',	// english
	1:'Vous pouvez choisir ici les informations qui s\'affichent sur le planning dans les étiquettes de RDV, pour les ',	// french
	2:'Tutaj możesz wybrać informacje wyświetlane w harmonogramie w etykietach wizyt dla ',	// polish
	3:'Hier kunt u de informatie kiezen die op het schema wordt weergegeven in de afspraaklabels, voor ',	// dutch
	4:'Hier können Sie die Informationen auswählen, die auf dem Terminplan in den Terminetiketten angezeigt werden sollen für ',	// german
	5:'Qui puoi scegliere le informazioni visualizzate sul programma nelle etichette degli appuntamenti, per i ',	// italian
	6:'Aquí podrás elegir la información que se muestra en el cronograma en las etiquetas de citas, para ', 	// spanish
	7:'Aqui você pode escolher as informações exibidas na agenda nas etiquetas de consulta, para ',	// portuguese
	8:'Hei kënnt Dir d\'Informatiounen auswielen, déi am Kalenner an den Rendez-vous Etiketten ugewise ginn, fir '	// luxembourgish
};

C_XL.d['bp2 m-details'] = { 
	0:'This setting is saved with your login, so you recover it the next time you log in. You can share this setting with one (or more) colleague(s), by selecting them before saving on the “users” tab',	// english
	1:'Ce réglage est enregistré avec votre login, vous le récupérez donc à la prochaine connexion. Il est possible de partager ce réglage avec un (ou des) collègue(s), en le(s) sélectionnant avant d\'enregistrer sur l\'onglet "utilisateurs"',	// french
	2:'To ustawienie jest zapisywane wraz z Twoim loginem, więc możesz je odzyskać przy następnym logowaniu. Możesz udostępnić to ustawienie jednemu (lub większej liczbie) współpracownikom, wybierając je przed zapisaniem w zakładce „użytkownicy”.',	// polish
	3:'Deze instelling wordt samen met uw login opgeslagen, zodat u deze de volgende keer dat u inlogt, kunt herstellen. U kunt deze instelling delen met één (of meer) collega(\'s), door deze te selecteren voordat u opslaat op het tabblad "gebruikers"',	// dutch
	4:'Diese Einstellung wird mit Ihrer Anmeldung gespeichert, sodass Sie sie bei der nächsten Anmeldung wiederherstellen können. Sie können diese Einstellung mit einem (oder mehreren) Kollegen teilen, indem Sie sie vor dem Speichern auf der Registerkarte „Benutzer“ auswählen',	// german
	5:'Questa impostazione viene salvata con il tuo login, quindi la recupererai al prossimo accesso. Puoi condividere questa impostazione con uno (o più) colleghi, selezionandola prima di salvare nella scheda “utenti”.',	// italian
	6:'Esta configuración se guarda con su inicio de sesión, por lo que la recuperará la próxima vez que inicie sesión. Puede compartir esta configuración con uno (o más) colegas, seleccionándola antes de guardarla en la pestaña "usuarios".', 	// spanish
	7:'Essa configuração é salva com o seu login, para que você a recupere na próxima vez que fizer login. Você pode compartilhar esta configuração com um (ou mais) colegas, selecionando-a antes de salvar na aba “usuários”',	// portuguese
	8:'Dës Astellung gëtt mat Ärem Login gespäichert, sou datt Dir se bei Ärer nächster Umeldung erëmkréie kënnt. Dir kënnt dës Astellung mat engem (oder méi) Kolleg(en) deelen, andeems Dir se auswielt, ier Dir am Tab „Benotzer“ späichert.'	// luxembourgish
};

C_XL.d['bp3 m-details'] = { 
	0:'Here you can change the display order of the calendar lines by dragging the labels vertically with the mouse.',	// english
	1:'Vous pouvez changer ici l\'ordre d\'affichage des lignes d\'agenda en déplaçant verticalement les étiquettes avec la souris.',	// french
	2:'Tutaj możesz zmienić kolejność wyświetlania linii kalendarza, przesuwając etykiety w pionie za pomocą myszy.',	// polish
	3:'Hier kunt u de weergavevolgorde van de kalenderregels wijzigen door de labels met de muis verticaal te verplaatsen.',	// dutch
	4:'Hier können Sie die Anzeigereihenfolge der Kalenderzeilen ändern, indem Sie die Beschriftungen mit der Maus vertikal verschieben.',	// german
	5:'Qui puoi modificare l\'ordine di visualizzazione delle righe del calendario spostando le etichette verticalmente con il mouse.',	// italian
	6:'Aquí puede cambiar el orden de visualización de las líneas del calendario moviendo las etiquetas verticalmente con el mouse.', 	// spanish
	7:'Aqui você pode alterar a ordem de exibição das linhas do calendário movendo os rótulos verticalmente com o mouse.',	// portuguese
	8:'Hei kënnt Dir d\'Uweise-Reiefolleg vun de Kalennerlinnen änneren, andeems Dir d\'Etiketten mat der Maus vertikal verschäift.'	// luxembourgish
};

C_XL.d['bp4 m-details'] = { 
	0:'When saving this form, you will share your settings with the users selected here',			
	1:'Lors de l\'enregistrement de cette fiche, vous partagerez vos réglages avec les utilisateurs sélectionés ici',			
	2:'Zapisując ten formularz, udostępnisz swoje ustawienia wybranym tutaj użytkownikom',	
	3:'Wanneer u dit formulier opslaat, deelt u uw instellingen met de hier geselecteerde gebruikers',	
	4:'Beim Speichern dieses Formulars teilen Sie Ihre Einstellungen mit den hier ausgewählten Benutzern',
	5:'Quando salvi questo modulo, condividerai le tue impostazioni con gli utenti selezionati qui',	
	6:'Al guardar este formulario, compartirá su configuración con los usuarios seleccionados aquí', 
	7:'Ao salvar este formulário, você compartilhará suas configurações com os usuários selecionados aqui', 
	8:'Wann Dir dëse Formulaire späichert, deelt Dir Är Astellungen mat de Benotzer, déi hei ausgewielt sinn.'	// luxembourgish
};

C_XL.d['bp5 m-details'] = { 
	0:'In the weekly view, only the days selected here will be displayed.<br/>For example, if you never work on Sunday, you can uncheck Sunday.',	// english		
	1:'Dans la vue hebdomadaire, seuls les journées sélectionnées ici seront affichées.<br/>Par exemple, si vous ne travaillez jamais le dimanche, vous pouvez décocher le dimanche.',			
	2:'W widoku tygodniowym zostaną wyświetlone tylko wybrane tutaj dni.<br/>Na przykład, jeśli nigdy nie pracujesz w niedzielę, możesz odznaczyć opcję Niedziela.',		// polish
	3:'In de weekweergave worden alleen de hier geselecteerde dagen weergegeven.<br/>Als je bijvoorbeeld nooit op zondag werkt, kun je zondag uitvinken.', 	// dutch
	4:'In der Wochenansicht werden nur die hier ausgewählten Tage angezeigt. Wenn Sie beispielsweise sonntags nie arbeiten, können Sie Sonntag deaktivieren.',	// german
	5:'Nella visualizzazione settimanale verranno visualizzati solo i giorni qui selezionati.<br/>Se ad esempio non lavori mai di domenica, puoi deselezionare Domenica.',	// italian
	6:'En la vista semanal, solo se mostrarán los días seleccionados aquí.<br/>Por ejemplo, si nunca trabaja el domingo, puede desmarcar el domingo.', 	// spanish
	7:'Na visualização semanal, apenas os dias aqui selecionados serão exibidos.<br/>Por exemplo, se você nunca trabalha no domingo, pode desmarcar domingo.', 	// portuguese
	8:'An der Wochenuewersiicht ginn nëmmen d\'Deeg gewisen, déi hei ausgewielt sinn.<br/>Zum Beispill, wann Dir ni Sonndes schafft, kënnt Dir de Sonndeg desaktivéieren.'	// luxembourgish
};
	
	
	/*        C_catalyst      */
	
	
	
	
// 		technical 						english:0,			french:1,			polish:2,			dutch:3,			german:4,			italian:5,			spanish:6,		portuguese:7, 	luxembourgish:8
C_XL.d['resa-csv-cash'] = { 0:'cash', 1:'espèce', 2:'gotówka', 3:'contant', 4:'Kasse', 5:'contanti', 6:'dinero', 7:'dinheiro', 8:'Boergeld' };
C_XL.d['resa-csv-mobqrcode'] = { 0:'SEPA qr', 1:'SEPA qr', 2:'SEPA qr', 3:'SEPA qr', 4:'SEPA qr', 5:'SEPA qr', 6:'SEPA qr', 7:'SEPA qr', 8:'SEPA QR' };
C_XL.d['resa-csv-payconiq'] = { 0:'payconiq', 1:'payconiq', 2:'payconiq', 3:'payconiq', 4:'payconiq', 5:'payconiq', 6:'payconiq', 7:'payconiq', 8:'Payconiq' };
C_XL.d['resa-csv-softpos'] = { 0:'SoftPOS', 1:'SoftPOS', 2:'SoftPOS', 3:'SoftPOS', 4:'SoftPOS', 5:'SoftPOS', 6:'SoftPOS', 7:'SoftPOS', 8:'SoftPOS' };
C_XL.d['resa-csv-hardpos'] = { 0:'terminal', 1:'terminal', 2:'terminal', 3:'terminal', 4:'terminal', 5:'terminal', 6:'terminal', 7:'terminal', 8:'Terminal' };
C_XL.d['resa-csv-onlinepayco'] = { 0:'PaycOnline', 1:'PaycOnline', 2:'PaycOnline', 3:'PaycOnline', 4:'PaycOnline', 5:'PaycOnline', 6:'PaycOnline', 7:'PaycOnline', 8:'PaycOnline' };
C_XL.d['resa-csv-onlinecards'] = { 0:'CardsOnline', 1:'CardsOnline', 2:'CardsOnline', 3:'CardsOnline', 4:'CardsOnline', 5:'CardsOnline', 6:'CardsOnline', 7:'CardsOnline', 8:'CardsOnline' };
C_XL.d['resa-csv-receivables'] = { 0:'receivables', 1:'créances', 2:'należności', 3:'te ontvangen', 4:'Forderungen', 5:'crediti', 6:'por cobrar', 7:'a receber', 8:'Fuerderungen' };




C_XL.d['resa-bCals'] = C_XL.d['{att_bcal}']; // !! No translation on these lines
C_XL.d['resa-uCals'] = C_XL.d['{att_ucal}'];
C_XL.d['resa-fCals'] = C_XL.d['{att_fcal}'];



// e-resa (*es01*)
//
C_XL.d['child firstname'] = { 0:'First name of the child', 1:'Prénom de l\'enfant', 2:'Imię dziecka', 3:'Voornaam van het kind', 4:'Vorname des Kindes', 5:'Nome del bambino', 6:'Nombre del niño', 7:'Primeiro nome da criança', 8:'Virnumm vum Kand' };
C_XL.d['child lastname'] = { 0:'Family name of the child', 1:'Nom de famille de l\'enfant', 2:'Nazwisko dziecka', 3:'achternaam van het kind', 4:'Familienname des Kindes', 5:'Cognome del bambino', 6:'apellido del niño', 7:'Nome de família da criança', 8:'Familljennumm vum Kand' };

C_XL.d['owner firstname'] = { 0:'Owner\'s firstname', 1:'Prénom du propriétaire', 2:'Imię właściciela', 3:'Voornaam van de eigenaar', 4:'Vorname des Besitzers', 5:'Nome del proprietario', 6:'Nombre del propietario', 7:'Nome do proprietário', 8:'Virnumm vum Besëtzer' };
C_XL.d['owner lastname'] = { 0:'Owner\'s family name', 1:'Nom du propriétaire', 2:'Nazwisko właściciela', 3:'Familienaam van de eigenaar', 4:'Familienname des Besitzers', 5:'Cognome del proprietario', 6:'apellido del propietario', 7:'apelido do proprietário', 8:'Familljennumm vum Besëtzer' };

// connections
C_XL.d['cnx filters'] = { 0:'Filters', 1:'Filtres', 2:'Filters', 3:'Filters', 4:'Filters', 5:'Filtri', 6:'Filtros', 7:'Filtros', 8:'Filteren' };
C_XL.d['cnx realtime'] = { 0:'Real-time', 1:'Instantanné', 2:'Real-time', 3:'huidige', 4:'Echtzeit', 5:'Istantaneo', 6:'Instantáneos', 7:'Instantâneo', 8:'Echtzäit' };
C_XL.d['cnx archives'] = { 0:'archives', 1:'archives', 2:'archiwa', 3:'archief', 4:'archive', 5:'archivi', 6:'Ficheros', 7:'Ficheiros', 8:'Archiv' };

// SMS monitoring
C_XL.d['sms monitoring'] = { 0:'SMS monitoring', 1:'SMS monitoring', 2:'SMS monitoring', 3:'SMS monitoring', 4:'SMS Überwachung', 5:'Monitoring SMS', 6:'Monitoreo SMS', 7:'Monitorização SMS', 8:'SMS Iwwerwaachung' };
C_XL.d['sms counters'] = { 0:'Counters', 1:'Compteurs', 2:'Liczniki', 3:'Tellers', 4:'Zähler', 5:'Contatore', 6:'Contador', 7:'Contadores', 8:'Zähler' };
C_XL.d['sms details'] = { 0:'Details', 1:'Details', 2:'Szczegóły', 3:'Details', 4:'Details', 5:'Dettagli', 6:'Detalles', 7:'Detalhes', 8:'Detailer' };
C_XL.d['sms graphs'] = { 0:'Bar graphs', 1:'Graphique', 2:'Wykresy słupkowe', 3:'staafdiagrammen', 4:'Balkendiagramme', 5:'Grafico', 6:'Gráfico', 7:'Gráfico', 8:'Säulendiagrammer' };

// M_Conxion
C_XL.d['profile'] = { 0:'Profile', 1:'Profil', 2:'Profil', 3:'Profiel', 4:'Profil', 5:'Profilo', 6:'Perfil', 7:'Perfil', 8:'Profil' };
C_XL.d['connection'] = { 0:'Connection', 1:'Connexion', 2:'Połączenie', 3:'aansluiting', 4:'Verbindung', 5:'Connessione', 6:'Conexión', 7:'Conexão', 8:'Verbindung' };
C_XL.d['activity'] = { 0:'activity', 1:'activité', 2:'aktywność', 3:'activiteit', 4:'aktivität', 5:'attività', 6:'actividad', 7:'atividade', 8:'Aktivitéit' };
C_XL.d['access rights'] = { 0:'access rights', 1:'Droits d\'accès', 2:'Prawa dostępu', 3:'Toegangsrechten', 4:'Zugriffsrechte', 5:'Diritti d\'accesso', 6:'Derechos de acceso', 7:'Direitos de acesso', 8:'Zougrëffrechter' };
C_XL.d['axs keys'] = { 0:'access keys', 1:'Clé d\'accès', 2:'Klawisze dostępu', 3:'Toegangsleutels', 4:'Zugriffsschlüssel', 5:'Chiavi d\'accesso', 6:'Claves de acceso', 7:'Chave de acesso', 8:'Zougrëffsschlësselen' };
C_XL.d['cnx-queries'] = { 0:'Queries', 1:'Queries', 2:'Queries', 3:'Queries', 4:'anfragen', 5:'Richieste', 6:'Peticiones', 7:'Dúvidas', 8:'Froen' };
C_XL.d['cnx-posts'] = { 0:'Posts', 1:'Posts', 2:'Posts', 3:'Posts', 4:'Posts', 5:'Messaggi', 6:'Mensajes', 7:'Mensagens', 8:'Posts' };
C_XL.d['cnx-deletes'] = { 0:'Deletes', 1:'Deletes', 2:'Deletes', 3:'Deletes', 4:'Löschungen', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };
C_XL.d['cnx-surfer'] = { 0:'Surfer name', 1:'Surfer name', 2:'Surfer name', 3:'Surfer name', 4:'Surfer Name', 5:'Nome persona connessa', 6:'Nombre persona conectada', 7:'Nome do pesquisador', 8:'Surfer Numm' };
C_XL.d['cnx-account'] = { 0:'account name', 1:'Nom du compte', 2:'account name', 3:'account naam', 4:'Kontoname', 5:'Nome del conto', 6:'Nombre de la cuenta', 7:'Nome da conta', 8:'Kontonumm' };
C_XL.d['cnx-agent'] = { 0:'User agent', 1:'Plateforme', 2:'User agent', 3:'User agent', 4:'Nutzeragent', 5:'Piattaforma', 6:'Plataforma', 7:'Plataforma', 8:'Benotzeragent' };
C_XL.d['cnx-sessionId'] = { 0:'Session Id', 1:'Id de session', 2:'Session Id', 3:'Sessie Id', 4:'Sitzungs ID', 5:'Id di sessione', 6:'Id de sesión', 7:'Id de sessão', 8:'Session ID' };
C_XL.d['cnx-logintime'] = { 0:'Login', 1:'Connexion', 2:'Login', 3:'Login', 4:'anmeldung', 5:'Connessione', 6:'Conexión', 7:'Conexão', 8:'Login' };
C_XL.d['cnx-activity'] = { 0:'activity', 1:'activité', 2:'activity', 3:'activiteit', 4:'aktivität', 5:'attività', 6:'actividad', 7:'atividade', 8:'Aktivitéit' };
C_XL.d['cnx-watchdog'] = { 0:'Watchdog', 1:'Watchdog', 2:'Watchdog', 3:'Watchdog', 4:'Wächter', 5:'Watchdog', 6:'Watchdog', 7:'Watchdog', 8:'Iwwerwaacher' };
C_XL.d['cnx-ip'] = { 0:'Ip', 1:'Ip', 2:'Ip', 3:'Ip', 4:'Ip', 5:'Ip', 6:'Ip', 7:'IP', 8:'IP' };
C_XL.d['cnx-reloads'] = { 0:'Reloads', 1:'Recharg', 2:'Reloads', 3:'Reloads', 4:'Reloads', 5:'Ricariche', 6:'Recargas', 7:'Recarregar', 8:'Reloads' };
C_XL.d['cnx-switchtos'] = { 0:'Switch', 1:'Switch', 2:'Switch', 3:'Switch', 4:'Schalter', 5:'Scambio', 6:'Intercambio', 7:'Trocas', 8:'Schalter' };

C_XL.d['cnx-allqueries'] = { 0:'Queries', 1:'Queries', 2:'Queries', 3:'Queries', 4:'anfragen', 5:'Richieste', 6:'Peticiones', 7:'Dúvidas', 8:'Froen' };
C_XL.d['cnx-allposts'] = { 0:'Posts', 1:'Posts', 2:'Posts', 3:'Opslaan', 4:'Posts', 5:'Messaggi', 6:'Mensajes', 7:'Mensagens', 8:'Posts' };
C_XL.d['cnx-alldeletes'] = { 0:'Deletes', 1:'Deletes', 2:'Deletes', 3:'Deletes', 4:'Löschungen', 5:'Soppressi', 6:'Borrados', 7:'apagados', 8:'Geläscht' };

C_XL.d['cnx-cntall'] = { 0:'Total operations number', 1:'Nombre total d\'opérations', 2:'Total operations number', 3:'aantal uitvoeringen', 4:'Gesamtzahl Operationen', 5:'Numero totale di operazioni', 6:'Número total de operaciones', 7:'Número total de operações', 8:'Total Operatiounen Zuel' };
C_XL.d['cnx-perfacc'] = { 0:'Total Processing time', 1:'Temps CPU total', 2:'Total processing time', 3:'Totaal CPU tijd', 4:'Gesamtzeit CPU', 5:'Tempo CPU totale', 6:'Tiempo CPU total', 7:'Tempo CPU total', 8:'Total Verarbechtungszäit' };
C_XL.d['cnx-perfmean'] = { 0:'Mean execution time', 1:'Temps moyen d\'exécution', 2:'Mean execution time', 3:'Gemiddeld uitvoeringstijd', 4:'Durchschnittliche Ausführungszeit', 5:'Tempo medio di esecuzione', 6:'Tiempo medio de ejecución', 7:'Tempo médio de execução', 8:'Moyenne Ausféierungszäit' };
C_XL.d['cnx-perfpk'] = { 0:'Longest execution time', 1:'Temps d\'exécution le plus long', 2:'Longest execution time', 3:'Langste uitvoeringstijd', 4:'Längste Ausführungszeit', 5:'Tempo di esecuzione più lungo', 6:'Tiempo de ejecución más largo', 7:'Tempo de execução mais longo', 8:'Längsten Ausféierungszäit' };
C_XL.d['cnx-operations'] = { 0:'Operations number', 1:'Nombre d\'opérations', 2:'Operations number', 3:'aantal uitvoeringen', 4:'anzahl Operationen', 5:'Numero di operazioni', 6:'Número de operaciones', 7:'Número de operações', 8:'Operatiounen Zuel' };


	// A C C O U N T    C O N F I G
	//
	
C_XL.d['token'] = { 0:'Token', 1:'Code', 2:'żeton', 3:'Code', 4:'Code', 5:'Codice', 6:'Código', 7:'Código', 8:'Token' };
C_XL.d['token validate'] = { 0:'verify', 1:'vérifier', 2:'zweryfikować', 3:'controleren', 4:'Überprüfen', 5:'verificare', 6:'verificar', 7:'verificar', 8:'iwwerpréiwen' };

C_XL.d['invalid login'] = { 
	0:'invalid login/password, try again',
	1:'login ou mot de passe invalide, essayez à nouveau',
	2:'niepoprawny login/hasło, powtórz ponownie',
	3:'onjuist login/wachtwoord, probeer opnieuw',
	4:'ungültige Login/Passwort, versuchen Sie es noch einmal',
	5:'login/password non validi, riprovare',
	6:'login o contraseña no válidos, inténtelo de nuevo', 
	7:'Login ou palavra-passe inválidos, por favor tente novamente.', 
	8:'Ongëltege Login/Passwuert, probéiert nach eng Kéier.'
};

// VISITORS REGISTER
C_XL.d['vfilter title'] = { 0:'Filter', 1:'Filtre', 2:'alfabetycznym rejestr', 3:'Filter', 4:'Filter', 5:'Filtro', 6:'Filtro', 7:'Filtro', 8:'Filter' };
C_XL.d['vfilter none'] = { 0:'No filtering', 1:'aucun filtrage', 2:'Bez filtrowania', 3:'Geen filtering', 4:'Kein filtern', 5:'Nessun filtro', 6:'Ningún filtro', 7:'Sem filtro', 8:'Keen Filter' };

C_XL.d['vfilter have app'] = { 
	0:'having ever made appointment',	
	1:'ayant déjà pris rendez-vous',		
	2:'że w historii spotkanie',				
	3:'Hebben ooit afspraak gemaakt',		
	4:'mit mindestens einer Terminabsprache',	
	5:'Ha già preso un appuntamento',	
	6:'Ya ha tomado una cita', 
	7:'Já teve uma consulta', 
	8:'Mat mindestens engem Rendez-vous an der Vergaangenheet'
};

C_XL.d['vfilter none tip'] = { 
	0:'all visitors appear in de list, even if they have never appointed.',
	1:'Tous les visitors apparaissent dans la liste, même s\'ils n\'ont jamais pris rendez-vous.',
	2:'U wszystkich visitors pojawi się na liście, nawet jeśli nigdy nie umówiłem.',
	3:'alle visitors voorkomen in de lijst, zelfs als ze nooit een afspraak hebben gemaakt.',
	4:'alle visitors wurden in dieser Liste angezeigt, auch wenn sie noch nie einen Termin gemacht haben.',	
	5:'Tutti i visitors appaiono nella lista, anche se non hanno mai preso un appuntamento.',	
	6:'Todos los visitantes aparecen en el listado, aunque no nunca hayan tomado cita.', 
	7:'Todos os visitors surgem na lista, mesmo se os mesmos nunca marcaram um encontro.', 
	8:'All Visiteuren erschéngen an der Lëscht, och wann se ni e Rendez-vous gemaach hunn.'
};

C_XL.d['visitor overbooked'] = { 
	0:'Within the chosen time range, this visitor is already scheduled on another appointment.',
	1:'Dans la plage horaire choisie, ce visitor est déjà planifié sur un autre rdv.',
	2:'W wybranym przedziale czasu ten visitor jest już zaplanowany na kolejne spotkanie.',
	3:'Binnen het gekozen tijdbereik is deze visitor al ingepland op een andere afspraak.',
	4:'Innerhalb des gewählten Zeitraums ist dieser visitor bereits auf einen anderen Termin terminiert.',	
	5:'Nell\'intervallo di tempo scelto, questo visitor è già programmato per un altro appuntamento.',	
	6:'Dentro del rango de tiempo elegido, este visitor ya está programado para otra cita.',	
	7:'Dentro do intervalo de tempo escolhido, este visitor já está agendado para outra consulta.', 
	8:'Am gewielten Zäitraum ass dëse Visiteur schonn op engem anere Rendez-vous geplangt.'
};




	//  N O T E S,	 T A S K S,	 C H A T S    A R C H I V E S
	//
	

C_XL.d['keyword'] = { 0:'Keyword', 1:'Mot clé', 2:'Słów kluczowych', 3:'Trefwoord', 4:'Stichwort', 5:'Parola chiave', 6:'Palabra clave', 7:'Palavra-chave', 8:'Schlësselwuert' };
C_XL.d['period'] = { 0:'Timeframe', 1:'Période', 2:'Ramy czasowe', 3:'Tijdsbestek', 4:'Zeitspanne', 5:'Periodo', 6:'Periodo', 7:'Período', 8:'Zäitkader' };
C_XL.d['action'] = { 0:'action', 1:'action', 2:'Działanie', 3:'actie', 4:'aktion', 5:'azione', 6:'acción', 7:'ação', 8:'Aktioun' };

C_XL.d['afilter title'] = { 0:'Filter', 1:'Filtre', 2:'alfabetycznym rejestr', 3:'Filter', 4:'Filter', 5:'Filtro', 6:'Filtro', 7:'Filtro', 8:'Filter' };
C_XL.d['afilter changing'] = { 0:'You are changing filters...', 1:'Vous modifiez les filtres...', 2:'Zmieniasz filtry...', 3:'U verandert filters...', 4:'Sie ändern die Filter...', 5:'Sta modificando i filtri...', 6:'Está modificando los filtros', 7:'altera os filtros...', 8:'Dir ännert d\'Filter...' };
C_XL.d['afilter period'] = { 0:'In a period', 1:'Dans une période', 2:'W okresie', 3:'In een periode', 4:'In einer Periode', 5:'In un periodo', 6:'En un periodo', 7:'Num período', 8:'An engem Zäitkader' };
C_XL.d['afilter created'] = { 0:'Created in the period', 1:'Créé dans une période', 2:'Utworzony w okresie', 3:'Gemaakt in de periode', 4:'In der Periode erstellt', 5:'Creato in un periodo', 6:'Creado en un periodo', 7:'Criado num período', 8:'Erstallt am Zäitkader' };
C_XL.d['afilter archived'] = { 0:'archived in the period', 1:'archivée dans la période', 2:'archiwizowane w okresie', 3:'Gearchiveerd in de periode', 4:'In der Periode archiviert', 5:'archiviata nel periodo', 6:'archivada en el periodo', 7:'arquivados no período', 8:'Archivéiert am Zäitkader' };
C_XL.d['type keyword'] = { 0:'Type minimum 5 chars', 1:'au minimum 5 caractères', 2:'Wpisz minimum 5 znaków', 3:'Typ minimaal 5 tekens', 4:'Mindestens 5 Zeichen', 5:'Minimo 5 caratteri', 6:'Mínimo 5 caracteres', 7:'Pelo menos 5 caracteres', 8:'Tippt op d\'mannst 5 Zeechen' };

C_XL.d['afilter keyword']	= C_XL.d['keyword']; // !! No translation on this line



	//  e - R E S E R V A T I O N
	//

// backoffice


// 		technical 			english:0,				french:1,					polish:2,					dutch:3,				german:4,				italian:5,					spanish:6,					portuguese:7, 	luxembourgish:8
C_XL.d['link label'] = { 0:'Link label', 1:'Label du lien', 2:'Etykieta link', 3:'Link label', 4:'Etikett des Links', 5:'Indicazione del link', 6:'Rótulo del vínculo', 7:'Rótulo da ligação', 8:'Link Etikett' };
C_XL.d['link url'] = { 0:'Target url', 1:'Url de la cible', 2:'Docelowy adres URL', 3:'Doel url', 4:'Zieladresse URL', 5:'Url del target', 6:'Url del objetivo', 7:'URL de destino', 8:'Zil URL' };
C_XL.d['optional'] = { 0:'optional', 1:'facultatif', 2:'fakultatywny', 3:'facultatief', 4:'optional', 5:'facoltativo', 6:'facultativo', 7:'facultativo (não obrigatório)', 8:'Optional' };
C_XL.d['booking options'] = { 0:'Booking', 1:'Réservation', 2:'Rezerwacja', 3:'Reservering', 4:'Reservierung', 5:'Prenotazione', 6:'Reserva', 7:'Reserva', 8:'Reservatioun' };
C_XL.d['identification'] = { 0:'authentication', 1:'Identification', 2:'Uwierzytelniania', 3:'Identificatie', 4:'authentifizierung', 5:'Identificazione', 6:'Nombre usuario', 7:'Identificação', 8:'Identifikatioun' };
C_XL.d['search options'] = { 0:'Search options', 1:'Options de recherche', 2:'Opcje wyszukiwania', 3:'Zoekopties', 4:'Suchoptionen', 5:'Opzioni di ricerca', 6:'Opciones de búsqueda', 7:'Opções de pesquisa', 8:'Sichoptiounen' };
C_XL.d['availabilities'] = { 0:'Availabilities', 1:'Disponibilités', 2:'Wolne', 3:'Beschikbaarheden', 4:'Verfügbarkeiten', 5:'Disponibilità', 6:'Disponibilidades', 7:'Disponibilidades', 8:'Disponibilitéiten' };
C_XL.d['confirmation'] = { 0:'Confirmation', 1:'Confirmation', 2:'Potwierdzenie', 3:'Bevestiging', 4:'Bestätigung', 5:'Conferma', 6:'Confirmación', 7:'Confirmação', 8:'Confirmatioun' };
C_XL.d['confirmed'] = { 0:'Confirmed', 1:'Confirmé', 2:'Zatwardziały', 3:'Bevestigd', 4:'Bestätigt', 5:'Confermato', 6:'Confirmado', 7:'Confirmado', 8:'Confirméiert' };
C_XL.d['greetings'] = { 0:'Greetings', 1:'Salutations', 2:'Pozdrowienia', 3:'Groeten', 4:'Grüße', 5:'Saluti', 6:'Saludos', 7:'Cumprimentos', 8:'Begréissungen' };
C_XL.d['e-problem'] = { 0:'There is a problem', 1:'Il y a un problème', 2:'Tam jest problem', 3:'Er is een probleem', 4:'Es gibt ein Problem', 5:'C\'è un problema', 6:'Hay un problema', 7:'Há um problema', 8:'Et gëtt e Problem' };

C_XL.d['e-home'] = { 0:'Home', 1:'accueil', 2:'Powitalna', 3:'Welkom', 4:'Willkommen', 5:'Pagina iniziale', 6:'Página de inicio', 7:'Página inicial', 8:'Doheem' };
C_XL.d['e-homepage'] = { 0:'Home page', 1:'Page d\'accueil', 2:'Strona powitalna', 3:'Welkom pagina', 4:'Willkommenseite', 5:'Pagina iniziale', 6:'Página de inicio', 7:'Página inicial', 8:'Startsäit' };
C_XL.d['e-infos'] = { 0:'Web infos', 1:'Infos web', 2:'Informacje web', 3:'Web infos', 4:'Webinfos', 5:'Informazioni web', 6:'Información web', 7:'Informações Web', 8:'Web-Informatiounen' };
C_XL.d['e-hourlies'] = { 0:'Availabilities', 1:'Horaires', 2:'Godziny pracy', 3:'Openingsuren', 4:'Öffnungszeiten', 5:'Orari', 6:'Horarios', 7:'Horários', 8:'Stonnen' };
C_XL.d['e-direction'] = { 0:'Directions', 1:'Itinéraire', 2:'Wskazówki', 3:'Routebeschrijving', 4:'Wegbeschreibung', 5:'Itinerario', 6:'Itinerarios', 7:'Itinerário', 8:'Weeër' };
C_XL.d['e-settings'] = { 0:'Web settings', 1:'Réglages web', 2:'Ustawienia sieci', 3:'Web instellingen', 4:'Webeinstellungen', 5:'Configurazioni web', 6:'Configuraciones web', 7:'Configurações da Web', 8:'Web-Astellungen' };
C_XL.d['e-graphchart'] = { 0:'appearance', 1:'apparence', 2:'Wygląd', 3:'Uiterlijk', 4:'Erscheinung', 5:'aspetto', 6:'aspecto', 7:'aspeto', 8:'Erscheinung' };
C_XL.d['e-url'] = { 0:'Url postfix', 1:'Postfix url', 2:'Url postfix', 3:'Url postfix', 4:'Postfix URL', 5:'Postfix url', 6:'Postfix url', 7:'Postfix url', 8:'URL Postfix' };

C_XL.d['e-sameday'] = { 0:'In the same day, not before', 1:'Le même jour, pas avant', 2:'W tym samym dniu, nie wcześniej niż', 3:'Op dezelfde dag, niet voor ', 4:'am selben Tag, nicht vor', 5:'Nello stesso giorno, non prima delle', 6:'El mismo día, no antes de', 7:'No mesmo dia, não antes de', 8:'Um selwechten Dag, net virdrun' };
C_XL.d['e-max'] = { 0:'Max number of reservation', 1:'Nbre max de réservation', 2:'Maksymalna liczba rezerwacji', 3:'Maximum aantal reservatie', 4:'Max Reservierungsanzahl', 5:'Numero massimo di prenotazioni', 6:'Número máximo de reservas', 7:'Número máximo de reserva', 8:'Max Zuel vun Reservatiounen' };
C_XL.d['e-limit'] = { 0:'Number of options proposed', 1:'Nbre d\'options proposées', 2:'Liczba dostępnych opcji', 3:'aantal voorgestelde opties', 4:'anzahl angebotener Optionen', 5:'Numero di opzioni proposte', 6:'Número de opciones propuestas', 7:'Número de opções propostas', 8:'Zuel vun Optiounen ugebueden' };
C_XL.d['e-cancel'] = { 0:'Cancellation via web', 1:'annulation via web', 2:'anulowanie via web', 3:'annulering via web', 4:'Online-Stornierung', 5:'Cancellazione tramite web', 6:'Cancelación a través de internet', 7:'Cancelamento através da Web', 8:'Annulatioun iwwer Web' };
C_XL.d['e-signin'] = { 0:'Registration via the web', 1:'Inscription via le web', 2:'Rejestracja przez Internet', 3:'Registratie via het web', 4:'Online-Registrierung', 5:'Iscrizione tramite web', 6:'Inscripción a través de internet', 7:'Inscrição através da Web', 8:'Umellung iwwer Web' };
C_XL.d['e-skin'] = { 0:'Decorative theme', 1:'Thème décoratif', 2:'Dekoracyjny motyw', 3:'Decoratieve thema', 4:'Dekoratives Thema', 5:'Tema decorativo', 6:'Tema decorativo', 7:'Tema decorativo', 8:'Dekorativ Thema' };
C_XL.d['main image'] = { 0:'Main image', 1:'Image principale', 2:'Główny obraz', 3:'Hoofdbeeld', 4:'Hauptbild', 5:'Immagine principale', 6:'Imagen principal', 7:'Imagem principal', 8:'Haaptbild' };
C_XL.d['e-image'] = { 0:'Ready available', 1:'Image pré-définie', 2:'Wstępnie zdefiniowany obraz', 3:'Vooraf gedefinieerde afbeelding', 4:'Vordefiniertes Bild', 5:'Immagine predefinita', 6:'Imagen predefinida', 7:'Imagem pré-definida', 8:'Virdeffinéiert Bild' };

C_XL.d['e-title'] = { 0:'Web page title', 1:'Titre de la page web', 2:'Tytuł strony internetowej', 3:'Webpagina title', 4:'Titel der Webseite', 5:'Titolo della pagina web', 6:'Título de la página web', 7:'Título da página Web', 8:'Titel vun der Websäit' };
C_XL.d['e-header'] = { 0:'Web page géneral info', 1:'Cadre informatif général', 2:'Informacje ogólne strony internetowej', 3:'Webpagina informatie kader', 4:'allgemeine Informationen der Webseite', 5:'Quadro informativo generale', 6:'Cuadro informaciones generales', 7:'Quadro de informações gerais', 8:'Allgemeng Informatioune vun der Websäit' };


C_XL.d['e-allownote'] = { 
	0:'The visitor is allowed to leave a note',	
	1:'Le visitor peut laisser une note',		
	2:'Informacje wyświetlane na potwierdzenie',	
	3:'Informatie weergegeven op bevestiging stap',		
	4:'Informationen auf der Bestätigung',	
	5:'Informazione da segnalare alla conferma',	
	6:'El visitante puede dejar una nota', 
	7:'Informações no momento da confirmação',
	8:'De Visiteur däerf eng Notiz hannerloossen' // luxembourgish
};

C_XL.d['e-blacklist'] = { 
	0:'This color of visitor is not allowed to take appointment',		
	1:'Cette couleur de visitor n\'est pas autorisée à prendre RDV',	
	2:'Ten kolor visitor nie może wziąć udziału w spotkaniu',
	3:'Deze kleur van de visitor is niet toegestaan om een afspraak te maken',
	4:'Diese Farbe des visitor darf nicht verabredet werden',
	5:'Questo colore del visitor non è autorizzato a prendere un appuntamento',
	6:'Este color de visitante no está autorizado a tomar una cita', 
	7:'Esta cor do visitor não tem permissão para marcar',
	8:'Dës Faarf vum Visiteur ass net erlaabt, Rendez-vous ze maachen' // luxembourgish
};

C_XL.d['e-withAMPM'] = { 
	0:'The visitor can choose days of preference',				
	1:'Le visitor peut choisir des jours de préférence',	
	2:'visitor może wybrać dni uprzywilejowania',			
	3:'De visitor kan dagen van voorkeur kiezen',
	4:'Der visitor kann bevorzugte Tage wählen',	
	5:'Il visitor può scegliere i giorni di preferenza',	
	6:'El visitante puede elegir días de preferencia', 
	7:'O visitor pode escolher dias de preferência',
	8:'De Visiteur kann seng Preferenzdeeg auswielen' // luxembourgish
};

C_XL.d['e-confirm'] = { 
	0:'Information displayed on confirmation',	
	1:'Information à signaler lors de la confirmation',		
	2:'Informacje wyświetlane na potwierdzenie',	
	3:'Informatie weergegeven op bevestiging stap',		
	4:'Informationen auf der Bestätigung',	
	5:'Informazione da segnalare alla conferma',	
	6:'Información mostrada en la confirmación',
	7:'Informações no momento da confirmação',
	8:'Informatiounen, déi op der Bestätegung ugewise ginn' // luxembourgish
};

C_XL.d['e-overbooking'] = { 
	0:'The time slot you chose is no longer available, please make a new choice.',	
	1:'Le créneau horaire que vous avez choisi n\'est plus disponible, s\'il vous plaît faites un autre choix.',		
	2:'Wybrany przedział czasowy nie jest już dostępny, dokonaj innego wyboru',	
	3:'Het door jou gekozen tijdslot is niet meer beschikbaar, maak aub een andere keuze',		
	4:'Das von Ihnen gewählte Zeitfenster ist nicht mehr verfügbar, bitte treffen Sie eine andere Wahl',	
	5:'La fascia oraria che hai scelto non è più disponibile, fai un\'altra scelta',	
	6:'La franja horaria que ha elegido ya no está disponible, elija otra opción',
	7:'O horário que você escolheu não está mais disponível, faça outra escolha',
	8:'Den Zäitraum deen Dir gewielt hutt ass net méi verfügbar, wielt w.e.g. en aneren aus' // luxembourgish
};

C_XL.d['e-hlinklabel'] = { 0:'Header link label', 1:'Label du lien dans l\'entête', 2:'Etykieta nagłówek', 3:'Header label', 4:'Etikett Titel', 5:'Indicazione del link nell\'intestazione', 6:'Rótulo del vínculo en la cabecera', 7:'Rótulo da ligação no cabeçalho', 8:'Kapp Link Etikett' };
C_XL.d['e-titlefont'] = { 0:'Font for the header', 1:'Fonte pour le titre', 2:'Czcionka o tytuł', 3:'Lettertype voor de titel', 4:'Schriftart im Titel', 5:'Tipografia per il titolo', 6:'Tipo de letra para el título', 7:'Fonte para o título', 8:'Schrëft fir den Titel' };
C_XL.d['e-textfont'] = { 0:'Font for the text', 1:'Fonte pour le texte', 2:'Czcionki dla tekstu', 3:'Lettertype voor de tekst', 4:'Schriftart im Text', 5:'Tipografia per il testo', 6:'Tipo de letra para el texto', 7:'Fonte para o texto', 8:'Schrëft fir den Text' };
C_XL.d['e-palette'] = { 0:'Color palette', 1:'Palette de couleurs', 2:'Paleta kolorów', 3:'Kleuren palet', 4:'Farbpalette', 5:'Paletta di colori', 6:'Gama de colores', 7:'Paleta de cores', 8:'Faarfpalette' };
C_XL.d['e-googlemaps'] = { 0:'Link to Google maps', 1:'Lien vers Google maps', 2:'Link do mapy Google', 3:'Link naar Google Maps', 4:'Link nach Google Maps', 5:'Link verso Google maps', 6:'Vínculo para Google maps', 7:'Ligação para o Google Maps', 8:'Link op Google Maps' };

C_XL.d['e-ccss'] = { 0:'Custom css', 1:'Style css', 2:'Niestandardowe Css', 3:'Css styling', 4:'Css Styling', 5:'Css stile', 6:'Css personalizado', 7:'Estilo Css', 8:'Benotzerdefinéiert CSS' };

C_XL.d['write css here'] = { 
	0:'write your css custom styling here',
	1:'écrivez ici votre style personnalisé css',
	2:'napisz tutaj swoją niestandardową stylizację css',
	3:'schrijf hier je CSS-aangepaste styling',
	4:'Schreiben Sie hier Ihr CSS-Design',
	5:'scrivi il tuo stile personalizzato css qui',
	6:'escribe tu estilo css personalizado aquí',
	7:'escreva o seu estilo personalizado css aqui',
	8:'Schreift hei Ären personaliséierten CSS-Design' 
};

C_XL.d['custom logo'] = { 0:'Custom logo', 1:'Logo personnalisé', 2:'Logo firmy', 3:'Eigen logo', 4:'benutzerdefiniertes Logo', 5:'logo personalizzato', 6:'logotipo personalizado', 7:'Logo para a página da web', 8:'Benotzerdefinéiert Logo' };
C_XL.d['specific logo'] = { 0:'Specific logo', 1:'Logo spécifique', 2:'Konkretne logo', 3:'Specifiek logo', 4:'bestimmtes Logo', 5:'logo specifico', 6:'logo especifico', 7:'Logo para a página da web', 8:'Spezifescht Logo' };
C_XL.d['global logo'] = { 0:'account logo', 1:'Logo du compte', 2:'Logo konta', 3:'account logo', 4:'Kontologo', 5:'logo dell\'account', 6:'logo global', 7:'Logo para a página da web', 8:'Kontologo' };

C_XL.d['e-logo'] = { 0:'Web page logo', 1:'Logo pour la page web', 2:'Logo strony internetowej', 3:'Logo voor de webpagina', 4:'Logo für die Webseite', 5:'Logo per la pagina web', 6:'Logo para la página web', 7:'Logo para a página da web', 8:'Logo vun der Websäit' };
C_XL.d['upload own logo'] = { 0:'Upload your own logo', 1:'Uploader votre propre logo', 2:'Prześlij własne logo', 3:'Upload uw eigen logo', 4:'Laden Sie Ihr eigenes Logo hoch', 5:'Carica il tuo logo', 6:'Sube tu propio logo', 7:'Envie seu próprio logotipo', 8:'Lued Äert eegent Logo erop' };

// 		technical
C_XL.d['authentication'] = { 0:'authentication method', 1:'Vérification d\'identité', 2:'Metoda uwierzytelniania', 3:'autenticatiemethode', 4:'authentifizierungsmethode', 5:'Verifica dell\'identità', 6:'Verificación de la identidad', 7:'Verificação de identidade', 8:'Authentifikatiounsmethod' };
C_XL.d['auth-kiosk'] = { 0:'Kiosk mode (no authentication)', 1:'Kiosque (pas d\'authentification)', 2:'Tryb kiosk (bez uwierzytelniania)', 3:'Kiosk-modus (geen authenticatie)', 4:'Kioskmodus (keine Authentifizierung)', 5:'Chiosco (senza identificazione)', 6:'Quiosco (sin autenticación)', 7:'Quiosque (sem autenticação)', 8:'Kioskmoud (ouni Authentifikatioun)' };
C_XL.d['auth-email'] = { 0:'authentication by email', 1:'authentification par email', 2:'Uwierzytelnianie przez e-mail', 3:'authenticatie via e-mail', 4:'authentifizierung per E-Mail', 5:'autenticazione via email', 6:'autenticación por e-mail', 7:'autenticação por e-mail', 8:'Authentifikatioun per E-Mail' };
C_XL.d['auth-mobile'] = { 0:'authentication via mobile', 1:'authentification par SMS', 2:'Uwierzytelnianie przez SMS', 3:'authenticatie via SMS', 4:'authentifizierung per SMS', 5:'autenticazione via SMS', 6:'autenticación por SMS', 7:'autenticação por SMS', 8:'Authentifikatioun per SMS' };
C_XL.d['auth-operator'] = { 0:'authentication by an operator', 1:'authentification par un opérateur', 2:'Uwierzytelnianie przez operatora', 3:'authenticatie door een operator', 4:'authentifizierung per Anbieter', 5:'autenticazione tramite operatore', 6:'autenticación por operador', 7:'autenticação por um operador', 8:'Authentifikatioun duerch en Operateur' };
C_XL.d['book now'] = { 0:'make an appointment', 1:'prendre rendez-vous', 2:'umów się na wizytę', 3:'maak een afspraak', 4:'termin vereinbaren', 5:'prendere appuntamento', 6:'tomar cita', 7:'marcar uma consulta', 8:'E Rendez-vous maachen' };
C_XL.d['cancel resa'] = { 0:'cancel an appointment', 1:'annuler un rendez-vous', 2:'anulować termin', 3:'een afspraak afzeggen', 4:'termin absagen', 5:'cancellare un appuntamento', 6:'cancelar una cita', 7:'cancelar uma consulta', 8:'E Rendez-vous annuléieren' };

C_XL.d['identification mode'] = { 0:'identification mode', 1:'mode d\'identification', 2:'Metoda uwierzytelniania', 3:'autenticatiemethode', 4:'authentifizierungsmethode', 5:'Verifica dell\'identità', 6:'Verificación de la identidad', 7:'Verificação de identidade', 8:'Identifikatiounsmethod' };

C_XL.d['ident family shared'] = { 
	0:'family shared',
	1:'partagé par la famille',		// french
	2:'wspólne przez rodzinę',		// polish
	3:'gedeeld door familie',		// dutch
	4:'von der Familie geteilt',	// german	
	5:'condivisa dalla famiglia',	// italian	
	6:'compartido por la familia', 	// spanish
	7:'compartilhado pela família',	// portuguese
	8:'Vun der Famill gedeelt'		// luxembourgish
};

C_XL.d['ident email based'] = { 
	0:'unique email or mobile',	
	1:'email ou mobile unique',	
	2:'pojedynczy e-mail lub telefon komórkowy',
	3:'unieke e-mail of mobiel',
	4:'einzelne E-Mail oder Handy',
	5:'e-mail univoca o cellulare',
	6:'correo electrónico único o móvil', 
	7:'único e-mail ou celular',
	8:'Eenzeg E-Mail oder Handy' // luxembourgish
};

C_XL.d['pal-medical'] = { 0:'Blue green medical', 1:'Médical bleu vert', 2:'Niebieski zielony medyczne', 3:'Medische blauw groen', 4:'Medizinisches blau-grün', 5:'Medico blu verde', 6:'Médico azul verde', 7:'Médico verde azul', 8:'Blau-gréng medezinesch' };
C_XL.d['pal-zen'] = { 0:'Zen amber taupe', 1:'Zen ambré taupe', 2:'Zen bursztynu ciemnoszary', 3:'Zen amber mole', 4:'Zen dunkles Bernstein', 5:'Zen ambra talpa', 6:'Zen ambarino gris topo', 7:'Zen âmbar toupeira', 8:'Zen amber Taupe' };
C_XL.d['pal-dynamic'] = { 0:'Dynamic cyan magenta', 1:'Dynamic cyan magenta', 2:'Dynamiczny magenta cyan', 3:'Dynamische cyaan magenta', 4:'Dynamisches Zyan Magenta', 5:'Dinamico ciano magenta', 6:'Dinámico cyan magenta', 7:'Dinâmica azul magenta', 8:'Dynamik Cyan Magenta' };
C_XL.d['pal-gold'] = { 0:'Ebony and gold', 1:'Ebène et or', 2:'Gold and ebony', 3:'Goud en ebben', 4:'Gold und Ebenholz', 5:'Ebano e oro', 6:'Ébano y oro', 7:'Ébano e dourado', 8:'Éiwenholz a Gold' };
C_XL.d['pal-blueviolet'] = { 0:'Blue and Violet', 1:'Bleu violet (Proximus)', 2:'Niebieski i fioletowy', 3:'Blauw en paars (Proximus)', 4:'Blau und Lila', 5:'Blu viola', 6:'azul violeta', 7:'Violeta azul (Proximus)', 8:'Blo an Violett' };
C_XL.d['pal-bio'] = { 0:'Bio (natural green)', 1:'Bio (vert nature)', 2:'Bio (naturalny zielony)', 3:'Bio (Natuur groen)', 4:'Bio (naturgrün)', 5:'Bio (verde natura)', 6:'Bio (verde naturaleza)', 7:'Bio (verde natureza)', 8:'Bio (natierlech gréng)' };

// technical
C_XL.d['allowed'] = { 0:'allowed', 1:'autorisé', 2:'Upoważniony', 3:'Toegelaten', 4:'Erlaubt', 5:'autorizzato', 6:'autorizado', 7:'autorizado', 8:'Erlaabt' };
C_XL.d['not allowed'] = { 0:'Not allowed', 1:'Non autorisé', 2:'Nieautoryzowane', 3:'Niet toegelaten', 4:'Nicht erlaubt', 5:'Non autorizzato', 6:'No autorizado', 7:'Não autorizado', 8:'Net erlaabt' };

C_XL.d['unlimited'] = { 0:'Unlimited', 1:'Illimité', 2:'Nieograniczony', 3:'Onbeperkt', 4:'Unbeschränkt', 5:'Illimitato', 6:'Ilimitado', 7:'Ilimitado', 8:'Onbegrenzten' };
C_XL.d['one'] = { 0:'One', 1:'Une', 2:'Jeden', 3:'Een', 4:'Ein', 5:'Una', 6:'Uno', 7:'Um', 8:'Eent' };
C_XL.d['two'] = { 0:'Two', 1:'Deux', 2:'Dwa', 3:'Twee', 4:'Zwei', 5:'Due', 6:'Dos', 7:'Dois', 8:'Zwee' };
C_XL.d['three'] = { 0:'Three', 1:'Trois', 2:'Trzy', 3:'Drie', 4:'Drei', 5:'Tre', 6:'Tres', 7:'Três', 8:'Dräi' };
C_XL.d['four'] = { 0:'Four', 1:'Quatre', 2:'Cztery', 3:'Vier', 4:'Vier', 5:'Quattro', 6:'Cuatro', 7:'Quatro', 8:'Véier' };


C_XL.d['mobminder'] = { 0:'Mobminder', 1:'Mobminder', 2:'Mobminder', 3:'Mobminder', 4:'Mobminder', 5:'Mobminder', 6:'Mobminder', 7:'Mobminder', 8:'Mobminder' };
C_XL.d['medminder'] = { 0:'Medminder', 1:'Medminder', 2:'Medminder', 3:'Medminder', 4:'Medminder', 5:'Medminder', 6:'Medminder', 7:'Medminder', 8:'Medminder' };
C_XL.d['medical'] = { 0:'Medical', 1:'Médical', 2:'Medyczny', 3:'Medische', 4:'Medizinisch', 5:'Medico', 6:'Médico', 7:'Médico', 8:'Medezinesch' };
C_XL.d['business'] = { 0:'Business', 1:'Business', 2:'Biznes', 3:'Bedrijf', 4:'Unternehmen', 5:'Business', 6:'Negocio', 7:'Negócio', 8:'Geschäft' };
C_XL.d['clinics'] = { 0:'Medical group', 1:'Cliniques', 2:'Medical Group', 3:'Medische groep', 4:'Medizinische Praxis', 5:'Cliniche', 6:'Clínicas', 7:'Clínicas', 8:'Medizinesch Grupp' };
C_XL.d['lawyers'] = { 0:'Lawyers', 1:'Libéral', 2:'Prawnicy', 3:'advocaten', 4:'anwälte', 5:'Liberale', 6:'Liberal', 7:'Liberal', 8:'Affekoten' };
C_XL.d['mecas'] = { 0:'Mechanics', 1:'Mécanique', 2:'Mechanika', 3:'Mechanica', 4:'Mechaniker', 5:'Meccanica', 6:'Mecánica', 7:'Mecânica', 8:'Mechanik' };
C_XL.d['wellness'] = { 0:'Wellness', 1:'Bien être', 2:'Wellness', 3:'Wellness', 4:'Wellness', 5:'Benessere', 6:'Bienestar', 7:'Bem-estar', 8:'Wellness' };
C_XL.d['edoc'] = { 0:'Med e-logos', 1:'e-logos', 2:'Med e-logos', 3:'e-arts', 4:'Med e-logo', 5:'e-logo', 6:'Med e-logo', 7:'e-logótipos', 8:'Med e-Logoen' };
C_XL.d['emedical'] = { 0:'e-medical', 1:'e-médical', 2:'e-medical', 3:'e-medische', 4:'e-medizinisch', 5:'e-medico', 6:'e-médico', 7:'e-médica', 8:'e-medezinesch' };
C_XL.d['stetosblue'] = { 0:'Stethoscope', 1:'Stethoscope', 2:'Stetoskop', 3:'Stethoscoop', 4:'Stethoskoop', 5:'Stetoscopio', 6:'Estetoscopio', 7:'Estetoscópio', 8:'Stethoskop' };
C_XL.d['doctortie'] = { 0:'Doctor tie', 1:'Cravatte', 2:'Doktor remis', 3:'arts band', 4:'arztkrawatte', 5:'Cravatta', 6:'Corbata', 7:'Gravata', 8:'Dokter Krawatt' };
C_XL.d['heartbeat'] = { 0:'Heart beat', 1:'Battements', 2:'Bicie serca', 3:'Hartslag', 4:'Herzschlag', 5:'Battiti', 6:'Latido', 7:'Batimentos', 8:'Häerzschlag' };
C_XL.d['handpeople'] = { 0:'Hand to you', 1:'Main tendue', 2:'Ręka do Ciebie', 3:'Klaar om u', 4:'Hand in Hand', 5:'Mano tesa', 6:'Mano extendida', 7:'Mão estendida', 8:'Hand ausgestreckt' };
C_XL.d['bambstones'] = { 0:'Bamboo stones', 1:'Pierre&bambou', 2:'Kamienie z bambusa', 3:'Bamboe stenen', 4:'Bamboosteine', 5:'Pietre & Bambù', 6:'Piedras & Bambú', 7:'Pedra e bambu', 8:'Bambu Steng' };
C_XL.d['stoneleaves'] = { 0:'Stones leaves', 1:'Pierre&feuilles', 2:'Kamienie liście', 3:'Stenen bladeren', 4:'Steinblätter', 5:'Pietre & Foglie', 6:'Piedras & hojas', 7:'Pedra e folhas', 8:'Steng a Blieder' };
C_XL.d['flowerpetals'] = { 0:'Flower petals', 1:'Pétales', 2:'Płatki kwiatów', 3:'Bloemblaadjes', 4:'Blütenblätter', 5:'Petali', 6:'Pétalos', 7:'Pétalas', 8:'Blummebléien' };
C_XL.d['flowers'] = { 0:'Flowers', 1:'Fleurs', 2:'Kwiaty', 3:'Bloemen', 4:'Blumen', 5:'Fiori', 6:'Flores', 7:'Flores', 8:'Blummen' };
C_XL.d['caduceus'] = { 0:'Caduceus', 1:'Caduceus', 2:'Caduceus', 3:'Caduceus', 4:'Caduceus', 5:'Caduceus', 6:'Caduceus', 7:'Caducas', 8:'Caduceus' };


// e-reservation Web page 

C_XL.d['e-resa cancel none'] = C_XL.d['not allowed']; // no translation here

C_XL.d['e-reservation'] = { 
	0:'Make an appointment - Online booking',		
	1:'Prendre rendez-vous - Réservation en ligne',	
	2:'Umów się na wizytę - Online rezerwacja',	 
	3:'Maak een afspraak - Online reserveren',		
	4:'Termin vereinbaren - Online Buchung',
	5:'Prendere un appuntamento - Prenotazione online',	
	6:'Toma una cita - Reserva online',
	7:'Marcar uma consulta - Reservas online',
	8:'E Rendez-vous maachen - Online Reservatioun' // luxembourgish
};

// technical
C_XL.d['e-resa cancel 1h'] = { 
	0:'at least 1 hour before appointment',		
	1:'au moins 1 heure avant le RDV',	
	2:'co najmniej 1 godziny przed spotkaniem',	 
	3:'ten minste één uur voor de afspraak',	
	4:'mindestens 1 Stunde vor dem Termin',
	5:'almeno 1 ore prima dell\'appuntamento',		// italian
	6:'al menos 1 hora antes de la cita',
	7:'pelo menos 1 hora antes da consulta',
	8:'op d\'mannst 1 Stonn virum Rendez-vous' // luxembourgish
};

C_XL.d['e-resa cancel 12h'] = { 
	0:'at least 12h before appointment',		
	1:'au moins 12h avant le RDV',	
	2:'co najmniej 12 godziny przed spotkaniem',	 
	3:'ten minste 12 uren voor de afspraak',	
	4:'mindestens 12 Stunden vor dem Termin',
	5:'almeno 12 ore prima dell\'appuntamento',		// italian
	6:'al menos 12 horas antes de la cita',
	7:'pelo menos 12 horas antes da consulta',
	8:'op d\'mannst 12 Stonnen virum Rendez-vous' // luxembourgish
};

C_XL.d['e-resa cancel 24h'] = { 
	0:'at least 24h before appointment',		
	1:'au moins 24h avant le RDV',	
	2:'co najmniej 24 godziny przed spotkaniem',	 
	3:'ten minste 24 uren voor de afspraak',	
	4:'mindestens 24 Stunden vor dem Termin',
	5:'almeno 24 ore prima dell\'appuntamento',		// italian
	6:'al menos 24 horas antes de la cita',
	7:'pelo menos 24 horas antes da consulta',
	8:'op d\'mannst 24 Stonnen virum Rendez-vous' // luxembourgish
};

C_XL.d['e-resa cancel 48h'] = { 
	0:'at least 48h before appointment',
	1:'au moins 48h avant le RDV',
	2:'co najmniej 48 godzin przed spotkaniem',
	3:'ten minste 48 uren voor de afspraak',
	4:'mindestens 48 Stunden vor dem Termin',
	5:'almeno 48 ore prima dell\'appuntamento',		// italian
	6:'al menos 48 horas antes de la cita',
	7:'pelo menos 48 horas antes da consulta',
	8:'op d\'mannst 48 Stonnen virum Rendez-vous' // luxembourgish
};

C_XL.d['e-resa cancel 72h'] = { 
	0:'at least 72h before appointment',
	1:'au moins 72h avant le RDV',	
	2:'co najmniej 72 godziny przed spotkaniem',	
	3:'ten minste 72 uren voor de afspraak',		
	4:'mindestens 72 Stunden vor dem Termin',
	5:'almeno 72 ore prima dell\'appuntamento',	// italian
	6:'al menos 72 horas antes de la cita',
	7:'pelo menos 72 horas antes da consulta',
	8:'op d\'mannst 72 Stonnen virum Rendez-vous' // luxembourgish
};

C_XL.d['e-resa cancel 1week'] = { 
	0:'at least 7 days before appointment',		
	1:'au moins 7 jours avant le RDV',	
	2:'co najmniej 7 dni przed spotkaniem',	 
	3:'ten minste 7 dagen voor de afspraak',		
	4:'mindestens 7 tage vor dem Termin',
	5:'almeno 7 giorni prima dell\'appuntamento',	// italian
	6:'al menos 7 días antes de la cita',
	7:'pelo menos 7 dias antes da consulta',
	8:'op d\'mannst 7 Deeg virum Rendez-vous' // luxembourgish
};
							

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
								// portuguese:7, 	luxembourgish:8					

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
								// portuguese:7, 	luxembourgish:8								
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


	//  C_iPACKAGE
	//			
C_XL.d['package plan'] 		= { 0:'Purchase plan',	1:'Formule tarifaire',	2:'Wzór taryfowy',	3:'Tariefformule',	4:'Zahlplan',			5:'Formule tariffarie',	6:'Fórmula tarifaria', 	7:'Fórmula de tarifário', 	8:'Tarifplang' };
C_XL.d['profession'] 		= { 0:'Profession',		1:'Profession',			2:'Profesja',		3:'Beroep',			4:'Beruf',				5:'Professione',		6:'Profesión', 			7:'Profissão', 				8:'Beruff'	};
C_XL.d['dentistry'] 		= { 0:'Dentistry',	 	1:'Dentisterie',		2:'Dentistry',		3:'Tandheelkunde',	4:'Zahnheilkunde',		5:'Odontoiatria',		6:'Odontología', 		7:'Odontologia', 			8:'Zännheilkonscht'	};
C_XL.d['dental surgeon'] 		= { 0:'dental surgeon',		1:'chirurgien dentaire',2:'chirurga stomatologa',	3:'kaakchirurg',	4:'Zahnchirurg',		5:'medico dentista',	6:'cirujano dental', 	7:'cirurgião-dentista', 8:'Zahndokter'	};
C_XL.d['dentist'] 				= { 0:'dentist',			1:'dentiste',			2:'dentysta',				3:'tandarts',		4:'Zahnarzt',			5:'dentista',			6:'dentista', 			7:'dentista', 8:'Zahnarzt'	};
C_XL.d['orthodontist'] 			= { 0:'orthodontist',		1:'orthodontiste',		2:'orthodontist',			3:'orthodontist',	4:'Kieferorthopäde',	5:'ortodontista',		6:'ortodoncista', 		7:'ortodontista', 8:'Kieferorthoped'	};
C_XL.d['dental prosthetist'] 	= { 0:'dental prosthetist',	1:'prothésiste',		2:'technik dentystyczny',	3:'tandtechnicus',	4:'Zahnprothetiker',	5:'odontoprotesista',	6:'protésico dental', 	7:'protésico', 8:'Zahnprothetiker'	};
C_XL.d['odontologist'] 			= { 0:'odontologist',		1:'odontologue',		2:'odontolog',				3:'odontologist',	4:'Odontologe',			5:'odontologo',			6:'odontólogo', 		7:'odontologista', 8:'Odontolog'	};

// 		technical 				english:0,				french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7, 	luxembourgish:8
C_XL.d['doctors'] 			= { 0:'Doctors',			1:'Médecins',				2:'Lekarze',			3:'artsen',				4:'Ärzte',				5:'Medici',				6:'Médicos', 				7:'Médicos', 8:'Dokteren'	};
C_XL.d['generalist'] 		= { 0:'generalist',			1:'généraliste',			2:'generalist',			3:'generalist' ,		4:'allgemeinmediziner',	5:'medico generico',	6:'médico general', 		7:'clínica geral', 8:'Allgemengmedeziner'	};
C_XL.d['specialist'] 		= { 0:'specialist',			1:'spécialiste',			2:'specjalista',		3:'specialist',			4:'Spezialist',			5:'specialista',		6:'especialista', 			7:'especialista', 8:'Spezialist'	};
C_XL.d['surgeon'] 			= { 0:'surgeon',			1:'chirurgien',				2:'chirurg',			3:'chirurg' ,			4:'chirurg',			5:'chirurgo',			6:'cirujano', 				7:'cirurgião', 8:'Chirurg'	};
C_XL.d['cardiologist'] 		= { 0:'cardiologist',		1:'cardiologue',			2:'kardiolog',			3:'cardioloog' ,		4:'kardiologe',			5:'cardiologo',			6:'cardiólogo', 			7:'cardiologista', 8:'Kardiolog'	};
C_XL.d['cosmetic surgeon'] 	= { 0:'cosmetic surgeon',	1:'chirurgien esthétique',	2:'chirurg kosmetyczny',3:'cosmetisch chirurg',	4:'schönheitschirurg',	5:'chirurgo estetico',	6:'cirujano plástico', 		7:'cirurgião plástico', 8:'Schéinheetschirurg'	};
C_XL.d['dermatologist'] 	= { 0:'dermatologist',		1:'dermatologue',			2:'dermatolog',			3:'dermatologist',		4:'dermatologe',		5:'dermatologo',		6:'dermatólogo', 			7:'dermatologista', 8:'Dermatolog'	};
C_XL.d['gastroenterologist'] = { 0:'gastroenterologist',1:'gastro-entérologue',		2:'gastroenterologist',	3:'gastro-enteroloog',	4:'gastroenterologe',	5:'gastroenterologo',	6:'gastroenterólogo', 		7:'gastroenterologista', 8:'Gastroenterolog'	};
C_XL.d['gynecologist'] 		= { 0:'gynecologist',		1:'gynécologue',			2:'ginekolog',			3:'gynaecoloog',		4:'gynäcologe',			5:'ginecologo',			6:'ginecólogo', 			7:'ginecologista', 8:'Gynekolog'	};
C_XL.d['physiotherapist'] 	= { 0:'physiotherapist',	1:'kinésithérapeute',		2:'fizjoterapeuta',		3:'fysiotherapeut',		4:'physiotherapeut',	5:'fisioterapista',		6:'fisioterapeuta', 		7:'fisioterapeuta', 8:'Physiotherapeut'	};
C_XL.d['speech therapist'] 	= { 0:'speech therapist',	1:'logopède',				2:'logopeda',			3:'logopedist' ,		4:'sprachtherapeut',	5:'logopedista',		6:'logopeda', 				7:'terapeuta da fala', 8:'Sproochtherapeut'	};
C_XL.d['oculist'] 			= { 0:'oculist',			1:'oculiste',				2:'okulista',			3:'oogarts' ,			4:'augenarzt',			5:'oculista',			6:'oculista', 				7:'oculista', 8:'Oculist'	};
C_XL.d['ophthalmologist'] 	= { 0:'ophthalmologist',	1:'ophtalmologue',			2:'okulista',			3:'oogarts' ,			4:'augenarzt',			5:'oftalmologo',		6:'oftalmólogo', 			7:'oftalmologista', 8:'Ophthalmolog'	};
C_XL.d['orthopedic'] 		= { 0:'orthopedic',			1:'orthopédiste',			2:'ortopedyczny',		3:'orthopedische',		4:'orthopäde',			5:'ortopedico',			6:'ortopedista', 			7:'ortopedista', 8:'Orthoped'	};
C_XL.d['ear nose and throat'] 	= { 0:'ear,	nose and throat',1:'oto-rhino-laryngologue',2:'uszu, nosa i gardła',3:'oor,	neus en keel',	4:'hals, nasen, ohren',	5:'otorinolaringoiatra',6:'otorrinolaringólogo', 7:'otorrinolaringologista', 8:'Ouer, Nues a Strass'	};
C_XL.d['pediatrician'] 		= { 0:'pediatrician',		1:'pédiatre',				2:'pediatra',			3:'kinderarts' ,		4:'kinderarzt',			5:'pediatra',			6:'pediatra', 				7:'pediatra', 8:'Pediater'	};
C_XL.d['podiatrist'] 		= { 0:'podiatrist',			1:'podologue',				2:'podiatrist',			3:'podoloog' ,			4:'podologe',			5:'podologo',			6:'podólogo', 				7:'podólogo', 8:'Podolog'	};
C_XL.d['lung specialist'] 	= { 0:'lung specialist',	1:'pneumologue',			2:'specjalista płuc',	3:'longarts' ,			4:'lungenspezialist',	5:'pneumologo',			6:'neumólogo', 				7:'pneumologista', 8:'Pneumolog'	};
C_XL.d['phlebologist'] 		= { 0:'phlebologist',		1:'phlébologue',			2:'phlebologist',		3:'fleboloog' ,			4:'phlebologe',			5:'flebologo',			6:'flebólogo', 				7:'flebólogo', 8:'Phlebolog'	};
C_XL.d['rheumatologist'] 	= { 0:'rheumatologist',		1:'rhumatologue',			2:'reumatolog',			3:'reumatoloog',		4:'rheumatologe',		5:'reumatologo',		6:'reumatólogo', 			7:'reumatologista', 8:'Rheumatolog'	};
C_XL.d['urologist'] 		= { 0:'urologist',			1:'urologue',				2:'urolog',				3:'uroloog' ,			4:'urologe',			5:'urologo',			6:'urólogo', 				7:'urologista', 8:'Urolog'	};
C_XL.d['senologist'] 		= { 0:'senologist',			1:'sénologue',				2:'senologist',			3:'senologist' ,		4:'senologe',			5:'senologo',			6:'mastólogo', 				7:'mastologista', 8:'Senolog'	};
C_XL.d['radiologist'] 		= { 0:'radiologist',		1:'radiologue',				2:'radiolog',			3:'radioloog' ,			4:'radiologe',			5:'radiologo',			6:'radiólogo', 				7:'radiologista', 8:'Radiolog'	};
C_XL.d['bandagist'] 		= { 0:'bandagist',			1:'bandagiste',				2:'bandagist',			3:'bandagist',			4:'Bandagist',			5:'bandagist',			6:'bandagist', 				7:'bandagist', 8:'Bandagist'	};
C_XL.d['audiologist'] 		= { 0:'audiologist',		1:'audiologue',				2:'audiolog',			3:'audioloog',			4:'audiologe',			5:'audiologo',			6:'audiólogo', 				7:'audiologista', 8:'Audiologist'	};
C_XL.d['sports doctor']		= { 0:'sports doctor',		1:'médecin sportif',		2:'lekarz sportowy',	3:'sportarts',			4:'Sportarzt',			5:'medico di sport',	6:'médico del deporte', 	7:'médico de esportes', 8:'Sportdokter'	};
C_XL.d['neurologist'] 		= { 0:'neurologist',		1:'neurologue',				2:'lekarz nerwowy',		3:'zenuwarts',			4:'Neurologe',			5:'neurologo',			6:'neurólogo', 				7:'neurologista', 8:'Neurolog'	};
C_XL.d['veterinary'] 		= { 0:'veterinary',			1:'vétérinaire',			2:'weterynaryjny',		3:'dierenarts',			4:'Veterinär',			5:'veterinario',		6:'veterinario', 			7:'veterinário', 8:'Veterinär'	};
C_XL.d['anesthetist'] 		= { 0:'anesthetist',		1:'anésthésiste',			2:'anestetysta',		3:'anesthesist',		4:'anästhesist',		5:'anestesista',		6:'anestesista', 			7:'anestesista', 8:'Anesthesist'	};
C_XL.d['sexologist'] 		= { 0:'sexologist',			1:'sexologue',				2:'seksuolog',			3:'seksuoloog',			4:'Sexualforscher',		5:'sessuologo',			6:'sexólogo', 				7:'sexologista', 8:'Sexolog'	};
C_XL.d['endocrinologist'] 	= { 0:'endocrinologist',	1:'endocrinologue',			2:'endokrynolog',		3:'endocrinoloog',		4:'Endokrinologe',		5:'endocrinologo',		6:'endocrinólogo', 			7:'endocrinologista', 8:'Endokrinolog'	};
C_XL.d['nephrologist'] 		= { 0:'nephrologist',		1:'néphrologue',			2:'nefrolog',			3:'nefroloog',			4:'Nephrologe',			5:'nefrologo',			6:'nefrólogo', 				7:'nefrologista', 8:'Nephrolog'	};
C_XL.d['oncologist'] 		= { 0:'oncologist',			1:'oncologue',				2:'onkolog',			3:'oncoloog',			4:'onkologe',			5:'oncologo',			6:'oncólogo', 				7:'oncologista', 8:'Onkolog'	};

C_XL.d['alt medicines']		= { 0:'alternative medicines',	1:'Médecines douces',		2:'alternatywne lekarstwa',	 3:'alternatieve medicijnen',		4:'alternative Medizin',	5:'Medicine alternative',	6:'Medicina alternativa', 7:'Medicina alternativa', 8:'Alternativ Medikamenter'	};

C_XL.d['acupuncturist'] 	= { 0:'acupuncturist',		1:'acupuncteur',		2:'akupunktury',		3:'acupuncteur',		4:'akupunktur',			5:'agopuntore',		6:'acupunturista', 	7:'acumputurista', 8:'Akupunkteur'	};
C_XL.d['chiropractor'] 		= { 0:'chiropractor',		1:'chiropraticien',		2:'kręgarz',			3:'chiropraxie',		4:'chiropraktiker',		5:'chiropratico',	6:'quiropráctico', 	7:'quiroprático', 8:'Chiropraktiker'	};
C_XL.d['dietitian'] 		= { 0:'dietitian',			1:'diététiste',			2:'dietetyk',			3:'diëtist',			4:'ernährungsberater',	5:'nutizionista',	6:'nutricionista', 	7:'nutricionista', 8:'Diätist'	};
C_XL.d['homeopath'] 		= { 0:'homeopath',			1:'homéopathe',			2:'homeopata',			3:'homeopaat',			4:'homöopath',			5:'omeopata',		6:'homeópata', 		7:'homeopata', 8:'Homöopath'	};
C_XL.d['kinesiologist'] 	= { 0:'kinesiologist',		1:'kinesiologue',		2:'kinesiologist',		3:'kinesiologist',		4:'kinesiologe',		5:'fisioterapista',	6:'quinesiólogo', 	7:'cinesiologista', 8:'Kinesiolog'	};
C_XL.d['osteopath'] 		= { 0:'osteopath',			1:'ostéopathe',			2:'osteopata',			3:'osteopaat',			4:'osteopath',			5:'osteopata',		6:'osteópata', 		7:'osteopata', 8:'Osteopath'	};
C_XL.d['sophrologist'] 		= { 0:'sophrologist',		1:'sophrologue',		2:'sophrologist',		3:'sophrologist',		4:'sophrologe',			5:'sofrologo',		6:'sofrólogo', 		7:'sofrologista', 8:'Sophrolog'	};
C_XL.d['art-therapist'] 	= { 0:'art-therapist',		1:'art-therapeute',		2:'terapeuta sztuki',	3:'creatief therapeut',	4:'kunsttherapeut',		5:'arte-terapeuta',	6:'arte-terapeuta', 7:'arte-terapeuta', 8:'Konschttherapeut'	};



// 		technical 				english:0,				french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7, 	luxembourgish:8

C_XL.d['psychoanalyst'] 	= { 0:'psychoanalyst',		1:'psychanalyste',		2:'psychoanalityk',		3:'psychoanalyticus',	4:'psychonanalytiker',	5:'psicanalista',	6:'psicoanalista', 		7:'psicanalista', 8:'Psychoanalyst'	};
C_XL.d['psychiatrist'] 		= { 0:'psychiatrist',		1:'psychiatre',			2:'psychiatra',			3:'psychiater',			4:'psychiater',			5:'psichiatra',		6:'psiquiatra', 		7:'psiquiatra', 8:'Psychiater'		};
C_XL.d['psychomotor'] 		= { 0:'psychomotor',		1:'psychomotricien',	2:'psychoruchowe',		3:'psychomotorische',	4:'psychomotoriker',	5:'psicomotricista',6:'psicomotricista', 	7:'psicomotricista', 8:'Psychomotoriker'	};
C_XL.d['psychologist'] 		= { 0:'psychologist',		1:'psychologue',		2:'psycholog',			3:'psycholoog',			4:'psychologe',			5:'psicologo',		6:'psicólogo', 			7:'psicólogo', 8:'Psycholog'		};
C_XL.d['psychotherapist'] 	= { 0:'psychotherapist',1:'psychothérapeute',		2:'psychoterapeuta',	3:'psychotherapeut',	4:'psychotherapeut',	5:'psicoterapeuta',	6:'psicoterapeuta', 	7:'psicoterapeuta', 8:'Psychotherapeut'	};


C_XL.d['beautician'] 	= { 0:'beautician',		1:'esthéticien',		2:'kosmetyczka',	3:'schoonheidsspecialist',	4:'kosmetikerin',				5:'estetista',		6:'esteticista',	7:'esteticista', 8:'Estheticien'	};
C_XL.d['hairdresser'] 	= { 0:'hairdresser',	1:'coiffeur',			2:'fryzjer',		3:'kapper',					4:'friseur',					5:'parrucchiere',	6:'peluquero', 		7:'cabeleireiro', 8:'Coiffeur'	};
C_XL.d['masseur'] 		= { 0:'masseur',		1:'masseur',			2:'masażysta',		3:'masseur',				4:'massagetherapeut',			5:'massaggiatore',	6:'masajista',		7:'massagista', 8:'Masséierer'	};
C_XL.d['pedicure'] 		= { 0:'pedicure',		1:'pédicure',			2:'pedicure',		3:'pedicure',				4:'pedicure',					5:'pedicura',		6:'pedicura', 		7:'pedicura', 8:'Pedicure'	};
C_XL.d['tattooist'] 	= { 0:'tattooist',		1:'tatoueur',			2:'tattooist',		3:'tatoeëerder',			4:'tätowierer',					5:'tatuatore',		6:'tatuador', 		7:'tatuador', 8:'Tatoueur'	};


C_XL.d['teacher'] 		= { 0:'teacher',		1:'enseignant',			2:'nauczyciel',		3:'leraar',				4:'Lehrer',				5:'insegnante',				6:'profesor', 				7:'professor', 8:'Enseignant'	};
C_XL.d['assistant']		= { 0:'assistant',		1:'assistant(e)',		2:'asystent',		3:'assistent',			4:'assistent',			5:'assistente',				6:'asistente', 				7:'assistente', 8:'Assistent'	};
C_XL.d['nurse']			= { 0:'nurse',			1:'infirmier',			2:'pielęgniarka',	3:'verpleegster',		4:'krankenpfleger',		5:'infermiera',				6:'enfermero', 				7:'enfermeiro', 8:'Infirmier'	};
C_XL.d['secretary']		= { 0:'secretary',		1:'secrétaire',			2:'sekretarz',		3:'secretaris',			4:'sekretär',			5:'segretaria',				6:'secretário', 			7:'secretário', 8:'Sekretär'	};
C_XL.d['realtor']		= { 0:'realtor',		1:'agent immobilier',	2:'pośrednik',		3:'vastgoed makelaar',	4:'immobilienmakler',	5:'agente immobiliare',		6:'agente inmobiliario', 	7:'agente imobiliário', 8:'Immobiliemakler'	};
C_XL.d['agent'] 		= { 0:'agent',			1:'agent',				2:'agent',			3:'agent',				4:'agent',				5:'agente',					6:'agente', 				7:'funcionário', 8:'Agent'	};
C_XL.d['technician'] 	= { 0:'technician',		1:'technicien',			2:'technik',		3:'technicus',			4:'techniker',			5:'tecnico',				6:'técnico', 				7:'técnico', 8:'Techniker'	};
C_XL.d['broker'] 		= { 0:'broker',			1:'courtier',			2:'pośrednik',		3:'makelaar',			4:'makler',				5:'broker',					6:'corredor', 				7:'corretor de câmbios', 8:'Broker'	};
C_XL.d['manager'] 		= { 0:'manager',		1:'responsable',		2:'kierownik',		3:'manager',			4:'manager',			5:'responsabile',			6:'responsable', 			7:'decisor', 8:'Manager'	};
C_XL.d['consultant'] 	= { 0:'manager',		1:'consultant',			2:'konsultant',		3:'consultant',			4:'berater',			5:'consulente',				6:'consultor', 				7:'consultor', 8:'Consultant'	};
C_XL.d['lawyer'] 		= { 0:'lawyer',			1:'avocat',				2:'prawnik',		3:'advocaat',			4:'anwalt',				5:'avvocato',				6:'abogado', 				7:'advogado', 8:'Affekot'	};
C_XL.d['judge'] 		= { 0:'judge',			1:'juge',				2:'sędzia',			3:'rechter',			4:'richter',			5:'giudice',				6:'juez', 					7:'juiz', 8:'Riichter'	};
C_XL.d['notary'] 		= { 0:'notary',			1:'notaire',			2:'notariusz',		3:'notaris',			4:'notar',				5:'notaio',					6:'notario', 				7:'notário', 8:'Notaire'	};
C_XL.d['salesperson'] 	= { 0:'sales person',	1:'délégué commercial',	2:'sprzedawca',		3:'afgevaardigde',		4:'vertriebspersonal',	5:'rappresentante commerciale',	6:'delegado comercial', 7:'delegado comercial', 8:'Verkeefer'	};

C_XL.d['other pro'] 	= { 0:'other profession',	1:'autre profession',	2:'inny zawód',		3:'ander beroep',		4:'anderer Beruf',		5:'altra professione',		6:'otra profesión', 7:'outra profissão', 8:'aner Beruff'	};




	//  C_iSEC
	//
C_XL.d['prof sector'] 	= { 0:'Industry/sector',	1:'Secteur d\'activité',	2:'Przemysł',		3:'Industrie/sector',	4:'Industrie/Branche',	5:'Settore di attività',	6:'Sector de actividad', 7:'Setor de atividade', 8:'Industrie/Secteur' };

C_XL.d['medical sector'] 		= { 0:'Medical sector',				1:'Secteur médical',			2:'Sektor medyczny',			3:'Medische sector',				4:'Medizinische Branche',		5:'Settore medico',				6:'Sector médico', 				7:'Setor médico', 8:'Medizinesche Secteur'	};
C_XL.d['general medecine'] 		= { 0:'general medecine',			1:'médecine générale',			2:'medycyna ogólna',			3:'algemene geneeskunde',			4:'allgemeinmedizin',			5:'medicina generica',			6:'medicina general', 			7:'clínica geral', 8:'Allgemeng Medezin'	};
C_XL.d['specialized medecine'] 	= { 0:'specialized medecine',		1:'médecine spécialisée',		2:'medycyny specjalistycznej',	3:'gespecialiseerde geneeskunde',	4:'Spezialisierte Medizin',		5:'medicina specializzata',		6:'medicina especializada', 	7:'medicina especializada', 8:'Spezialiséiert Medezin'	};
C_XL.d['dental clinic'] 		= { 0:'dental clinic',				1:'clinique dentaire',			2:'klinika dentystyczna',		3:'tandheelkundige kliniek',		4:'Zahnarztpraxis',				5:'clinica dentale',			6:'clínica dental', 			7:'clínica odontológica', 8:'Zahnarztklinik'	};
C_XL.d['private practice'] 		= { 0:'private practice',			1:'cabinet privé',				2:'prywatna praktyka',			3:'particuliere praktijk',			4:'Private Praxis',				5:'studio privato',				6:'consultorio privado', 		7:'consultório particular', 8:'Privat Praxis'	};
C_XL.d['laboratory'] 			= { 0:'laboratory',					1:'laboratoire',				2:'laboratorium',				3:'laboratorium',					4:'Labor',						5:'laboratorio',				6:'laboratorio', 				7:'laboratório', 8:'Labo'			};
C_XL.d['medical secretariat'] 	= { 0:'medical secretariat',		1:'secrétariat médical',		2:'sekretarka medyczna',		3:'medisch secretariaat',			4:'Medizinisches Sekretariat',	5:'segreteria medica',			6:'secretaría médica', 			7:'secretariado médico', 8:'Medizinescht Sekretariat'	};
C_XL.d['multidis clinic'] 		= { 0:'multidisciplinary clinic',	1:'clinique multidisciplinaire',2:'wielodyscyplinarny clinic',	3:'multidisciplinaire kliniek',		4:'Multidisziplinäre Praxis',	5:'clinica multidisciplinare',	6:'clínica multidisciplinaria', 7:'clínica multidisciplinar', 8:'Multidisziplinär Klinik'	};
C_XL.d['hospital'] 				= { 0:'hospital',					1:'hopital',					2:'szpital',					3:'ziekenhuis',						4:'Krankenhaus',				5:'ospedale',					6:'hospital', 					7:'hospital', 8:'Spidol'			};

// 		technical 				english:0,				french:1,					polish:2,				dutch:3,				german:4,				italian:5,				spanish:6,					portuguese:7, 	luxembourgish:8
		
C_XL.d['wellness and aesthetic']= { 0:'Wellness and aesthetic',		1:'Bien être et esthétique',	2:'Zdrowotne i estetyczne',	3:'Wellness en esthetische',	4:'Wellness und Ästhetik',	5:'Benessere ed estetica',	6:'Bienestar y estética', 	7:'Bem-estar e estética', 8:'Wellness a Ästhetik'	};
C_XL.d['alternative medicine'] 	= { 0:'alternative Medicine',		1:'Medecine douce',				2:'Medycyna alternatywna',	3:'alternatieve geneeskunde',	4:'alternative Medizin',	5:'Medicina alternativa',	6:'Medicina alternativa', 	7:'Medicina alternativa', 8:'Alternativ Medezin'	};
C_XL.d['psychology'] 			= { 0:'Psychology',					1:'Psychologie',				2:'Psychologia',			3:'psychologie',				4:'Psychologie',			5:'Psicologia',				6:'Psicología', 			7:'Psicologia', 8:'Psychologie'	};
C_XL.d['aesthetic & wellness'] 	= { 0:'aesthetic & wellness',		1:'Esthétique & bien être',		2:'Estetyka i wellness',	3:'esthetiek en welzijn',		4:'Beauty & Wellness',		5:'Estetica & benessere',	6:'Estética y bienestar', 	7:'Estética e bem estar', 8:'Ästhetik & Wellness'	};
C_XL.d['fitness'] 				= { 0:'Fitness',					1:'Centre de fitness',			2:'Siłownia',				3:'fitnesscentrum',				4:'Fitnesscenter',			5:'Centro fitness',			6:'Centro de fitness', 		7:'Centro de fitness', 8:'Fitness'	};
C_XL.d['clairvoyance'] 			= { 0:'Clairvoyance',				1:'Voyance',					2:'Jasnowidzenie',			3:'Helderziendheid',			4:'Hellseherei',			5:'Chiaroveggenza',			6:'clarividencia', 			7:'Clarividência', 8:'Hellseherei'	};
		
C_XL.d['agences & services'] 	= { 0:'agences & services',			1:'agences & services',			2:'agencje i usługi',		3:'agentschappen en diensten',	4:'agenturen & Dienste',	5:'agenzie e servizi',		6:'agencias y servicios', 			7:'agências e serviços', 8:'Agence & Servicer'	};
C_XL.d['legal sector'] 			= { 0:'legal sector',				1:'profession libérale',		2:'sektor prawny',			3:'juridische sector',			4:'Rechtsbereich',			5:'professione liberale',	6:'profesión liberal', 				7:'profissão liberal', 8:'Rechtsberäich'	};
C_XL.d['real estate'] 			= { 0:'real estate',				1:'immobilier',					2:'nieruchomość',			3:'vastgoed',					4:'Immobilien',				5:'immobiliare',			6:'inmobiliario', 					7:'imobiliário', 8:'Immobilien'		};
C_XL.d['outplacement'] 			= { 0:'outplacement',				1:'agence d\'interim',			2:'urząd okresowe',			3:'interim office',				4:'Vermittlungsbüro',		5:'agenzia interinale',		6:'agencia de trabajo temporal', 	7:'agência temporária', 8:'Interimsbüro'	};
C_XL.d['recruitment'] 			= { 0:'recruitment',				1:'recrutement',				2:'rekrutacja',				3:'werving',					4:'Rekrutierung',			5:'reclutamento',			6:'reclutamiento', 					7:'recrutamento', 8:'Rekrutéierung'		};
C_XL.d['gaming'] 				= { 0:'Gaming',						1:'Jeux et distraction',		2:'Gry i rozrywki',			3:'Gaming & afleiding',			4:'Gaming',					5:'Giochi e animazione',	6:'Juegos y entretenimiento', 		7:'Jogos e entretenimento', 8:'Spiller a Spaass'	};
C_XL.d['consultancy'] 			= { 0:'consultancy',				1:'conseil',					2:'doradztwo',				3:'consultancy',				4:'Beratung',				5:'consulenza',				6:'consultoría', 					7:'aconselhamento', 8:'Berodung'	};
C_XL.d['commercial division'] 	= { 0:'commercial division',		1:'division commerciale',		2:'Wydział',				3:'commerciële afdeling',		4:'Vertriebsabteilung',		5:'divisione commerciale',	6:'división comercial', 			7:'divisão comercial', 8:'Handelsdivisioun'	};
C_XL.d['automotive maintenance']= { 0:'automotive maintenance',		1:'maintenance automobile',		2:'automotive konserwacji',	3:'auto-onderhoud',				4:'Fahrzeugwartung',		5:'manutenzione automobile',6:'mantenimiento automóviles', 		7:'manutenção automóvel', 8:'Autoservice'	};
C_XL.d['public service']		= { 0:'public service',				1:'service publique',			2:'public service',			3:'overheidsdienst',			4:'Öffentliche Dienste',	5:'servizio pubblico',		6:'servicio público', 				7:'serviço público', 8:'Ëffentlechen Déngscht'	};

C_XL.d['financial'] 			= { 0:'Financial',			1:'Financier',		2:'Financial',			3:'FinacIëel',		4:'Finanzen',		5:'Finanza',		6:'Finanzas', 		7:'Financeiro', 8:'Finanziell'	};
C_XL.d['insurance'] 			= { 0:'Insurance',			1:'assurance',		2:'Ubezpieczenie',		3:'Verzekering',	4:'Versicherungen',	5:'assicurazione',	6:'Seguros', 		7:'Seguro', 8:'Versécherung'	};
C_XL.d['bank'] 					= { 0:'Bank',				1:'Banque',			2:'Bank',				3:'Bank',			4:'Bankwesen',		5:'Banca',			6:'Banco', 			7:'Banca', 8:'Bank'	};
C_XL.d['fiscal'] 				= { 0:'Fiscal',				1:'Fiscal',			2:'Fiskalny',			3:'Fiscale',		4:'Steuern',		5:'Fiscale',		6:'Fiscal', 		7:'Fiscal', 8:'Fiskal'	};
C_XL.d['accounting'] 			= { 0:'accounting',			1:'Comptabilité',	2:'Rachunkowości',		3:'accounting',		4:'Buchhaltung',	5:'Contabilità',	6:'Contabilidad', 	7:'Contabilidade', 8:'Buchhaltung'	};

C_XL.d['building'] 				= { 0:'Building',			1:'Construction',	2:'Budowa',				3:'Gebouw',			4:'Bau',			5:'Costruzione',		6:'Construcción', 	7:'Construção', 8:'Bauen'		};
C_XL.d['structural'] 			= { 0:'Structural work',	1:'Gros oeuvre',	2:'Roboty budowlane',	3:'Ruwbouw',		4:'Rohbauarbeiten',	5:'Lavori strutturali',	6:'Obras gruesas', 	7:'Grandes obras', 8:'Strukturaarbecht'	};
C_XL.d['completion'] 			= { 0:'Completion',			1:'Parachèvement',	2:'Ukończenie',			3:'Voltooiing',		4:'Fertigstellung',	5:'Finiture',			6:'Finalización', 	7:'acabamentos', 8:'Ofschlossaarbecht'	};
C_XL.d['heating'] 				= { 0:'Heating',			1:'Chauffage',		2:'Ogrzewanie',			3:'Verwarming',		4:'Heizung',		5:'Riscaldamento',		6:'Calefacción', 	7:'aquecimento', 8:'Heizung'		};
C_XL.d['electricity'] 			= { 0:'Electricity',		1:'Electricité',	2:'Elektryczność',		3:'Elektriciteit',	4:'Strom',			5:'Elettricità',		6:'Electricidad', 	7:'Eletricidade', 8:'Elektrizitéit'	};


	
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
									7:'sou novo no Mobminder',
									8:'ech sinn nei bei Mobminder'	};
								
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
								7:'mudanças no dia atual',
								8:'Ännerungen um aktuellen Dag'	};	
								
C_XL.d['smappmenu notif in week'] = { 0:'changes in the current week', 		// option to be chosen under / left drawer / notifications / agenda
								1:'modifications dans la semaine courante',	
								2:'zmiany w bieżącym tygodniu',		
								3:'veranderingen in de huidige week',		
								4:'Änderungen in der aktuellen Woche',	
								5:'cambiamenti nella settimana corrente',	
								6:'cambios en la semana actual',
								7:'mudanças na semana atual',
								8:'Ännerungen an der aktueller Woch'	};	
	
// smartapp update scenario:
	
C_XL.d['please update application'] = { 
    0:'a new version of this application is avalable.',
    1:'une nouvelle version de l\'application est disponible.',	
    2:'Nowa wersja tej aplikacji jest dostępna.', // polish
    3:'Een nieuwe versie van deze applicatie is beschikbaar.', // dutch
    4:'Eine neue Version dieser Anwendung ist verfügbar.', // german
    5:'Una nuova versione di questa applicazione è disponibile.', // italian
    6:'Una nueva versión de esta aplicación está disponible.', // spanish
    7:'Uma nova versão desta aplicação está disponível.', // portuguese
    8:'Eng nei Versioun vun dëser Applikatioun ass verfügbar.' // luxembourgish
};

C_XL.d['update now'] = { 
    0:'update now',	// english
    1:'mettre à jour maintenant',	// french
    2:'zaktualizuj teraz',	// polish
    3:'nu bijwerken',	// dutch
    4:'jetzt aktualisieren',	// german
    5:'aggiorna ora',	// italian
    6:'actualizar ahora',	// spanish
    7:'atualizar agora',	// portuguese
    8:'elo aktualiséieren'	// luxembourgish
};

C_XL.d['update later'] = { 
    0:'remember me later',	// english
    1:'me le rappeler plus tard',	// french
    2:'przypomnij mi później',	// polish
    3:'herinner me later',	// dutch
    4:'mich später erinnern',	// german
    5:'ricordamelo più tardi',	// italian
    6:'recuérdame más tarde', 	// spanish
    7:'lembre-me mais tarde',	// portuguese
    8:'erënnert mech méi spéit'	// luxembourgish
};
								

// 		technical 				english:0,					french:1,					polish:2,					dutch:3,					german:4,				italian:5,						spanish:6,				portuguese:7, 	luxembourgish:8	
C_XL.d['chnlname apptm']	= C_XL.d['appointments'];
C_XL.d['chnlname chats']	= C_XL.d['chats'];
	
C_XL.d['chnldesc apptm']	= { 0:'changes in your agenda',	1:'changements dans votre agenda',	2:'zmiany w Twoim programie',	3:'veranderingen in uw agenda',	4:'Änderungen in Ihrer Agenda',	5:'cambiamenti nella tua agenda',	6:'cambios en tu agenda', 		7:'mudanças na sua agenda', 	8:'Ännerungen an Ärer Agenda'	};
C_XL.d['chnldesc chats']	= { 0:'new chat messages',		1:'nouveaux messages chat',			2:'nowe wiadomości na czacie',	3:'nieuwe chat berichten',		4:'neue Chat-Nachrichten',		5:'nuovi messaggi di chat',			6:'nuevos mensajes de chat', 	7:'novas mensagens de chat', 	8:'Nei Chat-Noriichten'	};
	
	
				// use with C_XL.d['current day']
				// 			C_XL.d['current week']

C_XL.d['manychanges apptm'] = { 0:'many changes appeared', // in the current day OR in the current week
								1:'plusieurs changement sont apparus',	
								2:'pojawiło się zmian',		
								3:'er zijn veranderingen opgetreden',		
								4:'Änderungen erschienen',	
								5:'apparvero molti cambiamenti',	
								6:'aparecieron cambios',
								7:'mudanças apareceram',
								8:'Vill Ännerungen sinn erschéngen'	};	
		
	// notification of a change in the same day
		
	
								
C_XL.d['notif same day app added'] = { 0:'an appointment was added at {0}', 	// 16:30  <= time format to use
								1:'un rendez-vous a été ajouté à {0}',	
								2:'termin został dodany o godzinie {0}',		
								3:'een afspraak werd toegevoegd om {0}',		
								4:'Ein Termin wurde um {0} hinzugefügt',	
								5:'è stato aggiunto un appuntamento alle {0}',	
								6:'se agregó una cita a las {0}',
								7:'um compromisso foi adicionado às {0}',
								8:'En Rendez-vous gouf ëm {0} derbäigesat'	};
								
C_XL.d['notif same day app cancelled'] = { 0:'the {0} appointment has been canceled', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été annulé',	
								2:'spotkanie o godzinie {0} zostało odwołane',		
								3:'de afspraak van {0} is geannuleerd',		
								4:'Der Termin um {0} wurde abgesagt',	
								5:'l\'appuntamento delle {0} è stato annullato',	
								6:'la cita de las {0} ha sido cancelada',
								7:'o compromisso das {0} foi cancelado',
								8:'Den Rendez-vous um {0} gouf ofgesot'	};
								
C_XL.d['notif same day app changed'] = { 0:'the {0} appointment has been modified', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été modifié',	
								2:'spotkanie {0} zostało zmienione',		
								3:'de afspraak van {0} is gewijzigd',		
								4:'Der Termin um {0} wurde geändert',	
								5:'l\'appuntamento delle {0} è stata modificata',	
								6:'la cita de las {0} ha sido cambiada',
								7:'a compromisso das {0} foi alterada',
								8:'Den Rendez-vous um {0} gouf geännert'	};
								
C_XL.d['notif same day app postponed'] = { 0:'the {0} appointment has been postponed', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été postposé',	
								2:'spotkanie o godzinie {0} zostało przełożone',		
								3:'de afspraak van {0} is uitgesteld',		
								4:'Der Termin um {0} wurde verschoben',	
								5:'l\'appuntamento delle {0} è stato rinviato',	
								6:'la reunión de las {0} ha sido pospuesta',
								7:'a compromisso das {0} foi adiada',
								8:'Den Rendez-vous um {0} gouf verréckelt'	};
	
								
C_XL.d['notif same day app moved'] = { 0:'the {0} appointment has been moved', 	// 16:30  <= time format to use
								1:'le rendez-vous de {0} a été déplacé',	
								2:'spotkanie o 15:00 zostało przeniesione',		
								3:'de afspraak van {0} is verplaatst',		
								4:'Der Termin um {0} wurde verschoben',	
								5:'l\'appuntamento delle {0} è stata spostata',	
								6:'la cita de las {0} se ha movido',
								7:'{0} compromisso foi movido',
								8:'Den Rendez-vous um {0} gouf geplënnert'	};


	// notification of a change not in the current day
	
	// 	[ technical name ] 		// english:0,				
	//							// french:1,			
								// polish:2,			
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7, 	luxembourgish:8
								
C_XL.d['notif diff day app added'] = { 0:'an appointment was added next {1} at {0}', 	// {0} si the time, 16:30  <= time format to use
								1:'un rendez-vous a été ajouté le {1} à {0}',			// {1} is the weekday, 16:30  <= time format to use
								2:'termin został dodany w {1} o {0}',		
								3:'er is een afspraak toegevoegd op {1} om {0}',		
								4:'Ein Termin wurde am {1} um {0} Uhr hinzugefügt.',	
								5:'è stato aggiunto un appuntamento {1} alle ore {0}',	
								6:'Se agregó una cita el {1} a las {0}.',
								7:'um compromisso foi adicionado no {1} às {0}.',
								8:'En Rendez-vous gouf op {1} um {0} derbäigesat'	};

C_XL.d['notif diff day app cancelled'] = { 0:'the appointment on {1} at {0} has been canceled', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été annulé',	
								2:'wizyta w {1} godz. {0} została odwołana',		
								3:'de afspraak van {1} om {0} is geannuleerd',		
								4:'Das Termin am {1} um {0} wurde abgesagt',	
								5:'l\'appuntamento di {1} alle {0} è stato annullato',	
								6:'la cita del {1} a las {0} ha sido cancelada',
								7:'o compromisso de {1} às {0} foi cancelado',
								8:'Den Rendez-vous um {0} den {1} gouf ofgesot'	};

C_XL.d['notif diff day app changed'] = { 0:'the appointment on {1} at {0} has been modified', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été modifié',	
								2:'termin na {1} godz. {0} został zmieniony',		
								3:'de afspraak van {1} om {0} is gewijzigd',		
								4:'Das Termin am {1} um {0} wurde geändert',	
								5:'l\'appuntamento di {1} alle {0} è stato modificato',	
								6:'Se ha modificado la cita del {1} a las {0}.',
								7:'a compromisso de {1} às {0} foi alterado',
								8:'Den Rendez-vous um {0} den {1} gouf geännert'	};

C_XL.d['notif diff day app postponed'] = { 0:'the appointment originaly on {1} at {0} has been postponed', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été postposé',	
								2:'termin na {1} godz. {0} został przełożony',		
								3:'de afspraak van {1} om {0} is uitgesteld',		
								4:'Das Termin am {1} um {0} wurde verschoben',	
								5:'l\'appuntamento di {1} alle {0} è stato rinviato',	
								6:'la del {1} a las {0} ha sido pospuesta',
								7:'a compromisso de {1} às {0} foi adiada',
								8:'Den Rendez-vous um {0} den {1} gouf verréckelt'	};

C_XL.d['notif diff day app moved'] = { 0:'the appointment on {1} at {0} has been moved', 	// 16:30  <= time format to use
								1:'le rendez-vous du {1} à {0} a été déplacé',	
								2:'termin na {1} godz. {0} został przesunięty',		
								3:'de afspraak van {1} om {0} is verplaatst',		
								4:'Das Termin am {1} um {0} wurde verschoben',	
								5:'l\'appuntamento di {1} alle {0} è stata spostata',	
								6:'Se ha trasladado la cita del {1} a las {0}',
								7:'o compromisso de {1} às {0} foi movida',
								8:'Den Rendez-vous um {0} den {1} gouf geplënnert'	};

/*     C_iYEAR     */

	// 	[ technical name ] 		// english:0,		keevin@mobminder.com		
	//							// french:1,			
								// polish:2,			+32483371160
								// dutch:3,			
								// german:4,			
								// italian:5,		
								// spanish:6,			
								// portuguese:7, 	luxembourgish:8		
C_XL.d['iyear-bp-invite'] = {
	0:'Here you can draw public holidays, days off or sick days. They appear on the schedule as closed days. In the settings and preferences, on the "colors" tab, you can create colors, patterns and tags applicable to off days.',
	1:'vous pouvez ici dessiner les jours fériés, les jours de congé ou de maladie, Ils apparaissent sur le planning comme des journées fermées. Dans les réglages et préférences, sur l\'onglet "couleurs", vous pouvez créer des couleurs, motifs et tags applicables aux congés.',	
	2:'Tutaj możesz narysować święta, dni wolne czy dni chorobowe. Pojawią się one na harmonogramie jako dni wolne. W ustawieniach i preferencjach, w zakładce „kolory”, możesz stworzyć kolory, wzory i znaczniki odpowiednie dni wolnych.',	
	3:'Hier kunt u feestdagen, vrije dagen of ziektedagen tekenen, deze verschijnen op het rooster als gesloten dagen. In de instellingen en voorkeuren, op het tabblad "kleuren", kunt u kleuren, patronen en tags aanmaken die van toepassing zijn op verlofs.',	
	4:'Hier können Sie Feiertage, arbeitsfreie Tage oder Krankheitstage eintragen. Diese erscheinen im Terminkalender als geschlossene Tage.  In den Einstellungen und Präferenzen können Sie auf der Registerkarte „Farben“ Farben, Muster und Tags für arbeitsfreie Tage.',	
	5:'Qui è possibile disegnare i giorni festivi, i giorni liberi o i giorni di malattia che verranno visualizzati nel programma come giorni di chiusura. Nelle impostazioni e preferenze, nella scheda "colori", puoi creare colori, motivi e tag applicabili ai giorni liberi.',	
	6:'Aquí se pueden sacar días festivos, días libres o días de enfermedad, que aparecen en la programación como días cerrados. En la configuración y preferencias, en la pestaña "colores", puedes crear colores, patrones y etiquetas aplicables a días libres.',	
	7:'Aqui você pode sortear feriados, folgas ou licenças médicas, que aparecem na agenda como dias fechados. Nas configurações e preferências, na aba “cores”, você pode criar cores, padrões e tags aplicáveis a dias de folga.',
	8:'Hei kënnt Dir Feierdeeg, Fräizäiten oder Krankheetsdeeg eranzeechnen. Dës ginn am Zäitplang als zou Deeg ugewisen. An den Astellunge bei "Faarwen" kënnt Dir Faarwen, Musteren a Tags fir Fräizäiten erstellen.' 
};

/*     C_iAManager     */

C_XL.d['tip-iam-email']	= { 
	0:'Click to copy $aname$\'s email address to the clipboard<br/>You can simply paste it into your email manager',	// english
	1:'Cliquez pour copier sur le presse papier l\'adresse email de $aname$<br/>Vous pouvez simplement la coller dans votre gestionnaire d\'e-mails',	// french
	2:'Kliknij, aby skopiować adres e-mail użytkownika $aname$ do schowka<br/>Możesz po prostu wkleić go do swojego menedżera poczty e-mail',	// polish
	3:'Klik om het e-mailadres van $aname$ naar het klembord te kopiëren<br/>Je kunt het eenvoudig in je e-mailbeheer plakken',	// dutch
	4:'Klicken Sie hier, um die E-Mail-Adresse von $aname$ in die Zwischenablage zu kopieren<br/>Sie können sie einfach in Ihren E-Mail-Manager einfügen',	// german
	5:'Fare clic per copiare sulla stampante cartacea l\'indirizzo e-mail di $aname$<br/>Puoi semplicemente incollarlo nel tuo gestore di posta elettronica',	// italian
	6:'Haz clic para copiar la dirección de correo electrónico de $aname$ al portapapeles<br/>Puedes simplemente pegarla en tu administrador de correo electrónico', 	// spanish
	7:'Clique para copiar o endereço de e-mail de $aname$ para a área de transferência<br/>Você pode simplesmente colá-lo em seu gerenciador de e-mail',	// portuguese
	8:'Klickt fir d\'E-Mail-Adress vum $aname$ an d\'Zwëschenablage ze kopéieren<br/>Dir kënnt et einfach an Äre Mail-Manager aléisen.' 
};	

C_XL.d['tip-iam-mobile']	= { 
	0:'Click to copy the $aname$\'s number to the clipboard<br/>All you have to do is paste it into your contact manager',	// english
	1:'Cliquez pour copier sur le presse papier le numéro de $aname$<br/>Il ne reste qu\'à le coller dans votre gestionnaire de contacts',	// french
	2:'Kliknij, aby skopiować numer $aname$ do schowka<br/>Wystarczy, że wkleisz go do menedżera kontaktów',	// polish
	3:'Klik om het $aname$-nummer naar het klembord te kopiëren<br/>Het enige wat u hoeft te doen is het in uw contactbeheer te plakken',	// dutch
	4:'Klicken Sie, um die $aname$-Nummer in die Zwischenablage zu kopieren<br/>Sie müssen sie nur noch in Ihren Kontaktmanager einfügen',	// german
	5:'Fai clic per copiare il numero $aname$ negli appunti<br/>Tutto quello che devi fare è incollarlo nel tuo gestore contatti',	// italian
	6:'Haz clic para copiar el número $aname$ al portapapeles<br/>Todo lo que tienes que hacer es pegarlo en tu administrador de contactos', 	// spanish
	7:'Clique para copiar o número $aname$ para a área de transferência<br/>Tudo que você precisa fazer é colá-lo em seu gerenciador de contatos',	// portuguese
	8:'Klickt fir d\'Nummer vum $aname$ an d\'Zwëschenablage ze kopéieren<br/>Alles wat Dir maache musst, ass et an Ären Kontaktmanager anzefügen.' 
};	

C_XL.d['tip-iam-www']	= { 
	0:'Click to open this information page in a new tab.',	// english
	1:'Cliquer pour ouvrir cette page d\'information dans un nouvel onglet.',	// french
	2:'Kliknij, aby otworzyć tę stronę informacyjną w nowej karcie.',	// polish
	3:'Klik om deze informatiepagina in een nieuw tabblad te openen.',	// dutch
	4:'Klicken Sie hier, um diese Informationsseite in einem neuen Tab zu öffnen.',	// german
	5:'Fare clic per aprire questa pagina di informazioni in una nuova scheda.',	// italian
	6:'Haga clic para abrir esta página de información en una nueva pestaña.', 	// spanish
	7:'Clique para abrir esta página de informações em uma nova guia.',	// portuguese
	8:'Klickt fir dës Informatiounssäit an engem neien Tab opzemaachen.' 
};

/*     M_iSECURITY     */


C_XL.d['secur-h2']	= { 0:'We are proud to inform you that mobminder has never been hacked.',	// english
					1:'nous sommes fiers de vous informer que mobminder n\'a jamais été piraté.',	// french
					2:'Z dumą informujemy, że mobminder nigdy nie został zhakowany.',	// polish
					3:'Met trots kunnen wij u mededelen dat mobminder nog nooit is gehackt.',	// dutch
					4:'Wir sind stolz, Ihnen mitteilen zu können, dass Mobminder noch nie gehackt wurde.',	// german
					5:'Siamo orgogliosi di informarti che Mobminder non è mai stato violato.',	// italian
					6:'Estamos orgullosos de informarle que mobminder nunca ha sido pirateado.', 	// spanish
					7:'Temos o orgulho de informar que o mobminder nunca foi hackeado.',	// portuguese
					8:'Mir si stolz Iech matzedeelen, datt Mobminder nach ni gehackt gouf.' // luxembourgish
};

C_XL.d['secur-msg']	= { 0:'In order to protect your data and preserve this situation, we ask you to change your identifiers now.',	// english
					1:'afin de protéger vos données et de préserver cette situation, nous vous demandons de changer maintenant vos identifiants.',	// french
					2:'Aby chronić Twoje dane i zachować tę sytuację, prosimy Cię o zmianę identyfikatorów już teraz.',	// polish
					3:'Om uw gegevens te beschermen en deze situatie te behouden, vragen wij u nu uw identificatiegegevens te wijzigen.',	// dutch
					4:'Um Ihre Daten zu schützen und diese Situation aufrechtzuerhalten, bitten wir Sie, Ihre Kennungen jetzt zu ändern.',	// german
					5:'Per proteggere i tuoi dati e preservare questa situazione, ti chiediamo di modificare ora i tuoi identificatori.',	// italian
					6:'Para proteger sus datos y preservar esta situación, le pedimos que cambie sus identificadores ahora.', 	// spanish
					7:'Para proteger os seus dados e preservar esta situação, pedimos-lhe que altere já os seus identificadores.',	// portuguese
					8:'Fir Är Donnéeën ze schützen an dës Situatioun ze erhalen, bieden mir Iech elo Är Identifikatioune z\'änneren.' // luxembourgish
};

C_XL.d['secur-action']	= { 0:'renew my login details.',	// english
					1:'renouveler mes identifiants',	// french
					2:'odnów moje dane logowania.',	// polish
					3:'vernieuw mijn inloggegevens.',	// dutch
					4:'meine Anmeldedaten erneuern.',	// german
					5:'rinnovare i miei dati di accesso.',	// italian
					6:'renovar mis datos de acceso.', 	// spanish
					7:'renovar meus dados de login.',	// portuguese
					8:'meng Login Detailer erneieren.' // luxembourgish
};


/*    C_iCREDS    */

C_XL.d['creds-caption']	= { 0:'suggestions',	// english
	1:'suggestions',	// french
	2:'propozycje',	// polish
	3:'suggesties',	// dutch
	4:'Vorschläge',	// german
	5:'suggerimenti',	// italian
	6:'sugerencias', 	// spanish
	7:'sugestões',	// portuguese
	8:'Virschléi'	// luxembourgish
};

C_XL.d['creds-sugg-header-ok']	= { 0:'Choose from the suggestions below. Feel free to modify it afterwards.',	// english
	1:'Choisissez ci-dessous parmis les suggestions. N\'hésitez pas à la modifier ensuite.',	// french
	2:'Wybierz jedną z poniższych sugestii. Możesz go później zmodyfikować.',	// polish
	3:'Maak een keuze uit onderstaande suggesties. Voel je vrij om het daarna aan te passen.',	// dutch
	4:'Wählen Sie aus den folgenden Vorschlägen. Fühlen Sie sich frei, es nachträglich zu ändern.',	// german
	5:'Scegli tra i suggerimenti qui sotto. Sentiti libero di modificarlo in seguito.',	// italian
	6:'Elija entre las sugerencias a continuación. No dudes en modificarlo después.', 	// spanish
	7:'Escolha entre as sugestões abaixo. Sinta-se à vontade para modificá-lo posteriormente.',	// portuguese
	8:'Wielt eng vun de Virschléi hei drënner. Fillt Iech fräi, se dono z\'änneren.' // luxembourgish
};

C_XL.d['creds-sugg-header-nok']	= { 0:'To see suggestions, please first complete your contact details (email, mobile number, first and last name).',	// english
	1:'Pour voir des suggestions, SVP complétez d\'abord vos coordonnées (email, No de mobile, prénom et nom).',	// french
	2:'Aby zobaczyć propozycje, prosimy najpierw o uzupełnienie danych kontaktowych (e-mail, numer telefonu komórkowego, imię i nazwisko).',	// polish
	3:'Om suggesties te zien, vult u eerst uw contactgegevens in (e-mailadres, mobiel nummer, voor- en achternaam).',	// dutch
	4:'Um Vorschläge zu sehen, füllen Sie bitte zunächst Ihre Kontaktdaten (E-Mail, Handynummer, Vor- und Nachname) aus.',	// german
	5:'Per visualizzare i suggerimenti, inserisci prima i tuoi dati di contatto (e-mail, numero di cellulare, nome e cognome).',	// italian
	6:'Para ver sugerencias, primero complete sus datos de contacto (correo electrónico, número de teléfono móvil, nombre y apellido).', 	// spanish
	7:'Para ver sugestões, preencha primeiro os seus dados de contacto (e-mail, número de telemóvel, nome e apelido).',	// portuguese
	8:'Fir Virschléi ze gesinn, fëllt w.e.g. éischt Är Kontaktdetailer aus (E-Mail, Handysnummer, Vir- an Familljennumm).'	// luxembourgish
};

C_XL.d['pls-fill-coordinates']	= { 0:'Complete my details',	// english
	1:'Compléter mes coordonnées',	// french
	2:'Uzupełnij moje dane',	// polish
	3:'Vul mijn gegevens in',	// dutch
	4:'Vervollständigen Sie meine Angaben',	// german
	5:'Completa i miei dati',	// italian
	6:'Completa mis datos', 	// spanish
	7:'Completar meus dados',	// portuguese
	8:'Meng Detailer ausfëllen'	// luxembourgish
};


/*    C_iSENDmsg    */

C_XL.d['msg-medium-header-ok'] = {
	0: 'You will receive a message containing your credentials. Please choose the destination for the message below.',	// english
	1: 'Vous allez recevoir un message contenant vos identifiants. Choisissez ci-dessous la destination du message.',	// french
	2: 'Otrzymasz wiadomość zawierającą Twoje dane uwierzytelniające. Wybierz poniżej miejsce docelowe wiadomości.',	// polish
	3: 'U ontvangt een bericht met uw inloggegevens. Kies hieronder de bestemming voor het bericht.',	// dutch
	4: 'Sie erhalten eine Nachricht mit Ihren Zugangsdaten. Wählen Sie unten das Ziel der Nachricht aus.',	// german
	5: 'Riceverai un messaggio contenente le tue credenziali. Scegli qui sotto la destinazione del messaggio.',	// italian
	6: 'Recibirá un mensaje con sus credenciales. Elija a continuación el destino del mensaje.', 	// spanish
	7: 'Você receberá uma mensagem contendo suas credenciais. Escolha abaixo o destino da mensagem.',	// portuguese
	8: 'Dir kritt eng Noriicht mat Ären Umeldungsdetailer. Wielt hei drënner d\'Destinatioun vun der Noriicht.' // luxembourgish
};

C_XL.d['msg-medium-header-nok'] = {
	0: 'To receive a message with your credentials, please first complete your contact information (email and mobile number).',	// english
	1: 'Pour recevoir un message avec vos identifiants, veuillez d\'abord compléter vos coordonnées (email et numéro de mobile).',	// french
	2: 'Aby otrzymać wiadomość z Twoimi danymi uwierzytelniającymi, najpierw wypełnij swoje dane kontaktowe (adres e-mail i numer telefonu komórkowego).',	// polish
	3: 'Om een bericht met uw inloggegevens te ontvangen, vul eerst uw contactgegevens in (e-mail en mobiel nummer).',	// dutch
	4: 'Um eine Nachricht mit Ihren Zugangsdaten zu erhalten, füllen Sie bitte zuerst Ihre Kontaktdaten aus (E-Mail und Handynummer).',	// german
	5: 'Per ricevere un messaggio con le tue credenziali, completa prima le tue informazioni di contatto (email e numero di cellulare).',	// italian
	6: 'Para recibir un mensaje con sus credenciales, primero complete su información de contacto (correo electrónico y número de móvil).', 	// spanish
	7: 'Para receber uma mensagem com suas credenciais, primeiro complete suas informações de contato (e-mail e número de celular).',	// portuguese
	8: 'Fir eng Noriicht mat Ären Umeldungsdetailer ze kréien, fëllt w.e.g. éischt Är Kontaktdaten aus (E-Mail an Handysnummer).' // luxembourgish
};




	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//

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
C_XL.d['visitors register'] = { 0:'Patients Registry',	1:'Registre des patients',	2:'Rejestru pacjenta',			3:'Patiëntenregister',			4:'Patientenverzeichnis',		5:'Registro dei pazienti',			6:'Registro de los pacientes', 		7:'Registo do paciente',		8:'Register vun de Patienten'	};
C_XL.d['copy from visitor'] = { 0:'Copy from another patient', 
								1:'Copier depuis un autre patient',	
								2:'Skopiować z innego pacjenta',		
								3:'Kopiëren van een andere patiënt',		
								4:'Von einem anderen Patienten kopieren',	
								5:'Copiare da un altro paziente',	
								6:'Copiar de otro paciente', 
								7:'Copiar de outro paciente', 
								8:'Kopie vun engem anere Patient' };
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
C_XL.d['visitors register'] = { 0:'Clients Registry',	1:'Registre clients',	2:'Rejestru klientów',		3:'Klantenregister',	4:'Kundenverzeichnis',		5:'Registro dei clienti',	6:'Registro de los clientes', 		7:'Registo do cliente',	8:'Register vun de Clienten'	};
C_XL.d['copy from visitor'] = { 0:'Copy from another client',	
								1:'Copier depuis un autre client',	
								2:'Skopiować z innego klienta',		
								3:'Kopiëren van een andere klant',	
								4:'Von einem anderen Kunden kopieren',	
								5:'Copiare da un altro cliente',	
								6:'Copiar de otro cliente',
								7:'Copiar de outro cliente',
								8:'Kopie vun engem anere Client'	};
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
C_XL.d['visitors register'] = { 0:'Participants Registry',	1:'Registre participants',	2:'Rejestru uczestników',	3:'Deelnemersregister',			4:'Teilnehmerverzeichnis',		5:'Registro dei partecipanti',		6:'Registro participantes', 			7:'Registo dos participantes',	8:'Register vun de Participanten'	};
C_XL.d['copy from visitor'] = { 0:'Copy from another participant',	
								1:'Copier depuis un autre participant',	
								2:'Skopiować z innego uczestnika',		
								3:'Kopiëren van een andere deelnemer',			
								4:'Von anderem Teilnehmer kopieren',	
								5:'Copiare da un altro partecipante',	
								6:'Copiar de otro participante', 
								7:'Copiar de outro participante',
								8:'Kopie vun engem anere Participanten'	};
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


// ---------------------------- !! No translation below this line ----------------------------

// the following technical names are GENERATED by C_iARRAY (when displaying array column titles, based on class member names)


C_XL.d['resa-csv-ccss'] 		= C_XL.d['color']; // so to have a suitable column header for csv files

C_XL.d['chats-tip-ccss'] = C_XL.d['notes-tip-ccss'] = C_XL.d['tasks-tip-ccss'] = C_XL.d['files-tip-ccss'];

C_XL.d['chats-tip-created'] = C_XL.d['notes-tip-created'] = C_XL.d['tasks-tip-created'] = C_XL.d['files-tip-created']  = C_XL.d['resa-abr-created'] = C_XL.d['resa-csv-created'] = C_XL.d['created on']; // !! No translation on these lines
C_XL.d['chats-tip-creator'] = C_XL.d['notes-tip-creator'] = C_XL.d['tasks-tip-creator'] = C_XL.d['files-tip-creator']  = C_XL.d['resa-abr-creator'] = C_XL.d['resa-csv-creator'] = C_XL.d['creator']; 	// appears on C_iARRAY colums title, // see (*ct06*)
C_XL.d['resa-abr-changed']		= C_XL.d['resa-csv-changed']		= C_XL.d['changed on'];
C_XL.d['resa-abr-changer'] 		= C_XL.d['resa-csv-changer'] 		= C_XL.d['changer'];
C_XL.d['resa-abr-deleted'] 		= C_XL.d['resa-csv-deleted'] 		= C_XL.d['deleted on'];
C_XL.d['resa-abr-deletor'] 		= C_XL.d['resa-csv-deletor'] 		= C_XL.d['deletor'];
C_XL.d['resa-abr-note'] 		= C_XL.d['resa-csv-note'] 			= C_XL.d['note'];
C_XL.d['resa-abr-performances'] = C_XL.d['resa-csv-performances'] 	= C_XL.d['workcode'];
C_XL.d['resa-abr-payments'] 	= C_XL.d['resa-csv-payments'] 		= C_XL.d['ep-payments-list'];

	C_XL.d['resa-abr-visitors'] 	= C_XL.d['resa-csv-visitors'] 		= C_XL.d['names']; // appears on C_iARRAY colums title, // see (*ct06*)
	C_XL.d['resa-abr-email'] 		= C_XL.d['resa-csv-email'] 			= C_XL.d['visi-abr-email'];
	C_XL.d['resa-abr-birthday'] 	= C_XL.d['resa-csv-birthday'] 		= C_XL.d['visi-abr-birthday'];
	C_XL.d['resa-abr-mobile'] 		= C_XL.d['resa-csv-mobile'] 		= C_XL.d['visi-abr-mobile'];
	C_XL.d['resa-abr-zipCode'] 		= C_XL.d['resa-csv-zipCode'] 		= C_XL.d['visi-abr-zipCode'];
	C_XL.d['resa-abr-company'] 		= C_XL.d['resa-csv-company'] 		= C_XL.d['visi-abr-company'];
	C_XL.d['resa-abr-residence'] 	= C_XL.d['resa-csv-residence'] 		= C_XL.d['visi-abr-residence'];
	C_XL.d['resa-abr-registration'] = C_XL.d['resa-csv-registration']	= C_XL.d['visi-abr-registration'];

C_XL.d['resa-abr-bCals'] = C_XL.d['resa-csv-bCals'] = C_XL.d['{att_bcal}']; // !! No translation on these lines
C_XL.d['resa-abr-uCals'] = C_XL.d['resa-csv-uCals'] = C_XL.d['{att_ucal}'];
C_XL.d['resa-abr-fCals'] = C_XL.d['resa-csv-fCals'] = C_XL.d['{att_fcal}'];

C_XL.d['chats-tip-title'] = C_XL.d['notes-tip-title'] = C_XL.d['tasks-tip-title'] = C_XL.d['title'];
C_XL.d['chats-tip-note'] = C_XL.d['notes-tip-note'] = C_XL.d['files-tip-note'] = C_XL.d['note'];
C_XL.d['files-tip-name']  = C_XL.d['name'];
C_XL.d['tasks-tip-description'] = C_XL.d['description'];
C_XL.d['chats-tip-id'] = C_XL.d['notes-tip-id'] = C_XL.d['tasks-tip-id'] = C_XL.d['files-tip-id'] = C_XL.d['id']; // autogenarat



C_XL.d['notes-creator'] = C_XL.d['notes-csv-creator'] 	 		= C_XL.d['notes-abr-creator'] 	= C_XL.d['creator']; 		// !! No translation on these lines
C_XL.d['notes-created'] = C_XL.d['notes-csv-created'] 	 		= C_XL.d['notes-abr-created'] 	= C_XL.d['created on'];
C_XL.d['notes-title'] 	= C_XL.d['notes-csv-title'] 			= C_XL.d['notes-abr-title'] 	= C_XL.d['title'];
C_XL.d['notes-note'] 	= C_XL.d['notes-csv-note'] 				= C_XL.d['notes-abr-note'] 		= C_XL.d['note'];
C_XL.d['notes-ccss'] 	= C_XL.d['notes-csv-ccss'] 				= C_XL.d['notes-abr-ccss'] 		= C_XL.d['visi-abr-ccss'];
C_XL.d['notes-midnIn'] 	= C_XL.d['notes-csv-midnIn'] 			= C_XL.d['notes-abr-midnIn'] 	= C_XL.d['fromdate'];
C_XL.d['notes-midnOut'] = C_XL.d['notes-csv-midnOut'] 	 		= C_XL.d['notes-abr-midnOut'] 	= C_XL.d['todate'];
C_XL.d['notes-archived'] = C_XL.d['notes-csv-archived'] = C_XL.d['notes-abr-archived'] 	= C_XL.d['archived'];

C_XL.d['notes-tip-midnIn'] 	= C_XL.d['chats-tip-midnIn'] 			= C_XL.d['tasks-tip-midnIn'] 	= C_XL.d['fromdate'];
C_XL.d['notes-tip-midnOut'] = C_XL.d['chats-tip-midnOut'] 	 		= C_XL.d['tasks-tip-midnOut'] 	= C_XL.d['todate'];

C_XL.d['tasks-creator']		= C_XL.d['tasks-csv-creator'] 	 		= C_XL.d['tasks-abr-creator'] 		= C_XL.d['creator'];
C_XL.d['tasks-created']	 	= C_XL.d['tasks-csv-created'] 	 		= C_XL.d['tasks-abr-created'] 		= C_XL.d['created on'];
C_XL.d['tasks-title'] 		= C_XL.d['tasks-csv-title'] 			= C_XL.d['tasks-abr-title'] 		= C_XL.d['title'];
C_XL.d['tasks-description'] = C_XL.d['tasks-csv-description'] 		= C_XL.d['tasks-abr-description'] 	= C_XL.d['description'];
C_XL.d['tasks-ccss'] 		= C_XL.d['tasks-csv-ccss'] 				= C_XL.d['tasks-abr-ccss'] 			= C_XL.d['visi-abr-ccss'];
C_XL.d['tasks-midnIn'] 		= C_XL.d['tasks-csv-midnIn'] 			= C_XL.d['tasks-abr-midnIn'] 		= C_XL.d['fromdate'];
C_XL.d['tasks-midnOut'] 	= C_XL.d['tasks-csv-midnOut'] 			= C_XL.d['tasks-abr-midnOut'] 		= C_XL.d['todate'];
C_XL.d['tasks-archived'] 	= C_XL.d['tasks-csv-archived'] 			= C_XL.d['tasks-abr-archived'] 		= C_XL.d['archived'];

C_XL.d['chats-creator'] = C_XL.d['chats-csv-creator']	= C_XL.d['chats-abr-creator'] 	= C_XL.d['creator'];
C_XL.d['chats-created'] = C_XL.d['chats-csv-created']	= C_XL.d['chats-abr-created'] 	= C_XL.d['created on'];
C_XL.d['chats-title'] 	= C_XL.d['chats-csv-title'] 	= C_XL.d['chats-abr-title'] 	= C_XL.d['title'];
C_XL.d['chats-note'] 	= C_XL.d['chats-csv-note']		= C_XL.d['chats-abr-note'] 		= C_XL.d['note'];
C_XL.d['chats-ccss'] 	= C_XL.d['chats-csv-ccss'] 		= C_XL.d['chats-abr-ccss'] 		= C_XL.d['visi-abr-ccss'];
C_XL.d['chats-id'] 		= C_XL.d['chats-csv-id'] 		= C_XL.d['chats-abr-id'] 		= C_XL.d['visi-abr-id'];
C_XL.d['chats-archived'] = C_XL.d['chats-csv-archived'] = C_XL.d['archived'];
	C_XL.d['chats-abr-archived'] = { 0:'A',	1:'A',	2:'A',	3:'A',	4:'A',	5:'A',	6:'A',	7:'A',	8:'A',	9:'A'	};

C_XL.d['files-creator'] = C_XL.d['files-csv-creator'] 	= C_XL.d['files-abr-creator'] 	= C_XL.d['creator'];
C_XL.d['files-created'] = C_XL.d['files-csv-created'] 	= C_XL.d['files-abr-created'] 	= C_XL.d['created on'];
C_XL.d['files-name'] 	= C_XL.d['files-csv-name'] 		= C_XL.d['files-abr-name'] 		= C_XL.d['name'];
C_XL.d['files-note'] 	= C_XL.d['files-csv-note'] 		= C_XL.d['files-abr-note'] 		= C_XL.d['note'];
C_XL.d['files-ccss'] 	= C_XL.d['files-csv-ccss'] 		= C_XL.d['files-abr-ccss'] 		= C_XL.d['visi-abr-ccss'];



C_XL.d['a1'] = { 0:'▲',	1:'▲',	2:'▲',	3:'▲',	4:'▲',	5:'▲',	6:'▲',	7:'▲',	8:'▲',	9:'▲'	}; // !! No translation below this line
C_XL.d['a2'] = { 0:'►',	1:'►',	2:'►',	3:'►',	4:'►',	5:'►',	6:'►',	7:'►',	8:'►',	9:'►'	};
C_XL.d['a3'] = { 0:'▼',	1:'▼',	2:'▼',	3:'▼',	4:'▼',	5:'▼',	6:'▼',	7:'▼',	8:'▼',	9:'▼'	};
C_XL.d['a4'] = { 0:'◄',	1:'◄',	2:'◄',	3:'◄',	4:'◄',	5:'◄',	6:'◄',	7:'◄',	8:'◄',	9:'◄'	};

C_XL.d['b2'] = { 0:'•',	1:'•',	2:'•',	3:'•',	4:'•',	5:'•',	6:'•',	7:'•',	8:'•',	9:'•'	}; // used by C_iPRO


/*
C_XL.d['b3'] = { 0:'◊',	1:'◊',	2:'◊',	3:'◊',	4:'◊',	5:'◊',	6:'◊',	7:'◊',	8:'◊',	9:'◊'	};
C_XL.d['b4'] = { 0:'→',	1:'→',	2:'→',	3:'→',	4:'→',	5:'→',	6:'→',	7:'→',	8:'→',	9:'→'	};

C_XL.d['m1'] = { 0:'♂',	1:'♂',	2:'♂',	3:'♂',	4:'♂',	5:'♂',	6:'♂',	7:'♂',	8:'♂',	9:'♂'	};
C_XL.d['f0'] = { 0:'♀',	1:'♀',	2:'♀',	3:'♀',	4:'♀',	5:'♀',	6:'♀',	7:'♀',	8:'♀',	9:'♀'	};

C_XL.d['smiley-happy'] 		= { 0:'☺',	1:'☺',	2:'☺',	3:'☺',	4:'☺',	5:'☺',	6:'☺',	7:'☺',	8:'☺',	9:'☺'	};
C_XL.d['check mark'] 		= { 0:'✓',	1:'✓',	2:'✓',	3:'✓',	4:'✓',	5:'✓',	6:'✓',	7:'✓',	8:'✓',	9:'✓'	}; // may appear as a box in editor,	but appears fine on Browsers UTF-8 screens
C_XL.d['heavy check mark'] 	= { 0:'✔',	1:'✔',	2:'✔',	3:'✔',	4:'✔',	5:'✔',	6:'✔',	7:'✔',	8:'✔',	9:'✔'	}; // may appear as a box in editor,	but appears fine on Browsers UTF-8 screens
C_XL.d['radio dot'] 		= { 0:'●',	1:'●',	2:'●',	3:'●',	4:'●',	5:'●',	6:'●',	7:'●',	8:'●',	9:'●'	};
C_XL.d['cross checked'] 	= { 0:'✘',	1:'✘',	2:'✘',	3:'✘',	4:'✘',	5:'✘',	6:'✘',	7:'✘',	8:'✘',	9:'✘'	}; 
*/

C_XL.d['bullet up'] 		= { 0:'▲',	1:'▲',	2:'▲',	3:'▲',	4:'▲',	5:'▲',	6:'▲',	7:'▲',	8:'▲',	9:'▲'	};
C_XL.d['bullet down'] 		= { 0:'▼',	1:'▼',	2:'▼',	3:'▼',	4:'▼',	5:'▼',	6:'▼',	7:'▼',	8:'▼',	9:'▼'	};


// END OF FILE


