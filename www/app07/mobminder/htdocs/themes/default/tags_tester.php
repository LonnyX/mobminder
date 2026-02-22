<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     T A G S   C S S    T E S T 
//
//


//////////////////////////////////////////////////////////////////////
//
//    W E B    R E N D E R 
//
//


$web = true; $nl = chr(10);
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$split = Explode('/', $pathfile);
		$splitcont = count($split);
	$scriptname 	= $split[$splitcont - 1]; 
	$scriptfolder 	= $split[$splitcont - 2]; if($scriptfolder) $scriptfolder = '/'.$scriptfolder;
	if($splitcont<=3) $scopefolder = ''; else $scopefolder = $split[$splitcont - 3]; 
	if($scopefolder) $scopefolder = '/'.$scopefolder;
	$script = $scopefolder.$scriptfolder.'/'.$scriptname;
		




///////////////////////////////////////////////////////////////////////////////////////

echo '<!DOCTYPE HTML>';
echo '<html>';
echo '<head>';
echo '<title>'.$scriptfolder.'/'.$scriptname.'</title>';
echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
echo '<meta http-equiv="pragma" content="no-cache">';
echo '<link href="./tags.css?v=1" rel="stylesheet" type="text/css">';
echo '<link href="../fonts/faws.css" rel="stylesheet" type="text/css">';
echo '</head>';
echo '<body>';
echo '<h1>You are executing '.$scopefolder.$scriptfolder.'/'.$scriptname.'</h1>';





function compare($c, $v) {
	$r = '<td><div style="padding-left:2em; color:red;" class="fa-2x '.$c.'"></div></td>'.'<td><div style="color:green;" class="fa-2x fa '.$v.'"></div></td>';
	return $r;
}
function opentr() {
	return '<tr style="background:#ddd; border:1px solid grey; padding:1em; margin-bottom:1em;">';
}

echo '<h2>V I S I T O R S   /   A P P O I N T M E N T S   /  T A S K S    /  N O T E S </h2>';

/* visitors, apps, tasks, notes */
/* flask-poison, phone-slash, poo, toolbox, calendar-edit, photo-video, wrench, head-side-mask, virus, sunglasses, allergies
, people-arrows, user-injured, user-check */


echo '<table>';

echo opentr();
echo compare('fa fa-male','t1001').compare('fa fa-tooth','t1010').compare('fa fa-grin','t1020')			.compare('fa fa-ban','t1024').compare('fa fa-warning','t1027').compare('fa fa-at','t1028').compare('fa fa-birthday-cake','t1008').compare('fa fa-cat','t1070');
echo '</tr>';

echo opentr();
echo compare('fa fa-female','t1002').compare('fa fa-wheelchair','t1011').compare('fa fa-smile','t1021').compare('fa fa-calculator','t1031').compare('fa fa-closed-captioning','t1041').compare('fa fa-stethoscope','t1051').compare('fa fa-venus','t1061').compare('fa fa-dog','t1071');
echo '</tr>';

echo opentr();
echo compare('fa fa-child','t1003').compare('fa fa-eye','t1012').compare('fa fa-frown','t1022')			.compare('fa fa-calendar','t1032').compare('fab fa-cc-mastercard','t1042').compare('fa fa-thumbs-up','t1025').compare('fa fa-mars','t1062').compare('fa fa-crow','t1072');
echo '</tr>';

echo opentr();
echo compare('fa fa-users','t1004').compare('fa fa-heartbeat','t1013').compare('fa fa-meh','t1023')		.compare('fa fa-paperclip','t1033').compare('fa fa-sync','t1043').compare('fa fa-thumbs-down','t1026').compare('fa fa-venus-mars','t1063').compare('fa fa-horse','t1073');
echo '</tr>';

echo opentr();
echo compare('fa fa-person-carry','t1000').compare('fa fa-ear','t1014').compare('fa fa-flushed','t1124').compare('fa fa-pencil','t1034').compare('fab fa-cc-visa','t1044').compare('fa fa-hand-point-up','t1054').compare('fa fa-venus-double','t1064').compare('fa fa-ram','t1074');
echo '</tr>';

echo opentr();
echo compare('fa fa-user','t1005').compare('fa fa-link','t1015').compare('fa fa-grimace','t1125')		.compare('fa fa-tag','t1035').compare('fa fa-credit-card','t1045').compare('fa fa-university','t1055').compare('fa fa-mars-double','t1065').compare('fa fa-monkey','t1075');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-md','t1006').compare('fa fa-smoking','t1016').compare('fa fa-angry','t1126')	.compare('fa fa-biohazard','t1036').compare('fa fa-money-bill','t1046').compare('fa fa-flask','t1057').compare('fa fa-mercury','t1066').compare('fa fa-cow','t1076');
echo '</tr>';

echo opentr();
echo compare('fa fa-baby','t1007').compare('fa fa-utensils','t1017').compare('fa fa-dizzy','t1127')		.compare('fa fa-envelope','t1037').compare('fa fa-euro-sign','t1047').compare('fa fa-tablet-alt','t1069').compare('fa fa-transgender','t1067').compare('fa fa-pig','t1077');
echo '</tr>';

echo opentr();
echo compare('fa fa-procedures','t1108').compare('fa fa-wine-glass-alt','t1018').compare('fa fa-grin-beam-sweat','t1128').compare('fa fa-edit','t1038').compare('fa fa-dollar-sign','t1048').compare('fa fa-phone','t1058').compare('fa fa-neuter','t1068').compare('fa fa-fish','t1078');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-friends','t1109').compare('fa fa-pills','t1019').compare('fa fa-smile-wink','t1129').compare('fa fa-camera-alt','t1039').compare('fa fa-ticket-alt','t1049').compare('fa fa-mobile-alt','t1059').compare('fa fa-recycle','t1056').compare('fa fa-rabbit','t1079');
echo '</tr>';

echo opentr();
echo compare('fa fa-street-view','t1100').compare('fa fa-kidneys','t1110').compare('fa fa-grin-alt','t1120').compare('fa fa-coffin','t1130').compare('fa fa-file-signature','t1140').compare('fa fa-sms','t1150').compare('fa fa-yin-yang','t1160').compare('fa fa-unicorn','t1170');
echo '</tr>';

echo opentr();
echo compare('fa fa-people-arrows','t1101').compare('fa fa-virus','t1111').compare('fa fa-toolbox','t1121').compare('fa fa-calendar-edit','t1131').compare('fa fa-photo-video','t1141').compare('fa fa-phone-office','t1151').compare('fa fa-head-side-mask','t1161').compare('fa fa-snake','t1171');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-check','t1102').compare('fa fa-allergies','t1112').compare('fa fa-user-injured','t1122').compare('fa fa-sunglasses','t1132').compare('fa fa-wrench','t1142').compare('fa fa-phone-slash','t1152').compare('fa fa-analytics','t1162').compare('fa fa-turtle','t1172');
echo '</tr>';

echo '</table>';




echo '<h2>A C C O U N T S  </h2>';


/* accounts */

/* ambulance, cars, plane, shopping-cart, car-building, shuttle-van, toolbox, sunglasses */


echo '<table>';
echo opentr();
echo compare('fa fa-home','t3000').compare('fa fa-tooth','t3010')				.compare('fa fa-person-booth','t3020').compare('fa fa-times-square','t3030').compare('fa fa-lock-open-alt','t3040');
echo '</tr>';

echo opentr();
echo compare('fa fa-industry-alt','t3001').compare('fa fa-wheelchair','t3011').compare('fa fa-chalkboard-teacher','t3021').compare('fa fa-times-octagon','t3031').compare('fa fa-lock-alt','t3041');
echo '</tr>';

echo opentr();
echo compare('fa fa-hospital-alt','t3002').compare('fa fa-medkit','t3012')		.compare('fa fa-car-mechanic','t3022').compare('fa fa-exclamation-triangle','t3032').compare('fa fa-arrow-square-up','t3042');
echo '</tr>';

echo opentr();
echo compare('fa fa-hospital','t3003').compare('fa fa-user-graduate','t3013')	.compare('fa fa-bicycle','t3023').compare('fa fa-exclamation-circle','t3033').compare('fa fa-comments','t3043');
echo '</tr>';

echo opentr();
echo compare('fa fa-building','t3004').compare('fa fa-user-secret','t3014')		.compare('fa fa-paw','t3024').compare('fa fa-pause','t3034').compare('fa fa-glasses','t3044');
echo '</tr>';

echo opentr();
echo compare('fa fa-city','t3005').compare('fa fa-user-md','t3015')				.compare('fa fa-balance-scale-left','t3025').compare('fa fa-recycle','t3035').compare('fa fa-ruler-triangle','t3055');
echo '</tr>';

echo opentr();
echo compare('fa fa-hotel','t3006').compare('fa fa-head-vr','t3016')			.compare('fa fa-spa','t3026').compare('fa fa-minus-square','t3036').compare('fa fa-highlighter','t3066');
echo '</tr>';

echo opentr();
echo compare('fa fa-landmark','t3007').compare('fa fa-low-vision','t3017')		.compare('fa fa-cut','t3027').compare('fa fa-stop-circle','t3037').compare('fa fa-handshake','t3077');
echo '</tr>';

echo opentr();
echo compare('fa fa-car-building','t3008').compare('fa fa-user-hard-hat','t3018').compare('fa fa-ambulance','t3028').compare('fa fa-weight','t3038').compare('fa fa-brain','t3048');
echo '</tr>';

echo opentr();
echo compare('fa fa-cars','t3009').compare('fa fa-toolbox','t3019')				.compare('fa fa-shuttle-van','t3029').compare('fa fa-heartbeat','t3039').compare('fa fa-baby','t3049');
echo '</tr>';

echo '</table>';


echo '<h2>R E S O U R C E S  </h2>';


/* resources */
/* head-side-headphones, toolbox, user-hard-hat, people-arrows, users-medical, user-headset */



echo '<table>';
echo opentr();
echo compare('fa fa-user','t4000').compare('fa fa-tooth','t4010').compare('fa fa-person-booth','t4020').compare('fa fa-truck','t4030').compare('fa fa-lock-open-alt','t4040');
echo '</tr>';

echo opentr();
echo compare('fa fa-users','t4001').compare('fa fa-eye','t4011').compare('fa fa-booth-curtain','t4021').compare('fa fa-car','t4031').compare('fa fa-lock-alt','t4041');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-md','t4002').compare('fa fa-ear','t4012').compare('fa fa-users-class','t4022').compare('fa fa-taxi','t4032').compare('fa fa-flask','t4042');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-tie','t4003').compare('fa fa-lungs','t4013').compare('fa fa-user-chart','t4023').compare('fa fa-digital-tachograph','t4033').compare('fa fa-vials','t4043');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-cog','t4004').compare('fa fa-stomach','t4014').compare('fa fa-chalkboard-teacher','t4024').compare('fa fa-car-mechanic','t4034').compare('fa fa-glasses','t4044');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-plus','t4005').compare('fa fa-heartbeat','t4015').compare('fa fa-chair','t4025').compare('fa fa-recycle','t4035').compare('fa fa-hammer','t4045');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-tag','t4006').compare('fa fa-brain','t4016').compare('fa fa-chair-office','t4026').compare('fa fa-comments-alt','t4036').compare('fa fa-syringe','t4046');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-lock','t4007').compare('fa fa-briefcase','t4017').compare('fa fa-person-carry','t4027').compare('fa fa-charging-station','t4037').compare('fa fa-handshake','t4047');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-hard-hat','t4008').compare('fa fa-users-medical','t4018').compare('fa fa-projector','t4028').compare('fa fa-weight','t4038').compare('fa fa-user-nurse','t4048');
echo '</tr>';

echo opentr();
echo compare('fa fa-people-arrows','t4009').compare('fa fa-user-headset','t4019').compare('fa fa-shuttle-van','t4029').compare('fa fa-heartbeat','t4039').compare('fa fa-baby','t4049');
echo '</tr>';

echo '</table>';



echo '<h2>W O R K   C O D E S </h2>';


echo '<table>';
echo opentr();
echo compare('fa fa-car-side','t6000').compare('fa fa-tooth','t6010').compare('fa fa-id-card','t6020').compare('fa fa-times-square','t6030').compare('fa fa-cut','t6040').compare('fa fa-monitor-heart-rate','t6050').compare('fa fa-street-view','t6060');
echo '</tr>';

echo opentr();
echo compare('fa fa-home','t6001').compare('fa fa-eye','t6011').compare('fa fa-file-invoice','t6021').compare('fa fa-radiation','t6031').compare('fa fa-car-mechanic','t6041').compare('fa fa-phone-volume','t6051').compare('fa fa-user','t6061');
echo '</tr>';

echo opentr();
echo compare('fa fa-hospital-alt','t6002').compare('fa fa-ear','t6012').compare('fa fa-file-signature','t6022').compare('fa fa-exclamation-triangle','t6032').compare('fa fa-scalpel-path','t6042').compare('fa fa-chalkboard-teacher','t6052').compare('fa fa-users','t6062');
echo '</tr>';

echo opentr();
echo compare('fa fa-hospital','t6003').compare('fa fa-lungs','t6013').compare('fa fa-ballot-check','t6023').compare('fa fa-at','t6033').compare('fa fa-eye-dropper','t6043').compare('fa fa-shipping-fast','t6053').compare('fa fa-user-tie','t6063');
echo '</tr>';

echo opentr();
echo compare('fa fa-chair','t6004').compare('fa fa-stomach','t6014').compare('fa fa-layer-plus','t6024').compare('fa fa-arrow-square-up','t6034').compare('fa fa-stethoscope','t6044').compare('fa fa-tasks','t6054').compare('fa fa-female','t6064');
echo '</tr>';

echo opentr();
echo compare('fa fa-chair-office','t6005').compare('fa fa-heartbeat','t6015').compare('fa fa-file-prescription','t6025').compare('fa fa-map-marker-plus','t6035').compare('fa fa-video','t6045').compare('fa fa-hammer','t6055').compare('fa fa-child','t6065');
echo '</tr>';

echo opentr();
echo compare('fa fa-briefcase','t6006').compare('fa fa-brain','t6016').compare('fa fa-notes-medical','t6026').compare('fa fa-minus-square','t6036').compare('fa fa-highlighter','t6046').compare('fa fa-hands-helping','t6056').compare('fa fa-baby','t6066');
echo '</tr>';

echo opentr();
echo compare('fa fa-procedures','t6007').compare('fa fa-hand-paper','t6017').compare('fa fa-file-medical-alt','t6027').compare('fa fa-stop-circle','t6037').compare('fa fa-prescription-bottle','t6047').compare('fa fa-handshake','t6057').compare('fa fa-restroom','t6067');
echo '</tr>';

echo opentr();
echo compare('fa fa-warehouse-alt','t6008').compare('fa fa-kidneys','t6018').compare('fa fa-envelope','t6028').compare('fa fa-exclamation','t6038').compare('fa fa-pen','t6048').compare('fa fa-weight','t6058').compare('fa fa-user-friends','t6068');
echo '</tr>';

echo opentr();
echo compare('fa fa-flask-poison','t6009').compare('fa fa-virus','t6019').compare('fa fa-toolbox','t6029').compare('fa fa-calendar-edit','t6039').compare('fa fa-photo-video','t6049').compare('fa fa-head-side-mask','t6059').compare('fa fa-people-arrows','t6069');
echo '</tr>';

echo opentr();
echo compare('fa fa-syringe','t6100').compare('fa fa-allergies','t6200').compare('fa fa-phone-slash','t6300').compare('fa fa-sunglasses','t6400').compare('fa fa-wrench','t6500').compare('fa fa-user-injured','t6600').compare('fa fa-user-check','t6700');
echo '</tr>';
echo '</table>';






echo '<h2>T I M E   B O X I N G </h2>';


/* timeboxing */
/* bells, comment-exclamation, history, inbox-in, inbox-out, random, redo, repeat-1, download, upload, wrench, people-arrows */



echo '<table>';
echo opentr();
echo compare('fa fa-car-side','t5000').compare('fa fa-child','t5010').compare('fa fa-person-booth','t5020').compare('fa fa-hourglass-half','t5030').compare('fa fa-highlighter','t5040').compare('fa fa-recycle','t5050');
echo '</tr>';

echo opentr();
echo compare('fa fa-home','t5001').compare('fa fa-baby','t5011').compare('fa fa-hammer','t5021').compare('fa fa-play','t5031').compare('fa fa-coffee','t5041').compare('fa fa-shapes','t5051');
echo '</tr>';

echo opentr();
echo compare('fa fa-hospital-alt','t5002').compare('fa fa-users','t5012').compare('fa fa-car-mechanic','t5022').compare('fa fa-stop','t5032').compare('fa fa-chalkboard-teacher','t5042').compare('fa fa-info','t5052');
echo '</tr>';

echo opentr();
echo compare('fa fa-hospital','t5003').compare('fa fa-user-tie','t5013').compare('fa fa-medkit','t5023').compare('fa fa-infinity','t5033').compare('fa fa-glass-cheers','t5043').compare('fa fa-exclamation-triangle','t5053');
echo '</tr>';

echo opentr();
echo compare('fa fa-chair','t5004').compare('fa fa-user-friends','t5014').compare('fa fa-stethoscope','t5024').compare('fa fa-pause','t5034').compare('fa fa-phone-volume','t5044').compare('fa fa-lightbulb-exclamation','t5054');
echo '</tr>';

echo opentr();
echo compare('fa fa-person-carry','t5005').compare('fa fa-user-md','t5015').compare('fa fa-balance-scale','t5025').compare('fa fa-stopwatch','t5035').compare('fa fa-lock-open-alt','t5045').compare('fa fa-ban','t5055');
echo '</tr>';

echo opentr();
echo compare('fa fa-procedures','t5006').compare('fa fa-users-cog','t5016').compare('fa fa-spa','t5026').compare('fa fa-watch','t5036').compare('fa fa-lock-alt','t5046').compare('fa fa-arrow-square-up','t5056');
echo '</tr>';

echo opentr();
echo compare('fa fa-warehouse-alt','t5007').compare('fa fa-users-class','t5017').compare('fa fa-video','t5027').compare('fa fa-sync','t5037').compare('fa fa-handshake','t5047').compare('fa fa-at','t5057');
echo '</tr>';

echo opentr();
echo compare('fa fa-school','t5008').compare('fa fa-user-clock','t5018').compare('fa fa-laptop','t5028').compare('fa fa-clock','t5038').compare('fa fa-hands','t5048').compare('fa fa-tasks','t5058');
echo '</tr>';

echo opentr();
echo compare('fa fa-inbox-in','t5009').compare('fa fa-users-medical','t5019').compare('fa fa-projector','t5029').compare('fa fa-redo','t5039').compare('fa fa-random','t5049').compare('fa fa-bells','t5059');
echo '</tr>';

echo opentr();
echo compare('fa fa-inbox-out','t5100').compare('fa fa-user-headset','t5200').compare('fa fa-shuttle-van','t5300').compare('fa fa-repeat-1','t5400').compare('fa fa-baby','t5500').compare('fa fa-comment-exclamation','t5600');
echo '</tr>';

echo '</table>';



/* logins */

echo '<h2>L O G I N S</h2>';

echo '<table>';
echo opentr();
echo compare('fa fa-user','t7000').compare('fa fa-user-headset','t7010').compare('fa fa-user-friends','t7020').compare('fa fa-smile','t7030')				.compare('fa fa-heart','t7040').compare('fa fa-key','t7050').compare('fa fa-paw','t7060').compare('fa fa-tooth','t7070');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-times','t7001').compare('fa fa-user-shield','t7011').compare('fa fa-users','t7021').compare('fa fa-grin','t7031')					.compare('fa fa-spade','t7041').compare('fa fa-sunglasses','t7051').compare('fa fa-anchor','t7061').compare('fa fa-medkit','t7071');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-check','t7002').compare('fa fa-user-graduate','t7012').compare('fa fa-users-class','t7022').compare('fa fa-grin-tongue-wink','t7032').compare('fa fa-diamond','t7042').compare('fa fa-cocktail','t7052').compare('fa fa-fish','t7062').compare('fa fa-cut','t7072');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-minus','t7003').compare('fa fa-user-md','t7013').compare('fa fa-users-cog','t7023').compare('fa fa-grin-beam','t7033')				.compare('fa fa-club','t7043').compare('fa fa-plane','t7053').compare('fa fa-at','t7063').compare('fa fa-low-vision','t7073');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-cog','t7004').compare('fa fa-user-visor','t7014').compare('fa fa-users-medical','t7024').compare('fa fa-grin-beam-sweat','t7034')	.compare('fa fa-hexagon','t7044').compare('fa fa-gem','t7054').compare('fa fa-gingerbread-man','t7064').compare('fa fa-balance-scale-left','t7074');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-plus','t7005').compare('fa fa-user-chart','t7015').compare('fa fa-people-arrows','t7025').compare('fa fa-kiss-wink-heart','t7035').compare('fa fa-play','t7045').compare('fa fa-thumbtack','t7055').compare('fa fa-apple-alt','t7065').compare('fa fa-car-mechanic','t7075');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-tag','t7006').compare('fa fa-chalkboard-teacher','t7016').compare('fa fa-house-user','t7026').compare('fa fa-laugh-squint','t7036').compare('fa fa-bookmark','t7046').compare('fa fa-paperclip','t7056').compare('fa fa-mask','t7066').compare('fa fa-wheelchair','t7076');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-edit','t7007').compare('fa fa-user-tie','t7017').compare('fa fa-hospital-user','t7027').compare('fa fa-smile-beam','t7037')		.compare('fa fa-star','t7047').compare('fa fa-cube','t7057').compare('fa fa-infinity','t7067').compare('fa fa-head-vr','t7077');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-clock','t7008').compare('fa fa-user-nurse','t7018').compare('fa fa-user-alien','t7028').compare('fa fa-smile-wink','t7038')		.compare('fa fa-comment','t7048').compare('fa fa-flower','t7058').compare('fa fa-spa','t7068').compare('fa fa-glasses','t7078');
echo '</tr>';

echo opentr();
echo compare('fa fa-user-crown','t7009').compare('fa fa-user-cowboy','t7019').compare('fa fa-alien','t7029').compare('fa fa-grin-tongue','t7039')			.compare('fa fa-omega','t7049').compare('fa fa-snowflake','t7059').compare('fa fa-pencil','t7069').compare('fa fa-user-secret','t7079');
echo '</tr>';

echo '</table>';




echo '</body></html>';





?>