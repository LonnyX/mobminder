<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/index.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/main.css">
</head>

<body> <!-- class="slightwhite" */ -->



	<?php include('menu.php')?>



			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
			<!-- <img class="moblogo" src="../assets/imgs/icon-1.png" alt="mobminder logo"> -->
			<h1>
				<div class="centered logo unfold from-left s6">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
				</div>
				<a href="./index.php#advantages">
				<div class="headers">
					<div class="bold main-header left mob-txt-gray_l unfold from-up s0" style="font-size:100%; padding-bottom:0.3em;"><?= X('top_header_l1') ?></div>
					<div class="plus-header first left mob-txt-gray_l unfold from-up s1 lowercase-letters" style="font-size:95%;"><?= X('top_header_l3') ?></div>
					<div class="plus-header second left mob-txt-gray_m unfold from-up s2 lowercase-letters" style="font-size:95%;"><?= X('top_header_l2') ?></div>
					<div class="plus-header third left mob-txt-gray_d unfold from-up s3 lowercase-letters" style="font-size:95%;"><?= X('top_header_l4') ?></div>
				</div>
				</a>
			</h1>
		</div>
	</div>
	<div id="advantages" class="advantages">
		<!-- <div class="margins">
			<h1 class="bold mobminder right unfold from-right s0"><span class="white">mob</span><span class="mob-txt-lime">minder</span></h1>
		</div> -->
		<div class="wide">
			<div class="row">
				<div class="flexinner col-12 col-md-6 col-xl-3">  
				  	<div class="promotion-box unfold from-left s0 hover-card">
						<div class="promotion-box-inner">
							<div class="row">
								<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-history" style=""></i></div>
								<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c1') ?></h2></div>
							</div>
							<p><?= X('top_gain_t1') ?></p>
						</div>
						<div class="discover-features"><a href="./features.php"><p class="discover-features small airupplus bold link"><?= X('cta_features') ?><span class="mob-txt-lime"><i class="fa fa-solid fa-1x fa-chevron-right" style="padding-left:5px;"></i></span></p></a></div>
				  	</div>
				</div>

				<div class="flexinner col-12 col-md-6 col-xl-3">
				  	<div class="promotion-box unfold from-top s1 hover-card">
						<div class="promotion-box-inner">
							<div class="row">
								<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-chart-line"></i></div>
								<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c2') ?></h2></div>
							</div>
							<p><?= X('top_gain_t2') ?></p>
						</div>
						<div class="discover-features"><a href="./features.php"><p class="discover-features small airupplus bold link"><?= X('cta_features') ?><span class="mob-txt-lime"><i class="fa fa-solid fa-1x fa-chevron-right" style="padding-left:5px;"></i></span></p></a></div>
				  	</div>
				</div>

				<div class="flexinner col-12 col-md-6 col-xl-3">
				  	<div class="promotion-box unfold from-bottom s2 hover-card">
						<div class="promotion-box-inner">
							<div class="row">
								<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-piggy-bank"></i></div>
								<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c3') ?></h2></div>
							</div>
							<p><?= X('top_gain_t3') ?></p>
						</div>
						<div class="discover-features"><a href="./features.php"><p class="discover-features small airupplus bold link"><?= X('cta_features') ?><span class="mob-txt-lime"><i class="fa fa-solid fa-1x fa-chevron-right" style="padding-left:5px;"></i></span></p></a></div>
				  	</div>
				</div>

				<div class="flexinner col-12 col-md-6 col-xl-3">
				  	<div class="promotion-box unfold from-right s3 hover-card">
						<div class="promotion-box-inner">
							<div class="row">
								<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-bullseye-pointer"></i></div>
								<div class="col-8 col-xl-12"><h2 class="bold white"><?= X('top_gain_c4') ?></h2></div>
							</div>
							<p><?= X('top_gain_t4') ?></p>
						</div>
						<div class="discover-features"><a href="./features.php"><p class="discover-features small airupplus bold link"><?= X('cta_features') ?><span class="mob-txt-lime"><i class="fa fa-solid fa-1x fa-chevron-right" style="padding-left:5px;"></i></span></p></a></div>
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


	$('body').find('.hover-card').each(
			function() { 
				$(this).hover(
					function() {
						this.classList.toggle('reveal-link');
					} )
			} 
	);



</script> 


</section>  <!-- section welcome -->





	<!--    W E   S O L V E     -->



<section id="wesolve" class="section-wesolve air">
	
	<div class="margins">
		<h1 class="bigger air centered mob-txt-gray_l unfold from-center invp mobul"><?= X('sec4_title') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="flexinner col-12 col-sm-6 col-lg-4">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/pro-1.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec4_cell_1_title') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_1_text') ?></p>
					<div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_1_answer') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-sm-6 col-lg-4">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/pro-2.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec4_cell_2_title') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_2_text') ?></p>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_2_answer') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-sm-6 col-lg-4">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/pro-3.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec4_cell_3_title') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_3_text') ?></p>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_3_answer') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-sm-6 col-lg-4">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/pro-4.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec4_cell_4_title') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_4_text') ?></p>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_4_answer') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-sm-6 col-lg-4">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/pro-5.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec4_cell_5_title') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_5_text') ?></p>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_5_answer') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-sm-6 col-lg-4">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/pro-6.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec4_cell_6_title') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_6_text') ?></p>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec4_cell_6_answer') ?></p>
				</div>
			</div>
		</div>
	</div>
	
</section> <!-- section wesolve -->






	<!--    P R O F E S S I O N A L S     -->



 
<section id="professionnals" class="professionnals air">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('top_prof_title') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div id="pro_medical" class="pro touch-on flexinner col-6 col-md-6 col-lg-4" onclick="touch('pro_medical');">
				<div class="unfold v-flip invp single-service mob-bg-gray_m">
					<img class="" src="../assets/imgs/profs/service-1-doctor.jpg" alt="">
					<h3 class="white"><?= X('top_prof_s1') ?></h3>
				</div>
			</div>
			<div id="pro_freelance" class="pro touch-on flexinner col-6 col-md-6 col-lg-4" onclick="touch('pro_freelance');">
				<div class="unfold v-flip invp single-service mob-bg-gray_m">
					<img class=""  src="../assets/imgs/profs/service-2-freelances.jpg" alt="">
					<h3 class="white"><?= X('top_prof_s2') ?></h3>
				</div>
			</div>
			<div id="pro_medgroup" class="pro touch-on flexinner col-6 col-md-6 col-lg-4" onclick="touch('pro_medgroup');">
				<div class="unfold v-flip invp single-service mob-bg-gray_m">
					<img class=""  src="../assets/imgs/profs/service-3-group.jpg" alt="">
					<h3 class="white"><?= X('top_prof_s3') ?></h3>
				</div>
			</div>
			<div id="pro_call" class="pro touch-on flexinner col-6 col-md-6 col-lg-4" onclick="touch('pro_call');">
				<div class="unfold v-flip invp single-service mob-bg-gray_m">
					<img class=""  src="../assets/imgs/profs/service-4-operator.jpg" alt="">
					<h3 class="white"><?= X('top_prof_s4') ?></h3>
				</div>
			</div>
			<div id="pro_industry" class="pro touch-on flexinner col-6 col-md-6 col-lg-4" onclick="touch('pro_industry');">
				<div class="unfold v-flip invp single-service mob-bg-gray_m">
					<img class=""  src="../assets/imgs/profs/service-5-industry.jpg" alt="">
					<h3 class="white"><?= X('top_prof_s5') ?></h3>
				</div>
			</div>
			<div id="pro_wellness" class="pro touch-on flexinner col-6 col-md-6 col-lg-4" onclick="touch('pro_wellness');">
				<a href="./beauty-sector.php">
				<div class="unfold v-flip invp single-service mob-bg-gray_m">
					<img class=""  src="../assets/imgs/profs/service-6-wellness.jpg" alt="">
					<h3 class="white"><?= X('top_prof_s6') ?></h3>
				</div>
				</a>
			</div>
		</div>
	</div>


	<script>

function touch(professional) {

	$('div.pro.touch-on').each( function() { $(this).addClass('reduced'); } );
	$('#'+professional).removeClass('reduced');
	
	$('div.pro.touch-on').each( function() { $(this).removeClass('selected'); } );
	$('#'+professional).addClass('selected');

}

</script>

</section> <!-- section professionnals -->







	<!--    W H Y    M O B M I N D E R      -->



<section id="whymobminder" class="whymobminder air">
	
	<div class="margins">
		<div class="row">
			<div class="col-sm-12 col-lg-3 col-xl-4">
				<h1 class="bigger left mob-txt-gray_l air unfold from-left invp mobul"><?= X('sec1_title') ?></h1>
			</div>
			<div class="col-sm-12 col-lg-9 col-xl-8" style="padding-top:10px;">
				<div class="list-area checked">
				  <ul class="bold mob-txt-gray_m left-padded">
					<li><?= X('sec1_line1') ?></li>
					<li><?= X('sec1_line2') ?></li>
					<li><?= X('sec1_line3') ?></li>
					<li><?= X('sec1_line4') ?></li>
					<li><?= X('sec1_line5') ?></li>
					<li><?= X('sec1_line6') ?></li>
					<li><?= X('sec1_line7') ?></li>
				  </ul>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section whymobminder -->






	<!--    V O L U M E S   /   F I G U R E S      -->



<section id="volumes" class="volumes relative">
	<div class="techno"></div>
	<div id="vwrapper" class="animate wbottom">
		<div class="worldmapshade"></div>
		<div id="worldmap" class="animate wbottom worldmap">
			<div class="margins" style="padding-top:1em;">
				<h1 class="bigger left mob-txt-gray_l unfold from-top invp"><?= X('volumes_header_l1') ?></h1>
				<h1 class="bigger left mob-txt-gray_m unfold from-left invp"><?= X('volumes_header_l2') ?></h1>
				<h1 class="bigger left mob-txt-gray_d unfold from-bottom invp"><?= X('volumes_header_l3') ?></h1>
			</div>
		</div>
		<div id="figures" class="figures">
			<div class="wide right">
				<span class="bold mobminder"><span class="white">mob</span><span class="mob-txt-lime">minder</span></span>
			</div>
			<div class="wide">
					<div class="row">
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-users fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_users_count') ?></h2>
									<p class="white centered bigger air"><?= X('figures_users') ?></p>
								</div>
							</div>
						</div>
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-id-card fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_visitors_count') ?></h2>
									<p class="white centered bigger air"><?= X('figures_visitors') ?></p>
								</div>
							</div>
						</div>
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-calendar-alt fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_planned_count') ?></h2>
									<p class="white centered bigger air"><?= X('figures_planned') ?></p>
								</div>
							</div>
						</div>
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-calendar-check fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_performed_count') ?></h2>
									<p class="white centered bigger air"><?= X('figures_performed') ?></p>
								</div>
							</div>
						</div>
					</div>
			</div>
		</div>
		<div id="vfooter" class="vfooter">
			<div class="margins">
			</div>
		</div>
	</div>
<script type="text/javascript">

		let el2 = document.querySelector("#worldmap");
	var w2 = new C_waved( el2, { animate:true, frequence:2, phase:0, speed:8, amplitude:8 });
	
		let el3 = document.querySelector("#vwrapper");
		let phase = -1/2;
	var w3 = new C_waved( el3, { animate:true, frequence:2, phase:phase, speed:8, amplitude:4 });
	
	// let the world spin
	//
	var worldspin = document.querySelector("#volumes");
	(function worldspin1() {
		let d = -aframe/10;
		if(aframe_do) worldspin.style.backgroundPosition ="left "+d+"px bottom 30px"; // (*cp02*)
		requestAnimationFrame(worldspin1); 
	})();
</script>
</section>  <!-- section volumes -->







	<!--    C O M P A T I B I L I T Y      -->

 
 

 
<section id="compatibility" class="compatibility">
		<div class="air"></div>
		<div class="say"><h1 class="mob-txt-gray_l bigger centered unfold from-center invp mobul"><?= X('compatible_title') ?></h1></div>
		<div>
			<ul>
				<li>
					<a href='https://play.google.com/store/apps/details?id=com.mobminder.agenda' target="_blank">
					<div class="download">
						<i class="fab fa-google-play fa-3x"></i>
						<span class="df"><?= X('availability1') ?></span>
						<span class="dfn">Google Play</span>
					</div>
					</a>
				</li>
				<li>
					<a href='https://apps.apple.com/be/app/mobminder/id1530813844?l=fr' target="_blank">
					<div class="download">
						<i class="fab fa-apple fa-3x"></i>
						<span class="df"><?= X('availability2') ?></span>
						<span class="dfn">App Store</span>
					</div>
					</a>
				</li>
				<li>
					<a href= ./features.php>
					<div class="download">
						<i class="fab fa-windows fa-3x"></i>
						<span class="df"><?= X('availability3') ?></span>
						<span class="dfn">Windows</span>
					</div>
					</a>
				</li>
			</ul>
		</div>
		<div class="gas"></div>

</section> <!-- section compatibility -->








	<!--    T H E Y     T R U S T     U S       -->


<!-- They trust us -->
<?php include('theytrustus.php')?>








	<!--    W E    P R O T E C T    Y O U      -->




<section id="weprotect" class="weprotect air">
	<div class="wide">
		<div class="row">
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="flexinner weprotect-box header-text align-items-center">
					<h1 class="bigger centered mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec2_title') ?></h1>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-1.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line1') ?></h2>
					<div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line1_explain') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-2.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line2') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line2_explain') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-4.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line3') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line3_explain') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="weprotect-box">
					<div class="weprotect-box-image">
						<img src="../assets/imgs/mobicons/pro-3.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line4') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line4_explain') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div id="shetypes" class="animate wbottom weprotect-box header-image">
					
				</div>
			</div>
			
		</div>
	</div>
<script type="text/javascript">

		let shetypes = document.querySelector("#shetypes");
	var w2 = new C_waved( shetypes, { animate:true, frequence:4, phase:0, speed:4, amplitude:10 });
	
</script>
	
</section>  <!--section weprotect -->



<div id="before_plan" class="animate wtop bluewhite_2" style="height:50px;">
	<script type="text/javascript">
			let before_plan = document.querySelector("#before_plan");
		var bhm = new C_waved( before_plan, { animate:true, frequence:2, phase:0, speed:10, amplitude:90 });
	</script>
</div>	
	

<section id="plan" class="plan bluewhite_2 noverflow">
                    

	<div class="wide" style="z-index:1;">
		<h1 class="bigger centered mob-txt-gray_l air unfold from-top invp mobul"><?= X('sec6_rates_title') ?></h1>
	</div>
	
	<div id="pclouds" class="clouds"></div>
		
	<div class="wide air">	
		
		<div class="row justify-content-center">

			<div class="col-md-10 col-lg-8 col-xl-12">
				<div class="plan-box centered" style=" border:2.5px solid transparent !important;">
					<div class="ribbon ribbon-top-left uppercase-letters"><span class="bold"><?= X('options_ribbon') ?></span></div>
					<div class="" style="display:inline-block; margin:0 auto;">
						<div class="plan-header" style="padding:1.5em 0.5em 0em 0.5em;">
							<a href="./pay.php" target="_blank"><div class="zoom" style="cursor:pointer;"><span class="bold mobminder centered" style="cursor:pointer;"><span class="mob-txt-blue" style="font-size:80%;">mob</span><span class="mob-txt-lime" style="font-size:80%;">minder</span><div class="mob-bg-gray_l white containerpay"><span>Pay</span></div></span></div></a>
							<p class="mob-txt-blue centered" style="padding-top:10px;"><?= X('plan_booster_title') ?></p>
						</div>
						<div class="plan-features">
							<ul id="options" class="left" style="padding:20px 15px 10px 20px;">
								<li id="option_1" class="mob-txt-gray_m uncheckedbox" style="cursor:pointer;" onclick="checkoption('option_1');"><?= X('plan_booster_option1') ?></li>
								<li id="option_2" class="mob-txt-gray_m uncheckedbox" style="cursor:pointer;" onclick="checkoption('option_2');"><?= X('plan_booster_option2') ?></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		
			<div class="col-md-10 col-lg-8 col-xl-4">
				<div class="plan-box">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_1') ?><span class="ext_title_plan" style="display:none;">&Pay</h2>
						<p class="mob-txt-gray_l left head_sub"><?= X('sec6_rate_2_text') ?></p>
						<h2 id="price_1" class="mob-txt-blue centered bold price" style="display:block;"><?= X('Price_1') ?><span class="subscript">&nbsp;<?= X('period_price') ?></span></h2> <!-- ALL prices are adapted in fonction of the nabigation country (Lux and USA) see *PA01* -->
						<h2 id="price_1_pay" class="mob-txt-blue centered bold price" style="display:none;">59 €<span class="subscript">&nbsp;<?= X('period_price') ?></span></h2>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_0') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_10bis') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_11') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_12') ?></li>
							<li class="mob-txt-gray_m addedoption option_1" style="display:none;"><?= X('plan_pay_1') ?></li>
							<li class="mob-txt-gray_m addedoption option_2" style="display:none;"><?= X('plan_pay_2') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php?cta=tp1m" class="cta cta_1"><?= X('button_CTA1') ?></a></div>
							<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd1') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
			
			<div class="col-md-10 col-lg-6 col-xl-4">
				<div class="plan-box highlighted">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_2') ?><span class="ext_title_plan" style="display:none;">&Pay</h2>
						<p class="mob-txt-gray_l head_sub"><?= X('sec6_rate_4_text') ?></p>
						<h2 id="price_2" class="mob-txt-blue centered bold price" style="display:block;"><?= X('Price_2') ?><span class="subscript">&nbsp;<?= X('period_price') ?></span></h2> 
						<h2 id="price_2_pay" class="mob-txt-blue centered bold price" style="display:none;">79 €<span class="subscript">&nbsp;<?= X('period_price') ?></span></h2>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_0_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_5_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_10') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_11') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_12_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_1_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_4_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_1_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_7_1') ?></li>
							<li class="mob-txt-gray_m addedoption option_1" style="display:none;"><?= X('plan_pay_1') ?></li>
							<li class="mob-txt-gray_m addedoption option_2" style="display:none;"><?= X('plan_pay_2') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php?cta=tp2m" class="cta cta_1"><?= X('button_CTA1') ?></a></div>
							<dd class="centered airup white"><?= X('button_CTA1_dd2') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
			
			<div class="col-md-10 col-lg-6 col-xl-4">
				<div class="plan-box">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_3') ?></h2>
						<p class="mob-txt-gray_l left head_sub"><?= X('sec6_rate_5_text') ?></p>
						<h2 class="mob-txt-blue centered bold price"><?= X('Price_3') ?></h3>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_9_2') ?><span class="ext_title_plan" style="display:none;">&Pay</li>
							<li class="mob-txt-gray_m"><?= X('plan_2_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_3_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_4_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_5_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_2') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php?cta=tp3m"  class="cta cta_1"><?= X('button_CTA1') ?></a></div>
							<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd3') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
		</div>

		<div class="airupplus">
			<p class="mob-txt-blue bold remark_price_common" style="display:none;"><?= X('remark_mobpay_title') ?></p>
			<div class="remark_price remark_price_common mob-txt-gray_m col-12 option_1" style="display:none;"><?= X('remark_mobpay_1') ?></div>
			<div class="remark_price mob-txt-gray_m col-12 option_1" style="display:none;"><?= X('remark_mobpay_2') ?></div>
			<div class="remark_price remark_price_common mob-txt-gray_m col-12" style="display:none;"><?= X('remark_mobpay_3') ?></div>
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
	
</section>


<div id="after_plan" class="animate wbottom bluewhite_2" style="height:50px;"></div>
<script type="text/javascript">
		let after_plan = document.querySelector("#after_plan");
	var bhm = new C_waved( after_plan, { animate:true, frequence:2, phase:0, speed:10, amplitude:90 });


	let findme = function() {
		this.location = 0;
		let post = new A_ps({ }, { }, '../assets/php/findme.php', { onreply:new A_cb(this,this.found) }, {/*options*/});
	};
	findme.prototype = { /* Uses findme.php to find the origin of navigation PA01*/
		found: function(stream) {
			// console.log('stream '+ stream);
			let split = stream.split('&$');
			let country = split[1];
			this.location = country;
			console.log('Country:'+country);
			if(this.location=='Luxembourg') {
					document.getElementById('price_1').innerHTML = '59€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
					document.getElementById('price_2').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
					document.getElementById('price_1_pay').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
					document.getElementById('price_2_pay').innerHTML = '99€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
			} 
			else if (this.location === 'United States') {
				document.getElementById('price_1').innerHTML = '$39<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
				document.getElementById('price_2').innerHTML = '$59<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
				document.getElementById('price_1_pay').innerHTML = '$59<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
				document.getElementById('price_2_pay').innerHTML = '$79<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
			}else {
				document.getElementById('price_1').innerHTML = '39€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
				document.getElementById('price_2').innerHTML = '59€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
				document.getElementById('price_1_pay').innerHTML = '59€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
				document.getElementById('price_2_pay').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price') ?></span>';
			}
		}
	};
	$(document).ready( function() { new findme(); } );

</script>	






	<!--    C O N T A C T     F O R M        -->

<section id="contactbanner" class="contact-wave">
	<div id="before_contact_form" class="animate wbottom thereyougo"></div>
	
	<div class="margins contact-title"><div class="row">
		<div class="col-12 col-sm-2"><h2 class="h1track mob-txt-gray_xl"></h2></div>
		<div class="col-12 col-sm-8"><h1 class="mob-txt-gray_l mobul unfold from-right invp"><?= X('header_take_contact') ?></h1></div>
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









	<!--    F O O T E R      -->





<div class="gas"></div>
<?php include('footer.php')?>
<?php include('cookies.php')?>

</body>
</html>