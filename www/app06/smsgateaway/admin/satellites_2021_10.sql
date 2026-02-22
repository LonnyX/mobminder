/*
 Navicat MySQL Data Transfer

 Source Server         : local_dev
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost:3306
 Source Schema         : smsgateaway

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : 65001

 Date: 19/11/2021 12:56:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for satellites_2021_10
-- ----------------------------
DROP TABLE IF EXISTS `satellites_2021_10`;
CREATE TABLE `satellites_2021_10`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `parentid` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `sim` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `iccid` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0000',
  `puk` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0000',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `sat` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `port` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `operator` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `color` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'blue',
  `lag` tinyint(3) UNSIGNED NOT NULL DEFAULT 30,
  `lastseen` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `swversion` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `swsignatr` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `lastcsq` tinyint(2) UNSIGNED NOT NULL DEFAULT 0,
  `lastptmp` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `fetchever` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchthishour` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `thishour404` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchlasthour` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `lasthour404` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchthisday` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `today404` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchyesterday` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchthisweek` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchlastweek` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchthismonth` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `fetchlastmonth` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`, `parentid`) USING BTREE,
  INDEX `idx_smsga_sat_by_iccid`(`iccid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 10000 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of satellites_2021_10
-- ----------------------------
INSERT INTO `satellites_2021_10` VALUES (1000, 900, 0, '0', '37008498', 'S_00', '', '', '', '', 16, '2020-08-03 21:07:02', '20200323', 'v4.01', 1, 20, 46, 7001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1001, 900, 32499500982, '8932029862021146473', '38978984', 'S_01', 'na', 'na', 'orange', 'orange', 30, '2021-10-21 18:43:01', '20200324', 'NA', 1, 20, 50, 105460, 11, 0, 14, 0, 78, 0, 130, 471, 670, 1974, 2596);
INSERT INTO `satellites_2021_10` VALUES (1201, 900, 32473111527, '8932002100372910861', '57743165', 'S_02', 'brillant86.proxi', 'ttyUSB11', 'proximus', 'mediumpurple', 30, '2021-10-20 13:33:26', '0', 'sb.v1.01', 1, 25, 50, 91396, 9, 0, 14, 0, 81, 3, 164, 531, 738, 2122, 2926);
INSERT INTO `satellites_2021_10` VALUES (1202, 900, 32473111646, '8932002100372910879', '66167308', 'S_03', 'brillant86.proxi', 'ttyUSB13', 'proximus', 'mediumpurple', 30, '2021-10-20 13:33:00', '0', 'sb.v1.01', 1, 25, 50, 93244, 9, 0, 19, 0, 101, 0, 156, 543, 730, 2182, 3151);
INSERT INTO `satellites_2021_10` VALUES (1002, 900, 32492264381, '8932026024011553001', '82318538', 'S_04', 'brillant86.orang', 'ttyUSB7', 'orange', 'orange', 30, '2021-10-20 13:32:58', '0', 'sb.v1.00', 1, 19, 51, 100932, 4, 0, 14, 0, 81, 1, 127, 430, 639, 1875, 2687);
INSERT INTO `satellites_2021_10` VALUES (1003, 900, 32492266642, '8932026024011553043', '01088960', 'S_05', 'brillant86.orang', 'ttyUSB5', 'orange', 'orange', 30, '2021-10-20 13:33:22', '0', 'sb.v1.00', 1, 20, 51, 103544, 23, 0, 8, 0, 84, 0, 139, 449, 630, 1861, 2741);
INSERT INTO `satellites_2021_10` VALUES (1203, 900, 32473111715, '8932002100372910895', '21541635', 'S_06', 'brillant86.proxi', 'ttyUSB1', 'proximus', 'mediumpurple', 30, '2021-10-20 13:33:16', '0', 'sb.v1.01', 1, 26, 50, 91098, 14, 0, 27, 1, 106, 2, 165, 543, 736, 2175, 2853);
INSERT INTO `satellites_2021_10` VALUES (1204, 900, 32473111797, '8932002100372910838', '58311530', 'S_07', 'brillant86.proxi', 'ttyUSB3', 'proximus', 'mediumpurple', 30, '2021-10-20 13:33:08', '0', 'sb.v1.01', 1, 24, 50, 92591, 12, 1, 11, 0, 94, 3, 155, 543, 740, 2152, 3107);
INSERT INTO `satellites_2021_10` VALUES (1004, 900, 32492472122, '8932026064010141093', '01698102', 'S_08_g', 'brillant86.orang', 'ttyUSB1', 'orange', 'orange', 30, '2021-10-20 13:33:09', '0', 'sb.v1.00', 1, 22, 51, 100350, 7, 0, 10, 0, 65, 0, 107, 410, 631, 1796, 2711);
INSERT INTO `satellites_2021_10` VALUES (1005, 900, 32495501685, '8932029822021702519', '80600022', 'S_09', 'brillant86.orang', 'ttyUSB0', 'orange', 'orange', 30, '2021-10-20 13:33:18', '0', 'sb.v1.00', 1, 24, 51, 91687, 11, 0, 13, 0, 68, 1, 115, 403, 666, 1826, 2635);
INSERT INTO `satellites_2021_10` VALUES (1205, 900, 32474160746, '8932002100350969616', '22520981', 'S_10', 'brillant86.proxi', 'ttyUSB2', 'proximus', 'mediumpurple', 30, '2021-10-20 13:33:26', '0', 'sb.v1.01', 1, 25, 49, 83768, 11, 0, 17, 0, 89, 3, 162, 506, 764, 2142, 3028);
INSERT INTO `satellites_2021_10` VALUES (1206, 900, 32474167718, '8932002100350969574', '43800001', 'S_11', 'brillant86.proxi', 'ttyUSB4', 'proximus', 'mediumpurple', 30, '2021-10-20 13:32:51', '0', 'sb.v1.01', 1, 23, 50, 82893, 11, 0, 14, 0, 85, 1, 184, 579, 788, 2318, 3182);
INSERT INTO `satellites_2021_10` VALUES (1006, 900, 32492472126, '8932026064010141127', '74362369', 'S_12_g', 'brillant86.orang', 'ttyUSB8', 'orange', 'orange', 30, '2021-10-20 13:33:06', '0', 'sb.v1.00', 1, 18, 52, 91546, 3, 0, 15, 0, 71, 0, 124, 450, 632, 1857, 2653);
INSERT INTO `satellites_2021_10` VALUES (1007, 900, 32499714446, '8932026024011552987', '93170914', 'S_13_g', 'brillant86.orang', 'ttyUSB9', 'orange', 'orange', 30, '2021-10-20 13:33:09', '0', 'sb.v1.00', 1, 18, 51, 90814, 16, 0, 12, 0, 81, 0, 130, 466, 706, 2049, 2861);
INSERT INTO `satellites_2021_10` VALUES (1207, 900, 32470641814, '8932002100362859953', '79108234', 'S_14', 'brillant86.proxi', 'ttyUSB0', 'proximus', 'mediumpurple', 30, '2021-10-20 13:32:51', '0', 'sb.v1.01', 1, 28, 50, 79889, 10, 0, 22, 0, 101, 1, 155, 521, 822, 2263, 3013);
INSERT INTO `satellites_2021_10` VALUES (1208, 900, 32470864844, '8932002100362859961', '79086715', 'S_15', 'brillant86.proxi', 'ttyUSB10', 'proximus', 'mediumpurple', 30, '2021-10-20 13:33:07', '0', 'sb.v1.01', 1, 25, 50, 79601, 9, 0, 20, 1, 91, 1, 172, 556, 789, 2358, 3273);
INSERT INTO `satellites_2021_10` VALUES (1008, 900, 32492472124, '8932026064010141119', '53186766', 'S_16_g', 'brillant86.orang', 'ttyUSB11', 'orange', 'orange', 30, '2021-10-20 13:33:13', '0', 'sb.v1.00', 1, 20, 51, 81309, 10, 0, 20, 0, 90, 0, 141, 479, 647, 1904, 2731);
INSERT INTO `satellites_2021_10` VALUES (1601, 900, 32474731178, '8932002100372427254', '62981580', 'S_22_brnd', 'moha.scarlet', 'ttyUSB10', 'scarlet', 'red', 30, '2021-10-20 13:33:17', '0', 'sb.v1.00', 1, 27, 45, 36469, 4, 0, 12, 0, 54, 0, 97, 374, 542, 1540, 2214);
INSERT INTO `satellites_2021_10` VALUES (1602, 900, 32474731165, '8932002100372427379', '93031109', 'S_20_brnd', 'moha.scarlet', 'ttyUSB12', 'scarlet', 'red', 30, '2021-10-20 13:32:50', '0', 'sb.v1.00', 1, 25, 45, 41016, 5, 0, 14, 1, 61, 1, 149, 421, 585, 1699, 2296);
INSERT INTO `satellites_2021_10` VALUES (1009, 900, 32492245851, '8932029862021148479', '12609526', 'S_17', 'brillant86.orang', 'ttyUSB6', 'orange', 'orange', 30, '2021-10-20 13:33:10', '0', 'sb.v1.00', 1, 20, 51, 51270, 13, 0, 21, 1, 82, 4, 119, 451, 664, 1872, 2678);
INSERT INTO `satellites_2021_10` VALUES (1603, 900, 32476893569, '8932002100380429847', '82455199', 'Sc_Brnrd_08', 'moha.scarlet', 'ttyUSB5', 'scarlet', 'red', 30, '2021-10-20 13:33:06', '0', 'sb.v1.00', 1, 23, 44, 10222, 4, 0, 13, 0, 73, 0, 102, 395, 521, 1572, 2152);
INSERT INTO `satellites_2021_10` VALUES (1604, 900, 32474731174, '8932002100372427288', '35034391', 'S_18_bnrd', 'moha.scarlet', 'ttyUSB13', 'scarlet', 'red', 30, '2021-10-20 13:33:13', '0', 'sb.v1.00', 1, 24, 44, 40979, 7, 0, 11, 0, 58, 2, 105, 342, 535, 1475, 2025);
INSERT INTO `satellites_2021_10` VALUES (1605, 900, 32474731148, '8932002100372427270', '72092986', 'S_19_brnd', 'moha.scarlet', 'ttyUSB14', 'scarlet', 'red', 30, '2021-10-20 13:33:19', '0', 'sb.v1.00', 1, 23, 44, 40064, 12, 0, 10, 0, 71, 0, 96, 354, 511, 1487, 2069);
INSERT INTO `satellites_2021_10` VALUES (1010, 900, 32492266632, '8932026024011553035', '20440713', 'S_21', 'brillant86.orang', 'ttyUSB3', 'orange', 'orange', 30, '2021-10-20 13:33:04', '0', 'sb.v1.00', 1, 21, 51, 47416, 9, 0, 11, 0, 66, 0, 128, 450, 575, 1810, 2489);
INSERT INTO `satellites_2021_10` VALUES (1606, 900, 32477830387, '8932002100372427262', '55108303', 'S_23_brnd', 'moha.scarlet', 'ttyUSB15', 'scarlet', 'red', 30, '2021-10-20 13:33:16', '0', 'sb.v1.00', 1, 26, 44, 35311, 8, 0, 14, 1, 69, 1, 91, 351, 499, 1448, 2051);
INSERT INTO `satellites_2021_10` VALUES (1607, 900, 32474731161, '8932002100372427361', '41174093', 'S_24_brnd', 'moha.scarlet', 'ttyUSB11', 'scarlet', 'red', 30, '2021-10-20 13:33:04', '0', 'sb.v1.00', 1, 26, 45, 35419, 6, 0, 12, 0, 59, 0, 121, 396, 572, 1652, 2155);
INSERT INTO `satellites_2021_10` VALUES (1608, 900, 32474731157, '8932002100372427353', '43361815', 'S_25', 'brillant86.scarl', 'ttyUSB15', 'scarlet', 'red', 30, '2021-10-20 13:32:59', '0', 'sb.v1.01', 1, 30, 48, 41330, 12, 0, 10, 0, 83, 0, 103, 365, 526, 1541, 2354);
INSERT INTO `satellites_2021_10` VALUES (1609, 900, 32474731160, '8932002100372427338', '71134011', 'Sc_Brnrd_03', 'moha.scarlet', 'ttyUSB7', 'scarlet', 'red', 30, '2021-10-20 13:33:09', '0', 'sb.v1.00', 1, 24, 45, 10303, 9, 0, 13, 0, 74, 2, 103, 374, 529, 1549, 2159);
INSERT INTO `satellites_2021_10` VALUES (1011, 900, 32492472125, '8932026064010141135', '70613264', 'S_27_g', 'brillant86.orang', 'ttyUSB2', 'orange', 'orange', 30, '2021-10-20 13:33:07', '0', 'sb.v1.00', 1, 21, 51, 46793, 8, 0, 7, 0, 69, 1, 104, 396, 645, 1855, 2584);
INSERT INTO `satellites_2021_10` VALUES (1012, 900, 32492264384, '8932026024011553019', '18655033', 'S_28', 'brillant86.orang', 'ttyUSB4', 'orange', 'orange', 30, '2021-10-20 13:33:04', '0', 'sb.v1.00', 1, 21, 51, 46860, 10, 0, 17, 0, 81, 1, 135, 472, 675, 1897, 2511);
INSERT INTO `satellites_2021_10` VALUES (1013, 900, 32492264382, '8932026024011552995', '48580248', 'S_29', 'brillant86.orang', 'ttyUSB10', 'orange', 'orange', 30, '2021-10-20 13:32:54', '0', 'sb.v1.00', 1, 19, 51, 37463, 8, 0, 20, 0, 84, 1, 123, 462, 614, 1879, 2548);
INSERT INTO `satellites_2021_10` VALUES (1610, 900, 32474731169, '8932002100372427320', '41351861', 'Sc_Brnrd_01', 'moha.scarlet', 'ttyUSB9', 'scarlet', 'red', 30, '2021-10-20 13:33:16', '0', 'sb.v1.00', 1, 26, 45, 10430, 6, 0, 20, 0, 66, 0, 117, 367, 543, 1588, 2240);
INSERT INTO `satellites_2021_10` VALUES (1611, 900, 32474731152, '8932002100372427304', '98702233', 'Sc_Brnrd_02', 'moha.scarlet', 'ttyUSB8', 'scarlet', 'red', 30, '2021-10-20 13:33:10', '0', 'sb.v1.00', 1, 26, 45, 10549, 7, 0, 12, 0, 61, 0, 115, 374, 559, 1638, 2242);
INSERT INTO `satellites_2021_10` VALUES (9999, 901, 32470180559, '8932002100375339522', '18655033', 'Px_Brnrd_01', 'kroupouk2', 'ttyACM15', 'proximus', 'mediumpurple', 15, '2021-06-15 15:16:24', '0', 'sb.v1.00', 1, 20, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1401, 900, 32486022726, '8932030000123913600', '57188142', 'Ox_10', 'brillant86.base', 'ttyUSB9', 'telenet', 'turquoise', 30, '2021-10-20 13:33:19', '0', 'sb.v1.00', 1, 23, 51, 9766, 9, 0, 10, 0, 57, 0, 101, 358, 515, 1471, 2021);
INSERT INTO `satellites_2021_10` VALUES (1402, 900, 32486314634, '8932030000123913618', '98512102', 'Ox_09', 'brillant86.base', 'ttyUSB11', 'telenet', 'turquoise', 30, '2021-10-20 13:32:58', '0', 'sb.v1.00', 1, 24, 50, 9274, 10, 0, 10, 0, 59, 0, 93, 353, 485, 1376, 1910);
INSERT INTO `satellites_2021_10` VALUES (1403, 900, 32484115519, '8932030000123913683', '00237432', 'Ox_04', 'brillant86.base', 'ttyUSB7', 'telenet', 'turquoise', 30, '2021-10-20 13:33:19', '0', 'sb.v1.00', 1, 23, 51, 9498, 4, 0, 10, 0, 85, 3, 107, 376, 476, 1484, 1946);
INSERT INTO `satellites_2021_10` VALUES (1404, 900, 32489924184, '8932030000123913659', '59972229', 'Ox_05', 'brillant86.base', 'ttyUSB15', 'telenet', 'turquoise', 30, '2021-10-20 13:33:22', '0', 'sb.v1.00', 1, 18, 51, 10039, 10, 1, 9, 0, 70, 1, 99, 392, 532, 1578, 1983);
INSERT INTO `satellites_2021_10` VALUES (1405, 900, 32486047897, '8932030000123913634', '35287746', 'Ox_06', 'brillant86.base', 'ttyUSB13', 'telenet', 'turquoise', 30, '2021-10-20 13:33:14', '0', 'sb.v1.00', 1, 21, 51, 9707, 7, 1, 5, 0, 44, 3, 88, 345, 502, 1423, 1920);
INSERT INTO `satellites_2021_10` VALUES (1406, 900, 32488771956, '8932030000123913642', '38794079', 'Ox_07', 'brillant86.base', 'ttyUSB14', 'telenet', 'turquoise', 30, '2021-10-20 13:32:56', '0', 'sb.v1.00', 1, 22, 50, 10192, 6, 0, 10, 1, 62, 5, 94, 352, 471, 1476, 2029);
INSERT INTO `satellites_2021_10` VALUES (1407, 900, 32486314845, '8932030000123913626', '22584733', 'Ox_08', 'brillant86.base', 'ttyUSB12', 'telenet', 'turquoise', 30, '2021-10-20 13:33:07', '0', 'sb.v1.00', 1, 23, 51, 9583, 12, 0, 16, 0, 86, 2, 94, 375, 494, 1456, 1949);
INSERT INTO `satellites_2021_10` VALUES (1408, 900, 32489827990, '8932030000123913691', '44097869', 'Ox_02', 'brillant86.base', 'ttyUSB8', 'telenet', 'turquoise', 30, '2021-10-20 13:33:06', '0', 'sb.v1.00', 1, 28, 50, 9849, 7, 0, 10, 1, 52, 1, 76, 326, 544, 1476, 1878);
INSERT INTO `satellites_2021_10` VALUES (1409, 900, 32485806449, '8932030000123913675', '37331325', 'Ox_03', 'brillant86.base', 'ttyUSB6', 'telenet', 'turquoise', 30, '2021-10-20 13:33:00', '0', 'sb.v1.00', 1, 23, 51, 10659, 8, 0, 10, 0, 66, 5, 112, 388, 547, 1636, 2060);
INSERT INTO `satellites_2021_10` VALUES (1410, 900, 32489178451, '8932030000123913667', '60224386', 'Ox_01', 'brillant86.base', 'ttyUSB5', 'telenet', 'turquoise', 30, '2021-10-20 13:33:19', '0', 'sb.v1.00', 1, 23, 51, 10435, 10, 0, 9, 0, 70, 3, 118, 396, 533, 1527, 2095);
INSERT INTO `satellites_2021_10` VALUES (1411, 900, 32486997213, '8932030000126574235', '81817507', 'Ox_11', 'brillant86.base', 'ttyUSB4', 'telenet', 'turquoise', 30, '2021-10-20 13:33:07', '0', 'sb.v1.00', 1, 24, 50, 9900, 6, 0, 18, 0, 72, 0, 99, 367, 514, 1474, 2028);
INSERT INTO `satellites_2021_10` VALUES (1412, 900, 32489574321, '8932030000126574243', '43965008', 'Ox_12', 'brillant86.base', 'ttyUSB10', 'telenet', 'turquoise', 30, '2021-10-20 13:33:12', '0', 'sb.v1.00', 1, 25, 51, 9648, 8, 1, 13, 0, 68, 6, 117, 385, 521, 1550, 1907);
INSERT INTO `satellites_2021_10` VALUES (1014, 900, 32, '8932026024011553027', '75768383', 'S_30_g', 'brillant86.orang', 'ttyUSB14', 'orange', 'orange', 30, '2021-10-20 13:33:25', '0', 'sb.v1.00', 1, 20, 51, 10503, 6, 1, 7, 1, 64, 2, 104, 380, 597, 1759, 2540);
INSERT INTO `satellites_2021_10` VALUES (1612, 900, 32476893561, '8932002100380429805', '40472979', 'Sc_Brnrd_04', 'moha.scarlet', 'ttyUSB0', 'scarlet', 'red', 30, '2021-10-20 13:33:04', '0', 'sb.v1.00', 1, 27, 44, 10321, 11, 0, 12, 0, 75, 1, 99, 377, 577, 1662, 2179);
INSERT INTO `satellites_2021_10` VALUES (1613, 900, 32476893576, '8932002100380429813', '69125293', 'Sc_Brnrd_05', 'moha.scarlet', 'ttyUSB1', 'scarlet', 'red', 30, '2021-10-20 13:33:22', '0', 'sb.v1.00', 1, 27, 45, 10503, 7, 0, 9, 1, 73, 2, 108, 372, 579, 1624, 2226);
INSERT INTO `satellites_2021_10` VALUES (1614, 900, 32476893573, '8932002100380429839', '24713507', 'Sc_Brnrd_06', 'moha.scarlet', 'ttyUSB2', 'scarlet', 'red', 30, '2021-10-20 13:33:15', '0', 'sb.v1.00', 1, 25, 44, 10008, 8, 0, 13, 0, 61, 0, 110, 363, 555, 1578, 2121);
INSERT INTO `satellites_2021_10` VALUES (1615, 900, 32476893571, '8932002100380429862', '68172540', 'Sc_Brnrd_07', 'moha.scarlet', 'ttyUSB6', 'scarlet', 'red', 30, '2021-10-20 13:33:15', '0', 'sb.v1.00', 1, 23, 44, 10618, 5, 0, 13, 0, 81, 0, 100, 410, 568, 1669, 2240);
INSERT INTO `satellites_2021_10` VALUES (1616, 900, 32476893570, '8932002100380429854', '42336251', 'Sc_Brnrd_09', 'moha.scarlet', 'ttyUSB3', 'scarlet', 'red', 30, '2021-10-20 13:33:18', '0', 'sb.v1.00', 1, 24, 44, 10359, 11, 0, 22, 0, 77, 1, 98, 399, 573, 1634, 2156);
INSERT INTO `satellites_2021_10` VALUES (1617, 900, 32476893565, '8932002100380429821', '61330355', 'Sc_Brnrd_10', 'moha.scarlet', 'ttyUSB4', 'scarlet', 'red', 30, '2021-10-20 13:33:22', '0', 'sb.v1.00', 1, 22, 44, 11318, 8, 0, 21, 0, 91, 0, 109, 417, 611, 1751, 2442);
INSERT INTO `satellites_2021_10` VALUES (1015, 900, 32, '8932026024011553050', '95093802', 'S_31_g', 'brillant86.orang', 'ttyUSB13', 'orange', 'orange', 30, '2021-10-20 13:33:07', '0', 'sb.v1.00', 1, 11, 51, 11174, 9, 0, 11, 0, 82, 1, 123, 455, 662, 1912, 2625);
INSERT INTO `satellites_2021_10` VALUES (1016, 900, 32, '8932026024011553068', '79520593', 'S_32_g', 'brillant86.orang', 'ttyUSB15', 'orange', 'orange', 30, '2021-10-20 13:33:12', '0', 'sb.v1.00', 1, 21, 51, 11034, 11, 0, 19, 0, 81, 0, 135, 471, 680, 1945, 2647);
INSERT INTO `satellites_2021_10` VALUES (1618, 900, 0, '8932002100399036625', '26495904', 'Sc_Giro_05', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1619, 900, 0, '8932002100399036633', '94068291', 'Sc_Giro_04', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1620, 900, 0, '8932002100399036641', '87810254', 'Sc_Giro_03', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1413, 900, 32486777930, '8932030000129456604', '75273873', 'Ox_13', 'brillant86.base', 'ttyUSB3', 'telenet', 'turquoise', 30, '2021-10-20 13:33:10', '0', 'sb.v1.00', 1, 23, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1414, 900, 32485674821, '8932030000129456554', '61981109', 'Ox_14', 'brillant86.base', 'ttyUSB1', 'telenet', 'turquoise', 30, '2021-10-20 13:33:20', '0', 'sb.v1.00', 1, 27, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1621, 900, 0, '8932002100399036658', '54889438', 'Sc_Giro_02', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1415, 900, 32484292359, '8932030000129456570', '43553529', 'Ox_15', 'brillant86.base', 'ttyUSB2', 'telenet', 'turquoise', 30, '2021-10-20 13:33:26', '0', 'sb.v1.00', 1, 26, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1622, 900, 0, '8932002100399036666', '33495971', 'Sc_Giro_01', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1416, 900, 32483431608, '8932030000129456562', '49177149', 'Ox_16', 'brillant86.base', 'ttyUSB0', 'telenet', 'turquoise', 30, '2021-10-20 13:33:26', '0', 'sb.v1.00', 1, 29, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1623, 900, 0, '8932002100399037565', '33010280', 'Sc_Giro_06', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1624, 900, 0, '8932002100399037557', '20806153', 'Sc_Giro_07', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1625, 900, 0, '8932002100399037540', '94018840', 'Sc_Giro_08', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1626, 900, 0, '8932002100399037532', '61157029', 'Sc_Giro_09', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1627, 900, 0, '8932002100399037524', '22649152', 'Sc_Giro_10', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1628, 900, 0, '8932002100399037516', '21141360', 'Sc_Giro_11', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1629, 900, 0, '8932002100399037508', '58294740', 'Sc_Giro_12', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1630, 900, 0, '8932002100399037490', '38532394', 'Sc_Giro_13', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1631, 900, 0, '8932002100399037482', '93202581', 'Sc_Giro_14', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `satellites_2021_10` VALUES (1632, 900, 0, '8932002100399037474', '63903062', 'Sc_Giro_15', '', '', 'scarlet', 'red', 30, '0000-00-00 00:00:00', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

SET FOREIGN_KEY_CHECKS = 1;
