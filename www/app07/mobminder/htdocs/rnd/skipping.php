<?php
	$br = '<br/>';
	echo 'SKIPPING REGISTERS !'.$br;
	
	
	// $r1 = 0x1;
	// echo $r1.$br;
	
	// $r2 = 0b1;
	// echo $r2.$br;
	
	// $r3 = 0b1111;
	// $r4 = 0xF;
	// echo $r3.' ?=? '.$r4.$br;
	
	// $r3 = 0b11111111;
	// $r4 = 0xFF;
	// echo $r3.' ?=? '.$r4.$br;
	
	// $r1 = 0b10000000;
	// $r2 = 0x80;
	// echo $r1.' ?=? '.$r2.$br;
	
	$rs1 =  0b00000000; $rs2 =  0b00000000;
	$readvalue = 300;
	if($readvalue > 290) $rs1 |=  0b10000000;
	if($readvalue > 310) $rs2 |=  0b10000000;
	$x = 1;
	echo 't'.$x.':'.$rs1.' => '.($rs1>0?'On':'Off').$br;
	
	for($x = 2; $x<4; $x++) {
		$rs1 >>= 1;
		echo 't'.$x.':'.$rs1.' => '.($rs1>0?'On':'Off').$br;
	}
	
	$readvalue = 292;
	if($readvalue > 290) $rs1 |=  0b10000000;
	echo 't'.$x.':'.$rs1.' => '.($rs1>0?'On':'Off').$br;
	
	for(; $x<14; $x++) {
		$rs1 >>= 1;
		echo 't'.$x.':'.$rs1.' => '.($rs1>0?'On':'Off').$br;
	}
	
	echo '------------------';
	
	
?>