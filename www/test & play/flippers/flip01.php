<!doctype html>
<html>

<head>
	<title>3D Flipping card</title>
	<meta name="description" content="Test page">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


	<link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico">


	<link rel="stylesheet" href="../assets/css/fonts.css">
	<link rel="stylesheet" href="../assets/css/faws.css">
	<link rel="stylesheet" href="../assets/css/generics.css">
	

	<script src="../assets/js/jquery-3.2.1.js"></script>

	<link rel="stylesheet" href="./flip01.css">
	
	
</head>

<body class="dot" style="overflow:hidden">




			<!--   F L A T    -->
			
			


<section id="" class="pvh pvh-3dcontainer" style="position:relative; z-index:10;">

	<div class="pvh-plane">
		<div class="pvh-contents bordered pvh-front">
			<div class="fad fa-users fa-5x mob-txt-lime"></div>
		</div>
		<div class="pvh-contents bordered blue pvh-back">
			<div class="fad fa-calendar-alt fa-5x mob-txt-lime"></div>
		</div>
	</div>
	
</section>




			<!--   3 D    -->
			
			
<section id="" class="pvh pvh-3dcontainer">

	<div class="pvh-plane">
		<div class="pvh-contents pvh-front">
			<div class="pvh-depth">
				<div class="fad fa-users fa-5x mob-txt-blue"></div>
			</div>
		</div>
		<div class="pvh-contents pvh-back">
			<div class="pvh-depth">
				<div class="fad fa-calendar-alt fa-5x mob-txt-blue"></div>
			</div>
		</div>
	</div>
	
</section>




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


</body>
</html>