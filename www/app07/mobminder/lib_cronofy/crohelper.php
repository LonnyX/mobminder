<?php
require 'cronofymanager.php';

//revoke all cronofy calendars related to mobminder accesskeys list (array)
//$loginId is mandatory to store login information in log fields (logging)
//called : when login or account or accesskey has been deleted
//
// it is used in
//  	/delete/account.php
// 		/delete/login/php
// 		/post/account.php
//
function RevokeCalendarsForAccessKeys($accesskeysIds,$loginId)
{
    DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.start');
    if (count($accesskeysIds)>0)
	{
		DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.accesskeysIds > 0');

		//RevokeCalendarsForAccessKeys is called by an external user (not the current user linked to cronofy)
		//that's why we need to pass the real processing user for logging traces
		$dS_login = new C_dS_login($loginId);
		C_dbIO::logged($dS_login, '(crohelper)');
        
		foreach($accesskeysIds as $accesskeysId)
		{
			DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.loop.accesskeyid='.$accesskeysId);
			$cronofy_accesses = new C_dbAccess_cronofy_accesses();
			$cronofy_accesses->getByKeyId($accesskeysId); //getByKeyId should return only one row!

			foreach($cronofy_accesses->keyed as $cid => $dS_cronofy_access)
			{
				DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.subloop.cronofyaccessid='.$dS_cronofy_access->id);
				$dS_cronofy_access_id = $dS_cronofy_access->id;
				$dS_cronofy_manager_access = new C_cronofy_manager_access($dS_cronofy_access_id);

				//needed again because C_cronofy_manager_access constructor (called juste before) uses accesskey user to set C_dbIO::logged
				C_dbIO::logged($dS_login, '(crohelper)');
				
				$dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
				$dbAccess_cronofy_calendars->getByGroupId($dS_cronofy_access_id);
				DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.call revokecalendars');
				$dS_cronofy_manager_access->RevokeCalendars($dbAccess_cronofy_calendars->keyed);
			}

		}
	}
	else
	{
		DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.cronofy.no need');
	}
    DebugLog('cronofymanager.RevokeCalendarsForAccessKeys.end');

}
?>