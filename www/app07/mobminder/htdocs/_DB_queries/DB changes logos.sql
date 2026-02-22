

-- custom css styling on web pages


DROP TABLE IF EXISTS `logos`;
CREATE TABLE `logos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `loginId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `filename` varchar(128) NOT NULL DEFAULT '',
  `note` text NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`groupId`),
  KEY `logos_idx` (`loginId`)
) ENGINE=MyISAM AUTO_INCREMENT=6660000 DEFAULT CHARSET=latin1;



INSERT INTO `logos` VALUES ('6650000', '1800', '0', 'accord sante.jpg', '');
INSERT INTO `logos` VALUES ('6650001', '2801', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650002', '2830', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650003', '2831', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650004', '2912', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650005', '3038', '0', 'ilesdor.jpg', '');
INSERT INTO `logos` VALUES ('6650006', '2922', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650008', '2929', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650009', '2970', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650010', '3032', '0', 'logo.gif', '');

INSERT INTO `logos` VALUES ('6650011', '3042', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650012', '3043', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650013', '3044', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650016', '3045', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650017', '3049', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650018', '3056', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650019', '3065', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650020', '3083', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650021', '3118', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650022', '3130', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650023', '3186', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650024', '3188', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650025', '3191', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650026', '3193', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650027', '3194', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650028', '3232', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650029', '3235', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650030', '3237', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650031', '3242', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650032', '3250', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650033', '3304', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650034', '3321', '0', 'logo.gif', '');
INSERT INTO `logos` VALUES ('6650035', '3326', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650036', '3330', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650037', '3340', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650038', '3354', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650039', '3430', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650040', '3435', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650041', '3441', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650042', '3447', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650043', '3485', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650044', '3562', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650045', '3576', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650046', '3592', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650047', '3598', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650048', '3608', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650049', '3611', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650050', '3617', '0', 'logo.png', '');

INSERT INTO `logos` VALUES ('6650051', '3660', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650052', '3673', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650053', '3673', '11082', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650054', '3673', '11083', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650055', '3673', '11085', 'logo.png', '');

INSERT INTO `logos` VALUES ('6650061', '3769', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650062', '3801', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650063', '3808', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650064', '3829', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650065', '3863', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650066', '3864', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650067', '3872', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650068', '3886', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650069', '3890', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650070', '3893', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650071', '3913', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650072', '3917', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650073', '3927', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650074', '3930', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650075', '3939', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650076', '3943', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650077', '3960', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650078', '3961', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650079', '3961', '12015', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650080', '3961', '12037', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650081', '3961', '12509', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650082', '3961', '12510', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650083', '3968', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650084', '3993', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650085', '4008', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650086', '4022', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650087', '4030', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650088', '4035', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650089', '4043', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650090', '4056', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650091', '4059', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650092', '4068', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650093', '4075', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650094', '4076', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650095', '4077', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650096', '4085', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650097', '4087', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650098', '4095', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650099', '4097', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650100', '4099', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650101', '4102', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650102', '4105', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650103', '4106', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650104', '4110', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650105', '4112', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650106', '4115', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650107', '4117', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650108', '4122', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650109', '4139', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650110', '4142', '0', 'logo.png', '');

INSERT INTO `logos` VALUES ('6650111', '4148', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650112', '4152', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650113', '4171', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650114', '4177', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650115', '4180', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650116', '4181', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650117', '4183', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650118', '4191', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650119', '4205', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650120', '4210', '0', 'logo.jpg', '');

INSERT INTO `logos` VALUES ('6650121', '4235', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650122', '4245', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650123', '4266', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650124', '4294', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650125', '4300', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650126', '4303', '0', 'logo.png', '');
INSERT INTO `logos` VALUES ('6650127', '4306', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650128', '4315', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650129', '4317', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650130', '4330', '0', 'logo.jpg', '');
INSERT INTO `logos` VALUES ('6650131', '4352', '0', 'logo.png', '');



