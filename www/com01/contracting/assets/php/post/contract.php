<?php
    include '../dbio.php';

    $_POST['groupId'] = 1;
    $tstmp = time();
    $token = substr($tstmp,-5);
    $_POST['accessCode'] = $token;
    print_r($_POST);
    $dS = new C_dS_contract(0,1,$_POST);
    print_r($dS);
    $dS->dSsave();
    echo '<data>';
    echo $dS->stream1(with_tracking);
    echo '</data>';
?>