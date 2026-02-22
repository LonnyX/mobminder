<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/transactionfees.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/transactionfees.css">
</head>

<body> <!-- class="slightwhite" */ -->


<?php include('menu.php')?>



			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="wide headers-container" style="padding-top:1em;">
			<h1>
				<a href="./index.php">
				<div class="logo unfold from-left s5"><img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo"></span><span class="bold mobminder air" style="padding-left:0.2em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span><div class="mob-bg-gray_l white containerpay unfold from-right s6" style="margin-bottom:0.2em;"><span>Pay</span></div></div>
				<div class="headers">
				</a>
					<div class="bold left mob-txt-gray_m unfold from-top s1 airup"><?= X('top_header_l1') ?></div>
				</div>
			</h1>
		</div>
	</div>
	<div class="advantages">
		<div class="wide airplus airupplus">
            <h2 class="centered white_shadowed unfold from-left s2" style="">
            <?= X('banner_intro') ?>
            </h2>
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







	<!--    T R A N S A C T I O N    F E E S    P R I C I N G      -->




<section id="plan" class="plan noverflow airup">
                    

	<div class="margins" style="z-index:1;">
		<h1 class="centered mob-txt-gray_l air mobul"><?= X('sec1_title') ?></h1>
	</div>
	
    <div id="belgiumfees" class="margins" style="padding:0.8em;" onclick="togglecssinstruction('belgiumfees');">
    	<a><h2 class="mob-txt-blue bold"><span class="flag belgium"></span><?= X('country_be') ?><span style="padding-left:15px; display:inline-block; vertical-align: middle;"><i class="fa fa-chevron-right mob-txt-lime"></i></span></h2></a>  <!--   T R A N S A C T I O N    F E E S    B E L G I U M      -->
    </div>

    <div id="belgiumfees-toggle" class="margins justify-content-center" style="padding-bottom:3rem; display:none;">

		<div class="plan-box col-sm-12" style="margin-bottom:30px;">
			
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title1') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
							<li class="mob-txt-gray_m"><?= X('fee_1') ?><br><span class="mob-txt-blue">0,20 €</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,34 €</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">0,15 € + 1,65 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what1') ?></div>
				</div>
			</div> 
		</div>
		
		<div class="plan-box col-sm-12" style="margin-bottom:30px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
                        <h2 class="mob-txt-gray_m"><?= X('fee_title2') ?></h2>
                        <p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
							<li class="mob-txt-gray_m"><?= X('fee_4') ?><br><span class="mob-txt-blue"><?= X('free') ?></span></li>
							<li class="mob-txt-gray_m"><?= X('fee_1') ?><br><span class="mob-txt-blue">0,06 €</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what2') ?></div>
				</div>
			</div>
        
        </div>

		<div class="plan-box col-sm-12" style="margin-bottom:30px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
                        <h2 class="mob-txt-gray_m"><?= X('fee_title3') ?></h2>
                        <p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,19 €</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">1,65 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what3') ?></div>
				</div>
			</div>
        
        </div>


        <div class="plan-box col-sm-12" style="margin-bottom:30px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title4') ?></h2>
                        <p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,12 €</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">0,85 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what4') ?></div>
				</div>
			</div> 
		</div>

	</div>




    <div id="francefees" class="margins" style="padding:0.8em;" onclick="togglecssinstruction('francefees');">
        <a><h2 class="mob-txt-blue bold"><span class="flag france"></span><?= X('country_fr') ?><span style="padding-left:15px; display:inline-block; vertical-align: middle;"><i class="fa fa-chevron-right mob-txt-lime"></i></span></h2></a>  <!--   T R A N S A C T I O N    F E E S    F R A N C E      -->
    </div>

    <div id="francefees-toggle" class="margins justify-content-center" style="padding-bottom:3rem; display:none;">

		<div class="plan-box col-sm-12" style="margin-bottom:20px;">
				<div class="col-12">
					<div class="plan-box1">
					
						<div class="plan-header highlighted centered">
							<h2 class="mob-txt-gray_m"><?= X('fee_title1') ?></h2>
							<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
						</div>
						<div class="plan-features">
							<ul class="centered">
								<li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,15 € + 0,50 %</span></li>
								<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">0,15 € + 1,65 %</span></li>
							</ul>
						</div>
						<div class="plan-footer mob-txt-gray_m"><?= X('fee_what1') ?></div>
					</div>
				</div> 
			</div>
		
		<div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title2') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
							<li class="mob-txt-gray_m"><?= X('fee_4') ?><br><span class="mob-txt-blue"><?= X('free') ?></span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what2') ?></div>
				</div>
			</div>
        
        </div>

		<div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title3') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,95 %</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">1,65 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what3') ?></div>
				</div>
			</div>
        
        </div>


        <div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title4') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,50 %</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">0,95 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what4') ?></div>
				</div>
			</div> 
		</div>

	</div>

	<div id="luxembourgfees" class="margins" style="padding:0.8em;" onclick="togglecssinstruction('luxembourgfees');">
        <a><h2 class="mob-txt-blue bold"><span class="flag luxembourg"></span><?= X('country_lu') ?><span style="padding-left:15px; display:inline-block; vertical-align: middle;"><i class="fa fa-chevron-right mob-txt-lime"></i></span></h2></a>  <!--   T R A N S A C T I O N    F E E S    L U X E M B O U R G      -->
    </div>

    <div id="luxembourgfees-toggle" class="margins justify-content-center" style="padding-bottom:0rem; display:none;">

		<div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title1') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
							<li class="mob-txt-gray_m"><?= X('fee_1') ?><br><span class="mob-txt-blue">0,20 €</span></li>
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,15 € + 0,40 %</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">0,15 € + 1,65 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what1') ?></div>
				</div>
			</div> 
		</div>
		
		<div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title2') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
							<li class="mob-txt-gray_m"><?= X('fee_4') ?><br><span class="mob-txt-blue"><?= X('free') ?></span></li>
							<li class="mob-txt-gray_m"><?= X('fee_1') ?><br><span class="mob-txt-blue">0,06 €</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what2') ?></div>
				</div>
			</div>
        
        </div>

		<div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title3') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,75 %</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">1,65 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what3') ?></div>
				</div>
			</div>
        
        </div>


        <div class="plan-box col-sm-12" style="margin-bottom:20px;">
		
			<div class="col-12">
				<div class="plan-box1">
				
					<div class="plan-header highlighted centered">
						<h2 class="mob-txt-gray_m"><?= X('fee_title4') ?></h2>
						<p class="mob-txt-blue"><?= X('fee_subtitle1') ?></p>
					</div>
					<div class="plan-features">
						<ul class="centered">
                            <li class="mob-txt-gray_m"><?= X('fee_2') ?><br><span class="mob-txt-blue">0,40 %</span></li>
							<li class="mob-txt-gray_m"><?= X('fee_3') ?><br><span class="mob-txt-blue">0,95 %</span></li>
						</ul>
					</div>
					<div class="plan-footer mob-txt-gray_m"><?= X('fee_what4') ?></div>
				</div>
			</div> 
		</div>

	</div>

	<div style="margin:50px auto; width:300px;">
		<div style="margin-bottom:0px;"><a href="./trynow.php"  class="cta cta_1"><?= X('button_CTA1','features') ?></a></div>
		<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd2','main') ?></dd>
	</div>

<script>

	function togglecssinstruction(countryid) {
		if($('#'+countryid+'-toggle').css('display') === 'none')
		{
			$('#'+countryid+' i').css({'transform':'rotate(90deg)','transition':'transform 400ms ease-in-out' });
			$('#'+countryid+'-toggle').fadeToggle(300);
		}
		else 
		{
			$('#'+countryid+' i').css({'transform':'rotate(0deg)','transition':'transform 400ms ease-in-out' });
			$('#'+countryid+'-toggle').fadeToggle(300);
		}
	}

</script>
	
</section>  <!--section weprotect -->


	<!--    T E C H N O L O G I E S     -->



 
<section id="technologies" class="technologies air">

<div class="margins">
	<h1 class="centered squeezed mob-txt-gray_l air unfold from-bottom invp"><?= X('sec_tech_sumup_title','pay') ?></h1>
</div>
<div class="wide">
	<div class="row">
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#online-payement">
			<div class="unfold v-flip invp single-service zoom first">
				<img class="first" src="../assets/imgs/pay/ecommerce.jpg" alt="">
				<i class="fa fa-1d5x fa-shopping-cart mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec3_title','pay') ?></h3>
			</div>
			</a>
		</div>
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#qr-code">
			<div class="unfold v-flip invp single-service zoom second">
				<img class="second"  src="../assets/imgs/pay/freeqrcode.jpg" alt="">
				<i class="fa fa-1d5x fa-qrcode mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec1_title','pay') ?></h3>
			</div>
			</a>	
		</div>
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#softpos">
			<div class="unfold v-flip invp single-service third zoom">
				<img class="third"  src="../assets/imgs/pay/<?= $l ?>/softpos.jpg" alt="">
				<i class="fa fa-1d5x fa-mobile-alt mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec2_title','pay') ?></h3>
			</div>
			</a>
		</div>
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#terminal">
			<div class="unfold v-flip invp single-service fourth zoom">
				<img class="fourth"  src="../assets/imgs/pay/terminal.jpg" alt="">
				<i class="fa fa-1d5x fa-calculator mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec7_title','pay') ?></h3>
			</div>
			</a>
		</div>
	</div>
</div>

</section> <!-- section technologies -->



	<!--    C O N T A C T     F O R M        -->

<section id="contactbanner" class="contact-wave airup">
	<div id="before_contact_form" class="animate wbottom thereyougo"></div>
	
	<div class="margins contact-title"><div class="row">
		<div class="col-12 col-sm-2"><h2 class="h1track mob-txt-gray_xl"></h2></div>
		<div class="col-12 col-sm-8"><h1 class="mob-txt-gray_l mobul unfold from-right invp"><?= X('header_take_contact','main') ?></h1></div>
		<div class="d-none d-sm-inline col-sm-2"></div>
	</div></div>
	
	<script type="text/javascript">
			let before_contact_form = document.querySelector("#before_contact_form");
		var ahm = new C_waved( before_contact_form, { animate:true, frequence:1, phase:0, speed:20, amplitude:15 });
		
	</script>
</section>



<?php include('contactform.php')?>
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









	<!--    F O O T E R      -->





<div class="gas"></div>
<?php include('footer.php')?>
<?php include('cookies.php')?>

</body>
</html>