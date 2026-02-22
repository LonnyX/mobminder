<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    V I S I T O R  
//


ob_start();
$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 

sleep(1); //Wait 1 sec to prevent hacking

if(isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
if(isset($_SESSION['e-paymean'])) unset($_SESSION['e-paymean']);



$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];
if(!isset($_POST['language'])) $_POST['language'] = $dS_login->language;

C_dbIO::logged($dS_login,'(eresa)'); // sign any change in DB

fieldscleaner($_POST);

$dS_visitor = new C_dS_visitor($id, $accountId, $_POST);
$dS_visitor->mobile = checkMobileFormat($dS_visitor->mobile, $dS_account->phoneRegion);
$dS_visitor->email = trim(strtolower($dS_visitor->email));



// before recording the new visitor, check if existing visitors are likely to be the same person
// where caluse = strict given lastname,firstname and (email OR mobile) 
// the process is not applied in family mode
// see (*clone01*)
//
if(true)
{
	if($id <= 0 && $dS_login->eresaIdentMode==0)
	{
		$clones = new C_dbAccess_visitors();
		$clones->loadClones($accountId, $dS_visitor->email, $dS_visitor->mobile,$dS_visitor->lastname,$dS_visitor->firstname);

		if($clones->count()==0) //no clone found => create new visitor
		{
			echo $nl.'no clone found => create new visitor';
			$dS_visitor->dSsave();
		}
		else //at least one clone found
		{
			echo $nl.'at least one clone found';
			$dS_visisolve = $clones->getfirst();
			if($clones->count()>1) //more than one clone => merging
			{
				echo $nl.'more than one clone => merging...';

				foreach($clones->keyed as $idclone => $clone) 
				{
					if ($idclone==$dS_visisolve->id) continue; //first clone is the solve visitor => do not merge it!
					echo $nl.$clone->getFullName().chr(9).' '.$clone->mobile.chr(9).' '.$clone->birthday.chr(9).' '.$clone->email;
					$clone->mergeTo($dS_visisolve->id, $dS_account, $dS_visisolve);			
				}
			}
			
			//enrich solve visitor with the new one (priority to last information)
			if($dS_visitor->address)	{ $dS_visisolve->address = 	$dS_visitor->address; } 
			if($dS_visitor->zipCode) 	{ $dS_visisolve->zipCode = 	$dS_visitor->zipCode; } 
			if($dS_visitor->city) 		{ $dS_visisolve->city = 	$dS_visitor->city; 	  } 
			if($dS_visitor->country) 	{ $dS_visisolve->country = 	$dS_visitor->country; } 
			if($dS_visitor->phone) 		{ $dS_visisolve->phone = 	$dS_visitor->phone;   } 

			if($dS_visitor->birthday) 	{ $dS_visisolve->birthday =	$dS_visitor->birthday; }
			if($dS_visitor->mobile) 	{ $dS_visisolve->mobile = 	$dS_visitor->mobile;   }
			if($dS_visitor->email) 		{ $dS_visisolve->email = 	$dS_visitor->email;    }

			$dS_visisolve->dSsave(); 

			$dS_visitor = $dS_visisolve;
			$id = $dS_visisolve->id; //not used
			
		}
	}
	else //family mode => create new visitor
	{
		echo $nl.'family mode => create new visitor';
		$dS_visitor->dSsave();
	}
	echo $nl;
}
else //code to remove (old version)
{
	$dS_visitor->dSsave();
}

//visitor created  from e-reservation
if($dS_login->eresaIdentMode==1)
{
	//family mode => add new visitor id 

	if(empty($_SESSION['e-visi']))
		$_SESSION['e-visi'] = $dS_visitor->id;
	else
		$_SESSION['e-visi'] = $_SESSION['e-visi'].','.$dS_visitor->id;
}
else
{
	$_SESSION['e-visi'] = $dS_visitor->id;
}
session_write_close(); 


echo '<code>';
echo $dS_visitor->stream1(with_tracking);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_visitor');
closeconnection();
?>