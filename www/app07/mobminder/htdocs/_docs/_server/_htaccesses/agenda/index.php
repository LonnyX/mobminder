<?php
$account = trim(substr($_SERVER['REQUEST_URI'],1));

$r = explode('?', $account);

?>
<html>
<head>
	<title>Mobminder for <?=strtoupper($account)?></title>
	<meta name="description" content="Mobminder Agenda + SMS + Email">
	<META name="Description" content="Auteur: Mobminder; Catégorie: Agenda en ligne Rappel SMS">
	<meta content="noFOLLOW,noINDEX" name="robots">
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
	<meta content="text/css" http-equiv="Content-Style-Type">
	<meta content="text/javascript" http-equiv="Content-Script-Type">

	<link rel="icon" type="image/ico" href="/favicon.ico">
		
	<!-- Google Analytics -->

	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-7057191-1']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>	
</head>
<body style="margin:0">
<iframe 
        src="https://be.mobminder.com/e-reservation.php?p=<?=$r[0]?>" 
        width="100%"
        height="100%"
        scrolling="auto"
        frameborder="0" >
</iframe>
</body>
</html>