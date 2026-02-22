<?php
// PHP query that controls if the credentials that user gave are corresponding to those of the database

// Session started to save session variables
session_start();
$servername = "localhost";
$username = "mobminder"; // username (zie Hosting)
$password = "tgx23PiQ"; // paswoord DATABANK (zie hosting)
$dbname = "contracting";

//Control if given username and password are correct in the database
sleep(1);

// credentials the user gave
$un = $_POST['username'];
$pw = $_POST['password'];

// die ('hello');

//connect to database
$conn = new mysqli($servername, $username, $password, $dbname);

// Control to know if the input fields are empty
if(!$un){
    echo("!#0#!");
}   
if(!$pw) {
    echo("!#0#!");
}

// zip given credentials to control if corresponding to credentials in the database
$z = base64_encode(gzcompress($un.$pw, 4)); // see (*lp01*)
$q = 'SELECT id, accesslevel FROM `users` WHERE taycan="'.$z.'" limit 1;';
$result = $conn->query($q);

// control of credentials
if($result->num_rows > 0){
    echo('!#1#!');
    while($row = $result->fetch_assoc()){
        $_SESSION['logged'] = $row['id'];
    }
}
else{
    echo("!#0#!");
}


// Code to update Database fields:
// This code zips the username and password in one encrypted zip,
// to prevent sql input in the login field of working

// $sql = 'SELECT * FROM `users`';
// $result = $conn->query($sql);

// if ($result->num_rows > 0) {
//     while($row = $result->fetch_assoc()){
//         $id = $row['id'];
//         $l = $row['username'];
//         $p = $row['password'];
//         $z = base64_encode(gzcompress($l.$p, 4)); // see (*lp01*)
//         $b = gzuncompress(base64_decode($z));

//         $q = 'update users set taycan = "'.$z.'" where id = '.$id.';';

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