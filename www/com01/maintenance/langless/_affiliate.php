<!doctype html>
<html>

<head>
	
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
<link rel="stylesheet" href="../assets/css/affiliate.css">
<link rel="stylesheet" href="../assets/css/bootstrap.css">



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


			<!--    S P O N S O R S H I P    P A G E   -->
			
<section id="sponsorship" class="sponsorship">  
    <div id="message-box" class="message-box wide">
        <div style="text-align:right;">
                <a id="sponsorship_no"><span class="mob-txt-gray_m" style="font-size:0.8em; vertical-align:text-top;"><?= X('promo_btn3') ?></span><i class="mob-txt-gray_m fa fa-times"></i></a>
        </div>
        <div class="row">
            <div class="flexinner col-sm-12 col-md-9 col-lg-9 col-xl-9">
                <div class="message">
                    <h2 class="mob-txt-gray_m air"><?= X('breakdown_title') ?></h2>
                    <p class="mob-txt-gray_d air"><?= X('breakdown_text') ?></p>
                    <p class="mob-txt-gray_d right"><?= X('signature') ?></p>
                    <div class="airupplus">
                        <a id="sponsorship_yes" href="../../mobcom/<?=$l?>/affiliateform.php" class="cta_2" target="_blank"><i class="mob-txt-lime fa fa-handshake fa-1d5x"></i>&nbsp;&nbsp;<?= X('promo_btn') ?></a>
                    </div>
                    <div class="airupplus">
                        <a id="sponsorship_later" class="cta_2"><i class="mob-txt-lime fa fa-alarm-clock fa-1d5x"></i>&nbsp;&nbsp;<?= X('promo_btn2') ?></a>
                    </div>
                </div>
            </div>

            <div class="flexinner d-none d-md-block col-md-3 col-lg-3 col-xl-3"> 
                <div>
                    <img style="max-width: 260px;" src="../assets/imgs/account/Giraud.png" alt="account-manager-pic">
                </div>
            </div>
        </div>
    </div>
</section>
</body>

<script>

    $(document).ready( function() { 
    $('#sponsorship_no,#sponsorship_yes,#sponsorship_later').click(
        function(){
            $('#message-box').css('display', 'none');
        }
    );
    });

</script> 

</html>