<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
<title><?= X('pageTitle') ?></title>
<meta name="description" content="<?= X('pageDescription') ?>">
<?php include('header.php')?>
<link rel="stylesheet" href="../assets/css/wizard.css">
<script src="../assets/js/wizard.js"></script>
</head>

<body id="wizard" class="slightwhite">
	<!-- 
<section id="s_menu" class="top-menu">
		<div id="topmenu" class="topmenu">This is the menu zone</div>
</section> section top-menu -->


 <!-- Grid options: https://getbootstrap.com/docs/4.1/layout/grid/ -->

<section id="skyscrapers" class="trynow air">
	<div class="shade"></div>
	<div id="trynow" class="animate wbottom trynow">
		<div class="margins" style="padding-top:1em;">
			<h1>
				<div class="logo unfold from-left s4">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
				</div>
				<div class="headers">
					<div class="bold left mob-txt-gray_l unfold from-top s0"><?= X('top_header_l1') ?></div>
					<div class="bold left mob-txt-gray_m unfold from-top s1"><?= X('top_header_l2') ?></div>
					<div class="bold left mob-txt-gray_d unfold from-top s2"><?= X('top_header_l3') ?></div>
				</div>
			</h1>
		</div>
	</div>
	<div class="advantages">
		<div class="margins airupplus airplus">
			<h2 class="right white"><?=X('top_check_l1')?></h2>
		</div>
	</div>
	<script type="text/javascript">

		let trynow = document.querySelector("#trynow"); // wave the upper sky border
		var w1 = new C_waved( trynow, { animate:true });
		
		var skyscrapers = document.querySelector("#skyscrapers"); // let the skyscrapers flow
		var c = 0;
		(function wind() {
			let d = -((c++)/20);
			skyscrapers.style.backgroundPosition ="left "+d+"px bottom 0%"; // (*cp01*)
			requestAnimationFrame(wind);
		})();
		
		
	</script>
</section>  <!-- section trynow -->




	




    <!--    P R O F E S S I O N A L     S E C T O R     -->

 
<section id="pro_section" class="professionnals bgwhite air airup">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('pro_section', 'wizard') ?></h1>
		<h2 class="bigger centered squeezed mob-txt-gray_m air"><?=X('pro_question', 'wizard')?></h2>		
	</div>
	<div id="pro_form" class="margins">
		<div class="row">
			<div id="pro_medical" value="medical" class="pro touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-service mob-bg-gray_l">
					<img src="../assets/imgs/profs/service-1-doctor.jpg" alt="">
					<h3 class="white"><?= X('wiz_prof_s1', 'wizard') ?></h3>
				</div>
			</div>
			<div id="pro_freelance" value="freelance" class="pro touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-service mob-bg-gray_l">
					<img src="../assets/imgs/profs/service-2-freelances.jpg" alt="">
					<h3 class="white"><?= X('wiz_prof_s2', 'wizard') ?></h3>
				</div>
			</div>
			<div id="pro_medgroup" value="medgroup" class="pro touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-service mob-bg-gray_l">
					<img src="../assets/imgs/profs/service-3-group.jpg" alt="">
					<h3 class="white"><?= X('wiz_prof_s3', 'wizard') ?></h3>
				</div>
			</div>
			<div id="pro_dental" value="dental" class="pro touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-service mob-bg-gray_l">
					<img src="../assets/imgs/profs/service-0-dentist.jpg" alt="">
					<h3 class="white"><?= X('wiz_prof_s4', 'wizard') ?></h3>
				</div>
			</div>
			<div id="pro_industry" value="industry" class="pro touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-service mob-bg-gray_l">
					<img src="../assets/imgs/profs/service-5-industry.jpg" alt="">
					<h3 class="white"><?= X('wiz_prof_s5', 'wizard') ?></h3>
				</div>
			</div>
			<div id="pro_wellness" value="wellness" class="pro touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-service mob-bg-gray_l">
					<img src="../assets/imgs/profs/service-6-wellness.jpg" alt="">
					<h3 class="white"><?= X('wiz_prof_s6', 'wizard') ?></h3>
				</div>
			</div>
		</div>
		<h3 class="" id="pro_form_status" style="display:none;">pro_form_status</h3>
	</div>

</section> <!-- section professionnals -->








    <!--    C U R R E N T     A G E N D A    P A P E R    O R    E L E C T R O N I C    -->
 
<div id="before_current" class="animate wbottom bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_current = document.querySelector("#before_current");
		var bmt = new C_waved( before_current, { animate:true, frequence:3, phase:0, speed:10, amplitude:96 });
	</script>	
</div>

 
<section id="paper_form" class="currentagenda air">

	<div class="margins">
		<div class="row">
			<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div> <!-- see .h1track in wizard.css -->
			<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('paper_section', 'wizard') ?></h1></div>
			<div class="d-none d-md-inline col-md-1"></div>
		</div>
	</div>
	<div id="current_form" class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="agenda-question">
					<h2 class="confirm centered mob-txt-gray_m"><?=X('paper_question', 'wizard')?></h2>	
					<h2 class="confirm centered mob-txt-gray_m" id="current_tip_paper" style="display:none;"><?= X('paper_tip_yes', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="current_tip_electronic" style="display:none;"><?= X('paper_tip_no', 'wizard') ?></h2>
				</div>
			</div>
			<div id="current_paper" value="paper" class="current touch-on flexinner left col-6 col-lg-4">
				<div class="agenda-type left bgwhite">
					<img src="../assets/imgs/wizard/agtype-paper.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('paper_yes', 'wizard') ?></h3>
				</div>
			</div>
			<div id="current_electronic" value="electronic" class="current touch-on flexinner right col-6 col-lg-4">
				<div class="agenda-type right bgwhite">
					<img src="../assets/imgs/wizard/agtype-electronic.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('paper_no', 'wizard') ?></h3>
				</div>
			</div>
		</div>
		<h3 class="" id="current_form_status" style="display:none;">current_form_status</h3>
	</div>

</section> <!-- section professionnals -->








 
    <!--    I S   I T    M U L T I     A G E N D A    -->
	
	
<div id="before_multi" class="animate wtop bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_multi = document.querySelector("#before_multi");
		var bhm = new C_waved( before_multi, { animate:true, frequence:4, phase:0, speed:5, amplitude:94 });
		
	</script>
</div>
	
<section id="multi_section" class="ismultiagenda bgwhite air">
	<div class="margins row">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="mob-txt-gray_l bigger centered unfold from-center invp"><?= X('multi_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div>
	<div id="ismulti_form" class="margins air">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center air">
				<div class="agenda-many-tip">
<h2 class="confirm centered mob-txt-gray_m" id="ismulti_tip_single" style="display:none;"><?= X('wz_ismulti_tip_single', 'wizard') ?></h2>
<h2 class="confirm centered mob-txt-gray_m" id="ismulti_tip_ismulti" style="display:none;"><?= X('wz_ismulti_tip_ismulti', 'wizard') ?></h2>
<h2 class="confirm centered mob-txt-gray_m" id="ismulti_tip_choose" style="display:block;">&nbsp;</h2>
				</div>
			</div>
			<div id="ismulti_single" value="single" class="ismulti touch-on flexinner left col-6 col-lg-4">
				<div class="agenda-many left">
					<img src="../assets/imgs/wizard/ag_one.jpg" alt="">
					<h3 class="mob-txt-blue"><?=X('wz_ismulti_no', 'wizard')?></h3>
				</div>
			</div>
			<div id="ismulti_ismulti" value="ismulti" class="ismulti touch-on flexinner right col-6 col-lg-4">
				<div class="agenda-many right">
					<img src="../assets/imgs/wizard/ag_many.jpg" alt="">
					<h3 class="mob-txt-blue"><?=X('wz_ismulti_yes', 'wizard')?></h3>
				</div>
			</div>
		</div>
		
		
		<h3 class="" id="ismulti_form_status" style="display:none;">ismulti_form_status</h3>
	</div>

</section> <!-- section ismulti -->











    <!--     T I M E    S L I C E      -->
	
	
<div id="before_slice" class="animate wbottom bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_slice = document.querySelector("#before_slice");
		var bmt = new C_waved( before_slice, { animate:true, frequence:3, phase:0, speed:10, amplitude:100 });
	</script>	
</div>
	

<section id="slice_form" class="timeslice air">

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('timeslice_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	<div class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="timeslice-question">
					<h2 class="confirm centered mob-txt-gray_m" style="display:block;"><?= X('timeslice_question', 'wizard') ?></h2>
					<h3 class="confirm centered mob-txt-gray_m" id="slice_tip_60" style="display:none;"><?= X('timeslice_tip_60', 'wizard') ?></h3>
					<h3 class="confirm centered mob-txt-gray_m" id="slice_tip_30" style="display:none;"><?= X('timeslice_tip_30', 'wizard') ?></h3>
					<h3 class="confirm centered mob-txt-gray_m" id="slice_tip_20" style="display:none;"><?= X('timeslice_tip_20', 'wizard') ?></h3>
					<h3 class="confirm centered mob-txt-gray_m" id="slice_tip_15" style="display:none;"><?= X('timeslice_tip_15', 'wizard') ?></h3>
					<h3 class="confirm centered mob-txt-gray_m" id="slice_tip_10" style="display:none;"><?= X('timeslice_tip_10', 'wizard') ?></h3>
					<h3 class="confirm centered mob-txt-gray_m" id="slice_tip_5"  style="display:none;"><?= X('timeslice_tip_5' , 'wizard') ?></h3>
				</div>
			</div>
			<div class="flexinner col-12 col-lg-4">
				<div class="options row">
					<div id="slice_30" value="30" class="slice touch-on upleft up1 col-4 col-lg-6">
						<div class="flexinner timeslice-box align-items-center">
							<h3 class="mob-txt-blue"><?= X('timeslice_30', 'wizard') ?></h3>
						</div>
					</div>
					<div id="slice_20" value="20" class="slice touch-on upright up2 col-4 col-lg-6">
						<div class="flexinner timeslice-box align-items-center">
							<h3 class="mob-txt-blue"><?= X('timeslice_20', 'wizard') ?></h3>
						</div>
					</div>
					<div id="slice_15" value="15" class="slice touch-on midleft up3 col-4 col-lg-6">
						<div class="flexinner timeslice-box align-items-center">
							<h3 class="mob-txt-blue"><?= X('timeslice_15', 'wizard') ?></h3>
						</div>
					</div>
					<div id="slice_10" value="10" class="slice touch-on midright dwn1 col-4 col-lg-6">
						<div class="flexinner timeslice-box align-items-center">
							<h3 class="mob-txt-blue"><?= X('timeslice_10', 'wizard') ?></h3>
						</div>
					</div>
					<div id="slice_5" value="5" class="slice touch-on downleft dwn2 col-4 col-lg-6">
						<div class="flexinner timeslice-box align-items-center">
							<h3 class="mob-txt-blue"><?= X('timeslice_5', 'wizard') ?></h3>
						</div>
					</div>
					<div id="slice_60" value="60" class="slice touch-on downright dwn3 col-4 col-lg-6">
						<div class="flexinner timeslice-box align-items-center">
							<h3 class="mob-txt-blue"><?= X('timeslice_60', 'wizard') ?></h3>
						</div>
					</div>
				</div>
			</div>
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="timeslice-image">
					<h2 class="confirm centered mob-txt-gray_m" style="display:none;"><?= X('timeslice_question', 'wizard') ?></h2>
					
					<div class="confirm centered mob-txt-gray_m" id="slice_tip2_60" style="display:none;"><h3><?= X('timeslice_example', 'wizard') ?></h3><img src="../assets/imgs/wizard/timeslice/slice-1-60min.jpg" alt=""></div>
					<div class="confirm centered mob-txt-gray_m" id="slice_tip2_30" style="display:none;"><h3><?= X('timeslice_example', 'wizard') ?></h3><img src="../assets/imgs/wizard/timeslice/slice-2-30min.jpg" alt=""></div>
					<div class="confirm centered mob-txt-gray_m" id="slice_tip2_20" style="display:none;"><h3><?= X('timeslice_example', 'wizard') ?></h3><img src="../assets/imgs/wizard/timeslice/slice-3-20min.jpg" alt=""></div>
					<div class="confirm centered mob-txt-gray_m" id="slice_tip2_15" style="display:none;"><h3><?= X('timeslice_example', 'wizard') ?></h3><img src="../assets/imgs/wizard/timeslice/slice-4-15min.jpg" alt=""></div>
					<div class="confirm centered mob-txt-gray_m" id="slice_tip2_10" style="display:none;"><h3><?= X('timeslice_example', 'wizard') ?></h3><img src="../assets/imgs/wizard/timeslice/slice-6-10min.jpg" alt=""></div>
					<div class="confirm centered mob-txt-gray_m" id="slice_tip2_5"  style="display:none;"><h3><?= X('timeslice_example', 'wizard') ?></h3><img src="../assets/imgs/wizard/timeslice/slice-12-5min.jpg" alt=""></div>
				</div>
			</div>
		</div>
		<h3 class="" id="slice_form_status" style="display:none;">slice_form_status</h3>
	</div>

</section> <!-- section timeslice -->






    <!--    C O M M U N I C A T I O N      -->
	


<div id="before_comm" class="animate wtop bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_comm = document.querySelector("#before_comm");
		var bhm = new C_waved( before_comm, { animate:true, frequence:4, phase:0, speed:16, amplitude:100 });
		
	</script>
</div>
	
		
	
<section id="comm_form" class="communication-options bgwhite">

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('comm_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	
	<h2 class="centered mob-txt-gray_m"><?=X('comm_question', 'wizard')?></h2>
	
	<div class="wide">


		<div class="radio-box fancy square righter mob-txt-gray_m">
			<!--    Options     -->
			
			<div class="option-box row">
				<p 		class="col-12 col-md-8 col-lg-4"><label><span class="bigger bold"><?=X('comm_reminder', 	'wizard')?></span><input class="comm" name="comm" type="checkbox" value="r" checked="true"/> <!--checked="true"--> </label></p>
				<div 	class="col-12 col-md-4 d-lg-none"></div>
				<h3 	class="col-12 col-md-12 col-lg-8 ixl confirm mob-txt-gray_d" id="comm_tip_r" 	style="display:none;"><?=X('comm_tip_reminder', 'wizard')?></h3>
			</div>
			
			<div class="option-box row">
				<p 		class="col-12 col-md-8 col-lg-4"><label><span class="bigger bold"><?=X('comm_confirm', 	'wizard')?></span><input class="comm" name="comm" type="checkbox" value="c"/></label></p>
				<div 	class="col-12 col-md-4 d-lg-none"></div>
				<h3 	class="col-12 col-md-12 col-lg-8 ixl confirm mob-txt-gray_d" id="comm_tip_c" 	style="display:none;"><?=X('comm_tip_confirm', 	'wizard')?></h3>
			</div>
			
			<div class="option-box row">
				<p 		class="col-12 col-md-8 col-lg-4"><label><span class="bigger bold"><?=X('comm_birthday', 	'wizard')?></span><input class="comm" name="comm" type="checkbox" value="b"/></label></p>
				<div 	class="col-12 col-md-4 d-lg-none"></div>
				<h3 	class="col-12 col-md-12 col-lg-8 ixl confirm mob-txt-gray_d" id="comm_tip_b" 	style="display:none;"><?=X('comm_tip_birthday', 'wizard')?></h3>
			</div>
			
			<div class="option-box row">
				<p 		class="col-12 col-md-8 col-lg-4"><label><span class="bigger bold"><?=X('comm_revival', 	'wizard')?></span><input class="comm" name="comm" type="checkbox" value="v"/></label></p>
				<div 	class="col-12 col-md-4 d-lg-none"></div>
				<h3 	class="col-12 col-md-12 col-lg-8 ixl confirm mob-txt-gray_d" id="comm_tip_v" 	style="display:none;"><?=X('comm_tip_revival', 	'wizard')?></h3>
			</div>

			<h3 class="ixl" id="comm_misc" style="display:none; text-align:right;">communication status</h3>
		</div>
		
	</div>
	<div class="margins">	
		
		<div class="">
			<!--    Tips     -->
			<h3 class="ixl confirm centered mob-txt-gray_l" id="comm_tip_none" style="display:block;"><?=X('comm_tip_none', 	'wizard')?></h3>
			<h3 class="ixl confirm bigger centered mob-txt-gray_m" id="comm_tip_misc" style="display:block;"><?=X('comm_tip_misc', 	'wizard')?></h3>
		</div>
	</div>
</section>
	






    <!--     I F    S I N G L E    ==   D E L E G A T I O N     T Y P E     -->
 
 
<div id="before_delegation" class="animate wbottom bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_delegation = document.querySelector("#before_delegation");
		var bmt = new C_waved( before_delegation, { animate:true, frequence:3, phase:0, speed:10, amplitude:100 });
	</script>	
</div>

<section id="singdel_form" class="single-delegation air">

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('delegate_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	<div class="margins">
		<div class="row">
			<div class="flexinner col-12">
				<div class="singdel-question">
					<h2 class="confirm centered mob-txt-gray_m" style="display:block;"><?= X('wz_singdel_question', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="singdel_tip_assistant" style="display:none;"><?= X('wz_singdel_tip_assistant', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="singdel_tip_callcenter" style="display:none;"><?= X('wz_singdel_tip_callcenter', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="singdel_tip_nope" style="display:none;"><?= X('wz_singdel_tip_nope', 'wizard') ?></h2>
				</div>
			</div>
			<div id="singdel_assistant" value="assistant" class="singdel touch-on flexinner left col-4 col-sm-4">
				<div class="singdel-type left bgwhite">
					<img src="../assets/imgs/wizard/assistent.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_singdel_assistant', 'wizard') ?></h3>
				</div>
			</div>
			<div id="singdel_callcenter" value="callcenter" class="singdel touch-on flexinner center col-4 col-sm-4">
				<div class="singdel-type center bgwhite">
					<img src="../assets/imgs/wizard/operator.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_singdel_hotline', 'wizard') ?></h3>
				</div>
			</div>
			<div id="singdel_nope" value="nope" class="singdel touch-on flexinner right col-4 col-sm-4">
				<div class="singdel-type right bgwhite">
					<img src="../assets/imgs/wizard/alone.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_singdel_alone', 'wizard') ?></h3>
				</div>
			</div>
		</div>
		
		
		<h3 class="" id="singdel_form_status" style="display:none;">singdel_form_status</h3>
	</div>

</section> <!-- section professionnals -->



    <!--     I F    M U L T I    ==    D E L E G A T I O N     T Y P E     -->
 
 
<section id="comanaged_form" class="comanaged-delegation air">

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('comanaged_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	<div class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="flexinner comanaged-question align-items-center">
					<h2 class="confirm centered mob-txt-gray_m" style="display:block;"><?= X('wz_comanaged_question', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="comanaged_tip_nope" style="display:none;"><?= X('wz_comanaged_tip_nope', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="comanaged_tip_amongus" style="display:none;"><?= X('wz_comanaged_tip_amongus', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="comanaged_tip_assistants" style="display:none;"><?= X('wz_comanaged_tip_assistants', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="comanaged_tip_callcenter" style="display:none;"><?= X('wz_comanaged_tip_callcenter', 'wizard') ?></h2>
				</div>
			</div>
			<div class="flexinner col-12 col-lg-8">
				<div class="row">
					<div id="comanaged_nope" value="nope" class="comanaged touch-on flexinner upleft col-6">
						<div class="comanaged-type upleft bgwhite">
							<img src="../assets/imgs/wizard/eachhis.jpg" alt="">
							<h3 class="mob-txt-blue"><?= X('wz_comanaged_none', 'wizard') ?></h3>
						</div>
					</div>
					<div id="comanaged_amongus" value="amongus" class="comanaged touch-on flexinner upright col-6">
						<div class="comanaged-type upright bgwhite">
							<img src="../assets/imgs/wizard/comanaged.jpg" alt="">
							<h3 class="mob-txt-blue"><?= X('wz_comanaged_amongus', 'wizard') ?></h3>
						</div>
					</div>
					<div id="comanaged_assistants" value="assistants" class="comanaged touch-on flexinner downleft col-6">
						<div class="comanaged-type downleft bgwhite">
							<img src="../assets/imgs/wizard/assistent.jpg" alt="">
							<h3 class="mob-txt-blue"><?= X('wz_comanaged_assistants', 'wizard') ?></h3>
						</div>
					</div>
					<div id="comanaged_callcenter" value="callcenter" class="comanaged touch-on flexinner downright col-6">
						<div class="comanaged-type downright bgwhite">
							<img src="../assets/imgs/wizard/operator.jpg" alt="">
							<h3 class="mob-txt-blue"><?= X('wz_comanaged_callcenter', 'wizard') ?></h3>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		
		<h3 class="" id="comanaged_form_status" style="display:none;">comanaged_form_status</h3>
	</div>

</section> <!-- section comanaged -->




    <!--       O N L I N E     R E S E R V A T I O N      -->
 
<div id="before_eresa" class="animate wtop bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_eresa = document.querySelector("#before_eresa");
		var bhm = new C_waved( before_eresa, { animate:true, frequence:4, phase:0, speed:16, amplitude:100 });
		
	</script>
</div>
 
<section id="eresa_section" class="ereservation bgwhite air">

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l mobul unfold from-top invp"><?= X('eresa_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	
	<div id="wisheresa_form" class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="flexinner wisheresa-question align-items-center">
					<h2 class="confirm centered mob-txt-gray_m"><?=X('eresa_question', 'wizard')?></h2>	
					<h2 class="confirm centered mob-txt-gray_m" id="wisheresa_tip_yes" style="display:none;"><?= X('eresa_yes', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="wisheresa_tip_no" style="display:none;"><?= X('eresa_no', 'wizard') ?></h2>
				</div>
			</div>
			<div id="wisheresa_yes" value="yes" class="wisheresa touch-on flexinner left col-6 col-lg-4">
				<div class="wisheresa-box left bgwhite">
					<img src="../assets/imgs/wizard/onlineresa.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_wisheresa_yes', 'wizard') ?></h3>
				</div>
			</div>
			<div id="wisheresa_no" value="no" class="wisheresa touch-on flexinner right col-6 col-lg-4">
				<div class="wisheresa-box right bgwhite">
					<img src="../assets/imgs/wizard/inboundresa.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_wisheresa_no', 'wizard') ?></h3>
				</div>
			</div>
		</div>
		
		
		<h3 class="" id="wisheresa_form_status" style="display:none;">wisheresa_form_status</h3>
	</div>
	
	
	
	<div id="haswebsite_form" class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l airup mobul unfold from-top invp"><?= X('website_section', 'wizard') ?></h1>
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="flexinner haswebsite-question align-items-center">
					<h2 class="confirm centered mob-txt-gray_m squeezed"><?=X('haswebsite_question', 'wizard')?></h2>	
					<h3 class="confirm centered bigger mob-txt-gray_m" id="haswebsite_tip_yes" style="display:none;"><?= X('eresa_ownweb_tip_yes', 'wizard') ?></h3>
					<h3 class="confirm centered bigger mob-txt-gray_m" id="haswebsite_tip_no" style="display:none;"><?= X('eresa_ownweb_tip_no', 'wizard') ?></h3>
				</div>
			</div>
			<div id="haswebsite_yes" value="yes" class="haswebsite touch-on flexinner left col-6 col-lg-4">
				<div class="haswebsite-box left bgwhite">
					<img src="../assets/imgs/wizard/wehaveweb.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_haswebsite_yes', 'wizard') ?></h3>
				</div>
			</div>
			<div id="haswebsite_no" value="no" class="haswebsite touch-on flexinner right col-6 col-lg-4">
				<div class="haswebsite-box right bgwhite">
					<img src="../assets/imgs/wizard/weprepareweb.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('wz_haswebsite_no', 'wizard') ?></h3>
				</div>
			</div>
		</div>
		<div id="ereservation" class="flexinner col-12 align-items-center">
			<div class="haswebsite-url">
				<h2 class="confirm centered mob-txt-gray_m" id="haswebsite_tip2_yes" style="display:none;"><?=X('weburl_question', 'wizard')?></h2>	
				<h2 class="confirm centered mob-txt-gray_m" id="haswebsite_tip2_no" style="display:none;"><?=X('weburl_whish', 'wizard')?></h2>	
				<div class="" id="ereservation_ownweb_wrapper" style="display:none;"> <!-- managed by wizard.js (*wz01*) -->
					<h2 class="confirm centered mob-txt-gray_m"><?=X('haswebsite_question', 'wizard')?></h2>
					<h3 class="ixl" id="ereservation-form-urleresa" style="display:none;"><?=X('eresa_placeholder_url', 'wizard')?></h3>
				</div>	
			</div>
		</div>
			
		
		<h3 class="" id="haswebsite_form_status" style="display:none;">haswebsite_form_status</h3>
	</div>

	
</section> <!-- online reservation -->



    <!--     C L E A R      O R     A L I V E      -->
	

	
	<div id="before_live" class="animate wbottom bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_live = document.querySelector("#before_live");
		var bmt = new C_waved( before_live, { animate:true, frequence:3, phase:0, speed:10, amplitude:100 });
	</script>	
</div>

<section id="live2_form" class="live air">

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l mobul unfold from-top invp"><?= X('live_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	<div class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-6 align-items-center">
				<div class="live2-question flexinner align-items-center">
					<h2 class="confirm mob-txt-gray_m" style="display:block;"><?= X('live_question', 'wizard') ?></h2>
					<h3 class="confirm mob-txt-gray_m bigger" id="live2_tip_yes" style="display:none;"><?= X('live_tip_yes', 'wizard') ?></h3>
					<h3 class="confirm mob-txt-gray_m bigger" id="live2_tip_no" style="display:none;"><?= X('live_tip_no', 'wizard') ?></h3>
				</div>
			</div>
			<div id="live2_yes" value="yes" class="live2 touch-on col-6 col-lg-3 flexinner left">
				<div class="live2-box lefter">
					<img src="../assets/imgs/wizard/live/live.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('live_yes', 'wizard') ?></h3>
				</div>
			</div>
			<div id="live2_no" value="no" class="live2 touch-on col-6 col-lg-3 flexinner right">
				<div class="live2-box righter">
					<img src="../assets/imgs/wizard/live/clear.jpg" alt="">
					<h3 class="mob-txt-blue"><?= X('live_no', 'wizard') ?></h3>
				</div>
			</div>
		</div>
		<h3 class="" id="live2_form_status" style="display:none;">live2_form_status</h3>
	</div>

</section> <!-- section live2 -->


    <!--      E    P A Y E M E N T     -->

<div id="before_epay_form" class="animate wtop bgwhite" style="height:50px;">
	<script type="text/javascript">
			let before_epay_form = document.querySelector("#before_epay_form");
		var bhm = new C_waved( before_epay_form, { animate:true, frequence:2, phase:0, speed:10, amplitude:100 });
		
	</script>
</div>


<section id="epay_form" class="epay-options bgwhite"> 

	<div class="margins"><div class="row airup">
		<div class="col-2  col-md-1"><h2 class="h1track mob-txt-blue-soft"></h2></div>
		<div class="col-10 col-md-10"><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp"><?= X('pay_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-1"></div>
	</div></div>
	
	<h2 class="centered mob-txt-gray_m"><?=X('pay_question', 'wizard')?></h2>
	<div class="mob-txt-gray_d margins airupplus"><p class="centered"><?=X('pay_tip_top', 'wizard')?></p></div>
	
	<div class="margins">


		<div class="radio-box fancy square lefter mob-txt-gray_m">
			<!--    Options     -->
			
			<div class="option-box">
				<p><label><input class="epay" name="epay" type="checkbox" value="qrfree" checked="true"/><span class="bigger bold"><?=X('pay_qrfree','wizard')?></span><!--checked="true"--></label></p>
				<!-- <div 	class="col-12"></div> -->
				<h3 class="ixl confirm mob-txt-gray_d" id="epay_tip_qrfree" 	style="display:none;"><?=X('pay_tip_qrfree', 'wizard')?></h3>
			</div>
			
			<div class="option-box">
				<p><label><input class="epay" name="epay" type="checkbox" value="qrpayconiq"/><span class="bigger bold"><?=X('pay_qrpayconiq','wizard')?></span></label></p>
				<!-- <div 	class="col-12"></div> -->
				<h3 class="ixl confirm mob-txt-gray_d" id="epay_tip_qrpayconiq" 	style="display:none;"><?=X('pay_tip_payconiq', 'wizard')?></h3>
			</div>
			
			<div class="option-box">
				<p><label><input class="epay" name="epay" type="checkbox" value="terminal"/><span class="bigger bold"><?=X('pay_hardpos','wizard')?></span></label></p>
				<!-- <div 	class="col-12"></div> -->
				<h3 class="ixl confirm mob-txt-gray_d" id="epay_tip_terminal" 	style="display:none;"><?=X('pay_tip_hardpos', 'wizard')?></h3>
			</div>
			
			<div class="option-box">
				<p><label><input class="epay" name="epay" type="checkbox" value="softpos"/><span class="bigger bold"><?=X('pay_softpos','wizard')?></span></label></p>
				<!-- <div 	class="col-12"></div> -->
				<h3 class="ixl confirm mob-txt-gray_d" id="epay_tip_softpos" 	style="display:none;"><?=X('pay_tip_softpos', 'wizard')?></h3>
			</div>

			<div id="online_prepay" class="option-box">
				<p><label><input class="epay" name="epay" type="checkbox" value="prepay"/><span class="bigger bold"><?=X('pay_prepay','wizard')?></span></label></p>
				<!-- <div 	class="col-12"></div> -->
				<h3 class="ixl confirm mob-txt-gray_d" id="epay_tip_prepay" 	style="display:none;"><?=X('pay_tip_prepay', 'wizard')?></h3>
			</div>

			<h3 class="ixl" id="epay_misc" style="display:none; text-align:right;">epayment status</h3>
		</div>
		
	</div>
	<div class="margins">	
		
		<div class="">
			<!--    Tips     -->
			<h3 class="ixl confirm endtip centered mob-txt-gray_l" id="epay_tip_none" style="display:block;"><?=X('pay_tip_none','wizard')?></h3>
		</div>
	</div>
</section> <!-- e-payement -->



      <!--     H O W    M A N Y     A G E N D A s      -->
	
	

<section id="howmany_form" class="howmany bgwhite air">

	<div class="margins">
		<h1 class="centered squeezed air mob-txt-gray_l mobul unfold from-top invp"><?= X('howmany_section', 'wizard') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="howmany-question">
					<h2 class="confirm centered mob-txt-gray_m" style="display:block;"><?= X('howmany_question', 'wizard') ?></h2>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_2" style="display:none;">2&nbsp;<?= X('howmany_agendas', 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_3" style="display:none;">3&nbsp;<?= X('howmany_agendas', 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_4" style="display:none;">4&nbsp;<?= X('howmany_agendas', 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_6" style="display:none;">5-6&nbsp;<?= X('howmany_agendas', 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_8" style="display:none;">7-8&nbsp;<?= X('howmany_agendas', 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_10"  style="display:none;">10&nbsp;<?= X('howmany_agendas' , 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_12"  style="display:none;">12&nbsp;<?= X('howmany_agendas' , 'wizard') ?></h1>
					<h1 class="confirm centered mob-txt-gray_m" id="howmany_tip_16"  style="display:none;">16&nbsp;<?= X('howmany_agendas' , 'wizard') ?></h1>
					<h2 class="confirm centered mob-txt-gray_m" id="howmany_tip_20"  style="display:none;"><?= X('howmany_agendas20' , 'wizard') ?></h2>
				</div>
			</div>
			<div class="flexinner col-12 col-lg-4">
				<div class="options row">
					<div id="howmany_2" value="2" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">2</h2>
						</div>
					</div>
					<div id="howmany_3" value="3" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">3</h2>
						</div>
					</div>
					<div id="howmany_4" value="4" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">4</h2>
						</div>
					</div>
					<div id="howmany_6" value="6" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">6</h2>
						</div>
					</div>
					<div id="howmany_8" value="8" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">8</h2>
						</div>
					</div>
					<div id="howmany_10" value="10" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">10</h2>
						</div>
					</div>
					<div id="howmany_12" value="12" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">12</h2>
						</div>
					</div>
					<div id="howmany_16" value="16" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">16</h2>
						</div>
					</div>
					<div id="howmany_20" value="20" class="howmany touch-on col-4">
						<div class="flexinner howmany-box align-items-center mob-bg-gray_through">
							<h2 class="mob-txt-blue">20+</h2>
						</div>
					</div>
				</div>
			</div>
			<div class="flexinner col-12 col-lg-4 align-items-center">
				<div class="howmany-image">
					<img src="../assets/imgs/wizard/ag_howmany.jpg" alt="">				
				</div>
			</div>
		</div>
		<h3 class="ixl" id="howmany_form_status" style="display:none;">howmany_form_status</h3>
	</div>

</section> <!-- section howmany -->





<section class="access-wave">
	<div id="before_access_form" class="animate wbottom thereyougo"></div>
	
	<div class="margins access-title"><div class="row">
		<!-- <div class="col-12  col-md-2"><h2 class="h1track mob-txt-blue-soft"></h2></div> -->
		<div class="col-12 col-md-8"><h1 class="mob-txt-gray_m mobul unfold from-right invp"><?= X('access_section', 'wizard') ?></h1></div>
		<div class="d-none d-md-inline col-md-2"></div>
	</div></div>
	
	<div class="air">&nbsp;</div>
</section>



<section id="access_section" class="access-form air">
	<div id="access_form" class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-6 align-items-top">
				<div class="access-intro">
					<h2 class="centered mob-txt-gray_m squeezed"><?=X('access_question', 'wizard')?></h2>
				</div>
			</div>
			<div class="col-12 col-md-1 d-lg-none">
			</div>
			<div class="col-12 col-md-10 col-lg-6"> <!-- .ixl let placeholders appear for translation purpose  -->
				<h3 class="ixl" id="access-form-fname" style="display:none;"><?=X('placeholder_firstname', 'wizard')?></h3>
				<h3 class="ixl" id="access-form-lname" style="display:none;"><?=X('placeholder_lastname', 'wizard')?></h3>
				<h3 class="ixl" id="access-form-company" style="display:none;"><?=X('placeholder_company', 'wizard')?></h3>
				<h3 class="ixl" id="access-form-special" style="display:none;"><?=X('placeholder_special', 'wizard')?></h3>
				<h3 class="ixl" id="access-form-mobile" style="display:none;"><?=X('placeholder_mobile', 'wizard')?></h3>
				<h3 class="ixl" id="access-form-email" style="display:none;"><?=X('placeholder_email', 'wizard')?></h3>
				<h3 class="ixl" id="access-form-misc" style="display:none;">miscellaneous</h3>
				<h3 class="ixl confirm mob-txt-gray_l" id="tip_mandatory" style="display:block;"><?=X('data_mandatory', 'wizard')?></h3>
				<h3 class="ixl confirm mob-txt-gray_l" id="tip_mandatory" style="display:block; color:orange;"><?=X('data_mandatory2', 'wizard')?></h3>
			</div>
			<div class="col-12 col-md-1 d-lg-none">
			</div>
		</div>
	</div>

</section> <!-- section access form -->



<div id="after_access" class="animate wtop bgwhite" style="height:50px;">
	<script type="text/javascript">
			let after_access = document.querySelector("#after_access");
		var bhm = new C_waved( after_access, { animate:true, frequence:3, phase:0, speed:15, amplitude:100 });
		
	</script>
</div>




<!--    F O R M     O V E R A L L     S T A T U S    A N D     S U B M I T       -->


<section id="submit_overview" class="section bgwhite" style="position:relative;">
	<div id="validate_form" class="wide">

			<h1 class="centered squeezed air mob-txt-gray_l mobul unfold from-left invp"><?=X('global_status_section', 'wizard')?></h1>
			
			<div id="status_pro">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#pro_section"><h2 class="form-summary-replace orange"><?=X('pro_section', 'wizard')?></h2></a>
							<span id="summary_pro_medical" 	class="ixl form-summary-tip" style="display:none;"><?=X('pro_summary_medical', 'wizard')?></span>
							<span id="summary_pro_freelance" class="ixl form-summary-tip" style="display:none;"><?=X('pro_summary_freelance', 'wizard')?></span>
							<span id="summary_pro_medgroup" class="ixl form-summary-tip" style="display:none;"><?=X('pro_summary_medgroup', 'wizard')?></span>
							<span id="summary_pro_dental" 	class="ixl form-summary-tip" style="display:none;"><?=X('pro_summary_dental', 'wizard')?></span>
							<span id="summary_pro_industry" class="ixl form-summary-tip" style="display:none;"><?=X('pro_summary_industry', 'wizard')?></span>
							<span id="summary_pro_wellness" class="ixl form-summary-tip" style="display:none;"><?=X('pro_summary_wellness', 'wizard')?></span>
							<span id="summary_pro_x" class="ixl form-summary-tip" style="display:inline-block;">(<?=X('pro_summary_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#pro_section"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_current">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_current"><h2 class="form-summary-replace orange"><?=X('paper_section', 'wizard')?></h2></a>
				<span id="summary_current_paper" 	class="ixl form-summary-tip" style="display:none;"><?=X('paper_summary_paper', 'wizard')?></span>
				<span id="summary_current_electronic" class="ixl form-summary-tip" style="display:none;"><?=X('paper_summary_electronic', 'wizard')?></span>
				<span id="summary_current_x" 		class="ixl form-summary-tip" style="display:inline-block;">(<?=X('paper_summary_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_current"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_multi">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_multi"><h2 class="form-summary-replace orange"><?=X('multi_section', 'wizard')?></h2></a>
				<span id="summary_multi_single" 	class="ixl form-summary-tip" style="display:none;"><?=X('wz_ismulti_tip_single', 'wizard')?></span>
				<span id="summary_multi_2" 	class="ixl form-summary-tip" style="display:none;">2&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_3" 	class="ixl form-summary-tip" style="display:none;">3&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_4" 	class="ixl form-summary-tip" style="display:none;">4&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_6" 	class="ixl form-summary-tip" style="display:none;">5-6&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_8" 	class="ixl form-summary-tip" style="display:none;">7-8&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_10" class="ixl form-summary-tip" style="display:none;">9-10&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_12" class="ixl form-summary-tip" style="display:none;">11-12&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_16" class="ixl form-summary-tip" style="display:none;">13-16&nbsp;<?=X('howmany_agendas', 'wizard')?></span>
				<span id="summary_multi_20" class="ixl form-summary-tip" style="display:none;"><?=X('multi_summary_20', 'wizard')?></span>
				<span id="summary_multi_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('multi_summary_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_multi"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_slice">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_slice"><h2 class="form-summary-replace orange"><?=X('timeslice_section', 'wizard')?></h2></a>
				<span id="summary_slice_60" class="ixl form-summary-tip" style="display:none;"><?=X('timeslice_tip_60', 'wizard')?></span>
				<span id="summary_slice_30" class="ixl form-summary-tip" style="display:none;"><?=X('timeslice_tip_30', 'wizard')?></span>
				<span id="summary_slice_20" class="ixl form-summary-tip" style="display:none;"><?=X('timeslice_tip_20', 'wizard')?></span>
				<span id="summary_slice_15" class="ixl form-summary-tip" style="display:none;"><?=X('timeslice_tip_15', 'wizard')?></span>
				<span id="summary_slice_10" class="ixl form-summary-tip" style="display:none;"><?=X('timeslice_tip_10', 'wizard')?></span>
				<span id="summary_slice_5" class="ixl form-summary-tip" style="display:none;"><?=X('timeslice_tip_5', 'wizard')?></span>
				<span id="summary_slice_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('slice_summary_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_slice"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_comm">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_comm"><h2 class="form-summary-replace orange"><?=X('comm_section', 'wizard')?></h2></a>
				<span id="summary_comm_r" 	class="ixl form-summary-tip" style="display:none;"><?=X('comm_summary_r', 'wizard')?><br/></span>
				<span id="summary_comm_c" 	class="ixl form-summary-tip" style="display:none;"><?=X('comm_summary_c', 'wizard')?><br/></span>
				<span id="summary_comm_b" 	class="ixl form-summary-tip" style="display:none;"><?=X('comm_summary_b', 'wizard')?><br/></span>
				<span id="summary_comm_v" 	class="ixl form-summary-tip" style="display:none;"><?=X('comm_summary_v', 'wizard')?></span>
				<span id="summary_comm_x" 	class="ixl form-summary-tip" style="display:inline-block;"><?=X('comm_summary_notready', 'wizard')?></span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_comm"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_comanaged" style="display:none;">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_delegation"><h2 class="form-summary-replace orange"><?=X('comanaged_section', 'wizard')?></h2></a>
				
				<span id="summary_comanaged_nope" 		class="ixl form-summary-tip" style="display:none;"><?=X('summary_comanaged_nope', 'wizard')?></span>
				<span id="summary_comanaged_amongus" 	class="ixl form-summary-tip" style="display:none;"><?=X('summary_comanaged_amongus', 'wizard')?></span>
				<span id="summary_comanaged_assistants" class="ixl form-summary-tip" style="display:none;"><?=X('summary_comanaged_assistants', 'wizard')?></span>
				<span id="summary_comanaged_callcenter" class="ixl form-summary-tip" style="display:none;"><?=X('summary_comanaged_callcenter', 'wizard')?></span>
				
				<span id="summary_comanaged_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('summary_comanaged_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_delegation"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_singdel">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_delegation"><h2 class="form-summary-replace orange"><?=X('delegate_section', 'wizard')?></h2></a>
				
				<span id="summary_singdel_nope" 		class="ixl form-summary-tip" style="display:none;"><?=X('summary_singdel_nope', 'wizard')?></span>
				<span id="summary_singdel_assistant" 	class="ixl form-summary-tip" style="display:none;"><?=X('summary_singdel_assistant', 'wizard')?></span>
				<span id="summary_singdel_callcenter" 	class="ixl form-summary-tip" style="display:none;"><?=X('summary_singdel_callcenter', 'wizard')?></span>
				
				<span id="summary_singdel_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('summary_singdel_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_delegation"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_wisheresa">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_eresa"><h2 class="form-summary-replace orange"><?=X('eresa_section', 'wizard')?></h2></a>
				<span id="summary_wisheresa_yes" class="ixl form-summary-tip" style="display:none;"><?=X('eresa_summary_yes', 'wizard')?></span>
				<span id="summary_wisheresa_no" class="ixl form-summary-tip" style="display:none;"><?=X('eresa_summary_no', 'wizard')?></span>
				<span id="summary_wisheresa_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('eresa_summary_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_eresa"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_live2">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_live"><h2 class="form-summary-replace orange"><?=X('live_section', 'wizard')?></h2></a>
				<span id="summary_live2_yes" class="ixl form-summary-tip" style="display:none;"><?=X('live_summary_yes', 'wizard')?></span>
				<span id="summary_live2_no" class="ixl form-summary-tip" style="display:none;"><?=X('live_summary_no', 'wizard')?></span>
				<span id="summary_live2_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('live_summary_notready', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_live"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>

			<div id="status_epay">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_comm"><h2 class="form-summary-replace orange"><?=X('epayement_section', 'wizard')?></h2></a>
				<span id="summary_epay_qrfree" 	class="ixl form-summary-tip" style="display:none;"><?=X('pay_qrfree','wizard')?><br/></span>
				<span id="summary_epay_qrpayconiq" 	class="ixl form-summary-tip" style="display:none;"><?=X('pay_qrpayconiq','wizard')?><br/></span>
				<span id="summary_epay_terminal" 	class="ixl form-summary-tip" style="display:none;"><?=X('pay_hardpos','wizard')?><br/></span>
				<span id="summary_epay_softpos" 	class="ixl form-summary-tip" style="display:none;"><?=X('pay_softpos','wizard')?><br/></span>
				<span id="summary_epay_prepay" 	class="ixl form-summary-tip" style="display:none;"><?=X('pay_prepay','wizard')?></span>				
				<span id="summary_epay_x" 	class="ixl form-summary-tip" style="display:inline-block;"><?=X('no_mobpay','wizard')?></span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_comm"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_access">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td><a href="#before_howmany"><h2 class="form-summary-replace orange"><?=X('access_section', 'wizard')?></h2></a>
				<span id="summary_access_ok" class="ixl form-summary-tip" style="display:none;"><?=X('access_summary_ok', 'wizard')?></span>
				<span id="summary_access_x" class="ixl form-summary-tip" style="display:inline-block;">(<?=X('access_summary_x', 'wizard')?>)</span>
						</td>
					</tr>
					<tr>
						<td></td><td>
							<a class="form-summary-replace mob-txt-lime" href="#before_howmany"><div class="fad fa-1d5x fa-arrow-to-top"></div>&nbsp;<?=X('status_modify', 'wizard')?></a>
						</td>
					</tr>
				</table>
			</div>
			
			<div id="status_captcha">
				<table class="mob-txt-gray_m air">
					<tr>
						<td><i class="fsbullet fad fa-2x fa-exclamation-circle orange"></i></td>
						<td>
				<h2 class="form-summary-replace orange"><?=X('validate_section', 'wizard')?></h2>
				<span id="summary_captcha_ok" 	class="ixl form-summary-tip" style="display:none;"><?=X('captcha_summary_ok', 'wizard')?></span>
				<!--   <span id="summary_captcha_x" 	class="ixl form-summary-tip" style="display:inline-block;">(<?=X('captcha_summary_nok', 'wizard')?>)</span> -->
						</td>
					</tr>
					<tr>
						<td></td><td></td>
					</tr>
				</table>
			</div>

<!--    C A P T C H A       -->


			<?php include('../langless/captchaform.php');
			// $cqr is defined in captcha_form.php
			// this is a dependance because the folder level of all site pages is fixed	?>
			
			
			<h1 class="ixl mob-txt-gray_m air airup centered" id="wizard-tip-ok" style="display:none;"><?=X('submit_ready', 'wizard')?></h1>
			<h2 class="ixl mob-txt-gray_m air airup centered" id="wizard-tip-nok" style="display:none;"><?=X('submit_not_ready', 'wizard')?></h2>
			
			<h3 class="ixl" id="wizard-form-submit-caption-busy" style="display:none; text-align:left;"><i class="white fad fa-dove fa-1d5x"></i><span><?=X('caption_busy', 'wizard')?></span></h3>
			<h3 class="ixl" id="wizard-form-submit-caption-done" style="display:none; text-align:left;"><i class="white fad fa-grin-wink fa-1d5x"></i><span><?=X('caption_sent', 'wizard')?></span></h3>
			<h3 class="ixl" id="wizard-form-submit-caption-action" style="display:none;"><i class="white fad fa-cloud-upload-alt fa-1d5x"></i><span><?=X('caption_submit', 'wizard')?></span></h3>
			
			<div class="flexinner align-items-center">
				<div id="wizard-submit-button">
					<!-- interactive a element inserted here from js -->
				</div>
			</div>
			<h2 class="ixl mob-txt-gray_m air airup centered" id="wizard-tip-done" style="display:none;"><?=X('submit_waiting', 'wizard')?></h2>
			
			<h3 class="" id="wizard-form-misc" style="display:none;">language:</h3>

	</div>
</section>
	
	



	
<script type="text/javascript">
	
	var w = new C_iWizard('wz', {
		target: $('#wizard'),
		caid: <?=$cqr?>, // $cqr is defined in captcha_form.php
		lang: '<?=$l?>',
		ixl: '<?=$ixl?>'
	});
	w.display();
	w.activate();

</script>

<div class="gas bgwhite"></div>
<?php include('footer.php')?>
<?php include('cookies.php')?>
		
</body>
</html>