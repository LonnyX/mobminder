<?php

include '../dbio.php';

$id = $_POST['id'];

$dS_lead = new C_dS_lead($id);

if (!$dS_lead->id) {
    echo('Failed:'.$dS_lead->id);
}
else {
    // echo('Worked:'.$dS_lead->id.$dS_lead->country);
    echo '<data>';
    echo $dS_lead->stream1(with_tracking);
    echo '</data>';
}

?>