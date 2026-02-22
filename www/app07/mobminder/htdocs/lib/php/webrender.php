<?php
/////////////////////////////////////////////////////////////////////////////////////
//
//    W E B    R E N D E R   -   F O R   D E V  a n d   D E B U G   P U R P O S E
//
//  This library helps for api testing. 
//  API are machine to machine interfaces that require data transfer only.
//  When dev or testing an api, one wants to sit in between and view calls results on an html renderer. That is the aim of this library.
// 


/////////////////////////////////////////////////////////////////////////////////////
//
// variables that help calling the right url wether you are in prod env (vhosts leading to precise dirs) or 
// if you are in dev local env (only one vhost and sub directories representing each prod vhosts)
//

global $host, $uri, $uri_1, $http; // those are used in the api's spec pages so to display hrefs that are pertinent to the running environment

function set_urls($subdomainname) { // detects dev or prod env and adapt $http / $host vars
	// see (*dv01*) for example of usage
	//
	global $host, $uri, $uri_1, $http;
	
	$req_uri = $_SERVER['REQUEST_URI'];// smth like /app05/htdocs/smart/specs/api.php?lgn=mobdev&pwd=bernard&kid=12413&web=1
	$uriandpar = explode('?',$req_uri);
	$host = $_SERVER['HTTP_HOST']; // which is localhost or smart.mobminder.com
	// echo $host.$req_uri; // make it verbose
	$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
	$uri_1 = '';
	$http = 'https://'; // good for production
	
	if($host=='localhost') {
		$http = 'http://';  // good for local dev
		$uri_1 = '/app07/mobminder/htdocs/'.$subdomainname; // then you are in locahost testing.
	}
}


/////////////////////////////////////////////////////////////////////////////////////
//
// html display functions
//
// In order to make those function nihil in machine to machine prod environment,
// they are inoperant when the global $web variable is undefined or false. 
//

define('webrender', true); // see (*wr00*), // see (*rq01*)

function weburl($naked) { // used to let " & " appear red in api specification pages, so makes obvious the parameters
	$dressed = str_replace('&','<span> &amp; </span>',$naked);
	$dressed = str_replace('?','<span> &quest; </span>',$dressed);
	return $dressed;
}

function h1($t) { global $web, $nl; if(!$web) return; echo '<h1>'.$t.'</h1>'; }
function h2($t) { global $web, $nl; if(!$web) return; echo '<h2>'.$t.'</h2>'; }
function h3($t, $em=3) { global $web, $nl; if(!$web) return; echo '<h3 style="padding-left:'.$em.'em;">'.$t.'</h3>'; }
function h4($t) { global $web, $nl; if(!$web) return; echo '<h4>'.$t.'</h4>'; }
function span($msg) { global $web, $nl; if(!$web) return; echo '<span>'.$msg.'</span>'; }
function notice($msg, $em = 6) { global $web, $nl; if(!$web) return; echo '<p style="padding-left:'.$em.'em; margin:0; font-size:90%; margin-top:1em;">'.$msg.'</p>'; }
function indent($msg, $em = 3) { global $web, $nl; if(!$web) return; echo '<p style="padding-left:'.$em.'em; margin:0;">'.$msg.'</p>'; }
function warning($msg, $em = 0) { global $web, $nl; if(!$web) return; echo '<p style="padding-left:'.$em.'em; color:orange">'.$msg.'</p>'; }
function micro($msg) { global $web, $nl; if(!$web) return; echo '<p style="color:blue; padding-left:3em; font-size:80%; line-height:70%;">'.$msg.'</p>'; }
function microtab($msg) { global $web, $nl; if(!$web) return; echo '<p style="color:red; padding-left:6em; font-size:75%; line-height:70%;">'.$msg.'</p>'; }
function pad($em=1) { global $web, $nl; if(!$web) return; echo '<p style="margin:'.$em.'em;">&nbsp;</p>'; }
function href($link, $caption, $em = 3) { global $web, $nl; if(!$web) return; echo '<a href="'.$link.'" style="padding-left:'.$em.'em; margin:0;">'.($caption?weburl($link):$link).'</a>'; }
function jump($link, $caption, $em = 3) { global $web, $nl; if(!$web) return; echo '<a href="'.$link.'" style="padding-left:'.$em.'em; margin:0;" target="_blank">'.($caption?weburl($link):$link).'</a>'; }
function dropjs($js) { global $web, $nl; if(!$web) return; echo '<script type="text/javascript">'.$js.'</script>'; }

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds

function htmlize($text) { // turns up CR LF into a nice html line breaker <br/> (was copied here because _logs from smartapp contain chr(10)) that we turn into <br> before html display
	$text = str_replace(chr(13).chr(10), '<br/>', $text);
	$text = str_replace(chr(10), '<br/>', $text);
	return $text;
}

function CRLFfree($text) {
	$no1310 = str_replace(chr(13).chr(10), '\n', $text);
	$no10 = str_replace(chr(10), '\n', $no1310);
	$no13 = str_replace(chr(13), '\n', $no10);
	$noPipe = str_replace('|', '', $no13);
	$noTagIn = str_replace('<', '', $noPipe);
	$noTagOut = str_replace('>', '', $noTagIn);
	$clean = $noTagOut;
	return $clean;
}


$web = false; $nl = chr(10);
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$split = Explode('/', $pathfile);
		$splitcont = count($split);
	$scriptname 	= $split[$splitcont - 1]; 
	$scriptfolder 	= $split[$splitcont - 2]; if($scriptfolder) $scriptfolder = '/'.$scriptfolder;
	if($splitcont<=3) $scopefolder = ''; else $scopefolder = $split[$splitcont - 3]; 
	if($scopefolder) $scopefolder = '/'.$scopefolder;
	$script = $scopefolder.$scriptfolder.'/'.$scriptname;
		
function setrendermode($css = '../api.css?b=2') { // if _request &web=1 is passed, this sets html display instead of regular api raw data return. Best for dev env.
	global $web, $nl, $scriptname, $scriptfolder, $scopefolder;
	$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false; 
	if($web) $nl='<br/>'; // (*nl1*)
	if($web) {
		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$scriptfolder.'/'.$scriptname.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="'.$css.'" rel="stylesheet" type="text/css">';
			$o .= '</head>';
		$o .= '<body>';
		$o .= '<h1>You are executing '.$scopefolder.$scriptfolder.'/'.$scriptname.'</h1>';
		echo $o;
		set_error_handler('exceptions_error_handler');

	} else {
		header('Content-Type: text/plain; charset=UTF-8');
	}
	
}

function endrendermode() {
	global $web, $nl;
	if(!$web) return;
	echo '</body></html>';
}



function closeconnection($tempo = false) { // $tempo in milliseconds, 50 for 50ms

	if($tempo) usleep(1000*$tempo);
	
	// close current session (!!! you need to start an ob_start() at the top of the script, before any echo runs !!!)
	//
	if(session_id()) session_write_close();
	
	echo chr(10).'Closing connection.'.chr(10);
    $fb = ob_get_contents(); $fl = strlen($fb); // collect, measure and closes ob1, see (*ob1)
    ob_end_clean();
	
	ob_start(); // use a new bufer, ob2
    ignore_user_abort(true); 
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    header('Connection: close'); 
    
	echo $fb; // flush has no effect if the buffer is not 4k at least

	// flush all output// 3
	ob_end_flush(); ob_flush(); flush(); // serve client with the content of ob2
	ob_start(); // ob3 catches any subsequent echo, that we will hence never flush to the client
	echo chr(10).'Connection closed (You never see this message)';
}



function exceptions_error_handler($severity, $message, $filename, $lineno) {
  if(error_reporting() == 0) {
    return;
  }
  if(error_reporting() & $severity) {
    throw new ErrorException($message, 0, $severity, $filename, $lineno);
  }
}


function abort($errorcode, $errormsg) { 
	global $web, $nl, $script;
	echo '<error>#'.$errorcode.' in '.$script.'::'.$errormsg.'</error>'.$nl;
	endrendermode();
	die();
};


?>