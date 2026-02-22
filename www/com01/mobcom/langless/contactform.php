
<section id="contactform" class="contact-form">

	<div id="contact" class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-top">
				<div class="contact-intro">
					<h2 class="centered mob-txt-gray_m"><?=X('contact_intro','contactform')?></h2>
				</div>
			</div>
			<div class="col-12 col-md-1 d-lg-none">
			</div>
			<div class="col-12 col-md-10 col-lg-8 contact-form"> <!-- .ixl let placeholders appear for translation purpose  -->
					<h3 class="ixl" id="contact-form-msg" style="display:none;"><?=X('placeholder_msg', 'contactform')?></h3>
					<h3 class="ixl" id="contact-form-name" style="display:none;"><?=X('placeholder_name', 'contactform')?></h3>
					<h3 class="ixl" id="contact-form-company" style="display:none;"><?=X('placeholder_company', 'contactform')?></h3>
					<h3 class="ixl" id="contact-form-special" style="display:none;"><?=X('placeholder_special', 'contactform')?></h3>
					<h3 class="ixl" id="contact-form-mobile" style="display:none;"><?=X('placeholder_mobile', 'contactform')?></h3>
					<h3 class="ixl" id="contact-form-email" style="display:none;"><?=X('placeholder_email', 'contactform')?></h3>
					<h3 class="ixl" id="contact-form-misc" style="display:none;">miscellaneous</h3>
					<h3 class="ixl" id="warning" style="display:block; color:red; padding-bottom:5px;"><?=X('warning_msg', 'contactform')?></h3>
					<h3 class="ixl confirm mob-txt-gray_l" id="tip_mandatory" style="display:block;"><?=X('contact_mandatory','contactform')?></h3>
			</div>
			<div class="col-12 col-md-1 d-lg-none">
			</div>
			
			<div class="air">&nbsp;</div>
			<?php include('../langless/captchaform.php'); ?>					
				
			<div class="col-10 col-md-8 col-lg-6 mx-auto"> <!-- (*cfs*) only for ixl -->
				<h3 class="ixl" id="contact-form-busy" style="display:none; text-align:left;"><?=X('caption_busy', 'contactform')?></h3>
				<h3 class="ixl" id="contact-form-sent" style="display:none; text-align:left;"><?=X('caption_sent', 'contactform')?></h3>
				<h3 class="ixl" id="contact-form-submit" style="display:none; text-align:left;"><?=X('caption_submit', 'contactform')?></h3>
			</div>
					
		</div>
	</div>


</section> 

