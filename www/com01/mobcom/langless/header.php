<script>
// Define dataLayer and the gtag function.
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} //for production
// function gtag() { console.log('gtag() 4 dev! ', arguments) }; // for local dev

// Set default consent to 'denied' as a placeholder
gtag('consent', 'default', {
	'ad_storage': 'denied',
	'ad_user_data': 'denied',
	'ad_personalization': 'denied',
	'analytics_storage': 'denied',
	'functionality_storage': 'denied',
	'personalization_storage': 'denied',
	'security_storage': 'denied'
	});
</script>



<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T0V62NCJFH"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);} // for production
	// function gtag() { console.log('gtag() 4 dev! ', arguments) }; // for local dev
 	gtag('js', new Date());
	gtag('config', 'G-T0V62NCJFH'); // google analytics GA4
	gtag('config', 'AW-966604247');	// google ads
</script>

<script>

	// https://developers.google.com/tag-platform/security/guides/consent?hl=fr&consentmode=advanced#gtag.js_1   CONSENT MODE IMPLEMENTATION
	// https://developers.google.com/tag-platform/security/concepts/consent-mode?hl=fr#consent-types    CONSENT TYPES EXPLANATION
	var cookieoptimalname='cookieoptimal';
	function getCookieOptimal() {
		let cookies = document.cookie;
		let cookiesArray = cookies.split(';');
		for(let i = 0; i < cookiesArray.length; i++) {
			let cookie = cookiesArray[i].trim();
			if (cookie.indexOf(cookieoptimalname + '=') == 0) {
				return cookie.substring((cookieoptimalname + '=').length, cookie.length);
			}
		}
		return null;
	}
	//store optimal cookie
	//value (boolean) : true = '1' or false = '0'
	//if false, force expiration date to today+1, if true, force to date + 1 year
	function updateCookieOptimal(value) {
		//console.log('updateCookieOptimal', value) 
		let now = new Date();
		let days = (!value?1:365); // days = 1 / 24 / 60;
		let expire = new Date(now.getTime()+(days*86400*1000)); //One year in ms

		let cookieoptimalkey='cookieoptimal';
		let cookieoptimalsyntax = cookieoptimalkey+'='+(value?'1':'0')+'; expires='+expire.toGMTString();
		document.cookie=cookieoptimalsyntax;
	}
	// Function to update consent status based on user interaction
	function updateConsent() {
		let cookieoptimal = getCookieOptimal(); if(cookieoptimal==null) cookieoptimal='0';
		//console.log('updateConsent', cookieoptimal) 

		let consent = (cookieoptimal=='1');

		gtag('consent', 'update', {
		'ad_storage': consent ? 'granted' : 'denied',
		'ad_user_data': consent ? 'granted' : 'denied',
		'ad_personalization': consent ? 'granted' : 'denied',
		'analytics_storage': consent ? 'granted' : 'denied',
		'functionality_storage': consent ? 'granted' : 'denied',
		'personalization_storage': consent ? 'granted' : 'denied',
		'security_storage': consent ? 'granted' : 'denied'
		});

	//console.log('consent value is : '+cookieoptimal+'!');
	}

</script>

<!-- Telavox chat : 3 scripts different for each languague (en, fr, nl, es) according to the navigation lang, let appear the adequate one. Appear only between 9am and 5pm from Monday to Friday -->


<?php
switch($l ?? '') { // If $l is undefined or null, default to an empty string.
    case 'fr': 
        $widget = '5494a8ca-09a5-4efb-873c-3fcf35f50957'; 
        break;
    case 'nl': 
        $widget = '14e025b1-f27e-414a-a848-4b367f7f24e7'; 
        break;
    default: 
        $widget = 'b718b672-2923-4cc2-b00a-b992bbd17516'; 
        break;
}
?>

<!-- <script src="https://customerwidget.telavox.com/tvx-customer-widget-app.js?widgetId=<?= $widget ?>" charset="utf-8" crossorigin="anonymous" type="text/javascript" defer></script> Desactivation of chat can be done by commenting this line -->



<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache" />

<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="date=no">
<meta name="theme-color" content="#BECFDF" />
<meta name="theme-color" content="#BECFDF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#BECFDF" media="(prefers-color-scheme: dark)">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


<link rel="shortcut icon" href="../favicon.ico"> 	


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

<script type='text/javascript'>
  window.smartlook||(function(d) {
    var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
    var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
    c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
    })(document);
    smartlook('init', '4aa336122d421fd0a83db96f1aa6894cf2fd1eac', { region: 'eu' });
</script>

<script>

		// (*pvh01*) chrono events
		
		var pageready = 0, stepduration = 300;
		$(document).ready( function() { pageready = 1; } );
		
		
		var s = 0;
		(function unfold() {
			let fc = 's'+s;
			$('body').find('.unfold'+'.'+fc).each( 
				function() {  $(this).addClass('do-unfold'); } 
			);
			if(s<32) setTimeout(unfold,stepduration); // recurse only 10 times
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
			var elementPosition = e.getBoundingClientRect().top + scrollY + eH + 50; /* we want the item to be 50px higher than bottom line */

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
						setTimeout(delayedunfold,100+cycle,this); /* we let the item appear with a delay */
					}
					cycle += 200;
				} 
			);
		}
		function cleanup(e) { /* this is necessary to let the h1.mobul class take effect */
			$(e).removeClass('from-left').removeClass('from-top').removeClass('from-right').removeClass('from-bottom').removeClass('from-center');
			$(e).removeClass('roll-left').removeClass('roll-top').removeClass('roll-right').removeClass('roll-bottom').removeClass('roll-horizon');
			$(e).removeClass('v-flip').removeClass('h-flip');
			$(e).removeClass('do-unfold').removeClass('unfold');
		}
		
		// frame reference for background animations
		//
		var aframe = 0;
		var aframe_do = false;
		(function frame() {
			aframe++;
			aframe_do = (aframe%3)==0;
			requestAnimationFrame(frame);
		})();
		
</script>