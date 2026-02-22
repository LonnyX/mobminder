<!doctype html>
<html translate="no">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
		<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/directory.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/directory.css">
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
				<a href="./index.php">
					<div class="left logo unfold from-left zoom s3">
						<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
						<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
					</div>
					<div class="headers">
						<div class="bold main-header left mob-txt-gray_l unfold from-up s1" style="font-size:100%; padding-bottom:0.3em;"><?= X('top_header_l1') ?></div>
					</div>
				</a>
			</h1>
		</div>
	</div>




	<div class="advantages margins">
		<div class="promotion-box unfold from-left s2">
			<div class="promotion-box-inner" style="margin-top:60px;">
				<div class="row">
					<div class="col-4 col-xl-12 promotion-box-img"><img src="../assets/imgs/mobicons/search.png" alt=""></div>
					<div class="col-8 col-xl-12"><h2 class="bold mob-txt-gray_m "><?= X('intro_title') ?></h2></div>
				</div>
				<p class="mob-txt-gray_d"><?= X('intro_text') ?> 
				<div class="flexinner center air airup"><i class="fas fa-1d5x fa-hand-point-down mob-txt-blue"></i></div>
				<p class="mob-txt-gray_d"><?= X('intro_text2') ?>
				<br>
				<br>
				</p>
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





	<!--    D I R E C T O R Y   P R O B L E M S    -->



<section id="directory-problems" class="directory-problems air">


	<div class="wide airupplus">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec1_title') ?></h1>
	</div>

	<div class="wide airupplus">
		<div class="row align-items-center">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/directories/directory-reviews.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area cross p-list-area">
					<ul class="left-margin-ul left-padded-from-xl">
						<li class="red"><?= X('top_problem_c1') ?></li>
							<p class="air"><?= X('top_problem_t1') ?></p>
					</ul>
				</div>
			</div>

			<div class="pre-img col-12 d-xl-none air">
				<img src="../assets/imgs/directories/directory-ads.jpg" alt=""></img>
			</div>

			<div class="col-12 col-xl-8">
				<div class="list-area cross p-list-area">
					<ul>
					<li class="red"><?= X('top_problem_c2') ?></li>
							<p class="air"><?= X('top_problem_t2') ?></p>
					</ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
					<img src="../assets/imgs/directories/directory-ads.jpg" alt=""></img>
			</div>

			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/directories/directory-lost.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area cross p-list-area">
					<ul class="left-margin-ul left-padded-from-xl">
						<li class="red"><?= X('top_problem_c3') ?></li>
							<p class="air"><?= X('top_problem_t3') ?></p>
					</ul>
				</div>
			</div>

			<div class="pre-img col-12 d-xl-none air">
				<img src="../assets/imgs/directories/directory-security.jpg" alt=""></img>
			</div>

			<div class="col-12 col-xl-8 last-item">
				<div class="list-area cross p-list-area">
					<ul>
					<li class="red"><?= X('top_problem_c4') ?></li>
						<p class="air"><?= X('top_problem_t4') ?></p>
						<a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener nofollow"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="color:#C3D949; cursor:pointer;"><i class="fa fa-hand-pointer mob-txt-lime"></i>&nbsp;&nbsp;<?= X('top_problem_t41') ?></p></a>
						<a href="https://www.capital.fr/entreprises-marches/doctolib-au-coeur-dun-scandale-autour-de-lenvoi-de-donnees-a-facebook-1407456"target="blank" rel="noopener nofollow"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="color:#C3D949; cursor:pointer;"><i class="fa fa-hand-pointer mob-txt-lime"></i>&nbsp;&nbsp;<?= X('top_problem_t42') ?></p></a>
						<a href="https://youtu.be/cb3jfxMnZU4"target="blank" rel="noopener nofollow"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="color:#C3D949; cursor:pointer;"><i class="fa fa-hand-pointer mob-txt-lime"></i>&nbsp;&nbsp;<?= X('top_problem_t43') ?></p></a>
					</ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
					<img src="../assets/imgs/directories/directory-security.jpg" alt=""></img>
			</div>
			
		</div>

	</div>

</section>  <!-- directory problems  -->



	<!--    S O L U T I O N S    -->

<section id="solutions" class="solutions air">


	<div class="wide airupplus">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec2_title') ?></h1>
	</div>

	<div class="wide airupplus">
		<div class="row align-items-center">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/directories/us-google.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area ok p-list-area">
					<ul class="left-margin-ul left-padded-from-xl">
						<li style="color:#C3D949"><?= X('top_solution_c1') ?></li>
							<p class="air"><?= X('top_solution_t1') ?></p>
					</ul>
				</div>
			</div>

			<div class="pre-img col-12 d-xl-none air">
				<img src="../assets/imgs/directories/us-website.jpg" alt=""></img>
			</div>

			<div class="col-12 col-xl-8">
				<div class="list-area ok p-list-area">
					<ul>
					<li style="color:#C3D949"><?= X('top_solution_c2') ?></li>
							<p class="air"><?= X('top_solution_t2') ?></p>
					</ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
					<img src="../assets/imgs/directories/us-website.jpg" alt=""></img>
			</div>

			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/directories/us-security.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area ok p-list-area">
					<ul class="left-margin-ul left-padded-from-xl">
						<li style="color:#C3D949"><?= X('top_solution_c3') ?></li>
							<p class="air"><?= X('top_solution_t3') ?></p>
					</ul>
				</div>
			</div>

			<div class="pre-img col-12 d-xl-none air">
				<img src="../assets/imgs/directories/us-agenda.jpg" alt=""></img>
			</div>

			<div class="col-12 col-xl-8">
				<div class="list-area ok p-list-area">
					<ul>
					<li style="color:#C3D949"><?= X('top_solution_c4') ?></li>
						<p class="air"><?= X('top_solution_t4') ?></p>
					</ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
					<img src="../assets/imgs/directories/us-agenda.jpg" alt=""></img>
			</div>

			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/directories/us-communications.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area ok p-list-area">
					<ul class="left-margin-ul left-padded-from-xl">
						<li style="color:#C3D949"><?= X('top_solution_c5') ?></li>
							<p class="air"><?= X('top_solution_t5') ?></p>
					</ul>
				</div>
			</div>

			<div class="pre-img col-12 d-xl-none air">
				<img src="../assets/imgs/directories/us-pricing.jpg" alt=""></img>
			</div>

			<div class="col-12 col-xl-8">
				<div class="list-area ok p-list-area">
					<ul>
					<li style="color:#C3D949"><?= X('top_solution_c6') ?></li>
						<p class="air"><?= X('top_solution_t6') ?></p>
						<a href="./index.php#before_plan"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="color:#C3D949; cursor:pointer;"><i class="fa fa-hand-pointer mob-txt-lime"></i>&nbsp;&nbsp;<?= X('sec3_t11') ?></p></a>
					</ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
					<img src="../assets/imgs/directories/us-pricing.jpg" alt=""></img>
			</div>
			
		</div>

	</div>

</section>  <!-- solutions -->



<section id="simplify-cycle" class="simplify-cycle air">  <!--   S I M P L I F Y   C Y C L E    -->

	<div class="wide airupplus">
			<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec3_title') ?></h1>
	</div>

	<div class="wide row patient-cycle centered">
			<div class="col-12 col-lg-3">
				<i class="fad fa-file-search mob-txt-lime"></i><br> 
				<span class="mob-txt-blue unfold from-top invp"><?= X('sec3_c1') ?></span>
			</div>
			<div class="col-12 col-lg-3">
				<i class="fad fa-file-check mob-txt-lime"></i><br>
				<span class="mob-txt-blue unfold from-top invp"><?= X('sec3_c2') ?></span>
			</div>
			<div class="col-12 col-lg-3">
				<i class="fad fa-user-plus mob-txt-lime"></i><br>
				<span class="mob-txt-blue unfold from-top invp"><?= X('sec3_c3') ?></span>
			</div>
			<div class="col-12 col-lg-3">
				<i class="fad fa-comment-lines mob-txt-lime"></i><br>
				<span class="mob-txt-blue unfold from-top invp"><?= X('sec3_c4') ?></span>
			</div>
		</div>

		<div class="wide airupplus">
			<div class="row align-items-center">
				<div class="pre-img col-12 col-xl-4">
					<img src="../assets/imgs/directories/shake-hands.jpg" alt=""></img>
				</div>

				<div class="col-12 col-xl-8">
					<p class="mob-txt-gray_d airplus left-padded-from-xl"><?= X('sec3_t1') ?></p>
				</div>
			</div>
		</div>

</section> 


<div id="before_cta1" class="animate wtop slightwhite" style="height:50px;">
	<script type="text/javascript">
			let before_cta1 = document.querySelector("#before_cta1");
		var bhm = new C_waved( before_cta1, { animate:true, frequence:2, phase:0, speed:10, amplitude:100 });
		
	</script>
</div>	

<section id="discover-us" class="discover-us air slightwhite"> <!--   D I S C O V E R   U S     -->


	<div class="wide airupplus">
			<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec4_title') ?></h1>
	</div>

	<div class="wide">

		<div class="row">
			<div class="flexinner col-12 col-xl-6 cta1-centered align-items-center">
				<div>
					<a href="./index.php" class="cta cta_1 shadowed" style="background-image:linear-gradient(145deg,white,white,white); color:#F4732A; margin-bottom:30px; text-shadow:none;"><?= X('CTA_1') ?></a>
					<a href="./index.php#contactbanner" class="cta cta_1 shadowed"><?= X('CTA_2') ?></a>
				</div>
			</div>

			<div class="flexinner col-12 col-xl-6 list-area checked align-items-center">
				<ul class="mob-txt-gray_m bold">
					<li><?= X('sec4_t1') ?></li>
				</ul>
			</div>
		</div>
	</div>


	
</section>
<section class="airup mob-txt-gray_m"><dd><?= X('legal_note') ?></dd></section>


	<!--    F O O T E R      -->





<div class="gas"></div>
<?php include('footer.php')?>
<?php include('cookies.php')?>

</body>
</html>