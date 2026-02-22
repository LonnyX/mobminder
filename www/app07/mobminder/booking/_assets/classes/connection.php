<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Closing connection with calling client
//
//  This is used in some script to avoid the KEEP_ALIVE to maintain numerous 
//  apache2 childs working for the default KEEP_ALIVE time.
//
//  >>>>>>  ob_start();  // this instruction MUST stand before any echo proceeds from the script (*ob1)
//  new simplified closeconnection due to ios18 safari issue
//  no need of sending minimal 4096 characters
//  simply force browser to close connection and prevent sending echo after call to close connection
function closeconnection($tempo = false, $verbose = true) { // $tempo in milliseconds, 50 for 50ms

	if($tempo) usleep(1000*$tempo);
	
	// close current session (!!! you need to start an ob_start() at the top of the script, before any echo runs !!!)
	// in order to get the stuff working, here is what I did :
	if(session_id()) session_write_close();
	if($verbose) echo chr(10).'Closing connection.';
	$fb = ob_get_contents(); 
	$fl = strlen($fb);
	ob_end_clean();
	ob_start(); 
    ignore_user_abort(true); 
	header('Content-Length: '.$fl); 
    header('Connection: close'); 
	echo $fb;
	ob_end_flush(); // 3.
	ob_flush(); //TEST
	flush(); //TEST
	ob_start(); // catch any subsequent echo, that we will never flush to client
	if($verbose) echo chr(10).'Connection closed (You never see this message)';
}

?>