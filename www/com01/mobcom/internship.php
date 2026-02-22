<!doctype html>
<html translate="no">

<head>

<title>Internship offers</title>
<meta name="description" content="Our internship offers">
<link rel="stylesheet" href="assets/css/internship.css">
<link rel="stylesheet" href="assets/css/generics.css">

	
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache" />
<meta name="robots" content="noindex">
<meta name="googlebot" content="noindex">


<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="date=no">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


<link rel="shortcut icon" href="assets/imgs/favicon/favicon.ico"> 	


<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/faws.css">
<link rel="stylesheet" href="assets/css/generics.css">
<link rel="stylesheet" href="assets/css/bootstrap.css">
<link rel="stylesheet" href="assets/css/video-js.css">


<script src="assets/js/jquery-3.2.1.js"></script>
<script src="assets/js/moblib.js"></script>

<script src="assets/js/waves.js"></script>
<script src="assets/js/xlate.js"></script>
<script src="assets/js/contact.js"></script> 
<script src="assets/js/captcha.js"></script>   <!-- to be used with captcha.php -->
<script src="assets/js/video-js.js"></script>   <!-- to be used with captcha.php -->


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
	

			<!--    I N T E R S H I P   O F F E R S   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins" style="padding-top:1em;">
			<a href="index.php"><img class="moblogo medium zoom" src="assets/imgs/icon-1.png" alt="mobminder logo"></a>
            <h1 class="bold mobminder left unfold from-top s1"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></h1>
			<div class="headers">
				<h1 class="bold left mob-txt-gray_m unfold from-left s3">Internship</h1>
				<h1 class="bold left mob-txt-gray_l unfold from-bottom s3">Opportunities</h1>
			</div>
		</div>
	</div>

    <div id="internship_offers" class="internship-offers">
        <div class="offer list-area down p-list-area airupplus airplus margins unfold from-left s3">
            <ul class="mob-txt-gray_d">

                <li id="show1" style="cursor:pointer;">Sales / marketing (Native Dutch)<br><span class="mob-txt-gray_l" style=";font-size:90%;">Sales development in Flanders</span></li>
                    <div class="post_description1" style="display:none;">
                        <p>
                        Mobminder is a customer-oriented IT company that provides a cloud solution used by more than 7000 active users across Europe. 
                        Our B2B solution is mainly used in the medical sector (doctors and medical centers) but we also count users in the public sector, 
                        wellness and beauty, corporate groups (companies such as GSK and AXA) and the industrial sector for operational planning. 
                        We are proud to score high in satisfaction and trust among current customers who recommend our product.
                        <br>
                        <br>It is the perfect timing to join our team and help us develop the business in Flanders. 
                        <br>We will train you in order to ensure that you know the product features and target audiences.
                        <br>
                        <br>
                        <span class="mob-txt-blue">Responsibilities</span>
                        <br>
                        - Prospect and find business opportunities in Flanders<br>
                        - Present and promote our services<br>
                        - Negotiate and sign contract<br>
                        - Manage your own leads<br>
                        - Take care of your own customer portfolio (set-up, product training, support)<br>
                        - Help our digital marketer in improving our marketing strategy
                        <br>
                        <br>
                        <span class="mob-txt-blue">Requirements and skills</span>
                        <br>
                        - You are highly motivated and target driven, you are fond of winning deals<br>
                        - You are a Dutch native speaker with English or French skills<br>
                        - You feel comfortable with technologies ( touch devices, apps, webapps )<br>
                        - You have excellent selling, negotiation and communication skills<br>
                        - You have good problem-solving skills<br>
                        - You are autonomous and have a sense of initiative<br>
                        - You deliver an excellent service
                        <br>
                        <br>
                        <span class="mob-txt-blue">We offer</span>
                        <br>
                        - An internship in a growing company<br>
                        - A small passionate team driven by excellent customer service<br>
                        - A possible collaboration after your internship, depending on your performance<br>
                        - A high level of independence<br>
                        - Invitation to fairs and trade events that we organise<br>
                        - An hands-on approach and working in the field (no traditional office culture)<br>
                        - Your initiative and ideas are always welcome and taken seriously<br>
                        </p>
                        
                        <div style="display:grid; place-items:center; margin:20px 0;"><a href=https://mobminder.com/en/partnership.php#before_contact_form target="_blank" rel="noopener nofollow" class="cta_2 mob-txt-gray_d shrink"><i class="mob-txt-lime fa fa-paper-plane"></i><span>&nbsp;&nbsp;&nbsp;Contact us</span></a></div>

                    </div>

                <div style="padding-bottom:40px"></div>


                <li id="show2" style="cursor:pointer;">IT system (Native French or Dutch)<br><span class="mob-txt-gray_l" style=";font-size:90%;">LAMP servers: performance monitoring dashboard design and implementation. Linux Apache PHP MySQL</span></li>
                    <div class="post_description2" style="display:none;">
                        <p>
                        Mobminder is a customer-oriented IT company that provides a cloud solution used by more than 7000 active users across Europe. 
                        Our B2B solution is mainly used in the medical sector (doctors and medical centers) but we also count users in the public sector, 
                        wellness and beauty, corporate groups (companies such as GSK and AXA) and the industrial sector for operational planning. 
                        We are proud to score high in satisfaction and trust among current customers who recommend our product.
                        <br>
                        <br>It is the perfect timing to join our team and help us improve even more the reliability of our system.
                        <br>
                        <br>
                        <span class="mob-txt-blue">Responsibilities</span>
                        <br>
                        - Together with our team, define a set of KPI's related to LAMP performance monitoring. e.g. Processors usage, RAM usage, SQL requests execution length, Ethernet traffic<br>
                        - Implement the scripts that allow collecting the above parameters and send them to the monitoring server (SQL DB)<br>
                        - Define the human interface ergonomy for the dashboard<br>
                        - Implement the human interface of the dashboard (PHP, HTML, JS)<br>
                        - Run the above set-up, collect data, adjust the ergonomy
                        <br>
                        <br>
                        <span class="mob-txt-blue">Requirements and skills</span>
                        <br>
                        - You are highly motivated and target driven, you are fond of servers related matters<br>
                        - You are a Dutch native speaker with English or French skills, or French native with english and dutch skills<br>
                        - You are creative<br>
                        - You have good problem-solving skills<br>
                        - You are autonomous and have a sense of initiative<br>
                        - You deliver an excellent service
                        <br>
                        <br>
                        <span class="mob-txt-blue">We offer</span>
                        <br>
                        - An internship in a growing company<br>
                        - A small passionate team driven by excellent customer service<br>
                        - A possible collaboration after your internship, depending on your performance<br>
                        - A high level of independence<br>
                        - An hands-on approach and working in the field (no traditional office culture)<br>
                        - Your initiative and ideas are always welcome and taken seriously<br>
                        </p>

                        <div style="display:grid; place-items:center; margin:20px 0;"><a href=https://mobminder.com/en/partnership.php#before_contact_form target="_blank" rel="noopener nofollow" class="cta_2 mob-txt-gray_d"><i class="mob-txt-lime fa fa-paper-plane"></i><span>&nbsp;&nbsp;&nbsp;Contact us</span></a></div>

                    </div>

            </ul>
        </div>
	</div>

<script type="text/javascript">

    let el1 = document.querySelector("#welcome"); // wave the upper sky border
    var w1 = new C_waved( el1, { animate:true });

	var clouds = document.querySelector("#clouds"); // let the clouds flow
	(function wind() {
		let d = (aframe)/16;
		if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px bottom 0%"; // (*cp01*)
		requestAnimationFrame(wind);
	})();

$(document).ready(function(){
    $('#show1').click(function() {
        $('.post_description1').toggle("slide")
    });

    $('#show2').click(function() {
        $('.post_description2').toggle("slide");
    });
});




</script>


</section>  <!-- section clouds -->
		
</body>
</html>