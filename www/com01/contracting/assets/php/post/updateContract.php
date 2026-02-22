<?php
    include '../dbio.php';

    $id = @$_POST['id']; if(!isset($id)) die('No ID'); else if(!is_numeric($id)) die('Bad ID');

    $_POST['groupId'] = 1;
    print_r($_POST);
    $dS = new C_dS_contract($id,1,$_POST);
    print_r($dS);
    $dS->dSsave();
    echo '<data>';
    echo $dS->stream1(with_tracking);
    echo '</data>';
?>