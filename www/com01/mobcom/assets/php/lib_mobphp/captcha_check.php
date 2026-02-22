<?php
	
function captcha_check($caid, $cach) {
	
	// $caid (captcha id) gives the id of the question, each question has a different right answer number.
	// $cach (captcha choice) gives the number of the chosen answer at surfer side.
	
	$capok = false; 
	switch($caid) { // check the captcha
		case 0: $capok = ($cach==5); break; // answers can have values 1 to 5, if 0 was received, the captcha has not been clicked.
		case 1: $capok = ($cach==1); break;
		case 2: $capok = ($cach==4); break;
		case 3: $capok = ($cach==3); break;
		case 4: $capok = ($cach==2); break;
		case 5: $capok = ($cach==5); break;
		case 6: $capok = ($cach==4); break;
		case 7: $capok = ($cach==2); break;
		case 8: $capok = ($cach==2); break;
		case 9: $capok = ($cach==1); break;
	}
	return $capok; // returns true when right answer was chosen
}


?>