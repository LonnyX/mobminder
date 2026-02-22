<header id="stickymenu">

<?php

$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$icount = count($subfolders);
$filename = $subfolders[$icount-1];

$planpathprice = 'index.php#before_plan';
if ($filename=='pay.php') $planpathprice = 'pay.php#before_plan';

$planpathcontact = 'index.php#contactbanner';
if ($filename=='pay.php') $planpathcontact = 'pay.php#contactbanner';

$displaylanglabel = 'display:block;';
if ($filename=='directory.php' || $filename == 'offremedinect.php') $displaylanglabel = 'display:none;';

?>

	<div id="topmenu" class="">
		<div class="menu-banner slightwhite_a mob-txt-gray_d">
			<span class="cta-menu"><a a href="./trynow.php"><?= X('button_CTA1','main') ?></a></span>
			<!-- <span><a href="tel:+3228809787" onclick="gtag('event', 'phone call', {'send_to': 'UA-131132262-1', 'event_category': 'lead','event_label': 'phone call menu'});"><i class="fa fa-phone mob-txt-lime"></i><span class="hidden-txt">+32 (0)2 880 97 87</span></a></span> gtag('event', 'conversion', {'send_to': 'AW-966604247/jcYnCObvl4cDENfr9MwD'}); -->
			<a href="tel:+3228809787" onclick="gtag('event', 'phone call', {'send_to': 'G-T0V62NCJFH', 'event_category': 'lead','event_label': 'phone call menu'});"><span class="phone-menu"><i class="fa fa-phone mob-txt-lime"></i><span class="hidden-txt hidden-phone">&nbsp;+32 (0)2 880 97 87</span></span></a> <!--gtag('event', 'conversion', {'send_to': 'AW-966604247/jcYnCObvl4cDENfr9MwD'}); -->
			<span><a href="<?= $planpathcontact ?>"><i class="fa fa-handshake mob-txt-lime"></i><span class="hidden-txt"><?= X('top_menu_1','main') ?></span></a></span>
			<span><a href="<?= $planpathprice ?>"><i class="fa fa-tag mob-txt-lime"></i><?= X('top_menu_2','main') ?></a></span>
			<span><a href="./features.php"><i class="fa fa-cogs mob-txt-lime"></i><?= X('top_menu_3','main') ?></a></span>
			<span><a href="./about.php"><i class="fa fa-users mob-txt-lime"></i><?= X('top_menu_4','main') ?></a></li>
		</div>
		<!-- <div class="cta-menu">
            <a a href="./trynow.php"><?= X('button_CTA1','main') ?></a>
        </div> -->
		<div>
			<input type="checkbox" id="nav-toggle" class="checkbox_toggle">
			<nav class="list l-left">
				<ul>
					<li><a class="white" href="<?= $planpathcontact ?>"><i class="icone fa fa-handshake white hidden-faws"></i><?= X('top_menu_1','main') ?></a></li>
					<li><a class="white" href="<?= $planpathprice ?>"><i class="icone fa fa-tag white hidden-faws"></i><?= X('top_menu_2','main') ?></a></li>
					<li><a class="white" href="./features.php"><i class="icone fa fa-cogs white hidden-faws"></i><?= X('top_menu_3','main') ?></a></li>
					<li><a class="white" href="./about.php"><i class="icone fa fa-users white hidden-faws"></i><?= X('top_menu_4','main') ?></a></li> 
					<!-- <li><a class="white" href="#"><i class="icone fa fa-question white"></i>FAQ</a></li> -->
					
					<li><a class="white" href="./index.php"><i class="icone fa fa-home white hidden-faws"></i><?= X('top_menu_5','main') ?></a></li>
				</ul>
			</nav>
			<label for="nav-toggle" class="toggle-label nav-toggle-label"> 
				<i class="fa fa-bars fa-1d5x mob-txt-lime"></i>
			</label>
		</div>
		<div style="<?= $displaylanglabel ?>">
			<input type="checkbox" id="lang-toggle" class="checkbox_toggle"> 
			<nav class="list l-right">
				<ul>
					<li><a class="white" href="../fr/<?= $filename ?>">Français</a></li>
					<li><a class="white" href="../en/<?= $filename ?>">English</a></li>
					<li><a class="white" href="../nl/<?= $filename ?>">Nederlands</a></li>
					<li><a class="white" href="../es/<?= $filename ?>">Español</a></li>

				</ul>
			</nav>
			<label for="lang-toggle" class="toggle-label lang-toggle-label">
				<span class="mob-txt-lime bold" style="font-size:20px;"><?=$l?></span>
				<!-- <i class="fa fa-globe fa-1d5x mob-txt-lime"></i> -->
			</label>
		</div>
	</div> <!-- section top-menu -->
</header> <!-- section top-menu -->
<div class="menu-banner"></div>
