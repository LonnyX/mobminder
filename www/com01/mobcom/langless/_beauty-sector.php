<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://mobminder.com/<?= $l ?>/index.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/beauty-sector.css">
	<!-- <link rel="stylesheet" href="../assets/css/chat.css"> -->

	<!-- Meta Pixel Code 
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '675750053505060');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=675750053505060&ev=PageView&noscript=1"
/></noscript>

End Meta Pixel Code -->



</head>

<body> <!-- class="slightwhite" */ -->


	<?php include('menu.php')?>
	


			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
			<h1>
				<a href="./index.php">
					<div class="logo centered unfold from-left s2">
						<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
						<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
					</div>
				</a>
				<div class="headers">
					<div class="bold left mob-txt-gray_m unfold from-left s0"><?= X('top_header_l1') ?></div>
					<div class="bold left mob-txt-gray_d unfold from-bottom s1"><?= X('top_header_l2') ?></div>
				</div>
  			</h1>
		</div>
	</div>

    <div class="advantages">
		<div class="wide">
			<div class="row">
                <div class="flexinner col-12 col-md-6 col-xl-3">
				  <div class="promotion-box unfold from-left s0">
					<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-shield-check" style=""></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c1') ?></h2></div>
						</div>
						<p><?= X('top_gain_t1') ?></p>
					</div>
				  </div>
				</div>
                <div class="flexinner col-12 col-md-6 col-xl-3">
				  <div class="promotion-box unfold from-top s1">
						<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-chart-line-down" style=""></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c2') ?></h2></div>
						</div>
						<p><?= X('top_gain_t2') ?></p>
					</div>
				  </div>
				</div>
				<div class="flexinner col-12 col-md-6 col-xl-3">
				  <div class="promotion-box unfold from-bottom s2">
					<div class="promotion-box-inner">
						<div class="row">
						<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-paint-roller" style=""></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c3') ?></h2></div>
						</div>
						<p><?= X('top_gain_t3') ?></p>
					</div>
				  </div>
				</div>
                <div class="flexinner col-12 col-md-6 col-xl-3">  
				  <div class="promotion-box unfold from-right s3">
					<div class="promotion-box-inner">
						<div class="row relative">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-bullseye-pointer" style=""></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c4') ?></h2></div>
						</div>
						<p><?= X('top_gain_t4') ?></p>
					</div>
				  </div>
				</div>
			</div>
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

</script>
</section>  <!-- section welcome -->


<section id="keep_control" class="features keep-control airup">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l airplus unfold from-bottom invp mobul"><?= X('sec1_title') ?></h1>
	</div>
	<div class="margins">
		<div class="row">
			<div class="pre-img col-12 d-md-none">
				<img src="../assets/imgs/beauty/control.jpg" alt=""></img>
			</div>
			<div class="col-12 col-md-7 my-auto">
                <div class="list-area checked">
                    <ul class="bold mob-txt-blue">
                        <li><?= X('sec1_line1') ?></li>
                        <li><?= X('sec1_line2') ?></li>
                        <li><?= X('sec1_line3') ?></li>
						<li><?= X('sec1_line4') ?></li>
                        <li><?= X('sec1_line5') ?></li>
                    </ul>
                </div>
			</div>
			<div class="post-img d-none d-md-block col-md-5">
				<img src="../assets/imgs/beauty/control.jpg" alt=""></img>
			</div>
		</div>
	</div>
	<div class="flexinner">
		<div><a href="./beauty-sector.php#contactbanner" class="cta2-button mob-txt-gray_d shrink" style="margin-top:20px"><?= X('btn_cta2') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m"><?= X('sub_btn_cta2') ?></dd></div>
	
</section>  <!--  section keep_control -->


<section id="reduce_noshow" class="features reduce-noshow airupplus">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec2_title') ?></h1>
	</div>
	<div class="margins">
		<div class="row">
			<div class="pre-img col-12 col-md-5">
				<img src="../assets/imgs/beauty/reduce-noshows.jpg" alt=""></img>
			</div>
			<div class="col-12 col-md-7 my-auto">
                <div class="list-area checked">
                    <ul class="bold mob-txt-blue">
						<li><?= X('sec2_line1') ?></li>
                        <li><?= X('sec2_line2') ?></li>
                        <li><?= X('sec2_line3') ?></li>
                    </ul>
                </div>
			</div>
		</div>
	</div>
	<div class="flexinner">
		<div><a href="./beauty-sector.php#contactbanner" class="cta2-button mob-txt-gray_d shrink" style="margin-top:20px"><?= X('btn_cta2') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m"><?= X('sub_btn_cta2') ?></dd></div>
	
</section>  <!--  section reduce_noshow -->

<section id="loyal_customer" class="features loyal-customer airupplus">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l airplus unfold from-bottom invp mobul"><?= X('sec3_title') ?></h1>
	</div>
	<div class="margins">
		<div class="row">
			<div class="pre-img col-12 d-md-none">
				<img src="../assets/imgs/beauty/loyal-customer.jpg" alt=""></img>
			</div>
			<div class="col-12 col-md-7 my-auto">
                <div class="list-area checked">
                    <ul class="bold mob-txt-blue">
						<li><?= X('sec3_line1') ?></li>
                        <li><?= X('sec3_line2') ?></li>
                        <li><?= X('sec3_line3') ?></li>
                    </ul>
                </div>
			</div>
			<div class="post-img d-none d-md-block col-md-5">
				<img src="../assets/imgs/beauty/loyal-customer.jpg" alt=""></img>
			</div>
		</div>
	</div>
	<div class="flexinner">
		<div><a href="./beauty-sector.php#contactbanner" class="cta2-button mob-txt-gray_d shrink" style="margin-top:20px"><?= X('btn_cta2') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m" style="margin-bottom:30px"><?= X('sub_btn_cta2') ?></dd></div>
	
</section>  <!--  section loyal_customer -->


<section id="online_booking" class="features online-booking airupplus">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l airplus unfold from-bottom invp mobul"><?= X('sec4_title') ?></h1>
	</div>
	<div class="margins">
		<div class="row">
			<div class="pre-img col-12 col-md-5">
				<img src="../assets/imgs/beauty/welcome-customer.jpg" alt=""></img>
			</div>
			<div class="col-12 col-md-7 my-auto">
				<div class="list-area checked">
					<ul class="bold mob-txt-blue">
						<li><?= X('sec4_line1') ?></li>
						<li><?= X('sec4_line2') ?></li>		
                        <li><?= X('sec4_line3') ?></li>
                        <li><?= X('sec4_line4') ?></li>
						<li><?= X('sec4_line5') ?></li>
                        <li><?= X('sec4_line6') ?></li>	
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="flexinner">
		<div><a href="./beauty-sector.php#contactbanner" class="cta2-button mob-txt-gray_d shrink" style="margin-top:20px"><?= X('btn_cta2') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m"><?= X('sub_btn_cta2') ?></dd></div>
	
</section>  <!--  section online_booking -->

<div id="before_carousel_1" class="animate wtop slightwhite" style="height:50px;">
	<script type="text/javascript">
			let before_carousel_1 = document.querySelector("#before_carousel_1");
		var bhm = new C_waved( before_carousel_1, { animate:true, frequence:2, phase:0, speed:10, amplitude:100 });
		
	</script>
</div>	


<!--   E X A M P L E     O F   B O O K I N G    P A G E    S E C T I O N      -->

<section id="unique_page" class="air slightwhite">

	<div class="margins">
			<h1 class="bigger left mob-txt-gray_l"><?= X('sec5_title') ?></h1>
	</div>

	<div class="slider slider500">
		<div class="slide-track scroll-to-right">
			<span class="copy-me">
				<div class="slide slide-features"><img src="../assets/imgs/slider/resa1.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/resa2.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/resa3.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/resa4.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/resa5.png" alt=""></img></div>
			</span>
		</div>
</div>


	<div class="flexinner">
		<div><a href="./trynow.php" class="cta cta_1 shadowed" style="margin-top:20px"><?= X('btn_cta1') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m" style="margin-bottom:30px"><?= X('sub_btn_cta1') ?></dd></div>



	<script type="text/javascript">
			$('#unique_page').find('.slide-track').each(
				function() {
					let wagon = $(this).html(); // (-st01-)
					$(this).find('.copy-me').after(wagon).after(wagon).after(wagon);					
					setTimeout(function() { // hand back to browser so it figures out the new element width (containing now 4 span wagons)
						$('#unique_page').find('.slide-track').addClass('go'); // go start the animation 
					}, 1000); 
				}
			)
	</script>


</section>  <!--  section unique_page -->




<section id="personalized_agenda" class="features personalized-agenda airupplus">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec6_title') ?></h1>
	</div>
	<div class="margins">
		<div class="row">
			<div class="pre-img col-12 col-md-5">
				<img src="../assets/imgs/beauty/color-choice.jpg" alt=""></img>
			</div>
			<div class="col-12 col-md-7 my-auto">
                <div class="list-area checked">
                    <ul class="bold mob-txt-blue">
						<li><?= X('sec6_line1') ?></li>
                        <li><?= X('sec6_line2') ?></li>
						<li><?= X('sec6_line3') ?></li>
                    </ul>
                </div>
			</div>
		</div>
	</div>
	<div class="flexinner">
		<div><a href="./beauty-sector.php#contactbanner" class="cta2-button mob-txt-gray_d shrink" style="margin-top:20px"><?= X('btn_cta2') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m" style="margin-bottom:30px"><?= X('sub_btn_cta2') ?></dd></div>
	
</section>  <!--  section personalized_agenda -->


<div id="before_carousel_2" class="animate wtop slightwhite" style="height:50px;">
	<script type="text/javascript">
			let before_carousel_2 = document.querySelector("#before_carousel_2");
		var bhm = new C_waved( before_carousel_2, { animate:true, frequence:2, phase:0, speed:10, amplitude:100 });
		
	</script>
</div>	

<!--   E X A M P L E     O F   A G E N D A   S E C T I O N      -->

<section id="unique_agenda" class="air slightwhite">

	<div class="margins">
			<h1 class="bigger left mob-txt-gray_l"><?= X('sec7_title') ?></h1>
	</div>

	<div class="slider slider500">
		<div class="slide-track scroll-to-left">
			<span class="copy-me">
				<div class="slide slide-features"><img src="../assets/imgs/slider/macbook.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/smartphone.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/tablets.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/mac.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/multidevice2.png" alt=""></img></div>
			</span>
		</div>
	</div>

	<div class="flexinner">
		<div><a href="./trynow.php" class="cta cta_1 shadowed" style="margin-top:20px"><?= X('btn_cta1_2') ?></a></div>
	</div>
	<div><dd class="centered airup mob-txt-gray_m" style="margin-bottom:30px"><?= X('sub_btn_cta1') ?></dd></div>

	<script type="text/javascript">
			$('#unique_agenda').find('.slide-track').each(
				function() {
					let wagon = $(this).html(); // (-st01-)
					$(this).find('.copy-me').after(wagon).after(wagon).after(wagon);					
					setTimeout(function() { // hand back to browser so it figures out the new element width (containing now 4 span wagons)
						$('#unique_agenda').find('.slide-track').addClass('go'); // go start the animation 
					}, 1000); 
				}
			)
	</script>


</section>  <!--  section unique_agenda -->



<section id="theytrust" class="theytrust airupplus">

	<div class="margins">
		<h1 class="bigger centered mob-txt-gray_l air mobul">Ces établissements nous font confiance</h1>
	</div>

	<div class="slider slider300 shadeinout">
			<div class="slide-track hover-stop scroll-to-right">
				<span class="copy-me">

					<div class="slide">
						<a href="https://www.hairangels.be/" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/hair-angels.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Hair Angels</dd>
								<dd class="smaller">Belgique</dd>
							</div>
						</div>
						</a>
					</div>

					<div class="slide">
						<a href="https://www.epilium-paris.com" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/epilium.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Epilium</dd>
								<dd class="smaller">(Paris - France)</dd>
							</div>
						</div>
						</a>
					</div>
					<div class="slide">
						<a href="https://www.facebook.com/AngelaPlasenzottiCoiffure" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/angela-plasenzotti.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Angela Plasenzotti</dd>
								<dd class="smaller">Belgique</dd>
							</div>
						</div>
						</a>
					</div>
					<div class="slide">
						<a href="https://www.centre-carolina.be" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/centre-carolina.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Centre Carolina</dd>
								<dd class="smaller">Belgique</dd>
							</div>
						</div>
						</a>
					</div>
					<div class="slide">
						<a href="http://www.espace-braffort.be" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/braffort.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Espace Braffort</dd>
								<dd class="smaller">(Bruxelles - Belgique)</dd>
							</div>
						</div>
						</a>
					</div>
					<div class="slide">
						<a href="https://www.principefeminin.be/" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/principe-feminin.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Principe féminin</dd>
								<dd class="smaller">Belgique</dd>
							</div>
						</div>
						</a>
					</div>
					<div class="slide">
						<a href="https://www.instagram.com/manuelnyimeccoiffure" target="blank" rel="noopener nofollow">
						<div class="partner-area">
							<img src="../assets/imgs/partners/manuel-nyimec.jpg" alt="Logo">
							<div class="name white mob-bg-gray_l">
								<dd>Manuel Nyimec Coiffure</dd>
								<dd class="smaller">Belgique</dd>
							</div>
						</div>
						</a>
					</div>
				</span>
			</div>
		</div>

	<script type="text/javascript">
			$('#theytrust').find('.slide-track').each(
				function() {
					let wagon = $(this).html(); // (-st01-)
					$(this).find('.copy-me').after(wagon).after(wagon).after(wagon);					
					setTimeout(function() { // hand back to browser so it figures out the new element width
						$('#theytrust').find('.slide-track').addClass('go'); // go start the animation 
					}, 1000); 
				}
			)
	</script>

</section> 



<!--   V I D E O   T E S T I M O N I A L    -->


<section id="video-testimonial-amandine" class="video-testimonial-amandine air">


<div class="wide">
	<div class="row air">
		<div class="flexinner col-12 col-lg-6 align-items-center">
			<h2 class="bigger centered mob-txt-gray_l air">Mobminder a-t-il contribué </br> à votre succès ?</h2>
		</div>
		<div class="flexinner col-12 col-lg-6 align-items-center">
			<video 	id="video_testimonial_amandine" class="video-js vjs-fluid" poster="../assets/imgs/poster/testimonial_amandine.jpg"><source src="../assets/vids/testimonials/testimonial_amandine_fr.mp4" type="video/mp4" /></video>
		</div>
	</div>

	<script>
		$(document).ready(function() {
		var options = {
			controls: true,
			preload: 'none',
			fluid: true
		}
		var touch_vid_ready = function() { console.log('player ready: ', this.id_ ) };
		var p = videojs('video_testimonial_amandine', options, touch_vid_ready);
		
		console.log('document ready');
	});
	</script>
</div>
	
</section>








<!--    W E    P R O T E C T    Y O U      -->




<section id="weprotect" class="weprotect air">
	<div class="wide">
		<div class="row">
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="flexinner weprotect-box header-text align-items-center">
					<h1 class="bigger centered mob-txt-gray_l air unfold from-bottom invp"><?= X('sec2_title','main') ?></h1>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-1.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line1','main') ?></h2>
					<div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line1_explain','main') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-2.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line2','main') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line2_explain','main') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-4.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line3','main') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line3_explain','main') ?></p>
				</div>
			</div>	
		</div>
	</div>
<script type="text/javascript">

		let shetypes = document.querySelector("#shetypes");
	var w2 = new C_waved( shetypes, { animate:true, frequence:4, phase:0, speed:4, amplitude:10 });
	
</script>
	
</section>  <!--section weprotect -->


	<!--    P R I C I N G      -->




	<div id="before_plan" class="animate wtop bluewhite_2" style="height:50px;">
	<script type="text/javascript">
			let before_plan = document.querySelector("#before_plan");
		var bhm = new C_waved( before_plan, { animate:true, frequence:2, phase:0, speed:10, amplitude:90 });
	</script>
</div>	
	

<section id="plan" class="plan bluewhite_2 noverflow">
                    

	<div class="wide" style="z-index:1;">
		<h1 class="bigger centered mob-txt-gray_l air unfold from-top invp"><?= X('sec6_rates_title','main') ?></h1>
	</div>
	
	<div id="pclouds" class="clouds"></div>
	
	<div class="wide air">	
		
		<div class="row justify-content-center">

			<div class="col-md-10 col-lg-8 col-xl-12">
				<div class="plan-box centered" style=" border:2.5px solid transparent !important;">
					<div class="ribbon ribbon-top-left uppercase-letters"><span class="bold"><?= X('options_ribbon','main') ?></span></div>
					<div class="" style="display:inline-block; margin:0 auto;">
						<div class="plan-header" style="padding:1.5em 0.5em 0em 0.5em;">
							<a href="./pay.php" target="_blank"><div class="zoom" style="cursor:pointer;"><span class="bold mobminder centered" style="cursor:pointer;"><span class="mob-txt-blue" style="font-size:80%;">mob</span><span class="mob-txt-lime" style="font-size:80%;">minder</span><div class="mob-bg-gray_l white containerpay"><span>Pay</span></div></span></div></a>
							<p class="mob-txt-blue centered" style="padding-top:10px;"><?= X('plan_booster_title','main') ?></p>
						</div>
						<div class="plan-features">
							<ul id="options" class="left" style="padding:20px 15px 10px 20px;">
								<li id="option_1" class="mob-txt-gray_m uncheckedbox" style="cursor:pointer;" onclick="checkoption('option_1');"><?= X('plan_booster_option1','main') ?></li>
								<li id="option_2" class="mob-txt-gray_m uncheckedbox" style="cursor:pointer;" onclick="checkoption('option_2');"><?= X('plan_booster_option2','main') ?></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		
			<div class="col-md-10 col-lg-8 col-xl-4">
				<div class="plan-box">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_1','main') ?><span class="ext_title_plan" style="display:none;">&Pay</h2>
						<p class="mob-txt-gray_l left"><?= X('sec6_rate_2_text','main') ?></p>
						<h2 id="price_1" class="mob-txt-blue centered bold price" style="display:block;"><?= X('Price_1','main') ?><span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
						<h2 id="price_1_pay" class="mob-txt-blue centered bold price" style="display:none;">59 €<span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_0','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_10','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_11','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_12','main') ?></li>
							<li class="mob-txt-gray_m addedoption option_1" style="display:none;"><?= X('plan_pay_1','main') ?></li>
							<li class="mob-txt-gray_m addedoption option_2" style="display:none;"><?= X('plan_pay_2','main') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php" class="cta cta_1"><?= X('button_CTA1','main') ?></a></div>
							<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd1','main') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
			
			<div class="col-md-10 col-lg-6 col-xl-4">
				<div class="plan-box highlighted">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_2','main') ?><span class="ext_title_plan" style="display:none;">&Pay</h2>
						<p class="mob-txt-gray_l"><?= X('sec6_rate_4_text','main') ?></p>
						<h2 id="price_2" class="mob-txt-blue centered bold price" style="display:block;"><?= X('Price_2','main') ?><span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
						<h2 id="price_2_pay" class="mob-txt-blue centered bold price" style="display:none;">79 €<span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_0_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_5_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_10','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_11','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_12_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_1_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_4_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_1_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_7_1','main') ?></li>
							<li class="mob-txt-gray_m addedoption option_1" style="display:none;"><?= X('plan_pay_1','main') ?></li>
							<li class="mob-txt-gray_m addedoption option_2" style="display:none;"><?= X('plan_pay_2','main') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php" class="cta cta_1"><?= X('button_CTA1','main') ?></a></div>
							<dd class="centered airup white"><?= X('button_CTA1_dd2','main') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
			
			<div class="col-md-10 col-lg-6 col-xl-4">
				<div class="plan-box">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_3','main') ?></h2>
						<p class="mob-txt-gray_l left"><?= X('sec6_rate_5_text','main') ?></p>
						<h2 class="mob-txt-blue centered bold price"><?= X('Price_3','main') ?></h3>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_9_2','main') ?><span class="ext_title_plan" style="display:none;">&Pay</li>
							<li class="mob-txt-gray_m"><?= X('plan_2_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_3_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_4_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_5_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_2','main') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php"  class="cta cta_1"><?= X('button_CTA1','main') ?></a></div>
							<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd3','main') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
		</div>

		<div class="airupplus">
			<p class="mob-txt-blue bold remark_price_common" style="display:none;"><?= X('remark_mobpay_title','main') ?></p>
			<div class="remark_price remark_price_common mob-txt-gray_m col-12 option_1" style="display:none;"><?= X('remark_mobpay_1','main') ?></div>
			<div class="remark_price mob-txt-gray_m col-12 option_1" style="display:none;"><?= X('remark_mobpay_2','main') ?></div>
			<div class="remark_price remark_price_common mob-txt-gray_m col-12" style="display:none;"><?= X('remark_mobpay_3','main') ?></div>
		</div>
		
	</div>

	<script type="text/javascript">

		var pclouds = document.querySelector("#pclouds"); // let the clouds flow
		(function wind2() {
			let d = aframe/10+100;
			if(aframe_do) pclouds.style.backgroundPosition ="left "+d+"px top 0px"; // (*cp01*)
			requestAnimationFrame(wind2);
		})();
	</script>

<script>

	function checkoption(optionid) {
		let optionElement = $('#' + optionid);
			if (optionElement.hasClass('uncheckedbox')) {
				optionElement.removeClass('uncheckedbox');
				$('.' + optionid).each(function() {$(this).css('display', 'block');});
				boostplan();
			} else {
				optionElement.addClass('uncheckedbox');
				$('.' + optionid).each(function() {$(this).css('display', 'none');});
				boostplan();
			}
	}


	function boostplan() {
		if ($('#options').find('.uncheckedbox').length == 2) { // Parent element contains 2 children elements with the uncheckedbox class  => none option is chosen
			$('#price_1').css('display', 'block');
			$('#price_1_pay').css('display', 'none');
			$('#price_2').css('display', 'block');
			$('#price_2_pay').css('display', 'none'); 
			$('.plan-box').each(function() {$(this).removeClass('boosted');});
			$('.ext_title_plan').each(function() {$(this).css('display', 'none');});
			$('.remark_price_common').css('display', 'none'); //Common remark_price that has to disappear when none option is selected

		} else { // At least one option is chosen
			$('#price_1').css('display', 'none');
			$('#price_1_pay').css('display', 'block');
			$('#price_2').css('display', 'none');
			$('#price_2_pay').css('display', 'block');
			$('.plan-box').each(function() {$(this).addClass('boosted');});
			$('.ext_title_plan').each(function() {$(this).css('display', 'inline-block');});
			$('.remark_price_common').css('display', 'inline-block');  //Common remark_price that has appear when one option is selected
		}
	}

</script>
	
</section>  <!--section weprotect -->


<div id="after_plan" class="animate wbottom bluewhite_2" style="height:50px;"></div>
<script type="text/javascript">
		let after_plan = document.querySelector("#after_plan");
	var bhm = new C_waved( after_plan, { animate:true, frequence:2, phase:0, speed:10, amplitude:90 });
	
</script>	






	<!--    C O N T A C T     F O R M        -->

<section id="contactbanner" class="contact-wave">
	<div id="before_contact_form" class="animate wbottom thereyougo"></div>
	
	<div class="margins contact-title"><div class="row">
		<div class="col-12 col-sm-2"><h2 class="h1track mob-txt-gray_xl"></h2></div>
		<div class="col-12 col-sm-8"><h1 class="mob-txt-gray_l mobul unfold from-right invp"><?= X('header_take_contact','main') ?></h1></div>
		<div class="d-none d-sm-inline col-sm-2"></div>
	</div></div>
	
	<script type="text/javascript">
			let before_contact_form = document.querySelector("#before_contact_form");
		var ahm = new C_waved( before_contact_form, { animate:true, frequence:1, phase:0, speed:20, amplitude:15 });
		
	</script>
</section>



<?php include('contactform.php')?>
<script type="text/javascript">
	var c = new C_iContact('contact', {
		  target: $('#contact'),
		  caid: <?= $cqr ?>,
		  lang: '<?= $l ?>',
		  ixl: '<?= $ixl ?>'
	});
	c.display();
	c.activate();
</script>





<div class="gas"></div>


<?php include('footer.php')?>
<?php include('cookies.php')?>
<!-- <?php include('chat.php')?> Ancien chat (Whatsapp)-->





		
</body>
</html>