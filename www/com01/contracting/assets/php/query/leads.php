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

    $q = new Q('SELECT id FROM leads WHERE `status` = "'.$type.'" ORDER BY created DESC ;');

    $listIds = $q->ids(list_as_array);

    echo '<data>#C_dS_lead'.$nl;
    foreach ($listIds as &$id) {
        $dS_lead = new C_dS_lead($id);
        echo $dS_lead->stream(with_tracking).$nl;
        /*
        if (count($dS_lead) == 0) {
            echo('Failed:'.$dS_lead->id);
        }
        else {
            
        }*/
    }
    $query = new Q('SELECT id FROM followup;');

    $listFollowUpIds = $query->ids(list_as_array);

    echo '#C_dS_followUp'.$nl;
    foreach ($listFollowUpIds as &$id) {
        $dS_followup = new C_dS_followUp($id);
        echo $dS_followup->stream(no_tracking).$nl;
        /*
        if (count($dS_followup) == 0) {
            echo('Failed:'.$dS_followup->id);
        }
        else {
        }*/
    }

    $query = new Q('SELECT id FROM sector;');

    $listSectorIds = $query->ids(list_as_array);

    echo '#C_dS_sector'.$nl;
    foreach ($listSectorIds as &$id) {
        $dS_sector = new C_dS_sector($id);
        echo $dS_sector->stream(no_tracking).$nl;
        /*
        if (count($dS_sector) == 0) {
            echo('Failed:'.$dS_sector->id);
        }
        else {
        }*/
    }

    $query = new Q('SELECT id FROM source;');

    $listSourceIds = $query->ids(list_as_array);

    echo '#C_dS_source'.$nl;
    foreach ($listSourceIds as &$id) {
        $dS_source = new C_dS_source($id);
        echo $dS_source->stream(no_tracking).$nl;
    }

    $query = new Q('SELECT id FROM users;');

    $listUsersIds = $query->ids(list_as_array);

    echo '#C_dS_users'.$nl;
    foreach ($listUsersIds as &$id) {
        $dS_users = new C_dS_users($id);
        echo $dS_users->stream(no_tracking).$nl;

    }

    echo '#C_dS_language'.$nl;
    $qc = new Q('SELECT id FROM `language` ;');
        
    $listCustomersIds = $qc->ids(list_as_array);

    foreach ($listCustomersIds as &$customerid) {
        $dS_language = new C_dS_language($customerid);
        if (count($dS_language) == 0) {
            echo('Failed:'.$dS_language->id);
        }
        else {
            echo $dS_language->stream(with_tracking).$nl;
        }
    }


    echo '</data>';
}
else {
    // EXECUTE FETCH

    $type = $_POST['type'];

    $ql = new Q('SELECT id FROM leads WHERE `status` = "'.$type.'" AND accountm = "'.$_SESSION['logged'].'" ORDER BY created DESC;');
    
    $listLeadIds = $ql->ids(list_as_array);

    echo '<data>';
    echo '#C_dS_lead'.$nl;
    foreach ($listLeadIds as &$leadid) {
        $dS_lead = new C_dS_lead($leadid);
        if (count($dS_lead) == 0) {
            echo('Failed:'.$dS_lead->id);
        }
        else {
            echo $dS_lead->stream(with_tracking).$nl;
        }
    }

    $query = new Q('SELECT id FROM followup;');

    $listFollowUpIds = $query->ids(list_as_array);

    echo '#C_dS_followUp'.$nl;
    foreach ($listFollowUpIds as &$id) {
        $dS_followup = new C_dS_followUp($id);
        if (count($dS_followup) == 0) {
            echo('Failed:'.$dS_followup->id);
        }
        else {
            echo $dS_followup->stream(no_tracking).$nl;
        }
    }

    $query = new Q('SELECT id FROM sector;');

    $listSectorIds = $query->ids(list_as_array);

    echo '#C_dS_sector'.$nl;
    foreach ($listSectorIds as &$id) {
        $dS_sector = new C_dS_sector($id);
        if (count($dS_sector) == 0) {
            echo('Failed:'.$dS_sector->id);
        }
        else {
            echo $dS_sector->stream(no_tracking).$nl;
        }
    }

    $query = new Q('SELECT id FROM source;');

    $listSourceIds = $query->ids(list_as_array);

    echo '#C_dS_source'.$nl;
    foreach ($listSourceIds as &$id) {
        $dS_source = new C_dS_source($id);
        if (count($dS_source) == 0) {
            echo('Failed:'.$dS_source->id);
        }
        else {
            echo $dS_source->stream(no_tracking).$nl;
        }
    }

    $query = new Q('SELECT id FROM users;');

    $listUsersIds = $query->ids(list_as_array);

    echo '#C_dS_users'.$nl;
    foreach ($listUsersIds as &$id) {
        $dS_users = new C_dS_users($id);
        if (count($dS_users) == 0) {
            echo('Failed:'.$dS_users->id);
        }
        else {
            echo $dS_users->stream(no_tracking).$nl;
        }
    }

    echo '#C_dS_language'.$nl;
    $qc = new Q('SELECT id FROM `language` ;');
        
    $listCustomersIds = $qc->ids(list_as_array);

    foreach ($listCustomersIds as &$customerid) {
        $dS_language = new C_dS_language($customerid);
        if (count($dS_language) == 0) {
            echo('Failed:'.$dS_language->id);
        }
        else {
            echo $dS_language->stream(with_tracking).$nl;
        }
    }

    echo '</data>';
}



?>