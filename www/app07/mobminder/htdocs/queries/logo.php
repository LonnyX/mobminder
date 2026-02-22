<?php
//////////////////////////////////////////////////////////////////////
//
//  Q U E R Y    A    L O G O  
//

$failed = false;

$aid = @$_GET['aid']; if(!isset($aid)) $failed = '001'; // parameters are not passed
$lid = @$_GET['lid']; if(!isset($lid)) $failed = '002';
$kid = @$_GET['kid']; if(!isset($kid)) $failed = '003';
$gid = @$_GET['gid']; if(!isset($gid)) $gid = 0; else $gid = $gid+0; // logo id

$debugmode = 0; // set to 0 when testing or if you want to locate the directory
$host = $_SERVER['HTTP_HOST']; // localhost in dev and be.mobminder.com in production

if(!$failed) { // complete set of parameters was passed

		if(!is_numeric($aid)) die('#error logo00001'); if(strlen($aid)>5) die('#error logo00001b');
		if(!is_numeric($lid)) die('#error logo00002'); if(strlen($lid)>6) die('#error logo00002b');
		if(!is_numeric($kid)) die('#error logo00003'); if(strlen($kid)>6) die('#error logo00003b');
		if(!is_numeric($gid)) die('#error logo00004'); if(strlen($gid)>8) die('#error logo00004b');

	require '../../lib_mobphp/dbio.php'; // this include comes with $nl :)
	if($debugmode)
		echo 'You are in debug mode'.$nl.$nl;

	$test = SQLinjectionScreen($_GET);
	if($test) die('you are banned <command>logoff</command> ('.$test.')');


	if(!$failed) {
		
		$dS_account = new C_dS_group($aid);
		$dS_login 	= new C_dS_login($lid);
		$dS_key = new C_dS_accesskey($kid);

		if($dS_key->id==0&&$dS_login->id==0&&$dS_account->id==0) $failed = '101';
		if($dS_key->accountId != $aid) $failed = '102';
		if($dS_key->groupId != $lid) $failed = '103';
		
		if($debugmode) {
			echo 'Account name:'.$dS_account->name.$nl;
			echo 'aid: '.$aid.$nl;
			echo 'lid: '.$lid.$nl;
			echo 'kid: '.$kid.$nl;
		}
		
		if(!$failed) {
			
			if(!$gid) $gid = $dS_key->hascustomlogo(); // returns a C_dS_logo id, can be a webpage loginid specific logo, or the group generic logo as a fallback, or 0 if none was uploaded
			if($debugmode) echo 'gid: '.$gid.$nl;
			if($gid) {
				$dS_logo = new C_dS_logo($gid);
				if($dS_logo->groupId != $dS_account->id) $failed = '201'; // calling with correct key/lid/aid but random gid
				$filedir = '/mobfiles/_logos/';
				if($host=='localhost') // (you have intentionally preloaded the folder with logos found in production)
					$filedir = 'D:\mobfiles\_logos\\'; // this is where you store logos in dev mode on windows, if your localhost runs on D: instead of C:, please adapt the path
				$filename = $dS_logo->getcodename();
				if($debugmode) echo 'path: '.$filedir.$filename.$nl.$nl;
				
			} else if($dS_login->eresaSkin) { // image chosen among the standard choices 
				$filedir = '../themes/default/e-resa/';
				$filename = $dS_login->eresaSkin.'.jpg';
				
			} else $failed = '301';
			
			// the final test will fail if
			// - your /mobfiles/logos folder is not installed properly at the system root
			// - the file was changed in prod and your mobfiles directory is not up to date
			// - the DB identifies a file that is not present in the /mobfiles/logos folder
			//
			if(!$failed) 
				if(!file_exists($filedir.$filename))
					$failed = '401, file does not exists'; // file pathname defined but no actual file existing
		}
	}
	
} 

if($failed)	// always fallback to the Mobminder logo
	{ $filedir = '../themes/logos/'; $filename = 'mobyourbus.jpg'; }

	
if(!$debugmode) { 
	$f = file_get_contents($filedir.$filename);
	header('Content-type:image/jpeg');
	echo $f;
} else {
	echo 'cwd:'.getcwd().$nl.'logo path: '.$filedir.$filename.$nl; // for testing
	if($failed) echo 'failed with code '.$failed;
}
?>