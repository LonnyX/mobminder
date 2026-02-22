<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title>Moby, l'assistant personnel intelligent des professionnels qui travaillent sur RDV</title>
	<meta name="description" content="Optimisez votre activité grâce à l'IA pour les professionnels travaillant sur rendez-vous. Découvrez notre vidéo de présentation ici.">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/ai.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/ai.css">
</head>

<body> <!-- class="slightwhite" */ -->


			<!--    W E L C O M E    +    P R O M O T I O N   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
			<h1>
				<a href="./index.php" target="_blank">
				<div class="centered logo unfold from-left s4 zoom">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span>
				</div>
				</a>	
				<div class="headers"style="font-size:100%; padding-bottom:0.3em;">
                    <div class="bold left mob-txt-gray_m unfold from-top s0">Je suis MOBY</div>
                    <div class="bold left mob-txt-gray_d unfold from-top s1"><var></var>Votre nouvel assistant vocal</div>
				</div>
			</h1>
		</div>
	</div>
	<div id="advantages" class="advantages">
		<!-- <div class="wide">
            <h2 class="centered white_shadowed unfold from-left s0" style="padding:20px 20px; border-radius:15px 15px; margin:40px 5px 10px 5px; background-color:rgba(63,85,108,0.5);">Consultez la vidéo ci-dessous pour découvrir MOBI, votre nouvel assistant intelligent</h2>
		</div> -->
        <div class="wide videomoby-wrap">
			<div class="row" style="gap: 20px;">
				<div class="flexinner col-12 col-6">
		 			<video id="video_touch" class="video-js vjs-fluid" style="border-radius:30px; opacity:1;" poster="../assets/imgs/poster/moby-video-trailer.jpg"><source src='../assets/vids/ai/moby_trailer.mp4' type="video/mp4" /></video>
				</div>
				<div class="flexinner col-12 col-6">
		 			<video id="video_touch_2" class="video-js vjs-fluid" style="border-radius:30px; opacity:1;" poster="../assets/imgs/poster/moby-video-complete.jpg"><source src='../assets/vids/ai/moby_long.mp4' type="video/mp4" /></video>
				</div>
			</div>
		</div>
		<!-- <div class="wide centered">
			<a href="http://91.134.44.204:5050/video/Masters_Full_02_LQ.mp4" target="_blank">
				<img src="../assets/imgs/poster/moby-video.jpg" alt="Voir la démo" style="border-radius:30px; opacity:1; width:600px; max-width:100%;">
			</a>	    
		</div> -->
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

<script type="text/javascript">
		$(document).ready(function() {
		var options = {
			controls: true,
			preload: 'none',
			fluid: true
		}
		var touch_vid_ready = function() { console.log('player ready: ', this.id_ ) };
		var p = videojs('video_touch', options, touch_vid_ready);
		var p2 = videojs('video_touch_2', options, touch_vid_ready);
		
	});

</script>

</section>  <!-- section welcome -->



<section id="ai-chapters" class="ai-chapters air"> 
    <div class="margins">
        <ul class="accordeon">
            <?php 
            $chapters = [
                1 => "Gérer mon agenda",
                2 => "Traduire et interpréter",
                3 => "Communiquer et naviguer",
                4 => "Analyse d'image",
                5 => "Culture générale"
            ];
            
            foreach ($chapters as $num => $title) { 
                $isFirst = ($num === 1) ? 'checked' : ''; // Ouvrir le premier chapitre
            ?>
                <li class="mob-txt-gray_m has-sub">
                    <input id="menu-<?=$num?>" type="checkbox" name="menu" <?=$isFirst?>/>
                    <div>
                        <label for="menu-<?=$num?>">
                            <h2><i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<?=$num?>. <?=$title?></h2>
                        </label>
                        <div class="vwrap" <?= $isFirst ? 'style="display:block;"' : '' ?>>
							<video 	id="video_touch_chapter_<?=$num?>" class="video-js vjs-fluid" style="border-radius:30px; opacity:1;" poster="../assets/imgs/poster/ia-chapitre<?=$num?>.jpg"><source src='../assets/vids/ai/moby_chapter_<?=$num?>.mp4' type="video/mp4" /></video>
                        </div>
                    </div>
                </li>
            <?php } ?>
        </ul>
    </div>

<style>
    .vwrap {
		display: none;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
		margin-top: 10px;
		margin-bottom: 20px;
    }
</style>


<script type="text/javascript">

var vids = {}; // Stocke les instances VideoJS

$(document).ready(function() {
    var firstItem = $("section.ai-chapters .has-sub").first();
    var firstIcon = firstItem.find("i");
    var firstVideoWrap = firstItem.find(".vwrap");
    var firstVideoId = firstVideoWrap.find("video").attr("id");

    // Initialiser VideoJS pour la première vidéo (sans autoplay)
    // if (firstVideoId) {
    //     vids[firstVideoId] = videojs(firstVideoId, {controls: true, autoplay: false, loop: false, preload: 'auto', fluid: true });
    // }

	$("section.ai-chapters .has-sub").each(function() {
                let otherVideoWrap = $(this).find(".vwrap");
                let VideoId = otherVideoWrap.find("video").attr("id");
				vids[VideoId+'_html5_api'] = videojs(VideoId, {controls: true, autoplay: false, loop: false, preload: 'auto', fluid: true });
            });

    // Appliquer l'état ouvert au premier élément
    firstIcon.css("transform", "rotate(90deg)");
    firstVideoWrap.show().css("opacity", "1");
    $("section.ai-chapters label").click(function() {
        var listItem = $(this).closest("li");
        var videoWrap = listItem.find(".vwrap");
        var videoId = videoWrap.find("video").attr("id");
        var icon = listItem.find("i");

        // Si la section est déjà ouverte, on la ferme
        if (videoWrap.is(":visible")) {
            videoWrap.animate({ opacity: 0 }, 300, function() {
                videoWrap.slideUp();
            });
            icon.css("transform", "rotate(0deg)"); // Retour à droite
            if (videoId && vids[videoId]) {
                vids[videoId].pause();
            }
        } else {
            // Fermer toutes les autres sections
            $("section.ai-chapters .has-sub").not(listItem).each(function() {
                var otherVideoWrap = $(this).find(".vwrap");
                var otherVideoId = otherVideoWrap.find("video").attr("id");
                otherVideoWrap.animate({ opacity: 0 }, 300, function() {
                    otherVideoWrap.slideUp();
                });

                $(this).find("i").css("transform", "rotate(0deg)"); // Remet les autres à droite
                if (otherVideoId && vids[otherVideoId]) {
                    vids[otherVideoId].pause(); 
                }
            });

            // Ouvrir la nouvelle section avec animation d'opacité et ajuster l'icône
            videoWrap.slideDown().animate({ opacity: 1 }, 100);
            icon.css("transform", "rotate(90deg)"); // Rotation de 90° vers le bas

        }
    });
});

</script>


</section> <!-- section ai-chapters -->







	<!--    W H A T   C A N    I   D O      -->


    <section id="ai-now" class="features ai-now airup">

	<div class="wide">
        <h1 class="centered squeezed mob-txt-gray_l airplus unfold from-bottom invp mobul"><span class="mob-txt-blue">Déjà prêt à organiser, informer et divertir</span></br><span>Votre agenda, enrichi par l'IA</h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 d-xl-none">
				<img src="../assets/imgs/welcomebtns/communications.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area thumb p-list-area">
				  <ul>
					<li>Toujours à votre écoute</li>
						<p>Lecture interactive du planning, et sur demande, détails au sujet des rendez-vous et des visiteurs associés.</p>
					<li>Prise de rendez-vous simplifiée</li>
						<p>Recherche de disponibilités et placement de rendez-vous avec les informations fournies à l'oral (visiteur, prestation, note).</p>
					<li>Envoi d'emails et de SMS</li>
						<p>À votre demande, l'assistant rédige et envoie emails et SMS.</p>
					<li>Traductions en temps réel</li>
						<p>Interprète, Moby traduit vos conversations en temps réel.</p>
					<li>Partout et à portée de main</li>
						<p>Au travail, à domicile ou en déplacement, Moby est toujours accessible pour faciliter votre quotidien.</p>
					<li>Recherche d'informations</li>
						<p>Avec une connaissance encyclopédique, Moby fournit des informations précises sur une grande variété de sujets.</p>
				  </ul>
				</div>
			</div>
			<div class="post-img d-none d-xl-block col-xl-4">
				<img src="../assets/imgs/welcomebtns/communications.jpg" alt=""></img>
			</div>
		</div>
	</div>

<!-- 
	<div class="margins mob-txt-gray_d airplus airupplus">
		<div class="centered" style="padding:15px 15px;"><span style="padding:10px 10px;"><i class="fa fa-1d5x fa-thumbs-up mob-txt-lime"></i></span><span style="padding:10px 10px;"><i class="fa fa-1d5x fa-thumbs-down orange"></i></span></div>
		<p class="bigger" style="text-align:center;">L'IA est sensible au rewarding; n'hésitez pas à lui mettre un pouce!</p>
		<p class="bigger" style="text-align:center; padding-top:10px; padding-bottom:10px;">Nous travaillons activement à l'amélioration continue du modèle d'intelligence articielle et à son intégration avec l'agenda mobminder. Vos commentaires sont les bienvenus.</p>
		<p class="bigger bold" style="text-align:center;">Bon amusement avec Moby!</p>
	</div> -->

</section>  <!--  section online-reservation -->


<section id="ai-soon" class="features ai-soon airup">

	<div class="wide">
		<h1 class="centered squeezed mob-txt-gray_l airplus unfold from-bottom invp mobul"><span class="mob-txt-blue">Un accueil téléphonique professionnel</span></br><span>Bientôt disponible</span></h1>
	</div>
	<div class="wide">
		<div class="row">
			<div class="pre-img col-12 col-xl-4">
				<img src="../assets/imgs/wizard/inboundresa.jpg" alt=""></img>
			</div>
			<div class="col-12 col-xl-8">
				<div class="list-area headset p-list-area">
				  <ul class="left-padded-from-xl">
					<li>Un service téléphonique IA disponible 24/7</li>
						<p>Déviez votre ligne vers votre assistante IA, qui reste disponible et efficace à toute heure. Chaque appel est pris en charge instantanément, sans attente.</p>
					<li>Interactions fluides et naturelles, respectueuses de vos directives</li>
						<p>Identification de l'appelant, prise de rendez-vous, annulation ou déplacement, rappel du prochain rendez-vous, écoute et enregistrement d'une demande.</p>
						<p>Les messages et demandes résumés apparaissent dans votre agenda sous forme de texte.</p>
					<li>Sur mesure et adapté à vos besoins</li>
						<p>L'assistant IA propose des disponibilités en respectant vos plages horaires, consignes et durées de prestations.</p>
                    <li>Notifications</li>
						<p>Vous pouvez reçevoir une notification à la clôture de chaque appel traité.</p>
				  </ul>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section ai-soon -->




<!--    V O L U M E S   /   F I G U R E S      -->



<section id="volumes" class="volumes relative airup">
	<!-- <div class="techno"></div> -->
	<div id="vwrapper" class="animate wbottom">
		<div class="worldmapshade"></div>
		<div id="worldmap" class="animate wbottom worldmap">
			<div class="margins" style="padding-top:1em;">
				<h1 class="bigger left mob-txt-gray_l unfold from-top invp"><?= X('volumes_header_l1','main') ?></h1>
				<h1 class="bigger left mob-txt-gray_m unfold from-left invp"><?= X('volumes_header_l2','main') ?></h1>
				<h1 class="bigger left mob-txt-gray_d unfold from-bottom invp"><?= X('volumes_header_l3','main') ?></h1>
			</div>
		</div>
		<div id="figures" class="figures">
			<div class="wide right">
				<span class="bold mobminder"><span class="white">mob</span><span class="mob-txt-lime">minder</span></span>
			</div>
			<div class="wide">
					<div class="row">
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-users fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_users_count','main') ?></h2>
									<p class="white centered bigger air"><?= X('figures_users','main') ?></p>
								</div>
							</div>
						</div>
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-id-card fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_visitors_count','main') ?></h2>
									<p class="white centered bigger air"><?= X('figures_visitors','main') ?></p>
								</div>
							</div>
						</div>
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-calendar-alt fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_planned_count','main') ?></h2>
									<p class="white centered bigger air"><?= X('figures_planned','main') ?></p>
								</div>
							</div>
						</div>
						<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div class="figure-box unfold from-top invp">
								<div class="figure-box-inner">
									<div class="fa-block fal fa-calendar-check fa-2x mob-txt-lime"></div>
									<h2 class="white"><?= X('figures_performed_count','main') ?></h2>
									<p class="white centered bigger air"><?= X('figures_performed','main') ?></p>
								</div>
							</div>
						</div>
					</div>
			</div>
		</div>
		<div id="vfooter" class="vfooter">
			<div class="margins">
			</div>
		</div>
	</div>
<script type="text/javascript">

		let el2 = document.querySelector("#worldmap");
	var w2 = new C_waved( el2, { animate:true, frequence:2, phase:0, speed:8, amplitude:8 });
	
		let el3 = document.querySelector("#vwrapper");
		let phase = -1/2;
	var w3 = new C_waved( el3, { animate:true, frequence:2, phase:phase, speed:8, amplitude:4 });
	
	// let the world spin
	//
	var worldspin = document.querySelector("#volumes");
	(function worldspin1() {
		let d = -aframe/10;
		if(aframe_do) worldspin.style.backgroundPosition ="left "+d+"px bottom 30px"; // (*cp02*)
		requestAnimationFrame(worldspin1); 
	})();
</script>
</section>  <!-- section volumes -->


<!--   C O M P A T I B I L I T Y   ( D O W N L O A D   N O W )    -->

<section id="compatibility" class="compatibility">
		<div class="air airupplus"></div>
		<div class="say"><h1 class="mob-txt-gray_l bigger centered unfold from-center invp mobul">Téléchargez l'application mobminder</h1></div>
		<div>
			<ul>
				<li>
					<a href='https://play.google.com/store/apps/details?id=com.mobminder.agenda' target="_blank">
					<div class="download">
						<i class="fab fa-google-play fa-3x"></i>
						<span class="df"><?= X('availability1','main') ?></span>
						<span class="dfn">Google Play</span>
					</div>
					</a>
				</li>
				<li>
					<a href='https://apps.apple.com/be/app/mobminder/id1530813844?l=fr' target="_blank">
					<div class="download">
						<i class="fab fa-apple fa-3x"></i>
						<span class="df"><?= X('availability2','main') ?></span>
						<span class="dfn">App Store</span>
					</div>
					</a>
				</li>
			</ul>
		</div>
		<div class="gas"></div>

</section> <!-- section compatibility -->
</section> <!-- section compatibility -->




	<!--    W H Y    M O B M I N D E R      -->



	<section id="whymobminder" class="whymobminder air">
	
	<div class="margins">
		<div class="row">
			<div class="col-sm-12 col-lg-3 col-xl-4">
				<h1 class="bigger left mob-txt-gray_l air unfold from-left invp mobul"><?= X('sec1_title','main') ?></h1>
			</div>
			<div class="col-sm-12 col-lg-9 col-xl-8" style="padding-top:10px;">
				<div class="list-area checked">
				  <ul class="bold mob-txt-gray_m left-padded">
					<li><?= X('sec1_line1','main') ?></li>
					<li><?= X('sec1_line2','main') ?></li>
					<li><?= X('sec1_line3','main') ?></li>
					<li><?= X('sec1_line4','main') ?></li>
					<li><?= X('sec1_line5','main') ?></li>
					<li><?= X('sec1_line6','main') ?></li>
					<li><?= X('sec1_line7','main') ?></li>
				  </ul>
				</div>
			</div>
		</div>
	</div>
	
</section>  <!--  section whymobminder -->


	<!--    F E A T U R E S       -->



<section id="features" class="features air">


	<div id="features-menu" class="features-menu airupplus margins">
		<div class="row">
			<div class="flexinner col-6 col-md-4 col-lg-4 unfold from-center invp">
				<div class="unfold v-flip s0 single-service zoom first">
					<a href="https://www.mobminder.com/fr/features.php">
						<img class="first" src="../assets/imgs/welcomebtns/web-booking.jpg" alt="">
						<i class="fa fa-hand-pointer fa-1d5x mob-txt-lime"></i>
						<h3 class="mob-txt-blue"><?= X('eresa_title','features') ?></h3>
					</a>
				</div>
			</div>
			<div class="flexinner col-6 col-md-4 col-lg-4 unfold from-center invp">
				<div class="unfold v-flip s0 single-service zoom second">
					<a href="https://www.mobminder.com/fr/features.php">
						<img class="second" src="../assets/imgs/welcomebtns/epayment.jpg" alt="">
						<i class="fa fa-credit-card fa-1d5x mob-txt-lime"></i>
						<h3 class="mob-txt-blue"><?= X('epay_title','features') ?></h3>
					</a>
				</div>
			</div>
			<div class="flexinner col-6 col-md-4 col-lg-4 unfold from-center invp">
				<div class="unfold v-flip s0 single-service zoom third">
					<a href="https://www.mobminder.com/fr/features.php">
						<img class="third" src="../assets/imgs/welcomebtns/communications.jpg" alt="">
						<i class="fa fa-alarm-clock fa-1d5x mob-txt-lime"></i>
						<h3 class="mob-txt-blue"><?= X('title_3','features') ?></h3>
					</a>
				</div>
			</div>
			<div class="flexinner col-6 col-md-4 col-lg-4 unfold from-center invp">
				<div class="unfold v-flip s1 single-service zoom fourth">
					<a href="https://www.mobminder.com/fr/features.php">
						<img class="fourth" src="../assets/imgs/welcomebtns/shared.jpg" alt="">
						<i class="fa fa-users fa-1d5x mob-txt-lime"></i>
						<h3 class="mob-txt-blue"><?= X('title_4','features') ?></h3>
					</a>
				</div>
			</div>
			<div class="flexinner col-6 col-md-4 col-lg-4 unfold from-center invp">
				<div class="unfold v-flip s1 single-service zoom fifth">
					<a href="https://www.mobminder.com/fr/features.php">
						<img class="fifth" src="../assets/imgs/welcomebtns/simple.jpg" alt="">
						<i class="fa fa-thumbs-up fa-1d5x mob-txt-lime"></i>
						<h3 class="mob-txt-blue"><?= X('ergo_title','features') ?></h3>
					</a>
				</div>
			</div>
			<div class="flexinner col-6 col-md-4 col-lg-4 unfold from-center invp">
				<div class="unfold v-flip s1 single-service zoom last">
					<a href="https://www.mobminder.com/fr/features.php">
						<img class="last" src="../assets/imgs/welcomebtns/security.jpg" alt="">
						<i class="fa fa-shield-check fa-1d5x mob-txt-lime"></i>
						<h3 class="mob-txt-blue"><?= X('title_6','features') ?></h3>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>  <!--  section features -->



			



	<!--    C O N T A C T     F O R M        -->

<section id="contactbanner" class="contact-wave">
	<div id="before_contact_form" class="animate wbottom thereyougo"></div>
	
	<div class="margins contact-title"><div class="row">
		<div class="col-12"><h2 class="h1track mob-txt-gray_xl"></h2></div>
		<div class="col-12 col-sm-10"><h1 class="mob-txt-gray_l bigger mobul unfold from-right invp">Prenez contact avec nous</h1></div>
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