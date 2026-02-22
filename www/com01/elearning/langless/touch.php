<!doctype html>
<html>

<head>
	<title>Plateforme e-learning smart agenda Mobminder</title>
	<meta name="description" content="<?= X('pageDescription','index') ?>">
	<link rel="canonical" href="https://elearning.mobminder.com/<?=$l?>/touch.php"/>
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/elearning.css">
	<script src="../assets/js/elearning.js"></script>
</head>

<?php
	$c='touch';
?>

<body> <!-- class="slightwhite" */ -->

			<!--    M E N U    E L E A R N I N G   -->

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
	<div class="advantages">
		<div class="margins">
			<h1 class="mobminder centered mob-txt-gray_l unfold from-left s3"><?= X('main_title') ?></h1>
			<h2 class="mobminder centered mob-txt-gray_l unfold from-left s3"><?= X('main_subtitle') ?></h1>
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


		<!--   V I D E O  T O U C H   D E V I C E   -->


<section id="touchvideo" class="touchvideo air">


<div class="wide">
	<div class="wide air">
		<video 	id="video_touch" class="video-js vjs-fluid" poster="../assets/imgs/poster/app.png"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/MobAppLift.mp4" type="video/mp4" /></video>
	</div>
		
	<div class="checked-list-area">
			<ul class="mob-txt-gray_m">
			<li><?= X('touch_instruction2') ?></li>
			<li><?= X('touch_instruction1') ?></li>
			<li><?= X('touch_instruction3') ?></li>
			<li><?= X('touch_instruction4') ?></li>
			<li><?= X('touch_instruction5') ?></li>
			<li><?= X('touch_instruction6') ?></li>
			<li><?= X('touch_instruction7') ?></li>
			<li><?= X('touch_instruction8') ?></li>
			<li><?= X('touch_instruction9') ?></li>
			<li><?= X('touch_instruction10') ?></li>
			</ul>
	</div>
	<script>
		$(document).ready(function() {
		var options = {
			controls: true,
			preload: 'none',
			fluid: true
		}
		var touch_vid_ready = function() { console.log('player ready: ', this.id_ ) };
		var p = videojs('video_touch', options, touch_vid_ready);
		
		console.log('document ready');
	});
	</script>
</div>
	
</section>

		<!--   V I D E O   Q R   C O D E    I N S T R U C T I O N S   -->


<section id="touchvideo-qrcode" class="touchvideo-qrcode air">


<div class="wide">
	<div class="wide air">
		<div class="say air"><h1 class="mob-txt-gray_l bigger centered"><?= X('qr_code_payment') ?></h1></div>
		<video 	id="video_touch_qrcode" class="video-js vjs-fluid" poster="../assets/imgs/poster/qrcode.png"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/tutoqr-code.mp4" type="video/mp4" /></video>
	</div>

	<script>
		$(document).ready(function() {
		var options = {
			controls: true,
			preload: 'none',
			fluid: true
		}
		var touch_vid_ready = function() { console.log('player ready: ', this.id_ ) };
		var p = videojs('video_touch_qrcode', options, touch_vid_ready);
		
		console.log('document ready');
	});
	</script>
</div>
	
</section>



		<!--   C O M P A T I B I L I T Y   ( D O W N L O A D   N O W )    -->

<section id="compatibility" class="compatibility">
		<div class="air"></div>
		<div class="say"><h1 class="mob-txt-gray_l bigger centered"><?= X('download_now') ?></h1></div>
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
			</ul>
		</div>
		<div class="gas"></div>

</section> <!-- section compatibility -->

<?php include('footer.php')?>
		
</body>
</html>