<?php
session_start();
$servername = "localhost";
$username = "mobminder"; // username (zie Hosting)
$password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
$dbname = "contracting";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = 'update leads set accountm = 1 where accountm = "Jonathan";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set accountm = 3 where accountm = "Florian";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set accountm = 4 where accountm = "Giraud";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set accountm = 5 where accountm = "Keevin";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set accountm = 6 where accountm = "Kamal";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

?>