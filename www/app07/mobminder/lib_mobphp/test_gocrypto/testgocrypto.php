<?php
    require '../dbio.php';
    require '../gocrypto.php';

    function debugLog($log)
    {
        $time = @date('[d/M/Y:H:i:s]');
	    $result = file_put_contents(__DIR__ .'/gocrypto.log',$time.' - ' . $log . "\n", FILE_APPEND | LOCK_EX);
    }

    
    //testing initializeTerminal (pair) //////////////////////////////////////////////////////////////////////////////
    if(1){ 
        $dS_Group = new C_dS_group(3925);
        $otp='IYH09B'; //get from terminal
        $name='MobminderBSP'; //need to define a generic name for each customer
        
        $res = initializeTerminal($dS_Group,$otp,$name);
        if (!$res) {
            echo 'main calling initializeTerminal with failure'.'<br/>'; 
            debugLog('main calling initializeTerminal with failure');
        }
        else{
            echo 'main calling initializeTerminal with success'.'<br/>'; 
            debugLog('main calling initializeTerminal with success');
            debugLog('initializeTerminal');
            debugLog('clientid='.$dS_Group->ePayHardPayClientId);
            debugLog('clientsecret='.$dS_Group->ePayHardPayClientSecret);
        }
        //check client id and client secret in database

    } 

    //testing unpair //////////////////////////////////////////////////////////////////////////////
    if(0){ 
        $dS_Group = new C_dS_group(3925);
        $res = resetTerminal($dS_Group);
        if (!$res) {
            echo 'main calling resetTerminal with failure'.'<br/>'; 
        }
        else{
            echo 'main calling resetTerminal with success'.'<br/>'; 
        }
    } 


    //testing create payment ///////////////////////////////////////////////////////////////////////////////////
    $transactionID = '1bb41411-0814-46da-98e5-ad59a1b82ce3'; //from create paiement result
    if(0)
    {
        $dS_Group = new C_dS_group(3925);

        $amount=1199; //in cent
        $paymentId= time(); //generate random number for testing
        $printSlip = false; //print or not the slip
        
        $res = createGoCryptoPayment($dS_Group,$amount,$paymentId,$printSlip);
        if(!$res)
        {
            echo 'main calling createGoCryptoPayment with failure'.'<br/>'; 
        }
        else
        {
            echo 'main calling createGoCryptoPayment with success'.'<br/>'; 
            echo 'main calling createGoCryptoPayment transactionId = '.$res.'<br/>'; //transactionId is needed to call get transaction status
        }
    }
    //testing get transaction status (same as polling) ///////////////////////////////////////////////////////
    if (0) 
    {
        $dS_Group = new C_dS_group(3925);
        

        $res = checkGoCryptoStatus($dS_Group,$transactionID);
        if(!$res)
        {
            echo 'main calling checkGoCryptoStatus with failure'.'<br/>'; 
        }
        else
        {
            echo 'main calling checkGoCryptoStatus with success'.'<br/>'; 
            echo 'main calling checkGoCryptoStatus status = '.$res.'<br/>';
        }
    }
    if (0) 
    {
        $dS_Group = new C_dS_group(3925);

        $res = deleteGoCryptoPayment($dS_Group,$transactionID);
        if(!$res)
        {
            echo 'main calling deleteGoCryptoPayment with failure'.'<br/>'; 
        }
        else
        {
            echo 'main calling deleteGoCryptoPayment with success'.'<br/>'; 
            echo 'main calling deleteGoCryptoPayment status = '.$res.'<br/>';
        }
    }



?>