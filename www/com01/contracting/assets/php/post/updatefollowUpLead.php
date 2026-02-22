<?php
$servername = "localhost";
$username = "mobminder"; // username (zie Hosting)
$password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
$dbname = "contracting";

    $conn = new mysqli($servername, $username, $password, $dbname);

    $sql = 'update leads set followUp = 1;';
    $result = $conn->query($sql);

    if ($conn->query($sql) === TRUE) {
        echo "Encrypted logins";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
?>