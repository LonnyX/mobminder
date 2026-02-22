<?php
    include '../dbio.php';

    $q = new Q('SELECT id FROM followup;');

    $listIds = $q->ids(list_as_array);

    // print_r($listIds);
    // echo count($listIds);

    echo '<data>#C_dS_followUp'.$nl;
    foreach ($listIds as &$id) {
        $dS_followup = new C_dS_followUp($id);
        if (count($dS_followup) == 0) {
            echo('Failed:'.$dS_followup->id);
        }
        else {
            echo $dS_followup->stream(no_tracking).$nl;
        }
    }
    echo '</data>';
?>