<?php

/////////////////////////////////////////////////////////////////////////
//
//  GOCRYPTO INTEGRATION
//
//  1. pair terminal (oneshot)          initializeTerminal()
//  2. create payment (main action)     createGoCryptoPayment()
//  3. get transaction status (polling) checkGoCryptoStatus()
//  4. unpair terminal (never?)         resetTerminal()
//
//
/////////////////////////////////////////////////////////////////////////

define('gocrypto_debugmode',false);

define('gocrypto_state_inprogress','IN_PROGRESS');
define('gocrypto_state_success','SUCCESS'); //final status : payed!
define('gocrypto_state_declined','DECLINED');
define('gocrypto_state_underpaid','UNDERPAID');
define('gocrypto_state_terminated','TERMINATED'); //canceled by terminal
define('gocrypto_state_expired','EXPIRED');
define('gocrypto_state_failed','FAILED');
define('gocrypto_state_aborted','ABORTED'); //rmq : if softpay is already opened, a payment could be SUCCESS after ABORTED!


/*Pair Response Example
{
    "cashier_id": "619e4ca0-a24d-4225-a84a-aefac2dc80f0",
    "cashier_name": "My Cash Register",
    "client_id": "4ur3V7VEuhxTf4PGMLD7U8Zk1sFqicLEF6BoXoFC",
    "client_secret": "y2Y4i8NdbNxRBAO0SKReNxQ3rLZEIsp5LvcDiL8Kf01DkmPzuMgVcF6U8U3YLO1ZAQs6YZ2Yp5Yb5qUOKHyxQhvZiZVjoGvj29c0agbE5PTkabDWsoU3j7bM55wyETyK"
}*/

//structure returnesd by pair API
class C_GoCrypto__PairResponse
{
    //private $content;
    public $cashier_id;
    public $cashier_name;
    public $client_id;
    public $client_secret;
    
    public function __construct($response)
    {
        $content = json_decode($response);
        //foreach($content as $member) 
        //    $this->{$member} = $content->{$member};
        $this->cashier_id = $content->{'cashier_id'}; //not used
        $this->cashier_name = $content->{'cashier_name'}; //not used
        $this->client_id = $content->{'client_id'};
        $this->client_secret = $content->{'client_secret'};
    }
  

}
class C_GoCryptoGateaway
{
    //production url
    //private static $baseUrl = 'https://proxy.gocrypto.com';
    //testing url
    // private static $baseUrl = 'https://proxy.staging.gocrypto.com'; 
    
    private static $timeout = 3000; //300 is too short!

    private $clientId;
    private $clientSecret;
    private $groupId;

    //public $token;  

    //last call status, code and message
    public $httpStatus; 
    public $errorCode;
    public $errorMessage;

    private static function getBaseUrl($groupId)
    {
        //bsp group connects to testing environment
        if($groupId==3925) return 'https://proxy.staging.gocrypto.com';
        else return 'https://proxy.gocrypto.com';
    }

    ////////////////////////////////////////////////////////////
    // Obtain the credentials for cashier (cash register) by passing the OTP received from the device
    // pair is static because the C_GoCryptoGateaway object is only useful after client id and client secret generation
    ////////////////////////////////////////////////////////////
    public static function pair($otp,$name,$groupId)
    {   
        if(gocrypto_debugmode) echo 'calling pair'.'<br/>';

        $requestbody = array(
            'flow_type' => 'CLASSIC',
            'name'=> $name,
            'otp'=> $otp
        );
        if(gocrypto_debugmode) echo 'pair.resquestbody = '.json_encode($requestbody).'</br>';

        $headers = [
            'Content-Type: application/json'
        ];
        if(gocrypto_debugmode) echo 'pair.headers= '.json_encode($headers).'</br>';
        
        $url = self::getBaseUrl($groupId).'/cashier/pair/';
        if(gocrypto_debugmode) echo 'pair.url= '.$url.'<br/>';

    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => json_encode($requestbody),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> self::$timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        if(gocrypto_debugmode) echo 'pair.response='.$response.'<br/>';

        $httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if(gocrypto_debugmode) echo 'pair.http status = '.$httpStatus.'</br>';


        if(!$response) { // The server is unreachable
            if(gocrypto_debugmode) echo 'pair.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(gocrypto_debugmode) echo 'pair.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('gocrypto.php', 'pair','url=['.$url.'],errtext=['.$curlerror.']',$groupId);
            return false;
        }
        else
        {
            curl_close($curl);

            if(substr($httpStatus,0,1)!='2')
            {
                if(gocrypto_debugmode) echo 'pair.result=server failure<br/>';

                $obj = json_decode($response);
                $code = $obj->{'code'};
                $message = json_encode($obj->{'message'}); //$obj->{'message'};
                if(gocrypto_debugmode) echo 'pair.code='.$code.'<br/>';
                if(gocrypto_debugmode) echo 'pair.message='.$message.'<br/>';

                C_dS_exception::put('gocrypto.php', 'pair','httpcode=['.$httpStatus.'],url=['.$url.'],code=['.$code.'],message=['.$message.']',$groupId);

                return false;

            }
            else
            {
                if(gocrypto_debugmode) echo 'pair.result=server success<br/>';

                $result = new C_GoCrypto__PairResponse($response);
                if(gocrypto_debugmode) echo 'pair.result.cashier_id='.$result->cashier_id.'<br/>';
                if(gocrypto_debugmode) echo 'pair.result.cashier_name='.$result->cashier_name.'<br/>';
                if(gocrypto_debugmode) echo 'pair.result.client_id='.$result->client_id.'<br/>';
                if(gocrypto_debugmode) echo 'pair.result.client_secret='.$result->client_secret.'<br/>';
                
                return $result;
            }
        }
    }

    public function __construct($clientId=false,$clientSecret=false,$groupId=false)
    {
        $this->clientId=$clientId;
        $this->clientSecret=$clientSecret;
        $this->groupId=$groupId;

    }
    ////////////////////////////////////////////////////////////
    //Unpair the cashier and the device. A new OTP will be required to pair again
    ////////////////////////////////////////////////////////////
    public function unpair($token) //
    {   
        if(gocrypto_debugmode) echo 'calling unpair'.'<br/>';

        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer '.$token,
        ];
        if(gocrypto_debugmode) echo 'unpair.headers= '.json_encode($headers).'</br>';
        
        $url = self::getBaseUrl($this->groupId).'/cashier/unpair/';
        if(gocrypto_debugmode) echo 'unpair.url= '.$url.'<br/>';

        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => false,
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> self::$timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        if(gocrypto_debugmode) echo 'unpair.response='.$response.'<br/>';

        //never happen!
        /*if(!$response) { // The server is unreachable
            if(gocrypto_debugmode) echo 'unpair.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(gocrypto_debugmode) echo 'unpair.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('gocrypto.php', 'unpair','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else
        {*/
            $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if(gocrypto_debugmode) echo 'unpair.http status = '.$this->httpStatus.'</br>';
            curl_close($curl);

            if(substr($this->httpStatus,0,1)!='2')
            {
                if(gocrypto_debugmode) echo 'unpair.result=server failure<br/>';

                $obj = json_decode($response);
                $this->errorCode = $obj->{'code'};
                $this->errorMessage = json_encode($obj->{'message'}); //$obj->{'message'};
                if(gocrypto_debugmode) echo 'unpair.code='.$this->errorCode.'<br/>';
                if(gocrypto_debugmode) echo 'unpair.message='.$this->errorMessage.'<br/>';

                //if($this->errorCode!=gocrypto_code_not_authenticated)
                if($this->httpStatus!='401')
                {
                    C_dS_exception::put('gocrypto.php', 'unpair','httpcode=['.$this->httpStatus.'],url=['.$url.'],code=['.$this->errorCode.'],message=['.$this->errorMessage.']',$this->groupId);
                }

                return false;

            }
            else
            {
                if(gocrypto_debugmode) echo 'pair.result=server success<br/>';
                return true;
            }
        //}
    }
    ////////////////////////////////////////////////////////////
    // Authentication is mandatory for all the steps below. After obtaining the credentials from the pair, follow the integration instructions.
    ////////////////////////////////////////////////////////////
    public function requestToken() //
    {
        if(gocrypto_debugmode) echo 'calling requestToken'.'<br/>';
        $requestbody = array(
            'grant_type' => 'client_credentials',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
        );
        if(gocrypto_debugmode) echo 'requestToken.resquestbody = '.json_encode($requestbody).'</br>';

        $url = self::getBaseUrl($this->groupId).'/auth/token/';
        
        if(gocrypto_debugmode) echo 'requestToken.url= '.$url.'<br/>';
    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => json_encode($requestbody),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> self::$timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            //CURLOPT_HTTPHEADER      => false, //$headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        if(gocrypto_debugmode) echo 'requestToken.response='.$response.'<br/>';

        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if(gocrypto_debugmode) echo 'requestToken.httpStatus='.$this->httpStatus.'<br/>';
    
        //$this->token=null;

        if(!$response) { // The server is unreachable
            if(gocrypto_debugmode) echo 'requestToken.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(gocrypto_debugmode) echo 'requestToken.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('gocrypto.php', 'requestToken','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else
        {
            curl_close($curl);

            if(substr($this->httpStatus,0,1)!='2')
            {
                if(gocrypto_debugmode) echo 'requestToken.result=server failure<br/>';
                C_dS_exception::put('gocrypto.php', 'unpair','httpcode=['.$this->httpStatus.'],url=['.$url.'],response=['.$response.']',$this->groupId);
                return false;
            }
            else
            {
                if(gocrypto_debugmode) echo 'requestToken.result=server success<br/>';
                $obj = json_decode($response);
                $token=$obj->{'access_token'};
                $token_type = $obj->{'token_type'};
                $expires_in = $obj->{'expires_in'};

                if(gocrypto_debugmode) echo 'requestToken.token='.$token.'<br/>';
                if(gocrypto_debugmode) echo 'requestToken.token_type='.$token_type.'<br/>';
                if(gocrypto_debugmode) echo 'requestToken.expires_in='.$expires_in.'<br/>';
                return $token;
            }
        }
    }
    ////////////////////////////////////////////////////////////
    // Get the transaction status from the system updated by the device
    ////////////////////////////////////////////////////////////
    public function getTransactionStatus($token,$transactionId) //
    {
        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer '.$token
        ];

        if(gocrypto_debugmode) echo 'getTransactionStatus.headers= '.json_encode($headers).'</br>';
     
        $url = self::getBaseUrl($this->groupId).'/cashier/transactions/'.$transactionId.'/status/';
        if(gocrypto_debugmode) echo 'getTransaction.url='.$url.'<br/>';
    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => false,
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> self::$timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        if(gocrypto_debugmode) echo 'getTransactionStatus.response='.$response.'<br/>';

        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if(gocrypto_debugmode) echo 'getTransactionStatus.httpStatus='.$this->httpStatus.'<br/>';

            
        if(!$response) { // The server is unreachable
            if(gocrypto_debugmode) echo 'getTransactionStatus.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(gocrypto_debugmode) echo 'getTransactionStatus.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('gocrypto.php', 'getTransactionStatus','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else
        {
           
            curl_close($curl);
            
            if(substr($this->httpStatus,0,1)!='2')
            {
                if(gocrypto_debugmode) echo 'getTransactionStatus.result=server failure<br/>';
                
                $obj = json_decode($response);
                $this->errorCode = $obj->{'code'};
                $this->errorMessage = json_encode($obj->{'message'}); //$obj->{'message'};
                if(gocrypto_debugmode) echo 'getTransactionStatus.code='.$this->errorCode.'<br/>';
                if(gocrypto_debugmode) echo 'getTransactionStatus.message='.$this->errorMessage.'<br/>';
                {
                    C_dS_exception::put('gocrypto.php', 'getTransactionStatus','httpcode=['.$this->httpStatus.'],url=['.$url.'],code=['.$this->errorCode.'],message=['.$this->errorMessage.']',$this->groupId);
                }
                return false;

                   
            }
            else
            {
                if(gocrypto_debugmode) echo 'getTransactionStatus.result=server success<br/>';
                if(gocrypto_debugmode) echo 'response='.$response.'<br/>';
                $content = json_decode($response);
                $status=$content->{'status'};
                return $status;
            }
        }
    }
    ////////////////////////////////////////////////////////////
    // Creates a new payment to be sent to the device
    ////////////////////////////////////////////////////////////
    public function createPayment($token,$amount,$paymentReference,$printSlip) //
    {
        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer '.$token
        ];
        if(gocrypto_debugmode) echo 'generatePayment.headers= '.json_encode($headers).'</br>';

        $requestbody = array(
            'amount' => $amount,
            'currency' => 'EUR',
            'discount'=> 0,
            //'tip_amount' => 0,
            'payment_method' => 'CARD',
            'payment_reference' => $paymentReference,
            'print_slip' => $printSlip
            
        );
        if(gocrypto_debugmode) echo 'generatePayment.resquestbody = '.json_encode($requestbody).'</br>';

        $url = self::getBaseUrl($this->groupId).'/cashier/payments/generate/';
        if(gocrypto_debugmode) echo 'generatePayment.url='.$url.'<br/>';
    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => json_encode($requestbody),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> self::$timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        if(gocrypto_debugmode) echo 'generatePayment.response='.$response.'<br/>';


        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if(gocrypto_debugmode) echo 'generatePayment.httpStatus='.$this->httpStatus.'<br/>';
   
        if(!$response) { // The server is unreachable
            if(gocrypto_debugmode) echo 'generatePayment.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(gocrypto_debugmode) echo 'generatePayment.error : httpstatus=['.$this->httpStatus.'], url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('gocrypto.php', 'generatePayment','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else
        {
            curl_close($curl);
            
            if(gocrypto_debugmode) echo 'generatePayment.response:'.$response.'<br/>';
            
            if(substr($this->httpStatus,0,1)!='2')
            {
                if(gocrypto_debugmode) echo 'generatePayment.result=server failure<br/>';

                $obj = json_decode($response);
                $this->errorCode = $obj->{'code'};
                $this->errorMessage = json_encode($obj->{'message'}); //$obj->{'message'};
                if(gocrypto_debugmode) echo 'generatePayment.code='.$this->errorCode.'<br/>';
                if(gocrypto_debugmode) echo 'generatePayment.message='.$this->errorMessage.'<br/>';


                if($this->httpStatus!='401')
                {
                    C_dS_exception::put('gocrypto.php', 'generatePayment','httpcode=['.$this->httpStatus.'],url=['.$url.'],code=['.$this->errorCode.'],message=['.$this->errorMessage.']',$this->groupId);
                }
                return false;

            }
            else
            {
                if(gocrypto_debugmode) echo 'postTransaction.result=server success<br/>';

                $content = json_decode($response);
                $ransactionId=$content->{'transaction_id'};
                return $ransactionId;
                
            }
        }
    }

    ////////////////////////////////////////////////////////////
    //Aborts an active payment that exists on the device
    ////////////////////////////////////////////////////////////
    public function abortPayment($token,$transactionId)
    {
        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer '.$token
        ];
        if(gocrypto_debugmode) echo 'abortPayment.headers= '.json_encode($headers).'</br>';

        $requestbody = array(
            'transaction_id' => $transactionId
        );
        if(gocrypto_debugmode) echo 'abortPayment.resquestbody = '.json_encode($requestbody).'</br>';

        $url = self::getBaseUrl($this->groupId).'/cashier/payments/abort/';
        if(gocrypto_debugmode) echo 'abortPayment.url='.$url.'<br/>';

        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => json_encode($requestbody),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> self::$timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        if(gocrypto_debugmode) echo 'abortPayment.response='.$response.'<br/>';

        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if(gocrypto_debugmode) echo 'abortPayment.httpStatus='.$this->httpStatus.'<br/>';

            
        /*if(!$response) { // The server is unreachable
            if(gocrypto_debugmode) echo 'abortPayment.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(gocrypto_debugmode) echo 'abortPayment.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('gocrypto.php', 'abortPayment','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else
        {*/
           
        curl_close($curl);
        
        if(substr($this->httpStatus,0,1)!='2')
        {
            if(gocrypto_debugmode) echo 'abortPayment.result=server failure<br/>';
            
            $obj = json_decode($response);
            $this->errorCode = $obj->{'code'};
            $this->errorMessage = json_encode($obj->{'message'}); //$obj->{'message'};
            if(gocrypto_debugmode) echo 'abortPayment.code='.$this->errorCode.'<br/>';
            if(gocrypto_debugmode) echo 'abortPayment.message='.$this->errorMessage.'<br/>';
            {
                C_dS_exception::put('gocrypto.php', 'abortPayment','httpcode=['.$this->httpStatus.'],url=['.$url.'],code=['.$this->errorCode.'],message=['.$this->errorMessage.']',$this->groupId);
            }
            return false;

                
        }
        else
        {
            if(gocrypto_debugmode) echo 'abortPayment.result=server success<br/>';
            //if(gocrypto_debugmode) echo 'response='.$response.'<br/>';
            //response is empty
            return true;
        }

        //}
    }

    public function isServerAlive()
    {
        $wait = 1; // wait Timeout In Seconds
        $host = str_replace('https://','',self::getBaseUrl($this->groupId));
        $fp = @fsockopen($host, 443, $errCode, $errStr, $wait);
        if($fp) 
        {
            //echo 'SUCCESS';
            fclose($fp);
            return true;
        } 
        else 
        {
            //echo "ERROR: $errCode - $errStr";
            return false;
        }
    }
}

//////////////////////////////////////////////////////////////////////
// call pair API : Obtain the credentials for cashier (cash register) by passing the OTP received from the device
// and save clientId and clientSecret into dSGroup (token is simply reset)
// pair cannot be called if the terminal is already paired, need to call unpair before
//
// inputs:
// =======
// $dS_Group : group related to gocrypto customer
// $otp : Pairing code received from device used for pairing to cashier, OTP = One Time Password
// $name : Descriptive name of cashier, will be visible on device
//
// result: 
// - true => success
// - false => failure : invalid OTP, terminal already paired, network error, etc (exception in database)
//////////////////////////////////////////////////////////////////////
function initializeTerminal($dS_Group,$otp,$name)
{
    $result = C_GoCryptoGateaway::pair($otp,$name,$dS_Group->id);
    if(!$result)
    {
        return false;
    }
    else
    {

        $dS_Group->ePayHardPayClientId = $result->client_id;
        $dS_Group->ePayHardPayClientSecret = $result->client_secret;
        $dS_Group->ePayHardPayToken = '';
        
        $dS_Group->dSsave();
        
        return true;
    }
}

//////////////////////////////////////////////////////////////////////
// call unpair API : Unpair the cashier and the device. A new OTP will be required to pair again
//
// inputs:
// =======
// $dS_Group : group related to gocrypto customer
//
// result: 
// - true => success
// - false => failure : invalid credentials, terminal already unpaired, network error, etc (exception in database)
//////////////////////////////////////////////////////////////////////
function resetTerminal($dS_Group)
{
    if(gocrypto_debugmode) echo 'calling resetTerminal...'.'<br/>';
    if(gocrypto_debugmode) echo 'resetTerminal.clientid ='.$dS_Group->ePayHardPayClientId.'<br/>';
    if(gocrypto_debugmode) echo 'resetTerminal.clientsecret ='.$dS_Group->ePayHardPayClientSecret.'<br/>';
    $gw = new C_GoCryptoGateaway($dS_Group->ePayHardPayClientId,$dS_Group->ePayHardPayClientSecret,$dS_Group->id);

    $try=0;
    while($try<2)
    {
        if(empty($dS_Group->ePayHardPayToken))
        {
            if(gocrypto_debugmode) echo 'resetTerminal.token is empty'.'<br/>';
            $token = $gw->requestToken();
            if(!$token)
            {
                if(gocrypto_debugmode) echo 'resetTerminal.requestToken => error'.'<br/>';
                return false;
            }
            else
            {
                if(gocrypto_debugmode) echo 'resetTerminal.requestToken = success'.'<br/>';
                if(gocrypto_debugmode) echo 'resetTerminal.token=['.$token.']<br/>';
                $dS_Group->ePayHardPayToken = $token;
                $dS_Group->saveHardPayToken();
            }
        }
        else
        {
            if(gocrypto_debugmode) echo 'resetTerminal.token exists'.'<br/>';
            $token = $dS_Group->ePayHardPayToken;
        }
        
        $res = $gw->unpair($token);
        if(!$res)
        {
            if($gw->httpStatus=='401') //invalid token (expired)
            {
                $try++;
                if(gocrypto_debugmode) echo 'resetTerminal.try++ = '.$try.'<br/>';
                if(gocrypto_debugmode) echo 'resetTerminal.unpair = failure'.'<br/>';
                $dS_Group->ePayHardPayToken='';
            }
            else
            {
                if(gocrypto_debugmode) echo 'resetTerminal.unpair = failure'.'<br/>'; 
                return false;
            }
        }
        else
        {
            if(gocrypto_debugmode) echo 'resetTerminal.unpair = success'.'<br/>'; 
            $dS_Group->ePayHardPayClientId = ''; 
            $dS_Group->ePayHardPayClientSecret = ''; 
            $dS_Group->ePayHardPayToken = '';
            $dS_Group->dSsave();
            return true;
        }
    }
    return false;
}



//////////////////////////////////////////////////////////////////////
//  
// create a gocrypto payment request on server
//
// inputs:
// =======
// $dS_Group: 
// $amount : amount in minor units, e.g. cents (2500 = 25€)
// $paymenId : mobminder reference number sent to gocrypto server (Reference, which is subject to acquirer restrictions)
// $printSlip : print or not the splip (bool)
//
// result: gocrypto transaction_id (string), will be used for polling transaction status
// =======
//
//////////////////////////////////////////////////////////////////////
function createGoCryptoPayment($dS_Group,$amount,$paymentId,$printSlip)
{
    if(gocrypto_debugmode) echo 'calling createGoCryptoPayment...'.'<br/>';
    if(gocrypto_debugmode) echo 'createGoCryptoPayment.clientid  ='.$dS_Group->ePayHardPayClientId.'<br/>';
    if(gocrypto_debugmode) echo 'createGoCryptoPayment.clientsecret  ='.$dS_Group->ePayHardPayClientSecret.'<br/>';
    $gw = new C_GoCryptoGateaway($dS_Group->ePayHardPayClientId,$dS_Group->ePayHardPayClientSecret,$dS_Group->id);

    $try=0;
    //note : while($try<2) mecanism is explained in softpayio.CreateSoftPayPayment function
    while($try<2)
    {
        if(empty($dS_Group->ePayHardPayToken))
        {
            if(gocrypto_debugmode) echo 'createGoCryptoPayment.group.token is empty'.'<br/>';
            $token = $gw->requestToken();
            if(!$token)
            {
                if(gocrypto_debugmode) echo 'createGoCryptoPayment.requestToken => error'.'<br/>';
                return false;
            }
            else
            {
                if(gocrypto_debugmode) echo 'createGoCryptoPayment.requestToken = success'.'<br/>';
                if(gocrypto_debugmode) echo 'createGoCryptoPayment.token=['.$token.']<br/>';
                $dS_Group->ePayHardPayToken = $token;
                $dS_Group->saveHardPayToken();
            }
        }
        else
        {
            if(gocrypto_debugmode) echo 'createGoCryptoPayment.group.token exists'.'<br/>';
            //$token = $dS_Group->ePayHardPayToken;
        }
        
        $paymentReference = ''.$paymentId; //convert to string format

        $reqpayresp = $gw->createPayment($dS_Group->ePayHardPayToken, $amount,$paymentReference,$printSlip);
        if(!$reqpayresp)
        {
            if($gw->httpStatus=='401') //invalid token (expired)
            {
                $try++;
                if(gocrypto_debugmode) echo 'createGoCryptoPayment try++ = '.$try.'<br/>';
                if(gocrypto_debugmode) echo 'createGoCryptoPayment createPayment = failure'.'<br/>';
                $dS_Group->ePayHardPayToken='';
            }
            else
            {
                return false;
            }
        }
        else
        {
            if(gocrypto_debugmode) echo 'createGoCryptoPayment createPayment = success'.'<br/>'; 
            if(gocrypto_debugmode) echo 'createGoCryptoPayment createPayment transactionId = '.$reqpayresp.'<br/>';
            return $reqpayresp;
        }
    }
    return false;
}

//////////////////////////////////////////////////////////////////////
//  
// get gocrypto payment status from server (only used by polling cron)
//
// inputs:
// =======
// $transid :  gocrypto request id, to store as transid
//
// result: gocrypto status (string) values : IN_PROGRESS,SUCCESS,DECLINED,UNDERPAID,TERMINATED,EXPIRED,FAILED
// =======
//
//////////////////////////////////////////////////////////////////////
function checkGoCryptoStatus($dS_Group,$transid)
{
    if(gocrypto_debugmode) echo 'calling CheckGoCryptoStatus...'.'<br/>';

    $gw = new C_GoCryptoGateaway($dS_Group->ePayHardPayClientId,$dS_Group->ePayHardPayClientSecret,$dS_Group->id);

    $try=0;
    //note : while($try<2) mecanism is explained in softpayio.CreateSoftPayPayment function
    while($try<2)
    {
        if(empty($dS_Group->ePayHardPayToken))
        {
            if(gocrypto_debugmode) echo 'CheckGoCryptoStatus.group.token is empty'.'<br/>';
            $token = $gw->requestToken();
            if(!$token)
            {
                if(gocrypto_debugmode) echo 'CheckGoCryptoStatus.requestToken => error'.'<br/>';
                return false;
            }
            else
            {
                if(gocrypto_debugmode) echo 'CheckGoCryptoStatus.requestToken = success'.'<br/>';
                if(gocrypto_debugmode) echo 'CheckGoCryptoStatus.token=['.$token.']<br/>';
                $dS_Group->ePayHardPayToken = $token;
                $dS_Group->saveHardPayToken();
            }
        }
        else
        {
            if(gocrypto_debugmode) echo 'CheckGoCryptoStatus.group.token exists'.'<br/>';
            //$gw->token = $dS_Group->ePayHardPayToken;
            
        }
        $transactionId = $transid;
		$resgettrans = $gw->getTransactionStatus($dS_Group->ePayHardPayToken, $transactionId);
        if(!$resgettrans)
        {
            if($gw->httpStatus=='401') //invalid token (expired)
            {
                $try++;
                if(gocrypto_debugmode) echo 'CheckGoCryptoStatus try++ = '.$try.'<br/>';
                if(gocrypto_debugmode) echo 'CheckGoCryptoStatus requestPayment = failure'.'<br/>';
                $dS_Group->ePayHardPayToken='';
            }
            else
            {
                return false;
            }
        }
        else
        {
            return $resgettrans;
        }
    }
    return false;
}


function deleteGoCryptoPayment($dS_Group,$transid)
{
    if(gocrypto_debugmode) echo 'calling deleteGoCryptoPayment...'.'<br/>';

    $gw = new C_GoCryptoGateaway($dS_Group->ePayHardPayClientId,$dS_Group->ePayHardPayClientSecret,$dS_Group->id);

    $try=0;
    //note : while($try<2) mecanism is explained in softpayio.CreateSoftPayPayment function
    while($try<2)
    {
        if(empty($dS_Group->ePayHardPayToken))
        {
            if(gocrypto_debugmode) echo 'deleteGoCryptoPayment.group.token is empty'.'<br/>';
            $token = $gw->requestToken();
            if(!$token)
            {
                if(gocrypto_debugmode) echo 'deleteGoCryptoPayment.requestToken => error'.'<br/>';
                return false;
            }
            else
            {
                if(gocrypto_debugmode) echo 'deleteGoCryptoPayment.requestToken = success'.'<br/>';
                if(gocrypto_debugmode) echo 'deleteGoCryptoPayment.token=['.$token.']<br/>';
                $dS_Group->ePayHardPayToken = $token;
                $dS_Group->saveHardPayToken();
            }
        }
        else
        {
            if(gocrypto_debugmode) echo 'deleteGoCryptoPayment.group.token exists'.'<br/>';
            //$gw->token = $dS_Group->ePayHardPayToken;
            
        }
        $transactionId = $transid;
		$resabort = $gw->abortPayment($dS_Group->ePayHardPayToken, $transactionId);
        if(!$resabort)
        {
            if($gw->httpStatus=='401') //invalid token (expired)
            {
                $try++;
                if(gocrypto_debugmode) echo 'deleteGoCryptoPayment try++ = '.$try.'<br/>';
                if(debugmode) echo 'deleteGoCryptoPayment requestPayment = failure'.'<br/>';
                $dS_Group->ePayHardPayToken='';
            }
            else
            {
                return false;
            }
        }
        else
        {
            return $resabort;
        }
    }
    return false;
}

function isGoCryptoServerAlive($dS_Group=false)
{
    if($dS_Group)
        $gw = new C_GoCryptoGateaway($dS_Group->ePayHardPayClientId,$dS_Group->ePayHardPayClientSecret,$dS_Group->id);
    else
        $gw = new C_GoCryptoGateaway();

    return $gw->isServerAlive();
}

?>