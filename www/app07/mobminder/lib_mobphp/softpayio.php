<?php

/////////////////////////////////////////////////////////////////////////
//
//  SOFTPAY INTEGRATION
//  https://developer.softpay.io/cloud/api-reference.html#openapi
//
/////////////////////////////////////////////////////////////////////////

define('debugmode',false);

//transactions status :
//DECLINED, CANCELLED and FAILED are final states that does not change. COMPLETED is usually final, but could still change if the transaction is cancelled.
define('softpay_state_processing','PROCESSING');
define('softpay_state_completed','COMPLETED');
define('softpay_state_declined','DECLINED');
define('softpay_state_cancelled','CANCELLED');
define('softpay_state_failed','FAILED');

class C_SoftPayIo_PostTansactionResultResponse
{
    //The request id associated with this transaction if and only if this transaction has been created locally by the POS app or remotely via the CloudSwitch API, otherwise null (if created directly in the Softpay app in standalone mode)
    public $requestId;
    
    //state of transaction
    public $state;

    public function __construct($response){
        $content = json_decode($response);
        //foreach($member in $content) 
        //    $this->{$member} = $content->{$member};
        $this->requestId = $content->{'requestId'};
        $this->state = $content->{'state'};
    }
}
class C_SoftPayIo_GetTansactionResultResponse{
    //appId of the app that carried out this transaction.
    public $appId;

    //state of transaction
    public $state;

    //masked pan of tapped payment card
    public $partialPan;

    //The POS reference number associated with the Transaction, if any.
    //public $posReferenceNumber;
    
    //Processing response code.
    public $responseCode;
    
    //Processing response message if available (in english)
    //public $responseMessage;

    public function __construct($response){
        $content = json_decode($response);
        //foreach($member in $content) 
        //    $this->{$member} = $content->{$member};
        if(property_exists($content, 'appId')) $this->appId = $content->{'appId'};
        $this->state = $content->{'state'};
        if(property_exists($content, 'partialPan')) $this->partialPan = $content->{'partialPan'};
        $this->posReferenceNumber = $content->{'posReferenceNumber'};
        if(property_exists($content, 'responseCode'))$this->responseCode = $content->{'responseCode'};
        //$this->responseMessage = $content->{'responseMessage'};
    }
   
}
class C_SoftPayIoGateaway{
    
    private $timeout = 1000; //300 is too short!

    private $clientId;
    private $clientSecret;
    private $groupId;
    private $baseUrl;
    private $baseUrlForAlive;
    
    //public $token;
    public $httpStatus;

    public function __construct($clientId=false,$clientSecret=false,$groupId=false){
        $this->clientId=$clientId;
        $this->clientSecret=$clientSecret;
        //$this->token=null;
        $this->groupId=$groupId;

        if($groupId==3925) //testing mode
        {
            //$baseUrl = 'https://api.dev.softpay.io/api-gateway/v1/api/cloud';
            //private $baseUrl = 'https://api.dev.softpay.io/api-gateway/v1/api/cloud';
            $this->baseUrl = 'https://api.sandbox.softpay.io/api-gateway/v1/api/cloud';
            $this->baseUrlForAlive = 'api.sandbox.softpay.io';
        }
        else //production mode
        {
            //TODO
            $this->baseUrl = 'https://api.sandbox.softpay.io/api-gateway/v1/api/cloud';
            $this->baseUrlForAlive = 'api.sandbox.softpay.io';
        }
    }

    //scope: "create:payment create:refund create:cancellation" ???

        
    function requestToken() //generate token from credential
    {
        if(debugmode) echo 'calling requestToken'.'<br/>';
        /*$requestbody = array(
            'grant_type' => 'client_credentials',//'',
            //'scope' => 'create:payment'
        );*/
        $data = 'grant_type=client_credentials';


        //if(debugmode) echo 'requestToken.resquestbody = '.json_encode($requestbody).'</br>';

        $key = $this->clientId.':'.$this->clientSecret;
        //if(debugmode) echo 'requestToken.key(visible)= '.$key.'</br>';
        $key = base64_encode($key);
        //if(debugmode) echo 'requestToken.key(base64)= '.$key.'</br>';
        $headers = [
            'Content-Type: application/x-www-form-urlencoded',
            'Authorization: Basic '.$key,
        ];
        
        //echo $headers;
        //if(debugmode) echo 'requestToken.headers= '.json_encode($headers).'</br>';
        //$url = 'https://softpay-dev.eu.auth0.com/oauth/token';

        $url = 'https://auth.sandbox.softpay.io/oauth2/token'; //Sandbox
        //Production: https://auth.softpay.io/oauth2/token
        
        if(debugmode) echo 'requestToken.url= '.$url.'<br/>';


    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => $data,
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);

        //echo 'response='.$response.'<br/>';
    
        //$this->token=null;

        if(!$response) { // The server is unreachable
            if(debugmode) echo 'requestToken.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(debugmode) echo 'requestToken.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('softpayio.php', 'requestToken','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else
        {
            $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if(debugmode) echo 'requestToken.http status = '.$this->httpStatus.'</br>';
            //if(debugmode) echo 'requestToken.response='.$response.'<br/>';
            curl_close($curl);

            if(substr($this->httpStatus,0,1)!='2'){ //status <> 2XX
                if(debugmode) echo 'requestToken.result=server failure<br/>';
                $obj = json_decode($response);
                $error = $obj->{'error'};
                if(property_exists($obj, 'error_description')) 
                    $error_description = $obj->{'error_description'};
                else
                    $error_description = '';
                if(debugmode) echo 'requestToken.error='.$error.'<br/>';
                if(debugmode) echo 'requestToken.error_description='.$error_description.'<br/>';
                C_dS_exception::put('softpayio.php', 'requestToken','httpcode=['.$this->httpStatus.'],url=['.$url.'],error=['.$error.'],errordescription=['.$error_description.']',$this->groupId);
                return false;
            }
            else{
                if(debugmode) echo 'requestToken.result=server success<br/>';
                $obj = json_decode($response);
                $token=$obj->{'access_token'};
                $token_type = $obj->{'token_type'};
                $expires_in = $obj->{'expires_in'};
                //if(debugmode) echo 'requestToken.token='.$this->token.'<br/>';
                //if(debugmode) echo 'requestToken.token_type='.$token_type.'<br/>';
                //if(debugmode) echo 'requestToken.expires_in='.$expires_in.'<br/>';
                return $token;
            }
        }
    }

    function requestPayment($token,$appId,$amount,$posReferenceNumber,$switchBackTimeout){ //create a new requestId and then create a payment
        $requestId = $this->postRequestforPayment($token);
        if(!$requestId){
            return false;
        }
        else{
            return $this->postTransaction($token,$requestId,$appId,$amount,$posReferenceNumber,$switchBackTimeout);
        }
    }

    function getTransaction($token,$requestId){ //retrieve transaction information for a given requestId
        $headers = [
            'Authorization: Bearer '.$token,
            'accept: application/json',
            'Content-Type: application/json'
        ];

        if(debugmode) echo 'getTransaction.headers= '.json_encode($headers).'</br>';
     

        //$url = $this->baseUrl.'/transaction/'.$requestId;
        $url = $this->baseUrl.'/transactions/'.$requestId;
        if(debugmode) echo 'getTransaction.url='.$url.'<br/>';
    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => false,
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            
        if(!$response) { // The server is unreachable
            if(debugmode) echo 'getTransaction.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(debugmode) echo 'getTransaction.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('softpayio.php', 'getTransactionStatus','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else{
            curl_close($curl);
            
            if(substr($this->httpStatus,0,1)!='2'){
                if(debugmode) echo 'getTransaction.result=server failure<br/>';
                $obj = json_decode($response);
                if(property_exists($obj, 'errorDomain')) $errorDomain = $obj->{'errorDomain'};
                else $errorDomain='';
                $errorCode = $obj->{'errorCode'};
                $message = $obj->{'message'};

                if(debugmode) echo 'getTransaction.errorDomain='.$errorDomain.'<br/>';
                if(debugmode) echo 'getTransaction.errorCode='.$errorCode.'<br/>';
                if(debugmode) echo 'getTransaction.message='.$message.'<br/>';

                if($this->httpStatus!='401'){
                    C_dS_exception::put('softpayio.php', 'getTransactionStatus','httpcode=['.$this->httpStatus.'],url=['.$url.'],errorDomain=['.$errorDomain.'],errorCode=['.$errorCode.'],message=['.$message.']',$this->groupId);
                }
                return false;
            }
            else{
                if(debugmode) echo 'getTransaction.result=server success<br/>';
                if(debugmode) echo 'response='.$response.'<br/>';

                //tmptesting : $response = str_replace('PROCESSING','COMPLETED',$response);
                return new C_SoftPayIo_GetTansactionResultResponse($response);
            }
        }
    }

    function deleteTransaction($token,$requestId) // Cancel a transaction with a specified requestId. The requestId must the requestId used when starting the transaction. Cancellations may be subject to restrictions governed by the acquirer. In some cases, transactions can only be cancelled within 10 minutes of completion. The endpoint is starting the cancellation process and the result must be retrieved using the GET endpoint.
    {
        $headers = [
            'Authorization: Bearer '.$token,
            'accept: application/json',
            'Content-Type: application/json'
        ];

        if(debugmode) echo 'deleteTransaction.headers= '.json_encode($headers).'</br>';
     

        //$url = $this->baseUrl.'/transaction/'.$requestId;
        $url = $this->baseUrl.'/transactions/'.$requestId;
        if(debugmode) echo 'deleteTransaction.url='.$url.'<br/>';
    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => false,
            CURLOPT_CUSTOMREQUEST   => 'DELETE',
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            
        if(!$response) { // The server is unreachable
            if(debugmode) echo 'deleteTransaction.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(debugmode) echo 'deleteTransaction.error : url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('softpayio.php', 'deleteTransaction','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else{
            curl_close($curl);
            
            if(substr($this->httpStatus,0,1)!='2'){
                if(debugmode) echo 'deleteTransaction.result=server failure<br/>';
                $obj = json_decode($response);
                if(property_exists($obj, 'errorDomain')) $errorDomain = $obj->{'errorDomain'};
                else $errorDomain='';
                $errorCode = $obj->{'errorCode'};
                $message = $obj->{'message'};

                if(debugmode) echo 'deleteTransaction.errorDomain='.$errorDomain.'<br/>';
                if(debugmode) echo 'deleteTransaction.errorCode='.$errorCode.'<br/>';
                if(debugmode) echo 'deleteTransaction.message='.$message.'<br/>';

                if($this->httpStatus!='401'){
                    C_dS_exception::put('softpayio.php', 'deleteTransaction','httpcode=['.$this->httpStatus.'],url=['.$url.'],errorDomain=['.$errorDomain.'],errorCode=['.$errorCode.'],message=['.$message.']',$this->groupId);
                }
                return false;
            }
            else{
                if(debugmode) echo 'deleteTransaction.result=server success<br/>';
                if(debugmode) echo 'response='.$response.'<br/>';

                //tmptesting : $response = str_replace('PROCESSING','COMPLETED',$response);
                return new C_SoftPayIo_PostTansactionResultResponse($response);
            }
        }
    }



    //internal function
    private function postRequestforPayment($token){ // create a requestId for payment
        $headers = [
            'Authorization: Bearer '.$token,
            'accept: application/json',
            'Content-Type: application/json'
        ];
        //if(debugmode) echo 'postRequestforPayment.headers= '.json_encode($headers).'</br>';

        $requestbody = array(
            'action' => 'PAYMENT',
        );
        //if(debugmode) echo 'postRequestforPayment.resquestbody = '.json_encode($requestbody).'</br>';


        //$url = $this->baseUrl.'/request-for';
        $url = $this->baseUrl.'/transactions';
        //if(debugmode) echo 'postRequestforPayment.url='.$url.'<br/>';
    
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
            CURLOPT_TIMEOUT_MS 		=> $this->timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        
        if(!$response) { // The server is unreachable
            if(debugmode) echo 'postRequestforPayment.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(debugmode) echo 'postRequestforPayment.error : httpstatus=['.$this->httpStatus.'], url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('softpayio.php', 'postRequestforPayment','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else{
            curl_close($curl);
            
            if(substr($this->httpStatus,0,1)!='2'){
                if(debugmode) echo 'postRequestforPayment.result=server failure<br/>';
                $obj = json_decode($response);
                if(property_exists($obj, 'errorDomain')) $errorDomain = $obj->{'errorDomain'};
                else $errorDomain='';
                $errorCode = $obj->{'errorCode'};
                $message = $obj->{'message'};

                if(debugmode) echo 'postRequestforPayment.errorDomain='.$errorDomain.'<br/>';
                if(debugmode) echo 'postRequestforPayment.errorCode='.$errorCode.'<br/>';
                if(debugmode) echo 'postRequestforPayment.message='.$message.'<br/>';

                if($this->httpStatus!='401'){
                    C_dS_exception::put('softpayio.php', 'postRequestforPayment','httpcode=['.$this->httpStatus.'],url=['.$url.'],errorDomain=['.$errorDomain.'],errorCode=['.$errorCode.'],message=['.$message.']',$this->groupId);
                }
                return false;
            }
            else{
                if(debugmode) echo 'postRequestforPayment.result=server success<br/>';
                $obj = json_decode($response);
                $requestId = $obj->{'requestId'};
                $expiresAt = $obj->{'expiresAt'};

                if(debugmode) echo 'postRequestforPayment.requestId='.$requestId.'<br/>';
                if(debugmode) echo 'postRequestforPayment.expiresAt='.$expiresAt.'<br/>';
             
                return $requestId;
            }
        }
    }
    //internal function
    private function postTransaction($token,$requestId,$appId,$amount,$posReferenceNumber,$switchBackTimeout) // create a payment (but need requestId created by postRequestforPayment)
    {
        $headers = [
            'Authorization: Bearer '.$token,
            'accept: application/json',
            'Content-Type: application/json'
        ];
        //if(debugmode) echo 'postTransaction.headers= '.json_encode($headers).'</br>';

        $requestbody = array(
            'appId'=>  $appId,
            //'transactionType'=>  'PURCHASE', no need anymore
            //'type'=>  'PURCHASE',
            'amount'=>  $amount,
            'currencyCode'=> 'EUR', //euro
            'schemeId'=>  '1', //1
            'posReferenceNumber'=>  $posReferenceNumber,
            'options'=> array(
                'receipt'=>  'LOCAL',
                //'cardHolderLocale'=>  $languageIso2,
                'appTitles'=> '',
                'appTexts'=> '',
                'amountIsoCodes'=>  false,
                'batchType'=> 'string',
                'switchBackTimeout'=>  $switchBackTimeout, //5000
                'suppressAppNotification' => false,
            
                //'storeCard'=>  'STORE_CARD_NO' no need anymore
            )
        );
        if(debugmode) echo 'postTransaction.resquestbody = '.json_encode($requestbody).'</br>';


        $url = $this->baseUrl.'/transactions/'.$requestId;
        if(debugmode) echo 'postTransaction.url='.$url.'<br/>';
    
        $curl = curl_init();
    
        $options = array(
            CURLOPT_CUSTOMREQUEST   => 'PUT',
            CURLOPT_URL            	=> $url,
            //CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => json_encode($requestbody),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->timeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
    
        $response = curl_exec($curl);
        $this->httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
   
    
        if(!$response) { // The server is unreachable
            if(debugmode) echo 'postTransaction.result=client failure<br/>';
            $curlerror = curl_error($curl);
            if(debugmode) echo 'postTransaction.error : httpstatus=['.$this->httpStatus.'], url=['.$url.'],errtext=['.$curlerror.']<br/>';
            curl_close($curl);
            C_dS_exception::put('softpayio.php', 'postTransaction','url=['.$url.'],errtext=['.$curlerror.']',$this->groupId);
            return false;
        }
        else{
            curl_close($curl);
            
            if(debugmode) echo 'postTransaction.response:'.$response;
            
            if(substr($this->httpStatus,0,1)!='2'){
                if(debugmode) echo 'postTransaction.result=server failure<br/>';
                $obj = json_decode($response);
                if(property_exists($obj, 'errorDomain')) $errorDomain = $obj->{'errorDomain'};
                else $errorDomain='';
                $errorCode = $obj->{'errorCode'};
                $message = $obj->{'message'};

                if(debugmode) echo 'postTransaction.errorDomain='.$errorDomain.'<br/>';
                if(debugmode) echo 'postTransaction.errorCode='.$errorCode.'<br/>';
                if(debugmode) echo 'postTransaction.message='.$message.'<br/>';

                if($this->httpStatus!='401'){
                    C_dS_exception::put('softpayio.php', 'postTransaction','httpcode=['.$this->httpStatus.'],url=['.$url.'],errorDomain=['.$errorDomain.'],errorCode=['.$errorCode.'],message=['.$message.']',$this->groupId);
                }

                return false;
            }
            else{
                if(debugmode) echo 'postTransaction.result=server success<br/>';
                return new C_SoftPayIo_PostTansactionResultResponse($response);
            }
        }
    }

    public function isServerAlive()
    {
        $wait = 1; // wait Timeout In Seconds
        $host = $this->baseUrlForAlive;
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
//  
// create a softpay payment requet on server
// update group token if necessary
//
// inputs:
// =======
// $dS_Group : group related to softpay customer (clientid, client secret)
// $amount : amount in minor units, e.g. cents (2500 = 25€)
// $paymentId : mobminder reference number sent to softpay server (Reference, which is subject to acquirer restrictions)
//
// result: C_SoftPayIo_PostTansactionResultResponse object
// =======
//  requestId => softpay : The request id associated with this transaction if and only if this transaction has been created locally by the POS app or remotely via the Cloud API, otherwise null (if created directly in the Softpay app in standalone mode)
//            => mobminder : to store as transid in payment record
//  state     => state of transaction : PROCESSING
//
//////////////////////////////////////////////////////////////////////
function CreateSoftPayPayment($dS_Group,$amount,$paymentId){
    if(debugmode) echo 'calling CreateSoftPayPayment...'.'<br/>';
    $switchBackTimeout='5000';
    
    //$dS_Group->ePaySoftPayClientSecret="aaa";
    //$dS_Group->ePaySoftPayToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InA1dk9FZVN6UlhlNGlhRzhHTWh2ZCJ9.eyJpc3MiOiJodHRwczovL3NvZnRwYXktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJOODZacjRTUjJpUjV0d2JXcjJHRjlqQ3JBQmNzU3FVUUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9jbG91ZC1zd2l0Y2guZGV2LnNvZnRwYXkuaW8iLCJpYXQiOjE2ODI0MTg5MDgsImV4cCI6MTY4MjUwNTMwOCwiYXpwIjoiTjg2WnI0U1IyaVI1dHdiV3IyR0Y5akNyQUJjc1NxVVEiLCJzY29wZSI6ImNyZWF0ZTpwYXltZW50IGNyZWF0ZTpyZWZ1bmQgY3JlYXRlOmNhbmNlbGxhdGlvbiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwYXltZW50IiwiY3JlYXRlOnJlZnVuZCIsImNyZWF0ZTpjYW5jZWxsYXRpb24iXX0.VQCc4z9ufWxo3-d4oCY19vkexkS01yumcu3ni8u1ou9wNklk2C7RNztOO72CUCU4P0KSOGSY8C-hCilXYBMzgojac7Sc7hqaVWD4ggzHn_PIMS2ZMXnRSsXrAjjJPPyDA-FbzImVMqUpssMDpw-hZ58RoFAUu6qJjjvmrq62LZZzFkhMegsgFLE6wQ31vQKKDNXux8NsKXdWrlIm05qQXGpxhXkO6v5zTrKNu7lLUsNRU1klKk1k5yUHduWKEik7NavvsixVT1-2ogLBf8Sj1ELXzwDHsYmriyOdDSaSlea3x1BwV2bRfSsv3CwrFR0G5RMjxgi4bQQdXYbW9Rl2_w';

    if(debugmode) echo 'CreateSoftPayPayment.clientid  ='.$dS_Group->ePaySoftPayClientId.'<br/>';
    if(debugmode) echo 'CreateSoftPayPayment.clientsecret  ='.$dS_Group->ePaySoftPayClientSecret.'<br/>';
    $gw = new C_SoftPayIoGateaway($dS_Group->ePaySoftPayClientId,$dS_Group->ePaySoftPayClientSecret,$dS_Group->id);



    $try=0;
    //loop twice to request token if token has expired
    //try counter is used to run the while loop a second time if token is invalid/expired
    while($try<2)
    {
        if(empty($dS_Group->ePaySoftPayToken)) //token is empty in database or invalid/expired (token is set to empty if invalid)
        {
            if(debugmode) echo 'CreateSoftPayPayment.group.token is empty'.'<br/>';
            //call request token API
            $token = $gw->requestToken();
            if(!$token) //error when requesting token => exit with false value;
            {
                if(debugmode) echo 'CreateSoftPayPayment.requestToken => error'.'<br/>';
                return false;
            }
            else //request token successful => saves token
            {
                if(debugmode) echo 'CreateSoftPayPayment.requestToken = success'.'<br/>';
                if(debugmode) echo 'CreateSoftPayPayment.token=['.$token.']<br/>';
                $dS_Group->ePaySoftPayToken = $token;
                $dS_Group->saveSoftPayToken();
            }
        }
        else //token exists
        {
            if(debugmode) echo 'CreateSoftPayPayment.group.token exists : '.$dS_Group->ePaySoftPayToken.'<br/>';
            //$token = $dS_Group->ePaySoftPayToken;
        }
        
        $posReferenceNumber = $paymentId;

        //call create payment API
        $reqpayresp = $gw->requestPayment($dS_Group->ePaySoftPayToken,$dS_Group->ePaySoftPayAppId,$amount,$posReferenceNumber,$switchBackTimeout);
        if(!$reqpayresp)
        {
            if($gw->httpStatus=='401') //invalid token (probably expired)
            {
                //token is set to empty to request token after token expired error
                //increments try++ counter 
                

                $try++;
                if(debugmode) echo 'CreateSoftPayPayment try++ = '.$try.'<br/>';
                if(debugmode) echo 'CreateSoftPayPayment requestPayment = failure'.'<br/>';
                $dS_Group->ePaySoftPayToken='';
            }
            else //other error (saved in exception table)
            {
                return false; //api error => exits with false value
            }
        }
        else
        {
            if(debugmode) echo 'CreateSoftPayPayment requestPayment = success'.'<br/>'; 
            if(debugmode) echo 'CreateSoftPayPayment requestPayment requestId = '.$reqpayresp->requestId.'<br/>';
            if(debugmode) echo 'CreateSoftPayPayment requestPayment state = '.$reqpayresp->state.'<br/>';
            
            //token is (now) valid and request payment call is sucess => return requestID
            return $reqpayresp; //returns C_SoftPayIo_PostTansactionResultResponse (with requestId property)

        }
    }
    //the second loop was not successul => exit with false value!
    return false;
}

//////////////////////////////////////////////////////////////////////
//  
// get softpay payment status from server (only used by polling cron)
// update group token if necessary
//
// inputs:
// =======
// $dS_Group : group related to softpay customer (clientid, client secret)
// $transid :  softpay request id, to store as transid
//
// result: C_SoftPayIo_GetTansactionResultResponse
// =======
//  state => state of transaction = PROCESSING, COMPLETED, DECLINED, CANCELLED, FAILED
//  appId => appId of the app that carried out this transaction.
//  partialPan => masked pan of tapped payment card
//
//////////////////////////////////////////////////////////////////////
function CheckSoftPayStatus($dS_Group,$transid)
{
    if(debugmode) echo 'calling CheckSoftPayStatus...'.'<br/>';

    //$dS_Group->ePaySoftPayClientSecret="aaa";
    //$dS_Group->ePaySoftPayToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InA1dk9FZVN6UlhlNGlhRzhHTWh2ZCJ9.eyJpc3MiOiJodHRwczovL3NvZnRwYXktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJOODZacjRTUjJpUjV0d2JXcjJHRjlqQ3JBQmNzU3FVUUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9jbG91ZC1zd2l0Y2guZGV2LnNvZnRwYXkuaW8iLCJpYXQiOjE2ODI0MTg5MDgsImV4cCI6MTY4MjUwNTMwOCwiYXpwIjoiTjg2WnI0U1IyaVI1dHdiV3IyR0Y5akNyQUJjc1NxVVEiLCJzY29wZSI6ImNyZWF0ZTpwYXltZW50IGNyZWF0ZTpyZWZ1bmQgY3JlYXRlOmNhbmNlbGxhdGlvbiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwYXltZW50IiwiY3JlYXRlOnJlZnVuZCIsImNyZWF0ZTpjYW5jZWxsYXRpb24iXX0.VQCc4z9ufWxo3-d4oCY19vkexkS01yumcu3ni8u1ou9wNklk2C7RNztOO72CUCU4P0KSOGSY8C-hCilXYBMzgojac7Sc7hqaVWD4ggzHn_PIMS2ZMXnRSsXrAjjJPPyDA-FbzImVMqUpssMDpw-hZ58RoFAUu6qJjjvmrq62LZZzFkhMegsgFLE6wQ31vQKKDNXux8NsKXdWrlIm05qQXGpxhXkO6v5zTrKNu7lLUsNRU1klKk1k5yUHduWKEik7NavvsixVT1-2ogLBf8Sj1ELXzwDHsYmriyOdDSaSlea3x1BwV2bRfSsv3CwrFR0G5RMjxgi4bQQdXYbW9Rl2_w';

    $gw = new C_SoftPayIoGateaway($dS_Group->ePaySoftPayClientId,$dS_Group->ePaySoftPayClientSecret,$dS_Group->id);

    $try=0;
    //note : while($try<2) mecanism is explained in softpayio.CreateSoftPayPayment function
    while($try<2)
    {
        if(empty($dS_Group->ePaySoftPayToken))
        {
            if(debugmode) echo 'CheckSoftPayStatus.group.token is empty'.'<br/>';
            $token = $gw->requestToken();
            if(!$token)
            {
                if(debugmode) echo 'CheckSoftPayStatus.requestToken => error'.'<br/>';
                return false;
            }
            else
            {
                if(debugmode) echo 'CheckSoftPayStatus.requestToken = success'.'<br/>';
                if(debugmode) echo 'CheckSoftPayStatus.token=['.$token.']<br/>';
                $dS_Group->ePaySoftPayToken = $token;
                $dS_Group->saveSoftPayToken();
            }
        }
        else
        {
            if(debugmode) echo 'CheckSoftPayStatus.group.token exists'.'<br/>';
            //$gw->token = $dS_Group->ePaySoftPayToken;
        }
        $requestId = $transid;
		$resgettrans = $gw->getTransaction($dS_Group->ePaySoftPayToken,$requestId);
        if(!$resgettrans)
        {
            if($gw->httpStatus=='401')
            {
                $try++;
                if(debugmode) echo 'CheckSoftPayStatus try++ = '.$try.'<br/>';
                if(debugmode) echo 'CheckSoftPayStatus requestPayment = failure'.'<br/>';
                $dS_Group->ePaySoftPayToken='';
            }
            else
            {
                return false;
            }
        }
        else
        {
            return $resgettrans; //C_SoftPayIo_GetTansactionResultResponse (with state, appId and partialPan properties)
        }
    }
    return false;
}

//////////////////////////////////////////////////////////////////////
//  
// Cancel a transaction with a specified requestId. The requestId must the requestId used 
// when starting the transaction. Cancellations may be subject to restrictions governed by the acquirer. 
// In some cases, transactions can only be cancelled within 10 minutes of completion. The endpoint is starting the cancellation process and the result must be retrieved using the GET endpoint.
//
// update group token if necessary
//
// inputs:
// =======
// $dS_Group : group related to softpay customer (clientid, client secret)
// $transid :  softpay request id, to store as transid
//
// result: C_SoftPayIo_PostTansactionResultResponse object
// =======
//  requestId => softpay : The request id associated with this transaction if and only if this transaction has been created locally by the POS app or remotely via the Cloud API, otherwise null (if created directly in the Softpay app in standalone mode)
//            => mobminder : to store as transid in payment record
//  state     => state of transaction : ??? COMPLETED???
//
//////////////////////////////////////////////////////////////////////
function cancelSoftPayPayment($dS_Group,$transid)
{
    if(debugmode) echo 'calling cancelSoftPayPayment...'.'<br/>';

    //$dS_Group->ePaySoftPayClientSecret="aaa";
    //$dS_Group->ePaySoftPayToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InA1dk9FZVN6UlhlNGlhRzhHTWh2ZCJ9.eyJpc3MiOiJodHRwczovL3NvZnRwYXktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJOODZacjRTUjJpUjV0d2JXcjJHRjlqQ3JBQmNzU3FVUUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9jbG91ZC1zd2l0Y2guZGV2LnNvZnRwYXkuaW8iLCJpYXQiOjE2ODI0MTg5MDgsImV4cCI6MTY4MjUwNTMwOCwiYXpwIjoiTjg2WnI0U1IyaVI1dHdiV3IyR0Y5akNyQUJjc1NxVVEiLCJzY29wZSI6ImNyZWF0ZTpwYXltZW50IGNyZWF0ZTpyZWZ1bmQgY3JlYXRlOmNhbmNlbGxhdGlvbiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwYXltZW50IiwiY3JlYXRlOnJlZnVuZCIsImNyZWF0ZTpjYW5jZWxsYXRpb24iXX0.VQCc4z9ufWxo3-d4oCY19vkexkS01yumcu3ni8u1ou9wNklk2C7RNztOO72CUCU4P0KSOGSY8C-hCilXYBMzgojac7Sc7hqaVWD4ggzHn_PIMS2ZMXnRSsXrAjjJPPyDA-FbzImVMqUpssMDpw-hZ58RoFAUu6qJjjvmrq62LZZzFkhMegsgFLE6wQ31vQKKDNXux8NsKXdWrlIm05qQXGpxhXkO6v5zTrKNu7lLUsNRU1klKk1k5yUHduWKEik7NavvsixVT1-2ogLBf8Sj1ELXzwDHsYmriyOdDSaSlea3x1BwV2bRfSsv3CwrFR0G5RMjxgi4bQQdXYbW9Rl2_w';

    $gw = new C_SoftPayIoGateaway($dS_Group->ePaySoftPayClientId,$dS_Group->ePaySoftPayClientSecret,$dS_Group->id);

    $try=0;
    //note : while($try<2) mecanism is explained in softpayio.CreateSoftPayPayment function
    while($try<2)
    {
        if(empty($dS_Group->ePaySoftPayToken))
        {
            if(debugmode) echo 'cancelSoftPayPayment.group.token is empty'.'<br/>';
            $token = $gw->requestToken();
            if(!$token)
            {
                if(debugmode) echo 'cancelSoftPayPayment.requestToken => error'.'<br/>';
                return false;
            }
            else
            {
                if(debugmode) echo 'cancelSoftPayPayment.requestToken = success'.'<br/>';
                if(debugmode) echo 'cancelSoftPayPayment.token=['.$token.']<br/>';
                $dS_Group->ePaySoftPayToken = $token;
                $dS_Group->saveSoftPayToken();
            }
        }
        else
        {
            if(debugmode) echo 'cancelSoftPayPayment.group.token exists'.'<br/>';
            //$gw->token = $dS_Group->ePaySoftPayToken;
        }
        $requestId = $transid;
		$rescancel = $gw->deleteTransaction($dS_Group->ePaySoftPayToken,$requestId);
        if(!$rescancel)
        {
            if($gw->httpStatus=='401')
            {
                $try++;
                if(debugmode) echo 'cancelSoftPayPayment try++ = '.$try.'<br/>';
                if(debugmode) echo 'cancelSoftPayPayment requestPayment = failure'.'<br/>';
                $dS_Group->ePaySoftPayToken='';
            }
            else
            {
                return false;
            }
        }
        else
        {
            return $rescancel; //C_SoftPayIo_PostTansactionResultResponse (with state and requestid)
        }
    }
    return false;
}

function isSoftPayServerAlive($dS_Group=false)
{
    if($dS_Group)
        $gw = new C_SoftPayIoGateaway($dS_Group->ePaySoftPayClientId,$dS_Group->ePaySoftPayClientSecret,$dS_Group->id);
    else
        $gw = new C_SoftPayIoGateaway();
    
    return $gw->isServerAlive();
}
?>