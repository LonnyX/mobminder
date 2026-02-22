<?php

define('language_code_english', 0); // associated value is the column position in the $xl array -> it has to start with 0 and increment by 1
define('language_code_french', 1);
define('language_code_polish', 2);
define('language_code_dutch', 3);
define('language_code_german', 4);	
define('language_code_italian', 5);	
define('language_code_spanish', 6);
define('language_code_protuguese', 7);
define('language_code_luxembourgish', 8); // adding a new value? see (*lc01*) for impact
define('language_code_none', 255);


define('visitorAlias_client'		, 100); // (*va00*)
define('visitorAlias_patient'		, 200);
define('visitorAlias_participant'	, 150);


function getTextBetweenTags($string, $tagname) {
    $pattern = "/<$tagname ?.*>(.*)<\/$tagname>/";
    preg_match($pattern, $string, $matches);
    return $matches[1];
}
function getParameter($string, $p) {
    $pattern = "/ $p=\"(.*)\" /";
    preg_match($pattern, $string, $matches);
    return $matches[1];
}

function reduceDiacriticsUTF8($name, $firstwordonly = false, $keepspaces = false) { // see (*gs01*)
	
	global $nl;
	$name = mb_strtolower($name);
	// $name = mb_strtolower(trim($name));
	
	$many = strpos($name, ' '); // that is a firstname containing law names like Marie Antoine Henriette
	
	$guesson = $name;
	if($firstwordonly) if($many!==false&&$many!==0) $guesson = substr($name,0,$many); // then check on the first word only

	$unwanted_array = array('À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'ae',
							'Þ'=>'B', 'ß'=>'Ss','Ç'=>'C', 'ç'=>'c',
							'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E', 'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 
							'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 
							'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'ð'=>'o', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 
							'ñ'=>'n', 'Ñ'=>'N', 'Š'=>'S', 'š'=>'s', 
							'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'ù'=>'u', 'ú'=>'u', 'û'=>'u',
                            'Ý'=>'Y', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y', 'Ž'=>'Z', 'ž'=>'z'  );
	$reduced = strtr($guesson, $unwanted_array);
	
	$ready = $reduced;
	if($keepspaces) $ready = preg_replace('/[^-\' a-z0-9]/','', $ready); // final clean up // see (*ls02*)
		else 		$ready = preg_replace('/[^a-z0-9]/','', $ready); // final clean up
	
    return $ready;
}



class L { // class for translations

	private static $L = language_code_english; 	// default language code
	private static $V = visitorAlias_client; 	//visitor alias code
	public static $languageNames = array( 	language_code_english => 'english', 
												language_code_french => 'french', 
												language_code_polish => 'polish', 
												language_code_dutch => 'dutch', 
												language_code_german => 'german', 
												language_code_italian => 'italian', 
												language_code_spanish => 'spanish', 
												language_code_protuguese => 'portuguese', 
												language_code_luxembourgish => 'luxembourgish'
											);
	public static $languageAbrevs = array( 	language_code_english => 'en', 
												language_code_french => 'fr', 
												language_code_polish => 'pl', 
												language_code_dutch => 'nl', 
												language_code_german => 'de', 
												language_code_italian => 'it', 
												language_code_spanish => 'es', 
												language_code_protuguese => 'pt', 
												language_code_luxembourgish => 'lu'
											);
											
	public static function getLanguageFromCode($lcode) { 
		if(isset(self::$languageNames[$lcode]))
			return self::$languageNames[$lcode]; 
		else return 'wrong language code';
	}
											
	public static function currentlanguage() { return L::$L; }
	public static function addSpecificXlations($more) { 
		L::$xl = array_merge(L::$xl, $more);
	}
	
	static function XL($expression, $languageCode = -1) { // translate expression into currently set language 
			if(!array_key_exists($expression, L::$xl))
				die('<br/>'.get_class().'::XL('.$expression.') - this term can not be translated');
				
			// Why this language code setting:
			// Most of the time, we use the default language set at login, which is the surfer language.
			// Once in a while though, an english speaking seller may insert sms templates for a group that is dutch configured.
			// In this last case, one need to specify which language to translate into. 
			//
			if($languageCode == -1) { // use the language that is set by the class constructor
				if(!isset(L::$xl[$expression][L::$L])) return L::$xl[$expression][0];
				else return L::$xl[$expression][L::$L];
			}
				
			else { // use the language forced (e.g.) SMS message merge use the addressee language
				if(!isset(L::$xl[$expression][$languageCode])) $languageCode = 0; // defaults to english when the translation is missing.
				return L::$xl[$expression][$languageCode];
			}
	}
	
	public function __construct($language, $valias = false) { // optional class constructor
		L::$L = $language; // overrules the default language code
		if($valias) {
			L::$V = $valias; // must be one of [] visitorAlias_client, visitorAlias_patient, visitorAlias_participant ]
		}
		
		// this is how we organize languages in Array's
		// L::$xl['technical name'] 		= Array( 'english', 	'french', 	'polski', 	'dutch',	'german', 'italian', 'spanish', 'portuguese', 'luxembourgish'		);
switch(L::$V) {
    case visitorAlias_patient:
        L::$xl['new visitor']        = Array( 'New patient',              'Nouveau patient',        'Nowy pacjent',             'Nieuwe patiënt', 'Neuer Patient', 'Nuovo paziente', 'Nuevo paciente', 'Novo paciente', 'Neie Patient');
        L::$xl['visitor']            = Array( 'patient',                  'patient',                'pacjent',                  'patiënt',        'Patient',       'Paziente',      'Paciente',      'Paciente',      'Patient');
        L::$xl['no visitor']         = Array( 'no patient',               'aucun patient',          'żaden pacjent',            'geen patiënt',   'kein Patient',  'nessun paziente', 'ningún paciente', 'nenhum paciente', 'keen Patient');
        L::$xl['no other visitor']   = Array( 'no other patient',         'pas d\'autre patient',  'żaden inny pacjent',       'geen andere patiënt', 'kein anderer Patient', 'nessun altro paziente', 'ningún otro paciente', 'nenhum outro paciente', 'keen aneren Patient');
        L::$xl['visitors']           = Array( 'Patients',                'Patients',               'Pacjentów',                'Patiënten',      'Patienten',     'Pazienti',      'Pacientes',     'Pacientes',     'Patienten');
        L::$xl['many visitors']      = Array( 'Several patients',         'Plusieurs patients',     'Kilku pacjentów',          'Meerdere patiënten', 'Mehrere Patienten', 'Diversi pazienti', 'Varios pacientes', 'Vários pacientes', 'Verschidde Patienten');
        L::$xl['visitor name']       = Array( 'Patient name',             'Nom du patient',         'Imię i nazwisko pacjenta', 'Patiënt naam',   'Patientenname', 'Nome del paziente', 'Nombre del paciente', 'Nome do paciente', 'Patientennumm');
        L::$xl['visitor note']       = Array( 'Patient note',             'Note patient',           'Uwaga pacjenta',           'Patiënt nota',   'Patientennotiz','Nota del paziente', 'Nota del paciente', 'Nota do paciente', 'Patientennotiz');
        L::$xl['visitor birth']      = Array( 'Patient date of birth',    'Naissance patient',      'Data urodzenia pacjenta',  'Patiënt geboortedatum', 'Geburtsdatum des Patienten', 'Data di nascita del paziente', 'Fecha de nacimiento del paciente', 'Data de nascimento do paciente', 'Gebuertsdatum vum Patient');
        L::$xl['visitor info']       = Array( 'Patient Information',      'Information Patient',    'Dane pacjenta',            'Patiënt gegevens', 'Patienteninformationen', 'Informazioni sul paziente', 'Información del paciente', 'Informações do paciente', 'Patientinformatiounen');
        L::$xl['visitors register']  = Array( 'Patients Registry',        'Registre des patients',  'Rejestru pacjenta',        'Patiëntenregister', 'Patientenregister', 'Registro dei pazienti', 'Registro de pacientes', 'Registro de pacientes', 'Patienteregister');
        L::$xl['copy from visitor']  = Array( 'Copy from another patient','Copier depuis un autre patient', 'Skopiować z innego pacjenta', 'Kopiëren van een andere patiënt', 'Von einem anderen Patienten kopieren', 'Copiare da un altro paziente', 'Copiar de otro paciente', 'Copiar de outro paciente', 'Kopéieren vun engem aneren Patient');
        break;

    case visitorAlias_client:
        L::$xl['new visitor']        = Array( 'New Client',               'Nouveau Client',         'Nowy Klient',              'Nieuwe klant',   'Neuer Kunde',   'Nuovo cliente', 'Nuevo cliente', 'Novo cliente', 'Neie Client');
        L::$xl['visitor']            = Array( 'client',                   'client',                 'klient',                   'klant',          'Kunde',         'Cliente',       'Cliente',       'Cliente',       'Client');
        L::$xl['no visitor']         = Array( 'no client',                'aucun client',           'żaden klient',             'geen klant',     'kein Kunde',    'nessun cliente', 'ningún cliente', 'nenhum cliente', 'keen Client');
        L::$xl['no other visitor']   = Array( 'no other client',          'pas d\'autre client',   'żaden inny klient',        'geen andere klant', 'kein anderer Kunde', 'nessun altro cliente', 'ningún otro cliente', 'nenhum outro cliente', 'keen aneren Client');
        L::$xl['visitors']           = Array( 'Clients',                  'Clients',                'Klienci',                  'Klanten',        'Kunden',        'Clienti',       'Clientes',      'Clientes',      'Clienten');
        L::$xl['many visitors']      = Array( 'Several clients',          'Plusieurs clients',      'Kilku klientów',           'Meerdere klanten', 'Mehrere Kunden', 'Diversi clienti', 'Varios clientes', 'Vários clientes', 'Verschidde Clienten');
        L::$xl['visitor name']       = Array( 'Client name',              'Nom du client',          'Nazwa klienta',            'Klant naam',     'Kundenname',    'Nome del cliente', 'Nombre del cliente', 'Nome do cliente', 'Clientennumm');
        L::$xl['visitor note']       = Array( 'Client note',              'Note client',            'Uwaga klienta',            'Klant nota',     'Kundennotiz',   'Nota del cliente', 'Nota del cliente', 'Nota do cliente', 'Clientennotiz');
        L::$xl['visitor birth']      = Array( 'Client date of birth',     'Naissance client',       'Data urodzenia klienta',   'Klant geboortedatum', 'Geburtsdatum des Kunden', 'Data di nascita del cliente', 'Fecha de nacimiento del cliente', 'Data de nascimento do cliente', 'Gebuertsdatum vum Client');
        L::$xl['visitor info']       = Array( 'Client Information',       'Information Client',     'Dane klienta',             'Klant gegevens', 'Kundeninformationen', 'Informazioni sul cliente', 'Información del cliente', 'Informações do cliente', 'Clientinformatiounen');
        L::$xl['visitors register']  = Array( 'Clients Registry',         'Registre clients',       'Rejestru klientów',        'Klantenregister', 'Kundenregister', 'Registro dei clienti', 'Registro de clientes', 'Registro de clientes', 'Clienteregister');
        L::$xl['copy from visitor']  = Array( 'Copy from another client', 'Copier depuis un autre client', 'Skopiować z innego klienta', 'Kopiëren van een andere klant', 'Von einem anderen Kunden kopieren', 'Copiare da un altro cliente', 'Copiar de otro cliente', 'Copiar de outro cliente', 'Kopéieren vun engem aneren Client');
        break;

    case visitorAlias_participant:
        L::$xl['new visitor']        = Array( 'New participant',          'Nouveau participant',    'Nowy uczestnik',           'Nieuwe deelnemer', 'Neuer Teilnehmer', 'Nuovo partecipante', 'Nuevo participante', 'Novo participante', 'Neien Participant');
        L::$xl['visitor']            = Array( 'participant',              'participant',            'uczestnik',                'deelnemer',       'Teilnehmer',     'Partecipante',  'Participante',  'Participante',  'Participant');
        L::$xl['no visitor']         = Array( 'no participant',           'aucun participant',      'żaden uczestnik',          'geen deelnemer',  'kein Teilnehmer', 'nessun partecipante', 'ningún participante', 'nenhum participante', 'keen Participant');
        L::$xl['no other visitor']   = Array( 'no other participant',     'pas d\'autre participant', 'żaden inny uczestnik', 'geen andere deelnemer', 'kein anderer Teilnehmer', 'nessun altro partecipante', 'ningún otro participante', 'nenhum outro participante', 'keen aneren Participant');
        L::$xl['visitors']           = Array( 'Participants',             'Participants',           'Uczestnicy',               'Deelnemers',      'Teilnehmer',     'Partecipanti',  'Participantes', 'Participantes', 'Participanten');
        L::$xl['many visitors']      = Array( 'Several participants',     'Plusieurs participants', 'Kilku uczestników',        'Meerdere deelnemers', 'Mehrere Teilnehmer', 'Diversi partecipanti', 'Varios participantes', 'Vários participantes', 'Verschidde Participanten');
        L::$xl['visitor name']       = Array( 'Participant\'s name',     'Nom du participant',     'Nazwa Uczestnik',          'Deelnemer naam',  'Teilnehmername', 'Nome del partecipante', 'Nombre del participante', 'Nome do participante', 'Participantennumm');
        L::$xl['visitor note']       = Array( 'Participant note',         'Note participant',       'Uwaga uczestnik',          'Deelnemer nota',  'Teilnehmernotiz','Nota del partecipante', 'Nota del participante', 'Nota do participante', 'Participantennotiz');
        L::$xl['visitor birth']      = Array( 'Participant date of birth','Naissance participant',  'Uczestnik urodzenie',      'Deelnemer geboortedatum', 'Geburtsdatum des Teilnehmers', 'Data di nascita del partecipante', 'Fecha de nacimiento del participante', 'Data de nascimento do participante', 'Gebuertsdatum vum Participant');
        L::$xl['visitor info']       = Array( 'Participant Information',  'Information Participant','Informacje uczestnika',    'Deelnemer gegevens', 'Teilnehmerinformationen', 'Informazioni sul partecipante', 'Información del participante', 'Informações do participante', 'Participantinformatiounen');
        L::$xl['visitors register']  = Array( 'Participants Registry',    'Registre participants',  'Rejestru uczestników',     'Deelnemersregister', 'Teilnehmerregister', 'Registro dei partecipanti', 'Registro de participantes', 'Registro de participantes', 'Participanteregister');
        L::$xl['copy from visitor']  = Array( 'Copy from another participant', 'Copier depuis un autre participant', 'Skopiować z innego uczestnika', 'Kopiëren van een andere deelnemer', 'Von einem anderen Teilnehmer kopieren', 'Copiare da un altro partecipante', 'Copiar de otro participante', 'Copiar de outro participante', 'Kopéieren vun engem aneren Participant');
        break;
}

		$d = new C_date(); $yyyy = $d->getFullYearString(); // makes our copyright time span always stick to the current year.
		if(L::$xl['copyright'][0]=='© 2006-') // so we can wistand multiple re-initialization (executions) of this __constructor()
			foreach(L::$xl['copyright'] as $lc => &$trad) {
				L::$xl['copyright'][$lc] = L::$xl['copyright'][$lc].$yyyy;
			};	
		
	}
	
	private static $xl = array(  // cross language table
 
// generic translations:
		// L::$xl['technical name'] 		= Array( 'english', 	'french', 	'polski', 	'dutch',	'german', 'italian', 'spanish', 'portuguese', 'luxembourgish'		);


	'new visitor'        	 => Array( 'New attendee',                'Nouveau convié',                'Nowy uczestnik',                'Nieuwe genodigde', 'Neuer Teilnehmer', 'Nuovo partecipante', 'Nuevo participante', 'Novo participante', 'Neien Participant'),
    'visitor'            => Array( 'attendee',                    'convié',                        'uczestnik',                     'genodigde',        'Teilnehmer',     'Partecipante',      'Participante',      'Participante',      'Participant'),
    'no visitor'         => Array( 'no attendee',                 'aucun convié',                  'żaden uczestnik',               'geen genodigde',   'kein Teilnehmer','nessun partecipante','ningún participante','nenhum participante','keen Participant'),
    'no other visitor'   => Array( 'no other attendee',           'pas d\'autre convié',          'żaden inny uczestnik',          'geen andere genodigde', 'kein anderer Teilnehmer', 'nessun altro partecipante', 'ningún otro participante', 'nenhum outro participante', 'keen aneren Participant'),
    'visitors'           => Array( 'visitors',                   'visitors',                     'uczestnik',                     'genodigden',      'Teilnehmer',    'Partecipanti',      'Participantes',      'Participantes',      'Participanten'),
    'many visitors'      => Array( 'Several visitors',            'Plusieurs visitors',           'Kilku pacjentów',               'Meerdere genodigde', 'Mehrere Teilnehmer', 'Diversi partecipanti', 'Varios participantes', 'Vários participantes', 'Verschidde Participanten'),
    'visitor name'       => Array( 'attendee name',               'Nom du convié',                'Imię i nazwisko uczestnik',     'genodigde naam',  'Teilnehmername','Nome del partecipante','Nombre del participante','Nome do participante','Participantennumm'),
    'visitor note'       => Array( 'attendee note',               'Note convié',                  'Uwaga uczestnik',               'genodigde nota',  'Teilnehmernotiz','Nota del partecipante','Nota del participante','Nota do participante','Participantennotiz'),
    'visitor birth'      => Array( 'attendee date of birth',      'Naissance convié',             'Data urodzenia uczestnik',      'genodigde geboortedatum', 'Geburtsdatum des Teilnehmers', 'Data di nascita del partecipante', 'Fecha de nacimiento del participante', 'Data de nascimento do participante', 'Gebuertsdatum vum Participant'),
    'visitor info'       => Array( 'attendee Information',        'Information convié',           'Dane uczestnik',                'genodigde gegevens', 'Teilnehmerinformationen', 'Informazioni sul partecipante', 'Información del participante', 'Informações do participante', 'Participantinformatiounen'),
    'visitors register'  => Array( 'attendees Registry',          'Registre des conviés',         'Rejestru uczestnik',            'genodigdenregister', 'Teilnehmerregister', 'Registro dei partecipanti', 'Registro de participantes', 'Registro de participantes', 'Participanteregister'),
    'copy from visitor'  => Array( 'Copy from another attendee',  'Copier depuis un autre convié','Skopiować z innego uczestnik',  'Kopiëren van een andere genodigde', 'Von einem anderen Teilnehmer kopieren', 'Copiare da un altro partecipante', 'Copiar de otro participante', 'Copiar de outro participante', 'Kopéieren vun engem aneren Participant'),

// Application object classes as they are perceived by the surfer
    'owner'         => array('Manager',         'Responsable',          'Kierownik',                'Verantwoordelijk', 'Manager',       'Responsabile',    'Gerente',        'Gerente',        'Manager'), 
    'visitor'       => array('visitor',         'visiteur',             'klient',                   'bezoeker',         'Besucher',      'Visitatore',      'Visitante',      'Visitante',      'Visiteur'), 
    'many visitors' => array('many visitors',   'plusieurs visiteur',   'więcej odwiedzających',    'meerdere bezoeker','mehrere Besucher','molti visitatori','muchos visitantes','muitos visitantes','vill Visitten'),
    'operator'      => array('Operator',        'Gestionnaire',         'Kierownik',                'Beheerder',        'Bediener',      'Operatore',       'Operador',       'Operador',       'Operator'),

    'workplace' => array('Workplace',  'Poste de travail', 'Stanowisko', 'Werkplaats', 'Arbeitsplatz', 'Luogo di lavoro', 'Lugar de trabajo', 'Local de trabalho', 'Schaffplaz'), // class_bCal
    'resource'  => array('Collaborator','Collaborateur',   'Pracownik',  'Medewerker', 'Mitarbeiter', 'Collaboratore',   'Colaborador',      'Colaborador',      'Mataarbechter'), // class_uCal
    'visitors file' => array('Visitors file', 'Liste de visiteurs', 'Lista klientów', 'Bezoekers lijst', 'Besucherliste', 'Elenco dei visitatori', 'Archivo de visitantes', 'Arquivo de visitantes', 'Visittefichier'), // direct marketing
    'new scratch' => array('New from scratch', 'Nouveau par défaut', 'Nowych od podstaw', 'Nieuw vanaf nul', 'Neu von Grund auf', 'Nuovo da zero', 'Nuevo desde cero', 'Novo do zero', 'Nei vun Null un'), // plus list
    'copy of'      => array('Copy of ', 'Copie de ', 'Kopię', 'Kopie van ', 'Kopie von ', 'Copia di ', 'Copia de ', 'Cópia de ', 'Kopie vun '), // plus list

// access login vocabulary - C_accessLogDisplay
    'data id'    => array('Data id', 'Identifiant', 'Identyfikator', 'Identificatie', 'Daten-ID', 'ID dati', 'ID de datos', 'ID de dados', 'Date-ID'), 
    'created'    => array('Created', 'Créé', 'Wpis', 'Invoering', 'Erstellt', 'Creato', 'Creado', 'Criado', 'Erstallt'), 
    'changed'    => array('Updated', 'Modifié', 'Zmiana', 'Aangepast', 'Geändert', 'Aggiornato', 'Actualizado', 'Atualizado', 'Geännert'),
    'creator'    => array('Created by', 'Créé par', 'Autor wpisu', 'door', 'Erstellt von', 'Creato da', 'Creado por', 'Criado por', 'Erstallt vum'), 
    'changer'    => array('Changed by', 'Modifié par', 'Autor zmiany wpisu', 'veranderd door', 'Geändert von', 'Modificato da', 'Cambiado por', 'Alterado por', 'Geännert vum'),
	
		// L::$xl['technical name'] 		= Array( 'english', 	'french', 	'polski', 	'dutch',	'german', 'italian', 'spanish', 'portuguese', 'luxembourgish'		);
		
// basic vocabulary
	'yes'           => array('Yes',       'Oui',      'Tak',      'Ja',        'Ja',       'Sì',       'Sí',       'Sim',      'Jo'),
    'no'            => array('No',        'Non',      'Nie',      'Nee',       'Nein',     'No',       'No',       'Não',      'Nee'),
    'none'          => array('None',      'Aucun',    'żaden',    'Geen',      'Keiner',   'Nessuno',  'Ninguno',  'Nenhum',   'Keen'),
    'back'          => array('Back',      'Retour',   'Wróć',     'Terug',     'Zurück',   'Indietro','Atrás',    'Voltar',   'Zréck'),
    'properties'    => array('Properties','Propriétés','Ustawienia','Eigenaardigheden','Eigenschaften','Proprietà','Propiedades','Propriedades','Eegeschaften'),
    'default'       => array('By default','Par défaut','Zaocznie', 'Bij verstek','Standardmäßig','Per impostazione predefinita','Por defecto','Por padrão','Standardméisseg'),
    'color'         => array('Color',     'Couleur',  'Kolor',    'Kleur',     'Farbe',    'Colore',   'Color',    'Cor',      'Faarf'),
    'pattern'       => array('Pattern',   'Motif',    'Wzór',     'Patroon',   'Muster',   'Motivo',   'Patrón',   'Padrão',   'Muster'),
    'sample'        => array('Sample',    'Example',  'Przykład', 'Voorbeeld', 'Beispiel', 'Esempio',  'Ejemplo',  'Exemplo',  'Beispill'),
    
	
// calendar related
	
	'on date'       => array('on',        'le',       '',         'op',        'am',       'su',       'en',       'em',       'op'),
    'from'          => array('from',      'de',       'od',       'van',       'von',      'da',       'de',       'de',       'vun'),
    'to'            => array('to',        'à',        'do',       'tot',       'zu',       'a',        'a',        'a',        'op'),
    'for'           => array('for',       'pour',     'dla',      'voor',      'für',      'per',      'para',     'para',     'fir'),
    'month'         => array('month',     'mois',     'miesiąc',  'maand',     'Monat',    'mese',     'mes',      'mês',      'Mount'),
    'months'        => array('months',    'mois',     'miesiąc',  'maanden',   'Monate',   'mesi',     'meses',    'meses',    'Mänt'),
    'day'           => array('day',       'jour',     'dzień',    'dag',       'Tag',      'giorno',   'día',      'dia',      'Dag'),
    'days'          => array('days',      'jours',    'dnie',     'dagen',     'Tage',     'giorni',   'días',     'dias',     'Deeg'),
    'workday'       => array('workday',   'travail',  'dzień roboczy','werkdag','Arbeitstag','giorno lavorativo','día laboral','dia útil','Aarbechtsdag'),

    // used to merge SMS and email messages :

    'weekday1'      => array('monday',    'lundi',    'poniedziałek','maandag', 'Montag',   'Lunedì',   'lunes',    'segunda-feira','Méindeg'), // see (*wd10*) to see how those translations are set up
    'weekday2'      => array('tuesday',   'mardi',    'wtorek',     'dinsdag', 'Dienstag', 'Martedì',  'martes',   'terça-feira',  'Dënschdeg'),
    'weekday3'      => array('wednesday', 'mercredi', 'środa',      'woensdag','Mittwoch', 'Mercoledì','miércoles','quarta-feira', 'Mëttwoch'),
    'weekday4'      => array('thursday',  'jeudi',    'czwartek',   'donderdag','Donnerstag','Giovedì', 'jueves',   'quinta-feira', 'Donneschdeg'),
    'weekday5'      => array('friday',    'vendredi', 'piątek',     'vrijdag', 'Freitag',  'Venerdì',  'viernes',  'sexta-feira',  'Freideg'),
    'weekday6'      => array('saturday',  'samedi',   'sobota',     'zaterdag','Samstag',  'Sabato',   'sábado',   'sábado',       'Samschdeg'),
    'weekday7'      => array('sunday',    'dimanche', 'niedziela',  'zondag',  'Sonntag',  'Domenica', 'domingo',  'domingo',      'Sonndeg'),

    'week'          => array('Week',      'Semaine',  'Tydzień',    'Week',    'Woche',    'Settimana','Semana',   'Semana',       'Woch'),

	// the following translations are used by mergeMSGtext() in comm.php, they are making the emails/sms content when fusion field {dear} is used.
	// note that a copy of those translations must exist in /booking/_assets/classes/language.php, see (*xl03*)
    'dear female'   => array('Dear',      'Chère',    'Szanowna',   'Beste',   'Geehrte',  'Cara',     'Querida',  'Cara',         'Léif'),
    'dear male'     => array('Dear',      'Cher',     'Szanowny',   'Beste',   'Geehrter', 'Caro',     'Querido',  'Caro',         'Léif'),
    'dear other'    => array('Dear',      'Cher.e',   'Szanowny',   'Beste',   'Geehrter', 'Caro',     'Querido/a','Caro/a',       'Léif'),

	// the following translations are used by mergeMSGtext() in comm.php, they are making the emails/sms content when fusion field {gender} is used.
    'male'          => array('Mr',        'M.',       'Pan',        'Mr',      'Herr',     'Sig.',     'Señor',    'Sr.',          'Här'),
    'female'        => array('Mrs',       'Mme',      'Pani',       'Mvr',     'Frau',     'Sig.ra',   'Señora',   'Sra.',         'Madame'),
    'sa'            => array('AS',        'SA',       'SA',         'NV',      'AG',       'SPA',      'SA',       'SA',           'SA'),
    'sprl'          => array('Ltd',       'Sprl',     'Sp. z o.o.', 'Bvba',    'GmbH',     'Srl',      'Ltd',      'SARL',         'SARL'),
    'miss'          => array('Miss',      'Mlle',     'Panna',      'Juffr',   'Fräulein', 'Signorina','Señorita', 'Menina',       'Mademoiselle'),
    'boy'           => array('Mr',        'M.',       'Pan',        'Mr',      'Herr',     'Sig.',     'Señor',    'Sr.',          'Här'),
    'girl'          => array('Miss',      'Mlle',     'Panna',      'Juffr',   'Fräulein', 'Signorina','Señorita', 'Menina',       'Mademoiselle'),

	'othergender'	=> array('',	'',		'',		'',		'',		'',		'',		'',		''	), // diplays smth like french "chèr.e Dominique Dupuis" iso "Chere Mr Dominique Dupuis"
	
	
	
	/////////////////////////////////////////////////////////////////////////////////////
	//
	//
	
	'left conversation' => array( 	// the following messages are auto-generated by the server when eg someone leaves the conversation.
        'has left this conversation',
        'a quitté la conversation',
        'opuścił rozmowę',
        'heeft het gesprek verlaten',
        'hat die Unterhaltung verlassen',
        'ha lasciato la conversazione',
        'ha abandonado la conversación',
        'deixou a conversa',
        'huet d\'Gespréich verlooss' // luxembourgish
    ),

    'deleted conversation' => array(
        'deleted this conversation',
        'a supprimé la conversation',
        'usunął rozmowę',
        'heeft het gesprek verwijderd',
        'hat das Gespräch gelöscht',
        'ha cancellato la conversazione',
        'ha eliminado la conversación',
        'apagou a conversa',
        'huet d\'Gespréich geläscht' // luxembourgish
    ),

    'archived conversation' => array(
        'archived this conversation',
        'a archivé la conversation',
        'zarchiwizował tę rozmowę',
        'heeft dit gesprek gearchiveerd',
        'hat dieses Gespräch archiviert',
        'ha archiviato questa conversazione',
        'ha archivado esta conversación',
        'arquivou esta conversa',
        'huet d\'Gespréich archivéiert' // luxembourgish
    ),

    'unarchived conversation' => array(
        'has reactivated the conversation',
        'a réactivé la conversation',
        'reaktywował rozmowę',
        'heeft het gesprek opnieuw geactiveerd',
        'hat das Gespräch reaktiviert',
        'ha riattivato la conversazione',
        'ha reactivado la conversación',
        'reativou a conversa',
        'huet d\'Gespréich reaktivéiert' // luxembourgish
    ),
	
	
// navigation

	'previous'   => array('Previous', 'Précédant', 'Poprzedni', 'Vorige', 'Vorherige', 'Precedente', 'Anterior', 'Anterior', 'Vireg'),
    'next'       => array('Next', 'Suivant', 'Następny', 'Volgende', 'Nächste', 'Successivo', 'Siguiente', 'Próximo', 'Nächst'),
    'see'        => array('see', 'voir', 'pokaż', 'zien', 'sehen', 'vedi', 'ver', 'ver', 'gesinn'),
    'edit'       => array('edit', 'éditer', 'zmień', 'Aanpassen', 'bearbeiten', 'modifica', 'editar', 'editar', 'änneren'),

    'add'        => array('Add', 'Ajouter', 'Dodaj', 'Toevoegen', 'Hinzufügen', 'Aggiungere', 'Agregar', 'Adicionar', 'Derbäisetzen'),

    'delete'     => array('Delete', 'Supprimer', 'Skasuj', 'Verwijder', 'Löschen', 'Elimina', 'Eliminar', 'Excluir', 'Läschen'),
    'validate'   => array('Save', 'Enregistrer', 'Potwierdź', 'Bevestig', 'Speichern', 'Salva', 'Guardar', 'Salvar', 'Späicheren'),
    'close'      => array(
        'Close and cancel changes',
        'Quitter sans rien enregistrer',
        'Zamknij',
        'Sluiten',
        'Schließen',
        'Chiudi e annulla le modifiche',
        'Cerrar y cancelar cambios',
        'Fechar e cancelar mudanças',
        'Zoumaachen' // luxembourgish
    ),

    'choose'     => array('Choose', 'Choisir', 'Wybierz', 'Kiesen', 'Wählen', 'Scegliere', 'Elegir', 'Escolher', 'Wielen'),
    'info'       => array('Info', 'Info', 'Informacje', 'Info', 'Informationen', 'Informazioni', 'Información', 'Informação', 'Informatiounen'),
    'open'       => array('Open', 'Ouvert', 'Otwarte', 'Open', 'Öffnen', 'Aperto', 'Abierto', 'Aberto', 'Opmaachen'),
    'setup'      => array('Setup', 'Réglage', 'Ustawienia', 'Regeling', 'Einstellung', 'Impostazioni', 'Configuración', 'Configuração', 'Astellungen'),

// miscellaneous
	'and'           => array('and', 'et', 'i', 'en', 'und', 'e', 'y', 'e', 'an'),
    'with'          => array('with', 'avec', 'z', 'met', 'mit', 'con', 'con', 'com', 'mat'),
    'in room'       => array('in room', 'dans la salle', 'w pomieszczeniu', 'in zaal', 'im Zimmer', 'nella stanza', 'en la sala', 'na sala', 'am Raum'),
    'coordinates'   => array('Coordinates', 'Coordonnées', 'Dane kontaktowe', 'Coördinaten', 'Koordinaten', 'Coordinate', 'Coordenadas', 'Coordenadas', 'Koordinaten'),
    'visitors'      => array('Visitors', 'Visiteurs', 'Odwiedzający', 'Bezoekers', 'Besucher', 'Visitatori', 'Visitantes', 'Visitantes', 'Visiteuren'),

    'lastname'      => array('Last name', 'Nom', 'Nazwisko', 'Naam', 'Nachname', 'Cognome', 'Apellido', 'Sobrenome', 'Familljennumm'),
    'firstname'     => array('First name', 'Prénom', 'Imię', 'Voornaam', 'Vorname', 'Nome', 'Nombre', 'Nome', 'Virnumm'),
    'language'      => array('Language', 'Langue', 'Język', 'Taal', 'Sprache', 'Lingua', 'Idioma', 'Língua', 'Sprooch'),

    'informations'  => array('Informations', 'Informations', 'Informacje', 'Gegevens', 'Informationen', 'Informazioni', 'Información', 'Informação', 'Informatiounen'),

    'gender'        => array('Gender', 'Genre', 'Godność/forma prawna', 'Geslacht', 'Geschlecht', 'Genere', 'Género', 'Gênero', 'Geschlecht'),

    'fromdate'      => array('from', 'du', 'od', 'vanaf', 'von', 'dal', 'desde', 'de', 'vun'),
    'todate'        => array('to', 'au', 'do', 'tot', 'bis', 'al', 'hasta', 'até', 'bis'),
    'at'            => array('at', 'à', 'o', 'om', 'um', 'alle', 'a las', 'às', 'ëm'),
    'to'            => array('to', 'à', 'do', 'tot', 'bis', 'a', 'a', 'a', 'op'),
    'mobile'        => array('Mobile number', 'Portable', 'Komórkowy', 'GSM', 'Handynummer', 'Cellulare', 'Número de móvil', 'Número de telemóvel', 'Handysnummer'),
    'registration'  => array('Registration', 'Matricule', 'Znaczek', 'Register', 'Registrierung', 'Registrazione', 'Registro', 'Registro', 'Aschreiwung'),
    'access level'  => array('Access level', 'Niveau d\'accès', 'Poziom dostępu', 'Toegangsniveau', 'Zugriffsebene', 'Livello di accesso', 'Nivel de acceso', 'Nível de acesso', 'Zouganksniveau'),

    'birthday'      => array('Birthday', 'Anniversaire', 'Data urodzenia', 'Verjaardag', 'Geburtstag', 'Compleanno', 'Cumpleaños', 'Aniversário', 'Gebuertsdag'),
    'address'       => array('Address', 'Adresse', 'Adres', 'Adres', 'Adresse', 'Indirizzo', 'Dirección', 'Endereço', 'Adress'),
    'zip'           => array('Zip code', 'Code postal', 'Kod pocztowy', 'Postcode', 'Postleitzahl', 'CAP', 'Código postal', 'Código postal', 'Postleitzuel'),
    'city'          => array('City', 'Ville', 'Miejscowość', 'Stad', 'Stadt', 'Città', 'Ciudad', 'Cidade', 'Stad'),
    'country'       => array('Country', 'Pays', 'Województwo', 'Land', 'Land', 'Paese', 'País', 'País', 'Land'),
    'email'         => array('E-mail', 'E-mail', 'E-mail', 'E-mail', 'E-Mail', 'E-mail', 'Correo electrónico', 'E-mail', 'E-Mail'),
    'phone'         => array('Phone number', 'Téléphone', 'Telefon', 'Telefoon', 'Telefonnummer', 'Numero di telefono', 'Número de teléfono', 'Número de telefone', 'Telefonnummer'),
    'note'          => array('Note', 'Note', 'Uwagi', 'Nota', 'Notiz', 'Nota', 'Nota', 'Nota', 'Notiz'),
    'no appointment'=> array('No appointment', 'Pas de rdv', 'Brak wizyt', 'Geen afspraak', 'Kein Termin', 'Nessun appuntamento', 'Sin cita', 'Sem compromisso', 'Keen Rendez-vous'),
    'appointments'  => array('Appointments', 'Rendez-vous', 'Nominacje', 'Afspraken', 'Termine', 'Appuntamenti', 'Citas', 'Compromissos', 'Rendez-vousen'),
    'prev apps'     => array('Previous', 'Passés', 'Poprzednie wizyty', 'Verleden', 'Vorherige', 'Precedenti', 'Anteriores', 'Anteriores', 'Vergaangen'),
    'next apps'     => array('Planned', 'Planifiés', 'Zaplanowane wizyty', 'Toekomstige', 'Geplante', 'Pianificati', 'Planeados', 'Planejados', 'Geplangten'),
    'visitor attributes' => array('Qualifications', 'Qualifications', 'Kwalifikacji', 'Kwalificaties', 'Qualifikationen', 'Qualificazioni', 'Cualificaciones', 'Qualificações', 'Qualifikatiounen'),
    'apps overview' => array('Appointments overview', 'Rendez-vous', 'Wizyty', 'Afspraken overzicht', 'Terminübersicht', 'Panoramica appuntamenti', 'Resumen de citas', 'Visão geral de compromissos', 'Rendez-vous Iwwersiicht'),
	
// C_control_group
	 
	'owner form'    => array('Owner form', 'Fiche exploitant', 'Formularz właściciel', 'Eigenaar formulier', 'Besitzerformular', 'Modulo proprietario', 'Formulario del propietario', 'Formulário do proprietário', 'Besëtzerformular'),

    // C_control_duration

    'duration'      => array('Duration', 'Durée', 'Jak długo', 'Duurtijd', 'Dauer', 'Durata', 'Duración', 'Duração', 'Dauer'),
    'longer'        => array('Longer', 'Plus long', 'już', 'Langer', 'Länger', 'Più lungo', 'Más largo', 'Mais longo', 'Méi laang'),

    // reminders
    'reminders'     => array('Reminders', 'Rappels', 'Przypomnienia', 'Herinneringen', 'Erinnerungen', 'Promemoria', 'Recordatorios', 'Lembretes', 'Erënnerungen'),

    // e-reservation
    'e-reservation' => array(
        'Make an appointment - Online booking',
        'Prendre rendez-vous - Réservation en ligne',
        'Umów się na wizytę - Online rezerwacja',
        'Maak een afspraak - Online reserveren',
        'Einen Termin vereinbaren - Online-Buchung',
        'Prendere un appuntamento - Prenotazione online',
        'Hacer una cita - Reserva en línea',
        'Marcar uma consulta - Reservas online',
        'Maacht en Rendez-vous - Online Reservatioun' // luxembourgish
    ),

    'book now'      => array('Make an appointment', 'Prendre rendez-vous', 'Umów się na wizytę', 'Maak een afspraak', 'Einen Termin vereinbaren', 'Prendere un appuntamento', 'Hacer una cita', 'Marcar uma consulta', 'Maacht en Rendez-vous'),
    'cancel resa'   => array('Cancel an appointment', 'Annuler un rendez-vous', 'Anuluj spotkanie', 'Een afspraak afzeggen', 'Einen Termin absagen', 'Annullamento di un appuntamento', 'Cancelar una cita', 'Cancelar um compromisso', 'Annuléiert en Rendez-vous'),



// following translations are used in /lib_mobphp/comm.php

    'powered by'    => array('Powered by', 'Propulsé par', 'Powered by', 'Powered by', 'Bereitgestellt von', 'Offerto da', 'Patrocinado por', 'Alimentado por', 'Bedriwwen vun'),

							
	'copyright' => array(
			'© 2006-',
			'© 2006-',
			'© 2006-',
			'© 2006-',
			'© 2006-',
			'© 2006-',
			'© 2006-',
			'© 2006-',
			'© 2006-' // luxembourgish
			),

	'provided by' => array(
        ' - provider of custom agendas for all professionals working by appointment',
        ' - fournisseur d\'agendas sur mesure pour tout professionnel travaillant sur rendez-vous',
        ' - dostawca spersonalizowanych agend dla każdego profesjonalisty pracującego na umówienie',
        ' - aanbieder van aangepaste agenda\'s voor alle professionals die op afspraak werken',
        ' - Anbieter von maßgeschneiderten Terminplänen für alle Fachleute, die nach Vereinbarung arbeiten',
        ' - fornitore di agende personalizzate per tutti i professionisti che lavorano su appuntamento',
        ' - proveedor de agendas personalizadas para todos los profesionales que trabajan con cita previa',
        ' - fornecedor de agendas personalizadas para todos os profissionais que trabalham com agendamento',
        ' - Ubidder vun ugepassten Agendaen fir all Beruffsleit déi no Rendez-vous schaffen'
    ),

    'summarized features' => array(
        'Multi-site and multi-user management | Reminder SMS & emails | Online booking | Prepayment & e-payment',
        'Gestion multi-sites et multi-users | SMS & e-mails de rappel | Réservation en ligne | Prépaiement & e-paiement',
        'Zarządzanie wieloma lokalizacjami i użytkownikami | Przypomnienie SMS-y i e-maile | Rezerwacja online | Przedpłata i e-płatność',
        'Multi-site en multi-gebruikersbeheer | Herinnering SMS & e-mails | Online boeking | Voorafbetaling & e-betaling',
        'Multi-Standort- und Multi-Benutzer-Verwaltung | Erinnerungs-SMS & E-Mails | Online-Buchung | Vorauszahlung & e-Zahlung',
        'Gestione multi-sito e multi-utente | SMS & e-mail di promemoria | Prenotazione online | Prepagamento & e-pagamento',
        'Gestión multi-sitio y multi-usuario | SMS y correos electrónicos de recordatorio | Reserva online | Prepago y e-pago',
        'Gestão multi-sites e multi-usuários | SMS & e-mails de lembrete | Reserva online | Pré-pagamento & e-pagamento',
        'Multi-Site a Multi-Benotzer Gestioun | SMS a Mail Erënnerungen | Online Buchung | Pré-paiement a e-Paiement'
    ),

    'privacy policy' => array(
        'Privacy Policy',
        'Politique de confidentialité',
        'Polityka prywatności',
        'Privacybeleid',
        'Datenschutzrichtlinie',
        'Politica sulla privacy',
        'Política de privacidad',
        'Política de Privacidade',
        'Dateschutz Politik' // luxembourgish
    )
	
	
	); 
}             













///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// below Xlations are specific to the booking interface

$morexlations = array(

'discover mobminder' => array(
    'Discover the agenda used by over 7000 professionals', // English
    'Découvrez l\'agenda utilisé par plus de 7000 professionnels', // French
    'Odkryj kalendarz używany przez ponad 7000 profesjonalistów', // Polish
    'Ontdek de agenda die door meer dan 7000 professionals wordt gebruikt', // Dutch
    'Entdecken Sie den Kalender, der von über 7000 Fachleuten verwendet wird', // German
    'Scopri l\'agenda utilizzata da oltre 7000 professionisti', // Italian
    'Descubre la agenda utilizada por más de 7000 profesionales', // Spanish
    'Descubra a agenda usada por mais de 7000 profissionais', // Portuguese
    'Entdeckt den Agenda, dee vun iwwer 7000 Professionellen benotzt gëtt' // Luxembourgish
),


							
// C_control_message / C_control_commPlan


	/* this bunch is duplicated in .js 
	'sms_nosms'		=> array('No SMS',			'Pas de SMS',	'Brak SMS-ów',		'Geen SMS'			),
	'sms_created'	=> array('Ready',			'Préparé',		'Gotowy',			'Voorbereden'		),
	'sms_retry'		=> array('Ready',			'Préparé',		'Gotowy',			'Voorbereden'		),
	'sms_handled'	=> array('Handed over',		'Transmis',		'Przekazany',		'Uitgezonden'		),
	'sms_pending'	=> array('Pending',			'En attente',	'Oczekujący',		'Hangt'				),
	'sms_delivered'	=> array('Delivered',		'Délivré',		'Dostarczony',		'Afgeleverd'		),
	'sms_discarded'	=> array('Discarded',		'Détruit',		'Usunięty',			'Gescrapt'			),
	'sms_retained'	=> array('Retained',		'Retenu',		'Zachowany',		'Gehouden'			),
	'sms_iso'		=> array('iso-recipient',	'iso-recipient','iso-recipient',	'eigen bestemming'	),
	'sms_nofeedback'=> array('No feedback',		'Sans statut',	'Nie opinie',		'Geen feedback'		),
	'sms_notsent'	=> array('Not sent',		'Pas envoyé',	'Nie są przesyłane','Niet verzonden'	),
	*/


	'indicates'	=> array('Indicating',	'Indiquant',	'Wskazujący',	'Vermeldt'	),
	'before scheduled'	=> array('before scheduled time',	'd\'avance sur le timing',	'wcześniej niż w harmonogramie',	'voorhang op timing'	),
                   
				   
	// e-reservation 2FA code email (translations for email sending)
	
    'indicates' => array('Indicating', 'Indiquant', 'Wskazujący', 'Vermeldt', 'Zeigend', 'Indicando', 'Indicando', 'Indicando', 'Unzeeigend'),
    'before scheduled' => array('before scheduled time', 'd\'avance sur le timing', 'wcześniej niż w harmonogramie', 'voorhang op timing', 'vor der geplanten Zeit', 'prima del tempo programmato', 'antes del tiempo programado', 'antes do tempo programado', 'virum geplangten Zäitpunkt'),

    'e-resa-token-mail title' => array('Your code for online booking', 'Votre code pour la réservation en ligne', 'Twój kod do rezerwacji online', 'Uw code voor de online reservatie', 'Ihr Code für die Online-Buchung', 'Il tuo codice per la prenotazione online', 'Su código para la reserva en línea', 'Seu código para a reserva online', 'Äre Code fir online Reservatioun'),
    'mail sent at' => array('This mail was sent at', 'Cet email a été envoyé à', 'Ten e-mail został wysłany do', 'Deze email werd gestuurd om', 'Diese E-Mail wurde gesendet um', 'Questa email è stata inviata a', 'Este correo fue enviado a', 'Este e-mail foi enviado às', 'Dës Mail gouf geschéckt un'),
    'your code is' => array('Your code is', 'Votre code est', 'Kod jest', 'Uw code is', 'Ihr Code ist', 'Il codice è', 'Su código es', 'Seu código é', 'Äre Code ass'),
    'greetings' => array('Regards', 'Cordialement', 'Powitać', 'Groeten', 'Mit freundlichen Grüßen', 'Cordiali saluti', 'Saludos', 'Cumprimentos', 'Mat Frëndlechkeeten'),

    'goodbye' => array('goodbye', 'au revoir', 'do widzenia', 'tot ziens', 'Auf Wiedersehen', 'addio', 'adiós', 'Tchau', 'Äddi'),
	
	
	// translations for email sent on incoming inbound SMS from smsgateaway (does not apply for /booking pages)
	/*
		
	'inareply title' => array(
        'Someone gave an answer to an SMS message',
        'Une personne a répondu à un message SMS',
        'Osoba odpowiedziała na wiadomość SMS',
        'Iemand heeft een sms-bericht beantwoord',
        'Eine Person hat auf eine SMS geantwortet',
        'Qualcuno ha dato una risposta a un messaggio SMS',
        'Alguien respondió a un mensaje SMS.',
        'Alguém respondeu a uma mensagem SMS',
        'Eemol huet een op eng SMS geäntwert.' // luxembourgish
    ),

    'inareply account' => array(
        'Mobminder account',
        'Compte Mobminder',
        'Konto Mobmindera',
        'Mobminder-account',
        'Mobminder-Konto',
        'Conto Mobminder',
        'Cuenta Mobminder',
        'Conta do Mobminder',
        'Mobminder Kont' // luxembourgish
    ),

    'inareply in-msg' => array(
        'Received SMS message',
        'Message SMS reçu',
        'Odebrano wiadomość SMS',
        'Sms ontvangen',
        'Empfangene SMS-Nachricht',
        'SMS ricevuto',
        'Mensaje SMS recibido',
        'Mensagem SMS recebida',
        'Kritt SMS Noriicht' // luxembourgish
    ),

    'inareply initial' => array(
        'Initially Mobminder sent message',
        'Message initial par Mobminder',
        'Pierwsza wiadomość od Mobmindera',
        'Eerste bericht van Mobminder',
        'Erste Nachricht von Mobminder',
        'Messaggio inizialmente inviato',
        'Mensaje enviado inicialmente',
        'Mensagem inicialmente enviada',
        'Ursprénglech geschéckt duerch Mobminder'
    ),

    'inareply sender' => array(
        'Message originator',
        'Expéditeur du message',
        'Nadawca wiadomości',
        'Bericht afzender',
        'Absender der Nachricht',
        'Mittente del messaggio',
        'Remitente del mensaje',
        'Remetente da mensagem',
        'Ursprong vum Message'
    ),

    'inareply appointment' => array(
        'Related appointment',
        'Rendez-vous relatif',
        'Powiązane spotkanie',
        'Gerelateerde afspraak',
        'Zugehöriger Termin',
        'Appuntamento correlato',
        'Cita relacionada',
        'Nomeação relacionada',
        'Verbonnen Rendez-vous'// luxembourgish
    ),
	
	*/
	
	// translations for the e-resa html process page
	
'in_place' => array ( 
			'in',			// 0 - english
			'à', 			// 1 - french
			'w', 			// 2 - polski
			'in',			// 3 - dutch
			'in',			// 4 - german
			'a', 			// 5 - italian
			'en',			// 6 - spanish
			'em', 			// 7 - portugese
			'an'			// 8 - luxembourgish
			),
		
'make_an_appointment_with' => array ( 
			'Quickly make an appointment online with',	// 0 - english
			'Prenez rapidement un rendez-vous en ligne avec',	// 1 - french
			'Umów się szybko na spotkanie online z',		// 2 - polski
			'Boek nu snel uw online afspraak met',			// 3 - dutch
			'Vereinbaren Sie schnell einen Termin online mit',	// 4 - german
			'Fissate un rapido appuntamento online con',		// 5 - italian
			'Concierte una cita rápida en línea con', 		// 6 - spanish
			'Marque rapidamente uma reunião com',			// 7 - portugese
			'Maacht séier en Online-Rendez-vous aus mat'	// 8 - luxembourgish
		),
			
'online appointment' => array(
			'Online appointment', 	// 0 - english
			'RDV en ligne', 		// 1 - french
			'Rezerwacja online', 	// 2 - polski
			'Online afspraak', 		// 3 - dutch
			'Online-Termine', 		// 4 - german
			'Appuntamento online', 	// 5 - italian
			'Cita online', 			// 6 - spanish
			'Reservas online', 		// 7 - portugese
			'Online-Rendez-vous'	// 8 - luxembourgish
			),
	
'inactive-page' => array(
			'This page is temporarily inactive or no longer exists.', 				// 0 - english
			'Cette page est temporairement inactive ou n\'existe plus.', 			// 1 - french
			'Ta strona jest tymczasowo nieaktywna lub już nie istnieje.', 			// 2 - polski
			'Deze pagina is tijdelijk inactief of bestaat niet meer.', 			// 3 - dutch
			'Diese Seite ist vorübergehend inaktiv oder existiert nicht mehr.', 	// 4 - german
			'Questa pagina è temporaneamente inattiva o non esiste più.', 			// 5 - italian
			'Esta página está temporalmente inactiva o ya no existe.', 			// 6 - spanish
			'Esta página está temporariamente inativa ou não existe mais.', 		// 7 - portugese
			'Dës Säit ass temporär inaktiv oder existéiert net méi.'				// 8 - luxembourgish
			),


	// PRIVACY POLICY PAGE

'general information title' => array(
		'General Information', // English
		'Généralités', // French
		'Ogólne informacje', // Polish
		'Algemene informatie', // Dutch
		'Allgemeine Informationen', // German
		'Informazioni generali', // Italian
		'Información general', // Spanish
		'Informação geral', // Portuguese
		'Allgemeng Informatiounen' // Luxembourgish
		),

'general information p1' => array(
		'We process your data confidentially and following national and international provisions, including the Belgian law of December 8, 1992, regarding the protection of privacy about the processing of personal data, as amended by the law of December 11, 1998.', // English
		'Nous traitons vos données de manière confidentielle et conformément aux dispositions nationales et internationales, dont entre autres la loi belge du 8 décembre 1992, relative à la protection de la vie privée à l\'égard du traitements de données à caractère personnel, modifiée par la loi du 11 décembre 1998.', // French
		'Przetwarzamy twoje dane w sposób poufny i zgodnie z krajowymi i międzynarodowymi przepisami, w tym belgijską ustawą z dnia 8 grudnia 1992 r. dotyczącą ochrony prywatności w zakresie przetwarzania danych osobowych, zmienioną ustawą z dnia 11 grudnia 1998 r.', // Polish
		'Wij verwerken uw gegevens vertrouwelijk en in overeenstemming met nationale en internationale bepalingen, waaronder de Belgische wet van 8 december 1992 inzake de bescherming van de persoonlijke levenssfeer met betrekking tot de verwerking van persoonsgegevens, gewijzigd door de wet van 11 december 1998.', // Dutch
		'Wir verarbeiten Ihre Daten vertraulich und gemäß den nationalen und internationalen Bestimmungen, einschließlich des belgischen Gesetzes vom 8. Dezember 1992 zum Schutz der Privatsphäre im Hinblick auf die Verarbeitung personenbezogener Daten, geändert durch das Gesetz vom 11. Dezember 1998.', // German
		'Trattiamo i tuoi dati in modo confidenziale e conformemente alle disposizioni nazionali e internazionali, tra cui la legge belga dell\'8 dicembre 1992, relativa alla protezione della privacy in relazione al trattamento dei dati personali, modificata dalla legge dell\'11 dicembre 1998.', // Italian
		'Procesamos sus datos de manera confidencial y de acuerdo con las disposiciones nacionales e internacionales, incluida la ley belga del 8 de diciembre de 1992, relativa a la protección de la privacidad en relación con el tratamiento de datos personales, modificada por la ley del 11 de diciembre de 1998.', // Spanish
		'Processamos seus dados de forma confidencial e de acordo com as disposições nacionais e internacionais, incluindo a lei belga de 8 de dezembro de 1992, relativa à proteção da privacidade em relação ao tratamento de dados pessoais, alterada pela lei de 11 de dezembro de 1998.', // Portuguese
		'Mir verschaffen Är Donnéeën vertraulech an am Aklang mat nationalen an internationalen Bestëmmungen, abegraff dem belsche Gesetz vum 8. Dezember 1992 iwwer de Schutz vun der Privatsphär am Bezuch op d\'Veraarbechtung vu perséinlechen Donnéeën, geännert duerch d\'Gesetz vum 11. Dezember 1998.' // Luxembourgish
		),

'general information p2' => array(
		'The website of your professional ([ACCOUNTNAME]) is managed by Cloud-Tech sprl, Rue du Brillant 86, 1170 Brussels, Belgium. Cloud-Tech complies with the European GDPR directive.', // English
		'Le site internet de votre professionnel ([ACCOUNTNAME]) est édité par Cloud-Tech sprl, rue du Brillant 86 à 1170 Bruxelles en Belgique. Cloud-Tech respecte la directive Européenne GDPR.', // French
		'Strona internetowa twojego profesjonalisty ([ACCOUNTNAME]) jest zarządzana przez Cloud-Tech sprl, Rue du Brillant 86, 1170 Bruksela, Belgia. Cloud-Tech przestrzega europejskiej dyrektywy GDPR.', // Polish
		'De website van uw professional ([ACCOUNTNAME]) wordt beheerd door Cloud-Tech sprl, Rue du Brillant 86, 1170 Brussel, België. Cloud-Tech voldoet aan de Europese GDPR-richtlijn.', // Dutch
		'Die Website Ihres Fachmanns ([ACCOUNTNAME]) wird von Cloud-Tech sprl, Rue du Brillant 86, 1170 Brüssel, Belgien, betrieben. Cloud-Tech hält sich an die europäische GDPR-Richtlinie.', // German
		'Il sito web del tuo professionista ([ACCOUNTNAME]) è gestito da Cloud-Tech sprl, Rue du Brillant 86, 1170 Bruxelles, Belgio. Cloud-Tech rispetta la direttiva GDPR europea.', // Italian
		'El sitio web de su profesional ([ACCOUNTNAME]) es gestionado por Cloud-Tech sprl, Rue du Brillant 86, 1170 Bruselas, Bélgica. Cloud-Tech cumple con la directiva GDPR europea.', // Spanish
		'O site do seu profissional ([ACCOUNTNAME]) é gerido pela Cloud-Tech sprl, Rue du Brillant 86, 1170 Bruxelas, Bélgica. A Cloud-Tech cumpre com a diretiva GDPR europeia.', // Portuguese
		'De Site vun Ärem Fachmann ([ACCOUNTNAME]) gëtt vun der Cloud-Tech sprl, Rue du Brillant 86, 1170 Bréissel, Belsch, verwalt. Cloud-Tech hält sech un d\'europäesch GDPR-Direktiv.' // Luxembourgish
		),
		
'general information p3' => array(
		'We place great importance on protecting your personal data and therefore take appropriate technical and organizational measures to secure and protect it, including against loss, modification, or unauthorized access.', // English
		'Nous attachons une grande importance à la protection de vos données à caractère personnel et prenons par conséquent des mesures techniques et organisationnelles appropriées pour les sécuriser et les protéger notamment contre toute perte, modification ou accès non autorisé.', // French
		'Przywiązujemy dużą wagę do ochrony Twoich danych osobowych i dlatego podejmujemy odpowiednie środki techniczne i organizacyjne, aby je zabezpieczyć i chronić, w tym przed utratą, modyfikacją lub nieautoryzowanym dostępem.', // Polish
		'Wij hechten veel waarde aan de bescherming van uw persoonlijke gegevens en nemen daarom passende technische en organisatorische maatregelen om deze te beveiligen en te beschermen, onder andere tegen verlies, wijziging of ongeautoriseerde toegang.', // Dutch
		'Wir legen großen Wert auf den Schutz Ihrer personenbezogenen Daten und treffen daher angemessene technische und organisatorische Maßnahmen, um diese zu sichern und zu schützen, insbesondere gegen Verlust, Änderung oder unbefugten Zugriff.', // German
		'Attribuiamo grande importanza alla protezione dei tuoi dati personali e adottiamo pertanto misure tecniche e organizzative adeguate per garantirne la sicurezza e la protezione, anche contro perdita, modifica o accesso non autorizzato.', // Italian
		'Otorgamos gran importancia a la protección de sus datos personales y, por lo tanto, tomamos medidas técnicas y organizativas adecuadas para asegurar y proteger esos datos, incluyendo contra pérdida, modificación o acceso no autorizado.', // Spanish
		'Atribuímos grande importância à proteção dos seus dados pessoais e, por conseguinte, tomamos medidas técnicas e organizativas apropriadas para os proteger e garantir a segurança, incluindo contra perda, modificação ou acesso não autorizado.', // Portuguese
		'Mir leeën e grousse Wäert op de Schutz vun Äre perséinlechen Donnéeën a huelen dowéinst passend technesch an organisatoresch Mesuren, fir se ze sécheren an ze schützen, och géint Verloscht, Ännerung oder onautoriséierten Zougang.' // Luxembourgish
		),

'general information p4' => array(
		'No information (whether confidential or not) is stored in a session cookie by this website. After closing the web page (or browser), no information remains stored on the machine you used to make an appointment.', // English
		'Aucune information (qu\'elle soit confidentielle ou pas) n\'est stockée dans un cookie de session par ce site internet. Après la fermeture de la page Web (ou du navigateur), aucune information ne reste enregistrée sur la machine que vous avez utilisée pour prendre un RDV.', // French
		'Żadne informacje (czy są poufne, czy nie) nie są przechowywane w ciasteczku sesji przez tę stronę internetową. Po zamknięciu strony internetowej (lub przeglądarki), żadne informacje nie pozostają zapisane na urządzeniu, którego używałeś do umówienia się na wizytę.', // Polish
		'Geen enkele informatie (of deze nu vertrouwelijk is of niet) wordt opgeslagen in een sessiecookie door deze website. Na het sluiten van de webpagina (of de browser) blijft er geen informatie op de machine achter die u hebt gebruikt om een afspraak te maken.', // Dutch
		'Keine Informationen (ob vertraulich oder nicht) werden in einem Sitzungscookie von dieser Website gespeichert. Nach dem Schließen der Webseite (oder des Browsers) bleiben keine Informationen auf dem von Ihnen verwendeten Gerät gespeichert.', // German
		'Nessuna informazione (sia essa confidenziale o meno) viene memorizzata in un cookie di sessione da questo sito web. Dopo la chiusura della pagina web (o del browser), nessuna informazione rimane memorizzata sulla macchina che hai usato per fissare un appuntamento.', // Italian
		'Ninguna información (ya sea confidencial o no) se almacena en una cookie de sesión por este sitio web. Después de cerrar la página web (o el navegador), ninguna información permanece registrada en la máquina que usó para hacer una cita.', // Spanish
		'Nenhuma informação (seja confidencial ou não) é armazenada em um cookie de sessão por este site. Após o fechamento da página web (ou do navegador), nenhuma informação permanece registrada na máquina que você usou para marcar uma consulta.', // Portuguese
		'Keng Informatiounen (ob se vertraulech sinn oder net) ginn an engem Sessions-Cookie vun dëser Websäit gespäichert. Nom Schléissen vun der Websäit (oder dem Browser) bleift keng Informatioun op der Maschinn gespäichert, déi Dir benotzt hutt, fir en Rendez-vous ze maachen.' // Luxembourgish
		),

'consent title' => array(
		'Consent', // English
		'Consentement', // French
		'Zgoda', // Polish
		'Toestemming', // Dutch
		'Einwilligung', // German
		'Consenso', // Italian
		'Consentimiento', // Spanish
		'Consentimento', // Portuguese
		'Averständnis' // Luxembourgish
		),

'consent p1' => array(
		'Your professional uses this online appointment scheduling page to help you easily make an appointment via the Internet. Your professional has signed an agreement with Mobminder. They are informed of each party\'s responsibilities. They act as the data collection responsible party. They have been informed in detail of the measures taken by Mobminder to respect your confidential data. Mobminder is limited to providing them with the online appointment scheduling tool. The responsibilities of Mobminder/cloud-Tech sprl in data processing are described below.', // English
		'Votre professionnel utilise cette page de prise de RDV en ligne afin de vous aider à prendre un RDV facilement via l\'Internet. Votre professionnel a signé une convention avec Mobminder. Il est informé des responsabilités de chacun. Il agit en responsable de la collecte de données. Il a été informé en détail des mesures prises par Mobminder pour respecter vos données confidentielles. Mobminder se limite à lui fournir l\'outil de prise de RDV en ligne. Les responsabilités de Mobminder/cloud-Tech sprl dans le traitement de données sont décrites ci-dessous.', // French
		'Twój profesjonalista korzysta z tej strony do umawiania wizyt online, aby pomóc Ci łatwo umówić wizytę przez Internet. Twój profesjonalista podpisał umowę z Mobminder. Są poinformowani o obowiązkach każdej ze stron. Działają jako odpowiedzialni za zbieranie danych. Zostali szczegółowo poinformowani o środkach podjętych przez Mobminder w celu ochrony Twoich poufnych danych. Mobminder ogranicza się do dostarczania im narzędzia do umawiania wizyt online. Obowiązki Mobminder/cloud-Tech sprl w zakresie przetwarzania danych są opisane poniżej.', // Polish
		'Uw professional gebruikt deze online afsprakenpagina om u te helpen eenvoudig een afspraak te maken via het internet. Uw professional heeft een overeenkomst getekend met Mobminder. Zij zijn op de hoogte van de verantwoordelijkheden van elk van de partijen. Zij handelen als de verantwoordelijke voor de gegevensverzameling. Zij zijn gedetailleerd geïnformeerd over de maatregelen die Mobminder heeft genomen om uw vertrouwelijke gegevens te respecteren. Mobminder beperkt zich tot het verstrekken van het online afspraaktool. De verantwoordelijkheden van Mobminder/cloud-Tech sprl in gegevensverwerking worden hieronder beschreven.', // Dutch
		'Ihr Fachmann nutzt diese Online-Terminplanungsseite, um Ihnen zu helfen, ganz einfach einen Termin über das Internet zu vereinbaren. Ihr Fachmann hat eine Vereinbarung mit Mobminder unterzeichnet. Sie sind über die jeweiligen Verantwortlichkeiten informiert. Sie handeln als Verantwortliche für die Datenerfassung. Sie wurden detailliert über die von Mobminder ergriffenen Maßnahmen zum Schutz Ihrer vertraulichen Daten informiert. Mobminder beschränkt sich darauf, ihnen das Online-Terminplanungswerkzeug bereitzustellen. Die Verantwortlichkeiten von Mobminder/cloud-Tech sprl bei der Datenverarbeitung sind unten beschrieben.', // German
		'Il tuo professionista utilizza questa pagina di prenotazione online per aiutarti a prendere un appuntamento facilmente via Internet. Il tuo professionista ha firmato un accordo con Mobminder. Sono informati delle responsabilità di ciascuna parte. Agiscono come responsabili della raccolta dei dati. Sono stati informati in dettaglio delle misure adottate da Mobminder per rispettare i tuoi dati riservati. Mobminder si limita a fornire loro lo strumento di prenotazione online. Le responsabilità di Mobminder/cloud-Tech sprl nel trattamento dei dati sono descritte di seguito.', // Italian
		'Su profesional utiliza esta página de programación de citas en línea para ayudarle a programar una cita fácilmente a través de Internet. Su profesional ha firmado un acuerdo con Mobminder. Están informados de las responsabilidades de cada parte. Actúan como responsables de la recolección de datos. Han sido informados en detalle de las medidas tomadas por Mobminder para respetar sus datos confidenciales. Mobminder se limita a proporcionarles la herramienta de programación de citas en línea. Las responsabilidades de Mobminder/cloud-Tech sprl en el procesamiento de datos se describen a continuación.', // Spanish
		'O seu profissional usa esta página de agendamento de consultas online para ajudá-lo a marcar uma consulta facilmente através da Internet. O seu profissional assinou um acordo com a Mobminder. Eles estão informados das responsabilidades de cada parte. Eles atuam como responsáveis pela coleta de dados. Eles foram informados em detalhe sobre as medidas tomadas pela Mobminder para respeitar os seus dados confidenciais. A Mobminder limita-se a fornecer-lhes a ferramenta de agendamento de consultas online. As responsabilidades da Mobminder/cloud-Tech sprl no processamento de dados estão descritas abaixo.', // Portuguese
		'Ären Expert benotzt dës Online-Rendez-voussäit, fir Iech ze hëllefen, einfach en Rendez-vous iwwer den Internet ze maachen. Ären Expert huet eng Ofkommes mat Mobminder ënnerschriwwen. Si sinn iwwer d\'Verantwortung vun all Partei informéiert. Si handelen als Verantwortlech fir d\'Donnéeëssammlung. Si goufen am Detail iwwer déi vun Mobminder gehollene Moossname fir Är vertraulech Donnéeën ze respektéieren informéiert. Mobminder beschränkt sech drop, hinnen d\'Online-Rendez-vous Tool zur Verfügung ze stellen. D\'Verantwortung vu Mobminder/cloud-Tech sprl an der Donnéeëveraarbechtung gëtt hei ënnendrënner beschriwwen.' // Luxembourgish
		),

'consent p2' => array(
		'If you are already a [ALIASVISITOR] with [ACCOUNTNAME], you have already given your consent directly to your professional.', // English
		'Si vous êtes déjà [ALIASVISITOR] chez [ACCOUNTNAME], vous avez déjà donné votre consentement directement auprès de votre professionnel.', // French
		'Jeśli jesteś już [ALIASVISITOR] u [ACCOUNTNAME], to już wyraziłeś swoją zgodę bezpośrednio u swojego profesjonalisty.', // Polish
		'Als u al [ALIASVISITOR] bent bij [ACCOUNTNAME], heeft u al uw toestemming rechtstreeks aan uw professional gegeven.', // Dutch
		'Wenn Sie bereits [ALIASVISITOR] bei [ACCOUNTNAME] sind, haben Sie Ihre Zustimmung bereits direkt bei Ihrem Fachmann gegeben.', // German
		'Se sei già [ALIASVISITOR] presso [ACCOUNTNAME], hai già dato il tuo consenso direttamente al tuo professionista.', // Italian
		'Si ya es [ALIASVISITOR] con [ACCOUNTNAME], ya ha dado su consentimiento directamente a su profesional.', // Spanish
		'Se você já é [ALIASVISITOR] com [ACCOUNTNAME], você já deu seu consentimento diretamente ao seu profissional.', // Portuguese
		'Wann Dir schonn [ALIASVISITOR] bei [ACCOUNTNAME] sidd, hutt Dir Äert Averständnis schonn direkt bei Ärem Expert ginn.' // Luxembourgish
		),

'consent p3' => array(
		'If you are not yet a [ALIASVISITOR] with [ACCOUNTNAME], please read the following carefully. Using the online registration service implies your consent.', // English
		'Si vous n\'êtes pas encore [ALIASVISITOR] chez [ACCOUNTNAME], lisez attentivement la suite. L\'utilisation du service d\'inscription en ligne implique votre consentement.', // French
		'Jeśli nie jesteś jeszcze [ALIASVISITOR] u [ACCOUNTNAME], proszę uważnie przeczytać poniższe informacje. Korzystanie z usługi rejestracji online oznacza wyrażenie zgody.', // Polish
		'Als u nog geen [ALIASVISITOR] bent bij [ACCOUNTNAME], lees dan het volgende aandachtig door. Het gebruik van de online registratiedienst impliceert uw toestemming.', // Dutch
		'Wenn Sie noch kein [ALIASVISITOR] bei [ACCOUNTNAME] sind, lesen Sie bitte die folgenden Informationen sorgfältig durch. Die Nutzung des Online-Registrierungsdienstes impliziert Ihre Zustimmung.', // German
		'Se non sei ancora [ALIASVISITOR] presso [ACCOUNTNAME], leggi attentamente quanto segue. L\'utilizzo del servizio di registrazione online implica il tuo consenso.', // Italian
		'Si aún no es [ALIASVISITOR] con [ACCOUNTNAME], lea atentamente lo siguiente. El uso del servicio de registro en línea implica su consentimiento.', // Spanish
		'Se você ainda não é [ALIASVISITOR] com [ACCOUNTNAME], leia atentamente o seguinte. O uso do serviço de inscrição online implica o seu consentimento.', // Portuguese
		'Wann Dir nach keen [ALIASVISITOR] bei [ACCOUNTNAME] sidd, liest w.e.g. déi folgend Informatiounen suergfälteg. D\'Benotze vum Online-Aschreiwungsservice implizéiert Äert Averständnis.' // Luxembourgish
		),
		
'consent p4' => array(
		'You are free to decide whether or not to provide us with your personal data. However, please note that if you decide not to share certain data, we will not be able to process your data for the aforementioned purposes. You will not be able to make an online reservation, receive a confirmation or reminder, or benefit from our services.', // English
		'Vous êtes libre de décider de nous communiquer (ou non) vos données à caractère personnel. Notez toutefois que si vous décidez de ne pas nous faire part de certaines données, nous ne serons pas en mesure de traiter vos données aux fins précitées. Vous ne pourrez alors pas effectuer de réservation en ligne, ni recevoir de confirmation ou rappel, ni profiter de nos services.', // French
		'Jesteś wolny, aby zdecydować, czy udostępnisz nam swoje dane osobowe. Proszę jednak pamiętać, że jeśli zdecydujesz się nie udostępniać pewnych danych, nie będziemy w stanie przetwarzać twoich danych do wyżej wymienionych celów. Nie będziesz w stanie dokonać rezerwacji online, otrzymać potwierdzenia ani przypomnienia, ani skorzystać z naszych usług.', // Polish
		'U bent vrij om te beslissen of u ons uw persoonlijke gegevens verstrekt of niet. Houd er echter rekening mee dat als u besluit bepaalde gegevens niet te verstrekken, we uw gegevens niet kunnen verwerken voor de bovengenoemde doeleinden. U zult dan geen online reservering kunnen maken, geen bevestiging of herinnering ontvangen en geen gebruik kunnen maken van onze diensten.', // Dutch
		'Sie sind frei, zu entscheiden, ob Sie uns Ihre persönlichen Daten mitteilen möchten oder nicht. Bitte beachten Sie jedoch, dass wir, wenn Sie sich entscheiden, bestimmte Daten nicht mitzuteilen, Ihre Daten nicht für die oben genannten Zwecke verarbeiten können. Sie können dann keine Online-Reservierung vornehmen, keine Bestätigung oder Erinnerung erhalten und unsere Dienstleistungen nicht in Anspruch nehmen.', // German
		'Sei libero di decidere se fornirci o meno i tuoi dati personali. Tieni presente, tuttavia, che se decidi di non condividere determinate informazioni, non saremo in grado di trattare i tuoi dati per gli scopi sopra menzionati. Non potrai quindi effettuare una prenotazione online, ricevere conferme o promemoria, né usufruire dei nostri servizi.', // Italian
		'Usted es libre de decidir si nos proporciona o no sus datos personales. Sin embargo, tenga en cuenta que si decide no compartir ciertos datos, no podremos procesar sus datos para los fines antes mencionados. No podrá realizar una reserva en línea, recibir una confirmación o recordatorio, ni beneficiarse de nuestros servicios.', // Spanish
		'Você é livre para decidir se deseja ou não nos fornecer seus dados pessoais. No entanto, observe que, se decidir não compartilhar determinados dados, não poderemos processar seus dados para os fins mencionados acima. Você não poderá fazer uma reserva online, receber uma confirmação ou lembrete, ou se beneficiar de nossos serviços.', // Portuguese
		'Dir sidd fräi, ze entscheeden, ob Dir eis Är perséinlech Donnéeën zur Verfügung stellt oder net. W.e.g. bemierkt awer, datt wa Dir decidéiert, verschidde Donnéeën net mat eis ze deelen, kënne mir Är Donnéeën net fir déi uewenduerch gesoten Zwecker veraarbechten. Dir kënnt dann keng Online-Reservatioun maachen, keng Bestätegung oder Erënnerung kréien an eis Servicer net notzen.' // Luxembourgish
		),

'consent p5' => array(
		'In accordance with the General Data Protection Regulation, by giving your consent via the online booking form, you provide [ACCOUNTNAME] with your explicit consent to process your personal data as explained below.', // English
		'Dans le cadre du Règlement Général de Protection des Données et en donnant votre consentement via le formulaire de réservation en ligne, vous donnez à [ACCOUNTNAME] votre consentement explicite au traitement de vos données à caractère personnel tel qu\'expliqué ci-dessous.', // French
		'Zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych, poprzez udzielenie zgody za pomocą formularza rezerwacji online, udzielasz [ACCOUNTNAME] swojej wyraźnej zgody na przetwarzanie swoich danych osobowych, jak wyjaśniono poniżej.', // Polish
		'In overeenstemming met de Algemene Verordening Gegevensbescherming, door uw toestemming te geven via het online boekingsformulier, geeft u [ACCOUNTNAME] uw expliciete toestemming voor de verwerking van uw persoonsgegevens zoals hieronder uitgelegd.', // Dutch
		'Gemäß der Datenschutz-Grundverordnung erteilen Sie [ACCOUNTNAME] durch die Zustimmung über das Online-Buchungsformular Ihre ausdrückliche Zustimmung zur Verarbeitung Ihrer personenbezogenen Daten, wie nachstehend erläutert.', // German
		'In conformità con il Regolamento Generale sulla Protezione dei Dati, fornendo il tuo consenso tramite il modulo di prenotazione online, fornisci a [ACCOUNTNAME] il tuo consenso esplicito al trattamento dei tuoi dati personali come spiegato di seguito.', // Italian
		'De acuerdo con el Reglamento General de Protección de Datos y al dar su consentimiento a través del formulario de reserva en línea, usted otorga a [ACCOUNTNAME] su consentimiento explícito para el tratamiento de sus datos personales según se explica a continuación.', // Spanish
		'De acordo com o Regulamento Geral de Proteção de Dados e ao fornecer seu consentimento através do formulário de reserva online, você concede à [ACCOUNTNAME] seu consentimento explícito para o processamento de seus dados pessoais conforme explicado abaixo.', // Portuguese
		'Am Aklang mam Allgemenge Dateschutzreglement, gitt Dir [ACCOUNTNAME] duerch Är Zoustëmmung iwwert de Formulaire fir Online-Reservatioun Är explizit Zoustëmmung fir d\'Veraarbechtung vun Äre perséinlechen Donnéeën, wéi hei ënnendrënner erkläert.' // Luxembourgish
		),

'data processing title' => array(
		'Processing of your data', // English
		'Traitement de vos données', // French
		'Przetwarzanie twoich danych', // Polish
		'Verwerking van uw gegevens', // Dutch
		'Verarbeitung Ihrer Daten', // German
		'Trattamento dei tuoi dati', // Italian
		'Procesamiento de sus datos', // Spanish
		'Processamento dos seus dados', // Portuguese
		'Veraarbechtung vun Ären Donnéeën' // Luxembourgish
		),

'data processing intro' => array(
		'On behalf of [ACCOUNTNAME], Mobminder is responsible for the following processing tasks:', // English
		'Pour le compte de [ACCOUNTNAME], Mobminder est chargé du traitement suivant :', // French
		'W imieniu [ACCOUNTNAME], Mobminder jest odpowiedzialny za następujące zadania przetwarzania:', // Polish
		'Namens [ACCOUNTNAME] is Mobminder verantwoordelijk voor de volgende verwerkingsactiviteiten:', // Dutch
		'Im Auftrag von [ACCOUNTNAME] ist Mobminder für die folgenden Verarbeitungsaufgaben verantwortlich:', // German
		'Per conto di [ACCOUNTNAME], Mobminder è responsabile delle seguenti attività di trattamento:', // Italian
		'En nombre de [ACCOUNTNAME], Mobminder es responsable de las siguientes tareas de procesamiento:', // Spanish
		'Em nome de [ACCOUNTNAME], a Mobminder é responsável pelas seguintes tarefas de processamento:', // Portuguese
		'Am Numm vun [ACCOUNTNAME] ass Mobminder fir déi folgend Veraarbechtungsaufgaben zoustänneg:' // Luxembourgish
		),
		
'data processing list 1' => array( 
		'Your registration in the register of the relevant professional ([ACCOUNTNAME])', // English
		'Votre inscription dans le registre du professionnel concerné ([ACCOUNTNAME])', // French
		'Twoja rejestracja w rejestr odpowiedniego specjalisty ([ACCOUNTNAME])', // Polish
		'Uw registratie in het register van de betreffende professional ([ACCOUNTNAME])', // Dutch
		'Ihre Registrierung im register des betreffenden Fachmanns ([ACCOUNTNAME])', // German
		'La tua registrazione nel registro del professionista competente ([ACCOUNTNAME])', // Italian
		'Su registro en el registro del profesional correspondiente ([ACCOUNTNAME])', // Spanish
		'Sua inscrição no registro do profissional relevante ([ACCOUNTNAME])', // Portuguese
		'Är Aschreiwung an de Register vum zoustännege Fachmann ([ACCOUNTNAME])' // Luxembourgish
		),

'data processing list 2' => array(
		'The booking of an appointment, only with [ACCOUNTNAME]', // English
		'La réservation d\'un rendez-vous, uniquement chez [ACCOUNTNAME]', // French
		'Rezerwacja wizyty, wyłącznie u [ACCOUNTNAME]', // Polish
		'Het maken van een afspraak, alleen bij [ACCOUNTNAME]', // Dutch
		'Die Buchung eines Termins, nur bei [ACCOUNTNAME]', // German
		'La prenotazione di un appuntamento, solo presso [ACCOUNTNAME]', // Italian
		'La reserva de una cita, solo con [ACCOUNTNAME]', // Spanish
		'A marcação de uma consulta, somente com [ACCOUNTNAME]', // Portuguese
		'D\'Buchung vun engem Rendez-vous, nëmmen bei [ACCOUNTNAME]' // Luxembourgish
		),

'data processing list 3' => array(
		'Managing your appointments (viewing, modifying, or deleting) by yourself.', // English
		'La gestion de vos rendez-vous (consulter, modifier ou supprimer) par vous-même.', // French
		'Zarządzanie swoimi wizytami (przeglądanie, modyfikowanie lub usuwanie) samodzielnie.', // Polish
		'Het beheren van uw afspraken (bekijken, wijzigen of verwijderen) door uzelf.', // Dutch
		'Die Verwaltung Ihrer Termine (einsehen, ändern oder löschen) durch sich selbst.', // German
		'Gestire i tuoi appuntamenti (visualizzare, modificare o eliminare) da solo.', // Italian
		'La gestión de sus citas (consultar, modificar o eliminar) por usted mismo.', // Spanish
		'A gestão das suas consultas (visualizar, modificar ou excluir) por você mesmo.', // Portuguese
		'D\'Gestioun vun Äre Rendez-vousen (ukucken, änneren oder läschen) selwer.' // Luxembourgish
		),

'data processing list 4' => array(
		'Sending communications (via email, SMS, or other) related to the use of this service, your appointments, your personal data, or general or legal information regarding [ACCOUNTNAME] services. These communications are limited solely to your interaction with [ACCOUNTNAME].', // English
		'L\'envoi de communications (par e-mail, SMS ou autre) liées à l\'utilisation de ce service, à vos rendez-vous, à vos données personnelles ou des informations générales ou juridiques concernant les services de [ACCOUNTNAME]. Ces communications se limitent exclusivement à votre interaction avec [ACCOUNTNAME].', // French
		'Wysyłanie komunikacji (e-mailem, SMS-em lub innymi) związanej z korzystaniem z tej usługi, z Twoimi wizytami, Twoimi danymi osobowymi lub ogólnymi lub prawnymi informacjami dotyczącymi usług [ACCOUNTNAME]. Ta komunikacja jest ograniczona wyłącznie do Twojej interakcji z [ACCOUNTNAME].', // Polish
		'Het versturen van communicatie (per e-mail, SMS of ander) met betrekking tot het gebruik van deze service, uw afspraken, uw persoonlijke gegevens of algemene of juridische informatie over de diensten van [ACCOUNTNAME]. Deze communicatie is uitsluitend beperkt tot uw interactie met [ACCOUNTNAME].', // Dutch
		'Das Versenden von Mitteilungen (per E-Mail, SMS oder anderen) im Zusammenhang mit der Nutzung dieses Dienstes, Ihren Terminen, Ihren persönlichen Daten oder allgemeinen oder rechtlichen Informationen zu den Diensten von [ACCOUNTNAME]. Diese Mitteilungen beschränken sich ausschließlich auf Ihre Interaktion mit [ACCOUNTNAME].', // German
		'Invio di comunicazioni (tramite e-mail, SMS o altro) relative all\'utilizzo di questo servizio, ai tuoi appuntamenti, ai tuoi dati personali o a informazioni generali o legali riguardanti i servizi di [ACCOUNTNAME]. Queste comunicazioni sono limitate esclusivamente alla tua interazione con [ACCOUNTNAME].', // Italian
		'El envío de comunicaciones (por correo electrónico, SMS u otro) relacionadas con el uso de este servicio, sus citas, sus datos personales o información general o legal sobre los servicios de [ACCOUNTNAME]. Estas comunicaciones se limitan exclusivamente a su interacción con [ACCOUNTNAME].', // Spanish
		'O envio de comunicações (por e-mail, SMS ou outro) relacionadas com a utilização deste serviço, suas consultas, seus dados pessoais ou informações gerais ou jurídicas sobre os serviços de [ACCOUNTNAME]. Estas comunicações estão restritas exclusivamente à sua interação com [ACCOUNTNAME].', // Portuguese
		'D\'Schécken vu Kommunikatiounen (per E-Mail, SMS oder anerem) am Zesummenhang mat der Notzung vun dësem Service, Äre Rendez-vousen, Äre perséinlechen Donnéeën oder allgemengen oder legale Informatiounen iwwer d\'Servicer vu [ACCOUNTNAME]. Dës Kommunikatiounen si limitéiert op Är Interaktioun mat [ACCOUNTNAME].' // Luxembourgish
		),
		
'data processing list 5' => array(
		'The storage and security of calendar data, including various communications exchanged with [ACCOUNTNAME].', // English
		'Le stockage et la sécurité des données d\'agenda relatives, inclus les divers communications échangées avec [ACCOUNTNAME].', // French
		'Przechowywanie i bezpieczeństwo danych kalendarza, w tym różnych komunikacji wymienianych z [ACCOUNTNAME].', // Polish
		'Het opslaan en beveiligen van agenda-gegevens, inclusief de verschillende communicatie uitgewisseld met [ACCOUNTNAME].', // Dutch
		'Die Speicherung und Sicherheit von Kalenderdaten, einschließlich der verschiedenen Kommunikationen, die mit [ACCOUNTNAME] ausgetauscht wurden.', // German
		'La memorizzazione e la sicurezza dei dati di agenda, inclusa la diversa comunicazione scambiata con [ACCOUNTNAME].', // Italian
		'El almacenamiento y la seguridad de los datos del calendario, incluyendo las diversas comunicaciones intercambiadas con [ACCOUNTNAME].', // Spanish
		'O armazenamento e a segurança dos dados da agenda, incluindo as várias comunicações trocadas com [ACCOUNTNAME].', // Portuguese
		'D\'Späicherung an d\'Sécherheet vun den Agenda-Donnéeën, abegraff déi verschidde Kommunikatiounen, déi mat [ACCOUNTNAME] ausgetosch ginn.' // Luxembourgish
		),

'data processing retention' => array(
		'We process your personal data for as long as it is necessary within the framework of our service contract with [ACCOUNTNAME]. It is also possible that the law requires us to retain the data for a certain period. In the absence of other pre-emptive legal measures, you have the right to access your data and have it (corrected or deleted).', // English
		'Nous traitons vos données à caractère personnel aussi longtemps qu\'elles sont nécessaires dans le cadre de notre contrat de services avec [ACCOUNTNAME]. Il est en outre possible que la loi nous impose de conserver les données pendant un certain temps. À défaut d\'autre mesure juridique pré-emptive, vous avez le droit de consulter vos données et de les (faire) corriger ou effacer.', // French
		'Przetwarzamy Twoje dane osobowe tak długo, jak jest to konieczne w ramach naszej umowy o świadczenie usług z [ACCOUNTNAME]. Możliwe jest również, że prawo zobowiązuje nas do przechowywania danych przez określony czas. W przypadku braku innych działań prawnych zapobiegawczych, masz prawo do dostępu do swoich danych oraz do ich (poprawienia lub usunięcia).', // Polish
		'Wij verwerken uw persoonlijke gegevens zolang dit nodig is in het kader van onze serviceovereenkomst met [ACCOUNTNAME]. Het is ook mogelijk dat de wet ons verplicht om de gegevens gedurende een bepaalde periode te bewaren. Bij gebrek aan andere juridische maatregelen heeft u het recht om uw gegevens in te zien en deze (te laten) corrigeren of verwijderen.', // Dutch
		'Wir verarbeiten Ihre personenbezogenen Daten, solange dies im Rahmen unseres Dienstleistungsvertrags mit [ACCOUNTNAME] erforderlich ist. Es ist auch möglich, dass das Gesetz uns verpflichtet, die Daten für eine bestimmte Zeit aufzubewahren. In Ermangelung anderer rechtlicher Maßnahmen haben Sie das Recht, Ihre Daten einzusehen und sie (korrigieren oder löschen zu lassen).', // German
		'Trattiamo i tuoi dati personali finché sono necessari nell\'ambito del nostro contratto di servizi con [ACCOUNTNAME]. È inoltre possibile che la legge ci obblighi a conservare i dati per un certo periodo. In assenza di altre misure legali preventive, hai il diritto di consultare i tuoi dati e di (farli) correggere o cancellare.', // Italian
		'Procesamos sus datos personales mientras sean necesarios en el marco de nuestro contrato de servicios con [ACCOUNTNAME]. También es posible que la ley nos exija conservar los datos durante un cierto período. En ausencia de otras medidas legales preventivas, tiene derecho a acceder a sus datos y a (corregirlos o eliminarlos).', // Spanish
		'Processamos seus dados pessoais enquanto forem necessários no âmbito do nosso contrato de serviços com [ACCOUNTNAME]. Também é possível que a lei nos obrigue a reter os dados por um certo período. Na ausência de outras medidas legais preventivas, você tem o direito de acessar seus dados e (corrigi-los ou excluí-los).', // Portuguese
		'Mir verarbeiten Är perséinlech Donnéeën esou laang wéi néideg am Kader vun eisem Servicevertrag mat [ACCOUNTNAME]. Et ass och méiglech, datt d\'Gesetz eis verpflicht, d\'Donnéeën fir eng gewëssen Zäit ze behalen. Am Fall vun engem Mangel u präventiven legale Moossnamen hutt Dir d\'Recht, Är Donnéeën ze konsultéieren an se (änneren oder läschen) ze loossen.' // Luxembourgish
		),

'data communication title' => array(
		'What data do you need to provide?', // English
		'Quelles données devez-vous communiquer?', // French
		'Jakie dane musisz przekazać?', // Polish
		'Welke gegevens moet je doorgeven?', // Dutch
		'Welche Daten müssen Sie angeben?', // German
		'Quali dati devi comunicare?', // Italian
		'¿Qué datos debes proporcionar?', // Spanish
		'Que dados você precisa fornecer?', // Portuguese
		'Wéi eng Donnéeën musst Dir ubidden?' // Luxembourgish
		),

'data communication intro registered' => array(
		'If you are already a [ALIASVISITOR] of [ACCOUNTNAME], you have already provided the necessary data to your professional. The online appointment booking system will only verify your identity.', // English
		'Si vous êtes déjà [ALIASVISITOR] de [ACCOUNTNAME], vous avez déjà communiqué les données nécessaires à votre professionnel. Le système de prise de RDV en ligne se limitera à vérifier votre identité.', // French
		'Jeśli jesteś już [ALIASVISITOR] u [ACCOUNTNAME], już przekazałeś swojemu profesjonaliście niezbędne dane. System rezerwacji online ograniczy się do weryfikacji Twojej tożsamości.', // Polish
		'Als u al [ALIASVISITOR] bent bij [ACCOUNTNAME], hebt u de benodigde gegevens al aan uw professional verstrekt. Het online afsprakensysteem zal zich alleen beperken tot het verifiëren van uw identiteit.', // Dutch
		'Wenn Sie bereits [ALIASVISITOR] bei [ACCOUNTNAME] sind, haben Sie Ihrem Fachmann bereits die erforderlichen Daten übermittelt. Das Online-Terminbuchungssystem beschränkt sich nur darauf, Ihre Identität zu überprüfen.', // German
		'Se sei già [ALIASVISITOR] di [ACCOUNTNAME], hai già fornito i dati necessari al tuo professionista. Il sistema di prenotazione online si limiterà a verificare la tua identità.', // Italian
		'Si ya es [ALIASVISITOR] de [ACCOUNTNAME], ya ha proporcionado los datos necesarios a su profesional. El sistema de reserva de citas en línea solo verificará su identidad.', // Spanish
		'Se você já é [ALIASVISITOR] de [ACCOUNTNAME], você já forneceu os dados necessários ao seu profissional. O sistema de agendamento online se limitará a verificar sua identidade.', // Portuguese
		'Wann Dir schonn [ALIASVISITOR] vun [ACCOUNTNAME] sidd, hutt Dir scho mat Ärem Expert déi néideg Donnéeën gedeelt. D\'Online-Rendez-vous-Buchungssystem wäert sech nëmmen op d\'Iwwerpréiwung vun Ärer Identitéit limitéieren.' // Luxembourgish
		),
		
'data communication intro not registered' => array(
		'If you are not yet an [ALIASVISITOR] of [ACCOUNTNAME], the following data is required:', // English
		'Si vous n\'êtes pas encore [ALIASVISITOR] de [ACCOUNTNAME], les données suivantes sont requises:', // French
		'Jeśli nie jesteś jeszcze [ALIASVISITOR] [ACCOUNTNAME], wymagane są następujące dane:', // Polish
		'Als je nog geen [ALIASVISITOR] van [ACCOUNTNAME] bent, zijn de volgende gegevens vereist:', // Dutch
		'Wenn Sie noch kein [ALIASVISITOR] von [ACCOUNTNAME] sind, sind die folgenden Daten erforderlich:', // German
		'Se non sei ancora un [ALIASVISITOR] di [ACCOUNTNAME], sono necessari i seguenti dati:', // Italian
		'Si aún no eres un [ALIASVISITOR] de [ACCOUNTNAME], se requieren los siguientes datos:', // Spanish
		'Se você ainda não é um [ALIASVISITOR] de [ACCOUNTNAME], os seguintes dados são necessários:', // Portuguese
		'Wann Dir nach kee [ALIASVISITOR] vu [ACCOUNTNAME] sidd, gi folgend Donnéeën gebraucht:' // Luxembourgish
		),

'data communication list 1' => array(
		'Identity data', // English
		'Données d’identité', // French
		'Dane tożsamości', // Polish
		'Identiteitsgegevens', // Dutch
		'Identitätsdaten', // German
		'Dati di identità', // Italian
		'Datos de identidad', // Spanish
		'Dados de identidade', // Portuguese
		'Identitéitsdonnéeën' // Luxembourgish
		),

'data communication list 2' => array(
		'Date of birth (health professionals only)', // English
		'Date de naissance (professionnels de la santé uniquement)', // French
		'Data urodzenia (tylko dla specjalistów medycznych)', // Polish
		'Geboortedatum (alleen zorgprofessionals)', // Dutch
		'Geburtsdatum (nur für Gesundheitsberufe)', // German
		'Data di nascita (solo per professionisti della salute)', // Italian
		'Fecha de nacimiento (solo para profesionales de la salud)', // Spanish
		'Data de nascimento (somente para profissionais de saúde)', // Portuguese
		'Gebuertsdatum (nëmme fir Gesondheetsberuffer)' // Luxembourgish
		),

'data communication list 3' => array(
		'Location data (health professionals only)', // English
		'Données de localisation (professionnels de la santé uniquement)', // French
		'Dane lokalizacji (tylko dla specjalistów medycznych)', // Polish
		'Locatiegegevens (alleen zorgprofessionals)', // Dutch
		'Standortdaten (nur für Gesundheitsberufe)', // German
		'Dati di localizzazione (solo per professionisti della salute)', // Italian
		'Datos de localización (solo para profesionales de la salud)', // Spanish
		'Dados de localização (somente para profissionais de saúde)', // Portuguese
		'Standuertdonnéeën (nëmme fir Gesondheetsberuffer)' // Luxembourgish
		),

'data communication list 4' => array(
		'Contact data', // English
		'Données de contact', // French
		'Dane kontaktowe', // Polish
		'Contactgegevens', // Dutch
		'Kontaktdaten', // German
		'Dati di contatto', // Italian
		'Datos de contacto', // Spanish
		'Dados de contato', // Portuguese
		'Kontaktpersounen-Donnéeën' // Luxembourgish
		),
		
'data communication list 5' => array(
		'Security data (health professionals only)', // English
		'Données de sécurité (professionnels de la santé uniquement)', // French
		'Dane bezpieczeństwa (tylko dla specjalistów medycznych)', // Polish
		'Beveiligingsgegevens (alleen zorgprofessionals)', // Dutch
		'Sicherheitsdaten (nur für Gesundheitsberufe)', // German
		'Dati di sicurezza (solo per professionisti della salute)', // Italian
		'Datos de seguridad (solo para profesionales de la salud)', // Spanish
		'Dados de segurança (somente para profissionais de saúde)', // Portuguese
		'Sécherheetsdonnéeën (nëmme fir Gesondheetsberuffer)' // Luxembourgish
		),

'data visibility title' => array(
		'Who can view your data?', // English
		'Qui peut visualiser vos données?', // French
		'Kto może zobaczyć twoje dane?', // Polish
		'Wie kan uw gegevens bekijken?', // Dutch
		'Wer kann Ihre Daten einsehen?', // German
		'Chi può visualizzare i tuoi dati?', // Italian
		'¿Quién puede ver tus datos?', // Spanish
		'Quem pode visualizar seus dados?', // Portuguese
		'Wien kann Är Donnéeën gesinn?' // Luxembourgish
		),

'data visibility intro' => array(
		'It is important to note that, unlike other products available on the Internet (notably medical directories), your registration is not a registration on the Mobminder service. We are limited to offering [ACCOUNTNAME] a tool for online appointment booking and schedule management. None of your data is used or retrieved for any purpose other than that provided by your professional [ACCOUNTNAME].', // English
		'Il est important de noter que, contrairement à d\'autres produits existant sur l\'Internet (notamment les annuaires médicaux), votre inscription n\'est pas une inscription sur le service Mobminder. Nous nous limitons à offrir à [ACCOUNTNAME] un outil de prise de RDV en ligne et de gestion de planning. Aucune de vos données n\'est utilisée ou récupérée pour servir une autre finalité que celle qui vous est offerte par votre professionnel [ACCOUNTNAME].', // French
		'Ważne jest, aby zauważyć, że w przeciwieństwie do innych produktów dostępnych w Internecie (zwłaszcza katalogów medycznych), twoja rejestracja nie jest rejestracją w usłudze Mobminder. Ograniczamy się do oferowania [ACCOUNTNAME] narzędzia do rezerwacji wizyt online i zarządzania harmonogramem. Żadne z twoich danych nie są wykorzystywane ani pobierane do innych celów niż te, które są oferowane przez twojego profesjonalistę [ACCOUNTNAME].', // Polish
		'Het is belangrijk op te merken dat, in tegenstelling tot andere producten die op het internet beschikbaar zijn (met name medische directories), uw registratie geen registratie is op de Mobminder-service. Wij beperken ons tot het aanbieden van [ACCOUNTNAME] een hulpmiddel voor online afspraken maken en planningbeheer. Geen van uw gegevens wordt gebruikt of opgehaald voor enig ander doel dan dat wat door uw professional [ACCOUNTNAME] wordt aangeboden.', // Dutch
		'Es ist wichtig zu beachten, dass Ihre Registrierung im Gegensatz zu anderen im Internet verfügbaren Produkten (insbesondere medizinische Verzeichnisse) keine Registrierung beim Mobminder-Dienst ist. Wir beschränken uns darauf, [ACCOUNTNAME] ein Tool zur Online-Terminvereinbarung und Terminverwaltung anzubieten. Keine Ihrer Daten wird für andere Zwecke verwendet oder abgerufen als die, die Ihnen von Ihrem Fachmann [ACCOUNTNAME] angeboten werden.', // German
		'È importante notare che, a differenza di altri prodotti disponibili su Internet (in particolare gli elenchi medici), la tua registrazione non è una registrazione sul servizio Mobminder. Ci limitiamo a offrire a [ACCOUNTNAME] uno strumento per la prenotazione online e la gestione dell\'agenda. Nessuno dei tuoi dati viene utilizzato o recuperato per altri scopi oltre a quelli offerti dal tuo professionista [ACCOUNTNAME].', // Italian
		'Es importante señalar que, a diferencia de otros productos disponibles en Internet (notablemente directorios médicos), su registro no es un registro en el servicio Mobminder. Nos limitamos a ofrecer a [ACCOUNTNAME] una herramienta para la reserva de citas en línea y la gestión de horarios. Ninguno de sus datos se utiliza o recupera para ningún otro propósito que no sea el proporcionado por su profesional [ACCOUNTNAME].', // Spanish
		'É importante notar que, ao contrário de outros produtos disponíveis na Internet (notavelmente diretórios médicos), seu registro não é um registro no serviço Mobminder. Limitamo-nos a oferecer à [ACCOUNTNAME] uma ferramenta para agendamento de consultas online e gerenciamento de agenda. Nenhum de seus dados é usado ou recuperado para qualquer outro fim além daquele oferecido pelo seu profissional [ACCOUNTNAME].', // Portuguese
		'Et ass wichteg ze notéieren, datt Är Aschreiwung, am Géigesaz zu anere Produkter, déi um Internet verfügbar sinn (besonnesch medizinesch Verzeichnesser), keng Aschreiwung um Mobminder-Service ass. Mir limitéieren eis op d\'Offer vun engem Tool fir [ACCOUNTNAME] fir Online-Rendez-vous-Buchung an Terminmanagement. Keng vun Äre Donnéeën gëtt fir aner Zwecker benotzt oder ofgeruff wéi déi, déi vun Ärem Fachmann [ACCOUNTNAME] ugebuede ginn.' // Luxembourgish
		),

'data visibility professional access' => array(
		'Qualified and authorized professional staff by [ACCOUNTNAME] will have access to your personal data.', // English
		'Le personnel professionnel qualifié et mandaté par [ACCOUNTNAME] aura accès à vos données personnelles.', // French
		'Wykwalifikowany i upoważniony personel [ACCOUNTNAME] będzie miał dostęp do Twoich danych osobowych.', // Polish
		'Gekwalificeerd en gemachtigd personeel van [ACCOUNTNAME] zal toegang hebben tot uw persoonlijke gegevens.', // Dutch
		'Qualifiziertes und autorisiertes Fachpersonal von [ACCOUNTNAME] wird Zugang zu Ihren persönlichen Daten haben.', // German
		'Il personale qualificato e autorizzato da [ACCOUNTNAME] avrà accesso ai tuoi dati personali.', // Italian
		'El personal profesional cualificado y autorizado por [ACCOUNTNAME] tendrá acceso a sus datos personales.', // Spanish
		'O pessoal qualificado e autorizado por [ACCOUNTNAME] terá acesso aos seus dados pessoais.', // Portuguese
		'Qualifizéiert a beoptraagt Fachleit vun [ACCOUNTNAME] hunn Zougang zu Ären perséinlechen Donnéeën.' // Luxembourgish
		),
		
'data visibility confidentiality' => array(
		'Your confidential data is never shared with another professional, another company, or entrusted to another service provider.', // English
		'Vos données à caractère confidentiel ne sont jamais partagées avec un autre professionnel, une autre société, ni confiées à un autre prestataire.', // French
		'Twoje dane poufne nigdy nie są udostępniane innemu profesjonaliście, innej firmie ani przekazywane innemu usługodawcy.', // Polish
		'Uw vertrouwelijke gegevens worden nooit gedeeld met een andere professional, een ander bedrijf of toevertrouwd aan een andere dienstverlener.', // Dutch
		'Ihre vertraulichen Daten werden niemals mit einem anderen Fachmann, einer anderen Firma oder einem anderen Dienstleister geteilt.', // German
		'I tuoi dati confidenziali non vengono mai condivisi con un altro professionista, un altra azienda, né affidati a un altro fornitore di servizi.', // Italian
		'Sus datos confidenciales nunca se comparten con otro profesional, otra empresa ni se confían a otro proveedor de servicios.', // Spanish
		'Seus dados confidenciais nunca são compartilhados com outro profissional, outra empresa, ou confiados a outro prestador de serviços.', // Portuguese
		'Är vertraulech Donnéeën ginn ni mat engem aneren Expert, enger anerer Firma oder engem anere Serviceprovider gedeelt.' // Luxembourgish
		),

'data visibility storage' => array(
		'Information storage always takes place in an EU country with a GDPR-compliant cloud storage provider. This cloud storage provider has no access to your data.', // English
		'Le stockage des informations a toujours lieu dans un pays de l\'UE auprès d\'un fournisseur de stockage cloud respectueux de GDPR. Ce fournisseur de stockage cloud n\'a aucun accès à vos données.', // French
		'Przechowywanie informacji zawsze odbywa się w kraju UE u dostawcy usług chmurowych zgodnych z RODO. Ten dostawca usług chmurowych nie ma dostępu do twoich danych.', // Polish
		'De opslag van informatie vindt altijd plaats in een EU-land bij een GDPR-conforme cloudopslagprovider. Deze cloudopslagprovider heeft geen toegang tot uw gegevens.', // Dutch
		'Die Speicherung der Informationen erfolgt immer in einem EU-Land bei einem DSGVO-konformen Cloud-Speicheranbieter. Dieser Cloud-Speicheranbieter hat keinen Zugriff auf Ihre Daten.', // German
		'La memorizzazione delle informazioni avviene sempre in un paese dell\'UE con un provider di cloud storage conforme al GDPR. Questo provider di cloud storage non ha accesso ai tuoi dati.', // Italian
		'El almacenamiento de la información siempre tiene lugar en un país de la UE con un proveedor de almacenamiento en la nube compatible con el GDPR. Este proveedor de almacenamiento en la nube no tiene acceso a sus datos.', // Spanish
		'O armazenamento de informações ocorre sempre em um país da UE com um provedor de armazenamento em nuvem em conformidade com o GDPR. Este provedor de armazenamento em nuvem não tem acesso aos seus dados.', // Portuguese
		'D\'Späicherung vun Informatioune fënnt ëmmer an engem EU-Land mat engem GDPR-konformen Cloud-Späicheranbieter statt. Dëse Cloud-Späicheranbieter huet keen Zougang zu Ären Donnéeën.' // Luxembourgish
		),

'complaints and rights title' => array(
		'Complaint, right of access, objection, and rectification', // English
		'Plainte, droit d’accès, d’opposition et de rectification', // French
		'Skarga, prawo dostępu, sprzeciwu i korekty', // Polish
		'Klacht, recht op toegang, bezwaar en correctie', // Dutch
		'Beschwerde, Auskunftsrecht, Widerspruch und Berichtigung', // German
		'Reclamo, diritto di accesso, opposizione e rettifica', // Italian
		'Queja, derecho de acceso, oposición y rectificación', // Spanish
		'Reclamação, direito de acesso, objeção e retificação', // Portuguese
		'Reklamm, Recht op Zougang, Géigenstellung an Rektifikatioun' // Luxembourgish
		),
		
'complaints and rights intro' => array(
		'If you believe that this website does not respect your privacy, please inform your professional. They will submit your request to us. We will make every effort to identify and correct the issue. You can also contact Mobminder directly via this website: www.mobminder.com, using the contact form. Please indicate which professional is concerned.', // English
		'Si vous pensez que ce site internet ne respecte pas votre vie privée, veuillez en informer votre professionnel. Celui-ci nous soumettra votre requête. Nous mettrons tout en œuvre pour déceler et corriger le problème. Vous pouvez également contacter directement Mobminder via ce site web: www.mobminder.com, en utilisant le formulaire de contact. SVP, indiquer nous quel professionnel est concerné.', // French
		'Jeśli uważasz, że ta strona internetowa nie szanuje twojej prywatności, proszę poinformuj swojego specjalistę. On przekroczy twoje żądanie do nas. Dołożymy wszelkich starań, aby zidentyfikować i naprawić problem. Możesz także skontaktować się bezpośrednio z Mobminder za pośrednictwem tej strony: www.mobminder.com, korzystając z formularza kontaktowego. Proszę wskazać, który profesjonalista jest zaangażowany.', // Polish
		'Als u denkt dat deze website uw privacy niet respecteert, informeer dan uw professional. Deze zal uw verzoek aan ons doorsturen. Wij zullen ons best doen om het probleem te identificeren en op te lossen. U kunt Mobminder ook direct contacteren via deze website: www.mobminder.com, door het contactformulier te gebruiken. Geef alstublieft aan welke professional betrokken is.', // Dutch
		'Wenn Sie der Meinung sind, dass diese Website Ihre Privatsphäre nicht respektiert, informieren Sie bitte Ihren Fachmann. Dieser wird Ihre Anfrage an uns weiterleiten. Wir werden alle Anstrengungen unternehmen, um das Problem zu erkennen und zu beheben. Sie können auch direkt über diese Website www.mobminder.com Kontakt mit Mobminder aufnehmen, indem Sie das Kontaktformular verwenden. Bitte geben Sie an, welcher Fachmann betroffen ist.', // German
		'Se pensi che questo sito web non rispetti la tua privacy, ti preghiamo di informare il tuo professionista. Quest’ultimo ci presenterà la tua richiesta. Faremo tutto il possibile per rilevare e correggere il problema. Puoi anche contattare direttamente Mobminder tramite questo sito web: www.mobminder.com, utilizzando il modulo di contatto. Si prega di indicare quale professionista è interessato.', // Italian
		'Si crees que este sitio web no respeta tu privacidad, informa a tu profesional. Él enviará tu solicitud a nosotros. Haremos todo lo posible para detectar y corregir el problema. También puedes contactar directamente con Mobminder a través de este sitio web: www.mobminder.com, utilizando el formulario de contacto. Por favor, indica qué profesional está involucrado.', // Spanish
		'Se você acredita que este site não respeita sua privacidade, informe seu profissional. Ele nos encaminhará sua solicitação. Faremos todo o possível para identificar e corrigir o problema. Você também pode entrar em contato diretamente com a Mobminder através deste site: www.mobminder.com, utilizando o formulário de contato. Por favor, indique qual profissional está envolvido.', // Portuguese
		'Wann Dir mengt, datt dës Websäit Är Privatsphär net respektéiert, informéiert w.e.g. Ären Expert. Hien wäert Är Ufro un eis weiderginn. Mir wäerten eist Bescht maachen, fir de Problem ze identifizéieren an ze léisen. Dir kënnt och direkt iwwer dës Websäit www.mobminder.com mam Mobminder kontaktéieren, andeems Dir de Kontaktformular benotzt. W.e.g., gitt un, wéi en Expert betraff ass.' // Luxembourgish
		),

'complaints and rights request' => array(
		'Upon written request dated and signed sent to Mobminder, you may, after proving your identity (copy of ID card), obtain free written communication of the personal data concerning you, as well as, where applicable, the correction of any inaccurate, incomplete, or irrelevant data. A copy of your data will be provided to you no later than 30 days after receipt of your request. You also have the right to request the deletion of your data.', // English
		'Moyennant demande écrite datée et signée envoyée à Mobminder, vous pouvez, après avoir justifié votre identité (copie de la carte d\'identité), obtenir gratuitement la communication écrite des données à caractère personnel vous concernant ainsi que, le cas échéant, la rectification de celles qui seraient inexactes, incomplètes ou non pertinentes. Une copie de vos données vous sera communiquée au plus tard 30 jours après l\'accusé de réception de votre demande. Vous disposez également du droit d\'exiger l\'effacement de vos données.', // French
		'Na podstawie pisemnego wniosku datowanego i podpisanego wysłanego do Mobminder, po potwierdzeniu swojej tożsamości (kopii dowodu osobistego), możesz uzyskać bezpłatne pisemne informacje na temat danych osobowych dotyczących ciebie oraz, w razie potrzeby, poprawienie wszelkich niedokładnych, niekompletnych lub nieistotnych danych. Kopia twoich danych zostanie dostarczona najpóźniej 30 dni po potwierdzeniu odbioru twojego wniosku. Masz również prawo żądać usunięcia swoich danych.', // Polish
		'Op schriftelijk verzoek, gedateerd en ondertekend en verzonden naar Mobminder, kunt u, na identificatie (kopie van identiteitskaart), gratis schriftelijke mededeling van de gegevens die u betreffen verkrijgen, alsook, indien van toepassing, de correctie van onjuiste, onvolledige of irrelevante gegevens. Een kopie van uw gegevens zal uiterlijk 30 dagen na ontvangst van uw verzoek worden verstrekt. U heeft ook het recht om het wissen van uw gegevens te verzoeken.', // Dutch
		'Auf schriftliche Anfrage, datiert und unterschrieben und an Mobminder gesendet, können Sie nach Nachweis Ihrer Identität (Kopie des Personalausweises) kostenlos eine schriftliche Mitteilung der Sie betreffenden personenbezogenen Daten sowie gegebenenfalls die Berichtigung ungenauer, unvollständiger oder irrelevanter Daten erhalten. Eine Kopie Ihrer Daten wird Ihnen spätestens 30 Tage nach Erhalt Ihrer Anfrage zur Verfügung gestellt. Sie haben auch das Recht, die Löschung Ihrer Daten zu verlangen.', // German
		'Su richiesta scritta, datata e firmata inviata a Mobminder, puoi, dopo aver dimostrato la tua identità (copia del documento d\'identità), ottenere gratuitamente la comunicazione scritta dei dati personali che ti riguardano, nonché, se del caso, la rettifica di quelli che risultassero inaccurati, incompleti o non pertinenti. Una copia dei tuoi dati ti sarà fornita al più tardi 30 giorni dopo la ricezione della tua richiesta. Hai anche il diritto di richiedere la cancellazione dei tuoi dati.', // Italian
		'Mediante solicitud escrita, fechada y firmada enviada a Mobminder, puedes, tras haber justificado tu identidad (copia del documento de identidad), obtener gratuitamente la comunicación escrita de los datos personales que te conciernen, así como, en su caso, la rectificación de aquellos que fueran inexactos, incompletos o no pertinentes. Se te proporcionará una copia de tus datos a más tardar 30 días después de la recepción de tu solicitud. También tienes el derecho de exigir la eliminación de tus datos.', // Spanish
		'Mediante solicitação por escrito, datada e assinada, enviada à Mobminder, você pode, após comprovar sua identidade (cópia do documento de identidade), obter gratuitamente a comunicação por escrito dos dados pessoais que lhe dizem respeito, bem como, se for o caso, a correção daqueles que sejam imprecisos, incompletos ou não relevantes. Uma cópia dos seus dados será fornecida a você no prazo máximo de 30 dias após o recebimento da sua solicitação. Você também tem o direito de exigir a exclusão dos seus dados.', // Portuguese
		'Mëttels schrëftlecher Demande, datéiert an ënnerschriwwen an u Mobminder geschéckt, kënnt Dir, nodeems Dir Är Identitéit beweist (Kopie vun der Identitéitskaart), gratis schrëftlech Kommunikatioun vun den Donnéeën, déi Iech betreffen, kréien, souwéi, wann néideg, d\'Berichtung vun ongenauen, onvollstännegen oder irrelevanten Donnéeën. Eng Kopie vun Ären Donnéeën gëtt Iech spéitstens 30 Deeg nom Empfang vun Ärer Demande zougestallt. Dir hutt och d\'Recht, d\'Läsche vun Ären Donnéeën unzefroen.' // Luxembourgish
		),
		

);  // $morexlations = array() 

L::addSpecificXlations($morexlations);
                 
?>