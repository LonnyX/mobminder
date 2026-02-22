<?php
    include '../dbio.php';
    $id = $_POST['id'];

    $dS_lead = new C_dS_lead($id);
    $amid = $dS_lead->accountm;
    $dS_am = new C_dS_users($amid);
    
    if (!$dS_lead->id) {
        echo('Failed:'.$dS_lead->id);
    }
    else {
        echo '<data>';
        echo $dS_lead->stream1(with_tracking).$nl;
            $dS_am->username = '';
            $dS_am->password = '';
            $dS_am->taycan = '';
        echo $dS_am->stream1(with_tracking).$nl;
        echo '</data>';                    
    }
?>