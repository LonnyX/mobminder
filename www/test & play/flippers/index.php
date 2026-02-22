<!doctype html>
<html>

<head>
	<title>Tests</title>
	<meta name="description" content="Test page">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache" />

	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="format-detection" content="telephone=no">
	<meta name="format-detection" content="date=no">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


	<link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico">


	<link rel="stylesheet" href="../assets/css/fonts.css">
	<link rel="stylesheet" href="../assets/css/faws.css">
	<link rel="stylesheet" href="../assets/css/generics.css">
	


	<script src="../assets/js/jquery-3.2.1.js"></script>

	<link rel="stylesheet" href="./flippers.css">
	
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
</head>

<body class="dot"> <!-- class="slightwhite" */ -->






<section id="" class="pvh">  <!-- duotone spin when clicked -->

	<div class="pvh-centered">
			<div class="pvh-click pvh-spin spin-right fad fa-users fa-5x mob-fade-blue"></div>
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
			<div class="fad fa-comments pvh-spin spin-left mob-txt-lime nobefore"></div> <!-- flux space keeper -->
			<div class="fad fa-comments pvh-spin spin-right mob-txt-blue noafter"></div>
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


</body>
</html>