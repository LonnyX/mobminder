<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   
//
//	Calls like:
//
//	http://192.168.0.37/smsgateaway/device/monitoring.php?name=rpi1&swversion=123&netaddr=192.168.0.123&location=moha&lastptmp=42&lastuvolt=0&lastRAMtotal=100&lastRAMused=20&lastSDtotal=999&lastSDused=33&lastexectime=2024-06-11%2015:30:01

require '../sga_lib.php';
$perfReport = new C_perfReport();
setrendermode('..');

if(!$web) { ob_start(); } // relates to (*ob1)

$name = @$_REQUEST['name']; if(!isset($name)) die('error 0100'); // name is missing
$swversion = @$_REQUEST['swversion']; if(!isset($swversion)) die('error 0101');
$netaddr = @$_REQUEST['netaddr']; if(!isset($netaddr)) die('error 0102');
$location = @$_REQUEST['location']; if(!isset($location)) die('error 0103');

$lastcpu = @$_REQUEST['lastcpu']; if(!isset($lastcpu)) die('error 0115');
$lastptmp = @$_REQUEST['lastptmp']; if(!isset($lastptmp)) die('error 0104');
$lastuvolt = @$_REQUEST['lastuvolt']; if(!isset($lastuvolt)) die('error 0105');
$lastRAMtotal = @$_REQUEST['lastRAMtotal']; if(!isset($lastRAMtotal)) die('error 0106');
$lastRAMused = @$_REQUEST['lastRAMused']; if(!isset($lastRAMused)) die('error 0107');
$lastSDtotal = @$_REQUEST['lastSDtotal']; if(!isset($lastSDtotal)) die('error 0108');
$lastSDused = @$_REQUEST['lastSDused']; if(!isset($lastSDused)) die('error 0109');

$lastexectime = @$_REQUEST['lastexectime']; if(!isset($lastexectime)) die('error 0110'); // last date exec time is missing

$sloticcids =  @$_REQUEST['sloticcids']; if(!isset($sloticcids)) die('error 0111'); 
$sloticcids = explode("!", $sloticcids);
$slotstatus =  @$_REQUEST['slotstatus']; if(!isset($slotstatus)) die('error 0112'); 
$slotstatus = explode("!", $slotstatus);
$slotcsqs =  @$_REQUEST['slotcsqs']; if(!isset($slotcsqs)) die('error 0113'); 
$slotcsqs = explode("!", $slotcsqs);
$slotports =  @$_REQUEST['slotports']; if(!isset($slotports)) die('error 0114'); 
$slotports = explode("!", $slotports);

if(count($sloticcids)!=count($slotstatus)) die('error 0115'); 
if(count($sloticcids)!=count($slotcsqs))   die('error 0116'); 
if(count($sloticcids)!=count($slotports))  die('error 0117'); 



$perfReport->peak('::device');

$device = C_dS_device::findbyname($name);

if($device==null)
{
	$device = new C_dS_device();
	$device->name = $name;
}

$device->swversion = $swversion;
$device->netaddr = $netaddr;
$device->location = $location;

$device->lastcpu = $lastcpu;
$device->lastptmp = $lastptmp;
$device->lastuvolt = $lastuvolt;
$device->lastRAMtotal = $lastRAMtotal;
$device->lastRAMused = $lastRAMused;
$device->lastSDtotal = $lastSDtotal;
$device->lastSDused = $lastSDused;

$device->lastexectime = $lastexectime; //$device->tracknow();
$device->lastseen = C_id::tracknow();



$device->save();

$perfReport->peak('::slots');

////////////////////////////////////////////////////////////////////////////////
//
// Save satellite record, we made is such that it is as atomic as possible, see (*sga08*)
//

for ($i = 0; $i < count($sloticcids); $i++) 
{
	$iccid=$sloticcids[$i];
    

	$status=$slotstatus[$i];
	$csq=$slotcsqs[$i];
	$port=$slotports[$i];


	//update sim
	if(!empty($iccid))
	{
		$satellite = C_dS_satellite::login($iccid,false);
		if($satellite!=null)
		{
			$sats = C_dS_satellite::$current_satellites;
			$query = 'update '.$sats.' set lastseen = "'.C_id::tracknow().'", status = '.$status.', lastcsq = '.$csq.', port = "'.$port.'", sat = "'.$name.'" where id='.$satellite->id.';';
			//echo $query.$nl;
			new Q($query);
		}
	}

	//update/insert clost
	$slot = C_dS_slot::findByPort($device->id,$port);
	if($slot!=null)
	{
		$slot->status = $status;
		$slot->lastcsq = $csq;
		$slot->save();
	}
	else
	{
		$slot = new C_dS_slot(0,$device->id);
		$slot->port = $port;
		$slot->status = $status;
		$slot->lastcsq = $csq;
		$slot->save();
		

	}

}





$perfReport->peak('::end');
		

echo '<data>'.$nl;
echo '</data>';

echo '<command>'.$nl;
echo '</command>';


if($web) { // disabled when testing using browser mode, so the next section can echo on the screen
	$perfReport->dropReport();
}

endrendermode();
?>