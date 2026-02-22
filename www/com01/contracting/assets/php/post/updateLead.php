<?php
    include '../dbio.php';

    $id = @$_POST['id']; if(!isset($id)) die('No ID'); else if(!is_numeric($id)) die('Bad ID');
    $_POST['groupId'] = 1;
    $dS = new C_dS_lead($id,1,$_POST);
    $dS->dSsave();
    echo '<data>';
    echo $dS->stream1(with_tracking);
    echo '</data>';

    if ($_POST['status'] == 2) { /*2 = customer status*/
        $_POST['leadid'] = $id;
        $_POST['wallet'] = $_POST['accountm'];
        $dS_Customer = new C_dS_customer(0,1,$_POST);
        $dS_Customer->dSsave();
        echo $dS_Customer->stream1(with_tracking);
    }
?>