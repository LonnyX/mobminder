<?php
///////////////////////////////////////////////////////////////////////////////////
//
//  Smartphone installation wizard - landing page
//

require './welcome.php';



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page h1 Title

$html->pageTitle('Smartphone App');

$icon = '<div class="fa fa-2x fa-mobile" style="color:steelblue; text-align:left; display:inline-block; padding-right:.5em;"></div>';
$title = '<h1 style="color:white; padding-bottom:.5em; padding-top:.2em;">'.$icon.'Smartphone installer'.'</h1>';
$html->pushHTML('<section class="s-h1 minder-background" style="margin-bottom:2em;" id="s-h1">'.$title.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page main image
//

$img = '<img src="../themes/logos/mobminder-logo-800-336.gif" style="vertical-align:top; height:auto; max-width:100%; max-height:150px;"/>';
$img = '<div style="text-align:center;">'.$img.'</div>'; 
$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Main info zone

// $info = '<h2>'.L::XL('cronofy info').'</h2>';


	$p = Array();
		$p[] = '<h1 class="pad">Ready to install mobminder on your smartphone?</h1>';
		
	$div = '<div class="container">'.implode('',$p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Compatibility icons zone

			$i3 = '<td colspan=3><h2>Please confirm the device OS you are using</h2></td>';
		$row0 = '<tr style="border-bottom:1em solid transparent;">'.$i3.'</tr>';

				$android 	= '<div class="fab fa-4x fa-android" style="text-align:left; display:inline-block;"></div>';
				$apple 		= '<div class="fab fa-4x fa-apple" style="text-align:left; display:inline-block;"></div>';
		
			$n = '<td id="googl_icon" class="interactive" style="padding:1em;">'.$android.'</td>';
			$a = '<td id="apple_icon" class="interactive" style="padding:1em;">'.$apple.'</td>';
		$row1 = '<tr style="text-align:center;" class="mindercolor">'.$n.$a.'</tr>';

			$android 	= '<td id="googl_caption" class="interactive" style="width:50%;">Android</td>';
			$google 	= '<td id="apple_caption" class="interactive" style="width:50%;">Apple</td>';
		$row2 = '<tr style="text-align:center; color:steelblue;" class="bigger">'.$android.$google.'</tr>';
		
		
	$table = '<table style="width:100%; margin: 0 auto; border:3em solid transparent;">'.$row0.$row1.$row2.'</table>';

$icons = '<div class="container">'.$table.'</div>';


$html->pushHTML('<section class="s-compatibility" id="s-compatibility">'.$icons.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// js

$html->pushJavaScript('

$(document).ready( 

	function(){
		// document.domain = "mobminder.com";
		
		$("#googl_icon").click( function(){ onos("ANDROID")} );
		$("#apple_icon").click( function(){ onos("IOS")} );
		
		$("#googl_caption").click( function(){ onos("ANDROID")} );
		$("#apple_caption").click( function(){ onos("IOS")} );
		
	});
	
	onos = function(os) { 
					console.log(os);
					if(os=="ANDROID") href = "https://play.google.com/store/apps/details?id=com.mobminder.agenda";
					if(os=="IOS") href = "https://apps.apple.com/us/app/id1530813844";
					
					window.location.href=href;
				}
');



pushfooter();
$html->dropPage(); // sets the font

?>