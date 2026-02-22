<!doctype html>
<html>

<head>
	<title>Tests</title>
	<meta name="description" content="Test page">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache" />
	<meta name="robots" content="noindex">
	<meta name="googlebot" content="noindex">

	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="format-detection" content="telephone=no">
	<meta name="format-detection" content="date=no">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


	<link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico">


	<link rel="stylesheet" href="../assets/css/fonts.css">
	<link rel="stylesheet" href="../assets/css/faws.css">
	<!-- <link rel="stylesheet" href="../assets/css/generics.css"> -->
	<link rel="stylesheet" href="../assets/css/bootstrap.css">
	


	<script src="../assets/js/jquery-3.2.1.js"></script>
	<script src="../assets/js/moblib.js"></script>

	<script src="../assets/js/waves.js"></script>
	<link rel="stylesheet" href="../assets/css/tests.css">
	
	<script>
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

<!-- Telavox chat -->
<script src="https://customerwidget.telavox.com/tvx-customer-widget-app.js?widgetId=170377c9-4a53-49d4-b3e7-8bd90f204369" charset="utf-8" crossorigin="anonymous" type="text/javascript" defer></script> <!-- Testing on _tests.php page -->

<?php
$l='fr';
switch($l) {
    case 'fr': 
        $widget = '170377c9-4a53-49d4-b3e7-8bd90f204369'; 
        break;
    case 'nl': 
        $widget = '14e025b1-f27e-414a-a848-4b367f7f24e7'; 
        break;
    case 'en': 
    default: 
        $widget = 'b718b672-2923-4cc2-b00a-b992bbd17516'; 
        break;
}
?>

<!-- <script src="https://customerwidget.telavox.com/tvx-customer-widget-app.js?widgetId=<?= $widget ?>" charset="utf-8" crossorigin="anonymous" type="text/javascript" defer></script> -->


</head>

<body class="dot"> <!-- class="slightwhite" */ -->


<section id="nice_spinner" class="airup air">

<div class="text-center text-sm-left" id="eresa_chkindiv_bident">
	<div id="eresa_chkin_ident_ui" style="cursor:pointer; display:flex; justify-content:center; align-items:center; margin-left:50px;" class="click e-button loading">
		<i class="fad fa-spinner-third fa-spin fa-1d5x"></i>
	</div>
</div>

</section>

<section id="nice_input" class="airup air">

	<div class="input-field">
		<input type="text" required spellcheck="false" autocomplete="off"> 
		<label>Nom de l'entreprise</label>
	</div>
	<div class="input-field">
		<input type="text" required spellcheck="false" autocomplete="off"> 
		<label>Clôture de l'exercice comptable</label>
	</div>
	<div class="input-field">
		<input type="text" required spellcheck="false" autocomplete="off"> 
		<label>Prénom de la personne de contact</label>
	</div>
	<div class="input-field">
		<input type="text" required spellcheck="false" autocomplete="off"> 
		<label>Nom de la personne de contact</label>
	</div>

</section>






<section id="" class="pvh">  <!-- duotone spin when clicked -->

	<div class="pvh-centered">
			<div class="pvh-click pvh-spin spin-right fad fa-users fa-5x mob-txt-lime"></div>
	</div>
	
	
	<script type="text/javascript">	
		
		$('body').find('.pvh-click').each(  <!-- attach click event on  -->
			function() { 
				$(this).click(
					function() {
						this.classList.toggle('spinned');
					} )
			} 
		);
		
	</script> 
	
</section>




<section id="" class="pvh"> <!-- duotone split with rotation clock and counterclock, on :hover -->

	<div class="pvh-centered">
		<div class="spin-wrap pvh-hover fa-5x">
			<div class="fad fa-users noafter nobefore"></div>
			<div class="fad fa-users pvh-spin spin-right mob-txt-lime nobefore fronter"></div>
			<div class="fad fa-users pvh-spin spin-left mob-txt-lime noafter backer"></div>
		</div>
			
		<div class="spin-wrap pvh-hover fa-5x">
			<div class="fad fa-comments noafter nobefore"></div> <!-- flux space keeper -->
			<div class="fad fa-comments pvh-spin spin-left mob-txt-blue nobefore"></div> <!-- flux space keeper -->
			<div class="fad fa-comments pvh-spin spin-right mob-txt-lime noafter"></div>
		</div>
			
		<div class="spin-wrap pvh-hover fa-5x">
			<div class="fad fa-check-double noafter nobefore"></div> <!-- flux space keeper -->
			<div class="fad fa-check-double pvh-spin spin-left mob-txt-lime nobefore"></div> <!-- flux space keeper -->
			<div class="fad fa-check-double pvh-spin spin-right mob-txt-lime noafter"></div>
		</div>
	</div>
	
</section>


			<!--       -->
			
			


<section id="" class="pvh pvh-3dcontainer">

	<div class="pvh-plane">
		<div class="pvh-contents pvh-front">
			<div class="fad fa-users fa-5x mob-txt-lime"></div>
		</div>
		<div class="pvh-contents pvh-back">
			<div class="fad fa-calendar-alt fa-5x mob-txt-lime"></div>
		</div>
	</div>
	
</section>




			<!--       -->
			
			
<section id="" class="pvh pvh-3dcontainer">

	<div class="pvh-plane">
		<div class="pvh-contents pvh-front">
			<div class="pvh-depth">
				<div class="fad fa-users fa-5x mob-txt-lime"></div>
			</div>
		</div>
		<div class="pvh-contents pvh-back">
			<div class="pvh-depth">
				<div class="fad fa-calendar-alt fa-5x mob-txt-lime"></div>
			</div>
		</div>
	</div>
	

	<script type="text/javascript">	
		
		$('body').find('.pvh-plane').each(
			function() { 
				$(this).click(
					function() {
						this.classList.toggle('spinned');
					} )
			} 
		);
		
	</script> 
	
</section>





			<!--       -->
			





			<!--       -->
			

<section id="clouds" class="">


	<div id="figures" class="figures">
		<div class="space">
			<div class="dot earth">
				<div><div id="e1"></div></div>
			</div>
		</div>
	</div>

<script type="text/javascript">

	// let el1 = document.querySelector("#welcome"); // wave the upper sky border
	// var w1 = new C_waved( el1, { animate:true, frequence:6, phase:0, speed:8, amplitude:30 });
	
	var e1 = document.querySelector("#e1"); // let the earth flow
	(function wind() {
		let d = (aframe)/16;
		if(aframe_do) {
			e1.style.backgroundPosition ="left calc(50% + "+d+"px) top 50%"; // (*cp01*)
		}
		requestAnimationFrame(wind);
	})();
	
</script> 
</section>  <!--section welcome -->



			<!--       -->
			

<section id="clouds" class="">


<div id="figures" class="figures">
	<div class="space">
		<div class="dot earth">
			<div><div id="e2"></div></div>
		</div>
	</div>
</div>

<script type="text/javascript">

// let el1 = document.querySelector("#welcome"); // wave the upper sky border
// var w1 = new C_waved( el1, { animate:true, frequence:6, phase:0, speed:8, amplitude:30 });

var e2 = document.querySelector("#e2"); // let the earth flow
(function wind2() {
	let d = (aframe)/4;
	if(aframe_do) {
		e1.style.backgroundPosition ="left calc(50% + "+d+"px) top 50%"; // (*cp01*)
	}
	requestAnimationFrame(wind2);
})();

</script> 
</section>  <!--section welcome -->



<section id="clouds" class="">
	<div class="cards-wrapper">
		<div class="card-container">
			<div class="card">
				<div class="card-contents card-front">
					  <div class="card-depth">
						<h2>Click card</h2>
						<hr>
						<p>For 3D rotation</p>
					  </div>
				</div>
				<div class="card-contents card-back">
					  <div class="card-depth">
						<h2>Click card again</h2>
						<hr>
						<p>To turn back</p>
					  </div>
				</div>
			</div>
		</div>
	</div>
	

<script type="text/javascript">	
	const card = document.querySelector('.card');
	function clickRotate() {
		card.classList.toggle('rotated');
	}
	card.addEventListener('click', clickRotate);
</script> 
	
</section>



<?php
	$x = 0;
	while($x<200) {
		
		$carree = pow($x,1/2);
		$whole = floor($carree);
		$decimals = $carree-$whole;
		$ok2 = $decimals == 0;
		// echo($x.' > x2 = '.$carree.' > decimals : '.$decimals.'<br/>' );
		
		$cubiq = pow($x,1/3);
		$whole = floor($cubiq);
		$decimals = $cubiq-$whole;
		$ok3 = $decimals == 0;
		// echo($x.' > x3 = '.$carree.' > decimals : '.$decimals.'<br/>' );
		
		if($ok2 or $ok3) echo('==============='.$x.' is a candidate<br/>');
		$x+=2;
		
		echo('<br/>');
	}
	
	
	$r = 0; $getout = false;
	while(!$getout) {
		
		$p2 = $r * $r; 
		
		$p3 = $r * $r * $r;
		
		if($p2<200) echo($p2.' is ok ! ('.$r.' pow 1/2)</br>');
		if($p3<200) echo($p3.' is ok ! ('.$r.' pow 1/3)</br>');
		
		$getout = $p2 > 200 && $p3 > 200; 
		$r += 2;
		echo('<br/>');
	}

?>






<!--Ecrire fct qui implemente ceci qui prend du txt en entrée et qui en sort en sortie : comptage 998, passage à la ligne devant toute "bouche" qui s'ouvre ou un = ou devant ; ou devant un espace sinon "plein texte" => coupure sera à 998-->

<section id="retourligne" class="airup air centered">

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">1) Sans passage à la ligne</p></a>
</div>

<div class="airplus wrapred">
<
a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer; color:red;">2) just after start tag</p></a>
</div>

<div class="airplus wrapred">
<a 
href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">3) In between start tag and attribute</p></a>
</div>

<div class="airplus wrapred">
<a hr
ef="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer; color:red;">4) In attribute</p></a>
</div>

<div class="airplus wrapred">
<a href
="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target
="blank" rel="noopener"><p class
="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">5) In between attribute and =</p></a>
</div>

<div class="airplus wrapred">
<a href=
"https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">6) In between = and value</p></a>
</div>

<div class="airplus wrapred">
<a href="
https://www.presse-citr
on.net/comment-doctolib-protege-donn
ees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">7) In value V1</p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/com
ment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">7) In value V2</p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/com
ment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer
;color:green
;">8B) In value V2</p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/com
ment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p class="mob-t
xt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">8C) In value V2</p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener"><p cla
ss="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">8) In value V2</p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener">
	<p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">9) > 
	< </p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener">
	<p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">10) In the midd
	le of a word></p></a>
</div>

<div class="airplus wrapred">
<a href="https://www.presse-citron.net/comment-doctolib-protege-donnees-sante/"target="blank" rel="noopener">
	<p class="mob-txt-gray_d airplus left-padded-from-xl" style="cursor:pointer;">10) In front of a space in
	 text</p></a>
</div>


</section>





<!-- CHAT MADE FOR BEAUTY PAGE WITH FLORIAN-->
<!-- <div id="chat" class="right">

	<div id="chat_area" class="chat-area">
		<div style="text-align:right;">
            <a id="popup_cross"><i class="mob-txt-gray_m fa fa-times"></i></a>
        </div>

		<div class="left auto-msg mob-txt-gray_d">
			<p class="mob-txt-gray_d hide-small">Bonjour!<br><br>
			Scannez ce code pour me poser vos questions sur WhatsApp. <br>
			Je ne suis pas un robot, il m'arrive de faire des pauses et de dormir. 
			Je vous répondrai dès que je vois votre message ;)<br><br>
			Florian</p>
			<p class="mob-txt-gray_d hide-big">Bonjour!<br><br>
			cliquez sur la zone du bas pour me poser vos questions sur WhatsApp.<br>
			Je ne suis pas un robot, il m'arrive de faire des pauses et de dormir. 
			Je vous répondrai dès que je vois votre message ;)<br><br>
			Florian</p>
		</div>	

		<div class="">
			<div class="flexinner col-8 d-sm-none whatsapp-link zoom airplus airupplus">
					<a href="https://api.whatsapp.com/send?phone=32492458530" target="_blank" rel="noopener nofollow"><i class="fab fa-whatsapp mob-txt-lime fa-1d5x"></i><span class="mob-txt-blue" style="font-size:110%;">&nbsp;&nbsp;+32 492 45 85 30</span></a>
			</div>
			<div class="flexinner d-none d-sm-block col-8 air airup">
					<a href="https://api.whatsapp.com/send?phone=32492458530" target="_blank"><img class="qrcode-img" src="../assets/imgs/qrcodes/qrcode-whatsappflo.png" alt="QR-code-whatsapp"></a>
			</div>

			<div class="flexinner col-4"> 
				
			</div>
		</div>

		<div>
			<img class="account-right-img" src="../assets/imgs/team/Florian3.png" alt="account-manager-pic">
		</div>
	</div>

	<div id="chat_call" class="chat-call" style="cursor: pointer;">
		<span class="call-msg centered">
			<i class="fa fa-comment-dots white" style="padding-right:10px;"></i><span class="mob-txt-gray_d">Puis-je vous aider ?</span>
		</span>

		<span class="call-pims">
			<img src="../assets/imgs/team/florian-chat.JPG" alt="">
		</span>
	</div>

</div>

<script type="text/javascript">

    $(document).ready( function() { 
        $('#chat_call').click(
            function(){
                console.log('Popup');
                $('#chat_area').css({'transform': 'translate(-380px,0px)'});
            })
        $('#popup_cross').click(
            function(){
                $('#chat_area').css({'transform': 'translate(0px,0px)'});
            })
        });

</script>

</section> -->

<!--<section>
    <div id="login_box" class="login-box">
		<div style="display:grid; place-items:center; margin:20px 0;"><a class="cta2-button"><i class="white fa fa-location-arrow"></i><span>&nbsp;&nbsp;&nbsp;Me connecter</span></a></div>
		<div style="display:grid; place-items:center; margin:20px 0;"><a class="cta2-button grey_border mob-txt-gray_d"><span>&nbsp;&nbsp;&nbsp;Créer mon agenda</span></a></div>
	</div>
</section>-->


<section id="rotating_globe" class=airupplus>

<div class="globe-container">
  <canvas id="globe"></canvas>
</div>

<script src="https://threejs.org/build/three.min.js"></script>
<script>
// create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("globe") });
renderer.setSize(window.innerWidth, window.innerHeight);

// create a new scene
const scene = new THREE.Scene();

// create a camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 0, 5);


// load a texture
const loader = new THREE.TextureLoader();
const texture = loader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_diffuse.jpg"
);

// create a sphere and add the texture
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// create an animation loop
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();

// make the globe responsive
window.addEventListener("resize", function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

</script>


</section>
	
</body>
</html>