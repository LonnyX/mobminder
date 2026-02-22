


-- ---------------------------------------------------------------------------------------
-- Full export of agendas including archive (Fast on SQL 5.7)
--

select -- rescid, workCodeId, resaId, vid,
	  resources.name as rescourcename, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i'), FROM_UNIXTIME(cueOut,'%Y-%m-%d %H:%i'), resanote
	, workcodes.name as performance
	, lastname, firstname, email, mobile -- , address, city, zipCode, country, language, birthday  
	
from (

	select workCodeId, archive_att_visitors.resourceId as vid, archive_att_visitors.groupId as resaId, archive_attendees.resourceId as rescid
		, cueIn, cueOut, archive_reservations.note as resanote
		
	from archive_att_visitors 
	join archive_performances on archive_performances.groupId = archive_att_visitors.groupId
	join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
	join archive_attendees on archive_attendees.groupId = archive_att_visitors.groupId
	where archive_attendees.resourceId in (6838,6566,6358,6357,6735,9930,7002,6971,6839,6352,14027)

		UNION

	select workCodeId, att_visitors.resourceId as vid, att_visitors.groupId as resaId, attendees.resourceId as rescid
		, cueIn, cueOut, reservations.note as resanote
		
	from att_visitors
	join performances on performances.groupId = att_visitors.groupId
	join reservations on reservations.id = att_visitors.groupId
	join attendees on attendees.groupId = att_visitors.groupId
	where attendees.resourceId in (6838,6566,6358,6357,6735,9930,7002,6971,6839,6352,14027)
			
) as vids 

join visitors on visitors.id = vid
join workcodes on workcodes.id = workCodeId
join resources on resources.id = rescid
where visitors.deleted = 0
order by cueIn asc;   -- this join is fast because it relies on id, which is a table key






-- ---------------------------------------------------------------------------------------
-- Extract all logins info for Mobminder communication (exclude some wallets)
--

select logins.id, logins.lastname, logins.firstname, logins.email, logins.mobile, logins.profession
			, accounts.name as account, accounts.visitorAlias as alias
			, sellerlname, sellerfname
from logins join (

select distinct alogins.id as userloginid, accesskeys.accountId as accountId
						, logins.id as sellerlogid, logins.lastname as sellerlname, logins.firstname as sellerfname  -- we select all logins from accounts beloging to a given set of sller wallets
			from accesskeys -- seller key
	join logins on accesskeys.groupId = logins.id -- seller login
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id -- account user key
		
	where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
		and logins.id not in (-- exclude some wallets
				7874, -- Sandbox Oxteo Bernard Spoden
				-- 7896, -- Axel Boven 
				7922, -- Dietplus (Olivier Gay)
				8330, -- Keevin Burogest
				8384, -- Maxime D'Hoogh pages d'or
				8840, -- Sandbox Offimed Medinect
				8409, -- Florence Clearebault
				8797,
				-- 8818, -- Jonathan Vandenberg CCM Online
				-- 8914, -- portefeuille Philippe Orban Octopus
				8925, -- Sandbox e-Dent
				9087, -- Mob Recycling
				9089, -- sandbox ATX DentAdmin
				9085, -- Play Off portefeuille idle
				9361, -- versusmind sandbox
				9482, -- Olivier Gay
				10444, 11808, 11809, 11707, 12079, -- h4d
				14551 -- Jean Claude Spelte - Caretel France
				) 
) as candidates on candidates.userloginid = logins.id
left join groups as accounts on accounts.id = candidates.accountId
	where ( logins.mobile <> "" or logins.email <> "" )
		and logins.email NOT like "%@burogest.be" 
		and logins.email NOT like "%@caretel.be"  
		and logins.email NOT like "%@thomas-piron.eu" 
		and logins.email NOT like "%@medecinsdumonde.be" 
		and logins.email NOT like "%@esecretariat.be" 
		and logins.email NOT like "i-secretariat@%"
		and logins.email NOT like "%@laramee.be"
		and logins.email NOT like "pierrehalut@gmail.com"
		and logins.email NOT like "%@toubipbip.be"
	and logins.profession not in(	801, -- assistant
																803, -- secretary
																806, -- technician
																814 -- salesperson
															) -- see C_iPRO for professions codes list

order by logins.lastname asc



-- ---------------------------------------------------------------------------------------
-- Extract all visitors info for a given account
--

select visitors.id
	, CONVERT(CAST(company as BINARY) USING utf8) as company, gender
	, birthday
	, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
	, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname
	, CONVERT(CAST(custom_css.name as BINARY) USING utf8) as color
	, mobile, phone
	, CONVERT(CAST(address as BINARY) USING utf8) as address
	, CONVERT(CAST(city as BINARY) USING utf8) as city
	, CONVERT(CAST(country as BINARY) USING utf8) as country
	, zipCode, language, email	
			from visitors 
				left join custom_css on custom_css.id = visitors.cssColor 
			where visitors.groupId = 2785 -- Esth Tremoille 
			and visitors.created > "2018-09-01";
			-- where visitors.groupId = 3235 -- JP Deleuze
	order by lastname asc;

	
select visitors.id
	, company, gender, birthday, lastname, firstname, custom_css.name as color, mobile, phone
	, address, city, country, zipCode, language, email	
			from visitors 
				left join custom_css on custom_css.id = visitors.cssColor 
			where visitors.groupId = 4095 -- Esth Tremoille 
			and visitors.created > "2010-04-01"
	order by lastname asc;
	
	
	
	
-- extract all visitors who have ever appointed, indicating the last appointment date
	
select vid, company, gender, birthday, lastname, firstname, custom_css.name as color, mobile, phone
	, address, city, country, zipCode, language, email,
	FROM_UNIXTIME(max(reservations.cueIn),'%Y-%m-%d %H:%i') as lcue 
from -- here we unite archive and current tables joining them straight on att_visitors
	(select reservations.id as id, reservations.groupId, cueIn, resourceId as vid from reservations 
		join att_visitors on att_visitors.groupId = reservations.id where reservations.groupId = 2785 
	UNION select archive_reservations.id as id, archive_reservations.groupId, cueIn, resourceId as vid from archive_reservations 
		join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id where archive_reservations.groupId = 2785
	) as reservations
	join visitors on visitors.id = vid
		left join custom_css on custom_css.id = visitors.cssColor
	where reservations.id > 0
	group by vid order by lcue asc;
	


-- extract visitors who have appointed with a given resource

select visitors.id, company, gender, birthday, lastname, firstname, custom_css.name as color, mobile, phone
	, address, city, country, zipCode, language, email
from visitors 
left join custom_css on custom_css.id = visitors.cssColor
where visitors.id in 
(select distinct vid from (
		select att_visitors.resourceId as vid from attendees 
			join att_visitors on att_visitors.groupId = attendees.groupId
			where attendees.resourceId = 13322
		union
		select archive_att_visitors.resourceId as vid from archive_attendees
			join archive_att_visitors on archive_att_visitors.groupId = archive_attendees.groupId
			where archive_attendees.resourceId = 13322) 
	as visiatts );
	
	

-- ---------------------------------------------------------------------------------------
--
-- Export all mobminder logins from medical sector (excluding dentists and excluding wallets outside Belgium) 
-- 
--

select accesskeys.groupId as sellerId, CONVERT(CAST(logins.lastname as BINARY) USING utf8) as sellername
			, CONVERT(CAST(logins.firstname as BINARY) USING utf8) as sellerfname, logins.login, logins.password, 
			CONVERT(CAST(accounts.name as BINARY) USING utf8) as accountname, accounts.creator, 
			CONVERT(CAST(alogins.lastname as BINARY) USING utf8), CONVERT(CAST(alogins.firstname as BINARY) USING utf8)
			, alogins.mobile, alogins.email, alogins.profession, alogins.created
	from accesskeys 
	join logins on accesskeys.groupId = logins.id -- seller login
	join groups as accounts on accesskeys.accountId = accounts.id 
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id
		
	where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
			and alogins.profession > 200 and alogins.profession < 300 -- see C_iPRO for professions codes list
		and accesskeys.groupId not in (9089,7896,9086,8330,9085,9859,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511) -- exclude some resellers
		and alogins.email <> ''
	order by logins.lastname, logins.firstname, accounts.name asc;
	
	


-- ---------------------------------------------------------------------------------------
--
-- Export all mobminder logins sorted by reseller
-- 
--

select accesskeys.groupId as sellerId, CONVERT(CAST(logins.lastname as BINARY) USING utf8) as sellername
			, CONVERT(CAST(logins.firstname as BINARY) USING utf8) as sellerfname, logins.login, logins.password, 
			CONVERT(CAST(accounts.name as BINARY) USING utf8) as accountname, accounts.creator, 
			CONVERT(CAST(alogins.lastname as BINARY) USING utf8), CONVERT(CAST(alogins.firstname as BINARY) USING utf8)
			, alogins.mobile, alogins.email, alogins.profession, alogins.created
	from accesskeys 
	join logins on accesskeys.groupId = logins.id -- seller login
	join groups as accounts on accesskeys.accountId = accounts.id 
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id
		
	where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
			and alogins.profession not in(801,803,806,814) -- see C_iPRO for professions codes list
		and accesskeys.groupId not in (9089,8820,7896,9086,8350,8330,9085,9859,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7886,7874,8818,9511) -- exclude some resellers
		and alogins.email <> ''
	order by logins.lastname, logins.firstname, accounts.name asc;
	

select * from logins where id in(9089,8820,7896,9086,8350,8330,9085,9859,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7886,7874,8818,9511);


-- ---------------------------------------------------------------------------------------
--
-- Export emails eligible for Xmas SMS mailing campaign
-- 
--		

select DISTINCT email, profession, gender, firstname, lastname, language, account, alias, sellerfname, sellerlname from (

select accesskeys.groupId as sellerId, logins.lastname as sellerlname
			, logins.firstname as sellerfname, logins.login, logins.password 
			, accounts.name as account, accounts.creator , accounts.visitorAlias as alias 
			, alogins.id as loginId, alogins.language as language
			, alogins.profession, alogins.gender, alogins.lastname as lastname, alogins.firstname as firstname
			, alogins.mobile, alogins.email, alogins.created
	from accesskeys 
	join logins on accesskeys.groupId = logins.id -- seller login
	join groups as accounts on accesskeys.accountId = accounts.id 
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id
		
	where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
			and alogins.profession not in(801,803,806,814) -- see C_iPRO for professions codes list
		and accesskeys.groupId not in (8797,9087,9089,7896,9086,8330,9085,9859,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511) -- exclude some resellers
		and alogins.email <> ""
		and alogins.email NOT like "%@burogest.be" 
		and alogins.email NOT like "%@caretel.be"  
		and alogins.email NOT like "%@thomas-piron.eu" 
		and alogins.email NOT like "%@medecinsdumonde.be" 
		and alogins.email NOT like "%@esecretariat.be" 
		and alogins.email NOT like "i-secretariat@%"
		and alogins.email NOT like "%@laramee.be"
	order by logins.lastname, logins.firstname, accounts.name asc) ALIAS 

order by email asc;





-- ---------------------------------------------------------------------------------------
-- Demand from FOND ROY: Multi agenda - extract patients that have appointed with a given Doctor
-- 2917 is the accountId
-- 11086 is the resourceId

select gender, lastname, firstname, mobile, address, city, zipCode, country, email from visitors 
	where visitors.groupId = 2917 and visitors.id IN (
		select distinct resourceId from (
			select att_visitors.resourceId from att_visitors 
			join reservations on reservations.id = att_visitors.groupId 
			join attendees on reservations.id = attendees.groupId 
				where reservations.groupId = 2917 and attendees.resourceId = 11086
		UNION 
			select archive_att_visitors.resourceId from archive_att_visitors 
			join archive_reservations on archive_reservations.id = archive_att_visitors.groupId 
			join archive_attendees on archive_reservations.id = archive_attendees.groupId 
				where archive_reservations.groupId = 2917 and archive_attendees.resourceId = 11086
		) ALIAS
) order by lastname ASC;


-- dentimex
select birthday, gender, lastname, firstname, mobile, phone, email from visitors where visitors.groupId = 2840 and visitors.id IN (
	select distinct resourceId from (
		select att_visitors.resourceId from att_visitors join reservations on reservations.id = att_visitors.groupId join attendees on reservations.id = attendees.groupId where reservations.groupId = 2840 and attendees.resourceId = 7386
			UNION 
		select archive_att_visitors.resourceId from archive_att_visitors join archive_reservations on archive_reservations.id = archive_att_visitors.groupId join archive_attendees on archive_reservations.id = archive_attendees.groupId where archive_reservations.groupId = 2840 and archive_attendees.resourceId = 7386
	) ALIAS
)




-- same but based on a time frame (Annual demand from DETROUX)

select lastname, firstname, mobile from visitors where visitors.groupId = 2990 and visitors.id IN (
	select distinct resourceId from (
		select att_visitors.resourceId from att_visitors join reservations on reservations.id = att_visitors.groupId join attendees on reservations.id = attendees.groupId 
		where reservations.groupId = 2990 and attendees.resourceId = 7189 and cueIn > UNIX_TIMESTAMP('2015-01-01 03:00:00') and cueOut < UNIX_TIMESTAMP('2015-12-31 23:00:00')
			UNION 
		select archive_att_visitors.resourceId from archive_att_visitors join archive_reservations on archive_reservations.id = archive_att_visitors.groupId join archive_attendees on archive_reservations.id = archive_attendees.groupId 
		where archive_reservations.groupId = 2990 and archive_attendees.resourceId = 7189 and cueIn > UNIX_TIMESTAMP('2015-01-01 03:00:00') and cueOut < UNIX_TIMESTAMP('2015-12-31 23:00:00')
	) ALIAS
)




-- ---------------------------------------------------------------------------------------
--  FULL CALENDAR EXPORT
--  Export of All appointments  - export works well in .xls mode (xlsx and csv give bad results) 
--

(select reservations.id as rid, reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i') as timein
		, FROM_UNIXTIME(cueOut,'%Y-%m-%d %H:%i') as timeout
		, visitors.id as visitorId, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile
		, CONVERT(CAST(reservations.note as BINARY) USING utf8) as appointmentnote
		, resources.id as resourceid
		, CONVERT(CAST(resources.name as BINARY) USING utf8) as resourcename
		, workcodes.name as performance
		, reservations.deleted 

		from reservations

			join attendees on attendees.groupId = reservations.id
			join resources on resources.id = attendees.resourceId 

			left join visitors 
				inner join att_visitors on visitors.id = att_visitors.resourceId
			on att_visitors.groupId = reservations.id

			left join workcodes 
				inner join performances on workcodes.id = performances.workCodeId 
			on performances.groupId = reservations.id

	where reservations.groupId = 3235)
UNION
(select archive_reservations.id as rid, archive_reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i') as timein
		, FROM_UNIXTIME(cueOut,'%Y-%m-%d %H:%i') as timeout
		, visitors.id as visitorId, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile
		, CONVERT(CAST(archive_reservations.note as BINARY) USING utf8) as appointmentnote
		, resources.id as resourceid
		, CONVERT(CAST(resources.name as BINARY) USING utf8) as resourcename
		, workcodes.name as performance
		, archive_reservations.deleted

		from archive_reservations

			join archive_attendees on archive_attendees.groupId = archive_reservations.id
			join resources on resources.id = archive_attendees.resourceId
			
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join visitors on visitors.id = archive_att_visitors.resourceId
			
			join archive_performances on archive_performances.groupId = archive_reservations.id
			join workcodes on workcodes.id = archive_performances.workCodeId
			

	where archive_reservations.groupId = 3235)
order by cueIn DESC LIMIT 35000;




-- ---------------------------------------------------------------------------------------
-- Extract 1500 latest distinct appointing visitors
--

--  !! with undeleted reservations, and distinct mobile numbers, and a limit number of items returned

select distinct id, mobile, lastname, firstname from (
	(select reservations.id as rid, reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile, visitors.id as id
		, CONVERT(CAST(reservations.note as BINARY) USING utf8) as appointmentnote
		, CONVERT(CAST(visitors.note as BINARY) USING utf8) as visitornote

		from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join visitors on visitors.id = att_visitors.resourceId

	where reservations.groupId = 3441 and mobile <> "" and reservations.deletorId = 0)
	UNION
	(select archive_reservations.id as rid, archive_reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile, visitors.id as id
		, CONVERT(CAST(archive_reservations.note as BINARY) USING utf8) as appointmentnote
		, CONVERT(CAST(visitors.note as BINARY) USING utf8) as visitornote

		from archive_reservations
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join visitors on visitors.id = archive_att_visitors.resourceId

	where archive_reservations.groupId = 3441 and mobile <> "" and archive_reservations.deletorId = 0) order by cueIn DESC 
) ALIAS LIMIT 1500;


-- ---------------------------------------------------------------------------------------
-- Extract distinct appointing visitors from a given date
--

select distinct id, mobile, lastname, firstname from (
	(select reservations.id as rid, reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile, visitors.id as id
		, CONVERT(CAST(reservations.note as BINARY) USING utf8) as appointmentnote
		, CONVERT(CAST(visitors.note as BINARY) USING utf8) as visitornote

		from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join visitors on visitors.id = att_visitors.resourceId

	where reservations.groupId = 2834 and mobile <> "" 
		and reservations.deletorId = 0 
		and cueIn > UNIX_TIMESTAMP("2016-01-01") 
		) order by cueIn DESC 
	UNION
	(select archive_reservations.id as rid, archive_reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile, visitors.id as id
		, CONVERT(CAST(archive_reservations.note as BINARY) USING utf8) as appointmentnote
		, CONVERT(CAST(visitors.note as BINARY) USING utf8) as visitornote

		from archive_reservations
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join visitors on visitors.id = archive_att_visitors.resourceId

	where archive_reservations.groupId = 2834 and mobile <> "" 
		and archive_reservations.deletorId = 0
		and cueIn > UNIX_TIMESTAMP("2016-01-01") 
	) order by cueIn DESC 
) ALIAS LIMIT 1500;



-- ---------------------------------------------------------------------------------------
-- Extract dentists only
--

select gender	, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname
				, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname,
				CONVERT(CAST(company as BINARY) USING utf8) as company, email, mobile, phone 
 from logins where profession in (102,101,103,104);


 
 
-- ---------------------------------------------------------------------------------------
-- Select people who have appointed in the last 3 years
--
select gender	, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname
				, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname, email, mobile, phone 
	from visitors where groupId = 3102 and created > "2016-09-20" order by email DESC;


	
select visitors.id, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile 
	from visitors where visitors.groupId = 3592 and visitors.mobile <> "" and visitors.id IN (
	select distinct resourceId from (
		select att_visitors.resourceId from att_visitors join reservations on reservations.id = att_visitors.groupId join attendees on reservations.id = attendees.groupId 
		where reservations.groupId = 3592 and cueIn > UNIX_TIMESTAMP('2017-01-01 03:00:00') and cueOut < UNIX_TIMESTAMP('2019-12-31 23:00:00')
			UNION 
		select archive_att_visitors.resourceId from archive_att_visitors join archive_reservations on archive_reservations.id = archive_att_visitors.groupId join archive_attendees on archive_reservations.id = archive_attendees.groupId 
		where archive_reservations.groupId = 3592 and cueIn > UNIX_TIMESTAMP('2017-01-01 03:00:00') and cueOut < UNIX_TIMESTAMP('2019-12-31 23:00:00')
	) ALIAS
) ORDER BY lastname asc;






	
	
	
	