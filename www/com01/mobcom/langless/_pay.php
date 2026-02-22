<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/pay.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/pay.css">
</head>

<body> <!-- class="slightwhite" */ -->



	<?php include('menu.php')?>



			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
			<h1>
				<a href="./index.php">
				<div class="centered logo unfold from-left s6">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span><div class="mob-bg-gray_l white containerpay unfold from-right s7" style="vertical-align:middle;"><span>Pay</span></div></span>
				</div>
				</a>
				<a href="./pay.php#advantages">			
				<div class="headers">
					<div class="bold main-header left mob-txt-gray_l unfold from-up s0" style="font-size:100%; padding-bottom:0.3em;"><?= X('top_header_l1') ?></div>
					<div class="plus-header first left mob-txt-gray_l unfold from-up s1 lowercase-letters" style="font-size:95%;"><?= X('top_header_l1','main') ?></div>
					<div class="plus-header second left mob-txt-gray_m unfold from-up s2 lowercase-letters" style="font-size:95%;"><?= X('top_header_l3','main') ?></div>
					<div class="plus-header third left mob-txt-gray_d unfold from-up s3 lowercase-letters" style="font-size:95%;"><?= X('top_header_l2','main') ?></div>
				</div>
				</a>
			</h1>
		</div>
	</div>
	<div id="advantages" class="advantages">
		<div class="wide">
            <h2 class="centered white_shadowed unfold from-left s0" style="padding:20px 20px; border-radius:15px 15px; margin:40px 5px 10px 5px; background-color:rgba(63,85,108,0.2);"><?= X('top_description_l1') ?></h2>
			<div class="row">
				<div class="flexinner col-12 col-md-6 col-xl-3">  
				  <div class="promotion-box unfold from-top s0">
					<div class="promotion-box-inner">
						<div class="row relative">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-shield-check"></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white_shadowed"><?= X('top_gain_c1') ?></h2></div>
						</div>
						<p class="white_shadowed"><?= X('top_gain_t1') ?></p>
					</div>
				  </div>
				</div>
				<div class="flexinner col-12 col-md-6 col-xl-3">
				  <div class="promotion-box unfold from-top s1">
						<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-handshake"></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white_shadowed"><?= X('top_gain_c2') ?></h2></div>
						</div>
						<p class="white_shadowed"><?= X('top_gain_t2') ?></p>
                        <a class="left white lime-hover" href="pay.php#before_plan" style="display:block; padding:1em .5em 1em 0.5em;"><i class="fa fa-euro-sign mob-txt-lime"></i>&nbsp;&nbsp;<span><?= X('discover_price') ?></span></a>
					</div>
				  </div>
				</div>
				<div class="flexinner col-12 col-md-6 col-xl-3">
				  <div class="promotion-box unfold from-top s2">
					<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-thumbs-up"></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white_shadowed"><?= X('top_gain_c4') ?></h2></div>
						</div>
						<p class="white_shadowed"><?= X('top_gain_t4') ?></p>
					</div>
				  </div>
				</div>
				<div class="flexinner col-12 col-md-6 col-xl-3">
				  <div class="promotion-box unfold from-top s3">
					<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img mob-txt-lime"><i class="fal fa-3x fa-ballot-check"></i></div>
							<div class="col-8 col-xl-12"><h2 class="bold white_shadowed"><?= X('top_gain_c3') ?></h2></div>
						</div>
						<p class="white_shadowed"><?= X('top_gain_t3') ?></p>
					</div>
				  </div>
				</div>
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


<section id="technologies" class="technologies air">

<div class="margins">
	<h1 class="centered squeezed mob-txt-gray_l air unfold from-bottom invp"><?= X('sec_tech_sumup_title') ?></h1>
</div>
<div class="wide">
	<div class="row">
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#online-payement">
			<div class="unfold v-flip invp single-service zoom first">
				<img class="first" src="../assets/imgs/pay/ecommerce.jpg" alt="">
				<i class="fa fa-1d5x fa-shopping-cart mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec3_title') ?></h3>
			</div>
			</a>
		</div>
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#qr-code">
			<div class="unfold v-flip invp single-service zoom second">
				<img class="second"  src="../assets/imgs/pay/freeqrcode.jpg" alt="">
				<i class="fa fa-1d5x fa-qrcode mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec1_title') ?></h3>
			</div>
			</a>	
		</div>
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#softpos">
			<div class="unfold v-flip invp single-service third zoom">
				<img class="third"  src="../assets/imgs/pay/<?= $l ?>/softpos.jpg" alt="">
				<i class="fa fa-1d5x fa-mobile-alt mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec2_title') ?></h3>
			</div>
			</a>
		</div>
		<div class="flexinner col-xs-12 col-sm-6 col-lg-6 col-xl-3">
			<a href="pay.php#terminal">
			<div class="unfold v-flip invp single-service fourth zoom">
				<img class="fourth"  src="../assets/imgs/pay/terminal.jpg" alt="">
				<i class="fa fa-1d5x fa-calculator mob-txt-lime"></i>
				<h3 class="mob-txt-blue"><?= X('sec7_title') ?></h3>
			</div>
			</a>
		</div>
	</div>
</div>

</section> <!-- section technologies -->


<section id="online-payement" class="features online-payement airup">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec3_title') ?></h1>
	</div>

	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/pay/ecommerce.jpg" alt=""></img>
				<div class="cta_1_centered hidden_left">
					<div>
						<div><a href="./trynow.php?cta=prp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_prepay') ?></dd>
					</div>
				</div>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area ecommerce p-list-area">
				  <ul class="left-padded-from-xl">
                    <li><?= X('sec3_title-1') ?></li>
						<p><?= X('sec3_text-1') ?></p>
					<li><?= X('sec3_title-2') ?></li>
						<p><?= X('sec3_text-2') ?></p>
					<li><?= X('sec3_title-3') ?></li>
						<p><?= X('sec3_text-3') ?></p>
					<li><?= X('sec3_title-4') ?></li>
						<p><?= X('sec3_text-4') ?></p>
					<li><?= X('sec3_title-5') ?></li>
						<p><?= X('sec3_text-5') ?></p>
				  </ul>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
				<div>
					<div><a href="./trynow.php?cta=prp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
					<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_prepay') ?></dd>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section online-payement -->


<section id="qr-code" class="features qr-code airup">

	<div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec1_title') ?></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 d-xl-none">
				<img src="../assets/imgs/pay/freeqrcode.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area qrcode p-list-area">
				  <ul>
                    <li><?= X('sec1_title-1') ?></li>
						<p><?= X('sec1_text-1') ?></p>
                    <li><?= X('sec1_title-2') ?></li>
						<p><?= X('sec1_text-2') ?></p>
                    <li><?= X('sec1_title-3') ?></li>
						<p><?= X('sec1_text-3') ?></p>
					<li><?= X('sec1_title-4') ?></li>
						<p><?= X('sec1_text-4') ?></p>
					<li><?= X('sec1_title-5') ?></li>
						<p><?= X('sec1_text-5') ?></p>
				  </ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
				<img src="../assets/imgs/pay/freeqrcode.jpg" alt=""></img>
				<div class="cta_1_centered">
					<div>
						<div><a href="./trynow.php?cta=qrp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_qr') ?></dd>
					</div>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
				<div>
					<div><a href="./trynow.php?cta=qrp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
					<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_qr') ?></dd>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section QR-code -->


<section id="softpos" class="features softpos airup">

    <div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec2_title') ?></h1>
	</div>


	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/pay/<?= $l ?>/softpos.jpg" alt=""></img>
				<div class="cta_1_centered hidden_left">
					<div>
						<div><a href="./trynow.php?cta=smp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_soft') ?></dd>
					</div>
				</div>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area smartphone p-list-area">
				  <ul class="left-padded-from-xl">
                    <li><?= X('sec2_title-1') ?></li>
						<p><?= X('sec2_text-1') ?></p>
                    <li><?= X('sec2_title-2') ?></li>
						<p><?= X('sec2_text-2') ?></p>
                    <li><?= X('sec2_title-3') ?></li>
						<p><?= X('sec2_text-3') ?></p>
                    <li><?= X('sec2_title-4') ?></li>
						<p><?= X('sec2_text-4') ?></p>
					<li><?= X('sec2_title-5') ?></li>
						<p><?= X('sec2_text-5') ?></p>

				  </ul>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
				<div>
					<div><a href="./trynow.php?cta=smp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
					<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_soft') ?></dd>
				</div>			
			</div>
		</div>
	</div>
	
</section>  <!--  section softpos -->


<section id="terminal" class="features terminal airup">

    <div class="wide">
		<h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec7_title') ?></h1>
	</div>

	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 d-xl-none">
				<img src="../assets/imgs/pay/terminal.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area terminal p-list-area">
				  <ul>
                    <li><?= X('sec7_title-1') ?></li>
						<p><?= X('sec7_text-1') ?></p>
                    <li><?= X('sec7_title-2') ?></li>
						<p><?= X('sec7_text-2') ?></p>
                    <li><?= X('sec7_title-3') ?></li>
						<p><?= X('sec7_text-3') ?></p>
					<li><?= X('sec7_title-4') ?></li>
						<p><?= X('sec7_text-4') ?></p>
					<li><?= X('sec7_title-5') ?></li>
						<p><?= X('sec7_text-5') ?></p>
				  </ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
				<img src="../assets/imgs/pay/terminal.jpg" alt=""></img>
				<div class="cta_1_centered">
					<div>
						<div><a href="./trynow.php?cta=terp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
						<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_hard') ?></dd>
					</div>
				</div>
			</div>
			<div class="cta_1_centered col-12 d-xl-none">
				<div>
					<div><a href="./trynow.php?cta=terp"  class="cta cta_1 shadowed"><?= X('button_CTA1','features') ?></a></div>
					<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd_hard') ?></dd>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section terminal -->



	<!--     T I M E   L I N E   -->

<section id="history" class="history air">

<div class="margins">
    <h1 class="bigger centered mob-txt-gray_l airupplus air unfold from-bottom invp mobul"><?= X('sec4_title') ?></h1>
</div>

<div id="ls-timeline" class="ls-timeline wide airup" style="display:none;"> 	<!--    Appears only on larger screens   -->
    <div class="row">


        <div class="timeline-box col-6 right-margins">
            <div style="position:relative; z-index:1;"><i class="year year-right fa fa-credit-card-blank mob-txt-blue"></i></div>
            <h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_title-1') ?></h2>
            <p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_text-1') ?></p>
            
        </div>

                <div class="timeline-box col-6 left-margins img-container">
                </div>

        <div class="timeline-box col-6 right-margins img-container">
        </div>

                <div class="timeline-box col-6 left-margins">
                    <div style="position:relative; z-index:1;"><i class="year year-left fa fa-calendar-check mob-txt-blue"></i></div>
                    <h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_title-2') ?></h2>
                    <p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_text-2') ?></p>
                </div>

        <div class="timeline-box col-6 right-margins">
            <div style="position:relative; z-index:1;"><i class="year year-right fa fa-piggy-bank mob-txt-blue"></i></div>
            <h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_title-3') ?></h2>
            <p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_text-3') ?></p>
        </div>

                <div class="timeline-box col-6 left-margins img-container">
                </div>

        <div class="timeline-box col-6 right-margins img-container" style="border:none;">
        </div>

                <div class="timeline-box col-6 left-margins" style="border:none;"> <!--   In order to remove the line under the icon   -->
                    <div style="position:relative; z-index:1;"><i class="year year-left fa fa-ballot-check mob-txt-blue cap-bottom"></i></div>
                    <h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_title-4') ?></h2>
                    <p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_text-4') ?></p>
                </div>

            
    </div>
</div>



<div id="ms-timeline" class="ms-timeline margins" style="padding-left:40px;">  <!--    Appears only on smaller screens   -->

    <div class="left-margins air">
        <div style="position:relative; z-index:1;"><i class="year year-left fa fa-credit-card-blank mob-txt-blue"></i></div>
        <h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_title-1') ?></h2>
        <p class="mob-txt-gray_d airplus"><?= X('sec4_text-1') ?></p>
    </div>

    <div class="left-margins air">
        <div style="position:relative; z-index:1;"><i class="year year-left fa fa-calendar-check mob-txt-blue"></i></div>
        <h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_title-2') ?></h2>
        <p class="mob-txt-gray_d airplus"><?= X('sec4_text-2') ?></p>
    </div>

    <div class="left-margins air">
        <div style="position:relative; z-index:1;"><i class="year year-left fa fa-piggy-bank mob-txt-blue"></i></div>
        <h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_title-3') ?></h2>
        <p class="mob-txt-gray_d airplus"><?= X('sec4_text-3') ?></p>
    </div>

    <div class="left-margins air" style="border:none;"> <!--   In order to remove the line under the icon   -->
        <div style="position:relative; z-index:1;"><i class="year year-left fa fa-ballot-check mob-txt-blue"></i></div>
        <h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_title-4') ?></h2>
        <p class="mob-txt-gray_d airplus"><?= X('sec4_text-4') ?></p>
    </div>

</div>



</section>


	<!--    P R I C I N G      -->




<div id="before_plan" class="animate wtop bluewhite_2" style="height:50px;">
<script type="text/javascript">
        let before_plan = document.querySelector("#before_plan");
    var bhm = new C_waved( before_plan, { animate:true, frequence:2, phase:0, speed:10, amplitude:90 });
</script>
</div>	


<section id="plan" class="plan bluewhite_2 noverflow">
                    

	<div class="wide" style="z-index:1;">
		<h1 class="bigger centered mob-txt-gray_l air"><?= X('sec5_title') ?></h1>
	</div>
	
	<div id="pclouds" class="clouds"></div>
	
	<!-- <div class="margins">
        <h3 class="bigger centered mob-txt-blue air" style="position:relative; z-index:1"><?= X('sec5_description_l1') ?></h3>
	</div> -->


    <div class="wide" style="padding-bottom:0.8em;">
        <h2 class="mob-txt-blue bold"><?= X('sec5_title-2') ?></h2> <!--  S U B S C R I P T I O N      P L A N S    -->
        <p class="mob-txt-gray_d"><?= X('sec5_text-2') ?></p>
    </div>

    <div class="wide air">
		
		<div class="row justify-content-center" style="padding-bottom:2em;">
			
			<div class="col-md-10 col-lg-8 col-xl-4">
				<div class="plan-box">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_1','main') ?><span class="ext_title_plan">&Pay</h2>
						<p class="mob-txt-gray_l left head_sub"><?= X('sec6_rate_2_text','main') ?></p>
						<h2 id="price_1" class="mob-txt-blue centered bold price" style="display:block;"><?= X('Price_1') ?><span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
						<h2 id="price_1_pay" class="mob-txt-blue centered bold price" style="display:none;">59 €<span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_0','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_3') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_7') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_10bis','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_11','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_12','main') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php?cta=tp1p" class="cta cta_1"><?= X('button_CTA1','main') ?></a></div>
							<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd2','main') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
			
			<div class="col-md-10 col-lg-6 col-xl-4">
				<div class="plan-box highlighted">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_2','main') ?><span class="ext_title_plan">&Pay</h2>
						<p class="mob-txt-gray_l head_sub"><?= X('sec6_rate_4_text','main') ?></p>
						<h2 id="price_2" class="mob-txt-blue centered bold price" style="display:block;"><?= X('Price_2') ?><span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
						<h2 id="price_2_pay" class="mob-txt-blue centered bold price" style="display:none;">79 €<span class="subscript">&nbsp;<?= X('period_price','main') ?></span></h2>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_1') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_0_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_5_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_3') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_7') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_10','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_11','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_12_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_1_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_2_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_4_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_1','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_1_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_7_1','main') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php?cta=tp2p" class="cta cta_1"><?= X('button_CTA1','main') ?></a></div>
							<dd class="centered airup white"><?= X('button_CTA1_dd2','main') ?></dd>
						</div>
					</div>
					
				</div>
			</div>
			
			<div class="col-md-10 col-lg-6 col-xl-4">
				<div class="plan-box">
				
					<div class="plan-header">
						<h2 class="mob-txt-gray_m bigger"><?= X('title_plan_3','main') ?></h2>
						<p class="mob-txt-gray_l left head_sub"><?= X('sec6_rate_5_text','main') ?></p>
						<h2 class="mob-txt-blue centered bold price"><?= X('Price_3','main') ?></h3>
					</div>
					<div class="plan-features">
						<ul class="left" style="padding-left:15px;">
							<li class="mob-txt-gray_m"><?= X('plan_9_2','main') ?>&Pay</li>
							<li class="mob-txt-gray_m"><?= X('plan_2_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_3_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_4_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_5_2','main') ?></li>
							<li class="mob-txt-gray_m"><?= X('plan_6_2','main') ?></li>
						</ul>
					</div>
					<div class="plan-footer">
						<div>
							<div><a href="./trynow.php?cta=tp3p" class="cta cta_1"><?= X('button_CTA1','main') ?></a></div>
							<dd class="centered airup mob-txt-gray_m"><?= X('button_CTA1_dd2','main') ?></dd>
						</div>
					</div>
					
				</div>
			</div>  
		</div>

		<div>
			<h2 class="mob-txt-blue bold"><?= X('sec5_title-3') ?></h2>
			<p class="mob-txt-gray_d"><?= X('sec5_text-3') ?></p>
		</div>

			
		<div class="airupplus">
			<h2 class="mob-txt-blue bold"><?= X('sec5_title-1') ?></h2>
			<p class="mob-txt-gray_d"><?= X('sec5_text-1') ?></p>
			<a class="left mob-txt-gray_d lime-hover" href="./transactionfees.php" style="display:block;" target=”_blank”><span><?= X('link_fees') ?></span></a>
		</div>

		<div class="airupplus">
			<h2 class="mob-txt-blue bold"><?= X('sec5_title-4') ?></h2>
			<p class="mob-txt-gray_d"><?= X('sec5_text-4') ?></p>
		</div>

	</div>





	

	<script type="text/javascript">

		var pclouds = document.querySelector("#pclouds"); // let the clouds flow
		(function wind2() {
			let d = aframe/10+100;
			if(aframe_do) pclouds.style.backgroundPosition ="left "+d+"px top 0px"; // (*cp01*)
			requestAnimationFrame(wind2);
		})();

		let findme = function() {
		this.location = 0;
		let post = new A_ps({ }, { }, '../assets/php/findme.php', { onreply:new A_cb(this,this.found) }, {/*options*/});
		};
		findme.prototype = { /* Uses findme.php to find the origin of navigation PA01*/
			found: function(stream) {
				// console.log('stream '+ stream);
				let split = stream.split('&$');
				let country = split[1];
				this.location = country;
				// console.log('Country:'+country);
				if(this.location=='Luxembourg') {
					document.getElementById('price_1').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_2').innerHTML = '99€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_1_pay').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_2_pay').innerHTML = '99€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
				} 
				else if (this.location === 'United States') {
					document.getElementById('price_1').innerHTML = '$59<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_2').innerHTML = '$79<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_1_pay').innerHTML = '$59<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_2_pay').innerHTML = '$79<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
				}else {
					document.getElementById('price_1').innerHTML = '59€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_2').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_1_pay').innerHTML = '59€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
					document.getElementById('price_2_pay').innerHTML = '79€<span class="subscript">&nbsp;<?= X('period_price','main') ?></span>';
				}
			}
		};
		$(document).ready( function() { new findme(); } );
	</script>
	
</section>  <!--section weprotect -->

<div id="after_plan" class="animate wbottom bluewhite_2" style="height:50px;"></div>
<script type="text/javascript">
		let after_plan = document.querySelector("#after_plan");
	var bhm = new C_waved( after_plan, { animate:true, frequence:2, phase:0, speed:10, amplitude:90 });
	
</script>


<!--     Y O U   -->



<section id="support" class="support airupplus">


	<div class="margins">
		<div class="row">
            <div class="flexinner col-sm-12 col-xl-6">
		        <h1 class="bigger centered squeezed mob-txt-gray_l air unfold from-bottom invp mobul"><?= X('sec6_title') ?></h1>
            </div> 
            <div class="flexinner col-sm-12 col-xl-6 list-area checked p-list-area airplus">
                <ul class="left-padded-from-xl">
                    <li><?= X('sec6_title-1') ?></li>
                        <p><?= X('sec6_text-1') ?></p>            
                    <li><?= X('sec6_title-2') ?></li>
						<p><?= X('sec6_text-2') ?></p>
                </ul>        
            </div>
            <div class="flexinner col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <a href="https://www.mastercard.be" target="blank" rel="noopener nofollow">
                    <div class="partner-area">
                        <img src="../assets/imgs/pay/logo-mastercard.png" alt="Logo Mastercard">
                    </div>
                </a>
            </div>
            <div class="flexinner col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <a href="https://mobminder.com/<?= $l ?>/pay.php" target="blank" rel="noopener nofollow">
                    <div class="partner-area">
                        <img src="../assets/imgs/pay/logo-mobminderpay.png" alt="Logo Mobminder Pay">
                    </div>
                </a>
            </div>
            <div class="flexinner col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                <a href="https://www.payconiq.be" target="blank" rel="noopener nofollow">
                    <div class="partner-area">
                        <img src="../assets/imgs/pay/logo-payconiq.png" alt="Logo Payconiq">
                    </div>
                </a>
            </div>
        </div>
	</div>

</section>



	<!--    C O N T A C T     F O R M        -->

<section id="contactbanner" class="contact-wave">
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