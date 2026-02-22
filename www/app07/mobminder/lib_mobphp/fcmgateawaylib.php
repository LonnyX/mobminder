<?php


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
//  F I R E B A S E  
//  C O M M U N I C A T I O N 
//  M E S S A G E
//
//  G A T E A W A Y
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////

//REFS:
//https://firebase.google.com/docs/cloud-messaging/
//https://firebase.google.com/docs/cloud-messaging/http-server-ref
//https://firebase.google.com/docs/cloud-messaging/manage-tokens

//some remarks:
//1. FCM token is sent by device, even though notification is disable on device
//2. removing app from device DOES NOT invalidate token

//Legacy HTTP Protocol AND Authenticating requests with server keys are deprecated since June2023 and will be disconnected in June2024
//Send messages via the HTTP v1 API and Authenticate requests with access tokens generated from authorized service accounts
//On June 20, 2024, we’re reducing the number of Firebase Cloud Messaging (FCM) legacy register APIs and legacy send APIs that provide similar functionality. This step will allow us to provide you with a more consistent experience and align with Google security standards to improve security, reliability and performance.
//Because of these API decommissions, some already-deprecated SDKs and features will stop working after June 20, 2024.
//https://admin.google.com/ServiceNotAllowed?application=43929633726&source=scrip&src=http%3A%2F%2Ffirebase.google.com%2Fsupport%2Ffaq#fcm-23-deprecation
//https://admin.google.com/ServiceNotAllowed?application=43929633726&source=scrip&src=http%3A%2F%2Ffirebase.google.com%2Fdocs%2Fcloud-messaging%2Fauth-server#provide-credentials-manually
//https://console.cloud.google.com/welcome?project=mobminder-f84e1



/* mobminder-f84e1-firebase-adminsdk-34y2v-d2ec0cd6d3.json
  "type": "service_account",
  "project_id": "mobminder-f84e1",
  "private_key_id": "d2ec0cd6d333811cc327be919a005bdb7f7f3725",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3CJu2HvE1vF2f\nRrAbcN1X2Dq6901FB9rV4NuNkJB45K8ScRHHPkU2DKBmvKgIOJo3oXgy1GdDzsfk\n5SLPef3cdSILPRPDq7wRbQV1y47ULQkUhkLI4wG9DzF58Wy9JWZ7S5lttFeIV73U\nMv/fMDRpejX2eAz2SEiSZFvham2N6bBGiM2OHEsxIx46F0jyi3lpTVMLRqzg0V1u\nVyl50A/uqhZjWf5cqpyyLi+6XZr1HTjun9LX/UtriK7daEtYf9QinoTGkijRsLBw\ny5rwcrKBUrPIxS7KMDd7I8Y/ImNF8lORyzt+jHOdj2q8jwDLHD4zWcVehy6yrggK\nMqI7vfdnAgMBAAECggEAAeoHTKKuihwMs7dW0HxuTCvVWdmL6wy7JYvNocioM+qT\nc0Fsdx5bitSNh8dOFsokwIUwK8k/qMcpAMtRVpo/8z8AzGuftnU2YgZFeC4uappr\nhpzQLW8Z4w2rrdkTr3BFamF190IGElPKzii0YckaxeKCsvbIjwfsmtEbw1Pox0oX\naCvK5+vP0UT657OcNCeOgYz38qKwNOJlMst95rlGniHgWOAWcJoQ4wVKtpqsbHPz\ng2r2i4ELxNVMkMlGo1hMu6Y5H7NGZ0WDt9GI1DeThLTLAWiRpTRGPKeqFBrSVqi+\nSzdZrCXtYdQIdiprf+qsgXf0yFEZtyAmyOTz1bQ2FQKBgQD34G3RGxCGBVbyMXt9\nSYX2Y3u2CJadVi2cNN8WXzZGHNnnVKXVP9RMBPAMlznItE46VxteyWC1U/QcOPDW\nAaXN47yeMGtAc/5Qp7v3vFJ8P3ljHsxoQn50bc+lADkcl7wkYJgTMzVzUhT83Nvw\n5wfORrGengXaqkAtf6fyhnmbewKBgQC9CC0NSALMwZax3oqboKUQuts9/wa7jrsh\nalk/vaz6yKTH/78FGhM+PRTRhcSrYa7IC8VgBjcY0w6qZAhzQrSPrNCOEob8VNif\nEyZtx9fZhWZ26kADT22TpINFYDDjBcpB4gDWWc6okdVqgBAREo7/lv3sbIJP8ZH4\n8cUzT+dqBQKBgQCJL4W3uCHh+qyPKEGvKnTg01hRe9lXxK1DiaN6L0HLdgZHWHrb\nVhM563Wrkjqh0OCGu1TjldJXKNquj/kCiDDqjUMDzcpeBpRWsS5/wpNoPn0BFbeN\ncFeqOmg0arYxE+1FuMwRvEK1y1TgSZ/UaRjR2iBNqCmXRqh0RfV+bVx6ZwKBgExm\nmY7cpAUN2VJal7r+2rhATYxpHtd/gLKowRm6F8fkgHU1MIdnWo+1MEzeu/ZorLO9\nzjBZUrt90lebxq6PL1tChahmZJhn0oW4v7dvJhaMjDVTyDuORsN9onDPx/J5zJ2E\nMsJv2c7X4mIBEH1V+uXiqQ59bM3S3SS40vNCQE3hAoGBAKDKxvF/GUpbnorccY6G\nz8/j6EmpXcj6dmab2hibMmZ+r/kgp2Uf39Q9idfisQCwhSFq4S4Su6lwzDwJZs+L\nKiNXgkL/Y7ImKSUCUZZXj9YGc0g3cNfDofqxMUMuxqxyFC0cATIc+dcKaTXQLP/F\nDcTFViieEtGbWKwFCOgtw+/G\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-34y2v@mobminder-f84e1.iam.gserviceaccount.com",
  "client_id": "107776657872597862167",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-34y2v%40mobminder-f84e1.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
*/


class C_FcmGateaway
{
    private $curltimeout = 2000;

    public $lasthttpcode='';
    public $lasterrorcode='';
    public $lasterrormessage='';
 
    public function __construct()
    {
    }

    // 
    //
    //
    //
    //
    private function getOAuthToken()
    {
        //$credentialsPath = 'mobminder-f84e1-firebase-adminsdk-34y2v-d2ec0cd6d3.json';
        //$credentials = json_decode(file_get_contents($credentialsPath), true);
        //$privateKey = $credentials['private_key'];
        //echo 'privateKey='.$privateKey.'</br>';
        //$clientEmail = $credentials['client_email'];
        //echo 'clientEmail='.$clientEmail.'</br>';
        $privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3CJu2HvE1vF2f\nRrAbcN1X2Dq6901FB9rV4NuNkJB45K8ScRHHPkU2DKBmvKgIOJo3oXgy1GdDzsfk\n5SLPef3cdSILPRPDq7wRbQV1y47ULQkUhkLI4wG9DzF58Wy9JWZ7S5lttFeIV73U\nMv/fMDRpejX2eAz2SEiSZFvham2N6bBGiM2OHEsxIx46F0jyi3lpTVMLRqzg0V1u\nVyl50A/uqhZjWf5cqpyyLi+6XZr1HTjun9LX/UtriK7daEtYf9QinoTGkijRsLBw\ny5rwcrKBUrPIxS7KMDd7I8Y/ImNF8lORyzt+jHOdj2q8jwDLHD4zWcVehy6yrggK\nMqI7vfdnAgMBAAECggEAAeoHTKKuihwMs7dW0HxuTCvVWdmL6wy7JYvNocioM+qT\nc0Fsdx5bitSNh8dOFsokwIUwK8k/qMcpAMtRVpo/8z8AzGuftnU2YgZFeC4uappr\nhpzQLW8Z4w2rrdkTr3BFamF190IGElPKzii0YckaxeKCsvbIjwfsmtEbw1Pox0oX\naCvK5+vP0UT657OcNCeOgYz38qKwNOJlMst95rlGniHgWOAWcJoQ4wVKtpqsbHPz\ng2r2i4ELxNVMkMlGo1hMu6Y5H7NGZ0WDt9GI1DeThLTLAWiRpTRGPKeqFBrSVqi+\nSzdZrCXtYdQIdiprf+qsgXf0yFEZtyAmyOTz1bQ2FQKBgQD34G3RGxCGBVbyMXt9\nSYX2Y3u2CJadVi2cNN8WXzZGHNnnVKXVP9RMBPAMlznItE46VxteyWC1U/QcOPDW\nAaXN47yeMGtAc/5Qp7v3vFJ8P3ljHsxoQn50bc+lADkcl7wkYJgTMzVzUhT83Nvw\n5wfORrGengXaqkAtf6fyhnmbewKBgQC9CC0NSALMwZax3oqboKUQuts9/wa7jrsh\nalk/vaz6yKTH/78FGhM+PRTRhcSrYa7IC8VgBjcY0w6qZAhzQrSPrNCOEob8VNif\nEyZtx9fZhWZ26kADT22TpINFYDDjBcpB4gDWWc6okdVqgBAREo7/lv3sbIJP8ZH4\n8cUzT+dqBQKBgQCJL4W3uCHh+qyPKEGvKnTg01hRe9lXxK1DiaN6L0HLdgZHWHrb\nVhM563Wrkjqh0OCGu1TjldJXKNquj/kCiDDqjUMDzcpeBpRWsS5/wpNoPn0BFbeN\ncFeqOmg0arYxE+1FuMwRvEK1y1TgSZ/UaRjR2iBNqCmXRqh0RfV+bVx6ZwKBgExm\nmY7cpAUN2VJal7r+2rhATYxpHtd/gLKowRm6F8fkgHU1MIdnWo+1MEzeu/ZorLO9\nzjBZUrt90lebxq6PL1tChahmZJhn0oW4v7dvJhaMjDVTyDuORsN9onDPx/J5zJ2E\nMsJv2c7X4mIBEH1V+uXiqQ59bM3S3SS40vNCQE3hAoGBAKDKxvF/GUpbnorccY6G\nz8/j6EmpXcj6dmab2hibMmZ+r/kgp2Uf39Q9idfisQCwhSFq4S4Su6lwzDwJZs+L\nKiNXgkL/Y7ImKSUCUZZXj9YGc0g3cNfDofqxMUMuxqxyFC0cATIc+dcKaTXQLP/F\nDcTFViieEtGbWKwFCOgtw+/G\n-----END PRIVATE KEY-----\n";
        $clientEmail = 'firebase-adminsdk-34y2v@mobminder-f84e1.iam.gserviceaccount.com';
        $tokenUri = 'https://oauth2.googleapis.com/token';
        $scopes = 'https://www.googleapis.com/auth/firebase.messaging';

        // creating signed JWT token
        $now = time();
        $jwtHeader = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
        $jwtClaim = json_encode([
            'iss' => $clientEmail,
            'scope' => $scopes,
            'aud' => $tokenUri,
            'exp' => $now + 3600, // expiration
            'iat' => $now
        ]);

        // base64 encoding
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($jwtHeader));
        $base64UrlClaim = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($jwtClaim));

        // creating signature
        $signature = '';
        openssl_sign($base64UrlHeader . "." . $base64UrlClaim, $signature, $privateKey, 'SHA256');
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        // creating JWT
        $jwt = $base64UrlHeader . "." . $base64UrlClaim . "." . $base64UrlSignature;

        // request access token
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $tokenUri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ]));

        $response = curl_exec($ch);

        //echo "</br>"."debug response=".$response."</br>";


        if(!$response) { // error : The server is unreachable
            $this->lasthttpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $this->lasterrorcode= 'FCM_CURL_OAUTH_ERROR';
            $this->lasterrormessage=curl_error($ch);
            curl_close($ch);
            return false;
        }
        else
        {
            $this->lasthttpcode= curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if(substr($this->lasthttpcode,0,1)=='4'||substr($this->lasthttpcode,0,1)=='5') //4xx or 5xx http code error
            {
                $this->lasterrorcode= 'FCM_CURL_OAUTH_ERROR';
                $this->lasterrormessage=$response;
                curl_close($ch);
                return false;
            }
            else
            {
                curl_close($ch);
                $this->lasterrorcode='';
                $this->lasterrormessage='';

                $tokenInfo = json_decode($response, true);
                $accessToken = $tokenInfo['access_token'];
                //echo 'Access Token: ' . $accessToken;
                return $accessToken;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  S E N D   R E S E R V A T I O N   N O T I F I C A T I O N
    //
    //
    //  @tokens ==========> array of FCM tokens (stored in devices table)
    //  @accesskeyid =====> access key id
    //  @resourceid ======> resource id
    //  @reservationid ===> resa id
    //  @sdateresa =======> reservation date (format=YYYY-MM-DD), used for directly displaying day of reservation at mobile screen
    //  @title ===========> utf8 notification title 
    //  @body ============> utf8 notification body 
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //deprecated
    public function sendResaNotification($tokens,$resaid,$groupid, $title,$body) 
    {
        $url = 'https://fcm.googleapis.com/fcm/send';

        //FCM generated key for Mobminder (same for production and test environment)
        $key= 'AAAAOi2ndHM:APA91bFzekQRt1Pjl8eKSNNUfnjCUYZZ5lEQOMztTm9H8RTm07jkgbdAplLL7Xb4v52HfUIkWvG8epZNxPPYq1g44lhr3QwsH5NkeJ5SlKZtG5klYtJuudwJzXeE1yli8kCsC-hYjaAp';

        $headers = [
            'Authorization:key='.$key,
            'Content-type: application/json;charset=UTF-8'
        ];

        //channel_id is only used by android OS, notification setting is split between reservation & chat notification
        //do not change value because it is hardcoded in mobile app and already in production
        $resachannel = 'rdv'; 

        $requestbody = array(
            'registration_ids' => $tokens,
            'collapse_key' => ''.$resaid, 
            'notification' => array (
                'title' => $title,
                'body' => $body,
                'sound' => 'default', 
                'channel_id' => $resachannel,
                'android_channel_id' => $resachannel //same
            ),
            'data' => array (
                'reservationid' => ''.$resaid,  //mobminder custom field, do not change value because it is hardcoded in mobile app and already in production
                'accountid' => ''.$groupid,
                
                'accesskeyid' => '0',      //need old parameter to prevent issue on older flutter version
                'resourceid' => '0',       //need old parameter to prevent issue on older flutter version

                'click_action' => 'FLUTTER_NOTIFICATION_CLICK', //activate onresume (app in background) and onlaunch (app terminated) on android OS
                                                                //https://pub.dev/documentation/firebase_messagings/latest/
            ),
            /*'android' => array (   
                'ttl' => '0s',  //not tested yet
            ),
            'apns' => array (
                'headers' =>  array (
                    'apns-expiration' => '0', //not tested yet
                )
            )*/
        );

        //tmp
        //echo "\n".'debug json='.json_encode($requestbody)."\n";

        $curl = curl_init();

        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS		=> json_encode($requestbody),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->curltimeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);

        $response = curl_exec($curl);

        //echo "\n"."debug response=".$response."\n";


        if(!$response) { // error : The server is unreachable
            $this->lasthttpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $this->lasterrorcode= 'FCM_CURL_ERROR';
            $this->lasterrormessage=curl_error($curl);
            curl_close($curl);
            return false;
        }
        else
        {
            $this->lasthttpcode= curl_getinfo($curl, CURLINFO_HTTP_CODE);

            if(substr($this->lasthttpcode,0,1)=='4'||substr($this->lasthttpcode,0,1)=='5') //4xx or 5xx http code error
            {
                $this->lasterrorcode= 'FCM_CURL_ERROR';
                $this->lasterrormessage=$response;
                curl_close($curl);
                return false;
            }
            else
            {
                curl_close($curl);
                $this->lasterrorcode='';
                $this->lasterrormessage='';
                return new C_FcmSendNotificationResponse($response,$tokens);
            }
        }
        
    }

    //new API version
    public function sendResaNotificationHTTPV1($token,$resaid,$groupid, $title,$body,$accessToken) 
    {
        $projectid = 'mobminder-f84e1';
        $url = 'https://fcm.googleapis.com/v1/projects/'.$projectid.'/messages:send';
        
        //Authorization:key has been replaced by OAuth token which must be retrieve in the step before
        $headers = [
            //'Authorization:key='.$key,
            'Authorization: Bearer ' . $accessToken,
            'Content-type: application/json;charset=UTF-8'
        ];

        //channel_id is only used by android OS, notification setting is split between reservation & chat notification
        //do not change value because it is hardcoded in mobile app and already in production
        $resachannel = 'rdv'; 

        $message = [
            'message' => [
                'token' => $token,
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    //'sound' => 'default', 
                    //'channel_id' => $resachannel,
                    //'android_channel_id' => $resachannel //same
                ],
                'data' => [
                    'reservationid' => $resaid,  //mobminder custom field, do not change value because it is hardcoded in mobile app and already in production
                    'accountid' => $groupid,
                    'accesskeyid' => '0',      //need old parameter to prevent issue on older flutter version
                    'resourceid' => '0',       //need old parameter to prevent issue on older flutter version
                    //'click_action' => 'FLUTTER_NOTIFICATION_CLICK', //activate onresume (app in background) and onlaunch (app terminated) on android OS
                                                                    //https://pub.dev/documentation/firebase_messagings/latest/
                ],
                "android" => [
                    "notification" => [
                        'click_action' => 'FLUTTER_NOTIFICATION_CLICK'
                    ]
                ]
            ],
        ];

        $curl = curl_init();

        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS		=> json_encode($message),
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> $this->curltimeout, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);

        $response = curl_exec($curl);

        //echo "</br>"."debug response=".$response."</br>";


        if(!$response) { // error : The server is unreachable
            $this->lasthttpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $this->lasterrorcode= 'FCM_CURL_ERROR';
            $this->lasterrormessage=curl_error($curl);
            curl_close($curl);
            return false;
        }
        else
        {
            $this->lasthttpcode= curl_getinfo($curl, CURLINFO_HTTP_CODE);

            if(substr($this->lasthttpcode,0,1)=='4'||substr($this->lasthttpcode,0,1)=='5') //4xx or 5xx http code error
            {
                //$this->lasterrorcode= 'FCM_CURL_ERROR';
                //$this->lasterrormessage=$response;
                $this->lasterrorcode='';
                $this->lasterrormessage='';
                curl_close($curl);
                return new C_FcmHTTPV1SendNotificationResponse($response,$token);
            }
            else
            {
                curl_close($curl);
                $this->lasterrorcode='';
                $this->lasterrormessage='';
                return new C_FcmHTTPV1SendNotificationResponse($response,$token);
            }
        }
        
    }
    public function sendResaNotification4Login($loginId,$dS_resa,$dS_notification)
    {
        //echo 'title='.$dS_notification->title."</br>";
        //echo 'message='.$dS_notification->message."</br>";

        if(false) //old FCM api (deprecated, will be disable the 20/06/2024)
        {
            $o_dbAccess_devices = new C_dbAccess_devices($loginId);
            $tokens = [];
            foreach($o_dbAccess_devices->keyed as $dS_device) 
            {
                $dS_device->token = $dS_device->token;
                $tokens[] = $dS_device->token;
            }
            
            if(count($tokens)==0) return false;

            $result = $this->sendResaNotification($tokens,$dS_resa->id,$dS_resa->groupId, $dS_notification->title,$dS_notification->message);
            if(!$result)
            {
                //retry...
                sleep(1); 
                $result = $this->sendResaNotification($tokens,$dS_resa->id,$dS_resa->groupId, $dS_notification->title,$dS_notification->message);
                if(!$result)
                {
                    //echo 'lasthttpcode = '.$gateway->lasthttpcode.'</br>';
                    //echo 'lasterrorcode = '.$gateway->lasterrorcode.'</br>';
                    //echo 'lasterrormessage = '.$gateway->lasterrormessage.'</br>';
                    C_dS_exception::put('fcmgateawaylib.php', 'sendResaNotification4Login',$this->lasthttpcode.'-'.$this->lasterrorcode.'-'.$this->lasterrormessage);
                    return false;
                }
            }
            
            //else
            //{
            foreach($result->invalidtokens as $token) 
            {
                //echo 'invalid token='.$token.'</br>';

                foreach($o_dbAccess_devices->keyed as $dS_device) 
                {
                    if($dS_device->token==$token)
                    {
                        //echo 'invalid token='.$token.'</br>';
                        $dS_device->dSdelete();
                    }
                }
            }
            //return false if all tokens are invalid! else return true
            return count($tokens)!=count($result->invalidtokens);
            //}
        }
        else //new FCM HTTP V1 API
        {
            $o_dbAccess_devices = new C_dbAccess_devices($loginId);
            
            //loop in all devices used by login
            foreach($o_dbAccess_devices->keyed as $dS_device) 
            {
                //echo "processing device------------------------"."</br>";
                //echo "device token=".$dS_device->token."</br>";
                //$dS_device->token = $dS_device->token;

                $errorcounter=0;
                $erroroauth=0;
                while(true)
                {
                    //try to send notification
                    $o_dS_system = new C_dS_system();
                    //echo "calling http V1 api..."."</br>";
                    //echo "with token = ".$o_dS_system->fcm_oauth_token."</br>";
                    $result = $this->sendResaNotificationHTTPV1($dS_device->token,''.$dS_resa->id,''.$dS_resa->groupId, $dS_notification->title,$dS_notification->message,$o_dS_system->fcm_oauth_token);
                    if(!$result) //an network error occured
                    {
                        //echo "error when call http V1"."</br>";
                        $errorcounter++;
                        if($errorcounter>1) //too many attempts => stop sending notification
                        {
                            //echo "error>1 : exception and return false"."</br>";
                            C_dS_exception::put('fcmgateawaylib.php', 'sendResaNotification4Login',$this->lasthttpcode.'-'.$this->lasterrorcode.'-'.$this->lasterrormessage);
                            return false;
                        }
                        else
                        {
                            //echo "error<=1 : sleep1"."</br>";
                            //wait 1sec and re-call api
                            sleep(1); 
                            //retry
                        }
                    }
                    else if($result->status==FCM_INVALID_OAUTH) //OAUTH token in invalid or expired
                    {
                        //echo "FCM_INVALID_OAUTH"."</br>";
                        $erroroauth++;
                        if($erroroauth>1) //too many attemps => stop sending notification
                        {
                            //echo "error>1 : exception and return false"."</br>";
                            C_dS_exception::put('fcmgateawaylib.php', 'sendResaNotification4Login','invalid OAUTH token');
                            return false;
                        }
                        else
                        {
                            //get a new OAUTH token from google
                            //echo "error<=1 : get new token"."</br>";
                            $result = $this->getOAuthToken();
                            if(!$result) //an error occured => stop sending notification
                            {
                                //echo "error when get token and return false"."</br>";
                                C_dS_exception::put('fcmgateawaylib.php', 'sendResaNotification4Login(getOAuthToken)',$this->lasthttpcode.'-'.$this->lasterrorcode.'-'.$this->lasterrormessage);
                                return false;
                            }
                            else //new OAUT token has been retrieved and save into databases (globals table) (expiration delay = 3600sec)
                            {
                                //echo "new token =".$result."</br>";                                
                                //echo "save new token"."</br>";
                                C_dS_system::setFcmOauthToken($result);
                            }
                            //retry
                        }
                    }
                    else if($result->status==FCM_INVALID_DEVICE_TOKEN) //device FCM token invalid => remove device from database
                    {
                        //echo "FCM_INVALID_DEVICE_TOKEN -> delete device and break while"."</br>";
                        $dS_device->dSdelete();
                        break;
                    }
                    else if($result->status==FCM_ERROR) //another error occured => break while and go to next device token
                    {
                        //echo "FCM_ERROR -> and break while"."</br>";
                        C_dS_exception::put('fcmgateawaylib.php', 'sendResaNotification4Login',$this->lasthttpcode.'-'.$this->lasterrorcode.'-'.$this->lasterrormessage);
                        break;
                    }
                    else //FCM_SUCCESS : notificaiton has been sent => break while and go to next device token
                    {
                        //echo "FCM_SUCCESS -> break while"."</br>";
                        break;
                    }
                }


            }
            return true;
        }
    }
    public function sendChatNotification() 
    {
        //to implement...
    }
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
//  F I R E B A S E  
//  C O M M U N I C A T I O N 
//  M E S S A G E
//
//  S E N D I N G   R E S P O N S E   S T R U C T U R E
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////
class C_FcmSendNotificationResponse
{
    public $content;
    public $multicast_id;
    public $success;
    public $failure;
    public $invalidtokens = [];  //contains list of invalid tokens, should be removed from database

    public function __construct($fcmresponse,$tokens) //fcmresponse : json format
    {
        //sample : {"multicast_id":5904805140980053812,"success":2,"failure":1,"canonical_ids":0,"results":[{"message_id":"1667830165260595"},{"error":"InvalidRegistration"},{"message_id":"1667830165260596"}]}
        $this->content = $fcmresponse;
        $obj = json_decode($fcmresponse);
        $this->multicast_id = $obj->{'multicast_id'};
        $this->success = $obj->{'success'};
        $this->failure = $obj->{'failure'};
        foreach($obj->{'results'} as $index => $result)
        {
            //one result for each token, if an error occurs, token is marked as invalid
            if(property_exists($result, 'error'))
            {
                $this->invalidtokens[] = $tokens[$index];
            }
        }
    }
}

define('FCM_SUCCESS','FCM_SUCCESS');
define('FCM_INVALID_OAUTH','FCM_INVALID_OAUTH');
define('FCM_INVALID_DEVICE_TOKEN','FCM_INVALID_DEVICE_TOKEN');
define('FCM_ERROR','FCM_ERROR');


class C_FcmHTTPV1SendNotificationResponse
{
    public $content;
    public $status;
    public $name;
    public $errorcode;
    public $errormessage;
    public $errorstatus;
    //public $multicast_id;
    //public $success;
    //public $failure;
    //public $invalidtokens = [];  //contains list of invalid tokens, should be removed from database


    public function __construct($fcmresponse,$token) //fcmresponse : json format
    {
        //success response
        //debug response={ "name": "projects/mobminder-f84e1/messages/0:1718628571809998%73e04e2873e04e28" }

        //invalid device token
        //debug response={ "error": { "code": 404, "message": "Requested entity was not found.", "status": "NOT_FOUND", "details": [ { "@type": "type.googleapis.com/google.firebase.fcm.v1.FcmError", "errorCode": "UNREGISTERED" } ] } }
        
        //echo 'response='.$fcmresponse.'</br>';
        $this->content = $fcmresponse;
        $obj = json_decode($fcmresponse);

        if(property_exists($obj, 'name'))
        {
            $this->name = $obj->name;
            $this->status=FCM_SUCCESS;
        }
        else if(property_exists($obj, 'error'))
        {
            $this->errorcode=$obj->error->code;
            $this->errormessage=$obj->error->message;
            $this->errorstatus=$obj->error->status;

            if($obj->error->code=='400' || $obj->error->code=='404')
            {
                $this->status=FCM_INVALID_DEVICE_TOKEN;
            }
            else if($obj->error->code=='401')
            {
                $this->status=FCM_INVALID_OAUTH;
            }
            else
            {
                $this->status=FCM_ERROR;
            }
        }
    }
}

?>