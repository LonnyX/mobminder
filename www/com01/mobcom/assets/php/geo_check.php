<?php
	
///////////////////////////////////////////////////////////////////////////////////
//
// This is an includable library

function getbrowserlang() {
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2); // like [nl, fr, en, es] based on the browser language
    $acceptLang = ['fr','nl','en','es']; 
    $lang = in_array($lang, $acceptLang) ? $lang : 'en';
	return $lang; // like [nl, fr, en]  other language will be made available when the website is translated
}
	
class C_geofind {
	
	public $city;
	public $rnam; // region name
	public $coun; // country
	public $cont; // continent
	
	public $phoneregion; // phone region (by default)
	public $language; // default web site language
	
	public $latt;
	public $long;
	
	public $regi; // $region
	public $rcod; // $regioncode;
	public $ccod; // $countrycode;
	public $cncd; // $continentcode;
	
	public $userip;
	public $prodserver;
	
	function __construct($useragent, $userip, $nobot = true) {
		
		if($userip == '127.0.0.1'|| $userip=='::1') {
			$this->prodserver = false;
			$this->userip = file_get_contents('https://www.geoplugin.com/ip.php'); // will return the internet provider's assigned IP 
		} else
			{ 
				$this->prodserver = true;
				$this->userip = $userip;
			}
		
		if($nobot)
			if($this->is_bot($useragent) ) { // chek if any crawler is scanning our website

				// More often than not, this happens when people's sites get spidered by search engine crawlers, 
				// which can very quickly take a site's geoplugin.net lookups to over 120 in a minute. 
				// To protect against this, we advise to use the following regular expression to detect search engine bots, 
				// and if a bot is detected, not to call geoplugin.net. 
				// Instead, you can provide default values for the IP geolocation lookup, 
				// thereby preventing search engines inflating your per minute lookups rate and taking you onto the blacklist. 

				$this->city = 'Watermael';
				$this->rnam = 'You are a bot';
				$this->coun = 'Belgium';
				$this->cont = 'Europe';
				
				$this->phoneregion = 1; // phone region (by default)
				$this->language = 'en'; // default web site language
				return $this;
			}
		$url = 'https://ssl.geoplugin.net/json.gp?k=ba58496b756693ec&ip='.$this->userip.'';
		$file = file_get_contents($url); // 120 requests per minute is the maximum rate for this free service : https://www.geoplugin.com/webservices/ssl
		//Geoplugin https://www.geoplugin.com/home/login.php credentials Username:Jonmob jonathan@mobminder.com - Password:J0n4th4ngeo - old key=fa5f9a65bb737ba0 - new key= ba58496b756693ec (from 18/02/2025)
		if($file) {
			$geo = json_decode($file,TRUE);
			$this->city = $geo['geoplugin_city']; 			//  'Brussels'
			$this->regi = $geo['geoplugin_region']; 			//  'Brussels Capital',
			$this->rcod = $geo['geoplugin_regionCode']; 		//  'BRU',
			$this->rnam = $geo['geoplugin_regionName']; 		//  'Brussels Capital',
			$this->ccod = $geo['geoplugin_countryCode']; 		//  'BE',
			$this->coun = $geo['geoplugin_countryName']; 		//  'Belgium',
			$this->cncd = $geo['geoplugin_continentCode']; 	//  'EU',
			$this->cont = $geo['geoplugin_continentName']; 	//  'Europe',
			
			$this->latt = $geo['geoplugin_latitude']; 		//  '50.8466',
			$this->long = $geo['geoplugin_longitude']; 		//  '4.3528',

			$this->phoneregion = 11; // phone region (by default)
			$this->language = 'en'; // default web site language

			switch($this->ccod) { // assign by country code
				
				
				// ISO 3166 Country Codes
				// https://dev.maxmind.com/geoip/legacy/codes/iso3166/
				// https://www.maxmind.com/download/geoip/misc/region_codes.csv

				// BE,01,"Antwerpen"
				// BE,03,"Hainaut"
				// BE,04,"Liege"
				// BE,05,"Limburg"
				// BE,06,"Luxembourg"
				// BE,07,"Namur"
				// BE,08,"Oost-Vlaanderen"
				// BE,09,"West-Vlaanderen"
				// BE,10,"Brabant Wallon"
				// BE,11,"Brussels Hoofdstedelijk Gewest"
				// BE,12,"Vlaams-Brabant"
				// BE,13,"Flanders"
				// BE,14,"Wallonia"

				case 'BE': 
					$this->phoneregion = 32;
					switch($this->rcod) {
						case 'VLG': case 'VAN': case 'VWV': case 'VLI': case 'VOV': case 'VBR': 
							$this->language = 'nl'; break;
							
						case 'WAL': case 'WHT': case 'WLG': case 'WNA': case 'WLX': case 'WBR': 
							$this->language = 'fr'; break;
							
						case 'BRU':
							$this->language = 'fr'; break;
							
						default: $this->language = 'en';
					}; 
					break; 
				case 'NL': $this->phoneregion = 31; $this->language = 'nl'; break; // Netherland
				case 'FR': $this->phoneregion = 33; $this->language = 'fr'; break; // France
				case 'LU': $this->phoneregion = 352; $this->language = 'fr'; break; // Luxembourg
				case 'ES': $this->phoneregion = 34; $this->language = 'es'; break; // Spain
				case 'PT': $this->phoneregion = 351; $this->language = 'en'; break; // Portugal
				case 'IT': $this->phoneregion = 39; $this->language = 'en'; break; // Italy
				case 'GB': $this->phoneregion = 44; $this->language = 'en'; break; // UK
				case 'DE': $this->phoneregion = 49; $this->language = 'en'; break; // Germany
				case 'CH': $this->phoneregion = 41; $this->language = 'fr'; break; // Switzerland
				case 'DK': $this->phoneregion = 41; $this->language = 'en'; break; // Denmark
				
				default: $this->phoneregion = 11; $this->language = 'en';
			}
		}
		else {
			
			$this->city = 'GeoPlugin no file';
			$this->rnam = 'GeoPlugin no file';
			$this->coun = 'GeoPlugin no file';
			$this->cont = 'GeoPlugin no file';
			
			$this->phoneregion = 0; 
			$this->language = 'en'; // default language
			
			$this->latt = 0;
			$this->long = 0;
		}
	
	}
	private function is_bot($user_agent) {
		$botRegexPattern = '(googlebot\/|Googlebot\-Mobile|Googlebot\-Image|Google favicon|Mediapartners\-Google|bingbot|slurp|java|wget|curl|Commons\-HttpClient|Python\-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST\-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub\.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum\.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips\-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail\.RU_Bot|discobot|heritrix|findthatfile|europarchive\.org|NerdByNature\.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb\-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web\-archive\-net\.com\.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks\-robot|it2media\-domain\-crawler|ip\-web\-crawler\.com|siteexplorer\.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki\-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e\.net|GrapeshotCrawler|urlappendbot|brainobot|fr\-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf\.fr_bot|A6\-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive\.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j\-asr|Domain Re\-Animator Bot|AddThis|YisouSpider|BLEXBot|YandexBot|SurdotlyBot|AwarioRssBot|FeedlyBot|Barkrowler|Gluten Free Crawler|Cliqzbot)';
		return preg_match('/{$botRegexPattern}/', $user_agent);
	}
	public function getstring() {
		return $this->userip.'!'.$this->cont.'!'.$this->coun.'!'.$this->rnam.'!'.$this->city.'!'.$this->phoneregion.'!'.$this->language;
	}
	public function getlanguage() {
		return $this->language; // like [nl, fr, en]  other language will be made available when the website is translated
	}
}




?>