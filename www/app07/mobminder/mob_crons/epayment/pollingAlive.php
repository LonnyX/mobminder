#!/usr/bin/php5 -q
<?php

//////////////////////////////////////////////////////////////////////////////////////////
//
//
// computop server cannot be checked because there is no direct call to server
// 
//////////////////////////////////////////////////////////////////////////////////////////

// list of alive parameters
// ========================
// pollingAlive.php	=> pay_provider_alive_limit (if paymean alive counter > limit => try to solve issue by pinging server)
// pollingHat.php => pay_provider_alive_limit (if paymean alive counter > limit => no polling)
// smart/query/config202307.php => <pars>payalivelimit=xx</pars> (if paymean alive counter > limit => payment is disabled)
// booking/_assets/jscripts/mobframe.js => pay_provider_alive_limit (if paymean alive counter > limit => payment is disabled)


define('crontest', true); 	// when maintaining this page, pass this parameter to true so you can easily call the page and test it
							//crontest only displays echo and change required libraries path
define('smstest',true);
//define('pay_provider_alive_limit', 10); // condition to wait for resolving down issue by pinging server, (if paymean counter is greater than limit)



function onePollingExecution()
{
	if(crontest) echo 'calling onePollingExecution'.'<br/>';

	if(C_dS_system::$provider_threshold==0)
	{
		if(crontest) echo 'pollingAlive is disabled !'.'<br/>';
		return;
	}

	$dS_system = new C_dS_system();
	if($dS_system->is_Payconiq_alive>C_dS_system::$provider_threshold)
	{
		echo 'Payconiq is down (counter>'.C_dS_system::$provider_threshold.')'.(crontest?'<br/>':chr(10));
		
		if(!$dS_system->is_Payconiq_reported)
		{
			C_dS_system::providerreported('Payconiq');
		 	sendSms('Payconiq server is offline');
		}
		$interface = new C_PayconiqGateaway();
		if($interface->isServerAlive()) 
		{
			echo 'Payconiq is alive after check alive'.(crontest?'<br/>':chr(10));
			C_dS_system::provideralive('Payconiq');
			sendSms('Payconiq server is online');
		}
		else if(crontest) echo 'Payconiq is still down after check alive'.'<br/>';
	}
	else if(crontest) echo 'Payconiq is alive (counter<='.C_dS_system::$provider_threshold.')'.'<br/>';

	if($dS_system->is_SoftPay_alive>C_dS_system::$provider_threshold)
	{
		echo 'SoftPay is down (counter>'.C_dS_system::$provider_threshold.')'.(crontest?'<br/>':chr(10));
		
		if(!$dS_system->is_SoftPay_reported)
		{
			C_dS_system::providerreported('SoftPay');
			sendSms('SoftPay server is offline');
		}
		if(isSoftPayServerAlive()) 
		{
			echo 'SoftPay is alive after check alive'.(crontest?'<br/>':chr(10));
			C_dS_system::provideralive('SoftPay');
			sendSms('SoftPay server is online');
		}
		else if(crontest) echo 'SoftPay is still down after check alive'.'<br/>';
	}
	else if(crontest) echo 'SoftPay is alive (counter<='.C_dS_system::$provider_threshold.')'.'<br/>';

	if($dS_system->is_HardPay_alive>C_dS_system::$provider_threshold)
	{
		echo 'HardPay is down (counter>'.C_dS_system::$provider_threshold.')'.(crontest?'<br/>':chr(10));
		
		if(!$dS_system->is_HardPay_reported)
		{
			C_dS_system::providerreported('HardPay');
			sendSms('HardPay server is offline');
		}
		if(isGoCryptoServerAlive()) 
		{
			echo 'HardPay is alive after check alive'.(crontest?'<br/>':chr(10));
			C_dS_system::provideralive('HardPay');
			sendSms('HardPay server is online');
		}
		else if(crontest) echo 'HardPay is still down after check alive'.'<br/>';
	}
	else if(crontest) echo 'HardPay is alive (counter<='.C_dS_system::$provider_threshold.')'.'<br/>';

}
function sendSms($msg)
{
	if(smstest)
	{
		echo '(sms testmode) sending sms with message = '.$msg.'<br/>';
	}
	else
	{
		$un='mobminderInter';
		$pw='tgx23PiQ';
		$msg=urlencode($msg);
		#echo "msg=$msg"
		$from='Mobminder';
		$to='32497462820';
		$dcs='1';         # ISO-8859-1 (latin 1), the mBlox server takes care of conversion into GSM alphabet
		$dr='0';          # request delivery receipt
		$ur='1';          # user reference (passed back in delivery callback) ????
		$exp='1440';      # validity period in minutes (we set 24 hours)
		$st='5';          # source type (Alphanumeric)
		$sys='H';         # system type (there is no alternative here and no reason explained in the spec)
        $url = 'https://eu1.httpgw.api.sinch.com:443/HTTPSMS?S='.$sys.'&UN='.$un.'&P='.$pw.'&DA='.$to.'&SA='.$from.'&M='.$msg.'&UR='.$ur.'&ST='.$st.'&DC='.$dcs.'&DR='.$dr.'&VP='.$exp; 
        $curl = curl_init();
        $options = array(
            CURLOPT_URL            	=> $url,
            CURLOPT_POST            => false,
            //CURLOPT_POSTFIELDS      => $data,
            CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
            CURLOPT_RETURNTRANSFER 	=> true,
            CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
            CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
            CURLOPT_AUTOREFERER    	=> true,
            CURLOPT_TIMEOUT_MS 		=> 1000, 
            CURLOPT_FRESH_CONNECT 	=> true,
            CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
            CURLOPT_VERBOSE 		=> false,
            //CURLOPT_HTTPHEADER      => $headers,
            CURLOPT_SSL_VERIFYPEER  => false // TO CHANGE IN PRODUCTION
        );
        curl_setopt_array($curl,$options);
		curl_exec($curl);
        curl_close($curl);

	}
}

if(crontest) echo '<br/>';

$systemLog = 'polling payment cron';
if(crontest) { // when running it locally
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/softpayio.php';
	require '../../lib_mobphp/gocrypto.php';
	require '../../lib_mobphp/onlinepayment.php';


	echo '<!DOCTYPE HTML>';
	echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
			echo '<head>';
}
else {  // when running in production
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/softpayio.php'; 
	require '/var/www/mobminder/lib_mobphp/gocrypto.php';
	require '/var/www/mobminder/lib_mobphp/onlinepayment.php';
}

$starttime = new C_date();

if(crontest) echo '<br/>';

$startTime = microtime(true); // Get the current time in seconds with milliseconds

onePollingExecution();

if(crontest) echo 'end<br/>';

////////////////////////////////////////////////////////////////////////////////////////////////
$endtime = new C_date();
$delta = $endtime->t - $starttime->t;
$start = 	'EXECUTION STARTED: '.$starttime->getDateTimeString();
$done = 	'DONE: '.$endtime->getDateTimeString();
$delta = 	'DELTA: '.$delta.'sec';

if(crontest) { // testing locally displays HTML back to client
	echo '<br/><br/>TENS CRON TEST<br/>';
	echo $start.'<br/>'.$done.'<br/>'.$delta.'<br/>';
	echo '</body>';
	echo '</html>';
	
} else { // running in CLI mode, outputs to /var/log/???.log
	echo $start.'-'.$done.'-'.$delta.chr(10);
}

?>