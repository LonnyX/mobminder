<?php

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                CONTACT FORM - To be included on langless pages, where needed
//


// DEPENDANCES:

//  In the header of the nesting php file:
//
//  <script src="../assets/js/mobminder/moblib.js"></script>
//  <script src="../assets/js/mobminder/xlate.js"></script>

//  In the parent html or form, the following code must be inserted so to nest this control:
//		
//  include('../assets/php/captcha_form.php'); // this is a dependance because the folder level of all site pages is fixed
// 	

//  In the parent js following code must be inserted so to start this control:
//		
//  var captcha = new C_iCaptcha(this.eids.captcha, {capchoice:new A_cb(this, this.capclick)}, { lang:preset.lang, target:this.state.target.find('#captcha-form'), caid:preset.caid , xl:this.state.xl });
//	captcha.display();
// 	captcha.activate();
//

?>


 <!--    C A P T C H A    -->

					
<div id="captcha-form" class="captcha-form margins">
	<div class="row">
		<div class="col-12 air">
			<h2 class="mob-txt-gray_l left bigger squeezed"><?=X('captcha_title', 'captcha')?></h2>
		</div>
			<?php
				$t = time();
				$cqr = (intval($t/10+$t)%10);
				$qq = 'captcha_q'.$cqr;
				$answers = Array();
				$from = Array(1,2,3,4,5);
				$matched = Array();
				while(count($from)) { // generate a random order for displaying answers
					$pick = array_rand($from);
					$peek = $from[$pick]; $matched[] = $peek;
					array_splice($from,$pick,1);
				}
			?>
		<div class="flexinner col-12 col-md-4 align-items-center">
			<h2 class="captcha-question mob-txt-gray_m air right"><?=X($qq, 'captcha')?></h2>
		</div>
		<div class="col-12 col-md-8 radio-box fancy lefter">
			<?php
				foreach($matched as $x => $m) {
					$i = '<input class="captcha" name="captcha" type="radio" value="'.$m.'"/>'; // appears like a radio choice
					echo '<p class="mob-txt-gray_d"><label>'.$i.'<span>'.X('captcha_q'.$cqr.'a'.$m, 'captcha').'</span></label></p>';
				}
			?>
		</div>
	</div>
	<div><div class="locker fa fa-20x fa-lock-alt"></div></div>
	<h3 class="" id="captcha-misc" style="display:none;">miscellaneous</h3>

</div>