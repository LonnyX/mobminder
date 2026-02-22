<?php
    include '../dbio.php';

    $leadid = $_POST['leadid'];
    $today = $_POST['dateSigned'];

    echo $leadid;
    $dS = new C_dS_customer(0,1,$_POST);
    $dS->dSsave();

    $_POST['status'] = 2;
    $dS_lead = new C_dS_lead($leadid,1,$_POST);
    $dS_lead->dSsave();
    echo '<data>';
    echo $dS->stream1(with_tracking);
    echo '</data>';
?>