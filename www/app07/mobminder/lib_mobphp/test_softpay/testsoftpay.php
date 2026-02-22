<?php
    require '../dbio.php';
    require '../softpayio.php';


    //test CreateSoftPayPayment
    if(false)
    {
        $dS_Group = new C_dS_group(3925);

        $amount='3333';
        $paymentid= time(); //generate random number for testing, use paymentid from mobminder as correlator
        
        $res = CreateSoftPayPayment($dS_Group,$amount,$paymentid);
        if(!$res)
        {
            echo 'main calling CreateSoftPayPayment with failure'.'<br/>'; 
        }
        else
        {
            echo 'main calling CreateSoftPayPayment with success'.'<br/>'; 
            echo 'main calling CreateSoftPayPayment requestId = '.$res->requestId.'<br/>';
            echo 'main calling CreateSoftPayPayment state = '.$res->state.'<br/>';
        }
    }
    if (false) //call get transaction (same call as polling cron)
    {
        $dS_Group = new C_dS_group(3925);
        $requestid="ac700634-2d33-4b33-a741-febd2095b9ae";

        $resgettrans = CheckSoftPayStatus($dS_Group,$requestid);
		if(!$resgettrans)
		{
			echo 'calling softpay get transaction with error for account='.$dS_Group->name.' and requestid='.$requestid.'<br/>';
		}
        else
        {
            echo 'state:'.$resgettrans->state.'<br/>';
            echo 'partialPan:'.$resgettrans->partialPan.'<br/>';
            echo 'appId:'.$resgettrans->appId.'<br/>';
            echo 'responseCode:'.$resgettrans->responseCode.'<br/>';
        }

    }
    if (false)
    {
        $dS_Group = new C_dS_group(3925);
        $requestid="09e4c7a1-6d97-489b-bc1d-1b456657d4d2";

        $rescancel = cancelSoftPayPayment($dS_Group,$requestid);
		if(!$rescancel)
		{
			echo 'calling softpay delete transaction with error for account='.$dS_Group->name.' and requestid='.$requestid.'<br/>';
		}
        else
        {
            echo 'main calling CreateSoftPayPayment requestId = '.$rescancel->requestId.'<br/>';
            echo 'main calling CreateSoftPayPayment state = '.$rescancel->state.'<br/>';
        }
    }


    /* other testings, not used anymore
    //$clientid = 'N86Zr4SR2iR5twbWr2GF9jCrABcsSqUQ'; //'SPAY-done4you';
    //$clientsecret = 'KX7r0ghxGxRqe18yDwRcMGaFq0v2ju0nMbjhdS3uxBbs4Hz_J5Srkxwo4iRrnOq9'; //'371c24545d0a4edebf2f78d011c2a4a0';

    //test token ///////////////////////////////////////////////////////
    if(false) 
    {
        $restoken = $gw->requestToken();

        if($restoken)
        {
            echo 'main.calling requestToken = success'.'<br/>';
            echo 'main.token=['.$gw->token.']<br/>';

            $appId='JTN1178827722';
            $amount='6500';
            $mobtransid= time(); //'1000010';
            $languageIso2='en';
            $switchBackTimeout='5000';
            $reqpayresp = $gw->requestPayment($appId,$amount,$mobtransid,$languageIso2,$switchBackTimeout);
            if($reqpayresp)
            {
                echo 'main.calling requestPayment = success'.'<br/>';
                echo 'main.calling requestPayment requestId = '.$reqpayresp->get_requestId().'<br/>';
                echo 'main.calling requestPayment state = '.$reqpayresp->get_state().'<br/>';
            }
            else
            {
                echo 'main.calling requestPayment = failure'.'<br/>';
            }
            
        }
        else
        {
            echo 'main.calling requestToken = failure'.'<br/>';
            echo 'main.token=['.$gw->token.']<br/>';
        }
    }

    //test request for payment ////////////////////////////////////////////////////////
    if(false)
    {
        $gw->token ='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InA1dk9FZVN6UlhlNGlhRzhHTWh2ZCJ9.eyJpc3MiOiJodHRwczovL3NvZnRwYXktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJOODZacjRTUjJpUjV0d2JXcjJHRjlqQ3JBQmNzU3FVUUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9jbG91ZC1zd2l0Y2guZGV2LnNvZnRwYXkuaW8iLCJpYXQiOjE2ODI0MTg5MDgsImV4cCI6MTY4MjUwNTMwOCwiYXpwIjoiTjg2WnI0U1IyaVI1dHdiV3IyR0Y5akNyQUJjc1NxVVEiLCJzY29wZSI6ImNyZWF0ZTpwYXltZW50IGNyZWF0ZTpyZWZ1bmQgY3JlYXRlOmNhbmNlbGxhdGlvbiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwYXltZW50IiwiY3JlYXRlOnJlZnVuZCIsImNyZWF0ZTpjYW5jZWxsYXRpb24iXX0.VQCc4z9ufWxo3-d4oCY19vkexkS01yumcu3ni8u1ou9wNklk2C7RNztOO72CUCU4P0KSOGSY8C-hCilXYBMzgojac7Sc7hqaVWD4ggzHn_PIMS2ZMXnRSsXrAjjJPPyDA-FbzImVMqUpssMDpw-hZ58RoFAUu6qJjjvmrq62LZZzFkhMegsgFLE6wQ31vQKKDNXux8NsKXdWrlIm05qQXGpxhXkO6v5zTrKNu7lLUsNRU1klKk1k5yUHduWKEik7NavvsixVT1-2ogLBf8Sj1ELXzwDHsYmriyOdDSaSlea3x1BwV2bRfSsv3CwrFR0G5RMjxgi4bQQdXYbW9Rl2_w';
        $requestId = $gw->postRequestforPayment();
        if($requestId)
        {
            echo 'main.calling postRequestforPayment = success'.'<br/>';
            echo 'main.calling postRequestforPayment requestId = '.$requestId.'<br/>';
        }
        else
        {
            echo 'main.calling postRequestforPayment = failure'.'<br/>';
        }
    }

    //test post transaction ////////////////////////////////////////////////////////
    if(false)
    {
        $gw->token ='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InA1dk9FZVN6UlhlNGlhRzhHTWh2ZCJ9.eyJpc3MiOiJodHRwczovL3NvZnRwYXktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJOODZacjRTUjJpUjV0d2JXcjJHRjlqQ3JBQmNzU3FVUUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9jbG91ZC1zd2l0Y2guZGV2LnNvZnRwYXkuaW8iLCJpYXQiOjE2ODI0MTg5MDgsImV4cCI6MTY4MjUwNTMwOCwiYXpwIjoiTjg2WnI0U1IyaVI1dHdiV3IyR0Y5akNyQUJjc1NxVVEiLCJzY29wZSI6ImNyZWF0ZTpwYXltZW50IGNyZWF0ZTpyZWZ1bmQgY3JlYXRlOmNhbmNlbGxhdGlvbiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwYXltZW50IiwiY3JlYXRlOnJlZnVuZCIsImNyZWF0ZTpjYW5jZWxsYXRpb24iXX0.VQCc4z9ufWxo3-d4oCY19vkexkS01yumcu3ni8u1ou9wNklk2C7RNztOO72CUCU4P0KSOGSY8C-hCilXYBMzgojac7Sc7hqaVWD4ggzHn_PIMS2ZMXnRSsXrAjjJPPyDA-FbzImVMqUpssMDpw-hZ58RoFAUu6qJjjvmrq62LZZzFkhMegsgFLE6wQ31vQKKDNXux8NsKXdWrlIm05qQXGpxhXkO6v5zTrKNu7lLUsNRU1klKk1k5yUHduWKEik7NavvsixVT1-2ogLBf8Sj1ELXzwDHsYmriyOdDSaSlea3x1BwV2bRfSsv3CwrFR0G5RMjxgi4bQQdXYbW9Rl2_w';
        $requestId = '50c9c4b3-2974-4746-b9c3-a8e72ac97f5e';
        $appId='LPW1296253941';
        $amount='100';
        $mobtransid='1000010';
        $languageIso2='en';
        $switchBackTimeout='5000';

        $postransresp = $gw->postTransaction($requestId,$appId,$amount,$mobtransid,$languageIso2,$switchBackTimeout);
        if($postransresp)
        {
            echo 'main.calling postTransaction = success'.'<br/>';

            echo 'main.calling postTransaction requestId = '.$postransresp->get_requestId().'<br/>';
            echo 'main.calling postTransaction state = '.$postransresp->get_state().'<br/>';
        }
        else
        {
            echo 'main.calling postTransaction = failure'.'<br/>';
        }
    }

    //test get transaction ////////////////////////////////////////////////////////
    if(false)
    {
        $gw->token ='12345';
        $requestId = '12345';
        $resgettrans = $gw->getTransaction($requestId);
        if($resgettrans)
        {
            echo 'main.calling getTransaction = success'.'<br/>';
            
            echo 'main.calling getTransaction requestId = '.$resgettrans->get_requestId().'<br/>';
            echo 'main.calling getTransaction state = '.$resgettrans->get_state().'<br/>';
            echo 'main.calling getTransaction amountValue = '.$resgettrans->get_amountValue().'<br/>';
            echo 'main.calling getTransaction partialPan = '.$resgettrans->get_partialPan().'<br/>';
            echo 'main.calling getTransaction posReferenceNumber = '.$resgettrans->get_posReferenceNumber().'<br/>';
            echo 'main.calling getTransaction terminalId = '.$resgettrans->get_terminalId().'<br/>';
            echo 'main.calling getTransaction aid = '.$resgettrans->get_aid().'<br/>';
        }
        else
        {
            echo 'main.calling getTransaction = failure'.'<br/>';
            
        }
    }
    
    //test full request payment ////////////////////////////////////////////////////////
    if(false)
    {
        $gw->token ='12345';
        $appId='ABC1234';
        $amount='100';
        $mobtransid='1000010';
        $languageIso2='en';
        $switchBackTimeout='5000';
        $reqpayresp = $gw->requestPayment($appId,$amount,$mobtransid,$languageIso2,$switchBackTimeout);
        if($reqpayresp)
        {
            echo 'main.calling requestPayment = success'.'<br/>';

            echo 'main.calling requestPayment requestId = '.$reqpayresp->get_requestId().'<br/>';
            echo 'main.calling requestPayment state = '.$reqpayresp->get_state().'<br/>';
            echo 'main.calling requestPayment amountValue = '.$reqpayresp->get_amountValue().'<br/>';
            echo 'main.calling requestPayment partialPan = '.$reqpayresp->get_partialPan().'<br/>';
            echo 'main.calling requestPayment posReferenceNumber = '.$reqpayresp->get_posReferenceNumber().'<br/>';
            echo 'main.calling requestPayment terminalId = '.$reqpayresp->get_terminalId().'<br/>';
            echo 'main.calling requestPayment aid = '.$reqpayresp->get_aid().'<br/>';
        }
        else
        {
            echo 'main.calling requestPayment = failureaa'.'<br/>';
        }
    }
    */
?>