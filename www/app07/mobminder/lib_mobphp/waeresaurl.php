<?php

//TEST URL
//define('waeresaurl','http://192.168.0.37/app05/booking/_assets/');
//PROD URL
define('waeresaurl','https://booking.mobminder.com/_assets/');


class C_WaEresaUrlGateaway
{
    public $curltimeout = 2000;

    public $lasthttpcode='';
    public $lasterrorcode='';
    public $lasterrormessage='';

    public function __construct() {}

    private function curlPostbase($requestbody,$suffixurl)
    {
        $curl = curl_init();

        $fullcurl = waeresaurl.$suffixurl;

        $postfields = //json_encode($requestbody);
        $postfields = $requestbody;
        //echo $postfields;

        $options = array(
            CURLOPT_URL            	=> $fullcurl,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => $postfields,
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->curltimeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            //CURLOPT_HTTPHEADER      => $this->payconiqheaders,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
       
        curl_setopt_array($curl,$options);

        $response = curl_exec($curl);

        if(!$response) { // error : The server is unreachable
            $this->lasthttpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $this->lasterrorcode= 'CURL_ERROR';
            $this->lasterrormessage=curl_error($curl);
            curl_close($curl);
            return false;
        }
        else
        {
            $this->lasthttpcode= curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            
            if(substr($this->lasthttpcode,0,1)=='2') //success
            {
                $this->lasterrorcode='';
                $this->lasterrormessage='';
                return true;
            }
            else
            {
                $this->lasterrorcode= 'OTHER_ERROR';
                $this->lasterrormessage=$response;
                return false;
            }
        }
    }
    public function createUrl($postfixurl,$eresaIdentMode) 
    {
        //sample : http://192.168.0.37/app05/booking/_assets/post/wa_eresa_url.php?postfixurl=oxteodev5&eresaIdentMode=1
        $suffixurl = 'post/wa_eresa_url.php';
        $requestbody = array
        (
            'postfixurl' => $postfixurl,
            'eresaIdentMode' => $eresaIdentMode
        );
        return $this->curlPostbase($requestbody,$suffixurl);
    }
    public function deleteUrl($postfixurl) 
    {
        //sample http://192.168.0.37/app05/booking/_assets/delete/wa_eresa_url.php?postfixurl=oxteodev5
        $suffixurl = 'delete/wa_eresa_url.php';
        $requestbody = array
        (
            'postfixurl' => $postfixurl,
        );
        return $this->curlPostbase($requestbody,$suffixurl);
    }
}



?>
