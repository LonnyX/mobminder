<!doctype html>
<html>

<head>
	
	<title>Plateforme e-learning agenda multi Mobminder</title>
	<meta name="description" content="<?= X('pageDescription','index') ?>">
	<link rel="canonical" href="https://elearning.mobminder.com/<?=$l?>/multi.php"/>
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/elearning.css">
	<script src="../assets/js/elearning.js"></script>
</head>

<?php
	$c='multi';
?>

<body> <!-- class="slightwhite" */ -->

			<!--    M E N U    E L E A R N I N G   -->

	<?php include('menu.php')?>


	<div id="safari-warning" class="safari-warning centered" style="display:none;">
		<?= X('warning_safari','single') ?>
	</div>

	<script>
		function isSafariDesktop() {
		const ua = navigator.userAgent;

		// Detect Safari (exclude Chrome and Android)
		const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

		// Exclude mobile/tablet devices
		const isNotMobile = !/Mobi|iPhone|iPad|iPod|Android/i.test(ua);

		return isSafari && isNotMobile;
		}

		if (isSafariDesktop()) {
		document.getElementById('safari-warning').style.display = 'block';
		}
	</script>



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


		<!--    A C C O R D E O N     V I D E O   -->


<section id="howdoesitwork" class="howdoesitwork air">


<div class="margins">
	<ul class="accordeon">

		<?php $i=1; $s='A'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" checked="true"/>
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('basics','single') ?></h2></label>
				<div class="sub">
					<ul class="mob-txt-gray_d sub">
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_log_in','single') ?></li>
							<div class="vwrap">
								<video id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/log_in_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_log_in_expl1','single') ?></li>
									<li class="instruction"><?= X('single_log_in_expl2','single') ?></li>
									<li class="instruction"><?= X('single_log_in_expl3','single') ?></li>
									<li class="instruction"><?= X('single_log_in_expl4','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_access','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/access_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_access_expl1','single') ?></li>
									<li class="instruction"><?= X('single_access_expl2','single') ?></li>
									<li class="instruction"><?= X('single_access_expl3','single') ?></li>
									<li class="instruction"><?= X('single_access_expl4','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_12','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/log_out_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_log_out_expl1','single') ?></li>
									<li class="instruction"><?= X('single_log_out_expl2','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_08','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/check_week_view_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('week_view_expl1') ?></li>
									<li class="instruction"><?= X('week_view_expl2') ?></li>
									<li class="instruction"><?= X('week_view_expl3') ?></li>
								</ol>
								<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('week_view_expl4') ?></li>
									<li class="instruction"><?= X('week_view_expl5') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_15','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/navigate_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('navigate_expl1','single') ?></li>
									<li class="instruction"><?= X('navigate_expl2','single') ?></li>
									<li class="instruction"><?= X('navigate_expl3','single') ?></li>
									<li class="instruction"><?= X('navigate_expl4','single') ?></li>
									<li class="instruction"><?= X('navigate_expl5','single') ?></li>
									<li class="instruction"><?= X('navigate_expl6','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_01','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/add_visitor_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_add_visitor_expl1','single') ?></li>
									<li class="instruction"><?= X('single_add_visitor_expl2','single') ?></li>
									<li class="instruction"><?= X('single_add_visitor_expl3','single') ?></li>
								</ol>
								<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_add_visitor_expl4','single') ?></li>
									<li class="instruction"><?= X('single_add_visitor_expl5','single') ?></li>
									<li class="instruction"><?= X('single_add_visitor_expl6','single') ?></li>
									<li class="instruction"><?= X('single_add_visitor_expl7','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_13','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/search_visitor_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_search_visitor_expl1','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl2','single') ?></li>
									    <ul class="sub-instruction-list">
											<li><?= X('single_search_visitor_expl2_option1','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option2','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option3','single') ?></li>
    									</ul>
									<li class="instruction"><?= X('single_search_visitor_expl3','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl4','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_02','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/add_appointment_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_search_visitor_expl1','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl2','single') ?></li>
										<ul class="sub-instruction-list">
											<li><?= X('single_search_visitor_expl2_option1','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option2','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option3','single') ?></li>
    									</ul>
									<li class="instruction"><?= X('single_search_visitor_expl3','single') ?></li>
									<li class="instruction"><?= X('single_add_appointment_expl4','single') ?></li>
									<li class="instruction"><?= X('single_add_appointment_expl5','single') ?></li>
									<li class="instruction"><?= X('single_add_appointment_expl6','single') ?></li>
									<li class="instruction"><?= X('single_add_appointment_expl7','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_03','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/add_appointment_planning_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_add_appointment_planning_2025_expl1','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl2','single') ?></li>
										<ul class="sub-instruction-list">
											<li><?= X('single_search_visitor_expl2_option1','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option2','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option3','single') ?></li>
    									</ul>
									<li class="instruction"><?= X('single_search_visitor_expl3','single') ?></li>
									<li class="instruction"><?= X('single_add_appointment_expl4','single') ?></li>
									<li class="instruction"><?= X('single_add_appointment_expl7','single') ?></li>
									<li class="instruction"><?= X('multi_add_appointment_planning_2025_expl6') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_01','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/have_more_than_one_visitor_in_unique_appointment_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('single_add_appointment_planning_2025_expl1','single') ?></li>
								<li class="instruction"><?= X('single_search_visitor_expl2','single') ?></li>
									<ul class="sub-instruction-list">
										<li><?= X('single_search_visitor_expl2_option1','single') ?></li>
										<li><?= X('single_search_visitor_expl2_option2','single') ?></li>
										<li><?= X('single_search_visitor_expl2_option3','single') ?></li>
									</ul>
								<li class="instruction"><?= X('single_search_visitor_expl3','single') ?></li>
								<li class="instruction"><?= X('single_have_more_than_one_visitor_in_unique_appointment_expl3','single') ?></li>
								<li class="instruction"><?= X('single_have_more_than_one_visitor_in_unique_appointment_expl4','single') ?></li>
								<li class="instruction"><?= X('single_have_more_than_one_visitor_in_unique_appointment_expl5','single') ?></li>
								<li class="instruction"><?= X('single_add_appointment_expl7','single') ?></li>
								<li class="instruction"><?= X('single_have_more_than_one_visitor_in_unique_appointment_expl7','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_04','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/find_appointment_visitor_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_search_visitor_expl1','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl2','single') ?></li>
									    <ul class="sub-instruction-list">
											<li><?= X('single_search_visitor_expl2_option1','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option2','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option3','single') ?></li>
    									</ul>
									<li class="instruction"><?= X('single_search_visitor_expl3','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl4','single') ?></li>
									<li class="instruction"><?= X('search_visitor_appt_end_expl','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_05','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/delete_appointment_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('cancel_1','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('cancel_1_expl1','single') ?></li>
									<li class="instruction"><?= X('cancel_1_expl2','single') ?></li>
									<li class="instruction"><?= X('cancel_1_expl3','single') ?></li>
								</ol>
								<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('cancel_2','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('single_search_visitor_expl1','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl2','single') ?></li>
									    <ul class="sub-instruction-list">
											<li><?= X('single_search_visitor_expl2_option1','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option2','single') ?></li>
											<li><?= X('single_search_visitor_expl2_option3','single') ?></li>
    									</ul>
									<li class="instruction"><?= X('single_search_visitor_expl3','single') ?></li>
									<li class="instruction"><?= X('single_search_visitor_expl4','single') ?></li>
									<li class="instruction"><?= X('search_visitor_appt_end_expl','single') ?></li>
									<li class="instruction"><?= X('single_delete_appointment_expl6','single') ?></li>
									<li class="instruction"><?= X('cancel_1_expl2','single') ?></li>
									<li class="instruction"><?= X('cancel_1_expl3','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_06','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/take_half_day_off_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('take_half_day_off_expl1','single') ?></li>
									<li class="instruction"><?= X('take_half_day_off_expl2','single') ?></li>
									<li class="instruction"><?= X('take_half_day_off_expl3','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_07','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/take_week_off_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('take_week_off_multi_expl1') ?></li>
									<li class="instruction"><?= X('take_week_off_expl2','single') ?></li>
									<li class="instruction"><?= X('take_week_off_expl3','single') ?></li>
									<li class="instruction"><?= X('take_week_off_expl4','single') ?></li>
									<li class="instruction" style="list-style-type: circle;"><?= X('take_week_off_expl5','single') ?></li>
									<li class="instruction" style="list-style-type: circle;"><?= X('take_week_off_expl6','single') ?></li>
								</ol>
							</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_09','single') ?></li>
							<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/printing_planning_2025.mp4" type="video/mp4" /></video>
								<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
								<ol class="instruction-list">
									<li class="instruction"><?= X('take_week_off_multi_expl1') ?></li>
									<li class="instruction"><?= X('printing_planning_expl2','single') ?></li>
									<li class="instruction"><?= X('printing_planning_expl3','single') ?></li>
									<li class="instruction"><?= X('printing_planning_expl4','single') ?></li>
									<li class="instruction"><?= X('printing_planning_expl5','single') ?></li>
									<li class="instruction"><?= X('printing_planning_expl6','single') ?></li>
									<li class="instruction"><?= X('printing_planning_expl7','single') ?></li>									
								</ol>
							</div>
					</ul>
				</div>
			</div>
		</li>

		<?php $i=1; $s='B'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('medium','single') ?></h2></label>
				<div class="sub">
					<ul class="mob-txt-gray_d sub">
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_01','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/choose_information_appearing_on_planning_stickers_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('choose_info_expl1') ?></li>
								<li class="instruction"><?= X('choose_info_expl3','single') ?></li>
								<li class="instruction"><?= X('choose_info_expl4','single') ?></li>
								<li class="instruction"><?= X('choose_info_expl5','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_02','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/re_plan_appointment_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('replan_1','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('re_plan_expl1','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl2','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl3','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl4','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl5','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl6','single') ?></li>
							</ol>
							<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('replan_2','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('re_plan_expl7','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl8','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl9','single') ?></li>
								<li class="instruction"><?= X('re_plan_expl10','single') ?></li>
							</ol>
							<li class="instruction" style="padding-top:10px;"><?= X('re_plan_expl11','single') ?></li>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_03','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/duplicate_appointment_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('duplicate_1','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('duplicate_expl1','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl2','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl3','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl4','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl5','single') ?></li>
							</ol>
							<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('duplicate_2','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('duplicate_expl1','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl2','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl8','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl5','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl10','single') ?></li>
								<li class="instruction"><?= X('duplicate_expl11','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_10','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/merge_visitor_that_was_double_encoded_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('merge_expl1','single') ?></li>
								<li class="instruction"><?= X('merge_expl2','single') ?></li>
								<li class="instruction"><?= X('merge_expl3','single') ?></li>
								<li class="instruction"><?= X('merge_expl4','single') ?></li>
							</ol>
							<li class="instruction" style="padding-top:10px;"><?= X('merge_expl5','single') ?></li>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_02','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/use_the_waiting_list_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('waiting_list_expl1','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl2','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl3','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl4','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl5','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl6','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl7','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl8','single') ?></li>
								<li class="instruction"><?= X('waiting_list_expl9','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('check_agenda_cancellations_and_reschedules','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/check_agenda_cancellations_and_reschedules_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_agenda_cancellations_and_reschedules_expl1','single') ?></li>
									<ul class="sub-instruction-list">
										<li><?= X('check_agenda_cancellations_and_reschedules_option1','single') ?></li>
										<li><?= X('check_agenda_cancellations_and_reschedules_option2','single') ?></li>
    								</ul>
								<li class="instruction"><?= X('check_agenda_cancellations_and_reschedules_expl2','single') ?></li>
								<li class="instruction"><?= X('check_agenda_cancellations_and_reschedules_expl3','single') ?></li>
								<li class="instruction"><?= X('check_agenda_cancellations_and_reschedules_expl4','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('check_visitor_cancellations_and_reschedules','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/check_visitor_cancellations_and_reschedules_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl1','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl2','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl3','single') ?></li>
									<ul class="sub-instruction-list">
										<li><?= X('check_agenda_cancellations_and_reschedules_option1','single') ?></li>
										<li><?= X('check_agenda_cancellations_and_reschedules_option2','single') ?></li>
    								</ul>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl4','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl5','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_09','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/track_who_has_inserted_or_changed_an_appointment_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('track_who_1','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('track_who_expl1','single') ?></li>
								<li class="instruction"><?= X('track_who_expl2','single') ?></li>
							</ol>
							<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('track_who_2','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('track_who_expl3','single') ?></li>
								<li class="instruction"><?= X('track_who_expl4','single') ?></li>
								<li class="instruction"><?= X('track_who_expl5','single') ?></li>
								<li class="instruction"><?= X('track_who_expl6','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_10','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/track_who_has_deleted_an_appointment_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('track_who_2','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('track_who_expl3','single') ?></li>
								<li class="instruction"><?= X('track_who_expl4','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl3','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl4','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl5','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl6','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl7','single') ?></li>
							</ol>
							<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('track_who_1','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('track_who_del_expl8','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl9','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl10','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl11','single') ?></li>
								<li class="instruction"><?= X('track_who_del_expl12','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('check_sms_status_appointment','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/check_sms_status_appointment_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_sms_status_appointment_expl1','single') ?></li>
								<li class="instruction"><?= X('check_sms_status_appointment_expl2','single') ?></li>
									<ul class="sub-instruction-list">
										<li><?= X('check_sms_status_appointment_option1','single') ?></li>
										<li><?= X('check_sms_status_appointment_option2','single') ?></li>
										<li><?= X('check_sms_status_appointment_option3','single') ?></li>
										<li><?= X('check_sms_status_appointment_option4','single') ?></li>
										<li><?= X('check_sms_status_appointment_option5','single') ?></li>
										<li><?= X('check_sms_status_appointment_option6','single') ?></li>
    								</ul>
								<li class="instruction"><?= X('check_sms_status_appointment_expl3','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('check_sms_status_day','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/check_sms_status_day_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_sms_status_day_expl1') ?></li>
								<li class="instruction"><?= X('check_sms_status_day_expl2','single') ?></li>
								<li class="instruction"><?= X('check_sms_status_day_expl3') ?></li>
								<li class="instruction"><?= X('check_sms_status_day_expl4','single') ?></li>
								<li class="instruction"><?= X('check_sms_status_day_expl5','single') ?></li>
								<li class="instruction"><?= X('check_sms_status_day_expl6','single') ?></li>
								<li class="instruction"><?= X('check_sms_status_day_expl7','single') ?></li>
									<ul class="sub-instruction-list" style="list-style-type: none; padding-left: 0;">
										<li><i class="fal fa-thumbs-up fa-fw fa-1d5x" style="color:rgb(154,205,52);"></i><?= X('check_sms_status_day_option1','single') ?></li>
										<li><i class="fal fa-thumbs-down fa-fw fa-1d5x" style="color:rgb(221,20,60);"></i><?= X('check_sms_status_day_option2','single') ?></li>
										<li><i class="fal fa-phone-slash fa-fw fa-1d5x" style="color:rgb(255,23,18);"></i><?= X('check_sms_status_day_option3','single') ?></li>
										<li><i class="fal fa-hourglass-end fa-fw fa-1d5x" style="color:rgb(255,218,29);"></i><?= X('check_sms_status_day_option4','single') ?></li>
										<li><i class="fal fa-times fa-fw fa-1d5x" style="color:rgb(255,2,0);"></i><?= X('check_sms_status_day_option5','single') ?></li>
    								</ul>
								<li class="instruction"><?= X('check_sms_status_day_expl8','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('day_moves','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/day_moves_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('day_moves_expl1') ?></li>
								<li class="instruction"><?= X('day_moves_expl2','single') ?></li>
								<li class="instruction"><?= X('day_moves_expl3','single') ?></li>
								<li class="instruction"><?= X('day_moves_expl4','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('print_visitors_appointments','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/print_visitors_appointments_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('print_visitors_appointments_expl1','single') ?></li>
								<li class="instruction"><?= X('print_visitors_appointments_expl2','single') ?></li>
								<li class="instruction"><?= X('print_visitors_appointments_expl3','single') ?></li>
								<li class="instruction"><?= X('print_visitors_appointments_expl4','single') ?></li>
								<li class="instruction"><?= X('print_visitors_appointments_expl5','single') ?></li>
								<li class="instruction"><?= X('print_visitors_appointments_expl6','single') ?></li>
							</ol>
						</div>
					</ul>
				</div>
			</div>
		</li>

		<?php $i=1; $s='C'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('series','single') ?></h2></label>
				<div class="sub">
					<ul class="mob-txt-gray_d sub">
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('creating_series_appointments','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/creating_series_appointments_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('creating_series_appointments1','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('creating_series_appointments_expl1','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl2','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl3','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl4','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl5','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl6','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl7','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl8','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl9','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl10','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl11','single') ?></li>
							</ol>
							<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('creating_series_appointments2','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('creating_series_appointments_expl12','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl13','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl14','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl15','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('deleting_series_appointments','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/deleting_series_appointments_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl1','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl2','single') ?></li>
								<li class="instruction"><?= X('deleting_series_appointments_expl3','single') ?></li>
								<li class="instruction"><?= X('deleting_series_appointments_expl4','single') ?></li>
								<li class="instruction"><?= X('deleting_series_appointments_expl5','single') ?></li>
								<li class="instruction"><?= X('deleting_series_appointments_expl6','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('adding_appts_to_existing_series','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/adding_appts_to_existing_series_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?> - <?= X('adding_appts_to_existing_series1','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('creating_series_appointments_expl1','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl2','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl3','single') ?></li>
								<li class="instruction"><?= X('adding_appts_to_existing_series_expl4','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl5','single') ?></li>
								<li class="instruction"><?= X('adding_appts_to_existing_series_expl6','single') ?></li>
								<li class="instruction"><?= X('adding_appts_to_existing_series_expl7','single') ?></li>
								<li class="instruction"><?= X('adding_appts_to_existing_series_expl8','single') ?></li>
								<li class="instruction"><?= X('adding_appts_to_existing_series_expl9','single') ?></li>

							</ol>
							<div class="alternative"><span><i class="far fa-map-signs"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('alt','single') ?> - <?= X('adding_appts_to_existing_series2','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('creating_series_appointments_expl12','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl13','single') ?></li>
								<li class="instruction"><?= X('creating_series_appointments_expl14','single') ?></li>
								<li class="instruction"><?= X('adding_appts_to_existing_series_expl13','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('removing_appointment_from_series','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/removing_appointment_from_series_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl1','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl2','single') ?></li>
								<li class="instruction"><?= X('removing_appointment_from_series_expl3','single') ?></li>
								<li class="instruction"><?= X('removing_appointment_from_series_expl4','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('detatching_appointment_from_series','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/detatching_appointment_from_series_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl1','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl2','single') ?></li>
								<li class="instruction"><?= X('detatching_appointment_from_series_expl3','single') ?></li>
								<li class="instruction"><?= X('detatching_appointment_from_series_expl4','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('changing_order_appointments_in_series','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/changing_order_appointments_in_series_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('changing_order_appointments_in_series_expl1','single') ?></li>
							</ol>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('printing_series_appointments','single') ?></li>
						<div class="vwrap">
							<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/printing_series_appointments_2025.mp4" type="video/mp4" /></video>
							<div class="steps"><span><i class="fad fa-pennant"></i></span>&nbsp;&nbsp;<span class="mob-txt-lime"><?= X('step_by_step','single') ?></span></div>
							<ol class="instruction-list">
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl1','single') ?></li>
								<li class="instruction"><?= X('check_visitor_cancellations_and_reschedules_expl2','single') ?></li>
								<li class="instruction"><?= X('printing_series_appointments_expl3','single') ?></li>
								<li class="instruction"><?= X('deleting_series_appointments_expl4','single') ?></li>
								<li class="instruction"><?= X('printing_series_appointments_expl5','single') ?></li>
								<li class="instruction"><?= X('printing_series_appointments_expl6','single') ?></li>
								<li class="instruction"><?= X('printing_series_appointments_expl7','single') ?></li>
							</ol>
						</div>
					</ul>
				</div>
			</div>
		</li>

		<?php $i=1; $s='D'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('hourly','single') ?></h2></label>
				<div class="sub">
					<ul class="mob-txt-gray_d sub">
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_01','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_start_and_finish_work_time_for_given_week_day.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_02','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/insert_or_remove_break_in_work_day.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_03','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/close_or_open_a_week_day.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_04','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/switch_to_a_new_hourly_from_given_date.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_05','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/insert_exceptional_hourly_for_a_given_day.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_06','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/use_exceptional_work_periods_in_a_work_day.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_03_07','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_colors_of_the_hourly_tabs.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_03','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/set_up_an_hourly_that_rotates_over_2_weeks_or_more.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('multi_03_08') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/share_hourly_with_colleagues.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_05_01','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/many_locations.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_05_02','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/block_and_out_of_block_time_management_concept.mp4" type="video/mp4" /></video>
						</div>
					</ul>
				</div>
			</div>
		</li>

		<?php $i=1; $s='E'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('expert','single') ?></h2></label>
				<div class="sub">
					<ul class="mob-txt-gray_d sub">
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_11','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/open_the_planning_hours_span.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_05','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/create_custom_color_for_special_appointments.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_08','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/create_custom_colors_for_holidays_and_off_days.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_06','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/create_custom_color_to_identify_visitors.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_04','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_color_stickers_on_planning.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_07','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/put_tags_to_qualify_visitors.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_02_09','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/define_recurrent_performances.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_08','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/give_access_to_a_new_colleague.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_01_11','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_password.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('multi_04_11') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/limit_visible_agenda.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_04','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_the_SMS_message.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_05','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_the_timing_of_the_automated_sending.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_06','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/change_the_text_of_automated_emails.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_04_07','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/send_SMS_in_the_visitors_language.mp4" type="video/mp4" /></video>
						</div>
					</ul>
				</div>
			</div>
		</li>


		<?php $i=1; $s='F'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('eResa','single') ?></h2></label>
				<div class="sub">
					<ul class="mob-txt-gray_d sub">
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_06_01','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/set_up_your_own_webreservation_page.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_06_02','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/make_a_subset_of_your_performances_to_be_webreservable.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_06_03','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/let_web_reservations_fall_into_specific_planning_periods.mp4" type="video/mp4" /></video>
						</div>
						<li class="subtitle"><i class="fa fa-play-circle"></i><?=$s?> <?=$i?> - <?= X('single_06_04','single') ?></li>
						<div class="vwrap">
								<video 	id="<?=$s?><?=$i++?>" class="video-js vjs-fluid"><source src="../assets/vids/elearning/<?=$c?>/<?=$l?>/special_color_or_pattern_to_reservations_taken_online.mp4" type="video/mp4" /></video>
						</div>
					</ul>
				</div>
			</div>
		</li>

		<?php $i=1; $s='G'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('epayement','single') ?><span class="new">New</span></h2></label>
				<div class="sub">
					<?= X('epayement_discover','single') ?>
					<div style="text-align: left;">
						<?= X('more_info','single') ?><a href="https://www.mobminder.com/<?=$l?>/pay.php" target="_blank" style="color:#c2e249;">Mobminder pay</a>
					</div>				
				</div>
			</div>
		</li>

		<?php $i=1; $s='H'; ?>

		<li class="mob-txt-gray_m has-sub">
			<input id="<?=$s?>" type="checkbox" name="menu" />
			<div>
				<label for="<?=$s?>"><h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$s?>. <?= X('telephony','single') ?><span class="new">New</span></h2></label>
				<div class="sub">
					<?= X('telephony_discover','single') ?>
					<div style="text-align: left;">
					<?= X('more_info','single') ?><a href="https://www.mobminder.com/fr/ai.php" target="_blank" style="color:#c2e249;">Moby</a>
					</div>	
				</div>
			</div>
		</li>

	</ul>
</div>
	
</section>

<!--   C O M P A T I B I L I T Y   ( D O W N L O A D   N O W )    -->

<section id="compatibility" class="compatibility">
		<div class="air airupplus"></div>
		<div class="say"><h1 class="mob-txt-gray_l bigger centered unfold from-center invp mobul"><?= X('touch_title','single') ?></h1></div>
		<div>
			<ul style="padding-bottom:70px;">
				<li>
					<a href='https://play.google.com/store/apps/details?id=com.mobminder.agenda' target="_blank">
					<div class="download">
						<i class="fab fa-google-play fa-3x"></i>
						<span class="df"><?= X('availability1','touch') ?></span>
						<span class="dfn">Google Play</span>
					</div>
					</a>
				</li>
				<li>
					<a href='https://apps.apple.com/be/app/mobminder/id1530813844?l=fr' target="_blank">
					<div class="download">
						<i class="fab fa-apple fa-3x"></i>
						<span class="df"><?= X('availability2','touch') ?></span>
						<span class="dfn">App Store</span>
					</div>
					</a>
				</li>
			</ul>
		</div>

</section> <!-- section compatibility -->

<section id="touchvideo" class="touchvideo air">


<div class="margins">
	<div class="margins air" style="padding-bottom:80px;">
		<video 	id="video_touch" class="video-js vjs-fluid" poster="../assets/imgs/poster/app.png"><source src="../assets/vids/elearning/touch/<?=$l?>/MobAppLift.mp4" type="video/mp4" /></video>
	</div>
		
	<div class="list-area checked">
		<ul class="mob-txt-gray_m left-padded">
			<li><?= X('touch_instruction2','touch') ?></li>
			<li><?= X('touch_instruction1','touch') ?></li>
			<li><?= X('touch_instruction3','touch') ?></li>
			<li><?= X('touch_instruction4','touch') ?></li>
			<li><?= X('touch_instruction5','touch') ?></li>
			<li><?= X('touch_instruction6','touch') ?></li>
			<li><?= X('touch_instruction7','touch') ?></li>
			<li><?= X('touch_instruction8','touch') ?></li>
			<li><?= X('touch_instruction9','touch') ?></li>
			<li><?= X('touch_instruction10','touch') ?></li>
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


<section id="technologies" class="technologies air">

	<div class="wide airupplus">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('help_title','single') ?></h1>
	</div>

	<div class="margins sales-cycle centered airplus">
		<p class="mob-txt-blue bold centered"><?= X('help_expl1','single') ?></p>
		<p class="mob-txt-blue airplus airup centered"><?= X('help_expl2','single') ?></p>
	</div>


	<div class="wide airup">
		<div class="row">
			<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-4">
				<div class="single-service first">
					<img class="first" src="../assets/imgs/help/help1.jpg" alt="">
					<i class="fad fa-1d5x fa-user-cog mob-txt-lime"></i>
					<h3 class="mob-txt-blue"><?= X('help_1','single') ?></h3>
				</div>
			</div>
			<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-4">
				<div class="single-service second">
					<img class="second"  src="../assets/imgs/help/help2.jpg" alt="">
					<i class="fad fa-1d5x fa-user-chart mob-txt-lime"></i>
					<h3 class="mob-txt-blue"><?= X('help_2','single') ?></h3>
				</div>
			</div>
			<div class="flexinner col-xs-12 col-sm-12 col-lg-12 col-xl-4">
				<div class="single-service fourth">
					<img class="fourth"  src="../assets/imgs/help/help3.jpg" alt="">
					<i class="fad fa-1d5x fa-hands-helping mob-txt-lime"></i>
					<h3 class="mob-txt-blue"><?= X('help_3','single') ?></h3>
				</div>
			</div>
		</div>
	</div>


</section> <!-- section technologies -->



<?php include('footer.php')?>
		
</body>
</html>