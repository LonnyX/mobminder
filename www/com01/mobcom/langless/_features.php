<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/features.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/features.css">
</head>

<body> <!-- class="slightwhite" */ -->


	<?php include('menu.php')?>
	


			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
            <h1>
				<a href="./index.php">
				<div class="logo centered unfold from-left s3">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
				</div>
				</a>
				<a href="./features.php#features-menu">
				<div class="headers">
					<div class="bold left mob-txt-gray_l unfold from-top s0"><?= X('top_header_l2') ?></div>
					<div class="bold left mob-txt-gray_m unfold from-top s1"><?= X('top_header_l1','main') ?></div>
				</div>
				</a>
			</h1>
		</div>
	</div>

    <!--<div class="airplus air margins row">
		
			
				<div class="flexinner col-6 col-md-4 col-xl-4 unfold v-flip s3">
					<div class="illustrated-btn white">
						<a href="#online-reservation">
							<img class ="nav-image" src="../assets/imgs/welcomebtns/web-booking.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-hand-pointer fa-1d5x mob-txt-lime"></i><?= X('eresa_title') ?></div>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-xl-4 unfold h-flip s4">
					<div class="illustrated-btn white">
						<a href="#cloud-mobile">
							<img src="../assets/imgs/welcomebtns/epayment.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-phone-laptop fa-1d5x mob-txt-lime"></i>Paiement éléctronique</div>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-xl-4 unfold v-flip s5">
					<div class="illustrated-btn white">
						<a href="#communication-reminders">
							<img src="../assets/imgs/welcomebtns/communications.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-alarm-clock fa-1d5x mob-txt-lime"></i><?= X('title_3') ?></div>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-xl-4 unfold v-flip s6">
					<div class="illustrated-btn white">
						<a href="#shared-agendas">
							<img src="../assets/imgs/welcomebtns/shared.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-users fa-1d5x mob-txt-lime"></i><?= X('title_4') ?></div>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-xl-4 unfold h-flip s7">
					<div class="illustrated-btn white">
						<a href="#simple-agenda">
							<img src="../assets/imgs/welcomebtns/simple.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-thumbs-up fa-1d5x mob-txt-lime"></i><?= X('ergonomy_title') ?></div>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-xl-4 unfold v-flip s8">
					<div class="illustrated-btn white">
						<a href="#safe-agenda">
							<img src="../assets/imgs/welcomebtns/security.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-shield-check fa-1d5x mob-txt-lime"></i><?= X('title_6') ?></div>
						</a>
					</div>
				</div>
		
	</div> -->

		<div id="features-menu" class="features-menu airupplus margins">
			<div class="row">
				<div class="flexinner col-6 col-md-4 col-lg-4">
					<div class="unfold v-flip s0 single-service zoom first">
						<a href="#online-reservation">
							<img class="first" src="../assets/imgs/welcomebtns/web-booking.jpg" alt="">
							<i class="fa fa-hand-pointer fa-1d5x mob-txt-lime"></i>
							<h3 class="mob-txt-blue"><?= X('eresa_title') ?></h3>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-lg-4">
					<div class="unfold v-flip s0 single-service zoom second">
						<a href="#payment">
							<img class="second" src="../assets/imgs/welcomebtns/epayment.jpg" alt="">
							<i class="fa fa-credit-card fa-1d5x mob-txt-lime"></i>
							<h3 class="mob-txt-blue"><?= X('epay_title') ?></h3>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-lg-4">
					<div class="unfold v-flip s0 single-service zoom third">
						<a href="#communication-reminders">
							<img class="third" src="../assets/imgs/welcomebtns/communications.jpg" alt="">
							<i class="fa fa-alarm-clock fa-1d5x mob-txt-lime"></i>
							<h3 class="mob-txt-blue"><?= X('title_3') ?></h3>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-lg-4">
					<div class="unfold v-flip s1 single-service zoom fourth">
						<a href="#shared-agendas">
							<img class="fourth" src="../assets/imgs/welcomebtns/shared.jpg" alt="">
							<i class="fa fa-users fa-1d5x mob-txt-lime"></i>
							<h3 class="mob-txt-blue"><?= X('title_4') ?></h3>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-lg-4">
					<div class="unfold v-flip s1 single-service zoom fifth">
						<a href="#simple-agenda">
							<img class="fifth" src="../assets/imgs/welcomebtns/simple.jpg" alt="">
							<i class="fa fa-thumbs-up fa-1d5x mob-txt-lime"></i>
							<h3 class="mob-txt-blue"><?= X('ergo_title') ?></h3>
						</a>
					</div>
				</div>
				<div class="flexinner col-6 col-md-4 col-lg-4">
					<div class="unfold v-flip s1 single-service zoom last">
						<a href="#safe-agenda">
							<img class="last" src="../assets/imgs/welcomebtns/security.jpg" alt="">
							<i class="fa fa-shield-check fa-1d5x mob-txt-lime"></i>
							<h3 class="mob-txt-blue"><?= X('title_6') ?></h3>
						</a>
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


<section id="online-reservation" class="features online-reservation airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('eresa_title') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 d-xl-none">
				<img src="../assets/imgs/welcomebtns/web-booking.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area pointer p-list-area">
				  <ul>
				 	<li><?= X('eresa_item12_title') ?></li>
						<p><?= X('eresa_item12_text') ?></p>
					<li><?= X('eresa_item13_title') ?></li>
						<p><?= X('eresa_item13_text') ?></p>
					<li><?= X('epay_item6_title') ?></li>
						<p><?= X('epay_item6_text') ?></p>
					<li><?= X('eresa_item3_title') ?></li>
						<p><?= X('eresa_item3_text') ?></p>
					<li><?= X('eresa_item5_title') ?></li>
						<p><?= X('eresa_item5_text') ?></p>
					<li><?= X('eresa_item6_title') ?></li>
						<p><?= X('eresa_item6_text') ?></p>
					<li><?= X('eresa_item8_title') ?></li>
						<p><?= X('eresa_item8_text') ?></p>
					<li><?= X('eresa_item_title') ?></li>
						<p><?= X('eresa_item_text') ?></p>
					<li><?= X('eresa_item1_title') ?></li>
						<p><?= X('eresa_item1_text') ?></p>
					<li><?= X('eresa_item7_title') ?></li>
						<p><?= X('eresa_item7_text') ?></p>
				  </ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
				<img src="../assets/imgs/welcomebtns/web-booking.jpg" alt=""></img>
				<div class="cta_1_centered">
					<div>
						<div><a href="./trynow.php?cta=onrf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd1') ?></dd>
					</div>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
					<div>
						<div><a href="./trynow.php?cta=onrf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd1') ?></dd>
					</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section online-reservation -->


<section id="payment" class="features payment airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('epay_title') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/welcomebtns/epayment.jpg" alt=""></img>
				<div class="cta_1_centered hidden_left">
					<div>
						<div><a href="./trynow.php?cta=elpf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd2_epay') ?></dd>
					</div>
				</div>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area bankcard p-list-area">
				  <ul class="left-padded-from-xl">
					<li><?= X('epay_item1_title') ?></li>
						<p><?= X('epay_item1_text') ?></p>
					<li><?= X('epay_item2_title') ?></li>
						<p><?= X('epay_item2_text') ?></p>
					<li><?= X('epay_item6_title') ?></li>
						<p><?= X('epay_item6_text') ?></p>
					<li><?= X('epay_item3_title') ?></li>
						<p><?= X('epay_item3_text') ?></p>
					<li><?= X('epay_item4_title') ?></li>
						<p><?= X('epay_item4_text') ?></p>
					<li><?= X('epay_item5_title') ?></li>
						<p><?= X('epay_item5_text') ?></p>
				  </ul>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
				<div>
					<div><a href="./trynow.php?cta=elpf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
					<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd2_epay') ?></dd>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section payment -->


<section id="communication-reminders" class="features communication-reminders airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('title_3') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 d-xl-none">
				<img src="../assets/imgs/welcomebtns/communications.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area clock p-list-area">
				  <ul>
					<li><?= X('reminders_item1_title') ?></li>
						<p><?= X('reminders_item1_text') ?></p>
					<li><?= X('reminders_item2_title') ?></li>
						<p><?= X('reminders_item2_text') ?></p>
					<li><?= X('reminders_item3_title') ?></li>
						<p><?= X('reminders_item3_text') ?></p>
					<li><?= X('reminders_item4_title') ?></li>
						<p><?= X('reminders_item4_text') ?></p>
					<li><?= X('reminders_item7_title') ?></li>
						<p><?= X('reminders_item7_text') ?></p>
					<li><?= X('reminders_item6_title') ?></li>
						<p><?= X('reminders_item6_text') ?></p>
					<li><?= X('reminders_item8_title') ?></li>
						<p><?= X('reminders_item8_text') ?></p>
				  </ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
				<img src="../assets/imgs/welcomebtns/communications.jpg" alt=""></img>
				<div class="cta_1_centered">
					<div>
						<div><a href="./trynow.php?cta=comf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd3') ?></dd>
					</div>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
					<div>
						<div><a href="./trynow.php?cta=comf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd3') ?></dd>
					</div>
			</div>
		</div>
	</div>
	
</section>  <!--  communication-reminders -->

<section id="shared-agendas" class="features shared-agendas airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('title_4') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/welcomebtns/shared.jpg" alt=""></img>
				<div class="cta_1_centered hidden_left">
					<div>
						<div><a href="./trynow.php?cta=shf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd4') ?></dd>
					</div>
				</div>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area users p-list-area">
					<ul class="left-padded-from-xl">
						<li><?= X('sharing_item1_title') ?></li>
							<p><?= X('sharing_item1_text') ?></p>
						<li><?= X('sharing_item2_title') ?></li>
							<p><?= X('sharing_item2_text') ?></p>
						<li><?= X('sharing_item4_title') ?></li>
							<p><?= X('sharing_item4_text') ?></p>
						<li><?= X('sharing_item8_title') ?></li>
							<p><?= X('sharing_item8_text') ?></p>
						<li><?= X('sharing_item9_title') ?></li>
							<p><?= X('sharing_item9_text') ?></p>
						<li><?= X('sharing_item7_title') ?></li>
							<p><?= X('sharing_item7_text') ?></p>
						<li><?= X('sharing_item10_title') ?></li>
							<p><?= X('sharing_item10_text') ?></p>
					</ul>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
				<div>
					<div><a href="./trynow.php?cta=shf" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
					<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd4') ?></dd>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section shared-agendas -->


<section id="simple-agenda" class="features simple-agenda airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('ergonomy_title') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 d-xl-none">
				<img src="../assets/imgs/welcomebtns/simple.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area thumb p-list-area">
				  <ul>
					<li><?= X('ergonomy_item1_title') ?></li>
						<p><?= X('ergonomy_item1_text') ?></p>
					<li><?= X('ergonomy_item7_title') ?></li>
						<p><?= X('ergonomy_item7_text') ?></p>
					<li><?= X('ergonomy_item2_title') ?></li>
						<p><?= X('ergonomy_item2_text') ?></p>
					<li><?= X('sharing_item3_title') ?></li>
						<p><?= X('sharing_item3_text') ?></p>
					<li><?= X('sharing_item5_title') ?></li>
						<p><?= X('sharing_item5_text') ?></p>
					<li><?= X('sharing_item6_title') ?></li>
						<p><?= X('sharing_item6_text') ?></p>
					<li><?= X('cloud_item7_title') ?></li>
						<p><?= X('cloud_item7_text') ?></p>
				  </ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
				<img src="../assets/imgs/welcomebtns/simple.jpg" alt=""></img>
				<div class="cta_1_centered">
					<div>
						<div><a href="./trynow.php?cta=ergof" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd5') ?></dd>
					</div>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
					<div>
						<div><a href="./trynow.php?cta=ergof" class="cta cta_1 shadowed"><?= X('button_CTA1') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd5') ?></dd>
					</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section simple-agenda -->

<section id="safe-agenda" class="features safe-agenda airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('title_6') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/welcomebtns/security.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area shield p-list-area">
					<ul class="left-padded-from-xl">
						<li><?= X('cloud_item1_title') ?></li>
							<p><?= X('cloud_item1_text') ?></p>
						<li><?= X('ergonomy_item3_title') ?></li>
							<p><?= X('ergonomy_item3_text') ?></p>
						<li><?= X('security_item3_title') ?></li>
							<p><?= X('security_item3_text') ?></p>
						<li><?= X('cloud_item5_title') ?></li>
							<p><?= X('cloud_item5_text') ?></p>
						<li><?= X('security_item1_title') ?></li>
							<p><?= X('security_item1_text') ?></p>
						<li><?= X('security_item2_title') ?></li> <!--<a class="mob-txt-blue" href='https://www.cresco.be/' target="_blank"> <span class="lime-hover">Cresco cybersecurity</span></a></li> -->
							<p><?= X('security_item2_text') ?></p>
					</ul>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section safe-agenda -->

<div id="before_cta1" class="animate wtop slightwhite" style="height:50px;">
	<script type="text/javascript">
			let before_cta1 = document.querySelector("#before_cta1");
		var bhm = new C_waved( before_cta1, { animate:true, frequence:2, phase:0, speed:10, amplitude:100 });
		
	</script>
</div>	

<section id="try-free" class="air slightwhite">

	<div class="margins">
			<h1 class="bigger centered mob-txt-gray_l"><?= X('try_free_title_1') ?></h1>
			<p class="bigger centered air mob-txt-blue airplus"><?= X('try_free_title_2') ?></p>
	</div>

	<div class="margins">
		<div class="row">
			<div class="flexinner col-12 col-md-6 cta1-centered">
				<a href="./trynow.php?cta=lastf" class="cta cta_1 shadowed"><?= X('button_CTA1','main') ?></a>
			</div>
			<div class="list-area checked col-12 col-md-6">
				<ul class="mob-txt-gray_m bold">
						<li><?= X('button_CTA1_dd2','main') ?></li>
						<li><?= X('button_CTA1_dd3','main') ?></li>
				</ul>
			</div>
		</div>
	</div>

	<div class="slider slider500">
		<div class="slide-track scroll-to-left">
			<span class="copy-me">
				<div class="slide slide-features"><img src="../assets/imgs/slider/macbook.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/smartphone.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/tablets.png" alt=""></img></div>
				<div class="slide slide-features"><img src="../assets/imgs/slider/mac.png" alt=""></img></div>
			</span>
		</div>
	</div>

	

	<script type="text/javascript">
			$('#try-free').find('.slide-track').each(
				function() {
					let wagon = $(this).html(); // (-st01-)
					$(this).find('.copy-me').after(wagon).after(wagon).after(wagon);					
					setTimeout(function() { // hand back to browser so it figures out the new element width (containing now 4 span wagons)
						$('#try-free').find('.slide-track').addClass('go'); // go start the animation 
					}, 1000); 
				}
			)
	</script>


</section>  <!--  section try-free -->




<div class="gas"></div>


<?php include('footer.php')?>
<?php include('cookies.php')?>
		
</body>
</html>