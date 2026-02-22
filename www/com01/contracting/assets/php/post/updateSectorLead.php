<?php
$servername = "localhost";
$username = "mobminder"; // username (zie Hosting)
$password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
$dbname = "contracting";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = 'update leads set sector = 1 where sector = "Medical";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$sql = 'update leads set sector = 2 where sector = "Liberal";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set sector = 3 where sector = "Medical group";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set sector = 4 where sector = "Dentist";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set sector = 5 where sector = "Industry";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set sector = 6 where sector = "Wellness";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = 'update leads set sector = 2 where sector = "Freelance";';
$result = $conn->query($sql);

if ($conn->query($sql) === TRUE) {
    echo "Encrypted logins";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

?>