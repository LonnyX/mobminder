<!doctype html>
<html translate="no">

<head>
	<title>Thank you!</title>
    <meta name="robots" content="noindex">
    <meta name="googlebot" content="noindex">
	<link rel="stylesheet" href="../assets/css/thankyou.css">
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache" />

    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="date=no">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


    <link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	


    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../assets/css/faws.css">
    <link rel="stylesheet" href="../assets/css/generics.css">
    <link rel="stylesheet" href="../assets/css/loginCRM.css">
    <link rel="stylesheet" href="../assets/css/bootstrap.css">


    <script src="../assets/js/jquery-3.2.1.js"></script>
    <script src="../assets/js/iscroll.52.js"></script>
    <script src="../assets/js/jquery.rightClick.js"></script>
    <script src="../assets/js/mobframe.js"></script>
    <script src="../assets/js/controls.js"></script>
    <script src="../assets/js/moblib.js"></script>
    <script src="../assets/js/downloadpdf.js"></script>

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

<?php

    require('../assets/php/dbio.php');

    $lid = $_SESSION['logged_lead'];
    $contid = $_SESSION['logged_contract'];

    $dS_contract = new C_dS_contract($contid);
    $courtesy = $dS_contract->invCourtesy; //Contractor's civility, retrieved from contract filled in by the account manager: M, Mme, Dr or Me
    $tncourtesy = $courtesy.'_title'; // will be used as technical names to display the right translation according to the lang
    $lname = $dS_contract->invContactPersonLastname; //Contractor's last name


    $dS_lead = new C_dS_lead($lid);
    $accmid = $dS_lead->accountm; //Lead's account manager    
    
    $dS_user = new C_dS_users($accmid);
    $accpicname = $dS_user->firstname.'.png'; //Account manager's picture
    $accfirstname = $dS_user->firstname; //Account manager's firstname
    $acclastname = $dS_user->lastname; //Account manager's lastname
        $picname = 'Johndoe.png';
        $presignat = '';
        $signat = X('signature');
    switch($accfirstname) {
        case "Giraud":
        case "Jonathan": 
        case "Florian": 
        case "Keevin": 
                $accpicname = $accfirstname.'.png'; $presignat = X('signature_acc'); $signat = $accfirstname.' '.$acclastname; 
                break; 
        default: // inclusive Johndoe
                $accpicname = $picname; $signat = $signat; 
    }

?>

<body id="body" style="min-height:100vh; position:relative;">  

				<!--    T H A N K     Y O U     P A G E   -->
			
<section id="thankyou" class="thankyou">  
    <div class="shade"></div>
    <div class="message-box wide">
        <div class="row">
            <div class="flexinner col-sm-12 col-md-10 col-lg-10 col-xl-10">
                <div class="message">
                    <h2 class="mob-txt-gray_m airup air"><?=X($tncourtesy,'mailinvite').' '.$lname?>,</h2>
                    <p class="mob-txt-gray_d left air"><?=X('text_thanks')?></p>
                    <!--<div style="display:grid; place-items:center; margin:20px 0;"><a id="form_btn1" class="cta2-button mob-txt-gray_d shrink" href="./mail_thanks.php?pdf=1" rel="noopener nofollow"><i class="mob-txt-lime fad fa-file-download fa-1d5x"></i><span class="centered"><?= X('caption_btn') ?></span></a></div>-->
                    <div id="download_pdf" class="col-12 col-md-8 col-lg-6 mx-auto" style="margin-top:35px;"></div>
                    <p id="" class="mob-txt-gray_d right" style="margin-top:35px;"><?= $presignat ?></p>
                    <p id="" class="mob-txt-gray_d right"><?= $signat ?></p>
                </div>
            </div>
            <div class="flexinner d-none d-md-block col-md-2 col-lg-2 col-xl-2"> 
                <div>
                    <img class="account-right-img" src="../assets/imgs/emails/<?= $accpicname ?>" alt="account-manager-pic">
                </div>
            </div>
        </div>

        <div class=""> <!-- only for ixl -->
            <h3 class="ixl" id="caption-download" style="display:none; text-align:left;"><?=X('caption_download')?></h3>
            <h3 class="ixl" id="caption-download-progress" style="display:none; text-align:left;"><?=X('caption_progressing')?></h3>
            <h3 class="ixl" id="caption-downloaded" style="display:none; text-align:left;"><?=X('caption_download')?></h3>
		</div>

    </div>

    <script type="text/javascript">
	
        var clouds = document.querySelector("#thankyou"); // let the clouds flow
        (function wind() {
            let d = (aframe)/16;
            if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px top 5em"; // (*cp01*)
            requestAnimationFrame(wind);
        })();

    </script>

    <script type="text/javascript">
        let c = new C_iDownloadPdf('download_pdf', { target: $('#body'), ixl: '<?= $ixl ?>' })
        c.display();
        c.activate();
    </script>

</section>


</body>

</html>