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
	
	static function XL($expression, $languageCode = -1, $capitalize = 1) { // translate expression into currently set language 
			if(!array_key_exists($expression, L::$xl))
				die('<br/>'.get_class().'::XL('.$expression.') - this term can not be translated');
				
			// Why this language code setting:
			// Most of the time, we use the default language set at login, which is the surfer language.
			// Once in a while though, an english speaking seller may insert sms templates for a group that is dutch configured.
			// In this last case, one need to specify which language to translate into. 
			//
			$s = '';
			if($languageCode == -1) { // use the language that is set by the class constructor
				if(!isset(L::$xl[$expression][L::$L]))  $languageCode = 0; // defaults to english when the translation is missing.
				else $s = L::$xl[$expression][L::$L];
			}

			else { // use the language forced (e.g.) SMS message merge use the addressee language
				if(!isset(L::$xl[$expression][$languageCode])) $languageCode = 0; // defaults to english when the translation is missing.
				$s = $xl[$expression][$languageCode];
			}

			if($capitalize) {
				$first = mb_strtoupper(mb_substr($s, 0, 1, 'UTF-8'), 'UTF-8');
				$rest  = mb_substr($s, 1, null, 'UTF-8');
				$s = $first.$rest;
			}
			return $s;  // “École”
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

	// L::$xl['technical name'] = array('english', 'french', 'polski', 'dutch', 'german', 'italian', 'spanish', 'portuguese', 'luxembourgish');

    'month01' => array('January',   'janvier',   'styczeń',   'januari',   'Januar',    'gennaio',   'enero',      'janeiro',   'januar'),
    'month02' => array('February',  'février',   'luty',      'februari',  'Februar',   'febbraio',  'febrero',    'fevereiro', 'februar'),
    'month03' => array('March',     'mars',      'marzec',    'maart',     'März',      'marzo',     'marzo',      'março',     'märz'),
    'month04' => array('April',     'avril',     'kwiecień',  'april',     'April',     'aprile',    'abril',      'abril',     'abrëll'),
    'month05' => array('May',       'mai',       'maj',       'mei',       'Mai',       'maggio',    'mayo',       'maio',      'mee'),
    'month06' => array('June',      'juin',      'czerwiec',  'juni',      'Juni',      'giugno',    'junio',      'junho',     'juni'),
    'month07' => array('July',      'juillet',   'lipiec',    'juli',      'Juli',      'luglio',    'julio',      'julho',     'juli'),
    'month08' => array('August',    'août',      'sierpień',  'augustus',  'August',    'agosto',    'agosto',     'agosto',    'august'),
    'month09' => array('September', 'septembre', 'wrzesień',  'september', 'September', 'settembre', 'septiembre', 'setembro',  'september'),
    'month10' => array('October',   'octobre',   'październik','oktober',   'Oktober',   'ottobre',   'octubre',    'outubro',   'oktober'),
    'month11' => array('November',  'novembre',  'listopad',  'november',  'November',  'novembre',  'noviembre',  'novembro',  'november'),
    'month12' => array('December',  'décembre',  'grudzień',  'december',  'Dezember',  'dicembre',  'diciembre',  'dezembro',  'dezember'),

	// L::$xl['technical name'] = array('english', 'french', 'polski', 'dutch', 'german', 'italian', 'spanish', 'portuguese', 'luxembourgish');
	
    'date01' => array('1st',  '1er', '1',  '1ste',  '1.',  '1º',  '1.º',  '1.º',  '1.'),
    'date02' => array('2nd',  '2',   '2',  '2de',   '2.',  '2º',  '2.º',  '2.º',  '2.'),
    'date03' => array('3rd',  '3',   '3',  '3de',   '3.',  '3º',  '3.º',  '3.º',  '3.'),
    'date04' => array('4th',  '4',   '4',  '4de',   '4.',  '4º',  '4.º',  '4.º',  '4.'),
    'date05' => array('5th',  '5',   '5',  '5de',   '5.',  '5º',  '5.º',  '5.º',  '5.'),
    'date06' => array('6th',  '6',   '6',  '6de',   '6.',  '6º',  '6.º',  '6.º',  '6.'),
    'date07' => array('7th',  '7',   '7',  '7de',   '7.',  '7º',  '7.º',  '7.º',  '7.'),
    'date08' => array('8th',  '8',   '8',  '8ste',  '8.',  '8º',  '8.º',  '8.º',  '8.'),
    'date09' => array('9th',  '9',   '9',  '9de',   '9.',  '9º',  '9.º',  '9.º',  '9.'),
    'date10' => array('10th', '10',  '10', '10de',  '10.', '10º', '10.º', '10.º', '10.'),
    'date11' => array('11th', '11',  '11', '11de',  '11.', '11º', '11.º', '11.º', '11.'),
    'date12' => array('12th', '12',  '12', '12de',  '12.', '12º', '12.º', '12.º', '12.'),
    'date13' => array('13th', '13',  '13', '13de',  '13.', '13º', '13.º', '13.º', '13.'),
    'date14' => array('14th', '14',  '14', '14de',  '14.', '14º', '14.º', '14.º', '14.'),
    'date15' => array('15th', '15',  '15', '15de',  '15.', '15º', '15.º', '15.º', '15.'),
    'date16' => array('16th', '16',  '16', '16de',  '16.', '16º', '16.º', '16.º', '16.'),
    'date17' => array('17th', '17',  '17', '17de',  '17.', '17º', '17.º', '17.º', '17.'),
    'date18' => array('18th', '18',  '18', '18de',  '18.', '18º', '18.º', '18.º', '18.'),
    'date19' => array('19th', '19',  '19', '19de',  '19.', '19º', '19.º', '19.º', '19.'),
    'date20' => array('20th', '20',  '20', '20ste', '20.', '20º', '20.º', '20.º', '20.'),
    'date21' => array('21st', '21',  '21', '21ste', '21.', '21º', '21.º', '21.º', '21.'),
    'date22' => array('22nd', '22',  '22', '22de',  '22.', '22º', '22.º', '22.º', '22.'),
    'date23' => array('23rd', '23',  '23', '23de',  '23.', '23º', '23.º', '23.º', '23.'),
    'date24' => array('24th', '24',  '24', '24de',  '24.', '24º', '24.º', '24.º', '24.'),
    'date25' => array('25th', '25',  '25', '25de',  '25.', '25º', '25.º', '25.º', '25.'),
    'date26' => array('26th', '26',  '26', '26de',  '26.', '26º', '26.º', '26.º', '26.'),
    'date27' => array('27th', '27',  '27', '27de',  '27.', '27º', '27.º', '27.º', '27.'),
    'date28' => array('28th', '28',  '28', '28ste', '28.', '28º', '28.º', '28.º', '28.'),
    'date29' => array('29th', '29',  '29', '29de',  '29.', '29º', '29.º', '29.º', '29.'),
    'date30' => array('30th', '30',  '30', '30ste', '30.', '30º', '30.º', '30.º', '30.'),
    'date31' => array('31st', '31',  '31', '31ste', '31.', '31º', '31.º', '31.º', '31.'),


    'add a guideline before printing' => array(
        'add a guideline before printing?', // english
        'ajouter une directive ou une note avant d\'imprimer?', // french
        'Dodaj wskazówkę przed drukowaniem?', // polish
        'een richtlijn toevoegen voordat u afdrukt?', // dutch
        'Richtlinie vor dem Drucken hinzufügen?', // german
        'aggiungere una linea guida prima della stampa?', // italian
        '¿añadir una directriz antes de imprimir?', // spanish
        'adicionar uma diretriz antes de imprimir?', // portuguese
        'eng Richtlinn virum Drécken derbäi setzen?' // luxembourgish
    ),
    'to start printing' => array(
        'to start printing', // english
        'pour imprimer', // french
        'aby rozpocząć drukowanie', // polish
        'om af te drukken', // dutch
        'zum Drucken', // german
        'per avviare la stampa', // italian
        'para comenzar a imprimir', // spanish
        'para iniciar a impressão', // portuguese
        'fir ze drécken' // luxembourgish
    ),

	
    '' => array(
        '',// english
        '',// french
        '',// polish
        '',// dutch
        '',// german
        '',// italian
        '',// spanish
        '',// portuguese
        '' // luxembourgish
    ),
	

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

	// L::$xl['technical name'] = array('english', 'french', 'polski', 'dutch', 'german', 'italian', 'spanish', 'portuguese', 'luxembourgish');
	
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

	// L::$xl['technical name'] = array('english', 'french', 'polski', 'dutch', 'german', 'italian', 'spanish', 'portuguese', 'luxembourgish');
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

	// L::$xl['technical name'] = array('english', 'french', 'polski', 'dutch', 'german', 'italian', 'spanish', 'portuguese', 'luxembourgish');
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

	// L::$xl['technical name'] = array('english', 'french', 'polski', 'dutch', 'german', 'italian', 'spanish', 'portuguese', 'luxembourgish');
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
?>