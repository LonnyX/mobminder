

-- ----------------------------
-- MySQL timestamps: genoeg is genoed !
-- ----------------------------


  
-- ALTER TABLE `reservations`
  ADD COLUMN `created_unix` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 AFTER `created`,
  ADD COLUMN `changed_unix` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 AFTER `changed`,
  ADD COLUMN `deleted_unix` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 AFTER `deleted`;
  
-- UPDATE mobminder.reservations
SET
  created_unix = UNIX_TIMESTAMP(created),
  changed_unix = UNIX_TIMESTAMP(changed),
  deleted_unix = UNIX_TIMESTAMP(deleted);
  
CREATE INDEX idx_created_unix ON reservations(groupId, created_unix);
CREATE INDEX idx_changed_unix ON reservations(groupId, changed_unix);
CREATE INDEX idx_deleted_unix ON reservations(groupId, deleted_unix);

  
  
  
-- ALTER TABLE `archive_reservations` (700seconds on dev env)
  ADD COLUMN `created_unix` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 AFTER `created`,
  ADD COLUMN `changed_unix` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 AFTER `changed`,
  ADD COLUMN `deleted_unix` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 AFTER `deleted`;
  
-- UPDATE mobminder.archive_reservations (1000seconds on dev env)
SET
  created_unix = UNIX_TIMESTAMP(created),
  changed_unix = UNIX_TIMESTAMP(changed),
  deleted_unix = UNIX_TIMESTAMP(deleted);
-- WHERE id BETWEEN 1 AND 1000000;

-- adding indexes ( 2520 seconds on dev env)
CREATE INDEX idx_created_unix ON archive_reservations(groupId, created_unix);
CREATE INDEX idx_changed_unix ON archive_reservations(groupId, changed_unix);
CREATE INDEX idx_deleted_unix ON archive_reservations(groupId, deleted_unix);




-- We have those two tables in DB


ALTER TABLE `custom_css` ADD COLUMN ctrlshift tinyint(1) NOT NULL default 0 AFTER `css`;




-- ----------------------------
-- Table structure for stat_zips
-- ----------------------------

DROP TABLE IF EXISTS `stat_zips`;
CREATE TABLE `stat_zips`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` int(8) UNSIGNED NOT NULL, -- mandatory for compatibility with C_dbID
  `zip` varchar(8) NOT NULL default '',
  `city` varchar(32) NOT NULL default '',
  `country` varchar(32) NOT NULL default '',
  `cmetaphone1` varchar(8) NOT NULL default '',
  `cmetaphone2` varchar(8) NOT NULL default '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 555000000 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;


CREATE INDEX idx_cmetaphone1 ON stat_zips(cmetaphone1);
CREATE INDEX idx_cmetaphone2 ON stat_zips(cmetaphone2);

CREATE INDEX idx_zips ON stat_zips(zip, country);
CREATE INDEX idx_cities ON stat_zips(city, zip, country);
-- CREATE INDEX idx_countryies ON stat_addresses(country);


-- ----------------------------
-- Table structure for stat_adresses
-- ----------------------------

DROP TABLE IF EXISTS `stat_addresses`;
CREATE TABLE `stat_addresses`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` int(8) UNSIGNED NOT NULL, -- mandatory for compatibility with C_dbID
  `street` varchar(64) NOT NULL default '',
  `zip` varchar(8) NOT NULL default '',
  `city` varchar(32) NOT NULL default '',
  `country` varchar(32) NOT NULL default '',
  `smetaphone1` varchar(8) NOT NULL default '',
  `smetaphone2` varchar(8) NOT NULL default '',
  `cmetaphone1` varchar(8) NOT NULL default '',
  `cmetaphone2` varchar(8) NOT NULL default '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 555000000 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;


CREATE INDEX idx_smetaphone1 ON stat_addresses(smetaphone1);
CREATE INDEX idx_smetaphone2 ON stat_addresses(smetaphone2);
CREATE INDEX idx_cmetaphone1 ON stat_addresses(cmetaphone1);
CREATE INDEX idx_cmetaphone2 ON stat_addresses(cmetaphone2);

CREATE INDEX idx_streets ON stat_addresses(street, zip, country);
CREATE INDEX idx_zips ON stat_addresses(zip, country);
CREATE INDEX idx_cities ON stat_addresses(city, zip, country);
-- CREATE INDEX idx_countries ON stat_addresses(country);

ALTER TABLE stat_addresses ADD FULLTEXT KEY ft_street (street); -- this speeds up drastically the search query
ALTER TABLE stat_addresses ADD FULLTEXT KEY ft_zip_street (zip, street); -- this speeds up drastically the search query


-- This is how to derive the zips table from the addresses table
-- make sure stat_zips won’t get true duplicates
-- ALTER TABLE stat_zips ADD UNIQUE KEY uq_zcc (groupId, zip, city, country);

-- bulk-load every distinct combo of (groupId,zip,city,country,cmetaphone1,cmetaphone2)
INSERT IGNORE INTO stat_zips(zip, city, country, cmetaphone1, cmetaphone2)
	SELECT DISTINCT zip, city, country, cmetaphone1, cmetaphone2 FROM stat_addresses;






-- resa files
-- --------------------------------------------------------------------------------------------
-- 2025-06


--  G E N D E R S    &    L  A S T N A M E S

ALTER TABLE `stat_genders` ADD COLUMN metaphone1 varchar(8) NOT NULL default '' AFTER `gender`;
ALTER TABLE `stat_genders` ADD COLUMN metaphone2 varchar(8) NOT NULL default '' AFTER `metaphone1`;


ALTER TABLE `stat_lastnames` ADD COLUMN metaphone1 varchar(8) NOT NULL default '' AFTER `occurances`;
ALTER TABLE `stat_lastnames` ADD COLUMN metaphone2 varchar(8) NOT NULL default '' AFTER `metaphone1`;

ALTER TABLE `stat_lastnames` ADD COLUMN groupId int(3) NOT NULL default 0 AFTER `id`;


CREATE INDEX idx_metaphone1 ON stat_genders(metaphone1);
CREATE INDEX idx_metaphone2 ON stat_genders(metaphone2);
CREATE INDEX idx_name ON stat_genders(name);

CREATE INDEX idx_metaphone1 ON stat_lastnames(metaphone1);
CREATE INDEX idx_metaphone2 ON stat_lastnames(metaphone2);
CREATE INDEX idx_name ON stat_lastnames(name);



--  V I S I T O R S

ALTER TABLE `visitors` ADD COLUMN metaphone1 varchar(8) NOT NULL default '' AFTER `firstname`;
ALTER TABLE `visitors` ADD COLUMN metaphone2 varchar(8) NOT NULL default '' AFTER `metaphone1`;


ALTER TABLE `visitors` ADD COLUMN metaphone3 varchar(8) NOT NULL default '' AFTER `lastname`;
ALTER TABLE `visitors` ADD COLUMN metaphone4 varchar(8) NOT NULL default '' AFTER `metaphone3`;


-- then hydrate the DB with metaphone values
-- then create the indexes


CREATE INDEX idx_mphone1FN ON visitors(metaphone1, groupId);
CREATE INDEX idx_mphone2FN ON visitors(metaphone2, groupId);
CREATE INDEX idx_mphone3LN ON visitors(metaphone3, groupId);
CREATE INDEX idx_mphone4LN ON visitors(metaphone4, groupId);

CREATE INDEX idx_birthday ON visitors(birthday,groupId);
CREATE INDEX idx_zipcode ON visitors(zipCode,groupId);








-- resa files
-- --------------------------------------------------------------------------------------------
-- 2025-05


CREATE TABLE resafiles LIKE files;
ALTER TABLE resafiles AUTO_INCREMENT = 33000000;
ALTER TABLE `resafiles` CHANGE `visitorId` `reservationId` bigint(20) UNSIGNED NOT NULL DEFAULT 0;

CREATE INDEX idx_visitorId ON files(visitorId);
CREATE INDEX idx_reservationId ON resafiles(reservationId);


-- Adding products and goods
-- --------------------------------------------------------------------------------------------
-- 2025-03



CREATE TABLE products LIKE workcodes;
ALTER TABLE products AUTO_INCREMENT = 2200000;
ALTER TABLE `products` CHANGE `duration` `stockremain` int(8) UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE products DROP COLUMN staffing;

CREATE TABLE productexperts LIKE workexperts;
ALTER TABLE productexperts AUTO_INCREMENT = 3300000;

CREATE TABLE goods LIKE performances;
ALTER TABLE goods AUTO_INCREMENT = 66000000;
ALTER TABLE `goods` CHANGE `workCodeId` `productId` bigint(20) UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE `goods` ADD COLUMN numberof int(8) SIGNED NOT NULL default 0 AFTER `productId`;
-- ATTENTION : il faut ajouter l'index suivant le productId (ne PAS recycler celui vers visitorId, il sera encore nécessaire)

CREATE TABLE archive_goods LIKE goods;
ALTER TABLE archive_goods MODIFY id bigint(20) UNSIGNED NOT NULL DEFAULT 0; -- !! each time before creating an archive table, DO NOT FORGET THIS, remove the AUTO_INCREMENT from the id field.

-- ----------------------------
-- Table structure for stocktakings
-- ----------------------------
DROP TABLE IF EXISTS `stocktakings`;
CREATE TABLE `stocktakings`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL,
  `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `deleted` bigint(20) UNSIGNED NOT NULL,
  `deletor` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deletorId` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `delta` int(8) SIGNED NOT NULL DEFAULT 0,
  `movingtotal` int(8) SIGNED NOT NULL DEFAULT 0,
  `takingnote` text NOT NULL DEFAULT '',
  PRIMARY KEY (`id`, `groupId`) USING BTREE
  -- INDEX `notif_idx_byProductId`(`groupId`,`productId`) USING BTREE,
) ENGINE = MyISAM AUTO_INCREMENT = 88000000 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;



-- SHOW TABLES;


ALTER TABLE `groups` ADD COLUMN defaultCssProductTag varchar(512) NOT NULL default '' AFTER `defaultCssFileTag`;
ALTER TABLE `groups` ADD COLUMN defaultCssProductPattern bigint(20) NOT NULL default 0 AFTER `defaultCssFileTag`;
ALTER TABLE `groups` ADD COLUMN defaultCssProductColor bigint(20) NOT NULL default 0 AFTER `defaultCssFileTag`;



-- Decision maker & aienabled on-off controls
-- --------------------------------------------------------------------------------------------
-- 2025-02

ALTER TABLE `logins` ADD COLUMN `decision` tinyint(1) UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE `logins` ADD COLUMN `aienabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0;


-- Installing daily SMS credit
-- --------------------------------------------------------------------------------------------
-- 2025-02

ALTER TABLE globals ADD COLUMN fcm_oauth_token varchar(2048) NOT NULL DEFAULT '';



ALTER TABLE `logins` ADD COLUMN `locked` tinyint(1) UNSIGNED NOT NULL DEFAULT 0;





-- Installing daily SMS credit
-- --------------------------------------------------------------------------------------------
-- 2024-02

	
ALTER TABLE `groups` ADD COLUMN `dailySMScredit` 	smallint(5) NOT NULL DEFAULT 200;
ALTER TABLE `groups` ADD COLUMN `todaySMSremains` 	smallint(5) NOT NULL DEFAULT 200;
ALTER TABLE `groups` ADD COLUMN `dailyEMLcredit` 	smallint(5) NOT NULL DEFAULT 200;
ALTER TABLE `groups` ADD COLUMN `todayEMLremains` 	smallint(5) NOT NULL DEFAULT 200;



-- Improvement of tags and colors management
-- --------------------------------------------------------------------------------------------
-- 2024-02


ALTER TABLE `groups` ADD COLUMN `ePayWebActive` bigint(20) NOT NULL DEFAULT 0 AFTER `ePayComputopHmac`;



-- Improvement of tags and colors management
-- --------------------------------------------------------------------------------------------
-- 2023-11


ALTER TABLE `workcodes` ADD COLUMN `tags` varchar(256) NOT NULL DEFAULT '' AFTER `tag`;


update reservations
	join performances on performances.groupId = reservations.id
	join workcodes on workcodes.id = performances.workCodeId	
	set reservations.cssColor = workcodes.cssColor
where reservations.cssColor = 0;

update reservations
	join performances on performances.groupId = reservations.id
	join workcodes on workcodes.id = performances.workCodeId	
	set reservations.cssPattern = workcodes.cssPattern
where reservations.cssPattern = 0;

-- second try on prod after PIP of compatible smartapp

update reservations
	join performances on performances.groupId = reservations.id
	join workcodes on workcodes.id = performances.workCodeId	
	set reservations.cssColor = workcodes.cssColor
where reservations.cssColor = 0 and workcodes.cssColor <> 0 and reservations.creator like "%smartapp%";

update reservations
	join performances on performances.groupId = reservations.id
	join workcodes on workcodes.id = performances.workCodeId	
	set reservations.cssPattern = workcodes.cssPattern
where  reservations.cssPattern = 0 and workcodes.cssPattern <> 0 and reservations.creator like '%smartapp%';




-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2023-10


ALTER TABLE `groups` CHANGE `ePayHardPayClientId` `ePayHardPayClientId` varchar(64) NOT NULL DEFAULT '';
ALTER TABLE `groups` CHANGE `ePayHardPayClientSecret` `ePayHardPayClientSecret` varchar(256) NOT NULL DEFAULT '';
ALTER TABLE `groups` CHANGE `ePayHardPayAppId` `ePayHardPayToken` varchar(64) NOT NULL DEFAULT '';




-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2023-06 - 02

ALTER TABLE `logins` ADD COLUMN `soundsVolume` tinyint(1) NOT NULL DEFAULT 8 AFTER `syncTresas`;

ALTER TABLE `globals` ADD COLUMN `is_Payconiq_alive` varchar(32) NOT NULL DEFAULT '' AFTER `SMSproviderFrNtf`;
ALTER TABLE `globals` ADD COLUMN `is_HardPay_alive` varchar(32) NOT NULL DEFAULT '' AFTER `SMSproviderFrNtf`;
ALTER TABLE `globals` ADD COLUMN `is_SoftPay_alive` varchar(32) NOT NULL DEFAULT '' AFTER `SMSproviderFrNtf`;




-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2023-05 - 

update payments set transtatus = transtatus * 10;

ALTER TABLE `groups` ADD COLUMN `ePaySoftPayAppId` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;
ALTER TABLE `groups` ADD COLUMN `ePaySoftPayClientSecret` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;
ALTER TABLE `groups` ADD COLUMN `ePaySoftPayClientId` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;


-- for GoCrypto

ALTER TABLE `groups` ADD COLUMN `ePayHardPayAppId` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;
ALTER TABLE `groups` ADD COLUMN `ePayHardPayClientSecret` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;
ALTER TABLE `groups` ADD COLUMN `ePayHardPayClientId` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;




-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2023-03 - 

ALTER TABLE `groups` ADD COLUMN `ePayComputopHmac` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;
ALTER TABLE `groups` ADD COLUMN `ePayComputopFish` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;
ALTER TABLE `groups` ADD COLUMN `ePayComputopId` varchar(64) NOT NULL DEFAULT '' AFTER `ePayMarketKey`;




-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2023-01 - 

ALTER TABLE `workcodes` ADD COLUMN `secretarynote` varchar(1024) NOT NULL DEFAULT '' AFTER `note`;
ALTER TABLE `workcodes` ADD COLUMN `webpagenote` varchar(2048) NOT NULL DEFAULT '' AFTER `secretarynote`;
ALTER TABLE `workcodes` ADD COLUMN `communicnote` varchar(1024) NOT NULL DEFAULT '' AFTER `webpagenote`;

ALTER TABLE `workcodes` ADD COLUMN `altLanguage1` smallint(4) NOT NULL DEFAULT 255 AFTER `communicnote`;
ALTER TABLE `workcodes` ADD COLUMN `altName1` varchar(256) NOT NULL DEFAULT '' AFTER `altLanguage1`;
ALTER TABLE `workcodes` ADD COLUMN `altwebpagenote1` varchar(2048) NOT NULL DEFAULT '' AFTER `altName1`;
ALTER TABLE `workcodes` ADD COLUMN `altcommunicnote1` varchar(1024) NOT NULL DEFAULT '' AFTER `altwebpagenote1`;

ALTER TABLE `workcodes` ADD COLUMN `altLanguage2` smallint(4) NOT NULL DEFAULT 255 AFTER `altcommunicnote1`;
ALTER TABLE `workcodes` ADD COLUMN `altName2` varchar(256) NOT NULL DEFAULT '' AFTER `altLanguage2`;
ALTER TABLE `workcodes` ADD COLUMN `altwebpagenote2` varchar(2048) NOT NULL DEFAULT '' AFTER `altName2`;
ALTER TABLE `workcodes` ADD COLUMN `altcommunicnote2` varchar(1024) NOT NULL DEFAULT '' AFTER `altwebpagenote2`;


update `workcodes` set secretarynote = name; -- so we keep the entire long name that sometime appears in Burogest
update `workcodes` set webpagenote = note;
update `workcodes` set communicnote = note;
update `workcodes` set altLanguage1 = 255;
update `workcodes` set altLanguage2 = 255;

ALTER TABLE `workcodes` CHANGE `name` `name` varchar(128); -- keep this after copying the name

ALTER TABLE `logins` ADD COLUMN `secretarypopups` tinyint(1) NOT NULL DEFAULT 0 AFTER `notbyme`;






-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2022-11 - 


ALTER TABLE `logins` ADD COLUMN `seoComment` text NOT NULL DEFAULT '' AFTER `eresaIdentMode`;
ALTER TABLE `logins` ADD COLUMN `seoMetaCanon` varchar(64) NOT NULL DEFAULT '' AFTER `eresaIdentMode`;
ALTER TABLE `logins` ADD COLUMN `seoMetaDescr` varchar(256) NOT NULL DEFAULT '' AFTER `eresaIdentMode`;
ALTER TABLE `logins` ADD COLUMN `seoMetaTitle` varchar(128) NOT NULL DEFAULT '' AFTER `eresaIdentMode`;
ALTER TABLE `logins` ADD COLUMN `seoIndexable` tinyint(1) NOT NULL DEFAULT 1 AFTER `eresaIdentMode`;

ALTER TABLE `logins` ADD COLUMN `eresaFillingMode` tinyint(2) NOT NULL DEFAULT 99 AFTER `eresaIdentMode`;

update `logins` set eresaIdentMode = 0; -- that is the unique email or mobile 
ALTER TABLE `logins` CHANGE `eresaIdentMode` `eresaIdentMode` tinyint(1) NOT NULL DEFAULT 0;



-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2022-10 - 



ALTER TABLE `devices` ADD COLUMN `appver` varchar(16) NOT NULL DEFAULT '' AFTER `deviceid`;

ALTER TABLE `templates_notif` CHANGE `subject` `title` varchar(256) NOT NULL DEFAULT '';
ALTER TABLE `templates_notif` CHANGE `altSubject1` `altTitle1` varchar(256) NOT NULL DEFAULT '';
ALTER TABLE `templates_notif` CHANGE `altSubject2` `altTitle2` varchar(256) NOT NULL DEFAULT '';


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `reservationId` bigint(20) UNSIGNED NOT NULL,
  `templateId` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `resourceId` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `sendStamp` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `recipientId` bigint(20) NOT NULL DEFAULT 0,
  `sender` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL,
  `statusChangeStamp` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `groupId`) USING BTREE,
  INDEX `notif_idx_byResa`(`reservationId`) USING BTREE,
  INDEX `notif_idx_byTempl`(`templateId`) USING BTREE,
  INDEX `notif_idx_issent`(`resourceId`) USING BTREE,
  INDEX `notif_idx_sendStamp`(`sendStamp`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5445780 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;





-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2022-09 - inserting the payments table - DONE

ALTER TABLE `workcodes` ADD COLUMN `deposit` int(10) NOT NULL DEFAULT 0 AFTER `price`;

ALTER TABLE `logins` ADD COLUMN `eresaIdentMode` varchar(16) NOT NULL DEFAULT '' AFTER `notbyme`;

ALTER TABLE `groups` ADD COLUMN `weburl` varchar(64) NOT NULL DEFAULT '' AFTER `note`;
ALTER TABLE `groups` ADD COLUMN `ccphone` varchar(32) NOT NULL DEFAULT '' AFTER `weburl`;

ALTER TABLE `groups` ADD COLUMN `ePayActive` tinyint(1) NOT NULL DEFAULT 0 AFTER `cssSuite`;

ALTER TABLE `groups` ADD COLUMN `ePayconiqKey` varchar(512) NOT NULL DEFAULT '' AFTER `ePayBenefBIC`;
ALTER TABLE `groups` ADD COLUMN `ePayMarketKey` varchar(512) NOT NULL DEFAULT '' AFTER `ePayconiqKey`;

ALTER TABLE `reservations` ADD COLUMN `billamount` int(10) NOT NULL DEFAULT 0 AFTER `bookingcode`;
ALTER TABLE `archive_reservations` ADD COLUMN `billamount` int(10) NOT NULL DEFAULT 0 AFTER `bookingcode`;

ALTER TABLE `reservations` DROP COLUMN `layerLevel`;
ALTER TABLE `archive_reservations` DROP COLUMN `layerLevel`;




-- --------------------------------------------------------------------------------------------
-- 2022-08 - inserting the payments table

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL, -- resaId
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `paymean` tinyint(8) NOT NULL DEFAULT 0,
  `amount` bigint(20) NOT NULL DEFAULT 0,
  `transid` varchar(256) NOT NULL DEFAULT '',
  `transnote` varchar(512) NOT NULL DEFAULT '',
  `transtatus` int(3) NOT NULL DEFAULT 999,
  `opstatus` varchar(32) NOT NULL DEFAULT '',
  `accountholder` varchar(32) NOT NULL DEFAULT '',
  `accountIBAN` varchar(64) NOT NULL DEFAULT '',
        `qrcodestring` varchar(512) NOT NULL DEFAULT '',
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10000000 DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_transid ON payments (transid);



DROP TABLE IF EXISTS `archive_payments`;
CREATE TABLE `archive_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `groupId` bigint(20) UNSIGNED NOT NULL, -- resaId
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `paymean` tinyint(8) NOT NULL DEFAULT 0,
  `amount` bigint(20) NOT NULL DEFAULT 0,
  `transid` varchar(256) NOT NULL DEFAULT '',
  `transnote` varchar(512) NOT NULL DEFAULT '',
  `transtatus` int(3) NOT NULL DEFAULT 999,
  `opstatus` varchar(32) NOT NULL DEFAULT '',
  `accountholder` varchar(32) NOT NULL DEFAULT '',
  `accountIBAN` varchar(64) NOT NULL DEFAULT '',
        `qrcodestring` varchar(512) NOT NULL DEFAULT '',
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_transid ON archive_payments(transid);





-- IN PROD ALREADY
-- --------------------------------------------------------------------------------------------
-- 2022-01 - changing the number of allowed SMS pages

ALTER TABLE `groups` CHANGE `paymentStatus` `ePayBenefName` varchar(64) NOT NULL DEFAULT '';
ALTER TABLE `groups` CHANGE `ePayProviderHandle` `ePayBenefIBAN` varchar(64) NOT NULL DEFAULT '';
ALTER TABLE `groups` ADD COLUMN `ePayBenefBIC` varchar(16) NOT NULL DEFAULT '' AFTER `ePayBenefIBAN`;

update groups set ePayBenefIBAN = '';
update groups set ePayBenefBIC = '';
update groups set ePayBenefName = '';

select ePayBenefName, ePayBenefIBAN, ePayBenefBIC from groups where id = 3129;


-- --------------------------------------------------------------------------------------------
-- 2022-01 - changing the number of allowed SMS pages


ALTER TABLE `comm_toggles` ADD COLUMN `onoff` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 AFTER `resourceId`;


update comm_toggles INNER JOIN templates_sms on templates_sms.id = comm_toggles.templateId set onoff = 1 where msgMedium = 200 and sendComms = 0;
update comm_toggles INNER JOIN templates_sms on templates_sms.id = comm_toggles.templateId set onoff = 0 where msgMedium = 200 and sendComms = 1;

update comm_toggles INNER JOIN templates_sms on templates_sms.id = comm_toggles.templateId set onoff = 1 where msgMedium = 139 and sendComms = 0;
update comm_toggles INNER JOIN templates_sms on templates_sms.id = comm_toggles.templateId set onoff = 0 where msgMedium = 139 and sendComms = 1;



-- --------------------------------------------------------------------------------------------
-- 2022-03 - inserting the devices table

DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL, -- loginId
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED,
  `deviceid` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(256) NOT NULL DEFAULT '',
  `useragent` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=7000000 DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_deviceid ON devices (deviceid); -- 




-- --------------------------------------------------------------------------------------------
-- 2022-01 - adding the notbyme option


ALTER TABLE `logins` ADD COLUMN `notbyme` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 AFTER `tag`;



-- --------------------------------------------------------------------------------------------
-- 2021-12 - changing the number of allowed SMS pages


update templates_sms set pages = 2 where pages = 1;
update templates_sms set pages = 1 where pages = 0;










-- --------------------------------------------------------------------------------------------

-- moving the information lastphyl from chatpeek to dS_chat_threat


ALTER TABLE `chat_threads` ADD COLUMN `lastphyl` bigint(20) UNSIGNED NOT NULL AFTER `archived`;
ALTER TABLE `archive_chat_threads` ADD COLUMN `lastphyl` bigint(20) UNSIGNED NOT NULL AFTER `archived`;

update chat_threads set lastphyl = (
	SELECT MAX(cue) as lastcue FROM chat_phylacteries WHERE groupId = chat_threads.id );

update archive_chat_threads set lastphyl = (
	SELECT MAX(cue) as lastcue FROM archive_chat_phylacteries WHERE groupId = archive_chat_threads.id );
	
update chat_threads set lastphyl = UNIX_TIMESTAMP(created) where lastphyl = 0;
update archive_chat_threads set lastphyl = UNIX_TIMESTAMP(created) where lastphyl = 0;


-- --------------------------------------------------------------------------------------------


-- CCDA  and tracking time in UNIXT STAMP iso SQL timestamp (this is a dev test trial that was not passed tp prod)


ALTER TABLE `chat_threads` MODIFY COLUMN archived archtime bigint(20) UNSIGNED AFTER deletorId;
ALTER TABLE `chat_threads` ADD COLUMN `archivor` varchar(64) NOT NULL AFTER `archived`;
ALTER TABLE `chat_threads` ADD COLUMN `archivorId` bigint(20) UNSIGNED NOT NULL AFTER `archivor`;

ALTER TABLE `archive_chat_threads` MODIFY COLUMN archived archtime bigint(20) UNSIGNED AFTER deletorId;
ALTER TABLE `archive_chat_threads` ADD COLUMN `archivor` varchar(64) NOT NULL AFTER `archived`;
ALTER TABLE `archive_chat_threads` ADD COLUMN `archivorId` bigint(20) UNSIGNED NOT NULL AFTER `archivor`;


ALTER TABLE `chat_threads` 		MODIFY COLUMN created varchar(32);
ALTER TABLE `chat_threads` 		MODIFY COLUMN changed varchar(32);
ALTER TABLE `chat_threads` 		MODIFY COLUMN deleted varchar(32);

update chat_threads set created = UNIX_TIMESTAMP(created);
update chat_threads set changed = UNIX_TIMESTAMP(changed);
update chat_threads set deleted = UNIX_TIMESTAMP(deleted);

ALTER TABLE `chat_threads` 		MODIFY COLUMN created bigint(20) UNSIGNED NOT NULL;
ALTER TABLE `chat_threads` 		MODIFY COLUMN changed bigint(20) UNSIGNED NOT NULL;
ALTER TABLE `chat_threads` 		MODIFY COLUMN deleted bigint(20) UNSIGNED NOT NULL;


ALTER TABLE `archive_chat_threads` 		MODIFY COLUMN created varchar(32);
ALTER TABLE `archive_chat_threads` 		MODIFY COLUMN changed varchar(32);
ALTER TABLE `archive_chat_threads` 		MODIFY COLUMN deleted varchar(32);

update `archive_chat_threads` set created = UNIX_TIMESTAMP(created);
update `archive_chat_threads` set changed = UNIX_TIMESTAMP(changed);
update `archive_chat_threads` set deleted = UNIX_TIMESTAMP(deleted);

ALTER TABLE `archive_chat_threads` 		MODIFY COLUMN created bigint(20) UNSIGNED NOT NULL;
ALTER TABLE `archive_chat_threads` 		MODIFY COLUMN changed bigint(20) UNSIGNED NOT NULL;
ALTER TABLE `archive_chat_threads` 		MODIFY COLUMN deleted bigint(20) UNSIGNED NOT NULL;





-- --------------------------------------------------------------------------------------------

-- 	cversion pour les chat_threads - PIP 2021-03-01 - PVH

ALTER TABLE `chat_phylacteries` ADD COLUMN `seqid` int(8) UNSIGNED NOT NULL DEFAULT 0 AFTER `cue`;
ALTER TABLE `archive_chat_phylacteries` ADD COLUMN `seqid` int(8) UNSIGNED NOT NULL DEFAULT 0 AFTER `cue`;

-- AJOUTER UNE CLE groupID sur les table chat_visirefs et archive_chat_visirefs

INSERT INTO archive_chat_visirefs 		SELECT * FROM chat_visirefs 		WHERE chat_visirefs.groupId  	not in (select distinct groupId as id from chat_participants where cueOut = 0);
INSERT INTO archive_chat_phylacteries 	SELECT * FROM chat_phylacteries 	WHERE chat_phylacteries.groupId  not in (select distinct groupId as id from chat_participants where cueOut = 0);
INSERT INTO archive_chat_participants 	SELECT * FROM chat_participants 	WHERE chat_participants.groupId  not in (select distinct groupId as id from chat_participants where cueOut = 0);
INSERT INTO archive_chat_threads 		SELECT * FROM chat_threads 			WHERE chat_threads.id  	not in (select distinct groupId as id from chat_participants where cueOut = 0);


DELETE FROM chat_visirefs 		WHERE chat_visirefs.groupId  not in (select distinct groupId as id from chat_participants where cueOut = 0);
DELETE FROM chat_phylacteries 	WHERE chat_phylacteries.groupId  not in (select distinct groupId as id from chat_participants where cueOut = 0);
DELETE FROM chat_threads 		WHERE chat_threads.id  not in (select distinct groupId as id from chat_participants where cueOut = 0);
DELETE FROM chat_participants 	WHERE chat_participants.groupId not in (select distinct id as id from chat_threads);
			
UPDATE archive_chat_threads SET archived = 1;



-- --------------------------------------------------------------------------------------------

-- 	cversion pour les chat_threads - PIP 2020-12-18 - PVH

ALTER TABLE `chat_threads` ADD COLUMN `cversion` int(8) UNSIGNED NOT NULL DEFAULT 0 AFTER `cssTags`;
ALTER TABLE `archive_chat_threads` ADD COLUMN `cversion` int(8) UNSIGNED NOT NULL DEFAULT 0 AFTER `cssTags`;



-- --------------------------------------------------------------------------------------------

-- 	public $cfgversion; // configuration version, when client call the server, this version is compared with client version, if not matching, the client should reload the config


ALTER TABLE `groups` ADD COLUMN `cfgversion` smallint(2) UNSIGNED NOT NULL DEFAULT 0 AFTER `language`;


-- -----------------------------------------------------------------------------------------------------

-- creating the checklist object, street stats table, address in reservations option, remoteId in reservations


-- chekclists and their linking

DROP TABLE IF EXISTS `checklists`;
CREATE TABLE `checklists` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  
  `clname` varchar(64) NOT NULL DEFAULT '',
  `clguideline` text NOT NULL DEFAULT '',
  `cltext` text NOT NULL DEFAULT '',
  `cltag` smallint(6) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=55000000 DEFAULT CHARSET=utf8mb4;


ALTER TABLE `workcodes` ADD COLUMN `checklistid` bigint(20) unsigned NOT NULL DEFAULT '0' AFTER `ereservable`;

ALTER TABLE `performances` ADD COLUMN `checklist` text NOT NULL DEFAULT '' AFTER `visitorId`;
ALTER TABLE `archive_performances` ADD COLUMN `checklist` text NOT NULL DEFAULT '' AFTER `visitorId`;


-- adding appointment address for reservations

ALTER TABLE `groups` ADD COLUMN `useappaddress` tinyint(3) unsigned NOT NULL DEFAULT '0' AFTER `usefiles`;


ALTER TABLE `reservations` ADD COLUMN `company` varchar(64) NOT NULL DEFAULT '' AFTER `bookingcode`;
ALTER TABLE `reservations` ADD COLUMN `residence` varchar(64) NOT NULL DEFAULT '' AFTER `company`;
ALTER TABLE `reservations` ADD COLUMN `address` varchar(128) NOT NULL DEFAULT '' AFTER `residence`;
ALTER TABLE `reservations` ADD COLUMN `zipCode` varchar(8) NOT NULL DEFAULT '' AFTER `address`;
ALTER TABLE `reservations` ADD COLUMN `city` varchar(64) NOT NULL DEFAULT '' AFTER `zipCode`;
ALTER TABLE `reservations` ADD COLUMN `country` varchar(32) NOT NULL DEFAULT '' AFTER `city`;


ALTER TABLE `archive_reservations` ADD COLUMN `company` varchar(64) NOT NULL DEFAULT '' AFTER `bookingcode`;
ALTER TABLE `archive_reservations` ADD COLUMN `residence` varchar(64) NOT NULL DEFAULT '' AFTER `company`;
ALTER TABLE `archive_reservations` ADD COLUMN `address` varchar(128) NOT NULL DEFAULT '' AFTER `residence`;
ALTER TABLE `archive_reservations` ADD COLUMN `zipCode` varchar(8) NOT NULL DEFAULT '' AFTER `address`;
ALTER TABLE `archive_reservations` ADD COLUMN `city` varchar(64) NOT NULL DEFAULT '' AFTER `zipCode`;
ALTER TABLE `archive_reservations` ADD COLUMN `country` varchar(32) NOT NULL DEFAULT '' AFTER `city`;


-- managing remote creation of reservations

ALTER TABLE `reservations` ADD COLUMN `remoteid` varchar(128) NOT NULL DEFAULT '' AFTER `peerId`;
ALTER TABLE `reservations` ADD COLUMN `remoteProfile` bigint(20) UNSIGNED NOT NULL DEFAULT '0' AFTER `remoteid`;

ALTER TABLE `archive_reservations` ADD COLUMN `remoteid` varchar(128) NOT NULL DEFAULT '' AFTER `peerId`;
ALTER TABLE `archive_reservations` ADD COLUMN `remoteProfile` bigint(20) UNSIGNED NOT NULL DEFAULT '0' AFTER `remoteid`;



-- address statistics

DROP TABLE IF EXISTS `stat_addresses`;
CREATE TABLE `stat_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  
  `street` varchar(64) NOT NULL DEFAULT '',
  `zipCode` varchar(8) NOT NULL DEFAULT '',
  `city` varchar(64) NOT NULL DEFAULT '',
  `country` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`groupId`),
  KEY `bystreet_idx` (`street`,`city`,`zipCode`)
) ENGINE=MyISAM AUTO_INCREMENT=20000000 DEFAULT CHARSET=utf8mb4;









-- -----------------------------------------------------------------------------------------------------

-- improving chat polling query - PIP on dec 20 / 2018

ALTER TABLE chat_participants DROP INDEX cparts_idx_byGroup;
ALTER TABLE chat_participants DROP INDEX cparts_idx_byLogin;
ALTER TABLE chat_participants DROP INDEX cparts_idx_byCue;
CREATE INDEX cparts_idx_byGroup ON chat_participants (groupId, id);
CREATE INDEX cparts_idx_byLogin ON chat_participants (loginId, cueOut);
CREATE INDEX cparts_idx_byCue ON chat_participants (groupId, loginId, cueOut);



-- tags collections - PIP on dec 16 / 2018

ALTER TABLE visitors CHANGE `registration` varchar(64) NOT NULL DEFAULT '';

ALTER TABLE groups CHANGE `urgencies` `usestandbylist` tinyint(3) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `groups` ADD COLUMN `tag` smallint(6) unsigned NOT NULL DEFAULT '0' AFTER `pattern`;
ALTER TABLE `resources` ADD COLUMN `tag` smallint(6) unsigned NOT NULL DEFAULT '0' AFTER `color`;
ALTER TABLE `timeboxings` ADD COLUMN `tag` smallint(6) unsigned NOT NULL DEFAULT '0' AFTER `pattern`;
ALTER TABLE `workcodes` ADD COLUMN `tag` smallint(6) unsigned NOT NULL DEFAULT '0' AFTER `cssPattern`;



-- chat bullet has custom color


ALTER TABLE `logins` ADD COLUMN `color` smallint(6) unsigned NOT NULL DEFAULT '0' AFTER `note`;

update logins
inner join accesskeys on accesskeys.groupId = logins.id
set color = 103 
where logins.accessLevel = 5 
and accesskeys.accountId in (3450,2985,2891,2975,2957,2981,2972,2912,2958,2905,2971,2883,2994,2976,2963,2959,2961,2900,2887,2970,2968,2967
				,2965,2969,2899,2903,2977,2973,2896,2991,2980,2984,2983,2986,2890,2889,2974,2894,2895,2904,2978,2902,2906,2897,2982,2987,2962,2966
				,2888,3038,2782,2933,3944,2935,3613,2956,2808,3004,3083,3678,2884,3752,3505,3524,3531,3558,3688,3523,3601,3609,2898,2946,3661,3675
				,3680,3676,3697,3679,3771,3677,3767,4015,4228,3825,3881,3815,4203,3945,3982,3992,4296,4020,3042,4204,4014,4053,4052,4211,4105,4210
				,2861,4239,3010,4262,4099,4185,3603,4266,4291,4298,3712,4297,4333,4336,4332,4182);


				
-- booking code for h4d


ALTER TABLE `reservations` ADD COLUMN `bookingcode` bigint(20) UNSIGNED NOT NULL default 0 AFTER `sprev`;
ALTER TABLE `archive_reservations` ADD COLUMN `bookingcode` bigint(20) UNSIGNED NOT NULL default 0 AFTER `sprev`;



-- pre-booking delay mechanism, scope of api setup for h4d


-- NE PAS OUBLIER LA MINUTE CRON EN MODE TEST

DROP TABLE IF EXISTS `prebooking_delays`;
CREATE TABLE `prebooking_delays` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `reservationId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `delay` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `prebookbyresa_idx` (`reservationId`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=utf8mb4;




-- e-resa in the same day  -- PAS SUR SIGMA


ALTER TABLE `logins` ADD COLUMN `eresaBlacklist` bigint(20) UNSIGNED NOT NULL default 0 AFTER `eresaAuthent`;
ALTER TABLE `logins` ADD COLUMN `eresaWithAMPM` tinyint(1) UNSIGNED NOT NULL default 1 AFTER `eresaBefore`;

ALTER TABLE `logins` ADD COLUMN `eresaSameday` tinyint(3) UNSIGNED NOT NULL default 1 AFTER `eresaBefore`;
ALTER TABLE `logins` ADD COLUMN `eresaAllowNote` tinyint(1) UNSIGNED NOT NULL default 1 AFTER `eresaSameday`;




-- Fix default values feature for tags (set of ids instead of one unique id) defaultCss  -- PAS SUR SIGMA


ALTER TABLE `groups` CHANGE COLUMN defaultCssAppTag defaultCssAppTag text NOT NULL default '';
ALTER TABLE `groups` CHANGE COLUMN defaultCssEventTag defaultCssEventTag text NOT NULL default '';
ALTER TABLE `groups` CHANGE COLUMN defaultCssFcalTag defaultCssFcalTag text NOT NULL default '';
ALTER TABLE `groups` CHANGE COLUMN defaultCssVisitorTag defaultCssVisitorTag text NOT NULL default '';

ALTER TABLE `groups` CHANGE COLUMN defaultCssNoteTag defaultCssNoteTag text NOT NULL default '';
ALTER TABLE `groups` CHANGE COLUMN defaultCssTaskTag defaultCssTaskTag text NOT NULL default '';
ALTER TABLE `groups` CHANGE COLUMN defaultCssChatTag defaultCssChatTag text NOT NULL default '';
ALTER TABLE `groups` CHANGE COLUMN defaultCssFileTag defaultCssFileTag text NOT NULL default '';


update groups set defaultCssAppTag = '';
update groups set defaultCssEventTag = '';
update groups set defaultCssFcalTag = '';
update groups set defaultCssVisitorTag = '';

update groups set defaultCssNoteTag = '';
update groups set defaultCssTaskTag = '';
update groups set defaultCssChatTag = '';
update groups set defaultCssFileTag = '';



-- Upgrade 2017-09-01 - Cronofy  -- PAS SUR SIGMA



DROP TABLE IF EXISTS `cronofy_user`;
CREATE TABLE `cronofy_user` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  
  `cro_account_id` varchar(64) NOT NULL,
  `cro_access_token` varchar(64) NOT NULL,
  `cro_refresh_token` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8mb4;



DROP TABLE IF EXISTS `cronofy_profile`;
CREATE TABLE `cronofy_profile` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  
  `cro_profile_id` varchar(64) NOT NULL,
  `cro_provider_name` varchar(64) NOT NULL,
  `cro_profile_name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`groupId`)
  
) ENGINE=MyISAM AUTO_INCREMENT=200000 DEFAULT CHARSET=utf8mb4;



DROP TABLE IF EXISTS `cronofy_accesses`;
CREATE TABLE `cronofy_accesses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  
  `keyId` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`groupId`)
  
) ENGINE=MyISAM AUTO_INCREMENT=300000 DEFAULT CHARSET=utf8mb4;



DROP TABLE IF EXISTS `cronofy_calendar`;
CREATE TABLE `cronofy_calendar` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  
  `resourceId` varchar(64) NOT NULL,
  `cro_calendar_id` varchar(64) NOT NULL,
  `cro_channel_id` varchar(64) DEFAULT NULL,
  `initStatus` int(11) NOT NULL,
  `permission` int(11) NOT NULL,
  
  PRIMARY KEY (`id`,`groupId`)
  
) ENGINE=MyISAM AUTO_INCREMENT=400000 DEFAULT CHARSET=utf8mb4;

  
  
DROP TABLE IF EXISTS `cronofy_inittasks`;
CREATE TABLE `cronofy_inittasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` int(11) NOT NULL,
  `startDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `endDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `groupId` int(11) NOT NULL,
  `refresh` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4;


  
  
  
  
  
  
  
  
  

-- Upgrade 2017-03-15
-- ALTER TABLE `visitors` ADD COLUMN `mergedTo` bigint(20) NOT NULL default 0 AFTER `deletorId`; -- ok sur SIGMA aussi





-- Upgrade TBP
-- alter table templates_sms CHANGE COLUMN triggerClass triggerClass tinyint(4) signed NOT NULL default 1;
-- alter table templates_email CHANGE COLUMN triggerClass triggerClass tinyint(4) signed NOT NULL default 1;

-- update templates_sms set triggerClass = triggerId;
-- update templates_email set triggerClass = triggerId;

-- update templates_sms set triggerClass = -1 where triggerClass = 90; -- former special 90:'h-x reminder'

-- update templates_sms set triggerClass = -2 where triggerClass = 1; -- former 1:'reminder eve'
-- update templates_sms set triggerClass = -2 where triggerClass = 2;
-- update templates_sms set triggerClass = -2 where triggerClass = 3;
-- update templates_sms set triggerClass = -2 where triggerClass = 4;
-- update templates_sms set triggerClass = -3 where triggerClass = 7;
-- update templates_sms set triggerClass = -3 where triggerClass = 14;

-- update templates_sms set triggerClass = 2 where triggerClass = -1; -- former '-1':'revival one day'
-- update templates_sms set triggerClass = 2 where triggerClass = -7;
-- update templates_sms set triggerClass = 3 where triggerClass = -14;
-- update templates_sms set triggerClass = 3 where triggerClass = -28;
-- update templates_sms set triggerClass = 4 where triggerClass = -91;
-- update templates_sms set triggerClass = 4 where triggerClass = -128; -- ther is nothing above -128 because it is tinyint(4)


-- update templates_email set triggerClass = -1 where triggerClass = 90; -- former special 90:'h-x reminder'

-- update templates_email set triggerClass = -2 where triggerClass = 1; -- former 1:'reminder eve'
-- update templates_email set triggerClass = -2 where triggerClass = 2;
-- update templates_email set triggerClass = -2 where triggerClass = 3;
-- update templates_email set triggerClass = -2 where triggerClass = 4;
-- update templates_email set triggerClass = -3 where triggerClass = 7;
-- update templates_email set triggerClass = -3 where triggerClass = 14;

-- update templates_email set triggerClass = 2 where triggerClass = -1; -- former '-1':'revival one day'
-- update templates_email set triggerClass = 2 where triggerClass = -7;
-- update templates_email set triggerClass = 3 where triggerClass = -14;
-- update templates_email set triggerClass = 3 where triggerClass = -28;
-- update templates_email set triggerClass = 4 where triggerClass = -91;
-- update templates_email set triggerClass = 4 where triggerClass = -128; -- ther is nothing above -128 because it is tinyint(4)


