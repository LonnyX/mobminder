





-- ---------------------------------------------------------------------------------------
-- Get the number of distinct streets in our DB (2019 it was 340000)
--


select distinct replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
		address,'0',''),'1','') ,'2','') ,'3','') ,'4','') ,'5','') ,'6','') ,'7','') ,'8','') ,'9','') ,' ','')  ,',','')   ,'.','')   ,'/','')    ,'boite','')   ,'bte','')
	from visitors where address <> '' order by address asc;


-- clean up the mess in addresses :

update visitors set zipCode = '' where zipCode = '-' or zipCode = '0'  or zipCode = '000'   or zipCode = '0000'   or zipCode = 'X'   or zipCode = 'XX'   or zipCode = 'XXX'   or zipCode = 'XXXX'   or zipCode = 'test' or zipCode = '.'; 
update visitors set address = '' where address = '-' or address = '0'  or address = '000'   or address = '0000'   or address = 'X'   or address = 'XX'   or address = 'XXX'   or address = 'XXXX'   or address = 'test' or address = '.';
update visitors set city = '' where city = '-' or city = '0'  or city = '000'   or city = '0000'   or city = 'X'   or city = 'XX'   or city = 'XXX'   or city = 'XXXX'   or city = 'test' or city = '.';




-- ---------------------------------------------------------------------------------------
-- Get the number of SMS sent from different Wallets
--

select distinct logins.id as walletId, CONVERT(CAST(logins.lastname as BINARY) USING utf8) as lastname, CONVERT(CAST(logins.firstname as BINARY) USING utf8) as firstname, 
			groups.id as accountId, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountName, sum(sms.pages) as smspages from sms 
	join groups on groups.id = sms.groupId
	join accesskeys on sms.groupId = accesskeys.accountId
	join logins on accesskeys.groupId = logins.id
	where sms.created '2019-01-01' 	and sms.created < '2019-04-01' 
		and accesskeys.groupId IN (7886,7875,7881,7893,7896,8330,9859,8797,8818,8820,11707,10228,10444,11641)
		group by sms.groupId order by logins.lastname, smspages DESC;

	
--- Check the list of wallet logins

select * from logins where accessLevel >= 8;


-- ---------------------------------------------------------------------------------------
-- Get the number of reservations by calendars in the Dietplus wallet
--
select groups.id as accountId, groups.name as accountname
		, resources.id as resourceId, resources.name as rescname, count(reservations.id) as resacount
	from reservations 
	join attendees on attendees.groupId = reservations.id
	join resources on resources.id = attendees.resourceId
	join groups on groups.id = resources.groupId
	join accesskeys on groups.id = accesskeys.accountId
	where accesskeys.groupId IN (7922) and reservations.created > '2019-11-01'
		group by attendees.resourceId order by groups.id ASC;


-- list all the resources (calendars) so to appear which account has 2 or more bCals ( Dietplus wallet )

select groups.id as accountId, groups.name as accountname
		, resources.id as resourceId, resources.name as rescname
	from resources 
	join groups on groups.id = resources.groupId
	join accesskeys on groups.id = accesskeys.accountId
	where accesskeys.groupId IN (7922)
		order by groups.id ASC;

-- ---------------------------------------------------------------------------------------
-- Get the number of SMS sent from Mobikap accounts    !!! ADAPT THE DATES EACH TRIMESTER !!!
--


-- new version linking to Olivier and Pigot wallets

select distinct groups.id, groups.name as accountname, sum(sms.pages) as smspages from sms 
	join groups on groups.id = sms.groupId
	join accesskeys on sms.groupId = accesskeys.accountId
	where sms.created >= '2019-07-01' 	and sms.created < '2019-10-01'  and accesskeys.groupId IN (9482,10444)
		group by sms.groupId ASC order by id ASC;
		
		
-- new version linking to Dietplus wallet

select distinct groups.id, groups.name as accountname, sum(sms.pages) as smspages from sms 
	join groups on groups.id = sms.groupId
	join accesskeys on sms.groupId = accesskeys.accountId
	where sms.created >= '2019-07-01' 	and sms.created < '2019-10-01'  and accesskeys.groupId IN (7922)
		group by sms.groupId ASC order by id ASC;
		
		
		
		
		
-- inventory of OXTEO sms consumptions

select distinct groups.id, groups.name as accountname, sum(sms.pages) as smspages from sms 
	join groups on groups.id = sms.groupId
	join accesskeys on sms.groupId = accesskeys.accountId
	where sms.created > '2019-07-01' and sms.created < '2019-10-01' and sms.creator <> "dmarketing" and accesskeys.groupId IN (11641)
		group by sms.groupId order by smspages DESC;

		
		
		-- get the number of web pages at oxteo side
select distinct groups.id as accountid, 
		CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname
	, logins.eresaUrl
	, CONVERT(CAST(logins.firstname as BINARY) USING utf8) as businessname
	, CONVERT(CAST(logins.lastname as BINARY) USING utf8) as businesstype
	, CONVERT(CAST(logins.eresaTitle as BINARY) USING utf8) as pageheader
from logins 
	join groups on groups.id = logins.groupId
	where logins.groupId in(select accountId as id from accesskeys where accesskeys.groupId IN (11641)) and logins.accessLevel = 4
		group by logins.groupId order by groups.id asc;
		
		
		

-- inventory of BUROGEST consumptions

-- number of sms sent by this account
select distinct groups.id, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname, sum(sms.pages) as smspages from sms 
	join groups on groups.id = sms.groupId
	join accesskeys on sms.groupId = accesskeys.accountId
	where sms.created '2019-01-01' 	and sms.created < '2019-04-01'  and accesskeys.groupId IN (8350) -- prog / prog
		group by sms.groupId order by smspages DESC;

-- number of reservations in the account
select distinct groups.id, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname, sum(1) as resacount from reservations 
	join groups on groups.id = reservations.groupId
	join accesskeys on reservations.groupId = accesskeys.accountId
	where reservations.created '2019-01-01' 	and sms.created < '2019-04-01'  and accesskeys.groupId IN (8350) -- prog / prog
		group by reservations.groupId order by resacount DESC;

-- number of calendars in the account
select distinct groups.id, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname, sum(1) as rsccount from resources 
	join groups on groups.id = resources.groupId
	join accesskeys on resources.groupId = accesskeys.accountId
	where accesskeys.groupId IN (8350) -- prog / prog
		group by resources.groupId order by groups.id ASC;


		
		
-- inventory of GIRAUD sms consumptions
		
		select distinct groups.id, groups.name as accountname, sum(sms.pages) as smspages from sms 
	join groups on groups.id = sms.groupId
	join accesskeys on sms.groupId = accesskeys.accountId
	where sms.created >= '2019-07-01' 	and sms.created < '2019-10-01' 
	and accesskeys.groupId IN (7893)
	and accesskeys.accountId NOT IN (
		  2785 -- Esthétique Trémoille
		, 2783 -- La Ramée
		, 2786 -- Dentiste Teich
		, 2800 -- Dentiste Persoons
		, 2819 -- Dentiste Fournier
		, 2821 -- Mobminder RDV
		, 2827 -- Dentiste Stoica
		, 2828 -- Dentiste M. Goffin
		, 2832 -- Clinique Fond'Roy
		, 2867 -- Dentiste Barber
		, 2917 -- Medlasne Nicolas Morelle
		, 3029 -- Paroimplant
		, 3046 -- Centre Médical du Val
		, 3075 -- Sarmadi
		, 3108 -- Polyclinique Spécialisée de Jette
		, 3109 -- Dentiste Gilles
		, 3111 -- Serge Remacle
		, 3120 -- Cabinet Deuse
		, 3129 -- Dentist Brussels
		, 3136 -- Euskalkiné
		, 3143 -- ORL Masy & Delabie
		, 3183 -- Cabinet Médical Orban
		, 3193 -- Cabinet Dentaire du chant d'oiseau
		, 3194 -- Dermato Braham
		, 3198 -- Walravens
		, 3220 -- Dentiste Mathonet
		, 3232 -- Gottschalk
		, 3237 -- CVDM
		, 3250 -- Les 4 Sapins
		, 3255 -- Stéphane Résimont
		, 3259 -- Cyrille Voisin
		, 3279 -- Centre Médical Albert
		, 3307 -- CMS La Hulpe
		, 3333 -- Salon Jérôme
		, 3409 -- Dentiste Delescaille
		, 3413 -- Medical Diet Center
		, 3445 -- L'espace Temps
		, 3461 -- Dr Wauters
		, 3464 -- ORL Serville
		, 3468 -- Louvrex Les Bains
		, 3484 -- Cabinet Dentaire De fré
		, 3441 -- Wellness La Réserve
		, 3579 -- AREA+
		, 3592 -- Dentiste Charlier
		, 3603 -- Trajectoire
		, 3606 -- Cabinet dentaire Nil
		, 4101 -- DMVETS
		, 4183 -- Barbieux
		, 4210 -- Cabinet Dentaire des Pagodes
		)
		group by sms.groupId order by smspages DESC;
		
		
		

-- ---------------------------------------------------------------------------------------
-- SMS Consumption monitoring by weekday and by country (+32, +33, others)
--

		
-- probe for Belgium +32

select 
			sum(sms.pages) as smspages, count(1) as msgs, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname
		, groups.id as accountid, logins.lastname as adminlname, logins.firstname as adminfname
	from sms
	join groups on sms.groupId = groups.id
	right join accesskeys on accesskeys.accountId = groups.id
	right join logins on accesskeys.groupId = logins.id
	where sms.created >= '2018-01-01' 	and sms.created < '2018-04-01' and toNumber like '32%' and logins.accessLevel = 8
	group by accountname order by lastname, smspages desc;


select 
				sum(sms.pages) as smspages, count(1) as msgs,
				TIME_FORMAT(TIME(sms.created), '%H') as time,
				DAYNAME(sms.created) as weekday,
				CONCAT(WEEKDAY(sms.created)," ",DAYNAME(sms.created)," ",TIME_FORMAT(TIME(sms.created), '%H'),"h") as dayandtime
from sms 
	where sms.created >= '2018-01-01' 	and sms.created < '2019-01-01' and toNumber like '32%'
		group by dayandtime order by dayandtime asc;
		
-- again for France +33

select 
			sum(sms.pages) as smspages, count(1) as msgs, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname
		, groups.id as accountid, logins.lastname as adminlname, logins.firstname as adminfname
	from sms
	join groups on sms.groupId = groups.id
	right join accesskeys on accesskeys.accountId = groups.id
	right join logins on accesskeys.groupId = logins.id
	where sms.created >= '2018-01-01' 	and sms.created < '2018-04-01' and toNumber like '33%' and logins.accessLevel = 8
	group by accountname order by lastname, smspages desc;


select 
				sum(sms.pages) as smspages, count(1) as msgs,
				TIME_FORMAT(TIME(sms.created), '%H') as time,
				DAYNAME(sms.created) as weekday,
				CONCAT(WEEKDAY(sms.created)," ",DAYNAME(sms.created)," ",TIME_FORMAT(TIME(sms.created), '%H'),"h") as dayandtime
from sms 
	where sms.created >= '2018-01-01' 	and sms.created < '2018-04-01' and toNumber like '33%'
		group by dayandtime order by dayandtime asc;


-- again for Outsiders <> +33  <+32>
 
select 
			sum(sms.pages) as smspages, count(1) as msgs, CONVERT(CAST(groups.name as BINARY) USING utf8) as accountname
		, groups.id as accountid, logins.lastname as adminlname, logins.firstname as adminfname
	from sms
	join groups on sms.groupId = groups.id
	right join accesskeys on accesskeys.accountId = groups.id
	right join logins on accesskeys.groupId = logins.id
	where sms.created >= '2018-01-01' 	and sms.created < '2018-04-01' and toNumber not like '32%' and toNumber not like '33%' and logins.accessLevel = 8
	group by accountname order by lastname, smspages desc;


select 
				sum(sms.pages) as smspages, count(1) as msgs,
				TIME_FORMAT(TIME(sms.created), '%H') as time,
				DAYNAME(sms.created) as weekday,
				CONCAT(WEEKDAY(sms.created)," ",DAYNAME(sms.created)," ",TIME_FORMAT(TIME(sms.created), '%H'),"h") as dayandtime
from sms 
	where sms.created >= '2018-01-01' 	and sms.created < '2018-04-01' and toNumber not like '32%' and toNumber not like '33%'
		group by dayandtime order by dayandtime asc;
	
									
									
									