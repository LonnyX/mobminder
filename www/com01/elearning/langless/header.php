<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4CB7V4NW27"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-4CB7V4NW27'); // google analytics GA4
</script>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache" />

<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
<meta name="apple-mobile-web-app-capable" content="yes">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico">


<link rel="stylesheet" href="../assets/css/fonts.css">
<link rel="stylesheet" href="../assets/css/faws.css">
<link rel="stylesheet" href="../assets/css/generics.css">
<link rel="stylesheet" href="../assets/css/bootstrap.css">
<link rel="stylesheet" href="../assets/css/video-js.css">


<script src="../assets/js/jquery-3.2.1.js"></script>
<script src="../assets/js/moblib.js"></script>

<script src="../assets/js/waves.js"></script>
<script src="../assets/js/xlate.js"></script>
<script src="../assets/js/contact.js"></script> 
<script src="../assets/js/captcha.js"></script>   <!-- to be used with captcha.php -->
<script src="../assets/js/video-js.js"></script>   <!-- to be used with captcha.php -->

<script>

	/*	// Cookies screen 
		
		$(document).ready( function() { 
			if(Cookies.get('cookiesyes')!='1')
				setTimeout(() => {
					$('#cookiesscreen').css('display', 'flex');
					$('#cookiesyes').click(
						function(){
							console.log('coucou');
							Cookies.set('cookiesyes','1');
						}
					);
				}, 2000);
			else console.log('We love cookies')
		} );

	*/


		// (*pvh01*) chrono events
		
		var pageready = 0, stepduration = 300;
		$(document).ready( function() { pageready = 1; } );
		
		
		var s = 0;
		(function unfold() {
			let fc = 's'+s;
			$('body').find('.unfold'+'.'+fc).each( 
				function() {  $(this).addClass('do-unfold'); } 
			);
			if(s<10) setTimeout(unfold,stepduration); // recurse only 10 times
			if(pageready) s++;
		})();
		
		
		// (*pvh01*) in viewport events

		// listen for scroll event
		document.addEventListener('scroll', trackviewport);
		
		function inviewport(e) { // checks if element is in viewport
			// get window height
			var windowHeight = window.innerHeight;
			// get number of pixels that the document is scrolled
			var scrollY = window.scrollY || window.pageYOffset;

			// get current scroll position (distance from the top of the page to the bottom of the current viewport)
			var scrollPosition = scrollY + windowHeight;
			// get element position (distance from the top of the page to the bottom of the element)
				let eH = e.clientHeight;
			var elementPosition = e.getBoundingClientRect().top + scrollY + eH + 100;

			// is scroll position greater than element position? (is element in view?)
			return scrollPosition > elementPosition;
		}
		function delayedunfold(e) { $(e).addClass('do-unfold');	setTimeout(cleanup,3000,e); }
		function trackviewport() {
			var cycle = 0;
			$('body').find('.unfold.invp').each(  // hooks up only on elements that are meant to unfold when in viewport
				function() { 
					if(inviewport(this)) {
						$(this).removeClass('invp'); // makes it happen only once for each 
						setTimeout(delayedunfold,300+cycle,this);
					}
					cycle += 300;
				} 
			);
		}
		function cleanup(e) { /* this is necessary to let the h1.mobul class take effect */
			$(e).removeClass('from-left').removeClass('from-top').removeClass('from-right').removeClass('from-bottom').removeClass('from-center');
			$(e).removeClass('roll-left').removeClass('roll-top').removeClass('roll-right').removeClass('roll-bottom').removeClass('roll-horizon');
			$(e).removeClass('do-unfold').removeClass('unfold');
		}
		
		// frame reference for background animations
		//
		var aframe = 0;
		var aframe_do = false;
		(function frame() {
			aframe++;
			aframe_do = (aframe%6)==0;
			requestAnimationFrame(frame);
		})();
		
</script>