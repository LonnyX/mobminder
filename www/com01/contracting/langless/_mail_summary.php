<?php


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 M A I L     S U M M A R Y
//
//   Is using all variables defined in mail_thanks.php + new defined variables here
//
//
//

$customercompany = $dS_contract->invCompanyName;
$customercompanyNumber =$dS_contract->invCompanyNumber;
$customerid = $dS_contract->clientNr;
$contmobile = $dS_contract->invMobile;
$contemail = $dS_contract->invEmail;
$contadress = $dS_contract->invAddress;
$contzip = $dS_contract->invCP;
$contcity = $dS_contract->invCity;
$contcountry = $dS_contract->invCountry;
$contvat = $dS_contract->TVA;
$contiban = $dS_contract->IBAN;
$contibic = $dS_contract->BIC;
$contaccountingyear = $dS_contract->beginAccountingYear;
$contpackage = $dS_contract->monthlyPackage;
$contsms = $dS_contract->smsPackage;


/////// Main communication body 
//


// Top border with logo
//

$l='en'; //In order to have all translations in english, like courtesy
$subject ='Contract '.$customercompany.' '.$lname.' '.$fname.' '.$customerid.'';

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="100%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$moblogo.'</div>
	</td>
</tr>
</table>';

// Introduction
//

$t1= '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="color:'.$txtcolormail.'; margin-block-start:0.5em; margin-block-end:1em;">
            Congrats! Your client '.X($tncourtesy,'mailinvite').' '.$lname.' '.$fname.' has just signed a contract.<br>Before forwarding to accountancy, please check and complete the details.  		
        </p>
	</td>
</tr>
</table>';

$t2 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; margin-block-start:1em; margin-block-end: 0.5em;">
    Contract\'s note
    </p>
        <ul style="padding-left:0.5em; margin-block-start:0.5em; color:'.$txtcolormail.'; list-style-type: none;">
        <li>'.$notes.'</li>       
		</ul>	
	</td>
</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; margin-block-start:0.5em; margin-block-end:0.5em;">
    Account
    </p>
        <ul style="padding-left:0.5em; margin-block-start:0.5em; color:'.$txtcolormail.'; list-style-type: none;">
			<li>Customer number: '.$customerid.'</li>
			<li>Wallet: '.$accfirstname.'</li>
            <li>Account name: ... </li>
			<li>Tag color: ... </li>
		</ul>	
	</td>			
</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; margin-block-start:0.5em; margin-block-end:0.5em;">
    Contact person
    </p>
        <ul style="padding-left:0.5em; margin-block-start:0.5em; color:'.$txtcolormail.'; list-style-type: none;">
        <li>Name: '.$lname.'</li>
        <li>First name: '.$fname.'</li>
        <li>Civility: '.X($tncourtesy,'mailinvite').'</li>
        <li>Mobile: '.$contmobile.'</li>		
        <li>Email: '.$contemail.'</li>
		</ul>
	</td>			
</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; margin-block-start:0.5em; margin-block-end:0.5em;">
    Invoicing
    </p>
        <ul style="padding-left:0.5em; margin-block-start:0.5em; color:'.$txtcolormail.'; list-style-type: none;">
        <li>Legal form: '.X($legalformTn,'contracting').'</li>
        <li>Company: '.$customercompany.'</li>
        <li>Company number: '.$customercompanyNumber.'</li>
        <li>Address: '.$contadress.'</li>
        <li>Zipcode: '.$contzip.'</li>
		<li>City: '.$contcity.'</li>
		<li>Country: '.$contcountry.'</li>
        <li>VAT: '.$contvat.'</li>
		<li>IBAN: '.$contiban.'</li>
		<li>BIC: '.$contibic.'</li>
		<li>Accounting year: '.$contaccountingyear.'</li>
		</ul>	
	</td>

</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; margin-block-start:0.5em; margin-block-end:0.5em;">
    Contract
    </p>
        <ul style="padding-left:0.5em; margin-block-start:0.5em; color:'.$txtcolormail.'; list-style-type: none;">
        <li>Payement plan: '.$check_payplan.'</li>
        <li>Price (Excl. VAT) : '.$contpackage.'</li>
		<li>Package SMS: '.$contsms.'</li>
        <li>Contract anniversary: '.$birthdayContract.' '.$convertedDate.'</li>
		<li>Signature date: '.date("Y/m/d").'</li>
		<li>Place of signature: '.$dS_contract->placeSigning.'</li>        
		</ul>	
	</td>

</tr>


</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t2.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


// Send sumup mail with contract to the adequate account manager 

// $addressee ='jonathan@mobminder.com';
$addressee = $accemail;
$html = $center;
$mail = new C_b64_email($accemail, $subject, $html, true, $bgcolormail);
$mail->addAttachedStream($fileatt,'mobminder-agreement');
$mail->sendMail($addressee);


?>