<?php

//============================================================+
// File name   : example_001.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 001 for TCPDF class
//               Default Header and Footer
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Default Header and Footer
 * @author Nicola Asuni
 * @since 2008-03-04
 */

// Include the main TCPDF library (search for installation path).
require_once('./TCPDF-main/tcpdf.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetAuthor('Matteo Capiau');
$pdf->SetTitle('PDF Contract');
$pdf->SetSubject('PDF Contract');
$pdf->SetKeywords('test');

// // set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING, array(0,64,255), array(0,64,128));
$pdf->setFooterData(array(0,64,0), array(0,64,128));

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
    require_once(dirname(__FILE__).'/lang/eng.php');
    $pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

// set default font subsetting mode
$pdf->setFontSubsetting(true);

// Set font
// dejavusans is a UTF-8 Unicode font, if you only need to
// print standard ASCII chars, you can use core fonts like
// helvetica or times to reduce file size.
$pdf->SetFont('helvetica', '', 14, '', true);

// Add a page
// This method has several options, check the source code documentation for more information.
$pdf->AddPage();

// set text shadow effect
// $pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>0.2, 'depth_h'=>0.2, 'color'=>array(196,196,196), 'opacity'=>1, 'blend_mode'=>'Normal'));

// Set some content to print
$html = <<<EOF
<style>
#contractingSection{
    color: rgba(87,87,131,255);
}

#contractingSection span h1 {
    margin-top: 0.5em;
}

@media only screen and (max-width: 1450px) { 
    #contractingSection header h1 {left: 61%;}
}


#contractingSection h1 img {
    max-width: 100px;
    vertical-align: middle;
}

#phoneNumbers {
    display: flex;
    flex-direction: row nowrap;
}

.inputContract{
    /* border: none !important; */
    margin: 0 10px;
    width: fit-content;
}

.numberInput input{
    width: 125px;
}
/*
For design of Contract we're using a Grid
Example and explanation: https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout
*/

/*Grid Defintion*/
.wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(30px, auto);
    margin-top: 50px !important;
}

.wrapper input{
    padding: 5px 7px;
}

/*Grid Contractant & prestataire*/
.contractantTitle {
    grid-column: 1;
    grid-row: 1;
}

.prestataireTitle {
    grid-column: 3;
    grid-row: 1;
}

.valuesContractant {
    grid-column: 1 / 3;
    grid-row: 2 / 8;
}

.valuesContractant div{
    display: flex;
    flex-direction: row nowrap;
    padding: 3px;
}

.entreprisePrestataire {
    grid-column: 3;
    grid-row: 2;
}

.adressEntreprisePrestataire {
    grid-column: 3;
    grid-row: 3;
}

.tvaPrestataire {
    grid-column: 3;
    grid-row: 4;
}

.bankAndIbanPrestataire {
    grid-column: 3;
    grid-row: 5;
}

.phoneNrPrestataire {
    grid-column: 3;
    grid-row: 6;
}
.mailPrestataire{
    grid-column: 3;
    grid-row: 7;
}

.contractantTitle,.prestataireTitle{
    padding-bottom: 25px;
}

.valuesContractant p{
    padding: 8px 0;
}

.prestataireTitle, .entreprisePrestataire,.adressEntreprisePrestataire,.tvaPrestataire ,.bankAndIbanPrestataire p,.phoneNrPrestataire p,.mailPrestataire p{
    text-align: right !important;
}

/*Grid Paramètre du contrat*/
.titreContractParams{
    grid-column: 1;
    grid-row: 1;
}

.contractParamsFields{
    grid-column: 1 / 3;    
    grid-row: 2 / 3;
}

.contractParamsNumberValues{
    grid-column: 1/4;
    grid-row: 2 / 3;
}

.contractParamsFields p, .contractParamsNumberValues p{
    padding: 8px 0;
}
.contractParamsNumberValues p{
    text-align: right !important;
}

/*Definitions, responsablities, major forces, length & general application*/

.textPartsContract{
    margin-top: 50px !important;
}

.textPartsContract li{
    padding: 5px 0;
}


.textPartsContract h1{
    margin: 20px 0;
}

/*Grid signature*/

.signatureGrid{
    display: grid;
    grid-template-columns: minmax(380px, auto)repeat(2, 1fr);
    grid-auto-rows: minmax(30px, auto);
    margin-top: 50px !important;
    margin-bottom: 50px !important;
    width: 300px;
}

.titleSignature{
    grid-column: 1;
    grid-row: 1;
}

.definitionContractant{
    grid-column: 1;
    grid-row: 2;
}

.signatureContractant{
    grid-column: 2;
    grid-row: 3;
}

.definitionDateAndPlace{
    grid-column: 1;
    grid-row: 4;
}

.writeDateAndPlace{
    grid-column: 2;
    grid-row: 5;
}

.signatureGrid p{
    padding: 8px 0;
}

#signButtonDiv{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 3em;
}

#signButtonDiv div{
    width: 450px;
}

#signButtonDiv div i, #signButtonDiv div span{
    padding: 5px;
}


#signButtonDiv div:hover span{
    color: #FFFFFF;
}

@media only screen and (min-width:0px) and (max-width:1100px) { /* fonts resizing for portrait medium devices */
    /*Grid Contractant & prestataire*/
    .wrapper{
        font-size: 20px;
    }

    .wrapper input{
        margin-bottom: 10px;
        margin-left: 0;
        width: 95%;
    }

    .prestataireTitle {
        grid-column: 1 / 4;
        grid-row: 9;
    }

    .valuesContractant {
        grid-column: 1 / 4;
    }

    .valuesContractant div{
        display: flex;
        flex-direction: column;
    }
    
    .entreprisePrestataire {
        grid-column: 1 / 4;
        grid-row: 10;
    }
    
    .adressEntreprisePrestataire {
        grid-column: 1 / 4;
        grid-row: 11;
    }
    
    .tvaPrestataire {
        grid-column: 1 / 4;
        grid-row: 12;
    }
    
    .bankAndIbanPrestataire {
        grid-column: 1 / 4;
        grid-row: 13;
    }
    
    .phoneNrPrestataire {
        grid-column: 1 / 4;
        grid-row: 14;
    }
    .mailPrestataire{
        grid-column: 1 / 4;
        grid-row: 15;
    }

    .prestataireTitle, .entreprisePrestataire,.adressEntreprisePrestataire,.tvaPrestataire ,.bankAndIbanPrestataire p,.phoneNrPrestataire p,.mailPrestataire p, .contractParamsNumberValues p{
        text-align: left !important;
    }

    #phoneNumbers {
        display: flex;
        flex-direction: column;
    }

    /*Grid Paramètre du contrat*/
    .titreContractParams{
        font-size: 22px;
        grid-column: 1 / 4;
    }

    .contractParamsFields{
        grid-column: 1 / 4;
    }

    .contractParamsNumberValues{
        grid-column: 1 / 4;
        grid-row: 4;
    }

    .contractParamsFields input{
        width: 20%;
    }

    .textPartsContract{
        font-size: 20px;
    }

    .mob-txt-blue { color:#6897BF; 	}
    .mob-txt-lime { color:#C3D949; 	}
    .bold { font-family:"Calibri Bold" }
}
</style>
    <section id="contractingSection">
        <div class="margins">
            <span id="headerContracting">
                <h1 class="bold mobminder right"><img src="../imgs/icon-1.png" alt="mobminder logo"/>&nbsp;<span class="mob-txt-blue ">mob</span><span class="mob-txt-lime">minder</span></h1>
            </span>
            <div class="wrapper" id="contractant">
                <div class="contractantTitle">
                    <h2 class="bold">Contractant</h2>
                </div>
                <div class="prestataireTitle">
                    <h2 class="bold">Prestataire</h2>
                </div>
                <div class="valuesContractant" id="valuesContractant">
                    <div>
                        <p>Entreprise :</p>
                        <span id="entrepriseContractant"></span>
                    </div>
                    <div>
                        <p>Personne de contact : </p>
                        <span id="contactPersonContractant"></span>
                    </div>
                    <div>
                        <p>Adresse : </p>
                        <span id="addressContractant"></span>
                    </div>
                    <div>
                        <p>Ville : </p>
                        <span id="cityContractant"></span>
                    </div>
                    <div>
                        <p>TVA : </p>
                        <span id="tvaContractant"></span>
                    </div>
                    <div id="phoneNumbers">
                        <div>
                            <p>Téléphone :</p>
                            <span id="telNr"></span>
                        </div>
                        <div>
                            <p>Portable :</p>
                            <span id="phoneNr"></span>
                        </div>
                    </div>
                    <div>
                        <p>email : </p>
                        <span id="emailContractant"></span>
                    </div>
                    <div>
                        <p>BIC : </p>
                        <span id="bicContractant"></span>
                    </div>
                    <div>
                        <p>IBAN : </p>
                        <span id="ibanContractant"></span>
                    </div>
                </div>
                <div class="entreprisePrestataire">
                    <h1>Cloud-Tech srl</h1>
                </div>
                <div class="adressEntreprisePrestataire">
                    <h2>Rue du Brillant 86 b 21</h2>
                    <h2>1170 Watermael</h2>
                    <h2>Bruxelles / Belgique</h2>
                </div>
                <div class="tvaPrestataire">
                    <h2>TVA BE 0565.946.696</h2>
                </div>
                <div class="bankAndIbanPrestataire">
                    <p>BELFIUS BANK BIC: GKCCBEBB</p>
                    <p>IBAN: BE43 0689 0106 9201</p>
                </div>
                <div class="phoneNrPrestataire">
                    <p>Tel :  +32 (0) 2 662 1800</p>
                    <p>GSM :  +32 (0) 497 40 16 26</p>
                </div>
                <div class="mailPrestataire">
                    <p>Mail: info@mombinder.com</p>
                </div>
            </div>

            <div class="wrapper">
                <div class="titreContractParams">
                    <h1 class="bold" style="font-style: italic;">Paramètres du contrat</h1>
                </div>
                <div class="contractParamsFields">
                    <p>Forfait mensuel : <span id="forfaitMensuel" class="numberInput"></span> €</p>
                    <p>avec <span id="nrSms" class="numberInput"></span> SMS, + <span id="priceForSms" class="numberInput"></span> € / 200 SMS</p>
                    <p>Date anniversaire du contrat :<span id="birthdayContract" class="numberInput"></span> </p>
                    <div class="radioBtnDiv">
                        <input type="radio" id="mensuelPrelevement" name="payement" value="mensuelPrelevement">
                        <label for="mensuelPrelevement">paiement mensuel via prélèvement</label>
                    </div>
                    <div class="radioBtnDiv">
                        <input type="radio" id="annuelPrelevement" name="payement" value="annuelPrelevement">
                        <label for="annuelPrelevement">paiement annuel via prélèvement</label>
                    </div>
                    <div class="radioBtnDiv">
                        <input type="radio" id="annuelFacturation" name="payement" value="annuelFacturation">
                        <label for="annuelFacturation">paiement annuel après facturation</label>
                    </div>
                </div>

                <div class="contractParamsNumberValues">
                    <p>Nombre d'agendas business : <span id="nrBusinessAgendas" class="numberInput"></span></p>
                    <p>Nombre de collaborateurs : <span id="nrCollaborators" class="numberInput"></span></p>
                    <p>Nombre de sms par RDV : <span id="nrSmsAppointment" class="numberInput"></span></p>
                    <p>Numéro de client : <span id="clientNumber" class="numberInput"></span></p>
                </div>
            </div>

            <div class="textPartsContract">
                <ol>
                    <h1 class="bold" style="font-style: italic;">Responsabilités</h1>
                    <li>La signature du contrat donne au contractant un droit unique d'utilisation des services offerts par le système tels que décrit dans le guide utilisateur, à l'exclusion de toute autre fonctionnalité non documentée dans le guide utilisateur. </li>
                    <li>Le prestataire met à disposition du contractant un  mot de passe et un login donnant accès au service via une plateforme de navigation Internet compatible. La liste des plateformes de navigation compatibles est fournie en annexe dans le guide utilisateur. </li>
                    <li>Le contractant s'engage à utiliser une plateforme de navigation compatible afin d'utiliser le service, telle que spécifiée dans le Guide Utilisateur.</li>
                    <li>Respect de la confidentialité du contractant :<br>En aucun cas le prestataire ne peut visualiser, exporter ou mettre à disposition d'un tiers des données propres au contractant ou client final  introduites dans le système. Les données du contractant restent l'entière propriété du contractant. Le prestataire s'engage par les présentes, pendant la durée du contrat ainsi qu'après son expiration, à ne pas utiliser, commercialiser ou révéler d'Informations Confidentielles à une personne, ou à une entité tierce, exception faite de ses propres employés dont la connaissance des Informations Confidentielles peut être nécessaire pour une intervention au titre du présent contrat. Les employés prestataires sont eux-mêmes soumis aux règles de confidentialités requises par rapport à la sensibilité des informations traitées.</li>
                    <li>Respect de la vie privée du client final :<br>Il appartient au contractant d'obtenir le consentement du client final avant traitement de toute Information Confidentielle. En aucun cas le prestataire n'est tenu responsable du fait qu'il intervient dans le stockage ou l'utilisation d'Information Confidentielle afin de rendre les services décrit au guide utilisateur.Conformément au RGPD de Mai 2018 - Loi relative à la protection de la vie privée à l'égard des traitements de données à caractère personnel - par "consentement du client final", on entend toute manifestation de volonté, libre, spécifique et informée par laquelle la personne concernée ou son représentant légal accepte que des données à caractère personnel la concernant fassent l'objet d'un traitement. </li>
                    <li>Disponibilité du service.<br>Le service est considéré comme disponible à partir du moment où il est accessible depuis une plateforme compatible communiquant au travers du réseau Internet. Coté client final, le service est rendu sous réserve de compatibilité et de disponibilité du dispositif de communication utilisé par le client final (GSM ou téléphone ou autre).</li>
                    <li>Le prestataire s'engage à fournir un support adéquat en terme de :
                        <ul>
                            <li>formation à l'utilisation du service lors de sa mise en route. Ceci dans un périmètre restreint au seul signataire du présent contrat, et pour une durée forfaitaire d'une heure. </li>
                            <li>formation à l'utilisation de nouvelles fonctionnalités résultant de l'évolution du produit. </li>
                            <li>diagnostic des pannes.</li>
                        </ul>
                        Le support exclu cependant :
                        <ul>
                            <li>l'installation, la maintenance, le diagnostic ou la réparation de l'infrastructure informatique du contractant. </li>
                            <li>l'installation, la maintenance, le diagnostic ou la réparation de l'infrastructure de communication du client final (par exemple : son GSM).  </li>
                            <li>Sauf accord préalable stipulé dans un contrat annexe, la formation ex-cathedra  d'une équipe d'utilisateur du service mandatée par le contractant.  </li>
                        </ul>
                    </li>
                    <li>Le prestataire ne peut en aucun cas être tenu responsable de la nature éventuellement illégale des informations stockées sur son système par le contractant ou un tiers mandaté ou non par le contractant. Les données du contractant restent l'entière responsabilité du contractant. Le lien informatique existant entre une information stockée sur nos système et le compte du contractant constitue une preuve irréfutable de propriété et par là de responsabilité vis-à-vis de la dite donnée.  </li>
                    <li>Toute tentative de hacking par le contractant ou un tiers mandaté ou non par le contractant et utilisant le login et mot de passe contractant pour tenter de forcer les moyens de sécurité, d'intégrité, de stockage ou de transmission de donnée invalide les clauses relatives à la sécurité et la confidentialité de donnée offerte par le prestataire. En outre, le prestataire pourra sur base de suspicion simple mettre fin au contrat d'un contractant dont les login et mot de passe ont étés utilisés à de telle fin. </li>
                    <li>Le contractant ne peut en aucun cas détourner le service ainsi que ses fonctionnalités de leur utilité de base telle que spécifiée dans le guide utilisateur. </li>
                    <li>Le contractant ne peut adapter ou faire adapter, par perfectionnement, évolution, suppression, portage, corrections, simplifications, adjonctions, actualisation, intégration ou interfaçage avec d'autres logiciels ou systèmes, transcription dans une autre langue, tout ou partie des fonctionnalités ou interfaces mises à sa disposition par le présent contrat. </li> 	
                    <li>Les outils, méthodes, algorithmes, codes sources ou autres mis à disposition du contractant par le prestataire restent l'entière propriété du prestataire, ils ne peuvent être copié à quelconque fin que ce soit.</li>
                    <li>Le service est configuré pour le contractant et dédié à une utilisation telle que décrite par les paramètres du présent contrat et le guide utilisateur. En aucun cas le service ne peut être transmis par le contractant à un tiers sans avis préalable formel et favorable du prestataire. </li>
                    <li>Le contractant ne peut commercialiser ou faire commercialiser, ou sous traiter le service qui lui est contractuellement offert, que cela soit à titre gratuit ou onéreux. </li>
                    <li>Le prestataire pourra faire état, pour les besoins de sa publicité, de la signature du présent contrat et de son application consécutive, sauf mention contraire figurant en annexe au contrat. </li>
                    <li>Le prestataire se réserve le droit de modifier, annuler ou améliorer les fonctionnalités offertes par le service, sans mention préalable auprès du contractant. Les modifications effectives  seront cependant communiquées via le guide utilisateur disponible en ligne dans sa dernière version. </li>
                    <h1 class="bold" style="font-style: italic;">Forces majeurs:</h1>
                    <li>Il est expressément prévu que le prestataire ne doit pas être responsable des dommages, retards ou manquements dans l'exécution du contrat causés par des événements échappant à son contrôle raisonnable, ou ne résultant pas de la faute ou négligence du prestataire. </li>
                    <li>De tels actes ou causes comprennent, sans être limitatifs, les événement suivants: grève, conflit du travail, troubles sociaux, guerre, émeute, insurrection, attentat, sabotage, menace, incendie, inondation, carence ou retard des moyens de communication, panne d'ordinateur ou d'électricité, fait du prince. </li>
                    <li>La force majeure suspend les obligations nées du présent contrat pendant toute la durée de son existence. Toutefois, si la force majeure devait durer plus d'un mois, il pourra être mis fin au contrat par l'une ou l'autre des Parties, sans que cette résiliation puisse être considérée comme fautive. </li>
                    <li>La résiliation, dans une telle hypothèse, devra être notifiée par lettre recommandée avec accusé de réception et prendra effet à la date de réception de ladite lettre. Les sommes versées avant la résiliation demeurent acquises au prestataire, et les prestations réalisée par le prestataire jusqu'à la date de résiliation devront être payées par le contractant, le cas échéant pro rata temporis. </li>
                    <li>Le prestataire ne peut être tenu responsable des défauts de service de prestataires tiers donnant lieu à l'incapacité pour le contractant d'utiliser nos services (par exemple une panne de courant, d'internet, ou un défaut de fonctionnement de son installation informatique donnant lieu à des préjudices financiers ou commerciaux, perte de chiffre d'affaire, de bénéfice, de données, de clientèle...).</li>
                    <li>Dans des cas de force majeur naissant d'une nécessité de réparer une faute de fonctionnement du système, faute de manipulation par le contractant, ou naissant d'un besoin pour notre support d'éduquer le contractant au fonctionnement du système, des Informations Confidentielles peuvent être rendue visible à nos services. Ceci se fait toujours en accord avec le contractant. Le contractant reconnait par les présentes que le prestataire peut avoir connaissance d'informations confidentielles et protégées appartenant à l'autre partie et au client final relatif.</li> 
                    <li>En tout état de cause, si la responsabilité du prestataire était engagée pour des dommages directs subis par le contractant, le droit à réparation serait limité, toutes causes confondues, au montant dû par le contractant au prestataire pour la période de prestation de service concernée. De convention expresse, les parties conviennent que la présente clause survivra en cas de résolution judiciaire du contrat, y compris en cas de résolution totale prononcée aux torts exclusifs du prestataire. </li>
                    <h1 class="bold" style="font-style: italic;">Durée, modalités de paiement et résiliation.</h1>
                    <li>Le présent contrat prend effet le lendemain de sa signature.
                    <li>Le contrat est signé pour une durée indéterminée, reconduite de mois en mois (ou d'année en année si le contrat est annuel). </li>
                    <li>Dans le cas de prélèvements par voie de domiciliation, le prix du service est prélevé mensuellement, de mois en mois. La facturation intervient annuellement en fin d'année et reprend les acomptes mensuels prélevés durant l'année. Un prélèvement ouvre l'accès au service pour le mois suivant la date de prélèvement.</li>
                    <li>Dans le cas d'un paiement annuel, le paiement ouvre le service pour l'année entière indiquée sur la facture. Le paiment est anticipatif.</li>
                    <li>Les prix s'entendent hors taxe (TVA). </li>
                    <li>En cas de non paiement, le prestataire pourra résilier de plein droit le contrat ainsi que l'accès au service. La résiliation interviendra dans les huit jours calendrier suivant la date d'envoi du recommandé de mise en demeure. Le cachet de la poste faisant foi. Le début de la procédure de précontentieux est marqué par l'envoi de la mise en demeure. Cet envoi intervient 15 jours calendrier après l'envoi d'un rappel pour non paiement. Le rappel pour non paiement intervient lui même 15 jours calendrier après la date d'échéance de facturation. </li>
                    <li>En cas de défaut de paiement, toute somme en souffrance portera intérêt au taux de 1,5% par mois, de plein droit et sans mise en demeure préalable, avec un minimum de 25,00 €.</li>
                    <li>La résiliation par le contractant intervient par lettre recommandée auprès de nos services, avec une période de forfaitaire de résiliation d'un mois. </li>
                    <li>Au terme du contrat, le contractant peut récupérer une copie de ses données dans un format lisible standard et en demander l'effacement chez le prestataire. Cette demande sera cependant nulle s'il s'avère que le contractant, ou si tout ou une partie des données du contractant fait l'objet d'un mandat judiciaire. A défaut, les données sont conservées (et disponibles) pendant 7 ans.</li>
                    <h1 class="bold" style="font-style: italic;">Application générale</h1>
                    <li>Les présentes conditions sont applicables aux services fournis par le prestataire. L'application de toutes autres dispositions, y compris les dispositions légales non impératives ou les dispositions envisagées lors des négociations précontractuelles, même figurant sur toute correspondance préalable, est exclue. L'application des conditions générales du contractant est également exclue et de telles conditions, incompatibles avec les présentes conditions, seront nulles et de nul effet.</li>
                    <li>En cas de manquement par l'une des parties à ses obligations non réparé dans un délai de 30 jours à compter de la lettre recommandée avec accusé de réception notifiant le(s) manquement(s), et hormis le cas de non-paiement expressément prévu à l'article 30, l'autre partie pourra résilier de plein droit le présent contrat, sans préavis et sans formalité judiciaire, et sans préjudice de tous les dommages et intérêts auxquels elle pourrait prétendre. </li>
                    <li>En cas de litige relatif aux présentes conditions, les tribunaux de l'arrondissement judiciaire de Bruxelles seront seuls compétents, sauf le droit exclusif et discrétionnaire pour le prestataire de porter la cause devant les tribunaux normalement compétents en vertu des règles autrement applicables.</li>
                    <h1 class="bold" style="font-style: italic;">Mandat de domiciliation</h1>
                    <li>La signature du présent contrat avec mention « paiement par domiciliation » en page 1. vaut pour mandat de domiciliation européenne SEPA. Le prestataire étant le créancier, et le contractant étant le débiteur. </li>
                    <li>En signant ce mandat vous autorisez :
                        <ul>
                            <li>votre banque à débiter votre compte selon les instructions reçues du créancier.</li>
                            <li>le créancier à envoyer des encaissements à votre banque pour débiter votre compte.</li>
                            <li>type d'encaissement: recurrent.</li>
                        </ul>
                    </li>
                    <li>Sous certaines conditions vous avez le droit de demander à votre banque le remboursement d'une domiciliation. Le délai pour demander le remboursement prend fin 8 semaines après le débit effectué sur votre compte. Votre banque vous fournira plus d’informations concernant vos droits et obligations.</li>
                </ol>  
            </div>

            <div class="signatureGrid">
                <div class="titleSignature">
                    <h2 class="bold" style="font-style: italic;">Pour accord, lu et approuvé</h2>
                </div>
                <div class="definitionContractant">
                    <p>Le contractant :</p>
                </div>
                <div class="signatureContractant">
                    <p>………………………………………………………………………………</p>
                </div>
                <div class="definitionDateAndPlace">
                    <p>Date et lieu de la signature :</p>
                </div>
                <div class="writeDateAndPlace">
                    <p>………………………………………………………………………………</p>
                </div>
            </div>
        </div>
    </section>
EOF;

// Print text using writeHTMLCell()
$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);

// ---------------------------------------------------------

// Close and output PDF document
// This method has several options, check the source code documentation for more information.
$pdf->Output('example_001.pdf', 'D');

//============================================================+
// END OF FILE
//============================================================+

?>