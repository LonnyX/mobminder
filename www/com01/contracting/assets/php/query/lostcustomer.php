<?php

include '../dbio.php';

// Que faire avec les customers? Les clients sont dans les leads table (vu que tous doivent rester), mais je les ajoute quand même dans la customer table comme si c'était encore des clients?

$id = $_POST['id'];

$dS_lostCustomer = new C_dS_customer($id);

if (!$dS_lostCustomer->id) {
    echo('Failed:'.$dS_lostCustomer->id);
}
else {
    // echo('Worked:'.$dS_lead->id.$dS_lead->country);
    echo '<data>';
    echo $dS_lostCustomer->stream1(with_tracking);
    echo '</data>';
}

?>