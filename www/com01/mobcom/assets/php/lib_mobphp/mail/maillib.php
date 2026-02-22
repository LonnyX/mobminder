<?php

//////////////////////////////////////////////////////////////////////////////// 
//
// 	 M A I L   L I B
//
// web=1 => display mail into web page
// send=1 => if local (dev env.) write mail content to filesystem 
// send=1 => if production, send email to smtp server
//
// Test : http://localhost:8888/mobcom/assets/php/email_medinect.php
//
// Effective sending: https://mobminder.com/assets/php/email_medinect.php
//
//
//

//define('mailtofile', false); //true => structured email content is stored into file instead of sent to smtp server

define('mixedboundary', uniqid('mixed')); // defined only once per file include is more than enough processing power uage
define('relatedboundary', uniqid('related'));
define('alternativeboundary', uniqid('alternative'));


$dbio = new mysqli('localhost' /*host*/, 'mobminder' /*user*/, 'tgx23PiQ' /*pw*/, 'newmobcom' /*db*/);
$dbio->query('SET NAMES utf8');


$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; 
$subfolders = preg_split("#/#", $uri); 
$uri_1 = '/assets/php/lib_mobphp/mail/imgs'; // same in production as in local
$http = 'https';
$environment = 'PROD';
if(isset($subfolders[1])) {
	//if($host=='localhost:8888') { // then we run local dev
	if(startwith($host,'localhost')) { // then we run local dev
		//$uri_1 = '/mobcom/assets/imgs/emails'; // then you are in locahost testing.
		$uri_1 = '/com01/mobcom/assets/php/lib_mobphp/mail/imgs'; // then you are in locahost testing.
		$http = 'http';
		$environment = 'DEV';
	}
}
$imageshost = $http.'://'.$host.$uri_1; // is local "http://localhost/comm" and prod "https://be.mobminder.com/comm"


function sendMobinderMail($replyto,$addressee,$subject,$html,$bgcolormail)
{
	global $host;
	global $imageshost;
	global $environment;

	$send = false; if(isset($_GET['send'])) $send = !!$_GET['send'];
	$web = false; if(isset($_GET['web'])) $web = !!$_GET['web'];

	$debug = ($environment == 'DEV');


	$allin = microtime(true);

	$mail = new C_b64_email($replyto, $subject, $html, true, $bgcolormail,$debug);

	if ($send) //send email
	{
		$mail->sendMail($addressee);
	}
	else if ($web)
	{

		/////////////////// dev and test of the email
		$example = '';
			
		$out = '';
		$out .= h1('mobminder email sender');
		$out.= notice('HOST: |'.$host.'|');
		$out.= notice('images host: |'.$imageshost.'|');
		$out.= notice('Environment: '.$environment.'');
		$out .= warning('<strong>Not in web mode, emails will not be sent. Use ?send=1 to actually send emails</strong>');
			
	
	
			$example .= '<div style="margin-top:3em;">subject : '.$mail->getSubject().'</div>';	
			
				$html = '
				<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:2em; text-align:center; background-color:'.$bgcolormail.'; width:100% !important;">
				'.$mail->getHtmlbody().'
				</div>
				<div style="height:5em;">&nbsp;</div>
				';
			$example .= $html;
			
			
			$example .= h1('Text version for this email: ' );
			$stripped = '<div style="margin-top:3em;"><textarea rows=24 style="width:100%;">'.$mail->stripoff($html).'</textarea><br/>&nbsp;</div>';
			$example .= $stripped;
			
	
	
		//////////////////////////////////////////////////////////////////////////////// 
		//
		//  ECHO OUTPUT 'pascal.vanhove@skynet.be','sensasis@live.be','j-bardo@hotmail.com, jonbardo@icloud.com'
		//
	
	
		$allout = microtime(true);
		$alldelta = deltasec($allin,$allout);
		$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'');
	
		echo html($out, $example);
	}
	else
	{
		echo 'bad parameter : choose send=1 or web=1';
	}
}

	

function startwith($string,$query)
{
	return substr($string, 0, strlen($query)) === $query;
}
function error($msg, $handle = false) { 
	global $out;
	if($handle) { fclose($handle); }
	$out.='<h3>'.$msg.'</h3>'; 
	echo html($out); 
	die('<br/>Ending execution'); 
}
function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds
function h1($t) { return '<h1 style="white-space:nowrap; font-weight:bold; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em; font-weight:bold;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function micro($msg) { return '<p style="color:blue; padding-left:3em; font-size:80%; line-height:70%;">'.$msg.'</p>'; }
function microtab($msg) { return '<p style="color:red; padding-left:6em; font-size:75%; line-height:70%;">'.$msg.'</p>'; }
function html($content, $example = '') {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="../css/basics.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body><div class="verbose">'.$content.'</div>'.$example.'</body></html>';
		return $o;
}

function X($tn, $page = false) {
	global $dbio, $l, $p, $ixl;
	if($page) $qp = $page; else $qp = 'wizard';
	$sql='select id, fr, '.$l.' from xlations where tn = "'.$tn.'" and page = "'.$qp.'";';
	$r = $dbio->query($sql);
	if($r===false) echo $dbio->errno.' -> '.$dbio->error;
	$c = $r->num_rows;
	if($c > 1) return '-?many-'.$tn.'-?-'; // 'Many XL for '.$tn.'/'.$qp; // mutliple entries for this combination of technical name and page
	if($c === 0) { 
			$id = 0; // will trigger the creation of a new record in xlations DB table
		if($ixl=='on') $xl = '<xl id="xl_'.$qp.'_'.$id.'" value="'.$tn.'">-?'.$tn.'?-</xl>'; // interactive translation
			else $xl = '-?'.$tn.'?-'; // 'No XL for '.$tn.'/'.$qp; // technical name/page not found in db
		$xl = nl2br($xl); // nl2br seems to leave the \n's inside the string was solved here (*xl_1*)
		return $xl;
		
	} else { // only one found, great!
		$row = $r->fetch_array();
			$xl = $row[$l]; if($xl=='') $xl = $row['fr']; // when the page is not yet translated in the requested language, the document displays french.
			$id = $row['id'];
		if($xl === '') return '-?empty?-';
		if($ixl=='on') $xl = '<xl id="xl_'.$qp.'_'.$id.'" value="'.$tn.'">'.$xl.'</xl>'; // interactive translation
		$xl = nl2br($xl); // nl2br seems to leave the \n's inside the string was solved here (*xl_1*)
		return $xl;
	}
}

class C_b64_email { // this is the 2023 version by BSP, featuring base64 encoding and files attachment
	
	private $replyto;
	private $subject;
	private $htmlbody;
	private $textbase64;
	private $bgcolormail;
	private $inlines; // inline images
	private $filenames; // attachment filenames from os filesystem
	private $streams; // attachment from stream (file content is a string)
	
	private $encoded_subject;
	private $encoded_htmlbody;
	
	private $mailtofile;

	public function __construct($replyto='', $subject='', $htmlbody='', $textbase64=true, $bgcolormail='white', $mailtofile_=false) {
		
		$this->mailtofile = $mailtofile_;

		if($replyto) $this->replyto = $replyto;  // can be passed at construction or at send() event
		
		if($subject) 
		{
			$this->subject = $subject; // can be passed at construction or at send() event
			$this->encodeSubject();
		}

		$this->textbase64 = $textbase64;

		if($htmlbody)
		{
			$this->htmlbody = $htmlbody; // can be passed at construction or at send() event
			$this->encodeHtmlBody();
		}

		$this->bgcolormail = $bgcolormail;
	
		$this->inlines = Array();
		$this->filenames = Array();
		$this->streams = Array();
	}
	
	public function addInline($filename,$alias)	
	{
		$inline_content = file_get_contents($filename);
		if($inline_content!=false)
		{
			$inline_content = chunk_split(base64_encode($inline_content));
			$inline_filename = basename($filename);
			$inline_contenttype = $this->getMimeType($filename);
			$m = '';
			$m .= "--" . relatedboundary . "\r\n";
			$m .= "Content-Type: ".$inline_contenttype.";name=\"" . $inline_filename. "\"". "\r\n";
			$m .= "Content-Transfer-Encoding: base64". "\r\n";
			$m .= "Content-Disposition: inline;filename=\"" . $inline_filename . "\"". "\r\n";
			$m .= "Content-ID: <".$alias.">\r\n\r\n";
			$m .= $inline_content . "\r\n\r\n";
			$this->inlines[] = $m;
		}

	}
	public function addAttachedFilename($filename,$alias = null) 
	{
		if($alias==null) $alias = basename($filename);
		$attached_content = file_get_contents($filename);
		if($attached_content!=false)
		{	
			$m = '';
			$m .= "--" . mixedboundary . "\r\n";
			$attached_content = chunk_split(base64_encode($attached_content));
			$attached_contenttype = $this->getMimeType($filename);
			$m .= "Content-Type: ".$attached_contenttype.";name=\"" . $alias . "\"" . "\r\n";
			$m .= "Content-Transfer-Encoding: base64" . "\r\n";
			$m .= "Content-Disposition: attachment;filename=\"" .$alias."\"" . "\r\n\r\n";
			$m .= $attached_content . "\r\n\r\n";

			$this->filenames[] = $m;
		}

	}
	public function addAttachedStream($stream,$alias) 
	{
		if(strlen($stream[0])!=0)
		{
			$m = '';
			$m .= "--" . mixedboundary . "\r\n";
			$stream_content = chunk_split(base64_encode($stream));
			$m .= "Content-Type: text/calendar;name=\"" . $alias . "\"" . "\r\n";
			$m .= "Content-Transfer-Encoding: base64" . "\r\n";
			$m .= "Content-Disposition: attachment;filename=\"" .$alias."\"" . "\r\n\r\n";
			$m .= $stream_content . "\r\n\r\n";

			$this->streams[] = $m;
		}

		
	}
	public function getSubject() { 
		return $this->subject;
	}
	//get simple html body, without html, head and body tags
	public function getHtmlbody() {
		return $this->htmlbody;
	}
	public function sendMail($addressee, $vid=0, $replyTo='', $subject='', $htmlbody='') { // invokes PHP mail to mailsever

		if($replyTo) $this->replyto = $replyTo; // we allow 'by email' adjustment of $replyTo, $subject and $htmlbody
		
		if($subject) 
		{
			$this->subject = $subject;
			$this->encodeSubject();
		}

		if($htmlbody)
		{
			$this->htmlbody = $htmlbody; // can be passed at construction or at send() event
			$this->encodeHtmlBody();
		}
		

		if(empty($addressee)) return false; // skip this oject having no email
		if(empty($this->subject)) return false; 
		if(empty($this->htmlbody)) return false; 
		if(empty($this->replyto)) return false; 


		//headers - specify your from email address and name here
		//and specify the boundary for the email
		$headers  = "MIME-Version: 1.0\r\n";
		$unsubvid = ''; if($vid)
		{
			$unsubvid = '?vid='.$vid;
			$headers .= 'List-Unsubscribe: <https://maintenance.mobminder.com/fr/index.php'.$unsubvid.">\r\n";
		}
		$headers .= "From: Mobminder <communication@mobminder.com>\r\n";
		$headers .= "Reply-To: ".$this->replyto."\r\n"; // only appearing on user interface, used by mail programs at client side
		$headers .= "X-Mailer: Mobminder/1.0\r\n";
		$headers .= "Content-Type: multipart/mixed; boundary=".mixedboundary."\r\n\r\n";
		
		//2022-08-04 BSP : not mandatory => not used anymore
		//$m = "This is a MIME encoded message." . "\r\n"; 
		
		
		//schema multipart/mixed/related/alternativeHeader
		/*	|From: email
			|To: email
			|MIME-Version: 1.0
			|Content-Type: multipart/mixed; boundary="boundary1";
			Message body
			|multipart/mixed --boundary1 (mixedboundary)
			|--boundary1 (mixedboundary)
			|   multipart/related --boundary2 (relatedboundary)
			|   |--boundary2 (relatedboundary)
			|   |   multipart/alternative --boundary3 (alternativeboundary)
			|   |   |--boundary3 (alternativeboundary)
			|   |   |text/plain
			|   |   |--boundary3 (alternativeboundary)
			|   |   |text/html
			|   |   |--boundary3-- (alternativeboundary)
			|   |--boundary2 (relatedboundary)    
			|   |Inline image
			|   |--boundary2 (relatedboundary)
			|   |Inline image
			|   |--boundary2-- (relatedboundary)
			|--boundary1 (mixedboundary)
			|Attachment1
			|--boundary1 (mixedboundary)
			|Attachment2
			|--boundary1 (mixedboundary)
			|Attachment3
			|--boundary1-- (mixedboundary)*/ 
		
		
		$m = "--" . mixedboundary . "\r\n";
		$m .= "Content-Type: multipart/related; boundary=".relatedboundary."\r\n\r\n";
		
			$m .= "--" . relatedboundary . "\r\n";
			$m .= "Content-Type: multipart/alternative; boundary=".alternativeboundary."\r\n\r\n";
		
				$m .=$this->encoded_htmlbody;
			
			//INLINE FILES
			foreach ($this->inlines as $inline)
			{
				$m .= $inline;
			}
			
			$m .= "--" . relatedboundary . "--"."\r\n\r\n";
		
		//ATTACHMENTS from filename
		foreach ($this->filenames as $filename)
		{
			$m .= $filename;
		}

		//ATTACHMENTS from stream
		foreach ($this->streams as $stream)
		{
			$m .= $stream;
		}

		$m .= "--" . mixedboundary . "--";
		
		if(!$this->mailtofile)
		{
			$result = mail($addressee, $this->encoded_subject, $m, $headers);
			return $result;
		}
		else
		{
			$log = 
			"target=".$addressee."\r\n"
			."--------------------------------------\r\n"
			."header=".$headers."\r\n"
			."--------------------------------------\r\n"
			."subject=".$this->encoded_subject."\r\n"
			."--------------------------------------\r\n"
			."message=".$m."\r\n";

			//echo $log.'<br/>';
			$filename = __DIR__ . '/log/C_b64_email.log';
			$result = file_put_contents($filename,$log . "\r\n", FILE_APPEND | LOCK_EX);
			echo 'success<br/>';
			echo 'mail file has been append to '.$filename.'<br/>';
			return true;
		}
	}
	//trunc html every maxlen character, to prevent invalid dkim signature issue
	private function splithtml4mail($source,$maxlen=255) {
		$encoding = "UTF-8";

		$crlf = chr(13).chr(10); //CR LF
		//$crlf = chr(10); //CR LF
		$splitchars = array("<","=",";"," "); //split characters

		$lines = explode($crlf,$source);
		$result = array();

		//loop in all existing lines
		foreach($lines as $line) {

			while (strlen($line)!=0)
			{
				//if the length of line is smaller or equal to maxlen, then keep the entire line (add entire line to array)
				if(strlen($line)<=$maxlen)
				{
					array_push($result, $line);
					break;
				}

				//the length of line is greater than maxlen, take the first maxlen characters
				//$truncatedline = substr($line,0,$maxlen);
				$truncatedline = mb_strcut($line,0,$maxlen,$encoding);

				//try to find the last "<","=",";"," " characters in line
				$splitcharindex = -1;
				foreach($splitchars as $splitchar) {

					$lastindex = strripos($truncatedline,$splitchar);
					if($lastindex != false)
						if($lastindex>$splitcharindex)
							$splitcharindex = $lastindex;
				}

				//if a "<","=",";"," " character is found, then take its index to split the line
				//otherwise split at maxlen index
				if($splitcharindex!=-1) {
					//$truncatedline = substr($line,0,$splitcharindex);
					$truncatedline = mb_strcut($line,0,$splitcharindex,$encoding);
				}
				else {
					//$truncatedline has been already built
					$splitcharindex = $maxlen;
				}

				//add current line to array
				array_push($result, $truncatedline);

				//build new line for loop
				$oldlinelength = strlen($line);

				//$line = substr($line,$splitcharindex);
				$line = mb_strcut($line,$splitcharindex,null,$encoding);

				$newlinelength = strlen($line);
				
				//security #2 : if current line length does not decrease, then exit from while loop
				if($newlinelength >= $oldlinelength) {
					//never happen
					//error !must exit froom while loop!!
					break;
				}
			}
		}
		//build a string from array (separtor = char 13 + char 10)
		return implode($crlf, $result);
	}
	public function stripoff($in) {
		$out  = preg_replace('/<[^>]*>/', '', $in);
		$out  = trim(preg_replace('/\t+/', '', $out));
		$out  = preg_replace( '/\n\r/si', '', $out );
		return $out;
	}
	private function getMimeType( $filename ) {
        $realpath = realpath( $filename );
        if( $realpath
                && function_exists( 'finfo_file' )
                && function_exists( 'finfo_open' )
                && defined( 'FILEINFO_MIME_TYPE' )
        ) {
                // Use the Fileinfo PECL extension (PHP 5.3+)
                return finfo_file( finfo_open( FILEINFO_MIME_TYPE ), $realpath );
        }
        if( function_exists( 'mime_content_type' ) ) {
                // Deprecated in PHP 5.3
                return mime_content_type( $realpath );
        }
        return false;
	}
	private function encodeSubject()
	{
		//subject is encoded with UTF-8/BASE64
		$this->encoded_subject = '=?UTF-8?B?' . base64_encode($this->subject) . '?=';
	}
	private function encodeHtmlBody()
	{
		$m = '';

		// note that html head title should match with email subject in order to ensure delivery to inbox ( iso spam :) 
		$fullhtml  = '<html>';
		$fullhtml .= '	<head><title>'.$this->subject.'</title></head>'; 
		$fullhtml .= '	<body bgcolor='.$this->bgcolormail.' leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:3em; padding-bottom:3em; text-align:center; background-color:'.$this->bgcolormail.'; width:100% !important;">'.$this->htmlbody.'</body>';
		$fullhtml .= '</html>';
		
		if($this->textbase64)
		{
			//echo "this->textbase64 = oui\r\n";
			//TEXT/PLAIN
			$m .= "--" . alternativeboundary . "\r\n";
			$m .= "Content-type:text/plain; charset=\"utf-8\"\r\n";
			$m .= "Content-Transfer-Encoding: base64"."\r\n\r\n";
			//test tmp
			$m .= chunk_split(base64_encode($this->stripoff($fullhtml)))."\r\n\r\n";
			//$m .= $this->stripoff($this->htmlbody)."\r\n\r\n";
			
			//TEXT/HTML
			$m .= "--" . alternativeboundary . "\r\n";
			$m .= "Content-type: text/html;charset=\"utf-8\"\r\n";
			$m .= "Content-Transfer-Encoding: base64"."\r\n\r\n";
			$m .= chunk_split(base64_encode($fullhtml))."\r\n\r\n";
			$m .= "--" . alternativeboundary . "--"."\r\n\r\n";
		}
		else
		{
			$fullhtml = $this->splithtml4mail($fullhtml);
			
			//echo "this->textbase64 = non \r\n";
			//TEXT/PLAIN
			$m .= "--" . alternativeboundary . "\r\n";
			$m .= "Content-type:text/plain; charset=\"utf-8\"\r\n";
			$m .= "Content-Transfer-Encoding: 8bit"."\r\n\r\n";
			//test tmp
			$m .= $this->stripoff($fullhtml)."\r\n\r\n";
			//$m .= $this->stripoff($this->htmlbody)."\r\n\r\n";
			
			//TEXT/HTML
			$m .= "--" . alternativeboundary . "\r\n";
			$m .= "Content-type: text/html;charset=\"utf-8\"\r\n";
			$m .= "Content-Transfer-Encoding: 8bit"."\r\n\r\n";
			$m .= $fullhtml."\r\n\r\n";
			$m .= "--" . alternativeboundary . "--"."\r\n\r\n";
		}

		$this->encoded_htmlbody =$m;
	}
}


?>
