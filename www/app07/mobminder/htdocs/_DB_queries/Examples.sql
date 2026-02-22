


ALTER TABLE `logins` ADD COLUMN `eresaLimit` tinyint(3) NOT NULL default 0 AFTER `eresaMax`;

ALTER TABLE `logins` ADD COLUMN `eresaBefore` int(10) NOT NULL default 9472539 AFTER `eresaLimit`;
UPDATE groups SET notbefore = (notbefore+134217728);

ALTER TABLE `logins` ADD COLUMN `eresaHourlies` varchar(1024) NOT NULL default '' AFTER `eresaNote`;
ALTER TABLE `logins` ADD COLUMN `eresaDirections` varchar(1024) NOT NULL default '' AFTER `eresaHourlies`;


ALTER TABLE `logins` CHANGE COLUMN eresaLinklabel eresaLink1label varchar(64) NOT NULL default '';
ALTER TABLE `logins` CHANGE COLUMN eresaLinkUrl eresaLink1url varchar(128) NOT NULL default '';

ALTER TABLE `logins` ADD COLUMN `eresaLink2label` varchar(64) NOT NULL default '' AFTER `eresaLink1url`;
ALTER TABLE `logins` ADD COLUMN `eresaLink2url` varchar(128) NOT NULL default '' AFTER `eresaLink2label`;

ALTER TABLE `logins` ADD COLUMN `eresaFontTitle` varchar(32) NOT NULL default '' AFTER `eresaPalette`;
ALTER TABLE `logins` ADD COLUMN `eresaFontText` varchar(32) NOT NULL default '' AFTER `eresaFontTitle`;

ALTER TABLE `logins` ADD COLUMN `eresaDirLabel` varchar(64) NOT NULL default '' AFTER `eresaDirections`;
ALTER TABLE `logins` ADD COLUMN `eresaDirUrl` varchar(128) NOT NULL default '' AFTER `eresaDirLabel`;

ALTER TABLE `logins` ADD COLUMN `eresaSameday` tinyint(3) NOT NULL default 1 AFTER `eresaBefore`;



--- Replace the youtube so to keep only the video id (usefull in translations DB table, for video language switching)

update translations set xl_en = REPLACE(xl_en,"https://www.youtube.com/watch?v=","");
update translations set xl_fr = REPLACE(xl_fr,"https://www.youtube.com/watch?v=","");
update translations set xl_nl = REPLACE(xl_nl,"https://www.youtube.com/watch?v=","");


-----------------------------------------


alter table templates_sms CHANGE COLUMN triggerId triggerId smallint(6) signed NOT NULL default 1;

ALTER TABLE `visitors` CHANGE COLUMN adressLine1 address varchar(64) NOT NULL default '';
ALTER TABLE `logins` CHANGE COLUMN adressLine1 address varchar(64) NOT NULL default '';
ALTER TABLE `guidelines` CHANGE COLUMN adressLine1 address varchar(64) NOT NULL default '';
ALTER TABLE `contracts` CHANGE COLUMN adressLine1 address varchar(64) NOT NULL default '';

ALTER TABLE `visitors` ADD COLUMN `residence` varchar(64) NOT NULL default '' AFTER `address`;
ALTER TABLE `visitors` ADD COLUMN `company` varchar(32) NOT NULL default '' AFTER `lastname`;

ALTER TABLE `logins` ADD COLUMN `residence` varchar(64) NOT NULL default '' AFTER `address`;
ALTER TABLE `logins` ADD COLUMN `company` varchar(32) NOT NULL default '' AFTER `lastname`;

UPDATE catalysts SET fields = 'ccss!birthday!gender!firstname!lastname!mobile!zipCode!city';


ALTER TABLE `groups` ADD COLUMN `notbefore` bigint(20) NOT NULL default 8424222 AFTER `durationLongest`;
ALTER TABLE `groups` ADD COLUMN `package` tinyint(4) NOT NULL default 16 AFTER `deletorId`;

DROP TABLE IF EXISTS `connections`;
CREATE TABLE `connections` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,

  `accessKeyId` bigint(20) unsigned NOT NULL,
  `sessionId` varchar(256) NOT NULL,
  `agent` varchar(256) NOT NULL,
  `ip` varchar(256) NOT NULL,
  `logintime` bigint(20) unsigned NOT NULL,
  `watchdogs` int(8) unsigned NOT NULL,
  `lastwdog` bigint(20) unsigned NOT NULL,
  
	`cnt_q_processing` int(8) unsigned NOT NULL, 	`perf_q_pk` int(8) unsigned NOT NULL, 	`perf_q_mean` int(8) unsigned NOT NULL,
	`cnt_p_processing` int(8) unsigned NOT NULL, 	`perf_p_pk` int(8) unsigned NOT NULL, 	`perf_p_mean` int(8) unsigned NOT NULL,
	`cnt_d_processing` int(8) unsigned NOT NULL, 	`perf_d_pk` int(8) unsigned NOT NULL, 	`perf_d_mean` int(8) unsigned NOT NULL,
	
	`cnt_q_config` int(8) unsigned NOT NULL, 	`perf_q_config_pk` int(8) unsigned NOT NULL,
	`cnt_q_emerg` int(8) unsigned NOT NULL,		`perf_q_emerg_pk` int(8) unsigned NOT NULL,
	`cnt_q_gender` int(8) unsigned NOT NULL,		`perf_q_gender_pk` int(8) unsigned NOT NULL,
	`cnt_q_login` int(8) unsigned NOT NULL,		`perf_q_login_pk` int(8) unsigned NOT NULL,
	`cnt_q_orphans` int(8) unsigned NOT NULL,	`perf_q_orphans_pk` int(8) unsigned NOT NULL,
	`cnt_q_plitems` int(8) unsigned NOT NULL,	`perf_q_plitems_pk` int(8) unsigned NOT NULL,
	`cnt_q_remote` int(8) unsigned NOT NULL,		`perf_q_remote_pk` int(8) unsigned NOT NULL,
	`cnt_q_search` int(8) unsigned NOT NULL,		`perf_q_search_pk` int(8) unsigned NOT NULL,
	`cnt_q_stats` int(8) unsigned NOT NULL,		`perf_q_stats_pk` int(8) unsigned NOT NULL,
	`cnt_q_alphatab` int(8) unsigned NOT NULL,	`perf_q_alphatab_pk` int(8) unsigned NOT NULL,
	`cnt_q_swap` int(8) unsigned NOT NULL,		`perf_q_swap_pk` int(8) unsigned NOT NULL,
	`cnt_q_visiapps` int(8) unsigned NOT NULL,	`perf_q_visiapps_pk` int(8) unsigned NOT NULL,
	`cnt_q_visitors` int(8) unsigned NOT NULL,	`perf_q_visitors_pk` int(8) unsigned NOT NULL,

	`cnt_p_config` int(8) unsigned NOT NULL,		`perf_p_config_pk` int(8) unsigned NOT NULL,
	`cnt_p_resa` int(8) unsigned NOT NULL,			`perf_p_resa_pk` int(8) unsigned NOT NULL,
	`cnt_p_rsc` int(8) unsigned NOT NULL,			`perf_p_rsc_pk` int(8) unsigned NOT NULL,
	`cnt_p_schedule` int(8) unsigned NOT NULL,		`perf_p_schedule_pk` int(8) unsigned NOT NULL,
	`cnt_p_shadow` int(8) unsigned NOT NULL,		`perf_p_shadow_pk` int(8) unsigned NOT NULL,
	`cnt_p_task` int(8) unsigned NOT NULL,			`perf_p_task_pk` int(8) unsigned NOT NULL,
	`cnt_p_note` int(8) unsigned NOT NULL,			`perf_p_note_pk` int(8) unsigned NOT NULL,
	`cnt_p_newacc` int(8) unsigned NOT NULL,		`perf_p_newacc_pk` int(8) unsigned NOT NULL,
	`cnt_p_login` int(8) unsigned NOT NULL,		`perf_p_login_pk` int(8) unsigned NOT NULL,
	`cnt_p_huser` int(8) unsigned NOT NULL,		`perf_p_huser_pk` int(8) unsigned NOT NULL,
	`cnt_p_tboxing` int(8) unsigned NOT NULL,		`perf_p_tboxing_pk` int(8) unsigned NOT NULL,
	`cnt_p_hourly` int(8) unsigned NOT NULL,		`perf_p_hourly_pk` int(8) unsigned NOT NULL,
	`cnt_p_gdlns` int(8) unsigned NOT NULL,		`perf_p_gdlns_pk` int(8) unsigned NOT NULL,
	`cnt_p_smst` int(8) unsigned NOT NULL,			`perf_p_smst_pk` int(8) unsigned NOT NULL,
	`cnt_p_emlt` int(8) unsigned NOT NULL,			`perf_p_emlt_pk` int(8) unsigned NOT NULL,
	`cnt_p_details` int(8) unsigned NOT NULL,		`perf_p_details_pk` int(8) unsigned NOT NULL,
	`cnt_p_ccss` int(8) unsigned NOT NULL,			`perf_p_ccss_pk` int(8) unsigned NOT NULL,
	`cnt_p_account` int(8) unsigned NOT NULL,		`perf_p_account_pk` int(8) unsigned NOT NULL,
	`cnt_p_wrkc` int(8) unsigned NOT NULL,			`perf_p_wrkc_pk` int(8) unsigned NOT NULL,
	
	`cnt_d_account` int(8) unsigned NOT NULL,		`perf_d_account_pk` int(8) unsigned NOT NULL,
	`cnt_d_ccss` int(8) unsigned NOT NULL,			`perf_d_ccss_pk` int(8) unsigned NOT NULL,
	`cnt_d_smst` int(8) unsigned NOT NULL,			`perf_d_smst_pk` int(8) unsigned NOT NULL,
	`cnt_d_emlt` int(8) unsigned NOT NULL,			`perf_d_emlt_pk` int(8) unsigned NOT NULL,
	`cnt_d_gdlns` int(8) unsigned NOT NULL,		`perf_d_gdlns_pk` int(8) unsigned NOT NULL,
	`cnt_d_shadow` int(8) unsigned NOT NULL,		`perf_d_shadow_pk` int(8) unsigned NOT NULL,
	`cnt_d_huser` int(8) unsigned NOT NULL,		`perf_d_huser_pk` int(8) unsigned NOT NULL,
	`cnt_d_tboxing` int(8) unsigned NOT NULL,		`perf_d_tboxing_pk` int(8) unsigned NOT NULL,
	`cnt_d_login` int(8) unsigned NOT NULL,		`perf_d_login_pk` int(8) unsigned NOT NULL,
	`cnt_d_resa` int(8) unsigned NOT NULL,			`perf_d_resa_pk` int(8) unsigned NOT NULL,
	`cnt_d_rsc` int(8) unsigned NOT NULL,			`perf_d_rsc_pk` int(8) unsigned NOT NULL,
	`cnt_d_wrkc` int(8) unsigned NOT NULL,			`perf_d_wrkc_pk` int(8) unsigned NOT NULL,
	
  PRIMARY KEY (`id`),
  KEY `conx_idx_byAccKey` (`groupId`, `accessKeyId`)
) ENGINE=MyISAM AUTO_INCREMENT=10000000 DEFAULT CHARSET=latin1;


ALTER TABLE `sms` CHANGE COLUMN correlator correlator varchar(64) NOT NULL default '';
ALTER TABLE `sms` CHANGE COLUMN r2correlator r2correlator varchar(64) NOT NULL default '';

ALTER TABLE `sms` ADD `r3correlator` varchar(64) NOT NULL default '';
ALTER TABLE `sms` ADD `r3status` varchar(64) NOT NULL default '';
ALTER TABLE `sms` ADD `r3statusChangeStamp` varchar(64) NOT NULL default '';

UPDATE sms SET r3status = 2 WHERE r2status <> 0;


-- --------------------------------------------------- MODIFICATION DU DESIGN DE LA TABLE COLORS
-- 1 changer nom de la table colors en custom_css


ALTER TABLE `colors` RENAME TO `custom_css`;


-- 2 dans la table reservations, changer le nom de la colonne colorOverloadId en css_appointment 

ALTER TABLE `reservations` CHANGE COLUMN colorOverloadId css_appointment  bigint(20) unsigned NOT NULL; 


-- 3 dans la table `custom_css`, changer le nom de la colonne color en css

ALTER TABLE `custom_css` CHANGE COLUMN color css smallint(6) unsigned NOT NULL default 0;


-- --------------------------------------------------- TYPE DES MESSAGES (emails ou sms)

-- MSG TRIGGERS:
-- 
-- On renomme la colonne triggerEvent en triggerClass
-- On utilise la colonne triggerEvent pour spécifier la classe du trigger. La classe par défaut étant 10 (class_resa_any)
-- Changer le nom de la table "reminders" en "templates_sms"
-- On renomme la colonne deliveryDayBefore en triggerId qui doit pouvoir contenir un id DB (BigInt) !!! <=

ALTER TABLE `reminders` RENAME TO `templates_sms`;

ALTER TABLE `templates_sms`  CHANGE COLUMN  triggerEvent triggerClass  tinyint(4) unsigned NOT NULL default 0;
UPDATE `templates_sms` SET triggerClass = 10;
ALTER TABLE `templates_sms` CHANGE COLUMN  deliveryDayBefore triggerId  bigint(20) unsigned NOT NULL; 



-- ---------------------------------------------------- CREATION TABLE POUR LES TEMPLATES d'e-MAILS


CREATE TABLE `templates_email` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`name` varchar(128) NOT NULL,
`subject` varchar(256) NOT NULL,
`message` text NOT NULL,
`advance` int(10) NOT NULL,
`deliveryTime` int(11) unsigned NOT NULL,
`triggerId` bigint(20) unsigned NOT NULL default 0,
`triggerClass` tinyint(3) unsigned NOT NULL default 10,
`target` tinyint(3) unsigned NOT NULL,
PRIMARY KEY  (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for emails logging
-- ----------------------------
CREATE TABLE `emails` (
  `id` bigint(20) unsigned NOT NULL auto_increment,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL default '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `changed` timestamp NOT NULL default '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `reservationId` bigint(20) unsigned NOT NULL,
  `reminderId` bigint(20) unsigned NOT NULL,
  `sendStamp` bigint(20) unsigned NOT NULL,
  `mailsubject` varchar(512) NOT NULL,
  `mailbody` text NOT NULL,
  `recipients` varchar(512) NOT NULL,
  `sender` varchar(128) NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `statusChangeStamp` bigint(20) unsigned NOT NULL,
  PRIMARY KEY  (`id`,`sendStamp`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;


-- ---------------------------------------------------- NEW SMS SENDING ALGORYTHM 

-- 28/08/2011 à 1H00

DELETE FROM sms WHERE sendStamp > 1314493200; 

-- ---------------------------------------------------- UNIFORMISATION resourceTypeId en resourceType


ALTER TABLE `attendees`  CHANGE COLUMN  resourceTypeId resourceType  tinyint(4) unsigned NOT NULL default 0;
ALTER TABLE `logins`  	CHANGE COLUMN  resourceTypeId resourceType  tinyint(4) unsigned NOT NULL default 0;



-- ----------------------------------------------------- GENERALISER STATUS ET COULEURS

-- ajouter deux champs cssType et resaClass initialisés à 80 et 11 et tinyint 4

ALTER TABLE `custom_css` ADD	cssType  tinyint(4) unsigned NOT NULL default 80;
ALTER TABLE `custom_css` ADD	resaClass  tinyint(4) unsigned NOT NULL default 11;

ALTER TABLE `groups` ADD COLUMN `profsector` smallint(5) unsigned NOT NULL  default 0 AFTER `deletorId`;
ALTER TABLE `groups` ADD COLUMN `GMT` smallint(6) signed NOT NULL  default 0 AFTER `profsector`;

-- Dans la table reservations il faut 
-- 	renommer css_spec_appointment en cssColor et 
-- 	ajouter cssPattern

ALTER TABLE `reservations`  CHANGE COLUMN  css_appointment cssColor bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `reservations` ADD	cssPattern  bigint(20) unsigned NOT NULL default 0;

-- create status for MAZUIN

INSERT INTO `custom_css` VALUES ('1097', '2781', '2011-08-27 13:59:37', 'Pascal Vanhove', '2011-08-27 13:59:37', 'Pascal Vanhove', 'Voiture sortie', '804', '', '81', '32');
INSERT INTO `custom_css` VALUES ('1098', '2781', '2011-08-27 13:59:49', 'Pascal Vanhove', '2011-08-27 13:59:49', 'Pascal Vanhove', 'Voiture rentrÃ©e', '800', '', '81', '32');
INSERT INTO `custom_css` VALUES ('1099', '2781', '2011-08-27 14:00:46', 'Pascal Vanhove', '2011-08-27 14:00:46', 'Pascal Vanhove', 'Voiture au parking', '807', '', '81', '11');
INSERT INTO `custom_css` VALUES ('1100', '2781', '2011-08-27 14:00:59', 'Pascal Vanhove', '2011-08-27 14:00:59', 'Pascal Vanhove', 'Voiture terminÃ©e', '800', '', '81', '11');

UPDATE `reservations` JOIN attendees ON reservations.id = attendees.groupId SET cssPattern = 1097 WHERE reservations.groupId = 2781 AND execStatus = 1 AND  resourceType = 4;
UPDATE `reservations` JOIN attendees ON reservations.id = attendees.groupId SET cssPattern = 1098 WHERE reservations.groupId = 2781 AND execStatus = 2 AND  resourceType = 4;
UPDATE `reservations` JOIN attendees ON reservations.id = attendees.groupId SET cssPattern = 1099 WHERE reservations.groupId = 2781 AND execStatus = 1 AND  resourceType = 2;
UPDATE `reservations` JOIN attendees ON reservations.id = attendees.groupId SET cssPattern = 1100 WHERE reservations.groupId = 2781 AND execStatus = 2 AND  resourceType = 2;


-- create status for PNC

INSERT INTO `custom_css` VALUES ('1101', '2805', '2011-08-27 14:00:59', 'Pascal Vanhove', '2011-08-27 14:00:59', 'Pascal Vanhove', 'RDV honorÃ©', '800', '', '81', '11');
UPDATE `reservations` SET cssPattern = 1101 WHERE groupId = 2805 AND execStatus = 2;


-- create status for BT perfection

INSERT INTO `custom_css` VALUES ('1102', '2796', '2011-08-27 14:00:59', 'Pascal Vanhove', '2011-08-27 14:00:59', 'Pascal Vanhove', 'RDV honorÃ©', '800', '', '81', '11');
UPDATE `reservations` SET cssPattern = 1102 WHERE groupId = 2796 AND execStatus = 2;


-- create status for Lousse

INSERT INTO `custom_css` VALUES ('1103', '2812', '2011-08-27 14:00:59', 'Pascal Vanhove', '2011-08-27 14:00:59', 'Pascal Vanhove', 'RDV honorÃ©', '800', '', '81', '11');
UPDATE `reservations` SET cssPattern = 1103 WHERE groupId = 2812 AND execStatus = 2;


-- dans la table groupe ajouter les six champs bigint:
-- defaultCssAppColor	bigint	20
-- defaultCssAppPattern	bigint	20	
-- defaultCssEventColor	bigint	20	
-- defaultCssEventPattern	bigint	20	
-- defaultCssFcalColor	bigint	20	
-- defaultCssFcalPattern	bigint	20	


ALTER TABLE `groups` ADD	`defaultCssAppColor`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD	`defaultCssAppPattern`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD	`defaultCssEventColor`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD	`defaultCssEventPattern`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD	`defaultCssFcalColor`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD	`defaultCssFcalPattern`  bigint(20) unsigned NOT NULL default 0;






-- ------------------------------------------------------------------------------------

-- Ajouter la table comm_toggles


CREATE TABLE `comm_toggles` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`msgMedium` tinyint(4) unsigned NOT NULL,
`reservationId` bigint(20) unsigned NOT NULL,
`templateId` bigint(20) unsigned NOT NULL,
PRIMARY KEY  (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=244476 DEFAULT CHARSET=latin1;



-- -----------------------------------------------------------------------------------

-- MERGE DE LA TABLE visitors avec la table persons
-- 
-- 1. Design: Copier les champs de la table persons dans la table visitors. 
-- 

ALTER TABLE `visitors` ADD `gender` tinyint(3) unsigned NOT NULL default 1;
ALTER TABLE `visitors` ADD `firstname` varchar(64) NOT NULL default '';
ALTER TABLE `visitors` ADD `lastname` varchar(64) NOT NULL default '';
ALTER TABLE `visitors` ADD `addressLine1` varchar(128) NOT NULL default '';
ALTER TABLE `visitors` ADD `zipCode` varchar(8) NOT NULL default '';
ALTER TABLE `visitors` ADD `city` varchar(32) NOT NULL default '';
ALTER TABLE `visitors` ADD `country` varchar(32) NOT NULL default '';
ALTER TABLE `visitors` ADD `email` varchar(64) NOT NULL default '';
ALTER TABLE `visitors` ADD `mobile` varchar(32) NOT NULL default '';
ALTER TABLE `visitors` ADD `phone` varchar(32) NOT NULL default '';
ALTER TABLE `visitors` ADD `language` tinyint(3) unsigned NOT NULL default 0;


SET FOREIGN_KEY_CHECKS=0;



ALTER TABLE `visitors` ADD `birthday` bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `visitors` ADD `registration` varchar(32) NOT NULL default '';
ALTER TABLE `visitors` ADD `note` text NOT NULL default '';

-- 2. Populer les nouvelles colonnes en ramenant dans visitors les valeurs anciennement stckées dans persons. 
--
UPDATE mobminder.visitors 
		JOIN mobminder.persons 
		ON   mobminder.persons.id = mobminder.visitors.personId
		SET visitors.gender = persons.gender, 
			visitors.firstname = persons.firstname,
			visitors.lastname = persons.lastname,
			visitors.addressLine1 = persons.addressLine1,
			visitors.zipCode = persons.zipCode,
			visitors.city = persons.city,
			visitors.country = persons.country,
			visitors.email = persons.email,
			visitors.mobile = persons.mobile,
			visitors.phone = persons.phone,
			visitors.language = persons.language,
			visitors.birthday = persons.birthday,
			visitors.registration = persons.registration,
			visitors.note = persons.note
			;


-- 3. Dans la table tasks, on travaillera donc désormais avec un visitorId et non plus avec un personId
-- 	noter qu'ici on a du transvaser la donner visitorId via la table 'persons' (sinon le script prenait 6 heures)

DELETE FROM mobminder.visitors WHERE visitors.personId = 0; -- nettoyage de très anciennes données de test (une 20aines d'incohérentes)

ALTER TABLE `tasks` ADD `visitorId`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `persons` ADD	`visitorId`  bigint(20) unsigned NOT NULL default 0;

UPDATE mobminder.persons JOIN mobminder.visitors ON visitors.personId = persons.id SET persons.visitorId = visitors.id WHERE persons.groupType = 7;
UPDATE mobminder.tasks JOIN mobminder.persons ON persons.Id = tasks.personId SET tasks.visitorId = persons.visitorId WHERE tasks.personId <> 0;

ALTER TABLE `tasks`  DROP personId;
ALTER TABLE `persons`  DROP visitorId;
ALTER TABLE `visitors`  DROP personId;


-- 4. Enfin, on purge la table persons de toutes les infos se rapportant à un visiteur.

DELETE FROM mobminder.persons WHERE persons.groupType = 7;

-- -----------------------------------------------------------------------------------

-- AJOUTER LES COULEURS ET PATTERNS DANS LA TABLE VISITORS

ALTER TABLE `visitors` ADD `cssColor`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `visitors` ADD `cssPattern`  bigint(20) unsigned NOT NULL default 0;


ALTER TABLE `groups` ADD `defaultCssVisitorColor`  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD `defaultCssVisitorPattern`  bigint(20) unsigned NOT NULL default 0;


-- AJOUTER LA TABLE DE VARIABLES GLOBALES, insertion d'une date pivot de backup au 12/6/2011

CREATE TABLE `globals` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`backupPivot` bigint(20) unsigned NOT NULL,
PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

INSERT INTO `globals` VALUES ('0', '1312160400');


-- ARCHIVE SPLIT reservations and attendees and tasks

CREATE TABLE archive_reservations SELECT * FROM reservations;
ALTER TABLE  archive_reservations ADD PRIMARY KEY  (`id`,`groupId`);

CREATE TABLE archive_attendees SELECT * FROM attendees;
ALTER TABLE  archive_attendees ADD PRIMARY KEY  (`id`,`groupId`);

CREATE TABLE archive_tasks SELECT * FROM tasks;
ALTER TABLE  archive_tasks ADD PRIMARY KEY  (`id`,`groupId`);


DELETE FROM archive_reservations WHERE cueOut > 1312160400;
DELETE FROM archive_attendees WHERE groupId NOT IN ( SELECT id FROM archive_reservations);
DELETE FROM archive_tasks WHERE groupId NOT IN ( SELECT id FROM archive_reservations);

DELETE FROM reservations WHERE cueOut < 1312160400;
DELETE FROM attendees WHERE groupId NOT IN ( SELECT id FROM reservations);
DELETE FROM tasks WHERE groupId NOT IN ( SELECT id FROM reservations);


-- add a tag that allows to track dataSet origin

ALTER TABLE `reservations` ADD `archived`  tinyint(1) unsigned NOT NULL default 0;
ALTER TABLE `attendees` ADD `archived`  tinyint(1) unsigned NOT NULL default 0;
ALTER TABLE `tasks` ADD `archived`  tinyint(1) unsigned NOT NULL default 0;
ALTER TABLE `archive_reservations` ADD `archived`  tinyint(1) unsigned NOT NULL default 1;
ALTER TABLE `archive_attendees` ADD `archived`  tinyint(1) unsigned NOT NULL default 1;
ALTER TABLE `archive_tasks` ADD `archived`  tinyint(1) unsigned NOT NULL default 1;

-- -----------------------------------------------------------------------------------

-- ----------------------------
-- Table structure for `custom_css`
-- ----------------------------
DROP TABLE IF EXISTS `custom_css`;
CREATE TABLE `custom_css` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `name` varchar(128) NOT NULL,
  `css` smallint(6) unsigned NOT NULL DEFAULT '0',
  `note` text NOT NULL,
  `cssType` tinyint(4) unsigned NOT NULL DEFAULT '80',
  `resaClass` tinyint(4) unsigned NOT NULL DEFAULT '11',
  PRIMARY KEY (`id`,`groupId`),
  KEY `ccss_idx_bygroup` (`groupId`),
  KEY `ccss_idx_byCreation` (`created`),
  KEY `ccss_idx_byChange` (`changed`),
  KEY `ccss_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=2340 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `timeboxings`;
CREATE TABLE `timeboxings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `name` varchar(128) NOT NULL,
  `color` smallint(6) unsigned NOT NULL DEFAULT '0',
  `pattern` smallint(6) unsigned NOT NULL DEFAULT '0',
  `note` text NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `tbox_idx_bygroup` (`groupId`),
  KEY `tbox_idx_byCreation` (`created`),
  KEY `tbox_idx_byChange` (`changed`),
  KEY `tbox_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `timeboxes`;
CREATE TABLE `timeboxes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `timeboxingId` bigint(20) unsigned NOT NULL,
  `cueIn` bigint(11) unsigned NOT NULL,
  `cueOut` bigint(11) unsigned NOT NULL,
  `dayCode` tinyint(4) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `tbox_idx_bygroup` (`groupId`),
  KEY `tbox_idx_byboxing` (`timeboxingId`)
) ENGINE=MyISAM AUTO_INCREMENT=1100000 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `worktboxing`;
CREATE TABLE `worktboxing` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `timeboxingId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `wtbox_idx_bygroup` (`groupId`),
  KEY `wtbox_idx_byboxing` (`timeboxingId`)
) ENGINE=MyISAM AUTO_INCREMENT=500000 DEFAULT CHARSET=latin1;




-- clean up calendars

DROP TABLE `calendars`;
DROP TABLE `calendarsusers`;

-- Resaparts

CREATE TABLE `resaparts` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`cueIn` bigint(20) unsigned NOT NULL default 0,
`cueOut` bigint(20) unsigned NOT NULL default 0,
`archived` tinyint(1) unsigned NOT NULL default 0,
PRIMARY KEY  (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=500000 DEFAULT CHARSET=latin1;

CREATE TABLE `archive_resaparts` (
`id` bigint(20) unsigned NOT NULL,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`cueIn` bigint(20) unsigned NOT NULL default 0,
`cueOut` bigint(20) unsigned NOT NULL default 0,
`archived` tinyint(1) unsigned NOT NULL default 0,
PRIMARY KEY  (`id`,`groupId`)
)  ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `reservations`  CHANGE COLUMN  execStatus iscluster tinyint(4) unsigned NOT NULL default 0;
ALTER TABLE `archive_reservations`  CHANGE COLUMN  execStatus iscluster tinyint(4) unsigned NOT NULL default 0;

UPDATE `reservations` SET iscluster = 0;
UPDATE `archive_reservations` SET iscluster = 0;

-- Renaming of some fields

ALTER TABLE `groups` CHANGE COLUMN reminderReplyMobile smsSenderId varchar(16) NOT NULL;
ALTER TABLE `groups` CHANGE COLUMN neverSooner rangeIn mediumint unsigned NOT NULL default 36000;
ALTER TABLE `groups` CHANGE COLUMN neverLater rangeOut mediumint unsigned NOT NULL default 72000;


-- Indexing tables

CREATE INDEX genders_idx ON stat_genders (name);

CREATE INDEX resas_idx_bycues ON reservations (groupId, cueIn, cueOut);
CREATE INDEX resas_idx_bycues ON archive_reservations (groupId, cueIn, cueOut);

CREATE INDEX attendees_idx_bygroup ON attendees (groupId);
CREATE INDEX attendees_idx_bygroup ON archive_attendees (groupId);
CREATE INDEX attendees_idx_byresc ON attendees (resourceId);
CREATE INDEX attendees_idx_byresc ON archive_attendees (resourceId);

CREATE INDEX resaparts_idx_bygroup ON resaparts (groupId);
CREATE INDEX attendees_idx_bygroup ON archive_resaparts (groupId);
CREATE INDEX tasks_idx_bygroup ON tasks (groupId);

CREATE INDEX visi_idx_byGroup ON visitors (groupId);

CREATE INDEX sms_idx_byResa ON sms (reservationId);
CREATE INDEX sms_idx_byTempl ON sms (reservationId, templateId);
CREATE INDEX sms_idx_issent ON sms (reservationId, templateId, resourceId);

CREATE INDEX eml_idx_byResa ON emails (reservationId);
CREATE INDEX eml_idx_byTempl ON emails (reservationId, templateId);
CREATE INDEX eml_idx_issent ON emails (reservationId, templateId, resourceId);

CREATE INDEX comm_idx_byResa ON comm_toggles (reservationId);
CREATE INDEX comm_idx_byTempl ON comm_toggles (reservationId, templateId, msgMedium, resourceId);

CREATE INDEX hourlies_idx_bygroup ON hourlies (groupId);
CREATE INDEX shadows_idx_bygroup ON shadows (groupId);
CREATE INDEX husers_idx_bygroup ON hourliesusers (groupId);

CREATE INDEX resc_idx_bygroup ON resources (groupId);
CREATE INDEX wrks_idx_bygroup ON workcodes (groupId);
CREATE INDEX tsms_idx_bygroup ON templates_sms (groupId);
CREATE INDEX teml_idx_bygroup ON templates_email (groupId);
CREATE INDEX logins_idx_bygroup ON logins (groupId);
CREATE INDEX details_idx_bygroup ON details (groupId);
CREATE INDEX ccss_idx_bygroup ON custom_css (groupId); 
CREATE INDEX contr_idx_bygroup ON contracts (groupId);


-- Merging logins and persons

ALTER TABLE `logins` ADD `gender` tinyint(3) unsigned NOT NULL default 1;
  ALTER TABLE `logins` ADD `firstname` varchar(64) NOT NULL;
  ALTER TABLE `logins` ADD `lastname` varchar(64) NOT NULL;
  ALTER TABLE `logins` ADD `addressLine1` varchar(128) NOT NULL;
  ALTER TABLE `logins` ADD `zipCode` varchar(8) NOT NULL;
  ALTER TABLE `logins` ADD `city` varchar(32) NOT NULL;
  ALTER TABLE `logins` ADD `country` varchar(32) NOT NULL;
  ALTER TABLE `logins` ADD `email` varchar(64) NOT NULL;
  ALTER TABLE `logins` ADD `mobile` varchar(32) NOT NULL;
  ALTER TABLE `logins` ADD `phone` varchar(32) NOT NULL;
  ALTER TABLE `logins` ADD `language` tinyint(3) unsigned NOT NULL default 0;
  ALTER TABLE `logins` ADD `registration` varchar(32) NOT NULL;
  ALTER TABLE `logins` ADD `note` text NOT NULL;
  ALTER TABLE `logins` ADD `bCals` text NOT NULL;
  ALTER TABLE `logins` ADD `uCals` text NOT NULL;
  ALTER TABLE `logins` ADD `fCals` text NOT NULL;


-- Merging contracts and persons

ALTER TABLE `contracts` ADD `gender` tinyint(3) unsigned NOT NULL default 1;
  ALTER TABLE `contracts` ADD `firstname` varchar(64) NOT NULL;
  ALTER TABLE `contracts` ADD `lastname` varchar(64) NOT NULL;
  ALTER TABLE `contracts` ADD `addressLine1` varchar(128) NOT NULL;
  ALTER TABLE `contracts` ADD `zipCode` varchar(8) NOT NULL;
  ALTER TABLE `contracts` ADD `city` varchar(32) NOT NULL;
  ALTER TABLE `contracts` ADD `country` varchar(32) NOT NULL;
  ALTER TABLE `contracts` ADD `email` varchar(64) NOT NULL;
  ALTER TABLE `contracts` ADD `mobile` varchar(32) NOT NULL;
  ALTER TABLE `contracts` ADD `phone` varchar(32) NOT NULL;
  ALTER TABLE `contracts` ADD `language` tinyint(3) unsigned NOT NULL default 0;
  ALTER TABLE `contracts` ADD `registration` varchar(32) NOT NULL;


-- Split attendees table into att_visitors and resource attendees

CREATE TABLE `att_visitors` (id bigint(20) unsigned auto_increment primary key) ENGINE=MyISAM SELECT * FROM attendees;
DELETE FROM `att_visitors` WHERE resourceType <> 3;
DELETE FROM `attendees` WHERE resourceType = 3;

CREATE INDEX attendees_idx_bygroup ON att_visitors (groupId);
CREATE INDEX attendees_idx_byresc ON att_visitors (resourceId);

CREATE TABLE `archive_att_visitors` (id bigint(20) unsigned primary key) ENGINE=MyISAM SELECT * FROM archive_attendees;
DELETE FROM `archive_att_visitors` WHERE resourceType <> 3;
DELETE FROM `archive_attendees` WHERE resourceType = 3;

CREATE INDEX attendees_idx_bygroup ON archive_att_visitors (groupId);
CREATE INDEX attendees_idx_byresc ON archive_att_visitors (resourceId);


-- Add color and pattern to workcodes

ALTER TABLE `workcodes` ADD	cssColor  bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `workcodes` ADD	cssPattern  bigint(20) unsigned NOT NULL default 0;

-- Rename preferences to experts
 
ALTER TABLE `preferences` RENAME TO `workexperts`;

-- Add urgencies and overdays activation options

ALTER TABLE `groups` ADD `urgencies` tinyint(3) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD `overdays` tinyint(3) unsigned NOT NULL default 0;
  
-- Notes & Tasks

DROP TABLE `performances`;
ALTER TABLE `tasks` RENAME TO `performances`;
ALTER TABLE `archive_tasks` RENAME TO `archive_performances`;
ALTER TABLE `groups` ADD `usetasks` tinyint(3) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD `usenotes` tinyint(3) unsigned NOT NULL default 0;

CREATE TABLE `note_details` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`midnIn` bigint(20) unsigned NOT NULL default 0,
`midnOut` bigint(20) unsigned NOT NULL default 0,
`title` varchar(256) NOT NULL,
`note` text NOT NULL,
`cssColor` bigint(20) unsigned NOT NULL default 0,
`cssPattern` bigint(20) unsigned NOT NULL default 0,
`archived` tinyint(1) unsigned NOT NULL default 0,
PRIMARY KEY  (`id`,`groupId`)
)  ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE archive_note_details SELECT * FROM note_details;
ALTER TABLE  archive_note_details ADD PRIMARY KEY  (`id`,`groupId`);


CREATE TABLE `note_addressees` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`loginId` bigint(20) unsigned NOT NULL default 0,
`archived` tinyint(1) unsigned NOT NULL default 0,
PRIMARY KEY  (`id`,`groupId`)
)  ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE INDEX note_addr_idx_byLogin ON note_addressees (groupId, loginId);
CREATE TABLE archive_note_addressees SELECT * FROM note_addressees;
ALTER TABLE  archive_note_addressees ADD PRIMARY KEY  (`id`,`groupId`);
CREATE INDEX archive_note_addr_idx_byLogin ON archive_note_addressees (groupId, loginId);

CREATE TABLE `task_descriptions` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`title` varchar(256) NOT NULL,
`description` text NOT NULL,
`midnIn` bigint(20) unsigned NOT NULL default 0,
`cssColor` bigint(20) unsigned NOT NULL default 0,
`archived` tinyint(1) unsigned NOT NULL default 0,
PRIMARY KEY  (`id`,`groupId`) 
)  ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE archive_task_descriptions SELECT * FROM task_descriptions;
ALTER TABLE  archive_task_descriptions ADD PRIMARY KEY  (`id`,`groupId`);

CREATE TABLE `task_assignees` (
`id` bigint(20) unsigned NOT NULL auto_increment,
`groupId` bigint(20) unsigned NOT NULL,
`created` timestamp NOT NULL default '0000-00-00 00:00:00',
`creator` varchar(64) NOT NULL,
`changed` timestamp NOT NULL default '0000-00-00 00:00:00',
`changer` varchar(64) NOT NULL,
`loginId` bigint(20) unsigned NOT NULL default 0,
`midnOut` bigint(20) unsigned NOT NULL default 0,
`cssPattern` bigint(20) unsigned NOT NULL default 0,
`archived` tinyint(1) unsigned NOT NULL default 0,
PRIMARY KEY  (`id`,`groupId`)
)  ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE INDEX task_ass_idx_byLogin ON task_assignees (groupId, loginId);
CREATE TABLE archive_task_assignees SELECT * FROM task_assignees;
ALTER TABLE  archive_task_assignees ADD PRIMARY KEY  (`id`,`groupId`);
CREATE INDEX archive_task_ass_idx_byLogin ON archive_task_assignees (groupId, loginId);

ALTER TABLE `groups` ADD `defaultCssNoteColor` bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD `defaultCssNotePattern` bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD `defaultCssTaskColor` bigint(20) unsigned NOT NULL default 0;
ALTER TABLE `groups` ADD `defaultCssTaskPattern` bigint(20) unsigned NOT NULL default 0;

-- alternative subjects for emails

ALTER TABLE `templates_email` ADD `altSubject1` varchar(256) NOT NULL;
ALTER TABLE `templates_email` ADD `altSubject2` varchar(256) NOT NULL;

-- font size in stickers

ALTER TABLE `groups` CHANGE COLUMN  mailToOwner stiFontSize tinyint(3) unsigned NOT NULL default 0;

-- font size in stickers

ALTER TABLE `globals` ADD `sendComm` tinyint(3) unsigned NOT NULL default 0;

