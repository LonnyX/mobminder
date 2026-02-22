<!doctype html>
<html translate="no">

<head>

<title><?= X('pageTitle') ?></title>
	
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache" />
<meta name="robots" content="noindex">
<meta name="googlebot" content="noindex">


<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="date=no">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


<link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	


<link rel="stylesheet" href="../assets/css/fonts.css">
<link rel="stylesheet" href="../assets/css/faws.css">
<link rel="stylesheet" href="../assets/css/generics.css">
<link rel="stylesheet" href="../assets/css/oups.css">

<script src="../assets/js/jquery-3.2.1.js"></script>
<script src="../assets/js/moblib.js"></script>

<script src="../assets/js/waves.js"></script>
<script src="../assets/js/xlate.js"></script>



<script>

    // (*pvh01*) chrono events
    
    var pageready = 0, stepduration = 300;
    $(document).ready( function() { pageready = 1; } );
    
    
    var s = 0;
    (function unfold() {
        let fc = 's'+s;
        $('body').find('.unfold'+'.'+fc).each( 
            function() {  $(this).addClass('do-unfold'); } 
        );
        if(s<32) setTimeout(unfold,stepduration); // recurse only 10 times
        if(pageready) s++;
    })();
    
    
    // (*pvh01*) in viewport events

    // listen for scroll event
    document.addEventListener('scroll', trackviewport);
    
    function inviewport(e) { // checks if element is in viewport
        // get window height
        var windowHeight = window.innerHeight;
        // get number of pixels that the document is scrolled
        var scrollY = window.scrollY || window.pageYOffset;

        // get current scroll position (distance from the top of the page to the bottom of the current viewport)
        var scrollPosition = scrollY + windowHeight;
        // get element position (distance from the top of the page to the bottom of the element)
            let eH = e.clientHeight;
        var elementPosition = e.getBoundingClientRect().top + scrollY + eH + 50; /* we want the item to be 50px higher than bottom line */

        // is scroll position greater than element position? (is element in view?)
        return scrollPosition > elementPosition;
    }
    function delayedunfold(e) { $(e).addClass('do-unfold');	setTimeout(cleanup,3000,e); }
    function trackviewport() {
        var cycle = 0;
        $('body').find('.unfold.invp').each(  // hooks up only on elements that are meant to unfold when in viewport
            function() { 
                if(inviewport(this)) {
                    $(this).removeClass('invp'); // makes it happen only once for each 
                    setTimeout(delayedunfold,100+cycle,this); /* we let the item appear with a delay */
                }
                cycle += 200;
            } 
        );
    }
    function cleanup(e) { /* this is necessary to let the h1.mobul class take effect */
        $(e).removeClass('from-left').removeClass('from-top').removeClass('from-right').removeClass('from-bottom').removeClass('from-center');
        $(e).removeClass('roll-left').removeClass('roll-top').removeClass('roll-right').removeClass('roll-bottom').removeClass('roll-horizon');
        $(e).removeClass('v-flip').removeClass('h-flip');
        $(e).removeClass('do-unfold').removeClass('unfold');
    }
    
    // frame reference for background animations
    //
    var aframe = 0;
    var aframe_do = false;
    (function frame() {
        aframe++;
        aframe_do = (aframe%3)==0;
        requestAnimationFrame(frame);
    })();
		
</script>

	
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
        <nav class="list l-right">
            <ul>
                <li><a class="mob-txt-gray_d" href="../fr/<?= $filename ?>">Français</a></li>
                <li><a class="mob-txt-gray_d" href="../en/<?= $filename ?>">English</a></li>
                <li><a class="mob-txt-gray_d" href="../nl/<?= $filename ?>">Nederlands</a></li>

            </ul>
        </nav>
        <label for="lang-toggle" class="toggle-label lang-toggle-label">
            <span class="mob-txt-lime"><?=$l?></span>
            <i class="fa fa-globe fa-1d5x mob-txt-lime"></i>
        </label>
    </div>

</header> <!-- section top-menu -->


			<!--    M A I N T E N A N C E    P A G E   -->
			
<section id="maintenance" class="maintenance">  
    <div class="shade"></div>
    <div class="message-box wide">
        <h1 class="mob-txt-gray_m centered airup air"><?= X('breakdown_title') ?></h1>
        <p class="mob-txt-gray_d centered air"><?= X('breakdown_text') ?></p>
        <div class="zoom">
            <a href="https://www.mobminder.com" rel="noopener nofollow">
                <h1 class="bold mobminder centered">
                    <img src="../assets/imgs/icon-1.png" alt="mobminder logo"/>&nbsp;<span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span>
                </h1>
            </a>
        </div>
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
</body>

</html>