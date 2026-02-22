<?php

require '../../../../mobminder/lib_mobphp/onlinepayment.php';
require '../../../../mobminder/lib_mobphp/dbio.php';  



//transid should contains prefix "TR" before transaction id (workarround to avoid computop issue with numeric transactiond id)
@$_GET['transid'] = '10000832';
@$_GET['payid'] = '592c18e75dd74b35ba64c43397c37288';
@$_GET['amount'] = '240';



//@$_GET['payid'] = "244333485f364082bfec1492b3625dbd";
//@$_GET['transid'] = "99169";
//@$_GET['amount'] = "100";



$transid = @$_GET['transid']; if(!isset($transid)) die('transid not found!');
$payid = @$_GET['payid']; if(!isset($payid)) die('payid not found!');
$amount = @$_GET['amount']; if(!isset($amount)) die('amount not found!');


$BlowfishPassword = "6Mf_m[C72s=W*4Qe";
$MerchantID = "done4you_test";       
$HmacPassword = "Yf4[*Fm7Ra6)p2_BTy9(?Me35!Nz=Aq8";     

$gw = new C_ComputopGateaway($BlowfishPassword,$MerchantID,$HmacPassword);

//$transid =  "99169";
//$amount = "100";
//$payid = "244333485f364082bfec1492b3625dbd";
  
echo 'transid='.$transid.'</br>';
echo 'amount='.$amount.'</br>';
echo 'payid='.$payid.'</br>';
  

$result = $gw->confirmPayment($transid,$amount,$payid,false);

if(!$result)
{
  echo "erreur lors de l'appel";
}
else
{
  //echo "retour call = " . $result;

  $mid = $result->getMid();
  $payid = $result->getPayID();
  $transid = $result->getTransID();
  $xid = $result->getXID();
  $code = $result->getCode();  
  $status = $result->getStatus();
  $description = $result->getDescription();
  $type = $result->getType();
  $msgver = $result->getMsgver();
  $mac = $result->getMAC(); 

  echo "mid=".$mid."<br/>";
  echo "payid=".$payid."<br/>";
  echo "transid=".$transid."<br/>";
  echo "xid=".$xid."<br/>";
  echo "code=".$code."<br/>";
  echo "status=".$status."<br/>";
  echo "description=".$description."<br/>";
  echo "type=".$type."<br/>";
  echo "msgver=".$msgver."<br/>";
  echo "mac=".$mac."<br/>";
            
  $status = $result->getStatus();
  $transtatus = converterComputoptoPaymentStatus($status);
  
  echo "transtatus = " . $transtatus."<br/>";

  
}
 

?>