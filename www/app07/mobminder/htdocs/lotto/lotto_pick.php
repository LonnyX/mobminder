<?php
$systemLog = 'spoofy.php';
require './lotto_lib.php';




$pick = new L_pick(4);
$boxes = '';

foreach($pick->grids as $x => $grid) {
	$boxes.= '<div style="">'.$grid->display('g_'.$x).'</div>';
	
}
$out .= '<div style="display:flex; flex-wrap: wrap; justify-content: center;">'.$boxes.'</div>';



echo html($out);
?>