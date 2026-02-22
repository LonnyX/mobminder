<?php
    include '../dbio.php';

    // check lead contracting code

    // Session started to save session variables
    session_start();
    $servername = "localhost";
    $username = "mobminder"; // username (zie Hosting)
    $password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
    $dbname = "contracting";

    //Control if given username and password are correct in the database
    sleep(1);

    // leadid & accesscode
    $lid = $_POST['id']; // which is a lead id
    $c = $_POST['code']; 

    //connect to database
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Control to know if the input fields are empty
    if(!$lid) echo("!#0#!er001");
    if(!is_numeric($lid)) echo("!#0#!er002");
    if(!$c) echo("!#0#!er003");
    if(!is_numeric($c)) echo("!#0#!er004");
    
    $dS_lead = new C_dS_lead($lid); if(!$dS_lead->id) echo("!#0#!er005");
    $amid = $dS_lead->accountm;
    $dS_am = new C_dS_users($amid);

    // zip given credentials to control if corresponding to credentials in the database
    $q = 'SELECT id as cid FROM `contracts` WHERE leadid = '.$lid.' AND accessCode = '.$c.' order by created desc limit 1;';
    $result = $conn->query($q);

    // control of credentials
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $cid = $row['cid']; // contract id
            echo $cid;
            $ds_contract = new C_dS_contract($cid);
            
            $query = new Q('SELECT id FROM users;');
            $listUsersIds = $query->ids(list_as_array);
        
            echo '<data>';
            echo $dS_lead->stream1(with_tracking).$nl;
            echo $ds_contract->stream1(with_tracking).$nl;

                $dS_am->username = '';
                $dS_am->password = '';
                $dS_am->taycan = '';
            echo $dS_am->stream1(with_tracking).$nl;
            /*
            echo '#C_dS_users'.$nl;
            foreach ($listUsersIds as &$uid) {
                $dS_users = new C_dS_users($uid);
                $dS_users->username = '';
                $dS_users->password = '';
                $dS_users->taycan = '';
                echo $dS_users->stream(no_tracking).$nl;
            }
            */
            echo '</data>';
            $_SESSION['logged_lead'] = $lid; /*ids*/
            $_SESSION['logged_contract'] = $cid; /*ids*/
        }
    }
    else{
        echo("!#0#!");
    }


    // ENCRYPT ACCESSCODE AND ID
    // $sql = 'SELECT * FROM `contracts`';
    // $result = $conn->query($sql);
    
    // if ($result->num_rows > 0) {
    //     while($row = $result->fetch_assoc()){
    //         $id = $row['id'];
    //         $c = $row['accessCode'];
    //         $z = base64_encode(gzcompress($id.$c, 4)); // see (*lp01*)
    //         $b = gzuncompress(base64_decode($z));
    
    //         $q = 'update contracts set token = "'.$z.'" where id = '.$id.';';
    
    //         if ($conn->query($q) === TRUE) {
    //             echo "Encrypted logins";
    //         } else {
    //             echo "Error: " . $sql . "<br>" . $conn->error;
    //         }
    //         //'update logins set taycan = "'.$z.'" where id = '.$id.';'
    //     }
    // } else {
    //     echo("frietjes !#0#!  LOGGED IN");
    // }
?>