<?php

///////////////////////////////////////////////////////////////////////////
//
//
//

function setCrossSiteCookie($eresa = true) {
	
	// This function must be called just after session_start(); AND before any header get sent to client (i.e. before any echo)
	// To verify that cookies are correctly set:
	// go to developper tool on Chrome/Firefox, then select Network, click the .php call and select Cookies tab. 
	// It should show Secure checked and SameSite according to selection

	$trusted_referers = Array();
	$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*ubicentrex\\.net\//'; // Those are for integrated iframe software
	$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*mypurecloud\\.ie\//'; // Those are for integrated iframe software
	// $trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*twilio\\.com\//';
	// $trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*localhost\//';
	if($eresa) {
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*agenda\.mobminder\\.com\//'; // for the new e-resa concept
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*oxteo\\.com\//'; 	// Oxteo
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*k-therapy\\.be\//'; 
		//$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*osteo-thiriart\\.be\//'; 	// Oxteo
		//$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*blanckaert-osteo\\.be\//'; // Oxteo
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*esthetiquecarole\\.be\//'; // 5516 Esthétique Carole, Florian
		
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*cryoperfect\\.fr\//'; // Antony Heridel RadicalEpil
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*radicalepil\\.fr\//'; // Antony Heridel RadicalEpil
		$trusted_referers[] = '/^https?:\/\/(([a-z0-9-]+)\.)*demo-expert\\.fr\//'; // Antony Heridel RadicalEpil
	}

	$referer = isset($_POST['referer']) ? trim($_POST['referer']) : (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : false);
	
	// if(isset($_POST['referer'])) echo 'POST REFERER : '.trim($_POST['referer']).chr(10);
	// if(isset($_SERVER['HTTP_REFERER'])) echo 'HTTP REFERER : '.$_SERVER['HTTP_REFERER'].chr(10);
	// if(!$referer) echo 'referer not identified'.chr(10);
	
		$trusted = false;
	foreach($trusted_referers as $x => $ref)
		if(preg_match($ref, $referer)) { $trusted = true; break; }
	
	$samesite = 'Lax'; if($trusted) $samesite = 'None';
	// echo 'Trusted referer? :'.($trusted?'YES':'NONE').chr(10);

		$currentCookieParams = session_get_cookie_params();  
		$sidvalue = session_id();  
	if (PHP_VERSION_ID < 70300) {
		setcookie(  
		'PHPSESSID', // name  
		$sidvalue, // value  
		0, // expires at end of session  
		$currentCookieParams['path'].'; SameSite='.$samesite, // path + setting SameSite // this will not work anymore when we step to PHP 7.3
		$currentCookieParams['domain'],// domain  
		true //secure  
		);  
	}
	else{
		setcookie('PHPSESSID', $sidvalue, [
			'expires' => 0,
			'path' => $currentCookieParams['path'],
			'domain' => $currentCookieParams['domain'],
			'secure' => true,
			//'httponly' => true,
			'samesite' => $samesite,
		]);
	}

}


///////////////////////////////////////////////////////////////////////////

class C_html {
	private static $pageTitle = 'TITLE NOT SET';
	private static $meta = array();
	private static $link = array();
	private static $styles = array();
	private static $scriptsIncludes = array();
	private static $body = array();			// html body, enclosed in <body> tags when dropped
	private static $javascripts = array();	// java script functions called by html 
	private static $footer = '';
	private static $skin = '';
	private static $lang = '';

	private static $headerscripts = array();	// java script functions called by html 
	private static $bodyscripts = array();	// java script functions called by html 
	

	public function __construct($lang='') {
		C_html::$lang = $lang; 

	}
	public function __destruct() {}
	
	// private
	
	private function dropHeader() { 
		echo "<head>\n";
		echo implode(C_html::$headerscripts);
		echo "<title>".C_html::$pageTitle."</title>\n";
		echo implode(C_html::$meta);
		echo implode(C_html::$link);
		echo implode(C_html::$styles);
		echo "</head>\n";
	}
	
	// public
	public function pushMeta($httpequiv, $content) { C_html::$meta[] = '<meta http-equiv="'.$httpequiv.'"'.' content="'.$content.'">'; }
	public function pushMetaName($name, $content) { C_html::$meta[] = '<meta name="'.$name.'"'.' content="'.$content.'">'; }
	public function pushLink($href, $rel, $type=false) { C_html::$link[] = '<link href="'.$href.'"'.' rel="'.$rel.'"'.($type==false?'':' type="'.$type.'"').'>'; }
	public function pushStyle($css, $cssId = '') { if($cssId) $cssId=' id="'.$cssId.'"'; C_html::$styles[] = '<style'.$cssId.'>'.$css.'</style>'; }
	public function pushScriptInclude($type, $src) { C_html::$scriptsIncludes[] = '<script  type="'.$type.'" src="'.$src.'"></script>'; }
	public function pushHTML($html) { C_html::$body[] = $html."\n"; }
	public function pushJavaScript($jscript) { C_html::$javascripts[] = $jscript."\n"; }

	public function pushHeaderScript($headerjscript) { C_html::$headerscripts[] = $headerjscript."\n"; }
	public function pushBodyScript($bodyscript) { C_html::$bodyscripts[] = $bodyscript."\n"; }

	
	public function htmlize($text) { // turns up CR LF into a nice html line breaker <br/>
		$text = str_replace(chr(13).chr(10), '<br/>', $text);
		$text = str_replace(chr(10), '<br/>', $text);
		return $text;
	}	
	public function pageTitle($text) {
		C_html::$pageTitle = $text;
	}
	public function getHTML() { return implode(C_html::$body);	}
	
	public function dropPage($class = '', $id = 'body', $more = '') { // drops a fresh complete new html page
		echo '<!DOCTYPE HTML>';
			$language = (empty(C_html::$lang)?'':' lang="'.C_html::$lang.'"');
		echo '<html translate="no"'.$language.'>';
		echo $this->dropHeader();
		echo implode(C_html::$scriptsIncludes);
			if($class) 	$class	= ' class="'.$class.'"';
			if($id) 	$id 	= ' id="'.$id.'"';
		echo '<body'.$class.' '.$id.' '.$more.'>'.implode(C_html::$bodyscripts).$this->getHTML();
		echo '</body>';
		echo '</html>';
		echo '<script type="text/javascript">'.implode(C_html::$javascripts).'</script>';
	}
	public function pushLogo($picname, $defaultText) { 
		$logoFilePath = './themes/logos/'.$picname;
		$logo = '<h1 id="logo" class="hand logo">'.$defaultText.'</h1>';
		if(file_exists($logoFilePath.'.jpg'))
			$logo = '<img id="logo" class="hand logo" src="'.$logoFilePath.'.jpg'.'" alt="'.$defaultText.'">';
		if(file_exists($logoFilePath.'.gif'))
			$logo = '<img id="logo" class="hand logo" src="'.$logoFilePath.'.gif'.'" alt="'.$defaultText.'">';
		$this->pushHTML($logo);
	}
	
	public function sorryForMSIE() {
		
		$h1 = '<h1 style="padding-top:2em;" class="bold centered">Oups! Sorry, it does not run on Microsoft Internet Explorer</h1>';
		$h2 = '<h2 style="padding-top:2em;" class="bold centered">Mobminder works best with one of the following:</h2>';
		$comp = '<img id="logo"  style="padding-top:2em;" src="./themes/logos/mob_compatible.jpg'.'">';
		$mob = '<img id="logo"  style="padding-top:2em;" src="./themes/logos/mobyourbus.jpg'.'">';
		$div = '<div style="text-align:center;">'.$h1.$h2.$comp.$mob.'</div>';
		$this->pushHTML($div);
		return $this;
	}
}


?>