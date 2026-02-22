<?php
    include '../dbio.php';
    
    $dS = new C_dS_lead(0,false,$_POST);
    $dS->dSsave();
    echo '<data>';
    echo $dS->stream1(with_tracking);
    echo '</data>';
?>