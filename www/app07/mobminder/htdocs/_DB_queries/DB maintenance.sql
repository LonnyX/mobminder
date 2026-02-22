

-- Show accounts that have none accesskeys attached (!!)
--

select groups.id, name, created, creator, groups.changed, changer, accesskeys.groupId from groups 
	left join accesskeys on accesskeys.accountId = groups.id
	where accesskeys.groupId is null;




-- Merge a bunch of colors and workcodes after two account have been merged
--

update archive_reservations set cssColor = 28492 where groupId = 3026 and cssColor = 43196; -- 28492
update reservations set cssColor = 28492 where groupId = 3026 and cssColor = 43196;
update workcodes set cssColor = 28492 where groupId = 3026 and cssColor = 43196;

-- R4
update visitors set cssColor = 43164 where groupId = 3026 and cssColor = 28491; -- 43164

-- R5 notes 
update note_details set cssColor = 43173 where groupId = 3026 and cssColor = 3216; -- 43173
update note_details set cssColor = 3224 where groupId = 3026 and cssColor = 43175; -- 3224
update note_details set cssColor = 3217 where groupId = 3026 and cssColor = 43176; -- 3217
update note_details set cssColor = 3220 where groupId = 3026 and cssColor = 43177; -- 3220


-- R9 tasks
update task_descriptions set cssColor = 43191 where groupId = 3026 and cssColor = 39172; -- 43191
update task_descriptions set cssColor = 43179 where groupId = 3026 and cssColor = 3221; -- 43179
update task_descriptions set cssColor = 3225 where groupId = 3026 and cssColor = 43180; -- 3225
update task_descriptions set cssColor = 3223 where groupId = 3026 and cssColor = 43181; -- 3223
update task_descriptions set cssColor = 13842 where groupId = 3026 and cssColor = 43190; -- 13842
update task_descriptions set cssColor = 3222 where groupId = 3026 and cssColor = 43182; -- 3222


-- R15 performances
update performances set workCodeId = 17850 where workCodeId = 26248; -- 17850
update performances set workCodeId = 26245 where workCodeId = 20621; -- 26245
update performances set workCodeId = 17962 where workCodeId = 26244; -- 17962
update performances set workCodeId = 17853 where workCodeId = 26242; -- 17853


-- R15 archive_performances
update archive_performances set workCodeId = 17850 where workCodeId = 26248; -- 17850
update archive_performances set workCodeId = 26245 where workCodeId = 20621; -- 26245
update archive_performances set workCodeId = 17962 where workCodeId = 26244; -- 17962
update archive_performances set workCodeId = 17853 where workCodeId = 26242; -- 17853






-- Inventaire des hourliesusers qui pointent vers un hourly qui a été effacé
--

select groups.name as accountName, resources.name as resourceName, FROM_UNIXTIME(dayIn) as dayin, hourliesusers.hourlyId, hourliesusers.created, hourliesusers.creator from hourliesusers
join resources on resources.id = hourliesusers.groupId
join groups on groups.id = resources.groupId
left join hourlies on hourlies.id = hourliesusers.hourlyId 
where hourlies.id is NULL order by hourliesusers.dayin desc;





-- Inventaire des comptes qui envoient encore des SMS via le shortcode
--
-- Ci-dessous inventaire des comptes visibles dans ton portefeuille qui ont toujours un template SMS connecté sur le shortcode. Comptage sms sur Février et Mars
--
-- Giraud (7893)
-- Keevin (7881)
-- Axel (7896)
-- Olivier Gay (7922,9482,10444) (dieplus,olivier,h4d)
-- Oxteo Pierre (11641)
-- Burogest (8350)
-- Caretel/tbb (14191)
-- Catherine Barthel (8820)
-- Upskill (9859)
-- Philippe Orban (8914)
-- Pascal (7875)
-- Mover closed (8797)
-- Spitup (14036)
-- 

	select logins.firstname, logins.lastname, logins.login, groups.id, groups.name as accountname
			, templates_sms.name as templ_name, count(sms.pages) as trafic
			from templates_sms
join groups on groups.id = templates_sms.groupId
join accesskeys on templates_sms.groupId = accesskeys.accountId
join logins on logins.id = accesskeys.groupId
join sms on sms.templateId = templates_sms.id
where templates_sms.id > 0 and groups.phoneRegion = '32'
		and templates_sms.smsgateaway = 'shortcode'
		and sms.created > '2020-10-01'
		and accesskeys.groupId IN (7893,7881,7896,7922,9482,10444,11641,8350,14191,8820,9859,8914,7875,8797,14036)
	group by templates_sms.id order by logins.id asc, groups.id asc;
		
		


-- ---------------------------------------------------------------------------------------
-- Find mobiles that were input as phones, move them to mobiles, clean up phones
--
-- This is usefull after visitors register was imported through sync from a messy DB
--
-- NOTE : should be improved with a "touch" on each items, so they flow back to synced DB


select id, phone, CONCAT('32',SUBSTR(phone, -9, 9)) as asmobile from visitors
	where groupId = 2940 
		and CHAR_LENGTH(phone) = 10
		and SUBSTR(phone, 1, 2) = "04"
		and mobile = "";
		
update visitors set mobile = CONCAT('32',SUBSTR(phone, -9, 9)), changed = NOW(), -- check change = NOW to be a timestamp
where groupId = 2940 
		and CHAR_LENGTH(phone) = 10
		and SUBSTR(phone, 1, 2) = "04"
		and mobile = "";

update visitors set phone = ""
where groupId = 2940 
		and CHAR_LENGTH(phone) = 10
		and SUBSTR(phone, 1, 2) = "04"
		and mobile = CONCAT('32',SUBSTR(phone, -9, 9));


-- ---------------------------------------------------------------------------------------
-- Capitalize firstnames 
--

UPDATE visitors
SET firstname = CONCAT(UCASE(LEFT(firstname, 1)), SUBSTRING(firstname, 2))
where groupId = 4396;



-- ---------------------------------------------------------------------------------------
-- Human readable date-time from a reservation in the DB
--

select FROM_UNIXTIME(cueIn,'%a %b %d %H:%i:%s UTC %Y') as cueIn, note from reservations where id = 3587696;



select reservations.id, lastname, firstname, mobile, FROM_UNIXTIME(cueIn,'%a %b %d %H:%i:%s UTC %Y') as cueIn, reservations.note from reservations
join att_visitors on att_visitors.groupId = reservations.id
join visitors on att_visitors.resourceId = visitors.id
where reservations.id = 13706172;







-- ---------------------------------------------------------------------------------------
-- Remove any non numeric garbage from the mobile column in our visitors table
-- ( this query took 8 sec to execute on production DB in 2019/09, fixed 1100 items )


update visitors set mobile = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
															REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
															REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(	
															REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(								
										mobile,"a",""),"b",""),"c",""),"d",""),"e",""),"f",""),"g",""),"h",""),"i",""),"j",""),"k",""),"l","")
										,"m",""),"n",""),"o",""),"p",""),"q",""),"r",""),"s",""),"t",""),"u",""),"v",""),"w",""),"x","")
										,"y",""),"z",""),"é",""),"è",""),"ë",""),"ê",""),"ô",""),"ö",""),"*",""),",",""),"!",""),"?","")
										," ",""),".",""),"/",""),"-",""),"+",""),"-",""),"(",""),")",""),",",""),":",""),"°","")," ","")
	where mobile like '%a%' or mobile like '%b%' or mobile like '%c%' or mobile like '%d%' or mobile like '%e%' or mobile like '%f%' or mobile like '%g%' or mobile like '%h%' or mobile like '%i%' or mobile like '%j%' or mobile like '%k%' or mobile like '%l%'
or mobile like '%m%' or mobile like '%n%' or mobile like '%o%' or mobile like '%p%' or mobile like '%q%' or mobile like '%r%' or mobile like '%s%' or mobile like '%t%' or mobile like '%u%' or mobile like '%v%' or mobile like '%w%' or mobile like '%x%'
or mobile like '%y%' or mobile like '%z%' or mobile like '%é%' or mobile like '%è%' or mobile like '%ë%' or mobile like '%ô%' or mobile like '%ê%' or mobile like '%*%' or mobile like '%,%' or mobile like '%!%' or mobile like '%?%' or mobile like '%E%'
or mobile like '% %' or mobile like '%.%' or mobile like '%/%' or mobile like '%+%' or mobile like '%(%' or mobile like '%)%' or mobile like '% %' or mobile like '%°%';







-- ---------------------------------------------------------------------------------------
-- 
--


update visitors set cssColor = 
(select id from 
(select id, name, SUBSTRING_INDEX(SUBSTRING_INDEX(name,'(',-1),')',1) as zoneId -- - isolates the value between parenthses, "Pascal (21)" is extracted as "21"
	from custom_css where groupId = 4465 and resaClass = 3 and cssType = 80) alias
where zoneId = 31)
where visitors.residence=31 and visitors.groupId = 4465;








-- ---------------------------------------------------------------------------------------
-- Diagnosing the synchro: duplicate remoteId's problem
--


SELECT remoteId, COUNT(*) as c FROM synchro_reservations join reservations on reservations.id = synchro_reservations.localId 
			WHERE skeyId = 20658 GROUP BY remoteId HAVING c > 1;

SELECT localId, COUNT(*) as c FROM synchro_reservations join reservations on reservations.id = synchro_reservations.localId 
			WHERE skeyId = 20658 GROUP BY localId HAVING c > 1;

-- here we select only the synchro_reservations correlators for which a double remoteId was introduced. This happens when an acknowledge takes place many times for the same item. 
select groupId, id, remoteId, localId from synchro_reservations where skeyId = 20658 and remoteId in (
	select remoteId from (SELECT remoteId, COUNT(*) as c FROM synchro_reservations join reservations on reservations.id = synchro_reservations.localId 
			WHERE skeyId = 20658 GROUP BY remoteId HAVING c > 1) alias) order by remoteId desc;

SELECT localId as id, synchro_reservations.id as younger FROM synchro_reservations WHERE skeyId = 20658 AND remoteId = 30908 order by younger desc limit 1; -- this is the fix placed in /sync/lib.php, we only select the last created item

select * from logins where groupId = 2926 and accessLevel = 3;






-- ---------------------------------------------------------------------------------------
-- Find an account id based on an access login (in the example, we are looking for Christine Thomas)
--

select firstname, lastname, groups.name, groups.id from logins 
	join groups on logins.groupId = groups.id
	where lastname like "thomas";







-- ---------------------------------------------------------------------------------------
-- Find the logins having access to a given account id (wallet)
--

select groups.name as accountname, logins.lastname, logins.login, logins.password, logins.accessLevel from logins
	join accesskeys on accesskeys.groupId = logins.id
	join groups on groups.id = accesskeys.accountId
	where accountId = 2895 order by logins.accessLevel DESC;



	
	

-- ---------------------------------------------------------------------------------------
--
-- Full overview of cronofy connections
-- 
--

select cronofy_accesses.keyId, cronofy_user.groupId as loginId, logins.lastname, logins.firstname,accessKeys.accountId,
			groups.name as accountName,cronofy_calendar.resourceId,  resources.name as resourceName,
			cronofy_profile.cro_provider_name, cronofy_profile.cro_profile_name
	
from cronofy_calendar

	join cronofy_accesses on cronofy_accesses.id = cronofy_calendar.groupId
	join cronofy_profile on cronofy_profile.id = cronofy_accesses.groupId
	join cronofy_user 	on cronofy_user.id = cronofy_profile.groupId
	join logins 	on logins.id = cronofy_user.groupId
	join accesskeys on accesskeys.id = cronofy_accesses.keyId
	join groups 	on groups.id = accesskeys.accountId
	join resources 	on resources.id = cronofy_calendar.resourceId

	where cronofy_calendar.deletorId = 0;




-- ---------------------------------------------------------------------------------------
--
-- Changing an agenda from 15 to 10 minutes (Originally written for SDP)
-- BINHAZ - Going from h15 to h10 and from h45 to h40 for all appointments 
--

select id, cueIn
	, cueIn - 300 as cueCorrected 
	, FROM_UNIXTIME(cueIn,'%a %b %d %H:%i:%s UTC %Y') as cueInTime
	, FROM_UNIXTIME(cueIn - 300,'%a %b %d %H:%i:%s UTC %Y') as cueInTimeCorr
from reservations where cueIn % 3600 = 900 and groupId = 2819;


update reservations set cueIn = cueIn - 300
	where cueIn % 3600 = 900 and groupId = 2819;

update reservations set cueIn = cueIn - 300
	where cueIn % 3600 = 2700 and groupId = 2819;

update reservations set cueOut = cueOut - 300
	where cueOut % 3600 = 900 and groupId = 2819;

update reservations set cueOut = cueOut - 300
	where cueOut % 3600 = 2700 and groupId = 2819;


update archive_reservations set cueIn = cueIn - 300
	where cueIn % 3600 = 900 and groupId = 2819;

update archive_reservations set cueIn = cueIn - 300
	where cueIn % 3600 = 2700 and groupId = 2819;

update archive_reservations set cueOut = cueOut - 300
	where cueOut % 3600 = 900 and groupId = 2819;

update archive_reservations set cueOut = cueOut - 300
	where cueOut % 3600 = 2700 and groupId = 2819;



-- ---------------------------------------------------------------------------------------
-- Find the portfolio owner login/pass when you only have an account number
--
select groups.id, logins.firstname, logins.lastname, logins.login, logins.password, groups.name
	from groups join accesskeys on accesskeys.accountId = groups.id join logins on accesskeys.groupId = logins.id 
	where groups.id = 3184 and logins.accessLevel >= 8;


	
	
-- ---------------------------------------------------------------------------------------
-- After you change the type of resources for a given account, re-attach the appointments to the planning (resourceType in attendees table)
--

update resources set resourceType = 2 where resources.id in (11355,11356,11357,11358,11359) and resources.groupId = 3142; -- place here what should become a bCal (first section on screen)
update resources set resourceType = 1 where resources.id in (7669,7670,11353,11354,11416,11417) and resources.groupId = 3142; -- place here what should become a uCal (second section on screen, staffable)

update attendees set resourceType = 2 where attendees.resourceId in (11355,11356,11357,11358,11359);
update attendees set resourceType = 1 where attendees.resourceId in (7669,7670,11353,11354,11416,11417);

select logins.firstname, logins.lastname, bCals, uCals, fCals from accesskeys join logins on accesskeys.groupId = logins.id where logins.groupId = 3142;

update accesskeys set bCals = '', uCals = '', fCals = '' where accountId = 3142;


update attendees set resourceType = 1 where attendees.groupId in (
	select reservations.id from reservations where reservations.groupId = 3856); -- older way, I keep it for the in() part example


	
	
-- ---------------------------------------------------------------------------------------
-- DB anomalies in Mobminder: SOLVED by (*bf01*) on September 2017
--
-- 1. Some items are created in DB with id = 0 or groupId = 0, trying to investigate how that can be !
-- 2. Reservations with no attendee (can appear nowhere on a planning screen)
-- 3. Visitor ids in reference where there is no visitor existing in visitors table
--

--
-- Checking and solving ZERO id records
--

select groups.id as accountId, groups.name as accountName, reservations.id as resaId, reservations.created, reservations.creator, reservations.changed, reservations.changer
		, reservations.note, FROM_UNIXTIME(reservations.cueIn,'%Y %a %b %d %H:%i') as cueIn, FROM_UNIXTIME(reservations.cueOut,'%H:%i') as cueOut
		, logins.firstname as sellerFName, logins.lastname as sellerLName, logins.login as sellerLogin, logins.password as sellerPass
	from reservations 
		join groups on reservations.groupId = groups.id 
		join accesskeys on accesskeys.accountId = groups.id 
		join logins on accesskeys.groupId = logins.id -- Result 1
	where reservations.id = 0 and logins.accessLevel >= 8;
	

select * from performances where groupId = 0; -- Result 2
select * from att_visitors where groupId = 0; -- Result 3
select * from attendees where groupId = 0; -- Result 4

select * from timeboxes where groupId = 0; -- Result 5
select * from timeboxings where id = 0; -- Result 6

select * from visitors where groupId = 0; -- Result 7

-- cleanup
delete from attendees where groupId = 0;
delete from att_visitors where groupId = 0;
delete from performances where groupId = 0;
delete from reservations where id = 0;
delete from timeboxes where groupId = 0;
delete from visitors where groupId = 0;


-- ---------------------------------------------------------------------------------------
-- Checking and solving DB anomalies in Mobminder: 
--
-- Reservations having no attendees
--
select * from reservations where id NOT in ( select distinct groupId from attendees) order by created desc; -- Result 8
select * from archive_reservations where id NOT in ( select distinct groupId from archive_attendees) order by created desc; -- Result 9


-- cleanup for this section

delete from reservations where id NOT in ( select distinct groupId from attendees);
delete from archive_reservations where id NOT in ( select distinct groupId from archive_attendees);


--
-- visitor references for which no visitor exist in the DB
--

select * from archive_att_visitors join archive_reservations on archive_att_visitors.groupId = archive_reservations.id -- with a reservation attached
	where resourceId NOT in (select id from visitors) order by created desc; -- Result 10
	
select * from archive_att_visitors -- orphans archive_att_visitors with no reservation attached
	where resourceId NOT in (select id from visitors) AND groupId NOT in (select id from archive_reservations) order by id asc; -- Result 11

	
select * from att_visitors join reservations on att_visitors.groupId = reservations.id
	where resourceId NOT in (select id from visitors) order by created desc; -- Result 12
	
select * from att_visitors -- orphans archive_att_visitors with no reservation attached
	where resourceId NOT in (select id from visitors) AND groupId NOT in (select id from reservations) order by id asc; -- Result 13
	

select * from chat_visirefs join chat_threads on chat_visirefs.groupId = chat_threads.id
	where visiId NOT in (select id from visitors) order by created desc; -- Result 14

select * from note_visirefs join note_details on note_visirefs.groupId = note_details.id
	where visiId NOT in (select id from visitors) order by created desc; -- Result 15

select * from task_visirefs join task_descriptions on task_visirefs.groupId = task_descriptions.id
	where visiId NOT in (select id from visitors) order by created desc; -- Result 16


-- cleanup for this section

delete from archive_att_visitors where resourceId NOT in (select id from visitors);
delete from att_visitors where resourceId NOT in (select id from visitors);
delete from chat_visirefs where visiId NOT in (select id from visitors);
delete from note_visirefs where visiId NOT in (select id from visitors);
delete from task_visirefs where visiId NOT in (select id from visitors);
	


-- ---------------------------------------------------------------------------------------
--  MAKE AN ANONYMOUS DEMO DB FOR MOB DELEGATES
--
	-- This script produce a full Shuffle of a visitors register, so it's ready to be used for demos
--
-- !!! -- DANGER -- NOT FOR USE IN PRODUCTION
--

	
	-- Shuffle lastnames and firstnames
	update visitors inner join visitors as visitilt on visitilt.id = (visitors.id-5)
	set visitors.lastname = visitilt.lastname where visitors.groupId = 4168;

	update visitors inner join visitors as visitilt on visitilt.id = (visitors.id-3)
	set visitors.firstname = visitilt.firstname, visitors.gender = visitilt.gender where visitors.groupId = 4168;


	-- Shuffle mobile numbers (they should not correspond to any valid number)

	   -- changing NSN digits
	update visitors set mobile = CONCAT(	SUBSTR(mobile,1,LENGTH(mobile)-6), 
		REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(SUBSTR(mobile,-6,6),'9','2'),'7','8'),'5','0'),'3','6'),'1','4') ) -- we keep only even digits
	where groupId = 4168;

	   -- changing CC and Operator Code
	update visitors set mobile = CONCAT(	
		REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(SUBSTR(mobile,1,4),'3249','3241'),'3248','3242'),'3247','3243'),'3246','3244'),'3245','3240')
		, SUBSTR(mobile,-(LENGTH(mobile)-4),LENGTH(mobile)-4) ) 
	where groupId = 4168;

	-- Shuffle birthdays
	update visitors inner join visitors as visitilt on visitilt.id = (visitors.id-2)
	set visitors.birthday = visitilt.birthday where visitors.groupId = 4168;





-- ---------------------------------------------------------------------------------------
-- MAKE A LIGHT DEMO DB FOR MOB DELEGATES
--
-- This script removes from DB all items older than the given date
--
-- !!! U S E    O N L Y    I N   L O C A L   D E V   E N V R I O N M E N T   !!!
--


update globals set sendComm = 0 where id = 1; 

delete from sms where sendStamp < UNIX_TIMESTAMP('2019-03-01 03:00:00');
delete from emails where sendStamp < UNIX_TIMESTAMP('2019-03-01 03:00:00');
delete from archive_connections where watchdog < UNIX_TIMESTAMP('2019-01-01 03:00:00');


delete archive_attendees from archive_attendees
	inner join archive_reservations on archive_reservations.id = archive_attendees.groupId
	where archive_reservations.cueIn < UNIX_TIMESTAMP('2019-03-01 03:00:00'); 

delete archive_att_visitors from archive_att_visitors
	inner join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
	where archive_reservations.cueIn < UNIX_TIMESTAMP('2019-03-01 03:00:00'); 

delete archive_performances from archive_performances
	inner join archive_reservations on archive_reservations.id = archive_performances.groupId
	where archive_reservations.cueIn < UNIX_TIMESTAMP('2019-03-01 03:00:00'); 

delete sms from sms
	inner join archive_reservations on archive_reservations.id = sms.reservationId
	where archive_reservations.cueIn < UNIX_TIMESTAMP('2019-03-01 03:00:00'); 

delete emails from emails
	inner join archive_reservations on archive_reservations.id = emails.reservationId
	where archive_reservations.cueIn < UNIX_TIMESTAMP('2019-03-01 03:00:00'); 

delete from archive_reservations where cueIn < UNIX_TIMESTAMP('2019-03-01 03:00:00');


delete from xmon_accounts where sunday < UNIX_TIMESTAMP('2017-06-01 03:00:00');
delete from xmon_actions where sunday < UNIX_TIMESTAMP('2017-06-01 03:00:00');
delete from xmon_actuals where sunday < UNIX_TIMESTAMP('2017-06-01 03:00:00');
delete from xmon_ccss where sunday < UNIX_TIMESTAMP('2017-06-01 03:00:00');
delete from xmon_performances where sunday < UNIX_TIMESTAMP('2017-06-01 03:00:00');
delete from xmon_sms where sunday < UNIX_TIMESTAMP('2017-06-01 03:00:00');


delete from cronofy_user;
delete from cronofy_profile;
delete from cronofy_accesses;
delete from cronofy_calendar;
delete from cronofy_inittasks;


OPTIMIZE TABLE sms, emails, archive_connections;
OPTIMIZE TABLE archive_attendees, archive_att_visitors, archive_performances, archive_reservations;
OPTIMIZE TABLE xmon_accounts, xmon_actions, xmon_actuals, xmon_ccss, xmon_performances, xmon_sms;

OPTIMIZE TABLE attendees, att_visitors, performances, reservations, resa_series, workcodes, workexperts, worktboxing, comm_toggles;
OPTIMIZE TABLE resources, groups, logins, accesskeys, connections;
OPTIMIZE TABLE exceptions, files, hourlies, shadows, details, timeboxes, timeboxings, hourliesusers, guidelines, custom_css;

OPTIMIZE TABLE chat_participants, chat_phylacteries, chat_threads, chat_visirefs;
OPTIMIZE TABLE note_addressees, note_details, note_visirefs;
OPTIMIZE TABLE task_assignees, task_descriptions, task_visirefs;

OPTIMIZE TABLE visitors, stat_lastnames, stat_genders;
OPTIMIZE TABLE synchro_ccss, synchro_reservations,  synchro_resources,  synchro_visitors;

 
-- ---------------------------------------------------------------------------------------
-- Remove visitors and appointments, clean up an account from previous usage
--

	-- ARCHIVES 
	
delete archive_attendees from archive_attendees
	inner join archive_reservations on archive_reservations.id = archive_attendees.groupId
	where archive_reservations.groupId = 3231 and archive_reservations.created > '2010-08-22 19:00:00'; 

delete archive_att_visitors from archive_att_visitors
	inner join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
	where archive_reservations.groupId = 3231 and archive_reservations.created > '2010-08-22 19:00:00'; 
	
delete archive_performances from archive_performances
	inner join archive_reservations on archive_reservations.id = archive_performances.groupId
	where archive_reservations.groupId = 3231 and archive_reservations.created > '2010-08-22 19:00:00'; 



	-- RECENT
	
delete attendees from attendees
	inner join reservations on reservations.id = attendees.groupId
	where reservations.groupId = 3231 and reservations.created > '2010-08-22 19:00:00'; 

delete att_visitors from att_visitors
	inner join reservations on reservations.id = att_visitors.groupId
	where reservations.groupId = 3231 and reservations.created > '2010-08-22 19:00:00'; 

delete comm_toggles from comm_toggles
	inner join reservations on reservations.id = comm_toggles.reservationId
	where reservations.groupId = 3231 and reservations.created > '2010-08-22 19:00:00'; 
	
delete performances from performances
	inner join reservations on reservations.id = performances.groupId
	where reservations.groupId = 3231 and reservations.created > '2010-08-22 19:00:00'; 
	


	
	-- COMMS 
	
delete sms from sms
	inner join reservations on reservations.id = sms.reservationId
	where reservations.groupId = 3231 and reservations.created > '2010-08-22 19:00:00'; 

delete emails from emails
	inner join reservations on reservations.id = emails.reservationId
	where reservations.groupId = 3231 and reservations.created > '2010-08-22 19:00:00'; 
	
	
delete sms from sms
	inner join archive_reservations on archive_reservations.id = sms.reservationId
	where archive_reservations.groupId = 3231 and archive_reservations.created > '2010-08-22 19:00:00'; 

delete emails from emails
	inner join archive_reservations on archive_reservations.id = emails.reservationId
	where archive_reservations.groupId = 3231 and archive_reservations.created > '2010-08-22 19:00:00'; 
	

	
	-- MAIN
delete from archive_reservations where archive_reservations.groupId = 3231 and created > '2010-08-22 19:00:00';
delete from reservations where reservations.groupId = 3231 and created > '2010-08-22 19:00:00';
delete from resa_series where resa_series.groupId = 3231 and created > '2010-08-22 19:00:00';


	-- also remove visitors ? 
delete from visitors where visitors.groupId = 3231;




 
-- ---------------------------------------------------------------------------------------
-- Remove mobile numbers from visitors register (to make a demo DB)
--


update visitors set mobile = '' where visitors.groupId in (3254,3252,3015,3139,3123,3253);


									
									
-- ---------------------------------------------------------------------------------------
-- Just after a huge .ics import, 
-- if you try to get an ical sync using e.g. http://be.mobminder.com/ical.php?g=3963&l=12028&r=11954
-- You get a 500 error because the export is huge and the script fails.
--
-- >>> This spoofy force archiving the old items so your ical export works fine.
--
	
	
select count(1) from reservations where reservations.cueIn > UNIX_TIMESTAMP('2017-01-01 03:00:00') and reservations.groupId = 3963; 

UPDATE reservations JOIN attendees ON reservations.id = attendees.groupId SET attendees.archived = 2, reservations.archived = 2 
	WHERE cueOut < UNIX_TIMESTAMP('2017-06-01 03:00:00') AND reservations.id > 0 and reservations.groupId = 3963;
UPDATE att_visitors JOIN reservations ON reservations.id = att_visitors.groupId SET att_visitors.archived = 2 WHERE reservations.archived = 2;

INSERT INTO archive_reservations 	SELECT * FROM reservations 	WHERE reservations.archived = 2;
INSERT INTO archive_attendees 		SELECT * FROM attendees 	WHERE attendees.archived = 2;
INSERT INTO archive_att_visitors 	SELECT * FROM att_visitors 	WHERE att_visitors.archived = 2;


DELETE FROM reservations WHERE archived = 2;
DELETE FROM attendees 	WHERE archived = 2;
DELETE FROM att_visitors WHERE archived = 2;

UPDATE archive_reservations SET archived = 1 WHERE archived =2;
UPDATE archive_attendees SET archived = 1 	WHERE archived =2;
UPDATE archive_att_visitors SET archived = 1 WHERE archived =2;

select count(1) from reservations where reservations.cueIn > UNIX_TIMESTAMP('2017-01-01 03:00:00') and reservations.groupId = 3963; 

	
									
-- ---------------------------------------------------------------------------------------
-- remove all visitors from an account that have never been appointed (taking into accoutn the archive appointments)
--


select count(1) from visitors where groupId = 3999;

delete from visitors where groupId = 3999 and visitors.id not in (
select distinct id from 
 (select distinct archive_att_visitors.resourceId as id from archive_att_visitors 
	join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
	join archive_attendees on archive_reservations.id = archive_attendees.groupId
	where archive_reservations.groupId = 3999 and archive_attendees.resourceId = 12080
UNION 
  select distinct att_visitors.resourceId as id from att_visitors 
	join reservations on reservations.id = att_visitors.groupId
	join attendees on reservations.id = attendees.groupId
	where reservations.groupId = 3999 and attendees.resourceId = 12080) ALIAS
);

select count(1) from visitors where groupId = 3999;




-- ---------------------------------------------------------------------------------------
-- Demand from DE FRE: sort mobile from phones, clean them up, and put them in the right "mobile" field
-- 3484 is the accountId


-- turn phone being like 0497112233 into 0497112233
update visitors set mobile = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-",""), phone = ""
where groupId = 3484 and phone LIKE "0%" and CHAR_LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","")) = 10;

-- visualize phones being like 497112233 into 32497112233
select REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","") as cleanphone, mobile, id from visitors
where groupId = 3484 and phone LIKE "4%" and CHAR_LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","")) = 9;

-- turn phone being like 497112233 into 32497112233
update visitors set mobile = CONCAT("32",REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","")), phone = ""
where groupId = 3484 and phone LIKE "4%" and CHAR_LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","")) = 9;

-- fix 0497 into 32
update visitors set mobile = CONCAT("32",RIGHT(mobile,9)) where groupId = 3484 and mobile LIKE "04%";

-- fix phones special chars
update visitors set phone = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-",""),"?",""),"(",""),")","");
where groupId = 3484 and phone <> "";

-- add heading trunk to phone number missing their trunk
update visitors set phone = CONCAT("0",REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","")), phone = ""
where groupId = 3484 and (phone LIKE "1%" OR phone LIKE "2%" OR phone LIKE "3%" OR phone LIKE "5%" OR phone LIKE "6%" OR phone LIKE "7%" OR phone LIKE "8%") 
and CHAR_LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone," ",""),"/",""),",",""),".",""),"-","")) = 8;

-- remove non-numeric chars



select * from visitors where groupId = 3484 and mobile <> "" order by mobile asc;










	