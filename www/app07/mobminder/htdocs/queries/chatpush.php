<?php
//////////////////////////////////////////////////////////////////////
//
//   C O M E T     M O D E     C H A T   -  PVH 2021 - Not Used !! we rely only on polling to chatdog.php
//
//   This file implements real time communication with client side
//   This script stays sleeping for a given period, than dies every once in a while
//   See also ./chatdog.php
//
require '../classes/ajax_session.php';

C_dS_connection::keepalive();
session_write_close();  // <= the session file is un-locked (no more writing possible to session file)

// Rule the poll/push timing
//
if($test=1) {
	$lap = 1;  // polling rate in seconds
	$cycles = 30; // total polling before giving back hand to client 
	
} else {
	$lap = 2;  // polling rate in seconds
	$cycles = 60; // total polling before giving back hand to client
}
set_time_limit(($cycles*$lap)+100); // e.g. 3 x 150 = 300 seconds or 5 minutes

// Check the situation before waiting for changes
//
$p = new C_chat_peek_smapp($loginId);
$phytotal = $p->phytotal; // initial number of phylactaries in the conversations where this login is participant
$partotal = $p->partotal; // initial number of phylactaries in the conversations where this login is participant
$timelaps = 0;
echo chr(10);

while($cycles--) { // the script will end when the cycles are over

	// Recursive/polling code comes here (re-executed every $lap seconds)
	//
	$p = new C_chat_peek_smapp($loginId);
	if($phytotal != $p->phytotal) die('<data>'.implode($nl,$p->stream()).'</data>'); // phylacteries total has changed
	if($partotal != $p->partotal) die('<data>'.implode($nl,$p->stream()).'</data>'); // chat version has changed
	
	////////////////////// do not remove the sleep below, it maintains the php thread running
	$timelaps+=$lap;
	sleep($lap);  
}
die(chr(10).'Ended up after '.$timelaps.' seconds without change noticed on chats scope');
?>