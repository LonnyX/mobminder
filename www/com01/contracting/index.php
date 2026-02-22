<!doctype html>
<html translate="no">

<head>
	
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache" />

<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="date=no">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


<link rel="shortcut icon" href="./assets/imgs/favicon/favicon.ico"> 	


<link rel="stylesheet" href="./assets/css/fonts.css">
<link rel="stylesheet" href="./assets/css/faws.css">
<link rel="stylesheet" href="./assets/css/bootstrap.css">
<link rel="stylesheet" href="./assets/css/generics.css">
<link rel="stylesheet" href="./assets/css/loginCRM.css">

<script src="./assets/js/jquery-3.2.1.js"></script>
<script src="./assets/js/iscroll.52.js"></script>
<script src="./assets/js/jquery.rightClick.js"></script>
<script src="./assets/js/mobframe.js"></script>
<script src="./assets/js/controls.js"></script>

<script src="./assets/js/waves.js"></script>
<script src="./assets/js/xlate.js"></script>

<script src="./assets/js/loginCrm.js"></script>


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


<body style="min-height:100vh; position:relative;">  

			<!--    L O G I N     P A G E   -->
			
<section id="login" class="login">  
    <div class="shade"></div>
    <div class="message-box wide">
        <form id="loginFields" style="text-align:center;">
            <h1 class="bold mobminder centered"><img src="./assets/imgs/icon-1.png" alt="mobminder logo"/>&nbsp;<span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></h1>
            <div id="un" class="wrap-input"></div>
            <div id="pw" class="wrap-input"></div>
            <div id="container-login-btn" class="col-10 col-md-8 col-lg-6 mx-auto"></div>
        </form>
    </div>

    <script type="text/javascript">
        let c = new C_iLogin('loginFields', {
            target: $('#loginFields')
        })
        c.display();
        c.activate();
    </script>

    <script type="text/javascript">
        var clouds = document.querySelector("#login"); // let the clouds flow
        (function wind() {
            let d = (aframe)/16;
            if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px top 5em"; // (*cp01*)
            requestAnimationFrame(wind);
        })();
    </script>

</section>
</body>

</html>