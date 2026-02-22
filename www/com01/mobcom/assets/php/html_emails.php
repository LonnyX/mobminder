<?php


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I Z A R D     C O N F I R M A T I O N
//
// Dev & Test : http://localhost:8888/mobcom/assets/php/email_test.php
//
// Effective sending: https://mobminder.com/assets/php/email_test.php
//
//

//


$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '/assets/imgs/emails'; // same in production as in local
$http = 'https';
$environment = 'PROD!';
if(isset($subfolders[1])) {
	if($host=='localhost:8888') { // then we run local dev
		$uri_1 = '/mobcom/assets/imgs/emails'; // then you are in locahost testing.
		$http = 'http';
		$environment = 'DEV :)';
	}
}
$imageshost = $http.'://'.$host.$uri_1; // is local "http://localhost/comm" and prod "https://be.mobminder.com/comm"


	// connect to DB and bring all Xlations to their respective places
	
$dbioxl = new mysqli('localhost' /*host*/, 'mobminder' /*user*/, 'tgx23PiQ' /*pw*/, 'newmobcom' /*db*/);
$dbioxl->query('SET NAMES utf8');

function X($tn, $page = false) {
	global $dbioxl, $l, $p, $ixl;
	if($page) $qp = $page; else $qp = 'wizard';
	$sql='select id, fr, '.$l.' from xlations where tn = "'.$tn.'" and page = "'.$qp.'";';
	$r = $dbioxl->query($sql);
	if($r===false) echo $dbioxl->errno.' -> '.$dbioxl->error;
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

//////////////////////////////////////////////////////////////////////////////// 
//
//  MAKE RECIPIENTS
//

class C_email {

	public $addressee;
	public $replyto;
	public $subject;
	public $html;
	public $boundary;
	public $bgcolormail;


	public function __construct($addressee, $replyto, $subject, $html, $bgcolormail='white') {
		
		$this->addressee = $addressee;
		$this->replyto = $replyto;
		$this->subject = $subject;
		$this->html = $html;
		$this->bgcolormail = $bgcolormail;
		$this->boundary = uniqid('np');
	}

	public function subject() { return $this->subject;}
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	
	public function html() {
	
		return $this->html;

	}
	public function headbody() {
		// note that html head title should match with email subject in order to ensure delivery to inbox ( iso spam :) 
		$header = '
				<head>
					<title>'.$this->subject().'</title>
				</head>'; 
		$body = '<body bgcolor='.$this->bgcolormail.' leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:3em; padding-bottom:3em; text-align:center; background-color:'.$this->bgcolormail.'; width:100% !important;">'.$this->html().'</body>';
		return $header.$body;
	}
	public function compound() { // compose message from html and plain text parts
		
		//here is the content body
		$m = "This is a MIME encoded message.";
		$m .= "\r\n\r\n--" . $this->boundary . "\r\n";

		//Plain text body
		$m .= "Content-type: text/plain;charset=utf-8\r\n\r\n";
		$m .= $this->plaintextbody();
		$m .= "\r\n\r\n--" . $this->boundary . "\r\n";

		//Html body
		$htmlheadbody = '<html>'.$this->headbody().'</html>';
		$htmlheadbody = $this->splithtml4mail($htmlheadbody);
		$m .= "Content-type: text/html;charset=utf-8\r\n\r\n";
		$m .= $htmlheadbody;
		$m .= "\r\n\r\n--" . $this->boundary . "--";
		
		return $m;
	}
	public function send() { // invokes PHP mail to mailsever

		if(!$this->addressee) return true; // skip this oject having no email
		
		//specify the email address you are sending to, and the email subject
		//$namee = $this->addressee;
		
		//headers - specify your from email address and name here
		//and specify the boundary for the email
		$headers  = "MIME-Version: 1.0\r\n";
		$headers .= "From: Mobminder <communication@mobminder.com>\r\n";
		//$headers .= "To: ".$namee."\r\n";
		$headers .= "Reply-To: Mobminder <".$this->replyto.">\r\n"; // only appearing on user interface, used by mail programs at client side
		$headers .= "X-Mailer: Mobminder/1.0\r\n";
		$headers .= "Content-Type: multipart/alternative; charset=UTF-8; boundary=".$this->boundary."\r\n";

		$message = $this->compound();
		//$message = $this->splithtml4mail($message);

		//$preferences = ["input-charset" => "UTF-8", "output-charset" => "UTF-8"];
		//$encoded_subject = iconv_mime_encode("Subject", $this->subject(), $preferences);
		$encoded_subject = '=?UTF-8?B?' . base64_encode($this->subject()) . '?=';
		
		//invoke the PHP mail function
		$result = mail($this->addressee, $encoded_subject, $message, $headers);
		return $result;
	}

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
				if (strlen($line)<=$maxlen)
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
					if ($lastindex != false)
						if ($lastindex>$splitcharindex)
							$splitcharindex = $lastindex;
				}

				//if a "<","=",";"," " character is found, then take its index to split the line
				//otherwise split at maxlen index
				if ($splitcharindex!=-1) {
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
				if ($newlinelength >= $oldlinelength) {
					//never happen
					//error !must exit froom while loop!!
					break;
				}
			}
		}
		//build a string from array (separtor = char 13 + char 10)
		return implode($crlf, $result);
	}


	public function stripoff() {
		$in = $this->html();
		$out  = preg_replace('/<[^>]*>/', '', $in);
		$out  = trim(preg_replace('/\t+/', '', $out));
		$out  = preg_replace( '/\n\r/si', '', $out );
		return $out;
	}
}


?>