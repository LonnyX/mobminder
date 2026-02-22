<!doctype html>
<html>

<head>
	<meta name="robots" content="noindex">
	<title>Booking pages customization e-learning</title>
	<meta name="description" content="With this online learning page you will be able to easily customize any mobminder booking page">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/cssbuilder.css">
	<link rel="stylesheet" href="../assets/css/controls.css">
	<script src="../assets/js/jquery.rightClick.js"></script>
	<script src="../assets/js/language.js"></script>
	<script src="../assets/js/mobframe.js"></script>
	<script src="../assets/js/controls.js"></script>
	<script src="../assets/js/elearning.js"></script>
	<script src="../assets/js/cssbuilder.js?b=2406"></script>
	

</head>


<body id="body" style="position:relative;"> <!-- class="slightwhite" */ -->

<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:0; left:0 right:0; bottom:0; width:100vw;"> <!-- scroll in div to make the dropdown *DR0* visible in viewport  */ -->


			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins" style="padding-top:1em;">
		<img class="moblogo" src="../assets/imgs/icon-1.png" alt="mobminder logo">
			<div class="headers">
				<h1 class="bold mobminder left unfold from-top s1"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></h1>
				<h1 class="left mob-txt-gray_m unfold from-left s2">Booking pages customization</h1>
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

<div id="features-menu" class="features-menu airupplus margins" style="padding-top:50px;">
	<div class="row">
		<div class="flexinner col-6 col-md-4 col-lg-4">
			<div class="unfold v-flip s0 single-service zoom first">
				<a href="#layout_section">
					<img src="../assets/imgs/cssbuilder/template.png" alt="">
					<i class="fa fa-highlighter fa-1d5x mob-txt-lime"></i>
					<h3 class="mob-txt-blue">Choose a template</h3>
				</a>
			</div>
		</div>
		<div class="flexinner col-6 col-md-4 col-lg-4">
			<div class="unfold v-flip s0 single-service zoom second">
				<a href="#palette_section">
					<img src="../assets/imgs/cssbuilder/palette.png" alt="">
					<i class="fa fa-highlighter fa-1d5x mob-txt-lime"></i>
					<h3 class="mob-txt-blue">Select and adapt a color palette</h3>
				</a>
			</div>
		</div>
		<div class="flexinner col-12 col-md-4 col-lg-4">
			<div class="unfold v-flip s0 single-service zoom third">
				<a href="#custom-css">
					<img src="../assets/imgs/cssbuilder/css.png" alt="">
					<i class="fa fa-highlighter fa-1d5x mob-txt-lime"></i>
					<h3 class="mob-txt-blue">Modify CSS elements</h3>
				</a>
			</div>
		</div>
	</div>
</div>



</section>  <!-- section welcome -->



		<!-- L A Y O U T S  -->


<section id="layout_section" class="layouts bgwhite air">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air">Choose your layout</h1>
	</div>
	<div id="layout_form" class="margins">
		<div class="row">
			<div id="layout_stripinfo" value="stripinfo" class="layout touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-layout mob-bg-gray_l">
					<div><img src="../assets/imgs/cssbuilder/strip-info.jpg" alt=""></div>
					<h3 class="white">Strip info</h3>
				</div>
			</div>
			<div id="layout_boxyinfo" value="boxyinfo" class="layout touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-layout mob-bg-gray_l">
					<img src="../assets/imgs/cssbuilder/boxy-info.jpg" alt="">
					<h3 class="white">Boxy info</h3>
				</div>
			</div>
			<!-- <div id="layout_framedinfo" value="framedinfo" class="layout touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-layout mob-bg-gray_l">
					<img src="../assets/imgs/cssbuilder/strip-titleimg.PNG" alt="">
					<h3 class="white">Framed info</h3>
				</div>
			</div> -->
			<!-- <div id="layout_fullcolor" value="fullcolor" class="layout touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-layout mob-bg-gray_l">
					<img src="../assets/imgs/cssbuilder/half-color.PNG" alt="">
					<h3 class="white">Full color</h3>
				</div>
			</div> -->
			<div id="layout_striplogo" value="striplogo" class="layout touch-on flexinner col-12 col-md-4 col-lg-4">
				<div class="single-layout mob-bg-gray_l">
					<img src="../assets/imgs/cssbuilder/striplogo.jpg" alt="">
					<h3 class="white">Strip logo</h3>
				</div>
			</div>
			<!-- <div id="layout_fullimg" value="fullimg" class="layout touch-on flexinner col-6 col-md-4 col-lg-4">
				<div class="single-layout mob-bg-gray_l">
					<img src="../assets/imgs/cssbuilder/full-img2.PNG" alt="">
					<h3 class="white">full image</h3>
				</div>
			</div> -->
		</div>
		<h3 class="" id="layout_form_status" style="display:none;">layout_form_status</h3>
	</div>

</section> <!-- section layouts -->





		<!-- C O L O R      P A L E T T E S -->

<section id="palette_section" class="palettes bgwhite air">

	<div class="margins">
		<h1 class="bigger centered squeezed mob-txt-gray_l air airup">Choose your color palette</h1>
	</div>
	<div id="palette_form" class="margins">
		<div class="row">
			<div id="palette_pumpkin" value="pumpkin" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_mothernature" value="mothernature" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_classyautomn" value="classyautomn" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_classygold" value="classygold" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_black" value="black" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_medical" value="medical" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_pinky" value="pinky" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_monoblues" value="monoblues" class="palette touch-on flexinner col-6 col-md-4"></div>
			<div id="palette_olive" value="olive" class="palette touch-on flexinner col-6 col-md-4"></div>
		</div>
		<h3 class="" id="palette_form_status" style="display:none;">palette_form_status</h3>
	</div>

	<div class="margins" style="padding-top:30px;">
		<h2 id="palette_cedit_h2" class="bigger centered squeezed mob-txt-gray_m air" style="display:none;">Adapt your color palette</h2> <!-- for background colors, RGBA color formats have to be used ! color selector and convertor: https://g.co/kgs/MEppGqK -->
		<div id="palette_cedit_container"></div>
	</div>

</section> <!-- section palettes -->


		<!--    C U S T O M    C S S    -->

<section id="custom-css" class="custom-css air">

<div class="margins">
	<h1 class="bigger air centered mob-txt-gray_l air airup">Custom CSS</h1>
</div>

	<div class="wide" style="">
		<table style="width:100%;">
			<tr>
				<td style=""> 
					<h2 class="bigger air left mob-txt-blue">CSS Elements</h2>
					
					<!-- Welcome page colors css -->
					<h3 id="welcome-colors" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Text and background colors</h3>
					<div id="welcome-colors-toggle" style="display:none;">
						<!-- Examples to be copied  -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">color:rgb(255,0,0);</span></h4> <!-- when copy-instruction elements are clicked, instruction is copied in clipboard *CTC* -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">color:#FF0000;</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">background-color:rgb(255,0,0);</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">background-color:#FF0000;</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">background-color:rgba(255,0,0,0.5);</span></h4>


					
						<h4 id="welcome-colors-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-colors-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://youtu.be/5Rd9AEl4RHw" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fab fa-youtube" style="padding-right:10px;"></i>Colors choice</a>
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/color" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px"></i>CSS Color</a>
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-color" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>CSS Background-color</a>
								<a class="mob-txt-gray_d" href="https://www.w3schools.com/css/css3_colors.asp" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>CSS RGBA Background-color opacity</a>
								<a class="mob-txt-gray_d" href="https://cssgradient.io/" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Grandient generator</a>
								<a class="mob-txt-gray_d" href="https://mycolor.space" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Grandient generator</a>
								<a class="mob-txt-gray_d" href="https://coolors.co" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Color palettes generator</a>
								<a class="mob-txt-gray_d" href="https://superdesigner.co/tools/css-backgrounds" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Pattern backgrounds generator</a>
							</div>

						<h4 id="welcome-colors-root" class="air bigger left bold mob-txt-blue" style="display:none;" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Root</h4>
						<div id="welcome-colors-root-toggle" style="display:none;">	
							<div id="welcome-colors-root-cssrule" style="display:block;"></div>	
						</div>
						<h4 id="welcome-colors-body" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Body</h4>
							<div id="welcome-colors-body-toggle" style="display:none;">	
								<div id="welcome-colors-body-cssrule" style="display:block;"></div>	
							</div>
						<h4 id="welcome-colors-links" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Header links</h4>
							<div id="welcome-colors-links-toggle" style="display:none;">						
								<div id="welcome-colors-links-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-links-container-cssrule" style="display:block"></div>	
								<div id="welcome-colors-links-item-cssrule" style="display:block"></div>
							</div>
						<h4 id="welcome-colors-h1" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Title</h4>
							<div id="welcome-colors-h1-toggle" style="display:none;">	
								<div id="welcome-colors-h1-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-h1-container-cssrule" style="display:block"></div>	
								<div id="welcome-colors-h1-item-cssrule" style="display:block"></div><span></span>
							</div>

						<h4 id="welcome-colors-img" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Image</h4>
							<div id="welcome-colors-img-toggle" style="display:none;">	
								<div id="welcome-colors-img-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-img-container-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-colors-info" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Info</h4>
							<div id="welcome-colors-info-toggle" style="display:none;">	
								<div id="welcome-colors-info-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-info-container-cssrule" style="display:block"></div>	
								<div id="welcome-colors-info-item-cssrule" style="display:block"></div>
								<div id="welcome-colors-info-linksitem-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-cta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTAs</h4>
							<div id="welcome-colors-cta-toggle" style="display:none;">	
								<div id="welcome-colors-cta-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-cta-container-cssrule" style="display:block"></div>	
								<div id="welcome-colors-cta-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-directions" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Hours & directions</h4>
							<div id="welcome-colors-directions-toggle" style="display:none;">	
								<div id="welcome-colors-directions-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-directions-container-cssrule" style="display:block"></div>	
								<div id="welcome-colors-directions-item-cssrule" style="display:block"></div>
								<div id="welcome-colors-directions-linksitem-cssrule" style="display:block"></div>
							</div>
						
						<h4 id="welcome-colors-bullet" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Bullets</h4>
							<div id="welcome-colors-bullet-toggle" style="display:none;">	
								<div id="welcome-colors-bullet-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-bulletcaption" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Bullets' caption</h4>
							<div id="welcome-colors-bulletcaption-toggle" style="display:none;">	
								<div id="welcome-colors-bulletcaption-item-cssrule" style="display:block"></div>
							</div>
						
						<h4 id="welcome-colors-previous" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Previous step</h4>
							<div id="welcome-colors-previous-toggle" style="display:none;">	
								<div id="welcome-colors-previous-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-input" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Inputs (text fields)</h4>
							<div id="welcome-colors-input-toggle" style="display:none;">	
								<div id="welcome-colors-input-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-warner" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Warner</h4>
							<div id="welcome-colors-warner-toggle" style="display:none;">	
								<div id="welcome-colors-warner-item-cssrule" style="display:block"></div>
							</div>
							
						<!-- <h4 id="welcome-colors-cta-next" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA Next</h4>
							<div id="welcome-colors-cta-next-toggle" style="display:none;">	
								<div id="welcome-colors-cta-next-item-cssrule" style="display:block"></div>
							</div> -->

						<h4 id="welcome-colors-tooltip" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Tooltip</h4>
							<div id="welcome-colors-tooltip-toggle" style="display:none;">	
								<div id="welcome-colors-tooltip-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-selection-headers" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Selection headers</h4>
							<div id="welcome-colors-selection-headers-toggle" style="display:none;">	
								<div id="welcome-colors-selection-headers-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-unselected-ruby" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Unselected rubies</h4>
							<div id="welcome-colors-unselected-ruby-toggle" style="display:none;">	
								<div id="welcome-colors-unselected-ruby-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-selected-ruby" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Selected rubies</h4>
							<div id="welcome-colors-selected-ruby-toggle" style="display:none;">	
								<div id="welcome-colors-selected-ruby-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-notes" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Notes</h4>
							<div id="welcome-colors-notes-toggle" style="display:none;">	
								<div id="welcome-colors-notes-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-colors-slider" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Cancellation slider</h4>
							<div id="welcome-colors-slider-toggle" style="display:none;">	
								<div id="welcome-colors-slider-item-cssrule" style="display:block"></div>
								<div id="welcome-colors-slider-item2-cssrule" style="display:block"></div>
							</div>

						<!-- <h4 id="welcome-colors-endcta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA end</h4>
							<div id="welcome-colors-endcta-toggle" style="display:none;">	
								<div id="welcome-colors-endcta-item-cssrule" style="display:block"></div>
							</div> -->

						<h4 id="welcome-colors-scroll" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Scroll</h4>
							<div id="welcome-colors-scroll-toggle" style="display:none;">	
								<div id="welcome-colors-scroll-item-cssrule" style="display:block"></div>
								<div id="welcome-colors-scroll-item2-cssrule" style="display:block"></div>
							</div>
							
						<h4 id="welcome-colors-footer" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Footer</h4>
							<div id="welcome-colors-footer-toggle" style="display:none;">	
								<div id="welcome-colors-footer-section-cssrule" style="display:block"></div>	
								<div id="welcome-colors-footer-container-cssrule" style="display:block"></div>	
								<div id="welcome-colors-footer-item-cssrule" style="display:block"></div>
							</div>
					
					
					</div>


					<!-- Welcome page texteffect css -->
					<h3 id="welcome-texteffect" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Text effects</h3>
					<div id="welcome-texteffect-toggle" style="display:none;">

						<!-- Examples to be copied  -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">text-decoration: underline;</span></h4> <!-- when copy-instruction elements are clicked, instruction is copied in clipboard *CTC* -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">font-weight: bold;</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">text-shadow: 1px 1px 2px rgb(0,120,183);</span></h4>

						<h4 id="welcome-texteffect-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-texteffect-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>CSS text-decoration</a>
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/fr/docs/Web/CSS/font-weight" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>CSS font-weight</a>
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/fr/docs/Web/CSS/text-shadow" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>CSS Text shadow</a>
								<a class="mob-txt-gray_d" href="https://www.cssportal.com/css3-text-shadow-generator/" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Text shadow generator</a>
							</div>

						<h4 id="welcome-texteffect-body" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Body</h4>
							<div id="welcome-texteffect-body-toggle" style="display:none;">	
								<div id="welcome-texteffect-body-cssrule" style="display:block;"></div>	
							</div>
						<h4 id="welcome-texteffect-links" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Header links</h4>
							<div id="welcome-texteffect-links-toggle" style="display:none;">						
								<div id="welcome-texteffect-links-item-cssrule" style="display:block"></div>
							</div>
						<h4 id="welcome-texteffect-h1" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Title</h4>
							<div id="welcome-texteffect-h1-toggle" style="display:none;">	
								<div id="welcome-texteffect-h1-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-texteffect-info" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Info</h4>
							<div id="welcome-texteffect-info-toggle" style="display:none;">	
								<div id="welcome-texteffect-info-item-cssrule" style="display:block"></div>
								<div id="welcome-texteffect-info-linksitem-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-texteffect-cta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTAs</h4>
							<div id="welcome-texteffect-cta-toggle" style="display:none;">	
								<div id="welcome-texteffect-cta-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-texteffect-directions" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Hours & directions</h4>
							<div id="welcome-texteffect-directions-toggle" style="display:none;">	
								<div id="welcome-texteffect-directions-item-cssrule" style="display:block"></div>
								<div id="welcome-texteffect-directions-linksitem-cssrule" style="display:block"></div>
							</div>
							
						<h4 id="welcome-texteffect-footer" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Footer</h4>
							<div id="welcome-texteffect-footer-toggle" style="display:none;">	
								<div id="welcome-texteffect-footer-item-cssrule" style="display:block"></div>
							</div>
					</div>


					<!-- Welcome page border css -->
					<h3 id="welcome-border" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Border & box shadow</h3>
					<div id="welcome-border-toggle" style="display:none;">

						<!-- Examples to be copied  -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">border: 1px solid #ff6550;</span></h4> <!-- when copy-instruction elements are clicked, instruction is copied in clipboard *CTC* -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);</span></h4>

						<h4 id="welcome-border-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-border-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://cssgenerator.org/border-css-generator.html" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Border generator</a>
								<a class="mob-txt-gray_d" href="https://box-shadow.dev/" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Box shadow generator</a>
							</div>

						<h4 id="welcome-border-links" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Header links</h4>
							<div id="welcome-border-links-toggle" style="display:none;">						
								<div id="welcome-border-links-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-links-container-cssrule" style="display:block"></div>	
								<div id="welcome-border-links-item-cssrule" style="display:block"></div>
							</div>
						<h4 id="welcome-border-h1" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Title</h4>
							<div id="welcome-border-h1-toggle" style="display:none;">	
								<div id="welcome-border-h1-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-h1-container-cssrule" style="display:block"></div>
								<div id="welcome-border-h1-item-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-border-img" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Image</h4>
							<div id="welcome-border-img-toggle" style="display:none;">	
								<div id="welcome-border-img-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-img-container-cssrule" style="display:block"></div>	
								<div id="welcome-border-img-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-border-info" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Info</h4>
							<div id="welcome-border-info-toggle" style="display:none;">	
								<div id="welcome-border-info-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-info-container-cssrule" style="display:block"></div>
								<div id="welcome-border-info-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-border-cta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTAs</h4>
							<div id="welcome-border-cta-toggle" style="display:none;">	
								<div id="welcome-border-cta-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-cta-container-cssrule" style="display:block"></div>	
								<div id="welcome-border-cta-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-border-directions" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Hours & directions</h4>
							<div id="welcome-border-directions-toggle" style="display:none;">	
								<div id="welcome-border-directions-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-directions-container-cssrule" style="display:block"></div>	
							</div>

							
						<h4 id="welcome-border-bullet" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Bullets</h4>
							<div id="welcome-border-bullet-toggle" style="display:none;">	
								<div id="welcome-border-bullet-item-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-border-input" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Inputs (text fields)</h4>
							<div id="welcome-border-input-toggle" style="display:none;">	
								<div id="welcome-border-input-item-cssrule" style="display:block"></div>	
							</div>

						<!-- <h4 id="welcome-border-cta-next" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA next</h4>
							<div id="welcome-border-cta-next-toggle" style="display:none;">	
								<div id="welcome-border-cta-next-item-cssrule" style="display:block"></div>
							</div> -->
							
						<h4 id="welcome-border-notes" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Notes</h4>
							<div id="welcome-border-notes-toggle" style="display:none;">	
								<div id="welcome-border-notes-item-cssrule" style="display:block"></div>	
							</div>

						<!-- <h4 id="welcome-border-endcta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA end</h4>
							<div id="welcome-border-endcta-toggle" style="display:none;">	
								<div id="welcome-border-endcta-item-cssrule" style="display:block"></div>	
							</div> -->

						<h4 id="welcome-border-selection" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Time selection</h4>
							<div id="welcome-border-selection-toggle" style="display:none;">	
								<div id="welcome-border-selection-item-cssrule" style="display:block"></div>	
							</div>
							
						<h4 id="welcome-border-footer" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Footer</h4>
							<div id="welcome-border-footer-toggle" style="display:none;">	
								<div id="welcome-border-footer-section-cssrule" style="display:block"></div>	
								<div id="welcome-border-footer-container-cssrule" style="display:block"></div>	
							</div>
					</div>

					<!-- Welcome page radius css -->
					<h3 id="welcome-radius" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Radius</h3>
					<div id="welcome-radius-toggle" style="display:none;">

						<!-- Examples to be copied  -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">border-radius: 20px;</span></h4> <!-- when copy-instruction elements are clicked, instruction is copied in clipboard *CTC* -->


						<h4 id="welcome-radius-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-radius-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>Border radius generator</a>
							</div>

						<h4 id="welcome-radius-links" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Header links</h4>
							<div id="welcome-radius-links-toggle" style="display:none;">
								<div id="welcome-radius-links-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-links-container-cssrule" style="display:block"></div>	
								<div id="welcome-radius-links-item-cssrule" style="display:block"></div>
							</div>
						<h4 id="welcome-radius-h1" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Title</h4>
							<div id="welcome-radius-h1-toggle" style="display:none;">	
								<div id="welcome-radius-h1-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-h1-container-cssrule" style="display:block"></div>	
								<div id="welcome-radius-h1-item-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-radius-img" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Image</h4>
							<div id="welcome-radius-img-toggle" style="display:none;">	
								<div id="welcome-radius-img-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-img-container-cssrule" style="display:block"></div>	
								<div id="welcome-radius-img-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-radius-info" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Info</h4>
							<div id="welcome-radius-info-toggle" style="display:none;">	
								<div id="welcome-radius-info-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-info-container-cssrule" style="display:block"></div>	
								<div id="welcome-radius-info-item-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-radius-cta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTAs</h4>
							<div id="welcome-radius-cta-toggle" style="display:none;">	
								<div id="welcome-radius-cta-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-cta-container-cssrule" style="display:block"></div>	
								<div id="welcome-radius-cta-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-radius-directions" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Hours & directions</h4>
							<div id="welcome-radius-directions-toggle" style="display:none;">	
								<div id="welcome-radius-directions-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-directions-container-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-radius-bullet" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Bullets</h4>
							<div id="welcome-radius-bullet-toggle" style="display:none;">
								<div id="welcome-radius-bullet-item-cssrule" style="display:block"></div>	
							</div>

							<h4 id="welcome-radius-input" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Inputs (text fields)</h4>
							<div id="welcome-radius-input-toggle" style="display:none;">	
								<div id="welcome-radius-input-item-cssrule" style="display:block"></div>	
							</div>						
							
						<!-- <h4 id="welcome-radius-cta-next" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA next</h4>
							<div id="welcome-radius-cta-next-toggle" style="display:none;">	
								<div id="welcome-radius-cta-next-item-cssrule" style="display:block"></div>	
							</div> -->

							<h4 id="welcome-radius-notes" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Notes</h4>
							<div id="welcome-radius-notes-toggle" style="display:none;">	
								<div id="welcome-radius-notes-item-cssrule" style="display:block"></div>	
							</div>						
							
						<!-- <h4 id="welcome-radius-endcta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA end</h4>
							<div id="welcome-radius-endcta-toggle" style="display:none;">	
								<div id="welcome-radius-endcta-item-cssrule" style="display:block"></div>	
							</div> -->

						<h4 id="welcome-radius-selection" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Time selection</h4>
							<div id="welcome-radius-selection-toggle" style="display:none;">	
								<div id="welcome-radius-selection-item-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-radius-footer" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Footer</h4>
							<div id="welcome-radius-footer-toggle" style="display:none;">	
								<div id="welcome-radius-footer-section-cssrule" style="display:block"></div>	
								<div id="welcome-radius-footer-container-cssrule" style="display:block"></div>	
							</div>
					</div>


					<!-- Welcome page Hover CTA css -->
					<h3 id="welcome-ctainteractivity" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Hover</h3>
					<div id="welcome-ctainteractivity-toggle" style="display:none;">

						<!-- Examples to be copied  -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">color:rgba(255,0,0,1);</span></h4> <!-- when copy-instruction elements are clicked, instruction is copied in clipboard *CTC* -->
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">background-color:rgba(255,0,0,0.5);</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">border: 1.5px solid #ff6550;</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">border-radius: 20px;</span></h4> 
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">transform: scale(1.05);</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">transform: rotate(2deg);</span></h4>
						<h4 class="mob-txt-gray_d"><i class="fa fa-copy mob-txt-lime"></i><span class="copy-instruction">translate: 5px 5px;</span></h4>

					
						<h4 id="welcome-ctainteractivity-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-ctainteractivity-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px"></i>Transform scale</a>
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>Transform rotate</a>
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/translate" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>Transform translate</a>
							</div>

						<h4 id="welcome-ctainteractivity-cta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTAs</h4>
							<div id="welcome-ctainteractivity-cta-toggle" style="display:none;">	
								<div id="welcome-ctainteractivity-cta-item-cssrule" style="display:block"></div>
							</div>
						<!-- <h4 id="welcome-ctainteractivity-ctanext" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA Next</h4>
							<div id="welcome-ctainteractivity-ctanext-toggle" style="display:none;">	
								<div id="welcome-ctainteractivity-ctanext-item-cssrule" style="display:block"></div>
							</div> -->
						<h4 id="welcome-ctainteractivity-selection" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Selections</h4>
							<div id="welcome-ctainteractivity-selection-toggle" style="display:none;">	
								<div id="welcome-ctainteractivity-selection-item-cssrule" style="display:block"></div>
							</div>

						<!-- <h4 id="welcome-ctainteractivity-endcta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA end</h4>
							<div id="welcome-ctainteractivity-endcta-toggle" style="display:none;">	
								<div id="welcome-ctainteractivity-endcta-item-cssrule" style="display:block"></div>
							</div> -->
					</div>


					<!-- Welcome page margin and padding css -->
					<h3 id="welcome-spaces" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Margin & padding</h3>
					<div id="welcome-spaces-toggle" style="display:none;">

						<h4 id="welcome-spaces-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-spaces-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://codepen.io/psande/pen/nKOJyX" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>What is a padding vs margin?</a>
							</div>

						<h4 id="welcome-spaces-links" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Header links</h4>
							<div id="welcome-spaces-links-toggle" style="display:none;">						
								<div id="welcome-spaces-links-section-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-links-container-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-links-item-cssrule" style="display:block"></div>
							</div>
						<h4 id="welcome-spaces-h1" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Title</h4>
							<div id="welcome-spaces-h1-toggle" style="display:none;">	
								<div id="welcome-spaces-h1-section-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-h1-container-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-spaces-img" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Image</h4>
							<div id="welcome-spaces-img-toggle" style="display:none;">	
								<div id="welcome-spaces-img-section-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-img-container-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-img-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-spaces-info" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Info</h4>
							<div id="welcome-spaces-info-toggle" style="display:none;">	
								<div id="welcome-spaces-info-section-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-info-container-cssrule" style="display:block"></div>	
							</div>

						<h4 id="welcome-spaces-cta" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>CTA</h4>
							<div id="welcome-spaces-cta-toggle" style="display:none;">	
								<div id="welcome-spaces-cta-section-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-cta-container-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-cta-item-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-spaces-directions" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Hours & directions</h4>
							<div id="welcome-spaces-directions-toggle" style="display:none;">	
								<div id="welcome-spaces-directions-section-cssrule" style="display:block"></div>	
								<div id="welcome-spaces-directions-container-cssrule" style="display:block"></div>	
							</div>

							
						<h4 id="welcome-spaces-footer" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Footer</h4>
							<div id="welcome-spaces-footer-toggle" style="display:none;">	
								<div id="welcome-spaces-footer-section-cssrule" style="display:block"></div>	
							</div>
					</div>

					<!-- Welcome page img opacity css -->
					<h3 id="welcome-opacity" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Image opacity</h3>
					<div id="welcome-opacity-toggle" style="display:none;">

						<h4 id="welcome-opacity-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-opacity-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/opacity" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-code" style="padding-right:10px;"></i>CSS Image opacity</a>
							</div>

						<h4 id="welcome-opacity-body" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Body</h4>
							<div id="welcome-opacity-body-toggle" style="display:none;">
								<div id="welcome-opacity-body-cssrule" style="display:block"></div>
							</div>

						<h4 id="welcome-opacity-img" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Image</h4>
							<div id="welcome-opacity-img-toggle" style="display:none;">
								<div id="welcome-opacity-img-item-cssrule" style="display:block"></div>
							</div>
					</div>

					<!-- Welcome page free CSS like @keyframes  -->
					<h3 id="welcome-freecss" class="bigger air left bold mob-txt-gray_m" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-lime"></i>Free CSS</h3>
					<div id="welcome-freecss-toggle" style="display:none;">

						<h4 id="welcome-freecss-priorknowledge" class="air bigger left bold knowledge" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right"></i>Prior knowledge and tools</h4>
							<div id="welcome-freecss-priorknowledge-toggle" style="display:none;">
								<a class="mob-txt-gray_d" href="https://www.animista.net" target="blank" rel="noopener nofollow" style="display:block; padding:10px; border-radius:5px;"><i class="fa fa-wrench" style="padding-right:10px;"></i>Keyframe animation generator</a>
							</div>

						<h4 id="welcome-freecss-additional" class="air bigger left bold mob-txt-blue" onclick="togglecssinstruction(this);"><i class="fa fa-chevron-right mob-txt-blue"></i>Additional CSS</h4>
							<div id="welcome-freecss-additional-toggle" style="display:none;">
								<div id="welcome-freecss-additional-item-cssrule" style="display:block"></div>
							</div>
					</div>

				</td>

				
				</td>

				<!-- <td style="width:70%; height:auto;"><iframe id="if_preview" src='../langless/eresa-welcome.php' style="border: 1px solid red; width:100%; min-height:1200px;"></iframe></td> -->
				<td style="width:70%;">
					<div id="dropdown-container" style="text-align:right; position:relative;"> <!-- *DR0* -->
					</div>
					<div id="viewport-container" class="viewport-computer" style="vertical-align:top; margin:20px auto;">
						<iframe id="if_preview" class="iframe-window iframe_70pc" src='../langless/eresa-welcome.php' style=""></iframe>
					</div>
				</td>
			</tr>
		</table>
	</div>
	

	<script>

	function togglecssinstruction(csstheme) {
		let cssthemeid = csstheme.id;
		if($('#'+cssthemeid+'-toggle').css('display') === 'none')
		{
			$('#'+cssthemeid+' i').css({'transform':'rotate(90deg)','transition':'transform 400ms ease-in-out' });
			$('#'+cssthemeid+'-toggle').fadeToggle(200);
		}
		else 
		{
			$('#'+cssthemeid+' i').css({'transform':'rotate(0deg)','transition':'transform 400ms ease-in-out' });
			$('#'+cssthemeid+'-toggle').fadeToggle(200);
		}
	}



	
	</script>
	
</section>
	

<section id="sumup-style" class="sumup-style air">

<div class="margins">
	<h1 class="bigger air centered mob-txt-gray_l unfold from-center invp">Summary of applied css</h1>
</div>
	


<div class="wide mob-txt-gray_d" id="css-summary" style="padding:10px 10px; border:1px solid rgb(209 213 219); border-radius:5px;"> <!-- filed with all css generated through the custom css step JBO-cr -->
There is no custom CSS selected
</div>

<div class="wide mob-txt-gray_d right" id="copycssbtn_container" style="padding:20px 0px; margin:0 auto;"></div>

	
</section>

<?php include('footer.php')?>



<script> 

	const copyTextElements = Array.from(document.querySelectorAll('.copy-instruction'));  // *CTC*

	copyTextElements.forEach(copyText => {
		copyText.addEventListener('click', () => {
			const textToCopy = copyText.innerText;
			navigator.clipboard.writeText(textToCopy);
		});
     });

</script>


<script>

	let mymain = new main();
	mymain.display();
	mymain.activate();

    

</script>	

</div>

</body>
</html>