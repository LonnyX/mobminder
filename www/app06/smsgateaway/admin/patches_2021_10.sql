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

 Date: 19/11/2021 12:55:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for patches_2021_10
-- ----------------------------
DROP TABLE IF EXISTS `patches_2021_10`;
CREATE TABLE `patches_2021_10`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `queueid` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `satelliteid` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `operator` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `n_sup_to` int(8) UNSIGNED NOT NULL DEFAULT 0,
  `n_inf_to` int(8) UNSIGNED NOT NULL DEFAULT 1000,
  PRIMARY KEY (`id`, `queueid`) USING BTREE,
  INDEX `bysatellite`(`satelliteid`) USING BTREE,
  INDEX `byoperator`(`operator`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 6201633 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of patches_2021_10
-- ----------------------------
INSERT INTO `patches_2021_10` VALUES (9012, 600, 1212, '%', 0, 1000);
INSERT INTO `patches_2021_10` VALUES (6070, 999, 1013, 'orange', 0, 1000);
INSERT INTO `patches_2021_10` VALUES (6071, 999, 1014, 'proximus', 0, 1000);
INSERT INTO `patches_2021_10` VALUES (6072, 999, 1015, 'proximus', 0, 1000);
INSERT INTO `patches_2021_10` VALUES (6073, 999, 1016, 'telenet', 0, 1000);
INSERT INTO `patches_2021_10` VALUES (6121416, 612, 1416, 'telenet', 937, 1000);
INSERT INTO `patches_2021_10` VALUES (6121401, 612, 1401, 'telenet', 0, 62);
INSERT INTO `patches_2021_10` VALUES (6121402, 612, 1402, 'telenet', 62, 125);
INSERT INTO `patches_2021_10` VALUES (6121403, 612, 1403, 'telenet', 125, 187);
INSERT INTO `patches_2021_10` VALUES (6121404, 612, 1404, 'telenet', 187, 250);
INSERT INTO `patches_2021_10` VALUES (6121405, 612, 1405, 'telenet', 250, 312);
INSERT INTO `patches_2021_10` VALUES (6121406, 612, 1406, 'telenet', 312, 375);
INSERT INTO `patches_2021_10` VALUES (6121407, 612, 1407, 'telenet', 375, 437);
INSERT INTO `patches_2021_10` VALUES (6121408, 612, 1408, 'telenet', 437, 500);
INSERT INTO `patches_2021_10` VALUES (6121409, 612, 1409, 'telenet', 500, 562);
INSERT INTO `patches_2021_10` VALUES (6121410, 612, 1410, 'telenet', 562, 625);
INSERT INTO `patches_2021_10` VALUES (6121411, 612, 1411, 'telenet', 625, 687);
INSERT INTO `patches_2021_10` VALUES (6121412, 612, 1412, 'telenet', 687, 750);
INSERT INTO `patches_2021_10` VALUES (6121413, 612, 1413, 'telenet', 750, 812);
INSERT INTO `patches_2021_10` VALUES (6121414, 612, 1414, 'telenet', 812, 875);
INSERT INTO `patches_2021_10` VALUES (6121415, 612, 1415, 'telenet', 875, 937);
INSERT INTO `patches_2021_10` VALUES (6201416, 620, 1416, 'telenet', 937, 1000);
INSERT INTO `patches_2021_10` VALUES (6201415, 620, 1415, 'telenet', 875, 937);
INSERT INTO `patches_2021_10` VALUES (6201414, 620, 1414, 'telenet', 812, 875);
INSERT INTO `patches_2021_10` VALUES (6201413, 620, 1413, 'telenet', 750, 812);
INSERT INTO `patches_2021_10` VALUES (6201412, 620, 1412, 'telenet', 687, 750);
INSERT INTO `patches_2021_10` VALUES (6201411, 620, 1411, 'telenet', 625, 687);
INSERT INTO `patches_2021_10` VALUES (6201410, 620, 1410, 'telenet', 562, 625);
INSERT INTO `patches_2021_10` VALUES (6201409, 620, 1409, 'telenet', 500, 562);
INSERT INTO `patches_2021_10` VALUES (6201408, 620, 1408, 'telenet', 437, 500);
INSERT INTO `patches_2021_10` VALUES (6201407, 620, 1407, 'telenet', 375, 437);
INSERT INTO `patches_2021_10` VALUES (6201405, 620, 1405, 'telenet', 250, 312);
INSERT INTO `patches_2021_10` VALUES (6201406, 620, 1406, 'telenet', 312, 375);
INSERT INTO `patches_2021_10` VALUES (6201404, 620, 1404, 'telenet', 187, 250);
INSERT INTO `patches_2021_10` VALUES (6201403, 620, 1403, 'telenet', 125, 187);
INSERT INTO `patches_2021_10` VALUES (6201402, 620, 1402, 'telenet', 62, 125);
INSERT INTO `patches_2021_10` VALUES (6201401, 620, 1401, 'telenet', 0, 62);
INSERT INTO `patches_2021_10` VALUES (6201016, 620, 1016, 'orange', 937, 1000);
INSERT INTO `patches_2021_10` VALUES (6201015, 620, 1015, 'orange', 875, 937);
INSERT INTO `patches_2021_10` VALUES (6201014, 620, 1014, 'orange', 812, 875);
INSERT INTO `patches_2021_10` VALUES (6201013, 620, 1013, 'orange', 750, 812);
INSERT INTO `patches_2021_10` VALUES (6201012, 620, 1012, 'orange', 687, 750);
INSERT INTO `patches_2021_10` VALUES (6201011, 620, 1011, 'orange', 625, 687);
INSERT INTO `patches_2021_10` VALUES (6201007, 620, 1007, 'orange', 375, 437);
INSERT INTO `patches_2021_10` VALUES (6201010, 620, 1010, 'orange', 562, 625);
INSERT INTO `patches_2021_10` VALUES (6121016, 612, 1016, 'orange', 937, 1000);
INSERT INTO `patches_2021_10` VALUES (6121015, 612, 1015, 'orange', 875, 937);
INSERT INTO `patches_2021_10` VALUES (6121014, 612, 1014, 'orange', 812, 875);
INSERT INTO `patches_2021_10` VALUES (6121013, 612, 1013, 'orange', 750, 812);
INSERT INTO `patches_2021_10` VALUES (6121011, 612, 1011, 'orange', 625, 687);
INSERT INTO `patches_2021_10` VALUES (6121012, 612, 1012, 'orange', 687, 750);
INSERT INTO `patches_2021_10` VALUES (6121010, 612, 1010, 'orange', 562, 625);
INSERT INTO `patches_2021_10` VALUES (6121009, 612, 1009, 'orange', 500, 562);
INSERT INTO `patches_2021_10` VALUES (6121008, 612, 1008, 'orange', 437, 500);
INSERT INTO `patches_2021_10` VALUES (6121007, 612, 1007, 'orange', 375, 437);
INSERT INTO `patches_2021_10` VALUES (6121006, 612, 1006, 'orange', 312, 375);
INSERT INTO `patches_2021_10` VALUES (6121005, 612, 1005, 'orange', 250, 312);
INSERT INTO `patches_2021_10` VALUES (6121004, 612, 1004, 'orange', 187, 250);
INSERT INTO `patches_2021_10` VALUES (6121003, 612, 1003, 'orange', 125, 187);
INSERT INTO `patches_2021_10` VALUES (6121002, 612, 1002, 'orange', 62, 125);
INSERT INTO `patches_2021_10` VALUES (6121001, 612, 1001, 'orange', 0, 62);
INSERT INTO `patches_2021_10` VALUES (6121617, 612, 1617, 'proximus', 960, 1000);
INSERT INTO `patches_2021_10` VALUES (6121616, 612, 1616, 'proximus', 920, 960);
INSERT INTO `patches_2021_10` VALUES (6121615, 612, 1615, 'proximus', 880, 920);
INSERT INTO `patches_2021_10` VALUES (6121613, 612, 1613, 'proximus', 800, 840);
INSERT INTO `patches_2021_10` VALUES (6121614, 612, 1614, 'proximus', 840, 880);
INSERT INTO `patches_2021_10` VALUES (6121612, 612, 1612, 'proximus', 760, 800);
INSERT INTO `patches_2021_10` VALUES (6121611, 612, 1611, 'proximus', 720, 760);
INSERT INTO `patches_2021_10` VALUES (6201009, 620, 1009, 'orange', 500, 562);
INSERT INTO `patches_2021_10` VALUES (6201008, 620, 1008, 'orange', 437, 500);
INSERT INTO `patches_2021_10` VALUES (6201006, 620, 1006, 'orange', 312, 375);
INSERT INTO `patches_2021_10` VALUES (6201005, 620, 1005, 'orange', 250, 312);
INSERT INTO `patches_2021_10` VALUES (6201004, 620, 1004, 'orange', 187, 250);
INSERT INTO `patches_2021_10` VALUES (6201003, 620, 1003, 'orange', 125, 187);
INSERT INTO `patches_2021_10` VALUES (6201001, 620, 1001, 'orange', 0, 62);
INSERT INTO `patches_2021_10` VALUES (6201002, 620, 1002, 'orange', 62, 125);
INSERT INTO `patches_2021_10` VALUES (6201617, 620, 1617, 'proximus', 960, 1000);
INSERT INTO `patches_2021_10` VALUES (6201616, 620, 1616, 'proximus', 920, 960);
INSERT INTO `patches_2021_10` VALUES (6201615, 620, 1615, 'proximus', 880, 920);
INSERT INTO `patches_2021_10` VALUES (6201614, 620, 1614, 'proximus', 840, 880);
INSERT INTO `patches_2021_10` VALUES (6201613, 620, 1613, 'proximus', 800, 840);
INSERT INTO `patches_2021_10` VALUES (6201612, 620, 1612, 'proximus', 760, 800);
INSERT INTO `patches_2021_10` VALUES (6201611, 620, 1611, 'proximus', 720, 760);
INSERT INTO `patches_2021_10` VALUES (6201610, 620, 1610, 'proximus', 680, 720);
INSERT INTO `patches_2021_10` VALUES (6201609, 620, 1609, 'proximus', 640, 680);
INSERT INTO `patches_2021_10` VALUES (6201608, 620, 1608, 'proximus', 600, 640);
INSERT INTO `patches_2021_10` VALUES (6201607, 620, 1607, 'proximus', 560, 600);
INSERT INTO `patches_2021_10` VALUES (6201606, 620, 1606, 'proximus', 520, 560);
INSERT INTO `patches_2021_10` VALUES (6201605, 620, 1605, 'proximus', 480, 520);
INSERT INTO `patches_2021_10` VALUES (6201604, 620, 1604, 'proximus', 440, 480);
INSERT INTO `patches_2021_10` VALUES (6201603, 620, 1603, 'proximus', 400, 440);
INSERT INTO `patches_2021_10` VALUES (6201602, 620, 1602, 'proximus', 360, 400);
INSERT INTO `patches_2021_10` VALUES (6201601, 620, 1601, 'proximus', 320, 360);
INSERT INTO `patches_2021_10` VALUES (6201208, 620, 1208, 'proximus', 280, 320);
INSERT INTO `patches_2021_10` VALUES (6201207, 620, 1207, 'proximus', 240, 280);
INSERT INTO `patches_2021_10` VALUES (6201206, 620, 1206, 'proximus', 200, 240);
INSERT INTO `patches_2021_10` VALUES (6201205, 620, 1205, 'proximus', 160, 200);
INSERT INTO `patches_2021_10` VALUES (6121610, 612, 1610, 'proximus', 680, 720);
INSERT INTO `patches_2021_10` VALUES (6121609, 612, 1609, 'proximus', 640, 680);
INSERT INTO `patches_2021_10` VALUES (6121608, 612, 1608, 'proximus', 600, 640);
INSERT INTO `patches_2021_10` VALUES (6121607, 612, 1607, 'proximus', 560, 600);
INSERT INTO `patches_2021_10` VALUES (6121606, 612, 1606, 'proximus', 520, 560);
INSERT INTO `patches_2021_10` VALUES (6121605, 612, 1605, 'proximus', 480, 520);
INSERT INTO `patches_2021_10` VALUES (6121604, 612, 1604, 'proximus', 440, 480);
INSERT INTO `patches_2021_10` VALUES (6121603, 612, 1603, 'proximus', 400, 440);
INSERT INTO `patches_2021_10` VALUES (6121602, 612, 1602, 'proximus', 360, 400);
INSERT INTO `patches_2021_10` VALUES (6121601, 612, 1601, 'proximus', 320, 360);
INSERT INTO `patches_2021_10` VALUES (6121208, 612, 1208, 'proximus', 280, 320);
INSERT INTO `patches_2021_10` VALUES (6121207, 612, 1207, 'proximus', 240, 280);
INSERT INTO `patches_2021_10` VALUES (6121206, 612, 1206, 'proximus', 200, 240);
INSERT INTO `patches_2021_10` VALUES (6121205, 612, 1205, 'proximus', 160, 200);
INSERT INTO `patches_2021_10` VALUES (6121204, 612, 1204, 'proximus', 120, 160);
INSERT INTO `patches_2021_10` VALUES (6121203, 612, 1203, 'proximus', 80, 120);
INSERT INTO `patches_2021_10` VALUES (6121202, 612, 1202, 'proximus', 40, 80);
INSERT INTO `patches_2021_10` VALUES (6121201, 612, 1201, 'proximus', 0, 40);
INSERT INTO `patches_2021_10` VALUES (6201204, 620, 1204, 'proximus', 120, 160);
INSERT INTO `patches_2021_10` VALUES (6201203, 620, 1203, 'proximus', 80, 120);
INSERT INTO `patches_2021_10` VALUES (6201202, 620, 1202, 'proximus', 40, 80);
INSERT INTO `patches_2021_10` VALUES (6201201, 620, 1201, 'proximus', 0, 40);

SET FOREIGN_KEY_CHECKS = 1;
