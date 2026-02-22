<?php
$servername = "localhost";
$username = "matt"; // username (zie Hosting)
$password = "matt2023"; // paswoord DATABANK (zie hosting)
$dbname = "newmobcom";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = 'SELECT COUNT(*) as "Pascal" FROM `leads`';

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($value = $result->fetch_assoc()) {
        foreach ($value as $key => $var) {
            echo $var;
        }
    }
    echo $value;
} else {
    echo("!#0#!");
}

?>