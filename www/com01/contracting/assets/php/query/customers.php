<?php

include '../dbio.php';

session_start();
if (!$_SESSION['logged']) {
    die('Sorry');
}

$loginQ = new Q('SELECT accesslevel FROM users WHERE id = '.$_SESSION['logged'].''); 
$accesslevel = $loginQ->one('accesslevel');

if ($accesslevel == 99) {
    // EXECUTE FETCH

    $type = $_POST['type'];

    $getCustomerIds = new Q('SELECT id FROM leads WHERE `status` = '.$type.' ;');

    $customerLeadsIds = $getCustomerIds->ids(list_as_array);
    echo '<data>';
    echo '#C_dS_customer'.$nl;
    foreach ($customerLeadsIds as &$leadid) {
        $qc = new Q('SELECT id FROM customers WHERE leadid = '.$leadid.' ;');
    
        $listCustomersIds = $qc->ids(list_as_array);

        foreach ($listCustomersIds as &$customerid) {
            $dS_customer = new C_dS_customer($customerid);
            echo $dS_customer->stream(with_tracking).$nl;
        }
    }

    echo '#C_dS_lead'.$nl;
    foreach ($customerLeadsIds as &$id) {
        $dS_lead = new C_dS_lead($id);
        echo $dS_lead->stream(with_tracking).$nl;
    }

    $query = new Q('SELECT id FROM users;');

    $listUsersIds = $query->ids(list_as_array);

    echo '#C_dS_users'.$nl;
    foreach ($listUsersIds as &$id) {
        $dS_users = new C_dS_users($id);
        echo $dS_users->stream(no_tracking).$nl;
    }

    $query = new Q('SELECT id FROM sector;');

    $listSectorIds = $query->ids(list_as_array);

    echo '#C_dS_sector'.$nl;
    foreach ($listSectorIds as &$id) {
        $dS_sector = new C_dS_sector($id);
        echo $dS_sector->stream(no_tracking).$nl;
    }

    $query = new Q('SELECT id FROM contracts;');

    $contractIds = $query->ids(list_as_array);
    echo '#C_dS_contract'.$nl;
    foreach ($contractIds as &$id) {
        $dS_lead = new C_dS_contract($id);
        echo $dS_lead->stream(with_tracking).$nl;
    }

    echo '#C_dS_language'.$nl;
    $qc = new Q('SELECT id FROM `language` ;');
        
    $listCustomersIds = $qc->ids(list_as_array);

    foreach ($listCustomersIds as &$customerid) {
        $dS_language = new C_dS_language($customerid);
        echo $dS_language->stream(with_tracking).$nl;
    }

    echo '</data>';
}
else {
    // EXECUTE FETCH
    // Customers données manquantes → Avec code actuel montre que ceux qui sont complétés (vu que besoin de la table lead pour savoir lesquels sont lost customers ou customers)
    // Quand fetch toutes les données le tableau montre une donnée inexistante dans la DB
    $type = $_POST['type'];

    $getCustomerIds = new Q('SELECT id FROM leads WHERE `status` = '.$type.' AND accountm = '.$_SESSION['logged'].';');

    $customerLeadsIds = $getCustomerIds->ids(list_as_array);
    echo '<data>';
    echo '#C_dS_customer'.$nl;
    foreach ($customerLeadsIds as &$leadid) {
        $qc = new Q('SELECT id FROM customers WHERE wallet = '.$_SESSION['logged'].' AND leadid = '.$leadid.' ;');
    
        $listCustomersIds = $qc->ids(list_as_array);

        foreach ($listCustomersIds as &$customerid) {
            $dS_customer = new C_dS_customer($customerid);
            echo $dS_customer->stream(with_tracking).$nl;
        }
    }

    echo '#C_dS_lead'.$nl;
    foreach ($customerLeadsIds as &$id) {
        $dS_lead = new C_dS_lead($id);
        echo $dS_lead->stream(with_tracking).$nl;
    }

    $query = new Q('SELECT id FROM users;');

    $listUsersIds = $query->ids(list_as_array);

    echo '#C_dS_users'.$nl;
    foreach ($listUsersIds as &$id) {
        $dS_users = new C_dS_users($id);
        echo $dS_users->stream(no_tracking).$nl;
    }

    $query = new Q('SELECT id FROM sector;');

    $listSectorIds = $query->ids(list_as_array);

    echo '#C_dS_sector'.$nl;
    foreach ($listSectorIds as &$id) {
        $dS_sector = new C_dS_sector($id);
        echo $dS_sector->stream(no_tracking).$nl;
    }

    $query = new Q('SELECT id FROM contracts;');

    $contractIds = $query->ids(list_as_array);
    echo '#C_dS_contract'.$nl;
    foreach ($contractIds as &$id) {
        $dS_lead = new C_dS_contract($id);
        echo $dS_lead->stream(with_tracking).$nl;
    }

    echo '#C_dS_language'.$nl;
    $qc = new Q('SELECT id FROM `language` ;');
        
    $listCustomersIds = $qc->ids(list_as_array);

    foreach ($listCustomersIds as &$customerid) {
        $dS_language = new C_dS_language($customerid);
        echo $dS_language->stream(with_tracking).$nl;
    }

    echo '</data>';
}

?>