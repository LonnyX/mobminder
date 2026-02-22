<?php

$servername = "localhost";
$username = "mobminder"; // username (zie Hosting)
$password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
$dbname = "contracting";

$conn = new mysqli($servername, $username, $password, $dbname);

$q = 'SELECT * FROM `leads` ORDER BY id DESC;';

$result = $conn->query($q);
$json_array = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
        $json_array[]=$row;
        print_r($row) ;
    }
}

echo json_encode($json_array);
?>