<?php
$servername = "localhost";
$username = "mobminder"; // username (zie Hosting)
$password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
$dbname = "contracting";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = 'update leads set status = 1 where status = "Qualified lead";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$sql = 'update leads set status = 2 where status = "Customer";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set status = 3 where status = "Lost lead";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set status = 4 where status = "Lost customer";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

?>