<?php
require './../lib_mobphp/chtml.php';
require './classes/language.php';
require './html2pdf_v3.25/html2pdf.class.php'; 

$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 

// GROUP DATA
//
$groupId = $_SESSION['accountId'];
$dS_account = new C_dS_group($groupId);
// $o_dbAccess_contracts = new C_dbAccess_contracts($groupId);
$o_dbAccess_resources = new C_dbAccess_resources($groupId); 

// RESERVATION DATA
//
$rid = $_GET['rid'];
$o_dS_reservation = new C_dS_reservation($rid);
	$archive = ($o_dS_reservation->archived+0)?'archive_':'';
	
$o_dbAccess_attendees = new C_dbAccess_attendees($archive);
$o_dbAccess_att_visitors = new C_dbAccess_att_visitors($archive);
$o_dbAccess_visitors = new C_dbAccess_visitors();

$o_dbAccess_attendees->loadOnGroup($rid);
$o_dbAccess_att_visitors->loadOnGroup($rid);
$o_dbAccess_visitors->loadOnId($o_dbAccess_att_visitors->getResourceIdsList(), false);

$visitorPerson = $o_dbAccess_visitors->last();
$L = new L($visitorPerson->language);


// customization by account number
$price = '25';
$displayTime = true;
switch($dS_account->id) {
	case 2823: 
		$price = '20'; $displayTime = false;
		break;
}


class C_phoneDisplay {
	
	private $rawNumber;
	
	public function __construct($number) { 
		$this->rawNumber = $number;
	}
	public function __destruct() {}

	public function display() {
		$n = $this->rawNumber;
		return '+'.substr($n,0,2).' '.substr($n,2,3).' '.substr($n,5,6);;
	}
	
}


function getGender($genderCode) {
	$options = array( 	gender_code_male 	=> L::XL('male'), // see (*gc01*)
						gender_code_female 	=> L::XL('female'), 
						gender_code_sa 		=> L::XL('sa'), 
						gender_code_sprl 	=> L::XL('sprl'), 
						gender_code_miss 	=> L::XL('miss'), 
						gender_code_boy 	=> L::XL('boy'), 
						gender_code_girl 	=> L::XL('girl'), 
						gender_code_other 	=> L::XL('other') );
	return $options[$genderCode];
}

// ---------------------------- RETRIEVE DATA


$groupName = $dS_account->name;
$groupPhone = new C_phoneDisplay($dS_account->smsSenderId);
$groupPhone = $groupPhone->display();

// group data

$contract = false; // $o_dbAccess_contracts->getNewest(); // fetch the newest contract edition
$address = 'Pas encore de contrat!';
$zipCode = $city = $country = $tax = '';
if($contract) {
	$address	= $contract->address;
	$zipCode 		= $contract->zipCode;
	$city 			= $contract->city;
	$country 		= $contract->country;
	$tax 			= $contract->tax;
}

// reservation 


$resaNote = $o_dS_reservation->note;

// visitor attendee
$contractorGender = getGender($visitorPerson->gender);
$contractorFirstname = $visitorPerson->firstname;
$contractorLastname = $visitorPerson->lastname;
$contractorMobile = new C_phoneDisplay($visitorPerson->mobile);
$contractorMobile = $contractorMobile->display();
$contractorAdressLine1 	= $visitorPerson->address;
$contractorZipCode 		= $visitorPerson->zipCode;
$contractorCity 		= $visitorPerson->city;
$contractorCountry 		= $visitorPerson->country;
$contractorPlate 		= $visitorPerson->registration;

// associated car
$carName = 'no car associated';
$carNote = '';
if($o_dbAccess_attendees->count()) {
	$fcalId = 0;
	foreach($o_dbAccess_attendees->keyed as $id => $dataSet) if($dataSet->resourceType == class_fCal) { $fcalId = $dataSet->resourceId; break; } 
	if($fcalId) {
		$o_dS_resource = $o_dbAccess_resources->keyed[$fcalId];
		if($o_dS_resource) {
			$carName = $o_dS_resource->name;
			$carNote = $o_dS_resource->note;
		}
	}
}

// rental schedule
$carCheckOut = new C_date($o_dS_reservation->cueIn);
$carCheckIn = new C_date($o_dS_reservation->cueOut);

$now = new C_date();

// ---------------------------- PAGE LAYOUT

$html = new C_html();

$jpgName = $dS_account->id;
$defaultText = $dS_account->name;
$html->pushLogo($jpgName, $defaultText);

$header = '';
$doccontrol = '<td class="middle small" style="width: 60%">Document généré le '.$now->getDateTimeString().' - www.mobminder.com</td>';
$mobminder = '<td class="right" style="width: 40%"><img style="width: 54mm; height: 12mm;" src="./themes/default/pdf/printfooterlogo.jpg" alt="mobminder"/></td>';
$footer = '<table style="width: 180mm;"><tr>'.$doccontrol.$mobminder.'</tr></table>';


// Emprunteur / prêteur

$renter = $contractorGender.' '.$contractorFirstname.' '.$contractorLastname.' ('.$contractorPlate.')<br/>';
$renter .= $contractorAdressLine1.'<br/>'.$contractorZipCode.' '.$contractorCity.' - '.$contractorCountry.'<br/>'.$contractorMobile;
$renter = '<td style="width: 15%"><h3>Entre</h3></td><td style="width: 45%">'.$renter.'</td>';

$group = $groupName.'<br/>'.$address.'<br/>'.$zipCode.' '.$city.' - '.$country.'<br/>'.$groupPhone.'<br/>'.$tax;
$group = '<td style="width: 10%"><h3>Et</h3></td><td class="right" style="width: 30%">'.$group.'</td>';
	
$named = '<td colspan="2">dénommé " le locataire "</td><td colspan="2">dénommé " le bailleur "</td>';

$trs = array();
$trs[] = '<tr>'.$renter.$group.'</tr>';
$trs[] = '<tr>'.$named.'</tr>';
$table = '<table style="width: 100%; margin-top:20mm;">'.implode($trs).'</table>';
$html->pushHTML($table);


// Car status

$carHeader = '<td colspan="2">La société '.$groupName.' met à disposition du locataire le véhicule suivant, pour la raison suivante:</td>';
$car 	= '<td class="framed" style="width: 60%;">'.$carName.'<br/>'.$carNote.'</td>';

$reason  = 'O réparation mécanique<br/>';
$reason .= 'O réparation carrosserie<br/>';
$reason .= 'O attente de livraison<br/>';
$reason .= 'O essais';
$reason = '<td class="framed" style="width: 40%;">'.$reason.'</td>';

$trs = array();
$trs[] = '<tr>'.$carHeader.'</tr>';
$trs[] = '<tr>'.$car.$reason.'</tr>';
$table = '<table style="width: 100%;">'.implode($trs).'</table>';
$html->pushHTML($table);


// Note 

$note = '<td class="framed" style="width: 100%; height:20mm">'.$resaNote.'</td>';

$trs = array();
$trs[] = '<tr><td>Note:</td></tr>		<tr>'.$note.'</tr>';
$table = '<table style="width: 100%;">'.implode($trs).'</table>';
$html->pushHTML($table);

// Schedule

$price = '<p>Le véhicule est loué au prix journalier de '.$price.'.00 euros TVAC</p>';
$checkOut = '<td class="framed" style="height:15mm; width: 50%;">'.$carCheckOut->getDayString().', '.$carCheckOut->getDateString().' '.($displayTime?$now->getHHmmString():'').'</td>';
$checkIn = '<td class="framed" style="height:15mm; width: 50%;">'.$carCheckIn->getDayString().', '.$carCheckIn->getDateString().' '.($displayTime?$carCheckIn->getHHmmString():'').'</td>';

$trs = array();
$trs[] = '<tr><td>Départ:</td><td>Retour:</td></tr>';
$trs[] = '<tr>'.$checkOut.$checkIn.'</tr>';
$table = '<table style="width: 100%;">'.implode($trs).'</table>';
$html->pushHTML($price.$table);


// Signature

$signatures = '<td class="framed" style="height:20mm; width: 50%;"></td>';
$clause = '<p>En signant le présent contrat, le locataire déclare connaître et accepter toutes les clauses et conditions le régissant, notamment les articles 1 à 10 au verso.</p>';
$whenWhere = '<p>Fait à '.$city.', le '.$now->getDateString().'</p>';

$trs = array();
$trs[] = '<tr><td>Signature du locataire</td><td>Pour '.$groupName.',<br/>'.$dS_login->firstname.' '.$dS_login->lastname.'</td></tr>';
$trs[] = '<tr>'.$signatures.$signatures.'</tr>';
$table = '<table style="width: 100%;">'.implode($trs).'</table>';
$html->pushHTML($clause.$whenWhere.$table);

// Warning
$warning = '<h1>Attention: Toutes les amendes de roulage et frais administratifs divers seront payés par l\'emprunteur</h1>';
$html->pushHTML($warning);


// Contract Clauses

$clauses[] = 'Le client déclare être en possession d\'un permis de conduire en ordre et n\'avoir jamais été condamné pour état d\'ivresse ou conduite sous stupéfiants.';
$clauses[] = 'Sauf mention contraire, le client reconnaît avoir reçu le véhicule propre et en bon état avec tous les documents de bord et les accessoires légaux obligatoires (extincteur, triangle, trousse de secours). En cas de restitution du véhicule sale et/ou endommagé, il sera porté en compte les frais de nettoyage et/ou de franchise.';
$clauses[] = 'Il est strictement interdit de fumer dans le véhicule ou de transporter des animaux.';
$clauses[] = 'Le client s\'engage à contrôler régulièrement les niveaux d\'huile et d\'eau ainsi que de faire effectuer auprès de la SA '.$groupName.' les entretiens ou contrôles éventuels nécessaires .';
$clauses[] = 'Le client est seul responsable de la conduite et de l\'usage du véhicule et du défaut d\'entretien éventuel. Il devra en toutes circonstances, se conformer aux lois et règlements concernant la détention et l\'utilisation d\'un véhicules et, notamment, au code de la route, aux lois fiscales et au règlement relatif au transport par véhicule automobile. Le client fera usage du véhicule en bon père de famille. Il s\'interdit de transporter des personnes ou marchandises contre rémunération. 
Le client sera la seule et unique personne à conduire le véhicule ainsi loué.';
$clauses[] = 'Le client supportera toutes les amendes encourues du chef de la détention et de l\'utilisation du véhicule ainsi que tous les frais quelconques de formalités administratives. Le client ne peut utiliser le véhicule à l\'étranger sans en avoir reçu l\'autorisation de la SA '.$groupName.'.';
$clauses[] = 'Dans les 24 heures de tout sinistre, le client en fera la déclaration écrite à la SA '.$groupName.', tout défaut ou retard d\'information engageant, le cas échéant, la responsabilité du client. Tout sinistre avec blessés éventuels et contestations quant aux responsabilités, nécessitera un procès-verbal de la police. 
Les réclamations et documents concernant le sinistre adressés ultérieurement au conducteur devront être envoyés à la SA '.$groupName.' dans les plus brefs délais. La SA '.$groupName.' n\'est pas responsable des biens se trouvant dans le véhicule aussi bien pendant qu\'après la location. 
Si pour quelle que raison que ce soit, la compagnie d\'assurance de la SA '.$groupName.' ne devait pas intervenir dans un sinistre ou en cas de vol du véhicule, le client s\'engage à en supporter l\'entièreté du coût. Les réparations du véhicule se feront impérativement dans les ateliers et par le personnel de la SA '.$groupName.'.';
$clauses[] = 'La facture de location sera établie d\'après le nombre de jours d\'utilisation du véhicule. Les factures seront payées au grand comptant. En cas de retard de paiement, un intérêt au taux légal augmenté de 5% l\'an sera ajouté.';
$clauses[] = 'En cas de faillite, déconfiture, concordat, mise sous tutelle, décès, interdiction, arrestation quelconque du client, la SA '.$groupName.' pourra à tout moment saisir le véhicule en tout endroit où il se trouve. 
Le client autorise en ce cas expressément et irrévocablement la SA '.$groupName.' à reprendre le véhicule en tout endroit et même dans ses propres locaux. En cas de saisie du véhicule, le client le fera savoir immédiatement à la SA '.$groupName.' et supportera tous les frais de mainlevée.';
$clauses[] = 'Tout litige relatif à l\'exécution ou à la résiliation du présent contrat sera de la compétence exclusive du tribunal du ressort duquel se situe la SA '.$groupName.'.';

$counter = 0;
$trs = array();
foreach($clauses as $clause) 
	$trs[] = '<tr><td style="width: 20mm;">Art.'.++$counter.':</td><td style="width: 140mm;">'.$clause.'</td></tr>';
$table = '<table>'.implode($trs).'</table>';
$div = '<div style="page-break-before: always;">'.$table.'</div>';

// P D F    S E T U P  

$page = '
<page backtop="7mm" backbottom="7mm" backleft="10mm" backright="10mm"> 
	<link href="./themes/default/pdf/pdf.css" rel="stylesheet" type="text/css">
	<page_header> '.utf8_decode($header).' </page_header> 
		'.$html->htmlize(utf8_decode($html->getHTML())).'
	<page_footer> '.utf8_decode($footer).' </page_footer> 
	<page_header> '.utf8_decode($header).' </page_header> 
		'.$html->htmlize(utf8_decode($div)).'
	<page_footer> '.utf8_decode($footer).' </page_footer> 
</page> 
';
	
$pdf = new HTML2PDF('P','A4','fr'); 
$pdf->WriteHTML($page); 
$pdf->Output(); 
?>