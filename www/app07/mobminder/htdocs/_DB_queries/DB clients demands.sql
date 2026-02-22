



-- H4D -- créer des prestations qui n'ont pas de contingence. Parfois ils cliquent sans le faire en expres sur les resources de contingence. 
-- dans ce cas pour résoudre le soucis, je sélectionne les resources de type 1 attachées à la prestation problématique, 
-- Ensuite un delete sur bas du(des) workexperts qui sont concernés. 
-- PVH 2021

select * from workcodes where id in (9028,12813,13710);
select * from workexperts 
	join resources on resources.id = workexperts.resourceId
	where workexperts.groupId in (9028,12813,13710) and resources.resourceType = 1;
	
delete from workexperts where id = 461553;



-- CMA - query on patients fidelity ( accountid, resourceid, min appcount, from date)
--

select appcount, vid, lastname from (
		select count(1) as appcount, resourceId as vid from 
			( select att_visitors.id, att_visitors.resourceId from att_visitors
				join visitors on visitors.id = resourceId
				join reservations on reservations.id = att_visitors.groupId
				join attendees on attendees.groupId = att_visitors.groupId
				where visitors.groupId = 3279 and attendees.resourceId in (9423) and reservations.deletorId = 0
			UNION
				select archive_att_visitors.id, archive_att_visitors.resourceId from archive_att_visitors
				join visitors on visitors.id = resourceId
				join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
				join archive_attendees on archive_attendees.groupId = archive_att_visitors.groupId
				where visitors.groupId = 3279 and archive_reservations.cueIn > UNIX_TIMESTAMP("2018")
					and archive_attendees.resourceId in (9423) and archive_reservations.deletorId = 0
			) as att_visi_list
		group by vid order by appcount desc
	) as global_counting
join visitors on visitors.id = global_counting.vid
where appcount > 3;



--- More account stats (originaly for Jean-Claude Mangi Paris)


			-- count returning patients recurrence

			select count(1) as patients_count, appcount from (
					select count(1) as appcount, resourceId as vid from 
						( select att_visitors.id, att_visitors.resourceId from att_visitors
							join visitors on visitors.id = resourceId
							join reservations on reservations.id = att_visitors.groupId
							join attendees on attendees.groupId = att_visitors.groupId
							where visitors.groupId = 3233 and reservations.deletorId = 0 -- and attendees.resourceId in (9423)
						UNION
							select archive_att_visitors.id, archive_att_visitors.resourceId from archive_att_visitors
							join visitors on visitors.id = resourceId
							join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
							join archive_attendees on archive_attendees.groupId = archive_att_visitors.groupId
							where visitors.groupId = 3233 and archive_reservations.cueIn > UNIX_TIMESTAMP("2018-01-01")
								and archive_reservations.deletorId = 0 -- and archive_attendees.resourceId in (9423)
						) as att_visi_list
					group by vid order by appcount desc
				) as global_counting
			join visitors on visitors.id = global_counting.vid
			where appcount >= 1 group by appcount desc;



			-- yearly new patients creation

			select count(1) as patients_count, SUBSTR(created, 1, 4) as yearly from visitors where groupId = 3233 group by yearly;



			-- count performances

			select appcount, perf_id, name, (duration*15) as duration from (

					select count(1) as appcount, workCodeId as perf_id from 
					
						( select att_visitors.id, workCodeId from att_visitors
							join visitors on visitors.id = resourceId
							join reservations on reservations.id = att_visitors.groupId
							join performances on performances.groupId = att_visitors.groupId
							where visitors.groupId = 3233 and reservations.deletorId = 0 -- and attendees.resourceId in (9423)
						UNION
							select archive_att_visitors.id, workCodeId from archive_att_visitors
							join visitors on visitors.id = resourceId
							join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
							join archive_performances on archive_performances.groupId = archive_att_visitors.groupId
							where visitors.groupId = 3233 and archive_reservations.cueIn > UNIX_TIMESTAMP("2018-01-01")
								and archive_reservations.deletorId = 0 -- and archive_attendees.resourceId in (9423)
						) as att_visi_list
						
					group by workCodeId order by appcount desc
					
				) as global_counting
			join workcodes on workcodes.id = global_counting.perf_id
			where appcount >= 1 group by perf_id order by appcount desc;




			-- count by resources

			select rescid, name, year, appcount from (
					select count(1) as appcount, rescid, year from 
						( select visitors.id as vid, SUBSTR(FROM_UNIXTIME(reservations.cueIn),1,4) as year, attendees.resourceId as rescid from att_visitors
							join visitors on visitors.id = resourceId
							join reservations on reservations.id = att_visitors.groupId
							join attendees on attendees.groupId = att_visitors.groupId
							where visitors.groupId = 3233 and reservations.deletorId = 0 -- and attendees.resourceId in (9423)
						UNION
							select visitors.id as vid, SUBSTR(FROM_UNIXTIME(archive_reservations.cueIn),1,4) as year, archive_attendees.resourceId as rescid from archive_att_visitors
							join visitors on visitors.id = resourceId
							join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
							join archive_attendees on archive_attendees.groupId = archive_att_visitors.groupId
							where visitors.groupId = 3233 and archive_reservations.cueIn > UNIX_TIMESTAMP("2016-01-01")
								and archive_reservations.deletorId = 0 -- and archive_attendees.resourceId in (9423)
						) as att_visi_list
					group by year, rescid order by appcount desc
				) as global_counting
			join resources on resources.id = global_counting.rescid
			where appcount >= 1 order by year, appcount desc;












-- Demande from Moovia
-- list all patients that have ever taken appointment in an agenda of the account

select distinct id from visitors where groupId = 4160; -- all account visitors

select gender, birthday, lastname, firstname, colors.name as color, patterns.name as status, mobile, phone, address, city, country, zipCode, language, email from visitors
left join custom_css as colors on colors.id = visitors.cssColor
left join custom_css as patterns on patterns.id = visitors.cssPattern
where visitors.mobile <> 0 and visitors.id in
	( select distinct id from visitors 
	where groupId = 4160
	and id in ( select distinct vid from (
			select archive_att_visitors.resourceId as vid from archive_reservations
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join archive_attendees 		on archive_attendees.groupId = archive_reservations.id
			where archive_reservations.groupId = 4160 -- list of visitor who ever appointed in Mobminder
		union
			select att_visitors.resourceId as vid from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join attendees 		on attendees.groupId = reservations.id
			where reservations.groupId = 4160 -- list of visitor who ever appointed in Mobminder
		) as vidsEver )

) order by lastname asc;





-- Demande from Dentiste Dumont
-- list all patients that are not seen from start of 2020
-- I made versus all patients that ever appointed in the Mobminder

select gender, birthday, lastname, firstname, colors.name as color, patterns.name as status, mobile, phone, address, city, country, zipCode, language, email from visitors
left join custom_css as colors on colors.id = visitors.cssColor
left join custom_css as patterns on patterns.id = visitors.cssPattern
where visitors.id in
	( select distinct id from visitors 
	where groupId = 2836
	and id in ( select distinct vid from (
			select archive_att_visitors.resourceId as vid from archive_reservations
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join archive_attendees 		on archive_attendees.groupId = archive_reservations.id
			where archive_reservations.groupId = 2836 and archive_attendees.resourceId in (6807) -- list of visitor who ever appointed in Mobminder
				and archive_reservations.cueIn > UNIX_TIMESTAMP("2019-01-01") -- list of visitor ids who appointed in 2020
		union
			select att_visitors.resourceId as vid from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join attendees 		on attendees.groupId = reservations.id
			where reservations.groupId = 2836 and attendees.resourceId in (6807) -- list of visitor who ever appointed in Mobminder
				and reservations.cueIn > UNIX_TIMESTAMP("2019-01-01") -- list of visitor ids who appointed in 2020
		) as vidsEver )
	and id not in ( select distinct vid from ( -- exclude visitors who have appointed in 2020
			select archive_reservations.cueIn as cueIn, archive_att_visitors.resourceId as vid from archive_reservations
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join archive_attendees 		on archive_attendees.groupId = archive_reservations.id
			where archive_reservations.groupId = 2836 and archive_attendees.resourceId in (6807)
				and archive_reservations.cueIn > UNIX_TIMESTAMP("2020-01-01") -- list of visitor ids who appointed in 2020
		union
			select reservations.cueIn as cueIn, att_visitors.resourceId as vid from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join attendees 		on attendees.groupId = reservations.id
			where reservations.groupId = 2836 and attendees.resourceId in (6807) -- list of visitor who ever appointed in Mobminder
				and reservations.cueIn > UNIX_TIMESTAMP("2020-01-01") -- list of visitor ids who appointed in 2020		

		) as vids2020 )
) order by lastname asc;




-- Copy /insert a selection of visitors from one account onto another account (4145 in this example)
-- The selection of visitors are the ones that have appointed ever with resources (13922,13920,13918,13921,13929)
-- Keeps the original id in to (mergedTo) / so can be temporarily used ADAPT !

INSERT INTO visitors 
			(groupId, created	, creator		, creatorId	, mergedTo	, prefAMPM, prefNotBefore,gender	,lastname, firstname, birthday, mobile, phone, note, email, address, zipCode, city, country, reference, registration, language) 
SELECT 3130		, NOW()		, 'visiload', 99999999	, id				, 8355584	, 	200		,	gender	,lastname	,firstname, birthday, mobile, phone, note, email, address, zipCode, city, country, reference, registration, language
FROM visitors 
WHERE visitors.id IN (select distinct vid from (

	select distinct archive_att_visitors.resourceId as vid from archive_att_visitors where archive_att_visitors.groupId in 
	(select resaid from 
			(select archive_attendees.groupId as resaid, archive_attendees.resourceId  as rescid from archive_attendees where archive_attendees.resourceId in (13922,13920,13918,13921,13929)) as arch_resas )
UNION
	select distinct att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
	(select resaid from 
			(select attendees.groupId as resaid, attendees.resourceId  as rescid from attendees where attendees.resourceId in (13922,13920,13918,13921,13929)) as cur_resas ) 
		
) as vids );



-- How to extract visitors who have appointed in the last 12 months -- 3441 = Welleness La Réserve

select vid, lastname, firstname, email, mobile, address, city, zipCode, country, language, birthday  from (

	select distinct archive_att_visitors.resourceId as vid from archive_att_visitors where archive_att_visitors.groupId in 
	(select resaid from 
			(select id as resaid from archive_reservations  where groupId = 3441 and cueIn > UNIX_TIMESTAMP("2019-06-01")) as resas )

UNION

	select distinct att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
	(select resaid from 
			(select id as resaid from reservations  where groupId = 3441 and cueIn > UNIX_TIMESTAMP("2019-06-01")) as resas )
		
) as vids 
join visitors on visitors.id = vid
where visitors.deleted = 0
order by lastname asc;




-- - extract patients that have got workcode COOLSCULTPING -- account id 2838


-- this query is pretty quick regarding it fetches from archive tables

select distinct vid, lastname, firstname, email, mobile, address, city, zipCode, country, language, birthday  from (

	select archive_att_visitors.resourceId as vid from archive_att_visitors where archive_att_visitors.groupId in 
	(select rid from 
			(select archive_performances.groupId as rid, workcodeId from archive_performances where archive_performances.groupId > 1719464 and workcodeId = 3922) as perfs )

UNION

	select att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
	(select rid from 
			(select performances.groupId as rid, workcodeId from performances where workcodeId = 3922) as perfs ) -- 3922 is Espace Braffort account id
		
) as vids 
join visitors on visitors.id = vid  -- this join is fast because it relies on id, which is a table key
	where visitors.cssColor <> 1192; -- 1192 is black list color at Espace Braffort




-- How to extract visitors who have appointed in a given account with a given resource

select vid, lastname, firstname, email, mobile, address, city, zipCode, country, language, birthday  from (

	select distinct archive_att_visitors.resourceId as vid from archive_att_visitors where archive_att_visitors.groupId in 
	(select resaid from 
			(select archive_attendees.groupId as resaid, archive_attendees.resourceId  as rescid from archive_attendees where archive_attendees.resourceId = 14769) as perfs )

UNION

	select distinct att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
	(select resaid from 
			(select attendees.groupId as resaid, attendees.resourceId  as rescid from attendees where attendees.resourceId = 14769) as perfs ) 
		
) as vids 
join visitors on visitors.id = vid
where visitors.deleted = 0
order by lastname asc;   -- this join is fast because it relies on id, which is a table key







-- ---------------------------------------------------------------------------------------
-- 
-- Find an appointment back based on its reservation id
-- 
--


select reservations.id as rid, reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, resources.name as agenda
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, visitors.id as patientid
		, CONVERT(CAST(reservations.note as BINARY) USING utf8) as appointmentnote
		, reservations.created, reservations.changed, reservations.deleted

		from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join visitors on visitors.id = att_visitors.resourceId
			join attendees on attendees.groupId = reservations.id
			join resources on attendees.resourceId = resources.id

	where reservations.id = 11407311 order by agenda DESC;
	
	



-- ---------------------------------------------------------------------------------------
-- 
-- Only visitors having appointed for a given Dr in the last 12 months
-- 
--
select distinct id, mobile, gender, lastname, firstname, email from (
	(select reservations.id as rid, reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile, visitors.id as id
		, CONVERT(CAST(reservations.note as BINARY) USING utf8) as appointmentnote
		, CONVERT(CAST(visitors.note as BINARY) USING utf8) as visitornote
		, email

		from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join visitors on visitors.id = att_visitors.resourceId
			join attendees on reservations.id = attendees.groupId 

	where reservations.groupId = 2785
		and reservations.deletorId = 0 
		and cueIn > UNIX_TIMESTAMP("2018-08-19")
		and attendees.resourceId = 9442
		and visitors.mobile <> ""
		) order by cueIn DESC 
	UNION
	(select archive_reservations.id as rid, archive_reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, mobile, visitors.id as id
		, CONVERT(CAST(archive_reservations.note as BINARY) USING utf8) as appointmentnote
		, CONVERT(CAST(visitors.note as BINARY) USING utf8) as visitornote
		, email

		from archive_reservations
			join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
			join visitors on visitors.id = archive_att_visitors.resourceId
			join archive_attendees on archive_reservations.id = archive_attendees.groupId 

	where archive_reservations.groupId = 3279 
		and archive_reservations.deletorId = 0
		and cueIn > UNIX_TIMESTAMP("2018-08-19") 
		and archive_attendees.resourceId = 9442
		and visitors.mobile <> ""
	) order by cueIn DESC 
) ALIAS LIMIT 20000;




-- ---------------------------------------------------------------------------------------
-- Find and remove any visitors for which the account responsible has written a special tag in the registration field
-- Here, the account was Joris PIERROT and the keyword is "poubelle"
--

delete att_visitors from att_visitors
	inner join visitors on visitors.id = att_visitors.resourceId
	where visitors.groupId = 3283 and visitors.registration like "%poubelle%";


delete archive_att_visitors from archive_att_visitors
	inner join visitors on visitors.id = archive_att_visitors.resourceId
	where visitors.groupId = 3283 and visitors.registration like "%poubelle%";

delete from visitors where visitors.groupId = 3283 and visitors.registration like "%poubelle%";





-- ---------------------------------------------------------------------------------------
-- Extraction des guidelines pour tous les comptes de BUROGEST. 
--


select distinct 
		groups.id as accountId, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname , 
		resources.id as resourceId, CONVERT(CAST(resources.name as BINARY) USING utf8) as agendaname , 
		CONVERT(CAST(groups.note as BINARY) USING utf8) as tooltip  , 
		CONVERT(CAST(guidelines.name as BINARY) USING utf8) as gl_name , 
		CONVERT(CAST(guidelines.address as BINARY) USING utf8) as gl_address , 
		CONVERT(CAST(guidelines.city as BINARY) USING utf8) as gl_city ,  
		CONVERT(CAST(guidelines.zipCode as BINARY) USING utf8) as gl_zipCode , 
		CONVERT(CAST(guidelines.phone as BINARY) USING utf8) as gl_phone , 
		CONVERT(CAST(guidelines.mobile as BINARY) USING utf8) as gl_mobile , 
		CONVERT(CAST(guidelines.email as BINARY) USING utf8) as gl_email , 
		CONVERT(CAST(guidelines.registration as BINARY) USING utf8) as gl_registration  , 
		CONVERT(CAST(guidelines.directions as BINARY) USING utf8) as gl_directions  , 
		CONVERT(CAST(guidelines.newvisi as BINARY) USING utf8) as gl_newvisi  , 
		CONVERT(CAST(guidelines.appguide as BINARY) USING utf8) as gl_appguide  , 
		CONVERT(CAST(guidelines.reqguide as BINARY) USING utf8) as gl_reqguide   , 
		CONVERT(CAST(guidelines.neverdo as BINARY) USING utf8) as gl_neverdo   , 
		CONVERT(CAST(guidelines.tipstricks as BINARY) USING utf8) as gl_tipstricks 
	from resources
	join groups on groups.id = resources.groupId
	left join guidelines on guidelines.id = resources.guideId
	join accesskeys on groups.id = accesskeys.accountId
	where accesskeys.groupId IN (8350)
		order by accountname ASC;


-- ---------------------------------------------------------------------------------------
-- Intuitim starts a synchro where they can force the id in their system. 
-- So we pass them a csv export of patients and we create (hereunder) a synchro line where remoteId is visitors.id
-- This was made first for PNC Charleroi
--


INSERT INTO synchro_visitors (localId,remoteId,skeyId)	
	SELECT id as localId, id as remoteId, 20425 as skeyId 
	FROM visitors	
	WHERE groupId = 2805 and deleted = 0;



-- ---------------------------------------------------------------------------------------
-- Extract users who have the given profession
-- (profession codes are in file controls.js under C_iPRO.options)
--

select distinct CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname
		, email, mobile 
	from logins where logins.profession = 205;

	

-- ---------------------------------------------------------------------------------------
-- Extract patients and reservations
--

select reservations.id as rid, reservations.cueIn
		, FROM_UNIXTIME(cueIn,'%Y %b %d  %a') as date
		, FROM_UNIXTIME(cueIn,'%H:%i') as time
		, resources.name as agenda
		, gender, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname
		, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname, visitors.id as patientid
		, CONVERT(CAST(reservations.note as BINARY) USING utf8) as appointmentnote

		from reservations
			join att_visitors on att_visitors.groupId = reservations.id
			join visitors on visitors.id = att_visitors.resourceId
			join attendees on attendees.groupId = reservations.id
			join resources on attendees.resourceId = resources.id

	where reservations.groupId = 2813 order by agenda DESC;


select id, gender, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname
				, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname, email, mobile, phone 
	from visitors where groupId = 2813 order by id DESC;



-- ---------------------------------------------------------------------------------------
-- Read appointments on a given day
--

select reservations.id, visitors.lastname, visitors.firstname, FROM_UNIXTIME(cueIn,'%H:%i') as time  
	from reservations 
	join attendees on attendees.groupId = reservations.id
	join att_visitors on att_visitors.groupId = reservations.id
	join visitors on visitors.id = att_visitors.resourceId
where reservations.groupId = 2838 and attendees.resourceId = 7015
and cueIn > UNIX_TIMESTAMP('2017-11-10 03:00:00') and cueOut < UNIX_TIMESTAMP('2017-11-10 23:00:00')
order by cueIn ASC;
	
	
 
 
-- ---------------------------------------------------------------------------------------
-- Copy visitors to another account, changing (of course) the groupId
--


INSERT INTO visitors	( groupId, created,creator,changed,changer,
						gender,firstname,lastname,company,address,zipCode,city,country,email,mobile,phone,note,registration,language,birthday)
	SELECT 3986 as groupId, -- destination account id
			created,creator,changed,changer,
			gender,firstname,lastname,company,address,zipCode,city,country,email,mobile,phone,note,registration,language,birthday
	FROM visitors
	WHERE groupId = 3759 and mergedTo = 0; -- from account id

	
	
-- ---------------------------------------------------------------------------------------

-- Demande de Patrick DETROUX, combien de nouveaux visiteurs, combien de RDVs pris par lui et par sa collègue dans l'année 2016


select gender	, CONVERT(CAST(firstname as BINARY) USING utf8) as firstname
				, CONVERT(CAST(lastname as BINARY) USING utf8) as lastname, email, mobile, phone 
	from visitors where groupId = 2990 and created > "2016-01-01" and created < "2017-01-01" order by lastname ASC;


-- for attendee 7190 = Charline Barchon

( select CONVERT(CAST(custom_css.name as BINARY) USING utf8) as app_color, count(1) as occurences from reservations 
	join attendees on attendees.groupId = reservations.id
	join custom_css on custom_css.id = reservations.cssColor
	where reservations.groupId = 2990 and attendees.resourceId = 7190 
		and reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') group by app_color )
 UNION
( select CONVERT(CAST(custom_css.name as BINARY) USING utf8) as app_color, count(1) as occurences from archive_reservations 
	join archive_attendees on archive_attendees.groupId = archive_reservations.id
	join custom_css on custom_css.id = archive_reservations.cssColor
	where archive_reservations.groupId = 2990 and archive_attendees.resourceId = 7190 
		and archive_reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and archive_reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') group by app_color  ) order by app_color asc;


( select reservations.created, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i') as dateIn, cueIn, firstname, lastname, mobile, phone, reservations.cssColor from reservations 
	join att_visitors on att_visitors.groupId = reservations.id
	join attendees on attendees.groupId = reservations.id
	join visitors on visitors.id = att_visitors.resourceId
	where reservations.groupId = 2990 
		and attendees.resourceId = 7190 
		and reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') )
 UNION
( select archive_reservations.created, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i') as dateIn, cueIn, firstname, lastname, mobile, phone, archive_reservations.cssColor from archive_reservations 
	join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
	join archive_attendees on archive_attendees.groupId = archive_reservations.id
	join visitors on visitors.id = archive_att_visitors.resourceId
	where archive_reservations.groupId = 2990 
		and archive_attendees.resourceId = 7190 
		and archive_reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and archive_reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') ) order by cueIn asc;


-- for attendee 7189 = Patrick Detroux


( select CONVERT(CAST(custom_css.name as BINARY) USING utf8) as app_color, count(1) as occurences from reservations 
	join attendees on attendees.groupId = reservations.id
	join custom_css on custom_css.id = reservations.cssColor
	where reservations.groupId = 2990 and attendees.resourceId = 7189 
		and reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') group by app_color )
 UNION
( select CONVERT(CAST(custom_css.name as BINARY) USING utf8) as app_color, count(1) as occurences from archive_reservations 
	join archive_attendees on archive_attendees.groupId = archive_reservations.id
	join custom_css on custom_css.id = archive_reservations.cssColor
	where archive_reservations.groupId = 2990 and archive_attendees.resourceId = 7189 
		and archive_reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and archive_reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') group by app_color  ) order by app_color asc;


( select reservations.created, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i') as dateIn, cueIn, firstname, lastname, mobile, phone, reservations.cssColor from reservations 
	join att_visitors on att_visitors.groupId = reservations.id
	join attendees on attendees.groupId = reservations.id
	join visitors on visitors.id = att_visitors.resourceId
	where reservations.groupId = 2990 and attendees.resourceId = 7189 
		and reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') )
 UNION
( select archive_reservations.created, FROM_UNIXTIME(cueIn,'%Y-%m-%d %H:%i') as dateIn, cueIn, firstname, lastname, mobile, phone, archive_reservations.cssColor from archive_reservations 
	join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
	join archive_attendees on archive_attendees.groupId = archive_reservations.id
	join visitors on visitors.id = archive_att_visitors.resourceId
	where archive_reservations.groupId = 2990 and archive_attendees.resourceId = 7189 
		and archive_reservations.cueIn > UNIX_TIMESTAMP('2016-01-01 03:00:00')
		and archive_reservations.cueOut < UNIX_TIMESTAMP('2017-01-01 03:00:00') ) order by cueIn asc;


 
 
 
-- ---------------------------------------------------------------------------------------
-- Move an account resource to another account along with visitors
--

update custom_css set groupId = 3800 where groupId = 3599; -- and cssType = 80 and resaClass = 11;
update visitors set groupId = 3800 where groupId = 3599;
update reservations set groupId = 3800 where groupId = 3599;
update resources set groupId = 3800 where groupId = 3599; -- and id = 11206;
update hourlies set groupId = 3800 where groupId = 3599; -- and id = 11206;
update timeboxings set groupId = 3800 where groupId = 3599; -- and id = 11206;

select * from accesskeys where accountId = 3800; -- be carefull here, the moved resource must be in the view of the admin accesskey, to be adapted manualy






-- ---------------------------------------------------------------------------------------
-- DELETE APPOINTMENTS HISTORY  ( Fred Bonfils - Sensation Spa )
--
-- This script removes from DB all items older than the given date, for a given account

delete archive_attendees from archive_attendees
	inner join archive_reservations on archive_reservations.id = archive_attendees.groupId
	where archive_reservations.groupId = 3032 and archive_reservations.cueIn < UNIX_TIMESTAMP('2017-07-31 03:00:00'); 

delete archive_att_visitors from archive_att_visitors
	inner join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
	where archive_reservations.groupId = 3032 and archive_reservations.cueIn < UNIX_TIMESTAMP('2017-07-31 03:00:00'); 

delete archive_performances from archive_performances
	inner join archive_reservations on archive_reservations.id = archive_performances.groupId
	where archive_reservations.groupId = 3032 and archive_reservations.cueIn < UNIX_TIMESTAMP('2017-07-31 03:00:00'); 

delete comm_toggles from comm_toggles
	inner join archive_reservations on archive_reservations.id = comm_toggles.reservationId
	where archive_reservations.groupId = 3032 and archive_reservations.cueIn < UNIX_TIMESTAMP('2017-07-31 03:00:00'); 

	
delete from archive_reservations where groupId = 3032 and cueIn < UNIX_TIMESTAMP('2017-07-31 03:00:00');




-- ---------------------------------------------------------------------------------------
-- Demand from NIL: after .ics import, the time shift is erroneous
-- 3519 is the accountId

update reservations set cueIn = cueIn+7200, cueOut = cueOut+7200, changed = NOW(), changer = 'Pascal', changerId = 1
where cueIn >= UNIX_TIMESTAMP('2015-04-14 03:00:00')
and groupId = 3519;

update reservations set cueIn = cueIn-3600, cueOut = cueOut-3600, changed = NOW(), changer = 'Pascal', changerId = 1
where cueIn >= UNIX_TIMESTAMP('2015-10-25 03:00:00')
and groupId = 3519;








-- ---------------------------------------------------------------------------------------
-- Demand from LUCIE  TREMOILLES: Multi agenda - extract patients that have got workcode COOLSCULTPING ( = 4961) inbetween two dates


select cueIn, cueOut, firstname, lastname, mobile, email , FROM_UNIXTIME(cueIn, '%d.%m.%Y') as resaDate
	from reservations
	join att_visitors on att_visitors.groupId = reservations.id 
	join visitors on resourceId = visitors.id
	where cueIn >= UNIX_TIMESTAMP('2015-06-01 03:00:00') and cueOut < UNIX_TIMESTAMP('2015-07-31 03:00:00') and reservations.id IN (
						select groupId as resaId from  (
								select distinct groupId from att_visitors 
									where groupId IN (select groupId from performances where workcodeId = 5819)
						) ALIAS
					) 
	

UNION 

select cueIn, cueOut, firstname, lastname, mobile, email, FROM_UNIXTIME(cueIn, '%d.%m.%Y') as resaDate
	from archive_reservations 
	join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
	join visitors on resourceId = visitors.id
	where cueIn >= UNIX_TIMESTAMP('2015-06-01 03:00:00') and cueOut < UNIX_TIMESTAMP('2015-07-31 03:00:00') and archive_reservations.id IN (
						select groupId as resaId from  (
								select distinct groupId from archive_att_visitors 
									where groupId IN (select groupId from archive_performances where workcodeId = 5819) 
						) ALIAS
	
) order by resaDate asc;






-- ---------------------------------------------------------------------------------------

-- Demand from PONCHON ILES D'OR: Multi agenda - extract patients that have been ever recorded in a particular agenda (PONCHON = 6301)

select gender, lastname, firstname, birthday, mobile, email from visitors where id IN (
	select distinct resourceId from (
		select distinct resourceId from att_visitors 
		where groupId IN (select groupId from attendees where resourceId = 6301)
		UNION
		select distinct resourceId from archive_att_visitors 
		where groupId IN (select groupId from archive_attendees where resourceId = 6301) 
	) ALIAS
);



-- ---------------------------------------------------------------------------------------

-- Demand from MANGIN PARIS: we have removed the bCal type resources and moved the uCals in place, along with reservations already present in the agenda

update accesskeys set bCals = '', uCals = '' where accountId = 3233;
delete from attendees where resourceId IN (8308,8448,8449,8450,8542);
update resources set resourceType = 2 where id IN (8487,8488,8489,8490,8491,8492);
update attendees set resourceType = 2 where resourceId in (8487,8488,8489,8490,8491,8492);
delete from resources where id in (8308,8448,8449,8450,8542);


-- ---------------------------------------------------------------------------------------

-- From h4d, add details in details table only for selected logins (accessLevel), and remove some permissions for those logins


update logins 
inner join accesskeys on accesskeys.groupId = logins.id
set permissions = (permissions & ~(1<<16)) -- op_resas
where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432);


		
update logins 
inner join accesskeys on accesskeys.groupId = logins.id
set permissions = (permissions & ~(1<<5)) -- ac_disprefs
where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432);

update logins 
inner join accesskeys on accesskeys.groupId = logins.id
set permissions = (permissions & ~(1<<7)) -- ac_visis
where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432);
		
		
		
-- ------------------------------------ details -------------------------------------------
		

		
-- details : first delete the possibly already created items, then apply rigid rules
		
delete from details where displayMode in (1,2,3) and resourceType = 2 
and groupId in ( 
		select accesskeys.id as gid from accesskeys 
			join logins on logins.id = accesskeys.groupId
			where logins.accessLevel = 6 and accesskeys.accountId = 3673
				and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432)
 );


-- insert for displayMode 1, resourceType bCal = 2, only two bits ( 1<<26 = disbltips +  1 << 27 = hidesrchasst )

insert into details (groupId, displayMode, resourceType, details) -- displayMode 1 = vertical
	select gid, 1, 2, (1+4+(1<<17)+(1<<26)+(1<<27)) from
	(select accesskeys.id as gid from accesskeys 
		join logins on logins.id = accesskeys.groupId
		where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432)) alias;

insert into details (groupId, displayMode, resourceType, details) -- displayMode 2 = horizontal
	select gid, 2, 2, (1+4+(1<<17)+(1<<17)+(1<<26)+(1<<27)) from
	(select accesskeys.id as gid from accesskeys 
		join logins on logins.id = accesskeys.groupId
		where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432)) alias;

insert into details (groupId, displayMode, resourceType, details) -- displayMode 3 = list
	select gid, 3, 2, 1+4+(1<<17)+(1<<24)) from
	(select accesskeys.id as gid from accesskeys 
		join logins on logins.id = accesskeys.groupId
		where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432)) alias;
			
	
-- verify 		

select * from details where displayMode in (1,2,3) and resourceType = 2 and groupId in 
(select accesskeys.id from accesskeys 
	join logins on logins.id = accesskeys.groupId
	where logins.accessLevel = 6 and accesskeys.accountId = 3673
		and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432));
		


-- ------------------------------------ catalysts -------------------------------------------


		
-- catalysts : first delete the possibly already created items, then apply rigid rules
		
delete from catalysts where catalyst = 'C_dS_reservation'
and groupId in ( 
		select accesskeys.id as gid from accesskeys 
			join logins on logins.id = accesskeys.groupId
			where logins.accessLevel = 6 and accesskeys.accountId = 3673
				and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432)
 );


-- insert 

insert into catalysts (groupId, catalyst, fields, sorton, sortdir) 
	select gid, 'C_dS_reservation', 'ccss!dateIn!duration', 'dateIn', 1 from 
	(select accesskeys.id as gid from accesskeys 
		join logins on logins.id = accesskeys.groupId
		where logins.accessLevel = 6 and accesskeys.accountId = 3673
			and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432)) alias;
			
			
-- verify 		

select * from catalysts where catalyst = 'C_dS_reservation' and groupId in 
(select accesskeys.id from accesskeys 
	join logins on logins.id = accesskeys.groupId
	where logins.accessLevel = 6 and accesskeys.accountId = 3673
		and logins.id not in (15953,12369,12804,14898,12160,14632,13506,15208,15209,12906,15338,15598,12248,12803,14684,15432));
		
		






