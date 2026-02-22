<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/partnership.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/partnership.css">
</head>

<body> 


	<?php include('menu.php')?>
	


			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
			<h1>
				<a href="./index.php">
				<div class="logo centered unfold from-left s4">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
				</div>
				</a>
				<div class="headers">
					<div class="bold left mob-txt-gray_d unfold from-top s0"><?= X('top_header_l1') ?></div>
					<div class="bold left mob-txt-gray_m unfold from-top s1"><?= X('top_header_l2') ?></div>
					<div class="bold left mob-txt-gray_l unfold from-top s2"><?= X('top_header_l3') ?></div>
				</div>
			</h1>
		</div>
	</div>

    <div class="advantages">
		<div class="wide">
			<h2 class="centered white airplus airupplus"><?= X('page_intro') ?></h2>
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



	<!--   P A R T N E R    T Y P E S     -->




	<section id="partner_types" class="partner-types air">
	<div class="wide">
		<div class="row">
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="flexinner partner-types-box header-text align-items-center">
					<h1 class="bigger centered mob-txt-gray_l air unfold from-bottom invp"><?= X('sec1_title') ?></h1>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6">
				<div class="partner-types-box">
					<div class="partner-types-box-image">
						<img src="../assets/imgs/mobicons/pro-3.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line1') ?></h2>
					<div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div>
					<h2 class="mob-txt-blue air unfold roll-left invp airup"><?= X('sec2_line1b') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line1_explain') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6 airupplus">
				<div class="partner-types-box">
					<div class="partner-types-box-image">
						<img src="../assets/imgs/mobicons/offers.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line2') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<h2 class="mob-txt-blue air unfold roll-left invp airup"><?= X('sec2_line2b') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line2_explain') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6 airupplus">
				<div class="partner-types-box">
					<div class="partner-types-box-image">
						<img src="../assets/imgs/mobicons/business.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line3') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<h2 class="mob-txt-blue air unfold roll-left invp airup"><?= X('sec2_line3b') ?></h2>
					<p class="centered mob-txt-gray_d"><?= X('sec2_line3_explain') ?></p>
				</div>
			</div>
			<div class="flexinner col-12 col-md-6 col-lg-6 airupplus">
				<div class="partner-types-box">
					<div class="partner-types-box-image">
						<img src="../assets/imgs/mobicons/talent.png" alt="">
					</div>
					<h2 class="mob-txt-blue air unfold roll-left invp"><?= X('sec2_line4') ?></h2>
					<div><div class="fa-block fad fa-arrow-down fa-3x mob-txt-blue"></div></div>
					<h2 class="mob-txt-blue air unfold roll-left invp airup"><?= X('sec2_line4b') ?></h2>
					<p class="centered partner-types mob-txt-gray_d"><?= X('sec2_line4_explain') ?></p>
				</div>
			</div>
			
			<div class="flexinner col-12 col-md-6 col-lg-6 airupplus">
				<div id="shetypes" class="animate wbottom partner-types-box header-image">
					
				</div>
			</div>
			
		</div>
	</div>
<script type="text/javascript">

		let shetypes = document.querySelector("#shetypes");
	var w2 = new C_waved( shetypes, { animate:true, frequence:4, phase:0, speed:4, amplitude:10 });
	
</script>
	
</section>  <!--section weprotect -->



<section id="distribution-types" class="distribution-types air">  <!--   D I S T R I B U T I O N   T Y P E S  -->


	<div class="wide airupplus">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec2_title') ?></h1>
	</div>

	<div class="margins sales-cycle centered">
		<p class="mob-txt-blue airplus centered"><?= X('sec2_intro') ?></p>
		<div class="row">
			<div class="col-2 col-xl-2">
				<i class="fad fa-users-medical mob-txt-blue"></i><br> 
				<span class="mob-txt-gray_d bold unfold from-top invp left"><?= X('sec2_cycle1') ?></span>
			</div>
			<div class="col-2 col-xl-2">
				<i class="fad fa-file-signature mob-txt-blue"></i><br>
				<span class="mob-txt-gray_d bold unfold from-top invp left"><?= X('sec2_cycle2') ?></span>
			</div>
			<div class="col-2 col-xl-2">
				<i class="fad fa-user-cog mob-txt-blue"></i><br>
				<span class="mob-txt-gray_d bold unfold from-top invp left"><?= X('sec2_cycle3') ?></span>
			</div>
			<div class="col-2 col-xl-2">
				<i class="fad fa-user-chart mob-txt-blue"></i><br>
				<span class="mob-txt-gray_d bold unfold from-top invp left"><?= X('sec2_cycle4') ?></span>
			</div>
			<div class="col-2 col-xl-2">
				<i class="fad fa-file-invoice-dollar mob-txt-blue"></i><br>
				<span class="mob-txt-gray_d bold unfold from-top invp left"><?= X('sec2_cycle5') ?></span>
			</div>
			<div class="col-2 col-xl-2">
				<i class="fad fa-hands-helping mob-txt-blue"></i><br>
				<span class="mob-txt-gray_d bold unfold from-top invp left"><?= X('sec2_cycle6') ?></span>
			</div>
		</div>
	</div>


	<div class="wide airupplus">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/partnership/handshake.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area handshake p-list-area">
					<ul class="left-margin-ul left-padded-from-xl">
						<li><?= X('sec2_cell_2_title') ?><span><i class="fad fa-users-medical"></i></span></li>
							<p class="air"><?= X('sec2_cell_2_text') ?></p>
						<li><?= X('sec2_cell_3_title') ?><span><i class="fad fa-users-medical"></i><i class="fad fa-file-signature"></i><i class="fad fa-user-cog"></i><i class="fad fa-user-chart"></i><i class="fad fa-file-invoice-dollar"></i><i class="fad fa-hands-helping"></i></span></li>
							<p class="air"><?= X('sec2_cell_3_text') ?></p>
					</ul>
				</div>
			</div>

			<div class="pre-img col-12 d-xl-none air">
				<img src="../assets/imgs/partnership/teamwork.jpg" alt=""></img>
			</div>

			<div class="col-12 col-xl-8">
				<div class="list-area handshake p-list-area">
					<ul>
						<li><?= X('sec2_cell_4_title') ?><span><i class="fad fa-users-medical"></i><i class="fad fa-file-signature"></i><i class="fad fa-user-cog"></i><i class="fad fa-user-chart"></i><i class="fad fa-hands-helping"></i></span></li>
							<p class="air"><?= X('sec2_cell_4_text') ?></p>
						<li><?= X('sec2_cell_5_title') ?><span><i class="fad fa-users-medical"></i><i class="fad fa-file-signature"></i><i class="fad fa-user-cog"></i><i class="fad fa-user-chart"></i><i class="fad fa-file-invoice-dollar"></i><i class="fad fa-hands-helping"></i></span></li>
							<p class="air"><?= X('sec2_cell_5_text') ?></p>
						<li><?= X('sec2_cell_1_title') ?><span><i class="fad fa-users-medical"></i><i class="fad fa-file-signature"></i><i class="fad fa-user-cog"></i><i class="fad fa-user-chart"></i><i class="fad fa-file-invoice-dollar"></i><i class="fad fa-hands-helping"></i></span></li>
							<p class="air"><?= X('sec2_cell_1_text') ?></p>
					</ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
					<img src="../assets/imgs/partnership/teamwork.jpg" alt=""></img>
			</div>
		</div>
		
		<div class="margins airup">
			<p class="mob-txt-blue centered"><?= X('sec5_cell_1_text') ?></p>
		</div>
	</div>

</section>  <!-- distribution types  -->


<section id="api" class="api">  <!--   A P I  -->


	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec3_title') ?></h1>
	</div>

	<div class="row wide">
		<div class="pre-img col-12 col-xl-4">
			<img src="../assets/imgs/partnership/api.jpg" alt=""></img>
		</div>
		<div class="col-12 col-xl-8">
			<div class="list-area link p-list-area">
				<ul class="left-margin-ul left-padded-from-xl">
					<li><?= X('sec3_cell_1_title') ?></li>
						<p class="air"><?= X('sec3_cell_1_text') ?></p>
					<li><?= X('sec3_cell_2_title') ?></li>
						<p class="air"><?= X('sec3_cell_2_text') ?></p>
					<li><?= X('sec3_cell_3_title') ?></li>
						<p class="air"><?= X('sec3_cell_3_text') ?></p>
				</ul>
			</div>
		</div>
	</div>

</section>  <!-- distribution types  -->



<section id="whyus" class="whyus relative"> <!--   W H Y   U S     -->
	<div id="vwrapper" class="animate wbottom">
		<div class="worldmapshade"></div>
		<div id="worldmap" class="animate wbottom worldmap">
			<div class="margins">
				<h1 class="bigger left mob-txt-gray_l unfold from-top invp"><?= X('header_take_contact') ?></h1>
			</div>
		</div>
		<div id="differentiators" class="differentiators">
			<div class="advantages list-area checked p-list-area airupplus airplus margins">
				<ul class="mob-txt-gray_d">
					<li><?= X('whyus1') ?></li>
						<p><?= X('whyus1_text') ?></p>
					<li><?= X('whyus2') ?></li>
						<p><?= X('whyus2_text') ?></p>
					<li><?= X('whyus3') ?></li>
						<p><?= X('whyus3_text') ?></p>
					<li><?= X('whyus4') ?></li>
						<p><?= X('whyus4_text') ?></p>
					<li><?= X('whyus5') ?></li>
						<p><?= X('whyus5_text') ?></p>
				</ul>
			</div>
		</div>
	</div>
<script type="text/javascript">

		let el2 = document.querySelector("#worldmap");
	var w2 = new C_waved( el2, { animate:true, frequence:2, phase:0, speed:8, amplitude:8 });
	
		let el3 = document.querySelector("#vwrapper");
		let phase = -1/2;
	var w3 = new C_waved( el3, { animate:true, frequence:2, phase:phase, speed:8, amplitude:4 });

</script>
<div id="before_contact_form" class="air"></div>
</section>  <!-- section why us -->



<?php include('partnerform.php')?> 
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
		
</body>
</html>