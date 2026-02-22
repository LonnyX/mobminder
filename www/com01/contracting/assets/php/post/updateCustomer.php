<?php
    include '../dbio.php';

    $id = @$_POST['id']; if(!isset($id)) die('No ID'); else if(!is_numeric($id)) die('Bad ID');
    
    $_POST['groupId'] = 1;
    $dS = new C_dS_customer($id,false,$_POST);
    
    $_POST['leadid'] = $dS->leadid;

    $leadid = $dS->leadid;
    $lead_dS = new C_dS_lead($leadid,false,$_POST);
    $lead_dS->dSsave();


    $contractId = $dS->contractId;
    $contract_dS = new C_dS_contract($contractId,false,$_POST);
    $contract_dS->dSsave();
    echo $contractId;

    $_POST['contractId'] = $contract_dS->id;

    $dS = new C_dS_customer($id,false,$_POST);
    $dS->dSsave();


    echo '<data>';
    echo $dS->stream1(with_tracking).$nl;
    echo $lead_dS->stream1(with_tracking).$nl;
    echo $contract_dS->stream1(with_tracking).$nl;
    echo '</data>';
?>