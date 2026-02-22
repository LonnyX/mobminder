<?php
   //session_start();
   $logged = @$_SESSION['logged'];
   $isLogged = isset($logged); //boolean true or false
?>

<!DOCTYPE html>
<html translate="no" lang="<?= $l ?>">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contracting</title>

    <link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	

    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../assets/css/faws.css">
    <link rel="stylesheet" href="../assets/css/bootstrap.css">    
    <link rel="stylesheet" href="../assets/css/generics.css">
    <link rel="stylesheet" href="../assets/css/controls.css">
    <link rel="stylesheet" href="../assets/css/contracting.css">

    <script src="../assets/js/jquery-3.2.1.js"></script>
    <script src="../assets/js/moblib.js"></script>

    <script src="../assets/js/iscroll.52.js"></script>
    <script src="../assets/js/jquery.rightClick.js"></script>
    <script src="../assets/js/mobframe.js"></script>
    <script src="../assets/js/language.js"></script>
    <script src="../assets/js/datasets.js"></script>
    <script src="../assets/js/controls.js"></script>
    <!-- <script src="../js/jsPDF/html2canvas.min.js"></script> -->
    <script src="../assets/js/jsPDF/dist/jspdf.min.js"></script>
    <!-- <script src="../assets/js/jsPDF2/dist/jspdf.umd.js"></script> -->
    <!-- <script src="../assets/js/html2pdf/dist/html2pdf.bundle.min.js"></script> -->
    <!-- <script src="../js/jsPDF/html2canvas.js"></script>  -->

    <!-- <script src="../js/jsPDF/jspdf.umd.js"></script> -->
    <!-- <script src="../js/jsPDF/jspdf.min.js"></script> -->
    <script src="../assets/js/xlate.js"></script>
    <script src="../assets/js/contracting.js"></script>
</head>
<body id="body">
    <section id="contractingSection">
        <div class="margins">
        <?php
                // Control if person is logged in, if ($isLogged) == true, the account manager contract version is displayed {

                if ($isLogged) {
                    echo('
                    <div id="contractAccountManager">    
                        <span id="headerContracting">
                            <h1 class="bold mobminder right"><img class="moblogo" src="../assets/imgs/icon-1.png" alt="mobminder logo"/>&nbsp;<span class="mob-txt-blue ">mob</span><span class="mob-txt-lime">minder</span></h1>
                        </span>
                        <div id="stakeholders" class="row">
                            <div class="col-12 col-lg-6" id="contractant">
                                <div class="contractantTitle stakeholderTitle">
                                    <h1 class="bold">'.X('top_header_contractor').'</h1>
                                </div>
                                <div class="valuesContractant stakeholderContent" id="valuesContractant"></div>
                            </div>
                            <div class="col-12 col-lg-6 right" id="provider">
                                <div class="prestataireTitle stakeholderTitle">
                                    <h1 class="bold">'.X('top_header_provider').'</h1>
                                </div>
                                <div id="prestataireValues" class="stakeholderContent">
                                    <div class="providerBloc">
                                        <p>Cloud-Tech srl</p>
                                    </div>
                                    <div class="providerBloc">
                                        <p>'.X('provider_street').'</p>
                                        <p>'.X('provider_city').'</p>
                                        <p>'.X('provider_country').'</p>
                                    </div>
                                    <div class="providerBloc">
                                        <p>'.X('provider_VAT').'</p>
                                        <p>'.X('provider_bic').'</p>
                                        <p>'.X('provider_iban').'</p>
                                    </div>
                                    <div class="providerBloc">
                                        <p>'.X('provider_tel').'</p>
                                        <p>'.X('provider_mail').'</p>
                                    </div>
                                </div>
                            </div> 
                        </div>
                       
                        <div style="display:none" class="ixl" id="LPCaption">'.X('captionLP').'</div>
                        <div style="display:none" class="ixl" id="NPCaption">'.X('captionNP').'</div>    
                        <div style="display:none" class="ixl" id="companyCaption">'.X('caption_company').'</div>
                        <div style="display:none" class="ixl" id="companyNumberCaption">'.X('caption_companyNumber').'</div>
                        <div style="display:none" class="ixl" id="beginAYCaption">'.X('caption_beginAY').'</div>
                        <div style="display:none" class="ixl" id="contactPersonFirstnameCaption">'.X('caption_contactPersonFirstname').'</div>
                        <div style="display:none" class="ixl" id="contactPersonLastnameCaption">'.X('caption_contactPersonLastname').'</div>
                        <div style="display:none" class="ixl" id="courtesyCaptionMr">'.X('caption_courtesy_mr').'</div>
                        <div style="display:none" class="ixl" id="courtesyCaptionMrs">'.X('caption_courtesy_mrs').'</div>
                        <div style="display:none" class="ixl" id="courtesyCaption">'.X('caption_courtesy').'</div>
                        <div style="display:none" class="ixl" id="addressCaption">'.X('caption_address').'</div>
                        <div style="display:none" class="ixl" id="cityCaption">'.X('caption_city').'</div>
                        <div style="display:none" class="ixl" id="cpCaption">'.X('caption_cp').'</div>
                        <div style="display:none" class="ixl" id="countryCaption">'.X('caption_country').'</div>
                        <div style="display:none" class="ixl" id="tvaCaption">'.X('caption_tva').'</div>
                        <div style="display:none" class="ixl" id="phoneNrCaption">'.X('caption_phoneNr').'</div>
                        <div style="display:none" class="ixl" id="mobileCaption">'.X('caption_mobile').'</div>
                        <div style="display:none" class="ixl" id="emailCaption">'.X('caption_email').'</div>
                        <div style="display:none" class="ixl" id="bicCaption">'.X('caption_bic').'</div>
                        <div style="display:none" class="ixl" id="ibanCaption">'.X('caption_iban').'</div>
                        

                        <div id="parameters" class="parameters row">
                            <div class="col-12 col-lg-6">
                                <div class="titreContractParams">
                                    <h1 class="bold">'.X('contract_param_title').'</h1>
                                </div>
                                <div class="contractParams" id="contractParams1"></div>
                                <div class="radioBtnDiv"></div>
                                <div class="contractParams" id="contractParams2"></div>
                                <div class="contractParams" id="notesContract"></div>
                            </div>
                            <div class="col-12 col-lg-6 right" id="accountManager">
                                <div id="accountManagerTitle">
                                    <h1 class="bold" >Account Manager</h1>
                                </div>
                                <div id="accountManagerInfo">
                                    <div id="AccountmanagerName" style="font-size:25px; padding-bottom:20px; color:rgba(10,30,15,0.6);">AccountmanagerName</div>
                                    <div id="AccountmanagerPhoneNr">Accountmanager phoneNr</div>
                                    <div id="AccountmanagerEmail">Accountmanager email</div>
                                </div>
                            </div> 
                        </div>

                        <div style="display:none" class="ixl" id="currencySymbol">'.X('currency_symbol').'</div>
                        <div style="display:none" class="ixl" id="monthlyPackageCaption">'.X('contract_param_1').'</div>
                        <div style="display:none" class="ixl" id="smsPackageCaption">'.X('with').'</div>
                        <div style="display:none" class="ixl" id="extraSmsPackageCaption">'.X('extra_cost').'</div>
                        <div style="display:none" class="ixl" id="birthdayContractCaption">'.X('contract_param_2').'</div>

                        <div class="ixl" id="caption_mensuel_prel" style="display:none">'.X('caption_mensuel_prel').'</div>
                        <div class="ixl" id="caption_annuel_prel" style="display:none">'.X('caption_annuel_prel').'</div>
                        <div class="ixl" id="caption_annuel_fac" style="display:none">'.X('caption_annuel_fac').'</div>

                        <div style="display:none" class="ixl" id="nrAgendaCaption">'.X('contract_param_3').'</div>
                        <div style="display:none" class="ixl" id="nrEmployeesCaption">'.X('contract_param_4').'</div>
                        <div style="display:none" class="ixl" id="nrSmsCaption">'.X('contract_param_5').'</div>
                        <div style="display:none" class="ixl" id="clientNrCaption">'.X('contract_param_6').'</div>

                        <div style="display:none" class="ixl" id="contractNoteCaption">'.X('contract_note').'</div>

                        <div id="clauses">
                            <h1 id="account-textPartsContract" class="bold" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime fa-sm"></i>'.X('clauses_dropdown').'</h1>
                            <div id="account-textPartsContract-toggle" style="display:none;">
                                <div class="textPartsContract">
                                    <ol>
                                        <h1 class="bold responsabilities" style="font-style: italic;">'.X('contract_section_0').'</h1>
                                        <ul class="nostyle">
                                            <li><span class="definitions">'.X('def-word_1').'</span>'.X('def-1').'</li>
                                            <li><span class="definitions">'.X('def-word_2').'</span>'.X('def-2').'</li>
                                            <li><span class="definitions">'.X('def-word_3').'</span>'.X('def-3').'</li>
                                            <li><span class="definitions">'.X('def-word_4').'</span>'.X('def-4').'</li>
                                            <li><span class="definitions">'.X('def-word_5').'</span>'.X('def-5').'</li>
                                            <li><span class="definitions">'.X('def-word_6').'</span>'.X('def-6').'</li>
                                            <li><span class="definitions">'.X('def-word_7').'</span>'.X('def-7').'</li>
                                            <li><span class="definitions">'.X('def-word_8').'</span>'.X('def-8').'</li>
                                        </ul>
                                        <ul class="indent-circle">
                                            <li>'.X('def-8_1').'</li>
                                            <li>'.X('def-8_2').'</li>
                                            <li>'.X('def-8_3').'</li>
                                            <li>'.X('def-8_4').'</li>
                                        </ul>
                                        <ul class="nostyle"><li><span class="definitions">'.X('def-word_9').'</span>'.X('def-9').'</li></ul>
                                        <ul class="indent-circle">
                                            <li>'.X('def-9_1').'</li>
                                            <li>'.X('def-9_2').'</li>
                                            <li>'.X('def-9_3').'</li>
                                            <li>'.X('def-9_4').'</li>
                                        </ul>
                                        <ul class="nostyle">
                                            <li><span class="definitions">'.X('def-word_10').'</span>'.X('def-10').'</li>
                                            <li><span class="definitions">'.X('def-word_11').'</span>'.X('def-11').'</li>
                                            <li><span class="definitions">'.X('def-word_12').'</span>'.X('def-12').'</li>
                                            <li><span class="definitions">'.X('def-word_13').'</span>'.X('def-13').'</li>
                                        </ul>
                                            <h1 class="bold responsabilities" style="font-style: italic;">'.X('contract_section_1').'</h1>
                                        <li>'.X('contract-clause_1').'</li>
                                        <li>'.X('contract_clause_2').'</li>
                                        <li>'.X('contract_clause_3').'</li>
                                        <li>'.X('contract_clause_4').'</li>
                                        <li>'.X('contract_clause_5').'</li>
                                        <li>'.X('contract_clause_6').'</li>
                                        <li>'.X('contract_clause_7').'
                                            <ul class="indent-circle";>
                                                <li>'.X('contract_clause_7_1').'</li>
                                                <li>'.X('contract_clause_7_2').'</li>
                                                <li>'.X('contract_clause_7_3').'</li>
                                            </ul>
                                            '.X('contract_clause_7bis').'
                                            <ul class="indent-circle";>
                                                <li>'.X('contract_clause_7_4').'</li>
                                                <li>'.X('contract_clause_7_5').'</li>
                                                <li>'.X('contract_clause_7_6').'</li>
                                            </ul>
                                        </li>
                                        <li>'.X('contract_clause_8').'</li>
                                        <li>'.X('contract_clause_9').'</li>
                                        <li>'.X('contract_clause_10').'</li>
                                        <li>'.X('contract_clause_11').'</li> 	
                                        <li>'.X('contract_clause_12').'</li>
                                        <li>'.X('contract_clause_13').'</li>
                                        <li>'.X('contract_clause_14').'</li>
                                        <li>'.X('contract_clause_15').'</li>
                                        <li>'.X('contract_clause_16').'</li>
                                            <h1 class="bold" style="font-style: italic;">'.X('contract_section_2').'</h1>
                                        <li>'.X('contract_clause_17').'</li>
                                        <li>'.X('contract_clause_18').'</li>
                                        <li>'.X('contract_clause_19').'</li>
                                        <li>'.X('contract_clause_20').'</li>
                                        <li>'.X('contract_clause_21').'</li> 
                                        <li>'.X('contract_clause_22').'</li>
                                        <li>'.X('contract_clause_23').'</li>
                                            <h1 class="bold" style="font-style: italic;">'.X('contract_section_3').'</h1>
                                        <li>'.X('contract_clause_24').'</li>
                                        <li>'.X('contract_clause_25').'</li>
                                        <li>'.X('contract_clause_26').'</li>
                                        <li>'.X('contract_clause_27').'</li>
                                        <li>'.X('contract_clause_28').'</li>
                                        <li>'.X('contract_clause_29').'</li>
                                        <li>'.X('contract_clause_30').'</li>
                                        <li>'.X('contract_clause_31').'</li>
                                        <li>'.X('contract_clause_32').'</li>
                                            <h1 class="bold" style="font-style: italic;">'.X('contract_section_4').'</h1>
                                        <li>'.X('contract_clause_33').'</li>
                                        <li>'.X('contract_clause_34').'</li>
                                        <li>'.X('contract_clause_35').'</li>
                                            <h1 class="bold" style="font-style: italic;">'.X('contract_section_5').'</h1>
                                        <li>'.X('contract_clause_36').'</li>
                                        <li>'.X('contract_clause_37').'
                                            <ul class="indent-circle";>
                                                <li>'.X('contract_clause_37_1').'</li>
                                                <li>'.X('contract_clause_37_2').'</li>
                                                <li>'.X('contract_clause_37_3').'</li>
                                            </ul>
                                        </li>
                                        <li>'.X('contract_clause_38').'</li>
                                    </ol>  
                                </div>    
                            </div>  
                        </div>
                        <div id="sendButtonDiv" class="col-10 col-md-8 col-lg-6 mx-auto" style="margin:50px 0 70px 0;"></div>
                        
                    </div>              
                ');
                }
                else{
                    echo('
                    <div class="insertCodeDiv">
                        <div class="insertCodeDivOutset">
                            <div class="insertCodeDivInset">
                                <div id="codeControlLead">
                                    <p>'.X('enter_code').'</p>
                                    <div id="inputCode"></div>
                                    <div id="buttonControlCode" class="col-10 col-md-8 col-lg-6 mx-auto"></div>
                                    <div class="ixl" id="buttonControlCodeCaption" style="display:none">'.X('caption_button_crtl').'</div>
                                    <div class="ixl" id="buttonControlCodeCheckCaption" style="display:none">'.X('caption_button_crtl_check').'</div>
                                    <div class="ixl" id="wrongPassword" style="display:none">'.X('wrong_pw').'</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    ');

                    echo('
                    
                    <div id="contractLead">
                        <span id="headerContracting">
                            <h1 class="bold mobminder right"><img class="moblogo" src="../assets/imgs/icon-1.png" alt="mobminder logo"/>&nbsp;<span class="mob-txt-blue ">mob</span><span class="mob-txt-lime">minder</span></h1>
                        </span>
                        <div id="stakeholders" class="row">
                            <div class="col-12 col-lg-6" id="contractant">
                                <div class="contractantTitle stakeholderTitle">
                                    <h1 class="bold">'.X('top_header_contractor').'</h1>
                                </div>
                                <div class="valuesContractant stakeholderContent" id="valuesContractant">
                                    <div>
                                        <p>'.X('contractor_company').'</p>
                                        <span id="entrepriseContractant"></span></div>
                                    <div>
                                        <p>'.X('contractor_contact').'</p>
                                        <span id="contactPersonContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_adress').'</p>
                                        <span id="addressContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_city').'</p>
                                        <span id="cityContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_cp').'</p>
                                        <span id="cpContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_country').'</p>
                                        <span id="countryContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_vat').'</p>
                                        <span id="tvaContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_tel').'</p>
                                        <span id="telNr"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_mobile').'</p>
                                        <span id="phoneNr"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_email').'</p>
                                        <span id="emailContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_bic').'</p>
                                        <span id="bicContractant"></span>
                                    </div>
                                    <div>
                                        <p>'.X('contractor_iban').'</p>
                                        <span id="ibanContractant"></span>
                                    </div>
                                </div>
                                <div class="mandatoryInputs" id="mandatoryContractValues"></div>
                            </div>
                            <div class="col-12 col-lg-6 right" id="provider">                                
                                <div class="prestataireTitle stakeholderTitle">
                                    <h1 class="bold">'.X('top_header_provider').'</h1>
                                </div>
                                <div id="prestataireValues" class="stakeholderContent">
                                    <div class="providerBloc">
                                        <p style="font-size:25px; color:rgba(10,30,15,0.6);">Cloud-Tech srl</p>
                                    </div>
                                    <div class="providerBloc">
                                        <p>'.X('provider_street').'</p>
                                        <p>'.X('provider_city').'</p>
                                        <p>'.X('provider_country').'</p>
                                    </div>
                                    <div class="providerBloc">
                                        <p>'.X('provider_VAT').'</p>
                                        <p>'.X('provider_bic').'</p>
                                        <p>'.X('provider_iban').'</p>
                                    </div>
                                    <div class="providerBloc">
                                        <p>'.X('provider_tel').'</p>
                                        <p>'.X('provider_mail').'</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                            <div style="display:none" class="ixl" id="companyCaption">'.X('caption_company').'</div>
                            <div style="display:none" class="ixl" id="companyNumberCaption">'.X('caption_companyNumber').'</div>
                            <div style="display:none" class="ixl" id="LPCaption">'.X('captionLP').'</div>
                            <div style="display:none" class="ixl" id="NPCaption">'.X('captionNP').'</div>    
                            <div style="display:none" class="ixl" id="beginAYCaption">'.X('caption_beginAY').'</div>
                            <div style="display:none" class="ixl" id="contactPersonCaption">'.X('caption_contactPerson').'</div> 
                            <div style="display:none" class="ixl" id="contactPersonFirstnameCaption">'.X('caption_contactPersonFirstname').'</div> 
                            <div style="display:none" class="ixl" id="contactPersonLastnameCaption">'.X('caption_contactPersonLastname').'</div> 
                            <div style="display:none" class="ixl" id="courtesyCaption">'.X('caption_courtesy').'</div>
                            <div style="display:none" class="ixl" id="courtesyCaptionMr">'.X('caption_courtesy_mr').'</div>
                            <div style="display:none" class="ixl" id="courtesyCaptionMrs">'.X('caption_courtesy_mrs').'</div>
                            <div style="display:none" class="ixl" id="addressCaption">'.X('caption_address').'</div>
                            <div style="display:none" class="ixl" id="cityCaption">'.X('caption_city').'</div>
                            <div style="display:none" class="ixl" id="cpCaption">'.X('caption_cp').'</div>
                            <div style="display:none" class="ixl" id="countryCaption">'.X('caption_country').'</div>
                            <div style="display:none" class="ixl" id="tvaCaption">'.X('caption_tva').'</div>
                            <div style="display:none" class="ixl" id="phoneNrCaption">'.X('caption_phoneNr').'</div>
                            <div style="display:none" class="ixl" id="mobileCaption">'.X('caption_mobile').'</div>
                            <div style="display:none" class="ixl" id="emailCaption">'.X('caption_email').'</div>
                            <div style="display:none" class="ixl" id="bicCaption">'.X('caption_bic').'</div>
                            <div style="display:none" class="ixl" id="ibanCaption">'.X('caption_iban').'</div>

                            <div style="display:none" class="ixl" id="monthlyPackageCaption">'.X('contract_param_1').'</div>
                            <div style="display:none" class="ixl" id="smsPackageCaption">'.X('with').'</div>
                            <div style="display:none" class="ixl" id="extraSmsPackageCaption">'.X('extra_cost').'</div>
                            <div style="display:none" class="ixl" id="birthdayContractCaption">'.X('contract_param_2').'</div>

                            <div style="display:none" class="ixl" id="warningCaption">'.X('mandatory_phrase').'</div>



                            <div id="parameters" class="parameters row">
                                <div class="col-12 col-lg-6">
                                    <div class="titreContractParams">
                                        <h1 class="bold">'.X('contract_param_title').'</h1>
                                    </div>

                                    <div class="lContractParamsFields">
                                        <div class="contractParams">'.X('contract_param_1').' :<br><div class="fixed"><span id="lForfaitMensuel" class="numberInput"></span>'.X('currency_symbol').'</div></div>
                                        <div class="contractParams">'.X('with').' :<br><div class="fixed"><span id="lNrSms" class="numberInput"></span></div></div>
                                        <div class="contractParams">'.X('extra_cost').' :<br><div class="fixed"><span id="lPriceForSms" class="numberInput"></span>'.X('currency_symbol').'</div></div>
                                        <div class="contractParams" style="margin-bottom:10px;">'.X('contract_param_2').' :<br><div class="fixed"><span id="lBirthdayContract" class="numberInput"></span>&nbsp<span id="dateInWords" class="mob-txt-gray_l"></span></div></div>
                                    </div>
                                    <div class="lRadioBtnDiv"></div>
                                    <div class="lContractParamsNumberValues">
                                        <div class="contractParams">'.X('contract_param_3').' :<br><div class="fixed"><span id="nrBusinessAgendas" class="numberInput"></span></div></div>
                                        <div class="contractParams">'.X('contract_param_4').' :<br><div class="fixed"><span id="nrCollaborators" class="numberInput"></span></div></div>
                                        <div class="contractParams">'.X('contract_param_5').' :<br><div class="fixed"><span id="nrSmsAppointment" class="numberInput"></span></div></div>
                                        <div class="contractParams">'.X('contract_param_6').' :<br><div class="fixed"><span id="clientNumber" class="numberInput"></span></div></div>
                                    </div>
                                    <div style="display:none" id="lNotesContract">
                                        <div class="contractParams">Note :<br><div class="fixed"><span id="noteTextArea" class="numberInput"></span></div></div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-6 right" id="accountManager">
                                    <div id="accountManagerTitle">
                                        <h1 class="bold" >Account Manager</h1>
                                    </div>
                                    <div id="accountManagerInfo">
                                        <div id="AccountmanagerName" style="font-size:25px; padding-bottom:20px; color:rgba(10,30,15,0.6);">AccountmanagerName</div>
                                        <div id="AccountmanagerPhoneNr">Accountmanager phoneNr</div>
                                        <div id="AccountmanagerEmail">Accountmanager email</div>
                                    </div>
                                </div> 
                            </div>

                            <div class="ixl" id="caption_title_pay" style="display:none">'.X('caption_title_pay').'</div>
                            <div class="ixl" id="caption_mensuel_prel" style="display:none">'.X('caption_mensuel_prel').'</div>
                            <div class="ixl" id="caption_annuel_prel" style="display:none">'.X('caption_annuel_prel').'</div>
                            <div class="ixl" id="caption_annuel_fac" style="display:none">'.X('caption_annuel_fac').'</div>

                            <div style="display:none" class="ixl" id="janCaption">'.X('caption_jan').'</div>
                            <div style="display:none" class="ixl" id="febCaption">'.X('caption_feb').'</div>
                            <div style="display:none" class="ixl" id="marCaption">'.X('caption_mar').'</div>
                            <div style="display:none" class="ixl" id="aprCaption">'.X('caption_apr').'</div>
                            <div style="display:none" class="ixl" id="mayCaption">'.X('caption_may').'</div>
                            <div style="display:none" class="ixl" id="junCaption">'.X('caption_jun').'</div>
                            <div style="display:none" class="ixl" id="julCaption">'.X('caption_jul').'</div>
                            <div style="display:none" class="ixl" id="augCaption">'.X('caption_aug').'</div>
                            <div style="display:none" class="ixl" id="sepCaption">'.X('caption_sep').'</div>
                            <div style="display:none" class="ixl" id="octCaption">'.X('caption_oct').'</div>
                            <div style="display:none" class="ixl" id="novCaption">'.X('caption_nov').'</div>
                            <div style="display:none" class="ixl" id="decCaption">'.X('caption_dec').'</div>
                            <div class="lTextPartsContract" id="lTextPartsContract">
                                <ol id="listContractTextParts">
                                    <h1 class="bold responsabilities" style="font-style: italic;">'.X('contract_section_0').'</h1>
                                    <ul class="nostyle">
                                        <li><span class="definitions">'.X('def-word_1').'</span>'.X('def-1').'</li>
                                        <li><span class="definitions">'.X('def-word_2').'</span>'.X('def-2').'</li>
                                        <li><span class="definitions">'.X('def-word_3').'</span>'.X('def-3').'</li>
                                        <li><span class="definitions">'.X('def-word_4').'</span>'.X('def-4').'</li>
                                        <li><span class="definitions">'.X('def-word_5').'</span>'.X('def-5').'</li>
                                        <li><span class="definitions">'.X('def-word_6').'</span>'.X('def-6').'</li>
                                        <li><span class="definitions">'.X('def-word_7').'</span>'.X('def-7').'</li>
                                        <li><span class="definitions">'.X('def-word_8').'</span>'.X('def-8').'</li>
                                    </ul>
                                    <ul class="indent-circle">
                                        <li>'.X('def-8_1').'</li>
                                        <li>'.X('def-8_2').'</li>
                                        <li>'.X('def-8_3').'</li>
                                        <li>'.X('def-8_4').'</li>
                                    </ul>
                                    <ul class="nostyle"><li><span class="definitions">'.X('def-word_9').'</span>'.X('def-9').'</li></ul>
                                    <ul class="indent-circle">
                                        <li>'.X('def-9_1').'</li>
                                        <li>'.X('def-9_2').'</li>
                                        <li>'.X('def-9_3').'</li>
                                        <li>'.X('def-9_4').'</li>
                                    </ul>
                                    <ul class="nostyle">
                                        <li><span class="definitions">'.X('def-word_10').'</span>'.X('def-10').'</li>
                                        <li><span class="definitions">'.X('def-word_11').'</span>'.X('def-11').'</li>
                                        <li><span class="definitions">'.X('def-word_12').'</span>'.X('def-12').'</li>
                                        <li><span class="definitions">'.X('def-word_13').'</span>'.X('def-13').'</li>
                                    </ul>
                                        <h1 class="bold responsabilities" style="font-style: italic;">'.X('contract_section_1').'</h1>
                                    <li>'.X('contract-clause_1').'</li>
                                    <li>'.X('contract_clause_2').'</li>
                                    <li>'.X('contract_clause_3').'</li>
                                    <li>'.X('contract_clause_4').'</li>
                                    <li>'.X('contract_clause_5').'</li>
                                    <li>'.X('contract_clause_6').'</li>
                                    <li>'.X('contract_clause_7').'
                                        <ul class="indent-circle">
                                            <li>'.X('contract_clause_7_1').'</li>
                                            <li>'.X('contract_clause_7_2').'</li>
                                            <li>'.X('contract_clause_7_3').'</li>
                                        </ul>
                                        '.X('contract_clause_7bis').'
                                        <ul class="indent-circle">
                                            <li>'.X('contract_clause_7_4').'</li>
                                            <li>'.X('contract_clause_7_5').'</li>
                                            <li>'.X('contract_clause_7_6').'</li>
                                        </ul>
                                    </li>
                                    <li>'.X('contract_clause_8').'</li>
                                    <li>'.X('contract_clause_9').'</li>
                                    <li>'.X('contract_clause_10').'</li>
                                    <li>'.X('contract_clause_11').'</li> 	
                                    <li>'.X('contract_clause_12').'</li>
                                    <li>'.X('contract_clause_13').'</li>
                                    <li>'.X('contract_clause_14').'</li>
                                    <li>'.X('contract_clause_15').'</li>
                                    <li>'.X('contract_clause_16').'</li>
                                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_2').'</h1>
                                    <li>'.X('contract_clause_17').'</li>
                                    <li>'.X('contract_clause_18').'</li>
                                    <li>'.X('contract_clause_19').'</li>
                                    <li>'.X('contract_clause_20').'</li>
                                    <li>'.X('contract_clause_21').'</li> 
                                    <li>'.X('contract_clause_22').'</li>
                                    <li>'.X('contract_clause_23').'</li>
                                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_3').'</h1>
                                    <li>'.X('contract_clause_24').'</li>
                                    <li>'.X('contract_clause_25').'</li>
                                    <li>'.X('contract_clause_26').'</li>
                                    <li>'.X('contract_clause_27').'</li>
                                    <li>'.X('contract_clause_28').'</li>
                                    <li>'.X('contract_clause_29').'</li>
                                    <li>'.X('contract_clause_30').'</li>
                                    <li>'.X('contract_clause_31').'</li>
                                    <li>'.X('contract_clause_32').'</li>
                                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_4').'</h1>
                                    <li>'.X('contract_clause_33').'</li>
                                    <li>'.X('contract_clause_34').'</li>
                                    <li>'.X('contract_clause_35').'</li>
                                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_5').'</h1>
                                    <li>'.X('contract_clause_36').'</li>
                                    <li>'.X('contract_clause_37').'
                                        <ul class="indent-circle">
                                            <li>'.X('contract_clause_37_1').'</li>
                                            <li>'.X('contract_clause_37_2').'</li>
                                            <li>'.X('contract_clause_37_3').'</li>
                                        </ul>
                                    </li>
                                    <li>'.X('contract_clause_38').'</li>
                                </ol>  
                            </div> 

                        <div id="placeSigning"></div>
                        <div style="display:none" class="ixl" id="placeSigningCaption">'.X('caption_placeSigning').'</div>

                        <div style="display:flex; align-items:center;" id="conditionCRESTA"></div>
                        <div style="display:none" class="ixl" id="conditionCRESTACaption">'.X('caption_accept').'</div>

                        <div class="mandatoryInputs" id="mandatoryContractBottom"></div>

                        <div id="signButtonDiv" style="margin:50px 0 70px 0;" class="col-10 col-md-8 col-lg-6 mx-auto"></div>
                        <div style="display:none" class="ixl" id="signButtonCaption">'.X('caption_sign').'</div>
                        <div style="display:none" class="ixl" id="signProgressButtonCaption">'.X('caption_progress_sign').'</div>                        
                    </div>');
                }
            ?>

            <script>
                function togglecssinstruction(csstheme) {
                    let cssthemeid = csstheme.id;
                    if($('#'+cssthemeid+'-toggle').css('display') === 'none')
                    {
                        $('#'+cssthemeid+' i').css({'transform':'rotate(90deg)','transition':'transform 400ms ease-in-out' });
                        $('#'+cssthemeid+'-toggle').fadeToggle(200);
                    }
                    else 
                    {
                        $('#'+cssthemeid+' i').css({'transform':'rotate(0deg)','transition':'transform 400ms ease-in-out' });
                        $('#'+cssthemeid+'-toggle').fadeToggle(200);
                    }
                }
            </script>

            <script type="text/javascript">
                let cc = new C_iCodeControl('codeControlLead', {
                    target: $('#codeControlLead'),
                    ixl: '<?= $ixl ?>',
                    lang: '<?= $l ?>' //Is used in contracting.js::	switch(preset.lang) to keep track of the surfer lang
                })
                cc.display();
                cc.activate();
            </script>

        </div>
    </section>
</body>
</html>