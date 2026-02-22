<!doctype html>
<html translate="no" lang="<?= $l ?>">

<head>
	<title><?= X('pageTitle') ?></title>
	<meta name="description" content="<?= X('pageDescription') ?>">
	<link rel="canonical" href="https://www.mobminder.com/<?= $l ?>/about.php">
	<?php include('header.php')?>
	<link rel="stylesheet" href="../assets/css/about.css">
</head>

<body> <!-- class="slightwhite" */ -->


	<?php include('menu.php')?>



			<!--    W E L C O M E    +    F I G U R E S   -->
			
			

<section id="clouds" class="welcome air noverflow">
	<div class="shade"></div>
	<div id="welcome" class="animate wbottom welcome">
		<div class="margins headers-container" style="padding-top:1em;">
			<h1>
				<a href="./index.php">
				<div class="logo centered unfold from-left s4">
					<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
					<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
				</div>
				</a>
				<div class="headers">
					<div class="bold left mob-txt-gray_l unfold from-top s0"><?= X('top_menu_4','main') ?></div>
					<div class="bold left mob-txt-gray_m unfold from-top s1"><?= X('top_header_l1','main') ?></div>
				</div>
			</h1>
		</div>
	</div>

	<div id="figures" class="figures">
			<div class="margins">
				<h2 class="centered white airplus airupplus unfold from-right s0 "><?= X('sec1_about_title') ?></h2>
			</div>
			<div class="wide">
				<div class="row">
					<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div class="figure-box unfold from-left s2">
							<div class="figure-box-inner">
								<div class="fa-block fal fa-users fa-2x mob-txt-lime"></div>
								<h2 class="white"><?= X('figures_users_count','main') ?></h2>
								<p class="white centered bigger air"><?= X('figures_users','main') ?></p>
							</div>
						</div>
					</div>
					<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div class="figure-box unfold from-top s1">
							<div class="figure-box-inner">
								<div class="fa-block fal fa-id-card fa-2x mob-txt-lime"></div>
								<h2 class="white"><?= X('figures_visitors_count','main') ?></h2>
								<p class="white centered bigger air"><?= X('figures_visitors','main') ?></p>
							</div>
						</div>
					</div>
					<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div class="figure-box unfold from-bottom s1">
							<div class="figure-box-inner">
								<div class="fa-block fal fa-calendar-alt fa-2x mob-txt-lime"></div>
								<h2 class="white"><?= X('figures_planned_count','main') ?></h2>
								<p class="white centered bigger air"><?= X('figures_planned','main') ?></p>
							</div>
						</div>
					</div>
					<div class="flexinner col-xs-12 col-sm-6 col-md-6 col-lg-3">
						<div class="figure-box unfold from-right s2">
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
</section>  <!--section welcome -->



<!--     Y O U   -->


<section id="customers" class="customers">

	<div class="margins">
			<h1 class="bigger centered mob-txt-gray_l airup"><?= X('sec2_about_title') ?></h1>
	</div>

	<div class="margins">
		<div class="row">
			<div class="flexinner col-sm-12 col-xl-6">
				<div class="wesolve-box">
					<div class="wesolve-box-image">
						<img src="../assets/imgs/mobicons/time.png" alt="">
					</div>
					<h2 class="mob-txt-blue air"><?= X('sec1_about_subtitle1') ?></h2>
					<!--<p class="centered mob-txt-gray_d"></p>-->
					<div class="fa-block fad fa-arrow-down fa-3x mob-txt-lime"></div>
					<p class="airup centered mob-txt-gray_d"><?= X('sec1_about_text1') ?></p>
				</div>
			</div>
			<div class="col-sm-12 col-xl-6">
				<div class="list-area checked p-list-area airup">
				  <ul class="left-padded-from-xl">
					<li><?= X('sec1_about_subtitle2') ?></li>
						<p><?= X('sec1_about_text2') ?></p>
					<li><?= X('sec1_about_subtitle3') ?></li>
						<p><?= X('sec1_about_text3') ?></p>
					<li><?= X('sec1_about_subtitle4') ?></li>
						<p><?= X('sec1_about_text4') ?></p>
				  </ul>
				</div>
			</div>
		</div>
	</div>

	<div class="slider slider500">
		<div class="slide-track scroll-to-left_60s">
			<span class="copy-me">
				<div class="slide-stick slide-customers"><img src="../assets/imgs/slider/mosaic-faces-1.jpg" alt=""></img></div>
				<div class="slide-stick slide-customers"><img src="../assets/imgs/slider/mosaic-faces-2.jpg" alt=""></img></div>
			</span>
		</div>
	</div>

	

	<script type="text/javascript">
			$('#customers').find('.slide-track').each(
				function() {
					let wagon = $(this).html(); // (-st01-)
					$(this).find('.copy-me').after(wagon).after(wagon).after(wagon);					
					setTimeout(function() { // hand back to browser so it figures out the new element width (containing now 4 span wagons)
						$('#customers').find('.slide-track').addClass('go'); // go start the animation 
					}, 1000); 
				}
			)
	</script>

</section>


<!--     T E A M  P A R T N E R S  -->


<section id="partners" class="team">

	<div class="margins">
			<h1 class="bigger centered mob-txt-gray_l airup"><?= X('sec7_about_title') ?></h1>
	</div>

	<div class="row airup">
        <div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
            <div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Olivier.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Olivier Gay</dt>
                    <dd class="mob-txt-blue">Mobikap France</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Laurence.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Laurence Soetens</dt>
                    <dd class="mob-txt-blue">Burogest</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
            <div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Pierre.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Pierre Halut</dt>
                    <dd class="mob-txt-blue">Oxteo</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
            <div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Laetitia.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Laetitia Blanc-Laroche</dt>
                    <dd class="mob-txt-blue">Village n°1 Entreprises</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
            <div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Catherine.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Catherine Barthel</dt>
                    <dd class="mob-txt-blue">Mon-télésecrétariat</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
            <div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Bruno.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Bruno Willems</dt>
                    <dd class="mob-txt-blue">Medinect</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Arthur.png" alt="">
                <dl class="bgwhite">
					<dt class="mob-txt-gray_m">Arthur Doret</dt>
                    <dd class="mob-txt-blue">Ardo consulting</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Veronique.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Véronique Vilim</dt>
                    <dd class="mob-txt-blue">Smile Office</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Pascallibert.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Pascal Libert</dt>
                    <dd class="mob-txt-blue">Done 4 You</dd>
                </dl>
            </div>
        </div>

		<div class="col-md-12 col-lg-12 col-xl-12 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-partner-pic" src="../assets/imgs/team/Tanguy.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Tanguy Portzenheim</dt>
                    <dd class="mob-txt-blue">Getralux</dd>
                </dl>
            </div>
        </div>

	</div>


</section> 

<!--     C O R E   T E A M    -->

<section id="team" class="team">

	<div class="margins air">
			<h1 class="bigger centered mob-txt-gray_l airup"><?= X('sec3_about_title') ?></h1>
	</div>
	
    <div class="row airup">
        <div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
            <div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Pascal.png" whenhover="../assets/imgs/team/Pascal2.png" whenout="../assets/imgs/team/Pascal.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Pascal Vanhove</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position1') ?></dd>
					<dd id="team_pascal" class="mob-txt-gray_m team-description" style="visibility:hidden"><?= X('description_pascal') ?></dd>
                </dl>
            </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Keevin.png" whenhover="../assets/imgs/team/Keevin2.png" whenout="../assets/imgs/team/Keevin.png" alt="">
                <dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Keevin Pierre</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position2') ?></dd>
					<dd id="team_keevin" class="mob-txt-gray_m team-description" style="visibility:hidden"><?= X('description_keevin') ?></dd>
                </dl>
            </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Giraud.png" whenhover="../assets/imgs/team/Giraud2.png" whenout="../assets/imgs/team/Giraud.png" alt="">
				<dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Giraud Derlet</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position3') ?></dd>
					<dd id="team_giraud" class="mob-txt-gray_m team-description" style="visibility:hidden"><?= X('description_giraud') ?></dd>
                </dl>
            </div>
        </div>
		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Florence.png" whenhover="../assets/imgs/team/Florence2.png" whenout="../assets/imgs/team/Florence.png" alt="">
				<dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Florence Claereboudt</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position8') ?></dd>
					<dd id="team_pascallib" class="mob-txt-gray_m team-description" style="visibility:hidden"><?= X('description_pascallibert') ?></dd>
                </dl>
            </div>
        </div>
		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Jona.png" whenhover="../assets/imgs/team/Jona2.png" whenout="../assets/imgs/team/Jona.png" alt="">
				<dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Jonathan Bardo</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position5') ?></dd>
					<dd id="team_jona" class="mob-txt-gray_m team-description" style="visibility:hidden"><?= X('description_jona') ?></dd>
                </dl>
            </div>
        </div>
		<div class="col-md-12 col-lg-6 col-xl-4 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Bernard.png" whenhover="../assets/imgs/team/Bernard2.png" whenout="../assets/imgs/team/Bernard.png" alt="">
				<dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Bernard Spoden</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position6') ?></dd>
					<dd id="team_bernard" class="mob-txt-gray_m team-description" style="visibility:hidden"><?= X('description_bernard') ?></dd>
                </dl>
            </div>
        </div>
		<div class="col-md-12 col-lg-6 col-xl-6 slightgreytobtm">
			<div class="team-member centered"> 
			<img class="t-member-pic" src="../assets/imgs/team/Mede.png" whenhover="../assets/imgs/team/Mede2.png" whenout="../assets/imgs/team/Mede.png" alt="">
				<dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Médéric Wautot</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position4') ?></dd>
					<dd id="team_mede" class="mob-txt-gray_m team-description" style="visibility:hidden; max-width:550px;"><?= X('description_mede') ?></dd>
                </dl>
            </div>
        </div>
		<div class="col-md-12 col-lg-6 col-xl-6 slightgreytobtm">
			<div class="team-member centered">
			<img class="t-member-pic" src="../assets/imgs/team/Florian.png" whenhover="../assets/imgs/team/Florian2.png" whenout="../assets/imgs/team/Florian.png" alt="">
				<dl class="bgwhite">
                    <dt class="mob-txt-gray_m">Florian Bertrand</dt>
                    <dd class="mob-txt-blue"><?= X('sec3_about_position7') ?></dd>
					<dd id="team_florian" class="mob-txt-gray_m team-description" style="visibility:hidden; max-width:550px;"><?= X('description_florian') ?></dd>
                </dl>
            </div>
        </div>
    </div>

	<script type="text/javascript">
	 
		$('#team').find('div.team-member').each(
			function() {
				$(this).hover( function() { // handler mouse in
					$(this).find('dd.team-description').each( function(){ $(this).css("visibility", "visible"); });
					$(this).find('img.t-member-pic').each( function(){ let whenhover = $(this).attr("whenhover"); $(this).attr("src", whenhover); });
				}, function() { // handler mouse out
					$(this).find('dd.team-description').each( function(){ $(this).css("visibility", "hidden"); });
					$(this).find('img.t-member-pic').each( function(){ let whenout = $(this).attr("whenout"); $(this).attr("src", whenout); });
				});
			}
		)
	</script>

</section>


	<!--     T I M E   L I N E   -->

<section id="history" class="history">

	<div class="margins">
				<h1 class="bigger centered mob-txt-gray_l airupplus air"><?= X('sec4_about_title') ?></h1>
	</div>

	<div id="ls-timeline" class="ls-timeline wide airup" style="display:none;"> 	<!--    Appears only on larger screens   -->
		<div class="row">
		
			<div class="col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m cap-top"></h2></div>
			</div>

					<div class="flexinner col-6 left-margins img-container">
					</div>


			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2007</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event1') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text1') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img src="../assets/imgs/history/msg.jpg" alt=""></img>
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img class="logo" src="../assets/imgs/history/dieteren.jpeg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2010</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event2') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text2') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2011</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event3') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text3') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img src="../assets/imgs/history/team.jpg" alt=""></img>
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img src="../assets/imgs/history/call-center.jpg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2012</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event4') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text4') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2013</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event5') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text5') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img class="logo" src="../assets/imgs/history/dentadmin.png" alt=""></img>
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img src="../assets/imgs/history/mobikap.jpg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2014</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event6') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text6') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2015</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event7') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text7') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img class="logo" style="max-height:210px;" src="../assets/imgs/history/gsk.jpg" alt=""></img>
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img class="logo" src="../assets/imgs/history/mdm.jpg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2016</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event8') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text8') ?></p>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text8_2') ?></p>
					</div>

			<!-- <div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2017</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event9') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text9') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img src="../assets/imgs/history/spitup.jpg" alt=""></img>
					</div> -->

			<div class="timeline-box col-6 right-margins img-container">
				<img src="../assets/imgs/history/oxteo.jpg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
								<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2017</h2></div>
								<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event10') ?></h2>
								<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text10') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m"></h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event11') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text11') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img src="../assets/imgs/history/h4d.jpg" alt=""></img>
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img class="logo" src="../assets/imgs/history/logo-medinect.jpeg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2018</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event12') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text12') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2019</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event13') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text13') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img class="logo" src="../assets/imgs/history/dietplus.jpg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2020</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event14') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text14') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m"></h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event15') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text15') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img class="logo" src="../assets/imgs/history/axa.jpg" alt=""></img>
					</div>

			<div class="timeline-box col-6 right-margins img-container">
				<img class="" style="max-height:250px;" src="../assets/imgs/history/chat.jpg" alt=""></img>
			</div>

					<div class="timeline-box col-6 left-margins">
						<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2021</h2></div>
						<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event16') ?></h2>
						<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text16') ?></p>
					</div>

			<div class="timeline-box col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m">2023</h2></div>
				<h2 class="bold mob-txt-blue unfold from-left invp" style="text-align:end;"><?= X('sec4_about_event17') ?></h2>
				<p class="mob-txt-gray_d" style="text-align:end;"><?= X('sec4_about_text17') ?></p>
			</div>

					<div class="timeline-box col-6 left-margins img-container">
						<img style="max-width:380px;" src="../assets/imgs/history/mobminderpay.jpg" alt=""></img>
					</div>

					<div class="timeline-box col-6 right-margins img-container">
						<img class="" style="max-height:150px;" src="../assets/imgs/history/telavox.jpg" alt=""></img>
					</div>

				<div class="timeline-box col-6 left-margins">
					<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2025</h2></div>
					<h2 class="bold mob-txt-blue unfold from-right invp" style="text-align:start;"><?= X('sec4_about_event18') ?></h2>
					<p class="mob-txt-gray_d" style="text-align:start;"><?= X('sec4_about_text18') ?></p>
				</div>

			<div class="col-6 right-margins">
				<div style="position:relative;"><h2 class="year year-right mob-txt-gray_m cap-bottom"></h2></div>
			</div>
	
		</div>
	</div>



	<div id="ms-timeline" class="ms-timeline margins">  <!--    Appears only on smaller screens   -->

		<div class="left-margins">
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m cap-top"></h2></div>
			<h2 class="bold mob-txt-blue"></h2>
			<p class="mob-txt-gray_d"></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img style="max-height:230px;" src="../assets/imgs/history/msg.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2007</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event1') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text1') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" src="../assets/imgs/history/dieteren.jpeg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2010</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event2') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text2') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/team.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2011</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event3') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text3') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/call-center.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2012</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event4') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text4') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" src="../assets/imgs/history/dentadmin.png" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2013</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event5') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text5') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/mobikap.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2014</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event6') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text6') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" style="max-height:140px;" src="../assets/imgs/history/gsk.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2015</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event7') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text7') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" src="../assets/imgs/history/mdm.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2016</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event8') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text8') ?><br/><?= X('sec4_about_text8_2') ?></p>
		</div>

		<!-- <div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/spitup.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2017</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event9') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text9') ?></p>
		</div> -->

		<div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/oxteo.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2017</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event10') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text10') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/h4d.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m"></h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event11') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text11') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" src="../assets/imgs/history/logo-medinect.jpeg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2018</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event12') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text12') ?></p>
		</div>

		<div class="left-margins air">
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2019</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event13') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text13') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" src="../assets/imgs/history/dietplus.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2020</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event14') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text14') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img class="logo" src="../assets/imgs/history/axa.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m"></h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event15') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text15') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img src="../assets/imgs/history/chat.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2021</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event16') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text16') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img style="max-width:350px;" src="../assets/imgs/history/mobminderpay.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2023</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event17') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text17') ?></p>
		</div>

		<div class="left-margins air">
			<div class="img-container"><img style="max-width:350px;" src="../assets/imgs/history/telavox.jpg" alt=""></img></div>
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m">2025</h2></div>
			<h2 class="bold mob-txt-blue unfold from-left invp"><?= X('sec4_about_event18') ?></h2>
			<p class="mob-txt-gray_d airplus"><?= X('sec4_about_text18') ?></p>
		</div>

		<div class="left-margins">
			<div style="position:relative;"><h2 class="year year-left mob-txt-gray_m cap-bottom"></h2></div>
		</div>

	</div>



</section>

	<!--     T O D A Y    -->

<section id="today" class="today">

	<div class="margins">
		<h1 class="bigger centered mob-txt-gray_l airupplus air"><?= X('sec5_about_title') ?></h1>
		
			<div class="list-area checked">
				<ul class="mob-txt-gray_m">
					<li><?= X('sec5_about_text1') ?></li>
					<li><?= X('sec5_about_text2') ?></li>
					<li><?= X('sec5_about_text3') ?></li>
					<li><?= X('sec5_about_text4') ?></li>
					<li><?= X('sec5_about_text5') ?></li>
					<li><?= X('sec5_about_text6') ?></li>
				</ul>
			</div>	

			<h2 class="mob-txt-blue airup air"><?= X('sec6_about_title') ?></h2>

				<div class="slider slider300 shadeinout">
					<div class="slide-track hover-stop scroll-to-right_20s">
						<span class="copy-me">

							<div class="slide">
								<a href="https://www.ssmg.be" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/SSMG.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">SSMG</dd>
											<dd class="smaller">(Société scientifique de Médecine Générale)</dd>
										</div>
									</div>
								</a>
							</div>
						
							<div class="slide">
								<a href="https://www.dentiste.be" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/SMD.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">SMD</dd>
											<dd class="smaller">(Société de Médecine Dentaire)</dd>
										</div>
									</div>
								</a>
							</div>

							<div class="slide">
								<a href="https://www.cod.eu.com" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/COD.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">COD</dd>
											<dd class="smaller">(Collège d'Omnipratique Dentaire asbl)</dd>
										</div>
									</div>
								</a>
							</div>

							<div class="slide">
								<a href="https://apad.be" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/APAD.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">APAD</dd>
											<dd class="smaller">(Association pour la Pratique de l'Art Dentaire)</dd>
										</div>
									</div>
								</a>
							</div>

							<div class="slide">
								<a href="https://upmo.be" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/UPMO.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">UPMO</dd>
											<dd class="smaller">(Union Professionnelle de Médecine Ostéopathique)</dd>
										</div>
									</div>
								</a>
							</div>

							<div class="slide">
								<a href="https://www.amub-ulb.be" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/AMUB.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">AMUB</dd>
											<dd class="smaller">(L'Association des Médecins anciens étudiants de l'ULB)</dd>
										</div>
									</div>
								</a>
							</div>

							<div class="slide">
								<a href="https://www.estetika.be/" target="blank" rel="noopener">
									<div class="association-area">
										<img src="../assets/imgs/sponsoring/ESTETIKA.jpg" alt="Logo">
										<div class="name white mob-bg-gray_l">
											<dd class="abrev">Estetika</dd>
											<dd class="smaller">(Beauty expo for professionals)</dd>
										</div>
									</div>
								</a>
							</div>

						</span>
					</div>
				</div>

				<script type="text/javascript">
					$('#today').find('.slide-track').each(
						function() {
							let wagon = $(this).html(); // (-st01-)
							$(this).find('.copy-me').after(wagon).after(wagon).after(wagon);					
							setTimeout(function() { // hand back to browser so it figures out the new element width
								$('#today').find('.slide-track').addClass('go'); // go start the animation 
							}, 1000); 
						}
					)
				</script>

				<div class="mob-txt-gray_l airup">
						<p class="small">SSMG - Société scientifique de Médecine Générale</p>
						<p class="small">SMD - Société de Médecine Dentaire</p>
						<p class="small">COD - Collège d'Omnipratique Dentaire asbl</p>
						<p class="small">APAD - Association pour la Pratique de l'Art Dentaire</p>
						<p class="small">UPMO - Union Professionnelle de Médecine Ostéopathique</p>
						<p class="small">AMUB - L'Association des Médecins anciens étudiants de l'ULB</p>
						<p class="small">Estetika - Beauty expo for professionals</p>
				</div>	
	</div>

</section>


	<!--    F O O T E R      -->

<div class="gas"></div>
<?php include('footer.php')?>
<?php include('cookies.php')?>


</body>
</html>