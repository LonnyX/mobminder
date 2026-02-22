<!doctype html>
<html>

<head>
	
	<title>Plateforme e-learning agenda Mobminder</title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://elearning.mobminder.com/<?=$l?>/index.php"/>
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/elearning.css">
	<script src="../assets/js/elearning.js"></script>
</head>

<body> <!-- class="slightwhite" */ -->

	<?php include('menu.php')?>

			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			
<section id="clouds" class="welcome air">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins" style="padding-top:1em;">
		<a href="https://www.mobminder.com/<?=$l?>/index.php" target="_blank"><img class="moblogo medium zoom" src="../assets/imgs/icon-1.png" alt="mobminder logo"></a>
			<div class="headers">
				<h1 class="bold mobminder left unfold from-top s1"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></h1>
				<h1 class="left mob-txt-gray_m unfold from-left s2"><?= X('top_header_l2','index') ?></h1>
				<h1 class="left mob-txt-gray_m unfold from-bottom s3"><?= X('top_header_l3','index') ?></h1>
			</div>
		</div>
	</div>
	<div class="airplus air wide row">
		
			
				<div class="flexinner col-xs-12 col-sm-12 col-md-4 col-lg-4 unfold from-bottom s3">
					<div class="illustrated-btn white">
						<a href="./single.php">
							<img src="../assets/imgs/elearning/single_agenda.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-square fa-1d5x mob-txt-lime"></i>&nbsp;&nbsp;<?= X('top_menu_1','index') ?></div>
						</a>
					</div>
				</div>
				<div class="flexinner col-xs-12 col-sm-12 col-md-4 col-lg-4 unfold from-bottom s3">
					<div class="illustrated-btn white">
						<a href="./multi.php">
							<img src="../assets/imgs/elearning/multi_agenda.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-layer-group fa-1d5x mob-txt-lime"></i>&nbsp;&nbsp;<?= X('top_menu_2','index') ?></div>
						</a>
					</div>
				</div>
				<div class="flexinner col-xs-12 col-sm-12 col-md-4 col-lg-4 unfold from-bottom s3">
					<div class="illustrated-btn white">
						<a href="./touch.php">
							<img src="../assets/imgs/elearning/touch_device_agenda.jpg" alt="">
							<div class="mob-txt-gray_d cta_3"><i class="fa fa-mobile-alt fa-1d5x mob-txt-lime"></i>&nbsp;&nbsp;<?= X('top_menu_3','index') ?></div>
						</a>
					</div>
				</div>
			
		
	</div>

<script type="text/javascript">

	let el1 = document.querySelector("#welcome"); // wave the upper sky border
	var w1 = new C_waved( el1, { animate:true });
	
	var clouds = document.querySelector("#clouds"); // let the clouds flow
	var c = 3000;
	(function wind() {
		let d = ((c++)/90);
		clouds.style.backgroundPosition ="left "+d+"px bottom 0%"; // (*cp01*)
		requestAnimationFrame(wind);
	})();
	
</script>
</section>  <!-- section welcome -->


<div class="gas"></div>


<?php include('footer.php')?>
		
</body>
</html>