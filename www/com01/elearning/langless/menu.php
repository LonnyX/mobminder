<header id="topmenu" class="">

	<?php

		$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
		$host = $_SERVER['HTTP_HOST'];
		$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
		$icount = count($subfolders);
		$filename = $subfolders[$icount-1];
	?>

	<div class="menu-banner slightwhite">
			<span><a class="mob-txt-gray_d" href="./single.php"><i class="fa fa-square mob-txt-lime"></i><?= X('top_menu_1','index') ?></a></span>
			<span><a class="mob-txt-gray_d" href="./multi.php"><i class="fa fa-layer-group mob-txt-lime"></i><?= X('top_menu_2','index') ?></a></span>
			<span><a class="mob-txt-gray_d" href="./touch.php"><i class="fa fa-mobile-alt mob-txt-lime"></i><?= X('top_menu_3','index') ?></a></span>
	</div>
	<div>
		<input type="checkbox" id="nav-toggle" class="checkbox_toggle">
		<nav class="list l-left">
			<ul>
				<li><a class="white" href="./single.php"><i class="icone fa fa-square white"></i><?= X('top_menu_1','index') ?></a></li>
				<li><a class="white" href="./multi.php"><i class="icone fa fa-layer-group white"></i><?= X('top_menu_2','index') ?></a></li>
				<li><a class="white" href="./touch.php"><i class="icone fa fa-mobile-alt white"></i><?= X('top_menu_3','index') ?></a></li>
			</ul>
		</nav>
		<label for="nav-toggle" class="toggle-label nav-toggle-label"> 
			<i class="fa fa-bars fa-1d5x mob-txt-lime"></i>
		</label>
	</div>

	<div>
		<input type="checkbox" id="lang-toggle" class="checkbox_toggle"> 
		<nav class="list l-right">
			<ul>
				<li><a class="white" href="../fr/<?= $filename ?>">Français</a></li>
				<li><a class="white" href="../en/<?= $filename ?>">English</a></li>
				<li><a class="white" href="../nl/<?= $filename ?>">Nederlands</a></li>

			</ul>
		</nav>
		<label for="lang-toggle" class="toggle-label lang-toggle-label"> 
			<span class="mob-txt-gray_d"><?=$l?></span>
			<i class="fa fa-globe fa-1d5x mob-txt-lime"></i>
		</label>
	</div>
</header> <!-- section top-menu -->

