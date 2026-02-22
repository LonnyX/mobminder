<!DOCTYPE html>
<?php
    // Control if person is logged in, to redirect to login page if not logged in
    session_start();
    if (!$_SESSION['logged']) {
        header('Location: '.'../index.php');
        die();
    }
?>
<html lang="en">
<head>
    <meta charset='UTF-8'>
    <meta http-equiv='X-UA-Compatible" content="IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Home CRM</title>

    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../assets/css/crm.css">
    <link rel="stylesheet" href="../assets/css/faws.css">
    <link rel="stylesheet" href="../assets/css/generics.css">
    <link rel="stylesheet" href="../assets/css/bootstrap.css">


    <link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	

    <script src="../assets/js/jquery-3.2.1.js"></script>
    <script src="../assets/js/jquery.rightClick.js"></script>
    <script src="../assets/js/mobframe.js"></script>
    <script src="../assets/js/homeScreen.js"></script>
</head>
<body style="min-height:100vh; position:relative;">
    <div id="backgroundHomePage" class="backgroundHomePage">
        <div id="homePageContainer" class="airup">
            <?php                     
                $servername = "localhost";
                $username = "mobminder";
                $password = "tgx23PiQ";
                $dbname = "contracting";

                $conn = new mysqli($servername, $username, $password, $dbname);

                $connection = mysqli_connect($servername, $username, $password, $dbname) or die(mysqli_connect_error());

                $sql = 'SELECT id, firstname, lastname FROM `users` WHERE `id` = "'.$_SESSION['logged'].'"';
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // output data of each row
                    while($row = $result->fetch_assoc()) {
                        echo '<h1 class="accountManagerName centered mob-txt-gray_l airup air">Hello '.$row['firstname'].', what do you want to see? :)</h1>';
                    }
                } else {
                    echo "0 results";
            }?>
          </div>

        

            <div id="buttonContainter" class="buttonContainter airplus">
                <div class="row">
                    <div id="leadTableBtnContainer" class="flexinner col-xs-12 col-sm-12 col-lg-4 col-xl-4"></div>
                    <div id="customerTableBtnContainer" class="flexinner col-xs-12 col-sm-12 col-lg-4 col-xl-4"></div>
                    <div id="dashboardBtnContainer" class="flexinner col-xs-12 col-sm-12 col-lg-4 col-xl-4"></div>
                </div>
            </div>

        <script>
            // Get the buttons for the home screen
            let hs = new C_iHomeScreen('buttonContainter', {
                target: $('#buttonContainter')
            })
            hs.display();
            hs.activate();
        </script>
    </div>
</body>
</html>