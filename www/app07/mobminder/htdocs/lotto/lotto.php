<?php
$systemLog = 'spoofy.php';
require './lotto_lib.php';



////////////////////////////////////////////////////////////////////////////
//
// set up a couple of play grids scenarios
//
//

$scenarios = Array();


$iplay[1] = new L_grid('multi 15 / 1', Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15));
$iplay[2] = new L_grid('multi 15 / 2', Array(16,17,18,19,20,21,22,23,24,25,26,27,28,29,30));
$iplay[3] = new L_grid('multi 15 / 3', Array(31,32,33,34,35,36,37,38,39,40,41,42,43,44,45));

$scenario_1 = new L_scenario('M u l t i  -  1 5 x 3', $iplay);



// here we play 4 x a 10 cross bulletin (256€/bulletin = +/- 1000€ / week)
$played[1] = new L_grid('multi 10 / 1', Array(1,2,3,4,5,6,7,8,9,10));
$played[2] = new L_grid('multi 10 / 2', Array(11,12,13,14,15,16,17,18,19,20));
$played[3] = new L_grid('multi 10 / 3', Array(21,22,23,24,25,26,27,28,29,30));
$played[4] = new L_grid('multi 10 / 4', Array(31,32,33,34,35,36,37,38,39,40));

$scenario_2 = new L_scenario('4 x a 10 cross bulletin', $played);





////////////////////////////////////////////////////////////////////////////
//
// simulating multiple games over time, using same played grids
//
//

$weeklaps = 1000;
$games = new L_games($weeklaps);



//////////////////////////////////////////////////////
//
//  Analyzing the results (twisting $wsels with played grids)
//
// 

$out .= $scenario_1->assess($games);
$out .= $scenario_2->assess($games);



echo html($out);
?>