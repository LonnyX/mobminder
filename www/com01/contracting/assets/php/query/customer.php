<?php

include '../dbio.php';

$id = $_POST['id'];

$dS_customer = new C_dS_customer($id);

if (!$dS_customer->id) {
    echo('Failed:'.$dS_customer->id);
}
else {
    // echo('Worked:'.$dS_lead->id.$dS_lead->country);
    echo '<data>';
    echo $dS_customer->stream1(with_tracking);
    echo '</data>';
}

?>