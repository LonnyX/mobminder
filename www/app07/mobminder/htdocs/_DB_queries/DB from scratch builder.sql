/*

Date: 2017-01-03 - Prepared for SANOFI servers SETUP

*/

SET FOREIGN_KEY_CHECKS=0;


-- --------------------------- ----------------------------
--
--       S Y S T E M  
--
-- --------------------------- ----------------------------

-- ----------------------------
-- Table structure for globals
-- ----------------------------
DROP TABLE IF EXISTS `globals`;
CREATE TABLE `globals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `baseline` varchar(12) NOT NULL DEFAULT '',
  `backupPivot` bigint(20) unsigned NOT NULL,
  `youngestHourlyRun` bigint(20) unsigned NOT NULL DEFAULT '0',
  `youngestTensRun` bigint(20) unsigned NOT NULL DEFAULT '0',
  `youngestStats` bigint(20) unsigned NOT NULL DEFAULT '0',
  `sendComm` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Minimum Records of globals
-- ----------------------------
INSERT INTO `globals` VALUES ('1', '0', '1622', '1477778400', '1480723200', '1480726741', '1480201200', '0');



-- ----------------------------
-- Table structure for exceptions
-- ----------------------------
DROP TABLE IF EXISTS `exceptions`;
CREATE TABLE `exceptions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `class` varchar(64) NOT NULL,
  `function` varchar(64) NOT NULL,
  `msg` text NOT NULL,
  PRIMARY KEY (`id`,`groupId`,`created`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for stat_genders
-- ----------------------------
DROP TABLE IF EXISTS `stat_genders`;
CREATE TABLE `stat_genders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `name` varchar(64) NOT NULL DEFAULT '',
  `males` bigint(20) unsigned NOT NULL DEFAULT '0',
  `females` bigint(20) unsigned NOT NULL DEFAULT '0',
  `gender` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `genders_idx` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for stat_lastnames
-- ----------------------------
DROP TABLE IF EXISTS `stat_lastnames`;
CREATE TABLE `stat_lastnames` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `occurances` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lnames_idx_name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;



-- -------------------------- ----------------------------
--
--       L O G I N S 
--
-- --------------------------- ----------------------------


-- ----------------------------
-- Table structure for logins
-- ----------------------------
DROP TABLE IF EXISTS `logins`;
CREATE TABLE `logins` (
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
  `accessLevel` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `permissions` bigint(20) unsigned NOT NULL DEFAULT '0',
  `login` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `GMT` int(8) NOT NULL DEFAULT '3600',
  `weeknumb` tinyint(1) NOT NULL DEFAULT '0',
  `lastLogin` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `gender` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `company` varchar(32) NOT NULL DEFAULT '',
  `address` varchar(64) NOT NULL DEFAULT '',
  `residence` varchar(64) NOT NULL DEFAULT '',
  `zipCode` varchar(8) NOT NULL,
  `city` varchar(32) NOT NULL,
  `country` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `language` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `profession` smallint(5) unsigned NOT NULL DEFAULT '0',
  `note` text NOT NULL,
  `eresaTitle` varchar(128) NOT NULL DEFAULT '',
  `eresaUrl` varchar(64) NOT NULL DEFAULT '',
  `eresaMax` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `eresaLimit` tinyint(3) NOT NULL DEFAULT '0',
  `eresaBefore` int(10) NOT NULL DEFAULT '9472539',
  `eresaSignin` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `eresaCancel` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `eresaAggregate` tinyint(3) NOT NULL DEFAULT '0',
  `eresaRescType` tinyint(3) NOT NULL DEFAULT '0',
  `eresaSkin` varchar(32) NOT NULL DEFAULT '',
  `eresaNote` text NOT NULL,
  `eresaHourlies` varchar(1024) NOT NULL DEFAULT '',
  `eresaDirections` varchar(1024) NOT NULL DEFAULT '',
  `eresaDirLabel` varchar(64) NOT NULL DEFAULT '',
  `eresaDirUrl` varchar(128) NOT NULL DEFAULT '',
  `eresaWorkcodes` text NOT NULL,
  `eresaLink1label` varchar(64) NOT NULL DEFAULT '',
  `eresaLink1url` varchar(128) NOT NULL DEFAULT '',
  `eresaLink2label` varchar(64) NOT NULL DEFAULT '',
  `eresaLink2url` varchar(128) NOT NULL DEFAULT '',
  `eresaPalette` varchar(16) NOT NULL DEFAULT '',
  `eresaFontTitle` varchar(32) NOT NULL DEFAULT '',
  `eresaFontText` varchar(32) NOT NULL DEFAULT '',
  `eresaAuthent` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `syncwhat` int(8) unsigned NOT NULL DEFAULT '1',
  `syncTrescs` bigint(20) unsigned NOT NULL DEFAULT '0',
  `syncTvisis` bigint(20) unsigned NOT NULL DEFAULT '0',
  `syncTresas` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`accessLevel`,`login`),
  KEY `logins_idx_bygroup` (`groupId`),
  KEY `lgin_idx_byCreation` (`created`),
  KEY `lgin_idx_byChange` (`changed`),
  KEY `lgin_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=100000 DEFAULT CHARSET=latin1;

INSERT INTO `logins` VALUES ('9999', '5', '2017-01-01 01:01:01', '', '9999', '2017-01-01 01:01:01', 'Pascal Vanhove', '9999', '0000-00-00 00:00:00', '0', '9', '2146438621', 'pvh', 'dioxine', '3600', '1', '2017-01-01 16:34:41', '1', 'Pascal', 'Vanhove', '', '', '', '', '', '', '', '', '', '1', '808', 'Admin login', '', '', '0', '0', '9472539', '0', '0', '0', '0', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '1', '1', '0', '0', '0');


-- ----------------------------
-- Table structure for accesskeys
-- ----------------------------
DROP TABLE IF EXISTS `accesskeys`;
CREATE TABLE `accesskeys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `accountId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `bCals` text NOT NULL,
  `uCals` text NOT NULL,
  `fCals` text NOT NULL,
  `watchover` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;

INSERT INTO `accesskeys` VALUES ('999999', '9999', '999', '', '', '', ''); -- connects admin login to accountId 999


-- ----------------------------
-- Table structure for catalysts
-- ----------------------------
DROP TABLE IF EXISTS `catalysts`;
CREATE TABLE `catalysts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `catalyst` varchar(40) NOT NULL DEFAULT '',
  `fields` text NOT NULL,
  `sorton` text NOT NULL,
  `sortdir` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `catal_idx_byGroup` (`groupId`,`catalyst`)
) ENGINE=MyISAM AUTO_INCREMENT=2000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for details (table details)
-- ----------------------------
DROP TABLE IF EXISTS `details`;
CREATE TABLE `details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `displayMode` tinyint(4) NOT NULL,
  `resourceType` tinyint(4) NOT NULL,
  `details` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `details_idx_bygroup` (`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=3000000 DEFAULT CHARSET=latin1;



-- ----------------------------
-- Table structure for connections
-- ----------------------------
DROP TABLE IF EXISTS `connections`;
CREATE TABLE `connections` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `sessionId` varchar(256) NOT NULL,
  `loginId` bigint(20) unsigned NOT NULL,
  `connKey` bigint(20) unsigned NOT NULL,
  `reloads` bigint(20) NOT NULL,
  `switchTos` bigint(20) NOT NULL,
  `surfer` varchar(256) NOT NULL,
  `account` varchar(256) NOT NULL,
  `agent` varchar(256) NOT NULL,
  `ip` varchar(256) NOT NULL,
  `logintime` bigint(20) NOT NULL,
  `watchdog` bigint(20) NOT NULL,
  `activity` bigint(20) NOT NULL,
  `cnt_q_all` int(8) unsigned NOT NULL,
  `perf_q_acc` int(8) unsigned NOT NULL,
  `perf_q_pk` int(8) unsigned NOT NULL,
  `perf_q_mean` int(8) unsigned NOT NULL,
  `cnt_p_all` int(8) unsigned NOT NULL,
  `perf_p_acc` int(8) unsigned NOT NULL,
  `perf_p_pk` int(8) unsigned NOT NULL,
  `perf_p_mean` int(8) unsigned NOT NULL,
  `cnt_d_all` int(8) unsigned NOT NULL,
  `perf_d_acc` int(8) unsigned NOT NULL,
  `perf_d_pk` int(8) unsigned NOT NULL,
  `perf_d_mean` int(8) unsigned NOT NULL,
  `cnt_q_config` int(8) unsigned NOT NULL,
  `perf_q_config_pk` int(8) unsigned NOT NULL,
  `cnt_q_emerg` int(8) unsigned NOT NULL,
  `perf_q_emerg_pk` int(8) unsigned NOT NULL,
  `cnt_q_gender` int(8) unsigned NOT NULL,
  `perf_q_gender_pk` int(8) unsigned NOT NULL,
  `cnt_q_login` int(8) unsigned NOT NULL,
  `perf_q_login_pk` int(8) unsigned NOT NULL,
  `cnt_q_orphans` int(8) unsigned NOT NULL,
  `perf_q_orphans_pk` int(8) unsigned NOT NULL,
  `cnt_q_plitems` int(8) unsigned NOT NULL,
  `perf_q_plitems_pk` int(8) unsigned NOT NULL,
  `cnt_q_remote` int(8) unsigned NOT NULL,
  `perf_q_remote_pk` int(8) unsigned NOT NULL,
  `cnt_q_search` int(8) unsigned NOT NULL,
  `perf_q_search_pk` int(8) unsigned NOT NULL,
  `cnt_q_stats` int(8) unsigned NOT NULL,
  `perf_q_stats_pk` int(8) unsigned NOT NULL,
  `cnt_q_alphatab` int(8) unsigned NOT NULL,
  `perf_q_alphatab_pk` int(8) unsigned NOT NULL,
  `cnt_q_swap` int(8) unsigned NOT NULL,
  `perf_q_swap_pk` int(8) unsigned NOT NULL,
  `cnt_q_visiapps` int(8) unsigned NOT NULL,
  `perf_q_visiapps_pk` int(8) unsigned NOT NULL,
  `cnt_q_visitors` int(8) unsigned NOT NULL,
  `perf_q_visitors_pk` int(8) unsigned NOT NULL,
  `cnt_p_config` int(8) unsigned NOT NULL,
  `perf_p_config_pk` int(8) unsigned NOT NULL,
  `cnt_p_visitor` int(8) unsigned NOT NULL,
  `perf_p_visitor_pk` int(8) unsigned NOT NULL,
  `cnt_p_resa` int(8) unsigned NOT NULL,
  `perf_p_resa_pk` int(8) unsigned NOT NULL,
  `cnt_p_rsc` int(8) unsigned NOT NULL,
  `perf_p_rsc_pk` int(8) unsigned NOT NULL,
  `cnt_p_schedule` int(8) unsigned NOT NULL,
  `perf_p_schedule_pk` int(8) unsigned NOT NULL,
  `cnt_p_shadow` int(8) unsigned NOT NULL,
  `perf_p_shadow_pk` int(8) unsigned NOT NULL,
  `cnt_p_task` int(8) unsigned NOT NULL,
  `perf_p_task_pk` int(8) unsigned NOT NULL,
  `cnt_p_note` int(8) unsigned NOT NULL,
  `perf_p_note_pk` int(8) unsigned NOT NULL,
  `cnt_p_chat` int(8) unsigned NOT NULL DEFAULT '0',
  `perf_p_chat_pk` int(8) unsigned NOT NULL DEFAULT '0',
  `cnt_p_newacc` int(8) unsigned NOT NULL,
  `perf_p_newacc_pk` int(8) unsigned NOT NULL,
  `cnt_p_login` int(8) unsigned NOT NULL,
  `perf_p_login_pk` int(8) unsigned NOT NULL,
  `cnt_p_huser` int(8) unsigned NOT NULL,
  `perf_p_huser_pk` int(8) unsigned NOT NULL,
  `cnt_p_tboxing` int(8) unsigned NOT NULL,
  `perf_p_tboxing_pk` int(8) unsigned NOT NULL,
  `cnt_p_hourly` int(8) unsigned NOT NULL,
  `perf_p_hourly_pk` int(8) unsigned NOT NULL,
  `cnt_p_gdlns` int(8) unsigned NOT NULL,
  `perf_p_gdlns_pk` int(8) unsigned NOT NULL,
  `cnt_p_smst` int(8) unsigned NOT NULL,
  `perf_p_smst_pk` int(8) unsigned NOT NULL,
  `cnt_p_emlt` int(8) unsigned NOT NULL,
  `perf_p_emlt_pk` int(8) unsigned NOT NULL,
  `cnt_p_details` int(8) unsigned NOT NULL,
  `perf_p_details_pk` int(8) unsigned NOT NULL,
  `cnt_p_ccss` int(8) unsigned NOT NULL,
  `perf_p_ccss_pk` int(8) unsigned NOT NULL,
  `cnt_p_account` int(8) unsigned NOT NULL,
  `perf_p_account_pk` int(8) unsigned NOT NULL,
  `cnt_p_wrkc` int(8) unsigned NOT NULL,
  `perf_p_wrkc_pk` int(8) unsigned NOT NULL,
  `cnt_d_account` int(8) unsigned NOT NULL,
  `perf_d_account_pk` int(8) unsigned NOT NULL,
  `cnt_d_ccss` int(8) unsigned NOT NULL,
  `perf_d_ccss_pk` int(8) unsigned NOT NULL,
  `cnt_d_smst` int(8) unsigned NOT NULL,
  `perf_d_smst_pk` int(8) unsigned NOT NULL,
  `cnt_d_emlt` int(8) unsigned NOT NULL,
  `perf_d_emlt_pk` int(8) unsigned NOT NULL,
  `cnt_d_gdlns` int(8) unsigned NOT NULL,
  `perf_d_gdlns_pk` int(8) unsigned NOT NULL,
  `cnt_d_shadow` int(8) unsigned NOT NULL,
  `perf_d_shadow_pk` int(8) unsigned NOT NULL,
  `cnt_d_huser` int(8) unsigned NOT NULL,
  `perf_d_huser_pk` int(8) unsigned NOT NULL,
  `cnt_d_tboxing` int(8) unsigned NOT NULL,
  `perf_d_tboxing_pk` int(8) unsigned NOT NULL,
  `cnt_d_login` int(8) unsigned NOT NULL,
  `perf_d_login_pk` int(8) unsigned NOT NULL,
  `cnt_d_resa` int(8) unsigned NOT NULL,
  `perf_d_resa_pk` int(8) unsigned NOT NULL,
  `cnt_d_task` int(8) unsigned NOT NULL,
  `perf_d_task_pk` int(8) unsigned NOT NULL,
  `cnt_d_note` int(8) unsigned NOT NULL,
  `perf_d_note_pk` int(8) unsigned NOT NULL,
  `cnt_d_chat` int(8) unsigned NOT NULL DEFAULT '0',
  `perf_d_chat_pk` int(8) unsigned NOT NULL DEFAULT '0',
  `cnt_d_rsc` int(8) unsigned NOT NULL,
  `perf_d_rsc_pk` int(8) unsigned NOT NULL,
  `cnt_d_wrkc` int(8) unsigned NOT NULL,
  `perf_d_wrkc_pk` int(8) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conx_idx_byAccKey` (`connKey`),
  KEY `conx_idx_bySession` (`sessionId`,`logintime`),
  KEY `conx_idx_byLogin` (`loginId`,`connKey`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000000 DEFAULT CHARSET=latin1;




-- --------------------------- ----------------------------
--
--       A C C O U N T S 
--
-- --------------------------- ----------------------------


-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
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
  `package` tinyint(4) NOT NULL DEFAULT '16',
  `profsector` smallint(5) unsigned NOT NULL DEFAULT '0',
  `GMT` int(8) NOT NULL DEFAULT '0',
  `name` varchar(32) NOT NULL,
  `headline` text NOT NULL,
  `color` smallint(6) NOT NULL DEFAULT '0',
  `pattern` smallint(6) NOT NULL DEFAULT '0',
  `note` text NOT NULL,
  `email` varchar(64) NOT NULL,
  `language` tinyint(4) unsigned NOT NULL,
  `visitorAlias` tinyint(4) unsigned NOT NULL,
  `smsSenderId` varchar(16) NOT NULL,
  `timeSlice` tinyint(4) unsigned NOT NULL,
  `durationShortest` tinyint(4) unsigned NOT NULL,
  `durationSteps` tinyint(4) unsigned NOT NULL,
  `durationLongest` tinyint(4) unsigned NOT NULL,
  `notbefore` bigint(20) NOT NULL DEFAULT '8424222',
  `upperLeftDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `rangeIn` mediumint(8) unsigned NOT NULL DEFAULT '36000',
  `rangeOut` mediumint(8) unsigned NOT NULL DEFAULT '72000',
  `defaultGender` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `vipToggle` tinyint(3) unsigned NOT NULL,
  `history` smallint(5) unsigned NOT NULL,
  `cssSuite` tinyint(4) unsigned NOT NULL,
  `stiFontSize` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `mailToUsers` tinyint(3) unsigned NOT NULL,
  `sendSMSs` tinyint(3) unsigned NOT NULL,
  `phoneRegion` smallint(5) unsigned NOT NULL DEFAULT '32',
  `phoneSlicing` tinyint(4) NOT NULL DEFAULT '3',
  `paymentStatus` tinyint(3) unsigned NOT NULL,
  `ePayProviderHandle` varchar(32) NOT NULL,
  `suspended` tinyint(3) unsigned NOT NULL,
  `bCalsName` tinyint(4) unsigned NOT NULL,
  `uCalsName` tinyint(4) unsigned NOT NULL,
  `fCalsName` tinyint(4) unsigned NOT NULL,
  `workCodesName` tinyint(4) unsigned NOT NULL,
  `defaultCssAppColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssAppPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssAppTag` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssEventColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssEventPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssEventTag` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssFcalColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssFcalPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssFcalTag` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssVisitorColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssVisitorPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssVisitorTag` bigint(20) NOT NULL DEFAULT '0',
  `maxVisitors` tinyint(4) unsigned NOT NULL DEFAULT '1',
  `cssLogging` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `urgencies` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `overdays` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `usetasks` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `usenotes` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `usechat` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `usefiles` tinyint(3) NOT NULL DEFAULT '0',
  `defaultCssNoteColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssNotePattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssNoteTag` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssTaskColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssTaskPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssTaskTag` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssChatColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssChatPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `defaultCssChatTag` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssFileColor` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssFilePattern` bigint(20) NOT NULL DEFAULT '0',
  `defaultCssFileTag` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `group_idx_byCreation` (`created`),
  KEY `group_idx_byChange` (`changed`),
  KEY `group_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=10000 DEFAULT CHARSET=latin1;

INSERT INTO `groups` VALUES ('999', '0', '2017-01-01 01:01:01', '', '9999', '2017-01-01 01:01:01', 'Pascal Vanhove', '9999', '0000-00-00 00:00:00', '0', '16', '37', '3600', 'Init account', '', '90', '901', '', 'pascal@mobminder.com', '1', '100', '3281408541', '1', '1', '1', '9', '142641950', '0000-00-00 00:00:00', '25200', '64800', '1', '0', '0', '150', '2', '0', '0', '32', '3', '1', '729-8746347-68', '0', '70', '0', '110', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');



-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources` (
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
  `resourceType` tinyint(4) NOT NULL,
  `name` varchar(128) NOT NULL,
  `color` smallint(6) unsigned NOT NULL,
  `reservability` tinyint(3) NOT NULL,
  `offsetBefore` tinyint(3) NOT NULL,
  `offsetAfter` tinyint(3) NOT NULL,
  `displayOrder` tinyint(4) unsigned NOT NULL,
  `note` text NOT NULL,
  `signature` varchar(64) NOT NULL DEFAULT '',
  `sendComms` tinyint(1) NOT NULL DEFAULT '1',
  `guideId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `resc_idx_bygroup` (`groupId`),
  KEY `rscr_idx_byCreation` (`created`),
  KEY `rscr_idx_byChange` (`changed`),
  KEY `rscr_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=100000 DEFAULT CHARSET=latin1;




-- ----------------------------
-- Table structure for custom_css
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
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for guidelines
-- ----------------------------
DROP TABLE IF EXISTS `guidelines`;
CREATE TABLE `guidelines` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL,
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL,
  `name` varchar(128) NOT NULL,
  `address` varchar(64) NOT NULL DEFAULT '',
  `zipCode` varchar(8) NOT NULL,
  `city` varchar(32) NOT NULL,
  `country` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `language` tinyint(3) NOT NULL,
  `registration` varchar(32) NOT NULL,
  `directions` text NOT NULL,
  `newvisi` text NOT NULL,
  `appguide` text NOT NULL,
  `reqguide` text NOT NULL,
  `neverdo` text NOT NULL,
  `tipstricks` text NOT NULL,
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=10000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for workcodes
-- ----------------------------
DROP TABLE IF EXISTS `workcodes`;
CREATE TABLE `workcodes` (
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
  `name` varchar(256) NOT NULL,
  `code` varchar(64) NOT NULL,
  `note` text NOT NULL,
  `price` int(10) unsigned NOT NULL DEFAULT '0',
  `duration` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `staffing` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `ereservable` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `wrks_idx_bygroup` (`groupId`),
  KEY `wrkc_idx_byCreation` (`created`),
  KEY `wrkc_idx_byChange` (`changed`),
  KEY `wrkc_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=2000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for workexperts
-- ----------------------------
DROP TABLE IF EXISTS `workexperts`;
CREATE TABLE `workexperts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `resourceId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=3000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for worktboxing
-- ----------------------------
DROP TABLE IF EXISTS `worktboxing`;
CREATE TABLE `worktboxing` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `timeboxingId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `wtbox_idx_bygroup` (`groupId`),
  KEY `wtbox_idx_byboxing` (`timeboxingId`)
) ENGINE=MyISAM AUTO_INCREMENT=4000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for contracts
-- ----------------------------
DROP TABLE IF EXISTS `contracts`;
CREATE TABLE `contracts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `creation` bigint(20) unsigned NOT NULL,
  `register` varchar(16) NOT NULL,
  `tax` varchar(16) NOT NULL,
  `ePayment` tinyint(3) unsigned NOT NULL,
  `eInvoicing` tinyint(3) unsigned NOT NULL,
  `fee` int(10) unsigned NOT NULL,
  `exCredit` tinyint(3) unsigned NOT NULL,
  `exFee` int(10) unsigned NOT NULL DEFAULT '0',
  `rate` int(10) unsigned NOT NULL,
  `note` text NOT NULL,
  `gender` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `address` varchar(64) NOT NULL DEFAULT '',
  `zipCode` varchar(8) NOT NULL,
  `city` varchar(32) NOT NULL,
  `country` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `language` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `registration` varchar(32) NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `contr_idx_bygroup` (`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=80000 DEFAULT CHARSET=latin1;





-- --------------------------- ----------------------------
--
--       CHATS - TASKS - NOTES
--
-- --------------------------- ----------------------------


-- ----------------------------
-- Table structure for chat_threads
-- ----------------------------
DROP TABLE IF EXISTS `chat_threads`;
CREATE TABLE `chat_threads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL,
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL,
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletor` varchar(64) NOT NULL,
  `deletorId` bigint(20) unsigned NOT NULL,
  `title` varchar(256) NOT NULL,
  `note` text NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cthreads_idx_byGroup` (`groupId`,`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for chat_participants
-- ----------------------------
DROP TABLE IF EXISTS `chat_participants`;
CREATE TABLE `chat_participants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cueIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `physseen` int(5) unsigned NOT NULL DEFAULT '0',
  `cueOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cparts_idx_byGroup` (`groupId`,`loginId`,`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for chat_phylacteries
-- ----------------------------
DROP TABLE IF EXISTS `chat_phylacteries`;
CREATE TABLE `chat_phylacteries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cue` bigint(20) unsigned NOT NULL DEFAULT '0',
  `who` bigint(20) unsigned NOT NULL DEFAULT '0',
  `bla` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cparts_idx_byGroup` (`groupId`,`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for chat_visirefs
-- ----------------------------
DROP TABLE IF EXISTS `chat_visirefs`;
CREATE TABLE `chat_visirefs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `visiId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cvrefs_idx_byGroup` (`groupId`,`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for note_details
-- ----------------------------
DROP TABLE IF EXISTS `note_details`;
CREATE TABLE `note_details` (
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
  `midnIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `midnOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  `title` varchar(256) NOT NULL,
  `note` text NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `note_idx_byCreation` (`created`),
  KEY `note_idx_byChange` (`changed`),
  KEY `note_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=21000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for note_addressees
-- ----------------------------
DROP TABLE IF EXISTS `note_addressees`;
CREATE TABLE `note_addressees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `note_addr_idx_byLogin` (`groupId`,`loginId`)
) ENGINE=MyISAM AUTO_INCREMENT=22000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for note_visirefs
-- ----------------------------
DROP TABLE IF EXISTS `note_visirefs`;
CREATE TABLE `note_visirefs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `visiId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vref_idx_byGroup` (`groupId`,`id`)
) ENGINE=MyISAM AUTO_INCREMENT=23000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for task_descriptions
-- ----------------------------
DROP TABLE IF EXISTS `task_descriptions`;
CREATE TABLE `task_descriptions` (
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
  `title` varchar(256) NOT NULL,
  `description` text NOT NULL,
  `midnIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `task_idx_byCreation` (`created`),
  KEY `task_idx_byChange` (`changed`),
  KEY `task_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=31000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for task_assignees
-- ----------------------------
DROP TABLE IF EXISTS `task_assignees`;
CREATE TABLE `task_assignees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `midnOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `task_ass_idx_byLogin` (`groupId`,`loginId`)
) ENGINE=MyISAM AUTO_INCREMENT=32000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for task_visirefs
-- ----------------------------
DROP TABLE IF EXISTS `task_visirefs`;
CREATE TABLE `task_visirefs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `visiId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vref_idx_byGroup` (`groupId`,`id`)
) ENGINE=MyISAM AUTO_INCREMENT=33000000 DEFAULT CHARSET=latin1;



-- --------------------------- ----------------------------
--
--       A G E N D A S 
--
-- --------------------------- ----------------------------

-- ----------------------------
-- Table structure for visitors
-- ----------------------------
DROP TABLE IF EXISTS `visitors`;
CREATE TABLE `visitors` (
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
  `prefNotBefore` tinyint(3) unsigned NOT NULL,
  `prefAMPM` int(10) unsigned NOT NULL,
  `vip` tinyint(2) unsigned NOT NULL,
  `gender` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `firstname` varchar(64) NOT NULL DEFAULT '',
  `lastname` varchar(64) NOT NULL DEFAULT '',
  `company` varchar(32) NOT NULL DEFAULT '',
  `address` varchar(64) NOT NULL DEFAULT '',
  `residence` varchar(64) NOT NULL DEFAULT '',
  `zipCode` varchar(8) NOT NULL DEFAULT '',
  `city` varchar(32) NOT NULL DEFAULT '',
  `country` varchar(32) NOT NULL DEFAULT '',
  `email` varchar(64) NOT NULL DEFAULT '',
  `mobile` varchar(32) NOT NULL DEFAULT '',
  `phone` varchar(32) NOT NULL DEFAULT '',
  `language` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `birthday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `registration` varchar(32) NOT NULL DEFAULT '',
  `reference` varchar(64) NOT NULL DEFAULT '',
  `note` text NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `selection` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `visi_idx_byGroup` (`groupId`,`id`) USING BTREE,
  KEY `visi_idx_byCreation` (`created`,`groupId`,`id`) USING BTREE,
  KEY `visi_idx_byChange` (`changed`,`groupId`,`id`) USING BTREE,
  KEY `visi_idx_byDelete` (`deleted`,`groupId`,`id`) USING BTREE,
  KEY `visi_idx_bylastname` (`lastname`,`groupId`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=10000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for reservations
-- ----------------------------
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
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
  `cueIn` bigint(20) unsigned NOT NULL,
  `cueOut` bigint(20) unsigned NOT NULL,
  `peerId` bigint(20) unsigned NOT NULL,
  `layerLevel` tinyint(4) unsigned NOT NULL,
  `iscluster` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `vip` tinyint(3) unsigned NOT NULL,
  `waitingList` tinyint(3) unsigned NOT NULL,
  `note` text NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `rescheduled` bigint(20) unsigned NOT NULL DEFAULT '0',
  `serieId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `snext` bigint(20) unsigned NOT NULL DEFAULT '0',
  `sprev` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`cueIn`,`cueOut`,`iscluster`,`waitingList`),
  KEY `resa_idx_byCreation` (`created`) USING BTREE,
  KEY `resa_idx_byChange` (`changed`) USING BTREE,
  KEY `resa_idx_byDelete` (`deleted`) USING BTREE,
  KEY `resas_idx_bycueIn` (`groupId`,`cueIn`) USING BTREE,
  KEY `resas_idx_bycueOut` (`groupId`,`cueOut`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=10000000 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for attendees
-- ----------------------------
DROP TABLE IF EXISTS `attendees`;
CREATE TABLE `attendees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `resourceType` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `resourceId` bigint(20) unsigned NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `att_idx_bygroup` (`groupId`) USING BTREE,
  KEY `att_idx_byresc` (`resourceId`)
) ENGINE=MyISAM AUTO_INCREMENT=30000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for att_visitors
-- ----------------------------
DROP TABLE IF EXISTS `att_visitors`;
CREATE TABLE `att_visitors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `resourceType` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `resourceId` bigint(20) unsigned NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `att_visi_idx_byresc` (`resourceId`) USING BTREE,
  KEY `att_visi_idx_bygroup` (`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=20000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for performances
-- ----------------------------
DROP TABLE IF EXISTS `performances`;
CREATE TABLE `performances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `workCodeId` bigint(20) unsigned NOT NULL,
  `visitorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `tasks_idx_bygroup` (`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=60000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for resaparts
-- ----------------------------
DROP TABLE IF EXISTS `resaparts`;
CREATE TABLE `resaparts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `cueIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cueOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `resaparts_idx_bygroup` (`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=70000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for resa_series
-- ----------------------------
DROP TABLE IF EXISTS `resa_series`;
CREATE TABLE `resa_series` (
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
  `stitle` varchar(256) NOT NULL,
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=80000000 DEFAULT CHARSET=latin1;





-- ----------------------------
-- Table structure for hourlies
-- ----------------------------
DROP TABLE IF EXISTS `hourlies`;
CREATE TABLE `hourlies` (
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
  `monday` bigint(20) unsigned NOT NULL,
  `periodicity` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `note` text NOT NULL,
  `colorOff` smallint(6) unsigned NOT NULL,
  `colorExcp` smallint(6) unsigned NOT NULL,
  `colorAbsent` smallint(6) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `hourlies_idx_bygroup` (`groupId`),
  KEY `hrly_idx_byCreation` (`created`),
  KEY `hrly_idx_byChange` (`changed`),
  KEY `hrly_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=11000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for shadows
-- ----------------------------
DROP TABLE IF EXISTS `shadows`;
CREATE TABLE `shadows` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `cueIn` bigint(11) unsigned NOT NULL,
  `cueOut` bigint(11) unsigned NOT NULL,
  `dayCode` tinyint(4) unsigned NOT NULL,
  `exceptional` tinyint(4) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `shadows_idx_bygroup` (`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=22000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for hourliesusers
-- ----------------------------
DROP TABLE IF EXISTS `hourliesusers`;
CREATE TABLE `hourliesusers` (
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
  `hourlyId` bigint(20) unsigned NOT NULL,
  `dayIn` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `husers_idx_bygroup` (`groupId`),
  KEY `husers_idx_byhourly` (`hourlyId`),
  KEY `husers_idx_bydayin` (`dayIn`)
) ENGINE=MyISAM AUTO_INCREMENT=33000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for timeboxes
-- ----------------------------
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
) ENGINE=MyISAM AUTO_INCREMENT=44000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for timeboxings
-- ----------------------------
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
  `exclusive` smallint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `tbox_idx_bygroup` (`groupId`),
  KEY `tbox_idx_byCreation` (`created`),
  KEY `tbox_idx_byChange` (`changed`),
  KEY `tbox_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=55000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) NOT NULL,
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) NOT NULL,
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) NOT NULL,
  `visitorId` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL,
  `note` text NOT NULL,
  `cssColor` bigint(20) NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `filename` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=66000000 DEFAULT CHARSET=latin1;



-- --------------------------- ----------------------------
--
--       C O M M U N I C A T I O N
--
-- --------------------------- ----------------------------

-- ----------------------------
-- Table structure for templates_sms
-- ----------------------------
DROP TABLE IF EXISTS `templates_sms`;
CREATE TABLE `templates_sms` (
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
  `message` varchar(512) NOT NULL,
  `advance` int(10) NOT NULL,
  `pages` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `sendComms` tinyint(1) NOT NULL DEFAULT '1',
  `deliveryTime` int(11) unsigned NOT NULL,
  `deliveryDelay` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `triggerId` smallint(6) NOT NULL DEFAULT '1',
  `triggerClass` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `presenceList` tinyint(1) NOT NULL DEFAULT '0',
  `target` tinyint(3) unsigned NOT NULL,
  `altLanguage1` tinyint(3) unsigned NOT NULL DEFAULT '255',
  `altMessage1` text NOT NULL,
  `altLanguage2` tinyint(3) unsigned NOT NULL DEFAULT '255',
  `altMessage2` text NOT NULL,
  `filterOnActions` tinyint(1) NOT NULL DEFAULT '0',
  `filterOnLogins` tinyint(1) NOT NULL DEFAULT '0',
  `filterOnResources` tinyint(1) NOT NULL DEFAULT '0',
  `actions` tinyint(1) NOT NULL DEFAULT '3',
  `logins` text NOT NULL,
  `resources` text NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `tsms_idx_bygroup` (`groupId`),
  KEY `smsT_idx_byCreation` (`created`),
  KEY `smsT_idx_byChange` (`changed`),
  KEY `smsT_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=2220000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for sms
-- ----------------------------
DROP TABLE IF EXISTS `sms`;
CREATE TABLE `sms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `reservationId` bigint(20) unsigned NOT NULL,
  `templateId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `sendStamp` bigint(20) unsigned NOT NULL,
  `text` varchar(1024) NOT NULL,
  `pages` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `toNumber` varchar(32) NOT NULL,
  `replyNumber` varchar(32) NOT NULL,
  `correlator` varchar(64) NOT NULL DEFAULT '',
  `status` tinyint(3) unsigned NOT NULL,
  `opStatus` varchar(8) NOT NULL DEFAULT '',
  `statusChangeStamp` bigint(20) unsigned NOT NULL,
  `resourceId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `r2correlator` varchar(64) NOT NULL DEFAULT '',
  `r2status` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `r2statusChangeStamp` bigint(20) unsigned NOT NULL DEFAULT '0',
  `r3correlator` varchar(64) NOT NULL DEFAULT '',
  `r3status` varchar(64) NOT NULL DEFAULT '',
  `r3statusChangeStamp` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`sendStamp`,`correlator`,`status`),
  KEY `sms_idx_byResa` (`reservationId`),
  KEY `sms_idx_byTempl` (`templateId`) USING BTREE,
  KEY `sms_idx_issent` (`resourceId`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=80000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for templates_email
-- ----------------------------
DROP TABLE IF EXISTS `templates_email`;
CREATE TABLE `templates_email` (
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
  `subject` varchar(256) NOT NULL,
  `message` text NOT NULL,
  `advance` int(10) NOT NULL,
  `sendComms` tinyint(1) NOT NULL DEFAULT '1',
  `deliveryTime` int(11) unsigned NOT NULL,
  `deliveryDelay` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `triggerId` smallint(6) NOT NULL DEFAULT '1',
  `triggerClass` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `presenceList` tinyint(1) NOT NULL DEFAULT '0',
  `target` tinyint(3) unsigned NOT NULL,
  `altLanguage1` tinyint(3) unsigned NOT NULL DEFAULT '255',
  `altMessage1` text NOT NULL,
  `altLanguage2` tinyint(3) unsigned NOT NULL DEFAULT '255',
  `altMessage2` text NOT NULL,
  `altSubject1` varchar(256) NOT NULL,
  `altSubject2` varchar(256) NOT NULL,
  `filterOnActions` tinyint(1) NOT NULL DEFAULT '0',
  `filterOnLogins` tinyint(1) NOT NULL DEFAULT '0',
  `filterOnResources` tinyint(1) NOT NULL DEFAULT '0',
  `actions` tinyint(1) NOT NULL DEFAULT '3',
  `logins` text NOT NULL,
  `resources` text NOT NULL,
  PRIMARY KEY (`id`,`groupId`),
  KEY `teml_idx_bygroup` (`groupId`),
  KEY `emlT_idx_byCreation` (`created`),
  KEY `emlT_idx_byChange` (`changed`),
  KEY `emlT_idx_byDelete` (`deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=3330000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for emails
-- ----------------------------
DROP TABLE IF EXISTS `emails`;
CREATE TABLE `emails` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `reservationId` bigint(20) unsigned NOT NULL,
  `templateId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `sendStamp` bigint(20) unsigned NOT NULL,
  `mailsubject` varchar(512) NOT NULL,
  `mailbody` text NOT NULL,
  `recipients` varchar(512) NOT NULL,
  `sender` varchar(128) NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `statusChangeStamp` bigint(20) unsigned NOT NULL,
  `resourceId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`sendStamp`),
  KEY `eml_idx_byResa` (`reservationId`),
  KEY `eml_idx_byTempl` (`reservationId`,`templateId`),
  KEY `eml_idx_issent` (`reservationId`,`templateId`,`resourceId`)
) ENGINE=MyISAM AUTO_INCREMENT=70000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for comm_toggles
-- ----------------------------
DROP TABLE IF EXISTS `comm_toggles`;
CREATE TABLE `comm_toggles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `msgMedium` tinyint(4) unsigned NOT NULL,
  `reservationId` bigint(20) unsigned NOT NULL,
  `templateId` bigint(20) unsigned NOT NULL,
  `resourceId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `comm_idx_byResa` (`reservationId`),
  KEY `comm_idx_byTempl` (`reservationId`,`templateId`,`msgMedium`,`resourceId`)
) ENGINE=MyISAM AUTO_INCREMENT=60000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for delayed_notifs
-- ----------------------------
DROP TABLE IF EXISTS `delayed_notifs`;
CREATE TABLE `delayed_notifs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `reservationId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `medium` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `templateId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `delay` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM AUTO_INCREMENT=50000000 DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for prebooking_delays
-- ----------------------------
DROP TABLE IF EXISTS `prebooking_delays`;
CREATE TABLE `prebooking_delays` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `reservationId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `delay` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `prebookbyresa_idx` (`reservationId`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=latin1;



-- --------------------------- ----------------------------
--
--       S Y N C H R O    A P I
--
-- --------------------------- ----------------------------


-- ----------------------------
-- Table structure for synchro_ccss
-- ----------------------------
DROP TABLE IF EXISTS `synchro_ccss`;
CREATE TABLE `synchro_ccss` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `skeyId` bigint(20) NOT NULL,
  `localId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `remoteId` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`groupId`),
  KEY `sync_ccss_idx_bySyndId` (`groupId`,`remoteId`),
  KEY `sync_ccss_idx_byRemoteId` (`skeyId`,`id`),
  KEY `sync_ccss_idx_byLocalId` (`localId`)
) ENGINE=MyISAM AUTO_INCREMENT=10000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for synchro_reservations
-- ----------------------------
DROP TABLE IF EXISTS `synchro_reservations`;
CREATE TABLE `synchro_reservations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `skeyId` bigint(20) NOT NULL,
  `localId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `remoteId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `sync_resa_idx_bySyndId` (`skeyId`,`id`),
  KEY `sync_resa_idx_byRemoteId` (`groupId`,`remoteId`),
  KEY `sync_resa_idx_byLocalId` (`localId`)
) ENGINE=MyISAM AUTO_INCREMENT=20000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for synchro_resources
-- ----------------------------
DROP TABLE IF EXISTS `synchro_resources`;
CREATE TABLE `synchro_resources` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `skeyId` bigint(20) NOT NULL,
  `localId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `remoteId` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`groupId`),
  KEY `sync_rscs_idx_bySyndId` (`skeyId`,`id`),
  KEY `sync_rscs_idx_byRemoteId` (`groupId`,`remoteId`),
  KEY `sync_rscs_idx_byLocalId` (`localId`)
) ENGINE=MyISAM AUTO_INCREMENT=30000000 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for synchro_visitors
-- ----------------------------
DROP TABLE IF EXISTS `synchro_visitors`;
CREATE TABLE `synchro_visitors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL,
  `skeyId` bigint(20) NOT NULL,
  `localId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `remoteId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `sync_visi_idx_bySyndId` (`skeyId`,`id`),
  KEY `sync_visi_idx_byRemoteId` (`groupId`,`remoteId`),
  KEY `sync_visi_idx_byLocalId` (`localId`)
) ENGINE=MyISAM AUTO_INCREMENT=400000000 DEFAULT CHARSET=latin1;





-- --------------------------- ----------------------------
--
--       P R E - C A L C U L A T E D   M O N I T O R I N G
--
-- --------------------------- ----------------------------

-- ----------------------------
-- Table structure for xmon_accounts
-- ----------------------------
DROP TABLE IF EXISTS `xmon_accounts`;
CREATE TABLE `xmon_accounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sunday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `rescCount` int(10) unsigned NOT NULL DEFAULT '0',
  `visiCount` int(10) unsigned NOT NULL DEFAULT '0',
  `visiMobile` int(10) unsigned NOT NULL DEFAULT '0',
  `visiMales` int(10) unsigned NOT NULL DEFAULT '0',
  `visiFemales` int(10) unsigned NOT NULL DEFAULT '0',
  `loginsCount` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `xmon_acc_idx_bySunday` (`groupId`,`sunday`)
) ENGINE=MyISAM AUTO_INCREMENT=1000000 DEFAULT CHARSET=binary;

-- ----------------------------
-- Table structure for xmon_actions
-- ----------------------------
DROP TABLE IF EXISTS `xmon_actions`;
CREATE TABLE `xmon_actions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sunday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `resaNew` int(10) unsigned NOT NULL DEFAULT '0',
  `resaEdit` int(10) unsigned NOT NULL DEFAULT '0',
  `resaDel` int(10) unsigned NOT NULL DEFAULT '0',
  `appNew` int(10) unsigned NOT NULL DEFAULT '0',
  `appEdit` int(10) unsigned NOT NULL DEFAULT '0',
  `appDel` int(10) unsigned NOT NULL DEFAULT '0',
  `noteNew` int(10) unsigned NOT NULL DEFAULT '0',
  `noteEdit` int(10) unsigned NOT NULL DEFAULT '0',
  `noteDel` int(10) unsigned NOT NULL DEFAULT '0',
  `taskNew` int(10) unsigned NOT NULL DEFAULT '0',
  `taskEdit` int(10) unsigned NOT NULL DEFAULT '0',
  `taskDel` int(10) unsigned NOT NULL DEFAULT '0',
  `taskAssigned` int(10) unsigned NOT NULL DEFAULT '0',
  `taskAchieved` int(10) unsigned NOT NULL DEFAULT '0',
  `visiNew` int(10) unsigned NOT NULL DEFAULT '0',
  `visiEdit` int(10) unsigned NOT NULL DEFAULT '0',
  `visiMerge` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `xmon_actions_idx_bySunday` (`groupId`,`sunday`)
) ENGINE=MyISAM AUTO_INCREMENT=10000000 DEFAULT CHARSET=binary;

-- ----------------------------
-- Table structure for xmon_actuals
-- ----------------------------
DROP TABLE IF EXISTS `xmon_actuals`;
CREATE TABLE `xmon_actuals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `resourceId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sunday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `offdayCount` int(10) unsigned NOT NULL DEFAULT '0',
  `resaCount` int(10) unsigned NOT NULL DEFAULT '0',
  `appCount` int(10) unsigned NOT NULL DEFAULT '0',
  `offdayTime` int(10) unsigned NOT NULL DEFAULT '0',
  `resaTime` int(10) unsigned NOT NULL DEFAULT '0',
  `appTime` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `xmon_act_idx_bySunday` (`groupId`,`sunday`)
) ENGINE=MyISAM AUTO_INCREMENT=20000000 DEFAULT CHARSET=binary;

-- ----------------------------
-- Table structure for xmon_ccss
-- ----------------------------
DROP TABLE IF EXISTS `xmon_ccss`;
CREATE TABLE `xmon_ccss` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sunday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `ccssId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `actual` int(10) unsigned NOT NULL DEFAULT '0',
  `action` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `xmon_ccss_idx_bySunday` (`groupId`,`sunday`)
) ENGINE=MyISAM AUTO_INCREMENT=30000000 DEFAULT CHARSET=binary;

-- ----------------------------
-- Table structure for xmon_performances
-- ----------------------------
DROP TABLE IF EXISTS `xmon_performances`;
CREATE TABLE `xmon_performances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sunday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `workCodeId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `actual` int(10) unsigned NOT NULL DEFAULT '0',
  `action` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `xmon_perf_idx_bySunday` (`groupId`,`sunday`)
) ENGINE=MyISAM AUTO_INCREMENT=40000000 DEFAULT CHARSET=binary;

-- ----------------------------
-- Table structure for xmon_sms
-- ----------------------------
DROP TABLE IF EXISTS `xmon_sms`;
CREATE TABLE `xmon_sms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sunday` bigint(20) unsigned NOT NULL DEFAULT '0',
  `templateId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `r1handled` int(10) unsigned NOT NULL DEFAULT '0',
  `r1delivered` int(10) unsigned NOT NULL DEFAULT '0',
  `r1pending` int(10) unsigned NOT NULL DEFAULT '0',
  `r1error` int(10) unsigned NOT NULL DEFAULT '0',
  `r1nofeedback` int(10) unsigned NOT NULL DEFAULT '0',
  `r2handled` int(10) unsigned NOT NULL DEFAULT '0',
  `r2delivered` int(10) unsigned NOT NULL DEFAULT '0',
  `r2pending` int(10) unsigned NOT NULL DEFAULT '0',
  `r2error` int(10) unsigned NOT NULL DEFAULT '0',
  `r2nofeedback` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `xmon_sms_idx_bySunday` (`groupId`,`sunday`)
) ENGINE=MyISAM AUTO_INCREMENT=50000000 DEFAULT CHARSET=binary;



-- --------------------------- ----------------------------
--
--       A R C H I V E     T A B L E S 
--
-- --------------------------- ----------------------------



-- ----------------------------
-- Table structure for archive_attendees
-- ----------------------------
DROP TABLE IF EXISTS `archive_attendees`;
CREATE TABLE `archive_attendees` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `resourceType` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `resourceId` bigint(20) unsigned NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`,`groupId`),
  KEY `att_idx_bygroup` (`groupId`) USING BTREE,
  KEY `att_idx_byresc` (`resourceId`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_att_visitors
-- ----------------------------
DROP TABLE IF EXISTS `archive_att_visitors`;
CREATE TABLE `archive_att_visitors` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL,
  `resourceType` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `resourceId` bigint(20) unsigned NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `att_visi_arch_idx_byresc` (`resourceId`) USING BTREE,
  KEY `att_visi_arch_idx_bygroup` (`groupId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_chat_participants
-- ----------------------------
DROP TABLE IF EXISTS `archive_chat_participants`;
CREATE TABLE `archive_chat_participants` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cueIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `physseen` int(5) unsigned NOT NULL DEFAULT '0',
  `cueOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_chat_phylacteries
-- ----------------------------
DROP TABLE IF EXISTS `archive_chat_phylacteries`;
CREATE TABLE `archive_chat_phylacteries` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cue` bigint(20) unsigned NOT NULL DEFAULT '0',
  `who` bigint(20) unsigned NOT NULL DEFAULT '0',
  `bla` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_chat_threads
-- ----------------------------
DROP TABLE IF EXISTS `archive_chat_threads`;
CREATE TABLE `archive_chat_threads` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL,
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL,
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletor` varchar(64) NOT NULL,
  `deletorId` bigint(20) unsigned NOT NULL,
  `title` varchar(256) NOT NULL,
  `note` text NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_chat_visirefs
-- ----------------------------
DROP TABLE IF EXISTS `archive_chat_visirefs`;
CREATE TABLE `archive_chat_visirefs` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `visiId` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_connections
-- ----------------------------
DROP TABLE IF EXISTS `archive_connections`;
CREATE TABLE `archive_connections` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL,
  `sessionId` varchar(256) NOT NULL,
  `loginId` bigint(20) unsigned NOT NULL,
  `connKey` bigint(20) unsigned NOT NULL,
  `reloads` bigint(20) NOT NULL,
  `switchTos` bigint(20) NOT NULL,
  `surfer` varchar(256) NOT NULL,
  `account` varchar(256) NOT NULL,
  `agent` varchar(256) NOT NULL,
  `ip` varchar(256) NOT NULL,
  `logintime` bigint(20) NOT NULL,
  `watchdog` bigint(20) NOT NULL,
  `activity` bigint(20) NOT NULL,
  `cnt_q_all` int(8) unsigned NOT NULL,
  `perf_q_acc` int(8) unsigned NOT NULL,
  `perf_q_pk` int(8) unsigned NOT NULL,
  `perf_q_mean` int(8) unsigned NOT NULL,
  `cnt_p_all` int(8) unsigned NOT NULL,
  `perf_p_acc` int(8) unsigned NOT NULL,
  `perf_p_pk` int(8) unsigned NOT NULL,
  `perf_p_mean` int(8) unsigned NOT NULL,
  `cnt_d_all` int(8) unsigned NOT NULL,
  `perf_d_acc` int(8) unsigned NOT NULL,
  `perf_d_pk` int(8) unsigned NOT NULL,
  `perf_d_mean` int(8) unsigned NOT NULL,
  `cnt_q_config` int(8) unsigned NOT NULL,
  `perf_q_config_pk` int(8) unsigned NOT NULL,
  `cnt_q_emerg` int(8) unsigned NOT NULL,
  `perf_q_emerg_pk` int(8) unsigned NOT NULL,
  `cnt_q_gender` int(8) unsigned NOT NULL,
  `perf_q_gender_pk` int(8) unsigned NOT NULL,
  `cnt_q_login` int(8) unsigned NOT NULL,
  `perf_q_login_pk` int(8) unsigned NOT NULL,
  `cnt_q_orphans` int(8) unsigned NOT NULL,
  `perf_q_orphans_pk` int(8) unsigned NOT NULL,
  `cnt_q_plitems` int(8) unsigned NOT NULL,
  `perf_q_plitems_pk` int(8) unsigned NOT NULL,
  `cnt_q_remote` int(8) unsigned NOT NULL,
  `perf_q_remote_pk` int(8) unsigned NOT NULL,
  `cnt_q_search` int(8) unsigned NOT NULL,
  `perf_q_search_pk` int(8) unsigned NOT NULL,
  `cnt_q_stats` int(8) unsigned NOT NULL,
  `perf_q_stats_pk` int(8) unsigned NOT NULL,
  `cnt_q_alphatab` int(8) unsigned NOT NULL,
  `perf_q_alphatab_pk` int(8) unsigned NOT NULL,
  `cnt_q_swap` int(8) unsigned NOT NULL,
  `perf_q_swap_pk` int(8) unsigned NOT NULL,
  `cnt_q_visiapps` int(8) unsigned NOT NULL,
  `perf_q_visiapps_pk` int(8) unsigned NOT NULL,
  `cnt_q_visitors` int(8) unsigned NOT NULL,
  `perf_q_visitors_pk` int(8) unsigned NOT NULL,
  `cnt_p_config` int(8) unsigned NOT NULL,
  `perf_p_config_pk` int(8) unsigned NOT NULL,
  `cnt_p_visitor` int(8) unsigned NOT NULL,
  `perf_p_visitor_pk` int(8) unsigned NOT NULL,
  `cnt_p_resa` int(8) unsigned NOT NULL,
  `perf_p_resa_pk` int(8) unsigned NOT NULL,
  `cnt_p_rsc` int(8) unsigned NOT NULL,
  `perf_p_rsc_pk` int(8) unsigned NOT NULL,
  `cnt_p_schedule` int(8) unsigned NOT NULL,
  `perf_p_schedule_pk` int(8) unsigned NOT NULL,
  `cnt_p_shadow` int(8) unsigned NOT NULL,
  `perf_p_shadow_pk` int(8) unsigned NOT NULL,
  `cnt_p_task` int(8) unsigned NOT NULL,
  `perf_p_task_pk` int(8) unsigned NOT NULL,
  `cnt_p_note` int(8) unsigned NOT NULL,
  `perf_p_note_pk` int(8) unsigned NOT NULL,
  `cnt_p_chat` int(8) unsigned NOT NULL DEFAULT '0',
  `perf_p_chat_pk` int(8) unsigned NOT NULL DEFAULT '0',
  `cnt_p_newacc` int(8) unsigned NOT NULL,
  `perf_p_newacc_pk` int(8) unsigned NOT NULL,
  `cnt_p_login` int(8) unsigned NOT NULL,
  `perf_p_login_pk` int(8) unsigned NOT NULL,
  `cnt_p_huser` int(8) unsigned NOT NULL,
  `perf_p_huser_pk` int(8) unsigned NOT NULL,
  `cnt_p_tboxing` int(8) unsigned NOT NULL,
  `perf_p_tboxing_pk` int(8) unsigned NOT NULL,
  `cnt_p_hourly` int(8) unsigned NOT NULL,
  `perf_p_hourly_pk` int(8) unsigned NOT NULL,
  `cnt_p_gdlns` int(8) unsigned NOT NULL,
  `perf_p_gdlns_pk` int(8) unsigned NOT NULL,
  `cnt_p_smst` int(8) unsigned NOT NULL,
  `perf_p_smst_pk` int(8) unsigned NOT NULL,
  `cnt_p_emlt` int(8) unsigned NOT NULL,
  `perf_p_emlt_pk` int(8) unsigned NOT NULL,
  `cnt_p_details` int(8) unsigned NOT NULL,
  `perf_p_details_pk` int(8) unsigned NOT NULL,
  `cnt_p_ccss` int(8) unsigned NOT NULL,
  `perf_p_ccss_pk` int(8) unsigned NOT NULL,
  `cnt_p_account` int(8) unsigned NOT NULL,
  `perf_p_account_pk` int(8) unsigned NOT NULL,
  `cnt_p_wrkc` int(8) unsigned NOT NULL,
  `perf_p_wrkc_pk` int(8) unsigned NOT NULL,
  `cnt_d_account` int(8) unsigned NOT NULL,
  `perf_d_account_pk` int(8) unsigned NOT NULL,
  `cnt_d_ccss` int(8) unsigned NOT NULL,
  `perf_d_ccss_pk` int(8) unsigned NOT NULL,
  `cnt_d_smst` int(8) unsigned NOT NULL,
  `perf_d_smst_pk` int(8) unsigned NOT NULL,
  `cnt_d_emlt` int(8) unsigned NOT NULL,
  `perf_d_emlt_pk` int(8) unsigned NOT NULL,
  `cnt_d_gdlns` int(8) unsigned NOT NULL,
  `perf_d_gdlns_pk` int(8) unsigned NOT NULL,
  `cnt_d_shadow` int(8) unsigned NOT NULL,
  `perf_d_shadow_pk` int(8) unsigned NOT NULL,
  `cnt_d_huser` int(8) unsigned NOT NULL,
  `perf_d_huser_pk` int(8) unsigned NOT NULL,
  `cnt_d_tboxing` int(8) unsigned NOT NULL,
  `perf_d_tboxing_pk` int(8) unsigned NOT NULL,
  `cnt_d_login` int(8) unsigned NOT NULL,
  `perf_d_login_pk` int(8) unsigned NOT NULL,
  `cnt_d_resa` int(8) unsigned NOT NULL,
  `perf_d_resa_pk` int(8) unsigned NOT NULL,
  `cnt_d_task` int(8) unsigned NOT NULL,
  `perf_d_task_pk` int(8) unsigned NOT NULL,
  `cnt_d_note` int(8) unsigned NOT NULL,
  `perf_d_note_pk` int(8) unsigned NOT NULL,
  `cnt_d_chat` int(8) unsigned NOT NULL DEFAULT '0',
  `perf_d_chat_pk` int(8) unsigned NOT NULL DEFAULT '0',
  `cnt_d_rsc` int(8) unsigned NOT NULL,
  `perf_d_rsc_pk` int(8) unsigned NOT NULL,
  `cnt_d_wrkc` int(8) unsigned NOT NULL,
  `perf_d_wrkc_pk` int(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_note_addressees
-- ----------------------------
DROP TABLE IF EXISTS `archive_note_addressees`;
CREATE TABLE `archive_note_addressees` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `archive_note_addr_idx_byLogin` (`groupId`,`loginId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_note_details
-- ----------------------------
DROP TABLE IF EXISTS `archive_note_details`;
CREATE TABLE `archive_note_details` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `midnIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `midnOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  `title` varchar(256) NOT NULL,
  `note` text NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `arch_note_idx_byCreation` (`created`),
  KEY `arch_note_idx_byChange` (`changed`),
  KEY `arch_note_idx_byDelete` (`deleted`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_note_visirefs
-- ----------------------------
DROP TABLE IF EXISTS `archive_note_visirefs`;
CREATE TABLE `archive_note_visirefs` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL,
  `visiId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_performances
-- ----------------------------
DROP TABLE IF EXISTS `archive_performances`;
CREATE TABLE `archive_performances` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `workCodeId` bigint(20) unsigned NOT NULL,
  `visitorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`,`groupId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_resaparts
-- ----------------------------
DROP TABLE IF EXISTS `archive_resaparts`;
CREATE TABLE `archive_resaparts` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL,
  `cueIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cueOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `attendees_idx_bygroup` (`groupId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_reservations
-- ----------------------------
DROP TABLE IF EXISTS `archive_reservations`;
CREATE TABLE `archive_reservations` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) CHARACTER SET utf8 NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) CHARACTER SET utf8 NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cueIn` bigint(20) unsigned NOT NULL,
  `cueOut` bigint(20) unsigned NOT NULL,
  `peerId` bigint(20) unsigned NOT NULL,
  `layerLevel` tinyint(4) unsigned NOT NULL,
  `iscluster` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `vip` tinyint(3) unsigned NOT NULL,
  `waitingList` tinyint(3) unsigned NOT NULL,
  `note` text CHARACTER SET utf8 NOT NULL,
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `rescheduled` bigint(20) unsigned NOT NULL DEFAULT '0',
  `serieId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `snext` bigint(20) unsigned NOT NULL DEFAULT '0',
  `sprev` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`,`groupId`),
  KEY `resas_idx_bycues` (`groupId`,`cueIn`,`cueOut`),
  KEY `arch_resa_idx_byCreation` (`created`),
  KEY `arch_resa_idx_byChange` (`changed`),
  KEY `arch_resa_idx_byDelete` (`deleted`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_task_assignees
-- ----------------------------
DROP TABLE IF EXISTS `archive_task_assignees`;
CREATE TABLE `archive_task_assignees` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `midnOut` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssPattern` bigint(20) unsigned NOT NULL DEFAULT '0',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `archive_task_ass_idx_byLogin` (`groupId`,`loginId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_task_descriptions
-- ----------------------------
DROP TABLE IF EXISTS `archive_task_descriptions`;
CREATE TABLE `archive_task_descriptions` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `groupId` bigint(20) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `creator` varchar(64) NOT NULL,
  `creatorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changer` varchar(64) NOT NULL,
  `changerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `deleted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletorId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `title` varchar(256) NOT NULL,
  `description` text NOT NULL,
  `midnIn` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssColor` bigint(20) unsigned NOT NULL DEFAULT '0',
  `cssTags` text NOT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`groupId`),
  KEY `arch_task_idx_byCreation` (`created`),
  KEY `arch_task_idx_byChange` (`changed`),
  KEY `arch_task_idx_byDelete` (`deleted`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for archive_task_visirefs
-- ----------------------------
DROP TABLE IF EXISTS `archive_task_visirefs`;
CREATE TABLE `archive_task_visirefs` (
  `id` bigint(20) unsigned NOT NULL,
  `groupId` bigint(20) unsigned NOT NULL,
  `visiId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


SET FOREIGN_KEY_CHECKS=1;
