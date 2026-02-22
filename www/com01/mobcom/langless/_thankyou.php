<!doctype html>
<html translate="no">

<head>
	<title>Thank you!</title>
    <meta name="robots" content="noindex">
    <meta name="googlebot" content="noindex">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/thankyou.css">
	<script src="../assets/js/sponsor-contact.js"></script>  <!--    New js with fonction that treat MSG as an optional field    -->
</head>

<body>  

            <!--    L A N G    C H A N G E S     -->

<header id="stickymenu">

<?php

$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$icount = count($subfolders);
$filename = $subfolders[$icount-1];
?>

    <div>
        <input type="checkbox" id="lang-toggle" class="checkbox_toggle"> 
        <nav class="list l-right bg-grey-gradient">
            <ul>
                <li><a class="mob-txt-gray_d" href="../fr/<?= $filename ?>">Français</a></li>
                <li><a class="mob-txt-gray_d" href="../en/<?= $filename ?>">English</a></li>
                <li><a class="mob-txt-gray_d" href="../nl/<?= $filename ?>">Nederlands</a></li>

            </ul>
        </nav>
        <label for="lang-toggle" class="toggle-label lang-toggle-label airup">
            <span class="mob-txt-lime"><?=$l?></span>
            <i class="fa fa-globe fa-1d5x mob-txt-lime"></i>
        </label>
    </div>

</header> <!-- section top-menu -->

				<!--    M A I N T E N A N C E    P A G E   -->
			
<section id="maintenance" class="maintenance">  
    <div class="shade"></div>
    <div class="message-box wide">
        <h1 class="mob-txt-gray_m centered airup air"><?= X('thanks_title') ?></h1>
        <p class="mob-txt-gray_d left air"><?= X('thanks_text') ?></p>
		<div style="display:grid; place-items:center; margin:20px 0;"><a id="form_btn1" class="cta2-button mob-txt-gray_d shrink" href="./index.php" rel="noopener nofollow"><i class="mob-txt-lime fa fa-bullseye-pointer"></i><span class="centered">&nbsp;&nbsp;&nbsp;<?= X('thanks_btn_caption') ?></span></a></div>
    </div>

    <script type="text/javascript">
	
        var clouds = document.querySelector("#maintenance"); // let the clouds flow
        (function wind() {
            let d = (aframe)/16;
            if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px top 5em"; // (*cp01*)
            requestAnimationFrame(wind);
        })();

    </script>

</section>

<?php include('cookies.php')?>

</body>

</html>