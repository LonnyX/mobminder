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
    ),
			


			
	// cronofy
	
	'cronofy title' => array(
        'External Calendars connection page',
        'Page de connexion des calendriers externes',
        'Zewnętrzna strona kalendarza',
        'Externe agenda connectie pagina',
        'Externe Kalender-Verbindungsseite',
        'Pagina di connessione dei calendari esterni',
        'Página de conexión de calendarios externos',
        'Página de conexão de calendário externo',
        'Extern Kalennerverbindungsäits' // luxembourgish
    ),

    'cronofy info' => array(
        'On this page, you can associate your Mobminder agenda with a remote agenda account. So it is easy to adapt your planning from a smartphone or a personnal calendar. Our partners are Apple, Microsoft and Google',
        'Sur cette page, vous pouvez associer votre agenda Mobminder à un compte d\'agenda éxistant. Il devient alors facile d\'adapter votre planification à partir d\'un smartphone ou d\'un calendrier personnel. Nos partenaires sont Apple, Microsoft et Google',
        'Na tej stronie można powiązać program Mobminder z kontem zdalnego planu. Łatwo dostosować planowanie do smartfona lub osobistego kalendarza. Naszymi partnerami są Apple, Microsoft i Google',
        'Op deze pagina kunt u uw Mobminder agenda koppelen aan een extern agenda account. Zo is het makkelijk om uw planning van een smartphone of een persoonlijke kalender aan te passen. Onze partners zijn Apple, Microsoft en Google',
        'Auf dieser Seite kannst du deine Mobminder-Agenda mit einem Remote-Agenda-Account verknüpfen. So ist es einfach, Ihre Planung von einem Smartphone oder einem persönlichen Kalender anzupassen. Unsere Partner sind Apple, Microsoft und Google',
        'In questa pagina puoi associare l\'agenda di Mobminder ad un account di agenda remoto. Così è facile adattare la tua pianificazione da uno smartphone o da un calendario personale. I nostri partner sono Apple, Microsoft e Google',
        'En esta página, puede asociar su agenda de Mobminder con una cuenta de agenda remota. Por lo tanto, es fácil adaptar su planificación desde un smartphone o un calendario personal. Nuestros socios son Apple, Microsoft y Google',
        'Nesta página, você pode associar sua agenda Mobminder a uma conta de agenda remota. Portanto, é fácil adaptar seu planejamento a partir de um smartphone ou um calendário pessoal. Nossos parceiros são Apple, Microsoft e Google',
        'Op dëser Säit kënnt Dir Är Mobminder Agenda mat engem externe Agenda Konto verknëppen. Et ass einfach, Är Pläng vu Smartphone oder engem perséinlechen Kalenner unzepassen. Eis Partner sinn Apple, Microsoft an Google'
    ),

    'cronofy login ident' => array(
        'Please verify your indentification data below. If you are not this person, please close this page and log in again from the Mobminder application.',
        'Veuillez vérifier vos données d\'identification ci-dessous. Si vous n\'êtes pas cette personne, fermez cette page et connectez-vous à nouveau à partir de l\'application Mobminder',
        'Sprawdź dane identyfikacyjne poniżej. Jeśli nie jesteś osobą, zamknij tę stronę i zaloguj się ponownie z aplikacji Mobminder',
        'Controleer hieronder uw identificatiegegevens. Als u deze persoon niet bent, sluit aub deze pagina en log opnieuw in vanuit de Mobminder-applicatie',
        'Bitte überprüfen Sie Ihre Identifikationsdaten unten. Wenn Sie nicht diese Person sind, schließen Sie bitte diese Seite und melden Sie sich wieder von der Mobminder-Anwendung an',
        'Verifica i tuoi dati di identificazione qui sotto. Se non sei questa persona, chiudi la pagina e accedi nuovamente dall\'applicazione Mobminder',
        'Verifique sus datos de identificación a continuación. Si no es esta persona, cierre esta página e inicie sesión nuevamente desde la aplicación Mobiminder',
        'Verifique os dados de identificação abaixo. Se você não é essa pessoa, feche esta página e faça login novamente no aplicativo Mobminder',
        'Préift w.e.g. Är Identifikatiounsdaten hei drënner. Wann Dir dës Persoun net sidd, maacht w.e.g. dës Säit zou a loggt Iech erëm aus der Mobminder Applikatioun an.'
    ),

    'cronofy account ident' => array(
        'Please verify the account name. If the account name does not match the one you want to synchronize, please close this page and log on the wished account.',
        'Vérifiez le nom du compte. Si le nom du compte ne correspond pas à celui que vous souhaitez synchroniser, fermez cette page et connectez-vous sur le compte désiré',
        'Sprawdź nazwę konta. Jeśli nazwa konta nie pasuje do tej, którą chcesz synchronizować, zamknij tę stronę i zaloguj się na żądanym koncie',
        'Controleer alstublieft de accountnaam. Als de accountnaam niet overeenkomt met degene die u wilt synchroniseren, sluit dan deze pagina en meld u het gewenste account aan',
        'Bitte überprüfen Sie den Kontonamen. Wenn der Kontoname nicht mit dem übereinstimmt, den Sie synchronisieren möchten, schließen Sie bitte diese Seite und melden Sie sich mit dem gewünschten Konto an',
        'Verifica il nome dell\'account. Se il nome dell\'account non corrisponde a quello che desideri sincronizzare, chiudi la pagina e accedi all\'accordo desiderato',
        'Compruebe el nombre de la cuenta. Si el nombre de la cuenta no coincide con el que desea sincronizar, cierre esta página e inicie sesión en la cuenta deseada',
        'Verifique o nome da conta. Se o nome da conta não coincide com o que deseja sincronizar, feche esta página e faça o login na conta desejada',
        'Préift w.e.g. den Numm vum Kont. Wann den Numm vum Kont net mam entsprécht, wat Dir synchroniséiere wëllt, maacht dës Säit zou a loggt Iech op de gewënschte Kont an.'
    ),

    'cronofy view ident' => array(
        'Please verify the calendars view below. If the calendars listed are not the ones you want to see remotely, please create a specific login having the appropriate view.',
        'Veuillez vérifier la liste des calendriers ci-dessous. Si les calendriers répertoriés ne sont pas ceux que vous voulez voir à distance, créez une connexion spécifique ayant la vue appropriée.',
        'Sprawdź widok kalendarzy poniżej. Jeśli wymienione kalendarze nie są wymienione na liście, należy utworzyć konkretny login z odpowiednim widokiem.',
        'Controleer onderstaande lijst van agenda\'s. Als de opgegeven agenda\'s niet zijn die u op afstand wilt zien, maak dan een specifieke login met de juiste zicht.',
        'Bitte überprüfen Sie die Kalenderansicht unten. Wenn die angegebenen Kalender nicht die sind, die Sie fern sehen möchten, erstellen Sie bitte eine spezielle Anmeldung mit der entsprechenden Ansicht.',
        'Verifica la sotto visualizzazione dei calendari. Se i calendari elencati non sono quelli che si desidera visualizzare in remoto, creare un login specifico con la vista appropriata.',
        'Verifique la vista de los calendarios a continuación. Si los calendarios enumerados no son los que desea ver de forma remota, cree un inicio de sesión específico que tenga la vista adecuada.',
        'Verifique a exibição de calendários abaixo. Se os calendários listados não são os que você deseja ver remotamente, crie um login específico com a visão apropriada.',
        'Préift w.e.g. d\'Kalenner Meenung hei drënner. Wann d\'ugesi Kalender net déi sinn déi Dir wëllt op Distanz gesinn, erstellt w.e.g. e spezifeschen Login mat der entspriechender Vue.'
    ),
	
'cronofy asis ident' => array(
        'Here is the list of already connected remote accounts of yours. You can connect other accounts to your Mobminder login.',
        'Voici la liste des comptes distants déjà connectés. Vous pouvez connecter d\'autres comptes à votre login Mobminder.',
        'Oto lista już podłączonych kont zdalnych. Do logowania Mobminder można podłączyć inne konta.',
        'Hier is de lijst met reeds aangesloten externe accounts van uwe. U kunt andere accounts koppelen aan uw Mobminder login.',
        'Hier ist die Liste der bereits angeschlossenen Fernkonten von Ihnen. Sie können andere Konten mit Ihrem Mobminder-Login verbinden.',
        'Ecco l\'elenco dei tuoi account remoti già connessi. È possibile connettere altri account al tuo login di Mobminder.',
        'Esta es la lista de cuentas remotas ya conectadas. Puede conectar otras cuentas a su inicio de sesión de Mobminder.',
        'Aqui está a lista de contas remotas já conectadas. Você pode conectar outras contas ao login do Mobminder.',
        'Hei ass d\'Lëscht vun Äre scho verbonne Fernkonten. Dir kënnt aner Konten op Äre Mobminder Login verbannen.'
    ),

    'cronofy asis none' => array(
        'You have currently none connection to foreign calendars.',
        'Vous n\'avez actuellement aucune connexion avec les calendriers extérieurs.',
        'Obecnie nie ma połączenia z obcymi kalendarzami.',
        'U heeft momenteel nog geen verbinding met externe kalenders.',
        'Sie haben derzeit keine Verbindung zu fremden Kalendern.',
        'Non hai attualmente alcuna connessione a calendari stranieri.',
        'Actualmente no hay ninguna conexión con calendarios extranjeros.',
        'Você atualmente não possui conexão com agendas estrangeiras.',
        'Dir hutt aktuell keng Verbindung mat auslännesche Kalenneren.' // luxembourgish
    ),

    'cronofy connect' => array(
        'Create a connection',
        'Creer une connexion',
        'Utwórz połączenie',
        'Maak een verbinding',
        'Erstellen Sie eine Verbindung',
        'Crea una connessione',
        'Crear una conexión',
        'Criar uma conexão',
        'Erstellt eng Verbindung' // luxembourgish
    ),

    'cronofy connect warning' => array(
        'The calendars visible in your Mobminder view will be reproduced on your remote account, please confirm.',
        'Les calendriers visibles dans votre vue Mobminder seront reproduits sur votre compte distant, veuillez confirmer.',
        'Kalendarze widoczne w widoku programu Mobminder zostaną odtworzone na Twoim koncie zdalnym, potwierdzić.',
        'De agenda\'s die zichtbaar zijn in uw Mobminder-weergave worden weergegeven op uw externe account, gelieve te bevestigen.',
        'Die Kalender, die in deiner Mobminder-Ansicht sichtbar sind, werden auf deinem Fernkonto wiedergegeben, bitte bestätigen.',
        'I calendari visibili nella tua visualizzazione Mobminder verranno riprodotti sul tuo account remoto, confermano.',
        'Los calendarios visibles en tu vista de Mobminder se reproducirán en tu cuenta remota, confirma.',
        'Os calendários visíveis em sua exibição de Mobminder serão reproduzidos em sua conta remota, por favor, confirme.',
        'D\'Kalenner, déi an Ärer Mobminder Vue siichtbar sinn, ginn op Ärem Fernkonto reproduzéiert, w.e.g. bestätegen.' // luxembourgish
    ),
	
	'cronofy refresh warning' => array(
        'The following account will be refreshed. All appointments will be removed and recreated as visible in Mobminder. This operation takes a few minutes. After confirmation, this page will close and refresh will proceed.',
        'Le compte suivant sera actualisé. Tous les rendez-vous seront supprimés et recréés comme visible dans Mobminder. Cette opération dure quelques minutes. Après la confirmation, cette page se fermera et l\'actualisation se poursuivra.',
        'Następujące konto zostanie odświeżone. Wszystkie spotkania zostaną usunięte i odtworzone w widoczny sposób w programie Mobminder. Ta operacja trwa kilka minut. Po potwierdzeniu ta strona zostanie zamknięta i odświeżona zostanie kontynuowana.',
        'Het volgende account wordt vernieuwd. Alle afspraken worden verwijderd en opnieuw zichtbaar gemaakt in Mobminder. Deze bewerking duurt een paar minuten. Na bevestiging wordt deze pagina afgesloten en wordt vernieuwd doorgegaan..',
        'Das folgende Konto wird aktualisiert. Alle Termine werden in Mobminder entfernt und neu erstellt. Dieser Vorgang dauert einige Minuten. Nach der Bestätigung wird diese Seite geschlossen und aktualisiert werden.',
        'Il seguente account verrà aggiornato. Tutti gli appuntamenti saranno rimossi e ricreati come visibili in Mobminder. Questa operazione richiede alcuni minuti. Dopo la conferma, questa pagina si chiuderà e l\'aggiornamento procederà.',
        'Se actualizará la siguiente cuenta. Todas las citas serán removidas y recreadas como se ve en Mobminder. Esta operación tarda unos minutos. Después de la confirmación, esta página se cerrará y continuará la actualización..',
        'A seguinte conta será atualizada. Todos os compromissos serão removidos e recriados como visíveis no Mobminder. Esta operação demora alguns minutos. Após a confirmação, esta página será fechada e a atualização será prosseguida.',
        'Den nächste Kont gëtt aktualiséiert. All Rendez-vous ginn ewechgeholl a wéi gesi sinn an Mobminder nei erstallt. Dës Operatioun dauert e puer Minutten. No der Bestätegung gëtt dës Säit zougemaach an d\'Aktualiséierung geet weider.'
    ),

    'cronofy revoke warning' => array(
        'The following account will be disconnected from Mobminder. All appointments will be removed on this account. This operation takes a few minutes. After confirmation, this page will close and revoke will proceed.',
        'Le compte suivant sera déconnecté de Mobminder. Tous les rendez-vous seront supprimés sur ce compte. Cette opération dure quelques minutes. Après la confirmation, cette page sera fermée et la révocation procédera..',
        'Następujące konto zostanie odłączone od programu Mobminder. Wszystkie terminy zostaną usunięte z tego konta. Ta operacja trwa kilka minut. Po potwierdzeniu ta strona zostanie zamknięta i zostanie anulowana.',
        'Het volgende account wordt losgemaakt van Mobminder. Alle afspraken worden op dit account verwijderd. Deze bewerking duurt een paar minuten. Na bevestiging zal deze pagina sluiten en herroepen zal doorgaan.',
        'Das folgende Konto wird von Mobminder getrennt. Alle Termine werden auf diesem Konto entfernt. Dieser Vorgang dauert einige Minuten. Nach der Bestätigung wird diese Seite geschlossen und der Widerruf wird fortgesetzt.',
        'Il seguente account verrà scollegato da Mobminder. Tutti gli appuntamenti verranno rimossi in questo account. Questa operazione richiede alcuni minuti. Dopo la conferma, questa pagina si chiuderà e la revoca procederà.',
        'La siguiente cuenta se desconectará de Mobminder. Todas las citas se eliminarán en esta cuenta. Esta operación tarda unos minutos. Después de la confirmación, esta página se cerrará y la revocación continuará.',
        'A seguinte conta será desconectada do Mobminder. Todos os compromissos serão removidos nesta conta. Esta operação demora alguns minutos. Após a confirmação, esta página irá fechar e revogar irá prosseguir.',
        'Den nächste Kont gëtt vum Mobminder getrennt. All Rendez-vous ginn op dësem Kont ewechgeholl. Dës Operatioun dauert e puer Minutten. No der Bestätegung gëtt dës Säit zougemaach an d\'Widderruff gëtt weidergefouert.'
    ),

    'cronofy revoke full' => array(
        'Revoke connection',
        'Rompre la connexion',
        'Cofnij połączenie',
        'Herroep verbinding',
        'Verbindung widerrufen',
        'Revoca connessione',
        'Revocar conexión',
        'Revogar conexão',
        'Verbannung opzehiewen' // luxembourgish
    ),

    'cronofy revoke' => array(
        'Revoke',
        'Rompre',
        'Cofnij',
        'Herroep',
        'Widerrufen',
        'Revoca',
        'Revocar',
        'Revogar',
        'Ophiewen' // luxembourgish
    ),

    'cronofy reinit' => array(
        'Reinitialize',
        'Rafraîchir',
        'Ponownie zainicjować',
        'herinitialiseren',
        'Reinitialisieren',
        'reinizializzare',
        'Reinicializar',
        'Reinicialize',
        'Nei initialiséieren' // luxembourgish
    ),
	
	'confirm refresh' => array(
        'Reinitialize',
        'Rafraîchir',
        'Ponownie zainicjować',
        'herinitialiseren',
        'Reinitialisieren',
        'reinizializzare',
        'Reinicializar',
        'Reinicialize',
        'Nei initialiséieren' // luxembourgish
    ),

    'go previous' => array(
        'Cancel',
        'Annuler',
        'Anuluj',
        'Annuleren',
        'Stornieren',
        'Annulla',
        'Cancelar',
        'Cancelar',
        'Annuléieren' // luxembourgish
    ),
	
'cronofy connecting' => array(
        'We are now connecting Mobminder with your agenda. Please DO NOT CLOSE THIS WINDOW ! The process may take one to two minutes. You will be soon asked to give write persmission to your agenda.',
        'Nous connectons maintenant Mobminder à votre agenda. NE FERMEZ PAS CETTE FENÊTRE! Le processus peut prendre une à deux minutes. Vous serez bientôt invité à donner la permission d\'écriture sur votre agenda.',
        'Łączymy Mobminder z Twoją agendą. Proszę nie zamykaj tego okna! Proces może potrwać od jednej do dwóch minut. Wkrótce zostanie poproszony o nadanie pisanemu przełożeniu na plan zajęć.',
        'We verbinden Mobminder nu met uw agenda. Gelieve dit venster niet te sluiten! Het proces kan één tot twee minuten duren. U wordt daarna gevraagd om toegang te geven aan uw agenda.',
        'Wir verbinden jetzt Mobminder mit deinem Kalender. Bitte schließe das Fenster nicht! Der Vorgang kann ein bis zwei Minuten dauern. Sie werden dann aufgefordert, auf Ihren Kalender zuzugreifen.',
        'Ora contiamo Mobminder al tuo calendario. NON CLOSE THIS WINDOW! Il processo può richiedere da uno a due minuti. Sarai presto invitato a dare il permesso di scrivere sul tuo calendario.',
        'Ahora conectamos Mobminder a tu calendario. ¡NO CIERRE ESTA VENTANA! El proceso puede tomar de uno a dos minutos. Pronto se le pedirá que dé un permiso para escribir en su calendario.',
        'Agora, conecte o Mobminder ao seu calendário. NÃO FIXA ESTA JANELA! O processo pode demorar de um a dois minutos. Em breve, você será solicitado a dar uma permissão para escrever no seu calendário.',
        'Mir verbannen elo Mobminder mat Ärem Kalenner. WEG DÉI FËNNSTER NET zoumaachen! De Prozess ka een bis zwou Minutte daueren. Dir gitt geschwënn gefrot fir Schrëftzougank op Äre Kalenner ze ginn.'
    ),

    'cronofy syncing' => array(
        'Congratulations. The connection process is over and we are now synchronizing your agenda with Mobminder. You can close this window.',
        'Toutes nos félicitations. Le processus de connexion est terminé et nous synchronisons maintenant votre agenda avec Mobminder. Vous pouvez fermer cette fenêtre.',
        'Gratulacje. Proces połączenia się zakończył i synchronizujemy porządek z Mobminder. Możesz zamknąć to okno.',
        'Hartelijk gefeliciteerd. Het verbindingsproces is voorbij en we synchroniseren uw agenda nu met Mobminder. U kunt dit venster sluiten.',
        'Glückwünsche. Der Verbindungsprozess ist vorbei und wir synchronisieren Ihre Agenda mit Mobminder. Sie können dieses Fenster schließen.',
        'Complimenti. Il processo di connessione è finito e stiamo sincronizzando l\'agenda con Mobminder. Puoi chiudere questa finestra.',
        'Felicitaciones. El proceso de conexión ha terminado y ahora estamos sincronizando su agenda con Mobminder. Puedes cerrar esta ventana.',
        'Parabéns. O processo de conexão acabou e agora estamos sincronizando sua agenda com o Mobminder. Você pode fechar esta janela.',
        'Gratulatiounen. De Verbindungsprozess ass eriwwer an mir synchroniséieren elo Är Agenda mat Mobminder. Dir kënnt dës Fënster zoumaachen.'
    ),

    'cronofy revoked' => array(
        'The profile has been successfully disconnected from Mobminder. All calendars in your profile are now empty. You can remove the calendars from your account.',
        'Le profil a été déconnecté avec succès de Mobminder. Tous les calendriers de votre profil sont maintenant vides. Vous pouvez supprimer les calendriers de votre compte.',
        'Profil został pomyślnie odłączony od programu Mobminder. Wszystkie kalendarze w Twoim profilu są puste. Możesz usunąć kalendarze z konta.',
        'Het profiel is succesvol uitgeschakeld van Mobminder. Alle agenda\'s in uw profiel zijn nu leeg. U kunt de agenda\'s van uw account verwijderen.',
        'Das Profil wurde erfolgreich von Mobminder getrennt. Alle Kalender in deinem Profil sind jetzt leer. Sie können die Kalender aus Ihrem Konto entfernen.',
        'Il profilo è stato disconnesso con successo da Mobminder. Tutti i calendari nel tuo profilo sono ormai vuoti. È possibile rimuovere i calendari dal tuo account.',
        'El perfil se ha desconectado correctamente de Mobminder. Todos los calendarios de tu perfil están vacíos. Puede eliminar los calendarios de su cuenta.',
        'O perfil foi desconectado com sucesso do Mobminder. Todos os calendários do seu perfil estão vazios. Você pode remover os calendários da sua conta.',
        'De Profil gouf erfollegräich vum Mobminder getrennt. All Kalenner an Ärem Profil sinn elo eidel. Dir kënnt d\'Kalenner aus Ärem Kont läschen.'
    ),
							
							
// C_control_message / C_control_commPlan


	/* this bunch is duplicated in .js 
	'sms_nosms' => array('No SMS', 'Pas de SMS', 'Brak SMS-ów', 'Geen SMS', 'Kein SMS', 'Nessun SMS', 'Sin SMS', 'Sem SMS', 'Keng SMS'),
    'sms_created' => array('Ready', 'Préparé', 'Gotowy', 'Voorbereden', 'Bereit', 'Pronto', 'Listo', 'Pronto', 'Bereet'),
    'sms_retry' => array('Ready', 'Préparé', 'Gotowy', 'Voorbereden', 'Bereit', 'Pronto', 'Listo', 'Pronto', 'Bereet'),
    'sms_handled' => array('Handed over', 'Transmis', 'Przekazany', 'Uitgezonden', 'Übergeben', 'Consegnato', 'Entregado', 'Entregue', 'Iwwerreecht'),
    'sms_pending' => array('Pending', 'En attente', 'Oczekujący', 'Hangt', 'Ausstehend', 'In attesa', 'Pendiente', 'Pendente', 'Anhangend'),
    'sms_delivered' => array('Delivered', 'Délivré', 'Dostarczony', 'Afgeleverd', 'Zugestellt', 'Consegnato', 'Entregado', 'Entregue', 'Zougestallt'),
    'sms_discarded' => array('Discarded', 'Détruit', 'Usunięty', 'Gescrapt', 'Verworfen', 'Scartato', 'Descartado', 'Descartado', 'Ewechgehäit'),
    'sms_retained' => array('Retained', 'Retenu', 'Zachowany', 'Gehouden', 'Behalten', 'Trattenuto', 'Retenido', 'Retido', 'Gehalen'),
    'sms_iso' => array('iso-recipient', 'iso-recipient', 'iso-recipient', 'eigen bestemming', 'ISO-Empfänger', 'destinatario iso', 'destinatario iso', 'destinatário iso', 'iso-Recipient'),
    'sms_nofeedback' => array('No feedback', 'Sans statut', 'Nie opinie', 'Geen feedback', 'Kein Feedback', 'Nessun feedback', 'Sin retroalimentación', 'Sem feedback', 'Keen Feedback'),
    'sms_notsent' => array('Not sent', 'Pas envoyé', 'Nie są przesyłane', 'Niet verzonden', 'Nicht gesendet', 'Non inviato', 'No enviado', 'Não enviado', 'Net geschéckt'),
*/
/*
    'indicates' => array('Indicating', 'Indiquant', 'Wskazujący', 'Vermeldt', 'Zeigend', 'Indicando', 'Indicando', 'Indicando', 'Unzeeigend'),
    'before scheduled' => array('before scheduled time', 'd\'avance sur le timing', 'wcześniej niż w harmonogramie', 'voorhang op timing', 'vor der geplanten Zeit', 'prima del tempo programmato', 'antes del tiempo programado', 'antes do tempo programado', 'virum geplangten Zäitpunkt'),

    'e-resa-token-mail title' => array('Your code for online booking', 'Votre code pour la réservation en ligne', 'Twój kod do rezerwacji online', 'Uw code voor de online reservatie', 'Ihr Code für die Online-Buchung', 'Il tuo codice per la prenotazione online', 'Su código para la reserva en línea', 'Seu código para a reserva online', 'Äre Code fir online Reservatioun'),
    'mail sent at' => array('This mail was sent at', 'Cet email a été envoyé à', 'Ten e-mail został wysłany do', 'Deze email werd gestuurd om', 'Diese E-Mail wurde gesendet um', 'Questa email è stata inviata a', 'Este correo fue enviado a', 'Este e-mail foi enviado às', 'Dës Mail gouf geschéckt un'),
    'your code is' => array('Your code is', 'Votre code est', 'Kod jest', 'Uw code is', 'Ihr Code ist', 'Il codice è', 'Su código es', 'Seu código é', 'Äre Code ass'),
    'greetings' => array('Regards', 'Cordialement', 'Powitać', 'Groeten', 'Mit freundlichen Grüßen', 'Cordiali saluti', 'Saludos', 'Cumprimentos', 'Mat Frëndlechkeeten'),

    'goodbye' => array('goodbye', 'au revoir', 'do widzenia', 'tot ziens', 'Auf Wiedersehen', 'addio', 'adiós', 'Tchau', 'Äddi'),
*/
	
	// translations for email sent on incoming inbound SMS from smsgateaway
		
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
		
		
		
		// e-resa temporary page message (is obsolete like e-resa.php in the webapp baseline)
	'e-resa redir message' => array(
        'The link to [LINK] is no longer valid, if you have saved it in as a favorite link, please replace it with the following link',
        'Le lien vers [LINK] n’est plus valide, si vous l’avez enregistré dans un favori, SVP remplacez-le maintenant par le lien suivant',
        'Link do [LINK] nie jest już aktualny, jeśli zapisałeś go w ulubionych, zastąp go teraz załączonym linkiem',
        'De link naar [LINK] is niet langer geldig. Als u deze als favoriete link heeft opgeslagen, vervang deze dan nu door de volgende link',
        'Der Link zu [LINK] ist nicht mehr gültig. Wenn Sie ihn als Favoritenlink gespeichert haben, ersetzen Sie ihn bitte jetzt durch den folgenden Link',
        'Il link a [LINK] non è più valido, se lo avevi salvato come link preferito sostituiscilo ora con il seguente link',
        'El enlace a [LINK] ya no es válido, si lo guardaste como enlace favorito reemplázalo ahora por el siguiente enlace',
        'O link para [LINK] não é mais válido, se você o salvou como link favorito, substitua-o agora pelo link a segui',
        'Den Link op [LINK] ass net méi valabel, wann Dir en als Favorit gespäichert hutt, ersat en elo duerch de folgende Link'
    ),

    // unsubscribe
    'u-info' => array(
        'From this page, you can opt-out for e-mail communication',
        'De cette page, vous pouvez choisir de ne pas recevoir des communications par e-mail',
        'Na tej stronie możesz zrezygnować z komunikacji e-mailowej',
        'Van deze pagina kunt u zich afmelden voor e-mailcommunicatie',
        'Von dieser Seite können Sie sich von E-Mail-Kommunikation abmelden',
        'Da questa pagina puoi rinunciare alla comunicazione via e-mail',
        'Desde esta página, puede optar por no recibir comunicaciones por correo electrónico',
        'Nesta página, você pode optar por não receber comunicações por e-mail',
        'Vun dëser Säit kënnt Dir Iech vun der E-Mail-Kommunikatioun ofmellen'
    )

	
	
	); 
}                    
?>