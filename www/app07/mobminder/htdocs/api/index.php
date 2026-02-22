<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   Q U E R Y    C O N F I G U R A T I O N
//

require '../classes/language.php';
require '../../lib_mobphp/dbio.php';
require './apilib.php';


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/api/query/config.php?lgn=kbh4d&pwd=kbh4d&kid=23609&web=1
// 		http://localhost/api/documents/specifications.php?lgn=kbh4d&pwd=kbh4d&kid=23609&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$_REQUEST['web'] = 1;
setrendermode('./api.css');


h1('Welcome to the Mobminder api landing page');


endrendermode();
?>