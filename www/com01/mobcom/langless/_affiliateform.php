<!doctype html>
<html translate="no">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/affiliateform.css">
	<script src="../assets/js/sponsor-contact.js"></script>  <!--    New js with fonction that treat MSG as an optional field    -->
</head>

<body>  

            <!--    L A N G    C H A N G E S     -->

<header id="stickymenu">

<?php

$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$icount = count($subfolders);
$filename = $subfolders[$icount-1];
?>

    <div>
        <input type="checkbox" id="lang-toggle" class="checkbox_toggle"> 
        <nav class="list l-right bg-grey-gradient">
            <ul>
                <li><a class="mob-txt-gray_d" href="../fr/<?= $filename ?>">Français</a></li>
                <li><a class="mob-txt-gray_d" href="../en/<?= $filename ?>">English</a></li>
                <li><a class="mob-txt-gray_d" href="../nl/<?= $filename ?>">Nederlands</a></li>

            </ul>
        </nav>
        <label for="lang-toggle" class="toggle-label lang-toggle-label airup">
            <span class="mob-txt-lime"><?=$l?></span>
            <i class="fa fa-globe fa-1d5x mob-txt-lime"></i>
        </label>
    </div>

</header> <!-- section top-menu -->

			<!--    S P O N S O R S H I P    W E L C O M E   A N D     A D V A N T A G E S   -->
			
<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
        <h1 class="bold mobminder"><img class="mobminderlogo" src="../assets/imgs/icon-1.png" alt="mobminder logo"/>&nbsp;<span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></h1>
        <div class="margins">
            <div class="row">
                <div class="flexinner col-9 promo">
                    <div class="row">
                        <div class="flexinner col-12">
                            <div class="client">
                                <h2 class="mob-txt-gray_m bold centered unfold from-left s1" style="text-transform: uppercase;">Pour vous</h2>
                                <p class="mob-txt-lime centered bold unfold from-right s2">Un cadeau au choix parmi la liste ci-dessous<p>
                            </div>
                        </div>
                        <div class="flexinner col-12" style="padding-top:40px;"> 
                            <div class="sponsored">
                                <h2 class="mob-txt-gray_m bold centered unfold from-left s3" style="text-transform: uppercase;">Pour votre parrainé(e)</h2>
                                <p class="mob-txt-lime centered bold unfold from-bottom s4">2 mois d'abonnement Mobminder</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flexinner col-3">
                    <img class="account-manager" src="../assets/imgs/account/<?= $accountmanager ?>.png" alt="account-manager-pic"/>
                </div>
            </div>
        </div>
	</div>

    
    <div class="advantages">
		<div class="margins">
            <h1 class="centered unfold from-right s5 white" style="font-size:1.3em; text-transform: uppercase; padding:60px 0 20px 0;"><?= X('sponsorship_title') ?></h1>
		</div>

        <div class="margins">
			<div class="row">
				<div class="flexinner col-12 col-xl-4">  
				  <div class="promotion-box unfold from-left s6">
					<div class="promotion-box-inner">
						<div class="row relative">
							<div class="col-4 col-xl-12 promotion-box-img"><img src="../assets/imgs/mobicons/form.png" alt=""></div>
							<div class="col-8 col-xl-12"><p class="mob-txt-gray_m"><?= X('sponsorship_text1') ?></p></div>
						</div>
					</div>
				  </div>
				</div>
				<div class="flexinner col-12 col-xl-4">
				  <div class="promotion-box unfold from-top s7">
						<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img"><img src="../assets/imgs/mobicons/contact.png" alt=""></div>
							<div class="col-8 col-xl-12"><p class="mob-txt-gray_m"><?= X('sponsorship_text2') ?></p></div>
						</div>
					</div>
				  </div>
				</div>
				<div class="flexinner col-12 col-xl-4">
				  <div class="promotion-box unfold from-right s8">
					<div class="promotion-box-inner">
						<div class="row">
							<div class="col-4 col-xl-12 promotion-box-img"><img src="../assets/imgs/mobicons/gift.png" alt=""></div>
							<div class="col-8 col-xl-12"><p class="mob-txt-gray_m"><?= X('sponsorship_text3') ?></p></div>
						</div>
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
		if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px bottom -65%"; // (*cp01*)
		requestAnimationFrame(wind);
	})();

	</script>

</section> <!-- section welcome and advantages-->



	<!--    G I F T    C H O I C E    -->


<section id="singdel_form" class="single-delegation air">

	<div class="margins"><div class="airup">
		<div><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp">Votre cadeau</h1></div>
	</div></div>
	<div class="margins">
		<div class="row">
			<div class="flexinner col-12">
				<div class="singdel-question">
					<h2 class="confirm centered mob-txt-gray_m" style="display:block;"><?= $clienttitle ?>, choisissez votre cadeau en sélectionnant l'image appropriée</h2>
					<h2 class="confirm centered mob-txt-gray_m" id="singdel_tip_assistant" style="display:none;"><?= X('wz_singdel_tip_assistant', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="singdel_tip_callcenter" style="display:none;"><?= X('wz_singdel_tip_callcenter', 'wizard') ?></h2>
					<h2 class="confirm centered mob-txt-gray_m" id="singdel_tip_nope" style="display:none;"><?= X('wz_singdel_tip_nope', 'wizard') ?></h2>
				</div>
			</div>
			<div id="singdel_assistant" value="assistant" class="singdel touch-on flexinner left col-4 col-sm-4">
				<div class="singdel-type left bgwhite">
					<img src="../assets/imgs/gift/1.jpg" alt="">
					<h3 class="mob-txt-blue">Relax</h3>
				</div>
			</div>
			<div id="singdel_callcenter" value="callcenter" class="singdel touch-on flexinner center col-4 col-sm-4">
				<div class="singdel-type center bgwhite">
					<img src="../assets/imgs/gift/2.jpg" alt="">
					<h3 class="mob-txt-blue">Gastronomie</h3>
				</div>
			</div>
			<div id="singdel_nope" value="nope" class="singdel touch-on flexinner right col-4 col-sm-4">
				<div class="singdel-type right bgwhite">
					<img src="../assets/imgs/gift/3.jpg" alt="">
					<h3 class="mob-txt-blue">Vins</h3>
				</div>
			</div>
		</div>
		
		
		<h3 class="" id="singdel_form_status" style="display:none;">singdel_form_status</h3>
	</div>

</section>




	<!--    S P O N S O R S H I P    F O R M    -->


<section id="contactform" class="contact-form airup">

	<div><h1 class="bigger centered squeezed mob-txt-gray_l air mobul unfold from-top invp">Coordonnées de votre parrainé</h1></div>

	<div id="contact" class="margins">
		<div class="row">
			<div class="flexinner col-12 col-lg-4 align-items-top">
                <div class="contact-intro">
				    <h2 class="centered mob-txt-gray_m"><?= $clienttitle ?><br><?=X('contact_intro')?></h2>
				</div>
			</div>
			<div class="col-12 col-md-1 d-lg-none">
			</div>
			<div class="col-12 col-md-10 col-lg-8 contact-form"> <!-- .ixl let placeholders appear for translation purpose  -->
					<h3 class="ixl" id="contact-form-name" style="display:none;"><?=X('placeholder_name')?></h3>
					<h3 class="ixl" id="contact-form-company" style="display:none;"><?=X('placeholder_company')?></h3>
					<h3 class="ixl" id="contact-form-special" style="display:none;"><?=X('placeholder_special')?></h3>
					<h3 class="ixl" id="contact-form-mobile" style="display:none;"><?=X('placeholder_mobile')?></h3>
					<h3 class="ixl" id="contact-form-email" style="display:none;"><?=X('placeholder_email')?></h3>
					<h3 class="ixl" id="contact-form-msg" style="display:none;"><?=X('placeholder_msg')?></h3>
					<h3 class="ixl" id="contact-form-misc" style="display:none;">miscellaneous</h3>
					<h3 class="ixl confirm mob-txt-gray_l" id="tip_mandatory" style="display:block;"><?=X('contact_mandatory')?></h3>
			</div>
			<div class="col-12 col-md-1 d-lg-none">
			</div>
			
			<div class="air">&nbsp;</div>
			<?php include('../langless/captchaform.php'); ?>					
				
			<div class="col-10 col-md-8 col-lg-6 mx-auto"> <!-- (*cfs*) only for ixl -->
				<h3 class="ixl" id="contact-form-busy" style="display:none; text-align:left;"><?=X('caption_busy')?></h3>
				<h3 class="ixl" id="contact-form-sent" style="display:none; text-align:left;"><?=X('caption_sent')?></h3>
				<h3 class="ixl" id="contact-form-submit" style="display:none; text-align:left;"><?=X('caption_submit')?></h3>
			</div>
				
		</div>
	</div>


</section> <!-- section sponsorship form-->


<!--    T H A N K S     P O P U P     S C R E E N     -->



<div id="thanks_screen" class="popup-screen" style="display:none;">
	<div id="message-box" class="message-box wide">
        <div class="row">
            <div class="flexinner col-sm-12 col-md-9 col-lg-9 col-xl-9">
                <div class="message">
                    <h2 class="mob-txt-gray_m air">Merci <?= $clienttitle ?></h2>
                    <p class="mob-txt-gray_d air">
					Je me charge de contacter la personne renseignée: <span id="himher"></span>.
					Si votre parrainé choisi de profiter des services Mobminder et après 6 mois d’utilisation, 
					je reprendrais contact avec vous pour vous offrir votre cadeau!
					</p>
                    <p class="mob-txt-gray_d right">Votre account manager, <?= $accountmanager ?>.</p>
                    <div class="airup">
						<a id="close_window_btn"  href="javascript:close();" class="cta_2 whitebg lock"><i class="mob-txt-lime fa fa-calendar fa-1d5x icon_unlock"></i><i class="mob-txt-lime fa fa-calendar-check fa-1d5x icon_lock"></i>&nbsp;&nbsp;&nbsp;Retour à mon agenda</a>
                    </div>
                </div>
            </div>

            <div class="flexinner d-none d-md-block col-md-3 col-lg-3 col-xl-3"> 
                <div>
                    <img src="../assets/imgs/account/<?= $accountmanager ?>.png" alt="account-manager-pic">
                </div>
            </div>
        </div>
    </div>
</div>





<script type="text/javascript">
	var c = new C_iContact_sponsor('contact', {
		  target: $('#contact'),
		  caid: <?= $cqr ?>,
		  lang: '<?= $l ?>',
		  ixl: '<?= $ixl ?>',
		  am: '<?= $accountmanager ?>',
		  cl: '<?= $clienttitle ?>',
		  lid: '<?= $loginid ?>'
	});
	c.display();
	c.activate();
</script>



<div class="gas"></div>


<?php include('footer.php')?>


</body>

</html>