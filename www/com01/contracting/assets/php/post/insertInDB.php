<?php
// $servername = "localhost";
// $username = "matt"; // username (zie Hosting)
// $password = "matt2023"; // paswoord DATABANK (zie hosting)
// $dbname = "newmobcom";

// $accountm = "Giraud";
// $creationDate = "16/02/2023";
// $status = $_POST['status'];
// $fn = $_POST['firstname'];
// $ln = $_POST['lastname'];
// $phoneNr = $_POST['phoneNr'];
// $email = $_POST['email'];
// $companyname = $_POST['companyname'];
// $work = $_POST['work'];
// $country = $_POST['country'];
// $city = $_POST['city'];
// $address = $_POST['address'];
// $source = "Web";
// $sourceD = "SEO";
// $followUp = "Qualified Lead";



// $conn = mysqli_connect($servername, $username, $password, $dbname) or die(mysqli_connect_error());


// $sql = 'INSERT INTO `leads`(`accountm`, `creationDate`, `modificationDate`, `firstname`, `lastname`, `phoneNr`, `email`, `country`, `city`, `address`, `companyname`, `sector`, `work`, `status`, `source`, `sourcedetails`, `notes`, `followup`) VALUES ("'.$accountm.'", "'.$creationDate.'", "'.$creationDate.'", "'.$fn.'", "'.$ln.'","'.$phoneNr.'", "'.$email.'", "'.$country.'", "'.$city.'", "'.$address.'", "'.$companyname.'", "Madical", "'.$work.'","Customer","'.$source.'","'.$sourceD.'","value-18","'.$followUp.'")';
 

// if ($conn->query($sql) === TRUE) {
//   echo "New record created successfully";
// } else {
//   echo "Error: " . $sql . "<br>" . $conn->error;
// }

echo 'Response from insert DB';
?>