<?php
    include '../dbio.php';

    $logged = $_POST['loggedPerson'];

    if ($logged == 0) {
        $accesslevel = 99;
    }
    else {
        $loginQ = new Q('SELECT accesslevel FROM users WHERE id = '.$logged.''); 
        $accesslevel = $loginQ->one('accesslevel');
    }

    if ($accesslevel == 99) {
        $servername = "localhost";
        $username = "mobminder"; // username (zie Hosting)
        $password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
        $dbname = "contracting";

        $conn = new mysqli($servername, $username, $password, $dbname);

        $q = new Q('SELECT id FROM leads;');

        $listIds = $q->ids(list_as_array);

        echo '<leads>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</leads>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 1 ;');

        $listIds = $q->ids(list_as_array);

        echo '<sectorLeads>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</sectorLeads>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 2 ;');

        $listIds = $q->ids(list_as_array);

        echo '<sectorCustomers>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</sectorCustomers>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 3 ;');

        $listIds = $q->ids(list_as_array);

        echo '<lostLeads>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</lostLeads>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 4 ;');

        $listIds = $q->ids(list_as_array);

        echo '<lostCustomers>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</lostCustomers>';    

        $q = new Q('SELECT id FROM customers;');

        $listIds = $q->ids(list_as_array);

        echo '<customers>#C_dS_customer'.$nl;
        foreach ($listIds as &$id) {
            $dS_customer = new C_dS_customer($id);
            if (count($dS_customer) == 0) {
                echo('Failed:'.$dS_customer->id);
            }
            else {
                echo $dS_customer->stream(with_tracking).$nl;
            }
        }
        echo '</customers>';
    }
    else{
        $servername = "localhost";
        $username = "mobminder"; // username (zie Hosting)
        $password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
        $dbname = "contracting";

        $conn = new mysqli($servername, $username, $password, $dbname);

        $q = new Q('SELECT id FROM leads WHERE accountm = '.$logged.';');

        $listIds = $q->ids(list_as_array);

        echo '<leads>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</leads>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 1 AND accountm = '.$logged.';');

        $listIds = $q->ids(list_as_array);

        echo '<sectorLeads>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</sectorLeads>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 2 AND accountm = '.$logged.';');

        $listIds = $q->ids(list_as_array);

        echo '<sectorCustomers>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</sectorCustomers>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 3 AND accountm = '.$logged.' ;');

        $listIds = $q->ids(list_as_array);

        echo '<lostLeads>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</lostLeads>';

        $q = new Q('SELECT id FROM leads WHERE `status` = 4 AND accountm = '.$logged.';');

        $listIds = $q->ids(list_as_array);

        echo '<lostCustomers>#C_dS_lead'.$nl;
        foreach ($listIds as &$id) {
            $dS_lead = new C_dS_lead($id);
            if (count($dS_lead) == 0) {
                echo('Failed:'.$dS_lead->id);
            }
            else {
                echo $dS_lead->stream(with_tracking).$nl;
            }
        }
        echo '</lostCustomers>';   
        
        $q = new Q('SELECT id FROM customers where wallet = '.$logged.';');

        $listIds = $q->ids(list_as_array);

        echo '<customers>#C_dS_customer'.$nl;
        foreach ($listIds as &$id) {
            $dS_customer = new C_dS_customer($id);
            if (count($dS_customer) == 0) {
                echo('Failed:'.$dS_customer->id);
            }
            else {
                echo $dS_customer->stream(with_tracking).$nl;
            }
        }
        echo '</customers>';
    }
?>