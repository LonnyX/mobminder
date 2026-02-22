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

 Date: 19/11/2021 12:56:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for queues_2021_10
-- ----------------------------
DROP TABLE IF EXISTS `queues_2021_10`;
CREATE TABLE `queues_2021_10`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parentid` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `countrycode` tinyint(3) UNSIGNED NOT NULL,
  `pushedever` bigint(20) UNSIGNED NOT NULL,
  `pushthishour` bigint(20) UNSIGNED NOT NULL,
  `pushlasthour` bigint(20) UNSIGNED NOT NULL,
  `pushthisday` bigint(20) UNSIGNED NOT NULL,
  `pushyesterday` bigint(20) UNSIGNED NOT NULL,
  `pushthisweek` bigint(20) UNSIGNED NOT NULL,
  `pushlastweek` bigint(20) UNSIGNED NOT NULL,
  `pushthismonth` bigint(20) UNSIGNED NOT NULL,
  `pushlastmonth` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `parentid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1311 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of queues_2021_10
-- ----------------------------
INSERT INTO `queues_2021_10` VALUES (600, 901, 'dev test queue', 32, 37, 0, 0, 0, 0, 0, 1, 1, 0);
INSERT INTO `queues_2021_10` VALUES (612, 900, 'smsmailing', 32, 195039, 0, 0, 0, 0, 0, 0, 2614, 1214);
INSERT INTO `queues_2021_10` VALUES (620, 900, 'cluster2020', 32, 1430099, 471, 717, 3900, 6197, 21925, 31344, 88568, 124978);
INSERT INTO `queues_2021_10` VALUES (999, 902, 'offimed', 32, 7417, 0, 4, 12, 18, 47, 97, 286, 602);

SET FOREIGN_KEY_CHECKS = 1;
