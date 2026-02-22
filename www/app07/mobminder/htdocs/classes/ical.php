<?php

/////////////////////////////////////////////////////////////////////////////////
//
//
//

class C_iCal_vEvent {
	private $vEvent;
	private function dateToCal($tmstmp) {
		return date('Ymd\THis', $tmstmp) ;
	}
	private function CRLF($text) {
		$no1310 = str_replace(chr(13).chr(10), '\n', $text);
		$no10 = str_replace(chr(10), '\n', $no1310);
		$no13 = str_replace(chr(13), '\n', $no10);
		$noComma = str_replace(',', '\,', $no13);
		return $noComma;
	}
	public function __construct($resaId, $cueIn, $cueOut, $title, $resanote, $visiname, $visinote, $workcode, $colorname, $attendance, $color) {
		
		global $web;
		$CRLF = $web?'<br/>':chr(13).chr(10); // is accepted in the protocol but NEVER in the content
		
		$title = $this->CRLF($title);
		$resanote = $this->CRLF($resanote);
		$visiname = $this->CRLF($visiname);
		$visinote = $this->CRLF($visinote);
		$workcode = $this->CRLF($workcode);
		$colorname = $this->CRLF($colorname);
		$attendance = $this->CRLF($attendance);
		
		$VEVENTHead		= 'BEGIN:VEVENT'.$CRLF;
		$VEVENTBottom		= 'END:VEVENT'.$CRLF;

		$UID 				= 'UID:'.$resaId.$CRLF;
		$DTSTART			= 'DTSTART:'.$this->dateToCal($cueIn).$CRLF;
		$DTEND				= 'DTEND:'.$this->dateToCal($cueOut).$CRLF;
		$TITLE				= 'SUMMARY:'.$title.$CRLF;
		if($color) $COLOR	= 'COLOR:'.$color.$CRLF; else $COLOR = '';
		$NOTE				= 'DESCRIPTION:'.$resanote.'\n';
		if($visinote != '') 	$NOTE .= '\n'.$visinote;
		if($workcode != '') 	$NOTE .= '\n______________\n'.$workcode;
		if($colorname != '')	$NOTE .= '\n______________\n'.$colorname;
		if($attendance != '')	$NOTE .= '\n______________\n'.$attendance;
		$NOTE .= $CRLF;		
		$STATUS 			= 'STATUS:CONFIRMED'.$CRLF;

		$this->vEvent = $VEVENTHead.$UID.$DTSTART.$DTEND.$TITLE.$NOTE.$COLOR.$STATUS.$VEVENTBottom;
	}
	public function display() {
		return $this->vEvent;
	}	
}


/////////////////////////////////////////////////////////////////////////////////
//
//
//

class C_iCal_protocol {
	private $protocol;

	public function __construct($o_iCal_vEvents, $timezone = 'Europe/Brussels') {
		$CRLF 			= 	chr(13).chr(10);
		$ICALHead 		= 	'BEGIN:VCALENDAR'.$CRLF.
							'VERSION:2.0'.$CRLF.
							'PRODID:-//mobminder/icalGen//NONSGML v1.0//EN'.$CRLF.
							'BEGIN:VTIMEZONE'.$CRLF.
							'TZID:'.$timezone.$CRLF.
							'END:VTIMEZONE'.$CRLF;

		$ICALbottom 	= 'END:VCALENDAR'; 

		global $web;
		$vEvents=''; $br = $web?'<br/>':'';
		foreach($o_iCal_vEvents as $event) $vEvents .= $event->display().$br;

		$this->protocol = $ICALHead.$vEvents.$ICALbottom;
	}
	public function stream($filename) {
		header('Content-type: text/calendar; charset=utf-8');
		header('Content-Disposition: attachment; filename='.$filename.'.ics');
		echo $this->protocol;
	}
	public function display() {
		echo '<!DOCTYPE HTML>';
		echo '<html>';
				echo '<head>';
				echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
				echo '<head>';
			echo '<body>';
			echo $this->protocol;
			echo '</body>';
		echo '</html>';
	}
}


/////////////////////////////////////////////////////////////////////////////////
//
//
//

class L { // class for translations
	private static $L;
	public function __construct($language) { L::$L = $language;	}	
	static function XL($expression) { 
		if(!isset(L::$xl[$expression])) {
			return $expression; // hopefully a tester sees that
		} else if(!isset(L::$xl[$expression][L::$L])) {
				return $expression[0]; // falls back to english
			} else 
				return L::$xl[$expression][L::$L]; // successfully found expression
	}
	private static $xl = array(  // cross language table
		'appointment'	=> array('Appointement',	'Rendez-vous',		'Wizyta',					'afspraak',				'Termin',				'Appuntamento',		'Cita', 			'Compromissos'	),
		'task'			=> array('Task',			'Tâche',			'Zadanie',					'Taak',					'aufgabe',				'attività',			'Tarea', 			'Tarefa'		),
		'event'			=> array('Unavailability',	'Indisponibilité',	'Brak wolnych terminów',	'Onbeschikbaarheid',	'Nichtverfügbarkeit',	'Indisponibilità',	'Indisponibilidad', 'Indisponibilidade'	)
	);
}


/////////////////////////////////////////////////////////////////////////////////

?>