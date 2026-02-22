<?php


define('language_code_english', 0); // associated value is the column position in the $xl array -> it has to start with 0 and increment by 1
define('language_code_french', 1);
define('language_code_polish', 2);
define('language_code_dutch', 3);
define('language_code_german', 4);	
define('language_code_italian', 5);	
define('language_code_spanish', 6);
define('language_code_protuguese', 7);
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


function reduceDiacriticsUTF8($name) { 
	
	$name = strtolower($name);
	$many = strpos($name, ' '); // that is a firstname containing law names like Marie Antoine Henriette
	$guesson = $name;
	if($many) $guesson = substr($name,0,$many); // then check on the first bunch
	
	$reduced = str_replace('é','e',$guesson);
	$reduced = str_replace('è','e',$reduced);
	$reduced = str_replace('ê','e',$reduced);
	$reduced = str_replace('ë','e',$reduced);
	$reduced = str_replace('ï','i',$reduced);
	$reduced = str_replace('î','i',$reduced);
	$reduced = str_replace('ö','o',$reduced);
	$reduced = str_replace('ô','o',$reduced);
	$reduced = str_replace('ç','c',$reduced);
	$reduced = str_replace('-','',$reduced);
	
	//.... all the rest
    return preg_replace('/[^a-z0-9]/','', $reduced); // final clean up
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
												language_code_protuguese => 'portuguese'
											);
	public static $languageAbrevs = array( 	language_code_english => 'en', 
												language_code_french => 'fr', 
												language_code_polish => 'pl', 
												language_code_dutch => 'nl', 
												language_code_german => 'de', 
												language_code_italian => 'it', 
												language_code_spanish => 'es', 
												language_code_protuguese => 'pt'
											);
											
	public static function getLanguageFromCode($lcode) { 
		if(isset(self::$languageNames[$lcode]))
			return self::$languageNames[$lcode]; 
		else return 'wrong language code';
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
		
		// let's define here vacabulary that depends on visitor alias

		switch(L::$V) {
			case visitorAlias_patient:
				L::$xl['new visitor'] 		= Array( 'New patient', 			'Nouveau patient', 		'Nowy pacjent', 			'Nieuwe patiënt'		);
				L::$xl['visitor'] 			= Array( 'patient', 				'patient', 				'pacjent', 					'patiënt'				);
				L::$xl['no visitor'] 		= Array( 'no patient', 				'aucun patient', 		'żaden pacjent', 			'geen patiënt'			);
				L::$xl['no other visitor'] 	= Array( 'no other patient',		'pas d\'autre patient', 'żaden inny pacjent', 		'geen andere patiënt'	);
				L::$xl['visitors'] 			= Array( 'Patients',				'Patients',				'Pacjentów',				'Patiënten' 			);
				L::$xl['many visitors'] 	= Array( 'Several patients', 		'Plusieurs patients', 	'Kilku pacjentów',			'Meerdere patiënten'	);
				L::$xl['visitor name'] 		= Array( 'Patient name', 			'Nom du patient', 		'Imię i nazwisko pacjenta', 'Patiënt naam'			);
				L::$xl['visitor note'] 		= Array( 'Patient note', 			'Note patient', 		'Uwaga pacjenta', 			'Patiënt nota'			);
				L::$xl['visitor birth'] 	= Array( 'Patient date of birth', 	'Naissance patient', 	'Data urodzenia pacjenta', 	'Patiënt geboortedatum'	);
				L::$xl['visitor info'] 		= Array( 'Patient Information',		'Information Patient',	'Dane pacjenta',			'Patiënt gegevens'		);
				L::$xl['visitors register'] = Array( 'Patients Registry',		'Registre des patients','Rejestru pacjenta',		'Patiëntenregister'		);
				L::$xl['copy from visitor'] = Array( 'Copy from another patient','Copier depuis un autre patient','Skopiować z innego pacjenta',	'Kopiëren van een andere patiënt'	);
				break;
			case visitorAlias_client:
				L::$xl['new visitor'] 		= Array( 'New Client', 				'Nouveau Client', 		'Nowy Klient', 				'Nieuwe klant'			);
				L::$xl['visitor'] 			= Array( 'client',					'client',				'klient', 					'klant'					);
				L::$xl['no visitor'] 		= Array( 'no client', 				'aucun client', 		'żaden klient', 			'geen klant'			);
				L::$xl['no other visitor'] 	= Array( 'no other client', 		'pas d\'autre client', 	'żaden inny klient', 		'geen andere klant'		);
				L::$xl['visitors'] 			= Array( 'Clients',					'Clients',				'Klienci',					'Klanten' 				);
				L::$xl['many visitors'] 	= Array( 'Several clients', 		'Plusieurs clients', 	'Kilku klientów', 			'Meerdere klanten'		);
				L::$xl['visitor name'] 		= Array( 'Client name', 			'Nom du client', 		'Nazwa klienta',			'Klant naam'			);
				L::$xl['visitor note'] 		= Array( 'Client note',				'Note client',			'Uwaga klienta', 			'Klant nota'			);
				L::$xl['visitor birth'] 	= Array( 'Client date of birth',	'Naissance client', 	'Data urodzenia klienta', 	'Klant geboortedatum'	);
				L::$xl['visitor info'] 		= Array( 'Client Information',		'Information Client',	'Dane klienta',				'Klant gegevens'		);
				L::$xl['visitors register'] = Array( 'Clients Registry',		'Registre clients',		'Rejestru klientów',		'Klantenregister'		);
				L::$xl['copy from visitor'] = Array( 'Copy from another client','Copier depuis un autre client','Skopiować z innego klienta',	'Kopiëren van een andere klant'	);
				break;
			case visitorAlias_participant:
				L::$xl['new visitor'] 		= Array( 'New participant', 			'Nouveau participant',		'Nowy uczestnik', 			'Nieuwe deelnemer'		);
				L::$xl['visitor'] 			= Array( 'participant',					'participant',				'uczestnik', 				'deelnemer'				);
				L::$xl['no visitor'] 		= Array( 'no participant', 				'aucun participant', 		'żaden uczestnik', 			'geen deelnemer'		);
				L::$xl['no other visitor'] 	= Array( 'no other participant', 		'pas d\'autre participant', 'żaden inny uczestnik', 	'geen andere deelnemer'	);
				L::$xl['visitors'] 			= Array( 'Participants',				'Participants',				'Uczestnicy',				'Deelnemers' 			);
				L::$xl['many visitors'] 	= Array( 'Several participants',		'Plusieurs participants', 	'Kilku uczestników', 		'Meerdere deelnemers'	);
				L::$xl['visitor name'] 		= Array( 'Participant\'s name', 		'Nom du participant', 		'Nazwa Uczestnik', 			'Deelnemer naam'		);
				L::$xl['visitor note'] 		= Array( 'Participant note',			'Note participant',			'Uwaga uczestnik',			'Deelnemer nota'		);
				L::$xl['visitor birth'] 	= Array( 'Participant date of birth', 	'Naissance participant', 	'Uczestnik urodzenie', 		'Deelnemer geboortedatum');
				L::$xl['visitor info'] 		= Array( 'Participant Information',		'Information Participant',	'Informacje uczestnika',	'Deelnemer gegevens'	);
				L::$xl['visitors register'] = Array( 'Participants Registry',		'Registre participants',	'Rejestru uczestników',		'Deelnemersregister'	);
				L::$xl['copy from visitor'] = Array( 'Copy from another participant','Copier depuis un autre participant','Skopiować z innego uczestnika',	'Kopiëren van een andere deelnemer'	);
				break;
		}		
		
	}
	
	private static $xl = array(  // cross language table
 
// generic translations:


	'new visitor' 		=> Array( 'New attendee', 				'Nouveau convié', 				'Nowy uczestnik', 				'Nieuwe genodigde'					),
	'visitor' 			=> Array( 'attendee', 					'convié', 						'uczestnik', 					'genodigde'							),
	'no visitor' 		=> Array( 'no attendee', 				'aucun convié', 				'żaden uczestnik', 				'geen genodigde'					),
	'no other visitor' 	=> Array( 'no other attendee',			'pas d\'autre convié', 			'żaden inny uczestnik', 		'geen andere genodigde'				),
	'visitors' 			=> Array( 'visitors',					'visitors',						'uczestnik',					'genodigden' 						),
	'many visitors' 	=> Array( 'Several visitors', 			'Plusieurs visitors', 			'Kilku pacjentów',				'Meerdere genodigde'				),
	'visitor name' 		=> Array( 'attendee name', 				'Nom du convié', 				'Imię i nazwisko uczestnik', 	'genodigde naam'					),
	'visitor note' 		=> Array( 'attendee note', 				'Note convié', 					'Uwaga uczestnik', 				'genodigde nota'					),
	'visitor birth' 	=> Array( 'attendee date of birth', 	'Naissance convié', 			'Data urodzenia uczestnik', 	'genodigde geboortedatum'			),
	'visitor info' 		=> Array( 'attendee Information',		'Information convié',			'Dane uczestnik',				'genodigde gegevens'				),
	'visitors register' => Array( 'attendees Registry',			'Registre des conviés',			'Rejestru uczestnik',			'genodigdenregister'				),
	'copy from visitor' => Array( 'Copy from another attendee',	'Copier depuis un autre convié','Skopiować z innego uczestnik',	'Kopiëren van een andere genodigde'	),


// Application object classes as they are perceived by the surfer
	'owner'			=> array('Manager',			'Responsable',			'Kierownik',				'Verantwoordelijk'	), 
	'visitor'		=> array('visitor',			'visiteur',				'klient',					'bezoeker'			), 
	'many visitors'	=> array('many visitors',	'plusieurs visiteur',	'więcej odwiedzających',	'meerdere bezoeker'	),
	'operator'		=> array('Operator',		'Gestionnaire',			'Kierownik',				'Beheerder'			),

	'workplace'	=> array('Workplace',	'Poste de travail',	'Stanowisko',	'Werkplaats'	), // class_bCal
	'resource'	=> array('Collaborator',	'Collaborateur',	'Pracownik',	'Medewerker '	), // class_uCal
	'visitors file'	=> array('Visitors file',	'Liste de visiteurs',	'Lista klientów',	'Bezoekers lijst'	), // direct marketing
	'new scratch'	=> array('New from scratch',	'Nouveau par défaut',	'Nowych od podstaw',	'Nieuw vanaf nul'	), // plus list
	'copy of'		=> array('Copy of ',	'Copie de ',	'Kopię',	'Kopie van '	), // plus list

// access login vocabulary - C_accessLogDisplay
	'data id'	=> array('Data id',	'Identifiant',	'Identyfikator',	'Identificatie'	), 
	'created'	=> array('Created',	'Créé',	'Wpis',	'Invoering'	), 
	'changed'	=> array('Updated',	'Modifié',	'Zmiana',	'Aangepast'	),
	'creator'	=> array('Created by',	'Créé par',	'Autor wpisu',	'door'	), 
	'changer'	=> array('Changed by',	'Modifié par',	'Autor zmiany wpisu',	'door'	),
	
// basic vocabulary
	'yes'			=> array('Yes',		'Oui',		'Tak',		'Ja'	),
	'no'			=> array('No',		'Non',		'Nie',		'Nee'	),
	'none'			=> array('None',	'Aucun',	'żaden',	'Geen'	),
	'back'			=> array('Back',	'Retour',	'Wróć',		'Terug'	),
	'properties'	=> array('Properties',	'Propriétés',		'Ustawienia',	'Eigenaardigheden'	),
	'default'		=> array('By default',	'Par défaut',		'Zaocznie',		'Bij verstek'	),
	'color'			=> array('Color',		'Couleur',			'Kolor',		'Kleur'	),
	'pattern'		=> array('Pattern',		'Motif',			'Wzór',			'Patroon'	),
	'sample'		=> array('Sample',		'Example',			'Przykład',		'Voorbeeld'	),

// calendar related

	'on date'	=> array('on',		'le',		''	,		'op'		),
	'from'		=> array('from',	'de',		'od',		'van'		),
	'to'		=> array('to',		'à',		'do',		'tot'		),
	'for'		=> array('for',		'pour',		'dla',		'voor'		),
	'month'		=> array('month',	'mois',		'miesiąc',	'maand'		),
	'months'	=> array('months',	'mois',		'miesiąc',	'maanden'	),
	'day'		=> array('day',		'jour',		'dzień',	'dag'		),
	'days'		=> array('days',	'jours',	'dzień',	'dagen'		),
	
	'workday'	=> array('workday',	'travail',	'dzień roboczy',	'werkdag'	),
	
// used to merge SMS and email messages :

	'weekday1'	=> array('monday',		'lundi',		'poniedziałek',	'maandag',		'Montag',		'Lunedì',		'lunes',		'segunda-feira'	),
	'weekday2'	=> array('tuesday',		'mardi',		'wtorek',		'dinsdag',		'Dienstag',		'Martedì',		'martes',		'terça-feira'	),
	'weekday3'	=> array('wednesday',	'mercredi',		'środa',		'woensdag',		'Mittwoch',		'Mercoledì',	'miércoles',	'quarta-feira'	),
	'weekday4'	=> array('thursday',	'jeudi',		'czwartek',		'donderdag',	'Donnerstag',	'Giovedì',		'jueves',		'quinta-feira'	),
	'weekday5'	=> array('friday',		'vendredi',		'piątek',		'vrijdag',		'Freitag',		'Venerdì',		'viernes',		'sexta-feira'	),
	'weekday6'	=> array('saturday',	'samedi',		'sobota',		'zaterdag',		'Samstag',		'Sabato',		'sábado',		'sábado'		),
	'weekday7'	=> array('sunday',		'dimanche',		'niedziela',	'zondag',		'Sonntag',		'Domenica',		'domingo',		'domingo'		),
	
	'week'		=> array('Week',		'Semaine',	'Tydzień',	'Week'	),
	
	'dear female'	=> array('Dear',	'Chère',		'Szanowny',		'Beste',		'Geehrte',		'Cara',			'Querida',		'Cara'		),
	'dear male'		=> array('Dear',	'Cher',			'Szanowny',		'Beste',		'Geehrter',		'Caro',			'Muy',			'Caro'		),

	'male'			=> array('Mr',		'M.',			'Pan',			'Mr',			'Herr',			'Sr',			'Señor',		'Sr.'		),
	'female'		=> array('Mrs',		'Mme',			'Pani',			'Mvr',			'Frau',			'Mrs',			'Señora',		'Sra.'		),
	'sa'			=> array('AS',		'SA',			'SA',			'NV',			'AG',			'SA',			'SA',			'SA'		),
	'sprl'			=> array('Ltd',		'Sprl',			'Sp. z o.o.',	'Bvba',			'Pgbh',			'Ltd',			'Ltd',			'SARL'		),
	'miss'			=> array('Miss',	'Mlle',			'Tęsknić',		'Juffr',		'Ms',			'Sr',			'Señorita',		'Menina'	),
	'boy'			=> array('Boy',		'Garçon',		'Chłopak',		'Jhr',			'Junge',		'Giovanotto',	'Niño',			'Rapaz'		),
	'girl'			=> array('Girl',	'Fille',		'Córka',		'Dchtr',		'Mädchen',		'Ragazza',		'Niña',			'Rapariga'	),
	
	
	'left conversation'	=> array('has left this conversation',
								'a quitté la conversation',		
								'opuścił rozmowę',		
								'heeft het gesprek verlaten',		
								'hat die Unterhaltung verlassen',		
								'ha lasciato la conversazione',		
								'Ha abandonado la conversación',			
								'deixou a conversa'	),
	
	'deleted conversation'	=> array('deleted this conversation',
								'a supprimé la conversation',		
								'usunął rozmowę',		
								'heeft het gesprek verwijderd',		
								'hat das Gespräch gelöscht',		
								'cancellato la conversazione',		
								'eliminado la conversación',			
								'apagou a conversa'	),
	
	'archived conversation'	=> array('archived this conversation',
								'a archivé la conversation',		
								'zarchiwizował tę rozmowę',		
								'heeft dit gesprek gearchiveerd',		
								'hat dieses Gespräch archiviert',		
								'archiviato questa conversazione',		
								'archivó esta conversación',			
								'arquivou esta conversa'	),
	
	'unarchived conversation'	=> array('has reactivated the conversation',
								'a réactivé la conversation',		
								'reaktywował rozmowę',		
								'heeft het gesprek opnieuw geactiveerd',		
								'reaktivierte das Gespräch',		
								'ha riattivato la conversazione',		
								'reactivó la conversación',			
								'reativou a conversa'	),
	
	
// navigation
	'previous'	=> array('Previous',	'Précédant',	'Poprzedni',	'Vorige'	),
	'next'	=> array('Next',	'Suivant',	'Następny',	'Volgende'	),
	'see'	=> array('see',	'voir',	'pokaż',	'zien'	),
	'edit'	=> array('edit',	'éditer',	'zmień',	'Aanpassen'	),
	
	'add'	=> array('Add',	'Ajouter',	'Dodaj',	'Toevoegen'	),
	
	'delete'	=> array('Delete'					,'Supprimer'					,'Skasuj'		,'Verwijder'	),
	'validate'	=> array('Save'						,'Enregistrer'					,'Potwierdź'	,'Bevestig'	),
	'close'		=> array('Close and cancel changes'	,'Quitter sans rien enregistrer','Zamknij'		,'Sluiten'	),
	
	'choose'	=> array('Choose',	'Choisir',	'Wybierz',	'Kiesen'	),
	'info'	=> array('Info',	'Info',	'Informacje',	'Info'	),
	'open'	=> array('Open',	'Ouvert',	'Otwarte',	'Open'	),
	'setup'	=> array('Setup',	'Réglage',	'Ustawienia',	'Regeling'	),

// miscellaneous
	'and'			=> array('and',	'et',	'i',	'en'	),
	'with'			=> array('with',	'avec',	'z',	'met'	),
	'in room'		=> array('in room',	'dans la salle',	'w pomieszczeniu',	'in zaal'	),
	'coordinates'	=> array('Coordinates',	'Coordonnées',	'Dane kontaktowe',	'Coördinaten'	),
	'visitors'		=> array('Visitors',	'Visiteurs',	'Odwiedzający',	'Bezoekers'	),


	'lastname'	=> array('Last name',	'Nom',	'Nazwisko',	'Naam'	),
	'firstname'	=> array('First name',	'Prénom',	'Imię',	'Voornaam'	),
	'language'	=> array('Language',	'Langue',	'Język',	'Taal'	),
	
	'informations'	=> array('Informations',	'Informations',	'Informacje',	'Gegevens'	),

	'gender'		=> array('Gender',	'Genre',	'Godność/forma prawna',			'Geslacht'	),
	
	
	'fromdate'		=> array('from',	'du',		'od',			'vanaf'		),
	'todate'		=> array('to',		'au',		'do',			'tot'		),
	'at'			=> array('at',		'à',		'o',			'om'		),
	'to'			=> array('to',		'à',		'do',			'tot'		),
	'mobile'		=> array('Mobile number',	'Portable',			'Komórkowy',	'GSM'	),
	'registration'	=> array('Registration',	'Matricule',	'Znaczek',	'Register'	),
	'access level'	=> array('Access level',	'Niveau d\'accès',	'Poziom dostępu',	'Toegangsniveau'	),
	
	
	'birthday'		=> array('Birthday',	'Anniversaire',	'Data urodzenia',	'Verjaardag'	),
	'address'		=> array('Address',	'Adresse',	'Adres',	'Adres'	),
	'zip'			=> array('Zip code',	'Code postal',	'Kod pocztowy',	'Postcode'	),
	'city'			=> array('City',	'Ville',	'Miejscowość',	'Stad'	),
	'country'		=> array('Country',	'Pays',	'Województwo',	'Land'	),
	'email'			=> array('E-mail',	'E-mail',	'E-mail',	'E-mail'	),
	'phone'			=> array('Phone number',	'Téléphone',	'Telefon',	'Telefoon'	),
	'note'			=> array('Note',	'Note',	'Uwagi',	'Nota'	),
	'no appointment'=> array('No appointment',	'Pas de rdv',	'Brak wizyt',	'Geen afspraak'	),
	'appointments'	=> array('Appointments',	'Rendez-vous',	'Nominacje',	'Afspraken'	),
	'prev apps'		=> array('Previous',	'Passés',	'Poprzednie wizyty',	'Verleden'	),
	'next apps'		=> array('Planned',	'Planifiés',	'Zaplanowane wizyty',	'Toekomstige'	),
	'visitor attributes' => array('Qualifications',	'Qualifications',	'Kwalifikacji',	'Kwalificaties'	),
	'apps overview'	=> array('Appointments overview',	'Rendez-vous',	'Wizyty',	'Afspraken overzicht'	),
	
// C_control_group
	 
	'owner form'	=> array('Owner form',	'Fiche exploitant',	'Formularz właściciel',	'Eigenaar formulier'	),

// C_control_duration

	'duration'	=> array('Duration',	'Durée',	'Jak długo',	'Duurtijd'	),
	'longer'	=> array('Longer',		'Plus long', 	'już',		'Langer'	),

	
// reminders
	'reminders'	=> array('Reminders',	'Rappels',	'Przypomnienia',	'Herinneringen'	),

// e-reservation
	'e-reservation' 	=> array(	'Make an appointment - Online booking', 
									'Prendre rendez-vous - Réservation en ligne',
									'Umów się na wizytę - Online rezerwacja',
									'Maak een afspraak - Online reserveren',
									'',
									'Prendere un appuntamento - Prenotazione online',
									'',									
									'Marcar uma consulta - Reservas online'		),
	
	'book now'		=> array('Make an appointment',		'Prendre rendez-vous',		'Umów się na wizytę',	'Maak een afspraak', 		'', 'Prendere un appuntamento', 		'', 'Marcar uma consulta'	),
	'cancel resa'	=> array('Cancel an appointment',	'Annuler un rendez-vous',	'Anuluj spotkanie',	 	'Een afspraak afzeggen', 	'', 'Annullamento di un appuntamento', 	'', 'Cancelar um compromisso'	),


	'powered by'	=> array(	'Powered by',	
	'Propulsé par',		
	'Powered by',		
	'Powered by',
	'Powered by',
	'Powered by',
	'Powered by',
	'Alimentado por.'
	),

	'powered by title'	=> array(	'Visit Mobminder',	
	'Visitez Mobminder',		
	'Odwiedź Mobminder',		
	'Surf naar Mobminder',
	'Visit Mobminder',
	'Visita Mobminder',
	'Visit Mobminder',
	'Visita Mobminder'
	),

	'powered by tail'	=> array(	'Agenda and SMS/Email reminder',	
	'Agenda et Rappel de Rendez-vous par SMS et Email',		
	'Kalendarz i przypomnienia o spotkaniu przez e-mail i SMS',		
	'Agenda en herinnering van afspraken per email en SMS',
	'Agenda and SMS/Email reminder',
	'Calendario e promemoria di appuntamento SMS ed e-mail',
	'Agenda and SMS/Email reminder',
	'Calendário e Lembrete da nomeação do SMS e e-mail'
	),

							
	'copyright'	=> array(	'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium',	// 0 - english
							'© 2006-2020 Mobminder est une marque de Cloud-Tech SRL Belgique',	// 1 - french
							'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium',	// 2 - polski
							'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium',	// 3 - dutch
							'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium',	// 4 - german
							'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium',	// 5 - italian
							'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium',	// 6 - spanish
							'© 2006-2020 Mobminder is a trademark of Cloud-Tech Belgium'	// 7 - portugese
							),
							
							
	// cronofy
	
	'cronofy title'	=> array(	'External Calendars connection page',	// 0 - english
							'Page de connexion des calendriers externes',	// 1 - french
							'Zewnętrzna strona kalendarza',	// 2 - polski
							'Externe agenda connectie pagina',	// 3 - dutch
							'Externe Kalender-Verbindungsseite',	// 4 - german
							'Pagina di connessione dei calendari esterni',	// 5 - italian
							'Página de conexión de calendarios externos',	// 6 - spanish
							'Página de conexão de calendário externo'	// 7 - portugese
							),
	
	'cronofy info'	=> array('On this page, you can associate your Mobminder agenda with a remote agenda account. So it is easy to adapt your planning from a smartphone or a personnal calendar. Our partners are Apple, Microsoft and Google',	// 0 - english
							'Sur cette page, vous pouvez associer votre agenda Mobminder à un compte d\'agenda éxistant. Il devient alors facile d\'adapter votre planification à partir d\'un smartphone ou d\'un calendrier personnel. Nos partenaires sont Apple, Microsoft et Google',	// 1 - french
							'Na tej stronie można powiązać program Mobminder z kontem zdalnego planu. Łatwo dostosować planowanie do smartfona lub osobistego kalendarza. Naszymi partnerami są Apple, Microsoft i Google',	// 2 - polski
							'Op deze pagina kunt u uw Mobminder agenda koppelen aan een extern agenda account. Zo is het makkelijk om uw planning van een smartphone of een persoonlijke kalender aan te passen. Onze partners zijn Apple, Microsoft en Google',	// 3 - dutch
							'Auf dieser Seite kannst du deine Mobminder-Agenda mit einem Remote-Agenda-Account verknüpfen. So ist es einfach, Ihre Planung von einem Smartphone oder einem persönlichen Kalender anzupassen. Unsere Partner sind Apple, Microsoft und Google',	// 4 - german
							'In questa pagina puoi associare l\'agenda di Mobminder ad un account di agenda remoto. Così è facile adattare la tua pianificazione da uno smartphone o da un calendario personale. I nostri partner sono Apple, Microsoft e Google',	// 5 - italian
							'En esta página, puede asociar su agenda de Mobminder con una cuenta de agenda remota. Por lo tanto, es fácil adaptar su planificación desde un smartphone o un calendario personal. Nuestros socios son Apple, Microsoft y Google',	// 6 - spanish
							'Nesta página, você pode associar sua agenda Mobminder a uma conta de agenda remota. Portanto, é fácil adaptar seu planejamento a partir de um smartphone ou um calendário pessoal. Nossos parceiros são Apple, Microsoft e Google'	// 7 - portugese
							),
	
	
	'cronofy login ident'	=> array('Please verify your indentification data below. If you are not this person, please close this page and log in again from the Mobminder application.',	// 0 - english
							'Veuillez vérifier vos données d\'identification ci-dessous. Si vous n\'êtes pas cette personne, fermez cette page et connectez-vous à nouveau à partir de l\'application Mobminder',	// 1 - french
							'Sprawdź dane identyfikacyjne poniżej. Jeśli nie jesteś osobą, zamknij tę stronę i zaloguj się ponownie z aplikacji Mobminder',	// 2 - polski
							'Controleer hieronder uw identificatiegegevens. Als u deze persoon niet bent, sluit aub deze pagina en log opnieuw in vanuit de Mobminder-applicatie',	// 3 - dutch
							'Bitte überprüfen Sie Ihre Identifikationsdaten unten. Wenn Sie nicht diese Person sind, schließen Sie bitte diese Seite und melden Sie sich wieder von der Mobminder-Anwendung an',	// 4 - german
							'Verifica i tuoi dati di identificazione qui sotto. Se non sei questa persona, chiudi la pagina e accedi nuovamente dall\'applicazione Mobminder',	// 5 - italian
							'Verifique sus datos de identificación a continuación. Si no es esta persona, cierre esta página e inicie sesión nuevamente desde la aplicación Mobiminder',	// 6 - spanish
							'Verifique os dados de identificação abaixo. Se você não é essa pessoa, feche esta página e faça login novamente no aplicativo Mobiminder'	// 7 - portugese
							),
	
	'cronofy account ident'	=> array('Please verify the account name. If the account name does not match the one you want to synchronize, please close this page and log on the wished account.',	// 0 - english
							'Vérifiez le nom du compte. Si le nom du compte ne correspond pas à celui que vous souhaitez synchroniser, fermez cette page et connectez-vous sur le compte désiré',	// 1 - french
							'Sprawdź nazwę konta. Jeśli nazwa konta nie pasuje do tej, którą chcesz synchronizować, zamknij tę stronę i zaloguj się na żądanym koncie',	// 2 - polski
							'Controleer alstublieft de accountnaam. Als de accountnaam niet overeenkomt met degene die u wilt synchroniseren, sluit dan deze pagina en meld u het gewenste account aan',	// 3 - dutch
							'Bitte überprüfen Sie den Kontonamen. Wenn der Kontoname nicht mit dem übereinstimmt, den Sie synchronisieren möchten, schließen Sie bitte diese Seite und melden Sie sich mit dem gewünschten Konto an',	// 4 - german
							'Verifica il nome dell\'account. Se il nome dell\'account non corrisponde a quello che desideri sincronizzare, chiudi la pagina e accedi all\'accordo desiderato',	// 5 - italian
							'Compruebe el nombre de la cuenta. Si el nombre de la cuenta no coincide con el que desea sincronizar, cierre esta página e inicie sesión en la cuenta deseada',	// 6 - spanish
							'Verifique o nome da conta. Se o nome da conta não coincide com o que deseja sincronizar, feche esta página e faça o login na conta desejada'	// 7 - portugese
							),
	
	'cronofy view ident'	=> array('Please verify the calendars view below. If the calendars listed are not the ones you want to see remotely, please create a specific login having the appropriate view.',	// 0 - english
							'Veuillez vérifier la liste des calendriers ci-dessous. Si les calendriers répertoriés ne sont pas ceux que vous voulez voir à distance, créez une connexion spécifique ayant la vue appropriée.',	// 1 - french
							'Sprawdź widok kalendarzy poniżej. Jeśli wymienione kalendarze nie są wymienione na liście, należy utworzyć konkretny login z odpowiednim widokiem.',	// 2 - polski
							'Controleer onderstaande lijst van agenda\'s. Als de opgegeven agenda\'s niet zijn die u op afstand wilt zien, maak dan een specifieke login met de juiste zicht.',	// 3 - dutch
							'Bitte überprüfen Sie die Kalenderansicht unten. Wenn die angegebenen Kalender nicht die sind, die Sie fern sehen möchten, erstellen Sie bitte eine spezielle Anmeldung mit der entsprechenden Ansicht.',	// 4 - german
							'Verifica la sotto visualizzazione dei calendari. Se i calendari elencati non sono quelli che si desidera visualizzare in remoto, creare un login specifico con la vista appropriata.',	// 5 - italian
							'Verifique la vista de los calendarios a continuación. Si los calendarios enumerados no son los que desea ver de forma remota, cree un inicio de sesión específico que tenga la vista adecuada.',	// 6 - spanish
							'Verifique a exibição de calendários abaixo. Se os calendários listados não são os que você deseja ver remotamente, crie um login específico com a visão apropriada.'	// 7 - portugese
							),
	
	'cronofy asis ident'	=> array('Here is the list of already connected remote accounts of yours. You can connect other accounts to your Mobminder login.',	// 0 - english
							'Voici la liste des comptes distants déjà connectés. Vous pouvez connecter d\'autres comptes à votre login Mobminder.',	// 1 - french
							'Oto lista już podłączonych kont zdalnych. Do logowania Mobminder można podłączyć inne konta.',	// 2 - polski
							'Hier is de lijst met reeds aangesloten externe accounts van uwe. U kunt andere accounts koppelen aan uw Mobminder login.',	// 3 - dutch
							'Hier ist die Liste der bereits angeschlossenen Fernkonten von Ihnen. Sie können andere Konten mit Ihrem Mobminder-Login verbinden.',	// 4 - german
							'Ecco l\'elenco dei tuoi account remoti già connessi. È possibile connettere altri account al tuo login di Mobminder.',	// 5 - italian
							'Esta es la lista de cuentas remotas ya conectadas. Puede conectar otras cuentas a su inicio de sesión de Mobminder.',	// 6 - spanish
							'Aqui está a lista de contas remotas já conectadas. Você pode conectar outras contas ao login do Mobminder.'	// 7 - portugese
							),
	
	'cronofy asis none'	=> array('You have currently none connection to foreign calendars.',	// 0 - english
							'Vous n\'avez actuellement aucune connexion avec les calendriers extérieurs.',	// 1 - french
							'Obecnie nie ma połączenia z obcymi kalendarzami.',	// 2 - polski
							'U heeft momenteel nog geen verbinding met externe kalenders.',	// 3 - dutch
							'Sie haben derzeit keine Verbindung zu fremden Kalendern.',	// 4 - german
							'Non hai attualmente alcuna connessione a calendari stranieri.',	// 5 - italian
							'Actualmente no hay ninguna conexión con calendarios extranjeros.',	// 6 - spanish
							'Você atualmente não possui conexão com agendas estrangeiras.'	// 7 - portugese
							),
	
	'cronofy connect'	=> array('Create a connection',	// 0 - english
							'Creer une connexion',	// 1 - french
							'Utwórz połączenie',	// 2 - polski
							'Maak een verbinding',	// 3 - dutch
							'Erstellen Sie eine Verbindung',	// 4 - german
							'Crea una connessione',	// 5 - italian
							'Crear una conexión',	// 6 - spanish
							'Criar uma conexão'	// 7 - portugese
							),
	
	'cronofy connect warning'	=> array('The calendars visible in your Mobminder view will be reproduced on your remote account, please confirm.',	// 0 - english
							'Les calendriers visibles dans votre vue Mobminder seront reproduits sur votre compte distant, veuillez confirmer.',	// 1 - french
							'Kalendarze widoczne w widoku programu Mobminder zostaną odtworzone na Twoim koncie zdalnym, potwierdzić.',	// 2 - polski
							'De agenda\'s die zichtbaar zijn in uw Mobminder-weergave worden weergegeven op uw externe account, gelieve te bevestigen.',	// 3 - dutch
							'Die Kalender, die in deiner Mobminder-Ansicht sichtbar sind, werden auf deinem Fernkonto wiedergegeben, bitte bestätigen.',	// 4 - german
							'I calendari visibili nella tua visualizzazione Mobminder verranno riprodotti sul tuo account remoto, confermano.',	// 5 - italian
							'Los calendarios visibles en tu vista de Mobminder se reproducirán en tu cuenta remota, confirma.',	// 6 - spanish
							'Os calendários visíveis em sua exibição de Mobminder serão reproduzidos em sua conta remota, por favor, confirme.'),	// 7 - portugese
	
	'cronofy refresh warning'	=> array('The following account will be refreshed. All appointments will be removed and recreated as visible in Mobminder. This operation takes a few minutes. After confirmation, this page will close and refresh will proceed.',	// 0 - english
							'Le compte suivant sera actualisé. Tous les rendez-vous seront supprimés et recréés comme visible dans Mobminder. Cette opération dure quelques minutes. Après la confirmation, cette page se fermera et l\'actualisation se poursuivra.',	// 1 - french
							'Następujące konto zostanie odświeżone. Wszystkie spotkania zostaną usunięte i odtworzone w widoczny sposób w programie Mobminder. Ta operacja trwa kilka minut. Po potwierdzeniu ta strona zostanie zamknięta i odświeżona zostanie kontynuowana.',	// 2 - polski
							'Het volgende account wordt vernieuwd. Alle afspraken worden verwijderd en opnieuw zichtbaar gemaakt in Mobminder. Deze bewerking duurt een paar minuten. Na bevestiging wordt deze pagina afgesloten en wordt vernieuwd doorgegaan..',	// 3 - dutch
							'Das folgende Konto wird aktualisiert. Alle Termine werden in Mobminder entfernt und neu erstellt. Dieser Vorgang dauert einige Minuten. Nach der Bestätigung wird diese Seite geschlossen und aktualisiert werden.',	// 4 - german
							'Il seguente account verrà aggiornato. Tutti gli appuntamenti saranno rimossi e ricreati come visibili in Mobminder. Questa operazione richiede alcuni minuti. Dopo la conferma, questa pagina si chiuderà e l\'aggiornamento procederà.',	// 5 - italian
							'Se actualizará la siguiente cuenta. Todas las citas serán removidas y recreadas como se ve en Mobminder. Esta operación tarda unos minutos. Después de la confirmación, esta página se cerrará y continuará la actualización..',	// 6 - spanish
							'A seguinte conta será atualizada. Todos os compromissos serão removidos e recriados como visíveis no Mobminder. Esta operação demora alguns minutos. Após a confirmação, esta página será fechada e a atualização será prosseguida.'	// 7 - portugese
							),
	
	'cronofy revoke warning'	=> array('The following account will be disconnected from Mobminder. All appointments will be removed on this account. This operation takes a few minutes. After confirmation, this page will close and revoke will proceed.',	// 0 - english
							'Le compte suivant sera déconnecté de Mobminder. Tous les rendez-vous seront supprimés sur ce compte. Cette opération dure quelques minutes. Après la confirmation, cette page sera fermée et la révocation procédera..',	// 1 - french
							'Następujące konto zostanie odłączone od programu Mobminder. Wszystkie terminy zostaną usunięte z tego konta. Ta operacja trwa kilka minut. Po potwierdzeniu ta strona zostanie zamknięta i zostanie anulowana.',	// 2 - polski
							'Het volgende account wordt losgemaakt van Mobminder. Alle afspraken worden op dit account verwijderd. Deze bewerking duurt een paar minuten. Na bevestiging zal deze pagina sluiten en herroepen zal doorgaan.',	// 3 - dutch
							'Das folgende Konto wird von Mobminder getrennt. Alle Termine werden auf diesem Konto entfernt. Dieser Vorgang dauert einige Minuten. Nach der Bestätigung wird diese Seite geschlossen und der Widerruf wird fortgesetzt.',	// 4 - german
							'Il seguente account verrà scollegato da Mobminder. Tutti gli appuntamenti verranno rimossi in questo account. Questa operazione richiede alcuni minuti. Dopo la conferma, questa pagina si chiuderà e la revoca procederà.',	// 5 - italian
							'La siguiente cuenta se desconectará de Mobminder. Todas las citas se eliminarán en esta cuenta. Esta operación tarda unos minutos. Después de la confirmación, esta página se cerrará y la revocación continuará.',	// 6 - spanish
							'A seguinte conta será desconectada do Mobminder. Todos os compromissos serão removidos nesta conta. Esta operação demora alguns minutos. Após a confirmação, esta página irá fechar e revogar irá prosseguir.'	// 7 - portugese
							),
	
	'cronofy revoke full'	=> array('Revoke connection',	// 0 - english
							'Rompre la connexion',	// 1 - french
							'Cofnij połączenie',	// 2 - polski
							'Herroep verbinding',	// 3 - dutch
							'Verbindung widerrufen',	// 4 - german
							'Revoca connessione',	// 5 - italian
							'Revocar conexión',	// 6 - spanish
							'Revogar conexão'	// 7 - portugese
							),
	
	'cronofy revoke'	=> array('Revoke',	// 0 - english
							'Rompre',	// 1 - french
							'Cofnij',	// 2 - polski
							'Herroep',	// 3 - dutch
							'Widerrufen',	// 4 - german
							'Revoca',	// 5 - italian
							'Revocar',	// 6 - spanish
							'Revogar'	// 7 - portugese
							),
	
	'cronofy reinit'	=> array('Reinitialize',	// 0 - english
							'Rafraîchir',	// 1 - french
							'Ponownie zainicjować',	// 2 - polski
							'herinitialiseren',	// 3 - dutch
							'Reinitialisieren',	// 4 - german
							'reinizializzare',	// 5 - italian
							'Reinicializar',	// 6 - spanish
							'Reinicialize'	// 7 - portugese
							),
	
	'confirm refresh'	=> array('Reinitialize',	// 0 - english
							'Rafraîchir',	// 1 - french
							'Ponownie zainicjować',	// 2 - polski
							'herinitialiseren',	// 3 - dutch
							'Reinitialisieren',	// 4 - german
							'reinizializzare',	// 5 - italian
							'Reinicializar',	// 6 - spanish
							'Reinicialize'	// 7 - portugese
							),
	
	'go previous'	=> array('Cancel',	// 0 - english
							'Annuler',	// 1 - french
							'Anuluj',	// 2 - polski
							'Annuleren',	// 3 - dutch
							'Stornieren',	// 4 - german
							'Annulla',	// 5 - italian
							'Cancelar',	// 6 - spanish
							'Cancelar'	// 7 - portugese
							),
	
	'cronofy connecting'	=> array('We are now connecting Mobminder with your agenda. Please DO NOT CLOSE THIS WINDOW ! The process may take one to two minutes. You will be soon asked to give write persmission to your agenda.',	// 0 - english
							'Nous connectons maintenant Mobminder à votre agenda. NE FERMEZ PAS CETTE FENÊTRE! Le processus peut prendre une à deux minutes. Vous serez bientôt invité à donner la permission d\'écriture sur votre agenda.',	// 1 - french
							'Łączymy Mobminder z Twoją agendą. Proszę nie zamykaj tego okna! Proces może potrwać od jednej do dwóch minut. Wkrótce zostanie poproszony o nadanie pisanemu przełożeniu na plan zajęć.',	// 2 - polski
							'We verbinden Mobminder nu met uw agenda. Gelieve dit venster niet te sluiten! Het proces kan één tot twee minuten duren. U wordt daarna gevraagd om toegang te geven aan uw agenda.',	// 3 - dutch
							'Wir verbinden jetzt Mobminder mit deinem Kalender. Bitte schließe das Fenster nicht! Der Vorgang kann ein bis zwei Minuten dauern. Sie werden dann aufgefordert, auf Ihren Kalender zuzugreifen.',	// 4 - german
							'Ora contiamo Mobminder al tuo calendario. NON CLOSE THIS WINDOW! Il processo può richiedere da uno a due minuti. Sarai presto invitato a dare il permesso di scrivere sul tuo calendario.',	// 5 - italian
							'Ahora conectamos Mobminder a tu calendario. ¡NO CIERRE ESTA VENTANA! El proceso puede tomar de uno a dos minutos. Pronto se le pedirá que dé un permiso para escribir en su calendario.',	// 6 - spanish
							'Agora, conecte o Mobminder ao seu calendário. NÃO FIXA ESTA JANELA! O processo pode demorar de um a dois minutos. Em breve, você será solicitado a dar uma permissão para escrever no seu calendário.'	// 7 - portugese
							),
	
	'cronofy syncing'	=> array('Congratulations. The connection process is over and we are now synchronizing your agenda with Mobminder. You can close this window.',	// 0 - english
							'Toutes nos félicitations. Le processus de connexion est terminé et nous synchronisons maintenant votre agenda avec Mobminder. Vous pouvez fermer cette fenêtre.',	// 1 - french
							'Gratulacje. Proces połączenia się zakończył i synchronizujemy porządek z Mobminder. Możesz zamknąć to okno.',	// 2 - polski
							'Hartelijk gefeliciteerd. Het verbindingsproces is voorbij en we synchroniseren uw agenda nu met Mobminder. U kunt dit venster sluiten.',	// 3 - dutch
							'Glückwünsche. Der Verbindungsprozess ist vorbei und wir synchronisieren Ihre Agenda mit Mobminder. Sie können dieses Fenster schließen.',	// 4 - german
							'Complimenti. Il processo di connessione è finito e stiamo sincronizzando l\'agenda con Mobminder. Puoi chiudere questa finestra.',	// 5 - italian
							'Felicitaciones. El proceso de conexión ha terminado y ahora estamos sincronizando su agenda con Mobminder. Puedes cerrar esta ventana.',	// 6 - spanish
							'Parabéns. O processo de conexão acabou e agora estamos sincronizando sua agenda com o Mobminder. Você pode fechar esta janela.'	// 7 - portugese
							),
	
	'cronofy revoked'	=> array('The profile has been successfully disconnected from Mobminder. All calendars in your profile are now empty. You can remove the calendars from your account.',	// 0 - english
							'Le profil a été déconnecté avec succès de Mobminder. Tous les calendriers de votre profil sont maintenant vides. Vous pouvez supprimer les calendriers de votre compte.',	// 1 - french
							'Profil został pomyślnie odłączony od programu Mobminder. Wszystkie kalendarze w Twoim profilu są puste. Możesz usunąć kalendarze z konta.',	// 2 - polski
							'Het profiel is succesvol uitgeschakeld van Mobminder. Alle agenda\'s in uw profiel zijn nu leeg. U kunt de agenda\'s van uw account verwijderen.',	// 3 - dutch
							'Das Profil wurde erfolgreich von Mobminder getrennt. Alle Kalender in deinem Profil sind jetzt leer. Sie können die Kalender aus Ihrem Konto entfernen.',	// 4 - german
							'Il profilo è stato disconnesso con successo da Mobminder. Tutti i calendari nel tuo profilo sono ormai vuoti. È possibile rimuovere i calendari dal tuo account.',	// 5 - italian
							'El perfil se ha desconectado correctamente de Mobminder. Todos los calendarios de tu perfil están vacíos. Puede eliminar los calendarios de su cuenta.',	// 6 - spanish
							'O perfil foi desconectado com sucesso do Mobminder. Todos os calendários do seu perfil estão vazios. Você pode remover os calendários da sua conta.'	// 7 - portugese
							),
							
							
							
// C_control_message / C_control_commPlan


	/* this bunch is duplicated in .js */
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

	'indicates'	=> array('Indicating',	'Indiquant',	'Wskazujący',	'Vermeldt'	),
	'before scheduled'	=> array('before scheduled time',	'd\'avance sur le timing',	'wcześniej niż w harmonogramie',	'voorhang op timing'	),
                   
// e-reservation (translations for email sending)
	'e-resa-token-mail title'=> array(	'Your code for online booking',	
										'Votre code pour la réservation en ligne',	
										'Twój kod do rezerwacji online',	
										'Uw code voor de online reservatie',
									'',
									'Prendere un appuntamento - Prenotazione online',
									'',									
									'Marcar uma consulta - Reservas online'		),
										
	'mail sent at'	=> array(	'This mail was sent at',	
								'Cet email a été envoyé à',	
								'Ten e-mail został wysłany do',	
								'Deze email werd gestuurd om',
								'',
								'Questa email è stata inviata a',
								'',									
								'Este e-mail foi enviado às' ),
								
	'your code is'	=> array(	'Your code is',	
								'Votre code est',	
								'Kod jest',	
								'Uw code is',
								'',
								'Il codice è',
								'',									
								'Seu código é'	),
								
	'greetings'	=> array(	'Regards',	
							'Cordialement',	
							'Powitać',	
							'Groeten',
							'',
							'Cordiali saluti',
							'',									
							'Cordialmente'	),

										
										
	'goodbye'	=> array('goodbye',	// 0 - english
							'au revoir',	// 1 - french
							'do widzenia',	// 2 - polski
							'tot ziens',	// 3 - dutch
							'Auf Wiedersehen',	// 4 - german
							'addio',	// 5 - italian
							'adiós',	// 6 - spanish
							'Tchau'	// 7 - portugese
							),
	
	
	// translations for email sent on incoming inbound SMS from smsgateaway
		
	'inareply title' => array('Someone gave an answer to an SMS message',	// 0 - english
			'Une personne a répondu à un message SMS',		// 1 - french
			'Osoba odpowiedziała na wiadomość SMS',			// 2 - polski
			'Iemand heeft een sms-bericht beantwoord',		// 3 - dutch
			'Eine Person hat auf eine SMS geantwortet',		// 4 - german
			'Qualcuno ha dato una risposta a un messaggio SMS',	// 5 - italian
			'Alguien respondió a un mensaje SMS.',			// 6 - spanish
			'Alguém respondeu a uma mensagem SMS'			// 7 - portugese
			),
		
	'inareply account' => array('Mobminder account',	// 0 - english
			'Compte Mobminder',			// 1 - french
			'Konto Mobmindera',			// 2 - polski
			'Mobminder-account',		// 3 - dutch
			'Mobminder-Konto',			// 4 - german
			'Conto Mobminder',			// 5 - italian
			'Cuenta Mobminder',			// 6 - spanish
			'Conta do Mobminder'		// 7 - portugese
			),
		
	'inareply in-msg' => array('Received SMS message',	// 0 - english
			'Message SMS reçu',			// 1 - french
			'Odebrano wiadomość SMS',	// 2 - polski
			'Sms ontvangen',			// 3 - dutch
			'Empfangene SMS-Nachricht',	// 4 - german
			'SMS ricevuto',				// 5 - italian
			'Mensaje SMS recibido',		// 6 - spanish
			'Mensagem SMS recebida'		// 7 - portugese
			),
		
	'inareply initial' => array('Initially Mobminder sent message',	// 0 - english
			'Message initial par Mobminder',	// 1 - french
			'Pierwsza wiadomość od Mobmindera',	// 2 - polski
			'Eerste bericht van Mobminder',		// 3 - dutch
			'Erste Nachricht von Mobminder',	// 4 - german
			'Messaggio inizialmente inviato',	// 5 - italian
			'Mensaje enviado inicialmente',		// 6 - spanish
			'Mensagem inicialmente enviada'		// 7 - portugese
			),
		
	'inareply sender' => array('Message originator',	// 0 - english
			'Expéditeur du message',	// 1 - french
			'Nadawca wiadomości',		// 2 - polski
			'Bericht afzender',			// 3 - dutch
			'Absender der Nachricht',	// 4 - german
			'Mittente del messaggio',	// 5 - italian
			'Remitente del mensaje',	// 6 - spanish
			'Remetente da mensagem'		// 7 - portugese
			),
		
	'inareply appointment' => array('Related appointment',	// 0 - english
			'Rendez-vous relatif',		// 1 - french
			'Powiązane spotkanie',				// 2 - polski
			'Gerelateerde afspraak',	// 3 - dutch
			'Zugehöriger Termin',		// 4 - german
			'Appuntamento correlato',	// 5 - italian
			'Cita relacionada',			// 6 - spanish
			'Nomeação relacionada'		// 7 - portugese
			),
	
	'in_place' => array ( 'in',			// 0 - english
			'à', 						// 1 - french
			'w', 						// 2 - polski
			'in',						// 3 - dutch
			'in',						// 4 - german
			'a', 						// 5 - italian
			'en',						// 6 - spanish
			'em' 						// 7 - portugese
			),
		
	'make_an_appointment_with' => array ( 'Quickly make an appointment online with',	// 0 - english
			'Prenez rapidement un rendez-vous en ligne avec',							// 1 - french
			'Umów się szybko na spotkanie online z',									// 2 - polski
			'Boek nu snel uw online afspraak met',										// 3 - dutch
			'Vereinbaren Sie schnell einen Termin online mit',							// 4 - german
			'Fissate un rapido appuntamento online con',								// 5 - italian
			'Concierte una cita rápida en línea con', 									// 6 - spanish
			'Marque rapidamente uma reunião com'										// 7 - portugese
		),
			

	'online appointment' => array('Online appointment', 	// 0 - english
			'RDV en ligne', 								// 1 - french
			'Rezerwacja online', 							// 2 - polski
			'Online afspraak', 								// 3 - dutch
			'Online-Termine', 								// 4 - german
			'Appuntamento online', 							// 5 - italian
			'Cita online', 									// 6 - spanish
			'Reservas online' 								// 7 - portugese
			),
	); 

}                    
?>