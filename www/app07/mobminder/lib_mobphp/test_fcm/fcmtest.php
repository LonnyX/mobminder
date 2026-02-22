<?php


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
//  F I R E B A S E  
//  C O M M U N I C A T I O N 
//  M E S S A G E
//
//  A P I    T E S T I N G 
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////


require "../dbio.php";
require "../fcmgateawaylib.php";

echo 'mon premier envoi de notification</br></br>';

$gateway = new C_FcmGateaway();

if(false) //test only FCM api
{
    //set all parameters before running test : tokens + accesskey + resourceid + resaid
    
    //scenario:
    //1. call FCM api
    //2. display result information (success or failure)

    $tokens = array();
    $tokens[] = 'eUqYSP-4bEXtmdeirWACdS:APA91bEMUZaJ9LjtDKADSzsuDznbPJPkRytC_7nImJNWuJZzI2ARV8ezjtZrFbd4_aTbIRa3QoVwKCmC8tBxZLqumxgkygjDqpgKyilIS0yQpseqOmpCMp3CAeKOO8sA9yfT-OnJ_pg0'; 
    $tokens[] = 'fq38udKoTiOf4iDEPLRkL6:APA91bFKtLdRoQa1CbAtEv2ZICzJejVsOdSbYwL-Qj1yuku4JGYELUek47Wogo1woni9Ak5NPsDnb8MIEbXUR1wOovDS32y5EWPviwMLBkaVDLlqw_Qb-ymyiHPxwQsPtxZc8spfQDJ5'; 
    $tokens[] = 'ewzo5SIun00OoDsDC2tPSV:APA91bHBtCYHKoO_qw0BNEEXHO6_U5kdfosa47SF-fEsvEwDKsKMd4kYU8scvnCyBemGd-4nKIpofNJQvdPxFK9Ky7knjfKo97yUS-hkRi9qyxc6Bnba2jBxtSECOZPz1Z5gG4LQq0tA'; 

    $accesskeyid = '28454';
    $resourceid = '12773';
    $reservationid = '27005283';
    $sdaterdv = '2022-11-07';
    $title = 'mon titre 😊'; 
    $body= 'mon premier body 😊';

    $result = $gateway->sendResaNotification($tokens,$accesskeyid,$resourceid,$reservationid,$sdaterdv,$title,$body);

    if (!$result)
    {
        echo 'lasthttpcode = '.$gateway->lasthttpcode.'</br>';
        echo 'lasterrorcode = '.$gateway->lasterrorcode.'</br>';
        echo 'lasterrormessage = '.$gateway->lasterrormessage.'</br>';
    }
    else
    {
        echo 'lasthttpcode = '.$gateway->lasthttpcode.'</br>';
        echo 'retour='.$result->content.'</br>';
        echo 'multicast_id='.$result->multicast_id.'</br>';
        echo 'success='.$result->success.'</br>';
        echo 'failure='.$result->failure.'</br>';
        foreach($result->invalidtokens as $token) echo 'invalid token='.$token.'</br>';

    }
}
else //test loading/cleaning devices + calling FCM apu
{
    //set all parameters before running test : login id + accesskey + resourceid + resaid
    
    //scenario:
    //1. load tokens by login ID
    //2. call FCM api
    //3. clean invalid token if needed
    //4. insert db exception if needed

    $loginid = 9085;

    $accesskeyid = '28454';
    $resourceid = '12773';
    $reservationid = '22624897';
    $sdaterdv = '2022-11-07';
    $title = 'mon titre 😊'; 
    $body= 'mon premier body 😊';

    $result = $gateway->sendResaNotification4Login($loginid,$accesskeyid,$resourceid,$reservationid,$sdaterdv,$title,$body);

    if (!$result)
    {
        echo 'error</br>';
    }
    else
    {
        echo 'success</br>';
    }
}

?>