<footer>

	<section id="mobprefooter" class="mobprefooter relative">
		<div id="before_footer" class="animate wbottom videobanner bgwhite">
			<div class="margins fvideotitle">
				<h3 id="mobvid_invite" class="bigger mob-txt-gray_l unfold roll-left invp"><?= X('invite_play_video','footer') ?></h3>
				<h3 id="mobvid_thanks" class="bigger mob-txt-gray_l" style="display:none"><?= X('thanks_play_video','footer') ?></h3>
			</div>
			<div class="videowrap">
				<video 	id="mobvideo" class="video-js vjs-fluid" poster="../assets/imgs/poster/footer_poster.jpg"></video>
			</div>
			<script>
				$(document).ready(function() {
					var options = {
						controls: true,
						autoplay: false,
						loop: true,
						preload: 'auto',
						sources: [{ src:'../assets/vids/mobvid_720p_RF25.mp4' }],
						fluid: true
					}
					var onPlayerReady = function() { console.log('player ready: ', this.id_ ) };
					
					var p = videojs('mobvideo', options, onPlayerReady);
					p.on('play', () => { $("#mobvid_invite").hide(); $("#mobvid_thanks").show(); console.log('it plays') } );
					p.on('pause', () => { $("#mobvid_invite").show(); $("#mobvid_thanks").hide(); console.log('it stops') } );
					
					console.log('document ready');
				});
				</script>
		</div>
		
		<script type="text/javascript">
				let bftr = document.querySelector("#before_footer");
			var bhm = new C_waved( bftr, { animate:true, frequence:2, phase:0, speed:10, amplitude:10 });
			
		</script>
		
	</section>

			
	<section id="mobfooter" class="mobfooter relative">
		<div id="fwrapper" class="animate wbottom">
			<div class="worldmapshade"></div>
			<div id="figures" class="figures">
				<div class="margins">
					<h1 class="bold mobminder right"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></h1>
					<h3 class="silver right air"><?= X('slogan_1','main') ?></h3>
				</div>
				<div class="wide">
						<div class="row">
							<div class="flexinner col-xs-12 col-sm-6 col-xl-3 goright">
								<div class="footer-box">
									<div class="footer-box-inner">
										<div class="fa-block fad fa-tablet-alt fa-2x mob-txt-blue"></div>
										<div>
											<a class="silver" style="height:2.5em;" href='https://apps.apple.com/be/app/mobminder/id1530813844?l=fr' target="_blank">
												<i class="app-link fab fa-apple fa-1d5x"></i>
												<span style="padding-top:.5em;">App Store</span>
											</a>
										</div>
										
										<div>
											<a class="silver" style="height:2.5em;" href='https://play.google.com/store/apps/details?id=com.mobminder.agenda' target="_blank">
												<i class="app-link fab fa-google-play fa-1d5x"></i>
												<span style="padding-top:.3em;">Google Play</span>
											</a>
										</div>

										<div>
											<a class="silver" style="height:2.5em;" href='https://play.google.com/store/apps/details?id=com.mobminder.agenda' target="_blank">
												<i class="app-link fab fa-windows fa-1d5x"></i>
												<span style="padding-top:.3em;">Windows</span>
											</a>
										</div>
									</div>
								</div>
							</div>
							
							<div class="flexinner col-xs-12 col-sm-6 col-xl-3">
								<div class="footer-box">
									<div class="footer-box-inner">
										<div class="fa-block fad fa-shield fa-2x mob-txt-blue"></div>
										
											<a class="silver" style="height:7em;" href='https://www.cresco.be/' target="_blank">
												<i class="app-link fad fa-lock-alt fa-1d5x"></i>
												<span style="padding-top:0.7em;">CRESCO Cybersecurity</span>
											</a>
										
									</div>
								</div>
							</div>
							
							<div class="flexinner col-xs-12 col-sm-6 col-xl-3 goright">
								<div class="footer-box">
									<div class="footer-box-inner">
										<div class="fa-block fad fa-share-alt fa-2x mob-txt-blue"></div>

										<div style="display:flex; align-items:center; justify-content:center;">
											<a class="silver" style="height:7em;" href='https://www.instagram.com/mobminder_be/' target="_blank">
												<i class="app-link fab fa-instagram fa-1d5x"></i>
											</a>
											<a class="silver" href='https://www.facebook.com/mobminder' target="_blank">
												<i class="app-link fab fa-facebook fa-1d5x"></i>
											</a>
											<a class="silver" href='https://www.linkedin.com/company/mobminder/' target="_blank">
												<i class="app-link fab fa-linkedin fa-1d5x"></i>
											</a>
											<a class="silver" href='https://twitter.com/mobminder' target="_blank">
												<i class="app-link fab fa-twitter fa-1d5x"></i>
											</a>
											<a class="silver" href='https://www.youtube.com/c/Mobminder/featured' target="_blank">
												<i class="fab fa-youtube fa-1d5x"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
							
							<div class="flexinner col-xs-12 col-sm-6 col-xl-3">
								<div class="footer-box">
									<div class="footer-box-inner">
										<div class="fa-block fad fa-map-marker-alt fa-2x mob-txt-blue"></div>
										<p class="silver left"><?= X('address_l1','main') ?></p>
										<dd class="silver left"><?= X('address_l4','main') ?></dd>
										<dd class="silver left"><?= X('address_l5','main') ?></dd>
										<dd class="silver left"><?= X('address_l6','main') ?></dd>
										<dd class="silver left"><?= X('address_l7','main') ?></dd>
										<p class="airup silver right"><a class="phone silver" href="tel:+32 (0)2 880 97 87"><i class="fad fa-phone"></i>&nbsp;+32 (0)2 880 97 87</a></p>
									</div>
								</div>
							</div>
											
						</div>
				</div>
			</div>
			<div id="vfooter" class="vfooter">
				<div class="margins silver">
					<p class="centered">
						<img class="moblogo tiny" src="../assets/imgs/icon-1.png" alt="mobminder logo">
						<span class="mob-txt-blue bigger bold">mob</span><span class="mob-txt-lime bigger bold">minder</span>
						is a trademark of Cloud-Tech company Belgium © 2016-2022
					</p>
				</div>
			</div>
		</div>
	<script type="text/javascript">

		/* */
		var mobvideo = document.getElementById('mobvideo');
		if (typeof mobvideo.loop == 'boolean') { // loop supported
			mobvideo.loop = true;
		} else { // loop property not supported
			mobvideo.addEventListener('ended', function() {
				this.currentTime = 0; this.play(); }
				, false);
		}
		// mobvideo.play(); 
		
		// let the world spin
		//
		var mobfooter = document.querySelector("#mobfooter");
		(function citydrift() {
			let d = aframe/10;
			if(aframe_do) mobfooter.style.backgroundPosition ="left "+d+"px bottom 0"; // (*cp02*)
			requestAnimationFrame(citydrift); 
		})();
	</script>
			
	</section> <!-- section mobfooter -->

</footer>