<?php

$pdfbody ='

    <div class="pdf">
        <div class="page firstpage">
            <div id="headerContract" class="headerContract">
                <div class="right" style="position:relative;"><span style="position:absolute; right:182px; top:0px;">'.$logoicon.'</span><logo class="mobminder center"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></logo></div>
            </div>
            <div class="content">
                <div class="table-wrapper-65 contractor">
                    <table class="left">
                        <thead>
                            <tr>
                                <th class="left"><h1>'.X('top_header_contractor','contracting').'</h1></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>'.X('caption_ppPm','contracting').': <span id="legalFrom" class="field">'.X($legalformTn,'contracting').'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_company','contracting').': <span id="entrepriseContractant" class="field">'.$dS_contract->invCompanyName.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_companyNumber','contracting').': <span id="entrepriseContractant" class="field">'.$dS_contract->invCompanyNumber.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_beginAY','contracting').': <span id="accountingYear" class="field">'.$dS_contract->beginAccountingYear.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_contactPersonFirstname','contracting').': <span id="contactPersonContractant" class="field">'.$dS_contract->invContactPersonFirstname.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_contactPersonLastname','contracting').': <span id="contactPersonContractant" class="field">'.$dS_contract->invContactPersonLastname.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_courtesy','contracting').': <span id="courtesy" class="field">'.X($tncourtesy,'mailinvite').'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_address','contracting').': <span id="addressContractant" class="field">'.$dS_contract->invAddress.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_city','contracting').': <span id="cityContractant" class="field">'.$dS_contract->invCity.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_cp','contracting').': <span id="zipcodeContractant" class="field">'.$dS_contract->invCP.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_country','contracting').': <span id="countryContractant" class="field">'.$dS_contract->invCountry.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_tva','contracting').': <span id="tvaContractant" class="field">'.$dS_contract->TVA.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_phoneNr','contracting').': <span id="telNr" class="field">'.$dS_contract->invPhone.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_mobile','contracting').': <span id="phoneNr" class="field">'.$dS_contract->invMobile.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_email','contracting').': <span id="emailContractant" class="field">'.$dS_contract->invEmail.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_bic','contracting').': <span id="bicContractant" class="field">'.$dS_contract->BIC.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('caption_iban','contracting').': <span id="ibanContractant" class="field">'.$dS_contract->IBAN.'</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            
                <div class="table-wrapper-35 provider">
                    <table class="right">
                        <thead>
                            <tr>
                                <th class="right"><h1>'.X('top_header_provider','contracting').'</h1></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>'.X('provider_street','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_city','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_country','contracting').'</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_VAT','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_bic','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_iban','contracting').'</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_tel','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('provider_mail','contracting').'</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="clear: both;"></div>

                <div class="table-wrapper-65 parameters">
                    <table class="left">
                        <thead>
                            <tr>
                                <th class="left"><h1>'.X('contract_param_title','contracting').'</h1></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>'.X('contract_param_1','contracting').' <span id="lForfaitMensuel" class="field numberInput">: '.$dS_contract->monthlyPackage.'</span>'.X('currency_symbol','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('with','contracting').' <span id="lNrSms" class="field numberInput">: '.$dS_contract->smsPackage.'</span> '.X('SMS','contracting').'</td>
                            </tr>
                            <tr>
                                <td>'.X('extra_cost','contracting').' <span id="lNrSms" class="field numberInput">: '.$dS_contract->extraSmsPackage.'</span> '.X('currency_symbol','contracting').'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('contract_param_2','contracting').' <span id="lBirthdayContract" class="field numberInput">: '.$birthContractYear.'-'.$birthContractMonth.'-'.$birthContractDay.'<span style="color:rgba(10,30,15,0.4);"> '.$convertedDate.'</span></span></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>'.X('contract_param_3','contracting').' <span id="nrBusinessAgendas" class="field numberInput">: '.$dS_contract->numberBusinessDiaries.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('contract_param_4','contracting').' <span id="nrCollaborators" class="field numberInput">: '.$dS_contract->numberEmployees.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('contract_param_5','contracting').' <span id="nrSmsAppointment" class="field numberInput">: '.$dS_contract->numberSmsAppointment.'</span></td>
                            </tr>
                            <tr>
                                <td>'.X('contract_param_6','contracting').' <span id="clientNumber" class="field numberInput">: '.$dS_contract->clientNr.'</span></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>'.$paymentsPlans.'</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="table-wrapper-35 accmanager">
                    <table class="right">
                        <thead>
                            <tr>
                                <th class="right"><h1>Account manager</h1></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>'.$accfirstname.' '.$acclastname.'</td>
                            </tr>
                            <tr>
                                <td>'.X('caption_mobile','contracting').': '.$accmobile.'</td>
                            </tr>
                            <tr>
                                <td>'.X('caption_email','contracting').': '.$accemail.'</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="clear: both;"></div>
                '.$notes.'
            </div>
            <div id="footerContract" class="footerContract left">
                <table>
                    <tbody>
                        <tr style="font-size:12px;">
                            <td class="left"><span class="mob-txt-lime">'.X('contract_footer','mailthanks').' - '.date("Y/m/d").' - '.$token.'</span></td>
                            <td class="right"><span id="pagination">'.X('page_footer','mailthanks').' 1 / 5</span></td>
                        </tr>
                    </tbody>
                </table>
                <div class="accountpic">
                    '.$accman.'
                </div>
            </div>
        </div>

        <div class="page smaller_font">
            <div id="headerContract" class="headerContract">
                <div class="right" style="position:relative;"><span style="position:absolute; right:182px; top:0px;">'.$logoicon.'</span><logo class="mobminder center"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></logo></div>
            </div>
            <div class="content">
                <ol class="nostyle">
                        <h1 class="bold responsabilities" style="font-style: italic;">'.X('contract_section_0','contracting').'</h1>
                    <li><span class="definitions">'.X('def-word_1','contracting').'</span>'.X('def-1','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_2','contracting').'</span>'.X('def-2','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_3','contracting').'</span>'.X('def-3','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_4','contracting').'</span>'.X('def-4','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_5','contracting').'</span>'.X('def-5','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_6','contracting').'</span>'.X('def-6','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_7','contracting').'</span>'.X('def-7','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_8','contracting').'</span>'.X('def-8','contracting').'
                        <ul class="indent-circle">
                            <li>'.X('def-8_1','contracting').'</li>
                            <li>'.X('def-8_2','contracting').'</li>
                            <li>'.X('def-8_3','contracting').'</li>
                            <li>'.X('def-8_4','contracting').'</li>
                        </ul>
                    </li>
                    <li><span class="definitions">'.X('def-word_9','contracting').'</span>'.X('def-9','contracting').'
                        <ul class="indent-circle">
                            <li>'.X('def-9_1','contracting').'</li>
                            <li>'.X('def-9_2','contracting').'</li>
                            <li>'.X('def-9_3','contracting').'</li>
                            <li>'.X('def-9_4','contracting').'</li>
                        </ul>
                    </li>
                    <li><span class="definitions">'.X('def-word_10','contracting').'</span>'.X('def-10','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_11','contracting').'</span>'.X('def-11','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_12','contracting').'</span>'.X('def-12','contracting').'</li>
                    <li><span class="definitions">'.X('def-word_13','contracting').'</span>'.X('def-13','contracting').'</li>
                </ol>
                <ol>
                        <h1 class="bold responsabilities" style="font-style: italic;">'.X('contract_section_1','contracting').'</h1>
                    <li>'.X('contract-clause_1','contracting').'</li>
                    <li>'.X('contract_clause_2','contracting').'</li>
                    <li>'.X('contract_clause_3','contracting').'</li>
                </ol>
            </div>
            <div id="footerContract" class="footerContract left">
                <table>
                    <tbody>
                        <tr style="font-size:12px;">
                            <td class="left"><span class="mob-txt-lime">'.X('contract_footer','mailthanks').' - '.date("Y/m/d").' - '.$token.'</span></td>
                            <td class="right"><span id="pagination">'.X('page_footer','mailthanks').' 2 / 5</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="page smaller_font">
            <div id="headerContract" class="headerContract">
                <div class="right" style="position:relative;"><span style="position:absolute; right:182px; top:0px;">'.$logoicon.'</span><logo class="mobminder center"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></logo></div>
            </div>
            <div class="content">
                <ol start="4" style="margin-top:20px;">
                    <li>'.X('contract_clause_4','contracting').'</li>
                    <li>'.X('contract_clause_5','contracting').'</li>
                    <li>'.X('contract_clause_6','contracting').'</li>
                    <li>'.X('contract_clause_7','contracting').'
                        <ul class="indent-circle">
                            <li>'.X('contract_clause_7_1','contracting').'</li>
                            <li>'.X('contract_clause_7_2','contracting').'</li>
                            <li>'.X('contract_clause_7_3','contracting').'</li>
                        </ul>
                        '.X('contract_clause_7bis','contracting').'
                        <ul class="indent-circle">
                            <li>'.X('contract_clause_7_4','contracting').'</li>
                            <li>'.X('contract_clause_7_5','contracting').'</li>
                            <li>'.X('contract_clause_7_6','contracting').'</li>
                        </ul>
                    </li>
                    <li>'.X('contract_clause_8','contracting').'</li>
                    <li>'.X('contract_clause_9','contracting').'</li>
                    <li>'.X('contract_clause_10','contracting').'</li>
                    <li>'.X('contract_clause_11','contracting').'</li> 	
                    <li>'.X('contract_clause_12','contracting').'</li>
                    <li>'.X('contract_clause_13','contracting').'</li>
                    <li>'.X('contract_clause_14','contracting').'</li>
                </ol>
            </div>
            <div id="footerContract" class="footerContract left">
                <table>
                    <tbody>
                        <tr style="font-size:12px;">
                            <td class="left"><span class="mob-txt-lime">'.X('contract_footer','mailthanks').' - '.date("Y/m/d").' - '.$token.'</span></td>
                            <td class="right"><span id="pagination">'.X('page_footer','mailthanks').' 3 / 5</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="page smaller_font">
            <div id="headerContract" class="headerContract">
                <div class="right" style="position:relative;"><span style="position:absolute; right:182px; top:0px;">'.$logoicon.'</span><logo class="mobminder center"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></logo></div>
            </div>
            <div class="content">
                <ol start="15" style="margin-top:20px;">
                    <li>'.X('contract_clause_15','contracting').'</li>
                    <li>'.X('contract_clause_16','contracting').'</li>
                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_2','contracting').'</h1>
                    <li>'.X('contract_clause_17','contracting').'</li>
                    <li>'.X('contract_clause_18','contracting').'</li>
                    <li>'.X('contract_clause_19','contracting').'</li>
                    <li>'.X('contract_clause_20','contracting').'</li>
                    <li>'.X('contract_clause_21','contracting').'</li> 
                    <li>'.X('contract_clause_22','contracting').'</li>
                    <li>'.X('contract_clause_23','contracting').'</li>
                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_3','contracting').'</h1>
                    <li>'.X('contract_clause_24','contracting').'</li>
                    <li>'.X('contract_clause_25','contracting').'</li>
                    <li>'.X('contract_clause_26','contracting').'</li>
                    <li>'.X('contract_clause_27','contracting').'</li>
                    <li>'.X('contract_clause_28','contracting').'</li>
                </ol>
            </div>
            <div id="footerContract" class="footerContract left">
                <table>
                    <tbody>
                        <tr style="font-size:12px;">
                            <td class="left"><span class="mob-txt-lime">'.X('contract_footer','mailthanks').' - '.date("Y/m/d").' - '.$token.'</span></td>
                            <td class="right"><span id="pagination">'.X('page_footer','mailthanks').' 4 / 5</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="lastpage smaller_font">
            <div id="headerContract" class="headerContract">
                <div class="right" style="position:relative;"><span style="position:absolute; right:182px; top:0px;">'.$logoicon.'</span><logo class="mobminder center"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></logo></div>
            </div>
            <div class="content">
                <ol start="29" style="margin-top:20px;">
                    <li>'.X('contract_clause_29','contracting').'</li>
                    <li>'.X('contract_clause_30','contracting').'</li>
                    <li>'.X('contract_clause_31','contracting').'</li>
                    <li>'.X('contract_clause_32','contracting').'</li>
                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_4','contracting').'</h1>
                    <li>'.X('contract_clause_33','contracting').'</li>
                    <li>'.X('contract_clause_34','contracting').'</li>
                    <li>'.X('contract_clause_35','contracting').'</li>
                        <h1 class="bold" style="font-style: italic;">'.X('contract_section_5','contracting').'</h1>
                    <li>'.X('contract_clause_36','contracting').'</li>
                    <li>'.X('contract_clause_37','contracting').'
                        <ul class="indent-circle">
                            <li>'.X('contract_clause_37_1','contracting').'</li>
                            <li>'.X('contract_clause_37_2','contracting').'</li>
                            <li>'.X('contract_clause_37_3','contracting').'</li>
                        </ul>
                    </li>
                    <li>'.X('contract_clause_38','contracting').'</li>
                </ol>
                <div id="signingContract" style="text-align:right; margin-top:35px; font-size:13px;">
                    <h1>'.X('signature_title','mailthanks').'</h1>
                    <p>'.X('top_header_contractor','contracting').': <span class="field">'.$dS_contract->invContactPersonFirstname.' '.$dS_contract->invContactPersonLastname.'</span></p>
                    <p>'.X('signature_param2','mailthanks').': <span class="field">'.date("Y/m/d").' - '.$dS_contract->placeSigning.'</span></p>
                </div>
            </div>
            <div id="footerContract" class="footerContract left">
                <table>
                    <tbody>
                        <tr style="font-size:12px;">
                            <td class="left"><span class="mob-txt-lime">'.X('contract_footer','mailthanks').' - '.date("Y/m/d").' - '.$token.'</span></td>
                            <td class="right"><span id="pagination">'.X('page_footer','mailthanks').' 5 / 5</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>';

?>


