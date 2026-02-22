<?php
//////////////////////////////////////////////////////////////////////
//
//  Q U E R Y    A    L O G O  
//


$failed = false;

$aid = @$_GET['aid']; if(!isset($aid)) $failed = true; // parameters are not passed
$lid = @$_GET['lid']; if(!isset($lid)) $failed = true;
$kid = @$_GET['kid']; if(!isset($kid)) $failed = true;
$gid = @$_GET['gid']; if(!isset($gid)) $gid = 0; else $gid = $gid+0; // logo id

if(!$failed) { // complete set of parameters was passed

	if(!is_numeric($aid)) die('#error logo00001'); if(strlen($aid)>5) die('#error logo00001b');
	if(!is_numeric($lid)) die('#error logo00002'); if(strlen($lid)>6) die('#error logo00002b');
	if(!is_numeric($kid)) die('#error logo00003'); if(strlen($kid)>6) die('#error logo00003b');
	if(!is_numeric($gid)) die('#error logo00004'); if(strlen($gid)>8) die('#error logo00004b');
	
	require '../../../../mobminder/lib_mobphp/dbio.php';

	$test = SQLinjectionScreen($_GET);
	if($test) die('you are banned <command>logoff</command> ('.$test.')');


	if(!$failed) {
		
		$dS_account = new C_dS_group($aid);
		$dS_login 	= new C_dS_login($lid);
		$dS_key = new C_dS_accesskey($kid);

		if($dS_key->id==0&&$dS_login->id==0&&$dS_account->id==0) $failed = true;
		if($dS_key->accountId != $aid) $failed = true;
		if($dS_key->groupId != $lid) $failed = true;
		
		
		if(!$failed) {
			
			if(!$gid) $gid = $dS_key->hascustomlogo();
			if($gid) {
				//logo from web login===========================================================================
				$dS_logo = new C_dS_logo($gid); 
				if($dS_logo->groupId != $dS_account->id) $failed = true; // calling with correct key/lid/aid but random gid
				$filedir = '/mobfiles/_logos/';
				$filename = $dS_logo->getcodename();
			} else if($dS_login->eresaSkin) { 
				// image chosen among the standard choices =====================================================
				$filedir = '../imgs/skins/';
				$filename = $dS_login->eresaSkin.'.jpg';
			} else $failed = true;
			
			if(!$failed) if(!file_exists($filedir.$filename)) $failed = true; // file pathname defined but no actual file existing
		}
	}
} 
else // $failed
{ 
	$filedir = '../imgs/custom/'; 
	$filename = 'mobyourbus.jpg'; 
}

if(1) // PVH : set to 0 when testing or if you want to locate the directory
{
	if (1) // BSP : set to 0 when testing or if you want to locate the directory
	{
		$f = file_get_contents($filedir.$filename);
		header('Content-type:image/jpeg');
		echo $f;
	} 
	else 
	{
		//TODO
		$tmpdir = "/app05/booking/_assets/imgs/skins/";
		$path = $_SERVER['DOCUMENT_ROOT'] . $tmpdir.$filename;
		if (file_exists($path))
		{
			$image_info = getimagesize($path);
			header('Content-type: image/jpeg');
			//header('Content-Type: ' . $image_info['mime']);
			header('Content-Length: ' . filesize($path));
			//header('Content-Transfer-Encoding: UTF-8');
			$f = file_get_contents($path);
			echo $f;
			
			//readfile($path);
			
			//$fp = fopen($path, 'rb');
			//fpassthru($fp);
			
			//exit();
			//echo '<br/>'.'found : '.$path; // for testing
		}
		else
		{
			echo '<br/>'.'not found : '.$path; // for testing
		}
		
	}
} 
else 
{
	echo 'cwd:'.getcwd().chr(10).'<br/>'.'logo search path: '.$filedir.$filename; // for testing
	echo '<br/>'.'test : '.$_SERVER['DOCUMENT_ROOT'] .$filedir.$filename; // for testing
}
?>